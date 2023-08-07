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

    // If the slider value is "showOtherNature", call the showOtherNatureEvent function.
    if ( event.target.value == 'showOtherNature' ) {

        showOtherNatureEvent();
    
    }	

    // If the slider value is "showTrees", call the showTrees function.
    if ( event.target.value == 'showTrees' ) {
        
        showTrees();

    }   
            
}

/**
 * This function to show or hide tree entities on the map based on the toggle button state
 *
 */
function showTrees( ) {

    // Get the state of the showTrees toggle button
    const showTrees = document.getElementById( "showTreesToggle" ).checked;

    // If showTrees toggle is on
    if ( showTrees ) {

        // If a postal code is available, load trees for that postal code
        if ( postalcode && !getDataSourceByName("Trees") ) {

            // loadTrees( postalcode );

        } else {

            showAllDataSources( );
        }
        
    } else { // If showTrees toggle is off
        
        hideDataSourceByName( "Trees" );

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
        if ( majorDistrict && !getDataSourceByName("Vegetation") ) {

            loadVegeationSequentially( majorDistrict );

        } else {

            showAllDataSources( );
        }

    } else {

        hideDataSourceByName( "Vegetation" );

    }

}

/**
 * This function handles the toggle event for showing or hiding the nature areas layer on the map.
 *
 */
function showOtherNatureEvent( ) {

    // Get the current state of the toggle button for showing nature areas.
    const showloadOtherNature = document.getElementById( "showOtherNatureToggle" ).checked;

    if ( showloadOtherNature ) {

        // If the toggle button is checked, enable the toggle button for showing the nature area heat map.
        //document.getElementById("showloadOtherNature").disabled = false;

        // If there is a postal code available, load the nature areas for that area.
        if ( postalcode && !getDataSourceByName( "OtherNature" ) ) {

            loadOtherNature( postalcode );

        } else {

            showAllDataSources( );
        }


    } else {

        hideDataSourceByName( "OtherNature" );

    }

}

  
/**
 * Get a data source from the Cesium viewer
 * 
 * @param { String } name name of the datasource
 * @returns { Object } The found data source
*/
function getDataSourceByName( name ) {
    
    return viewer.dataSources._dataSources.find( ds => ds.name === name );

}

/**
 * Get a data source from the Cesium viewer
 * 
 * @param { String } name name of the datasource
*/
function hideDataSourceByName( name ) {

    viewer.dataSources._dataSources.forEach( function( dataSource ) {
        if ( dataSource.name.startsWith( name ) ) {
            dataSource.show = false;	
        }
    });
}
  
  