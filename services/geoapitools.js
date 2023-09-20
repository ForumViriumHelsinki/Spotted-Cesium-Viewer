
/**
 * Function to create an imagery provider based on the selected layer
 * 
 * @param { String } layer - layer of WMS service
 */
function createImageryProvider( layer ) {
    return new Cesium.WebMapServiceImageryProvider({
        url: 'https://kartta.hel.fi/ws/geoserver/avoindata/ows?SERVICE=WMS&',
        layers: layer,
        proxy: new Cesium.DefaultProxy('/proxy/')
    });
}

/**
 * Resets the objects displayed, camera orientation, and switches to their default state
 */
function reset( ) {

    removeDataSourcesAndEntities();
    resetViewer( );
    resetSwitches( );
    majorDistrictCode = null;
    // Load major district zones
	loadDistrictZones( 0.2, 'assets/data/HelsinkiMajorDistrict.json', 'MajorDistricts' );
	
	document.getElementById( 'printContainer' ).innerHTML =  "<i>Please click on a majordistrict area to load building and nature areas from the PyGeo server...</i>";

}

/**
 * Resets the switches to their default state
 */
function resetSwitches( ) {

	document.getElementById( "showPlotToggle" ).checked = true;

    document.getElementById( "showTreeToggle" ).checked = false;
	document.getElementById( "showVegetationToggle" ).checked = false;
    document.getElementById( "showWaterToggle" ).checked = false;
    document.getElementById( "showFieldsToggle" ).checked = false;
    document.getElementById( "showOtherNatureToggle" ).checked = false;
    document.getElementById( "showBuiltToggle" ).checked = false;

	document.getElementById( "printToggle" ).checked = true;
    document.getElementById( "showWaterToggle" ).disabled = true;
    document.getElementById( "showTreeToggle" ).disabled = true;
    document.getElementById( "showVegetationToggle" ).disabled = true;
    document.getElementById( "showFieldsToggle" ).disabled = true;
    document.getElementById( "showOtherNatureToggle" ).disabled = true;
    document.getElementById( "showBuiltToggle" ).disabled = true;
    document.getElementById( 'returnButton' ).style.visibility = 'hidden';

    setPrintVisible( );
    hideAllPlots( );    

  	showPlot = true;
	print = true;

}

/**
 * Removes all data sources and entities from the viewer
 */
function removeDataSourcesAndEntities( ) {

    viewer.dataSources.removeAll( );
    viewer.entities.removeAll( );

}



/**
 * Resets the viewer's camera to Helsinki with a specific orientation
 */
function resetViewer( ) {
    // Fly the camera to Helsinki at the given longitude, latitude, and height.
    viewer.camera.flyTo({
        destination : Cesium.Cartesian3.fromDegrees( 24.941745, 60.165464, 35000 ), 
        orientation : {
            heading : Cesium.Math.toRadians( 0.0 ),
            pitch : Cesium.Math.toRadians( -85.0 ),
        }
    });

}

/**
 * Finds the bounding box of an entity and returns the latitude and longitude bounds
 * 
 * @param {Cesium.Entity} element - The entity to find the bounds for
 * @returns {number[]} - An array containing the latitude and longitude bounds in the order [latMIN, latMAX, lonMIN, lonMAX]
 */	
function findEntityBounds( element ) {
	
    let i = 0;

    //These hold the bounding box
    let latMIN = 0;
    let latMAX = 0;
    let lonMIN = 0;
    let lonMAX = 0;

	//viewer.dataSources._dataSources[0].entities._entities._array[0]._polygon._hierarchy._value.positions[0]
    while ( i < element._polygon._hierarchy._value.positions.length ) {

        //Assemble lat & lon from entity position
        let posDeg = Cesium.Cartographic.fromCartesian( element._polygon._hierarchy._value.positions[ i ] );

        //First run
        if ( i == 0 ) {
            latMIN = posDeg.latitude;
            latMAX = posDeg.latitude;
            lonMIN = posDeg.longitude;
            lonMAX = posDeg.longitude;
        }
        
        if ( posDeg.latitude < latMIN ) {
            latMIN = posDeg.latitude;
        }

        if ( posDeg.latitude > latMAX ) {
            latMAX = posDeg.latitude;
        }

        if ( posDeg.longitude < lonMIN ) {
            lonMIN = posDeg.longitude;
        }

        if ( posDeg.longitude > lonMAX ) {
            lonMAX = posDeg.longitude;
        }
      
        i++;
    }

    return [ latMIN, latMAX, lonMIN - 0.0002, lonMAX - 0.0002 ];
}

/**
 * This function sets the visibility of HTML elements related to printing and geocoder to "visible", making them visible on the webpage.  
 * 
 */
function setPrintVisible( ) {
    document.getElementById( 'printContainer' ).style.visibility = 'visible';
}

/**
 * Returns the selected text of a dropdown menu with the given element ID.
 * 
 * @param { string } elementId - The ID of the HTML element that represents the dropdown menu.
 * @returns { string } The selected text of the dropdown menu, or null if no option is selected.
 */
function getSelectedText( elementId ) {

    const elt = document.getElementById( elementId );
  
    if ( elt.selectedIndex == -1 ) {

      return null;

    }
  
    return elt.options[ elt.selectedIndex ].text;

}


/**
 * Shows all plots and select elements
 * 
 * */
function showAllPlots( ) {

    document.getElementById( 'plotContainer' ).style.visibility = 'visible';
    document.getElementById( 'plotBuiltContainer' ).style.visibility = 'visible';
    document.getElementById( 'plotInhabitantContainer' ).style.visibility = 'visible';

}


/**
 * Hides all plots and select elements
 * 
 * */
function hideAllPlots( ) {

    document.getElementById( 'plotContainer' ).style.visibility = 'hidden';
    document.getElementById( 'plotBuiltContainer' ).style.visibility = 'hidden';
    document.getElementById( 'plotInhabitantContainer' ).style.visibility = 'hidden';

}

/**
 * Creates URL for given parameters
 */
function createURL( majordistrict, collection ) {

    let url = "https://geo.fvh.fi/spotted/collections/" + collection + "/items?f=json&limit=32000&tunnus=" + majordistrict + "&filter=area_m2%20BETWEEN%20" + lower + "%20AND%20"+ upper;

}

/**
 * Function to toggle the visibility of the "Return" button
 */
function toggleReturnButtonVisibility() {
    if ( level !== null && level !== "MajorDistricts" ) {
  
        document.getElementById( 'returnButton' ).style.visibility = 'visible';
  
    } else {
  
        document.getElementById( 'returnButton' ).style.visibility = 'hidden';
  
    }
}

  /**
 * Resets the objects displayed, camera orientation, and switches to their default state
 */
  async function prevLevel() {

    viewer.dataSources.removeAll( );

    if ( level === "Districts" ) {

        await newMajorDistrict( districtsVisited[ districtsVisited.length - 2 ] );
    }

    if ( level === "SubDistricts" ) {

        await newDistrict( districtsVisited[ districtsVisited.length - 2 ]);

    }

    if ( districtsVisited.length > 1 ) {

        districtsVisited.pop();

    }

    const props = getDistrictPropsByNameAndId( level, districtsVisited[ districtsVisited.length - 1 ] );

    if ( districtsVisited.length > 1 ) {

        districtsVisited.pop();

    }

    setDistrictVariables( props );
    toggleReturnButtonVisibility( );
    createPieChartForMajorDistrict( districtsVisited[ districtsVisited.length - 1 ] );
    removeDuplicateDataSources( );
    
}


