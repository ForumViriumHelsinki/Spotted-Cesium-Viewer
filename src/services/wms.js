import * as Cesium from 'cesium';
import { useGlobalStore } from '../stores/global-store.js';

export default class Wms {
	constructor() {
		this.store = useGlobalStore();
	}
	/**
 * Function to create an imagery provider based on the selected layer
 * 
 * @param { String } layers - layers of WMS service
 */
	createImageryProvider( layers ) {
		const provider = new Cesium.WebMapServiceImageryProvider( {
			url : 'https://kartta.hel.fi/ws/geoserver/avoindata/ows?SERVICE=WMS&',
			layers : layers,
			proxy: new Cesium.DefaultProxy( '/proxy/' )
		} );
        
		return new Cesium.ImageryLayer( provider );
	}

	createHSYImageryLayer() {
		// Define the backend proxy URL
		const backendURL = 'https://geo.fvh.fi';

		// Construct the proxy URL with the full WMS request URL encoded as a query parameter
		const proxyUrl = `${backendURL}/spotted-wms/proxy`;

		// Use the proxy URL in the WebMapServiceImageryProvider
		const provider = new Cesium.WebMapServiceImageryProvider( {
			url: proxyUrl, // Point this to your backend proxy
			layers: 'asuminen_ja_maankaytto:maanpeite_rakennus_2022,asuminen_ja_maankaytto:maanpeite_avokalliot_2022,asuminen_ja_maankaytto:maanpeite_merialue_2022,asuminen_ja_maankaytto:maanpeite_muu_avoin_matala_kasvillisuus_2022,asuminen_ja_maankaytto:maanpeite_muu_vetta_lapaisematon_pinta_2022,asuminen_ja_maankaytto:maanpeite_paallystamaton_tie_2022,asuminen_ja_maankaytto:maanpeite_paallystetty_tie_2022,asuminen_ja_maankaytto:maanpeite_paljas_maa_2022,asuminen_ja_maankaytto:maanpeite_pellot_2022,asuminen_ja_maankaytto:maanpeite_puusto_10_15m_2022,asuminen_ja_maankaytto:maanpeite_puusto_15_20m_2022,asuminen_ja_maankaytto:maanpeite_puusto_2_10m_2022,asuminen_ja_maankaytto:maanpeite_puusto_yli20m_2022,asuminen_ja_maankaytto:maanpeite_vesi_2022',
			// Other necessary WebMapServiceImageryProvider parameters...
		} );
    
		return new Cesium.ImageryLayer( provider );
	}

	resetWMS() {

		const selectedLayer = document.getElementById( 'layerSelect' ).value;
		this.store.cesiumViewer.imageryLayers.removeAll(); // Remove existing imagery layers
		this.store.cesiumViewer.imageryLayers.add( this.createImageryProvider( selectedLayer ) );

	}

}