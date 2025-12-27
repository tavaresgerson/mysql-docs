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

* `InteriorRingN(poly, N)`

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

* `ST_InteriorRingN(poly, N)`

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
