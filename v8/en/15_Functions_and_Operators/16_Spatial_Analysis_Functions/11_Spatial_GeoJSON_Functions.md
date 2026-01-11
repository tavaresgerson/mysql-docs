### 14.16.11 Spatial GeoJSON Functions

This section describes functions for converting between GeoJSON documents and spatial values. GeoJSON is an open standard for encoding geometric/geographical features. For more information, see <http://geojson.org>. The functions discussed here follow GeoJSON specification revision 1.0.

GeoJSON supports the same geometric/geographic data types that MySQL supports. Feature and FeatureCollection objects are not supported, except that geometry objects are extracted from them. CRS support is limited to values that identify an SRID.

MySQL also supports a native `JSON` data type and a set of SQL functions to enable operations on JSON values. For more information, see Section 13.5, “The JSON Data Type”, and Section 14.17, “JSON Functions”.

* [`ST_AsGeoJSON(g [, max_dec_digits [, options)`](spatial-geojson-functions.html#function_st-asgeojson)

  Generates a GeoJSON object from the geometry *`g`*. The object string has the connection character set and collation.

  If any argument is `NULL`, the return value is `NULL`. If any non-`NULL` argument is invalid, an error occurs.

  *`max_dec_digits`*, if specified, limits the number of decimal digits for coordinates and causes rounding of output. If not specified, this argument defaults to its maximum value of 232 −

  1. The minimum is 0.

  *`options`*, if specified, is a bitmask. The following table shows the permitted flag values. If the geometry argument has an SRID of 0, no CRS object is produced even for those flag values that request one.

  <table summary="Option flags for the ST_AsGeoJSON() function."><thead><tr> <th>Flag Value</th> <th>Meaning</th> </tr></thead><tbody><tr> <td>0</td> <td>No options. This is the default if <em class="replaceable"><code>options</code></em> is not specified.</td> </tr><tr> <td>1</td> <td>Add a bounding box to the output.</td> </tr><tr> <td>2</td> <td>Add a short-format CRS URN to the output. The default format is a short format (<code>EPSG:<em class="replaceable"><code>srid</code></em></code>).</td> </tr><tr> <td>4</td> <td>Add a long-format CRS URN (<code>urn:ogc:def:crs:EPSG::<em class="replaceable"><code>srid</code></em></code>). This flag overrides flag 2. For example, option values of 5 and 7 mean the same (add a bounding box and a long-format CRS URN).</td> </tr></tbody></table>

  ```
  mysql> SELECT ST_AsGeoJSON(ST_GeomFromText('POINT(11.11111 12.22222)'),2);
  +-------------------------------------------------------------+
  | ST_AsGeoJSON(ST_GeomFromText('POINT(11.11111 12.22222)'),2) |
  +-------------------------------------------------------------+
  | {"type": "Point", "coordinates": [11.11, 12.22]}            |
  +-------------------------------------------------------------+
  ```

* [`ST_GeomFromGeoJSON(str [, options [, srid)`](spatial-geojson-functions.html#function_st-geomfromgeojson)

  Parses a string *`str`* representing a GeoJSON object and returns a geometry.

  If any argument is `NULL`, the return value is `NULL`. If any non-`NULL` argument is invalid, an error occurs.

  *`options`*, if given, describes how to handle GeoJSON documents that contain geometries with coordinate dimensions higher than 2. The following table shows the permitted *`options`* values.

  <table summary="Option flags for the ST_GeomFromGeoJSON() function."><thead><tr> <th>Option Value</th> <th>Meaning</th> </tr></thead><tbody><tr> <td>1</td> <td>Reject the document and produce an error. This is the default if <em class="replaceable"><code>options</code></em> is not specified.</td> </tr><tr> <td>2, 3, 4</td> <td>Accept the document and strip off the coordinates for higher coordinate dimensions.</td> </tr></tbody></table>

  *`options`* values of 2, 3, and 4 currently produce the same effect. If geometries with coordinate dimensions higher than 2 are supported in the future, you can expect these values to produce different effects.

  The *`srid`* argument, if given, must be a 32-bit unsigned integer. If not given, the geometry return value has an SRID of 4326.

  If *`srid`* refers to an undefined spatial reference system (SRS), an `ER_SRS_NOT_FOUND` error occurs.

  For geographic SRS geometry arguments, if any argument has a longitude or latitude that is out of range, an error occurs:

  + If a longitude value is not in the range (−180, 180], an `ER_LONGITUDE_OUT_OF_RANGE` error occurs.

  + If a latitude value is not in the range [−90, 90], an `ER_LATITUDE_OUT_OF_RANGE` error occurs.

  Ranges shown are in degrees. If an SRS uses another unit, the range uses the corresponding values in its unit. The exact range limits deviate slightly due to floating-point arithmetic.

  GeoJSON geometry, feature, and feature collection objects may have a `crs` property. The parsing function parses named CRS URNs in the `urn:ogc:def:crs:EPSG::srid` and `EPSG:srid` namespaces, but not CRSs given as link objects. Also, `urn:ogc:def:crs:OGC:1.3:CRS84` is recognized as SRID 4326. If an object has a CRS that is not understood, an error occurs, with the exception that if the optional *`srid`* argument is given, any CRS is ignored even if it is invalid.

  If a `crs` member that specifies an SRID different from the top-level object SRID is found at a lower level of the GeoJSON document, an `ER_INVALID_GEOJSON_CRS_NOT_TOP_LEVEL` error occurs.

  As specified in the GeoJSON specification, parsing is case-sensitive for the `type` member of the GeoJSON input (`Point`, `LineString`, and so forth). The specification is silent regarding case sensitivity for other parsing, which in MySQL is not case-sensitive.

  This example shows the parsing result for a simple GeoJSON object. Observe that the order of coordinates depends on the SRID used.

  ```
  mysql> SET @json = '{ "type": "Point", "coordinates": [102.0, 0.0]}';
  mysql> SELECT ST_AsText(ST_GeomFromGeoJSON(@json));
  +--------------------------------------+
  | ST_AsText(ST_GeomFromGeoJSON(@json)) |
  +--------------------------------------+
  | POINT(0 102)                         |
  +--------------------------------------+
  mysql> SELECT ST_SRID(ST_GeomFromGeoJSON(@json));
  +------------------------------------+
  | ST_SRID(ST_GeomFromGeoJSON(@json)) |
  +------------------------------------+
  |                               4326 |
  +------------------------------------+
  mysql> SELECT ST_AsText(ST_SRID(ST_GeomFromGeoJSON(@json),0));
  +-------------------------------------------------+
  | ST_AsText(ST_SRID(ST_GeomFromGeoJSON(@json),0)) |
  +-------------------------------------------------+
  | POINT(102 0)                                    |
  +-------------------------------------------------+
  ```
