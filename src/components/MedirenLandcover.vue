<template>
  <div ref="landcoverChart" class="landcover-chart"></div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, defineProps, defineEmits } from 'vue'; // Import defineEmits

// Props: landcoverData (geojson data), selectedYear
const props = defineProps({
  landcoverData: Array,
  selectedYear: String
});

const emit = defineEmits(['zoomToAddress']); // Define the custom event

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

  // Sort the percentages array by the 'trees' property in ascending order
  percentages.sort( ( a, b ) => a.trees - b.trees );

  return percentages;
};

const renderChart = () => {
  if (props.landcoverData.length < 1 || !props.landcoverData.length || !props.selectedYear) return;

  const data = getLandcoverPercentages();

  const trace = {
    type: 'bar',
    orientation: 'h',
    x: [],
    y: [],
    width: 0.5,
    marker: {
      color: [],
    },
    text: [], // Add text for the address
    hoverinfo: 'none' // Remove hover info
  };

  data.forEach(item => {
    trace.x.push(item.trees, item.vegetation, item.water, item.other);
    trace.y.push(item.address, item.address, item.address, item.address);
    trace.marker.color.push('#2ca02c', '#90EE90', '#1f77b4', '#808080');
    trace.text.push(item.address, item.address, item.address, item.address); // Add the address
  });

  const layout = {
    title: {
      text: `Landcover Distribution (${props.selectedYear})`,
      font: { size: 12 },
    },
    xaxis: {
      title: 'Percentage (%)',
      range: [0, 100],
    },
    yaxis: {
      title: {
        text: 'Address',
        font: { size: 10 },
      },
      automargin: true,
      tickfont: { size: 8 },
    },
    height: 720,
    margin: { t: 50, b: 50, l: 100, r: 25 },
    bargap: 0,
    bargroupgap: 0,
    barmode: 'group',
    clickmode: 'event', // Enable click events
  };

  Plotly.newPlot(landcoverChart.value, [trace], layout).then((chart) => {
    chart.on('plotly_click', (data) => {
      if (data.points && data.points.length > 0) {
        const clickedAddress = data.points[0].data.text[data.points[0].pointNumber];
        emit('zoomToAddress', clickedAddress); // Emit the custom event
      }
    });
  });
};

watch([() => props.landcoverData, () => props.selectedYear], async () => {
  await nextTick();
  props.landcoverData.length > 1 && props.selectedYear && renderChart();
}, { deep: true });

onMounted(() => {
  renderChart();
});
</script>

<style scoped>
.landcover-chart {
  width: 100%;
  height: 100%;
}
</style>