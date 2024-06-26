import * as Cesium from 'cesium';
import { useGlobalStore } from '../stores/global-store.js';

export default class Simulations {
  constructor() {
    this.store = useGlobalStore();
    this.viewer = this.store.cesiumViewer; // Access the viewer from the store
    this.entities = [];
    this.ndviProperties = [
      "ndvi_march2023",
      "ndvi_april2023",
      "ndvi_may2023",
      "ndvi_june2023",
      "ndvi_july2023",
      "ndvi_august2023",
      "ndvi_september2023",
      "ndvi_october2023",
    ];
    this.currentPropertyIndex = 0;
  }

  setNDVIPolygonMaterialColor(entity, property) {
    const avgndvi = Number(entity.properties[property].getValue());

    const colorMap = {
      0: Cesium.Color.fromBytes(234, 234, 234),    // #eaeaea
      0.1: Cesium.Color.fromBytes(204, 198, 130),  // #ccc682
      0.2: Cesium.Color.fromBytes(145, 191, 81),   // #91bf51
      0.3: Cesium.Color.fromBytes(112, 163, 63),   // #70a33f
      0.4: Cesium.Color.fromBytes(79, 137, 45),    // #4f892d
      0.5: Cesium.Color.fromBytes(48, 109, 28),    // #306d1c
      0.6: Cesium.Color.fromBytes(15, 84, 10),     // #0f540a
      Infinity: Cesium.Color.fromBytes(0, 68, 0),   // #004400
    };

    for (let threshold in colorMap) {
      if (avgndvi <= threshold) {
        return colorMap[threshold];
      }
    }
  }

  updateSimulation() {
    const property = this.ndviProperties[this.currentPropertyIndex];
    this.entities.forEach((entity) => {
      entity.polygon.material = this.setNDVIPolygonMaterialColor(entity, property);
    });
    this.currentPropertyIndex = (this.currentPropertyIndex + 1) % this.ndviProperties.length;
  }

  async startSimulation() { 
    const geoJson = await Cesium.GeoJsonDataSource.load(
      "https://geo.fvh.fi/spotted/data/HelsinkiSubDistrict.geojson"
    );
        // Set outline color to black for all entities
    geoJson.entities.values.forEach(entity => {
      if (entity.polygon) {
        entity.polygon.outline = true;
        entity.polygon.outlineColor = Cesium.Color.BLACK;
      }
    });
    this.viewer.dataSources.add(geoJson);
    this.entities = geoJson.entities.values;
    
    setInterval(this.updateSimulation.bind(this), 1000); // Update every second, bound to class instance
  }
}