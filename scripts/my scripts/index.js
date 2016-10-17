//Variable declarations
var election2012;
var election2008;
var census2010;
var census2000;
var demo2010;
var demo2000;
var election_data;
var census_data;
var demo_data;
var labels;
var map;

//Loads Leaflet map object
map = L.map('map', {
	center: [39.1,-94.5],
	zoom: 4.5
});

//Style properties for Election 2012/2008
function electionStyle(feature) {
	return {
		fillColor: electionGetColor(feature.properties.PERCENT_DE), 
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
		fillColor: censusGetColor(feature.properties.Pop_Growth),
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
		fillColor: demoGetColor(feature.properties.Race_20117),
		weight: 1,
		opacity: 1,
		color: 'white',
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
		weight: 3,
		color: 'black',
		dashArray: '',
		fillOpacity: 0.7
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
					duration: 3000
				}
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
					duration: 1500
				}
			}
		});	
}

//Insert bar graph using Chart.js for Demographics 2000/2010
function insertDemoChart(){
	var ctx = document.getElementById("myChart");
		var myChart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: ['White','Black or African American', 'American Indian or Alaska Native', 'Asian',
				'Native Hawaiian or Other Pacific Islander', 'Multiracial or Other Race', 'Hispanic or Latino'],  //X Axis
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
					duration: 2000
				}
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
	layer.on('mouseover', function (e) {
        election_data = [feature.properties.PERCENT_DE,feature.properties.PERCENT_RE];
		insertElectionChart();
    });
	
	//Binds labels
	if (feature.properties) {
		layer.bindTooltip("<br><b><big>" + feature.properties.COUNTY 
		+ ", " + feature.properties.STATE
		+ "</br></b></big><br> <b>Democrat:&nbsp;</b>" + Number(feature.properties.PERCENT_DE).toFixed(2)
		+ "</b></big><b>%&nbsp;</b>"
		+ "</br></b></big><br> <b>Republican:&nbsp;</b>" + Number(feature.properties.PERCENT_RE).toFixed(2)
		+ "</b></big><b>%&nbsp;</b>"
		+ " <br><br>", {permanent: false});
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
	layer.on('mouseover', function (e) {
        census_data = [Number(feature.properties.Total_1980),Number(feature.properties.Total_1990),feature.properties.Total_Pop];
		if (map.hasLayer(census2000) === true) {
			labels = ['1980','1990','2000'];
		}
		if (map.hasLayer(census2010) === true) {
			census_data = [Number(feature.properties.Census1980),Number(feature.properties.Census1990),Number(feature.properties.Census2000),feature.properties.Total_Pop];
			labels = ['1980','1990','2000','2010'];
		}
		insertCensusChart();
    });
	
	//Binds labels
	if (feature.properties) {
		layer.bindTooltip("<br><b><big>" + feature.properties.Census20_1
		+ "</br></b></big><br> <b>Total Population:&nbsp;</b>" + feature.properties.Total_Pop
		+ "</br></b></big><br> <b>Growth Over Decade:&nbsp;</b>" + feature.properties.Pop_Growth
		+ "</b></big><b>%&nbsp;</b>"
		+ " <br><br>", {permanent: false});
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
	layer.on('mouseover', function (e) {
        demo_data = [feature.properties.Race_20117,feature.properties.Race_20118,feature.properties.Race_20119,feature.properties.Race_20120,feature.properties.Race_20121,
		(Number(feature.properties.Race_20122) + Number(feature.properties.Race_20123)),feature.properties.Race_20124];
		insertDemoChart();
    });
	
	//Binds labels
	if (feature.properties) {
		layer.bindTooltip("<br><b><big>" + feature.properties.Census20_1
		+ "</br></b></big><br> <b>White:&nbsp;</b>" + feature.properties.Race_20117
		+ "</b></big><b>%&nbsp;</b>"
		+ "</br></b></big><br> <b>Black or African American:&nbsp;</b>" + feature.properties.Race_20118
		+ "</b></big><b>%&nbsp;</b>"
		+ "</br></b></big><br> <b>American Indian or Alaska Native:&nbsp;</b>" + feature.properties.Race_20119
		+ "</b></big><b>%&nbsp;</b>"
		+ "</br></b></big><br> <b>Asian:&nbsp;</b>" + feature.properties.Race_20120
		+ "</b></big><b>%&nbsp;</b>"
		+ "</br></b></big><br> <b>Native Hawaiin or Other Pacific Islander:&nbsp;</b>" + feature.properties.Race_20121
		+ "</b></big><b>%&nbsp;</b>"
		+ "</br></b></big><br> <b>Multiracial or Other Race:&nbsp;</b>" + (Number(feature.properties.Race_20122) + Number(feature.properties.Race_20123)).toFixed(2)
		+ "</b></big><b>%&nbsp;</b>"
		+ "</br></b></big><br> <b>Hispanic or Latino:&nbsp;</b>" + feature.properties.Race_20124
		+ "</b></big><b>%&nbsp;</b>"
		+ " <br><br>", {permanent: false});
	}
}

//Creates custom map pane for states outline
map.createPane('labels');
map.getPane('labels').style.zIndex = 500;
map.getPane('labels').style.pointerEvents = 'none';

// Loads Mapbox API tile layer (states outline)
var MBky = 'pk.eyJ1Ijoic3VyYmFjaDc3IiwiYSI6ImNpdTNhM3N1bzBoMXcydWxod2h2bmY5YmEifQ.Fgtr3TO0di86MEGdQm5eDg'
var mapboxTiles = L.tileLayer('https://api.mapbox.com/styles/v1/surbach77/ciu3lfrhj00c42ipg1f9w4ofj/tiles/256/{z}/{x}/{y}?access_token=' + MBky, {
    attribution: '<a href="https://www.mapbox.com/map-feedback/">Mapbox</a>',
	pane: 'labels'
});

//Loads background OpenStreetMap tile layer
var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

//Loads geoJson layers
var election2012 =L.geoJson(election2012, {style: electionStyle, onEachFeature: election_onEachFeature}).addTo(map);
var election2008 =L.geoJson(election2008, {style: electionStyle, onEachFeature: election_onEachFeature});
var census2000 =L.geoJson(census2000, {style: censusStyle, onEachFeature: census_onEachFeature});
var census2010 =L.geoJson(census2010, {style: censusStyle, onEachFeature: census_onEachFeature});
var demo2010 =L.geoJson(demo2010, {style: demoStyle, onEachFeature: demo_onEachFeature});
var demo2000 =L.geoJson(demo2000, {style: demoStyle, onEachFeature: demo_onEachFeature});

//Adds layer controls to map
var basemaps = {
	'Election 2008': election2008,
	'Election 2012': election2012,
	'Census 2000': census2000,
	'Census 2010': census2010,
	'Demographics 2000': demo2000,
	'Demographics 2010': demo2010,
};

var overlays = {
	'State Outlines': mapboxTiles,
};

L.control.layers(basemaps, overlays).addTo(map);

//Adds scale to map
L.control.scale().addTo(map);

//Adds legend to map - Election Layers
var electionLegend = L.control({position: 'bottomright'});
electionLegend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'legend'),
		grades = [0, 20, 40, 45, 50, 55, 60, 80],
		labels = [];

	//Loops through density intervals and generate a label with a colored square for each interval
	for (var i = 0; i < grades.length; i++) {
		div.innerHTML +=
			'<i style="background:' + electionGetColor(grades[i] + 0.01) + '"></i> ' +
			(grades[i]) + (grades[i + 1] ? '&ndash;' + (grades[i + 1]) + '<br>' : '+');
	}
	return div;
};

