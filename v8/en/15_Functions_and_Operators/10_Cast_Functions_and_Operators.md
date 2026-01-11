## 14.10 Cast Functions and Operators

**Table 14.15 Cast Functions and Operators**

<table summary="A reference that lists cast functions and operators."><thead><tr><th>Name</th> <th>Description</th> <th>Deprecated</th> </tr></thead><tbody><tr><th><code>BINARY</code></th> <td> Cast a string to a binary string </td> <td>8.0.27</td> </tr><tr><th><code>CAST()</code></th> <td> Cast a value as a certain type </td> <td></td> </tr><tr><th><code>CONVERT()</code></th> <td> Cast a value as a certain type </td> <td></td> </tr></tbody></table>

Cast functions and operators enable conversion of values from one data type to another.

* Cast Function and Operator Descriptions
* Character Set Conversions
* Character Set Conversions for String Comparisons
* Cast Operations on Spatial Types
* Other Uses for Cast Operations

### Cast Function and Operator Descriptions

* `BINARY` *`expr`*

  The `BINARY` operator converts the expression to a binary string (a string that has the `binary` character set and `binary` collation). A common use for `BINARY` is to force a character string comparison to be done byte by byte using numeric byte values rather than character by character. The `BINARY` operator also causes trailing spaces in comparisons to be significant. For information about the differences between the `binary` collation of the `binary` character set and the `_bin` collations of nonbinary character sets, see Section 12.8.5, “The binary Collation Compared to _bin Collations”.

  The `BINARY` operator is deprecated as of MySQL 8.0.27, and you should expect its removal in a future version of MySQL. Use `CAST(... AS BINARY)` instead.

  ```
  mysql> SET NAMES utf8mb4 COLLATE utf8mb4_general_ci;
          -> OK
  mysql> SELECT 'a' = 'A';
          -> 1
  mysql> SELECT BINARY 'a' = 'A';
          -> 0
  mysql> SELECT 'a' = 'a ';
          -> 1
  mysql> SELECT BINARY 'a' = 'a ';
          -> 0
  ```

  In a comparison, `BINARY` affects the entire operation; it can be given before either operand with the same result.

  To convert a string expression to a binary string, these constructs are equivalent:

  ```
  CONVERT(expr USING BINARY)
  CAST(expr AS BINARY)
  BINARY expr
  ```

  If a value is a string literal, it can be designated as a binary string without converting it by using the `_binary` character set introducer:

  ```
  mysql> SELECT 'a' = 'A';
          -> 1
  mysql> SELECT _binary 'a' = 'A';
          -> 0
  ```

  For information about introducers, see Section 12.3.8, “Character Set Introducers”.

  The `BINARY` operator in expressions differs in effect from the `BINARY` attribute in character column definitions. For a character column defined with the `BINARY` attribute, MySQL assigns the table default character set and the binary (`_bin`) collation of that character set. Every nonbinary character set has a `_bin` collation. For example, if the table default character set is `utf8mb4`, these two column definitions are equivalent:

  ```
  CHAR(10) BINARY
  CHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin
  ```

  The use of `CHARACTER SET binary` in the definition of a `CHAR`, `VARCHAR`, or `TEXT` column causes the column to be treated as the corresponding binary string data type. For example, the following pairs of definitions are equivalent:

  ```
  CHAR(10) CHARACTER SET binary
  BINARY(10)

  VARCHAR(10) CHARACTER SET binary
  VARBINARY(10)

  TEXT CHARACTER SET binary
  BLOB
  ```

  If `BINARY` is invoked from within the **mysql** client, binary strings display using hexadecimal notation, depending on the value of the `--binary-as-hex`. For more information about that option, see Section 6.5.1, “mysql — The MySQL Command-Line Client”.

