import { defineStore } from 'pinia';

export const useGlobalStore = defineStore( 'global', {
	state: () => ( {
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
		ndviAreaDataSourceName: null
	} ),
	getters: {
		getLocation: ( state ) => state.location,
		getCesiumViewer: ( state ) => state.cesiumViewer,
		getShowPlot: ( state ) => state.showPlot,
		getPrint: ( state ) => state.print,        
		getMajorDistrict: ( state ) => state.majorDistrict,
		getDistrict: ( state ) => state.district, 
		getDistrictName: ( state ) => state.districtName, 
		getMajorDistrictName: ( state ) => state.majorDistrictName, 
		getDistrictPopulation: ( state ) => state.districtPopulation, 
		getDistrictArea: ( state ) => state.districtArea, 
		getDistrictsVisited: ( state ) => state.districtsVisited, 
		getLevelsVisited: ( state ) => state.levelsVisited, 
		getCurrentDistrictName: ( state ) => state.currentDistrictName, 
		getCurrentSubDistrictName: ( state ) => state.currentSubDistrictName, 
		getNdviAreaDataSourceName: ( state ) => state.ndviAreaDataSourceName 
	}, 
	actions: {
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

			// Consider resetting other parts of the state as needed, 
			// such as this.cesiumViewer if appropriate.                               
		},
	},
} );