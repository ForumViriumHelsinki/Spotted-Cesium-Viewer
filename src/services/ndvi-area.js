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

	dataForHistogram(  entities, property, date, ndviAreaDataSourceName ) {
		let propertyValuesList = [];
		let tunnusList = [];

		entities.forEach( function( entity ) {

			// Replace 'attributeName' with the name of the property you're interested in
			let value = entity.properties[property].getValue();

			if ( ndviAreaDataSourceName == 'SubDistrictNDVI' ) {

				let tunnus = entity.properties['tunnus'].getValue();

				if ( !tunnusList.includes( tunnus ) ) {
            
					propertyValuesList.push( value );
					tunnusList.push( tunnus );
				} 

			} else {

				propertyValuesList.push( value );
			}


		} );


		const plotService = new Plot();
		plotService.createNDVIHistogram( propertyValuesList, date );
	}

	/**
* This function hides and shows ndvi datasources based on ndviSliderValue value
* 
*/
	updateNDVIYlreDataSources( sliderValue ) {
		let dataSource = this.datasourceService.getDataSourceByName( this.store.ndviAreaDataSourceName );
		let entities = dataSource.entities.values;
		if ( sliderValue === 0 ) {

			this.setColorAndLabelForPolygonEntities( entities, 'ndvi_august2015' );
			this.dataForHistogram( entities, 'ndvi_august2015', 'August 2015', this.store.ndviAreaDataSourceName );

		}

		if ( sliderValue === 1 ) {

			this.setColorAndLabelForPolygonEntities( entities, 'ndvi_june2016' );
			this.dataForHistogram( entities, 'ndvi_june2016', 'June 2016', this.store.ndviAreaDataSourceName );

		}

		if ( sliderValue === 2 ) {

			this.setColorAndLabelForPolygonEntities( entities, 'ndvi_july2017' );
			this.dataForHistogram( entities, 'ndvi_july2017', 'July 2017', this.store.ndviAreaDataSourceName );

		}

		if ( sliderValue === 3 ) {

			this.setColorAndLabelForPolygonEntities( entities, 'ndvi_june2018' );
			this.dataForHistogram( entities, 'ndvi_june2018', 'June 2018', this.store.ndviAreaDataSourceName );

		}

		if ( sliderValue === 4 ) {

			this.setColorAndLabelForPolygonEntities( entities, 'ndvi_july2019' );
			this.dataForHistogram( entities, 'ndvi_july2019', 'July 2019', this.store.ndviAreaDataSourceName );

		}

		if ( sliderValue === 5 ) {

			this.setColorAndLabelForPolygonEntities( entities, 'ndvi_june2020' );
			this.dataForHistogram( entities, 'ndvi_june2020', 'June 2020', this.store.ndviAreaDataSourceName );

		}

		if ( sliderValue === 6 ) {

			this.setColorAndLabelForPolygonEntities( entities, 'ndvi_june2021' );
			this.dataForHistogram( entities, 'ndvi_june2021', 'June 2021', this.store.ndviAreaDataSourceName );

		}

		if ( sliderValue === 7 ) {

			this.setColorAndLabelForPolygonEntities( entities, 'ndvi_june2022' );
			this.dataForHistogram( entities, 'ndvi_june2022', 'June 2022', this.store.ndviAreaDataSourceName );

		}

		if ( sliderValue === 8 ) {

			this.setColorAndLabelForPolygonEntities( entities, 'ndvi_june2023' );
			this.dataForHistogram( entities, 'ndvi_june2023', 'June 2023', this.store.ndviAreaDataSourceName );

		}

	}



	/**
* This function hides and shows ndvi datasources based on ndviSliderValue value
* 
*/
	updateNDVIAreaDataSources( sliderValue ) {
		let dataSource = this.datasourceService.getDataSourceByName( this.store.ndviAreaDataSourceName );
		let entities = dataSource.entities.values;

		if ( this.store.ndviAreaDataSourceName == 'TreeRegistry' ) {

			if ( sliderValue === 0 ) {

				this.setColorAndLabelForPointEntities( entities, 'ndvi_march2023' );
				this.dataForHistogram( entities, 'ndvi_march2023', 'March 2023', this.store.ndviAreaDataSourceName );

			}

			if ( sliderValue === 1 ) {

				this.setColorAndLabelForPointEntities( entities, 'ndvi_april2023' );
				this.dataForHistogram( entities, 'ndvi_april2023', 'April 2023', this.store.ndviAreaDataSourceName );

			}

			if ( sliderValue === 2 ) {

				this.setColorAndLabelForPointEntities( entities, 'ndvi_may023' );
				this.dataForHistogram( entities, 'ndvi_may023', 'May 2023', this.store.ndviAreaDataSourceName );

			}

			if ( sliderValue === 3 ) {

				this.setColorAndLabelForPointEntities( entities, 'ndvi_june2023' );
				this.dataForHistogram( entities, 'ndvi_june2023', 'June 2023', this.store.ndviAreaDataSourceName );

			}

			if ( sliderValue === 4 ) {

				this.setColorAndLabelForPointEntities( entities, 'ndvi_july2023', this.store.ndviAreaDataSourceName );
				this.dataForHistogram( entities, 'ndvi_july2023', 'July 2023' );

			}

			if ( sliderValue === 5 ) {

				this.setColorAndLabelForPointEntities( entities, 'ndvi_august2023' );
				this.dataForHistogram( entities, 'ndvi_august2023', 'August 2023', this.store.ndviAreaDataSourceName );

			}

			if ( sliderValue === 6 ) {

				this.setColorAndLabelForPointEntities( entities, 'ndvi_september2023' );
				this.dataForHistogram( entities, 'ndvi_september2023', 'September 2023', this.store.ndviAreaDataSourceName );

			}

			if ( sliderValue === 7 ) {

				this.setColorAndLabelForPointEntities( entities, 'ndvi_october2023' );
				this.dataForHistogram( entities, 'ndvi_october2023', 'October 2023', this.store.ndviAreaDataSourceName );

			}
 
		} else {

			if ( sliderValue === 0 ) {

				this.setColorAndLabelForPolygonEntities( entities, 'ndvi_march2023' );
				this.dataForHistogram( entities, 'ndvi_march2023', 'March 2023', this.store.ndviAreaDataSourceName );

			}

			if ( sliderValue === 1 ) {

				this.setColorAndLabelForPolygonEntities( entities, 'ndvi_april2023' );
				this.dataForHistogram( entities, 'ndvi_april2023', 'April 2023', this.store.ndviAreaDataSourceName );

			}

			if ( sliderValue === 2 ) {

				this.setColorAndLabelForPolygonEntities( entities, 'ndvi_may2023' );
				this.dataForHistogram( entities, 'ndvi_may2023', 'May 2023', this.store.ndviAreaDataSourceName );

			}

			if ( sliderValue === 3 ) {

				this.setColorAndLabelForPolygonEntities( entities, 'ndvi_june2023' );
				this.dataForHistogram( entities, 'ndvi_june2023', 'June 2023' );

			}

			if ( sliderValue === 4 ) {

				this.setColorAndLabelForPolygonEntities( entities, 'ndvi_july2023' );
				this.dataForHistogram( entities, 'ndvi_july2023', 'July 2023', this.store.ndviAreaDataSourceName );

			}

			if ( sliderValue === 5 ) {

				this.setColorAndLabelForPolygonEntities( entities, 'ndvi_august2023' );
				this.dataForHistogram( entities, 'ndvi_august2023', 'August 2023', this.store.ndviAreaDataSourceName );

			}

			if ( sliderValue === 6 ) {

				this.setColorAndLabelForPolygonEntities( entities, 'ndvi_september2023' );
				this.dataForHistogram( entities, 'ndvi_september2023', 'September 2023', this.store.ndviAreaDataSourceName );

			}

			if ( sliderValue === 7 ) {

				this.setColorAndLabelForPolygonEntities( entities, 'ndvi_october2023' );
				this.dataForHistogram( entities, 'ndvi_october2023', 'October 2023', this.store.ndviAreaDataSourceName );
			}

		}



	}

	/**
   * Add the features with ndvi data as a new data source to the Cesium
   * 
   * @param { object } data features with ndvi
   * @param { Number } name name of the datasource
   * @param { Boolean } isPolygon tells if feature is polygon
   */
	async addFeaturesWithNDVI( data, name, isPolygon ) {

    	let entities = await this.datasourceService.addDataSourceWithPolygonFix( data, name );

		if ( isPolygon || name === 'SubDistrictNDVI' ) {

			this.setColorAndLabelForPolygonEntities( entities, 'ndvi_june2023' );

		} else {

			this.setColorAndLabelForPointEntities( entities, 'ndvi_june2023' );

		}

		this.dataForHistogram( entities, 'ndvi_june2023', 'June 2023', this.store.ndviAreaDataSourceName );
	}

	setColorAndLabelForPointEntities( entities, attributeName ) {

		for ( let i = 0; i < entities.length; i++ ) {
			let entity = entities[i];
			if ( entity.position ) { // Check if entity is a point
				const color = this.ndviService.setNDVIPolygonMaterialColor( entity, attributeName );
				// Set point color
				entity.point = new Cesium.PointGraphics( {
					color: color,
					pixelSize: 20 // Adjust size as needed
				} );

				// Add a label to display the NDVI value
				const ndviValue = entity.properties[ attributeName ].getValue();
				entity.label = new Cesium.LabelGraphics( {
					text: ndviValue.toFixed( 3 ).toString(),
					font: '12pt sans-serif',
					fillColor: Cesium.Color.WHITE,
					outlineColor: Cesium.Color.BLACK,
					outlineWidth: 2,
					style: Cesium.LabelStyle.FILL_AND_OUTLINE,
					verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
					pixelOffset: new Cesium.Cartesian2( 0, -12 ) // Adjust label position relative to the point
				} );

				entity.billboard = undefined; // Remove any billboard icon

			}
		}

	}

	setColorAndLabelForPolygonEntities( entities, attributeName ) {
		for ( let i = 0; i < entities.length; i++ ) {
			let entity = entities[i];
			const color = this.ndviService.setNDVIPolygonMaterialColor( entity, attributeName );
			// Set polygon color
			entity.polygon.material = color;
			entity.polygon.outline = true; // Optional: Set to false if no outline is desired
			entity.polygon.outlineColor = Cesium.Color.BLACK;
		}
	}
}
