#### 12.16.7.2 Point Property Functions

A `Point` consists of X and Y coordinates,
which may be obtained using the following functions:

* [`ST_X(p)`](gis-point-property-functions.html#function_st-x)

  Returns the X-coordinate value for the
  `Point` object *`p`*
  as a double-precision number.

  ```sql
  mysql> SELECT ST_X(Point(56.7, 53.34));
  +--------------------------+
  | ST_X(Point(56.7, 53.34)) |
  +--------------------------+
  |                     56.7 |
  +--------------------------+
  ```

  [`ST_X()`](gis-point-property-functions.html#function_st-x) and
  [`X()`](gis-point-property-functions.html#function_x) are synonyms.

* [`ST_Y(p)`](gis-point-property-functions.html#function_st-y)

  Returns the Y-coordinate value for the
  `Point` object *`p`*
  as a double-precision number.

  ```sql
  mysql> SELECT ST_Y(Point(56.7, 53.34));
  +--------------------------+
  | ST_Y(Point(56.7, 53.34)) |
  +--------------------------+
  |                    53.34 |
  +--------------------------+
  ```

  [`ST_Y()`](gis-point-property-functions.html#function_st-y) and
  [`Y()`](gis-point-property-functions.html#function_y) are synonyms.

* [`X(p)`](gis-point-property-functions.html#function_x)

  [`ST_X()`](gis-point-property-functions.html#function_st-x) and
  [`X()`](gis-point-property-functions.html#function_x) are synonyms. For more
  information, see the description of
  [`ST_X()`](gis-point-property-functions.html#function_st-x).

  [`X()`](gis-point-property-functions.html#function_x) is deprecated; expect it
  to be removed in a future MySQL release. Use
  [`ST_X()`](gis-point-property-functions.html#function_st-x) instead.

* [`Y(p)`](gis-point-property-functions.html#function_y)

  [`ST_Y()`](gis-point-property-functions.html#function_st-y) and
  [`Y()`](gis-point-property-functions.html#function_y) are synonyms. For more
  information, see the description of
  [`ST_Y()`](gis-point-property-functions.html#function_st-y).

  [`Y()`](gis-point-property-functions.html#function_y) is deprecated; expect it
  to be removed in a future MySQL release. Use
  [`ST_Y()`](gis-point-property-functions.html#function_st-y) instead.