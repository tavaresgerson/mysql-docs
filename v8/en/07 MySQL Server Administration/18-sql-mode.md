### 7.1.11 Server SQL Modes

The MySQL server can operate in different SQL modes, and can apply these modes differently for different clients, depending on the value of the  `sql_mode` system variable. DBAs can set the global SQL mode to match site server operating requirements, and each application can set its session SQL mode to its own requirements.

Modes affect the SQL syntax MySQL supports and the data validation checks it performs. This makes it easier to use MySQL in different environments and to use MySQL together with other database servers.

*  Setting the SQL Mode
*  The Most Important SQL Modes
*  Full List of SQL Modes
*  Combination SQL Modes
*  Strict SQL Mode
*  Comparison of the IGNORE Keyword and Strict SQL Mode

For answers to questions often asked about server SQL modes in MySQL, see  Section A.3, “MySQL 8.4 FAQ: Server SQL Mode”.

When working with `InnoDB` tables, consider also the  `innodb_strict_mode` system variable. It enables additional error checks for `InnoDB` tables.

#### Setting the SQL Mode

The default SQL mode in MySQL 8.4 includes these modes:  `ONLY_FULL_GROUP_BY`, `STRICT_TRANS_TABLES`, `NO_ZERO_IN_DATE`, `NO_ZERO_DATE`, `ERROR_FOR_DIVISION_BY_ZERO`, and  `NO_ENGINE_SUBSTITUTION`.

To set the SQL mode at server startup, use the `--sql-mode="modes"` option on the command line, or `sql-mode="modes"` in an option file such as `my.cnf` (Unix operating systems) or `my.ini` (Windows). *`modes`* is a list of different modes separated by commas. To clear the SQL mode explicitly, set it to an empty string using `--sql-mode=""` on the command line, or  `sql-mode=""` in an option file.

::: info Note

MySQL installation programs may configure the SQL mode during the installation process.

If the SQL mode differs from the default or from what you expect, check for a setting in an option file that the server reads at startup.

:::

To change the SQL mode at runtime, set the global or session `sql_mode` system variable using a  `SET` statement:

```
SET GLOBAL sql_mode = 'modes';
SET SESSION sql_mode = 'modes';
```

Setting the `GLOBAL` variable requires the `SYSTEM_VARIABLES_ADMIN` privilege (or the deprecated  `SUPER` privilege) and affects the operation of all clients that connect from that time on. Setting the `SESSION` variable affects only the current client. Each client can change its session  `sql_mode` value at any time.

To determine the current global or session `sql_mode` setting, select its value:

```
SELECT @@GLOBAL.sql_mode;
SELECT @@SESSION.sql_mode;
```

Important

**SQL mode and user-defined partitioning.** Changing the server SQL mode after creating and inserting data into partitioned tables can cause major changes in the behavior of such tables, and could lead to loss or corruption of data. It is strongly recommended that you never change the SQL mode once you have created tables employing user-defined partitioning.

When replicating partitioned tables, differing SQL modes on the source and replica can also lead to problems. For best results, you should always use the same server SQL mode on the source and replica.

For more information, see Section 26.6, “Restrictions and Limitations on Partitioning”.

#### The Most Important SQL Modes

The most important  `sql_mode` values are probably these:

*  `ANSI`

  This mode changes syntax and behavior to conform more closely to standard SQL. It is one of the special combination modes listed at the end of this section.
*  `STRICT_TRANS_TABLES`

  If a value could not be inserted as given into a transactional table, abort the statement. For a nontransactional table, abort the statement if the value occurs in a single-row statement or the first row of a multiple-row statement. More details are given later in this section.
*  `TRADITIONAL`

  Make MySQL behave like a “traditional” SQL database system. A simple description of this mode is “give an error instead of a warning” when inserting an incorrect value into a column. It is one of the special combination modes listed at the end of this section.

  ::: info Note

  With  `TRADITIONAL` mode enabled, an  `INSERT` or `UPDATE` aborts as soon as an error occurs. If you are using a nontransactional storage engine, this may not be what you want because data changes made prior to the error may not be rolled back, resulting in a “partially done” update.

  :::

When this manual refers to “strict mode,” it means a mode with either or both `STRICT_TRANS_TABLES` or `STRICT_ALL_TABLES` enabled.

#### Full List of SQL Modes

The following list describes all supported SQL modes:

