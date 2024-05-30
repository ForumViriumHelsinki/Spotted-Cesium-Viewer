<template>
  <div id="controlPanelContainer">

    <div id="UIButtonContainer">
	    <!-- Rest of your UI elements -->
    <button class="uiButton" @click="triggerFileUpload" style="display: block; margin: 10px auto;">
      Upload GeoJSON Dataset
    </button>
    <input type="file" id="fileUpload" accept=".json,.geojson" style="display: none;" @change="handleFileUpload">
      <p class="uiReturnButton" id="returnButton" onClick="prevLevel()" style="color: black;">Previous district</p>
      <p class="uiButton" @click="reset" style="color: red; float:right; cursor: pointer;">Reset</p>
    </div>

  <!-- Selects WMS layer -->
<select id="layerSelect"  style = "float:left;">
  <option value="avoindata:Opaskartta_Helsinki" selected>Opaskartta</option>
  <option value="avoindata:Ortoilmakuva">Ortoilmakuva</option>
  <option value="avoindata:Ortoilmakuva_2022_5cm">Ortoilmakuva 2022</option>
  <option value="avoindata:Ortoilmakuva_2021_5cm">Ortoilmakuva 2021</option>
  <option value="avoindata:Ortoilmakuva_2020">Ortoilmakuva_2020</option>
  <option value="avoindata:Ortoilmakuva_2018">Ortoilmakuva_2018</option>
  <option value="avoindata:Ortoilmakuva_2016">Ortoilmakuva_2016</option>
  <option value="avoindata:Ortoilmakuva_2014">Ortoilmakuva_2014</option>
  <option value="avoindata:Kantakartta">Kantakartta</option>
  <option value="avoindata:Kiinteistokartta">Kiinteistokartta</option>
  <option value="avoindata:Karttasarja_PKS">Karttasarja PKS</option>
  <option value="avoindata:Vaaravariortoilmakuva_2022_5cm">Vääräväriortoilmakuva</option>
  <option value="avoindata:Ajantasa_asemakaava">Asemakaava</option>
  <option value="avoindata:Kaavahakemisto">Kaavahakemisto</option>
  <option value="avoindata:Rakennukset_alue_rekisteritiedot">Rakennukset alue rekisteritiedot</option>
  <option value="avoindata:Tavoitteellinen_viher_ja_virkistysverkosto_VISTRA">Tavoitteellinen viher- ja virkistysverkosto</option>
</select>

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

<!-- showPlanSwitch-->
<label class="switch" id = "showPlanSwitch" >
  <input type="checkbox" id = "showPlanToggle" value = "showPlan" >
  <span class="slider round"></span>
</label>
<label for="showPlanToggle" class="label" id = "showPlanLabel" >Planned areas</label>

<!-- showProtectedSwitch-->
<label class="switch" id = "showProtectedSwitch" >
  <input type="checkbox" id = "showProtectedToggle" value = "showProtected" >
  <span class="slider round"></span>
</label>
<label for="showProtectedToggle" class="label" id = "showProtectedLabel" >Protected areas</label>

<!-- showGreenSwitch-->
<label class="switch" id = "showGreenSwitch" >
  <input type="checkbox" id = "showGreenToggle" value = "showGreen" >
  <span class="slider round"></span>
</label>
<label for="showGreenToggle" class="label" id = "showGreenLabel" >YLRE green areas</label>


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
<label for="YLREToggle" class="label" id = "YLRELabel" style = "display: none">YLRE green areas 2015-2023</label>

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

<!-- NDVI WMS-->
<label class="switch" id = "wmsNDVISwitch" >
  <input type="checkbox" id = "wmsNDVIToggle" value = "wmsNDVI" >
  <span class="slider round"></span>
</label>
<label for="wmsNDVIToggle" class="label" id = "wmsNDVILabel" >NDVI areas</label>

<!--  showLandCover-->
<label class="switch" id = "landCoverSwitch">
  <input type="checkbox" id="landCoverToggle" value="getLandCover" >
  <span class="slider round"></span>
</label>
<label for="landCoverToggle" class="label" id="landCoverLabel">HSY land cover</label>


</div>


</template>

