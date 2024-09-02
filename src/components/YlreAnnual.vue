<template>
  <div class="ndviYlre-container" id="ndviYlreContainer" v-if="showSlider">
    <v-slider
      v-model="sliderValue"
      id="ndviYlre"
      :min="0"
      :max="9"
      :step="1"
      tick-labels
    >
    </v-slider>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import NdviArea from '../services/ndvi-area.js';
import { eventBus } from '../services/event-emitter.js';

export default {
  setup() {
    const sliderValue = ref(9); // Default to June 2024 (index 8)
    const showSlider = ref(false);

    watch(() => sliderValue.value, (newValue) => {
      const ndviAreaService = new NdviArea();
      ndviAreaService.updateNDVIYlreDataSources( sliderValue.value );
    });

    eventBus.$on('loadYlreAnnualData', (payload) => {
      const { url, dataSourceName, isPolygon } = payload;
      const ndviAreaService = new NdviArea();
      ndviAreaService.addFeaturesWithNDVI(url, dataSourceName, isPolygon, 'ndvi_july2024', 'July 2024');
      showSlider.value = true; // Show the slider
    });

    return {
      sliderValue,
      showSlider,
    };
  }
};
</script>

<style scoped>

.ndviYlre-container {
  position: fixed;
  top: 36%; 
  left: 5%; 
  width: 20%;
  padding: 20px;
  text-align: center;
    z-index: 1000;
  /* Add or modify styles here for customization */
}
</style>