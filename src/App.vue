<template>

<div id="canvasScalerDiv">
  <CesiumViewer />
  <ControlPanel />
  <SatelliteViewer />

  <!-- Add Logo -->		
	<div class="logoHolder">	
	<img src="/public/assets/images/spotted_logo.png" id="logoSpotted" alt="Spotted" />
	<img src="/public/assets/images/fvh-1_musta.png" id="logoFVH" alt="Forum Virium Helsinki" />
  </div>
  
  </div>
</template>

<script setup>
import CesiumViewer from './components/CesiumViewer.vue';
import ControlPanel from './components/ControlPanel.vue';
import SatelliteViewer from './components/SatelliteViewer.vue';

</script>