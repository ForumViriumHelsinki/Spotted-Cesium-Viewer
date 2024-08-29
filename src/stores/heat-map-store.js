import { defineStore } from 'pinia';

export const useHeatMapStore = defineStore('heatMapStore', {
  state: () => ({
    url: 'assets/data/Spotted-Kivela-Buildings.json',
    heatMapData: null,
    selectedMetric: 'Heat Exposure',
    selectedYear: 2024,
    center: [24.916831, 60.177559],
    zoom: 14,    
  }),
  actions: {
    async fetchHeatMapData() {
      if (!this.heatMapData) {
        try {
          const response = await fetch(this.url);
          const data = await response.json();
          this.heatMapData = data;
        } catch (error) {
          console.error('Error fetching heat map data:', error);
        }
      }
    },
    setCenter(center) {
      this.center = center;
    },
    setZoom(zoom) {
      this.zoom = zoom;
    },     
    setUrl(url) {
      this.url = url;
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