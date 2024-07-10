import * as Cesium from 'cesium';
import Datasource from './datasource.js';
import { useGlobalStore } from '../stores/global-store.js';
import { useLandCoverStore } from '../stores/land-cover-store.js';

export default class Distrct {
	constructor() {
		this.store = useGlobalStore();
		this.landCoverStore = useLandCoverStore();
		this.datasourceService = new Datasource();
		this.viewer = this.store.cesiumViewer;
	}

	/**
 * Get total of property by district data source name
 * 
 * @param { String } property name of the property
 * 
 * @returns { Number } The population 
*/
	getCityTotalByNameAndProperty( property ) {
    
		// Find the data source for name
		const districtDataSource = this.datasourceService.getDataSourceByName( this.store.levelsVisited[ this.store.levelsVisited.length - 1 ] );
		let total = 0;

		// If the data source isn't found, exit the function
		if ( !districtDataSource ) {

			return total;

		}

		let idsDone = [];

		for ( let i = 0; i < districtDataSource._entityCollection._entities._array.length; i++ ) {

			const entity = districtDataSource._entityCollection._entities._array[ i ];
			const tunnusValue = entity._properties._tunnus._value;

			if ( !idsDone.includes( tunnusValue ) ) {

				total += entity._properties[ property ]._value;
				idsDone.push( tunnusValue );

			}
		}

		return total;

	}

	getYearFromSlider( ) {

		let sliderValue = 0;

		if ( document.getElementById( 'ndviSlider' ) ) {
			
			sliderValue = parseInt( document.getElementById( 'ndviSlider' ).value );	

		} 

		switch ( sliderValue ) {
		case 0: 
			return '2022';
		case 1: 
			return '2020';
		case 2: 
			return '2018';          
		default:
			return '2022';  				
		}

	}

	findLandCoverData() {

		const level = this.store.levelsVisited[ this.store.levelsVisited.length -1 ];

		switch ( level ) {
		case 'MajorDistricts': 
			return this.landCoverStore.majorDistrictData;
		case 'Districts': 
			return this.landCoverStore.districtData;
		case 'SubDistricts': 
			return this.landCoverStore.subDistrictData;
		}
	
	}

	/**
 * Get total area of district properties by district data source name and district id and list of property keys
 * 
 * @param { Number } id Id of the district
 * @param { Array } propertyKeys - List of property keys to calculate the total area
 * 
 * @returns { Number } The total area 
*/
	getTotalAreaByNameAndIdAndPropertyKeys( id, propertyKeys ) {
    
		// Find the data source for name
		const districtDataSource = this.findLandCoverData();

		let totalArea = 0;

		// If the data source isn't found, exit the function
		if ( !districtDataSource ) {

			return totalArea;

		}

		const year = this.getYearFromSlider( );

		for ( let i = 0; i < districtDataSource.length; i++ ) {

			if ( Number( districtDataSource[ i ]._properties._tunnus._value ) === Number( id ) ) {

				const entity = districtDataSource[ i ];
	
				propertyKeys.forEach( propertyKey => {

					if ( entity._properties.hasOwnProperty( propertyKey + '_' + year ) ) {

						totalArea += entity._properties[ propertyKey + '_' + year ]._value;

					}

				} );

				return totalArea;

			}

		}

		return totalArea;

	}

	/**
 * Get total area of district properties by district data source name and list of property keys
 * 
 * @param { Array } propertyKeys - List of property keys to calculate the total area
 * 
 * @returns { Number } The total area
 */
	getTotalAreaByNameAndPropertyKeys( propertyKeys ) {
		// Find the data source for name
		const districtDataSource = this.findLandCoverData();
		let totalArea = 0;

		// If the data source isn't found, exit the function
		if ( !districtDataSource ) {

			return totalArea;

		}

		let idsDone = [];
		const year = this.getYearFromSlider( );

		for ( let i = 0; i < districtDataSource.length; i++ ) {

			const entity = districtDataSource[ i ];
			const tunnusValue = entity._properties._tunnus._value;

			if ( !idsDone.includes( tunnusValue ) ) {

				propertyKeys.forEach( propertyKey => {

					if ( entity._properties.hasOwnProperty( propertyKey + '_' + year ) ) {

						totalArea += entity._properties[ propertyKey + '_' + year ]._value;

					}
				} );

				idsDone.push( tunnusValue );
			}
		}

		return totalArea;
	}

	/**
 * Finds properties of district based on district tunnus and level
 * 
 * @param { Number } id Id of the district
 * 
 * @returns { Object } properties of a district
*/
	getDistrictPropsByNameAndId( id ) {

		for ( let i = 0; i < this.viewer.dataSources._dataSources.length; i++ ) {

			if ( this.viewer.dataSources._dataSources[ i ]._name === levelsVisited[ levelsVisited.length - 1 ] ) {

				const datasource = this.viewer.dataSources._dataSources[ i ];
    
				for ( let j = 0; j < datasource._entityCollection._entities._array.length; j++ ) {
    
					if ( Number( datasource._entityCollection._entities._array[ j ]._properties._tunnus._value ) === Number( id ) ) {
  
						return datasource._entityCollection._entities._array[ j ]._properties;

					}
				}
			}
		}
	}

