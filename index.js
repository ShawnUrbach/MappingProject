//-------------------------------------------------VARIABLE DECLARATIONS--------------------------------------------------//


//Variables: GeoJsons
var election2012;
var election2008;
var census2010;
var census2000;
var demo2010;
var demo2000;
var states;

//Variables: Chart Data
var election_data;
var census_data;
var demo_data;

//Variables: Map Elements
var labels;
var map;
var sidebar;
var osm;

//Variables: Legend Elements
var electionLegend;
var censusLegend;
var demoLegend;
var currentLegend;

//Variables: Other
var currentMap;
var currentTable;
var options; //<--Variable for autocomplete search


//-------------------------------------------------FUNCTIONS--------------------------------------------------//


//Style properties for Election 2012/2008
function electionStyle(feature) {
	return {
		fillColor: electionGetColor(feature.properties.PER_DEM), 
		weight: 1,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7
	};
}

//Style properties for Census 2000/2010
function censusStyle(feature) {
	return {
		fillColor: censusGetColor(feature.properties.PER_CHA),
		weight: 1,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7
	};
}

//Style properties for Demographics 2000/2010
function demoStyle(feature) {
	return {
		fillColor: demoGetColor(feature.properties.PER_WHITE),
		weight: 1,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7
	};
}

//Style properties for State Outlines
function statesStyle(feature) {
	return {
		weight: 3,
		opacity: 1,
		color: 'black',
		dashArray: '3',
		fillOpacity: 0.7
	};
}

//Colors for Election 2012/2008
function electionGetColor(w) {
	return w > 80 ? '#104896' :
		w > 60  ? '#2d67b7' :
		w > 55  ? '#4880ce' :
		w > 50  ? '#87b9ff' :
		w > 45   ? '#f7d4d4' :
		w > 40   ? '#ff9696' :
		w > 20   ? '#ff6d6d' :
		w > 0   ? '#ff2b2b' : '#01347c';
}

//Colors for Census 2000/2010
function censusGetColor(w) {
	return w > 30 ? '#b30000' :
		w > 25  ? '#e60000' :
		w > 20  ? '#ff1a1a' :
		w > 15  ? '#ff4d4d' :
		w > 10   ? '#ff8080' :
		w > 5   ? '#ffb3b3' :
		w > 0   ? '#ffe6e6' :
		w > -5   ? '#9999ff' : '#00008B';
}
	
//Colors for Demographics 2000/2010
function demoGetColor(w) {
	return w > 95 ? '#b30000' :
		w > 90  ? '#e60000' :
		w > 85  ? '#ff1a1a' :
		w > 80  ? '#ff4d4d' :
		w > 75   ? '#ff8080' :
		w > 70   ? '#ffb3b3' :
		w > 65   ? '#ffe6e6' :
		w > 60   ? '#9999ff' : '#00008B';
}

//Highlights features on mouseover
function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 4,
		color: 'black',
		dashArray: '',
		fillOpacity: 0.7,
	});

	if (!L.Browser.ie && !L.Browser.opera) {
		layer.bringToFront();
	}
}

//Resets hightlight on mouseout for Election 2008/2012
function resetHighlightElection(e) {
	election2012.resetStyle(e.target);
}

//Resets hightlight on mouseout for Census 2000/2010
function resetHighlightCensus(e) {
	census2010.resetStyle(e.target);
}

//Resets hightlight on mouseout for Demographics 2000/2010
function resetHighlightDemo(e) {
	demo2010.resetStyle(e.target);
}

//Zooms to feature on click
function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

//Insert pie graph using Chart.js for Election 2008/2012
function insertElectionChart(){
	var ctx = document.getElementById("myChart");
		var myChart = new Chart(ctx, {
			type: 'pie',
			data: {
				labels: ['Democrat', 'Republican'],  //X Axis
				datasets: [{
					data: election_data,  //Y Axis
					borderWidth: 1,
					backgroundColor: [
						'blue',
						'red'
					],
				}]
			},
			options: {
				animation: {
					duration: 1000,
					easing: 'easeInExpo',
				},
				maintainAspectRatio: true,
			}
		});	
}

//Insert line graph using Chart.js for Census 2000/2010
function insertCensusChart(){
	var ctx = document.getElementById("myChart");
		var myChart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: labels,  //X Axis
				datasets: [{
					label: "Population Growth",
					data: census_data,  //Y Axis
					borderWidth: 1,
					backgroundColor: [
						'red',
					],
					borderColor: 'red',
					lineTension: 0.1,
					fill: false,
				}]
			},
			options: {
				animation: {
					duration: 500,
					easing: 'easeInExpo',
				},
				maintainAspectRatio: true,
				
			}
		});	
}

