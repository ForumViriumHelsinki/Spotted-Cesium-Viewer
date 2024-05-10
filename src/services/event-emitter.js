import { reactive } from 'vue';

export const eventBus = reactive( {
	listeners: {},
	$on( event, callback ) {
		if ( !this.listeners[event] ) {
			this.listeners[event] = [];
		}
		this.listeners[event].push( callback );
	},
	$emit( event, ...args ) {
		if ( this.listeners[event] ) {
			this.listeners[event].forEach( callback => callback( ...args ) );
		}
	},
} );

export default class EventEmitter {

	constructor() {
	}

	/**
 * The function emits event init Control Panel event
 *
 * 
 */
	emitControlPanelEvent( ) {

		eventBus.$emit( 'initControlPanel' );

	}



}


