/**
 * Calls all other diagram functions
 *
 * @param { object } district  district code
 */
function createDiagrams( district ) {

    createPieChartForMajorDistrict( district );
    //createVegetationBarPlot( district );
    createVegetationBarPlotPerInhabitant( district );

}

/**
 * Creates landcover comparasion pie chart for major district area
 *
 * @param { object } district major district code
 */
function createPieChartForMajorDistrict( district, year ) {

    let yearLabel = year;

    if ( !yearLabel ) {

        yearLabel = '2022'
    } 

    let firstData = getLandDataForMajorDistrict( district );
    let secondData = getLandDataForCity( );
    let secondDataName = 'Helsinki';

    if ( isNotHelsinkiSelected( ) ) {

        const selectedDistrict = document.getElementById('plotSelect').value;

        let otherDistrict = findDistrictIdByName( selectedDistrict )
        secondData = getLandDataForMajorDistrict( otherDistrict );
        secondDataName = selectedDistrict;
        setDistrictOutlineColor( otherDistrict,  selectedDistrict );

    }

    const data = [{
        values: firstData,
        labels: [ 'trees', 'vegetation', 'water', 'fields', 'rocks, dirt unused land', 'buildings and roads' ],
        domain: { column: 0 },
        name: districtName,
        hoverinfo: 'label+percent',
        hole: .4,
        type: 'pie',
        marker: {
            colors: [ 'forestgreen', 'green', 'mediumblue', 'yellow', 'sandybrown', ' red ']
        },
      },{
        values: secondData,
        labels: [ 'trees', 'vegetation', 'water', 'fields', 'rocks, dirt unused land', 'buildings and roads' ],
        text: secondDataName,
        textposition: 'inside',
        domain: { column: 1 },
        name: secondDataName,
        hoverinfo: 'label+percent',
        hole: .4,
        type: 'pie',
        marker: {
            colors: [ 'forestgreen', 'green', 'mediumblue', 'yellow', 'sandybrown', ' red ']
        },
      }];
      
    const layout = {
        title: 'Landcover comparison in ' + yearLabel,
        annotations: [
          {
            font: {
              size: 12
            },
            showarrow: false,
            text: districtName,
            x: 0.17,
            y: 0.5
          },
          {
            font: {
              size: 12
            },
            showarrow: false,
            text: secondDataName,
            x: 0.82,
            y: 0.5
          }
        ],
        height: 400,
        width: 600,
        showlegend: false,
        grid: { rows: 1, columns: 2 }
    };

    if ( showPlot ) {

        setPieChartVisibility( 'visible' );
        populateSelectFromGeoJSON( levelsVisited[ levelsVisited.length - 1 ], 'plotSelect', document.getElementById('plotSelect').value );

    }

      
    Plotly.newPlot('plotPieContainer', data, layout );

}

/**
 * Creates built bar for a major district area area
 *
 * @param { object } majordistrict major district code
 */
function createBuiltBarPlot( majordistrict ) {

    let trace1 = {
        x: [ 'buildings and roads' ],
        y: getBuiltDataForMajorDistrict( majordistrict ),
        name: majorDistrictName,
        type: 'bar',
        marker: {
            color: 'green'
        }
    };
      
    let trace2 = {
        x: [ 'buildings and roads' ],
        y: [ 0.19238164697212906 ],
        name: "Helsinki",
        type: 'bar',
        marker: {
            color: 'orange'
        }
    };
      
    let data = [ trace1, trace2 ];
      
    let layout = { title: { text: 'Buildings and Roads' }, barmode: 'group' };

    //Test plotting
    if ( showPlot ) {

        document.getElementById( "plotPieContainer" ).style.visibility = 'visible';
    }

    Plotly.newPlot( 'plotPieContainer', data, layout );

}

/**
 * Creates vegetation bar for a major district area area
 *
 * @param { String } district  district code
 */
