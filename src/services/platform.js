import * as Cesium from 'cesium';
import Datasource from './datasource.js'; 
import Plot from './plot.js';
import Ndvi from './ndvi.js';
import Cache from './cache.js'; 
import { useGlobalStore } from '../stores/global-store.js';

export default class Ndviarea {
	constructor() {
		this.store = useGlobalStore();
		this.datasourceService = new Datasource();
		this.plotService = new Plot();
		this.cacheService = new Cache();
		this.ndviService = new Ndvi();
	}

	dataForHistogram( entities, fileName, name ) {
		let propertyValuesList = [];

		entities.forEach( function( entity ) {

			// Replace 'attributeName' with the name of the property you're interested in
			let value = entity.properties[ 'max' ].getValue();
			if ( value ) {

				propertyValuesList.push( value );

			} else {

				propertyValuesList.push( -1 );

			}
		
		} );

		const plotService = new Plot();

		if ( name === 'Urban Heat Risk' ) {

			plotService.createPlatformRiskBarChart( propertyValuesList, parseFileName( fileName ) );

		} else {

			plotService.createNDVIHistogram( propertyValuesList );

		}
	}

	/**
   * Add the features with ndvi data as a new data source to the Cesium
   * 
   * @param { object } data features with ndvi
   * @param { Number } name name of the datasource
   */
	async addPlatformFeaturesWithNDVI( data, name, fileName ) {

    	let entities = await this.datasourceService.addDataSourceWithPolygonFix( data, name );
		this.store.ndviAreaDataSourceName = name;
		this.setColorAndLabelForPlatformGreenEntities( entities );
		this.dataForHistogram( entities, fileName, name );
	}

	async addPlatformFeaturesWithHeat( data, name, fileName ) {

    	let entities = await this.datasourceService.addDataSourceWithPolygonFix( data, name );
		this.store.ndviAreaDataSourceName = name;
		this.setColorAndLabelForPlatformHeatEntities( entities );
		this.dataForHistogram( entities, fileName, name );
	}

	async addPlatformFeaturesWithRisk( data, name, fileName ) {

    	let entities = await this.datasourceService.addDataSourceWithPolygonFix( data, name );
		this.store.ndviAreaDataSourceName = name;
		this.setColorAndLabelForPlatformRiskEntities( entities );
		this.dataForHistogram( entities, fileName, name );
	}



	setColorAndLabelForPlatformGreenEntities( entities ) {
		for ( let i = 0; i < entities.length; i++ ) {
			let entity = entities[i];

			if ( entity._properties[ 'max' ] ) {

			    const color = this.ndviService.setNDVIPolygonMaterialColor( entity, 'max' );
			    // Set polygon color
			    entity.polygon.material = color;
			    entity.polygon.outline = true; // Optional: Set to false if no outline is desired
			    entity.polygon.outlineColor = Cesium.Color.BLACK;

			}

		}
	}

	setColorAndLabelForPlatformHeatEntities( entities ) {
		for ( let i = 0; i < entities.length; i++ ) {
			let entity = entities[i];

			if ( entity._properties[ 'max' ] ) {

			    const color = new Cesium.Color( 1, 1 - entity._properties._max._value, 0, entity._properties._max._value );
			    // Set polygon color
			    entity.polygon.material = color;
			    entity.polygon.outline = true; // Optional: Set to false if no outline is desired
			    entity.polygon.outlineColor = Cesium.Color.BLACK;

			}

		}
	}	

	setColorAndLabelForPlatformRiskEntities( entities ) {
		for ( let i = 0; i < entities.length; i++ ) {
			let entity = entities[i];
			
			const color = getColorForIndex( entity._properties._max._value );
			    // Set polygon color
			entity.polygon.material = color;
			entity.polygon.outline = true; // Optional: Set to false if no outline is desired
			entity.polygon.outlineColor = Cesium.Color.BLACK;

		}
	}	
		
}

// Function to determine the color based on the index value
const getColorForIndex = (indexValue) => {
  if (indexValue) {
    if (indexValue < 0.2) return Cesium.Color.fromCssColorString('#ffffcc').withAlpha(0.8);
    if (indexValue < 0.4) return Cesium.Color.fromCssColorString('#ffeda0').withAlpha(0.8);
    if (indexValue < 0.6) return Cesium.Color.fromCssColorString('#feb24c').withAlpha(0.8);
    if (indexValue < 0.8) return Cesium.Color.fromCssColorString('#f03b20').withAlpha(0.8);
    return Cesium.Color.fromCssColorString('#bd0026').withAlpha(0.8);
  } 
  return Cesium.Color.WHITE.withAlpha(0.8); // Default to white if no data
};

const parseFileName = (fileName) => {
    // Define the possible patterns for extracting dataset name and date
    const patterns = ["urbanheatwaverisk", "urbangreenindex", "urbanheatexposure"];

    let datasetName = "";
    let date = "";

    // Iterate over the patterns to find the correct split points
    for (let pattern of patterns) {
        if (fileName.includes(pattern)) {
            // Split the string based on the pattern to isolate the relevant portions
            const regex = new RegExp(`-${pattern}-(.*)-([0-9_]+)_${pattern}`);
            const match = fileName.match(regex);
            
            if (match && match.length === 3) {
                datasetName = match[1];  // The dataset name
                date = match[2];         // The date
            }
            break;
        }
    }

    return { datasetName, date };
};
