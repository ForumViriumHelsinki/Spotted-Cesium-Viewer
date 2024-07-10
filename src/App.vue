<template>

<div id="canvasScalerDiv">
  <CesiumViewer />
  <PrintBox />
  <ControlPanel />
  <PopulationPressure />
  <NdviArea />
  <YlreAnnual />
  <MonthlyNDVI />
  <DistrictNDVI />
  <PieChart />

  <!-- Add Logo -->		
	<div class="logoHolder">	
	<img src="/public/assets/images/spotted_logo.png" id="logoSpotted" alt="Spotted" />
	<img src="/public/assets/images/fvh-1_musta.png" id="logoFVH" alt="Forum Virium Helsinki" />
  </div>
  
  </div>
</template>

<script setup>
import CesiumViewer from './components/CesiumViewer.vue';
import PrintBox from './components/PrintBox.vue';
import ControlPanel from './components/ControlPanel.vue';
import PopulationPressure from './components/PopulationPressure.vue';
import NdviArea from './components/NdviArea.vue';
import YlreAnnual from './components/YlreAnnual.vue';
import MonthlyNDVI from './components/MonthlyNDVI.vue';
import DistrictNDVI from './components/DistrictNDVI.vue';
import PieChart from './components/PieChart.vue';

</script>