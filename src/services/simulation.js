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


  updateSimulation() {
    const property = this.ndviProperties[this.currentPropertyIndex];
    this.updateLegend( property );  // Update the legend with the current month
    this.entities.forEach((entity) => {
        const avgndvi = Number( entity._properties[ property ]._value );
        entity.polygon.material = setNDVIPolygonMaterialColor(avgndvi);
    });
    this.currentPropertyIndex = (this.currentPropertyIndex + 1) % this.ndviProperties.length;
  }

  async startSimulation() { 
    this.createLegend(); 
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

createLegend() {
    this.legendContainer = document.createElement('div');
    this.legendContainer.id = 'ndviLegend';
    this.legendContainer.classList.add('legend');
    this.updateLegend( this.ndviProperties[ 0 ] );

    this.viewer.container.appendChild( this.legendContainer );
}

updateLegend(currentProperty) {
    this.legendContainer.innerHTML = ""; 

    const thresholds = [-0.1, 0.01, 0.11, 0.21, 0.31, 0.41, 0.51, 0.61]; 
    const labels = [ '-0.5 - 0', '0 - 0.1', '0.1 - 0.2', '0.2 - 0.3', '0.3 - 0.4', '0.4 - 0.5', '0.5 - 0.6', ' 0.6 - 1' ]

    for ( let i = 0; i < thresholds.length; i++ ) {

        const color = setNDVIPolygonMaterialColor( thresholds[ i ] ); // Fixed call to setNDVIPolygonMaterialColor
        const label = labels[ i ];

        const swatch = document.createElement('div');
        swatch.classList.add('swatch');
        swatch.style.backgroundColor = color.toCssColorString();
        const text = document.createElement('span');
        text.textContent = label;
        swatch.appendChild( text );
        this.legendContainer.appendChild( swatch );

    }


    // Add current month to the legend
    const monthLabel = document.createElement('div');
    const monthString = currentProperty.replace('ndvi_', ''); // Remove the "ndvi_" prefix

    // Capitalize the first letter and add a space before the year
    monthLabel.textContent = monthString.charAt(0).toUpperCase() + monthString.slice(1).replace(/\d/, ' $&'); 

    this.legendContainer.appendChild(monthLabel);
}
}

const setNDVIPolygonMaterialColor = ( avgndvi ) => {

		if ( avgndvi <= 0 ) {
			return Cesium.Color.fromBytes( 234, 234, 234 ); // #eaeaea
		} else if ( avgndvi > 0.0 && avgndvi <= 0.1 ) {
			return Cesium.Color.fromBytes( 204, 198, 130 ); // #ccc682
		} else if ( avgndvi > 0.1 && avgndvi <= 0.2 ) {
			return Cesium.Color.fromBytes( 145, 191, 81 ); // #91bf51
		} else if ( avgndvi > 0.2 && avgndvi <= 0.3 ) {
			return Cesium.Color.fromBytes( 112, 163, 63 ); // #70a33f
		} else if ( avgndvi > 0.3 && avgndvi <= 0.4 ) {
			return Cesium.Color.fromBytes( 79, 137, 45 ); // #4f892d
		} else if ( avgndvi > 0.4 && avgndvi <= 0.5 ) {
			return Cesium.Color.fromBytes( 48, 109, 28 ); // #306d1c
		} else if ( avgndvi > 0.5 && avgndvi <= 0.6 ) {
			return Cesium.Color.fromBytes( 15, 84, 10 ); // #0f540a
		} else if ( avgndvi > 0.6 ) {
			return Cesium.Color.fromBytes( 0, 68, 0 ); // #004400
		}
}