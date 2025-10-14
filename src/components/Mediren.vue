<template>
  <v-container>
    <v-btn 
      icon 
      size="small" 
      @click="reset" 
      class="reset-button"
    >
      <v-icon>mdi-restart</v-icon>
    </v-btn>

        <!-- Landcover Chart (Top Right) -->
    <div class="landcover-chart-container">
      <MedirenLandcover :landcoverData="Object.values(landcoverData)" :selectedYear="dates[selectedDate]" />
    </div>

    <!-- Plotly Chart -->
    <div id="plotly-chart-container">
<NDVIHeatChart
  ref="ndviHeatChartRef"
  :xData="scatterX"
  :yData="scatterY"
  :colors="scatterColors"
  :highlightedIndex="highlightedIndex"
  @highlightFeature="highlightFeatureOnMap"
/>
    </div>

    <!-- OpenLayers Map -->
    <div id="map" class="map"></div>

    <div id="map-tooltip" class="map-tooltip"></div>


    <!-- Bottom Controls: Select and Slider -->
    <div class="bottom-controls">
       <div class="select-container" >
        <v-select
          v-model="selectedMetric"
          :items="metrics"
          density="compact"
          label="Select Metric"
          hide-details
        ></v-select>
       </div>

      <!-- Radio Buttons for Year Selection -->
      <div class="radio-container">
        <v-radio-group v-model="selectedDate" inline>
          <v-radio v-for="(year, index) in dates" :key="year" :label="year" :value="index"></v-radio>
        </v-radio-group>
      </div>

<div class="select2-container">
  <v-select
    v-model="selectedFacility"
    :items="facilities"
    density="compact"
    item-title="text"
    item-value="value"
    label="Select Facility"
    hide-details
  ></v-select>
</div>
      <!-- Source Notes -->
      <v-col cols="6" class="source-note">
        Source data from 
        <a v-if="selectedMetric === 'NDVI'" href="https://custom-scripts.sentinel-hub.com/custom-scripts/sentinel-2/ndvi/" target="_blank">NDVI Sentinel</a>
        <a v-if="selectedMetric === 'Heat Exposure'" href="https://custom-scripts.sentinel-hub.com/custom-scripts/landsat-8/thermal/" target="_blank">Heat Exposure Landsat</a>
      </v-col>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useHeatMapStore } from '../stores/heat-map-store'; // Pinia store for data management
import Map from 'ol/Map.js';
import TileLayer from 'ol/layer/Tile.js';
import XYZ from 'ol/source/XYZ.js';
import View from 'ol/View.js';
import TileWMS from 'ol/source/TileWMS';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Fill, Stroke, Style } from 'ol/style';
import NDVIHeatChart from './NDVIHeatChart.vue';
import MedirenLandcover from './MedirenLandcover.vue';

// Define metrics and dates for the controls
const metrics = ['NDVI', 'Heat Exposure'];
const dates = ['2020', '2022', '2024'];
const selectedMetric = ref('NDVI');
const selectedDate = ref(2); // Default to the first date (2024)
const scatterColors = ref([]);
const facilities = [
  { text: 'Nursing Homes', value: 'assets/data/ymp_iak_area_buffered_with_avg.json' },
  { text: 'Daycares', value: 'assets/data/c_kayttark_231_buffered_with_avg.json' },
];
const selectedFacility = ref(facilities[0].value);
const ndviHeatChartRef = ref(null); // Ref to the NDVIHeatChart component
const highlightedIndex = ref(null); // Ref to store the highlighted index
const previousHighlightedColor = ref(null); // Keep track of the previous color
const previousHighlightedIndex = ref(null); // Ref to store the highlighted index

const store = useHeatMapStore(); // Pinia store for managing heatmap data

let map = null;
let vectorLayer = null;
const scatterX = ref([]); // NDVI values for Plotly
const scatterY = ref([]); // Heat Exposure values for Plotly

const landcoverData = ref({});

// Reset function for the button
const reset = () => {
  location.reload();
};

let previousFeature = null; // Store previously clicked feature

