#### 15.1.24.10 Invisible Columns

MySQL 9.5 supports invisible columns. An invisible column is normally hidden to queries, but can be accessed if explicitly referenced.

As an illustration of when invisible columns may be useful, suppose that an application uses `SELECT *` queries to access a table, and must continue to work without modification even if the table is altered to add a new column that the application does not expect to be there. In a `SELECT *` query, the `*` evaluates to all table columns, except those that are invisible, so the solution is to add the new column as an invisible column. The column remains “hidden” from `SELECT *` queries, and the application continues to work as previously. A newer version of the application can refer to the invisible column if necessary by explicitly referencing it.

The following sections detail how MySQL treats invisible columns.

* DDL Statements and Invisible Columns
* DML Statements and Invisible Columns
* Invisible Column Metadata
* The Binary Log and Invisible Columns

##### DDL Statements and Invisible Columns

Columns are visible by default. To explicitly specify visibility for a new column, use a `VISIBLE` or `INVISIBLE` keyword as part of the column definition for `CREATE TABLE` or `ALTER TABLE`:

```
CREATE TABLE t1 (
  i INT,
  j DATE INVISIBLE
) ENGINE = InnoDB;
ALTER TABLE t1 ADD COLUMN k INT INVISIBLE;
```

To alter the visibility of an existing column, use a `VISIBLE` or `INVISIBLE` keyword with one of the `ALTER TABLE` column-modification clauses:

```
ALTER TABLE t1 CHANGE COLUMN j j DATE VISIBLE;
ALTER TABLE t1 MODIFY COLUMN j DATE INVISIBLE;
ALTER TABLE t1 ALTER COLUMN j SET VISIBLE;
```

A table must have at least one visible column. Attempting to make all columns invisible produces an error.

Invisible columns support the usual column attributes: `NULL`, `NOT NULL`, `AUTO_INCREMENT`, and so forth.

Generated columns can be invisible.

Index definitions can name invisible columns, including definitions for `PRIMARY KEY` and `UNIQUE` indexes. Although a table must have at least one visible column, an index definition need not have any visible columns.

An invisible column dropped from a table is dropped in the usual way from any index definition that names the column.

Foreign key constraints can be defined on invisible columns, and foreign key constraints can reference invisible columns.

`CHECK` constraints can be defined on invisible columns. For new or modified rows, violation of a `CHECK` constraint on an invisible column produces an error.

`CREATE TABLE ... LIKE` includes invisible columns, and they are invisible in the new table.

`CREATE TABLE ... SELECT` does not include invisible columns, unless they are explicitly referenced in the `SELECT` part. However, even if explicitly referenced, a column that is invisible in the existing table is visible in the new table:

```
mysql> CREATE TABLE t1 (col1 INT, col2 INT INVISIBLE);
mysql> CREATE TABLE t2 AS SELECT col1, col2 FROM t1;
mysql> SHOW CREATE TABLE t2\G
*************************** 1. row ***************************
       Table: t2
Create Table: CREATE TABLE `t2` (
  `col1` int DEFAULT NULL,
  `col2` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

If invisibility should be preserved, provide a definition for the invisible column in the `CREATE TABLE` part of the `CREATE TABLE ... SELECT` statement:

```
mysql> CREATE TABLE t1 (col1 INT, col2 INT INVISIBLE);
mysql> CREATE TABLE t2 (col2 INT INVISIBLE) AS SELECT col1, col2 FROM t1;
mysql> SHOW CREATE TABLE t2\G
*************************** 1. row ***************************
       Table: t2
