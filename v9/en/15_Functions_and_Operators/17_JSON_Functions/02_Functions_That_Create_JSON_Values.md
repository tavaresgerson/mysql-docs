### 14.17.2 Functions That Create JSON Values

The functions listed in this section compose JSON values from
component elements.

* [`JSON_ARRAY([val[,
  val] ...])`](json-creation-functions.html#function_json-array)

  Evaluates a (possibly empty) list of values and returns a JSON
  array containing those values.

  ```
  mysql> SELECT JSON_ARRAY(1, "abc", NULL, TRUE, CURTIME());
  +---------------------------------------------+
  | JSON_ARRAY(1, "abc", NULL, TRUE, CURTIME()) |
  +---------------------------------------------+
  | [1, "abc", null, true, "11:30:24.000000"]   |
  +---------------------------------------------+
  ```

* [`JSON_DUALITY_OBJECT([table_annotations]
  json_duality_key_value_pairs)`](json-creation-functions.html#function_json-duality-object)

  This function returns a JSON duality object for use in
  [`CREATE JSON DUALITY VIEW`](create-json-duality-view.html "15.1.17 CREATE JSON DUALITY VIEW Statement") or
  [`ALTER JSON DUALITY VIEW`](alter-json-duality-view.html "15.1.6 ALTER JSON DUALITY VIEW Statement").
  Attempting to invoke it in any other context results in an
  error.

  See [Section 27.7, “JSON Duality Views”](json-duality-views.html "27.7 JSON Duality Views"), for more examples,
  as well as the descriptions of the [`CREATE
  JSON DUALITY VIEW`](create-json-duality-view.html "15.1.17 CREATE JSON DUALITY VIEW Statement") and [`ALTER
  JSON DUALITY VIEW`](alter-json-duality-view.html "15.1.6 ALTER JSON DUALITY VIEW Statement") statements.

* [`JSON_OBJECT([key,
  val[,
  key,
  val] ...])`](json-creation-functions.html#function_json-object)

  Evaluates a (possibly empty) list of key-value pairs and
  returns a JSON object containing those pairs. An error occurs
  if any key name is `NULL` or the number of
  arguments is odd.

  ```
  mysql> SELECT JSON_OBJECT('id', 87, 'name', 'carrot');
  +-----------------------------------------+
  | JSON_OBJECT('id', 87, 'name', 'carrot') |
  +-----------------------------------------+
  | {"id": 87, "name": "carrot"}            |
  +-----------------------------------------+
  ```

* [`JSON_QUOTE(string)`](json-creation-functions.html#function_json-quote)

  Quotes a string as a JSON value by wrapping it with double
  quote characters and escaping interior quote and other
  characters, then returning the result as a
  `utf8mb4` string. Returns
  `NULL` if the argument is
  `NULL`.

  This function is typically used to produce a valid JSON string
  literal for inclusion within a JSON document.

  Certain special characters are escaped with backslashes per
  the escape sequences shown in
  [Table 14.23, “JSON\_UNQUOTE() Special Character Escape Sequences”](json-modification-functions.html#json-unquote-character-escape-sequences "Table 14.23 JSON_UNQUOTE() Special Character Escape Sequences").

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

You can also obtain JSON values by casting values of other types
to the `JSON` type using
[`CAST(value AS
JSON)`](cast-functions.html#function_cast); see
[Converting between JSON and non-JSON values](json.html#json-converting-between-types "Converting between JSON and non-JSON values"), for more
information.

Two aggregate functions generating JSON values are available.
[`JSON_ARRAYAGG()`](aggregate-functions.html#function_json-arrayagg) returns a result
set as a single JSON array, and
[`JSON_OBJECTAGG()`](aggregate-functions.html#function_json-objectagg) returns a result
set as a single JSON object. For more information, see
[Section 14.19, “Aggregate Functions”](aggregate-functions-and-modifiers.html "14.19 Aggregate Functions").