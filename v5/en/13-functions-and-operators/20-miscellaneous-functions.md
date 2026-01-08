## 12.20 Miscellaneous Functions

**Table 12.26 Miscellaneous Functions**

<table frame="box" rules="all" summary="A reference that lists miscellaneous functions."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Description</th> </tr></thead><tbody><tr><td><a class="link" href="miscellaneous-functions.html#function_any-value"><code>ANY_VALUE()</code></a></td> <td> Suppress ONLY_FULL_GROUP_BY value rejection </td> </tr><tr><td><a class="link" href="miscellaneous-functions.html#function_default"><code>DEFAULT()</code></a></td> <td> Return the default value for a table column </td> </tr><tr><td><a class="link" href="miscellaneous-functions.html#function_inet-aton"><code>INET_ATON()</code></a></td> <td> Return the numeric value of an IP address </td> </tr><tr><td><a class="link" href="miscellaneous-functions.html#function_inet-ntoa"><code>INET_NTOA()</code></a></td> <td> Return the IP address from a numeric value </td> </tr><tr><td><a class="link" href="miscellaneous-functions.html#function_inet6-aton"><code>INET6_ATON()</code></a></td> <td> Return the numeric value of an IPv6 address </td> </tr><tr><td><a class="link" href="miscellaneous-functions.html#function_inet6-ntoa"><code>INET6_NTOA()</code></a></td> <td> Return the IPv6 address from a numeric value </td> </tr><tr><td><a class="link" href="miscellaneous-functions.html#function_is-ipv4"><code>IS_IPV4()</code></a></td> <td> Whether argument is an IPv4 address </td> </tr><tr><td><a class="link" href="miscellaneous-functions.html#function_is-ipv4-compat"><code>IS_IPV4_COMPAT()</code></a></td> <td> Whether argument is an IPv4-compatible address </td> </tr><tr><td><a class="link" href="miscellaneous-functions.html#function_is-ipv4-mapped"><code>IS_IPV4_MAPPED()</code></a></td> <td> Whether argument is an IPv4-mapped address </td> </tr><tr><td><a class="link" href="miscellaneous-functions.html#function_is-ipv6"><code>IS_IPV6()</code></a></td> <td> Whether argument is an IPv6 address </td> </tr><tr><td><a class="link" href="miscellaneous-functions.html#function_name-const"><code>NAME_CONST()</code></a></td> <td> Cause the column to have the given name </td> </tr><tr><td><a class="link" href="miscellaneous-functions.html#function_sleep"><code>SLEEP()</code></a></td> <td> Sleep for a number of seconds </td> </tr><tr><td><a class="link" href="miscellaneous-functions.html#function_uuid"><code>UUID()</code></a></td> <td> Return a Universal Unique Identifier (UUID) </td> </tr><tr><td><a class="link" href="miscellaneous-functions.html#function_uuid-short"><code>UUID_SHORT()</code></a></td> <td> Return an integer-valued universal identifier </td> </tr><tr><td><a class="link" href="miscellaneous-functions.html#function_values"><code>VALUES()</code></a></td> <td> Define the values to be used during an INSERT </td> </tr></tbody></table>