Create Table: CREATE TABLE `t2` (
  `col1` int DEFAULT NULL,
  `col2` int DEFAULT NULL /*!80023 INVISIBLE */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

Views can refer to invisible columns by explicitly referencing them in the `SELECT` statement that defines the view. Changing a column's visibility subsequent to defining a view that references the column does not change view behavior.

##### DML Statements and Invisible Columns

For `SELECT` statements, an invisible column is not part of the result set unless explicitly referenced in the select list. In a select list, the `*` and `tbl_name.*` shorthands do not include invisible columns. Natural joins do not include invisible columns.

Consider the following statement sequence:

```
mysql> CREATE TABLE t1 (col1 INT, col2 INT INVISIBLE);
mysql> INSERT INTO t1 (col1, col2) VALUES(1, 2), (3, 4);

mysql> SELECT * FROM t1;
+------+
| col1 |
+------+
|    1 |
|    3 |
+------+

mysql> SELECT col1, col2 FROM t1;
+------+------+
| col1 | col2 |
+------+------+
|    1 |    2 |
|    3 |    4 |
+------+------+
```

The first `SELECT` does not reference the invisible column `col2` in the select list (because `*` does not include invisible columns), so `col2` does not appear in the statement result. The second `SELECT` explicitly references `col2`, so the column appears in the result.

The statement `TABLE t1` produces the same output as the first `SELECT` statement. Since there is no way to specify columns in a `TABLE` statement, `TABLE` never displays invisible columns.

For statements that create new rows, an invisible column is assigned its implicit default value unless explicitly referenced and assigned a value. For information about implicit defaults, see Implicit Default Handling.

For `INSERT` (and `REPLACE`, for non-replaced rows), implicit default assignment occurs with a missing column list, an empty column list, or a nonempty column list that does not include the invisible column:

```
CREATE TABLE t1 (col1 INT, col2 INT INVISIBLE);
INSERT INTO t1 VALUES(...);
INSERT INTO t1 () VALUES(...);
INSERT INTO t1 (col1) VALUES(...);
```

For the first two `INSERT` statements, the `VALUES()` list must provide a value for each visible column and no invisible column. For the third `INSERT` statement, the `VALUES()` list must provide the same number of values as the number of named columns; the same is true when you use `VALUES ROW()` rather than `VALUES()`.

For `LOAD DATA` and `LOAD XML`, implicit default assignment occurs with a missing column list or a nonempty column list that does not include the invisible column. Input rows should not include a value for the invisible column.

To assign a value other than the implicit default for the preceding statements, explicitly name the invisible column in the column list and provide a value for it.

`INSERT INTO ... SELECT *` and `REPLACE INTO ... SELECT *` do not include invisible columns because `*` does not include invisible columns. Implicit default assignment occurs as described previously.

For statements that insert or ignore new rows, or that replace or modify existing rows, based on values in a `PRIMARY KEY` or `UNIQUE` index, MySQL treats invisible columns the same as visible columns: Invisible columns participate in key value comparisons. Specifically, if a new row has the same value as an existing row for a unique key value, these behaviors occur whether the index columns are visible or invisible:

* With the `IGNORE` modifier, `INSERT`, `LOAD DATA`, and `LOAD XML` ignore the new row.

* `REPLACE` replaces the existing row with the new row. With the `REPLACE` modifier, `LOAD DATA` and `LOAD XML` do the same.

* `INSERT ... ON DUPLICATE KEY UPDATE` updates the existing row.

To update invisible columns for `UPDATE` statements, name them and assign a value, just as for visible columns.

##### Invisible Column Metadata

Information about whether a column is visible or invisible is available from the `EXTRA` column of the Information Schema `COLUMNS` table or `SHOW COLUMNS` output. For example:

```
mysql> SELECT TABLE_NAME, COLUMN_NAME, EXTRA
       FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = 'test' AND TABLE_NAME = 't1';
+------------+-------------+-----------+
| TABLE_NAME | COLUMN_NAME | EXTRA     |
+------------+-------------+-----------+
| t1         | i           |           |
| t1         | j           |           |
| t1         | k           | INVISIBLE |
+------------+-------------+-----------+
```

Columns are visible by default, so in that case, `EXTRA` displays no visibility information. For invisible columns, `EXTRA` displays `INVISIBLE`.

`SHOW CREATE TABLE` displays invisible columns in the table definition, with the `INVISIBLE` keyword in a version-specific comment:

```
mysql> SHOW CREATE TABLE t1\G
*************************** 1. row ***************************
       Table: t1
Create Table: CREATE TABLE `t1` (
  `i` int DEFAULT NULL,
  `j` int DEFAULT NULL,
  `k` int DEFAULT NULL /*!80023 INVISIBLE */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

**mysqldump** uses `SHOW CREATE TABLE`, so they include invisible columns in dumped table definitions. They also include invisible column values in dumped data.

Reloading a dump file into an older version of MySQL that does not support invisible columns causes the version-specific comment to be ignored, which creates any invisible columns as visible.

##### The Binary Log and Invisible Columns

MySQL treats invisible columns as follows with respect to events in the binary log:

* Table-creation events include the `INVISIBLE` attribute for invisible columns.

* Invisible columns are treated like visible columns in row events. They are included if needed according to the `binlog_row_image` system variable setting.

* When row events are applied, invisible columns are treated like visible columns in row events.

* Invisible columns are treated like visible columns when computing writesets. In particular, writesets include indexes defined on invisible columns.

* The **mysqlbinlog** command includes visibility in column metadata.
