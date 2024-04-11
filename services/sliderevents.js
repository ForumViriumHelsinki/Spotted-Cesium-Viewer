/**
 * This function is triggered by a slider event and it checks the value of the slider to determine which function to execute
 *
 * @param { Object } event the slider event
 */
function sliderEvents( event ) {
		
    // If the slider value is "print", call the printEvent function.
    if ( event.target.value == 'print' ) {

    //    printEvent();

    }
      
    // If the slider value is "showPlot", call the showPlotEvent function.
    if ( event.target.value == 'showPlot' && districtsVisited.length ) {

        showPlotEvent();

    }	

    // If the slider value is "showNDVI", call the showNDVI function.
    if ( event.target.value == 'showNDVI' ) {
        
        showNDVIEvent();
            
    } 

    // If the slider value is "NDVI2023", call the ndvi2023 function.
    if ( event.target.value == 'NDVI2023' ) {
        
        ndvi2023();
        
    }

    // If the slider value is "wmsNDVI", call the wmsNDVI function.
    if ( event.target.value == 'wmsNDVI' ) {
        
        wmsNDVIEvent();
                
    } 

    // If the slider value is "showGreen", call the showGreen function.
    if ( event.target.value == 'showGreen' ) {
        
        showGreenEvent();
            
    } 

    // If the slider value is "showTree", call the showTreeEvent function.
    if ( event.target.value == 'showTree' ) {

        showTreeEvent();

    }    

    // If the slider value is "YLRE", call the ylreEvent function.
    if ( event.target.value == 'YLRE' ) {
        
        ylreEvent();
        
    } 

    // If the slider value is "TreeRegistry", call the treeRegistryEvent function.
    if ( event.target.value == 'TreeRegistry' ) {
        
        treeRegistryEvent();
        
    } 

    // If the slider value is "PopulationGrid", call the populationGridEvent function.
    if ( event.target.value == 'PopulationGrid' ) {
        
        populationGridEvent();
            
    } 

    // If the slider value is "SubDistrictNDVI", call the subDistrictNDVIEvent function.
    if ( event.target.value == 'SubDistrictNDVI' ) {
        
        subDistrictNDVIEvent();
            
    }

    // If the slider value is "getLandCover", call the getLandCoverEvent function.
    if ( event.target.value == 'getLandCover' ) {
        
        getLandCoverEvent();
            
    }          
                
}

		/**
 * This function handles the toggle event for switching to capital region view
 */
 function getLandCoverEvent() {

			const landcover = document.getElementById( 'landCoverToggle' ).checked;

			if ( landcover ) {

                viewer.imageryLayers.removeAll();

				viewer.imageryLayers.add(
					createHSYImageryLayer()
				);


			} else {
                
                resetWMS( );

			}



		}

/**
 * This function shows and hides Helsinki PopulationGrid
 *
 */
function populationGridEvent() {

    const populationGrid = document.getElementById( "PopulationGridToggle" ).checked;

    if ( populationGrid ) {

        if ( !dataSourceWithNameExists( "PopulationGrid" ) ) {

            addFeaturesWithNDVI( "https://geo.fvh.fi/spotted/data/hki_populationgrid_with_ndvi.geojson", "PopulationGrid", true );

        } else {

            document.getElementById( "plotContainer" ).style.visibility = 'visible';
            showDataSourceByName( "PopulationGrid" );

        }

        document.getElementById('ndviAreaContainer').style.display = 'inline-block';
        document.getElementById('ndviAreaContainer').style.visibility = 'visible';
        ndviAreaDataSourceName = "PopulationGrid";
        
    } else {

        hideDataSourceByName( "PopulationGrid" );
        document.getElementById('ndviAreaContainer').style.display = 'none';
        document.getElementById( "plotContainer" ).style.visibility = 'hidden';        

    }
}

/**
 * This function shows and hides Helsinki SubDistrict with NDVI
 *
 */