//Insert bar graph using Chart.js for Demographics 2000/2010
function insertDemoChart(){
	var ctx = document.getElementById("myChart");
		var myChart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: ['White',['Black or', 'African American'], ['American Indian or', 'Alaska Native'], 'Asian',
				['Native Hawaiian or', 'Other Pacific Islander'], ['Multiracial'], ['Hispanic or', 'Latino']],  //X Axis
				datasets: [{
					label: "Race by Percentage of Total",
					data: demo_data,  //Y Axis
					borderWidth: 1,
					borderColor: 'red',
					lineTension: 0.1,
					fill: false,
				}]
			},
			options: {
				animation: {
					duration: 1000,
					easing: 'easeInExpo',
				},
				maintainAspectRatio: true,
			}
		});	
}

//Behavior for mousever and click- Election layers
function election_onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlightElection,
		click: zoomToFeature
	});
	
	//Binds data with mouseover of objects for Chart.js
	layer.on('click', function (e) {
		document.getElementById('chart_container').innerHTML = '<canvas id="myChart" height="90px" width="100px"></canvas>';
        election_data = [feature.properties.PER_DEM,feature.properties.PER_REP];
		insertElectionChart();
		document.getElementById('sbar-table').innerHTML = feature.properties.COUNTY + ", " + feature.properties.STATE +
		'<span class="sidebar-close"><i class="fa fa-caret-left" title="Click to collapse sidebar"></i></span>';
		document.getElementById('sbar-header').innerHTML = feature.properties.COUNTY + ", " + feature.properties.STATE +
		'<span class="sidebar-close"><i class="fa fa-caret-left" title="Click to collapse sidebar"></i></span>';	
		
		//Binds data to Bootstrap table in sidebar
		document.getElementById('democrat').innerHTML = parseFloat(feature.properties.PER_DEM).toFixed(2) + "%";
		document.getElementById('republican').innerHTML = parseFloat(feature.properties.PER_REP).toFixed(2) + "%";
		document.getElementById('independent').innerHTML = parseFloat(feature.properties.PER_OTH).toFixed(2) + "%";
		document.getElementById('democratTotal').innerHTML = parseInt(feature.properties.TOT_DEM).toLocaleString();
		document.getElementById('republicanTotal').innerHTML = parseInt(feature.properties.TOT_REP).toLocaleString();
		document.getElementById('independentTotal').innerHTML = parseInt(feature.properties.TOT_OTH).toLocaleString();
    });

	//Binds labels
	if (feature.properties) {
		layer.bindTooltip("<b><u class = 'popup_title'><big>" + feature.properties.COUNTY 
		+ ", " + feature.properties.STATE
		+ "</b></u></big><br><div class = 'popup_body'> <b>Democrat:&nbsp;</b>" + Number(feature.properties.PER_DEM).toFixed(2) + "%"
		+ "<br> <b>Republican:&nbsp;</b>" + Number(feature.properties.PER_REP).toFixed(2) + "%</div>"
		, {permanent: false});
	}
}

