## 14.15 Information Functions

**Table 14.20 Information Functions**

<table frame="box" rules="all" summary="A reference that lists information functions."><col style="width: 28%"/><col style="width: 71%"/><thead><tr><th>Name</th> <th>Description</th> </tr></thead><tbody><tr><td><a class="link" href="information-functions.html#function_benchmark"><code class="literal">BENCHMARK()</code></a></td> <td> Repeatedly execute an expression </td> </tr><tr><td><a class="link" href="information-functions.html#function_charset"><code class="literal">CHARSET()</code></a></td> <td> Return the character set of the argument </td> </tr><tr><td><a class="link" href="information-functions.html#function_coercibility"><code class="literal">COERCIBILITY()</code></a></td> <td> Return the collation coercibility value of the string argument </td> </tr><tr><td><a class="link" href="information-functions.html#function_collation"><code class="literal">COLLATION()</code></a></td> <td> Return the collation of the string argument </td> </tr><tr><td><a class="link" href="information-functions.html#function_connection-id"><code class="literal">CONNECTION_ID()</code></a></td> <td> Return the connection ID (thread ID) for the connection </td> </tr><tr><td><a class="link" href="information-functions.html#function_current-role"><code class="literal">CURRENT_ROLE()</code></a></td> <td> Return the current active roles </td> </tr><tr><td><a class="link" href="information-functions.html#function_current-user"><code class="literal">CURRENT_USER()</code>, <code class="literal">CURRENT_USER</code></a></td> <td> The authenticated user name and host name </td> </tr><tr><td><a class="link" href="information-functions.html#function_database"><code class="literal">DATABASE()</code></a></td> <td> Return the default (current) database name </td> </tr><tr><td><a class="link" href="information-functions.html#function_found-rows"><code class="literal">FOUND_ROWS()</code></a></td> <td> For a SELECT with a LIMIT clause, the number of rows that would be returned were there no LIMIT clause </td> </tr><tr><td><a class="link" href="information-functions.html#function_icu-version"><code class="literal">ICU_VERSION()</code></a></td> <td> ICU library version </td> </tr><tr><td><a class="link" href="information-functions.html#function_last-insert-id"><code class="literal">LAST_INSERT_ID()</code></a></td> <td> Value of the AUTOINCREMENT column for the last INSERT </td> </tr><tr><td><a class="link" href="information-functions.html#function_roles-graphml"><code class="literal">ROLES_GRAPHML()</code></a></td> <td> Return a GraphML document representing memory role subgraphs </td> </tr><tr><td><a class="link" href="information-functions.html#function_row-count"><code class="literal">ROW_COUNT()</code></a></td> <td> The number of rows updated </td> </tr><tr><td><a class="link" href="information-functions.html#function_schema"><code class="literal">SCHEMA()</code></a></td> <td> Synonym for DATABASE() </td> </tr><tr><td><a class="link" href="information-functions.html#function_session-user"><code class="literal">SESSION_USER()</code></a></td> <td> Synonym for USER() </td> </tr><tr><td><a class="link" href="information-functions.html#function_system-user"><code class="literal">SYSTEM_USER()</code></a></td> <td> Synonym for USER() </td> </tr><tr><td><a class="link" href="information-functions.html#function_user"><code class="literal">USER()</code></a></td> <td> The user name and host name provided by the client </td> </tr><tr><td><a class="link" href="information-functions.html#function_version"><code class="literal">VERSION()</code></a></td> <td> Return a string that indicates the MySQL server version </td> </tr></tbody></table>

