/**
 * Creates SocioEconomics histogram for a postal code area.
 *
 * @param { object } sosData socioeconomic data used for creating the diagram
 */
function createSocioEconomicsDiagram( sosData ) {

	if ( sosData && showPlot ) {
	
		let x = [
			'% not vegetation',
			'Apartment Heat Exposure',
			'% of Children & Elderly',
			'% of Children',
			'% of  Elderly',
			'Small Apartment',
			'% with Basic Education',
			'Lack of Income',
			'% of Rentals'
		];	

		let y = [
			1 - sosData.vegetation.toFixed( 3 ), 
			sosData.apartment_heat_exposure.toFixed( 3 ), 
			sosData.vulnerable_both.toFixed( 3 ), 
			sosData.vulnerable_children.toFixed( 3 ), 
			sosData.vulnerable_eldery.toFixed( 3 ), 
			1 - sosData.avg_apart_size.toFixed( 3 ), 
			1 - sosData.educ.toFixed( 3 ), 
			1 - sosData.income.toFixed( 3 ), 
			sosData.rental_rate.toFixed( 3 ) 
		]

		let data = [
			{
				x: x,
				y: y,
				type: 'bar',
			}
		];
	
		if ( showPlot ) {
	
			document.getElementById( "plotSoSContainer" ).style.visibility = 'visible';
		}
	
		let layout = { 
			title: 'Vulnerability in ' + nameOfZone,
		};
	
		Plotly.newPlot( 'plotSoSContainer',  data, layout );
	}

}


/**
 * Creates scatter plot that always has average urban heat exposure to building at y-axis. Categorical attributes.
 *
 * @param { object } features dataset that contains building heat exposure and attributes of the building
 * @param { String } categorical name of categorical attribute
 * @param { String } numerical name of numerical attribute
 */
function createScatterPlot( features, categorical, numerical ) {

	if ( features.length > 0 && showPlot ) {

		const values = createUniqueValuesList( features, categorical );
		let data = [ ];
	
		for ( let i = 0; i < values.length; i++ ) {
	
			const dataWithHeat = addHeatForLabelAndX( values[ i ], features, categorical, numerical );
	
			const plotData = {
				x: dataWithHeat[ 1 ],
				y: dataWithHeat[ 0 ],
				name: values[ i ] + ' ' + dataWithHeat[ 2 ].toFixed( 2 ),
				type: 'scatter',
				mode: 'markers'
			};
	
			data.push( plotData );
		
		}
	
		document.getElementById( 'numericalSelect' ).style.visibility = 'visible';
		document.getElementById( 'categoricalSelect' ).style.visibility = 'visible';
		document.getElementById( "plotMaterialContainer" ).style.visibility = 'visible';
		  
		const layout = {
			scattermode: 'group',
			title: categorical,
			xaxis: {title: numerical },
			yaxis: {title: 'Heat'},
		};
		  
		Plotly.newPlot('plotMaterialContainer', data, layout);

	} else {
		
		document.getElementById( 'categoricalSelect' ).style.visibility = 'hidden';
		document.getElementById( 'numericalSelect' ).style.visibility = 'hidden';
		document.getElementById( "plotMaterialContainer" ).style.visibility = 'hidden';

	}

}

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

