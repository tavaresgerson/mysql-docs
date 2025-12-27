### 13.2.5 INSERT Statement

[13.2.5.1 INSERT ... SELECT Statement](insert-select.html)

[13.2.5.2 INSERT ... ON DUPLICATE KEY UPDATE Statement](insert-on-duplicate.html)

[13.2.5.3 INSERT DELAYED Statement](insert-delayed.html)

```sql
INSERT [LOW_PRIORITY | DELAYED | HIGH_PRIORITY] [IGNORE]
    [INTO] tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    [(col_name [, col_name] ...)]
    {VALUES | VALUE} (value_list) [, (value_list)] ...
    [ON DUPLICATE KEY UPDATE assignment_list]

INSERT [LOW_PRIORITY | DELAYED | HIGH_PRIORITY] [IGNORE]
    [INTO] tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    SET assignment_list
    [ON DUPLICATE KEY UPDATE assignment_list]

INSERT [LOW_PRIORITY | HIGH_PRIORITY] [IGNORE]
    [INTO] tbl_name
    [PARTITION (partition_name [, partition_name] ...)]
    [(col_name [, col_name] ...)]
    SELECT ...
    [ON DUPLICATE KEY UPDATE assignment_list]

value:
    {expr | DEFAULT}

value_list:
    value [, value] ...

assignment:
    col_name = value

assignment_list:
    assignment [, assignment] ...
```

[`INSERT`](insert.html "13.2.5 INSERT Statement") inserts new rows into an existing table. The [`INSERT ... VALUES`](insert.html "13.2.5 INSERT Statement") and [`INSERT ... SET`](insert.html "13.2.5 INSERT Statement") forms of the statement insert rows based on explicitly specified values. The [`INSERT ... SELECT`](insert-select.html "13.2.5.1 INSERT ... SELECT Statement") form inserts rows selected from another table or tables. [`INSERT`](insert.html "13.2.5 INSERT Statement") with an `ON DUPLICATE KEY UPDATE` clause enables existing rows to be updated if a row to be inserted would cause a duplicate value in a `UNIQUE` index or `PRIMARY KEY`.

For additional information about [`INSERT ... SELECT`](insert-select.html "13.2.5.1 INSERT ... SELECT Statement") and [`INSERT ... ON DUPLICATE KEY UPDATE`](insert-on-duplicate.html "13.2.5.2 INSERT ... ON DUPLICATE KEY UPDATE Statement"), see [Section 13.2.5.1, “INSERT ... SELECT Statement”](insert-select.html "13.2.5.1 INSERT ... SELECT Statement"), and [Section 13.2.5.2, “INSERT ... ON DUPLICATE KEY UPDATE Statement”](insert-on-duplicate.html "13.2.5.2 INSERT ... ON DUPLICATE KEY UPDATE Statement").

In MySQL 5.7, the `DELAYED` keyword is accepted but ignored by the server. For the reasons for this, see [Section 13.2.5.3, “INSERT DELAYED Statement”](insert-delayed.html "13.2.5.3 INSERT DELAYED Statement"),

