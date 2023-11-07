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
function createPieChartForMajorDistrict( district ) {

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

        document.getElementById( "plotBuiltContainer" ).style.visibility = 'visible';
    }

    Plotly.newPlot( 'plotBuiltContainer', data, layout );

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
 * @param { String } district  district code
 */
function createNDVIBarPlot( district ) {

    let trace1 = {
        x: [ "ndvi" ],
        y: [ getNDVIForDistrict( district ) ],
        name: majorDistrictName,
        type: 'bar',
    };
      
    let trace2 = {
        x: [ "ndvi" ],
        y: [ 0.312 ],
        name: "Helsinki",
        type: 'bar',
        marker: {
            color: 'green'
        }
    };
      
    let data = [ trace1, trace2 ];
    let layout = { title: { text: 'Average ndvi 15.08.2023' }, barmode: 'group' };

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