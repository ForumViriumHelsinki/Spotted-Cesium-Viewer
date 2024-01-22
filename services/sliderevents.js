/**
 * This function is triggered by a slider event and it checks the value of the slider to determine which function to execute
 *
 * @param { Object } event the slider event
 */
function sliderEvents( event ) {
		
    // If the slider value is "print", call the printEvent function.
    if ( event.target.value == 'print' ) {

    //    printEvent();

    }
      
    // If the slider value is "showPlot", call the showPlotEvent function.
    if ( event.target.value == 'showPlot' && districtsVisited.length ) {

        showPlotEvent();

    }	

    // If the slider value is "showNDVI", call the showNDVI function.
    if ( event.target.value == 'showNDVI' ) {
        
        showNDVIEvent();
            
    } 

    // If the slider value is "showGreen", call the showGreen function.
    if ( event.target.value == 'showGreen' ) {
        
        showGreenEvent();
            
    } 

    // If the slider value is "showTree", call the showTreeEvent function.
    if ( event.target.value == 'showTree' ) {

        showTreeEvent();

    }    

    // If the slider value is "showVegetation", call the showVegetationEvent function.
    if ( event.target.value == 'showVegetation' ) {

        showVegetationEvent();

    }

    // If the slider value is "showWater", call the showWaterEvent function.
    if ( event.target.value == 'showWater' ) {

        showWaterEvent();
    
    }	

    // If the slider value is "showFields", call the showFields function.
    if ( event.target.value == 'showFields' ) {
        
        showFieldsEvent();

    }  

    // If the slider value is "showOtherNature", call the showOtherNature function.
    if ( event.target.value == 'showOtherNature' ) {
        
        showOtherNatureEvent();
    
    } 

    // If the slider value is "showBuilt", call the showBuilt function.
    if ( event.target.value == 'showBuilt' ) {
        
        showBuiltEvent();
        
    } 
                
}

/**
 * This function to show or hide green area entities on the map based on the toggle button state
 *
 */
function showGreenEvent() {

    const showGreen = document.getElementById( "showGreenToggle" ).checked;

    if ( showGreen ) {

        loadGreenAreas();

    } else { 
        
        hideDataSourceByName( "GreenAreas" );
        document.getElementById( "plotPieContainer" ).style.visibility = 'hidden';
        document.getElementById( "sliderContainer" ).style.visibility = 'hidden';

    }

}

/**
 * This function to show or hide NDVI entities on the map based on the toggle button state
 *
 */
async function showNDVIEvent() {
    // Get the state of the showNDVI toggle button
    const showNDVI = document.getElementById( "showNDVIToggle" ).checked;

    // Get the labels for colors
    const labels = document.querySelectorAll( ".color-label.active" );

    const elements = [
        'showVegetationSwitch',
        'showVegetationLabel',
        'showOtherNatureSwitch',
        'showOtherNatureLabel',
        'showWaterSwitch',
        'showWaterLabel',
        'showFieldsSwitch',
        'showFieldsLabel',
        'showBuiltSwitch',
        'showBuiltLabel',
        'showTreesSwitch',
        'showTreesLabel'
    ];

    // Rest of your showNDVIEvent function code

    if ( showNDVI ) {

        // Toggle the visibility of the labels
        labels.forEach( label => {
            label.style.display = "block";
        });

        setElementsDisplay( elements, 'none' );
        setElementDisabledState( true );

        if ( majorDistrict && !dataSourceWithNameExists( "ndvi2018-06-14" )) {

            await loadNDVI( '2018-06-14' );
            await loadNDVI( '2020-06-21' );
            await loadNDVI( '2022-06-26' );

        } else {

            updateNDVIDataSources( );

        }

    } else {

        // Hide the labels
        labels.forEach( label => {
            label.style.display = "none";
        } );


        setElementsDisplay( elements, 'inline-block' );
        document.getElementById( "plotContainer" ).style.visibility = 'hidden';
        document.getElementById( 'ndviSliderContainer' ).style.visibility = 'hidden';
        setElementDisabledState( false );
        hideDataSourceByName( "ndvi" );

    }
}



/**
 * This function returns only if all hsy land cover
 */