* `ANY_VALUE(arg)`

  This function is useful for `GROUP BY` queries when the `ONLY_FULL_GROUP_BY` SQL mode is enabled, for cases when MySQL rejects a query that you know is valid for reasons that MySQL cannot determine. The function return value and type are the same as the return value and type of its argument, but the function result is not checked for the `ONLY_FULL_GROUP_BY` SQL mode.

  For example, if `name` is a nonindexed column, the following query fails with `ONLY_FULL_GROUP_BY` enabled:

  ```sql
  mysql> SELECT name, address, MAX(age) FROM t GROUP BY name;
  ERROR 1055 (42000): Expression #2 of SELECT list is not in GROUP
  BY clause and contains nonaggregated column 'mydb.t.address' which
  is not functionally dependent on columns in GROUP BY clause; this
  is incompatible with sql_mode=only_full_group_by
  ```

  The failure occurs because `address` is a nonaggregated column that is neither named among `GROUP BY` columns nor functionally dependent on them. As a result, the `address` value for rows within each `name` group is nondeterministic. There are multiple ways to cause MySQL to accept the query:

  + Alter the table to make `name` a primary key or a unique `NOT NULL` column. This enables MySQL to determine that `address` is functionally dependent on `name`; that is, `address` is uniquely determined by `name`. (This technique is inapplicable if `NULL` must be permitted as a valid `name` value.)

  + Use `ANY_VALUE()` to refer to `address`:

    ```sql
    SELECT name, ANY_VALUE(address), MAX(age) FROM t GROUP BY name;
    ```

    In this case, MySQL ignores the nondeterminism of `address` values within each `name` group and accepts the query. This may be useful if you simply do not care which value of a nonaggregated column is chosen for each group. `ANY_VALUE()` is not an aggregate function, unlike functions such as `SUM()` or `COUNT()`. It simply acts to suppress the test for nondeterminism.

  + Disable `ONLY_FULL_GROUP_BY`. This is equivalent to using `ANY_VALUE()` with `ONLY_FULL_GROUP_BY` enabled, as described in the previous item.

  `ANY_VALUE()` is also useful if functional dependence exists between columns but MySQL cannot determine it. The following query is valid because `age` is functionally dependent on the grouping column `age-1`, but MySQL cannot tell that and rejects the query with `ONLY_FULL_GROUP_BY` enabled:

  ```sql
  SELECT age FROM t GROUP BY age-1;
  ```

  To cause MySQL to accept the query, use `ANY_VALUE()`:

  ```sql
  SELECT ANY_VALUE(age) FROM t GROUP BY age-1;
  ```

  `ANY_VALUE()` can be used for queries that refer to aggregate functions in the absence of a `GROUP BY` clause:

  ```sql
  mysql> SELECT name, MAX(age) FROM t;
  ERROR 1140 (42000): In aggregated query without GROUP BY, expression
  #1 of SELECT list contains nonaggregated column 'mydb.t.name'; this
  is incompatible with sql_mode=only_full_group_by
  ```

  Without `GROUP BY`, there is a single group and it is nondeterministic which `name` value to choose for the group. `ANY_VALUE()` tells MySQL to accept the query:

  ```sql
  SELECT ANY_VALUE(name), MAX(age) FROM t;
  ```

  It may be that, due to some property of a given data set, you know that a selected nonaggregated column is effectively functionally dependent on a `GROUP BY` column. For example, an application may enforce uniqueness of one column with respect to another. In this case, using `ANY_VALUE()` for the effectively functionally dependent column may make sense.

  For additional discussion, see Section 12.19.3, “MySQL Handling of GROUP BY”.

* `DEFAULT(col_name)`

  Returns the default value for a table column. An error results if the column has no default value.

  ```sql
  mysql> UPDATE t SET i = DEFAULT(i)+1 WHERE id < 100;
  ```

* `FORMAT(X,D)`

  Formats the number *`X`* to a format like `'#,###,###.##'`, rounded to *`D`* decimal places, and returns the result as a string. For details, see Section 12.8, “String Functions and Operators”.

* `INET_ATON(expr)`

  Given the dotted-quad representation of an IPv4 network address as a string, returns an integer that represents the numeric value of the address in network byte order (big endian). `INET_ATON()` returns `NULL` if it does not understand its argument.

  ```sql
  mysql> SELECT INET_ATON('10.0.5.9');
          -> 167773449
  ```

  For this example, the return value is calculated as 10×2563 + 0×2562 + 5×256 + 9.

  `INET_ATON()` may or may not return a non-`NULL` result for short-form IP addresses (such as `'127.1'` as a representation of `'127.0.0.1'`). Because of this, `INET_ATON()`a should not be used for such addresses.

  Note

  To store values generated by `INET_ATON()`, use an `INT UNSIGNED` column rather than `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), which is signed. If you use a signed column, values corresponding to IP addresses for which the first octet is greater than 127 cannot be stored correctly. See Section 11.1.7, “Out-of-Range and Overflow Handling”.

* `INET_NTOA(expr)`

  Given a numeric IPv4 network address in network byte order, returns the dotted-quad string representation of the address as a string in the connection character set. `INET_NTOA()` returns `NULL` if it does not understand its argument.

  ```sql
  mysql> SELECT INET_NTOA(167773449);
          -> '10.0.5.9'
  ```

* `INET6_ATON(expr)`

  Given an IPv6 or IPv4 network address as a string, returns a binary string that represents the numeric value of the address in network byte order (big endian). Because numeric-format IPv6 addresses require more bytes than the largest integer type, the representation returned by this function has the `VARBINARY` data type: `VARBINARY(16)` for IPv6 addresses and `VARBINARY(4)` for IPv4 addresses. If the argument is not a valid address, `INET6_ATON()` returns `NULL`.

  The following examples use `HEX()` to display the `INET6_ATON()` result in printable form:

  ```sql
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

  ```sql
  INET6_ATON(INET_NTOA(expr))
  ```

  For example:

  ```sql
  mysql> SELECT HEX(INET6_ATON(INET_NTOA(167773449)));
          -> '0A000509'
  ```

  If `INET6_ATON()` is invoked from within the **mysql** client, binary strings display using hexadecimal notation, depending on the value of the `--binary-as-hex`. For more information about that option, see Section 4.5.1, “mysql — The MySQL Command-Line Client”.

