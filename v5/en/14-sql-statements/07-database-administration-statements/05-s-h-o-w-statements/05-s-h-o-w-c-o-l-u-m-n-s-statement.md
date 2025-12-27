#### 13.7.5.5 SHOW COLUMNS Statement

```sql
SHOW [FULL] {COLUMNS | FIELDS}
    {FROM | IN} tbl_name
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

[`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") displays information about the columns in a given table. It also works for views. [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") displays information only for those columns for which you have some privilege.

```sql
mysql> SHOW COLUMNS FROM City;
+-------------+----------+------+-----+---------+----------------+
| Field       | Type     | Null | Key | Default | Extra          |
+-------------+----------+------+-----+---------+----------------+
| ID          | int(11)  | NO   | PRI | NULL    | auto_increment |
| Name        | char(35) | NO   |     |         |                |
| CountryCode | char(3)  | NO   | MUL |         |                |
| District    | char(20) | NO   |     |         |                |
| Population  | int(11)  | NO   |     | 0       |                |
+-------------+----------+------+-----+---------+----------------+
```

An alternative to `tbl_name FROM db_name` syntax is *`db_name.tbl_name`*. These two statements are equivalent:

```sql
SHOW COLUMNS FROM mytable FROM mydb;
SHOW COLUMNS FROM mydb.mytable;
```

The optional `FULL` keyword causes the output to include the column collation and comments, as well as the privileges you have for each column.

The [`LIKE`](string-comparison-functions.html#operator_like) clause, if present, indicates which column names to match. The `WHERE` clause can be given to select rows using more general conditions, as discussed in [Section 24.8, “Extensions to SHOW Statements”](extended-show.html "24.8 Extensions to SHOW Statements").

The data types may differ from what you expect them to be based on a [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement because MySQL sometimes changes data types when you create or alter a table. The conditions under which this occurs are described in [Section 13.1.18.6, “Silent Column Specification Changes”](silent-column-changes.html "13.1.18.6 Silent Column Specification Changes").

[`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") displays the following values for each table column:

* `Field`

  The column name.

* `Type`

  The column data type.

* `Collation`

  The collation for nonbinary string columns, or `NULL` for other columns. This value is displayed only if you use the `FULL` keyword.

* `Null`

  The column nullability. The value is `YES` if `NULL` values can be stored in the column, `NO` if not.

* `Key`

  Whether the column is indexed:

  + If `Key` is empty, the column either is not indexed or is indexed only as a secondary column in a multiple-column, nonunique index.

  + If `Key` is `PRI`, the column is a `PRIMARY KEY` or is one of the columns in a multiple-column `PRIMARY KEY`.

  + If `Key` is `UNI`, the column is the first column of a `UNIQUE` index. (A `UNIQUE` index permits multiple `NULL` values, but you can tell whether the column permits `NULL` by checking the `Null` field.)

  + If `Key` is `MUL`, the column is the first column of a nonunique index in which multiple occurrences of a given value are permitted within the column.

  If more than one of the `Key` values applies to a given column of a table, `Key` displays the one with the highest priority, in the order `PRI`, `UNI`, `MUL`.

  A `UNIQUE` index may be displayed as `PRI` if it cannot contain `NULL` values and there is no `PRIMARY KEY` in the table. A `UNIQUE` index may display as `MUL` if several columns form a composite `UNIQUE` index; although the combination of the columns is unique, each column can still hold multiple occurrences of a given value.

* `Default`

  The default value for the column. This is `NULL` if the column has an explicit default of `NULL`, or if the column definition includes no `DEFAULT` clause.

* `Extra`

  Any additional information that is available about a given column. The value is nonempty in these cases:

  + `auto_increment` for columns that have the `AUTO_INCREMENT` attribute.

  + `on update CURRENT_TIMESTAMP` for [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") or [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") columns that have the `ON UPDATE CURRENT_TIMESTAMP` attribute.

  + `VIRTUAL GENERATED` or `STORED GENERATED` for generated columns.

* `Privileges`

  The privileges you have for the column. This value is displayed only if you use the `FULL` keyword.

* `Comment`

  Any comment included in the column definition. This value is displayed only if you use the `FULL` keyword.

Table column information is also available from the `INFORMATION_SCHEMA` [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") table. See [Section 24.3.5, “The INFORMATION\_SCHEMA COLUMNS Table”](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table").

You can list a table's columns with the [**mysqlshow *`db_name`* *`tbl_name`***](mysqlshow.html "4.5.7 mysqlshow — Display Database, Table, and Column Information") command.

The [`DESCRIBE`](describe.html "13.8.1 DESCRIBE Statement") statement provides information similar to [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement"). See [Section 13.8.1, “DESCRIBE Statement”](describe.html "13.8.1 DESCRIBE Statement").

The [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement"), [`SHOW TABLE STATUS`](show-table-status.html "13.7.5.36 SHOW TABLE STATUS Statement"), and [`SHOW INDEX`](show-index.html "13.7.5.22 SHOW INDEX Statement") statements also provide information about tables. See [Section 13.7.5, “SHOW Statements”](show.html "13.7.5 SHOW Statements").