* `CAST(expr AS type [ARRAY])`

  `CAST(timestamp_value AT TIME ZONE timezone_specifier AS DATETIME[(precision)])`

  *`timezone_specifier`*: [INTERVAL] '+00:00' | 'UTC'

  With `CAST(expr AS type` syntax, the `CAST()` function takes an expression of any type and produces a result value of the specified type. This operation may also be expressed as `CONVERT(expr, type)`, which is equivalent. If *`expr`* is `NULL`, `CAST()` returns `NULL`.

  These *`type`* values are permitted:

  + `BINARY[(N)]`

    Produces a string with the `VARBINARY` data type, except that when the expression *`expr`* is empty (zero length), the result type is `BINARY(0)`. If the optional length *`N`* is given, `BINARY(N)` causes the cast to use no more than *`N`* bytes of the argument. Values shorter than *`N`* bytes are padded with `0x00` bytes to a length of *`N`*. If the optional length *`N`* is not given, MySQL calculates the maximum length from the expression. If the supplied or calculated length is greater than an internal threshold, the result type is `BLOB`. If the length is still too long, the result type is `LONGBLOB`.

    For a description of how casting to `BINARY` affects comparisons, see Section 13.3.3, “The BINARY and VARBINARY Types”.

  + `CHAR[(N)] [charset_info]`

    Produces a string with the `VARCHAR` data type, unless the expression *`expr`* is empty (zero length), in which case the result type is `CHAR(0)`. If the optional length *`N`* is given, `CHAR(N)` causes the cast to use no more than *`N`* characters of the argument. No padding occurs for values shorter than *`N`* characters. If the optional length *`N`* is not given, MySQL calculates the maximum length from the expression. If the supplied or calculated length is greater than an internal threshold, the result type is `TEXT`. If the length is still too long, the result type is `LONGTEXT`.

    With no *`charset_info`* clause, `CHAR` produces a string with the default character set. To specify the character set explicitly, these *`charset_info`* values are permitted:

    - `CHARACTER SET charset_name`: Produces a string with the given character set.

    - `ASCII`: Shorthand for `CHARACTER SET latin1`.

    - `UNICODE`: Shorthand for `CHARACTER SET ucs2`.

    In all cases, the string has the character set default collation.

  + `DATE`

    Produces a `DATE` value.

  + `DATETIME[(M)]`

    Produces a `DATETIME` value. If the optional *`M`* value is given, it specifies the fractional seconds precision.

  + `DECIMAL[(M[,D])]`

    Produces a `DECIMAL` - DECIMAL, NUMERIC") value. If the optional *`M`* and *`D`* values are given, they specify the maximum number of digits (the precision) and the number of digits following the decimal point (the scale). If *`D`* is omitted, 0 is assumed. If *`M`* is omitted, 10 is assumed.

  + `DOUBLE`

    Produces a `DOUBLE` - FLOAT, DOUBLE") result. Added in MySQL 8.0.17.

  + `FLOAT[(p)]`

    If the precision *`p`* is not specified, produces a result of type `FLOAT` - FLOAT, DOUBLE"). If *`p`* is provided and 0 <= < *`p`* <= 24, the result is of type `FLOAT`. If 25 <= *`p`* <= 53, the result is of type `DOUBLE` - FLOAT, DOUBLE"). If *`p`* < 0 or *`p`* > 53, an error is returned. Added in MySQL 8.0.17.

  + `JSON`

    Produces a `JSON` value. For details on the rules for conversion of values between `JSON` and other types, see Comparison and Ordering of JSON Values.

  + `NCHAR[(N)]`

    Like `CHAR`, but produces a string with the national character set. See Section 12.3.7, “The National Character Set”.

    Unlike `CHAR`, `NCHAR` does not permit trailing character set information to be specified.

  + `REAL`

    Produces a result of type `REAL` - FLOAT, DOUBLE"). This is actually `FLOAT` if the `REAL_AS_FLOAT` SQL mode is enabled; otherwise the result is of type `DOUBLE`.

  + `SIGNED [INTEGER]`

    Produces a signed `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") value.

  + *`spatial_type`*

    As of MySQL 8.0.24, `CAST()` and `CONVERT()` support casting geometry values from one spatial type to another, for certain combinations of spatial types. For details, see Cast Operations on Spatial Types.

  + `TIME[(M)]`

    Produces a `TIME` value. If the optional *`M`* value is given, it specifies the fractional seconds precision.

  + `UNSIGNED [INTEGER]`

    Produces an unsigned `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") value.

  + `YEAR`

    Produces a `YEAR` value. Added in MySQL 8.0.22. These rules govern conversion to `YEAR`:

    - For a four-digit number in the range 1901-2155 inclusive, or for a string which can be interpreted as a four-digit number in this range, return the corresponding `YEAR` value.

    - For a number consisting of one or two digits, or for a string which can be interpreted as such a number, return a `YEAR` value as follows:

      * If the number is in the range 1-69 inclusive, add 2000 and return the sum.

      * If the number is in the range 70-99 inclusive, add 1900 and return the sum.

    - For a string which evaluates to 0, return 2000.
    - For the number 0, return 0.
    - For a `DATE`, `DATETIME`, or `TIMESTAMP` value, return the `YEAR` portion of the value. For a `TIME` value, return the current year.

      If you do not specify the type of a `TIME` argument, you may get a different result from what you expect, as shown here:

      ```
      mysql> SELECT CAST("11:35:00" AS YEAR), CAST(TIME "11:35:00" AS YEAR);
      +--------------------------+-------------------------------+
      | CAST("11:35:00" AS YEAR) | CAST(TIME "11:35:00" AS YEAR) |
      +--------------------------+-------------------------------+
      |                     2011 |                          2021 |
      +--------------------------+-------------------------------+
      ```

    - If the argument is of type `DECIMAL` - DECIMAL, NUMERIC"), `DOUBLE` - FLOAT, DOUBLE"), `DECIMAL` - DECIMAL, NUMERIC"), or `REAL` - FLOAT, DOUBLE"), round the value to the nearest integer, then attempt to cast the value to `YEAR` using the rules for integer values, as shown here:

      ```
      mysql> SELECT CAST(1944.35 AS YEAR), CAST(1944.50 AS YEAR);
      +-----------------------+-----------------------+
      | CAST(1944.35 AS YEAR) | CAST(1944.50 AS YEAR) |
      +-----------------------+-----------------------+
      |                  1944 |                  1945 |
      +-----------------------+-----------------------+

      mysql> SELECT CAST(66.35 AS YEAR), CAST(66.50 AS YEAR);
      +---------------------+---------------------+
      | CAST(66.35 AS YEAR) | CAST(66.50 AS YEAR) |
      +---------------------+---------------------+
      |                2066 |                2067 |
      +---------------------+---------------------+
      ```

    - An argument of type `GEOMETRY` cannot be converted to `YEAR`.

    - For a value that cannot be successfully converted to `YEAR`, return `NULL`.

    A string value containing non-numeric characters which must be truncated prior to conversion raises a warning, as shown here:

    ```
    mysql> SELECT CAST("1979aaa" AS YEAR);
    +-------------------------+
    | CAST("1979aaa" AS YEAR) |
    +-------------------------+
    |                    1979 |
    +-------------------------+
    1 row in set, 1 warning (0.00 sec)

    mysql> SHOW WARNINGS;
    +---------+------+-------------------------------------------+
    | Level   | Code | Message                                   |
    +---------+------+-------------------------------------------+
    | Warning | 1292 | Truncated incorrect YEAR value: '1979aaa' |
    +---------+------+-------------------------------------------+
    ```

  In MySQL 8.0.17 and higher, `InnoDB` allows the use of an additional `ARRAY` keyword for creating a multi-valued index on a `JSON` array as part of `CREATE INDEX`, `CREATE TABLE`, and `ALTER TABLE` statements. `ARRAY` is not supported except when used to create a multi-valued index in one of these statements, in which case it is required. The column being indexed must be a column of type `JSON`. With `ARRAY`, the *`type`* following the `AS` keyword may specify any of the types supported by `CAST()`, with the exceptions of `BINARY`, `JSON`, and `YEAR`. For syntax information and examples, as well as other relevant information, see Multi-Valued Indexes.

  Note

  `CONVERT()`, unlike `CAST()`, does *not* support multi-valued index creation or the `ARRAY` keyword.

  Beginning with MySQL 8.0.22, `CAST()` supports retrieval of a `TIMESTAMP` value as being in UTC, using the `AT TIMEZONE` operator. The only supported time zone is UTC; this can be specified as either of `'+00:00'` or `'UTC'`. The only return type supported by this syntax is `DATETIME`, with an optional precision specifier in the range of 0 to 6, inclusive.

  `TIMESTAMP` values that use timezone offsets are also supported.

  ```
  mysql> SELECT @@system_time_zone;
  +--------------------+
  | @@system_time_zone |
  +--------------------+
  | EDT                |
  +--------------------+
  1 row in set (0.00 sec)

  mysql> CREATE TABLE tz (c TIMESTAMP);
  Query OK, 0 rows affected (0.41 sec)

  mysql> INSERT INTO tz VALUES
      ->     ROW(CURRENT_TIMESTAMP),
      ->     ROW('2020-07-28 14:50:15+1:00');
  Query OK, 1 row affected (0.08 sec)

  mysql> TABLE tz;
  +---------------------+
  | c                   |
  +---------------------+
  | 2020-07-28 09:22:41 |
  | 2020-07-28 09:50:15 |
  +---------------------+
  2 rows in set (0.00 sec)

  mysql> SELECT CAST(c AT TIME ZONE '+00:00' AS DATETIME) AS u FROM tz;
  +---------------------+
  | u                   |
  +---------------------+
  | 2020-07-28 13:22:41 |
  | 2020-07-28 13:50:15 |
  +---------------------+
  2 rows in set (0.00 sec)

  mysql> SELECT CAST(c AT TIME ZONE 'UTC' AS DATETIME(2)) AS u FROM tz;
  +------------------------+
  | u                      |
  +------------------------+
  | 2020-07-28 13:22:41.00 |
  | 2020-07-28 13:50:15.00 |
  +------------------------+
  2 rows in set (0.00 sec)
  ```

  If you use `'UTC'` as the time zone specifier with this form of `CAST()`, and the server raises an error such as Unknown or incorrect time zone: 'UTC', you may need to install the MySQL time zone tables (see Populating the Time Zone Tables).

  `AT TIME ZONE` does not support the `ARRAY` keyword, and is not supported by the `CONVERT()` function.

