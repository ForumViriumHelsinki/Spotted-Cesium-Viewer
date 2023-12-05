/**
   * Asynchronously load GreenAreas data from an API endpoint based on major district id
   * 
   */
  async function loadGreenAreas( ) {

  
		// Construct the API endpoint URL
	  let url = "https://geo.fvh.fi/spotted/collections/ylre_green_areas/items?f=json&limit=2000"
  
	  try {
  
		  // Attempt to retrieve the GreenAreas data from the local storage using the API endpoint URL as the key
		  const value = await localforage.getItem( url );
  
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
                createGreenAreaChart( );

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

    console.log("currentDistrictName", currentLevel)
    console.log("currentDistrictName", currentDistrictName)
    console.log("majorDistrictName", majorDistrictName)


    greenAreaDataSource.entities.values.forEach( entity => {

        if ( majorDistrictName ) {
            if ( currentLevel === 'MajorDistricts' && entity._properties._suurpiiri._value !== majorDistrictName ) {
                entity.show = false; // Hide the entity if suurpiiri doesn't match
            }

            if ( currentLevel === 'District' && entity._properties._kaupunginosa._value.toLowerCase() !== currentDistrictName.toLowerCase() ) {
                entity.show = false; // Hide the entity if kaupunginosa doesn't match
                console.log("hi")
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