## 14.13 InnoDB and Online DDL

The online DDL feature provides support for in-place table alterations and concurrent DML. Benefits of this feature include:

* Improved responsiveness and availability in busy production environments, where making a table unavailable for minutes or hours is not practical.

* The ability to adjust the balance between performance and concurrency during DDL operations using the `LOCK` clause. See The LOCK clause.

* Less disk space usage and I/O overhead than the table-copy method.

Typically, you do not need to do anything special to enable online DDL. By default, MySQL performs the operation in place, as permitted, with as little locking as possible.

You can control aspects of a DDL operation using the `ALGORITHM` and `LOCK` clauses of the `ALTER TABLE` statement. These clauses are placed at the end of the statement, separated from the table and column specifications by commas. For example:

```sql
ALTER TABLE tbl_name ADD PRIMARY KEY (column), ALGORITHM=INPLACE, LOCK=NONE;
```

The `LOCK` clause is useful for fine-tuning the degree of concurrent access to the table. The `ALGORITHM` clause is primarily intended for performance comparisons and as a fallback to the older table-copying behavior in case you encounter any issues. For example:

* To avoid accidentally making the table unavailable for reads, writes, or both, specify a clause on the `ALTER TABLE` statement such as `LOCK=NONE` (permit reads and writes) or `LOCK=SHARED` (permit reads). The operation halts immediately if the requested level of concurrency is not available.

* To compare performance between algorithms, run a statement with `ALGORITHM=INPLACE` and `ALGORITHM=COPY`. Alternatively, run a statement with the `old_alter_table` configuration option disabled and enabled.

* To avoid tying up the server with an `ALTER TABLE` operation that copies the table, include `ALGORITHM=INPLACE`. The statement halts immediately if it cannot use the in-place mechanism.


### 14.13.1 Online DDL Operations

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

**Table 14.10 Online DDL Support for Index Operations**

<table summary="Online DDL support for index operations indicating whether the operation is performed in place, rebuilds the table, permits concurrent DML, or only modifies metadata."><col align="left" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr> <th>Operation</th> <th>In Place</th> <th>Rebuilds Table</th> <th>Permits Concurrent DML</th> <th>Only Modifies Metadata</th> </tr></thead><tbody><tr> <th>Creating or adding a secondary index</th> <td>Yes</td> <td>No</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Dropping an index</th> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th>Renaming an index</th> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th>Adding a <code>FULLTEXT</code> index</th> <td>Yes*</td> <td>No*</td> <td>No</td> <td>No</td> </tr><tr> <th>Adding a <code>SPATIAL</code> index</th> <td>Yes</td> <td>No</td> <td>No</td> <td>No</td> </tr><tr> <th>Changing the index type</th> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr></tbody></table>

##### Syntax and Usage Notes

* Creating or adding a secondary index

  ```sql
  CREATE INDEX name ON table (col_list);
  ```

  ```sql
  ALTER TABLE tbl_name ADD INDEX name (col_list);
  ```

  The table remains available for read and write operations while the index is being created. The `CREATE INDEX` statement only finishes after all transactions that are accessing the table are completed, so that the initial state of the index reflects the most recent contents of the table.

  Online DDL support for adding secondary indexes means that you can generally speed the overall process of creating and loading a table and associated indexes by creating the table without secondary indexes, then adding secondary indexes after the data is loaded.

  A newly created secondary index contains only the committed data in the table at the time the `CREATE INDEX` or `ALTER TABLE` statement finishes executing. It does not contain any uncommitted values, old versions of values, or values marked for deletion but not yet removed from the old index.

  If the server exits while creating a secondary index, upon recovery, MySQL drops any partially created indexes. You must re-run the `ALTER TABLE` or `CREATE INDEX` statement.

  Some factors affect the performance, space usage, and semantics of this operation. For details, see Section 14.13.6, “Online DDL Limitations”.

* Dropping an index

  ```sql
  DROP INDEX name ON table;
  ```

  ```sql
  ALTER TABLE tbl_name DROP INDEX name;
  ```

  The table remains available for read and write operations while the index is being dropped. The `DROP INDEX` statement only finishes after all transactions that are accessing the table are completed, so that the initial state of the index reflects the most recent contents of the table.

* Renaming an index

  ```sql
  ALTER TABLE tbl_name RENAME INDEX old_index_name TO new_index_name, ALGORITHM=INPLACE, LOCK=NONE;
  ```

* Adding a `FULLTEXT` index

  ```sql
  CREATE FULLTEXT INDEX name ON table(column);
  ```

  Adding the first `FULLTEXT` index rebuilds the table if there is no user-defined `FTS_DOC_ID` column. Additional `FULLTEXT` indexes may be added without rebuilding the table.

* Adding a `SPATIAL` index

  ```sql
  CREATE TABLE geom (g GEOMETRY NOT NULL);
  ALTER TABLE geom ADD SPATIAL INDEX(g), ALGORITHM=INPLACE, LOCK=SHARED;
  ```

* Changing the index type (`USING {BTREE | HASH}`)

  ```sql
  ALTER TABLE tbl_name DROP INDEX i1, ADD INDEX i1(key_part,...) USING BTREE, ALGORITHM=INPLACE;
  ```

#### Primary Key Operations

The following table provides an overview of online DDL support for primary key operations. An asterisk indicates additional information, an exception, or a dependency. See Syntax and Usage Notes.

**Table 14.11 Online DDL Support for Primary Key Operations**

<table summary="Online DDL support for primary key operations indicating whether the operation is performed in place, rebuilds the table, permits concurrent DML, or only modifies metadata."><col align="left" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr> <th>Operation</th> <th>In Place</th> <th>Rebuilds Table</th> <th>Permits Concurrent DML</th> <th>Only Modifies Metadata</th> </tr></thead><tbody><tr> <th>Adding a primary key</th> <td>Yes*</td> <td>Yes*</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Dropping a primary key</th> <td>No</td> <td>Yes</td> <td>No</td> <td>No</td> </tr><tr> <th>Dropping a primary key and adding another</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr></tbody></table>

