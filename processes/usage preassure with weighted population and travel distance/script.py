import geopandas as gpd
import pandas as pd
import json

# File paths
kaava_file = "kaava_valmisteilla.geojson"
travel_matrix_file = "travel_marix_geom.json"

# Read GeoJSON files into GeoDataFrames
kaava_gdf = gpd.read_file(kaava_file)
travel_matrix_gdf = gpd.read_file(travel_matrix_file)

# Initialize a new column in kaava_gdf to store intersecting IDs
kaava_gdf["intersecting_ids"] = None

# Loop through kaava features
for index, kaava_row in kaava_gdf.iterrows():
    # Find intersecting travel matrix features
    intersections = travel_matrix_gdf[
        travel_matrix_gdf.intersects(kaava_row["geometry"])
    ]

    if not intersections.empty:
        # Extract intersecting IDs and convert to integers
        intersecting_ids = intersections["id"].astype(int).tolist()

        # Store intersecting IDs as a list of integers in the kaava feature
        kaava_gdf.at[index, "intersecting_ids"] = intersecting_ids

# Convert the list of intersecting IDs to JSON strings
kaava_gdf["intersecting_ids"] = kaava_gdf["intersecting_ids"].apply(json.dumps)

# Save the updated GeoDataFrame
kaava_gdf.to_file("kaava_valmisteilla_with_intersecting_ids.geojson", driver="GeoJSON")

# File paths
kaava_file = "kaava_valmisteilla_with_intersecting_ids.geojson"
travel_matrix_file = "Helsinki_Travel_Time_Matrix_2023_popgrid_filtered_800m.csv"

# Ensure that 'intersecting_ids' are correctly formatted
kaava_gdf['intersecting_ids'] = kaava_gdf['intersecting_ids'].apply(json.loads)
kaava_gdf["to_ids"] = None

# Read CSV file into a DataFrame
travel_matrix_df = pd.read_csv(travel_matrix_file, usecols=["from_id", "to_id"])

to_id_counts = {}

# Iterate over Kaava features
for idx, kaava_row in kaava_gdf.iterrows():
    to_ids = []  # Initialize an empty list for to_ids
    
    if kaava_row['intersecting_ids']:
        # Iterate over intersecting_ids in the current Kaava feature
        for intersecting_id in kaava_row['intersecting_ids']:
            # Find matching rows in the travel matrix
            matches = travel_matrix_df[travel_matrix_df['from_id'] == intersecting_id]

            # Extract and append unique to_id values to the list
            for _, row in matches.iterrows():
                to_ids.append(row['to_id'])
      
        # Remove duplicates from the to_ids list
        to_ids = list(set(to_ids))
                
        kaava_gdf.at[idx, "to_ids"] = to_ids
        
        for id in to_ids:
            to_id_counts[id] = to_id_counts.get(id, 0) + 1  # Increment count
            
popgrid_file = "hsy_populationgrid.json"

popgrid_gdf = gpd.read_file(popgrid_file)

# Assuming the column name in popgrid is 'asukkaita', otherwise change it here and in the following loop
population_column = 'asukkaita'

# Initialize new columns for total and weighted population
kaava_gdf['total_population'] = 0
kaava_gdf['weighted_population'] = 0.0

# Loop through kaava features
for idx, kaava_row in kaava_gdf.iterrows():
    total_pop = 0
    weighted_pop = 0.0

    # Check if to_ids exists and is not empty
    if kaava_row["to_ids"]:
        for to_id in kaava_row["to_ids"]:
            # Find matching rows in population grid
            matches = popgrid_gdf[popgrid_gdf["travelmarix_id"] == int(to_id)]  
            
            for _, row in matches.iterrows():
                total_pop += row[population_column]
                weight = to_id_counts.get(to_id, 1)  # Default weight to 1 if not found
                weighted_pop += row[population_column] / weight

    # Store calculated values in kaava_gdf
    kaava_gdf.at[idx, 'total_population'] = total_pop
    kaava_gdf.at[idx, 'weighted_population'] = weighted_pop
    
    
kaava_gdf = kaava_gdf.drop(columns=["to_ids", "intersecting_ids"], errors="ignore")  
kaava_gdf.to_file("kaava_valmisteilla_with_population.geojson", driver="GeoJSON")