<template>
    <div id="plotly-chart" ref="chartContainer"></div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useHeatMapStore } from '../stores/heat-map-store'; // Import the Pinia store

const chartContainer = ref(null); // Reference to the chart container
const store = useHeatMapStore(); // Use the Pinia store

// Function to create heat exposure bar chart
const createHeatExposureChart = (data) => {
  const numberOfBins = 20;
  const binSize = 1 / numberOfBins;

  let bins = Array(numberOfBins).fill(0);
  let colors = [];
  let missingDataCount = 0;

  data.forEach(value => {
    if (value === -1) {
      missingDataCount++;
    } else {
      let binIndex = Math.min(Math.floor(value / binSize), numberOfBins - 1);
      bins[binIndex]++;
    }
  });

  for (let i = 0; i < numberOfBins; i++) {
    const midpoint = (i + 0.5) * binSize;
    const r = 2 * Math.abs(midpoint - 0.5);
    const a = 0.8;

    let color;
    if (midpoint <= 0.5) {
      color = `rgba(0, ${255 * (1 - r)}, 255, ${a})`;
    } else {
      color = `rgba(255, ${255 * (1 - r)}, 0, ${a})`;
    }
    colors.push(color);
  }

  colors.unshift('#eaeaea');
  const xValues = ['Missing Data'].concat(bins.map((_, i) => `${(i * binSize).toFixed(2)}-${((i + 1) * binSize).toFixed(2)}`));
  const yValues = [missingDataCount].concat(bins);
  const barColors = ['#eaeaea'].concat(colors);

  const plotData = {
    x: xValues,
    y: yValues,
    type: 'bar',
    marker: {
      color: barColors
    }
  };

  const layout = {
    title: 'Heat Exposure Distribution',
    bargap: 0.1,
    xaxis: { title: 'Heat Exposure Ranges' },
    yaxis: { title: 'Quantity of Areas' }
  };

  Plotly.newPlot(chartContainer.value, [plotData], layout);
};

// Function to create heat risk bar chart
const createHeatRiskChart = (data) => {
  const bins = [
    { label: "Missing Data", count: 0, color: '#ffffff' },
    { label: "0.00-0.20", count: 0, color: '#ffffcc' },
    { label: "0.20-0.40", count: 0, color: '#ffeda0' },
    { label: "0.40-0.60", count: 0, color: '#feb24c' },
    { label: "0.60-0.80", count: 0, color: '#f03b20' },
    { label: "0.80-1.00", count: 0, color: '#bd0026' }
  ];

  data.forEach(value => {
    if (value === -1) {
      bins[0].count++;
    } else if (value >= 0 && value < 0.2) {
      bins[1].count++;
    } else if (value >= 0.2 && value < 0.4) {
      bins[2].count++;
    } else if (value >= 0.4 && value < 0.6) {
      bins[3].count++;
    } else if (value >= 0.6 && value < 0.8) {
      bins[4].count++;
    } else if (value >= 0.8 && value <= 1) {
      bins[5].count++;
    }
  });

  const xValues = bins.map(bin => bin.label);
  const yValues = bins.map(bin => bin.count);
  const barColors = bins.map(bin => bin.color);

  const plotData = {
    x: xValues,
    y: yValues,
    type: 'bar',
    marker: {
      color: barColors
    }
  };

  const layout = {
    title: 'Heat Risk Distribution',
    bargap: 0.1,
    xaxis: { title: 'Heat Risk Ranges' },
    yaxis: { title: 'Quantity of Areas' }
  };

  Plotly.newPlot(chartContainer.value, [plotData], layout);
};

// Watch store changes to update the chart
watch(
  () => [store.heatMapData, store.selectedMetric, store.selectedYear],
  () => {
    if (!store.heatMapData) return;

    const data = store.heatMapData.features.map(feature => feature.properties[`mean${store.selectedMetric === 'Heat Exposure' ? '_e_' : '_r_'}${store.selectedYear}`] || -1);
    
    if (store.selectedMetric === 'Heat Exposure') {
      createHeatExposureChart(data);
    } else {
      createHeatRiskChart(data);
    }
  },
  { immediate: true } // Ensure chart is updated immediately upon component mount
);

onMounted(() => {
  // Initial chart update
  if (store.heatMapData) {
    const data = store.heatMapData.features.map(feature => feature.properties[`mean${store.selectedMetric === 'Heat Exposure' ? '_e_' : '_r_'}${store.selectedYear}`] || -1);
    
    if (store.selectedMetric === 'Heat Exposure') {
      createHeatExposureChart(data);
    } else {
      createHeatRiskChart(data);
    }
  }
});
</script>

<style scoped>
#plotly-chart {
  height: 300px; /* Adjust as needed */
  width: 400px;
	border: 1px solid black;
	box-shadow: 3px 5px 5px black; }
</style>