##### Syntax and Usage Notes

* Adding a primary key

  ```sql
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

  If the server exits while creating a new clustered index, no data is lost, but you must complete the recovery process using the temporary tables that exist during the process. Since it is rare to re-create a clustered index or re-define primary keys on large tables, or to encounter a system crash during this operation, this manual does not provide information on recovering from this scenario.

* Dropping a primary key

  ```sql
  ALTER TABLE tbl_name DROP PRIMARY KEY, ALGORITHM=COPY;
  ```

  Only `ALGORITHM=COPY` supports dropping a primary key without adding a new one in the same `ALTER TABLE` statement.

* Dropping a primary key and adding another

  ```sql
  ALTER TABLE tbl_name DROP PRIMARY KEY, ADD PRIMARY KEY (column), ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Data is reorganized substantially, making it an expensive operation.

#### Column Operations

The following table provides an overview of online DDL support for column operations. An asterisk indicates additional information, an exception, or a dependency. For details, see Syntax and Usage Notes.

**Table 14.12 Online DDL Support for Column Operations**

<table summary="Online DDL support for column operations indicating whether the operation is performed in place, rebuilds the table, permits concurrent DML, or only modifies metadata."><col align="left" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr> <th>Operation</th> <th>In Place</th> <th>Rebuilds Table</th> <th>Permits Concurrent DML</th> <th>Only Modifies Metadata</th> </tr></thead><tbody><tr> <th>Adding a column</th> <td>Yes</td> <td>Yes</td> <td>Yes*</td> <td>No</td> </tr><tr> <th>Dropping a column</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Renaming a column</th> <td>Yes</td> <td>No</td> <td>Yes*</td> <td>Yes</td> </tr><tr> <th>Reordering columns</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Setting a column default value</th> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th>Changing the column data type</th> <td>No</td> <td>Yes</td> <td>No</td> <td>No</td> </tr><tr> <th>Extending <code>VARCHAR</code> column size</th> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th>Dropping the column default value</th> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th>Changing the auto-increment value</th> <td>Yes</td> <td>No</td> <td>Yes</td> <td>No*</td> </tr><tr> <th>Making a column <code>NULL</code></th> <td>Yes</td> <td>Yes*</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Making a column <code>NOT NULL</code></th> <td>Yes*</td> <td>Yes*</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Modifying the definition of an <code>ENUM</code> or <code>SET</code> column</th> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr></tbody></table>

##### Syntax and Usage Notes

* Adding a column

  ```sql
  ALTER TABLE tbl_name ADD COLUMN column_name column_definition, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Concurrent DML is not permitted when adding an auto-increment column. Data is reorganized substantially, making it an expensive operation. At a minimum, `ALGORITHM=INPLACE, LOCK=SHARED` is required.

* Dropping a column

  ```sql
  ALTER TABLE tbl_name DROP COLUMN column_name, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Data is reorganized substantially, making it an expensive operation.

* Renaming a column

  ```sql
  ALTER TABLE tbl CHANGE old_col_name new_col_name data_type, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  To permit concurrent DML, keep the same data type and only change the column name.

  When you keep the same data type and `[NOT] NULL` attribute, only changing the column name, the operation can always be performed online.

  You can also rename a column that is part of a foreign key constraint. The foreign key definition is automatically updated to use the new column name. Renaming a column participating in a foreign key only works with `ALGORITHM=INPLACE`. If you use the `ALGORITHM=COPY` clause, or some other condition causes the operation to use `ALGORITHM=COPY`, the `ALTER TABLE` statement fails.

  `ALGORITHM=INPLACE` is not supported for renaming a generated column.

* Reordering columns

  To reorder columns, use `FIRST` or `AFTER` in `CHANGE` or `MODIFY` operations.

  ```sql
  ALTER TABLE tbl_name MODIFY COLUMN col_name column_definition FIRST, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Data is reorganized substantially, making it an expensive operation.

* Changing the column data type

  ```sql
  ALTER TABLE tbl_name CHANGE c1 c1 BIGINT, ALGORITHM=COPY;
  ```

  Changing the column data type is only supported with `ALGORITHM=COPY`.

* Extending `VARCHAR` column size

  ```sql
  ALTER TABLE tbl_name CHANGE COLUMN c1 c1 VARCHAR(255), ALGORITHM=INPLACE, LOCK=NONE;
  ```

  The number of length bytes required by a `VARCHAR` column must remain the same. For `VARCHAR` columns of 0 to 255 bytes in size, one length byte is required to encode the value. For `VARCHAR` columns of 256 bytes in size or more, two length bytes are required. As a result, in-place `ALTER TABLE` only supports increasing `VARCHAR` column size from 0 to 255 bytes, or from 256 bytes to a greater size. In-place `ALTER TABLE` does not support increasing the size of a `VARCHAR` column from less than 256 bytes to a size equal to or greater than 256 bytes. In this case, the number of required length bytes changes from 1 to 2, which is only supported by a table copy (`ALGORITHM=COPY`). For example, attempting to change `VARCHAR` column size for a single byte character set from VARCHAR(255) to VARCHAR(256) using in-place `ALTER TABLE` returns this error:

  ```sql
  ALTER TABLE tbl_name ALGORITHM=INPLACE, CHANGE COLUMN c1 c1 VARCHAR(256);
  ERROR 0A000: ALGORITHM=INPLACE is not supported. Reason: Cannot change
  column type INPLACE. Try ALGORITHM=COPY.
  ```

  Note

  The byte length of a `VARCHAR` column is dependant on the byte length of the character set.

  Decreasing `VARCHAR` size using in-place `ALTER TABLE` is not supported. Decreasing `VARCHAR` size requires a table copy (`ALGORITHM=COPY`).

