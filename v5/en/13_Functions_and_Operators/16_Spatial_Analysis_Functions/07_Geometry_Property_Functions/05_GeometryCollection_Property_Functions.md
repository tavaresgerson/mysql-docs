#### 12.16.7.5 GeometryCollection Property Functions

These functions return properties of
`GeometryCollection` values.

* [`GeometryN(gc,
  N)`](gis-geometrycollection-property-functions.html#function_geometryn)

  [`ST_GeometryN()`](gis-geometrycollection-property-functions.html#function_st-geometryn) and
  [`GeometryN()`](gis-geometrycollection-property-functions.html#function_geometryn) are synonyms. For
  more information, see the description of
  [`ST_GeometryN()`](gis-geometrycollection-property-functions.html#function_st-geometryn).

  [`GeometryN()`](gis-geometrycollection-property-functions.html#function_geometryn) is deprecated;
  expect it to be removed in a future MySQL release. Use
  [`ST_GeometryN()`](gis-geometrycollection-property-functions.html#function_st-geometryn) instead.

* [`NumGeometries(gc)`](gis-geometrycollection-property-functions.html#function_numgeometries)

  [`ST_NumGeometries()`](gis-geometrycollection-property-functions.html#function_st-numgeometries) and
  [`NumGeometries()`](gis-geometrycollection-property-functions.html#function_numgeometries) are synonyms.
  For more information, see the description of
  [`ST_NumGeometries()`](gis-geometrycollection-property-functions.html#function_st-numgeometries).

  [`NumGeometries()`](gis-geometrycollection-property-functions.html#function_numgeometries) is
  deprecated; expect it to be removed in a future MySQL
  release. Use
  [`ST_NumGeometries()`](gis-geometrycollection-property-functions.html#function_st-numgeometries) instead.

* [`ST_GeometryN(gc,
  N)`](gis-geometrycollection-property-functions.html#function_st-geometryn)

  Returns the *`N`*-th geometry in the
  `GeometryCollection` value
  *`gc`*. Geometries are numbered
  beginning with 1. If any argument is `NULL`
  or the geometry argument is an empty geometry, the return
  value is `NULL`.

  ```sql
  mysql> SET @gc = 'GeometryCollection(Point(1 1),LineString(2 2, 3 3))';
  mysql> SELECT ST_AsText(ST_GeometryN(ST_GeomFromText(@gc),1));
  +-------------------------------------------------+
  | ST_AsText(ST_GeometryN(ST_GeomFromText(@gc),1)) |
  +-------------------------------------------------+
  | POINT(1 1)                                      |
  +-------------------------------------------------+
  ```

  [`ST_GeometryN()`](gis-geometrycollection-property-functions.html#function_st-geometryn) and
  [`GeometryN()`](gis-geometrycollection-property-functions.html#function_geometryn) are synonyms.

* [`ST_NumGeometries(gc)`](gis-geometrycollection-property-functions.html#function_st-numgeometries)

  Returns the number of geometries in the
  `GeometryCollection` value
  *`gc`*. If the argument is
  `NULL` or an empty geometry, the return
  value is `NULL`.

  ```sql
  mysql> SET @gc = 'GeometryCollection(Point(1 1),LineString(2 2, 3 3))';
  mysql> SELECT ST_NumGeometries(ST_GeomFromText(@gc));
  +----------------------------------------+
  | ST_NumGeometries(ST_GeomFromText(@gc)) |
  +----------------------------------------+
  |                                      2 |
  +----------------------------------------+
  ```

  [`ST_NumGeometries()`](gis-geometrycollection-property-functions.html#function_st-numgeometries) and
  [`NumGeometries()`](gis-geometrycollection-property-functions.html#function_numgeometries) are synonyms.