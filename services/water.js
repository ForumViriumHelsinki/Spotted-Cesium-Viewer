  
  /**
   * Asynchronously load water data from an API endpoint based on major district id
   * 
   * @param { String } majordistrict - The major district code.
   */
  async function loadWater( majordistrict ) {

  
		// Construct the API endpoint URL
	  let url = "https://geo.fvh.fi/spotted/collections/fresh_water/items?f=json&limit=32000&tunnus=" + majordistrict;
  
	  try {
  
		  // Attempt to retrieve the water data from the local storage using the API endpoint URL as the key
		  const value = await localforage.getItem( url );
  
		   // If the water data is already available in the local storage, add it to the Cesium map
		  if ( value ) {
  
			  console.log("found from cache");
			  let datasource = JSON.parse( value )
			  addWaterDataSource( datasource );
  
		  } else {
  
			  // Otherwise, fetch the water data from the API endpoint and add it to the local storage
			  loadWaterWithoutCache( url );
  
		  }

          createVegetationBarPlot( majordistrict._value );
		  createVegetationBarPlotPerInhabitant( majordistrict._value );
			
	  } catch ( err ) {
		  // This code runs if there were any errors.
		  console.log( err );
	  }
  }
  
  /**
   * Add the water data as a new data source to the Cesium
   * 
   * @param { object } data water data
   */
  function addWaterDataSource( data ) {
	  
	  viewer.dataSources.add( Cesium.GeoJsonDataSource.load( data, {
		  stroke: Cesium.Color.BLACK,
		  fill: Cesium.Color.DARKGREEN,
		  strokeWidth: 3,
		  clampToGround: true
	  }) )
	  .then(function ( dataSource ) {
		  
		  // Set a name for the data source
		  dataSource.name = "Water";
		  let entities = dataSource.entities.values;
		  
		  for ( let i = 0; i < entities.length; i++ ) {
			  
			  let entity = entities[ i ];
			  entity.polygon.pickable = false;
              entity.polygon.material = Cesium.Color.DEEPSKYBLUE.withAlpha( 0.5 );

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
  function loadWaterWithoutCache( url ) {
	  
	  console.log("Not in cache! Loading: " + url );
  
	  const response = fetch( url )
	  .then( function( response ) {
		return response.json();
	  })
	  .then( function( data ) {
		  localforage.setItem( url, JSON.stringify( data ) );
		  addWaterDataSource( data );
	  })
	  
  }
  