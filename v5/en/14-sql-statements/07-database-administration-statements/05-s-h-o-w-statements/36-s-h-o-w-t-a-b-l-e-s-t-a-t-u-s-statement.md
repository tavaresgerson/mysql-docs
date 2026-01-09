#### 13.7.5.36 SHOW TABLE STATUS Statement

```sql
SHOW TABLE STATUS
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

[`SHOW TABLE STATUS`](show-table-status.html "13.7.5.36 SHOW TABLE STATUS Statement") works likes [`SHOW TABLES`](show-tables.html "13.7.5.37 SHOW TABLES Statement"), but provides a lot of information about each non-`TEMPORARY` table. You can also get this list using the [**mysqlshow --status *`db_name`***](mysqlshow.html "4.5.7 mysqlshow — Display Database, Table, and Column Information") command. The [`LIKE`](string-comparison-functions.html#operator_like) clause, if present, indicates which table names to match. The `WHERE` clause can be given to select rows using more general conditions, as discussed in [Section 24.8, “Extensions to SHOW Statements”](extended-show.html "24.8 Extensions to SHOW Statements").

This statement also displays information about views.

[`SHOW TABLE STATUS`](show-table-status.html "13.7.5.36 SHOW TABLE STATUS Statement") output has these columns:

* `Name`

  The name of the table.

* `Engine`

  The storage engine for the table. See [Chapter 14, *The InnoDB Storage Engine*](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), and [Chapter 15, *Alternative Storage Engines*](storage-engines.html "Chapter 15 Alternative Storage Engines").

  For partitioned tables, `Engine` shows the name of the storage engine used by all partitions.

* `Version`

  The version number of the table's `.frm` file.

* `Row_format`

  The row-storage format (`Fixed`, `Dynamic`, `Compressed`, `Redundant`, `Compact`). For `MyISAM` tables, `Dynamic` corresponds to what [**myisamchk -dvv**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility") reports as `Packed`. `InnoDB` table format is either `Redundant` or `Compact` when using the `Antelope` file format, or `Compressed` or `Dynamic` when using the `Barracuda` file format.

* `Rows`

  The number of rows. Some storage engines, such as `MyISAM`, store the exact count. For other storage engines, such as `InnoDB`, this value is an approximation, and may vary from the actual value by as much as 40% to 50%. In such cases, use `SELECT COUNT(*)` to obtain an accurate count.

  The `Rows` value is `NULL` for `INFORMATION_SCHEMA` tables.

  For [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") tables, the row count is only a rough estimate used in SQL optimization. (This is also true if the [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") table is partitioned.)

* `Avg_row_length`

  The average row length.

  Refer to the notes at the end of this section for related information.

* `Data_length`

  For `MyISAM`, `Data_length` is the length of the data file, in bytes.

  For `InnoDB`, `Data_length` is the approximate amount of space allocated for the clustered index, in bytes. Specifically, it is the clustered index size, in pages, multiplied by the `InnoDB` page size.

  Refer to the notes at the end of this section for information regarding other storage engines.

* `Max_data_length`

  For `MyISAM`, `Max_data_length` is maximum length of the data file. This is the total number of bytes of data that can be stored in the table, given the data pointer size used.

  Unused for `InnoDB`.

  Refer to the notes at the end of this section for information regarding other storage engines.

* `Index_length`

  For `MyISAM`, `Index_length` is the length of the index file, in bytes.

  For `InnoDB`, `Index_length` is the approximate amount of space allocated for non-clustered indexes, in bytes. Specifically, it is the sum of non-clustered index sizes, in pages, multiplied by the `InnoDB` page size.

  Refer to the notes at the end of this section for information regarding other storage engines.

* `Data_free`

  The number of allocated but unused bytes.

  `InnoDB` tables report the free space of the tablespace to which the table belongs. For a table located in the shared tablespace, this is the free space of the shared tablespace. If you are using multiple tablespaces and the table has its own tablespace, the free space is for only that table. Free space means the number of bytes in completely free extents minus a safety margin. Even if free space displays as 0, it may be possible to insert rows as long as new extents need not be allocated.

  For NDB Cluster, `Data_free` shows the space allocated on disk for, but not used by, a Disk Data table or fragment on disk. (In-memory data resource usage is reported by the `Data_length` column.)

  For partitioned tables, this value is only an estimate and may not be absolutely correct. A more accurate method of obtaining this information in such cases is to query the `INFORMATION_SCHEMA` [`PARTITIONS`](information-schema-partitions-table.html "24.3.16 The INFORMATION_SCHEMA PARTITIONS Table") table, as shown in this example:

  ```sql
  SELECT SUM(DATA_FREE)
      FROM  INFORMATION_SCHEMA.PARTITIONS
      WHERE TABLE_SCHEMA = 'mydb'
      AND   TABLE_NAME   = 'mytable';
  ```

  For more information, see [Section 24.3.16, “The INFORMATION_SCHEMA PARTITIONS Table”](information-schema-partitions-table.html "24.3.16 The INFORMATION_SCHEMA PARTITIONS Table").

* `Auto_increment`

  The next `AUTO_INCREMENT` value.

* `Create_time`

  When the table was created.

* `Update_time`

  When the data file was last updated. For some storage engines, this value is `NULL`. For example, `InnoDB` stores multiple tables in its [system tablespace](glossary.html#glos_system_tablespace "system tablespace") and the data file timestamp does not apply. Even with [file-per-table](glossary.html#glos_file_per_table "file-per-table") mode with each `InnoDB` table in a separate `.ibd` file, [change buffering](glossary.html#glos_change_buffering "change buffering") can delay the write to the data file, so the file modification time is different from the time of the last insert, update, or delete. For `MyISAM`, the data file timestamp is used; however, on Windows the timestamp is not updated by updates, so the value is inaccurate.

  `Update_time` displays a timestamp value for the last [`UPDATE`](update.html "13.2.11 UPDATE Statement"), [`INSERT`](insert.html "13.2.5 INSERT Statement"), or [`DELETE`](delete.html "13.2.2 DELETE Statement") performed on `InnoDB` tables that are not partitioned. For MVCC, the timestamp value reflects the [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") time, which is considered the last update time. Timestamps are not persisted when the server is restarted or when the table is evicted from the `InnoDB` data dictionary cache.

  The `Update_time` column also shows this information for partitioned `InnoDB` tables.

* `Check_time`

  When the table was last checked. Not all storage engines update this time, in which case, the value is always `NULL`.

  For partitioned [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") tables, `Check_time` is always `NULL`.

* `Collation`

  The table default collation. The output does not explicitly list the table default character set, but the collation name begins with the character set name.

* `Checksum`

  The live checksum value, if any.

* `Create_options`

  Extra options used with [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement").

  `Create_options` shows `partitioned` for a partitioned table.

  `Create_options` shows the `ENCRYPTION` option specified when creating or altering a file-per-table tablespace.

  When creating a table with [strict mode](glossary.html#glos_strict_mode "strict mode") disabled, the storage engine's default row format is used if the specified row format is not supported. The actual row format of the table is reported in the `Row_format` column. `Create_options` shows the row format that was specified in the [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement.

  When altering the storage engine of a table, table options that are not applicable to the new storage engine are retained in the table definition to enable reverting the table with its previously defined options to the original storage engine, if necessary. `Create_options` may show retained options.

* `Comment`

  The comment used when creating the table (or information as to why MySQL could not access the table information).

##### Notes

* For `InnoDB` tables, [`SHOW TABLE STATUS`](show-table-status.html "13.7.5.36 SHOW TABLE STATUS Statement") does not give accurate statistics except for the physical size reserved by the table. The row count is only a rough estimate used in SQL optimization.

* For [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables, the output of this statement shows appropriate values for the `Avg_row_length` and `Data_length` columns, with the exception that [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") columns are not taken into account.

* For [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables, `Data_length` includes data stored in main memory only; the `Max_data_length` and `Data_free` columns apply to Disk Data.

* For NDB Cluster Disk Data tables, `Max_data_length` shows the space allocated for the disk part of a Disk Data table or fragment. (In-memory data resource usage is reported by the `Data_length` column.)

* For `MEMORY` tables, the `Data_length`, `Max_data_length`, and `Index_length` values approximate the actual amount of allocated memory. The allocation algorithm reserves memory in large amounts to reduce the number of allocation operations.

* For views, all columns displayed by [`SHOW TABLE STATUS`](show-table-status.html "13.7.5.36 SHOW TABLE STATUS Statement") are `NULL` except that `Name` indicates the view name and `Comment` says `VIEW`.

Table information is also available from the `INFORMATION_SCHEMA` [`TABLES`](information-schema-tables-table.html "24.3.25 The INFORMATION_SCHEMA TABLES Table") table. See [Section 24.3.25, “The INFORMATION_SCHEMA TABLES Table”](information-schema-tables-table.html "24.3.25 The INFORMATION_SCHEMA TABLES Table").
