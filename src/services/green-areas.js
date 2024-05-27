import * as Cesium from 'cesium';
import Datasource from './datasource.js'; 
import Cache from './cache.js'; 
import NDVI from './ndvi.js'; 
import Plot from './plot.js';
import ElementsDisplay from './elements-display.js';
import { useGlobalStore } from '../stores/global-store.js';

export default class GreenAreas {
	constructor( ) {
		this.store = useGlobalStore();
		this.viewer = this.store.cesiumViewer;
		this.datasourceService = new Datasource();
		this.cacheService = new Cache();
		this.ndviService = new NDVI();
		this.plotService = new Plot();
		this.elementsDisplayService = new ElementsDisplay();
	}

	setPopulationPressureEntitiesAndCreatePlots( entities, ndviAttribute, areaAttribute, name, id ) {

		this.setPopulationPressureEntities( entities, ndviAttribute, areaAttribute );
		this.camereToMiddleOfHelsinki();
		this.plotService.createPopulationScatterPlot( entities, name, ndviAttribute, areaAttribute, id );
		this.plotService.createPopulationPressureScatterPlot( entities, name, ndviAttribute, areaAttribute, id );
		this.plotService.createVulnerablePopulationScatterPlot( entities, name, ndviAttribute, areaAttribute, id );	
	}

	setPopulationPressureEntities( entities, ndviAttribute, areaAttribute ) {

		for ( let i = 0; i < entities.length; i++ ) {
			let entity = entities[i];

			if ( entity._properties[ ndviAttribute ]._value >= 0.5 && entity._properties[ areaAttribute ]._value >= 100 ) {

			    const color = this.ndviService.setNDVIPolygonMaterialColor( entity, ndviAttribute );
			    // Set polygon color
			    entity.polygon.material = color;
			    entity.polygon.outline = true; // Optional: Set to false if no outline is desired
			    entity.polygon.outlineColor = Cesium.Color.BLACK;
				entity.show = true;
				entity.polygon.extrudedHeight = 100 * ( entity._properties._weighted_population._value / entity._properties[ areaAttribute ]._value );

			} else {

				entity.show = false;

			}

		}
	}

	/**
   * Asynchronously load GreenAreas data from an API endpoint based on major district id
   * 
   */
	async loadGreenAreas( url, ndviAttribute, areaAttribute, name, id ) {
  
	  try {
  
		  // Attempt to retrieve the GreenAreas data from the local storage using the API endpoint URL as the key
			const cachedValue = await this.cacheService.getCachedData( url );
		   // If the GreenAreas data is already available in the local storage, add it to the Cesium map
		  if ( cachedValue ) {
  
				console.log( 'found from cache' );
				this.addGreenAreasDataSource( cachedValue, ndviAttribute, areaAttribute, name, id );
  
		  } else {
  
			  // Otherwise, fetch the GreenAreas data from the API endpoint and add it to the local storage
			  this.loadGreenAreasWithoutCache( url, ndviAttribute, areaAttribute, name, id );
  
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
	async addGreenAreasDataSource( data, ndviAttribute, areaAttribute, name, id ) {
		let entities = await this.datasourceService.addDataSourceWithPolygonFix( data, 'GreenAreas' );
		this.setPopulationPressureEntitiesAndCreatePlots( entities, ndviAttribute, areaAttribute, name, id );
        
	}
  
	/**
   * Fetch tree data from the API endpoint and add it to the local storage
   * 
   * @param { String } url API endpoint's url
   */
	async loadGreenAreasWithoutCache( url, ndviAttribute, areaAttribute, name, id ) {
		console.log( 'Not in cache! Loading: ' + url );
  
		try {
			const response = await fetch( url );
			const data = await response.json();
			this.cacheService.setCachedData( url, data );
			this.addGreenAreasDataSource( data, ndviAttribute, areaAttribute, name, id );
	
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