* `INET6_NTOA(expr)`

  Given an IPv6 or IPv4 network address represented in numeric form as a binary string, returns the string representation of the address as a string in the connection character set. If the argument is not a valid address, `INET6_NTOA()` returns `NULL`.

  `INET6_NTOA()` has these properties:

  + It does not use operating system functions to perform conversions, thus the output string is platform independent.

  + The return string has a maximum length of 39 (4 x 8 + 7). Given this statement:

    ```sql
    CREATE TABLE t AS SELECT INET6_NTOA(expr) AS c1;
    ```

    The resulting table would have this definition:

    ```sql
    CREATE TABLE t (c1 VARCHAR(39) CHARACTER SET utf8 DEFAULT NULL);
    ```

  + The return string uses lowercase letters for IPv6 addresses.

  ```sql
  mysql> SELECT INET6_NTOA(INET6_ATON('fdfe::5a55:caff:fefa:9089'));
          -> 'fdfe::5a55:caff:fefa:9089'
  mysql> SELECT INET6_NTOA(INET6_ATON('10.0.5.9'));
          -> '10.0.5.9'

  mysql> SELECT INET6_NTOA(UNHEX('FDFE0000000000005A55CAFFFEFA9089'));
          -> 'fdfe::5a55:caff:fefa:9089'
  mysql> SELECT INET6_NTOA(UNHEX('0A000509'));
          -> '10.0.5.9'
  ```

  If `INET6_NTOA()` is invoked from within the **mysql** client, binary strings display using hexadecimal notation, depending on the value of the `--binary-as-hex`. For more information about that option, see Section 4.5.1, “mysql — The MySQL Command-Line Client”.

* `IS_IPV4(expr)`

  Returns 1 if the argument is a valid IPv4 address specified as a string, 0 otherwise.

  ```sql
  mysql> SELECT IS_IPV4('10.0.5.9'), IS_IPV4('10.0.5.256');
          -> 1, 0
  ```

  For a given argument, if `IS_IPV4()` returns 1, `INET_ATON()` (and `INET6_ATON()`) returns a value that is not `NULL`. The converse statement is not true: In some cases, `INET_ATON()` returns a value other than `NULL` when `IS_IPV4()` returns 0.

  As implied by the preceding remarks, `IS_IPV4()` is more strict than `INET_ATON()` about what constitutes a valid IPv4 address, so it may be useful for applications that need to perform strong checks against invalid values. Alternatively, use `INET6_ATON()` to convert IPv4 addresses to internal form and check for a `NULL` result (which indicates an invalid address). `INET6_ATON()` is equally strong as `IS_IPV4()` about checking IPv4 addresses.

* `IS_IPV4_COMPAT(expr)`

  This function takes an IPv6 address represented in numeric form as a binary string, as returned by `INET6_ATON()`. It returns 1 if the argument is a valid IPv4-compatible IPv6 address, 0 otherwise. IPv4-compatible addresses have the form `::ipv4_address`.

  ```sql
  mysql> SELECT IS_IPV4_COMPAT(INET6_ATON('::10.0.5.9'));
          -> 1
  mysql> SELECT IS_IPV4_COMPAT(INET6_ATON('::ffff:10.0.5.9'));
          -> 0
  ```

  The IPv4 part of an IPv4-compatible address can also be represented using hexadecimal notation. For example, `198.51.100.1` has this raw hexadecimal value:

  ```sql
  mysql> SELECT HEX(INET6_ATON('198.51.100.1'));
          -> 'C6336401'
  ```

  Expressed in IPv4-compatible form, `::198.51.100.1` is equivalent to `::c0a8:0001` or (without leading zeros) `::c0a8:1`

  ```sql
  mysql> SELECT
      ->   IS_IPV4_COMPAT(INET6_ATON('::198.51.100.1')),
      ->   IS_IPV4_COMPAT(INET6_ATON('::c0a8:0001')),
      ->   IS_IPV4_COMPAT(INET6_ATON('::c0a8:1'));
          -> 1, 1, 1
  ```