function subDistrictNDVIEvent() {

    const subDistrictNDVI = document.getElementById( "SubDistrictNDVIToggle" ).checked;

    if ( subDistrictNDVI ) {

        if ( !dataSourceWithNameExists( "SubDistrictNDVI" ) ) {

            addFeaturesWithNDVI( "https://geo.fvh.fi/spotted/data/HelsinkiSubDistrict.geojson", "SubDistrictNDVI", false );

        } else {

            document.getElementById( "plotContainer" ).style.visibility = 'visible';
            showDataSourceByName( "SubDistrictNDVI" );

        }

        document.getElementById('ndviAreaContainer').style.display = 'inline-block';
        document.getElementById('ndviAreaContainer').style.visibility = 'visible';
        ndviAreaDataSourceName = "SubDistrictNDVI";
        
    } else {

        hideDataSourceByName( "SubDistrictNDVI" );
        document.getElementById('ndviAreaContainer').style.display = 'none';
        document.getElementById( "plotContainer" ).style.visibility = 'hidden'; 
    }
}

/**
 * This function shows and hides Helsinki Tree Registry
 *
 */
async function ylreEvent() {

    const ylre = document.getElementById( "YLREToggle" ).checked;

    if ( ylre ) {

        if ( !dataSourceWithNameExists( "YLRE" ) ) {

            addFeaturesWithNDVI( "https://geo.fvh.fi/spotted/data/ylre_viheralue_with_ndvi.geojson", "YLRE", true );

        } else {

            showDataSourceByName( "YLRE" );

        }

        document.getElementById('ndviYlreContainer').style.display = 'inline-block';
        document.getElementById('ndviYlreContainer').style.visibility = 'visible';
        ndviAreaDataSourceName = "YLRE";
        let dataSource = await getDataSourceByName( ndviAreaDataSourceName );
        if ( dataSource ) {
            
            dataForHistogram( dataSource.entities.values, 'ndvi_june2023', 'June 2023');

        }
        
    } else {

        hideDataSourceByName( "YLRE" );
        document.getElementById('ndviYlreContainer').style.display = 'none';
        document.getElementById( "plotContainer" ).style.visibility = 'hidden';

    }
}


/**
 * This function shows and hides Helsinki Tree Registry
 *
 */
function treeRegistryEvent() {

    const treeRegistry = document.getElementById( "TreeRegistryToggle" ).checked;

    if ( treeRegistry ) {

        if ( !dataSourceWithNameExists( "TreeRegistry" ) ) {

            addFeaturesWithNDVI( "https://geo.fvh.fi/spotted/data/Puurekisteri_piste_with_ndvi.geojson", "TreeRegistry", false );

        } else {

            showDataSourceByName( "TreeRegistry" );
            document.getElementById( "plotContainer" ).style.visibility = 'visible';

        }

        document.getElementById('ndviAreaContainer').style.display = 'inline-block';
        document.getElementById('ndviAreaContainer').style.visibility = 'visible';
        ndviAreaDataSourceName = "TreeRegistry";
        
    } else {

        hideDataSourceByName( "TreeRegistry" );
        document.getElementById('ndviAreaContainer').style.display = 'none';
        document.getElementById( "plotContainer" ).style.visibility = 'hidden';       

    }
}

/**
 * This function switches the wms background from Helsinki wms to copernicus wms
 *
 */
function wmsNDVIEvent() {

    const wmsNDVI = document.getElementById( "wmsNDVIToggle" ).checked;

    if ( wmsNDVI ) {

        hideDataSourceByName( "MajorDistricts" );

        document.getElementById( "wmsNDVISwitch" ).style.display = 'none';
        document.getElementById( "wmsNDVILabel" ).style.display = 'none';
        document.getElementById( "showGreenSwitch" ).style.display = 'none';
        document.getElementById( "showGreenLabel" ).style.display = 'none';
        document.getElementById( "YLRESwitch" ).style.display = 'inline-block';
        document.getElementById( "YLRELabel" ).style.display = 'inline-block';
        document.getElementById( "TreeRegistrySwitch" ).style.display = 'inline-block';
        document.getElementById( "TreeRegistryLabel" ).style.display = 'inline-block';
        document.getElementById( "SubDistrictNDVISwitch" ).style.display = 'inline-block';
        document.getElementById( "SubDistrictNDVILabel" ).style.display = 'inline-block';
        document.getElementById( "PopulationGridSwitch" ).style.display = 'inline-block';
        document.getElementById( "PopulationGridLabel" ).style.display = 'inline-block';

    //    toggleLayerSelectAndActivateNDVI();

    } else { 

        // showHelsinkiWMSAndActivateDefaultLayer();
        showDataSourceByName( "MajorDistricts" );


        document.getElementById( "showGreenSwitch" ).style.display = 'inline-block';
        document.getElementById( "showGreenLabel" ).style.display = 'inline-block';
        document.getElementById( "YLRESwitch" ).style.display = 'none';
        document.getElementById( "YLRELabel" ).style.display = 'none';
        document.getElementById( "TreeRegistrySwitch" ).style.display = 'none';
        document.getElementById( "TreeRegistryLabel" ).style.display = 'none';
        document.getElementById( "SubDistrictNDVISwitch" ).style.display = 'none';
        document.getElementById( "SubDistrictNDVILabel" ).style.display = 'none';
        document.getElementById( "printContainer" ).style.display = 'none';
        document.getElementById( "PopulationGridSwitch" ).style.display = 'none';
        document.getElementById( "PopulationGridLabel" ).style.display = 'none';  
        hideDataSourceByName( "YLRE" );  
        hideDataSourceByName( "TreeRegistry" );
        hideDataSourceByName( "PopulationGrid" );
        hideDataSourceByName( "SubDistrictNDVI" );

    }
}

