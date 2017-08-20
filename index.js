//-------------------------------------------------VARIABLE DECLARATIONS--------------------------------------------------//


//Variables: GeoJsons
var new2010;
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
var currentMap = 'election2016';
var currentTable;
var options; //<--Variable for autocomplete search

//Variables: Election Data
var demTot = 0;
var repTot = 0;
var othTot = 0;
var demTot2 = 0;
var repTot2 = 0;
var othTot2 = 0;
var demTot3 = 0;
var repTot3 = 0;
var othTot3 = 0;

//Variables: Census Data
var totalPop = 0;
var pop2010Tot = 0;
var pop2000Tot = 0;
var pop1990Tot = 0;
var pop1980Tot = 0;

//Variables: Demographics Data
var whiteTot = 0;
var blackTot = 0;
var nativeTot = 0;
var asianTot = 0;
var pacificTot = 0;
var multiracialTot = 0;
var hispanicTot = 0;
var whiteTot2000 = 0;
var blackTot2000 = 0;
var nativeTot2000 = 0;
var asianTot2000 = 0;
var pacificTot2000 = 0;
var multiracialTot2000 = 0;
var hispanicTot2000 = 0;
		
//Variables: Selections		
var selectMode = false;
var selectList = [];
var selected = false;

var ethnicGroup;


//-------------------------------------------------FUNCTIONS--------------------------------------------------//


//Activate CSS tooltips
$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();   
});





function defaultStyle(feature) {
	
	function elections(dem, rep, oth){
		var total = dem+rep+oth;
		var percentDem = (dem/total)*100;
		var percentRep = (rep/total)*100;
		return percentDem-percentRep;	
	}

	function popchange(year2, year1){
		return ((year2-year1)/year1)*100
	}
	
	function demos(pop, whi){
		var total = pop;
		var white = whi;
		var percentWhite = (whi/total)*100;
		return percentWhite;	
	}
	
	
	function findLayer(){
		if (currentMap == 'election2016'){
			return GetColor(elections(feature.properties.DEM2016, feature.properties.REP2016, feature.properties.OTH2016));
		}
		if (currentMap == 'election2012'){
			return GetColor(elections(feature.properties.DEM2012, feature.properties.REP2012, feature.properties.OTH2012));
		}
		if (currentMap == 'election2008'){
			return GetColor(elections(feature.properties.DEM2008, feature.properties.REP2008, feature.properties.OTH2008));
		}
		if (currentMap == 'census2010'){
			return GetColor2(popchange(feature.properties.POP2010, feature.properties.POP2000));
		}
		if (currentMap == 'census2000'){
			return GetColor2(popchange(feature.properties.POP2000, feature.properties.POP1990));
		}
		if (currentMap == 'demo2010'){
			return GetColor3(demos(feature.properties.POP2010, feature.properties.WHI2010));
		}
		if (currentMap == 'demo2000'){
			return GetColor3(demos(feature.properties.POP2000, feature.properties.WHI2000));
		}
	}
	
	return {
		fillColor: findLayer(), 
		weight: 1,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7
	};
}

function GetColor(w) {
	return w > 30 ? '#104896' :
		w > 20  ? '#2d67b7' :
		w > 10  ? '#4880ce' :
		w > 0  ? '#87b9ff' :
		w > -10   ? '#f7d4d4' :
		w > -20   ? '#ff9696' :
		w > -30   ? '#ff6d6d' :
		w > -100   ? '#ff2b2b' : '#01347c';	
}

function GetColor2(w) {
	return w > 30 ? '#b30000' :
		w > 25  ? '#e60000' :
		w > 20  ? '#ff1a1a' :
		w > 15  ? '#ff4d4d' :
		w > 10   ? '#ff8080' :
		w > 5   ? '#ffb3b3' :
		w > 0   ? '#ffe6e6' :
		w > -5   ? '#9999ff' : '#00008B';
}

function GetColor3(w) {
	return w > 95 ? '#b30000' :
		w > 90  ? '#e60000' :
		w > 85  ? '#ff1a1a' :
		w > 80  ? '#ff4d4d' :
		w > 75   ? '#ff8080' :
		w > 70   ? '#ffb3b3' :
		w > 65   ? '#ffe6e6' :
		w > 60   ? '#9999ff' : '#00008B';
}






//Style properties for Election 2012/2008
function electionStyle(feature) {
	return {
		fillColor: electionGetColor(feature.properties.DIF), 
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
	return w > 30 ? '#104896' :
		w > 20  ? '#2d67b7' :
		w > 10  ? '#4880ce' :
		w > 0  ? '#87b9ff' :
		w > -10   ? '#f7d4d4' :
		w > -20   ? '#ff9696' :
		w > -30   ? '#ff6d6d' :
		w > -100   ? '#ff2b2b' : '#01347c';	
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
	if (selectMode == false){
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
}

//Resets highlight on mouseout
function resetHighlight(e) {
	if (selectMode == false){
		counties2010.resetStyle(e.target);
	}
}

//Resets highlight on right click if already highlighted
function resetHighlightContext(e) {
	if (selectMode == true){
		var layer = e.target;
		if (layer.options.weight == 4){
			selected = true;
			counties2010.resetStyle(e.target);
		} else {
			selected = false;
		}
	}
}

//Zooms to feature on click if not selectMode, otherwise style on click.
function zoomToFeature(e) {
	if (selectMode == false){
		map.fitBounds(e.target.getBounds());
	}
	var layer = e.target;
	if (layer.options.weight == 4){
		selected = true;
	} else {
		selected = false;
	}
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

//Insert pie graph using Chart.js for Election 2008/2012
function insertElectionChart(newChart, year){
	var ctx = document.getElementById(newChart);
		var myChart = new Chart(ctx, {
			type: 'pie',
			data: {
				labels: ['Democrat', 'Republican', 'Other'],  //X Axis
				datasets: [{
					data: election_data,  //Y Axis
					borderWidth: 1,
					backgroundColor: [
						'blue',
						'red',
						'yellow'
					],
				}]
			},
			options: {
				animation: {
					duration: 500,
					easing: 'easeInExpo',
				},
				maintainAspectRatio: true,
				tooltips: {
					callbacks: {
						label: function(tooltipItem, data) {
							var value = data.datasets[0].data[tooltipItem.index];
							var label = data.labels[tooltipItem.index];
							var percentage = (value).toFixed(2);
							return label + ' ' + percentage + '%';
						}
					}
				},
				title: {
					display: true,
					text: year
				}
			}
		});	
	

}


//Insert line graph using Chart.js for Census 2000/2010
function insertCensusChart(){
	var ctx = document.getElementById("myChart5");
		var myChart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: ['1980', '1990', '2000', '2010'],  //X Axis
				datasets: [{
					label: "Population Growth",
					data: census_data,  //Y Axis
					borderWidth: 1,
					backgroundColor: 'red',
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
				tooltips: {
					callbacks: {
						label: function(tooltipItem, data) {
							var value = data.datasets[0].data[tooltipItem.index];
							var label = data.labels[tooltipItem.index];
							return 'Pop: '+ value.toLocaleString();
						}
					}
				},
			}
		});	
}

//Changes Demographics 2000/2010 layer labels for smaller screen sizes
if ($(window).width() > 700) {
	var demolabels = ['White',['Black or', 'African American'], ['American Indian or', 'Alaska Native'], 'Asian',
	['Native Hawaiian or', 'Other Pacific Islander'], ['Multiracial'], ['Hispanic or', 'Latino']];
}
else {
	var demolabels = ['White',['Black'], ['Nat. Am/Nat. AK.'], 'Asian',
	['Nat. HI/Pac-Isl'], ['Multiracial'], ['Hisp/Lat']];
}

//Insert bar graph using Chart.js for Demographics 2000/2010
function insertDemoChart(newChart,year){
	var ctx = document.getElementById(newChart);
		var myChart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: demolabels,  //X Axis
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
				tooltips: {
					callbacks: {
						label: function(tooltipItem, data) {
							var value = data.datasets[0].data[tooltipItem.index];
							var label = data.labels[tooltipItem.index];
							var percentage = (value).toFixed(2);
							return percentage + '%';
						}
					}
				},
				title: {
					display: true,
					text: year
				}
			}
		});	
}

