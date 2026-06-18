### 1.6.1 MySQL Extensions to Standard SQL

MySQL Server supports some extensions that you are not likely to
find in other SQL DBMSs. Be warned that if you use them, your
code is most likely not portable to other SQL servers. In some
cases, you can write code that includes MySQL extensions, but is
still portable, by using comments of the following form:

```
/*! MySQL-specific code */
```

In this case, MySQL Server parses and executes the code within
the comment as it would any other SQL statement, but other SQL
servers should ignore the extensions. For example, MySQL Server
recognizes the `STRAIGHT_JOIN` keyword in the
following statement, but other servers should not:

```
SELECT /*! STRAIGHT_JOIN */ col1 FROM table1,table2 WHERE ...
```

If you add a version number after the `!`
character, the syntax within the comment is executed only if the
MySQL version is greater than or equal to the specified version
number. The `KEY_BLOCK_SIZE` clause in the
following comment is executed only by servers from MySQL 5.1.10
or higher:

```
CREATE TABLE t1(a INT, KEY (a)) /*!50110 KEY_BLOCK_SIZE=1024 */;
```

The following descriptions list MySQL extensions, organized by
category.

* Organization of data on disk

  MySQL Server maps each database to a directory under the
  MySQL data directory, and maps tables within a database to
  file names in the database directory. Consequently, database
  and table names are case-sensitive in MySQL Server on
  operating systems that have case-sensitive file names (such
  as most Unix systems). See
  [Section 11.2.3, “Identifier Case Sensitivity”](identifier-case-sensitivity.html "11.2.3 Identifier Case Sensitivity").

