import * as Cesium from 'cesium';
import Datasource from './datasource.js'; 
import Plot from './plot.js';
import Ndvi from './ndvi.js';
import Cache from './cache.js'; 
import { useGlobalStore } from '../stores/global-store.js';

export default class Ndviarea {
	constructor() {
		this.store = useGlobalStore();
		this.datasourceService = new Datasource();
		this.plotService = new Plot();
		this.cacheService = new Cache();
		this.ndviService = new Ndvi();
	}

	dataForHistogram( entities, property ) {
		let propertyValuesList = [];

		entities.forEach( function( entity ) {

			// Replace 'attributeName' with the name of the property you're interested in
			let value = entity.properties[property].getValue();
			if ( value ) {

				propertyValuesList.push( value );

			}
		

		} );


		const plotService = new Plot();
		plotService.createNDVIHistogram( propertyValuesList, 'unknown' );
	}

	/**
   * Add the features with ndvi data as a new data source to the Cesium
   * 
   * @param { object } data features with ndvi
   * @param { Number } name name of the datasource
   */
	async addPlatformFeaturesWithNDVI( data, name ) {

    	let entities = await this.datasourceService.addDataSourceWithPolygonFix( data, name );
		this.store.ndviAreaDataSourceName = name;
		this.setColorAndLabelForPlatformGreenEntities( entities );
		this.dataForHistogram( entities, 'value' );
	}

	async addPlatformFeaturesWithHeat( data, name ) {

    	let entities = await this.datasourceService.addDataSourceWithPolygonFix( data, name );
		this.store.ndviAreaDataSourceName = name;
		this.setColorAndLabelForPlatformHeatEntities( entities );
		this.dataForHistogram( entities, 'value' );
	}



	setColorAndLabelForPlatformGreenEntities( entities ) {
		for ( let i = 0; i < entities.length; i++ ) {
			let entity = entities[i];

			if ( entity._properties[ 'value' ] ) {

			    const color = this.ndviService.setNDVIPolygonMaterialColor( entity, 'value' );
			    // Set polygon color
			    entity.polygon.material = color;
			    entity.polygon.outline = true; // Optional: Set to false if no outline is desired
			    entity.polygon.outlineColor = Cesium.Color.BLACK;

			}

		}
	}

	setColorAndLabelForPlatformHeatEntities( entities ) {
		for ( let i = 0; i < entities.length; i++ ) {
			let entity = entities[i];

			if ( entity._properties[ 'value' ] ) {

			    const color = new Cesium.Color( 1, 1 - entity._properties._value._value, 0, entity._properties._value._value );
			    // Set polygon color
			    entity.polygon.material = color;
			    entity.polygon.outline = true; // Optional: Set to false if no outline is desired
			    entity.polygon.outlineColor = Cesium.Color.BLACK;

			}

		}
	}	

	/**
   * Add the features with ndvi data as a new data source to the Cesium
   * 
   * @param { object } data features with ndvi
   * @param { Number } name name of the datasource
   */
	async addPlatformFeaturesWithHeat( data, name ) {

    	let entities = await this.datasourceService.addDataSourceWithPolygonFix( data, name );
		this.store.ndviAreaDataSourceName = name;
		this.setColorAndLabelForPlatformHeatEntities( entities );
		this.dataForHistogram( entities, 'value' );
	}	
}
