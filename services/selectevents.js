
/**
 * 
 * A function for adding layer and plot select event listner.
 * 
 */
function addSelectorEventListeners(  ) {
		
    // Listen for changes in the layer selection
    layerSelect.addEventListener('change', function () {
        const selectedLayer = document.getElementById('layerSelect').value;
        viewer.imageryLayers.removeAll(); // Remove existing imagery layers
        viewer.imageryLayers.addImageryProvider( createImageryProvider( selectedLayer ) ); // Add the selected layer
    });	

    // Listen for changes in the layer selection
    NDVISelect.addEventListener('change', function () {
        const selectedLayer = document.getElementById('NDVISelect').value;
        viewer.imageryLayers.removeAll(); // Remove existing imagery layers
        viewer.imageryLayers.addImageryProvider( createNDVIImageryProvider( selectedLayer ) ); // Add the selected layer
    });	

    plotSelect.addEventListener('change', function () {

        if ( districtsVisited.length ) {

            createPieChartForMajorDistrict( districtsVisited[ districtsVisited.length - 1 ] );

        }

    });	
            
}