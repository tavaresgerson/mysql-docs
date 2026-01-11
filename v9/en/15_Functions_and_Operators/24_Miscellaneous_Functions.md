## 14.24 Miscellaneous Functions

**Table 14.34 Miscellaneous Functions**

<table frame="box" rules="all" summary="A reference that lists miscellaneous functions."><thead><tr><th>Name</th> <th>Description</th> </tr></thead><tbody><tr><td><code>ANY_VALUE()</code></td> <td> Suppress ONLY_FULL_GROUP_BY value rejection </td> </tr><tr><td><code>BIN_TO_UUID()</code></td> <td> Convert binary UUID to string </td> </tr><tr><td><code>DEFAULT()</code></td> <td> Return the default value for a table column </td> </tr><tr><td><code>ETAG()</code></td> <td> Compute hash for each row, using one or more column or other values </td> </tr><tr><td><code>GROUPING()</code></td> <td> Distinguish super-aggregate ROLLUP rows from regular rows </td> </tr><tr><td><code>INET_ATON()</code></td> <td> Return the numeric value of an IP address </td> </tr><tr><td><code>INET_NTOA()</code></td> <td> Return the IP address from a numeric value </td> </tr><tr><td><code>IS_UUID()</code></td> <td> Whether argument is a valid UUID </td> </tr><tr><td><code>NAME_CONST()</code></td> <td> Cause the column to have the given name </td> </tr><tr><td><code>SLEEP()</code></td> <td> Sleep for a number of seconds </td> </tr><tr><td><code>UUID()</code></td> <td> Return a Universal Unique Identifier (UUID) </td> </tr><tr><td><code>UUID_SHORT()</code></td> <td> Return an integer-valued universal identifier </td> </tr><tr><td><code>UUID_TO_BIN()</code></td> <td> Convert string UUID to binary </td> </tr><tr><td><code>VALUES()</code></td> <td> Define the values to be used during an INSERT </td> </tr></tbody></table>

* `ANY_VALUE(arg)`

  This function is useful for `GROUP BY` queries when the `ONLY_FULL_GROUP_BY` SQL mode is enabled, for cases when MySQL rejects a query that you know is valid for reasons that MySQL cannot determine. The function return value and type are the same as the return value and type of its argument, but the function result is not checked for the `ONLY_FULL_GROUP_BY` SQL mode.

  For example, if `name` is a nonindexed column, the following query fails with `ONLY_FULL_GROUP_BY` enabled:

  ```
  mysql> SELECT name, address, MAX(age) FROM t GROUP BY name;
  ERROR 1055 (42000): Expression #2 of SELECT list is not in GROUP
  BY clause and contains nonaggregated column 'mydb.t.address' which
  is not functionally dependent on columns in GROUP BY clause; this
  is incompatible with sql_mode=only_full_group_by
  ```

  The failure occurs because `address` is a nonaggregated column that is neither named among `GROUP BY` columns nor functionally dependent on them. As a result, the `address` value for rows within each `name` group is nondeterministic. There are multiple ways to cause MySQL to accept the query:

  + Alter the table to make `name` a primary key or a unique `NOT NULL` column. This enables MySQL to determine that `address` is functionally dependent on `name`; that is, `address` is uniquely determined by `name`. (This technique is inapplicable if `NULL` must be permitted as a valid `name` value.)

  + Use `ANY_VALUE()` to refer to `address`:

    ```
    SELECT name, ANY_VALUE(address), MAX(age) FROM t GROUP BY name;
    ```

    In this case, MySQL ignores the nondeterminism of `address` values within each `name` group and accepts the query. This may be useful if you simply do not care which value of a nonaggregated column is chosen for each group. `ANY_VALUE()` is not an aggregate function, unlike functions such as `SUM()` or `COUNT()`. It simply acts to suppress the test for nondeterminism.

  + Disable `ONLY_FULL_GROUP_BY`. This is equivalent to using `ANY_VALUE()` with `ONLY_FULL_GROUP_BY` enabled, as described in the previous item.

  `ANY_VALUE()` is also useful if functional dependence exists between columns but MySQL cannot determine it. The following query is valid because `age` is functionally dependent on the grouping column `age-1`, but MySQL cannot tell that and rejects the query with `ONLY_FULL_GROUP_BY` enabled:

  ```
  SELECT age FROM t GROUP BY age-1;
  ```

  To cause MySQL to accept the query, use `ANY_VALUE()`:

  ```
  SELECT ANY_VALUE(age) FROM t GROUP BY age-1;
  ```

  `ANY_VALUE()` can be used for queries that refer to aggregate functions in the absence of a `GROUP BY` clause:

  ```
  mysql> SELECT name, MAX(age) FROM t;
  ERROR 1140 (42000): In aggregated query without GROUP BY, expression
  #1 of SELECT list contains nonaggregated column 'mydb.t.name'; this
  is incompatible with sql_mode=only_full_group_by
  ```

  Without `GROUP BY`, there is a single group and it is nondeterministic which `name` value to choose for the group. `ANY_VALUE()` tells MySQL to accept the query:

  ```
  SELECT ANY_VALUE(name), MAX(age) FROM t;
  ```

  It may be that, due to some property of a given data set, you know that a selected nonaggregated column is effectively functionally dependent on a `GROUP BY` column. For example, an application may enforce uniqueness of one column with respect to another. In this case, using `ANY_VALUE()` for the effectively functionally dependent column may make sense.

  For additional discussion, see Section 14.19.3, “MySQL Handling of GROUP BY”.

