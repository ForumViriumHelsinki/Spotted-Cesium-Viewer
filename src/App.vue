<template>
  <div id="app">
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
    <transition name="fade">
    <div v-if="activeViewer === 'mediren'">
      <MedirenScatter />
    </div>
    </transition>    
    <div class="logoHolder" v-if="activeViewer === 'mediren'">
      <img src="/public/assets/images/MED-IREN-final_grey-on-blue_horizontal-200x0-c-default.png" id="logoSpotted" alt="Spotted" />
      <img src="/public/assets/images/fvh-1_musta.png" id="logoFVH" alt="Forum Virium Helsinki" />
    </div>
    <div class="logoHolder" v-if="activeViewer !== 'mediren'">
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
import MedirenScatter from './components/MedirenScatter.vue';

const globalStore = useGlobalStore();
const activeViewer = computed(() => globalStore.activeViewer);
</script>