### 13.4.8 Fetching Spatial Data

Geometry values stored in a table can be fetched in internal
format. You can also convert them to WKT or WKB format.

* Fetching spatial data in internal format:

  Fetching geometry values using internal format can be useful
  in table-to-table transfers:

  ```
  CREATE TABLE geom2 (g GEOMETRY) SELECT g FROM geom;
  ```

* Fetching spatial data in WKT format:

  The [`ST_AsText()`](gis-format-conversion-functions.html#function_st-astext) function
  converts a geometry from internal format to a WKT string.

  ```
  SELECT ST_AsText(g) FROM geom;
  ```

* Fetching spatial data in WKB format:

  The [`ST_AsBinary()`](gis-format-conversion-functions.html#function_st-asbinary) function
  converts a geometry from internal format to a
  [`BLOB`](blob.html "13.3.4 The BLOB and TEXT Types") containing the WKB
  value.

  ```
  SELECT ST_AsBinary(g) FROM geom;
  ```