//Behavior for mousever and click
function onEachFeature(feature, layer) {
	
	//Behavior for Election Features
	function Election_onEachFeature(){
		
		var total = feature.properties.DEM2016+feature.properties.REP2016+feature.properties.OTH2016;
		var percentDem = (feature.properties.DEM2016/total)*100;
		var percentRep = (feature.properties.REP2016/total)*100;
		var percentOth = (feature.properties.OTH2016/total)*100;
		
		var total2 = feature.properties.DEM2012 + feature.properties.REP2012 + feature.properties.OTH2012;
		var percentDem2 = (feature.properties.DEM2012/total2)*100;
		var percentRep2 = (feature.properties.REP2012/total2)*100;
		var percentOth2 = (feature.properties.OTH2012/total2)*100;
		
		var total3 = feature.properties.DEM2008 + feature.properties.REP2008 + feature.properties.OTH2008;
		var percentDem3 = (feature.properties.DEM2008/total3)*100;
		var percentRep3 = (feature.properties.REP2008/total3)*100;
		var percentOth3 = (feature.properties.OTH2008/total3)*100;
		
		var demPer;
		var repPer;
		var othPer;
		var demPer2;
		var repPer2;
		var othPer2;
		var demPer3;
		var repPer3;
		var othPer3;

		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature,
			contextmenu: resetHighlightContext
		});
		
		//Binds Table Data
		function bindElectionTable(){
			document.getElementById('democrat').innerHTML = parseFloat(demPer).toFixed(2) + "%";
			document.getElementById('republican').innerHTML = parseFloat(repPer).toFixed(2) + "%";
			document.getElementById('independent').innerHTML = parseFloat(othPer).toFixed(2) + "%";
			document.getElementById('democratTotal').innerHTML = parseInt(demTot).toLocaleString();
			document.getElementById('republicanTotal').innerHTML = parseInt(repTot).toLocaleString();
			document.getElementById('independentTotal').innerHTML = parseInt(othTot).toLocaleString();
			document.getElementById('democrat2').innerHTML = parseFloat(demPer2).toFixed(2) + "%";
			document.getElementById('republican2').innerHTML = parseFloat(repPer2).toFixed(2) + "%";
			document.getElementById('independent2').innerHTML = parseFloat(othPer2).toFixed(2) + "%";
			document.getElementById('democratTotal2').innerHTML = parseInt(demTot2).toLocaleString();
			document.getElementById('republicanTotal2').innerHTML = parseInt(repTot2).toLocaleString();
			document.getElementById('independentTotal2').innerHTML = parseInt(othTot2).toLocaleString();
			document.getElementById('democrat3').innerHTML = parseFloat(demPer3).toFixed(2) + "%";
			document.getElementById('republican3').innerHTML = parseFloat(repPer3).toFixed(2) + "%";
			document.getElementById('independent3').innerHTML = parseFloat(othPer3).toFixed(2) + "%";
			document.getElementById('democratTotal3').innerHTML = parseInt(demTot3).toLocaleString();
			document.getElementById('republicanTotal3').innerHTML = parseInt(repTot3).toLocaleString();
			document.getElementById('independentTotal3').innerHTML = parseInt(othTot3).toLocaleString();			
		}
		
		//Binds Chart Data
		function bindElectionChart(){
			document.getElementById('chart_container').innerHTML = '<br><br><br><br><canvas id="myChart" height="90px" width="100px"></canvas><br><canvas id="myChart2" height="90px" width="100px"></canvas>'+
			'<br><canvas id="myChart3" height="90px" width="100px"></canvas>';
			document.getElementById('sbar-header').innerHTML = 'Selected Counties' +
			'<span class="dropdown" id="mapChooser"></span>';
			document.getElementById('mapChooser').innerHTML = '&nbsp;&nbsp;<button class="btn btn-primary dropdown-toggle" id="testbutton" type="button" data-toggle="dropdown"><i class="fa fa-bar-chart-o"></i><span class="caret"></span></button><ul class="dropdown-menu"><li><a href="#myChart">16 PIE</a></li><li><a href="#myChart2">12 PIE</a></li><li><a href="#myChart3">08 PIE</a></li></ul>';
		}
		
		//Calculate Percentages
		function findPer(){
			demPer = ((demTot / (demTot + repTot + othTot))*100);
			repPer = ((repTot / (demTot + repTot + othTot))*100);
			othPer = ((othTot / (demTot + repTot + othTot))*100);
		}
		
		function findPer2(){
			demPer2 = ((demTot2 / (demTot2 + repTot2 + othTot2))*100);
			repPer2 = ((repTot2 / (demTot2 + repTot2 + othTot2))*100);
			othPer2 = ((othTot2 / (demTot2 + repTot2 + othTot2))*100);
		}
		
		function findPer3(){
			demPer3 = ((demTot3 / (demTot3 + repTot3 + othTot3))*100);
			repPer3 = ((repTot3 / (demTot3 + repTot3 + othTot3))*100);
			othPer3 = ((othTot3 / (demTot3 + repTot3 + othTot3))*100);
		}
		
		//Behavior for left click events
		layer.on('click', function (e) {
			
			//Insert Header
			document.getElementById('chart_container').innerHTML = '<br><br><br><br><canvas id="myChart" height="90px" width="100px"></canvas><br><br><br><canvas id="myChart2" height="90px" width="100px"></canvas>'+
			'<br><br><br><canvas id="myChart3" height="90px" width="100px"></canvas><br><br>';
			election_data = [percentDem, percentRep, percentOth];
			document.getElementById('sbar-header').innerHTML = feature.properties.CO + ", " + feature.properties.ST +
			'<span class="dropdown" id="mapChooser"></span>';
			document.getElementById('mapChooser').innerHTML = '&nbsp;&nbsp;<button class="btn btn-primary dropdown-toggle" id="testbutton" type="button" data-toggle="dropdown"><i class="fa fa-bar-chart-o"></i><span class="caret"></span></button><ul class="dropdown-menu"><li><a href="#myChart">16 Graph</a></li><li><a href="#myChart2">12 Graph</a></li><li><a href="#myChart3">08 Graph</a></li></ul>';
			
			//Insert Chart
			insertElectionChart("myChart", '2016');
			election_data = [percentDem2, percentRep2, percentOth2];
			insertElectionChart("myChart2", '2012');
			election_data = [percentDem3, percentRep3, percentOth3];
			insertElectionChart("myChart3", '2008');
			
			//Insert Table
			document.getElementById('democrat').innerHTML = parseFloat(percentDem).toFixed(2) + "%";
			document.getElementById('republican').innerHTML = parseFloat(percentRep).toFixed(2) + "%";
			document.getElementById('independent').innerHTML = parseFloat(percentOth).toFixed(2) + "%";
			document.getElementById('democratTotal').innerHTML = parseInt(feature.properties.DEM2016).toLocaleString();
			document.getElementById('republicanTotal').innerHTML = parseInt(feature.properties.REP2016).toLocaleString();
			document.getElementById('independentTotal').innerHTML = parseInt(feature.properties.OTH2016).toLocaleString();
			document.getElementById('democrat2').innerHTML = parseFloat(percentDem2).toFixed(2) + "%";
			document.getElementById('republican2').innerHTML = parseFloat(percentRep2).toFixed(2) + "%";
			document.getElementById('independent2').innerHTML = parseFloat(percentOth2).toFixed(2) + "%";
			document.getElementById('democratTotal2').innerHTML = parseInt(feature.properties.DEM2012).toLocaleString();
			document.getElementById('republicanTotal2').innerHTML = parseInt(feature.properties.REP2012).toLocaleString();
			document.getElementById('independentTotal2').innerHTML = parseInt(feature.properties.OTH2012).toLocaleString();
			document.getElementById('democrat3').innerHTML = parseFloat(percentDem3).toFixed(2) + "%";
			document.getElementById('republican3').innerHTML = parseFloat(percentRep3).toFixed(2) + "%";
			document.getElementById('independent3').innerHTML = parseFloat(percentOth3).toFixed(2) + "%";
			document.getElementById('democratTotal3').innerHTML = parseInt(feature.properties.DEM2008).toLocaleString();
			document.getElementById('republicanTotal3').innerHTML = parseInt(feature.properties.REP2008).toLocaleString();
			document.getElementById('independentTotal3').innerHTML = parseInt(feature.properties.OTH2008).toLocaleString();			
			
			//Behavior for left click events (selectMode ON)
			if (selected == false && selectMode === true){
				selectList.push(feature.properties.CO + ', ' + feature.properties.ST + '<br>');
				$('#electionTest').html(selectList);	
				demTot += parseInt(feature.properties.DEM2016);	
				repTot += parseInt(feature.properties.REP2016);	
				othTot += parseInt(feature.properties.OTH2016);
				demTot2 += parseInt(feature.properties.DEM2012);
				repTot2 += parseInt(feature.properties.REP2012);
				othTot2 += parseInt(feature.properties.OTH2012);
				demTot3 += parseInt(feature.properties.DEM2008);
				repTot3 += parseInt(feature.properties.REP2008);
				othTot3 += parseInt(feature.properties.OTH2008);
				findPer();
				findPer2();
				findPer3();
			}
			
			//Updates Election Data 
			if (selectMode === true) {		
				bindElectionChart();
				election_data = [demPer,repPer,othPer];
				insertElectionChart("myChart", '2016');
				election_data = [demPer2,repPer2,othPer2];
				insertElectionChart("myChart2", '2012');
				election_data = [demPer3,repPer3,othPer3];
				insertElectionChart("myChart3", '2008');
				bindElectionTable();
			}
		});
		
		//Behavior for right click events
		layer.on('contextmenu', function (e) {
			if (selected == true){
				var indextest = selectList.indexOf(feature.properties.CO + ', ' + feature.properties.ST + '<br>');
				if (indextest > -1) {
					selectList.splice(indextest, 1);
				}
				$('#electionTest').html(selectList);
				demTot -= parseInt(feature.properties.DEM2016);
				repTot -= parseInt(feature.properties.REP2016);
				othTot -= parseInt(feature.properties.OTH2016);
				demTot2 -= parseInt(feature.properties.DEM2012);
				repTot2 -= parseInt(feature.properties.REP2012);
				othTot2 -= parseInt(feature.properties.OTH2012);
				demTot3 -= parseInt(feature.properties.DEM2008);
				repTot3 -= parseInt(feature.properties.REP2008);
				othTot3 -= parseInt(feature.properties.OTH2008);
				findPer();
				findPer2();
				findPer3();
			}
			
			//Updates Election Data 
			if (selectMode == true && selected == true) {
				bindElectionChart();
				election_data = [demPer,repPer,othPer];
				insertElectionChart("myChart", '2016');
				election_data = [demPer2,repPer2,othPer2];
				insertElectionChart("myChart2", '2012');
				election_data = [demPer3,repPer3,othPer3];
				insertElectionChart("myChart3", '2008');
				bindElectionTable();
			}
		});
	}
	
	function Census_onEachFeature(){
	//Behavior for Census Features
	
		var gain2010 = feature.properties.POP2010-feature.properties.POP2000;
		var gain2000 = feature.properties.POP2000-feature.properties.POP1990;
		var gain1990 = feature.properties.POP1990-feature.properties.POP1980;
		var growth2010 = ((feature.properties.POP2010 - feature.properties.POP2000)/feature.properties.POP2000)*100;
		var growth2000 = ((feature.properties.POP2000 - feature.properties.POP1990)/feature.properties.POP1990)*100;
		var growth1990 = ((feature.properties.POP1990 - feature.properties.POP1980)/feature.properties.POP1980)*100;
		
		
		//Binds Table Data
		function bindCensusTable(){
			document.getElementById('totpop1').innerHTML = pop2010Tot.toLocaleString();
			document.getElementById('totpop2').innerHTML = pop2000Tot.toLocaleString();
			document.getElementById('totpop3').innerHTML = pop1990Tot.toLocaleString();
			document.getElementById('totpop4').innerHTML = pop1980Tot.toLocaleString();
			document.getElementById('gain1').innerHTML = gain2010.toLocaleString();
			document.getElementById('gain2').innerHTML = gain2000.toLocaleString();
			document.getElementById('gain3').innerHTML = gain1990.toLocaleString();
			document.getElementById('growth1').innerHTML = parseFloat(growth2010).toFixed(2) + "%";
			document.getElementById('growth2').innerHTML = parseFloat(growth2000).toFixed(2) + "%";
			document.getElementById('growth3').innerHTML = parseFloat(growth1990).toFixed(2) + "%";			
		}
		
		//Binds Chart Data
		function bindCensusChart(){
			document.getElementById('chart_container2').innerHTML = '<br><br><br><br><br><br><br><br><br><br><canvas id="myChart5" height="90px" width="100px"></canvas>';	
		}
		
		layer.on('click', function (e) {
			
			//Insert Header
			document.getElementById('sbar-table').innerHTML = feature.properties.CO + ", " + feature.properties.ST +
			'<span class="dropdown" id="mapChooser2"></span>';
			document.getElementById('mapChooser2').innerHTML = '&nbsp;&nbsp;<button class="btn btn-primary dropdown-toggle" id="testbutton" type="button" data-toggle="dropdown"><i class="fa fa-bar-chart-o"></i><span class="caret"></span></button><ul class="dropdown-menu"><li><a href="#myChart5">1980-2010 Graph</a></li></ul>';
			
			//Insert Chart
			bindCensusChart();
			census_data = [feature.properties.POP1980, feature.properties.POP1990, feature.properties.POP2000, feature.properties.POP2010];
			insertCensusChart();
			
			//Insert Table
			document.getElementById('totpop1').innerHTML = feature.properties.POP2010.toLocaleString();
			document.getElementById('totpop2').innerHTML = feature.properties.POP2000.toLocaleString();
			document.getElementById('totpop3').innerHTML = feature.properties.POP1990.toLocaleString();
			document.getElementById('totpop4').innerHTML = feature.properties.POP1980.toLocaleString();
			document.getElementById('gain1').innerHTML = gain2010.toLocaleString();
			document.getElementById('gain2').innerHTML = gain2000.toLocaleString();
			document.getElementById('gain3').innerHTML = gain1990.toLocaleString();
			document.getElementById('growth1').innerHTML = parseFloat(growth2010).toFixed(2) + "%";
			document.getElementById('growth2').innerHTML = parseFloat(growth2000).toFixed(2) + "%";
			document.getElementById('growth3').innerHTML = parseFloat(growth1990).toFixed(2) + "%";
			
			//Behavior for left click events (selectMode ON)
			if (selected == false && selectMode === true){	
				document.getElementById('sbar-table').innerHTML = 'Selected Counties' +
				'<span class="dropdown" id="mapChooser2"></span>';
				document.getElementById('mapChooser2').innerHTML = '&nbsp;&nbsp;<button class="btn btn-primary dropdown-toggle" id="testbutton" type="button" data-toggle="dropdown"><i class="fa fa-bar-chart-o"></i><span class="caret"></span></button><ul class="dropdown-menu"><li><a href="#myChart5">1980-2010 Graph</a></li></ul>';
				pop1980Tot += parseInt(feature.properties.POP1980);	
				pop1990Tot += parseInt(feature.properties.POP1990);	
				pop2000Tot += parseInt(feature.properties.POP2000);
				pop2010Tot += parseInt(feature.properties.POP2010);
				gain2010 = pop2010Tot-pop2000Tot;
				gain2000 = pop2000Tot-pop1990Tot;
				gain1990 = pop1990Tot-pop1980Tot;
				growth2010 = ((pop2010Tot - pop2000Tot)/pop2000Tot)*100;
				growth2000 = ((pop2000Tot - pop1990Tot)/pop1990Tot)*100;
				growth1990 = ((pop1990Tot - pop1980Tot)/pop1980Tot)*100;
			}
			
			//Updates Census Data 
			if (selectMode === true) {		
				bindCensusChart();
				census_data = [pop1980Tot,pop1990Tot,pop2000Tot,pop2010Tot];
				insertCensusChart();
				bindCensusTable();
			}
		});
		
		//Behavior for right click events
		layer.on('contextmenu', function (e) {
			if (selected == true){
				pop1980Tot -= parseInt(feature.properties.POP1980);	
				pop1990Tot -= parseInt(feature.properties.POP1990);	
				pop2000Tot -= parseInt(feature.properties.POP2000);
				pop2010Tot -= parseInt(feature.properties.POP2010);
				gain2010 = pop2010Tot-pop2000Tot;
				gain2000 = pop2000Tot-pop1990Tot;
				gain1990 = pop1990Tot-pop1980Tot;
				growth2010 = ((pop2010Tot - pop2000Tot)/pop2000Tot)*100;
				growth2000 = ((pop2000Tot - pop1990Tot)/pop1990Tot)*100;
				growth1990 = ((pop1990Tot - pop1980Tot)/pop1980Tot)*100;
			}
			
			//Updates Election Data 
			if (selectMode == true && selected == true) {
				bindCensusChart();
				census_data = [pop1980Tot,pop1990Tot,pop2000Tot,pop2010Tot];
				insertCensusChart("myChart", '2016');
				bindCensusTable();
			}
		});
	}	
	
	//Behavior for Demographics Features
	function Demo_onEachFeature(){
	
	var whitePer2010 = ((feature.properties.WHI2010 / (feature.properties.POP2010))*100);
	var whitePer2000 = ((feature.properties.WHI2000 / (feature.properties.POP2000))*100);
	var blackPer2010 = ((feature.properties.BLA2010 / (feature.properties.POP2010))*100);
	var blackPer2000 = ((feature.properties.BLA2000 / (feature.properties.POP2000))*100);
	var nativePer2010 = ((feature.properties.NAT2010 / (feature.properties.POP2010))*100);
	var nativePer2000 = ((feature.properties.NAT2000 / (feature.properties.POP2000))*100);
	var asianPer2010 = ((feature.properties.ASI2010 / (feature.properties.POP2010))*100);
	var asianPer2000 = ((feature.properties.ASI2000 / (feature.properties.POP2000))*100);
	var pacificPer2010 = ((feature.properties.HAW2010 / (feature.properties.POP2010))*100);
	var pacificPer2000 = ((feature.properties.HAW2000 / (feature.properties.POP2000))*100);
	var multiracialPer2010 = ((feature.properties.MUL2010 / (feature.properties.POP2010))*100);
	var multiracialPer2000 = ((feature.properties.MUL2000 / (feature.properties.POP2000))*100);
	var hispanicPer2010 = ((feature.properties.LAT2010 / (feature.properties.POP2010))*100);
	var hispanicPer2000 = ((feature.properties.LAT2000 / (feature.properties.POP2000))*100);
	
	var perWhite2010;
	var perWhite2000;
	var perBlack2010;
	var perBlack2000;
	var perNative2010;
	var perNative2000;
	var perAsian2010;
	var perAsian2000;
	var perPacific2010;
	var perPacific2000;
	var perMultiracial2010;
	var perMultiracial2000;
	var perHispanic2010;
	var perHispanic2000;
	
	
		//Binds Table Data
		function bindDemoTable(){
			document.getElementById('whitetot2010').innerHTML = whiteTot.toLocaleString();
			document.getElementById('whitetot2000').innerHTML = whiteTot2000.toLocaleString();
			document.getElementById('blacktot2010').innerHTML = blackTot.toLocaleString();
			document.getElementById('blacktot2000').innerHTML = blackTot2000.toLocaleString();
			document.getElementById('nativetot2010').innerHTML = nativeTot.toLocaleString();
			document.getElementById('nativetot2000').innerHTML = nativeTot2000.toLocaleString();
			document.getElementById('asiantot2010').innerHTML = asianTot.toLocaleString();
			document.getElementById('asiantot2000').innerHTML = asianTot2000.toLocaleString();
			document.getElementById('pactot2010').innerHTML = pacificTot.toLocaleString();
			document.getElementById('pactot2000').innerHTML = pacificTot2000.toLocaleString();
			document.getElementById('multitot2010').innerHTML = multiracialTot.toLocaleString();
			document.getElementById('multitot2000').innerHTML = multiracialTot2000.toLocaleString();
			document.getElementById('histot2010').innerHTML = hispanicTot.toLocaleString();
			document.getElementById('histot2000').innerHTML = hispanicTot2000.toLocaleString();
			document.getElementById('whiteper2010').innerHTML = parseFloat(perWhite2010).toFixed(2) + "%";
			document.getElementById('whiteper2000').innerHTML = parseFloat(perWhite2000).toFixed(2) + "%";
			document.getElementById('blackper2010').innerHTML = parseFloat(perBlack2010).toFixed(2) + "%";
			document.getElementById('blackper2000').innerHTML = parseFloat(perBlack2000).toFixed(2) + "%";
			document.getElementById('nativeper2010').innerHTML = parseFloat(perNative2010).toFixed(2) + "%";
			document.getElementById('nativeper2000').innerHTML = parseFloat(perNative2000).toFixed(2) + "%";
			document.getElementById('asianper2010').innerHTML = parseFloat(perAsian2010).toFixed(2) + "%";
			document.getElementById('asianper2000').innerHTML = parseFloat(perAsian2000).toFixed(2) + "%";
			document.getElementById('pacper2010').innerHTML = parseFloat(perPacific2010).toFixed(2) + "%";
			document.getElementById('pacper2000').innerHTML = parseFloat(perPacific2000).toFixed(2) + "%";
			document.getElementById('multiper2010').innerHTML = parseFloat(perMultiracial2010).toFixed(2) + "%";
			document.getElementById('multiper2000').innerHTML = parseFloat(perMultiracial2000).toFixed(2) + "%";
			document.getElementById('hisper2010').innerHTML = parseFloat(perHispanic2010).toFixed(2) + "%";
			document.getElementById('hisper2000').innerHTML = parseFloat(perHispanic2000).toFixed(2) + "%";		
		}
		
		//Binds Chart Data
		function bindDemoChart(){
			document.getElementById('chart_container3').innerHTML = '<br><br><br><br><br><br><br><br><br><br><canvas id="myChart6" height="100px" width="100px"></canvas><br><br><br><canvas id="myChart7" height="100px" width="100px"></canvas><br>';	
		}
		
		function findPer4(){
			perWhite2010 = ((whiteTot / (pop2010Tot))*100);
			perWhite2000 = ((whiteTot2000 / (pop2000Tot))*100);
			perBlack2010 = ((blackTot / (pop2010Tot))*100);
			perBlack2000 = ((blackTot2000 / (pop2000Tot))*100);
			perNative2010 = ((nativeTot / (pop2010Tot))*100);
			perNative2000 = ((nativeTot2000 / (pop2000Tot))*100);
			perAsian2010 = ((asianTot / (pop2010Tot))*100);
			perAsian2000 = ((asianTot2000 / (pop2000Tot))*100);
			perPacific2010 = ((pacificTot / (pop2010Tot))*100);
			perPacific2000 = ((pacificTot2000 / (pop2000Tot))*100);
			perMultiracial2010 = ((multiracialTot / (pop2010Tot))*100);
			perMultiracial2000 = ((multiracialTot2000 / (pop2000Tot))*100);
			perHispanic2010 = ((hispanicTot / (pop2010Tot))*100);
			perHispanic2000 = ((hispanicTot2000 / (pop2000Tot))*100);
		}
		
		
		
		layer.on('click', function (e) {
			
			//Insert Header
			document.getElementById('demoHeader').innerHTML = feature.properties.CO + ", " + feature.properties.ST +
			'<span class="dropdown" id="mapChooser3"></span>';
			document.getElementById('mapChooser3').innerHTML = '&nbsp;&nbsp;<button class="btn btn-primary dropdown-toggle" id="testbutton" type="button" data-toggle="dropdown"><i class="fa fa-bar-chart-o"></i><span class="caret"></span></button><ul class="dropdown-menu"><li><a href="#myChart6">2010 Graph</a></li><li><a href="#myChart7">2000 Graph</a></li></ul>';
			
			//Insert Chart
			bindDemoChart();
			demo_data = [whitePer2010,blackPer2010,nativePer2010,asianPer2010,pacificPer2010,multiracialPer2010,hispanicPer2010];
			insertDemoChart("myChart6",'2010');
			demo_data = [whitePer2000,blackPer2000,nativePer2000,asianPer2000,pacificPer2000,multiracialPer2000,hispanicPer2000];
			insertDemoChart("myChart7",'2000');
			
			//Insert Table
			document.getElementById('whitetot2010').innerHTML = feature.properties.WHI2010.toLocaleString();
			document.getElementById('whitetot2000').innerHTML = feature.properties.WHI2000.toLocaleString();
			document.getElementById('blacktot2010').innerHTML = feature.properties.BLA2010.toLocaleString();
			document.getElementById('blacktot2000').innerHTML = feature.properties.BLA2000.toLocaleString();
			document.getElementById('nativetot2010').innerHTML = feature.properties.NAT2010.toLocaleString();
			document.getElementById('nativetot2000').innerHTML = feature.properties.NAT2000.toLocaleString();
			document.getElementById('asiantot2010').innerHTML = feature.properties.ASI2010.toLocaleString();
			document.getElementById('asiantot2000').innerHTML = feature.properties.ASI2000.toLocaleString();
			document.getElementById('pactot2010').innerHTML = feature.properties.HAW2010.toLocaleString();
			document.getElementById('pactot2000').innerHTML = feature.properties.HAW2000.toLocaleString();
			document.getElementById('multitot2010').innerHTML = feature.properties.MUL2010.toLocaleString();
			document.getElementById('multitot2000').innerHTML = feature.properties.MUL2000.toLocaleString();
			document.getElementById('histot2010').innerHTML = feature.properties.LAT2010.toLocaleString();
			document.getElementById('histot2000').innerHTML = feature.properties.LAT2000.toLocaleString();
			document.getElementById('whiteper2010').innerHTML = parseFloat(whitePer2010).toFixed(2) + "%";
			document.getElementById('whiteper2000').innerHTML = parseFloat(whitePer2000).toFixed(2) + "%";
			document.getElementById('blackper2010').innerHTML = parseFloat(blackPer2010).toFixed(2) + "%";
			document.getElementById('blackper2000').innerHTML = parseFloat(blackPer2000).toFixed(2) + "%";
			document.getElementById('nativeper2010').innerHTML = parseFloat(nativePer2010).toFixed(2) + "%";
			document.getElementById('nativeper2000').innerHTML = parseFloat(nativePer2000).toFixed(2) + "%";
			document.getElementById('asianper2010').innerHTML = parseFloat(asianPer2010).toFixed(2) + "%";
			document.getElementById('asianper2000').innerHTML = parseFloat(asianPer2000).toFixed(2) + "%";
			document.getElementById('pacper2010').innerHTML = parseFloat(pacificPer2010).toFixed(2) + "%";
			document.getElementById('pacper2000').innerHTML = parseFloat(pacificPer2000).toFixed(2) + "%";
			document.getElementById('multiper2010').innerHTML = parseFloat(multiracialPer2010).toFixed(2) + "%";
			document.getElementById('multiper2000').innerHTML = parseFloat(multiracialPer2000).toFixed(2) + "%";
			document.getElementById('hisper2010').innerHTML = parseFloat(hispanicPer2010).toFixed(2) + "%";
			document.getElementById('hisper2000').innerHTML = parseFloat(hispanicPer2000).toFixed(2) + "%";
			
			//Behavior for left click events (selectMode ON)
			if (selected == false && selectMode === true){	
				document.getElementById('demoHeader').innerHTML = 'Selected Counties' +
				'<span class="dropdown" id="mapChooser3"></span>';
				document.getElementById('mapChooser3').innerHTML = '&nbsp;&nbsp;<button class="btn btn-primary dropdown-toggle" id="testbutton" type="button" data-toggle="dropdown"><i class="fa fa-bar-chart-o"></i><span class="caret"></span></button><ul class="dropdown-menu"><li><a href="#myChart6">2010 Graph</a></li><li><a href="#myChart7">2000 Graph</a></li></ul>';
				
				whiteTot += parseInt(feature.properties.WHI2010);	
				blackTot += parseInt(feature.properties.BLA2010);
				nativeTot += parseInt(feature.properties.NAT2010);
				asianTot += parseInt(feature.properties.ASI2010);
				pacificTot += parseInt(feature.properties.HAW2010);
				multiracialTot += parseInt(feature.properties.MUL2010);
				hispanicTot += parseInt(feature.properties.LAT2010);
				whiteTot2000 += parseInt(feature.properties.WHI2000);	
				blackTot2000 += parseInt(feature.properties.BLA2000);
				nativeTot2000 += parseInt(feature.properties.NAT2000);
				asianTot2000 += parseInt(feature.properties.ASI2000);
				pacificTot2000 += parseInt(feature.properties.HAW2000);
				multiracialTot2000 += parseInt(feature.properties.MUL2000);
				hispanicTot2000 += parseInt(feature.properties.LAT2000);
				findPer4();
			}
	
			//Updates Demographics Data 
			if (selectMode === true) {		
				bindDemoChart();
				demo_data = [perWhite2010,perBlack2010,perNative2010,perAsian2010,perPacific2010,perMultiracial2010,perHispanic2010];
				insertDemoChart("myChart6",'2010');
				demo_data = [perWhite2000,perBlack2000,perNative2000,perAsian2000,perPacific2000,perMultiracial2000,perHispanic2000];
				insertDemoChart("myChart7",'2000');
				bindDemoTable();
			}
		});
		
		//Behavior for right click events
		layer.on('contextmenu', function (e) {
			if (selected == true){
				whiteTot -= parseInt(feature.properties.WHI2010);	
				blackTot -= parseInt(feature.properties.BLA2010);
				nativeTot -= parseInt(feature.properties.NAT2010);
				asianTot -= parseInt(feature.properties.ASI2010);
				pacificTot -= parseInt(feature.properties.HAW2010);
				multiracialTot -= parseInt(feature.properties.MUL2010);
				hispanicTot -= parseInt(feature.properties.LAT2010);
				whiteTot2000 -= parseInt(feature.properties.WHI2000);	
				blackTot2000 -= parseInt(feature.properties.BLA2000);
				nativeTot2000 -= parseInt(feature.properties.NAT2000);
				asianTot2000 -= parseInt(feature.properties.ASI2000);
				pacificTot2000 -= parseInt(feature.properties.HAW2000);
				multiracialTot2000 -= parseInt(feature.properties.MUL2000);
				hispanicTot2000 -= parseInt(feature.properties.LAT2000);
				findPer4();
			}
			
			//Updates Demographics Data 
			if (selectMode == true && selected == true) {
				bindDemoChart();
				demo_data = [whitePer2010,blackPer2010,nativePer2010,asianPer2010,pacificPer2010,multiracialPer2010,hispanicPer2010];
				insertDemoChart('myChart6','2010');
				demo_data = [whitePer2000,blackPer2000,nativePer2000,asianPer2000,pacificPer2000,multiracialPer2000,hispanicPer2000];
				insertDemoChart('myChart7','2000');
				bindDemoTable();
			}
		});
	}	


	

	
		
	Election_onEachFeature();
	Census_onEachFeature();
	Demo_onEachFeature();
	

	//Functions for Binding Labels
	if (feature.properties) {
		
		function displayElectionLables(dem, rep, oth){
			var total = dem + rep + oth
			var percentDem = (dem/total)*100;
			var percentRep = (rep/total)*100;
			layer.bindTooltip("<b><u class = 'popup_title'><big>" + feature.properties.CO 
			+ ", " + feature.properties.ST
			+ "</b></u></big><br><div class = 'popup_body'> <b>Democrat:&nbsp;</b>" + (percentDem).toFixed(2) + "%"
			+ "<br> <b>Republican:&nbsp;</b>" + Number(percentRep).toFixed(2) + "%</div>"
			, {permanent: false});
		}
		
		function displayCensusLables(year2, year1){
			var popchange = ((year2-year1)/year1)*100
			layer.bindTooltip("<b><u class = 'popup_title'><big>" + feature.properties.CO 
			+ ", " + feature.properties.ST
			+ "</b></u></big><br><div class = 'popup_body'> <b>Total Population:&nbsp;</b>" + parseInt(year2).toLocaleString()
			+ "<br> <b>Population Growth:&nbsp;</b>" + Number(popchange).toFixed(2) + "%</div>"
			, {permanent: false});
		}
		
		function displayDemoLables(pop, eth){
			var total = pop;
			var ethPer = (eth/total)*100;
			layer.bindTooltip("<b><u class = 'popup_title'><big>" + feature.properties.CO 
			+ ", " + feature.properties.ST
			+ "</b></u></big><br><div class = 'popup_body'> <b>Total " + ethnicGroup + ":&nbsp;</b>" + parseInt(eth).toLocaleString()
			+ "<br> <b>Percent " + ethnicGroup + ":&nbsp;</b>" + Number(ethPer).toFixed(2) + "%</div>"
			, {permanent: false});
		}	
			
		//Binds Labels
		displayElectionLables(feature.properties.DEM2016, feature.properties.REP2016, feature.properties.OTH2016);

		$('#election_16, #election_16s').click(function(){
			displayElectionLables(feature.properties.DEM2016, feature.properties.REP2016, feature.properties.OTH2016);
		});
		
		$('#election_12, #election_12s').click(function(){
			displayElectionLables(feature.properties.DEM2012, feature.properties.REP2012, feature.properties.OTH2012);
		});
		
		$('#election_08, #election_08s').click(function(){
			displayElectionLables(feature.properties.DEM2008, feature.properties.REP2008, feature.properties.OTH2008);
		});
		
		$('#census_10, #census_10s').click(function(){
			displayCensusLables(feature.properties.POP2010, feature.properties.POP2000);
		});
		
		$('#census_00, #census_00s').click(function(){
			displayCensusLables(feature.properties.POP2000, feature.properties.POP1990);
		});

		$('#demo_10, #demo_10s').click(function(){
			displayDemoLables(feature.properties.POP2010, feature.properties.WHI2010);
		});
	
		$('#demo_00, #demo_00s').click(function(){
			displayDemoLables(feature.properties.POP2000, feature.properties.WHI2000);
		});	
	}
}