* `CONVERT(expr USING transcoding_name)`

  `CONVERT(expr,type)`

  `CONVERT(expr USING transcoding_name)` is standard SQL syntax. The non-`USING` form of `CONVERT()` is ODBC syntax. Regardless of the syntax used, the function returns `NULL` if *`expr`* is `NULL`.

  `CONVERT(expr USING transcoding_name)` converts data between different character sets. In MySQL, transcoding names are the same as the corresponding character set names. For example, this statement converts the string `'abc'` in the default character set to the corresponding string in the `utf8mb4` character set:

  ```
  SELECT CONVERT('abc' USING utf8mb4);
  ```

  `CONVERT(expr, type)` syntax (without `USING`) takes an expression and a *`type`* value specifying a result type, and produces a result value of the specified type. This operation may also be expressed as `CAST(expr AS type)`, which is equivalent. For more information, see the description of `CAST()`.

  Note

  Prior to MySQL 8.0.28, this function sometimes allowed invalid conversions of `BINARY` values to a nonbinary character set. When `CONVERT()` was used as part of the expression for an indexed generated column, this could lead to index corruption following an upgrade from a previous version of MySQL. See SQL Changes, for information about how to handle this situation.

### Character Set Conversions

`CONVERT()` with a `USING` clause converts data between character sets:

