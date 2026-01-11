### 14.16.3 Functions That Create Geometry Values from WKT Values

These functions take as arguments a Well-Known Text (WKT) representation and, optionally, a spatial reference system identifier (SRID). They return the corresponding geometry. For a description of WKT format, see Well-Known Text (WKT) Format Format").

Functions in this section detect arguments in either Cartesian or geographic spatial reference systems (SRSs), and return results appropriate to the SRS.

`ST_GeomFromText()` accepts a WKT value of any geometry type as its first argument. Other functions provide type-specific construction functions for construction of geometry values of each geometry type.

Functions such as `ST_MPointFromText()` and `ST_GeomFromText()` that accept WKT-format representations of `MultiPoint` values permit individual points within values to be surrounded by parentheses. For example, both of the following function calls are valid:

```
ST_MPointFromText('MULTIPOINT (1 1, 2 2, 3 3)')
ST_MPointFromText('MULTIPOINT ((1 1), (2 2), (3 3))')
```

Functions such as `ST_GeomFromText()` that accept WKT geometry collection arguments understand both OpenGIS `'GEOMETRYCOLLECTION EMPTY'` standard syntax and MySQL `'GEOMETRYCOLLECTION()'` nonstandard syntax. Functions such as `ST_AsWKT()` that produce WKT values produce `'GEOMETRYCOLLECTION EMPTY'` standard syntax:

```
mysql> SET @s1 = ST_GeomFromText('GEOMETRYCOLLECTION()');
mysql> SET @s2 = ST_GeomFromText('GEOMETRYCOLLECTION EMPTY');
mysql> SELECT ST_AsWKT(@s1), ST_AsWKT(@s2);
+--------------------------+--------------------------+
| ST_AsWKT(@s1)            | ST_AsWKT(@s2)            |
+--------------------------+--------------------------+
| GEOMETRYCOLLECTION EMPTY | GEOMETRYCOLLECTION EMPTY |
+--------------------------+--------------------------+
```

Unless otherwise specified, functions in this section handle their geometry arguments as follows:

* If any geometry argument is `NULL` or is not a syntactically well-formed geometry, or if the SRID argument is `NULL`, the return value is `NULL`.

* By default, geographic coordinates (latitude, longitude) are interpreted as in the order specified by the spatial reference system of geometry arguments. An optional *`options`* argument may be given to override the default axis order. `options` consists of a list of comma-separated `key=value`. The only permitted *`key`* value is `axis-order`, with permitted values of `lat-long`, `long-lat` and `srid-defined` (the default).

  If the *`options`* argument is `NULL`, the return value is `NULL`. If the *`options`* argument is invalid, an error occurs to indicate why.

* If an SRID argument refers to an undefined spatial reference system (SRS), an `ER_SRS_NOT_FOUND` error occurs.

* For geographic SRS geometry arguments, if any argument has a longitude or latitude that is out of range, an error occurs:

  + If a longitude value is not in the range (−180, 180], an `ER_LONGITUDE_OUT_OF_RANGE` error occurs.

  + If a latitude value is not in the range [−90, 90], an `ER_LATITUDE_OUT_OF_RANGE` error occurs.

  Ranges shown are in degrees. If an SRS uses another unit, the range uses the corresponding values in its unit. The exact range limits deviate slightly due to floating-point arithmetic.

These functions are available for creating geometries from WKT values:

* [`ST_GeomCollFromText(wkt [, srid [, options)`](gis-wkt-functions.html#function_st-geomcollfromtext), [`ST_GeometryCollectionFromText(wkt [, srid [, options)`](gis-wkt-functions.html#function_st-geomcollfromtext), [`ST_GeomCollFromTxt(wkt [, srid [, options)`](gis-wkt-functions.html#function_st-geomcollfromtext)

  Constructs a `GeometryCollection` value using its WKT representation and SRID.

  These functions handle their arguments as described in the introduction to this section.

  ```
  mysql> SET @g = "MULTILINESTRING((10 10, 11 11), (9 9, 10 10))";
  mysql> SELECT ST_AsText(ST_GeomCollFromText(@g));
  +--------------------------------------------+
  | ST_AsText(ST_GeomCollFromText(@g))         |
  +--------------------------------------------+
  | MULTILINESTRING((10 10,11 11),(9 9,10 10)) |
  +--------------------------------------------+
  ```

* [`ST_GeomFromText(wkt [, srid [, options)`](gis-wkt-functions.html#function_st-geomfromtext), [`ST_GeometryFromText(wkt [, srid [, options)`](gis-wkt-functions.html#function_st-geomfromtext)

  Constructs a geometry value of any type using its WKT representation and SRID.

  These functions handle their arguments as described in the introduction to this section.

* [`ST_LineFromText(wkt [, srid [, options)`](gis-wkt-functions.html#function_st-linefromtext), [`ST_LineStringFromText(wkt [, srid [, options)`](gis-wkt-functions.html#function_st-linefromtext)

  Constructs a `LineString` value using its WKT representation and SRID.

  These functions handle their arguments as described in the introduction to this section.

* [`ST_MLineFromText(wkt [, srid [, options)`](gis-wkt-functions.html#function_st-mlinefromtext), [`ST_MultiLineStringFromText(wkt [, srid [, options)`](gis-wkt-functions.html#function_st-mlinefromtext)

  Constructs a `MultiLineString` value using its WKT representation and SRID.

  These functions handle their arguments as described in the introduction to this section.

* [`ST_MPointFromText(wkt [, srid [, options)`](gis-wkt-functions.html#function_st-mpointfromtext), [`ST_MultiPointFromText(wkt [, srid [, options)`](gis-wkt-functions.html#function_st-mpointfromtext)

  Constructs a `MultiPoint` value using its WKT representation and SRID.

  These functions handle their arguments as described in the introduction to this section.

* [`ST_MPolyFromText(wkt [, srid [, options)`](gis-wkt-functions.html#function_st-mpolyfromtext), [`ST_MultiPolygonFromText(wkt [, srid [, options)`](gis-wkt-functions.html#function_st-mpolyfromtext)

  Constructs a `MultiPolygon` value using its WKT representation and SRID.

  These functions handle their arguments as described in the introduction to this section.

* [`ST_PointFromText(wkt [, srid [, options)`](gis-wkt-functions.html#function_st-pointfromtext)

  Constructs a `Point` value using its WKT representation and SRID.

  `ST_PointFromText()` handles its arguments as described in the introduction to this section.

* [`ST_PolyFromText(wkt [, srid [, options)`](gis-wkt-functions.html#function_st-polyfromtext), [`ST_PolygonFromText(wkt [, srid [, options)`](gis-wkt-functions.html#function_st-polyfromtext)

  Constructs a `Polygon` value using its WKT representation and SRID.

  These functions handle their arguments as described in the introduction to this section.
