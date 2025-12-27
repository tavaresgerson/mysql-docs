### 14.17.5 Functions That Return JSON Value Attributes

The functions in this section return attributes of JSON values.

* `JSON_DEPTH(json_doc)`

  Returns the maximum depth of a JSON document. Returns `NULL` if the argument is `NULL`. An error occurs if the argument is not a valid JSON document.

  An empty array, empty object, or scalar value has depth 1. A nonempty array containing only elements of depth 1 or nonempty object containing only member values of depth 1 has depth 2. Otherwise, a JSON document has depth greater than 2.

  ```
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

* `JSON_LENGTH(json_doc[, path])`

  Returns the length of a JSON document, or, if a *`path`* argument is given, the length of the value within the document identified by the path. Returns `NULL` if any argument is `NULL` or the *`path`* argument does not identify a value in the document. An error occurs if the *`json_doc`* argument is not a valid JSON document or the *`path`* argument is not a valid path expression.

  The length of a document is determined as follows:

  + The length of a scalar is 1.
  + The length of an array is the number of array elements.
  + The length of an object is the number of object members.
  + The length does not count the length of nested arrays or objects.

  ```
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

* `JSON_TYPE(json_val)`

  Returns a `utf8mb4` string indicating the type of a JSON value. This can be an object, an array, or a scalar type, as shown here:

  ```
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

  `JSON_TYPE()` returns `NULL` if the argument is `NULL`:

  ```
  mysql> SELECT JSON_TYPE(NULL);
  +-----------------+
  | JSON_TYPE(NULL) |
  +-----------------+
  | NULL            |
  +-----------------+
  ```

  An error occurs if the argument is not a valid JSON value:

  ```
  mysql> SELECT JSON_TYPE(1);
  ERROR 3146 (22032): Invalid data type for JSON data in argument 1
  to function json_type; a JSON string or JSON type is required.
  ```

  For a non-`NULL`, non-error result, the following list describes the possible `JSON_TYPE()` return values:

  + Purely JSON types:

    - `OBJECT`: JSON objects
    - `ARRAY`: JSON arrays
    - `BOOLEAN`: The JSON true and false literals

    - `NULL`: The JSON null literal
  + Numeric types:

    - `INTEGER`: MySQL `TINYINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `SMALLINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `MEDIUMINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") and `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") and `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") scalars

    - `DOUBLE`: MySQL `DOUBLE` - FLOAT, DOUBLE") `FLOAT` - FLOAT, DOUBLE") scalars

    - `DECIMAL`: MySQL `DECIMAL` - DECIMAL, NUMERIC") and `NUMERIC` - DECIMAL, NUMERIC") scalars

  + Temporal types:

    - `DATETIME`: MySQL `DATETIME` and `TIMESTAMP` scalars

    - `DATE`: MySQL `DATE` scalars

    - `TIME`: MySQL `TIME` scalars

  + String types:

    - `STRING`: MySQL `utf8mb3` character type scalars: `CHAR`, `VARCHAR`, `TEXT`, `ENUM`, and `SET`

  + Binary types:

    - `BLOB`: MySQL binary type scalars including `BINARY`, `VARBINARY`, `BLOB`, and `BIT`

  + All other types:

    - `OPAQUE` (raw bits)
* `JSON_VALID(val)`

  Returns 0 or 1 to indicate whether a value is valid JSON. Returns `NULL` if the argument is `NULL`.

  ```
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
