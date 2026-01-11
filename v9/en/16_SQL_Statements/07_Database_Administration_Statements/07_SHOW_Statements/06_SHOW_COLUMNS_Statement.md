#### 15.7.7.6 SHOW COLUMNS Statement

```
SHOW [EXTENDED] [FULL] {COLUMNS | FIELDS}
    {FROM | IN} tbl_name
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

`SHOW COLUMNS` displays information about the columns in a given table. It also works for views. `SHOW COLUMNS` displays information only for those columns for which you have some privilege.

```
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

```
SHOW COLUMNS FROM mytable FROM mydb;
SHOW COLUMNS FROM mydb.mytable;
```

The optional `EXTENDED` keyword causes the output to include information about hidden columns that MySQL uses internally and are not accessible by users.

The optional `FULL` keyword causes the output to include the column collation and comments, as well as the privileges you have for each column.

The `LIKE` clause, if present, indicates which column names to match. The `WHERE` clause can be given to select rows using more general conditions, as discussed in Section 28.8, “Extensions to SHOW Statements”.

The data types may differ from what you expect them to be based on a `CREATE TABLE` statement because MySQL sometimes changes data types when you create or alter a table. The conditions under which this occurs are described in Section 15.1.24.7, “Silent Column Specification Changes”.

`SHOW COLUMNS` displays the following values for each table column:

* `Field`

  The name of the column.

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

  + `on update CURRENT_TIMESTAMP` for `TIMESTAMP` or `DATETIME` columns that have the `ON UPDATE CURRENT_TIMESTAMP` attribute.

  + `VIRTUAL GENERATED` or `STORED GENERATED` for generated columns.

  + `DEFAULT_GENERATED` for columns that have an expression default value.

* `Privileges`

  The privileges you have for the column. This value is displayed only if you use the `FULL` keyword.

* `Comment`

  Any comment included in the column definition. This value is displayed only if you use the `FULL` keyword.

Table column information is also available from the `INFORMATION_SCHEMA` `COLUMNS` table. See Section 28.3.8, “The INFORMATION\_SCHEMA COLUMNS Table”. The extended information about hidden columns is available only using `SHOW EXTENDED COLUMNS`; it cannot be obtained from the `COLUMNS` table.

You can list a table's columns with the **mysqlshow *`db_name`* *`tbl_name`*** command.

The `DESCRIBE` statement provides information similar to `SHOW COLUMNS`. See Section 15.8.1, “DESCRIBE Statement”.

The `SHOW CREATE TABLE`, `SHOW TABLE STATUS`, and `SHOW INDEX` statements also provide information about tables. See Section 15.7.7, “SHOW Statements”.

`SHOW COLUMNS` includes the table's generated invisible primary key, if it has one, by default. You can cause this information to be suppressed in the statement's output by setting `show_gipk_in_create_table_and_information_schema = OFF`. For more information, see Section 15.1.24.11, “Generated Invisible Primary Keys”.
