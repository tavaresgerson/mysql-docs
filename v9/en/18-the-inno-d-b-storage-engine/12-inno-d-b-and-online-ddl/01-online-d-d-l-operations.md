### 17.12.1 Online DDL Operations

Online support details, syntax examples, and usage notes for DDL operations are provided under the following topics in this section.

* Index Operations
* Primary Key Operations
* Column Operations
* Generated Column Operations
* Foreign Key Operations
* Table Operations
* Tablespace Operations
* Partitioning Operations

#### Index Operations

The following table provides an overview of online DDL support for index operations. An asterisk indicates additional information, an exception, or a dependency. For details, see Syntax and Usage Notes.

**Table 17.13 Online DDL Support for Index Operations**

<table summary="Online DDL support for index operations indicating whether the operation is performed in place, rebuilds the table, permits concurrent DML, or only modifies metadata."><col align="left" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><thead><tr> <th>Operation</th> <th>Instant</th> <th>In Place</th> <th>Rebuilds Table</th> <th>Permits Concurrent DML</th> <th>Only Modifies Metadata</th> </tr></thead><tbody><tr> <th>Creating or adding a secondary index</th> <td>No</td> <td>Yes</td> <td>No</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Dropping an index</th> <td>No</td> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th>Renaming an index</th> <td>No</td> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th>Adding a <code>FULLTEXT</code> index</th> <td>No</td> <td>Yes*</td> <td>No*</td> <td>No</td> <td>No</td> </tr><tr> <th>Adding a <code>SPATIAL</code> index</th> <td>No</td> <td>Yes</td> <td>No</td> <td>No</td> <td>No</td> </tr><tr> <th>Changing the index type</th> <td>Yes</td> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr></tbody></table>

##### Syntax and Usage Notes

* Creating or adding a secondary index

  ```
  CREATE INDEX name ON table (col_list);
  ```

  ```
  ALTER TABLE tbl_name ADD INDEX name (col_list);
  ```

  The table remains available for read and write operations while the index is being created. The `CREATE INDEX` statement only finishes after all transactions that are accessing the table are completed, so that the initial state of the index reflects the most recent contents of the table.

  Online DDL support for adding secondary indexes means that you can generally speed the overall process of creating and loading a table and associated indexes by creating the table without secondary indexes, then adding secondary indexes after the data is loaded.

  A newly created secondary index contains only the committed data in the table at the time the `CREATE INDEX` or `ALTER TABLE` statement finishes executing. It does not contain any uncommitted values, old versions of values, or values marked for deletion but not yet removed from the old index.

  Some factors affect the performance, space usage, and semantics of this operation. For details, see Section 17.12.8, “Online DDL Limitations”.

* Dropping an index

  ```
  DROP INDEX name ON table;
  ```

  ```
  ALTER TABLE tbl_name DROP INDEX name;
  ```

  The table remains available for read and write operations while the index is being dropped. The `DROP INDEX` statement only finishes after all transactions that are accessing the table are completed, so that the initial state of the index reflects the most recent contents of the table.

* Renaming an index

  ```
  ALTER TABLE tbl_name RENAME INDEX old_index_name TO new_index_name, ALGORITHM=INPLACE, LOCK=NONE;
  ```

* Adding a `FULLTEXT` index

  ```
  CREATE FULLTEXT INDEX name ON table(column);
  ```

  Adding the first `FULLTEXT` index rebuilds the table if there is no user-defined `FTS_DOC_ID` column. Additional `FULLTEXT` indexes may be added without rebuilding the table.

* Adding a `SPATIAL` index

  ```
  CREATE TABLE geom (g GEOMETRY NOT NULL);
  ALTER TABLE geom ADD SPATIAL INDEX(g), ALGORITHM=INPLACE, LOCK=SHARED;
  ```

* Changing the index type (`USING {BTREE | HASH}`)

  ```
  ALTER TABLE tbl_name DROP INDEX i1, ADD INDEX i1(key_part,...) USING BTREE, ALGORITHM=INSTANT;
  ```

#### Primary Key Operations

The following table provides an overview of online DDL support for primary key operations. An asterisk indicates additional information, an exception, or a dependency. See Syntax and Usage Notes.

**Table 17.14 Online DDL Support for Primary Key Operations**

<table summary="Online DDL support for primary key operations indicating whether the operation is performed in place, rebuilds the table, permits concurrent DML, or only modifies metadata."><col align="left" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><thead><tr> <th>Operation</th> <th>Instant</th> <th>In Place</th> <th>Rebuilds Table</th> <th>Permits Concurrent DML</th> <th>Only Modifies Metadata</th> </tr></thead><tbody><tr> <th>Adding a primary key</th> <td>No</td> <td>Yes*</td> <td>Yes*</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Dropping a primary key</th> <td>No</td> <td>No</td> <td>Yes</td> <td>No</td> <td>No</td> </tr><tr> <th>Dropping a primary key and adding another</th> <td>No</td> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr></tbody></table>

##### Syntax and Usage Notes

