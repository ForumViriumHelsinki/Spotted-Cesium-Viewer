<template>
  <div v-if="showControlPanel" id="controlPanelContainer">

    <div id="UIButtonContainer">
	    <!-- Rest of your UI elements -->
    <button class="uiButton" id='uploadButton' @click="triggerFileUpload" style="display: block; margin: 10px auto;">
      Upload GeoJSON Dataset
    </button>
    <input type="file" id="fileUpload" accept=".json,.geojson" style="display: none;" @change="handleFileUpload">
      <p class="uiReturnButton" id="returnButton" onClick="prevLevel()" style="color: black;">Previous district</p>
      <v-btn icon size="small" @click="reset">
        <v-icon>mdi-restart</v-icon>
      </v-btn>
	</div>

  <!-- Selects WMS layer -->
    <v-select
	  class="smaller-select" 
      id="layerSelect"
      v-model="selectedLayer"
      :items="layerOptions"
      item-title="text"
      item-value="value"
      label="Select Background Map"
      variant="outlined"
      style="float: left;"
      @update:modelValue="onLayerSelectChange" 
    ></v-select>

  <!-- Selects WMS layer -->
  <select id="NDVISelect" style = "display: none">
    <option value="NDVI" selected>NDVI March</option>
    <option value="NDVI_APRIL">NDVI April</option>
    <option value="NDVI_MAY">NDVI May</option>
    <option value="NDVI_JUNE">NDVI June</option>
    <option value="NDVI_JULY">NDVI July</option>
    <option value="NDVI_AUGUST">NDVI August</option>
    <option value="NDVI_SEPTEMBER">NDVI September</option>
    <option value="NDVI_OCTOBER">NDVI October</option>
  </select>

<!-- activatePopulationPressureSwitch-->
<label class="switch" id = "activatePopulationPressureSwitch" >
  <input type="checkbox" id = "activatePopulationPressureToggle" value = "activatePopulationPressure" >
  <span class="slider round"></span>
</label>
<label for="activatePopulationPressureToggle" class="label" id = "activatePopulationPressureLabel" >Population pressure</label>

<!-- showPlanSwitch-->
<label class="switch" id = "showPlanSwitch" style = "display: none">
  <input type="checkbox" id = "showPlanToggle" value = "showPlan">
  <span class="slider round"></span>
</label>
<label for="showPlanToggle" class="label" id = "showPlanLabel" style = "display: none">Planned areas</label>

<!-- showProtectedSwitch-->
<label class="switch" id = "showProtectedSwitch" style = "display: none">
  <input type="checkbox" id = "showProtectedToggle" value = "showProtected" >
  <span class="slider round"></span>
</label>
<label for="showProtectedToggle" class="label" id = "showProtectedLabel" style = "display: none">Protected areas</label>

<!-- showGreenSwitch-->
<label class="switch" id = "showGreenSwitch" style = "display: none">
  <input type="checkbox" id = "showGreenToggle" value = "showGreen" >
  <span class="slider round"></span>
</label>
<label for="showGreenToggle" class="label" id = "showGreenLabel" style = "display: none">YLRE green areas</label>

<!-- showForestedAreasSwitch-->
<label class="switch" id = "showForestedAreasSwitch" style = "display: none">
  <input type="checkbox" id = "showForestedAreasToggle" value = "showForestedAreas" >
  <span class="slider round"></span>
</label>
<label for="showForestedAreasToggle" class="label" id = "showForestedAreasLabel" style = "display: none">Forested areas</label>

<!-- showForestedAreas1mSwitch-->
<label class="switch" id = "showForestedAreas1mSwitch" style = "display: none">
  <input type="checkbox" id = "showForestedAreas1mToggle" value = "showForestedAreas1m" >
  <span class="slider round"></span>
</label>
<label for="showForestedAreas1mToggle" class="label" id = "showForestedAreas1mLabel" style = "display: none">Forested areas 1m</label>

<!-- showPlotSwitch-->
<label class="switch" id = "showPlotSwitch" style = "display: none">
  <input type="checkbox" id = "showPlotToggle" value = "showPlot" >
  <span class="slider round"></span>
</label>
<label for="showPlotToggle" class="label" id = "showPlotLabel" style = "display: none">Display plot</label>

<!-- showNDVISwitch-->
<label class="switch"  id = "showNDVISwitch" style = "display: none">
  <input type="checkbox" id = "showNDVIToggle" value = "showNDVI">
  <span class="slider round"></span>
</label>
<label for="showNDVIToggle" class="label" id = "showNDVILabel" style = "display: none">NDVI</label>

<!-- NDVI2023Switch-->
<label class="switch"  id = "NDVI2023Switch" style = "display: none">
  <input type="checkbox" id = "NDVI2023Toggle" value = "NDVI2023">
  <span class="slider round"></span>
</label>
<label for="NDVI2023Toggle" class="label" id = "NDVI2023Label" style = "display: none">NDVI 2023</label>

<!-- YLRETimeSwitch-->
<label class="switch"  id = "YLRESwitch" style = "display: none">
  <input type="checkbox" id = "YLREToggle" value = "YLRE">
  <span class="slider round"></span>
</label>
<label for="YLREToggle" class="label" id = "YLRELabel" style = "display: none">YLRE green areas 2015-2024</label>

<!-- TreeRegistrySwitch-->
<label class="switch"  id = "TreeRegistrySwitch" style = "display: none">
  <input type="checkbox" id = "TreeRegistryToggle" value = "TreeRegistry">
  <span class="slider round"></span>
