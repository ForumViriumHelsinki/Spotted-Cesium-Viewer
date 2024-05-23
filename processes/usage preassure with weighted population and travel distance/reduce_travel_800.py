import pandas as pd
import geopandas as gpd
import os

# Define columns to keep
cols_to_keep = ["from_id", "to_id", "walk_d"]

# Use a chunk size suitable for your memory limitations
chunksize = 1000000 

# File paths
input_file = "Helsinki_Travel_Time_Matrix_2023_reduced_800m.csv"
input_popgrid = "hsy_populationgrid.json"
output_file = "Helsinki_Travel_Time_Matrix_2023_popgrid_filtered_800m.csv"

# Read the population grid GeoJSON
popgrid_gdf = gpd.read_file(input_popgrid)

# Extract all unique travelmarix_id values from the GeoJSON
valid_to_ids = set(popgrid_gdf['travelmarix_id'].unique())

# Define columns to keep and chunk size
cols_to_keep = ["from_id", "to_id", "walk_d"]
chunksize = 1000000

# Read the CSV in chunks
for chunk in pd.read_csv(input_file, usecols=cols_to_keep, chunksize=chunksize):
    # Filter rows where 'to_id' is in the valid_to_ids set, walk_d is within range
    filtered_chunk = chunk[
        (chunk['to_id'].isin(valid_to_ids)) &
        (chunk['walk_d'] <= 800) & 
        (chunk['walk_d'] != -1)
    ]

    # Write each filtered chunk to the output file
    filtered_chunk.to_csv(
        output_file, mode="a", index=False, header=not os.path.exists(output_file)
    )