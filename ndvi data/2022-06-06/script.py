import rasterio
import numpy as np

# Open the red and NIR bands
with rasterio.open('B04_(Raw).tiff') as red:
    red_band = red.read(1)
    red_profile = red.profile

with rasterio.open('B08_(Raw).tiff') as nir:
    nir_band = nir.read(1)

# Calculate NDVI
ndvi = (nir_band.astype(float) - red_band.astype(float)) / (nir_band + red_band)
ndvi[np.isnan(ndvi)] = 0  # Fix any division by zero issues

# Update the profile to reflect the NDVI data
ndvi_profile = red_profile
ndvi_profile.update(dtype=rasterio.float32, count=1, compress='lzw')

# Write the NDVI raster
with rasterio.open('ndvi2022.tiff', 'w', **ndvi_profile) as dst:
    dst.write(ndvi.astype(rasterio.float32), 1)