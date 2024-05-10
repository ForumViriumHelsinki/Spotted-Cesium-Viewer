<template>
  <div id="controlPanelContainer">

    <p class="header">Spotted Viewer</p>
    <p class="uiReturnButton" id="returnButton" style="color: black;">Previous district</p>
    <p class="uiButton" @click="reset" style="color: red; float:right; cursor: pointer;">Reset</p>
    <!-- Rest of your UI elements -->

  <!-- Selects WMS layer -->
<select id="layerSelect">
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

<!-- showPrintSwitch-->

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

    <div id="plotContainer">
  </div>

  <div id="printContainer"  style = "display: none">
    <i></i>
    </div>
        <!-- Labels for colors -->
        <label class="color-label white-label active" style = "display: none" id = "white-label"> -1 - 0</label>
        <label class="color-label yellow-label active" style = "display: none" id = "yellow-label">0 - 0.1</label>
        <label class="color-label yellowgreen-label active" style = "display: none" id = "yellowgreen-label">0.1 - 0.2</label>
        <label class="color-label lightgreen-label active" style = "display: none" id = "lightgreen-label">0.2 - 0.3</label>
        <label class="color-label green-label active" style = "display: none" id = "green-label">0.3 - 0.4</label>
        <label class="color-label ldarkgreen-label active" style = "display: none" id = "ldarkgreen-label">0.4 - 0.5</label>
        <label class="color-label darkgreen-label active" style = "display: none" id = "darkgreen-label">0.5 - 0.6</label>
        <label class="color-label vdarkgreen-label active" style = "display: none" id = "vdarkgreen-label">0.6 - 1</label>
  <div id="plotInhabitantContainer">
  </div>
  <div id="greenAreaContainer">
  </div>  
  <div id="plotPieContainer">
    <div id="selectContainer">
        <select id="plotSelect">
            <option value="Helsinki">Helsinki</option>
        </select>
    </div>
    <!-- Other content of the plot container -->
</div>

<div class="ndviSlider-container" id="ndviSliderContainer">
  <input type="range" id="ndviSlider" min="0" max="2" value="0">
  <span id="ndviSliderValue">NDVI</span>
</div>

<div class="ndviArea-container" id="ndviAreaContainer">
  <input type="range" id="ndviArea" min="0" max="7" value="3">
  <div class="slider-ticks-container"></div> <!-- Container for tick marks -->
    <span id="ndviAreaValue">June 2023</span>
</div>

<div class="ndviSlider-container2023" id="ndviSliderContainer2023">
  <input type="range" id="ndviSlider2023" min="0" max="11" value="0">
  <div class="slider-ticks-container"></div> <!-- Container for tick marks -->
</div>

<div class="ndviYlre-container" id="ndviYlreContainer">
  <input type="range" id="ndviYlre" min="0" max="8" value="8">
  <div class="slider-ticks-container"></div> <!-- Container for tick marks -->
    <span id="ndviYlreValue">June 2023</span>
</div>

<div class="slider-container" id="sliderContainer">
  <input type="range" id="blueSlider" min="0" max="5" value="0">
  <span id="sliderValue">distance from green area 0 km</span>
</div>


</template>

<script>