const highlightFeatureOnMap = (ndviValue) => {
  if (!vectorLayer) return;

  const features = vectorLayer.getSource().getFeatures();

  let targetFeature = null;
  let targetFeatureIndex = -1;

  for (let i = 0; i < features.length; i++) {
    const feature = features[i];
    const properties = feature.getProperties();
    const ndviKey = `ndvi_${dates[selectedDate.value]}-06`; // Construct the NDVI key
    const featureNdvi = properties[ndviKey];

    if (Math.abs(featureNdvi - ndviValue) < 0.000001) { // Tolerance comparison
      targetFeature = feature;
      targetFeatureIndex = i;
      break; // Exit the loop once a match is found
    }
  }

  if (targetFeature) {
    // Reset previous feature's style
    if (previousFeature) {
      previousFeature.setStyle(null);
    }

    // Apply new highlight style
    targetFeature.setStyle(new Style({
      fill: new Fill({ color: 'rgba(255, 255, 255, 0.0)' }),
      stroke: new Stroke({ color: 'white', width: 3 })
    }));

    previousFeature = targetFeature;

    // Adjust zoom
    const extent = targetFeature.getGeometry().getExtent();
    const view = map.getView();
    const buffer = 0.001;
    const bufferedExtent = [
      extent[0] - buffer, extent[1] - buffer,
      extent[2] + buffer, extent[3] + buffer
    ];
    view.fit(bufferedExtent, { duration: 1000, maxZoom: 15 });
  } else {
    console.warn("No matching feature found for NDVI value:", ndviValue);
  }
};

const initializeMap = () => {
  map = new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new TileWMS({
          url: 'https://geo.fvh.fi/spotted-wms/proxy',
          params: {
            LAYERS: 'asuminen_ja_maankaytto:maanpeite_rakennus_2024,asuminen_ja_maankaytto:maanpeite_avokalliot_2024,asuminen_ja_maankaytto:maanpeite_merialue_2024,asuminen_ja_maankaytto:maanpeite_muu_avoin_matala_kasvillisuus_2024,asuminen_ja_maankaytto:maanpeite_muu_vetta_lapaisematon_pinta_2024,asuminen_ja_maankaytto:maanpeite_paallystamaton_tie_2024,asuminen_ja_maankaytto:maanpeite_paallystetty_tie_2024,asuminen_ja_maankaytto:maanpeite_paljas_maa_2024,asuminen_ja_maankaytto:maanpeite_pellot_2024,asuminen_ja_maankaytto:maanpeite_puusto_10_15m_2024,asuminen_ja_maankaytto:maanpeite_puusto_15_20m_2024,asuminen_ja_maankaytto:maanpeite_puusto_2_10m_2024,asuminen_ja_maankaytto:maanpeite_puusto_yli20m_2024,asuminen_ja_maankaytto:maanpeite_vesi_2024',
            FORMAT: 'image/png',
            TRANSPARENT: true,
          },
          serverType: 'geoserver',
          crossOrigin: 'anonymous',
        }),
      }),
    ],
    view: new View({
      center: fromLonLat(store.center),
      zoom: store.zoom,
    }),
  });

  // Add event listeners for hover effect
  map.on('pointermove', showTooltip);
  map.on('pointerout', hideTooltip);

  // Add event listener for map clicks
  map.on('click', handleMapClick);
};

const handleMapClick = (event) => {
  const features = map.getFeaturesAtPixel(event.pixel);
  let newColors = [...scatterColors.value]; // Declare newColors here

  if (features.length > 0) {
    const clickedFeature = features[0];
    const featureIndex = clickedFeature.get('featureIndex');

    // Restore previous color (if any)
    if (highlightedIndex.value !== null) { // Check if there was a previous highlight
      newColors[highlightedIndex.value] = previousHighlightedColor.value;
    }

    // Highlight the current point and store its original color and index
    if (highlightedIndex.value !== null) { // Check if there was a previous highlight
      previousHighlightedColor.value = scatterColors.value[featureIndex];
      previousHighlightedIndex.value = highlightedIndex.value;
    } else {
      previousHighlightedColor.value = scatterColors.value[featureIndex];
    }
    newColors[featureIndex] = 'blue';

    scatterColors.value = newColors;
    highlightedIndex.value = featureIndex;

  } else {
    // Reset all highlights
    if (highlightedIndex.value !== null) { // Check if there was a previous highlight
      newColors[highlightedIndex.value] = previousHighlightedColor.value;
    }
    highlightedIndex.value = null;
    previousHighlightedColor.value = null;
    previousHighlightedIndex.value = null;
    scatterColors.value = newColors;
  }
};

