--- title: MySQL 8.4 Reference Manual :: 14.17.2 Functions That Create JSON Values url: https://dev.mysql.com/doc/refman/8.4/en/json-creation-functions.html order: 58 ---



### 14.17.2 Functions That Create JSON Values

The functions listed in this section compose JSON values from component elements.

* [`JSON_ARRAY([val[, val] ...])`](json-creation-functions.html#function_json-array)

  Evaluates a (possibly empty) list of values and returns a JSON array containing those values.

  ```
  mysql> SELECT JSON_ARRAY(1, "abc", NULL, TRUE, CURTIME());
  +---------------------------------------------+
  | JSON_ARRAY(1, "abc", NULL, TRUE, CURTIME()) |
  +---------------------------------------------+
  | [1, "abc", null, true, "11:30:24.000000"]   |
  +---------------------------------------------+
  ```
* [`JSON_OBJECT([key, val[, key, val] ...])`](json-creation-functions.html#function_json-object)

  Evaluates a (possibly empty) list of key-value pairs and returns a JSON object containing those pairs. An error occurs if any key name is `NULL` or the number of arguments is odd.

  ```
  mysql> SELECT JSON_OBJECT('id', 87, 'name', 'carrot');
  +-----------------------------------------+
  | JSON_OBJECT('id', 87, 'name', 'carrot') |
  +-----------------------------------------+
  | {"id": 87, "name": "carrot"}            |
  +-----------------------------------------+
  ```
*  `JSON_QUOTE(string)`

  Quotes a string as a JSON value by wrapping it with double quote characters and escaping interior quote and other characters, then returning the result as a `utf8mb4` string. Returns `NULL` if the argument is `NULL`.

  This function is typically used to produce a valid JSON string literal for inclusion within a JSON document.

  Certain special characters are escaped with backslashes per the escape sequences shown in Table 14.23, “JSON\_UNQUOTE() Special Character Escape Sequences” Special Character Escape Sequences").

  ```
  mysql> SELECT JSON_QUOTE('null'), JSON_QUOTE('"null"');
  +--------------------+----------------------+
  | JSON_QUOTE('null') | JSON_QUOTE('"null"') |
  +--------------------+----------------------+
  | "null"             | "\"null\""           |
  +--------------------+----------------------+
  mysql> SELECT JSON_QUOTE('[1, 2, 3]');
  +-------------------------+
  | JSON_QUOTE('[1, 2, 3]') |
  +-------------------------+
  | "[1, 2, 3]"             |
  +-------------------------+
  ```

You can also obtain JSON values by casting values of other types to the `JSON` type using [`CAST(value AS JSON)`](cast-functions.html#function_cast); see Converting between JSON and non-JSON values, for more information.

Two aggregate functions generating JSON values are available. `JSON_ARRAYAGG()` returns a result set as a single JSON array, and `JSON_OBJECTAGG()` returns a result set as a single JSON object. For more information, see Section 14.19, “Aggregate Functions”.


