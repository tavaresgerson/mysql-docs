## 13.5 Prepared Statements

[13.5.1 PREPARE Statement](prepare.html)

[13.5.2 EXECUTE Statement](execute.html)

[13.5.3 DEALLOCATE PREPARE Statement](deallocate-prepare.html)

MySQL 5.7 provides support for server-side prepared statements. This support takes advantage of the efficient client/server binary protocol. Using prepared statements with placeholders for parameter values has the following benefits:

* Less overhead for parsing the statement each time it is executed. Typically, database applications process large volumes of almost-identical statements, with only changes to literal or variable values in clauses such as `WHERE` for queries and deletes, `SET` for updates, and `VALUES` for inserts.

* Protection against SQL injection attacks. The parameter values can contain unescaped SQL quote and delimiter characters.

The following sections provide an overview of the characteristics of prepared statements:

* [Prepared Statements in Application Programs](sql-prepared-statements.html#prepared-statements-in-applications "Prepared Statements in Application Programs")
* [Prepared Statements in SQL Scripts](sql-prepared-statements.html#prepared-statements-in-scripts "Prepared Statements in SQL Scripts")
* [PREPARE, EXECUTE, and DEALLOCATE PREPARE Statements](sql-prepared-statements.html#prepared-statement-types "PREPARE, EXECUTE, and DEALLOCATE PREPARE Statements")
* [SQL Syntax Permitted in Prepared Statements](sql-prepared-statements.html#prepared-statements-permitted "SQL Syntax Permitted in Prepared Statements")

### Prepared Statements in Application Programs

You can use server-side prepared statements through client programming interfaces, including the [MySQL C API client library](/doc/c-api/5.7/en/) for C programs, [MySQL Connector/J](/doc/connector-j/en/) for Java programs, and [MySQL Connector/NET](/doc/connector-net/en/) for programs using .NET technologies. For example, the C API provides a set of function calls that make up its prepared statement API. See [C API Prepared Statement Interface](/doc/c-api/5.7/en/c-api-prepared-statement-interface.html). Other language interfaces can provide support for prepared statements that use the binary protocol by linking in the C client library, one example being the [`mysqli` extension](http://php.net/mysqli), available in PHP 5.0 and higher.

### Prepared Statements in SQL Scripts

An alternative SQL interface to prepared statements is available. This interface is not as efficient as using the binary protocol through a prepared statement API, but requires no programming because it is available directly at the SQL level:

* You can use it when no programming interface is available to you.

* You can use it from any program that can send SQL statements to the server to be executed, such as the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client program.

* You can use it even if the client is using an old version of the client library.

SQL syntax for prepared statements is intended to be used for situations such as these:

* To test how prepared statements work in your application before coding it.

* To use prepared statements when you do not have access to a programming API that supports them.

* To interactively troubleshoot application issues with prepared statements.

* To create a test case that reproduces a problem with prepared statements, so that you can file a bug report.

### PREPARE, EXECUTE, and DEALLOCATE PREPARE Statements

SQL syntax for prepared statements is based on three SQL statements:

* [`PREPARE`](prepare.html "13.5.1 PREPARE Statement") prepares a statement for execution (see [Section 13.5.1, “PREPARE Statement”](prepare.html "13.5.1 PREPARE Statement")).

* [`EXECUTE`](execute.html "13.5.2 EXECUTE Statement") executes a prepared statement (see [Section 13.5.2, “EXECUTE Statement”](execute.html "13.5.2 EXECUTE Statement")).

* [`DEALLOCATE PREPARE`](deallocate-prepare.html "13.5.3 DEALLOCATE PREPARE Statement") releases a prepared statement (see [Section 13.5.3, “DEALLOCATE PREPARE Statement”](deallocate-prepare.html "13.5.3 DEALLOCATE PREPARE Statement")).

The following examples show two equivalent ways of preparing a statement that computes the hypotenuse of a triangle given the lengths of the two sides.

The first example shows how to create a prepared statement by using a string literal to supply the text of the statement:

```sql
mysql> PREPARE stmt1 FROM 'SELECT SQRT(POW(?,2) + POW(?,2)) AS hypotenuse';
mysql> SET @a = 3;
mysql> SET @b = 4;
mysql> EXECUTE stmt1 USING @a, @b;
+------------+
| hypotenuse |
+------------+
|          5 |
+------------+
mysql> DEALLOCATE PREPARE stmt1;
```

The second example is similar, but supplies the text of the statement as a user variable:

```sql
mysql> SET @s = 'SELECT SQRT(POW(?,2) + POW(?,2)) AS hypotenuse';
mysql> PREPARE stmt2 FROM @s;
mysql> SET @a = 6;
mysql> SET @b = 8;
mysql> EXECUTE stmt2 USING @a, @b;
+------------+
| hypotenuse |
+------------+
|         10 |
+------------+
mysql> DEALLOCATE PREPARE stmt2;
```

Here is an additional example that demonstrates how to choose the table on which to perform a query at runtime, by storing the name of the table as a user variable:

```sql
mysql> USE test;
mysql> CREATE TABLE t1 (a INT NOT NULL);
mysql> INSERT INTO t1 VALUES (4), (8), (11), (32), (80);

mysql> SET @table = 't1';
mysql> SET @s = CONCAT('SELECT * FROM ', @table);

mysql> PREPARE stmt3 FROM @s;
mysql> EXECUTE stmt3;
+----+
| a  |
+----+
|  4 |
|  8 |
| 11 |
| 32 |
| 80 |
+----+

mysql> DEALLOCATE PREPARE stmt3;
```

A prepared statement is specific to the session in which it was created. If you terminate a session without deallocating a previously prepared statement, the server deallocates it automatically.

A prepared statement is also global to the session. If you create a prepared statement within a stored routine, it is not deallocated when the stored routine ends.

To guard against too many prepared statements being created simultaneously, set the [`max_prepared_stmt_count`](server-system-variables.html#sysvar_max_prepared_stmt_count) system variable. To prevent the use of prepared statements, set the value to 0.

### SQL Syntax Permitted in Prepared Statements

The following SQL statements can be used as prepared statements:

```sql
ALTER TABLE
ALTER USER
ANALYZE TABLE
CACHE INDEX
CALL
CHANGE MASTER
CHECKSUM {TABLE | TABLES}
COMMIT
{CREATE | DROP} INDEX
{CREATE | RENAME | DROP} DATABASE
{CREATE | DROP} TABLE
{CREATE | RENAME | DROP} USER
{CREATE | DROP} VIEW
DELETE
DO
FLUSH {TABLE | TABLES | TABLES WITH READ LOCK | HOSTS | PRIVILEGES
  | LOGS | STATUS | MASTER | SLAVE | DES_KEY_FILE | USER_RESOURCES}
GRANT
INSERT
INSTALL PLUGIN
KILL
LOAD INDEX INTO CACHE
OPTIMIZE TABLE
RENAME TABLE
REPAIR TABLE
REPLACE
RESET {MASTER | SLAVE | QUERY CACHE}
REVOKE
SELECT
SET
SHOW BINLOG EVENTS
SHOW CREATE {PROCEDURE | FUNCTION | EVENT | TABLE | VIEW}
SHOW {MASTER | BINARY} LOGS
SHOW {MASTER | SLAVE} STATUS
SLAVE {START | STOP}
TRUNCATE TABLE
UNINSTALL PLUGIN
UPDATE
```

Other statements are not supported.

For compliance with the SQL standard, which states that diagnostics statements are not preparable, MySQL does not support the following as prepared statements:

* `SHOW WARNINGS`, `SHOW COUNT(*) WARNINGS`

* `SHOW ERRORS`, `SHOW COUNT(*) ERRORS`

* Statements containing any reference to the [`warning_count`](server-system-variables.html#sysvar_warning_count) or [`error_count`](server-system-variables.html#sysvar_error_count) system variable.

Generally, statements not permitted in SQL prepared statements are also not permitted in stored programs. Exceptions are noted in [Section 23.8, “Restrictions on Stored Programs”](stored-program-restrictions.html "23.8 Restrictions on Stored Programs").

Metadata changes to tables or views referred to by prepared statements are detected and cause automatic repreparation of the statement when it is next executed. For more information, see [Section 8.10.4, “Caching of Prepared Statements and Stored Programs”](statement-caching.html "8.10.4 Caching of Prepared Statements and Stored Programs").

Placeholders can be used for the arguments of the `LIMIT` clause when using prepared statements. See [Section 13.2.9, “SELECT Statement”](select.html "13.2.9 SELECT Statement").

In prepared [`CALL`](call.html "13.2.1 CALL Statement") statements used with [`PREPARE`](prepare.html "13.5.1 PREPARE Statement") and [`EXECUTE`](execute.html "13.5.2 EXECUTE Statement"), placeholder support for `OUT` and `INOUT` parameters is available beginning with MySQL 5.7. See [Section 13.2.1, “CALL Statement”](call.html "13.2.1 CALL Statement"), for an example and a workaround for earlier versions. Placeholders can be used for `IN` parameters regardless of version.

SQL syntax for prepared statements cannot be used in nested fashion. That is, a statement passed to [`PREPARE`](prepare.html "13.5.1 PREPARE Statement") cannot itself be a [`PREPARE`](prepare.html "13.5.1 PREPARE Statement"), [`EXECUTE`](execute.html "13.5.2 EXECUTE Statement"), or [`DEALLOCATE PREPARE`](deallocate-prepare.html "13.5.3 DEALLOCATE PREPARE Statement") statement.

SQL syntax for prepared statements is distinct from using prepared statement API calls. For example, you cannot use the [`mysql_stmt_prepare()`](/doc/c-api/5.7/en/mysql-stmt-prepare.html) C API function to prepare a [`PREPARE`](prepare.html "13.5.1 PREPARE Statement"), [`EXECUTE`](execute.html "13.5.2 EXECUTE Statement"), or [`DEALLOCATE PREPARE`](deallocate-prepare.html "13.5.3 DEALLOCATE PREPARE Statement") statement.

SQL syntax for prepared statements can be used within stored procedures, but not in stored functions or triggers. However, a cursor cannot be used for a dynamic statement that is prepared and executed with [`PREPARE`](prepare.html "13.5.1 PREPARE Statement") and [`EXECUTE`](execute.html "13.5.2 EXECUTE Statement"). The statement for a cursor is checked at cursor creation time, so the statement cannot be dynamic.

SQL syntax for prepared statements does not support multi-statements (that is, multiple statements within a single string separated by `;` characters).

Prepared statements use the query cache under the conditions described in [Section 8.10.3.1, “How the Query Cache Operates”](query-cache-operation.html "8.10.3.1 How the Query Cache Operates").

To write C programs that use the [`CALL`](call.html "13.2.1 CALL Statement") SQL statement to execute stored procedures that contain prepared statements, the `CLIENT_MULTI_RESULTS` flag must be enabled. This is because each [`CALL`](call.html "13.2.1 CALL Statement") returns a result to indicate the call status, in addition to any result sets that might be returned by statements executed within the procedure.

`CLIENT_MULTI_RESULTS` can be enabled when you call [`mysql_real_connect()`](/doc/c-api/5.7/en/mysql-real-connect.html), either explicitly by passing the `CLIENT_MULTI_RESULTS` flag itself, or implicitly by passing `CLIENT_MULTI_STATEMENTS` (which also enables `CLIENT_MULTI_RESULTS`). For additional information, see [Section 13.2.1, “CALL Statement”](call.html "13.2.1 CALL Statement").
