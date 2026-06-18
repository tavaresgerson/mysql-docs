### 12.16.8 Spatial Operator Functions

OpenGIS proposes a number of functions that can produce
geometries. They are designed to implement spatial operators.

These functions support all argument type combinations except
those that are inapplicable according to the
[Open Geospatial
Consortium](http://www.opengeospatial.org) specification.

In addition, [Section 12.16.7, “Geometry Property Functions”](gis-property-functions.html "12.16.7 Geometry Property Functions"), discusses
several functions that construct new geometries from existing
ones. See that section for descriptions of these functions:

* [`ST_Envelope(g)`](gis-general-property-functions.html#function_st-envelope)
* [`ST_StartPoint(ls)`](gis-linestring-property-functions.html#function_st-startpoint)
* [`ST_EndPoint(ls)`](gis-linestring-property-functions.html#function_st-endpoint)
* [`ST_PointN(ls,
  N)`](gis-linestring-property-functions.html#function_st-pointn)

* [`ST_ExteriorRing(poly)`](gis-polygon-property-functions.html#function_st-exteriorring)
* [`ST_InteriorRingN(poly,
  N)`](gis-polygon-property-functions.html#function_st-interiorringn)

* [`ST_GeometryN(gc,
  N)`](gis-geometrycollection-property-functions.html#function_st-geometryn)

These spatial operator functions are available:

* [`Buffer(g,
  d [,
  strategy1 [,
  strategy2 [,
  strategy3]]])`](spatial-operator-functions.html#function_buffer)

  [`ST_Buffer()`](spatial-operator-functions.html#function_st-buffer) and
  [`Buffer()`](spatial-operator-functions.html#function_buffer) are synonyms. For more
  information, see the description of
  [`ST_Buffer()`](spatial-operator-functions.html#function_st-buffer).

  [`Buffer()`](spatial-operator-functions.html#function_buffer) is deprecated; expect
  it to be removed in a future MySQL release. Use
  [`ST_Buffer()`](spatial-operator-functions.html#function_st-buffer) instead.

* [`ConvexHull(g)`](spatial-operator-functions.html#function_convexhull)

  [`ST_ConvexHull()`](spatial-operator-functions.html#function_st-convexhull) and
  [`ConvexHull()`](spatial-operator-functions.html#function_convexhull) are synonyms. For
  more information, see the description of
  [`ST_ConvexHull()`](spatial-operator-functions.html#function_st-convexhull).

  [`ConvexHull()`](spatial-operator-functions.html#function_convexhull) is deprecated;
  expect it to be removed in a future MySQL release. Use
  [`ST_ConvexHull()`](spatial-operator-functions.html#function_st-convexhull) instead.

* [`ST_Buffer(g,
  d [,
  strategy1 [,
  strategy2 [,
  strategy3]]])`](spatial-operator-functions.html#function_st-buffer)

  Returns a geometry that represents all points whose distance
  from the geometry value *`g`* is less
  than or equal to a distance of *`d`*,
  or `NULL` if any argument is
  `NULL`. The SRID of the geometry argument
  must be 0 because [`ST_Buffer()`](spatial-operator-functions.html#function_st-buffer)
  supports only the Cartesian coordinate system. If any geometry
  argument is not a syntactically well-formed geometry, an
  [`ER_GIS_INVALID_DATA`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_gis_invalid_data) error
  occurs.

  If the geometry argument is empty,
  [`ST_Buffer()`](spatial-operator-functions.html#function_st-buffer) returns an empty
  geometry.

  If the distance is 0,
  [`ST_Buffer()`](spatial-operator-functions.html#function_st-buffer) returns the
  geometry argument unchanged:

  ```sql
  mysql> SET @pt = ST_GeomFromText('POINT(0 0)');
  mysql> SELECT ST_AsText(ST_Buffer(@pt, 0));
  +------------------------------+
  | ST_AsText(ST_Buffer(@pt, 0)) |
  +------------------------------+
  | POINT(0 0)                   |
  +------------------------------+
  ```

  [`ST_Buffer()`](spatial-operator-functions.html#function_st-buffer) supports negative
  distances for `Polygon` and
  `MultiPolygon` values, and for geometry
  collections containing `Polygon` or
  `MultiPolygon` values. The result may be an
  empty geometry. An
  [`ER_WRONG_ARGUMENTS`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_wrong_arguments) error
  occurs for [`ST_Buffer()`](spatial-operator-functions.html#function_st-buffer) with a
  negative distance for `Point`,
  `MultiPoint`, `LineString`,
  and `MultiLineString` values, and for
  geometry collections not containing any
  `Polygon` or `MultiPolygon`
  values.

  [`ST_Buffer()`](spatial-operator-functions.html#function_st-buffer) permits up to three
  optional strategy arguments following the distance argument.
  Strategies influence buffer computation. These arguments are
  byte string values produced by the
  [`ST_Buffer_Strategy()`](spatial-operator-functions.html#function_st-buffer-strategy) function,
  to be used for point, join, and end strategies:

  + Point strategies apply to `Point` and
    `MultiPoint` geometries. If no point
    strategy is specified, the default is
    [`ST_Buffer_Strategy('point_circle',
    32)`](spatial-operator-functions.html#function_st-buffer-strategy).

  + Join strategies apply to `LineString`,
    `MultiLineString`,
    `Polygon`, and
    `MultiPolygon` geometries. If no join
    strategy is specified, the default is
    [`ST_Buffer_Strategy('join_round',
    32)`](spatial-operator-functions.html#function_st-buffer-strategy).

  + End strategies apply to `LineString` and
    `MultiLineString` geometries. If no end
    strategy is specified, the default is
    [`ST_Buffer_Strategy('end_round',
    32)`](spatial-operator-functions.html#function_st-buffer-strategy).

  Up to one strategy of each type may be specified, and they may
  be given in any order. If multiple strategies of a given type
  are specified, an
  [`ER_WRONG_ARGUMENTS`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_wrong_arguments) error
  occurs.

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

  [`ST_Buffer()`](spatial-operator-functions.html#function_st-buffer) and
  [`Buffer()`](spatial-operator-functions.html#function_buffer) are synonyms.

* [`ST_Buffer_Strategy(strategy
  [, points_per_circle])`](spatial-operator-functions.html#function_st-buffer-strategy)

  This function returns a strategy byte string for use with
  [`ST_Buffer()`](spatial-operator-functions.html#function_st-buffer) to influence buffer
  computation. If any argument is `NULL`, the
  return value is `NULL`. If any argument is
  invalid, an [`ER_WRONG_ARGUMENTS`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_wrong_arguments)
  error occurs.

  Information about strategies is available at
  [Boost.org](http://www.boost.org).

  The first argument must be a string indicating a strategy
  option:

  + For point strategies, permitted values are
    `'point_circle'` and
    `'point_square'`.

  + For join strategies, permitted values are
    `'join_round'` and
    `'join_miter'`.

  + For end strategies, permitted values are
    `'end_round'` and
    `'end_flat'`.

  If the first argument is `'point_circle'`,
  `'join_round'`,
  `'join_miter'`, or
  `'end_round'`, the
  *`points_per_circle`* argument must be
  given as a positive numeric value. The maximum
  *`points_per_circle`* value is the
  value of the
  [`max_points_in_geometry`](server-system-variables.html#sysvar_max_points_in_geometry) system
  variable. If the first argument is
  `'point_square'` or
  `'end_flat'`, the
  *`points_per_circle`* argument must not
  be given or an
  [`ER_WRONG_ARGUMENTS`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_wrong_arguments) error
  occurs.

  For examples, see the description of
  [`ST_Buffer()`](spatial-operator-functions.html#function_st-buffer).

* [`ST_ConvexHull(g)`](spatial-operator-functions.html#function_st-convexhull)

  Returns a geometry that represents the convex hull of the
  geometry value *`g`*. If the argument
  is `NULL`, the return value is
  `NULL`.

  This function computes a geometry's convex hull by first
  checking whether its vertex points are colinear. The function
  returns a linear hull if so, a polygon hull otherwise. This
  function processes geometry collections by extracting all
  vertex points of all components of the collection, creating a
  `MultiPoint` value from them, and computing
  its convex hull. If the argument is an empty geometry
  collection, the return value is `NULL`.

  ```sql
  mysql> SET @g = 'MULTIPOINT(5 0,25 0,15 10,15 25)';
  mysql> SELECT ST_AsText(ST_ConvexHull(ST_GeomFromText(@g)));
  +-----------------------------------------------+
  | ST_AsText(ST_ConvexHull(ST_GeomFromText(@g))) |
  +-----------------------------------------------+
  | POLYGON((5 0,25 0,15 25,5 0))                 |
  +-----------------------------------------------+
  ```

  [`ST_ConvexHull()`](spatial-operator-functions.html#function_st-convexhull) and
  [`ConvexHull()`](spatial-operator-functions.html#function_convexhull) are synonyms.

* [`ST_Difference(g1,
  g2)`](spatial-operator-functions.html#function_st-difference)

  Returns a geometry that represents the point set difference of
  the geometry values *`g1`* and
  *`g2`*. If any argument is
  `NULL`, the return value is
  `NULL`.

  ```sql
  mysql> SET @g1 = Point(1,1), @g2 = Point(2,2);
  mysql> SELECT ST_AsText(ST_Difference(@g1, @g2));
  +------------------------------------+
  | ST_AsText(ST_Difference(@g1, @g2)) |
  +------------------------------------+
  | POINT(1 1)                         |
  +------------------------------------+
  ```

* [`ST_Intersection(g1,
  g2)`](spatial-operator-functions.html#function_st-intersection)

  Returns a geometry that represents the point set intersection
  of the geometry values *`g1`* and
  *`g2`*. If any argument is
  `NULL`, the return value is
  `NULL`.

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

* [`ST_SymDifference(g1,
  g2)`](spatial-operator-functions.html#function_st-symdifference)

  Returns a geometry that represents the point set symmetric
  difference of the geometry values
  *`g1`* and
  *`g2`*, which is defined as:

  ```sql
  g1 symdifference g2 := (g1 union g2) difference (g1 intersection g2)
  ```

  Or, in function call notation:

  ```sql
  ST_SymDifference(g1, g2) = ST_Difference(ST_Union(g1, g2), ST_Intersection(g1, g2))
  ```

  If any argument is `NULL`, the return value
  is `NULL`.

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

* [`ST_Union(g1,
  g2)`](spatial-operator-functions.html#function_st-union)

  Returns a geometry that represents the point set union of the
  geometry values *`g1`* and
  *`g2`*. If any argument is
  `NULL`, the return value is
  `NULL`.

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