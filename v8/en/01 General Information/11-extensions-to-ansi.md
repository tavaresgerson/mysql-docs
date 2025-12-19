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

  + By default, strings can be enclosed by `"` as well as `'`. If the  `ANSI_QUOTES` SQL mode is enabled, strings can be enclosed only by `'` and the server interprets strings enclosed by `"` as identifiers.
  + `\` is the escape character in strings.
  + In SQL statements, you can access tables from different databases with the *`db_name.tbl_name`* syntax. Some SQL servers provide the same functionality but call this `User space`. MySQL Server doesn't support tablespaces such as used in statements like this: `CREATE TABLE ralph.my_table ... IN my_tablespace`.
* SQL statement syntax

  + The  `ANALYZE TABLE`, `CHECK TABLE`, `OPTIMIZE TABLE`, and `REPAIR TABLE` statements.
  + The  `CREATE DATABASE`, `DROP DATABASE`, and `ALTER DATABASE` statements. See  Section 15.1.12, “CREATE DATABASE Statement”, Section 15.1.24, “DROP DATABASE Statement”, and Section 15.1.2, “ALTER DATABASE Statement”.
  + The  `DO` statement.
  + `EXPLAIN SELECT` to obtain a description of how tables are processed by the query optimizer.
  + The  `FLUSH` and `RESET` statements.
  + The `SET` statement. See  Section 15.7.6.1, “SET Syntax for Variable Assignment”.
  + The  `SHOW` statement. See Section 15.7.7, “SHOW Statements”. The information produced by many of the MySQL-specific `SHOW` statements can be obtained in more standard fashion by using `SELECT` to query `INFORMATION_SCHEMA`. See Chapter 28, *INFORMATION\_SCHEMA Tables*.
  + Use of  `LOAD DATA`. In many cases, this syntax is compatible with Oracle `LOAD DATA`. See Section 15.2.9, “LOAD DATA Statement”.
  + Use of  `RENAME TABLE`. See Section 15.1.36, “RENAME TABLE Statement”.
  + Use of  `REPLACE` instead of `DELETE` plus `INSERT`. See Section 15.2.12, “REPLACE Statement”.
  + Use of `CHANGE col_name`, `DROP col_name`, or `DROP INDEX`, `IGNORE` or `RENAME` in  `ALTER TABLE` statements. Use of multiple `ADD`, `ALTER`, `DROP`, or `CHANGE` clauses in an `ALTER TABLE` statement. See  Section 15.1.9, “ALTER TABLE Statement”.
  + Use of index names, indexes on a prefix of a column, and use of `INDEX` or `KEY` in `CREATE TABLE` statements. See Section 15.1.20, “CREATE TABLE Statement”.
  + Use of `TEMPORARY` or `IF NOT EXISTS` with `CREATE TABLE`.
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

  + The  `MEDIUMINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), `SET`, and `ENUM` data types, and the various  `BLOB` and `TEXT` data types.
  + The `AUTO_INCREMENT`, `BINARY`, `NULL`, `UNSIGNED`, and `ZEROFILL` data type attributes.
* Functions and operators

  + To make it easier for users who migrate from other SQL environments, MySQL Server supports aliases for many functions. For example, all string functions support both standard SQL syntax and ODBC syntax.
  + MySQL Server understands the `||` and `&&` operators to mean logical OR and AND, as in the C programming language. In MySQL Server, `||` and `OR` are synonyms, as are `&&` and  `AND`. Because of this nice syntax, MySQL Server doesn't support the standard SQL `||` operator for string concatenation; use `CONCAT()` instead. Because `CONCAT()` takes any number of arguments, it is easy to convert use of the `||` operator to MySQL Server.
  + Use of `COUNT(DISTINCT value_list)` where *`value_list`* has more than one element.
  + String comparisons are case-insensitive by default, with sort ordering determined by the collation of the current character set, which is `utf8mb4` by default. To perform case-sensitive comparisons instead, you should declare your columns with the `BINARY` attribute or use the `BINARY` cast, which causes comparisons to be done using the underlying character code values rather than a lexical ordering.
  + The  `%` operator is a synonym for `MOD()`. That is, `N % M` is equivalent to `MOD(N,M)`. `%` is supported for C programmers and for compatibility with PostgreSQL.
  + The  `=`, `<>`, `<=`, `<`, `>=`, `>`, `<<`, `>>`, `<=>`, `AND`, `OR`, or `LIKE` operators may be used in expressions in the output column list (to the left of the `FROM`) in  `SELECT` statements. For example:

    ```
    mysql> SELECT col1=1 AND col2=2 FROM my_table;
    ```
  + The  `LAST_INSERT_ID()` function returns the most recent `AUTO_INCREMENT` value. See Section 14.15, “Information Functions”.
  +  `LIKE` is permitted on numeric values.
  + The  `REGEXP` and `NOT REGEXP` extended regular expression operators.
  +  `CONCAT()` or `CHAR()` with one argument or more than two arguments. (In MySQL Server, these functions can take a variable number of arguments.)
  + The  `BIT_COUNT()`, `CASE`, `ELT()`, `FROM_DAYS()`, `FORMAT()`, `IF()`, `MD5()`, `PERIOD_ADD()`, `PERIOD_DIFF()`, `TO_DAYS()`, and `WEEKDAY()` functions.
  + Use of  `TRIM()` to trim substrings. Standard SQL supports removal of single characters only.
  + The `GROUP BY` functions `STD()`, `BIT_OR()`, `BIT_AND()`, `BIT_XOR()`, and `GROUP_CONCAT()`. See Section 14.19, “Aggregate Functions”.