function toggleLayerSelectAndActivateNDVI() {
    // Hide the Helsinki WMS select dropdown
    document.getElementById('layerSelect').style.display = 'none';
    // Show the Copernicus NDVI select dropdown
    document.getElementById('NDVISelect').style.display = 'block';
    // Trigger the change event for the NDVISelect to load the "NDVI March" layer
    console.log("test")
    document.getElementById('NDVISelect').dispatchEvent(new Event('change'));
}

function showHelsinkiWMSAndActivateDefaultLayer() {
    // Show the Helsinki WMS select dropdown
    document.getElementById('layerSelect').style.display = 'block';
    // Hide the Copernicus NDVI select dropdown
    document.getElementById('NDVISelect').style.display = 'none';
    // Set the default Helsinki layer (e.g., "avoindata:Opaskartta_Helsinki")
    document.getElementById('layerSelect').value = 'avoindata:Opaskartta_Helsinki';
    // Trigger the change event for the layerSelect to load the default Helsinki layer
    document.getElementById('layerSelect').dispatchEvent(new Event('change'));
}

/**
 * This function to show or hide NDVI 2023 entities on the map based on the toggle button state
 *
 */
async function ndvi2023() {

    const NDVI2023 = document.getElementById( "NDVI2023Toggle" ).checked;

    if ( NDVI2023 ) {

        document.getElementById( "plotPieContainer" ).style.visibility = 'hidden';
        document.getElementById( "sliderContainer" ).style.visibility = 'hidden';
        document.getElementById( "plotSelect" ).style.visibility = 'hidden';
        await loadNDVI( '2023-01-27' );
        await loadNDVI( '2023-02-26' );
        const slider = document.getElementById('ndviSlider2023');
        slider.max = Math.max(1, 11);
        loadRemainingNDVIDataSequentially( );

    } else { 

        updateNDVIDataSources2023( );

    }

}

async function loadRemainingNDVIDataSequentially() {
    const dates = [ '2023-03-15', '2023-04-22', '2023-05-24', '2023-06-23', '2023-07-13', '2023-08-15', '2023-09-14', '2023-10-29', '2023-11-25', '2023-12-28' ];
    for (let i = 0; i < dates.length; i++) {
        try {
            await loadNDVI(dates[i]);
            unlockSliderPoint(i + 2); // Assuming the first two points are already loaded
        } catch (error) {
            console.error(`Failed to load NDVI data for ${dates[i]}:`, error);
            // Handle the error, possibly retry or skip to the next
        }
    }
}

function unlockSliderPoint(index) {
    const slider = document.getElementById('ndviSlider2023');
    slider.max = Math.max(index, slider.max); // Ensure the slider's max is updated only if it's increasing
}

/**
 * This function to show or hide green area entities on the map based on the toggle button state
 *
 */
function showGreenEvent() {

    const showGreen = document.getElementById( "showGreenToggle" ).checked;

    if ( showGreen ) {

        loadGreenAreas();

    } else { 
        
        hideDataSourceByName( "GreenAreas" );
        document.getElementById( "plotPieContainer" ).style.visibility = 'hidden';
        document.getElementById( "sliderContainer" ).style.visibility = 'hidden';

    }

}

/**
 * This function to show or hide NDVI entities on the map based on the toggle button state
 *
 */
