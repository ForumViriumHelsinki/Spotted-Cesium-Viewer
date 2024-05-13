export default class Cache {
	constructor() {

	}  

	async getCachedData( key ) {
		try {
			const response = await fetch( `https://geo.fvh.fi/spotted-api/cache/get?key=${key}` );
			if ( !response.ok ) {
				throw new Error( 'Network response was not ok' );
			}
			const data = await response.json();
			return data; // data could be null if the key does not exist in the cache
		} catch ( error ) {
			console.error( 'Failed to fetch cached data:', error );
			return null;
		}
	}

	async setCachedData( key, value ) {
		try {
			const response = await fetch( 'https://geo.fvh.fi/spotted-api/cache/set', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify( { key, value } ),
			} );
			if ( !response.ok ) {
				throw new Error( 'Network response was not ok' );
			}
			const responseData = await response.json();
			console.log( responseData.message );
		} catch ( error ) {
			console.error( 'Failed to set cache data:', error );
		}
	}
}