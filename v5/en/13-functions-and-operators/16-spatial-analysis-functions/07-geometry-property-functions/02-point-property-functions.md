#### 12.16.7.2 Point Property Functions

A `Point` consists of X and Y coordinates, which may be obtained using the following functions:

* `ST_X(p)`

  Returns the X-coordinate value for the `Point` object *`p`* as a double-precision number.

  ```sql
  mysql> SELECT ST_X(Point(56.7, 53.34));
  +--------------------------+
  | ST_X(Point(56.7, 53.34)) |
  +--------------------------+
  |                     56.7 |
  +--------------------------+
  ```

  `ST_X()` and `X()` are synonyms.

* `ST_Y(p)`

  Returns the Y-coordinate value for the `Point` object *`p`* as a double-precision number.

  ```sql
  mysql> SELECT ST_Y(Point(56.7, 53.34));
  +--------------------------+
  | ST_Y(Point(56.7, 53.34)) |
  +--------------------------+
  |                    53.34 |
  +--------------------------+
  ```

  `ST_Y()` and `Y()` are synonyms.

* `X(p)`

  `ST_X()` and `X()` are synonyms. For more information, see the description of `ST_X()`.

  `X()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_X()` instead.

* `Y(p)`

  `ST_Y()` and `Y()` are synonyms. For more information, see the description of `ST_Y()`.

  `Y()` is deprecated; expect it to be removed in a future MySQL release. Use `ST_Y()` instead.
