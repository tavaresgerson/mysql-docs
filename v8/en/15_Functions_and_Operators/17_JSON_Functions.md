## 14.17 JSON Functions

The functions described in this section perform operations on JSON values. For discussion of the `JSON` data type and additional examples showing how to use these functions, see Section 13.5, “The JSON Data Type”.

For functions that take a JSON argument, an error occurs if the argument is not a valid JSON value. Arguments parsed as JSON are indicated by *`json_doc`*; arguments indicated by *`val`* are not parsed.

Functions that return JSON values always perform normalization of these values (see Normalization, Merging, and Autowrapping of JSON Values), and thus orders them. *The precise outcome of the sort is subject to change at any time; do not rely on it to be consistent between releases*.

A set of spatial functions for operating on GeoJSON values is also available. See Section 14.16.11, “Spatial GeoJSON Functions”.


### 14.17.1 JSON Function Reference

**Table 14.22 JSON Functions**

<table frame="box" rules="all" summary="A reference that lists all JSON functions."><col style="width: 22%"/><col style="width: 55%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th>Name</th> <th>Description</th> <th>Introduced</th> <th>Deprecated</th> </tr></thead><tbody><tr><th scope="row"><code>-&gt;</code></th> <td> Return value from JSON column after evaluating path; equivalent to JSON_EXTRACT(). </td> <td></td> <td></td> </tr><tr><th scope="row"><code>-&gt;&gt;</code></th> <td> Return value from JSON column after evaluating path and unquoting the result; equivalent to JSON_UNQUOTE(JSON_EXTRACT()). </td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_ARRAY()</code></th> <td> Create JSON array </td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_ARRAY_APPEND()</code></th> <td> Append data to JSON document </td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_ARRAY_INSERT()</code></th> <td> Insert into JSON array </td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_CONTAINS()</code></th> <td> Whether JSON document contains specific object at path </td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_CONTAINS_PATH()</code></th> <td> Whether JSON document contains any data at path </td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_DEPTH()</code></th> <td> Maximum depth of JSON document </td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_EXTRACT()</code></th> <td> Return data from JSON document </td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_INSERT()</code></th> <td> Insert data into JSON document </td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_KEYS()</code></th> <td> Array of keys from JSON document </td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_LENGTH()</code></th> <td> Number of elements in JSON document </td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_MERGE()</code></th> <td> Merge JSON documents, preserving duplicate keys. Deprecated synonym for JSON_MERGE_PRESERVE() </td> <td></td> <td>Yes</td> </tr><tr><th scope="row"><code>JSON_MERGE_PATCH()</code></th> <td> Merge JSON documents, replacing values of duplicate keys </td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_MERGE_PRESERVE()</code></th> <td> Merge JSON documents, preserving duplicate keys </td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_OBJECT()</code></th> <td> Create JSON object </td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_OVERLAPS()</code></th> <td> Compares two JSON documents, returns TRUE (1) if these have any key-value pairs or array elements in common, otherwise FALSE (0) </td> <td>8.0.17</td> <td></td> </tr><tr><th scope="row"><code>JSON_PRETTY()</code></th> <td> Print a JSON document in human-readable format </td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_QUOTE()</code></th> <td> Quote JSON document </td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_REMOVE()</code></th> <td> Remove data from JSON document </td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_REPLACE()</code></th> <td> Replace values in JSON document </td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_SCHEMA_VALID()</code></th> <td> Validate JSON document against JSON schema; returns TRUE/1 if document validates against schema, or FALSE/0 if it does not </td> <td>8.0.17</td> <td></td> </tr><tr><th scope="row"><code>JSON_SCHEMA_VALIDATION_REPORT()</code></th> <td> Validate JSON document against JSON schema; returns report in JSON format on outcome on validation including success or failure and reasons for failure </td> <td>8.0.17</td> <td></td> </tr><tr><th scope="row"><code>JSON_SEARCH()</code></th> <td> Path to value within JSON document </td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_SET()</code></th> <td> Insert data into JSON document </td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_STORAGE_FREE()</code></th> <td> Freed space within binary representation of JSON column value following partial update </td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_STORAGE_SIZE()</code></th> <td> Space used for storage of binary representation of a JSON document </td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_TABLE()</code></th> <td> Return data from a JSON expression as a relational table </td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_TYPE()</code></th> <td> Type of JSON value </td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_UNQUOTE()</code></th> <td> Unquote JSON value </td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_VALID()</code></th> <td> Whether JSON value is valid </td> <td></td> <td></td> </tr><tr><th scope="row"><code>JSON_VALUE()</code></th> <td> Extract value from JSON document at location pointed to by path provided; return this value as VARCHAR(512) or specified type </td> <td>8.0.21</td> <td></td> </tr><tr><th scope="row"><code>MEMBER OF()</code></th> <td> Returns true (1) if first operand matches any element of JSON array passed as second operand, otherwise returns false (0) </td> <td>8.0.17</td> <td></td> </tr></tbody></table>

MySQL supports two aggregate JSON functions `JSON_ARRAYAGG()` and `JSON_OBJECTAGG()`. See Section 14.19, “Aggregate Functions”, for descriptions of these.

MySQL also supports “pretty-printing” of JSON values in an easy-to-read format, using the `JSON_PRETTY()` function. You can see how much storage space a given JSON value takes up, and how much space remains for additional storage, using `JSON_STORAGE_SIZE()` and `JSON_STORAGE_FREE()`, respectively. For complete descriptions of these functions, see Section 14.17.8, “JSON Utility Functions”.


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

* `JSON_QUOTE(string)`

  Quotes a string as a JSON value by wrapping it with double quote characters and escaping interior quote and other characters, then returning the result as a `utf8mb4` string. Returns `NULL` if the argument is `NULL`.

  This function is typically used to produce a valid JSON string literal for inclusion within a JSON document.

  Certain special characters are escaped with backslashes per the escape sequences shown in Table 14.23, “JSON_UNQUOTE() Special Character Escape Sequences” Special Character Escape Sequences").

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


### 14.17.3 Functions That Search JSON Values

The functions in this section perform search or comparison operations on JSON values to extract data from them, report whether data exists at a location within them, or report the path to data within them. The `MEMBER OF()` operator is also documented herein.

