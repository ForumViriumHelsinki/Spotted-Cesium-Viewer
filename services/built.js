/**
 * Load built sequentially with different parameters.
 * 
 * @param { String } majordistrict - The major district code.
 * @returns { Promise<void> } Promise that resolves when all function calls complete.
 */
async function loadBuiltSequentially( majordistrict ) {
	try {
  
	  let i = 0;
  
	  while ( true ) {
  
		  if ( i > 10000 ) {
  
			  await loadBuilt( majordistrict, i, 800000 );
			  break; // Exit the loop when i is over 10000
  
			} else {
			  
			  if ( i > 1000 ) {
  
				  await loadBuilt( majordistrict, i, i + 100 );
				  i = i + 100;
  
		  } else {
  
			  await loadBuilt( majordistrict, i, i + 1000 );
			  i = i + 1000;
  
  
		  }
  
	  }
  }
  
	  // Code to execute after all function calls complete
	  console.log('All function calls have completed');  
  
	} catch ( error ) {
	  // Handle any errors that occurred during the function calls
	  console.error( 'An error occurred:', error );
	}
  
  }
  
  /**
   * Asynchronously load built data from an API endpoint based on major district id
   * 
   * @param { String } majordistrict - The major district code.
   * @param { Number } lower minimun vegegation area
   * @param { Number } upper maximun vegegation area
   */
  async function loadBuilt( majordistrict, lower, upper ) {

  
		// Construct the API endpoint URL
	  let url = "https://geo.fvh.fi/spotted/collections/built/items?f=json&limit=32000&tunnus=" + majordistrict + "&filter=area_m2%20BETWEEN%20" + lower + "%20AND%20"+ upper;
  
	  try {
  
		  // Attempt to retrieve the built data from the local storage using the API endpoint URL as the key
		  const value = await localforage.getItem( url );
  
		   // If the built data is already available in the local storage, add it to the Cesium map
		  if ( value ) {
  
			  console.log("found from cache");
			  let datasource = JSON.parse( value )
			  addBuiltDataSource( datasource, lower );
  
		  } else {
  
			  // Otherwise, fetch the built data from the API endpoint and add it to the local storage
			  loadBuiltWithoutCache( url, lower );
  
		  }
			
	  } catch ( err ) {
		  // This code runs if there were any errors.
		  console.log( err );
	  }
  }
  
  /**
   * Add the built data as a new data source to the Cesium
   * 
   * @param { object } data built data
   * @param { Number } size minimun built area size
   */
  function addBuiltDataSource( data, size ) {
	  
	  viewer.dataSources.add( Cesium.GeoJsonDataSource.load( data, {
		  stroke: Cesium.Color.BLACK,
		  fill: Cesium.Color.DARKGREEN,
		  strokeWidth: 3,
		  clampToGround: true
	  }) )
	  .then(function ( dataSource ) {
		  
		  // Set a name for the data source
		  dataSource.name = "Built" + size;
		  let entities = dataSource.entities.values;
		  
		  for ( let i = 0; i < entities.length; i++ ) {
			  
			  let entity = entities[ i ];
			  entity.polygon.pickable = false;
			  const code = entity.properties._koodi._value;
			  setBuiltPolygonMaterialColor( entity, code );	

		  }
	  })	
	  .otherwise(function ( error ) {
		  // Log any errors encountered while loading the data source
		  console.log( error );
	  });
  
  }
  
  /**
   * Fetch built data from the API endpoint and add it to the local storage
   * 
   * @param { String } url API endpoint's url
   */
  function loadBuiltWithoutCache( url , lower ) {
	  
	  console.log("Not in cache! Loading: " + url );
  
	  const response = fetch( url )
	  .then( function( response ) {
		return response.json();
	  })
	  .then( function( data ) {
		  localforage.setItem( url, JSON.stringify( data ) );
		  addBuiltDataSource( data, lower );
	  })
	  
  }

/**
 * Sets the polygon material color for a built entity based on its category
 * 
 * @param {Object} entity - The built entity
 * @param {string} category - The category of the built entity
 */
function setBuiltPolygonMaterialColor( entity, category ) {
	 						
	switch ( category ){
		case "120": // building
			entity.polygon.material = Cesium.Color.DARKRED.withAlpha( 0.5 );
			break;
		case "112": // not paved road
			entity.polygon.material = Cesium.Color.SADDLEBROWN.withAlpha( 0.5 );
			break;
		case "111": // paved road
			entity.polygon.material = Cesium.Color.BLACK.withAlpha( 0.5 );
			break;
		}	

}