* Adding a primary key

  ```
  ALTER TABLE tbl_name ADD PRIMARY KEY (column), ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Rebuilds the table in place. Data is reorganized substantially, making it an expensive operation. `ALGORITHM=INPLACE` is not permitted under certain conditions if columns have to be converted to `NOT NULL`.

  Restructuring the clustered index always requires copying of table data. Thus, it is best to define the primary key when you create a table, rather than issuing `ALTER TABLE ... ADD PRIMARY KEY` later.

  When you create a `UNIQUE` or `PRIMARY KEY` index, MySQL must do some extra work. For `UNIQUE` indexes, MySQL checks that the table contains no duplicate values for the key. For a `PRIMARY KEY` index, MySQL also checks that none of the `PRIMARY KEY` columns contains a `NULL`.

  When you add a primary key using the `ALGORITHM=COPY` clause, MySQL converts `NULL` values in the associated columns to default values: 0 for numbers, an empty string for character-based columns and BLOBs, and 0000-00-00 00:00:00 for `DATETIME`. This is a non-standard behavior that Oracle recommends you not rely on. Adding a primary key using `ALGORITHM=INPLACE` is only permitted when the `SQL_MODE` setting includes the `strict_trans_tables` or `strict_all_tables` flags; when the `SQL_MODE` setting is strict, `ALGORITHM=INPLACE` is permitted, but the statement can still fail if the requested primary key columns contain `NULL` values. The `ALGORITHM=INPLACE` behavior is more standard-compliant.

  If you create a table without a primary key, `InnoDB` chooses one for you, which can be the first `UNIQUE` key defined on `NOT NULL` columns, or a system-generated key. To avoid uncertainty and the potential space requirement for an extra hidden column, specify the `PRIMARY KEY` clause as part of the `CREATE TABLE` statement.

  MySQL creates a new clustered index by copying the existing data from the original table to a temporary table that has the desired index structure. Once the data is completely copied to the temporary table, the original table is renamed with a different temporary table name. The temporary table comprising the new clustered index is renamed with the name of the original table, and the original table is dropped from the database.

  The online performance enhancements that apply to operations on secondary indexes do not apply to the primary key index. The rows of an InnoDB table are stored in a clustered index organized based on the primary key, forming what some database systems call an “index-organized table”. Because the table structure is closely tied to the primary key, redefining the primary key still requires copying the data.

  When an operation on the primary key uses `ALGORITHM=INPLACE`, even though the data is still copied, it is more efficient than using `ALGORITHM=COPY` because:

  + No undo logging or associated redo logging is required for `ALGORITHM=INPLACE`. These operations add overhead to DDL statements that use `ALGORITHM=COPY`.

  + The secondary index entries are pre-sorted, and so can be loaded in order.

  + The change buffer is not used, because there are no random-access inserts into the secondary indexes.

* Dropping a primary key

  ```
  ALTER TABLE tbl_name DROP PRIMARY KEY, ALGORITHM=COPY;
  ```

  Only `ALGORITHM=COPY` supports dropping a primary key without adding a new one in the same `ALTER TABLE` statement.

* Dropping a primary key and adding another

  ```
  ALTER TABLE tbl_name DROP PRIMARY KEY, ADD PRIMARY KEY (column), ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Data is reorganized substantially, making it an expensive operation.

#### Column Operations

The following table provides an overview of online DDL support for column operations. An asterisk indicates additional information, an exception, or a dependency. For details, see Syntax and Usage Notes.

**Table 17.15 Online DDL Support for Column Operations**

<table summary="Online DDL support for column operations indicating whether the operation is performed in place, rebuilds the table, permits concurrent DML, or only modifies metadata."><col align="left" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><thead><tr> <th>Operation</th> <th>Instant</th> <th>In Place</th> <th>Rebuilds Table</th> <th>Permits Concurrent DML</th> <th>Only Modifies Metadata</th> </tr></thead><tbody><tr> <th>Adding a column</th> <td>Yes*</td> <td>Yes</td> <td>No*</td> <td>Yes*</td> <td>Yes</td> </tr><tr> <th>Dropping a column</th> <td>Yes*</td> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th>Renaming a column</th> <td>Yes*</td> <td>Yes</td> <td>No</td> <td>Yes*</td> <td>Yes</td> </tr><tr> <th>Reordering columns</th> <td>No</td> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Setting a column default value</th> <td>Yes</td> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th>Changing the column data type</th> <td>No</td> <td>No</td> <td>Yes</td> <td>No</td> <td>No</td> </tr><tr> <th>Extending <code>VARCHAR</code> column size</th> <td>No</td> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th>Dropping the column default value</th> <td>Yes</td> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th>Changing the auto-increment value</th> <td>No</td> <td>Yes</td> <td>No</td> <td>Yes</td> <td>No*</td> </tr><tr> <th>Making a column <code>NULL</code></th> <td>No</td> <td>Yes</td> <td>Yes*</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Making a column <code>NOT NULL</code></th> <td>No</td> <td>Yes*</td> <td>Yes*</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Modifying the definition of an <code>ENUM</code> or <code>SET</code> column</th> <td>Yes</td> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr></tbody></table>

##### Syntax and Usage Notes

