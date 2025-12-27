### 7.1.10 Server Status Variables

The MySQL server maintains many status variables that provide information about its operation. You can view these variables and their values by using the `SHOW [GLOBAL | SESSION] STATUS` statement (see  Section 15.7.7.37, “SHOW STATUS Statement”). The optional `GLOBAL` keyword aggregates the values over all connections, and `SESSION` shows the values for the current connection.

```
mysql> SHOW GLOBAL STATUS;
+-----------------------------------+------------+
| Variable_name                     | Value      |
+-----------------------------------+------------+
| Aborted_clients                   | 0          |
| Aborted_connects                  | 0          |
| Bytes_received                    | 155372598  |
| Bytes_sent                        | 1176560426 |
...
| Connections                       | 30023      |
| Created_tmp_disk_tables           | 0          |
| Created_tmp_files                 | 3          |
| Created_tmp_tables                | 2          |
...
| Threads_created                   | 217        |
| Threads_running                   | 88         |
| Uptime                            | 1389872    |
+-----------------------------------+------------+
```

Many status variables are reset to 0 by the `FLUSH STATUS` statement.

This section provides a description of each status variable. For a status variable summary, see Section 7.1.6, “Server Status Variable Reference”. For information about status variables specific to NDB Cluster, see Section 25.4.3.9.3, “NDB Cluster Status Variables”.

The status variables have the following meanings.

*  `Aborted_clients`

  The number of connections that were aborted because the client died without closing the connection properly. See Section B.3.2.9, “Communication Errors and Aborted Connections”.
*  `Aborted_connects`

  The number of failed attempts to connect to the MySQL server. See  Section B.3.2.9, “Communication Errors and Aborted Connections”.

  For additional connection-related information, check the `Connection_errors_xxx` status variables and the `host_cache` table.
*  `Authentication_ldap_sasl_supported_methods`

  The `authentication_ldap_sasl` plugin that implements SASL LDAP authentication supports multiple authentication methods, but depending on host system configuration, they might not all be available. The `Authentication_ldap_sasl_supported_methods` variable provides discoverability for the supported methods. Its value is a string consisting of supported method names separated by spaces. Example: `"SCRAM-SHA 1 SCRAM-SHA-256 GSSAPI"`
*  `Binlog_cache_disk_use`

  The number of transactions that used the temporary binary log cache but that exceeded the value of `binlog_cache_size` and used a temporary file to store statements from the transaction.

  The number of nontransactional statements that caused the binary log transaction cache to be written to disk is tracked separately in the `Binlog_stmt_cache_disk_use` status variable.
*  `Acl_cache_items_count`

  The number of cached privilege objects. Each object is the privilege combination of a user and its active roles.
*  `Binlog_cache_use`

  The number of transactions that used the binary log cache.
*  `Binlog_stmt_cache_disk_use`

  The number of nontransaction statements that used the binary log statement cache but that exceeded the value of `binlog_stmt_cache_size` and used a temporary file to store those statements.
*  `Binlog_stmt_cache_use`

  The number of nontransactional statements that used the binary log statement cache.
*  `Bytes_received`

  The number of bytes received from all clients.
*  `Bytes_sent`

  The number of bytes sent to all clients.
*  `Caching_sha2_password_rsa_public_key`

  The public key used by the `caching_sha2_password` authentication plugin for RSA key pair-based password exchange. The value is nonempty only if the server successfully initializes the private and public keys in the files named by the `caching_sha2_password_private_key_path` and `caching_sha2_password_public_key_path` system variables. The value of `Caching_sha2_password_rsa_public_key` comes from the latter file.
* `Com_xxx`

  The `Com_xxx` statement counter variables indicate the number of times each *`xxx`* statement has been executed. There is one status variable for each type of statement. For example, `Com_delete` and `Com_update` count `DELETE` and `UPDATE` statements, respectively. `Com_delete_multi` and `Com_update_multi` are similar but apply to `DELETE` and `UPDATE` statements that use multiple-table syntax.

  All `Com_stmt_xxx` variables are increased even if a prepared statement argument is unknown or an error occurred during execution. In other words, their values correspond to the number of requests issued, not to the number of requests successfully completed. For example, because status variables are initialized for each server startup and do not persist across restarts, the `Com_restart` and `Com_shutdown` variables that track `RESTART` and `SHUTDOWN` statements normally have a value of zero, but can be nonzero if `RESTART` or `SHUTDOWN` statements were executed but failed.

  The `Com_stmt_xxx` status variables are as follows:

  + `Com_stmt_prepare`
  + `Com_stmt_execute`
  + `Com_stmt_fetch`
  + `Com_stmt_send_long_data`
  + `Com_stmt_reset`
  + `Com_stmt_close`

  Those variables stand for prepared statement commands. Their names refer to the `COM_xxx` command set used in the network layer. In other words, their values increase whenever prepared statement API calls such as `mysql_stmt_prepare()`, `mysql_stmt_execute()`, and so forth are executed. However, `Com_stmt_prepare`, `Com_stmt_execute` and `Com_stmt_close` also increase for `PREPARE`, `EXECUTE`, or `DEALLOCATE PREPARE`, respectively. Additionally, the values of the older statement counter variables `Com_prepare_sql`, `Com_execute_sql`, and `Com_dealloc_sql` increase for the `PREPARE`, `EXECUTE`, and `DEALLOCATE PREPARE` statements. `Com_stmt_fetch` stands for the total number of network round-trips issued when fetching from cursors.

  `Com_stmt_reprepare` indicates the number of times statements were automatically reprepared by the server, for example, after metadata changes to tables or views referred to by the statement. A reprepare operation increments `Com_stmt_reprepare`, and also `Com_stmt_prepare`.

  `Com_explain_other` indicates the number of `EXPLAIN FOR CONNECTION` statements executed. See Section 10.8.4, “Obtaining Execution Plan Information for a Named Connection”.

  `Com_change_repl_filter` indicates the number of `CHANGE REPLICATION FILTER` statements executed.
*  `Compression`

  Whether the client connection uses compression in the client/server protocol.

  This status variable is deprecated; expect it to be removed in a future version of MySQL. See Configuring Legacy Connection Compression.
*  `Compression_algorithm`

  The name of the compression algorithm in use for the current connection to the server. The value can be any algorithm permitted in the value of the `protocol_compression_algorithms` system variable. For example, the value is `uncompressed` if the connection does not use compression, or `zlib` if the connection uses the `zlib` algorithm.

  For more information, see Section 6.2.8, “Connection Compression Control”.
