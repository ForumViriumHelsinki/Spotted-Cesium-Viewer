  
/**
 * Get a data source from the Cesium viewer
 * 
 * @param { String } name name of the datasource
 * @returns { Object } The found data source
*/
function getDataSourceByName( name ) {

    return viewer.dataSources._dataSources.find( ds => ds.name.startsWith( name )  );

}

/**
 * Check if a data source starting with the provided name exists in the Cesium viewer
 * 
 * @param { String } name name of the datasource
 * @returns { Boolean } true if a matching data source is found, false otherwise
 */
function dataSourceWithNameExists( name ) {
    const dataSource = viewer.dataSources._dataSources.find( ds => ds.name.startsWith( name ) );
    return dataSource !== undefined;
}

/**
 * Get a data source from the Cesium viewer
 * 
 * @param { String } name name of the datasource
*/
function hideDataSourceByName( name ) {

    viewer.dataSources._dataSources.forEach( function( dataSource ) {
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
function showDataSourceByName( name ) {
    viewer.dataSources._dataSources.forEach( function( dataSource ) {
        if ( dataSource.name.startsWith( name ) ) {
            dataSource.show = true;	
        }
    });
}

/**
 * Removes the data source by name from the Cesium viewer
 * 
 */
function removeDataSourceByName( name ) {
    // Find the data source named 'MajorDistricts' in the viewer
    const majorDistrictsDataSource = viewer.dataSources.getByName( name );

    // If the data source is found, remove it
    if ( majorDistrictsDataSource ) {

        viewer.dataSources.remove( majorDistrictsDataSource, true );    

    }
}

function removeDuplicateDataSources( ) {

    const dataSources = viewer.dataSources._dataSources;
    const uniqueDataSources = {};
    
    for ( let i = 0; i < dataSources.length; i++ ) {

        const dataSource = dataSources[ i ];

        if ( !uniqueDataSources[ dataSource.name ] || uniqueDataSources[ dataSource.name ].index > i ) {
            // Store or replace the data source if it's the first occurrence or has a smaller index
            uniqueDataSources[ dataSource.name ] = {
                dataSource: dataSource,
                index: i
            };
        }
    }

    // Clear all existing data sources
    viewer.dataSources.removeAll();

    // Add the unique data sources back to the viewer
    for ( const name in uniqueDataSources ) {

        viewer.dataSources.add( uniqueDataSources[ name ].dataSource );

    }

}

/**
 * Removes all data sources from the viewer except dataSourceNameToKeep
 * 
 * @param { Array } dataSourceNamesToKeep - Array of names of the datasource to keep
 */
function removeDataSourcesExcept( dataSourceNamesToKeep  ) {

    for ( let i = 0; i < viewer.dataSources._dataSources.length; i++ ) {

        const dataSource = viewer.dataSources._dataSources[ i ];

        if ( !dataSourceNamesToKeep.includes( dataSource._name ) ) {

            viewer.dataSources.remove( dataSource, true );

        }
    }

}