</label>
<label for="TreeRegistryToggle" class="label" id = "TreeRegistryLabel" style = "display: none">Tree Registry</label>

<!-- PopulationGridSwitch-->
<label class="switch"  id = "PopulationGridSwitch" style = "display: none">
  <input type="checkbox" id = "PopulationGridToggle" value = "PopulationGrid">
  <span class="slider round"></span>
</label>
<label for="PopulationGridToggle" class="label" id = "PopulationGridLabel" style = "display: none">Population grid</label>

<!-- SubDistrictNDVISwitch-->
<label class="switch"  id = "SubDistrictNDVISwitch" style = "display: none">
  <input type="checkbox" id = "SubDistrictNDVIToggle" value = "SubDistrictNDVI">
  <span class="slider round"></span>
</label>
<label for="SubDistrictNDVIToggle" class="label" id = "SubDistrictNDVILabel" style = "display: none">SubDistricts with NDVI</label>

<!-- showTreeSwitch-->
<label class="switch" id = "showTreesSwitch" style = "display: none">
  <input type="checkbox" id = "showTreeToggle" value = "showTree">
  <span class="slider round"></span>
</label>
<label for="showTreeToggle" class="label" id = "showTreesLabel" style = "display: none">Tree areas</label>

<!-- NDVI Areas-->
<label class="switch" id = "areasNDVISwitch" >
  <input type="checkbox" id = "areasNDVIToggle" value = "areasNDVI" >
  <span class="slider round"></span>
</label>
<label for="areasNDVIToggle" class="label" id = "areasNDVILabel" >NDVI areas</label>

<!-- SR-->
<label class="switch" id = "SRSwitch" >
  <input type="checkbox" id = "SRToggle" value = "SR" >
  <span class="slider round"></span>
</label>
<label for="SRToggle" class="label" id = "SRLabel" >1m res NDVI Areas</label>

<!--  showLandCover-->
<label class="switch" id = "landCoverSwitch">
  <input type="checkbox" id="landCoverToggle" value="getLandCover" >
  <span class="slider round"></span>
</label>
<label for="landCoverToggle" class="label" id="landCoverLabel">HSY land cover</label>

<!-- loadBuildingSwitch-->
<label class="switch" id = "buildingSwitch" style = "display: none">
  <input type="checkbox" id = "buildingToggle" value = "buildings" >
  <span class="slider round"></span>
</label>
<label for="buildingToggle" class="label" id = "buildingLabel" style = "display: none">Buildings Urban Heat Exposure</label>

<!--  simulation-->
<label class="switch" id = "simulationSwitch">
  <input type="checkbox" id="simulationToggle" value="simulation" >
  <span class="slider round"></span>
</label>
<label for="simulationToggle" class="label" id="simulationLabel">Simulations</label>

<!--  satellite-->
<label class="switch" id = "satelliteSwitch">
  <input type="checkbox" id="satelliteToggle" value="satellite" >
  <span class="slider round"></span>
</label>
<label for="satelliteToggle" class="label" id="satelliteLabel">Satellite viewer</label>

<!--  heatMap -->
<label class="switch" id = "heatMapSwitch">
  <input type="checkbox" id="heatMapToggle" value="heatMap" >
  <span class="slider round"></span>
</label>
<label for="heatMapToggle" class="label" id="heatMapLabel">Töölö Heat Map</label>

<!--  heatBlocks -->
<label class="switch" id = "heatBlockSwitch">
  <input type="checkbox" id="heatBlockToggle" value="heatBlock" >
  <span class="slider round"></span>
</label>
<label for="heatBlockToggle" class="label" id="heatBlockLabel">Helsinki Blocks Heat</label>
</div>


</template>

<script>

import WMS from '../services/wms.js';
import EventEmitter from '../services/event-emitter.js';
import Plot from '../services/plot.js';
import { useGlobalStore } from '../stores/global-store.js';
import { usePopulationStore } from '../stores/population-store.js';
import { useHeatMapStore } from '../stores/heat-map-store.js';
import { eventBus } from '../services/event-emitter.js';
import ElementsDisplay from '../services/elements-display.js';
import Datasource from '../services/datasource.js';
import Tree from '../services/tree.js';
import NdviArea from '../services/ndvi-area.js';
import Ndvi from '../services/ndvi.js';
import Building from '../services/building.js';
import GreenAreas from '../services/green-areas.js';
import Platform from '../services/platform.js';
import Simulation from '../services/simulation.js'
import * as Cesium from 'cesium';

