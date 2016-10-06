var election2012;
var election2008;
var census2010;
var census2000;
var all_states;
var chart_data;
var chart_data2;


//Style properties for Election 2012/2008
function electionStyle(feature) {
	return {
		fillColor: getColor(feature.properties.PERCENT_DE),
		weight: 2,
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
		weight: 2,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7
	};
}

//Style properties for state outline layer
function outlineStyle(feature) {
	return {
		weight: 2,
		opacity: 1,
		color: 'black',
		dashArray: '0',
		fillOpacity: 0
	};
}

//Colors for Election 2012/2008
function getColor(w) {
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

//Resets hightlight on mouseout
function resetHighlightElection(e) {
	election2012.resetStyle(e.target);
}

//Resets hightlight on mouseout
function resetHighlightCensus(e) {
	census2010.resetStyle(e.target);
}

//Zooms to feature on click
function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

//Insert pie graph using Chart.js
function insertChart(){
	var ctx = document.getElementById("myChart");
		var myChart = new Chart(ctx, {
			type: 'pie',
			data: {
				labels: ['Democrat', 'Republican'],  //X Axis
				datasets: [{
					data: chart_data,  //Y Axis
					borderWidth: 1,
					backgroundColor: [
						'blue',
						'red'
					],
				}]
			},
			options: {
			}
		});	
}

//Insert line graph using Chart.js
function insertLineChart(){
	var ctx = document.getElementById("myChart");
		var myChart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: ['1990','2000'],  //X Axis
				datasets: [{
					label: "Population Growth",
					data: chart_data2,  //Y Axis
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
			}
		});	
}

//Behavior for mousever and click- Election 2012 layer
function election12_onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlightElection,
		click: zoomToFeature
	});
	
	//Binds data with mouseover of objects for Chart.js
	layer.on('mouseover', function (e) {
        chart_data = [feature.properties.PERCENT_DE,feature.properties.PCT_ROM];
		insertChart();
    });

	//Binds labels to Election 2012 layer
	if (feature.properties) {
		layer.bindTooltip("<br><b><big>" + feature.properties.COUNTY 
		+ ' County' + ", " + feature.properties.STATE
		+ "</br></b></big><br> <b>Obama:&nbsp;</b>" + feature.properties.PERCENT_DE.toFixed(2)
		+ "</b></big><b>%&nbsp;</b>"
		+ "</br></b></big><br> <b>Romney:&nbsp;</b>" + feature.properties.PCT_ROM.toFixed(2)
		+ "</b></big><b>%&nbsp;</b>"
		+ " <br><br>", {permanent: false});
	}
}

//Behavior for mousever and click- Election 2008 layer
function election08_onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlightElection,
		click: zoomToFeature
	});
	
	//Binds data with mouseover of objects for Chart.js
	layer.on('mouseover', function (e) {
        chart_data = [feature.properties.PERCENT_DE,feature.properties.PERCENT_RE];
		insertChart();
    });
	
	//Binds labels to Election 2008 layer
	if (feature.properties) {
		layer.bindTooltip("<br><b><big>" + feature.properties.COUNTY 
		+ ", " + feature.properties.STATE
		+ "</br></b></big><br> <b>Obama:&nbsp;</b>" + feature.properties.PERCENT_DE
		+ "</b></big><b>%&nbsp;</b>"
		+ "</br></b></big><br> <b>McCain:&nbsp;</b>" + feature.properties.PERCENT_RE
		+ "</b></big><b>%&nbsp;</b>"
		+ " <br><br>", {permanent: false});
	}
}

//Behavior for mousever and click- Census 2000 layer
function census2000_onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlightCensus,
		click: zoomToFeature
	});
	
	//Binds data with mouseover of objects for Chart.js
	layer.on('mouseover', function (e) {
        chart_data2 = [feature.properties.Total_1990,feature.properties.Total_Pop];
		insertLineChart();
    });
	
	//Binds labels to Election 2000 layer
	if (feature.properties) {
		layer.bindTooltip("<br><b><big>" + feature.properties.Census20_1
		+ "</br></b></big><br> <b>Total Population:&nbsp;</b>" + feature.properties.Total_Pop
		+ "</br></b></big><br> <b>Growth Since 1990:&nbsp;</b>" + feature.properties.Pop_Growth
		+ "</b></big><b>%&nbsp;</b>"
		+ " <br><br>", {permanent: false});
	}
}

//Behavior for mousever and click- Census 2010 layer
function census2010_onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlightCensus,
		click: zoomToFeature
	});
	
	//Binds data with mouseover of objects for Chart.js
	layer.on('mouseover', function (e) {
        chart_data2 = [Number(feature.properties.Census2000),feature.properties.Total_Pop];
		insertLineChart();
    });
	
	//Binds labels to Election 2010 layer
	if (feature.properties) {
		layer.bindTooltip("<br><b><big>" + feature.properties.Census20_1
		+ "</br></b></big><br> <b>Total Population:&nbsp;</b>" + feature.properties.Total_Pop
		+ "</br></b></big><br> <b>Growth Since 2000:&nbsp;</b>" + feature.properties.Pop_Growth
		+ "</b></big><b>%&nbsp;</b>"
		+ " <br><br>", {permanent: false});
	}
}

//Loads Leaflet map object
var map = L.map('map', {
	center: [39.1,-94.5],
	zoom: 4.5
});

//Creates custom map pane for state outline layer
map.createPane('labels');
map.getPane('labels').style.zIndex = 700;
map.getPane('labels').style.pointerEvents = 'none';

//Loads background tiles for Leaflet
var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);
			
