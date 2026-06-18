#### 17.9.1.6 Compression for OLTP Workloads

Traditionally, the `InnoDB`
[compression](glossary.html#glos_compression "compression") feature was
recommended primarily for read-only or read-mostly
[workloads](glossary.html#glos_workload "workload"), such as in a
[data warehouse](glossary.html#glos_data_warehouse "data warehouse")
configuration. The rise of [SSD](glossary.html#glos_ssd "SSD")
storage devices, which are fast but relatively small and
expensive, makes compression attractive also for
`OLTP` workloads: high-traffic, interactive
websites can reduce their storage requirements and their I/O
operations per second ([IOPS](glossary.html#glos_iops "IOPS")) by
using compressed tables with applications that do frequent
[`INSERT`](insert.html "15.2.7 INSERT Statement"),
[`UPDATE`](update.html "15.2.17 UPDATE Statement"), and
[`DELETE`](delete.html "15.2.2 DELETE Statement") operations.

These configuration options let you adjust the way compression
works for a particular MySQL instance, with an emphasis on
performance and scalability for write-intensive operations:

* [`innodb_compression_level`](innodb-parameters.html#sysvar_innodb_compression_level)
  lets you turn the degree of compression up or down. A higher
  value lets you fit more data onto a storage device, at the
  expense of more CPU overhead during compression. A lower
  value lets you reduce CPU overhead when storage space is not
  critical, or you expect the data is not especially
  compressible.

* [`innodb_compression_failure_threshold_pct`](innodb-parameters.html#sysvar_innodb_compression_failure_threshold_pct)
  specifies a cutoff point for
  [compression
  failures](glossary.html#glos_compression_failure "compression failure") during updates to a compressed table. When
  this threshold is passed, MySQL begins to leave additional
  free space within each new compressed page, dynamically
  adjusting the amount of free space up to the percentage of
  page size specified by
  [`innodb_compression_pad_pct_max`](innodb-parameters.html#sysvar_innodb_compression_pad_pct_max)

* [`innodb_compression_pad_pct_max`](innodb-parameters.html#sysvar_innodb_compression_pad_pct_max)
  lets you adjust the maximum amount of space reserved within
  each [page](glossary.html#glos_page "page") to record changes
  to compressed rows, without needing to compress the entire
  page again. The higher the value, the more changes can be
  recorded without recompressing the page. MySQL uses a
  variable amount of free space for the pages within each
  compressed table, only when a designated percentage of
  compression operations
  “[fail](glossary.html#glos_compression_failure "compression failure")”
  at runtime, requiring an expensive operation to split the
  compressed page.

* [`innodb_log_compressed_pages`](innodb-parameters.html#sysvar_innodb_log_compressed_pages)
  lets you disable writing of images of
  [re-compressed](glossary.html#glos_compression "compression")
  [pages](glossary.html#glos_page "page") to the
  [redo log](glossary.html#glos_redo_log "redo log").
  Re-compression may occur when changes are made to compressed
  data. This option is enabled by default to prevent
  corruption that could occur if a different version of the
  `zlib` compression algorithm is used during
  recovery. If you are certain that the
  `zlib` version is not subject to change,
  disable
  [`innodb_log_compressed_pages`](innodb-parameters.html#sysvar_innodb_log_compressed_pages)
  to reduce redo log generation for workloads that modify
  compressed data.

Because working with compressed data sometimes involves keeping
both compressed and uncompressed versions of a page in memory at
the same time, when using compression with an OLTP-style
workload, be prepared to increase the value of the
[`innodb_buffer_pool_size`](innodb-parameters.html#sysvar_innodb_buffer_pool_size)
configuration option.