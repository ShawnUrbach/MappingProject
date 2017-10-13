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

//Variables: URL
var addHash;
var stringURL = window.location.hash;
var hashMatch = stringURL.substring(stringURL.lastIndexOf('&')+1);

//Variables: User Maps
var userVariable;
var userVariable2;
var comparisonText;

//Variables: Other
var ethnicGroup;
var tooltipPosition;
var selectionTable;

//-------------------------------------------------SELECTION TABLE--------------------------------------------------//

selectionTable = $('#tableTest').DataTable({
	paging: false,
	colReorder: {
		realtime: false
	},
	dom: 'Bfrtip',
	language: {
		search: "" ,
		searchPlaceholder: "Search",    
	},
	buttons: [
		{
			extend: 'colvis',
			collectionLayout: 'fixed two-column',
			text: 'Columns',
		},
		{
			extend: 'columnVisibility',
			text: 'Show all',
			visibility: true
		},
		{
			extend: 'columnVisibility',
			text: 'Hide all',
			visibility: false
		}
	]
});

selectionTable.on( 'mouseenter', 'td', function () {
	var colIdx = selectionTable.cell(this).index().column;
	$( selectionTable.cells().nodes() ).removeClass( 'highlight' );
	$( selectionTable.column( colIdx ).nodes() ).addClass( 'highlight' );
} );

//-------------------------------------------------COLOR INPUTS--------------------------------------------------//

//Options for color inputs
$(".colorChoice").spectrum({
    color: "black",
	showPalette: true,
    palette: [
        ['black', 'white', 'gray'],
        ['brown', 'blue', 'green'],
		['orange', 'red', 'yellow'],
		['purple', 'turquoise', 'pink'],
    ]
});

//Highlight and Selection Colors
var highlightColor = $("#highlightColor").spectrum("get").toHexString();
$("#highlightColor").on('change.spectrum', function(){
	highlightColor = $("#highlightColor").spectrum("get").toHexString();
});

var selectionColor = $("#selectionColor").spectrum("get").toHexString();
$("#selectionColor").on('change.spectrum', function(){
	selectionColor = $("#selectionColor").spectrum("get").toHexString();
});

//-------------------------------------------------CUSTOM USER MAP--------------------------------------------------//

//Get Custom Map colors
var userColor1 = $('#customMapColor1').spectrum("get").toHexString();;
$('#customMapColor1').on('change.spectrum', function(){
	userColor1 = $('#customMapColor1').spectrum("get").toHexString();
});

var userColor2 = $('#customMapColor2').spectrum("get").toHexString();;
$('#customMapColor2').on('change.spectrum', function(){
	userColor2 = $('#customMapColor2').spectrum("get").toHexString();
});

//Get Custom Map title
var customTitle = $('#customTitle');
var customTitleVal = $('#customTitle').val();
$(customTitle).change(function() {
	customTitleVal = $('#customTitle').val();
});

//Disable variable #2 options if radio is checked
$('#radioyes').click(function(){
	$("#userVariable2").prop('disabled', false);
	$("#userOperand2").prop('disabled', false);
	$("#userNumber2").prop('disabled', false);
	$("input[name=optradio2]").prop('disabled', false);
});

$('#radiono').click(function(){
	$("#userVariable2").prop('disabled', true).val('');
	$("#userOperand2").prop('disabled', true).val('');
	$("#userNumber2").prop('disabled', true).val('');
	$("input[name=optradio2]").prop('disabled', true);
});

//-------------------------------------------------FUNCTIONS--------------------------------------------------//

//Activate CSS tooltips
$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip();   
});