```
CONVERT(expr USING transcoding_name)
```

In MySQL, transcoding names are the same as the corresponding character set names.

Examples:

```
SELECT CONVERT('test' USING utf8mb4);
SELECT CONVERT(_latin1'Müller' USING utf8mb4);
INSERT INTO utf8mb4_table (utf8mb4_column)
    SELECT CONVERT(latin1_column USING utf8mb4) FROM latin1_table;
```

To convert strings between character sets, you can also use `CONVERT(expr, type)` syntax (without `USING`), or `CAST(expr AS type)`, which is equivalent:

```
CONVERT(string, CHAR[(N)] CHARACTER SET charset_name)
CAST(string AS CHAR[(N)] CHARACTER SET charset_name)
```

Examples:

```
SELECT CONVERT('test', CHAR CHARACTER SET utf8mb4);
SELECT CAST('test' AS CHAR CHARACTER SET utf8mb4);
```

If you specify `CHARACTER SET charset_name` as just shown, the character set and collation of the result are *`charset_name`* and the default collation of *`charset_name`*. If you omit `CHARACTER SET charset_name`, the character set and collation of the result are defined by the `character_set_connection` and `collation_connection` system variables that determine the default connection character set and collation (see Section 12.4, “Connection Character Sets and Collations”).

A `COLLATE` clause is not permitted within a `CONVERT()` or `CAST()` call, but you can apply it to the function result. For example, these are legal:

```
SELECT CONVERT('test' USING utf8mb4) COLLATE utf8mb4_bin;
SELECT CONVERT('test', CHAR CHARACTER SET utf8mb4) COLLATE utf8mb4_bin;
SELECT CAST('test' AS CHAR CHARACTER SET utf8mb4) COLLATE utf8mb4_bin;
```

But these are illegal:

```
SELECT CONVERT('test' USING utf8mb4 COLLATE utf8mb4_bin);
SELECT CONVERT('test', CHAR CHARACTER SET utf8mb4 COLLATE utf8mb4_bin);
SELECT CAST('test' AS CHAR CHARACTER SET utf8mb4 COLLATE utf8mb4_bin);
```

For string literals, another way to specify the character set is to use a character set introducer. `_latin1` and `_latin2` in the preceding example are instances of introducers. Unlike conversion functions such as `CAST()`, or `CONVERT()`, which convert a string from one character set to another, an introducer designates a string literal as having a particular character set, with no conversion involved. For more information, see Section 12.3.8, “Character Set Introducers”.