export default {
	data() {
		return {
			viewer: null,
			treeService: null,
			plotService: null,
			showControlPanel: true,
			selectedLayer: 'avoindata:Opaskartta_Helsinki', // Default selected layer
    		layerOptions: [
      			{ text: 'Opaskartta', value: 'avoindata:Opaskartta_Helsinki' },
      			{ text: 'Ortoilmakuva', value: 'avoindata:Ortoilmakuva' },
      			{ text: 'Ortoilmakuva 2022', value: 'avoindata:Ortoilmakuva_2022_5cm' },
      			{ text: 'Ortoilmakuva 2021', value: 'avoindata:Ortoilmakuva_2021_5cm' },
      			{ text: 'Ortoilmakuva 2020', value: 'avoindata:Ortoilmakuva_2020' },
      			{ text: 'Ortoilmakuva 2018', value: 'avoindata:Ortoilmakuva_2018' },
      			{ text: 'Ortoilmakuva 2016', value: 'avoindata:Ortoilmakuva_2016' },
      { text: 'Ortoilmakuva 2014', value: 'avoindata:Ortoilmakuva_2014' },
      { text: 'Kantakartta', value: 'avoindata:Kantakartta' },
      { text: 'Kiinteistokartta', value: 'avoindata:Kiinteistokartta' },
      { text: 'Karttasarja PKS', value: 'avoindata:Karttasarja_PKS' },
      { text: 'Vääräväriortoilmakuva', value: 'avoindata:Vaaravariortoilmakuva_2022_5cm' },
      { text: 'Asemakaava', value: 'avoindata:Ajantasa_asemakaava' },
      { text: 'Kaavahakemisto', value: 'avoindata:Kaavahakemisto' },
      { text: 'Rakennukset alue rekisteritiedot', value: 'avoindata:Rakennukset_alue_rekisteritiedot' },
      { text: 'Tavoitteellinen viher- ja virkistysverkosto', value: 'avoindata:Tavoitteellinen_viher_ja_virkistysverkosto_VISTRA' },
    ],
		};
	},
	mounted() {
		this.unsubscribe = eventBus.$on( 'initControlPanel', this.addEventListeners );
		this.store = useGlobalStore();
		this.heatMapStore = useHeatMapStore();
		this.viewer = this.store.cesiumViewer;
		this.eventEmitterService = new EventEmitter();
		this.plotService = new Plot();
		this.treeService = new Tree();
		this.datasourceService = new Datasource();
		this.elementsDisplayService = new ElementsDisplay();
		this.ndviAreaService = new NdviArea();
		this.ndviService = new Ndvi();
		this.platformService = new Platform();

	},
  	beforeUnmount() {
    	if (this.unsubscribe && typeof this.unsubscribe === 'function') {
      		this.unsubscribe();
    	}
  	},   
	methods: {
		reset(){
			location.reload();
		},
		onLayerSelectChange() {
			this.$nextTick(() => {
				const wmsService = new WMS();
				wmsService.resetWMS( );
			});
    	},
		triggerFileUpload() {
			document.getElementById( 'fileUpload' ).click(); // Trigger hidden file input
		},
		handleFileUpload( event ) {
			const file = event.target.files[0];
			if ( file ) {
				const reader = new FileReader();
				reader.onload = ( e ) => {
					try {
						const data = JSON.parse( e.target.result );
						// Process the uploaded data (e.g., display on the map)
						this.processUploadedData( data, file.name.toLowerCase() );
					} catch ( error ) {
						// Handle invalid JSON format
						console.error( 'Error parsing JSON:', error );
						alert( 'Invalid file format. Please select a .json or .geojson file.' );
					}
				};
				reader.readAsText( file );
			}
		},
		processUploadedData( data, fileName ) {
			this.viewer.dataSources.removeAll();
			this.elementsDisplayService.resetSwitches();

			this.setCamera();

			if ( !fileName.includes( 'spotted-helsinki-urban' ) ) {

				alert( 'The uploaded data must be from Spotted Platform!' );

			} else {

				if ( fileName.includes( 'urbangreenindex' ) ) {
					this.platformService.addPlatformFeaturesWithNDVI( data, 'Green Index', fileName );
				}

				if ( fileName.includes( 'urbanheatwaverisk' ) ) {
					this.platformService.addPlatformFeaturesWithRisk( data, 'Heat Risk', fileName );
				}

				if ( fileName.includes( 'urbanheatexposure' ) ) {
					this.platformService.addPlatformFeaturesWithHeat( data, 'Heat Exposure', fileName );
				}

				this.store.fileUploaded = true;

			}

		},
		setCamera() {
			this.viewer.camera.setView( {
				destination : Cesium.Cartesian3.fromDegrees( 24.901745, 60.195464, 33000 ), 
				orientation : {
					heading : Cesium.Math.toRadians( 0.0 ),
					pitch : Cesium.Math.toRadians( -85.0 ),
				}
			} );

		},
		/**
 * Add EventListeners 
 */
		addEventListeners() {
			document.getElementById( 'landCoverToggle' ).addEventListener( 'change', this.getLandCoverEvent );
			document.getElementById( 'PopulationGridToggle' ).addEventListener( 'change', this.populationGridEvent );
			document.getElementById( 'SubDistrictNDVIToggle' ).addEventListener( 'change', this.subDistrictNDVIEvent );
			document.getElementById( 'YLREToggle' ).addEventListener( 'change', this.ylreEvent );
			document.getElementById( 'TreeRegistryToggle' ).addEventListener( 'change', this.treeRegistryEvent );
			document.getElementById( 'areasNDVIToggle' ).addEventListener( 'change', this.wmsNDVIEvent );
			document.getElementById( 'NDVI2023Toggle' ).addEventListener( 'change', this.ndvi2023 );
			document.getElementById( 'showGreenToggle' ).addEventListener( 'change', this.showGreenEvent );
			document.getElementById( 'showNDVIToggle' ).addEventListener( 'change', this.showNDVIEvent );
			document.getElementById( 'showPlotToggle' ).addEventListener( 'change', this.showPlotEvent );
			document.getElementById( 'showTreeToggle' ).addEventListener( 'change', this.showTreeEvent );
			document.getElementById( 'showPlanToggle' ).addEventListener( 'change', this.showPlanEvent );
			document.getElementById( 'showProtectedToggle' ).addEventListener( 'change', this.showProtectedAreaEvent );
			document.getElementById( 'activatePopulationPressureToggle' ).addEventListener( 'change', this.activatePopulationPressureEvent );
			document.getElementById( 'buildingToggle' ).addEventListener( 'change', this.loadBuildings );
			document.getElementById( 'simulationToggle' ).addEventListener( 'change', this.activateSimulations );
			document.getElementById( 'satelliteToggle' ).addEventListener( 'change', this.activateSatellite );
			document.getElementById( 'showForestedAreasToggle' ).addEventListener( 'change', this.showForestedAreasEvent );
			document.getElementById( 'showForestedAreas1mToggle' ).addEventListener( 'change', this.showForestedAreas1mEvent );
			document.getElementById( 'SRToggle' ).addEventListener( 'change', this.srToggleEvent );
			document.getElementById( 'heatMapToggle' ).addEventListener( 'change', this.activateHeatMapEvent );
			document.getElementById( 'heatBlockToggle' ).addEventListener( 'change', this.activateHeatBlockEvent );
		},

		async activateHeatBlockEvent() {

			const checked = document.getElementById( 'heatBlockToggle' ).checked;

			if ( checked ) {
				this.heatMapStore.setUrl('assets/data/hki_blocks.json');
				this.heatMapStore.setCenter([25.095831, 60.197559]);
				this.heatMapStore.setZoom(12);
				this.store.setActiveViewer('OpenLayersHeat');
			    this.showControlPanel = false; // Hide the ControlPanel
                this.viewer.dataSources.removeAll(); // Remove Cesium data sources
                this.viewer.destroy(); // Destroy the Cesium Viewer
                this.viewer = null; // Set the viewer reference to null
				
			}

		},

		async activateHeatMapEvent() {

			const checked = document.getElementById( 'heatMapToggle' ).checked;

			if ( checked ) {
				this.heatMapStore.setUrl('assets/data/Spotted-Kivela-Buildings.json');
				this.heatMapStore.setCenter([24.916831, 60.177559]);
				this.heatMapStore.setZoom(14);
				this.store.setActiveViewer('OpenLayersHeat');
			    this.showControlPanel = false; // Hide the ControlPanel
                this.viewer.dataSources.removeAll(); // Remove Cesium data sources
                this.viewer.destroy(); // Destroy the Cesium Viewer
                this.viewer = null; // Set the viewer reference to null
				
			} 

		},

		async activateSatellite() {

			const checked = document.getElementById( 'satelliteToggle' ).checked;

			if ( checked ) {

				this.store.setActiveViewer('OpenLayersSatellite');
			    this.showControlPanel = false; // Hide the ControlPanel
                this.viewer.dataSources.removeAll(); // Remove Cesium data sources
                this.viewer.destroy(); // Destroy the Cesium Viewer
                this.viewer = null; // Set the viewer reference to null
				

			} 

		},

		async activateSimulations() {

			const checked = document.getElementById( 'simulationToggle' ).checked;

			if ( checked ) {

				const simulationService = new Simulation();
				this.showControlPanel = false;
				this.viewer.dataSources.removeAll();
				simulationService.startSimulation( );

			} else {
                
				this.reset();

			}



		},
		async loadBuildings() {

			const checked = document.getElementById( 'buildingToggle' ).checked;

			if ( checked ) {

				const greenAreasService = new GreenAreas();
				greenAreasService.switchTo3DView( );
				const buildingService = new Building();
				this.store.location = 'building';
				await buildingService.loadBuilding( );
				this.datasourceService.hideDataSourceByName( 'Districts' );
				this.elementsDisplayService.togglePlots( 'hidden' );
				this.elementsDisplayService.setTreeElementsDisplay( 'none' );
				this.elementsDisplayService.setNDVIElementsDisplay( 'none' );
				this.elementsDisplayService.setNDVI2023ElementsDisplay( 'none' );
				this.elementsDisplayService.setPlotElementsDisplay( 'none' );
				this.datasourceService.hideDataSourceByName( 'MajorDistricts' );

			} else {
                
				this.reset();

			}



		},			

		activatePopulationPressureEvent() {

			const checked = document.getElementById( 'activatePopulationPressureToggle' ).checked;

			if ( checked ) {

				this.elementsDisplayService.setPopulationPressureElementsDisplay( 'none' );
				this.elementsDisplayService.setPopulationPressureChildElementsDisplay( 'inline-block' );
				this.viewer.dataSources.removeAll();
				this.store.setLocation( 'pop_pressure' );
				document.getElementById( 'uploadButton' ).style.visibility = 'hidden';

			} else {
                
				this.reset();

			}



		},		

		getLandCoverEvent() {

			const checked = document.getElementById( 'landCoverToggle' ).checked;
			const wmsService = new WMS();

			if ( checked ) {

				this.viewer.imageryLayers.removeAll();

				this.viewer.imageryLayers.add(
			        wmsService.createHSYImageryLayer()
				);


			} else {
                
				wmsService.resetWMS( );

			}



		},


		/**
 * This function shows and hides Helsinki PopulationGrid
 *
 */
		populationGridEvent() {

			const checked = document.getElementById( 'PopulationGridToggle' ).checked;

			if ( checked ) {

				this.store.ndviAreaDataSourceName  = 'PopulationGrid';

				if ( !this.datasourceService.dataSourceWithNameExists( 'PopulationGrid' ) ) {

                eventBus.$emit('loadNdviAreaData', {
                    url: 'https://geo.fvh.fi/spotted/data/hki_populationgrid_with_ndvi.geojson',
                    dataSourceName: 'PopulationGrid',
                    isPolygon: true
                });

				} else {

					this.elementsDisplayService.toggleNDVIArea( 'visible' );
					this.datasourceService.showDataSourceByName( 'PopulationGrid' );

				}

        
			} else {

				this.datasourceService.hideDataSourceByName( 'PopulationGrid' );
				this.elementsDisplayService.toggleNDVIArea( 'hidden' );

			}
		},

		/**
 * This function shows and hides Helsinki SubDistrict with NDVI
 *
 */
		subDistrictNDVIEvent() {

			const subDistrictNDVI = document.getElementById( 'SubDistrictNDVIToggle' ).checked;

			if ( subDistrictNDVI ) {

				this.store.ndviAreaDataSourceName = 'SubDistrictNDVI';

				if ( !this.datasourceService.dataSourceWithNameExists( 'SubDistrictNDVI' ) ) {

                	eventBus.$emit('loadNdviAreaData', {
                    	url: 'https://geo.fvh.fi/spotted/data/HelsinkiSubDistrict.geojson',
                    	dataSourceName: 'SubDistrictNDVI',
                    	isPolygon: true
                	});					

				} else {

					this.elementsDisplayService.toggleNDVIArea( 'visible' );
					this.datasourceService.showDataSourceByName( 'SubDistrictNDVI' );

				}

        
			} else {

				this.datasourceService.hideDataSourceByName( 'SubDistrictNDVI' );
				this.elementsDisplayService.toggleNDVIArea( 'hidden' );
			}
		},

		/**
 * This function shows and hides Helsinki Tree Registry
 *
 */
		async ylreEvent() {

			const checked = document.getElementById( 'YLREToggle' ).checked;

			if ( checked ) {

				this.store.ndviAreaDataSourceName = 'YLRE';

				if ( !this.datasourceService.dataSourceWithNameExists( 'YLRE' ) ) {

					eventBus.$emit('loadYlreAnnualData', {
                    	url: 'https://geo.fvh.fi/spotted/data/ylre_viheralue_with_ndvi.geojson',
                    	dataSourceName: 'YLRE',
                    	isPolygon: true
                	});	

				} else {

					this.datasourceService.showDataSourceByName( 'YLRE' );
					document.getElementById( 'ndviYlreContainer' ).style.visibility = 'visible';
					document.getElementById( 'plotContainer' ).style.visibility = 'visible';

				}

				let dataSource = await this.datasourceService.getDataSourceByName( this.store.ndviAreaDataSourceName );
				if ( dataSource ) {
            
					this.ndviAreaService.dataForHistogram( dataSource.entities.values, 'ndvi_june2023', 'June 2023', this.store.ndviAreaDataSourceName );

				}
        
			} else {

				this.datasourceService.hideDataSourceByName( 'YLRE' );
				document.getElementById( 'ndviYlreContainer' ).style.visibility = 'hidden';
				document.getElementById( 'plotContainer' ).style.visibility = 'hidden';

			}
		},


		/**
 * This function shows and hides Helsinki Tree Registry
 *
 */
		async treeRegistryEvent() {

			const checked = document.getElementById( 'TreeRegistryToggle' ).checked;

			if ( checked ) {

				this.store.ndviAreaDataSourceName = 'TreeRegistry';

				if ( !this.datasourceService.dataSourceWithNameExists( 'TreeRegistry' ) ) {

					eventBus.$emit('loadNdviAreaData', {
                    	url: 'https://geo.fvh.fi/spotted/data/Puurekisteri_piste_with_ndvi.geojson',
                    	dataSourceName: 'TreeRegistry',
                    	isPolygon: false
                	});

				} else {

					this.datasourceService.showDataSourceByName( 'TreeRegistry' );
					this.elementsDisplayService.toggleNDVIArea( 'visible' );

				}
        
			} else {

				this.datasourceService.hideDataSourceByName( 'TreeRegistry' );
				this.elementsDisplayService.toggleNDVIArea( 'hidden' );

			}
		},

		/**
 * This function switches the wms background from Helsinki wms to copernicus wms
 *
 */
		wmsNDVIEvent() {

			const checked = document.getElementById( 'areasNDVIToggle' ).checked;

			if ( checked ) {

				this.store.setLocation( 'ndvi_areas' );
				this.elementsDisplayService.setPopulationPressureElementsDisplay( 'none' );
				document.getElementById( 'uploadButton' ).style.visibility = 'hidden';

				if ( this.store.fileUploaded ) {

					this.viewer.dataSources.removeAll();
					this.elementsDisplayService.togglePlots( 'hidden' );

				} else {

					this.datasourceService.hideDataSourceByName( 'MajorDistricts' );

				}

				this.elementsDisplayService.setAreasNDVIElementsDisplay( 'none' );
				this.elementsDisplayService.setAreasNDVIChildElementsDisplay( 'inline-block' );

			} 
		},

		toggleLayerSelectAndActivateNDVI() {
			// Hide the Helsinki WMS select dropdown
			document.getElementById( 'layerSelect' ).style.display = 'none';
			// Show the Copernicus NDVI select dropdown
			document.getElementById( 'NDVISelect' ).style.display = 'block';
			// Trigger the change event for the NDVISelect to load the "NDVI March" layer
			document.getElementById( 'NDVISelect' ).dispatchEvent( new Event( 'change' ) );
		},

		showHelsinkiWMSAndActivateDefaultLayer() {
			// Show the Helsinki WMS select dropdown
			document.getElementById( 'layerSelect' ).style.display = 'block';
			// Hide the Copernicus NDVI select dropdown
			document.getElementById( 'NDVISelect' ).style.display = 'none';
			// Set the default Helsinki layer (e.g., "avoindata:Opaskartta_Helsinki")
			document.getElementById( 'layerSelect' ).value = 'avoindata:Opaskartta_Helsinki';
			// Trigger the change event for the layerSelect to load the default Helsinki layer
			document.getElementById( 'layerSelect' ).dispatchEvent( new Event( 'change' ) );
		},

		/**
 * This function to show or hide NDVI 2023 entities on the map based on the toggle button state
 *
 */
		async ndvi2023() {

			const checked = document.getElementById( 'NDVI2023Toggle' ).checked;

			if ( checked ) {

				this.elementsDisplayService.setTreeElementsDisplay( 'none' );
				document.getElementById( 'showNDVIToggle' ).disabled = true;
				this.elementsDisplayService.setPieChartVisibility( false );
				await this.ndviService.loadNDVI( '2023-01-27' );
				await this.ndviService.loadNDVI( '2023-02-26' );
				eventBus.$emit('activate2023NDVISlider'); 
				document.getElementById( 'plotContainer' ).style.visibility = 'visible';
				this.loadRemainingNDVIDataSequentially( );

			} else { 

				document.getElementById( 'plotContainer' ).style.visibility = 'hidden';
				document.getElementById( 'ndviSliderContainer2023' ).style.visibility = 'hidden';
				this.elementsDisplayService.setPieChartVisibility( true );
				document.getElementById( 'showNDVIToggle' ).disabled = false;
				await this.datasourceService.hideDataSourceByName( 'ndvi' );
				await this.datasourceService.removeDataSourcesByNamePrefix( 'ndvi' );
				this.elementsDisplayService.setTreeElementsDisplay( 'inline-block' );

			}

		},

		async loadRemainingNDVIDataSequentially() {
			const dates = [ '2023-03-15', '2023-04-22', '2023-05-24', '2023-06-23', '2023-07-13', '2023-08-15', '2023-09-14', '2023-10-29', '2023-11-25', '2023-12-28' ];
			for ( let i = 0; i < dates.length; i++ ) {
				try {
					await this.ndviService.loadNDVI( dates[i] );
				} catch ( error ) {
					console.error( `Failed to load NDVI data for ${dates[i]}:`, error );
					// Handle the error, possibly retry or skip to the next
				}
			}
		},


		/**
 * This function to show or hide protedected area entities on the map based on the toggle button state
 *
 */
		async showProtectedAreaEvent() {

			const checked = document.getElementById( 'showProtectedToggle' ).checked;

			if ( checked ) {

				setPopulationPressureAttributes( '_max', '_area_m2', 'Protected Areas', '_nimi' );
        		eventBus.$emit('loadGreenAreas', 'https://geo.fvh.fi/spotted/data/suojelu.geojson'); 

			} else { 
        
				this.datasourceService.removeDataSourcesByNamePrefix( 'GreenAreas' );
				hideAllPlotsAndSliders();

			}
		},

		/**
 * This function to show or hide planned area entities on the map based on the toggle button state
 *
 */
		async showPlanEvent() {

			const checked = document.getElementById( 'showPlanToggle' ).checked;

			if ( checked ) {

				setPopulationPressureAttributes( '_max', '_area_m2', 'Planned Development', '_plan_name' );
        eventBus.$emit('loadGreenAreas', 'https://geo.fvh.fi/spotted/data/kaava.geojson'); 

			} else { 
        
				this.datasourceService.removeDataSourcesByNamePrefix( 'GreenAreas' );
				hideAllPlotsAndSliders();

			}
		},	


		/**
 * This function to show or hide forested area entities on the map based on the toggle button state
 *
 */
		async srToggleEvent() {

			const checked = document.getElementById( 'SRToggle' ).checked;

			if ( checked ) {


				this.elementsDisplayService.setPopulationPressureElementsDisplay( 'none' );
				this.elementsDisplayService.setAreasNDVIElementsDisplay( 'none' );

				this.store.ndviAreaDataSourceName = 'SR';
				this.datasourceService.hideDataSourceByName( 'MajorDistricts' );
				
				eventBus.$emit('loadSRNdviAreaData', {
                    url: 'https://geo.fvh.fi/spotted/data/hki_subdistricts_sr.geojson',
                    dataSourceName: 'SR'
                });	       
        
			} else {

				this.reset();

			}
		},		

		/**
 * This function to show or hide forested area entities on the map based on the toggle button state
 *
 */
		async showForestedAreas1mEvent() {

			const checked = document.getElementById( 'showForestedAreas1mToggle' ).checked;

			if ( checked ) {

				setPopulationPressureAttributes( '_ndvi_1m', 'fme_ala', 'Forested Areas 1m', '_kuvioid' );
       	 		eventBus.$emit('loadGreenAreas', 'https://geo.fvh.fi/spotted/data/luonnonhoito_1m.geojson'); 

			} else { 
        
				this.datasourceService.removeDataSourcesByNamePrefix( 'GreenAreas' );
				hideAllPlotsAndSliders();

			}
		},			

		/**
 * This function to show or hide forested area entities on the map based on the toggle button state
 *
 */
		async showForestedAreasEvent() {

			const checked = document.getElementById( 'showForestedAreasToggle' ).checked;

			if ( checked ) {

				setPopulationPressureAttributes( '_max', 'fme_ala', 'Forested Areas', '_kuvioid' );
       	 		eventBus.$emit('loadGreenAreas', 'https://geo.fvh.fi/spotted/data/luonnonhoito.geojson'); 

			} else { 
        
				this.datasourceService.removeDataSourcesByNamePrefix( 'GreenAreas' );
				hideAllPlotsAndSliders();

			}
		},

		/**
 * This function to show or hide green area entities on the map based on the toggle button state
 *
 */
		async showGreenEvent() {

			const checked = document.getElementById( 'showGreenToggle' ).checked;

			if ( checked ) {

				setPopulationPressureAttributes( '_max', '_viheralueen_pa', 'YLRE GreenAreas', '_puiston_nimi' );
        		eventBus.$emit('loadGreenAreas', 'https://geo.fvh.fi/spotted/data/ylre.geojson'); 

			} else {

				this.datasourceService.removeDataSourcesByNamePrefix( 'GreenAreas' );
				hideAllPlotsAndSliders();
			}

		},

		/**
 * This function to show or hide NDVI entities on the map based on the toggle button state
 *
 */
		async showNDVIEvent() {
			// Get the state of the showNDVI toggle button
			const checked = document.getElementById( 'showNDVIToggle' ).checked;

			// Get the labels for colors
			const labels = document.querySelectorAll( '.color-label.active' );

			// Rest of your showNDVIEvent function code

			if ( checked ) {

				document.getElementById( 'NDVI2023Toggle' ).disabled = true;

				// Toggle the visibility of the labels
				labels.forEach( label => {
					label.style.display = 'block';
				} );

				this.elementsDisplayService.setTreeElementsDisplay( 'none' );
				this.elementsDisplayService.setElementDisabledState( true );

				if ( this.store.majorDistrict && !this.datasourceService.dataSourceWithNameExists( 'ndvi2018-06-14' ) ) {

					await this.ndviService.loadNDVI( '2018-06-14' );
					eventBus.$emit('activateDistrictNDVI'); 

				} else {

					this.ndviService.updateNDVIDataSources( 0 );

				}

				this.elementsDisplayService.setNDVIVisibility( 'visible' );

			} else {

				document.getElementById( 'NDVI2023Toggle' ).disabled = false;

				// Hide the labels
				labels.forEach( label => {
					label.style.display = 'none';
				} );


				this.elementsDisplayService.setTreeElementsDisplay( 'inline-block' );
				this.elementsDisplayService.setNDVIVisibility( 'hidden' );
				this.elementsDisplayService.setElementDisabledState( false );
				this.datasourceService.hideDataSourceByName( 'ndvi' );

			}
		},

		/**
 * This function is called when the "Display Plot" toggle button is clicked
 *
 */
		showPlotEvent( ) {

			// Get the value of the "Show Plot" toggle button
			const checked = document.getElementById( 'showPlotToggle' ).checked;
    
			// Hide the plot and its controls if the toggle button is unchecked
			if ( !checked ) {

				this.store.showPlot = false;
				this.elementsDisplayService.togglePlots( 'hidden' );
				this.elementsDisplayService.setPlotElementsDisplay( 'none' );

			}

		},

		/**
 * This function handles the toggle event for showing or hiding the tree layer on the map.
 *
 */
		showTreeEvent( ) {

			// Get the current state of the toggle button for showing nature areas.
			const checked = document.getElementById( 'showTreeToggle' ).checked;

			this.plotService.createVegetationBarPlotPerInhabitant( this.store.districtsVisited[ this.store.districtsVisited.length - 1 ] );

			if ( checked ) {

				document.getElementById( 'showNDVIToggle' ).disabled = true;
				this.elementsDisplayService.setNDVIElementsDisplay( 'none' );

				if ( this.store.majorDistrict && !this.datasourceService.dataSourceWithNameExists( 'Trees' ) ) {

					this.treeService.loadTreesSequentially( this.store.majorDistrict );

				} else {

					this.datasourceService.showDataSourceByName( 'Trees' );
				}

			} else {

				document.getElementById( 'showNDVIToggle' ).disabled = false;
				this.datasourceService.hideDataSourceByName( 'Trees' );

				if ( !document.getElementById( 'showTreeToggle' ).checked ) {

					this.elementsDisplayService.setNDVIElementsDisplay( 'inline-block' );
					this.elementsDisplayService.toggleLandCoverBarPlots( 'hidden' );

				}

			}

		},

		handleNDVIAreaSliders() {

			// Get references to all toggle inputs
			const YLREToggle = document.getElementById( 'YLREToggle' );
			const TreeRegistryToggle = document.getElementById( 'TreeRegistryToggle' );
			const PopulationGridToggle = document.getElementById( 'PopulationGridToggle' );
			const SubDistrictNDVIToggle = document.getElementById( 'SubDistrictNDVIToggle' );

			// Add event listeners to each toggle input
			YLREToggle.addEventListener( 'change', async function() {
				if ( YLREToggle.checked ) {
					// Disable other toggles
					TreeRegistryToggle.checked = false;
					PopulationGridToggle.checked = false;
					SubDistrictNDVIToggle.checked = false;
					this.store.ndviAreaDataSourceName = 'YLRE';
					this.datasourceService.hideDataSourceByName( 'TreeRegistry' );
					this.datasourceService.hideDataSourceByName( 'PopulationGrid' );
					this.datasourceService.hideDataSourceByName( 'SubDistrictNDVI' );
					document.getElementById( 'ndviYlre' ).value = 8;
					document.getElementById( 'ndviYlreValue' ).innerHTML = 'June 2023';
					let dataSource = await this.datasourceService.getDataSourceByName( 'YLRE' );
					if ( dataSource ) {
            
						this.ndviAreaService.dataForHistogram( dataSource.entities.values, 'ndvi_june2023', 'June 2023', this.store.ndviAreaDataSourceName );

					}
				}
			} );

			TreeRegistryToggle.addEventListener( 'change', async function() {
				if ( TreeRegistryToggle.checked ) {
					// Disable other toggles
					YLREToggle.checked = false;
					PopulationGridToggle.checked = false;
					SubDistrictNDVIToggle.checked = false;
					this.store.ndviAreaDataSourceName = 'TreeRegistry';
					this.datasourceService.hideDataSourceByName( 'YLRE' );  
					this.datasourceService.hideDataSourceByName( 'PopulationGrid' );
					this.datasourceService.hideDataSourceByName( 'SubDistrictNDVI' );
					await this.ndviAreaUpdate();
				}
			} );

			PopulationGridToggle.addEventListener( 'change', async function() {
				if ( PopulationGridToggle.checked ) {
					// Disable other toggles
					YLREToggle.checked = false;
					TreeRegistryToggle.checked = false;
					SubDistrictNDVIToggle.checked = false;
					this.store.ndviAreaDataSourceName = 'PopulationGrid';
					this.datasourceService.hideDataSourceByName( 'YLRE' );  
					this.datasourceService.hideDataSourceByName( 'TreeRegistry' );
					this.datasourceService.hideDataSourceByName( 'SubDistrictNDVI' );
					await this.ndviAreaUpdate();       
				}
			} );

			SubDistrictNDVIToggle.addEventListener( 'change', async function() {
				if ( SubDistrictNDVIToggle.checked ) {
					// Disable other toggles
					YLREToggle.checked = false;
					TreeRegistryToggle.checked = false;
					PopulationGridToggle.checked = false;
					this.store.ndviAreaDataSourceName = 'SubDistrictNDVI';
					this.datasourceService.hideDataSourceByName( 'YLRE' );  
					this.datasourceService.hideDataSourceByName( 'TreeRegistry' );
					this.datasourceService.hideDataSourceByName( 'PopulationGrid' );
					await this.ndviAreaUpdate();
				}
			} );
  


		},

		async ndviAreaUpdate() {

			document.getElementById( 'ndviArea' ).value = 3;
			document.getElementById( 'ndviAreaValue' ).innerHTML = 'June 2023';
			let dataSource = await this.datasourceService.getDataSourceByName( 'SubDistrictNDVI' );
			if ( dataSource ) {
            
				this.ndviAreaService.dataForHistogram( dataSource.entities.values, 'ndvi_june2023', 'June 2023', this.store.ndviAreaDataSourceName );

			}  
		}   
	},
};