//Behavior for mousever and click- Census layers
function census_onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlightCensus,
		click: zoomToFeature
	});
	
	//Binds mouseover of objects with data for Chart.js
	layer.on('click', function (e) {
		document.getElementById('chart_container').innerHTML = '<canvas id="myChart" height="90px" width="100px"></canvas>';
        census_data = [Number(feature.properties.TOT_1980),Number(feature.properties.TOT_1990),feature.properties.TOT_CUR];
		if (map.hasLayer(census2000) === true) {
			labels = ['1980','1990','2000'];
			
			//Binds data to Bootstrap table in sidebar
			document.getElementById('census_table').innerHTML = '<table class="table table-hover">' + 
			'<tr><th>2000 Growth:</th><td id="growth_2000"></td></tr>' +
			'<tr><th>2000 Pop:</th><td id="total_pop"></td></tr>' +
			'<tr><th>1990 Pop:</th><td id="pop_1990"></td></tr>' +
			'<tr><th>1980 Pop:</th><td id="pop_1980"></td></tr>' +
			'</table>';
			document.getElementById('total_pop').innerHTML = parseInt(feature.properties.TOT_CUR).toLocaleString();
			document.getElementById('pop_1990').innerHTML = parseInt(feature.properties.TOT_1990).toLocaleString();
			document.getElementById('pop_1980').innerHTML = parseInt(feature.properties.TOT_1980).toLocaleString();	
			document.getElementById('growth_2000').innerHTML = feature.properties.PER_CHA + "%";
		}
		if (map.hasLayer(census2010) === true) {
			census_data = [Number(feature.properties.TOT_1980),Number(feature.properties.TOT_1990),Number(feature.properties.TOT_2000),feature.properties.TOT_CUR];
			labels = ['1980','1990','2000','2010'];
			
			//Binds data to Bootstrap table in sidebar
			document.getElementById('census_table').innerHTML = '<table class="table table-hover">' + 
			'<tr><th>2010 Growth:</th><td id="growth_2010"></td></tr>' +
			'<tr><th>2010 Pop:</th><td id="total_pop"></td></tr>' +
			'<tr><th>2000 Pop:</th><td id="pop_2000"></td></tr>' +
			'<tr><th>1990 Pop:</th><td id="pop_1990"></td></tr>' +
			'<tr><th>1980 Pop:</th><td id="pop_1980"></td></tr>' +
			'</table>';
			document.getElementById('total_pop').innerHTML = parseInt(feature.properties.TOT_CUR).toLocaleString();
			document.getElementById('pop_2000').innerHTML = parseInt(feature.properties.TOT_2000).toLocaleString();
			document.getElementById('pop_1990').innerHTML = parseInt(feature.properties.TOT_1990).toLocaleString();
			document.getElementById('pop_1980').innerHTML = parseInt(feature.properties.TOT_1980).toLocaleString();	
			document.getElementById('growth_2010').innerHTML = feature.properties.PER_CHA + "%";
		}
		insertCensusChart();
		document.getElementById('sbar-table').innerHTML = feature.properties.COUNTY + ", " + feature.properties.STATE +
		'<span class="sidebar-close"><i class="fa fa-caret-left" title="Click to collapse sidebar"></i></span>';
		document.getElementById('sbar-header').innerHTML = feature.properties.COUNTY + ", " + feature.properties.STATE +
		'<span class="sidebar-close"><i class="fa fa-caret-left" title="Click to collapse sidebar"></i></span>';		
    });
	
	//Binds labels
	if (feature.properties) {
		layer.bindTooltip("<b><u class = 'popup_title'><big>" + feature.properties.COUNTY
		+ ", " + feature.properties.STATE
		+ "</b></u></big><div class='popup_body'> <b>Total Population:&nbsp;</b>" + parseInt(feature.properties.TOT_CUR).toLocaleString()
		+ "<br> <b>Growth Over Decade:&nbsp;</b>" + feature.properties.PER_CHA + "%</div>"
		, {permanent: false});
	}
}

