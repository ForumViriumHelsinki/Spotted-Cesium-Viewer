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

		if ( Number( districtDataSource._entityCollection._entities._array[ i ]._properties._tunnus._value ) === Number( id ) ) {

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

/**
 * Finds properties of district based on district tunnus and level
 * 
 * @param { String } name name of the district datasource
 * @param { Number } id Id of the district
 * 
 * @returns { Object } properties of a district
*/
function getDistrictPropsByNameAndId( name, id ) {

    for ( let i = 0; i < viewer.dataSources._dataSources.length; i++ ) {

        if ( viewer.dataSources._dataSources[ i ]._name === name ) {

            const datasource = viewer.dataSources._dataSources[ i ];
    
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
async function newDistrict( url, load ) {

    return new Promise((resolve, reject) => {

        loadDistrictZones( 0.01, url, load );

        setTimeout(() => {
            resolve(); // Resolve the promise when done
        }, 1000);
    });
    

}
/**
 * Calls functions needed for major district level
 */
async function newMajorDistrict( ) {

    return new Promise((resolve, reject) => {

        document.getElementById( "showWaterToggle" ).disabled = false;
        document.getElementById( "showVegetationToggle" ).disabled = false;
        document.getElementById( "showTreeToggle" ).disabled = false;
        document.getElementById( "showFieldsToggle" ).disabled = false;
        document.getElementById( "showOtherNatureToggle" ).disabled = false;
        document.getElementById( "showBuiltToggle" ).disabled = false;
        loadDistrictZones( 0.01, 'assets/data/HelsinkiDistrict.json', 'Districts' );

        setTimeout(() => {
            resolve(); // Resolve the promise when done
        }, 1000);
    });

}


/**
 * Sets static district specific variables for plotting
 * 
 * @param { Object} properties - The properties of the picked entity
 * 
 */
function setDistrictVariables( properties ) {

    districtName = String( properties.nimi_fi )
    districtPopulation = properties.asukasluku;
    districtArea = properties.pa_m2;

    if ( districtsVisited.length > 1 && properties.tunnus._value ) {

        if ( properties.tunnus._value != districtsVisited[ districtsVisited.length - 1 ]._value ) {

            districtsVisited.push( properties.tunnus );

        }
    

    } else {

        districtsVisited.push( properties.tunnus );

    }
}


/**
 * Loads district zone polygons with the given opacity
 * 
 * @param {number} opacity - The opacity of the polygons (range from 0 to 1)
 */
function loadDistrictZones( opacity, url, name ) {
    // Load major district code zones
    const HKIMajorDistrictURL = url;
	console.log( "Loading: " + HKIMajorDistrictURL );
	
	let promisePostCodes = Cesium.GeoJsonDataSource.load( HKIMajorDistrictURL, {
  		stroke: Cesium.Color.BLACK,
  		fill: new Cesium.Color( 0.3, 0.3, 0.3, opacity ),
  		strokeWidth: 8,
		clampToGround: false
	})
	.then( function ( dataSource ) {
        dataSource.name = name;
		viewer.dataSources.add( dataSource );
	})	
	.otherwise( function ( error ) {
      //Display any errrors encountered while loading.
      console.log( error );
    });
}