async function showNDVIEvent() {
    // Get the state of the showNDVI toggle button
    const showNDVI = document.getElementById( "showNDVIToggle" ).checked;

    // Get the labels for colors
    const labels = document.querySelectorAll( ".color-label.active" );

    const elements = [
        'showTreesSwitch',
        'showTreesLabel'
    ];

    // Rest of your showNDVIEvent function code

    if ( showNDVI ) {

        // Toggle the visibility of the labels
        labels.forEach( label => {
            label.style.display = "block";
        });

        setElementsDisplay( elements, 'none' );
        setElementDisabledState( true );

        if ( majorDistrict && !dataSourceWithNameExists( "ndvi2018-06-14" )) {

            await loadNDVI( '2018-06-14' );
            await loadNDVI( '2020-06-21' );
            await loadNDVI( '2022-06-26' );

        } else {

            updateNDVIDataSources( );

        }

    } else {

        // Hide the labels
        labels.forEach( label => {
            label.style.display = "none";
        } );


        setElementsDisplay( elements, 'inline-block' );
        document.getElementById( "plotContainer" ).style.visibility = 'hidden';
        document.getElementById( 'ndviSliderContainer' ).style.visibility = 'hidden';
        setElementDisabledState( false );
        hideDataSourceByName( "ndvi" );

    }
}



/**
 * This function returns only if all hsy land cover
 */
function statusOfHSYToggles( ) {

    if ( !document.getElementById( "showTreeToggle" ).checked ) {

        return false;
    }
    
    return true;
}


/**
 * This function to show or hide field entities on the map based on the toggle button state
 *
 */
function showFieldsEvent( ) {

    const elements = [
        'showNDVISwitch',
        'showNDVILabel'
    ];

    // Get the state of the showFields toggle button
    const showFields = document.getElementById( "showFieldsToggle" ).checked;

    // If showTrees toggle is on
    if ( showFields ) {

        document.getElementById("showNDVIToggle").disabled = true;

        // If a postal code is available, load trees for that postal code
        if ( majorDistrict && !dataSourceWithNameExists( "Fields" ) ) {

            loadFields( majorDistrict );

        } else {

            createVegetationBarPlotPerInhabitant( districtsVisited[ districtsVisited.length - 1 ] );
            showDataSourceByName( "Fields" );

        }

        setElementsDisplay( elements, 'none' );
        
    } else { // If showTrees toggle is off
        
        createVegetationBarPlotPerInhabitant( districtsVisited[ districtsVisited.length - 1 ] );
        hideDataSourceByName( "Fields" );
        document.getElementById("showNDVIToggle").disabled = false;
        if ( !areAnySwitchesOn() ) {

            setElementsDisplay( elements, 'inline-block' );
            toggleLandCoverBarPlots( 'hidden' );

        }

    }

}


/**
 * This function to shows all datasources to user.
 *
 */
function showAllDataSources( ) {

    // Set the show property of all data sources to true to show the entities
    viewer.dataSources._dataSources.forEach( function( dataSource ) {

        dataSource.show = true;

    });  
}

/**
 * This function is called when the Object details button is clicked
 *
 */
function printEvent( ) {

    console.log( "Set the print to: " + String( document.getElementById( "printToggle" ).checked ) );
    const print = document.getElementById( "printToggle" ).checked;

    // If print is not selected, hide the print container, search container, georeference container, and search button
    if ( !print ) {

        document.getElementById( 'printContainer' ).style.visibility = 'hidden';

    } else { // Otherwise, make the print container visible

        setPrintVisible( );

    }

}

/**
 * This function is called when the "Display Plot" toggle button is clicked
 *
 */
function showPlotEvent( ) {

    // Get the value of the "Show Plot" toggle button
    const showPlots = document.getElementById( "showPlotToggle" ).checked;
    
    // Hide the plot and its controls if the toggle button is unchecked
    if ( !showPlots ) {

        showPlot = false;
        togglePlots( 'hidden' );

    } else { // Otherwise, show the plot and its controls if the toggle button is checked and the plot is already loaded

        togglePlots( 'visible' );
        showPlot = true;

    }

}

/**
 * This function handles the toggle event for showing or hiding the tree layer on the map.
 *
 */
