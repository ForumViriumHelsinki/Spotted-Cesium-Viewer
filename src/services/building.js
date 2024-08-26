import Datasource from './datasource.js'; 
import * as Cesium from 'cesium';
import Plot from './plot.js';
import Cache from './cache.js'; 
import { useGlobalStore } from '../stores/global-store.js';

export default class Building {
	constructor() {
		this.store = useGlobalStore();
		this.datasourceService = new Datasource();
		this.plotService = new Plot();
		this.cacheService = new Cache();
	}

	/**
   * Asynchronously load Building data from an API endpoint based on major district id
   * 
   */
	async loadBuilding() {
  
		// Construct the API endpoint URL
		let url = 'https://geo.fvh.fi/spotted/collections/building/items?f=json&limit=100000&tunnus=' + this.store.majorDistrict;

		try {

			// Attempt to retrieve the Building data from the local storage using the API endpoint URL as the key
			const cachedValue = await this.cacheService.getCachedData( url );

			// If the Building data is already available in the local storage, add it to the Cesium map
			if ( cachedValue ) {

				console.log( 'found from cache' );
				this.addBuildingDataSource( cachedValue );

			} else {

				// Otherwise, fetch the Building data from the API endpoint and add it to the local storage
				this.loadBuildingWithoutCache( url );

			}
        
		} catch ( err ) {
			// This code runs if there were any errors.
			console.log( err );
		}
	}  

    	/**
* Fetch Building data from the API endpoint and add it to the local storage
* 
* @param { String } url API endpoint's url
*/
	async loadBuildingWithoutCache( url ) {
		console.log( 'Not in cache! Loading: ' + url );

		try {
			const response = await fetch( url );
			if ( !response.ok ) {
				throw new Error( 'Network response was not ok' );
			}
			const data = await response.json();
        
			// After successfully fetching, cache the data and add it as a data source
			await this.cacheService.setCachedData( url, data );
			this.addBuildingDataSource( data );
		} catch ( error ) {
			console.error( 'Error loading Building data:', error );
		}
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
		plotService.createBuildingHistogram( propertyValuesList, 'unknown' );
	}

	/**
   * Add the features with Building data as a new data source to the Cesium
   * 
   * @param { object } data features with Building
   */
	async addBuildingDataSource( data ) {

    	let entities = await this.datasourceService.addDataSourceWithPolygonFix( data, 'buildings' );
        let urbanHeatData = [ ];
setColorAndLabelForHeatEntities( entities, urbanHeatData );
this.plotService.createUrbanHeatHistogram( urbanHeatData );
	}

}

// Function to set color and label for heat entities
const setColorAndLabelForHeatEntities = (entities, urbanHeatData ) => {
    for (let i = 0; i < entities.length; i++) {
        let entity = entities[i];

        if (entity._properties['max'] && entity.polygon) {
            // Assuming your index is in the range [0, 1]
            const index = entity._properties._max._value;
            // Calculate the alpha based on absolute values
            const alpha = 2 * Math.abs(index - 0.5);

            // Color mapping
            let color;
            if (index <= 0.5) {
                color = new Cesium.Color(0, 1 - alpha, 1, alpha);
            } else {
                color = new Cesium.Color(1, 1 - alpha, 0, alpha);
            }

            urbanHeatData.push(index);

            // Set polygon color
            entity.polygon.material = color;
            entity.polygon.outline = true;
            entity.polygon.outlineColor = Cesium.Color.BLACK;
            entity.billboard = undefined; // Remove any billboard icon

            extrudedEntities(entity);
        } else {
            entity.show = false;
        }
    }

	    // Sort urbanHeatData in ascending order
    urbanHeatData.sort((a, b) => a - b);
};


const extrudedEntities = ( entity ) => {

		if ( entity._properties._i_kerrlkm ) {

			entity.polygon.extrudedHeight =  entity._properties._i_kerrlkm._value;

		} else {

			entity.polygon.extrudedHeight =  2.7;

		}
}