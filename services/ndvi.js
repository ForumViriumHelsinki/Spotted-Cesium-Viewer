/**
   * Asynchronously load NDVI data from an API endpoint based on major district id
   * 
   * @param { String } majordistrict - The major district code.
   */
async function loadNDVI( majordistrict ) {

  
    // Construct the API endpoint URL
  let url = "https://geo.fvh.fi/spotted/collections/helsinki_ndvi/items?f=json&limit=100000&tunnus=" + majordistrict;

  try {

      // Attempt to retrieve the NDVI data from the local storage using the API endpoint URL as the key
      const value = await localforage.getItem( url );

       // If the NDVI data is already available in the local storage, add it to the Cesium map
      if ( value ) {

          console.log("found from cache");
          let datasource = JSON.parse( value )
          addNDVIDataSource( datasource );

      } else {

          // Otherwise, fetch the NDVI data from the API endpoint and add it to the local storage
          loadNDVIWithoutCache( url );

      }
        
  } catch ( err ) {
      // This code runs if there were any errors.
      console.log( err );
  }
}

/**
* Add the NDVI data as a new data source to the Cesium
* 
* @param { object } data NDVI data
*/
function addNDVIDataSource( data ) {
  
  viewer.dataSources.add( Cesium.GeoJsonDataSource.load( data, {
      stroke: Cesium.Color.BLACK,
      fill: Cesium.Color.DARKGREEN,
      strokeWidth: 3,
      clampToGround: true
  }) )
  .then(function ( dataSource ) {
      
      // Set a name for the data source
      dataSource.name = "ndvi";
      let entities = dataSource.entities.values;
      
      for ( let i = 0; i < entities.length; i++ ) {
          
          let entity = entities[ i ];
          entity.polygon.pickable = false;
          entity.polygon.extrudedHeight = 0.5;
          setNDVIPolygonMaterialColor( entity );

      }

      createNDVIBarPlot( majorDistrict._value );
 
  })	
  .otherwise(function ( error ) {
      // Log any errors encountered while loading the data source
      console.log( error );
  });

}

/**
* Fetch NDVI data from the API endpoint and add it to the local storage
* 
* @param { String } url API endpoint's url
*/
function loadNDVIWithoutCache( url ) {
  
  console.log("Not in cache! Loading: " + url );

  const response = fetch( url )
  .then( function( response ) {
    return response.json();
  })
  .then( function( data ) {
      localforage.setItem( url, JSON.stringify( data ) );
      addNDVIDataSource( data );
  })
  
}

/**
 * Set the polygon material color for a ndvi entity based on its category
 * 
 * @param { object } entity ndvi entity
 */
function setNDVIPolygonMaterialColor( entity ) {

    const category = entity._properties._category._value;

    switch ( category ){
		case "very low":
            entity.polygon.material = Cesium.Color.RED;
			break;
        case "low":
            entity.polygon.material = Cesium.Color.ORANGE;
            break;
        case "moderate":
            entity.polygon.material = Cesium.Color.YELLOW;
            break;
		case "high":
            entity.polygon.material = Cesium.Color.GREENYELLOW;
            break;
        case "very high":
            entity.polygon.material = Cesium.Color.DARKGREEN;
            break;            
	}	

}