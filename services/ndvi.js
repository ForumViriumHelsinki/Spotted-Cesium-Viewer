/**
   * s
   * 
   * @param { String } date - The date of NDVI data.
*/
function createNdviUrl( date ) {
    const lastLevel = levelsVisited[ levelsVisited.length - 1 ];

    switch ( lastLevel ) {
        case 'MajorDistricts':
            return "https://geo.fvh.fi/spotted/collections/ndvi_timeseries/items?f=json&limit=100000&date=" + date +  "&suurpiiri=" + majorDistrict;
        case 'Districts':
            return "https://geo.fvh.fi/spotted/collections/ndvi_timeseries/items?f=json&limit=100000&date=" + date +  "&peruspiiri=" + districtsVisited[ districtsVisited.length - 1 ];
        case 'SubDistricts':
            return "https://geo.fvh.fi/spotted/collections/ndvi_timeseries/items?f=json&limit=100000&date=" + date +  "&osaalue=" + districtsVisited[ districtsVisited.length - 1 ];
        default:
            return "https://geo.fvh.fi/spotted/collections/ndvi_timeseries/items?f=json&limit=100000&date=" + date +  "&suurpiiri=" + majorDistrict;
    }
}

/**
   * Asynchronously load NDVI data from an API endpoint based on major district id
   * 
   * @param { String } date - The date of NDVI data.
   */
async function loadNDVI(  date ) {

  
    // Construct the API endpoint URL
  let url = createNdviUrl( date );

  try {

      // Attempt to retrieve the NDVI data from the local storage using the API endpoint URL as the key
      const value = await localforage.getItem( url );

       // If the NDVI data is already available in the local storage, add it to the Cesium map
      if ( value ) {

          console.log("found from cache");
          let datasource = JSON.parse( value )
          addNDVIDataSource( datasource, date );

      } else {

          // Otherwise, fetch the NDVI data from the API endpoint and add it to the local storage
          loadNDVIWithoutCache( url, date );

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
* @param { String } date date of NDVI data
* @param { Boolean } show NDVI data
*/
function addNDVIDataSource( data, date ) {
  
  viewer.dataSources.add( Cesium.GeoJsonDataSource.load( data, {
    stroke: Cesium.Color.BLACK,
    fill: Cesium.Color.DARKGREEN,
    strokeWidth: 3,
    clampToGround: true
  }) )
  .then(function ( dataSource ) {
      
      // Set a name for the data source
      dataSource.name = "ndvi" + date;

      if ( date === '2018-06-14' ) {

        updateNDVIDataSources( );

      } else {

        document.getElementById( 'ndviSliderContainer' ).style.visibility = 'visible';

      }

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
* @param { String } date - The date of NDVI data.
*/
function loadNDVIWithoutCache( url, date ) {
  
  console.log("Not in cache! Loading: " + url );

  const response = fetch( url )
  .then( function( response ) {
    return response.json();
  })
  .then( function( data ) {
      localforage.setItem( url, JSON.stringify( data ) );
      addNDVIDataSource( data, date );
  })
  
}

/**
 * Set the polygon material color for a ndvi entity based on its category
 * 
 * @param { object } entity ndvi entity
 */
function setNDVIPolygonMaterialColor(entity) {
    const avgndvi = entity._properties._avgndvi._value;

    if (avgndvi <= 0) {
        return Cesium.Color.fromBytes(234, 234, 234); // #eaeaea
    } else if (avgndvi > 0.0 && avgndvi <= 0.1) {
        return Cesium.Color.fromBytes(204, 198, 130); // #ccc682
    } else if (avgndvi > 0.1 && avgndvi <= 0.2) {
        return Cesium.Color.fromBytes(145, 191, 81); // #91bf51
    } else if (avgndvi > 0.2 && avgndvi <= 0.3) {
        return Cesium.Color.fromBytes(112, 163, 63); // #70a33f
    } else if (avgndvi > 0.3 && avgndvi <= 0.4) {
        return Cesium.Color.fromBytes(79, 137, 45); // #4f892d
    } else if (avgndvi > 0.4 && avgndvi <= 0.5) {
        return Cesium.Color.fromBytes(48, 109, 28); // #306d1c
    } else if (avgndvi > 0.5 && avgndvi <= 0.6) {
        return Cesium.Color.fromBytes(15, 84, 10); // #0f540a
    } else if (avgndvi > 0.6) {
        return Cesium.Color.fromBytes(0, 68, 0); // #004400
    }
}


/**
* This function hides and shows ndvi datasources based on ndviSliderValue value
* 
*/
function updateNDVIDataSources( ) {
    hideDataSourceByName( "ndvi" );
    const sliderValue = parseInt(document.getElementById('ndviSlider').value);
    let dataSource = null;
    let date = '2018-06-14';
    let ndviData = [ 0, 0, 0, 0, 0, 0, 0, 0 ];


    if ( sliderValue === 0 ) {

        dataSource = getDataSourceByName( "ndvi2018-06-14" );

    }

    if ( sliderValue === 1 ) {

        dataSource = getDataSourceByName( "ndvi2020-06-21" );
        date = '2020-06-21';

    }

    if ( sliderValue === 2 ) {

        dataSource = getDataSourceByName( "ndvi2022-06-26" );
        date = '2022-06-26';

    }

    dataSource.show = true;	

    dataSource.entities.values.forEach( entity => {

        entity.show = true;
        entity.polygon.extrudedHeight = 1;
        entity.polygon.material = setNDVIPolygonMaterialColor( entity );

        const avgndvi = entity._properties._avgndvi._value;
        const area_m2 = Number( entity._properties._area_m2._value );

        if (avgndvi <= 0) {
            ndviData[ 0 ] = ndviData[ 0 ] + area_m2;
        } else if (avgndvi > 0.0 && avgndvi <= 0.1) {
            ndviData[ 1 ] = ndviData[ 1 ] + area_m2;
        } else if (avgndvi > 0.1 && avgndvi <= 0.2) {
            ndviData[ 2 ] = ndviData[ 2 ] + area_m2;
        } else if (avgndvi > 0.2 && avgndvi <= 0.3) {
            ndviData[ 3 ] = ndviData[ 3 ] + area_m2;
        } else if (avgndvi > 0.3 && avgndvi <= 0.4) {
            ndviData[ 4 ] = ndviData[ 4 ] + area_m2;
        } else if (avgndvi > 0.4 && avgndvi <= 0.5) {
            ndviData[ 5 ] = ndviData[ 5 ] + area_m2;
        } else if (avgndvi > 0.5 && avgndvi <= 0.6) {
            ndviData[ 6 ] = ndviData[ 6 ] + area_m2;
        } else if (avgndvi > 0.6) {
            ndviData[ 7 ] = ndviData[ 7 ] + area_m2;
        }

    });

    createNDVIBarPlot( ndviData, date )
    
}
