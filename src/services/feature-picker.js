import * as Cesium from 'cesium';
import Datasource from './datasource.js'; 
import Plot from './plot.js';
import ElementsDisplay from './elements-display.js';
import District from './district.js';
import { useGlobalStore } from '../stores/global-store.js';
import GreenAreas from './green-areas.js';

export default class FeaturePicker {
	constructor( ) {
		this.store = useGlobalStore();
		this.viewer = this.store.cesiumViewer;
		this.datasourceService = new Datasource();
		this.plotService = new Plot();
		this.elementsDisplayService = new ElementsDisplay();
		this.districtService = new District();
		this.greenAreasService = new GreenAreas();
	}
	/**
 * Processes the click event on the viewer
 * 
 * @param {MouseEvent} event - The click event
 */
	processClick( event ) {

		if ( !this.store.location != 'pop_pressure' ||  !this.store.location != 'ndvi_areas' ) {

    		document.getElementById( 'uploadButton' ).style.visibility = 'hidden';
			document.getElementById( 'plotSelect' ).value = 'Helsinki';
			this.elementsDisplayService.districtElementsDisplay( 'inline-block' );
			this.elementsDisplayService.setPopulationPressureElementsDisplay( 'none' );

			console.log( 'Clicked at ' + String( event.x ) + ', ' + String( event.y ) );
			this.pickEntity( new Cesium.Cartesian2( event.x, event.y ) );

		}

	}

	/**
 * Prints the properties of the picked Cesium entity
 * 
 * @param {Object} picked - The picked Cesium entity
 */
	printCesiumEntity( picked ) {

		document.getElementById( 'printContainer' ).scroll( {
			top: 0,
			behavior: 'instant'
		} );
    
		if ( picked.id.properties ) {
			var toPrint = '<u>Found following properties & values:</u><br/>';	

			let length = picked.id.properties.propertyNames.length;
			for ( let i = 0; i < length; ++i ) {

				if ( goodForPrint( picked.id.properties, i ) ) {
					if ( typeof picked.id.properties[ picked.id.properties.propertyNames[ i ] ]._value === 'number' ) {

						toPrint = toPrint + picked.id.properties.propertyNames[ i ] + ': ' + picked.id.properties[ picked.id.properties.propertyNames[ i ] ]._value.toFixed( 3 ) + '<br/>';

					} else {

						toPrint = toPrint + picked.id.properties.propertyNames[ i ] + ': ' + picked.id.properties[ picked.id.properties.propertyNames[ i ] ] + '<br/>';

					}
				}

            
			}
		}
    
		addToPrint( toPrint );
    
	}

	/**
 * Adds the provided content to the print container
 * 
 * @param {string} toPrint - The content to be added to the print container
 */
	addToPrint( toPrint ) {

		document.getElementById( 'printContainer' ).innerHTML = toPrint;
		document.getElementById( 'printContainer' ).scroll( {
			top: 1000,
			behavior: 'smooth'
		} );
	}    

