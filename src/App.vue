<template>
  <div id="app">
    <transition name="fade">
    <div id="canvasScalerDiv" v-if="activeViewer === 'Cesium'">
      <CesiumViewer />
      <ControlPanel />
    </div>
    </transition>
    <transition name="fade">
    <div id="ol" v-if="activeViewer === 'OpenLayersSatellite'">
      <SatelliteViewer />
    </div>
    </transition>
    <transition name="fade">
    <div id="ol" v-if="activeViewer === 'OpenLayersHeat'">
      <HeatMap />
    </div>
    </transition>
    <div class="logoHolder">
      <img src="/public/assets/images/spotted_logo.png" id="logoSpotted" alt="Spotted" />
      <img src="/public/assets/images/fvh-1_musta.png" id="logoFVH" alt="Forum Virium Helsinki" />
    </div>
  </div>
</template>

<script setup>
import { useGlobalStore } from './stores/global-store.js';
import { computed } from 'vue';
import CesiumViewer from './components/CesiumViewer.vue';
import ControlPanel from './components/ControlPanel.vue';
import SatelliteViewer from './components/SatelliteViewer.vue';
import HeatMap from './components/HeatMap.vue';

const globalStore = useGlobalStore();
const activeViewer = computed(() => globalStore.activeViewer);
</script>