//Behavior for mousever and click- Demographic layers
function demo_onEachFeature(feature, layer) {
	
	var whitePer;
	var blackPer;
	var nativePer;
	var asianPer;
	var pacificPer;
	var multiracialPer;
	var hispanicPer;
	
	//Find running totals
	function findTotal(){
		whiteTot2 = parseInt(feature.properties.TOT_WHITE);
		blackTot2 = parseInt(feature.properties.TOT_BLACK);
		nativeTot2 = parseInt(feature.properties.TOT_NAT);
		asianTot2 = parseInt(feature.properties.TOT_ASIAN);
		pacificTot2 = parseInt(feature.properties.TOT_HAW);
		multiracialTot2 = parseInt(feature.properties.TOT_MULTI);
		hispanicTot2 = parseInt(feature.properties.TOT_LAT);	
	}
	
	//Find running percentages	
	function findPer(){
		whitePer = ((whiteTot2 / (whiteTot2 + blackTot2 + nativeTot2 + asianTot2 + pacificTot2 + multiracialTot2 + hispanicTot2))*100);
		blackPer = ((blackTot2 / (whiteTot2 + blackTot2 + nativeTot2 + asianTot2 + pacificTot2 + multiracialTot2 + hispanicTot2))*100);
		nativePer = ((nativeTot2 / (whiteTot2 + blackTot2 + nativeTot2 + asianTot2 + pacificTot2 + multiracialTot2 + hispanicTot2))*100);
		asianPer = ((asianTot2 / (whiteTot2 + blackTot2 + nativeTot2 + asianTot2 + pacificTot2 + multiracialTot2 + hispanicTot2))*100);
		pacificPer = ((pacificTot2 / (whiteTot2 + blackTot2 + nativeTot2 + asianTot2 + pacificTot2 + multiracialTot2 + hispanicTot2))*100);
		multiracialPer = ((multiracialTot2 / (whiteTot2 + blackTot2 + nativeTot2 + asianTot2 + pacificTot2 + multiracialTot2 + hispanicTot2))*100);
		hispanicPer = ((hispanicTot2 / (whiteTot2 + blackTot2 + nativeTot2 + asianTot2 + pacificTot2 + multiracialTot2 + hispanicTot2))*100);
	}
	
	//Find running percentages
	function findPer2(){
		whitePer2 = ((whiteTot / (whiteTot + blackTot + nativeTot + asianTot + pacificTot + multiracialTot + hispanicTot))*100);
		blackPer2 = ((blackTot / (whiteTot + blackTot + nativeTot + asianTot + pacificTot + multiracialTot + hispanicTot))*100);
		nativePer2 = ((nativeTot / (whiteTot + blackTot + nativeTot + asianTot + pacificTot + multiracialTot + hispanicTot))*100);
		asianPer2 = ((asianTot / (whiteTot + blackTot + nativeTot + asianTot + pacificTot + multiracialTot + hispanicTot))*100);
		pacificPer2 = ((pacificTot / (whiteTot + blackTot + nativeTot + asianTot + pacificTot + multiracialTot + hispanicTot))*100);
		multiracialPer2 = ((multiracialTot / (whiteTot + blackTot + nativeTot + asianTot + pacificTot + multiracialTot + hispanicTot))*100);
		hispanicPer2 = ((hispanicTot / (whiteTot + blackTot + nativeTot + asianTot + pacificTot + multiracialTot + hispanicTot))*100);	
	}
	
	//Binds data to Chart.js in sidebar
	function bindDemoChart(){
		document.getElementById('chart_container').innerHTML = '<canvas id="myChart" height="90px" width="100px"></canvas>';
		demo_data = [whitePer2, blackPer2, nativePer2, asianPer2, pacificPer2, multiracialPer2, hispanicPer2];
		document.getElementById('sbar-table').innerHTML = 'Selected Counties' +
		'<span class="sidebar-close"><i class="fa fa-caret-left" title="Click to collapse sidebar"></i></span>';
		document.getElementById('sbar-header').innerHTML = 'Selected Counties' +
		'<span class="sidebar-close"><i class="fa fa-caret-left" title="Click to collapse sidebar"></i></span>';
		insertDemoChart();
	}
	
	//Binds data to Bootstrap table in sidebar
	function bindDemoTable(){
		document.getElementById('white').innerHTML = parseFloat(whitePer2).toFixed(2) + "%";
		document.getElementById('black').innerHTML = parseFloat(blackPer2).toFixed(2) + "%";
		document.getElementById('native').innerHTML = parseFloat(nativePer2).toFixed(2) + "%";
		document.getElementById('asian').innerHTML = parseFloat(asianPer2).toFixed(2) + "%";
		document.getElementById('pacific').innerHTML = parseFloat(pacificPer2).toFixed(2) + "%";
		document.getElementById('multiracial').innerHTML = parseFloat(multiracialPer2).toFixed(2) + "%";
		document.getElementById('hispanic').innerHTML = parseFloat(hispanicPer2).toFixed(2) + "%";
		document.getElementById('whiteTotal').innerHTML = parseInt(whiteTot).toLocaleString();
		document.getElementById('blackTotal').innerHTML = parseInt(blackTot).toLocaleString();
		document.getElementById('nativeTotal').innerHTML = parseInt(nativeTot).toLocaleString();
		document.getElementById('asianTotal').innerHTML = parseInt(asianTot).toLocaleString();
		document.getElementById('pacificTotal').innerHTML = parseInt(pacificTot).toLocaleString();
		document.getElementById('multiracialTotal').innerHTML = parseInt(multiracialTot).toLocaleString();
		document.getElementById('hispanicTotal').innerHTML = parseInt(hispanicTot).toLocaleString();
	}
	
	findTotal();
	findPer();
		
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature,
		contextmenu: resetHighlightContext
	});
	
	//Behavior for left click events
	layer.on('click', function (e) {
		document.getElementById('chart_container').innerHTML = '<canvas id="myChart" height="90px" width="100px"></canvas>';
        demo_data = [feature.properties.PER_WHITE,feature.properties.PER_BLACK,feature.properties.PER_NAT,feature.properties.PER_ASIAN,feature.properties.PER_HAW,
		feature.properties.PER_MULTI,feature.properties.PER_LAT];
		insertDemoChart();
		document.getElementById('sbar-table').innerHTML = feature.properties.COUNTY + ", " + feature.properties.STATE +
		'<span class="sidebar-close"><i class="fa fa-caret-left" title="Click to collapse sidebar"></i></span>';
		document.getElementById('sbar-header').innerHTML = feature.properties.COUNTY + ", " + feature.properties.STATE +
		'<span class="sidebar-close"><i class="fa fa-caret-left" title="Click to collapse sidebar"></i></span>';
		
		findTotal();
		findPer();
		
		document.getElementById('white').innerHTML = parseFloat(whitePer).toFixed(2) + "%";
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
    
		if (selected == false && selectMode === true){
			selectList.push(feature.properties.COUNTY + ', ' + feature.properties.STATE + '<br>');
			$('#electionTest').html(selectList);
			whiteTot += whiteTot2;
			blackTot += blackTot2;
			nativeTot += nativeTot2;
			asianTot += asianTot2;
			pacificTot += pacificTot2;
			multiracialTot += multiracialTot2;
			hispanicTot += hispanicTot2;
		}
	
		findPer2();
	
		if (selectMode === true) {
			bindDemoChart();
			bindDemoTable();
		}
	});
	
	//Behavior for right click events
	layer.on('contextmenu', function (e) {
			
		
		if (selected == true){
			findTotal();		
			whiteTot -= whiteTot2;
			blackTot -= blackTot2;
			nativeTot -= nativeTot2;
			asianTot -= asianTot2;
			pacificTot -= pacificTot2;
			multiracialTot -= multiracialTot2;
			hispanicTot -= hispanicTot2;
		}
		
		findPer2();
		
		if (selectMode === true) {	
			bindDemoChart();
			bindDemoTable();
		}	
	});
	
	
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