* `BENCHMARK(count,expr)`

  The `BENCHMARK()` function executes the expression *`expr`* repeatedly *`count`* times. It may be used to time how quickly MySQL processes the expression. The result value is `0`, or `NULL` for inappropriate arguments such as a `NULL` or negative repeat count.

  The intended use is from within the **mysql** client, which reports query execution times:

  ```
  mysql> SELECT BENCHMARK(1000000,AES_ENCRYPT('hello','goodbye'));
  +---------------------------------------------------+
  | BENCHMARK(1000000,AES_ENCRYPT('hello','goodbye')) |
  +---------------------------------------------------+
  |                                                 0 |
  +---------------------------------------------------+
  1 row in set (4.74 sec)
  ```

  The time reported is elapsed time on the client end, not CPU time on the server end. It is advisable to execute `BENCHMARK()` several times, and to interpret the result with regard to how heavily loaded the server machine is.

  `BENCHMARK()` is intended for measuring the runtime performance of scalar expressions, which has some significant implications for the way that you use it and interpret the results:

  + Only scalar expressions can be used. Although the expression can be a subquery, it must return a single column and at most a single row. For example, `BENCHMARK(10, (SELECT * FROM t))` fails if the table `t` has more than one column or more than one row.

  + Executing a `SELECT expr` statement *`N`* times differs from executing `SELECT BENCHMARK(N, expr)` in terms of the amount of overhead involved. The two have very different execution profiles and you should not expect them to take the same amount of time. The former involves the parser, optimizer, table locking, and runtime evaluation *`N`* times each. The latter involves only runtime evaluation *`N`* times, and all the other components just once. Memory structures already allocated are reused, and runtime optimizations such as local caching of results already evaluated for aggregate functions can alter the results. Use of `BENCHMARK()` thus measures performance of the runtime component by giving more weight to that component and removing the “noise” introduced by the network, parser, optimizer, and so forth.

* `CHARSET(str)`

  Returns the character set of the string argument, or `NULL` if the argument is `NULL`.

  ```
  mysql> SELECT CHARSET('abc');
          -> 'utf8mb3'
  mysql> SELECT CHARSET(CONVERT('abc' USING latin1));
          -> 'latin1'
  mysql> SELECT CHARSET(USER());
          -> 'utf8mb3'
  ```

