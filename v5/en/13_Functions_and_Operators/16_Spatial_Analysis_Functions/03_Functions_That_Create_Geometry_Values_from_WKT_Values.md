### 12.16.3 Functions That Create Geometry Values from WKT Values

These functions take as arguments a Well-Known Text (WKT)
representation and, optionally, a spatial reference system
identifier (SRID). They return the corresponding geometry.

[`ST_GeomFromText()`](gis-wkt-functions.html#function_st-geomfromtext) accepts a WKT
value of any geometry type as its first argument. Other functions
provide type-specific construction functions for construction of
geometry values of each geometry type.

For a description of WKT format, see
[Well-Known Text (WKT) Format](gis-data-formats.html#gis-wkt-format "Well-Known Text (WKT) Format").

* [`GeomCollFromText(wkt
  [, srid])`](gis-wkt-functions.html#function_geomcollfromtext),
  [`GeometryCollectionFromText(wkt
  [, srid])`](gis-wkt-functions.html#function_geomcollfromtext)

  [`ST_GeomCollFromText()`](gis-wkt-functions.html#function_st-geomcollfromtext),
  [`ST_GeometryCollectionFromText()`](gis-wkt-functions.html#function_st-geomcollfromtext),
  [`ST_GeomCollFromTxt()`](gis-wkt-functions.html#function_st-geomcollfromtext),
  [`GeomCollFromText()`](gis-wkt-functions.html#function_geomcollfromtext), and
  [`GeometryCollectionFromText()`](gis-wkt-functions.html#function_geomcollfromtext)
  are synonyms. For more information, see the description of
  [`ST_GeomCollFromText()`](gis-wkt-functions.html#function_st-geomcollfromtext).

  [`GeomCollFromText()`](gis-wkt-functions.html#function_geomcollfromtext) and
  [`GeometryCollectionFromText()`](gis-wkt-functions.html#function_geomcollfromtext)
  are deprecated; expect them to be removed in a future MySQL
  release. Use
  [`ST_GeomCollFromText()`](gis-wkt-functions.html#function_st-geomcollfromtext) and
  [`ST_GeometryCollectionFromText()`](gis-wkt-functions.html#function_st-geomcollfromtext)
  instead.

* [`GeomFromText(wkt
  [, srid])`](gis-wkt-functions.html#function_geomfromtext),
  [`GeometryFromText(wkt
  [, srid])`](gis-wkt-functions.html#function_geomfromtext)

  [`ST_GeomFromText()`](gis-wkt-functions.html#function_st-geomfromtext),
  [`ST_GeometryFromText()`](gis-wkt-functions.html#function_st-geomfromtext),
  [`GeomFromText()`](gis-wkt-functions.html#function_geomfromtext), and
  [`GeometryFromText()`](gis-wkt-functions.html#function_geomfromtext)
  are synonyms. For more information, see the description of
  [`ST_GeomFromText()`](gis-wkt-functions.html#function_st-geomfromtext).

  [`GeomFromText()`](gis-wkt-functions.html#function_geomfromtext) and
  [`GeometryFromText()`](gis-wkt-functions.html#function_geomfromtext)
  are deprecated; expect them to be removed in a future MySQL
  release. Use [`ST_GeomFromText()`](gis-wkt-functions.html#function_st-geomfromtext)
  and
  [`ST_GeometryFromText()`](gis-wkt-functions.html#function_st-geomfromtext)
  instead.

* [`LineFromText(wkt
  [, srid])`](gis-wkt-functions.html#function_linefromtext),
  [`LineStringFromText(wkt
  [, srid])`](gis-wkt-functions.html#function_linefromtext)

  [`ST_LineFromText()`](gis-wkt-functions.html#function_st-linefromtext),
  [`ST_LineStringFromText()`](gis-wkt-functions.html#function_st-linefromtext),
  [`LineFromText()`](gis-wkt-functions.html#function_linefromtext), and
  [`LineStringFromText()`](gis-wkt-functions.html#function_linefromtext)
  are synonyms. For more information, see the description of
  [`ST_LineFromText()`](gis-wkt-functions.html#function_st-linefromtext).

  [`LineFromText()`](gis-wkt-functions.html#function_linefromtext) and
  [`LineStringFromText()`](gis-wkt-functions.html#function_linefromtext)
  are deprecated; expect them to be removed in a future MySQL
  release. Use [`ST_LineFromText()`](gis-wkt-functions.html#function_st-linefromtext)
  and
  [`ST_LineStringFromText()`](gis-wkt-functions.html#function_st-linefromtext)
  instead.

* [`MLineFromText(wkt
  [, srid])`](gis-wkt-functions.html#function_mlinefromtext),
  [`MultiLineStringFromText(wkt
  [, srid])`](gis-wkt-functions.html#function_mlinefromtext)

  [`ST_MLineFromText()`](gis-wkt-functions.html#function_st-mlinefromtext),
  [`ST_MultiLineStringFromText()`](gis-wkt-functions.html#function_st-mlinefromtext),
  [`MLineFromText()`](gis-wkt-functions.html#function_mlinefromtext), and
  [`MultiLineStringFromText()`](gis-wkt-functions.html#function_mlinefromtext)
  are synonyms. For more information, see the description of
  [`ST_MLineFromText()`](gis-wkt-functions.html#function_st-mlinefromtext).

  [`MLineFromText()`](gis-wkt-functions.html#function_mlinefromtext) and
  [`MultiLineStringFromText()`](gis-wkt-functions.html#function_mlinefromtext)
  are deprecated; expect them to be removed in a future MySQL
  release. Use [`ST_MLineFromText()`](gis-wkt-functions.html#function_st-mlinefromtext)
  and
  [`ST_MultiLineStringFromText()`](gis-wkt-functions.html#function_st-mlinefromtext)
  instead.

* [`MPointFromText(wkt
  [, srid])`](gis-wkt-functions.html#function_mpointfromtext),
  [`MultiPointFromText(wkt
  [, srid])`](gis-wkt-functions.html#function_mpointfromtext)

  [`ST_MPointFromText()`](gis-wkt-functions.html#function_st-mpointfromtext),
  [`ST_MultiPointFromText()`](gis-wkt-functions.html#function_st-mpointfromtext),
  [`MPointFromText()`](gis-wkt-functions.html#function_mpointfromtext), and
  [`MultiPointFromText()`](gis-wkt-functions.html#function_mpointfromtext)
  are synonyms. For more information, see the description of
  [`ST_MPointFromText()`](gis-wkt-functions.html#function_st-mpointfromtext).

  [`MPointFromText()`](gis-wkt-functions.html#function_mpointfromtext) and
  [`MultiPointFromText()`](gis-wkt-functions.html#function_mpointfromtext)
  are deprecated; expect them to be removed in a future MySQL
  release. Use
  [`ST_MPointFromText()`](gis-wkt-functions.html#function_st-mpointfromtext) and
  [`ST_MultiPointFromText()`](gis-wkt-functions.html#function_st-mpointfromtext)
  instead.

* [`MPolyFromText(wkt
  [, srid])`](gis-wkt-functions.html#function_mpolyfromtext),
  [`MultiPolygonFromText(wkt
  [, srid])`](gis-wkt-functions.html#function_mpolyfromtext)

  [`ST_MPolyFromText()`](gis-wkt-functions.html#function_st-mpolyfromtext),
  [`ST_MultiPolygonFromText()`](gis-wkt-functions.html#function_st-mpolyfromtext),
  [`MPolyFromText()`](gis-wkt-functions.html#function_mpolyfromtext), and
  [`MultiPolygonFromText()`](gis-wkt-functions.html#function_mpolyfromtext)
  are synonyms. For more information, see the description of
  [`ST_MPolyFromText()`](gis-wkt-functions.html#function_st-mpolyfromtext).

  [`MPolyFromText()`](gis-wkt-functions.html#function_mpolyfromtext) and
  [`MultiPolygonFromText()`](gis-wkt-functions.html#function_mpolyfromtext)
  are deprecated; expect them to be removed in a future MySQL
  release. Use [`ST_MPolyFromText()`](gis-wkt-functions.html#function_st-mpolyfromtext)
  and
  [`ST_MultiPolygonFromText()`](gis-wkt-functions.html#function_st-mpolyfromtext)
  instead.

* [`PointFromText(wkt
  [, srid])`](gis-wkt-functions.html#function_pointfromtext)

  [`ST_PointFromText()`](gis-wkt-functions.html#function_st-pointfromtext) and
  [`PointFromText()`](gis-wkt-functions.html#function_pointfromtext) are synonyms.
  For more information, see the description of
  [`ST_PointFromText()`](gis-wkt-functions.html#function_st-pointfromtext).

  [`PointFromText()`](gis-wkt-functions.html#function_pointfromtext) is deprecated;
  expect it to be removed in a future MySQL release. Use
  [`ST_PointFromText()`](gis-wkt-functions.html#function_st-pointfromtext) instead.

* [`PolyFromText(wkt
  [, srid])`](gis-wkt-functions.html#function_polyfromtext),
  [`PolygonFromText(wkt
  [, srid])`](gis-wkt-functions.html#function_polyfromtext)

  [`ST_PolyFromText()`](gis-wkt-functions.html#function_st-polyfromtext),
  [`ST_PolygonFromText()`](gis-wkt-functions.html#function_st-polyfromtext),
  [`PolyFromText()`](gis-wkt-functions.html#function_polyfromtext), and
  [`PolygonFromText()`](gis-wkt-functions.html#function_polyfromtext)
  are synonyms. For more information, see the description of
  [`ST_PolyFromText()`](gis-wkt-functions.html#function_st-polyfromtext).

  [`PolyFromText()`](gis-wkt-functions.html#function_polyfromtext) and
  [`PolygonFromText()`](gis-wkt-functions.html#function_polyfromtext)
  are deprecated; expect them to be removed in a future MySQL
  release. Use [`ST_PolyFromText()`](gis-wkt-functions.html#function_st-polyfromtext)
  and
  [`ST_PolygonFromText()`](gis-wkt-functions.html#function_st-polyfromtext)
  instead.

* [`ST_GeomCollFromText(wkt
  [, srid])`](gis-wkt-functions.html#function_st-geomcollfromtext),
  [`ST_GeometryCollectionFromText(wkt
  [, srid])`](gis-wkt-functions.html#function_st-geomcollfromtext),
  [`ST_GeomCollFromTxt(wkt
  [, srid])`](gis-wkt-functions.html#function_st-geomcollfromtext)

  Constructs a `GeometryCollection` value using
  its WKT representation and SRID.

  If the geometry argument is `NULL` or not a
  syntactically well-formed geometry, or if the SRID argument is
  `NULL`, the return value is
  `NULL`.

  ```sql
  mysql> SET @g = "MULTILINESTRING((10 10, 11 11), (9 9, 10 10))";
  mysql> SELECT ST_AsText(ST_GeomCollFromText(@g));
  +--------------------------------------------+
  | ST_AsText(ST_GeomCollFromText(@g))         |
  +--------------------------------------------+
  | MULTILINESTRING((10 10,11 11),(9 9,10 10)) |
  +--------------------------------------------+
  ```

  [`ST_GeomCollFromText()`](gis-wkt-functions.html#function_st-geomcollfromtext),
  [`ST_GeometryCollectionFromText()`](gis-wkt-functions.html#function_st-geomcollfromtext),
  [`ST_GeomCollFromTxt()`](gis-wkt-functions.html#function_st-geomcollfromtext),
  [`GeomCollFromText()`](gis-wkt-functions.html#function_geomcollfromtext), and
  [`GeometryCollectionFromText()`](gis-wkt-functions.html#function_geomcollfromtext)
  are synonyms.

* [`ST_GeomFromText(wkt
  [, srid])`](gis-wkt-functions.html#function_st-geomfromtext),
  [`ST_GeometryFromText(wkt
  [, srid])`](gis-wkt-functions.html#function_st-geomfromtext)

  Constructs a geometry value of any type using its WKT
  representation and SRID.

  If the geometry argument is `NULL` or not a
  syntactically well-formed geometry, or if the SRID argument is
  `NULL`, the return value is
  `NULL`.

  [`ST_GeomFromText()`](gis-wkt-functions.html#function_st-geomfromtext),
  [`ST_GeometryFromText()`](gis-wkt-functions.html#function_st-geomfromtext),
  [`GeomFromText()`](gis-wkt-functions.html#function_geomfromtext), and
  [`GeometryFromText()`](gis-wkt-functions.html#function_geomfromtext)
  are synonyms.

* [`ST_LineFromText(wkt
  [, srid])`](gis-wkt-functions.html#function_st-linefromtext),
  [`ST_LineStringFromText(wkt
  [, srid])`](gis-wkt-functions.html#function_st-linefromtext)

  Constructs a `LineString` value using its WKT
  representation and SRID.

  If the geometry argument is `NULL` or not a
  syntactically well-formed geometry, or if the SRID argument is
  `NULL`, the return value is
  `NULL`.

  [`ST_LineFromText()`](gis-wkt-functions.html#function_st-linefromtext),
  [`ST_LineStringFromText()`](gis-wkt-functions.html#function_st-linefromtext),
  [`LineFromText()`](gis-wkt-functions.html#function_linefromtext), and
  [`LineStringFromText()`](gis-wkt-functions.html#function_linefromtext)
  are synonyms.

* [`ST_MLineFromText(wkt
  [, srid])`](gis-wkt-functions.html#function_st-mlinefromtext),
  [`ST_MultiLineStringFromText(wkt
  [, srid])`](gis-wkt-functions.html#function_st-mlinefromtext)

  Constructs a `MultiLineString` value using
  its WKT representation and SRID.

  If the geometry argument is `NULL` or not a
  syntactically well-formed geometry, or if the SRID argument is
  `NULL`, the return value is
  `NULL`.

  [`ST_MLineFromText()`](gis-wkt-functions.html#function_st-mlinefromtext),
  [`ST_MultiLineStringFromText()`](gis-wkt-functions.html#function_st-mlinefromtext),
  [`MLineFromText()`](gis-wkt-functions.html#function_mlinefromtext), and
  [`MultiLineStringFromText()`](gis-wkt-functions.html#function_mlinefromtext)
  are synonyms.

* [`ST_MPointFromText(wkt
  [, srid])`](gis-wkt-functions.html#function_st-mpointfromtext),
  [`ST_MultiPointFromText(wkt
  [, srid])`](gis-wkt-functions.html#function_st-mpointfromtext)

  Constructs a `MultiPoint` value using its WKT
  representation and SRID.

  If the geometry argument is `NULL` or not a
  syntactically well-formed geometry, or if the SRID argument is
  `NULL`, the return value is
  `NULL`.

  Functions such as
  [`ST_MPointFromText()`](gis-wkt-functions.html#function_st-mpointfromtext) and
  [`ST_GeomFromText()`](gis-wkt-functions.html#function_st-geomfromtext) that accept
  WKT-format representations of `MultiPoint`
  values permit individual points within values to be surrounded
  by parentheses. For example, both of the following function
  calls are valid:

  ```sql
  ST_MPointFromText('MULTIPOINT (1 1, 2 2, 3 3)')
  ST_MPointFromText('MULTIPOINT ((1 1), (2 2), (3 3))')
  ```

  [`ST_MPointFromText()`](gis-wkt-functions.html#function_st-mpointfromtext),
  [`ST_MultiPointFromText()`](gis-wkt-functions.html#function_st-mpointfromtext),
  [`MPointFromText()`](gis-wkt-functions.html#function_mpointfromtext), and
  [`MultiPointFromText()`](gis-wkt-functions.html#function_mpointfromtext)
  are synonyms.

* [`ST_MPolyFromText(wkt
  [, srid])`](gis-wkt-functions.html#function_st-mpolyfromtext),
  [`ST_MultiPolygonFromText(wkt
  [, srid])`](gis-wkt-functions.html#function_st-mpolyfromtext)

  Constructs a `MultiPolygon` value using its
  WKT representation and SRID.

  If the geometry argument is `NULL` or not a
  syntactically well-formed geometry, or if the SRID argument is
  `NULL`, the return value is
  `NULL`.

  [`ST_MPolyFromText()`](gis-wkt-functions.html#function_st-mpolyfromtext),
  [`ST_MultiPolygonFromText()`](gis-wkt-functions.html#function_st-mpolyfromtext),
  [`MPolyFromText()`](gis-wkt-functions.html#function_mpolyfromtext), and
  [`MultiPolygonFromText()`](gis-wkt-functions.html#function_mpolyfromtext)
  are synonyms.

* [`ST_PointFromText(wkt
  [, srid])`](gis-wkt-functions.html#function_st-pointfromtext)

  Constructs a `Point` value using its WKT
  representation and SRID.

  If the geometry argument is `NULL` or not a
  syntactically well-formed geometry, or if the SRID argument is
  `NULL`, the return value is
  `NULL`.

  [`ST_PointFromText()`](gis-wkt-functions.html#function_st-pointfromtext) and
  [`PointFromText()`](gis-wkt-functions.html#function_pointfromtext) are synonyms.

* [`ST_PolyFromText(wkt
  [, srid])`](gis-wkt-functions.html#function_st-polyfromtext),
  [`ST_PolygonFromText(wkt
  [, srid])`](gis-wkt-functions.html#function_st-polyfromtext)

  Constructs a `Polygon` value using its WKT
  representation and SRID.

  If the geometry argument is `NULL` or not a
  syntactically well-formed geometry, or if the SRID argument is
  `NULL`, the return value is
  `NULL`.

  [`ST_PolyFromText()`](gis-wkt-functions.html#function_st-polyfromtext),
  [`ST_PolygonFromText()`](gis-wkt-functions.html#function_st-polyfromtext),
  [`PolyFromText()`](gis-wkt-functions.html#function_polyfromtext), and
  [`PolygonFromText()`](gis-wkt-functions.html#function_polyfromtext)
  are synonyms.