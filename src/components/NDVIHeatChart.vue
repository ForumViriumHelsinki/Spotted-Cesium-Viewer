<template>
  <div ref="plotlyChart" class="plotly-chart"></div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, defineEmits } from 'vue';

// Props: xData, yData, colors, highlightedIndex
const props = defineProps({
  xData: Array,
  yData: Array,
  colors: Array,
  highlightedIndex: {  // New prop for highlighted index
    type: Number,
    default: null  // Default to null (no highlight)
  }
});

// Emit event when a point is clicked
const emit = defineEmits(['highlightFeature']);

const plotlyChart = ref(null);

// Function to render Plotly chart
const renderChart = () => {
  if (!plotlyChart.value || !props.xData.length || !props.yData.length) return;

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
    title: {
      text: 'NDVI vs Heat Exposure',
      font: { size: 18 },
      x: 0.5,
      xanchor: 'center'
    },
    xaxis: {
      title: { text: 'Normalized Difference Vegetation Index', font: { size: 14 } },
      automargin: true
    },
    yaxis: {
      title: { text: 'Heat Exposure Index', font: { size: 14 } },
      automargin: true
    },
    height: 450,
    margin: { t: 60, b: 50, l: 80, r: 10 }
  };

  Plotly.newPlot(plotlyChart.value, [trace], layout).then((chart) => {
    chart.on('plotly_click', (data) => {
      const clickedXValue = data.points[0].x; // Get the x value
      emit('highlightFeature', clickedXValue);
    });
  });
};

// Re-render chart when data changes
watch([() => props.xData, () => props.yData, () => props.colors, () => props.highlightedIndex], async () => {
  await nextTick();
  renderChart();
}, { deep: true });

// Render chart on mount
onMounted(() => {
  renderChart();
});
</script>

<style scoped>
.plotly-chart {
  width: 100%;
  height: 100%;
}
</style>