	/**
 * Picks the entity at the given window position in the viewer
 * 
 * @param {Cesium.Viewer} viewer - The Cesium viewer object
 * @param {Cesium.Cartesian2} windowPosition - The window position to pick the entity
 */
	async pickEntity( windowPosition ) {
		let picked = this.viewer.scene.pick( windowPosition );

		document.getElementById( 'showNDVIToggle' ).disabled = false;
		document.getElementById( 'NDVI2023Toggle' ).disabled = false;

		this.elementsDisplayService.setAreasNDVIElementsDisplay( 'none' );
    
		if ( picked ) {

			if ( !document.getElementById( 'showNDVIToggle' ).checked || !document.getElementById( 'NDVI2023Toggle' ).checked ) {

				this.elementsDisplayService.setElementDisabledState( false );

			} else {

				this.elementsDisplayService.setElementDisabledState( true );

			}

			document.getElementById( 'showPlotToggle' ).checked = true;
			this.districtService.setDistrictVariables( picked.id.properties );

			if ( picked.id.entityCollection._entities._array[ 0 ]._properties._nimi_fi ) {

				if ( picked.id.entityCollection._entities._array[ 0 ]._properties._nimi_fi._value === 'Eteläinen' ) {

					this.districtService.flyCameraToDistrict( picked, 20000 );    
					this.store.majorDistrict = picked.id.properties.tunnus;
					this.store.majorDistrictName = picked.id.properties.nimi_fi._value;
					await this.districtService.newDistrict( 'assets/data/HelsinkiDistrict.json', 'Districts' );
					this.store.levelsVisited.push( 'MajorDistricts' );
					this.districtService.setDistrictOutlineColor( );
					this.elementsDisplayService.toggleReturnButtonVisibility( );
					this.plotService.createPieChartForMajorDistrict( );
					this.plotService.createHSYLineChart( picked.id.properties );
                 
				}
    
				if ( picked.id.entityCollection._entities._array[ 0 ]._properties._nimi_fi._value === 'Vironniemi' ) {
					this.elementsDisplayService.setNDVI2023ElementsDisplay( 'inline-block' );
					this.districtService.flyCameraToDistrict( picked, 10000 );  
					this.store.district = picked.id.properties.tunnus;
					await this.districtService.newDistrict( 'assets/data/HelsinkiSubDistrict.json', 'SubDistricts' );
					this.store.currentDistrictName = picked.id.properties.nimi_fi._value;
					this.store.levelsVisited.push( 'Districts' );
					this.districtService.setDistrictOutlineColor( );
					this.elementsDisplayService.toggleReturnButtonVisibility( );
					this.plotService.createPieChartForMajorDistrict( );
					this.plotService.createHSYLineChart( picked.id.properties );
					await  this.datasourceService.removeDataSourcesByNamePrefix( 'MajorDistricts' );
                    
				}
    
				if ( picked.id.entityCollection._entities._array[ 0 ]._properties._nimi_fi._value === 'Niemenmäki' &&  !document.getElementById( 'SubDistrictNDVIToggle' ).checked ) {

					this.districtService.flyCameraToDistrict( picked, 5000 );    
					this.store.levelsVisited.push( 'SubDistricts' );
					this.store.currentSubDistrictName = picked.id.properties.nimi_fi._value;
					this.districtService.setDistrictOutlineColor( );
					this.elementsDisplayService.toggleReturnButtonVisibility( );
					this.plotService.createPieChartForMajorDistrict( );
					this.plotService.createHSYLineChart( picked.id.properties );					
					await this.datasourceService.removeDataSourcesByNamePrefix( 'Districts' );
                    
				}  

				await this.datasourceService.removeDuplicateDataSources( );

			}
        
			if ( document.getElementById( 'areasNDVIToggle' ).checked || this.store.location == 'pop_pressure' ) {

				document.getElementById( 'printContainer' ).style.display = 'inline-block';
				printCesiumEntity( picked );
                
			}
   
		}

	}
}

const goodForPrint = ( properties, i ) => {

	return !properties.propertyNames[ i ].includes( '_population' ) && !properties.propertyNames[ i ].includes( 'fid' ) && !properties.propertyNames[ i ].includes( '_id' ) && !properties.propertyNames[ i ].includes( 'value' ) && properties.propertyNames[ i ] != 'id' && properties[ properties.propertyNames[ i ] ]._value;

};

const addToPrint = ( toPrint ) => {

	document.getElementById( 'printContainer' ).innerHTML = toPrint;
	document.getElementById( 'printContainer' ).scroll( {
		top: 1000,
		behavior: 'smooth'
	} );
};  

 	/**
 * Prints the properties of the picked Cesium entity
 * 
 * @param {Object} picked - The picked Cesium entity
 */

const printCesiumEntity = ( picked ) => {

	document.getElementById( 'printContainer' ).scroll( {
		top: 0,
		behavior: 'instant'
	} );
    
	let toPrint = '<u>Found following properties & values:</u><br/>';	

	if ( picked.id.properties ) {

		let length = picked.id.properties.propertyNames.length;
		for ( let i = 0; i < length; ++i ) {

			if ( goodForPrint( picked.id.properties, i ) ) {
				if ( typeof picked.id.properties[ picked.id.properties.propertyNames[ i ] ]._value === 'number' ) {

					toPrint = toPrint + picked.id.properties.propertyNames[ i ] + ': ' + picked.id.properties[ picked.id.properties.propertyNames[ i ] ]._value.toFixed( 3 ) + '<br/>';

				} else {

					toPrint = toPrint + picked.id.properties.propertyNames[ i ] + ': ' + picked.id.properties[ picked.id.properties.propertyNames[ i ] ] + '<br/>';

				}
			}

            
		}
	}
    
	addToPrint( toPrint );
    
};