function createVegetationBarPlot( district ) {

    const labels = getVegetationPlotLabels();

    let trace1 = {
        x: labels,
        y: getNatureDataForDistrict( district ),
        name: majorDistrictName,
        type: 'bar',
        hoverinfo: 'y+text',
        hovertext: ['%', '%', '%', '%', '%', '%', '%'],
    };
      
    let trace2 = {
        x: labels,
        y: getNatureDataForCity( ),
        name: "Helsinki",
        type: 'bar',
        hoverinfo: 'y+text',
        hovertext: ['%', '%', '%', '%', '%', '%', '%'],
        marker: {
            color: 'green'
        }
    };
      
    let data = [ trace1, trace2 ];
      
    let layout = { title: { text: 'Natural land cover %' }, barmode: 'group' };

    //Test plotting
    if ( showPlot ) {

        document.getElementById( "plotContainer" ).style.visibility = 'visible';
        toggleLabels( 'hidden' );

    }

    Plotly.newPlot( 'plotContainer', data, layout );

}

/**
 * Creates vegetation bar for a major district area area
 * 
 * @param { String } district major district code
 *
 */
function createVegetationBarPlotPerInhabitant( district ) {

    const labels = getVegetationPlotLabels();

    let trace1 = {
        x: labels,
        y: getNatureDataPerInhabitantForDistrict( district ),
        name: majorDistrictName,
        type: 'bar',
    };
      
    let trace2 = {
        x: labels,
        y: getNatureDataPerInhabitantForCity( ),
        name: "Helsinki",
        type: 'bar',
        marker: {
            color: 'green'
        }
    };
      
    let data = [ trace1, trace2 ];
      
    let layout = { title: { text: 'Nature (sqm) per inhabitant' }, barmode: 'group' };

    //Test plotting
    if ( showPlot ) {

        document.getElementById( "plotContainer" ).style.visibility = 'visible';
    }

    Plotly.newPlot( 'plotContainer', data, layout );

}

/**
 * Get data array for a specific major district, considering toggles for different rates
 * 
 * @param { string } district - district code
 * @returns { Array } Data array for the specified district
 */
function getNatureDataForDistrict( district ) {

    let data = [ ]; 

    // Check if the "showTreeToggle" checkbox is checked
    if ( document.getElementById( "showTreeToggle" ).checked ) {
        // If checked, add vegetation rate to the data array
        data.push( ( getTotalAreaByNameAndIdAndPropertyKeys( district, [ 'tree2_m2', 'tree10_m2', 'tree15_m2', 'tree20_m2' ] ) / districtArea ).toFixed( 3 ) * 100 );
    }
    
    // Check if the "showVegetationToggle" checkbox is checked
    if ( document.getElementById( "showVegetationToggle" ).checked ) {
        // If checked, add vegetation rate to the data array
        data.push( ( getTotalAreaByNameAndIdAndPropertyKeys( district, [ 'vegetation_m2' ] ) / districtArea ).toFixed( 3 ) * 100 );
    }

    // Check if the "showWaterToggle" checkbox is checked
    if ( document.getElementById( "showWaterToggle" ).checked ) {
        // If checked, add water rate to the data array
        data.push( ( getTotalAreaByNameAndIdAndPropertyKeys( district, [ 'water_m2' ] ) / districtArea ).toFixed( 3 ) * 100 );
    }

    // Check if the "showFieldsToggle" checkbox is checked
    if ( document.getElementById( "showFieldsToggle").checked ) {
        // If checked, add fields rate to the data array
        data.push( ( getTotalAreaByNameAndIdAndPropertyKeys( district, [ 'field_m2' ] ) / districtArea ).toFixed( 3 ) * 100 );
    }

    // Check if the "showOtherNatureToggle" checkbox is checked
    if ( document.getElementById( "showOtherNatureToggle").checked ) {
        // If checked, add fields rate to the data array
        data.push( ( getTotalAreaByNameAndIdAndPropertyKeys( district, [ 'rocks_m2', 'other_m2', 'bareland_m2' ] ) / districtArea ).toFixed( 3 ) * 100 );
    }

    return data; // Return the final data array

}

