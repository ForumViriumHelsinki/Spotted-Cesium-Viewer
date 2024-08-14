<template>
  <v-card id="ndvi1mResContainer" class="ndvi-1m-res-container" v-if="showComponent">
    <v-card-title class="ndvi-1m-res-title">NDVI Comparison (May 28, 2024)</v-card-title>
    <v-card-text>
      <div id="plotArea" class="ndvi-plot"></div>
    </v-card-text>

    <v-card-actions>
      <v-select
        v-model="selectedResolution"
        :items="resolutionOptions"
        label="Select Resolution"
        variant="outlined"
      ></v-select>
    </v-card-actions>
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
    const selectedResolution = ref('10m');
    const resolutionOptions = [
      { text: '10m Resolution', value: '10m' },
      { text: '1m Resolution', value: '1m' },
    ];
    const datasourceService = new Datasource();
    const cacheService = new Cache();

    const createOrUpdateNDVIChart = (entities) => {
  nextTick(() => {
    // Extract NDVI data based on selected resolution
    const ndviNRData = entities.map(entity => entity.properties.ndvi_nr?._value || 0);
    const ndviSRData = entities.map(entity => entity.properties.ndvi_sr?._value || 0);

    // Define the NDVI thresholds
    const thresholds = [-1, 0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 1];

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
      xaxis: {
        title: 'NDVI Range'
      },
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
  });
};

    const loadSRAreas = async (url, name) => {
      try {
        let cachedValue = null;
       // const cachedValue = await cacheService.getCachedData(url);
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
        // Handle error case or return accordingly
      }
    };

    const addSRAreasDataSource = async (data, name) => {
      let entities = await datasourceService.addDataSourceWithPolygonFix(
        data,
        name
      );
      // Set the polygon color for each entity based on its NDVI value
      entities.forEach(entity => {
        const avgndvi = entity.properties.ndvi_sr._value; // Assuming you want to use the super-resolution NDVI
        const color = setNDVIPolygonMaterialColor(avgndvi);
        entity.polygon.material = color;
        entity.polygon.outline = true;
        entity.polygon.outlineColor = Cesium.Color.BLACK;
      });
      createOrUpdateNDVIChart( entities );
    };

    const setNDVIPolygonMaterialColor = ( avgndvi ) => {
        if ( avgndvi <= 0 ) {
            return Cesium.Color.fromBytes( 234, 234, 234 ); // #eaeaea
        } else if ( avgndvi > 0.0 && avgndvi <= 0.1 ) {
            return Cesium.Color.fromBytes( 204, 198, 130 ); // #ccc682
        } else if ( avgndvi > 0.1 && avgndvi <= 0.2 ) {
            return Cesium.Color.fromBytes( 145, 191, 81 ); // #91bf51
        } else if ( avgndvi > 0.2 && avgndvi <= 0.3 ) {
            return Cesium.Color.fromBytes( 112, 163, 63 ); // #70a33f
        } else if ( avgndvi > 0.3 && avgndvi <= 0.4 ) {
            return Cesium.Color.fromBytes( 79, 137, 45 ); // #4f892d
        } else if ( avgndvi > 0.4 && avgndvi <= 0.5 ) {
            return Cesium.Color.fromBytes( 48, 109, 28 ); // #306d1c
        } else if ( avgndvi > 0.5 && avgndvi <= 0.6 ) {
            return Cesium.Color.fromBytes( 15, 84, 10 ); // #0f540a
        } else if ( avgndvi > 0.6 ) {
            return Cesium.Color.fromBytes( 0, 68, 0 ); // #004400
        }
    }

    // Watch for changes in the selected resolution or showNDVI switch
    watch([selectedResolution, () => store.showNDVI], ([newResolution, showNDVI]) => {
      if (showNDVI) { 
        createOrUpdateNDVIChart();
      }
    });

    // Event listener to show/hide the component and create the chart initially
    eventBus.$on('loadSRNdviAreaData', (payload) => {
      showComponent.value = true;
      const { url, dataSourceName, isPolygon } = payload;
      loadSRAreas( url, dataSourceName );
      createOrUpdateNDVIChart();

    });

    eventBus.$on('createNdvi1mChart', (payload) => {
        showComponent.value = true;
        const { entities } = payload;
        createOrUpdateNDVIChart( entities );
    });

    return {
      showComponent,
      selectedResolution,
      resolutionOptions,
      createOrUpdateNDVIChart,
      store,
      datasourceService,
      cacheService,
      loadSRAreas,
      loadSRAreasWithoutCache,
      addSRAreasDataSource,
      setNDVIPolygonMaterialColor
    };
  },
};
</script>

<style scoped>
/* Container Styling */
.ndvi-1m-res-container {
  position: fixed;
  top: 10%; /* Adjust as needed */
  right: 1px; /* Adjust as needed */
  width: 31.25%; 
  height: 40%; 
  font-size: smaller;
  border: 1px solid black;
  box-shadow: 3px 5px 5px black;
  background-color: white;
  z-index: 10; /* Ensure it's on top */
}

/* Chart Title */
.ndvi-1m-res-title {
  font-size: 18px; 
  font-weight: bold;
  margin-bottom: 10px; 
}

/* Chart Container */
.ndvi-plot {
  height: 200px; 
}
</style>