*  `Compression_level`

  The compression level in use for the current connection to the server. The value is 6 for `zlib` connections (the default `zlib` algorithm compression level), 1 to 22 for `zstd` connections, and 0 for `uncompressed` connections.

  For more information, see Section 6.2.8, “Connection Compression Control”.
*  `Connection_errors_xxx`

  These variables provide information about errors that occur during the client connection process. They are global only and represent error counts aggregated across connections from all hosts. These variables track errors not accounted for by the host cache (see  Section 7.1.12.3, “DNS Lookups and the Host Cache”), such as errors that are not associated with TCP connections, occur very early in the connection process (even before an IP address is known), or are not specific to any particular IP address (such as out-of-memory conditions).

  +  `Connection_errors_accept`

    The number of errors that occurred during calls to `accept()` on the listening port.
  +  `Connection_errors_internal`

    The number of connections refused due to internal errors in the server, such as failure to start a new thread or an out-of-memory condition.
  +  `Connection_errors_max_connections`

    The number of connections refused because the server `max_connections` limit was reached.
  +  `Connection_errors_peer_address`

    The number of errors that occurred while searching for connecting client IP addresses.
  +  `Connection_errors_select`

    The number of errors that occurred during calls to `select()` or `poll()` on the listening port. (Failure of this operation does not necessarily means a client connection was rejected.)
  +  `Connection_errors_tcpwrap`

    The number of connections refused by the `libwrap` library.
*  `Connections`

  The number of connection attempts (successful or not) to the MySQL server.
*  `Created_tmp_disk_tables`

  The number of internal on-disk temporary tables created by the server while executing statements.

  You can compare the number of internal on-disk temporary tables created to the total number of internal temporary tables created by comparing `Created_tmp_disk_tables` and `Created_tmp_tables` values.

  ::: info Note

  Due to a known limitation, `Created_tmp_disk_tables` does not count on-disk temporary tables created in memory-mapped files. By default, the TempTable storage engine overflow mechanism creates internal temporary tables in memory-mapped files. This behavior is controlled by the `temptable_use_mmap` variable.

  :::

  See also  Section 10.4.4, “Internal Temporary Table Use in MySQL”.
*  `Created_tmp_files`

  How many temporary files  `mysqld` has created.
*  `Created_tmp_tables`

  The number of internal temporary tables created by the server while executing statements.

  You can compare the number of internal on-disk temporary tables created to the total number of internal temporary tables created by comparing `Created_tmp_disk_tables` and `Created_tmp_tables` values.

  See also  Section 10.4.4, “Internal Temporary Table Use in MySQL”.

  Each invocation of the `SHOW STATUS` statement uses an internal temporary table and increments the global `Created_tmp_tables` value.
*  `Current_tls_ca`

  The active  `ssl_ca` value in the SSL context that the server uses for new connections. This context value may differ from the current `ssl_ca` system variable value if the system variable has been changed but `ALTER INSTANCE RELOAD TLS` has not subsequently been executed to reconfigure the SSL context from the context-related system variable values and update the corresponding status variables. (This potential difference in values applies to each corresponding pair of context-related system and status variables. See Server-Side Runtime Configuration and Monitoring for Encrypted Connections.)

  The `Current_tls_xxx` status variable values are also available through the Performance Schema `tls_channel_status` table. See Section 29.12.22.9, “The `tls_channel_status` Table”.
*  `Current_tls_capath`

  The active  `ssl_capath` value in the TLS context that the server uses for new connections. For notes about the relationship between this status variable and its corresponding system variable, see the description of `Current_tls_ca`.
*  `Current_tls_cert`

  The active  `ssl_cert` value in the TLS context that the server uses for new connections. For notes about the relationship between this status variable and its corresponding system variable, see the description of `Current_tls_ca`.
*  `Current_tls_cipher`

  The active  `ssl_cipher` value in the TLS context that the server uses for new connections. For notes about the relationship between this status variable and its corresponding system variable, see the description of `Current_tls_ca`.
*  `Current_tls_ciphersuites`

  The active  `tls_ciphersuites` value in the TLS context that the server uses for new connections. For notes about the relationship between this status variable and its corresponding system variable, see the description of `Current_tls_ca`.
*  `Current_tls_crl`

  The active  `ssl_crl` value in the TLS context that the server uses for new connections. For notes about the relationship between this status variable and its corresponding system variable, see the description of `Current_tls_ca`.

  ::: info Note

  When you reload the TLS context, OpenSSL reloads the file containing the CRL (certificate revocation list) as part of the process. If the CRL file is large, the server allocates a large chunk of memory (ten times the file size), which is doubled while the new instance is being loaded and the old one has not yet been released. The process resident memory is not immediately reduced after a large allocation is freed, so if you issue the `ALTER INSTANCE RELOAD TLS` statement repeatedly with a large CRL file, the process resident memory usage may grow as a result of this.

  :::

*  `Current_tls_crlpath`

  The active  `ssl_crlpath` value in the TLS context that the server uses for new connections. For notes about the relationship between this status variable and its corresponding system variable, see the description of `Current_tls_ca`.
*  `Current_tls_key`

  The active  `ssl_key` value in the TLS context that the server uses for new connections. For notes about the relationship between this status variable and its corresponding system variable, see the description of `Current_tls_ca`.
*  `Current_tls_version`

  The active  `tls_version` value in the TLS context that the server uses for new connections. For notes about the relationship between this status variable and its corresponding system variable, see the description of `Current_tls_ca`.
*  `Delayed_errors`

  This status variable is deprecated (because `DELAYED` inserts are not supported); expect it to be removed in a future release.
*  `Delayed_insert_threads`

  This status variable is deprecated (because `DELAYED` inserts are not supported); expect it to be removed in a future release.
*  `Delayed_writes`

  This status variable is deprecated (because `DELAYED` inserts are not supported); expect it to be removed in a future release.
*  `Deprecated_use_i_s_processlist_count`

  How many times the `information_schema.processlist` table has been accessed since the last restart.
*  `Deprecated_use_i_s_processlist_last_timestamp`

  A timestamp indicating the last time the `information_schema.processlist` table has been accessed since the last restart. Shows microseconds since the Unix Epoch.
*  `dragnet.Status`

  The result of the most recent assignment to the `dragnet.log_error_filter_rules` system variable, empty if no such assignment has occurred.