/**
 * Get data array for the entire city, considering toggles for different rates
 * 
 * @returns { Array } Data array for the entire city
 */
function getNatureDataForCity( ) {

    const helsinkiTotalLandArea = getCityTotalByNameAndProperty( 'pa_m2' );

    let data = [ ]; 

    // Check if the "showTreeToggle" checkbox is checked
    if ( document.getElementById( "showTreeToggle" ).checked ) {
        // If checked, add tree rate to the data array
        data.push( ( getTotalAreaByNameAndPropertyKeys( [ 'tree2_m2', 'tree10_m2', 'tree15_m2', 'tree20_m2' ] ) /  helsinkiTotalLandArea ).toFixed( 3 ) * 100 ) ;
    }

    // Check if the "showVegetationToggle" checkbox is checked
    if ( document.getElementById( "showVegetationToggle" ).checked ) {
        // If checked, add vegetation rate to the data array
        data.push( ( getTotalAreaByNameAndPropertyKeys( [ 'vegetation_m2' ] ) /  helsinkiTotalLandArea ).toFixed( 3 )  * 100  ) ;
    }

    // Check if the "showWaterToggle" checkbox is checked
    if ( document.getElementById( "showWaterToggle").checked ) {
        // If checked, add water rate to the data array
        data.push( ( getTotalAreaByNameAndPropertyKeys( [ 'water_m2' ] ) /  helsinkiTotalLandArea ).toFixed( 3 )  * 100 ) ;
    }

    // Check if the "showFieldsToggle" checkbox is checked
    if ( document.getElementById( "showFieldsToggle" ).checked ) {
        // If checked, add fields rate to the data array
        data.push( ( getTotalAreaByNameAndPropertyKeys( [ 'field_m2' ] ) /  helsinkiTotalLandArea ).toFixed( 3 )  * 100 ) ;
    }

    // Check if the "showOtherNatureToggle" checkbox is checked
    if ( document.getElementById( "showOtherNatureToggle").checked ) {
        // If checked, add fields rate to the data array
        data.push( ( getTotalAreaByNameAndPropertyKeys( [ 'rocks_m2', 'other_m2', 'bareland_m2' ] ) /  helsinkiTotalLandArea ).toFixed( 3 )  * 100 ) ;
    }

    return data; // Return the final data array

}

/**
 * Get data array for a specific district, considering toggles for different rates
 *  
 * @param { string } district - district code
 * 
 * @returns { Array } Data array for the specified district
 */
function getNatureDataPerInhabitantForDistrict( district ) {

    let data = [ ]; 

     // Check if the "showTreeToggle" checkbox is checked
     if ( document.getElementById( "showTreeToggle" ).checked ) {

        data.push( ( getTotalAreaByNameAndIdAndPropertyKeys( district, [ 'tree2_m2', 'tree10_m2', 'tree15_m2', 'tree20_m2' ] ) / districtPopulation ).toFixed( 3 ) );

    }    

     // Check if the "showVegetationToggle" checkbox is checked
    if ( document.getElementById( "showVegetationToggle" ).checked ) {

        data.push( ( getTotalAreaByNameAndIdAndPropertyKeys( district, [ 'vegetation_m2' ] ) / districtPopulation ).toFixed( 3 ) );

    }

    // Check if the "showWaterToggle" checkbox is checked
    if ( document.getElementById( "showWaterToggle" ).checked ) {

        data.push( ( getTotalAreaByNameAndIdAndPropertyKeys( district, [ 'water_m2' ] ) / districtPopulation ).toFixed( 3 ) );
    
    }

    // Check if the "showFieldsToggle" checkbox is checked
    if ( document.getElementById( "showFieldsToggle" ).checked ) {

        data.push( ( getTotalAreaByNameAndIdAndPropertyKeys( district, [ 'field_m2' ] ) / districtPopulation ).toFixed( 3 ) );

    }
    
    // Check if the "showOtherNatureToggle" checkbox is checked
    if ( document.getElementById( "showOtherNatureToggle").checked ) {

        data.push( ( getTotalAreaByNameAndIdAndPropertyKeys( district, [ 'rocks_m2', 'other_m2', 'bareland_m2' ] ) / districtPopulation ).toFixed( 3 ) );

    }

    return data; // Return the final data array

}