* Setting a column default value

  ```sql
  ALTER TABLE tbl_name ALTER COLUMN col SET DEFAULT literal, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Only modifies table metadata. Default column values are stored in the .frm file for the table, not the `InnoDB` data dictionary.

* Dropping a column default value

  ```sql
  ALTER TABLE tbl ALTER COLUMN col DROP DEFAULT, ALGORITHM=INPLACE, LOCK=NONE;
  ```

* Changing the auto-increment value

  ```sql
  ALTER TABLE table AUTO_INCREMENT=next_value, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Modifies a value stored in memory, not the data file.

  In a distributed system using replication or sharding, you sometimes reset the auto-increment counter for a table to a specific value. The next row inserted into the table uses the specified value for its auto-increment column. You might also use this technique in a data warehousing environment where you periodically empty all the tables and reload them, and restart the auto-increment sequence from 1.

* Making a column `NULL`

  ```sql
  ALTER TABLE tbl_name MODIFY COLUMN column_name data_type NULL, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Rebuilds the table in place. Data is reorganized substantially, making it an expensive operation.

* Making a column `NOT NULL`

  ```sql
  ALTER TABLE tbl_name MODIFY COLUMN column_name data_type NOT NULL, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Rebuilds the table in place. `STRICT_ALL_TABLES` or `STRICT_TRANS_TABLES` `SQL_MODE` is required for the operation to succeed. The operation fails if the column contains NULL values. The server prohibits changes to foreign key columns that have the potential to cause loss of referential integrity. See Section 13.1.8, “ALTER TABLE Statement”. Data is reorganized substantially, making it an expensive operation.

* Modifying the definition of an `ENUM` or `SET` column

  ```sql
  CREATE TABLE t1 (c1 ENUM('a', 'b', 'c'));
  ALTER TABLE t1 MODIFY COLUMN c1 ENUM('a', 'b', 'c', 'd'), ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Modifying the definition of an `ENUM` or `SET` column by adding new enumeration or set members to the *end* of the list of valid member values may be performed in place, as long as the storage size of the data type does not change. For example, adding a member to a `SET` column that has 8 members changes the required storage per value from 1 byte to 2 bytes; this requires a table copy. Adding members in the middle of the list causes renumbering of existing members, which requires a table copy.

#### Generated Column Operations

The following table provides an overview of online DDL support for generated column operations. For details, see Syntax and Usage Notes.

**Table 14.13 Online DDL Support for Generated Column Operations**

<table summary="Online DDL support for generated column operations indicating whether the operation is performed in place, rebuilds the table, permits concurrent DML, or only modifies metadata."><col align="left" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr> <th>Operation</th> <th>In Place</th> <th>Rebuilds Table</th> <th>Permits Concurrent DML</th> <th>Only Modifies Metadata</th> </tr></thead><tbody><tr> <th>Adding a <code>STORED</code> column</th> <td>No</td> <td>Yes</td> <td>No</td> <td>No</td> </tr><tr> <th>Modifying <code>STORED</code> column order</th> <td>No</td> <td>Yes</td> <td>No</td> <td>No</td> </tr><tr> <th>Dropping a <code>STORED</code> column</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Adding a <code>VIRTUAL</code> column</th> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th>Modifying <code>VIRTUAL</code> column order</th> <td>No</td> <td>Yes</td> <td>No</td> <td>No</td> </tr><tr> <th>Dropping a <code>VIRTUAL</code> column</th> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr></tbody></table>

##### Syntax and Usage Notes

* Adding a `STORED` column

  ```sql
  ALTER TABLE t1 ADD COLUMN (c2 INT GENERATED ALWAYS AS (c1 + 1) STORED), ALGORITHM=COPY;
  ```

  `ADD COLUMN` is not an in-place operation for stored columns (done without using a temporary table) because the expression must be evaluated by the server.

* Modifying `STORED` column order

  ```sql
  ALTER TABLE t1 MODIFY COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) STORED FIRST, ALGORITHM=COPY;
  ```

  Rebuilds the table in place.

* Dropping a `STORED` column

  ```sql
  ALTER TABLE t1 DROP COLUMN c2, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Rebuilds the table in place.

* Adding a `VIRTUAL` column

  ```sql
  ALTER TABLE t1 ADD COLUMN (c2 INT GENERATED ALWAYS AS (c1 + 1) VIRTUAL), ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Adding a virtual column is an in-place operation for non-partitioned tables. However, adding a virtual column cannot be combined with other `ALTER TABLE` actions.

  Adding a `VIRTUAL` is not an in-place operation for partitioned tables.

* Modifying `VIRTUAL` column order

  ```sql
  ALTER TABLE t1 MODIFY COLUMN c2 INT GENERATED ALWAYS AS (c1 + 1) VIRTUAL FIRST, ALGORITHM=COPY;
  ```

* Dropping a `VIRTUAL` column

  ```sql
  ALTER TABLE t1 DROP COLUMN c2, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Dropping a `VIRTUAL` column is an in-place operation for non-partitioned tables. However, dropping a virtual column cannot be combined with other `ALTER TABLE` actions.

  Dropping a `VIRTUAL` is not an in-place operation for partitioned tables.

#### Foreign Key Operations

The following table provides an overview of online DDL support for foreign key operations. An asterisk indicates additional information, an exception, or a dependency. For details, see Syntax and Usage Notes.

**Table 14.14 Online DDL Support for Foreign Key Operations**

<table summary="Online DDL support for foreign key operations indicating whether the operation is performed in place, rebuilds the table, permits concurrent DML, or only modifies metadata."><col align="left" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr> <th>Operation</th> <th>In Place</th> <th>Rebuilds Table</th> <th>Permits Concurrent DML</th> <th>Only Modifies Metadata</th> </tr></thead><tbody><tr> <th>Adding a foreign key constraint</th> <td>Yes*</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th>Dropping a foreign key constraint</th> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr></tbody></table>

