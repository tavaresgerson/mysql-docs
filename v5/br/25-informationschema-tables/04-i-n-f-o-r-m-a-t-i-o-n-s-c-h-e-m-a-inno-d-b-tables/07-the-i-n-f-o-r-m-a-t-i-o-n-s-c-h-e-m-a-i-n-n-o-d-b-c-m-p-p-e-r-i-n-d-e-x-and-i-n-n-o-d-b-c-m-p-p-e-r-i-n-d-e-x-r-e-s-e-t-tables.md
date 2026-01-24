### 24.4.7 The INFORMATION_SCHEMA INNODB_CMP_PER_INDEX and INNODB_CMP_PER_INDEX_RESET Tables

The [`INNODB_CMP_PER_INDEX`](information-schema-innodb-cmp-per-index-table.html "24.4.7 The INFORMATION_SCHEMA INNODB_CMP_PER_INDEX and INNODB_CMP_PER_INDEX_RESET Tables") and [`INNODB_CMP_PER_INDEX_RESET`](information-schema-innodb-cmp-per-index-table.html "24.4.7 The INFORMATION_SCHEMA INNODB_CMP_PER_INDEX and INNODB_CMP_PER_INDEX_RESET Tables") tables provide status information on operations related to [compressed](glossary.html#glos_compression "compression") `InnoDB` tables and indexes, with separate statistics for each combination of database, table, and index, to help you evaluate the performance and usefulness of compression for specific tables.

For a compressed `InnoDB` table, both the table data and all the [secondary indexes](glossary.html#glos_secondary_index "secondary index") are compressed. In this context, the table data is treated as just another index, one that happens to contain all the columns: the [clustered index](glossary.html#glos_clustered_index "clustered index").

The [`INNODB_CMP_PER_INDEX`](information-schema-innodb-cmp-per-index-table.html "24.4.7 The INFORMATION_SCHEMA INNODB_CMP_PER_INDEX and INNODB_CMP_PER_INDEX_RESET Tables") and [`INNODB_CMP_PER_INDEX_RESET`](information-schema-innodb-cmp-per-index-table.html "24.4.7 The INFORMATION_SCHEMA INNODB_CMP_PER_INDEX and INNODB_CMP_PER_INDEX_RESET Tables") tables have these columns:

* `DATABASE_NAME`

  The schema (database) containing the applicable table.

* `TABLE_NAME`

  The table to monitor for compression statistics.

* `INDEX_NAME`

  The index to monitor for compression statistics.

* `COMPRESS_OPS`

  The number of compression operations attempted. [Pages](glossary.html#glos_page "page") are compressed whenever an empty page is created or the space for the uncompressed modification log runs out.

* `COMPRESS_OPS_OK`

  The number of successful compression operations. Subtract from the `COMPRESS_OPS` value to get the number of [compression failures](glossary.html#glos_compression_failure "compression failure"). Divide by the `COMPRESS_OPS` value to get the percentage of compression failures.

* `COMPRESS_TIME`

  The total time in seconds used for compressing data in this index.

* `UNCOMPRESS_OPS`

  The number of uncompression operations performed. Compressed `InnoDB` pages are uncompressed whenever compression [fails](glossary.html#glos_compression_failure "compression failure"), or the first time a compressed page is accessed in the [buffer pool](glossary.html#glos_buffer_pool "buffer pool") and the uncompressed page does not exist.

* `UNCOMPRESS_TIME`

  The total time in seconds used for uncompressing data in this index.

#### Example

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_CMP_PER_INDEX\G
*************************** 1. row ***************************
  database_name: employees
     table_name: salaries
     index_name: PRIMARY
   compress_ops: 0
compress_ops_ok: 0
  compress_time: 0
 uncompress_ops: 23451
uncompress_time: 4
*************************** 2. row ***************************
  database_name: employees
     table_name: salaries
     index_name: emp_no
   compress_ops: 0
compress_ops_ok: 0
  compress_time: 0
 uncompress_ops: 1597
uncompress_time: 0
```

#### Notes

* Use these tables to measure the effectiveness of `InnoDB` table [compression](glossary.html#glos_compression "compression") for specific tables, indexes, or both.

* You must have the [`PROCESS`](privileges-provided.html#priv_process) privilege to query these tables.

* Use the `INFORMATION_SCHEMA` [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") table or the [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") statement to view additional information about the columns of these tables, including data types and default values.

* Because collecting separate measurements for every index imposes substantial performance overhead, [`INNODB_CMP_PER_INDEX`](information-schema-innodb-cmp-per-index-table.html "24.4.7 The INFORMATION_SCHEMA INNODB_CMP_PER_INDEX and INNODB_CMP_PER_INDEX_RESET Tables") and [`INNODB_CMP_PER_INDEX_RESET`](information-schema-innodb-cmp-per-index-table.html "24.4.7 The INFORMATION_SCHEMA INNODB_CMP_PER_INDEX and INNODB_CMP_PER_INDEX_RESET Tables") statistics are not gathered by default. You must enable the [`innodb_cmp_per_index_enabled`](innodb-parameters.html#sysvar_innodb_cmp_per_index_enabled) system variable before performing the operations on compressed tables that you want to monitor.

* For usage information, see [Section 14.9.1.4, “Monitoring InnoDB Table Compression at Runtime”](innodb-compression-tuning-monitoring.html "14.9.1.4 Monitoring InnoDB Table Compression at Runtime") and [Section 14.16.1.3, “Using the Compression Information Schema Tables”](innodb-information-schema-examples-compression-sect.html "14.16.1.3 Using the Compression Information Schema Tables"). For general information about `InnoDB` table compression, see [Section 14.9, “InnoDB Table and Page Compression”](innodb-compression.html "14.9 InnoDB Table and Page Compression").
