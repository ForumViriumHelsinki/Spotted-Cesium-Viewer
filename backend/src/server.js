// backend/src/server.js
const express = require( 'express' );
const Redis = require( 'ioredis' );
const cors = require( 'cors' );
const bodyParser = require( 'body-parser' );
const axios = require( 'axios' );
const https = require( 'https' );

const app = express();
app.use( cors() ); // Enable CORS for all routes
app.use( bodyParser.json( { limit: '200mb' } ) );
app.use( bodyParser.urlencoded( { extended: true, limit: '200mb' } ) );

// Connect to Redis
const redis = new Redis( { host: 'spotted-redis', port: 6380 } );

// Existing cache endpoints
app.get( '/spotted-api/cache/get', async ( req, res ) => {
	const key = req.query.key;
	const data = await redis.get( key );
	res.json( data ? JSON.parse( data ) : null );
} );

app.post( '/spotted-api/cache/set', async ( req, res ) => {
	const { key, value } = req.body;
	await redis.set( key, JSON.stringify( value ) );
	res.status( 200 ).send( { message: 'Cached successfully' } );
} );

app.get( '/spotted-wms/proxy', async ( req, res ) => {
    // The base URL of the WMS server you're proxying
    const baseUrl = 'https://kartta.hsy.fi/geoserver/wms';

    // Construct the full URL by appending the original query parameters received by the proxy
    const urlParams = new URLSearchParams(req.query).toString();
    const fullUrl = `${baseUrl}?${urlParams}`;

    // Generate a unique cache key based on the full URL
    const cacheKey = `wms:${fullUrl}`;

    // Try to retrieve the cached response
    const cachedResponse = await redis.get(cacheKey);

    if (cachedResponse) {
        // Parse the cached response
        const parsedResponse = JSON.parse(cachedResponse);
        // Set the content type based on what was cached
        res.type(parsedResponse.contentType);
        res.status(parsedResponse.statusCode);
        // Convert the base64-encoded data back to a buffer and send it as the response
        res.send(Buffer.from(parsedResponse.data, 'base64'));
        return;
    }

    const httpsAgent = new https.Agent({
        rejectUnauthorized: false, // Bypass SSL certificate verification
    });

    try {
        const response = await axios.get(fullUrl, { httpsAgent, responseType: 'arraybuffer', validateStatus: false });
        // Cache the response from the WMS server
        // Store the response as a base64-encoded string along with its content type and status code
        const cacheValue = JSON.stringify({
            contentType: response.headers['content-type'],
            statusCode: response.status,
            data: Buffer.from(response.data).toString('base64'),
        });

        // Save the cacheValue in Redis; consider setting an expiration time for the cache
        await redis.set(cacheKey, cacheValue);

        // Forward the content type and status code from the WMS server response
        res.type(response.headers['content-type']);
        res.status(response.status);
        res.send(response.data);
    } catch (error) {
        console.error('Proxy request failed:', error);
        res.status(500).send('Failed to proxy request');
    }
});

const PORT = process.env.PORT || 3003;
app.listen( PORT, () => console.log( `Server running on port ${PORT}` ) );