* `BIN_TO_UUID(binary_uuid)`, `BIN_TO_UUID(binary_uuid, swap_flag)`

  `BIN_TO_UUID()` is the inverse of `UUID_TO_BIN()`. It converts a binary UUID to a string UUID and returns the result. The binary value should be a UUID as a `VARBINARY(16)` value. The return value is a string of five hexadecimal numbers separated by dashes. (For details about this format, see the `UUID()` function description.) If the UUID argument is `NULL`, the return value is `NULL`. If any argument is invalid, an error occurs.

  `BIN_TO_UUID()` takes one or two arguments:

  + The one-argument form takes a binary UUID value. The UUID value is assumed not to have its time-low and time-high parts swapped. The string result is in the same order as the binary argument.

  + The two-argument form takes a binary UUID value and a swap-flag value:

    - If *`swap_flag`* is 0, the two-argument form is equivalent to the one-argument form. The string result is in the same order as the binary argument.

    - If *`swap_flag`* is 1, the UUID value is assumed to have its time-low and time-high parts swapped. These parts are swapped back to their original position in the result value.

  For usage examples and information about time-part swapping, see the `UUID_TO_BIN()` function description.

* `DEFAULT(col_name)`

  Returns the default value for a table column. An error results if the column has no default value.

  The use of `DEFAULT(col_name)` to specify the default value for a named column is permitted only for columns that have a literal default value, not for columns that have an expression default value.

  ```
  mysql> UPDATE t SET i = DEFAULT(i)+1 WHERE id < 100;
  ```

