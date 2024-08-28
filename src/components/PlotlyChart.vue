<template>
  <div id="plotContainer" class="plot-container"></div>
</template>

<script setup>
import { watch, onMounted } from 'vue';

// Props to receive selectedMetric, selectedYear, and data from parent
const props = defineProps({
  selectedMetric: String,
  selectedYear: Number,
  data: Array,
});

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
    const alpha = 2 * Math.abs(midpoint - 0.5);
    let color;

    if (midpoint <= 0.5) {
      color = `rgba(0, ${255 * (1 - alpha)}, 255, ${0.8})`; // Blueish color
    } else {
      color = `rgba(255, ${255 * (1 - alpha)}, 0, ${0.8})`; // Reddish color
    }
    colors.push(color);
  }

  colors.unshift('#eaeaea'); // Missing data color
  const xValues = ['Missing Data'].concat(bins.map((_, i) => `${(i * binSize).toFixed(2)}-${((i + 1) * binSize).toFixed(2)}`));
  const yValues = [missingDataCount].concat(bins);
  const barColors = ['#eaeaea'].concat(colors);

  const plotData = {
    x: xValues,
    y: yValues,
    type: 'bar',
    marker: {
      color: barColors,
    },
  };

  const layout = {
    title: `Heat Exposure for Year ${props.selectedYear}`,
    bargap: 0.1,
    xaxis: { title: 'Heat Exposure Ranges' },
    yaxis: { title: 'Quantity of Areas' },
  };

  Plotly.newPlot('plotContainer', [plotData], layout);
};

const createHeatRiskChart = (data) => {
  const bins = [
    { label: 'Missing Data', count: 0, color: '#eaeaea' },
    { label: '0.00-0.20', count: 0, color: '#ffffcc' },
    { label: '0.20-0.40', count: 0, color: '#ffeda0' },
    { label: '0.40-0.60', count: 0, color: '#feb24c' },
    { label: '0.60-0.80', count: 0, color: '#f03b20' },
    { label: '0.80-1.00', count: 0, color: '#bd0026' },
  ];

  data.forEach(value => {
    if (value === -1) {
      bins[0].count += 1;
    } else if (value >= 0 && value < 0.2) {
      bins[1].count += 1;
    } else if (value >= 0.2 && value < 0.4) {
      bins[2].count += 1;
    } else if (value >= 0.4 && value < 0.6) {
      bins[3].count += 1;
    } else if (value >= 0.6 && value < 0.8) {
      bins[4].count += 1;
    } else if (value >= 0.8 && value <= 1) {
      bins[5].count += 1;
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
      color: barColors,
    },
  };

  const layout = {
    title: `Heat Risk for Year ${props.selectedYear}`,
    bargap: 0.1,
    xaxis: { title: 'Heat Risk Ranges' },
    yaxis: { title: 'Quantity of Areas' },
  };

  Plotly.newPlot('plotContainer', [plotData], layout);
};

// Watch for changes in selectedMetric or selectedYear and update the chart
watch([props.selectedMetric, props.selectedYear, props.data], () => {
  if (props.selectedMetric === 'Heat Exposure') {
    createHeatExposureChart(props.data);
  } else if (props.selectedMetric === 'Heat Risk') {
    createHeatRiskChart(props.data);
  }
});

// Initial render
onMounted(() => {
  if (props.selectedMetric === 'Heat Exposure') {
    createHeatExposureChart(props.data);
  } else if (props.selectedMetric === 'Heat Risk') {
    createHeatRiskChart(props.data);
  }
});
</script>

<style scoped>
#plotContainer
{
	position: fixed;
	top: 10.5%;
	left: 0%;
	width: 35%;
	height: 250px; 
	visibility: hidden;
	
	font-size: 12px;
 	
	border: 1px solid black;
	box-shadow: 3px 5px 5px black; 
}
</style>
