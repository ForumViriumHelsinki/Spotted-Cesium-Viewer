<template>
  <v-container>
    <v-row>
      <v-col>
        <v-select
          v-model="selectedMetric"
          :items="metrics"
          label="Select Metric"
        ></v-select>
      </v-col>
      <v-col>
        <v-slider
          v-model="selectedYear"
          :min="2020"
          :max="2024"
          step="1"
          label="Select Year"
        ></v-slider>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, watch } from 'vue';
import { eventBus } from '../services/event-emitter.js';

const metrics = ['Heat Exposure', 'Heat Risk'];
const selectedMetric = ref('Heat Exposure');
const selectedYear = ref(2024);

watch([selectedMetric, selectedYear], () => {
  eventBus.$emit('updateVisualization', selectedMetric.value, selectedYear.value);
});
</script>