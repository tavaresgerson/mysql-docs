### 13.1.8 ALTER TABLE Statement

[13.1.8.1 ALTER TABLE Partition Operations](alter-table-partition-operations.html)

[13.1.8.2 ALTER TABLE and Generated Columns](alter-table-generated-columns.html)

[13.1.8.3 ALTER TABLE Examples](alter-table-examples.html)

```sql
ALTER TABLE tbl_name
    [alter_option [, alter_option] ...]
    [partition_options]

alter_option: {
    table_options
  | ADD [COLUMN] col_name column_definition
        [FIRST | AFTER col_name]
  | ADD [COLUMN] (col_name column_definition,...)
  | ADD {INDEX | KEY} [index_name]
        [index_type] (key_part,...) [index_option] ...
  | ADD {FULLTEXT | SPATIAL} [INDEX | KEY] [index_name]
        (key_part,...) [index_option] ...
  | ADD [CONSTRAINT [symbol]] PRIMARY KEY
        [index_type] (key_part,...)
        [index_option] ...
  | ADD [CONSTRAINT [symbol]] UNIQUE [INDEX | KEY]
        [index_name] [index_type] (key_part,...)
        [index_option] ...
  | ADD [CONSTRAINT [symbol]] FOREIGN KEY
        [index_name] (col_name,...)
        reference_definition
  | ADD CHECK (expr)
  | ALGORITHM [=] {DEFAULT | INPLACE | COPY}
  | ALTER [COLUMN] col_name {
        SET DEFAULT {literal | (expr)}
      | DROP DEFAULT
    }
  | CHANGE [COLUMN] old_col_name new_col_name column_definition
        [FIRST | AFTER col_name]
  | [DEFAULT] CHARACTER SET [=] charset_name [COLLATE [=] collation_name]
  | CONVERT TO CHARACTER SET charset_name [COLLATE collation_name]
  | {DISABLE | ENABLE} KEYS
  | {DISCARD | IMPORT} TABLESPACE
  | DROP [COLUMN] col_name
  | DROP {INDEX | KEY} index_name
  | DROP PRIMARY KEY
  | DROP FOREIGN KEY fk_symbol
  | FORCE
  | LOCK [=] {DEFAULT | NONE | SHARED | EXCLUSIVE}
  | MODIFY [COLUMN] col_name column_definition
        [FIRST | AFTER col_name]
  | ORDER BY col_name [, col_name] ...
  | RENAME {INDEX | KEY} old_index_name TO new_index_name
  | RENAME [TO | AS] new_tbl_name
  | {WITHOUT | WITH} VALIDATION
}

partition_options:
    partition_option [partition_option] ...

partition_option: {
    ADD PARTITION (partition_definition)
  | DROP PARTITION partition_names
  | DISCARD PARTITION {partition_names | ALL} TABLESPACE
  | IMPORT PARTITION {partition_names | ALL} TABLESPACE
  | TRUNCATE PARTITION {partition_names | ALL}
  | COALESCE PARTITION number
  | REORGANIZE PARTITION partition_names INTO (partition_definitions)
  | EXCHANGE PARTITION partition_name WITH TABLE tbl_name [{WITH | WITHOUT} VALIDATION]
  | ANALYZE PARTITION {partition_names | ALL}
  | CHECK PARTITION {partition_names | ALL}
  | OPTIMIZE PARTITION {partition_names | ALL}
  | REBUILD PARTITION {partition_names | ALL}
  | REPAIR PARTITION {partition_names | ALL}
  | REMOVE PARTITIONING
  | UPGRADE PARTITIONING
}

key_part:
    col_name [(length)] [ASC | DESC]

index_type:
    USING {BTREE | HASH}

index_option: {
    KEY_BLOCK_SIZE [=] value
  | index_type
  | WITH PARSER parser_name
  | COMMENT 'string'
}

table_options:
    table_option [[,] table_option] ...

table_option: {
    AUTO_INCREMENT [=] value
  | AVG_ROW_LENGTH [=] value
  | [DEFAULT] CHARACTER SET [=] charset_name
  | CHECKSUM [=] {0 | 1}
  | [DEFAULT] COLLATE [=] collation_name
  | COMMENT [=] 'string'
  | COMPRESSION [=] {'ZLIB' | 'LZ4' | 'NONE'}
  | CONNECTION [=] 'connect_string'
  | {DATA | INDEX} DIRECTORY [=] 'absolute path to directory'
  | DELAY_KEY_WRITE [=] {0 | 1}
  | ENCRYPTION [=] {'Y' | 'N'}
  | ENGINE [=] engine_name
  | INSERT_METHOD [=] { NO | FIRST | LAST }
  | KEY_BLOCK_SIZE [=] value
  | MAX_ROWS [=] value
  | MIN_ROWS [=] value
  | PACK_KEYS [=] {0 | 1 | DEFAULT}
  | PASSWORD [=] 'string'
  | ROW_FORMAT [=] {DEFAULT | DYNAMIC | FIXED | COMPRESSED | REDUNDANT | COMPACT}
  | STATS_AUTO_RECALC [=] {DEFAULT | 0 | 1}
  | STATS_PERSISTENT [=] {DEFAULT | 0 | 1}
  | STATS_SAMPLE_PAGES [=] value
  | TABLESPACE tablespace_name [STORAGE {DISK | MEMORY}]
  | UNION [=] (tbl_name[,tbl_name]...)
}

partition_options:
    (see CREATE TABLE options)
```

