/**
 * Creates landcover comparasion pie chart for major district area
 *
 * @param { object } majordistrict major district code
 */
function createPieChartForMajorDistrict( majordistrict ) {

    const data = [{
        values: getLandDataForMajorDistrict( majordistrict ),
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
        values: [ 31.82, 19.78, 4.82, 1.23, 23.03, 19.24 ],
        labels: [ 'trees', 'vegetation', 'water', 'fields', 'rocks, dirt unused land', 'buildings and roads' ],
        text: 'Helsinki',
        textposition: 'inside',
        domain: { column: 1 },
        name: 'Helsinki',
        hoverinfo: 'label+percent',
        hole: .4,
        type: 'pie',
        marker: {
            colors: [ 'forestgreen', 'green', 'mediumblue', 'yellow', 'sandybrown', ' red ']
        },
      }];
      
    const layout = {
        title: 'Landcover comparison',
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
            text: 'Helsinki',
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

        document.getElementById( "plotBuiltContainer" ).style.visibility = 'visible';
    }
      
    Plotly.newPlot('plotBuiltContainer', data, layout );

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
        name: districtName,
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

        document.getElementById( "plotBuiltContainer" ).style.visibility = 'visible';
    }

    Plotly.newPlot( 'plotBuiltContainer', data, layout );

}

/**
 * Creates vegetation bar for a major district area area
 *
 * @param { object } majordistrict major district code
 */
function createVegetationBarPlot( majordistrict ) {

    const labels = getVegetationPlotLabels();

    let trace1 = {
        x: labels,
        y: getNatureDataForMajorDistrict( majordistrict ),
        name: districtName,
        type: 'bar',
    };
      
    let trace2 = {
        x: labels,
        y: getNatureDataForCity( ),
        name: "Helsinki",
        type: 'bar',
        marker: {
            color: 'green'
        }
    };
      
    let data = [ trace1, trace2 ];
      
    let layout = { title: { text: 'Vegetation Comparison' }, barmode: 'group' };

    //Test plotting
    if ( showPlot ) {

        document.getElementById( "plotContainer" ).style.visibility = 'visible';
    }

    Plotly.newPlot( 'plotContainer', data, layout );

}

/**
 * Get tree rate for a specific major district
 * 
 * @param { string } majordistrict - Major district code
 * @returns { number } Tree rate for the specified major district
 */
function getTreeRateForMajorDistrict( majordistrict ) {

    switch ( majordistrict ) {
        case '1':
            return 0.180562288871742; // Tree rate for major district 1
        case '2':
            return 0.3192200634; // Tree rate for major district 2
        case '3':
            return 0.1879065695; // Tree rate for major district 3
        case '4':
            return 0.347176476824404; // Tree rate for major district 4
        case '5':
            return 0.23710680147664; // Tree rate for major district 5
        case '6':
            return 0.429511343304354; // Tree rate for major district 6
        case '7':
            return 0.307034338528661; // Tree rate for major district 7
        case '8':
            return 0.531066144775314; // Tree rate for major district 8
        default:
            return 0; // Default value if major district code is not recognized
    }

}

/**
 * Get vegetation rate for a specific major district
 * 
 * @param {string} majordistrict - Major district code
 * @returns {number} Vegetation rate for the specified major district
 */
function getVegetationRateForMajorDistrict( majordistrict ) {

    switch ( majordistrict ) {
        case '1':
            return 0.136461545151472; // Vegetation rate for major district 1
        case '2':
            return 0.210707839554935; // Vegetation rate for major district 2
        case '3':
            return 0.134483049663128; // Vegetation rate for major district 3
        case '4':
            return 0.213280606265504; // Vegetation rate for major district 4
        case '5':
            return 0.235880570887264; // Vegetation rate for major district 5
        case '6':
            return 0.196945132000506; // Vegetation rate for major district 6
        case '7':
            return 0.215161244751333; // Vegetation rate for major district 7
        case '8':
            return 0.199602230190655; // Vegetation rate for major district 8
        default:
            return 0; // Default value if major district code is not recognized
    }

}

/**
 * Get water rate for a specific major district
 * 
 * @param { string } majordistrict - Major district code
 * @returns { number } Water rate for the specified major district
 */
function getWaterRateForMajorDistrict( majordistrict ) {

    switch ( majordistrict ) {
        case '1':
            return 0.004418077460744687; // Water rate for major district 1
        case '2':
            return 0.0115195831615184; // Water rate for major district 2
        case '3':
            return 0.00572305553464529; // Water rate for major district 3
        case '4':
            return 0.0269253552077743; // Water rate for major district 4
        case '5':
            return 0.0211478064347008; // Water rate for major district 5
        case '6':
            return 0.00966826824459433; // Water rate for major district 6
        case '7':
            return 0.00598259487446442; // Water rate for major district 7
        case '8':
            return 0.0105059180635932; // Water rate for major district 8
        default:
            return 0; // Default value if major district code is not recognized
    }

}

/**
 * Get fields rate for a specific major district
 * 
 * @param { string } majordistrict - Major district code
 * @returns { number } Fields rate for the specified major district
 */