##### Syntax and Usage Notes

* Adding a foreign key constraint

  The `INPLACE` algorithm is supported when `foreign_key_checks` is disabled. Otherwise, only the `COPY` algorithm is supported.

  ```sql
  ALTER TABLE tbl1 ADD CONSTRAINT fk_name FOREIGN KEY index (col1)
    REFERENCES tbl2(col2) referential_actions;
  ```

* Dropping a foreign key constraint

  ```sql
  ALTER TABLE tbl DROP FOREIGN KEY fk_name;
  ```

  Dropping a foreign key can be performed online with the `foreign_key_checks` option enabled or disabled.

  If you do not know the names of the foreign key constraints on a particular table, issue the following statement and find the constraint name in the `CONSTRAINT` clause for each foreign key:

  ```sql
  SHOW CREATE TABLE table\G
  ```

  Or, query the Information Schema `TABLE_CONSTRAINTS` table and use the `CONSTRAINT_NAME` and `CONSTRAINT_TYPE` columns to identify the foreign key names.

  You can also drop a foreign key and its associated index in a single statement:

  ```sql
  ALTER TABLE table DROP FOREIGN KEY constraint, DROP INDEX index;
  ```

Note

If foreign keys are already present in the table being altered (that is, it is a child table containing a `FOREIGN KEY ... REFERENCE` clause), additional restrictions apply to online DDL operations, even those not directly involving the foreign key columns:

* An `ALTER TABLE` on the child table could wait for another transaction to commit, if a change to the parent table causes associated changes in the child table through an `ON UPDATE` or `ON DELETE` clause using the `CASCADE` or `SET NULL` parameters.

* In the same way, if a table is the parent table in a foreign key relationship, even though it does not contain any `FOREIGN KEY` clauses, it could wait for the `ALTER TABLE` to complete if an `INSERT`, `UPDATE`, or `DELETE` statement causes an `ON UPDATE` or `ON DELETE` action in the child table.

#### Table Operations

The following table provides an overview of online DDL support for table operations. An asterisk indicates additional information, an exception, or a dependency. For details, see Syntax and Usage Notes.

**Table 14.15 Online DDL Support for Table Operations**

<table summary="Online DDL support for table operations indicating whether the operation is performed in place, rebuilds the table, permits concurrent DML, or only modifies metadata."><col align="left" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr> <th>Operation</th> <th>In Place</th> <th>Rebuilds Table</th> <th>Permits Concurrent DML</th> <th>Only Modifies Metadata</th> </tr></thead><tbody><tr> <th>Changing the <code>ROW_FORMAT</code></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Changing the <code>KEY_BLOCK_SIZE</code></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Setting persistent table statistics</th> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr><tr> <th>Specifying a character set</th> <td>Yes</td> <td>Yes*</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Converting a character set</th> <td>No</td> <td>Yes*</td> <td>No</td> <td>No</td> </tr><tr> <th>Optimizing a table</th> <td>Yes*</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Rebuilding with the <code>FORCE</code> option</th> <td>Yes*</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Performing a null rebuild</th> <td>Yes*</td> <td>Yes</td> <td>Yes</td> <td>No</td> </tr><tr> <th>Renaming a table</th> <td>Yes</td> <td>No</td> <td>Yes</td> <td>Yes</td> </tr></tbody></table>

##### Syntax and Usage Notes

* Changing the `ROW_FORMAT`

  ```sql
  ALTER TABLE tbl_name ROW_FORMAT = row_format, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Data is reorganized substantially, making it an expensive operation.

  For additional information about the `ROW_FORMAT` option, see Table Options.

* Changing the `KEY_BLOCK_SIZE`

  ```sql
  ALTER TABLE tbl_name KEY_BLOCK_SIZE = value, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Data is reorganized substantially, making it an expensive operation.

  For additional information about the `KEY_BLOCK_SIZE` option, see Table Options.

* Setting persistent table statistics options

  ```sql
  ALTER TABLE tbl_name STATS_PERSISTENT=0, STATS_SAMPLE_PAGES=20, STATS_AUTO_RECALC=1, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Only modifies table metadata.

  Persistent statistics include `STATS_PERSISTENT`, `STATS_AUTO_RECALC`, and `STATS_SAMPLE_PAGES`. For more information, see Section 14.8.11.1, “Configuring Persistent Optimizer Statistics Parameters”.

* Specifying a character set

  ```sql
  ALTER TABLE tbl_name CHARACTER SET = charset_name, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Rebuilds the table if the new character encoding is different.

* Converting a character set

  ```sql
  ALTER TABLE tbl_name CONVERT TO CHARACTER SET charset_name, ALGORITHM=COPY;
  ```

  Rebuilds the table if the new character encoding is different.

* Optimizing a table

  ```sql
  OPTIMIZE TABLE tbl_name;
  ```

  In-place operation is not supported for tables with `FULLTEXT` indexes. The operation uses the `INPLACE` algorithm, but `ALGORITHM` and `LOCK` syntax is not permitted.

* Rebuilding a table with the `FORCE` option

  ```sql
  ALTER TABLE tbl_name FORCE, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Uses `ALGORITHM=INPLACE` as of MySQL 5.6.17. `ALGORITHM=INPLACE` is not supported for tables with `FULLTEXT` indexes.

* Performing a "null" rebuild

  ```sql
  ALTER TABLE tbl_name ENGINE=InnoDB, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  Uses `ALGORITHM=INPLACE` as of MySQL 5.6.17. `ALGORITHM=INPLACE` is not supported for tables with `FULLTEXT` indexes.

