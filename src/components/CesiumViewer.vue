<template>
  <div id="cesiumContainer"></div>
  
</template>

<script>
import * as Cesium from 'cesium';
import 'cesium/Source/Widgets/widgets.css';
import District from '../services/district.js'; 
import Featurepicker from '../services/feature-picker.js'; 
import WMS from '../services/wms.js'; 
import { useGlobalStore } from '../stores/global-store.js';
import ElementsDisplay from '../services/elements-display.js'; 
import NDVI from '../services/ndvi.js'; 
import NdviArea from '../services/ndvi-area.js';
import EventEmitter from '../services/event-emitter.js';

export default {
	data() {
		return {
			viewer: null,
		};
	},
	mounted() {
		this.store = useGlobalStore();
		Cesium.Ion.defaultAccessToken = null;
		this.eventEmitterService = new EventEmitter();
		this.wmsService = new WMS();
		this.initViewer();
	}, 
	methods: {
		initViewer() {
			
			// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
			this.store.cesiumViewer = new Cesium.Viewer( 'cesiumContainer', {
    	terrainProvider : new Cesium.EllipsoidTerrainProvider(),
    	imageryProvider: this.wmsService.createImageryProvider( document.getElementById( 'layerSelect' ).value ),
    	animation: false,
      fullscreenButton: false,
      geocoder: false,
      shadows: false,
      navigationHelpButton: false,
      timeline: false,
      sceneModePicker: false,
      baseLayerPicker: false,
      infoBox: false,
	  homeButton: false
    });  
    
	    // Fly the camera to Helsinki at the given longitude, latitude, and height.
    this.store.cesiumViewer.camera.flyTo({
      destination : Cesium.Cartesian3.fromDegrees(24.901745, 60.195464, 33000), 
      orientation : {
        heading : Cesium.Math.toRadians(0.0),
        pitch : Cesium.Math.toRadians(-85.0),
      }
    });
    
	const districtService = new District();

    // Load district zones & energy data availability tags
	districtService.loadDistrictZones( 0.1, 'assets/data/HelsinkiMajorDistrict.json', 'MajorDistricts' );
    
	// Add click event listener to the viewer container
	const cesiumContainer = document.getElementById( 'cesiumContainer' );
		const featurepicker = new Featurepicker(  );
		cesiumContainer.addEventListener( 'click', function( event ) { 
		featurepicker.processClick( event ); // Assuming processClick is defined later
	} );


  document.getElementById('blueSlider').addEventListener('input', function() {
    document.getElementById('sliderValue').textContent = 'distance from green area ' + this.value + ' km';
    this.handleGreenAreas( );
});

const ndviService = new NDVI ();
const ndviAreaService = new NdviArea ();


document.getElementById('ndviSlider').addEventListener('input', function() {
  document.getElementById('ndviSliderValue').textContent = 'ndvi';
  ndviService.updateNDVIDataSources( );
});

document.getElementById('ndviSlider2023').addEventListener('input', function() {
  ndviService.updateNDVIDataSources2023( );
});

document.getElementById('ndviArea').addEventListener('input', function() {
  ndviAreaService.updateNDVIAreaDataSources( );
});

document.getElementById('ndviYlre').addEventListener('input', function() {
  ndviAreaService.updateNDVIYlreDataSources( );
});

const elementsDisplayService = new ElementsDisplay ();
elementsDisplayService.toggleReturnButtonVisibility();

			this.addAttribution( );

			this.$nextTick( () => {
				this.eventEmitterService.emitControlPanelEvent( );
				this.addSelectorEventListeners( );
			} );

		},


/**
 * 
 * A function for adding layer and plot select event listner.
 * 
 */
addSelectorEventListeners(  ) {

	// Get references to all toggle inputs
	const layerSelect = document.getElementById('layerSelect');
	const NDVISelect = document.getElementById('NDVISelect');
	const plotSelect = document.getElementById('plotSelect');
		
    // Listen for changes in the layer selection
    layerSelect.addEventListener('change', function () {
        this.wmsService.resetWMS( );
    });	

    // Listen for changes in the layer selection
    NDVISelect.addEventListener('change', function () {
        const selectedLayer = document.getElementById('NDVISelect').value;
        this.store.cesiumViewer.imageryLayers.removeAll(); // Remove existing imagery layers
        this.store.cesiumViewer.imageryLayers.addImageryProvider( this.wmsService.createNDVIImageryProvider( selectedLayer ) ); // Add the selected layer
    });	

    plotSelect.addEventListener('change', function () {

        if ( this.store.districtsVisited.length ) {

            createPieChartForMajorDistrict( this.store.districtsVisited[ districtsVisited.length - 1 ] );

        }

    });	
            
},

		addAttribution() {
			
			const hriCredit = new Cesium.Credit( '<a href="https://hri.fi/data/fi/dataset" target="_blank"><img src="assets/images/hero_logo_50x25.png" title="assets/images/Helsinki Region Infoshare"/></a>' );
    		const hsyCredit = new Cesium.Credit( '<a href="https://www.hsy.fi/en/air-quality-and-climate/geographic-information/open-geographic-information-interfaces/" target="_blank"><img src="assets/images/hsy-logo_41x25px.png" title="Helsingin Seudun Ympäristöpalvelut"/></a>' );
    		const sentinelHubCredit = new Cesium.Credit( '<a href="https://www.sentinel-hub.com/index.html" target="_blank"><img src="assets/images/sentinel_hub_small.png" title="Sentinel Hub"/></a>' );
			this.store.cesiumViewer.creditDisplay.addStaticCredit( hriCredit );
			this.store.cesiumViewer.creditDisplay.addStaticCredit( hsyCredit );
			this.store.cesiumViewer.creditDisplay.addStaticCredit( sentinelHubCredit );

		},
 
	},
};
</script>

<style>
#cesiumContainer {
	width: 100%;
	height: 100%;
}
</style>