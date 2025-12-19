--- title: MySQL 8.4 Reference Manual :: 14.16.6 Geometry Format Conversion Functions url: https://dev.mysql.com/doc/refman/8.4/en/gis-format-conversion-functions.html order: 41 ---



### 14.16.6 Geometry Format Conversion Functions

MySQL supports the functions listed in this section for converting geometry values from internal geometry format to WKT or WKB format, or for swapping the order of X and Y coordinates.

There are also functions to convert a string from WKT or WKB format to internal geometry format. See Section 14.16.3, “Functions That Create Geometry Values from WKT Values”, and Section 14.16.4, “Functions That Create Geometry Values from WKB Values”.

Functions such as  `ST_GeomFromText()` that accept WKT geometry collection arguments understand both OpenGIS `'GEOMETRYCOLLECTION EMPTY'` standard syntax and MySQL `'GEOMETRYCOLLECTION()'` nonstandard syntax. Another way to produce an empty geometry collection is by calling `GeometryCollection()` with no arguments. Functions such as `ST_AsWKT()` that produce WKT values produce `'GEOMETRYCOLLECTION EMPTY'` standard syntax:

```
mysql> SET @s1 = ST_GeomFromText('GEOMETRYCOLLECTION()');
mysql> SET @s2 = ST_GeomFromText('GEOMETRYCOLLECTION EMPTY');
mysql> SELECT ST_AsWKT(@s1), ST_AsWKT(@s2);
+--------------------------+--------------------------+
| ST_AsWKT(@s1)            | ST_AsWKT(@s2)            |
+--------------------------+--------------------------+
| GEOMETRYCOLLECTION EMPTY | GEOMETRYCOLLECTION EMPTY |
+--------------------------+--------------------------+
mysql> SELECT ST_AsWKT(GeomCollection());
+----------------------------+
| ST_AsWKT(GeomCollection()) |
+----------------------------+
| GEOMETRYCOLLECTION EMPTY   |
+----------------------------+
```

Unless otherwise specified, functions in this section handle their geometry arguments as follows:

* If any argument is `NULL`, the return value is `NULL`.
* If any geometry argument is not a syntactically well-formed geometry, an `ER_GIS_INVALID_DATA` error occurs.
* If any geometry argument is in an undefined spatial reference system, the axes are output in the order they appear in the geometry and an `ER_WARN_SRS_NOT_FOUND_AXIS_ORDER` warning occurs.
* By default, geographic coordinates (latitude, longitude) are interpreted as in the order specified by the spatial reference system of geometry arguments. An optional *`options`* argument may be given to override the default axis order. `options` consists of a list of comma-separated `key=value`. The only permitted *`key`* value is `axis-order`, with permitted values of `lat-long`, `long-lat` and `srid-defined` (the default).

  If the *`options`* argument is `NULL`, the return value is `NULL`. If the *`options`* argument is invalid, an error occurs to indicate why.
* Otherwise, the return value is non-`NULL`.

These functions are available for format conversions or coordinate swapping:

* [`ST_AsBinary(g [, options])`](gis-format-conversion-functions.html#function_st-asbinary), [`ST_AsWKB(g [, options])`](gis-format-conversion-functions.html#function_st-asbinary)

  Converts a value in internal geometry format to its WKB representation and returns the binary result.

  The function return value has geographic coordinates (latitude, longitude) in the order specified by the spatial reference system that applies to the geometry argument. An optional *`options`* argument may be given to override the default axis order.

   `ST_AsBinary()` and `ST_AsWKB()` handle their arguments as described in the introduction to this section.

  ```
  mysql> SET @g = ST_LineFromText('LINESTRING(0 5,5 10,10 15)', 4326);
  mysql> SELECT ST_AsText(ST_GeomFromWKB(ST_AsWKB(@g)));
  +-----------------------------------------+
  | ST_AsText(ST_GeomFromWKB(ST_AsWKB(@g))) |
  +-----------------------------------------+
  | LINESTRING(5 0,10 5,15 10)              |
  +-----------------------------------------+
  mysql> SELECT ST_AsText(ST_GeomFromWKB(ST_AsWKB(@g, 'axis-order=long-lat')));
  +----------------------------------------------------------------+
  | ST_AsText(ST_GeomFromWKB(ST_AsWKB(@g, 'axis-order=long-lat'))) |
  +----------------------------------------------------------------+
  | LINESTRING(0 5,5 10,10 15)                                     |
  +----------------------------------------------------------------+
  mysql> SELECT ST_AsText(ST_GeomFromWKB(ST_AsWKB(@g, 'axis-order=lat-long')));
  +----------------------------------------------------------------+
  | ST_AsText(ST_GeomFromWKB(ST_AsWKB(@g, 'axis-order=lat-long'))) |
  +----------------------------------------------------------------+
  | LINESTRING(5 0,10 5,15 10)                                     |
  +----------------------------------------------------------------+
  ```
* [`ST_AsText(g [, options])`](gis-format-conversion-functions.html#function_st-astext), [`ST_AsWKT(g [, options])`](gis-format-conversion-functions.html#function_st-astext)

  Converts a value in internal geometry format to its WKT representation and returns the string result.

  The function return value has geographic coordinates (latitude, longitude) in the order specified by the spatial reference system that applies to the geometry argument. An optional *`options`* argument may be given to override the default axis order.

   `ST_AsText()` and `ST_AsWKT()` handle their arguments as described in the introduction to this section.

  ```
  mysql> SET @g = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_AsText(ST_GeomFromText(@g));
  +--------------------------------+
  | ST_AsText(ST_GeomFromText(@g)) |
  +--------------------------------+
  | LINESTRING(1 1,2 2,3 3)        |
  +--------------------------------+
  ```

  Output for `MultiPoint` values includes parentheses around each point. For example:

  ```
  mysql> SELECT ST_AsText(ST_GeomFromText(@mp));
  +---------------------------------+
  | ST_AsText(ST_GeomFromText(@mp)) |
  +---------------------------------+
  | MULTIPOINT((1 1),(2 2),(3 3))   |
  +---------------------------------+
  ```
*  `ST_SwapXY(g)`

  Accepts an argument in internal geometry format, swaps the X and Y values of each coordinate pair within the geometry, and returns the result.

   `ST_SwapXY()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SET @g = ST_LineFromText('LINESTRING(0 5,5 10,10 15)');
  mysql> SELECT ST_AsText(@g);
  +----------------------------+
  | ST_AsText(@g)              |
  +----------------------------+
  | LINESTRING(0 5,5 10,10 15) |
  +----------------------------+
  mysql> SELECT ST_AsText(ST_SwapXY(@g));
  +----------------------------+
  | ST_AsText(ST_SwapXY(@g))   |
  +----------------------------+
  | LINESTRING(5 0,10 5,15 10) |
  +----------------------------+
  ```

