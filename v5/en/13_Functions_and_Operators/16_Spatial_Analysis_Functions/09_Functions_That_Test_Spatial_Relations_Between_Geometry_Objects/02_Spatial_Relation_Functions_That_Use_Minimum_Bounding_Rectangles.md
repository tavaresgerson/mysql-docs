#### 12.16.9.2 Spatial Relation Functions That Use Minimum Bounding Rectangles

MySQL provides several MySQL-specific functions that test the
relationship between minimum bounding rectangles (MBRs) of two
geometries *`g1`* and
*`g2`*. The return values 1 and 0
indicate true and false, respectively.

A corresponding set of MBR functions defined according to the
OpenGIS specification is described later in this section.

* [`MBRContains(g1,
  g2)`](spatial-relation-functions-mbr.html#function_mbrcontains)

  Returns 1 or 0 to indicate whether the minimum bounding
  rectangle of *`g1`* contains the
  minimum bounding rectangle of *`g2`*.
  This tests the opposite relationship as
  [`MBRWithin()`](spatial-relation-functions-mbr.html#function_mbrwithin).

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

  [`MBRContains()`](spatial-relation-functions-mbr.html#function_mbrcontains) and
  [`Contains()`](spatial-relation-functions-mbr.html#function_contains) are synonyms.

* [`MBRCoveredBy(g1,
  g2)`](spatial-relation-functions-mbr.html#function_mbrcoveredby)

  Returns 1 or 0 to indicate whether the minimum bounding
  rectangle of *`g1`* is covered by the
  minimum bounding rectangle of *`g2`*.
  This tests the opposite relationship as
  [`MBRCovers()`](spatial-relation-functions-mbr.html#function_mbrcovers).

  [`MBRCoveredBy()`](spatial-relation-functions-mbr.html#function_mbrcoveredby) handles its
  arguments as follows:

  + If either argument is `NULL` or an
    empty geometry, the return value is
    `NULL`.

  + If either argument is not a syntactically well-formed
    geometry byte string, an
    [`ER_GIS_INVALID_DATA`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_gis_invalid_data)
    error occurs.

  + Otherwise, the return value is
    non-`NULL`.

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

* [`MBRCovers(g1,
  g2)`](spatial-relation-functions-mbr.html#function_mbrcovers)

  Returns 1 or 0 to indicate whether the minimum bounding
  rectangle of *`g1`* covers the
  minimum bounding rectangle of *`g2`*.
  This tests the opposite relationship as
  [`MBRCoveredBy()`](spatial-relation-functions-mbr.html#function_mbrcoveredby). See the
  description of [`MBRCoveredBy()`](spatial-relation-functions-mbr.html#function_mbrcoveredby)
  for examples.

  [`MBRCovers()`](spatial-relation-functions-mbr.html#function_mbrcovers) handles its
  arguments as follows:

  + If either argument is `NULL` or an
    empty geometry, the return value is
    `NULL`.

  + If either argument is not a syntactically well-formed
    geometry byte string, an
    [`ER_GIS_INVALID_DATA`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_gis_invalid_data)
    error occurs.

  + Otherwise, the return value is
    non-`NULL`.

* [`MBRDisjoint(g1,
  g2)`](spatial-relation-functions-mbr.html#function_mbrdisjoint)

  Returns 1 or 0 to indicate whether the minimum bounding
  rectangles of the two geometries
  *`g1`* and
  *`g2`* are disjoint (do not
  intersect).

  [`MBRDisjoint()`](spatial-relation-functions-mbr.html#function_mbrdisjoint) and
  [`Disjoint()`](spatial-relation-functions-mbr.html#function_disjoint) are synonyms.

* [`MBREqual(g1,
  g2)`](spatial-relation-functions-mbr.html#function_mbrequal)

  Returns 1 or 0 to indicate whether the minimum bounding
  rectangles of the two geometries
  *`g1`* and
  *`g2`* are the same.

  [`MBREqual()`](spatial-relation-functions-mbr.html#function_mbrequal) is deprecated;
  expect it to be removed in a future MySQL release. Use
  [`MBREquals()`](spatial-relation-functions-mbr.html#function_mbrequals) instead.

* [`MBREquals(g1,
  g2)`](spatial-relation-functions-mbr.html#function_mbrequals)

  Returns 1 or 0 to indicate whether the minimum bounding
  rectangles of the two geometries
  *`g1`* and
  *`g2`* are the same.

  [`MBREquals()`](spatial-relation-functions-mbr.html#function_mbrequals),
  [`MBREqual()`](spatial-relation-functions-mbr.html#function_mbrequal), and
  [`Equals()`](spatial-relation-functions-mbr.html#function_equals) are synonyms.

* [`MBRIntersects(g1,
  g2)`](spatial-relation-functions-mbr.html#function_mbrintersects)

  Returns 1 or 0 to indicate whether the minimum bounding
  rectangles of the two geometries
  *`g1`* and
  *`g2`* intersect.

  [`MBRIntersects()`](spatial-relation-functions-mbr.html#function_mbrintersects) and
  [`Intersects()`](spatial-relation-functions-mbr.html#function_intersects) are synonyms.

* [`MBROverlaps(g1,
  g2)`](spatial-relation-functions-mbr.html#function_mbroverlaps)

  Two geometries *spatially overlap* if
  they intersect and their intersection results in a geometry
  of the same dimension but not equal to either of the given
  geometries.

  This function returns 1 or 0 to indicate whether the minimum
  bounding rectangles of the two geometries
  *`g1`* and
  *`g2`* overlap.

  [`MBROverlaps()`](spatial-relation-functions-mbr.html#function_mbroverlaps) and
  [`Overlaps()`](spatial-relation-functions-mbr.html#function_overlaps) are synonyms.

* [`MBRTouches(g1,
  g2)`](spatial-relation-functions-mbr.html#function_mbrtouches)

  Two geometries *spatially touch* if their
  interiors do not intersect, but the boundary of one of the
  geometries intersects either the boundary or the interior of
  the other.

  This function returns 1 or 0 to indicate whether the minimum
  bounding rectangles of the two geometries
  *`g1`* and
  *`g2`* touch.

* [`MBRWithin(g1,
  g2)`](spatial-relation-functions-mbr.html#function_mbrwithin)

  Returns 1 or 0 to indicate whether the minimum bounding
  rectangle of *`g1`* is within the
  minimum bounding rectangle of *`g2`*.
  This tests the opposite relationship as
  [`MBRContains()`](spatial-relation-functions-mbr.html#function_mbrcontains).

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

  [`MBRWithin()`](spatial-relation-functions-mbr.html#function_mbrwithin) and
  [`Within()`](spatial-relation-functions-mbr.html#function_within) are synonyms.

The OpenGIS specification defines the following functions that
test the relationship between two geometry values
*`g1`* and *`g2`*.
The MySQL implementation uses minimum bounding rectangles, so
these functions return the same result as the corresponding
MBR-based functions described earlier in this section. The
return values 1 and 0 indicate true and false, respectively.

These functions support all argument type combinations except
those that are inapplicable according to the Open Geospatial
Consortium specification.

* [`Contains(g1,
  g2)`](spatial-relation-functions-mbr.html#function_contains)

  [`MBRContains()`](spatial-relation-functions-mbr.html#function_mbrcontains) and
  [`Contains()`](spatial-relation-functions-mbr.html#function_contains) are synonyms. For
  more information, see the description of
  [`MBRContains()`](spatial-relation-functions-mbr.html#function_mbrcontains).

  [`Contains()`](spatial-relation-functions-mbr.html#function_contains) is deprecated;
  expect it to be removed in a future MySQL release. Use
  [`MBRContains()`](spatial-relation-functions-mbr.html#function_mbrcontains) instead.

* [`Disjoint(g1,
  g2)`](spatial-relation-functions-mbr.html#function_disjoint)

  [`MBRDisjoint()`](spatial-relation-functions-mbr.html#function_mbrdisjoint) and
  [`Disjoint()`](spatial-relation-functions-mbr.html#function_disjoint) are synonyms. For
  more information, see the description of
  [`MBRDisjoint()`](spatial-relation-functions-mbr.html#function_mbrdisjoint).

  [`Disjoint()`](spatial-relation-functions-mbr.html#function_disjoint) is deprecated;
  expect it to be removed in a future MySQL release. Use
  [`MBRDisjoint()`](spatial-relation-functions-mbr.html#function_mbrdisjoint) instead.

* [`Equals(g1,
  g2)`](spatial-relation-functions-mbr.html#function_equals)

  [`MBREquals()`](spatial-relation-functions-mbr.html#function_mbrequals) and
  [`Equals()`](spatial-relation-functions-mbr.html#function_equals) are synonyms. For
  more information, see the description of
  [`MBREquals()`](spatial-relation-functions-mbr.html#function_mbrequals).

  [`Equals()`](spatial-relation-functions-mbr.html#function_equals) is deprecated;
  expect it to be removed in a future MySQL release. Use
  [`MBREquals()`](spatial-relation-functions-mbr.html#function_mbrequals) instead.

* [`Intersects(g1,
  g2)`](spatial-relation-functions-mbr.html#function_intersects)

  [`MBRIntersects()`](spatial-relation-functions-mbr.html#function_mbrintersects) and
  [`Intersects()`](spatial-relation-functions-mbr.html#function_intersects) are synonyms.
  For more information, see the description of
  [`MBRIntersects()`](spatial-relation-functions-mbr.html#function_mbrintersects).

  [`Intersects()`](spatial-relation-functions-mbr.html#function_intersects) is deprecated;
  expect it to be removed in a future MySQL release. Use
  [`MBRIntersects()`](spatial-relation-functions-mbr.html#function_mbrintersects) instead.

* [`Overlaps(g1,
  g2)`](spatial-relation-functions-mbr.html#function_overlaps)

  [`MBROverlaps()`](spatial-relation-functions-mbr.html#function_mbroverlaps) and
  [`Overlaps()`](spatial-relation-functions-mbr.html#function_overlaps) are synonyms. For
  more information, see the description of
  [`MBROverlaps()`](spatial-relation-functions-mbr.html#function_mbroverlaps).

  [`Overlaps()`](spatial-relation-functions-mbr.html#function_overlaps) is deprecated;
  expect it to be removed in a future MySQL release. Use
  [`MBROverlaps()`](spatial-relation-functions-mbr.html#function_mbroverlaps) instead.

* [`Within(g1,
  g2)`](spatial-relation-functions-mbr.html#function_within)

  [`MBRWithin()`](spatial-relation-functions-mbr.html#function_mbrwithin) and
  [`Within()`](spatial-relation-functions-mbr.html#function_within) are synonyms. For
  more information, see the description of
  [`MBRWithin()`](spatial-relation-functions-mbr.html#function_mbrwithin).

  [`Within()`](spatial-relation-functions-mbr.html#function_within) is deprecated;
  expect it to be removed in a future MySQL release. Use
  [`MBRWithin()`](spatial-relation-functions-mbr.html#function_mbrwithin) instead.