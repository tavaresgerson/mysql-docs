#### 12.16.7.1 General Geometry Property Functions

The functions listed in this section do not restrict their argument and accept a geometry value of any type.

* `Dimension(g)`

  `ST_Dimension()` and `Dimension()` are synonyms. For more information, see the description of `ST_Dimension()`.

  `Dimension()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_Dimension()` instead.

* `Envelope(g)`

  `ST_Envelope()` and `Envelope()` are synonyms. For more information, see the description of `ST_Envelope()`.

  `Envelope()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_Envelope()` instead.

* `GeometryType(g)`

  `ST_GeometryType()` and `GeometryType()` are synonyms. For more information, see the description of `ST_GeometryType()`.

  `GeometryType()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_GeometryType()` instead.

* `IsEmpty(g)`

  `ST_IsEmpty()` and `IsEmpty()` are synonyms. For more information, see the description of `ST_IsEmpty()`.

  `IsEmpty()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_IsEmpty()` instead.

* `IsSimple(g)`

  `ST_IsSimple()` and `IsSimple()` are synonyms. For more information, see the description of `ST_IsSimple()`.

  `IsSimple()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_IsSimple()` instead.

* `SRID(g)`

  `ST_SRID()` and `SRID()` are synonyms. For more information, see the description of `ST_SRID()`.

  `SRID()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_SRID()` instead.

* `ST_Dimension(g)`

  Returns the inherent dimension of the geometry value *`g`*, or `NULL` if the argument is `NULL`. The dimension can be −1, 0, 1, or 2. The meaning of these values is given in Section 11.4.2.2, “Geometry Class”.

  ```sql
  mysql> SELECT ST_Dimension(ST_GeomFromText('LineString(1 1,2 2)'));
  +------------------------------------------------------+
  | ST_Dimension(ST_GeomFromText('LineString(1 1,2 2)')) |
  +------------------------------------------------------+
  |                                                    1 |
  +------------------------------------------------------+
  ```

  `ST_Dimension()` and `Dimension()` are synonyms.

* `ST_Envelope(g)`

  Returns the minimum bounding rectangle (MBR) for the geometry value *`g`*, or `NULL` if the argument is `NULL`. The result is returned as a `Polygon` value that is defined by the corner points of the bounding box:

  ```sql
  POLYGON((MINX MINY, MAXX MINY, MAXX MAXY, MINX MAXY, MINX MINY))
  ```

  ```sql
  mysql> SELECT ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,2 2)')));
  +----------------------------------------------------------------+
  | ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,2 2)'))) |
  +----------------------------------------------------------------+
  | POLYGON((1 1,2 1,2 2,1 2,1 1))                                 |
  +----------------------------------------------------------------+
  ```

  If the argument is a point or a vertical or horizontal line segment, `ST_Envelope()` returns the point or the line segment as its MBR rather than returning an invalid polygon:

  ```sql
  mysql> SELECT ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,1 2)')));
  +----------------------------------------------------------------+
  | ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,1 2)'))) |
  +----------------------------------------------------------------+
  | LINESTRING(1 1,1 2)                                            |
  +----------------------------------------------------------------+
  ```

  `ST_Envelope()` and `Envelope()` are synonyms.

* `ST_GeometryType(g)`

  Returns a binary string indicating the name of the geometry type of which the geometry instance *`g`* is a member, or `NULL` if the argument is `NULL`. The name corresponds to one of the instantiable `Geometry` subclasses.

  ```sql
  mysql> SELECT ST_GeometryType(ST_GeomFromText('POINT(1 1)'));
  +------------------------------------------------+
  | ST_GeometryType(ST_GeomFromText('POINT(1 1)')) |
  +------------------------------------------------+
  | POINT                                          |
  +------------------------------------------------+
  ```

  `ST_GeometryType()` and `GeometryType()` are synonyms.

* `ST_IsEmpty(g)`

  This function is a placeholder that returns 0 for any valid geometry value, 1 for any invalid geometry value, or `NULL` if the argument is `NULL`.

  MySQL does not support GIS `EMPTY` values such as `POINT EMPTY`.

  `ST_IsEmpty()` and `IsEmpty()` are synonyms.

* `ST_IsSimple(g)`

  Returns 1 if the geometry value *`g`* has no anomalous geometric points, such as self-intersection or self-tangency. `ST_IsSimple()` returns 0 if the argument is not simple, and `NULL` if the argument is `NULL`.

  The descriptions of the instantiable geometric classes given under Section 11.4.2, “The OpenGIS Geometry Model” includes the specific conditions that cause class instances to be classified as not simple.

  `ST_IsSimple()` and `IsSimple()` are synonyms.

* `ST_SRID(g)`

  Returns an integer indicating the spatial reference system ID associated with the geometry value *`g`*, or `NULL` if the argument is `NULL`.

  ```sql
  mysql> SELECT ST_SRID(ST_GeomFromText('LineString(1 1,2 2)',101));
  +-----------------------------------------------------+
  | ST_SRID(ST_GeomFromText('LineString(1 1,2 2)',101)) |
  +-----------------------------------------------------+
  |                                                 101 |
  +-----------------------------------------------------+
  ```

  `ST_SRID()` and `SRID()` are synonyms.
