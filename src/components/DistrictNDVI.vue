<template>
  <div class="ndviSlider-container" id="ndviSliderContainer" v-if="showSlider">
    <v-slider
      v-model="sliderValue"
      id="ndviSlider"
      :min="0"
      :max="2"
      :step="1"
      tick-labels
    >
    </v-slider>
    <span id="ndviSliderValue">NDVI</span>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import Ndvi from '../services/ndvi.js';
import { eventBus } from '../services/event-emitter.js';

export default {
  setup() {
    const sliderValue = ref(0); // Default value
    const showSlider = ref(false); // Initially hide the slider

    const distanceLabels = {
      0: '2018',
      1: '2020',
      2: '2022'
    }; // Labels for the slider values

    watch(() => sliderValue.value, (newValue) => {
      const ndviService = new Ndvi();
      ndviService.updateNDVIDataSources( sliderValue.value );
    });

    // Event listener to show the slider when the NDVI option is enabled
    eventBus.$on('activateDistrictNDVI', () => {
      showSlider.value = true;
    });

    return {
      sliderValue,
      distanceLabels,
      showSlider
    };
  }
};
</script>

<style scoped>

.ndviSlider-container {
  position: fixed;
  top: 40%;
  left: 5%;
  width: 15%;
  padding: 20px;
  text-align: center;
}

/* Add Vuetify Slider Custom Styles as needed */
</style>