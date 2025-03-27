<template>
  <div id="app">
    <!-- Show logo selection screen when no viewer is selected -->
    <div v-if="!activeViewer" class="logoSelection">
      <img
        src="/public/assets/images/spotted_logo.png"
        alt="Spotted"
        class="logo"
        @click="setViewer('Cesium')"
      />
      <img
        src="/public/assets/images/MED-IREN-final_grey-on-blue_horizontal-200x0-c-default.png"
        alt="Mediren"
        class="logo"
        @click="setViewer('mediren')"
      />
    </div>

    <transition name="fade">
      <Spotted v-if="activeViewer === 'Cesium'" />
    </transition>

    <transition name="fade">
      <Mediren v-if="activeViewer === 'mediren'" />
    </transition>  

    <div class="logoHolder" v-if="activeViewer === 'mediren'">
      <img src="/public/assets/images/MED-IREN-final_grey-on-blue_horizontal-200x0-c-default.png" id="logoSpotted" alt="Spotted" />
      <img src="/public/assets/images/fvh-1_musta.png" id="logoFVH" alt="Forum Virium Helsinki" />
    </div>
    <div class="logoHolder" v-if="activeViewer === 'Cesium' || activeViewer === 'OpenLayersSatellite' || activeViewer === 'OpenLayersHeat'">
      <img src="/public/assets/images/spotted_logo.png" id="logoSpotted" alt="Spotted" />
      <img src="/public/assets/images/fvh-1_musta.png" id="logoFVH" alt="Forum Virium Helsinki" />
    </div>    
  </div>
</template>

<script setup>
import { useGlobalStore } from './stores/global-store.js';
import { computed } from 'vue';
import Mediren from './components/Mediren.vue';
import Spotted from './components/Spotted.vue';

const globalStore = useGlobalStore();
const activeViewer = computed(() => globalStore.activeViewer);

const setViewer = (viewer) => {
  globalStore.activeViewer = viewer;
};
</script>

<style scoped>
.logoSelection {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  gap: 50px;
}

.logo {
  width: 200px;
  cursor: pointer;
  transition: transform 0.3s;
}

.logo:hover {
  transform: scale(1.1);
}
</style>