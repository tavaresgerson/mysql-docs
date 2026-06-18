#### 14.16.7.3 LineString and MultiLineString Property Functions

A `LineString` consists of
`Point` values. You can extract particular
points of a `LineString`, count the number of
points that it contains, or obtain its length.

Some functions in this section also work for
`MultiLineString` values.

Unless otherwise specified, functions in this section handle
their geometry arguments as follows:

* If any argument is `NULL` or any geometry
  argument is an empty geometry, the return value is
  `NULL`.

* If any geometry argument is not a syntactically well-formed
  geometry, an
  [`ER_GIS_INVALID_DATA`](/doc/mysql-errors/9.5/en/server-error-reference.html#error_er_gis_invalid_data) error
  occurs.

* If any geometry argument is a syntactically well-formed
  geometry in an undefined spatial reference system (SRS), an
  [`ER_SRS_NOT_FOUND`](/doc/mysql-errors/9.5/en/server-error-reference.html#error_er_srs_not_found) error
  occurs.

* Otherwise, the return value is non-`NULL`.

These functions are available for obtaining linestring
properties:

* [`ST_EndPoint(ls)`](gis-linestring-property-functions.html#function_st-endpoint)

  Returns the `Point` that is the endpoint of
  the `LineString` value
  *`ls`*.

  [`ST_EndPoint()`](gis-linestring-property-functions.html#function_st-endpoint) handles its
  arguments as described in the introduction to this section.

  ```
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_AsText(ST_EndPoint(ST_GeomFromText(@ls)));
  +----------------------------------------------+
  | ST_AsText(ST_EndPoint(ST_GeomFromText(@ls))) |
  +----------------------------------------------+
  | POINT(3 3)                                   |
  +----------------------------------------------+
  ```

* [`ST_IsClosed(ls)`](gis-linestring-property-functions.html#function_st-isclosed)

  For a `LineString` value
  *`ls`*,
  [`ST_IsClosed()`](gis-linestring-property-functions.html#function_st-isclosed) returns 1 if
  *`ls`* is closed (that is, its
  [`ST_StartPoint()`](gis-linestring-property-functions.html#function_st-startpoint) and
  [`ST_EndPoint()`](gis-linestring-property-functions.html#function_st-endpoint) values are the
  same).

  For a `MultiLineString` value
  *`ls`*,
  [`ST_IsClosed()`](gis-linestring-property-functions.html#function_st-isclosed) returns 1 if
  *`ls`* is closed (that is, the
  [`ST_StartPoint()`](gis-linestring-property-functions.html#function_st-startpoint) and
  [`ST_EndPoint()`](gis-linestring-property-functions.html#function_st-endpoint) values are the
  same for each `LineString` in
  *`ls`*).

  [`ST_IsClosed()`](gis-linestring-property-functions.html#function_st-isclosed) returns 0 if
  *`ls`* is not closed, and
  `NULL` if *`ls`* is
  `NULL`.

  [`ST_IsClosed()`](gis-linestring-property-functions.html#function_st-isclosed) handles its
  arguments as described in the introduction to this section,
  with this exception:

  + If the geometry has an SRID value for a geographic
    spatial reference system (SRS), an
    [`ER_NOT_IMPLEMENTED_FOR_GEOGRAPHIC_SRS`](/doc/mysql-errors/9.5/en/server-error-reference.html#error_er_not_implemented_for_geographic_srs)
    error occurs.

  ```
  mysql> SET @ls1 = 'LineString(1 1,2 2,3 3,2 2)';
  mysql> SET @ls2 = 'LineString(1 1,2 2,3 3,1 1)';

  mysql> SELECT ST_IsClosed(ST_GeomFromText(@ls1));
  +------------------------------------+
  | ST_IsClosed(ST_GeomFromText(@ls1)) |
  +------------------------------------+
  |                                  0 |
  +------------------------------------+

  mysql> SELECT ST_IsClosed(ST_GeomFromText(@ls2));
  +------------------------------------+
  | ST_IsClosed(ST_GeomFromText(@ls2)) |
  +------------------------------------+
  |                                  1 |
  +------------------------------------+

  mysql> SET @ls3 = 'MultiLineString((1 1,2 2,3 3),(4 4,5 5))';

  mysql> SELECT ST_IsClosed(ST_GeomFromText(@ls3));
  +------------------------------------+
  | ST_IsClosed(ST_GeomFromText(@ls3)) |
  +------------------------------------+
  |                                  0 |
  +------------------------------------+
  ```

* [`ST_Length(ls
  [, unit])`](gis-linestring-property-functions.html#function_st-length)

  Returns a double-precision number indicating the length of
  the `LineString` or
  `MultiLineString` value
  *`ls`* in its associated spatial
  reference system. The length of a
  `MultiLineString` value is equal to the sum
  of the lengths of its elements.

  [`ST_Length()`](gis-linestring-property-functions.html#function_st-length) computes a result
  as follows:

  + If the geometry is a valid `LineString`
    in a Cartesian SRS, the return value is the Cartesian
    length of the geometry.

  + If the geometry is a valid
    `MultiLineString` in a Cartesian SRS,
    the return value is the sum of the Cartesian lengths of
    its elements.

  + If the geometry is a valid `LineString`
    in a geographic SRS, the return value is the geodetic
    length of the geometry in that SRS, in meters.

  + If the geometry is a valid
    `MultiLineString` in a geographic SRS,
    the return value is the sum of the geodetic lengths of
    its elements in that SRS, in meters.

  [`ST_Length()`](gis-linestring-property-functions.html#function_st-length) handles its
  arguments as described in the introduction to this section,
  with these exceptions:

  + If the geometry is not a `LineString`
    or `MultiLineString`, the return value
    is `NULL`.

  + If the geometry is geometrically invalid, either the
    result is an undefined length (that is, it can be any
    number), or an error occurs.

  + If the length computation result is
    `+inf`, an
    [`ER_DATA_OUT_OF_RANGE`](/doc/mysql-errors/9.5/en/server-error-reference.html#error_er_data_out_of_range)
    error occurs.

  + If the geometry has a geographic SRS with a longitude or
    latitude that is out of range, an error occurs:

    - If a longitude value is not in the range
      (−180, 180], an
      [`ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE`](/doc/mysql-errors/9.5/en/server-error-reference.html#error_er_geometry_param_longitude_out_of_range)
      error occurs.

    - If a latitude value is not in the range [−90,
      90], an
      [`ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE`](/doc/mysql-errors/9.5/en/server-error-reference.html#error_er_geometry_param_latitude_out_of_range)
      error occurs.

    Ranges shown are in degrees. The exact range limits
    deviate slightly due to floating-point arithmetic.

  [`ST_Length()`](gis-linestring-property-functions.html#function_st-length) permits an
  optional *`unit`* argument that
  specifies the linear unit for the returned length value.
  These rules apply:

  + If a unit is specified but not supported by MySQL, an
    [`ER_UNIT_NOT_FOUND`](/doc/mysql-errors/9.5/en/server-error-reference.html#error_er_unit_not_found) error
    occurs.

  + If a supported linear unit is specified and the SRID is
    0, an
    [`ER_GEOMETRY_IN_UNKNOWN_LENGTH_UNIT`](/doc/mysql-errors/9.5/en/server-error-reference.html#error_er_geometry_in_unknown_length_unit)
    error occurs.

  + If a supported linear unit is specified and the SRID is
    not 0, the result is in that unit.

  + If a unit is not specified, the result is in the unit of
    the SRS of the geometries, whether Cartesian or
    geographic. Currently, all MySQL SRSs are expressed in
    meters.

  A unit is supported if it is found in the
  `INFORMATION_SCHEMA`
  [`ST_UNITS_OF_MEASURE`](information-schema-st-units-of-measure-table.html "28.3.43 The INFORMATION_SCHEMA ST_UNITS_OF_MEASURE Table") table. See
  [Section 28.3.43, “The INFORMATION\_SCHEMA ST\_UNITS\_OF\_MEASURE Table”](information-schema-st-units-of-measure-table.html "28.3.43 The INFORMATION_SCHEMA ST_UNITS_OF_MEASURE Table").

  ```
  mysql> SET @ls = ST_GeomFromText('LineString(1 1,2 2,3 3)');
  mysql> SELECT ST_Length(@ls);
  +--------------------+
  | ST_Length(@ls)     |
  +--------------------+
  | 2.8284271247461903 |
  +--------------------+

  mysql> SET @mls = ST_GeomFromText('MultiLineString((1 1,2 2,3 3),(4 4,5 5))');
  mysql> SELECT ST_Length(@mls);
  +-------------------+
  | ST_Length(@mls)   |
  +-------------------+
  | 4.242640687119286 |
  +-------------------+

  mysql> SET @ls = ST_GeomFromText('LineString(1 1,2 2,3 3)', 4326);
  mysql> SELECT ST_Length(@ls);
  +-------------------+
  | ST_Length(@ls)    |
  +-------------------+
  | 313701.9623204328 |
  +-------------------+
  mysql> SELECT ST_Length(@ls, 'metre');
  +-------------------------+
  | ST_Length(@ls, 'metre') |
  +-------------------------+
  |       313701.9623204328 |
  +-------------------------+
  mysql> SELECT ST_Length(@ls, 'foot');
  +------------------------+
  | ST_Length(@ls, 'foot') |
  +------------------------+
  |     1029205.9131247795 |
  +------------------------+
  ```

* [`ST_NumPoints(ls)`](gis-linestring-property-functions.html#function_st-numpoints)

  Returns the number of `Point` objects in
  the `LineString` value
  *`ls`*.

  [`ST_NumPoints()`](gis-linestring-property-functions.html#function_st-numpoints) handles its
  arguments as described in the introduction to this section.

  ```
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_NumPoints(ST_GeomFromText(@ls));
  +------------------------------------+
  | ST_NumPoints(ST_GeomFromText(@ls)) |
  +------------------------------------+
  |                                  3 |
  +------------------------------------+
  ```

* [`ST_PointN(ls,
  N)`](gis-linestring-property-functions.html#function_st-pointn)

  Returns the *`N`*-th
  `Point` in the
  `Linestring` value
  *`ls`*. Points are numbered beginning
  with 1.

  [`ST_PointN()`](gis-linestring-property-functions.html#function_st-pointn) handles its
  arguments as described in the introduction to this section.

  ```
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_AsText(ST_PointN(ST_GeomFromText(@ls),2));
  +----------------------------------------------+
  | ST_AsText(ST_PointN(ST_GeomFromText(@ls),2)) |
  +----------------------------------------------+
  | POINT(2 2)                                   |
  +----------------------------------------------+
  ```

* [`ST_StartPoint(ls)`](gis-linestring-property-functions.html#function_st-startpoint)

  Returns the `Point` that is the start point
  of the `LineString` value
  *`ls`*.

  [`ST_StartPoint()`](gis-linestring-property-functions.html#function_st-startpoint) handles its
  arguments as described in the introduction to this section.

  ```
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_AsText(ST_StartPoint(ST_GeomFromText(@ls)));
  +------------------------------------------------+
  | ST_AsText(ST_StartPoint(ST_GeomFromText(@ls))) |
  +------------------------------------------------+
  | POINT(1 1)                                     |
  +------------------------------------------------+
  ```