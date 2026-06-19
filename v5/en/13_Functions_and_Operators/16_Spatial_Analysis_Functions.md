## 12.16 Spatial Analysis Functions

MySQL provides functions to perform various operations on spatial data. These functions can be grouped into several major categories according to the type of operation they perform:

* Functions that create geometries in various formats (WKT, WKB, internal)

* Functions that convert geometries between formats
* Functions that access qualitative or quantitative properties of a geometry

* Functions that describe relations between two geometries
* Functions that create new geometries from existing ones

For general background about MySQL support for using spatial data, see Section 11.4, “Spatial Data Types”.


### 12.16.1 Spatial Function Reference

The following table lists each spatial function and provides a short description of each one.

**Table 12.21 Spatial Functions**

<table frame="box" rules="all" summary="A reference that lists all spatial functions."><col style="width: 25%"/><col style="width: 62%"/><col style="width: 12%"/><thead><tr><th>Name</th> <th>Description</th> <th>Deprecated</th> </tr></thead><tbody><tr><th><code>Area()</code></th> <td> Return Polygon or MultiPolygon area </td> <td>Yes</td> </tr><tr><th><code>AsBinary()</code>, <code>AsWKB()</code></th> <td> Convert from internal geometry format to WKB </td> <td>Yes</td> </tr><tr><th><code>AsText()</code>, <code>AsWKT()</code></th> <td> Convert from internal geometry format to WKT </td> <td>Yes</td> </tr><tr><th><code>Buffer()</code></th> <td> Return geometry of points within given distance from geometry </td> <td>Yes</td> </tr><tr><th><code>Centroid()</code></th> <td> Return centroid as a point </td> <td>Yes</td> </tr><tr><th><code>Contains()</code></th> <td> Whether MBR of one geometry contains MBR of another </td> <td>Yes</td> </tr><tr><th><code>ConvexHull()</code></th> <td> Return convex hull of geometry </td> <td>Yes</td> </tr><tr><th><code>Crosses()</code></th> <td> Whether one geometry crosses another </td> <td>Yes</td> </tr><tr><th><code>Dimension()</code></th> <td> Dimension of geometry </td> <td>Yes</td> </tr><tr><th><code>Disjoint()</code></th> <td> Whether MBRs of two geometries are disjoint </td> <td>Yes</td> </tr><tr><th><code>EndPoint()</code></th> <td> End Point of LineString </td> <td>Yes</td> </tr><tr><th><code>Envelope()</code></th> <td> Return MBR of geometry </td> <td>Yes</td> </tr><tr><th><code>Equals()</code></th> <td> Whether MBRs of two geometries are equal </td> <td>Yes</td> </tr><tr><th><code>ExteriorRing()</code></th> <td> Return exterior ring of Polygon </td> <td>Yes</td> </tr><tr><th><code>GeomCollFromText()</code>, <code>GeometryCollectionFromText()</code></th> <td> Return geometry collection from WKT </td> <td>Yes</td> </tr><tr><th><code>GeomCollFromWKB()</code>, <code>GeometryCollectionFromWKB()</code></th> <td> Return geometry collection from WKB </td> <td>Yes</td> </tr><tr><th><code>GeometryCollection()</code></th> <td> Construct geometry collection from geometries </td> <td></td> </tr><tr><th><code>GeometryN()</code></th> <td> Return N-th geometry from geometry collection </td> <td>Yes</td> </tr><tr><th><code>GeometryType()</code></th> <td> Return name of geometry type </td> <td>Yes</td> </tr><tr><th><code>GeomFromText()</code>, <code>GeometryFromText()</code></th> <td> Return geometry from WKT </td> <td>Yes</td> </tr><tr><th><code>GeomFromWKB()</code>, <code>GeometryFromWKB()</code></th> <td> Return geometry from WKB </td> <td>Yes</td> </tr><tr><th><code>GLength()</code></th> <td> Return length of LineString </td> <td>Yes</td> </tr><tr><th><code>InteriorRingN()</code></th> <td> Return N-th interior ring of Polygon </td> <td>Yes</td> </tr><tr><th><code>Intersects()</code></th> <td> Whether MBRs of two geometries intersect </td> <td>Yes</td> </tr><tr><th><code>IsClosed()</code></th> <td> Whether a geometry is closed and simple </td> <td>Yes</td> </tr><tr><th><code>IsEmpty()</code></th> <td> Whether a geometry is empty </td> <td>Yes</td> </tr><tr><th><code>IsSimple()</code></th> <td> Whether a geometry is simple </td> <td>Yes</td> </tr><tr><th><code>LineFromText()</code>, <code>LineStringFromText()</code></th> <td> Construct LineString from WKT </td> <td>Yes</td> </tr><tr><th><code>LineFromWKB()</code>, <code>LineStringFromWKB()</code></th> <td> Construct LineString from WKB </td> <td>Yes</td> </tr><tr><th><code>LineString()</code></th> <td> Construct LineString from Point values </td> <td></td> </tr><tr><th><code>MBRContains()</code></th> <td> Whether MBR of one geometry contains MBR of another </td> <td></td> </tr><tr><th><code>MBRCoveredBy()</code></th> <td> Whether one MBR is covered by another </td> <td></td> </tr><tr><th><code>MBRCovers()</code></th> <td> Whether one MBR covers another </td> <td></td> </tr><tr><th><code>MBRDisjoint()</code></th> <td> Whether MBRs of two geometries are disjoint </td> <td></td> </tr><tr><th><code>MBREqual()</code></th> <td> Whether MBRs of two geometries are equal </td> <td>Yes</td> </tr><tr><th><code>MBREquals()</code></th> <td> Whether MBRs of two geometries are equal </td> <td></td> </tr><tr><th><code>MBRIntersects()</code></th> <td> Whether MBRs of two geometries intersect </td> <td></td> </tr><tr><th><code>MBROverlaps()</code></th> <td> Whether MBRs of two geometries overlap </td> <td></td> </tr><tr><th><code>MBRTouches()</code></th> <td> Whether MBRs of two geometries touch </td> <td></td> </tr><tr><th><code>MBRWithin()</code></th> <td> Whether MBR of one geometry is within MBR of another </td> <td></td> </tr><tr><th><code>MLineFromText()</code>, <code>MultiLineStringFromText()</code></th> <td> Construct MultiLineString from WKT </td> <td>Yes</td> </tr><tr><th><code>MLineFromWKB()</code>, <code>MultiLineStringFromWKB()</code></th> <td> Construct MultiLineString from WKB </td> <td>Yes</td> </tr><tr><th><code>MPointFromText()</code>, <code>MultiPointFromText()</code></th> <td> Construct MultiPoint from WKT </td> <td>Yes</td> </tr><tr><th><code>MPointFromWKB()</code>, <code>MultiPointFromWKB()</code></th> <td> Construct MultiPoint from WKB </td> <td>Yes</td> </tr><tr><th><code>MPolyFromText()</code>, <code>MultiPolygonFromText()</code></th> <td> Construct MultiPolygon from WKT </td> <td>Yes</td> </tr><tr><th><code>MPolyFromWKB()</code>, <code>MultiPolygonFromWKB()</code></th> <td> Construct MultiPolygon from WKB </td> <td>Yes</td> </tr><tr><th><code>MultiLineString()</code></th> <td> Contruct MultiLineString from LineString values </td> <td></td> </tr><tr><th><code>MultiPoint()</code></th> <td> Construct MultiPoint from Point values </td> <td></td> </tr><tr><th><code>MultiPolygon()</code></th> <td> Construct MultiPolygon from Polygon values </td> <td></td> </tr><tr><th><code>NumGeometries()</code></th> <td> Return number of geometries in geometry collection </td> <td>Yes</td> </tr><tr><th><code>NumInteriorRings()</code></th> <td> Return number of interior rings in Polygon </td> <td>Yes</td> </tr><tr><th><code>NumPoints()</code></th> <td> Return number of points in LineString </td> <td>Yes</td> </tr><tr><th><code>Overlaps()</code></th> <td> Whether MBRs of two geometries overlap </td> <td>Yes</td> </tr><tr><th><code>Point()</code></th> <td> Construct Point from coordinates </td> <td></td> </tr><tr><th><code>PointFromText()</code></th> <td> Construct Point from WKT </td> <td>Yes</td> </tr><tr><th><code>PointFromWKB()</code></th> <td> Construct Point from WKB </td> <td>Yes</td> </tr><tr><th><code>PointN()</code></th> <td> Return N-th point from LineString </td> <td>Yes</td> </tr><tr><th><code>PolyFromText()</code>, <code>PolygonFromText()</code></th> <td> Construct Polygon from WKT </td> <td>Yes</td> </tr><tr><th><code>PolyFromWKB()</code>, <code>PolygonFromWKB()</code></th> <td> Construct Polygon from WKB </td> <td>Yes</td> </tr><tr><th><code>Polygon()</code></th> <td> Construct Polygon from LineString arguments </td> <td></td> </tr><tr><th><code>Distance()</code></th> <td> The distance of one geometry from another </td> <td>Yes</td> </tr><tr><th><code>SRID()</code></th> <td> Return spatial reference system ID for geometry </td> <td>Yes</td> </tr><tr><th><code>ST_Area()</code></th> <td> Return Polygon or MultiPolygon area </td> <td></td> </tr><tr><th><code>ST_AsBinary()</code>, <code>ST_AsWKB()</code></th> <td> Convert from internal geometry format to WKB </td> <td></td> </tr><tr><th><code>ST_AsGeoJSON()</code></th> <td> Generate GeoJSON object from geometry </td> <td></td> </tr><tr><th><code>ST_AsText()</code>, <code>ST_AsWKT()</code></th> <td> Convert from internal geometry format to WKT </td> <td></td> </tr><tr><th><code>ST_Buffer()</code></th> <td> Return geometry of points within given distance from geometry </td> <td></td> </tr><tr><th><code>ST_Buffer_Strategy()</code></th> <td> Produce strategy option for ST_Buffer() </td> <td></td> </tr><tr><th><code>ST_Centroid()</code></th> <td> Return centroid as a point </td> <td></td> </tr><tr><th><code>ST_Contains()</code></th> <td> Whether one geometry contains another </td> <td></td> </tr><tr><th><code>ST_ConvexHull()</code></th> <td> Return convex hull of geometry </td> <td></td> </tr><tr><th><code>ST_Crosses()</code></th> <td> Whether one geometry crosses another </td> <td></td> </tr><tr><th><code>ST_Difference()</code></th> <td> Return point set difference of two geometries </td> <td></td> </tr><tr><th><code>ST_Dimension()</code></th> <td> Dimension of geometry </td> <td></td> </tr><tr><th><code>ST_Disjoint()</code></th> <td> Whether one geometry is disjoint from another </td> <td></td> </tr><tr><th><code>ST_Distance()</code></th> <td> The distance of one geometry from another </td> <td></td> </tr><tr><th><code>ST_Distance_Sphere()</code></th> <td> Minimum distance on earth between two geometries </td> <td></td> </tr><tr><th><code>ST_EndPoint()</code></th> <td> End Point of LineString </td> <td></td> </tr><tr><th><code>ST_Envelope()</code></th> <td> Return MBR of geometry </td> <td></td> </tr><tr><th><code>ST_Equals()</code></th> <td> Whether one geometry is equal to another </td> <td></td> </tr><tr><th><code>ST_ExteriorRing()</code></th> <td> Return exterior ring of Polygon </td> <td></td> </tr><tr><th><code>ST_GeoHash()</code></th> <td> Produce a geohash value </td> <td></td> </tr><tr><th><code>ST_GeomCollFromText()</code>, <code>ST_GeometryCollectionFromText()</code>, <code>ST_GeomCollFromTxt()</code></th> <td> Return geometry collection from WKT </td> <td></td> </tr><tr><th><code>ST_GeomCollFromWKB()</code>, <code>ST_GeometryCollectionFromWKB()</code></th> <td> Return geometry collection from WKB </td> <td></td> </tr><tr><th><code>ST_GeometryN()</code></th> <td> Return N-th geometry from geometry collection </td> <td></td> </tr><tr><th><code>ST_GeometryType()</code></th> <td> Return name of geometry type </td> <td></td> </tr><tr><th><code>ST_GeomFromGeoJSON()</code></th> <td> Generate geometry from GeoJSON object </td> <td></td> </tr><tr><th><code>ST_GeomFromText()</code>, <code>ST_GeometryFromText()</code></th> <td> Return geometry from WKT </td> <td></td> </tr><tr><th><code>ST_GeomFromWKB()</code>, <code>ST_GeometryFromWKB()</code></th> <td> Return geometry from WKB </td> <td></td> </tr><tr><th><code>ST_InteriorRingN()</code></th> <td> Return N-th interior ring of Polygon </td> <td></td> </tr><tr><th><code>ST_Intersection()</code></th> <td> Return point set intersection of two geometries </td> <td></td> </tr><tr><th><code>ST_Intersects()</code></th> <td> Whether one geometry intersects another </td> <td></td> </tr><tr><th><code>ST_IsClosed()</code></th> <td> Whether a geometry is closed and simple </td> <td></td> </tr><tr><th><code>ST_IsEmpty()</code></th> <td> Whether a geometry is empty </td> <td></td> </tr><tr><th><code>ST_IsSimple()</code></th> <td> Whether a geometry is simple </td> <td></td> </tr><tr><th><code>ST_IsValid()</code></th> <td> Whether a geometry is valid </td> <td></td> </tr><tr><th><code>ST_LatFromGeoHash()</code></th> <td> Return latitude from geohash value </td> <td></td> </tr><tr><th><code>ST_Length()</code></th> <td> Return length of LineString </td> <td></td> </tr><tr><th><code>ST_LineFromText()</code>, <code>ST_LineStringFromText()</code></th> <td> Construct LineString from WKT </td> <td></td> </tr><tr><th><code>ST_LineFromWKB()</code>, <code>ST_LineStringFromWKB()</code></th> <td> Construct LineString from WKB </td> <td></td> </tr><tr><th><code>ST_LongFromGeoHash()</code></th> <td> Return longitude from geohash value </td> <td></td> </tr><tr><th><code>ST_MakeEnvelope()</code></th> <td> Rectangle around two points </td> <td></td> </tr><tr><th><code>ST_MLineFromText()</code>, <code>ST_MultiLineStringFromText()</code></th> <td> Construct MultiLineString from WKT </td> <td></td> </tr><tr><th><code>ST_MLineFromWKB()</code>, <code>ST_MultiLineStringFromWKB()</code></th> <td> Construct MultiLineString from WKB </td> <td></td> </tr><tr><th><code>ST_MPointFromText()</code>, <code>ST_MultiPointFromText()</code></th> <td> Construct MultiPoint from WKT </td> <td></td> </tr><tr><th><code>ST_MPointFromWKB()</code>, <code>ST_MultiPointFromWKB()</code></th> <td> Construct MultiPoint from WKB </td> <td></td> </tr><tr><th><code>ST_MPolyFromText()</code>, <code>ST_MultiPolygonFromText()</code></th> <td> Construct MultiPolygon from WKT </td> <td></td> </tr><tr><th><code>ST_MPolyFromWKB()</code>, <code>ST_MultiPolygonFromWKB()</code></th> <td> Construct MultiPolygon from WKB </td> <td></td> </tr><tr><th><code>ST_NumGeometries()</code></th> <td> Return number of geometries in geometry collection </td> <td></td> </tr><tr><th><code>ST_NumInteriorRing()</code>, <code>ST_NumInteriorRings()</code></th> <td> Return number of interior rings in Polygon </td> <td></td> </tr><tr><th><code>ST_NumPoints()</code></th> <td> Return number of points in LineString </td> <td></td> </tr><tr><th><code>ST_Overlaps()</code></th> <td> Whether one geometry overlaps another </td> <td></td> </tr><tr><th><code>ST_PointFromGeoHash()</code></th> <td> Convert geohash value to POINT value </td> <td></td> </tr><tr><th><code>ST_PointFromText()</code></th> <td> Construct Point from WKT </td> <td></td> </tr><tr><th><code>ST_PointFromWKB()</code></th> <td> Construct Point from WKB </td> <td></td> </tr><tr><th><code>ST_PointN()</code></th> <td> Return N-th point from LineString </td> <td></td> </tr><tr><th><code>ST_PolyFromText()</code>, <code>ST_PolygonFromText()</code></th> <td> Construct Polygon from WKT </td> <td></td> </tr><tr><th><code>ST_PolyFromWKB()</code>, <code>ST_PolygonFromWKB()</code></th> <td> Construct Polygon from WKB </td> <td></td> </tr><tr><th><code>ST_Simplify()</code></th> <td> Return simplified geometry </td> <td></td> </tr><tr><th><code>ST_SRID()</code></th> <td> Return spatial reference system ID for geometry </td> <td></td> </tr><tr><th><code>ST_StartPoint()</code></th> <td> Start Point of LineString </td> <td></td> </tr><tr><th><code>ST_SymDifference()</code></th> <td> Return point set symmetric difference of two geometries </td> <td></td> </tr><tr><th><code>ST_Touches()</code></th> <td> Whether one geometry touches another </td> <td></td> </tr><tr><th><code>ST_Union()</code></th> <td> Return point set union of two geometries </td> <td></td> </tr><tr><th><code>ST_Validate()</code></th> <td> Return validated geometry </td> <td></td> </tr><tr><th><code>ST_Within()</code></th> <td> Whether one geometry is within another </td> <td></td> </tr><tr><th><code>ST_X()</code></th> <td> Return X coordinate of Point </td> <td></td> </tr><tr><th><code>ST_Y()</code></th> <td> Return Y coordinate of Point </td> <td></td> </tr><tr><th><code>StartPoint()</code></th> <td> Start Point of LineString </td> <td>Yes</td> </tr><tr><th><code>Touches()</code></th> <td> Whether one geometry touches another </td> <td>Yes</td> </tr><tr><th><code>Within()</code></th> <td> Whether MBR of one geometry is within MBR of another </td> <td>Yes</td> </tr><tr><th><code>X()</code></th> <td> Return X coordinate of Point </td> <td>Yes</td> </tr><tr><th><code>Y()</code></th> <td> Return Y coordinate of Point </td> <td>Yes</td> </tr></tbody></table>