//Behavior for mousever and click- Demographic layers
function demo_onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlightDemo,
		click: zoomToFeature
	});
	
	//Binds mouseover of objects with data for Chart.js
	layer.on('click', function (e) {
		document.getElementById('chart_container').innerHTML = '<canvas id="myChart" height="90px" width="100px"></canvas>';
        demo_data = [feature.properties.PER_WHITE,feature.properties.PER_BLACK,feature.properties.PER_NAT,feature.properties.PER_ASIAN,feature.properties.PER_HAW,
		feature.properties.PER_MULTI,feature.properties.PER_LAT];
		insertDemoChart();
		document.getElementById('sbar-table').innerHTML = feature.properties.COUNTY + ", " + feature.properties.STATE +
		'<span class="sidebar-close"><i class="fa fa-caret-left" title="Click to collapse sidebar"></i></span>';
		document.getElementById('sbar-header').innerHTML = feature.properties.COUNTY + ", " + feature.properties.STATE +
		'<span class="sidebar-close"><i class="fa fa-caret-left" title="Click to collapse sidebar"></i></span>';
		
		//Binds data to Bootstrap table in sidebar
		document.getElementById('white').innerHTML = parseFloat(feature.properties.PER_WHITE).toFixed(2) + "%";
		document.getElementById('black').innerHTML = parseFloat(feature.properties.PER_BLACK).toFixed(2) + "%";
		document.getElementById('native').innerHTML = parseFloat(feature.properties.PER_NAT).toFixed(2) + "%";
		document.getElementById('asian').innerHTML = parseFloat(feature.properties.PER_ASIAN).toFixed(2) + "%";
		document.getElementById('pacific').innerHTML = parseFloat(feature.properties.PER_HAW).toFixed(2) + "%";
		document.getElementById('multiracial').innerHTML = parseFloat(feature.properties.PER_MULTI).toFixed(2) + "%";
		document.getElementById('hispanic').innerHTML = parseFloat(feature.properties.PER_LAT).toFixed(2) + "%";
		document.getElementById('whiteTotal').innerHTML = parseInt(feature.properties.TOT_WHITE).toLocaleString();
		document.getElementById('blackTotal').innerHTML = parseInt(feature.properties.TOT_BLACK).toLocaleString();
		document.getElementById('nativeTotal').innerHTML = parseInt(feature.properties.TOT_NAT).toLocaleString();
		document.getElementById('asianTotal').innerHTML = parseInt(feature.properties.TOT_ASIAN).toLocaleString();
		document.getElementById('pacificTotal').innerHTML = parseInt(feature.properties.TOT_HAW).toLocaleString();
		document.getElementById('multiracialTotal').innerHTML = parseInt(feature.properties.TOT_MULTI).toLocaleString();
		document.getElementById('hispanicTotal').innerHTML = parseInt(feature.properties.TOT_LAT).toLocaleString();
    });
	
	//Binds labels
	if (feature.properties) {
		layer.bindTooltip("<b><u class = 'popup_title'><big>" + feature.properties.COUNTY
		+ ", " + feature.properties.STATE
		+ "</b></u></big><div class = 'popup_body'> <b>White:&nbsp;</b>" + feature.properties.PER_WHITE + "%"
		+ "<br> <b>Black or African American:&nbsp;</b>" + feature.properties.PER_BLACK + "%"
		+ "<br> <b>American Indian or Alaska Native:&nbsp;</b>" + feature.properties.PER_NAT + "%"
		+ "<br> <b>Asian:&nbsp;</b>" + feature.properties.PER_ASIAN + "%"
		+ "<br> <b>Native Hawaiin or Other Pacific Islander:&nbsp;</b>" + feature.properties.PER_HAW + "%"
		+ "<br> <b>Multiracial:&nbsp;</b>" + feature.properties.PER_MULTI + "%"
		+ "<br> <b>Hispanic or Latino:&nbsp;</b>" + feature.properties.PER_LAT + "%</div>"
		, {permanent: false});
	}
}

//Collapses sidebar when user clicks header
function collapse_sidebar(id_name){
	document.getElementById(id_name).addEventListener("click", function(){
		document.getElementById("sidebar").className = "sidebar sidebar-left collapsed";	
	});	
}


//-------------------------------------------------MAP LAYERS--------------------------------------------------//


//Loads Leaflet map object
map = L.map('map', {
	center: [39.1,-94.5],
	zoom: 4.5,
	zoomControl: false
});

//Creates custom map pane for states outline
map.createPane('labels');
map.getPane('labels').style.zIndex = 500;
map.getPane('labels').style.pointerEvents = 'none';


//Loads background OpenStreetMap tile layer
osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

//Loads geoJson layers
election2012 =L.geoJson(election2012, {style: electionStyle, onEachFeature: election_onEachFeature}).addTo(map);
election2008 =L.geoJson(election2008, {style: electionStyle, onEachFeature: election_onEachFeature});
census2000 =L.geoJson(census2000, {style: censusStyle, onEachFeature: census_onEachFeature});
census2010 =L.geoJson(census2010, {style: censusStyle, onEachFeature: census_onEachFeature});
demo2010 =L.geoJson(demo2010, {style: demoStyle, onEachFeature: demo_onEachFeature});
demo2000 =L.geoJson(demo2000, {style: demoStyle, onEachFeature: demo_onEachFeature});
states =L.geoJson(states, {style: statesStyle, pane: 'labels'}).addTo(map);


//-------------------------------------------------SIDEBAR--------------------------------------------------//


//Adds sidebar
sidebar = L.control.sidebar('sidebar').addTo(map);

//Collapses sidebar when user clicks header
collapse_sidebar("sbar-header");
collapse_sidebar("sbar-table");


//Map options - toggles legend
document.getElementById('disable_legend').addEventListener("click", function(){
	if (document.getElementById('disable_legend').checked) {
        map.removeControl(currentLegend);
    } 
	else {
        map.addControl(currentLegend);
    }
});

