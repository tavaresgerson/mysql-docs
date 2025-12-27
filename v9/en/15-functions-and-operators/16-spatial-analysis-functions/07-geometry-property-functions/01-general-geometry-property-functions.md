#### 14.16.7.1 General Geometry Property Functions

The functions listed in this section do not restrict their argument and accept a geometry value of any type.

Unless otherwise specified, functions in this section handle their geometry arguments as follows:

* If any argument is `NULL`, the return value is `NULL`.

* If any geometry argument is not a syntactically well-formed geometry, an `ER_GIS_INVALID_DATA` error occurs.

* If any geometry argument is a syntactically well-formed geometry in an undefined spatial reference system (SRS), an `ER_SRS_NOT_FOUND` error occurs.

* If any SRID argument is not within the range of a 32-bit unsigned integer, an `ER_DATA_OUT_OF_RANGE` error occurs.

* If any SRID argument refers to an undefined SRS, an `ER_SRS_NOT_FOUND` error occurs.

* Otherwise, the return value is non-`NULL`.

These functions are available for obtaining geometry properties:

* `ST_Dimension(g)`

  Returns the inherent dimension of the geometry value *`g`*. The dimension can be −1, 0, 1, or 2. The meaning of these values is given in Section 13.4.2.2, “Geometry Class”.

  `ST_Dimension()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SELECT ST_Dimension(ST_GeomFromText('LineString(1 1,2 2)'));
  +------------------------------------------------------+
  | ST_Dimension(ST_GeomFromText('LineString(1 1,2 2)')) |
  +------------------------------------------------------+
  |                                                    1 |
  +------------------------------------------------------+
  ```

* `ST_Envelope(g)`

  Returns the minimum bounding rectangle (MBR) for the geometry value *`g`*. The result is returned as a `Polygon` value that is defined by the corner points of the bounding box:

  ```
  POLYGON((MINX MINY, MAXX MINY, MAXX MAXY, MINX MAXY, MINX MINY))
  ```

  ```
  mysql> SELECT ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,2 2)')));
  +----------------------------------------------------------------+
  | ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,2 2)'))) |
  +----------------------------------------------------------------+
  | POLYGON((1 1,2 1,2 2,1 2,1 1))                                 |
  +----------------------------------------------------------------+
  ```

  If the argument is a point or a vertical or horizontal line segment, `ST_Envelope()` returns the point or the line segment as its MBR rather than returning an invalid polygon:

  ```
  mysql> SELECT ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,1 2)')));
  +----------------------------------------------------------------+
  | ST_AsText(ST_Envelope(ST_GeomFromText('LineString(1 1,1 2)'))) |
  +----------------------------------------------------------------+
  | LINESTRING(1 1,1 2)                                            |
  +----------------------------------------------------------------+
  ```

  `ST_Envelope()` handles its arguments as described in the introduction to this section, with this exception:

  + If the geometry has an SRID value for a geographic spatial reference system (SRS), an `ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS` error occurs.

* `ST_GeometryType(g)`

  Returns a binary string indicating the name of the geometry type of which the geometry instance *`g`* is a member. The name corresponds to one of the instantiable `Geometry` subclasses.

  `ST_GeometryType()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SELECT ST_GeometryType(ST_GeomFromText('POINT(1 1)'));
  +------------------------------------------------+
  | ST_GeometryType(ST_GeomFromText('POINT(1 1)')) |
  +------------------------------------------------+
  | POINT                                          |
  +------------------------------------------------+
  ```

* `ST_IsEmpty(g)`

  This function is a placeholder that returns 1 for an empty geometry collection value or 0 otherwise.

  The only valid empty geometry is represented in the form of an empty geometry collection value. MySQL does not support GIS `EMPTY` values such as `POINT EMPTY`.

  `ST_IsEmpty()` handles its arguments as described in the introduction to this section.

* `ST_IsSimple(g)`

  Returns 1 if the geometry value *`g`* is simple according to the ISO *SQL/MM Part 3: Spatial* standard. `ST_IsSimple()` returns 0 if the argument is not simple.

  The descriptions of the instantiable geometric classes given under Section 13.4.2, “The OpenGIS Geometry Model” include the specific conditions that cause class instances to be classified as not simple.

  `ST_IsSimple()` handles its arguments as described in the introduction to this section, with this exception:

  + If the geometry has a geographic SRS with a longitude or latitude that is out of range, an error occurs:

    - If a longitude value is not in the range (−180, 180], an `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE` error occurs.

    - If a latitude value is not in the range [−90, 90], an `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE` error occurs.

    Ranges shown are in degrees. The exact range limits deviate slightly due to floating-point arithmetic.

* `ST_SRID(g [, srid])`

  With a single argument representing a valid geometry object *`g`*, `ST_SRID()` returns an integer indicating the ID of the spatial reference system (SRS) associated with *`g`*.

  With the optional second argument representing a valid SRID value, `ST_SRID()` returns an object with the same type as its first argument with an SRID value equal to the second argument. This only sets the SRID value of the object; it does not perform any transformation of coordinate values.

  `ST_SRID()` handles its arguments as described in the introduction to this section, with this exception:

  + For the single-argument syntax, `ST_SRID()` returns the geometry SRID even if it refers to an undefined SRS. An `ER_SRS_NOT_FOUND` error does not occur.

  `ST_SRID(g, target_srid)` and `ST_Transform(g, target_srid)` differ as follows:

  + `ST_SRID()` changes the geometry SRID value without transforming its coordinates.

  + `ST_Transform()` transforms the geometry coordinates in addition to changing its SRID value.

  ```
  mysql> SET @g = ST_GeomFromText('LineString(1 1,2 2)', 0);
  mysql> SELECT ST_SRID(@g);
  +-------------+
  | ST_SRID(@g) |
  +-------------+
  |           0 |
  +-------------+
  mysql> SET @g = ST_SRID(@g, 4326);
  mysql> SELECT ST_SRID(@g);
  +-------------+
  | ST_SRID(@g) |
  +-------------+
  |        4326 |
  +-------------+
  ```

  It is possible to create a geometry in a particular SRID by passing to `ST_SRID()` the result of one of the MySQL-specific functions for creating spatial values, along with an SRID value. For example:

  ```
  SET @g1 = ST_SRID(Point(1, 1), 4326);
  ```

  However, that method creates the geometry in SRID 0, then casts it to SRID 4326 (WGS 84). A preferable alternative is to create the geometry with the correct spatial reference system to begin with. For example:

  ```
  SET @g1 = ST_PointFromText('POINT(1 1)', 4326);
  SET @g1 = ST_GeomFromText('POINT(1 1)', 4326);
  ```

  The two-argument form of `ST_SRID()` is useful for tasks such as correcting or changing the SRS of geometries that have an incorrect SRID.
