<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      NDVI vs Heat Exposure
      <v-spacer></v-spacer>
      <v-btn
        icon
        variant="text"
        size="small"
        @click="toggleMinimize"
      >
        <v-icon>{{ isMinimized ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text
      v-show="!isMinimized"
      class="chart-container"
    >
      <div ref="plotlyChart" class="plotly-chart"></div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, defineEmits } from 'vue';

const props = defineProps({
  xData: Array,
  yData: Array,
  colors: Array,
  highlightedIndex: {
    type: Number,
    default: null
  }
});

const emit = defineEmits(['highlightFeature']);
const plotlyChart = ref(null);

const isMinimized = ref(false);

const toggleMinimize = async () => {
  isMinimized.value = !isMinimized.value;

  // If we are EXPANDING the chart...
  if (!isMinimized.value) {
    await nextTick(); // ...wait for the container to become visible...
    // ...and tell Plotly to resize to fit the container.
    if (plotlyChart.value) {
      Plotly.Plots.resize(plotlyChart.value);
    }
  }
};

const renderChart = () => {
  if (isMinimized.value || !plotlyChart.value || !props.xData.length || !props.yData.length) return;

  const trace = {
    x: props.xData,
    y: props.yData,
    mode: 'markers',
    type: 'scatter',
    marker: {
      size: props.xData.map((_, index) => index === props.highlightedIndex ? 12 : 8),
      color: props.colors,
      colorscale: 'Viridis',
      showscale: false
    }
  };

  const layout = {

    autosize: true,
    xaxis: {
      title: { text: 'Normalized Difference Vegetation Index', font: { size: 14 } },
      automargin: true
    },
    yaxis: {
      title: { text: 'Heat Exposure Index', font: { size: 14 } },
      automargin: true
    },
    
    margin: { t: 20, b: 50, l: 80, r: 10 } // Adjusted top margin after removing title
  };

  Plotly.newPlot(plotlyChart.value, [trace], layout).then((chart) => {
    chart.on('plotly_click', (data) => {
      const clickedXValue = data.points[0].x;
      emit('highlightFeature', clickedXValue);
    });
  });
};

watch([() => props.xData, () => props.yData, () => props.colors, () => props.highlightedIndex], async () => {
  await nextTick();
  renderChart();
}, { deep: true });

onMounted(() => {
  renderChart();
});
</script>

<style scoped>
.chart-container {
  height: 400px; /* Or whatever height you prefer */
  padding: 16px;
}

.plotly-chart {
  width: 100%;
  height: 100%;
}
</style>