* Adding a column

  ```
  ALTER TABLE tbl_name ADD COLUMN column_name column_definition, ALGORITHM=INSTANT;
  ```

  `INSTANT` is the default algorithm in MySQL 9.5.

  The following limitations apply when the `INSTANT` algorithm adds a column:

  + A statement cannot combine the addition of a column with other `ALTER TABLE` actions that do not support the `INSTANT` algorithm.

  + The `INSTANT` algorithm can add a column at any position in the table.

  + Columns cannot be added to tables that use `ROW_FORMAT=COMPRESSED`, tables with a `FULLTEXT` index, tables that reside in the data dictionary tablespace, or temporary tables. Temporary tables only support `ALGORITHM=COPY`.

  + MySQL checks the row size when the `INSTANT` algorithm adds a column, and throws the following error if the addition exceeds the limit.

    ERROR 4092 (HY000): Column can't be added with ALGORITHM=INSTANT as after this max possible row size crosses max permissible row size. Try ALGORITHM=INPLACE/COPY.

  + The maximum number of columns in the internal representation of the table cannot exceed 1022 after column addition with the `INSTANT` algorithm. The error message is:

    ERROR 4158 (HY000): Column can't be added to *`tbl_name`* with ALGORITHM=INSTANT anymore. Please try ALGORITHM=INPLACE/COPY

  + The `INSTANT` algorithm can not add or drop columns to system schema tables, such as the internal `mysql` table.

  + A column with a functional index cannot be dropped using the `INSTANT` algorithm.

  Multiple columns may be added in the same `ALTER TABLE` statement. For example:

  ```
  ALTER TABLE t1 ADD COLUMN c2 INT, ADD COLUMN c3 INT, ALGORITHM=INSTANT;
  ```

  A new row version is created after each `ALTER TABLE ... ALGORITHM=INSTANT` operation that adds one or more columns, drops one or more columns, or adds and drops one or more columns in the same operation. The `INFORMATION_SCHEMA.INNODB_TABLES.TOTAL_ROW_VERSIONS` column tracks the number of row versions for a table. The value is incremented each time a column is instantly added or dropped. The initial value is 0.

  ```
  mysql>  SELECT NAME, TOTAL_ROW_VERSIONS FROM INFORMATION_SCHEMA.INNODB_TABLES
          WHERE NAME LIKE 'test/t1';
  +---------+--------------------+
  | NAME    | TOTAL_ROW_VERSIONS |
  +---------+--------------------+
  | test/t1 |                  0 |
  +---------+--------------------+
  ```

  When a table with instantly added or dropped columns is rebuilt by table-rebuilding `ALTER TABLE` or `OPTIMIZE TABLE` operation, the `TOTAL_ROW_VERSIONS` value is reset to 0. The maximum number of row versions permitted is 255, as each row version requires additional space for table metadata. When the row version limit is reached, `ADD COLUMN` and `DROP COLUMN` operations using `ALGORITHM=INSTANT` are rejected with an error message that recommends rebuilding the table using the `COPY` or `INPLACE` algorithm.

  ERROR 4092 (HY000): Maximum row versions reached for table test/t1. No more columns can be added or dropped instantly. Please use COPY/INPLACE.

  The following `INFORMATION_SCHEMA` columns provide additional metadata for instantly added columns. Refer to the descriptions of those columns for more information. See Section 28.4.9, “The INFORMATION\_SCHEMA INNODB\_COLUMNS Table”, and Section 28.4.23, “The INFORMATION\_SCHEMA INNODB\_TABLES Table”.

  + `INNODB_COLUMNS.DEFAULT_VALUE`
  + `INNODB_COLUMNS.HAS_DEFAULT`
  + `INNODB_TABLES.INSTANT_COLS`

  Concurrent DML is not permitted when adding an auto-increment column. Data is reorganized substantially, making it an expensive operation. At a minimum, `ALGORITHM=INPLACE, LOCK=SHARED` is required.

  The table is rebuilt if `ALGORITHM=INPLACE` is used to add a column.

* Dropping a column

  ```
  ALTER TABLE tbl_name DROP COLUMN column_name, ALGORITHM=INSTANT;
  ```

  `INSTANT` is the default algorithm in MySQL 9.5.

  The following limitations apply when the `INSTANT` algorithm is used to drop a column:

  + Dropping a column cannot be combined in the same statement with other `ALTER TABLE` actions that do not support `ALGORITHM=INSTANT`.

  + Columns cannot be dropped from tables that use `ROW_FORMAT=COMPRESSED`, tables with a `FULLTEXT` index, tables that reside in the data dictionary tablespace, or temporary tables. Temporary tables only support `ALGORITHM=COPY`.

  Multiple columns may be dropped in the same `ALTER TABLE` statement; for example:

  ```
  ALTER TABLE t1 DROP COLUMN c4, DROP COLUMN c5, ALGORITHM=INSTANT;
  ```

  Each time a column is added or dropped using `ALGORITHM=INSTANT`, a new row version is created. The `INFORMATION_SCHEMA.INNODB_TABLES.TOTAL_ROW_VERSIONS` column tracks the number of row versions for a table. The value is incremented each time a column is instantly added or dropped. The initial value is 0.

  ```
  mysql>  SELECT NAME, TOTAL_ROW_VERSIONS FROM INFORMATION_SCHEMA.INNODB_TABLES
          WHERE NAME LIKE 'test/t1';
  +---------+--------------------+
  | NAME    | TOTAL_ROW_VERSIONS |
  +---------+--------------------+
  | test/t1 |                  0 |
  +---------+--------------------+
  ```

  When a table with instantly added or dropped columns is rebuilt by table-rebuilding `ALTER TABLE` or `OPTIMIZE TABLE` operation, the `TOTAL_ROW_VERSIONS` value is reset to 0. The maximum number of row versions permitted is 255, as each row version requires additional space for table metadata. When the row version limit is reached, `ADD COLUMN` and `DROP COLUMN` operations using `ALGORITHM=INSTANT` are rejected with an error message that recommends rebuilding the table using the `COPY` or `INPLACE` algorithm.

  ERROR 4092 (HY000): Maximum row versions reached for table test/t1. No more columns can be added or dropped instantly. Please use COPY/INPLACE.

  If an algorithm other than `ALGORITHM=INSTANT` is used, data is reorganized substantially, making it an expensive operation.

