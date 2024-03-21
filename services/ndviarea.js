/**
* This function hides and shows ndvi datasources based on ndviSliderValue value
* 
*/
function updateNDVIYlreDataSources( ) {
    const sliderValue = parseInt(document.getElementById('ndviYlre').value);
    let dataSource = getDataSourceByName( ndviAreaDataSourceName );
    let entities = dataSource.entities.values;
    let ndviAreaValueElement = document.getElementById('ndviYlreValue');
    console.log("entites", entities)
    if ( sliderValue === 0 ) {

        setColorAndLabelForPointEntities( entities, 'ndvi_august2015' );
        ndviAreaValueElement.textContent = 'August 2015';

    }

    if ( sliderValue === 1 ) {

        setColorAndLabelForPointEntities( entities, 'ndvi_june2016' );
        ndviAreaValueElement.textContent = 'June 2016';

    }

    if ( sliderValue === 2 ) {

        setColorAndLabelForPointEntities( entities, 'ndvi_july2017' );
        ndviAreaValueElement.textContent = 'July 2017';

    }

    if ( sliderValue === 3 ) {

        setColorAndLabelForPointEntities( entities, 'ndvi_june2018' );
        ndviAreaValueElement.textContent = 'June 2018';

    }

    if ( sliderValue === 4 ) {

        setColorAndLabelForPointEntities( entities, 'ndvi_july2019' );
        ndviAreaValueElement.textContent = 'July 2019';

    }

    if ( sliderValue === 5 ) {

        setColorAndLabelForPointEntities( entities, 'ndvi_june2020' );
        ndviAreaValueElement.textContent = 'June 2020';

    }

    if ( sliderValue === 6 ) {

        setColorAndLabelForPointEntities( entities, 'ndvi_june2021' );
        ndviAreaValueElement.textContent = 'June 2021';

    }

    if ( sliderValue === 7 ) {

        setColorAndLabelForPointEntities( entities, 'ndvi_june2022' );
        ndviAreaValueElement.textContent = 'June 2022';

    }

    if ( sliderValue === 8 ) {

        setColorAndLabelForPointEntities( entities, 'ndvi_june2023' );
        ndviAreaValueElement.textContent = 'June 2023';

    }

    }



/**
* This function hides and shows ndvi datasources based on ndviSliderValue value
* 
*/
function updateNDVIAreaDataSources( ) {
    console.log("ndviAreaDataSourceName", ndviAreaDataSourceName);
    const sliderValue = parseInt(document.getElementById('ndviArea').value);
    let dataSource = getDataSourceByName( ndviAreaDataSourceName );
    let entities = dataSource.entities.values;
    let ndviAreaValueElement = document.getElementById('ndviAreaValue');

    if ( ndviAreaDataSourceName == 'TreeRegistry' ) {

    if ( sliderValue === 0 ) {

        setColorAndLabelForPointEntities( entities, 'ndvi_march2023' );
        ndviAreaValueElement.textContent = 'March 2023';

    }

    if ( sliderValue === 1 ) {

        setColorAndLabelForPointEntities( entities, 'ndvi_april2023' );
        ndviAreaValueElement.textContent = 'April 2023';

    }

    if ( sliderValue === 2 ) {

        setColorAndLabelForPointEntities( entities, 'ndvi_may023' );
        ndviAreaValueElement.textContent = 'May 2023';

    }

    if ( sliderValue === 3 ) {

        setColorAndLabelForPointEntities( entities, 'ndvi_june2023' );
        ndviAreaValueElement.textContent = 'June 2023';

    }

    if ( sliderValue === 4 ) {

        setColorAndLabelForPointEntities( entities, 'ndvi_july2023' );
        ndviAreaValueElement.textContent = 'July 2023';

    }

    if ( sliderValue === 5 ) {

        setColorAndLabelForPointEntities( entities, 'ndvi_august2023' );
        ndviAreaValueElement.textContent = 'August 2023';

    }

    if ( sliderValue === 6 ) {

        setColorAndLabelForPointEntities( entities, 'ndvi_september2023' );
        ndviAreaValueElement.textContent = 'September 2023';

    }

    if ( sliderValue === 7 ) {

        setColorAndLabelForPointEntities( entities, 'ndvi_october2023' );
        ndviAreaValueElement.textContent = 'October 2023';

    }
 
    } else {

    if ( sliderValue === 0 ) {

        setColorAndLabelForPolygonEntities( entities, 'ndvi_march2023' );
        ndviAreaValueElement.textContent = 'March 2023';

    }

    if ( sliderValue === 1 ) {

        setColorAndLabelForPolygonEntities( entities, 'ndvi_april2023' );
        ndviAreaValueElement.textContent = 'April 2023';

    }

    if ( sliderValue === 2 ) {

        setColorAndLabelForPolygonEntities( entities, 'ndvi_may2023' );
        ndviAreaValueElement.textContent = 'May 2023';

    }

    if ( sliderValue === 3 ) {

        setColorAndLabelForPolygonEntities( entities, 'ndvi_june2023' );
        ndviAreaValueElement.textContent = 'June 2023';

    }

    if ( sliderValue === 4 ) {

        setColorAndLabelForPolygonEntities( entities, 'ndvi_july2023' );
        ndviAreaValueElement.textContent = 'July 2023';

    }

    if ( sliderValue === 5 ) {

        setColorAndLabelForPolygonEntities( entities, 'ndvi_august2023' );
        ndviAreaValueElement.textContent = 'August 2023';

    }

    if ( sliderValue === 6 ) {

        setColorAndLabelForPolygonEntities( entities, 'ndvi_september2023' );
        ndviAreaValueElement.textContent = 'September 2023';

    }

    if ( sliderValue === 7 ) {

        setColorAndLabelForPolygonEntities( entities, 'ndvi_october2023' );
        ndviAreaValueElement.textContent = 'October 2023';

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

        if ( isPolygon || name === 'SubDistrictNDVI') {

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
        }
    }
}
