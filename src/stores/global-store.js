import { defineStore } from 'pinia';

export const useGlobalStore = defineStore( 'global', {
	state: () => ( {
		activeViewer: null,
		location: 'start',
		cesiumViewer: null,
		showPlot: true,
		print: true,
		// UI-related variables
		majorDistrict: null,
		district: null,
		districtName: null,
		majorDistrictName: null,
		districtPopulation: null,
		districtArea: null,
		districtsVisited: [],
		levelsVisited: [],
		currentDistrictName: null,
		currentSubDistrictName: null,
		ndviAreaDataSourceName: null,
		fileUploaded: false,
		entities: null,
	} ),
	actions: {
		setEntities( entities ) {
			this.entities = entities;
		},
		setActiveViewer( newViewer ) {
			this.activeViewer = newViewer;
		},
		setLocation( newLocation ) {
			this.location = newLocation;
		},
		setCesiumViewer( viewer ) {
			this.cesiumViewer = viewer;
		},
		setShowPlot( value ) {
			this.showPlot = value;
		},
		setPrint( value ) {
			this.print = value;
		},

		setMajorDistrict( district ) {
			this.majorDistrict = district;
		},
		setDistrict( district ) {
			this.district = district;
		},
		setDistrictName( name ) {
			this.districtName = name;
		},
		setMajorDistrictName( name ) {
			this.majorDistrictName = name;
		},
		setDistrictPopulation( population ) {
			this.districtPopulation = population;
		},
		setDistrictArea( area ) {
			this.districtArea = area;
		},
		addDistrictVisited( districtName ) {
			if ( !this.districtsVisited.includes( districtName ) ) {
				this.districtsVisited.push( districtName );
			}
		},
		addLevelVisited( level ) {
			if ( !this.levelsVisited.includes( level ) ) {
				this.levelsVisited.push( level );
			}
		},
		setCurrentDistrictName( name ) {
			this.currentDistrictName = name;
		},
		setCurrentSubDistrictName( name ) {
			this.currentSubDistrictName = name;
		},
		setNdviAreaDataSourceName( name ) {
			this.ndviAreaDataSourceName = name;
		},
		setFileUploaded( value ) {
			this.fileUploaded = value;
		},		
		reset() {
			this.location = 'start'; // Reset to initial values
			this.cesiumViewer = null;
			this.showPlot = true;
			this.print = true;            
			this.majorDistrict = null;
			this.district = null;
			this.districtName = null;
			this.majorDistrictName = null;
			this.districtPopulation = null;
			this.districtArea = null;
			this.districtsVisited = [];
			this.levelsVisited = [];
			this.currentDistrictName = null;
			this.currentSubDistrictName = null;
			this.ndviAreaDataSourceName = null;
			this.fileUploaded = false;

			// Consider resetting other parts of the state as needed, 
			// such as this.cesiumViewer if appropriate.                               
		},
	},
} );