### Character Set Conversions for String Comparisons

Normally, you cannot compare a `BLOB` value or other binary string in case-insensitive fashion because binary strings use the `binary` character set, which has no collation with the concept of lettercase. To perform a case-insensitive comparison, first use the `CONVERT()` or `CAST()` function to convert the value to a nonbinary string. Comparisons of the resulting string use its collation. For example, if the conversion result collation is not case-sensitive, a `LIKE` operation is not case-sensitive. That is true for the following operation because the default `utf8mb4` collation (`utf8mb4_0900_ai_ci`) is not case-sensitive:

```
SELECT 'A' LIKE CONVERT(blob_col USING utf8mb4)
  FROM tbl_name;
```

To specify a particular collation for the converted string, use a `COLLATE` clause following the `CONVERT()` call:

```
SELECT 'A' LIKE CONVERT(blob_col USING utf8mb4) COLLATE utf8mb4_unicode_ci
  FROM tbl_name;
```

To use a different character set, substitute its name for `utf8mb4` in the preceding statements (and similarly to use a different collation).

`CONVERT()` and `CAST()` can be used more generally for comparing strings represented in different character sets. For example, a comparison of these strings results in an error because they have different character sets:

```
mysql> SET @s1 = _latin1 'abc', @s2 = _latin2 'abc';
mysql> SELECT @s1 = @s2;
ERROR 1267 (HY000): Illegal mix of collations (latin1_swedish_ci,IMPLICIT)
and (latin2_general_ci,IMPLICIT) for operation '='
```

Converting one of the strings to a character set compatible with the other enables the comparison to occur without error:

```
mysql> SELECT @s1 = CONVERT(@s2 USING latin1);
+---------------------------------+
| @s1 = CONVERT(@s2 USING latin1) |
+---------------------------------+
|                               1 |
+---------------------------------+
```

Character set conversion is also useful preceding lettercase conversion of binary strings. `LOWER()` and `UPPER()` are ineffective when applied directly to binary strings because the concept of lettercase does not apply. To perform lettercase conversion of a binary string, first convert it to a nonbinary string using a character set appropriate for the data stored in the string:

```
mysql> SET @str = BINARY 'New York';
mysql> SELECT LOWER(@str), LOWER(CONVERT(@str USING utf8mb4));
+-------------+------------------------------------+
| LOWER(@str) | LOWER(CONVERT(@str USING utf8mb4)) |
+-------------+------------------------------------+
| New York    | new york                           |
+-------------+------------------------------------+
```

Be aware that if you apply `BINARY`, `CAST()`, or `CONVERT()` to an indexed column, MySQL may not be able to use the index efficiently.

### Cast Operations on Spatial Types

As of MySQL 8.0.24, `CAST()` and `CONVERT()` support casting geometry values from one spatial type to another, for certain combinations of spatial types. The following list shows the permitted type combinations, where “MySQL extension” designates casts implemented in MySQL beyond those defined in the SQL/MM standard:

* From `Point` to:

  + `MultiPoint`
  + `GeometryCollection`
* From `LineString` to:

  + `Polygon` (MySQL extension)
  + `MultiPoint` (MySQL extension)
  + `MultiLineString`
  + `GeometryCollection`
* From `Polygon` to:

  + `LineString` (MySQL extension)
  + `MultiLineString` (MySQL extension)
  + `MultiPolygon`
  + `GeometryCollection`
* From `MultiPoint` to:

  + `Point`
  + `LineString` (MySQL extension)
  + `GeometryCollection`
* From `MultiLineString` to:

  + `LineString`
  + `Polygon` (MySQL extension)
  + `MultiPolygon` (MySQL extension)
  + `GeometryCollection`
* From `MultiPolygon` to:

  + `Polygon`
  + `MultiLineString` (MySQL extension)
  + `GeometryCollection`
* From `GeometryCollection` to:

  + `Point`
  + `LineString`
  + `Polygon`
  + `MultiPoint`
  + `MultiLineString`
  + `MultiPolygon`

In spatial casts, `GeometryCollection` and `GeomCollection` are synonyms for the same result type.

Some conditions apply to all spatial type casts, and some conditions apply only when the cast result is to have a particular spatial type. For information about terms such as “well-formed geometry,” see Section 13.4.4, “Geometry Well-Formedness and Validity”.

* General Conditions for Spatial Casts
* Conditions for Casts to Point
* Conditions for Casts to LineString
* Conditions for Casts to Polygon
* Conditions for Casts to MultiPoint
* Conditions for Casts to MultiLineString
* Conditions for Casts to MultiPolygon
* Conditions for Casts to GeometryCollection