const setPopulationPressureAttributes = (  ndviAttribute, areaAttribute, name, uniqueId  ) => {

	if ( name === 'Forested Areas' ) { 

		areaAttribute * 100000;

	}

	const populationPressureStore = usePopulationStore();
	populationPressureStore.setNdviAttribute( ndviAttribute );
	populationPressureStore.setAreaAttribute( areaAttribute );
	populationPressureStore.setName( name );
	populationPressureStore.setUniqueId( uniqueId );

};

const hideAllPlotsAndSliders = ( ) => {

	document.getElementById( 'printContainer' ).style.visibility = 'hidden';
	document.getElementById( 'plotContainer' ).style.visibility = 'hidden';
	document.getElementById( 'plotPopContainer' ).style.visibility = 'hidden';
	document.getElementById( 'plotInhabitantContainer' ).style.visibility = 'hidden';
	document.getElementById( 'sliderContainer' ).style.visibility = 'hidden';

};

</script>

<style>

#fileUpload {
  /* Optionally, you can style the file input element here */
}

#UIButtonContainer {
	display: flex; /* Use flexbox to arrange items horizontally */
	align-items: center; /* Center vertically */
	float: right;

}

.uiReturnButton {
	background-color: white;
	border: 0px solid black;
	font-family: sans-serif;
	font-size: small;
	text-align: middle;
	padding: 5px;
	margin: 5px;
}

.uiButton {
	background-color: white;
	border: 0px solid black; 

	font-family: sans-serif;
	font-size: small;
	text-align: middle;
	padding: 5px;
	margin: 5px;
	
	float: left;
	
	text-decoration: underline;
}

.uiButton:hover {
	color: rgb(150,150,150);
}

.label {
	background-color: white;
	border: 0px solid black; 

	font-family: sans-serif;
	text-align: middle;
	
	text-decoration: none;
	font-size: small;
}

#controlPanelContainer{
	top: 10px; 
	left: 0px; 

	position: fixed; 
	border: 1px solid black; 
	box-shadow: 3px 5px 5px black; 
	visibility: visible;
	
	background: white;
	padding: 5px;
	
	min-height: 25px;
	
	width: 100%;
}

/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 47px;
  height: 20px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* Global Styles for v-select */
.v-select {
  height: 24px !important;   /* Smaller height */
  width: 240px !important;   /* Smaller height */
}


</style>