function showTreeEvent( ) {

    const elements = [
        'showNDVISwitch',
        'showNDVILabel'
    ];

    // Get the current state of the toggle button for showing nature areas.
    const showTree = document.getElementById( "showTreeToggle" ).checked;

    createVegetationBarPlotPerInhabitant( districtsVisited[ districtsVisited.length - 1 ] );

    if ( showTree ) {

        document.getElementById("showNDVIToggle").disabled = true;
        setElementsDisplay( elements, 'none' );

        if ( majorDistrict && !dataSourceWithNameExists( "Trees" ) ) {

            loadTreesSequentially( majorDistrict );

        } else {

            showDataSourceByName( "Trees" );
        }

    } else {

        document.getElementById("showNDVIToggle").disabled = false;
        hideDataSourceByName( "Trees" );

        if ( !areAnySwitchesOn() ) {

            setElementsDisplay( elements, 'inline-block' );
            toggleLandCoverBarPlots( 'hidden' );

        }

    }

}

function handleNDVIAreaSliders() {

// Get references to all toggle inputs
const YLREToggle = document.getElementById('YLREToggle');
const TreeRegistryToggle = document.getElementById('TreeRegistryToggle');
const PopulationGridToggle = document.getElementById('PopulationGridToggle');
const SubDistrictNDVIToggle = document.getElementById('SubDistrictNDVIToggle');

// Add event listeners to each toggle input
YLREToggle.addEventListener('change', async function() {
    if (YLREToggle.checked) {
        // Disable other toggles
        TreeRegistryToggle.checked = false;
        PopulationGridToggle.checked = false;
        SubDistrictNDVIToggle.checked = false;
        ndviAreaDataSourceName = "YLRE";
        hideDataSourceByName( "TreeRegistry" );
        hideDataSourceByName( "PopulationGrid" );
        hideDataSourceByName( "SubDistrictNDVI" );
        document.getElementById('ndviAreaContainer').style.display = 'none';
        document.getElementById('ndviYlre').value = 8;
        document.getElementById('ndviYlreValue').innerHTML = "June 2023";
        let dataSource = await getDataSourceByName( "YLRE" );
        if ( dataSource ) {
            
            dataForHistogram( dataSource.entities.values, 'ndvi_june2023', 'June 2023');

        }
    }
});

TreeRegistryToggle.addEventListener('change', async function() {
    if (TreeRegistryToggle.checked) {
        // Disable other toggles
        YLREToggle.checked = false;
        PopulationGridToggle.checked = false;
        SubDistrictNDVIToggle.checked = false;
        ndviAreaDataSourceName = "TreeRegistry";
        hideDataSourceByName( "YLRE" );  
        hideDataSourceByName( "PopulationGrid" );
        hideDataSourceByName( "SubDistrictNDVI" );
        await ndviAreaUpdate();
    }
});

PopulationGridToggle.addEventListener('change', async function() {
    if (PopulationGridToggle.checked) {
        // Disable other toggles
        YLREToggle.checked = false;
        TreeRegistryToggle.checked = false;
        SubDistrictNDVIToggle.checked = false;
        ndviAreaDataSourceName = "PopulationGrid";
        hideDataSourceByName( "YLRE" );  
        hideDataSourceByName( "TreeRegistry" );
        hideDataSourceByName( "SubDistrictNDVI" );
        await ndviAreaUpdate();       
    }
});

SubDistrictNDVIToggle.addEventListener('change', async function() {
    if (SubDistrictNDVIToggle.checked) {
        // Disable other toggles
        YLREToggle.checked = false;
        TreeRegistryToggle.checked = false;
        PopulationGridToggle.checked = false;
        ndviAreaDataSourceName = "SubDistrictNDVI";
        hideDataSourceByName( "YLRE" );  
        hideDataSourceByName( "TreeRegistry" );
        hideDataSourceByName( "PopulationGrid" );
        await ndviAreaUpdate();
    }
});
  


}

async function ndviAreaUpdate() {

        document.getElementById('ndviYlreContainer').style.display = 'none';
        document.getElementById('ndviArea').value = 3;
        document.getElementById('ndviAreaValue').innerHTML = "June 2023";
        let dataSource = await getDataSourceByName( "SubDistrictNDVI" );
        if ( dataSource ) {
            
            dataForHistogram( dataSource.entities.values, 'ndvi_june2023', 'June 2023');

        }    
}