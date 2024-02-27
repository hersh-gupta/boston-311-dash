library(sf)
library(arrow)
library(tidyverse)

# Reads in 311 data
df = read_csv('docs/data/2024.csv')

# Writes to parquet
write_dataset(df, "docs/data/2024.parquet", format = "parquet")

# Converts to geojson
df_geo <- df |> 
  filter(!is.na(latitude) & !is.na(longitude)) |> 
  select(case_title,subject,reason,type,location,source,open_dt,closed_dt,case_status,latitude,longitude) |>
  mutate(open_dt = as.Date(open_dt), closed_dt = as.Date(closed_dt)) |>
  sf::st_as_sf(coords = c("longitude","latitude"),crs = 4236)

# Writes to geojson
sf::st_write(df_geo, dsn = "docs/data/311_2024.geojson", layer = "311_2024.geojson")