/**
 * Get data array for a specific major district, considering toggles for different rates
 * 
 * @returns { Array } Data array for the specified major district
 */
function getNatureDataPerInhabitantForCity( ) {

    const helsinkiPopulation = getCityTotalByNameAndProperty( 'asukasluku' );

    let data = [ ]; 

    // Check if the "showTreeToggle" checkbox is checked
    if ( document.getElementById( "showTreeToggle" ).checked ) {
    
        data.push( ( getTotalAreaByNameAndPropertyKeys( [ 'tree2_m2', 'tree10_m2', 'tree15_m2', 'tree20_m2' ] ) / helsinkiPopulation ).toFixed( 3 ) ) ;

    }

    // Check if the "showVegetationToggle" checkbox is checked
    if ( document.getElementById( "showVegetationToggle" ).checked ) {
    
        data.push( ( getTotalAreaByNameAndPropertyKeys( [ 'vegetation_m2' ] ) / helsinkiPopulation ).toFixed( 3 ) ) ;

    }

    // Check if the "showWaterToggle" checkbox is checked
    if ( document.getElementById( "showWaterToggle" ).checked ) {

        data.push( ( getTotalAreaByNameAndPropertyKeys( [ 'water_m2' ] ) / helsinkiPopulation ).toFixed( 3 ) ) ;
    
    }   
    
    // Check if the "showFieldsToggle" checkbox is checked
    if ( document.getElementById( "showFieldsToggle" ).checked ) {

        data.push( ( getTotalAreaByNameAndPropertyKeys( [ 'field_m2' ] ) / helsinkiPopulation ).toFixed( 3 ) ) ;

    }
    
    // Check if the "showOtherNatureToggle" checkbox is checked
    if ( document.getElementById( "showOtherNatureToggle").checked ) {

        data.push( ( getTotalAreaByNameAndPropertyKeys( [ 'rocks_m2', 'other_m2', 'bareland_m2' ] ) / helsinkiPopulation ).toFixed( 3 ) ) ;

    }    

    return data; // Return the final data array

}

/**
 * Get labels array for the different vegetation, considering toggles
 * 
 * @returns { Array } Labels array for the different rates in the area
 */
function getVegetationPlotLabels( ) {

    let labels = [ ];

    // Check if the "showTreeToggle" checkbox is checked
    if ( document.getElementById( "showTreeToggle" ).checked ) {
        // If checked, add vegetation label to the labels array
        labels.push( 'tree' );
    }

    // Check if the "showVegetationToggle" checkbox is checked
    if ( document.getElementById( "showVegetationToggle" ).checked ) {
        // If checked, add vegetation label to the labels array
        labels.push( 'vegetation' );
    }

    // Check if the "showWaterToggle" checkbox is checked
    if ( document.getElementById( "showWaterToggle" ).checked ) {
        // If checked, add water label to the labels array
        labels.push( 'water' );
    }

    // Check if the "showFieldsToggle" checkbox is checked
    if ( document.getElementById( "showFieldsToggle" ).checked ) {
        // If checked, add fields label to the labels array
        labels.push( 'fields' );
    }

    // Check if the "showOtherNatureToggle" checkbox is checked
    if ( document.getElementById( "showOtherNatureToggle" ).checked ) {
        // If checked, add fields label to the labels array
        labels.push( 'rocks, dirt unused land' );
    }

    return labels; // Return the final labels array

}


