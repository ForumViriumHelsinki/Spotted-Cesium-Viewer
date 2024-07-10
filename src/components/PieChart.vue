<template>
  <div id="plotPieContainer" class="plot-pie-container" v-if="showSlider">
    <v-select
        id="plotSelect"
        v-model="selectedDistrict"
        :items="districtOptions"
        item-title="text"
        item-value="value"
        label="Select District"
        variant="outlined"
        class="custom-select"
        @update:modelValue="reCreatePieChart" 
    ></v-select>

    <div ref="plotArea"></div>
  </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import { useGlobalStore } from '../stores/global-store.js';
import { useLandCoverStore } from '../stores/land-cover-store.js';
import { eventBus } from '../services/event-emitter.js';
import Plot from '../services/plot.js';

export default {
  setup() {
    // ... (your other imports and setup code)
    const showSlider = ref(false);
    const store = useGlobalStore();
    const landCoverStore = useLandCoverStore();
    const selectedDistrict = ref('Helsinki'); // Initial value for v-model
    const districtOptions = ref([
      { text: 'Helsinki', value: 'Helsinki' } // Initial option
    ]);

    onMounted(async () => {
      watch(
        () => store.levelsVisited,
        async (newLevelsVisited) => {
          if (newLevelsVisited.length > 0) {
            await populateSelectFromStore();
          }
        },
        { immediate: true } // Trigger the watcher immediately when the component is mounted
      );

      eventBus.$on('createPieChart', async () => {
        showSlider.value = true;
        await populateSelectFromStore(); // Populate options before creating the chart
      });
    });

    const populateSelectFromStore = async () => {
      const currentLevel = store.levelsVisited[store.levelsVisited.length - 1];
      const entities = getCurrentLevelEntities(currentLevel) || []; // Ensure entities is an array

      // Filter and map to get unique district names
      const uniqueDistrictNames = Array.from(new Set(entities
        .filter(entity => entity.hasOwnProperty('_properties') && entity._properties._nimi_fi)
        .map(entity => entity._properties._nimi_fi._value)
      ));

      districtOptions.value = uniqueDistrictNames.map(nimi => ({ text: nimi, value: nimi }));
    };
  
    // new method to retrieve correct level entities from the landcover store
    const getCurrentLevelEntities = (level) => {
      switch(level) {
        case 'MajorDistricts':
            return landCoverStore.majorDistrictData || []; // Default to empty array
        case 'Districts':
            return landCoverStore.districtData || [];
        case 'SubDistricts':
            return landCoverStore.subDistrictData || [];
        default:
          return landCoverStore.majorDistrictData || [];
      }
    };

    const reCreatePieChart = () => {
        const plotService = new Plot();
        plotService.createPieChartForMajorDistrict( selectedDistrict.value );
    };

    return {
      // ... your existing return values ...
      districtOptions,
      selectedDistrict,
      populateSelectFromStore,
      showSlider,
      store,
      landCoverStore,
      reCreatePieChart
    };
  },
};
</script>


<style>

#plotPieContainer
{
	position: fixed;
	top: 50%;
	left: 0%;
	width: 31.25%;
	height: 45%; 
	
	font-size: 12px;
	border: 1px solid black;
	box-shadow: 3px 5px 5px black;  
    background-color: white;
}

.custom-select {  /* Target the v-select using a custom class */
  position: absolute;
  top: 10px; 
  left: 300px;
  font-size: smaller; /* Apply your font size here */
}

</style>