* `IS_IPV4_MAPPED(expr)`

  This function takes an IPv6 address represented in numeric form as a binary string, as returned by `INET6_ATON()`. It returns 1 if the argument is a valid IPv4-mapped IPv6 address, 0 otherwise. IPv4-mapped addresses have the form `::ffff:ipv4_address`.

  ```sql
  mysql> SELECT IS_IPV4_MAPPED(INET6_ATON('::10.0.5.9'));
          -> 0
  mysql> SELECT IS_IPV4_MAPPED(INET6_ATON('::ffff:10.0.5.9'));
          -> 1
  ```

  As with `IS_IPV4_COMPAT()` the IPv4 part of an IPv4-mapped address can also be represented using hexadecimal notation:

  ```sql
  mysql> SELECT
      ->   IS_IPV4_MAPPED(INET6_ATON('::ffff:198.51.100.1')),
      ->   IS_IPV4_MAPPED(INET6_ATON('::ffff:c0a8:0001')),
      ->   IS_IPV4_MAPPED(INET6_ATON('::ffff:c0a8:1'));
          -> 1, 1, 1
  ```

* `IS_IPV6(expr)`

  Returns 1 if the argument is a valid IPv6 address specified as a string, 0 otherwise. This function does not consider IPv4 addresses to be valid IPv6 addresses.

  ```sql
  mysql> SELECT IS_IPV6('10.0.5.9'), IS_IPV6('::1');
          -> 0, 1
  ```

  For a given argument, if `IS_IPV6()` returns 1, `INET6_ATON()` returns a value tht si not `NULL`.

* `MASTER_POS_WAIT(log_name,log_pos[,timeout][,channel])`

  This function is useful for control of source-replica synchronization. It blocks until the replica has read and applied all updates up to the specified position in the source log. The return value is the number of log events the replica had to wait for to advance to the specified position. The function returns `NULL` if the replica SQL thread is not started, the replica's source information is not initialized, the arguments are incorrect, or an error occurs. It returns `-1` if the timeout has been exceeded. If the replica SQL thread stops while `MASTER_POS_WAIT()` is waiting, the function returns `NULL`. If the replica is past the specified position, the function returns immediately.

  On a multithreaded replica, the function waits until expiry of the limit set by the `slave_checkpoint_group` or `slave_checkpoint_period` system variable, when the checkpoint operation is called to update the status of the replica. Depending on the setting for the system variables, the function might therefore return some time after the specified position was reached.

  If a *`timeout`* value is specified, `MASTER_POS_WAIT()` stops waiting when *`timeout`* seconds have elapsed. *`timeout`* must be greater than or equal to 0. (As of MySQL 5.7.18, when the server is running in strict SQL mode, a negative *`timeout`* value is immediately rejected with `ER_WRONG_ARGUMENTS`; otherwise the function returns **`NULL`**, and raises a warning.)

  The optional *`channel`* value enables you to name which replication channel the function applies to. See Section 16.2.2, “Replication Channels” for more information.

  This function is unsafe for statement-based replication. A warning is logged if you use this function when `binlog_format` is set to `STATEMENT`.

* `NAME_CONST(name,value)`

  Returns the given value. When used to produce a result set column, `NAME_CONST()` causes the column to have the given name. The arguments should be constants.

  ```sql
  mysql> SELECT NAME_CONST('myname', 14);
  +--------+
  | myname |
  +--------+
  |     14 |
  +--------+
  ```

  This function is for internal use only. The server uses it when writing statements from stored programs that contain references to local program variables, as described in Section 23.7, “Stored Program Binary Logging”. You might see this function in the output from **mysqlbinlog**.

  For your applications, you can obtain exactly the same result as in the example just shown by using simple aliasing, like this:

  ```sql
  mysql> SELECT 14 AS myname;
  +--------+
  | myname |
  +--------+
  |     14 |
  +--------+
  1 row in set (0.00 sec)
  ```

  See Section 13.2.9, “SELECT Statement”, for more information about column aliases.

