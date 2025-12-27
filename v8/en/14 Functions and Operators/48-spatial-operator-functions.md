### 14.16.8 Spatial Operator Functions

OpenGIS proposes a number of functions that can produce geometries. They are designed to implement spatial operators. These functions support all argument type combinations except those that are inapplicable according to the Open Geospatial Consortium specification.

MySQL also implements certain functions that are extensions to OpenGIS, as noted in the function descriptions. In addition, Section 14.16.7, “Geometry Property Functions”, discusses several functions that construct new geometries from existing ones. See that section for descriptions of these functions:

*  `ST_Envelope(g)`
*  `ST_StartPoint(ls)`
*  `ST_EndPoint(ls)`
* `ST_PointN(ls, N)`
*  `ST_ExteriorRing(poly)`
* `ST_InteriorRingN(poly, N)`
* `ST_GeometryN(gc, N)`

Unless otherwise specified, functions in this section handle their geometry arguments as follows:

* If any argument is `NULL`, the return value is `NULL`.
* If any geometry argument is not a syntactically well-formed geometry, an `ER_GIS_INVALID_DATA` error occurs.
* If any geometry argument is a syntactically well-formed geometry in an undefined spatial reference system (SRS), an `ER_SRS_NOT_FOUND` error occurs.
* For functions that take multiple geometry arguments, if those arguments are not in the same SRS, an `ER_GIS_DIFFERENT_SRIDS` error occurs.
* If any geometry argument has an SRID value for a geographic SRS and the function does not handle geographic geometries, an `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS` error occurs.
* For geographic SRS geometry arguments, if any argument has a longitude or latitude that is out of range, an error occurs:

  + If a longitude value is not in the range (−180, 180], an `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE` error occurs.
  + If a latitude value is not in the range [−90, 90], an `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE` error occurs.

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

  +  `ST_Buffer()` supports negative distances for `Polygon` and `MultiPolygon` values, and for geometry collections containing `Polygon` or `MultiPolygon` values.
  + If the result is reduced so much that it disappears, the result is an empty geometry.
  + An  `ER_WRONG_ARGUMENTS` error occurs for `ST_Buffer()` with a negative distance for `Point`, `MultiPoint`, `LineString`, and `MultiLineString` values, and for geometry collections not containing any `Polygon` or `MultiPolygon` values.

  `Point` geometries in a geographic SRS are permitted, subject to the following conditions:

  + If the distance is not negative and no strategies are specified, the function returns the geographic buffer of the `Point` in its SRS. The distance argument must be in the SRS distance unit (currently always meters).
  + If the distance is negative or any strategy (except `NULL`) is specified, an `ER_WRONG_ARGUMENTS` error occurs.

  For non-`Point` geometries, an `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS` error occurs.

   `ST_Buffer()` permits up to three optional strategy arguments following the distance argument. Strategies influence buffer computation. These arguments are byte string values produced by the `ST_Buffer_Strategy()` function, to be used for point, join, and end strategies:

  + Point strategies apply to `Point` and `MultiPoint` geometries. If no point strategy is specified, the default is `ST_Buffer_Strategy('point_circle', 32)`.
  + Join strategies apply to `LineString`, `MultiLineString`, `Polygon`, and `MultiPolygon` geometries. If no join strategy is specified, the default is `ST_Buffer_Strategy('join_round', 32)`.
  + End strategies apply to `LineString` and `MultiLineString` geometries. If no end strategy is specified, the default is `ST_Buffer_Strategy('end_round', 32)`.

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
* `ST_Buffer_Strategy(strategy [, points_per_circle])`

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
*  `ST_ConvexHull(g)`

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
* `ST_Difference(g1, g2)`

  Returns a geometry that represents the point set difference of the geometry values *`g1`* and *`g2`*. The result is in the same SRS as the geometry arguments.

   `ST_Difference()` permits arguments in either a Cartesian or a geographic SRS, and handles its arguments as described in the introduction to this section.

  ```
  mysql> SET @g1 = Point(1,1), @g2 = Point(2,2);
  mysql> SELECT ST_AsText(ST_Difference(@g1, @g2));
  +------------------------------------+
  | ST_AsText(ST_Difference(@g1, @g2)) |
  +------------------------------------+
  | POINT(1 1)                         |
  +------------------------------------+
  ```