*  `Error_log_buffered_bytes`

  The number of bytes currently used in the Performance Schema `error_log` table. It is possible for the value to decrease, for example, if a new event cannot fit until discarding an old event, but the new event is smaller than the old one.
*  `Error_log_buffered_events`

  The number of events currently present in the Performance Schema  `error_log` table. As with `Error_log_buffered_bytes`, it is possible for the value to decrease.
*  `Error_log_expired_events`

  The number of events discarded from the Performance Schema `error_log` table to make room for new events.
*  `Error_log_latest_write`

  The time of the last write to the Performance Schema `error_log` table.
*  `Flush_commands`

  The number of times the server flushes tables, whether because a user executed a  `FLUSH TABLES` statement or due to internal server operation. It is also incremented by receipt of a `COM_REFRESH` packet. This is in contrast to `Com_flush`, which indicates how many `FLUSH` statements have been executed, whether `FLUSH TABLES`,  `FLUSH LOGS`, and so forth.
*  `Global_connection_memory`

  The memory used by all user connections to the server. Memory used by system threads or by the MySQL root account is included in the total, but such threads or users are not subject to disconnection due to memory usage. This memory is not calculated unless `global_connection_memory_tracking` is enabled (disabled by default). The Performance Schema must also be enabled.

  You can control (indirectly) the frequency with which this variable is updated by setting `connection_memory_chunk_size`.
*  `Handler_commit`

  The number of internal  `COMMIT` statements.
*  `Handler_delete`

  The number of times that rows have been deleted from tables.
*  `Handler_external_lock`

  The server increments this variable for each call to its `external_lock()` function, which generally occurs at the beginning and end of access to a table instance. There might be differences among storage engines. This variable can be used, for example, to discover for a statement that accesses a partitioned table how many partitions were pruned before locking occurred: Check how much the counter increased for the statement, subtract 2 (2 calls for the table itself), then divide by 2 to get the number of partitions locked.
*  `Handler_mrr_init`

  The number of times the server uses a storage engine's own Multi-Range Read implementation for table access.
*  `Handler_prepare`

  A counter for the prepare phase of two-phase commit operations.
*  `Handler_read_first`

  The number of times the first entry in an index was read. If this value is high, it suggests that the server is doing a lot of full index scans (for example, `SELECT col1 FROM foo`, assuming that `col1` is indexed).
*  `Handler_read_key`

  The number of requests to read a row based on a key. If this value is high, it is a good indication that your tables are properly indexed for your queries.
*  `Handler_read_last`

  The number of requests to read the last key in an index. With `ORDER BY`, the server issues a first-key request followed by several next-key requests, whereas with `ORDER BY DESC`, the server issues a last-key request followed by several previous-key requests.
*  `Handler_read_next`

  The number of requests to read the next row in key order. This value is incremented if you are querying an index column with a range constraint or if you are doing an index scan.
*  `Handler_read_prev`

  The number of requests to read the previous row in key order. This read method is mainly used to optimize `ORDER BY ... DESC`.
*  `Handler_read_rnd`

  The number of requests to read a row based on a fixed position. This value is high if you are doing a lot of queries that require sorting of the result. You probably have a lot of queries that require MySQL to scan entire tables or you have joins that do not use keys properly.
*  `Handler_read_rnd_next`

  The number of requests to read the next row in the data file. This value is high if you are doing a lot of table scans. Generally this suggests that your tables are not properly indexed or that your queries are not written to take advantage of the indexes you have.
*  `Handler_rollback`

  The number of requests for a storage engine to perform a rollback operation.
*  `Handler_savepoint`

  The number of requests for a storage engine to place a savepoint.
*  `Handler_savepoint_rollback`

  The number of requests for a storage engine to roll back to a savepoint.
*  `Handler_update`

  The number of requests to update a row in a table.
*  `Handler_write`

  The number of requests to insert a row in a table.
*  `Innodb_buffer_pool_dump_status`

  The progress of an operation to record the pages held in the `InnoDB` buffer pool, triggered by the setting of `innodb_buffer_pool_dump_at_shutdown` or `innodb_buffer_pool_dump_now`.

  For related information and examples, see Section 17.8.3.6, “Saving and Restoring the Buffer Pool State”.
*  `Innodb_buffer_pool_load_status`

  The progress of an operation to warm up the `InnoDB` buffer pool by reading in a set of  pages corresponding to an earlier point in time, triggered by the setting of `innodb_buffer_pool_load_at_startup` or `innodb_buffer_pool_load_now`. If the operation introduces too much overhead, you can cancel it by setting `innodb_buffer_pool_load_abort`.

  For related information and examples, see Section 17.8.3.6, “Saving and Restoring the Buffer Pool State”.
*  `Innodb_buffer_pool_bytes_data`

  The total number of bytes in the `InnoDB` buffer pool containing data. The number includes both dirty and clean pages. For more accurate memory usage calculations than with `Innodb_buffer_pool_pages_data`, when  compressed tables cause the buffer pool to hold pages of different sizes.
