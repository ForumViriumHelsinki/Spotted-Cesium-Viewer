/**
 * Load otherNature sequentially with different parameters.
 * 
 * @param { String } majordistrict - The major district code.
 * @returns { Promise<void> } Promise that resolves when all function calls complete.
 */
async function loadOtherNatureSequentially( majordistrict ) {
	try {
  
	  let i = 0;
  
	  while ( true ) {
  
		  if ( i > 10000 ) {
  
			  await loadOtherNature( majordistrict, i, 800000 );
			  break; // Exit the loop when i is over 10000
  
			} else {
			  
			  if ( i > 1000 ) {
  
				  await loadOtherNature( majordistrict, i, i + 100 );
				  i = i + 100;
  
		  } else {
  
			  await loadOtherNature( majordistrict, i, i + 1000 );
			  i = i + 1000;
  
  
		  }
  
	  }
  }
  
	  // Code to execute after all function calls complete
	  console.log('All function calls have completed');
  
	  createVegetationBarPlot( majordistrict._value );
	  createVegetationBarPlotPerInhabitant( majordistrict._value );
  
	} catch ( error ) {
	  // Handle any errors that occurred during the function calls
	  console.error( 'An error occurred:', error );
	}
  
  }
  
  /**
   * Asynchronously load otherNature data from an API endpoint based on major district id
   * 
   * @param { String } majordistrict - The major district code.
   * @param { Number } lower minimun vegegation area
   * @param { Number } upper maximun vegegation area
   */
  async function loadOtherNature( majordistrict, lower, upper ) {

  
		// Construct the API endpoint URL
	  let url = "https://geo.fvh.fi/spotted/collections/othernature/items?f=json&limit=32000&tunnus=" + majordistrict + "&filter=area_m2%20BETWEEN%20" + lower + "%20AND%20"+ upper;
  
	  try {
  
		  // Attempt to retrieve the otherNature data from the local storage using the API endpoint URL as the key
		  const value = await localforage.getItem( url );
  
		   // If the otherNature data is already available in the local storage, add it to the Cesium map
		  if ( value ) {
  
			  console.log("found from cache");
			  let datasource = JSON.parse( value )
			  addOtherNatureDataSource( datasource, lower );
  
		  } else {
  
			  // Otherwise, fetch the otherNature data from the API endpoint and add it to the local storage
			  loadOtherNatureWithoutCache( url, lower );
  
		  }
			
	  } catch ( err ) {
		  // This code runs if there were any errors.
		  console.log( err );
	  }
  }
  
  /**
   * Add the otherNature data as a new data source to the Cesium
   * 
   * @param { object } data otherNature data
   * @param { Number } size minimun otherNature area size
   */
  function addOtherNatureDataSource( data, size ) {
	  
	  viewer.dataSources.add( Cesium.GeoJsonDataSource.load( data, {
		  stroke: Cesium.Color.BLACK,
		  fill: Cesium.Color.DARKGREEN,
		  strokeWidth: 3,
		  clampToGround: true
	  }) )
	  .then(function ( dataSource ) {
		  
		  // Set a name for the data source
		  dataSource.name = "OtherNature" + size;
		  let entities = dataSource.entities.values;
		  
		  for ( let i = 0; i < entities.length; i++ ) {
			  
			  let entity = entities[ i ];
			  const code = entity.properties._koodi._value;
			  setOtherNaturePolygonMaterialColor( entity, code );	

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
  function loadOtherNatureWithoutCache( url , lower ) {
	  
	  console.log("Not in cache! Loading: " + url );
  
	  const response = fetch( url )
	  .then( function( response ) {
		return response.json();
	  })
	  .then( function( data ) {
		  localforage.setItem( url, JSON.stringify( data ) );
		  addOtherNatureDataSource( data, lower );
	  })
	  
  }

/**
 * Sets the polygon material color for a othernature entity based on its category
 * 
 * @param {Object} entity - The othernature entity
 * @param {string} category - The category of the othernature entity
 */
function setOtherNaturePolygonMaterialColor( entity, category ) {
	 						
	switch ( category ){
		case "310":
			entity.polygon.material = Cesium.Color.LIGHTGREY.withAlpha( 0.5 );
			break;
		case "410":
			entity.polygon.material = Cesium.Color.SANDYBROWN.withAlpha( 0.5 );
			break;
		case "130":
			entity.polygon.material = Cesium.Color.ROSYBROWN.withAlpha( 0.5 );
			break;
		}	

}