* Renaming a column

  ```
  ALTER TABLE tbl CHANGE old_col_name new_col_name data_type, ALGORITHM=INSTANT;
  ```

  To permit concurrent DML, keep the same data type and only change the column name.

  When you keep the same data type and `[NOT] NULL` attribute, only changing the column name, the operation can always be performed online.

  Renaming a column referenced from another table is only permitted with `ALGORITHM=INPLACE`. If you use `ALGORITHM=INSTANT`, `ALGORITHM=COPY`, or some other condition that causes the operation to use those algorithms, the `ALTER TABLE` statement fails.

  `ALGORITHM=INSTANT` supports renaming a virtual column; `ALGORITHM=INPLACE` does not.

  `ALGORITHM=INSTANT` and `ALGORITHM=INPLACE` do not support renaming a column when adding or dropping a virtual column in the same statement. In this case, only `ALGORITHM=COPY` is supported.

* Reordering columns

  To reorder columns, use `FIRST` or `AFTER` in `CHANGE` or `MODIFY` operations.

  ```
  ALTER TABLE tbl_name MODIFY COLUMN col_name column_definition FIRST, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Data is reorganized substantially, making it an expensive operation.

* Changing the column data type

  ```
  ALTER TABLE tbl_name CHANGE c1 c1 BIGINT, ALGORITHM=COPY;
  ```

  Changing the column data type is only supported with `ALGORITHM=COPY`.

* Extending `VARCHAR` column size

  ```
  ALTER TABLE tbl_name CHANGE COLUMN c1 c1 VARCHAR(255), ALGORITHM=INPLACE, LOCK=NONE;
  ```

  The number of length bytes required by a `VARCHAR` column must remain the same. For `VARCHAR` columns of 0 to 255 bytes in size, one length byte is required to encode the value. For `VARCHAR` columns of 256 bytes in size or more, two length bytes are required. As a result, in-place `ALTER TABLE` only supports increasing `VARCHAR` column size from 0 to 255 bytes, or from 256 bytes to a greater size. In-place `ALTER TABLE` does not support increasing the size of a `VARCHAR` column from less than 256 bytes to a size equal to or greater than 256 bytes. In this case, the number of required length bytes changes from 1 to 2, which is only supported by a table copy (`ALGORITHM=COPY`). For example, attempting to change `VARCHAR` column size for a single byte character set from VARCHAR(255) to VARCHAR(256) using in-place `ALTER TABLE` returns this error:

  ```
  ALTER TABLE tbl_name ALGORITHM=INPLACE, CHANGE COLUMN c1 c1 VARCHAR(256);
  ERROR 0A000: ALGORITHM=INPLACE is not supported. Reason: Cannot change
  column type INPLACE. Try ALGORITHM=COPY.
  ```

  Note

  The byte length of a `VARCHAR` column is dependant on the byte length of the character set.

  Decreasing `VARCHAR` size using in-place `ALTER TABLE` is not supported. Decreasing `VARCHAR` size requires a table copy (`ALGORITHM=COPY`).

* Setting a column default value

  ```
  ALTER TABLE tbl_name ALTER COLUMN col SET DEFAULT literal, ALGORITHM=INSTANT;
  ```

  Only modifies table metadata. Default column values are stored in the data dictionary.

* Dropping a column default value

  ```
  ALTER TABLE tbl ALTER COLUMN col DROP DEFAULT, ALGORITHM=INSTANT;
  ```

* Changing the auto-increment value

  ```
  ALTER TABLE table AUTO_INCREMENT=next_value, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Modifies a value stored in memory, not the data file.

  In a distributed system using replication or sharding, you sometimes reset the auto-increment counter for a table to a specific value. The next row inserted into the table uses the specified value for its auto-increment column. You might also use this technique in a data warehousing environment where you periodically empty all the tables and reload them, and restart the auto-increment sequence from 1.

* Making a column `NULL`

  ```
  ALTER TABLE tbl_name MODIFY COLUMN column_name data_type NULL, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Rebuilds the table in place. Data is reorganized substantially, making it an expensive operation.

* Making a column `NOT NULL`

  ```
  ALTER TABLE tbl_name MODIFY COLUMN column_name data_type NOT NULL, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Rebuilds the table in place. `STRICT_ALL_TABLES` or `STRICT_TRANS_TABLES` `SQL_MODE` is required for the operation to succeed. The operation fails if the column contains NULL values. The server prohibits changes to foreign key columns that have the potential to cause loss of referential integrity. See Section 15.1.11, “ALTER TABLE Statement”. Data is reorganized substantially, making it an expensive operation.