* Renaming a table

  ```sql
  ALTER TABLE old_tbl_name RENAME TO new_tbl_name, ALGORITHM=INPLACE, LOCK=NONE;
  ```

  MySQL renames files that correspond to the table *`tbl_name`* without making a copy. (You can also use the `RENAME TABLE` statement to rename tables. See Section 13.1.33, “RENAME TABLE Statement”.) Privileges granted specifically for the renamed table are not migrated to the new name. They must be changed manually.

#### Tablespace Operations

The following table provides an overview of online DDL support for tablespace operations. For details, see Syntax and Usage Notes.

**Table 14.16 Online DDL Support for Tablespace Operations**

<table summary="Online DDL support for tablespace operations indicating whether the operation is performed in place, rebuilds tables within the tablespace, permits concurrent DML, or only modifies metadata."><col align="left" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><col align="center" style="width: 20%"/><thead><tr> <th>Operation</th> <th>In Place</th> <th>Rebuilds Table</th> <th>Permits Concurrent DML</th> <th>Only Modifies Metadata</th> </tr></thead><tbody><tr> <th>Enabling or disabling file-per-table tablespace encryption</th> <td>No</td> <td>Yes</td> <td>No</td> <td>No</td> </tr></tbody></table>

##### Syntax and Usage Notes

Enabling or disabling file-per-table tablespace encryption

```sql
ALTER TABLE tbl_name ENCRYPTION='Y', ALGORITHM=COPY;
```

Encryption is only supported for file-per-table tablespaces. For related information, see Section 14.14, “InnoDB Data-at-Rest Encryption”.

#### Partitioning Operations

With the exception of most `ALTER TABLE` partitioning clauses, online DDL operations for partitioned `InnoDB` tables follow the same rules that apply to regular `InnoDB` tables.

Most `ALTER TABLE` partitioning clauses do not go through the same internal online DDL API as regular non-partitioned `InnoDB` tables. As a result, online support for `ALTER TABLE` partitioning clauses varies.

The following table shows the online status for each `ALTER TABLE` partitioning statement. Regardless of the online DDL API that is used, MySQL attempts to minimize data copying and locking where possible.

`ALTER TABLE` partitioning options that use `ALGORITHM=COPY` or that only permit “`ALGORITHM=DEFAULT, LOCK=DEFAULT`”, repartition the table using the `COPY` algorithm. In other words, a new partitioned table is created with the new partitioning scheme. The newly created table includes any changes applied by the `ALTER TABLE` statement, and table data is copied into the new table structure.

**Table 14.17 Online DDL Support for Partitioning Operations**

<table summary="Online DDL support for partitioning operatings indicating whether the operation is performed in place and permits concurrent DML."><col align="left" style="width: 24%"/><col align="center" style="width: 8%"/><col align="center" style="width: 12%"/><col align="left" style="width: 32%"/><thead><tr> <th>Partitioning Clause</th> <th>In Place</th> <th>Permits DML</th> <th>Notes</th> </tr></thead><tbody><tr> <th><code>PARTITION BY</code></th> <td>No</td> <td>No</td> <td>Permits <code>ALGORITHM=COPY</code>, <code>LOCK={DEFAULT|SHARED|EXCLUSIVE}</code></td> </tr><tr> <th><code>ADD PARTITION</code></th> <td>No</td> <td>No</td> <td>Only permits <code>ALGORITHM=DEFAULT</code>, <code>LOCK=DEFAULT</code>. Does not copy existing data for tables partitioned by <code>RANGE</code> or <code>LIST</code>. Concurrent queries are permitted for tables partitioned by <code>HASH</code> or <code>LIST</code>. MySQL copies the data while holding a shared lock.</td> </tr><tr> <th><code>DROP PARTITION</code></th> <td>No</td> <td>No</td> <td>Only permits <code>ALGORITHM=DEFAULT</code>, <code>LOCK=DEFAULT</code>. Does not copy existing data for tables partitioned by <code>RANGE</code> or <code>LIST</code>.</td> </tr><tr> <th><code>DISCARD PARTITION</code></th> <td>No</td> <td>No</td> <td>Only permits <code>ALGORITHM=DEFAULT</code>, <code>LOCK=DEFAULT</code></td> </tr><tr> <th><code>IMPORT PARTITION</code></th> <td>No</td> <td>No</td> <td>Only permits <code>ALGORITHM=DEFAULT</code>, <code>LOCK=DEFAULT</code></td> </tr><tr> <th><a class="link" href="alter-table.html" title="13.1.8 ALTER TABLE Statement"><code>TRUNCATE PARTITION</code></a></th> <td>Yes</td> <td>Yes</td> <td>Does not copy existing data. It merely deletes rows; it does not alter the definition of the table itself, or of any of its partitions.</td> </tr><tr> <th><a class="link" href="alter-table.html" title="13.1.8 ALTER TABLE Statement"><code>COALESCE PARTITION</code></a></th> <td>No</td> <td>No</td> <td>Only permits <code>ALGORITHM=DEFAULT</code>, <code>LOCK=DEFAULT</code>. Concurrent queries are permitted for tables partitioned by <code>HASH</code> or <code>LIST</code>, as MySQL copies the data while holding a shared lock.</td> </tr><tr> <th><a class="link" href="alter-table.html" title="13.1.8 ALTER TABLE Statement"><code>REORGANIZE PARTITION</code></a></th> <td>No</td> <td>No</td> <td>Only permits <code>ALGORITHM=DEFAULT</code>, <code>LOCK=DEFAULT</code>. Concurrent queries are permitted for tables partitioned by <code>LINEAR HASH</code> or <code>LIST</code>. MySQL copies data from affected partitions while holding a shared metadata lock.</td> </tr><tr> <th><a class="link" href="alter-table.html" title="13.1.8 ALTER TABLE Statement"><code>EXCHANGE PARTITION</code></a></th> <td>Yes</td> <td>Yes</td> <td></td> </tr><tr> <th><code>ANALYZE PARTITION</code></th> <td>Yes</td> <td>Yes</td> <td></td> </tr><tr> <th><code>CHECK PARTITION</code></th> <td>Yes</td> <td>Yes</td> <td></td> </tr><tr> <th><a class="link" href="alter-table.html" title="13.1.8 ALTER TABLE Statement"><code>OPTIMIZE PARTITION</code></a></th> <td>No</td> <td>No</td> <td><code>ALGORITHM</code> and <code>LOCK</code> clauses are ignored. Rebuilds the entire table. See Section 22.3.4, “Maintenance of Partitions”.</td> </tr><tr> <th><code>REBUILD PARTITION</code></th> <td>No</td> <td>No</td> <td>Only permits <code>ALGORITHM=DEFAULT</code>, <code>LOCK=DEFAULT</code>. Concurrent queries are permitted for tables partitioned by <code>LINEAR HASH</code> or <code>LIST</code>. MySQL copies data from affected partitions while holding a shared metadata lock.</td> </tr><tr> <th><code>REPAIR PARTITION</code></th> <td>Yes</td> <td>Yes</td> <td></td> </tr><tr> <th><a class="link" href="alter-table.html" title="13.1.8 ALTER TABLE Statement"><code>REMOVE PARTITIONING</code></a></th> <td>No</td> <td>No</td> <td>Permits <code>ALGORITHM=COPY</code>, <code>LOCK={DEFAULT|SHARED|EXCLUSIVE}</code></td> </tr></tbody></table>

