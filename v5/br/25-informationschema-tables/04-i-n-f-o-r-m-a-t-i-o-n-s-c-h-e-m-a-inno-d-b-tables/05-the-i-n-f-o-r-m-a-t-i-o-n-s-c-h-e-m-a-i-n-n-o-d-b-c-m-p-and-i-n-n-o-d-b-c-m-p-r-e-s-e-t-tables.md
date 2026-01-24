### 24.4.5 The INFORMATION_SCHEMA INNODB_CMP and INNODB_CMP_RESET Tables

The [`INNODB_CMP`](information-schema-innodb-cmp-table.html "24.4.5 The INFORMATION_SCHEMA INNODB_CMP and INNODB_CMP_RESET Tables") and [`INNODB_CMP_RESET`](information-schema-innodb-cmp-table.html "24.4.5 The INFORMATION_SCHEMA INNODB_CMP and INNODB_CMP_RESET Tables") tables provide status information on operations related to [compressed](glossary.html#glos_compression "compression") `InnoDB` tables.

The [`INNODB_CMP`](information-schema-innodb-cmp-table.html "24.4.5 The INFORMATION_SCHEMA INNODB_CMP and INNODB_CMP_RESET Tables") and [`INNODB_CMP_RESET`](information-schema-innodb-cmp-table.html "24.4.5 The INFORMATION_SCHEMA INNODB_CMP and INNODB_CMP_RESET Tables") tables have these columns:

* `PAGE_SIZE`

  The compressed page size in bytes.

* `COMPRESS_OPS`

  The number of times a B-tree page of size `PAGE_SIZE` has been compressed. Pages are compressed whenever an empty page is created or the space for the uncompressed modification log runs out.

* `COMPRESS_OPS_OK`

  The number of times a B-tree page of size `PAGE_SIZE` has been successfully compressed. This count should never exceed `COMPRESS_OPS`.

* `COMPRESS_TIME`

  The total time in seconds used for attempts to compress B-tree pages of size `PAGE_SIZE`.

* `UNCOMPRESS_OPS`

  The number of times a B-tree page of size `PAGE_SIZE` has been uncompressed. B-tree pages are uncompressed whenever compression fails or at first access when the uncompressed page does not exist in the buffer pool.

* `UNCOMPRESS_TIME`

  The total time in seconds used for uncompressing B-tree pages of the size `PAGE_SIZE`.

#### Example

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.INNODB_CMP\G
*************************** 1. row ***************************
      page_size: 1024
   compress_ops: 0
compress_ops_ok: 0
  compress_time: 0
 uncompress_ops: 0
uncompress_time: 0
*************************** 2. row ***************************
      page_size: 2048
   compress_ops: 0
compress_ops_ok: 0
  compress_time: 0
 uncompress_ops: 0
uncompress_time: 0
*************************** 3. row ***************************
      page_size: 4096
   compress_ops: 0
compress_ops_ok: 0
  compress_time: 0
 uncompress_ops: 0
uncompress_time: 0
*************************** 4. row ***************************
      page_size: 8192
   compress_ops: 86955
compress_ops_ok: 81182
  compress_time: 27
 uncompress_ops: 26828
uncompress_time: 5
*************************** 5. row ***************************
      page_size: 16384
   compress_ops: 0
compress_ops_ok: 0
  compress_time: 0
 uncompress_ops: 0
uncompress_time: 0
```

#### Notes

* Use these tables to measure the effectiveness of `InnoDB` table [compression](glossary.html#glos_compression "compression") in your database.

* You must have the [`PROCESS`](privileges-provided.html#priv_process) privilege to query this table.

* Use the `INFORMATION_SCHEMA` [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") table or the [`SHOW COLUMNS`](show-columns.html "13.7.5.5 SHOW COLUMNS Statement") statement to view additional information about the columns of this table, including data types and default values.

* For usage information, see [Section 14.9.1.4, “Monitoring InnoDB Table Compression at Runtime”](innodb-compression-tuning-monitoring.html "14.9.1.4 Monitoring InnoDB Table Compression at Runtime") and [Section 14.16.1.3, “Using the Compression Information Schema Tables”](innodb-information-schema-examples-compression-sect.html "14.16.1.3 Using the Compression Information Schema Tables"). For general information about `InnoDB` table compression, see [Section 14.9, “InnoDB Table and Page Compression”](innodb-compression.html "14.9 InnoDB Table and Page Compression").