//Adds legend to map - Census Layers
var censusLegend = L.control({position: 'bottomright'});
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
var demoLegend = L.control({position: 'bottomright'});
demoLegend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'legend'),
		grades = [0, 60, 65, 70, 75, 80, 85, 90, 95],
		labels = [];

	//Loops through density intervals and generate a label with a colored square for each interval
	for (var i = 0; i < grades.length; i++) {
		div.innerHTML +=
			'<i style="background:' + demoGetColor(grades[i] + 0.01) + '"></i> ' +
			(grades[i]) + (grades[i + 1] ? '&ndash;' + (grades[i + 1]) + '<br>' : '+');
	}
	return div;
};

//Changes legend to match currently loaded map layer
electionLegend.addTo(map);
currentLegend = electionLegend;

map.on('layeradd', function (eventLayer) {
    if ((map.hasLayer(election2008) === true) || (map.hasLayer(election2012) === true)) {
        map.removeControl(currentLegend);
        currentLegend = electionLegend;
        electionLegend.addTo(map);
    }
    else if ((map.hasLayer(census2000) === true) || (map.hasLayer(census2010) === true)) {
        map.removeControl(currentLegend);
        currentLegend = censusLegend;
        censusLegend.addTo(map);
    }
	else if ((map.hasLayer(demo2010) === true) || (map.hasLayer(demo2000) === true)) {
        map.removeControl(currentLegend);
        currentLegend = demoLegend;
        demoLegend.addTo(map);
    }
});

//Dynamically add legend titles to map
document.getElementById('chart').innerHTML = '<center><h2><strong>2012: PERCENT VOTE FOR PRESIDENTIAL DEMOCRATIC CANDIDATE </h2></strong><p>Hover over a county for more information.</p></center>';
map.on('layeradd', function (e) {
  if (map.hasLayer(election2008) === true) {
	document.getElementById('chart').innerHTML = '<center><h2><strong>2008: PERCENT VOTE FOR PRESIDENTIAL DEMOCRATIC CANDIDATE </h2></strong><p>Hover over a county for more information.</p></center>';
  } 
  if (map.hasLayer(election2012) === true) {
	document.getElementById('chart').innerHTML = '<center><h2><strong>2012: PERCENT VOTE FOR PRESIDENTIAL DEMOCRATIC CANDIDATE </h2></strong><p>Hover over a county for more information.</p></center>';
  } 
  if (map.hasLayer(census2000) === true) {
	document.getElementById('chart').innerHTML = '<center><h2><strong>2000: POPULATION GROWTH SINCE 1990 </h2></strong><p>Hover over a county for more information.</p></center>';
  } 
  if (map.hasLayer(census2010) === true) {
	document.getElementById('chart').innerHTML = '<center><h2><strong>2010: POPULATION GROWTH SINCE 2000 </h2></strong><p>Hover over a county for more information.</p></center>';
  } 
  if (map.hasLayer(demo2000) === true) {
	document.getElementById('chart').innerHTML = '<center><h2><strong>2000: PERCENT WHITE </h2></strong><p>Hover over a county for more information.</p></center>';
  } 
  if (map.hasLayer(demo2010) === true) {
	document.getElementById('chart').innerHTML = '<center><h2><strong>2010: PERCENT WHITE </h2></strong><p>Hover over a county for more information.</p></center>';
  } 
});
