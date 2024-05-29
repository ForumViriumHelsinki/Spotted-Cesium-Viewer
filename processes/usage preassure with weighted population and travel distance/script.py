import geopandas as gpd
import pandas as pd
import json
import sys
import re

def get_postfix(filename):
    match = re.search(r"(\d+m)", filename)
    if match:
        return f"_{match.group(1)}"
    else:
        return ""  # Return an empty string if no match found

def find_intersecting_ids(geojson_gdf, travel_matrix_geom_path):
    # Initialize a new column in geojson_gdf to store intersecting IDs
    geojson_gdf["intersecting_ids"] = None
    travel_matrix_geom_gdf = gpd.read_file(travel_matrix_geom_path)

    # Loop through geojson features
    for index, row in geojson_gdf.iterrows():
        # Find intersecting travel matrix features
        intersections = travel_matrix_geom_gdf[
            travel_matrix_geom_gdf.intersects(row["geometry"])
        ]

        if not intersections.empty:
            # Extract intersecting IDs and convert to integers
            intersecting_ids = intersections["id"].astype(int).tolist()

            # Store intersecting IDs as a list of integers in the geojson feature
            geojson_gdf.at[index, "intersecting_ids"] = intersecting_ids

    # Convert the list of intersecting IDs to JSON strings
    geojson_gdf["intersecting_ids"] = geojson_gdf["intersecting_ids"].apply(json.dumps)

def find_to_ids(geojson_gdf, travel_matrix_data_path):
    # Read CSV file into a DataFrame
    travel_matrix_data_df = pd.read_csv(travel_matrix_data_path, usecols=["from_id", "to_id"])
    geojson_gdf["to_ids"] = None
    to_id_counts = {}
    geojson_gdf['intersecting_ids'] = geojson_gdf['intersecting_ids'].apply(json.loads)

    # Iterate over geojson features
    for idx, gdf_row in geojson_gdf.iterrows():
        to_ids = []  # Initialize an empty list for to_ids
    
        if gdf_row['intersecting_ids']:
            # Iterate over intersecting_ids in the current geojson feature
            for intersecting_id in gdf_row['intersecting_ids']:
                
                # Find matching rows in the travel matrix
                matches = travel_matrix_data_df[travel_matrix_data_df['from_id'] == intersecting_id]

                # Extract and append unique to_id values to the list
                for _, row in matches.iterrows():
                    if gdf_row['max'] >= 0.5:                     # weights only to
                        to_ids.append(row['to_id'])
      
            # Remove duplicates from the to_ids list
            to_ids = list(set(to_ids))
            
            geojson_gdf.at[idx, "to_ids"] = to_ids
        
            for id in to_ids:
                to_id_counts[id] = to_id_counts.get(id, 0) + 1  # Increment count
 
    return to_id_counts

def init_columns(postfix, geojson_gdf):
        # Initialize new columns for total and weighted population
    base_columns = ['total_population', 'weighted_population', 'under10_population', 'weighted_under10_population', 'over69_population', 'weighted_over69_population']

    # Create new columns with the postfix
    columns_with_postfix = [col + postfix for col in base_columns]

    for col in columns_with_postfix:
        geojson_gdf[col] = 0 if col.startswith("weighted") else 0.0  # Initialize with appropriate types
   
def calculate_populations(geojson_gdf, popgrid_gdf, postfix, to_id_counts):
    popgrid_gdf = gpd.read_file(popgrid_path)

    # Loop through geojson features
    for idx, geojson_row in geojson_gdf.iterrows():
        total_pop = 0
        total_under10 = 0
        total_over69 = 0
        weighted_pop_under10 = 0.0
        weighted_pop_over69 = 0.0
        weighted_pop = 0.0

        # Check if to_ids exists and is not empty
        if geojson_row["to_ids"]:
            for to_id in geojson_row["to_ids"]:
                # Find matching rows in population grid
                matches = popgrid_gdf[popgrid_gdf["travelmarix_id"] == int(to_id)]  
            
                for _, row in matches.iterrows():
                    total_pop += row['asukkaita']
                    weight = to_id_counts.get(to_id, 1)  # Default weight to 1 if not found
                    weighted_pop += row['asukkaita'] / weight

                    if row['asukkaita'] > 99:
                        total_under10 += row['ika0_9']
                        total_over69 += row['ika70_79']
                        total_over69 += row['ika_yli80']
                        weighted_pop_under10 += row['ika0_9'] / weight
                        weighted_pop_over69 += ( row['ika70_79'] + row['ika_yli80'] ) / weight
        
        # Store calculated values in geojson_gdf (using columns_with_postfix)
        geojson_gdf.at[idx, f'total_population{postfix}'] = total_pop
        geojson_gdf.at[idx, f'weighted_population{postfix}'] = weighted_pop

        # Store calculated values in geojson_gdf
        geojson_gdf.at[idx, f'under10_population{postfix}'] = total_under10
        geojson_gdf.at[idx, f'weighted_under10_population{postfix}'] = weighted_pop_under10    

        # Store calculated values in geojson_gdf
        geojson_gdf.at[idx, f'over69_population{postfix}'] = total_over69
        geojson_gdf.at[idx, f'weighted_over69_population{postfix}'] = weighted_pop_over69     
    
def drop_columns_and_save_to_file(geojson_gdf, out_geojson_path):

    geojson_gdf = geojson_gdf.drop(columns=["to_ids", "intersecting_ids"], errors="ignore")  
    geojson_gdf.to_file(out_geojson_path, driver="GeoJSON")
    
def main(input_geojson_path, out_geojson_path, travel_matrix_geom_path, travel_matrix_data_path, popgrid_path):

    # Read GeoJSON files into GeoDataFrames
    geojson_gdf = gpd.read_file(input_geojson_path)
    find_intersecting_ids(geojson_gdf, travel_matrix_geom_path)
    to_id_counts = find_to_ids(geojson_gdf, travel_matrix_data_path)
    postfix = get_postfix(travel_matrix_data_path)
    init_columns(postfix, geojson_gdf)
    calculate_populations(geojson_gdf, popgrid_path, postfix, to_id_counts) 
    drop_columns_and_save_to_file(geojson_gdf, out_geojson_path)  


if __name__ == "__main__":
    if len(sys.argv) < 6:
        print("Usage: python script.py <input_geojson_path> <out_geojson_path> <travel_matrix_geom_path> <travel_matrix_data_path> <popgrid_path>")
        sys.exit(1)

    input_geojson_path = sys.argv[1]
    out_geojson_path = sys.argv[2]
    travel_matrix_geom_path = sys.argv[3]
    travel_matrix_data_path = sys.argv[4]
    popgrid_path = sys.argv[5]

    main(input_geojson_path, out_geojson_path, travel_matrix_geom_path, travel_matrix_data_path, popgrid_path)
