
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
 * Function to create a NDVI imagery provider based on the selected layer
 * 
 * @param { String } layer - layer of WMS service
 */
function createNDVIImageryProvider( layer ) {
    return new Cesium.WebMapServiceImageryProvider({
        url: 'https://sh.dataspace.copernicus.eu/ogc/wms/5ea5da6a-8c03-4a2a-932d-1468fb5bde2c',
        layers: layer,
        proxy: new Cesium.DefaultProxy('/proxy/')
    });
}

function createHSYImageryLayer() {
		// Define the backend proxy URL
		const backendURL = 'http://localhost:3003'; // Ensure this is set correctly in your .env file

		// Construct the proxy URL with the full WMS request URL encoded as a query parameter
		const proxyUrl = `${backendURL}/spotted-wms/proxy`;

		// Use the proxy URL in the WebMapServiceImageryProvider
		const provider = new Cesium.WebMapServiceImageryProvider( {
			url: proxyUrl, // Point this to your backend proxy
			layers: 'asuminen_ja_maankaytto:maanpeite_rakennus_2022,asuminen_ja_maankaytto:maanpeite_avokalliot_2022,asuminen_ja_maankaytto:maanpeite_merialue_2022,asuminen_ja_maankaytto:maanpeite_muu_avoin_matala_kasvillisuus_2022,asuminen_ja_maankaytto:maanpeite_muu_vetta_lapaisematon_pinta_2022,asuminen_ja_maankaytto:maanpeite_paallystamaton_tie_2022,asuminen_ja_maankaytto:maanpeite_paallystetty_tie_2022,asuminen_ja_maankaytto:maanpeite_paljas_maa_2022,asuminen_ja_maankaytto:maanpeite_pellot_2022,asuminen_ja_maankaytto:maanpeite_puusto_10_15m_2022,asuminen_ja_maankaytto:maanpeite_puusto_15_20m_2022,asuminen_ja_maankaytto:maanpeite_puusto_2_10m_2022,asuminen_ja_maankaytto:maanpeite_puusto_yli20m_2022,asuminen_ja_maankaytto:maanpeite_vesi_2022',
			// Other necessary WebMapServiceImageryProvider parameters...
		} );
    
		return new Cesium.ImageryLayer( provider );
}

/**
 * Resets the objects displayed, camera orientation, and switches to their default state
 */
function reset( ) {

    removeDataSourcesAndEntities();
    resetViewer( );
    resetSwitches( );
    setToggleElements( );
    showPlot = true;
    print = true; //show object details..
    nameOfZone = null;
    averageHeatExposure = 0;
    majorDistrict = null;
    districtName = null;
    majorDistrictName = null;
    districtPopulation = null;
    districtArea = null;
    level = null;
    districtsVisited = [ ];
    levelsVisited = [ ];
    currentDistrictName = null;
    currentSubDistrictName = null;
    majorDistrict = null;
    // Load major district zones
	loadDistrictZones( 0.1, 'assets/data/HelsinkiMajorDistrict.json', 'MajorDistricts' );

    document.getElementById( "YLRESwitch" ).style.display = 'none';
    document.getElementById( "YLRELabel" ).style.display = 'none';
    document.getElementById( "TreeRegistrySwitch" ).style.display = 'none';
    document.getElementById( "TreeRegistryLabel" ).style.display = 'none';
    document.getElementById( "printContainer" ).style.display = 'none';
    document.getElementById( "PopulationGridLabel" ).style.display = 'none';
    document.getElementById( "PopulationGridSwitch" ).style.display = 'none';
    document.getElementById( "SubDistrictNDVISwitch" ).style.display = 'none';
    document.getElementById( "SubDistrictNDVILabel" ).style.display = 'none';
	
//	document.getElementById( 'printContainer' ).innerHTML =  "<i>Please click on a majordistrict area to load building and nature areas from the PyGeo server...</i>";

}

/**
 * Resets the switches to their default state
 */
