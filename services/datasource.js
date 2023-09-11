  
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