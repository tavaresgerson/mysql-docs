#### 12.16.7.5 GeometryCollection Property Functions

These functions return properties of `GeometryCollection` values.

* `GeometryN(gc, N)`

  `ST_GeometryN()` and `GeometryN()` are synonyms. For more information, see the description of `ST_GeometryN()`.

  `GeometryN()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_GeometryN()` instead.

* `NumGeometries(gc)`

  `ST_NumGeometries()` and `NumGeometries()` are synonyms. For more information, see the description of `ST_NumGeometries()`.

  `NumGeometries()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_NumGeometries()` instead.

* `ST_GeometryN(gc, N)`

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