const showTooltip = (event) => {
  const tooltip = document.getElementById('map-tooltip'); // Move inside function
  if (!tooltip || !vectorLayer) return;


  const features = map.getFeaturesAtPixel(event.pixel);
  if (features.length > 0) {
    const feature = features[0];
    const properties = feature.getProperties();
    const streetName = properties['katunimi_suomi'] || 'Unknown';
    const addressNum = properties['osoitenumero'] || 'N/A';
    const trees = ( ( properties[ `tree10_m2_${ dates[ selectedDate.value ] }`] + properties[ `tree15_m2_${ dates[ selectedDate.value ] }` ]
                  + properties[ `tree20_m2_${ dates[ selectedDate.value ] }` ] + properties[ `tree2_m2_${ dates[ selectedDate.value ] }` ] 
                  ) / properties[ 'area_m2' ] );
    
    const water = ( ( properties[ `water_m2_${ dates[ selectedDate.value ] }`] + properties[ `sea_m2_${ dates[ selectedDate.value ] }` ] ) / properties[ 'area_m2' ] );
    const vegetation = ( ( properties[ `vegetation_m2_${ dates[ selectedDate.value ] }`] + properties[ `field_m2_${ dates[ selectedDate.value ] }` ] ) / properties[ 'area_m2' ] );

    // Retrieve NDVI and Heat Exposure values based on selected date
    const ndviValue = properties[`ndvi_${dates[selectedDate.value]}-06`].toFixed( 2 ) || 'N/A';
    const heatExposureValue = properties[`heatexposure_${dates[selectedDate.value]}-06`].toFixed( 2 ) || 'N/A';

    tooltip.innerHTML = `<strong>${streetName}</strong> ${addressNum}<br> 
                         <strong>NDVI:</strong> ${ndviValue}<br>
                         <strong>Heat Exposure:</strong> ${heatExposureValue}<br>
                         <strong>Trees:</strong> ${( trees * 100 ).toFixed( 2 )} %<br>
                         <strong>Water:</strong> ${( water * 100 ).toFixed( 2 )} %<br>
                         <strong>Vegetation:</strong> ${( vegetation  * 100 ).toFixed( 2 )} %<br>`;
    tooltip.style.display = 'block';
    tooltip.style.left = event.pixel[0] + 80 + 'px';
    tooltip.style.top = event.pixel[1] + 'px';
  } else {
    hideTooltip();
  }
};

const hideTooltip = () => {
  const tooltip = document.getElementById('map-tooltip'); // Move inside function
  if (tooltip) {
    tooltip.style.display = 'none';
  }
};

// Function to load GeoJSON layer and update style based on selected metric
const loadGeoJsonLayer = () => {
  if (vectorLayer) {
    map.removeLayer(vectorLayer);
  }

  const geoJsonData = store.heatMapData;
  if (!geoJsonData) return;

  const vectorSource = new VectorSource({
    features: new GeoJSON().readFeatures(geoJsonData, { featureProjection: 'EPSG:3857' })
    .map((feature, index) => {
      feature.set('featureIndex', index); // Store the original index
      return feature;
    }),
  });

  vectorLayer = new VectorLayer({
    source: vectorSource,
    style: function (feature) {

      let attribute;
      let value;
      let color;

      // Set style based on selected metric and date
      if (selectedMetric.value === 'Heat Exposure') {
        attribute = `heatexposure_${dates[selectedDate.value]}-06`;
        value = feature['values_'][ attribute ];
        color = getHeatExposureColor(value);
      } else if (selectedMetric.value === 'NDVI') {
        attribute = `ndvi_${dates[selectedDate.value]}-06`;
        value = feature['values_'][ attribute ];
        color = getNDVIColor(value);
      }

      return new Style({
        fill: new Fill({ color: color }),
        stroke: new Stroke({ color: 'black', width: 1 }),
      });
    },
  });

  map.addLayer(vectorLayer);
};