function resetSwitches( ) {

    const elements = [
        'showPlotSwitch',
        'showPlotLabel',
        'showNDVISwitch',
        'showNDVILabel',
        'NDVI2023Switch',
        'NDVI2023Label',
        'showTreesSwitch',
        'showTreesLabel'
    ];

	document.getElementById( "showPlotToggle" ).checked = false;

    document.getElementById( "showTreeToggle" ).checked = false;
    document.getElementById( "showNDVIToggle" ).checked = false;
    document.getElementById( "NDVI2023Toggle" ).checked = false;
    document.getElementById( "showGreenToggle" ).checked = false;

    setElementDisabledState( true );
    setElementsDisplay( elements, 'inline-block' );
    document.getElementById("showNDVIToggle").disabled = true;
    document.getElementById("NDVI2023Toggle").disabled = true;

//	document.getElementById( "printToggle" ).checked = true;
    document.getElementById( 'returnButton' ).style.visibility = 'hidden';
    document.getElementById( 'selectContainer' ).style.visibility = 'hidden';
    document.getElementById( "plotContainer" ).style.visibility = 'hidden';
    document.getElementById( "greenAreaContainer" ).style.visibility = 'hidden';
    document.getElementById( 'ndviSliderContainer' ).style.visibility = 'hidden';

//    setPrintVisible( );
    togglePlots( 'hidden' );    

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
 * Change visibility of plots
 * 
 * */
function togglePlots( visibility ) {

    document.getElementById( 'plotPieContainer' ).style.visibility = visibility;
    document.getElementById( 'selectContainer' ).style.visibility = visibility;

    if ( document.getElementById( "showNDVIToggle" ).checked || document.getElementById( "NDVI2023Toggle" ).checked || visibility == 'hidden' ) {

        toggleLabels( visibility );

    }

    if ( document.getElementById( "showGreenToggle" ).checked || visibility == 'hidden' ) {
        
        document.getElementById( 'greenAreaContainer' ).style.visibility = visibility;
        document.getElementById( 'sliderContainer' ).style.visibility = visibility;

    }

    if ( visibility == 'hidden' || areAnySwitchesOn() ) {

        document.getElementById( 'plotInhabitantContainer' ).style.visibility = visibility;
        document.getElementById( 'plotContainer' ).style.visibility = visibility;
        document.getElementById( "greenAreaContainer" ).style.visibility = visibility;

    } else {

        if ( document.getElementById( "showNDVIToggle" ).checked || document.getElementById( "NDVI2023Toggle" ).checked ) {

            document.getElementById( 'plotContainer' ).style.visibility = visibility;
            document.getElementById( 'ndviSliderContainer' ).style.visibility = visibility;

        }
    }

}


/**
 * Change visibility of hsy landcover bar plots
 * 
 * */
function toggleLandCoverBarPlots( visibility ) {

    document.getElementById( 'plotInhabitantContainer' ).style.visibility = visibility;
    document.getElementById( 'plotContainer' ).style.visibility = visibility;
    document.getElementById( "greenAreaContainer" ).style.visibility = visibility;

}

/**
 * Check if any of the specified switches are turned on.
 * 
 * @returns {boolean} true if any switch is on, false if all are off.
 */
function areAnySwitchesOn() {
    // List of switch IDs to check
    const switchIds = [
        'showTreeToggle'
    ];

    // Loop through the switch IDs and check if any are on
    for (const switchId of switchIds) {
        const switchElement = document.getElementById(switchId);
        if ( switchElement && switchElement.checked ) {

            return true; // At least one switch is on, so return true
        }

    }

    return false; // No switches are on, so return false
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
    if ( levelsVisited.length && levelsVisited[ levelsVisited.length - 1 ] !== "MajorDistricts" ) {
  
        document.getElementById( 'returnButton' ).style.visibility = 'visible';
  
    } else {
  
        document.getElementById( 'returnButton' ).style.visibility = 'hidden';
  
    }
}

  /**
 * Resets the objects displayed, camera orientation, and switches to their default state
 */
  async function prevLevel() {

    document.getElementById( 'plotSelect' ).value = 'Helsinki';

    if ( levelsVisited[ levelsVisited.length - 1 ] === "Districts" ) {

        await removeDataSourcesByNamePrefix( "SubDistricts" );
        await newDistrict( 'assets/data/HelsinkiMajorDistrict.json', 'MajorDistricts' );
        levelsVisited.pop();
        levelsVisited.push( 'MajorDistricts' );

    }

    if ( levelsVisited[ levelsVisited.length - 1 ] === "SubDistricts" ) {

        await newDistrict( 'assets/data/HelsinkiDistrict.json', 'Districts' );
        levelsVisited.pop();
        levelsVisited.push( 'Districts' );

    }

    setDistrictOutlineColor( );
    districtsVisited.pop( );

    const props = getDistrictPropsByNameAndId(  districtsVisited[ districtsVisited.length - 1 ] );

    setDistrictVariables( props );
    
    toggleReturnButtonVisibility( );
    createPieChartForMajorDistrict( districtsVisited[ districtsVisited.length - 1 ] );
    removeDuplicateDataSources( );

}

/**
 * Set the disabled state of specified elements.
 * 
 * @param {boolean} isDisabled - Whether to set the elements as disabled (true) or enabled (false).
 */
function setElementDisabledState( isDisabled ) {
    document.getElementById("showTreeToggle").disabled = isDisabled;
}

/**
 * Set the visibility status of the pie chart and select element.
 * 
 * @param {boolean} isVisible - Whether to make the pie chart and select element visible (true) or hidden (false).
 */
function setPieChartVisibility( isVisible ) {

    const plotContainer = document.getElementById("plotPieContainer");
    const selectContainer = document.getElementById("selectContainer");
    
    plotContainer.style.visibility = isVisible ? "visible" : "hidden";
    selectContainer.style.visibility = isVisible ? "visible" : "hidden";

}

/**
 * Populate a <select> element with options based on the 'nimi_fi' attribute of a GeoJSON data source.
 * 
 * @param {string} dataSourceName - The name of the GeoJSON data source.
 * @param {string} selectElementId - The ID of the <select> element to populate.
 */
function populateSelectFromGeoJSON(dataSourceName, selectElementId, currentValue) {
    // Get the GeoJSON data source by name
    const geoJsonDataSource = viewer.dataSources.getByName(dataSourceName)[0];

    if (!geoJsonDataSource) {
        console.error(`Data source with name '${dataSourceName}' not found.`);
        return;
    }

    // Get the 'nimi_fi' values from the features
    const nimiFiValues = [];
    const entities = geoJsonDataSource.entities.values;

    for (const entity of entities) {
        const nimiFi = entity.properties.nimi_fi._value;
        if (nimiFi && !nimiFiValues.includes(nimiFi)) {
            nimiFiValues.push(nimiFi);
        }
    }

    // Get the <select> element
    const selectElement = document.getElementById(selectElementId);

    if (!selectElement) {
        console.error(`Select element with ID '${selectElementId}' not found.`);
        return;
    }

    // Remove all options except the first one
    removeOptionsExceptFirst(selectElement);

    // Populate the <select> element with options
    for (const nimiFi of nimiFiValues) {
        const optionElement = document.createElement("option");
        optionElement.value = nimiFi;
        optionElement.textContent = nimiFi;
        selectElement.appendChild(optionElement);
    }

    document.getElementById(selectElementId).value = currentValue;
}

/**
 * Remove all options except the first one from a <select> element.
 * 
 * @param {HTMLSelectElement} selectElement - The <select> element to remove options from.
 */
function removeOptionsExceptFirst(selectElement) {
    const options = selectElement.querySelectorAll("option");
    for (let i = 1; i < options.length; i++) {
        options[i].remove();
    }
}

/**
 * Check if the selected option in the 'plotSelect' <select> element is not equal to 'Helsinki'.
 * 
 * @returns {boolean} true if the selected option is not 'Helsinki', false otherwise.
 */
function isNotHelsinkiSelected() {
    // Get the <select> element by its ID
    const selectElement = document.getElementById("plotSelect");

    if (selectElement) {
        // Get the selected option's value
        const selectedValue = selectElement.value;

        // Check if the selected value is not 'Helsinki'
        return selectedValue !== "Helsinki";
    }

    // Handle the case where the <select> element is not found
    console.error("Select element with ID 'plotSelect' not found.");
    return false;
}

/**
 * Changes the display of land cover elements when user switches between land cover and ndvi view
 */
function setElementsDisplay( elements, display ) {

    elements.forEach(( elementId ) => {
        const element = document.getElementById( elementId );
        if ( element ) {

            element.style.display = 'inline-block';
        
        }
    });
}

/**
 * Changes the visibility of label elements 
 */
function toggleLabels( visibility ) {

    document.getElementById( "white-label" ).style.visibility = visibility;
    document.getElementById( "yellow-label" ).style.visibility = visibility;
    document.getElementById( "yellowgreen-label" ).style.visibility = visibility;
    document.getElementById( "lightgreen-label" ).style.visibility = visibility;
    document.getElementById( "green-label" ).style.visibility = visibility;
    document.getElementById( "ldarkgreen-label" ).style.visibility = visibility;
    document.getElementById( "darkgreen-label" ).style.visibility = visibility;
    document.getElementById( "vdarkgreen-label" ).style.visibility = visibility;
} 

function setToggleElements() {

    if ( majorDistrict ) {

        const elements = [
            'showPlotSwitch',
            'showPlotLabel'
        ];
    
  
    
            elements.push( 'showNDVISwitch' );
            elements.push( 'showNDVILabel' );
            elements.push( 'NDVI2023Switch' );
            elements.push( 'NDVI2023Label' );
            elements.push( 'showTreesSwitch' );
            elements.push( 'showTreesLabel' );                  
        
    
        setElementsDisplay( elements, 'none' );

    } 
}