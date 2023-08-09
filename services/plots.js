

/**
 * Creates vegetation histogram for a major district area area
 *
 * @param { object } majordistrict major district code
 */
function createVegetationBarPlot( majordistrict ) {

    let trace1 = {
        x: getAreaLabels( ),
        y: getDataForMajorDistrict( majordistrict ),
        name: majordistrict,
        type: 'bar'
    };
      
    let trace2 = {
        x: getHelsinkiLabels( ),
        y: getDataForCity( ),
        name: "Helsinki",
        type: 'bar',
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
            return 0.180362772530447; // Tree rate for major district 1
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
            return 0.136310758913735; // Vegetation rate for major district 1
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
            return 0.0044131956071969; // Water rate for major district 1
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
            return 0.000876648183371481; // Fields rate for major district 1
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
 * Get data array for a specific major district, considering toggles for different rates
 * 
 * @param { string } majordistrict - Major district code
 * @returns { Array } Data array for the specified major district
 */
function getDataForMajorDistrict( majordistrict ) {

    let data = [ getTreeRateForMajorDistrict( majordistrict ) ]; // Initialize the data array with tree rate

    // Check if the "showVegetationToggle" checkbox is checked
    if ( document.getElementById( "showVegetationToggle" ).checked ) {
        // If checked, add vegetation rate to the data array
        data.push( getVegetationRateForMajorDistrict( majordistrict ) );
    }

    // Check if the "showWaterToggle" checkbox is checked
    if ( document.getElementById( "showWaterToggle" ).checked ) {
        // If checked, add water rate to the data array
        data.push( getWaterRateForMajorDistrict( majordistrict ) );
    }

    // Check if the "showFieldsToggle" checkbox is checked
    if ( document.getElementById( "showFieldsToggle").checked ) {
        // If checked, add fields rate to the data array
        data.push( getFieldsRateForMajorDistrict( majordistrict ) );
    }

    return data; // Return the final data array

}

/**
 * Get data array for the entire city, considering toggles for different rates
 * 
 * @returns { Array } Data array for the entire city
 */
function getDataForCity( ) {

    let data = [ 0.26229790964449 ]; // Initialize the data array with default city value

    // Check if the "showVegetationToggle" checkbox is checked
    if ( document.getElementById( "showVegetationToggle" ).checked ) {
        // If checked, add vegetation rate to the data array
        data.push( 0.197748000824418) ;
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

    return data; // Return the final data array

}

/**
 * Get labels array for the different rates in the area, considering toggles
 * 
 * @returns { Array } Labels array for the different rates in the area
 */
function getAreaLabels( ) {

    let labels = [ 'trees in area' ]; // Initialize the labels array with the default label

    // Check if the "showVegetationToggle" checkbox is checked
    if ( document.getElementById( "showVegetationToggle" ).checked ) {
        // If checked, add vegetation label to the labels array
        labels.push( 'vegetation in area' );
    }

    // Check if the "showWaterToggle" checkbox is checked
    if ( document.getElementById( "showWaterToggle" ).checked ) {
        // If checked, add water label to the labels array
        labels.push( 'water in area' );
    }

    // Check if the "showFieldsToggle" checkbox is checked
    if ( document.getElementById( "showFieldsToggle" ).checked ) {
        // If checked, add fields label to the labels array
        labels.push( 'fields in area' );
    }

    return labels; // Return the final labels array

}

/**
 * Get labels array for the different rates in the whole city, considering toggles
 * 
 * @returns { Array } Labels array for the different rates in the whole city
 */
function getHelsinkiLabels( ) {

    let labels = [ 'trees whole city' ]; // Initialize the labels array with the default label

    // Check if the "showVegetationToggle" checkbox is checked
    if ( document.getElementById( "showVegetationToggle" ).checked ) {
        // If checked, add vegetation label to the labels array
        labels.push( 'vegetation whole city' );
    }

    // Check if the "showWaterToggle" checkbox is checked
    if ( document.getElementById( "showWaterToggle" ).checked ) {
        // If checked, add water label to the labels array
        labels.push( 'water whole city' );
    }

    // Check if the "showFieldsToggle" checkbox is checked
    if ( document.getElementById( "showFieldsToggle" ).checked ) {
        // If checked, add fields label to the labels array
        labels.push( 'fields whole city' );
    }

    return labels; // Return the final labels array

}