* Modifying the definition of an `ENUM` or `SET` column

  ```
  CREATE TABLE t1 (c1 ENUM('a', 'b', 'c'));
  ALTER TABLE t1 MODIFY COLUMN c1 ENUM('a', 'b', 'c', 'd'), ALGORITHM=INSTANT;
  ```

  Modifying the definition of an `ENUM` or `SET` column by adding new enumeration or set members to the *end* of the list of valid member values may be performed instantly or in place, as long as the storage size of the data type does not change. For example, adding a member to a `SET` column that has 8 members changes the required storage per value from 1 byte to 2 bytes; this requires a table copy. Adding members in the middle of the list causes renumbering of existing members, which requires a table copy.

#### Generated Column Operations

The following table provides an overview of online DDL support for generated column operations. For details, see Syntax and Usage Notes.

**Table 17.16 Online DDL Support for Generated Column Operations**

<table summary="Online DDL support for generated column operations indicating whether the operation is performed in place, rebuilds the table, permits concurrent DML, or only modifies metadata."><col align="left" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><thead><tr> <th>Operation</th> <th>Instant</th> <th>In Place</th> <th>Rebuilds Table</th> <th>Permits Concurrent DML</th> <th>Only Modifies Metadata</th> </tr></thead><tbody><tr> <th>Adding a <code>STORED</code> column</th> <td>No</td> <td>No</td> <td>Yes</td> <td>No</td> <td>No</td> </tr><tr> <th>Modifying <code>STORED</code> column order</th> <td>No</td> <td>No</td> <td>Yes</td> <td>No</td> <td>No</td> </tr><tr> <th>Dropping a <code>STORED</code> column</th> <td>No</td> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Adding a <code>VIRTUAL</code> column</th> <td>Yes</td> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th>Modifying <code>VIRTUAL</code> column order</th> <td>No</td> <td>No</td> <td>Yes</td> <td>No</td> <td>No</td> </tr><tr> <th>Dropping a <code>VIRTUAL</code> column</th> <td>Yes</td> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr></tbody></table>

##### Syntax and Usage Notes

* Adding a `STORED` column

  ```
  ALTER TABLE t1 ADD COLUMN (c2 INT GENERATED ALWAYS AS (c1 + 1) STORED), ALGORITHM=COPY;
  ```

  `ADD COLUMN` is not an in-place operation for stored columns (done without using a temporary table) because the expression must be evaluated by the server.

* Modifying `STORED` column order

  ```
  ALTER TABLE t1 MODIFY COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) STORED FIRST, ALGORITHM=COPY;
  ```

  Rebuilds the table in place.

