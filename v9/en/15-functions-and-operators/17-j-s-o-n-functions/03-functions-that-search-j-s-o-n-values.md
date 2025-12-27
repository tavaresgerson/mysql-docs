### 14.17.3 Functions That Search JSON Values

The functions in this section perform search or comparison operations on JSON values to extract data from them, report whether data exists at a location within them, or report the path to data within them. The `MEMBER OF()` operator is also documented herein.

* `JSON_CONTAINS(target, candidate[, path])`

  Indicates by returning 1 or 0 whether a given *`candidate`* JSON document is contained within a *`target`* JSON document, or—if a *`path`* argument was supplied—whether the candidate is found at a specific path within the target. Returns `NULL` if any argument is `NULL`, or if the path argument does not identify a section of the target document. An error occurs if *`target`* or *`candidate`* is not a valid JSON document, or if the *`path`* argument is not a valid path expression or contains a `*` or `**` wildcard.

  To check only whether any data exists at the path, use `JSON_CONTAINS_PATH()` instead.

  The following rules define containment:

  + A candidate scalar is contained in a target scalar if and only if they are comparable and are equal. Two scalar values are comparable if they have the same `JSON_TYPE()` types, with the exception that values of types `INTEGER` and `DECIMAL` are also comparable to each other.

  + A candidate array is contained in a target array if and only if every element in the candidate is contained in some element of the target.

  + A candidate nonarray is contained in a target array if and only if the candidate is contained in some element of the target.

  + A candidate object is contained in a target object if and only if for each key in the candidate there is a key with the same name in the target and the value associated with the candidate key is contained in the value associated with the target key.

  Otherwise, the candidate value is not contained in the target document.

  Queries using `JSON_CONTAINS()` on `InnoDB` tables can be optimized using multi-valued indexes; see Multi-Valued Indexes, for more information.

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

* `JSON_CONTAINS_PATH(json_doc, one_or_all, path[, path] ...)`

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

* `JSON_EXTRACT(json_doc, path[, path] ...)`

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

  + `JSON_UNQUOTE(` `JSON_EXTRACT(column, path) )`

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

* `JSON_KEYS(json_doc[, path])`

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

* `JSON_OVERLAPS(json_doc1, json_doc2)`

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

* [`JSON_SEARCH(json_doc, one_or_all, search_str[, escape_char[, path] ...])`](json-search-functions.html#function_json-search)

  Returns the path to the given string within a JSON document. Returns `NULL` if any of the *`json_doc`*, *`search_str`*, or *`path`* arguments are `NULL`; no *`path`* exists within the document; or *`search_str`* is not found. An error occurs if the *`json_doc`* argument is not a valid JSON document, any *`path`* argument is not a valid path expression, *`one_or_all`* is not `'one'` or `'all'`, or *`escape_char`* is not a constant expression.

  The *`one_or_all`* argument affects the search as follows:

  + `'one'`: The search terminates after the first match and returns one path string. It is undefined which match is considered first.

  + `'all'`: The search returns all matching path strings such that no duplicate paths are included. If there are multiple strings, they are autowrapped as an array. The order of the array elements is undefined.

  Within the *`search_str`* search string argument, the `%` and `_` characters work as for the `LIKE` operator: `%` matches any number of characters (including zero characters), and `_` matches exactly one character.

  To specify a literal `%` or `_` character in the search string, precede it by the escape character. The default is `\` if the *`escape_char`* argument is missing or `NULL`. Otherwise, *`escape_char`* must be a constant that is empty or one character.

  For more information about matching and escape character behavior, see the description of `LIKE` in Section 14.8.1, “String Comparison Functions and Operators”. For escape character handling, a difference from the `LIKE` behavior is that the escape character for `JSON_SEARCH()` must evaluate to a constant at compile time, not just at execution time. For example, if `JSON_SEARCH()` is used in a prepared statement and the *`escape_char`* argument is supplied using a `?` parameter, the parameter value might be constant at execution time, but is not at compile time.

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

* `JSON_VALUE(json_doc, path)`

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
  + `YEAR`

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

* `value MEMBER OF(json_array)`

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
