#### 12.16.7.3 LineString and MultiLineString Property Functions

A `LineString` consists of
`Point` values. You can extract particular
points of a `LineString`, count the number of
points that it contains, or obtain its length.

Some functions in this section also work for
`MultiLineString` values.

* [`EndPoint(ls)`](gis-linestring-property-functions.html#function_endpoint)

  [`ST_EndPoint()`](gis-linestring-property-functions.html#function_st-endpoint) and
  [`EndPoint()`](gis-linestring-property-functions.html#function_endpoint) are synonyms. For
  more information, see the description of
  [`ST_EndPoint()`](gis-linestring-property-functions.html#function_st-endpoint).

  [`EndPoint()`](gis-linestring-property-functions.html#function_endpoint) is deprecated;
  expect it to be removed in a future MySQL release. Use
  [`ST_EndPoint()`](gis-linestring-property-functions.html#function_st-endpoint) instead.

* [`GLength(ls)`](gis-linestring-property-functions.html#function_glength)

  [`GLength()`](gis-linestring-property-functions.html#function_glength) is a nonstandard
  name. It corresponds to the OpenGIS
  [`ST_Length()`](gis-linestring-property-functions.html#function_st-length) function. (There
  is an existing SQL function
  [`Length()`](string-functions.html#function_length) that calculates the
  length of string values.)

  [`GLength()`](gis-linestring-property-functions.html#function_glength) is deprecated;
  expect it to be removed in a future MySQL release. Use
  [`ST_Length()`](gis-linestring-property-functions.html#function_st-length) instead.

* [`IsClosed(ls)`](gis-linestring-property-functions.html#function_isclosed)

  [`ST_IsClosed()`](gis-linestring-property-functions.html#function_st-isclosed) and
  [`IsClosed()`](gis-linestring-property-functions.html#function_isclosed) are synonyms. For
  more information, see the description of
  [`ST_IsClosed()`](gis-linestring-property-functions.html#function_st-isclosed).

  [`IsClosed()`](gis-linestring-property-functions.html#function_isclosed) is deprecated;
  expect it to be removed in a future MySQL release. Use
  [`ST_IsClosed()`](gis-linestring-property-functions.html#function_st-isclosed) instead.

* [`NumPoints(ls)`](gis-linestring-property-functions.html#function_numpoints)

  [`ST_NumPoints()`](gis-linestring-property-functions.html#function_st-numpoints) and
  [`NumPoints()`](gis-linestring-property-functions.html#function_numpoints) are synonyms. For
  more information, see the description of
  [`ST_NumPoints()`](gis-linestring-property-functions.html#function_st-numpoints).

  [`NumPoints()`](gis-linestring-property-functions.html#function_numpoints) is deprecated;
  expect it to be removed in a future MySQL release. Use
  [`ST_NumPoints()`](gis-linestring-property-functions.html#function_st-numpoints) instead.

* [`PointN(ls,
  N)`](gis-linestring-property-functions.html#function_pointn)

  [`ST_PointN()`](gis-linestring-property-functions.html#function_st-pointn) and
  [`PointN()`](gis-linestring-property-functions.html#function_pointn) are synonyms. For
  more information, see the description of
  [`ST_PointN()`](gis-linestring-property-functions.html#function_st-pointn).

  [`PointN()`](gis-linestring-property-functions.html#function_pointn) is deprecated;
  expect it to be removed in a future MySQL release. Use
  [`ST_PointN()`](gis-linestring-property-functions.html#function_st-pointn) instead.

* [`ST_EndPoint(ls)`](gis-linestring-property-functions.html#function_st-endpoint)

  Returns the `Point` that is the endpoint of
  the `LineString` value
  *`ls`*. If the argument is
  `NULL` or an empty geometry, the return
  value is `NULL`.

  ```sql
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_AsText(ST_EndPoint(ST_GeomFromText(@ls)));
  +----------------------------------------------+
  | ST_AsText(ST_EndPoint(ST_GeomFromText(@ls))) |
  +----------------------------------------------+
  | POINT(3 3)                                   |
  +----------------------------------------------+
  ```

  [`ST_EndPoint()`](gis-linestring-property-functions.html#function_st-endpoint) and
  [`EndPoint()`](gis-linestring-property-functions.html#function_endpoint) are synonyms.

* [`ST_IsClosed(ls)`](gis-linestring-property-functions.html#function_st-isclosed)

  For a `LineString` value
  *`ls`*,
  [`ST_IsClosed()`](gis-linestring-property-functions.html#function_st-isclosed) returns 1 if
  *`ls`* is closed (that is, its
  [`ST_StartPoint()`](gis-linestring-property-functions.html#function_st-startpoint) and
  [`ST_EndPoint()`](gis-linestring-property-functions.html#function_st-endpoint) values are the
  same). If the argument is `NULL` or an
  empty geometry, the return value is `NULL`.

  For a `MultiLineString` value
  *`ls`*,
  [`ST_IsClosed()`](gis-linestring-property-functions.html#function_st-isclosed) returns 1 if
  *`ls`* is closed (that is, the
  [`ST_StartPoint()`](gis-linestring-property-functions.html#function_st-startpoint) and
  [`ST_EndPoint()`](gis-linestring-property-functions.html#function_st-endpoint) values are the
  same for each `LineString` in
  *`ls`*).

  [`ST_IsClosed()`](gis-linestring-property-functions.html#function_st-isclosed) returns 0 if
  *`ls`* is not closed.

  ```sql
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

  [`ST_IsClosed()`](gis-linestring-property-functions.html#function_st-isclosed) and
  [`IsClosed()`](gis-linestring-property-functions.html#function_isclosed) are synonyms.

* [`ST_Length(ls)`](gis-linestring-property-functions.html#function_st-length)

  Returns a double-precision number indicating the length of
  the `LineString` or
  `MultiLineString` value
  *`ls`* in its associated spatial
  reference system. The length of a
  `MultiLineString` value is equal to the sum
  of the lengths of its elements. If the argument is
  `NULL` or an empty geometry, the return
  value is `NULL`.

  ```sql
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_Length(ST_GeomFromText(@ls));
  +---------------------------------+
  | ST_Length(ST_GeomFromText(@ls)) |
  +---------------------------------+
  |              2.8284271247461903 |
  +---------------------------------+

  mysql> SET @mls = 'MultiLineString((1 1,2 2,3 3),(4 4,5 5))';
  mysql> SELECT ST_Length(ST_GeomFromText(@mls));
  +----------------------------------+
  | ST_Length(ST_GeomFromText(@mls)) |
  +----------------------------------+
  |                4.242640687119286 |
  +----------------------------------+
  ```

  [`ST_Length()`](gis-linestring-property-functions.html#function_st-length) should be used in
  preference to [`GLength()`](gis-linestring-property-functions.html#function_glength),
  which has a nonstandard name.

* [`ST_NumPoints(ls)`](gis-linestring-property-functions.html#function_st-numpoints)

  Returns the number of `Point` objects in
  the `LineString` value
  *`ls`*. If the argument is
  `NULL` or an empty geometry, the return
  value is `NULL`.

  ```sql
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_NumPoints(ST_GeomFromText(@ls));
  +------------------------------------+
  | ST_NumPoints(ST_GeomFromText(@ls)) |
  +------------------------------------+
  |                                  3 |
  +------------------------------------+
  ```

  [`ST_NumPoints()`](gis-linestring-property-functions.html#function_st-numpoints) and
  [`NumPoints()`](gis-linestring-property-functions.html#function_numpoints) are synonyms.

* [`ST_PointN(ls,
  N)`](gis-linestring-property-functions.html#function_st-pointn)

  Returns the *`N`*-th
  `Point` in the
  `Linestring` value
  *`ls`*. Points are numbered beginning
  with 1. If any argument is `NULL` or the
  geometry argument is an empty geometry, the return value is
  `NULL`.

  ```sql
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_AsText(ST_PointN(ST_GeomFromText(@ls),2));
  +----------------------------------------------+
  | ST_AsText(ST_PointN(ST_GeomFromText(@ls),2)) |
  +----------------------------------------------+
  | POINT(2 2)                                   |
  +----------------------------------------------+
  ```

  [`ST_PointN()`](gis-linestring-property-functions.html#function_st-pointn) and
  [`PointN()`](gis-linestring-property-functions.html#function_pointn) are synonyms.

* [`ST_StartPoint(ls)`](gis-linestring-property-functions.html#function_st-startpoint)

  Returns the `Point` that is the start point
  of the `LineString` value
  *`ls`*. If the argument is
  `NULL` or an empty geometry, the return
  value is `NULL`.

  ```sql
  mysql> SET @ls = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_AsText(ST_StartPoint(ST_GeomFromText(@ls)));
  +------------------------------------------------+
  | ST_AsText(ST_StartPoint(ST_GeomFromText(@ls))) |
  +------------------------------------------------+
  | POINT(1 1)                                     |
  +------------------------------------------------+
  ```

  [`ST_StartPoint()`](gis-linestring-property-functions.html#function_st-startpoint) and
  [`StartPoint()`](gis-linestring-property-functions.html#function_startpoint) are synonyms.

* [`StartPoint(ls)`](gis-linestring-property-functions.html#function_startpoint)

  [`ST_StartPoint()`](gis-linestring-property-functions.html#function_st-startpoint) and
  [`StartPoint()`](gis-linestring-property-functions.html#function_startpoint) are synonyms.
  For more information, see the description of
  [`ST_StartPoint()`](gis-linestring-property-functions.html#function_st-startpoint).

  [`StartPoint()`](gis-linestring-property-functions.html#function_startpoint) is deprecated;
  expect it to be removed in a future MySQL release. Use
  [`ST_StartPoint()`](gis-linestring-property-functions.html#function_st-startpoint) instead.