* Dropping a `STORED` column

  ```
  ALTER TABLE t1 DROP COLUMN c2, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Rebuilds the table in place.

* Adding a `VIRTUAL` column

  ```
  ALTER TABLE t1 ADD COLUMN (c2 INT GENERATED ALWAYS AS (c1 + 1) VIRTUAL), ALGORITHM=INSTANT;
  ```

  Adding a virtual column can be performed instantly or in place for non-partitioned tables.

  Adding a `VIRTUAL` is not an in-place operation for partitioned tables.

* Modifying `VIRTUAL` column order

  ```
  ALTER TABLE t1 MODIFY COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) VIRTUAL FIRST, ALGORITHM=COPY;
  ```

* Dropping a `VIRTUAL` column

  ```
  ALTER TABLE t1 DROP COLUMN c2, ALGORITHM=INSTANT;
  ```

  Dropping a `VIRTUAL` column can be performed instantly or in place for non-partitioned tables.

#### Foreign Key Operations

The following table provides an overview of online DDL support for foreign key operations. An asterisk indicates additional information, an exception, or a dependency. For details, see Syntax and Usage Notes.

**Table 17.17 Online DDL Support for Foreign Key Operations**

<table summary="Online DDL support for foreign key operations indicating whether the operation is performed in place, rebuilds the table, permits concurrent DML, or only modifies metadata."><col align="left" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><thead><tr> <th>Operation</th> <th>Instant</th> <th>In Place</th> <th>Rebuilds Table</th> <th>Permits Concurrent DML</th> <th>Only Modifies Metadata</th> </tr></thead><tbody><tr> <th>Adding a foreign key constraint</th> <td>No</td> <td>Yes*</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th>Dropping a foreign key constraint</th> <td>No</td> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr></tbody></table>

##### Syntax and Usage Notes

* Adding a foreign key constraint

  The `INPLACE` algorithm is supported when `foreign_key_checks` is disabled. Otherwise, only the `COPY` algorithm is supported.

  ```
  ALTER TABLE tbl1 ADD CONSTRAINT fk_name FOREIGN KEY index (col1)
    REFERENCES tbl2(col2) referential_actions;
  ```

* Dropping a foreign key constraint

  ```
  ALTER TABLE tbl DROP FOREIGN KEY fk_name;
  ```

  Dropping a foreign key can be performed online with the `foreign_key_checks` option enabled or disabled.

  If you do not know the names of the foreign key constraints on a particular table, issue the following statement and find the constraint name in the `CONSTRAINT` clause for each foreign key:

  ```
  SHOW CREATE TABLE table\G
  ```

  Or, query the Information Schema `TABLE_CONSTRAINTS` table and use the `CONSTRAINT_NAME` and `CONSTRAINT_TYPE` columns to identify the foreign key names.

  You can also drop a foreign key and its associated index in a single statement:

  ```
  ALTER TABLE table DROP FOREIGN KEY constraint, DROP INDEX index;
  ```

Note

If foreign keys are already present in the table being altered (that is, it is a child table containing a `FOREIGN KEY ... REFERENCE` clause), additional restrictions apply to online DDL operations, even those not directly involving the foreign key columns:

* An `ALTER TABLE` on the child table could wait for another transaction to commit, if a change to the parent table causes associated changes in the child table through an `ON UPDATE` or `ON DELETE` clause using the `CASCADE` or `SET NULL` parameters.

* In the same way, if a table is the parent table in a foreign key relationship, even though it does not contain any `FOREIGN KEY` clauses, it could wait for the `ALTER TABLE` to complete if an `INSERT`, `UPDATE`, or `DELETE` statement causes an `ON UPDATE` or `ON DELETE` action in the child table.

#### Table Operations

The following table provides an overview of online DDL support for table operations. An asterisk indicates additional information, an exception, or a dependency. For details, see Syntax and Usage Notes.

**Table 17.18 Online DDL Support for Table Operations**

<table summary="Online DDL support for table operations indicating whether the operation is performed in place, rebuilds the table, permits concurrent DML, or only modifies metadata."><col align="left" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><thead><tr> <th>Operation</th> <th>Instant</th> <th>In Place</th> <th>Rebuilds Table</th> <th>Permits Concurrent DML</th> <th>Only Modifies Metadata</th> </tr></thead><tbody><tr> <th>Changing the <code>ROW_FORMAT</code></th> <td>No</td> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Changing the <code>KEY_BLOCK_SIZE</code></th> <td>No</td> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Setting persistent table statistics</th> <td>No</td> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th>Specifying a character set</th> <td>No</td> <td>Yes</td> <td>Yes*</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Converting a character set</th> <td>No</td> <td>Yes</td> <td>Yes*</td> <td>No</td> <td>No</td> </tr><tr> <th>Optimizing a table</th> <td>No</td> <td>Yes*</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Rebuilding with the <code>FORCE</code> option</th> <td>No</td> <td>Yes*</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Performing a null rebuild</th> <td>No</td> <td>Yes*</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Renaming a table</th> <td>Yes</td> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr></tbody></table>

##### Syntax and Usage Notes

* Changing the `ROW_FORMAT`

  ```
  ALTER TABLE tbl_name ROW_FORMAT = row_format, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Data is reorganized substantially, making it an expensive operation.

  For additional information about the `ROW_FORMAT` option, see Table Options.

* Changing the `KEY_BLOCK_SIZE`

  ```
  ALTER TABLE tbl_name KEY_BLOCK_SIZE = value, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Data is reorganized substantially, making it an expensive operation.

  For additional information about the `KEY_BLOCK_SIZE` option, see Table Options.

* Setting persistent table statistics options

  ```
  ALTER TABLE tbl_name STATS_PERSISTENT=0, STATS_SAMPLE_PAGES=20, STATS_AUTO_RECALC=1, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Only modifies table metadata.

  Persistent statistics include `STATS_PERSISTENT`, `STATS_AUTO_RECALC`, and `STATS_SAMPLE_PAGES`. For more information, see Section 17.8.10.1, “Configuring Persistent Optimizer Statistics Parameters”.

* Specifying a character set

  ```
  ALTER TABLE tbl_name CHARACTER SET = charset_name, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Rebuilds the table if the new character encoding is different.

* Converting a character set

  ```
  ALTER TABLE tbl_name CONVERT TO CHARACTER SET charset_name, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Rebuilds the table if the new character encoding is different.

* Optimizing a table

  ```
  OPTIMIZE TABLE tbl_name;
  ```

  In-place operation is not supported for tables with `FULLTEXT` indexes. The operation uses the `INPLACE` algorithm, but `ALGORITHM` and `LOCK` syntax is not permitted.

* Rebuilding a table with the `FORCE` option

  ```
  ALTER TABLE tbl_name FORCE, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Uses `ALGORITHM=INPLACE` as of MySQL 5.6.17. `ALGORITHM=INPLACE` is not supported for tables with `FULLTEXT` indexes.

* Performing a "null" rebuild

  ```
  ALTER TABLE tbl_name ENGINE=InnoDB, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Uses `ALGORITHM=INPLACE` as of MySQL 5.6.17. `ALGORITHM=INPLACE` is not supported for tables with `FULLTEXT` indexes.

