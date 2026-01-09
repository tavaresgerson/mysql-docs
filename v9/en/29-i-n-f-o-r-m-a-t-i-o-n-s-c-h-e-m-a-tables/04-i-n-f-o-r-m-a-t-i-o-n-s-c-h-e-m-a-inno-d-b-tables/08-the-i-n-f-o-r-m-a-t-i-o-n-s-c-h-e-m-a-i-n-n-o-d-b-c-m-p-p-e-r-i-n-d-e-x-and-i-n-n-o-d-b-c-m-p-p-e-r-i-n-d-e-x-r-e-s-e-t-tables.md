### 28.4.8 The INFORMATION_SCHEMA INNODB_CMP_PER_INDEX and INNODB_CMP_PER_INDEX_RESET Tables

The `INNODB_CMP_PER_INDEX` and `INNODB_CMP_PER_INDEX_RESET` tables provide status information on operations related to compressed `InnoDB` tables and indexes, with separate statistics for each combination of database, table, and index, to help you evaluate the performance and usefulness of compression for specific tables.

For a compressed `InnoDB` table, both the table data and all the secondary indexes are compressed. In this context, the table data is treated as just another index, one that happens to contain all the columns: the clustered index.

The `INNODB_CMP_PER_INDEX` and `INNODB_CMP_PER_INDEX_RESET` tables have these columns:

* `DATABASE_NAME`

  The schema (database) containing the applicable table.

* `TABLE_NAME`

  The table to monitor for compression statistics.

* `INDEX_NAME`

  The index to monitor for compression statistics.

* `COMPRESS_OPS`

  The number of compression operations attempted. Pages are compressed whenever an empty page is created or the space for the uncompressed modification log runs out.

* `COMPRESS_OPS_OK`

  The number of successful compression operations. Subtract from the `COMPRESS_OPS` value to get the number of compression failures. Divide by the `COMPRESS_OPS` value to get the percentage of compression failures.

* `COMPRESS_TIME`

  The total time in seconds used for compressing data in this index.

* `UNCOMPRESS_OPS`

  The number of uncompression operations performed. Compressed `InnoDB` pages are uncompressed whenever compression fails, or the first time a compressed page is accessed in the buffer pool and the uncompressed page does not exist.

* `UNCOMPRESS_TIME`

  The total time in seconds used for uncompressing data in this index.

#### Example

```
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

* Use these tables to measure the effectiveness of `InnoDB` table compression for specific tables, indexes, or both.

* You must have the `PROCESS` privilege to query these tables.

* Use the `INFORMATION_SCHEMA` `COLUMNS` table or the `SHOW COLUMNS` statement to view additional information about the columns of these tables, including data types and default values.

* Because collecting separate measurements for every index imposes substantial performance overhead, `INNODB_CMP_PER_INDEX` and `INNODB_CMP_PER_INDEX_RESET` statistics are not gathered by default. You must enable the `innodb_cmp_per_index_enabled` system variable before performing the operations on compressed tables that you want to monitor.

* For usage information, see Section 17.9.1.4, “Monitoring InnoDB Table Compression at Runtime” and Section 17.15.1.3, “Using the Compression Information Schema Tables”. For general information about `InnoDB` table compression, see Section 17.9, “InnoDB Table and Page Compression”.
