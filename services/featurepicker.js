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

    } else {

        toPrint = toPrint + "<br/><br/><i>If average urban heat exposure of building is over 0.5 the nearest location with under 0.4 heat exposure is shown on map.</i>"

    }

    document.getElementById('printContainer').innerHTML = toPrint;
    document.getElementById('printContainer').scroll({
          top: 1000,
          behavior: 'smooth'
    });
}

function handlePostalCodeFeature( postcode, id ) {

    let bbox = findEntityBounds( id );
			
    let buffer = 0.000005 //Buffer for bounding box, somewhat complex as in radians...

    let rectangle = new Cesium.Rectangle( bbox[2] - buffer, bbox[ 0 ] - buffer, bbox[ 3 ] + buffer, bbox[ 1 ] + buffer );

    viewer.camera.flyTo({
        destination: rectangle,
        orientation:  {
            heading : Cesium.Math.toRadians(0.0),
            pitch : Cesium.Math.toRadians(-90.0),
            roll : 0.0
        },
        duration: 5
    });
            
    loadMajorDistrict( postcode );
        
}

function loadMajorDistrict( majordistrict ) {

    majorDistrict = majordistrict;

    document.getElementById("showWaterToggle").disabled = false;
    document.getElementById("showVegetationToggle").disabled = false;
    document.getElementById("showFieldsToggle").disabled = false;

    if ( document.getElementById( "printToggle" ).checked ) {

        setPrintVisible( );

    }

    console.log("Postal code area found!");

    removeDataSourcesAndEntities();
    
    if ( showVegetation ) {
        
        loadNatureAreas( majordistrict );
    
    }

    loadTreesSequentially( majordistrict );		

    loadPostCodeZones( 0.0 );

}

function handleBuildingFeature( buildingHeatExposure, address, postinumero ) {

    document.getElementById( "plotSoSContainer" ).style.visibility = 'hidden';
    document.getElementById( 'categoricalSelect' ).style.visibility = 'hidden';
    document.getElementById( 'numericalSelect' ).style.visibility = 'hidden';
    document.getElementById( 'plotMaterialContainer' ).style.visibility = 'hidden';

    console.log("Building found!");

    let trace1 = {
        x: [ 'to building' ],
        y: [ buildingHeatExposure ],
        name: address,
        type: 'bar'
    };
      
    let trace2 = {
        x: [ 'average in postal code area' ],
        y: [ averageHeatExposure ],
        name: postinumero,
        type: 'bar',
    };
      
    let data = [ trace1, trace2 ];
      
    let layout = { title: { text: 'Urban Heat Exposure Comparison' }, barmode: 'group' };

    //Test plotting
    if ( showPlot ) {

        document.getElementById( "plotContainer" ).style.visibility = 'visible';
    }

    Plotly.newPlot( 'plotContainer', data, layout );

    postalcode = postinumero;

}

/**
 * Handles the feature with properties
 * 
 * @param {Object} id - The ID of the picked entity
 */
function handleFeatureWithProperties( id ) {                
    
    postalcode = id.properties.tunnus;

    //If we find postal code, we assume this is an area & zoom in AND load the buildings for it.
    if ( postalcode ) {
        
        handlePostalCodeFeature( postalcode, id );
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
        
        let id = Cesium.defaultValue( picked.id, picked.primitive.id );
        
        if ( picked.id._polygon ) {
            
            if ( id instanceof Cesium.Entity ) {
                
                printCesiumEntity( picked , id );
            }
            
            if ( picked.id.properties ) {

                hidePlotlyIfNatureFeatureIsClicked( picked.id.properties.category );
                handleFeatureWithProperties( picked.id );
                
            }
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

    } else {

        if ( document.getElementById( "showPlotToggle" ).checked ) {

            document.getElementById( 'plotContainer' ).style.visibility = 'visible';

        }

    }
}