Inserting into a table requires the [`INSERT`](privileges-provided.html#priv_insert) privilege for the table. If the `ON DUPLICATE KEY UPDATE` clause is used and a duplicate key causes an [`UPDATE`](update.html "13.2.11 UPDATE Statement") to be performed instead, the statement requires the [`UPDATE`](privileges-provided.html#priv_update) privilege for the columns to be updated. For columns that are read but not modified you need only the [`SELECT`](privileges-provided.html#priv_select) privilege (such as for a column referenced only on the right hand side of an *`col_name`*=*`expr`* assignment in an `ON DUPLICATE KEY UPDATE` clause).

When inserting into a partitioned table, you can control which partitions and subpartitions accept new rows. The `PARTITION` clause takes a list of the comma-separated names of one or more partitions or subpartitions (or both) of the table. If any of the rows to be inserted by a given [`INSERT`](insert.html "13.2.5 INSERT Statement") statement do not match one of the partitions listed, the [`INSERT`](insert.html "13.2.5 INSERT Statement") statement fails with the error Found a row not matching the given partition set. For more information and examples, see [Section 22.5, “Partition Selection”](partitioning-selection.html "22.5 Partition Selection").

*`tbl_name`* is the table into which rows should be inserted. Specify the columns for which the statement provides values as follows:

* Provide a parenthesized list of comma-separated column names following the table name. In this case, a value for each named column must be provided by the `VALUES` list or the [`SELECT`](select.html "13.2.9 SELECT Statement") statement.

* If you do not specify a list of column names for [`INSERT ... VALUES`](insert.html "13.2.5 INSERT Statement") or [`INSERT ... SELECT`](insert-select.html "13.2.5.1 INSERT ... SELECT Statement"), values for every column in the table must be provided by the `VALUES` list or the [`SELECT`](select.html "13.2.9 SELECT Statement") statement. If you do not know the order of the columns in the table, use `DESCRIBE tbl_name` to find out.

* A `SET` clause indicates columns explicitly by name, together with the value to assign each one.

Column values can be given in several ways:

* If strict SQL mode is not enabled, any column not explicitly given a value is set to its default (explicit or implicit) value. For example, if you specify a column list that does not name all the columns in the table, unnamed columns are set to their default values. Default value assignment is described in [Section 11.6, “Data Type Default Values”](data-type-defaults.html "11.6 Data Type Default Values"). See also [Section 1.6.3.3, “Constraints on Invalid Data”](constraint-invalid-data.html "1.6.3.3 Constraints on Invalid Data").

  If strict SQL mode is enabled, an [`INSERT`](insert.html "13.2.5 INSERT Statement") statement generates an error if it does not specify an explicit value for every column that has no default value. See [Section 5.1.10, “Server SQL Modes”](sql-mode.html "5.1.10 Server SQL Modes").

* If both the column list and the `VALUES` list are empty, [`INSERT`](insert.html "13.2.5 INSERT Statement") creates a row with each column set to its default value:

  ```sql
  INSERT INTO tbl_name () VALUES();
  ```

  If strict mode is not enabled, MySQL uses the implicit default value for any column that has no explicitly defined default. If strict mode is enabled, an error occurs if any column has no default value.

* Use the keyword `DEFAULT` to set a column explicitly to its default value. This makes it easier to write [`INSERT`](insert.html "13.2.5 INSERT Statement") statements that assign values to all but a few columns, because it enables you to avoid writing an incomplete `VALUES` list that does not include a value for each column in the table. Otherwise, you must provide the list of column names corresponding to each value in the `VALUES` list.

* If a generated column is inserted into explicitly, the only permitted value is `DEFAULT`. For information about generated columns, see [Section 13.1.18.7, “CREATE TABLE and Generated Columns”](create-table-generated-columns.html "13.1.18.7 CREATE TABLE and Generated Columns").

* In expressions, you can use [`DEFAULT(col_name)`](miscellaneous-functions.html#function_default) to produce the default value for column *`col_name`*.

* Type conversion of an expression *`expr`* that provides a column value might occur if the expression data type does not match the column data type. Conversion of a given value can result in different inserted values depending on the column type. For example, inserting the string `'1999.0e-2'` into an [`INT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"), [`FLOAT`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE"), [`DECIMAL(10,6)`](fixed-point-types.html "11.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC"), or [`YEAR`](year.html "11.2.4 The YEAR Type") column inserts the value `1999`, `19.9921`, `19.992100`, or `1999`, respectively. The value stored in the [`INT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") and [`YEAR`](year.html "11.2.4 The YEAR Type") columns is `1999` because the string-to-number conversion looks only at as much of the initial part of the string as may be considered a valid integer or year. For the [`FLOAT`](floating-point-types.html "11.1.4 Floating-Point Types (Approximate Value) - FLOAT, DOUBLE") and [`DECIMAL`](fixed-point-types.html "11.1.3 Fixed-Point Types (Exact Value) - DECIMAL, NUMERIC") columns, the string-to-number conversion considers the entire string a valid numeric value.

* An expression *`expr`* can refer to any column that was set earlier in a value list. For example, you can do this because the value for `col2` refers to `col1`, which has previously been assigned:

  ```sql
  INSERT INTO tbl_name (col1,col2) VALUES(15,col1*2);
  ```

  But the following is not legal, because the value for `col1` refers to `col2`, which is assigned after `col1`:

  ```sql
  INSERT INTO tbl_name (col1,col2) VALUES(col2*2,15);
  ```

  An exception occurs for columns that contain `AUTO_INCREMENT` values. Because `AUTO_INCREMENT` values are generated after other value assignments, any reference to an `AUTO_INCREMENT` column in the assignment returns a `0`.

[`INSERT`](insert.html "13.2.5 INSERT Statement") statements that use `VALUES` syntax can insert multiple rows. To do this, include multiple lists of comma-separated column values, with lists enclosed within parentheses and separated by commas. Example:

```sql
INSERT INTO tbl_name (a,b,c) VALUES(1,2,3),(4,5,6),(7,8,9);
```

Each values list must contain exactly as many values as are to be inserted per row. The following statement is invalid because it contains one list of nine values, rather than three lists of three values each:

```sql
INSERT INTO tbl_name (a,b,c) VALUES(1,2,3,4,5,6,7,8,9);
```

`VALUE` is a synonym for `VALUES` in this context. Neither implies anything about the number of values lists, nor about the number of values per list. Either may be used whether there is a single values list or multiple lists, and regardless of the number of values per list.

The affected-rows value for an [`INSERT`](insert.html "13.2.5 INSERT Statement") can be obtained using the [`ROW_COUNT()`](information-functions.html#function_row-count) SQL function or the [`mysql_affected_rows()`](/doc/c-api/5.7/en/mysql-affected-rows.html) C API function. See [Section 12.15, “Information Functions”](information-functions.html "12.15 Information Functions"), and [mysql\_affected\_rows()](/doc/c-api/5.7/en/mysql-affected-rows.html).

If you use an [`INSERT ... VALUES`](insert.html "13.2.5 INSERT Statement") statement with multiple value lists or [`INSERT ... SELECT`](insert-select.html "13.2.5.1 INSERT ... SELECT Statement"), the statement returns an information string in this format:

```sql
Records: N1 Duplicates: N2 Warnings: N3
```

If you are using the C API, the information string can be obtained by invoking the [`mysql_info()`](/doc/c-api/5.7/en/mysql-info.html) function. See [mysql\_info()](/doc/c-api/5.7/en/mysql-info.html).

`Records` indicates the number of rows processed by the statement. (This is not necessarily the number of rows actually inserted because `Duplicates` can be nonzero.) `Duplicates` indicates the number of rows that could not be inserted because they would duplicate some existing unique index value. `Warnings` indicates the number of attempts to insert column values that were problematic in some way. Warnings can occur under any of the following conditions:

* Inserting `NULL` into a column that has been declared `NOT NULL`. For multiple-row [`INSERT`](insert.html "13.2.5 INSERT Statement") statements or [`INSERT INTO ... SELECT`](insert-select.html "13.2.5.1 INSERT ... SELECT Statement") statements, the column is set to the implicit default value for the column data type. This is `0` for numeric types, the empty string (`''`) for string types, and the “zero” value for date and time types. [`INSERT INTO ... SELECT`](insert-select.html "13.2.5.1 INSERT ... SELECT Statement") statements are handled the same way as multiple-row inserts because the server does not examine the result set from the [`SELECT`](select.html "13.2.9 SELECT Statement") to see whether it returns a single row. (For a single-row [`INSERT`](insert.html "13.2.5 INSERT Statement"), no warning occurs when `NULL` is inserted into a `NOT NULL` column. Instead, the statement fails with an error.)

* Setting a numeric column to a value that lies outside the column range. The value is clipped to the closest endpoint of the range.

* Assigning a value such as `'10.34 a'` to a numeric column. The trailing nonnumeric text is stripped off and the remaining numeric part is inserted. If the string value has no leading numeric part, the column is set to `0`.

* Inserting a string into a string column ([`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types"), or [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types")) that exceeds the column maximum length. The value is truncated to the column maximum length.

* Inserting a value into a date or time column that is illegal for the data type. The column is set to the appropriate zero value for the type.

* For [`INSERT`](insert.html "13.2.5 INSERT Statement") examples involving `AUTO_INCREMENT` column values, see [Section 3.6.9, “Using AUTO\_INCREMENT”](example-auto-increment.html "3.6.9 Using AUTO_INCREMENT").

  If [`INSERT`](insert.html "13.2.5 INSERT Statement") inserts a row into a table that has an `AUTO_INCREMENT` column, you can find the value used for that column by using the [`LAST_INSERT_ID()`](information-functions.html#function_last-insert-id) SQL function or the [`mysql_insert_id()`](/doc/c-api/5.7/en/mysql-insert-id.html) C API function.

  Note

  These two functions do not always behave identically. The behavior of [`INSERT`](insert.html "13.2.5 INSERT Statement") statements with respect to `AUTO_INCREMENT` columns is discussed further in [Section 12.15, “Information Functions”](information-functions.html "12.15 Information Functions"), and [mysql\_insert\_id()](/doc/c-api/5.7/en/mysql-insert-id.html).

The [`INSERT`](insert.html "13.2.5 INSERT Statement") statement supports the following modifiers:

* If you use the `LOW_PRIORITY` modifier, execution of the [`INSERT`](insert.html "13.2.5 INSERT Statement") is delayed until no other clients are reading from the table. This includes other clients that began reading while existing clients are reading, and while the `INSERT LOW_PRIORITY` statement is waiting. It is possible, therefore, for a client that issues an `INSERT LOW_PRIORITY` statement to wait for a very long time.

  `LOW_PRIORITY` affects only storage engines that use only table-level locking (such as `MyISAM`, `MEMORY`, and `MERGE`).

  Note

  `LOW_PRIORITY` should normally not be used with `MyISAM` tables because doing so disables concurrent inserts. See [Section 8.11.3, “Concurrent Inserts”](concurrent-inserts.html "8.11.3 Concurrent Inserts").

* If you specify `HIGH_PRIORITY`, it overrides the effect of the [`--low-priority-updates`](server-system-variables.html#sysvar_low_priority_updates) option if the server was started with that option. It also causes concurrent inserts not to be used. See [Section 8.11.3, “Concurrent Inserts”](concurrent-inserts.html "8.11.3 Concurrent Inserts").

  `HIGH_PRIORITY` affects only storage engines that use only table-level locking (such as `MyISAM`, `MEMORY`, and `MERGE`).

* If you use the `IGNORE` modifier, ignorable errors that occur while executing the [`INSERT`](insert.html "13.2.5 INSERT Statement") statement are ignored. For example, without `IGNORE`, a row that duplicates an existing `UNIQUE` index or `PRIMARY KEY` value in the table causes a duplicate-key error and the statement is aborted. With `IGNORE`, the row is discarded and no error occurs. Ignored errors generate warnings instead.

  `IGNORE` has a similar effect on inserts into partitioned tables where no partition matching a given value is found. Without `IGNORE`, such [`INSERT`](insert.html "13.2.5 INSERT Statement") statements are aborted with an error. When [`INSERT IGNORE`](insert.html "13.2.5 INSERT Statement") is used, the insert operation fails silently for rows containing the unmatched value, but inserts rows that are matched. For an example, see [Section 22.2.2, “LIST Partitioning”](partitioning-list.html "22.2.2 LIST Partitioning").

  Data conversions that would trigger errors abort the statement if `IGNORE` is not specified. With `IGNORE`, invalid values are adjusted to the closest values and inserted; warnings are produced but the statement does not abort. You can determine with the [`mysql_info()`](/doc/c-api/5.7/en/mysql-info.html) C API function how many rows were actually inserted into the table.

  For more information, see [The Effect of IGNORE on Statement Execution](sql-mode.html#ignore-effect-on-execution "The Effect of IGNORE on Statement Execution").

  You can use [`REPLACE`](replace.html "13.2.8 REPLACE Statement") instead of [`INSERT`](insert.html "13.2.5 INSERT Statement") to overwrite old rows. [`REPLACE`](replace.html "13.2.8 REPLACE Statement") is the counterpart to [`INSERT IGNORE`](insert.html "13.2.5 INSERT Statement") in the treatment of new rows that contain unique key values that duplicate old rows: The new rows replace the old rows rather than being discarded. See [Section 13.2.8, “REPLACE Statement”](replace.html "13.2.8 REPLACE Statement").

* If you specify `ON DUPLICATE KEY UPDATE`, and a row is inserted that would cause a duplicate value in a `UNIQUE` index or `PRIMARY KEY`, an [`UPDATE`](update.html "13.2.11 UPDATE Statement") of the old row occurs. The affected-rows value per row is 1 if the row is inserted as a new row, 2 if an existing row is updated, and 0 if an existing row is set to its current values. If you specify the `CLIENT_FOUND_ROWS` flag to the [`mysql_real_connect()`](/doc/c-api/5.7/en/mysql-real-connect.html) C API function when connecting to [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), the affected-rows value is 1 (not 0) if an existing row is set to its current values. See [Section 13.2.5.2, “INSERT ... ON DUPLICATE KEY UPDATE Statement”](insert-on-duplicate.html "13.2.5.2 INSERT ... ON DUPLICATE KEY UPDATE Statement").

* [`INSERT DELAYED`](insert-delayed.html "13.2.5.3 INSERT DELAYED Statement") was deprecated in MySQL 5.6, and is scheduled for eventual removal. In MySQL 5.7, the `DELAYED` modifier is accepted but ignored. Use `INSERT` (without `DELAYED`) instead. See [Section 13.2.5.3, “INSERT DELAYED Statement”](insert-delayed.html "13.2.5.3 INSERT DELAYED Statement").

An `INSERT` statement affecting a partitioned table using a storage engine such as [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") that employs table-level locks locks only those partitions into which rows are actually inserted. (For storage engines such as [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") that employ row-level locking, no locking of partitions takes place.) For more information, see [Section 22.6.4, “Partitioning and Locking”](partitioning-limitations-locking.html "22.6.4 Partitioning and Locking").