#### General Conditions for Spatial Casts

These conditions apply to all spatial casts regardless of the result type:

* The result of a cast is in the same SRS as that of the expression to cast.

* Casting between spatial types does not change coordinate values or order.

* If the expression to cast is `NULL`, the function result is `NULL`.

* Casting to spatial types using the `JSON_VALUE()` function with a `RETURNING` clause specifying a spatial type is not permitted.

* Casting to an `ARRAY` of spatial types is not permitted.

* If the spatial type combination is permitted but the expression to cast is not a syntactically well-formed geometry, an `ER_GIS_INVALID_DATA` error occurs.

* If the spatial type combination is permitted but the expression to cast is a syntactically well-formed geometry in an undefined spatial reference system (SRS), an `ER_SRS_NOT_FOUND` error occurs.

* If the expression to cast has a geographic SRS but has a longitude or latitude that is out of range, an error occurs:

  + If a longitude value is not in the range (−180, 180], an `ER_GEOMETRY_PARAM_LONGITUDE_OUT_OF_RANGE` error occurs.

  + If a latitude value is not in the range [−90, 90], an `ER_GEOMETRY_PARAM_LATITUDE_OUT_OF_RANGE` error occurs.

  Ranges shown are in degrees. If an SRS uses another unit, the range uses the corresponding values in its unit. The exact range limits deviate slightly due to floating-point arithmetic.

#### Conditions for Casts to Point

When the cast result type is `Point`, these conditions apply:

* If the expression to cast is a well-formed geometry of type `Point`, the function result is that `Point`.

* If the expression to cast is a well-formed geometry of type `MultiPoint` containing a single `Point`, the function result is that `Point`. If the expression contains more than one `Point`, an `ER_INVALID_CAST_TO_GEOMETRY` error occurs.

* If the expression to cast is a well-formed geometry of type `GeometryCollection` containing only a single `Point`, the function result is that `Point`. If the expression is empty, contains more than one `Point`, or contains other geometry types, an `ER_INVALID_CAST_TO_GEOMETRY` error occurs.

* If the expression to cast is a well-formed geometry of type other than `Point`, `MultiPoint`, `GeometryCollection`, an `ER_INVALID_CAST_TO_GEOMETRY` error occurs.

#### Conditions for Casts to LineString

When the cast result type is `LineString`, these conditions apply:

* If the expression to cast is a well-formed geometry of type `LineString`, the function result is that `LineString`.

* If the expression to cast is a well-formed geometry of type `Polygon` that has no inner rings, the function result is a `LineString` containing the points of the outer ring in the same order. If the expression has inner rings, an `ER_INVALID_CAST_TO_GEOMETRY` error occurs.

* If the expression to cast is a well-formed geometry of type `MultiPoint` containing at least two points, the function result is a `LineString` containing the points of the `MultiPoint` in the order they appear in the expression. If the expression contains only one `Point`, an `ER_INVALID_CAST_TO_GEOMETRY` error occurs.

* If the expression to cast is a well-formed geometry of type `MultiLineString` containing a single `LineString`, the function result is that `LineString`. If the expression contains more than one `LineString`, an `ER_INVALID_CAST_TO_GEOMETRY` error occurs.

* If the expression to cast is a well-formed geometry of type `GeometryCollection`, containing only a single `LineString`, the function result is that `LineString`. If the expression is empty, contains more than one `LineString`, or contains other geometry types, an `ER_INVALID_CAST_TO_GEOMETRY` error occurs.

* If the expression to cast is a well-formed geometry of type other than `LineString`, `Polygon`, `MultiPoint`, `MultiLineString`, or `GeometryCollection`, an `ER_INVALID_CAST_TO_GEOMETRY` error occurs.

#### Conditions for Casts to Polygon

When the cast result type is `Polygon`, these conditions apply:

* If the expression to cast is a well-formed geometry of type `LineString` that is a ring (that is, the start and end points are the same), the function result is a `Polygon` with an outer ring consisting of the points of the `LineString` in the same order. If the expression is not a ring, an `ER_INVALID_CAST_TO_GEOMETRY` error occurs. If the ring is not in the correct order (the exterior ring must be counter-clockwise), an `ER_INVALID_CAST_POLYGON_RING_DIRECTION` error occurs.

* If the expression to cast is a well-formed geometry of type `Polygon`, the function result is that `Polygon`.

