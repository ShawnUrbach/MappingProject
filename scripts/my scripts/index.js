var election2012;
var election2008;
var all_states;
var chart_data;


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

//Zooms to feature on click
function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

//Insert bar graph using Chart.js
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

//Behavior for mousever and click/ binds labels to Election 2012 layer
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

//Adds layer controls to map
var basemaps = {
	'Election 2008': election2008,
	'Election 2012': election2012,
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
  } else {
    legendtitle.addTo(map);
	legendtitle.onAdd = function (map) {
		var div = L.DomUtil.create('div2', 'info legend2'),
		labels = ['<strong> 2012: % VOTE FOR <BR> DEMOCRATIC CANDIDATE </strong>'];
		div.innerHTML = labels.join('<br>');
		return div;
	};
}});

legendtitle.onAdd = function (map) {
	var div = L.DomUtil.create('div2', 'info legend2'),
	labels = ['<strong> 2012: % VOTE FOR <BR> DEMOCRATIC CANDIDATE </strong>'];
	div.innerHTML = labels.join('<br>');
	return div;
};

//Adds legend to map
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

legend.addTo(map);
legendtitle.addTo(map);

map.fitBounds=(neighborhoods.getBounds());