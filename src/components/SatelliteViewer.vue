<template>

    <div id="map" class="map"></div>
</template>

<script setup>
import { onMounted } from 'vue';
import GeoTIFF from 'ol/source/GeoTIFF.js';
import Map from 'ol/Map.js';
import TileLayer from 'ol/layer/WebGLTile.js';

// ... other imports

onMounted(() => {
        const source = new GeoTIFF({
          sources: [
            {
              url: '/assets/images/2023-08-15_Sentinel-2_L2A_NDVI.tiff',
              min: 0,
              max: 1
            },
          ],
          convertToRGB: true,  // Convert to RGB
          normalize: true      // Normalize the data
        });

  const map = new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: source,
      }),
    ],
    view: source.getView(),

  });
});
</script>

<style>
.map {
  width: 100%;
  height: 1000px;
}
</style>