* [`ETAG(col [, col[, ...)`](miscellaneous-functions.html#function_etag)

  Computes a 128-bit hash for each row, given a comma-separated list of one or more column values. An item in this list can be a column name, a constant value, or an expression, and can be `NULL`.

  `VECTOR` and `GEOMETRY` columns are not supported by this function; trying to reference a column of either type raises an error .

  The ordering of items in the argument list does not affect the function's return value.

  For more information, see Section 27.7, “JSON Duality Views”.

* `FORMAT(X,D)`

  Formats the number *`X`* to a format like `'#,###,###.##'`, rounded to *`D`* decimal places, and returns the result as a string. For details, see Section 14.8, “String Functions and Operators”.

* `GROUPING(expr [, expr] ...)`

  For `GROUP BY` queries that include a `WITH ROLLUP` modifier, the `ROLLUP` operation produces super-aggregate output rows where `NULL` represents the set of all values. The `GROUPING()` function enables you to distinguish `NULL` values for super-aggregate rows from `NULL` values in regular grouped rows.

  `GROUPING()` is permitted in the select list, `HAVING` clause, and `ORDER BY` clause.

  Each argument to `GROUPING()` must be an expression that exactly matches an expression in the `GROUP BY` clause. The expression cannot be a positional specifier. For each expression, `GROUPING()` produces 1 if the expression value in the current row is a `NULL` representing a super-aggregate value. Otherwise, `GROUPING()` produces 0, indicating that the expression value is a `NULL` for a regular result row or is not `NULL`.

  Suppose that table `t1` contains these rows, where `NULL` indicates something like “other” or “unknown”:

  ```
  mysql> SELECT * FROM t1;
  +------+-------+----------+
  | name | size  | quantity |
  +------+-------+----------+
  | ball | small |       10 |
  | ball | large |       20 |
  | ball | NULL  |        5 |
  | hoop | small |       15 |
  | hoop | large |        5 |
  | hoop | NULL  |        3 |
  +------+-------+----------+
  ```

  A summary of the table without `WITH ROLLUP` looks like this:

  ```
  mysql> SELECT name, size, SUM(quantity) AS quantity
         FROM t1
         GROUP BY name, size;
  +------+-------+----------+
  | name | size  | quantity |
  +------+-------+----------+
  | ball | small |       10 |
  | ball | large |       20 |
  | ball | NULL  |        5 |
  | hoop | small |       15 |
  | hoop | large |        5 |
  | hoop | NULL  |        3 |
  +------+-------+----------+
  ```

  The result contains `NULL` values, but those do not represent super-aggregate rows because the query does not include `WITH ROLLUP`.

  Adding `WITH ROLLUP` produces super-aggregate summary rows containing additional `NULL` values. However, without comparing this result to the previous one, it is not easy to see which `NULL` values occur in super-aggregate rows and which occur in regular grouped rows:

  ```
  mysql> SELECT name, size, SUM(quantity) AS quantity
         FROM t1
         GROUP BY name, size WITH ROLLUP;
  +------+-------+----------+
  | name | size  | quantity |
  +------+-------+----------+
  | ball | NULL  |        5 |
  | ball | large |       20 |
  | ball | small |       10 |
  | ball | NULL  |       35 |
  | hoop | NULL  |        3 |
  | hoop | large |        5 |
  | hoop | small |       15 |
  | hoop | NULL  |       23 |
  | NULL | NULL  |       58 |
  +------+-------+----------+
  ```

  To distinguish `NULL` values in super-aggregate rows from those in regular grouped rows, use `GROUPING()`, which returns 1 only for super-aggregate `NULL` values:

  ```
  mysql> SELECT
           name, size, SUM(quantity) AS quantity,
           GROUPING(name) AS grp_name,
           GROUPING(size) AS grp_size
         FROM t1
         GROUP BY name, size WITH ROLLUP;
  +------+-------+----------+----------+----------+
  | name | size  | quantity | grp_name | grp_size |
  +------+-------+----------+----------+----------+
  | ball | NULL  |        5 |        0 |        0 |
  | ball | large |       20 |        0 |        0 |
  | ball | small |       10 |        0 |        0 |
  | ball | NULL  |       35 |        0 |        1 |
  | hoop | NULL  |        3 |        0 |        0 |
  | hoop | large |        5 |        0 |        0 |
  | hoop | small |       15 |        0 |        0 |
  | hoop | NULL  |       23 |        0 |        1 |
  | NULL | NULL  |       58 |        1 |        1 |
  +------+-------+----------+----------+----------+
  ```

  Common uses for `GROUPING()`:

  + Substitute a label for super-aggregate `NULL` values:

    ```
    mysql> SELECT
             IF(GROUPING(name) = 1, 'All items', name) AS name,
             IF(GROUPING(size) = 1, 'All sizes', size) AS size,
             SUM(quantity) AS quantity
           FROM t1
           GROUP BY name, size WITH ROLLUP;
    +-----------+-----------+----------+
    | name      | size      | quantity |
    +-----------+-----------+----------+
    | ball      | NULL      |        5 |
    | ball      | large     |       20 |
    | ball      | small     |       10 |
    | ball      | All sizes |       35 |
    | hoop      | NULL      |        3 |
    | hoop      | large     |        5 |
    | hoop      | small     |       15 |
    | hoop      | All sizes |       23 |
    | All items | All sizes |       58 |
    +-----------+-----------+----------+
    ```

  + Return only super-aggregate lines by filtering out the regular grouped lines:

    ```
    mysql> SELECT name, size, SUM(quantity) AS quantity
           FROM t1
           GROUP BY name, size WITH ROLLUP
           HAVING GROUPING(name) = 1 OR GROUPING(size) = 1;
    +------+------+----------+
    | name | size | quantity |
    +------+------+----------+
    | ball | NULL |       35 |
    | hoop | NULL |       23 |
    | NULL | NULL |       58 |
    +------+------+----------+
    ```

  `GROUPING()` permits multiple expression arguments. In this case, the `GROUPING()` return value represents a bitmask combined from the results for each expression, where the lowest-order bit corresponds to the result for the rightmost expression. For example, with three expression arguments, `GROUPING(expr1, expr2, expr3)` is evaluated like this:

  ```
    result for GROUPING(expr3)
  + result for GROUPING(expr2) << 1
  + result for GROUPING(expr1) << 2
  ```

  The following query shows how `GROUPING()` results for single arguments combine for a multiple-argument call to produce a bitmask value:

  ```
  mysql> SELECT
           name, size, SUM(quantity) AS quantity,
           GROUPING(name) AS grp_name,
           GROUPING(size) AS grp_size,
         GROUPING(name, size) AS grp_all
         FROM t1
         GROUP BY name, size WITH ROLLUP;
  +------+-------+----------+----------+----------+---------+
  | name | size  | quantity | grp_name | grp_size | grp_all |
  +------+-------+----------+----------+----------+---------+
  | ball | NULL  |        5 |        0 |        0 |       0 |
  | ball | large |       20 |        0 |        0 |       0 |
  | ball | small |       10 |        0 |        0 |       0 |
  | ball | NULL  |       35 |        0 |        1 |       1 |
  | hoop | NULL  |        3 |        0 |        0 |       0 |
  | hoop | large |        5 |        0 |        0 |       0 |
  | hoop | small |       15 |        0 |        0 |       0 |
  | hoop | NULL  |       23 |        0 |        1 |       1 |
  | NULL | NULL  |       58 |        1 |        1 |       3 |
  +------+-------+----------+----------+----------+---------+
  ```

  With multiple expression arguments, the `GROUPING()` return value is nonzero if any expression represents a super-aggregate value. Multiple-argument `GROUPING()` syntax thus provides a simpler way to write the earlier query that returned only super-aggregate rows, by using a single multiple-argument `GROUPING()` call rather than multiple single-argument calls:

  ```
  mysql> SELECT name, size, SUM(quantity) AS quantity
         FROM t1
         GROUP BY name, size WITH ROLLUP
         HAVING GROUPING(name, size) <> 0;
  +------+------+----------+
  | name | size | quantity |
  +------+------+----------+
  | ball | NULL |       35 |
  | hoop | NULL |       23 |
  | NULL | NULL |       58 |
  +------+------+----------+
  ```

  Use of `GROUPING()` is subject to these limitations:

  + Do not use subquery `GROUP BY` expressions as `GROUPING()` arguments because matching might fail. For example, matching fails for this query:

    ```
    mysql> SELECT GROUPING((SELECT MAX(name) FROM t1))
           FROM t1
           GROUP BY (SELECT MAX(name) FROM t1) WITH ROLLUP;
    ERROR 3580 (HY000): Argument #1 of GROUPING function is not in GROUP BY
    ```

  + `GROUP BY` literal expressions should not be used within a `HAVING` clause as `GROUPING()` arguments. Due to differences between when the optimizer evaluates `GROUP BY` and `HAVING`, matching may succeed but `GROUPING()` evaluation does not produce the expected result. Consider this query:

    ```
    SELECT a AS f1, 'w' AS f2
    FROM t
    GROUP BY f1, f2 WITH ROLLUP
    HAVING GROUPING(f2) = 1;
    ```

    `GROUPING()` is evaluated earlier for the literal constant expression than for the `HAVING` clause as a whole and returns 0. To check whether a query such as this is affected, use `EXPLAIN` and look for `Impossible having` in the `Extra` column.

  For more information about `WITH ROLLUP` and `GROUPING()`, see Section 14.19.2, “GROUP BY Modifiers”.

* `INET_ATON(expr)`

  Given the dotted-quad representation of an IPv4 network address as a string, returns an integer that represents the numeric value of the address in network byte order (big endian). `INET_ATON()` returns `NULL` if it does not understand its argument, or if *`expr`* is `NULL`.

  ```
  mysql> SELECT INET_ATON('10.0.5.9');
          -> 167773449
  ```

  For this example, the return value is calculated as 10×2563 + 0×2562 + 5×256 + 9.

  `INET_ATON()` may or may not return a non-`NULL` result for short-form IP addresses (such as `'127.1'` as a representation of `'127.0.0.1'`). Because of this, `INET_ATON()`a should not be used for such addresses.

  Note

  To store values generated by `INET_ATON()`, use an `INT UNSIGNED` column rather than `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), which is signed. If you use a signed column, values corresponding to IP addresses for which the first octet is greater than 127 cannot be stored correctly. See Section 13.1.7, “Out-of-Range and Overflow Handling”.

* `INET_NTOA(expr)`

  Given a numeric IPv4 network address in network byte order, returns the dotted-quad string representation of the address as a string in the connection character set. `INET_NTOA()` returns `NULL` if it does not understand its argument.

  ```
  mysql> SELECT INET_NTOA(167773449);
          -> '10.0.5.9'
  ```

* `INET6_ATON(expr)`

  Given an IPv6 or IPv4 network address as a string, returns a binary string that represents the numeric value of the address in network byte order (big endian). Because numeric-format IPv6 addresses require more bytes than the largest integer type, the representation returned by this function has the `VARBINARY` data type: `VARBINARY(16)` for IPv6 addresses and `VARBINARY(4)` for IPv4 addresses. If the argument is not a valid address, or if it is `NULL`, `INET6_ATON()` returns `NULL`.

  The following examples use `HEX()` to display the `INET6_ATON()` result in printable form:

  ```
  mysql> SELECT HEX(INET6_ATON('fdfe::5a55:caff:fefa:9089'));
          -> 'FDFE0000000000005A55CAFFFEFA9089'
  mysql> SELECT HEX(INET6_ATON('10.0.5.9'));
          -> '0A000509'
  ```

  `INET6_ATON()` observes several constraints on valid arguments. These are given in the following list along with examples.

  + A trailing zone ID is not permitted, as in `fe80::3%1` or `fe80::3%eth0`.

  + A trailing network mask is not permitted, as in `2001:45f:3:ba::/64` or `198.51.100.0/24`.

  + For values representing IPv4 addresses, only classless addresses are supported. Classful addresses such as `198.51.1` are rejected. A trailing port number is not permitted, as in `198.51.100.2:8080`. Hexadecimal numbers in address components are not permitted, as in `198.0xa0.1.2`. Octal numbers are not supported: `198.51.010.1` is treated as `198.51.10.1`, not `198.51.8.1`. These IPv4 constraints also apply to IPv6 addresses that have IPv4 address parts, such as IPv4-compatible or IPv4-mapped addresses.

  To convert an IPv4 address *`expr`* represented in numeric form as an `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") value to an IPv6 address represented in numeric form as a `VARBINARY` value, use this expression:

  ```
  INET6_ATON(INET_NTOA(expr))
  ```

  For example:

  ```
  mysql> SELECT HEX(INET6_ATON(INET_NTOA(167773449)));
          -> '0A000509'
  ```

  If `INET6_ATON()` is invoked from within the **mysql** client, binary strings display using hexadecimal notation, depending on the value of the `--binary-as-hex`. For more information about that option, see Section 6.5.1, “mysql — The MySQL Command-Line Client”.

* `INET6_NTOA(expr)`

  Given an IPv6 or IPv4 network address represented in numeric form as a binary string, returns the string representation of the address as a string in the connection character set. If the argument is not a valid address, or if it is `NULL`, `INET6_NTOA()` returns `NULL`.

  `INET6_NTOA()` has these properties:

  + It does not use operating system functions to perform conversions, thus the output string is platform independent.

  + The return string has a maximum length of 39 (4 x 8 + 7). Given this statement:

    ```
    CREATE TABLE t AS SELECT INET6_NTOA(expr) AS c1;
    ```

    The resulting table would have this definition:

    ```
    CREATE TABLE t (c1 VARCHAR(39) CHARACTER SET utf8mb3 DEFAULT NULL);
    ```

  + The return string uses lowercase letters for IPv6 addresses.

  ```
  mysql> SELECT INET6_NTOA(INET6_ATON('fdfe::5a55:caff:fefa:9089'));
          -> 'fdfe::5a55:caff:fefa:9089'
  mysql> SELECT INET6_NTOA(INET6_ATON('10.0.5.9'));
          -> '10.0.5.9'

  mysql> SELECT INET6_NTOA(UNHEX('FDFE0000000000005A55CAFFFEFA9089'));
          -> 'fdfe::5a55:caff:fefa:9089'
  mysql> SELECT INET6_NTOA(UNHEX('0A000509'));
          -> '10.0.5.9'
  ```

  If `INET6_NTOA()` is invoked from within the **mysql** client, binary strings display using hexadecimal notation, depending on the value of the `--binary-as-hex`. For more information about that option, see Section 6.5.1, “mysql — The MySQL Command-Line Client”.

* `IS_IPV4(expr)`

  Returns 1 if the argument is a valid IPv4 address specified as a string, 0 otherwise. Returns `NULL` if *`expr`* is `NULL`.

  ```
  mysql> SELECT IS_IPV4('10.0.5.9'), IS_IPV4('10.0.5.256');
          -> 1, 0
  ```

  For a given argument, if `IS_IPV4()` returns 1, `INET_ATON()` (and `INET6_ATON()`) returns non-`NULL`. The converse statement is not true: In some cases, `INET_ATON()` returns non-`NULL` when `IS_IPV4()` returns 0.

  As implied by the preceding remarks, `IS_IPV4()` is more strict than `INET_ATON()` about what constitutes a valid IPv4 address, so it may be useful for applications that need to perform strong checks against invalid values. Alternatively, use `INET6_ATON()` to convert IPv4 addresses to internal form and check for a `NULL` result (which indicates an invalid address). `INET6_ATON()` is equally strong as `IS_IPV4()` about checking IPv4 addresses.

* `IS_IPV4_COMPAT(expr)`

  This function takes an IPv6 address represented in numeric form as a binary string, as returned by `INET6_ATON()`. It returns 1 if the argument is a valid IPv4-compatible IPv6 address, 0 otherwise (unless *`expr`* is `NULL`, in which case the function returns `NULL`). IPv4-compatible addresses have the form `::ipv4_address`.

  ```
  mysql> SELECT IS_IPV4_COMPAT(INET6_ATON('::10.0.5.9'));
          -> 1
  mysql> SELECT IS_IPV4_COMPAT(INET6_ATON('::ffff:10.0.5.9'));
          -> 0
  ```

  The IPv4 part of an IPv4-compatible address can also be represented using hexadecimal notation. For example, `198.51.100.1` has this raw hexadecimal value:

  ```
  mysql> SELECT HEX(INET6_ATON('198.51.100.1'));
          -> 'C6336401'
  ```

  Expressed in IPv4-compatible form, `::198.51.100.1` is equivalent to `::c0a8:0001` or (without leading zeros) `::c0a8:1`

  ```
  mysql> SELECT
      ->   IS_IPV4_COMPAT(INET6_ATON('::198.51.100.1')),
      ->   IS_IPV4_COMPAT(INET6_ATON('::c0a8:0001')),
      ->   IS_IPV4_COMPAT(INET6_ATON('::c0a8:1'));
          -> 1, 1, 1
  ```

* `IS_IPV4_MAPPED(expr)`

  This function takes an IPv6 address represented in numeric form as a binary string, as returned by `INET6_ATON()`. It returns 1 if the argument is a valid IPv4-mapped IPv6 address, 0 otherwise, unless *`expr`* is `NULL`, in which case the function returns `NULL`. IPv4-mapped addresses have the form `::ffff:ipv4_address`.

  ```
  mysql> SELECT IS_IPV4_MAPPED(INET6_ATON('::10.0.5.9'));
          -> 0
  mysql> SELECT IS_IPV4_MAPPED(INET6_ATON('::ffff:10.0.5.9'));
          -> 1
  ```

  As with `IS_IPV4_COMPAT()` the IPv4 part of an IPv4-mapped address can also be represented using hexadecimal notation:

  ```
  mysql> SELECT
      ->   IS_IPV4_MAPPED(INET6_ATON('::ffff:198.51.100.1')),
      ->   IS_IPV4_MAPPED(INET6_ATON('::ffff:c0a8:0001')),
      ->   IS_IPV4_MAPPED(INET6_ATON('::ffff:c0a8:1'));
          -> 1, 1, 1
  ```

* `IS_IPV6(expr)`

  Returns 1 if the argument is a valid IPv6 address specified as a string, 0 otherwise, unless *`expr`* is `NULL`, in which case the function returns `NULL`. This function does not consider IPv4 addresses to be valid IPv6 addresses.

  ```
  mysql> SELECT IS_IPV6('10.0.5.9'), IS_IPV6('::1');
          -> 0, 1
  ```

  For a given argument, if `IS_IPV6()` returns 1, `INET6_ATON()` returns non-`NULL`.

* `IS_UUID(string_uuid)`

  Returns 1 if the argument is a valid string-format UUID, 0 if the argument is not a valid UUID, and `NULL` if the argument is `NULL`.

  “Valid” means that the value is in a format that can be parsed. That is, it has the correct length and contains only the permitted characters (hexadecimal digits in any lettercase and, optionally, dashes and curly braces). This format is most common:

  ```
  aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee
  ```

  These other formats are also permitted:

  ```
  aaaaaaaabbbbccccddddeeeeeeeeeeee
  {aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee}
  ```

  For the meanings of fields within the value, see the `UUID()` function description.

  ```
  mysql> SELECT IS_UUID('6ccd780c-baba-1026-9564-5b8c656024db');
  +-------------------------------------------------+
  | IS_UUID('6ccd780c-baba-1026-9564-5b8c656024db') |
  +-------------------------------------------------+
  |                                               1 |
  +-------------------------------------------------+
  mysql> SELECT IS_UUID('6CCD780C-BABA-1026-9564-5B8C656024DB');
  +-------------------------------------------------+
  | IS_UUID('6CCD780C-BABA-1026-9564-5B8C656024DB') |
  +-------------------------------------------------+
  |                                               1 |
  +-------------------------------------------------+
  mysql> SELECT IS_UUID('6ccd780cbaba102695645b8c656024db');
  +---------------------------------------------+
  | IS_UUID('6ccd780cbaba102695645b8c656024db') |
  +---------------------------------------------+
  |                                           1 |
  +---------------------------------------------+
  mysql> SELECT IS_UUID('{6ccd780c-baba-1026-9564-5b8c656024db}');
  +---------------------------------------------------+
  | IS_UUID('{6ccd780c-baba-1026-9564-5b8c656024db}') |
  +---------------------------------------------------+
  |                                                 1 |
  +---------------------------------------------------+
  mysql> SELECT IS_UUID('6ccd780c-baba-1026-9564-5b8c6560');
  +---------------------------------------------+
  | IS_UUID('6ccd780c-baba-1026-9564-5b8c6560') |
  +---------------------------------------------+
  |                                           0 |
  +---------------------------------------------+
  mysql> SELECT IS_UUID(RAND());
  +-----------------+
  | IS_UUID(RAND()) |
  +-----------------+
  |               0 |
  +-----------------+
  ```

* `NAME_CONST(name,value)`

  Returns the given value. When used to produce a result set column, `NAME_CONST()` causes the column to have the given name. The arguments should be constants.

  ```
  mysql> SELECT NAME_CONST('myname', 14);
  +--------+
  | myname |
  +--------+
  |     14 |
  +--------+
  ```

  This function is for internal use only. The server uses it when writing statements from stored programs that contain references to local program variables, as described in Section 27.9, “Stored Program Binary Logging”. You might see this function in the output from **mysqlbinlog**.

  For your applications, you can obtain exactly the same result as in the example just shown by using simple aliasing, like this:

  ```
  mysql> SELECT 14 AS myname;
  +--------+
  | myname |
  +--------+
  |     14 |
  +--------+
  1 row in set (0.00 sec)
  ```

  See Section 15.2.13, “SELECT Statement”, for more information about column aliases.

* `SLEEP(duration)`

  Sleeps (pauses) for the number of seconds given by the *`duration`* argument, then returns 0. The duration may have a fractional part. If the argument is `NULL` or negative, `SLEEP()` produces a warning, or an error in strict SQL mode.

  When sleep returns normally (without interruption), it returns 0:

  ```
  mysql> SELECT SLEEP(1000);
  +-------------+
  | SLEEP(1000) |
  +-------------+
  |           0 |
  +-------------+
  ```

  When `SLEEP()` is the only thing invoked by a query that is interrupted, it returns 1 and the query itself returns no error. This is true whether the query is killed or times out:

  + This statement is interrupted using `KILL QUERY` from another session:

    ```
    mysql> SELECT SLEEP(1000);
    +-------------+
    | SLEEP(1000) |
    +-------------+
    |           1 |
    +-------------+
    ```

  + This statement is interrupted by timing out:

    ```
    mysql> SELECT /*+ MAX_EXECUTION_TIME(1) */ SLEEP(1000);
    +-------------+
    | SLEEP(1000) |
    +-------------+
    |           1 |
    +-------------+
    ```

  When `SLEEP()` is only part of a query that is interrupted, the query returns an error:

  + This statement is interrupted using `KILL QUERY` from another session:

    ```
    mysql> SELECT 1 FROM t1 WHERE SLEEP(1000);
    ERROR 1317 (70100): Query execution was interrupted
    ```

  + This statement is interrupted by timing out:

    ```
    mysql> SELECT /*+ MAX_EXECUTION_TIME(1000) */ 1 FROM t1 WHERE SLEEP(1000);
    ERROR 3024 (HY000): Query execution was interrupted, maximum statement
    execution time exceeded
    ```

  This function is unsafe for statement-based replication. A warning is logged if you use this function when `binlog_format` is set to `STATEMENT`.

* `UUID()`

  Returns a Universal Unique Identifier (UUID) generated according to RFC 4122, “A Universally Unique IDentifier (UUID) URN Namespace” (<http://www.ietf.org/rfc/rfc4122.txt>).

  A UUID is designed as a number that is globally unique in space and time. Two calls to `UUID()` are expected to generate two different values, even if these calls are performed on two separate devices not connected to each other.

  Warning

  Although `UUID()` values are intended to be unique, they are not necessarily unguessable or unpredictable. If unpredictability is required, UUID values should be generated some other way.

  `UUID()` returns a value that conforms to UUID version 1 as described in RFC 4122. The value is a 128-bit number represented as a `utf8mb3` string of five hexadecimal numbers in `aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee` format:

  + The first three numbers are generated from the low, middle, and high parts of a timestamp. The high part also includes the UUID version number.

  + The fourth number preserves temporal uniqueness in case the timestamp value loses monotonicity (for example, due to daylight saving time).

  + The fifth number is an IEEE 802 node number that provides spatial uniqueness. A random number is substituted if the latter is not available (for example, because the host device has no Ethernet card, or it is unknown how to find the hardware address of an interface on the host operating system). In this case, spatial uniqueness cannot be guaranteed. Nevertheless, a collision should have *very* low probability.

    The MAC address of an interface is taken into account only on FreeBSD, Linux, and Windows. On other operating systems, MySQL uses a randomly generated 48-bit number.

  ```
  mysql> SELECT UUID();
          -> '6ccd780c-baba-1026-9564-5b8c656024db'
  ```

  To convert between string and binary UUID values, use the `UUID_TO_BIN()` and `BIN_TO_UUID()` functions. To check whether a string is a valid UUID value, use the `IS_UUID()` function.

  This function is unsafe for statement-based replication. A warning is logged if you use this function when `binlog_format` is set to `STATEMENT`.

* `UUID_SHORT()`

  Returns a “short” universal identifier as a 64-bit unsigned integer. Values returned by `UUID_SHORT()` differ from the string-format 128-bit identifiers returned by the `UUID()` function and have different uniqueness properties. The value of `UUID_SHORT()` is guaranteed to be unique if the following conditions hold:

  + The `server_id` value of the current server is between 0 and 255 and is unique among your set of source and replica servers

  + You do not set back the system time for your server host between **mysqld** restarts

  + You invoke `UUID_SHORT()` on average fewer than 16 million times per second between **mysqld** restarts

  The `UUID_SHORT()` return value is constructed this way:

  ```
    (server_id & 255) << 56
  + (server_startup_time_in_seconds << 24)
  + incremented_variable++;
  ```

  ```
  mysql> SELECT UUID_SHORT();
          -> 92395783831158784
  ```

  Note

  `UUID_SHORT()` does not work with statement-based replication.

* `UUID_TO_BIN(string_uuid)`, `UUID_TO_BIN(string_uuid, swap_flag)`

  Converts a string UUID to a binary UUID and returns the result. (The `IS_UUID()` function description lists the permitted string UUID formats.) The return binary UUID is a `VARBINARY(16)` value. If the UUID argument is `NULL`, the return value is `NULL`. If any argument is invalid, an error occurs.

  `UUID_TO_BIN()` takes one or two arguments:

  + The one-argument form takes a string UUID value. The binary result is in the same order as the string argument.

  + The two-argument form takes a string UUID value and a flag value:

    - If *`swap_flag`* is 0, the two-argument form is equivalent to the one-argument form. The binary result is in the same order as the string argument.

    - If *`swap_flag`* is 1, the format of the return value differs: The time-low and time-high parts (the first and third groups of hexadecimal digits, respectively) are swapped. This moves the more rapidly varying part to the right and can improve indexing efficiency if the result is stored in an indexed column.

  Time-part swapping assumes the use of UUID version 1 values, such as are generated by the `UUID()` function. For UUID values produced by other means that do not follow version 1 format, time-part swapping provides no benefit. For details about version 1 format, see the `UUID()` function description.

  Suppose that you have the following string UUID value:

  ```
  mysql> SET @uuid = '6ccd780c-baba-1026-9564-5b8c656024db';
  ```

  To convert the string UUID to binary with or without time-part swapping, use `UUID_TO_BIN()`:

  ```
  mysql> SELECT HEX(UUID_TO_BIN(@uuid));
  +----------------------------------+
  | HEX(UUID_TO_BIN(@uuid))          |
  +----------------------------------+
  | 6CCD780CBABA102695645B8C656024DB |
  +----------------------------------+
  mysql> SELECT HEX(UUID_TO_BIN(@uuid, 0));
  +----------------------------------+
  | HEX(UUID_TO_BIN(@uuid, 0))       |
  +----------------------------------+
  | 6CCD780CBABA102695645B8C656024DB |
  +----------------------------------+
  mysql> SELECT HEX(UUID_TO_BIN(@uuid, 1));
  +----------------------------------+
  | HEX(UUID_TO_BIN(@uuid, 1))       |
  +----------------------------------+
  | 1026BABA6CCD780C95645B8C656024DB |
  +----------------------------------+
  ```

  To convert a binary UUID returned by `UUID_TO_BIN()` to a string UUID, use `BIN_TO_UUID()`. If you produce a binary UUID by calling `UUID_TO_BIN()` with a second argument of 1 to swap time parts, you should also pass a second argument of 1 to `BIN_TO_UUID()` to unswap the time parts when converting the binary UUID back to a string UUID:

  ```
  mysql> SELECT BIN_TO_UUID(UUID_TO_BIN(@uuid));
  +--------------------------------------+
  | BIN_TO_UUID(UUID_TO_BIN(@uuid))      |
  +--------------------------------------+
  | 6ccd780c-baba-1026-9564-5b8c656024db |
  +--------------------------------------+
  mysql> SELECT BIN_TO_UUID(UUID_TO_BIN(@uuid,0),0);
  +--------------------------------------+
  | BIN_TO_UUID(UUID_TO_BIN(@uuid,0),0)  |
  +--------------------------------------+
  | 6ccd780c-baba-1026-9564-5b8c656024db |
  +--------------------------------------+
  mysql> SELECT BIN_TO_UUID(UUID_TO_BIN(@uuid,1),1);
  +--------------------------------------+
  | BIN_TO_UUID(UUID_TO_BIN(@uuid,1),1)  |
  +--------------------------------------+
  | 6ccd780c-baba-1026-9564-5b8c656024db |
  +--------------------------------------+
  ```

  If the use of time-part swapping is not the same for the conversion in both directions, the original UUID is not recovered properly:

  ```
  mysql> SELECT BIN_TO_UUID(UUID_TO_BIN(@uuid,0),1);
  +--------------------------------------+
  | BIN_TO_UUID(UUID_TO_BIN(@uuid,0),1)  |
  +--------------------------------------+
  | baba1026-780c-6ccd-9564-5b8c656024db |
  +--------------------------------------+
  mysql> SELECT BIN_TO_UUID(UUID_TO_BIN(@uuid,1),0);
  +--------------------------------------+
  | BIN_TO_UUID(UUID_TO_BIN(@uuid,1),0)  |
  +--------------------------------------+
  | 1026baba-6ccd-780c-9564-5b8c656024db |
  +--------------------------------------+
  ```

  If `UUID_TO_BIN()` is invoked from within the **mysql** client, binary strings display using hexadecimal notation, depending on the value of the `--binary-as-hex`. For more information about that option, see Section 6.5.1, “mysql — The MySQL Command-Line Client”.

* `VALUES(col_name)`

  In an `INSERT ... ON DUPLICATE KEY UPDATE` statement, you can use the `VALUES(col_name)` function in the `UPDATE` clause to refer to column values from the `INSERT` portion of the statement. In other words, `VALUES(col_name)` in the `UPDATE` clause refers to the value of *`col_name`* that would be inserted, had no duplicate-key conflict occurred. This function is especially useful in multiple-row inserts. The `VALUES()` function is meaningful only in the `ON DUPLICATE KEY UPDATE` clause of `INSERT` statements and returns `NULL` otherwise. See Section 15.2.7.2, “INSERT ... ON DUPLICATE KEY UPDATE Statement”.

  ```
  mysql> INSERT INTO table (a,b,c) VALUES (1,2,3),(4,5,6)
      -> ON DUPLICATE KEY UPDATE c=VALUES(a)+VALUES(b);
  ```

  Important

  This usage is deprecated, and subject to removal in a future release of MySQL. Use a row alias, or row and column aliases, instead. For more information and examples, see Section 15.2.7.2, “INSERT ... ON DUPLICATE KEY UPDATE Statement”.
