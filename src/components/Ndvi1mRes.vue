<template>
  <v-card id="ndvi1mResContainer" class="ndvi-1m-res-container" v-if="showComponent">
    <v-card-title class="ndvi-1m-res-title">NDVI Comparison (May 28, 2024)</v-card-title>
    <v-card-text>
      <div id="plotArea" class="ndvi-plot"></div>
      <!-- Vuetify Select for Resolution -->
      <v-select
        v-model="selectedResolution"
        :items="resolutionOptions"
        label="Resolution"
        class="resolution-select"
        hide-details
      ></v-select>
    </v-card-text>
  </v-card>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import { useGlobalStore } from '../stores/global-store.js';
import { eventBus } from '../services/event-emitter.js';
import * as Cesium from 'cesium';
import Datasource from '../services/datasource.js';
import Cache from '../services/cache.js';
import { nextTick } from 'vue';

export default {
  setup() {
    const store = useGlobalStore();
    const showComponent = ref(false);
    const datasourceService = new Datasource();
    const cacheService = new Cache();

    // Resolution options for the select
    const resolutionOptions = ['Super Res', 'Normal Res'];
    const selectedResolution = ref('Super Res'); // Default to Super Res

    // Function to update Cesium entities based on the selected resolution
    const updateEntityColors = (entities, resolution) => {
      entities.forEach(entity => {
        const ndviValue =
          resolution === 'Super Res'
            ? entity.properties.ndvi_sr?._value || 0
            : entity.properties.ndvi_nr?._value || 0;
        const color = setNDVIPolygonMaterialColor(ndviValue);
        entity.polygon.material = color;
      });
    };

    const createOrUpdateNDVIChart = (entities) => {
      nextTick(() => {
        // Filter out duplicate entities based on _id
        const uniqueEntities = [];
        const seenIds = new Set();

        for (const entity of entities) {
          if (!seenIds.has(entity._properties._id._value)) {
            uniqueEntities.push(entity);
            seenIds.add(entity._properties._id._value);
          }
        }

        // Extract NDVI data based on selected resolution
        const ndviNRData = uniqueEntities.map(entity => entity.properties.ndvi_nr?._value || 0);
        const ndviSRData = uniqueEntities.map(entity => entity.properties.ndvi_sr?._value || 0);

        // Define the NDVI thresholds
        const thresholds = [-1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6];

        // Calculate the counts for each threshold range for NR (Normal Resolution)
        const nrCounts = thresholds.map((threshold, index) => {
          const nextThreshold = thresholds[index + 1];
          const count = ndviNRData.filter(value => value >= threshold && (nextThreshold === undefined || value < nextThreshold)).length;
          const label = nextThreshold ? `${threshold.toFixed(1)} - ${nextThreshold.toFixed(1)}` : `${threshold.toFixed(1)}+`;
          return { label, count };
        });

        // Calculate the counts for each threshold range for SR (Super Resolution)
        const srCounts = thresholds.map((threshold, index) => {
          const nextThreshold = thresholds[index + 1];
          const count = ndviSRData.filter(value => value >= threshold && (nextThreshold === undefined || value < nextThreshold)).length;
          const label = nextThreshold ? `${threshold.toFixed(1)} - ${nextThreshold.toFixed(1)}` : `${threshold.toFixed(1)}+`;
          return { label, count };
        });

        // Create the Plotly bar chart data
        const nrTrace = {
          x: nrCounts.map(item => item.label),
          y: nrCounts.map(item => item.count),
          type: 'bar',
          name: '10m res',
          marker: {
            color: 'orange'
          }
        };

        const srTrace = {
          x: srCounts.map(item => item.label),
          y: srCounts.map(item => item.count),
          type: 'bar',
          name: '1m res',
          marker: {
            color: 'blue'
          }
        };

        // Create the layout for the chart
        const layout = {
          title: 'NDVI Distribution (NR vs. SR)',
          yaxis: {
            title: 'Number of Areas'
          },
          barmode: 'group', // Group the bars for each range
          autosize: true,
          height: 200, // Increase chart height
          margin: {
            l: 50,  // Adjust left margin
            r: 50,  // Adjust right margin
            b: 50,  // Adjust bottom margin
            t: 50   // Adjust top margin
          },
          legend: {
            x: 1,    // Position the legend to the right
            y: 1,    // Align it to the top
            xanchor: 'left',
            yanchor: 'top',
            font: {
              size: 10  // Reduce the legend font size
            },
            orientation: 'v' // Vertical legend
          }
        };

        // Render the chart in the specified container
        Plotly.newPlot('plotArea', [nrTrace, srTrace], layout);

        // Add click event listener
        document.getElementById('plotArea').on('plotly_click', function (data) {
          const clickedLabel = data.points[0].x;
          const thresholdRange = clickedLabel.split(' - ').map(parseFloat);
          const sRorNR = data.points[0].data.name;
          const upperThreshold = thresholdRange[0] === -1 ? 0 : thresholdRange[1];

          uniqueEntities.forEach(entity => {
            const ndviValue = sRorNR.includes('1m')
              ? entity.properties.ndvi_sr?._value || 0
              : entity.properties.ndvi_nr?._value || 0;

            if (ndviValue >= thresholdRange[0] && (upperThreshold === undefined || ndviValue < upperThreshold)) {
              // Highlight for clicking...
              let oldMaterial = entity.polygon.material;
              entity.polygon.material = new Cesium.Color(1, 0.5, 0.5, 0.8);
              setTimeout(() => { entity.polygon.material = oldMaterial; }, 5000);
            }
          });
        });

        // Update entity colors based on the selected resolution
        updateEntityColors(uniqueEntities, selectedResolution.value);
      });
    };

    const loadSRAreas = async (url, name) => {
      try {
        const cachedValue = await cacheService.getCachedData(url);
        if (cachedValue) {
          console.log('Super resolution areas found from cache');
          addSRAreasDataSource(cachedValue);
        } else {
          loadSRAreasWithoutCache(url, name);
        }
      } catch (err) {
        console.log(err);
      }
    };

    const loadSRAreasWithoutCache = async (url, name) => {
      console.log('Not in cache! Loading super resolution areas...');
      try {
        const response = await fetch(url);
        const data = await response.json();
        cacheService.setCachedData(url, data);
        addSRAreasDataSource(data, name);
      } catch (error) {
        console.error('Error loading super resolution areas data:', error);
      }
    };

    const addSRAreasDataSource = async (data, name) => {
      let entities = await datasourceService.addDataSourceWithPolygonFix(
        data,
        name
      );

      store.setEntities(entities);
      // Set the polygon color for each entity based on the default NDVI value
      updateEntityColors(entities, selectedResolution.value);
      createOrUpdateNDVIChart(entities);
    };

    const setNDVIPolygonMaterialColor = (avgndvi) => {
      if (avgndvi <= 0) {
        return Cesium.Color.fromBytes(234, 234, 234); // #eaeaea
      } else if (avgndvi > 0.0 && avgndvi <= 0.1) {
        return Cesium.Color.fromBytes(204, 198, 130); // #ccc682
      } else if (avgndvi > 0.1 && avgndvi <= 0.2) {
        return Cesium.Color.fromBytes(145, 191, 81); // #91bf51
      } else if (avgndvi > 0.2 && avgndvi <= 0.3) {
        return Cesium.Color.fromBytes(112, 163, 63); // #70a33f
      } else if (avgndvi > 0.3 && avgndvi <= 0.4) {
        return Cesium.Color.fromBytes(79, 137, 45); // #4f892d
      } else if (avgndvi > 0.4 && avgndvi <= 0.5) {
        return Cesium.Color.fromBytes(48, 109, 28); // #306d1c
      } else if (avgndvi > 0.5 && avgndvi <= 0.6) {
        return Cesium.Color.fromBytes(15, 84, 10); // #0f540a
      } else if (avgndvi > 0.6) {
        return Cesium.Color.fromBytes(0, 68, 0); // #004400
      }
    };

    // Event listener to show/hide the component and create the chart initially
    eventBus.$on('loadSRNdviAreaData', (payload) => {
      showComponent.value = true;
      const { url, dataSourceName } = payload;
      loadSRAreas(url, dataSourceName);
    });

    // Watch for changes in the selected resolution
    watch(selectedResolution, (newResolution) => {
      if (store.entities) {
        updateEntityColors(store.entities, newResolution);
      }
    });

    return {
      showComponent,
      createOrUpdateNDVIChart,
      store,
      datasourceService,
      cacheService,
      loadSRAreas,
      loadSRAreasWithoutCache,
      addSRAreasDataSource,
      setNDVIPolygonMaterialColor,
      selectedResolution,
      resolutionOptions
    };
  },
};
</script>

<style scoped>
/* Container Styling */
.ndvi-1m-res-container {
  position: fixed;
  top: 15%; /* Adjust as needed */
  left: 1px; /* Adjust as needed */
  width: 31.25%;
  height: calc(40% + 50px); /* Increase height by 20 pixels */
  font-size: smaller;
  border: 1px solid black;
  box-shadow: 3px 5px 5px black;
  background-color: white;
  z-index: 10; /* Ensure it's on top */
  margin: 10px; /* Add a 10px margin around the container */
}

/* Chart Title */
.ndvi-1m-res-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

/* Chart Container */
.ndvi-plot {
  height: 220px; /* Increase the height of the plot */
}

/* Vuetify Select Styling */
.resolution-select {
  position: absolute;
  bottom: 30px;
  right: 10px;
  width: 150px;
}
</style>