* `COERCIBILITY(str)`

  Returns the collation coercibility value of the string argument.

  ```
  mysql> SELECT COERCIBILITY('abc' COLLATE utf8mb4_swedish_ci);
          -> 0
  mysql> SELECT COERCIBILITY(USER());
          -> 3
  mysql> SELECT COERCIBILITY('abc');
          -> 4
  mysql> SELECT COERCIBILITY(1000);
          -> 5
  ```

  The return values have the meanings shown in the following table. Lower values have higher precedence.

  <table summary="Collation coercibility return values, the meaning of each value, and an example of each."><col style="width: 15%"/><col style="width: 15%"/><col style="width: 70%"/><thead><tr> <th>Coercibility</th> <th>Meaning</th> <th>Example</th> </tr></thead><tbody><tr> <th><code class="literal">0</code></th> <td>Explicit collation</td> <td>Value with <code class="literal">COLLATE</code> clause</td> </tr><tr> <th><code class="literal">2</code></th> <td>Implicit collation</td> <td>Column value, stored routine parameter or local variable</td> </tr><tr> <th><code class="literal">3</code></th> <td>System constant</td> <td><a class="link" href="information-functions.html#function_user"><code class="literal">USER()</code></a> return value</td> </tr><tr> <th><code class="literal">4</code></th> <td>Coercible</td> <td>Literal string</td> </tr><tr> <th><code class="literal">5</code></th> <td>Numeric</td> <td>Numeric or temporal value</td> </tr><tr> <th><code class="literal">6</code></th> <td>Null</td> <td><code class="literal">NULL</code> or an expression derived from <code class="literal">NULL</code></td> </tr><tr> <th><code class="literal">7</code></th> <td>No collation</td> <td>Concatenation of strings with different collations</td> </tr></tbody></table>

  `1` was previously used for “No collation”. It is unused in MySQL 9.5 but still considered valid for backwards compatibility. (Bug
  #37285902)

  For more information, see Section 12.8.4, “Collation Coercibility in Expressions”.

* `COLLATION(str)`

  Returns the collation of the string argument.

  ```
  mysql> SELECT COLLATION('abc');
          -> 'utf8mb4_0900_ai_ci'
  mysql> SELECT COLLATION(_utf8mb4'abc');
          -> 'utf8mb4_0900_ai_ci'
  mysql> SELECT COLLATION(_latin1'abc');
          -> 'latin1_swedish_ci'
  ```

* `CONNECTION_ID()`

  Returns the connection ID (thread ID) for the connection. Every connection has an ID that is unique among the set of currently connected clients.

  The value returned by `CONNECTION_ID()` is the same type of value as displayed in the `ID` column of the Information Schema `PROCESSLIST` table, the `Id` column of `SHOW PROCESSLIST` output, and the `PROCESSLIST_ID` column of the Performance Schema `threads` table.

  ```
  mysql> SELECT CONNECTION_ID();
          -> 23786
  ```

  Warning

  Changing the session value of the `pseudo_thread_id` system variable changes the value returned by the `CONNECTION_ID()` function.

* `CURRENT_ROLE()`

  Returns a `utf8mb3` string containing the current active roles for the current session, separated by commas, or `NONE` if there are none. The value reflects the setting of the `sql_quote_show_create` system variable.

  Suppose that an account is granted roles as follows:

  ```
  GRANT 'r1', 'r2' TO 'u1'@'localhost';
  SET DEFAULT ROLE ALL TO 'u1'@'localhost';
  ```

  In sessions for `u1`, the initial `CURRENT_ROLE()` value names the default account roles. Using `SET ROLE` changes that:

  ```
  mysql> SELECT CURRENT_ROLE();
  +-------------------+
  | CURRENT_ROLE()    |
  +-------------------+
  | `r1`@`%`,`r2`@`%` |
  +-------------------+
  mysql> SET ROLE 'r1'; SELECT CURRENT_ROLE();
  +----------------+
  | CURRENT_ROLE() |
  +----------------+
  | `r1`@`%`       |
  +----------------+
  ```

* `CURRENT_USER`, `CURRENT_USER()`

  Returns the user name and host name combination for the MySQL account that the server used to authenticate the current client. This account determines your access privileges. The return value is a string in the `utf8mb3` character set.

  The value of `CURRENT_USER()` can differ from the value of `USER()`.

  ```
  mysql> SELECT USER();
          -> 'davida@localhost'
  mysql> SELECT * FROM mysql.user;
  ERROR 1044: Access denied for user ''@'localhost' to
  database 'mysql'
  mysql> SELECT CURRENT_USER();
          -> '@localhost'
  ```

  The example illustrates that although the client specified a user name of `davida` (as indicated by the value of the `USER()` function), the server authenticated the client using an anonymous user account (as seen by the empty user name part of the `CURRENT_USER()` value). One way this might occur is that there is no account listed in the grant tables for `davida`.

  Within a stored program or view, `CURRENT_USER()` returns the account for the user who defined the object (as given by its `DEFINER` value) unless defined with the `SQL SECURITY INVOKER` characteristic. In the latter case, `CURRENT_USER()` returns the object's invoker.

  Triggers and events have no option to define the `SQL SECURITY` characteristic, so for these objects, `CURRENT_USER()` returns the account for the user who defined the object. To return the invoker, use `USER()` or `SESSION_USER()`.

  The following statements support use of the `CURRENT_USER()` function to take the place of the name of (and, possibly, a host for) an affected user or a definer; in such cases, `CURRENT_USER()` is expanded where and as needed:

  + `DROP USER`
  + `RENAME USER`
  + `GRANT`
  + `REVOKE`
  + `CREATE FUNCTION`
  + `CREATE PROCEDURE`
  + `CREATE TRIGGER`
  + `CREATE EVENT`
  + `CREATE VIEW`
  + `ALTER EVENT`
  + `ALTER VIEW`
  + `SET PASSWORD`

  For information about the implications that this expansion of `CURRENT_USER()` has for replication, see Section 19.5.1.8, “Replication of CURRENT\_USER()”").

  This function can be used for the default value of a `VARCHAR` or `TEXT` column, as shown in the following `CREATE TABLE` statement:

  ```
  CREATE TABLE t (c VARCHAR(288) DEFAULT (CURRENT_USER()));
  ```

* `DATABASE()`

  Returns the default (current) database name as a string in the `utf8mb3` character set. If there is no default database, `DATABASE()` returns `NULL`. Within a stored routine, the default database is the database that the routine is associated with, which is not necessarily the same as the database that is the default in the calling context.

  ```
  mysql> SELECT DATABASE();
          -> 'test'
  ```

  If there is no default database, `DATABASE()` returns `NULL`.

* `FOUND_ROWS()`

  Note

  The `SQL_CALC_FOUND_ROWS` query modifier and accompanying `FOUND_ROWS()` function are deprecated; expect them to be removed in a future version of MySQL. Execute the query with `LIMIT`, and then a second query with `COUNT(*)` and without `LIMIT` to determine whether there are additional rows. For example, instead of these queries:

  ```
  SELECT SQL_CALC_FOUND_ROWS * FROM tbl_name WHERE id > 100 LIMIT 10;
  SELECT FOUND_ROWS();
  ```

  Use these queries instead:

  ```
  SELECT * FROM tbl_name WHERE id > 100 LIMIT 10;
  SELECT COUNT(*) FROM tbl_name WHERE id > 100;
  ```

  `COUNT(*)` is subject to certain optimizations. `SQL_CALC_FOUND_ROWS` causes some optimizations to be disabled.

  A `SELECT` statement may include a `LIMIT` clause to restrict the number of rows the server returns to the client. In some cases, it is desirable to know how many rows the statement would have returned without the `LIMIT`, but without running the statement again. To obtain this row count, include an `SQL_CALC_FOUND_ROWS` option in the `SELECT` statement, and then invoke `FOUND_ROWS()` afterward:

  ```
  mysql> SELECT SQL_CALC_FOUND_ROWS * FROM tbl_name
      -> WHERE id > 100 LIMIT 10;
  mysql> SELECT FOUND_ROWS();
  ```

  The second `SELECT` returns a number indicating how many rows the first `SELECT` would have returned had it been written without the `LIMIT` clause.

  In the absence of the `SQL_CALC_FOUND_ROWS` option in the most recent successful `SELECT` statement, `FOUND_ROWS()` returns the number of rows in the result set returned by that statement. If the statement includes a `LIMIT` clause, `FOUND_ROWS()` returns the number of rows up to the limit. For example, `FOUND_ROWS()` returns 10 or 60, respectively, if the statement includes `LIMIT 10` or `LIMIT 50, 10`.

  The row count available through `FOUND_ROWS()` is transient and not intended to be available past the statement following the `SELECT SQL_CALC_FOUND_ROWS` statement. If you need to refer to the value later, save it:

  ```
  mysql> SELECT SQL_CALC_FOUND_ROWS * FROM ... ;
  mysql> SET @rows = FOUND_ROWS();
  ```

  If you are using `SELECT SQL_CALC_FOUND_ROWS`, MySQL must calculate how many rows are in the full result set. However, this is faster than running the query again without `LIMIT`, because the result set need not be sent to the client.

  `SQL_CALC_FOUND_ROWS` and `FOUND_ROWS()` can be useful in situations when you want to restrict the number of rows that a query returns, but also determine the number of rows in the full result set without running the query again. An example is a Web script that presents a paged display containing links to the pages that show other sections of a search result. Using `FOUND_ROWS()` enables you to determine how many other pages are needed for the rest of the result.

  The use of `SQL_CALC_FOUND_ROWS` and `FOUND_ROWS()` is more complex for `UNION` statements than for simple `SELECT` statements, because `LIMIT` may occur at multiple places in a `UNION`. It may be applied to individual `SELECT` statements in the `UNION`, or global to the `UNION` result as a whole.

  The intent of `SQL_CALC_FOUND_ROWS` for `UNION` is that it should return the row count that would be returned without a global `LIMIT`. The conditions for use of `SQL_CALC_FOUND_ROWS` with `UNION` are:

  + The `SQL_CALC_FOUND_ROWS` keyword must appear in the first `SELECT` of the `UNION`.

  + The value of `FOUND_ROWS()` is exact only if `UNION ALL` is used. If `UNION` without `ALL` is used, duplicate removal occurs and the value of `FOUND_ROWS()` is only approximate.

  + If no `LIMIT` is present in the `UNION`, `SQL_CALC_FOUND_ROWS` is ignored and returns the number of rows in the temporary table that is created to process the `UNION`.

  Beyond the cases described here, the behavior of `FOUND_ROWS()` is undefined (for example, its value following a `SELECT` statement that fails with an error).

  Important

  `FOUND_ROWS()` is not replicated reliably using statement-based replication. This function is automatically replicated using row-based replication.

* `ICU_VERSION()`

  The version of the International Components for Unicode (ICU) library used to support regular expression operations (see Section 14.8.2, “Regular Expressions”). This function is primarily intended for use in test cases.

* `LAST_INSERT_ID()`, `LAST_INSERT_ID(expr)`

  With no argument, `LAST_INSERT_ID()` returns a `BIGINT UNSIGNED` (64-bit) value representing the first automatically generated value successfully inserted for an `AUTO_INCREMENT` column as a result of the most recently executed `INSERT` statement. The value of `LAST_INSERT_ID()` remains unchanged if no rows are successfully inserted.

  With an argument, `LAST_INSERT_ID()` returns an unsigned integer, or `NULL` if the argument is `NULL`.

  For example, after inserting a row that generates an `AUTO_INCREMENT` value, you can get the value like this:

  ```
  mysql> SELECT LAST_INSERT_ID();
          -> 195
  ```

  The currently executing statement does not affect the value of `LAST_INSERT_ID()`. Suppose that you generate an `AUTO_INCREMENT` value with one statement, and then refer to `LAST_INSERT_ID()` in a multiple-row `INSERT` statement that inserts rows into a table with its own `AUTO_INCREMENT` column. The value of `LAST_INSERT_ID()` remains stable in the second statement; its value for the second and later rows is not affected by the earlier row insertions. (You should be aware that, if you mix references to `LAST_INSERT_ID()` and `LAST_INSERT_ID(expr)`, the effect is undefined.)

  If the previous statement returned an error, the value of `LAST_INSERT_ID()` is undefined. For transactional tables, if the statement is rolled back due to an error, the value of `LAST_INSERT_ID()` is left undefined. For manual `ROLLBACK`, the value of `LAST_INSERT_ID()` is not restored to that before the transaction; it remains as it was at the point of the `ROLLBACK`.

  Within the body of a stored routine (procedure or function) or a trigger, the value of `LAST_INSERT_ID()` changes the same way as for statements executed outside the body of these kinds of objects. The effect of a stored routine or trigger upon the value of `LAST_INSERT_ID()` that is seen by following statements depends on the kind of routine:

  + If a stored procedure executes statements that change the value of `LAST_INSERT_ID()`, the changed value is seen by statements that follow the procedure call.

  + For stored functions and triggers that change the value, the value is restored when the function or trigger ends, so statements coming after it do not see a changed value.

  The ID that was generated is maintained in the server on a *per-connection basis*. This means that the value returned by the function to a given client is the first `AUTO_INCREMENT` value generated for most recent statement affecting an `AUTO_INCREMENT` column *by that client*. This value cannot be affected by other clients, even if they generate `AUTO_INCREMENT` values of their own. This behavior ensures that each client can retrieve its own ID without concern for the activity of other clients, and without the need for locks or transactions.

  The value of `LAST_INSERT_ID()` is not changed if you set the `AUTO_INCREMENT` column of a row to a non-“magic” value (that is, a value that is not `NULL` and not `0`).

  Important

  If you insert multiple rows using a single `INSERT` statement, `LAST_INSERT_ID()` returns the value generated for the *first* inserted row *only*. The reason for this is to make it possible to reproduce easily the same `INSERT` statement against some other server.

  For example:

  ```
  mysql> USE test;

  mysql> CREATE TABLE t (
         id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
         name VARCHAR(10) NOT NULL
         );

  mysql> INSERT INTO t VALUES (NULL, 'Bob');

  mysql> SELECT * FROM t;
  +----+------+
  | id | name |
  +----+------+
  |  1 | Bob  |
  +----+------+

  mysql> SELECT LAST_INSERT_ID();
  +------------------+
  | LAST_INSERT_ID() |
  +------------------+
  |                1 |
  +------------------+

  mysql> INSERT INTO t VALUES
         (NULL, 'Mary'), (NULL, 'Jane'), (NULL, 'Lisa');

  mysql> SELECT * FROM t;
  +----+------+
  | id | name |
  +----+------+
  |  1 | Bob  |
  |  2 | Mary |
  |  3 | Jane |
  |  4 | Lisa |
  +----+------+

  mysql> SELECT LAST_INSERT_ID();
  +------------------+
  | LAST_INSERT_ID() |
  +------------------+
  |                2 |
  +------------------+
  ```

  Although the second `INSERT` statement inserted three new rows into `t`, the ID generated for the first of these rows was `2`, and it is this value that is returned by `LAST_INSERT_ID()` for the following `SELECT` statement.

  If you use `INSERT IGNORE` and the row is ignored, the `LAST_INSERT_ID()` remains unchanged from the current value (or 0 is returned if the connection has not yet performed a successful `INSERT`) and, for non-transactional tables, the `AUTO_INCREMENT` counter is not incremented. For `InnoDB` tables, the `AUTO_INCREMENT` counter is incremented if `innodb_autoinc_lock_mode` is set to `1` or `2`, as demonstrated in the following example:

  ```
  mysql> USE test;

  mysql> SELECT @@innodb_autoinc_lock_mode;
  +----------------------------+
  | @@innodb_autoinc_lock_mode |
  +----------------------------+
  |                          1 |
  +----------------------------+

  mysql> CREATE TABLE `t` (
         `id` INT(11) NOT NULL AUTO_INCREMENT,
         `val` INT(11) DEFAULT NULL,
         PRIMARY KEY (`id`),
         UNIQUE KEY `i1` (`val`)
         ) ENGINE=InnoDB;

  # Insert two rows

  mysql> INSERT INTO t (val) VALUES (1),(2);

  # With auto_increment_offset=1, the inserted rows
  # result in an AUTO_INCREMENT value of 3

  mysql> SHOW CREATE TABLE t\G
  *************************** 1. row ***************************
         Table: t
  Create Table: CREATE TABLE `t` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `val` int(11) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `i1` (`val`)
  ) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

  # LAST_INSERT_ID() returns the first automatically generated
  # value that is successfully inserted for the AUTO_INCREMENT column

  mysql> SELECT LAST_INSERT_ID();
  +------------------+
  | LAST_INSERT_ID() |
  +------------------+
  |                1 |
  +------------------+

  # The attempted insertion of duplicate rows fail but errors are ignored

  mysql> INSERT IGNORE INTO t (val) VALUES (1),(2);
  Query OK, 0 rows affected (0.00 sec)
  Records: 2  Duplicates: 2  Warnings: 0

  # With innodb_autoinc_lock_mode=1, the AUTO_INCREMENT counter
  # is incremented for the ignored rows

  mysql> SHOW CREATE TABLE t\G
  *************************** 1. row ***************************
         Table: t
  Create Table: CREATE TABLE `t` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `val` int(11) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `i1` (`val`)
  ) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

  # The LAST_INSERT_ID is unchanged because the previous insert was unsuccessful

  mysql> SELECT LAST_INSERT_ID();
  +------------------+
  | LAST_INSERT_ID() |
  +------------------+
  |                1 |
  +------------------+
  ```

  For more information, see Section 17.6.1.6, “AUTO\_INCREMENT Handling in InnoDB”.

  If *`expr`* is given as an argument to `LAST_INSERT_ID()`, the value of the argument is returned by the function and is remembered as the next value to be returned by `LAST_INSERT_ID()`. This can be used to simulate sequences:

  1. Create a table to hold the sequence counter and initialize it:

     ```
     mysql> CREATE TABLE sequence (id INT NOT NULL);
     mysql> INSERT INTO sequence VALUES (0);
     ```

  2. Use the table to generate sequence numbers like this:

     ```
     mysql> UPDATE sequence SET id=LAST_INSERT_ID(id+1);
     mysql> SELECT LAST_INSERT_ID();
     ```

     The `UPDATE` statement increments the sequence counter and causes the next call to `LAST_INSERT_ID()` to return the updated value. The `SELECT` statement retrieves that value. The `mysql_insert_id()` C API function can also be used to get the value. See mysql\_insert\_id().

  You can generate sequences without calling `LAST_INSERT_ID()`, but the utility of using the function this way is that the ID value is maintained in the server as the last automatically generated value. It is multi-user safe because multiple clients can issue the `UPDATE` statement and get their own sequence value with the `SELECT` statement (or `mysql_insert_id()`), without affecting or being affected by other clients that generate their own sequence values.

  Note that `mysql_insert_id()` is only updated after `INSERT` and `UPDATE` statements, so you cannot use the C API function to retrieve the value for `LAST_INSERT_ID(expr)` after executing other SQL statements like `SELECT` or `SET`.

* `ROLES_GRAPHML()`

  Returns a `utf8mb3` string containing a GraphML document representing memory role subgraphs. The `ROLE_ADMIN` privilege (or the deprecated `SUPER` privilege) is required to see content in the `<graphml>` element. Otherwise, the result shows only an empty element:

  ```
  mysql> SELECT ROLES_GRAPHML();
  +---------------------------------------------------+
  | ROLES_GRAPHML()                                   |
  +---------------------------------------------------+
  | <?xml version="1.0" encoding="UTF-8"?><graphml /> |
  +---------------------------------------------------+
  ```

* `ROW_COUNT()`

  `ROW_COUNT()` returns a value as follows:

  + DDL statements: 0. This applies to statements such as `CREATE TABLE` or `DROP TABLE`.

  + DML statements other than `SELECT`: The number of affected rows. This applies to statements such as `UPDATE`, `INSERT`, or `DELETE` (as before), but now also to statements such as `ALTER TABLE` and `LOAD DATA`.

  + `SELECT`: -1 if the statement returns a result set, or the number of rows “affected” if it does not. For example, for `SELECT * FROM t1`, `ROW_COUNT()` returns -1. For `SELECT * FROM t1 INTO OUTFILE 'file_name'`, `ROW_COUNT()` returns the number of rows written to the file.

  + `SIGNAL` statements: 0.

  For `UPDATE` statements, the affected-rows value by default is the number of rows actually changed. If you specify the `CLIENT_FOUND_ROWS` flag to `mysql_real_connect()` when connecting to **mysqld**, the affected-rows value is the number of rows “found”; that is, matched by the `WHERE` clause.

  For `REPLACE` statements, the affected-rows value is 2 if the new row replaced an old row, because in this case, one row was inserted after the duplicate was deleted.

  For `INSERT ... ON DUPLICATE KEY UPDATE` statements, the affected-rows value per row is 1 if the row is inserted as a new row, 2 if an existing row is updated, and 0 if an existing row is set to its current values. If you specify the `CLIENT_FOUND_ROWS` flag, the affected-rows value is 1 (not 0) if an existing row is set to its current values.

  The `ROW_COUNT()` value is similar to the value from the `mysql_affected_rows()` C API function and the row count that the **mysql** client displays following statement execution.

  ```
  mysql> INSERT INTO t VALUES(1),(2),(3);
  Query OK, 3 rows affected (0.00 sec)
  Records: 3  Duplicates: 0  Warnings: 0

  mysql> SELECT ROW_COUNT();
  +-------------+
  | ROW_COUNT() |
  +-------------+
  |           3 |
  +-------------+
  1 row in set (0.00 sec)

  mysql> DELETE FROM t WHERE i IN(1,2);
  Query OK, 2 rows affected (0.00 sec)

  mysql> SELECT ROW_COUNT();
  +-------------+
  | ROW_COUNT() |
  +-------------+
  |           2 |
  +-------------+
  1 row in set (0.00 sec)
  ```

  Important

  `ROW_COUNT()` is not replicated reliably using statement-based replication. This function is automatically replicated using row-based replication.

* `SCHEMA()`

  This function is a synonym for `DATABASE()`.

* `SESSION_USER()`

  `SESSION_USER()` is a synonym for `USER()`.

  Like `USER()`, this function can be used for the default value of a `VARCHAR` or `TEXT` column, as shown in the following `CREATE TABLE` statement:

  ```
  CREATE TABLE t (c VARCHAR(288) DEFAULT (SESSION_USER()));
  ```

* `SYSTEM_USER()`

  `SYSTEM_USER()` is a synonym for `USER()`.

  Note

  The `SYSTEM_USER()` function is distinct from the `SYSTEM_USER` privilege. The former returns the current MySQL account name. The latter distinguishes the system user and regular user account categories (see Section 8.2.11, “Account Categories”).

  Like `USER()`, this function can be used for the default value of a `VARCHAR` or `TEXT` column, as shown in the following `CREATE TABLE` statement:

  ```
  CREATE TABLE t (c VARCHAR(288) DEFAULT (SYSTEM_USER()));
  ```

* `USER()`

  Returns the current MySQL user name and host name as a string in the `utf8mb3` character set.

  ```
  mysql> SELECT USER();
          -> 'davida@localhost'
  ```

  The value indicates the user name you specified when connecting to the server, and the client host from which you connected. The value can be different from that of `CURRENT_USER()`.

  This function can be used for the default value of a `VARCHAR` or `TEXT` column, as shown in the following `CREATE TABLE` statement:

  ```
  CREATE TABLE t (c VARCHAR(288) DEFAULT (USER()));
  ```

* `VERSION()`

  Returns a string that indicates the MySQL server version. The string uses the `utf8mb3` character set. The value might have a suffix in addition to the version number. See the description of the `version` system variable in Section 7.1.8, “Server System Variables”.

  This function is unsafe for statement-based replication. A warning is logged if you use this function when `binlog_format` is set to `STATEMENT`.

  ```
  mysql> SELECT VERSION();
          -> '9.5.0-standard'
  ```
