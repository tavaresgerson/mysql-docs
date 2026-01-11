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
  | [100, "json", 10, 20, 30], 3, 5], 425.05] |   56 |
  +---------------------------------------------+------+
  1 row in set (0.00 sec)
  ```

  For a JSON literal, this function always returns the current storage space used:

  ```
  mysql> SELECT
      ->     JSON_STORAGE_SIZE('[100, "sakila", [1, 3, 5], 425.05]') AS A,
      ->     JSON_STORAGE_SIZE('{"a": 1000, "b": "a", "c": "[1, 3, 5, 7]"}') AS B,
      ->     JSON_STORAGE_SIZE('{"a": 1000, "b": "wxyz", "c": "[1, 3, 5, 7]"}') AS C,
      ->     JSON_STORAGE_SIZE('[100, "json", 10, 20, 30], 3, 5], 425.05]') AS D;
  +----+----+----+----+
  | A  | B  | C  | D  |
  +----+----+----+----+
  | 45 | 44 | 47 | 56 |
  +----+----+----+----+
  1 row in set (0.00 sec)
  ```