* `SLEEP(duration)`

  Sleeps (pauses) for the number of seconds given by the *`duration`* argument, then returns 0. The duration may have a fractional part. If the argument is `NULL` or negative, `SLEEP()` produces a warning, or an error in strict SQL mode.

  When sleep returns normally (without interruption), it returns 0:

  ```sql
  mysql> SELECT SLEEP(1000);
  +-------------+
  | SLEEP(1000) |
  +-------------+
  |           0 |
  +-------------+
  ```

  When `SLEEP()` is the only thing invoked by a query that is interrupted, it returns 1 and the query itself returns no error. This is true whether the query is killed or times out:

  + This statement is interrupted using `KILL QUERY` from another session:

    ```sql
    mysql> SELECT SLEEP(1000);
    +-------------+
    | SLEEP(1000) |
    +-------------+
    |           1 |
    +-------------+
    ```

  + This statement is interrupted by timing out:

    ```sql
    mysql> SELECT /*+ MAX_EXECUTION_TIME(1) */ SLEEP(1000);
    +-------------+
    | SLEEP(1000) |
    +-------------+
    |           1 |
    +-------------+
    ```

  When `SLEEP()` is only part of a query that is interrupted, the query returns an error:

  + This statement is interrupted using `KILL QUERY` from another session:

    ```sql
    mysql> SELECT 1 FROM t1 WHERE SLEEP(1000);
    ERROR 1317 (70100): Query execution was interrupted
    ```

  + This statement is interrupted by timing out:

    ```sql
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

  `UUID()` returns a value that conforms to UUID version 1 as described in RFC 4122. The value is a 128-bit number represented as a `utf8` string of five hexadecimal numbers in `aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee` format:

  + The first three numbers are generated from the low, middle, and high parts of a timestamp. The high part also includes the UUID version number.

  + The fourth number preserves temporal uniqueness in case the timestamp value loses monotonicity (for example, due to daylight saving time).

  + The fifth number is an IEEE 802 node number that provides spatial uniqueness. A random number is substituted if the latter is not available (for example, because the host device has no Ethernet card, or it is unknown how to find the hardware address of an interface on the host operating system). In this case, spatial uniqueness cannot be guaranteed. Nevertheless, a collision should have *very* low probability.

    The MAC address of an interface is taken into account only on FreeBSD, Linux, and Windows. On other operating systems, MySQL uses a randomly generated 48-bit number.

  ```sql
  mysql> SELECT UUID();
          -> '6ccd780c-baba-1026-9564-5b8c656024db'
  ```

  This function is unsafe for statement-based replication. A warning is logged if you use this function when `binlog_format` is set to `STATEMENT`.

* `UUID_SHORT()`

  Returns a “short” universal identifier as a 64-bit unsigned integer. Values returned by `UUID_SHORT()` differ from the string-format 128-bit identifiers returned by the `UUID()` function and have different uniqueness properties. The value of `UUID_SHORT()` is guaranteed to be unique if the following conditions hold:

  + The `server_id` value of the current server is between 0 and 255 and is unique among your set of source and replica servers

  + You do not set back the system time for your server host between **mysqld** restarts

  + You invoke `UUID_SHORT()` on average fewer than 16 million times per second between **mysqld** restarts

  The `UUID_SHORT()` return value is constructed this way:

  ```sql
    (server_id & 255) << 56
  + (server_startup_time_in_seconds << 24)
  + incremented_variable++;
  ```

  ```sql
  mysql> SELECT UUID_SHORT();
          -> 92395783831158784
  ```

  Note

  `UUID_SHORT()` does not work with statement-based replication.

* `VALUES(col_name)`

  In an `INSERT ... ON DUPLICATE KEY UPDATE` statement, you can use the `VALUES(col_name)` function in the `UPDATE` clause to refer to column values from the `INSERT` portion of the statement. In other words, `VALUES(col_name)` in the `UPDATE` clause refers to the value of *`col_name`* that would be inserted, had no duplicate-key conflict occurred. This function is especially useful in multiple-row inserts. The `VALUES()` function is meaningful only in the `ON DUPLICATE KEY UPDATE` clause of `INSERT` statements and returns `NULL` otherwise. See Section 13.2.5.2, “INSERT ... ON DUPLICATE KEY UPDATE Statement”.

  ```sql
  mysql> INSERT INTO table (a,b,c) VALUES (1,2,3),(4,5,6)
      -> ON DUPLICATE KEY UPDATE c=VALUES(a)+VALUES(b);
  ```
