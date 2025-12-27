## 14.21 Vector Functions

MySQL 9.5 supports SQL functions to work with `VECTOR` values. These functions are described in this section.

**Table 14.31 Vector Functions**

<table frame="box" rules="all" summary="A reference that lists vector functions."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Description</th> </tr></thead><tbody><tr><td><a class="link" href="vector-functions.html#function_distance"><code class="literal">DISTANCE()</code></a></td> <td> Calculates the distance between two vectors per the specified method </td> </tr><tr><td><a class="link" href="vector-functions.html#function_string-to-vector"><code class="literal">STRING_TO_VECTOR()</code></a></td> <td> Get the binary value of the VECTOR column represented by a conforming string </td> </tr><tr><td><a class="link" href="vector-functions.html#function_vector-dim"><code class="literal">VECTOR_DIM()</code></a></td> <td> Get the length of a vector (that is, the number of entries it contains) </td> </tr><tr><td><a class="link" href="vector-functions.html#function_vector-to-string"><code class="literal">VECTOR_TO_STRING()</code></a></td> <td> Get the string representation of a VECTOR column, given its value as a binary string </td> </tr></tbody></table>

* `DISTANCE(vector, vector, string)`

  Calculates the distance between two vectors per the specified calculation method. It accepts the following arguments:

  + A column of `VECTOR` data type.
  + An input query of `VECTOR` data type.
  + A string that specifies the distance metric. The supported values are `COSINE`, `DOT`, and `EUCLIDEAN`. Since the argument is a string, it must be quoted.

  `VECTOR_DISTANCE` is a synonym for this function.

  Examples:

  ```
  mysql> SELECT DISTANCE(STRING_TO_VECTOR("[1.01231, 2.0123123, 3.0123123, 4.01231231]"), STRING_TO_VECTOR("[1, 2, 3, 4]"), "COSINE");
  +-----------------------------------------------------------------------------------------------------------------------+
  | DISTANCE(STRING_TO_VECTOR("[1.01231, 2.0123123, 3.0123123, 4.01231231]"), STRING_TO_VECTOR("[1, 2, 3, 4]"), "COSINE") |
  +-----------------------------------------------------------------------------------------------------------------------+
  |                                                                                              0.0000016689300537109375 |
  +-----------------------------------------------------------------------------------------------------------------------+
  ```

  Note

  `DISTANCE()` is available only for users of MySQL HeatWave on OCI and MySQL AI; it is not included in MySQL Commercial or Community distributions.

* `STRING_TO_VECTOR(string)`

  Converts a string representation of a vector to a binary one. The expected format of the string consists of a list one or more comma-separated float values, encased in square brackets (`[` `]`). Values may be expressed using decimal or scientific notation. Since the argument is a string, it must be quoted.

  `TO_VECTOR()` is a synonym for this function.

  Examples:

  ```
  mysql> SELECT STRING_TO_VECTOR("[1.05, -17.8, 32]");
  +---------------------------------------+
  | STRING_TO_VECTOR("[1.05, -17.8, 32]") |
  +---------------------------------------+
  | 0x6666863F66668EC100000042            |
  +---------------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT TO_VECTOR("[1.05, -17.8, 32, 123.456]");
  +-----------------------------------------+
  | TO_VECTOR("[1.05, -17.8, 32, 123.456]") |
  +-----------------------------------------+
  | 0x6666863F66668EC10000004279E9F642      |
  +-----------------------------------------+
  1 row in set (0.00 sec)
  ```

  `VECTOR_TO_STRING()` is the inverse of this function:

  ```
  mysql> SELECT VECTOR_TO_STRING(STRING_TO_VECTOR("[1.05, -17.8, 32]"));
  +---------------------------------------------------------+
  | VECTOR_TO_STRING(STRING_TO_VECTOR("[1.05, -17.8, 32]")) |
  +---------------------------------------------------------+
  | [1.05000e+00,-1.78000e+01,3.20000e+01]                  |
  +---------------------------------------------------------+
  1 row in set (0.00 sec)
  ```

  All whitespace characters in such values—following numbers, preceding or following square brackets, or any combination of these—are trimmed before being used.

* `VECTOR_DIM(vector)`

  Given a `VECTOR` column value, this function returns the number of entries the vector contains.

  Example:

  ```
  mysql> SELECT VECTOR_DIM(0x0040004000800080);
  +--------------------------------+
  | VECTOR_DIM(0x0040004000800080) |
  +--------------------------------+
  |                              2 |
  +--------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT VECTOR_DIM(TO_VECTOR('[2, 3, 5]') );
  +-------------------------------------+
  | VECTOR_DIM(TO_VECTOR('[2, 3, 5]') ) |
  +-------------------------------------+
  |                                   3 |
  +-------------------------------------+
  1 row in set (0.00 sec)
  ```

  An argument to this function that cannot be parsed as a vector value raises an error.

* `VECTOR_TO_STRING(vector)`

  Given the binary representation of a `VECTOR` column value, this function returns its string representation, which is in the same format as described for the argument of the `STRING_TO_VECTOR()` function.

  `FROM_VECTOR()` is accepted as a synonym for this function.

  Examples:

  ```
  mysql> SELECT VECTOR_TO_STRING(0x00000040000040400000A0400000E040);
  +------------------------------------------------------+
  | VECTOR_TO_STRING(0x00000040000040400000A0400000E040) |
  +------------------------------------------------------+
  | [2.00000e+00,3.00000e+00,5.00000e+00,7.00000e+00]    |
  +------------------------------------------------------+
  1 row in set (0.00 sec)

  mysql> SELECT FROM_VECTOR(0x00000040000040400000A040);
  +-----------------------------------------+
  | FROM_VECTOR(0x00000040000040400000A040) |
  +-----------------------------------------+
  | [2.00000e+00,3.00000e+00,5.00000e+00]   |
  +-----------------------------------------+
  1 row in set (0.00 sec)
  ```

  An argument to this function that cannot be parsed as a vector value raises an error.

  The maximum size of the output of this function is 262128 (16 \* 16383) bytes.
