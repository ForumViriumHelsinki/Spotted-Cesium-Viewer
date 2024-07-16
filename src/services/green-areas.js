import * as Cesium from 'cesium';
import Datasource from './datasource.js'; 
import Cache from './cache.js'; 
import NDVI from './ndvi.js'; 
import Plot from './plot.js';
import ElementsDisplay from './elements-display.js';
import { useGlobalStore } from '../stores/global-store.js';
import { usePopulationStore } from '../stores/population-store.js';

export default class GreenAreas {
	constructor( ) {
		this.store = useGlobalStore();
		this.viewer = this.store.cesiumViewer;
		this.datasourceService = new Datasource();
		this.cacheService = new Cache();
		this.ndviService = new NDVI();
		this.plotService = new Plot();
		this.elementsDisplayService = new ElementsDisplay();
		this.populationPressureStore = usePopulationStore();

	}

	async handleGreenAreas() {
		const greenAreaDataSource = await this.datasourceService.getDataSourceByName( 'GreenAreas' );
		this.extrudedEntitiesAndCreatePlots( greenAreaDataSource.entities.values );
	}

	extrudedEntitiesAndCreatePlots( entities ) {

		const postfix = getWeightedPopulationAttributePostFix( );
		const ndviAttribute = this.populationPressureStore.ndviAttribute;
		const areaAttribute = this.populationPressureStore.areaAttribute;
		let populationAttributeName = '_weighted_population';

		if ( this.populationPressureStore.name == 'Planned Development' ) {
			populationAttributeName = '_total_population';
		}
		extrudedEntities( entities, ndviAttribute, areaAttribute, populationAttributeName + postfix );
		this.plotService.createPopulationScatterPlot( entities, postfix );
		this.plotService.createPopulationPressureScatterPlot( entities, populationAttributeName + postfix );
		this.plotService.createVulnerablePopulationScatterPlot( entities, postfix );

	}


	setPopulationPressureEntities( entities ) {
		const ndviAttribute = this.populationPressureStore.ndviAttribute;
		const areaAttribute = this.populationPressureStore.areaAttribute;

		for ( let i = 0; i < entities.length; i++ ) {
			let entity = entities[i];
			let area = entity._properties[ areaAttribute ]._value * ( areaAttribute === 'fme_ala' ? 10000 : 1 );

			if ( entity._properties[ ndviAttribute ]._value >= 0.5 && area >= 100 ) {

			    const color = this.ndviService.setNDVIPolygonMaterialColor( entity, ndviAttribute );
			    // Set polygon color
			    entity.polygon.material = color;
			    entity.polygon.outline = true; // Optional: Set to false if no outline is desired
			    entity.polygon.outlineColor = Cesium.Color.BLACK;
				entity.show = true;

			} else {

				entity.show = false;

			}
		}
	}

	/**
   * Asynchronously load GreenAreas data from an API endpoint based on major district id
   * 
   */
	async loadGreenAreas( url ) {
  
	  try {
  
		  // Attempt to retrieve the GreenAreas data from the local storage using the API endpoint URL as the key
			const cachedValue = await this.cacheService.getCachedData( url + '1' );
		   // If the GreenAreas data is already available in the local storage, add it to the Cesium map
		  if ( cachedValue ) {
  
				console.log( 'found from cache' );
				this.addGreenAreasDataSource( cachedValue );
  
		  } else {
  
			  // Otherwise, fetch the GreenAreas data from the API endpoint and add it to the local storage
			  this.loadGreenAreasWithoutCache( url );
  
		  }
			
	  } catch ( err ) {
		  // This code runs if there were any errors.
		  console.log( err );
	  }
	}
  
	/**
   * Add the GreenAreas data as a new data source to the Cesium
   * 
   * @param { object } data GreenAreas data
   */
	async addGreenAreasDataSource( data ) {
		let entities = await this.datasourceService.addDataSourceWithPolygonFix( data, 'GreenAreas' );
		this.camereToMiddleOfHelsinki();
		this.setPopulationPressureEntities( entities );
		this.extrudedEntitiesAndCreatePlots( entities );
        
	}
  
	/**
   * Fetch tree data from the API endpoint and add it to the local storage
   * 
   * @param { String } url API endpoint's url
   */
	async loadGreenAreasWithoutCache( url ) {
		console.log( 'Not in cache! Loading: ' + url );
  
		try {
			const response = await fetch( url );
			const data = await response.json();
			this.cacheService.setCachedData( url + '1', data );
			this.addGreenAreasDataSource( data );
	
		} catch ( error ) {
			console.error( 'Error loading green areas data:', error );
			return null; // Handle error case or return accordingly
		}

	}

