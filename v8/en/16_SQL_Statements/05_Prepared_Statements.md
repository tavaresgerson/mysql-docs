## 15.5 Prepared Statements

MySQL 8.0 provides support for server-side prepared statements. This support takes advantage of the efficient client/server binary protocol. Using prepared statements with placeholders for parameter values has the following benefits:

* Less overhead for parsing the statement each time it is executed. Typically, database applications process large volumes of almost-identical statements, with only changes to literal or variable values in clauses such as `WHERE` for queries and deletes, `SET` for updates, and `VALUES` for inserts.

* Protection against SQL injection attacks. The parameter values can contain unescaped SQL quote and delimiter characters.

The following sections provide an overview of the characteristics of prepared statements:

* Prepared Statements in Application Programs
* Prepared Statements in SQL Scripts
* PREPARE, EXECUTE, and DEALLOCATE PREPARE Statements
* SQL Syntax Permitted in Prepared Statements

### Prepared Statements in Application Programs

You can use server-side prepared statements through client programming interfaces, including the [MySQL C API client library](/doc/c-api/8.0/en/) for C programs, MySQL Connector/J for Java programs, and MySQL Connector/NET for programs using .NET technologies. For example, the C API provides a set of function calls that make up its prepared statement API. See C API Prepared Statement Interface. Other language interfaces can provide support for prepared statements that use the binary protocol by linking in the C client library, one example being the [`mysqli` extension](http://php.net/mysqli), available in PHP 5.0 and higher.

### Prepared Statements in SQL Scripts

An alternative SQL interface to prepared statements is available. This interface is not as efficient as using the binary protocol through a prepared statement API, but requires no programming because it is available directly at the SQL level:

* You can use it when no programming interface is available to you.

* You can use it from any program that can send SQL statements to the server to be executed, such as the **mysql** client program.

* You can use it even if the client is using an old version of the client library.

SQL syntax for prepared statements is intended to be used for situations such as these:

* To test how prepared statements work in your application before coding it.

* To use prepared statements when you do not have access to a programming API that supports them.

* To interactively troubleshoot application issues with prepared statements.

* To create a test case that reproduces a problem with prepared statements, so that you can file a bug report.

### PREPARE, EXECUTE, and DEALLOCATE PREPARE Statements

SQL syntax for prepared statements is based on three SQL statements:

* `PREPARE` prepares a statement for execution (see Section 15.5.1, “PREPARE Statement”).

* `EXECUTE` executes a prepared statement (see Section 15.5.2, “EXECUTE Statement”).

* `DEALLOCATE PREPARE` releases a prepared statement (see Section 15.5.3, “DEALLOCATE PREPARE Statement”).

The following examples show two equivalent ways of preparing a statement that computes the hypotenuse of a triangle given the lengths of the two sides.

The first example shows how to create a prepared statement by using a string literal to supply the text of the statement:

```
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

```
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

```
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

To guard against too many prepared statements being created simultaneously, set the `max_prepared_stmt_count` system variable. To prevent the use of prepared statements, set the value to 0.

### SQL Syntax Permitted in Prepared Statements

The following SQL statements can be used as prepared statements:

```
ALTER TABLE
ALTER USER {DEFAULT ROLE}
ANALYZE TABLE
CACHE INDEX
CALL
CHANGE {MASTER | REPLICATION FILTER}
CHECKSUM
COMMIT
{CREATE | DROP} INDEX
{CREATE | RENAME | DROP} DATABASE
{CREATE | DROP} TABLE
{CREATE | RENAME | DROP} USER
{CREATE | DROP} VIEW
DELETE
DO
FLUSH
GRANT {ROLE}
INSERT
INSERT ... SELECT
INSTALL PLUGIN
KILL
LOAD INDEX INTO CACHE
OPTIMIZE TABLE
RENAME TABLE
REPAIR TABLE
REPLACE
RESET {MASTER | REPLICA}
REVOKE {ALL | ROLE}
SELECT
SET {PASSWORD | RESOURCE GROUP | ROLE | VARIABLE}
SHOW {BINLOG EVENTS | BINARY LOGS | CHARACTER SETS | COLLATIONS | DATABASES | ENGINE |
      ERRORS | EVENTS | FIELDS | FUNCTION CODE | FUNCTION STATUS | GRANTS | KEYS | OPEN TABLES |
      PLUGINS | PRIVILEGES | PROCEDURE CODE | PROCEDURE STATUS | PROCESSLIST | PROFILE | PROFILES |
      RELAYLOG EVENTS | REPLICAS | REPLICA STATUS | STATUS | PROCEDURE STATUS | TABLE STATUS | TABLES |
      TRIGGERS | VARIABLES | WARNINGS}
SHOW CREATE { DATABASE | EVENT | FUNCTION | PROCEDURE | TABLE | TRIGGER | USER | VIEW}
REPLICA {START | STOP}
TRUNCATE
UNINSTALL PLUGIN
UPDATE
```

Other statements are not supported.

For compliance with the SQL standard, which states that diagnostics statements are not preparable, MySQL does not support the following as prepared statements:

* `SHOW WARNINGS`, `SHOW COUNT(*) WARNINGS`

* `SHOW ERRORS`, `SHOW COUNT(*) ERRORS`

* Statements containing any reference to the `warning_count` or `error_count` system variable.

Generally, statements not permitted in SQL prepared statements are also not permitted in stored programs. Exceptions are noted in Section 27.8, “Restrictions on Stored Programs”.

Metadata changes to tables or views referred to by prepared statements are detected and cause automatic repreparation of the statement when it is next executed. For more information, see Section 10.10.3, “Caching of Prepared Statements and Stored Programs”.

Placeholders can be used for the arguments of the `LIMIT` clause when using prepared statements. See Section 15.2.13, “SELECT Statement”.

In prepared `CALL` statements used with `PREPARE` and `EXECUTE`, placeholder support for `OUT` and `INOUT` parameters is available beginning with MySQL 8.0. See Section 15.2.1, “CALL Statement”, for an example and a workaround for earlier versions. Placeholders can be used for `IN` parameters regardless of version.

SQL syntax for prepared statements cannot be used in nested fashion. That is, a statement passed to `PREPARE` cannot itself be a `PREPARE`, `EXECUTE`, or `DEALLOCATE PREPARE` statement.

SQL syntax for prepared statements is distinct from using prepared statement API calls. For example, you cannot use the `mysql_stmt_prepare()` C API function to prepare a `PREPARE`, `EXECUTE`, or `DEALLOCATE PREPARE` statement.

SQL syntax for prepared statements can be used within stored procedures, but not in stored functions or triggers. However, a cursor cannot be used for a dynamic statement that is prepared and executed with `PREPARE` and `EXECUTE`. The statement for a cursor is checked at cursor creation time, so the statement cannot be dynamic.

SQL syntax for prepared statements does not support multi-statements (that is, multiple statements within a single string separated by `;` characters).

To write C programs that use the `CALL` SQL statement to execute stored procedures that contain prepared statements, the `CLIENT_MULTI_RESULTS` flag must be enabled. This is because each `CALL` returns a result to indicate the call status, in addition to any result sets that might be returned by statements executed within the procedure.

`CLIENT_MULTI_RESULTS` can be enabled when you call `mysql_real_connect()`, either explicitly by passing the `CLIENT_MULTI_RESULTS` flag itself, or implicitly by passing `CLIENT_MULTI_STATEMENTS` (which also enables `CLIENT_MULTI_RESULTS`). For additional information, see Section 15.2.1, “CALL Statement”.


### 15.5.1 PREPARE Statement

```
PREPARE stmt_name FROM preparable_stmt
```

The `PREPARE` statement prepares a SQL statement and assigns it a name, *`stmt_name`*, by which to refer to the statement later. The prepared statement is executed with `EXECUTE` and released with `DEALLOCATE PREPARE`. For examples, see Section 15.5, “Prepared Statements”.

Statement names are not case-sensitive. *`preparable_stmt`* is either a string literal or a user variable that contains the text of the SQL statement. The text must represent a single statement, not multiple statements. Within the statement, `?` characters can be used as parameter markers to indicate where data values are to be bound to the query later when you execute it. The `?` characters should not be enclosed within quotation marks, even if you intend to bind them to string values. Parameter markers can be used only where data values should appear, not for SQL keywords, identifiers, and so forth.

If a prepared statement with the given name already exists, it is deallocated implicitly before the new statement is prepared. This means that if the new statement contains an error and cannot be prepared, an error is returned and no statement with the given name exists.

The scope of a prepared statement is the session within which it is created, which as several implications:

* A prepared statement created in one session is not available to other sessions.

* When a session ends, whether normally or abnormally, its prepared statements no longer exist. If auto-reconnect is enabled, the client is not notified that the connection was lost. For this reason, clients may wish to disable auto-reconnect. See Automatic Reconnection Control.

* A prepared statement created within a stored program continues to exist after the program finishes executing and can be executed outside the program later.

* A statement prepared in stored program context cannot refer to stored procedure or function parameters or local variables because they go out of scope when the program ends and would be unavailable were the statement to be executed later outside the program. As a workaround, refer instead to user-defined variables, which also have session scope; see Section 11.4, “User-Defined Variables”.

Beginning with MySQL 8.0.22, a parameter used in a prepared statement has its type determined when the statement is first prepared, and retains this type whenever `EXECUTE` is invoked for this prepared statement (unless the statement is reprepared, as explained later in this section). Rules for determining a parameter's type are listed here:

* A parameter which is an operand of a binary arithmetic operator has the same data type as the other operand.

* If both operands of a binary arithmetic operator are parameters, the type of the parameters is decided by the context of the operator.

* If a parameter is the operand of a unary arithmetic operator, the parameter's type is decided by the context of the operator.

* If an arithmetic operator has no type-determining context, the derived type for any parameters involved is `DOUBLE PRECISION` - FLOAT, DOUBLE"). This can happen, for example, when the parameter is a top-level node in a `SELECT` list, or when it is part of a comparison operator.

* A parameter which is an operand of a character string operator has the same derived type as the aggregated type of the other operands. If all operands of the operator are parameters, the derived type is `VARCHAR`; its collation is determined by the value of `collation_connection`.

* A parameter which is an operand of a temporal operator has type `DATETIME` if the operator returns a `DATETIME`, `TIME` if the operator returns a `TIME`, and `DATE` if the operator returns a `DATE`.

* A parameter which is an operand of a binary comparison operator has the same derived type as the other operand of the comparison.

* A parameter that is an operand of a ternary comparison operator such as `BETWEEN` has the same derived type as the aggregated type of the other operands.

* If all operands of a comparison operator are parameters, the derived type for each of them is `VARCHAR`, with collation determined by the value of `collation_connection`.

* A parameter that is an output operand of any of `CASE`, `COALESCE`, `IF`, `IFNULL`, or `NULLIF` has the same derived type as the aggregated type of the operator's other output operands.

* If all output operands of any of `CASE`, `COALESCE`, `IF`, `IFNULL`, or `NULLIF` are parameters, or they are all `NULL`, the type of the parameter is decided by the context of the operator.

* If the parameter is an operand of any of `CASE`, `COALESCE()`, `IF`, or `IFNULL`, and has no type-determining context, the derived type for each of the parameters involved is `VARCHAR`, and its collation is determined by the value of `collation_connection`.

* A parameter which is the operand of a `CAST()` has the same type as specified by the `CAST()`.

* If a parameter is an immediate member of a `SELECT` list that is not part of an `INSERT` statement, the derived type of the parameter is `VARCHAR`, and its collation is determined by the value of `collation_connection`.

* If a parameter is an immediate member of a `SELECT` list that is part of an `INSERT` statement, the derived type of the parameter is the type of the corresponding column into which the parameter is inserted.

* If a parameter is used as source for an assignment in a `SET` clause of an `UPDATE` statement or in the `ON DUPLICATE KEY UPDATE` clause of an `INSERT` statement, the derived type of the parameter is the type of the corresponding column which is updated by the `SET` or `ON DUPLICATE KEY UPDATE` clause.

* If a parameter is an argument of a function, the derived type depends on the function's return type.

For some combinations of actual type and derived type, an automatic repreparation of the statement is triggered, to ensure closer compatibility with previous versions of MySQL. Repreparation does not occur if any of the following conditions are true:

* `NULL` is used as the actual parameter value.
* A parameter is an operand of a `CAST()`. (Instead, a cast to the derived type is attempted, and an exception raised if the cast fails.)

* A parameter is a string. (In this case, an implicit `CAST(? AS derived_type)` is performed.)

* The derived type and actual type of the parameter are both `INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") and have the same sign.

* The parameter's derived type is `DECIMAL` - DECIMAL, NUMERIC") and its actual type is either `DECIMAL` or `INTEGER` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT").

* The derived type is `DOUBLE` - FLOAT, DOUBLE") and the actual type is any numeric type.

* Both the derived type and the actual type are string types.
* If the derived type is temporal and the actual type is temporal. *Exceptions*: The derived type is `TIME` and the actual type is not `TIME`; the derived type is `DATE` and the actual type is not `DATE`.

* The derived type is temporal and the actual type is numeric.

For cases other than those just listed, the statement is reprepared and the actual parameter types are used instead of the derived parameter types.

These rules also apply to a user variable referenced in a prepared statement.

Using a different data type for a given parameter or user variable within a prepared statement for executions of the statement subsequent to the first execution causes the statement to be reprepared. This is less efficient; it may also lead to the parameter's (or variable's) actual type to vary, and thus for results to be inconsistent, with subsequent executions of the prepared statement. For these reasons, it is advisable to use the same data type for a given parameter when re-executing a prepared statement.


### 15.5.2 EXECUTE Statement

```
EXECUTE stmt_name
    [USING @var_name [, @var_name] ...]
```

After preparing a statement with `PREPARE`, you execute it with an `EXECUTE` statement that refers to the prepared statement name. If the prepared statement contains any parameter markers, you must supply a `USING` clause that lists user variables containing the values to be bound to the parameters. Parameter values can be supplied only by user variables, and the `USING` clause must name exactly as many variables as the number of parameter markers in the statement.

You can execute a given prepared statement multiple times, passing different variables to it or setting the variables to different values before each execution.

For examples, see Section 15.5, “Prepared Statements”.


### 15.5.3 DEALLOCATE PREPARE Statement

```
{DEALLOCATE | DROP} PREPARE stmt_name
```

To deallocate a prepared statement produced with `PREPARE`, use a `DEALLOCATE PREPARE` statement that refers to the prepared statement name. Attempting to execute a prepared statement after deallocating it results in an error. If too many prepared statements are created and not deallocated by either the `DEALLOCATE PREPARE` statement or the end of the session, you might encounter the upper limit enforced by the `max_prepared_stmt_count` system variable.

For examples, see Section 15.5, “Prepared Statements”.
