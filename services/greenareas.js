/**
   * Asynchronously load GreenAreas data from an API endpoint based on major district id
   * 
   */
  async function loadGreenAreas( ) {

  
		// Construct the API endpoint URL
	  let url = "https://geo.fvh.fi/spotted/collections/ylre_green_areas/items?f=json&limit=2000"
  
	  try {
  
		  // Attempt to retrieve the GreenAreas data from the local storage using the API endpoint URL as the key
      const cachedValue = await getCachedData(url);
		   // If the GreenAreas data is already available in the local storage, add it to the Cesium map
		  if ( cachedValue ) {
  
			  console.log("found from cache");
			  addGreenAreasDataSource( cachedValue );
  
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
            entity.polygon.material = setNDVIPolygonMaterialColor( entity, '_mean_ndvi' );
            

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
async function loadGreenAreasWithoutCache(url) {
    console.log("Not in cache! Loading: " + url);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // After successfully fetching, cache the data
        await setCachedData(url, data);
        // Then, add it as a data source
        addGreenAreasDataSource(data);
    } catch (error) {
        console.error("Error loading green areas data:", error);
    }
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

            if ( entity._properties._mean_ndvi._value <= 0.3 || entity._properties._viheralueen_pa._value <= 10000 ) {

                entity.show = false;
            }

        } else {

            entity.show = true;

        }

    });

  }

function extrudedGreenAreas( ) {
    
    const greenAreaDataSource = getDataSourceByName( "GreenAreas" );

    const minAreaValue = 10000;       // Minimum value for viheralueen_pa
    const averageAreaValue =  87586;   // Average value if only 10 000 + are incldued
    greenAreaDataSource.entities.values.forEach( entity => {

        if ( entity.show && entity.polygon && entity._properties._population_0km ) {
            
            entity.polygon.extrudedHeight = addNearbyPopulationWithWeights(entity) / ( entity._properties._viheralueen_pa._value / minAreaValue );

        } 

    });

    switchTo3DView( );
}

function normalizeValue(value, minValue, maxValue) {
    return (value - minValue) / (maxValue - minValue);
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