Non-partitioning online `ALTER TABLE` operations on partitioned tables follow the same rules that apply to regular tables. However, `ALTER TABLE` performs online operations on each table partition, which causes increased demand on system resources due to operations being performed on multiple partitions.

For additional information about `ALTER TABLE` partitioning clauses, see Partitioning Options, and Section 13.1.8.1, “ALTER TABLE Partition Operations”. For information about partitioning in general, see Chapter 22, *Partitioning*.


### 14.13.2 Online DDL Performance and Concurrency

Online DDL improves several aspects of MySQL operation:

* Applications that access the table are more responsive because queries and DML operations on the table can proceed while the DDL operation is in progress. Reduced locking and waiting for MySQL server resources leads to greater scalability, even for operations that are not involved in the DDL operation.

* In-place operations avoid the disk I/O and CPU cycles associated with the table-copy method, which minimizes overall load on the database. Minimizing load helps maintain good performance and high throughput during the DDL operation.

* In-place operations read less data into the buffer pool than the table-copy operations, which reduces purging of frequently accessed data from memory. Purging of frequently accessed data can cause a temporary performance dip after a DDL operation.

#### The LOCK clause

By default, MySQL uses as little locking as possible during a DDL operation. The `LOCK` clause can be specified to enforce more restrictive locking, if required. If the `LOCK` clause specifies a less restrictive level of locking than is permitted for a particular DDL operation, the statement fails with an error. `LOCK` clauses are described below, in order of least to most restrictive:

* `LOCK=NONE`:

  Permits concurrent queries and DML.

  For example, use this clause for tables involving customer signups or purchases, to avoid making the tables unavailable during lengthy DDL operations.

* `LOCK=SHARED`:

  Permits concurrent queries but blocks DML.

  For example, use this clause on data warehouse tables, where you can delay data load operations until the DDL operation is finished, but queries cannot be delayed for long periods.

* `LOCK=DEFAULT`:

  Permits as much concurrency as possible (concurrent queries, DML, or both). Omitting the `LOCK` clause is the same as specifying `LOCK=DEFAULT`.

  Use this clause when you know that the default locking level of the DDL statement does not cause availability problems for the table.

* `LOCK=EXCLUSIVE`:

  Blocks concurrent queries and DML.

  Use this clause if the primary concern is finishing the DDL operation in the shortest amount of time possible, and concurrent query and DML access is not necessary. You might also use this clause if the server is supposed to be idle, to avoid unexpected table accesses.

#### Online DDL and Metadata Locks

Online DDL operations can be viewed as having three phases:

* *Phase 1: Initialization*

  In the initialization phase, the server determines how much concurrency is permitted during the operation, taking into account storage engine capabilities, operations specified in the statement, and user-specified `ALGORITHM` and `LOCK` options. During this phase, a shared upgradeable metadata lock is taken to protect the current table definition.

* *Phase 2: Execution*

  In this phase, the statement is prepared and executed. Whether the metadata lock is upgraded to exclusive depends on the factors assessed in the initialization phase. If an exclusive metadata lock is required, it is only taken briefly during statement preparation.

* *Phase 3: Commit Table Definition*

  In the commit table definition phase, the metadata lock is upgraded to exclusive to evict the old table definition and commit the new one. Once granted, the duration of the exclusive metadata lock is brief.

Due to the exclusive metadata lock requirements outlined above, an online DDL operation may have to wait for concurrent transactions that hold metadata locks on the table to commit or rollback. Transactions started before or during the DDL operation can hold metadata locks on the table being altered. In the case of a long running or inactive transaction, an online DDL operation can time out waiting for an exclusive metadata lock. Additionally, a pending exclusive metadata lock requested by an online DDL operation blocks subsequent transactions on the table.

The following example demonstrates an online DDL operation waiting for an exclusive metadata lock, and how a pending metadata lock blocks subsequent transactions on the table.

Session 1:

```sql
mysql> CREATE TABLE t1 (c1 INT) ENGINE=InnoDB;
mysql> START TRANSACTION;
mysql> SELECT * FROM t1;
```

The session 1 `SELECT` statement takes a shared metadata lock on table t1.

Session 2:

```sql
mysql> ALTER TABLE t1 ADD COLUMN x INT, ALGORITHM=INPLACE, LOCK=NONE;
```

The online DDL operation in session 2, which requires an exclusive metadata lock on table t1 to commit table definition changes, must wait for the session 1 transaction to commit or roll back.