//Map options - toggles Big Map Mode (enlarge map)
document.getElementById('bigMapMode').addEventListener("click", function(){
	if (document.getElementById('bigMapMode').checked) {
		var body = document.getElementsByTagName("body")[0];
		var html = document.getElementsByTagName("html")[0];
		body.style.padding = "0";
		body.style.height = "100%";
		html.style.height = "100%";
		map.invalidateSize();
    } 
	else {
		var body = document.getElementsByTagName("body")[0];
		var html = document.getElementsByTagName("html")[0];
        body.style.padding = "70px 2% 0 2%";
		body.style.height = "94%";
		html.style.height = "94%";
		map.invalidateSize();
    }
});

//Draggable sidebar
$('#sidebar')
	.draggable();
	
$( "#sidebar" ).draggable( "option", "handle", "h1, #info_chart, #table, #settings, #sbar-tabs" );


//-------------------------------------------------MAP ELEMENTS--------------------------------------------------//


//Adds scale to map
L.control.scale().addTo(map);
new L.Control.Zoom({ position: 'topright' }).addTo(map);

//Adds legend to map - Election Layers
electionLegend = L.control({position: 'bottomright'});
electionLegend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'legend'),
		grades = [0, 20, 40, 45, 50, 55, 60, 80],
		labels = [];

	//Loops through density intervals and generate a label with a colored square for each interval
	for (var i = 0; i < grades.length; i++) {
		div.innerHTML +=
			'<i style="background:' + electionGetColor(grades[i] + 0.01) + '"></i> ' +
			(grades[i]) + (grades[i + 1] ? '&ndash;' + (grades[i + 1]) + '%<br>' : '%+');
	}
	return div;
};

//Adds legend to map - Census Layers
censusLegend = L.control({position: 'bottomright'});
censusLegend.onAdd = function (map) {
	var div = L.DomUtil.create('div', 'legend');
	div.innerHTML +=
		'<table id="legendTable" cellspacing="0" style="width:100%"><tr><td class="color" id="colorlegend1"></td><td>30%+</td>' +
		'</tr><tr><td class="color" id="colorlegend2"></td><td>25-30%</td></tr>' +
		'</tr><tr><td class="color" id="colorlegend3"></td><td>20-25%</td></tr>' +
		'</tr><tr><td class="color" id="colorlegend4"></td><td>15-20%</td></tr>' +
		'</tr><tr><td class="color" id="colorlegend5"></td><td>10-15%</td></tr>' +
		'</tr><tr><td class="color" id="colorlegend6"></td><td>5-10%</td></tr>' +
		'</tr><tr><td class="color" id="colorlegend7"></td><td>0-5%</td></tr>' +
		'</tr><tr><td class="color" id="colorlegend8"></td><td>-5-0%</td></tr>' +
		'</tr><tr><td class="color" id="colorlegend9"></td><td><-5%</td></tr>'
	return div;
};

//Adds legend to map - Demographics Layers
demoLegend = L.control({position: 'bottomright'});
demoLegend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'legend'),
		grades = [0, 60, 65, 70, 75, 80, 85, 90, 95],
		labels = [];

	//Loops through density intervals and generate a label with a colored square for each interval
	for (var i = 0; i < grades.length; i++) {
		div.innerHTML +=
			'<i style="background:' + demoGetColor(grades[i] + 0.01) + '"></i> ' +
			(grades[i]) + (grades[i + 1] ? '&ndash;' + (grades[i + 1]) + '%<br>' : '%+');
	}
	return div;
};

//Adds legend
electionLegend.addTo(map);
currentLegend = electionLegend;


//-------------------------------------------------LAYER CONTROLS--------------------------------------------------//


//Layer controls via drop down menu, dynamically change map title, legend, and table type
currentMap = election2012;
currentTable = document.getElementById("election_table");
document.getElementById('mapTitleText').innerHTML = '<center>2012: PERCENT VOTE FOR PRESIDENTIAL DEMOCRATIC CANDIDATE</center>';

