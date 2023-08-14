
/**
 * 
 * A function for adding layer selector event listner.
 * 
 */
function addLayerSelectorEventListener(  ) {
		
    // Listen for changes in the layer selection
    layerSelector.addEventListener('change', function () {
        const selectedLayer = document.getElementById('layerSelector').value;
        viewer.imageryLayers.removeAll(); // Remove existing imagery layers
        viewer.imageryLayers.addImageryProvider( createImageryProvider( selectedLayer ) ); // Add the selected layer
    });	
            
}