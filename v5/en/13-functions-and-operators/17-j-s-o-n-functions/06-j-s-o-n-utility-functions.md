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
  | [100, "json", 10, 20, 30], 3, 5], 425.05] |   56 |
  +---------------------------------------------+------+
  1 row in set (0.00 sec)
  ```

  For a JSON literal, this function also returns the current storage space used, as shown here:

  ```sql
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

  This function was added in MySQL 5.7.22.
