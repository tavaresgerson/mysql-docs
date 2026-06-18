#### 12.16.7.4 Polygon and MultiPolygon Property Functions

Functions in this section return properties of
`Polygon` or `MultiPolygon`
values.

* [`Area({poly|mpoly})`](gis-polygon-property-functions.html#function_area)

  [`ST_Area()`](gis-polygon-property-functions.html#function_st-area) and
  [`Area()`](gis-polygon-property-functions.html#function_area) are synonyms. For more
  information, see the description of
  [`ST_Area()`](gis-polygon-property-functions.html#function_st-area).

  [`Area()`](gis-polygon-property-functions.html#function_area) is deprecated; expect
  it to be removed in a future MySQL release. Use
  [`ST_Area()`](gis-polygon-property-functions.html#function_st-area) instead.

* [`Centroid({poly|mpoly})`](gis-polygon-property-functions.html#function_centroid)

  [`ST_Centroid()`](gis-polygon-property-functions.html#function_st-centroid) and
  [`Centroid()`](gis-polygon-property-functions.html#function_centroid) are synonyms. For
  more information, see the description of
  [`ST_Centroid()`](gis-polygon-property-functions.html#function_st-centroid).

  [`Centroid()`](gis-polygon-property-functions.html#function_centroid) is deprecated;
  expect it to be removed in a future MySQL release. Use
  [`ST_Centroid()`](gis-polygon-property-functions.html#function_st-centroid) instead.

* [`ExteriorRing(poly)`](gis-polygon-property-functions.html#function_exteriorring)

  [`ST_ExteriorRing()`](gis-polygon-property-functions.html#function_st-exteriorring) and
  [`ExteriorRing()`](gis-polygon-property-functions.html#function_exteriorring) are synonyms.
  For more information, see the description of
  [`ST_ExteriorRing()`](gis-polygon-property-functions.html#function_st-exteriorring).

  [`ExteriorRing()`](gis-polygon-property-functions.html#function_exteriorring) is deprecated;
  expect it to be removed in a future MySQL release. Use
  [`ST_ExteriorRing()`](gis-polygon-property-functions.html#function_st-exteriorring) instead.

* [`InteriorRingN(poly,
  N)`](gis-polygon-property-functions.html#function_interiorringn)

  [`ST_InteriorRingN()`](gis-polygon-property-functions.html#function_st-interiorringn) and
  [`InteriorRingN()`](gis-polygon-property-functions.html#function_interiorringn) are synonyms.
  For more information, see the description of
  [`ST_InteriorRingN()`](gis-polygon-property-functions.html#function_st-interiorringn).

  [`InteriorRingN()`](gis-polygon-property-functions.html#function_interiorringn) is
  deprecated; expect it to be removed in a future MySQL
  release. Use
  [`ST_InteriorRingN()`](gis-polygon-property-functions.html#function_st-interiorringn) instead.

* [`NumInteriorRings(poly)`](gis-polygon-property-functions.html#function_numinteriorrings)

  [`ST_NumInteriorRings()`](gis-polygon-property-functions.html#function_st-numinteriorrings) and
  [`NumInteriorRings()`](gis-polygon-property-functions.html#function_numinteriorrings) are
  synonyms. For more information, see the description of
  [`ST_NumInteriorRings()`](gis-polygon-property-functions.html#function_st-numinteriorrings).

  [`NumInteriorRings()`](gis-polygon-property-functions.html#function_numinteriorrings) is
  deprecated; expect it to be removed in a future MySQL
  release. Use
  [`ST_NumInteriorRings()`](gis-polygon-property-functions.html#function_st-numinteriorrings)
  instead.

* [`ST_Area({poly|mpoly})`](gis-polygon-property-functions.html#function_st-area)

  Returns a double-precision number indicating the area of the
  `Polygon` or
  `MultiPolygon` argument, as measured in its
  spatial reference system. For arguments of dimension 0 or 1,
  the result is 0. If the argument is an empty geometry the
  return value is 0. If the argument is
  `NULL` the return value is
  `NULL`.

  The result is the sum of the area values of all components
  for a geometry collection. If a geometry collection is
  empty, its area is returned as 0.

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

  [`ST_Area()`](gis-polygon-property-functions.html#function_st-area) and
  [`Area()`](gis-polygon-property-functions.html#function_area) are synonyms.

* [`ST_Centroid({poly|mpoly})`](gis-polygon-property-functions.html#function_st-centroid)

  Returns the mathematical centroid for the
  `Polygon` or
  `MultiPolygon` argument as a
  `Point`. The result is not guaranteed to be
  on the `MultiPolygon`. If the argument is
  `NULL` or an empty geometry, the return
  value is `NULL`.

  This function processes geometry collections by computing
  the centroid point for components of highest dimension in
  the collection. Such components are extracted and made into
  a single `MultiPolygon`,
  `MultiLineString`, or
  `MultiPoint` for centroid computation. If
  the argument is an empty geometry collection, the return
  value is `NULL`.

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

  [`ST_Centroid()`](gis-polygon-property-functions.html#function_st-centroid) and
  [`Centroid()`](gis-polygon-property-functions.html#function_centroid) are synonyms.

* [`ST_ExteriorRing(poly)`](gis-polygon-property-functions.html#function_st-exteriorring)

  Returns the exterior ring of the `Polygon`
  value *`poly`* as a
  `LineString`. If the argument is
  `NULL` or an empty geometry, the return
  value is `NULL`.

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

  [`ST_ExteriorRing()`](gis-polygon-property-functions.html#function_st-exteriorring) and
  [`ExteriorRing()`](gis-polygon-property-functions.html#function_exteriorring) are synonyms.

* [`ST_InteriorRingN(poly,
  N)`](gis-polygon-property-functions.html#function_st-interiorringn)

  Returns the *`N`*-th interior ring
  for the `Polygon` value
  *`poly`* as a
  `LineString`. Rings are numbered beginning
  with 1. If the argument is `NULL` or an
  empty geometry, the return value is `NULL`.

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

  [`ST_InteriorRingN()`](gis-polygon-property-functions.html#function_st-interiorringn) and
  [`InteriorRingN()`](gis-polygon-property-functions.html#function_interiorringn) are synonyms.

* [`ST_NumInteriorRing(poly)`](gis-polygon-property-functions.html#function_st-numinteriorrings),
  [`ST_NumInteriorRings(poly)`](gis-polygon-property-functions.html#function_st-numinteriorrings)

  Returns the number of interior rings in the
  `Polygon` value
  *`poly`*. If the argument is
  `NULL` or an empty geometry, the return
  value is `NULL`.

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

  [`ST_NumInteriorRing()`](gis-polygon-property-functions.html#function_st-numinteriorrings),
  [`ST_NumInteriorRings()`](gis-polygon-property-functions.html#function_st-numinteriorrings), and
  [`NumInteriorRings()`](gis-polygon-property-functions.html#function_numinteriorrings) are
  synonyms.