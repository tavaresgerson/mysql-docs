#### 7.4.4.5 Binary Log Transaction Compression

Beginning with MySQL 8.0.20, you can enable binary log transaction compression on a MySQL server instance. When binary log transaction compression is enabled, transaction payloads are compressed using the zstd algorithm, and then written to the server's binary log file as a single event (a `Transaction_payload_event`).

Compressed transaction payloads remain in a compressed state while they are sent in the replication stream to replicas, other Group Replication group members, or clients such as **mysqlbinlog**. They are not decompressed by receiver threads, and are written to the relay log still in their compressed state. Binary log transaction compression therefore saves storage space both on the originator of the transaction and on the recipient (and for their backups), and saves network bandwidth when the transactions are sent between server instances.

Compressed transaction payloads are decompressed when the individual events contained in them need to be inspected. For example, the `Transaction_payload_event` is decompressed by an applier thread in order to apply the events it contains on the recipient. Decompression is also carried out during recovery, by **mysqlbinlog** when replaying transactions, and by the `SHOW BINLOG EVENTS` and `SHOW RELAYLOG EVENTS` statements.

You can enable binary log transaction compression on a MySQL server instance using the `binlog_transaction_compression` system variable, which defaults to `OFF`. You can also use the `binlog_transaction_compression_level_zstd` system variable to set the level for the zstd algorithm that is used for compression. This value determines the compression effort, from 1 (the lowest effort) to 22 (the highest effort). As the compression level increases, the compression ratio increases, which reduces the storage space and network bandwidth required for the transaction payload. However, the effort required for data compression also increases, taking time and CPU and memory resources on the originating server. Increases in the compression effort do not have a linear relationship to increases in the compression ratio.

Setting `binlog_transaction_compression` or `binlog_transaction_compression_level_zstd` (or both) has no immediate effect but rather applies to all subsequent `START REPLICA` (`START SLAVE`) statements.

In NDB 8.0.31 and later, you can enable binary logging of compressed transactions for tables using the `NDB` storage engine at run time using the `ndb_log_transaction_compression` system variable introduced in that release, and control the level of compression using `ndb_log_transaction_compression_level_zstd`. Starting **mysqld** with `--binlog-transaction-compression` on the command line or in a `my.cnf` file causes `ndb_log_transaction_compression` to be enabled automatically and any setting for the `--ndb-log-transaction-compression` option to be ignored; to disable binary log transaction compression for the `NDB` storage engine *only*, set `ndb_log_transaction_compression=OFF` in a client session after starting **mysqld**.

(*Prior to NDB 8.0.31*: Binary log transaction compression can be enabled in NDB Cluster, but only when starting the server using the --binlog-transaction-compression option (and possibly --binlog-transaction-compression-level-zstd as well); changing the value of either or both of the system variables `binlog_transaction_compression` and `binlog_transaction_compression_level_zstd` at run time has no effect on the logging of `NDB` tables.)

The following types of event are excluded from binary log transaction compression, so are always written uncompressed to the binary log:

* Events relating to the GTID for the transaction (including anonymous GTID events).

* Other types of control event, such as view change events and heartbeat events.

* Incident events and the whole of any transactions that contain them.

* Non-transactional events and the whole of any transactions that contain them. A transaction involving a mix of non-transactional and transactional storage engines does not have its payload compressed.

* Events that are logged using statement-based binary logging. Binary log transaction compression is only applied for the row-based binary logging format.

Binary log encryption can be used on binary log files that contain compressed transactions.

##### 7.4.4.5.1 Behaviors When Binary Log Transaction Compression is Enabled

Transactions with payloads that are compressed can be rolled back like any other transaction, and they can also be filtered out on a replica by the usual filtering options. Binary log transaction compression can be applied to XA transactions.

When binary log transaction compression is enabled, the `max_allowed_packet` and `replica_max_allowed_packet` or `slave_max_allowed_packet` limits for the server still apply, and are measured on the compressed size of the `Transaction_payload_event`, plus the bytes used for the event header.

Important

Compressed transaction payloads are sent as a single packet, rather than each event of the transaction being sent in an individual packet, as is the case when binary log transaction compression is not in use. If your replication topology handles large transactions, be aware that a large transaction which can be replicated successfully when binary log transaction compression is not in use, might stop replication due to its size when binary log transaction compression is in use.

For multithreaded workers, each transaction (including its GTID event and `Transaction_payload_event`) is assigned to a worker thread. The worker thread decompresses the transaction payload and applies the individual events in it one by one. If an error is found applying any event within the `Transaction_payload_event`, the complete transaction is reported to the co-ordinator as having failed. When `replica_parallel_type` or `slave_parallel_type` is set to `DATABASE`, all the databases affected by the transaction are mapped before the transaction is scheduled. The use of binary log transaction compression with the `DATABASE` policy can reduce parallelism compared to uncompressed transactions, which are mapped and scheduled for each event.

For semisynchronous replication (see Section 19.4.10, “Semisynchronous Replication”), the replica acknowledges the transaction when the complete `Transaction_payload_event` has been received.

When binary log checksums are enabled (which is the default), the replication source server does not write checksums for individual events in a compressed transaction payload. Instead, a checksum is written for the complete `Transaction_payload_event`, and individual checksums are written for any events that were not compressed, such as events relating to GTIDs.