* General language syntax

  + By default, strings can be enclosed by
    `"` as well as `'`. If
    the [`ANSI_QUOTES`](sql-mode.html#sqlmode_ansi_quotes) SQL
    mode is enabled, strings can be enclosed only by
    `'` and the server interprets strings
    enclosed by `"` as identifiers.

  + `\` is the escape character in strings.
  + In SQL statements, you can access tables from different
    databases with the
    *`db_name.tbl_name`* syntax. Some
    SQL servers provide the same functionality but call this
    `User space`. MySQL Server doesn't
    support tablespaces such as used in statements like
    this: `CREATE TABLE ralph.my_table ... IN
    my_tablespace`.

* SQL statement syntax

  + The [`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement"),
    [`CHECK TABLE`](check-table.html "15.7.3.2 CHECK TABLE Statement"),
    [`OPTIMIZE TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement"), and
    [`REPAIR TABLE`](repair-table.html "15.7.3.5 REPAIR TABLE Statement") statements.

  + The [`CREATE DATABASE`](create-database.html "15.1.12 CREATE DATABASE Statement"),
    [`DROP DATABASE`](drop-database.html "15.1.24 DROP DATABASE Statement"), and
    [`ALTER DATABASE`](alter-database.html "15.1.2 ALTER DATABASE Statement")
    statements. See [Section 15.1.12, “CREATE DATABASE Statement”](create-database.html "15.1.12 CREATE DATABASE Statement"),
    [Section 15.1.24, “DROP DATABASE Statement”](drop-database.html "15.1.24 DROP DATABASE Statement"), and
    [Section 15.1.2, “ALTER DATABASE Statement”](alter-database.html "15.1.2 ALTER DATABASE Statement").

  + The [`DO`](do.html "15.2.3 DO Statement") statement.
  + [`EXPLAIN
    SELECT`](explain.html "15.8.2 EXPLAIN Statement") to obtain a description of how tables
    are processed by the query optimizer.

  + The [`FLUSH`](flush.html "15.7.8.3 FLUSH Statement") and
    [`RESET`](reset.html "15.7.8.6 RESET Statement") statements.

  + The
    [`SET`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment")
    statement. See [Section 15.7.6.1, “SET Syntax for Variable Assignment”](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment").

  + The [`SHOW`](show.html "15.7.7 SHOW Statements") statement. See
    [Section 15.7.7, “SHOW Statements”](show.html "15.7.7 SHOW Statements"). The information produced by many
    of the MySQL-specific
    [`SHOW`](show.html "15.7.7 SHOW Statements") statements can be
    obtained in more standard fashion by using
    [`SELECT`](select.html "15.2.13 SELECT Statement") to query
    `INFORMATION_SCHEMA`. See
    [Chapter 28, *INFORMATION\_SCHEMA Tables*](information-schema.html "Chapter 28 INFORMATION_SCHEMA Tables").

  + Use of [`LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement"). In many
    cases, this syntax is compatible with Oracle
    [`LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement"). See
    [Section 15.2.9, “LOAD DATA Statement”](load-data.html "15.2.9 LOAD DATA Statement").

  + Use of [`RENAME TABLE`](rename-table.html "15.1.36 RENAME TABLE Statement"). See
    [Section 15.1.36, “RENAME TABLE Statement”](rename-table.html "15.1.36 RENAME TABLE Statement").

  + Use of [`REPLACE`](replace.html "15.2.12 REPLACE Statement") instead of
    [`DELETE`](delete.html "15.2.2 DELETE Statement") plus
    [`INSERT`](insert.html "15.2.7 INSERT Statement"). See
    [Section 15.2.12, “REPLACE Statement”](replace.html "15.2.12 REPLACE Statement").

  + Use of `CHANGE
    col_name`,
    `DROP
    col_name`, or
    [`DROP INDEX`](drop-index.html "15.1.27 DROP INDEX Statement"),
    `IGNORE` or `RENAME`
    in [`ALTER TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement")
    statements. Use of multiple `ADD`,
    `ALTER`, `DROP`, or
    `CHANGE` clauses in an
    [`ALTER TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement") statement.
    See [Section 15.1.9, “ALTER TABLE Statement”](alter-table.html "15.1.9 ALTER TABLE Statement").

  + Use of index names, indexes on a prefix of a column, and
    use of `INDEX` or
    `KEY` in [`CREATE
    TABLE`](create-table.html "15.1.20 CREATE TABLE Statement") statements. See
    [Section 15.1.20, “CREATE TABLE Statement”](create-table.html "15.1.20 CREATE TABLE Statement").

  + Use of `TEMPORARY` or `IF NOT
    EXISTS` with [`CREATE
    TABLE`](create-table.html "15.1.20 CREATE TABLE Statement").

  + Use of `IF EXISTS` with
    [`DROP TABLE`](drop-table.html "15.1.32 DROP TABLE Statement") and
    [`DROP DATABASE`](drop-database.html "15.1.24 DROP DATABASE Statement").

  + The capability of dropping multiple tables with a single
    [`DROP TABLE`](drop-table.html "15.1.32 DROP TABLE Statement") statement.

  + The `ORDER BY` and
    `LIMIT` clauses of the
    [`UPDATE`](update.html "15.2.17 UPDATE Statement") and
    [`DELETE`](delete.html "15.2.2 DELETE Statement") statements.

  + `INSERT INTO tbl_name
    SET col_name = ...`
    syntax.

  + The `DELAYED` clause of the
    [`INSERT`](insert.html "15.2.7 INSERT Statement") and
    [`REPLACE`](replace.html "15.2.12 REPLACE Statement") statements.

  + The `LOW_PRIORITY` clause of the
    [`INSERT`](insert.html "15.2.7 INSERT Statement"),
    [`REPLACE`](replace.html "15.2.12 REPLACE Statement"),
    [`DELETE`](delete.html "15.2.2 DELETE Statement"), and
    [`UPDATE`](update.html "15.2.17 UPDATE Statement") statements.

  + Use of `INTO OUTFILE` or `INTO
    DUMPFILE` in
    [`SELECT`](select.html "15.2.13 SELECT Statement") statements. See
    [Section 15.2.13, “SELECT Statement”](select.html "15.2.13 SELECT Statement").

  + Options such as `STRAIGHT_JOIN` or
    `SQL_SMALL_RESULT` in
    [`SELECT`](select.html "15.2.13 SELECT Statement") statements.

  + You don't need to name all selected columns in the
    `GROUP BY` clause. This gives better
    performance for some very specific, but quite normal
    queries. See
    [Section 14.19, “Aggregate Functions”](aggregate-functions-and-modifiers.html "14.19 Aggregate Functions").

  + You can specify `ASC` and
    `DESC` with `GROUP
    BY`, not just with `ORDER BY`.

  + The ability to set variables in a statement with the
    `:=` assignment operator. See
    [Section 11.4, “User-Defined Variables”](user-variables.html "11.4 User-Defined Variables").

* Data types

  + The [`MEDIUMINT`](integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"),
    [`SET`](set.html "13.3.6 The SET Type"), and
    [`ENUM`](enum.html "13.3.5 The ENUM Type") data types, and the
    various [`BLOB`](blob.html "13.3.4 The BLOB and TEXT Types") and
    [`TEXT`](blob.html "13.3.4 The BLOB and TEXT Types") data types.

  + The `AUTO_INCREMENT`,
    `BINARY`, `NULL`,
    `UNSIGNED`, and
    `ZEROFILL` data type attributes.

* Functions and operators

  + To make it easier for users who migrate from other SQL
    environments, MySQL Server supports aliases for many
    functions. For example, all string functions support
    both standard SQL syntax and ODBC syntax.

  + MySQL Server understands the
    [`||`](logical-operators.html#operator_or) and
    [`&&`](logical-operators.html#operator_and)
    operators to mean logical OR and AND, as in the C
    programming language. In MySQL Server,
    [`||`](logical-operators.html#operator_or) and
    [`OR`](logical-operators.html#operator_or) are
    synonyms, as are
    [`&&`](logical-operators.html#operator_and)
    and [`AND`](logical-operators.html#operator_and).
    Because of this nice syntax, MySQL Server doesn't
    support the standard SQL
    [`||`](logical-operators.html#operator_or) operator
    for string concatenation; use
    [`CONCAT()`](string-functions.html#function_concat) instead. Because
    [`CONCAT()`](string-functions.html#function_concat) takes any number
    of arguments, it is easy to convert use of the
    [`||`](logical-operators.html#operator_or) operator
    to MySQL Server.

  + Use of [`COUNT(DISTINCT
    value_list)`](aggregate-functions.html#function_count) where
    *`value_list`* has more than one
    element.

  + String comparisons are case-insensitive by default, with
    sort ordering determined by the collation of the current
    character set, which is `utf8mb4` by
    default. To perform case-sensitive comparisons instead,
    you should declare your columns with the
    `BINARY` attribute or use the
    `BINARY` cast, which causes comparisons
    to be done using the underlying character code values
    rather than a lexical ordering.

  + The [`%`](mathematical-functions.html#function_mod)
    operator is a synonym for
    [`MOD()`](mathematical-functions.html#function_mod). That is,
    `N %
    M` is equivalent to
    [`MOD(N,M)`](mathematical-functions.html#function_mod).
    [`%`](mathematical-functions.html#function_mod) is
    supported for C programmers and for compatibility with
    PostgreSQL.

  + The [`=`](comparison-operators.html#operator_equal),
    [`<>`](comparison-operators.html#operator_not-equal),
    [`<=`](comparison-operators.html#operator_less-than-or-equal),
    [`<`](comparison-operators.html#operator_less-than),
    [`>=`](comparison-operators.html#operator_greater-than-or-equal),
    [`>`](comparison-operators.html#operator_greater-than),
    [`<<`](bit-functions.html#operator_left-shift),
    [`>>`](bit-functions.html#operator_right-shift),
    [`<=>`](comparison-operators.html#operator_equal-to),
    [`AND`](logical-operators.html#operator_and),
    [`OR`](logical-operators.html#operator_or), or
    [`LIKE`](string-comparison-functions.html#operator_like)
    operators may be used in expressions in the output
    column list (to the left of the `FROM`)
    in [`SELECT`](select.html "15.2.13 SELECT Statement") statements. For
    example:

    ```
    mysql> SELECT col1=1 AND col2=2 FROM my_table;
    ```

  + The [`LAST_INSERT_ID()`](information-functions.html#function_last-insert-id)
    function returns the most recent
    `AUTO_INCREMENT` value. See
    [Section 14.15, “Information Functions”](information-functions.html "14.15 Information Functions").

  + [`LIKE`](string-comparison-functions.html#operator_like) is permitted on
    numeric values.

  + The [`REGEXP`](regexp.html#operator_regexp) and
    [`NOT REGEXP`](regexp.html#operator_not-regexp) extended regular
    expression operators.

  + [`CONCAT()`](string-functions.html#function_concat) or
    [`CHAR()`](string-functions.html#function_char) with one argument
    or more than two arguments. (In MySQL Server, these
    functions can take a variable number of arguments.)

  + The [`BIT_COUNT()`](bit-functions.html#function_bit-count),
    [`CASE`](flow-control-functions.html#operator_case),
    [`ELT()`](string-functions.html#function_elt),
    [`FROM_DAYS()`](date-and-time-functions.html#function_from-days),
    [`FORMAT()`](string-functions.html#function_format),
    [`IF()`](flow-control-functions.html#function_if),
    [`MD5()`](encryption-functions.html#function_md5),
    [`PERIOD_ADD()`](date-and-time-functions.html#function_period-add),
    [`PERIOD_DIFF()`](date-and-time-functions.html#function_period-diff),
    [`TO_DAYS()`](date-and-time-functions.html#function_to-days), and
    [`WEEKDAY()`](date-and-time-functions.html#function_weekday) functions.

  + Use of [`TRIM()`](string-functions.html#function_trim) to trim
    substrings. Standard SQL supports removal of single
    characters only.

  + The `GROUP BY` functions
    [`STD()`](aggregate-functions.html#function_std),
    [`BIT_OR()`](aggregate-functions.html#function_bit-or),
    [`BIT_AND()`](aggregate-functions.html#function_bit-and),
    [`BIT_XOR()`](aggregate-functions.html#function_bit-xor), and
    [`GROUP_CONCAT()`](aggregate-functions.html#function_group-concat). See
    [Section 14.19, “Aggregate Functions”](aggregate-functions-and-modifiers.html "14.19 Aggregate Functions").