Session 3:

```sql
mysql> SELECT * FROM t1;
```

The `SELECT` statement issued in session 3 is blocked waiting for the exclusive metadata lock requested by the `ALTER TABLE` operation in session 2 to be granted.

You can use `SHOW FULL PROCESSLIST` to determine if transactions are waiting for a metadata lock.

```sql
mysql> SHOW FULL PROCESSLIST\G
...
*************************** 2. row ***************************
     Id: 5
   User: root
   Host: localhost
     db: test
Command: Query
   Time: 44
  State: Waiting for table metadata lock
   Info: ALTER TABLE t1 ADD COLUMN x INT, ALGORITHM=INPLACE, LOCK=NONE
...
*************************** 4. row ***************************
     Id: 7
   User: root
   Host: localhost
     db: test
Command: Query
   Time: 5
  State: Waiting for table metadata lock
   Info: SELECT * FROM t1
4 rows in set (0.00 sec)
```

Metadata lock information is also exposed through the Performance Schema `metadata_locks` table, which provides information about metadata lock dependencies between sessions, the metadata lock a session is waiting for, and the session that currently holds the metadata lock. For more information, see Section 25.12.12.1, “The metadata\_locks Table”.

#### Online DDL Performance

The performance of a DDL operation is largely determined by whether the operation is performed in place and whether it rebuilds the table.

To assess the relative performance of a DDL operation, you can compare results using `ALGORITHM=INPLACE` with results using `ALGORITHM=COPY`. Alternatively, you can compare results with `old_alter_table` disabled and enabled.

For DDL operations that modify table data, you can determine whether a DDL operation performs changes in place or performs a table copy by looking at the “rows affected” value displayed after the command finishes. For example:

* Changing the default value of a column (fast, does not affect the table data):

  ```sql
  Query OK, 0 rows affected (0.07 sec)
  ```

* Adding an index (takes time, but `0 rows affected` shows that the table is not copied):

  ```sql
  Query OK, 0 rows affected (21.42 sec)
  ```

* Changing the data type of a column (takes substantial time and requires rebuilding all the rows of the table):

  ```sql
  Query OK, 1671168 rows affected (1 min 35.54 sec)
  ```

Before running a DDL operation on a large table, check whether the operation is fast or slow as follows:

1. Clone the table structure.
2. Populate the cloned table with a small amount of data.
3. Run the DDL operation on the cloned table.
4. Check whether the “rows affected” value is zero or not. A nonzero value means the operation copies table data, which might require special planning. For example, you might do the DDL operation during a period of scheduled downtime, or on each replica server one at a time.

Note

For a greater understanding of the MySQL processing associated with a DDL operation, examine Performance Schema and `INFORMATION_SCHEMA` tables related to `InnoDB` before and after DDL operations to see the number of physical reads, writes, memory allocations, and so on.

Performance Schema stage events can be used to monitor `ALTER TABLE` progress. See Section 14.17.1, “Monitoring ALTER TABLE Progress for InnoDB Tables Using Performance Schema”.

Because there is some processing work involved with recording the changes made by concurrent DML operations, then applying those changes at the end, an online DDL operation could take longer overall than the table-copy mechanism that blocks table access from other sessions. The reduction in raw performance is balanced against better responsiveness for applications that use the table. When evaluating the techniques for changing table structure, consider end-user perception of performance, based on factors such as load times for web pages.


### 14.13.3 Online DDL Space Requirements

Online DDL operations have the following space requirements:

* Temporary log files:

  A temporary log file records concurrent DML when an online DDL operation creates an index or alters a table. The temporary log file is extended as required by the value of `innodb_sort_buffer_size` up to a maximum specified by `innodb_online_alter_log_max_size`. If the operation takes a long time and concurrent DML modifies the table so much that the size of the temporary log file exceeds the value of `innodb_online_alter_log_max_size`, the online DDL operation fails with a `DB_ONLINE_LOG_TOO_BIG` error and uncommitted concurrent DML operations are rolled back. A large `innodb_online_alter_log_max_size` setting permits more DML during an online DDL operation, but it also extends the period of time at the end of the DDL operation when the table is locked to apply logged DML.

  The `innodb_sort_buffer_size` variable also defines the size of the temporary log file read buffer and write buffer.

* Temporary sort files:

  Online DDL operations that rebuild the table write temporary sort files to the MySQL temporary directory (`$TMPDIR` on Unix, `%TEMP%` on Windows, or the directory specified by `--tmpdir`) during index creation. Temporary sort files are not created in the directory that contains the original table. Each temporary sort file is large enough to hold one column of data, and each sort file is removed when its data is merged into the final table or index. Operations involving temporary sort files may require temporary space equal to the amount of data in the table plus indexes. An error is reported if online DDL operation uses all of the available disk space on the file system where the data directory resides.

  If the MySQL temporary directory is not large enough to hold the sort files, set `tmpdir` to a different directory. Alternatively, define a separate temporary directory for online DDL operations using `innodb_tmpdir`. This option was introduced in MySQL 5.7.11 to help avoid temporary directory overflows that could occur as a result of large temporary sort files.

* Intermediate table files:

  Some online DDL operations that rebuild the table create a temporary intermediate table file in the same directory as the original table. An intermediate table file may require space equal to the size of the original table. Intermediate table file names begin with `#sql-ib` prefix and only appear briefly during the online DDL operation.

  The `innodb_tmpdir` option is not applicable to intermediate table files.


### 14.13.4 Simplifying DDL Statements with Online DDL

Before the introduction of online DDL, it was common practice to combine many DDL operations into a single `ALTER TABLE` statement. Because each `ALTER TABLE` statement involved copying and rebuilding the table, it was more efficient to make several changes to the same table at once, since those changes could all be done with a single rebuild operation for the table. The downside was that SQL code involving DDL operations was harder to maintain and to reuse in different scripts. If the specific changes were different each time, you might have to construct a new complex `ALTER TABLE` for each slightly different scenario.

