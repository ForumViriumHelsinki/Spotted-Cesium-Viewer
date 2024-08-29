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
    <!-- PlotlyChart Component -->
    <div id="plotly-chart-container">
      <PlotlyChart />
    </div>

    <!-- Map Component -->
    <div id="map" class="map"></div>

    <!-- Slider and controls at the bottom -->
    <v-row class="bottom-controls">
      <v-col cols="1">
        <v-select
          v-model="selectedMetric"
          :items="metrics"
          label="Select Metric"
          hide-details
        ></v-select>
      </v-col>
      <v-col cols="4" class="slider-container">
        <v-slider
          v-model="selectedYear"
          :min="2020"
          :max="2024"
          step="1"
          label="Select Year"
          hide-details
        ></v-slider>
        <!-- Display the currently selected year -->
        <span class="selected-year">July {{ selectedYear }} Median</span>
      </v-col>
      <v-col cols="6" class="source-note">
        Satellite source data by 
        <a href="https://portal.cef-spotted.eu/pages/home" target="_blank">Spotted Platform</a>
      </v-col>      
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useHeatMapStore } from '../stores/heat-map-store'; // Import the Pinia store
import Map from 'ol/Map.js';
import TileLayer from 'ol/layer/Tile.js';
import XYZ from 'ol/source/XYZ.js';
import View from 'ol/View.js';
import { fromLonLat } from 'ol/proj';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import { Fill, Stroke, Style } from 'ol/style';
import PlotlyChart from './PlotlyChart.vue'; // Import the PlotlyChart component

// Metrics options for selection
const metrics = ['Heat Exposure', 'Heat Risk'];
const selectedMetric = ref('Heat Exposure');
const selectedYear = ref(2024);
const chartData = ref([]); // Data for the Plotly chart

const store = useHeatMapStore(); // Use the Pinia store

let map = null;
let vectorLayer = null;

const reset = () => {
  location.reload(); // Reload the page to reset the state
};
// Function to initialize the map
const initializeMap = () => {
  map = new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new XYZ({
          url: 'https://geoserver.fvh.io/tiles/Helsinki_SR_28_05_2024/{z}/{x}/{-y}.png',
          tileSize: [256, 256],
          crossOrigin: 'anonymous',
          minZoom: 2,
          maxZoom: 18,
        }),
      }),
    ],
    view: new View({
      center: fromLonLat(store.center),
      zoom: store.zoom,
    }),
  });
};

// Function to load the GeoJSON layer and apply styles based on the selected metric and year
const loadGeoJsonLayer = () => {
  if (vectorLayer) {
    map.removeLayer(vectorLayer);
  }

  const geoJsonData = store.heatMapData;
  if (!geoJsonData) return; // Exit if no data is available

  const vectorSource = new VectorSource({
    features: new GeoJSON().readFeatures(geoJsonData, { featureProjection: 'EPSG:3857' }),
  });

  vectorLayer = new VectorLayer({
    source: vectorSource,
    style: function (feature) {
      const metric = selectedMetric.value === 'Heat Exposure' ? '_e_' : '_r_';
      const yearValue = selectedYear.value;
      const attribute = `mean${metric}${yearValue}`;

      const value = feature.get(attribute);
      let color;

      if (selectedMetric.value === 'Heat Exposure') {
        // Heat Exposure Color Mapping
        const r = 2 * Math.abs(value - 0.5);
        const a = 0.8;
        if (value <= 0.5) {
          color = `rgba(0, ${255 * (1 - r)}, 255, ${a})`; // Blueish color
        } else {
          color = `rgba(255, ${255 * (1 - r)}, 0, ${a})`; // Reddish color
        }
      } else {
        // Heat Risk Color Mapping (different shades of red)
        if (value < 0.2) color = 'rgba(255,255,204,0.8)';
        else if (value < 0.4) color = 'rgba(254,237,160,0.8)';
        else if (value < 0.6) color = 'rgba(253,141,60,0.8)';
        else if (value < 0.8) color = 'rgba(227,26,28,0.8)';
        else color = 'rgba(177,0,38,0.8)';
      }

      return new Style({
        fill: new Fill({ color: color }),
        stroke: new Stroke({ color: 'black', width: 1 }),
      });
    },
  });

  map.addLayer(vectorLayer);
};

// Watcher to update the map and chart data whenever selectedMetric or selectedYear changes
watch([selectedMetric, selectedYear], () => {
    store.setSelectedMetric( selectedMetric.value );
    store.setSelectedYear( selectedYear.value );
    loadGeoJsonLayer();
});


// Initialize the map when the component is mounted
onMounted(() => {
  console.log(store.url)
  store.fetchHeatMapData( store.url ).then(() => {
    initializeMap();
    loadGeoJsonLayer();
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

.slider-container {
  position: relative;
  left: 300px; /* Move the slider to the right by 100px */
  display: flex;
  align-items: center; /* Align items horizontally */
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
</style>