## 1.7 MySQL Standards Compliance

This section describes how MySQL relates to the ANSI/ISO SQL standards. MySQL Server has many extensions to the SQL standard, and here you can find out what they are and how to use them. You can also find information about functionality missing from MySQL Server, and how to work around some of the differences.

The SQL standard has been evolving since 1986 and several versions exist. In this manual, “SQL-92” refers to the standard released in 1992. “SQL:1999”, “SQL:2003”, “SQL:2008”, and “SQL:2011” refer to the versions of the standard released in the corresponding years, with the last being the most recent version. We use the phrase “the SQL standard” or “standard SQL” to mean the current version of the SQL Standard at any time.

One of our main goals with the product is to continue to work toward compliance with the SQL standard, but without sacrificing speed or reliability. We are not afraid to add extensions to SQL or support for non-SQL features if this greatly increases the usability of MySQL Server for a large segment of our user base. The `HANDLER` interface is an example of this strategy. See Section 15.2.5, “HANDLER Statement”.

We continue to support transactional and nontransactional databases to satisfy both mission-critical 24/7 usage and heavy Web or logging usage.

MySQL Server was originally designed to work with medium-sized databases (10-100 million rows, or about 100MB per table) on small computer systems. Today MySQL Server handles terabyte-sized databases.

We are not targeting real-time support, although MySQL replication capabilities offer significant functionality.

MySQL supports ODBC levels 0 to 3.51.

MySQL supports high-availability database clustering using the `NDBCLUSTER` storage engine. See Chapter 25, *MySQL NDB Cluster 9.5*.

We implement XML functionality which supports most of the W3C XPath standard. See Section 14.11, “XML Functions”.

MySQL supports a native JSON data type as defined by RFC 7159, and based on the ECMAScript standard (ECMA-262). See Section 13.5, “The JSON Data Type”. MySQL also implements a subset of the SQL/JSON functions specified by a pre-publication draft of the SQL:2016 standard; see Section 14.17, “JSON Functions”, for more information.

### Selecting SQL Modes

The MySQL server can operate in different SQL modes, and can apply these modes differently for different clients, depending on the value of the `sql_mode` system variable. DBAs can set the global SQL mode to match site server operating requirements, and each application can set its session SQL mode to its own requirements.

Modes affect the SQL syntax MySQL supports and the data validation checks it performs. This makes it easier to use MySQL in different environments and to use MySQL together with other database servers.

For more information on setting the SQL mode, see Section 7.1.11, “Server SQL Modes”.

### Running MySQL in ANSI Mode

To run MySQL Server in ANSI mode, start **mysqld** with the `--ansi` option. Running the server in ANSI mode is the same as starting it with the following options:

```
--transaction-isolation=SERIALIZABLE --sql-mode=ANSI
```

To achieve the same effect at runtime, execute these two statements:

```
SET GLOBAL TRANSACTION ISOLATION LEVEL SERIALIZABLE;
SET GLOBAL sql_mode = 'ANSI';
```

You can see that setting the `sql_mode` system variable to `'ANSI'` enables all SQL mode options that are relevant for ANSI mode as follows:

```
mysql> SET GLOBAL sql_mode='ANSI';
mysql> SELECT @@GLOBAL.sql_mode;
        -> 'REAL_AS_FLOAT,PIPES_AS_CONCAT,ANSI_QUOTES,IGNORE_SPACE,ANSI'
```

Running the server in ANSI mode with `--ansi` is not quite the same as setting the SQL mode to `'ANSI'` because the `--ansi` option also sets the transaction isolation level.

See Section 7.1.7, “Server Command Options”.


### 1.7.1 MySQL Extensions to Standard SQL

MySQL Server supports some extensions that you are not likely to find in other SQL DBMSs. Be warned that if you use them, your code is most likely not portable to other SQL servers. In some cases, you can write code that includes MySQL extensions, but is still portable, by using comments of the following form:

