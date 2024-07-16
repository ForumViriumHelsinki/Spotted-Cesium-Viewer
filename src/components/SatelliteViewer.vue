<template>
  <v-app>
    <v-app-bar app class="custom-app-bar">
      <v-toolbar-title>Sentinel-2 NDVI Images</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-select
        id="satelliteSelect"
        v-model="selectedSatellite"
        :items="satelliteOptions"
        variant="solo-filled"
        item-title="text"
        item-value="value"
        label="Select Image"
        @update:modelValue="loadSatelliteImage"
        style="max-width: 300px;"
      ></v-select>
      <v-btn icon @click="reset">
        <v-icon>mdi-restart</v-icon>
      </v-btn>
    </v-app-bar>
    <div id="map" class="map"></div>
  </v-app>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import GeoTIFF from 'ol/source/GeoTIFF.js';
import Map from 'ol/Map.js';
import TileLayer from 'ol/layer/WebGLTile.js';

let map; // Variable to hold the map instance

const selectedSatellite = ref('https://geo.fvh.fi/spotted/data/sentinel_images/2023-08-15_Sentinel-2_L2A_NDVI.tiff'); // Default selected satellite image
const satelliteOptions = [
  { text: 'June 14, 2018', value: 'https://geo.fvh.fi/spotted/data/sentinel_images/2018-06-14_Sentinel-2_L2A_NDVI.tiff' }, 
  { text: 'June 21, 2020', value: 'https://geo.fvh.fi/spotted/data/sentinel_images/2020-06-21_Sentinel-2_L2A_NDVI.tiff' },
  { text: 'June 26, 2022', value: 'https://geo.fvh.fi/spotted/data/sentinel_images/2022-06-26_Sentinel-2_L2A_NDVI.tiff' },
  { text: 'January 27, 2023', value: 'https://geo.fvh.fi/spotted/data/sentinel_images/2023-01-27_Sentinel-2_L2A_NDVI.tiff' },
  { text: 'February 26, 2023', value: 'https://geo.fvh.fi/spotted/data/sentinel_images/2023-02-26_Sentinel-2_L2A_NDVI.tiff' },
  { text: 'March 15, 2023', value: 'https://geo.fvh.fi/spotted/data/sentinel_images/2023-03-15_Sentinel-2_L2A_NDVI.tiff' },
  { text: 'April 22, 2023', value: 'https://geo.fvh.fi/spotted/data/sentinel_images/2023-04-22_Sentinel-2_L2A_NDVI.tiff' },
  { text: 'May 24, 2023', value: 'https://geo.fvh.fi/spotted/data/sentinel_images/2023-05-24_Sentinel-2_L2A_NDVI.tiff' },
  { text: 'June 23, 2023', value: 'https://geo.fvh.fi/spotted/data/sentinel_images/2023-06-23_Sentinel-2_L2A_NDVI.tiff' },
  { text: 'July 13, 2023', value: 'https://geo.fvh.fi/spotted/data/sentinel_images/2023-07-13_Sentinel-2_L2A_NDVI.tiff' },
  { text: 'August 15, 2023', value: 'https://geo.fvh.fi/spotted/data/sentinel_images/2023-08-15_Sentinel-2_L2A_NDVI.tiff' },
  { text: 'September 14, 2023', value: 'https://geo.fvh.fi/spotted/data/sentinel_images/2023-09-14_Sentinel-2_L2A_NDVI.tiff' },
  { text: 'October 29, 2023', value: 'https://geo.fvh.fi/spotted/data/sentinel_images/2023-10-29_Sentinel-2_L2A_NDVI.tiff' },
  { text: 'November 25, 2023', value: 'https://geo.fvh.fi/spotted/data/sentinel_images/2023-11-25_Sentinel-2_L2A_NDVI.tiff' },
  { text: 'December 28, 2023', value: 'https://geo.fvh.fi/spotted/data/sentinel_images/2023-12-28_Sentinel-2_L2A_NDVI.tiff' },
];

const loadSatelliteImage = (value) => {
  selectedSatellite.value = value;
  if (map) {
    map.setTarget(null); // Clear the map instance
  }
  initializeMap( selectedSatellite.value );
};

const reset = () => {
  location.reload();
};

const initializeMap = (imagePath) => {
  const source = new GeoTIFF({
    sources: [
      {
        url: imagePath,
        min: 0,
        max: 1,
      },
    ],
    convertToRGB: true,
    normalize: true,
  });

  map = new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: source,
      }),
    ],
    view: source.getView(),
  });
};

onMounted(() => {
  setTimeout(() => {
    initializeMap(selectedSatellite.value);
  }, 10);
});
</script>

<style scoped>
.map {
  width: 100%;
  height: 800px;
}
</style>