<script>

import WMS from '../services/wms.js';
import EventEmitter from '../services/event-emitter.js';
import Plot from '../services/plot.js';
import { useGlobalStore } from '../stores/global-store.js';
import { usePopulationStore } from '../stores/population-store.js';
import { eventBus } from '../services/event-emitter.js';
import ElementsDisplay from '../services/elements-display.js';
import Datasource from '../services/datasource.js';
import Tree from '../services/tree.js';
import NdviArea from '../services/ndvi-area.js';
import Ndvi from '../services/ndvi.js';
import GreenAreas from '../services/green-areas.js';
import Platform from '../services/platform.js';
import * as Cesium from 'cesium';

export default {
	data() {
		return {
			viewer: null,
			treeService: null,
			plotService: null,
		};
	},
	mounted() {
		this.unsubscribe = eventBus.$on( 'initControlPanel', this.addEventListeners );
		this.store = useGlobalStore();
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
		this.unsubscribe();
	},    
	methods: {
		reset(){
			location.reload();
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

			if ( fileName.includes( 'urbangreenindex' ) ) {
				this.platformService.addPlatformFeaturesWithNDVI( data, 'Spotted Platform Green Index' );
			}

			if ( fileName.includes( 'urbanheatvulnerability' ) ) {
				this.platformService.addPlatformFeaturesWithHeat( data, 'Spotted Platform Heat Risk' );
			}

			if ( fileName.includes( 'urbanheatexposure' ) ) {
				this.platformService.addPlatformFeaturesWithHeat( data, 'Spotted Platform Heat Exposure' );
			}

			this.store.fileUploaded = true;


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
			document.getElementById( 'wmsNDVIToggle' ).addEventListener( 'change', this.wmsNDVIEvent );
			document.getElementById( 'NDVI2023Toggle' ).addEventListener( 'change', this.ndvi2023 );
			document.getElementById( 'showGreenToggle' ).addEventListener( 'change', this.showGreenEvent );
			document.getElementById( 'showNDVIToggle' ).addEventListener( 'change', this.showNDVIEvent );
			document.getElementById( 'showPlotToggle' ).addEventListener( 'change', this.showPlotEvent );
			document.getElementById( 'showTreeToggle' ).addEventListener( 'change', this.showTreeEvent );
			document.getElementById( 'showPlanToggle' ).addEventListener( 'change', this.showPlanEvent );
			document.getElementById( 'showProtectedToggle' ).addEventListener( 'change', this.showProtectedAreaEvent );
			//this.handleNDVIAreaSliders();

		},

		getLandCoverEvent() {

			const landcover = document.getElementById( 'landCoverToggle' ).checked;
			const wmsService = new WMS();

			if ( landcover ) {

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

			const populationGrid = document.getElementById( 'PopulationGridToggle' ).checked;

			if ( populationGrid ) {

				if ( !this.datasourceService.dataSourceWithNameExists( 'PopulationGrid' ) ) {

					this.ndviAreaService.addFeaturesWithNDVI( 'https://geo.fvh.fi/spotted/data/hki_populationgrid_with_ndvi.geojson', 'PopulationGrid', true );

				} else {

					document.getElementById( 'plotContainer' ).style.visibility = 'visible';
					this.datasourceService.showDataSourceByName( 'PopulationGrid' );

				}

				document.getElementById( 'ndviAreaContainer' ).style.display = 'inline-block';
				document.getElementById( 'ndviAreaContainer' ).style.visibility = 'visible';
				this.store.ndviAreaDataSourceName  = 'PopulationGrid';
        
			} else {

				this.datasourceService.hideDataSourceByName( 'PopulationGrid' );
				document.getElementById( 'ndviAreaContainer' ).style.display = 'none';
				document.getElementById( 'plotContainer' ).style.visibility = 'hidden';        

			}
		},

		/**
 * This function shows and hides Helsinki SubDistrict with NDVI
 *
 */
		subDistrictNDVIEvent() {

			const subDistrictNDVI = document.getElementById( 'SubDistrictNDVIToggle' ).checked;

			if ( subDistrictNDVI ) {

				if ( !this.datasourceService.dataSourceWithNameExists( 'SubDistrictNDVI' ) ) {

					this.ndviAreaService.addFeaturesWithNDVI( 'https://geo.fvh.fi/spotted/data/HelsinkiSubDistrict.geojson', 'SubDistrictNDVI', false );

				} else {

					document.getElementById( 'plotContainer' ).style.visibility = 'visible';
					this.datasourceService.showDataSourceByName( 'SubDistrictNDVI' );

				}

				document.getElementById( 'ndviAreaContainer' ).style.display = 'inline-block';
				document.getElementById( 'ndviAreaContainer' ).style.visibility = 'visible';
				this.store.ndviAreaDataSourceName = 'SubDistrictNDVI';
        
			} else {

				this.datasourceService.hideDataSourceByName( 'SubDistrictNDVI' );
				document.getElementById( 'ndviAreaContainer' ).style.display = 'none';
				document.getElementById( 'plotContainer' ).style.visibility = 'hidden'; 
			}
		},

		/**
 * This function shows and hides Helsinki Tree Registry
 *
 */
		async ylreEvent() {

			const ylre = document.getElementById( 'YLREToggle' ).checked;

			if ( ylre ) {

				if ( !this.datasourceService.dataSourceWithNameExists( 'YLRE' ) ) {

					await this.ndviAreaService.addFeaturesWithNDVI( 'https://geo.fvh.fi/spotted/data/ylre_viheralue_with_ndvi.geojson', 'YLRE', true );

				} else {

					this.datasourceService.showDataSourceByName( 'YLRE' );

				}

				document.getElementById( 'ndviYlreContainer' ).style.display = 'inline-block';
				document.getElementById( 'ndviYlreContainer' ).style.visibility = 'visible';
				this.store.ndviAreaDataSourceName = 'YLRE';
				let dataSource = await this.datasourceService.getDataSourceByName( this.store.ndviAreaDataSourceName );
				if ( dataSource ) {
            
					this.ndviAreaService.dataForHistogram( dataSource.entities.values, 'ndvi_june2023', 'June 2023', this.store.ndviAreaDataSourceName );

				}
        
			} else {

				this.datasourceService.hideDataSourceByName( 'YLRE' );
				document.getElementById( 'ndviYlreContainer' ).style.display = 'none';
				document.getElementById( 'plotContainer' ).style.visibility = 'hidden';

			}
		},


		/**
 * This function shows and hides Helsinki Tree Registry
 *
 */
		async treeRegistryEvent() {

			const treeRegistry = document.getElementById( 'TreeRegistryToggle' ).checked;

			if ( treeRegistry ) {

				if ( !this.datasourceService.dataSourceWithNameExists( 'TreeRegistry' ) ) {

					await this.ndviAreaService.addFeaturesWithNDVI( 'https://geo.fvh.fi/spotted/data/Puurekisteri_piste_with_ndvi.geojson', 'TreeRegistry', false );

				} else {

					this.datasourceService.showDataSourceByName( 'TreeRegistry' );
					document.getElementById( 'plotContainer' ).style.visibility = 'visible';

				}

				document.getElementById( 'ndviAreaContainer' ).style.display = 'inline-block';
				document.getElementById( 'ndviAreaContainer' ).style.visibility = 'visible';
				this.store.ndviAreaDataSourceName = 'TreeRegistry';
        
			} else {

				this.datasourceService.hideDataSourceByName( 'TreeRegistry' );
				document.getElementById( 'ndviAreaContainer' ).style.display = 'none';
				document.getElementById( 'plotContainer' ).style.visibility = 'hidden';       

			}
		},

		/**
 * This function switches the wms background from Helsinki wms to copernicus wms
 *
 */
		wmsNDVIEvent() {

			const wmsNDVI = document.getElementById( 'wmsNDVIToggle' ).checked;

			if ( wmsNDVI ) {

				if ( this.store.fileUploaded ) {

					this.viewer.dataSources.removeAll();
					this.elementsDisplayService.togglePlots( 'hidden' );

				} else {

					this.datasourceService.hideDataSourceByName( 'MajorDistricts' );

				}


				document.getElementById( 'wmsNDVISwitch' ).style.display = 'none';
				document.getElementById( 'wmsNDVILabel' ).style.display = 'none';
				document.getElementById( 'showGreenSwitch' ).style.display = 'none';
				document.getElementById( 'showGreenLabel' ).style.display = 'none';
				document.getElementById( 'YLRESwitch' ).style.display = 'inline-block';
				document.getElementById( 'YLRELabel' ).style.display = 'inline-block';
				document.getElementById( 'TreeRegistrySwitch' ).style.display = 'inline-block';
				document.getElementById( 'TreeRegistryLabel' ).style.display = 'inline-block';
				document.getElementById( 'SubDistrictNDVISwitch' ).style.display = 'inline-block';
				document.getElementById( 'SubDistrictNDVILabel' ).style.display = 'inline-block';
				document.getElementById( 'PopulationGridSwitch' ).style.display = 'inline-block';
				document.getElementById( 'PopulationGridLabel' ).style.display = 'inline-block';

				//    toggleLayerSelectAndActivateNDVI();

			} else { 

				// showHelsinkiWMSAndActivateDefaultLayer();
				this.datasourceServic.showDataSourceByName( 'MajorDistricts' );


				document.getElementById( 'showGreenSwitch' ).style.display = 'inline-block';
				document.getElementById( 'showGreenLabel' ).style.display = 'inline-block';
				document.getElementById( 'YLRESwitch' ).style.display = 'none';
				document.getElementById( 'YLRELabel' ).style.display = 'none';
				document.getElementById( 'TreeRegistrySwitch' ).style.display = 'none';
				document.getElementById( 'TreeRegistryLabel' ).style.display = 'none';
				document.getElementById( 'SubDistrictNDVISwitch' ).style.display = 'none';
				document.getElementById( 'SubDistrictNDVILabel' ).style.display = 'none';
				document.getElementById( 'printContainer' ).style.display = 'none';
				document.getElementById( 'PopulationGridSwitch' ).style.display = 'none';
				document.getElementById( 'PopulationGridLabel' ).style.display = 'none';  
				this.datasourceServic.hideDataSourceByName( 'YLRE' );  
				this.datasourceServic.hideDataSourceByName( 'TreeRegistry' );
				this.datasourceServic.hideDataSourceByName( 'PopulationGrid' );
				this.datasourceServic.hideDataSourceByName( 'SubDistrictNDVI' );

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

			const NDVI2023 = document.getElementById( 'NDVI2023Toggle' ).checked;

			const elements = [
				'showTreesSwitch',
				'showTreesLabel'
			];

			if ( NDVI2023 ) {

				this.elementsDisplayService.setElementsDisplay( elements, 'none' );
				document.getElementById( 'showNDVIToggle' ).disabled = true;
				document.getElementById( 'plotPieContainer' ).style.visibility = 'hidden';
				document.getElementById( 'sliderContainer' ).style.visibility = 'hidden';
				document.getElementById( 'plotSelect' ).style.visibility = 'hidden';
				await this.ndviService.loadNDVI( '2023-01-27' );
				await this.ndviService.loadNDVI( '2023-02-26' );
				const slider = document.getElementById( 'ndviSlider2023' );
				slider.max = Math.max( 1, 11 );

				if ( document.getElementById( 'showPlotToggle' ).checked ) {
            
					document.getElementById( 'ndviSliderContainer2023' ).style.display = 'inline-block';

				}

				this.loadRemainingNDVIDataSequentially( );

			} else { 

				// updateNDVIDataSources2023( );
				document.getElementById( 'showNDVIToggle' ).disabled = false;
				document.getElementById( 'ndviSliderContainer2023' ).style.display = 'none';
				document.getElementById( 'plotContainer' ).style.visibility = 'hidden';
				await this.datasourceService.hideDataSourceByName( 'ndvi' );
				await this.datasourceService.removeDataSourcesByNamePrefix( 'ndvi' );
				this.elementsDisplayService.setElementsDisplay( elements, 'inline-block' );

			}

		},

		async loadRemainingNDVIDataSequentially() {
			const dates = [ '2023-03-15', '2023-04-22', '2023-05-24', '2023-06-23', '2023-07-13', '2023-08-15', '2023-09-14', '2023-10-29', '2023-11-25', '2023-12-28' ];
			for ( let i = 0; i < dates.length; i++ ) {
				try {
					await this.ndviService.loadNDVI( dates[i] );
					this.unlockSliderPoint( i + 2 ); // Assuming the first two points are already loaded
				} catch ( error ) {
					console.error( `Failed to load NDVI data for ${dates[i]}:`, error );
					// Handle the error, possibly retry or skip to the next
				}
			}
		},

		unlockSliderPoint( index ) {
			const slider = document.getElementById( 'ndviSlider2023' );
			slider.max = Math.max( index, slider.max ); // Ensure the slider's max is updated only if it's increasing
		},

		/**
 * This function to show or hide green area entities on the map based on the toggle button state
 *
 */
		async showProtectedAreaEvent() {

			const showProtected = document.getElementById( 'showProtectedToggle' ).checked;

			if ( showProtected ) {

				this.viewer.dataSources.removeAll();
				const greenAreasService = new GreenAreas();
				setPopulationPressureAttributes( '_max', '_area_m2', 'Protected Areas', '_nimi' );
				this.store.setLocation( 'pop_pressure' );
				await greenAreasService.loadGreenAreas( 'https://geo.fvh.fi/spotted/data/suojelu.geojson' );

			} else { 
        
				this.reset();

			}
		},

		/**
 * This function to show or hide green area entities on the map based on the toggle button state
 *
 */
		async showPlanEvent() {

			const showPlan = document.getElementById( 'showPlanToggle' ).checked;

			if ( showPlan ) {

				this.viewer.dataSources.removeAll();
				const greenAreasService = new GreenAreas();
				setPopulationPressureAttributes( '_max', '_area_m2', 'Planned Development', '_plan_name' );
				this.store.setLocation( 'pop_pressure' );
				await greenAreasService.loadGreenAreas( 'https://geo.fvh.fi/spotted/data/kaava.geojson' );

			} else { 
        
				this.reset();

			}
		},

		/**
 * This function to show or hide green area entities on the map based on the toggle button state
 *
 */
		async showGreenEvent() {

			const showGreen = document.getElementById( 'showGreenToggle' ).checked;

			if ( showGreen ) {

				this.viewer.dataSources.removeAll();
				const greenAreasService = new GreenAreas();
				this.store.setLocation( 'pop_pressure' );
				setPopulationPressureAttributes( '_max', '_viheralueen_pa', 'YLRE GreenAreas', '_puiston_nimi' );
				await greenAreasService.loadGreenAreas( 'https://geo.fvh.fi/spotted/data/ylre.geojson' );

			} else { 
        
				this.reset();

			}

		},

		/**
 * This function to show or hide NDVI entities on the map based on the toggle button state
 *
 */
		async showNDVIEvent() {
			// Get the state of the showNDVI toggle button
			const showNDVI = document.getElementById( 'showNDVIToggle' ).checked;

			// Get the labels for colors
			const labels = document.querySelectorAll( '.color-label.active' );

			const elements = [
				'showTreesSwitch',
				'showTreesLabel'
			];

			// Rest of your showNDVIEvent function code

			if ( showNDVI ) {

				document.getElementById( 'NDVI2023Toggle' ).disabled = true;

				// Toggle the visibility of the labels
				labels.forEach( label => {
					label.style.display = 'block';
				} );

				this.elementsDisplayService.setElementsDisplay( elements, 'none' );
				this.elementsDisplayService.setElementDisabledState( true );

				if ( this.store.majorDistrict && !this.datasourceService.dataSourceWithNameExists( 'ndvi2018-06-14' ) ) {

					await this.ndviService.loadNDVI( '2018-06-14' );

				} else {

					this.ndviService.updateNDVIDataSources( );

				}

			} else {

				document.getElementById( 'NDVI2023Toggle' ).disabled = false;

				// Hide the labels
				labels.forEach( label => {
					label.style.display = 'none';
				} );


				this.elementsDisplayService.setElementsDisplay( elements, 'inline-block' );
				document.getElementById( 'plotContainer' ).style.visibility = 'hidden';
				document.getElementById( 'ndviSliderContainer' ).style.visibility = 'hidden';
				this.elementsDisplayService.setElementDisabledState( false );
				this.datasourceService.hideDataSourceByName( 'ndvi' );

			}
		},



		/**
 * This function returns only if all hsy land cover
 */
		statusOfHSYToggles( ) {

			if ( !document.getElementById( 'showTreeToggle' ).checked ) {

				return false;
			}
    
			return true;
		},


		/**
 * This function to shows all datasources to user.
 *
 */
		showAllDataSources( ) {

			// Set the show property of all data sources to true to show the entities
			this.viewer.dataSources._dataSources.forEach( function( dataSource ) {

				dataSource.show = true;

			} );  
		},

		/**
 * This function is called when the Object details button is clicked
 *
 */
		printEvent( ) {

			console.log( 'Set the print to: ' + String( document.getElementById( 'printToggle' ).checked ) );
			const print = document.getElementById( 'printToggle' ).checked;

			// If print is not selected, hide the print container, search container, georeference container, and search button
			if ( !print ) {

				document.getElementById( 'printContainer' ).style.visibility = 'hidden';

			} else { // Otherwise, make the print container visible

				document.getElementById( 'printContainer' ).style.visibility = 'visible';

			}

		},

		/**
 * This function is called when the "Display Plot" toggle button is clicked
 *
 */
		showPlotEvent( ) {

			// Get the value of the "Show Plot" toggle button
			const showPlots = document.getElementById( 'showPlotToggle' ).checked;
    
			// Hide the plot and its controls if the toggle button is unchecked
			if ( !showPlots ) {

				this.store.showPlot = false;
				this.elementsDisplayService.togglePlots( 'hidden' );
				const elements = [
        			'showPlotSwitch',
        			'showPlotLabel'
    			];
				this.elementsDisplayService.setElementsDisplay( elements, 'none' );

			}

		},

		/**
 * This function handles the toggle event for showing or hiding the tree layer on the map.
 *
 */
		showTreeEvent( ) {

			const elements = [
				'showNDVISwitch',
				'showNDVILabel'
			];

			// Get the current state of the toggle button for showing nature areas.
			const showTree = document.getElementById( 'showTreeToggle' ).checked;

			this.plotService.createVegetationBarPlotPerInhabitant( this.store.districtsVisited[ this.store.districtsVisited.length - 1 ] );

			if ( showTree ) {

				document.getElementById( 'showNDVIToggle' ).disabled = true;
				this.elementsDisplayService.setElementsDisplay( elements, 'none' );

				if ( this.store.majorDistrict && !this.datasourceService.dataSourceWithNameExists( 'Trees' ) ) {

					this.treeService.loadTreesSequentially( this.store.majorDistrict );

				} else {

					this.datasourceService.showDataSourceByName( 'Trees' );
				}

			} else {

				document.getElementById( 'showNDVIToggle' ).disabled = false;
				this.datasourceService.hideDataSourceByName( 'Trees' );

				if ( !this.areAnySwitchesOn() ) {

					this.elementsDisplayService.setElementsDisplay( elements, 'inline-block' );
					this.elementsDisplayService.toggleLandCoverBarPlots( 'hidden' );

				}

			}

		},

		areAnySwitchesOn() {
			// List of switch IDs to check
			const switchIds = [
				'showTreeToggle'
			];

			// Loop through the switch IDs and check if any are on
			for ( const switchId of switchIds ) {
				const switchElement = document.getElementById( switchId );
				if ( switchElement && switchElement.checked ) {

					return true; // At least one switch is on, so return true
				}

			}

			return false; // No switches are on, so return false
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
					document.getElementById( 'ndviAreaContainer' ).style.display = 'none';
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

			document.getElementById( 'ndviYlreContainer' ).style.display = 'none';
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

	const populationPressureStore = usePopulationStore();
	populationPressureStore.setNdviAttribute( ndviAttribute );
	populationPressureStore.setAreaAttribute( areaAttribute );
	populationPressureStore.setName( name );
	populationPressureStore.setUniqueId( uniqueId );

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

</style>