counties2010 = new L.GeoJSON.AJAX("geography/2010.geojson", {style: defaultStyle, onEachFeature: onEachFeature}).addTo(map);








states = new L.GeoJSON.AJAX("geography/states-min.geojson", {style: statesStyle, pane: 'labels'}).addTo(map);


//-------------------------------------------------SIDEBAR--------------------------------------------------//


//Adds sidebar
sidebar = L.control.sidebar('sidebar').addTo(map);

//Collapses sidebar when user clicks header



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
	var div = L.DomUtil.create('div', 'legend');
	div.innerHTML +=
		'<table id="legendTable" cellspacing="0" style="width:100%"><tr><td class="color" id="electionlegend1"></td><td>30%+ D</td>' +
		'</tr><tr><td class="color" id="electionlegend2"></td><td>20-30% D</td></tr>' +
		'</tr><tr><td class="color" id="electionlegend3"></td><td>10-20% D</td></tr>' +
		'</tr><tr><td class="color" id="electionlegend4"></td><td>0-10% D</td></tr>' +
		'</tr><tr><td class="color" id="electionlegend5"></td><td>0-10% R</td></tr>' +
		'</tr><tr><td class="color" id="electionlegend6"></td><td>10-20% R</td></tr>' +
		'</tr><tr><td class="color" id="electionlegend7"></td><td>20-30% R</td></tr>' +
		'</tr><tr><td class="color" id="electionlegend8"></td><td>30%+ R</td></tr>'
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