//Loads geoJson layers
var all_states =L.geoJson(all_states, {style: outlineStyle, pane: 'labels'});
var election2012 =L.geoJson(election2012, {style: electionStyle, onEachFeature: election12_onEachFeature}).addTo(map);
var election2008 =L.geoJson(election2008, {style: electionStyle, onEachFeature: election08_onEachFeature});
var census2000 =L.geoJson(census2000, {style: censusStyle, onEachFeature: census2000_onEachFeature});
var census2010 =L.geoJson(census2010, {style: censusStyle, onEachFeature: census2010_onEachFeature});


//Adds layer controls to map
var basemaps = {
	'Election 2008': election2008,
	'Election 2012': election2012,
	'Census 2000': census2000,
	'Census 2010': census2010,
};

var overlays = {
	'State Outlines': all_states,
};

L.control.layers(basemaps, overlays).addTo(map);

//Adds scale to map
L.control.scale().addTo(map);

//Adds legend title to map
var legendtitle = L.control({position: 'bottomright'});

map.on('layeradd', function (e) {
  if (map.hasLayer(election2008) === true) {
	legendtitle.addTo(map);
	legendtitle.onAdd = function (map) {
		var div = L.DomUtil.create('div2', 'info legend2'),
		labels = ['<strong> 2008: % VOTE FOR <BR> DEMOCRATIC CANDIDATE </strong>'];
		div.innerHTML = labels.join('<br>');
		return div;
	};
  } 
  if (map.hasLayer(election2012) === true) {
    legendtitle.addTo(map);
	legendtitle.onAdd = function (map) {
		var div = L.DomUtil.create('div2', 'info legend2'),
		labels = ['<strong> 2012: % VOTE FOR <BR> DEMOCRATIC CANDIDATE </strong>'];
		div.innerHTML = labels.join('<br>');
		return div;
	};
  }
  if (map.hasLayer(census2000) === true) {
    legendtitle.addTo(map);
	legendtitle.onAdd = function (map) {
		var div = L.DomUtil.create('div2', 'info legend2'),
		labels = ['<strong> 2000: POPULATION <BR> GROWTH SINCE 1990 </strong>'];
		div.innerHTML = labels.join('<br>');
		return div;
	};
  }
  if (map.hasLayer(census2010) === true) {
    legendtitle.addTo(map);
	legendtitle.onAdd = function (map) {
		var div = L.DomUtil.create('div2', 'info legend2'),
		labels = ['<strong> 2010: POPULATION <BR> GROWTH SINCE 2000 </strong>'];
		div.innerHTML = labels.join('<br>');
		return div;
	};
  }
});

legendtitle.onAdd = function (map) {
	var div = L.DomUtil.create('div2', 'info legend2'),
	labels = ['<strong> 2012: % VOTE FOR <BR> DEMOCRATIC CANDIDATE </strong>'];
	div.innerHTML = labels.join('<br>');
	return div;
};

legendtitle.addTo(map);

//Adds legend to map - Election Layers
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend'),
		grades = [0, 20, 40, 45, 50, 55, 60, 80],
		labels = [];

	//Loops through  density intervals and generate a label with a colored square for each interval
	for (var i = 0; i < grades.length; i++) {
		div.innerHTML +=
			'<i style="background:' + getColor(grades[i] + 0.01) + '"></i> ' +
			(grades[i]) + (grades[i + 1] ? '&ndash;' + (grades[i + 1]) + '<br>' : '+');
	}
	return div;
};

//Adds legend to map - Census Layers
var legend2 = L.control({position: 'bottomright'});
legend2.onAdd = function (map) {
	var div = L.DomUtil.create('div', 'info legend');
	div.innerHTML +=
		'<table id="legendTable" cellspacing="0" style="width:100%"><tr><td class="color" id="colorlegend1"></td><td class="legendLabel" id="legend10text">30%+</td>' +
		'</tr><tr><td class="color" id="colorlegend2"></td><td class="legendLabel" id="legend9text">25-30%</td></tr>' +
		'</tr><tr><td class="color" id="colorlegend3"></td><td class="legendLabel" id="legend9text">20-25%</td></tr>' +
		'</tr><tr><td class="color" id="colorlegend4"></td><td class="legendLabel" id="legend9text">15-20%</td></tr>' +
		'</tr><tr><td class="color" id="colorlegend5"></td><td class="legendLabel" id="legend9text">10-15%</td></tr>' +
		'</tr><tr><td class="color" id="colorlegend6"></td><td class="legendLabel" id="legend9text">5-10%</td></tr>' +
		'</tr><tr><td class="color" id="colorlegend7"></td><td class="legendLabel" id="legend9text">0-5%</td></tr>' +
		'</tr><tr><td class="color" id="colorlegend8"></td><td class="legendLabel" id="legend9text">-5-0%</td></tr>' +
		'</tr><tr><td class="color" id="colorlegend9"></td><td class="legendLabel" id="legend9text"><-5%</td></tr>'
	return div;
};

legend.addTo(map);
currentLegend = legend;

map.on('layeradd', function (eventLayer) {
    if ((map.hasLayer(election2008) === true) || (map.hasLayer(election2012) === true)) {
        map.removeControl(currentLegend );
        currentLegend = legend;
        legend.addTo(map);
    }
    else if ((map.hasLayer(census2000) === true) || (map.hasLayer(census2010) === true)) {
        map.removeControl(currentLegend );
        currentLegend = legend2;
        legend2.addTo(map);
    }
  })
  

map.fitBounds=(neighborhoods.getBounds());