For DDL operations that can be done in place, you can separate them into individual `ALTER TABLE` statements for easier scripting and maintenance, without sacrificing efficiency. For example, you might take a complicated statement such as:

```sql
ALTER TABLE t1 ADD INDEX i1(c1), ADD UNIQUE INDEX i2(c2),
  CHANGE c4_old_name c4_new_name INTEGER UNSIGNED;
```

and break it down into simpler parts that can be tested and performed independently, such as:

```sql
ALTER TABLE t1 ADD INDEX i1(c1);
ALTER TABLE t1 ADD UNIQUE INDEX i2(c2);
ALTER TABLE t1 CHANGE c4_old_name c4_new_name INTEGER UNSIGNED NOT NULL;
```

You might still use multi-part `ALTER TABLE` statements for:

* Operations that must be performed in a specific sequence, such as creating an index followed by a foreign key constraint that uses that index.

* Operations all using the same specific `LOCK` clause, that you want to either succeed or fail as a group.

* Operations that cannot be performed in place, that is, that still use the table-copy method.

* Operations for which you specify `ALGORITHM=COPY` or `old_alter_table=1`, to force the table-copying behavior if needed for precise backward-compatibility in specialized scenarios.


### 14.13.5 Online DDL Failure Conditions

The failure of an online DDL operation is typically due to one of the following conditions:

* An `ALGORITHM` clause specifies an algorithm that is not compatible with the particular type of DDL operation or storage engine.

* A `LOCK` clause specifies a low degree of locking (`SHARED` or `NONE`) that is not compatible with the particular type of DDL operation.

* A timeout occurs while waiting for an exclusive lock on the table, which may be needed briefly during the initial and final phases of the DDL operation.

* The `tmpdir` or `innodb_tmpdir` file system runs out of disk space, while MySQL writes temporary sort files on disk during index creation. For more information, see Section 14.13.3, “Online DDL Space Requirements”.

* The operation takes a long time and concurrent DML modifies the table so much that the size of the temporary online log exceeds the value of the `innodb_online_alter_log_max_size` configuration option. This condition causes a `DB_ONLINE_LOG_TOO_BIG` error.

* Concurrent DML makes changes to the table that are allowed with the original table definition, but not with the new one. The operation only fails at the very end, when MySQL tries to apply all the changes from concurrent DML statements. For example, you might insert duplicate values into a column while a unique index is being created, or you might insert `NULL` values into a column while creating a primary key index on that column. The changes made by the concurrent DML take precedence, and the `ALTER TABLE` operation is effectively rolled back.


### 14.13.6 Online DDL Limitations

The following limitations apply to online DDL operations:

* The table is copied when creating an index on a `TEMPORARY TABLE`.

* The `ALTER TABLE` clause `LOCK=NONE` is not permitted if there are `ON...CASCADE` or `ON...SET NULL` constraints on the table.

* Before an online DDL operation can finish, it must wait for transactions that hold metadata locks on the table to commit or roll back. An online DDL operation may briefly require an exclusive metadata lock on the table during its execution phase, and always requires one in the final phase of the operation when updating the table definition. Consequently, transactions holding metadata locks on the table can cause an online DDL operation to block. The transactions that hold metadata locks on the table may have been started before or during the online DDL operation. A long running or inactive transaction that holds a metadata lock on the table can cause an online DDL operation to timeout.

* An online DDL operation on a table in a foreign key relationship does not wait for a transaction executing on the other table in the foreign key relationship to commit or rollback. The transaction holds an exclusive metadata lock on the table it is updating and shared metadata lock on the foreign-key-related table (required for foreign key checking). The shared metadata lock permits the online DDL operation to proceed but blocks the operation in its final phase, when an exclusive metadata lock is required to update the table definition. This scenario can result in deadlocks as other transactions wait for the online DDL operation to finish.

* When running an online DDL operation, the thread that runs the `ALTER TABLE` statement applies an online log of DML operations that were run concurrently on the same table from other connection threads. When the DML operations are applied, it is possible to encounter a duplicate key entry error (ERROR 1062 (23000): Duplicate entry), even if the duplicate entry is only temporary and would be reverted by a later entry in the online log. This is similar to the idea of a foreign key constraint check in `InnoDB` in which constraints must hold during a transaction.

* `OPTIMIZE TABLE` for an `InnoDB` table is mapped to an `ALTER TABLE` operation to rebuild the table and update index statistics and free unused space in the clustered index. Secondary indexes are not created as efficiently because keys are inserted in the order they appeared in the primary key. `OPTIMIZE TABLE` is supported with the addition of online DDL support for rebuilding regular and partitioned `InnoDB` tables.

* Tables created before MySQL 5.6 that include temporal columns (`DATE`, `DATETIME` or `TIMESTAMP`) and have not been rebuilt using  `ALGORITHM=COPY` do not support `ALGORITHM=INPLACE`. In this case, an `ALTER TABLE ... ALGORITHM=INPLACE` operation returns the following error:

  ```sql
  ERROR 1846 (0A000): ALGORITHM=INPLACE is not supported.
  Reason: Cannot change column type INPLACE. Try ALGORITHM=COPY.
  ```

* The following limitations are generally applicable to online DDL operations on large tables that involve rebuilding the table:

  + There is no mechanism to pause an online DDL operation or to throttle I/O or CPU usage for an online DDL operation.

  + Rollback of an online DDL operation can be expensive should the operation fail.

  + Long running online DDL operations can cause replication lag. An online DDL operation must finish running on the source before it is run on the replica. Also, DML that was processed concurrently on the source is only processed on the replica after the DDL operation on the replica is completed.

  For additional information related to running online DDL operations on large tables, see Section 14.13.2, “Online DDL Performance and Concurrency”.