For the `SHOW BINLOG EVENTS` and `SHOW RELAYLOG EVENTS` statements, the `Transaction_payload_event` is first printed as a single unit, then it is unpacked and each event inside it is printed.

For operations that reference the end position of an event, such as `START REPLICA` (or before MySQL 8.0.22, `START SLAVE`) with the `UNTIL` clause, `SOURCE_POS_WAIT()` or `MASTER_POS_WAIT()`, and `sql_replica_skip_counter` or `sql_slave_skip_counter`, you must specify the end position of the compressed transaction payload (the `Transaction_payload_event`). When skipping events using `sql_replica_skip_counter` or `sql_slave_skip_counter`, a compressed transaction payload is counted as a single counter value, so all the events inside it are skipped as a unit.

##### 7.4.4.5.2 Combining Compressed and Uncompressed Transaction Payloads

MySQL Server releases that support binary log transaction compression can handle a mix of compressed and uncompressed transaction payloads.

* The system variables relating to binary log transaction compression do not need to be set the same on all Group Replication group members, and are not replicated from sources to replicas in a replication topology. You can decide whether or not binary log transaction compression is appropriate for each MySQL Server instance that has a binary log.

* If transaction compression is enabled then disabled on a server, compression is not applied to future transactions originated on that server, but transaction payloads that have been compressed can still be handled and displayed.

* If transaction compression is specified for individual sessions by setting the session value of `binlog_transaction_compression`, the binary log can contain a mix of compressed and uncompressed transaction payloads.

When a source in a replication topology and its replica both have binary log transaction compression enabled, the replica receives compressed transaction payloads and writes them compressed to its relay log. It decompresses the transaction payloads to apply the transactions, and then compresses them again after applying for writing to its binary log. Any downstream replicas receive the compressed transaction payloads.

When a source in a replication topology has binary log transaction compression enabled but its replica does not, the replica receives compressed transaction payloads and writes them compressed to its relay log. It decompresses the transaction payloads to apply the transactions, and then writes them uncompressed to its own binary log, if it has one. Any downstream replicas receive the uncompressed transaction payloads.

When a source in a replication topology does not have binary log transaction compression enabled but its replica does, if the replica has a binary log, it compresses the transaction payloads after applying them, and writes the compressed transaction payloads to its binary log. Any downstream replicas receive the compressed transaction payloads.

When a MySQL server instance has no binary log, if it is at a release from MySQL 8.0.20, it can receive, handle, and display compressed transaction payloads regardless of its value for `binlog_transaction_compression`. Compressed transaction payloads received by such server instances are written in their compressed state to the relay log, so they benefit indirectly from compression that was carried out by other servers in the replication topology.

A replica at a release before MySQL 8.0.20 cannot replicate from a source with binary log transaction compression enabled. A replica at or above MySQL 8.0.20 can replicate from a source at an earlier release that does not support binary log transaction compression, and can carry out its own compression on transactions received from that source when writing them to its own binary log.

##### 7.4.4.5.3 Monitoring Binary Log Transaction Compression

You can monitor the effects of binary log transaction compression using the Performance Schema table `binary_log_transaction_compression_stats`. The statistics include the data compression ratio for the monitored period, and you can also view the effect of compression on the last transaction on the server. You can reset the statistics by truncating the table. Statistics for binary logs and relay logs are split out so you can see the impact of compression for each log type. The MySQL server instance must have a binary log to produce these statistics.

The Performance Schema table `events_stages_current` shows when a transaction is in the stage of decompression or compression for its transaction payload, and displays its progress for this stage. Compression is carried out by the worker thread handling the transaction, just before the transaction is committed, provided that there are no events in the finalized capture cache that exclude the transaction from binary log transaction compression (for example, incident events). When decompression is required, it is carried out for one event from the payload at a time.

**mysqlbinlog** with the `--verbose` option includes comments stating the compressed size and the uncompressed size for compressed transaction payloads, and the compression algorithm that was used.

You can enable connection compression at the protocol level for replication connections, using the `SOURCE_COMPRESSION_ALGORITHMS` | `MASTER_COMPRESSION_ALGORITHMS` and `SOURCE_ZSTD_COMPRESSION_LEVEL` | `MASTER_ZSTD_COMPRESSION_LEVEL`options of the `CHANGE REPLICATION SOURCE TO` statement (from MySQL 8.0.23) or `CHANGE MASTER TO` statement (before MySQL 8.0.23), or the `replica_compressed_protocol` or `slave_compressed_protocol` system variable. If you enable binary log transaction compression in a system where connection compression is also enabled, the impact of connection compression is reduced, as there might be little opportunity to further compress the compressed transaction payloads. However, connection compression can still operate on uncompressed events and on message headers. Binary log transaction compression can be enabled in combination with connection compression if you need to save storage space as well as network bandwidth. For more information on connection compression for replication connections, see Section 6.2.8, “Connection Compression Control”.

For Group Replication, compression is enabled by default for messages that exceed the threshold set by the `group_replication_compression_threshold` system variable. You can also configure compression for messages sent for distributed recovery by the method of state transfer from a donor's binary log, using the `group_replication_recovery_compression_algorithms` and `group_replication_recovery_zstd_compression_level` system variables. If you enable binary log transaction compression in a system where these are configured, Group Replication's message compression can still operate on uncompressed events and on message headers, but its impact is reduced. For more information on message compression for Group Replication, see Section 20.7.4, “Message Compression”.