*  `Innodb_buffer_pool_pages_data`

  The number of  pages in the `InnoDB` buffer pool containing data. The number includes both dirty and clean pages. When using compressed tables, the reported `Innodb_buffer_pool_pages_data` value may be larger than `Innodb_buffer_pool_pages_total` (Bug #59550).
*  `Innodb_buffer_pool_bytes_dirty`

  The total current number of bytes held in dirty pages in the `InnoDB` buffer pool. For more accurate memory usage calculations than with `Innodb_buffer_pool_pages_dirty`, when  compressed tables cause the buffer pool to hold pages of different sizes.
*  `Innodb_buffer_pool_pages_dirty`

  The current number of dirty pages in the `InnoDB` buffer pool.
*  `Innodb_buffer_pool_pages_flushed`

  The number of requests to flush pages from the `InnoDB` buffer pool.
*  `Innodb_buffer_pool_pages_free`

  The number of free  pages in the `InnoDB` buffer pool.
*  `Innodb_buffer_pool_pages_latched`

  The number of latched  pages in the `InnoDB` buffer pool. These are pages currently being read or written, or that cannot be flushed or removed for some other reason. Calculation of this variable is expensive, so it is available only when the `UNIV_DEBUG` system is defined at server build time.
*  `Innodb_buffer_pool_pages_misc`

  The number of  pages in the `InnoDB` buffer pool that are busy because they have been allocated for administrative overhead, such as row locks or the adaptive hash index. This value can also be calculated as `Innodb_buffer_pool_pages_total` − `Innodb_buffer_pool_pages_free` − `Innodb_buffer_pool_pages_data`. When using compressed tables, `Innodb_buffer_pool_pages_misc` may report an out-of-bounds value (Bug #59550).
*  `Innodb_buffer_pool_pages_total`

  The total size of the `InnoDB` buffer pool, in pages. When using compressed tables, the reported `Innodb_buffer_pool_pages_data` value may be larger than `Innodb_buffer_pool_pages_total` (Bug #59550)
*  `Innodb_buffer_pool_read_ahead`

  The number of  pages read into the `InnoDB` buffer pool by the read-ahead background thread.
*  `Innodb_buffer_pool_read_ahead_evicted`

  The number of  pages read into the `InnoDB` buffer pool by the read-ahead background thread that were subsequently evicted without having been accessed by queries.
*  `Innodb_buffer_pool_read_ahead_rnd`

  The number of “random” read-aheads initiated by `InnoDB`. This happens when a query scans a large portion of a table but in random order.
*  `Innodb_buffer_pool_read_requests`

  The number of logical read requests.
*  `Innodb_buffer_pool_reads`

  The number of logical reads that `InnoDB` could not satisfy from the buffer pool, and had to read directly from disk.
*  `Innodb_buffer_pool_resize_status`

  The status of an operation to resize the `InnoDB` buffer pool dynamically, triggered by setting the `innodb_buffer_pool_size` parameter dynamically. The `innodb_buffer_pool_size` parameter is dynamic, which allows you to resize the buffer pool without restarting the server. See Configuring InnoDB Buffer Pool Size Online for related information.
*  `Innodb_buffer_pool_resize_status_code`

  Reports status codes for tracking online buffer pool resizing operations. Each status code represents a stage in a resizing operation. Status codes include:

  + 0: No Resize operation in progress
  + 1: Starting Resize
  + 2: Disabling AHI (Adaptive Hash Index)
  + 3: Withdrawing Blocks
  + 4: Acquiring Global Lock
  + 5: Resizing Pool
  + 6: Resizing Hash
  + 7: Resizing Failed

  You can use this status variable in conjunction with `Innodb_buffer_pool_resize_status_progress` to track the progress of each stage of a resizing operation. The `Innodb_buffer_pool_resize_status_progress` variable reports a percentage value indicating the progress of the current stage.

  For more information, see Monitoring Online Buffer Pool Resizing Progress.
*  `Innodb_buffer_pool_resize_status_progress`

  Reports a percentage value indicating the progress of the current stage of an online buffer pool resizing operation. This variable is used in conjunction with `Innodb_buffer_pool_resize_status_code`, which reports a status code indicating the current stage of an online buffer pool resizing operation.

  The percentage value is updated after each buffer pool instance is processed. As the status code (reported by `Innodb_buffer_pool_resize_status_code`) changes from one status to another, the percentage value is reset to 0.

  For related information, see Monitoring Online Buffer Pool Resizing Progress.
*  `Innodb_buffer_pool_wait_free`

  Normally, writes to the `InnoDB` buffer pool happen in the background. When `InnoDB` needs to read or create a  page and no clean pages are available, `InnoDB` flushes some dirty pages first and waits for that operation to finish. This counter counts instances of these waits. If `innodb_buffer_pool_size` has been set properly, this value should be small.
*  `Innodb_buffer_pool_write_requests`

  The number of writes done to the `InnoDB` buffer pool.
*  `Innodb_data_fsyncs`

  The number of `fsync()` operations so far. The frequency of `fsync()` calls is influenced by the setting of the `innodb_flush_method` configuration option.

  Counts the number of `fdatasync()` operations if  `innodb_use_fdatasync` is enabled.
*  `Innodb_data_pending_fsyncs`

  The current number of pending `fsync()` operations. The frequency of `fsync()` calls is influenced by the setting of the `innodb_flush_method` configuration option.
*  `Innodb_data_pending_reads`

  The current number of pending reads.
*  `Innodb_data_pending_writes`

  The current number of pending writes.
*  `Innodb_data_read`

  The amount of data read since the server was started (in bytes).
*  `Innodb_data_reads`

  The total number of data reads (OS file reads).
*  `Innodb_data_writes`

  The total number of data writes.
*  `Innodb_data_written`

  The amount of data written so far, in bytes.
*  `Innodb_dblwr_pages_written`

  The number of  pages that have been written to the doublewrite buffer. See  Section 17.11.1, “InnoDB Disk I/O”.
*  `Innodb_dblwr_writes`

  The number of doublewrite operations that have been performed. See  Section 17.11.1, “InnoDB Disk I/O”.
*  `Innodb_have_atomic_builtins`

  Indicates whether the server was built with atomic instructions.
*  `Innodb_log_waits`

  The number of times that the log buffer was too small and a  wait was required for it to be  flushed before continuing.
*  `Innodb_log_write_requests`

  The number of write requests for the `InnoDB` redo log.
*  `Innodb_log_writes`

  The number of physical writes to the `InnoDB` redo log file.
*  `Innodb_num_open_files`

  The number of files `InnoDB` currently holds open.
*  `Innodb_os_log_fsyncs`

  The number of `fsync()` writes done to the `InnoDB` redo log files.
*  `Innodb_os_log_pending_fsyncs`

  The number of pending `fsync()` operations for the `InnoDB` redo log files.
*  `Innodb_os_log_pending_writes`

  The number of pending writes to the `InnoDB` redo log files.
*  `Innodb_os_log_written`

  The number of bytes written to the `InnoDB` redo log files.
*  `Innodb_page_size`

  `InnoDB` page size (default 16KB). Many values are counted in pages; the page size enables them to be easily converted to bytes.
*  `Innodb_pages_created`

  The number of pages created by operations on `InnoDB` tables.
*  `Innodb_pages_read`

  The number of pages read from the `InnoDB` buffer pool by operations on `InnoDB` tables.
*  `Innodb_pages_written`

  The number of pages written by operations on `InnoDB` tables.
*  `Innodb_redo_log_enabled`

  Whether redo logging is enabled or disabled. See Disabling Redo Logging.
*  `Innodb_redo_log_capacity_resized`

  The total redo log capacity for all redo log files, in bytes, after the last completed capacity resize operation. The value includes ordinary and spare redo log files.

  If there is no pending resize down operation, `Innodb_redo_log_capacity_resized` should be equal to the `innodb_redo_log_capacity` setting if it's used, or it's (`innodb_log_files_in_group`, `innodb_log_file_size`) if those are used instead. See the `innodb_redo_log_capacity` documentation for further clarification. Resize up operations are instantaneous.

  For related information, see Section 17.6.5, “Redo Log”.
*  `Innodb_redo_log_checkpoint_lsn`

  The redo log checkpoint LSN. For related information, see Section 17.6.5, “Redo Log”.
*  `Innodb_redo_log_current_lsn`

  The current LSN represents the last written position in the redo log buffer. `InnoDB` writes data to the redo log buffer inside the MySQL process before requesting that the operating system write the data to the current redo log file. For related information, see Section 17.6.5, “Redo Log”.
*  `Innodb_redo_log_flushed_to_disk_lsn`

  The flushed-to-disk LSN. `InnoDB` first writes data to the redo log and then requests that the operating system flush the data to disk. The flushed-to-disk LSN represents the last position in the redo log that `InnoDB` knows has been flushed to disk. For related information, see  Section 17.6.5, “Redo Log”.
*  `Innodb_redo_log_logical_size`

  A data size value, in bytes, representing the LSN range containing in-use redo log data, spanning from the oldest block required by redo log consumers to the latest written block. For related information, see Section 17.6.5, “Redo Log”.
*  `Innodb_redo_log_physical_size`

  The amount of disk space in bytes currently consumed by all redo log files on disk, excluding spare redo log files. For related information, see  Section 17.6.5, “Redo Log”.
*  `Innodb_redo_log_read_only`

  Whether the redo log is read-only.
*  `Innodb_redo_log_resize_status`

  The redo log resize status indicating the current state of the redo log capacity resize mechanism. Possible values include:

  + `OK`: There are no issues and no pending redo log capacity resize operations.
  + `Resizing down`: A resize down operation is in progress.

  A resize up operation is instantaneous and therefore has no pending status.
*  `Innodb_redo_log_uuid`

  The redo log UUID.
*  `Innodb_row_lock_current_waits`

  The number of  row locks currently waited for by operations on `InnoDB` tables.
*  `Innodb_row_lock_time`

  The total time spent in acquiring row locks for `InnoDB` tables, in milliseconds.
*  `Innodb_row_lock_time_avg`

  The average time to acquire a row lock for `InnoDB` tables, in milliseconds.
*  `Innodb_row_lock_time_max`

  The maximum time to acquire a row lock for `InnoDB` tables, in milliseconds.
*  `Innodb_row_lock_waits`

  The number of times operations on `InnoDB` tables had to wait for a row lock.
*  `Innodb_rows_deleted`

  The number of rows deleted from `InnoDB` tables.
*  `Innodb_rows_inserted`

  The number of rows inserted into `InnoDB` tables.
*  `Innodb_rows_read`

  The number of rows read from `InnoDB` tables.
*  `Innodb_rows_updated`

  The estimated number of rows updated in `InnoDB` tables.

  ::: info Note

  This value is not meant to be 100% accurate. For an accurate (but more expensive) result, use `ROW_COUNT()`.

  :::
  
*  `Innodb_system_rows_deleted`

  The number of rows deleted from `InnoDB` tables belonging to system-created schemas.
*  `Innodb_system_rows_inserted`

  The number of rows inserted into `InnoDB` tables belonging to system-created schemas.
*  `Innodb_system_rows_updated`

  The number of rows updated in `InnoDB` tables belonging to system-created schemas.
*  `Innodb_system_rows_read`

  The number of rows read from `InnoDB` tables belonging to system-created schemas.
*  `Innodb_truncated_status_writes`

  The number of times output from the `SHOW ENGINE INNODB STATUS` statement has been truncated.
*  `Innodb_undo_tablespaces_active`

  The number of active undo tablespaces. Includes both implicit (`InnoDB`-created) and explicit (user-created) undo tablespaces. For information about undo tablespaces, see  Section 17.6.3.4, “Undo Tablespaces”.
*  `Innodb_undo_tablespaces_explicit`

  The number of user-created undo tablespaces. For information about undo tablespaces, see Section 17.6.3.4, “Undo Tablespaces”.
*  `Innodb_undo_tablespaces_implicit`

  The number of undo tablespaces created by `InnoDB`. Two default undo tablespaces are created by `InnoDB` when the MySQL instance is initialized. For information about undo tablespaces, see Section 17.6.3.4, “Undo Tablespaces”.
*  `Innodb_undo_tablespaces_total`

  The total number of undo tablespaces. Includes both implicit (`InnoDB`-created) and explicit (user-created) undo tablespaces, active and inactive. For information about undo tablespaces, see Section 17.6.3.4, “Undo Tablespaces”.
*  `Key_blocks_not_flushed`

  The number of key blocks in the `MyISAM` key cache that have changed but have not yet been flushed to disk.
*  `Key_blocks_unused`

  The number of unused blocks in the `MyISAM` key cache. You can use this value to determine how much of the key cache is in use; see the discussion of `key_buffer_size` in Section 7.1.8, “Server System Variables”.
*  `Key_blocks_used`

  The number of used blocks in the `MyISAM` key cache. This value is a high-water mark that indicates the maximum number of blocks that have ever been in use at one time.
*  `Key_read_requests`

  The number of requests to read a key block from the `MyISAM` key cache.
*  `Key_reads`

  The number of physical reads of a key block from disk into the `MyISAM` key cache. If `Key_reads` is large, then your  `key_buffer_size` value is probably too small. The cache miss rate can be calculated as `Key_reads`/ `Key_read_requests`.
*  `Key_write_requests`

  The number of requests to write a key block to the `MyISAM` key cache.
*  `Key_writes`

  The number of physical writes of a key block from the `MyISAM` key cache to disk.
*  `Last_query_cost`

  The total cost of the last compiled query as computed by the query optimizer. This is useful for comparing the cost of different query plans for the same query. The default value of 0 means that no query has been compiled yet. The default value is 0. `Last_query_cost` has session scope.

  This variable shows the cost of queries that have multiple query blocks, summing the cost estimates of each query block, estimating how many times non-cacheable subqueries are executed, and multiplying the cost of those query blocks by the number of subquery executions.
*  `Last_query_partial_plans`

  The number of iterations the query optimizer made in execution plan construction for the previous query.

  `Last_query_partial_plans` has session scope.
*  `Locked_connects`

  The number of attempts to connect to locked user accounts. For information about account locking and unlocking, see Section 8.2.20, “Account Locking”.
*  `Max_execution_time_exceeded`

  The number of  `SELECT` statements for which the execution timeout was exceeded.
*  `Max_execution_time_set`

  The number of  `SELECT` statements for which a nonzero execution timeout was set. This includes statements that include a nonzero `MAX_EXECUTION_TIME` optimizer hint, and statements that include no such hint but execute while the timeout indicated by the `max_execution_time` system variable is nonzero.
*  `Max_execution_time_set_failed`

  The number of  `SELECT` statements for which the attempt to set an execution timeout failed.
*  `Max_used_connections`

  The maximum number of connections that have been in use simultaneously since the server started.
*  `Max_used_connections_time`

  The time at which `Max_used_connections` reached its current value.
*  `Not_flushed_delayed_rows`

  This status variable is deprecated (because `DELAYED` inserts are not supported); expect it to be removed in a future release.
*  `mecab_charset`

  The character set currently used by the MeCab full-text parser plugin. For related information, see Section 14.9.9, “MeCab Full-Text Parser Plugin”.
*  `Ongoing_anonymous_transaction_count`

  Shows the number of ongoing transactions which have been marked as anonymous. This can be used to ensure that no further transactions are waiting to be processed.
*  `Ongoing_anonymous_gtid_violating_transaction_count`

  This status variable is only available in debug builds. Shows the number of ongoing transactions which use `gtid_next=ANONYMOUS` and that violate GTID consistency.
*  `Ongoing_automatic_gtid_violating_transaction_count`

  This status variable is only available in debug builds. Shows the number of ongoing transactions which use `gtid_next=AUTOMATIC` and that violate GTID consistency.
*  `Open_files`

  The number of files that are open. This count includes regular files opened by the server. It does not include other types of files such as sockets or pipes. Also, the count does not include files that storage engines open using their own internal functions rather than asking the server level to do so.
*  `Open_streams`

  The number of streams that are open (used mainly for logging).
*  `Open_table_definitions`

  The number of cached table definitions.
*  `Open_tables`

  The number of tables that are open.
*  `Opened_files`

  The number of files that have been opened with `my_open()` (a `mysys` library function). Parts of the server that open files without using this function do not increment the count.
*  `Opened_table_definitions`

  The number of table definitions that have been cached.
*  `Opened_tables`

  The number of tables that have been opened. If `Opened_tables` is big, your `table_open_cache` value is probably too small.
* `Performance_schema_xxx`

  Performance Schema status variables are listed in Section 29.16, “Performance Schema Status Variables”. These variables provide information about instrumentation that could not be loaded or created due to memory constraints.
*  `Prepared_stmt_count`

  The current number of prepared statements. (The maximum number of statements is given by the `max_prepared_stmt_count` system variable.)
*  `Queries`

  The number of statements executed by the server. This variable includes statements executed within stored programs, unlike the  `Questions` variable. It does not count `COM_PING` or `COM_STATISTICS` commands.

  The discussion at the beginning of this section indicates how to relate this statement-counting status variable to other such variables.
*  `Questions`

  The number of statements executed by the server. This includes only statements sent to the server by clients and not statements executed within stored programs, unlike the `Queries` variable. This variable does not count `COM_PING`, `COM_STATISTICS`, `COM_STMT_PREPARE`, `COM_STMT_CLOSE`, or `COM_STMT_RESET` commands.

  The discussion at the beginning of this section indicates how to relate this statement-counting status variable to other such variables.
*  `Replica_open_temp_tables`

   `Replica_open_temp_tables` shows the number of temporary tables that the replication SQL thread currently has open. If the value is greater than zero, it is not safe to shut down the replica; see Section 19.5.1.31, “Replication and Temporary Tables”. This variable reports the total count of open temporary tables for *all* replication channels.
*  `Resource_group_supported`

  Indicates whether the resource group feature is supported.

  On some platforms or MySQL server configurations, resource groups are unavailable or have limitations. In particular, Linux systems might require a manual step for some installation methods. For details, see Resource Group Restrictions.
*  `Rpl_semi_sync_master_clients`

  The number of semisynchronous replicas.

  Deprecated synonym for `Rpl_semi_sync_source_clients`.
*  `Rpl_semi_sync_master_net_avg_wait_time`

  Deprecated synonym for `Rpl_semi_sync_source_net_avg_wait_time`.
*  `Rpl_semi_sync_master_net_wait_time`

  Deprecated synonym for `Rpl_semi_sync_source_net_wait_time`.
*  `Rpl_semi_sync_master_net_waits`

  The total number of times the source waited for replica replies.

  Deprecated synonym for `Rpl_semi_sync_source_net_waits`.
*  `Rpl_semi_sync_master_no_times`

  Deprecated synonym for `Rpl_semi_sync_source_no_times`.
*  `Rpl_semi_sync_master_no_tx`

  Deprecated synonym for `Rpl_semi_sync_source_no_tx`.
*  `Rpl_semi_sync_master_status`

  Deprecated synonym for `Rpl_semi_sync_source_status`.
*  `Rpl_semi_sync_master_timefunc_failures`

  Deprecated synonym for `Rpl_semi_sync_source_timefunc_failures`.
*  `Rpl_semi_sync_master_tx_avg_wait_time`

  Deprecated synonym for `Rpl_semi_sync_source_tx_avg_wait_time`.
*  `Rpl_semi_sync_master_tx_wait_time`

  Deprecated synonym for `Rpl_semi_sync_source_tx_wait_time`.
*  `Rpl_semi_sync_master_tx_waits`

  Deprecated synonym for `Rpl_semi_sync_source_tx_waits`.
*  `Rpl_semi_sync_master_wait_pos_backtraverse`

  Deprecated synonym for `Rpl_semi_sync_source_wait_pos_backtraverse`.
*  `Rpl_semi_sync_master_wait_sessions`

  Deprecated synonym for `Rpl_semi_sync_source_wait_sessions`.
*  `Rpl_semi_sync_master_yes_tx`

  Deprecated synonym for `Rpl_semi_sync_source_yes_tx`.
*  `Rpl_semi_sync_source_clients`

  The number of semisynchronous replicas.

  Available when the `rpl_semi_sync_source` plugin (`semisync_source.so` library) is installed on the source.
*  `Rpl_semi_sync_source_net_avg_wait_time`

  The average time in microseconds the source waited for a replica reply. This variable is always `0`, and is deprecated; expect it to be removed in a future version.

  Available when the `rpl_semi_sync_source` plugin (`semisync_source.so` library) is installed on the source.
*  `Rpl_semi_sync_source_net_wait_time`

  The total time in microseconds the source waited for replica replies. This variable is always `0`, and is deprecated; expect it to be removed in a future version.

  Available when the `rpl_semi_sync_source` plugin (`semisync_source.so` library) is installed on the source.
*  `Rpl_semi_sync_source_net_waits`

  The total number of times the source waited for replica replies.

  Available when the `rpl_semi_sync_source` plugin (`semisync_source.so` library) is installed on the source.
*  `Rpl_semi_sync_source_no_times`

  The number of times the source turned off semisynchronous replication.

  Available when the `rpl_semi_sync_source` plugin (`semisync_source.so` library) is installed on the source.
*  `Rpl_semi_sync_source_no_tx`

  The number of commits that were not acknowledged successfully by a replica.

  Available when the `rpl_semi_sync_source` plugin (`semisync_source.so` library) is installed on the source.
*  `Rpl_semi_sync_source_status`

  Whether semisynchronous replication currently is operational on the source. The value is `ON` if the plugin has been enabled and a commit acknowledgment has occurred. It is `OFF` if the plugin is not enabled or the source has fallen back to asynchronous replication due to commit acknowledgment timeout.

  Available when the `rpl_semi_sync_source` plugin (`semisync_source.so` library) is installed on the source.
*  `Rpl_semi_sync_source_timefunc_failures`

  The number of times the source failed when calling time functions such as `gettimeofday()`.

  Available when the `rpl_semi_sync_source` plugin (`semisync_source.so` library) is installed on the source.
*  `Rpl_semi_sync_source_tx_avg_wait_time`

  The average time in microseconds the source waited for each transaction.

  Available when the `rpl_semi_sync_source` plugin (`semisync_source.so` library) is installed on the source.
*  `Rpl_semi_sync_source_tx_wait_time`

  The total time in microseconds the source waited for transactions.

  Available when the `rpl_semi_sync_source` plugin (`semisync_source.so` library) is installed on the source.
*  `Rpl_semi_sync_source_tx_waits`

  The total number of times the source waited for transactions.

  Available when the `rpl_semi_sync_source` plugin (`semisync_source.so` library) is installed on the source.
*  `Rpl_semi_sync_source_wait_pos_backtraverse`

  The total number of times the source waited for an event with binary coordinates lower than events waited for previously. This can occur when the order in which transactions start waiting for a reply is different from the order in which their binary log events are written.

  Available when the `rpl_semi_sync_source` plugin (`semisync_source.so` library) is installed on the source.
*  `Rpl_semi_sync_source_wait_sessions`

  The number of sessions currently waiting for replica replies.

  Available when the `rpl_semi_sync_source` plugin (`semisync_source.so` library) is installed on the source.
*  `Rpl_semi_sync_source_yes_tx`

  The number of commits that were acknowledged successfully by a replica.

  Available when the `rpl_semi_sync_source` plugin (`semisync_source.so` library) is installed on the source.
*  `Rpl_semi_sync_replica_status`

  Shows whether semisynchronous replication is currently operational on the replica. This is `ON` if the plugin has been enabled and the replication I/O (receiver) thread is running, `OFF` otherwise.

  Available when the `rpl_semi_sync_source` plugin (`semisync_source.so` library) is installed on the source.
*  `Rpl_semi_sync_slave_status`

  Deprecated synonym for `Rpl_semi_sync_replica_status`.
*  `Rsa_public_key`

  The value of this variable is the public key used by the `sha256_password` (deprecated) authentication plugin for RSA key pair-based password exchange. The value is nonempty only if the server successfully initializes the private and public keys in the files named by the `sha256_password_private_key_path` and `sha256_password_public_key_path` system variables. The value of `Rsa_public_key` comes from the latter file.

  For information about `sha256_password`, see Section 8.4.1.3, “SHA-256 Pluggable Authentication”.
*  `Secondary_engine_execution_count`

  For use with MySQL HeatWave only. See Status Variables, for more information.
*  `Select_full_join`

  The number of joins that perform table scans because they do not use indexes. If this value is not 0, you should carefully check the indexes of your tables.
*  `Select_full_range_join`

  The number of joins that used a range search on a reference table.
*  `Select_range`

  The number of joins that used ranges on the first table. This is normally not a critical issue even if the value is quite large.
*  `Select_range_check`

  The number of joins without keys that check for key usage after each row. If this is not 0, you should carefully check the indexes of your tables.
*  `Select_scan`

  The number of joins that did a full scan of the first table.
*  `Slave_open_temp_tables`

  Deprecated alias for `Replica_open_temp_tables`.
*  `Slave_rows_last_search_algorithm_used`

  Deprecated alias for `Replica_rows_last_search_algorithm_used`.
*  `Slow_launch_threads`

  The number of threads that have taken more than `slow_launch_time` seconds to create.
*  `Slow_queries`

  The number of queries that have taken more than `long_query_time` seconds. This counter increments regardless of whether the slow query log is enabled. For information about that log, see Section 7.4.5, “The Slow Query Log”.
*  `Sort_merge_passes`

  The number of merge passes that the sort algorithm has had to do. If this value is large, you should consider increasing the value of the  `sort_buffer_size` system variable.
*  `Sort_range`

  The number of sorts that were done using ranges.
*  `Sort_rows`

  The number of sorted rows.
*  `Sort_scan`

  The number of sorts that were done by scanning the table.
*  `Ssl_accept_renegotiates`

  The number of negotiates needed to establish the connection.
*  `Ssl_accepts`

  The number of accepted SSL connections.
*  `Ssl_callback_cache_hits`

  The number of callback cache hits.
*  `Ssl_cipher`

  The current encryption cipher (empty for unencrypted connections).
*  `Ssl_cipher_list`

  The list of possible SSL ciphers (empty for non-SSL connections). If MySQL supports TLSv1.3, the value includes the possible TLSv1.3 ciphersuites. See Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.
*  `Ssl_client_connects`

  The number of SSL connection attempts to an SSL-enabled replication source server.
*  `Ssl_connect_renegotiates`

  The number of negotiates needed to establish the connection to an SSL-enabled replication source server.
*  `Ssl_ctx_verify_depth`

  The SSL context verification depth (how many certificates in the chain are tested).
*  `Ssl_ctx_verify_mode`

  The SSL context verification mode.
*  `Ssl_default_timeout`

  The default SSL timeout.
*  `Ssl_finished_accepts`

  The number of successful SSL connections to the server.
*  `Ssl_finished_connects`

  The number of successful replica connections to an SSL-enabled replication source server.
*  `Ssl_server_not_after`

  The last date for which the SSL certificate is valid. To check SSL certificate expiration information, use this statement:

  ```
  mysql> SHOW STATUS LIKE 'Ssl_server_not%';
  +-----------------------+--------------------------+
  | Variable_name         | Value                    |
  +-----------------------+--------------------------+
  | Ssl_server_not_after  | Apr 28 14:16:39 2025 GMT |
  | Ssl_server_not_before | May  1 14:16:39 2015 GMT |
  +-----------------------+--------------------------+
  ```
*  `Ssl_server_not_before`

  The first date for which the SSL certificate is valid.
*  `Ssl_session_cache_hits`

  The number of SSL session cache hits.
*  `Ssl_session_cache_misses`

  The number of SSL session cache misses.
*  `Ssl_session_cache_mode`

  The SSL session cache mode. When the value of the `ssl_session_cache_mode` server variable is `ON`, the value of the `Ssl_session_cache_mode` status variable is `SERVER`.
*  `Ssl_session_cache_overflows`

  The number of SSL session cache overflows.
*  `Ssl_session_cache_size`

  The SSL session cache size.
*  `Ssl_session_cache_timeout`

  The timeout value in seconds of SSL sessions in the cache.
*  `Ssl_session_cache_timeouts`

  The number of SSL session cache timeouts.
*  `Ssl_sessions_reused`

  This is equal to 0 if TLS was not used in the current MySQL session, or if a TLS session has not been reused; otherwise it is equal to 1.

  `Ssl_sessions_reused` has session scope.
*  `Ssl_used_session_cache_entries`

  How many SSL session cache entries were used.
*  `Ssl_verify_depth`

  The verification depth for replication SSL connections.
*  `Ssl_verify_mode`

  The verification mode used by the server for a connection that uses SSL. The value is a bitmask; bits are defined in the `openssl/ssl.h` header file:

  ```
  # define SSL_VERIFY_NONE                 0x00
  # define SSL_VERIFY_PEER                 0x01
  # define SSL_VERIFY_FAIL_IF_NO_PEER_CERT 0x02
  # define SSL_VERIFY_CLIENT_ONCE          0x04
  ```

  `SSL_VERIFY_PEER` indicates that the server asks for a client certificate. If the client supplies one, the server performs verification and proceeds only if verification is successful. `SSL_VERIFY_CLIENT_ONCE` indicates that a request for the client certificate is performed only in the initial handshake.
*  `Ssl_version`

  The SSL protocol version of the connection (for example, TLSv1.2). If the connection is not encrypted, the value is empty.
*  `Table_locks_immediate`

  The number of times that a request for a table lock could be granted immediately.
*  `Table_locks_waited`

  The number of times that a request for a table lock could not be granted immediately and a wait was needed. If this is high and you have performance problems, you should first optimize your queries, and then either split your table or tables or use replication.
*  `Table_open_cache_hits`

  The number of hits for open tables cache lookups.
*  `Table_open_cache_misses`

  The number of misses for open tables cache lookups.
*  `Table_open_cache_overflows`

  The number of overflows for the open tables cache. This is the number of times, after a table is opened or closed, a cache instance has an unused entry and the size of the instance is larger than  `table_open_cache` /  `table_open_cache_instances`.
*  `Tc_log_max_pages_used`

  For the memory-mapped implementation of the log that is used by  `mysqld` when it acts as the transaction coordinator for recovery of internal XA transactions, this variable indicates the largest number of pages used for the log since the server started. If the product of `Tc_log_max_pages_used` and `Tc_log_page_size` is always significantly less than the log size, the size is larger than necessary and can be reduced. (The size is set by the `--log-tc-size` option. This variable is unused: It is unneeded for binary log-based recovery, and the memory-mapped recovery log method is not used unless the number of storage engines that are capable of two-phase commit and that support XA transactions is greater than one. (`InnoDB` is the only applicable engine.)
*  `Tc_log_page_size`

  The page size used for the memory-mapped implementation of the XA recovery log. The default value is determined using `getpagesize()`. This variable is unused for the same reasons as described for `Tc_log_max_pages_used`.
*  `Tc_log_page_waits`

  For the memory-mapped implementation of the recovery log, this variable increments each time the server was not able to commit a transaction and had to wait for a free page in the log. If this value is large, you might want to increase the log size (with the `--log-tc-size` option). For binary log-based recovery, this variable increments each time the binary log cannot be closed because there are two-phase commits in progress. (The close operation waits until all such transactions are finished.)
*  `Telemetry_metrics_supported`

  Whether server telemetry metrics is supported.

  For more information, see the *Server telemetry metrics service* section in the MySQL Source Code documentation.
*  `telemetry.live_sessions`

  Displays the current number of sessions instrumented with telemetry. This can be useful when unloading the Telemetry component, to monitor how many sessions are blocking the unload operation.

  For more information, see the *Server telemetry traces service* section in the MySQL Source Code documentation and  Chapter 35, *Telemetry*.
*  `Telemetry_traces_supported`

  Whether server telemetry traces is supported.

  For more information, see the *Server telemetry traces service* section in the MySQL Source Code documentation.
*  `Threads_cached`

  The number of threads in the thread cache.
*  `Threads_connected`

  The number of currently open connections.
*  `Threads_created`

  The number of threads created to handle connections. If `Threads_created` is big, you may want to increase the `thread_cache_size` value. The cache miss rate can be calculated as `Threads_created`/ `Connections`.
*  `Threads_running`

  The number of threads that are not sleeping.
*  `Tls_library_version`

  The runtime version of the OpenSSL library that is in use for this MySQL instance.
*  `Tls_sni_server_name`

  The Server Name Indication (SNI) that is in use for this session, if specified by the client; otherwise, empty. SNI is an extension to the TLS protocol (OpenSSL must be compiled using TLS extensions for this status variable to function). The MySQL implementation of SNI represents the client-side only.
*  `Uptime`

  The number of seconds that the server has been up.
*  `Uptime_since_flush_status`

  The number of seconds since the most recent `FLUSH STATUS` statement.

