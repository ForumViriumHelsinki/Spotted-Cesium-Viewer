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

            updateNDVIDataSources();

        } 

        if ( date === '2023-01-27' ) {

            updateNDVIDataSources2023();

        }
        
        if ( date.substring( 0, 4 ) === '2020' || date.substring( 0, 4 ) === '2022' ) {

            document.getElementById('ndviSliderContainer').style.visibility = 'visible';

        }

        if ( date !== '2023-01-27' && date.substring( 0, 4 ) === '2023' )  {

            document.getElementById('ndviSliderContainer2023').style.visibility = 'visible';

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
function setNDVIPolygonMaterialColor(entity, property ) {
    const avgndvi = Number( entity._properties[ property ]._value );

    if (avgndvi <= 0) {
        console.log("negative ndvi")
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
        entity.polygon.material = setNDVIPolygonMaterialColor( entity, '_avgndvi' );

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

    createNDVIBarPlot( ndviData, date );
    createPieChartForMajorDistrict( districtsVisited[ districtsVisited.length - 1 ], date.substring(0, 4) );
    
}


/**
* This function hides and shows ndvi datasources based on ndviSliderValue value
* 
*/
function updateNDVIDataSources2023( ) {
    hideDataSourceByName( "ndvi" );
    const sliderValue = parseInt(document.getElementById('ndviSlider2023').value);
    let dataSource = null;
    let date = '2023-01-27';
    let ndviData = [ 0, 0, 0, 0, 0, 0, 0, 0 ];

    if ( sliderValue === 0 ) {

        dataSource = getDataSourceByName( "ndvi2023-01-27" );

    }

    if ( sliderValue === 1 ) {

        dataSource = getDataSourceByName( "ndvi2023-02-26" );
        date = '2023-02-26';

    }

    if ( sliderValue === 2 ) {

        dataSource = getDataSourceByName( "ndvi2023-03-15" );
        date = '2023-03-15';

    }

    if ( sliderValue === 3 ) {

        dataSource = getDataSourceByName( "ndvi2023-04-22" );
        date = '2023-04-22';

    }

    if ( sliderValue === 4 ) {

        dataSource = getDataSourceByName( "ndvi2023-05-24" );
        date = '2023-05-24';

    }

    if ( sliderValue === 5 ) {

        dataSource = getDataSourceByName( "ndvi2023-06-23" );
        date = '2023-06-23';

    }

    if ( sliderValue === 6 ) {

        dataSource = getDataSourceByName( "ndvi2023-07-13" );
        date = '2023-07-13';

    }

    if ( sliderValue === 7 ) {

        dataSource = getDataSourceByName( "ndvi2023-08-15" );
        date = '2023-08-15';

    }

    if ( sliderValue === 8 ) {

        dataSource = getDataSourceByName( "ndvi2023-09-14" );
        date = '2023-09-14';

    }

    if ( sliderValue === 9 ) {

        dataSource = getDataSourceByName( "ndvi2023-10-29" );
        date = '2023-10-29';

    }  
    
    if ( sliderValue === 10 ) {

        dataSource = getDataSourceByName( "ndvi2023-11-25" );
        date = '2023-11-25';

    }

    if ( sliderValue === 11 ) {

        dataSource = getDataSourceByName( "ndvi2023-12-28" );
        date = '2023-12-28';

    }

    dataSource.show = true;	

    dataSource.entities.values.forEach( entity => {

        entity.show = true;
        entity.polygon.extrudedHeight = 1;
        entity.polygon.material = setNDVIPolygonMaterialColor( entity, '_avgndvi' );

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

    addTickMarksAndLabels('ndviSlider2023', 'slider-ticks-container', 13);

    createNDVIBarPlot( ndviData, date );    
}

function addTickMarksAndLabels(sliderId, ticksContainerClass, numberOfTicks) {
    const container = document.querySelector(`#${sliderId} + .${ticksContainerClass}`);
    const monthAbbreviations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Calculate the offset for the labels to position them between ticks
    const labelOffsetPercent = 100 / (numberOfTicks - 1) / 2; // Half the distance between two ticks
    
    for (let i = 0; i < numberOfTicks - 1; i++) {
        const tick = document.createElement('div');
        tick.classList.add('slider-tick');
        tick.style.left = `${(i / (numberOfTicks - 1)) * 100}%`;
        
        if (i < numberOfTicks - 1) { // Check to avoid adding a label after the last tick
            // Create and position the label
            const label = document.createElement('div');
            label.classList.add('slider-label');
            label.textContent = monthAbbreviations[i];
            // Adjust the left position to move labels between ticks
            label.style.left = `calc(${(i / (numberOfTicks - 1)) * 100}% + ${labelOffsetPercent}%)`;
            
            container.appendChild(tick);
            container.appendChild(label);
        }
    }
}

  /**
   * Add the features with ndvi data as a new data source to the Cesium
   * 
   * @param { object } data features with ndvi
   * @param { Number } name name of the datasource
   * @param { Boolean } isPolygon tells if feature is polygon
   */
  function addFeaturesWithNDVI( data, name, isPolygon ) {
    viewer.dataSources.add(Cesium.GeoJsonDataSource.load(data, {
        clampToGround: true
    }))
    .then(function(dataSource) {
        dataSource.name = name;
        let entities = dataSource.entities.values;

        if ( isPolygon ) {

            setColorAndLabelForPolygonEntities( entities, 'ndvi_june2023' );

        } else {

            setColorAndLabelForPointEntities( entities, 'ndvi_june2023' );

        }
    })
    .otherwise(function(error) {
        console.log(error);
    });
}

function setColorAndLabelForPointEntities( entities, attributeName ) {

    for (let i = 0; i < entities.length; i++) {
        let entity = entities[i];
        if (entity.position) { // Check if entity is a point
            const color = setNDVIPolygonMaterialColor(entity, attributeName);
            // Set point color
            entity.point = new Cesium.PointGraphics({
                color: color,
                pixelSize: 20 // Adjust size as needed
            });

            // Add a label to display the NDVI value
            const ndviValue = entity.properties[ attributeName ].getValue();
            entity.label = new Cesium.LabelGraphics({
                text: ndviValue.toFixed( 3 ).toString(),
                font: '12pt sans-serif',
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -12) // Adjust label position relative to the point
            });

            entity.billboard = undefined; // Remove any billboard icon

        }
    }

}

function setColorAndLabelForPolygonEntities(entities, attributeName) {
    for (let i = 0; i < entities.length; i++) {
        let entity = entities[i];
        if (entity.polygon) { // Check if entity is a polygon
            const color = setNDVIPolygonMaterialColor(entity, attributeName);
            // Set polygon color
            entity.polygon.material = color;
            entity.polygon.outline = true; // Optional: Set to false if no outline is desired
            entity.polygon.outlineColor = Cesium.Color.BLACK;

            // Calculate the center of the polygon for placing the label
            const polygonHierarchy = entity.polygon.hierarchy.getValue(); // Get the positions defining the polygon
            const center = Cesium.BoundingSphere.fromPoints(polygonHierarchy.positions).center;
            const centerCartographic = Cesium.Cartographic.fromCartesian(center);
            const centerLongitude = Cesium.Math.toDegrees(centerCartographic.longitude);
            const centerLatitude = Cesium.Math.toDegrees(centerCartographic.latitude);

            // Add a label to display the NDVI value at the center of the polygon
            const ndviValue = entity.properties[attributeName].getValue();
            entity.label = new Cesium.LabelGraphics({
                text: ndviValue.toFixed(3).toString(),
                font: '12pt sans-serif',
                fillColor: Cesium.Color.WHITE,
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                verticalOrigin: Cesium.VerticalOrigin.CENTER,
                pixelOffset: new Cesium.Cartesian2(0, 0), // Centered on polygon
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, // Ensure label is clamped to the ground
                position: Cesium.Cartesian3.fromDegrees(centerLongitude, centerLatitude)
            });
        }
    }
}
