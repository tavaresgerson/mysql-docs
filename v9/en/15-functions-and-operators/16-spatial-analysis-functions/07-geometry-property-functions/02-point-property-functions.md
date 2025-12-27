#### 14.16.7.2 Point Property Functions

A `Point` consists of X and Y coordinates, which may be obtained using the `ST_X()` and `ST_Y()` functions, respectively. These functions also permit an optional second argument that specifies an X or Y coordinate value, in which case the function result is the `Point` object from the first argument with the appropriate coordinate modified to be equal to the second argument.

For `Point` objects that have a geographic spatial reference system (SRS), the longitude and latitude may be obtained using the `ST_Longitude()` and `ST_Latitude()` functions, respectively. These functions also permit an optional second argument that specifies a longitude or latitude value, in which case the function result is the `Point` object from the first argument with the longitude or latitude modified to be equal to the second argument.

Unless otherwise specified, functions in this section handle their geometry arguments as follows:

* If any argument is `NULL`, the return value is `NULL`.

* If any geometry argument is a valid geometry but not a `Point` object, an `ER_UNEXPECTED_GEOMETRY_TYPE` error occurs.

* If any geometry argument is not a syntactically well-formed geometry, an `ER_GIS_INVALID_DATA` error occurs.

* If any geometry argument is a syntactically well-formed geometry in an undefined spatial reference system (SRS), an `ER_SRS_NOT_FOUND` error occurs.

* If an X or Y coordinate argument is provided and the value is `-inf`, `+inf`, or `NaN`, an `ER_DATA_OUT_OF_RANGE` error occurs.

* If a longitude or latitude value is out of range, an error occurs:

  + If a longitude value is not in the range (−180, 180], an `ER_LONGITUDE_OUT_OF_RANGE` error occurs.

  + If a latitude value is not in the range [−90, 90], an `ER_LATITUDE_OUT_OF_RANGE` error occurs.

  Ranges shown are in degrees. The exact range limits deviate slightly due to floating-point arithmetic.

* Otherwise, the return value is non-`NULL`.

These functions are available for obtaining point properties:

* `ST_Latitude(p [, new_latitude_val])`

  With a single argument representing a valid `Point` object *`p`* that has a geographic spatial reference system (SRS), `ST_Latitude()` returns the latitude value of *`p`* as a double-precision number.

  With the optional second argument representing a valid latitude value, `ST_Latitude()` returns a `Point` object like the first argument with its latitude equal to the second argument.

  `ST_Latitude()` handles its arguments as described in the introduction to this section, with the addition that if the `Point` object is valid but does not have a geographic SRS, an `ER_SRS_NOT_GEOGRAPHIC` error occurs.

  ```
  mysql> SET @pt = ST_GeomFromText('POINT(45 90)', 4326);
  mysql> SELECT ST_Latitude(@pt);
  +------------------+
  | ST_Latitude(@pt) |
  +------------------+
  |               45 |
  +------------------+
  mysql> SELECT ST_AsText(ST_Latitude(@pt, 10));
  +---------------------------------+
  | ST_AsText(ST_Latitude(@pt, 10)) |
  +---------------------------------+
  | POINT(10 90)                    |
  +---------------------------------+
  ```

* `ST_Longitude(p [, new_longitude_val])`

  With a single argument representing a valid `Point` object *`p`* that has a geographic spatial reference system (SRS), `ST_Longitude()` returns the longitude value of *`p`* as a double-precision number.

  With the optional second argument representing a valid longitude value, `ST_Longitude()` returns a `Point` object like the first argument with its longitude equal to the second argument.

  `ST_Longitude()` handles its arguments as described in the introduction to this section, with the addition that if the `Point` object is valid but does not have a geographic SRS, an `ER_SRS_NOT_GEOGRAPHIC` error occurs.

  ```
  mysql> SET @pt = ST_GeomFromText('POINT(45 90)', 4326);
  mysql> SELECT ST_Longitude(@pt);
  +-------------------+
  | ST_Longitude(@pt) |
  +-------------------+
  |                90 |
  +-------------------+
  mysql> SELECT ST_AsText(ST_Longitude(@pt, 10));
  +----------------------------------+
  | ST_AsText(ST_Longitude(@pt, 10)) |
  +----------------------------------+
  | POINT(45 10)                     |
  +----------------------------------+
  ```

* `ST_X(p [, new_x_val])`

  With a single argument representing a valid `Point` object *`p`*, `ST_X()` returns the X-coordinate value of *`p`* as a double-precision number. The X coordinate is considered to refer to the axis that appears first in the `Point` spatial reference system (SRS) definition.

  With the optional second argument, `ST_X()` returns a `Point` object like the first argument with its X coordinate equal to the second argument. If the `Point` object has a geographic SRS, the second argument must be in the proper range for longitude or latitude values.

  `ST_X()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SELECT ST_X(Point(56.7, 53.34));
  +--------------------------+
  | ST_X(Point(56.7, 53.34)) |
  +--------------------------+
  |                     56.7 |
  +--------------------------+
  mysql> SELECT ST_AsText(ST_X(Point(56.7, 53.34), 10.5));
  +-------------------------------------------+
  | ST_AsText(ST_X(Point(56.7, 53.34), 10.5)) |
  +-------------------------------------------+
  | POINT(10.5 53.34)                         |
  +-------------------------------------------+
  ```

* `ST_Y(p [, new_y_val])`

  With a single argument representing a valid `Point` object *`p`*, `ST_Y()` returns the Y-coordinate value of *`p`* as a double-precision number.The Y coordinate is considered to refer to the axis that appears second in the `Point` spatial reference system (SRS) definition.

  With the optional second argument, `ST_Y()` returns a `Point` object like the first argument with its Y coordinate equal to the second argument. If the `Point` object has a geographic SRS, the second argument must be in the proper range for longitude or latitude values.

  `ST_Y()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SELECT ST_Y(Point(56.7, 53.34));
  +--------------------------+
  | ST_Y(Point(56.7, 53.34)) |
  +--------------------------+
  |                    53.34 |
  +--------------------------+
  mysql> SELECT ST_AsText(ST_Y(Point(56.7, 53.34), 10.5));
  +-------------------------------------------+
  | ST_AsText(ST_Y(Point(56.7, 53.34), 10.5)) |
  +-------------------------------------------+
  | POINT(56.7 10.5)                          |
  +-------------------------------------------+
  ```