function statusOfHSYToggles( ) {

    if ( !document.getElementById( "showFieldsToggle" ).checked &&     !document.getElementById( "showTreeToggle" ).checked
    &&     !document.getElementById( "showVegetationToggle" ).checked
    &&     !document.getElementById( "showWaterToggle" ).checked
    &&     !document.getElementById( "showOtherNatureToggle" ).checked
    &&     !document.getElementById( "showBuiltSwitch" ).checked
    ) {

        return false;
    }
    
    return true;
}


/**
 * This function to show or hide field entities on the map based on the toggle button state
 *
 */
function showFieldsEvent( ) {

    const elements = [
        'showNDVISwitch',
        'showNDVILabel'
    ];

    // Get the state of the showFields toggle button
    const showFields = document.getElementById( "showFieldsToggle" ).checked;

    // If showTrees toggle is on
    if ( showFields ) {

        document.getElementById("showNDVIToggle").disabled = true;

        // If a postal code is available, load trees for that postal code
        if ( majorDistrict && !dataSourceWithNameExists( "Fields" ) ) {

            loadFields( majorDistrict );

        } else {

            createVegetationBarPlotPerInhabitant( districtsVisited[ districtsVisited.length - 1 ] );
            showDataSourceByName( "Fields" );

        }

        setElementsDisplay( elements, 'none' );
        
    } else { // If showTrees toggle is off
        
        createVegetationBarPlotPerInhabitant( districtsVisited[ districtsVisited.length - 1 ] );
        hideDataSourceByName( "Fields" );
        document.getElementById("showNDVIToggle").disabled = false;
        if ( !areAnySwitchesOn() ) {

            setElementsDisplay( elements, 'inline-block' );
            toggleLandCoverBarPlots( 'hidden' );

        }

    }

}


/**
 * This function to shows all datasources to user.
 *
 */
function showAllDataSources( ) {

    // Set the show property of all data sources to true to show the entities
    viewer.dataSources._dataSources.forEach( function( dataSource ) {

        dataSource.show = true;

    });  
}

/**
 * This function is called when the Object details button is clicked
 *
 */
function printEvent( ) {

    console.log( "Set the print to: " + String( document.getElementById( "printToggle" ).checked ) );
    const print = document.getElementById( "printToggle" ).checked;

    // If print is not selected, hide the print container, search container, georeference container, and search button
    if ( !print ) {

        document.getElementById( 'printContainer' ).style.visibility = 'hidden';

    } else { // Otherwise, make the print container visible

        setPrintVisible( );

    }

}

/**
 * This function is called when the "Display Plot" toggle button is clicked
 *
 */
function showPlotEvent( ) {

    // Get the value of the "Show Plot" toggle button
    const showPlots = document.getElementById( "showPlotToggle" ).checked;
    
    // Hide the plot and its controls if the toggle button is unchecked
    if ( !showPlots ) {

        showPlot = false;
        togglePlots( 'hidden' );

    } else { // Otherwise, show the plot and its controls if the toggle button is checked and the plot is already loaded

        togglePlots( 'visible' );
        showPlot = true;

    }

}

/**
 * This function handles the toggle event for showing or hiding the tree layer on the map.
 *
 */
function showTreeEvent( ) {

    const elements = [
        'showNDVISwitch',
        'showNDVILabel'
    ];

    // Get the current state of the toggle button for showing nature areas.
    const showTree = document.getElementById( "showTreeToggle" ).checked;

    createVegetationBarPlotPerInhabitant( districtsVisited[ districtsVisited.length - 1 ] );

    if ( showTree ) {

        document.getElementById("showNDVIToggle").disabled = true;
        setElementsDisplay( elements, 'none' );

        if ( majorDistrict && !dataSourceWithNameExists( "Trees" ) ) {

            loadTreesSequentially( majorDistrict );

        } else {

            showDataSourceByName( "Trees" );
        }

    } else {

        document.getElementById("showNDVIToggle").disabled = false;
        hideDataSourceByName( "Trees" );

        if ( !areAnySwitchesOn() ) {

            setElementsDisplay( elements, 'inline-block' );
            toggleLandCoverBarPlots( 'hidden' );

        }

    }

}

/**
 * This function handles the toggle event for showing or hiding the vegetation layer on the map.
 *
 */
