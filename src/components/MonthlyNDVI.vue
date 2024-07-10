<template>
  <div class="ndviSlider-container2023" id="ndviSliderContainer2023" v-if="showSlider">
    <v-slider
      v-model="sliderValue"
      id="ndviSlider2023"
      :min="0"
      :max="11"
      :step="1"
      :ticks="tickLabels"
      show-ticks="always"
      tick-size="1"
    >
    </v-slider>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import Ndvi from '../services/ndvi.js';
import { eventBus } from '../services/event-emitter.js';

export default {
  setup() {
    const sliderValue = ref(0);
    const showSlider = ref(false);

    const tickLabels = {
      0: 'Jan', 
      1: 'Feb',
      2: 'Mar',
      3: 'Apr',
      4: 'May',
      5: 'Jun',
      6: 'Jul',
      7: 'Aug',
      8: 'Sep',
      9: 'Oct',
      10: 'Nov',
      11: 'Dec'
    };


    watch(() => sliderValue.value, (newValue) => {
      const ndviService = new Ndvi();
      ndviService.updateNDVIDataSources2023( sliderValue.value );
      // or is this faster updateNDVIDataSources2023
    });

    eventBus.$on('activate2023NDVISlider', () => {
      showSlider.value = true;
    });


    return {
      sliderValue,
      tickLabels,
      showSlider
    };
  },
};
</script>

<style scoped>

.ndviSlider-container2023 {
    position: fixed;
    top: 38%; 
    left: 0%; 
    width: 35%;
    padding: 20px;
    text-align: center;
}

/* Custom Vuetify Slider Styles */
.ndvi-slider-container .v-slider { /* Target the slider within the container */
  margin-top: 20px; /* Add space between slider and label */
}


/* Add Vuetify Slider Custom Styles as needed */
</style>