*  `ALLOW_INVALID_DATES`

  Do not perform full checking of dates. Check only that the month is in the range from 1 to 12 and the day is in the range from 1 to 31. This may be useful for Web applications that obtain year, month, and day in three different fields and store exactly what the user inserted, without date validation. This mode applies to `DATE` and `DATETIME` columns. It does not apply to  `TIMESTAMP` columns, which always require a valid date.

  With  `ALLOW_INVALID_DATES` disabled, the server requires that month and day values be legal, and not merely in the range 1 to 12 and 1 to 31, respectively. With strict mode disabled, invalid dates such as `'2004-04-31'` are converted to `'0000-00-00'` and a warning is generated. With strict mode enabled, invalid dates generate an error. To permit such dates, enable `ALLOW_INVALID_DATES`.
*  `ANSI_QUOTES`

  Treat `"` as an identifier quote character (like the `` ` `` quote character) and not as a string quote character. You can still use `` ` `` to quote identifiers with this mode enabled. With  `ANSI_QUOTES` enabled, you cannot use double quotation marks to quote literal strings because they are interpreted as identifiers.
*  `ERROR_FOR_DIVISION_BY_ZERO`

  The `ERROR_FOR_DIVISION_BY_ZERO` mode affects handling of division by zero, which includes `MOD(N,0)`. For data-change operations ( `INSERT`, `UPDATE`), its effect also depends on whether strict SQL mode is enabled.

  + If this mode is not enabled, division by zero inserts `NULL` and produces no warning.
  + If this mode is enabled, division by zero inserts `NULL` and produces a warning.
  + If this mode and strict mode are enabled, division by zero produces an error, unless `IGNORE` is given as well. For `INSERT IGNORE` and `UPDATE IGNORE`, division by zero inserts `NULL` and produces a warning.

  For  `SELECT`, division by zero returns `NULL`. Enabling `ERROR_FOR_DIVISION_BY_ZERO` causes a warning to be produced as well, regardless of whether strict mode is enabled.

   `ERROR_FOR_DIVISION_BY_ZERO` is deprecated. `ERROR_FOR_DIVISION_BY_ZERO` is not part of strict mode, but should be used in conjunction with strict mode and is enabled by default. A warning occurs if `ERROR_FOR_DIVISION_BY_ZERO` is enabled without also enabling strict mode or vice versa.

  Because `ERROR_FOR_DIVISION_BY_ZERO` is deprecated, you should expect it to be removed in a future MySQL release as a separate mode name and its effect included in the effects of strict SQL mode.
*  `HIGH_NOT_PRECEDENCE`

  The precedence of the  `NOT` operator is such that expressions such as `NOT a BETWEEN b AND c` are parsed as `NOT (a BETWEEN b AND c)`. In some older versions of MySQL, the expression was parsed as `(NOT a) BETWEEN b AND c`. The old higher-precedence behavior can be obtained by enabling the `HIGH_NOT_PRECEDENCE` SQL mode.

  ```
  mysql> SET sql_mode = '';
  mysql> SELECT NOT 1 BETWEEN -5 AND 5;
          -> 0
  mysql> SET sql_mode = 'HIGH_NOT_PRECEDENCE';
  mysql> SELECT NOT 1 BETWEEN -5 AND 5;
          -> 1
  ```
*  `IGNORE_SPACE`

  Permit spaces between a function name and the `(` character. This causes built-in function names to be treated as reserved words. As a result, identifiers that are the same as function names must be quoted as described in  Section 11.2, “Schema Object Names”. For example, because there is a `COUNT()` function, the use of `count` as a table name in the following statement causes an error:

  ```
  mysql> CREATE TABLE count (i INT);
  ERROR 1064 (42000): You have an error in your SQL syntax
  ```

  The table name should be quoted:

  ```
  mysql> CREATE TABLE `count` (i INT);
  Query OK, 0 rows affected (0.00 sec)
  ```

  The  `IGNORE_SPACE` SQL mode applies to built-in functions, not to loadable functions or stored functions. It is always permissible to have spaces after a loadable function or stored function name, regardless of whether `IGNORE_SPACE` is enabled.

  For further discussion of `IGNORE_SPACE`, see Section 11.2.5, “Function Name Parsing and Resolution”.
*  `NO_AUTO_VALUE_ON_ZERO`

   `NO_AUTO_VALUE_ON_ZERO` affects handling of `AUTO_INCREMENT` columns. Normally, you generate the next sequence number for the column by inserting either `NULL` or `0` into it. `NO_AUTO_VALUE_ON_ZERO` suppresses this behavior for `0` so that only `NULL` generates the next sequence number.

  This mode can be useful if `0` has been stored in a table's `AUTO_INCREMENT` column. (Storing `0` is not a recommended practice, by the way.) For example, if you dump the table with  `mysqldump` and then reload it, MySQL normally generates new sequence numbers when it encounters the `0` values, resulting in a table with contents different from the one that was dumped. Enabling `NO_AUTO_VALUE_ON_ZERO` before reloading the dump file solves this problem. For this reason,  `mysqldump` automatically includes in its output a statement that enables `NO_AUTO_VALUE_ON_ZERO`.
*  `NO_BACKSLASH_ESCAPES`

  Enabling this mode disables the use of the backslash character (`\`) as an escape character within strings and identifiers. With this mode enabled, backslash becomes an ordinary character like any other, and the default escape sequence for `LIKE` expressions is changed so that no escape character is used.
*  `NO_DIR_IN_CREATE`

  When creating a table, ignore all `INDEX DIRECTORY` and `DATA DIRECTORY` directives. This option is useful on replica servers.
*  `NO_ENGINE_SUBSTITUTION`

  Control automatic substitution of the default storage engine when a statement such as `CREATE TABLE` or `ALTER TABLE` specifies a storage engine that is disabled or not compiled in.

  By default, `NO_ENGINE_SUBSTITUTION` is enabled.

  Because storage engines can be pluggable at runtime, unavailable engines are treated the same way:

  With `NO_ENGINE_SUBSTITUTION` disabled, for  `CREATE TABLE` the default engine is used and a warning occurs if the desired engine is unavailable. For `ALTER TABLE`, a warning occurs and the table is not altered.

  With `NO_ENGINE_SUBSTITUTION` enabled, an error occurs and the table is not created or altered if the desired engine is unavailable.
*  `NO_UNSIGNED_SUBTRACTION`

  Subtraction between integer values, where one is of type `UNSIGNED`, produces an unsigned result by default. If the result would otherwise have been negative, an error results:

  ```
  mysql> SET sql_mode = '';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT CAST(0 AS UNSIGNED) - 1;
  ERROR 1690 (22003): BIGINT UNSIGNED value is out of range in '(cast(0 as unsigned) - 1)'
  ```

  If the `NO_UNSIGNED_SUBTRACTION` SQL mode is enabled, the result is negative:

  ```
  mysql> SET sql_mode = 'NO_UNSIGNED_SUBTRACTION';
  mysql> SELECT CAST(0 AS UNSIGNED) - 1;
  +-------------------------+
  | CAST(0 AS UNSIGNED) - 1 |
  +-------------------------+
  |                      -1 |
  +-------------------------+
  ```

  If the result of such an operation is used to update an `UNSIGNED` integer column, the result is clipped to the maximum value for the column type, or clipped to 0 if `NO_UNSIGNED_SUBTRACTION` is enabled. With strict SQL mode enabled, an error occurs and the column remains unchanged.

  When `NO_UNSIGNED_SUBTRACTION` is enabled, the subtraction result is signed, *even if any operand is unsigned*. For example, compare the type of column `c2` in table `t1` with that of column `c2` in table `t2`:

  ```
  mysql> SET sql_mode='';
  mysql> CREATE TABLE test (c1 BIGINT UNSIGNED NOT NULL);
  mysql> CREATE TABLE t1 SELECT c1 - 1 AS c2 FROM test;
  mysql> DESCRIBE t1;
  +-------+---------------------+------+-----+---------+-------+
  | Field | Type                | Null | Key | Default | Extra |
  +-------+---------------------+------+-----+---------+-------+
  | c2    | bigint(21) unsigned | NO   |     | 0       |       |
  +-------+---------------------+------+-----+---------+-------+

  mysql> SET sql_mode='NO_UNSIGNED_SUBTRACTION';
  mysql> CREATE TABLE t2 SELECT c1 - 1 AS c2 FROM test;
  mysql> DESCRIBE t2;
  +-------+------------+------+-----+---------+-------+
  | Field | Type       | Null | Key | Default | Extra |
  +-------+------------+------+-----+---------+-------+
  | c2    | bigint(21) | NO   |     | 0       |       |
  +-------+------------+------+-----+---------+-------+
  ```

  This means that `BIGINT UNSIGNED` is not 100% usable in all contexts. See Section 14.10, “Cast Functions and Operators”.
*  `NO_ZERO_DATE`

  The  `NO_ZERO_DATE` mode affects whether the server permits `'0000-00-00'` as a valid date. Its effect also depends on whether strict SQL mode is enabled.

  + If this mode is not enabled, `'0000-00-00'` is permitted and inserts produce no warning.
  + If this mode is enabled, `'0000-00-00'` is permitted and inserts produce a warning.
  + If this mode and strict mode are enabled, `'0000-00-00'` is not permitted and inserts produce an error, unless `IGNORE` is given as well. For `INSERT IGNORE` and `UPDATE IGNORE`, `'0000-00-00'` is permitted and inserts produce a warning.

   `NO_ZERO_DATE` is deprecated.  `NO_ZERO_DATE` is not part of strict mode, but should be used in conjunction with strict mode and is enabled by default. A warning occurs if `NO_ZERO_DATE` is enabled without also enabling strict mode or vice versa.

  Because  `NO_ZERO_DATE` is deprecated, you should expect it to be removed in a future MySQL release as a separate mode name and its effect included in the effects of strict SQL mode.
*  `NO_ZERO_IN_DATE`

  The  `NO_ZERO_IN_DATE` mode affects whether the server permits dates in which the year part is nonzero but the month or day part is 0. (This mode affects dates such as `'2010-00-01'` or `'2010-01-00'`, but not `'0000-00-00'`. To control whether the server permits `'0000-00-00'`, use the `NO_ZERO_DATE` mode.) The effect of  `NO_ZERO_IN_DATE` also depends on whether strict SQL mode is enabled.

  + If this mode is not enabled, dates with zero parts are permitted and inserts produce no warning.
  + If this mode is enabled, dates with zero parts are inserted as `'0000-00-00'` and produce a warning.
  + If this mode and strict mode are enabled, dates with zero parts are not permitted and inserts produce an error, unless `IGNORE` is given as well. For `INSERT IGNORE` and `UPDATE IGNORE`, dates with zero parts are inserted as `'0000-00-00'` and produce a warning.

   `NO_ZERO_IN_DATE` is deprecated. `NO_ZERO_IN_DATE` is not part of strict mode, but should be used in conjunction with strict mode and is enabled by default. A warning occurs if `NO_ZERO_IN_DATE` is enabled without also enabling strict mode or vice versa.

  Because  `NO_ZERO_IN_DATE` is deprecated, you should expect it to be removed in a future MySQL release as a separate mode name and its effect included in the effects of strict SQL mode.
*  `ONLY_FULL_GROUP_BY`

  Reject queries for which the select list, `HAVING` condition, or `ORDER BY` list refer to nonaggregated columns that are neither named in the `GROUP BY` clause nor are functionally dependent on (uniquely determined by) `GROUP BY` columns.

  A MySQL extension to standard SQL permits references in the `HAVING` clause to aliased expressions in the select list. The `HAVING` clause can refer to aliases regardless of whether `ONLY_FULL_GROUP_BY` is enabled.

  For additional discussion and examples, see Section 14.19.3, “MySQL Handling of GROUP BY”.
*  `PAD_CHAR_TO_FULL_LENGTH`

  By default, trailing spaces are trimmed from `CHAR` column values on retrieval. If `PAD_CHAR_TO_FULL_LENGTH` is enabled, trimming does not occur and retrieved `CHAR` values are padded to their full length. This mode does not apply to `VARCHAR` columns, for which trailing spaces are retained on retrieval.

  ::: info Note

  `PAD_CHAR_TO_FULL_LENGTH` is deprecated. Expect it to be removed in a future version of MySQL.

  :::

  ```
  mysql> CREATE TABLE t1 (c1 CHAR(10));
  Query OK, 0 rows affected (0.37 sec)

  mysql> INSERT INTO t1 (c1) VALUES('xy');
  Query OK, 1 row affected (0.01 sec)

  mysql> SET sql_mode = '';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT c1, CHAR_LENGTH(c1) FROM t1;
  +------+-----------------+
  | c1   | CHAR_LENGTH(c1) |
  +------+-----------------+
  | xy   |               2 |
  +------+-----------------+
  1 row in set (0.00 sec)

  mysql> SET sql_mode = 'PAD_CHAR_TO_FULL_LENGTH';
  Query OK, 0 rows affected (0.00 sec)

  mysql> SELECT c1, CHAR_LENGTH(c1) FROM t1;
  +------------+-----------------+
  | c1         | CHAR_LENGTH(c1) |
  +------------+-----------------+
  | xy         |              10 |
  +------------+-----------------+
  1 row in set (0.00 sec)
  ```
*  `PIPES_AS_CONCAT`

  Treat  `||` as a string concatenation operator (same as `CONCAT()`) rather than as a synonym for  `OR`.
*  `REAL_AS_FLOAT`

  Treat  `REAL` - (`FLOAT`, `DOUBLE`) as a synonym for `FLOAT` - ()`FLOAT`, `DOUBLE`). By default, MySQL treats  `REAL` - (`FLOAT`, `DOUBLE`) as a synonym for `DOUBLE` - (`FLOAT`, `DOUBLE`).
*  `STRICT_ALL_TABLES`

  Enable strict SQL mode for all storage engines. Invalid data values are rejected. For details, see Strict SQL Mode.
*  `STRICT_TRANS_TABLES`

  Enable strict SQL mode for transactional storage engines, and when possible for nontransactional storage engines. For details, see  Strict SQL Mode.
*  `TIME_TRUNCATE_FRACTIONAL`

  Control whether rounding or truncation occurs when inserting a  `TIME`, `DATE`, or `TIMESTAMP` value with a fractional seconds part into a column having the same type but fewer fractional digits. The default behavior is to use rounding. If this mode is enabled, truncation occurs instead. The following sequence of statements illustrates the difference:

  ```
  CREATE TABLE t (id INT, tval TIME(1));
  SET sql_mode='';
  INSERT INTO t (id, tval) VALUES(1, 1.55);
  SET sql_mode='TIME_TRUNCATE_FRACTIONAL';
  INSERT INTO t (id, tval) VALUES(2, 1.55);
  ```

  The resulting table contents look like this, where the first value has been subject to rounding and the second to truncation:

  ```
  mysql> SELECT id, tval FROM t ORDER BY id;
  +------+------------+
  | id   | tval       |
  +------+------------+
  |    1 | 00:00:01.6 |
  |    2 | 00:00:01.5 |
  +------+------------+
  ```

  See also  Section 13.2.6, “Fractional Seconds in Time Values”.

#### Combination SQL Modes

The following special modes are provided as shorthand for combinations of mode values from the preceding list.

*  `ANSI`

  Equivalent to `REAL_AS_FLOAT`, `PIPES_AS_CONCAT`, `ANSI_QUOTES`, `IGNORE_SPACE`, and `ONLY_FULL_GROUP_BY`.

   `ANSI` mode also causes the server to return an error for queries where a set function *`S`* with an outer reference `S(outer_ref)` cannot be aggregated in the outer query against which the outer reference has been resolved. This is such a query:

  ```
  SELECT * FROM t1 WHERE t1.a IN (SELECT MAX(t1.b) FROM t2 WHERE ...);
  ```

  Here,  `MAX(t1.b)` cannot aggregated in the outer query because it appears in the `WHERE` clause of that query. Standard SQL requires an error in this situation. If `ANSI` mode is not enabled, the server treats `S(outer_ref)` in such queries the same way that it would interpret `S(const)`.

  See  Section 1.7, “MySQL Standards Compliance”.
*  `TRADITIONAL`

   `TRADITIONAL` is equivalent to  `STRICT_TRANS_TABLES`, `STRICT_ALL_TABLES`, `NO_ZERO_IN_DATE`, `NO_ZERO_DATE`, `ERROR_FOR_DIVISION_BY_ZERO`, and `NO_ENGINE_SUBSTITUTION`.

#### Strict SQL Mode

Strict mode controls how MySQL handles invalid or missing values in data-change statements such as `INSERT` or `UPDATE`. A value can be invalid for several reasons. For example, it might have the wrong data type for the column, or it might be out of range. A value is missing when a new row to be inserted does not contain a value for a non-`NULL` column that has no explicit `DEFAULT` clause in its definition. (For a `NULL` column, `NULL` is inserted if the value is missing.) Strict mode also affects DDL statements such as  `CREATE TABLE`.

If strict mode is not in effect, MySQL inserts adjusted values for invalid or missing values and produces warnings (see Section 15.7.7.42, “SHOW WARNINGS Statement”). In strict mode, you can produce this behavior by using `INSERT IGNORE` or `UPDATE IGNORE`.

For statements such as  `SELECT` that do not change data, invalid values generate a warning in strict mode, not an error.

Strict mode produces an error for attempts to create a key that exceeds the maximum key length. When strict mode is not enabled, this results in a warning and truncation of the key to the maximum key length.

Strict mode does not affect whether foreign key constraints are checked.  `foreign_key_checks` can be used for that. (See Section 7.1.8, “Server System Variables”.)

Strict SQL mode is in effect if either `STRICT_ALL_TABLES` or `STRICT_TRANS_TABLES` is enabled, although the effects of these modes differ somewhat:

* For transactional tables, an error occurs for invalid or missing values in a data-change statement when either `STRICT_ALL_TABLES` or `STRICT_TRANS_TABLES` is enabled. The statement is aborted and rolled back.
* For nontransactional tables, the behavior is the same for either mode if the bad value occurs in the first row to be inserted or updated: The statement is aborted and the table remains unchanged. If the statement inserts or modifies multiple rows and the bad value occurs in the second or later row, the result depends on which strict mode is enabled:

  + For  `STRICT_ALL_TABLES`, MySQL returns an error and ignores the rest of the rows. However, because the earlier rows have been inserted or updated, the result is a partial update. To avoid this, use single-row statements, which can be aborted without changing the table.
  + For `STRICT_TRANS_TABLES`, MySQL converts an invalid value to the closest valid value for the column and inserts the adjusted value. If a value is missing, MySQL inserts the implicit default value for the column data type. In either case, MySQL generates a warning rather than an error and continues processing the statement. Implicit defaults are described in  Section 13.6, “Data Type Default Values”.

Strict mode affects handling of division by zero, zero dates, and zeros in dates as follows:

* Strict mode affects handling of division by zero, which includes `MOD(N,0)`:

  For data-change operations ( `INSERT`, `UPDATE`):

  + If strict mode is not enabled, division by zero inserts `NULL` and produces no warning.
  + If strict mode is enabled, division by zero produces an error, unless `IGNORE` is given as well. For `INSERT IGNORE` and `UPDATE IGNORE`, division by zero inserts `NULL` and produces a warning.

  For  `SELECT`, division by zero returns `NULL`. Enabling strict mode causes a warning to be produced as well.
* Strict mode affects whether the server permits `'0000-00-00'` as a valid date:

  + If strict mode is not enabled, `'0000-00-00'` is permitted and inserts produce no warning.
  + If strict mode is enabled, `'0000-00-00'` is not permitted and inserts produce an error, unless `IGNORE` is given as well. For `INSERT IGNORE` and `UPDATE IGNORE`, `'0000-00-00'` is permitted and inserts produce a warning.
* Strict mode affects whether the server permits dates in which the year part is nonzero but the month or day part is 0 (dates such as `'2010-00-01'` or `'2010-01-00'`):

  + If strict mode is not enabled, dates with zero parts are permitted and inserts produce no warning.
  + If strict mode is enabled, dates with zero parts are not permitted and inserts produce an error, unless `IGNORE` is given as well. For `INSERT IGNORE` and `UPDATE IGNORE`, dates with zero parts are inserted as `'0000-00-00'` (which is considered valid with `IGNORE`) and produce a warning.

For more information about strict mode with respect to `IGNORE`, see Comparison of the IGNORE Keyword and Strict SQL Mode.

Strict mode affects handling of division by zero, zero dates, and zeros in dates in conjunction with the `ERROR_FOR_DIVISION_BY_ZERO`, `NO_ZERO_DATE`, and `NO_ZERO_IN_DATE` modes.

#### Comparison of the IGNORE Keyword and Strict SQL Mode

This section compares the effect on statement execution of the `IGNORE` keyword (which downgrades errors to warnings) and strict SQL mode (which upgrades warnings to errors). It describes which statements they affect, and which errors they apply to.

The following table presents a summary comparison of statement behavior when the default is to produce an error versus a warning. An example of when the default is to produce an error is inserting a `NULL` into a `NOT NULL` column. An example of when the default is to produce a warning is inserting a value of the wrong data type into a column (such as inserting the string `'abc'` into an integer column).

<table><col style="width: 33%"/><col style="width: 33%"/><col style="width: 33%"/><thead><tr> <th>Operational Mode</th> <th>When Statement Default is Error</th> <th>When Statement Default is Warning</th> </tr></thead><tbody><tr> <th>Without <code>IGNORE</code> or strict SQL mode</th> <td>Error</td> <td>Warning</td> </tr><tr> <th>With <code>IGNORE</code></th> <td>Warning</td> <td>Warning (same as without <code>IGNORE</code> or strict SQL mode)</td> </tr><tr> <th>With strict SQL mode</th> <td>Error (same as without <code>IGNORE</code> or strict SQL mode)</td> <td>Error</td> </tr><tr> <th>With <code>IGNORE</code> and strict SQL mode</th> <td>Warning</td> <td>Warning</td> </tr></tbody></table>

One conclusion to draw from the table is that when the `IGNORE` keyword and strict SQL mode are both in effect, `IGNORE` takes precedence. This means that, although `IGNORE` and strict SQL mode can be considered to have opposite effects on error handling, they do not cancel when used together.

*  The Effect of IGNORE on Statement Execution
*  The Effect of Strict SQL Mode on Statement Execution

##### The Effect of IGNORE on Statement Execution

Several statements in MySQL support an optional `IGNORE` keyword. This keyword causes the server to downgrade certain types of errors and generate warnings instead. For a multiple-row statement, downgrading an error to a warning may enable a row to be processed. Otherwise, `IGNORE` causes the statement to skip to the next row instead of aborting. (For nonignorable errors, an error occurs regardless of the `IGNORE` keyword.)

Example: If the table `t` has a primary key column `i` containing unique values, attempting to insert the same value of `i` into multiple rows normally produces a duplicate-key error:

```
mysql> CREATE TABLE t (i INT NOT NULL PRIMARY KEY);
mysql> INSERT INTO t (i) VALUES(1),(1);
ERROR 1062 (23000): Duplicate entry '1' for key 't.PRIMARY'
```

With `IGNORE`, the row containing the duplicate key still is not inserted, but a warning occurs instead of an error:

```
mysql> INSERT IGNORE INTO t (i) VALUES(1),(1);
Query OK, 1 row affected, 1 warning (0.01 sec)
Records: 2  Duplicates: 1  Warnings: 1

mysql> SHOW WARNINGS;
+---------+------+-----------------------------------------+
| Level   | Code | Message                                 |
+---------+------+-----------------------------------------+
| Warning | 1062 | Duplicate entry '1' for key 't.PRIMARY' |
+---------+------+-----------------------------------------+
1 row in set (0.00 sec)
```

Example: If the table `t2` has a `NOT NULL` column `id`, attempting to insert `NULL` produces an error in strict SQL mode:

```
mysql> CREATE TABLE t2 (id INT NOT NULL);
mysql> INSERT INTO t2 (id) VALUES(1),(NULL),(3);
ERROR 1048 (23000): Column 'id' cannot be null
mysql> SELECT * FROM t2;
Empty set (0.00 sec)
```

If the SQL mode is not strict, `IGNORE` causes the `NULL` to be inserted as the column implicit default (0 in this case), which enables the row to be handled without skipping it:

```
mysql> INSERT INTO t2 (id) VALUES(1),(NULL),(3);
mysql> SELECT * FROM t2;
+----+
| id |
+----+
|  1 |
|  0 |
|  3 |
+----+
```

These statements support the `IGNORE` keyword:

* `CREATE TABLE ... SELECT`: `IGNORE` does not apply to the  `CREATE TABLE` or `SELECT` parts of the statement but to inserts into the table of rows produced by the `SELECT`. Rows that duplicate an existing row on a unique key value are discarded.
*  `DELETE`: `IGNORE` causes MySQL to ignore errors during the process of deleting rows.
*  `INSERT`: With `IGNORE`, rows that duplicate an existing row on a unique key value are discarded. Rows set to values that would cause data conversion errors are set to the closest valid values instead.

  For partitioned tables where no partition matching a given value is found, `IGNORE` causes the insert operation to fail silently for rows containing the unmatched value.
*  `LOAD DATA`, `LOAD XML`: With `IGNORE`, rows that duplicate an existing row on a unique key value are discarded.
*  `UPDATE`: With `IGNORE`, rows for which duplicate-key conflicts occur on a unique key value are not updated. Rows updated to values that would cause data conversion errors are updated to the closest valid values instead.

The `IGNORE` keyword applies to the following ignorable errors:

*  `ER_BAD_NULL_ERROR`
*  `ER_DUP_ENTRY`
*  `ER_DUP_ENTRY_WITH_KEY_NAME`
*  `ER_DUP_KEY`
*  `ER_NO_PARTITION_FOR_GIVEN_VALUE`
*  `ER_NO_PARTITION_FOR_GIVEN_VALUE_SILENT`
*  `ER_NO_REFERENCED_ROW_2`
*  `ER_ROW_DOES_NOT_MATCH_GIVEN_PARTITION_SET`
*  `ER_ROW_IS_REFERENCED_2`
*  `ER_SUBQUERY_NO_1_ROW`
*  `ER_VIEW_CHECK_FAILED`

##### The Effect of Strict SQL Mode on Statement Execution

The MySQL server can operate in different SQL modes, and can apply these modes differently for different clients, depending on the value of the  `sql_mode` system variable. In “strict” SQL mode, the server upgrades certain warnings to errors.

For example, in non-strict SQL mode, inserting the string `'abc'` into an integer column results in conversion of the value to 0 and a warning:

```
mysql> SET sql_mode = '';
Query OK, 0 rows affected (0.00 sec)

mysql> INSERT INTO t (i) VALUES('abc');
Query OK, 1 row affected, 1 warning (0.01 sec)

mysql> SHOW WARNINGS;
+---------+------+--------------------------------------------------------+
| Level   | Code | Message                                                |
+---------+------+--------------------------------------------------------+
| Warning | 1366 | Incorrect integer value: 'abc' for column 'i' at row 1 |
+---------+------+--------------------------------------------------------+
1 row in set (0.00 sec)
```

In strict SQL mode, the invalid value is rejected with an error:

```
mysql> SET sql_mode = 'STRICT_ALL_TABLES';
Query OK, 0 rows affected (0.00 sec)

mysql> INSERT INTO t (i) VALUES('abc');
ERROR 1366 (HY000): Incorrect integer value: 'abc' for column 'i' at row 1
```

For more information about possible settings of the `sql_mode` system variable, see Section 7.1.11, “Server SQL Modes”.

Strict SQL mode applies to the following statements under conditions for which some value might be out of range or an invalid row is inserted into or deleted from a table:

*  `ALTER TABLE`
*  `CREATE TABLE`
* `CREATE TABLE ... SELECT`
*  `DELETE` (both single table and multiple table)
*  `INSERT`
*  `LOAD DATA`
*  `LOAD XML`
* `SELECT SLEEP()`
*  `UPDATE` (both single table and multiple table)

Within stored programs, individual statements of the types just listed execute in strict SQL mode if the program was defined while strict mode was in effect.

Strict SQL mode applies to the following errors, which represent a class of errors in which an input value is either invalid or missing. A value is invalid if it has the wrong data type for the column or might be out of range. A value is missing if a new row to be inserted does not contain a value for a `NOT NULL` column that has no explicit `DEFAULT` clause in its definition.

```
ER_BAD_NULL_ERROR
ER_CUT_VALUE_GROUP_CONCAT
ER_DATA_TOO_LONG
ER_DATETIME_FUNCTION_OVERFLOW
ER_DIVISION_BY_ZERO
ER_INVALID_ARGUMENT_FOR_LOGARITHM
ER_NO_DEFAULT_FOR_FIELD
ER_NO_DEFAULT_FOR_VIEW_FIELD
ER_TOO_LONG_KEY
ER_TRUNCATED_WRONG_VALUE
ER_TRUNCATED_WRONG_VALUE_FOR_FIELD
ER_WARN_DATA_OUT_OF_RANGE
ER_WARN_NULL_TO_NOTNULL
ER_WARN_TOO_FEW_RECORDS
ER_WRONG_ARGUMENTS
ER_WRONG_VALUE_FOR_TYPE
WARN_DATA_TRUNCATED
```

::: info Note

Because continued MySQL development defines new errors, there may be errors not in the preceding list to which strict SQL mode applies.

:::
