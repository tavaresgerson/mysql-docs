#### 29.12.12.3 The ndb_replication_applier_status Table

`NDBCLUSTER` exposes its internal replication applier state for observation using global status variables such as `Ndb_replica_max_replicated_epoch` and `Ndb_api_trans_start_count_replica`, but these values reflect the state of the default replication channel only. The `ndb_replication_applier_status` provides the same information, but on a per-channel basis; with the exception of `CHANNEL_NAME`, each column in this table corresponds to a server status variable; where applicable, this information is included in the column descriptions provided later in this section.

This table is an NDB-specific extension to the `replication_applier_status` table.

The `ndb_replication_applier_status` table has the columns shown and described in the following list:

* `CHANNEL_NAME`:

  The name of the replication channel. The default is an empty string (`""`).

* `MAX_REPLICATED_EPOCH`:

  The most recently committed NDB epoch on this replica. `Ndb_replica_max_replicated_epoch` shows this value for the default replication channel.

* `API_WAIT_EXEC_COMPLETE_COUNT`:

  The number of times this thread has been blocked while waiting for an operation by this SQL node to complete. `Ndb_api_wait_exec_complete_count_replica` shows this value for the default replication channel.

* `API_WAIT_SCAN_RESULT_COUNT`:

  The number of times this thread has been blocked while waiting for a scan-based signal by this SQL node. `Ndb_api_wait_scan_result_count_replica` shows this value for the default replication channel.

* `API_WAIT_META_REQUEST_COUNT`:

  The number of times this thread has been blocked waiting for a metadata-based signal by this SQL node. `Ndb_api_wait_meta_request_count_replica` shows this value for the default replication channel.

* `API_WAIT_NANOS_COUNT`:

  Cumulative time in nanoseconds spent waiting for some type of signal from the data nodes by this SQL node. `Ndb_api_wait_nanos_count_replica` shows this value for the default replication channel.

* `API_BYTES_SENT_COUNT`:

  The number of bytes sent to the data nodes by this SQL node. `Ndb_api_bytes_sent_count_replica` shows this value for the default replication channel.

* `API_BYTES_RECEIVED_COUNT`:

  The number of bytes received from the data nodes by this SQL node. `Ndb_api_bytes_received_count_replica` shows this value for the default replication channel.

* `API_TRANS_START_COUNT`:

  The number of transactions started by this SQL node. `Ndb_api_trans_start_count_replica` shows this value for the default replication channel.

* `API_TRANS_COMMIT_COUNT`:

  The number of transactions committed by this SQL node. `Ndb_api_trans_commit_count_replica` shows this value for the default replication channel.

* `API_TRANS_ABORT_COUNT`:

  The number of transactions aborted by this SQL node. `Ndb_api_trans_abort_count_replica` shows this value for the default replication channel.

* `API_TRANS_CLOSE_COUNT`:

  The number of transactions which have been closed by this SQL node; this value may be greater than the sum of `API_TRANS_COMMIT_COUNT` and `API_TRANS_ABORT_COUNT`. `Ndb_api_trans_close_count_replica` shows this value for the default replication channel.

* `API_PK_OP_COUNT`:

  The number of primary key operations which have been performed by this SQL node. `Ndb_api_pk_op_count_replica` shows this value for the default replication channel.

* `API_UK_OP_COUNT`:

  The number of unique key operations which have been performed by this SQL node. `Ndb_api_uk_op_count_replica` shows this value for the default replication channel.

* `API_TABLE_SCAN_COUNT`:

  The number of table scans which have been started by this SQL node. This includes scans of internal tables. `Ndb_api_table_scan_count_replica` shows this value for the default replication channel.

* `API_RANGE_SCAN_COUNT`:

  The number of range scans which have been started by this SQL node. `Ndb_api_range_scan_count_replica` shows this value for the default replication channel.

* `API_PRUNED_SCAN_COUNT`:

  The number of scans which have been pruned to a single partition by this SQL node. `Ndb_api_pruned_scan_count_replica` shows this value for the default replication channel.

* `API_SCAN_BATCH_COUNT`:

  The number of row batches which have been received by this SQL node. `Ndb_api_scan_batch_count_replica` shows this value for the default replication channel.

* `API_READ_ROW_COUNT`:

  The total number of rows which have been read by this SQL node. `Ndb_api_read_row_count_replica` shows this value for the default replication channel.

* `API_TRANS_LOCAL_READ_ROW_COUNT`:

  The total number of rows which have been read by this SQL node locally. `Ndb_api_trans_local_read_row_count_replica` shows this value for the default replication channel.

* `API_ADAPTIVE_SEND_FORCED_COUNT`:

  The number of adaptive sends which have been sent by this SQL node making use of forced send. `Ndb_api_adaptive_send_forced_count_replica` shows this value for the default replication channel.

* `API_ADAPTIVE_SEND_UNFORCED_COUNT`:

  The number of adaptive sends which have been sent by this SQL node without using forced send. `Ndb_api_adaptive_send_unforced_count_replica` shows this value for the default replication channel.

* `API_ADAPTIVE_SEND_DEFERRED_COUNT`:

  The number of adaptive sends which were not actually sent by this SQL node. `Ndb_api_adaptive_send_deferred_count_replica` shows this value for the default replication channel.