/**
 * Get data array for a specific major district, considering toggles for different rates
 * 
 * @param { string } majordistrict - Major district code
 * @returns { Array } Data array for the specified major district
 */
function getBuiltDataForMajorDistrict( majordistrict ) {

	switch ( majordistrict ) {
		case '1': 
			return [ 0.350254736944013 ];
		case '2': 
			return [ 0.228948474124779 ];
		case '3': 
			return [ 0.33682376642031 ];
		case '4': 
			return [ 0.164042665355905 ];
		case '5': 
			return [ 0.211445765144768 ];
		case '6': 
			return [ 0.147517445470486 ];
		case '7': 
			return [ 0.186212076835651 ];
        case '8': 
			return [ 0.0308350766173726 ];            
		default:
			return majordistrict;  				
	}
}


/**
 * Get landcover data array for a specific major district
 * 
 * @param { string } majordistrict - Major district code
 * @returns { Array } Data array for the specified major district
 */
function getLandDataForMajorDistrict( majordistrict ) {

    const trees = ( getTotalAreaByNameAndIdAndPropertyKeys( majordistrict, [ 'tree2_m2', 'tree10_m2', 'tree15_m2', 'tree20_m2' ] ) / districtArea ).toFixed( 3 ) * 100;
    const vegetation = ( getTotalAreaByNameAndIdAndPropertyKeys( majordistrict, [ 'vegetation_m2' ] ) / districtArea ).toFixed( 3 ) * 100;
    const water = ( getTotalAreaByNameAndIdAndPropertyKeys( majordistrict, [ 'water_m2' ] ) / districtArea ).toFixed( 3 ) * 100;
    const fields = ( getTotalAreaByNameAndIdAndPropertyKeys( majordistrict, [ 'field_m2' ] ) / districtArea ).toFixed( 3 ) * 100;
    const other = ( getTotalAreaByNameAndIdAndPropertyKeys( majordistrict, [ 'rocks_m2', 'other_m2', 'bareland_m2' ] ) / districtArea ).toFixed( 3 ) * 100;
    const built = ( getTotalAreaByNameAndIdAndPropertyKeys( majordistrict, [  'dirtroad_m2', 'pavedroad_m2', 'building_m2'  ] ) / districtArea ).toFixed( 3 ) * 100;

    return [ trees, vegetation, water, fields, other, built ];

} 

/**
 * Get landcover data array for a city
 * 
 * @returns { Array } Data array for the specified district
 */
function getLandDataForCity( ) {

    const helsinkiTotalLandArea = getCityTotalByNameAndProperty( 'pa_m2' );

    const trees = ( getTotalAreaByNameAndPropertyKeys( [ 'tree2_m2', 'tree10_m2', 'tree15_m2', 'tree20_m2' ] ) / helsinkiTotalLandArea ).toFixed( 3 ) * 100;
    const vegetation = ( getTotalAreaByNameAndPropertyKeys( [ 'vegetation_m2' ] ) / helsinkiTotalLandArea ).toFixed( 3 ) * 100;
    const water = ( getTotalAreaByNameAndPropertyKeys( [ 'water_m2' ] ) / helsinkiTotalLandArea ).toFixed( 3 ) * 100;
    const fields = ( getTotalAreaByNameAndPropertyKeys( [ 'field_m2' ] ) / helsinkiTotalLandArea ).toFixed( 3 ) * 100;
    const other = ( getTotalAreaByNameAndPropertyKeys( [ 'rocks_m2', 'other_m2', 'bareland_m2' ] ) / helsinkiTotalLandArea ).toFixed( 3 ) * 100;
    const built = ( getTotalAreaByNameAndPropertyKeys( [ 'dirtroad_m2', 'pavedroad_m2', 'building_m2' ] ) / helsinkiTotalLandArea ).toFixed( 3 ) * 100;

    return [ trees, vegetation, water, fields, other, built ];

}


