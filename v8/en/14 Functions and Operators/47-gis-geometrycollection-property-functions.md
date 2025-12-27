#### 14.16.7.5 GeometryCollection Property Functions

These functions return properties of `GeometryCollection` values.

Unless otherwise specified, functions in this section handle their geometry arguments as follows:

* If any argument is `NULL` or any geometry argument is an empty geometry, the return value is `NULL`.
* If any geometry argument is not a syntactically well-formed geometry, an `ER_GIS_INVALID_DATA` error occurs.
* If any geometry argument is a syntactically well-formed geometry in an undefined spatial reference system (SRS), an `ER_SRS_NOT_FOUND` error occurs.
* Otherwise, the return value is non-`NULL`.

These functions are available for obtaining geometry collection properties:

* `ST_GeometryN(gc, N)`

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
*  `ST_NumGeometries(gc)`

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