```
/*! MySQL-specific code */
```

In this case, MySQL Server parses and executes the code within the comment as it would any other SQL statement, but other SQL servers should ignore the extensions. For example, MySQL Server recognizes the `STRAIGHT_JOIN` keyword in the following statement, but other servers should not:

```
SELECT /*! STRAIGHT_JOIN */ col1 FROM table1,table2 WHERE ...
```

If you add a version number after the `!` character, the syntax within the comment is executed only if the MySQL version is greater than or equal to the specified version number. The `KEY_BLOCK_SIZE` clause in the following comment is executed only by servers from MySQL 5.1.10 or higher:

```
CREATE TABLE t1(a INT, KEY (a)) /*!50110 KEY_BLOCK_SIZE=1024 */;
```

The following descriptions list MySQL extensions, organized by category.

* Organization of data on disk

  MySQL Server maps each database to a directory under the MySQL data directory, and maps tables within a database to file names in the database directory. Consequently, database and table names are case-sensitive in MySQL Server on operating systems that have case-sensitive file names (such as most Unix systems). See Section 11.2.3, “Identifier Case Sensitivity”.

* General language syntax

  + By default, strings can be enclosed by `"` as well as `'`. If the `ANSI_QUOTES` SQL mode is enabled, strings can be enclosed only by `'` and the server interprets strings enclosed by `"` as identifiers.

  + `\` is the escape character in strings.
  + In SQL statements, you can access tables from different databases with the *`db_name.tbl_name`* syntax. Some SQL servers provide the same functionality but call this `User space`. MySQL Server doesn't support tablespaces such as used in statements like this: `CREATE TABLE ralph.my_table ... IN my_tablespace`.

* SQL statement syntax

  + The `ANALYZE TABLE`, `CHECK TABLE`, `OPTIMIZE TABLE`, and `REPAIR TABLE` statements.

  + The `CREATE DATABASE`, `DROP DATABASE`, and `ALTER DATABASE` statements. See Section 15.1.14, “CREATE DATABASE Statement”, Section 15.1.28, “DROP DATABASE Statement”, and Section 15.1.2, “ALTER DATABASE Statement”.

  + The `DO` statement.
  + [`EXPLAIN SELECT`](explain.html "15.8.2 EXPLAIN Statement") to obtain a description of how tables are processed by the query optimizer.

  + The `FLUSH` and `RESET` statements.

  + The `SET` statement. See Section 15.7.6.1, “SET Syntax for Variable Assignment”.

  + The `SHOW` statement. See Section 15.7.7, “SHOW Statements”. The information produced by many of the MySQL-specific `SHOW` statements can be obtained in more standard fashion by using `SELECT` to query `INFORMATION_SCHEMA`. See Chapter 28, *INFORMATION\_SCHEMA Tables*.

  + Use of `LOAD DATA`. In many cases, this syntax is compatible with Oracle `LOAD DATA`. See Section 15.2.9, “LOAD DATA Statement”.

  + Use of `RENAME TABLE`. See Section 15.1.41, “RENAME TABLE Statement”.

  + Use of `REPLACE` instead of `DELETE` plus `INSERT`. See Section 15.2.12, “REPLACE Statement”.

  + Use of `CHANGE col_name`, `DROP col_name`, or `DROP INDEX`, `IGNORE` or `RENAME` in `ALTER TABLE` statements. Use of multiple `ADD`, `ALTER`, `DROP`, or `CHANGE` clauses in an `ALTER TABLE` statement. See Section 15.1.11, “ALTER TABLE Statement”.

  + Use of index names, indexes on a prefix of a column, and use of `INDEX` or `KEY` in [`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement") statements. See Section 15.1.24, “CREATE TABLE Statement”.

  + Use of `TEMPORARY` or `IF NOT EXISTS` with [`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement").

  + Use of `IF EXISTS` with `DROP TABLE` and `DROP DATABASE`.

  + The capability of dropping multiple tables with a single `DROP TABLE` statement.

  + The `ORDER BY` and `LIMIT` clauses of the `UPDATE` and `DELETE` statements.

  + `INSERT INTO tbl_name SET col_name = ...` syntax.

  + The `DELAYED` clause of the `INSERT` and `REPLACE` statements.

  + The `LOW_PRIORITY` clause of the `INSERT`, `REPLACE`, `DELETE`, and `UPDATE` statements.

  + Use of `INTO OUTFILE` or `INTO DUMPFILE` in `SELECT` statements. See Section 15.2.13, “SELECT Statement”.

  + Options such as `STRAIGHT_JOIN` or `SQL_SMALL_RESULT` in `SELECT` statements.

  + You don't need to name all selected columns in the `GROUP BY` clause. This gives better performance for some very specific, but quite normal queries. See Section 14.19, “Aggregate Functions”.

  + You can specify `ASC` and `DESC` with `GROUP BY`, not just with `ORDER BY`.

  + The ability to set variables in a statement with the `:=` assignment operator. See Section 11.4, “User-Defined Variables”.

* Data types

  + The `MEDIUMINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `SET`, and `ENUM` data types, and the various `BLOB` and `TEXT` data types.

  + The `AUTO_INCREMENT`, `BINARY`, `NULL`, `UNSIGNED`, and `ZEROFILL` data type attributes.

* Functions and operators

  + To make it easier for users who migrate from other SQL environments, MySQL Server supports aliases for many functions. For example, all string functions support both standard SQL syntax and ODBC syntax.

  + MySQL Server understands the `||` and `&&` operators to mean logical OR and AND, as in the C programming language. In MySQL Server, `||` and `OR` are synonyms, as are `&&` and `AND`. Because of this nice syntax, MySQL Server doesn't support the standard SQL `||` operator for string concatenation; use `CONCAT()` instead. Because `CONCAT()` takes any number of arguments, it is easy to convert use of the `||` operator to MySQL Server.

  + Use of [`COUNT(DISTINCT value_list)`](aggregate-functions.html#function_count) where *`value_list`* has more than one element.

  + String comparisons are case-insensitive by default, with sort ordering determined by the collation of the current character set, which is `utf8mb4` by default. To perform case-sensitive comparisons instead, you should declare your columns with the `BINARY` attribute or use the `BINARY` cast, which causes comparisons to be done using the underlying character code values rather than a lexical ordering.

  + The `%` operator is a synonym for `MOD()`. That is, `N % M` is equivalent to `MOD(N,M)`. `%` is supported for C programmers and for compatibility with PostgreSQL.

  + The `=`, `<>`, `<=`, `<`, `>=`, `>`, `<<`, `>>`, `<=>`, `AND`, `OR`, or `LIKE` operators may be used in expressions in the output column list (to the left of the `FROM`) in `SELECT` statements. For example:

    ```
    mysql> SELECT col1=1 AND col2=2 FROM my_table;
    ```

  + The `LAST_INSERT_ID()` function returns the most recent `AUTO_INCREMENT` value. See Section 14.15, “Information Functions”.

  + `LIKE` is permitted on numeric values.

  + The `REGEXP` and `NOT REGEXP` extended regular expression operators.

  + `CONCAT()` or `CHAR()` with one argument or more than two arguments. (In MySQL Server, these functions can take a variable number of arguments.)

  + The `BIT_COUNT()`, `CASE`, `ELT()`, `FROM_DAYS()`, `FORMAT()`, `IF()`, `MD5()`, `PERIOD_ADD()`, `PERIOD_DIFF()`, `TO_DAYS()`, and `WEEKDAY()` functions.

  + Use of `TRIM()` to trim substrings. Standard SQL supports removal of single characters only.

  + The `GROUP BY` functions `STD()`, `BIT_OR()`, `BIT_AND()`, `BIT_XOR()`, and `GROUP_CONCAT()`. See Section 14.19, “Aggregate Functions”.


### 1.7.2 MySQL Differences from Standard SQL

We try to make MySQL Server follow the ANSI SQL standard and the ODBC SQL standard, but MySQL Server performs operations differently in some cases:

* There are several differences between the MySQL and standard SQL privilege systems. For example, in MySQL, privileges for a table are not automatically revoked when you delete a table. You must explicitly issue a `REVOKE` statement to revoke privileges for a table. For more information, see Section 15.7.1.8, “REVOKE Statement”.

* The `CAST()` function does not support cast to `REAL` - FLOAT, DOUBLE") or `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). See Section 14.10, “Cast Functions and Operators”.


#### 1.7.2.1 SELECT INTO TABLE Differences

MySQL Server doesn't support the `SELECT ... INTO TABLE` Sybase SQL extension. Instead, MySQL Server supports the [`INSERT INTO ... SELECT`](insert-select.html "15.2.7.1 INSERT ... SELECT Statement") standard SQL syntax, which is basically the same thing. See Section 15.2.7.1, “INSERT ... SELECT Statement”. For example:

```
INSERT INTO tbl_temp2 (fld_id)
    SELECT tbl_temp1.fld_order_id
    FROM tbl_temp1 WHERE tbl_temp1.fld_order_id > 100;
```

Alternatively, you can use [`SELECT ... INTO OUTFILE`](select-into.html "15.2.13.1 SELECT ... INTO Statement") or [`CREATE TABLE ... SELECT`](create-table.html "15.1.24 CREATE TABLE Statement").

You can use [`SELECT ... INTO`](select.html "15.2.13 SELECT Statement") with user-defined variables. The same syntax can also be used inside stored routines using cursors and local variables. See Section 15.2.13.1, “SELECT ... INTO Statement”.


#### 1.7.2.2 UPDATE Differences

If you access a column from the table to be updated in an expression, `UPDATE` uses the current value of the column. The second assignment in the following statement sets `col2` to the current (updated) `col1` value, not the original `col1` value. The result is that `col1` and `col2` have the same value. This behavior differs from standard SQL.

```
UPDATE t1 SET col1 = col1 + 1, col2 = col1;
```


#### 1.7.2.3 FOREIGN KEY Constraint Differences

The MySQL implementation of foreign key constraints differs from the SQL standard in the following key respects:

* If there are several rows in the parent table with the same referenced key value, `InnoDB` performs a foreign key check as if the other parent rows with the same key value do not exist. For example, if you define a `RESTRICT` type constraint, and there is a child row with several parent rows, `InnoDB` does not permit the deletion of any of the parent rows. This is shown in the following example:

  ```
  mysql> CREATE TABLE parent (
      ->     id INT,
      ->     INDEX (id)
      -> ) ENGINE=InnoDB;
  Query OK, 0 rows affected (0.04 sec)

  mysql> CREATE TABLE child (
      ->     id INT,
      ->     parent_id INT,
      ->     INDEX par_ind (parent_id),
      ->     FOREIGN KEY (parent_id)
      ->         REFERENCES parent(id)
      ->         ON DELETE RESTRICT
      -> ) ENGINE=InnoDB;
  Query OK, 0 rows affected (0.02 sec)

  mysql> INSERT INTO parent (id)
      ->     VALUES ROW(1), ROW(2), ROW(3), ROW(1);
  Query OK, 4 rows affected (0.01 sec)
  Records: 4  Duplicates: 0  Warnings: 0

  mysql> INSERT INTO child (id,parent_id)
      ->     VALUES ROW(1,1), ROW(2,2), ROW(3,3);
  Query OK, 3 rows affected (0.01 sec)
  Records: 3  Duplicates: 0  Warnings: 0

  mysql> DELETE FROM parent WHERE id=1;
  ERROR 1451 (23000): Cannot delete or update a parent row: a foreign key
  constraint fails (`test`.`child`, CONSTRAINT `child_ibfk_1` FOREIGN KEY
  (`parent_id`) REFERENCES `parent` (`id`) ON DELETE RESTRICT)
  ```

* If `ON UPDATE CASCADE` or `ON UPDATE SET NULL` recurses to update the *same table* it has previously updated during the same cascade, it acts like `RESTRICT`. This means that you cannot use self-referential `ON UPDATE CASCADE` or `ON UPDATE SET NULL` operations. This is to prevent infinite loops resulting from cascaded updates. A self-referential `ON DELETE SET NULL`, on the other hand, is possible, as is a self-referential `ON DELETE CASCADE`. Cascading operations may not be nested more than 15 levels deep.

* In an SQL statement that inserts, deletes, or updates many rows, foreign key constraints (like unique constraints) are checked row-by-row. When performing foreign key checks, `InnoDB` sets shared row-level locks on child or parent records that it must examine. MySQL checks foreign key constraints immediately; the check is not deferred to transaction commit. According to the SQL standard, the default behavior should be deferred checking. That is, constraints are only checked after the *entire SQL statement* has been processed. This means that it is not possible to delete a row that refers to itself using a foreign key.

* No storage engine, including `InnoDB`, recognizes or enforces the `MATCH` clause used in referential-integrity constraint definitions. Use of an explicit `MATCH` clause does not have the specified effect, and it causes `ON DELETE` and `ON UPDATE` clauses to be ignored. Specifying the `MATCH` should be avoided.

  The `MATCH` clause in the SQL standard controls how `NULL` values in a composite (multiple-column) foreign key are handled when comparing to a primary key in the referenced table. MySQL essentially implements the semantics defined by `MATCH SIMPLE`, which permits a foreign key to be all or partially `NULL`. In that case, a (child table) row containing such a foreign key can be inserted even though it does not match any row in the referenced (parent) table. (It is possible to implement other semantics using triggers.)

* A `FOREIGN KEY` constraint that references a non-`UNIQUE` key is not standard SQL but rather an `InnoDB` extension that is now deprecated, and must be enabled by setting `restrict_fk_on_non_standard_key`. You should expect support for use of nonstandard keys to be removed in a future version of MySQL, and migrate away from them now.

  The `NDB` storage engine requires an explicit unique key (or primary key) on any column referenced as a foreign key, as per the SQL standard.

* For storage engines that do not support foreign keys (such as `MyISAM`), MySQL Server parses and ignores foreign key specifications.

* Previous versions of MySQL parsed but ignored “inline `REFERENCES` specifications” (as defined in the SQL standard) where the references were defined as part of the column specification. MySQL 9.5 accepts such `REFERENCES` clauses and enforces the foreign keys thus created. In addition, MySQL 9.5 allows implicit references to the parent table's primary key. This means that the following syntax is valid:

  ```
  CREATE TABLE person (
      id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
      name CHAR(60) NOT NULL,
      PRIMARY KEY (id)
  );

  CREATE TABLE shirt (
      id SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
      style ENUM('tee', 'polo', 'dress') NOT NULL,
      color ENUM('red', 'blue', 'yellow', 'white', 'black') NOT NULL,
      owner SMALLINT UNSIGNED NOT NULL REFERENCES person,
      PRIMARY KEY (id)
  );
  ```

  You can see that this works by checking the output of `SHOW CREATE TABLE` or `DESCRIBE`, like this:

  ```
  mysql> SHOW CREATE TABLE shirt\G
  *************************** 1. row ***************************
         Table: shirt
  Create Table: CREATE TABLE `shirt` (
    `id` smallint unsigned NOT NULL AUTO_INCREMENT,
    `style` enum('tee','polo','dress') NOT NULL,
    `color` enum('red','blue','yellow','white','black') NOT NULL,
    `owner` smallint unsigned NOT NULL,
    PRIMARY KEY (`id`),
    KEY `owner` (`owner`),
    CONSTRAINT `shirt_ibfk_1` FOREIGN KEY (`owner`) REFERENCES `person` (`id`)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  ```

For more information about foreign key constraints, see Section 15.1.24.5, “FOREIGN KEY Constraints”.


#### 1.7.2.4 '--' as the Start of a Comment

Standard SQL uses the C syntax `/* this is a comment */` for comments, and MySQL Server supports this syntax as well. MySQL also support extensions to this syntax that enable MySQL-specific SQL to be embedded in the comment; see Section 11.7, “Comments”.

MySQL Server also uses `#` as the start comment character. This is nonstandard.

Standard SQL also uses “`--`” as a start-comment sequence. MySQL Server supports a variant of the `--` comment style; the `--` start-comment sequence is accepted as such, but must be followed by a whitespace character such as a space or newline. The space is intended to prevent problems with generated SQL queries that use constructs such as the following, which updates the balance to reflect a charge:

```
UPDATE account SET balance=balance-charge
WHERE account_id=user_id
```

Consider what happens when `charge` has a negative value such as `-1`, which might be the case when an amount is credited to the account. In this case, the generated statement looks like this:

```
UPDATE account SET balance=balance--1
WHERE account_id=5752;
```

`balance--1` is valid standard SQL, but `--` is interpreted as the start of a comment, and part of the expression is discarded. The result is a statement that has a completely different meaning than intended:

```
UPDATE account SET balance=balance
WHERE account_id=5752;
```

This statement produces no change in value at all. To keep this from happening, MySQL requires a whitespace character following the `--` for it to be recognized as a start-comment sequence in MySQL Server, so that an expression such as `balance--1` is always safe to use.


### 1.7.3 How MySQL Deals with Constraints

MySQL enables you to work both with transactional tables that permit rollback and with nontransactional tables that do not. Because of this, constraint handling is a bit different in MySQL than in other DBMSs. We must handle the case when you have inserted or updated a lot of rows in a nontransactional table for which changes cannot be rolled back when an error occurs.

The basic philosophy is that MySQL Server tries to produce an error for anything that it can detect while parsing a statement to be executed, and tries to recover from any errors that occur while executing the statement. We do this in most cases, but not yet for all.

The options MySQL has when an error occurs are to stop the statement in the middle or to recover as well as possible from the problem and continue. By default, the server follows the latter course. This means, for example, that the server may coerce invalid values to the closest valid values.

Several SQL mode options are available to provide greater control over handling of bad data values and whether to continue statement execution or abort when errors occur. Using these options, you can configure MySQL Server to act in a more traditional fashion that is like other DBMSs that reject improper input. The SQL mode can be set globally at server startup to affect all clients. Individual clients can set the SQL mode at runtime, which enables each client to select the behavior most appropriate for its requirements. See Section 7.1.11, “Server SQL Modes”.

The following sections describe how MySQL Server handles different types of constraints.


#### 1.7.3.1 PRIMARY KEY and UNIQUE Index Constraints

Normally, errors occur for data-change statements (such as `INSERT` or `UPDATE`) that would violate primary-key, unique-key, or foreign-key constraints. If you are using a transactional storage engine such as `InnoDB`, MySQL automatically rolls back the statement. If you are using a nontransactional storage engine, MySQL stops processing the statement at the row for which the error occurred and leaves any remaining rows unprocessed.

MySQL supports an `IGNORE` keyword for `INSERT`, `UPDATE`, and so forth. If you use it, MySQL ignores primary-key or unique-key violations and continues processing with the next row. See the section for the statement that you are using (Section 15.2.7, “INSERT Statement”, Section 15.2.17, “UPDATE Statement”, and so forth).

You can get information about the number of rows actually inserted or updated with the `mysql_info()` C API function. You can also use the [`SHOW WARNINGS`](show-warnings.html "15.7.7.43 SHOW WARNINGS Statement") statement. See mysql\_info(), and Section 15.7.7.43, “SHOW WARNINGS Statement”.

`InnoDB` and `NDB` tables support foreign keys. See Section 1.7.3.2, “FOREIGN KEY Constraints”.


#### 1.7.3.2 FOREIGN KEY Constraints

Foreign keys let you cross-reference related data across tables, and [foreign key constraints](glossary.html#glos_foreign_key_constraint "FOREIGN KEY constraint") help keep this spread-out data consistent.

MySQL supports `ON UPDATE` and `ON DELETE` foreign key references in `CREATE TABLE` and `ALTER TABLE` statements. The available referential actions are `RESTRICT`, `CASCADE`, `SET NULL`, and `NO ACTION` (the default).

`SET DEFAULT` is also supported by the MySQL Server but is currently rejected as invalid by `InnoDB`. Since MySQL does not support deferred constraint checking, `NO ACTION` is treated as `RESTRICT`. For the exact syntax supported by MySQL for foreign keys, see Section 15.1.24.5, “FOREIGN KEY Constraints”.

`MATCH FULL`, `MATCH PARTIAL`, and `MATCH SIMPLE` are allowed, but their use should be avoided, as they cause the MySQL Server to ignore any `ON DELETE` or `ON UPDATE` clause used in the same statement. `MATCH` options do not have any other effect in MySQL, which in effect enforces `MATCH SIMPLE` semantics full-time.

MySQL requires that foreign key columns be indexed; if you create a table with a foreign key constraint but no index on a given column, an index is created.

You can obtain information about foreign keys from the Information Schema `KEY_COLUMN_USAGE` table. An example of a query against this table is shown here:

```
mysql> SELECT TABLE_SCHEMA, TABLE_NAME, COLUMN_NAME, CONSTRAINT_NAME
     > FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
     > WHERE REFERENCED_TABLE_SCHEMA IS NOT NULL;
+--------------+---------------+-------------+-----------------+
| TABLE_SCHEMA | TABLE_NAME    | COLUMN_NAME | CONSTRAINT_NAME |
+--------------+---------------+-------------+-----------------+
| fk1          | myuser        | myuser_id   | f               |
| fk1          | product_order | customer_id | f2              |
| fk1          | product_order | product_id  | f1              |
+--------------+---------------+-------------+-----------------+
3 rows in set (0.01 sec)
```

Information about foreign keys on `InnoDB` tables can also be found in the `INNODB_FOREIGN` and `INNODB_FOREIGN_COLS` tables, in the `INFORMATION_SCHEMA` database.

`InnoDB` and `NDB` tables support foreign keys.


#### 1.7.3.3 ENUM and SET Constraints

`ENUM` and `SET` columns provide an efficient way to define columns that can contain only a given set of values. See Section 13.3.6, “The ENUM Type”, and Section 13.3.7, “The SET Type”.

Unless strict mode is disabled (not recommended, but see Section 7.1.11, “Server SQL Modes”), the definition of a `ENUM` or `SET` column acts as a constraint on values entered into the column. An error occurs for values that do not satisfy these conditions:

* An `ENUM` value must be one of those listed in the column definition, or the internal numeric equivalent thereof. The value cannot be the error value (that is, 0 or the empty string). For a column defined as `ENUM('a','b','c')`, values such as `''`, `'d'`, or `'ax'` are invalid and are rejected.

* A `SET` value must be the empty string or a value consisting only of the values listed in the column definition separated by commas. For a column defined as `SET('a','b','c')`, values such as `'d'` or `'a,b,c,d'` are invalid and are rejected.

Errors for invalid values can be suppressed in strict mode if you use [`INSERT IGNORE`](insert.html "15.2.7 INSERT Statement") or `UPDATE IGNORE`. In this case, a warning is generated rather than an error. For `ENUM`, the value is inserted as the error member (`0`). For `SET`, the value is inserted as given except that any invalid substrings are deleted. For example, `'a,x,b,y'` results in a value of `'a,b'`.