function showVegetationEvent( ) {

    const elements = [
        'showNDVISwitch',
        'showNDVILabel'
    ];

    // Get the current state of the toggle button for showing nature areas.
    const showVegetation = document.getElementById( "showVegetationToggle" ).checked;

    createVegetationBarPlotPerInhabitant( districtsVisited[ districtsVisited.length - 1 ] );

    if ( showVegetation ) {

        document.getElementById("showNDVIToggle").disabled = true;
        setElementsDisplay( elements, 'none' );

        // If the toggle button is checked, enable the toggle button for showing the nature area heat map.
        //document.getElementById("showVegetationHeatToggle").disabled = false;

        // If there is a postal code available, load the nature areas for that area.

        if ( majorDistrict && !dataSourceWithNameExists( "Vegetation" ) ) {

            loadVegetationSequentially( majorDistrict );

        } else {

            showDataSourceByName( "Vegetation" );
        }

    } else {

        hideDataSourceByName( "Vegetation" );
        document.getElementById("showNDVIToggle").disabled = false;

        if ( !areAnySwitchesOn() ) {

            setElementsDisplay( elements, 'inline-block' );
            toggleLandCoverBarPlots( 'hidden' );

        }

    }

}

/**
 * This function handles the toggle event for showing or hiding the water areas layer on the map.
 *
 */
function showWaterEvent( ) {

    const elements = [
        'showNDVISwitch',
        'showNDVILabel'
    ];

    // Get the current state of the toggle button for showing nature areas.
    const showWater = document.getElementById( "showWaterToggle" ).checked;
    createVegetationBarPlotPerInhabitant( districtsVisited[ districtsVisited.length - 1 ] );

    if ( showWater ) {

        document.getElementById("showNDVIToggle").disabled = true;
        setElementsDisplay( elements, 'none' );

        // If the toggle button is checked, enable the toggle button for showing the nature area heat map.
        //document.getElementById("showloadWater").disabled = false;

        // If there is a postal code available, load the nature areas for that area.
        if ( majorDistrict && !dataSourceWithNameExists( "Water" ) ) {
            
            loadWater( majorDistrict );

        } else {

            showDataSourceByName( "Water" );

        }

    } else {

        hideDataSourceByName( "Water" );
        document.getElementById("showNDVIToggle").disabled = false;

        if ( !areAnySwitchesOn() ) {

            setElementsDisplay( elements, 'inline-block' );
            toggleLandCoverBarPlots( 'hidden' );

        }

    }

}

/**
 * This function handles the toggle event for showing or hiding the other nature datasource on the map.
 *
 */
function showOtherNatureEvent( ) {

    const elements = [
        'showNDVISwitch',
        'showNDVILabel'
    ];

    // Get the current state of the toggle button for showing nature areas.
    const showOtherNature = document.getElementById( "showOtherNatureToggle" ).checked;
    createVegetationBarPlotPerInhabitant( districtsVisited[ districtsVisited.length - 1 ] );

    if ( showOtherNature) {

        setElementsDisplay( elements, 'none' );

        document.getElementById("showNDVIToggle").disabled = true;

        // If there is a postal code available, load the nature areas for that area.
        if ( majorDistrict && !dataSourceWithNameExists( "OtherNature" ) ) {

            loadOtherNatureSequentially( majorDistrict );

        } else {

            showDataSourceByName( "OtherNature" );

        }

    } else {

        hideDataSourceByName( "OtherNature" );
        document.getElementById("showNDVIToggle").disabled = false;

        if ( !areAnySwitchesOn() ) {

            setElementsDisplay( elements, 'inline-block' );
            toggleLandCoverBarPlots( 'hidden' );

        }
    }

}

/**
 * This function handles the toggle event for showing or hiding the built datasource on the map.
 *
 */
function showBuiltEvent( ) {

    const elements = [
        'showNDVISwitch',
        'showNDVILabel'
    ];

    // Get the current state of the toggle button for showing nature areas.
    const showBuilt = document.getElementById( "showBuiltToggle" ).checked;

    if ( showBuilt) {

        setElementsDisplay( elements, 'none' );

        document.getElementById("showNDVIToggle").disabled = true;

        // If there is a postal code available, load the nature areas for that area.
        if ( majorDistrict && !dataSourceWithNameExists( "Built" ) ) {

            loadBuiltSequentially( majorDistrict );

        } else {

            showDataSourceByName( "Built" );
        }

    } else {

        hideDataSourceByName( "Built" );
        document.getElementById("showNDVIToggle").disabled = false;

        if ( !areAnySwitchesOn() ) {

            setElementsDisplay( elements, 'inline-block' );
            toggleLandCoverBarPlots( 'hidden' );

        }

    }

}
  