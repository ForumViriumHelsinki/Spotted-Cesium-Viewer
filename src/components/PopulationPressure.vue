<template>
  <div class="slider-container" id="sliderContainer" v-if="showSlider">
    <v-slider
      v-model="sliderValue"
      id="blueSlider"
      :min="0"
      :max="2"
      :step="1"
    >
      <template #thumb-label="{ value }">
        {{ distanceLabels[value] }}
      </template>
    </v-slider>
    <span id="sliderValue">distance from area 800 m</span>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue'; // Import ref and watch
import GreenAreas from '../services/green-areas';
import { eventBus } from '../services/event-emitter.js';

export default {
  setup() {
    const sliderValue = ref(1); // Initialize to 1 for default value
    const distanceLabels = {
      0: '300 m',
      1: '800 m',
      2: '2000 m'
    };
    const showSlider = ref(false); // Initially hide the slider

    watch(() => sliderValue.value, (newValue) => {
      updateSliderLabel(newValue);
              // Call handleGreenAreas when slider value changes
        const greenAreas = new GreenAreas();
        greenAreas.handleGreenAreas();
    });

    const updateSliderLabel = (value) => {
      document.getElementById('sliderValue').textContent = `distance from area ${distanceLabels[value]}`;
    };

    // Event listener for 'loadGreenAreas'
    eventBus.$on('loadGreenAreas', (url) => {
      const greenAreas = new GreenAreas();
      greenAreas.loadGreenAreas(url);
      showSlider.value = true; // Show the slider when green areas are loaded
    });

    return {
      sliderValue,
      distanceLabels,
      updateSliderLabel,
      showSlider
    };
  }
};
</script>

<style>

.slider-container {
  position: fixed;
  top: 55%; 
  left: 8%; 
  transform: translateX(-25%); 
  width: 25%; 
  padding: 20px;
  text-align: center;
}

/* Style the slider label */
.slider-container #sliderValue {
  position: relative;    
  top: -100px; /* Move the label up by 100px */
  display: block; /* Ensure it takes up full width */
}
</style>