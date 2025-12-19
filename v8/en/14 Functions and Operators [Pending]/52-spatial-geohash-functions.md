--- title: MySQL 8.4 Reference Manual :: 14.16.10 Spatial Geohash Functions url: https://dev.mysql.com/doc/refman/8.4/en/spatial-geohash-functions.html order: 52 ---



### 14.16.10 Spatial Geohash Functions

Geohash is a system for encoding latitude and longitude coordinates of arbitrary precision into a text string. Geohash values are strings that contain only characters chosen from `"0123456789bcdefghjkmnpqrstuvwxyz"`.

The functions in this section enable manipulation of geohash values, which provides applications the capabilities of importing and exporting geohash data, and of indexing and searching geohash values.

Unless otherwise specified, functions in this section handle their geometry arguments as follows:

* If any argument is `NULL`, the return value is `NULL`.
* If any argument is invalid, an error occurs.
* If any argument has a longitude or latitude that is out of range, an error occurs:

  + If a longitude value is not in the range (−180, 180], an `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE` error occurs.
  + If a latitude value is not in the range [−90, 90], an `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE` error occurs.

  Ranges shown are in degrees. The exact range limits deviate slightly due to floating-point arithmetic.
* If any point argument does not have SRID 0 or 4326, an `ER_SRS_NOT_FOUND` error occurs. *`point`* argument SRID validity is not checked.
* If any SRID argument refers to an undefined spatial reference system (SRS), an `ER_SRS_NOT_FOUND` error occurs.
* If any SRID argument is not within the range of a 32-bit unsigned integer, an `ER_DATA_OUT_OF_RANGE` error occurs.
* Otherwise, the return value is non-`NULL`.

These geohash functions are available:

* [`ST_GeoHash(longitude, latitude, max_length)`](spatial-geohash-functions.html#function_st-geohash), [`ST_GeoHash(point, max_length)`](spatial-geohash-functions.html#function_st-geohash)

  Returns a geohash string in the connection character set and collation.

  For the first syntax, the *`longitude`* must be a number in the range [−180, 180], and the *`latitude`* must be a number in the range [−90, 90]. For the second syntax, a `POINT` value is required, where the X and Y coordinates are in the valid ranges for longitude and latitude, respectively.

  The resulting string is no longer than *`max_length`* characters, which has an upper limit of 100. The string might be shorter than *`max_length`* characters because the algorithm that creates the geohash value continues until it has created a string that is either an exact representation of the location or *`max_length`* characters, whichever comes first.

   `ST_GeoHash()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SELECT ST_GeoHash(180,0,10), ST_GeoHash(-180,-90,15);
  +----------------------+-------------------------+
  | ST_GeoHash(180,0,10) | ST_GeoHash(-180,-90,15) |
  +----------------------+-------------------------+
  | xbpbpbpbpb           | 000000000000000         |
  +----------------------+-------------------------+
  ```
*  `ST_LatFromGeoHash(geohash_str)`

  Returns the latitude from a geohash string value, as a double-precision number in the range [−90, 90].

  The  `ST_LatFromGeoHash()` decoding function reads no more than 433 characters from the *`geohash_str`* argument. That represents the upper limit on information in the internal representation of coordinate values. Characters past the 433rd are ignored, even if they are otherwise illegal and produce an error.

   `ST_LatFromGeoHash()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SELECT ST_LatFromGeoHash(ST_GeoHash(45,-20,10));
  +------------------------------------------+
  | ST_LatFromGeoHash(ST_GeoHash(45,-20,10)) |
  +------------------------------------------+
  |                                      -20 |
  +------------------------------------------+
  ```
*  `ST_LongFromGeoHash(geohash_str)`

  Returns the longitude from a geohash string value, as a double-precision number in the range [−180, 180].

  The remarks in the description of `ST_LatFromGeoHash()` regarding the maximum number of characters processed from the *`geohash_str`* argument also apply to `ST_LongFromGeoHash()`.

   `ST_LongFromGeoHash()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SELECT ST_LongFromGeoHash(ST_GeoHash(45,-20,10));
  +-------------------------------------------+
  | ST_LongFromGeoHash(ST_GeoHash(45,-20,10)) |
  +-------------------------------------------+
  |                                        45 |
  +-------------------------------------------+
  ```
* [`ST_PointFromGeoHash(geohash_str, srid)`](spatial-geohash-functions.html#function_st-pointfromgeohash)

  Returns a `POINT` value containing the decoded geohash value, given a geohash string value.

  The X and Y coordinates of the point are the longitude in the range [−180, 180] and the latitude in the range [−90, 90], respectively.

  The *`srid`* argument is an 32-bit unsigned integer.

  The remarks in the description of `ST_LatFromGeoHash()` regarding the maximum number of characters processed from the *`geohash_str`* argument also apply to `ST_PointFromGeoHash()`.

   `ST_PointFromGeoHash()` handles its arguments as described in the introduction to this section.

  ```
  mysql> SET @gh = ST_GeoHash(45,-20,10);
  mysql> SELECT ST_AsText(ST_PointFromGeoHash(@gh,0));
  +---------------------------------------+
  | ST_AsText(ST_PointFromGeoHash(@gh,0)) |
  +---------------------------------------+
  | POINT(45 -20)                         |
  +---------------------------------------+
  ```