// Color scales for Heat Exposure and NDVI
const getHeatExposureColor = (value) => {
  return `rgba(255, ${255 * (1 - value)}, 0, ${value})`;
};

const getNDVIColor = (value) => {
  if (value < -0.5) return '#0c0c0c';   // Very Low NDVI
  if (value <= 0) return '#eaeaea';    // Bare soil / non-vegetation
  if (value <= 0.1) return '#ccc682';  // Low vegetation
  if (value <= 0.2) return '#91bf51';
  if (value <= 0.3) return '#70a33f';
  if (value <= 0.4) return '#4f892d';
  if (value <= 0.5) return '#306d1c';
  if (value <= 0.6) return '#0f540a';
  return '#004400';  // Dense Vegetation
};

// Update Plotly data function to include year selection
const updatePlotlyData = () => {
  const heatExposureData = [];
  const ndviData = [];
  const colors = []; // Create a local colors array

  highlightedIndex.value = null;

  store.heatMapData.features.forEach(feature => {
    const ndviValue = feature['properties'][`ndvi_${dates[selectedDate.value]}-06`];
    const heatExposureValue = feature['properties'][`heatexposure_${dates[selectedDate.value]}-06`];

    if (ndviValue !== undefined && heatExposureValue !== undefined) {
      ndviData.push(ndviValue);
      heatExposureData.push(heatExposureValue);

      // Assign colors based on selected metric
      if (selectedMetric.value === 'NDVI') {
        colors.push(getNDVIColor(ndviValue));
      } else {
        colors.push(getHeatExposureColor(heatExposureValue));
      }
    }
  });

  scatterX.value = ndviData;
  scatterY.value = heatExposureData;
  scatterColors.value = colors; // Make sure this updates reactively
};

const updateLandCoverData = () => {
  const landCoverTypes = ["vegetation", "field", "tree10", "tree15", "tree2", "tree20", "water", "sea"];
  landcoverData.value = [];
  const selectedYearStr = dates[selectedDate.value]; // Ensure it's like "2024"

  // Loop through each feature and sum up the land cover areas
  store.heatMapData.features.forEach(feature => {
    const landCoverData = {}; // Object to store summed-up areas
    const streetName = feature.properties[ 'katunimi_suomi' ] || 'Unknown';
    const addressNum = feature.properties[ 'osoitenumero' ] || 'N/A';
    landCoverData[ 'address' ] = streetName +' ' + addressNum;
    landCoverData[ 'area' ] = feature.properties[ 'area_m2' ];
    landCoverTypes.forEach(type => {
      const key = `${type}_m2_${selectedYearStr}`;
      if (feature.properties[key] !== undefined) {
        landCoverData[type] = feature.properties[key]; // Sum areas
      }
    });
    landcoverData.value.push( landCoverData );
  });

};

// Watcher to update map and chart when metric or date changes
watch([selectedMetric, selectedDate, selectedFacility], async () => {
  store.setUrl(selectedFacility.value);  
  const response = await fetch(selectedFacility.value);
  const data = await response.json();
  store.setHeatMapData(data);
  store.setSelectedMetric(selectedMetric.value);
  store.setSelectedYear(selectedDate.value);
  loadGeoJsonLayer();
  updatePlotlyData();
  updateLandCoverData();
});

