import * as Cesium from 'cesium';
import Datasource from './datasource.js'; 
import Plot from './plot.js';
import ElementsDisplay from './elements-display.js';
import District from './district.js';
import { useGlobalStore } from '../stores/global-store.js';
import GreenAreas from './green-areas.js';

export default class FeaturePicker {
	constructor( ) {
		this.store = useGlobalStore();
		this.viewer = this.store.cesiumViewer;
		this.datasourceService = new Datasource();
		this.plotService = new Plot();
		this.elementsDisplayService = new ElementsDisplay();
        this.districtService = new District();
        this.greenAreasService = new GreenAreas();
	}
/**
 * Processes the click event on the viewer
 * 
 * @param {MouseEvent} event - The click event
 */
 processClick(event ) {

    if ( !document.getElementById( "wmsNDVIToggle" ).checked ||  document.getElementById( "YLREToggle" ).checked || document.getElementById( "SubDistrictNDVIToggle" ).checked || document.getElementById( "PopulationGridToggle" ).checked || document.getElementById( "TreeRegistryToggle" ).checked  ) {

    
    document.getElementById( 'plotSelect' ).value = 'Helsinki';
    const elements = [
        'showPlotSwitch',
        'showPlotLabel',
        'showNDVISwitch',
        'showNDVILabel', 
        'showTreesSwitch',
        'showTreesLabel'            

    ];

    if ( !document.getElementById( "showGreenToggle" ).checked ) {

        this.elementsDisplayService.setElementsDisplay( elements, 'inline-block' );
        this.elementsDisplayService.setElementsDisplay( [
            'showGreenLabel',
            'showGreenSwitch'          
        ], 'none' );

    } 

    console.log("Clicked at " + String( event.x ) + ", " + String( event.y ));
    this.pickEntity( new Cesium.Cartesian2( event.x, event.y ) );

    }

}

/**
 * Prints the properties of the picked Cesium entity
 * 
 * @param {Object} picked - The picked Cesium entity
 */
printCesiumEntity( picked ) {

    document.getElementById( 'printContainer' ).scroll({
        top: 0,
        behavior: 'instant'
    });
    
    if ( picked.id.properties ) {
        var toPrint = "<u>Found following properties & values:</u><br/>";	

        let length = picked.id.properties.propertyNames.length;
        for ( let i = 0; i < length; ++i ) {

            if ( typeof picked.id.properties[ picked.id.properties.propertyNames[ i ] ]._value === 'number' ) {

                toPrint = toPrint + picked.id.properties.propertyNames[ i ] + ": " + picked.id.properties[ picked.id.properties.propertyNames[ i ] ]._value.toFixed( 3 ) + "<br/>";

            } else {

                toPrint = toPrint + picked.id.properties.propertyNames[ i ] + ": " + picked.id.properties[ picked.id.properties.propertyNames[ i ] ] + "<br/>";

            }
            
        };
    }
    
    this.addToPrint( toPrint )
    
}

/**
 * Adds the provided content to the print container
 * 
 * @param {string} toPrint - The content to be added to the print container
 */
addToPrint( toPrint ) {

    document.getElementById('printContainer').innerHTML = toPrint;
    document.getElementById('printContainer').scroll({
          top: 1000,
          behavior: 'smooth'
    });
}    

/**
 * Picks the entity at the given window position in the viewer
 * 
 * @param {Cesium.Viewer} viewer - The Cesium viewer object
 * @param {Cesium.Cartesian2} windowPosition - The window position to pick the entity
 */
async pickEntity( windowPosition ) {
    let picked = this.viewer.scene.pick( windowPosition );

    document.getElementById("showNDVIToggle").disabled = false;
    document.getElementById("NDVI2023Toggle").disabled = false;

    document.getElementById( "wmsNDVISwitch" ).style.display = 'none';
    document.getElementById( "wmsNDVILabel" ).style.display = 'none';
    
    if ( picked ) {

        if ( !document.getElementById( "showNDVIToggle" ).checked || !document.getElementById( "NDVI2023Toggle" ).checked ) {

            this.elementsDisplayService.setElementDisabledState( false );

        } else {

            this.elementsDisplayService.setElementDisabledState( true );

        }

        document.getElementById( "showPlotToggle" ).checked = true;
        this.districtService.setDistrictVariables( picked.id.properties );

        if ( picked.id.entityCollection._entities._array[ 0 ]._properties._nimi_fi ) {

            if ( picked.id.entityCollection._entities._array[ 0 ]._properties._nimi_fi._value === 'Eteläinen' ) {

                this.districtService.flyCameraToDistrict( picked, 20000 );    
                this.store.majorDistrict = picked.id.properties.tunnus;
                this.store.majorDistrictName = picked.id.properties.nimi_fi._value;
                await this.datasourceService.removeDataSourcesByNamePrefix( "SubDistricts" );
                await this.districtService.newDistrict( 'assets/data/HelsinkiDistrict.json', 'Districts' );
                this.store.levelsVisited.push( 'MajorDistricts' );
                this.handleGreenAreas();
                this.districtService.setDistrictOutlineColor( );
                this.elementsDisplayService.toggleReturnButtonVisibility( );
                this.plotService.createPieChartForMajorDistrict( picked.id.properties.tunnus );
                 
            }
    
            if ( picked.id.entityCollection._entities._array[ 0 ]._properties._nimi_fi._value === 'Vironniemi' ) {
                
                this.elementsDisplayService.setElementsDisplay( [ 'NDVI2023Switch', 'NDVI2023Label' ], 'inline-block' );
                this.districtService.flyCameraToDistrict( picked, 10000 );  
                this.store.district = picked.id.properties.tunnus;
                await this.districtService.newDistrict( 'assets/data/HelsinkiSubDistrict.json', 'SubDistricts' );
                this.store.currentDistrictName = picked.id.properties.nimi_fi._value;
                this.store.levelsVisited.push( 'Districts' );
                this.handleGreenAreas();
                this.districtService.setDistrictOutlineColor( );
                this.elementsDisplayService.toggleReturnButtonVisibility( );
                this.plotService.createPieChartForMajorDistrict( picked.id.properties.tunnus );
                await  this.datasourceService.removeDataSourcesByNamePrefix( "MajorDistricts" );
                await  this.datasourceService.removeDataSourcesByNamePrefix( "Districts" );
                    
            }
    
            if ( picked.id.entityCollection._entities._array[ 0 ]._properties._nimi_fi._value === 'Niemenmäki' &&  !document.getElementById( "SubDistrictNDVIToggle" ).checked ) {

                this.districtService.flyCameraToDistrict( picked, 5000 );    
                this.store.levelsVisited.push( 'SubDistricts' );
                this.store.currentSubDistrictName = picked.id.properties.nimi_fi._value;
                this.handleGreenAreas();
                this.districtService.setDistrictOutlineColor( );
                this.elementsDisplayService.toggleReturnButtonVisibility( );
                await this.datasourceService.removeDataSourcesByNamePrefix( "Districts" );
                this.plotService.createPieChartForMajorDistrict( picked.id.properties.tunnus );
                    
            }  

            await this.datasourceService.removeDuplicateDataSources( );

        }
        
        if ( document.getElementById( "wmsNDVIToggle" ).checked ) {

            document.getElementById( "printContainer" ).style.display = 'inline-block';
            this.printCesiumEntity( picked );
                
        }
   
    }

}

handleGreenAreas() {
    if ( document.getElementById( "showGreenToggle" ).checked ) {

        this.greenAreasService.hideOutsideGreenAreas( );
        this.plotService.createGreenAreaScatterPlot( );
        this.greenAreasService.extrudedGreenAreas( );

    } 
}
}