[`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") changes the structure of a table. For example, you can add or delete columns, create or destroy indexes, change the type of existing columns, or rename columns or the table itself. You can also change characteristics such as the storage engine used for the table or the table comment.

* To use [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"), you need [`ALTER`](privileges-provided.html#priv_alter), [`CREATE`](privileges-provided.html#priv_create), and [`INSERT`](privileges-provided.html#priv_insert) privileges for the table. Renaming a table requires [`ALTER`](privileges-provided.html#priv_alter) and [`DROP`](privileges-provided.html#priv_drop) on the old table, [`ALTER`](privileges-provided.html#priv_alter), [`CREATE`](privileges-provided.html#priv_create), and [`INSERT`](privileges-provided.html#priv_insert) on the new table.

* Following the table name, specify the alterations to be made. If none are given, [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") does nothing.

* The syntax for many of the permissible alterations is similar to clauses of the [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement. *`column_definition`* clauses use the same syntax for `ADD` and `CHANGE` as for [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"). For more information, see [Section 13.1.18, “CREATE TABLE Statement”](create-table.html "13.1.18 CREATE TABLE Statement").

* The word `COLUMN` is optional and can be omitted.

* Multiple `ADD`, `ALTER`, `DROP`, and `CHANGE` clauses are permitted in a single [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement, separated by commas. This is a MySQL extension to standard SQL, which permits only one of each clause per [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement. For example, to drop multiple columns in a single statement, do this:

  ```sql
  ALTER TABLE t2 DROP COLUMN c, DROP COLUMN d;
  ```

* If a storage engine does not support an attempted [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") operation, a warning may result. Such warnings can be displayed with [`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement"). See [Section 13.7.5.40, “SHOW WARNINGS Statement”](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement"). For information on troubleshooting [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"), see [Section B.3.6.1, “Problems with ALTER TABLE”](alter-table-problems.html "B.3.6.1 Problems with ALTER TABLE").

* For information about generated columns, see [Section 13.1.8.2, “ALTER TABLE and Generated Columns”](alter-table-generated-columns.html "13.1.8.2 ALTER TABLE and Generated Columns").

* For usage examples, see [Section 13.1.8.3, “ALTER TABLE Examples”](alter-table-examples.html "13.1.8.3 ALTER TABLE Examples").

* With the [`mysql_info()`](/doc/c-api/5.7/en/mysql-info.html) C API function, you can find out how many rows were copied by [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"). See [mysql_info()](/doc/c-api/5.7/en/mysql-info.html).

There are several additional aspects to the `ALTER TABLE` statement, described under the following topics in this section:

* [Table Options](alter-table.html#alter-table-options "Table Options")
* [Performance and Space Requirements](alter-table.html#alter-table-performance "Performance and Space Requirements")
* [Concurrency Control](alter-table.html#alter-table-concurrency "Concurrency Control")
* [Adding and Dropping Columns](alter-table.html#alter-table-add-drop-column "Adding and Dropping Columns")
* [Renaming, Redefining, and Reordering Columns](alter-table.html#alter-table-redefine-column "Renaming, Redefining, and Reordering Columns")
* [Primary Keys and Indexes](alter-table.html#alter-table-index "Primary Keys and Indexes")
* [Foreign Keys and Other Constraints](alter-table.html#alter-table-foreign-key "Foreign Keys and Other Constraints")
* [Changing the Character Set](alter-table.html#alter-table-character-set "Changing the Character Set")
* [Discarding and Importing InnoDB Tablespaces](alter-table.html#alter-table-discard-import "Discarding and Importing InnoDB Tablespaces")
* [Row Order for MyISAM Tables](alter-table.html#alter-table-row-order "Row Order for MyISAM Tables")
* [Partitioning Options](alter-table.html#alter-table-partition-options "Partitioning Options")

#### Table Options

*`table_options`* signifies table options of the kind that can be used in the [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement, such as `ENGINE`, `AUTO_INCREMENT`, `AVG_ROW_LENGTH`, `MAX_ROWS`, `ROW_FORMAT`, or `TABLESPACE`.

For descriptions of all table options, see [Section 13.1.18, “CREATE TABLE Statement”](create-table.html "13.1.18 CREATE TABLE Statement"). However, [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") ignores `DATA DIRECTORY` and `INDEX DIRECTORY` when given as table options. [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") permits them only as partitioning options, and, as of MySQL 5.7.17, requires that you have the `FILE` privilege.

Use of table options with [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") provides a convenient way of altering single table characteristics. For example:

* If `t1` is currently not an `InnoDB` table, this statement changes its storage engine to `InnoDB`:

  ```sql
  ALTER TABLE t1 ENGINE = InnoDB;
  ```

  + See [Section 14.6.1.5, “Converting Tables from MyISAM to InnoDB”](converting-tables-to-innodb.html "14.6.1.5 Converting Tables from MyISAM to InnoDB") for considerations when switching tables to the `InnoDB` storage engine.

  + When you specify an `ENGINE` clause, [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") rebuilds the table. This is true even if the table already has the specified storage engine.

  + Running [`ALTER TABLE tbl_name ENGINE=INNODB`](alter-table.html "13.1.8 ALTER TABLE Statement") on an existing `InnoDB` table performs a “null” [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") operation, which can be used to defragment an `InnoDB` table, as described in [Section 14.12.4, “Defragmenting a Table”](innodb-file-defragmenting.html "14.12.4 Defragmenting a Table"). Running [`ALTER TABLE tbl_name FORCE`](alter-table.html "13.1.8 ALTER TABLE Statement") on an `InnoDB` table performs the same function.

  + [`ALTER TABLE tbl_name ENGINE=INNODB`](alter-table.html "13.1.8 ALTER TABLE Statement") and [`ALTER TABLE tbl_name FORCE`](alter-table.html "13.1.8 ALTER TABLE Statement") use [online DDL](innodb-online-ddl.html "14.13 InnoDB and Online DDL"). For more information, see [Section 14.13, “InnoDB and Online DDL”](innodb-online-ddl.html "14.13 InnoDB and Online DDL").

  + The outcome of attempting to change the storage engine of a table is affected by whether the desired storage engine is available and the setting of the [`NO_ENGINE_SUBSTITUTION`](sql-mode.html#sqlmode_no_engine_substitution) SQL mode, as described in [Section 5.1.10, “Server SQL Modes”](sql-mode.html "5.1.10 Server SQL Modes").

  + To prevent inadvertent loss of data, [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") cannot be used to change the storage engine of a table to `MERGE` or `BLACKHOLE`.

* To change the `InnoDB` table to use compressed row-storage format:

  ```sql
  ALTER TABLE t1 ROW_FORMAT = COMPRESSED;
  ```

* To enable or disable encryption for an `InnoDB` table in a file-per-table tablespace:

  ```sql
  ALTER TABLE t1 ENCRYPTION='Y';
  ALTER TABLE t1 ENCRYPTION='N';
  ```

  A keyring plugin must be installed and configured to use the `ENCRYPTION` option. For more information, see [Section 14.14, “InnoDB Data-at-Rest Encryption”](innodb-data-encryption.html "14.14 InnoDB Data-at-Rest Encryption").

  The `ENCRYPTION` option is supported only by the `InnoDB` storage engine; thus it works only if the table already uses `InnoDB` (and you do not change the table's storage engine), or if the `ALTER TABLE` statement also specifies `ENGINE=InnoDB`. Otherwise the statement is rejected with [`ER_CHECK_NOT_IMPLEMENTED`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_check_not_implemented).

* To reset the current auto-increment value:

  ```sql
  ALTER TABLE t1 AUTO_INCREMENT = 13;
  ```

  You cannot reset the counter to a value less than or equal to the value that is currently in use. For both `InnoDB` and `MyISAM`, if the value is less than or equal to the maximum value currently in the `AUTO_INCREMENT` column, the value is reset to the current maximum `AUTO_INCREMENT` column value plus one.

* To change the default table character set:

  ```sql
  ALTER TABLE t1 CHARACTER SET = utf8;
  ```

  See also [Changing the Character Set](alter-table.html#alter-table-character-set "Changing the Character Set").

* To add (or change) a table comment:

  ```sql
  ALTER TABLE t1 COMMENT = 'New table comment';
  ```

* Use `ALTER TABLE` with the `TABLESPACE` option to move `InnoDB` tables between existing [general tablespaces](glossary.html#glos_general_tablespace "general tablespace"), [file-per-table](glossary.html#glos_file_per_table "file-per-table") tablespaces, and the [system tablespace](glossary.html#glos_system_tablespace "system tablespace"). See [Moving Tables Between Tablespaces Using ALTER TABLE](general-tablespaces.html#general-tablespaces-moving-non-partitioned-tables "Moving Tables Between Tablespaces Using ALTER TABLE").

  + `ALTER TABLE ... TABLESPACE` operations always cause a full table rebuild, even if the `TABLESPACE` attribute has not changed from its previous value.

  + `ALTER TABLE ... TABLESPACE` syntax does not support moving a table from a temporary tablespace to a persistent tablespace.

  + The `DATA DIRECTORY` clause, which is supported with [`CREATE TABLE ... TABLESPACE`](create-table.html "13.1.18 CREATE TABLE Statement"), is not supported with `ALTER TABLE ... TABLESPACE`, and is ignored if specified.

  + For more information about the capabilities and limitations of the `TABLESPACE` option, see [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement").

* MySQL NDB Cluster 7.5.2 and later supports setting `NDB_TABLE` options for controlling a table's partition balance (fragment count type), read-from-any-replica capability, full replication, or any combination of these, as part of the table comment for an `ALTER TABLE` statement in the same manner as for [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"), as shown in this example:

  ```sql
  ALTER TABLE t1 COMMENT = "NDB_TABLE=READ_BACKUP=0,PARTITION_BALANCE=FOR_RA_BY_NODE";
  ```

  It is also possible to set `NDB_COMMENT` options for columns of [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables as part of an `ALTER TABLE` statement, like this one:

  ```sql
  ALTER TABLE t1
    CHANGE COLUMN c1 c1 BLOB
      COMMENT = 'NDB_COLUMN=MAX_BLOB_PART_SIZE';
  ```

  Bear in mind that `ALTER TABLE ... COMMENT ...` discards any existing comment for the table. See [Setting NDB_TABLE options](create-table.html#create-table-comment-ndb-table-options "Setting NDB_TABLE options"), for additional information and examples.

To verify that the table options were changed as intended, use [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement"), or query the Information Schema [`TABLES`](information-schema-tables-table.html "24.3.25 The INFORMATION_SCHEMA TABLES Table") table.

#### Performance and Space Requirements

[`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") operations are processed using one of the following algorithms:

* `COPY`: Operations are performed on a copy of the original table, and table data is copied from the original table to the new table row by row. Concurrent DML is not permitted.

* `INPLACE`: Operations avoid copying table data but may rebuild the table in place. An exclusive metadata lock on the table may be taken briefly during preparation and execution phases of the operation. Typically, concurrent DML is supported.

For tables using the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine, these algorithms work as follows:

* `COPY`: `NDB` creates a copy of the table and alters it; the NDB Cluster handler then copies the data between the old and new versions of the table. Subsequently, `NDB` deletes the old table and renames the new one.

  This is sometimes also referred to as a “copying” or “offline” `ALTER TABLE`.

* `INPLACE`: The data nodes make the required changes; the NDB Cluster handler does not copy data or otherwise take part.

  This is sometimes also referred to as a “non-copying” or “online” `ALTER TABLE`.

See [Section 21.6.12, “Online Operations with ALTER TABLE in NDB Cluster”](mysql-cluster-online-operations.html "21.6.12 Online Operations with ALTER TABLE in NDB Cluster"), for more information.

The `ALGORITHM` clause is optional. If the `ALGORITHM` clause is omitted, MySQL uses `ALGORITHM=INPLACE` for storage engines and [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") clauses that support it. Otherwise, `ALGORITHM=COPY` is used.

Specifying an `ALGORITHM` clause requires the operation to use the specified algorithm for clauses and storage engines that support it, or fail with an error otherwise. Specifying `ALGORITHM=DEFAULT` is the same as omitting the `ALGORITHM` clause.

[`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") operations that use the `COPY` algorithm wait for other operations that are modifying the table to complete. After alterations are applied to the table copy, data is copied over, the original table is deleted, and the table copy is renamed to the name of the original table. While the [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") operation executes, the original table is readable by other sessions (with the exception noted shortly). Updates and writes to the table started after the [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") operation begins are stalled until the new table is ready, then are automatically redirected to the new table. The temporary copy of the table is created in the database directory of the original table unless it is a `RENAME TO` operation that moves the table to a database that resides in a different directory.

The exception referred to earlier is that [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") blocks reads (not just writes) at the point where it is ready to install a new version of the table `.frm` file, discard the old file, and clear outdated table structures from the table and table definition caches. At this point, it must acquire an exclusive lock. To do so, it waits for current readers to finish, and blocks new reads and writes.

An [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") operation that uses the `COPY` algorithm prevents concurrent DML operations. Concurrent queries are still allowed. That is, a table-copying operation always includes at least the concurrency restrictions of `LOCK=SHARED` (allow queries but not DML). You can further restrict concurrency for operations that support the `LOCK` clause by specifying `LOCK=EXCLUSIVE`, which prevents DML and queries. For more information, see [Concurrency Control](alter-table.html#alter-table-concurrency "Concurrency Control").

To force use of the `COPY` algorithm for an [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") operation that would otherwise not use it, enable the [`old_alter_table`](server-system-variables.html#sysvar_old_alter_table) system variable or specify `ALGORITHM=COPY`. If there is a conflict between the `old_alter_table` setting and an `ALGORITHM` clause with a value other than `DEFAULT`, the `ALGORITHM` clause takes precedence.

For `InnoDB` tables, an [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") operation that uses the `COPY` algorithm on a table that resides in a [shared tablespace](glossary.html#glos_shared_tablespace "shared tablespace") can increase the amount of space used by the tablespace. Such operations require as much additional space as the data in the table plus indexes. For a table residing in a shared tablespace, the additional space used during the operation is not released back to the operating system as it is for a table that resides in a [file-per-table](glossary.html#glos_file_per_table "file-per-table") tablespace.

For information about space requirements for online DDL operations, see [Section 14.13.3, “Online DDL Space Requirements”](innodb-online-ddl-space-requirements.html "14.13.3 Online DDL Space Requirements").

[`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") operations that support the `INPLACE` algorithm include:

* `ALTER TABLE` operations supported by the `InnoDB` [online DDL](glossary.html#glos_online_ddl "online DDL") feature. See [Section 14.13.1, “Online DDL Operations”](innodb-online-ddl-operations.html "14.13.1 Online DDL Operations").

* Renaming a table. MySQL renames files that correspond to the table *`tbl_name`* without making a copy. (You can also use the [`RENAME TABLE`](rename-table.html "13.1.33 RENAME TABLE Statement") statement to rename tables. See [Section 13.1.33, “RENAME TABLE Statement”](rename-table.html "13.1.33 RENAME TABLE Statement").) Privileges granted specifically for the renamed table are not migrated to the new name. They must be changed manually.

* Operations that only modify table metadata. These operations are immediate because the server only alters the table `.frm` file, not touch table contents. Metadata-only operations include:

  + Renaming a column.
  + Changing the default value of a column (except for [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables).

  + Modifying the definition of an [`ENUM`](enum.html "11.3.5 The ENUM Type") or [`SET`](set.html "11.3.6 The SET Type") column by adding new enumeration or set members to the *end* of the list of valid member values, as long as the storage size of the data type does not change. For example, adding a member to a [`SET`](set.html "11.3.6 The SET Type") column that has 8 members changes the required storage per value from 1 byte to 2 bytes; this requires a table copy. Adding members in the middle of the list causes renumbering of existing members, which requires a table copy.

* Renaming an index.
* Adding or dropping a secondary index, for [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") and [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables. See [Section 14.13, “InnoDB and Online DDL”](innodb-online-ddl.html "14.13 InnoDB and Online DDL").

* For [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables, operations that add and drop indexes on variable-width columns. These operations occur online, without table copying and without blocking concurrent DML actions for most of their duration. See [Section 21.6.12, “Online Operations with ALTER TABLE in NDB Cluster”](mysql-cluster-online-operations.html "21.6.12 Online Operations with ALTER TABLE in NDB Cluster").

[`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") upgrades MySQL 5.5 temporal columns to 5.6 format for `ADD COLUMN`, `CHANGE COLUMN`, `MODIFY COLUMN`, `ADD INDEX`, and `FORCE` operations. This conversion cannot be done using the `INPLACE` algorithm because the table must be rebuilt, so specifying `ALGORITHM=INPLACE` in these cases results in an error. Specify `ALGORITHM=COPY` if necessary.

If an `ALTER TABLE` operation on a multicolumn index used to partition a table by `KEY` changes the order of the columns, it can only be performed using `ALGORITHM=COPY`.

The `WITHOUT VALIDATION` and `WITH VALIDATION` clauses affect whether [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") performs an in-place operation for [virtual generated column](glossary.html#glos_virtual_generated_column "virtual generated column") modifications. See [Section 13.1.8.2, “ALTER TABLE and Generated Columns”](alter-table-generated-columns.html "13.1.8.2 ALTER TABLE and Generated Columns").

NDB Cluster formerly supported online `ALTER TABLE` operations using the `ONLINE` and `OFFLINE` keywords. These keywords are no longer supported; their use causes a syntax error. MySQL NDB Cluster 7.5 (and later) supports online operations using the same `ALGORITHM=INPLACE` syntax used with the standard MySQL Server. `NDB` does not support changing a tablespace online. See [Section 21.6.12, “Online Operations with ALTER TABLE in NDB Cluster”](mysql-cluster-online-operations.html "21.6.12 Online Operations with ALTER TABLE in NDB Cluster"), for more information.

`ALTER TABLE` with `DISCARD ... PARTITION ... TABLESPACE` or `IMPORT ... PARTITION ... TABLESPACE` does not create any temporary tables or temporary partition files.

`ALTER TABLE` with `ADD PARTITION`, `DROP PARTITION`, `COALESCE PARTITION`, `REBUILD PARTITION`, or `REORGANIZE PARTITION` does not create temporary tables (except when used with [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables); however, these operations can and do create temporary partition files.

`ADD` or `DROP` operations for `RANGE` or `LIST` partitions are immediate operations or nearly so. `ADD` or `COALESCE` operations for `HASH` or `KEY` partitions copy data between all partitions, unless `LINEAR HASH` or `LINEAR KEY` was used; this is effectively the same as creating a new table, although the `ADD` or `COALESCE` operation is performed partition by partition. `REORGANIZE` operations copy only changed partitions and do not touch unchanged ones.

For `MyISAM` tables, you can speed up index re-creation (the slowest part of the alteration process) by setting the [`myisam_sort_buffer_size`](server-system-variables.html#sysvar_myisam_sort_buffer_size) system variable to a high value.

#### Concurrency Control

For [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") operations that support it, you can use the `LOCK` clause to control the level of concurrent reads and writes on a table while it is being altered. Specifying a non-default value for this clause enables you to require a certain amount of concurrent access or exclusivity during the alter operation, and halts the operation if the requested degree of locking is not available. The parameters for the `LOCK` clause are:

* `LOCK = DEFAULT`

  Maximum level of concurrency for the given `ALGORITHM` clause (if any) and `ALTER TABLE` operation: Permit concurrent reads and writes if supported. If not, permit concurrent reads if supported. If not, enforce exclusive access.

* `LOCK = NONE`

  If supported, permit concurrent reads and writes. Otherwise, an error occurs.

* `LOCK = SHARED`

  If supported, permit concurrent reads but block writes. Writes are blocked even if concurrent writes are supported by the storage engine for the given `ALGORITHM` clause (if any) and `ALTER TABLE` operation. If concurrent reads are not supported, an error occurs.

* `LOCK = EXCLUSIVE`

  Enforce exclusive access. This is done even if concurrent reads/writes are supported by the storage engine for the given `ALGORITHM` clause (if any) and `ALTER TABLE` operation.

#### Adding and Dropping Columns

Use `ADD` to add new columns to a table, and `DROP` to remove existing columns. `DROP col_name` is a MySQL extension to standard SQL.

To add a column at a specific position within a table row, use `FIRST` or `AFTER col_name`. The default is to add the column last.

If a table contains only one column, the column cannot be dropped. If what you intend is to remove the table, use the [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement") statement instead.

If columns are dropped from a table, the columns are also removed from any index of which they are a part. If all columns that make up an index are dropped, the index is dropped as well.

#### Renaming, Redefining, and Reordering Columns

The `CHANGE`, `MODIFY`, and `ALTER` clauses enable the names and definitions of existing columns to be altered. They have these comparative characteristics:

* `CHANGE`:

  + Can rename a column and change its definition, or both.
  + Has more capability than `MODIFY`, but at the expense of convenience for some operations. `CHANGE` requires naming the column twice if not renaming it.

  + With `FIRST` or `AFTER`, can reorder columns.

* `MODIFY`:

  + Can change a column definition but not its name.
  + More convenient than `CHANGE` to change a column definition without renaming it.

  + With `FIRST` or `AFTER`, can reorder columns.

* `ALTER`: Used only to change a column default value.

`CHANGE` is a MySQL extension to standard SQL. `MODIFY` is a MySQL extension for Oracle compatibility.

To alter a column to change both its name and definition, use `CHANGE`, specifying the old and new names and the new definition. For example, to rename an `INT NOT NULL` column from `a` to `b` and change its definition to use the `BIGINT` data type while retaining the `NOT NULL` attribute, do this:

```sql
ALTER TABLE t1 CHANGE a b BIGINT NOT NULL;
```

To change a column definition but not its name, use `CHANGE` or `MODIFY`. With `CHANGE`, the syntax requires two column names, so you must specify the same name twice to leave the name unchanged. For example, to change the definition of column `b`, do this:

```sql
ALTER TABLE t1 CHANGE b b INT NOT NULL;
```

`MODIFY` is more convenient to change the definition without changing the name because it requires the column name only once:

```sql
ALTER TABLE t1 MODIFY b INT NOT NULL;
```

To change a column name but not its definition, use `CHANGE`. The syntax requires a column definition, so to leave the definition unchanged, you must respecify the definition the column currently has. For example, to rename an `INT NOT NULL` column from `b` to `a`, do this:

```sql
ALTER TABLE t1 CHANGE b a INT NOT NULL;
```

For column definition changes using `CHANGE` or `MODIFY`, the definition must include the data type and all attributes that should apply to the new column, other than index attributes such as `PRIMARY KEY` or `UNIQUE`. Attributes present in the original definition but not specified for the new definition are not carried forward. Suppose that a column `col1` is defined as `INT UNSIGNED DEFAULT 1 COMMENT 'my column'` and you modify the column as follows, intending to change only `INT` to `BIGINT`:

```sql
ALTER TABLE t1 MODIFY col1 BIGINT;
```

That statement changes the data type from `INT` to `BIGINT`, but it also drops the `UNSIGNED`, `DEFAULT`, and `COMMENT` attributes. To retain them, the statement must include them explicitly:

```sql
ALTER TABLE t1 MODIFY col1 BIGINT UNSIGNED DEFAULT 1 COMMENT 'my column';
```

For data type changes using `CHANGE` or `MODIFY`, MySQL tries to convert existing column values to the new type as well as possible.

Warning

This conversion may result in alteration of data. For example, if you shorten a string column, values may be truncated. To prevent the operation from succeeding if conversions to the new data type would result in loss of data, enable strict SQL mode before using [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") (see [Section 5.1.10, “Server SQL Modes”](sql-mode.html "5.1.10 Server SQL Modes")).

If you use `CHANGE` or `MODIFY` to shorten a column for which an index exists on the column, and the resulting column length is less than the index length, MySQL shortens the index automatically.

For columns renamed by `CHANGE`, MySQL automatically renames these references to the renamed column:

* Indexes that refer to the old column, including indexes and disabled `MyISAM` indexes.

* Foreign keys that refer to the old column.

For columns renamed by `CHANGE`, MySQL does not automatically rename these references to the renamed column:

* Generated column and partition expressions that refer to the renamed column. You must use `CHANGE` to redefine such expressions in the same [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement as the one that renames the column.

* Views and stored programs that refer to the renamed column. You must manually alter the definition of these objects to refer to the new column name.

To reorder columns within a table, use `FIRST` and `AFTER` in `CHANGE` or `MODIFY` operations.

`ALTER ... SET DEFAULT` or `ALTER ... DROP DEFAULT` specify a new default value for a column or remove the old default value, respectively. If the old default is removed and the column can be `NULL`, the new default is `NULL`. If the column cannot be `NULL`, MySQL assigns a default value as described in [Section 11.6, “Data Type Default Values”](data-type-defaults.html "11.6 Data Type Default Values").

`ALTER ... SET DEFAULT` cannot be used with the [`CURRENT_TIMESTAMP`](date-and-time-functions.html#function_current-timestamp) function.

#### Primary Keys and Indexes

`DROP PRIMARY KEY` drops the [primary key](glossary.html#glos_primary_key "primary key"). If there is no primary key, an error occurs. For information about the performance characteristics of primary keys, especially for `InnoDB` tables, see [Section 8.3.2, “Primary Key Optimization”](primary-key-optimization.html "8.3.2 Primary Key Optimization").

If you add a `UNIQUE INDEX` or `PRIMARY KEY` to a table, MySQL stores it before any nonunique index to permit detection of duplicate keys as early as possible.

[`DROP INDEX`](drop-index.html "13.1.25 DROP INDEX Statement") removes an index. This is a MySQL extension to standard SQL. See [Section 13.1.25, “DROP INDEX Statement”](drop-index.html "13.1.25 DROP INDEX Statement"). To determine index names, use `SHOW INDEX FROM tbl_name`.

Some storage engines permit you to specify an index type when creating an index. The syntax for the *`index_type`* specifier is `USING type_name`. For details about `USING`, see [Section 13.1.14, “CREATE INDEX Statement”](create-index.html "13.1.14 CREATE INDEX Statement"). The preferred position is after the column list. You should expect support for use of the option before the column list to be removed in a future MySQL release.

*`index_option`* values specify additional options for an index. For details about permissible *`index_option`* values, see [Section 13.1.14, “CREATE INDEX Statement”](create-index.html "13.1.14 CREATE INDEX Statement").

`RENAME INDEX old_index_name TO new_index_name` renames an index. This is a MySQL extension to standard SQL. The content of the table remains unchanged. *`old_index_name`* must be the name of an existing index in the table that is not dropped by the same [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement. *`new_index_name`* is the new index name, which cannot duplicate the name of an index in the resulting table after changes have been applied. Neither index name can be `PRIMARY`.

If you use [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") on a `MyISAM` table, all nonunique indexes are created in a separate batch (as for [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement")). This should make [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") much faster when you have many indexes.

For `MyISAM` tables, key updating can be controlled explicitly. Use `ALTER TABLE ... DISABLE KEYS` to tell MySQL to stop updating nonunique indexes. Then use `ALTER TABLE ... ENABLE KEYS` to re-create missing indexes. `MyISAM` does this with a special algorithm that is much faster than inserting keys one by one, so disabling keys before performing bulk insert operations should give a considerable speedup. Using `ALTER TABLE ... DISABLE KEYS` requires the [`INDEX`](privileges-provided.html#priv_index) privilege in addition to the privileges mentioned earlier.

While the nonunique indexes are disabled, they are ignored for statements such as [`SELECT`](select.html "13.2.9 SELECT Statement") and [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement") that otherwise would use them.

After an [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement, it may be necessary to run [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement") to update index cardinality information. See [Section 13.7.5.22, “SHOW INDEX Statement”](show-index.html "13.7.5.22 SHOW INDEX Statement").

#### Foreign Keys and Other Constraints

The `FOREIGN KEY` and `REFERENCES` clauses are supported by the `InnoDB` and `NDB` storage engines, which implement `ADD [CONSTRAINT [symbol]] FOREIGN KEY [index_name] (...) REFERENCES ... (...)`. See [Section 1.6.3.2, “FOREIGN KEY Constraints”](constraint-foreign-key.html "1.6.3.2 FOREIGN KEY Constraints"). For other storage engines, the clauses are parsed but ignored.

The `CHECK` constraint clause is parsed but ignored by all storage engines. See [Section 13.1.18, “CREATE TABLE Statement”](create-table.html "13.1.18 CREATE TABLE Statement"). The reason for accepting but ignoring syntax clauses is for compatibility, to make it easier to port code from other SQL servers, and to run applications that create tables with references. See [Section 1.6.2, “MySQL Differences from Standard SQL”](differences-from-ansi.html "1.6.2 MySQL Differences from Standard SQL").

For [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"), unlike [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"), `ADD FOREIGN KEY` ignores *`index_name`* if given and uses an automatically generated foreign key name. As a workaround, include the `CONSTRAINT` clause to specify the foreign key name:

```sql
ADD CONSTRAINT name FOREIGN KEY (....) ...
```

Important

MySQL silently ignores inline `REFERENCES` specifications, where the references are defined as part of the column specification. MySQL accepts only `REFERENCES` clauses defined as part of a separate `FOREIGN KEY` specification.

Note

Partitioned `InnoDB` tables do not support foreign keys. This restriction does not apply to `NDB` tables, including those explicitly partitioned by `[LINEAR] KEY`. For more information, see [Section 22.6.2, “Partitioning Limitations Relating to Storage Engines”](partitioning-limitations-storage-engines.html "22.6.2 Partitioning Limitations Relating to Storage Engines").

MySQL Server and NDB Cluster both support the use of [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") to drop foreign keys:

```sql
ALTER TABLE tbl_name DROP FOREIGN KEY fk_symbol;
```

Adding and dropping a foreign key in the same [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement is supported for [`ALTER TABLE ... ALGORITHM=INPLACE`](alter-table.html "13.1.8 ALTER TABLE Statement") but not for [`ALTER TABLE ... ALGORITHM=COPY`](alter-table.html "13.1.8 ALTER TABLE Statement").

The server prohibits changes to foreign key columns that have the potential to cause loss of referential integrity. A workaround is to use [`ALTER TABLE ... DROP FOREIGN KEY`](alter-table.html "13.1.8 ALTER TABLE Statement") before changing the column definition and [`ALTER TABLE ... ADD FOREIGN KEY`](alter-table.html "13.1.8 ALTER TABLE Statement") afterward. Examples of prohibited changes include:

* Changes to the data type of foreign key columns that may be unsafe. For example, changing [`VARCHAR(20)`](char.html "11.3.2 The CHAR and VARCHAR Types") to [`VARCHAR(30)`](char.html "11.3.2 The CHAR and VARCHAR Types") is permitted, but changing it to [`VARCHAR(1024)`](char.html "11.3.2 The CHAR and VARCHAR Types") is not because that alters the number of length bytes required to store individual values.

* Changing a `NULL` column to `NOT NULL` in non-strict mode is prohibited to prevent converting `NULL` values to default non-`NULL` values, for which there are no corresponding values in the referenced table. The operation is permitted in strict mode, but an error is returned if any such conversion is required.

`ALTER TABLE tbl_name RENAME new_tbl_name` changes internally generated foreign key constraint names and user-defined foreign key constraint names that begin with the string “*`tbl_name`*_ibfk_” to reflect the new table name. `InnoDB` interprets foreign key constraint names that begin with the string “*`tbl_name`*_ibfk_” as internally generated names.

#### Changing the Character Set

To change the table default character set and all character columns ([`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types")) to a new character set, use a statement like this:

```sql
ALTER TABLE tbl_name CONVERT TO CHARACTER SET charset_name;
```

The statement also changes the collation of all character columns. If you specify no `COLLATE` clause to indicate which collation to use, the statement uses default collation for the character set. If this collation is inappropriate for the intended table use (for example, if it would change from a case-sensitive collation to a case-insensitive collation), specify a collation explicitly.

For a column that has a data type of [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") or one of the [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") types, `CONVERT TO CHARACTER SET` changes the data type as necessary to ensure that the new column is long enough to store as many characters as the original column. For example, a [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") column has two length bytes, which store the byte-length of values in the column, up to a maximum of 65,535. For a `latin1` [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") column, each character requires a single byte, so the column can store up to 65,535 characters. If the column is converted to `utf8`, each character might require up to three bytes, for a maximum possible length of 3 × 65,535 = 196,605 bytes. That length does not fit in a [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") column's length bytes, so MySQL converts the data type to [`MEDIUMTEXT`](blob.html "11.3.4 The BLOB and TEXT Types"), which is the smallest string type for which the length bytes can record a value of 196,605. Similarly, a [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") column might be converted to [`MEDIUMTEXT`](blob.html "11.3.4 The BLOB and TEXT Types").

To avoid data type changes of the type just described, do not use `CONVERT TO CHARACTER SET`. Instead, use `MODIFY` to change individual columns. For example:

```sql
ALTER TABLE t MODIFY latin1_text_col TEXT CHARACTER SET utf8;
ALTER TABLE t MODIFY latin1_varchar_col VARCHAR(M) CHARACTER SET utf8;
```

If you specify `CONVERT TO CHARACTER SET binary`, the [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), and [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") columns are converted to their corresponding binary string types ([`BINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types")). This means that the columns no longer have a character set and a subsequent `CONVERT TO` operation does not apply to them.

If *`charset_name`* is `DEFAULT` in a `CONVERT TO CHARACTER SET` operation, the character set named by the [`character_set_database`](server-system-variables.html#sysvar_character_set_database) system variable is used.

Warning

The `CONVERT TO` operation converts column values between the original and named character sets. This is *not* what you want if you have a column in one character set (like `latin1`) but the stored values actually use some other, incompatible character set (like `utf8`). In this case, you have to do the following for each such column:

```sql
ALTER TABLE t1 CHANGE c1 c1 BLOB;
ALTER TABLE t1 CHANGE c1 c1 TEXT CHARACTER SET utf8;
```

The reason this works is that there is no conversion when you convert to or from [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") columns.

To change only the *default* character set for a table, use this statement:

```sql
ALTER TABLE tbl_name DEFAULT CHARACTER SET charset_name;
```

The word `DEFAULT` is optional. The default character set is the character set that is used if you do not specify the character set for columns that you add to a table later (for example, with `ALTER TABLE ... ADD column`).

When the [`foreign_key_checks`](server-system-variables.html#sysvar_foreign_key_checks) system variable is enabled, which is the default setting, character set conversion is not permitted on tables that include a character string column used in a foreign key constraint. The workaround is to disable [`foreign_key_checks`](server-system-variables.html#sysvar_foreign_key_checks) before performing the character set conversion. You must perform the conversion on both tables involved in the foreign key constraint before re-enabling [`foreign_key_checks`](server-system-variables.html#sysvar_foreign_key_checks). If you re-enable [`foreign_key_checks`](server-system-variables.html#sysvar_foreign_key_checks) after converting only one of the tables, an `ON DELETE CASCADE` or `ON UPDATE CASCADE` operation could corrupt data in the referencing table due to implicit conversion that occurs during these operations (Bug
#45290, Bug #74816).

#### Discarding and Importing InnoDB Tablespaces

An `InnoDB` table created in its own [file-per-table](glossary.html#glos_file_per_table "file-per-table") tablespace can be imported from a backup or from another MySQL server instance using `DISCARD TABLEPACE` and `IMPORT TABLESPACE` clauses. See [Section 14.6.1.3, “Importing InnoDB Tables”](innodb-table-import.html "14.6.1.3 Importing InnoDB Tables").

#### Row Order for MyISAM Tables

`ORDER BY` enables you to create the new table with the rows in a specific order. This option is useful primarily when you know that you query the rows in a certain order most of the time. By using this option after major changes to the table, you might be able to get higher performance. In some cases, it might make sorting easier for MySQL if the table is in order by the column that you want to order it by later.

Note

The table does not remain in the specified order after inserts and deletes.

`ORDER BY` syntax permits one or more column names to be specified for sorting, each of which optionally can be followed by `ASC` or `DESC` to indicate ascending or descending sort order, respectively. The default is ascending order. Only column names are permitted as sort criteria; arbitrary expressions are not permitted. This clause should be given last after any other clauses.

`ORDER BY` does not make sense for `InnoDB` tables because `InnoDB` always orders table rows according to the [clustered index](glossary.html#glos_clustered_index "clustered index").

When used on a partitioned table, `ALTER TABLE ... ORDER BY` orders rows within each partition only.

#### Partitioning Options

*`partition_options`* signifies options that can be used with partitioned tables for repartitioning, to add, drop, discard, import, merge, and split partitions, and to perform partitioning maintenance.

It is possible for an [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement to contain a `PARTITION BY` or `REMOVE PARTITIONING` clause in an addition to other alter specifications, but the `PARTITION BY` or `REMOVE PARTITIONING` clause must be specified last after any other specifications. The `ADD PARTITION`, `DROP PARTITION`, `DISCARD PARTITION`, `IMPORT PARTITION`, `COALESCE PARTITION`, `REORGANIZE PARTITION`, `EXCHANGE PARTITION`, `ANALYZE PARTITION`, `CHECK PARTITION`, and `REPAIR PARTITION` options cannot be combined with other alter specifications in a single `ALTER TABLE`, since the options just listed act on individual partitions.

For more information about partition options, see [Section 13.1.18, “CREATE TABLE Statement”](create-table.html "13.1.18 CREATE TABLE Statement"), and [Section 13.1.8.1, “ALTER TABLE Partition Operations”](alter-table-partition-operations.html "13.1.8.1 ALTER TABLE Partition Operations"). For information about and examples of `ALTER TABLE ... EXCHANGE PARTITION` statements, see [Section 22.3.3, “Exchanging Partitions and Subpartitions with Tables”](partitioning-management-exchange.html "22.3.3 Exchanging Partitions and Subpartitions with Tables").

Prior to MySQL 5.7.6, partitioned `InnoDB` tables used the generic `ha_partition` partitioning handler employed by `MyISAM` and other storage engines not supplying their own partitioning handlers; in MySQL 5.7.6 and later, such tables are created using the `InnoDB` storage engine's own (or “native”) partitioning handler. Beginning with MySQL 5.7.9, you can upgrade an `InnoDB` table that was created in MySQL 5.7.6 or earlier (that is, created using `ha_partition`) to the `InnoDB` native partition handler using `ALTER TABLE ... UPGRADE PARTITIONING`. (Bug #76734, Bug #20727344) This `ALTER TABLE` syntax does not accept any other options and can be used only on a single table at a time. You can also use [**mysql_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables") in MySQL 5.7.9 or later to upgrade older partitioned **InnoDB** tables to the native partitioning handler.