* Renaming a table

  ```
  ALTER TABLE old_tbl_name RENAME TO new_tbl_name, ALGORITHM=INSTANT;
  ```

  Renaming a table can be performed instantly or in place. MySQL renames files that correspond to the table *`tbl_name`* without making a copy. (You can also use the `RENAME TABLE` statement to rename tables. See Section 15.1.41, “RENAME TABLE Statement”.) Privileges granted specifically for the renamed table are not migrated to the new name. They must be changed manually.

#### Tablespace Operations

The following table provides an overview of online DDL support for tablespace operations. For details, see Syntax and Usage Notes.

**Table 17.19 Online DDL Support for Tablespace Operations**

<table summary="Online DDL support for tablespace operations indicating whether the operation is performed in place, rebuilds tables within the tablespace, permits concurrent DML, or only modifies metadata."><col align="left" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><col align="center" style="width: 16%"/><thead><tr> <th>Operation</th> <th>Instant</th> <th>In Place</th> <th>Rebuilds Table</th> <th>Permits Concurrent DML</th> <th>Only Modifies Metadata</th> </tr></thead><tbody><tr> <th>Renaming a general tablespace</th> <td>No</td> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th>Enabling or disabling general tablespace encryption</th> <td>No</td> <td>Yes</td> <td>No</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Enabling or disabling file-per-table tablespace encryption</th> <td>No</td> <td>No</td> <td>Yes</td> <td>No</td> <td>No</td> </tr></tbody></table>

##### Syntax and Usage Notes

* Renaming a general tablespace

  ```
  ALTER TABLESPACE tablespace_name RENAME TO new_tablespace_name;
  ```

  `ALTER TABLESPACE ... RENAME TO` uses the `INPLACE` algorithm but does not support the `ALGORITHM` clause.

* Enabling or disabling general tablespace encryption

  ```
  ALTER TABLESPACE tablespace_name ENCRYPTION='Y';
  ```

  `ALTER TABLESPACE ... ENCRYPTION` uses the `INPLACE` algorithm but does not support the `ALGORITHM` clause.

  For related information, see Section 17.13, “InnoDB Data-at-Rest Encryption”.

* Enabling or disabling file-per-table tablespace encryption

  ```
  ALTER TABLE tbl_name ENCRYPTION='Y', ALGORITHM=COPY;
  ```

  For related information, see Section 17.13, “InnoDB Data-at-Rest Encryption”.

#### Partitioning Operations

With the exception of some `ALTER TABLE` partitioning clauses, online DDL operations for partitioned `InnoDB` tables follow the same rules that apply to regular `InnoDB` tables.

Some `ALTER TABLE` partitioning clauses do not go through the same internal online DDL API as regular non-partitioned `InnoDB` tables. As a result, online support for `ALTER TABLE` partitioning clauses varies.

The following table shows the online status for each `ALTER TABLE` partitioning statement. Regardless of the online DDL API that is used, MySQL attempts to minimize data copying and locking where possible.

`ALTER TABLE` partitioning options that use `ALGORITHM=COPY` or that only permit “`ALGORITHM=DEFAULT, LOCK=DEFAULT`”, repartition the table using the `COPY` algorithm. In other words, a new partitioned table is created with the new partitioning scheme. The newly created table includes any changes applied by the `ALTER TABLE` statement, and table data is copied into the new table structure.

**Table 17.20 Online DDL Support for Partitioning Operations**