	camereToMiddleOfHelsinki() {

		this.viewer.camera.flyTo( {
			destination: Cesium.Cartesian3.fromDegrees( 24.94, 60.055464, 11000 ),
			orientation: {
				heading: 0.0,
				pitch: Cesium.Math.toRadians( -35.0 ),
				roll: 0.0
			},
			duration: 3
		} );
	}

	async hideOutsideGreenAreas( ) {
    
		const greenAreaDataSource = await this.datasourceService.getDataSourceByName( 'GreenAreas' );
		const currentLevel = this.store.levelsVisited[ this.store.levelsVisited.length - 1 ];

		greenAreaDataSource.entities.values.forEach( entity => {

			if ( this.store.majorDistrictName ) {
				if ( currentLevel === 'MajorDistricts' && entity._properties._suurpiiri._value !== this.store.majorDistrictName ) {
					entity.show = false; // Hide the entity if suurpiiri doesn't match
				}

				if ( currentLevel === 'District' && entity._properties._kaupunginosa._value.toLowerCase() !== currentDistrictName.toLowerCase() ) {
					entity.show = false; // Hide the entity if kaupunginosa doesn't match
				}

				if ( currentLevel === 'SubDistrict' && entity._properties._osa_alue._value.toLowerCase() !== currentSubDistrictName.toLowerCase() ) {
					entity.show = false; // Hide the entity if osa_alue doesn't match
				}

				if ( entity._properties._mean_ndvi._value <= 0.3 || entity._properties._viheralueen_pa._value <= 10000 ) {

					entity.show = false;
				}

			} else {

				entity.show = true;

			}

		} );

	}

	extrudedGreenAreas( ) {
    
		const greenAreaDataSource = this.datasourceService.getDataSourceByName( 'GreenAreas' );

		const minAreaValue = 10000;       // Minimum value for viheralueen_pa
		const averageAreaValue =  87586;   // Average value if only 10 000 + are incldued
		greenAreaDataSource.entities.values.forEach( entity => {

			if ( entity.show && entity.polygon && entity._properties._population_0km ) {
            
				entity.polygon.extrudedHeight = this.plotService.addNearbyPopulationWithWeights( entity ) / ( entity._properties._viheralueen_pa._value / minAreaValue );

			} 

		} );

		this.switchTo3DView( );
	}

	normalizeValue( value, minValue, maxValue ) {
		return ( value - minValue ) / ( maxValue - minValue );
	}


	// Function to switch back to 3D view
	switchTo3DView() {

		// Find the data source for MajorDistricts
		const districtDataSource = this.viewer.dataSources._dataSources.find( ds => ds.name === 'MajorDistricts' );
    
		// Iterate over all entities in the postcodes data source.
		for ( let i = 0; i < districtDataSource._entityCollection._entities._array.length; i++ ) {
        
			let entity = districtDataSource._entityCollection._entities._array[ i ];
        
			// Check if the entity posno property matches the postalcode.
			if ( entity._properties._tunnus._value == this.store.majorDistrict ) {

				let polygonHierarchy = entity.polygon.hierarchy.getValue( Cesium.JulianDate.now() );
				let positions = polygonHierarchy.positions;
				let center = Cesium.BoundingSphere.fromPoints( positions ).center;
				center = Cesium.Ellipsoid.WGS84.cartesianToCartographic( center );

				let longitude = Cesium.Math.toDegrees( center.longitude );
				let latitude = Cesium.Math.toDegrees( center.latitude );

				this.viewer.camera.flyTo( {
					destination: Cesium.Cartesian3.fromDegrees( longitude + 0.01, latitude - 0.04, 4500 ),
					orientation: {
						heading: 0.0,
						pitch: Cesium.Math.toRadians( -35.0 ),
						roll: 0.0
					},
					duration: 3
				} );
            
				break;
			}
		}
	}
}

const extrudedEntities = ( entities, ndviAttribute, areaAttribute, populationAttributeName ) => {	

	for ( let i = 0; i < entities.length; i++ ) {
		let entity = entities[ i ];

		let area = entity._properties[ areaAttribute ]._value * ( areaAttribute === 'fme_ala' ? 10000 : 1 );

		if ( entity._properties[ ndviAttribute ]._value >= 0.5 && area >= 100 ) {

			entity.polygon.extrudedHeight =  entity._properties[ populationAttributeName ]._value / ( area / 100 );

		} else {

			entity.show = false;

		}
	}
};

const getWeightedPopulationAttributePostFix = ( ) => {
	const sliderValue = parseInt( document.getElementById( 'blueSlider' ).value );
	const nameMap = { 0: '_300m', 1: '_800m', 2: '_2000m' };
	return nameMap[ sliderValue ];
};