* [`JSON_CONTAINS(target, candidate[, path])`](json-search-functions.html#function_json-contains)

  Indicates by returning 1 or 0 whether a given *`candidate`* JSON document is contained within a *`target`* JSON document, or—if a *`path`* argument was supplied—whether the candidate is found at a specific path within the target. Returns `NULL` if any argument is `NULL`, or if the path argument does not identify a section of the target document. An error occurs if *`target`* or *`candidate`* is not a valid JSON document, or if the *`path`* argument is not a valid path expression or contains a `*` or `**` wildcard.

  To check only whether any data exists at the path, use `JSON_CONTAINS_PATH()` instead.

  The following rules define containment:

  + A candidate scalar is contained in a target scalar if and only if they are comparable and are equal. Two scalar values are comparable if they have the same `JSON_TYPE()` types, with the exception that values of types `INTEGER` and `DECIMAL` are also comparable to each other.

  + A candidate array is contained in a target array if and only if every element in the candidate is contained in some element of the target.

  + A candidate nonarray is contained in a target array if and only if the candidate is contained in some element of the target.

  + A candidate object is contained in a target object if and only if for each key in the candidate there is a key with the same name in the target and the value associated with the candidate key is contained in the value associated with the target key.

  Otherwise, the candidate value is not contained in the target document.

  Starting with MySQL 8.0.17, queries using `JSON_CONTAINS()` on `InnoDB` tables can be optimized using multi-valued indexes; see Multi-Valued Indexes, for more information.

  ```
  mysql> SET @j = '{"a": 1, "b": 2, "c": {"d": 4}}';
  mysql> SET @j2 = '1';
  mysql> SELECT JSON_CONTAINS(@j, @j2, '$.a');
  +-------------------------------+
  | JSON_CONTAINS(@j, @j2, '$.a') |
  +-------------------------------+
  |                             1 |
  +-------------------------------+
  mysql> SELECT JSON_CONTAINS(@j, @j2, '$.b');
  +-------------------------------+
  | JSON_CONTAINS(@j, @j2, '$.b') |
  +-------------------------------+
  |                             0 |
  +-------------------------------+

  mysql> SET @j2 = '{"d": 4}';
  mysql> SELECT JSON_CONTAINS(@j, @j2, '$.a');
  +-------------------------------+
  | JSON_CONTAINS(@j, @j2, '$.a') |
  +-------------------------------+
  |                             0 |
  +-------------------------------+
  mysql> SELECT JSON_CONTAINS(@j, @j2, '$.c');
  +-------------------------------+
  | JSON_CONTAINS(@j, @j2, '$.c') |
  +-------------------------------+
  |                             1 |
  +-------------------------------+
  ```

* [`JSON_CONTAINS_PATH(json_doc, one_or_all, path[, path] ...)`](json-search-functions.html#function_json-contains-path)

  Returns 0 or 1 to indicate whether a JSON document contains data at a given path or paths. Returns `NULL` if any argument is `NULL`. An error occurs if the *`json_doc`* argument is not a valid JSON document, any *`path`* argument is not a valid path expression, or *`one_or_all`* is not `'one'` or `'all'`.

  To check for a specific value at a path, use `JSON_CONTAINS()` instead.

  The return value is 0 if no specified path exists within the document. Otherwise, the return value depends on the *`one_or_all`* argument:

  + `'one'`: 1 if at least one path exists within the document, 0 otherwise.

  + `'all'`: 1 if all paths exist within the document, 0 otherwise.

  ```
  mysql> SET @j = '{"a": 1, "b": 2, "c": {"d": 4}}';
  mysql> SELECT JSON_CONTAINS_PATH(@j, 'one', '$.a', '$.e');
  +---------------------------------------------+
  | JSON_CONTAINS_PATH(@j, 'one', '$.a', '$.e') |
  +---------------------------------------------+
  |                                           1 |
  +---------------------------------------------+
  mysql> SELECT JSON_CONTAINS_PATH(@j, 'all', '$.a', '$.e');
  +---------------------------------------------+
  | JSON_CONTAINS_PATH(@j, 'all', '$.a', '$.e') |
  +---------------------------------------------+
  |                                           0 |
  +---------------------------------------------+
  mysql> SELECT JSON_CONTAINS_PATH(@j, 'one', '$.c.d');
  +----------------------------------------+
  | JSON_CONTAINS_PATH(@j, 'one', '$.c.d') |
  +----------------------------------------+
  |                                      1 |
  +----------------------------------------+
  mysql> SELECT JSON_CONTAINS_PATH(@j, 'one', '$.a.d');
  +----------------------------------------+
  | JSON_CONTAINS_PATH(@j, 'one', '$.a.d') |
  +----------------------------------------+
  |                                      0 |
  +----------------------------------------+
  ```

* [`JSON_EXTRACT(json_doc, path[, path] ...)`](json-search-functions.html#function_json-extract)

  Returns data from a JSON document, selected from the parts of the document matched by the *`path`* arguments. Returns `NULL` if any argument is `NULL` or no paths locate a value in the document. An error occurs if the *`json_doc`* argument is not a valid JSON document or any *`path`* argument is not a valid path expression.

  The return value consists of all values matched by the *`path`* arguments. If it is possible that those arguments could return multiple values, the matched values are autowrapped as an array, in the order corresponding to the paths that produced them. Otherwise, the return value is the single matched value.

  ```
  mysql> SELECT JSON_EXTRACT('[10, 20, [30, 40]]', '$[1]');
  +--------------------------------------------+
  | JSON_EXTRACT('[10, 20, [30, 40]]', '$[1]') |
  +--------------------------------------------+
  | 20                                         |
  +--------------------------------------------+
  mysql> SELECT JSON_EXTRACT('[10, 20, [30, 40]]', '$[1]', '$[0]');
  +----------------------------------------------------+
  | JSON_EXTRACT('[10, 20, [30, 40]]', '$[1]', '$[0]') |
  +----------------------------------------------------+
  | [20, 10]                                           |
  +----------------------------------------------------+
  mysql> SELECT JSON_EXTRACT('[10, 20, [30, 40]]', '$[2][*]');
  +-----------------------------------------------+
  | JSON_EXTRACT('[10, 20, [30, 40]]', '$[2][*]') |
  +-----------------------------------------------+
  | [30, 40]                                      |
  +-----------------------------------------------+
  ```

  MySQL supports the `->` operator as shorthand for this function as used with 2 arguments where the left hand side is a `JSON` column identifier (not an expression) and the right hand side is the JSON path to be matched within the column.

* `column->path`

  The `->` operator serves as an alias for the `JSON_EXTRACT()` function when used with two arguments, a column identifier on the left and a JSON path (a string literal) on the right that is evaluated against the JSON document (the column value). You can use such expressions in place of column references wherever they occur in SQL statements.

  The two `SELECT` statements shown here produce the same output:

  ```
  mysql> SELECT c, JSON_EXTRACT(c, "$.id"), g
       > FROM jemp
       > WHERE JSON_EXTRACT(c, "$.id") > 1
       > ORDER BY JSON_EXTRACT(c, "$.name");
  +-------------------------------+-----------+------+
  | c                             | c->"$.id" | g    |
  +-------------------------------+-----------+------+
  | {"id": "3", "name": "Barney"} | "3"       |    3 |
  | {"id": "4", "name": "Betty"}  | "4"       |    4 |
  | {"id": "2", "name": "Wilma"}  | "2"       |    2 |
  +-------------------------------+-----------+------+
  3 rows in set (0.00 sec)

  mysql> SELECT c, c->"$.id", g
       > FROM jemp
       > WHERE c->"$.id" > 1
       > ORDER BY c->"$.name";
  +-------------------------------+-----------+------+
  | c                             | c->"$.id" | g    |
  +-------------------------------+-----------+------+
  | {"id": "3", "name": "Barney"} | "3"       |    3 |
  | {"id": "4", "name": "Betty"}  | "4"       |    4 |
  | {"id": "2", "name": "Wilma"}  | "2"       |    2 |
  +-------------------------------+-----------+------+
  3 rows in set (0.00 sec)
  ```

  This functionality is not limited to `SELECT`, as shown here:

  ```
  mysql> ALTER TABLE jemp ADD COLUMN n INT;
  Query OK, 0 rows affected (0.68 sec)
  Records: 0  Duplicates: 0  Warnings: 0

  mysql> UPDATE jemp SET n=1 WHERE c->"$.id" = "4";
  Query OK, 1 row affected (0.04 sec)
  Rows matched: 1  Changed: 1  Warnings: 0

  mysql> SELECT c, c->"$.id", g, n
       > FROM jemp
       > WHERE JSON_EXTRACT(c, "$.id") > 1
       > ORDER BY c->"$.name";
  +-------------------------------+-----------+------+------+
  | c                             | c->"$.id" | g    | n    |
  +-------------------------------+-----------+------+------+
  | {"id": "3", "name": "Barney"} | "3"       |    3 | NULL |
  | {"id": "4", "name": "Betty"}  | "4"       |    4 |    1 |
  | {"id": "2", "name": "Wilma"}  | "2"       |    2 | NULL |
  +-------------------------------+-----------+------+------+
  3 rows in set (0.00 sec)

  mysql> DELETE FROM jemp WHERE c->"$.id" = "4";
  Query OK, 1 row affected (0.04 sec)

  mysql> SELECT c, c->"$.id", g, n
       > FROM jemp
       > WHERE JSON_EXTRACT(c, "$.id") > 1
       > ORDER BY c->"$.name";
  +-------------------------------+-----------+------+------+
  | c                             | c->"$.id" | g    | n    |
  +-------------------------------+-----------+------+------+
  | {"id": "3", "name": "Barney"} | "3"       |    3 | NULL |
  | {"id": "2", "name": "Wilma"}  | "2"       |    2 | NULL |
  +-------------------------------+-----------+------+------+
  2 rows in set (0.00 sec)
  ```

  (See Indexing a Generated Column to Provide a JSON Column Index, for the statements used to create and populate the table just shown.)

  This also works with JSON array values, as shown here:

  ```
  mysql> CREATE TABLE tj10 (a JSON, b INT);
  Query OK, 0 rows affected (0.26 sec)

  mysql> INSERT INTO tj10
       > VALUES ("[3,10,5,17,44]", 33), ("[3,10,5,17,[22,44,66]]", 0);
  Query OK, 1 row affected (0.04 sec)

  mysql> SELECT a->"$[4]" FROM tj10;
  +--------------+
  | a->"$[4]"    |
  +--------------+
  | 44           |
  | [22, 44, 66] |
  +--------------+
  2 rows in set (0.00 sec)

  mysql> SELECT * FROM tj10 WHERE a->"$[0]" = 3;
  +------------------------------+------+
  | a                            | b    |
  +------------------------------+------+
  | [3, 10, 5, 17, 44]           |   33 |
  | [3, 10, 5, 17, [22, 44, 66]] |    0 |
  +------------------------------+------+
  2 rows in set (0.00 sec)
  ```

  Nested arrays are supported. An expression using `->` evaluates as `NULL` if no matching key is found in the target JSON document, as shown here:

  ```
  mysql> SELECT * FROM tj10 WHERE a->"$[4][1]" IS NOT NULL;
  +------------------------------+------+
  | a                            | b    |
  +------------------------------+------+
  | [3, 10, 5, 17, [22, 44, 66]] |    0 |
  +------------------------------+------+

  mysql> SELECT a->"$[4][1]" FROM tj10;
  +--------------+
  | a->"$[4][1]" |
  +--------------+
  | NULL         |
  | 44           |
  +--------------+
  2 rows in set (0.00 sec)
  ```

  This is the same behavior as seen in such cases when using `JSON_EXTRACT()`:

  ```
  mysql> SELECT JSON_EXTRACT(a, "$[4][1]") FROM tj10;
  +----------------------------+
  | JSON_EXTRACT(a, "$[4][1]") |
  +----------------------------+
  | NULL                       |
  | 44                         |
  +----------------------------+
  2 rows in set (0.00 sec)
  ```

* `column->>path`

  This is an improved, unquoting extraction operator. Whereas the `->` operator simply extracts a value, the `->>` operator in addition unquotes the extracted result. In other words, given a `JSON` column value *`column`* and a path expression *`path`* (a string literal), the following three expressions return the same value:

  + `JSON_UNQUOTE(` [`JSON_EXTRACT(column, path) )`](json-search-functions.html#function_json-extract)

  + `JSON_UNQUOTE(column` `->` `path)`

  + `column->>path`

  The `->>` operator can be used wherever `JSON_UNQUOTE(JSON_EXTRACT())` would be allowed. This includes (but is not limited to) `SELECT` lists, `WHERE` and `HAVING` clauses, and `ORDER BY` and `GROUP BY` clauses.

  The next few statements demonstrate some `->>` operator equivalences with other expressions in the **mysql** client:

  ```
  mysql> SELECT * FROM jemp WHERE g > 2;
  +-------------------------------+------+
  | c                             | g    |
  +-------------------------------+------+
  | {"id": "3", "name": "Barney"} |    3 |
  | {"id": "4", "name": "Betty"}  |    4 |
  +-------------------------------+------+
  2 rows in set (0.01 sec)

  mysql> SELECT c->'$.name' AS name
      ->     FROM jemp WHERE g > 2;
  +----------+
  | name     |
  +----------+
  | "Barney" |
  | "Betty"  |
  +----------+
  2 rows in set (0.00 sec)

  mysql> SELECT JSON_UNQUOTE(c->'$.name') AS name
      ->     FROM jemp WHERE g > 2;
  +--------+
  | name   |
  +--------+
  | Barney |
  | Betty  |
  +--------+
  2 rows in set (0.00 sec)

  mysql> SELECT c->>'$.name' AS name
      ->     FROM jemp WHERE g > 2;
  +--------+
  | name   |
  +--------+
  | Barney |
  | Betty  |
  +--------+
  2 rows in set (0.00 sec)
  ```

  See Indexing a Generated Column to Provide a JSON Column Index, for the SQL statements used to create and populate the `jemp` table in the set of examples just shown.

  This operator can also be used with JSON arrays, as shown here:

  ```
  mysql> CREATE TABLE tj10 (a JSON, b INT);
  Query OK, 0 rows affected (0.26 sec)

  mysql> INSERT INTO tj10 VALUES
      ->     ('[3,10,5,"x",44]', 33),
      ->     ('[3,10,5,17,[22,"y",66]]', 0);
  Query OK, 2 rows affected (0.04 sec)
  Records: 2  Duplicates: 0  Warnings: 0

  mysql> SELECT a->"$[3]", a->"$[4][1]" FROM tj10;
  +-----------+--------------+
  | a->"$[3]" | a->"$[4][1]" |
  +-----------+--------------+
  | "x"       | NULL         |
  | 17        | "y"          |
  +-----------+--------------+
  2 rows in set (0.00 sec)

  mysql> SELECT a->>"$[3]", a->>"$[4][1]" FROM tj10;
  +------------+---------------+
  | a->>"$[3]" | a->>"$[4][1]" |
  +------------+---------------+
  | x          | NULL          |
  | 17         | y             |
  +------------+---------------+
  2 rows in set (0.00 sec)
  ```

  As with `->`, the `->>` operator is always expanded in the output of `EXPLAIN`, as the following example demonstrates:

  ```
  mysql> EXPLAIN SELECT c->>'$.name' AS name
      ->     FROM jemp WHERE g > 2\G
  *************************** 1. row ***************************
             id: 1
    select_type: SIMPLE
          table: jemp
     partitions: NULL
           type: range
  possible_keys: i
            key: i
        key_len: 5
            ref: NULL
           rows: 2
       filtered: 100.00
          Extra: Using where
  1 row in set, 1 warning (0.00 sec)

  mysql> SHOW WARNINGS\G
  *************************** 1. row ***************************
    Level: Note
     Code: 1003
  Message: /* select#1 */ select
  json_unquote(json_extract(`jtest`.`jemp`.`c`,'$.name')) AS `name` from
  `jtest`.`jemp` where (`jtest`.`jemp`.`g` > 2)
  1 row in set (0.00 sec)
  ```

  This is similar to how MySQL expands the `->` operator in the same circumstances.

* [`JSON_KEYS(json_doc[, path])`](json-search-functions.html#function_json-keys)

  Returns the keys from the top-level value of a JSON object as a JSON array, or, if a *`path`* argument is given, the top-level keys from the selected path. Returns `NULL` if any argument is `NULL`, the *`json_doc`* argument is not an object, or *`path`*, if given, does not locate an object. An error occurs if the *`json_doc`* argument is not a valid JSON document or the *`path`* argument is not a valid path expression or contains a `*` or `**` wildcard.

  The result array is empty if the selected object is empty. If the top-level value has nested subobjects, the return value does not include keys from those subobjects.

  ```
  mysql> SELECT JSON_KEYS('{"a": 1, "b": {"c": 30}}');
  +---------------------------------------+
  | JSON_KEYS('{"a": 1, "b": {"c": 30}}') |
  +---------------------------------------+
  | ["a", "b"]                            |
  +---------------------------------------+
  mysql> SELECT JSON_KEYS('{"a": 1, "b": {"c": 30}}', '$.b');
  +----------------------------------------------+
  | JSON_KEYS('{"a": 1, "b": {"c": 30}}', '$.b') |
  +----------------------------------------------+
  | ["c"]                                        |
  +----------------------------------------------+
  ```

* [`JSON_OVERLAPS(json_doc1, json_doc2)`](json-search-functions.html#function_json-overlaps)

  Compares two JSON documents. Returns true (1) if the two document have any key-value pairs or array elements in common. If both arguments are scalars, the function performs a simple equality test. If either argument is `NULL`, the function returns `NULL`.

  This function serves as counterpart to `JSON_CONTAINS()`, which requires all elements of the array searched for to be present in the array searched in. Thus, `JSON_CONTAINS()` performs an `AND` operation on search keys, while `JSON_OVERLAPS()` performs an `OR` operation.

  Queries on JSON columns of `InnoDB` tables using `JSON_OVERLAPS()` in the `WHERE` clause can be optimized using multi-valued indexes. Multi-Valued Indexes, provides detailed information and examples.

  When comparing two arrays, `JSON_OVERLAPS()` returns true if they share one or more array elements in common, and false if they do not:

  ```
  mysql> SELECT JSON_OVERLAPS("[1,3,5,7]", "[2,5,7]");
  +---------------------------------------+
  | JSON_OVERLAPS("[1,3,5,7]", "[2,5,7]") |
  +---------------------------------------+
  |                                     1 |
  +---------------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT JSON_OVERLAPS("[1,3,5,7]", "[2,6,7]");
  +---------------------------------------+
  | JSON_OVERLAPS("[1,3,5,7]", "[2,6,7]") |
  +---------------------------------------+
  |                                     1 |
  +---------------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT JSON_OVERLAPS("[1,3,5,7]", "[2,6,8]");
  +---------------------------------------+
  | JSON_OVERLAPS("[1,3,5,7]", "[2,6,8]") |
  +---------------------------------------+
  |                                     0 |
  +---------------------------------------+
  1 row in set (0.00 sec)
  ```

  Partial matches are treated as no match, as shown here:

  ```
  mysql> SELECT JSON_OVERLAPS('[[1,2],[3,4],5]', '[1,[2,3],[4,5]]');
  +-----------------------------------------------------+
  | JSON_OVERLAPS('[[1,2],[3,4],5]', '[1,[2,3],[4,5]]') |
  +-----------------------------------------------------+
  |                                                   0 |
  +-----------------------------------------------------+
  1 row in set (0.00 sec)
  ```

  When comparing objects, the result is true if they have at least one key-value pair in common.

  ```
  mysql> SELECT JSON_OVERLAPS('{"a":1,"b":10,"d":10}', '{"c":1,"e":10,"f":1,"d":10}');
  +-----------------------------------------------------------------------+
  | JSON_OVERLAPS('{"a":1,"b":10,"d":10}', '{"c":1,"e":10,"f":1,"d":10}') |
  +-----------------------------------------------------------------------+
  |                                                                     1 |
  +-----------------------------------------------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT JSON_OVERLAPS('{"a":1,"b":10,"d":10}', '{"a":5,"e":10,"f":1,"d":20}');
  +-----------------------------------------------------------------------+
  | JSON_OVERLAPS('{"a":1,"b":10,"d":10}', '{"a":5,"e":10,"f":1,"d":20}') |
  +-----------------------------------------------------------------------+
  |                                                                     0 |
  +-----------------------------------------------------------------------+
  1 row in set (0.00 sec)
  ```

  If two scalars are used as the arguments to the function, `JSON_OVERLAPS()` performs a simple test for equality:

  ```
  mysql> SELECT JSON_OVERLAPS('5', '5');
  +-------------------------+
  | JSON_OVERLAPS('5', '5') |
  +-------------------------+
  |                       1 |
  +-------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT JSON_OVERLAPS('5', '6');
  +-------------------------+
  | JSON_OVERLAPS('5', '6') |
  +-------------------------+
  |                       0 |
  +-------------------------+
  1 row in set (0.00 sec)
  ```

  When comparing a scalar with an array, `JSON_OVERLAPS()` attempts to treat the scalar as an array element. In this example, the second argument `6` is interpreted as `[6]`, as shown here:

  ```
  mysql> SELECT JSON_OVERLAPS('[4,5,6,7]', '6');
  +---------------------------------+
  | JSON_OVERLAPS('[4,5,6,7]', '6') |
  +---------------------------------+
  |                               1 |
  +---------------------------------+
  1 row in set (0.00 sec)
  ```

  The function does not perform type conversions:

  ```
  mysql> SELECT JSON_OVERLAPS('[4,5,"6",7]', '6');
  +-----------------------------------+
  | JSON_OVERLAPS('[4,5,"6",7]', '6') |
  +-----------------------------------+
  |                                 0 |
  +-----------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT JSON_OVERLAPS('[4,5,6,7]', '"6"');
  +-----------------------------------+
  | JSON_OVERLAPS('[4,5,6,7]', '"6"') |
  +-----------------------------------+
  |                                 0 |
  +-----------------------------------+
  1 row in set (0.00 sec)
  ```

  `JSON_OVERLAPS()` was added in MySQL 8.0.17.

* [`JSON_SEARCH(json_doc, one_or_all, search_str[, escape_char[, path] ...])`](json-search-functions.html#function_json-search)

  Returns the path to the given string within a JSON document. Returns `NULL` if any of the *`json_doc`*, *`search_str`*, or *`path`* arguments are `NULL`; no *`path`* exists within the document; or *`search_str`* is not found. An error occurs if the *`json_doc`* argument is not a valid JSON document, any *`path`* argument is not a valid path expression, *`one_or_all`* is not `'one'` or `'all'`, or *`escape_char`* is not a constant expression.

  The *`one_or_all`* argument affects the search as follows:

  + `'one'`: The search terminates after the first match and returns one path string. It is undefined which match is considered first.

  + `'all'`: The search returns all matching path strings such that no duplicate paths are included. If there are multiple strings, they are autowrapped as an array. The order of the array elements is undefined.

  Within the *`search_str`* search string argument, the `%` and `_` characters work as for the `LIKE` operator: `%` matches any number of characters (including zero characters), and `_` matches exactly one character.

  To specify a literal `%` or `_` character in the search string, precede it by the escape character. The default is `\` if the *`escape_char`* argument is missing or `NULL`. Otherwise, *`escape_char`* must be a constant that is empty or one character.

  For more information about matching and escape character behavior, see the description of `LIKE` in Section 14.8.1, “String Comparison Functions and Operators”. For escape character handling, a difference from the `LIKE` behavior is that the escape character for `JSON_SEARCH()` must evaluate to a constant at compile time, not just at execution time. For example, if `JSON_SEARCH()` is used in a prepared statement and the *`escape_char`* argument is supplied using a `?` parameter, the parameter value might be constant at execution time, but is not at compile time.

  *`search_str`* and *`path`* are always interpreted as utf8mb4 strings, regardless of their actual encoding. This is a known issue which is fixed in MySQL 8.0.24 ( Bug #32449181).

  ```
  mysql> SET @j = '["abc", [{"k": "10"}, "def"], {"x":"abc"}, {"y":"bcd"}]';

  mysql> SELECT JSON_SEARCH(@j, 'one', 'abc');
  +-------------------------------+
  | JSON_SEARCH(@j, 'one', 'abc') |
  +-------------------------------+
  | "$[0]"                        |
  +-------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', 'abc');
  +-------------------------------+
  | JSON_SEARCH(@j, 'all', 'abc') |
  +-------------------------------+
  | ["$[0]", "$[2].x"]            |
  +-------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', 'ghi');
  +-------------------------------+
  | JSON_SEARCH(@j, 'all', 'ghi') |
  +-------------------------------+
  | NULL                          |
  +-------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', '10');
  +------------------------------+
  | JSON_SEARCH(@j, 'all', '10') |
  +------------------------------+
  | "$[1][0].k"                  |
  +------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', '10', NULL, '$');
  +-----------------------------------------+
  | JSON_SEARCH(@j, 'all', '10', NULL, '$') |
  +-----------------------------------------+
  | "$[1][0].k"                             |
  +-----------------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', '10', NULL, '$[*]');
  +--------------------------------------------+
  | JSON_SEARCH(@j, 'all', '10', NULL, '$[*]') |
  +--------------------------------------------+
  | "$[1][0].k"                                |
  +--------------------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', '10', NULL, '$**.k');
  +---------------------------------------------+
  | JSON_SEARCH(@j, 'all', '10', NULL, '$**.k') |
  +---------------------------------------------+
  | "$[1][0].k"                                 |
  +---------------------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', '10', NULL, '$[*][0].k');
  +-------------------------------------------------+
  | JSON_SEARCH(@j, 'all', '10', NULL, '$[*][0].k') |
  +-------------------------------------------------+
  | "$[1][0].k"                                     |
  +-------------------------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', '10', NULL, '$[1]');
  +--------------------------------------------+
  | JSON_SEARCH(@j, 'all', '10', NULL, '$[1]') |
  +--------------------------------------------+
  | "$[1][0].k"                                |
  +--------------------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', '10', NULL, '$[1][0]');
  +-----------------------------------------------+
  | JSON_SEARCH(@j, 'all', '10', NULL, '$[1][0]') |
  +-----------------------------------------------+
  | "$[1][0].k"                                   |
  +-----------------------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', 'abc', NULL, '$[2]');
  +---------------------------------------------+
  | JSON_SEARCH(@j, 'all', 'abc', NULL, '$[2]') |
  +---------------------------------------------+
  | "$[2].x"                                    |
  +---------------------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', '%a%');
  +-------------------------------+
  | JSON_SEARCH(@j, 'all', '%a%') |
  +-------------------------------+
  | ["$[0]", "$[2].x"]            |
  +-------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', '%b%');
  +-------------------------------+
  | JSON_SEARCH(@j, 'all', '%b%') |
  +-------------------------------+
  | ["$[0]", "$[2].x", "$[3].y"]  |
  +-------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', '%b%', NULL, '$[0]');
  +---------------------------------------------+
  | JSON_SEARCH(@j, 'all', '%b%', NULL, '$[0]') |
  +---------------------------------------------+
  | "$[0]"                                      |
  +---------------------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', '%b%', NULL, '$[2]');
  +---------------------------------------------+
  | JSON_SEARCH(@j, 'all', '%b%', NULL, '$[2]') |
  +---------------------------------------------+
  | "$[2].x"                                    |
  +---------------------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', '%b%', NULL, '$[1]');
  +---------------------------------------------+
  | JSON_SEARCH(@j, 'all', '%b%', NULL, '$[1]') |
  +---------------------------------------------+
  | NULL                                        |
  +---------------------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', '%b%', '', '$[1]');
  +-------------------------------------------+
  | JSON_SEARCH(@j, 'all', '%b%', '', '$[1]') |
  +-------------------------------------------+
  | NULL                                      |
  +-------------------------------------------+

  mysql> SELECT JSON_SEARCH(@j, 'all', '%b%', '', '$[3]');
  +-------------------------------------------+
  | JSON_SEARCH(@j, 'all', '%b%', '', '$[3]') |
  +-------------------------------------------+
  | "$[3].y"                                  |
  +-------------------------------------------+
  ```

  For more information about the JSON path syntax supported by MySQL, including rules governing the wildcard operators `*` and `**`, see JSON Path Syntax.

* [`JSON_VALUE(json_doc, path)`](json-search-functions.html#function_json-value)

  Extracts a value from a JSON document at the path given in the specified document, and returns the extracted value, optionally converting it to a desired type. The complete syntax is shown here:

  ```
  JSON_VALUE(json_doc, path [RETURNING type] [on_empty] [on_error])

  on_empty:
      {NULL | ERROR | DEFAULT value} ON EMPTY

  on_error:
      {NULL | ERROR | DEFAULT value} ON ERROR
  ```

  *`json_doc`* is a valid JSON document. If this is `NULL`, the function returns `NULL`.

  *`path`* is a JSON path pointing to a location in the document. This must be a string literal value.

  *`type`* is one of the following data types:

  + `FLOAT` - FLOAT, DOUBLE")
  + `DOUBLE` - FLOAT, DOUBLE")
  + `DECIMAL` - DECIMAL, NUMERIC")
  + `SIGNED`
  + `UNSIGNED`
  + `DATE`
  + `TIME`
  + `DATETIME`
  + `YEAR` (MySQL 8.0.22 and later)

    `YEAR` values of one or two digits are not supported.

  + `CHAR`
  + `JSON`

  The types just listed are the same as the (non-array) types supported by the `CAST()` function.

  If not specified by a `RETURNING` clause, the `JSON_VALUE()` function's return type is `VARCHAR(512)`. When no character set is specified for the return type, `JSON_VALUE()` uses `utf8mb4` with the binary collation, which is case-sensitive; if `utf8mb4` is specified as the character set for the result, the server uses the default collation for this character set, which is not case-sensitive.

  When the data at the specified path consists of or resolves to a JSON null literal, the function returns SQL `NULL`.

  *`on_empty`*, if specified, determines how `JSON_VALUE()` behaves when no data is found at the path given; this clause takes one of the following values:

  + `NULL ON EMPTY`: The function returns `NULL`; this is the default `ON EMPTY` behavior.

  + `DEFAULT value ON EMPTY`: the provided *`value`* is returned. The value's type must match that of the return type.

  + `ERROR ON EMPTY`: The function throws an error.

  If used, *`on_error`* takes one of the following values with the corresponding outcome when an error occurs, as listed here:

  + `NULL ON ERROR`: `JSON_VALUE()` returns `NULL`; this is the default behavior if no `ON ERROR` clause is used.

  + `DEFAULT value ON ERROR`: This is the value returned; its value must match that of the return type.

  + `ERROR ON ERROR`: An error is thrown.

  `ON EMPTY`, if used, must precede any `ON ERROR` clause. Specifying them in the wrong order results in a syntax error.

  **Error handling.** In general, errors are handled by `JSON_VALUE()` as follows:

  + All JSON input (document and path) is checked for validity. If any of it is not valid, an SQL error is thrown without triggering the `ON ERROR` clause.

  + `ON ERROR` is triggered whenever any of the following events occur:

    - Attempting to extract an object or an array, such as that resulting from a path that resolves to multiple locations within the JSON document

    - Conversion errors, such as attempting to convert `'asdf'` to an `UNSIGNED` value

    - Truncation of values
  + A conversion error always triggers a warning even if `NULL ON ERROR` or `DEFAULT ... ON ERROR` is specified.

  + The `ON EMPTY` clause is triggered when the source JSON document (*`expr`*) contains no data at the specified location (*`path`*).

  `JSON_VALUE()` was introduced in MySQL 8.0.21.

  **Examples.** Two simple examples are shown here:

  ```
  mysql> SELECT JSON_VALUE('{"fname": "Joe", "lname": "Palmer"}', '$.fname');
  +--------------------------------------------------------------+
  | JSON_VALUE('{"fname": "Joe", "lname": "Palmer"}', '$.fname') |
  +--------------------------------------------------------------+
  | Joe                                                          |
  +--------------------------------------------------------------+

  mysql> SELECT JSON_VALUE('{"item": "shoes", "price": "49.95"}', '$.price'
      -> RETURNING DECIMAL(4,2)) AS price;
  +-------+
  | price |
  +-------+
  | 49.95 |
  +-------+
  ```

  Except in cases where `JSON_VALUE()` returns `NULL`, the statement `SELECT JSON_VALUE(json_doc, path RETURNING type)` is equivalent to the following statement:

  ```
  SELECT CAST(
      JSON_UNQUOTE( JSON_EXTRACT(json_doc, path) )
      AS type
  );
  ```

  `JSON_VALUE()` simplifies creating indexes on JSON columns by making it unnecessary in many cases to create a generated column and then an index on the generated column. You can do this when creating a table `t1` that has a `JSON` column by creating an index on an expression that uses `JSON_VALUE()` operating on that column (with a path that matches a value in that column), as shown here:

  ```
  CREATE TABLE t1(
      j JSON,
      INDEX i1 ( (JSON_VALUE(j, '$.id' RETURNING UNSIGNED)) )
  );
  ```

  The following `EXPLAIN` output shows that a query against `t1` employing the index expression in the `WHERE` clause uses the index thus created:

  ```
  mysql> EXPLAIN SELECT * FROM t1
      ->     WHERE JSON_VALUE(j, '$.id' RETURNING UNSIGNED) = 123\G
  *************************** 1. row ***************************
             id: 1
    select_type: SIMPLE
          table: t1
     partitions: NULL
           type: ref
  possible_keys: i1
            key: i1
        key_len: 9
            ref: const
           rows: 1
       filtered: 100.00
          Extra: NULL
  ```

  This achieves much the same effect as creating a table `t2` with an index on a generated column (see Indexing a Generated Column to Provide a JSON Column Index), like this one:

  ```
  CREATE TABLE t2 (
      j JSON,
      g INT GENERATED ALWAYS AS (j->"$.id"),
      INDEX i1 (g)
  );
  ```

  The `EXPLAIN` output for a query against this table, referencing the generated column, shows that the index is used in the same way as for the previous query against table `t1`:

  ```
  mysql> EXPLAIN SELECT * FROM t2 WHERE g  = 123\G
  *************************** 1. row ***************************
             id: 1
    select_type: SIMPLE
          table: t2
     partitions: NULL
           type: ref
  possible_keys: i1
            key: i1
        key_len: 5
            ref: const
           rows: 1
       filtered: 100.00
          Extra: NULL
  ```

  For information about using indexes on generated columns for indirect indexing of `JSON` columns, see Indexing a Generated Column to Provide a JSON Column Index.

* [`value MEMBER OF(json_array)`](json-search-functions.html#operator_member-of)

  Returns true (1) if *`value`* is an element of *`json_array`*, otherwise returns false (0). *`value`* must be a scalar or a JSON document; if it is a scalar, the operator attempts to treat it as an element of a JSON array. If *`value`* or *`json_array`* is *`NULL`*, the function returns *`NULL`*.

  Queries using `MEMBER OF()` on JSON columns of `InnoDB` tables in the `WHERE` clause can be optimized using multi-valued indexes. See Multi-Valued Indexes, for detailed information and examples.

  Simple scalars are treated as array values, as shown here:

  ```
  mysql> SELECT 17 MEMBER OF('[23, "abc", 17, "ab", 10]');
  +-------------------------------------------+
  | 17 MEMBER OF('[23, "abc", 17, "ab", 10]') |
  +-------------------------------------------+
  |                                         1 |
  +-------------------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT 'ab' MEMBER OF('[23, "abc", 17, "ab", 10]');
  +---------------------------------------------+
  | 'ab' MEMBER OF('[23, "abc", 17, "ab", 10]') |
  +---------------------------------------------+
  |                                           1 |
  +---------------------------------------------+
  1 row in set (0.00 sec)
  ```

  Partial matches of array element values do not match:

  ```
  mysql> SELECT 7 MEMBER OF('[23, "abc", 17, "ab", 10]');
  +------------------------------------------+
  | 7 MEMBER OF('[23, "abc", 17, "ab", 10]') |
  +------------------------------------------+
  |                                        0 |
  +------------------------------------------+
  1 row in set (0.00 sec)
  ```

  ```
  mysql> SELECT 'a' MEMBER OF('[23, "abc", 17, "ab", 10]');
  +--------------------------------------------+
  | 'a' MEMBER OF('[23, "abc", 17, "ab", 10]') |
  +--------------------------------------------+
  |                                          0 |
  +--------------------------------------------+
  1 row in set (0.00 sec)
  ```

  Conversions to and from string types are not performed:

  ```
  mysql> SELECT
      -> 17 MEMBER OF('[23, "abc", "17", "ab", 10]'),
      -> "17" MEMBER OF('[23, "abc", 17, "ab", 10]')\G
  *************************** 1. row ***************************
  17 MEMBER OF('[23, "abc", "17", "ab", 10]'): 0
  "17" MEMBER OF('[23, "abc", 17, "ab", 10]'): 0
  1 row in set (0.00 sec)
  ```

  To use this operator with a value which is itself an array, it is necessary to cast it explicitly as a JSON array. You can do this with `CAST(... AS JSON)`:

  ```
  mysql> SELECT CAST('[4,5]' AS JSON) MEMBER OF('[[3,4],[4,5]]');
  +--------------------------------------------------+
  | CAST('[4,5]' AS JSON) MEMBER OF('[[3,4],[4,5]]') |
  +--------------------------------------------------+
  |                                                1 |
  +--------------------------------------------------+
  1 row in set (0.00 sec)
  ```

  It is also possible to perform the necessary cast using the `JSON_ARRAY()` function, like this:

  ```
  mysql> SELECT JSON_ARRAY(4,5) MEMBER OF('[[3,4],[4,5]]');
  +--------------------------------------------+
  | JSON_ARRAY(4,5) MEMBER OF('[[3,4],[4,5]]') |
  +--------------------------------------------+
  |                                          1 |
  +--------------------------------------------+
  1 row in set (0.00 sec)
  ```

  Any JSON objects used as values to be tested or which appear in the target array must be coerced to the correct type using `CAST(... AS JSON)` or `JSON_OBJECT()`. In addition, a target array containing JSON objects must itself be cast using `JSON_ARRAY`. This is demonstrated in the following sequence of statements:

  ```
  mysql> SET @a = CAST('{"a":1}' AS JSON);
  Query OK, 0 rows affected (0.00 sec)

  mysql> SET @b = JSON_OBJECT("b", 2);
  Query OK, 0 rows affected (0.00 sec)

  mysql> SET @c = JSON_ARRAY(17, @b, "abc", @a, 23);
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT @a MEMBER OF(@c), @b MEMBER OF(@c);
  +------------------+------------------+
  | @a MEMBER OF(@c) | @b MEMBER OF(@c) |
  +------------------+------------------+
  |                1 |                1 |
  +------------------+------------------+
  1 row in set (0.00 sec)
  ```

  The `MEMBER OF()` operator was added in MySQL 8.0.17.


### 14.17.4 Functions That Modify JSON Values

The functions in this section modify JSON values and return the result.

* [`JSON_ARRAY_APPEND(json_doc, path, val[, path, val] ...)`](json-modification-functions.html#function_json-array-append)

  Appends values to the end of the indicated arrays within a JSON document and returns the result. Returns `NULL` if any argument is `NULL`. An error occurs if the *`json_doc`* argument is not a valid JSON document or any *`path`* argument is not a valid path expression or contains a `*` or `**` wildcard.

  The path-value pairs are evaluated left to right. The document produced by evaluating one pair becomes the new value against which the next pair is evaluated.

  If a path selects a scalar or object value, that value is autowrapped within an array and the new value is added to that array. Pairs for which the path does not identify any value in the JSON document are ignored.

  ```
  mysql> SET @j = '["a", ["b", "c"], "d"]';
  mysql> SELECT JSON_ARRAY_APPEND(@j, '$[1]', 1);
  +----------------------------------+
  | JSON_ARRAY_APPEND(@j, '$[1]', 1) |
  +----------------------------------+
  | ["a", ["b", "c", 1], "d"]        |
  +----------------------------------+
  mysql> SELECT JSON_ARRAY_APPEND(@j, '$[0]', 2);
  +----------------------------------+
  | JSON_ARRAY_APPEND(@j, '$[0]', 2) |
  +----------------------------------+
  | [["a", 2], ["b", "c"], "d"]      |
  +----------------------------------+
  mysql> SELECT JSON_ARRAY_APPEND(@j, '$[1][0]', 3);
  +-------------------------------------+
  | JSON_ARRAY_APPEND(@j, '$[1][0]', 3) |
  +-------------------------------------+
  | ["a", [["b", 3], "c"], "d"]         |
  +-------------------------------------+

  mysql> SET @j = '{"a": 1, "b": [2, 3], "c": 4}';
  mysql> SELECT JSON_ARRAY_APPEND(@j, '$.b', 'x');
  +------------------------------------+
  | JSON_ARRAY_APPEND(@j, '$.b', 'x')  |
  +------------------------------------+
  | {"a": 1, "b": [2, 3, "x"], "c": 4} |
  +------------------------------------+
  mysql> SELECT JSON_ARRAY_APPEND(@j, '$.c', 'y');
  +--------------------------------------+
  | JSON_ARRAY_APPEND(@j, '$.c', 'y')    |
  +--------------------------------------+
  | {"a": 1, "b": [2, 3], "c": [4, "y"]} |
  +--------------------------------------+

  mysql> SET @j = '{"a": 1}';
  mysql> SELECT JSON_ARRAY_APPEND(@j, '$', 'z');
  +---------------------------------+
  | JSON_ARRAY_APPEND(@j, '$', 'z') |
  +---------------------------------+
  | [{"a": 1}, "z"]                 |
  +---------------------------------+
  ```

  In MySQL 5.7, this function was named `JSON_APPEND()`. That name is no longer supported in MySQL 8.0.

* [`JSON_ARRAY_INSERT(json_doc, path, val[, path, val] ...)`](json-modification-functions.html#function_json-array-insert)

  Updates a JSON document, inserting into an array within the document and returning the modified document. Returns `NULL` if any argument is `NULL`. An error occurs if the *`json_doc`* argument is not a valid JSON document or any *`path`* argument is not a valid path expression or contains a `*` or `**` wildcard or does not end with an array element identifier.

  The path-value pairs are evaluated left to right. The document produced by evaluating one pair becomes the new value against which the next pair is evaluated.

  Pairs for which the path does not identify any array in the JSON document are ignored. If a path identifies an array element, the corresponding value is inserted at that element position, shifting any following values to the right. If a path identifies an array position past the end of an array, the value is inserted at the end of the array.

  ```
  mysql> SET @j = '["a", {"b": [1, 2]}, [3, 4]]';
  mysql> SELECT JSON_ARRAY_INSERT(@j, '$[1]', 'x');
  +------------------------------------+
  | JSON_ARRAY_INSERT(@j, '$[1]', 'x') |
  +------------------------------------+
  | ["a", "x", {"b": [1, 2]}, [3, 4]]  |
  +------------------------------------+
  mysql> SELECT JSON_ARRAY_INSERT(@j, '$[100]', 'x');
  +--------------------------------------+
  | JSON_ARRAY_INSERT(@j, '$[100]', 'x') |
  +--------------------------------------+
  | ["a", {"b": [1, 2]}, [3, 4], "x"]    |
  +--------------------------------------+
  mysql> SELECT JSON_ARRAY_INSERT(@j, '$[1].b[0]', 'x');
  +-----------------------------------------+
  | JSON_ARRAY_INSERT(@j, '$[1].b[0]', 'x') |
  +-----------------------------------------+
  | ["a", {"b": ["x", 1, 2]}, [3, 4]]       |
  +-----------------------------------------+
  mysql> SELECT JSON_ARRAY_INSERT(@j, '$[2][1]', 'y');
  +---------------------------------------+
  | JSON_ARRAY_INSERT(@j, '$[2][1]', 'y') |
  +---------------------------------------+
  | ["a", {"b": [1, 2]}, [3, "y", 4]]     |
  +---------------------------------------+
  mysql> SELECT JSON_ARRAY_INSERT(@j, '$[0]', 'x', '$[2][1]', 'y');
  +----------------------------------------------------+
  | JSON_ARRAY_INSERT(@j, '$[0]', 'x', '$[2][1]', 'y') |
  +----------------------------------------------------+
  | ["x", "a", {"b": [1, 2]}, [3, 4]]                  |
  +----------------------------------------------------+
  ```

  Earlier modifications affect the positions of the following elements in the array, so subsequent paths in the same `JSON_ARRAY_INSERT()` call should take this into account. In the final example, the second path inserts nothing because the path no longer matches anything after the first insert.

* [`JSON_INSERT(json_doc, path, val[, path, val] ...)`](json-modification-functions.html#function_json-insert)

  Inserts data into a JSON document and returns the result. Returns `NULL` if any argument is `NULL`. An error occurs if the *`json_doc`* argument is not a valid JSON document or any *`path`* argument is not a valid path expression or contains a `*` or `**` wildcard.

  The path-value pairs are evaluated left to right. The document produced by evaluating one pair becomes the new value against which the next pair is evaluated.

  A path-value pair for an existing path in the document is ignored and does not overwrite the existing document value. A path-value pair for a nonexisting path in the document adds the value to the document if the path identifies one of these types of values:

  + A member not present in an existing object. The member is added to the object and associated with the new value.

  + A position past the end of an existing array. The array is extended with the new value. If the existing value is not an array, it is autowrapped as an array, then extended with the new value.

  Otherwise, a path-value pair for a nonexisting path in the document is ignored and has no effect.

  For a comparison of `JSON_INSERT()`, `JSON_REPLACE()`, and `JSON_SET()`, see the discussion of `JSON_SET()`.

  ```
  mysql> SET @j = '{ "a": 1, "b": [2, 3]}';
  mysql> SELECT JSON_INSERT(@j, '$.a', 10, '$.c', '[true, false]');
  +----------------------------------------------------+
  | JSON_INSERT(@j, '$.a', 10, '$.c', '[true, false]') |
  +----------------------------------------------------+
  | {"a": 1, "b": [2, 3], "c": "[true, false]"}        |
  +----------------------------------------------------+
  ```

  The third and final value listed in the result is a quoted string and not an array like the second one (which is not quoted in the output); no casting of values to the JSON type is performed. To insert the array as an array, you must perform such casts explicitly, as shown here:

  ```
  mysql> SELECT JSON_INSERT(@j, '$.a', 10, '$.c', CAST('[true, false]' AS JSON));
  +------------------------------------------------------------------+
  | JSON_INSERT(@j, '$.a', 10, '$.c', CAST('[true, false]' AS JSON)) |
  +------------------------------------------------------------------+
  | {"a": 1, "b": [2, 3], "c": [true, false]}                        |
  +------------------------------------------------------------------+
  1 row in set (0.00 sec)
  ```

* [`JSON_MERGE(json_doc, json_doc[, json_doc] ...)`](json-modification-functions.html#function_json-merge)

  Merges two or more JSON documents. Synonym for `JSON_MERGE_PRESERVE()`; deprecated in MySQL 8.0.3 and subject to removal in a future release.

  ```
  mysql> SELECT JSON_MERGE('[1, 2]', '[true, false]');
  +---------------------------------------+
  | JSON_MERGE('[1, 2]', '[true, false]') |
  +---------------------------------------+
  | [1, 2, true, false]                   |
  +---------------------------------------+
  1 row in set, 1 warning (0.00 sec)

  mysql> SHOW WARNINGS\G
  *************************** 1. row ***************************
    Level: Warning
     Code: 1287
  Message: 'JSON_MERGE' is deprecated and will be removed in a future release. \
   Please use JSON_MERGE_PRESERVE/JSON_MERGE_PATCH instead
  1 row in set (0.00 sec)
  ```

  For additional examples, see the entry for `JSON_MERGE_PRESERVE()`.

* [`JSON_MERGE_PATCH(json_doc, json_doc[, json_doc] ...)`](json-modification-functions.html#function_json-merge-patch)

  Performs an [RFC 7396](https://tools.ietf.org/html/rfc7396) compliant merge of two or more JSON documents and returns the merged result, without preserving members having duplicate keys. Raises an error if at least one of the documents passed as arguments to this function is not valid.

  Note

  For an explanation and example of the differences between this function and `JSON_MERGE_PRESERVE()`, see JSON_MERGE_PATCH() compared with JSON_MERGE_PRESERVE() compared with JSON_MERGE_PRESERVE()").

  `JSON_MERGE_PATCH()` performs a merge as follows:

  1. If the first argument is not an object, the result of the merge is the same as if an empty object had been merged with the second argument.

  2. If the second argument is not an object, the result of the merge is the second argument.

  3. If both arguments are objects, the result of the merge is an object with the following members:

     + All members of the first object which do not have a corresponding member with the same key in the second object.

     + All members of the second object which do not have a corresponding key in the first object, and whose value is not the JSON `null` literal.

     + All members with a key that exists in both the first and the second object, and whose value in the second object is not the JSON `null` literal. The values of these members are the results of recursively merging the value in the first object with the value in the second object.

  For additional information, see Normalization, Merging, and Autowrapping of JSON Values.

  ```
  mysql> SELECT JSON_MERGE_PATCH('[1, 2]', '[true, false]');
  +---------------------------------------------+
  | JSON_MERGE_PATCH('[1, 2]', '[true, false]') |
  +---------------------------------------------+
  | [true, false]                               |
  +---------------------------------------------+

  mysql> SELECT JSON_MERGE_PATCH('{"name": "x"}', '{"id": 47}');
  +-------------------------------------------------+
  | JSON_MERGE_PATCH('{"name": "x"}', '{"id": 47}') |
  +-------------------------------------------------+
  | {"id": 47, "name": "x"}                         |
  +-------------------------------------------------+

  mysql> SELECT JSON_MERGE_PATCH('1', 'true');
  +-------------------------------+
  | JSON_MERGE_PATCH('1', 'true') |
  +-------------------------------+
  | true                          |
  +-------------------------------+

  mysql> SELECT JSON_MERGE_PATCH('[1, 2]', '{"id": 47}');
  +------------------------------------------+
  | JSON_MERGE_PATCH('[1, 2]', '{"id": 47}') |
  +------------------------------------------+
  | {"id": 47}                               |
  +------------------------------------------+

  mysql> SELECT JSON_MERGE_PATCH('{ "a": 1, "b":2 }',
       >     '{ "a": 3, "c":4 }');
  +-----------------------------------------------------------+
  | JSON_MERGE_PATCH('{ "a": 1, "b":2 }','{ "a": 3, "c":4 }') |
  +-----------------------------------------------------------+
  | {"a": 3, "b": 2, "c": 4}                                  |
  +-----------------------------------------------------------+

  mysql> SELECT JSON_MERGE_PATCH('{ "a": 1, "b":2 }','{ "a": 3, "c":4 }',
       >     '{ "a": 5, "d":6 }');
  +-------------------------------------------------------------------------------+
  | JSON_MERGE_PATCH('{ "a": 1, "b":2 }','{ "a": 3, "c":4 }','{ "a": 5, "d":6 }') |
  +-------------------------------------------------------------------------------+
  | {"a": 5, "b": 2, "c": 4, "d": 6}                                              |
  +-------------------------------------------------------------------------------+
  ```

  You can use this function to remove a member by specifying `null` as the value of the same member in the second argument, as shown here:

  ```
  mysql> SELECT JSON_MERGE_PATCH('{"a":1, "b":2}', '{"b":null}');
  +--------------------------------------------------+
  | JSON_MERGE_PATCH('{"a":1, "b":2}', '{"b":null}') |
  +--------------------------------------------------+
  | {"a": 1}                                         |
  +--------------------------------------------------+
  ```

  This example shows that the function operates in a recursive fashion; that is, values of members are not limited to scalars, but rather can themselves be JSON documents:

  ```
  mysql> SELECT JSON_MERGE_PATCH('{"a":{"x":1}}', '{"a":{"y":2}}');
  +----------------------------------------------------+
  | JSON_MERGE_PATCH('{"a":{"x":1}}', '{"a":{"y":2}}') |
  +----------------------------------------------------+
  | {"a": {"x": 1, "y": 2}}                            |
  +----------------------------------------------------+
  ```

  `JSON_MERGE_PATCH()` is supported in MySQL 8.0.3 and later.

  **JSON_MERGE_PATCH() compared with JSON_MERGE_PRESERVE().** The behavior of `JSON_MERGE_PATCH()` is the same as that of `JSON_MERGE_PRESERVE()`, with the following two exceptions:

  + `JSON_MERGE_PATCH()` removes any member in the first object with a matching key in the second object, provided that the value associated with the key in the second object is not JSON `null`.

  + If the second object has a member with a key matching a member in the first object, `JSON_MERGE_PATCH()` *replaces* the value in the first object with the value in the second object, whereas `JSON_MERGE_PRESERVE()` *appends* the second value to the first value.

  This example compares the results of merging the same 3 JSON objects, each having a matching key `"a"`, with each of these two functions:

  ```
  mysql> SET @x = '{ "a": 1, "b": 2 }',
       >     @y = '{ "a": 3, "c": 4 }',
       >     @z = '{ "a": 5, "d": 6 }';

  mysql> SELECT  JSON_MERGE_PATCH(@x, @y, @z)    AS Patch,
      ->         JSON_MERGE_PRESERVE(@x, @y, @z) AS Preserve\G
  *************************** 1. row ***************************
     Patch: {"a": 5, "b": 2, "c": 4, "d": 6}
  Preserve: {"a": [1, 3, 5], "b": 2, "c": 4, "d": 6}
  ```

* [`JSON_MERGE_PRESERVE(json_doc, json_doc[, json_doc] ...)`](json-modification-functions.html#function_json-merge-preserve)

  Merges two or more JSON documents and returns the merged result. Returns `NULL` if any argument is `NULL`. An error occurs if any argument is not a valid JSON document.

  Merging takes place according to the following rules. For additional information, see Normalization, Merging, and Autowrapping of JSON Values.

  + Adjacent arrays are merged to a single array.
  + Adjacent objects are merged to a single object.
  + A scalar value is autowrapped as an array and merged as an array.

  + An adjacent array and object are merged by autowrapping the object as an array and merging the two arrays.

  ```
  mysql> SELECT JSON_MERGE_PRESERVE('[1, 2]', '[true, false]');
  +------------------------------------------------+
  | JSON_MERGE_PRESERVE('[1, 2]', '[true, false]') |
  +------------------------------------------------+
  | [1, 2, true, false]                            |
  +------------------------------------------------+

  mysql> SELECT JSON_MERGE_PRESERVE('{"name": "x"}', '{"id": 47}');
  +----------------------------------------------------+
  | JSON_MERGE_PRESERVE('{"name": "x"}', '{"id": 47}') |
  +----------------------------------------------------+
  | {"id": 47, "name": "x"}                            |
  +----------------------------------------------------+

  mysql> SELECT JSON_MERGE_PRESERVE('1', 'true');
  +----------------------------------+
  | JSON_MERGE_PRESERVE('1', 'true') |
  +----------------------------------+
  | [1, true]                        |
  +----------------------------------+

  mysql> SELECT JSON_MERGE_PRESERVE('[1, 2]', '{"id": 47}');
  +---------------------------------------------+
  | JSON_MERGE_PRESERVE('[1, 2]', '{"id": 47}') |
  +---------------------------------------------+
  | [1, 2, {"id": 47}]                          |
  +---------------------------------------------+

  mysql> SELECT JSON_MERGE_PRESERVE('{ "a": 1, "b": 2 }',
       >    '{ "a": 3, "c": 4 }');
  +--------------------------------------------------------------+
  | JSON_MERGE_PRESERVE('{ "a": 1, "b": 2 }','{ "a": 3, "c":4 }') |
  +--------------------------------------------------------------+
  | {"a": [1, 3], "b": 2, "c": 4}                                |
  +--------------------------------------------------------------+

  mysql> SELECT JSON_MERGE_PRESERVE('{ "a": 1, "b": 2 }','{ "a": 3, "c": 4 }',
       >    '{ "a": 5, "d": 6 }');
  +----------------------------------------------------------------------------------+
  | JSON_MERGE_PRESERVE('{ "a": 1, "b": 2 }','{ "a": 3, "c": 4 }','{ "a": 5, "d": 6 }') |
  +----------------------------------------------------------------------------------+
  | {"a": [1, 3, 5], "b": 2, "c": 4, "d": 6}                                         |
  +----------------------------------------------------------------------------------+
  ```

  This function was added in MySQL 8.0.3 as a synonym for `JSON_MERGE()`. The `JSON_MERGE()` function is now deprecated, and is subject to removal in a future release of MySQL.

  This function is similar to but differs from `JSON_MERGE_PATCH()` in significant respects; see JSON_MERGE_PATCH() compared with JSON_MERGE_PRESERVE() compared with JSON_MERGE_PRESERVE()"), for more information.

* [`JSON_REMOVE(json_doc, path[, path] ...)`](json-modification-functions.html#function_json-remove)

  Removes data from a JSON document and returns the result. Returns `NULL` if any argument is `NULL`. An error occurs if the *`json_doc`* argument is not a valid JSON document or any *`path`* argument is not a valid path expression or is `$` or contains a `*` or `**` wildcard.

  The *`path`* arguments are evaluated left to right. The document produced by evaluating one path becomes the new value against which the next path is evaluated.

  It is not an error if the element to be removed does not exist in the document; in that case, the path does not affect the document.

  ```
  mysql> SET @j = '["a", ["b", "c"], "d"]';
  mysql> SELECT JSON_REMOVE(@j, '$[1]');
  +-------------------------+
  | JSON_REMOVE(@j, '$[1]') |
  +-------------------------+
  | ["a", "d"]              |
  +-------------------------+
  ```

* [`JSON_REPLACE(json_doc, path, val[, path, val] ...)`](json-modification-functions.html#function_json-replace)

  Replaces existing values in a JSON document and returns the result. Returns `NULL` if *`json_doc`* or any *`path`* argument is `NULL`. An error occurs if the *`json_doc`* argument is not a valid JSON document or any *`path`* argument is not a valid path expression or contains a `*` or `**` wildcard.

  The path-value pairs are evaluated left to right. The document produced by evaluating one pair becomes the new value against which the next pair is evaluated.

  A path-value pair for an existing path in the document overwrites the existing document value with the new value. A path-value pair for a nonexisting path in the document is ignored and has no effect.

  In MySQL 8.0.4, the optimizer can perform a partial, in-place update of a `JSON` column instead of removing the old document and writing the new document in its entirety to the column. This optimization can be performed for an update statement that uses the `JSON_REPLACE()` function and meets the conditions outlined in Partial Updates of JSON Values.

  For a comparison of `JSON_INSERT()`, `JSON_REPLACE()`, and `JSON_SET()`, see the discussion of `JSON_SET()`.

  ```
  mysql> SET @j = '{ "a": 1, "b": [2, 3]}';
  mysql> SELECT JSON_REPLACE(@j, '$.a', 10, '$.c', '[true, false]');
  +-----------------------------------------------------+
  | JSON_REPLACE(@j, '$.a', 10, '$.c', '[true, false]') |
  +-----------------------------------------------------+
  | {"a": 10, "b": [2, 3]}                              |
  +-----------------------------------------------------+

  mysql> SELECT JSON_REPLACE(NULL, '$.a', 10, '$.c', '[true, false]');
  +-------------------------------------------------------+
  | JSON_REPLACE(NULL, '$.a', 10, '$.c', '[true, false]') |
  +-------------------------------------------------------+
  | NULL                                                  |
  +-------------------------------------------------------+

  mysql> SELECT JSON_REPLACE(@j, NULL, 10, '$.c', '[true, false]');
  +----------------------------------------------------+
  | JSON_REPLACE(@j, NULL, 10, '$.c', '[true, false]') |
  +----------------------------------------------------+
  | NULL                                               |
  +----------------------------------------------------+

  mysql> SELECT JSON_REPLACE(@j, '$.a', NULL, '$.c', '[true, false]');
  +-------------------------------------------------------+
  | JSON_REPLACE(@j, '$.a', NULL, '$.c', '[true, false]') |
  +-------------------------------------------------------+
  | {"a": null, "b": [2, 3]}                              |
  +-------------------------------------------------------+
  ```

* [`JSON_SET(json_doc, path, val[, path, val] ...)`](json-modification-functions.html#function_json-set)

  Inserts or updates data in a JSON document and returns the result. Returns `NULL` if *`json_doc`* or *`path`* is `NULL`, or if *`path`*, when given, does not locate an object. Otherwise, an error occurs if the *`json_doc`* argument is not a valid JSON document or any *`path`* argument is not a valid path expression or contains a `*` or `**` wildcard.

  The path-value pairs are evaluated left to right. The document produced by evaluating one pair becomes the new value against which the next pair is evaluated.

  A path-value pair for an existing path in the document overwrites the existing document value with the new value. A path-value pair for a nonexisting path in the document adds the value to the document if the path identifies one of these types of values:

  + A member not present in an existing object. The member is added to the object and associated with the new value.

  + A position past the end of an existing array. The array is extended with the new value. If the existing value is not an array, it is autowrapped as an array, then extended with the new value.

  Otherwise, a path-value pair for a nonexisting path in the document is ignored and has no effect.

  In MySQL 8.0.4, the optimizer can perform a partial, in-place update of a `JSON` column instead of removing the old document and writing the new document in its entirety to the column. This optimization can be performed for an update statement that uses the `JSON_SET()` function and meets the conditions outlined in Partial Updates of JSON Values.

  The `JSON_SET()`, `JSON_INSERT()`, and `JSON_REPLACE()` functions are related:

  + `JSON_SET()` replaces existing values and adds nonexisting values.

  + `JSON_INSERT()` inserts values without replacing existing values.

  + `JSON_REPLACE()` replaces *only* existing values.

  The following examples illustrate these differences, using one path that does exist in the document (`$.a`) and another that does not exist (`$.c`):

  ```
  mysql> SET @j = '{ "a": 1, "b": [2, 3]}';
  mysql> SELECT JSON_SET(@j, '$.a', 10, '$.c', '[true, false]');
  +-------------------------------------------------+
  | JSON_SET(@j, '$.a', 10, '$.c', '[true, false]') |
  +-------------------------------------------------+
  | {"a": 10, "b": [2, 3], "c": "[true, false]"}    |
  +-------------------------------------------------+
  mysql> SELECT JSON_INSERT(@j, '$.a', 10, '$.c', '[true, false]');
  +----------------------------------------------------+
  | JSON_INSERT(@j, '$.a', 10, '$.c', '[true, false]') |
  +----------------------------------------------------+
  | {"a": 1, "b": [2, 3], "c": "[true, false]"}        |
  +----------------------------------------------------+
  mysql> SELECT JSON_REPLACE(@j, '$.a', 10, '$.c', '[true, false]');
  +-----------------------------------------------------+
  | JSON_REPLACE(@j, '$.a', 10, '$.c', '[true, false]') |
  +-----------------------------------------------------+
  | {"a": 10, "b": [2, 3]}                              |
  +-----------------------------------------------------+
  ```

* `JSON_UNQUOTE(json_val)`

  Unquotes JSON value and returns the result as a `utf8mb4` string. Returns `NULL` if the argument is `NULL`. An error occurs if the value starts and ends with double quotes but is not a valid JSON string literal.

  Within a string, certain sequences have special meaning unless the `NO_BACKSLASH_ESCAPES` SQL mode is enabled. Each of these sequences begins with a backslash (`\`), known as the *escape character*. MySQL recognizes the escape sequences shown in Table 14.23, “JSON_UNQUOTE() Special Character Escape Sequences” Special Character Escape Sequences"). For all other escape sequences, backslash is ignored. That is, the escaped character is interpreted as if it was not escaped. For example, `\x` is just `x`. These sequences are case-sensitive. For example, `\b` is interpreted as a backspace, but `\B` is interpreted as `B`.

  **Table 14.23 JSON_UNQUOTE() Special Character Escape Sequences**

  <table><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Escape Sequence</th> <th>Character Represented by Sequence</th> </tr></thead><tbody><tr> <td><code>\"</code></td> <td>A double quote (<code>"</code>) character</td> </tr><tr> <td><code>\b</code></td> <td>A backspace character</td> </tr><tr> <td><code>\f</code></td> <td>A formfeed character</td> </tr><tr> <td><code>\n</code></td> <td>A newline (linefeed) character</td> </tr><tr> <td><code>\r</code></td> <td>A carriage return character</td> </tr><tr> <td><code>\t</code></td> <td>A tab character</td> </tr><tr> <td><code>\\</code></td> <td>A backslash (<code>\</code>) character</td> </tr><tr> <td><code>\u<em class="replaceable"><code>XXXX</code></em></code></td> <td>UTF-8 bytes for Unicode value <em class="replaceable"><code>XXXX</code></em></td> </tr></tbody></table>

  Two simple examples of the use of this function are shown here:

  ```
  mysql> SET @j = '"abc"';
  mysql> SELECT @j, JSON_UNQUOTE(@j);
  +-------+------------------+
  | @j    | JSON_UNQUOTE(@j) |
  +-------+------------------+
  | "abc" | abc              |
  +-------+------------------+
  mysql> SET @j = '[1, 2, 3]';
  mysql> SELECT @j, JSON_UNQUOTE(@j);
  +-----------+------------------+
  | @j        | JSON_UNQUOTE(@j) |
  +-----------+------------------+
  | [1, 2, 3] | [1, 2, 3]        |
  +-----------+------------------+
  ```

  The following set of examples shows how `JSON_UNQUOTE` handles escapes with `NO_BACKSLASH_ESCAPES` disabled and enabled:

  ```
  mysql> SELECT @@sql_mode;
  +------------+
  | @@sql_mode |
  +------------+
  |            |
  +------------+

  mysql> SELECT JSON_UNQUOTE('"\\t\\u0032"');
  +------------------------------+
  | JSON_UNQUOTE('"\\t\\u0032"') |
  +------------------------------+
  |       2                           |
  +------------------------------+

  mysql> SET @@sql_mode = 'NO_BACKSLASH_ESCAPES';
  mysql> SELECT JSON_UNQUOTE('"\\t\\u0032"');
  +------------------------------+
  | JSON_UNQUOTE('"\\t\\u0032"') |
  +------------------------------+
  | \t\u0032                     |
  +------------------------------+

  mysql> SELECT JSON_UNQUOTE('"\t\u0032"');
  +----------------------------+
  | JSON_UNQUOTE('"\t\u0032"') |
  +----------------------------+
  |       2                         |
  +----------------------------+
  ```


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

* [`JSON_LENGTH(json_doc[, path])`](json-attribute-functions.html#function_json-length)

  Returns the length of a JSON document, or, if a *`path`* argument is given, the length of the value within the document identified by the path. Returns `NULL` if any argument is `NULL` or the *`path`* argument does not identify a value in the document. An error occurs if the *`json_doc`* argument is not a valid JSON document or the *`path`* argument is not a valid path expression. Prior to MySQL 8.0.26, an error is also raised if the path expression contains a `*` or `**` wildcard.

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


### 14.17.6 JSON Table Functions

This section contains information about JSON functions that convert JSON data to tabular data. MySQL 8.0 supports one such function, `JSON_TABLE()`.

[`JSON_TABLE(expr, path COLUMNS (column_list) [AS] alias)`](json-table-functions.html#function_json-table)

Extracts data from a JSON document and returns it as a relational table having the specified columns. The complete syntax for this function is shown here:

```
JSON_TABLE(
    expr,
    path COLUMNS (column_list)
)   [AS] alias

column_list:
    column[, column][, ...]

column:
    name FOR ORDINALITY
    |  name type PATH string path [on_empty] [on_error]
    |  name type EXISTS PATH string path
    |  NESTED [PATH] path COLUMNS (column_list)

on_empty:
    {NULL | DEFAULT json_string | ERROR} ON EMPTY

on_error:
    {NULL | DEFAULT json_string | ERROR} ON ERROR
```

*`expr`*: This is an expression that returns JSON data. This can be a constant (`'{"a":1}'`), a column (`t1.json_data`, given table `t1` specified prior to `JSON_TABLE()` in the `FROM` clause), or a function call (`JSON_EXTRACT(t1.json_data,'$.post.comments')`).

*`path`*: A JSON path expression, which is applied to the data source. We refer to the JSON value matching the path as the *row source*; this is used to generate a row of relational data. The `COLUMNS` clause evaluates the row source, finds specific JSON values within the row source, and returns those JSON values as SQL values in individual columns of a row of relational data.

The *`alias`* is required. The usual rules for table aliases apply (see Section 11.2, “Schema Object Names”).

Beginning with MySQL 8.0.27, this function compares column names in case-insensitive fashion.

`JSON_TABLE()` supports four types of columns, described in the following list:

1. `name FOR ORDINALITY`: This type enumerates rows in the `COLUMNS` clause; the column named *`name`* is a counter whose type is `UNSIGNED INT`, and whose initial value is 1. This is equivalent to specifying a column as `AUTO_INCREMENT` in a `CREATE TABLE` statement, and can be used to distinguish parent rows with the same value for multiple rows generated by a `NESTED [PATH]` clause.

2. `name type PATH string_path [on_empty] [on_error]`: Columns of this type are used to extract values specified by *`string_path`*. *`type`* is a MySQL scalar data type (that is, it cannot be an object or array). `JSON_TABLE()` extracts data as JSON then coerces it to the column type, using the regular automatic type conversion applying to JSON data in MySQL. A missing value triggers the *`on_empty`* clause. Saving an object or array triggers the optional *`on error`* clause; this also occurs when an error takes place during coercion from the value saved as JSON to the table column, such as trying to save the string `'asd'` to an integer column.

3. `name type EXISTS PATH path`: This column returns 1 if any data is present at the location specified by *`path`*, and 0 otherwise. *`type`* can be any valid MySQL data type, but should normally be specified as some variety of `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

4. `NESTED [PATH] path COLUMNS (column_list)`: This flattens nested objects or arrays in JSON data into a single row along with the JSON values from the parent object or array. Using multiple `PATH` options allows projection of JSON values from multiple levels of nesting into a single row.

   The *`path`* is relative to the parent path row path of `JSON_TABLE()`, or the path of the parent `NESTED [PATH]` clause in the event of nested paths.

*`on empty`*, if specified, determines what `JSON_TABLE()` does in the event that data is missing (depending on type). This clause is also triggered on a column in a `NESTED PATH` clause when the latter has no match and a `NULL` complemented row is produced for it. *`on empty`* takes one of the following values:

* `NULL ON EMPTY`: The column is set to `NULL`; this is the default behavior.

* `DEFAULT json_string ON EMPTY`: the provided *`json_string`* is parsed as JSON, as long as it is valid, and stored instead of the missing value. Column type rules also apply to the default value.

* `ERROR ON EMPTY`: An error is thrown.

If used, *`on_error`* takes one of the following values with the corresponding result as shown here:

* `NULL ON ERROR`: The column is set to `NULL`; this is the default behavior.

* `DEFAULT json string ON ERROR`: The *`json_string`* is parsed as JSON (provided that it is valid) and stored instead of the object or array.

* `ERROR ON ERROR`: An error is thrown.

Prior to MySQL 8.0.20, a warning was thrown if a type conversion error occurred with `NULL ON ERROR` or `DEFAULT ... ON ERROR` was specified or implied. In MySQL 8.0.20 and later, this is no longer the case. (Bug #30628330)

Previously, it was possible to specify `ON EMPTY` and `ON ERROR` clauses in either order. This runs counter to the SQL standard, which stipulates that `ON EMPTY`, if specified, must precede any `ON ERROR` clause. For this reason, beginning with MySQL 8.0.20, specifying `ON ERROR` before `ON EMPTY` is deprecated; trying to do so causes the server to issue a warning. Expect support for the nonstandard syntax to be removed in a future version of MySQL.

When a value saved to a column is truncated, such as saving 3.14159 in a `DECIMAL(10,1)` - DECIMAL, NUMERIC") column, a warning is issued independently of any `ON ERROR` option. When multiple values are truncated in a single statement, the warning is issued only once.

Prior to MySQL 8.0.21, when the expression and path passed to this function resolved to JSON null, `JSON_TABLE()` raised an error. In MySQL 8.0.21 and later, it returns SQL `NULL` in such cases, in accordance with the SQL standard, as shown here (Bug #31345503, Bug #99557):

```
mysql> SELECT *
    ->   FROM
    ->     JSON_TABLE(
    ->       '[ {"c1": null} ]',
    ->       '$[*]' COLUMNS( c1 INT PATH '$.c1' ERROR ON ERROR )
    ->     ) as jt;
+------+
| c1   |
+------+
| NULL |
+------+
1 row in set (0.00 sec)
```

The following query demonstrates the use of `ON EMPTY` and `ON ERROR`. The row corresponding to `{"b":1}` is empty for the path `"$.a"`, and attempting to save `[1,2]` as a scalar produces an error; these rows are highlighted in the output shown.

```
mysql> SELECT *
    -> FROM
    ->   JSON_TABLE(
    ->     '[{"a":"3"},{"a":2},{"b":1},{"a":0},{"a":[1,2]}]',
    ->     "$[*]"
    ->     COLUMNS(
    ->       rowid FOR ORDINALITY,
    ->       ac VARCHAR(100) PATH "$.a" DEFAULT '111' ON EMPTY DEFAULT '999' ON ERROR,
    ->       aj JSON PATH "$.a" DEFAULT '{"x": 333}' ON EMPTY,
    ->       bx INT EXISTS PATH "$.b"
    ->     )
    ->   ) AS tt;

+-------+------+------------+------+
| rowid | ac   | aj         | bx   |
+-------+------+------------+------+
|     1 | 3    | "3"        |    0 |
|     2 | 2    | 2          |    0 |
|     3 | 111  | {"x": 333} |    1 |
|     4 | 0    | 0          |    0 |
|     5 | 999  | [1, 2]     |    0 |
+-------+------+------------+------+
5 rows in set (0.00 sec)
```

Column names are subject to the usual rules and limitations governing table column names. See Section 11.2, “Schema Object Names”.

All JSON and JSON path expressions are checked for validity; an invalid expression of either type causes an error.

Each match for the *`path`* preceding the `COLUMNS` keyword maps to an individual row in the result table. For example, the following query gives the result shown here:

```
mysql> SELECT *
    -> FROM
    ->   JSON_TABLE(
    ->     '[{"x":2,"y":"8"},{"x":"3","y":"7"},{"x":"4","y":6}]',
    ->     "$[*]" COLUMNS(
    ->       xval VARCHAR(100) PATH "$.x",
    ->       yval VARCHAR(100) PATH "$.y"
    ->     )
    ->   ) AS  jt1;

+------+------+
| xval | yval |
+------+------+
| 2    | 8    |
| 3    | 7    |
| 4    | 6    |
+------+------+
```

The expression `"$[*]"` matches each element of the array. You can filter the rows in the result by modifying the path. For example, using `"$[1]"` limits extraction to the second element of the JSON array used as the source, as shown here:

```
mysql> SELECT *
    -> FROM
    ->   JSON_TABLE(
    ->     '[{"x":2,"y":"8"},{"x":"3","y":"7"},{"x":"4","y":6}]',
    ->     "$[1]" COLUMNS(
    ->       xval VARCHAR(100) PATH "$.x",
    ->       yval VARCHAR(100) PATH "$.y"
    ->     )
    ->   ) AS  jt1;

+------+------+
| xval | yval |
+------+------+
| 3    | 7    |
+------+------+
```

Within a column definition, `"$"` passes the entire match to the column; `"$.x"` and `"$.y"` pass only the values corresponding to the keys `x` and `y`, respectively, within that match. For more information, see JSON Path Syntax.

`NESTED PATH` (or simply `NESTED`; `PATH` is optional) produces a set of records for each match in the `COLUMNS` clause to which it belongs. If there is no match, all columns of the nested path are set to `NULL`. This implements an outer join between the topmost clause and `NESTED [PATH]`. An inner join can be emulated by applying a suitable condition in the `WHERE` clause, as shown here:

```
mysql> SELECT *
    -> FROM
    ->   JSON_TABLE(
    ->     '[ {"a": 1, "b": [11,111]}, {"a": 2, "b": [22,222]}, {"a":3}]',
    ->     '$[*]' COLUMNS(
    ->             a INT PATH '$.a',
    ->             NESTED PATH '$.b[*]' COLUMNS (b INT PATH '$')
    ->            )
    ->    ) AS jt
    -> WHERE b IS NOT NULL;

+------+------+
| a    | b    |
+------+------+
|    1 |   11 |
|    1 |  111 |
|    2 |   22 |
|    2 |  222 |
+------+------+
```

Sibling nested paths—that is, two or more instances of `NESTED [PATH]` in the same `COLUMNS` clause—are processed one after another, one at a time. While one nested path is producing records, columns of any sibling nested path expressions are set to `NULL`. This means that the total number of records for a single match within a single containing `COLUMNS` clause is the sum and not the product of all records produced by `NESTED [PATH]` modifiers, as shown here:

```
mysql> SELECT *
    -> FROM
    ->   JSON_TABLE(
    ->     '[{"a": 1, "b": [11,111]}, {"a": 2, "b": [22,222]}]',
    ->     '$[*]' COLUMNS(
    ->         a INT PATH '$.a',
    ->         NESTED PATH '$.b[*]' COLUMNS (b1 INT PATH '$'),
    ->         NESTED PATH '$.b[*]' COLUMNS (b2 INT PATH '$')
    ->     )
    -> ) AS jt;

+------+------+------+
| a    | b1   | b2   |
+------+------+------+
|    1 |   11 | NULL |
|    1 |  111 | NULL |
|    1 | NULL |   11 |
|    1 | NULL |  111 |
|    2 |   22 | NULL |
|    2 |  222 | NULL |
|    2 | NULL |   22 |
|    2 | NULL |  222 |
+------+------+------+
```

A `FOR ORDINALITY` column enumerates records produced by the `COLUMNS` clause, and can be used to distinguish parent records of a nested path, especially if values in parent records are the same, as can be seen here:

```
mysql> SELECT *
    -> FROM
    ->   JSON_TABLE(
    ->     '[{"a": "a_val",
    '>       "b": [{"c": "c_val", "l": [1,2]}]},
    '>     {"a": "a_val",
    '>       "b": [{"c": "c_val","l": [11]}, {"c": "c_val", "l": [22]}]}]',
    ->     '$[*]' COLUMNS(
    ->       top_ord FOR ORDINALITY,
    ->       apath VARCHAR(10) PATH '$.a',
    ->       NESTED PATH '$.b[*]' COLUMNS (
    ->         bpath VARCHAR(10) PATH '$.c',
    ->         ord FOR ORDINALITY,
    ->         NESTED PATH '$.l[*]' COLUMNS (lpath varchar(10) PATH '$')
    ->         )
    ->     )
    -> ) as jt;

+---------+---------+---------+------+-------+
| top_ord | apath   | bpath   | ord  | lpath |
+---------+---------+---------+------+-------+
|       1 |  a_val  |  c_val  |    1 | 1     |
|       1 |  a_val  |  c_val  |    1 | 2     |
|       2 |  a_val  |  c_val  |    1 | 11    |
|       2 |  a_val  |  c_val  |    2 | 22    |
+---------+---------+---------+------+-------+
```

The source document contains an array of two elements; each of these elements produces two rows. The values of `apath` and `bpath` are the same over the entire result set; this means that they cannot be used to determine whether `lpath` values came from the same or different parents. The value of the `ord` column remains the same as the set of records having `top_ord` equal to 1, so these two values are from a single object. The remaining two values are from different objects, since they have different values in the `ord` column.

Normally, you cannot join a derived table which depends on columns of preceding tables in the same `FROM` clause. MySQL, per the SQL standard, makes an exception for table functions; these are considered lateral derived tables, even in versions of MySQL that do not yet support the `LATERAL` keyword (8.0.13 and earlier). In versions where `LATERAL` is supported (8.0.14 and later), it is implicit, and for this reason is not allowed before `JSON_TABLE()`, also according to the standard.

Suppose you have a table `t1` created and populated using the statements shown here:

```
CREATE TABLE t1 (c1 INT, c2 CHAR(1), c3 JSON);

INSERT INTO t1 () VALUES
	ROW(1, 'z', JSON_OBJECT('a', 23, 'b', 27, 'c', 1)),
	ROW(1, 'y', JSON_OBJECT('a', 44, 'b', 22, 'c', 11)),
	ROW(2, 'x', JSON_OBJECT('b', 1, 'c', 15)),
	ROW(3, 'w', JSON_OBJECT('a', 5, 'b', 6, 'c', 7)),
	ROW(5, 'v', JSON_OBJECT('a', 123, 'c', 1111))
;
```

You can then execute joins, such as this one, in which `JSON_TABLE()` acts as a derived table while at the same time it refers to a column in a previously referenced table:

```
SELECT c1, c2, JSON_EXTRACT(c3, '$.*')
FROM t1 AS m
JOIN
JSON_TABLE(
  m.c3,
  '$.*'
  COLUMNS(
    at VARCHAR(10) PATH '$.a' DEFAULT '1' ON EMPTY,
    bt VARCHAR(10) PATH '$.b' DEFAULT '2' ON EMPTY,
    ct VARCHAR(10) PATH '$.c' DEFAULT '3' ON EMPTY
  )
) AS tt
ON m.c1 > tt.at;
```

Attempting to use the `LATERAL` keyword with this query raises `ER_PARSE_ERROR`.


### 14.17.7 JSON Schema Validation Functions

Beginning with MySQL 8.0.17, MySQL supports validation of JSON documents against JSON schemas conforming to [Draft 4 of the JSON Schema specification](https://json-schema.org/specification-links.html#draft-4). This can be done using either of the functions detailed in this section, both of which take two arguments, a JSON schema, and a JSON document which is validated against the schema. `JSON_SCHEMA_VALID()` returns true if the document validates against the schema, and false if it does not; `JSON_SCHEMA_VALIDATION_REPORT()` provides a report in JSON format on the validation.

Both functions handle null or invalid input as follows:

* If at least one of the arguments is `NULL`, the function returns `NULL`.

* If at least one of the arguments is not valid JSON, the function raises an error (`ER_INVALID_TYPE_FOR_JSON`)

* In addition, if the schema is not a valid JSON object, the function returns `ER_INVALID_JSON_TYPE`.

MySQL supports the `required` attribute in JSON schemas to enforce the inclusion of required properties (see the examples in the function descriptions).

MySQL supports the `id`, `$schema`, `description`, and `type` attributes in JSON schemas but does not require any of these.

MySQL does not support external resources in JSON schemas; using the `$ref` keyword causes `JSON_SCHEMA_VALID()` to fail with `ER_NOT_SUPPORTED_YET`.

Note

MySQL supports regular expression patterns in JSON schema, which supports but silently ignores invalid patterns (see the description of `JSON_SCHEMA_VALID()` for an example).

These functions are described in detail in the following list:

* `JSON_SCHEMA_VALID(schema,document)`

  Validates a JSON *`document`* against a JSON *`schema`*. Both *`schema`* and *`document`* are required. The schema must be a valid JSON object; the document must be a valid JSON document. Provided that these conditions are met: If the document validates against the schema, the function returns true (1); otherwise, it returns false (0).

  In this example, we set a user variable `@schema` to the value of a JSON schema for geographical coordinates, and another one `@document` to the value of a JSON document containing one such coordinate. We then verify that `@document` validates according to `@schema` by using them as the arguments to `JSON_SCHEMA_VALID()`:

  ```
  mysql> SET @schema = '{
      '>  "id": "http://json-schema.org/geo",
      '> "$schema": "http://json-schema.org/draft-04/schema#",
      '> "description": "A geographical coordinate",
      '> "type": "object",
      '> "properties": {
      '>   "latitude": {
      '>     "type": "number",
      '>     "minimum": -90,
      '>     "maximum": 90
      '>   },
      '>   "longitude": {
      '>     "type": "number",
      '>     "minimum": -180,
      '>     "maximum": 180
      '>   }
      '> },
      '> "required": ["latitude", "longitude"]
      '>}';
  Query OK, 0 rows affected (0.01 sec)

  mysql> SET @document = '{
      '> "latitude": 63.444697,
      '> "longitude": 10.445118
      '>}';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT JSON_SCHEMA_VALID(@schema, @document);
  +---------------------------------------+
  | JSON_SCHEMA_VALID(@schema, @document) |
  +---------------------------------------+
  |                                     1 |
  +---------------------------------------+
  1 row in set (0.00 sec)
  ```

  Since `@schema` contains the `required` attribute, we can set `@document` to a value that is otherwise valid but does not contain the required properties, then test it against `@schema`, like this:

  ```
  mysql> SET @document = '{}';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT JSON_SCHEMA_VALID(@schema, @document);
  +---------------------------------------+
  | JSON_SCHEMA_VALID(@schema, @document) |
  +---------------------------------------+
  |                                     0 |
  +---------------------------------------+
  1 row in set (0.00 sec)
  ```

  If we now set the value of `@schema` to the same JSON schema but without the `required` attribute, `@document` validates because it is a valid JSON object, even though it contains no properties, as shown here:

  ```
  mysql> SET @schema = '{
      '> "id": "http://json-schema.org/geo",
      '> "$schema": "http://json-schema.org/draft-04/schema#",
      '> "description": "A geographical coordinate",
      '> "type": "object",
      '> "properties": {
      '>   "latitude": {
      '>     "type": "number",
      '>     "minimum": -90,
      '>     "maximum": 90
      '>   },
      '>   "longitude": {
      '>     "type": "number",
      '>     "minimum": -180,
      '>     "maximum": 180
      '>   }
      '> }
      '>}';
  Query OK, 0 rows affected (0.00 sec)


  mysql> SELECT JSON_SCHEMA_VALID(@schema, @document);
  +---------------------------------------+
  | JSON_SCHEMA_VALID(@schema, @document) |
  +---------------------------------------+
  |                                     1 |
  +---------------------------------------+
  1 row in set (0.00 sec)
  ```

  **JSON_SCHEMA_VALID() and CHECK constraints.** `JSON_SCHEMA_VALID()` can also be used to enforce `CHECK` constraints.

  Consider the table `geo` created as shown here, with a JSON column `coordinate` representing a point of latitude and longitude on a map, governed by the JSON schema used as an argument in a `JSON_SCHEMA_VALID()` call which is passed as the expression for a `CHECK` constraint on this table:

  ```
  mysql> CREATE TABLE geo (
      ->     coordinate JSON,
      ->     CHECK(
      ->         JSON_SCHEMA_VALID(
      ->             '{
      '>                 "type":"object",
      '>                 "properties":{
      '>                       "latitude":{"type":"number", "minimum":-90, "maximum":90},
      '>                       "longitude":{"type":"number", "minimum":-180, "maximum":180}
      '>                 },
      '>                 "required": ["latitude", "longitude"]
      '>             }',
      ->             coordinate
      ->         )
      ->     )
      -> );
  Query OK, 0 rows affected (0.45 sec)
  ```

  Note

  Because a MySQL `CHECK` constraint cannot contain references to variables, you must pass the JSON schema to `JSON_SCHEMA_VALID()` inline when using it to specify such a constraint for a table.

  We assign JSON values representing coordinates to three variables, as shown here:

  ```
  mysql> SET @point1 = '{"latitude":59, "longitude":18}';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SET @point2 = '{"latitude":91, "longitude":0}';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SET @point3 = '{"longitude":120}';
  Query OK, 0 rows affected (0.00 sec)
  ```

  The first of these values is valid, as can be seen in the following `INSERT` statement:

  ```
  mysql> INSERT INTO geo VALUES(@point1);
  Query OK, 1 row affected (0.05 sec)
  ```

  The second JSON value is invalid and so fails the constraint, as shown here:

  ```
  mysql> INSERT INTO geo VALUES(@point2);
  ERROR 3819 (HY000): Check constraint 'geo_chk_1' is violated.
  ```

  In MySQL 8.0.19 and later, you can obtain precise information about the nature of the failure—in this case, that the `latitude` value exceeds the maximum defined in the schema—by issuing a [`SHOW WARNINGS`](show-warnings.html "15.7.7.42 SHOW WARNINGS Statement") statement:

  ```
  mysql> SHOW WARNINGS\G
  *************************** 1. row ***************************
    Level: Error
     Code: 3934
  Message: The JSON document location '#/latitude' failed requirement 'maximum' at
  JSON Schema location '#/properties/latitude'.
  *************************** 2. row ***************************
    Level: Error
     Code: 3819
  Message: Check constraint 'geo_chk_1' is violated.
  2 rows in set (0.00 sec)
  ```

  The third coordinate value defined above is also invalid, since it is missing the required `latitude` property. As before, you can see this by attempting to insert the value into the `geo` table, then issuing `SHOW WARNINGS` afterwards:

  ```
  mysql> INSERT INTO geo VALUES(@point3);
  ERROR 3819 (HY000): Check constraint 'geo_chk_1' is violated.
  mysql> SHOW WARNINGS\G
  *************************** 1. row ***************************
    Level: Error
     Code: 3934
  Message: The JSON document location '#' failed requirement 'required' at JSON
  Schema location '#'.
  *************************** 2. row ***************************
    Level: Error
     Code: 3819
  Message: Check constraint 'geo_chk_1' is violated.
  2 rows in set (0.00 sec)
  ```

  See Section 15.1.20.6, “CHECK Constraints”, for more information.

  JSON Schema has support for specifying regular expression patterns for strings, but the implementation used by MySQL silently ignores invalid patterns. This means that `JSON_SCHEMA_VALID()` can return true even when a regular expression pattern is invalid, as shown here:

  ```
  mysql> SELECT JSON_SCHEMA_VALID('{"type":"string","pattern":"("}', '"abc"');
  +---------------------------------------------------------------+
  | JSON_SCHEMA_VALID('{"type":"string","pattern":"("}', '"abc"') |
  +---------------------------------------------------------------+
  |                                                             1 |
  +---------------------------------------------------------------+
  1 row in set (0.04 sec)
  ```

* `JSON_SCHEMA_VALIDATION_REPORT(schema,document)`

  Validates a JSON *`document`* against a JSON *`schema`*. Both *`schema`* and *`document`* are required. As with JSON_VALID_SCHEMA(), the schema must be a valid JSON object, and the document must be a valid JSON document. Provided that these conditions are met, the function returns a report, as a JSON document, on the outcome of the validation. If the JSON document is considered valid according to the JSON Schema, the function returns a JSON object with one property `valid` having the value "true". If the JSON document fails validation, the function returns a JSON object which includes the properties listed here:

  + `valid`: Always "false" for a failed schema validation

  + `reason`: A human-readable string containing the reason for the failure

  + `schema-location`: A JSON pointer URI fragment identifier indicating where in the JSON schema the validation failed (see Note following this list)

  + `document-location`: A JSON pointer URI fragment identifier indicating where in the JSON document the validation failed (see Note following this list)

  + `schema-failed-keyword`: A string containing the name of the keyword or property in the JSON schema that was violated

  Note

  JSON pointer URI fragment identifiers are defined in [RFC 6901 - JavaScript Object Notation (JSON) Pointer](https://tools.ietf.org/html/rfc6901#page-5). (These are *not* the same as the JSON path notation used by `JSON_EXTRACT()` and other MySQL JSON functions.) In this notation, `#` represents the entire document, and `#/myprop` represents the portion of the document included in the top-level property named `myprop`. See the specification just cited and the examples shown later in this section for more information.

  In this example, we set a user variable `@schema` to the value of a JSON schema for geographical coordinates, and another one `@document` to the value of a JSON document containing one such coordinate. We then verify that `@document` validates according to `@schema` by using them as the arguments to `JSON_SCHEMA_VALIDATION_REORT()`:

  ```
  mysql> SET @schema = '{
      '>  "id": "http://json-schema.org/geo",
      '> "$schema": "http://json-schema.org/draft-04/schema#",
      '> "description": "A geographical coordinate",
      '> "type": "object",
      '> "properties": {
      '>   "latitude": {
      '>     "type": "number",
      '>     "minimum": -90,
      '>     "maximum": 90
      '>   },
      '>   "longitude": {
      '>     "type": "number",
      '>     "minimum": -180,
      '>     "maximum": 180
      '>   }
      '> },
      '> "required": ["latitude", "longitude"]
      '>}';
  Query OK, 0 rows affected (0.01 sec)

  mysql> SET @document = '{
      '> "latitude": 63.444697,
      '> "longitude": 10.445118
      '>}';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT JSON_SCHEMA_VALIDATION_REPORT(@schema, @document);
  +---------------------------------------------------+
  | JSON_SCHEMA_VALIDATION_REPORT(@schema, @document) |
  +---------------------------------------------------+
  | {"valid": true}                                   |
  +---------------------------------------------------+
  1 row in set (0.00 sec)
  ```

  Now we set `@document` such that it specifies an illegal value for one of its properties, like this:

  ```
  mysql> SET @document = '{
      '> "latitude": 63.444697,
      '> "longitude": 310.445118
      '> }';
  ```

  Validation of `@document` now fails when tested with `JSON_SCHEMA_VALIDATION_REPORT()`. The output from the function call contains detailed information about the failure (with the function wrapped by `JSON_PRETTY()` to provide better formatting), as shown here:

  ```
  mysql> SELECT JSON_PRETTY(JSON_SCHEMA_VALIDATION_REPORT(@schema, @document))\G
  *************************** 1. row ***************************
  JSON_PRETTY(JSON_SCHEMA_VALIDATION_REPORT(@schema, @document)): {
    "valid": false,
    "reason": "The JSON document location '#/longitude' failed requirement 'maximum' at JSON Schema location '#/properties/longitude'",
    "schema-location": "#/properties/longitude",
    "document-location": "#/longitude",
    "schema-failed-keyword": "maximum"
  }
  1 row in set (0.00 sec)
  ```

  Since `@schema` contains the `required` attribute, we can set `@document` to a value that is otherwise valid but does not contain the required properties, then test it against `@schema`. The output of `JSON_SCHEMA_VALIDATION_REPORT()` shows that validation fails due to lack of a required element, like this:

  ```
  mysql> SET @document = '{}';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT JSON_PRETTY(JSON_SCHEMA_VALIDATION_REPORT(@schema, @document))\G
  *************************** 1. row ***************************
  JSON_PRETTY(JSON_SCHEMA_VALIDATION_REPORT(@schema, @document)): {
    "valid": false,
    "reason": "The JSON document location '#' failed requirement 'required' at JSON Schema location '#'",
    "schema-location": "#",
    "document-location": "#",
    "schema-failed-keyword": "required"
  }
  1 row in set (0.00 sec)
  ```

  If we now set the value of `@schema` to the same JSON schema but without the `required` attribute, `@document` validates because it is a valid JSON object, even though it contains no properties, as shown here:

  ```
  mysql> SET @schema = '{
      '> "id": "http://json-schema.org/geo",
      '> "$schema": "http://json-schema.org/draft-04/schema#",
      '> "description": "A geographical coordinate",
      '> "type": "object",
      '> "properties": {
      '>   "latitude": {
      '>     "type": "number",
      '>     "minimum": -90,
      '>     "maximum": 90
      '>   },
      '>   "longitude": {
      '>     "type": "number",
      '>     "minimum": -180,
      '>     "maximum": 180
      '>   }
      '> }
      '>}';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT JSON_SCHEMA_VALIDATION_REPORT(@schema, @document);
  +---------------------------------------------------+
  | JSON_SCHEMA_VALIDATION_REPORT(@schema, @document) |
  +---------------------------------------------------+
  | {"valid": true}                                   |
  +---------------------------------------------------+
  1 row in set (0.00 sec)
  ```


### 14.17.8 JSON Utility Functions

This section documents utility functions that act on JSON values, or strings that can be parsed as JSON values. `JSON_PRETTY()` prints out a JSON value in a format that is easy to read. `JSON_STORAGE_SIZE()` and `JSON_STORAGE_FREE()` show, respectively, the amount of storage space used by a given JSON value and the amount of space remaining in a `JSON` column following a partial update.

* `JSON_PRETTY(json_val)`

  Provides pretty-printing of JSON values similar to that implemented in PHP and by other languages and database systems. The value supplied must be a JSON value or a valid string representation of a JSON value. Extraneous whitespaces and newlines present in this value have no effect on the output. For a `NULL` value, the function returns `NULL`. If the value is not a JSON document, or if it cannot be parsed as one, the function fails with an error.

  Formatting of the output from this function adheres to the following rules:

  + Each array element or object member appears on a separate line, indented by one additional level as compared to its parent.

  + Each level of indentation adds two leading spaces.
  + A comma separating individual array elements or object members is printed before the newline that separates the two elements or members.

  + The key and the value of an object member are separated by a colon followed by a space ('`:` ').

  + An empty object or array is printed on a single line. No space is printed between the opening and closing brace.

  + Special characters in string scalars and key names are escaped employing the same rules used by the `JSON_QUOTE()` function.

  ```
  mysql> SELECT JSON_PRETTY('123'); # scalar
  +--------------------+
  | JSON_PRETTY('123') |
  +--------------------+
  | 123                |
  +--------------------+

  mysql> SELECT JSON_PRETTY("[1,3,5]"); # array
  +------------------------+
  | JSON_PRETTY("[1,3,5]") |
  +------------------------+
  | [
    1,
    3,
    5
  ]      |
  +------------------------+

  mysql> SELECT JSON_PRETTY('{"a":"10","b":"15","x":"25"}'); # object
  +---------------------------------------------+
  | JSON_PRETTY('{"a":"10","b":"15","x":"25"}') |
  +---------------------------------------------+
  | {
    "a": "10",
    "b": "15",
    "x": "25"
  }   |
  +---------------------------------------------+

  mysql> SELECT JSON_PRETTY('["a",1,{"key1":
      '>    "value1"},"5",     "77" ,
      '>       {"key2":["value3","valueX",
      '> "valueY"]},"j", "2"   ]')\G  # nested arrays and objects
  *************************** 1. row ***************************
  JSON_PRETTY('["a",1,{"key1":
               "value1"},"5",     "77" ,
                  {"key2":["value3","valuex",
            "valuey"]},"j", "2"   ]'): [
    "a",
    1,
    {
      "key1": "value1"
    },
    "5",
    "77",
    {
      "key2": [
        "value3",
        "valuex",
        "valuey"
      ]
    },
    "j",
    "2"
  ]
  ```

* `JSON_STORAGE_FREE(json_val)`

  For a `JSON` column value, this function shows how much storage space was freed in its binary representation after it was updated in place using `JSON_SET()`, `JSON_REPLACE()`, or `JSON_REMOVE()`. The argument can also be a valid JSON document or a string which can be parsed as one—either as a literal value or as the value of a user variable—in which case the function returns 0. It returns a positive, nonzero value if the argument is a `JSON` column value which has been updated as described previously, such that its binary representation takes up less space than it did prior to the update. For a `JSON` column which has been updated such that its binary representation is the same as or larger than before, or if the update was not able to take advantage of a partial update, it returns 0; it returns `NULL` if the argument is `NULL`.

  If *`json_val`* is not `NULL`, and neither is a valid JSON document nor can be successfully parsed as one, an error results.

  In this example, we create a table containing a `JSON` column, then insert a row containing a JSON object:

  ```
  mysql> CREATE TABLE jtable (jcol JSON);
  Query OK, 0 rows affected (0.38 sec)

  mysql> INSERT INTO jtable VALUES
      ->     ('{"a": 10, "b": "wxyz", "c": "[true, false]"}');
  Query OK, 1 row affected (0.04 sec)

  mysql> SELECT * FROM jtable;
  +----------------------------------------------+
  | jcol                                         |
  +----------------------------------------------+
  | {"a": 10, "b": "wxyz", "c": "[true, false]"} |
  +----------------------------------------------+
  1 row in set (0.00 sec)
  ```

  Now we update the column value using `JSON_SET()` such that a partial update can be performed; in this case, we replace the value pointed to by the `c` key (the array `[true, false]`) with one that takes up less space (the integer `1`):

  ```
  mysql> UPDATE jtable
      ->     SET jcol = JSON_SET(jcol, "$.a", 10, "$.b", "wxyz", "$.c", 1);
  Query OK, 1 row affected (0.03 sec)
  Rows matched: 1  Changed: 1  Warnings: 0

  mysql> SELECT * FROM jtable;
  +--------------------------------+
  | jcol                           |
  +--------------------------------+
  | {"a": 10, "b": "wxyz", "c": 1} |
  +--------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT JSON_STORAGE_FREE(jcol) FROM jtable;
  +-------------------------+
  | JSON_STORAGE_FREE(jcol) |
  +-------------------------+
  |                      14 |
  +-------------------------+
  1 row in set (0.00 sec)
  ```

  The effects of successive partial updates on this free space are cumulative, as shown in this example using `JSON_SET()` to reduce the space taken up by the value having key `b` (and making no other changes):

  ```
  mysql> UPDATE jtable
      ->     SET jcol = JSON_SET(jcol, "$.a", 10, "$.b", "wx", "$.c", 1);
  Query OK, 1 row affected (0.03 sec)
  Rows matched: 1  Changed: 1  Warnings: 0

  mysql> SELECT JSON_STORAGE_FREE(jcol) FROM jtable;
  +-------------------------+
  | JSON_STORAGE_FREE(jcol) |
  +-------------------------+
  |                      16 |
  +-------------------------+
  1 row in set (0.00 sec)
  ```

  Updating the column without using `JSON_SET()`, `JSON_REPLACE()`, or `JSON_REMOVE()` means that the optimizer cannot perform the update in place; in this case, `JSON_STORAGE_FREE()` returns 0, as shown here:

  ```
  mysql> UPDATE jtable SET jcol = '{"a": 10, "b": 1}';
  Query OK, 1 row affected (0.05 sec)
  Rows matched: 1  Changed: 1  Warnings: 0

  mysql> SELECT JSON_STORAGE_FREE(jcol) FROM jtable;
  +-------------------------+
  | JSON_STORAGE_FREE(jcol) |
  +-------------------------+
  |                       0 |
  +-------------------------+
  1 row in set (0.00 sec)
  ```

  Partial updates of JSON documents can be performed only on column values. For a user variable that stores a JSON value, the value is always completely replaced, even when the update is performed using `JSON_SET()`:

  ```
  mysql> SET @j = '{"a": 10, "b": "wxyz", "c": "[true, false]"}';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SET @j = JSON_SET(@j, '$.a', 10, '$.b', 'wxyz', '$.c', '1');
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT @j, JSON_STORAGE_FREE(@j) AS Free;
  +----------------------------------+------+
  | @j                               | Free |
  +----------------------------------+------+
  | {"a": 10, "b": "wxyz", "c": "1"} |    0 |
  +----------------------------------+------+
  1 row in set (0.00 sec)
  ```

  For a JSON literal, this function always returns 0:

  ```
  mysql> SELECT JSON_STORAGE_FREE('{"a": 10, "b": "wxyz", "c": "1"}') AS Free;
  +------+
  | Free |
  +------+
  |    0 |
  +------+
  1 row in set (0.00 sec)
  ```

* `JSON_STORAGE_SIZE(json_val)`

  This function returns the number of bytes used to store the binary representation of a JSON document. When the argument is a `JSON` column, this is the space used to store the JSON document as it was inserted into the column, prior to any partial updates that may have been performed on it afterwards. *`json_val`* must be a valid JSON document or a string which can be parsed as one. In the case where it is string, the function returns the amount of storage space in the JSON binary representation that is created by parsing the string as JSON and converting it to binary. It returns `NULL` if the argument is `NULL`.

  An error results when *`json_val`* is not `NULL`, and is not—or cannot be successfully parsed as—a JSON document.

  To illustrate this function's behavior when used with a `JSON` column as its argument, we create a table named `jtable` containing a `JSON` column `jcol`, insert a JSON value into the table, then obtain the storage space used by this column with `JSON_STORAGE_SIZE()`, as shown here:

  ```
  mysql> CREATE TABLE jtable (jcol JSON);
  Query OK, 0 rows affected (0.42 sec)

  mysql> INSERT INTO jtable VALUES
      ->     ('{"a": 1000, "b": "wxyz", "c": "[1, 3, 5, 7]"}');
  Query OK, 1 row affected (0.04 sec)

  mysql> SELECT
      ->     jcol,
      ->     JSON_STORAGE_SIZE(jcol) AS Size,
      ->     JSON_STORAGE_FREE(jcol) AS Free
      -> FROM jtable;
  +-----------------------------------------------+------+------+
  | jcol                                          | Size | Free |
  +-----------------------------------------------+------+------+
  | {"a": 1000, "b": "wxyz", "c": "[1, 3, 5, 7]"} |   47 |    0 |
  +-----------------------------------------------+------+------+
  1 row in set (0.00 sec)
  ```

  According to the output of `JSON_STORAGE_SIZE()`, the JSON document inserted into the column takes up 47 bytes. We also checked the amount of space freed by any previous partial updates of the column using `JSON_STORAGE_FREE()`; since no updates have yet been performed, this is 0, as expected.

  Next we perform an `UPDATE` on the table that should result in a partial update of the document stored in `jcol`, and then test the result as shown here:

  ```
  mysql> UPDATE jtable SET jcol =
      ->     JSON_SET(jcol, "$.b", "a");
  Query OK, 1 row affected (0.04 sec)
  Rows matched: 1  Changed: 1  Warnings: 0

  mysql> SELECT
      ->     jcol,
      ->     JSON_STORAGE_SIZE(jcol) AS Size,
      ->     JSON_STORAGE_FREE(jcol) AS Free
      -> FROM jtable;
  +--------------------------------------------+------+------+
  | jcol                                       | Size | Free |
  +--------------------------------------------+------+------+
  | {"a": 1000, "b": "a", "c": "[1, 3, 5, 7]"} |   47 |    3 |
  +--------------------------------------------+------+------+
  1 row in set (0.00 sec)
  ```

  The value returned by `JSON_STORAGE_FREE()` in the previous query indicates that a partial update of the JSON document was performed, and that this freed 3 bytes of space used to store it. The result returned by `JSON_STORAGE_SIZE()` is unchanged by the partial update.

  Partial updates are supported for updates using `JSON_SET()`, `JSON_REPLACE()`, or `JSON_REMOVE()`. The direct assignment of a value to a `JSON` column cannot be partially updated; following such an update, `JSON_STORAGE_SIZE()` always shows the storage used for the newly-set value:

  ```
  mysql> UPDATE jtable
  mysql>     SET jcol = '{"a": 4.55, "b": "wxyz", "c": "[true, false]"}';
  Query OK, 1 row affected (0.04 sec)
  Rows matched: 1  Changed: 1  Warnings: 0

  mysql> SELECT
      ->     jcol,
      ->     JSON_STORAGE_SIZE(jcol) AS Size,
      ->     JSON_STORAGE_FREE(jcol) AS Free
      -> FROM jtable;
  +------------------------------------------------+------+------+
  | jcol                                           | Size | Free |
  +------------------------------------------------+------+------+
  | {"a": 4.55, "b": "wxyz", "c": "[true, false]"} |   56 |    0 |
  +------------------------------------------------+------+------+
  1 row in set (0.00 sec)
  ```

  A JSON user variable cannot be partially updated. This means that this function always shows the space currently used to store a JSON document in a user variable:

  ```
  mysql> SET @j = '[100, "sakila", [1, 3, 5], 425.05]';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT @j, JSON_STORAGE_SIZE(@j) AS Size;
  +------------------------------------+------+
  | @j                                 | Size |
  +------------------------------------+------+
  | [100, "sakila", [1, 3, 5], 425.05] |   45 |
  +------------------------------------+------+
  1 row in set (0.00 sec)

  mysql> SET @j = JSON_SET(@j, '$[1]', "json");
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT @j, JSON_STORAGE_SIZE(@j) AS Size;
  +----------------------------------+------+
  | @j                               | Size |
  +----------------------------------+------+
  | [100, "json", [1, 3, 5], 425.05] |   43 |
  +----------------------------------+------+
  1 row in set (0.00 sec)

  mysql> SET @j = JSON_SET(@j, '$[2][0]', JSON_ARRAY(10, 20, 30));
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT @j, JSON_STORAGE_SIZE(@j) AS Size;
  +---------------------------------------------+------+
  | @j                                          | Size |
  +---------------------------------------------+------+
  | [100, "json", [[10, 20, 30], 3, 5], 425.05] |   56 |
  +---------------------------------------------+------+
  1 row in set (0.00 sec)
  ```

  For a JSON literal, this function always returns the current storage space used:

  ```
  mysql> SELECT
      ->     JSON_STORAGE_SIZE('[100, "sakila", [1, 3, 5], 425.05]') AS A,
      ->     JSON_STORAGE_SIZE('{"a": 1000, "b": "a", "c": "[1, 3, 5, 7]"}') AS B,
      ->     JSON_STORAGE_SIZE('{"a": 1000, "b": "wxyz", "c": "[1, 3, 5, 7]"}') AS C,
      ->     JSON_STORAGE_SIZE('[100, "json", [[10, 20, 30], 3, 5], 425.05]') AS D;
  +----+----+----+----+
  | A  | B  | C  | D  |
  +----+----+----+----+
  | 45 | 44 | 47 | 56 |
  +----+----+----+----+
  1 row in set (0.00 sec)
  ```
