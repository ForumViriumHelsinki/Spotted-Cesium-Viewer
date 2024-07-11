<template>
  <div id="map" class="map"></div>
</template>

<script>
import { ref, onMounted } from 'vue';
import GeoTIFF from 'ol/source/GeoTIFF.js';
import Map from 'ol/Map.js';
import TileLayer from 'ol/layer/WebGLTile.js';
import { eventBus } from '../services/event-emitter.js';

export default {
  setup() {
    const map = ref(null);

    const initializeMap = async () => {
      console.log("eventworks");
      const source = new GeoTIFF({
        sources: [
          {
            url: '/assets/images/2023-08-15_Sentinel-2_L2A_NDVI.tiff' 
          },
        ],
      });

      map.value = new Map({
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
      eventBus.$on('activateSatelliteViewer', initializeMap);
    });

    return { map };
  },
};
</script>

<style>
.map {
  width: 100%;
  height: 100%;
  display: none; /* Initially hidden */
}
</style>