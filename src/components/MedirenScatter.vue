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

    <!-- Plotly Chart -->
    <div id="plotly-chart-container">
<PlotlyScatter 
  :xData="scatterX" 
  :yData="scatterY" 
  :colors="scatterColors"  
  @highlightFeature="highlightFeatureOnMap" 
/>    
    </div>

    <!-- OpenLayers Map -->
    <div id="map" class="map"></div>

    <div id="map-tooltip" class="map-tooltip"></div>


    <!-- Bottom Controls: Select and Slider -->
    <v-row class="bottom-controls">
      <v-col cols="5" class="select-container" >
        <v-select
          v-model="selectedMetric"
          :items="metrics"
          label="Select Metric"
          hide-details
        ></v-select>
      </v-col>

      <!-- Slider for Dates -->
      <v-col cols="4" class="slider-container" >
        <v-slider
          v-model="selectedDate"
          :min="0"
          :max="2"
          step="1"
          label="Select Date"
          hide-details
        ></v-slider>
        <span class="selected-year">{{ dates[selectedDate] }}</span>
      </v-col>

      <!-- Source Notes -->
      <v-col cols="6" class="source-note">
        Source data from 
        <a v-if="selectedMetric === 'NDVI'" href="https://some-ndvi-source.com" target="_blank">NDVI Sentinel</a>
        <a v-if="selectedMetric === 'Heat Exposure'" href="https://some-heat-source.com" target="_blank">Heat Exposure Landsat</a>
      </v-col>
    </v-row>
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
import PlotlyScatter from './PlotlyScatter.vue';

// Define metrics and dates for the controls
const metrics = ['NDVI', 'Heat Exposure'];
const dates = ['2020', '2022', '2024'];
const selectedMetric = ref('NDVI');
const selectedDate = ref(0); // Default to the first date (2020)
const scatterColors = ref([]);

const store = useHeatMapStore(); // Pinia store for managing heatmap data

let map = null;
let vectorLayer = null;
const scatterX = ref([]); // NDVI values for Plotly
const scatterY = ref([]); // Heat Exposure values for Plotly

// Reset function for the button
const reset = () => {
  location.reload();
};

let previousFeature = null; // Store previously clicked feature

const highlightFeatureOnMap = (featureIndex) => {
  if (!vectorLayer) return;
  
  const features = vectorLayer.getSource().getFeatures();
  const feature = features[featureIndex];

  if (feature) {
    // Reset previous feature's style (restore original color)
    if (previousFeature) {
      previousFeature.setStyle(null); // Resets to layer default
    }

    // Apply new highlight style
    feature.setStyle(new Style({
      fill: new Fill({ color: 'rgba(255, 255, 255, 0.0)' }), // Transparent white
      stroke: new Stroke({ color: 'white', width: 3 })
    }));

    previousFeature = feature; // Store this as the new highlighted feature

    // Adjust zoom
    const extent = feature.getGeometry().getExtent();
    const view = map.getView();
    const buffer = 0.001;
    const bufferedExtent = [
      extent[0] - buffer, extent[1] - buffer,
      extent[2] + buffer, extent[3] + buffer
    ];
    view.fit(bufferedExtent, { duration: 1000, maxZoom: 15 });
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

    tooltip.innerHTML = `<strong>${streetName}</strong> ${addressNum}`;
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
    features: new GeoJSON().readFeatures(geoJsonData, { featureProjection: 'EPSG:3857' }),
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

      console.log("color", color)

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

// Watcher to update map and chart when metric or date changes
watch([selectedMetric, selectedDate], () => {
  store.setSelectedMetric(selectedMetric.value);
  store.setSelectedYear(selectedDate.value);
  loadGeoJsonLayer();
  updatePlotlyData();
});

// Initialize map when component is mounted
onMounted(() => {
  store.fetchHeatMapData(store.url).then(() => {
    initializeMap();
    store.setSelectedMetric(selectedMetric.value);
    store.setSelectedYear(selectedDate.value);
    loadGeoJsonLayer();
    updatePlotlyData();
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
  bottom: 15px;
  left: 80px;
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
  position: relative;
  bottom: 15px;
  left: 280px;
}

.slider-container {
  position: relative;
  display: flex;
  align-items: center; /* Align items horizontally */
  margin-left: 10px; /* Reduce the gap between select and slider */
}

.selected-year {
  margin-left: 15px; /* Space between the slider and the year text */
  font-weight: bold;
  min-width: 40px; /* Prevent wrapping */
  text-align: center; /* Center the year text */
}

/* Position source note above the select dropdown */
.source-note {
  font-size: 0.75rem; /* Small font size */
  color: #000000; /* Black text color */
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
</style>