/**
 * Creates vegetation bar for a major district area area
 *
 * @param { object } ndviData data of a distrct 
 * @param { String } date date of NDVI data 
 */
function createNDVIBarPlot( ndviData, date ) {

    const mil = 1000000;

    let x = [ "-0.0", "0.0-0.1","0.1-0.2","0.2-0.3","0.3-0.4","0.4-0.5","0.5-0.6","0.6-"];
    let y = [ ndviData[ 0 ] / mil, ndviData[ 1 ] / mil, ndviData[ 2 ] / mil, ndviData[ 3 ] / mil, ndviData[ 4 ] / mil, ndviData[ 5 ] / mil, ndviData[ 6 ] / mil, ndviData[ 7 ] / mil ];

    // Define an array of colors, one for each bar
    let colors = ['#eaeaea', '#ccc682', '#91bf51', '#70a33f', '#4f892d', '#306d1c', '#0f540a', '#004400'];

    let data = [{
        x: x,
        y: y,
        type: 'bar',        
        marker: {
            color: colors, 
        }
    }];

    let layout = {
        title: { text: districtName + ' ' + date },
        barmode: 'group',
        yaxis: {
            title: 'Area (km²)'
        },
        xaxis: {
            title: 'NDVI'
        }
    };

    //Test plotting
    if ( showPlot ) {

        document.getElementById( "plotContainer" ).style.visibility = 'visible';
        toggleLabels( 'visible' );
    }

    Plotly.newPlot( 'plotContainer', data, layout );

}

/**
 * Get ndvi value for a specific major district
 * 
 * @param { string } majordistrict - Major district code
 * @returns { Number } ndvi value for major district
 */
function getNDVIForDistrict( majordistrict ) {

    switch ( majordistrict ){
		case 1:
            return 0.211;
        case 2:
            return 0.314;
        case 3:
            return 0.220;
		case 4:
            return 0.361;
        case 5:
            return 0.313;
        case 6:
            return 0.315;
        case 7:
            return 0.301;
        case 8:
            return 0.395;
                                 
	}	
} 


/**
 * Create current district green area chart
 *
 */
function createGreenAreaChart( ) {

    const greenAreaDataSource = getDataSourceByName( "GreenAreas" );

    let puiston_nimi = [];
    let mean_ndvi = [];

    greenAreaDataSource.entities.values.forEach( entity => {

        if ( entity.show && entity._properties._mean_ndvi._value > 0.3 && !puiston_nimi.includes( entity._properties._puiston_nimi._value ) ) {
            puiston_nimi.push( entity._properties._puiston_nimi._value );
            mean_ndvi.push( entity._properties._mean_ndvi._value );
        } 

    }); 


    let trace1 = {
        x: puiston_nimi,
        y: mean_ndvi,
        type: 'bar'
    };
      
    let data = [ trace1 ];
      
    let layout = { title: { text: 'Green areas in ' + majorDistrictName + ' with over 0.3 ndvi' }, barmode: 'group' };

    //Test plotting
    if ( showPlot ) {

        document.getElementById( "greenAreaContainer" ).style.visibility = 'visible';
    }

    Plotly.newPlot( 'greenAreaContainer', data, layout );

}

/**
 * Create current district green area scatterplot
 *
 */
