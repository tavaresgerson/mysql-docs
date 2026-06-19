## 12.17 JSON Functions

The functions described in this section perform operations on JSON values. For discussion of the `JSON` data type and additional examples showing how to use these functions, see Section 11.5, “The JSON Data Type”.

For functions that take a JSON argument, an error occurs if the argument is not a valid JSON value. Arguments parsed as JSON are indicated by *`json_doc`*; arguments indicated by *`val`* are not parsed.

Functions that return JSON values always perform normalization of these values (see Normalization, Merging, and Autowrapping of JSON Values), and thus orders them. *The precise outcome of the sort is subject to change at any time; do not rely on it to be consistent between releases*.

Unless otherwise indicated, the JSON functions were added in MySQL 5.7.8.

A set of spatial functions for operating on GeoJSON values is also available. See Section 12.16.11, “Spatial GeoJSON Functions”.


### 12.17.1 JSON Function Reference

**Table 12.22 JSON Functions**

<table frame="box" rules="all" summary="A reference that lists all JSON functions."><col style="width: 22%"/><col style="width: 55%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th>Name</th> <th>Description</th> <th>Introduced</th> <th>Deprecated</th> </tr></thead><tbody><tr><th><code>-&gt;</code></th> <td> Return value from JSON column after evaluating path; equivalent to JSON_EXTRACT(). </td> <td></td> <td></td> </tr><tr><th><code>-&gt;&gt;</code></th> <td> Return value from JSON column after evaluating path and unquoting the result; equivalent to JSON_UNQUOTE(JSON_EXTRACT()). </td> <td>5.7.13</td> <td></td> </tr><tr><th><code>JSON_APPEND()</code></th> <td> Append data to JSON document </td> <td></td> <td>Yes</td> </tr><tr><th><code>JSON_ARRAY()</code></th> <td> Create JSON array </td> <td></td> <td></td> </tr><tr><th><code>JSON_ARRAY_APPEND()</code></th> <td> Append data to JSON document </td> <td></td> <td></td> </tr><tr><th><code>JSON_ARRAY_INSERT()</code></th> <td> Insert into JSON array </td> <td></td> <td></td> </tr><tr><th><code>JSON_CONTAINS()</code></th> <td> Whether JSON document contains specific object at path </td> <td></td> <td></td> </tr><tr><th><code>JSON_CONTAINS_PATH()</code></th> <td> Whether JSON document contains any data at path </td> <td></td> <td></td> </tr><tr><th><code>JSON_DEPTH()</code></th> <td> Maximum depth of JSON document </td> <td></td> <td></td> </tr><tr><th><code>JSON_EXTRACT()</code></th> <td> Return data from JSON document </td> <td></td> <td></td> </tr><tr><th><code>JSON_INSERT()</code></th> <td> Insert data into JSON document </td> <td></td> <td></td> </tr><tr><th><code>JSON_KEYS()</code></th> <td> Array of keys from JSON document </td> <td></td> <td></td> </tr><tr><th><code>JSON_LENGTH()</code></th> <td> Number of elements in JSON document </td> <td></td> <td></td> </tr><tr><th><code>JSON_MERGE()</code></th> <td> Merge JSON documents, preserving duplicate keys. Deprecated synonym for JSON_MERGE_PRESERVE() </td> <td></td> <td>5.7.22</td> </tr><tr><th><code>JSON_MERGE_PATCH()</code></th> <td> Merge JSON documents, replacing values of duplicate keys </td> <td>5.7.22</td> <td></td> </tr><tr><th><code>JSON_MERGE_PRESERVE()</code></th> <td> Merge JSON documents, preserving duplicate keys </td> <td>5.7.22</td> <td></td> </tr><tr><th><code>JSON_OBJECT()</code></th> <td> Create JSON object </td> <td></td> <td></td> </tr><tr><th><code>JSON_PRETTY()</code></th> <td> Print a JSON document in human-readable format </td> <td>5.7.22</td> <td></td> </tr><tr><th><code>JSON_QUOTE()</code></th> <td> Quote JSON document </td> <td></td> <td></td> </tr><tr><th><code>JSON_REMOVE()</code></th> <td> Remove data from JSON document </td> <td></td> <td></td> </tr><tr><th><code>JSON_REPLACE()</code></th> <td> Replace values in JSON document </td> <td></td> <td></td> </tr><tr><th><code>JSON_SEARCH()</code></th> <td> Path to value within JSON document </td> <td></td> <td></td> </tr><tr><th><code>JSON_SET()</code></th> <td> Insert data into JSON document </td> <td></td> <td></td> </tr><tr><th><code>JSON_STORAGE_SIZE()</code></th> <td> Space used for storage of binary representation of a JSON document </td> <td>5.7.22</td> <td></td> </tr><tr><th><code>JSON_TYPE()</code></th> <td> Type of JSON value </td> <td></td> <td></td> </tr><tr><th><code>JSON_UNQUOTE()</code></th> <td> Unquote JSON value </td> <td></td> <td></td> </tr><tr><th><code>JSON_VALID()</code></th> <td> Whether JSON value is valid </td> <td></td> <td></td> </tr></tbody></table>

