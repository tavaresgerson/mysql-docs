### 13.2.9 SELECT Statement

[13.2.9.1 SELECT ... INTO Statement](select-into.html)

[13.2.9.2 JOIN Clause](join.html)

[13.2.9.3 UNION Clause](union.html)

```sql
SELECT
    [ALL | DISTINCT | DISTINCTROW ]
    [HIGH_PRIORITY]
    [STRAIGHT_JOIN]
    [SQL_SMALL_RESULT] [SQL_BIG_RESULT] [SQL_BUFFER_RESULT]
    [SQL_CACHE | SQL_NO_CACHE] [SQL_CALC_FOUND_ROWS]
    select_expr [, select_expr] ...
    [into_option]
    [FROM table_references
      [PARTITION partition_list
    [WHERE where_condition]
    [GROUP BY {col_name | expr | position}
      [ASC | DESC], ... [WITH ROLLUP
    [HAVING where_condition]
    [ORDER BY {col_name | expr | position}
      [ASC | DESC], ...]
    [LIMIT {[offset,] row_count | row_count OFFSET offset}]
    [PROCEDURE procedure_name(argument_list)]
    [into_option]
    [FOR UPDATE | LOCK IN SHARE MODE]

into_option: {
    INTO OUTFILE 'file_name'
        [CHARACTER SET charset_name]
        export_options
  | INTO DUMPFILE 'file_name'
  | INTO var_name [, var_name] ...
}

export_options:
    [{FIELDS | COLUMNS}
        [TERMINATED BY 'string']
        OPTIONALLY] ENCLOSED BY 'char']
        [ESCAPED BY 'char']
    ]
    [LINES
        [STARTING BY 'string']
        [TERMINATED BY 'string']
    ]
```

[`SELECT`](select.html "13.2.9 SELECT Statement") is used to retrieve rows selected from one or more tables, and can include [`UNION`](union.html "13.2.9.3 UNION Clause") statements and subqueries. See [Section 13.2.9.3, “UNION Clause”](union.html "13.2.9.3 UNION Clause"), and [Section 13.2.10, “Subqueries”](subqueries.html "13.2.10 Subqueries").

The most commonly used clauses of [`SELECT`](select.html "13.2.9 SELECT Statement") statements are these:

* Each *`select_expr`* indicates a column that you want to retrieve. There must be at least one *`select_expr`*.

* *`table_references`* indicates the table or tables from which to retrieve rows. Its syntax is described in [Section 13.2.9.2, “JOIN Clause”](join.html "13.2.9.2 JOIN Clause").

