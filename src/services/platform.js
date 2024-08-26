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

		if ( name === 'Green Index' ) {

			plotService.createPlatformNDVIChart( propertyValuesList, parseFileName( fileName ) );

		} 
		
		if ( name === 'Heat Risk' ) {

			plotService.createPlatformRiskBarChart( propertyValuesList, parseFileName( fileName ) );

		}		
		
		if ( name === 'Heat Exposure' ) {

			plotService.createPlatformHeatExposureChart( propertyValuesList, parseFileName( fileName ) );

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
		setColorAndLabelForPlatformHeatEntities( entities );
		this.dataForHistogram( entities, fileName, name );
	}

	async addPlatformFeaturesWithRisk( data, name, fileName ) {

    	let entities = await this.datasourceService.addDataSourceWithPolygonFix( data, name );
		this.store.ndviAreaDataSourceName = name;
		setColorAndLabelForPlatformRiskEntities( entities );
		this.dataForHistogram( entities, fileName, name );
	}



	setColorAndLabelForPlatformGreenEntities( entities ) {
		for ( let i = 0; i < entities.length; i++ ) {
			let entity = entities[i];

			let color;

			if ( entity._properties[ 'max' ] ) {

			    color = this.ndviService.setNDVIPolygonMaterialColor( entity, 'max' );

			} else {

			    color = Cesium.Color.WHITE.withAlpha(0.8);

			}

			entity.polygon.material = color;
			entity.polygon.outline = true; // Optional: Set to false if no outline is desired
			entity.polygon.outlineColor = Cesium.Color.BLACK;

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

const setColorAndLabelForPlatformRiskEntities = ( entities ) => {
	for ( let i = 0; i < entities.length; i++ ) {
		let entity = entities[i];
			
		const color = getColorForIndex( entity._properties._max._value );
			    // Set polygon color
		entity.polygon.material = color;
		entity.polygon.outline = true; // Optional: Set to false if no outline is desired
		entity.polygon.outlineColor = Cesium.Color.BLACK;

	}
}

// Function to set color and label for heat entities
const setColorAndLabelForPlatformHeatEntities = ( entities  ) => {
    for (let i = 0; i < entities.length; i++) {
        let entity = entities[i];

        if (entity._properties['max'] ) {
            // Assuming your index is in the range [0, 1]
            const index = entity._properties._max._value;
            // Calculate the alpha based on absolute values
            const alpha = 2 * Math.abs(index - 0.5);

            // Color mapping
            let color;
            if (index <= 0.5) {
                color = new Cesium.Color(0, 1 - alpha, 1, alpha);
            } else {
                color = new Cesium.Color(1, 1 - alpha, 0, alpha);
            }

            // Set polygon color
            entity.polygon.material = color;
            entity.polygon.outline = true;
            entity.polygon.outlineColor = Cesium.Color.BLACK;
            entity.billboard = undefined; // Remove any billboard icon

        } else {

            entity.polygon.material = Cesium.Color.fromCssColorString('#bd0026').withAlpha(0.8);

        }
    }
};

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
