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
import TileLayer from 'ol/layer/Tile.js'; 
import WebGLTileLayer from 'ol/layer/WebGLTile.js';
import XYZ from 'ol/source/XYZ.js';
import OSM from 'ol/source/OSM.js';
import View from 'ol/View.js';
import { fromLonLat } from 'ol/proj';

let map; // Variable to hold the map instance
const proxyBaseUrl = "http://localhost:3003/google/proxy?url=";

const selectedSatellite = ref('TMS_MAY_2024'); // Default selected satellite image
const satelliteOptions = [
  { text: 'June 14, 2018', value: `${proxyBaseUrl}https://storage.googleapis.com/med-iren/sentinel_images/2018-06-14_Sentinel-2_L2A_NDVI.tiff` }, 
  { text: 'June 21, 2020', value: `${proxyBaseUrl}https://storage.googleapis.com/med-iren/sentinel_images/sentinel_images/2020-06-21_Sentinel-2_L2A_NDVI.tiff` },
  { text: 'June 26, 2022', value: `${proxyBaseUrl}https://storage.googleapis.com/med-iren/sentinel_images/2022-06-26_Sentinel-2_L2A_NDVI.tiff` },
  { text: 'January 27, 2023', value: `${proxyBaseUrl}https://storage.googleapis.com/med-iren/sentinel_images/2023-01-27_Sentinel-2_L2A_NDVI.tiff` },
  { text: 'February 26, 2023', value: `${proxyBaseUrl}https://storage.googleapis.com/med-iren/sentinel_images/2023-02-26_Sentinel-2_L2A_NDVI.tiff` },
  { text: 'March 15, 2023', value: `${proxyBaseUrl}https://storage.googleapis.com/med-iren/sentinel_images/2023-03-15_Sentinel-2_L2A_NDVI.tiff` },
  { text: 'April 22, 2023', value: `${proxyBaseUrl}https://storage.googleapis.com/med-iren/sentinel_images/2023-04-22_Sentinel-2_L2A_NDVI.tiff` },
  { text: 'May 24, 2023', value: `${proxyBaseUrl}https://storage.googleapis.com/med-iren/sentinel_images/2023-05-24_Sentinel-2_L2A_NDVI.tiff` },
  { text: 'June 23, 2023', value: `${proxyBaseUrl}https://storage.googleapis.com/med-iren/sentinel_images/2023-06-23_Sentinel-2_L2A_NDVI.tiff` },
  { text: 'July 13, 2023', value: `${proxyBaseUrl}https://storage.googleapis.com/med-iren/sentinel_images/2023-07-13_Sentinel-2_L2A_NDVI.tiff` },
  { text: 'August 15, 2023', value: `${proxyBaseUrl}https://storage.googleapis.com/med-iren/sentinel_images/2023-08-15_Sentinel-2_L2A_NDVI.tiff` },
  { text: 'September 14, 2023', value: `${proxyBaseUrl}https://storage.googleapis.com/med-iren/sentinel_images/2023-09-14_Sentinel-2_L2A_NDVI.tiff` },
  { text: 'October 29, 2023', value: `${proxyBaseUrl}https://storage.googleapis.com/med-iren/sentinel_images/2023-10-29_Sentinel-2_L2A_NDVI.tiff` },
  { text: 'November 25, 2023', value: `${proxyBaseUrl}https://storage.googleapis.com/med-iren/sentinel_images/2023-11-25_Sentinel-2_L2A_NDVI.tiff` },
  { text: 'December 28, 2023', value: `${proxyBaseUrl}https://storage.googleapis.com/med-iren/sentinel_images/2023-12-28_Sentinel-2_L2A_NDVI.tiff` },
  { text: 'May 28, 2024 1m resolution', value: 'TMS_MAY_2024' }, // New TMS option
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
  let layer;

  // Check if the selected imagePath corresponds to the "May 28, 2024" tiles
  if (imagePath === 'TMS_MAY_2024') {
    // Create a TileLayer for TMS
    const tmsLayer = new TileLayer({
      source: new XYZ({
        url: 'https://geoserver.fvh.io/tiles/Helsinki_SR_28_05_2024/{x}/{y}.png',
        tileSize: 256, // As specified in the XML
        crossOrigin: 'anonymous', // Handle cross-origin requests
        minZoom: 2, // Based on the TileSet information
        maxZoom: 18, // Based on the TileSet information
        projection: 'EPSG:3857', // As specified in the XML
      }),
    });

    layer = tmsLayer;

    // Initialize the map with OpenStreetMap base layer if it is the specific layer
    map = new Map({
      target: 'map',
                    layers: [
                        new TileLayer({
                            title: 'Overlay',
                            // opacity: 0.7,
                            extent: [2762250.971227, 8415660.494291,2812707.837826, 8466647.555635],
                            source: new XYZ({
                                attributions: '',
                                minZoom: 2,
                                maxZoom: 18,
                                url: 'https://geoserver.fvh.io/tiles/Helsinki_SR_28_05_2024/{z}/{x}/{-y}.png',
                                tileSize: [256, 256]
                            })
                        }),
                    ],
      view: new View({
        center: fromLonLat([24.966831, 60.199059]), // Center on Helsinki
        zoom: 13, // Adjust zoom level as needed
      }),
    });

  } else {
    // Handle other image types (e.g., GeoTIFF) without OpenStreetMap base layer
    const geoTiffLayer = new WebGLTileLayer({
      source: new GeoTIFF({
        sources: [
          {
            url: imagePath,
            min: 0,
            max: 1,
          },
        ],
        convertToRGB: true,
        normalize: true,
      }),
    });

    layer = geoTiffLayer;

    // Initialize the map without OpenStreetMap base layer for other images
    map = new Map({
      target: 'map',
      layers: [
        layer, // The GeoTIFF or other selected layer
      ],
      view: new View({
        center: fromLonLat([24.945831, 60.192059]), // Center on Helsinki
        zoom: 13, // Adjust zoom level as needed
      }),
    });
  }
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
