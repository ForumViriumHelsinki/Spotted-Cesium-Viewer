/**
 * Processes the click event on the viewer
 * 
 * @param {Cesium.Viewer} viewer - The Cesium viewer object
 * @param {MouseEvent} event - The click event
 */
function processClick( viewer, event ) {
    if ( majorDistrict ) {

        const elements = [
            'showPlotSwitch',
            'showPlotLabel'
        ];
    
        if ( document.getElementById( "showNDVIToggle" ).checked ) {
    
            elements.push( 'showNDVISwitch' );
            elements.push( 'showNDVILabel' );
    
        }
    
        if ( areAnySwitchesOn( ) ) {
    
            elements.push( 'showVegetationSwitch' );
            elements.push( 'showVegetationLabel' );
            elements.push( 'showOtherNatureSwitch' );
            elements.push( 'showOtherNatureLabel' );
            elements.push( 'showWaterSwitch' );
            elements.push( 'showWaterLabel' );
            elements.push( 'showFieldsSwitch' );
            elements.push( 'showFieldsLabel' );
            elements.push( 'showBuiltSwitch' );
            elements.push( 'showBuiltLabel' );
            elements.push( 'showTreesSwitch' );
            elements.push( 'showTreesLabel' );                  
        }
    
        setElementsDisplay( elements, 'inline-block' );

    } else {

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


    }
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
         
        if ( picked.id.entityCollection._entities._array[ 0 ]._properties._nimi_fi._value === 'Eteläinen' ) {

            majorDistrict = picked.id.properties.tunnus;
            majorDistrictName = picked.id.properties.nimi_fi._value;
            await removeDataSourcesByNamePrefix( "SubDistricts" );
            await newDistrict( 'assets/data/HelsinkiDistrict.json', 'Districts' );
            levelsVisited.push( 'MajorDistricts' );
            setDistrictOutlineColor( );
            toggleReturnButtonVisibility( );
            createPieChartForMajorDistrict( picked.id.properties.tunnus );
                
        }

        if ( picked.id.entityCollection._entities._array[ 0 ]._properties._nimi_fi._value === 'Vironniemi' ) {

            await newDistrict( 'assets/data/HelsinkiSubDistrict.json', 'SubDistricts' );
            levelsVisited.push( 'Districts' );
            setDistrictOutlineColor( );
            toggleReturnButtonVisibility( );
            createPieChartForMajorDistrict( picked.id.properties.tunnus );
            await removeDataSourcesByNamePrefix( "MajorDistricts" );
            await removeDataSourcesByNamePrefix( "Districts" );
                
        }

        if ( picked.id.entityCollection._entities._array[ 0 ]._properties._nimi_fi._value === 'Vilhonvuori' ) {

            levelsVisited.push( 'SubDistricts' );
            setDistrictOutlineColor( );
            toggleReturnButtonVisibility( );
            await removeDataSourcesByNamePrefix( "Districts" );
            createPieChartForMajorDistrict( picked.id.properties.tunnus );
                
        }  
                
        await removeDuplicateDataSources( );


        if ( document.getElementById( "printToggle" ).checked ) {

            setPrintVisible( );
    
        }


    }

}