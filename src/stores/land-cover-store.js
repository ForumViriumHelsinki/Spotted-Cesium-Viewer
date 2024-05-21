import { defineStore } from 'pinia';

export const useLandCoverStore = defineStore( 'land-cover', {
	state: () => ( {
		majorDistrictData: null,
		districtData: null,
		subDistrictData: null,
	} ),
	actions: {
		setMajorDistrictData( data ) {
			this.majorDistrictData = data;
		},
		setDistrictData( data ) {
			this.districtData = data;
		},
		setSubDistrictData( data ) {
			this.subDistrictData = data;
		},
	},
} );