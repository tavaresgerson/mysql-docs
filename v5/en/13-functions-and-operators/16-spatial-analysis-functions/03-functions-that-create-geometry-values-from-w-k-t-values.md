### 12.16.3 Functions That Create Geometry Values from WKT Values

These functions take as arguments a Well-Known Text (WKT) representation and, optionally, a spatial reference system identifier (SRID). They return the corresponding geometry.

`ST_GeomFromText()` accepts a WKT value of any geometry type as its first argument. Other functions provide type-specific construction functions for construction of geometry values of each geometry type.

For a description of WKT format, see Well-Known Text (WKT) Format Format").

* `GeomCollFromText(wkt [, srid])`, `GeometryCollectionFromText(wkt [, srid])`

  `ST_GeomCollFromText()`, `ST_GeometryCollectionFromText()`, `ST_GeomCollFromTxt()`, `GeomCollFromText()`, and `GeometryCollectionFromText()` are synonyms. For more information, see the description of `ST_GeomCollFromText()`.

  `GeomCollFromText()` and `GeometryCollectionFromText()` are deprecated; expect them to be removed in a future MySQL release. Use `ST_GeomCollFromText()` and `ST_GeometryCollectionFromText()` instead.

* `GeomFromText(wkt [, srid])`, `GeometryFromText(wkt [, srid])`

  `ST_GeomFromText()`, `ST_GeometryFromText()`, `GeomFromText()`, and `GeometryFromText()` are synonyms. For more information, see the description of `ST_GeomFromText()`.

  `GeomFromText()` and `GeometryFromText()` are deprecated; expect them to be removed in a future MySQL release. Use `ST_GeomFromText()` and `ST_GeometryFromText()` instead.

* `LineFromText(wkt [, srid])`, `LineStringFromText(wkt [, srid])`

  `ST_LineFromText()`, `ST_LineStringFromText()`, `LineFromText()`, and `LineStringFromText()` are synonyms. For more information, see the description of `ST_LineFromText()`.

  `LineFromText()` and `LineStringFromText()` are deprecated; expect them to be removed in a future MySQL release. Use `ST_LineFromText()` and `ST_LineStringFromText()` instead.

* `MLineFromText(wkt [, srid])`, `MultiLineStringFromText(wkt [, srid])`

  `ST_MLineFromText()`, `ST_MultiLineStringFromText()`, `MLineFromText()`, and `MultiLineStringFromText()` are synonyms. For more information, see the description of `ST_MLineFromText()`.

  `MLineFromText()` and `MultiLineStringFromText()` are deprecated; expect them to be removed in a future MySQL release. Use `ST_MLineFromText()` and `ST_MultiLineStringFromText()` instead.

* `MPointFromText(wkt [, srid])`, `MultiPointFromText(wkt [, srid])`

  `ST_MPointFromText()`, `ST_MultiPointFromText()`, `MPointFromText()`, and `MultiPointFromText()` are synonyms. For more information, see the description of `ST_MPointFromText()`.

  `MPointFromText()` and `MultiPointFromText()` are deprecated; expect them to be removed in a future MySQL release. Use `ST_MPointFromText()` and `ST_MultiPointFromText()` instead.

* `MPolyFromText(wkt [, srid])`, `MultiPolygonFromText(wkt [, srid])`

  `ST_MPolyFromText()`, `ST_MultiPolygonFromText()`, `MPolyFromText()`, and `MultiPolygonFromText()` are synonyms. For more information, see the description of `ST_MPolyFromText()`.

  `MPolyFromText()` and `MultiPolygonFromText()` are deprecated; expect them to be removed in a future MySQL release. Use `ST_MPolyFromText()` and `ST_MultiPolygonFromText()` instead.

* `PointFromText(wkt [, srid])`

  `ST_PointFromText()` and `PointFromText()` are synonyms. For more information, see the description of `ST_PointFromText()`.

  `PointFromText()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_PointFromText()` instead.

* `PolyFromText(wkt [, srid])`, `PolygonFromText(wkt [, srid])`

  `ST_PolyFromText()`, `ST_PolygonFromText()`, `PolyFromText()`, and `PolygonFromText()` are synonyms. For more information, see the description of `ST_PolyFromText()`.

  `PolyFromText()` and `PolygonFromText()` are deprecated; expect them to be removed in a future MySQL release. Use `ST_PolyFromText()` and `ST_PolygonFromText()` instead.

