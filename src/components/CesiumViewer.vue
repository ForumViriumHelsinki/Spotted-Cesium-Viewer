<template>
  <div id="cesiumContainer"></div>
    <PrintBox />
  <PopulationPressure />
  <NdviArea />
  <YlreAnnual />
  <MonthlyNDVI />
  <DistrictNDVI />
  <PieChart />
  <div id="ndviLegend"></div>
     <div id="plotContainer">
  </div>
       <div id="plotPopContainer">
  </div>
     <div id="ndviChartContainer">
  </div>  
     <div id="chartContainer">
  </div>
  <div id="printContainer"  style = "display: none">
    <i></i>
    </div>
  <div id="plotInhabitantContainer">
  </div>
  <div id="greenAreaContainer">
  </div>  

</template>

<script>
import * as Cesium from 'cesium';
import 'cesium/Source/Widgets/widgets.css';
import District from '../services/district.js'; 
import Featurepicker from '../services/feature-picker.js'; 
import WMS from '../services/wms.js'; 
import { useGlobalStore } from '../stores/global-store.js';
import ElementsDisplay from '../services/elements-display.js'; 
import EventEmitter from '../services/event-emitter.js';
import PopulationPressure from './PopulationPressure.vue';
import NdviArea from './NdviArea.vue';
import YlreAnnual from './YlreAnnual.vue';
import MonthlyNDVI from './MonthlyNDVI.vue';
import DistrictNDVI from './DistrictNDVI.vue';
import PieChart from './PieChart.vue';
import PrintBox from './PrintBox.vue';

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
	components: {
   		PrintBox,
  		PopulationPressure,
  		NdviArea,
  		YlreAnnual,
  		MonthlyNDVI,
  		DistrictNDVI,
  		PieChart,
	}, 	
	methods: {
		initViewer() {

			// Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
			this.store.cesiumViewer = new Cesium.Viewer( 'cesiumContainer', {
				terrainProvider : new Cesium.EllipsoidTerrainProvider(),
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
    		} );  

			// For example, add a placeholder imagery layer
			this.store.cesiumViewer.imageryLayers.add(
				this.wmsService.createImageryProvider( 'avoindata:Opaskartta_Helsinki' )
			);
    
	    // Fly the camera to Helsinki at the given longitude, latitude, and height.
			this.store.cesiumViewer.camera.flyTo( {
				destination : Cesium.Cartesian3.fromDegrees( 24.901745, 60.195464, 33000 ), 
				orientation : {
					heading : Cesium.Math.toRadians( 0.0 ),
					pitch : Cesium.Math.toRadians( -85.0 ),
				}
			} );
    
			const districtService = new District();

			// Load district zones & energy data availability tags
			districtService.loadDistrictZones( 0.1, 'assets/data/HelsinkiMajorDistrict.json', 'MajorDistricts' );
			const featurepicker = new Featurepicker(  );

			// Add click event listener to the viewer container
			const cesiumContainer = document.getElementById( 'cesiumContainer' );
			cesiumContainer.addEventListener( 'click', function( event ) { 
				featurepicker.processClick( event ); // Assuming processClick is defined later
			} );

			const elementsDisplayService = new ElementsDisplay ();
			elementsDisplayService.toggleReturnButtonVisibility();

			this.addAttribution( );

			this.$nextTick( () => {
				this.eventEmitterService.emitControlPanelEvent( );
			} );

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

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

#plotContainer
{
	position: fixed;
	top: 10.5%;
	left: 0%;
	width: 35%;
	height: 250px; 
	visibility: hidden;
	
	font-size: 12px;
 	
	border: 1px solid black;
	box-shadow: 3px 5px 5px black; 
}

#plotInhabitantContainer
{
	position: fixed;
	top: 10.5%;
	right: 0%;
	width: 30%;
	height: 40%; 
	visibility: hidden;
	
	font-size: 12px;
 	
	border: 1px solid black;
	box-shadow: 3px 5px 5px black; 
}

#chartContainer
{
	position: fixed;
	top: 50%;
	right: 0%;
	width: 31.25%;
	height: 40%; 
	visibility: hidden;
	
	font-size: 12px;
	border: 1px solid black;
	box-shadow: 3px 5px 5px black; 
}

#ndviChartContainer
{
	position: fixed;
	top: 10%;
	right: 0%;
	width: 31.25%;
	height: 40%; 
	visibility: hidden;
	
	font-size: 12px;
	border: 1px solid black;
	box-shadow: 3px 5px 5px black; 
}

#greenAreaContainer
{
	position: fixed;
	top: 10.5%;
	right: 0%;
	width: 50%;
	height: 40%; 
	visibility: hidden;
	
	font-size: 12px;
 	
	border: 1px solid black;
	box-shadow: 3px 5px 5px black; 
}

/* Basic legend styling */
#ndviLegend {
  position: fixed;
  top: 20px;       /* Position at the top */
  left: 20px;      /* Position at the left */
  background-color: rgba(255, 255, 255, 1); 
  border-radius: 6px;
  border: 2px solid black; /* Add a black outline */
}
.swatch {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  margin-top: 10px;
  margin-left: 20px;
  margin-right: 20px;
}
.swatch span {
  margin-left: 10px;
  margin-right: 10px;
}

#plotPopContainer
{
	position: fixed;
	top: 50%;
	left: 0%;
	width: 31.25%;
	height: 45%; 
	visibility: hidden;
	
	font-size: 12px;
	border: 1px solid black;
	box-shadow: 3px 5px 5px black;  
    background-color: white;
}
</style>