* `ST_Intersection(g1, g2)`

  Returns a geometry that represents the point set intersection of the geometry values *`g1`* and *`g2`*. The result is in the same SRS as the geometry arguments.

   `ST_Intersection()` permits arguments in either a Cartesian or a geographic SRS, and handles its arguments as described in the introduction to this section.

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
* `ST_LineInterpolatePoint(ls, fractional_distance)`

  This function takes a `LineString` geometry and a fractional distance in the range [0.0, 1.0] and returns the `Point` along the `LineString` at the given fraction of the distance from its start point to its endpoint. It can be used to answer questions such as which `Point` lies halfway along the road described by the geometry argument.

  The function is implemented for `LineString` geometries in all spatial reference systems, both Cartesian and geographic.

  If the *`fractional_distance`* argument is 1.0, the result may not be exactly the last point of the `LineString` argument but a point close to it due to numerical inaccuracies in approximate-value computations.

  A related function, `ST_LineInterpolatePoints()`, takes similar arguments but returns a `MultiPoint` consisting of `Point` values along the `LineString` at each fraction of the distance from its start point to its endpoint. For examples of both functions, see the `ST_LineInterpolatePoints()` description.

   `ST_LineInterpolatePoint()` handles its arguments as described in the introduction to this section, with these exceptions:

  + If the geometry argument is not a `LineString`, an `ER_UNEXPECTED_GEOMETRY_TYPE` error occurs.
  + If the fractional distance argument is outside the range [0.0, 1.0], an `ER_DATA_OUT_OF_RANGE` error occurs.

   `ST_LineInterpolatePoint()` is a MySQL extension to OpenGIS.
* `ST_LineInterpolatePoints(ls, fractional_distance)`

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

   `ST_LineInterpolatePoints()` is a MySQL extension to OpenGIS.
* `ST_PointAtDistance(ls, distance)`

  This function takes a `LineString` geometry and a distance in the range [0.0, `ST_Length(ls)`] measured in the unit of the spatial reference system (SRS) of the `LineString`, and returns the `Point` along the `LineString` at that distance from its start point. It can be used to answer questions such as which `Point` value is 400 meters from the start of the road described by the geometry argument.

  The function is implemented for `LineString` geometries in all spatial reference systems, both Cartesian and geographic.

   `ST_PointAtDistance()` handles its arguments as described in the introduction to this section, with these exceptions:

  + If the geometry argument is not a `LineString`, an `ER_UNEXPECTED_GEOMETRY_TYPE` error occurs.
  + If the fractional distance argument is outside the range [0.0, `ST_Length(ls)`], an  `ER_DATA_OUT_OF_RANGE` error occurs.

   `ST_PointAtDistance()` is a MySQL extension to OpenGIS.
* `ST_SymDifference(g1, g2)`

  Returns a geometry that represents the point set symmetric difference of the geometry values *`g1`* and *`g2`*, which is defined as:

  ```
  g1 symdifference g2 := (g1 union g2) difference (g1 intersection g2)
  ```

  Or, in function call notation:

  ```
  ST_SymDifference(g1, g2) = ST_Difference(ST_Union(g1, g2), ST_Intersection(g1, g2))
  ```

  The result is in the same SRS as the geometry arguments.

   `ST_SymDifference()` permits arguments in either a Cartesian or a geographic SRS, and handles its arguments as described in the introduction to this section.

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
* `ST_Transform(g, target_srid)`

  Transforms a geometry from one spatial reference system (SRS) to another. The return value is a geometry of the same type as the input geometry with all coordinates transformed to the target SRID, *`target_srid`*. MySQL supports all SRSs defined by EPSG except for those listed here:

  + EPSG 1042 Krovak Modified
  + EPSG 1043 Krovak Modified (North Orientated)
  + EPSG 9816 Tunisia Mining Grid
  + EPSG 9826 Lambert Conic Conformal (West Orientated)

   `ST_Transform()` handles its arguments as described in the introduction to this section, with these exceptions:

  + Geometry arguments that have an SRID value for a geographic SRS do not produce an error.
  + If the geometry or target SRID argument has an SRID value that refers to an undefined spatial reference system (SRS), an  `ER_SRS_NOT_FOUND` error occurs.
  + If the geometry is in an SRS that `ST_Transform()` cannot transform from, an `ER_TRANSFORM_SOURCE_SRS_NOT_SUPPORTED` error occurs.
  + If the target SRID is in an SRS that `ST_Transform()` cannot transform to, an `ER_TRANSFORM_TARGET_SRS_NOT_SUPPORTED` error occurs.
  + If the geometry is in an SRS that is not WGS 84 and has no TOWGS84 clause, an `ER_TRANSFORM_SOURCE_SRS_MISSING_TOWGS84` error occurs.
  + If the target SRID is in an SRS that is not WGS 84 and has no TOWGS84 clause, an `ER_TRANSFORM_TARGET_SRS_MISSING_TOWGS84` error occurs.

  `ST_SRID(g, target_srid)` and `ST_Transform(g, target_srid)` differ as follows:

  +  `ST_SRID()` changes the geometry SRID value without transforming its coordinates.
  +  `ST_Transform()` transforms the geometry coordinates in addition to changing its SRID value.

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
* `ST_Union(g1, g2)`

  Returns a geometry that represents the point set union of the geometry values *`g1`* and *`g2`*. The result is in the same SRS as the geometry arguments.

   `ST_Union()` permits arguments in either a Cartesian or a geographic SRS, and handles its arguments as described in the introduction to this section.

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

