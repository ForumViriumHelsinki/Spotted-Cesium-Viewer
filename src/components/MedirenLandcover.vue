<template>
  <div ref="landcoverChart" class="landcover-chart"></div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, defineProps } from 'vue';

// Props: landcoverData (geojson data), selectedYear
const props = defineProps({
  landcoverData: Array, // Geojson landcover data
  selectedYear: String  // Year of interest, e.g., "2024"
});

const landcoverChart = ref(null);

// Function to calculate landcover percentages
const getLandcoverPercentages = () => {
  if (!props.landcoverData || !props.selectedYear) return [];

  const percentages = [];

  // Iterate over the geojson data
  props.landcoverData.forEach(item => {
    const area_m2 = item['area'];  // Assuming each item has `area_m2`

    if (!area_m2) return;

    // Calculate land cover percentages
    const vegetation = (item[`vegetation`] || 0) +
                       (item[`field`] || 0);
    const trees = (item[`tree10`] || 0) +
                  (item[`tree15`] || 0) +
                  (item[`tree2`] || 0) +
                  (item[`tree20`] || 0);
    const water = (item[`water`] || 0) +
                  (item[`sea`] || 0);

    // Calculate other (1 - sum of Trees, Vegetation, Water)
    const other = 100 - ((trees + vegetation + water) / area_m2) * 100;

    // Add the percentages for the item
    percentages.push({
      address: item.address,
      trees: (trees / area_m2) * 100,
      vegetation: (vegetation / area_m2) * 100,
      water: (water / area_m2) * 100,
      other: other,
    });
  });

  return percentages;
};

// Function to render Plotly chart
const renderChart = () => {
  if (props.landcoverData.length < 1 || !props.landcoverData.length || !props.selectedYear) return;

  const data = getLandcoverPercentages();

  // Prepare the data for the reversed bar chart
  const trace = {
    type: 'bar',
    orientation: 'h',
    x: [],
    y: [],
    width: 0.5,
    marker: {
        color: [],
    },
  };

  // Prepare the chart data based on calculated percentages
  data.forEach(item => {
    trace.x.push(item.trees, item.vegetation, item.water, item.other); // X-axis: percentage values
    trace.y.push(item.address, item.address, item.address, item.address); // Y-axis: the same address (one per category)
    trace.marker.color.push('#2ca02c', '#90EE90', '#1f77b4', '#808080'); // Colors: Trees, Vegetation, Water, Other
  });

  const layout = {
    title: {
      text: `Landcover Distribution (${props.selectedYear})`,
      font: { size: 12 },
    },
    xaxis: {
      title: 'Percentage (%)',
      range: [0, 100], // Full range from 0% to 100%
    },
  yaxis: {
    title: {
      text: 'Address',
      font: { size: 10 }, // Smaller font for y-axis title
    },
    automargin: true,
    tickfont: { size: 8 }, // Smaller font for y-axis labels
  },
    height: 720, // Adjust for space
    margin: { t: 50, b: 50, l: 100, r: 25 },
  bargap: 0,  // Reduce gap between bars
  bargroupgap: 0, // Reduce gap between grouped bars
  barmode: 'group', // 'group' (default), 'stack', or 'overlay'
  };

  Plotly.newPlot(landcoverChart.value, [trace], layout);
};

// Re-render chart when data changes
watch([() => props.landcoverData, () => props.selectedYear], async () => {
  await nextTick();
  props.landcoverData.length > 1 && props.selectedYear && renderChart();
}, { deep: true });

// Render chart on mount
onMounted(() => {
  renderChart();
});
</script>

<style scoped>

</style>
