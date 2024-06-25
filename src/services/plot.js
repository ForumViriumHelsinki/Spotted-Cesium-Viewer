import * as Cesium from 'cesium';
import District from './district.js'; 
import Cache from './cache.js'; 
import { useGlobalStore } from '../stores/global-store.js';
import ElementsDisplay from './elements-display.js';
import Datasource from './datasource.js';
import { usePopulationStore } from '../stores/population-store.js';

export default class Plot {
	constructor() {
		this.store = useGlobalStore();
		this.districtService = new District();
		this.datasourceService = new Datasource();
		this.cacheService = new Cache();
		this.elementsDisplayService = new ElementsDisplay();
		this.viewer = this.store.cesiumViewer;
		this.populationPressureStore = usePopulationStore();
	}

	createUrbanHeatHistogram( urbanHeatData ) {

	if ( urbanHeatData.length > 0 ) {

		let trace = {
			x: urbanHeatData,
			type: 'histogram',
			name: 'average heat exposure to building',
			marker: {
				color: 'orange',
			},
		};
	
	
		document.getElementById( "plotContainer" ).style.visibility = 'visible';
	
		let layout = { 
			title: 'July 2023 Max Heat Exposure for Buildings in the ' + this.store.districtName + ' District',
			bargap: 0.05, 
		};
	
		Plotly.newPlot( 'plotContainer', [ trace ], layout );

	}

}

	/**
 * Calls all other diagram functions
 *
 * @param { object } district  district code
 */
	createDiagrams( district ) {

		this.createPieChartForMajorDistrict( );
		//createVegetationBarPlot( district );
		this.createVegetationBarPlotPerInhabitant( district );

	}

	/**
 * Check if the selected option in the 'plotSelect' <select> element is not equal to 'Helsinki'.
 * 
 * @returns {boolean} true if the selected option is not 'Helsinki', false otherwise.
 */
	isNotHelsinkiSelected() {
		// Get the <select> element by its ID
		const selectElement = document.getElementById( 'plotSelect' );

		if ( selectElement ) {
			// Get the selected option's value
			const selectedValue = selectElement.value;

			// Check if the selected value is not 'Helsinki'
			return selectedValue !== 'Helsinki';
		}

		// Handle the case where the <select> element is not found
		console.error( 'Select element with ID \'plotSelect\' not found.' );
		return false;
	}

