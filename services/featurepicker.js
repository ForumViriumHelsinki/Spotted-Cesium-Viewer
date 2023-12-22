/**
 * Processes the click event on the viewer
 * 
 * @param {Cesium.Viewer} viewer - The Cesium viewer object
 * @param {MouseEvent} event - The click event
 */
function processClick( viewer, event ) {
    
    document.getElementById( 'plotSelect' ).value = 'Helsinki';
    const elements = [
        'showPlotSwitch',
        'showPlotLabel',
        'showNDVISwitch',
        'showNDVILabel',
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


    setElementsDisplay( elements, 'inline-block' );
    console.log("Clicked at " + String( event.x ) + ", " + String( event.y ));
    pickEntity( viewer, new Cesium.Cartesian2( event.x, event.y ) );

}

/**
 * Prints the properties of the picked Cesium entity
 * 
 * @param {Object} picked - The picked Cesium entity
 */
function printCesiumEntity( picked ) {

    document.getElementById( 'printContainer' ).scroll({
        top: 0,
        behavior: 'instant'
    });
    
    if ( picked.id._polygon && picked.id.properties ) {
        var toPrint = "<u>Found following properties & values:</u><br/>";	

        //Highlight for clicking...
        let oldMaterial = picked.id.polygon.material;
        picked.id.polygon.material = new Cesium.Color( 1, 0.5, 0.5, 0.8 );
        setTimeout(() => { picked.id.polygon.material = oldMaterial }, 500 );

        let length = picked.id.properties.propertyNames.length;
        for ( let i = 0; i < length; ++i ) {

            if ( typeof picked.id.properties[ picked.id.properties.propertyNames[ i ] ]._value === 'number' ) {

                toPrint = toPrint + picked.id.properties.propertyNames[ i ] + ": " + picked.id.properties[ picked.id.properties.propertyNames[ i ] ]._value.toFixed( 0 ) + "<br/>";

            } else {

                toPrint = toPrint + picked.id.properties.propertyNames[ i ] + ": " + picked.id.properties[ picked.id.properties.propertyNames[ i ] ] + "<br/>";

            }
            
        };
    }
    
    addToPrint( toPrint )
    
}

/**
 * Adds the provided content to the print container
 * 
 * @param {string} toPrint - The content to be added to the print container
 */
function addToPrint( toPrint ) {

    toPrint = toPrint + "<br/><br/><i>Display ndvi or land cover entities for selected major district, or select another district. </i>"

    if ( levelsVisited.length && levelsVisited[ levelsVisited.length - 1 ] !== "MajorDistricts" ) {
  
        toPrint = toPrint + "<br/><br/><i>Previous district returns to previously picked district. </i>"
  
    }

    document.getElementById('printContainer').innerHTML = toPrint;
    document.getElementById('printContainer').scroll({
          top: 1000,
          behavior: 'smooth'
    });
}    

/**
 * Picks the entity at the given window position in the viewer
 * 
 * @param {Cesium.Viewer} viewer - The Cesium viewer object
 * @param {Cesium.Cartesian2} windowPosition - The window position to pick the entity
 */
async function pickEntity( viewer, windowPosition ) {
    let picked = viewer.scene.pick( windowPosition );

    document.getElementById("showNDVIToggle").disabled = false;
    
    if ( picked ) {

        if ( !document.getElementById( "showNDVIToggle" ).checked ) {

            setElementDisabledState( false );

        } else {

            setElementDisabledState( true );

        }

        document.getElementById( "showPlotToggle" ).checked = true;
        setDistrictVariables( picked.id.properties );

        if ( picked.id.entityCollection._entities._array[ 0 ]._properties._nimi_fi ) {

            if ( picked.id.entityCollection._entities._array[ 0 ]._properties._nimi_fi._value === 'Eteläinen' ) {

                majorDistrict = picked.id.properties.tunnus;
                majorDistrictName = picked.id.properties.nimi_fi._value;
                await removeDataSourcesByNamePrefix( "SubDistricts" );
                await newDistrict( 'assets/data/HelsinkiDistrict.json', 'Districts' );
                levelsVisited.push( 'MajorDistricts' );
                handleGreenAreas();
                setDistrictOutlineColor( );
                toggleReturnButtonVisibility( );
                createPieChartForMajorDistrict( picked.id.properties.tunnus );
                 
            }
    
            if ( picked.id.entityCollection._entities._array[ 0 ]._properties._nimi_fi._value === 'Vironniemi' ) {
    
                await newDistrict( 'assets/data/HelsinkiSubDistrict.json', 'SubDistricts' );
                currentDistrictName = picked.id.properties.nimi_fi._value;
                levelsVisited.push( 'Districts' );
                handleGreenAreas();
                setDistrictOutlineColor( );
                toggleReturnButtonVisibility( );
                createPieChartForMajorDistrict( picked.id.properties.tunnus );
                await removeDataSourcesByNamePrefix( "MajorDistricts" );
                await removeDataSourcesByNamePrefix( "Districts" );
                    
            }
    
            if ( picked.id.entityCollection._entities._array[ 0 ]._properties._nimi_fi._value === 'Vilhonvuori' ) {
    
                levelsVisited.push( 'SubDistricts' );
                currentSubDistrictName = picked.id.properties.nimi_fi._value;
                handleGreenAreas();
                setDistrictOutlineColor( );
                toggleReturnButtonVisibility( );
                await removeDataSourcesByNamePrefix( "Districts" );
                createPieChartForMajorDistrict( picked.id.properties.tunnus );
                    
            }  

            await removeDuplicateDataSources( );

        } 

/*         printCesiumEntity( picked );
                
        if ( document.getElementById( "printToggle" ).checked ) {

            setPrintVisible( );
    
        } */

    }

}

function handleGreenAreas() {
            if ( document.getElementById( "showGreenToggle" ).checked ) {

                hideOutsideGreenAreas( );
                createGreenAreaScatterPlot( );
                extrudedGreenAreas( );

            } else {

                resetViewer( );
            }
    
}