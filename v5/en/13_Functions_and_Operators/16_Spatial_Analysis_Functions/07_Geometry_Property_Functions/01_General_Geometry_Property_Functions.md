#### 12.16.7.1 General Geometry Property Functions

The functions listed in this section do not restrict their
argument and accept a geometry value of any type.

* [`Dimension(g)`](gis-general-property-functions.html#function_dimension)

  [`ST_Dimension()`](gis-general-property-functions.html#function_st-dimension) and
  [`Dimension()`](gis-general-property-functions.html#function_dimension) are synonyms. For
  more information, see the description of
  [`ST_Dimension()`](gis-general-property-functions.html#function_st-dimension).

  [`Dimension()`](gis-general-property-functions.html#function_dimension) is deprecated;
  expect it to be removed in a future MySQL release. Use
  [`ST_Dimension()`](gis-general-property-functions.html#function_st-dimension) instead.

* [`Envelope(g)`](gis-general-property-functions.html#function_envelope)

  [`ST_Envelope()`](gis-general-property-functions.html#function_st-envelope) and
  [`Envelope()`](gis-general-property-functions.html#function_envelope) are synonyms. For
  more information, see the description of
  [`ST_Envelope()`](gis-general-property-functions.html#function_st-envelope).

  [`Envelope()`](gis-general-property-functions.html#function_envelope) is deprecated;
  expect it to be removed in a future MySQL release. Use
  [`ST_Envelope()`](gis-general-property-functions.html#function_st-envelope) instead.

* [`GeometryType(g)`](gis-general-property-functions.html#function_geometrytype)

  [`ST_GeometryType()`](gis-general-property-functions.html#function_st-geometrytype) and
  [`GeometryType()`](gis-general-property-functions.html#function_geometrytype) are synonyms.
  For more information, see the description of
  [`ST_GeometryType()`](gis-general-property-functions.html#function_st-geometrytype).

  [`GeometryType()`](gis-general-property-functions.html#function_geometrytype) is deprecated;
  expect it to be removed in a future MySQL release. Use
  [`ST_GeometryType()`](gis-general-property-functions.html#function_st-geometrytype) instead.

* [`IsEmpty(g)`](gis-general-property-functions.html#function_isempty)

  [`ST_IsEmpty()`](gis-general-property-functions.html#function_st-isempty) and
  [`IsEmpty()`](gis-general-property-functions.html#function_isempty) are synonyms. For
  more information, see the description of
  [`ST_IsEmpty()`](gis-general-property-functions.html#function_st-isempty).

  [`IsEmpty()`](gis-general-property-functions.html#function_isempty) is deprecated;
  expect it to be removed in a future MySQL release. Use
  [`ST_IsEmpty()`](gis-general-property-functions.html#function_st-isempty) instead.

* [`IsSimple(g)`](gis-general-property-functions.html#function_issimple)

  [`ST_IsSimple()`](gis-general-property-functions.html#function_st-issimple) and
  [`IsSimple()`](gis-general-property-functions.html#function_issimple) are synonyms. For
  more information, see the description of
  [`ST_IsSimple()`](gis-general-property-functions.html#function_st-issimple).

  [`IsSimple()`](gis-general-property-functions.html#function_issimple) is deprecated;
  expect it to be removed in a future MySQL release. Use
  [`ST_IsSimple()`](gis-general-property-functions.html#function_st-issimple) instead.

* [`SRID(g)`](gis-general-property-functions.html#function_srid)

  [`ST_SRID()`](gis-general-property-functions.html#function_st-srid) and
  [`SRID()`](gis-general-property-functions.html#function_srid) are synonyms. For more
  information, see the description of
  [`ST_SRID()`](gis-general-property-functions.html#function_st-srid).

  [`SRID()`](gis-general-property-functions.html#function_srid) is deprecated; expect
  it to be removed in a future MySQL release. Use
  [`ST_SRID()`](gis-general-property-functions.html#function_st-srid) instead.

* [`ST_Dimension(g)`](gis-general-property-functions.html#function_st-dimension)

  Returns the inherent dimension of the geometry value
  *`g`*, or `NULL` if
  the argument is `NULL`. The dimension can
  be −1, 0, 1, or 2. The meaning of these values is
  given in [Section 11.4.2.2, “Geometry Class”](gis-class-geometry.html "11.4.2.2 Geometry Class").

  ```sql
  mysql> SELECT ST_Dimension(ST_GeomFromText('LineString(1 1,2 2)'));
  +------------------------------------------------------+
  | ST_Dimension(ST_GeomFromText('LineString(1 1,2 2)')) |
  +------------------------------------------------------+
  |                                                    1 |
  +------------------------------------------------------+
  ```

  [`ST_Dimension()`](gis-general-property-functions.html#function_st-dimension) and
  [`Dimension()`](gis-general-property-functions.html#function_dimension) are synonyms.

* [`ST_Envelope(g)`](gis-general-property-functions.html#function_st-envelope)

  Returns the minimum bounding rectangle (MBR) for the
  geometry value *`g`*, or
  `NULL` if the argument is
  `NULL`. The result is returned as a
  `Polygon` value that is defined by the
  corner points of the bounding box:

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

  If the argument is a point or a vertical or horizontal line
  segment, [`ST_Envelope()`](gis-general-property-functions.html#function_st-envelope)
  returns the point or the line segment as its MBR rather than
  returning an invalid polygon:

  ```sql
  mysql> SELECT ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,1 2)')));
  +----------------------------------------------------------------+
  | ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,1 2)'))) |
  +----------------------------------------------------------------+
  | LINESTRING(1 1,1 2)                                            |
  +----------------------------------------------------------------+
  ```

  [`ST_Envelope()`](gis-general-property-functions.html#function_st-envelope) and
  [`Envelope()`](gis-general-property-functions.html#function_envelope) are synonyms.

* [`ST_GeometryType(g)`](gis-general-property-functions.html#function_st-geometrytype)

  Returns a binary string indicating the name of the geometry
  type of which the geometry instance
  *`g`* is a member, or
  `NULL` if the argument is
  `NULL`. The name corresponds to one of the
  instantiable `Geometry` subclasses.

  ```sql
  mysql> SELECT ST_GeometryType(ST_GeomFromText('POINT(1 1)'));
  +------------------------------------------------+
  | ST_GeometryType(ST_GeomFromText('POINT(1 1)')) |
  +------------------------------------------------+
  | POINT                                          |
  +------------------------------------------------+
  ```

  [`ST_GeometryType()`](gis-general-property-functions.html#function_st-geometrytype) and
  [`GeometryType()`](gis-general-property-functions.html#function_geometrytype) are synonyms.

* [`ST_IsEmpty(g)`](gis-general-property-functions.html#function_st-isempty)

  This function is a placeholder that returns 0 for any valid
  geometry value, 1 for any invalid geometry value, or
  `NULL` if the argument is
  `NULL`.

  MySQL does not support GIS `EMPTY` values
  such as `POINT EMPTY`.

  [`ST_IsEmpty()`](gis-general-property-functions.html#function_st-isempty) and
  [`IsEmpty()`](gis-general-property-functions.html#function_isempty) are synonyms.

* [`ST_IsSimple(g)`](gis-general-property-functions.html#function_st-issimple)

  Returns 1 if the geometry value *`g`*
  has no anomalous geometric points, such as self-intersection
  or self-tangency.
  [`ST_IsSimple()`](gis-general-property-functions.html#function_st-issimple) returns 0 if
  the argument is not simple, and `NULL` if
  the argument is `NULL`.

  The descriptions of the instantiable geometric classes given
  under [Section 11.4.2, “The OpenGIS Geometry Model”](opengis-geometry-model.html "11.4.2 The OpenGIS Geometry Model") includes the
  specific conditions that cause class instances to be
  classified as not simple.

  [`ST_IsSimple()`](gis-general-property-functions.html#function_st-issimple) and
  [`IsSimple()`](gis-general-property-functions.html#function_issimple) are synonyms.

* [`ST_SRID(g)`](gis-general-property-functions.html#function_st-srid)

  Returns an integer indicating the spatial reference system
  ID associated with the geometry value
  *`g`*, or `NULL` if
  the argument is `NULL`.

  ```sql
  mysql> SELECT ST_SRID(ST_GeomFromText('LineString(1 1,2 2)',101));
  +-----------------------------------------------------+
  | ST_SRID(ST_GeomFromText('LineString(1 1,2 2)',101)) |
  +-----------------------------------------------------+
  |                                                 101 |
  +-----------------------------------------------------+
  ```

  [`ST_SRID()`](gis-general-property-functions.html#function_st-srid) and
  [`SRID()`](gis-general-property-functions.html#function_srid) are synonyms.