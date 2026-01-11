### 14.16.4 Functions That Create Geometry Values from WKB Values

These functions take as arguments a `BLOB` containing a Well-Known Binary (WKB) representation and, optionally, a spatial reference system identifier (SRID). They return the corresponding geometry. For a description of WKB format, see Well-Known Binary (WKB) Format Format").

Functions in this section detect arguments in either Cartesian or geographic spatial reference systems (SRSs), and return results appropriate to the SRS.

`ST_GeomFromWKB()` accepts a WKB value of any geometry type as its first argument. Other functions provide type-specific construction functions for construction of geometry values of each geometry type.

Prior to MySQL 9.5, these functions also accepted geometry objects as returned by the functions in Section 14.16.5, “MySQL-Specific Functions That Create Geometry Values”. Geometry arguments are no longer permitted and produce an error. To migrate calls from using geometry arguments to using WKB arguments, follow these guidelines:

* Rewrite constructs such as `ST_GeomFromWKB(Point(0, 0))` as `Point(0, 0)`.

* Rewrite constructs such as `ST_GeomFromWKB(Point(0, 0), 4326)` as `ST_SRID(Point(0, 0), 4326)` or `ST_GeomFromWKB(ST_AsWKB(Point(0, 0)), 4326)`.

Unless otherwise specified, functions in this section handle their geometry arguments as follows:

* If the WKB or SRID argument is `NULL`, the return value is `NULL`.

* By default, geographic coordinates (latitude, longitude) are interpreted as in the order specified by the spatial reference system of geometry arguments. An optional *`options`* argument may be given to override the default axis order. `options` consists of a list of comma-separated `key=value`. The only permitted *`key`* value is `axis-order`, with permitted values of `lat-long`, `long-lat` and `srid-defined` (the default).

  If the *`options`* argument is `NULL`, the return value is `NULL`. If the *`options`* argument is invalid, an error occurs to indicate why.

* If an SRID argument refers to an undefined spatial reference system (SRS), an `ER_SRS_NOT_FOUND` error occurs.

* For geographic SRS geometry arguments, if any argument has a longitude or latitude that is out of range, an error occurs:

  + If a longitude value is not in the range (−180, 180], an `ER_LONGITUDE_OUT_OF_RANGE` error occurs.

  + If a latitude value is not in the range [−90, 90], an `ER_LATITUDE_OUT_OF_RANGE` error occurs.

  Ranges shown are in degrees. If an SRS uses another unit, the range uses the corresponding values in its unit. The exact range limits deviate slightly due to floating-point arithmetic.

These functions are available for creating geometries from WKB values:

* [`ST_GeomCollFromWKB(wkb [, srid [, options]])`](gis-wkb-functions.html#function_st-geomcollfromwkb), [`ST_GeometryCollectionFromWKB(wkb [, srid [, options]])`](gis-wkb-functions.html#function_st-geomcollfromwkb)

  Constructs a `GeometryCollection` value using its WKB representation and SRID.

  These functions handle their arguments as described in the introduction to this section.

* [`ST_GeomFromWKB(wkb [, srid [, options]])`](gis-wkb-functions.html#function_st-geomfromwkb), [`ST_GeometryFromWKB(wkb [, srid [, options]])`](gis-wkb-functions.html#function_st-geomfromwkb)

  Constructs a geometry value of any type using its WKB representation and SRID.

  These functions handle their arguments as described in the introduction to this section.

* [`ST_LineFromWKB(wkb [, srid [, options]])`](gis-wkb-functions.html#function_st-linefromwkb), [`ST_LineStringFromWKB(wkb [, srid [, options]])`](gis-wkb-functions.html#function_st-linefromwkb)

  Constructs a `LineString` value using its WKB representation and SRID.

  These functions handle their arguments as described in the introduction to this section.

* [`ST_MLineFromWKB(wkb [, srid [, options]])`](gis-wkb-functions.html#function_st-mlinefromwkb), [`ST_MultiLineStringFromWKB(wkb [, srid [, options]])`](gis-wkb-functions.html#function_st-mlinefromwkb)

  Constructs a `MultiLineString` value using its WKB representation and SRID.

  These functions handle their arguments as described in the introduction to this section.

* [`ST_MPointFromWKB(wkb [, srid [, options]])`](gis-wkb-functions.html#function_st-mpointfromwkb), [`ST_MultiPointFromWKB(wkb [, srid [, options]])`](gis-wkb-functions.html#function_st-mpointfromwkb)

  Constructs a `MultiPoint` value using its WKB representation and SRID.

  These functions handle their arguments as described in the introduction to this section.

* [`ST_MPolyFromWKB(wkb [, srid [, options]])`](gis-wkb-functions.html#function_st-mpolyfromwkb), [`ST_MultiPolygonFromWKB(wkb [, srid [, options]])`](gis-wkb-functions.html#function_st-mpolyfromwkb)

  Constructs a `MultiPolygon` value using its WKB representation and SRID.

  These functions handle their arguments as described in the introduction to this section.

* [`ST_PointFromWKB(wkb [, srid [, options]])`](gis-wkb-functions.html#function_st-pointfromwkb)

  Constructs a `Point` value using its WKB representation and SRID.

  `ST_PointFromWKB()` handles its arguments as described in the introduction to this section.

* [`ST_PolyFromWKB(wkb [, srid [, options]])`](gis-wkb-functions.html#function_st-polyfromwkb), [`ST_PolygonFromWKB(wkb [, srid [, options]])`](gis-wkb-functions.html#function_st-polyfromwkb)

  Constructs a `Polygon` value using its WKB representation and SRID.

  These functions handle their arguments as described in the introduction to this section.