//-------------------------------------------------OTHER--------------------------------------------------//


//Loading GIF displays on page load
counties2010.on('data:loaded', function() {
  $(".loader").fadeOut("slow");
});

//Change map page elements for smaller screen sizes
if ($(window).width() < 450) {
	document.getElementById("sidebar").className = "sidebar sidebar-left";
	document.getElementById("infotab").className = "active";
	document.getElementById("info_chart").className = "sidebar-pane ui-draggable-handle active";
	document.getElementById("userMessage").innerHTML = "Scroll down for info charts and map options.";
	document.getElementById("countySearch").innerHTML = "<input type='text' id='county_search' class='form-control' placeholder='Find a county'/>";
	document.getElementById("searchDiv").innerHTML = '';
} 


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


//-------------------------------------------------LAYER CONTROLS--------------------------------------------------//


//Layer controls via drop down menu, dynamically change map title, legend, and table type
currentMap = 'election2016';
currentTable = document.getElementById("election_table");
document.getElementById('mapTitleText').innerHTML = '<center>2016: PRESIDENTIAL ELECTION RESULTS</center>';

$('#election_08, #election_08s').click(function(){
	//Change layer

	currentMap = 'election2008';
	counties2010.setStyle(defaultStyle);
	
	//Change title
	document.getElementById('chart_container').innerHTML = '<canvas id="myChart" height="90px" width="100px"></canvas>';
	document.getElementById('mapTitleText').innerHTML = '<center>2008: PRESIDENTIAL ELECTION RESULTS</center>';
	
	//Change legend
	map.removeControl(currentLegend);
    currentLegend = electionLegend;
    electionLegend.addTo(map);
	
	

	
 
});
$('#election_12, #election_12s').click(function(){

	
	currentMap = 'election2012';
	counties2010.setStyle(defaultStyle);
	
	
	//Change title
	document.getElementById('chart_container').innerHTML = '<canvas id="myChart" height="90px" width="100px"></canvas>';
	document.getElementById('mapTitleText').innerHTML = '<center>2012: PRESIDENTIAL ELECTION RESULTS</center>';
	
	//Change legend
	map.removeControl(currentLegend);
    currentLegend = electionLegend;
    electionLegend.addTo(map);
	
	
	
});
$('#election_16, #election_16s').click(function(){
	//Change layer

	currentMap = 'election2016';
	counties2010.setStyle(defaultStyle);
	
	//Change title
	document.getElementById('chart_container').innerHTML = '<canvas id="myChart" height="90px" width="100px"></canvas>';
	document.getElementById('mapTitleText').innerHTML = '<center>2016: PRESIDENTIAL ELECTION RESULTS</center>';
	
	//Change legend
	map.removeControl(currentLegend);
    currentLegend = electionLegend;
    electionLegend.addTo(map);
	
	
	
});
$('#census_00, #census_00s').click(function(){
	//Change layer

	currentMap = 'census2000';
	counties2010.setStyle(defaultStyle);
	
	//Change title
	document.getElementById('chart_container').innerHTML = '<canvas id="myChart" height="90px" width="100px"></canvas>';
	document.getElementById('mapTitleText').innerHTML = '<center>2000: POPULATION GROWTH SINCE 1990 </center>';
	
	//Change legend
	map.removeControl(currentLegend);
    currentLegend = censusLegend;
    censusLegend.addTo(map);
	
	
});
$('#census_10, #census_10s').click(function(){
	//Change layer

	currentMap = 'census2010';
	counties2010.setStyle(defaultStyle);
	
	//Change title
	document.getElementById('chart_container').innerHTML = '<canvas id="myChart" height="90px" width="100px"></canvas>';
	document.getElementById('mapTitleText').innerHTML = '<center>2010: POPULATION GROWTH SINCE 2000 </center>';
	
	//Change legend
	map.removeControl(currentLegend);
    currentLegend = censusLegend;
    censusLegend.addTo(map);
	
	
});
$('#demo_00, #demo_00s').click(function(){
	//Change layer
	ethnicGroup = 'White';
	currentMap = 'demo2000';
	counties2010.setStyle(defaultStyle);
	
	//Change title
	document.getElementById('chart_container').innerHTML = '<canvas id="myChart" height="90px" width="100px"></canvas>';
	document.getElementById('mapTitleText').innerHTML = '<center>2000: PERCENT WHITE </center>';
	
	//Change legend
	map.removeControl(currentLegend);
    currentLegend = demoLegend;
    demoLegend.addTo(map);
	
	
});
$('#demo_10, #demo_10s').click(function(){
	//Change layer
	ethnicGroup = 'White';
	currentMap = 'demo2010';
	counties2010.setStyle(defaultStyle);
	
	//Change title
	document.getElementById('chart_container').innerHTML = '<canvas id="myChart" height="90px" width="100px"></canvas>';
	document.getElementById('mapTitleText').innerHTML = '<center>2010: PERCENT WHITE </center>';
	
	//Change legend
	map.removeControl(currentLegend);
    currentLegend = demoLegend;
    demoLegend.addTo(map);
	
	
});

