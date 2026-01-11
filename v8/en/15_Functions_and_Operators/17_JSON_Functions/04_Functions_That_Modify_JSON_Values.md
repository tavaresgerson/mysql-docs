### 14.17.4 Functions That Modify JSON Values

The functions in this section modify JSON values and return the result.

* `JSON_ARRAY_APPEND(json_doc, path, val[, path, val] ...)`

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
  | "a", 2], ["b", "c"], "d"]      |
  +----------------------------------+
  mysql> SELECT JSON_ARRAY_APPEND(@j, '$[1][0]', 3);
  +-------------------------------------+
  | JSON_ARRAY_APPEND(@j, '$[1][0]', 3) |
  +-------------------------------------+
  | ["a", "b", 3], "c"], "d"]         |
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

* `JSON_ARRAY_INSERT(json_doc, path, val[, path, val] ...)`

  Updates a JSON document, inserting into an array within the document and returning the modified document. Returns `NULL` if any argument is `NULL`. An error occurs if the *`json_doc`* argument is not a valid JSON document or any *`path`* argument is not a valid path expression or contains a `*` or `**` wildcard or does not end with an array element identifier.

  The path-value pairs are evaluated left to right. The document produced by evaluating one pair becomes the new value against which the next pair is evaluated.

  Pairs for which the path does not identify any array in the JSON document are ignored. If a path identifies an array element, the corresponding value is inserted at that element position, shifting any following values to the right. If a path identifies an array position past the end of an array, the value is inserted at the end of the array.

  ```
  mysql> SET @j = '["a", {"b": [1, 2]}, [3, 4';
  mysql> SELECT JSON_ARRAY_INSERT(@j, '$[1]', 'x');
  +------------------------------------+
  | JSON_ARRAY_INSERT(@j, '$[1]', 'x') |
  +------------------------------------+
  | ["a", "x", {"b": [1, 2]}, [3, 4  |
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
  | ["a", {"b": ["x", 1, 2]}, [3, 4       |
  +-----------------------------------------+
  mysql> SELECT JSON_ARRAY_INSERT(@j, '$[2][1]', 'y');
  +---------------------------------------+
  | JSON_ARRAY_INSERT(@j, '$[2][1]', 'y') |
  +---------------------------------------+
  | ["a", {"b": [1, 2]}, [3, "y", 4     |
  +---------------------------------------+
  mysql> SELECT JSON_ARRAY_INSERT(@j, '$[0]', 'x', '$[2][1]', 'y');
  +----------------------------------------------------+
  | JSON_ARRAY_INSERT(@j, '$[0]', 'x', '$[2][1]', 'y') |
  +----------------------------------------------------+
  | ["x", "a", {"b": [1, 2]}, [3, 4                  |
  +----------------------------------------------------+
  ```

  Earlier modifications affect the positions of the following elements in the array, so subsequent paths in the same `JSON_ARRAY_INSERT()` call should take this into account. In the final example, the second path inserts nothing because the path no longer matches anything after the first insert.

* `JSON_INSERT(json_doc, path, val[, path, val] ...)`

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

* `JSON_MERGE(json_doc, json_doc[, json_doc] ...)`

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

* `JSON_MERGE_PATCH(json_doc, json_doc[, json_doc] ...)`

  Performs an RFC 7396 compliant merge of two or more JSON documents and returns the merged result, without preserving members having duplicate keys. Raises an error if at least one of the documents passed as arguments to this function is not valid.

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

* `JSON_MERGE_PRESERVE(json_doc, json_doc[, json_doc] ...)`

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

* `JSON_REMOVE(json_doc, path[, path] ...)`

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

* `JSON_REPLACE(json_doc, path, val[, path, val] ...)`

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

* `JSON_SET(json_doc, path, val[, path, val] ...)`

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

  <table><thead><tr> <th>Escape Sequence</th> <th>Character Represented by Sequence</th> </tr></thead><tbody><tr> <td><code>\"</code></td> <td>A double quote (<code>"</code>) character</td> </tr><tr> <td><code>\b</code></td> <td>A backspace character</td> </tr><tr> <td><code>\f</code></td> <td>A formfeed character</td> </tr><tr> <td><code>\n</code></td> <td>A newline (linefeed) character</td> </tr><tr> <td><code>\r</code></td> <td>A carriage return character</td> </tr><tr> <td><code>\t</code></td> <td>A tab character</td> </tr><tr> <td><code>\\</code></td> <td>A backslash (<code>\</code>) character</td> </tr><tr> <td><code>\u<em class="replaceable"><code>XXXX</code></em></code></td> <td>UTF-8 bytes for Unicode value <em class="replaceable"><code>XXXX</code></em></td> </tr></tbody></table>

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
