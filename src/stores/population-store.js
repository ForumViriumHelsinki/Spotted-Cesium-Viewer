import { defineStore } from 'pinia';

export const usePopulationStore = defineStore( 'population', {
	state: () => ( {
		ndviAttribute: null,
		areaAttribute: null,
		name: null,
		uniqueId: null
	} ),

	actions: {
		setNdviAttribute( ndviAttribute ) {
			this.ndviAttribute = ndviAttribute;
		},
		setAreaAttribute( areaAttribute ) {
			this.areaAttribute = areaAttribute;
		},
		setName( name ) {
			this.name = name;
		},
		setUniqueId( uniqueId ) {
			this.uniqueId = uniqueId;
		}		
	},
} );