## 14.16 Spatial Analysis Functions

MySQL provides functions to perform various operations on spatial data. These functions can be grouped into several major categories according to the type of operation they perform:

* Functions that create geometries in various formats (WKT, WKB, internal)

* Functions that convert geometries between formats
* Functions that access qualitative or quantitative properties of a geometry

* Functions that describe relations between two geometries
* Functions that create new geometries from existing ones

For general background about MySQL support for using spatial data, see Section 13.4, “Spatial Data Types”.


### 14.16.1 Spatial Function Reference

The following table lists each spatial function and provides a short description of each one.

**Table 14.21 Spatial Functions**

<table frame="box" rules="all" summary="A reference that lists all spatial functions."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Name</th> <th>Description</th> <th>Introduced</th> </tr></thead><tbody><tr><th scope="row"><code>GeomCollection()</code></th> <td> Construct geometry collection from geometries </td> <td></td> </tr><tr><th scope="row"><code>GeometryCollection()</code></th> <td> Construct geometry collection from geometries </td> <td></td> </tr><tr><th scope="row"><code>LineString()</code></th> <td> Construct LineString from Point values </td> <td></td> </tr><tr><th scope="row"><code>MBRContains()</code></th> <td> Whether MBR of one geometry contains MBR of another </td> <td></td> </tr><tr><th scope="row"><code>MBRCoveredBy()</code></th> <td> Whether one MBR is covered by another </td> <td></td> </tr><tr><th scope="row"><code>MBRCovers()</code></th> <td> Whether one MBR covers another </td> <td></td> </tr><tr><th scope="row"><code>MBRDisjoint()</code></th> <td> Whether MBRs of two geometries are disjoint </td> <td></td> </tr><tr><th scope="row"><code>MBREquals()</code></th> <td> Whether MBRs of two geometries are equal </td> <td></td> </tr><tr><th scope="row"><code>MBRIntersects()</code></th> <td> Whether MBRs of two geometries intersect </td> <td></td> </tr><tr><th scope="row"><code>MBROverlaps()</code></th> <td> Whether MBRs of two geometries overlap </td> <td></td> </tr><tr><th scope="row"><code>MBRTouches()</code></th> <td> Whether MBRs of two geometries touch </td> <td></td> </tr><tr><th scope="row"><code>MBRWithin()</code></th> <td> Whether MBR of one geometry is within MBR of another </td> <td></td> </tr><tr><th scope="row"><code>MultiLineString()</code></th> <td> Contruct MultiLineString from LineString values </td> <td></td> </tr><tr><th scope="row"><code>MultiPoint()</code></th> <td> Construct MultiPoint from Point values </td> <td></td> </tr><tr><th scope="row"><code>MultiPolygon()</code></th> <td> Construct MultiPolygon from Polygon values </td> <td></td> </tr><tr><th scope="row"><code>Point()</code></th> <td> Construct Point from coordinates </td> <td></td> </tr><tr><th scope="row"><code>Polygon()</code></th> <td> Construct Polygon from LineString arguments </td> <td></td> </tr><tr><th scope="row"><code>ST_Area()</code></th> <td> Return Polygon or MultiPolygon area </td> <td></td> </tr><tr><th scope="row"><code>ST_AsBinary()</code>, <code>ST_AsWKB()</code></th> <td> Convert from internal geometry format to WKB </td> <td></td> </tr><tr><th scope="row"><code>ST_AsGeoJSON()</code></th> <td> Generate GeoJSON object from geometry </td> <td></td> </tr><tr><th scope="row"><code>ST_AsText()</code>, <code>ST_AsWKT()</code></th> <td> Convert from internal geometry format to WKT </td> <td></td> </tr><tr><th scope="row"><code>ST_Buffer()</code></th> <td> Return geometry of points within given distance from geometry </td> <td></td> </tr><tr><th scope="row"><code>ST_Buffer_Strategy()</code></th> <td> Produce strategy option for ST_Buffer() </td> <td></td> </tr><tr><th scope="row"><code>ST_Centroid()</code></th> <td> Return centroid as a point </td> <td></td> </tr><tr><th scope="row"><code>ST_Collect()</code></th> <td> Aggregate spatial values into collection </td> <td>8.0.24</td> </tr><tr><th scope="row"><code>ST_Contains()</code></th> <td> Whether one geometry contains another </td> <td></td> </tr><tr><th scope="row"><code>ST_ConvexHull()</code></th> <td> Return convex hull of geometry </td> <td></td> </tr><tr><th scope="row"><code>ST_Crosses()</code></th> <td> Whether one geometry crosses another </td> <td></td> </tr><tr><th scope="row"><code>ST_Difference()</code></th> <td> Return point set difference of two geometries </td> <td></td> </tr><tr><th scope="row"><code>ST_Dimension()</code></th> <td> Dimension of geometry </td> <td></td> </tr><tr><th scope="row"><code>ST_Disjoint()</code></th> <td> Whether one geometry is disjoint from another </td> <td></td> </tr><tr><th scope="row"><code>ST_Distance()</code></th> <td> The distance of one geometry from another </td> <td></td> </tr><tr><th scope="row"><code>ST_Distance_Sphere()</code></th> <td> Minimum distance on earth between two geometries </td> <td></td> </tr><tr><th scope="row"><code>ST_EndPoint()</code></th> <td> End Point of LineString </td> <td></td> </tr><tr><th scope="row"><code>ST_Envelope()</code></th> <td> Return MBR of geometry </td> <td></td> </tr><tr><th scope="row"><code>ST_Equals()</code></th> <td> Whether one geometry is equal to another </td> <td></td> </tr><tr><th scope="row"><code>ST_ExteriorRing()</code></th> <td> Return exterior ring of Polygon </td> <td></td> </tr><tr><th scope="row"><code>ST_FrechetDistance()</code></th> <td> The discrete Fréchet distance of one geometry from another </td> <td>8.0.23</td> </tr><tr><th scope="row"><code>ST_GeoHash()</code></th> <td> Produce a geohash value </td> <td></td> </tr><tr><th scope="row"><code>ST_GeomCollFromText()</code>, <code>ST_GeometryCollectionFromText()</code>, <code>ST_GeomCollFromTxt()</code></th> <td> Return geometry collection from WKT </td> <td></td> </tr><tr><th scope="row"><code>ST_GeomCollFromWKB()</code>, <code>ST_GeometryCollectionFromWKB()</code></th> <td> Return geometry collection from WKB </td> <td></td> </tr><tr><th scope="row"><code>ST_GeometryN()</code></th> <td> Return N-th geometry from geometry collection </td> <td></td> </tr><tr><th scope="row"><code>ST_GeometryType()</code></th> <td> Return name of geometry type </td> <td></td> </tr><tr><th scope="row"><code>ST_GeomFromGeoJSON()</code></th> <td> Generate geometry from GeoJSON object </td> <td></td> </tr><tr><th scope="row"><code>ST_GeomFromText()</code>, <code>ST_GeometryFromText()</code></th> <td> Return geometry from WKT </td> <td></td> </tr><tr><th scope="row"><code>ST_GeomFromWKB()</code>, <code>ST_GeometryFromWKB()</code></th> <td> Return geometry from WKB </td> <td></td> </tr><tr><th scope="row"><code>ST_HausdorffDistance()</code></th> <td> The discrete Hausdorff distance of one geometry from another </td> <td>8.0.23</td> </tr><tr><th scope="row"><code>ST_InteriorRingN()</code></th> <td> Return N-th interior ring of Polygon </td> <td></td> </tr><tr><th scope="row"><code>ST_Intersection()</code></th> <td> Return point set intersection of two geometries </td> <td></td> </tr><tr><th scope="row"><code>ST_Intersects()</code></th> <td> Whether one geometry intersects another </td> <td></td> </tr><tr><th scope="row"><code>ST_IsClosed()</code></th> <td> Whether a geometry is closed and simple </td> <td></td> </tr><tr><th scope="row"><code>ST_IsEmpty()</code></th> <td> Whether a geometry is empty </td> <td></td> </tr><tr><th scope="row"><code>ST_IsSimple()</code></th> <td> Whether a geometry is simple </td> <td></td> </tr><tr><th scope="row"><code>ST_IsValid()</code></th> <td> Whether a geometry is valid </td> <td></td> </tr><tr><th scope="row"><code>ST_LatFromGeoHash()</code></th> <td> Return latitude from geohash value </td> <td></td> </tr><tr><th scope="row"><code>ST_Latitude()</code></th> <td> Return latitude of Point </td> <td>8.0.12</td> </tr><tr><th scope="row"><code>ST_Length()</code></th> <td> Return length of LineString </td> <td></td> </tr><tr><th scope="row"><code>ST_LineFromText()</code>, <code>ST_LineStringFromText()</code></th> <td> Construct LineString from WKT </td> <td></td> </tr><tr><th scope="row"><code>ST_LineFromWKB()</code>, <code>ST_LineStringFromWKB()</code></th> <td> Construct LineString from WKB </td> <td></td> </tr><tr><th scope="row"><code>ST_LineInterpolatePoint()</code></th> <td> The point a given percentage along a LineString </td> <td>8.0.24</td> </tr><tr><th scope="row"><code>ST_LineInterpolatePoints()</code></th> <td> The points a given percentage along a LineString </td> <td>8.0.24</td> </tr><tr><th scope="row"><code>ST_LongFromGeoHash()</code></th> <td> Return longitude from geohash value </td> <td></td> </tr><tr><th scope="row"><code>ST_Longitude()</code></th> <td> Return longitude of Point </td> <td>8.0.12</td> </tr><tr><th scope="row"><code>ST_MakeEnvelope()</code></th> <td> Rectangle around two points </td> <td></td> </tr><tr><th scope="row"><code>ST_MLineFromText()</code>, <code>ST_MultiLineStringFromText()</code></th> <td> Construct MultiLineString from WKT </td> <td></td> </tr><tr><th scope="row"><code>ST_MLineFromWKB()</code>, <code>ST_MultiLineStringFromWKB()</code></th> <td> Construct MultiLineString from WKB </td> <td></td> </tr><tr><th scope="row"><code>ST_MPointFromText()</code>, <code>ST_MultiPointFromText()</code></th> <td> Construct MultiPoint from WKT </td> <td></td> </tr><tr><th scope="row"><code>ST_MPointFromWKB()</code>, <code>ST_MultiPointFromWKB()</code></th> <td> Construct MultiPoint from WKB </td> <td></td> </tr><tr><th scope="row"><code>ST_MPolyFromText()</code>, <code>ST_MultiPolygonFromText()</code></th> <td> Construct MultiPolygon from WKT </td> <td></td> </tr><tr><th scope="row"><code>ST_MPolyFromWKB()</code>, <code>ST_MultiPolygonFromWKB()</code></th> <td> Construct MultiPolygon from WKB </td> <td></td> </tr><tr><th scope="row"><code>ST_NumGeometries()</code></th> <td> Return number of geometries in geometry collection </td> <td></td> </tr><tr><th scope="row"><code>ST_NumInteriorRing()</code>, <code>ST_NumInteriorRings()</code></th> <td> Return number of interior rings in Polygon </td> <td></td> </tr><tr><th scope="row"><code>ST_NumPoints()</code></th> <td> Return number of points in LineString </td> <td></td> </tr><tr><th scope="row"><code>ST_Overlaps()</code></th> <td> Whether one geometry overlaps another </td> <td></td> </tr><tr><th scope="row"><code>ST_PointAtDistance()</code></th> <td> The point a given distance along a LineString </td> <td>8.0.24</td> </tr><tr><th scope="row"><code>ST_PointFromGeoHash()</code></th> <td> Convert geohash value to POINT value </td> <td></td> </tr><tr><th scope="row"><code>ST_PointFromText()</code></th> <td> Construct Point from WKT </td> <td></td> </tr><tr><th scope="row"><code>ST_PointFromWKB()</code></th> <td> Construct Point from WKB </td> <td></td> </tr><tr><th scope="row"><code>ST_PointN()</code></th> <td> Return N-th point from LineString </td> <td></td> </tr><tr><th scope="row"><code>ST_PolyFromText()</code>, <code>ST_PolygonFromText()</code></th> <td> Construct Polygon from WKT </td> <td></td> </tr><tr><th scope="row"><code>ST_PolyFromWKB()</code>, <code>ST_PolygonFromWKB()</code></th> <td> Construct Polygon from WKB </td> <td></td> </tr><tr><th scope="row"><code>ST_Simplify()</code></th> <td> Return simplified geometry </td> <td></td> </tr><tr><th scope="row"><code>ST_SRID()</code></th> <td> Return spatial reference system ID for geometry </td> <td></td> </tr><tr><th scope="row"><code>ST_StartPoint()</code></th> <td> Start Point of LineString </td> <td></td> </tr><tr><th scope="row"><code>ST_SwapXY()</code></th> <td> Return argument with X/Y coordinates swapped </td> <td></td> </tr><tr><th scope="row"><code>ST_SymDifference()</code></th> <td> Return point set symmetric difference of two geometries </td> <td></td> </tr><tr><th scope="row"><code>ST_Touches()</code></th> <td> Whether one geometry touches another </td> <td></td> </tr><tr><th scope="row"><code>ST_Transform()</code></th> <td> Transform coordinates of geometry </td> <td>8.0.13</td> </tr><tr><th scope="row"><code>ST_Union()</code></th> <td> Return point set union of two geometries </td> <td></td> </tr><tr><th scope="row"><code>ST_Validate()</code></th> <td> Return validated geometry </td> <td></td> </tr><tr><th scope="row"><code>ST_Within()</code></th> <td> Whether one geometry is within another </td> <td></td> </tr><tr><th scope="row"><code>ST_X()</code></th> <td> Return X coordinate of Point </td> <td></td> </tr><tr><th scope="row"><code>ST_Y()</code></th> <td> Return Y coordinate of Point </td> <td></td> </tr></tbody></table>


### 14.16.2 Argument Handling by Spatial Functions

Spatial values, or geometries, have the properties described in Section 13.4.2.2, “Geometry Class”. The following discussion lists general spatial function argument-handling characteristics. Specific functions or groups of functions may have additional or different argument-handling characteristics, as discussed in the sections where those function descriptions occur. Where that is true, those descriptions take precedence over the general discussion here.

Spatial functions are defined only for valid geometry values. See Section 13.4.4, “Geometry Well-Formedness and Validity”.

Each geometry value is associated with a spatial reference system (SRS), which is a coordinate-based system for geographic locations. See Section 13.4.5, “Spatial Reference System Support”.

The spatial reference identifier (SRID) of a geometry identifies the SRS in which the geometry is defined. In MySQL, the SRID value is an integer associated with the geometry value. The maximum usable SRID value is 232−1. If a larger value is given, only the lower 32 bits are used.

SRID 0 represents an infinite flat Cartesian plane with no units assigned to its axes. To ensure SRID 0 behavior, create geometry values using SRID 0. SRID 0 is the default for new geometry values if no SRID is specified.

For computations on multiple geometry values, all values must be in the same SRS or an error occurs. Thus, spatial functions that take multiple geometry arguments require those arguments to be in the same SRS. If a spatial function returns `ER_GIS_DIFFERENT_SRIDS`, it means that the geometry arguments were not all in the same SRS. You must modify them to have the same SRS.

A geometry returned by a spatial function is in the SRS of the geometry arguments because geometry values produced by any spatial function inherit the SRID of the geometry arguments.

