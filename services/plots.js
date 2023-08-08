

/**
 * Creates vegetation histogram for a major district area area
 *
 * @param { object } majordistrict major district code
 */
function createVegetationHistogram( majordistrict ) {


	let values = getTreeRateForMajorDistrict( majordistrict );

    let trace1 = {
        x: [ 'trees in area' ],
        y: [ values[ 0 ] ],
        name: majordistrict,
        type: 'bar'
    };
      
    let trace2 = {
        x: [ 'trees in whole city' ],
        y: [ values[ 1 ] ],
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
 * Creates vegetation histogram for a major district area area
 *
 * @param { object } majordistrict major district code
 */
function createVegetation2Histogram( majordistrict ) {


	let values = getTreeAndVegetationRateForMajorDistrict( majordistrict );

    let trace1 = {
        x: [ 'trees in area', 'vegetation in area' ],
        y: values[ 0 ],
        name: majordistrict,
        type: 'bar'
    };
      
    let trace2 = {
        x: [  'trees in whole city', 'vegetation in whole city' ],
        y: values[ 1 ],
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

