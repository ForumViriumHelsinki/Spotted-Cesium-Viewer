<template>
  <div class="ndviArea-container" id="ndviAreaContainer" v-if="showSlider">
    <v-slider
      v-model="sliderValue"
      id="ndviArea"
      :min="0"
      :max="7"
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
    const sliderValue = ref(3); // Default to June (index 3)
    const showSlider = ref(false);

    watch(() => sliderValue.value, (newValue) => {
      // Update the label
      // Trigger the update in NdviArea service
      const ndviAreaService = new NdviArea();
      ndviAreaService.updateNDVIAreaDataSources( sliderValue.value );
    });

    // Event listener for 'loadNdviAreaData'
    eventBus.$on('loadNdviAreaData', (payload) => {
      const { url, dataSourceName, isPolygon } = payload;
      const ndviAreaService = new NdviArea();
      ndviAreaService.addFeaturesWithNDVI(url, dataSourceName, isPolygon, 'ndvi_june2023', 'June 2023' );
      showSlider.value = true; // Show the slider
    });

    return {
      sliderValue,
      showSlider
    };
  },
};
</script>

<style>


.ndviArea-container {
    position: fixed;
    top: 35%; 
    left: 5%; 
    width: 20%;
    padding: 20px;
    text-align: center;
    z-index: 1000;
}

</style>