* If the expression to cast is a well-formed geometry of type `MultiLineString` where all elements are rings, the function result is a `Polygon` with the first `LineString` as outer ring and any additional `LineString` values as inner rings. If any element of the expression is not a ring, an `ER_INVALID_CAST_TO_GEOMETRY` error occurs. If any ring is not in the correct order (the exterior ring must be counter-clockwise, interior rings must be clockwise), an `ER_INVALID_CAST_POLYGON_RING_DIRECTION` error occurs.

* If the expression to cast is a well-formed geometry of type `MultiPolygon` containing a single `Polygon`, the function result is that `Polygon`. If the expression contains more than one `Polygon`, an `ER_INVALID_CAST_TO_GEOMETRY` error occurs.

* If the expression to cast is a well-formed geometry of type `GeometryCollection` containing only a single `Polygon`, the function result is that `Polygon`. If the expression is empty, contains more than one `Polygon`, or contains other geometry types, an `ER_INVALID_CAST_TO_GEOMETRY` error occurs.

* If the expression to cast is a well-formed geometry of type other than `LineString`, `Polygon`, `MultiLineString`, `MultiPolygon`, or `GeometryCollection`, an `ER_INVALID_CAST_TO_GEOMETRY` error occurs.

#### Conditions for Casts to MultiPoint

When the cast result type is `MultiPoint`, these conditions apply:

* If the expression to cast is a well-formed geometry of type `Point`, the function result is a `MultiPoint` containing that `Point` as its sole element.

* If the expression to cast is a well-formed geometry of type `LineString`, the function result is a `MultiPoint` containing the points of the `LineString` in the same order.

* If the expression to cast is a well-formed geometry of type `MultiPoint`, the function result is that `MultiPoint`.

* If the expression to cast is a well-formed geometry of type `GeometryCollection` containing only points, the function result is a `MultiPoint` containing those points. If the `GeometryCollection` is empty or contains other geometry types, an `ER_INVALID_CAST_TO_GEOMETRY` error occurs.

* If the expression to cast is a well-formed geometry of type other than `Point`, `LineString`, `MultiPoint`, or `GeometryCollection`, an `ER_INVALID_CAST_TO_GEOMETRY` error occurs.

#### Conditions for Casts to MultiLineString

When the cast result type is `MultiLineString`, these conditions apply:

* If the expression to cast is a well-formed geometry of type `LineString`, the function result is a `MultiLineString` containing that `LineString` as its sole element.

* If the expression to cast is a well-formed geometry of type `Polygon`, the function result is a `MultiLineString` containing the outer ring of the `Polygon` as its first element and any inner rings as additional elements in the order they appear in the expression.

* If the expression to cast is a well-formed geometry of type `MultiLineString`, the function result is that `MultiLineString`.

* If the expression to cast is a well-formed geometry of type `MultiPolygon` containing only polygons without inner rings, the function result is a `MultiLineString` containing the polygon rings in the order they appear in the expression. If the expression contains any polygons with inner rings, an `ER_WRONG_PARAMETERS_TO_STORED_FCT` error occurs.

* If the expression to cast is a well-formed geometry of type `GeometryCollection` containing only linestrings, the function result is a `MultiLineString` containing those linestrings. If the expression is empty or contains other geometry types, an `ER_INVALID_CAST_TO_GEOMETRY` error occurs.

* If the expression to cast is a well-formed geometry of type other than `LineString`, `Polygon`, `MultiLineString`, `MultiPolygon`, or `GeometryCollection`, an `ER_INVALID_CAST_TO_GEOMETRY` error occurs.

#### Conditions for Casts to MultiPolygon

When the cast result type is `MultiPolygon`, these conditions apply:

* If the expression to cast is a well-formed geometry of type `Polygon`, the function result is a `MultiPolygon` containing the `Polygon` as its sole element.

* If the expression to cast is a well-formed geometry of type `MultiLineString` where all elements are rings, the function result is a `MultiPolygon` containing a `Polygon` with only an outer ring for each element of the expression. If any element is not a ring, an `ER_INVALID_CAST_TO_GEOMETRY` error occurs. If any ring is not in the correct order (exterior ring must be counter-clockwise), an `ER_INVALID_CAST_POLYGON_RING_DIRECTION` error occurs.

* If the expression to cast is a well-formed geometry of type `MultiPolygon`, the function result is that `MultiPolygon`.

* If the expression to cast is a well-formed geometry of type `GeometryCollection` containing only polygons, the function result is a `MultiPolygon` containing those polygons. If the expression is empty or contains other geometry types, an `ER_INVALID_CAST_TO_GEOMETRY` error occurs.

