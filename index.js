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
var currentMap;
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
var total10 = 0;
var total00 = 0;
var total90 = 0;
var total80 = 0;

var whiteTot = 0;
var blackTot = 0;
var nativeTot = 0;
var asianTot = 0;
var pacificTot = 0;
var multiracialTot = 0;
var hispanicTot = 0;
		
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

//Changes Demographics 2000/2010 layer labels for smaller screen sizes
if ($(window).width() > 450) {
	var demolabels = ['White',['Black or', 'African American'], ['American Indian or', 'Alaska Native'], 'Asian',
	['Native Hawaiian or', 'Other Pacific Islander'], ['Multiracial'], ['Hispanic or', 'Latino']];
}
else {
	var demolabels = ['White',['Black'], ['Nat. Am/Nat. AK.'], 'Asian',
	['Nat. HI/Pac-Isl'], ['Multiracial'], ['Hisp/Lat']];
}

//Insert bar graph using Chart.js for Demographics 2000/2010
function insertDemoChart(){
	var ctx = document.getElementById("myChart");
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
			}
		});	
}

//Behavior for mousever and click- Election layers
function election_onEachFeature(feature, layer) {
	



function doitman(demYear, repYear, othYear, demYear2, repYear2, othYear2, demYear3, repYear3, othYear3){
	
	var total = demYear+repYear+othYear;
	var percentDem = (demYear/total)*100;
	var percentRep = (repYear/total)*100;
	var percentOth = (othYear/total)*100;
	
	var total2 = demYear2 + repYear2 + othYear2;
	var percentDem2 = (demYear2/total2)*100;
	var percentRep2 = (repYear2/total2)*100;
	var percentOth2 = (othYear2/total2)*100;
	
	var total3 = demYear3 + repYear3 + othYear3;
	var percentDem3 = (demYear3/total3)*100;
	var percentRep3 = (repYear3/total3)*100;
	var percentOth3 = (othYear3/total3)*100;
	
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
	
	//Binds data to Bootstrap table in sidebar
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
	
	//Binds data to Chart.js in sidebar
	function bindElectionChart(){
		document.getElementById('chart_container').innerHTML = '<canvas id="myChart" height="90px" width="100px"></canvas><br><canvas id="myChart2" height="105px" width="100px"></canvas>'+
		'<br><canvas id="myChart3" height="105px" width="100px"></canvas>';
		document.getElementById('sbar-table').innerHTML = 'Selected Counties'+
		'<span class="sidebar-close"><i class="fa fa-caret-left" title="Click to collapse sidebar"></i></span>';
		document.getElementById('sbar-header').innerHTML = 'Selected Counties' +
		'<span class="sidebar-close"><i class="fa fa-caret-left" title="Click to collapse sidebar"></i></span>';
	}
	
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
		
		document.getElementById('chart_container').innerHTML = '<canvas id="myChart" height="90px" width="100px"></canvas><br><canvas id="myChart2" height="105px" width="100px"></canvas>'+
		'<br><canvas id="myChart3" height="105px" width="100px"></canvas>';
        election_data = [percentDem, percentRep, percentOth];
		document.getElementById('sbar-table').innerHTML = feature.properties.CO + ", " + feature.properties.ST +
		'<span class="sidebar-close"><i class="fa fa-caret-left" title="Click to collapse sidebar"></i></span>';
		document.getElementById('sbar-header').innerHTML = feature.properties.CO + ", " + feature.properties.ST +
		'<span class="sidebar-close"><i class="fa fa-caret-left" title="Click to collapse sidebar"></i></span>';	
		insertElectionChart("myChart", '2016');
		election_data = [percentDem2, percentRep2, percentOth2];
		insertElectionChart("myChart2", '2012');
		election_data = [percentDem3, percentRep3, percentOth3];
		insertElectionChart("myChart3", '2008');
		

		
		
		document.getElementById('democrat').innerHTML = parseFloat(percentDem).toFixed(2) + "%";
	    document.getElementById('republican').innerHTML = parseFloat(percentRep).toFixed(2) + "%";
		document.getElementById('independent').innerHTML = parseFloat(percentOth).toFixed(2) + "%";
		document.getElementById('democratTotal').innerHTML = parseInt(demYear).toLocaleString();
		document.getElementById('republicanTotal').innerHTML = parseInt(repYear).toLocaleString();
		document.getElementById('independentTotal').innerHTML = parseInt(othYear).toLocaleString();
		document.getElementById('democrat2').innerHTML = parseFloat(percentDem2).toFixed(2) + "%";
		document.getElementById('republican2').innerHTML = parseFloat(percentRep2).toFixed(2) + "%";
		document.getElementById('independent2').innerHTML = parseFloat(percentOth2).toFixed(2) + "%";
		document.getElementById('democratTotal2').innerHTML = parseInt(demYear2).toLocaleString();
		document.getElementById('republicanTotal2').innerHTML = parseInt(repYear2).toLocaleString();
		document.getElementById('independentTotal2').innerHTML = parseInt(othYear2).toLocaleString();
		document.getElementById('democrat3').innerHTML = parseFloat(percentDem3).toFixed(2) + "%";
		document.getElementById('republican3').innerHTML = parseFloat(percentRep3).toFixed(2) + "%";
		document.getElementById('independent3').innerHTML = parseFloat(percentOth3).toFixed(2) + "%";
		document.getElementById('democratTotal3').innerHTML = parseInt(demYear3).toLocaleString();
		document.getElementById('republicanTotal3').innerHTML = parseInt(repYear3).toLocaleString();
		document.getElementById('independentTotal3').innerHTML = parseInt(othYear3).toLocaleString();			
		
		if (selected == false && selectMode === true){
			selectList.push(feature.properties.CO + ', ' + feature.properties.ST + '<br>');
			$('#electionTest').html(selectList);	
			demTot += parseInt(demYear);	
			repTot += parseInt(repYear);	
			othTot += parseInt(othYear);
			demTot2 += parseInt(demYear2);
			repTot2 += parseInt(repYear2);
			othTot2 += parseInt(othYear2);
			demTot3 += parseInt(demYear3);
			repTot3 += parseInt(repYear3);
			othTot3 += parseInt(othYear3);
			findPer();
			findPer2();
			findPer3();
		}
		
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
			demTot -= parseInt(demYear);
			repTot -= parseInt(repYear);
			othTot -= parseInt(othYear);
			demTot2 -= parseInt(demYear2);
			repTot2 -= parseInt(repYear2);
			othTot2 -= parseInt(othYear2);
			demTot3 -= parseInt(demYear3);
			repTot3 -= parseInt(repYear3);
			othTot3 -= parseInt(othYear3);
			findPer();
			findPer2();
			findPer3();
		}
		
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






switch (currentMap)
            {
               case 'election2016': doitman(feature.properties.DEM2016,feature.properties.REP2016,feature.properties.OTH2016,feature.properties.DEM2012,feature.properties.REP2012,feature.properties.OTH2012,feature.properties.DEM2008,feature.properties.REP2008,feature.properties.OTH2008);
               break;
            
               case 'election2012': doitman(feature.properties.DEM2012,feature.properties.REP2012,feature.properties.OTH2012,feature.properties.DEM2016,feature.properties.REP2016,feature.properties.OTH2016,feature.properties.DEM2008,feature.properties.REP2008,feature.properties.OTH2008);
               break;
            
               case 'election2008': doitman(feature.properties.DEM2008,feature.properties.REP2008,feature.properties.OTH2008,feature.properties.DEM2012,feature.properties.REP2012,feature.properties.OTH2012,feature.properties.DEM2016,feature.properties.REP2016,feature.properties.OTH2016);
               break;
            
               default:  return;
            }




	
	
	//Binds labels
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











//Behavior for mousever and click- Census layers
function census_onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature,
		contextmenu: resetHighlightContext
	});
	
	var growth2000;
	var growth2010;
	
	//Binds data to Chart.js in sidebar
	function bindCensusChart(){
		document.getElementById('chart_container').innerHTML = '<canvas id="myChart" height="90px" width="100px"></canvas>';
		census_data = [total80,total90,totalPop];
		labels = ['1980','1990','2000'];
	}
	
	//Binds data to Chart.js in sidebar
	function bindCensusChart2010(){
		document.getElementById('chart_container').innerHTML = '<canvas id="myChart" height="90px" width="100px"></canvas>';
		census_data = [total80,total90,total00,total10];
		labels = ['1980','1990','2000','2010'];
	}
	
	//Binds data to Bootstrap table in sidebar
	function bindCensusTable(){
		document.getElementById('census_table').innerHTML = '<table class="table table-hover">' + 
		'<tr><th>2000 Growth:</th><td id="growth_2000"></td></tr>' +
		'<tr><th>2000 Pop:</th><td id="total_pop"></td></tr>' +
		'<tr><th>1990 Pop:</th><td id="pop_1990"></td></tr>' +
		'<tr><th>1980 Pop:</th><td id="pop_1980"></td></tr>' +
		'</table>';
		document.getElementById('total_pop').innerHTML = parseInt(totalPop).toLocaleString();
		document.getElementById('pop_1990').innerHTML = parseInt(total90).toLocaleString();
		document.getElementById('pop_1980').innerHTML = parseInt(total80).toLocaleString();	
		document.getElementById('growth_2000').innerHTML = parseFloat(growth2000).toFixed(2) + "%";
		document.getElementById('sbar-table').innerHTML = 'Selected Counties' +
		'<span class="sidebar-close"><i class="fa fa-caret-left" title="Click to collapse sidebar"></i></span>';
		document.getElementById('sbar-header').innerHTML = 'Selected Counties' +
		'<span class="sidebar-close"><i class="fa fa-caret-left" title="Click to collapse sidebar"></i></span>';
		insertCensusChart();			
	}
	
	//Binds data to Bootstrap table in sidebar
	function bindCensusTable2010(){
		document.getElementById('census_table').innerHTML = '<table class="table table-hover">' + 
		'<tr><th>2010 Growth:</th><td id="growth_2010"></td></tr>' +
		'<tr><th>2010 Pop:</th><td id="total_pop"></td></tr>' +
		'<tr><th>2000 Pop:</th><td id="pop_2000"></td></tr>' +
		'<tr><th>1990 Pop:</th><td id="pop_1990"></td></tr>' +
		'<tr><th>1980 Pop:</th><td id="pop_1980"></td></tr>' +
		'</table>';
		document.getElementById('total_pop').innerHTML = parseInt(total10).toLocaleString();
		document.getElementById('pop_2000').innerHTML = parseInt(total00).toLocaleString();
		document.getElementById('pop_1990').innerHTML = parseInt(total90).toLocaleString();
		document.getElementById('pop_1980').innerHTML = parseInt(total80).toLocaleString();	
		document.getElementById('growth_2010').innerHTML = parseFloat(growth2010).toFixed(2) + "%";
		document.getElementById('sbar-table').innerHTML = 'Selected Counties' +
		'<span class="sidebar-close"><i class="fa fa-caret-left" title="Click to collapse sidebar"></i></span>';
		document.getElementById('sbar-header').innerHTML = 'Selected Counties' +
		'<span class="sidebar-close"><i class="fa fa-caret-left" title="Click to collapse sidebar"></i></span>';
		insertCensusChart();
	}
	
	//Behavior for left click events
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
		
		if (selected == false){
			selectList.push(feature.properties.COUNTY + ', ' + feature.properties.STATE + '<br>');
			$('#electionTest').html(selectList);
			total102 = (feature.properties.TOT_CUR);
			total10 += total102
			total002 = parseInt(feature.properties.TOT_2000);
			total00 += total002;	
			totalPop2 = (feature.properties.TOT_CUR);
			totalPop += totalPop2;	
			total2 = parseInt(feature.properties.TOT_1990);
			total90 += total2;
			total3 = parseInt(feature.properties.TOT_1980);
			total80 += total3;	
		}
		
		growth2000 = ((totalPop - total90)/total90)*100;
		growth2010 = ((total10 - total00)/total00)*100;
		
		if (selectMode === true) {
			
			if (map.hasLayer(census2000) === true){
				bindCensusChart();
				bindCensusTable();
			}
			
			if (map.hasLayer(census2010) === true){
				bindCensusChart2010();
				bindCensusTable2010();
			}
		}
		
		if (selectMode === false) {
			document.getElementById('sbar-table').innerHTML = feature.properties.COUNTY + ", " + feature.properties.STATE +
			'<span class="sidebar-close"><i class="fa fa-caret-left" title="Click to collapse sidebar"></i></span>';
			document.getElementById('sbar-header').innerHTML = feature.properties.COUNTY + ", " + feature.properties.STATE +
			'<span class="sidebar-close"><i class="fa fa-caret-left" title="Click to collapse sidebar"></i></span>';
		}
    });
	
	//Behavior for right click events
	layer.on('contextmenu', function (e) {
		
		var indextest = selectList.indexOf(feature.properties.COUNTY + ', ' + feature.properties.STATE + '<br>');
		if (indextest > -1) {
			selectList.splice(indextest, 1);
		}
		$('#electionTest').html(selectList);
		
		if (selected == true){
			total102 = (feature.properties.TOT_CUR);
			total10 -= total102
			total002 = parseInt(feature.properties.TOT_2000);
			total00 -= total002;
			totalPop2 = (feature.properties.TOT_CUR);
			totalPop -= totalPop2;
			total2 = parseInt(feature.properties.TOT_1990);
			total90 -= total2;
			total3 = parseInt(feature.properties.TOT_1980);
			total80 -= total3;	
		}
			
		growth2000 = ((totalPop - total90)/total90)*100;
		growth2010 = ((total10 - total00)/total00)*100;
			
		if (selectMode === true) {
			if (map.hasLayer(census2000) === true){
				bindCensusChart();
				bindCensusTable();
			}	
			
			if (map.hasLayer(census2010) === true){			
				bindCensusChart2010();
				bindCensusTable2010();
			}
		}
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
			
		var indextest = selectList.indexOf(feature.properties.COUNTY + ', ' + feature.properties.STATE + '<br>');
		if (indextest > -1) {
			selectList.splice(indextest, 1);
		}
		$('#electionTest').html(selectList);
		
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
	
	//Binds labels
	if (feature.properties) {
		if ($(window).width() < 450) {
			layer.bindTooltip("<b><u class = 'popup_title'><big>" + feature.properties.COUNTY
			+ ", " + feature.properties.STATE
			+ "</b></u></big><div class = 'popup_body'> <b>White:&nbsp;</b>" + parseFloat(whitePer).toFixed(2) + "%"
			+ "<br> <b>Black:&nbsp;</b>" + parseFloat(blackPer).toFixed(2) + "%"
			+ "<br> <b>Nat. Am/Nat. AK:&nbsp;</b>" + parseFloat(nativePer).toFixed(2) + "%"
			+ "<br> <b>Asian:&nbsp;</b>" + parseFloat(asianPer).toFixed(2) + "%"
			+ "<br> <b>Nat. HI/Pac-Isl:&nbsp;</b>" + parseFloat(pacificPer).toFixed(2) + "%"
			+ "<br> <b>Multiracial:&nbsp;</b>" + parseFloat(multiracialPer).toFixed(2) + "%"
			+ "<br> <b>Hispanic/Lat:&nbsp;</b>" + parseFloat(hispanicPer).toFixed(2) + "%</div>"
			, {permanent: false});
		}
		
		else {
			layer.bindTooltip("<b><u class = 'popup_title'><big>" + feature.properties.COUNTY
			+ ", " + feature.properties.STATE
			+ "</b></u></big><div class = 'popup_body'> <b>White:&nbsp;</b>" + parseFloat(whitePer).toFixed(2) + "%"
			+ "<br> <b>Black or African American:&nbsp;</b>" + parseFloat(blackPer).toFixed(2) + "%"
			+ "<br> <b>American Indian or Alaska Native:&nbsp;</b>" + parseFloat(nativePer).toFixed(2) + "%"
			+ "<br> <b>Asian:&nbsp;</b>" + parseFloat(asianPer).toFixed(2) + "%"
			+ "<br> <b>Native Hawaiin or Other Pacific Islander:&nbsp;</b>" + parseFloat(pacificPer).toFixed(2) + "%"
			+ "<br> <b>Multiracial:&nbsp;</b>" + parseFloat(multiracialPer).toFixed(2) + "%"
			+ "<br> <b>Hispanic or Latino:&nbsp;</b>" + parseFloat(hispanicPer).toFixed(2) + "%</div>"
			, {permanent: false});
		}
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









counties2010 = new L.GeoJSON.AJAX("geography/2010.geojson", {style: defaultStyle, onEachFeature: election_onEachFeature}).addTo(map);








states = new L.GeoJSON.AJAX("geography/states-min.geojson", {style: statesStyle, pane: 'labels'}).addTo(map);


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
	
	//Change table
	currentTable.style.display = "none";
	currentTable = document.getElementById("election_table");
	currentTable.style.display = "inline";	
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
	
	//Change table
	currentTable.style.display = "none";
	currentTable = document.getElementById("election_table");
	currentTable.style.display = "inline";
	
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
	
	//Change table
	currentTable.style.display = "none";
	currentTable = document.getElementById("election_table");
	currentTable.style.display = "inline";
	
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
	
	//Change table
	currentTable.style.display = "none";
	currentTable = document.getElementById("census_table");
	currentTable.style.display = "inline";
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
	
	//Change table
	currentTable.style.display = "none";
	currentTable = document.getElementById("census_table");
	currentTable.style.display = "inline";
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
	
	//Change table
	currentTable.style.display = "none";
	currentTable = document.getElementById("demo_table");
	currentTable.style.display = "inline";
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
	
	//Change table
	currentTable.style.display = "none";
	currentTable = document.getElementById("demo_table");
	currentTable.style.display = "inline";
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
	total10 = 0;
	total00 = 0;
	total90 = 0;
	total80 = 0;
	whiteTot = 0;
	blackTot = 0;
	nativeTot = 0;
	asianTot = 0;
	pacificTot = 0;
	multiracialTot = 0;
	hispanicTot = 0;
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