function getFieldsRateForMajorDistrict( majordistrict ) {

    switch ( majordistrict ) {
        case '1':
            return 0.0008776179269371576; // Fields rate for major district 1
        case '2':
            return 0.0102769855345775; // Fields rate for major district 2
        case '3':
            return 0.0000669505729193174; // Fields rate for major district 3
        case '4':
            return 0.117216388319723; // Fields rate for major district 4
        case '5':
            return 0.0864012466909172; // Fields rate for major district 5
        case '6':
            return 0.0125898154358978; // Fields rate for major district 6
        case '7':
            return 0.00916775999908508; // Fields rate for major district 7
        case '8':
            return 0.137241046334979; // Fields rate for major district 8
        default:
            return 0; // Default value if major district code is not recognized
    }

}

/**
 * Get other nature rate for a specific major district
 * 
 * @param { string } majordistrict - Major district code
 * @returns { number } other nature rate for the specified major district
 */
function getOtherNatureRateForMajorDistrict( majordistrict ) {

    switch ( majordistrict ) {
        case '1':
            return 0.3438673693570627; // Fields rate for major district 1
        case '2':
            return 0.223162836799504; // Fields rate for major district 2
        case '3':
            return 0.349620631126367; // Fields rate for major district 3
        case '4':
            return 0.137304459314582; // Fields rate for major district 4
        case '5':
            return 0.221055671545325; // Fields rate for major district 5
        case '6':
            return 0.268463466990779; // Fields rate for major district 6
        case '7':
            return 0.282302052397503; // Fields rate for major district 7
        case '8':
            return 0.104217291059008; // Fields rate for major district 8
        default:
            return 0; // Default value if major district code is not recognized
    }

}


/**
 * Get data array for a specific major district, considering toggles for different rates
 * 
 * @param { string } majordistrict - Major district code
 * @returns { Array } Data array for the specified major district
 */
function getNatureDataForMajorDistrict( majordistrict ) {

    let data = [ getTreeRateForMajorDistrict( majordistrict ).toFixed( 3 ) ]; // Initialize the data array with tree rate

    // Check if the "showVegetationToggle" checkbox is checked
    if ( document.getElementById( "showVegetationToggle" ).checked ) {
        // If checked, add vegetation rate to the data array
        data.push( getVegetationRateForMajorDistrict( majordistrict ).toFixed( 3 ) );
    }

    // Check if the "showWaterToggle" checkbox is checked
    if ( document.getElementById( "showWaterToggle" ).checked ) {
        // If checked, add water rate to the data array
        data.push( getWaterRateForMajorDistrict( majordistrict ).toFixed( 3 ) );
    }

    // Check if the "showFieldsToggle" checkbox is checked
    if ( document.getElementById( "showFieldsToggle").checked ) {
        // If checked, add fields rate to the data array
        data.push( getFieldsRateForMajorDistrict( majordistrict ).toFixed( 3 ) );
    }

    // Check if the "showOtherNatureToggle" checkbox is checked
    if ( document.getElementById( "showOtherNatureToggle").checked ) {
        // If checked, add fields rate to the data array
        data.push( getOtherNatureRateForMajorDistrict( majordistrict ).toFixed( 3 ) );
    }

    return data; // Return the final data array

}

/**
 * Get data array for the entire city, considering toggles for different rates
 * 
 * @returns { Array } Data array for the entire city
 */
function getNatureDataForCity( ) {

    let data = [ 0.318 ]; // Initialize the data array with default city value

    // Check if the "showVegetationToggle" checkbox is checked
    if ( document.getElementById( "showVegetationToggle" ).checked ) {
        // If checked, add vegetation rate to the data array
        data.push( 0.197748000824418 ) ;
    }

    // Check if the "showWaterToggle" checkbox is checked
    if ( document.getElementById( "showWaterToggle").checked ) {
        // If checked, add water rate to the data array
        data.push( 0.048248528642427256 );
    }

    // Check if the "showFieldsToggle" checkbox is checked
    if ( document.getElementById( "showFieldsToggle" ).checked ) {
        // If checked, add fields rate to the data array
        data.push( 0.012282989542894572 );
    }

    // Check if the "showOtherNatureToggle" checkbox is checked
    if ( document.getElementById( "showOtherNatureToggle").checked ) {
        // If checked, add fields rate to the data array
        data.push( 0.230313862272067 );
    }

    return data; // Return the final data array

}

/**
 * Get labels array for the different vegetation, considering toggles
 * 
 * @returns { Array } Labels array for the different rates in the area
 */
function getVegetationPlotLabels( ) {

    let labels = [ 'trees' ]; // Initialize the labels array with the default label

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

	switch ( majordistrict ) {
        case '1':
            return [ 18.06, 13.65, 0.44, 0.09, 34.39, 35.03 ]; 
        case '2':
            return [ 31.92, 21.07, 1.15, 1.03, 22.32, 22.89 ]; 
        case '3':
            return [ 18.79, 13.45, 0.57, 0.01, 34.96, 33.68 ]; 
        case '4':
            return [ 34.72, 21.33, 2.69, 11.72, 13.73, 16.40 ]; 
        case '5':
            return [ 23.71, 23.59, 2.11, 8.64, 22.11, 21.14 ]; 
        case '6':
            return [ 42.95, 19.69, 0.97, 1.26, 26.85, 14.75 ];
        case '7':
            return [ 30.70, 21.52, 0.60, 0.92, 28.23, 18.62 ];
        case '8':
            return [ 53.11, 19.96, 1.05, 13.72, 10.42, 3.08 ];      
		default:
			return majordistrict;  				
	}
} 