* `CONFLICT_FN_MAX`:

  The number of times that NDB replication “greater timestamp wins” conflict resolution has been applied to update and delete operations. `Ndb_conflict_fn_max` shows this value for the default replication channel.

* `CONFLICT_FN_OLD`:

  The number of times that NDB replication “same timestamp wins” conflict resolution has been applied. `Ndb_conflict_fn_old` shows this value for the default replication channel.

* `CONFLICT_FN_MAX_DEL_WIN`:

  The number of times that NDB replication conflict resolution based on the result of `NDB$MAX_DELETE_WIN()` has been applied to update and delete operations. `Ndb_conflict_fn_max_del_win` shows this value for the default replication channel.

* `CONFLICT_FN_MAX_INS`:

  The number of times that NDB replication “greater timestamp wins” conflict resolution has been applied to insert operations. `Ndb_conflict_fn_max_ins` shows this value for the default replication channel.

* `CONFLICT_FN_MAX_DEL_WIN_INS`:

  The number of times that NDB replication conflict resolution based on the result of `NDB$MAX_DELETE_WIN_INS()` has been applied to update and delete operations. `Ndb_conflict_fn_max_del_win_ins` shows this value for the default replication channel.

* `CONFLICT_FN_EPOCH`:

  The number of rows which have been found in conflict by the `NDB$EPOCH()` NDB replication conflict detection function. `Ndb_conflict_fn_epoch` shows this value for the default replication channel.

* `CONFLICT_FN_EPOCH_TRANS`:

  The number of rows which have been found in conflict by the `NDB$EPOCH_TRANS()` NDB replication conflict detection function. `Ndb_conflict_fn_epoch_trans` shows this value for the default replication channel.

* `CONFLICT_FN_EPOCH2`:

  The number of rows which have been found in conflict by the `NDB$EPOCH2()` NDB replication conflict detection function. `Ndb_conflict_fn_epoch2` shows this value for the default replication channel.

* `CONFLICT_FN_EPOCH2_TRANS`:

  The number of rows which have been found in conflict by the `NDB$EPOCH2_TRANS()` NDB replication conflict detection function. `Ndb_conflict_fn_epoch2_trans` shows this value for the default replication channel.

* `CONFLICT_TRANS_ROW_CONFLICT_COUNT`:

  The number of rows which have been found to be in conflict by a transactional conflict function, including any rows which were included in or dependent on conflicting transactions. `Ndb_conflict_trans_row_conflict_count` shows this value for the default replication channel.

* `CONFLICT_TRANS_ROW_REJECT_COUNT`:

  The total number of rows which have been realigned after being found to be in conflict by a transactional conflict function, including `CONFLICT_TRANS_ROW_CONFLICT_COUNT` as well as any rows which were included in or dependent on conflicting transactions. `Ndb_conflict_trans_row_reject_count` shows this value for the default replication channel.

* `CONFLICT_TRANS_REJECT_COUNT`:

  The number of transactions which have been rejected after being found to be in conflict by a transactional conflict function. `Ndb_conflict_trans_reject_count` shows this value for the default replication channel.

* `CONFLICT_TRANS_DETECT_ITER_COUNT`:

  The number of internal iterations which have been required to commit epoch transactions. This value should be normally be slightly greater than or equal to the value of `CONFLICT_TRANS_CONFLICT_COMMIT_COUNT`. `Ndb_conflict_trans_detect_iter_count` shows this value for the default replication channel.

* `CONFLICT_TRANS_CONFLICT_COMMIT_COUNT`:

  The number of epoch transactions which have been committed after requiring transactional conflict handling. `Ndb_conflict_trans_conflict_commit_count` shows this value for the default replication channel.

* `CONFLICT_EPOCH_DELETE_DELETE_COUNT`:

  The number of delete-delete conflicts detected. A delete-delete conflict occurs when a delete operation is applied, but the row does not exist. `Ndb_epoch_delete_delete_count` shows this value for the default replication channel.

* `CONFLICT_REFLECTED_OP_PREPARE_COUNT`:

  The number of reflected operations which have been received and prepared for execution. `Ndb_conflict_reflected_op_prepare_count` shows this value for the default replication channel.

* `CONFLICT_REFLECTED_OP_DISCARD_COUNT`:

  The nmber of reflected operations which have not been applied due to errors during execution. `Ndb_conflict_reflected_op_discard_count` shows this value for the default replication channel.

* `CONFLICT_REFRESH_OP_COUNT`:

  The number of refresh operations which have been prepared. `Ndb_conflict_refresh_op_count` shows this value for the default replication channel.

* `CONFLICT_LAST_CONFLICT_EPOCH`:

  The most recent NDB epoch on this replica during which a conflict was detected. `Ndb_conflict_last_conflict_epoch` shows this value for the default replication channel.

* `CONFLICT_LAST_STABLE_EPOCH`:

  The most recent NDB epoch during which no conflicts were detected. `Ndb_conflict_last_stable_epoch` shows this value for the default replication channel.

For more information, see the descriptions of the indicated server status variables, as well as Section 25.7, “NDB Cluster Replication”.
