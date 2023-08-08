
/**
 * Load trees sequentially with different parameters.
 * 
 * @param { String } majordistrict - The major district code.
 * @returns { Promise<void> } Promise that resolves when all function calls complete.
 */
async function loadTreesSequentially( majordistrict ) {
  try {

	let i = 0;

	while ( true ) {

		if ( i > 10000 ) {
		
			await loadTrees( majordistrict, i, 300000 );
			break; // Exit the loop when i is over 10000

	  	} else {
			
			if ( i > 1000 ) {

				await loadTrees( majordistrict, i, i + 100 );
				i = i + 100;

		} else {

			await loadTrees( majordistrict, i, i + 1000 );
			i = i + 1000;


		}

	}
}

    // Code to execute after all function calls complete
    console.log('All function calls have completed');

	createVegetationHistogram( majordistrict._value );


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
async function loadTrees( majordistrict, lower, upper ) {

	//"https://geo.fvh.fi/spotted/collections/tree/items?f=json&limit=32000&filter=area_m2%20BETWEEN%20" + lower + "%20AND%20"+ upper;
	//"https://geo.fvh.fi/spotted/collections/tree/items?f=json&limit=32000&tunnus=" + majordistrict + "&size=" + size;

      // Construct the API endpoint URL
	let url = "https://geo.fvh.fi/spotted/collections/tree/items?f=json&limit=32000&tunnus=" + majordistrict + "&filter=area_m2%20BETWEEN%20" + lower + "%20AND%20"+ upper;

	try {

        // Attempt to retrieve the tree data from the local storage using the API endpoint URL as the key
		const value = await localforage.getItem( url );

         // If the tree data is already available in the local storage, add it to the Cesium map
		if ( value ) {

			console.log("found from cache");
			let datasource = JSON.parse( value )
			addTreesDataSource( datasource, lower );

		} else {

            // Otherwise, fetch the tree data from the API endpoint and add it to the local storage
			loadTreesWithoutCache( url, lower );

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
function addTreesDataSource( data, size ) {
	
	viewer.dataSources.add( Cesium.GeoJsonDataSource.load( data, {
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
			const code = entity.properties._koodi._value;
			setTreePolygonMaterialColor( entity, code );		

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
function loadTreesWithoutCache( url , lower ) {
	
	console.log("Not in cache! Loading: " + url );

	const response = fetch( url )
	.then( function( response ) {
	  return response.json();
	})
	.then( function( data ) {
		localforage.setItem( url, JSON.stringify( data ) );
		addTreesDataSource( data, lower );
	})
	
}

/**
 * Set the polygon material color and extruded height for a given tree entity based on its description
 * 
 * @param { object } entity tree entity
 * @param { String } code code of tree entity
 */
function setTreePolygonMaterialColor( entity, code ) {

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
