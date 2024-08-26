import { useGlobalStore } from '../stores/global-store.js';

export default class ElementsDisplay {
	constructor() {
		this.store = useGlobalStore();
	}

	districtElementsDisplay( display ) {

		setElementsDisplay( districtElements, display );

	}	

	setTreeElementsDisplay( display ) {

		setElementsDisplay( treeElements, display );

	}

	setPlotElementsDisplay( display ) {

		setElementsDisplay( plotElements, display );

	}

	setNDVIElementsDisplay( display ) {

		setElementsDisplay( ndviElements, display );

	}

	setPopulationPressureChildElementsDisplay( display ) {

		setElementsDisplay( populationPressureElements, display );

	}

	setPopulationPressureElementsDisplay( display ) {

		setElementsDisplay( activePPElements, display );

	}

	setNDVI2023ElementsDisplay( display ) {

		setElementsDisplay( ndvi2023Elements, display );

	}

	setAreasNDVIElementsDisplay( display ) {

		setElementsDisplay( areasNDVIElements, display );

	}	

	setSRNDVIElementsDisplay( display ) {

		setElementsDisplay( SRNDVIElements, display );

	}		

	setAreasNDVIChildElementsDisplay( display ) {

		setElementsDisplay( areasNDVIChildElements, display );

	}

	setBuildingDisplay( display ) {

		setElementsDisplay( buildingElements, display );

	}

	toggleNDVIArea( display ) {

		document.getElementById( 'ndviAreaContainer' ).style.visibility = display;
		document.getElementById( 'plotContainer' ).style.visibility = display;

	}				

	/**
 * Change visibility of hsy landcover bar plots
 * 
 * */
	toggleLandCoverBarPlots( visibility ) {

		document.getElementById( 'plotInhabitantContainer' ).style.visibility = visibility;
		document.getElementById( 'plotContainer' ).style.visibility = visibility;
		document.getElementById( 'greenAreaContainer' ).style.visibility = visibility;

	}

	/**
 * Change visibility of plots
 * 
 * */
	togglePlots( visibility ) {

		document.getElementById( 'plotPieContainer' ).style.visibility = visibility;
		document.getElementById( 'chartContainer' ).style.visibility = visibility;
		document.getElementById( 'ndviChartContainer' ).style.visibility = visibility;

		if ( document.getElementById( 'showGreenToggle' ).checked || visibility == 'hidden' ) {
        
			document.getElementById( 'greenAreaContainer' ).style.visibility = visibility;
			document.getElementById( 'sliderContainer' ).style.visibility = visibility;

		}

		if ( visibility == 'hidden' || document.getElementById( 'showTreeToggle' ).checked ) {

			document.getElementById( 'plotInhabitantContainer' ).style.visibility = visibility;
			document.getElementById( 'plotContainer' ).style.visibility = visibility;
			document.getElementById( 'greenAreaContainer' ).style.visibility = visibility;

		} 

		if ( document.getElementById( 'showNDVIToggle' ).checked || document.getElementById( 'NDVI2023Toggle' ).checked ) {

			document.getElementById( 'plotContainer' ).style.visibility = visibility;
			document.getElementById( 'ndviSlider' ).style.visibility = visibility;
			document.getElementById( 'ndviSliderValue' ).style.visibility = visibility;

		}

		if ( document.getElementById( 'areasNDVIToggle' ).checked ) {

        
			Array.from( document.getElementById( 'ndviYlreContainer' ).children ).forEach( el => el.style.visibility = 'hidden' );


		}

	}
	/**
 * Set the visibility status of the pie chart and select element.
 * 
 * @param {boolean} isVisible - Whether to make the pie chart and select element visible (true) or hidden (false).
 */
	setPieChartVisibility( isVisible ) {

		const plotContainer = document.getElementById( 'plotPieContainer' );
		plotContainer.style.visibility = isVisible ? 'visible' : 'hidden';

	}

	/**
 * Set the visibility status of the ndvi chart and select element.
 * 
 */
	setNDVIVisibility( visibility ) {

		document.getElementById( 'plotContainer' ).style.visibility = visibility;
		document.getElementById( 'ndviSliderContainer' ).style.visibility = visibility;   

	}	
	/**
 * Set the disabled state of specified elements.
 * 
 * @param {boolean} isDisabled - Whether to set the elements as disabled (true) or enabled (false).
 */
	setElementDisabledState( isDisabled ) {
		document.getElementById( 'showTreeToggle' ).disabled = isDisabled;
	}