* `SELECT` supports explicit partition selection using the `PARTITION` clause with a list of partitions or subpartitions (or both) following the name of the table in a *`table_reference`* (see [Section 13.2.9.2, “JOIN Clause”](join.html "13.2.9.2 JOIN Clause")). In this case, rows are selected only from the partitions listed, and any other partitions of the table are ignored. For more information and examples, see [Section 22.5, “Partition Selection”](partitioning-selection.html "22.5 Partition Selection").

  `SELECT ... PARTITION` from tables using storage engines such as [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") that perform table-level locks (and thus partition locks) lock only the partitions or subpartitions named by the `PARTITION` option.

  For more information, see [Section 22.6.4, “Partitioning and Locking”](partitioning-limitations-locking.html "22.6.4 Partitioning and Locking").

* The `WHERE` clause, if given, indicates the condition or conditions that rows must satisfy to be selected. *`where_condition`* is an expression that evaluates to true for each row to be selected. The statement selects all rows if there is no `WHERE` clause.

  In the `WHERE` expression, you can use any of the functions and operators that MySQL supports, except for aggregate (group) functions. See [Section 9.5, “Expressions”](expressions.html "9.5 Expressions"), and [Chapter 12, *Functions and Operators*](functions.html "Chapter 12 Functions and Operators").

[`SELECT`](select.html "13.2.9 SELECT Statement") can also be used to retrieve rows computed without reference to any table.

For example:

```sql
mysql> SELECT 1 + 1;
        -> 2
```

You are permitted to specify `DUAL` as a dummy table name in situations where no tables are referenced:

```sql
mysql> SELECT 1 + 1 FROM DUAL;
        -> 2
```

`DUAL` is purely for the convenience of people who require that all [`SELECT`](select.html "13.2.9 SELECT Statement") statements should have `FROM` and possibly other clauses. MySQL may ignore the clauses. MySQL does not require `FROM DUAL` if no tables are referenced.

In general, clauses used must be given in exactly the order shown in the syntax description. For example, a `HAVING` clause must come after any `GROUP BY` clause and before any `ORDER BY` clause. The `INTO` clause, if present, can appear in any position indicated by the syntax description, but within a given statement can appear only once, not in multiple positions. For more information about `INTO`, see [Section 13.2.9.1, “SELECT ... INTO Statement”](select-into.html "13.2.9.1 SELECT ... INTO Statement").

The list of *`select_expr`* terms comprises the select list that indicates which columns to retrieve. Terms specify a column or expression or can use `*`-shorthand:

* A select list consisting only of a single unqualified `*` can be used as shorthand to select all columns from all tables:

  ```sql
  SELECT * FROM t1 INNER JOIN t2 ...
  ```

* `tbl_name.*` can be used as a qualified shorthand to select all columns from the named table:

  ```sql
  SELECT t1.*, t2.* FROM t1 INNER JOIN t2 ...
  ```

* Use of an unqualified `*` with other items in the select list may produce a parse error. For example:

  ```sql
  SELECT id, * FROM t1
  ```

  To avoid this problem, use a qualified `tbl_name.*` reference:

  ```sql
  SELECT id, t1.* FROM t1
  ```

  Use qualified `tbl_name.*` references for each table in the select list:

  ```sql
  SELECT AVG(score), t1.* FROM t1 ...
  ```

The following list provides additional information about other `SELECT` clauses:

* A *`select_expr`* can be given an alias using `AS alias_name`. The alias is used as the expression's column name and can be used in `GROUP BY`, `ORDER BY`, or `HAVING` clauses. For example:

  ```sql
  SELECT CONCAT(last_name,', ',first_name) AS full_name
    FROM mytable ORDER BY full_name;
  ```

  The `AS` keyword is optional when aliasing a *`select_expr`* with an identifier. The preceding example could have been written like this:

  ```sql
  SELECT CONCAT(last_name,', ',first_name) full_name
    FROM mytable ORDER BY full_name;
  ```

  However, because the `AS` is optional, a subtle problem can occur if you forget the comma between two *`select_expr`* expressions: MySQL interprets the second as an alias name. For example, in the following statement, `columnb` is treated as an alias name:

  ```sql
  SELECT columna columnb FROM mytable;
  ```

  For this reason, it is good practice to be in the habit of using `AS` explicitly when specifying column aliases.

  It is not permissible to refer to a column alias in a `WHERE` clause, because the column value might not yet be determined when the `WHERE` clause is executed. See [Section B.3.4.4, “Problems with Column Aliases”](problems-with-alias.html "B.3.4.4 Problems with Column Aliases").

* The `FROM table_references` clause indicates the table or tables from which to retrieve rows. If you name more than one table, you are performing a join. For information on join syntax, see [Section 13.2.9.2, “JOIN Clause”](join.html "13.2.9.2 JOIN Clause"). For each table specified, you can optionally specify an alias.

  ```sql
  tbl_name AS] alias] [index_hint]
  ```

  The use of index hints provides the optimizer with information about how to choose indexes during query processing. For a description of the syntax for specifying these hints, see [Section 8.9.4, “Index Hints”](index-hints.html "8.9.4 Index Hints").

  You can use `SET max_seeks_for_key=value` as an alternative way to force MySQL to prefer key scans instead of table scans. See [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

* You can refer to a table within the default database as *`tbl_name`*, or as *`db_name`*.*`tbl_name`* to specify a database explicitly. You can refer to a column as *`col_name`*, *`tbl_name`*.*`col_name`*, or *`db_name`*.*`tbl_name`*.*`col_name`*. You need not specify a *`tbl_name`* or *`db_name`*.*`tbl_name`* prefix for a column reference unless the reference would be ambiguous. See [Section 9.2.2, “Identifier Qualifiers”](identifier-qualifiers.html "9.2.2 Identifier Qualifiers"), for examples of ambiguity that require the more explicit column reference forms.

* A table reference can be aliased using `tbl_name AS alias_name` or *`tbl_name alias_name`*. These statements are equivalent:

  ```sql
  SELECT t1.name, t2.salary FROM employee AS t1, info AS t2
    WHERE t1.name = t2.name;

  SELECT t1.name, t2.salary FROM employee t1, info t2
    WHERE t1.name = t2.name;
  ```

* Columns selected for output can be referred to in `ORDER BY` and `GROUP BY` clauses using column names, column aliases, or column positions. Column positions are integers and begin with 1:

  ```sql
  SELECT college, region, seed FROM tournament
    ORDER BY region, seed;

  SELECT college, region AS r, seed AS s FROM tournament
    ORDER BY r, s;

  SELECT college, region, seed FROM tournament
    ORDER BY 2, 3;
  ```

  To sort in reverse order, add the `DESC` (descending) keyword to the name of the column in the `ORDER BY` clause that you are sorting by. The default is ascending order; this can be specified explicitly using the `ASC` keyword.

  If `ORDER BY` occurs within a parenthesized query expression and also is applied in the outer query, the results are undefined and may change in a future MySQL version.

  Use of column positions is deprecated because the syntax has been removed from the SQL standard.

* MySQL extends the `GROUP BY` clause so that you can also specify `ASC` and `DESC` after columns named in the clause. However, this syntax is deprecated. To produce a given sort order, provide an `ORDER BY` clause.

* If you use `GROUP BY`, output rows are sorted according to the `GROUP BY` columns as if you had an `ORDER BY` for the same columns. To avoid the overhead of sorting that `GROUP BY` produces, add `ORDER BY NULL`:

  ```sql
  SELECT a, COUNT(b) FROM test_table GROUP BY a ORDER BY NULL;
  ```

  Relying on implicit `GROUP BY` sorting (that is, sorting in the absence of `ASC` or `DESC` designators) or explicit sorting for `GROUP BY` (that is, by using explicit `ASC` or `DESC` designators for `GROUP BY` columns) is deprecated. To produce a given sort order, provide an `ORDER BY` clause.

* When you use `ORDER BY` or `GROUP BY` to sort a column in a [`SELECT`](select.html "13.2.9 SELECT Statement"), the server sorts values using only the initial number of bytes indicated by the [`max_sort_length`](server-system-variables.html#sysvar_max_sort_length) system variable.

* MySQL extends the use of `GROUP BY` to permit selecting fields that are not mentioned in the `GROUP BY` clause. If you are not getting the results that you expect from your query, please read the description of `GROUP BY` found in [Section 12.19, “Aggregate Functions”](aggregate-functions-and-modifiers.html "12.19 Aggregate Functions").

* `GROUP BY` permits a `WITH ROLLUP` modifier. See [Section 12.19.2, “GROUP BY Modifiers”](group-by-modifiers.html "12.19.2 GROUP BY Modifiers").

* The `HAVING` clause, like the `WHERE` clause, specifies selection conditions. The `WHERE` clause specifies conditions on columns in the select list, but cannot refer to aggregate functions. The `HAVING` clause specifies conditions on groups, typically formed by the `GROUP BY` clause. The query result includes only groups satisfying the `HAVING` conditions. (If no `GROUP BY` is present, all rows implicitly form a single aggregate group.)

  The `HAVING` clause is applied nearly last, just before items are sent to the client, with no optimization. (`LIMIT` is applied after `HAVING`.)

  The SQL standard requires that `HAVING` must reference only columns in the `GROUP BY` clause or columns used in aggregate functions. However, MySQL supports an extension to this behavior, and permits `HAVING` to refer to columns in the [`SELECT`](select.html "13.2.9 SELECT Statement") list and columns in outer subqueries as well.

  If the `HAVING` clause refers to a column that is ambiguous, a warning occurs. In the following statement, `col2` is ambiguous because it is used as both an alias and a column name:

  ```sql
  SELECT COUNT(col1) AS col2 FROM t GROUP BY col2 HAVING col2 = 2;
  ```

  Preference is given to standard SQL behavior, so if a `HAVING` column name is used both in `GROUP BY` and as an aliased column in the select column list, preference is given to the column in the `GROUP BY` column.

* Do not use `HAVING` for items that should be in the `WHERE` clause. For example, do not write the following:

  ```sql
  SELECT col_name FROM tbl_name HAVING col_name > 0;
  ```

  Write this instead:

  ```sql
  SELECT col_name FROM tbl_name WHERE col_name > 0;
  ```

* The `HAVING` clause can refer to aggregate functions, which the `WHERE` clause cannot:

  ```sql
  SELECT user, MAX(salary) FROM users
    GROUP BY user HAVING MAX(salary) > 10;
  ```

  (This did not work in some older versions of MySQL.)

* MySQL permits duplicate column names. That is, there can be more than one *`select_expr`* with the same name. This is an extension to standard SQL. Because MySQL also permits `GROUP BY` and `HAVING` to refer to *`select_expr`* values, this can result in an ambiguity:

  ```sql
  SELECT 12 AS a, a FROM t GROUP BY a;
  ```

  In that statement, both columns have the name `a`. To ensure that the correct column is used for grouping, use different names for each *`select_expr`*.

* MySQL resolves unqualified column or alias references in `ORDER BY` clauses by searching in the *`select_expr`* values, then in the columns of the tables in the `FROM` clause. For `GROUP BY` or `HAVING` clauses, it searches the `FROM` clause before searching in the *`select_expr`* values. (For `GROUP BY` and `HAVING`, this differs from the pre-MySQL 5.0 behavior that used the same rules as for `ORDER BY`.)

* The `LIMIT` clause can be used to constrain the number of rows returned by the [`SELECT`](select.html "13.2.9 SELECT Statement") statement. `LIMIT` takes one or two numeric arguments, which must both be nonnegative integer constants, with these exceptions:

  + Within prepared statements, `LIMIT` parameters can be specified using `?` placeholder markers.

  + Within stored programs, `LIMIT` parameters can be specified using integer-valued routine parameters or local variables.

  With two arguments, the first argument specifies the offset of the first row to return, and the second specifies the maximum number of rows to return. The offset of the initial row is 0 (not 1):

  ```sql
  SELECT * FROM tbl LIMIT 5,10;  # Retrieve rows 6-15
  ```

  To retrieve all rows from a certain offset up to the end of the result set, you can use some large number for the second parameter. This statement retrieves all rows from the 96th row to the last:

  ```sql
  SELECT * FROM tbl LIMIT 95,18446744073709551615;
  ```

  With one argument, the value specifies the number of rows to return from the beginning of the result set:

  ```sql
  SELECT * FROM tbl LIMIT 5;     # Retrieve first 5 rows
  ```

  In other words, `LIMIT row_count` is equivalent to `LIMIT 0, row_count`.

  For prepared statements, you can use placeholders. The following statements return one row from the `tbl` table:

  ```sql
  SET @a=1;
  PREPARE STMT FROM 'SELECT * FROM tbl LIMIT ?';
  EXECUTE STMT USING @a;
  ```

  The following statements return the second to sixth row from the `tbl` table:

  ```sql
  SET @skip=1; SET @numrows=5;
  PREPARE STMT FROM 'SELECT * FROM tbl LIMIT ?, ?';
  EXECUTE STMT USING @skip, @numrows;
  ```

  For compatibility with PostgreSQL, MySQL also supports the `LIMIT row_count OFFSET offset` syntax.

  If `LIMIT` occurs within a parenthesized query expression and also is applied in the outer query, the results are undefined and may change in a future MySQL version.

* A `PROCEDURE` clause names a procedure that should process the data in the result set. For an example, see [Section 8.4.2.4, “Using PROCEDURE ANALYSE”](procedure-analyse.html "8.4.2.4 Using PROCEDURE ANALYSE"), which describes `ANALYSE`, a procedure that can be used to obtain suggestions for optimal column data types that may help reduce table sizes.

  A `PROCEDURE` clause is not permitted in a [`UNION`](union.html "13.2.9.3 UNION Clause") statement.

  Note

  `PROCEDURE` syntax is deprecated as of MySQL 5.7.18, and is removed in MySQL 8.0.

* The [`SELECT ... INTO`](select-into.html "13.2.9.1 SELECT ... INTO Statement") form of [`SELECT`](select.html "13.2.9 SELECT Statement") enables the query result to be written to a file or stored in variables. For more information, see [Section 13.2.9.1, “SELECT ... INTO Statement”](select-into.html "13.2.9.1 SELECT ... INTO Statement").

* If you use `FOR UPDATE` with a storage engine that uses page or row locks, rows examined by the query are write-locked until the end of the current transaction. Using `LOCK IN SHARE MODE` sets a shared lock that permits other transactions to read the examined rows but not to update or delete them. See [Section 14.7.2.4, “Locking Reads”](innodb-locking-reads.html "14.7.2.4 Locking Reads").

  In addition, you cannot use `FOR UPDATE` as part of the [`SELECT`](select.html "13.2.9 SELECT Statement") in a statement such as [`CREATE TABLE new_table SELECT ... FROM old_table ...`](create-table-select.html "13.1.18.4 CREATE TABLE ... SELECT Statement"). (If you attempt to do so, the statement is rejected with the error Can't update table '*`old_table`*' while '*`new_table`*' is being created.) This is a change in behavior from MySQL 5.5 and earlier, which permitted [`CREATE TABLE ... SELECT`](create-table-select.html "13.1.18.4 CREATE TABLE ... SELECT Statement") statements to make changes in tables other than the table being created.

Following the [`SELECT`](select.html "13.2.9 SELECT Statement") keyword, you can use a number of modifiers that affect the operation of the statement. `HIGH_PRIORITY`, `STRAIGHT_JOIN`, and modifiers beginning with `SQL_` are MySQL extensions to standard SQL.

* The `ALL` and `DISTINCT` modifiers specify whether duplicate rows should be returned. `ALL` (the default) specifies that all matching rows should be returned, including duplicates. `DISTINCT` specifies removal of duplicate rows from the result set. It is an error to specify both modifiers. `DISTINCTROW` is a synonym for `DISTINCT`.

* `HIGH_PRIORITY` gives the [`SELECT`](select.html "13.2.9 SELECT Statement") higher priority than a statement that updates a table. You should use this only for queries that are very fast and must be done at once. A `SELECT HIGH_PRIORITY` query that is issued while the table is locked for reading runs even if there is an update statement waiting for the table to be free. This affects only storage engines that use only table-level locking (such as `MyISAM`, `MEMORY`, and `MERGE`).

  `HIGH_PRIORITY` cannot be used with [`SELECT`](select.html "13.2.9 SELECT Statement") statements that are part of a [`UNION`](union.html "13.2.9.3 UNION Clause").

* `STRAIGHT_JOIN` forces the optimizer to join the tables in the order in which they are listed in the `FROM` clause. You can use this to speed up a query if the optimizer joins the tables in nonoptimal order. `STRAIGHT_JOIN` also can be used in the *`table_references`* list. See [Section 13.2.9.2, “JOIN Clause”](join.html "13.2.9.2 JOIN Clause").

  `STRAIGHT_JOIN` does not apply to any table that the optimizer treats as a [`const`](explain-output.html#jointype_const) or [`system`](explain-output.html#jointype_system) table. Such a table produces a single row, is read during the optimization phase of query execution, and references to its columns are replaced with the appropriate column values before query execution proceeds. These tables appear first in the query plan displayed by [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement"). See [Section 8.8.1, “Optimizing Queries with EXPLAIN”](using-explain.html "8.8.1 Optimizing Queries with EXPLAIN"). This exception may not apply to [`const`](explain-output.html#jointype_const) or [`system`](explain-output.html#jointype_system) tables that are used on the `NULL`-complemented side of an outer join (that is, the right-side table of a `LEFT JOIN` or the left-side table of a `RIGHT JOIN`.

* `SQL_BIG_RESULT` or `SQL_SMALL_RESULT` can be used with `GROUP BY` or `DISTINCT` to tell the optimizer that the result set has many rows or is small, respectively. For `SQL_BIG_RESULT`, MySQL directly uses disk-based temporary tables if they are created, and prefers sorting to using a temporary table with a key on the `GROUP BY` elements. For `SQL_SMALL_RESULT`, MySQL uses in-memory temporary tables to store the resulting table instead of using sorting. This should not normally be needed.

* `SQL_BUFFER_RESULT` forces the result to be put into a temporary table. This helps MySQL free the table locks early and helps in cases where it takes a long time to send the result set to the client. This modifier can be used only for top-level [`SELECT`](select.html "13.2.9 SELECT Statement") statements, not for subqueries or following [`UNION`](union.html "13.2.9.3 UNION Clause").

* `SQL_CALC_FOUND_ROWS` tells MySQL to calculate how many rows there would be in the result set, disregarding any `LIMIT` clause. The number of rows can then be retrieved with `SELECT FOUND_ROWS()`. See [Section 12.15, “Information Functions”](information-functions.html "12.15 Information Functions").

* The `SQL_CACHE` and `SQL_NO_CACHE` modifiers affect caching of query results in the query cache (see [Section 8.10.3, “The MySQL Query Cache”](query-cache.html "8.10.3 The MySQL Query Cache")). `SQL_CACHE` tells MySQL to store the result in the query cache if it is cacheable and the value of the [`query_cache_type`](server-system-variables.html#sysvar_query_cache_type) system variable is `2` or `DEMAND`. With `SQL_NO_CACHE`, the server does not use the query cache. It neither checks the query cache to see whether the result is already cached, nor does it cache the query result.

  These two modifiers are mutually exclusive and an error occurs if they are both specified. Also, these modifiers are not permitted in subqueries (including subqueries in the `FROM` clause), and [`SELECT`](select.html "13.2.9 SELECT Statement") statements in unions other than the first [`SELECT`](select.html "13.2.9 SELECT Statement").

  For views, `SQL_NO_CACHE` applies if it appears in any [`SELECT`](select.html "13.2.9 SELECT Statement") in the query. For a cacheable query, `SQL_CACHE` applies if it appears in the first [`SELECT`](select.html "13.2.9 SELECT Statement") of a view referred to by the query.

  Note

  The query cache is deprecated as of MySQL 5.7.20, and is removed in MySQL 8.0. Deprecation includes `SQL_CACHE` and `SQL_NO_CACHE`.

A `SELECT` from a partitioned table using a storage engine such as [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") that employs table-level locks locks only those partitions containing rows that match the `SELECT` statement `WHERE` clause. (This does not occur with storage engines such as [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") that employ row-level locking.) For more information, see [Section 22.6.4, “Partitioning and Locking”](partitioning-limitations-locking.html "22.6.4 Partitioning and Locking").
