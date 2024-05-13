import { useGlobalStore } from '../stores/global-store.js';
import * as Cesium from 'cesium';

export default class Datasource {
	constructor() {
        this.store = useGlobalStore();
        this.viewer = this.store.cesiumViewer;
	}  

/**
 * Get a data source from the Cesium viewer
 * 
 * @param { String } name name of the datasource
 * @returns { Object } The found data source
*/
getDataSourceByName( name ) {

    return this.viewer.dataSources._dataSources.find( ds => ds.name.startsWith( name )  );

}

async addDataSourceWithPolygonFix( data, name ) {

		return new Promise( ( resolve ) => {
			Cesium.GeoJsonDataSource.load( data, {
				stroke: Cesium.Color.BLACK,
				fill: Cesium.Color.CRIMSON,
				strokeWidth: 3,
				clampToGround: true,
			} ).then( ( data ) => {
          
				data.name = name;

				for ( let i = 0; i < data.entities.values.length; i++ ) {
					let entity = data.entities.values[i];

					if ( Cesium.defined( entity.polygon ) ) {
						entity.polygon.arcType = Cesium.ArcType.GEODESIC;
					}
				}

				this.store.cesiumViewer.dataSources.add( data );
				resolve( data.entities.values );
			} )
				.catch( ( error ) => {
					console.log( error );
				} );
		} );
}

/**
 * Check if a data source starting with the provided name exists in the Cesium viewer
 * 
 * @param { String } name name of the datasource
 * @returns { Boolean } true if a matching data source is found, false otherwise
 */
dataSourceWithNameExists( name ) {
    const dataSource = this.viewer.dataSources._dataSources.find( ds => ds.name.startsWith( name ) );
    return dataSource !== undefined;
}

/**
 * Get a data source from the Cesium viewer
 * 
 * @param { String } name name of the datasource
*/
hideDataSourceByName( name ) {

    this.viewer.dataSources._dataSources.forEach( function( dataSource ) {
        if ( dataSource.name.startsWith( name ) ) {
            dataSource.show = false;	
        }
    });
}

/**
 * Hide a data source in the Cesium viewer by name
 * 
 * @param { String } name name of the datasource
 */
showDataSourceByName( name ) {
    this.viewer.dataSources._dataSources.forEach( function( dataSource ) {
        if ( dataSource.name.startsWith( name ) ) {
            dataSource.show = true;	
        }
    });
}

/**
 * Removes the data source by name from the Cesium viewer
 * 
 */
removeDataSourceByName( name ) {
    // Find the data source named 'MajorDistricts' in the viewer
    const majorDistrictsDataSource = this.viewer.dataSources.getByName( name );

    // If the data source is found, remove it
    if ( majorDistrictsDataSource ) {

        this.viewer.dataSources.remove( majorDistrictsDataSource, true );    

    }
}

/**
 * Removes all data sources whose names start with the provided name prefix from the Cesium viewer.
 * 
 * @param {string} namePrefix The prefix of the data source names to remove.
 * @returns {Promise<void>} A promise that resolves when all matching data sources are removed.
 */
async removeDataSourcesByNamePrefix(namePrefix) {
    return new Promise((resolve, reject) => {
        const dataSources = this.viewer.dataSources._dataSources;
        const removalPromises = [];

        for (const dataSource of dataSources) {
            if (dataSource.name.startsWith(namePrefix)) {
                const removalPromise = new Promise((resolveRemove, rejectRemove) => {
                    this.viewer.dataSources.remove(dataSource, true);

                    // Binding "this" to the onDataSourceRemoved function
                    const onDataSourceRemovedHandler = this.onDataSourceRemoved.bind(this);  
                    
                    this.viewer.dataSources.dataSourceRemoved.addEventListener(onDataSourceRemovedHandler);
                });

                removalPromises.push(removalPromise);
            }
        }

        Promise.all(removalPromises)
            .then(() => resolve())
            .catch(error => reject(error));
    });
}

onDataSourceRemoved() {
    // Now 'this' refers to the Datasource instance
    this.viewer.dataSources.dataSourceRemoved.removeEventListener(this.onDataSourceRemoved.bind(this)); // Re-binding here too
}

/**
 * Removes duplicate data sources from the Cesium viewer.
 * 
 * @returns {Promise<void>} A promise that resolves when the operation is complete.
 */
async removeDuplicateDataSources( ) {
    return new Promise((resolve, reject) => {
        const dataSources = this.viewer.dataSources._dataSources;
        const uniqueDataSources = {};

        for (let i = 0; i < dataSources.length; i++) {
            const dataSource = dataSources[i];

            if (!uniqueDataSources[dataSource.name] || uniqueDataSources[dataSource.name].index > i) {
                // Store or replace the data source if it's the first occurrence or has a smaller index
                uniqueDataSources[dataSource.name] = {
                    dataSource: dataSource,
                    index: i
                };
            }
        }

        // Clear all existing data sources
        this.viewer.dataSources.removeAll();

        // Add the unique data sources back to the viewer
        const addPromises = [];
        for (const name in uniqueDataSources) {
            const dataSource = uniqueDataSources[name].dataSource;
            const addPromise = this.viewer.dataSources.add(dataSource);
            addPromises.push(addPromise);
        }

        // Wait for all data sources to be added
        Promise.all(addPromises)
            .then(() => {
                resolve();
            })
            .catch((error) => {
                reject(error);
            });
    });
}

/**
 * Removes all data sources from the viewer except dataSourceNameToKeep
 * 
 * @param { Array } dataSourceNamesToKeep - Array of names of the datasource to keep
 */
removeDataSourcesExcept( dataSourceNamesToKeep  ) {

    for ( let i = 0; i < this.viewer.dataSources._dataSources.length; i++ ) {

        const dataSource = this.viewer.dataSources._dataSources[ i ];

        if ( !dataSourceNamesToKeep.includes( dataSource._name ) ) {

            this.viewer.dataSources.remove( dataSource, true );

        }
    }

}
}