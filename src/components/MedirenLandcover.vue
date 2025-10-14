<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      Landcover Distribution ({{ props.selectedYear }})
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
      <div ref="landcoverChart" class="landcover-chart"></div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted, watch, nextTick, defineProps, defineEmits } from 'vue';

const props = defineProps({
  landcoverData: Array,
  selectedYear: String
});

const emit = defineEmits(['zoomToAddress']);
const landcoverChart = ref(null);
const isMinimized = ref(false);

// 2. Function to toggle the chart's state
const toggleMinimize = async () => {
  isMinimized.value = !isMinimized.value;

  // When we EXPAND the chart
  if (!isMinimized.value) {
    await nextTick(); // Wait for the DOM element to become visible
    // CHANGED: Use Plotly's dedicated resize function.
    // This tells the existing chart to fit its container.
    if (landcoverChart.value) {
      Plotly.Plots.resize(landcoverChart.value);
    }
  }
};

const getLandcoverPercentages = () => {
  if (!props.landcoverData || !props.selectedYear) return [];

  const percentages = [];

  props.landcoverData.forEach(item => {
    const area_m2 = item['area'];
    if (!area_m2) return;

    const vegetation = (item[`vegetation`] || 0) + (item[`field`] || 0);
    const trees = (item[`tree10`] || 0) + (item[`tree15`] || 0) + (item[`tree2`] || 0) + (item[`tree20`] || 0);
    const water = (item[`water`] || 0) + (item[`sea`] || 0);
    const other = 100 - ((trees + vegetation + water) / area_m2) * 100;

    percentages.push({
      address: item.address,
      trees: (trees / area_m2) * 100,
      vegetation: (vegetation / area_m2) * 100,
      water: (water / area_m2) * 100,
      other: other,
    });
  });

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
    marker: { color: [] },
    text: [],
    hoverinfo: 'none'
  };

  data.forEach(item => {
    trace.x.push(item.trees, item.vegetation, item.water, item.other);
    trace.y.push(item.address, item.address, item.address, item.address);
    trace.marker.color.push('#2ca02c', '#90EE90', '#1f77b4', '#808080');
    trace.text.push(item.address, item.address, item.address, item.address);
  });

  const layout = {
    // ADDED: This is crucial for responsive resizing.
    autosize: true,
    xaxis: {
      title: 'Percentage (%)',
      range: [0, 100],
    },
    yaxis: {
      title: { text: 'Address', font: { size: 10 } },
      automargin: true,
      tickfont: { size: 8 },
    },
    margin: { t: 20, b: 50, l: 100, r: 25 },
    bargap: 0,
    bargroupgap: 0,
    barmode: 'group',
    clickmode: 'event',
  };

  Plotly.newPlot(landcoverChart.value, [trace], layout).then((chart) => {
    chart.on('plotly_click', (data) => {
      if (data.points && data.points.length > 0) {
        const clickedAddress = data.points[0].data.text[data.points[0].pointNumber];
        emit('zoomToAddress', clickedAddress);
      }
    });
  });
};

watch([() => props.landcoverData, () => props.selectedYear], async () => {
  await nextTick();
  if (props.landcoverData.length > 1 && props.selectedYear) {
      renderChart();
  }
}, { deep: true });

onMounted(() => {
  renderChart();
});
</script>

<style scoped>
/* This is the container that will be animated */
.chart-container {
  /* Define the expanded height */
  height: 720px;
  /* Add a smooth transition for the height property */
  transition: height 0.3s ease-in-out;
  overflow: hidden; /* Hide the chart content when height is 0 */
  padding: 16px; /* Default padding for v-card-text */
}

/* When minimized, set the height to 0 and remove padding */
.chart-container.minimized {
  height: 0;
  padding-top: 0;
  padding-bottom: 0;
}

/* Make the Plotly div fill its container */
.landcover-chart {
  width: 100%;
  height: 100%;
}
</style>