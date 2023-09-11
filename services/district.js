/**
 * Get total of property by district data source name
 * 
 * @param { String } name name of the district datasource
 * 
 * @returns { Number } The population 
*/
function getCityTotalByNameAndProperty( name, property ) {
    
    // Find the data source for name
	const districtDataSource = getDataSourceByName( name );
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

/**
 * Get total area of district properties by district data source name and district id and list of property keys
 * 
 * @param { String } name name of the district datasource
 * @param { Number } id Id of the district
 * @param { Array } propertyKeys - List of property keys to calculate the total area
 * 
 * @returns { Number } The total area 
*/
function getTotalAreaByNameAndIdAndPropertyKeys( name, id, propertyKeys ) {
    
    // Find the data source for name
	const districtDataSource = getDataSourceByName( name );
	let totalArea = 0;

	// If the data source isn't found, exit the function
	if ( !districtDataSource ) {

		return totalArea;

	}

    for ( let i = 0; i < districtDataSource._entityCollection._entities._array.length; i++ ) {

		if ( districtDataSource._entityCollection._entities._array[ i ]._properties._tunnus._value == id ) {

			const entity = districtDataSource._entityCollection._entities._array[ i ];
	
			propertyKeys.forEach( propertyKey => {

				if ( entity._properties.hasOwnProperty( propertyKey )) {

					totalArea += entity._properties[ propertyKey ]._value;

				}

			});

			return totalArea;

		}

    }

    return totalArea;

}

/**
 * Get total area of district properties by district data source name and list of property keys
 * 
 * @param { String } name - Name of the district data source
 * @param { Array } propertyKeys - List of property keys to calculate the total area
 * 
 * @returns { Number } The total area
 */
function getTotalAreaByNameAndPropertyKeys( name, propertyKeys ) {
    // Find the data source for name
    const districtDataSource = getDataSourceByName( name );

    let totalArea = 0;

    // If the data source isn't found or propertyKeys is empty, return 0
    if ( !districtDataSource || propertyKeys.length === 0 ) {

        return totalArea;

    }

    let idsDone = [];

    for ( let i = 0; i < districtDataSource._entityCollection._entities._array.length; i++ ) {

        const entity = districtDataSource._entityCollection._entities._array[ i ];
        const tunnusValue = entity._properties._tunnus._value;

        if ( !idsDone.includes( tunnusValue ) ) {

            propertyKeys.forEach( propertyKey => {

                if ( entity._properties.hasOwnProperty( propertyKey )) {

                    totalArea += entity._properties[ propertyKey ]._value;

                }
            });

            idsDone.push( tunnusValue );
        }
    }

    return totalArea;
}