//State outline toggle
$('.state_outlines').click(function(){
	if (map.hasLayer(states) === false) {
		map.addLayer(states);
	}
	else
		map.removeLayer(states);
});

//Base map toggle
$('.base_map').click(function(){
	if (map.hasLayer(osm) === false) {
		map.addLayer(osm);
	}
	else
		map.removeLayer(osm);
});

//Selection toggle
$('.selectMode').click(function(){
	if (selectMode === false) {
		selectMode = true;
	}
	else
		selectMode = false;
		selectList = [];
		$('#electionTest').html(selectList);
		counties2010.setStyle({
			weight: 1,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7
		});		
});

//Clear selection
function clearStuff(){
	selectList = [];
	$('#electionTest').html(selectList);
	demTot = 0;
	repTot = 0;
	othTot = 0;
	demTot2 = 0;
	repTot2 = 0;
	othTot2 = 0;
	demTot3 = 0;
	repTot3 = 0;
	othTot3 = 0;
	totalPop = 0;
	pop2010Tot = 0;
    pop2000Tot = 0;
    pop1990Tot = 0;
    pop1980Tot = 0;
	whiteTot = 0;
	blackTot = 0;
	nativeTot = 0;
	asianTot = 0;
	pacificTot = 0;
	multiracialTot = 0;
	hispanicTot = 0;
	whiteTot2000 = 0;
	blackTot2000 = 0;
	nativeTot2000 = 0;
	asianTot2000 = 0;
	pacificTot2000 = 0;
	multiracialTot2000 = 0;
	hispanicTot2000 = 0;
	counties2010.setStyle({
		weight: 1,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7
	});		
}

//Clear selection on layer change
$('.layercontrol').click(function(){
	clearStuff();
});

//Clear selection on clear button
$('.clearSelection').click(function(){
	clearStuff();
});