	/**
 * Function to toggle the visibility of the "Return" button
 */
 	toggleReturnButtonVisibility() {
		if ( this.store.levelsVisited.length &&  this.store.levelsVisited[  this.store.levelsVisited.length - 1 ] !== 'MajorDistricts' ) {
  
			document.getElementById( 'returnButton' ).style.visibility = 'visible';
  
		} else {
  
			document.getElementById( 'returnButton' ).style.visibility = 'hidden';
  
		}
	}

	/**
 * Resets the switches to their default state
 */
	resetSwitches( ) {

		const elements = [
			'showPlotSwitch',
			'showPlotLabel',
			'showNDVISwitch',
			'showNDVILabel',
			'NDVI2023Switch',
			'NDVI2023Label',
			'showTreesSwitch',
			'showTreesLabel',
			'SubDistrictNDVISwitch',
			'SubDistrictNDVILabel',
			'PopulationGridSwitch',
			'PopulationGridLabel',
			'TreeRegistrySwitch',
			'TreeRegistryLabel',
			'YLRESwitch',
			'YLRELabel'		
		];

		document.getElementById( 'showPlotToggle' ).checked = true;

		document.getElementById( 'showTreeToggle' ).checked = false;
		document.getElementById( 'showNDVIToggle' ).checked = false;
		document.getElementById( 'NDVI2023Toggle' ).checked = false;
		document.getElementById( 'showGreenToggle' ).checked = false;
		document.getElementById( 'areasNDVIToggle' ).checked = false;
		document.getElementById( 'SubDistrictNDVIToggle' ).checked = false;
		document.getElementById( 'TreeRegistryToggle' ).checked = false;
		document.getElementById( 'PopulationGridToggle' ).checked = false;
		document.getElementById( 'YLREToggle' ).checked = false;

		this.setElementDisabledState( true );
		setElementsDisplay( elements, 'none' );

		const elements2 = [
			'showPlotSwitch',
			'showPlotLabel',
			'areasNDVISwitch',
			'areasNDVILabel',
			'showGreenSwitch',
			'showGreenLabel'
		];
		setElementsDisplay( elements2, 'inline-block' );

		document.getElementById( 'showNDVIToggle' ).disabled = true;
		document.getElementById( 'NDVI2023Toggle' ).disabled = true;

		//	document.getElementById( "printToggle" ).checked = true;
		document.getElementById( 'returnButton' ).style.visibility = 'hidden';
		document.getElementById( 'plotContainer' ).style.visibility = 'hidden';
		document.getElementById( 'greenAreaContainer' ).style.visibility = 'hidden';
		//document.getElementById( 'ndviYlreContainer' ).style.visibility = 'hidden';

		//    setPrintVisible( );
	//	this.togglePlots( 'hidden' );    

  	this.store.showPlot = true;
		this.store.print = true;

	}	
}

const setElementsDisplay = ( elements, display ) => {


	elements.forEach( ( elementId ) => {
		const element = document.getElementById( elementId );
        	if ( element ) {

            	element.style.display = display;
        
        	}
	} );

};

const treeElements = [
	'showTreesSwitch',
	'showTreesLabel'
];

const plotElements = [
	'showPlotSwitch',
	'showPlotLabel'
];

const ndviElements = [
	'showNDVISwitch',
	'showNDVILabel'
];

const ndvi2023Elements = [
	'NDVI2023Switch', 
	'NDVI2023Label'
];

const populationPressureElements = [
	'showPlanSwitch',
	'showPlanLabel',
	'showGreenSwitch',
	'showGreenLabel',
	'showProtectedSwitch',
	'showProtectedLabel',
	'showForestedAreasSwitch',
	'showForestedAreasLabel',
	'showForestedAreas1mSwitch',
	'showForestedAreas1mLabel'				
];

const districtElements = [
	'showPlotSwitch',
	'showPlotLabel',
	'showNDVISwitch',
	'showNDVILabel', 
	'showTreesSwitch',
	'showTreesLabel'            
];

const activePPElements = [
	'activatePopulationPressureSwitch',
	'activatePopulationPressureLabel'           
];

const areasNDVIElements = [
	'areasNDVISwitch',
	'areasNDVILabel'           
];

const SRNDVIElements = [
	'SRSwitch',
	'SRLabel'
];

const areasNDVIChildElements = [
	'YLRESwitch',
	'YLRELabel', 
	'TreeRegistrySwitch',
	'TreeRegistryLabel',	
	'SubDistrictNDVISwitch',
	'SubDistrictNDVILabel',
	'PopulationGridSwitch', 
	'PopulationGridLabel',         
];

const buildingElements = [
	'buildingSwitch',
	'buildingLabel'       
];