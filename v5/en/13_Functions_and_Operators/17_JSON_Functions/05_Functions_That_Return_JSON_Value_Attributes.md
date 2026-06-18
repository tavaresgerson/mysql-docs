### 12.17.5 Functions That Return JSON Value Attributes

The functions in this section return attributes of JSON values.

* [`JSON_DEPTH(json_doc)`](json-attribute-functions.html#function_json-depth)

  Returns the maximum depth of a JSON document. Returns
  `NULL` if the argument is
  `NULL`. An error occurs if the argument is
  not a valid JSON document.

  An empty array, empty object, or scalar value has depth 1. A
  nonempty array containing only elements of depth 1 or nonempty
  object containing only member values of depth 1 has depth 2.
  Otherwise, a JSON document has depth greater than 2.

  ```sql
  mysql> SELECT JSON_DEPTH('{}'), JSON_DEPTH('[]'), JSON_DEPTH('true');
  +------------------+------------------+--------------------+
  | JSON_DEPTH('{}') | JSON_DEPTH('[]') | JSON_DEPTH('true') |
  +------------------+------------------+--------------------+
  |                1 |                1 |                  1 |
  +------------------+------------------+--------------------+
  mysql> SELECT JSON_DEPTH('[10, 20]'), JSON_DEPTH('[[], {}]');
  +------------------------+------------------------+
  | JSON_DEPTH('[10, 20]') | JSON_DEPTH('[[], {}]') |
  +------------------------+------------------------+
  |                      2 |                      2 |
  +------------------------+------------------------+
  mysql> SELECT JSON_DEPTH('[10, {"a": 20}]');
  +-------------------------------+
  | JSON_DEPTH('[10, {"a": 20}]') |
  +-------------------------------+
  |                             3 |
  +-------------------------------+
  ```

* [`JSON_LENGTH(json_doc[,
  path])`](json-attribute-functions.html#function_json-length)

  Returns the length of a JSON document, or, if a
  *`path`* argument is given, the length
  of the value within the document identified by the path.
  Returns `NULL` if any argument is
  `NULL` or the *`path`*
  argument does not identify a value in the document. An error
  occurs if the *`json_doc`* argument is
  not a valid JSON document or the
  *`path`* argument is not a valid path
  expression or contains a `*` or
  `**` wildcard.

  The length of a document is determined as follows:

  + The length of a scalar is 1.
  + The length of an array is the number of array elements.
  + The length of an object is the number of object members.
  + The length does not count the length of nested arrays or
    objects.

  ```sql
  mysql> SELECT JSON_LENGTH('[1, 2, {"a": 3}]');
  +---------------------------------+
  | JSON_LENGTH('[1, 2, {"a": 3}]') |
  +---------------------------------+
  |                               3 |
  +---------------------------------+
  mysql> SELECT JSON_LENGTH('{"a": 1, "b": {"c": 30}}');
  +-----------------------------------------+
  | JSON_LENGTH('{"a": 1, "b": {"c": 30}}') |
  +-----------------------------------------+
  |                                       2 |
  +-----------------------------------------+
  mysql> SELECT JSON_LENGTH('{"a": 1, "b": {"c": 30}}', '$.b');
  +------------------------------------------------+
  | JSON_LENGTH('{"a": 1, "b": {"c": 30}}', '$.b') |
  +------------------------------------------------+
  |                                              1 |
  +------------------------------------------------+
  ```

* [`JSON_TYPE(json_val)`](json-attribute-functions.html#function_json-type)

  Returns a `utf8mb4` string indicating the
  type of a JSON value. This can be an object, an array, or a
  scalar type, as shown here:

  ```sql
  mysql> SET @j = '{"a": [10, true]}';
  mysql> SELECT JSON_TYPE(@j);
  +---------------+
  | JSON_TYPE(@j) |
  +---------------+
  | OBJECT        |
  +---------------+
  mysql> SELECT JSON_TYPE(JSON_EXTRACT(@j, '$.a'));
  +------------------------------------+
  | JSON_TYPE(JSON_EXTRACT(@j, '$.a')) |
  +------------------------------------+
  | ARRAY                              |
  +------------------------------------+
  mysql> SELECT JSON_TYPE(JSON_EXTRACT(@j, '$.a[0]'));
  +---------------------------------------+
  | JSON_TYPE(JSON_EXTRACT(@j, '$.a[0]')) |
  +---------------------------------------+
  | INTEGER                               |
  +---------------------------------------+
  mysql> SELECT JSON_TYPE(JSON_EXTRACT(@j, '$.a[1]'));
  +---------------------------------------+
  | JSON_TYPE(JSON_EXTRACT(@j, '$.a[1]')) |
  +---------------------------------------+
  | BOOLEAN                               |
  +---------------------------------------+
  ```

  [`JSON_TYPE()`](json-attribute-functions.html#function_json-type) returns
  `NULL` if the argument is
  `NULL`:

  ```sql
  mysql> SELECT JSON_TYPE(NULL);
  +-----------------+
  | JSON_TYPE(NULL) |
  +-----------------+
  | NULL            |
  +-----------------+
  ```

  An error occurs if the argument is not a valid JSON value:

  ```sql
  mysql> SELECT JSON_TYPE(1);
  ERROR 3146 (22032): Invalid data type for JSON data in argument 1
  to function json_type; a JSON string or JSON type is required.
  ```

  For a non-`NULL`, non-error result, the
  following list describes the possible
  [`JSON_TYPE()`](json-attribute-functions.html#function_json-type) return values:

  + Purely JSON types:

    - `OBJECT`: JSON objects
    - `ARRAY`: JSON arrays
    - `BOOLEAN`: The JSON true and false
      literals

    - `NULL`: The JSON null literal
  + Numeric types:

    - `INTEGER`: MySQL
      [`TINYINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"),
      [`SMALLINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"),
      [`MEDIUMINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") and
      [`INT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") and
      [`BIGINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") scalars

    - `DOUBLE`: MySQL
      [`DOUBLE`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE")
      [`FLOAT`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE") scalars

    - `DECIMAL`: MySQL
      [`DECIMAL`](fixed-point-types.html "11.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC") and
      [`NUMERIC`](fixed-point-types.html "11.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC") scalars

  + Temporal types:

    - `DATETIME`: MySQL
      [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") and
      [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") scalars

    - `DATE`: MySQL
      [`DATE`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") scalars

    - `TIME`: MySQL
      [`TIME`](time.html "11.2.3 The TIME Type") scalars

  + String types:

    - `STRING`: MySQL
      `utf8` character type scalars:
      [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"),
      [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"),
      [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types"),
      [`ENUM`](enum.html "11.3.5 The ENUM Type"), and
      [`SET`](set.html "11.3.6 The SET Type")

  + Binary types:

    - `BLOB`: MySQL binary type scalars:
      [`BINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"),
      [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"),
      [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types")

    - `BIT`: MySQL
      [`BIT`](bit-type.html "11.1.5 Bit-Value Type - BIT") scalars

  + All other types:

    - `OPAQUE` (raw bits)
* [`JSON_VALID(val)`](json-attribute-functions.html#function_json-valid)

  Returns 0 or 1 to indicate whether a value is valid JSON.
  Returns `NULL` if the argument is
  `NULL`.

  ```sql
  mysql> SELECT JSON_VALID('{"a": 1}');
  +------------------------+
  | JSON_VALID('{"a": 1}') |
  +------------------------+
  |                      1 |
  +------------------------+
  mysql> SELECT JSON_VALID('hello'), JSON_VALID('"hello"');
  +---------------------+-----------------------+
  | JSON_VALID('hello') | JSON_VALID('"hello"') |
  +---------------------+-----------------------+
  |                   0 |                     1 |
  +---------------------+-----------------------+
  ```