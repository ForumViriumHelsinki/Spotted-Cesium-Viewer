/**
 * Processes the click event on the viewer
 * 
 * @param {Cesium.Viewer} viewer - The Cesium viewer object
 * @param {MouseEvent} event - The click event
 */
function processClick( viewer, event ) {
    console.log("Clicked at " + String( event.x ) + ", " + String( event.y ));
    pickEntity( viewer, new Cesium.Cartesian2( event.x, event.y ) );
}

/**
 * Prints the properties of the picked Cesium entity
 * 
 * @param {Object} picked - The picked Cesium entity
 * @param {Object} id - The ID of the picked entity
 */
function printCesiumEntity( picked, id ) {

    document.getElementById( 'printContainer' ).scroll({
        top: 0,
        behavior: 'instant'
    });
    
    if ( picked.id._polygon && picked.id.properties ) {
        var toPrint = "<u>Found following properties & values:</u><br/>";	

        //Highlight for clicking...
        let oldMaterial = id.polygon.material;
        id.polygon.material = new Cesium.Color( 1, 0.5, 0.5, 0.8 );
        setTimeout(() => { id.polygon.material = oldMaterial }, 500 );

        let length = picked.id.properties.propertyNames.length;
        for ( let i = 0; i < length; ++i ) {

            toPrint = toPrint + picked.id.properties.propertyNames[ i ] + ": " + picked.id.properties[ picked.id.properties.propertyNames[ i ] ] + "<br/>";
            
        };
    }

    console.log(toPrint);
    
    addToPrint( toPrint, picked.id.properties.posno )
    
}

/**
 * Adds the provided content to the print container
 * 
 * @param {string} toPrint - The content to be added to the print container
 * @param {string} postno - The postal code associated with the content
 */
function addToPrint( toPrint, postno ) {

    if ( postno ) {

        toPrint = toPrint + "<br/><br/><i>Click on objects to retrieve information.</i>"

    } 

    document.getElementById('printContainer').innerHTML = toPrint;
    document.getElementById('printContainer').scroll({
          top: 1000,
          behavior: 'smooth'
    });
}

function loadMajorDistrict( majordistrict ) {

    majorDistrict = majordistrict;

    document.getElementById( "showWaterToggle" ).disabled = false;
    document.getElementById( "showVegetationToggle" ).disabled = false;
    document.getElementById( "showFieldsToggle" ).disabled = false;
    document.getElementById( "showOtherNatureToggle" ).disabled = false;
    document.getElementById( "showBuiltToggle" ).disabled = false;

    if ( document.getElementById( "printToggle" ).checked ) {

        setPrintVisible( );

    }

    console.log("Postal code area found!");

    removeDataSourcesAndEntitiesExceptMajorDistricts();
    loadDistrictZones( 0.2, 'assets/data/HelsinkiDistrict.json', 'Districts' );

    if ( showVegetation ) {
        
        loadNatureAreas( majordistrict );
    
    }

    loadTreesSequentially( majordistrict );		


}

/**
 * Handles major district feature
 * 
 * @param {Object} id - The ID of the picked entity
 */
function handleMajorDistrict( id ) {                
    
    majorDistrictCode = id.properties.tunnus;

    if ( majorDistrictCode ) {

        districtName = String( id.properties.nimi_fi )
        districtPopulation = id.properties.asukasluku;
        districtArea = id.properties.pa_m2;
        loadMajorDistrict( majorDistrictCode );

    }

}

/**
 * Handles district feature
 * 
 * @param {Object} id - The ID of the picked entity
 */
function loadDistrict( id ) {                
    
    majorDistrictCode = id.properties.tunnus;

    //If we find postal code, we assume this is an area & zoom in AND load the buildings for it.
    if ( majorDistrictCode ) {

        districtName = String( id.properties.nimi_fi )
        districtPopulation = id.properties.asukasluku;
        districtArea = id.properties.pa_m2;

        majorDistrict = majorDistrictCode;

        document.getElementById( "showWaterToggle" ).disabled = false;
        document.getElementById( "showVegetationToggle" ).disabled = false;
        document.getElementById( "showFieldsToggle" ).disabled = false;
        document.getElementById( "showOtherNatureToggle" ).disabled = false;
        document.getElementById( "showBuiltToggle" ).disabled = false;
    
        if ( document.getElementById( "printToggle" ).checked ) {
    
            setPrintVisible( );
    
        }
        
        loadDistrictZones( 0.0, 'assets/data/HelsinkiDistrict.json', 'Districts' );


    }

}
    

/**
 * Picks the entity at the given window position in the viewer
 * 
 * @param {Cesium.Viewer} viewer - The Cesium viewer object
 * @param {Cesium.Cartesian2} windowPosition - The window position to pick the entity
 */
function pickEntity( viewer, windowPosition ) {
    let picked = viewer.scene.pick( windowPosition );

    console.log("picked", picked)
    
    if ( picked ) {
                
        if ( picked.id._polygon ) {
            
            if ( picked.id.entityCollection._entities._array[ 0 ]._properties._nimi_fi._value === 'Eteläinen' ) {

                level = 'MajorDistricts';
                
            }

            if ( picked.id.entityCollection._entities._array[ 0 ]._properties._nimi_fi._value === 'Vironniemi' ) {

                level = 'Districts';
                
            }

            hidePlotlyIfNatureFeatureIsClicked( picked.id.properties.category );
            handleMajorDistrict( picked.id );
            console.log("level", level)

        }
    }
}

/**
 * Hides the plot container if the nature feature is clicked; otherwise, shows the plot container if the show plot toggle is checked
 * 
 * @param {string} category - The category of the picked entity
 */
function hidePlotlyIfNatureFeatureIsClicked( category ) {

    if ( category ) {

        document.getElementById( 'plotContainer' ).style.visibility = 'hidden';
        document.getElementById( 'plotBuiltContainer' ).style.visibility = 'hidden';
        document.getElementById( 'plotInhabitantContainer' ).style.visibility = 'hidden';


    } else {

        if ( document.getElementById( "showPlotToggle" ).checked ) {

            document.getElementById( 'plotContainer' ).style.visibility = 'visible';
            document.getElementById( 'plotBuiltContainer' ).style.visibility = 'visible';
            document.getElementById( 'plotInhabitantContainer' ).style.visibility = 'visible';

        }

    }
}