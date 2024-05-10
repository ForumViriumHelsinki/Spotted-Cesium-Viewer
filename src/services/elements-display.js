import { useGlobalStore } from '../stores/global-store.js';

export default class ElementsDisplay {
	constructor() {
		this.store = useGlobalStore();
	}

/**
 * Changes the visibility of label elements 
 */
toggleLabels( visibility ) {

    document.getElementById( "white-label" ).style.visibility = visibility;
    document.getElementById( "yellow-label" ).style.visibility = visibility;
    document.getElementById( "yellowgreen-label" ).style.visibility = visibility;
    document.getElementById( "lightgreen-label" ).style.visibility = visibility;
    document.getElementById( "green-label" ).style.visibility = visibility;
    document.getElementById( "ldarkgreen-label" ).style.visibility = visibility;
    document.getElementById( "darkgreen-label" ).style.visibility = visibility;
    document.getElementById( "vdarkgreen-label" ).style.visibility = visibility;
} 

/**
 * Change visibility of hsy landcover bar plots
 * 
 * */
toggleLandCoverBarPlots( visibility ) {

    document.getElementById( 'plotInhabitantContainer' ).style.visibility = visibility;
    document.getElementById( 'plotContainer' ).style.visibility = visibility;
    document.getElementById( "greenAreaContainer" ).style.visibility = visibility;

}

/**
 * Set the visibility status of the pie chart and select element.
 * 
 * @param {boolean} isVisible - Whether to make the pie chart and select element visible (true) or hidden (false).
 */
setPieChartVisibility( isVisible ) {

    const plotContainer = document.getElementById("plotPieContainer");
    const selectContainer = document.getElementById("selectContainer");
    
    plotContainer.style.visibility = isVisible ? "visible" : "hidden";
    selectContainer.style.visibility = isVisible ? "visible" : "hidden";

}
	/**
 * Set the disabled state of specified elements.
 * 
 * @param {boolean} isDisabled - Whether to set the elements as disabled (true) or enabled (false).
 */
 setElementDisabledState( isDisabled ) {
    document.getElementById("showTreeToggle").disabled = isDisabled;
}

/**
 * Changes the display of land cover elements when user switches between land cover and ndvi view
 */
 	setElementsDisplay( elements, display ) {

    	elements.forEach(( elementId ) => {
        	const element = document.getElementById( elementId );
        	if ( element ) {

            	element.style.display = display;
        
        	}
    	});
	}	

	/**
 * Function to toggle the visibility of the "Return" button
 */
 	toggleReturnButtonVisibility() {
    if ( this.store.levelsVisited.length &&  this.store.levelsVisited[  this.store.levelsVisited.length - 1 ] !== "MajorDistricts" ) {
  
        document.getElementById( 'returnButton' ).style.visibility = 'visible';
  
    } else {
  
        document.getElementById( 'returnButton' ).style.visibility = 'hidden';
  
    }
}
}