document.getElementById('election_08').addEventListener("click", function(){
	//Change layer
	map.addLayer(election2008);
	map.removeLayer(currentMap);
	currentMap = election2008;
	
	//Change title
	document.getElementById('chart_container').innerHTML = '<canvas id="myChart" height="90px" width="100px"></canvas>';
	document.getElementById('mapTitleText').innerHTML = '<center>2008: PERCENT VOTE FOR PRESIDENTIAL DEMOCRATIC CANDIDATE</center>';
	
	//Change legend
	map.removeControl(currentLegend);
    currentLegend = electionLegend;
    electionLegend.addTo(map);
	
	//Change table
	currentTable.style.display = "none";
	currentTable = document.getElementById("election_table");
	currentTable.style.display = "inline";	
});
document.getElementById('election_12').addEventListener("click", function(){
	//Change layer
	map.addLayer(election2012);
	map.removeLayer(currentMap);
	currentMap = election2012;
	
	//Change title
	document.getElementById('chart_container').innerHTML = '<canvas id="myChart" height="90px" width="100px"></canvas>';
	document.getElementById('mapTitleText').innerHTML = '<center>2012: PERCENT VOTE FOR PRESIDENTIAL DEMOCRATIC CANDIDATE</center>';
	
	//Change legend
	map.removeControl(currentLegend);
    currentLegend = electionLegend;
    electionLegend.addTo(map);
	
	//Change table
	currentTable.style.display = "none";
	currentTable = document.getElementById("election_table");
	currentTable.style.display = "inline";
	
});
document.getElementById('census_00').addEventListener("click", function(){
	//Change layer
	map.addLayer(census2000);
	map.removeLayer(currentMap);
	currentMap = census2000;
	
	//Change title
	document.getElementById('chart_container').innerHTML = '<canvas id="myChart" height="90px" width="100px"></canvas>';
	document.getElementById('mapTitleText').innerHTML = '<center>2000: POPULATION GROWTH SINCE 1990 </center>';
	
	//Change legend
	map.removeControl(currentLegend);
    currentLegend = censusLegend;
    censusLegend.addTo(map);
	
	//Change table
	currentTable.style.display = "none";
	currentTable = document.getElementById("census_table");
	currentTable.style.display = "inline";
});
document.getElementById('census_10').addEventListener("click", function(){
	//Change layer
	map.addLayer(census2010);
	map.removeLayer(currentMap);
	currentMap = census2010;
	
	//Change title
	document.getElementById('chart_container').innerHTML = '<canvas id="myChart" height="90px" width="100px"></canvas>';
	document.getElementById('mapTitleText').innerHTML = '<center>2010: POPULATION GROWTH SINCE 2000 </center>';
	
	//Change legend
	map.removeControl(currentLegend);
    currentLegend = censusLegend;
    censusLegend.addTo(map);
	
	//Change table
	currentTable.style.display = "none";
	currentTable = document.getElementById("census_table");
	currentTable.style.display = "inline";
});
document.getElementById('demo_00').addEventListener("click", function(){
	//Change layer
	map.addLayer(demo2000);
	map.removeLayer(currentMap);
	currentMap = demo2000;
	
	//Change title
	document.getElementById('chart_container').innerHTML = '<canvas id="myChart" height="90px" width="100px"></canvas>';
	document.getElementById('mapTitleText').innerHTML = '<center>2000: PERCENT WHITE </center>';
	
	//Change legend
	map.removeControl(currentLegend);
    currentLegend = demoLegend;
    demoLegend.addTo(map);
	
	//Change table
	currentTable.style.display = "none";
	currentTable = document.getElementById("demo_table");
	currentTable.style.display = "inline";
});
document.getElementById('demo_10').addEventListener("click", function(){
	//Change layer
	map.addLayer(demo2010);
	map.removeLayer(currentMap);
	currentMap = demo2010;
	
	//Change title
	document.getElementById('chart_container').innerHTML = '<canvas id="myChart" height="90px" width="100px"></canvas>';
	document.getElementById('mapTitleText').innerHTML = '<center>2010: PERCENT WHITE </center>';
	
	//Change legend
	map.removeControl(currentLegend);
    currentLegend = demoLegend;
    demoLegend.addTo(map);
	
	//Change table
	currentTable.style.display = "none";
	currentTable = document.getElementById("demo_table");
	currentTable.style.display = "inline";
});

//State outline toggle
document.getElementById('state_outlines').addEventListener("click", function(){
	if (map.hasLayer(states) === false) {
		map.addLayer(states);
	}
	else
		map.removeLayer(states);
});

//Base map toggle
document.getElementById('base_map').addEventListener("click", function(){
	if (map.hasLayer(osm) === false) {
		map.addLayer(osm);
	}
	else
		map.removeLayer(osm);
});


//-------------------------------------------------SEARCH BAR--------------------------------------------------//


//Behavior of autocomplete search form
options = {
	data: coordinates,

	getValue: "County",

	list: {
		maxNumberOfElements: 6,
		match: {
			enabled: true
		},
		onChooseEvent: function() {
			var latitude = $("#county_search").getSelectedItemData().Latitude;
			var longitude = $("#county_search").getSelectedItemData().Longitude;
			map.setView([latitude,longitude], 9);

		}
	}
};

//Inserts autocomplete search form
$("#county_search").easyAutocomplete(options);	

