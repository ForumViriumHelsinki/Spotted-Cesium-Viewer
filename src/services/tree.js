import * as Cesium from 'cesium';
import Cache from './cache.js'; 
import { useGlobalStore } from '../stores/global-store.js';
import Datasource from './datasource.js'; 

export default class Tree {
	constructor() {
		this.store = useGlobalStore();
        this.cacheService = new Cache();
		this.datasourceService = new Datasource();
		this.viewer = this.store.cesiumViewer;
	}

/**
 * Load trees sequentially with different parameters.
 * 
 * @param { String } majordistrict - The major district code.
 * @returns { Promise<void> } Promise that resolves when all function calls complete.
 */
async loadTreesSequentially( majordistrict ) {
	
	try {

		let i = 0;

		while ( true ) {

			if ( i > 10000 ) {
		
				await this.loadTrees( majordistrict, i, 300000 );
				break; // Exit the loop when i is over 10000

	  		} else {
			
				if ( i > 1000 ) {

					await this.loadTrees( majordistrict, i, i + 50 );
					i = i + 50;

				} else {

					await this.loadTrees( majordistrict, i, i + 500 );
					i = i + 500;
			
				}
			}
		}

    // Code to execute after all function calls complete
    console.log('All function calls have completed');


  } catch ( error ) {
    // Handle any errors that occurred during the function calls
    console.error( 'An error occurred:', error );
  }

}

/**
 * Asynchronously load tree data from an API endpoint based on major district id
 * 
 * @param { String } majordistrict - The major district code.
 * @param { Number } size minimun tree area size
 */
async loadTrees( majordistrict, lower, upper ) {

	//"https://geo.fvh.fi/spotted/collections/tree/items?f=json&limit=32000&filter=area_m2%20BETWEEN%20" + lower + "%20AND%20"+ upper;
	//"https://geo.fvh.fi/spotted/collections/tree/items?f=json&limit=32000&tunnus=" + majordistrict + "&size=" + size;

      // Construct the API endpoint URL
	let url = "https://geo.fvh.fi/spotted/collections/tree/items?f=json&limit=32000&tunnus=" + majordistrict + "&filter=area_m2%20BETWEEN%20" + lower + "%20AND%20"+ upper;

	try {

        // Attempt to retrieve the tree data from the local storage using the API endpoint URL as the key
		const cachedValue = await this.cacheService.getCachedData(url);

         // If the tree data is already available in the local storage, add it to the Cesium map
		if ( cachedValue ) {

			console.log("found from cache");
			this.addTreesDataSource( cachedValue, lower );

		} else {

            // Otherwise, fetch the tree data from the API endpoint and add it to the local storage
			this.loadTreesWithoutCache( url, lower );

		}
	  	
	} catch ( err ) {
		// This code runs if there were any errors.
		console.log( err );
	}
}

/**
 * Add the tree data as a new data source to the Cesium
 * 
 * @param { object } data tree data
 * @param { Number } size minimun tree area size
 */
addTreesDataSource( data, size ) {
	
	this.viewer.dataSources.add( Cesium.GeoJsonDataSource.load( data, {
		stroke: Cesium.Color.BLACK,
		fill: Cesium.Color.DARKGREEN,
		strokeWidth: 3,
		clampToGround: true
	}) )
	.then(function ( dataSource ) {
		
        // Set a name for the data source
		dataSource.name = "Trees" + size;
		let entities = dataSource.entities.values;
		
        // Iterate over each entity in the data source and set its polygon material color based on the tree description
		for ( let i = 0; i < entities.length; i++ ) {

			const entity = entities[ i ];
			const code = entity._properties._koodi._value;
			this.setTreePolygonMaterialColor( entity, code );		

		}
	})	
	.otherwise(function ( error ) {
		// Log any errors encountered while loading the data source
		console.log( error );
	});

}

/**
 * Fetch tree data from the API endpoint and add it to the local storage
 * 
 * @param { String } url API endpoint's url
 */
async loadTreesWithoutCache(url, lower) {
    console.log("Not in cache! Loading: " + url);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        // After successfully fetching, cache the data
        await this.cacheService.setCachedData(url, data);
        // Then, add it as a data source
        this.addTreesDataSource(data, lower);
    } catch (error) {
        console.error("Error loading tree data:", error);
    }
}

/**
 * Set the polygon material color and extruded height for a given tree entity based on its description
 * 
 * @param { object } entity tree entity
 * @param { String } code code of tree entity
 */
setTreePolygonMaterialColor( entity, code ) {

	switch ( code ){
		case "224":
			entity.polygon.material = Cesium.Color.FORESTGREEN.withAlpha( 0.7 );
            entity.polygon.extrudedHeight = 22.5;
			break;
		case "223":
			entity.polygon.material = Cesium.Color.FORESTGREEN.withAlpha( 0.6 );
            entity.polygon.extrudedHeight = 17.5;
		case "222":
			entity.polygon.material = Cesium.Color.FORESTGREEN.withAlpha( 0.55 );
            entity.polygon.extrudedHeight = 12.5;
		case "221":
			entity.polygon.material = Cesium.Color.FORESTGREEN.withAlpha( 0.5 );
            entity.polygon.extrudedHeight = 6;
		}	

}

/**
 * Counts the total area of all tree datasources
 * 
 * @returns { Number } Tree area in square meters
 */
countTreeArea( ) {

	let totalTreeArea = 0;
	
    this.viewer.dataSources._dataSources.forEach( function( dataSource ) {
        if ( dataSource.name.startsWith( "Trees" ) ) {

			for ( let i = 0; i < dataSource._entityCollection._entities._array.length; i++ ) {

                const entityArea = dataSource._entityCollection._entities._array[ i ]._properties._area_m2._value;
				totalTreeArea = totalTreeArea + entityArea;
                                                     
            }
        }
    });

	return totalTreeArea;

}
}