import WMS from '../services/wms.js';
import EventEmitter from '../services/event-emitter.js';
import Plot from '../services/plot.js';
import { useGlobalStore } from '../stores/global-store.js';
import { eventBus } from '../services/event-emitter.js';
import ElementsDisplay from '../services/elements-display.js';
import Datasource from '../services/datasource.js';
import Tree from '../services/tree.js';

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
        console.log("viewer", this.viewer)
		this.eventEmitterService = new EventEmitter();
        this.plotService = new Plot();
        this.treeService = new Tree();
        this.datasourceService = new Datasource();
        this.elementsDisplayService = new ElementsDisplay();

	},
	beforeUnmount() {
		this.unsubscribe();
	},    
	methods: {
		reset(){
			location.reload();
		},
		/**
 * Add EventListeners 
 */
		addEventListeners() {
            console.log("hi")
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
            //this.handleNDVIAreaSliders();

		},

getLandCoverEvent() {

			const landcover = document.getElementById( 'landCoverToggle' ).checked;
            const wmsService = new WMS();

			if ( landcover ) {

                this.store.viewer.imageryLayers.removeAll();

				this.store.viewer.imageryLayers.add(
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

    const populationGrid = document.getElementById( "PopulationGridToggle" ).checked;

    if ( populationGrid ) {

        if ( !dataSourceWithNameExists( "PopulationGrid" ) ) {

            addFeaturesWithNDVI( "https://geo.fvh.fi/spotted/data/hki_populationgrid_with_ndvi.geojson", "PopulationGrid", true );

        } else {

            document.getElementById( "plotContainer" ).style.visibility = 'visible';
            showDataSourceByName( "PopulationGrid" );

        }

        document.getElementById('ndviAreaContainer').style.display = 'inline-block';
        document.getElementById('ndviAreaContainer').style.visibility = 'visible';
        ndviAreaDataSourceName = "PopulationGrid";
        
    } else {

        hideDataSourceByName( "PopulationGrid" );
        document.getElementById('ndviAreaContainer').style.display = 'none';
        document.getElementById( "plotContainer" ).style.visibility = 'hidden';        

    }
},

/**
 * This function shows and hides Helsinki SubDistrict with NDVI
 *
 */
 subDistrictNDVIEvent() {

    const subDistrictNDVI = document.getElementById( "SubDistrictNDVIToggle" ).checked;

    if ( subDistrictNDVI ) {

        if ( !dataSourceWithNameExists( "SubDistrictNDVI" ) ) {

            addFeaturesWithNDVI( "https://geo.fvh.fi/spotted/data/HelsinkiSubDistrict.geojson", "SubDistrictNDVI", false );

        } else {

            document.getElementById( "plotContainer" ).style.visibility = 'visible';
            showDataSourceByName( "SubDistrictNDVI" );

        }

        document.getElementById('ndviAreaContainer').style.display = 'inline-block';
        document.getElementById('ndviAreaContainer').style.visibility = 'visible';
        ndviAreaDataSourceName = "SubDistrictNDVI";
        
    } else {

        hideDataSourceByName( "SubDistrictNDVI" );
        document.getElementById('ndviAreaContainer').style.display = 'none';
        document.getElementById( "plotContainer" ).style.visibility = 'hidden'; 
    }
},

/**
 * This function shows and hides Helsinki Tree Registry
 *
 */
async ylreEvent() {

    const ylre = document.getElementById( "YLREToggle" ).checked;

    console.log("ylre")

    if ( ylre ) {

        if ( !dataSourceWithNameExists( "YLRE" ) ) {

            addFeaturesWithNDVI( "https://geo.fvh.fi/spotted/data/ylre_viheralue_with_ndvi.geojson", "YLRE", true );

        } else {

            showDataSourceByName( "YLRE" );

        }

        document.getElementById('ndviYlreContainer').style.display = 'inline-block';
        document.getElementById('ndviYlreContainer').style.visibility = 'visible';
        ndviAreaDataSourceName = "YLRE";
        let dataSource = await getDataSourceByName( ndviAreaDataSourceName );
        if ( dataSource ) {
            
            dataForHistogram( dataSource.entities.values, 'ndvi_june2023', 'June 2023');

        }
        
    } else {

        hideDataSourceByName( "YLRE" );
        document.getElementById('ndviYlreContainer').style.display = 'none';
        document.getElementById( "plotContainer" ).style.visibility = 'hidden';

    }
},


/**
 * This function shows and hides Helsinki Tree Registry
 *
 */
treeRegistryEvent() {

    const treeRegistry = document.getElementById( "TreeRegistryToggle" ).checked;

    if ( treeRegistry ) {

        if ( !dataSourceWithNameExists( "TreeRegistry" ) ) {

            addFeaturesWithNDVI( "https://geo.fvh.fi/spotted/data/Puurekisteri_piste_with_ndvi.geojson", "TreeRegistry", false );

        } else {

            showDataSourceByName( "TreeRegistry" );
            document.getElementById( "plotContainer" ).style.visibility = 'visible';

        }

        document.getElementById('ndviAreaContainer').style.display = 'inline-block';
        document.getElementById('ndviAreaContainer').style.visibility = 'visible';
        ndviAreaDataSourceName = "TreeRegistry";
        
    } else {

        hideDataSourceByName( "TreeRegistry" );
        document.getElementById('ndviAreaContainer').style.display = 'none';
        document.getElementById( "plotContainer" ).style.visibility = 'hidden';       

    }
},

/**
 * This function switches the wms background from Helsinki wms to copernicus wms
 *
 */
wmsNDVIEvent() {

    const wmsNDVI = document.getElementById( "wmsNDVIToggle" ).checked;

    if ( wmsNDVI ) {

        hideDataSourceByName( "MajorDistricts" );

        document.getElementById( "wmsNDVISwitch" ).style.display = 'none';
        document.getElementById( "wmsNDVILabel" ).style.display = 'none';
        document.getElementById( "showGreenSwitch" ).style.display = 'none';
        document.getElementById( "showGreenLabel" ).style.display = 'none';
        document.getElementById( "YLRESwitch" ).style.display = 'inline-block';
        document.getElementById( "YLRELabel" ).style.display = 'inline-block';
        document.getElementById( "TreeRegistrySwitch" ).style.display = 'inline-block';
        document.getElementById( "TreeRegistryLabel" ).style.display = 'inline-block';
        document.getElementById( "SubDistrictNDVISwitch" ).style.display = 'inline-block';
        document.getElementById( "SubDistrictNDVILabel" ).style.display = 'inline-block';
        document.getElementById( "PopulationGridSwitch" ).style.display = 'inline-block';
        document.getElementById( "PopulationGridLabel" ).style.display = 'inline-block';

    //    toggleLayerSelectAndActivateNDVI();

    } else { 

        // showHelsinkiWMSAndActivateDefaultLayer();
        showDataSourceByName( "MajorDistricts" );


        document.getElementById( "showGreenSwitch" ).style.display = 'inline-block';
        document.getElementById( "showGreenLabel" ).style.display = 'inline-block';
        document.getElementById( "YLRESwitch" ).style.display = 'none';
        document.getElementById( "YLRELabel" ).style.display = 'none';
        document.getElementById( "TreeRegistrySwitch" ).style.display = 'none';
        document.getElementById( "TreeRegistryLabel" ).style.display = 'none';
        document.getElementById( "SubDistrictNDVISwitch" ).style.display = 'none';
        document.getElementById( "SubDistrictNDVILabel" ).style.display = 'none';
        document.getElementById( "printContainer" ).style.display = 'none';
        document.getElementById( "PopulationGridSwitch" ).style.display = 'none';
        document.getElementById( "PopulationGridLabel" ).style.display = 'none';  
        hideDataSourceByName( "YLRE" );  
        hideDataSourceByName( "TreeRegistry" );
        hideDataSourceByName( "PopulationGrid" );
        hideDataSourceByName( "SubDistrictNDVI" );

    }
},

toggleLayerSelectAndActivateNDVI() {
    // Hide the Helsinki WMS select dropdown
    document.getElementById('layerSelect').style.display = 'none';
    // Show the Copernicus NDVI select dropdown
    document.getElementById('NDVISelect').style.display = 'block';
    // Trigger the change event for the NDVISelect to load the "NDVI March" layer
    document.getElementById('NDVISelect').dispatchEvent(new Event('change'));
},

showHelsinkiWMSAndActivateDefaultLayer() {
    // Show the Helsinki WMS select dropdown
    document.getElementById('layerSelect').style.display = 'block';
    // Hide the Copernicus NDVI select dropdown
    document.getElementById('NDVISelect').style.display = 'none';
    // Set the default Helsinki layer (e.g., "avoindata:Opaskartta_Helsinki")
    document.getElementById('layerSelect').value = 'avoindata:Opaskartta_Helsinki';
    // Trigger the change event for the layerSelect to load the default Helsinki layer
    document.getElementById('layerSelect').dispatchEvent(new Event('change'));
},

/**
 * This function to show or hide NDVI 2023 entities on the map based on the toggle button state
 *
 */
async ndvi2023() {

    const NDVI2023 = document.getElementById( "NDVI2023Toggle" ).checked;

    const elements = [
        'showTreesSwitch',
        'showTreesLabel'
    ];

    if ( NDVI2023 ) {

        setElementsDisplay( elements, 'none' );
        document.getElementById("showNDVIToggle").disabled = true;
        document.getElementById( "plotPieContainer" ).style.visibility = 'hidden';
        document.getElementById( "sliderContainer" ).style.visibility = 'hidden';
        document.getElementById( "plotSelect" ).style.visibility = 'hidden';
        await loadNDVI( '2023-01-27' );
        await loadNDVI( '2023-02-26' );
        const slider = document.getElementById('ndviSlider2023');
        slider.max = Math.max(1, 11);

        if ( document.getElementById( "showPlotToggle" ).checked ) {
            
            document.getElementById('ndviSliderContainer2023').style.display = 'inline-block';

        }

        loadRemainingNDVIDataSequentially( );

    } else { 

        // updateNDVIDataSources2023( );
        document.getElementById("showNDVIToggle").disabled = false;
        document.getElementById('ndviSliderContainer2023').style.display = 'none';
        document.getElementById( 'plotContainer' ).style.visibility = 'hidden';
        await hideDataSourceByName( "ndvi" );
        await removeDataSourcesByNamePrefix("ndvi");
        setElementsDisplay( elements, 'inline-block' );

    }

},

async loadRemainingNDVIDataSequentially() {
    const dates = [ '2023-03-15', '2023-04-22', '2023-05-24', '2023-06-23', '2023-07-13', '2023-08-15', '2023-09-14', '2023-10-29', '2023-11-25', '2023-12-28' ];
    for (let i = 0; i < dates.length; i++) {
        try {
            await loadNDVI(dates[i]);
            unlockSliderPoint(i + 2); // Assuming the first two points are already loaded
        } catch (error) {
            console.error(`Failed to load NDVI data for ${dates[i]}:`, error);
            // Handle the error, possibly retry or skip to the next
        }
    }
},

unlockSliderPoint(index) {
    const slider = document.getElementById('ndviSlider2023');
    slider.max = Math.max(index, slider.max); // Ensure the slider's max is updated only if it's increasing
},

/**
 * This function to show or hide green area entities on the map based on the toggle button state
 *
 */
showGreenEvent() {

    const showGreen = document.getElementById( "showGreenToggle" ).checked;

    if ( showGreen ) {

        loadGreenAreas();

    } else { 
        
        hideDataSourceByName( "GreenAreas" );
        document.getElementById( "plotPieContainer" ).style.visibility = 'hidden';
        document.getElementById( "sliderContainer" ).style.visibility = 'hidden';

    }

},

/**
 * This function to show or hide NDVI entities on the map based on the toggle button state
 *
 */
async showNDVIEvent() {
    // Get the state of the showNDVI toggle button
    const showNDVI = document.getElementById( "showNDVIToggle" ).checked;

    // Get the labels for colors
    const labels = document.querySelectorAll( ".color-label.active" );

    const elements = [
        'showTreesSwitch',
        'showTreesLabel'
    ];

    // Rest of your showNDVIEvent function code

    if ( showNDVI ) {

        document.getElementById("NDVI2023Toggle").disabled = true;

        // Toggle the visibility of the labels
        labels.forEach( label => {
            label.style.display = "block";
        });

        setElementsDisplay( elements, 'none' );
        setElementDisabledState( true );

        if ( majorDistrict && !dataSourceWithNameExists( "ndvi2018-06-14" )) {

            await loadNDVI( '2018-06-14' );
            await loadNDVI( '2020-06-21' );
            await loadNDVI( '2022-06-26' );

        } else {

            updateNDVIDataSources( );

        }

    } else {

        document.getElementById("NDVI2023Toggle").disabled = false;

        // Hide the labels
        labels.forEach( label => {
            label.style.display = "none";
        } );


        setElementsDisplay( elements, 'inline-block' );
        document.getElementById( "plotContainer" ).style.visibility = 'hidden';
        document.getElementById( 'ndviSliderContainer' ).style.visibility = 'hidden';
        setElementDisabledState( false );
        hideDataSourceByName( "ndvi" );

    }
},



/**
 * This function returns only if all hsy land cover
 */
statusOfHSYToggles( ) {

    if ( !document.getElementById( "showTreeToggle" ).checked ) {

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
    viewer.dataSources._dataSources.forEach( function( dataSource ) {

        dataSource.show = true;

    });  
},

/**
 * This function is called when the Object details button is clicked
 *
 */
 printEvent( ) {

    console.log( "Set the print to: " + String( document.getElementById( "printToggle" ).checked ) );
    const print = document.getElementById( "printToggle" ).checked;

    // If print is not selected, hide the print container, search container, georeference container, and search button
    if ( !print ) {

        document.getElementById( 'printContainer' ).style.visibility = 'hidden';

    } else { // Otherwise, make the print container visible

        setPrintVisible( );

    }

},

/**
 * This function is called when the "Display Plot" toggle button is clicked
 *
 */
showPlotEvent( ) {

    // Get the value of the "Show Plot" toggle button
    const showPlots = document.getElementById( "showPlotToggle" ).checked;
    
    // Hide the plot and its controls if the toggle button is unchecked
    if ( !showPlots ) {

        this.store.showPlot = false;
        togglePlots( 'hidden' );

    } else { // Otherwise, show the plot and its controls if the toggle button is checked and the plot is already loaded

        togglePlots( 'visible' );
        this.storeshowPlot = true;

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
    const showTree = document.getElementById( "showTreeToggle" ).checked;

    this.plotService.createVegetationBarPlotPerInhabitant( this.store.districtsVisited[ this.store.districtsVisited.length - 1 ] );

    if ( showTree ) {

        document.getElementById("showNDVIToggle").disabled = true;
        this.elementsDisplayService.setElementsDisplay( elements, 'none' );

        if ( this.store.majorDistrict && !dataSourceWithNameExists( "Trees" ) ) {

            this.treeService.loadTreesSequentially( this.store.majorDistrict );

        } else {

            this.datasourceService.showDataSourceByName( "Trees" );
        }

    } else {

        document.getElementById("showNDVIToggle").disabled = false;
        this.datasourceService.hideDataSourceByName( "Trees" );

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
    for (const switchId of switchIds) {
        const switchElement = document.getElementById(switchId);
        if ( switchElement && switchElement.checked ) {

            return true; // At least one switch is on, so return true
        }

    }

    return false; // No switches are on, so return false
},

handleNDVIAreaSliders() {

// Get references to all toggle inputs
const YLREToggle = document.getElementById('YLREToggle');
const TreeRegistryToggle = document.getElementById('TreeRegistryToggle');
const PopulationGridToggle = document.getElementById('PopulationGridToggle');
const SubDistrictNDVIToggle = document.getElementById('SubDistrictNDVIToggle');

// Add event listeners to each toggle input
YLREToggle.addEventListener('change', async function() {
    if (YLREToggle.checked) {
        // Disable other toggles
        TreeRegistryToggle.checked = false;
        PopulationGridToggle.checked = false;
        SubDistrictNDVIToggle.checked = false;
        ndviAreaDataSourceName = "YLRE";
        hideDataSourceByName( "TreeRegistry" );
        hideDataSourceByName( "PopulationGrid" );
        hideDataSourceByName( "SubDistrictNDVI" );
        document.getElementById('ndviAreaContainer').style.display = 'none';
        document.getElementById('ndviYlre').value = 8;
        document.getElementById('ndviYlreValue').innerHTML = "June 2023";
        let dataSource = await getDataSourceByName( "YLRE" );
        if ( dataSource ) {
            
            dataForHistogram( dataSource.entities.values, 'ndvi_june2023', 'June 2023');

        }
    }
});

TreeRegistryToggle.addEventListener('change', async function() {
    if (TreeRegistryToggle.checked) {
        // Disable other toggles
        YLREToggle.checked = false;
        PopulationGridToggle.checked = false;
        SubDistrictNDVIToggle.checked = false;
        ndviAreaDataSourceName = "TreeRegistry";
        hideDataSourceByName( "YLRE" );  
        hideDataSourceByName( "PopulationGrid" );
        hideDataSourceByName( "SubDistrictNDVI" );
        await ndviAreaUpdate();
    }
});

PopulationGridToggle.addEventListener('change', async function() {
    if (PopulationGridToggle.checked) {
        // Disable other toggles
        YLREToggle.checked = false;
        TreeRegistryToggle.checked = false;
        SubDistrictNDVIToggle.checked = false;
        ndviAreaDataSourceName = "PopulationGrid";
        hideDataSourceByName( "YLRE" );  
        hideDataSourceByName( "TreeRegistry" );
        hideDataSourceByName( "SubDistrictNDVI" );
        await ndviAreaUpdate();       
    }
});

SubDistrictNDVIToggle.addEventListener('change', async function() {
    if (SubDistrictNDVIToggle.checked) {
        // Disable other toggles
        YLREToggle.checked = false;
        TreeRegistryToggle.checked = false;
        PopulationGridToggle.checked = false;
        ndviAreaDataSourceName = "SubDistrictNDVI";
        hideDataSourceByName( "YLRE" );  
        hideDataSourceByName( "TreeRegistry" );
        hideDataSourceByName( "PopulationGrid" );
        await ndviAreaUpdate();
    }
});
  


},

async ndviAreaUpdate() {

        document.getElementById('ndviYlreContainer').style.display = 'none';
        document.getElementById('ndviArea').value = 3;
        document.getElementById('ndviAreaValue').innerHTML = "June 2023";
        let dataSource = await getDataSourceByName( "SubDistrictNDVI" );
        if ( dataSource ) {
            
            dataForHistogram( dataSource.entities.values, 'ndvi_june2023', 'June 2023');

        }  
        }   
	},
};
</script>

<style>
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
</style>