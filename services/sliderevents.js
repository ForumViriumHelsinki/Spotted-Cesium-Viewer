/**
 * This function is triggered by a slider event and it checks the value of the slider to determine which function to execute
 *
 * @param { Object } event the slider event
 */
function sliderEvents( event ) {
		
    // If the slider value is "print", call the printEvent function.
    if ( event.target.value == 'print' ) {

        printEvent();

    }
      
    // If the slider value is "showPlot", call the showPlotEvent function.
    if ( event.target.value == 'showPlot' ) {

        showPlotEvent();

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
 * This function to show or hide field entities on the map based on the toggle button state
 *
 */
function showFieldsEvent( ) {

    // Get the state of the showFields toggle button
    const showFields = document.getElementById( "showFieldsToggle" ).checked;

    // If showTrees toggle is on
    if ( showFields ) {

        // If a postal code is available, load trees for that postal code
        if ( majorDistrict && !dataSourceWithNameExists( "Fields" ) ) {

            loadFields( majorDistrict );

        } else {

            createVegetationBarPlot( majorDistrict._value );
            showDataSourceByName( "Fields" );

        }
        
    } else { // If showTrees toggle is off
        
        createVegetationBarPlot( majorDistrict._value );
        hideDataSourceByName( "Fields" );

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
        document.getElementById( 'searchcontainer' ).style.visibility = 'hidden';
        document.getElementById( 'georefContainer' ).style.visibility = 'hidden';
        document.getElementById( 'searchbutton' ).style.visibility = 'hidden';

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
        hideAllPlots( );

    } else { // Otherwise, show the plot and its controls if the toggle button is checked and the plot is already loaded

        showAllPlots( );
        showPlot = true;

    }

}

/**
 * This function handles the toggle event for showing or hiding the vegetation layer on the map.
 *
 */
function showVegetationEvent( ) {

    // Get the current state of the toggle button for showing nature areas.
    const showVegetation = document.getElementById( "showVegetationToggle" ).checked;

    if ( showVegetation ) {

        // If the toggle button is checked, enable the toggle button for showing the nature area heat map.
        //document.getElementById("showVegetationHeatToggle").disabled = false;

        // If there is a postal code available, load the nature areas for that area.
        if ( majorDistrict && !dataSourceWithNameExists( "Vegetation" ) ) {

            loadVegetationSequentially( majorDistrict );

        } else {

            createVegetationBarPlot( majorDistrict._value );
            createVegetationBarPlotPerInhabitant( majorDistrict._value );
            showDataSourceByName( "Vegetation" );
        }

    } else {

        createVegetationBarPlot( majorDistrict._value );
        createVegetationBarPlotPerInhabitant( majorDistrict._value );
        hideDataSourceByName( "Vegetation" );

    }

}

/**
 * This function handles the toggle event for showing or hiding the water areas layer on the map.
 *
 */
function showWaterEvent( ) {

    // Get the current state of the toggle button for showing nature areas.
    const showWater = document.getElementById( "showWaterToggle" ).checked;

    if ( showWater ) {

        // If the toggle button is checked, enable the toggle button for showing the nature area heat map.
        //document.getElementById("showloadWater").disabled = false;

        // If there is a postal code available, load the nature areas for that area.
        if ( majorDistrict && !dataSourceWithNameExists( "Water" ) ) {
            
            loadWater( majorDistrict );

        } else {

            showDataSourceByName( "Water" );
            createVegetationBarPlot( majorDistrict._value );
            createVegetationBarPlotPerInhabitant( majorDistrict._value );

        }


    } else {

        createVegetationBarPlot( majorDistrict._value );
        createVegetationBarPlotPerInhabitant( majorDistrict._value );
        hideDataSourceByName( "Water" );

    }

}

/**
 * This function handles the toggle event for showing or hiding the other nature datasource on the map.
 *
 */
function showOtherNatureEvent( ) {

    // Get the current state of the toggle button for showing nature areas.
    const showOtherNature = document.getElementById( "showOtherNatureToggle" ).checked;

    if ( showOtherNature) {

        // If there is a postal code available, load the nature areas for that area.
        if ( majorDistrict && !dataSourceWithNameExists( "OtherNature" ) ) {

            loadOtherNatureSequentially( majorDistrict );

        } else {

          //  createBuiltBarPlot( majorDistrict._value );
            createVegetationBarPlot( majorDistrict._value );
            createVegetationBarPlotPerInhabitant( majorDistrict._value );
            showDataSourceByName( "OtherNature" );
        }

    } else {

        createVegetationBarPlot( majorDistrict._value );
        createVegetationBarPlotPerInhabitant( majorDistrict._value );
        hideDataSourceByName( "OtherNature" );

    }

}

/**
 * This function handles the toggle event for showing or hiding the built datasource on the map.
 *
 */
function showBuiltEvent( ) {

    // Get the current state of the toggle button for showing nature areas.
    const showBuilt = document.getElementById( "showBuiltToggle" ).checked;

    if ( showBuilt) {

        // If there is a postal code available, load the nature areas for that area.
        if ( majorDistrict && !dataSourceWithNameExists( "Built" ) ) {

            loadBuiltSequentially( majorDistrict );

        } else {

            showDataSourceByName( "Built" );
        }

    } else {

        hideDataSourceByName( "Built" );

    }

}
  