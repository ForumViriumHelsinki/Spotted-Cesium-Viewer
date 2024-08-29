import { defineStore } from 'pinia';

export const useHeatMapStore = defineStore('heatMapStore', {
  state: () => ({
    heatMapData: null,
    selectedMetric: 'Heat Exposure',
    selectedYear: 2024
  }),
  actions: {
    async fetchHeatMapData() {
      if (!this.heatMapData) {
        try {
          const response = await fetch('assets/data/Spotted-Kivela-Buildings.json');
          const data = await response.json();
          this.heatMapData = data;
        } catch (error) {
          console.error('Error fetching heat map data:', error);
        }
      }
    },
    setHeatMapData(data) {
      this.heatMapData = data;
    },
    setSelectedMetric(index) {
      this.selectedMetric = index;
    },  
      setSelectedYear(year) {
      this.selectedYear = year;
    },   
  },
});