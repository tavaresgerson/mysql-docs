#### 12.16.9.2 Spatial Relation Functions That Use Minimum Bounding Rectangles

MySQL provides several MySQL-specific functions that test the relationship between minimum bounding rectangles (MBRs) of two geometries *`g1`* and *`g2`*. The return values 1 and 0 indicate true and false, respectively.

A corresponding set of MBR functions defined according to the OpenGIS specification is described later in this section.

* `MBRContains(g1, g2)`

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

* `MBRCoveredBy(g1, g2)`

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

* `MBRCovers(g1, g2)`

  Returns 1 or 0 to indicate whether the minimum bounding rectangle of *`g1`* covers the minimum bounding rectangle of *`g2`*. This tests the opposite relationship as `MBRCoveredBy()`. See the description of `MBRCoveredBy()` for examples.

  `MBRCovers()` handles its arguments as follows:

  + If either argument is `NULL` or an empty geometry, the return value is `NULL`.

  + If either argument is not a syntactically well-formed geometry byte string, an `ER_GIS_INVALID_DATA` error occurs.

  + Otherwise, the return value is non-`NULL`.

* `MBRDisjoint(g1, g2)`

  Returns 1 or 0 to indicate whether the minimum bounding rectangles of the two geometries *`g1`* and *`g2`* are disjoint (do not intersect).

  `MBRDisjoint()` and `Disjoint()` are synonyms.

* `MBREqual(g1, g2)`

  Returns 1 or 0 to indicate whether the minimum bounding rectangles of the two geometries *`g1`* and *`g2`* are the same.

  `MBREqual()` is deprecated; expect it to be removed in a future MySQL release. Use `MBREquals()` instead.

* `MBREquals(g1, g2)`

  Returns 1 or 0 to indicate whether the minimum bounding rectangles of the two geometries *`g1`* and *`g2`* are the same.

  `MBREquals()`, `MBREqual()`, and `Equals()` are synonyms.

* `MBRIntersects(g1, g2)`

  Returns 1 or 0 to indicate whether the minimum bounding rectangles of the two geometries *`g1`* and *`g2`* intersect.

  `MBRIntersects()` and `Intersects()` are synonyms.

* `MBROverlaps(g1, g2)`

  Two geometries *spatially overlap* if they intersect and their intersection results in a geometry of the same dimension but not equal to either of the given geometries.

  This function returns 1 or 0 to indicate whether the minimum bounding rectangles of the two geometries *`g1`* and *`g2`* overlap.

  `MBROverlaps()` and `Overlaps()` are synonyms.

* `MBRTouches(g1, g2)`

  Two geometries *spatially touch* if their interiors do not intersect, but the boundary of one of the geometries intersects either the boundary or the interior of the other.

  This function returns 1 or 0 to indicate whether the minimum bounding rectangles of the two geometries *`g1`* and *`g2`* touch.

* `MBRWithin(g1, g2)`

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

* `Contains(g1, g2)`

  `MBRContains()` and `Contains()` are synonyms. For more information, see the description of `MBRContains()`.

  `Contains()` is deprecated; expect it to be removed in a future MySQL release. Use `MBRContains()` instead.

* `Disjoint(g1, g2)`

  `MBRDisjoint()` and `Disjoint()` are synonyms. For more information, see the description of `MBRDisjoint()`.

  `Disjoint()` is deprecated; expect it to be removed in a future MySQL release. Use `MBRDisjoint()` instead.

* `Equals(g1, g2)`

  `MBREquals()` and `Equals()` are synonyms. For more information, see the description of `MBREquals()`.

  `Equals()` is deprecated; expect it to be removed in a future MySQL release. Use `MBREquals()` instead.

* `Intersects(g1, g2)`

  `MBRIntersects()` and `Intersects()` are synonyms. For more information, see the description of `MBRIntersects()`.

  `Intersects()` is deprecated; expect it to be removed in a future MySQL release. Use `MBRIntersects()` instead.

* `Overlaps(g1, g2)`

  `MBROverlaps()` and `Overlaps()` are synonyms. For more information, see the description of `MBROverlaps()`.

  `Overlaps()` is deprecated; expect it to be removed in a future MySQL release. Use `MBROverlaps()` instead.

* `Within(g1, g2)`

  `MBRWithin()` and `Within()` are synonyms. For more information, see the description of `MBRWithin()`.

  `Within()` is deprecated; expect it to be removed in a future MySQL release. Use `MBRWithin()` instead.
