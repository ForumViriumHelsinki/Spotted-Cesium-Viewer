/**
   * Asynchronously load field data from an API endpoint based on major district id
   * 
   * @param { String } majordistrict - The major district code.
   */
async function loadFields( majordistrict ) {

  
    // Construct the API endpoint URL
  let url = "https://geo.fvh.fi/spotted/collections/field/items?f=json&limit=32000&tunnus=" + majordistrict;

  try {

      // Attempt to retrieve the field data from the local storage using the API endpoint URL as the key
      const value = await localforage.getItem( url );

       // If the field data is already available in the local storage, add it to the Cesium map
      if ( value ) {

          console.log("found from cache");
          let datasource = JSON.parse( value )
          addFieldsDataSource( datasource );

      } else {

          // Otherwise, fetch the field data from the API endpoint and add it to the local storage
          loadFieldsWithoutCache( url );

      }
        
  } catch ( err ) {
      // This code runs if there were any errors.
      console.log( err );
  }
}

/**
* Add the field data as a new data source to the Cesium
* 
* @param { object } data field data
*/
function addFieldsDataSource( data ) {
  
  viewer.dataSources.add( Cesium.GeoJsonDataSource.load( data, {
      stroke: Cesium.Color.BLACK,
      fill: Cesium.Color.DARKGREEN,
      strokeWidth: 3,
      clampToGround: true
  }) )
  .then(function ( dataSource ) {
      
      // Set a name for the data source
      dataSource.name = "Fields";
      let entities = dataSource.entities.values;
      
      for ( let i = 0; i < entities.length; i++ ) {
          
          let entity = entities[ i ];
          entity.polygon.extrudedHeight = 0.5;
          entity.polygon.material = Cesium.Color.GREENYELLOW.withAlpha( 0.5 );
      }
  })	
  .otherwise(function ( error ) {
      // Log any errors encountered while loading the data source
      console.log( error );
  });

}

/**
* Fetch field data from the API endpoint and add it to the local storage
* 
* @param { String } url API endpoint's url
*/
function loadFieldsWithoutCache( url ) {
  
  console.log("Not in cache! Loading: " + url );

  const response = fetch( url )
  .then( function( response ) {
    return response.json();
  })
  .then( function( data ) {
      localforage.setItem( url, JSON.stringify( data ) );
      addFieldsDataSource( data );
  })
  
}