### 12.16.2 Argument Handling by Spatial Functions

Spatial values, or geometries, have the properties described in Section 11.4.2.2, “Geometry Class”. The following discussion lists general spatial function argument-handling characteristics. Specific functions or groups of functions may have additional or different argument-handling characteristics, as discussed in the sections where those function descriptions occur. Where that is true, those descriptions take precedence over the general discussion here.

Spatial functions are defined only for valid geometry values. See Section 11.4.4, “Geometry Well-Formedness and Validity”.

The spatial reference identifier (SRID) of a geometry identifies the coordinate space in which the geometry is defined. In MySQL, the SRID value is an integer associated with the geometry value. The maximum usable SRID value is 232−1. If a larger value is given, only the lower 32 bits are used.

In MySQL, all computations are done assuming SRID 0, regardless of the actual SRID value. SRID 0 represents an infinite flat Cartesian plane with no units assigned to its axes. In the future, computations may use the specified SRID values. To ensure SRID 0 behavior, create geometry values using SRID 0. SRID 0 is the default for new geometry values if no SRID is specified.

Geometry values produced by any spatial function inherit the SRID of the geometry arguments.

The [Open Geospatial Consortium](http://www.opengeospatial.org) guidelines require that input polygons already be closed, so unclosed polygons are rejected as invalid rather than being closed.

Empty geometry-collection handling is as follows: An empty WKT input geometry collection may be specified as `'GEOMETRYCOLLECTION()'`. This is also the output WKT resulting from a spatial operation that produces an empty geometry collection.

During parsing of a nested geometry collection, the collection is flattened and its basic components are used in various GIS operations to compute results. This provides additional flexibility to users because it is unnecessary to be concerned about the uniqueness of geometry data. Nested geometry collections may be produced from nested GIS function calls without having to be explicitly flattened first.


### 12.16.3 Functions That Create Geometry Values from WKT Values

These functions take as arguments a Well-Known Text (WKT) representation and, optionally, a spatial reference system identifier (SRID). They return the corresponding geometry.

`ST_GeomFromText()` accepts a WKT value of any geometry type as its first argument. Other functions provide type-specific construction functions for construction of geometry values of each geometry type.

For a description of WKT format, see Well-Known Text (WKT) Format Format").

* [`GeomCollFromText(wkt [, srid])`](gis-wkt-functions.html#function_geomcollfromtext), [`GeometryCollectionFromText(wkt [, srid])`](gis-wkt-functions.html#function_geomcollfromtext)

  `ST_GeomCollFromText()`, `ST_GeometryCollectionFromText()`, `ST_GeomCollFromTxt()`, `GeomCollFromText()`, and `GeometryCollectionFromText()` are synonyms. For more information, see the description of `ST_GeomCollFromText()`.

  `GeomCollFromText()` and `GeometryCollectionFromText()` are deprecated; expect them to be removed in a future MySQL release. Use `ST_GeomCollFromText()` and `ST_GeometryCollectionFromText()` instead.

* [`GeomFromText(wkt [, srid])`](gis-wkt-functions.html#function_geomfromtext), [`GeometryFromText(wkt [, srid])`](gis-wkt-functions.html#function_geomfromtext)

  `ST_GeomFromText()`, `ST_GeometryFromText()`, `GeomFromText()`, and `GeometryFromText()` are synonyms. For more information, see the description of `ST_GeomFromText()`.

  `GeomFromText()` and `GeometryFromText()` are deprecated; expect them to be removed in a future MySQL release. Use `ST_GeomFromText()` and `ST_GeometryFromText()` instead.

* [`LineFromText(wkt [, srid])`](gis-wkt-functions.html#function_linefromtext), [`LineStringFromText(wkt [, srid])`](gis-wkt-functions.html#function_linefromtext)

  `ST_LineFromText()`, `ST_LineStringFromText()`, `LineFromText()`, and `LineStringFromText()` are synonyms. For more information, see the description of `ST_LineFromText()`.

  `LineFromText()` and `LineStringFromText()` are deprecated; expect them to be removed in a future MySQL release. Use `ST_LineFromText()` and `ST_LineStringFromText()` instead.

* [`MLineFromText(wkt [, srid])`](gis-wkt-functions.html#function_mlinefromtext), [`MultiLineStringFromText(wkt [, srid])`](gis-wkt-functions.html#function_mlinefromtext)

  `ST_MLineFromText()`, `ST_MultiLineStringFromText()`, `MLineFromText()`, and `MultiLineStringFromText()` are synonyms. For more information, see the description of `ST_MLineFromText()`.

  `MLineFromText()` and `MultiLineStringFromText()` are deprecated; expect them to be removed in a future MySQL release. Use `ST_MLineFromText()` and `ST_MultiLineStringFromText()` instead.

* [`MPointFromText(wkt [, srid])`](gis-wkt-functions.html#function_mpointfromtext), [`MultiPointFromText(wkt [, srid])`](gis-wkt-functions.html#function_mpointfromtext)

  `ST_MPointFromText()`, `ST_MultiPointFromText()`, `MPointFromText()`, and `MultiPointFromText()` are synonyms. For more information, see the description of `ST_MPointFromText()`.

  `MPointFromText()` and `MultiPointFromText()` are deprecated; expect them to be removed in a future MySQL release. Use `ST_MPointFromText()` and `ST_MultiPointFromText()` instead.

* [`MPolyFromText(wkt [, srid])`](gis-wkt-functions.html#function_mpolyfromtext), [`MultiPolygonFromText(wkt [, srid])`](gis-wkt-functions.html#function_mpolyfromtext)

  `ST_MPolyFromText()`, `ST_MultiPolygonFromText()`, `MPolyFromText()`, and `MultiPolygonFromText()` are synonyms. For more information, see the description of `ST_MPolyFromText()`.

  `MPolyFromText()` and `MultiPolygonFromText()` are deprecated; expect them to be removed in a future MySQL release. Use `ST_MPolyFromText()` and `ST_MultiPolygonFromText()` instead.

* [`PointFromText(wkt [, srid])`](gis-wkt-functions.html#function_pointfromtext)

  `ST_PointFromText()` and `PointFromText()` are synonyms. For more information, see the description of `ST_PointFromText()`.

  `PointFromText()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_PointFromText()` instead.

* [`PolyFromText(wkt [, srid])`](gis-wkt-functions.html#function_polyfromtext), [`PolygonFromText(wkt [, srid])`](gis-wkt-functions.html#function_polyfromtext)

  `ST_PolyFromText()`, `ST_PolygonFromText()`, `PolyFromText()`, and `PolygonFromText()` are synonyms. For more information, see the description of `ST_PolyFromText()`.

  `PolyFromText()` and `PolygonFromText()` are deprecated; expect them to be removed in a future MySQL release. Use `ST_PolyFromText()` and `ST_PolygonFromText()` instead.

* [`ST_GeomCollFromText(wkt [, srid])`](gis-wkt-functions.html#function_st-geomcollfromtext), [`ST_GeometryCollectionFromText(wkt [, srid])`](gis-wkt-functions.html#function_st-geomcollfromtext), [`ST_GeomCollFromTxt(wkt [, srid])`](gis-wkt-functions.html#function_st-geomcollfromtext)

  Constructs a `GeometryCollection` value using its WKT representation and SRID.

  If the geometry argument is `NULL` or not a syntactically well-formed geometry, or if the SRID argument is `NULL`, the return value is `NULL`.

  ```sql
  mysql> SET @g = "MULTILINESTRING((10 10, 11 11), (9 9, 10 10))";
  mysql> SELECT ST_AsText(ST_GeomCollFromText(@g));
  +--------------------------------------------+
  | ST_AsText(ST_GeomCollFromText(@g))         |
  +--------------------------------------------+
  | MULTILINESTRING((10 10,11 11),(9 9,10 10)) |
  +--------------------------------------------+
  ```

  `ST_GeomCollFromText()`, `ST_GeometryCollectionFromText()`, `ST_GeomCollFromTxt()`, `GeomCollFromText()`, and `GeometryCollectionFromText()` are synonyms.

* [`ST_GeomFromText(wkt [, srid])`](gis-wkt-functions.html#function_st-geomfromtext), [`ST_GeometryFromText(wkt [, srid])`](gis-wkt-functions.html#function_st-geomfromtext)

  Constructs a geometry value of any type using its WKT representation and SRID.

  If the geometry argument is `NULL` or not a syntactically well-formed geometry, or if the SRID argument is `NULL`, the return value is `NULL`.

  `ST_GeomFromText()`, `ST_GeometryFromText()`, `GeomFromText()`, and `GeometryFromText()` are synonyms.

* [`ST_LineFromText(wkt [, srid])`](gis-wkt-functions.html#function_st-linefromtext), [`ST_LineStringFromText(wkt [, srid])`](gis-wkt-functions.html#function_st-linefromtext)

  Constructs a `LineString` value using its WKT representation and SRID.

  If the geometry argument is `NULL` or not a syntactically well-formed geometry, or if the SRID argument is `NULL`, the return value is `NULL`.

  `ST_LineFromText()`, `ST_LineStringFromText()`, `LineFromText()`, and `LineStringFromText()` are synonyms.

* [`ST_MLineFromText(wkt [, srid])`](gis-wkt-functions.html#function_st-mlinefromtext), [`ST_MultiLineStringFromText(wkt [, srid])`](gis-wkt-functions.html#function_st-mlinefromtext)

  Constructs a `MultiLineString` value using its WKT representation and SRID.

  If the geometry argument is `NULL` or not a syntactically well-formed geometry, or if the SRID argument is `NULL`, the return value is `NULL`.

  `ST_MLineFromText()`, `ST_MultiLineStringFromText()`, `MLineFromText()`, and `MultiLineStringFromText()` are synonyms.

* [`ST_MPointFromText(wkt [, srid])`](gis-wkt-functions.html#function_st-mpointfromtext), [`ST_MultiPointFromText(wkt [, srid])`](gis-wkt-functions.html#function_st-mpointfromtext)

  Constructs a `MultiPoint` value using its WKT representation and SRID.

  If the geometry argument is `NULL` or not a syntactically well-formed geometry, or if the SRID argument is `NULL`, the return value is `NULL`.

  Functions such as `ST_MPointFromText()` and `ST_GeomFromText()` that accept WKT-format representations of `MultiPoint` values permit individual points within values to be surrounded by parentheses. For example, both of the following function calls are valid:

  ```sql
  ST_MPointFromText('MULTIPOINT (1 1, 2 2, 3 3)')
  ST_MPointFromText('MULTIPOINT ((1 1), (2 2), (3 3))')
  ```

  `ST_MPointFromText()`, `ST_MultiPointFromText()`, `MPointFromText()`, and `MultiPointFromText()` are synonyms.

* [`ST_MPolyFromText(wkt [, srid])`](gis-wkt-functions.html#function_st-mpolyfromtext), [`ST_MultiPolygonFromText(wkt [, srid])`](gis-wkt-functions.html#function_st-mpolyfromtext)

  Constructs a `MultiPolygon` value using its WKT representation and SRID.

  If the geometry argument is `NULL` or not a syntactically well-formed geometry, or if the SRID argument is `NULL`, the return value is `NULL`.

  `ST_MPolyFromText()`, `ST_MultiPolygonFromText()`, `MPolyFromText()`, and `MultiPolygonFromText()` are synonyms.

* [`ST_PointFromText(wkt [, srid])`](gis-wkt-functions.html#function_st-pointfromtext)

  Constructs a `Point` value using its WKT representation and SRID.

  If the geometry argument is `NULL` or not a syntactically well-formed geometry, or if the SRID argument is `NULL`, the return value is `NULL`.

  `ST_PointFromText()` and `PointFromText()` are synonyms.

* [`ST_PolyFromText(wkt [, srid])`](gis-wkt-functions.html#function_st-polyfromtext), [`ST_PolygonFromText(wkt [, srid])`](gis-wkt-functions.html#function_st-polyfromtext)

  Constructs a `Polygon` value using its WKT representation and SRID.

  If the geometry argument is `NULL` or not a syntactically well-formed geometry, or if the SRID argument is `NULL`, the return value is `NULL`.

  `ST_PolyFromText()`, `ST_PolygonFromText()`, `PolyFromText()`, and `PolygonFromText()` are synonyms.


### 12.16.4 Functions That Create Geometry Values from WKB Values

These functions take as arguments a `BLOB` containing a Well-Known Binary (WKB) representation and, optionally, a spatial reference system identifier (SRID). They return the corresponding geometry.

`ST_GeomFromWKB()` accepts a WKB value of any geometry type as its first argument. Other functions provide type-specific construction functions for construction of geometry values of each geometry type.

These functions also accept geometry objects as returned by the functions in Section 12.16.5, “MySQL-Specific Functions That Create Geometry Values”. Thus, those functions may be used to provide the first argument to the functions in this section. However, as of MySQL 5.7.19, use of geometry arguments is deprecated and generates a warning. Geometry arguments are not accepted in MySQL 8.0. To migrate calls from using geometry arguments to using WKB arguments, follow these guidelines:

For a description of WKB format, see Well-Known Binary (WKB) Format Format").

* Rewrite constructs such as `ST_GeomFromWKB(Point(0, 0))` as `Point(0, 0)`.

* Rewrite constructs such as `ST_GeomFromWKB(Point(0, 0), 4326)` as `ST_GeomFromWKB(ST_AsWKB(Point(0, 0)), 4326)`. (Alternatively, in MySQL 8.0, you can use `ST_SRID(Point(0, 0), 4326)`.)

* [`GeomCollFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_geomcollfromwkb), [`GeometryCollectionFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_geomcollfromwkb)

  `ST_GeomCollFromWKB()`, `ST_GeometryCollectionFromWKB()`, `GeomCollFromWKB()`, and `GeometryCollectionFromWKB()` are synonyms. For more information, see the description of `ST_GeomCollFromWKB()`.

  `GeomCollFromWKB()` and `GeometryCollectionFromWKB()` are deprecated; expect them to be removed in a future MySQL release. Use `ST_GeomCollFromWKB()` and `ST_GeometryCollectionFromWKB()` instead.

* [`GeomFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_geomfromwkb), [`GeometryFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_geomfromwkb)

  `ST_GeomFromWKB()`, `ST_GeometryFromWKB()`, `GeomFromWKB()`, and `GeometryFromWKB()` are synonyms. For more information, see the description of `ST_GeomFromWKB()`.

  `GeomFromWKB()` and `GeometryFromWKB()` are deprecated; expect them to be removed in a future MySQL release. Use `ST_GeomFromWKB()` and `ST_GeometryFromWKB()` instead.

* [`LineFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_linefromwkb), [`LineStringFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_linefromwkb)

  `ST_LineFromWKB()`, `ST_LineStringFromWKB()`, `LineFromWKB()`, and `LineStringFromWKB()` are synonyms. For more information, see the description of `ST_LineFromWKB()`.

  `LineFromWKB()` and `LineStringFromWKB()` are deprecated; expect them to be removed in a future MySQL release. Use `ST_LineFromWKB()` and `ST_LineStringFromWKB()` instead.

* [`MLineFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_mlinefromwkb), [`MultiLineStringFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_mlinefromwkb)

  `ST_MLineFromWKB()`, `ST_MultiLineStringFromWKB()`, `MLineFromWKB()`, and `MultiLineStringFromWKB()` are synonyms. For more information, see the description of `ST_MLineFromWKB()`.

  `MLineFromWKB()` and `MultiLineStringFromWKB()` are deprecated; expect them to be removed in a future MySQL release. Use `ST_MLineFromWKB()` and `ST_MultiLineStringFromWKB()` instead.

* [`MPointFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_mpointfromwkb), [`MultiPointFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_mpointfromwkb)

  `ST_MPointFromWKB()`, `ST_MultiPointFromWKB()`, `MPointFromWKB()`, and `MultiPointFromWKB()` are synonyms. For more information, see the description of `ST_MPointFromWKB()`.

  `MPointFromWKB()` and `MultiPointFromWKB()` are deprecated; expect them to be removed in a future MySQL release. Use `ST_MPointFromWKB()` and `ST_MultiPointFromWKB()` instead.

* [`MPolyFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_mpolyfromwkb), [`MultiPolygonFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_mpolyfromwkb)

  `ST_MPolyFromWKB()`, `ST_MultiPolygonFromWKB()`, `MPolyFromWKB()`, and `MultiPolygonFromWKB()` are synonyms. For more information, see the description of `ST_MPolyFromWKB()`.

  `MPolyFromWKB()` and `MultiPolygonFromWKB()` are deprecated; expect them to be removed in a future MySQL release. Use `ST_MPolyFromWKB()` and `ST_MultiPolygonFromWKB()` instead.

* [`PointFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_pointfromwkb)

  `ST_PointFromWKB()` and `PointFromWKB()` are synonyms. For more information, see the description of `ST_PointFromWKB()`.

  `PointFromWKB()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_PointFromWKB()` instead.

* [`PolyFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_polyfromwkb), [`PolygonFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_polyfromwkb)

  `ST_PolyFromWKB()`, `ST_PolygonFromWKB()`, `PolyFromWKB()`, and `PolygonFromWKB()` are synonyms. For more information, see the description of `ST_PolyFromWKB()`.

  `PolyFromWKB()` and `PolygonFromWKB()` are deprecated; expect them to be removed in a future MySQL release. Use `ST_PolyFromWKB()` and `ST_PolygonFromWKB()` instead.

* [`ST_GeomCollFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_st-geomcollfromwkb), [`ST_GeometryCollectionFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_st-geomcollfromwkb)

  Constructs a `GeometryCollection` value using its WKB representation and SRID.

  The result is `NULL` if the WKB or SRID argument is `NULL`.

  `ST_GeomCollFromWKB()`, `ST_GeometryCollectionFromWKB()`, `GeomCollFromWKB()`, and `GeometryCollectionFromWKB()` are synonyms.

* [`ST_GeomFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_st-geomfromwkb), [`ST_GeometryFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_st-geomfromwkb)

  Constructs a geometry value of any type using its WKB representation and SRID.

  The result is `NULL` if the WKB or SRID argument is `NULL`.

  `ST_GeomFromWKB()`, `ST_GeometryFromWKB()`, `GeomFromWKB()`, and `GeometryFromWKB()` are synonyms.

* [`ST_LineFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_st-linefromwkb), [`ST_LineStringFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_st-linefromwkb)

  Constructs a `LineString` value using its WKB representation and SRID.

  The result is `NULL` if the WKB or SRID argument is `NULL`.

  `ST_LineFromWKB()`, `ST_LineStringFromWKB()`, `LineFromWKB()`, and `LineStringFromWKB()` are synonyms.

* [`ST_MLineFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_st-mlinefromwkb), [`ST_MultiLineStringFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_st-mlinefromwkb)

  Constructs a `MultiLineString` value using its WKB representation and SRID.

  The result is `NULL` if the WKB or SRID argument is `NULL`.

  `ST_MLineFromWKB()`, `ST_MultiLineStringFromWKB()`, `MLineFromWKB()`, and `MultiLineStringFromWKB()` are synonyms.

* [`ST_MPointFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_st-mpointfromwkb), [`ST_MultiPointFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_st-mpointfromwkb)

  Constructs a `MultiPoint` value using its WKB representation and SRID.

  The result is `NULL` if the WKB or SRID argument is `NULL`.

  `ST_MPointFromWKB()`, `ST_MultiPointFromWKB()`, `MPointFromWKB()`, and `MultiPointFromWKB()` are synonyms.

* [`ST_MPolyFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_st-mpolyfromwkb), [`ST_MultiPolygonFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_st-mpolyfromwkb)

  Constructs a `MultiPolygon` value using its WKB representation and SRID.

  The result is `NULL` if the WKB or SRID argument is `NULL`.

  `ST_MPolyFromWKB()`, `ST_MultiPolygonFromWKB()`, `MPolyFromWKB()`, and `MultiPolygonFromWKB()` are synonyms.

* [`ST_PointFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_st-pointfromwkb)

  Constructs a `Point` value using its WKB representation and SRID.

  The result is `NULL` if the WKB or SRID argument is `NULL`.

  `ST_PointFromWKB()` and `PointFromWKB()` are synonyms.

* [`ST_PolyFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_st-polyfromwkb), [`ST_PolygonFromWKB(wkb [, srid])`](gis-wkb-functions.html#function_st-polyfromwkb)

  Constructs a `Polygon` value using its WKB representation and SRID.

  The result is `NULL` if the WKB or SRID argument is `NULL`.

  `ST_PolyFromWKB()`, `ST_PolygonFromWKB()`, `PolyFromWKB()`, and `PolygonFromWKB()` are synonyms.


### 12.16.5 MySQL-Specific Functions That Create Geometry Values

MySQL provides a set of useful nonstandard functions for creating geometry values. The functions described in this section are MySQL extensions to the OpenGIS specification.

These functions produce geometry objects from either WKB values or geometry objects as arguments. If any argument is not a proper WKB or geometry representation of the proper object type, the return value is `NULL`.

For example, you can insert the geometry return value from `Point()` directly into a `POINT` column:

```sql
INSERT INTO t1 (pt_col) VALUES(Point(1,2));
```

* [`GeometryCollection(g [, g] ...)`](gis-mysql-specific-functions.html#function_geometrycollection)

  Constructs a `GeometryCollection` value from the geometry arguments.

  `GeometryCollection()` returns all the proper geometries contained in the arguments even if a nonsupported geometry is present.

  `GeometryCollection()` with no arguments is permitted as a way to create an empty geometry.

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


### 12.16.6 Geometry Format Conversion Functions

MySQL supports the functions listed in this section for converting geometry values from internal geometry format to WKT or WKB format.

There are also functions to convert a string from WKT or WKB format to internal geometry format. See Section 12.16.3, “Functions That Create Geometry Values from WKT Values”, and Section 12.16.4, “Functions That Create Geometry Values from WKB Values”.

* `AsBinary(g)`, `AsWKB(g)`

  `ST_AsBinary()`, `ST_AsWKB()`, `AsBinary()`, and `AsWKB()` are synonyms. For more information, see the description of `ST_AsBinary()`.

  `AsBinary()` and `AsWKB()` are deprecated; expect them to be removed in a future MySQL release. Use `ST_AsBinary()` and `ST_AsWKB()` instead.

* `AsText(g)`, `AsWKT(g)`

  `ST_AsText()`, `ST_AsWKT()`, `AsText()`, and `AsWKT()` are synonyms. For more information, see the description of `ST_AsText()`.

  `AsText()` and `AsWKT()` are deprecated; expect them to be removed in a future MySQL release. Use `ST_AsText()` and `ST_AsWKT()` instead.

* `ST_AsBinary(g)`, `ST_AsWKB(g)`

  Converts a value in internal geometry format to its WKB representation and returns the binary result.

  If the argument is `NULL`, the return value is `NULL`. If the argument is not a syntactically well-formed geometry, an `ER_GIS_INVALID_DATA` error occurs.

  ```sql
  SELECT ST_AsBinary(g) FROM geom;
  ```

  `ST_AsBinary()`, `ST_AsWKB()`, `AsBinary()`, and `AsWKB()` are synonyms.

* `ST_AsText(g)`, `ST_AsWKT(g)`

  Converts a value in internal geometry format to its WKT representation and returns the string result.

  If the argument is `NULL`, the return value is `NULL`. If the argument is not a syntactically well-formed geometry, an `ER_GIS_INVALID_DATA` error occurs.

  ```sql
  mysql> SET @g = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_AsText(ST_GeomFromText(@g));
  +--------------------------------+
  | ST_AsText(ST_GeomFromText(@g)) |
  +--------------------------------+
  | LINESTRING(1 1,2 2,3 3)        |
  +--------------------------------+
  ```

  `ST_AsText()`, `ST_AsWKT()`, `AsText()`, and `AsWKT()` are synonyms.

  Output for `MultiPoint` values includes parentheses around each point. For example:

  ```sql
  mysql> SET @mp = 'MULTIPOINT(1 1, 2 2, 3 3)';
  mysql> SELECT ST_AsText(ST_GeomFromText(@mp));
  +---------------------------------+
  | ST_AsText(ST_GeomFromText(@mp)) |
  +---------------------------------+
  | MULTIPOINT((1 1),(2 2),(3 3))   |
  +---------------------------------+
  ```


### 12.16.7 Geometry Property Functions

Each function that belongs to this group takes a geometry value as its argument and returns some quantitative or qualitative property of the geometry. Some functions restrict their argument type. Such functions return `NULL` if the argument is of an incorrect geometry type. For example, the `ST_Area()` polygon function returns `NULL` if the object type is neither `Polygon` nor `MultiPolygon`.


#### 12.16.7.1 General Geometry Property Functions

The functions listed in this section do not restrict their argument and accept a geometry value of any type.

* `Dimension(g)`

  `ST_Dimension()` and `Dimension()` are synonyms. For more information, see the description of `ST_Dimension()`.

  `Dimension()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_Dimension()` instead.

* `Envelope(g)`

  `ST_Envelope()` and `Envelope()` are synonyms. For more information, see the description of `ST_Envelope()`.

  `Envelope()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_Envelope()` instead.

* `GeometryType(g)`

  `ST_GeometryType()` and `GeometryType()` are synonyms. For more information, see the description of `ST_GeometryType()`.

  `GeometryType()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_GeometryType()` instead.

* `IsEmpty(g)`

  `ST_IsEmpty()` and `IsEmpty()` are synonyms. For more information, see the description of `ST_IsEmpty()`.

  `IsEmpty()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_IsEmpty()` instead.

* `IsSimple(g)`

  `ST_IsSimple()` and `IsSimple()` are synonyms. For more information, see the description of `ST_IsSimple()`.

  `IsSimple()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_IsSimple()` instead.

* `SRID(g)`

  `ST_SRID()` and `SRID()` are synonyms. For more information, see the description of `ST_SRID()`.

  `SRID()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_SRID()` instead.

* `ST_Dimension(g)`

  Returns the inherent dimension of the geometry value *`g`*, or `NULL` if the argument is `NULL`. The dimension can be −1, 0, 1, or 2. The meaning of these values is given in Section 11.4.2.2, “Geometry Class”.

  ```sql
  mysql> SELECT ST_Dimension(ST_GeomFromText('LineString(1 1,2 2)'));
  +------------------------------------------------------+
  | ST_Dimension(ST_GeomFromText('LineString(1 1,2 2)')) |
  +------------------------------------------------------+
  |                                                    1 |
  +------------------------------------------------------+
  ```

  `ST_Dimension()` and `Dimension()` are synonyms.

* `ST_Envelope(g)`

  Returns the minimum bounding rectangle (MBR) for the geometry value *`g`*, or `NULL` if the argument is `NULL`. The result is returned as a `Polygon` value that is defined by the corner points of the bounding box:

  ```sql
  POLYGON((MINX MINY, MAXX MINY, MAXX MAXY, MINX MAXY, MINX MINY))
  ```

  ```sql
  mysql> SELECT ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,2 2)')));
  +----------------------------------------------------------------+
  | ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,2 2)'))) |
  +----------------------------------------------------------------+
  | POLYGON((1 1,2 1,2 2,1 2,1 1))                                 |
  +----------------------------------------------------------------+
  ```

  If the argument is a point or a vertical or horizontal line segment, `ST_Envelope()` returns the point or the line segment as its MBR rather than returning an invalid polygon:

  ```sql
  mysql> SELECT ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,1 2)')));
  +----------------------------------------------------------------+
  | ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,1 2)'))) |
  +----------------------------------------------------------------+
  | LINESTRING(1 1,1 2)                                            |
  +----------------------------------------------------------------+
  ```

  `ST_Envelope()` and `Envelope()` are synonyms.

* `ST_GeometryType(g)`

  Returns a binary string indicating the name of the geometry type of which the geometry instance *`g`* is a member, or `NULL` if the argument is `NULL`. The name corresponds to one of the instantiable `Geometry` subclasses.

  ```sql
  mysql> SELECT ST_GeometryType(ST_GeomFromText('POINT(1 1)'));
  +------------------------------------------------+
  | ST_GeometryType(ST_GeomFromText('POINT(1 1)')) |
  +------------------------------------------------+
  | POINT                                          |
  +------------------------------------------------+
  ```

  `ST_GeometryType()` and `GeometryType()` are synonyms.

* `ST_IsEmpty(g)`

  This function is a placeholder that returns 0 for any valid geometry value, 1 for any invalid geometry value, or `NULL` if the argument is `NULL`.

  MySQL does not support GIS `EMPTY` values such as `POINT EMPTY`.

  `ST_IsEmpty()` and `IsEmpty()` are synonyms.

* `ST_IsSimple(g)`

  Returns 1 if the geometry value *`g`* has no anomalous geometric points, such as self-intersection or self-tangency. `ST_IsSimple()` returns 0 if the argument is not simple, and `NULL` if the argument is `NULL`.

  The descriptions of the instantiable geometric classes given under Section 11.4.2, “The OpenGIS Geometry Model” includes the specific conditions that cause class instances to be classified as not simple.

  `ST_IsSimple()` and `IsSimple()` are synonyms.

* `ST_SRID(g)`

  Returns an integer indicating the spatial reference system ID associated with the geometry value *`g`*, or `NULL` if the argument is `NULL`.

  ```sql
  mysql> SELECT ST_SRID(ST_GeomFromText('LineString(1 1,2 2)',101));
  +-----------------------------------------------------+
  | ST_SRID(ST_GeomFromText('LineString(1 1,2 2)',101)) |
  +-----------------------------------------------------+
  |                                                 101 |
  +-----------------------------------------------------+
  ```

  `ST_SRID()` and `SRID()` are synonyms.


#### 12.16.7.2 Point Property Functions

A `Point` consists of X and Y coordinates, which may be obtained using the following functions:

* `ST_X(p)`

  Returns the X-coordinate value for the `Point` object *`p`* as a double-precision number.

  ```sql
  mysql> SELECT ST_X(Point(56.7, 53.34));
  +--------------------------+
  | ST_X(Point(56.7, 53.34)) |
  +--------------------------+
  |                     56.7 |
  +--------------------------+
  ```

  `ST_X()` and `X()` are synonyms.

* `ST_Y(p)`

  Returns the Y-coordinate value for the `Point` object *`p`* as a double-precision number.

  ```sql
  mysql> SELECT ST_Y(Point(56.7, 53.34));
  +--------------------------+
  | ST_Y(Point(56.7, 53.34)) |
  +--------------------------+
  |                    53.34 |
  +--------------------------+
  ```

  `ST_Y()` and `Y()` are synonyms.

* `X(p)`

  `ST_X()` and `X()` are synonyms. For more information, see the description of `ST_X()`.

  `X()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_X()` instead.

* `Y(p)`

  `ST_Y()` and `Y()` are synonyms. For more information, see the description of `ST_Y()`.

  `Y()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_Y()` instead.


#### 12.16.7.3 LineString and MultiLineString Property Functions

A `LineString` consists of `Point` values. You can extract particular points of a `LineString`, count the number of points that it contains, or obtain its length.

Some functions in this section also work for `MultiLineString` values.

* `EndPoint(ls)`

  `ST_EndPoint()` and `EndPoint()` are synonyms. For more information, see the description of `ST_EndPoint()`.

  `EndPoint()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_EndPoint()` instead.

* `GLength(ls)`

  `GLength()` is a nonstandard name. It corresponds to the OpenGIS `ST_Length()` function. (There is an existing SQL function `Length()` that calculates the length of string values.)

  `GLength()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_Length()` instead.

* `IsClosed(ls)`

  `ST_IsClosed()` and `IsClosed()` are synonyms. For more information, see the description of `ST_IsClosed()`.

  `IsClosed()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_IsClosed()` instead.

* `NumPoints(ls)`

  `ST_NumPoints()` and `NumPoints()` are synonyms. For more information, see the description of `ST_NumPoints()`.

  `NumPoints()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_NumPoints()` instead.

* [`PointN(ls, N)`](gis-linestring-property-functions.html#function_pointn)

  `ST_PointN()` and `PointN()` are synonyms. For more information, see the description of `ST_PointN()`.

  `PointN()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_PointN()` instead.

* `ST_EndPoint(ls)`

  Returns the `Point` that is the endpoint of the `LineString` value *`ls`*. If the argument is `NULL` or an empty geometry, the return value is `NULL`.

  ```sql
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_AsText(ST_EndPoint(ST_GeomFromText(@ls)));
  +----------------------------------------------+
  | ST_AsText(ST_EndPoint(ST_GeomFromText(@ls))) |
  +----------------------------------------------+
  | POINT(3 3)                                   |
  +----------------------------------------------+
  ```

  `ST_EndPoint()` and `EndPoint()` are synonyms.

* `ST_IsClosed(ls)`

  For a `LineString` value *`ls`*, `ST_IsClosed()` returns 1 if *`ls`* is closed (that is, its `ST_StartPoint()` and `ST_EndPoint()` values are the same). If the argument is `NULL` or an empty geometry, the return value is `NULL`.

  For a `MultiLineString` value *`ls`*, `ST_IsClosed()` returns 1 if *`ls`* is closed (that is, the `ST_StartPoint()` and `ST_EndPoint()` values are the same for each `LineString` in *`ls`*).

  `ST_IsClosed()` returns 0 if *`ls`* is not closed.

  ```sql
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

  `ST_IsClosed()` and `IsClosed()` are synonyms.

* `ST_Length(ls)`

  Returns a double-precision number indicating the length of the `LineString` or `MultiLineString` value *`ls`* in its associated spatial reference system. The length of a `MultiLineString` value is equal to the sum of the lengths of its elements. If the argument is `NULL` or an empty geometry, the return value is `NULL`.

  ```sql
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_Length(ST_GeomFromText(@ls));
  +---------------------------------+
  | ST_Length(ST_GeomFromText(@ls)) |
  +---------------------------------+
  |              2.8284271247461903 |
  +---------------------------------+

  mysql> SET @mls = 'MultiLineString((1 1,2 2,3 3),(4 4,5 5))';
  mysql> SELECT ST_Length(ST_GeomFromText(@mls));
  +----------------------------------+
  | ST_Length(ST_GeomFromText(@mls)) |
  +----------------------------------+
  |                4.242640687119286 |
  +----------------------------------+
  ```

  `ST_Length()` should be used in preference to `GLength()`, which has a nonstandard name.

* `ST_NumPoints(ls)`

  Returns the number of `Point` objects in the `LineString` value *`ls`*. If the argument is `NULL` or an empty geometry, the return value is `NULL`.

  ```sql
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_NumPoints(ST_GeomFromText(@ls));
  +------------------------------------+
  | ST_NumPoints(ST_GeomFromText(@ls)) |
  +------------------------------------+
  |                                  3 |
  +------------------------------------+
  ```

  `ST_NumPoints()` and `NumPoints()` are synonyms.

* [`ST_PointN(ls, N)`](gis-linestring-property-functions.html#function_st-pointn)

  Returns the *`N`*-th `Point` in the `Linestring` value *`ls`*. Points are numbered beginning with 1. If any argument is `NULL` or the geometry argument is an empty geometry, the return value is `NULL`.

  ```sql
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_AsText(ST_PointN(ST_GeomFromText(@ls),2));
  +----------------------------------------------+
  | ST_AsText(ST_PointN(ST_GeomFromText(@ls),2)) |
  +----------------------------------------------+
  | POINT(2 2)                                   |
  +----------------------------------------------+
  ```

  `ST_PointN()` and `PointN()` are synonyms.

* `ST_StartPoint(ls)`

  Returns the `Point` that is the start point of the `LineString` value *`ls`*. If the argument is `NULL` or an empty geometry, the return value is `NULL`.

  ```sql
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_AsText(ST_StartPoint(ST_GeomFromText(@ls)));
  +------------------------------------------------+
  | ST_AsText(ST_StartPoint(ST_GeomFromText(@ls))) |
  +------------------------------------------------+
  | POINT(1 1)                                     |
  +------------------------------------------------+
  ```

  `ST_StartPoint()` and `StartPoint()` are synonyms.

* `StartPoint(ls)`

  `ST_StartPoint()` and `StartPoint()` are synonyms. For more information, see the description of `ST_StartPoint()`.

  `StartPoint()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_StartPoint()` instead.


#### 12.16.7.4 Polygon and MultiPolygon Property Functions

Functions in this section return properties of `Polygon` or `MultiPolygon` values.

* `Area({poly|mpoly})`

  `ST_Area()` and `Area()` are synonyms. For more information, see the description of `ST_Area()`.

  `Area()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_Area()` instead.

* `Centroid({poly|mpoly})`

  `ST_Centroid()` and `Centroid()` are synonyms. For more information, see the description of `ST_Centroid()`.

  `Centroid()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_Centroid()` instead.

* `ExteriorRing(poly)`

  `ST_ExteriorRing()` and `ExteriorRing()` are synonyms. For more information, see the description of `ST_ExteriorRing()`.

  `ExteriorRing()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_ExteriorRing()` instead.

* [`InteriorRingN(poly, N)`](gis-polygon-property-functions.html#function_interiorringn)

  `ST_InteriorRingN()` and `InteriorRingN()` are synonyms. For more information, see the description of `ST_InteriorRingN()`.

  `InteriorRingN()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_InteriorRingN()` instead.

* `NumInteriorRings(poly)`

  `ST_NumInteriorRings()` and `NumInteriorRings()` are synonyms. For more information, see the description of `ST_NumInteriorRings()`.

  `NumInteriorRings()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_NumInteriorRings()` instead.

* `ST_Area({poly|mpoly})`

  Returns a double-precision number indicating the area of the `Polygon` or `MultiPolygon` argument, as measured in its spatial reference system. For arguments of dimension 0 or 1, the result is 0. If the argument is an empty geometry the return value is 0. If the argument is `NULL` the return value is `NULL`.

  The result is the sum of the area values of all components for a geometry collection. If a geometry collection is empty, its area is returned as 0.

  ```sql
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

  `ST_Area()` and `Area()` are synonyms.

* `ST_Centroid({poly|mpoly})`

  Returns the mathematical centroid for the `Polygon` or `MultiPolygon` argument as a `Point`. The result is not guaranteed to be on the `MultiPolygon`. If the argument is `NULL` or an empty geometry, the return value is `NULL`.

  This function processes geometry collections by computing the centroid point for components of highest dimension in the collection. Such components are extracted and made into a single `MultiPolygon`, `MultiLineString`, or `MultiPoint` for centroid computation. If the argument is an empty geometry collection, the return value is `NULL`.

  ```sql
  mysql> SET @poly =
         ST_GeomFromText('POLYGON((0 0,10 0,10 10,0 10,0 0),(5 5,7 5,7 7,5 7,5 5))');
  mysql> SELECT ST_GeometryType(@poly),ST_AsText(ST_Centroid(@poly));
  +------------------------+--------------------------------------------+
  | ST_GeometryType(@poly) | ST_AsText(ST_Centroid(@poly))              |
  +------------------------+--------------------------------------------+
  | POLYGON                | POINT(4.958333333333333 4.958333333333333) |
  +------------------------+--------------------------------------------+
  ```

  `ST_Centroid()` and `Centroid()` are synonyms.

* `ST_ExteriorRing(poly)`

  Returns the exterior ring of the `Polygon` value *`poly`* as a `LineString`. If the argument is `NULL` or an empty geometry, the return value is `NULL`.

  ```sql
  mysql> SET @poly =
         'Polygon((0 0,0 3,3 3,3 0,0 0),(1 1,1 2,2 2,2 1,1 1))';
  mysql> SELECT ST_AsText(ST_ExteriorRing(ST_GeomFromText(@poly)));
  +----------------------------------------------------+
  | ST_AsText(ST_ExteriorRing(ST_GeomFromText(@poly))) |
  +----------------------------------------------------+
  | LINESTRING(0 0,0 3,3 3,3 0,0 0)                    |
  +----------------------------------------------------+
  ```

  `ST_ExteriorRing()` and `ExteriorRing()` are synonyms.

* [`ST_InteriorRingN(poly, N)`](gis-polygon-property-functions.html#function_st-interiorringn)

  Returns the *`N`*-th interior ring for the `Polygon` value *`poly`* as a `LineString`. Rings are numbered beginning with 1. If the argument is `NULL` or an empty geometry, the return value is `NULL`.

  ```sql
  mysql> SET @poly =
         'Polygon((0 0,0 3,3 3,3 0,0 0),(1 1,1 2,2 2,2 1,1 1))';
  mysql> SELECT ST_AsText(ST_InteriorRingN(ST_GeomFromText(@poly),1));
  +-------------------------------------------------------+
  | ST_AsText(ST_InteriorRingN(ST_GeomFromText(@poly),1)) |
  +-------------------------------------------------------+
  | LINESTRING(1 1,1 2,2 2,2 1,1 1)                       |
  +-------------------------------------------------------+
  ```

  `ST_InteriorRingN()` and `InteriorRingN()` are synonyms.

* `ST_NumInteriorRing(poly)`, `ST_NumInteriorRings(poly)`

  Returns the number of interior rings in the `Polygon` value *`poly`*. If the argument is `NULL` or an empty geometry, the return value is `NULL`.

  ```sql
  mysql> SET @poly =
         'Polygon((0 0,0 3,3 3,3 0,0 0),(1 1,1 2,2 2,2 1,1 1))';
  mysql> SELECT ST_NumInteriorRings(ST_GeomFromText(@poly));
  +---------------------------------------------+
  | ST_NumInteriorRings(ST_GeomFromText(@poly)) |
  +---------------------------------------------+
  |                                           1 |
  +---------------------------------------------+
  ```

  `ST_NumInteriorRing()`, `ST_NumInteriorRings()`, and `NumInteriorRings()` are synonyms.


#### 12.16.7.5 GeometryCollection Property Functions

These functions return properties of `GeometryCollection` values.

* [`GeometryN(gc, N)`](gis-geometrycollection-property-functions.html#function_geometryn)

  `ST_GeometryN()` and `GeometryN()` are synonyms. For more information, see the description of `ST_GeometryN()`.

  `GeometryN()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_GeometryN()` instead.

* `NumGeometries(gc)`

  `ST_NumGeometries()` and `NumGeometries()` are synonyms. For more information, see the description of `ST_NumGeometries()`.

  `NumGeometries()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_NumGeometries()` instead.

* [`ST_GeometryN(gc, N)`](gis-geometrycollection-property-functions.html#function_st-geometryn)

  Returns the *`N`*-th geometry in the `GeometryCollection` value *`gc`*. Geometries are numbered beginning with 1. If any argument is `NULL` or the geometry argument is an empty geometry, the return value is `NULL`.

  ```sql
  mysql> SET @gc = 'GeometryCollection(Point(1 1),LineString(2 2, 3 3))';
  mysql> SELECT ST_AsText(ST_GeometryN(ST_GeomFromText(@gc),1));
  +-------------------------------------------------+
  | ST_AsText(ST_GeometryN(ST_GeomFromText(@gc),1)) |
  +-------------------------------------------------+
  | POINT(1 1)                                      |
  +-------------------------------------------------+
  ```

  `ST_GeometryN()` and `GeometryN()` are synonyms.

* `ST_NumGeometries(gc)`

  Returns the number of geometries in the `GeometryCollection` value *`gc`*. If the argument is `NULL` or an empty geometry, the return value is `NULL`.

  ```sql
  mysql> SET @gc = 'GeometryCollection(Point(1 1),LineString(2 2, 3 3))';
  mysql> SELECT ST_NumGeometries(ST_GeomFromText(@gc));
  +----------------------------------------+
  | ST_NumGeometries(ST_GeomFromText(@gc)) |
  +----------------------------------------+
  |                                      2 |
  +----------------------------------------+
  ```

  `ST_NumGeometries()` and `NumGeometries()` are synonyms.


### 12.16.8 Spatial Operator Functions

OpenGIS proposes a number of functions that can produce geometries. They are designed to implement spatial operators.

These functions support all argument type combinations except those that are inapplicable according to the [Open Geospatial Consortium](http://www.opengeospatial.org) specification.

In addition, Section 12.16.7, “Geometry Property Functions”, discusses several functions that construct new geometries from existing ones. See that section for descriptions of these functions:

* `ST_Envelope(g)`
* `ST_StartPoint(ls)`
* `ST_EndPoint(ls)`
* [`ST_PointN(ls, N)`](gis-linestring-property-functions.html#function_st-pointn)

* `ST_ExteriorRing(poly)`
* [`ST_InteriorRingN(poly, N)`](gis-polygon-property-functions.html#function_st-interiorringn)

* [`ST_GeometryN(gc, N)`](gis-geometrycollection-property-functions.html#function_st-geometryn)

These spatial operator functions are available:

* [`Buffer(g, d [, strategy1 [, strategy2 [, strategy3]]])`](spatial-operator-functions.html#function_buffer)

  `ST_Buffer()` and `Buffer()` are synonyms. For more information, see the description of `ST_Buffer()`.

  `Buffer()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_Buffer()` instead.

* `ConvexHull(g)`

  `ST_ConvexHull()` and `ConvexHull()` are synonyms. For more information, see the description of `ST_ConvexHull()`.

  `ConvexHull()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_ConvexHull()` instead.

* [`ST_Buffer(g, d [, strategy1 [, strategy2 [, strategy3]]])`](spatial-operator-functions.html#function_st-buffer)

  Returns a geometry that represents all points whose distance from the geometry value *`g`* is less than or equal to a distance of *`d`*, or `NULL` if any argument is `NULL`. The SRID of the geometry argument must be 0 because `ST_Buffer()` supports only the Cartesian coordinate system. If any geometry argument is not a syntactically well-formed geometry, an `ER_GIS_INVALID_DATA` error occurs.

  If the geometry argument is empty, `ST_Buffer()` returns an empty geometry.

  If the distance is 0, `ST_Buffer()` returns the geometry argument unchanged:

  ```sql
  mysql> SET @pt = ST_GeomFromText('POINT(0 0)');
  mysql> SELECT ST_AsText(ST_Buffer(@pt, 0));
  +------------------------------+
  | ST_AsText(ST_Buffer(@pt, 0)) |
  +------------------------------+
  | POINT(0 0)                   |
  +------------------------------+
  ```

  `ST_Buffer()` supports negative distances for `Polygon` and `MultiPolygon` values, and for geometry collections containing `Polygon` or `MultiPolygon` values. The result may be an empty geometry. An `ER_WRONG_ARGUMENTS` error occurs for `ST_Buffer()` with a negative distance for `Point`, `MultiPoint`, `LineString`, and `MultiLineString` values, and for geometry collections not containing any `Polygon` or `MultiPolygon` values.

  `ST_Buffer()` permits up to three optional strategy arguments following the distance argument. Strategies influence buffer computation. These arguments are byte string values produced by the `ST_Buffer_Strategy()` function, to be used for point, join, and end strategies:

  + Point strategies apply to `Point` and `MultiPoint` geometries. If no point strategy is specified, the default is [`ST_Buffer_Strategy('point_circle', 32)`](spatial-operator-functions.html#function_st-buffer-strategy).

  + Join strategies apply to `LineString`, `MultiLineString`, `Polygon`, and `MultiPolygon` geometries. If no join strategy is specified, the default is [`ST_Buffer_Strategy('join_round', 32)`](spatial-operator-functions.html#function_st-buffer-strategy).

  + End strategies apply to `LineString` and `MultiLineString` geometries. If no end strategy is specified, the default is [`ST_Buffer_Strategy('end_round', 32)`](spatial-operator-functions.html#function_st-buffer-strategy).

  Up to one strategy of each type may be specified, and they may be given in any order. If multiple strategies of a given type are specified, an `ER_WRONG_ARGUMENTS` error occurs.

  ```sql
  mysql> SET @pt = ST_GeomFromText('POINT(0 0)');
  mysql> SET @pt_strategy = ST_Buffer_Strategy('point_square');
  mysql> SELECT ST_AsText(ST_Buffer(@pt, 2, @pt_strategy));
  +--------------------------------------------+
  | ST_AsText(ST_Buffer(@pt, 2, @pt_strategy)) |
  +--------------------------------------------+
  | POLYGON((-2 -2,2 -2,2 2,-2 2,-2 -2))       |
  +--------------------------------------------+
  ```

  ```sql
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

  `ST_Buffer()` and `Buffer()` are synonyms.

* [`ST_Buffer_Strategy(strategy [, points_per_circle])`](spatial-operator-functions.html#function_st-buffer-strategy)

  This function returns a strategy byte string for use with `ST_Buffer()` to influence buffer computation. If any argument is `NULL`, the return value is `NULL`. If any argument is invalid, an `ER_WRONG_ARGUMENTS` error occurs.

  Information about strategies is available at Boost.org.

  The first argument must be a string indicating a strategy option:

  + For point strategies, permitted values are `'point_circle'` and `'point_square'`.

  + For join strategies, permitted values are `'join_round'` and `'join_miter'`.

  + For end strategies, permitted values are `'end_round'` and `'end_flat'`.

  If the first argument is `'point_circle'`, `'join_round'`, `'join_miter'`, or `'end_round'`, the *`points_per_circle`* argument must be given as a positive numeric value. The maximum *`points_per_circle`* value is the value of the `max_points_in_geometry` system variable. If the first argument is `'point_square'` or `'end_flat'`, the *`points_per_circle`* argument must not be given or an `ER_WRONG_ARGUMENTS` error occurs.

  For examples, see the description of `ST_Buffer()`.

* `ST_ConvexHull(g)`

  Returns a geometry that represents the convex hull of the geometry value *`g`*. If the argument is `NULL`, the return value is `NULL`.

  This function computes a geometry's convex hull by first checking whether its vertex points are colinear. The function returns a linear hull if so, a polygon hull otherwise. This function processes geometry collections by extracting all vertex points of all components of the collection, creating a `MultiPoint` value from them, and computing its convex hull. If the argument is an empty geometry collection, the return value is `NULL`.

  ```sql
  mysql> SET @g = 'MULTIPOINT(5 0,25 0,15 10,15 25)';
  mysql> SELECT ST_AsText(ST_ConvexHull(ST_GeomFromText(@g)));
  +-----------------------------------------------+
  | ST_AsText(ST_ConvexHull(ST_GeomFromText(@g))) |
  +-----------------------------------------------+
  | POLYGON((5 0,25 0,15 25,5 0))                 |
  +-----------------------------------------------+
  ```

  `ST_ConvexHull()` and `ConvexHull()` are synonyms.

* [`ST_Difference(g1, g2)`](spatial-operator-functions.html#function_st-difference)

  Returns a geometry that represents the point set difference of the geometry values *`g1`* and *`g2`*. If any argument is `NULL`, the return value is `NULL`.

  ```sql
  mysql> SET @g1 = Point(1,1), @g2 = Point(2,2);
  mysql> SELECT ST_AsText(ST_Difference(@g1, @g2));
  +------------------------------------+
  | ST_AsText(ST_Difference(@g1, @g2)) |
  +------------------------------------+
  | POINT(1 1)                         |
  +------------------------------------+
  ```

* [`ST_Intersection(g1, g2)`](spatial-operator-functions.html#function_st-intersection)

  Returns a geometry that represents the point set intersection of the geometry values *`g1`* and *`g2`*. If any argument is `NULL`, the return value is `NULL`.

  ```sql
  mysql> SET @g1 = ST_GeomFromText('LineString(1 1, 3 3)');
  mysql> SET @g2 = ST_GeomFromText('LineString(1 3, 3 1)');
  mysql> SELECT ST_AsText(ST_Intersection(@g1, @g2));
  +--------------------------------------+
  | ST_AsText(ST_Intersection(@g1, @g2)) |
  +--------------------------------------+
  | POINT(2 2)                           |
  +--------------------------------------+
  ```

* [`ST_SymDifference(g1, g2)`](spatial-operator-functions.html#function_st-symdifference)

  Returns a geometry that represents the point set symmetric difference of the geometry values *`g1`* and *`g2`*, which is defined as:

  ```sql
  g1 symdifference g2 := (g1 union g2) difference (g1 intersection g2)
  ```

  Or, in function call notation:

  ```sql
  ST_SymDifference(g1, g2) = ST_Difference(ST_Union(g1, g2), ST_Intersection(g1, g2))
  ```

  If any argument is `NULL`, the return value is `NULL`.

  ```sql
  mysql> SET @g1 = ST_GeomFromText('MULTIPOINT(5 0,15 10,15 25)');
  mysql> SET @g2 = ST_GeomFromText('MULTIPOINT(1 1,15 10,15 25)');
  mysql> SELECT ST_AsText(ST_SymDifference(@g1, @g2));
  +---------------------------------------+
  | ST_AsText(ST_SymDifference(@g1, @g2)) |
  +---------------------------------------+
  | MULTIPOINT((1 1),(5 0))               |
  +---------------------------------------+
  ```

* [`ST_Union(g1, g2)`](spatial-operator-functions.html#function_st-union)

  Returns a geometry that represents the point set union of the geometry values *`g1`* and *`g2`*. If any argument is `NULL`, the return value is `NULL`.

  ```sql
  mysql> SET @g1 = ST_GeomFromText('LineString(1 1, 3 3)');
  mysql> SET @g2 = ST_GeomFromText('LineString(1 3, 3 1)');
  mysql> SELECT ST_AsText(ST_Union(@g1, @g2));
  +--------------------------------------+
  | ST_AsText(ST_Union(@g1, @g2))        |
  +--------------------------------------+
  | MULTILINESTRING((1 1,3 3),(1 3,3 1)) |
  +--------------------------------------+
  ```


### 12.16.9 Functions That Test Spatial Relations Between Geometry Objects

The functions described in this section take two geometries as arguments and return a qualitative or quantitative relation between them.

MySQL implements two sets of functions using function names defined by the OpenGIS specification. One set tests the relationship between two geometry values using precise object shapes, the other set uses object minimum bounding rectangles (MBRs).

There is also a MySQL-specific set of MBR-based functions available to test the relationship between two geometry values.


#### 12.16.9.1 Spatial Relation Functions That Use Object Shapes

The OpenGIS specification defines the following functions to test the relationship between two geometry values *`g1`* and *`g2`*, using precise object shapes. The return values 1 and 0 indicate true and false, respectively, except for `ST_Distance()` and `Distance()`, which return distance values.

These functions support all argument type combinations except those that are inapplicable according to the Open Geospatial Consortium specification.

* [`Crosses(g1, g2)`](spatial-relation-functions-object-shapes.html#function_crosses)

  `ST_Crosses()` and `Crosses()` are synonyms. For more information, see the description of `ST_Crosses()`.

  `Crosses()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_Crosses()` instead.

* [`Distance(g1, g2)`](spatial-relation-functions-object-shapes.html#function_spatial-distance)

  `ST_Distance()` and `Distance()` are synonyms. For more information, see the description of `ST_Distance()`.

  `Distance()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_Distance()` instead.

* [`ST_Contains(g1, g2)`](spatial-relation-functions-object-shapes.html#function_st-contains)

  Returns 1 or 0 to indicate whether *`g1`* completely contains *`g2`*. This tests the opposite relationship as `ST_Within()`.

* [`ST_Crosses(g1, g2)`](spatial-relation-functions-object-shapes.html#function_st-crosses)

  The term *spatially crosses* denotes a spatial relation between two given geometries that has the following properties:

  + The two geometries intersect.
  + Their intersection results in a geometry that has a dimension that is one less than the maximum dimension of the two given geometries.

  + Their intersection is not equal to either of the two given geometries.

  This function returns 1 or 0 to indicate whether *`g1`* spatially crosses *`g2`*. If *`g1`* is a `Polygon` or a `MultiPolygon`, or if *`g2`* is a `Point` or a `MultiPoint`, the return value is `NULL`.

  This function returns 0 if called with an inapplicable geometry argument type combination. For example, it returns 0 if the first argument is a `Polygon` or `MultiPolygon` and/or the second argument is a `Point` or `MultiPoint`.

  Returns 1 if *`g1`* spatially crosses *`g2`*. Returns `NULL` if *`g1`* is a `Polygon` or a `MultiPolygon`, or if *`g2`* is a `Point` or a `MultiPoint`. Otherwise, returns 0.

  This function returns 0 if called with an inapplicable geometry argument type combination. For example, it returns 0 if the first argument is a `Polygon` or `MultiPolygon` and/or the second argument is a `Point` or `MultiPoint`.

  `ST_Crosses()` and `Crosses()` are synonyms.

* [`ST_Disjoint(g1, g2)`](spatial-relation-functions-object-shapes.html#function_st-disjoint)

  Returns 1 or 0 to indicate whether *`g1`* is spatially disjoint from (does not intersect) *`g2`*.

* [`ST_Distance(g1, g2)`](spatial-relation-functions-object-shapes.html#function_st-distance)

  Returns the distance between *`g1`* and *`g2`*. If either argument is `NULL` or an empty geometry, the return value is `NULL`.

  This function processes geometry collections by returning the shortest distance among all combinations of the components of the two geometry arguments.

  If an intermediate or final result produces NaN or a negative number, an `ER_GIS_INVALID_DATA` error occurs.

  ```sql
  mysql> SET @g1 = Point(1,1);
  mysql> SET @g2 = Point(2,2);
  mysql> SELECT ST_Distance(@g1, @g2);
  +-----------------------+
  | ST_Distance(@g1, @g2) |
  +-----------------------+
  |    1.4142135623730951 |
  +-----------------------+
  ```

  `ST_Distance()` and `Distance()` are synonyms.

* [`ST_Equals(g1, g2)`](spatial-relation-functions-object-shapes.html#function_st-equals)

  Returns 1 or 0 to indicate whether *`g1`* is spatially equal to *`g2`*.

  ```sql
  mysql> SET @g1 = Point(1,1), @g2 = Point(2,2);
  mysql> SELECT ST_Equals(@g1, @g1), ST_Equals(@g1, @g2);
  +---------------------+---------------------+
  | ST_Equals(@g1, @g1) | ST_Equals(@g1, @g2) |
  +---------------------+---------------------+
  |                   1 |                   0 |
  +---------------------+---------------------+
  ```

* [`ST_Intersects(g1, g2)`](spatial-relation-functions-object-shapes.html#function_st-intersects)

  Returns 1 or 0 to indicate whether *`g1`* spatially intersects *`g2`*.

* [`ST_Overlaps(g1, g2)`](spatial-relation-functions-object-shapes.html#function_st-overlaps)

  Two geometries *spatially overlap* if they intersect and their intersection results in a geometry of the same dimension but not equal to either of the given geometries.

  This function returns 1 or 0 to indicate whether *`g1`* spatially overlaps *`g2`*.

  This function returns 0 if called with an inapplicable geometry argument type combination. For example, it returns 0 if called with geometries of different dimensions or any argument is a `Point`.

* [`ST_Touches(g1, g2)`](spatial-relation-functions-object-shapes.html#function_st-touches)

  Two geometries *spatially touch* if their interiors do not intersect, but the boundary of one of the geometries intersects either the boundary or the interior of the other.

  This function returns 1 or 0 to indicate whether *`g1`* spatially touches *`g2`*.

  This function returns 0 if called with an inapplicable geometry argument type combination. For example, it returns 0 if either of the arguments is a `Point` or `MultiPoint`.

  `ST_Touches()` and `Touches()` are synonyms.

* [`ST_Within(g1, g2)`](spatial-relation-functions-object-shapes.html#function_st-within)

  Returns 1 or 0 to indicate whether *`g1`* is spatially within *`g2`*. This tests the opposite relationship as `ST_Contains()`.

* [`Touches(g1, g2)`](spatial-relation-functions-object-shapes.html#function_touches)

  `ST_Touches()` and `Touches()` are synonyms. For more information, see the description of `ST_Touches()`.

  `Touches()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_Touches()` instead.


#### 12.16.9.2 Spatial Relation Functions That Use Minimum Bounding Rectangles

MySQL provides several MySQL-specific functions that test the relationship between minimum bounding rectangles (MBRs) of two geometries *`g1`* and *`g2`*. The return values 1 and 0 indicate true and false, respectively.

A corresponding set of MBR functions defined according to the OpenGIS specification is described later in this section.

* [`MBRContains(g1, g2)`](spatial-relation-functions-mbr.html#function_mbrcontains)

  Returns 1 or 0 to indicate whether the minimum bounding rectangle of *`g1`* contains the minimum bounding rectangle of *`g2`*. This tests the opposite relationship as `MBRWithin()`.

  ```sql
  mysql> SET @g1 = ST_GeomFromText('Polygon((0 0,0 3,3 3,3 0,0 0))');
  mysql> SET @g2 = ST_GeomFromText('Point(1 1)');
  mysql> SELECT MBRContains(@g1,@g2), MBRWithin(@g2,@g1);
  +----------------------+--------------------+
  | MBRContains(@g1,@g2) | MBRWithin(@g2,@g1) |
  +----------------------+--------------------+
  |                    1 |                  1 |
  +----------------------+--------------------+
  ```

  `MBRContains()` and `Contains()` are synonyms.

* [`MBRCoveredBy(g1, g2)`](spatial-relation-functions-mbr.html#function_mbrcoveredby)

  Returns 1 or 0 to indicate whether the minimum bounding rectangle of *`g1`* is covered by the minimum bounding rectangle of *`g2`*. This tests the opposite relationship as `MBRCovers()`.

  `MBRCoveredBy()` handles its arguments as follows:

  + If either argument is `NULL` or an empty geometry, the return value is `NULL`.

  + If either argument is not a syntactically well-formed geometry byte string, an `ER_GIS_INVALID_DATA` error occurs.

  + Otherwise, the return value is non-`NULL`.

  ```sql
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

* [`MBRCovers(g1, g2)`](spatial-relation-functions-mbr.html#function_mbrcovers)

  Returns 1 or 0 to indicate whether the minimum bounding rectangle of *`g1`* covers the minimum bounding rectangle of *`g2`*. This tests the opposite relationship as `MBRCoveredBy()`. See the description of `MBRCoveredBy()` for examples.

  `MBRCovers()` handles its arguments as follows:

  + If either argument is `NULL` or an empty geometry, the return value is `NULL`.

  + If either argument is not a syntactically well-formed geometry byte string, an `ER_GIS_INVALID_DATA` error occurs.

  + Otherwise, the return value is non-`NULL`.

* [`MBRDisjoint(g1, g2)`](spatial-relation-functions-mbr.html#function_mbrdisjoint)

  Returns 1 or 0 to indicate whether the minimum bounding rectangles of the two geometries *`g1`* and *`g2`* are disjoint (do not intersect).

  `MBRDisjoint()` and `Disjoint()` are synonyms.

* [`MBREqual(g1, g2)`](spatial-relation-functions-mbr.html#function_mbrequal)

  Returns 1 or 0 to indicate whether the minimum bounding rectangles of the two geometries *`g1`* and *`g2`* are the same.

  `MBREqual()` is deprecated; expect it to be removed in a future MySQL release. Use `MBREquals()` instead.

* [`MBREquals(g1, g2)`](spatial-relation-functions-mbr.html#function_mbrequals)

  Returns 1 or 0 to indicate whether the minimum bounding rectangles of the two geometries *`g1`* and *`g2`* are the same.

  `MBREquals()`, `MBREqual()`, and `Equals()` are synonyms.

* [`MBRIntersects(g1, g2)`](spatial-relation-functions-mbr.html#function_mbrintersects)

  Returns 1 or 0 to indicate whether the minimum bounding rectangles of the two geometries *`g1`* and *`g2`* intersect.

  `MBRIntersects()` and `Intersects()` are synonyms.

* [`MBROverlaps(g1, g2)`](spatial-relation-functions-mbr.html#function_mbroverlaps)

  Two geometries *spatially overlap* if they intersect and their intersection results in a geometry of the same dimension but not equal to either of the given geometries.

  This function returns 1 or 0 to indicate whether the minimum bounding rectangles of the two geometries *`g1`* and *`g2`* overlap.

  `MBROverlaps()` and `Overlaps()` are synonyms.

* [`MBRTouches(g1, g2)`](spatial-relation-functions-mbr.html#function_mbrtouches)

  Two geometries *spatially touch* if their interiors do not intersect, but the boundary of one of the geometries intersects either the boundary or the interior of the other.

  This function returns 1 or 0 to indicate whether the minimum bounding rectangles of the two geometries *`g1`* and *`g2`* touch.

* [`MBRWithin(g1, g2)`](spatial-relation-functions-mbr.html#function_mbrwithin)

  Returns 1 or 0 to indicate whether the minimum bounding rectangle of *`g1`* is within the minimum bounding rectangle of *`g2`*. This tests the opposite relationship as `MBRContains()`.

  ```sql
  mysql> SET @g1 = ST_GeomFromText('Polygon((0 0,0 3,3 3,3 0,0 0))');
  mysql> SET @g2 = ST_GeomFromText('Polygon((0 0,0 5,5 5,5 0,0 0))');
  mysql> SELECT MBRWithin(@g1,@g2), MBRWithin(@g2,@g1);
  +--------------------+--------------------+
  | MBRWithin(@g1,@g2) | MBRWithin(@g2,@g1) |
  +--------------------+--------------------+
  |                  1 |                  0 |
  +--------------------+--------------------+
  ```

  `MBRWithin()` and `Within()` are synonyms.

The OpenGIS specification defines the following functions that test the relationship between two geometry values *`g1`* and *`g2`*. The MySQL implementation uses minimum bounding rectangles, so these functions return the same result as the corresponding MBR-based functions described earlier in this section. The return values 1 and 0 indicate true and false, respectively.

These functions support all argument type combinations except those that are inapplicable according to the Open Geospatial Consortium specification.

* [`Contains(g1, g2)`](spatial-relation-functions-mbr.html#function_contains)

  `MBRContains()` and `Contains()` are synonyms. For more information, see the description of `MBRContains()`.

  `Contains()` is deprecated; expect it to be removed in a future MySQL release. Use `MBRContains()` instead.

* [`Disjoint(g1, g2)`](spatial-relation-functions-mbr.html#function_disjoint)

  `MBRDisjoint()` and `Disjoint()` are synonyms. For more information, see the description of `MBRDisjoint()`.

  `Disjoint()` is deprecated; expect it to be removed in a future MySQL release. Use `MBRDisjoint()` instead.

* [`Equals(g1, g2)`](spatial-relation-functions-mbr.html#function_equals)

  `MBREquals()` and `Equals()` are synonyms. For more information, see the description of `MBREquals()`.

  `Equals()` is deprecated; expect it to be removed in a future MySQL release. Use `MBREquals()` instead.

* [`Intersects(g1, g2)`](spatial-relation-functions-mbr.html#function_intersects)

  `MBRIntersects()` and `Intersects()` are synonyms. For more information, see the description of `MBRIntersects()`.

  `Intersects()` is deprecated; expect it to be removed in a future MySQL release. Use `MBRIntersects()` instead.

* [`Overlaps(g1, g2)`](spatial-relation-functions-mbr.html#function_overlaps)

  `MBROverlaps()` and `Overlaps()` are synonyms. For more information, see the description of `MBROverlaps()`.

  `Overlaps()` is deprecated; expect it to be removed in a future MySQL release. Use `MBROverlaps()` instead.

* [`Within(g1, g2)`](spatial-relation-functions-mbr.html#function_within)

  `MBRWithin()` and `Within()` are synonyms. For more information, see the description of `MBRWithin()`.

  `Within()` is deprecated; expect it to be removed in a future MySQL release. Use `MBRWithin()` instead.


### 12.16.10 Spatial Geohash Functions

Geohash is a system for encoding latitude and longitude coordinates of arbitrary precision into a text string. Geohash values are strings that contain only characters chosen from `"0123456789bcdefghjkmnpqrstuvwxyz"`.

The functions in this section enable manipulation of geohash values, which provides applications the capabilities of importing and exporting geohash data, and of indexing and searching geohash values.

* [`ST_GeoHash(longitude, latitude, max_length)`](spatial-geohash-functions.html#function_st-geohash), [`ST_GeoHash(point, max_length)`](spatial-geohash-functions.html#function_st-geohash)

  Returns a geohash string in the connection character set and collation.

  If any argument is `NULL`, the return value is `NULL`. If any argument is invalid, an error occurs.

  For the first syntax, the *`longitude`* must be a number in the range [−180, 180], and the *`latitude`* must be a number in the range [−90, 90]. For the second syntax, a `POINT` value is required, where the X and Y coordinates are in the valid ranges for longitude and latitude, respectively.

  The resulting string is no longer than *`max_length`* characters, which has an upper limit of 100. The string might be shorter than *`max_length`* characters because the algorithm that creates the geohash value continues until it has created a string that is either an exact representation of the location or *`max_length`* characters, whichever comes first.

  ```sql
  mysql> SELECT ST_GeoHash(180,0,10), ST_GeoHash(-180,-90,15);
  +----------------------+-------------------------+
  | ST_GeoHash(180,0,10) | ST_GeoHash(-180,-90,15) |
  +----------------------+-------------------------+
  | xbpbpbpbpb           | 000000000000000         |
  +----------------------+-------------------------+
  ```

* `ST_LatFromGeoHash(geohash_str)`

  Returns the latitude from a geohash string value, as a `DOUBLE` - FLOAT, DOUBLE") value in the range [−90, 90].

  If the argument is `NULL`, the return value is `NULL`. If the argument is invalid, an error occurs.

  The `ST_LatFromGeoHash()` decoding function reads no more than 433 characters from the *`geohash_str`* argument. That represents the upper limit on information in the internal representation of coordinate values. Characters past the 433rd are ignored, even if they are otherwise illegal and produce an error.

  ```sql
  mysql> SELECT ST_LatFromGeoHash(ST_GeoHash(45,-20,10));
  +------------------------------------------+
  | ST_LatFromGeoHash(ST_GeoHash(45,-20,10)) |
  +------------------------------------------+
  |                                      -20 |
  +------------------------------------------+
  ```

* `ST_LongFromGeoHash(geohash_str)`

  Returns the longitude from a geohash string value, as a `DOUBLE` - FLOAT, DOUBLE") value in the range [−180, 180].

  If the argument is `NULL`, the return value is `NULL`. If the argument is invalid, an error occurs.

  The remarks in the description of `ST_LatFromGeoHash()` regarding the maximum number of characters processed from the *`geohash_str`* argument also apply to `ST_LongFromGeoHash()`.

  ```sql
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

  If any argument is `NULL`, the return value is `NULL`. If any argument is invalid, an error occurs.

  The *`srid`* argument is an unsigned 32-bit integer.

  The remarks in the description of `ST_LatFromGeoHash()` regarding the maximum number of characters processed from the *`geohash_str`* argument also apply to `ST_PointFromGeoHash()`.

  ```sql
  mysql> SET @gh = ST_GeoHash(45,-20,10);
  mysql> SELECT ST_AsText(ST_PointFromGeoHash(@gh,0));
  +---------------------------------------+
  | ST_AsText(ST_PointFromGeoHash(@gh,0)) |
  +---------------------------------------+
  | POINT(45 -20)                         |
  +---------------------------------------+
  ```


### 12.16.11 Spatial GeoJSON Functions

This section describes functions for converting between GeoJSON documents and spatial values. GeoJSON is an open standard for encoding geometric/geographical features. For more information, see <http://geojson.org>. The functions discussed here follow GeoJSON specification revision 1.0.

GeoJSON supports the same geometric/geographic data types that MySQL supports. Feature and FeatureCollection objects are not supported, except that geometry objects are extracted from them. CRS support is limited to values that identify an SRID.

MySQL also supports a native `JSON` data type and a set of SQL functions to enable operations on JSON values. For more information, see Section 11.5, “The JSON Data Type”, and Section 12.17, “JSON Functions”.

* [`ST_AsGeoJSON(g [, max_dec_digits [, options]])`](spatial-geojson-functions.html#function_st-asgeojson)

  Generates a GeoJSON object from the geometry *`g`*. The object string has the connection character set and collation.

  If any argument is `NULL`, the return value is `NULL`. If any non-`NULL` argument is invalid, an error occurs.

  *`max_dec_digits`*, if specified, limits the number of decimal digits for coordinates and causes rounding of output. If not specified, this argument defaults to its maximum value of 232 −

  1. The minimum is 0.

  *`options`*, if specified, is a bitmask. The following table shows the permitted flag values. If the geometry argument has an SRID of 0, no CRS object is produced even for those flag values that request one.

  <table summary="Option flags for the ST_AsGeoJSON() function."><col style="width: 10%"/><col style="width: 90%"/><thead><tr> <th>Flag Value</th> <th>Meaning</th> </tr></thead><tbody><tr> <td>0</td> <td>No options. This is the default if <code>options</code> is not specified.</td> </tr><tr> <td>1</td> <td>Add a bounding box to the output.</td> </tr><tr> <td>2</td> <td>Add a short-format CRS URN to the output. The default format is a short format (<code>EPSG:<code>srid</code></code>).</td> </tr><tr> <td>4</td> <td>Add a long-format CRS URN (<code>urn:ogc:def:crs:EPSG::<code>srid</code></code>). This flag overrides flag 2. For example, option values of 5 and 7 mean the same (add a bounding box and a long-format CRS URN).</td> </tr></tbody></table>

  ```sql
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

  <table summary="Option flags for the ST_GeomFromGeoJSON() function."><col style="width: 10%"/><col style="width: 90%"/><thead><tr> <th>Option Value</th> <th>Meaning</th> </tr></thead><tbody><tr> <td>1</td> <td>Reject the document and produce an error. This is the default if <code>options</code> is not specified.</td> </tr><tr> <td>2, 3, 4</td> <td>Accept the document and strip off the coordinates for higher coordinate dimensions.</td> </tr></tbody></table>

  *`options`* values of 2, 3, and 4 currently produce the same effect. If geometries with coordinate dimensions higher than 2 are supported in the future, these values can be expected to produce different effects.

  The *`srid`* argument, if given, must be a 32-bit unsigned integer. If not given, the geometry return value has an SRID of 4326.

  GeoJSON geometry, feature, and feature collection objects may have a `crs` property. The parsing function parses named CRS URNs in the `urn:ogc:def:crs:EPSG::srid` and `EPSG:srid` namespaces, but not CRSs given as link objects. Also, `urn:ogc:def:crs:OGC:1.3:CRS84` is recognized as SRID 4326. If an object has a CRS that is not understood, an error occurs, with the exception that if the optional *`srid`* argument is given, any CRS is ignored even if it is invalid.

  As specified in the GeoJSON specification, parsing is case-sensitive for the `type` member of the GeoJSON input (`Point`, `LineString`, and so forth). The specification is silent regarding case sensitivity for other parsing, which in MySQL is not case-sensitive.

  This example shows the parsing result for a simple GeoJSON object:

  ```sql
  mysql> SET @json = '{ "type": "Point", "coordinates": [102.0, 0.0]}';
  mysql> SELECT ST_AsText(ST_GeomFromGeoJSON(@json));
  +--------------------------------------+
  | ST_AsText(ST_GeomFromGeoJSON(@json)) |
  +--------------------------------------+
  | POINT(102 0)                         |
  +--------------------------------------+
  ```


### 12.16.12 Spatial Convenience Functions

The functions in this section provide convenience operations on geometry values.

* [`ST_Distance_Sphere(g1, g2 [, radius])`](spatial-convenience-functions.html#function_st-distance-sphere)

  Returns the mimimum spherical distance between two points and/or multipoints on a sphere, in meters, or `NULL` if any geometry argument is `NULL` or empty.

  Calculations use a spherical earth and a configurable radius. The optional *`radius`* argument should be given in meters. If omitted, the default radius is 6,370,986 meters. An `ER_WRONG_ARGUMENTS` error occurs if the *`radius`* argument is present but not positive.

  The geometry arguments should consist of points that specify (longitude, latitude) coordinate values:

  + Longitude and latitude are the first and second coordinates of the point, respectively.

  + Both coordinates are in degrees.
  + Longitude values must be in the range (-180, 180]. Positive values are east of the prime meridian.

  + Latitude values must be in the range [-90, 90]. Positive values are north of the equator.

  Supported argument combinations are (`Point`, `Point`), (`Point`, `MultiPoint`), and (`MultiPoint`, `Point`). An `ER_GIS_UNSUPPORTED_ARGUMENT` error occurs for other combinations.

  If any geometry argument is not a syntactically well-formed geometry byte string, an `ER_GIS_INVALID_DATA` error occurs.

  ```sql
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

  Returns 1 if the argument is syntactically well-formed and is geometrically valid, 0 if the argument is not syntactically well-formed or is not geometrically valid. If the argument is `NULL`, the return value is `NULL`. Geometry validity is defined by the OGC specification.

  The only valid empty geometry is represented in the form of an empty geometry collection value. `ST_IsValid()` returns 1 in this case.

  `ST_IsValid()` works only for the Cartesian coordinate system and requires a geometry argument with an SRID of 0. An `ER_WRONG_ARGUMENTS` error occurs otherwise.

  ```sql
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

  Returns the rectangle that forms the envelope around two points, as a `Point`, `LineString`, or `Polygon`. If any argument is `NULL`, the return value is `NULL`.

  Calculations are done using the Cartesian coordinate system rather than on a sphere, spheroid, or on earth.

  Given two points *`pt1`* and *`pt2`*, `ST_MakeEnvelope()` creates the result geometry on an abstract plane like this:

  + If *`pt1`* and *`pt2`* are equal, the result is the point *`pt1`*.

  + Otherwise, if `(pt1, pt2)` is a vertical or horizontal line segment, the result is the line segment `(pt1, pt2)`.

  + Otherwise, the result is a polygon using *`pt1`* and *`pt2`* as diagonal points.

  The result geometry has an SRID of 0.

  `ST_MakeEnvelope()` requires `Point` geometry arguments with an SRID of 0. An `ER_WRONG_ARGUMENTS` error occurs otherwise.

  If any argument is not a syntactically well-formed geometry byte string, or if any coordinate value of the two points is infinite or `NaN`, an `ER_GIS_INVALID_DATA` error occurs.

  ```sql
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

  Simplifies a geometry using the Douglas-Peucker algorithm and returns a simplified value of the same type. If any argument is `NULL`, the return value is `NULL`.

  The geometry may be any geometry type, although the Douglas-Peucker algorithm may not actually process every type. A geometry collection is processed by giving its components one by one to the simplification algorithm, and the returned geometries are put into a geometry collection as result.

  The *`max_distance`* argument is the distance (in units of the input coordinates) of a vertex to other segments to be removed. Vertices within this distance of the simplified linestring are removed. If the *`max_distance`* argument is not positive, or is `NaN`, an `ER_WRONG_ARGUMENTS` error occurs.

  According to Boost.Geometry, geometries might become invalid as a result of the simplification process, and the process might create self-intersections. To check the validity of the result, pass it to `ST_IsValid()`.

  If the geometry argument is not a syntactically well-formed geometry byte string, an `ER_GIS_INVALID_DATA` error occurs.

  ```sql
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

  `ST_Validate()` works only for the Cartesian coordinate system and requires a geometry argument with an SRID of 0. An `ER_WRONG_ARGUMENTS` error occurs otherwise.

  ```sql
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
