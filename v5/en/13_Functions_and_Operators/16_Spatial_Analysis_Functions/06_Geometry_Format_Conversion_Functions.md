### 12.16.6 Geometry Format Conversion Functions

MySQL supports the functions listed in this section for converting
geometry values from internal geometry format to WKT or WKB
format.

There are also functions to convert a string from WKT or WKB
format to internal geometry format. See
[Section 12.16.3, “Functions That Create Geometry Values from WKT Values”](gis-wkt-functions.html "12.16.3 Functions That Create Geometry Values from WKT Values"), and
[Section 12.16.4, “Functions That Create Geometry Values from WKB Values”](gis-wkb-functions.html "12.16.4 Functions That Create Geometry Values from WKB Values").

* [`AsBinary(g)`](gis-format-conversion-functions.html#function_asbinary),
  [`AsWKB(g)`](gis-format-conversion-functions.html#function_asbinary)

  [`ST_AsBinary()`](gis-format-conversion-functions.html#function_st-asbinary),
  [`ST_AsWKB()`](gis-format-conversion-functions.html#function_st-asbinary),
  [`AsBinary()`](gis-format-conversion-functions.html#function_asbinary), and
  [`AsWKB()`](gis-format-conversion-functions.html#function_asbinary)
  are synonyms. For more information, see the description of
  [`ST_AsBinary()`](gis-format-conversion-functions.html#function_st-asbinary).

  [`AsBinary()`](gis-format-conversion-functions.html#function_asbinary) and
  [`AsWKB()`](gis-format-conversion-functions.html#function_asbinary)
  are deprecated; expect them to be removed in a future MySQL
  release. Use [`ST_AsBinary()`](gis-format-conversion-functions.html#function_st-asbinary) and
  [`ST_AsWKB()`](gis-format-conversion-functions.html#function_st-asbinary)
  instead.

* [`AsText(g)`](gis-format-conversion-functions.html#function_astext),
  [`AsWKT(g)`](gis-format-conversion-functions.html#function_astext)

  [`ST_AsText()`](gis-format-conversion-functions.html#function_st-astext),
  [`ST_AsWKT()`](gis-format-conversion-functions.html#function_st-astext),
  [`AsText()`](gis-format-conversion-functions.html#function_astext), and
  [`AsWKT()`](gis-format-conversion-functions.html#function_astext) are
  synonyms. For more information, see the description of
  [`ST_AsText()`](gis-format-conversion-functions.html#function_st-astext).

  [`AsText()`](gis-format-conversion-functions.html#function_astext) and
  [`AsWKT()`](gis-format-conversion-functions.html#function_astext) are
  deprecated; expect them to be removed in a future MySQL
  release. Use [`ST_AsText()`](gis-format-conversion-functions.html#function_st-astext) and
  [`ST_AsWKT()`](gis-format-conversion-functions.html#function_st-astext)
  instead.

* [`ST_AsBinary(g)`](gis-format-conversion-functions.html#function_st-asbinary),
  [`ST_AsWKB(g)`](gis-format-conversion-functions.html#function_st-asbinary)

  Converts a value in internal geometry format to its WKB
  representation and returns the binary result.

  If the argument is `NULL`, the return value
  is `NULL`. If the argument is not a
  syntactically well-formed geometry, an
  [`ER_GIS_INVALID_DATA`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_gis_invalid_data) error
  occurs.

  ```sql
  SELECT ST_AsBinary(g) FROM geom;
  ```

  [`ST_AsBinary()`](gis-format-conversion-functions.html#function_st-asbinary),
  [`ST_AsWKB()`](gis-format-conversion-functions.html#function_st-asbinary),
  [`AsBinary()`](gis-format-conversion-functions.html#function_asbinary), and
  [`AsWKB()`](gis-format-conversion-functions.html#function_asbinary)
  are synonyms.

* [`ST_AsText(g)`](gis-format-conversion-functions.html#function_st-astext),
  [`ST_AsWKT(g)`](gis-format-conversion-functions.html#function_st-astext)

  Converts a value in internal geometry format to its WKT
  representation and returns the string result.

  If the argument is `NULL`, the return value
  is `NULL`. If the argument is not a
  syntactically well-formed geometry, an
  [`ER_GIS_INVALID_DATA`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_gis_invalid_data) error
  occurs.

  ```sql
  mysql> SET @g = 'LineString(1 1,2 2,3 3)';
  mysql> SELECT ST_AsText(ST_GeomFromText(@g));
  +--------------------------------+
  | ST_AsText(ST_GeomFromText(@g)) |
  +--------------------------------+
  | LINESTRING(1 1,2 2,3 3)        |
  +--------------------------------+
  ```

  [`ST_AsText()`](gis-format-conversion-functions.html#function_st-astext),
  [`ST_AsWKT()`](gis-format-conversion-functions.html#function_st-astext),
  [`AsText()`](gis-format-conversion-functions.html#function_astext), and
  [`AsWKT()`](gis-format-conversion-functions.html#function_astext) are
  synonyms.

  Output for `MultiPoint` values includes
  parentheses around each point. For example:

  ```sql
  mysql> SET @mp = 'MULTIPOINT(1 1, 2 2, 3 3)';
  mysql> SELECT ST_AsText(ST_GeomFromText(@mp));
  +---------------------------------+
  | ST_AsText(ST_GeomFromText(@mp)) |
  +---------------------------------+
  | MULTIPOINT((1 1),(2 2),(3 3))   |
  +---------------------------------+
  ```