	/**
 * Creates landcover comparasion pie chart for major district area
 *
 * @param { string } year
 */
	createPieChartForMajorDistrict( year ) {

		if ( !document.getElementById( 'showGreenToggle' ).checked ) {

			let yearLabel = year;

			if ( !yearLabel ) {
    
				yearLabel = '2022';
			} 
    
			let firstData = this.getLandDataForMajorDistrict( this.store.districtsVisited[ this.store.districtsVisited.length - 1 ] );
			let secondData = this.getLandDataForCity( );
			let secondDataName = 'Helsinki';
    
			if ( this.isNotHelsinkiSelected( ) ) {
    
				const selectedDistrict = document.getElementById( 'plotSelect' ).value;
    
				let otherDistrict = this.districtService.findDistrictIdByName( selectedDistrict );
				secondData = this.getLandDataForMajorDistrict( otherDistrict );
				secondDataName = selectedDistrict;
				this.districtService.setDistrictOutlineColor( otherDistrict,  selectedDistrict );
    
			}

			const data = [ {
				values: firstData,
				labels: [ 'trees20', 'trees15', 'trees10', 'trees2', 'vegetation', 'water', 'fields', 'rocks', 'other', 'bareland', 'buildings',  'dirtroads', 'pavedroads' ],
				domain: { column: 0 },
				name: this.store.districtName,
				hoverinfo: 'label+percent',
				hole: .4,
				type: 'pie', 
				marker: {
					colors: [ '#326428', '#327728', '#328228', '#32a028', '#b2df43', '#6495ed', '#ffd980', '#bfbdc2', '#857976', '#cd853f', '#d80000', '#824513', '#000000' ]
				},
			},{
				values: secondData,
				labels: [ 'trees20', 'trees15', 'trees10', 'trees2', 'vegetation', 'water', 'fields', 'rocks', 'other', 'bareland', 'buildings',  'dirtroads', 'pavedroads' ],
				text: secondDataName,
				textposition: 'inside',
				domain: { column: 1 },
				name: secondDataName,
				hoverinfo: 'label+percent',
				hole: .4,
				type: 'pie',
				marker: {
					colors: [  '#326428', '#327728', '#328228', '#32a028', '#b2df43', '#6495ed', '#ffd980', '#bfbdc2', '#857976', '#cd853f', '#d80000', '#824513', '#000000' ]
				},
			} ];
          
			const layout = {
				title: 'Landcover comparison in ' + yearLabel,
				annotations: [
					{
						font: {
							size: 12
						},
						showarrow: false,
						text: this.store.districtName,
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
    
			if ( this.store.showPlot ) {
    
				this.elementsDisplayService.setPieChartVisibility( 'visible' );
				this.populateSelectFromGeoJSON( this.store.levelsVisited[ this.store.levelsVisited.length - 1 ], 'plotSelect', document.getElementById( 'plotSelect' ).value );
    
			}
    
			Plotly.newPlot( 'plotPieContainer', data, layout );

		}

	}

	/**
 * Populate a <select> element with options based on the 'nimi_fi' attribute of a GeoJSON data source.
 * 
 * @param {string} dataSourceName - The name of the GeoJSON data source.
 * @param {string} selectElementId - The ID of the <select> element to populate.
 */
	populateSelectFromGeoJSON( dataSourceName, selectElementId, currentValue ) {
		// Get the GeoJSON data source by name

		const geoJsonDataSource = this.viewer.dataSources.getByName( dataSourceName )[0];

		if ( !geoJsonDataSource ) {
			console.error( `Data source with name '${dataSourceName}' not found.` );
			return;
		}

		// Get the 'nimi_fi' values from the features
		const nimiFiValues = [];
		const entities = geoJsonDataSource.entities.values;

		for ( const entity of entities ) {
			const nimiFi = entity.properties.nimi_fi._value;
			if ( nimiFi && !nimiFiValues.includes( nimiFi ) ) {
				nimiFiValues.push( nimiFi );
			}
		}

		// Get the <select> element
		const selectElement = document.getElementById( selectElementId );

		if ( !selectElement ) {
			console.error( `Select element with ID '${selectElementId}' not found.` );
			return;
		}

		// Remove all options except the first one
		this.removeOptionsExceptFirst( selectElement );

		// Populate the <select> element with options
		for ( const nimiFi of nimiFiValues ) {
			const optionElement = document.createElement( 'option' );
			optionElement.value = nimiFi;
			optionElement.textContent = nimiFi;
			selectElement.appendChild( optionElement );
		}

		document.getElementById( selectElementId ).value = currentValue;
	}

	/**
 * Remove all options except the first one from a <select> element.
 * 
 * @param {HTMLSelectElement} selectElement - The <select> element to remove options from.
 */
	removeOptionsExceptFirst( selectElement ) {
		const options = selectElement.querySelectorAll( 'option' );
		for ( let i = 1; i < options.length; i++ ) {
			options[i].remove();
		}
	}

	/**
 * Creates vegetation bar for a major district area area
 *
 * @param { String } district  district code
 */
	createVegetationBarPlot( district ) {

		const labels = this.getVegetationPlotLabels();

		let trace1 = {
			x: labels,
			y: this.getNatureDataForDistrict( district ),
			name: this.store.majorDistrictName,
			type: 'bar',
			hoverinfo: 'y+text',
			hovertext: [ '%', '%', '%', '%', '%', '%', '%' ],
		};
      
		let trace2 = {
			x: labels,
			y: this.getNatureDataForCity( ),
			name: 'Helsinki',
			type: 'bar',
			hoverinfo: 'y+text',
			hovertext: [ '%', '%', '%', '%', '%', '%', '%' ],
			marker: {
				color: 'green'
			}
		};
      
		let data = [ trace1, trace2 ];
      
		let layout = { title: { text: 'Natural land cover %' }, barmode: 'group' };

		//Test plotting
		if ( this.store.showPlot ) {

			document.getElementById( 'plotContainer' ).style.visibility = 'visible';
			this.elementsDisplayService.toggleLabels( 'hidden' );

		}

		Plotly.newPlot( 'plotContainer', data, layout );

	}

	/**
 * Creates vegetation bar for a major district area area
 * 
 * @param { String } district major district code
 *
 */
	createVegetationBarPlotPerInhabitant( district ) {

		const labels = this.getVegetationPlotLabels();

		let trace1 = {
			x: labels,
			y: this.getNatureDataPerInhabitantForDistrict( district ),
			name: this.store.majorDistrictName,
			type: 'bar',
		};
      
		let trace2 = {
			x: labels,
			y: this.getNatureDataPerInhabitantForCity( ),
			name: 'Helsinki',
			type: 'bar',
			marker: {
				color: 'green'
			}
		};
      
		let data = [ trace1, trace2 ];
      
		let layout = { title: { text: 'Nature (sqm) per inhabitant' }, barmode: 'group' };

		//Test plotting
		if ( this.store.showPlot ) {

			document.getElementById( 'plotContainer' ).style.visibility = 'visible';
		}

		Plotly.newPlot( 'plotContainer', data, layout );

	}

	/**
 * Get data array for a specific major district, considering toggles for different rates
 * 
 * @param { string } district - district code
 * @returns { Array } Data array for the specified district
 */
	getNatureDataForDistrict( district ) {

		let data = [ ]; 

		// Check if the "showTreeToggle" checkbox is checked
		if ( document.getElementById( 'showTreeToggle' ).checked ) {
			// If checked, add vegetation rate to the data array
			data.push( ( this.districtService.getTotalAreaByNameAndIdAndPropertyKeys( district, [ 'tree2_m2', 'tree10_m2', 'tree15_m2', 'tree20_m2' ] ) / this.store.districtArea ).toFixed( 3 ) * 100 );
		}
    
		// Check if the "showVegetationToggle" checkbox is checked
		if ( document.getElementById( 'landCoverToggle' ).checked ) {
			// If checked, add vegetation rate to the data array
			data.push( ( this.districtService.getTotalAreaByNameAndIdAndPropertyKeys( district, [ 'vegetation_m2' ] ) / this.store.districtArea ).toFixed( 3 ) * 100 );
			data.push( ( this.districtService.getTotalAreaByNameAndIdAndPropertyKeys( district, [ 'water_m2' ] ) / this.store.districtArea ).toFixed( 3 ) * 100 );
			data.push( ( this.districtService.getTotalAreaByNameAndIdAndPropertyKeys( district, [ 'field_m2' ] ) / this.store.districtArea ).toFixed( 3 ) * 100 );
			data.push( ( this.districtService.getTotalAreaByNameAndIdAndPropertyKeys( district, [ 'rocks_m2', 'other_m2', 'bareland_m2' ] ) / this.store.districtArea ).toFixed( 3 ) * 100 );

		}

		return data; // Return the final data array

	}

	/**
 * Get data array for the entire city, considering toggles for different rates
 * 
 * @returns { Array } Data array for the entire city
 */
	getNatureDataForCity( ) {

		const helsinkiTotalLandArea = this.districtService.getCityTotalByNameAndProperty( 'pa_m2' );

		let data = [ ]; 

		// Check if the "showTreeToggle" checkbox is checked
		if ( document.getElementById( 'showTreeToggle' ).checked ) {
			// If checked, add tree rate to the data array
			data.push( ( this.districtService.getTotalAreaByNameAndPropertyKeys( [ 'tree2_m2', 'tree10_m2', 'tree15_m2', 'tree20_m2' ] ) /  helsinkiTotalLandArea ).toFixed( 3 ) * 100 ) ;
		}

		// Check if the "showVegetationToggle" checkbox is checked
		if ( document.getElementById( 'landCoverToggle' ).checked ) {
			// If checked, add vegetation rate to the data array
			data.push( ( this.districtService.getTotalAreaByNameAndPropertyKeys( [ 'vegetation_m2' ] ) /  helsinkiTotalLandArea ).toFixed( 3 )  * 100  ) ;
			data.push( ( this.districtService.getTotalAreaByNameAndPropertyKeys( [ 'water_m2' ] ) /  helsinkiTotalLandArea ).toFixed( 3 )  * 100 ) ;
			data.push( ( this.districtService.getTotalAreaByNameAndPropertyKeys( [ 'field_m2' ] ) /  helsinkiTotalLandArea ).toFixed( 3 )  * 100 ) ;
			data.push( ( this.districtService.getTotalAreaByNameAndPropertyKeys( [ 'rocks_m2', 'other_m2', 'bareland_m2' ] ) /  helsinkiTotalLandArea ).toFixed( 3 )  * 100 ) ;

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
	getNatureDataPerInhabitantForDistrict( district ) {

		let data = [ ]; 

		// Check if the "showTreeToggle" checkbox is checked
		if ( document.getElementById( 'showTreeToggle' ).checked ) {

			data.push( ( this.districtService.getTotalAreaByNameAndIdAndPropertyKeys( district, [ 'tree2_m2', 'tree10_m2', 'tree15_m2', 'tree20_m2' ] ) / this.store.districtPopulation ).toFixed( 3 ) );

		}    

		// Check if the "showVegetationToggle" checkbox is checked
		if ( document.getElementById( 'landCoverToggle' ).checked ) {

			data.push( ( this.districtService.getTotalAreaByNameAndIdAndPropertyKeys( district, [ 'vegetation_m2' ] ) / this.store.districtPopulation ).toFixed( 3 ) );
			data.push( ( this.districtService.getTotalAreaByNameAndIdAndPropertyKeys( district, [ 'water_m2' ] ) / this.store.districtPopulation ).toFixed( 3 ) );
			data.push( ( this.districtService.getTotalAreaByNameAndIdAndPropertyKeys( district, [ 'field_m2' ] ) / this.store.districtPopulation ).toFixed( 3 ) );
			data.push( ( this.districtService.getTotalAreaByNameAndIdAndPropertyKeys( district, [ 'rocks_m2', 'other_m2', 'bareland_m2' ] ) / this.store.districtPopulation ).toFixed( 3 ) );

		}

		return data; // Return the final data array

	}

	/**
 * Get data array for a specific major district, considering toggles for different rates
 * 
 * @returns { Array } Data array for the specified major district
 */
	getNatureDataPerInhabitantForCity( ) {

		const helsinkiPopulation = this.districtService.getCityTotalByNameAndProperty( 'asukasluku' );

		let data = [ ]; 

		// Check if the "showTreeToggle" checkbox is checked
		if ( document.getElementById( 'showTreeToggle' ).checked ) {
    
			data.push( ( this.districtService.getTotalAreaByNameAndPropertyKeys( [ 'tree2_m2', 'tree10_m2', 'tree15_m2', 'tree20_m2' ] ) / helsinkiPopulation ).toFixed( 3 ) ) ;

		}

		// Check if the "showVegetationToggle" checkbox is checked
		if ( document.getElementById( 'landCoverToggle' ).checked ) {
    
			data.push( ( this.districtService.getTotalAreaByNameAndPropertyKeys( [ 'vegetation_m2' ] ) / helsinkiPopulation ).toFixed( 3 ) ) ;
			data.push( ( this.districtService.getTotalAreaByNameAndPropertyKeys( [ 'water_m2' ] ) / helsinkiPopulation ).toFixed( 3 ) ) ;
			data.push( ( this.districtService.getTotalAreaByNameAndPropertyKeys( [ 'field_m2' ] ) / helsinkiPopulation ).toFixed( 3 ) ) ;
			data.push( ( this.districtService.getTotalAreaByNameAndPropertyKeys( [ 'rocks_m2', 'other_m2', 'bareland_m2' ] ) / helsinkiPopulation ).toFixed( 3 ) ) ;

		}
  
		return data; // Return the final data array

	}

	/**
 * Get labels array for the different vegetation, considering toggles
 * 
 * @returns { Array } Labels array for the different rates in the area
 */
	getVegetationPlotLabels( ) {

		let labels = [ ];

		// Check if the "showTreeToggle" checkbox is checked
		if ( document.getElementById( 'showTreeToggle' ).checked ) {
			// If checked, add vegetation label to the labels array
			labels.push( 'tree' );
		}

		// Check if the "showVegetationToggle" checkbox is checked
		if ( document.getElementById( 'landCoverToggle' ).checked  ) {
			// If checked, add vegetation label to the labels array
			labels.push( 'vegetation' );
			labels.push( 'water' );
			labels.push( 'fields' );
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
	getBuiltDataForMajorDistrict( majordistrict ) {

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
	getLandDataForMajorDistrict( majordistrict ) {

		const trees20 = ( this.districtService.getTotalAreaByNameAndIdAndPropertyKeys( majordistrict, [ 'tree20_m2' ] ) / this.store.districtArea ).toFixed( 3 ) * 100;
		const trees15 = ( this.districtService.getTotalAreaByNameAndIdAndPropertyKeys( majordistrict, [ 'tree15_m2' ] ) / this.store.districtArea ).toFixed( 3 ) * 100;
		const trees10 = ( this.districtService.getTotalAreaByNameAndIdAndPropertyKeys( majordistrict, [ 'tree10_m2' ] ) / this.store.districtArea ).toFixed( 3 ) * 100;
		const trees2 = ( this.districtService.getTotalAreaByNameAndIdAndPropertyKeys( majordistrict, [ 'tree2_m2' ] ) / this.store.districtArea ).toFixed( 3 ) * 100;
		const vegetation = ( this.districtService.getTotalAreaByNameAndIdAndPropertyKeys( majordistrict, [ 'vegetation_m2' ] ) / this.store.districtArea ).toFixed( 3 ) * 100;
		const water = ( this.districtService.getTotalAreaByNameAndIdAndPropertyKeys( majordistrict, [ 'water_m2' ] ) / this.store.districtArea ).toFixed( 3 ) * 100;
		const fields = ( this.districtService.getTotalAreaByNameAndIdAndPropertyKeys( majordistrict, [ 'field_m2' ] ) / this.store.districtArea ).toFixed( 3 ) * 100;
		const rock = ( this.districtService.getTotalAreaByNameAndIdAndPropertyKeys( majordistrict, [ 'rocks_m2' ] ) / this.store.districtArea ).toFixed( 3 ) * 100;
		const other = ( this.districtService.getTotalAreaByNameAndIdAndPropertyKeys( majordistrict, [ 'other_m2' ] ) / this.store.districtArea ).toFixed( 3 ) * 100;
		const bareland = ( this.districtService.getTotalAreaByNameAndIdAndPropertyKeys( majordistrict, [ 'bareland_m2' ] ) / this.store.districtArea ).toFixed( 3 ) * 100;
		const building = ( this.districtService.getTotalAreaByNameAndIdAndPropertyKeys( majordistrict, [ 'building_m2' ] ) / this.store.districtArea ).toFixed( 3 ) * 100;
		const dirtroad = ( this.districtService.getTotalAreaByNameAndIdAndPropertyKeys( majordistrict, [  'dirtroad_m2' ] ) / this.store.districtArea ).toFixed( 3 ) * 100;
		const pavedroad = ( this.districtService.getTotalAreaByNameAndIdAndPropertyKeys( majordistrict, [  'pavedroad_m2' ] ) / this.store.districtArea ).toFixed( 3 ) * 100;

		return [ trees20, trees15, trees10, trees2, vegetation, water, fields, rock, other, bareland, building, dirtroad, pavedroad ];

	} 

	/**
 * Get landcover data array for a city
 * 
 * @returns { Array } Data array for the specified district
 */
	getLandDataForCity( ) {

		const helsinkiTotalLandArea = this.districtService.getCityTotalByNameAndProperty( 'pa_m2' );
		const trees20 = ( this.districtService.getTotalAreaByNameAndPropertyKeys( [ 'tree20_m2' ] ) / helsinkiTotalLandArea ).toFixed( 3 ) * 100;
		const trees15 = ( this.districtService.getTotalAreaByNameAndPropertyKeys( [ 'tree15_m2' ] ) / helsinkiTotalLandArea ).toFixed( 3 ) * 100;
		const trees10 = ( this.districtService.getTotalAreaByNameAndPropertyKeys( [ 'tree10_m2' ] ) / helsinkiTotalLandArea ).toFixed( 3 ) * 100;
		const trees2 = ( this.districtService.getTotalAreaByNameAndPropertyKeys( [ 'tree2_m2' ] ) / helsinkiTotalLandArea ).toFixed( 3 ) * 100;
		const vegetation = ( this.districtService.getTotalAreaByNameAndPropertyKeys( [ 'vegetation_m2' ] ) / helsinkiTotalLandArea ).toFixed( 3 ) * 100;
		const water = ( this.districtService.getTotalAreaByNameAndPropertyKeys( [ 'water_m2' ] ) / helsinkiTotalLandArea ).toFixed( 3 ) * 100;
		const fields = ( this.districtService.getTotalAreaByNameAndPropertyKeys( [ 'field_m2' ] ) / helsinkiTotalLandArea ).toFixed( 3 ) * 100;
		const rock = ( this.districtService.getTotalAreaByNameAndPropertyKeys( [ 'rocks_m2' ] ) / helsinkiTotalLandArea ).toFixed( 3 ) * 100;
		const other = ( this.districtService.getTotalAreaByNameAndPropertyKeys( [ 'other_m2' ] ) / helsinkiTotalLandArea ).toFixed( 3 ) * 100;
		const bareland = ( this.districtService.getTotalAreaByNameAndPropertyKeys( [ 'bareland_m2' ] ) / helsinkiTotalLandArea ).toFixed( 3 ) * 100;
		const building = ( this.districtService.getTotalAreaByNameAndPropertyKeys( [ 'building_m2' ] ) / helsinkiTotalLandArea ).toFixed( 3 ) * 100;
		const dirtroad = ( this.districtService.getTotalAreaByNameAndPropertyKeys( [ 'dirtroad_m2' ] ) / helsinkiTotalLandArea ).toFixed( 3 ) * 100;
		const pavedroad = ( this.districtService.getTotalAreaByNameAndPropertyKeys( [ 'pavedroad_m2' ] ) / helsinkiTotalLandArea ).toFixed( 3 ) * 100;

		return [ trees20, trees15, trees10, trees2, vegetation, water, fields, rock, other, bareland, building, dirtroad, pavedroad ];

	}


	/**
 * Creates vegetation bar for a major district area area
 *
 * @param { object } ndviData data of a distrct 
 * @param { String } date date of NDVI data 
 */
	createNDVIBarPlot( ndviData, date ) {

		const mil = 10000;

		let x = [ '-0.0', '0.0-0.1','0.1-0.2','0.2-0.3','0.3-0.4','0.4-0.5','0.5-0.6','0.6-' ];
		let y = [ ndviData[ 0 ] / mil, ndviData[ 1 ] / mil, ndviData[ 2 ] / mil, ndviData[ 3 ] / mil, ndviData[ 4 ] / mil, ndviData[ 5 ] / mil, ndviData[ 6 ] / mil, ndviData[ 7 ] / mil ];

		// Define an array of colors, one for each bar
		let colors = [ '#eaeaea', '#ccc682', '#91bf51', '#70a33f', '#4f892d', '#306d1c', '#0f540a', '#004400' ];

		let data = [ {
			x: x,
			y: y,
			type: 'bar',        
			marker: {
				color: colors, 
			}
		} ];

		let layout = {
			title: { text: 'NDVI in ' + this.store.districtName + ' at ' + date },
			barmode: 'group',
			yaxis: {
				title: 'Area in hectares'
			}
		};

		Plotly.newPlot( 'plotContainer', data, layout );

	}

	/**
 * Get ndvi value for a specific major district
 * 
 * @param { string } majordistrict - Major district code
 * @returns { Number } ndvi value for major district
 */
	getNDVIForDistrict( majordistrict ) {

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
	createGreenAreaChart( ) {

		const greenAreaDataSource = this.datasourceService.getDataSourceByName( 'GreenAreas' );

		let puiston_nimi = [];
		let mean_ndvi = [];

		greenAreaDataSource.entities.values.forEach( entity => {

			if ( entity.show && entity._properties._mean_ndvi._value > 0.3 && !puiston_nimi.includes( entity._properties._puiston_nimi._value ) ) {
				puiston_nimi.push( entity._properties._puiston_nimi._value );
				mean_ndvi.push( entity._properties._mean_ndvi._value );
			} 

		} ); 


		let trace1 = {
			x: puiston_nimi,
			y: mean_ndvi,
			type: 'bar'
		};
      
		let data = [ trace1 ];
      
		let layout = { title: { text: 'Green areas in ' + this.store.majorDistrictName + ' with over 0.3 ndvi' }, barmode: 'group' };

		//Test plotting
		if ( this.store.showPlot ) {

			document.getElementById( 'greenAreaContainer' ).style.visibility = 'visible';
		}

		Plotly.newPlot( 'greenAreaContainer', data, layout );

	}

	/**
 * Create current district green area scatterplot
 *
 */
	createGreenAreaScatterPlot( ) {

		const greenAreaDataSource = this.datasourceService.getDataSourceByName( 'GreenAreas' );

		let puiston_nimi = [];
		let data = [ ];

		greenAreaDataSource.entities.values.forEach( entity => {

			if ( entity.show && entity._properties._population_0km && entity._properties._mean_ndvi._value > 0.3 && !puiston_nimi.includes( entity._properties._puiston_nimi._value ) ) {
				puiston_nimi.push( entity._properties._puiston_nimi._value );

				const plotData = {
					x: [ this.addNearbyPopulation( entity ) ],
					y: [ entity._properties._mean_ndvi._value ],
					name: entity._properties._puiston_nimi._value,
					type: 'scatter',
					mode: 'markers'
				};
	
				data.push( plotData );
			} 

		} ); 
			  
		const layout = {
			scattermode: 'group',
			xaxis: {title: 'population' },
			yaxis: {title: 'ndvi'},
			showlegend: false,
			title: 'YLRE green areas population pressure ',
		};


		document.getElementById( 'plotPieContainer' ).style.visibility = 'visible';
		document.getElementById( 'sliderContainer' ).style.visibility = 'visible';
		document.getElementById( 'selectContainer' ).style.visibility = 'hidden';
    

		Plotly.newPlot( 'plotPieContainer', data, layout );


		document.getElementById( 'plotPieContainer' ).on( 'plotly_click', function( data ){
			let clickedParkName = data.points[0].data.name; // Retrieve the park name
			highlightEntityInCesium( clickedParkName, greenAreaDataSource.entities, '_puiston_nimi' );
		} );
	}


	addNearbyPopulation( entity ) {
		// Retrieve the slider value from the document
		const sliderValue = parseInt( document.getElementById( 'blueSlider' ).value );

		// Start with the base population value
		let value = entity._properties._population_0km._value;

		// Add to the value based on slider value
		if ( sliderValue >= 1 ) {
			value = value + entity._properties._population_1km._value;
		}
		if ( sliderValue >= 2 ) {
			value = value + entity._properties._population_2km._value;
		}
		if ( sliderValue >= 3 ) {
			value = value + entity._properties._population_3km._value;
		}
		if ( sliderValue >= 4 ) {
			value = value + entity._properties._population_4km._value;
		}
		if ( sliderValue >= 5 ) {
			value = value + entity._properties._population_5km._value;
		}

		return value;

	}

	addNearbyPopulationWithWeights( entity ) {
		const sliderValue = parseInt( document.getElementById( 'blueSlider' ).value );
		let value = 0; // Start with a base value of 0

		// Define maximum population values for each distance
		const maxPopulations = [ 11626, 44913, 83572, 96108, 87885, 90733 ];

		// Define a scaling function
		function scalePopulation( population, maxPopulation ) {
			return ( population / maxPopulation );
		}

		// Define weights for each distance band
		const weights = [ 1, 0.9, 0.7, 0.5, 0.3, 0.1 ];

		// Apply the scaling function to each population value, considering the slider value
		for ( let i = 0; i <= sliderValue; i++ ) {
			let populationAttribute = `_population_${i}km`;
			if ( entity._properties[populationAttribute] ) {
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
	createNDVIHistogram( ndviData, date ) {

		let markerColor = 'green';

		if ( this.store.ndviAreaDataSourceName.includes( 'Heat' ) ) {

			markerColor =  'orange';

		}

		let data = {
			x: ndviData,
			type: 'histogram',
			marker: {
				color: markerColor,
			},
			xbins: {
				start: -0.1,
				end: 1,
				size: 0.1
			}
		};
	

		let title = { text: 'NDVI in ' + this.store.districtName + ' at ' + date };

		if ( this.store.ndviAreaDataSourceName ) {

			if ( !date ) {

				date = '07-2023';
			}
        
			title = { text: 'NDVI for ' + this.store.ndviAreaDataSourceName + ' at ' + date };

		}
	
		let layout = { 
			title: title,
			bargap: 0.1, 
		};
	

		document.getElementById( 'plotContainer' ).style.visibility = 'visible';
		this.elementsDisplayService.toggleLabels( 'visible' );
    

		Plotly.newPlot( 'plotContainer', [ data ], layout );


	}

	/**
 * Creates HSY line chart for a picked district
 *
 * @param { object } properties data of a distrct 
 */
	createNDVILineChart( data ) {

		let years = [ 2018, 2020, 2022 ];
		let traces = [ ];
		let labels = [ '- 0.0' , '0.0 - 0.1', '0.1 - 0.2', '0.2 - 0.3', '0.3 - 0.4', '0.4 - 0.5', , '0.6 - ' ];

		for ( let i = 0; i < labels.length; i++ ) {

			let trace = generateTraceForDataAndYear( data, labels[ i ], years, i  );

			if ( trace ) {
            
				traces.push( trace );
        
			}
		}
		const layout = {
			xaxis: {title: 'year' },
			yaxis: {title: 'NDVI area in hectares'},
			showlegend: false,
			title: 'NDVI changes in ' + this.store.districtName,
		};

		Plotly.newPlot( 'ndviChartContainer', traces, layout );

	}	

	/**
 * Creates HSY line chart for a picked district
 *
 * @param { object } properties data of a distrct 
 */
	createHSYLineChart( properties ) {

		let years = [ 2018, 2020, 2022 ];
		let data = [ generateTraceForTrees( properties, years ) ];
		let labels = [ '_bareland_m2_' , '_building_m2_', '_dirtroad_m2_', '_field_m2_', '_other_m2_', '_pavedroad_m2_', '_rocks_m2_', '_vegetation_m2_', '_water_m2_' ];

		for ( let i = 0; i < labels.length; i++ ) {

			let trace = generateTraceForLabelAndYear( properties, labels[ i ], years  );

			if ( trace ) {
            
				data.push( trace );
        
			}
		}

		const layout = {
			xaxis: {title: 'year' },
			yaxis: {title: 'landcover in hectares'},
			showlegend: false,
			title: 'HSY Landcover changes in ' + this.store.districtName,
		};

		document.getElementById( 'chartContainer' ).style.visibility = 'visible';   
		Plotly.newPlot( 'chartContainer', data, layout );

	}

	/**
 * Create current district green area scatterplot
 *
 */
	createVulnerablePopulationScatterPlot( entities, postfix ) {

		let data = [ ];
		let areaNames = [];
		const id = this.populationPressureStore.uniqueId;
		const name = this.populationPressureStore.name;
		const ndviAttribute = this.populationPressureStore.ndviAttribute;
		const areaAttribute = this.populationPressureStore.areaAttribute;

		entities.forEach( entity => {

			const areaName = entity._properties[ id ]._value;

			if ( entity.show && entity._properties[ ndviAttribute ]._value >= 0.5 && entity._properties[ areaAttribute ]._value >= 100  && !areaNames.includes( areaName ) ) {

				areaNames.push( areaName ); // to avoid duplicates
				addEntityForVulnerablePopulationPlot( data, entity, name, areaName, postfix );

			}

		} ); 

		const layout = createLayoutForVulnerablePopulationScatterPlot( name );

		document.getElementById( 'plotInhabitantContainer' ).style.visibility = 'visible';
		Plotly.newPlot( 'plotInhabitantContainer', data, layout );

		document.getElementById( 'plotInhabitantContainer' ).on( 'plotly_click', function( data ){
			let clickedParkName = data.points[0].data.name; // Retrieve the park name
			highlightEntityInCesium( clickedParkName, entities, id );
		} );
	}

	/**
 * Create current district green area scatterplot
 *
 */
	createPopulationScatterPlot( entities, postfix ) {

		let data = [ ];
		let areaNames = [];
		const id = this.populationPressureStore.uniqueId;
		const name = this.populationPressureStore.name;
		const ndviAttribute = this.populationPressureStore.ndviAttribute;
		const areaAttribute = this.populationPressureStore.areaAttribute;

		entities.forEach( entity => {

			const areaName = entity._properties[ id ]._value;

			if ( entity.show && entity._properties[ ndviAttribute ]._value >= 0.5 && entity._properties[ areaAttribute ]._value >= 100 && !areaNames.includes( areaName ) ) {
				
				areaNames.push( entity._properties[ id ]._value ); // to avoid duplicates
				addEntityForPopulationPlot( data, entity, name, ndviAttribute, areaName, postfix );

			} 

		} ); 
			  
		const layout = {
			scattermode: 'group',
			xaxis: {title: 'weighted population' },
			yaxis: {title: 'ndvi july 2023 max'},
			showlegend: false,
			title: name + ', all population',
		};

		if ( name == 'Planned Development' ) {

			layout.xaxis.title = 'population';

		}
		  
		document.getElementById( 'plotPieContainer' ).style.visibility = 'visible';
		Plotly.newPlot( 'plotPieContainer', data, layout );

		document.getElementById( 'plotPieContainer' ).on( 'plotly_click', function( data ){
			let clickedParkName = data.points[0].data.name; // Retrieve the park name
			highlightEntityInCesium( clickedParkName, entities, id );
		} );
	}

	createPopulationPressureScatterPlot( entities, populationAttributeName ) {

		let areaNames = [];
		let data = [ ];
		const id = this.populationPressureStore.uniqueId;
		const name = this.populationPressureStore.name;
		const ndviAttribute = this.populationPressureStore.ndviAttribute;
		const areaAttribute = this.populationPressureStore.areaAttribute;

		entities.forEach( entity => {

			const areaName = entity._properties[ id ]._value;

			if ( entity.show && entity._properties[ populationAttributeName ] && entity._properties[ ndviAttribute ]._value >= 0.5 && entity._properties[ areaAttribute ]._value >= 100 && !areaNames.includes( areaName ) ) {
				areaNames.push( areaName );

				const plotData = {
					x: [ ( entity._properties[ populationAttributeName ]._value / entity._properties[ areaAttribute ]._value ).toFixed( 3 ) ],
					y: [ entity._properties[ ndviAttribute ]._value.toFixed( 3 ) ],
					name: areaName,
					type: 'scatter',
					mode: 'markers',
					hovertemplate: areaName,
					hoverlabel: { namelength: -1 } // Show full name in hover label
				};
	
				data.push( plotData );
			} 

		} ); 
			  
		const layout = {
			scattermode: 'group',
			xaxis: {title: 'weighted population / sqm2' },
			yaxis: {title: 'ndvi july 2023 max'},
			showlegend: false,
			title: name + ', usage pressure (map visulation per area) ',
		};

		if ( name == 'Planned Development' ) {

			layout.xaxis.title = 'population';

		}
		  
		document.getElementById( 'sliderContainer' ).style.visibility = 'visible';
		document.getElementById( 'plotContainer' ).style.visibility = 'visible';

		Plotly.newPlot( 'plotContainer', data, layout );

		document.getElementById( 'plotContainer' ).on( 'plotly_click', function( data ){
			let clickedParkName = data.points[0].data.name; // Retrieve the park name
			highlightEntityInCesium( clickedParkName, entities, id );
		} );
	}	

}

const generateTraceForLabelAndYear = ( properties, label, years ) => {

	if ( properties[ label + years[ 0 ] ] != 0 && properties[ label + years[ 1 ] ] != 0  && properties[ label + years[ 2 ] ] != 0 ) {

		let trace = {
			x: years,
			y: [ properties[ label + years[ 0 ] ]._value / 10000, properties[ label + years[ 1 ] ]._value / 10000, properties[ label + years[ 2 ] ]._value / 10000 ],
			type: 'scatter',
			name: label.replace( /^_(.*)_m2_$/, '$1' ),
			line: {
				color: getColorForHSYLabel( label )
			}

		};  

		return trace;      
	}

};

const highlightEntityInCesium = ( parkName, entities, attribute ) => {
	for ( let i = 0; i < entities.length; i++ ) {
		let entity = entities[ i ];
		if ( entity._properties[ attribute ]._value === parkName ) {
			// Apply highlighting, e.g., change color
			entity.polygon.outlineColor = Cesium.Color.RED;

			const center = Cesium.BoundingSphere.fromPoints(
				entity.polygon.hierarchy.getValue().positions
			).center;
    
			const distanceFromEntity = 5000;  // Desired distance from the center (in meters)

			// Convert Cartesian3 center to Cartographic (longitude, latitude, height)
			const cartographic = Cesium.Cartographic.fromCartesian( center );

			// Use Cartographic coordinates in fromRadians
			const destination = Cesium.Cartesian3.fromRadians(
				cartographic.longitude,
				cartographic.latitude - 0.001,
				distanceFromEntity,  
				Cesium.Ellipsoid.WGS84
			);

			const store = useGlobalStore();
    
			store.cesiumViewer.camera.flyTo( {
				destination: destination,
				orientation: {
					heading: 0.0,
					pitch: Cesium.Math.toRadians( -35.0 ),
					roll: 0.0
				},
			} );
		} else {

			entity.polygon.outlineColor = Cesium.Color.BLACK; 
		}
	}
};

const generateTraceForTrees = ( properties, years ) => {

	let trees2022 = properties[ '_tree2_m2_2022' ] + properties[ '_tree10_m2_2022' ] + properties[ '_tree15_m2_2022' ] + properties[ '_tree20_m2_2022' ];
	let trees2020 = properties[ '_tree2_m2_2020' ] + properties[ '_tree10_m2_2020' ] + properties[ '_tree15_m2_2020' ] + properties[ '_tree20_m2_2020' ];
	let trees2018 = properties[ '_tree2_m2_2018' ] + properties[ '_tree10_m2_2018' ] + properties[ '_tree15_m2_2018' ] + properties[ '_tree20_m2_2018' ];

	let trace = {
		x: years,
		y: [ trees2018 / 10000, trees2020 / 10000, trees2022 / 10000 ],
		type: 'scatter',
		name: 'trees',
		line: {
			color: '#326428'
		}
	};  

	return trace;      

};

const getColorForHSYLabel = ( label ) =>  {

	switch ( label ){
	case '_bareland_m2_':
		return '#cd853f';           
	case '_building_m2_':
		return '#d80000';           
	case '_dirtroad_m2_':
		return '#824513';           
	case '_field_m2_':
		return '#ffd980';           
	case '_other_m2_':
		return '#857976';           
	case '_pavedroad_m2_':
		return '#000000';           
	case '_rocks_m2_':
		return '#bfbdc2';    
	case '_vegetation_m2_':
		return '#b2df43';           
	case '_water_m2_':
		return  '#6495ed';          
	}        

};

const getColorForNDVILabel = ( label ) =>  {

	switch ( label ){
	case '- 0.0':
		return '#eaeaea';           
	case '0.0 - 0.1':
		return '#ccc682';           
	case '0.1 - 0.2':
		return '#91bf51';           
	case '_field_m2_':
		return '#70a33f';           
	case '0.2 - 0.3':
		return '#4f892d';           
	case '0.3 - 0.4':
		return '#306d1c';           
	case '0.4 - 0.5':
		return '#0f540a';    
	case '0.6 - ':
		return '#004400';           
	}
};

const generateTraceForDataAndYear = ( data, label, years, i )  => {


	let trace = {
		x: years,
		y: [ data[ 0 ][ i ] / 10000, data[ 1 ][ i ] / 10000, data[ 2 ][ i ] / 10000 ],
		type: 'scatter',
		name: label,
		line: {
			color: getColorForNDVILabel( label )
		}

	};  

	return trace;      
		

};

const addEntityForVulnerablePopulationPlot = ( data, entity, name, areaName, postfix ) => {

	let x = entity._properties[ '_weighted_over69_population' + postfix ]._value;
	let y = entity._properties[ '_weighted_under10_population' + postfix ]._value;

	if ( name == 'Planned Development' ) {
		x = entity._properties[ '_over69_population' + postfix ]._value;
		y = entity._properties[ '_under10_population' + postfix ]._value;
	}

	const plotData = {
		x: [ x.toFixed( 3 ) ],
		y: [ y.toFixed( 3 ) ],
		name: areaName,
		type: 'scatter',
		mode: 'markers',
		hovertemplate: areaName,
		hoverlabel: { namelength: -1 } // Show full name in hover label
	};

	data.push( plotData );

};

const createLayoutForVulnerablePopulationScatterPlot = ( name ) => {
	const layout = {
		scattermode: 'group',
		xaxis: {title: 'weighted population under 10' },
		yaxis: {title: 'weighted population over 69'},
		showlegend: false,
		title: name + ', vulnerable population',
	};


	if ( name == 'Planned Development' ) {
		layout.xaxis.title = 'population under 10';
		layout.yaxis.title = 'population over 69';

	}

	return layout;
};

const addEntityForPopulationPlot = ( data, entity, name, ndviAttribute, areaName, postfix ) => {

	let x = entity._properties[ '_weighted_population' + postfix ]._value;
	let y = entity._properties[ ndviAttribute ]._value;

	if ( name == 'Planned Development' ) {
		x = entity._properties[ '_total_population' + postfix ]._value;
	}

	const plotData = {
		x: [ x.toFixed( 3 ) ],
		y: [ y.toFixed( 3 ) ],
		name: areaName,
		type: 'scatter',
		mode: 'markers',
		hovertemplate: areaName,
		hoverlabel: { namelength: -1 } // Show full name in hover label
	};

	data.push( plotData );

};

const createLayoutForPopulationScatterPlot = ( name ) => {
	const layout = {
		scattermode: 'group',
		xaxis: {title: 'weighted population under 10' },
		yaxis: {title: 'weighted population over 69'},
		showlegend: false,
		title: 'Planned development, distance of population 800m',
	};


	if ( name == 'plans' ) {
		layout.xaxis.title = 'population under 10';
		layout.yaxis.title = 'population over 69';

	}

	return layout;
};