watch(selectedDate, () => {
  if (!map) return;

  // Define new WMS parameters based on the selected year
  const updatedParams = {
    LAYERS: `asuminen_ja_maankaytto:maanpeite_rakennus_${dates[selectedDate.value]},asuminen_ja_maankaytto:maanpeite_avokalliot_${dates[selectedDate.value]},asuminen_ja_maankaytto:maanpeite_merialue_${dates[selectedDate.value]},asuminen_ja_maankaytto:maanpeite_muu_avoin_matala_kasvillisuus_${dates[selectedDate.value]},asuminen_ja_maankaytto:maanpeite_muu_vetta_lapaisematon_pinta_${dates[selectedDate.value]},asuminen_ja_maankaytto:maanpeite_paallystamaton_tie_${dates[selectedDate.value]},asuminen_ja_maankaytto:maanpeite_paallystetty_tie_${dates[selectedDate.value]},asuminen_ja_maankaytto:maanpeite_paljas_maa_${dates[selectedDate.value]},asuminen_ja_maankaytto:maanpeite_pellot_${dates[selectedDate.value]},asuminen_ja_maankaytto:maanpeite_puusto_10_15m_${dates[selectedDate.value]},asuminen_ja_maankaytto:maanpeite_puusto_15_20m_${dates[selectedDate.value]},asuminen_ja_maankaytto:maanpeite_puusto_2_10m_${dates[selectedDate.value]},asuminen_ja_maankaytto:maanpeite_puusto_yli20m_${dates[selectedDate.value]},asuminen_ja_maankaytto:maanpeite_vesi_${dates[selectedDate.value]}`,
  };

  // Find the WMS layer and update parameters
  map.getLayers().forEach(layer => {
    if (layer.getSource() instanceof TileWMS) {
      layer.getSource().updateParams(updatedParams);
    }
  });
});

// Initialize map when component is mounted
onMounted(() => {
  store.setUrl('assets/data/ymp_iak_area_buffered_with_avg.json');
	store.setCenter([24.96, 60.207559]);
	store.setZoom(12);
  store.fetchHeatMapData(store.url).then(() => {
    initializeMap();
    store.setSelectedMetric(selectedMetric.value);
    store.setSelectedYear(selectedDate.value);
    loadGeoJsonLayer();
    updatePlotlyData();
    updateLandCoverData();
  });
});
</script>

<style scoped>
/* Create a grid container */
.v-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* Four columns grid */
  grid-template-rows: repeat(5, 1fr); /* Four rows grid */
  height: 100vh; /* Full viewport height */
}

/* Reset Button positioning */
.reset-button {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 20; /* Ensure it stays on top */
}

/* Position the Plotly chart at column 2, row 2 */
#plotly-chart-container {
  grid-column: 1; 
  grid-row: 1; 
  width: 400px;
  height: 400px;
  z-index: 10; /* Ensure it stays on top */
}

/* Ensure map takes the full space available */
.map {
  grid-column: 1 / -1; /* Span all columns */
  grid-row: 1 / -1; /* Span all rows */
  width: 200vh;
  height: 100vh;
  position: relative;
}

.bottom-controls {
  position: absolute;
  bottom: -10px;
  left: 0px;
  height: 80px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent background */
  padding: 10px;
  border-radius: 5px;
  display: flex;
  align-items: center;
}

.v-col {
  padding-left: 8px;
  padding-right: 8px;
}

.select-container {
  position: absolute;
  bottom: 35px;
  left: 325px;
}

.select2-container {
  position: absolute;
  bottom: 35px;
  left: 80px;
}

.selected-year {
  margin-left: 15px; /* Space between the slider and the year text */
  font-weight: bold;
  min-width: 40px; /* Prevent wrapping */
  text-align: center; /* Center the year text */
}

/* Position source note above the select dropdown */
.source-note {
  position: absolute;
  bottom: 15px;
  left: 650px;
  font-size: 0.75rem; /* Small font size */
  color: #000000; /* Black text color */
}

.radio-container {
  position: absolute;
  bottom: -5px;
  left: 600px;
  z-index: 1000;
}

.map-tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 6px 12px;
  border-radius: 5px;
  font-size: 14px;
  pointer-events: none;
  display: none;
  white-space: nowrap;
}

.landcover-chart-container {
  position: fixed;
  top: 10px;
  right: 10px;
  
  height: auto; /* from: height: 720px; */
  
  width: 420px;
  z-index: 10;
  border: 1px solid black;
  box-shadow: 3px 5px 5px black;
  
  background-color: white; 
}

</style>