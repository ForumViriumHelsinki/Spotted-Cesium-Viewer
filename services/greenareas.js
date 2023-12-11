/**
   * Asynchronously load GreenAreas data from an API endpoint based on major district id
   * 
   */
  async function loadGreenAreas( ) {

  
		// Construct the API endpoint URL
	  let url = "https://geo.fvh.fi/spotted/collections/ylre_green_areas/items?f=json&limit=2000"
  
	  try {
  
		  // Attempt to retrieve the GreenAreas data from the local storage using the API endpoint URL as the key
//		  const value = await localforage.getItem( url );
  let value = null;
		   // If the GreenAreas data is already available in the local storage, add it to the Cesium map
		  if ( value ) {
  
			  console.log("found from cache");
			  let datasource = JSON.parse( value )
			  addGreenAreasDataSource( datasource );
  
		  } else {
  
			  // Otherwise, fetch the GreenAreas data from the API endpoint and add it to the local storage
			  loadGreenAreasWithoutCache( url );
  
		  }
			
	  } catch ( err ) {
		  // This code runs if there were any errors.
		  console.log( err );
	  }
  }
  
  /**
   * Add the GreenAreas data as a new data source to the Cesium
   * 
   * @param { object } data GreenAreas data
   */
  function addGreenAreasDataSource( data ) {
	  
	  viewer.dataSources.add( Cesium.GeoJsonDataSource.load( data, {
		  stroke: Cesium.Color.BLACK,
		  fill: Cesium.Color.DARKGREEN,
		  strokeWidth: 3,
		  clampToGround: true
	  }) )
	  .then(function ( dataSource ) {
		  
		  // Set a name for the data source
		  dataSource.name = "GreenAreas";
		  let entities = dataSource.entities.values;
		  
		  for ( let i = 0; i < entities.length; i++ ) {
			  
			let entity = entities[ i ];
            let mean_ndi = entity._properties._mean_ndvi._value.toFixed( 3 );
            entity.polygon.material = new Cesium.Color( 1 - mean_ndi, 1, 0, 1 );
            

		  }

            if ( majorDistrictName ) {

                hideOutsideGreenAreas( );
                createGreenAreaScatterPlot( );
                extrudedGreenAreas( );

            }
	  })	
	  .otherwise(function ( error ) {
		  // Log any errors encountered while loading the data source
		  console.log( error );
	  });
  
  }
  
  /**
   * Fetch tree data from the API endpoint and add it to the local storage
   * 
   * @param { String } url API endpoint's url
   */
  function loadGreenAreasWithoutCache( url ) {
	  
	  console.log("Not in cache! Loading: " + url );
  
	  const response = fetch( url )
	  .then( function( response ) {
		return response.json();
	  })
	  .then( function( data ) {
		  localforage.setItem( url, JSON.stringify( data ) );
		  addGreenAreasDataSource( data );
	  })
	  
  }

  function hideOutsideGreenAreas( ) {
    
    const greenAreaDataSource = getDataSourceByName( "GreenAreas" );
    const currentLevel = levelsVisited[ levelsVisited.length - 1 ];

    greenAreaDataSource.entities.values.forEach( entity => {

        if ( majorDistrictName ) {
            if ( currentLevel === 'MajorDistricts' && entity._properties._suurpiiri._value !== majorDistrictName ) {
                entity.show = false; // Hide the entity if suurpiiri doesn't match
            }

            if ( currentLevel === 'District' && entity._properties._kaupunginosa._value.toLowerCase() !== currentDistrictName.toLowerCase() ) {
                entity.show = false; // Hide the entity if kaupunginosa doesn't match
            }

            if ( currentLevel === 'SubDistrict' && entity._properties._osa_alue._value.toLowerCase() !== currentSubDistrictName.toLowerCase() ) {
                entity.show = false; // Hide the entity if osa_alue doesn't match
            }

            if ( entity._properties._mean_ndvi._value <= 0.3 ) {

                entity.show = false;
            }

        } else {

            entity.show = true;

        }

    });

  }

function extrudedGreenAreas( ) {
    
    const greenAreaDataSource = getDataSourceByName( "GreenAreas" );

    greenAreaDataSource.entities.values.forEach( entity => {

        if ( entity.show && entity.polygon && entity._properties._population_0km ) {

            entity.polygon.extrudedHeight = addNearbyPopulationWithWeights( entity ) / ( entity._properties._viheralueen_pa._value / 100 );

        } 

    });

    switchTo3DView( );
}


// Function to switch back to 3D view
function switchTo3DView() {

        // Find the data source for MajorDistricts
    const districtDataSource = viewer.dataSources._dataSources.find( ds => ds.name === "MajorDistricts" );
    
    // Iterate over all entities in the postcodes data source.
    for ( let i = 0; i < districtDataSource._entityCollection._entities._array.length; i++ ) {
        
        let entity = districtDataSource._entityCollection._entities._array[ i ];
        
        // Check if the entity posno property matches the postalcode.
        if ( entity._properties._tunnus._value == majorDistrict ) {

            let polygonHierarchy = entity.polygon.hierarchy.getValue(Cesium.JulianDate.now());
let positions = polygonHierarchy.positions;
let center = Cesium.BoundingSphere.fromPoints(positions).center;
center = Cesium.Ellipsoid.WGS84.cartesianToCartographic(center);

let longitude = Cesium.Math.toDegrees(center.longitude);
let latitude = Cesium.Math.toDegrees(center.latitude);

                viewer.camera.flyTo( {
                    destination: Cesium.Cartesian3.fromDegrees( longitude + 0.01, latitude - 0.04, 4500 ),
                    orientation: {
                        heading: 0.0,
                        pitch: Cesium.Math.toRadians( -35.0 ),
                        roll: 0.0
                    },
                    duration: 3
                });
            
            break;
        }
    }
}

function findEntityBounds(element) {
	
    let i = 0;

    //These hold the bounding box
    let latMIN = 0;
    let latMAX = 0;
    let lonMIN = 0;
    let lonMAX = 0;

	//viewer.dataSources._dataSources[0].entities._entities._array[0]._polygon._hierarchy._value.positions[0]
    while (i < element._polygon._hierarchy._value.positions.length) {

        //Assemble lat & lon from entity position
        var posDeg = Cesium.Cartographic.fromCartesian(element._polygon._hierarchy._value.positions[i]);

        //First run
        if (i == 0) {
            latMIN = posDeg.latitude;
            latMAX = posDeg.latitude;
            lonMIN = posDeg.longitude;
            lonMAX = posDeg.longitude;
        }
        
        if (posDeg.latitude < latMIN) {
            latMIN = posDeg.latitude;
        }

        if (posDeg.latitude > latMAX) {
            latMAX = posDeg.latitude;
        }

        if (posDeg.longitude < lonMIN) {
            lonMIN = posDeg.longitude;
        }

        if (posDeg.longitude > lonMAX) {
            lonMAX = posDeg.longitude;
        }
      
        i++;
    }
    return [latMIN, latMAX, lonMIN, lonMAX];
}