//Styles properties for all maps
function defaultStyle(feature) {
	
	function elections(dem, rep, oth){
		var total = dem+rep+oth;
		var percentDem = (dem/total)*100;
		var percentRep = (rep/total)*100;
		return percentDem-percentRep;	
	}
	
	function elections2(dem, rep, oth){
		var total = dem+rep+oth;
		var percentDem = (dem/total)*100;
		var percentRep = (rep/total)*100;
		return percentRep-percentDem;	
	}
	
	function electionsdiff(dem, rep, oth, dem2, rep2, oth2){
		var total = dem+rep+oth;
		var percentDem = (dem/total)*100;
		var percentRep = (rep/total)*100;
		var diff = percentDem-percentRep;
		
		var total2 = dem2+rep2+oth2;
		var percentDem2 = (dem2/total2)*100;
		var percentRep2 = (rep2/total2)*100;
		var diff2 = percentDem2-percentRep2;	
		return diff-diff2;
	}
	
	function electionsdiff2(dem, rep, oth, dem2, rep2, oth2){
		var total = dem+rep+oth;
		var percentDem = (dem/total)*100;
		var percentRep = (rep/total)*100;
		var diff = percentRep-percentDem;
		
		var total2 = dem2+rep2+oth2;
		var percentDem2 = (dem2/total2)*100;
		var percentRep2 = (rep2/total2)*100;
		var diff2 = percentRep2-percentDem2;		
		return diff-diff2;
	}
	
	function percentParty(party1, party2, party3){
		var total = party1+party2+party3;
		var percentParty = (party3/total)*100;
		return percentParty	
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
			return GetColor(elections(feature.properties.DEM2016, feature.properties.REP2016, feature.properties.OTH2016),30,20,10,0,-10,-20,-30,-100);
		}
		if (currentMap == 'election2012'){
			return GetColor(elections(feature.properties.DEM2012, feature.properties.REP2012, feature.properties.OTH2012),30,20,10,0,-10,-20,-30,-100);
		}
		if (currentMap == 'election2008'){
			return GetColor(elections(feature.properties.DEM2008, feature.properties.REP2008, feature.properties.OTH2008),30,20,10,0,-10,-20,-30,-100);
		}
		if (currentMap == 'thirdparty2016'){
			return GetColor2(percentParty(feature.properties.DEM2016, feature.properties.REP2016, feature.properties.OTH2016),8,7,6,5,4,3,2,1);
		}
		if (currentMap == 'thirdparty2012'){
			return GetColor2(percentParty(feature.properties.DEM2012, feature.properties.REP2012, feature.properties.OTH2012),8,7,6,5,4,3,2,1);
		}
		if (currentMap == 'thirdparty2008'){
			return GetColor2(percentParty(feature.properties.DEM2008, feature.properties.REP2008, feature.properties.OTH2008),8,7,6,5,4,3,2,1);
		}
		if (currentMap == 'thirdparty2008'){
			return GetColor2(percentParty(feature.properties.DEM2008, feature.properties.REP2008, feature.properties.OTH2008),8,7,6,5,4,3,2,1);
		}
		if (currentMap == 'diff2016'){
			return GetColor(electionsdiff(feature.properties.DEM2016, feature.properties.REP2016, feature.properties.OTH2016, feature.properties.DEM2012, feature.properties.REP2012, feature.properties.OTH2012),20,10,5,0,-5,-10,-20,-100);
		}
		if (currentMap == 'diff2012'){
			return GetColor(electionsdiff(feature.properties.DEM2012, feature.properties.REP2012, feature.properties.OTH2012, feature.properties.DEM2008, feature.properties.REP2008, feature.properties.OTH2008),20,10,5,0,-5,-10,-20,-100);
		}
		if (currentMap == 'census2010'){
			return GetColor2(popchange(feature.properties.POP2010, feature.properties.POP2000),30,25,20,15,10,5,0,-5);
		}
		if (currentMap == 'census2000'){
			return GetColor2(popchange(feature.properties.POP2000, feature.properties.POP1990),30,25,20,15,10,5,0,-5);
		}
		if (currentMap == 'census1990'){
			return GetColor2(popchange(feature.properties.POP1990, feature.properties.POP1980),30,25,20,15,10,5,0,-5);
		}
		if (currentMap == 'demo2010'){
			return GetColor2(demos(feature.properties.POP2010, feature.properties.WHI2010),95,90,85,80,75,70,65,60);
		}
		if (currentMap == 'demo2000'){
			return GetColor2(demos(feature.properties.POP2000, feature.properties.WHI2000),95,90,85,80,75,70,65,60);
		}
		if (currentMap == 'black2010'){
			return GetColor2(demos(feature.properties.POP2010, feature.properties.BLA2010),20,18,16,14,12,10,8,6);
		}
		if (currentMap == 'black2000'){
			return GetColor2(demos(feature.properties.POP2000, feature.properties.BLA2000),20,18,16,14,12,10,8,6);
		}
		if (currentMap == 'hispanic2010'){
			return GetColor2(demos(feature.properties.POP2010, feature.properties.LAT2010),30,27,24,21,18,15,12,9);
		}
		if (currentMap == 'hispanic2000'){
			return GetColor2(demos(feature.properties.POP2000, feature.properties.LAT2000),30,27,24,21,18,15,12,9);
		}
		if (currentMap == 'asian2010'){
			return GetColor2(demos(feature.properties.POP2010, feature.properties.ASI2010),8,7,6,5,4,3,2,1);
		}
		if (currentMap == 'asian2000'){
			return GetColor2(demos(feature.properties.POP2000, feature.properties.ASI2000),8,7,6,5,4,3,2,1);
		}
		if (currentMap == 'multiracial2010'){
			return GetColor2(demos(feature.properties.POP2010, feature.properties.MUL2010),8,7,6,5,4,3,2,1);
		}
		if (currentMap == 'multiracial2000'){
			return GetColor2(demos(feature.properties.POP2000, feature.properties.MUL2000),8,7,6,5,4,3,2,1);
		}
		if (currentMap == 'native2010'){
			return GetColor2(demos(feature.properties.POP2000, feature.properties.NAT2010),4,3.5,3,2.5,2,1.5,1,0.5);
		}
		if (currentMap == 'native2000'){
			return GetColor2(demos(feature.properties.POP2000, feature.properties.NAT2000),4,3.5,3,2.5,2,1.5,1,0.5);
		}
		if (currentMap == 'pacific2010'){
			return GetColor2(demos(feature.properties.POP2000, feature.properties.HAW2010),1.6,1.4,1.2,1.0,0.8,0.6,0.4,0.2);
		}
		if (currentMap == 'pacific2000'){
			return GetColor2(demos(feature.properties.POP2000, feature.properties.HAW2000),1.6,1.4,1.2,1.0,0.8,0.6,0.4,0.2);
		}
		
		//Custom Map - get first user variable
		switch ($('#userVariable1').val()){
			case 'Pop2010':
				userVariable = feature.properties.POP2010;
				break; 
			case 'Pop2000':
				userVariable = feature.properties.POP2000;
				break; 
			case 'Pop1990':
				userVariable = feature.properties.POP1990;
				break; 
			case 'Pop1980':
				userVariable = feature.properties.POP1980;
				break;
			case 'Growth2010':
				userVariable = popchange(feature.properties.POP2010, feature.properties.POP2000);
				break; 
			case 'Growth2000':
				userVariable = popchange(feature.properties.POP2000, feature.properties.POP1990);
				break; 
			case 'Growth1990':
				userVariable = popchange(feature.properties.POP1990, feature.properties.POP1980);
				break;
			case 'Whi2010':
				userVariable = feature.properties.WHI2010;
				break; 
			case 'Whi2000':
				userVariable = feature.properties.WHI2000;
				break;
			case 'Bla2010':
				userVariable = feature.properties.BLA2010;
				break; 
			case 'Bla2000':
				userVariable = feature.properties.BLA2000;
				break; 
			case 'Nat2010':
				userVariable = feature.properties.NAT2010;
				break; 
			case 'Nat2000':
				userVariable = feature.properties.NAT2000;
				break;
			case 'Asi2010':
				userVariable = feature.properties.ASI2010;
				break; 
			case 'Asi2000':
				userVariable = feature.properties.ASI2000;
				break; 				
			case 'Haw2010':
				userVariable = feature.properties.HAW2010;
				break; 
			case 'Haw2000':
				userVariable = feature.properties.HAW2000;
				break;
			case 'Mul2010':
				userVariable = feature.properties.MUL2010;
				break; 
			case 'Mul2000':
				userVariable = feature.properties.MUL2000;
				break;  
			case 'Lat2010':
				userVariable = feature.properties.LAT2010;
				break; 
			case 'Lat2000':
				userVariable = feature.properties.LAT2000;
				break;
			case 'WhiPer2010':
				userVariable = demos(feature.properties.POP2010, feature.properties.WHI2010);
				break; 
			case 'WhiPer2000':
				userVariable = demos(feature.properties.POP2000, feature.properties.WHI2000);	
				break;
			case 'BlaPer2010':
				userVariable = demos(feature.properties.POP2010, feature.properties.BLA2010);
				break; 
			case 'BlaPer2000':
				userVariable = demos(feature.properties.POP2000, feature.properties.BLA2000);
				break; 
			case 'NatPer2010':
				userVariable = demos(feature.properties.POP2010, feature.properties.NAT2010);
				break; 
			case 'NatPer2000':
				userVariable = demos(feature.properties.POP2000, feature.properties.NAT2000);
				break;
			case 'AsiPer2010':
				userVariable = demos(feature.properties.POP2010, feature.properties.ASI2010);
				break; 
			case 'AsiPer2000':
				userVariable = demos(feature.properties.POP2000, feature.properties.ASI2000);
				break; 				
			case 'HawPer2010':
				userVariable = demos(feature.properties.POP2010, feature.properties.HAW2010);
				break; 
			case 'HawPer2000':
				userVariable = demos(feature.properties.POP2000, feature.properties.HAW2000);
				break;
			case 'MulPer2010':
				userVariable = demos(feature.properties.POP2010, feature.properties.MUL2010);
				break; 
			case 'MulPer2000':
				userVariable = demos(feature.properties.POP2000, feature.properties.MUL2000);
				break;  
			case 'LatPer2010':
				userVariable = demos(feature.properties.POP2010, feature.properties.LAT2010);
				break; 
			case 'LatPer2000':
				userVariable = demos(feature.properties.POP2000, feature.properties.LAT2000);
				break;	
			case 'DemDiff16':
				userVariable = elections(feature.properties.DEM2016, feature.properties.REP2016, feature.properties.OTH2016);
				break;
			case 'RepDiff16':
				userVariable = elections2(feature.properties.DEM2016, feature.properties.REP2016, feature.properties.OTH2016);
				break;
			case 'DemDiff12':
				userVariable = elections(feature.properties.DEM2012, feature.properties.REP2012, feature.properties.OTH2012);
				break;
			case 'RepDiff12':
				userVariable = elections2(feature.properties.DEM2012, feature.properties.REP2012, feature.properties.OTH2012);
				break;
			case 'DemDiff08':
				userVariable = elections(feature.properties.DEM2008, feature.properties.REP2008, feature.properties.OTH2008);
				break;
			case 'RepDiff08':
				userVariable = elections2(feature.properties.DEM2008, feature.properties.REP2008, feature.properties.OTH2008);
				break;
			case 'DemPer16':
				userVariable = percentParty(feature.properties.OTH2016, feature.properties.REP2016, feature.properties.DEM2016);
				break;
			case 'RepPer16':
				userVariable = percentParty(feature.properties.OTH2016, feature.properties.DEM2016, feature.properties.REP2016);
				break;
			case 'OthPer16':
				userVariable = percentParty(feature.properties.DEM2016, feature.properties.REP2016, feature.properties.OTH2016);
				break;
			case 'DemPer12':
				userVariable = percentParty(feature.properties.OTH2012, feature.properties.REP2012, feature.properties.DEM2012);
				break;
			case 'RepPer12':
				userVariable = percentParty(feature.properties.OTH2012, feature.properties.DEM2012, feature.properties.REP2012);
				break;
			case 'OthPer12':
				userVariable = percentParty(feature.properties.DEM2012, feature.properties.REP2012, feature.properties.OTH2012);
				break;
			case 'DemPer08':
				userVariable = percentParty(feature.properties.OTH2008, feature.properties.REP2008, feature.properties.DEM2008);
				break;
			case 'RepPer08':
				userVariable = percentParty(feature.properties.OTH2008, feature.properties.DEM2008, feature.properties.REP2008);
				break;
			case 'OthPer08':
				userVariable = percentParty(feature.properties.DEM2008, feature.properties.REP2008, feature.properties.OTH2008);
				break;
			case 'electionDiffDem16':
				userVariable = electionsdiff(feature.properties.DEM2016, feature.properties.REP2016, feature.properties.OTH2016, feature.properties.DEM2012, feature.properties.REP2012, feature.properties.OTH2012);
				break;
			case 'electionDiffRep16':
				userVariable = electionsdiff2(feature.properties.DEM2016, feature.properties.REP2016, feature.properties.OTH2016, feature.properties.DEM2012, feature.properties.REP2012, feature.properties.OTH2012);
				break;
			case 'electionDiffDem12':
				userVariable = electionsdiff(feature.properties.DEM2012, feature.properties.REP2012, feature.properties.OTH2012, feature.properties.DEM2008, feature.properties.REP2008, feature.properties.OTH2008);
				break;
			case 'electionDiffRep12':
				userVariable = electionsdiff2(feature.properties.DEM2012, feature.properties.REP2012, feature.properties.OTH2012, feature.properties.DEM2012, feature.properties.REP2008, feature.properties.OTH2008);
				break;	
		}
		
		//Custom Map - get second user variable
		switch ($('#userVariable2').val()){
			case 'Pop2010':
				userVariable2 = feature.properties.POP2010;
				break; 
			case 'Pop2000':
				userVariable2 = feature.properties.POP2000;
				break; 
			case 'Pop1990':
				userVariable2 = feature.properties.POP1990;
				break; 
			case 'Pop1980':
				userVariable2 = feature.properties.POP1980;
				break;
			case 'Growth2010':
				userVariable2 = popchange(feature.properties.POP2010, feature.properties.POP2000);
				break; 
			case 'Growth2000':
				userVariable2 = popchange(feature.properties.POP2000, feature.properties.POP1990);
				break; 
			case 'Growth1990':
				userVariable2 = popchange(feature.properties.POP1990, feature.properties.POP1980);
				break;
			case 'Whi2010':
				userVariable2 = feature.properties.WHI2010;
				break; 
			case 'Whi2000':
				userVariable2 = feature.properties.WHI2000;
				break;
			case 'Bla2010':
				userVariable2 = feature.properties.BLA2010;
				break; 
			case 'Bla2000':
				userVariable2 = feature.properties.BLA2000;
				break; 
			case 'Nat2010':
				userVariable2 = feature.properties.NAT2010;
				break; 
			case 'Nat2000':
				userVariable2 = feature.properties.NAT2000;
				break;
			case 'Asi2010':
				userVariable2 = feature.properties.ASI2010;
				break; 
			case 'Asi2000':
				userVariable2 = feature.properties.ASI2000;
				break; 				
			case 'Haw2010':
				userVariable2 = feature.properties.HAW2010;
				break; 
			case 'Haw2000':
				userVariable2 = feature.properties.HAW2000;
				break;
			case 'Mul2010':
				userVariable2 = feature.properties.MUL2010;
				break; 
			case 'Mul2000':
				userVariable2 = feature.properties.MUL2000;
				break;  
			case 'Lat2010':
				userVariable2 = feature.properties.LAT2010;
				break; 
			case 'Lat2000':
				userVariable2 = feature.properties.LAT2000;
				break;
			case 'WhiPer2010':
				userVariable2 = demos(feature.properties.POP2010, feature.properties.WHI2010);
				break; 
			case 'WhiPer2000':
				userVariable2 = demos(feature.properties.POP2000, feature.properties.WHI2000);	
				break;
			case 'BlaPer2010':
				userVariable2 = demos(feature.properties.POP2010, feature.properties.BLA2010);
				break; 
			case 'BlaPer2000':
				userVariable2 = demos(feature.properties.POP2000, feature.properties.BLA2000);
				break; 
			case 'NatPer2010':
				userVariable2 = demos(feature.properties.POP2010, feature.properties.NAT2010);
				break; 
			case 'NatPer2000':
				userVariable2 = demos(feature.properties.POP2000, feature.properties.NAT2000);
				break;
			case 'AsiPer2010':
				userVariable2 = demos(feature.properties.POP2010, feature.properties.ASI2010);
				break; 
			case 'AsiPer2000':
				userVariable2 = demos(feature.properties.POP2000, feature.properties.ASI2000);
				break; 				
			case 'HawPer2010':
				userVariable2 = demos(feature.properties.POP2010, feature.properties.HAW2010);
				break; 
			case 'HawPer2000':
				userVariable2 = demos(feature.properties.POP2000, feature.properties.HAW2000);
				break;
			case 'MulPer2010':
				userVariable2 = demos(feature.properties.POP2010, feature.properties.MUL2010);
				break; 
			case 'MulPer2000':
				userVariable2 = demos(feature.properties.POP2000, feature.properties.MUL2000);
				break;  
			case 'LatPer2010':
				userVariable2 = demos(feature.properties.POP2010, feature.properties.LAT2010);
				break; 
			case 'LatPer2000':
				userVariable2 = demos(feature.properties.POP2000, feature.properties.LAT2000);
				break;	
			case 'DemDiff16':
				userVariable2 = elections(feature.properties.DEM2016, feature.properties.REP2016, feature.properties.OTH2016);
				break;
			case 'RepDiff16':
				userVariable2 = elections2(feature.properties.DEM2016, feature.properties.REP2016, feature.properties.OTH2016);
				break;
			case 'DemDiff12':
				userVariable2 = elections(feature.properties.DEM2012, feature.properties.REP2012, feature.properties.OTH2012);
				break;
			case 'RepDiff12':
				userVariable2 = elections2(feature.properties.DEM2012, feature.properties.REP2012, feature.properties.OTH2012);
				break;
			case 'DemDiff08':
				userVariable2 = elections(feature.properties.DEM2008, feature.properties.REP2008, feature.properties.OTH2008);
				break;
			case 'RepDiff08':
				userVariable2 = elections2(feature.properties.DEM2008, feature.properties.REP2008, feature.properties.OTH2008);
				break;
			case 'DemPer16':
				userVariable2 = percentParty(feature.properties.OTH2016, feature.properties.REP2016, feature.properties.DEM2016);
				break;
			case 'RepPer16':
				userVariable2 = percentParty(feature.properties.OTH2016, feature.properties.DEM2016, feature.properties.REP2016);
				break;
			case 'OthPer16':
				userVariable2 = percentParty(feature.properties.DEM2016, feature.properties.REP2016, feature.properties.OTH2016);
				break;
			case 'DemPer12':
				userVariable2 = percentParty(feature.properties.OTH2012, feature.properties.REP2012, feature.properties.DEM2012);
				break;
			case 'RepPer12':
				userVariable2 = percentParty(feature.properties.OTH2012, feature.properties.DEM2012, feature.properties.REP2012);
				break;
			case 'OthPer12':
				userVariable2 = percentParty(feature.properties.DEM2012, feature.properties.REP2012, feature.properties.OTH2012);
				break;
			case 'DemPer08':
				userVariable2 = percentParty(feature.properties.OTH2008, feature.properties.REP2008, feature.properties.DEM2008);
				break;
			case 'RepPer08':
				userVariable2 = percentParty(feature.properties.OTH2008, feature.properties.DEM2008, feature.properties.REP2008);
				break;
			case 'OthPer08':
				userVariable2 = percentParty(feature.properties.DEM2008, feature.properties.REP2008, feature.properties.OTH2008);
				break;
			case 'electionDiffDem16':
				userVariable2 = electionsdiff(feature.properties.DEM2016, feature.properties.REP2016, feature.properties.OTH2016, feature.properties.DEM2012, feature.properties.REP2012, feature.properties.OTH2012);
				break;
			case 'electionDiffRep16':
				userVariable2 = electionsdiff2(feature.properties.DEM2016, feature.properties.REP2016, feature.properties.OTH2016, feature.properties.DEM2012, feature.properties.REP2012, feature.properties.OTH2012);
				break;
			case 'electionDiffDem12':
				userVariable2 = electionsdiff(feature.properties.DEM2012, feature.properties.REP2012, feature.properties.OTH2012, feature.properties.DEM2008, feature.properties.REP2008, feature.properties.OTH2008);
				break;
			case 'electionDiffRep12':
				userVariable2 = electionsdiff2(feature.properties.DEM2012, feature.properties.REP2012, feature.properties.OTH2012, feature.properties.DEM2012, feature.properties.REP2008, feature.properties.OTH2008);
				break;	
		}
			
		//Change custom map colors
		if (currentMap == 'userMap'){
			if($('#radioyes').is(':checked')){
				return GetUserColor2(userVariable,userVariable2,$('#userNumber1').val(),$('#userNumber2').val());
			}
			else {
				return GetUserColor(userVariable,$('#userNumber1').val());
			}
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

//Get custom map colors for one variable
function GetUserColor(w,no1) {
	var userOperand1 = $('#userOperand1').val();
	var userNumber1 = $('#userNumber1').val();
	if (userOperand1 == 'greater'){
		comparisonText = '>'+ userNumber1;
		if (w > no1){
			return userColor1;
		}
		else{
			return userColor2;
		}	
	}
	if (userOperand1 == 'less'){
		comparisonText = '<'+ userNumber1;
		if (w < no1){
			return userColor1;
		}
		else{
			return userColor2;
		}	
	}	
}

//Get custom map colors for multiple variables
function GetUserColor2(w,z,no1,no2) {
	var userOperand1 = $('#userOperand1').val();
	var userOperand2 = $('#userOperand2').val();
	var userNumber1 = $('#userNumber1').val();
	var userNumber2 = $('#userNumber2').val();
	if ((userOperand1 == 'greater') && (userOperand2 == 'greater')){
		
		if($('#radioAnd').is(':checked')){
			comparisonText = '>'+ userNumber1 + '(var1) & >' + userNumber2+'(var2)';
			if ((w > no1) && (z > no2)){
				return userColor1;
			}
			else{
				return userColor2;
			}
		}

		if($('#radioOr').is(':checked')){
			comparisonText = '>'+ userNumber1 + '(var1) or >' + userNumber2+'(var2)';
			if ((w > no1) || (z > no2)){
				return userColor1;
			}
			else{
				return userColor2;
			}
		}				
	}
	if ((userOperand1 == 'less') && (userOperand2 == 'less')){
		
		if($('#radioAnd').is(':checked')){
			comparisonText = '<'+ userNumber1 + '(var1) & <' + userNumber2+'(var2)';
			if ((w < no1) && (z < no2)){
				return userColor1;
			}
			else{
				return userColor2;
			}
		}

		if($('#radioOr').is(':checked')){
			comparisonText = '<'+ userNumber1 + '(var1) or <' + userNumber2+'(var2)';
			if ((w < no1) || (z < no2)){
				return userColor1;
			}
			else{
				return userColor2;
			}
		}
	}
	if ((userOperand1 == 'greater') && (userOperand2 == 'less')){
		if($('#radioAnd').is(':checked')){
			comparisonText = '>'+ userNumber1 + '(var1) & <' + userNumber2+'(var2)';
			if ((w > no1) && (z < no2)){
				return userColor1;
			}
			else{
				return userColor2;
			}
		}
		if($('#radioOr').is(':checked')){
			comparisonText = '>'+ userNumber1 + '(var1) or <' + userNumber2+'(var2)';
			if ((w > no1) || (z < no2)){
				return userColor1;
			}
			else{
				return userColor2;
			}
		}
	}
	if ((userOperand1 == 'less') && (userOperand2 == 'greater')){
		if($('#radioAnd').is(':checked')){
			comparisonText = '<'+ userNumber1 + '(var1) & >' + userNumber2+'(var2)';
			if ((w < no1) && (z > no2)){
				return userColor1;
			}
			else{
				return userColor2;
			}	
		}
		
		if($('#radioOr').is(':checked')){
			comparisonText = '<'+ userNumber1 + '(var1) or >' + userNumber2+'(var2)';
			if ((w < no1) || (z > no2)){
				return userColor1;
			}
			else{
				return userColor2;
			}
		}	
	}	
}

//Get colors (two variables, light blue/red color scheme)
function GetColor(w,no1,no2,no3,no4,no5,no6,no7,no8) {
	return w > no1 ? '#104896' :
		w > no2  ? '#2d67b7' :
		w > no3  ? '#4880ce' :
		w > no4  ? '#87b9ff' :
		w > no5   ? '#f7d4d4' :
		w > no6   ? '#ff9696' :
		w > no7   ? '#ff6d6d' :
		w > no8   ? '#ff2b2b' : '#01347c';	
}

//Get colors (one variable, dark blue/red color scheme)
function GetColor2(w,no1,no2,no3,no4,no5,no6,no7,no8) {
	return w > no1 ? '#b30000' :
		w > no2  ? '#e60000' :
		w > no3  ? '#ff1a1a' :
		w > no4  ? '#ff4d4d' :
		w > no5   ? '#ff8080' :
		w > no6   ? '#ffb3b3' :
		w > no7   ? '#ffe6e6' :
		w > no8   ? '#9999ff' : '#00008B';
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

//Highlights features on mouseover
function highlightFeature(e) {	
	if (selectMode == false){
		var layer = e.target;
		layer.setStyle({
			weight: 4,
			color: highlightColor,
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
		clearStuff();
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
		color: selectionColor,
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
	var chartE2016 = new Chart(ctx, {
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
	var ctx = document.getElementById("chartGrowth");
	var chartE2016 = new Chart(ctx, {
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
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero:true
					}
				}]
			}
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
	var chartE2016 = new Chart(ctx, {
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
			},
			scales: {
				xAxes: [{
					ticks: {
						autoSkip:false
					}
				}]
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
			document.getElementById('chart_container').innerHTML = '<br><br><br><br><canvas id="chartE2016" height="90px" width="100px"></canvas><br><br><br><canvas id="chartE2012" height="90px" width="100px"></canvas>'+
			'<br><br><br><canvas id="chartE2008" height="90px" width="100px"></canvas>';
			document.getElementById('sbar-header').innerHTML = 'Selected Counties' +
			'<span class="dropdown" id="mapChooser"></span>';
			document.getElementById('mapChooser').innerHTML = '&nbsp;&nbsp;<button class="btn btn-primary dropdown-toggle" id="testbutton" type="button" data-toggle="dropdown"><i class="fa fa-bar-chart-o"></i><span class="caret"></span></button><ul class="dropdown-menu"><li><a href="#chartE2016">16 Graph</a></li><li><a href="#chartE2012">12 Graph</a></li><li><a href="#chartE2008">08 Graph</a></li></ul>';
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
			document.getElementById('chart_container').innerHTML = '<br><br><br><br><canvas id="chartE2016" height="90px" width="100px"></canvas><br><br><br><canvas id="chartE2012" height="90px" width="100px"></canvas>'+
			'<br><br><br><canvas id="chartE2008" height="90px" width="100px"></canvas><br><br>';
			election_data = [percentDem, percentRep, percentOth];
			document.getElementById('sbar-header').innerHTML = feature.properties.CO + ", " + feature.properties.ST +
			'<span class="dropdown" id="mapChooser"></span>';
			document.getElementById('mapChooser').innerHTML = '&nbsp;&nbsp;<button class="btn btn-primary dropdown-toggle" id="testbutton" type="button" data-toggle="dropdown"><i class="fa fa-bar-chart-o"></i><span class="caret"></span></button><ul class="dropdown-menu"><li><a href="#chartE2016">16 Graph</a></li><li><a href="#chartE2012">12 Graph</a></li><li><a href="#chartE2008">08 Graph</a></li></ul>';
			
			//Insert Chart
			insertElectionChart("chartE2016", '2016');
			election_data = [percentDem2, percentRep2, percentOth2];
			insertElectionChart("chartE2012", '2012');
			election_data = [percentDem3, percentRep3, percentOth3];
			insertElectionChart("chartE2008", '2008');
			
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
				selectionTable.row.add( [
					feature.properties.CO,
					feature.properties.ST,
					feature.properties.POP2010.toLocaleString(),
					feature.properties.POP2000.toLocaleString(),
					feature.properties.POP1990.toLocaleString(),
					feature.properties.POP1980.toLocaleString(),
					parseFloat(percentDem).toFixed(2) + "%",
					parseFloat(percentRep).toFixed(2) + "%",
					parseFloat(percentOth).toFixed(2) + "%",
					parseFloat(percentDem2).toFixed(2) + "%",
					parseFloat(percentRep2).toFixed(2) + "%",
					parseFloat(percentOth2).toFixed(2) + "%",
					parseFloat(percentDem3).toFixed(2) + "%",
					parseFloat(percentRep3).toFixed(2) + "%",
					parseFloat(percentOth3).toFixed(2) + "%",
					parseFloat((feature.properties.WHI2010 / (feature.properties.POP2010))*100).toFixed(2) + "%",
					parseFloat((feature.properties.WHI2000 / (feature.properties.POP2000))*100).toFixed(2) + "%",
					parseFloat((feature.properties.BLA2010 / (feature.properties.POP2010))*100).toFixed(2) + "%",
					parseFloat((feature.properties.BLA2000 / (feature.properties.POP2000))*100).toFixed(2) + "%",
					parseFloat((feature.properties.NAT2010 / (feature.properties.POP2010))*100).toFixed(2) + "%",
					parseFloat((feature.properties.NAT2000 / (feature.properties.POP2000))*100).toFixed(2) + "%",
					parseFloat((feature.properties.ASI2010 / (feature.properties.POP2010))*100).toFixed(2) + "%",
					parseFloat((feature.properties.ASI2000 / (feature.properties.POP2000))*100).toFixed(2) + "%",
					parseFloat((feature.properties.HAW2010 / (feature.properties.POP2010))*100).toFixed(2) + "%",
					parseFloat((feature.properties.HAW2000 / (feature.properties.POP2000))*100).toFixed(2) + "%",
					parseFloat((feature.properties.MUL2010 / (feature.properties.POP2010))*100).toFixed(2) + "%",
					parseFloat((feature.properties.MUL2000 / (feature.properties.POP2000))*100).toFixed(2) + "%",
					parseFloat((feature.properties.LAT2010 / (feature.properties.POP2010))*100).toFixed(2) + "%",
					parseFloat((feature.properties.LAT2000 / (feature.properties.POP2000))*100).toFixed(2) + "%",	
				] ).draw( false );
	

				if (feature.properties.ST != 'AK'){
					demTot += parseInt(feature.properties.DEM2016);	
					repTot += parseInt(feature.properties.REP2016);	
					othTot += parseInt(feature.properties.OTH2016);
					demTot2 += parseInt(feature.properties.DEM2012);
					repTot2 += parseInt(feature.properties.REP2012);
					othTot2 += parseInt(feature.properties.OTH2012);
					demTot3 += parseInt(feature.properties.DEM2008);
					repTot3 += parseInt(feature.properties.REP2008);
					othTot3 += parseInt(feature.properties.OTH2008);
				}
				
				findPer();
				findPer2();
				findPer3();
			}
			
			//Updates Election Data 
			if (selectMode === true) {		
				bindElectionChart();
				election_data = [demPer,repPer,othPer];
				insertElectionChart("chartE2016", '2016');
				election_data = [demPer2,repPer2,othPer2];
				insertElectionChart("chartE2012", '2012');
				election_data = [demPer3,repPer3,othPer3];
				insertElectionChart("chartE2008", '2008');
				bindElectionTable();
			}
		});
		
		//Behavior for right click events
		layer.on('contextmenu', function (e) {
			if (selected == true){
				var indextest = selectList.indexOf(feature.properties.CO + ', ' + feature.properties.ST + '<br>');
				if (indextest > -1) {
					selectList.splice(indextest, 1);
					selectionTable.row( indextest ).remove().draw();
				}
								
				if (feature.properties.ST != 'AK'){
					demTot -= parseInt(feature.properties.DEM2016);
					repTot -= parseInt(feature.properties.REP2016);
					othTot -= parseInt(feature.properties.OTH2016);
					demTot2 -= parseInt(feature.properties.DEM2012);
					repTot2 -= parseInt(feature.properties.REP2012);
					othTot2 -= parseInt(feature.properties.OTH2012);
					demTot3 -= parseInt(feature.properties.DEM2008);
					repTot3 -= parseInt(feature.properties.REP2008);
					othTot3 -= parseInt(feature.properties.OTH2008);
				}
				
				findPer();
				findPer2();
				findPer3();
			}
			
			//Updates Election Data 
			if (selectMode == true && selected == true) {
				bindElectionChart();
				election_data = [demPer,repPer,othPer];
				insertElectionChart("chartE2016", '2016');
				election_data = [demPer2,repPer2,othPer2];
				insertElectionChart("chartE2012", '2012');
				election_data = [demPer3,repPer3,othPer3];
				insertElectionChart("chartE2008", '2008');
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
			document.getElementById('chart_container2').innerHTML = '<br><br><br><br><br><br><br><br><br><br><canvas id="chartGrowth" height="90px" width="100px"></canvas>';	
		}
		
		layer.on('click', function (e) {
			
			//Insert Header
			document.getElementById('sbar-table').innerHTML = feature.properties.CO + ", " + feature.properties.ST +
			'<span class="dropdown" id="mapChooser2"></span>';
			document.getElementById('mapChooser2').innerHTML = '&nbsp;&nbsp;<button class="btn btn-primary dropdown-toggle" id="testbutton" type="button" data-toggle="dropdown"><i class="fa fa-bar-chart-o"></i><span class="caret"></span></button><ul class="dropdown-menu"><li><a href="#chartGrowth">1980-2010 Graph</a></li></ul>';
			
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
				document.getElementById('mapChooser2').innerHTML = '&nbsp;&nbsp;<button class="btn btn-primary dropdown-toggle" id="testbutton" type="button" data-toggle="dropdown"><i class="fa fa-bar-chart-o"></i><span class="caret"></span></button><ul class="dropdown-menu"><li><a href="#chartGrowth">1980-2010 Graph</a></li></ul>';
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
				insertCensusChart("chartE2016", '2016');
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
			document.getElementById('chart_container3').innerHTML = '<br><br><br><br><br><br><br><br><br><br><canvas id="chartD2010" height="100px" width="100px"></canvas><br><br><br><canvas id="chartD2000" height="100px" width="100px"></canvas><br>';	
		}
		
		//Calculate Percentages
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
			document.getElementById('mapChooser3').innerHTML = '&nbsp;&nbsp;<button class="btn btn-primary dropdown-toggle" id="testbutton" type="button" data-toggle="dropdown"><i class="fa fa-bar-chart-o"></i><span class="caret"></span></button><ul class="dropdown-menu"><li><a href="#chartD2010">2010 Graph</a></li><li><a href="#chartD2000">2000 Graph</a></li></ul>';
			
			//Insert Chart
			bindDemoChart();
			demo_data = [whitePer2010,blackPer2010,nativePer2010,asianPer2010,pacificPer2010,multiracialPer2010,hispanicPer2010];
			insertDemoChart("chartD2010",'2010');
			demo_data = [whitePer2000,blackPer2000,nativePer2000,asianPer2000,pacificPer2000,multiracialPer2000,hispanicPer2000];
			insertDemoChart("chartD2000",'2000');
			
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
				document.getElementById('mapChooser3').innerHTML = '&nbsp;&nbsp;<button class="btn btn-primary dropdown-toggle" id="testbutton" type="button" data-toggle="dropdown"><i class="fa fa-bar-chart-o"></i><span class="caret"></span></button><ul class="dropdown-menu"><li><a href="#chartD2010">2010 Graph</a></li><li><a href="#chartD2000">2000 Graph</a></li></ul>';
				
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
				insertDemoChart("chartD2010",'2010');
				demo_data = [perWhite2000,perBlack2000,perNative2000,perAsian2000,perPacific2000,perMultiracial2000,perHispanic2000];
				insertDemoChart("chartD2000",'2000');
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
				insertDemoChart('chartD2010','2010');
				demo_data = [whitePer2000,blackPer2000,nativePer2000,asianPer2000,pacificPer2000,multiracialPer2000,hispanicPer2000];
				insertDemoChart('chartD2000','2000');
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
			var percentOth = (oth/total)*100;
			
			if (currentMap == 'thirdparty2016' || currentMap == 'thirdparty2012' || currentMap == 'thirdparty2008'){
				layer.bindTooltip("<b><u class = 'popup_title'><big>" + feature.properties.CO 
			+ ", " + feature.properties.ST
			+ "</b></u></big><br><div class = 'popup_body'> <b>% Third Party:&nbsp;</b>" + (percentOth).toFixed(2) + "%"
			, {permanent: false});
				
			}
			
			else{
			layer.bindTooltip("<b><u class = 'popup_title'><big>" + feature.properties.CO 
			+ ", " + feature.properties.ST
			+ "</b></u></big><br><div class = 'popup_body'> <b>Democrat:&nbsp;</b>" + (percentDem).toFixed(2) + "%"
			+ "<br> <b>Republican:&nbsp;</b>" + Number(percentRep).toFixed(2) + "%</div>"
			, {permanent: false});
			}
		}
		
		function displayUserLables(){
			layer.bindTooltip("<b><u class = 'popup_title'><big>" + feature.properties.CO 
			+ ", " + feature.properties.ST
			+ "</b></u></big>");
		}
				
		function displayElectionLables2(dem, rep, oth, dem2, rep2, oth2){
			
			var party;
			var total = dem+rep+oth;
			var percentDem = (dem/total)*100;
			var percentRep = (rep/total)*100;
			var diff = percentDem-percentRep;
			
			var total2 = dem2+rep2+oth2;
			var percentDem2 = (dem2/total2)*100;
			var percentRep2 = (rep2/total2)*100;
			var diff2 = percentDem2-percentRep2;
			
			var diff3 = diff-diff2;
			
			if (diff > diff2){
				party = 'D';
			}
			else {
				party = 'R';
			}
			layer.bindTooltip("<b><u class = 'popup_title'><big>" + feature.properties.CO 
			+ ", " + feature.properties.ST
			+ "</b></u></big><br><div class = 'popup_body'> <b>Change:&nbsp;</b>" + '+' + Math.abs(diff3).toFixed(2) + "% " + party
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
		
		if (hashMatch == "election2016"){
			displayElectionLables(feature.properties.DEM2016, feature.properties.REP2016, feature.properties.OTH2016);
		}
		if (hashMatch == "election2012"){
			displayElectionLables(feature.properties.DEM2012, feature.properties.REP2012, feature.properties.OTH2012);
		}
		if (hashMatch == "election2008"){
			displayElectionLables(feature.properties.DEM2008, feature.properties.REP2008, feature.properties.OTH2008);
		}
		if (hashMatch == "thirdparty2016"){
			displayElectionLables(feature.properties.DEM2016, feature.properties.REP2016, feature.properties.OTH2016);
		}
		if (hashMatch == "thirdparty2012"){
			displayElectionLables(feature.properties.DEM2012, feature.properties.REP2012, feature.properties.OTH2012);
		}
		if (hashMatch == "thirdparty2008"){
			displayElectionLables(feature.properties.DEM2008, feature.properties.REP2008, feature.properties.OTH2008);
		}
		if (hashMatch == "diff2016"){
			displayElectionLables2(feature.properties.DEM2016, feature.properties.REP2016, feature.properties.OTH2016, feature.properties.DEM2012, feature.properties.REP2012, feature.properties.OTH2012);
		}
		if (hashMatch == "diff2012"){
			displayElectionLables2(feature.properties.DEM2012, feature.properties.REP2012, feature.properties.OTH2012, feature.properties.DEM2008, feature.properties.REP2008, feature.properties.OTH2008);
		}
		if (hashMatch == "census2010"){
			displayCensusLables(feature.properties.POP2010, feature.properties.POP2000);
		}
		if (hashMatch == "census2000"){
			displayCensusLables(feature.properties.POP2000, feature.properties.POP1990);
		}
		if (hashMatch == "census1990"){
			displayCensusLables(feature.properties.POP1990, feature.properties.POP1980);
		}
		if (hashMatch == 'demo2010'){
			displayDemoLables(feature.properties.POP2010, feature.properties.WHI2010);
		}
		if (hashMatch == 'demo2000'){
			displayDemoLables(feature.properties.POP2000, feature.properties.WHI2000);
		}
		if (hashMatch == 'black2010'){
			displayDemoLables(feature.properties.POP2010, feature.properties.BLA2010);
		}
		if (hashMatch == 'black2000'){
			displayDemoLables(feature.properties.POP2000, feature.properties.BLA2000);
		}
		if (hashMatch == 'hispanic2010'){
			displayDemoLables(feature.properties.POP2010, feature.properties.LAT2010);
		}
		if (hashMatch == 'hispanic2000'){
			displayDemoLables(feature.properties.POP2000, feature.properties.LAT2000);
		}
		if (hashMatch == 'asian2010'){
			displayDemoLables(feature.properties.POP2010, feature.properties.ASI2010);
		}
		if (hashMatch == 'asian2000'){
			displayDemoLables(feature.properties.POP2000, feature.properties.ASI2000);
		}
		if (hashMatch == 'multiracial2010'){
			displayDemoLables(feature.properties.POP2010, feature.properties.MUL2010);
		}
		if (hashMatch == 'multiracial2000'){
			displayDemoLables(feature.properties.POP2000, feature.properties.MUL2000);
		}
		if (hashMatch == 'native2010'){
			displayDemoLables(feature.properties.POP2010, feature.properties.NAT2010);
		}
		if (hashMatch == 'native2000'){
			displayDemoLables(feature.properties.POP2000, feature.properties.NAT2000);
		}
		if (hashMatch == 'pacific2010'){
			displayDemoLables(feature.properties.POP2010, feature.properties.HAW2010);
		}
		if (hashMatch == 'pacific2000'){
			displayDemoLables(feature.properties.POP2000, feature.properties.HAW2000);
		}
		
		$('#ex21').slider().on('change', function(ev){	
		layer.closeTooltip();
			var newVal2 = $('#ex21').data('slider').getValue();
			if (newVal2 == 2016 && ethnicGroup == 'president'){
				displayElectionLables(feature.properties.DEM2016, feature.properties.REP2016, feature.properties.OTH2016);
			}
			if (newVal2 == 2012 && ethnicGroup == 'president'){
				displayElectionLables(feature.properties.DEM2012, feature.properties.REP2012, feature.properties.OTH2012);
			}
			if (newVal2 == 2008 && ethnicGroup == 'president'){
				displayElectionLables(feature.properties.DEM2008, feature.properties.REP2008, feature.properties.OTH2008);
			}
			if (newVal2 == 2016 && ethnicGroup == 'thirdparty'){
				displayElectionLables(feature.properties.DEM2016, feature.properties.REP2016, feature.properties.OTH2016);
			}
			if (newVal2 == 2012 && ethnicGroup == 'thirdparty'){
				displayElectionLables(feature.properties.DEM2012, feature.properties.REP2012, feature.properties.OTH2012);
			}
			if (newVal2 == 2008 && ethnicGroup == 'thirdparty'){
				displayElectionLables(feature.properties.DEM2008, feature.properties.REP2008, feature.properties.OTH2008);
			}
			if (newVal2 == 2016 && ethnicGroup == 'votechange'){
				displayElectionLables2(feature.properties.DEM2016, feature.properties.REP2016, feature.properties.OTH2016, feature.properties.DEM2012, feature.properties.REP2012, feature.properties.OTH2012);
			}
			if (newVal2 == 2012 && ethnicGroup == 'votechange'){
				displayElectionLables2(feature.properties.DEM2012, feature.properties.REP2012, feature.properties.OTH2012, feature.properties.DEM2008, feature.properties.REP2008, feature.properties.OTH2008);
			}

		});
		
		$('#ex22').slider().on('change', function(ev){	
		layer.closeTooltip();
			var newVal2 = $('#ex22').data('slider').getValue();
			if (newVal2 == 2010 && ethnicGroup == 'White'){
				displayDemoLables(feature.properties.POP2010, feature.properties.WHI2010);
			}
			if (newVal2 == 2010 && ethnicGroup == 'Black'){
				displayDemoLables(feature.properties.POP2010, feature.properties.BLA2010);
			}
			if (newVal2 == 2010 && ethnicGroup == 'Latino/Hispanic'){
				displayDemoLables(feature.properties.POP2010, feature.properties.LAT2010);
			}
			if (newVal2 == 2010 && ethnicGroup == 'Asian'){
				displayDemoLables(feature.properties.POP2010, feature.properties.ASI2010);
			}
			if (newVal2 == 2010 && ethnicGroup == 'Multiracial'){
				displayDemoLables(feature.properties.POP2010, feature.properties.MUL2010);
			}
			if (newVal2 == 2010 && ethnicGroup == 'N.American/Alaskan'){
				displayDemoLables(feature.properties.POP2010, feature.properties.NAT2010);
			}
			if (newVal2 == 2010 && ethnicGroup == 'Hawaiian/Pac.Isl.'){
				displayDemoLables(feature.properties.POP2010, feature.properties.HAW2010);
			}
			if (newVal2 == 2000 && ethnicGroup == 'White'){
				displayDemoLables(feature.properties.POP2000, feature.properties.WHI2000);
			}
			if (newVal2 == 2000 && ethnicGroup == 'Black'){
				displayDemoLables(feature.properties.POP2000, feature.properties.BLA2000);
			}
			if (newVal2 == 2000 && ethnicGroup == 'Latino/Hispanic'){
				displayDemoLables(feature.properties.POP2000, feature.properties.LAT2000);
			}
			if (newVal2 == 2000 && ethnicGroup == 'Asian'){
				displayDemoLables(feature.properties.POP2000, feature.properties.ASI2000);
			}
			if (newVal2 == 2000 && ethnicGroup == 'Multiracial'){
				displayDemoLables(feature.properties.POP2000, feature.properties.MUL2000);
			}
			if (newVal2 == 2000 && ethnicGroup == 'N.American/Alaskan'){
				displayDemoLables(feature.properties.POP2000, feature.properties.NAT2000);
			}
			if (newVal2 == 2000 && ethnicGroup == 'Hawaiian/Pac.Isl.'){
				displayDemoLables(feature.properties.POP2000, feature.properties.HAW2000);
			}
			if (newVal2 == 2010 && ethnicGroup == 'popgrowth'){
				displayCensusLables(feature.properties.POP2010, feature.properties.POP2000);
			}
			if (newVal2 == 2000 && ethnicGroup == 'popgrowth'){
				displayCensusLables(feature.properties.POP2000, feature.properties.POP1990);
			}
			if (newVal2 == 1990 && ethnicGroup == 'popgrowth'){
				displayCensusLables(feature.properties.POP1990, feature.properties.POP1980);
			}
		});
		
		$('.layercontrol').click(function(){
			layer.closeTooltip();
		});
			
		$('#election_16').click(function(){
			displayElectionLables(feature.properties.DEM2016, feature.properties.REP2016, feature.properties.OTH2016);
		});
		
		$('#third_16').click(function(){
			displayElectionLables(feature.properties.DEM2016, feature.properties.REP2016, feature.properties.OTH2016);
		});
		
		$('#diff_16').click(function(){
			displayElectionLables2(feature.properties.DEM2016, feature.properties.REP2016, feature.properties.OTH2016, feature.properties.DEM2012, feature.properties.REP2012, feature.properties.OTH2012);
		});
		
		$('#census_10').click(function(){
			displayCensusLables(feature.properties.POP2010, feature.properties.POP2000);
		});

		$('#demo_10').click(function(){
			displayDemoLables(feature.properties.POP2010, feature.properties.WHI2010);
		});	
		
		$('#black_10').click(function(){
			displayDemoLables(feature.properties.POP2010, feature.properties.BLA2010);
		});

		$('#hispanic_10').click(function(){
			displayDemoLables(feature.properties.POP2010, feature.properties.LAT2010);
		});
				
		$('#asian_10').click(function(){
			displayDemoLables(feature.properties.POP2010, feature.properties.ASI2010);
		});
			
		$('#multiracial_10').click(function(){
			displayDemoLables(feature.properties.POP2010, feature.properties.MUL2010);
		});
		
		$('#native_10').click(function(){
			displayDemoLables(feature.properties.POP2010, feature.properties.NAT2010);
		});
				
		$('#pacific_10').click(function(){
			displayDemoLables(feature.properties.POP2010, feature.properties.HAW2010);
		});	
		
		$('#customMapSubmit').click(function(){
			displayUserLables();
		});		
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
	zoomControl: false,
	preferCanvas: true,
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

//Map options - toggles legend
document.getElementById('disable_legend').addEventListener("click", function(){
	if (document.getElementById('disable_legend').checked) {
        $('.legend').css("display", "none");
    } 
	else {
        $('.legend').css("display", "inline");
    }
});

//-------------------------------------------------MAP ELEMENTS--------------------------------------------------//

//Adds scale to map
L.control.scale().addTo(map);
new L.Control.Zoom({ position: 'topright' }).addTo(map);

//Adds legend to map - Election Layers
function createLegend9(color1,color2,color3,color4,color5,color6,color7,color8,color9){
	return '<table id="legendTable" cellspacing="0" style="width:100%"><tr><td class="color" id="colorlegend1"></td><td>'+color9+'%+</td>' +
		'</tr><tr><td class="color" id="colorlegend2"></td><td>'+color8+'%</td></tr>' +
		'</tr><tr><td class="color" id="colorlegend3"></td><td>'+color7+'%</td></tr>' +
		'</tr><tr><td class="color" id="colorlegend4"></td><td>'+color6+'%</td></tr>' +
		'</tr><tr><td class="color" id="colorlegend5"></td><td>'+color5+'%</td></tr>' +
		'</tr><tr><td class="color" id="colorlegend6"></td><td>'+color4+'%</td></tr>' +
		'</tr><tr><td class="color" id="colorlegend7"></td><td>'+color3+'%</td></tr>' +
		'</tr><tr><td class="color" id="colorlegend8"></td><td>'+color2+'%</td></tr>' +
		'</tr><tr><td class="color" id="colorlegend9"></td><td>'+color1+'%</td></tr>'
}

function createLegend8(color1,color2,color3,color4,color5,color6,color7,color8){
	return '<table id="legendTable" cellspacing="0" style="width:100%"><tr><td class="color" id="electionlegend1"></td><td>'+color8+'%+ D</td>' +
		'</tr><tr><td class="color" id="electionlegend2"></td><td>'+color7+'% D</td></tr>' +
		'</tr><tr><td class="color" id="electionlegend3"></td><td>'+color6+'% D</td></tr>' +
		'</tr><tr><td class="color" id="electionlegend4"></td><td>'+color5+'% D</td></tr>' +
		'</tr><tr><td class="color" id="electionlegend5"></td><td>'+color4+'% R</td></tr>' +
		'</tr><tr><td class="color" id="electionlegend6"></td><td>'+color3+'% R</td></tr>' +
		'</tr><tr><td class="color" id="electionlegend7"></td><td>'+color2+'% R</td></tr>' +
		'</tr><tr><td class="color" id="electionlegend8"></td><td>'+color1+'% R</td></tr>'
}

function createUserLegend(){
	return '<table id="legendTable" cellspacing="0" style="width:100%"><tr><td class="color" id="userlegend1"></td><td>'+comparisonText+'</td>' +
		'</tr><tr><td class="color" id="userlegend2"></td><td>Everything else</td></tr>';
	
}

userLegend = L.control({position: 'bottomright'});
userLegend.onAdd = function (map) {
	var div = L.DomUtil.create('div', 'legend');	
	div.innerHTML += createUserLegend();		
	return div;
};

electionLegend = L.control({position: 'bottomright'});
electionLegend.onAdd = function (map) {
	var div = L.DomUtil.create('div', 'legend');
	
	if (currentMap == 'thirdparty2016' || currentMap == 'thirdparty2012' || currentMap == 'thirdparty2008'){
		div.innerHTML += createLegend9('0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8');		
	return div;
	}
	
	if (currentMap == 'diff2016' || currentMap == 'diff2012'){
		div.innerHTML += createLegend8('20','10-20','5-10','0-5','0-5','5-10','10-20','20');
	return div;
	}
	
	else {
		div.innerHTML += createLegend8('30','20-30','10-20','0-10','0-10','10-20','20-30','30');
	return div;
	}
};

//Adds legend to map - Census Layers
censusLegend = L.control({position: 'bottomright'});
censusLegend.onAdd = function (map) {
	var div = L.DomUtil.create('div', 'legend');
	
	div.innerHTML += createLegend9('-5','-5-0','0-5','5-10','10-15','15-20','20-25','25-30','30');	
	return div;
};

//Adds legend to map - Demographics Layers
demoLegend = L.control({position: 'bottomright'});
demoLegend.onAdd = function (map) {
	var div = L.DomUtil.create('div', 'legend');
	
	if (currentMap == 'demo2010' || currentMap == 'demo2000'){
		div.innerHTML += createLegend9('0-60','60-65','65-70','70-75','75-80','80-85','85-90','90-95','95');
	return div;
	}

	if (currentMap == 'black2010' || currentMap == 'black2000'){
		div.innerHTML += createLegend9('0-6','6-8','8-10','10-12','12-14','14-16','16-18','18-20','20');
	return div;
	}
	
	if (currentMap == 'hispanic2010'|| currentMap == 'hispanic2000'){
		div.innerHTML += createLegend9('0-9','9-12','12-15','15-18','18-21','21-24','24-27','27-30','30');
	return div;
	}
	
	if (currentMap == 'asian2010'|| currentMap == 'asian2000' || currentMap == 'multiracial2010' || currentMap == 'multiracial2000'){
		div.innerHTML += createLegend9('0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8');
	return div;
	}
	
	if (currentMap == 'native2010'|| currentMap == 'native2000'){
		div.innerHTML += createLegend9('0-.5','.5-1','1-1.5','1.5-2','2-2.5','2.5-3','3-3.5','3.5-4','4');
	return div;
	}
	
	if (currentMap == 'pacific2010'|| currentMap == 'pacific2000'){
		div.innerHTML += createLegend9('0-0.2','0.2-0.4','0.4-0.6','0.6-0.8','0.8-1.0','1.0-1.2','1.2-1.4','1.4-1.6','1.6');
	return div;
	}
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
ethnicGroup = 'president';
document.getElementById('mapTitleText').innerHTML = '<center contenteditable="true">2016: PRESIDENTIAL ELECTION RESULTS</center>';

function layerControls(curMap, maptitle, curLegend, ethnic){
	clearStuff();
	
	//Change layer
	currentMap = curMap;
	ethnicGroup = ethnic;
	counties2010.setStyle(defaultStyle);
	
	//Change title
	document.getElementById('chart_container').innerHTML = '<canvas id="chartE2016" height="90px" width="100px"></canvas>';
	document.getElementById('mapTitleText').innerHTML = '<center contenteditable="true">'+maptitle+'</center>';
	
	//Change legend
	map.removeControl(currentLegend);
    currentLegend = curLegend;
    curLegend.addTo(map);	
}

$('#election_16').click(function(){
	layerControls('election2016','2016: PRESIDENTIAL ELECTION RESULTS',electionLegend,'president');
	addHash = "&" + currentMap;
});

$('#census_10').click(function(){
	layerControls('census2010','2010: POPULATION GROWTH SINCE 2000',censusLegend,'popgrowth');
	addHash = "&" + currentMap;	
});

$('#demo_10').click(function(){
	layerControls('demo2010','2010: PERCENT WHITE',demoLegend,'White');
	addHash = "&" + currentMap;
});

$('#black_10').click(function(){
	layerControls('black2010','2010: PERCENT BLACK',demoLegend,'Black');
	addHash = "&" + currentMap;
});

$('#hispanic_10').click(function(){
	layerControls('hispanic2010','2010: PERCENT LATINO/HISPANIC',demoLegend,'Latino/Hispanic');
	addHash = "&" + currentMap;
});

$('#asian_10').click(function(){
	layerControls('asian2010','2010: PERCENT ASIAN',demoLegend,'Asian');
	addHash = "&" + currentMap;
});

$('#multiracial_10').click(function(){
	layerControls('multiracial2010','2010: PERCENT MULTIRACIAL',demoLegend,'Multiracial');
	addHash = "&" + currentMap;
});

$('#native_10').click(function(){
	layerControls('native2010','2010: PERCENT NATIVE AMERICAN/ALASKAN',demoLegend,'N.American/Alaskan');
	addHash = "&" + currentMap;
});

$('#pacific_10').click(function(){
	layerControls('pacific2010','2010: PERCENT NATIVE HAWAIIAN/PACIFIC ISLANDER',demoLegend,'Hawaiian/Pac.Isl.');
	addHash = "&" + currentMap;
});

$('#third_16').click(function(){
	layerControls('thirdparty2016','2016: PERCENT THIRD PARTY',electionLegend,'thirdparty');
	addHash = "&" + currentMap;
});

$('#diff_16').click(function(){
	layerControls('diff2016','2016: VOTE SWING FROM 2012',electionLegend,'votechange');
	addHash = "&" + currentMap;
});

$('#customMapSubmit').click(function(){
	layerControls('userMap',customTitleVal,userLegend,'');
	$('#userlegend1').css("background-color", userColor1);
	$('#userlegend2').css("background-color", userColor2);
	$("#ex21").slider('disable');
	$("#ex22").slider('disable');
	$('.tooltip-inner,.slider-tick-label,.tooltip-arrow' ).css("display", "none");
	$('#linkShare').prop('disabled', true);
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
	else{
		selectMode = false;
		selectList = [];
		selectionTable.clear().draw();
		counties2010.setStyle({
			weight: 1,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7
		});	
	}
});

//Clear selection
function clearStuff(){
	selectList = [];
	selectionTable.clear().draw();
	demTot = 0;
	repTot = 0;
	othTot = 0;
	demTot2 = 0;
	repTot2 = 0;
	othTot2 = 0;
	demTot3 = 0;
	repTot3 = 0;
	othTot3 = 0;
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
	$('.tooltip-inner,.slider-tick-label,.tooltip-arrow').css("display", "inline");
	$('#linkShare').prop('disabled', false);
	clearStuff();
});

//Clear selection on clear button
$('.clearSelection').click(function(){
	clearStuff();
});

$(document).ready(function(){
  $('.dropdown-submenu a.test').on("click", function(e){
	$(this).next('ul').toggle();
    e.stopPropagation();
    e.preventDefault();
  });
});

//-------------------------------------------------TIME SLIDER--------------------------------------------------//

if ($(window).width() > 500){
	var timeslider = L.control({position: 'topright'});
	var timeslider2 = L.control({position: 'topright'});
}
else {
	var timeslider = L.control({position: 'topleft'});
	var timeslider2 = L.control({position: 'topleft'});
}

timeslider.onAdd = function (map) {	
	timeslideDiv = L.DomUtil.create('div', 'slider2');
	timeslideDiv.innerHTML = '<input id="ex21" type="text" data-provide="slider" data-slider-ticks="[2008,2012,2016]" data-slider-ticks-labels=\'["2008", "2012", "2016"]\' data-slider-min="2008" data-slider-max="2016" data-slider-step="4" data-slider-value="2016" data-slider-tooltip="always" data-slider-orientation="vertical" />';	
	L.DomEvent.disableClickPropagation(timeslideDiv);
	return timeslideDiv;
};

map.addControl(timeslider);

timeslider2.onAdd = function (map) {	
	timeslideDiv2 = L.DomUtil.create('div', 'slider3');
	timeslideDiv2.innerHTML = '<input id="ex22" type="text" data-provide="slider" data-slider-ticks="[1990,2000,2010]" data-slider-ticks-labels=\'["1990", "2000", "2010"]\' data-slider-min="1990" data-slider-max="2010" data-slider-step="10" data-slider-value="2010" data-slider-tooltip="always"data-slider-orientation="vertical" />';	
	L.DomEvent.disableClickPropagation(timeslideDiv2);
	return timeslideDiv2;
};

map.addControl(timeslider2);

function mobileSlider(){
	if ($(window).width() > 500){
		tooltipPosition = "left";
		return tooltipPosition;
	}
	if ($(window).width() < 500){
		tooltipPosition = "right";
		return tooltipPosition;
	}
}

mobileSlider();

$("#ex21").slider({
	tooltip_position: tooltipPosition,
	ticks_labels: ["", "", ""],
	value: 2016,
	reversed : true,
});

$("#ex22").slider({
	tooltip_position: tooltipPosition,
	ticks_labels: ["", "", ""],
	value: 2010,
	reversed : true,
});

$('#diff_16').click(function(){
	$("#ex21").slider({
		tooltip_position: tooltipPosition,
		ticks: [2012,2016],
		ticks_labels: ["", "", ""],
		value: 2016,
		reversed : true,
	});
});

$('#election_16, #third_16').click(function(){
	$("#ex21").slider({
		tooltip_position: tooltipPosition,
		ticks: [2008,2012,2016],
		ticks_labels: ["", "", ""],
		value: 2016,
		reversed : true,
	});
});

$('#census_10').click(function(){
	$("#ex22").slider({
		tooltip_position: tooltipPosition,
		ticks: [1990,2000,2010],
		ticks_labels: ["", "", ""],
		value: 2010,
		reversed : true,
	});
});

$('#demo_10, #black_10, #hispanic_10, #asian_10, #multiracial_10, #native_10, #pacific_10').click(function(){
	$("#ex22").slider({
		tooltip_position: tooltipPosition,
		ticks: [2000,2010],
		ticks_labels: ["", "", ""],
		value: 2010,
		reversed : true,
	});
});

//Original Slider - Change Layers/Legend/Title
$('#ex21').slider().on('change', function(ev){
	selectList = [];
	selectionTable.clear().draw();
    
	var newVal = $('#ex21').data('slider').getValue();
	
	if (newVal == 2016){
		if (ethnicGroup == 'thirdparty'){
			layerControls('thirdparty2016','2016: PERCENT THIRD PARTY',electionLegend,'thirdparty');
		}
		if (ethnicGroup == 'president'){
			layerControls('election2016','2016: PRESIDENTIAL ELECTION RESULTS',electionLegend,'president');
		}
		if (ethnicGroup == 'votechange'){
			layerControls('diff2016','2016: VOTE SWING FROM 2012',electionLegend,'votechange');
		}
	}
	
	if (newVal == 2012){
		if (ethnicGroup == 'thirdparty'){
			layerControls('thirdparty2012','2012: PERCENT THIRD PARTY',electionLegend,'thirdparty');
		}
		if (ethnicGroup == 'president'){
			layerControls('election2012','2012: PRESIDENTIAL ELECTION RESULTS',electionLegend,'president');
		}
		if (ethnicGroup == 'votechange'){
			layerControls('diff2012','2012: VOTE SWING FROM 2008',electionLegend,'votechange');
		}
	}
	
	if (newVal == 2008){
		if (ethnicGroup == 'thirdparty'){
			layerControls('thirdparty2008','2008: PERCENT THIRD PARTY',electionLegend,'thirdparty');
		}
		if (ethnicGroup == 'president'){
			layerControls('election2008','2008: PRESIDENTIAL ELECTION RESULTS',electionLegend,'president');
		}
	}
});

$('.layercontrol').on('click', function(){
	if (currentLegend == electionLegend){
		$(".slider3").css("display", "none");
		$(".slider2").css("display", "inline");
		$("#ex21").slider('refresh');
	}
	else{
		$(".slider2").css("display", "none");
		$(".slider3").css("display", "inline");
		$("#ex22").slider('refresh');	
	}
	
	$('#ex21').slider().on('change', function(ev){
		selectList = [];
		selectionTable.clear().draw();
    
		var newVal = $('#ex21').data('slider').getValue();
	
		if (newVal == 2016){
			if (ethnicGroup == 'thirdparty'){
				layerControls('thirdparty2016','2016: PERCENT THIRD PARTY',electionLegend,'thirdparty');
			}
			if (ethnicGroup == 'president'){
				layerControls('election2016','2016: PRESIDENTIAL ELECTION RESULTS',electionLegend,'president');
			}
			if (ethnicGroup == 'votechange'){
				layerControls('diff2016','2016: VOTE SWING FROM 2012',electionLegend,'votechange');
			}
		}
		
		if (newVal == 2012){
			if (ethnicGroup == 'thirdparty'){
				layerControls('thirdparty2012','2012: PERCENT THIRD PARTY',electionLegend,'thirdparty');
			}
			if (ethnicGroup == 'president'){
				layerControls('election2012','2012: PRESIDENTIAL ELECTION RESULTS',electionLegend,'president');
			}
			if (ethnicGroup == 'votechange'){
				layerControls('diff2012','2012: VOTE SWING FROM 2008',electionLegend,'votechange');
			}
		}
		
		if (newVal == 2008){
			if (ethnicGroup == 'thirdparty'){
				layerControls('thirdparty2008','2008: PERCENT THIRD PARTY',electionLegend,'thirdparty');
			}
			if (ethnicGroup == 'president'){
				layerControls('election2008','2008: PRESIDENTIAL ELECTION RESULTS',electionLegend,'president');
			}
		}
	});

	//Replacement Slider - Change Layers/Legend/Title
	$('#ex22').slider().on('change', function(ev){
		selectList = [];
		selectionTable.clear().draw();
    
		var newVal2 = $('#ex22').data('slider').getValue();
	
		if (newVal2 == 2010){
			if (ethnicGroup == 'popgrowth'){
				layerControls('census2010','2010: POPULATION GROWTH SINCE 2000',censusLegend,'popgrowth');
			}
			if (ethnicGroup == 'White'){
				layerControls('demo2010','2010: PERCENT WHITE',demoLegend,'White');
			}
			if (ethnicGroup == 'Black'){
				layerControls('black2010','2010: PERCENT BLACK',demoLegend,'Black');
			}
			if (ethnicGroup == 'Latino/Hispanic'){
				layerControls('hispanic2010','2010: PERCENT LATINO/HISPANIC',demoLegend,'Latino/Hispanic');
			}
			if (ethnicGroup == 'Asian'){
				layerControls('asian2010','2010: PERCENT ASIAN',demoLegend,'Asian');
			}
			if (ethnicGroup == 'Multiracial'){
				layerControls('multiracial2010','2010: PERCENT MULTIRACIAL',demoLegend,'Multiracial');
			}
			if (ethnicGroup == 'N.American/Alaskan'){
				layerControls('native2010','2010: PERCENT NATIVE AMERICAN/ALASKAN',demoLegend,'N.American/Alaskan');
			}
			if (ethnicGroup == 'Hawaiian/Pac.Isl.'){
				layerControls('pacific2010','2010: PERCENT NATIVE HAWAIIAN/PACIFIC ISLANDER',demoLegend,'Hawaiian/Pac.Isl.');
			}
		}
		
		if (newVal2 == 2000){
			if (ethnicGroup == 'popgrowth'){
				layerControls('census2000','2000: POPULATION GROWTH SINCE 1990',censusLegend,'popgrowth');
			}
			if (ethnicGroup == 'White'){
				layerControls('demo2000','2000: PERCENT WHITE',demoLegend,'White');
			}
			if (ethnicGroup == 'Black'){
				layerControls('black2000','2000: PERCENT BLACK',demoLegend,'Black');
			}
			if (ethnicGroup == 'Latino/Hispanic'){
				layerControls('hispanic2000','2000: PERCENT LATINO/HISPANIC',demoLegend,'Latino/Hispanic');
			}
			if (ethnicGroup == 'Asian'){
				layerControls('asian2000','2000: PERCENT ASIAN',demoLegend,'Asian');
			}
			if (ethnicGroup == 'Multiracial'){
				layerControls('multiracial2000','2000: PERCENT MULTIRACIAL',demoLegend,'Multiracial');
			}
			if (ethnicGroup == 'N.American/Alaskan'){
				layerControls('native2000','2000: PERCENT NATIVE AMERICAN/ALASKAN',demoLegend,'N.American/Alaskan');
			}
			if (ethnicGroup == 'Hawaiian/Pac.Isl.'){
				layerControls('pacific2000','2000: PERCENT NATIVE HAWAIIAN/PACIFIC ISLANDER',demoLegend,'Hawaiian/Pac.Isl.');
			}
		}
		
		if (newVal2 == 1990){
			if (ethnicGroup == 'popgrowth'){
				layerControls('census1990','1990: POPULATION GROWTH SINCE 1980',censusLegend,'popgrowth');
			}
		}
	});
});

//-------------------------------------------------URL MANIPULATION--------------------------------------------------//

//Change URL hash depending on open map
if (hashMatch == "census2010"){
	$(function(){
		$('#census_10').click();
		$('#ex22').slider('setValue', 2010);
		layerControls('census2010','2010: POPULATION GROWTH SINCE 2000',censusLegend,'popgrowth');
		addHash = "&" + currentMap;
	});
}

if (hashMatch == "census2000"){
	$(function(){
		$('#census_10').click();
		$('#ex22').slider('setValue', 2000);
		layerControls('census1990','2000: POPULATION GROWTH SINCE 1990',censusLegend,'popgrowth');
		addHash = "&" + currentMap;
	});
}

if (hashMatch == "census1990"){
	$(function(){
		$('#census_10').click();
		$('#ex22').slider('setValue', 1990);
		layerControls('census1990','1990: POPULATION GROWTH SINCE 1980',censusLegend,'popgrowth');
		addHash = "&" + currentMap;
	});
}

if (hashMatch == "election2016"){
	$(function(){
		$('#election_16').click();
		$('#ex22,#ex21').slider('setValue', 2016);
		layerControls('election2016','2016: PRESIDENTIAL ELECTION RESULTS',electionLegend,'president');
		addHash = "&" + currentMap;
	});
}
if (hashMatch == "election2012"){
	$(function(){
		$('#election_16').click();
		$('#ex22,#ex21').slider('setValue', 2012);
		layerControls('election2012','2012: PRESIDENTIAL ELECTION RESULTS',electionLegend,'president');
		addHash = "&" + currentMap;
	});
}
if (hashMatch == "election2008"){
	$(function(){
		$('#election_06').click();
		$('#ex22,#ex21').slider('setValue', 2008);
		layerControls('election2008','2008: PRESIDENTIAL ELECTION RESULTS',electionLegend,'president');
		addHash = "&" + currentMap;
	});
}

if (hashMatch == "thirdparty2016"){
	$(function(){
		$('#third_16').click();
		$('#ex22').slider('setValue', 2016);
		layerControls('thirdparty2016','2016: PERCENT THIRD PARTY',electionLegend,'thirdparty');
		addHash = "&" + currentMap;
	});
}

if (hashMatch == "thirdparty2012"){
	$(function(){
		$('#third_16').click();
		$('#ex22,#ex21').slider('setValue', 2012);
		layerControls('thirdparty2012','2012: PERCENT THIRD PARTY',electionLegend,'thirdparty');
		addHash = "&" + currentMap;
	});
}
if (hashMatch == "thirdparty2008"){
	$(function(){
		$('#third_16').click();
		$('#ex22,#ex21').slider('setValue', 2008);
		layerControls('thirdparty2008','2008: PERCENT THIRD PARTY',electionLegend,'thirdparty');
		addHash = "&" + currentMap;
	});
}
if (hashMatch == "diff2016"){
	$(function(){
		$('#diff_16').click();
		$('#ex22,#ex21').slider('setValue', 2016);
		layerControls('diff2016','2016: VOTE SWING FROM 2012',electionLegend,'votechange');
		addHash = "&" + currentMap;
	});
}
if (hashMatch == "diff2012"){
	$(function(){
		$('#diff_16').click();
		$('#ex22,#ex21').slider('setValue', 2012);
		layerControls('diff2012','2012: VOTE SWING FROM 2008',electionLegend,'votechange');
		addHash = "&" + currentMap;
	});
}
if (hashMatch == 'demo2010'){
   $(function(){
		$('#demo_10').click();
		$('#ex22').slider('setValue', 2010);
		layerControls('demo2010','2010: PERCENT WHITE',demoLegend,'White');
		addHash = "&" + currentMap;
	});
}
if (hashMatch == 'demo2000'){
   $(function(){
		$('#demo_10').click();
		$('#ex22').slider('setValue', 2000);
		layerControls('demo2000','2000: PERCENT WHITE',demoLegend,'White');
		addHash = "&" + currentMap;
	});
}
if (hashMatch == 'black2010'){
   $(function(){
		$('#demo_10').click();
		$('#ex22').slider('setValue', 2010);
		layerControls('black2010','2010: PERCENT BLACK',demoLegend,'Black');
		addHash = "&" + currentMap;
	});
}
if (hashMatch == 'black2000'){
   $(function(){
		$('#demo_10').click();
		$('#ex22').slider('setValue', 2000);
		layerControls('black2000','2000: PERCENT BLACK',demoLegend,'Black');
		addHash = "&" + currentMap;
	});
}
if (hashMatch == 'hispanic2010'){
   $(function(){
		$('#demo_10').click();
		$('#ex22').slider('setValue', 2010);
		layerControls('hispanic2010','2010: PERCENT LATINO/HISPANIC',demoLegend,'Latino/Hispanic');
		addHash = "&" + currentMap;
	});
}
if (hashMatch == 'hispanic2000'){
   $(function(){
		$('#demo_10').click();
		$('#ex22').slider('setValue', 2000);
		layerControls('hispanic2000','2000: PERCENT LATINO/HISPANIC',demoLegend,'Latino/Hispanic');
		addHash = "&" + currentMap;
	});
}
if (hashMatch == 'asian2010'){
	$(function(){
		$('#demo_10').click();
		$('#ex22').slider('setValue', 2010);
		layerControls('asian2010','2010: PERCENT ASIAN',demoLegend,'Asian');
		addHash = "&" + currentMap;
	});
}
if (hashMatch == 'asian2000'){
	$(function(){
		$('#demo_10').click();
		$('#ex22').slider('setValue', 2000);
		layerControls('asian2000','2000: PERCENT ASIAN',demoLegend,'Asian');
		addHash = "&" + currentMap;
	});
}
if (hashMatch == 'multiracial2010'){
   $(function(){
		$('#demo_10').click();
		$('#ex22').slider('setValue', 2010);
		layerControls('multiracial2010','2010: PERCENT MULTIRACIAL',demoLegend,'Multiracial');
		addHash = "&" + currentMap;
	});
}
if (hashMatch == 'multiracial2000'){
   $(function(){
		$('#demo_10').click();
		$('#ex22').slider('setValue', 2000);
		layerControls('multiracial2000','2000: PERCENT MULTIRACIAL',demoLegend,'Multiracial');
		addHash = "&" + currentMap;
	});
}
if (hashMatch == 'native2010'){
	$(function(){
	    $('#demo_10').click();
	    $('#ex22').slider('setValue', 2010);
	    layerControls('native2010','2010: PERCENT NATIVE AMERICAN/ALASKAN',demoLegend,'N.American/Alaskan');
	    addHash = "&" + currentMap;
	});
}
if (hashMatch == 'native2000'){
	$(function(){
		$('#demo_10').click();
		$('#ex22').slider('setValue', 2000);
		layerControls('native2000','2000: PERCENT NATIVE AMERICAN/ALASKAN',demoLegend,'N.American/Alaskan');
		addHash = "&" + currentMap;
	});
}
if (hashMatch == 'pacific2010'){
   $(function(){
	    $('#demo_10').click();
	    $('#ex22').slider('setValue', 2010);
	    layerControls('pacific2010','2010: PERCENT NATIVE HAWAIIAN/PACIFIC ISLANDER',demoLegend,'Hawaiian/Pac.Isl.');
	    addHash = "&" + currentMap;
	});
}
if (hashMatch == 'pacific2000'){
   $(function(){
	    $('#demo_10').click();
	    $('#ex22').slider('setValue', 2000);
	    layerControls('pacific2000','2000: PERCENT NATIVE HAWAIIAN/PACIFIC ISLANDER',demoLegend,'Hawaiian/Pac.Isl.');
	    addHash = "&" + currentMap;
	});
}

//Copy URL link to clipboard on click
new Clipboard('#copyLink');
$('#linkShare').click(function(){
	var url = String(window.location);
	hashMatch = url.substring(url.lastIndexOf('&')+1);
	var urlReplace = url.replace(hashMatch, currentMap);
	$( "#shareLinkURL" ).html(urlReplace);
	var fd = urlReplace.replace('#', '%23');
	var fe = fd.replace('&', '%26');
	$("#twitter").attr("href", "https://twitter.com/share?url=" + fe + "&amp;text=VizMapper&amp;hashtags=interactivemaps");	
	$("#tumblr").attr("href", "http://www.tumblr.com/share/link?url=" + fe + "&amp;title=VizMapper&amp;");	
	$("#fb").attr("href", "http://www.facebook.com/sharer.php?u=" + fe);
	$("#linkedin").attr("href", "http://www.linkedin.com/shareArticle?mini=true&amp;url=" + fe);
	$("#reddit").attr("href", "http://reddit.com/submit?url=" + fe + "&amp;title=VizMapper&amp;");		
});

//Replace hash in URL according to geographic location and opened map
addHash = "&" + currentMap;
hash = new L.Hash(map);
stringURL = window.location.hash;
hashMatch = stringURL.substring(stringURL.lastIndexOf('&')+1);







