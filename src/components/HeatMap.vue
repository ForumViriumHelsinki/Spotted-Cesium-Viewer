<template>
  <v-container>
    <div id="map" class="map"></div>

    <!-- PlotlyChart Component -->
    <PlotlyChart 
      :selectedMetric="selectedMetric" 
      :selectedYear="selectedYear" 
      :data="chartData" 
    />

    <!-- Slider and controls at the bottom -->
    <v-row class="bottom-controls">
      <v-col cols="2">
        <v-select
          v-model="selectedMetric"
          :items="metrics"
          label="Select Metric"
          @change="updateVisualization"
          hide-details
        ></v-select>
      </v-col>
      <v-col cols="8" class="slider-container">
        <v-slider
          v-model="selectedYear"
          :min="2020"
          :max="2024"
          step="1"
          label="Select Year"
          @change="updateVisualization"
          hide-details
        ></v-slider>
        <!-- Display the currently selected year -->
        <span class="selected-year">{{ selectedYear }}</span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { eventBus } from '../services/event-emitter.js';
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

let map = null;
let vectorLayer = null;

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
      center: fromLonLat([24.916831, 60.177559]),
      zoom: 14,
    }),
  });
};

// Function to load the GeoJSON layer and apply styles based on the selected metric and year
const loadGeoJsonLayer = () => {
  if (vectorLayer) {
    map.removeLayer(vectorLayer);
  }

  const geoJsonData = 'assets/data/Spotted-Kivela-Buildings.json'; // Replace with actual GeoJSON file path or URL

  const vectorSource = new VectorSource({
    format: new GeoJSON(),
    url: geoJsonData,
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
  loadGeoJsonLayer();
  updateChartData();
});

// Function to update the chart data (you'll need to replace this with actual data extraction logic)
const updateChartData = () => {
  // Replace with actual data extraction logic for the chart
  chartData.value = [/* Your GeoJSON data for the selected metric and year */];
};

// Initialize the map when the component is mounted
onMounted(() => {
  setTimeout(() => {
    initializeMap();
    loadGeoJsonLayer();
  }, 10);
});
</script>

<style scoped>
.map {
  height: 600px;
  width: 100%;
  position: relative;
}

.bottom-controls {
  position: absolute;
  bottom: 65px;
  left: 55px;
  width: 95%;
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
</style>