* If the expression to cast is a well-formed geometry of type other than `Polygon`, `MultiLineString`, `MultiPolygon`, or `GeometryCollection`, an `ER_INVALID_CAST_TO_GEOMETRY` error occurs.

#### Conditions for Casts to GeometryCollection

When the cast result type is `GeometryCollection`, these conditions apply:

* `GeometryCollection` and `GeomCollection` are synonyms for the same result type.

* If the expression to cast is a well-formed geometry of type `Point`, the function result is a `GeometryCollection` containing that `Point` as its sole element.

* If the expression to cast is a well-formed geometry of type `LineString`, the function result is a `GeometryCollection` containing that `LineString` as its sole element.

* If the expression to cast is a well-formed geometry of type `Polygon`, the function result is a `GeometryCollection` containing that `Polygon` as its sole element.

* If the expression to cast is a well-formed geometry of type `MultiPoint`, the function result is a `GeometryCollection` containing the points in the order they appear in the expression.

* If the expression to cast is a well-formed geometry of type `MultiLineString`, the function result is a `GeometryCollection` containing the linestrings in the order they appear in the expression.

* If the expression to cast is a well-formed geometry of type `MultiPolygon`, the function result is a `GeometryCollection` containing the elements of the `MultiPolygon` in the order they appear in the expression.

* If the expression to cast is a well-formed geometry of type `GeometryCollection`, the function result is that `GeometryCollection`.

### Other Uses for Cast Operations

The cast functions are useful for creating a column with a specific type in a `CREATE TABLE ... SELECT` statement:

```
mysql> CREATE TABLE new_table SELECT CAST('2000-01-01' AS DATE) AS c1;
mysql> SHOW CREATE TABLE new_table\G
*************************** 1. row ***************************
       Table: new_table
Create Table: CREATE TABLE `new_table` (
  `c1` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

The cast functions are useful for sorting `ENUM` columns in lexical order. Normally, sorting of `ENUM` columns occurs using the internal numeric values. Casting the values to `CHAR` results in a lexical sort:

```
SELECT enum_col FROM tbl_name
  ORDER BY CAST(enum_col AS CHAR);
```

`CAST()` also changes the result if you use it as part of a more complex expression such as `CONCAT('Date: ',CAST(NOW() AS DATE))`.

For temporal values, there is little need to use `CAST()` to extract data in different formats. Instead, use a function such as `EXTRACT()`, `DATE_FORMAT()`, or `TIME_FORMAT()`. See Section 14.7, “Date and Time Functions”.

To cast a string to a number, it normally suffices to use the string value in numeric context:

```
mysql> SELECT 1+'1';
       -> 2
```

That is also true for hexadecimal and bit literals, which are binary strings by default:

```
mysql> SELECT X'41', X'41'+0;
        -> 'A', 65
mysql> SELECT b'1100001', b'1100001'+0;
        -> 'a', 97
```

A string used in an arithmetic operation is converted to a floating-point number during expression evaluation.

A number used in string context is converted to a string:

```
mysql> SELECT CONCAT('hello you ',2);
        -> 'hello you 2'
```

For information about implicit conversion of numbers to strings, see Section 14.3, “Type Conversion in Expression Evaluation”.

MySQL supports arithmetic with both signed and unsigned 64-bit values. For numeric operators (such as `+` or `-`) where one of the operands is an unsigned integer, the result is unsigned by default (see Section 14.6.1, “Arithmetic Operators”). To override this, use the `SIGNED` or `UNSIGNED` cast operator to cast a value to a signed or unsigned 64-bit integer, respectively.

```
mysql> SELECT 1 - 2;
        -> -1
mysql> SELECT CAST(1 - 2 AS UNSIGNED);
        -> 18446744073709551615
mysql> SELECT CAST(CAST(1 - 2 AS UNSIGNED) AS SIGNED);
        -> -1
```

If either operand is a floating-point value, the result is a floating-point value and is not affected by the preceding rule. (In this context, `DECIMAL` - DECIMAL, NUMERIC") column values are regarded as floating-point values.)

```
mysql> SELECT CAST(1 AS UNSIGNED) - 2.0;
        -> -1.0
```

The SQL mode affects the result of conversion operations (see Section 7.1.11, “Server SQL Modes”). Examples:

* For conversion of a “zero” date string to a date, `CONVERT()` and `CAST()` return `NULL` and produce a warning when the `NO_ZERO_DATE` SQL mode is enabled.

* For integer subtraction, if the `NO_UNSIGNED_SUBTRACTION` SQL mode is enabled, the subtraction result is signed even if any operand is unsigned.