MySQL 5.7.22 and later supports two aggregate JSON functions `JSON_ARRAYAGG()` and `JSON_OBJECTAGG()`. See Section 12.19, “Aggregate Functions”, for descriptions of these.

Also beginning with MySQL 5.7.22:

* “pretty-printing” of JSON values in an easy-to-read format can be obtained using the `JSON_PRETTY()` function.

* You can see how much storage space a given JSON value takes up using `JSON_STORAGE_SIZE()`.

For complete descriptions of these two functions, see Section 12.17.6, “JSON Utility Functions”.


### 12.17.2 Functions That Create JSON Values

The functions listed in this section compose JSON values from component elements.

* [`JSON_ARRAY([val[, val] ...])`](json-creation-functions.html#function_json-array)

  Evaluates a (possibly empty) list of values and returns a JSON array containing those values.

  ```sql
  mysql> SELECT JSON_ARRAY(1, "abc", NULL, TRUE, CURTIME());
  +---------------------------------------------+
  | JSON_ARRAY(1, "abc", NULL, TRUE, CURTIME()) |
  +---------------------------------------------+
  | [1, "abc", null, true, "11:30:24.000000"]   |
  +---------------------------------------------+
  ```

* [`JSON_OBJECT([key, val[, key, val] ...])`](json-creation-functions.html#function_json-object)

  Evaluates a (possibly empty) list of key-value pairs and returns a JSON object containing those pairs. An error occurs if any key name is `NULL` or the number of arguments is odd.

  ```sql
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

  Certain special characters are escaped with backslashes per the escape sequences shown in Table 12.23, “JSON\_UNQUOTE() Special Character Escape Sequences” Special Character Escape Sequences").

  ```sql
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

Two aggregate functions generating JSON values are available (MySQL 5.7.22 and later). `JSON_ARRAYAGG()` returns a result set as a single JSON array, and `JSON_OBJECTAGG()` returns a result set as a single JSON object. For more information, see Section 12.19, “Aggregate Functions”.


### 12.17.3 Functions That Search JSON Values

The functions in this section perform search operations on JSON values to extract data from them, report whether data exists at a location within them, or report the path to data within them.

* [`JSON_CONTAINS(target, candidate[, path])`](json-search-functions.html#function_json-contains)

  Indicates by returning 1 or 0 whether a given *`candidate`* JSON document is contained within a *`target`* JSON document, or—if a *`path`* argument was supplied—whether the candidate is found at a specific path within the target. Returns `NULL` if any argument is `NULL`, or if the path argument does not identify a section of the target document. An error occurs if *`target`* or *`candidate`* is not a valid JSON document, or if the *`path`* argument is not a valid path expression or contains a `*` or `**` wildcard.

  To check only whether any data exists at the path, use `JSON_CONTAINS_PATH()` instead.

  The following rules define containment:

  + A candidate scalar is contained in a target scalar if and only if they are comparable and are equal. Two scalar values are comparable if they have the same `JSON_TYPE()` types, with the exception that values of types `INTEGER` and `DECIMAL` are also comparable to each other.

  + A candidate array is contained in a target array if and only if every element in the candidate is contained in some element of the target.

  + A candidate nonarray is contained in a target array if and only if the candidate is contained in some element of the target.

  + A candidate object is contained in a target object if and only if for each key in the candidate there is a key with the same name in the target and the value associated with the candidate key is contained in the value associated with the target key.

  Otherwise, the candidate value is not contained in the target document.

  ```sql
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

  ```sql
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

  ```sql
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

  MySQL 5.7.9 and later supports the `->` operator as shorthand for this function as used with 2 arguments where the left hand side is a `JSON` column identifier (not an expression) and the right hand side is the JSON path to be matched within the column.

* `column->path`

  In MySQL 5.7.9 and later, the `->` operator serves as an alias for the `JSON_EXTRACT()` function when used with two arguments, a column identifier on the left and a JSON path (a string literal) on the right that is evaluated against the JSON document (the column value). You can use such expressions in place of column references wherever they occur in SQL statements.

  The two `SELECT` statements shown here produce the same output:

  ```sql
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

  ```sql
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

  ```sql
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

  ```sql
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

  ```sql
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

  This is an improved, unquoting extraction operator available in MySQL 5.7.13 and later. Whereas the `->` operator simply extracts a value, the `->>` operator in addition unquotes the extracted result. In other words, given a `JSON` column value *`column`* and a path expression *`path`* (a string literal), the following three expressions return the same value:

  + `JSON_UNQUOTE(` [`JSON_EXTRACT(column, path) )`](json-search-functions.html#function_json-extract)

  + `JSON_UNQUOTE(column` `->` `path)`

  + `column->>path`

  The `->>` operator can be used wherever `JSON_UNQUOTE(JSON_EXTRACT())` would be allowed. This includes (but is not limited to) `SELECT` lists, `WHERE` and `HAVING` clauses, and `ORDER BY` and `GROUP BY` clauses.

  The next few statements demonstrate some `->>` operator equivalences with other expressions in the **mysql** client:

  ```sql
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

  ```sql
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

  ```sql
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

  The `->>` operator was added in MySQL 5.7.13.

* [`JSON_KEYS(json_doc[, path])`](json-search-functions.html#function_json-keys)

  Returns the keys from the top-level value of a JSON object as a JSON array, or, if a *`path`* argument is given, the top-level keys from the selected path. Returns `NULL` if any argument is `NULL`, the *`json_doc`* argument is not an object, or *`path`*, if given, does not locate an object. An error occurs if the *`json_doc`* argument is not a valid JSON document or the *`path`* argument is not a valid path expression or contains a `*` or `**` wildcard.

  The result array is empty if the selected object is empty. If the top-level value has nested subobjects, the return value does not include keys from those subobjects.

  ```sql
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

* [`JSON_SEARCH(json_doc, one_or_all, search_str[, escape_char[, path] ...])`](json-search-functions.html#function_json-search)

  Returns the path to the given string within a JSON document. Returns `NULL` if any of the *`json_doc`*, *`search_str`*, or *`path`* arguments are `NULL`; no *`path`* exists within the document; or *`search_str`* is not found. An error occurs if the *`json_doc`* argument is not a valid JSON document, any *`path`* argument is not a valid path expression, *`one_or_all`* is not `'one'` or `'all'`, or *`escape_char`* is not a constant expression.

  The *`one_or_all`* argument affects the search as follows:

  + `'one'`: The search terminates after the first match and returns one path string. It is undefined which match is considered first.

  + `'all'`: The search returns all matching path strings such that no duplicate paths are included. If there are multiple strings, they are autowrapped as an array. The order of the array elements is undefined.

  Within the *`search_str`* search string argument, the `%` and `_` characters work as for the `LIKE` operator: `%` matches any number of characters (including zero characters), and `_` matches exactly one character.

  To specify a literal `%` or `_` character in the search string, precede it by the escape character. The default is `\` if the *`escape_char`* argument is missing or `NULL`. Otherwise, *`escape_char`* must be a constant that is empty or one character.

  For more information about matching and escape character behavior, see the description of `LIKE` in Section 12.8.1, “String Comparison Functions and Operators”. For escape character handling, a difference from the `LIKE` behavior is that the escape character for `JSON_SEARCH()` must evaluate to a constant at compile time, not just at execution time. For example, if `JSON_SEARCH()` is used in a prepared statement and the *`escape_char`* argument is supplied using a `?` parameter, the parameter value might be constant at execution time, but is not at compile time.

  *`search_str`* and *`path`* are always interpeted as utf8mb4 strings, regardless of their actual encoding. This is a known issue which is fixed in MySQL 8.0 ( Bug #32449181).

  ```sql
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


### 12.17.4 Functions That Modify JSON Values

The functions in this section modify JSON values and return the result.

* [`JSON_APPEND(json_doc, path, val[, path, val] ...)`](json-modification-functions.html#function_json-append)

  Appends values to the end of the indicated arrays within a JSON document and returns the result. This function was renamed to `JSON_ARRAY_APPEND()` in MySQL 5.7.9; the alias `JSON_APPEND()` is now deprecated in MySQL 5.7, and is removed in MySQL 8.0.

* [`JSON_ARRAY_APPEND(json_doc, path, val[, path, val] ...)`](json-modification-functions.html#function_json-array-append)

  Appends values to the end of the indicated arrays within a JSON document and returns the result. Returns `NULL` if any argument is `NULL`. An error occurs if the *`json_doc`* argument is not a valid JSON document or any *`path`* argument is not a valid path expression or contains a `*` or `**` wildcard.

  The path-value pairs are evaluated left to right. The document produced by evaluating one pair becomes the new value against which the next pair is evaluated.

  If a path selects a scalar or object value, that value is autowrapped within an array and the new value is added to that array. Pairs for which the path does not identify any value in the JSON document are ignored.

  ```sql
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

* [`JSON_ARRAY_INSERT(json_doc, path, val[, path, val] ...)`](json-modification-functions.html#function_json-array-insert)

  Updates a JSON document, inserting into an array within the document and returning the modified document. Returns `NULL` if any argument is `NULL`. An error occurs if the *`json_doc`* argument is not a valid JSON document or any *`path`* argument is not a valid path expression or contains a `*` or `**` wildcard or does not end with an array element identifier.

  The path-value pairs are evaluated left to right. The document produced by evaluating one pair becomes the new value against which the next pair is evaluated.

  Pairs for which the path does not identify any array in the JSON document are ignored. If a path identifies an array element, the corresponding value is inserted at that element position, shifting any following values to the right. If a path identifies an array position past the end of an array, the value is inserted at the end of the array.

  ```sql
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

  ```sql
  mysql> SET @j = '{ "a": 1, "b": [2, 3]}';
  mysql> SELECT JSON_INSERT(@j, '$.a', 10, '$.c', '[true, false]');
  +----------------------------------------------------+
  | JSON_INSERT(@j, '$.a', 10, '$.c', '[true, false]') |
  +----------------------------------------------------+
  | {"a": 1, "b": [2, 3], "c": "[true, false]"}        |
  +----------------------------------------------------+
  ```

  The third and final value listed in the result is a quoted string and not an array like the second one (which is not quoted in the output); no casting of values to the JSON type is performed. To insert the array as an array, you must perform such casts explicitly, as shown here:

  ```sql
  mysql> SELECT JSON_INSERT(@j, '$.a', 10, '$.c', CAST('[true, false]' AS JSON));
  +------------------------------------------------------------------+
  | JSON_INSERT(@j, '$.a', 10, '$.c', CAST('[true, false]' AS JSON)) |
  +------------------------------------------------------------------+
  | {"a": 1, "b": [2, 3], "c": [true, false]}                        |
  +------------------------------------------------------------------+
  1 row in set (0.00 sec)
  ```

* [`JSON_MERGE(json_doc, json_doc[, json_doc] ...)`](json-modification-functions.html#function_json-merge)

  Merges two or more JSON documents. Synonym for `JSON_MERGE_PRESERVE()`; deprecated in MySQL 5.7.22 and subject to removal in a future release.

  ```sql
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

  For an explanation and example of the differences between this function and `JSON_MERGE_PRESERVE()`, see JSON\_MERGE\_PATCH() compared with JSON\_MERGE\_PRESERVE() compared with JSON_MERGE_PRESERVE()").

  `JSON_MERGE_PATCH()` performs a merge as follows:

  1. If the first argument is not an object, the result of the merge is the same as if an empty object had been merged with the second argument.

  2. If the second argument is not an object, the result of the merge is the second argument.

  3. If both arguments are objects, the result of the merge is an object with the following members:

     + All members of the first object which do not have a corresponding member with the same key in the second object.

     + All members of the second object which do not have a corresponding key in the first object, and whose value is not the JSON `null` literal.

     + All members with a key that exists in both the first and the second object, and whose value in the second object is not the JSON `null` literal. The values of these members are the results of recursively merging the value in the first object with the value in the second object.

  For additional information, see Normalization, Merging, and Autowrapping of JSON Values.

  ```sql
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

  You can use this function to remove a member by specifying `null` as the value of the same member in the seond argument, as shown here:

  ```sql
  mysql> SELECT JSON_MERGE_PATCH('{"a":1, "b":2}', '{"b":null}');
  +--------------------------------------------------+
  | JSON_MERGE_PATCH('{"a":1, "b":2}', '{"b":null}') |
  +--------------------------------------------------+
  | {"a": 1}                                         |
  +--------------------------------------------------+
  ```

  This example shows that the function operates in a recursive fashion; that is, values of members are not limited to scalars, but rather can themselves be JSON documents:

  ```sql
  mysql> SELECT JSON_MERGE_PATCH('{"a":{"x":1}}', '{"a":{"y":2}}');
  +----------------------------------------------------+
  | JSON_MERGE_PATCH('{"a":{"x":1}}', '{"a":{"y":2}}') |
  +----------------------------------------------------+
  | {"a": {"x": 1, "y": 2}}                            |
  +----------------------------------------------------+
  ```

  `JSON_MERGE_PATCH()` is supported in MySQL 5.7.22 and later.

  **JSON\_MERGE\_PATCH() compared with JSON\_MERGE\_PRESERVE().** The behavior of `JSON_MERGE_PATCH()` is the same as that of `JSON_MERGE_PRESERVE()`, with the following two exceptions:

  + `JSON_MERGE_PATCH()` removes any member in the first object with a matching key in the second object, provided that the value associated with the key in the second object is not JSON `null`.

  + If the second object has a member with a key matching a member in the first object, `JSON_MERGE_PATCH()` *replaces* the value in the first object with the value in the second object, whereas `JSON_MERGE_PRESERVE()` *appends* the second value to the first value.

  This example compares the results of merging the same 3 JSON objects, each having a matching key `"a"`, with each of these two functions:

  ```sql
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

  ```sql
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

  This function was added in MySQL 5.7.22 as a synonym for `JSON_MERGE()`. The `JSON_MERGE()` function is now deprecated, and is subject to removal in a future release of MySQL.

  This function is similar to but differs from `JSON_MERGE_PATCH()` in significant respects; see JSON\_MERGE\_PATCH() compared with JSON\_MERGE\_PRESERVE() compared with JSON_MERGE_PRESERVE()"), for more information.

* [`JSON_REMOVE(json_doc, path[, path] ...)`](json-modification-functions.html#function_json-remove)

  Removes data from a JSON document and returns the result. Returns `NULL` if any argument is `NULL`. An error occurs if the *`json_doc`* argument is not a valid JSON document or any *`path`* argument is not a valid path expression or is `$` or contains a `*` or `**` wildcard.

  The *`path`* arguments are evaluated left to right. The document produced by evaluating one path becomes the new value against which the next path is evaluated.

  It is not an error if the element to be removed does not exist in the document; in that case, the path does not affect the document.

  ```sql
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

  For a comparison of `JSON_INSERT()`, `JSON_REPLACE()`, and `JSON_SET()`, see the discussion of `JSON_SET()`.

  ```sql
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

  The `JSON_SET()`, `JSON_INSERT()`, and `JSON_REPLACE()` functions are related:

  + `JSON_SET()` replaces existing values and adds nonexisting values.

  + `JSON_INSERT()` inserts values without replacing existing values.

  + `JSON_REPLACE()` replaces *only* existing values.

  The following examples illustrate these differences, using one path that does exist in the document (`$.a`) and another that does not exist (`$.c`):

  ```sql
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

  Within a string, certain sequences have special meaning unless the `NO_BACKSLASH_ESCAPES` SQL mode is enabled. Each of these sequences begins with a backslash (`\`), known as the *escape character*. MySQL recognizes the escape sequences shown in Table 12.23, “JSON\_UNQUOTE() Special Character Escape Sequences” Special Character Escape Sequences"). For all other escape sequences, backslash is ignored. That is, the escaped character is interpreted as if it was not escaped. For example, `\x` is just `x`. These sequences are case-sensitive. For example, `\b` is interpreted as a backspace, but `\B` is interpreted as `B`.

  **Table 12.23 JSON\_UNQUOTE() Special Character Escape Sequences**

  <table><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Escape Sequence</th> <th>Character Represented by Sequence</th> </tr></thead><tbody><tr> <td><code>\"</code></td> <td>A double quote (<code>"</code>) character</td> </tr><tr> <td><code>\b</code></td> <td>A backspace character</td> </tr><tr> <td><code>\f</code></td> <td>A formfeed character</td> </tr><tr> <td><code>\n</code></td> <td>A newline (linefeed) character</td> </tr><tr> <td><code>\r</code></td> <td>A carriage return character</td> </tr><tr> <td><code>\t</code></td> <td>A tab character</td> </tr><tr> <td><code>\\</code></td> <td>A backslash (<code>\</code>) character</td> </tr><tr> <td><code>\u<code>XXXX</code></code></td> <td>UTF-8 bytes for Unicode value <code>XXXX</code></td> </tr></tbody></table>

  Two simple examples of the use of this function are shown here:

  ```sql
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

  ```sql
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


### 12.17.5 Functions That Return JSON Value Attributes

The functions in this section return attributes of JSON values.

* `JSON_DEPTH(json_doc)`

  Returns the maximum depth of a JSON document. Returns `NULL` if the argument is `NULL`. An error occurs if the argument is not a valid JSON document.

  An empty array, empty object, or scalar value has depth 1. A nonempty array containing only elements of depth 1 or nonempty object containing only member values of depth 1 has depth 2. Otherwise, a JSON document has depth greater than 2.

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

* [`JSON_LENGTH(json_doc[, path])`](json-attribute-functions.html#function_json-length)

  Returns the length of a JSON document, or, if a *`path`* argument is given, the length of the value within the document identified by the path. Returns `NULL` if any argument is `NULL` or the *`path`* argument does not identify a value in the document. An error occurs if the *`json_doc`* argument is not a valid JSON document or the *`path`* argument is not a valid path expression or contains a `*` or `**` wildcard.

  The length of a document is determined as follows:

  + The length of a scalar is 1.
  + The length of an array is the number of array elements.
  + The length of an object is the number of object members.
  + The length does not count the length of nested arrays or objects.

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

* `JSON_TYPE(json_val)`

  Returns a `utf8mb4` string indicating the type of a JSON value. This can be an object, an array, or a scalar type, as shown here:

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

  `JSON_TYPE()` returns `NULL` if the argument is `NULL`:

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

    - `STRING`: MySQL `utf8` character type scalars: `CHAR`, `VARCHAR`, `TEXT`, `ENUM`, and `SET`

  + Binary types:

    - `BLOB`: MySQL binary type scalars: `BINARY`, `VARBINARY`, `BLOB`

    - `BIT`: MySQL `BIT` scalars

  + All other types:

    - `OPAQUE` (raw bits)
* `JSON_VALID(val)`

  Returns 0 or 1 to indicate whether a value is valid JSON. Returns `NULL` if the argument is `NULL`.

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


### 12.17.6 JSON Utility Functions

This section documents utility functions that act on JSON values, or strings that can be parsed as JSON values. `JSON_PRETTY()` prints out a JSON value in a format that is easy to read. `JSON_STORAGE_SIZE()` shows the amount of storage space used by a given JSON value.

* `JSON_PRETTY(json_val)`

  Provides pretty-printing of JSON values similar to that implemented in PHP and by other languages and database systems. The value supplied must be a JSON value or a valid string representation of a JSON value. Extraneous whitespaces and newlines present in this value have no effect on the output. For a `NULL` value, the function returns `NULL`. If the value is not a JSON document, or if it cannot be parsed as one, the function fails with an error.

  Formatting of the output from this function adheres to the following rules:

  + Each array element or object member appears on a separate line, indented by one additional level as compared to its parent.

  + Each level of indentation adds two leading spaces.
  + A comma separating individual array elements or object members is printed before the newline that separates the two elements or members.

  + The key and the value of an object member are separated by a colon followed by a space ('`:` ').

  + An empty object or array is printed on a single line. No space is printed between the opening and closing brace.

  + Special characters in string scalars and key names are escaped employing the same rules used by the `JSON_QUOTE()` function.

  ```sql
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
       >    "value1"},"5",     "77" ,
       >       {"key2":["value3","valueX",
       > "valueY"]},"j", "2"   ]')\G  # nested arrays and objects
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

  Added in MySQL 5.7.22.

* `JSON_STORAGE_SIZE(json_val)`

  This function returns the number of bytes used to store the binary representation of a JSON document. When the argument is a `JSON` column, this is the space used to store the JSON document. *`json_val`* must be a valid JSON document or a string which can be parsed as one. In the case where it is string, the function returns the amount of storage space in the JSON binary representation that is created by parsing the string as JSON and converting it to binary. It returns `NULL` if the argument is `NULL`.

  An error results when *`json_val`* is not `NULL`, and is not—or cannot be successfully parsed as—a JSON document.

  To illustrate this function's behavior when used with a `JSON` column as its argument, we create a table named `jtable` containing a `JSON` column `jcol`, insert a JSON value into the table, then obtain the storage space used by this column with `JSON_STORAGE_SIZE()`, as shown here:

  ```sql
  mysql> CREATE TABLE jtable (jcol JSON);
  Query OK, 0 rows affected (0.42 sec)

  mysql> INSERT INTO jtable VALUES
      ->     ('{"a": 1000, "b": "wxyz", "c": "[1, 3, 5, 7]"}');
  Query OK, 1 row affected (0.04 sec)

  mysql> SELECT
      ->     jcol,
      ->     JSON_STORAGE_SIZE(jcol) AS Size
      -> FROM jtable;
  +-----------------------------------------------+------+
  | jcol                                          | Size |
  +-----------------------------------------------+------+
  | {"a": 1000, "b": "wxyz", "c": "[1, 3, 5, 7]"} |   47 |
  +-----------------------------------------------+------+
  1 row in set (0.00 sec)
  ```

  According to the output of `JSON_STORAGE_SIZE()`, the JSON document inserted into the column takes up 47 bytes. Following an update, the function shows the storage used for the newly-set value:

  ```sql
  mysql> UPDATE jtable
  mysql>     SET jcol = '{"a": 4.55, "b": "wxyz", "c": "[true, false]"}';
  Query OK, 1 row affected (0.04 sec)
  Rows matched: 1  Changed: 1  Warnings: 0

  mysql> SELECT
      ->     jcol,
      ->     JSON_STORAGE_SIZE(jcol) AS Size
      -> FROM jtable;
  +------------------------------------------------+------+
  | jcol                                           | Size |
  +------------------------------------------------+------+
  | {"a": 4.55, "b": "wxyz", "c": "[true, false]"} |   56 |
  +------------------------------------------------+------+
  1 row in set (0.00 sec)
  ```

  This function also shows the space currently used to store a JSON document in a user variable:

  ```sql
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

  For a JSON literal, this function also returns the current storage space used, as shown here:

  ```sql
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

  This function was added in MySQL 5.7.22.