The [Open Geospatial Consortium](http://www.opengeospatial.org) guidelines require that input polygons already be closed, so unclosed polygons are rejected as invalid rather than being closed.

In MySQL, the only valid empty geometry is represented in the form of an empty geometry collection. Empty geometry collection handling is as follows: An empty WKT input geometry collection may be specified as `'GEOMETRYCOLLECTION()'`. This is also the output WKT resulting from a spatial operation that produces an empty geometry collection.

During parsing of a nested geometry collection, the collection is flattened and its basic components are used in various GIS operations to compute results. This provides additional flexibility to users because it is unnecessary to be concerned about the uniqueness of geometry data. Nested geometry collections may be produced from nested GIS function calls without having to be explicitly flattened first.


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

* [`ST_GeomCollFromText(wkt [, srid [, options]])`](gis-wkt-functions.html#function_st-geomcollfromtext), [`ST_GeometryCollectionFromText(wkt [, srid [, options]])`](gis-wkt-functions.html#function_st-geomcollfromtext), [`ST_GeomCollFromTxt(wkt [, srid [, options]])`](gis-wkt-functions.html#function_st-geomcollfromtext)

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

* [`ST_GeomFromText(wkt [, srid [, options]])`](gis-wkt-functions.html#function_st-geomfromtext), [`ST_GeometryFromText(wkt [, srid [, options]])`](gis-wkt-functions.html#function_st-geomfromtext)

  Constructs a geometry value of any type using its WKT representation and SRID.

  These functions handle their arguments as described in the introduction to this section.

* [`ST_LineFromText(wkt [, srid [, options]])`](gis-wkt-functions.html#function_st-linefromtext), [`ST_LineStringFromText(wkt [, srid [, options]])`](gis-wkt-functions.html#function_st-linefromtext)

  Constructs a `LineString` value using its WKT representation and SRID.

  These functions handle their arguments as described in the introduction to this section.

* [`ST_MLineFromText(wkt [, srid [, options]])`](gis-wkt-functions.html#function_st-mlinefromtext), [`ST_MultiLineStringFromText(wkt [, srid [, options]])`](gis-wkt-functions.html#function_st-mlinefromtext)

  Constructs a `MultiLineString` value using its WKT representation and SRID.

  These functions handle their arguments as described in the introduction to this section.

* [`ST_MPointFromText(wkt [, srid [, options]])`](gis-wkt-functions.html#function_st-mpointfromtext), [`ST_MultiPointFromText(wkt [, srid [, options]])`](gis-wkt-functions.html#function_st-mpointfromtext)

  Constructs a `MultiPoint` value using its WKT representation and SRID.

  These functions handle their arguments as described in the introduction to this section.

* [`ST_MPolyFromText(wkt [, srid [, options]])`](gis-wkt-functions.html#function_st-mpolyfromtext), [`ST_MultiPolygonFromText(wkt [, srid [, options]])`](gis-wkt-functions.html#function_st-mpolyfromtext)

  Constructs a `MultiPolygon` value using its WKT representation and SRID.

  These functions handle their arguments as described in the introduction to this section.

* [`ST_PointFromText(wkt [, srid [, options]])`](gis-wkt-functions.html#function_st-pointfromtext)

  Constructs a `Point` value using its WKT representation and SRID.

  `ST_PointFromText()` handles its arguments as described in the introduction to this section.

* [`ST_PolyFromText(wkt [, srid [, options]])`](gis-wkt-functions.html#function_st-polyfromtext), [`ST_PolygonFromText(wkt [, srid [, options]])`](gis-wkt-functions.html#function_st-polyfromtext)

  Constructs a `Polygon` value using its WKT representation and SRID.

  These functions handle their arguments as described in the introduction to this section.


### 14.16.4 Functions That Create Geometry Values from WKB Values

These functions take as arguments a `BLOB` containing a Well-Known Binary (WKB) representation and, optionally, a spatial reference system identifier (SRID). They return the corresponding geometry. For a description of WKB format, see Well-Known Binary (WKB) Format Format").

Functions in this section detect arguments in either Cartesian or geographic spatial reference systems (SRSs), and return results appropriate to the SRS.

`ST_GeomFromWKB()` accepts a WKB value of any geometry type as its first argument. Other functions provide type-specific construction functions for construction of geometry values of each geometry type.

Prior to MySQL 8.0, these functions also accepted geometry objects as returned by the functions in Section 14.16.5, “MySQL-Specific Functions That Create Geometry Values”. Geometry arguments are no longer permitted and produce an error. To migrate calls from using geometry arguments to using WKB arguments, follow these guidelines:

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


### 14.16.5 MySQL-Specific Functions That Create Geometry Values

MySQL provides a set of useful nonstandard functions for creating geometry values. The functions described in this section are MySQL extensions to the OpenGIS specification.

These functions produce geometry objects from either WKB values or geometry objects as arguments. If any argument is not a proper WKB or geometry representation of the proper object type, the return value is `NULL`.

For example, you can insert the geometry return value from `Point()` directly into a `POINT` column:

```
INSERT INTO t1 (pt_col) VALUES(Point(1,2));
```

* [`GeomCollection(g [, g] ...)`](gis-mysql-specific-functions.html#function_geomcollection)

  Constructs a `GeomCollection` value from the geometry arguments.

  `GeomCollection()` returns all the proper geometries contained in the arguments even if a nonsupported geometry is present.

  `GeomCollection()` with no arguments is permitted as a way to create an empty geometry. Also, functions such as `ST_GeomFromText()` that accept WKT geometry collection arguments understand both OpenGIS `'GEOMETRYCOLLECTION EMPTY'` standard syntax and MySQL `'GEOMETRYCOLLECTION()'` nonstandard syntax.

  `GeomCollection()` and `GeometryCollection()` are synonymous, with `GeomCollection()` the preferred function.

* [`GeometryCollection(g [, g] ...)`](gis-mysql-specific-functions.html#function_geometrycollection)

  Constructs a `GeomCollection` value from the geometry arguments.

  `GeometryCollection()` returns all the proper geometries contained in the arguments even if a nonsupported geometry is present.

  `GeometryCollection()` with no arguments is permitted as a way to create an empty geometry. Also, functions such as `ST_GeomFromText()` that accept WKT geometry collection arguments understand both OpenGIS `'GEOMETRYCOLLECTION EMPTY'` standard syntax and MySQL `'GEOMETRYCOLLECTION()'` nonstandard syntax.

  `GeomCollection()` and `GeometryCollection()` are synonymous, with `GeomCollection()` the preferred function.

* [`LineString(pt [, pt] ...)`](gis-mysql-specific-functions.html#function_linestring)

  Constructs a `LineString` value from a number of `Point` or WKB `Point` arguments. If the number of arguments is less than two, the return value is `NULL`.

* [`MultiLineString(ls [, ls] ...)`](gis-mysql-specific-functions.html#function_multilinestring)

  Constructs a `MultiLineString` value using `LineString` or WKB `LineString` arguments.

* [`MultiPoint(pt [, pt2] ...)`](gis-mysql-specific-functions.html#function_multipoint)

  Constructs a `MultiPoint` value using `Point` or WKB `Point` arguments.

* [`MultiPolygon(poly [, poly] ...)`](gis-mysql-specific-functions.html#function_multipolygon)

  Constructs a `MultiPolygon` value from a set of `Polygon` or WKB `Polygon` arguments.

* [`Point(x, y)`](gis-mysql-specific-functions.html#function_point)

  Constructs a `Point` using its coordinates.

* [`Polygon(ls [, ls] ...)`](gis-mysql-specific-functions.html#function_polygon)

  Constructs a `Polygon` value from a number of `LineString` or WKB `LineString` arguments. If any argument does not represent a `LinearRing` (that is, not a closed and simple `LineString`), the return value is `NULL`.


### 14.16.6 Geometry Format Conversion Functions

MySQL supports the functions listed in this section for converting geometry values from internal geometry format to WKT or WKB format, or for swapping the order of X and Y coordinates.

There are also functions to convert a string from WKT or WKB format to internal geometry format. See Section 14.16.3, “Functions That Create Geometry Values from WKT Values”, and Section 14.16.4, “Functions That Create Geometry Values from WKB Values”.

Functions such as `ST_GeomFromText()` that accept WKT geometry collection arguments understand both OpenGIS `'GEOMETRYCOLLECTION EMPTY'` standard syntax and MySQL `'GEOMETRYCOLLECTION()'` nonstandard syntax. Another way to produce an empty geometry collection is by calling `GeometryCollection()` with no arguments. Functions such as `ST_AsWKT()` that produce WKT values produce `'GEOMETRYCOLLECTION EMPTY'` standard syntax:

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

* `ST_SwapXY(g)`

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


### 14.16.7 Geometry Property Functions

Each function that belongs to this group takes a geometry value as its argument and returns some quantitative or qualitative property of the geometry. Some functions restrict their argument type. Such functions return `NULL` if the argument is of an incorrect geometry type. For example, the `ST_Area()` polygon function returns `NULL` if the object type is neither `Polygon` nor `MultiPolygon`.


#### 14.16.7.1 General Geometry Property Functions

The functions listed in this section do not restrict their argument and accept a geometry value of any type.

Unless otherwise specified, functions in this section handle their geometry arguments as follows:

* If any argument is `NULL`, the return value is `NULL`.

* If any geometry argument is not a syntactically well-formed geometry, an `ER_GIS_INVALID_DATA` error occurs.

* If any geometry argument is a syntactically well-formed geometry in an undefined spatial reference system (SRS), an `ER_SRS_NOT_FOUND` error occurs.

* If any SRID argument is not within the range of a 32-bit unsigned integer, an `ER_DATA_OUT_OF_RANGE` error occurs.

* If any SRID argument refers to an undefined SRS, an `ER_SRS_NOT_FOUND` error occurs.

* Otherwise, the return value is non-`NULL`.

These functions are available for obtaining geometry properties:

* `ST_Dimension(g)`

  Returns the inherent dimension of the geometry value *`g`*. The dimension can be −1, 0, 1, or 2. The meaning of these values is given in Section 13.4.2.2, “Geometry Class”.

  `ST_Dimension()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SELECT ST_Dimension(ST_GeomFromText('LineString(1 1,2 2)'));
  +------------------------------------------------------+
  | ST_Dimension(ST_GeomFromText('LineString(1 1,2 2)')) |
  +------------------------------------------------------+
  |                                                    1 |
  +------------------------------------------------------+
  ```

* `ST_Envelope(g)`

  Returns the minimum bounding rectangle (MBR) for the geometry value *`g`*. The result is returned as a `Polygon` value that is defined by the corner points of the bounding box:

  ```
  POLYGON((MINX MINY, MAXX MINY, MAXX MAXY, MINX MAXY, MINX MINY))
  ```

  ```
  mysql> SELECT ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,2 2)')));
  +----------------------------------------------------------------+
  | ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,2 2)'))) |
  +----------------------------------------------------------------+
  | POLYGON((1 1,2 1,2 2,1 2,1 1))                                 |
  +----------------------------------------------------------------+
  ```

  If the argument is a point or a vertical or horizontal line segment, `ST_Envelope()` returns the point or the line segment as its MBR rather than returning an invalid polygon:

  ```
  mysql> SELECT ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,1 2)')));
  +----------------------------------------------------------------+
  | ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,1 2)'))) |
  +----------------------------------------------------------------+
  | LINESTRING(1 1,1 2)                                            |
  +----------------------------------------------------------------+
  ```

  `ST_Envelope()` handles its arguments as described in the introduction to this section, with this exception:

  + If the geometry has an SRID value for a geographic spatial reference system (SRS), an `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS` error occurs.

* `ST_GeometryType(g)`

  Returns a binary string indicating the name of the geometry type of which the geometry instance *`g`* is a member. The name corresponds to one of the instantiable `Geometry` subclasses.

  `ST_GeometryType()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SELECT ST_GeometryType(ST_GeomFromText('POINT(1 1)'));
  +------------------------------------------------+
  | ST_GeometryType(ST_GeomFromText('POINT(1 1)')) |
  +------------------------------------------------+
  | POINT                                          |
  +------------------------------------------------+
  ```

* `ST_IsEmpty(g)`

  This function is a placeholder that returns 1 for an empty geometry collection value or 0 otherwise.

  The only valid empty geometry is represented in the form of an empty geometry collection value. MySQL does not support GIS `EMPTY` values such as `POINT EMPTY`.

  `ST_IsEmpty()` handles its arguments as described in the introduction to this section.

* `ST_IsSimple(g)`

  Returns 1 if the geometry value *`g`* is simple according to the ISO *SQL/MM Part 3: Spatial* standard. `ST_IsSimple()` returns 0 if the argument is not simple.

  The descriptions of the instantiable geometric classes given under Section 13.4.2, “The OpenGIS Geometry Model” include the specific conditions that cause class instances to be classified as not simple.

  `ST_IsSimple()` handles its arguments as described in the introduction to this section, with this exception:

  + If the geometry has a geographic SRS with a longitude or latitude that is out of range, an error occurs:

    - If a longitude value is not in the range (−180, 180], an `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE` error occurs (`ER_LONGITUDE_OUT_OF_RANGE` prior to MySQL 8.0.12).

    - If a latitude value is not in the range [−90, 90], an `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE` error occurs (`ER_LATITUDE_OUT_OF_RANGE` prior to MySQL 8.0.12).

    Ranges shown are in degrees. The exact range limits deviate slightly due to floating-point arithmetic.

* [`ST_SRID(g [, srid])`](gis-general-property-functions.html#function_st-srid)

  With a single argument representing a valid geometry object *`g`*, `ST_SRID()` returns an integer indicating the ID of the spatial reference system (SRS) associated with *`g`*.

  With the optional second argument representing a valid SRID value, `ST_SRID()` returns an object with the same type as its first argument with an SRID value equal to the second argument. This only sets the SRID value of the object; it does not perform any transformation of coordinate values.

  `ST_SRID()` handles its arguments as described in the introduction to this section, with this exception:

  + For the single-argument syntax, `ST_SRID()` returns the geometry SRID even if it refers to an undefined SRS. An `ER_SRS_NOT_FOUND` error does not occur.

  [`ST_SRID(g, target_srid)`](gis-general-property-functions.html#function_st-srid) and [`ST_Transform(g, target_srid)`](spatial-operator-functions.html#function_st-transform) differ as follows:

  + `ST_SRID()` changes the geometry SRID value without transforming its coordinates.

  + `ST_Transform()` transforms the geometry coordinates in addition to changing its SRID value.

  ```
  mysql> SET @g = ST_GeomFromText('LineString(1 1,2 2)', 0);
  mysql> SELECT ST_SRID(@g);
  +-------------+
  | ST_SRID(@g) |
  +-------------+
  |           0 |
  +-------------+
  mysql> SET @g = ST_SRID(@g, 4326);
  mysql> SELECT ST_SRID(@g);
  +-------------+
  | ST_SRID(@g) |
  +-------------+
  |        4326 |
  +-------------+
  ```

  It is possible to create a geometry in a particular SRID by passing to `ST_SRID()` the result of one of the MySQL-specific functions for creating spatial values, along with an SRID value. For example:

  ```
  SET @g1 = ST_SRID(Point(1, 1), 4326);
  ```

  However, that method creates the geometry in SRID 0, then casts it to SRID 4326 (WGS 84). A preferable alternative is to create the geometry with the correct spatial reference system to begin with. For example:

  ```
  SET @g1 = ST_PointFromText('POINT(1 1)', 4326);
  SET @g1 = ST_GeomFromText('POINT(1 1)', 4326);
  ```

  The two-argument form of `ST_SRID()` is useful for tasks such as correcting or changing the SRS of geometries that have an incorrect SRID.


#### 14.16.7.2 Point Property Functions

A `Point` consists of X and Y coordinates, which may be obtained using the `ST_X()` and `ST_Y()` functions, respectively. These functions also permit an optional second argument that specifies an X or Y coordinate value, in which case the function result is the `Point` object from the first argument with the appropriate coordinate modified to be equal to the second argument.

For `Point` objects that have a geographic spatial reference system (SRS), the longitude and latitude may be obtained using the `ST_Longitude()` and `ST_Latitude()` functions, respectively. These functions also permit an optional second argument that specifies a longitude or latitude value, in which case the function result is the `Point` object from the first argument with the longitude or latitude modified to be equal to the second argument.

Unless otherwise specified, functions in this section handle their geometry arguments as follows:

* If any argument is `NULL`, the return value is `NULL`.

* If any geometry argument is a valid geometry but not a `Point` object, an `ER_UNEXPECTED_GEOMETRY_TYPE` error occurs.

* If any geometry argument is not a syntactically well-formed geometry, an `ER_GIS_INVALID_DATA` error occurs.

* If any geometry argument is a syntactically well-formed geometry in an undefined spatial reference system (SRS), an `ER_SRS_NOT_FOUND` error occurs.

* If an X or Y coordinate argument is provided and the value is `-inf`, `+inf`, or `NaN`, an `ER_DATA_OUT_OF_RANGE` error occurs.

* If a longitude or latitude value is out of range, an error occurs:

  + If a longitude value is not in the range (−180, 180], an `ER_LONGITUDE_OUT_OF_RANGE` error occurs.

  + If a latitude value is not in the range [−90, 90], an `ER_LATITUDE_OUT_OF_RANGE` error occurs.

  Ranges shown are in degrees. The exact range limits deviate slightly due to floating-point arithmetic.

* Otherwise, the return value is non-`NULL`.

These functions are available for obtaining point properties:

* [`ST_Latitude(p [, new_latitude_val])`](gis-point-property-functions.html#function_st-latitude)

  With a single argument representing a valid `Point` object *`p`* that has a geographic spatial reference system (SRS), `ST_Latitude()` returns the latitude value of *`p`* as a double-precision number.

  With the optional second argument representing a valid latitude value, `ST_Latitude()` returns a `Point` object like the first argument with its latitude equal to the second argument.

  `ST_Latitude()` handles its arguments as described in the introduction to this section, with the addition that if the `Point` object is valid but does not have a geographic SRS, an `ER_SRS_NOT_GEOGRAPHIC` error occurs.

  ```
  mysql> SET @pt = ST_GeomFromText('POINT(45 90)', 4326);
  mysql> SELECT ST_Latitude(@pt);
  +------------------+
  | ST_Latitude(@pt) |
  +------------------+
  |               45 |
  +------------------+
  mysql> SELECT ST_AsText(ST_Latitude(@pt, 10));
  +---------------------------------+
  | ST_AsText(ST_Latitude(@pt, 10)) |
  +---------------------------------+
  | POINT(10 90)                    |
  +---------------------------------+
  ```

  This function was added in MySQL 8.0.12.

* [`ST_Longitude(p [, new_longitude_val])`](gis-point-property-functions.html#function_st-longitude)

  With a single argument representing a valid `Point` object *`p`* that has a geographic spatial reference system (SRS), `ST_Longitude()` returns the longitude value of *`p`* as a double-precision number.

  With the optional second argument representing a valid longitude value, `ST_Longitude()` returns a `Point` object like the first argument with its longitude equal to the second argument.

  `ST_Longitude()` handles its arguments as described in the introduction to this section, with the addition that if the `Point` object is valid but does not have a geographic SRS, an `ER_SRS_NOT_GEOGRAPHIC` error occurs.

  ```
  mysql> SET @pt = ST_GeomFromText('POINT(45 90)', 4326);
  mysql> SELECT ST_Longitude(@pt);
  +-------------------+
  | ST_Longitude(@pt) |
  +-------------------+
  |                90 |
  +-------------------+
  mysql> SELECT ST_AsText(ST_Longitude(@pt, 10));
  +----------------------------------+
  | ST_AsText(ST_Longitude(@pt, 10)) |
  +----------------------------------+
  | POINT(45 10)                     |
  +----------------------------------+
  ```

  This function was added in MySQL 8.0.12.

* [`ST_X(p [, new_x_val])`](gis-point-property-functions.html#function_st-x)

  With a single argument representing a valid `Point` object *`p`*, `ST_X()` returns the X-coordinate value of *`p`* as a double-precision number. As of MySQL 8.0.12, the X coordinate is considered to refer to the axis that appears first in the `Point` spatial reference system (SRS) definition.

  With the optional second argument, `ST_X()` returns a `Point` object like the first argument with its X coordinate equal to the second argument. As of MySQL 8.0.12, if the `Point` object has a geographic SRS, the second argument must be in the proper range for longitude or latitude values.

  `ST_X()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SELECT ST_X(Point(56.7, 53.34));
  +--------------------------+
  | ST_X(Point(56.7, 53.34)) |
  +--------------------------+
  |                     56.7 |
  +--------------------------+
  mysql> SELECT ST_AsText(ST_X(Point(56.7, 53.34), 10.5));
  +-------------------------------------------+
  | ST_AsText(ST_X(Point(56.7, 53.34), 10.5)) |
  +-------------------------------------------+
  | POINT(10.5 53.34)                         |
  +-------------------------------------------+
  ```

* [`ST_Y(p [, new_y_val])`](gis-point-property-functions.html#function_st-y)

  With a single argument representing a valid `Point` object *`p`*, `ST_Y()` returns the Y-coordinate value of *`p`* as a double-precision number. As of MySQL 8.0.12, the Y coordinate is considered to refer to the axis that appears second in the `Point` spatial reference system (SRS) definition.

  With the optional second argument, `ST_Y()` returns a `Point` object like the first argument with its Y coordinate equal to the second argument. As of MySQL 8.0.12, if the `Point` object has a geographic SRS, the second argument must be in the proper range for longitude or latitude values.

  `ST_Y()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SELECT ST_Y(Point(56.7, 53.34));
  +--------------------------+
  | ST_Y(Point(56.7, 53.34)) |
  +--------------------------+
  |                    53.34 |
  +--------------------------+
  mysql> SELECT ST_AsText(ST_Y(Point(56.7, 53.34), 10.5));
  +-------------------------------------------+
  | ST_AsText(ST_Y(Point(56.7, 53.34), 10.5)) |
  +-------------------------------------------+
  | POINT(56.7 10.5)                          |
  +-------------------------------------------+
  ```


#### 14.16.7.3 LineString and MultiLineString Property Functions

A `LineString` consists of `Point` values. You can extract particular points of a `LineString`, count the number of points that it contains, or obtain its length.

Some functions in this section also work for `MultiLineString` values.

Unless otherwise specified, functions in this section handle their geometry arguments as follows:

* If any argument is `NULL` or any geometry argument is an empty geometry, the return value is `NULL`.

* If any geometry argument is not a syntactically well-formed geometry, an `ER_GIS_INVALID_DATA` error occurs.

* If any geometry argument is a syntactically well-formed geometry in an undefined spatial reference system (SRS), an `ER_SRS_NOT_FOUND` error occurs.

* Otherwise, the return value is non-`NULL`.

These functions are available for obtaining linestring properties:

* `ST_EndPoint(ls)`

  Returns the `Point` that is the endpoint of the `LineString` value *`ls`*.

  `ST_EndPoint()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_AsText(ST_EndPoint(ST_GeomFromText(@ls)));
  +----------------------------------------------+
  | ST_AsText(ST_EndPoint(ST_GeomFromText(@ls))) |
  +----------------------------------------------+
  | POINT(3 3)                                   |
  +----------------------------------------------+
  ```

* `ST_IsClosed(ls)`

  For a `LineString` value *`ls`*, `ST_IsClosed()` returns 1 if *`ls`* is closed (that is, its `ST_StartPoint()` and `ST_EndPoint()` values are the same).

  For a `MultiLineString` value *`ls`*, `ST_IsClosed()` returns 1 if *`ls`* is closed (that is, the `ST_StartPoint()` and `ST_EndPoint()` values are the same for each `LineString` in *`ls`*).

  `ST_IsClosed()` returns 0 if *`ls`* is not closed, and `NULL` if *`ls`* is `NULL`.

  `ST_IsClosed()` handles its arguments as described in the introduction to this section, with this exception:

  + If the geometry has an SRID value for a geographic spatial reference system (SRS), an `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS` error occurs.

  ```
  mysql> SET @ls1 = 'LineString(1 1,2 2,3 3,2 2)';
  mysql> SET @ls2 = 'LineString(1 1,2 2,3 3,1 1)';

  mysql> SELECT ST_IsClosed(ST_GeomFromText(@ls1));
  +------------------------------------+
  | ST_IsClosed(ST_GeomFromText(@ls1)) |
  +------------------------------------+
  |                                  0 |
  +------------------------------------+

  mysql> SELECT ST_IsClosed(ST_GeomFromText(@ls2));
  +------------------------------------+
  | ST_IsClosed(ST_GeomFromText(@ls2)) |
  +------------------------------------+
  |                                  1 |
  +------------------------------------+

  mysql> SET @ls3 = 'MultiLineString((1 1,2 2,3 3),(4 4,5 5))';

  mysql> SELECT ST_IsClosed(ST_GeomFromText(@ls3));
  +------------------------------------+
  | ST_IsClosed(ST_GeomFromText(@ls3)) |
  +------------------------------------+
  |                                  0 |
  +------------------------------------+
  ```

* [`ST_Length(ls [, unit])`](gis-linestring-property-functions.html#function_st-length)

  Returns a double-precision number indicating the length of the `LineString` or `MultiLineString` value *`ls`* in its associated spatial reference system. The length of a `MultiLineString` value is equal to the sum of the lengths of its elements.

  `ST_Length()` computes a result as follows:

  + If the geometry is a valid `LineString` in a Cartesian SRS, the return value is the Cartesian length of the geometry.

  + If the geometry is a valid `MultiLineString` in a Cartesian SRS, the return value is the sum of the Cartesian lengths of its elements.

  + If the geometry is a valid `LineString` in a geographic SRS, the return value is the geodetic length of the geometry in that SRS, in meters.

  + If the geometry is a valid `MultiLineString` in a geographic SRS, the return value is the sum of the geodetic lengths of its elements in that SRS, in meters.

  `ST_Length()` handles its arguments as described in the introduction to this section, with these exceptions:

  + If the geometry is not a `LineString` or `MultiLineString`, the return value is `NULL`.

  + If the geometry is geometrically invalid, either the result is an undefined length (that is, it can be any number), or an error occurs.

  + If the length computation result is `+inf`, an `ER_DATA_OUT_OF_RANGE` error occurs.

  + If the geometry has a geographic SRS with a longitude or latitude that is out of range, an error occurs:

    - If a longitude value is not in the range (−180, 180], an `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE` error occurs (`ER_LONGITUDE_OUT_OF_RANGE` prior to MySQL 8.0.12).

    - If a latitude value is not in the range [−90, 90], an `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE` error occurs (`ER_LATITUDE_OUT_OF_RANGE` prior to MySQL 8.0.12).

    Ranges shown are in degrees. The exact range limits deviate slightly due to floating-point arithmetic.

  As of MySQL 8.0.16, `ST_Length()` permits an optional *`unit`* argument that specifies the linear unit for the returned length value. These rules apply:

  + If a unit is specified but not supported by MySQL, an `ER_UNIT_NOT_FOUND` error occurs.

  + If a supported linear unit is specified and the SRID is 0, an `ER_GEOMETRY_IN_UNKNOWN_LENGTH_UNIT` error occurs.

  + If a supported linear unit is specified and the SRID is not 0, the result is in that unit.

  + If a unit is not specified, the result is in the unit of the SRS of the geometries, whether Cartesian or geographic. Currently, all MySQL SRSs are expressed in meters.

  A unit is supported if it is found in the `INFORMATION_SCHEMA` `ST_UNITS_OF_MEASURE` table. See Section 28.3.37, “The INFORMATION_SCHEMA ST_UNITS_OF_MEASURE Table”.

  ```
  mysql> SET @ls = ST_GeomFromText('LineString(1 1,2 2,3 3)');
  mysql> SELECT ST_Length(@ls);
  +--------------------+
  | ST_Length(@ls)     |
  +--------------------+
  | 2.8284271247461903 |
  +--------------------+

  mysql> SET @mls = ST_GeomFromText('MultiLineString((1 1,2 2,3 3),(4 4,5 5))');
  mysql> SELECT ST_Length(@mls);
  +-------------------+
  | ST_Length(@mls)   |
  +-------------------+
  | 4.242640687119286 |
  +-------------------+

  mysql> SET @ls = ST_GeomFromText('LineString(1 1,2 2,3 3)', 4326);
  mysql> SELECT ST_Length(@ls);
  +-------------------+
  | ST_Length(@ls)    |
  +-------------------+
  | 313701.9623204328 |
  +-------------------+
  mysql> SELECT ST_Length(@ls, 'metre');
  +-------------------------+
  | ST_Length(@ls, 'metre') |
  +-------------------------+
  |       313701.9623204328 |
  +-------------------------+
  mysql> SELECT ST_Length(@ls, 'foot');
  +------------------------+
  | ST_Length(@ls, 'foot') |
  +------------------------+
  |     1029205.9131247795 |
  +------------------------+
  ```

* `ST_NumPoints(ls)`

  Returns the number of `Point` objects in the `LineString` value *`ls`*.

  `ST_NumPoints()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_NumPoints(ST_GeomFromText(@ls));
  +------------------------------------+
  | ST_NumPoints(ST_GeomFromText(@ls)) |
  +------------------------------------+
  |                                  3 |
  +------------------------------------+
  ```

* [`ST_PointN(ls, N)`](gis-linestring-property-functions.html#function_st-pointn)

  Returns the *`N`*-th `Point` in the `Linestring` value *`ls`*. Points are numbered beginning with 1.

  `ST_PointN()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_AsText(ST_PointN(ST_GeomFromText(@ls),2));
  +----------------------------------------------+
  | ST_AsText(ST_PointN(ST_GeomFromText(@ls),2)) |
  +----------------------------------------------+
  | POINT(2 2)                                   |
  +----------------------------------------------+
  ```

* `ST_StartPoint(ls)`

  Returns the `Point` that is the start point of the `LineString` value *`ls`*.

  `ST_StartPoint()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_AsText(ST_StartPoint(ST_GeomFromText(@ls)));
  +------------------------------------------------+
  | ST_AsText(ST_StartPoint(ST_GeomFromText(@ls))) |
  +------------------------------------------------+
  | POINT(1 1)                                     |
  +------------------------------------------------+
  ```


#### 14.16.7.4 Polygon and MultiPolygon Property Functions

Functions in this section return properties of `Polygon` or `MultiPolygon` values.

Unless otherwise specified, functions in this section handle their geometry arguments as follows:

* If any argument is `NULL` or any geometry argument is an empty geometry, the return value is `NULL`.

* If any geometry argument is not a syntactically well-formed geometry, an `ER_GIS_INVALID_DATA` error occurs.

* If any geometry argument is a syntactically well-formed geometry in an undefined spatial reference system (SRS), an `ER_SRS_NOT_FOUND` error occurs.

* For functions that take multiple geometry arguments, if those arguments are not in the same SRS, an `ER_GIS_DIFFERENT_SRIDS` error occurs.

* Otherwise, the return value is non-`NULL`.

These functions are available for obtaining polygon properties:

* `ST_Area({poly|mpoly})`

  Returns a double-precision number indicating the area of the `Polygon` or `MultiPolygon` argument, as measured in its spatial reference system.

  As of MySQL 8.0.13, `ST_Area()` handles its arguments as described in the introduction to this section, with these exceptions:

  + If the geometry is geometrically invalid, either the result is an undefined area (that is, it can be any number), or an error occurs.

  + If the geometry is valid but is not a `Polygon` or `MultiPolygon` object, an `ER_UNEXPECTED_GEOMETRY_TYPE` error occurs.

  + If the geometry is a valid `Polygon` in a Cartesian SRS, the result is the Cartesian area of the polygon.

  + If the geometry is a valid `MultiPolygon` in a Cartesian SRS, the result is the sum of the Cartesian area of the polygons.

  + If the geometry is a valid `Polygon` in a geographic SRS, the result is the geodetic area of the polygon in that SRS, in square meters.

  + If the geometry is a valid `MultiPolygon` in a geographic SRS, the result is the sum of geodetic area of the polygons in that SRS, in square meters.

  + If an area computation results in `+inf`, an `ER_DATA_OUT_OF_RANGE` error occurs.

  + If the geometry has a geographic SRS with a longitude or latitude that is out of range, an error occurs:

    - If a longitude value is not in the range (−180, 180], an `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE` error occurs (`ER_LONGITUDE_OUT_OF_RANGE` prior to MySQL 8.0.12).

    - If a latitude value is not in the range [−90, 90], an `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE` error occurs (`ER_LATITUDE_OUT_OF_RANGE` prior to MySQL 8.0.12).

    Ranges shown are in degrees. The exact range limits deviate slightly due to floating-point arithmetic.

  Prior to MySQL 8.0.13, `ST_Area()` handles its arguments as described in the introduction to this section, with these exceptions:

  + For arguments of dimension 0 or 1, the result is 0.
  + If a geometry is empty, the return value is 0 rather than `NULL`.

  + For a geometry collection, the result is the sum of the area values of all components. If the geometry collection is empty, its area is returned as 0.

  + If the geometry has an SRID value for a geographic spatial reference system (SRS), an `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS` error occurs.

  ```
  mysql> SET @poly =
         'Polygon((0 0,0 3,3 0,0 0),(1 1,1 2,2 1,1 1))';
  mysql> SELECT ST_Area(ST_GeomFromText(@poly));
  +---------------------------------+
  | ST_Area(ST_GeomFromText(@poly)) |
  +---------------------------------+
  |                               4 |
  +---------------------------------+

  mysql> SET @mpoly =
         'MultiPolygon(((0 0,0 3,3 3,3 0,0 0),(1 1,1 2,2 2,2 1,1 1)))';
  mysql> SELECT ST_Area(ST_GeomFromText(@mpoly));
  +----------------------------------+
  | ST_Area(ST_GeomFromText(@mpoly)) |
  +----------------------------------+
  |                                8 |
  +----------------------------------+
  ```

* `ST_Centroid({poly|mpoly})`

  Returns the mathematical centroid for the `Polygon` or `MultiPolygon` argument as a `Point`. The result is not guaranteed to be on the `MultiPolygon`.

  This function processes geometry collections by computing the centroid point for components of highest dimension in the collection. Such components are extracted and made into a single `MultiPolygon`, `MultiLineString`, or `MultiPoint` for centroid computation.

  `ST_Centroid()` handles its arguments as described in the introduction to this section, with these exceptions:

  + The return value is `NULL` for the additional condition that the argument is an empty geometry collection.

  + If the geometry has an SRID value for a geographic spatial reference system (SRS), an `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS` error occurs.

  ```
  mysql> SET @poly =
         ST_GeomFromText('POLYGON((0 0,10 0,10 10,0 10,0 0),(5 5,7 5,7 7,5 7,5 5))');
  mysql> SELECT ST_GeometryType(@poly),ST_AsText(ST_Centroid(@poly));
  +------------------------+--------------------------------------------+
  | ST_GeometryType(@poly) | ST_AsText(ST_Centroid(@poly))              |
  +------------------------+--------------------------------------------+
  | POLYGON                | POINT(4.958333333333333 4.958333333333333) |
  +------------------------+--------------------------------------------+
  ```

* `ST_ExteriorRing(poly)`

  Returns the exterior ring of the `Polygon` value *`poly`* as a `LineString`.

  `ST_ExteriorRing()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SET @poly =
         'Polygon((0 0,0 3,3 3,3 0,0 0),(1 1,1 2,2 2,2 1,1 1))';
  mysql> SELECT ST_AsText(ST_ExteriorRing(ST_GeomFromText(@poly)));
  +----------------------------------------------------+
  | ST_AsText(ST_ExteriorRing(ST_GeomFromText(@poly))) |
  +----------------------------------------------------+
  | LINESTRING(0 0,0 3,3 3,3 0,0 0)                    |
  +----------------------------------------------------+
  ```

* [`ST_InteriorRingN(poly, N)`](gis-polygon-property-functions.html#function_st-interiorringn)

  Returns the *`N`*-th interior ring for the `Polygon` value *`poly`* as a `LineString`. Rings are numbered beginning with 1.

  `ST_InteriorRingN()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SET @poly =
         'Polygon((0 0,0 3,3 3,3 0,0 0),(1 1,1 2,2 2,2 1,1 1))';
  mysql> SELECT ST_AsText(ST_InteriorRingN(ST_GeomFromText(@poly),1));
  +-------------------------------------------------------+
  | ST_AsText(ST_InteriorRingN(ST_GeomFromText(@poly),1)) |
  +-------------------------------------------------------+
  | LINESTRING(1 1,1 2,2 2,2 1,1 1)                       |
  +-------------------------------------------------------+
  ```

* `ST_NumInteriorRing(poly)`, `ST_NumInteriorRings(poly)`

  Returns the number of interior rings in the `Polygon` value *`poly`*.

  `ST_NumInteriorRing()` and `ST_NuminteriorRings()` handle their arguments as described in the introduction to this section.

  ```
  mysql> SET @poly =
         'Polygon((0 0,0 3,3 3,3 0,0 0),(1 1,1 2,2 2,2 1,1 1))';
  mysql> SELECT ST_NumInteriorRings(ST_GeomFromText(@poly));
  +---------------------------------------------+
  | ST_NumInteriorRings(ST_GeomFromText(@poly)) |
  +---------------------------------------------+
  |                                           1 |
  +---------------------------------------------+
  ```


#### 14.16.7.5 GeometryCollection Property Functions

These functions return properties of `GeometryCollection` values.

Unless otherwise specified, functions in this section handle their geometry arguments as follows:

* If any argument is `NULL` or any geometry argument is an empty geometry, the return value is `NULL`.

* If any geometry argument is not a syntactically well-formed geometry, an `ER_GIS_INVALID_DATA` error occurs.

* If any geometry argument is a syntactically well-formed geometry in an undefined spatial reference system (SRS), an `ER_SRS_NOT_FOUND` error occurs.

* Otherwise, the return value is non-`NULL`.

These functions are available for obtaining geometry collection properties:

* [`ST_GeometryN(gc, N)`](gis-geometrycollection-property-functions.html#function_st-geometryn)

  Returns the *`N`*-th geometry in the `GeometryCollection` value *`gc`*. Geometries are numbered beginning with 1.

  `ST_GeometryN()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SET @gc = 'GeometryCollection(Point(1 1),LineString(2 2, 3 3))';
  mysql> SELECT ST_AsText(ST_GeometryN(ST_GeomFromText(@gc),1));
  +-------------------------------------------------+
  | ST_AsText(ST_GeometryN(ST_GeomFromText(@gc),1)) |
  +-------------------------------------------------+
  | POINT(1 1)                                      |
  +-------------------------------------------------+
  ```

* `ST_NumGeometries(gc)`

  Returns the number of geometries in the `GeometryCollection` value *`gc`*.

  `ST_NumGeometries()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SET @gc = 'GeometryCollection(Point(1 1),LineString(2 2, 3 3))';
  mysql> SELECT ST_NumGeometries(ST_GeomFromText(@gc));
  +----------------------------------------+
  | ST_NumGeometries(ST_GeomFromText(@gc)) |
  +----------------------------------------+
  |                                      2 |
  +----------------------------------------+
  ```


### 14.16.8 Spatial Operator Functions

OpenGIS proposes a number of functions that can produce geometries. They are designed to implement spatial operators. These functions support all argument type combinations except those that are inapplicable according to the [Open Geospatial Consortium](http://www.opengeospatial.org) specification.

MySQL also implements certain functions that are extensions to OpenGIS, as noted in the function descriptions. In addition, Section 14.16.7, “Geometry Property Functions”, discusses several functions that construct new geometries from existing ones. See that section for descriptions of these functions:

* `ST_Envelope(g)`
* `ST_StartPoint(ls)`
* `ST_EndPoint(ls)`
* [`ST_PointN(ls, N)`](gis-linestring-property-functions.html#function_st-pointn)

* `ST_ExteriorRing(poly)`
* [`ST_InteriorRingN(poly, N)`](gis-polygon-property-functions.html#function_st-interiorringn)

* [`ST_GeometryN(gc, N)`](gis-geometrycollection-property-functions.html#function_st-geometryn)

Unless otherwise specified, functions in this section handle their geometry arguments as follows:

* If any argument is `NULL`, the return value is `NULL`.

* If any geometry argument is not a syntactically well-formed geometry, an `ER_GIS_INVALID_DATA` error occurs.

* If any geometry argument is a syntactically well-formed geometry in an undefined spatial reference system (SRS), an `ER_SRS_NOT_FOUND` error occurs.

* For functions that take multiple geometry arguments, if those arguments are not in the same SRS, an `ER_GIS_DIFFERENT_SRIDS` error occurs.

* If any geometry argument has an SRID value for a geographic SRS and the function does not handle geographic geometries, an `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS` error occurs.

* For geographic SRS geometry arguments, if any argument has a longitude or latitude that is out of range, an error occurs:

  + If a longitude value is not in the range (−180, 180], an `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE` error occurs (`ER_LONGITUDE_OUT_OF_RANGE` prior to MySQL 8.0.12).

  + If a latitude value is not in the range [−90, 90], an `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE` error occurs (`ER_LATITUDE_OUT_OF_RANGE` prior to MySQL 8.0.12).

  Ranges shown are in degrees. If an SRS uses another unit, the range uses the corresponding values in its unit. The exact range limits deviate slightly due to floating-point arithmetic.

* Otherwise, the return value is non-`NULL`.

These spatial operator functions are available:

* [`ST_Buffer(g, d [, strategy1 [, strategy2 [, strategy3]]])`](spatial-operator-functions.html#function_st-buffer)

  Returns a geometry that represents all points whose distance from the geometry value *`g`* is less than or equal to a distance of *`d`*. The result is in the same SRS as the geometry argument.

  If the geometry argument is empty, `ST_Buffer()` returns an empty geometry.

  If the distance is 0, `ST_Buffer()` returns the geometry argument unchanged:

  ```
  mysql> SET @pt = ST_GeomFromText('POINT(0 0)');
  mysql> SELECT ST_AsText(ST_Buffer(@pt, 0));
  +------------------------------+
  | ST_AsText(ST_Buffer(@pt, 0)) |
  +------------------------------+
  | POINT(0 0)                   |
  +------------------------------+
  ```

  If the geometry argument is in a Cartesian SRS:

  + `ST_Buffer()` supports negative distances for `Polygon` and `MultiPolygon` values, and for geometry collections containing `Polygon` or `MultiPolygon` values.

  + If the result is reduced so much that it disappears, the result is an empty geometry.

  + An `ER_WRONG_ARGUMENTS` error occurs for `ST_Buffer()` with a negative distance for `Point`, `MultiPoint`, `LineString`, and `MultiLineString` values, and for geometry collections not containing any `Polygon` or `MultiPolygon` values.

  If the geometry argument is in a geographic SRS:

  + Prior to MySQL 8.0.26, an `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS` error occurs.

  + As of MySQL 8.0.26, `Point` geometries in a geographic SRS are permitted. For non-`Point` geometries, an `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS` error still occurs.

  For MySQL versions that permit geographic `Point` geometries:

  + If the distance is not negative and no strategies are specified, the function returns the geographic buffer of the `Point` in its SRS. The distance argument must be in the SRS distance unit (currently always meters).

  + If the distance is negative or any strategy (except `NULL`) is specified, an `ER_WRONG_ARGUMENTS` error occurs.

  `ST_Buffer()` permits up to three optional strategy arguments following the distance argument. Strategies influence buffer computation. These arguments are byte string values produced by the `ST_Buffer_Strategy()` function, to be used for point, join, and end strategies:

  + Point strategies apply to `Point` and `MultiPoint` geometries. If no point strategy is specified, the default is [`ST_Buffer_Strategy('point_circle', 32)`](spatial-operator-functions.html#function_st-buffer-strategy).

  + Join strategies apply to `LineString`, `MultiLineString`, `Polygon`, and `MultiPolygon` geometries. If no join strategy is specified, the default is [`ST_Buffer_Strategy('join_round', 32)`](spatial-operator-functions.html#function_st-buffer-strategy).

  + End strategies apply to `LineString` and `MultiLineString` geometries. If no end strategy is specified, the default is [`ST_Buffer_Strategy('end_round', 32)`](spatial-operator-functions.html#function_st-buffer-strategy).

  Up to one strategy of each type may be specified, and they may be given in any order.

  If the buffer strategies are invalid, an `ER_WRONG_ARGUMENTS` error occurs. Strategies are invalid under any of these circumstances:

  + Multiple strategies of a given type (point, join, or end) are specified.

  + A value that is not a strategy (such as an arbitrary binary string or a number) is passed as a strategy.

  + A `Point` strategy is passed and the geometry contains no `Point` or `MultiPoint` values.

  + An end or join strategy is passed and the geometry contains no `LineString`, `Polygon`, `MultiLinestring` or `MultiPolygon` values.

  ```
  mysql> SET @pt = ST_GeomFromText('POINT(0 0)');
  mysql> SET @pt_strategy = ST_Buffer_Strategy('point_square');
  mysql> SELECT ST_AsText(ST_Buffer(@pt, 2, @pt_strategy));
  +--------------------------------------------+
  | ST_AsText(ST_Buffer(@pt, 2, @pt_strategy)) |
  +--------------------------------------------+
  | POLYGON((-2 -2,2 -2,2 2,-2 2,-2 -2))       |
  +--------------------------------------------+
  ```

  ```
  mysql> SET @ls = ST_GeomFromText('LINESTRING(0 0,0 5,5 5)');
  mysql> SET @end_strategy = ST_Buffer_Strategy('end_flat');
  mysql> SET @join_strategy = ST_Buffer_Strategy('join_round', 10);
  mysql> SELECT ST_AsText(ST_Buffer(@ls, 5, @end_strategy, @join_strategy))
  +---------------------------------------------------------------+
  | ST_AsText(ST_Buffer(@ls, 5, @end_strategy, @join_strategy))   |
  +---------------------------------------------------------------+
  | POLYGON((5 5,5 10,0 10,-3.5355339059327373 8.535533905932738, |
  | -5 5,-5 0,0 0,5 0,5 5))                                       |
  +---------------------------------------------------------------+
  ```

* [`ST_Buffer_Strategy(strategy [, points_per_circle])`](spatial-operator-functions.html#function_st-buffer-strategy)

  This function returns a strategy byte string for use with `ST_Buffer()` to influence buffer computation.

  Information about strategies is available at Boost.org.

  The first argument must be a string indicating a strategy option:

  + For point strategies, permitted values are `'point_circle'` and `'point_square'`.

  + For join strategies, permitted values are `'join_round'` and `'join_miter'`.

  + For end strategies, permitted values are `'end_round'` and `'end_flat'`.

  If the first argument is `'point_circle'`, `'join_round'`, `'join_miter'`, or `'end_round'`, the *`points_per_circle`* argument must be given as a positive numeric value. The maximum *`points_per_circle`* value is the value of the `max_points_in_geometry` system variable.

  For examples, see the description of `ST_Buffer()`.

  `ST_Buffer_Strategy()` handles its arguments as described in the introduction to this section, with these exceptions:

  + If any argument is invalid, an `ER_WRONG_ARGUMENTS` error occurs.

  + If the first argument is `'point_square'` or `'end_flat'`, the *`points_per_circle`* argument must not be given or an `ER_WRONG_ARGUMENTS` error occurs.

* `ST_ConvexHull(g)`

  Returns a geometry that represents the convex hull of the geometry value *`g`*.

  This function computes a geometry's convex hull by first checking whether its vertex points are colinear. The function returns a linear hull if so, a polygon hull otherwise. This function processes geometry collections by extracting all vertex points of all components of the collection, creating a `MultiPoint` value from them, and computing its convex hull.

  `ST_ConvexHull()` handles its arguments as described in the introduction to this section, with this exception:

  + The return value is `NULL` for the additional condition that the argument is an empty geometry collection.

  ```
  mysql> SET @g = 'MULTIPOINT(5 0,25 0,15 10,15 25)';
  mysql> SELECT ST_AsText(ST_ConvexHull(ST_GeomFromText(@g)));
  +-----------------------------------------------+
  | ST_AsText(ST_ConvexHull(ST_GeomFromText(@g))) |
  +-----------------------------------------------+
  | POLYGON((5 0,25 0,15 25,5 0))                 |
  +-----------------------------------------------+
  ```

* [`ST_Difference(g1, g2)`](spatial-operator-functions.html#function_st-difference)

  Returns a geometry that represents the point set difference of the geometry values *`g1`* and *`g2`*. The result is in the same SRS as the geometry arguments.

  As of MySQL 8.0.26, `ST_Difference()` permits arguments in either a Cartesian or a geographic SRS. Prior to MySQL 8.0.26, `ST_Difference()` permits arguments in a Cartesian SRS only; for arguments in a geographic SRS, an `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS` error occurs.

  `ST_Difference()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SET @g1 = Point(1,1), @g2 = Point(2,2);
  mysql> SELECT ST_AsText(ST_Difference(@g1, @g2));
  +------------------------------------+
  | ST_AsText(ST_Difference(@g1, @g2)) |
  +------------------------------------+
  | POINT(1 1)                         |
  +------------------------------------+
  ```

* [`ST_Intersection(g1, g2)`](spatial-operator-functions.html#function_st-intersection)

  Returns a geometry that represents the point set intersection of the geometry values *`g1`* and *`g2`*. The result is in the same SRS as the geometry arguments.

  As of MySQL 8.0.27, `ST_Intersection()` permits arguments in either a Cartesian or a geographic SRS. Prior to MySQL 8.0.27, `ST_Intersection()` permits arguments in a Cartesian SRS only; for arguments in a geographic SRS, an `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS` error occurs.

  `ST_Intersection()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SET @g1 = ST_GeomFromText('LineString(1 1, 3 3)');
  mysql> SET @g2 = ST_GeomFromText('LineString(1 3, 3 1)');
  mysql> SELECT ST_AsText(ST_Intersection(@g1, @g2));
  +--------------------------------------+
  | ST_AsText(ST_Intersection(@g1, @g2)) |
  +--------------------------------------+
  | POINT(2 2)                           |
  +--------------------------------------+
  ```

* [`ST_LineInterpolatePoint(ls, fractional_distance)`](spatial-operator-functions.html#function_st-lineinterpolatepoint)

  This function takes a `LineString` geometry and a fractional distance in the range [0.0, 1.0] and returns the `Point` along the `LineString` at the given fraction of the distance from its start point to its endpoint. It can be used to answer questions such as which `Point` lies halfway along the road described by the geometry argument.

  The function is implemented for `LineString` geometries in all spatial reference systems, both Cartesian and geographic.

  If the *`fractional_distance`* argument is 1.0, the result may not be exactly the last point of the `LineString` argument but a point close to it due to numerical inaccuracies in approximate-value computations.

  A related function, `ST_LineInterpolatePoints()`, takes similar arguments but returns a `MultiPoint` consisting of `Point` values along the `LineString` at each fraction of the distance from its start point to its endpoint. For examples of both functions, see the `ST_LineInterpolatePoints()` description.

  `ST_LineInterpolatePoint()` handles its arguments as described in the introduction to this section, with these exceptions:

  + If the geometry argument is not a `LineString`, an `ER_UNEXPECTED_GEOMETRY_TYPE` error occurs.

  + If the fractional distance argument is outside the range [0.0, 1.0], an `ER_DATA_OUT_OF_RANGE` error occurs.

  `ST_LineInterpolatePoint()` is a MySQL extension to OpenGIS. This function was added in MySQL 8.0.24.

* [`ST_LineInterpolatePoints(ls, fractional_distance)`](spatial-operator-functions.html#function_st-lineinterpolatepoints)

  This function takes a `LineString` geometry and a fractional distance in the range (0.0, 1.0] and returns the `MultiPoint` consisting of the `LineString` start point, plus `Point` values along the `LineString` at each fraction of the distance from its start point to its endpoint. It can be used to answer questions such as which `Point` values lie every 10% of the way along the road described by the geometry argument.

  The function is implemented for `LineString` geometries in all spatial reference systems, both Cartesian and geographic.

  If the *`fractional_distance`* argument divides 1.0 with zero remainder the result may not contain the last point of the `LineString` argument but a point close to it due to numerical inaccuracies in approximate-value computations.

  A related function, `ST_LineInterpolatePoint()`, takes similar arguments but returns the `Point` along the `LineString` at the given fraction of the distance from its start point to its endpoint.

  `ST_LineInterpolatePoints()` handles its arguments as described in the introduction to this section, with these exceptions:

  + If the geometry argument is not a `LineString`, an `ER_UNEXPECTED_GEOMETRY_TYPE` error occurs.

  + If the fractional distance argument is outside the range [0.0, 1.0], an `ER_DATA_OUT_OF_RANGE` error occurs.

  ```
  mysql> SET @ls1 = ST_GeomFromText('LINESTRING(0 0,0 5,5 5)');
  mysql> SELECT ST_AsText(ST_LineInterpolatePoint(@ls1, .5));
  +----------------------------------------------+
  | ST_AsText(ST_LineInterpolatePoint(@ls1, .5)) |
  +----------------------------------------------+
  | POINT(0 5)                                   |
  +----------------------------------------------+
  mysql> SELECT ST_AsText(ST_LineInterpolatePoint(@ls1, .75));
  +-----------------------------------------------+
  | ST_AsText(ST_LineInterpolatePoint(@ls1, .75)) |
  +-----------------------------------------------+
  | POINT(2.5 5)                                  |
  +-----------------------------------------------+
  mysql> SELECT ST_AsText(ST_LineInterpolatePoint(@ls1, 1));
  +---------------------------------------------+
  | ST_AsText(ST_LineInterpolatePoint(@ls1, 1)) |
  +---------------------------------------------+
  | POINT(5 5)                                  |
  +---------------------------------------------+
  mysql> SELECT ST_AsText(ST_LineInterpolatePoints(@ls1, .25));
  +------------------------------------------------+
  | ST_AsText(ST_LineInterpolatePoints(@ls1, .25)) |
  +------------------------------------------------+
  | MULTIPOINT((0 2.5),(0 5),(2.5 5),(5 5))        |
  +------------------------------------------------+
  ```

  `ST_LineInterpolatePoints()` is a MySQL extension to OpenGIS. This function was added in MySQL 8.0.24.

* [`ST_PointAtDistance(ls, distance)`](spatial-operator-functions.html#function_st-pointatdistance)

  This function takes a `LineString` geometry and a distance in the range [0.0, `ST_Length(ls)`] measured in the unit of the spatial reference system (SRS) of the `LineString`, and returns the `Point` along the `LineString` at that distance from its start point. It can be used to answer questions such as which `Point` value is 400 meters from the start of the road described by the geometry argument.

  The function is implemented for `LineString` geometries in all spatial reference systems, both Cartesian and geographic.

  `ST_PointAtDistance()` handles its arguments as described in the introduction to this section, with these exceptions:

  + If the geometry argument is not a `LineString`, an `ER_UNEXPECTED_GEOMETRY_TYPE` error occurs.

  + If the fractional distance argument is outside the range [0.0, `ST_Length(ls)`], an `ER_DATA_OUT_OF_RANGE` error occurs.

  `ST_PointAtDistance()` is a MySQL extension to OpenGIS. This function was added in MySQL 8.0.24.

* [`ST_SymDifference(g1, g2)`](spatial-operator-functions.html#function_st-symdifference)

  Returns a geometry that represents the point set symmetric difference of the geometry values *`g1`* and *`g2`*, which is defined as:

  ```
  g1 symdifference g2 := (g1 union g2) difference (g1 intersection g2)
  ```

  Or, in function call notation:

  ```
  ST_SymDifference(g1, g2) = ST_Difference(ST_Union(g1, g2), ST_Intersection(g1, g2))
  ```

  The result is in the same SRS as the geometry arguments.

  As of MySQL 8.0.27, `ST_SymDifference()` permits arguments in either a Cartesian or a geographic SRS. Prior to MySQL 8.0.27, `ST_SymDifference()` permits arguments in a Cartesian SRS only; for arguments in a geographic SRS, an `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS` error occurs.

  `ST_SymDifference()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SET @g1 = ST_GeomFromText('MULTIPOINT(5 0,15 10,15 25)');
  mysql> SET @g2 = ST_GeomFromText('MULTIPOINT(1 1,15 10,15 25)');
  mysql> SELECT ST_AsText(ST_SymDifference(@g1, @g2));
  +---------------------------------------+
  | ST_AsText(ST_SymDifference(@g1, @g2)) |
  +---------------------------------------+
  | MULTIPOINT((1 1),(5 0))               |
  +---------------------------------------+
  ```

* [`ST_Transform(g, target_srid)`](spatial-operator-functions.html#function_st-transform)

  Transforms a geometry from one spatial reference system (SRS) to another. The return value is a geometry of the same type as the input geometry with all coordinates transformed to the target SRID, *`target_srid`*. Prior to MySQL 8.0.30, transformation support was limited to geographic SRSs (unless the SRID of the geometry argument was the same as the target SRID value, in which case the return value was the input geometry for any valid SRS), and this function did not support Cartesian SRSs. Beginning with MySQL 8.0.30, support is provided for the Popular Visualisation Pseudo Mercator (EPSG 1024) projection method, used for WGS 84 Pseudo-Mercator (SRID 3857). In MySQL 8.0.32 and later, support is extended to all SRSs defined by EPSG except for those listed here:

  + EPSG 1042 Krovak Modified
  + EPSG 1043 Krovak Modified (North Orientated)
  + EPSG 9816 Tunisia Mining Grid
  + EPSG 9826 Lambert Conic Conformal (West Orientated)

  `ST_Transform()` handles its arguments as described in the introduction to this section, with these exceptions:

  + Geometry arguments that have an SRID value for a geographic SRS do not produce an error.

  + If the geometry or target SRID argument has an SRID value that refers to an undefined spatial reference system (SRS), an `ER_SRS_NOT_FOUND` error occurs.

  + If the geometry is in an SRS that `ST_Transform()` cannot transform from, an `ER_TRANSFORM_SOURCE_SRS_NOT_SUPPORTED` error occurs.

  + If the target SRID is in an SRS that `ST_Transform()` cannot transform to, an `ER_TRANSFORM_TARGET_SRS_NOT_SUPPORTED` error occurs.

  + If the geometry is in an SRS that is not WGS 84 and has no TOWGS84 clause, an `ER_TRANSFORM_SOURCE_SRS_MISSING_TOWGS84` error occurs.

  + If the target SRID is in an SRS that is not WGS 84 and has no TOWGS84 clause, an `ER_TRANSFORM_TARGET_SRS_MISSING_TOWGS84` error occurs.

  [`ST_SRID(g, target_srid)`](gis-general-property-functions.html#function_st-srid) and [`ST_Transform(g, target_srid)`](spatial-operator-functions.html#function_st-transform) differ as follows:

  + `ST_SRID()` changes the geometry SRID value without transforming its coordinates.

  + `ST_Transform()` transforms the geometry coordinates in addition to changing its SRID value.

  ```
  mysql> SET @p = ST_GeomFromText('POINT(52.381389 13.064444)', 4326);
  mysql> SELECT ST_AsText(@p);
  +----------------------------+
  | ST_AsText(@p)              |
  +----------------------------+
  | POINT(52.381389 13.064444) |
  +----------------------------+
  mysql> SET @p = ST_Transform(@p, 4230);
  mysql> SELECT ST_AsText(@p);
  +---------------------------------------------+
  | ST_AsText(@p)                               |
  +---------------------------------------------+
  | POINT(52.38208611407426 13.065520672345304) |
  +---------------------------------------------+
  ```

* [`ST_Union(g1, g2)`](spatial-operator-functions.html#function_st-union)

  Returns a geometry that represents the point set union of the geometry values *`g1`* and *`g2`*. The result is in the same SRS as the geometry arguments.

  As of MySQL 8.0.26, `ST_Union()` permits arguments in either a Cartesian or a geographic SRS. Prior to MySQL 8.0.26, `ST_Union()` permits arguments in a Cartesian SRS only; for arguments in a geographic SRS, an `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS` error occurs.

  `ST_Union()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SET @g1 = ST_GeomFromText('LineString(1 1, 3 3)');
  mysql> SET @g2 = ST_GeomFromText('LineString(1 3, 3 1)');
  mysql> SELECT ST_AsText(ST_Union(@g1, @g2));
  +--------------------------------------+
  | ST_AsText(ST_Union(@g1, @g2))        |
  +--------------------------------------+
  | MULTILINESTRING((1 1,3 3),(1 3,3 1)) |
  +--------------------------------------+
  ```


### 14.16.9 Functions That Test Spatial Relations Between Geometry Objects

The functions described in this section take two geometries as arguments and return a qualitative or quantitative relation between them.

MySQL implements two sets of functions using function names defined by the OpenGIS specification. One set tests the relationship between two geometry values using precise object shapes, the other set uses object minimum bounding rectangles (MBRs).


#### 14.16.9.1 Spatial Relation Functions That Use Object Shapes

The OpenGIS specification defines the following functions to test the relationship between two geometry values *`g1`* and *`g2`*, using precise object shapes. The return values 1 and 0 indicate true and false, respectively, except that distance functions return distance values.

Functions in this section detect arguments in either Cartesian or geographic spatial reference systems (SRSs), and return results appropriate to the SRS.

Unless otherwise specified, functions in this section handle their geometry arguments as follows:

* If any argument is `NULL` or any geometry argument is an empty geometry, the return value is `NULL`.

* If any geometry argument is not a syntactically well-formed geometry, an `ER_GIS_INVALID_DATA` error occurs.

* If any geometry argument is a syntactically well-formed geometry in an undefined spatial reference system (SRS), an `ER_SRS_NOT_FOUND` error occurs.

* For functions that take multiple geometry arguments, if those arguments are not in the same SRS, an `ER_GIS_DIFFERENT_SRIDS` error occurs.

* If any geometry argument is geometrically invalid, either the result is true or false (it is undefined which), or an error occurs.

* For geographic SRS geometry arguments, if any argument has a longitude or latitude that is out of range, an error occurs:

  + If a longitude value is not in the range (−180, 180], an `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE` error occurs (`ER_LONGITUDE_OUT_OF_RANGE` prior to MySQL 8.0.12).

  + If a latitude value is not in the range [−90, 90], an `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE` error occurs (`ER_LATITUDE_OUT_OF_RANGE` prior to MySQL 8.0.12).

  Ranges shown are in degrees. If an SRS uses another unit, the range uses the corresponding values in its unit. The exact range limits deviate slightly due to floating-point arithmetic.

* Otherwise, the return value is non-`NULL`.

Some functions in this section permit a unit argument that specifies the length unit for the return value. Unless otherwise specified, functions handle their unit argument as follows:

* A unit is supported if it is found in the `INFORMATION_SCHEMA` `ST_UNITS_OF_MEASURE` table. See Section 28.3.37, “The INFORMATION_SCHEMA ST_UNITS_OF_MEASURE Table”.

* If a unit is specified but not supported by MySQL, an `ER_UNIT_NOT_FOUND` error occurs.

* If a supported linear unit is specified and the SRID is 0, an `ER_GEOMETRY_IN_UNKNOWN_LENGTH_UNIT` error occurs.

* If a supported linear unit is specified and the SRID is not 0, the result is in that unit.

* If a unit is not specified, the result is in the unit of the SRS of the geometries, whether Cartesian or geographic. Currently, all MySQL SRSs are expressed in meters.

These object-shape functions are available for testing geometry relationships:

* [`ST_Contains(g1, g2)`](spatial-relation-functions-object-shapes.html#function_st-contains)

  Returns 1 or 0 to indicate whether *`g1`* completely contains *`g2`* (this means that *`g1`* and *`g2`* must not intersect). This relationship is the inverse of that tested by `ST_Within()`.

  `ST_Contains()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SET @g1 = ST_GeomFromText('Polygon((0 0,0 3,3 3,3 0,0 0))'),
      ->     @p1 = ST_GeomFromText('Point(1 1)'),
      ->     @p2 = ST_GeomFromText('Point(3 3)'),
      ->     @p3 = ST_GeomFromText('Point(5 5)');
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT
      ->   ST_Contains(@g1, @p1), ST_Within(@p1, @g1),
      ->   ST_Disjoint(@g1, @p1), ST_Intersects(@g1, @p1)\G
  *************************** 1. row ***************************
    ST_Contains(@g1, @p1): 1
      ST_Within(@p1, @g1): 1
    ST_Disjoint(@g1, @p1): 0
  ST_Intersects(@g1, @p1): 1
  1 row in set (0.00 sec)

  mysql> SELECT
      ->   ST_Contains(@g1, @p2), ST_Within(@p2, @g1),
      ->   ST_Disjoint(@g1, @p2), ST_Intersects(@g1, @p2)\G
  *************************** 1. row ***************************
    ST_Contains(@g1, @p2): 0
      ST_Within(@p2, @g1): 0
    ST_Disjoint(@g1, @p2): 0
  ST_Intersects(@g1, @p2): 1
  1 row in set (0.00 sec)

  mysql>
      -> SELECT
      ->   ST_Contains(@g1, @p3), ST_Within(@p3, @g1),
      ->   ST_Disjoint(@g1, @p3), ST_Intersects(@g1, @p3)\G
  *************************** 1. row ***************************
    ST_Contains(@g1, @p3): 0
      ST_Within(@p3, @g1): 0
    ST_Disjoint(@g1, @p3): 1
  ST_Intersects(@g1, @p3): 0
  1 row in set (0.00 sec)
  ```

* [`ST_Crosses(g1, g2)`](spatial-relation-functions-object-shapes.html#function_st-crosses)

  Two geometries *spatially cross* if their spatial relation has the following properties:

  + Unless *`g1`* and *`g2`* are both of dimension 1: *`g1`* crosses *`g2`* if the interior of *`g2`* has points in common with the interior of *`g1`*, but *`g2`* does not cover the entire interior of *`g1`*.

  + If both *`g1`* and *`g2`* are of dimension 1: If the lines cross each other in a finite number of points (that is, no common line segments, only single points in common).

  This function returns 1 or 0 to indicate whether *`g1`* spatially crosses *`g2`*.

  `ST_Crosses()` handles its arguments as described in the introduction to this section except that the return value is `NULL` for these additional conditions:

  + *`g1`* is of dimension 2 (`Polygon` or `MultiPolygon`).

  + *`g2`* is of dimension 1 (`Point` or `MultiPoint`).

* [`ST_Disjoint(g1, g2)`](spatial-relation-functions-object-shapes.html#function_st-disjoint)

  Returns 1 or 0 to indicate whether *`g1`* is spatially disjoint from (does not intersect) *`g2`*.

  `ST_Disjoint()` handles its arguments as described in the introduction to this section.

* [`ST_Distance(g1, g2 [, unit])`](spatial-relation-functions-object-shapes.html#function_st-distance)

  Returns the distance between *`g1`* and *`g2`*, measured in the length unit of the spatial reference system (SRS) of the geometry arguments, or in the unit of the optional *`unit`* argument if that is specified.

  This function processes geometry collections by returning the shortest distance among all combinations of the components of the two geometry arguments.

  `ST_Distance()` handles its geometry arguments as described in the introduction to this section, with these exceptions:

  + `ST_Distance()` detects arguments in a geographic (ellipsoidal) spatial reference system and returns the geodetic distance on the ellipsoid. As of MySQL 8.0.18, `ST_Distance()` supports distance calculations for geographic SRS arguments of all geometry types. Prior to MySQL 8.0.18, the only permitted geographic argument types are `Point` and `Point`, or `Point` and `MultiPoint` (in any argument order). If called with other geometry type argument combinations in a geographic SRS, an `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS` error occurs.

  + If any argument is geometrically invalid, either the result is an undefined distance (that is, it can be any number), or an error occurs.

  + If an intermediate or final result produces `NaN` or a negative number, an `ER_GIS_INVALID_DATA` error occurs.

  As of MySQL 8.0.14, `ST_Distance()` permits an optional *`unit`* argument that specifies the linear unit for the returned distance value. `ST_Distance()` handles its *`unit`* argument as described in the introduction to this section.

  ```
  mysql> SET @g1 = ST_GeomFromText('POINT(1 1)');
  mysql> SET @g2 = ST_GeomFromText('POINT(2 2)');
  mysql> SELECT ST_Distance(@g1, @g2);
  +-----------------------+
  | ST_Distance(@g1, @g2) |
  +-----------------------+
  |    1.4142135623730951 |
  +-----------------------+

  mysql> SET @g1 = ST_GeomFromText('POINT(1 1)', 4326);
  mysql> SET @g2 = ST_GeomFromText('POINT(2 2)', 4326);
  mysql> SELECT ST_Distance(@g1, @g2);
  +-----------------------+
  | ST_Distance(@g1, @g2) |
  +-----------------------+
  |     156874.3859490455 |
  +-----------------------+
  mysql> SELECT ST_Distance(@g1, @g2, 'metre');
  +--------------------------------+
  | ST_Distance(@g1, @g2, 'metre') |
  +--------------------------------+
  |              156874.3859490455 |
  +--------------------------------+
  mysql> SELECT ST_Distance(@g1, @g2, 'foot');
  +-------------------------------+
  | ST_Distance(@g1, @g2, 'foot') |
  +-------------------------------+
  |             514679.7439273146 |
  +-------------------------------+
  ```

  For the special case of distance calculations on a sphere, see the `ST_Distance_Sphere()` function.

* [`ST_Equals(g1, g2)`](spatial-relation-functions-object-shapes.html#function_st-equals)

  Returns 1 or 0 to indicate whether *`g1`* is spatially equal to *`g2`*.

  `ST_Equals()` handles its arguments as described in the introduction to this section, except that it does not return `NULL` for empty geometry arguments.

  ```
  mysql> SET @g1 = Point(1,1), @g2 = Point(2,2);
  mysql> SELECT ST_Equals(@g1, @g1), ST_Equals(@g1, @g2);
  +---------------------+---------------------+
  | ST_Equals(@g1, @g1) | ST_Equals(@g1, @g2) |
  +---------------------+---------------------+
  |                   1 |                   0 |
  +---------------------+---------------------+
  ```

* [`ST_FrechetDistance(g1, g2 [, unit])`](spatial-relation-functions-object-shapes.html#function_st-frechetdistance)

  Returns the discrete Fréchet distance between two geometries, reflecting how similar the geometries are. The result is a double-precision number measured in the length unit of the spatial reference system (SRS) of the geometry arguments, or in the length unit of the *`unit`* argument if that argument is given.

  This function implements the discrete Fréchet distance, which means it is restricted to distances between the points of the geometries. For example, given two `LineString` arguments, only the points explicitly mentioned in the geometries are considered. Points on the line segments between these points are not considered.

  `ST_FrechetDistance()` handles its geometry arguments as described in the introduction to this section, with these exceptions:

  + The geometries may have a Cartesian or geographic SRS, but only `LineString` values are supported. If the arguments are in the same Cartesian or geographic SRS, but either is not a `LineString`, an `ER_NOT_IMPLEMENTED_FOR_CARTESIAN_SRS` or `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS` error occurs, depending on the SRS type.

  `ST_FrechetDistance()` handles its optional *`unit`* argument as described in the introduction to this section.

  ```
  mysql> SET @ls1 = ST_GeomFromText('LINESTRING(0 0,0 5,5 5)');
  mysql> SET @ls2 = ST_GeomFromText('LINESTRING(0 1,0 6,3 3,5 6)');
  mysql> SELECT ST_FrechetDistance(@ls1, @ls2);
  +--------------------------------+
  | ST_FrechetDistance(@ls1, @ls2) |
  +--------------------------------+
  |             2.8284271247461903 |
  +--------------------------------+

  mysql> SET @ls1 = ST_GeomFromText('LINESTRING(0 0,0 5,5 5)', 4326);
  mysql> SET @ls2 = ST_GeomFromText('LINESTRING(0 1,0 6,3 3,5 6)', 4326);
  mysql> SELECT ST_FrechetDistance(@ls1, @ls2);
  +--------------------------------+
  | ST_FrechetDistance(@ls1, @ls2) |
  +--------------------------------+
  |              313421.1999416798 |
  +--------------------------------+
  mysql> SELECT ST_FrechetDistance(@ls1, @ls2, 'foot');
  +----------------------------------------+
  | ST_FrechetDistance(@ls1, @ls2, 'foot') |
  +----------------------------------------+
  |                     1028284.7767115477 |
  +----------------------------------------+
  ```

  This function was added in MySQL 8.0.23.

* [`ST_HausdorffDistance(g1, g2 [, unit])`](spatial-relation-functions-object-shapes.html#function_st-hausdorffdistance)

  Returns the discrete Hausdorff distance between two geometries, reflecting how similar the geometries are. The result is a double-precision number measured in the length unit of the spatial reference system (SRS) of the geometry arguments, or in the length unit of the *`unit`* argument if that argument is given.

  This function implements the discrete Hausdorff distance, which means it is restricted to distances between the points of the geometries. For example, given two `LineString` arguments, only the points explicitly mentioned in the geometries are considered. Points on the line segments between these points are not considered.

  `ST_HausdorffDistance()` handles its geometry arguments as described in the introduction to this section, with these exceptions:

  + If the geometry arguments are in the same Cartesian or geographic SRS, but are not in a supported combination, an `ER_NOT_IMPLEMENTED_FOR_CARTESIAN_SRS` or `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS` error occurs, depending on the SRS type. These combinations are supported:

    - `LineString` and `LineString`

    - `Point` and `MultiPoint`

    - `LineString` and `MultiLineString`

    - `MultiPoint` and `MultiPoint`

    - `MultiLineString` and `MultiLineString`

  `ST_HausdorffDistance()` handles its optional *`unit`* argument as described in the introduction to this section.

  ```
  mysql> SET @ls1 = ST_GeomFromText('LINESTRING(0 0,0 5,5 5)');
  mysql> SET @ls2 = ST_GeomFromText('LINESTRING(0 1,0 6,3 3,5 6)');
  mysql> SELECT ST_HausdorffDistance(@ls1, @ls2);
  +----------------------------------+
  | ST_HausdorffDistance(@ls1, @ls2) |
  +----------------------------------+
  |                                1 |
  +----------------------------------+

  mysql> SET @ls1 = ST_GeomFromText('LINESTRING(0 0,0 5,5 5)', 4326);
  mysql> SET @ls2 = ST_GeomFromText('LINESTRING(0 1,0 6,3 3,5 6)', 4326);
  mysql> SELECT ST_HausdorffDistance(@ls1, @ls2);
  +----------------------------------+
  | ST_HausdorffDistance(@ls1, @ls2) |
  +----------------------------------+
  |               111319.49079326246 |
  +----------------------------------+
  mysql> SELECT ST_HausdorffDistance(@ls1, @ls2, 'foot');
  +------------------------------------------+
  | ST_HausdorffDistance(@ls1, @ls2, 'foot') |
  +------------------------------------------+
  |                        365221.4264870815 |
  +------------------------------------------+
  ```

  This function was added in MySQL 8.0.23.

* [`ST_Intersects(g1, g2)`](spatial-relation-functions-object-shapes.html#function_st-intersects)

  Returns 1 or 0 to indicate whether *`g1`* spatially intersects *`g2`*.

  `ST_Intersects()` handles its arguments as described in the introduction to this section.

* [`ST_Overlaps(g1, g2)`](spatial-relation-functions-object-shapes.html#function_st-overlaps)

  Two geometries *spatially overlap* if they intersect and their intersection results in a geometry of the same dimension but not equal to either of the given geometries.

  This function returns 1 or 0 to indicate whether *`g1`* spatially overlaps *`g2`*.

  `ST_Overlaps()` handles its arguments as described in the introduction to this section except that the return value is `NULL` for the additional condition that the dimensions of the two geometries are not equal.

* [`ST_Touches(g1, g2)`](spatial-relation-functions-object-shapes.html#function_st-touches)

  Two geometries *spatially touch* if their interiors do not intersect, but the boundary of one of the geometries intersects either the boundary or the interior of the other.

  This function returns 1 or 0 to indicate whether *`g1`* spatially touches *`g2`*.

  `ST_Touches()` handles its arguments as described in the introduction to this section except that the return value is `NULL` for the additional condition that both geometries are of dimension 0 (`Point` or `MultiPoint`).

* [`ST_Within(g1, g2)`](spatial-relation-functions-object-shapes.html#function_st-within)

  Returns 1 or 0 to indicate whether *`g1`* is spatially within *`g2`*. This tests the opposite relationship as `ST_Contains()`.

  `ST_Within()` handles its arguments as described in the introduction to this section.


#### 14.16.9.2 Spatial Relation Functions That Use Minimum Bounding Rectangles

MySQL provides several MySQL-specific functions that test the relationship between minimum bounding rectangles (MBRs) of two geometries *`g1`* and *`g2`*. The return values 1 and 0 indicate true and false, respectively.

The bounding box of a point is interpreted as a point that is both boundary and interior.

The bounding box of a straight horizontal or vertical line is interpreted as a line where the interior of the line is also boundary. The endpoints are boundary points.

If any of the parameters are geometry collections, the interior, boundary, and exterior of those parameters are those of the union of all elements in the collection.

Functions in this section detect arguments in either Cartesian or geographic spatial reference systems (SRSs), and return results appropriate to the SRS.

Unless otherwise specified, functions in this section handle their geometry arguments as follows:

* If any argument is `NULL` or an empty geometry, the return value is `NULL`.

* If any geometry argument is not a syntactically well-formed geometry, an `ER_GIS_INVALID_DATA` error occurs.

* If any geometry argument is a syntactically well-formed geometry in an undefined spatial reference system (SRS), an `ER_SRS_NOT_FOUND` error occurs.

* For functions that take multiple geometry arguments, if those arguments are not in the same SRS, an `ER_GIS_DIFFERENT_SRIDS` error occurs.

* If any argument is geometrically invalid, either the result is true or false (it is undefined which), or an error occurs.

* For geographic SRS geometry arguments, if any argument has a longitude or latitude that is out of range, an error occurs:

  + If a longitude value is not in the range (−180, 180], an `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE` error occurs (`ER_LONGITUDE_OUT_OF_RANGE` prior to MySQL 8.0.12).

  + If a latitude value is not in the range [−90, 90], an `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE` error occurs (`ER_LATITUDE_OUT_OF_RANGE` prior to MySQL 8.0.12).

  Ranges shown are in degrees. If an SRS uses another unit, the range uses the corresponding values in its unit. The exact range limits deviate slightly due to floating-point arithmetic.

* Otherwise, the return value is non-`NULL`.

These MBR functions are available for testing geometry relationships:

* [`MBRContains(g1, g2)`](spatial-relation-functions-mbr.html#function_mbrcontains)

  Returns 1 or 0 to indicate whether the minimum bounding rectangle of *`g1`* contains the minimum bounding rectangle of *`g2`*. This tests the opposite relationship as `MBRWithin()`.

  `MBRContains()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SET
      ->   @g1 = ST_GeomFromText('Polygon((0 0,0 3,3 3,3 0,0 0))'),
      ->   @g2 = ST_GeomFromText('Polygon((1 1,1 2,2 2,2 1,1 1))'),
      ->   @g3 = ST_GeomFromText('Polygon((0 0,0 5,5 5,5 0,0 0))'),
      ->   @g4 = ST_GeomFromText('Polygon((5 5,5 10,10 10,10 5,5 5))'),
      ->   @p1 = ST_GeomFromText('Point(1 1)'),
      ->   @p2 = ST_GeomFromText('Point(3 3)');
      ->   @p3 = ST_GeomFromText('Point(5 5)');
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT
      ->   MBRContains(@g1, @g2), MBRContains(@g1, @g4),
      ->   MBRContains(@g2, @g1), MBRContains(@g2, @g4),
      ->   MBRContains(@g2, @g3), MBRContains(@g3, @g4),
      ->   MBRContains(@g3, @g1), MBRContains(@g1, @g3),
      ->   MBRContains(@g1, @p1), MBRContains(@p1, @g1),
      ->   MBRContains(@g1, @p1), MBRContains(@p1, @g1),
      ->   MBRContains(@g2, @p2), MBRContains(@g2, @p3),
      ->   MBRContains(@g3, @p1), MBRContains(@g3, @p2),
      ->   MBRContains(@g3, @p3), MBRContains(@g4, @p1),
      ->   MBRContains(@g4, @p2), MBRContains(@g4, @p3)\G
  *************************** 1. row ***************************
  MBRContains(@g1, @g2): 1
  MBRContains(@g1, @g4): 0
  MBRContains(@g2, @g1): 0
  MBRContains(@g2, @g4): 0
  MBRContains(@g2, @g3): 0
  MBRContains(@g3, @g4): 0
  MBRContains(@g3, @g1): 1
  MBRContains(@g1, @g3): 0
  MBRContains(@g1, @p1): 1
  MBRContains(@p1, @g1): 0
  MBRContains(@g1, @p1): 1
  MBRContains(@p1, @g1): 0
  MBRContains(@g2, @p2): 0
  MBRContains(@g2, @p3): 0
  MBRContains(@g3, @p1): 1
  MBRContains(@g3, @p2): 1
  MBRContains(@g3, @p3): 0
  MBRContains(@g4, @p1): 0
  MBRContains(@g4, @p2): 0
  MBRContains(@g4, @p3): 0
  1 row in set (0.00 sec)
  ```

* [`MBRCoveredBy(g1, g2)`](spatial-relation-functions-mbr.html#function_mbrcoveredby)

  Returns 1 or 0 to indicate whether the minimum bounding rectangle of *`g1`* is covered by the minimum bounding rectangle of *`g2`*. This tests the opposite relationship as `MBRCovers()`.

  `MBRCoveredBy()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SET @g1 = ST_GeomFromText('Polygon((0 0,0 3,3 3,3 0,0 0))');
  mysql> SET @g2 = ST_GeomFromText('Point(1 1)');
  mysql> SELECT MBRCovers(@g1,@g2), MBRCoveredby(@g1,@g2);
  +--------------------+-----------------------+
  | MBRCovers(@g1,@g2) | MBRCoveredby(@g1,@g2) |
  +--------------------+-----------------------+
  |                  1 |                     0 |
  +--------------------+-----------------------+
  mysql> SELECT MBRCovers(@g2,@g1), MBRCoveredby(@g2,@g1);
  +--------------------+-----------------------+
  | MBRCovers(@g2,@g1) | MBRCoveredby(@g2,@g1) |
  +--------------------+-----------------------+
  |                  0 |                     1 |
  +--------------------+-----------------------+
  ```

  See the description of the `MBRCovers()` function for additional examples.

* [`MBRCovers(g1, g2)`](spatial-relation-functions-mbr.html#function_mbrcovers)

  Returns 1 or 0 to indicate whether the minimum bounding rectangle of *`g1`* covers the minimum bounding rectangle of *`g2`*. This tests the opposite relationship as `MBRCoveredBy()`. See the description of `MBRCoveredBy()` for additional examples.

  `MBRCovers()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SET
      ->   @g1 = ST_GeomFromText('Polygon((0 0,0 3,3 3,3 0,0 0))'),
      ->   @g2 = ST_GeomFromText('Polygon((1 1,1 2,2 2,2 1,1 1))'),
      ->   @p1 = ST_GeomFromText('Point(1 1)'),
      ->   @p2 = ST_GeomFromText('Point(3 3)'),
      ->   @p3 = ST_GeomFromText('Point(5 5)');
  Query OK, 0 rows affected (0.02 sec)

  mysql> SELECT
      ->   MBRCovers(@g1, @p1), MBRCovers(@g1, @p2),
      ->   MBRCovers(@g1, @g2), MBRCovers(@g1, @p3)\G
  *************************** 1. row ***************************
  MBRCovers(@g1, @p1): 1
  MBRCovers(@g1, @p2): 1
  MBRCovers(@g1, @g2): 1
  MBRCovers(@g1, @p3): 0
  1 row in set (0.00 sec)
  ```

* [`MBRDisjoint(g1, g2)`](spatial-relation-functions-mbr.html#function_mbrdisjoint)

  Returns 1 or 0 to indicate whether the minimum bounding rectangles of the two geometries *`g1`* and *`g2`* are disjoint (do not intersect).

  `MBRDisjoint()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SET
      ->   @g1 = ST_GeomFromText('Polygon((0 0,0 3,3 3,3 0,0 0))'),
      ->   @g2 = ST_GeomFromText('Polygon((1 1,1 2,2 2,2 1,1 1))'),
      ->   @g3 = ST_GeomFromText('Polygon((0 0,0 5,5 5,5 0,0 0))'),
      ->   @g4 = ST_GeomFromText('Polygon((5 5,5 10,10 10,10 5,5 5))'),
      ->   @p1 = ST_GeomFromText('Point(1 1)'),
      ->   @p2 = ST_GeomFromText('Point(3 3)'),
      ->   @p3 = ST_GeomFromText('Point(5 5)');
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT
      ->   MBRDisjoint(@g1, @g4), MBRDisjoint(@g2, @g4),
      ->   MBRDisjoint(@g3, @g4), MBRDisjoint(@g4, @g4),
      ->   MBRDisjoint(@g1, @p1), MBRDisjoint(@g1, @p2),
      ->   MBRDisjoint(@g1, @p3)\G
  *************************** 1. row ***************************
  MBRDisjoint(@g1, @g4): 1
  MBRDisjoint(@g2, @g4): 1
  MBRDisjoint(@g3, @g4): 0
  MBRDisjoint(@g4, @g4): 0
  MBRDisjoint(@g1, @p1): 0
  MBRDisjoint(@g1, @p2): 0
  MBRDisjoint(@g1, @p3): 1
  1 row in set (0.00 sec)
  ```

* [`MBREquals(g1, g2)`](spatial-relation-functions-mbr.html#function_mbrequals)

  Returns 1 or 0 to indicate whether the minimum bounding rectangles of the two geometries *`g1`* and *`g2`* are the same.

  `MBREquals()` handles its arguments as described in the introduction to this section, except that it does not return `NULL` for empty geometry arguments.

  ```
  mysql> SET
      ->   @g1 = ST_GeomFromText('Polygon((0 0,0 3,3 3,3 0,0 0))'),
      ->   @g2 = ST_GeomFromText('Polygon((1 1,1 2,2 2,2 1,1 1))'),
      ->   @p1 = ST_GeomFromText('Point(1 1)'),
      ->   @p2 = ST_GeomFromText('Point(3 3)'),
      ->   @p3 = ST_GeomFromText('Point(5 5)');
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT
      ->   MBREquals(@g1, @g1), MBREquals(@g1, @g2),
      ->   MBREquals(@g1, @p1), MBREquals(@g1, @p2), MBREquals(@g2, @g2),
      ->   MBREquals(@p1, @p1), MBREquals(@p1, @p2), MBREquals(@p2, @p2)\G
  *************************** 1. row ***************************
  MBREquals(@g1, @g1): 1
  MBREquals(@g1, @g2): 0
  MBREquals(@g1, @p1): 0
  MBREquals(@g1, @p2): 0
  MBREquals(@g2, @g2): 1
  MBREquals(@p1, @p1): 1
  MBREquals(@p1, @p2): 0
  MBREquals(@p2, @p2): 1
  1 row in set (0.00 sec)
  ```

* [`MBRIntersects(g1, g2)`](spatial-relation-functions-mbr.html#function_mbrintersects)

  Returns 1 or 0 to indicate whether the minimum bounding rectangles of the two geometries *`g1`* and *`g2`* intersect.

  `MBRIntersects()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SET
      ->   @g1 = ST_GeomFromText('Polygon((0 0,0 3,3 3,3 0,0 0))'),
      ->   @g2 = ST_GeomFromText('Polygon((1 1,1 2,2 2,2 1,1 1))'),
      ->   @g3 = ST_GeomFromText('Polygon((0 0,0 5,5 5,5 0,0 0))'),
      ->   @g4 = ST_GeomFromText('Polygon((5 5,5 10,10 10,10 5,5 5))'),
      ->   @g5 = ST_GeomFromText('Polygon((2 2,2 8,8 8,8 2,2 2))'),
      ->   @p1 = ST_GeomFromText('Point(1 1)'),
      ->   @p2 = ST_GeomFromText('Point(3 3)'),
      ->   @p3 = ST_GeomFromText('Point(5 5)');
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT
      ->   MBRIntersects(@g1, @g1), MBRIntersects(@g1, @g2),
      ->   MBRIntersects(@g1, @g3), MBRIntersects(@g1, @g4), MBRIntersects(@g1, @g5),
      ->   MBRIntersects(@g1, @p1), MBRIntersects(@g1, @p2), MBRIntersects(@g1, @p3),
      ->   MBRIntersects(@g2, @p1), MBRIntersects(@g2, @p2), MBRIntersects(@g2, @p3)\G
  *************************** 1. row ***************************
  MBRIntersects(@g1, @g1): 1
  MBRIntersects(@g1, @g2): 1
  MBRIntersects(@g1, @g3): 1
  MBRIntersects(@g1, @g4): 0
  MBRIntersects(@g1, @g5): 1
  MBRIntersects(@g1, @p1): 1
  MBRIntersects(@g1, @p2): 1
  MBRIntersects(@g1, @p3): 0
  MBRIntersects(@g2, @p1): 1
  MBRIntersects(@g2, @p2): 0
  MBRIntersects(@g2, @p3): 0
  1 row in set (0.00 sec)
  ```

* [`MBROverlaps(g1, g2)`](spatial-relation-functions-mbr.html#function_mbroverlaps)

  Two geometries *spatially overlap* if they intersect and their intersection results in a geometry of the same dimension but not equal to either of the given geometries.

  This function returns 1 or 0 to indicate whether the minimum bounding rectangles of the two geometries *`g1`* and *`g2`* overlap.

  `MBROverlaps()` handles its arguments as described in the introduction to this section.

* [`MBRTouches(g1, g2)`](spatial-relation-functions-mbr.html#function_mbrtouches)

  Two geometries *spatially touch* if their interiors do not intersect, but the boundary of one of the geometries intersects either the boundary or the interior of the other.

  This function returns 1 or 0 to indicate whether the minimum bounding rectangles of the two geometries *`g1`* and *`g2`* touch.

  `MBRTouches()` handles its arguments as described in the introduction to this section.

* [`MBRWithin(g1, g2)`](spatial-relation-functions-mbr.html#function_mbrwithin)

  Returns 1 or 0 to indicate whether the minimum bounding rectangle of *`g1`* is within the minimum bounding rectangle of *`g2`*. This tests the opposite relationship as `MBRContains()`.

  `MBRWithin()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SET
      ->   @g1 = ST_GeomFromText('Polygon((0 0,0 3,3 3,3 0,0 0))'),
      ->   @g2 = ST_GeomFromText('Polygon((1 1,1 2,2 2,2 1,1 1))'),
      ->   @g3 = ST_GeomFromText('Polygon((0 0,0 5,5 5,5 0,0 0))'),
      ->   @g4 = ST_GeomFromText('Polygon((5 5,5 10,10 10,10 5,5 5))'),
      ->   @p1 = ST_GeomFromText('Point(1 1)'),
      ->   @p2 = ST_GeomFromText('Point(3 3)');
      ->   @p3 = ST_GeomFromText('Point(5 5)');
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT
      ->   MBRWithin(@g1, @g2), MBRWithin(@g1, @g4),
      ->   MBRWithin(@g2, @g1), MBRWithin(@g2, @g4),
      ->   MBRWithin(@g2, @g3), MBRWithin(@g3, @g4),
      ->   MBRWithin(@g1, @p1), MBRWithin(@p1, @g1),
      ->   MBRWithin(@g1, @p1), MBRWithin(@p1, @g1),
      ->   MBRWithin(@g2, @p2), MBRWithin(@g2, @p3)\G
  *************************** 1. row ***************************
  MBRWithin(@g1, @g2): 0
  MBRWithin(@g1, @g4): 0
  MBRWithin(@g2, @g1): 1
  MBRWithin(@g2, @g4): 0
  MBRWithin(@g2, @g3): 1
  MBRWithin(@g3, @g4): 0
  MBRWithin(@g1, @p1): 0
  MBRWithin(@p1, @g1): 1
  MBRWithin(@g1, @p1): 0
  MBRWithin(@p1, @g1): 1
  MBRWithin(@g2, @p2): 0
  MBRWithin(@g2, @p3): 0
  1 row in set (0.00 sec)
  ```


### 14.16.10 Spatial Geohash Functions

Geohash is a system for encoding latitude and longitude coordinates of arbitrary precision into a text string. Geohash values are strings that contain only characters chosen from `"0123456789bcdefghjkmnpqrstuvwxyz"`.

The functions in this section enable manipulation of geohash values, which provides applications the capabilities of importing and exporting geohash data, and of indexing and searching geohash values.

Unless otherwise specified, functions in this section handle their geometry arguments as follows:

* If any argument is `NULL`, the return value is `NULL`.

* If any argument is invalid, an error occurs.
* If any argument has a longitude or latitude that is out of range, an error occurs:

  + If a longitude value is not in the range (−180, 180], an `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE` error occurs (`ER_LONGITUDE_OUT_OF_RANGE` prior to MySQL 8.0.12).

  + If a latitude value is not in the range [−90, 90], an `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE` error occurs (`ER_LATITUDE_OUT_OF_RANGE` prior to MySQL 8.0.12).

  Ranges shown are in degrees. The exact range limits deviate slightly due to floating-point arithmetic.

* If any point argument does not have SRID 0 or 4326, an `ER_SRS_NOT_FOUND` error occurs. *`point`* argument SRID validity is not checked.

* If any SRID argument refers to an undefined spatial reference system (SRS), an `ER_SRS_NOT_FOUND` error occurs.

* If any SRID argument is not within the range of a 32-bit unsigned integer, an `ER_DATA_OUT_OF_RANGE` error occurs.

* Otherwise, the return value is non-`NULL`.

These geohash functions are available:

* [`ST_GeoHash(longitude, latitude, max_length)`](spatial-geohash-functions.html#function_st-geohash), [`ST_GeoHash(point, max_length)`](spatial-geohash-functions.html#function_st-geohash)

  Returns a geohash string in the connection character set and collation.

  For the first syntax, the *`longitude`* must be a number in the range [−180, 180], and the *`latitude`* must be a number in the range [−90, 90]. For the second syntax, a `POINT` value is required, where the X and Y coordinates are in the valid ranges for longitude and latitude, respectively.

  The resulting string is no longer than *`max_length`* characters, which has an upper limit of 100. The string might be shorter than *`max_length`* characters because the algorithm that creates the geohash value continues until it has created a string that is either an exact representation of the location or *`max_length`* characters, whichever comes first.

  `ST_GeoHash()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SELECT ST_GeoHash(180,0,10), ST_GeoHash(-180,-90,15);
  +----------------------+-------------------------+
  | ST_GeoHash(180,0,10) | ST_GeoHash(-180,-90,15) |
  +----------------------+-------------------------+
  | xbpbpbpbpb           | 000000000000000         |
  +----------------------+-------------------------+
  ```

* `ST_LatFromGeoHash(geohash_str)`

  Returns the latitude from a geohash string value, as a double-precision number in the range [−90, 90].

  The `ST_LatFromGeoHash()` decoding function reads no more than 433 characters from the *`geohash_str`* argument. That represents the upper limit on information in the internal representation of coordinate values. Characters past the 433rd are ignored, even if they are otherwise illegal and produce an error.

  `ST_LatFromGeoHash()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SELECT ST_LatFromGeoHash(ST_GeoHash(45,-20,10));
  +------------------------------------------+
  | ST_LatFromGeoHash(ST_GeoHash(45,-20,10)) |
  +------------------------------------------+
  |                                      -20 |
  +------------------------------------------+
  ```

* `ST_LongFromGeoHash(geohash_str)`

  Returns the longitude from a geohash string value, as a double-precision number in the range [−180, 180].

  The remarks in the description of `ST_LatFromGeoHash()` regarding the maximum number of characters processed from the *`geohash_str`* argument also apply to `ST_LongFromGeoHash()`.

  `ST_LongFromGeoHash()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SELECT ST_LongFromGeoHash(ST_GeoHash(45,-20,10));
  +-------------------------------------------+
  | ST_LongFromGeoHash(ST_GeoHash(45,-20,10)) |
  +-------------------------------------------+
  |                                        45 |
  +-------------------------------------------+
  ```

* [`ST_PointFromGeoHash(geohash_str, srid)`](spatial-geohash-functions.html#function_st-pointfromgeohash)

  Returns a `POINT` value containing the decoded geohash value, given a geohash string value.

  The X and Y coordinates of the point are the longitude in the range [−180, 180] and the latitude in the range [−90, 90], respectively.

  The *`srid`* argument is an 32-bit unsigned integer.

  The remarks in the description of `ST_LatFromGeoHash()` regarding the maximum number of characters processed from the *`geohash_str`* argument also apply to `ST_PointFromGeoHash()`.

  `ST_PointFromGeoHash()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SET @gh = ST_GeoHash(45,-20,10);
  mysql> SELECT ST_AsText(ST_PointFromGeoHash(@gh,0));
  +---------------------------------------+
  | ST_AsText(ST_PointFromGeoHash(@gh,0)) |
  +---------------------------------------+
  | POINT(45 -20)                         |
  +---------------------------------------+
  ```


### 14.16.11 Spatial GeoJSON Functions

This section describes functions for converting between GeoJSON documents and spatial values. GeoJSON is an open standard for encoding geometric/geographical features. For more information, see <http://geojson.org>. The functions discussed here follow GeoJSON specification revision 1.0.

GeoJSON supports the same geometric/geographic data types that MySQL supports. Feature and FeatureCollection objects are not supported, except that geometry objects are extracted from them. CRS support is limited to values that identify an SRID.

MySQL also supports a native `JSON` data type and a set of SQL functions to enable operations on JSON values. For more information, see Section 13.5, “The JSON Data Type”, and Section 14.17, “JSON Functions”.

* [`ST_AsGeoJSON(g [, max_dec_digits [, options]])`](spatial-geojson-functions.html#function_st-asgeojson)

  Generates a GeoJSON object from the geometry *`g`*. The object string has the connection character set and collation.

  If any argument is `NULL`, the return value is `NULL`. If any non-`NULL` argument is invalid, an error occurs.

  *`max_dec_digits`*, if specified, limits the number of decimal digits for coordinates and causes rounding of output. If not specified, this argument defaults to its maximum value of 232 −

  1. The minimum is 0.

  *`options`*, if specified, is a bitmask. The following table shows the permitted flag values. If the geometry argument has an SRID of 0, no CRS object is produced even for those flag values that request one.

  <table summary="Option flags for the ST_AsGeoJSON() function."><col style="width: 10%"/><col style="width: 90%"/><thead><tr> <th>Flag Value</th> <th>Meaning</th> </tr></thead><tbody><tr> <td>0</td> <td>No options. This is the default if <em class="replaceable"><code>options</code></em> is not specified.</td> </tr><tr> <td>1</td> <td>Add a bounding box to the output.</td> </tr><tr> <td>2</td> <td>Add a short-format CRS URN to the output. The default format is a short format (<code>EPSG:<em class="replaceable"><code>srid</code></em></code>).</td> </tr><tr> <td>4</td> <td>Add a long-format CRS URN (<code>urn:ogc:def:crs:EPSG::<em class="replaceable"><code>srid</code></em></code>). This flag overrides flag 2. For example, option values of 5 and 7 mean the same (add a bounding box and a long-format CRS URN).</td> </tr></tbody></table>

  ```
  mysql> SELECT ST_AsGeoJSON(ST_GeomFromText('POINT(11.11111 12.22222)'),2);
  +-------------------------------------------------------------+
  | ST_AsGeoJSON(ST_GeomFromText('POINT(11.11111 12.22222)'),2) |
  +-------------------------------------------------------------+
  | {"type": "Point", "coordinates": [11.11, 12.22]}            |
  +-------------------------------------------------------------+
  ```

* [`ST_GeomFromGeoJSON(str [, options [, srid]])`](spatial-geojson-functions.html#function_st-geomfromgeojson)

  Parses a string *`str`* representing a GeoJSON object and returns a geometry.

  If any argument is `NULL`, the return value is `NULL`. If any non-`NULL` argument is invalid, an error occurs.

  *`options`*, if given, describes how to handle GeoJSON documents that contain geometries with coordinate dimensions higher than 2. The following table shows the permitted *`options`* values.

  <table summary="Option flags for the ST_GeomFromGeoJSON() function."><col style="width: 10%"/><col style="width: 90%"/><thead><tr> <th>Option Value</th> <th>Meaning</th> </tr></thead><tbody><tr> <td>1</td> <td>Reject the document and produce an error. This is the default if <em class="replaceable"><code>options</code></em> is not specified.</td> </tr><tr> <td>2, 3, 4</td> <td>Accept the document and strip off the coordinates for higher coordinate dimensions.</td> </tr></tbody></table>

  *`options`* values of 2, 3, and 4 currently produce the same effect. If geometries with coordinate dimensions higher than 2 are supported in the future, you can expect these values to produce different effects.

  The *`srid`* argument, if given, must be a 32-bit unsigned integer. If not given, the geometry return value has an SRID of 4326.

  If *`srid`* refers to an undefined spatial reference system (SRS), an `ER_SRS_NOT_FOUND` error occurs.

  For geographic SRS geometry arguments, if any argument has a longitude or latitude that is out of range, an error occurs:

  + If a longitude value is not in the range (−180, 180], an `ER_LONGITUDE_OUT_OF_RANGE` error occurs.

  + If a latitude value is not in the range [−90, 90], an `ER_LATITUDE_OUT_OF_RANGE` error occurs.

  Ranges shown are in degrees. If an SRS uses another unit, the range uses the corresponding values in its unit. The exact range limits deviate slightly due to floating-point arithmetic.

  GeoJSON geometry, feature, and feature collection objects may have a `crs` property. The parsing function parses named CRS URNs in the `urn:ogc:def:crs:EPSG::srid` and `EPSG:srid` namespaces, but not CRSs given as link objects. Also, `urn:ogc:def:crs:OGC:1.3:CRS84` is recognized as SRID 4326. If an object has a CRS that is not understood, an error occurs, with the exception that if the optional *`srid`* argument is given, any CRS is ignored even if it is invalid.

  If a `crs` member that specifies an SRID different from the top-level object SRID is found at a lower level of the GeoJSON document, an `ER_INVALID_GEOJSON_CRS_NOT_TOP_LEVEL` error occurs.

  As specified in the GeoJSON specification, parsing is case-sensitive for the `type` member of the GeoJSON input (`Point`, `LineString`, and so forth). The specification is silent regarding case sensitivity for other parsing, which in MySQL is not case-sensitive.

  This example shows the parsing result for a simple GeoJSON object. Observe that the order of coordinates depends on the SRID used.

  ```
  mysql> SET @json = '{ "type": "Point", "coordinates": [102.0, 0.0]}';
  mysql> SELECT ST_AsText(ST_GeomFromGeoJSON(@json));
  +--------------------------------------+
  | ST_AsText(ST_GeomFromGeoJSON(@json)) |
  +--------------------------------------+
  | POINT(0 102)                         |
  +--------------------------------------+
  mysql> SELECT ST_SRID(ST_GeomFromGeoJSON(@json));
  +------------------------------------+
  | ST_SRID(ST_GeomFromGeoJSON(@json)) |
  +------------------------------------+
  |                               4326 |
  +------------------------------------+
  mysql> SELECT ST_AsText(ST_SRID(ST_GeomFromGeoJSON(@json),0));
  +-------------------------------------------------+
  | ST_AsText(ST_SRID(ST_GeomFromGeoJSON(@json),0)) |
  +-------------------------------------------------+
  | POINT(102 0)                                    |
  +-------------------------------------------------+
  ```


### 14.16.12 Spatial Aggregate Functions

MySQL supports aggregate functions that perform a calculation on a set of values. For general information about these functions, see Section 14.19.1, “Aggregate Function Descriptions”. This section describes the `ST_Collect()` spatial aggregate function.

`ST_Collect()` can be used as a window function, as signified in its syntax description by `[over_clause]`, representing an optional `OVER` clause. *`over_clause`* is described in Section 14.20.2, “Window Function Concepts and Syntax”, which also includes other information about window function usage.

* [`ST_Collect([DISTINCT] g) [over_clause]`](spatial-aggregate-functions.html#function_st-collect)

  Aggregates geometry values and returns a single geometry collection value. With the `DISTINCT` option, returns the aggregation of the distinct geometry arguments.

  As with other aggregate functions, `GROUP BY` may be used to group arguments into subsets. `ST_Collect()` returns an aggregate value for each subset.

  This function executes as a window function if *`over_clause`* is present. *`over_clause`* is as described in Section 14.20.2, “Window Function Concepts and Syntax”. In contrast to most aggregate functions that support windowing, `ST_Collect()` permits use of *`over_clause`* together with `DISTINCT`.

  `ST_Collect()` handles its arguments as follows:

  + `NULL` arguments are ignored.
  + If all arguments are `NULL` or the aggregate result is empty, the return value is `NULL`.

  + If any geometry argument is not a syntactically well-formed geometry, an `ER_GIS_INVALID_DATA` error occurs.

  + If any geometry argument is a syntactically well-formed geometry in an undefined spatial reference system (SRS), an `ER_SRS_NOT_FOUND` error occurs.

  + If there are multiple geometry arguments and those arguments are in the same SRS, the return value is in that SRS. If those arguments are not in the same SRS, an `ER_GIS_DIFFERENT_SRIDS_AGGREGATION` error occurs.

  + The result is the narrowest `MultiXxx` or `GeometryCollection` value possible, with the result type determined from the non-`NULL` geometry arguments as follows:

    - If all arguments are `Point` values, the result is a `MultiPoint` value.

    - If all arguments are `LineString` values, the result is a `MultiLineString` value.

    - If all arguments are `Polygon` values, the result is a `MultiPolygon` value.

    - Otherwise, the arguments are a mix of geometry types and the result is a `GeometryCollection` value.

  This example data set shows hypothetical products by year and location of manufacture:

  ```
  CREATE TABLE product (
    year INTEGER,
    product VARCHAR(256),
    location Geometry
  );

  INSERT INTO product
  (year,  product,     location) VALUES
  (2000, "Calculator", ST_GeomFromText('point(60 -24)',4326)),
  (2000, "Computer"  , ST_GeomFromText('point(28 -77)',4326)),
  (2000, "Abacus"    , ST_GeomFromText('point(28 -77)',4326)),
  (2000, "TV"        , ST_GeomFromText('point(38  60)',4326)),
  (2001, "Calculator", ST_GeomFromText('point(60 -24)',4326)),
  (2001, "Computer"  , ST_GeomFromText('point(28 -77)',4326));
  ```

  Some sample queries using `ST_Collect()` on the data set:

  ```
  mysql> SELECT ST_AsText(ST_Collect(location)) AS result
         FROM product;
  +------------------------------------------------------------------+
  | result                                                           |
  +------------------------------------------------------------------+
  | MULTIPOINT((60 -24),(28 -77),(28 -77),(38 60),(60 -24),(28 -77)) |
  +------------------------------------------------------------------+

  mysql> SELECT ST_AsText(ST_Collect(DISTINCT location)) AS result
         FROM product;
  +---------------------------------------+
  | result                                |
  +---------------------------------------+
  | MULTIPOINT((60 -24),(28 -77),(38 60)) |
  +---------------------------------------+

  mysql> SELECT year, ST_AsText(ST_Collect(location)) AS result
         FROM product GROUP BY year;
  +------+------------------------------------------------+
  | year | result                                         |
  +------+------------------------------------------------+
  | 2000 | MULTIPOINT((60 -24),(28 -77),(28 -77),(38 60)) |
  | 2001 | MULTIPOINT((60 -24),(28 -77))                  |
  +------+------------------------------------------------+

  mysql> SELECT year, ST_AsText(ST_Collect(DISTINCT location)) AS result
         FROM product GROUP BY year;
  +------+---------------------------------------+
  | year | result                                |
  +------+---------------------------------------+
  | 2000 | MULTIPOINT((60 -24),(28 -77),(38 60)) |
  | 2001 | MULTIPOINT((60 -24),(28 -77))         |
  +------+---------------------------------------+

  # selects nothing
  mysql> SELECT ST_Collect(location) AS result
         FROM product WHERE year = 1999;
  +--------+
  | result |
  +--------+
  | NULL   |
  +--------+

  mysql> SELECT ST_AsText(ST_Collect(location)
           OVER (ORDER BY year, product ROWS BETWEEN 1 PRECEDING AND CURRENT ROW))
           AS result
         FROM product;
  +-------------------------------+
  | result                        |
  +-------------------------------+
  | MULTIPOINT((28 -77))          |
  | MULTIPOINT((28 -77),(60 -24)) |
  | MULTIPOINT((60 -24),(28 -77)) |
  | MULTIPOINT((28 -77),(38 60))  |
  | MULTIPOINT((38 60),(60 -24))  |
  | MULTIPOINT((60 -24),(28 -77)) |
  +-------------------------------+
  ```

  This function was added in MySQL 8.0.24.


### 14.16.13 Spatial Convenience Functions

The functions in this section provide convenience operations on geometry values.

Unless otherwise specified, functions in this section handle their geometry arguments as follows:

* If any argument is `NULL`, the return value is `NULL`.

* If any geometry argument is not a syntactically well-formed geometry, an `ER_GIS_INVALID_DATA` error occurs.

* If any geometry argument is a syntactically well-formed geometry in an undefined spatial reference system (SRS), an `ER_SRS_NOT_FOUND` error occurs.

* For functions that take multiple geometry arguments, if those arguments are not in the same SRS, an `ER_GIS_DIFFERENT_SRIDS` error occurs.

* Otherwise, the return value is non-`NULL`.

These convenience functions are available:

* [`ST_Distance_Sphere(g1, g2 [, radius])`](spatial-convenience-functions.html#function_st-distance-sphere)

  Returns the minimum spherical distance between `Point` or `MultiPoint` arguments on a sphere, in meters. (For general-purpose distance calculations, see the `ST_Distance()` function.) The optional *`radius`* argument should be given in meters.

  If both geometry parameters are valid Cartesian `Point` or `MultiPoint` values in SRID 0, the return value is shortest distance between the two geometries on a sphere with the provided radius. If omitted, the default radius is 6,370,986 meters, Point X and Y coordinates are interpreted as longitude and latitude, respectively, in degrees.

  If both geometry parameters are valid `Point` or `MultiPoint` values in a geographic spatial reference system (SRS), the return value is the shortest distance between the two geometries on a sphere with the provided radius. If omitted, the default radius is equal to the mean radius, defined as (2a+b)/3, where a is the semi-major axis and b is the semi-minor axis of the SRS.

  `ST_Distance_Sphere()` handles its arguments as described in the introduction to this section, with these exceptions:

  + Supported geometry argument combinations are `Point` and `Point`, or `Point` and `MultiPoint` (in any argument order). If at least one of the geometries is neither `Point` nor `MultiPoint`, and its SRID is 0, an `ER_NOT_IMPLEMENTED_FOR_CARTESIAN_SRS` error occurs. If at least one of the geometries is neither `Point` nor `MultiPoint`, and its SRID refers to a geographic SRS, an `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS` error occurs. If any geometry refers to a projected SRS, an `ER_NOT_IMPLEMENTED_FOR_PROJECTED_SRS` error occurs.

  + If any argument has a longitude or latitude that is out of range, an error occurs:

    - If a longitude value is not in the range (−180, 180], an `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE` error occurs (`ER_LONGITUDE_OUT_OF_RANGE` prior to MySQL 8.0.12).

    - If a latitude value is not in the range [−90, 90], an `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE` error occurs (`ER_LATITUDE_OUT_OF_RANGE` prior to MySQL 8.0.12).

    Ranges shown are in degrees. If an SRS uses another unit, the range uses the corresponding values in its unit. The exact range limits deviate slightly due to floating-point arithmetic.

  + If the *`radius`* argument is present but not positive, an `ER_NONPOSITIVE_RADIUS` error occurs.

  + If the distance exceeds the range of a double-precision number, an `ER_STD_OVERFLOW_ERROR` error occurs.

  ```
  mysql> SET @pt1 = ST_GeomFromText('POINT(0 0)');
  mysql> SET @pt2 = ST_GeomFromText('POINT(180 0)');
  mysql> SELECT ST_Distance_Sphere(@pt1, @pt2);
  +--------------------------------+
  | ST_Distance_Sphere(@pt1, @pt2) |
  +--------------------------------+
  |             20015042.813723423 |
  +--------------------------------+
  ```

* `ST_IsValid(g)`

  Returns 1 if the argument is geometrically valid, 0 if the argument is not geometrically valid. Geometry validity is defined by the OGC specification.

  The only valid empty geometry is represented in the form of an empty geometry collection value. `ST_IsValid()` returns 1 in this case. MySQL does not support GIS `EMPTY` values such as `POINT EMPTY`.

  `ST_IsValid()` handles its arguments as described in the introduction to this section, with this exception:

  + If the geometry has a geographic SRS with a longitude or latitude that is out of range, an error occurs:

    - If a longitude value is not in the range (−180, 180], an `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE` error occurs (`ER_LONGITUDE_OUT_OF_RANGE` prior to MySQL 8.0.12).

    - If a latitude value is not in the range [−90, 90], an `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE` error occurs (`ER_LATITUDE_OUT_OF_RANGE` prior to MySQL 8.0.12).

    Ranges shown are in degrees. If an SRS uses another unit, the range uses the corresponding values in its unit. The exact range limits deviate slightly due to floating-point arithmetic.

  ```
  mysql> SET @ls1 = ST_GeomFromText('LINESTRING(0 0,-0.00 0,0.0 0)');
  mysql> SET @ls2 = ST_GeomFromText('LINESTRING(0 0, 1 1)');
  mysql> SELECT ST_IsValid(@ls1);
  +------------------+
  | ST_IsValid(@ls1) |
  +------------------+
  |                0 |
  +------------------+
  mysql> SELECT ST_IsValid(@ls2);
  +------------------+
  | ST_IsValid(@ls2) |
  +------------------+
  |                1 |
  +------------------+
  ```

* [`ST_MakeEnvelope(pt1, pt2)`](spatial-convenience-functions.html#function_st-makeenvelope)

  Returns the rectangle that forms the envelope around two points, as a `Point`, `LineString`, or `Polygon`.

  Calculations are done using the Cartesian coordinate system rather than on a sphere, spheroid, or on earth.

  Given two points *`pt1`* and *`pt2`*, `ST_MakeEnvelope()` creates the result geometry on an abstract plane like this:

  + If *`pt1`* and *`pt2`* are equal, the result is the point *`pt1`*.

  + Otherwise, if `(pt1, pt2)` is a vertical or horizontal line segment, the result is the line segment `(pt1, pt2)`.

  + Otherwise, the result is a polygon using *`pt1`* and *`pt2`* as diagonal points.

  The result geometry has an SRID of 0.

  `ST_MakeEnvelope()` handles its arguments as described in the introduction to this section, with these exceptions:

  + If the arguments are not `Point` values, an `ER_WRONG_ARGUMENTS` error occurs.

  + An `ER_GIS_INVALID_DATA` error occurs for the additional condition that any coordinate value of the two points is infinite or `NaN`.

  + If any geometry has an SRID value for a geographic spatial reference system (SRS), an `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS` error occurs.

  ```
  mysql> SET @pt1 = ST_GeomFromText('POINT(0 0)');
  mysql> SET @pt2 = ST_GeomFromText('POINT(1 1)');
  mysql> SELECT ST_AsText(ST_MakeEnvelope(@pt1, @pt2));
  +----------------------------------------+
  | ST_AsText(ST_MakeEnvelope(@pt1, @pt2)) |
  +----------------------------------------+
  | POLYGON((0 0,1 0,1 1,0 1,0 0))         |
  +----------------------------------------+
  ```

* [`ST_Simplify(g, max_distance)`](spatial-convenience-functions.html#function_st-simplify)

  Simplifies a geometry using the Douglas-Peucker algorithm and returns a simplified value of the same type.

  The geometry may be any geometry type, although the Douglas-Peucker algorithm may not actually process every type. A geometry collection is processed by giving its components one by one to the simplification algorithm, and the returned geometries are put into a geometry collection as result.

  The *`max_distance`* argument is the distance (in units of the input coordinates) of a vertex to other segments to be removed. Vertices within this distance of the simplified linestring are removed.

  According to Boost.Geometry, geometries might become invalid as a result of the simplification process, and the process might create self-intersections. To check the validity of the result, pass it to `ST_IsValid()`.

  `ST_Simplify()` handles its arguments as described in the introduction to this section, with this exception:

  + If the *`max_distance`* argument is not positive, or is `NaN`, an `ER_WRONG_ARGUMENTS` error occurs.

  ```
  mysql> SET @g = ST_GeomFromText('LINESTRING(0 0,0 1,1 1,1 2,2 2,2 3,3 3)');
  mysql> SELECT ST_AsText(ST_Simplify(@g, 0.5));
  +---------------------------------+
  | ST_AsText(ST_Simplify(@g, 0.5)) |
  +---------------------------------+
  | LINESTRING(0 0,0 1,1 1,2 3,3 3) |
  +---------------------------------+
  mysql> SELECT ST_AsText(ST_Simplify(@g, 1.0));
  +---------------------------------+
  | ST_AsText(ST_Simplify(@g, 1.0)) |
  +---------------------------------+
  | LINESTRING(0 0,3 3)             |
  +---------------------------------+
  ```

* `ST_Validate(g)`

  Validates a geometry according to the OGC specification. A geometry can be syntactically well-formed (WKB value plus SRID) but geometrically invalid. For example, this polygon is geometrically invalid: `POLYGON((0 0, 0 0, 0 0, 0 0, 0 0))`

  `ST_Validate()` returns the geometry if it is syntactically well-formed and is geometrically valid, `NULL` if the argument is not syntactically well-formed or is not geometrically valid or is `NULL`.

  `ST_Validate()` can be used to filter out invalid geometry data, although at a cost. For applications that require more precise results not tainted by invalid data, this penalty may be worthwhile.

  If the geometry argument is valid, it is returned as is, except that if an input `Polygon` or `MultiPolygon` has clockwise rings, those rings are reversed before checking for validity. If the geometry is valid, the value with the reversed rings is returned.

  The only valid empty geometry is represented in the form of an empty geometry collection value. `ST_Validate()` returns it directly without further checks in this case.

  As of MySQL 8.0.13, `ST_Validate()` handles its arguments as described in the introduction to this section, with these exceptions:

  + If the geometry has a geographic SRS with a longitude or latitude that is out of range, an error occurs:

    - If a longitude value is not in the range (−180, 180], an `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE` error occurs (`ER_LONGITUDE_OUT_OF_RANGE` prior to MySQL 8.0.12).

    - If a latitude value is not in the range [−90, 90], an `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE` error occurs (`ER_LATITUDE_OUT_OF_RANGE` prior to MySQL 8.0.12).

    Ranges shown are in degrees. The exact range limits deviate slightly due to floating-point arithmetic.

  Prior to MySQL 8.0.13, `ST_Validate()` handles its arguments as described in the introduction to this section, with these exceptions:

  + If the geometry is not syntactically well-formed, the return value is `NULL`. An `ER_GIS_INVALID_DATA` error does not occur.

  + If the geometry has an SRID value for a geographic spatial reference system (SRS), an `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS` error occurs.

  ```
  mysql> SET @ls1 = ST_GeomFromText('LINESTRING(0 0)');
  mysql> SET @ls2 = ST_GeomFromText('LINESTRING(0 0, 1 1)');
  mysql> SELECT ST_AsText(ST_Validate(@ls1));
  +------------------------------+
  | ST_AsText(ST_Validate(@ls1)) |
  +------------------------------+
  | NULL                         |
  +------------------------------+
  mysql> SELECT ST_AsText(ST_Validate(@ls2));
  +------------------------------+
  | ST_AsText(ST_Validate(@ls2)) |
  +------------------------------+
  | LINESTRING(0 0,1 1)          |
  +------------------------------+
  ```
