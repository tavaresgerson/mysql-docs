#### 12.16.9.1 Spatial Relation Functions That Use Object Shapes

The OpenGIS specification defines the following functions to test the relationship between two geometry values *`g1`* and *`g2`*, using precise object shapes. The return values 1 and 0 indicate true and false, respectively, except for `ST_Distance()` and `Distance()`, which return distance values.

These functions support all argument type combinations except those that are inapplicable according to the Open Geospatial Consortium specification.

* `Crosses(g1, g2)`

  `ST_Crosses()` and `Crosses()` are synonyms. For more information, see the description of `ST_Crosses()`.

  `Crosses()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_Crosses()` instead.

* `Distance(g1, g2)`

  `ST_Distance()` and `Distance()` are synonyms. For more information, see the description of `ST_Distance()`.

  `Distance()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_Distance()` instead.

* `ST_Contains(g1, g2)`

  Returns 1 or 0 to indicate whether *`g1`* completely contains *`g2`*. This tests the opposite relationship as `ST_Within()`.

* `ST_Crosses(g1, g2)`

  The term *spatially crosses* denotes a spatial relation between two given geometries that has the following properties:

  + The two geometries intersect.
  + Their intersection results in a geometry that has a dimension that is one less than the maximum dimension of the two given geometries.

  + Their intersection is not equal to either of the two given geometries.

  This function returns 1 or 0 to indicate whether *`g1`* spatially crosses *`g2`*. If *`g1`* is a `Polygon` or a `MultiPolygon`, or if *`g2`* is a `Point` or a `MultiPoint`, the return value is `NULL`.

  This function returns 0 if called with an inapplicable geometry argument type combination. For example, it returns 0 if the first argument is a `Polygon` or `MultiPolygon` and/or the second argument is a `Point` or `MultiPoint`.

  Returns 1 if *`g1`* spatially crosses *`g2`*. Returns `NULL` if *`g1`* is a `Polygon` or a `MultiPolygon`, or if *`g2`* is a `Point` or a `MultiPoint`. Otherwise, returns 0.

  This function returns 0 if called with an inapplicable geometry argument type combination. For example, it returns 0 if the first argument is a `Polygon` or `MultiPolygon` and/or the second argument is a `Point` or `MultiPoint`.

  `ST_Crosses()` and `Crosses()` are synonyms.

* `ST_Disjoint(g1, g2)`

  Returns 1 or 0 to indicate whether *`g1`* is spatially disjoint from (does not intersect) *`g2`*.

* `ST_Distance(g1, g2)`

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

* `ST_Equals(g1, g2)`

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

* `ST_Intersects(g1, g2)`

  Returns 1 or 0 to indicate whether *`g1`* spatially intersects *`g2`*.

* `ST_Overlaps(g1, g2)`

  Two geometries *spatially overlap* if they intersect and their intersection results in a geometry of the same dimension but not equal to either of the given geometries.

  This function returns 1 or 0 to indicate whether *`g1`* spatially overlaps *`g2`*.

  This function returns 0 if called with an inapplicable geometry argument type combination. For example, it returns 0 if called with geometries of different dimensions or any argument is a `Point`.

* `ST_Touches(g1, g2)`

  Two geometries *spatially touch* if their interiors do not intersect, but the boundary of one of the geometries intersects either the boundary or the interior of the other.

  This function returns 1 or 0 to indicate whether *`g1`* spatially touches *`g2`*.

  This function returns 0 if called with an inapplicable geometry argument type combination. For example, it returns 0 if either of the arguments is a `Point` or `MultiPoint`.

  `ST_Touches()` and `Touches()` are synonyms.

* `ST_Within(g1, g2)`

  Returns 1 or 0 to indicate whether *`g1`* is spatially within *`g2`*. This tests the opposite relationship as `ST_Contains()`.

* `Touches(g1, g2)`

  `ST_Touches()` and `Touches()` are synonyms. For more information, see the description of `ST_Touches()`.

  `Touches()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_Touches()` instead.
