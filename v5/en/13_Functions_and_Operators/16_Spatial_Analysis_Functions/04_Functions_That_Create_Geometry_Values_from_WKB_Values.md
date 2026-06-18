### 12.16.4 Functions That Create Geometry Values from WKB Values

These functions take as arguments a
[`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") containing a Well-Known Binary
(WKB) representation and, optionally, a spatial reference system
identifier (SRID). They return the corresponding geometry.

[`ST_GeomFromWKB()`](gis-wkb-functions.html#function_st-geomfromwkb) accepts a WKB
value of any geometry type as its first argument. Other functions
provide type-specific construction functions for construction of
geometry values of each geometry type.

These functions also accept geometry objects as returned by the
functions in [Section 12.16.5, “MySQL-Specific Functions That Create Geometry Values”](gis-mysql-specific-functions.html "12.16.5 MySQL-Specific Functions That Create Geometry Values"). Thus,
those functions may be used to provide the first argument to the
functions in this section. However, as of MySQL 5.7.19, use of
geometry arguments is deprecated and generates a warning. Geometry
arguments are not accepted in MySQL 8.0. To migrate
calls from using geometry arguments to using WKB arguments, follow
these guidelines:

For a description of WKB format, see
[Well-Known Binary (WKB) Format](gis-data-formats.html#gis-wkb-format "Well-Known Binary (WKB) Format").

* Rewrite constructs such as `ST_GeomFromWKB(Point(0,
  0))` as `Point(0, 0)`.

* Rewrite constructs such as `ST_GeomFromWKB(Point(0,
  0), 4326)` as
  `ST_GeomFromWKB(ST_AsWKB(Point(0, 0)),
  4326)`. (Alternatively, in MySQL 8.0, you
  can use `ST_SRID(Point(0, 0), 4326)`.)

* [`GeomCollFromWKB(wkb
  [, srid])`](gis-wkb-functions.html#function_geomcollfromwkb),
  [`GeometryCollectionFromWKB(wkb
  [, srid])`](gis-wkb-functions.html#function_geomcollfromwkb)

  [`ST_GeomCollFromWKB()`](gis-wkb-functions.html#function_st-geomcollfromwkb),
  [`ST_GeometryCollectionFromWKB()`](gis-wkb-functions.html#function_st-geomcollfromwkb),
  [`GeomCollFromWKB()`](gis-wkb-functions.html#function_geomcollfromwkb), and
  [`GeometryCollectionFromWKB()`](gis-wkb-functions.html#function_geomcollfromwkb)
  are synonyms. For more information, see the description of
  [`ST_GeomCollFromWKB()`](gis-wkb-functions.html#function_st-geomcollfromwkb).

  [`GeomCollFromWKB()`](gis-wkb-functions.html#function_geomcollfromwkb) and
  [`GeometryCollectionFromWKB()`](gis-wkb-functions.html#function_geomcollfromwkb)
  are deprecated; expect them to be removed in a future MySQL
  release. Use
  [`ST_GeomCollFromWKB()`](gis-wkb-functions.html#function_st-geomcollfromwkb) and
  [`ST_GeometryCollectionFromWKB()`](gis-wkb-functions.html#function_st-geomcollfromwkb)
  instead.

* [`GeomFromWKB(wkb
  [, srid])`](gis-wkb-functions.html#function_geomfromwkb),
  [`GeometryFromWKB(wkb
  [, srid])`](gis-wkb-functions.html#function_geomfromwkb)

  [`ST_GeomFromWKB()`](gis-wkb-functions.html#function_st-geomfromwkb),
  [`ST_GeometryFromWKB()`](gis-wkb-functions.html#function_st-geomfromwkb),
  [`GeomFromWKB()`](gis-wkb-functions.html#function_geomfromwkb), and
  [`GeometryFromWKB()`](gis-wkb-functions.html#function_geomfromwkb)
  are synonyms. For more information, see the description of
  [`ST_GeomFromWKB()`](gis-wkb-functions.html#function_st-geomfromwkb).

  [`GeomFromWKB()`](gis-wkb-functions.html#function_geomfromwkb) and
  [`GeometryFromWKB()`](gis-wkb-functions.html#function_geomfromwkb)
  are deprecated; expect them to be removed in a future MySQL
  release. Use [`ST_GeomFromWKB()`](gis-wkb-functions.html#function_st-geomfromwkb)
  and
  [`ST_GeometryFromWKB()`](gis-wkb-functions.html#function_st-geomfromwkb)
  instead.

* [`LineFromWKB(wkb
  [, srid])`](gis-wkb-functions.html#function_linefromwkb),
  [`LineStringFromWKB(wkb
  [, srid])`](gis-wkb-functions.html#function_linefromwkb)

  [`ST_LineFromWKB()`](gis-wkb-functions.html#function_st-linefromwkb),
  [`ST_LineStringFromWKB()`](gis-wkb-functions.html#function_st-linefromwkb),
  [`LineFromWKB()`](gis-wkb-functions.html#function_linefromwkb), and
  [`LineStringFromWKB()`](gis-wkb-functions.html#function_linefromwkb)
  are synonyms. For more information, see the description of
  [`ST_LineFromWKB()`](gis-wkb-functions.html#function_st-linefromwkb).

  [`LineFromWKB()`](gis-wkb-functions.html#function_linefromwkb) and
  [`LineStringFromWKB()`](gis-wkb-functions.html#function_linefromwkb)
  are deprecated; expect them to be removed in a future MySQL
  release. Use [`ST_LineFromWKB()`](gis-wkb-functions.html#function_st-linefromwkb)
  and
  [`ST_LineStringFromWKB()`](gis-wkb-functions.html#function_st-linefromwkb)
  instead.

* [`MLineFromWKB(wkb
  [, srid])`](gis-wkb-functions.html#function_mlinefromwkb),
  [`MultiLineStringFromWKB(wkb
  [, srid])`](gis-wkb-functions.html#function_mlinefromwkb)

  [`ST_MLineFromWKB()`](gis-wkb-functions.html#function_st-mlinefromwkb),
  [`ST_MultiLineStringFromWKB()`](gis-wkb-functions.html#function_st-mlinefromwkb),
  [`MLineFromWKB()`](gis-wkb-functions.html#function_mlinefromwkb), and
  [`MultiLineStringFromWKB()`](gis-wkb-functions.html#function_mlinefromwkb)
  are synonyms. For more information, see the description of
  [`ST_MLineFromWKB()`](gis-wkb-functions.html#function_st-mlinefromwkb).

  [`MLineFromWKB()`](gis-wkb-functions.html#function_mlinefromwkb) and
  [`MultiLineStringFromWKB()`](gis-wkb-functions.html#function_mlinefromwkb)
  are deprecated; expect them to be removed in a future MySQL
  release. Use [`ST_MLineFromWKB()`](gis-wkb-functions.html#function_st-mlinefromwkb)
  and
  [`ST_MultiLineStringFromWKB()`](gis-wkb-functions.html#function_st-mlinefromwkb)
  instead.

* [`MPointFromWKB(wkb
  [, srid])`](gis-wkb-functions.html#function_mpointfromwkb),
  [`MultiPointFromWKB(wkb
  [, srid])`](gis-wkb-functions.html#function_mpointfromwkb)

  [`ST_MPointFromWKB()`](gis-wkb-functions.html#function_st-mpointfromwkb),
  [`ST_MultiPointFromWKB()`](gis-wkb-functions.html#function_st-mpointfromwkb),
  [`MPointFromWKB()`](gis-wkb-functions.html#function_mpointfromwkb), and
  [`MultiPointFromWKB()`](gis-wkb-functions.html#function_mpointfromwkb)
  are synonyms. For more information, see the description of
  [`ST_MPointFromWKB()`](gis-wkb-functions.html#function_st-mpointfromwkb).

  [`MPointFromWKB()`](gis-wkb-functions.html#function_mpointfromwkb) and
  [`MultiPointFromWKB()`](gis-wkb-functions.html#function_mpointfromwkb)
  are deprecated; expect them to be removed in a future MySQL
  release. Use [`ST_MPointFromWKB()`](gis-wkb-functions.html#function_st-mpointfromwkb)
  and
  [`ST_MultiPointFromWKB()`](gis-wkb-functions.html#function_st-mpointfromwkb)
  instead.

* [`MPolyFromWKB(wkb
  [, srid])`](gis-wkb-functions.html#function_mpolyfromwkb),
  [`MultiPolygonFromWKB(wkb
  [, srid])`](gis-wkb-functions.html#function_mpolyfromwkb)

  [`ST_MPolyFromWKB()`](gis-wkb-functions.html#function_st-mpolyfromwkb),
  [`ST_MultiPolygonFromWKB()`](gis-wkb-functions.html#function_st-mpolyfromwkb),
  [`MPolyFromWKB()`](gis-wkb-functions.html#function_mpolyfromwkb), and
  [`MultiPolygonFromWKB()`](gis-wkb-functions.html#function_mpolyfromwkb)
  are synonyms. For more information, see the description of
  [`ST_MPolyFromWKB()`](gis-wkb-functions.html#function_st-mpolyfromwkb).

  [`MPolyFromWKB()`](gis-wkb-functions.html#function_mpolyfromwkb) and
  [`MultiPolygonFromWKB()`](gis-wkb-functions.html#function_mpolyfromwkb)
  are deprecated; expect them to be removed in a future MySQL
  release. Use [`ST_MPolyFromWKB()`](gis-wkb-functions.html#function_st-mpolyfromwkb)
  and
  [`ST_MultiPolygonFromWKB()`](gis-wkb-functions.html#function_st-mpolyfromwkb)
  instead.

* [`PointFromWKB(wkb
  [, srid])`](gis-wkb-functions.html#function_pointfromwkb)

  [`ST_PointFromWKB()`](gis-wkb-functions.html#function_st-pointfromwkb) and
  [`PointFromWKB()`](gis-wkb-functions.html#function_pointfromwkb) are synonyms.
  For more information, see the description of
  [`ST_PointFromWKB()`](gis-wkb-functions.html#function_st-pointfromwkb).

  [`PointFromWKB()`](gis-wkb-functions.html#function_pointfromwkb) is deprecated;
  expect it to be removed in a future MySQL release. Use
  [`ST_PointFromWKB()`](gis-wkb-functions.html#function_st-pointfromwkb) instead.

* [`PolyFromWKB(wkb
  [, srid])`](gis-wkb-functions.html#function_polyfromwkb),
  [`PolygonFromWKB(wkb
  [, srid])`](gis-wkb-functions.html#function_polyfromwkb)

  [`ST_PolyFromWKB()`](gis-wkb-functions.html#function_st-polyfromwkb),
  [`ST_PolygonFromWKB()`](gis-wkb-functions.html#function_st-polyfromwkb),
  [`PolyFromWKB()`](gis-wkb-functions.html#function_polyfromwkb), and
  [`PolygonFromWKB()`](gis-wkb-functions.html#function_polyfromwkb)
  are synonyms. For more information, see the description of
  [`ST_PolyFromWKB()`](gis-wkb-functions.html#function_st-polyfromwkb).

  [`PolyFromWKB()`](gis-wkb-functions.html#function_polyfromwkb) and
  [`PolygonFromWKB()`](gis-wkb-functions.html#function_polyfromwkb)
  are deprecated; expect them to be removed in a future MySQL
  release. Use [`ST_PolyFromWKB()`](gis-wkb-functions.html#function_st-polyfromwkb)
  and
  [`ST_PolygonFromWKB()`](gis-wkb-functions.html#function_st-polyfromwkb)
  instead.

* [`ST_GeomCollFromWKB(wkb
  [, srid])`](gis-wkb-functions.html#function_st-geomcollfromwkb),
  [`ST_GeometryCollectionFromWKB(wkb
  [, srid])`](gis-wkb-functions.html#function_st-geomcollfromwkb)

  Constructs a `GeometryCollection` value using
  its WKB representation and SRID.

  The result is `NULL` if the WKB or SRID
  argument is `NULL`.

  [`ST_GeomCollFromWKB()`](gis-wkb-functions.html#function_st-geomcollfromwkb),
  [`ST_GeometryCollectionFromWKB()`](gis-wkb-functions.html#function_st-geomcollfromwkb),
  [`GeomCollFromWKB()`](gis-wkb-functions.html#function_geomcollfromwkb), and
  [`GeometryCollectionFromWKB()`](gis-wkb-functions.html#function_geomcollfromwkb)
  are synonyms.

* [`ST_GeomFromWKB(wkb
  [, srid])`](gis-wkb-functions.html#function_st-geomfromwkb),
  [`ST_GeometryFromWKB(wkb
  [, srid])`](gis-wkb-functions.html#function_st-geomfromwkb)

  Constructs a geometry value of any type using its WKB
  representation and SRID.

  The result is `NULL` if the WKB or SRID
  argument is `NULL`.

  [`ST_GeomFromWKB()`](gis-wkb-functions.html#function_st-geomfromwkb),
  [`ST_GeometryFromWKB()`](gis-wkb-functions.html#function_st-geomfromwkb),
  [`GeomFromWKB()`](gis-wkb-functions.html#function_geomfromwkb), and
  [`GeometryFromWKB()`](gis-wkb-functions.html#function_geomfromwkb)
  are synonyms.

* [`ST_LineFromWKB(wkb
  [, srid])`](gis-wkb-functions.html#function_st-linefromwkb),
  [`ST_LineStringFromWKB(wkb
  [, srid])`](gis-wkb-functions.html#function_st-linefromwkb)

  Constructs a `LineString` value using its WKB
  representation and SRID.

  The result is `NULL` if the WKB or SRID
  argument is `NULL`.

  [`ST_LineFromWKB()`](gis-wkb-functions.html#function_st-linefromwkb),
  [`ST_LineStringFromWKB()`](gis-wkb-functions.html#function_st-linefromwkb),
  [`LineFromWKB()`](gis-wkb-functions.html#function_linefromwkb), and
  [`LineStringFromWKB()`](gis-wkb-functions.html#function_linefromwkb)
  are synonyms.

* [`ST_MLineFromWKB(wkb
  [, srid])`](gis-wkb-functions.html#function_st-mlinefromwkb),
  [`ST_MultiLineStringFromWKB(wkb
  [, srid])`](gis-wkb-functions.html#function_st-mlinefromwkb)

  Constructs a `MultiLineString` value using
  its WKB representation and SRID.

  The result is `NULL` if the WKB or SRID
  argument is `NULL`.

  [`ST_MLineFromWKB()`](gis-wkb-functions.html#function_st-mlinefromwkb),
  [`ST_MultiLineStringFromWKB()`](gis-wkb-functions.html#function_st-mlinefromwkb),
  [`MLineFromWKB()`](gis-wkb-functions.html#function_mlinefromwkb), and
  [`MultiLineStringFromWKB()`](gis-wkb-functions.html#function_mlinefromwkb)
  are synonyms.

* [`ST_MPointFromWKB(wkb
  [, srid])`](gis-wkb-functions.html#function_st-mpointfromwkb),
  [`ST_MultiPointFromWKB(wkb
  [, srid])`](gis-wkb-functions.html#function_st-mpointfromwkb)

  Constructs a `MultiPoint` value using its WKB
  representation and SRID.

  The result is `NULL` if the WKB or SRID
  argument is `NULL`.

  [`ST_MPointFromWKB()`](gis-wkb-functions.html#function_st-mpointfromwkb),
  [`ST_MultiPointFromWKB()`](gis-wkb-functions.html#function_st-mpointfromwkb),
  [`MPointFromWKB()`](gis-wkb-functions.html#function_mpointfromwkb), and
  [`MultiPointFromWKB()`](gis-wkb-functions.html#function_mpointfromwkb)
  are synonyms.

* [`ST_MPolyFromWKB(wkb
  [, srid])`](gis-wkb-functions.html#function_st-mpolyfromwkb),
  [`ST_MultiPolygonFromWKB(wkb
  [, srid])`](gis-wkb-functions.html#function_st-mpolyfromwkb)

  Constructs a `MultiPolygon` value using its
  WKB representation and SRID.

  The result is `NULL` if the WKB or SRID
  argument is `NULL`.

  [`ST_MPolyFromWKB()`](gis-wkb-functions.html#function_st-mpolyfromwkb),
  [`ST_MultiPolygonFromWKB()`](gis-wkb-functions.html#function_st-mpolyfromwkb),
  [`MPolyFromWKB()`](gis-wkb-functions.html#function_mpolyfromwkb), and
  [`MultiPolygonFromWKB()`](gis-wkb-functions.html#function_mpolyfromwkb)
  are synonyms.

* [`ST_PointFromWKB(wkb
  [, srid])`](gis-wkb-functions.html#function_st-pointfromwkb)

  Constructs a `Point` value using its WKB
  representation and SRID.

  The result is `NULL` if the WKB or SRID
  argument is `NULL`.

  [`ST_PointFromWKB()`](gis-wkb-functions.html#function_st-pointfromwkb) and
  [`PointFromWKB()`](gis-wkb-functions.html#function_pointfromwkb) are synonyms.

* [`ST_PolyFromWKB(wkb
  [, srid])`](gis-wkb-functions.html#function_st-polyfromwkb),
  [`ST_PolygonFromWKB(wkb
  [, srid])`](gis-wkb-functions.html#function_st-polyfromwkb)

  Constructs a `Polygon` value using its WKB
  representation and SRID.

  The result is `NULL` if the WKB or SRID
  argument is `NULL`.

  [`ST_PolyFromWKB()`](gis-wkb-functions.html#function_st-polyfromwkb),
  [`ST_PolygonFromWKB()`](gis-wkb-functions.html#function_st-polyfromwkb),
  [`PolyFromWKB()`](gis-wkb-functions.html#function_polyfromwkb), and
  [`PolygonFromWKB()`](gis-wkb-functions.html#function_polyfromwkb)
  are synonyms.