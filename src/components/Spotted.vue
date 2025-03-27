<template>
  <div>
    <transition name="fade">
      <div id="canvasScalerDiv" v-if="activeViewer === 'Cesium'">
        <CesiumViewer />
        <ControlPanel />
      </div>
    </transition>

    <transition name="fade">
      <div v-if="activeViewer === 'OpenLayersSatellite'">
        <SatelliteViewer />
      </div>
    </transition>

    <transition name="fade">
      <div v-if="activeViewer === 'OpenLayersHeat'">
        <HeatMap />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { useGlobalStore } from '../stores/global-store.js';
import { computed } from 'vue';
import CesiumViewer from './CesiumViewer.vue';
import ControlPanel from './ControlPanel.vue';
import SatelliteViewer from './SatelliteViewer.vue';
import HeatMap from './HeatMap.vue';

const globalStore = useGlobalStore();
const activeViewer = computed(() => globalStore.activeViewer);
</script>