	/**
 * Calls functions needed for district level
 */
	async newDistrict( url, load ) {

		return new Promise( ( resolve, reject ) => {

			this.loadDistrictZones( 0.01, url, load );
			setTimeout( () => {
				resolve(); // Resolve the promise when done
			}, 1000 );
		} );
    

	}


	/**
 * Sets static district specific variables for plotting
 * 
 * @param { Object} properties - The properties of the picked entity
 * 
 */
	setDistrictVariables( properties ) {

		this.store.districtName = String( properties.nimi_fi );
		this.store.districtPopulation = properties.asukasluku;
		this.store.districtArea = properties.pa_m2;

		if ( this.store.districtsVisited.length > 1 && properties.tunnus._value ) {

			if ( properties.tunnus._value != this.store.districtsVisited[ this.store.districtsVisited.length - 1 ]._value ) {

				this.store.districtsVisited.push( properties.tunnus );

			}
    

		} else {

			this.store.districtsVisited.push( properties.tunnus );

		}

		this.setDistrictOutlineColor( );

	}


	/**
 * Loads district zone polygons with the given opacity
 * 
 * @param {number} opacity - The opacity of the polygons (range from 0 to 1)
 */
	async loadDistrictZones( opacity, url, name ) {
		return new Promise( ( resolve, reject ) => {
			Cesium.GeoJsonDataSource.load( url, {
				stroke: Cesium.Color.BLACK,
				fill: new Cesium.Color( 0.3, 0.3, 0.3, opacity ),
				strokeWidth: 8,
				clampToGround: false,
			} )
				.then( ( dataSource ) => {
					dataSource.name = name;
					this.viewer.dataSources.add( dataSource );

					const entities = dataSource.entities.values;
					this.setLandCoverData( entities, name );
					resolve( entities );
				} )
				.catch( ( error ) => {
					console.log( error );
					reject( error );
				} );
		} );
	}

	setLandCoverData( entities, name ) {

		switch ( name ){
		case 'MajorDistricts':
			this.landCoverStore.setMajorDistrictData( entities ) ;    
		case 'Districts':
			this.landCoverStore.setDistrictData( entities ) ;         
		case 'SubDistricts':
			this.landCoverStore.setSubDistrictData( entities ) ;         
		}	}

	/**
 * Finds  if of district based on district name and level
 * 
 * @param { String } name Name of the district
 * 
 * @returns { Number } id of a district
*/
	findDistrictIdByName( name ) {

		for ( let i = 0; i < this.viewer.dataSources._dataSources.length; i++ ) {

			if ( this.viewer.dataSources._dataSources[ i ]._name === this.store.levelsVisited[ this.store.levelsVisited.length - 1 ] ) {

				const datasource = this.viewer.dataSources._dataSources[ i ];
    
				for ( let j = 0; j < datasource._entityCollection._entities._array.length; j++ ) {
    
					if ( datasource._entityCollection._entities._array[ j ]._properties._nimi_fi._value  === name ) {
  
						return datasource._entityCollection._entities._array[ j ]._properties._tunnus._value;

					}
				}
			}
		}
	}

	/**
 * Set up entity outline
 * 
 */
	setDistrictOutlineColor( otherDistrict ) {
	
		for ( let i = 0; i < this.viewer.dataSources._dataSources.length; i++ ) {

			if ( this.viewer.dataSources._dataSources[ i ]._name === this.store.levelsVisited[ this.store.levelsVisited.length - 1 ] ) {

				const datasource = this.viewer.dataSources._dataSources[ i ];
    
				for ( let j = 0; j < datasource._entityCollection._entities._array.length; j++ ) {
    
					const entity = datasource._entityCollection._entities._array[ j ];

					if ( Number( entity._properties._tunnus && entity._properties._tunnus._value ) === Number( this.store.districtsVisited[ this.store.districtsVisited.length - 1 ]._value ) ) {

						entity.polygon.outlineColor = Cesium.Color.RED; // Set outline color to red
                    
					} 

					else if ( otherDistrict && Number( entity._properties._tunnus && entity._properties._tunnus._value ) === Number( otherDistrict ) ) {
                    
						entity.polygon.outlineColor = Cesium.Color.YELLOW; // Set outline color of district being compared to yellow

					} else {

						entity.polygon.outlineColor = Cesium.Color.BLACK; 

					}
				}
			}
		}
	}

	flyCameraToDistrict( picked, distance ) {
		this.viewer.camera.flyTo( {
			destination: Cesium.Cartesian3.fromDegrees( picked.id.properties.center_x._value, picked.id.properties.center_y._value, distance ),
			orientation: {
				heading : Cesium.Math.toRadians( 0.0 ),
				pitch : Cesium.Math.toRadians( -85.0 ),
			},
			duration: 1
		} );

	}
}
