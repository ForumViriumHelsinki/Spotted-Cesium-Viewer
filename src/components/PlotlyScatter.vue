<template>
  <div ref="plotlyChart" class="plotly-chart"></div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, defineEmits } from 'vue';

// Props: xData (NDVI), yData (Heat Exposure)
const props = defineProps({
  xData: Array,
  yData: Array,
  colors: Array  // <-- Add this prop
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
      size: 8,
      color: props.colors, // <-- Use colors prop
      colorscale: 'Viridis',
      showscale: false
    }
  };

const layout = {
  title: {
    text: 'NDVI vs Heat Exposure',
    font: { size: 18 }, // Increase font size for better visibility
    x: 0.5, // Center the title
    xanchor: 'center'
  },
  xaxis: {
    title: { text: 'Normalized Difference Vegetation Index', font: { size: 14 } },
    automargin: true // Ensures labels don't get cut off
  },
  yaxis: {
    title: { text: 'Heat Exposure Index', font: { size: 14 } },
    automargin: true
  },
  height: 450, // Ensures space for labels
  margin: { t: 60, b: 50, l: 80, r: 10 } // Adjust margins to prevent text cutoff
};

  Plotly.newPlot(plotlyChart.value, [trace], layout).then((chart) => {
    chart.on('plotly_click', (data) => {
      const pointIndex = data.points[0].pointIndex; // Get index of clicked point
      emit('highlightFeature', pointIndex); // Emit event to parent component
    });
  });
};

// Re-render chart when data changes
watch([() => props.xData, () => props.yData, () => props.colors], async () => {
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
  height: 400px;
}
</style>