* `ST_GeomCollFromText(wkt [, srid])`, `ST_GeometryCollectionFromText(wkt [, srid])`, `ST_GeomCollFromTxt(wkt [, srid])`

  Constructs a `GeometryCollection` value using its WKT representation and SRID.

  If the geometry argument is `NULL` or not a syntactically well-formed geometry, or if the SRID argument is `NULL`, the return value is `NULL`.

  ```sql
  mysql> SET @g = "MULTILINESTRING((10 10, 11 11), (9 9, 10 10))";
  mysql> SELECT ST_AsText(ST_GeomCollFromText(@g));
  +--------------------------------------------+
  | ST_AsText(ST_GeomCollFromText(@g))         |
  +--------------------------------------------+
  | MULTILINESTRING((10 10,11 11),(9 9,10 10)) |
  +--------------------------------------------+
  ```

  `ST_GeomCollFromText()`, `ST_GeometryCollectionFromText()`, `ST_GeomCollFromTxt()`, `GeomCollFromText()`, and `GeometryCollectionFromText()` are synonyms.

* `ST_GeomFromText(wkt [, srid])`, `ST_GeometryFromText(wkt [, srid])`

  Constructs a geometry value of any type using its WKT representation and SRID.

  If the geometry argument is `NULL` or not a syntactically well-formed geometry, or if the SRID argument is `NULL`, the return value is `NULL`.

  `ST_GeomFromText()`, `ST_GeometryFromText()`, `GeomFromText()`, and `GeometryFromText()` are synonyms.

* `ST_LineFromText(wkt [, srid])`, `ST_LineStringFromText(wkt [, srid])`

  Constructs a `LineString` value using its WKT representation and SRID.

  If the geometry argument is `NULL` or not a syntactically well-formed geometry, or if the SRID argument is `NULL`, the return value is `NULL`.

  `ST_LineFromText()`, `ST_LineStringFromText()`, `LineFromText()`, and `LineStringFromText()` are synonyms.

* `ST_MLineFromText(wkt [, srid])`, `ST_MultiLineStringFromText(wkt [, srid])`

  Constructs a `MultiLineString` value using its WKT representation and SRID.

  If the geometry argument is `NULL` or not a syntactically well-formed geometry, or if the SRID argument is `NULL`, the return value is `NULL`.

  `ST_MLineFromText()`, `ST_MultiLineStringFromText()`, `MLineFromText()`, and `MultiLineStringFromText()` are synonyms.

* `ST_MPointFromText(wkt [, srid])`, `ST_MultiPointFromText(wkt [, srid])`

  Constructs a `MultiPoint` value using its WKT representation and SRID.

  If the geometry argument is `NULL` or not a syntactically well-formed geometry, or if the SRID argument is `NULL`, the return value is `NULL`.

  Functions such as `ST_MPointFromText()` and `ST_GeomFromText()` that accept WKT-format representations of `MultiPoint` values permit individual points within values to be surrounded by parentheses. For example, both of the following function calls are valid:

  ```sql
  ST_MPointFromText('MULTIPOINT (1 1, 2 2, 3 3)')
  ST_MPointFromText('MULTIPOINT ((1 1), (2 2), (3 3))')
  ```

  `ST_MPointFromText()`, `ST_MultiPointFromText()`, `MPointFromText()`, and `MultiPointFromText()` are synonyms.

* `ST_MPolyFromText(wkt [, srid])`, `ST_MultiPolygonFromText(wkt [, srid])`

  Constructs a `MultiPolygon` value using its WKT representation and SRID.

  If the geometry argument is `NULL` or not a syntactically well-formed geometry, or if the SRID argument is `NULL`, the return value is `NULL`.

  `ST_MPolyFromText()`, `ST_MultiPolygonFromText()`, `MPolyFromText()`, and `MultiPolygonFromText()` are synonyms.

* `ST_PointFromText(wkt [, srid])`

  Constructs a `Point` value using its WKT representation and SRID.

  If the geometry argument is `NULL` or not a syntactically well-formed geometry, or if the SRID argument is `NULL`, the return value is `NULL`.

  `ST_PointFromText()` and `PointFromText()` are synonyms.

* `ST_PolyFromText(wkt [, srid])`, `ST_PolygonFromText(wkt [, srid])`

  Constructs a `Polygon` value using its WKT representation and SRID.

  If the geometry argument is `NULL` or not a syntactically well-formed geometry, or if the SRID argument is `NULL`, the return value is `NULL`.

  `ST_PolyFromText()`, `ST_PolygonFromText()`, `PolyFromText()`, and `PolygonFromText()` are synonyms.