<table summary="Online DDL support for partitioning operations indicating whether the operation is performed in place and permits concurrent DML."><col align="left" style="width: 24%"/><col align="center" style="width: 8%"/><col align="center" style="width: 8%"/><col align="center" style="width: 12%"/><col align="left" style="width: 32%"/><thead><tr> <th>Partitioning Clause</th> <th>Instant</th> <th>In Place</th> <th>Permits DML</th> <th>Notes</th> </tr></thead><tbody><tr> <th><a class="link" href="alter-table.html" title="15.1.11 ALTER TABLE Statement"><code>PARTITION BY</code></a></th> <td>No</td> <td>No</td> <td>No</td> <td>Permits <code>ALGORITHM=COPY</code>, <code>LOCK={DEFAULT|SHARED|EXCLUSIVE}</code></td> </tr><tr> <th><a class="link" href="alter-table.html" title="15.1.11 ALTER TABLE Statement"><code>ADD PARTITION</code></a></th> <td>No</td> <td>Yes*</td> <td>Yes*</td> <td><code>ALGORITHM=INPLACE, LOCK={DEFAULT|NONE|SHARED|EXCLUSISVE}</code> is supported for <code>RANGE</code> and <code>LIST</code> partitions, <code>ALGORITHM=INPLACE, LOCK={DEFAULT|SHARED|EXCLUSISVE}</code> for <code>HASH</code> and <code>KEY</code> partitions, and <code>ALGORITHM=COPY, LOCK={SHARED|EXCLUSIVE}</code> for all partition types. Does not copy existing data for tables partitioned by <code>RANGE</code> or <code>LIST</code>. Concurrent queries are permitted with <code>ALGORITHM=COPY</code> for tables partitioned by <code>HASH</code> or <code>LIST</code>, as MySQL copies the data while holding a shared lock.</td> </tr><tr> <th><a class="link" href="alter-table.html" title="15.1.11 ALTER TABLE Statement"><code>DROP PARTITION</code></a></th> <td>No</td> <td>Yes*</td> <td>Yes*</td> <td><p> <code>ALGORITHM=INPLACE, LOCK={DEFAULT|NONE|SHARED|EXCLUSIVE}</code> is supported. Does not copy data for tables partitioned by <code>RANGE</code> or <code>LIST</code>. </p><p> <code>DROP PARTITION</code> with <code>ALGORITHM=INPLACE</code> deletes data stored in the partition and drops the partition. However, <code>DROP PARTITION</code> with <code>ALGORITHM=COPY</code> or <a class="link" href="server-system-variables.html#sysvar_old_alter_table"><code>old_alter_table=ON</code></a> rebuilds the partitioned table and attempts to move data from the dropped partition to another partition with a compatible <code>PARTITION ... VALUES</code> definition. Data that cannot be moved to another partition is deleted. </p></td> </tr><tr> <th><a class="link" href="alter-table.html" title="15.1.11 ALTER TABLE Statement"><code>DISCARD PARTITION</code></a></th> <td>No</td> <td>No</td> <td>No</td> <td>Only permits <code>ALGORITHM=DEFAULT</code>, <code>LOCK=DEFAULT</code></td> </tr><tr> <th><a class="link" href="alter-table.html" title="15.1.11 ALTER TABLE Statement"><code>IMPORT PARTITION</code></a></th> <td>No</td> <td>No</td> <td>No</td> <td>Only permits <code>ALGORITHM=DEFAULT</code>, <code>LOCK=DEFAULT</code></td> </tr><tr> <th><a class="link" href="alter-table.html" title="15.1.11 ALTER TABLE Statement"><code>TRUNCATE PARTITION</code></a></th> <td>No</td> <td>Yes</td> <td>Yes</td> <td>Does not copy existing data. It merely deletes rows; it does not alter the definition of the table itself, or of any of its partitions.</td> </tr><tr> <th><a class="link" href="alter-table.html" title="15.1.11 ALTER TABLE Statement"><code>COALESCE PARTITION</code></a></th> <td>No</td> <td>Yes*</td> <td>No</td> <td><code>ALGORITHM=INPLACE, LOCK={DEFAULT|SHARED|EXCLUSIVE}</code> is supported.</td> </tr><tr> <th><a class="link" href="alter-table.html" title="15.1.11 ALTER TABLE Statement"><code>REORGANIZE PARTITION</code></a></th> <td>No</td> <td>Yes*</td> <td>No</td> <td><code>ALGORITHM=INPLACE, LOCK={DEFAULT|SHARED|EXCLUSIVE}</code> is supported.</td> </tr><tr> <th><a class="link" href="alter-table.html" title="15.1.11 ALTER TABLE Statement"><code>EXCHANGE PARTITION</code></a></th> <td>No</td> <td>Yes</td> <td>Yes</td> <td></td> </tr><tr> <th><a class="link" href="alter-table.html" title="15.1.11 ALTER TABLE Statement"><code>ANALYZE PARTITION</code></a></th> <td>No</td> <td>Yes</td> <td>Yes</td> <td></td> </tr><tr> <th><a class="link" href="alter-table.html" title="15.1.11 ALTER TABLE Statement"><code>CHECK PARTITION</code></a></th> <td>No</td> <td>Yes</td> <td>Yes</td> <td></td> </tr><tr> <th><a class="link" href="alter-table.html" title="15.1.11 ALTER TABLE Statement"><code>OPTIMIZE PARTITION</code></a></th> <td>No</td> <td>No</td> <td>No</td> <td><code>ALGORITHM</code> and <code>LOCK</code> clauses are ignored. Rebuilds the entire table. See <a class="xref" href="partitioning-maintenance.html" title="26.3.4 Maintenance of Partitions">Section 26.3.4, “Maintenance of Partitions”</a>.</td> </tr><tr> <th><a class="link" href="alter-table.html" title="15.1.11 ALTER TABLE Statement"><code>REBUILD PARTITION</code></a></th> <td>No</td> <td>Yes*</td> <td>No</td> <td><code>ALGORITHM=INPLACE, LOCK={DEFAULT|SHARED|EXCLUSIVE}</code> is supported.</td> </tr><tr> <th><a class="link" href="alter-table.html" title="15.1.11 ALTER TABLE Statement"><code>REPAIR PARTITION</code></a></th> <td>No</td> <td>Yes</td> <td>Yes</td> <td></td> </tr><tr> <th><a class="link" href="alter-table.html" title="15.1.11 ALTER TABLE Statement"><code>REMOVE PARTITIONING</code></a></th> <td>No</td> <td>No</td> <td>No</td> <td>Permits <code>ALGORITHM=COPY</code>, <code>LOCK={DEFAULT|SHARED|EXCLUSIVE}</code></td> </tr></tbody></table>

Non-partitioning online `ALTER TABLE` operations on partitioned tables follow the same rules that apply to regular tables. However, `ALTER TABLE` performs online operations on each table partition, which causes increased demand on system resources due to operations being performed on multiple partitions.

For additional information about `ALTER TABLE` partitioning clauses, see Partitioning Options, and Section 15.1.11.1, “ALTER TABLE Partition Operations”. For information about partitioning in general, see Chapter 26, *Partitioning*.
