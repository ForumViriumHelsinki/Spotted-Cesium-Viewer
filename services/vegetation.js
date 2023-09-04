/**
 * Load vegetation sequentially with different parameters.
 * 
 * @param { String } majordistrict - The major district code.
 * @returns { Promise<void> } Promise that resolves when all function calls complete.
 */
async function loadVegetationSequentially( majordistrict ) {
	try {
  
	  let i = 0;
  
	  while ( true ) {
  
		  if ( i > 10000 ) {
  
			  await loadVegetation( majordistrict, i, 200000 );
			  break; // Exit the loop when i is over 10000
  
			} else {
			  
			  if ( i > 1000 ) {
  
				  await loadVegetation( majordistrict, i, i + 100 );
				  i = i + 100;
  
		  } else {
  
			  await loadVegetation( majordistrict, i, i + 1000 );
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
   * Asynchronously load vegetation data from an API endpoint based on major district id
   * 
   * @param { String } majordistrict - The major district code.
   * @param { Number } lower minimun vegegation area
   * @param { Number } upper maximun vegegation area
   */
  async function loadVegetation( majordistrict, lower, upper ) {

  
		// Construct the API endpoint URL
	  let url = "https://geo.fvh.fi/spotted/collections/vegetation/items?f=json&limit=32000&tunnus=" + majordistrict + "&filter=area_m2%20BETWEEN%20" + lower + "%20AND%20"+ upper;
  
	  try {
  
		  // Attempt to retrieve the vegetation data from the local storage using the API endpoint URL as the key
		  const value = await localforage.getItem( url );
  
		   // If the vegetation data is already available in the local storage, add it to the Cesium map
		  if ( value ) {
  
			  console.log("found from cache");
			  let datasource = JSON.parse( value )
			  addVegetationDataSource( datasource, lower );
  
		  } else {
  
			  // Otherwise, fetch the vegetation data from the API endpoint and add it to the local storage
			  loadVegetationWithoutCache( url, lower );
  
		  }
			
	  } catch ( err ) {
		  // This code runs if there were any errors.
		  console.log( err );
	  }
  }
  
  /**
   * Add the vegetation data as a new data source to the Cesium
   * 
   * @param { object } data vegetation data
   * @param { Number } size minimun vegetation area size
   */
  function addVegetationDataSource( data, size ) {
	  
	  viewer.dataSources.add( Cesium.GeoJsonDataSource.load( data, {
		  stroke: Cesium.Color.BLACK,
		  fill: Cesium.Color.DARKGREEN,
		  strokeWidth: 3,
		  clampToGround: true
	  }) )
	  .then(function ( dataSource ) {
		  
		  // Set a name for the data source
		  dataSource.name = "Vegetation" + size;
		  let entities = dataSource.entities.values;
		  
		  for ( let i = 0; i < entities.length; i++ ) {
			  
			  let entity = entities[ i ];
			  entity.polygon.extrudedHeight = 0.1;
			  entity.polygon.material = Cesium.Color.LIGHTGREEN.withAlpha( 0.5 );	
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
  function loadVegetationWithoutCache( url , lower ) {
	  
	  console.log("Not in cache! Loading: " + url );
  
	  const response = fetch( url )
	  .then( function( response ) {
		return response.json();
	  })
	  .then( function( data ) {
		  localforage.setItem( url, JSON.stringify( data ) );
		  addVegetationDataSource( data, lower );
	  })
	  
  }
  