function createGreenAreaScatterPlot( ) {

    const greenAreaDataSource = getDataSourceByName( "GreenAreas" );

    let puiston_nimi = [];
    let data = [ ];

    greenAreaDataSource.entities.values.forEach( entity => {

        if ( entity.show && entity._properties._population_0km && entity._properties._mean_ndvi._value > 0.3 && !puiston_nimi.includes( entity._properties._puiston_nimi._value ) ) {
            puiston_nimi.push( entity._properties._puiston_nimi._value );

            const plotData = {
				x: [ entity._properties._mean_ndvi._value ],
				y: [ addNearbyPopulation( entity ) ],
				name: entity._properties._puiston_nimi._value,
				type: 'scatter',
				mode: 'markers'
			};
	
			data.push( plotData );
        } 

    }); 
			  
		const layout = {
			scattermode: 'group',
			xaxis: {title: 'ndvi' },
			yaxis: {title: 'Population'},
            showlegend: false,
		};
		  
    if ( showPlot ) {

        document.getElementById( "greenAreaContainer" ).style.visibility = 'visible';
        document.getElementById( 'sliderContainer' ).style.visibility = 'visible';
    }

    Plotly.newPlot( 'greenAreaContainer', data, layout );


document.getElementById('greenAreaContainer').on('plotly_click', function(data){
    let clickedParkName = data.points[0].data.name; // Retrieve the park name
    highlightEntityInCesium(clickedParkName, greenAreaDataSource);
});
}

function highlightEntityInCesium(parkName, greenAreaDataSource) {
    const entities = greenAreaDataSource.entities.values;
    for (let i = 0; i < entities.length; i++) {
        let entity = entities[i];
        if (entity._properties._puiston_nimi._value === parkName) {
            // Apply highlighting, e.g., change color
            entity.polygon.outlineColor = Cesium.Color.RED;
        } else {

            entity.polygon.outlineColor = Cesium.Color.BLACK; 
        }
    }
}

function addNearbyPopulation( entity ) {
    // Retrieve the slider value from the document
    const sliderValue = parseInt(document.getElementById('blueSlider').value);

    // Start with the base population value
    let value = entity._properties._population_0km._value;

    // Add to the value based on slider value
    if (sliderValue >= 1) {
        value = value + entity._properties._population_1km._value;
    }
    if (sliderValue >= 2) {
        value = value + entity._properties._population_2km._value;
    }
    if (sliderValue >= 3) {
        value = value + entity._properties._population_3km._value;
    }
    if (sliderValue >= 4) {
        value = value + entity._properties._population_4km._value;
    }
    if (sliderValue >= 5) {
        value = value + entity._properties._population_5km._value;
    }

    return value;

}

function addNearbyPopulationWithWeights( entity ) {
    const sliderValue = parseInt(document.getElementById('blueSlider').value);
    let value = 0; // Start with a base value of 0

    // Define maximum population values for each distance
    const maxPopulations = [11626, 44913, 83572, 96108, 87885, 90733];

    // Define a scaling function
    function scalePopulation(population, maxPopulation) {
        return (population / maxPopulation);
    }

    // Define weights for each distance band
    const weights = [1, 0.9, 0.7, 0.5, 0.3, 0.1];

    // Apply the scaling function to each population value, considering the slider value
    for (let i = 0; i <= sliderValue; i++) {
        let populationAttribute = `_population_${i}km`;
        if (entity._properties[populationAttribute]) {
            let populationValue = entity._properties[populationAttribute]._value;
            value += ( populationValue / 100 ) / ( i + 1 );
        }
    }

    return value;
}

/**
 * Creates NDVI histogram for a picked district
 *
 * @param { object } ndviData data of a distrct 
 * @param { String } date date of NDVI data 
 */
function createNDVIHistogram( ndviData, date ) {

	let data = {
		x: ndviData,
		type: 'histogram',
		name: 'NDVI',
		marker: {
			color: 'green',
		},
        xbins: {
            start: -0.1,
            end: 1,
            size: 0.1
        }
	};
	
	if ( showPlot ) {
	
		document.getElementById( "plotContainer" ).style.visibility = 'visible';
	}
	
	let layout = { 
		title: 'NDVI in ' + districtName + ' at ' + date,
		bargap: 0.1, 
	};
	
    //Test plotting
    if ( showPlot ) {

        document.getElementById( "plotContainer" ).style.visibility = 'visible';
        toggleLabels( 'visible' );
    }

    Plotly.newPlot( 'plotContainer', [ data ], layout );


}