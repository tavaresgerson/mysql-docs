#### 13.1.18.4 CREATE TABLE ... SELECT Statement

You can create one table from another by adding a [`SELECT`](select.html "13.2.9 SELECT Statement") statement at the end of the [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement:

```sql
CREATE TABLE new_tbl [AS] SELECT * FROM orig_tbl;
```

MySQL creates new columns for all elements in the [`SELECT`](select.html "13.2.9 SELECT Statement"). For example:

```sql
mysql> CREATE TABLE test (a INT NOT NULL AUTO_INCREMENT,
    ->        PRIMARY KEY (a), KEY(b))
    ->        ENGINE=InnoDB SELECT b,c FROM test2;
```

This creates an [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") table with three columns, `a`, `b`, and `c`. The `ENGINE` option is part of the [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement, and should not be used following the [`SELECT`](select.html "13.2.9 SELECT Statement"); this would result in a syntax error. The same is true for other [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") options such as `CHARSET`.

Notice that the columns from the [`SELECT`](select.html "13.2.9 SELECT Statement") statement are appended to the right side of the table, not overlapped onto it. Take the following example:

```sql
mysql> SELECT * FROM foo;
+---+
| n |
+---+
| 1 |
+---+

mysql> CREATE TABLE bar (m INT) SELECT n FROM foo;
Query OK, 1 row affected (0.02 sec)
Records: 1  Duplicates: 0  Warnings: 0

mysql> SELECT * FROM bar;
+------+---+
| m    | n |
+------+---+
| NULL | 1 |
+------+---+
1 row in set (0.00 sec)
```

For each row in table `foo`, a row is inserted in `bar` with the values from `foo` and default values for the new columns.

In a table resulting from [`CREATE TABLE ... SELECT`](create-table.html "13.1.18 CREATE TABLE Statement"), columns named only in the [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") part come first. Columns named in both parts or only in the [`SELECT`](select.html "13.2.9 SELECT Statement") part come after that. The data type of [`SELECT`](select.html "13.2.9 SELECT Statement") columns can be overridden by also specifying the column in the [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") part.

If any errors occur while copying the data to the table, it is automatically dropped and not created.

You can precede the [`SELECT`](select.html "13.2.9 SELECT Statement") by `IGNORE` or `REPLACE` to indicate how to handle rows that duplicate unique key values. With `IGNORE`, rows that duplicate an existing row on a unique key value are discarded. With `REPLACE`, new rows replace rows that have the same unique key value. If neither `IGNORE` nor `REPLACE` is specified, duplicate unique key values result in an error. For more information, see [The Effect of IGNORE on Statement Execution](sql-mode.html#ignore-effect-on-execution "The Effect of IGNORE on Statement Execution").

Because the ordering of the rows in the underlying [`SELECT`](select.html "13.2.9 SELECT Statement") statements cannot always be determined, `CREATE TABLE ... IGNORE SELECT` and `CREATE TABLE ... REPLACE SELECT` statements are flagged as unsafe for statement-based replication. Such statements produce a warning in the error log when using statement-based mode and are written to the binary log using the row-based format when using `MIXED` mode. See also [Section 16.2.1.1, “Advantages and Disadvantages of Statement-Based and Row-Based Replication”](replication-sbr-rbr.html "16.2.1.1 Advantages and Disadvantages of Statement-Based and Row-Based Replication").

[`CREATE TABLE ... SELECT`](create-table.html "13.1.18 CREATE TABLE Statement") does not automatically create any indexes for you. This is done intentionally to make the statement as flexible as possible. If you want to have indexes in the created table, you should specify these before the [`SELECT`](select.html "13.2.9 SELECT Statement") statement:

```sql
mysql> CREATE TABLE bar (UNIQUE (n)) SELECT n FROM foo;
```

For `CREATE TABLE ... SELECT`, the destination table does not preserve information about whether columns in the selected-from table are generated columns. The [`SELECT`](select.html "13.2.9 SELECT Statement") part of the statement cannot assign values to generated columns in the destination table.

Some conversion of data types might occur. For example, the `AUTO_INCREMENT` attribute is not preserved, and [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") columns can become [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") columns. Retrained attributes are `NULL` (or `NOT NULL`) and, for those columns that have them, `CHARACTER SET`, `COLLATION`, `COMMENT`, and the `DEFAULT` clause.

When creating a table with [`CREATE TABLE ... SELECT`](create-table-select.html "13.1.18.4 CREATE TABLE ... SELECT Statement"), make sure to alias any function calls or expressions in the query. If you do not, the `CREATE` statement might fail or result in undesirable column names.

```sql
CREATE TABLE artists_and_works
  SELECT artist.name, COUNT(work.artist_id) AS number_of_works
  FROM artist LEFT JOIN work ON artist.id = work.artist_id
  GROUP BY artist.id;
```

You can also explicitly specify the data type for a column in the created table:

```sql
CREATE TABLE foo (a TINYINT NOT NULL) SELECT b+1 AS a FROM bar;
```

For [`CREATE TABLE ... SELECT`](create-table.html "13.1.18 CREATE TABLE Statement"), if `IF NOT EXISTS` is given and the target table exists, nothing is inserted into the destination table, and the statement is not logged.

To ensure that the binary log can be used to re-create the original tables, MySQL does not permit concurrent inserts during [`CREATE TABLE ... SELECT`](create-table.html "13.1.18 CREATE TABLE Statement").

You cannot use `FOR UPDATE` as part of the [`SELECT`](select.html "13.2.9 SELECT Statement") in a statement such as [`CREATE TABLE new_table SELECT ... FROM old_table ...`](create-table-select.html "13.1.18.4 CREATE TABLE ... SELECT Statement"). If you attempt to do so, the statement fails.
