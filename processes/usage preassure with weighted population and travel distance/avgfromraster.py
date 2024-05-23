import sys
import rasterio
import geopandas as gpd
from rasterio.mask import mask
import numpy as np
from affine import Affine
from math import cos, radians

def calculate_cell_area(transform, latitude):
    """
    Calculate the area of a cell in square meters for a raster in geographic coordinates,
    assuming a uniform cell size and using an approximate method suitable for the latitude of Helsinki.

    Parameters:
    - transform: The affine transform of the raster.
    - latitude: The latitude at which to calculate the area (default is Helsinki's approximate latitude).

    Returns:
    - The area of a cell in square meters.
    """
    # Calculate dimensions of a cell in degrees
    delta_lat = abs(transform.e)  # Cell height in degrees (transform.e is negative)
    delta_lon = transform.a       # Cell width in degrees

    # Convert latitude to radians for the cosine calculation
    lat_rad = radians(latitude)

    # Calculate the area of a cell using the approximate formula
    cell_area_km2 = (delta_lon * cos(lat_rad)) * delta_lat * ((40075/360) ** 2) # Earth circumference is about 40075 km

    # Convert square kilometers to square meters
    cell_area_m2 = cell_area_km2 * (1000 ** 2)

    return cell_area_m2

def main(raster_path, geojson_path, output_path, output_column_name):
    # Open the raster and vector files
    src = rasterio.open(raster_path)
    gdf = gpd.read_file(geojson_path)

    # Initialize a list to store weighted average  values
    weighted_avg_values = []

    # Loop through each building polygon
    for idx, geom in gdf.iterrows():
        # Extract the centroid of the geometry to use its latitude
        centroid = geom.geometry.centroid
        latitude = centroid.y
        geometry = geom.geometry.__geo_interface__
        out_image, out_transform = mask(src, [geometry], crop=True, all_touched=True, filled=True)
        out_image = out_image[0]  # Assuming a single band
    
        # Create an Affine transform for the masked region
        masked_transform = Affine(out_transform[0], out_transform[1], out_transform[2],out_transform[3], out_transform[4], out_transform[5])

        # Initialize total value and total area
        total_value = 0
        total_area = 0

        # Calculate total value and total area for the masked region
        for row in range(out_image.shape[0]):
            for col in range(out_image.shape[1]):
                pixel_value = out_image[row, col]
                if pixel_value > 0:  # Valid pixel
                    cell_area = calculate_cell_area(masked_transform, latitude)
                    total_value += pixel_value * cell_area
                    total_area += cell_area

        # Calculate the weighted average value if there's any valid area
        if total_area > 0:
            avg_value = total_value / total_area
        else:
            avg_value = np.nan  # No valid data within this polygon

        weighted_avg_values.append(avg_value)

    # Add weighted average heat values to the GeoDataFrame
    gdf[output_column_name] = weighted_avg_values

    # Save the updated GeoDataFrame
    gdf.to_file(output_path, driver='GeoJSON')

    # Close the raster file
    src.close()

if __name__ == "__main__":
    if len(sys.argv) < 5:
        print("Usage: python script.py <raster_path> <geojson_path> <output_path> <output_column_name>")
        sys.exit(1)

    raster_path = sys.argv[1]
    geojson_path = sys.argv[2]
    output_path = sys.argv[3]
    output_column_name = sys.argv[4]

    main(raster_path, geojson_path, output_path, output_column_name)