### 21.6.14 NDB API Statistics Counters and Variables

A number of types of statistical counters relating to actions performed by or affecting [`Ndb`](/doc/ndbapi/en/ndb-ndb.html) objects are available. Such actions include starting and closing (or aborting) transactions; primary key and unique key operations; table, range, and pruned scans; threads blocked while waiting for the completion of various operations; and data and events sent and received by `NDBCLUSTER`. The counters are incremented inside the NDB kernel whenever NDB API calls are made or data is sent to or received by the data nodes. [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") exposes these counters as system status variables; their values can be read in the output of [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), or by querying the Information Schema [`SESSION_STATUS`](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables") or [`GLOBAL_STATUS`](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables") table. By comparing the values before and after statements operating on [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables, you can observe the corresponding actions taken on the API level, and thus the cost of performing the statement.

You can list all of these status variables using the following [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") statement:

```sql
mysql> SHOW STATUS LIKE 'ndb_api%';
+----------------------------------------------+-------------+
| Variable_name                                | Value       |
+----------------------------------------------+-------------+
| Ndb_api_wait_exec_complete_count             | 2           |
| Ndb_api_wait_scan_result_count               | 3           |
| Ndb_api_wait_meta_request_count              | 101         |
| Ndb_api_wait_nanos_count                     | 83664697215 |
| Ndb_api_bytes_sent_count                     | 13608       |
| Ndb_api_bytes_received_count                 | 142800      |
| Ndb_api_trans_start_count                    | 2           |
| Ndb_api_trans_commit_count                   | 1           |
| Ndb_api_trans_abort_count                    | 0           |
| Ndb_api_trans_close_count                    | 2           |
| Ndb_api_pk_op_count                          | 1           |
| Ndb_api_uk_op_count                          | 0           |
| Ndb_api_table_scan_count                     | 1           |
| Ndb_api_range_scan_count                     | 0           |
| Ndb_api_pruned_scan_count                    | 0           |
| Ndb_api_scan_batch_count                     | 0           |
| Ndb_api_read_row_count                       | 1           |
| Ndb_api_trans_local_read_row_count           | 1           |
| Ndb_api_adaptive_send_forced_count           | 0           |
| Ndb_api_adaptive_send_unforced_count         | 3           |
| Ndb_api_adaptive_send_deferred_count         | 0           |
| Ndb_api_event_data_count                     | 0           |
| Ndb_api_event_nondata_count                  | 0           |
| Ndb_api_event_bytes_count                    | 0           |
| Ndb_api_wait_exec_complete_count_slave       | 0           |
| Ndb_api_wait_scan_result_count_slave         | 0           |
| Ndb_api_wait_meta_request_count_slave        | 0           |
| Ndb_api_wait_nanos_count_slave               | 0           |
| Ndb_api_bytes_sent_count_slave               | 0           |
| Ndb_api_bytes_received_count_slave           | 0           |
| Ndb_api_trans_start_count_slave              | 0           |
| Ndb_api_trans_commit_count_slave             | 0           |
| Ndb_api_trans_abort_count_slave              | 0           |
| Ndb_api_trans_close_count_slave              | 0           |
| Ndb_api_pk_op_count_slave                    | 0           |
| Ndb_api_uk_op_count_slave                    | 0           |
| Ndb_api_table_scan_count_slave               | 0           |
| Ndb_api_range_scan_count_slave               | 0           |
| Ndb_api_pruned_scan_count_slave              | 0           |
| Ndb_api_scan_batch_count_slave               | 0           |
| Ndb_api_read_row_count_slave                 | 0           |
| Ndb_api_trans_local_read_row_count_slave     | 0           |
| Ndb_api_adaptive_send_forced_count_slave     | 0           |
| Ndb_api_adaptive_send_unforced_count_slave   | 0           |
| Ndb_api_adaptive_send_deferred_count_slave   | 0           |
| Ndb_api_event_data_count_injector            | 0           |
| Ndb_api_event_nondata_count_injector         | 0           |
| Ndb_api_event_bytes_count_injector           | 0           |
| Ndb_api_wait_exec_complete_count_session     | 0           |
| Ndb_api_wait_scan_result_count_session       | 0           |
| Ndb_api_wait_meta_request_count_session      | 0           |
| Ndb_api_wait_nanos_count_session             | 0           |
| Ndb_api_bytes_sent_count_session             | 0           |
| Ndb_api_bytes_received_count_session         | 0           |
| Ndb_api_trans_start_count_session            | 0           |
| Ndb_api_trans_commit_count_session           | 0           |
| Ndb_api_trans_abort_count_session            | 0           |
| Ndb_api_trans_close_count_session            | 0           |
| Ndb_api_pk_op_count_session                  | 0           |
| Ndb_api_uk_op_count_session                  | 0           |
| Ndb_api_table_scan_count_session             | 0           |
| Ndb_api_range_scan_count_session             | 0           |
| Ndb_api_pruned_scan_count_session            | 0           |
| Ndb_api_scan_batch_count_session             | 0           |
| Ndb_api_read_row_count_session               | 0           |
| Ndb_api_trans_local_read_row_count_session   | 0           |
| Ndb_api_adaptive_send_forced_count_session   | 0           |
| Ndb_api_adaptive_send_unforced_count_session | 0           |
| Ndb_api_adaptive_send_deferred_count_session | 0           |
+----------------------------------------------+-------------+
69 rows in set (0.00 sec)
```

These status variables are also available from the [`SESSION_STATUS`](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables") and [`GLOBAL_STATUS`](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables") tables of the `INFORMATION_SCHEMA` database, as shown here:

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.SESSION_STATUS
    ->   WHERE VARIABLE_NAME LIKE 'ndb_api%';
+----------------------------------------------+----------------+
| VARIABLE_NAME                                | VARIABLE_VALUE |
+----------------------------------------------+----------------+
| Ndb_api_wait_exec_complete_count             | 2              |
| Ndb_api_wait_scan_result_count               | 3              |
| Ndb_api_wait_meta_request_count              | 101            |
| Ndb_api_wait_nanos_count                     | 74890499869    |
| Ndb_api_bytes_sent_count                     | 13608          |
| Ndb_api_bytes_received_count                 | 142800         |
| Ndb_api_trans_start_count                    | 2              |
| Ndb_api_trans_commit_count                   | 1              |
| Ndb_api_trans_abort_count                    | 0              |
| Ndb_api_trans_close_count                    | 2              |
| Ndb_api_pk_op_count                          | 1              |
| Ndb_api_uk_op_count                          | 0              |
| Ndb_api_table_scan_count                     | 1              |
| Ndb_api_range_scan_count                     | 0              |
| Ndb_api_pruned_scan_count                    | 0              |
| Ndb_api_scan_batch_count                     | 0              |
| Ndb_api_read_row_count                       | 1              |
| Ndb_api_trans_local_read_row_count           | 1              |
| Ndb_api_adaptive_send_forced_count           | 0              |
| Ndb_api_adaptive_send_unforced_count         | 3              |
| Ndb_api_adaptive_send_deferred_count         | 0              |
| Ndb_api_event_data_count                     | 0              |
| Ndb_api_event_nondata_count                  | 0              |
| Ndb_api_event_bytes_count                    | 0              |
| Ndb_api_wait_exec_complete_count_slave       | 0              |
| Ndb_api_wait_scan_result_count_slave         | 0              |
| Ndb_api_wait_meta_request_count_slave        | 0              |
| Ndb_api_wait_nanos_count_slave               | 0              |
| Ndb_api_bytes_sent_count_slave               | 0              |
| Ndb_api_bytes_received_count_slave           | 0              |
| Ndb_api_trans_start_count_slave              | 0              |
| Ndb_api_trans_commit_count_slave             | 0              |
| Ndb_api_trans_abort_count_slave              | 0              |
| Ndb_api_trans_close_count_slave              | 0              |
| Ndb_api_pk_op_count_slave                    | 0              |
| Ndb_api_uk_op_count_slave                    | 0              |
| Ndb_api_table_scan_count_slave               | 0              |
| Ndb_api_range_scan_count_slave               | 0              |
| Ndb_api_pruned_scan_count_slave              | 0              |
| Ndb_api_scan_batch_count_slave               | 0              |
| Ndb_api_read_row_count_slave                 | 0              |
| Ndb_api_trans_local_read_row_count_slave     | 0              |
| Ndb_api_adaptive_send_forced_count_slave     | 0              |
| Ndb_api_adaptive_send_unforced_count_slave   | 0              |
| Ndb_api_adaptive_send_deferred_count_slave   | 0              |
| Ndb_api_event_data_count_injector            | 0              |
| Ndb_api_event_nondata_count_injector         | 0              |
| Ndb_api_event_bytes_count_injector           | 0              |
| Ndb_api_wait_exec_complete_count_session     | 0              |
| Ndb_api_wait_scan_result_count_session       | 0              |
| Ndb_api_wait_meta_request_count_session      | 0              |
| Ndb_api_wait_nanos_count_session             | 0              |
| Ndb_api_bytes_sent_count_session             | 0              |
| Ndb_api_bytes_received_count_session         | 0              |
| Ndb_api_trans_start_count_session            | 0              |
| Ndb_api_trans_commit_count_session           | 0              |
| Ndb_api_trans_abort_count_session            | 0              |
| Ndb_api_trans_close_count_session            | 0              |
| Ndb_api_pk_op_count_session                  | 0              |
| Ndb_api_uk_op_count_session                  | 0              |
| Ndb_api_table_scan_count_session             | 0              |
| Ndb_api_range_scan_count_session             | 0              |
| Ndb_api_pruned_scan_count_session            | 0              |
| Ndb_api_scan_batch_count_session             | 0              |
| Ndb_api_read_row_count_session               | 0              |
| Ndb_api_trans_local_read_row_count_session   | 0              |
| Ndb_api_adaptive_send_forced_count_session   | 0              |
| Ndb_api_adaptive_send_unforced_count_session | 0              |
| Ndb_api_adaptive_send_deferred_count_session | 0              |
+----------------------------------------------+----------------+
69 rows in set (0.00 sec)

mysql> SELECT * FROM INFORMATION_SCHEMA.GLOBAL_STATUS
    ->     WHERE VARIABLE_NAME LIKE 'ndb_api%';
+----------------------------------------------+----------------+
| VARIABLE_NAME                                | VARIABLE_VALUE |
+----------------------------------------------+----------------+
| Ndb_api_wait_exec_complete_count             | 2              |
| Ndb_api_wait_scan_result_count               | 3              |
| Ndb_api_wait_meta_request_count              | 101            |
| Ndb_api_wait_nanos_count                     | 13640285623    |
| Ndb_api_bytes_sent_count                     | 13608          |
| Ndb_api_bytes_received_count                 | 142800         |
| Ndb_api_trans_start_count                    | 2              |
| Ndb_api_trans_commit_count                   | 1              |
| Ndb_api_trans_abort_count                    | 0              |
| Ndb_api_trans_close_count                    | 2              |
| Ndb_api_pk_op_count                          | 1              |
| Ndb_api_uk_op_count                          | 0              |
| Ndb_api_table_scan_count                     | 1              |
| Ndb_api_range_scan_count                     | 0              |
| Ndb_api_pruned_scan_count                    | 0              |
| Ndb_api_scan_batch_count                     | 0              |
| Ndb_api_read_row_count                       | 1              |
| Ndb_api_trans_local_read_row_count           | 1              |
| Ndb_api_adaptive_send_forced_count           | 0              |
| Ndb_api_adaptive_send_unforced_count         | 3              |
| Ndb_api_adaptive_send_deferred_count         | 0              |
| Ndb_api_event_data_count                     | 0              |
| Ndb_api_event_nondata_count                  | 0              |
| Ndb_api_event_bytes_count                    | 0              |
| Ndb_api_wait_exec_complete_count_slave       | 0              |
| Ndb_api_wait_scan_result_count_slave         | 0              |
| Ndb_api_wait_meta_request_count_slave        | 0              |
| Ndb_api_wait_nanos_count_slave               | 0              |
| Ndb_api_bytes_sent_count_slave               | 0              |
| Ndb_api_bytes_received_count_slave           | 0              |
| Ndb_api_trans_start_count_slave              | 0              |
| Ndb_api_trans_commit_count_slave             | 0              |
| Ndb_api_trans_abort_count_slave              | 0              |
| Ndb_api_trans_close_count_slave              | 0              |
| Ndb_api_pk_op_count_slave                    | 0              |
| Ndb_api_uk_op_count_slave                    | 0              |
| Ndb_api_table_scan_count_slave               | 0              |
| Ndb_api_range_scan_count_slave               | 0              |
| Ndb_api_pruned_scan_count_slave              | 0              |
| Ndb_api_scan_batch_count_slave               | 0              |
| Ndb_api_read_row_count_slave                 | 0              |
| Ndb_api_trans_local_read_row_count_slave     | 0              |
| Ndb_api_adaptive_send_forced_count_slave     | 0              |
| Ndb_api_adaptive_send_unforced_count_slave   | 0              |
| Ndb_api_adaptive_send_deferred_count_slave   | 0              |
| Ndb_api_event_data_count_injector            | 0              |
| Ndb_api_event_nondata_count_injector         | 0              |
| Ndb_api_event_bytes_count_injector           | 0              |
| Ndb_api_wait_exec_complete_count_session     | 0              |
| Ndb_api_wait_scan_result_count_session       | 0              |
| Ndb_api_wait_meta_request_count_session      | 0              |
| Ndb_api_wait_nanos_count_session             | 0              |
| Ndb_api_bytes_sent_count_session             | 0              |
| Ndb_api_bytes_received_count_session         | 0              |
| Ndb_api_trans_start_count_session            | 0              |
| Ndb_api_trans_commit_count_session           | 0              |
| Ndb_api_trans_abort_count_session            | 0              |
| Ndb_api_trans_close_count_session            | 0              |
| Ndb_api_pk_op_count_session                  | 0              |
| Ndb_api_uk_op_count_session                  | 0              |
| Ndb_api_table_scan_count_session             | 0              |
| Ndb_api_range_scan_count_session             | 0              |
| Ndb_api_pruned_scan_count_session            | 0              |
| Ndb_api_scan_batch_count_session             | 0              |
| Ndb_api_read_row_count_session               | 0              |
| Ndb_api_trans_local_read_row_count_session   | 0              |
| Ndb_api_adaptive_send_forced_count_session   | 0              |
| Ndb_api_adaptive_send_unforced_count_session | 0              |
| Ndb_api_adaptive_send_deferred_count_session | 0              |
+----------------------------------------------+----------------+
69 rows in set (0.01 sec)
```

Each [`Ndb`](/doc/ndbapi/en/ndb-ndb.html) object has its own counters. NDB API applications can read the values of the counters for use in optimization or monitoring. For multithreaded clients which use more than one [`Ndb`](/doc/ndbapi/en/ndb-ndb.html) object concurrently, it is also possible to obtain a summed view of counters from all [`Ndb`](/doc/ndbapi/en/ndb-ndb.html) objects belonging to a given [`Ndb_cluster_connection`](/doc/ndbapi/en/ndb-ndb-cluster-connection.html).

Four sets of these counters are exposed. One set applies to the current session only; the other 3 are global. *This is in spite of the fact that their values can be obtained as either session or global status variables in the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client*. This means that specifying the `SESSION` or `GLOBAL` keyword with [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") has no effect on the values reported for NDB API statistics status variables, and the value for each of these variables is the same whether the value is obtained from the equivalent column of the [`SESSION_STATUS`](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables") or the [`GLOBAL_STATUS`](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables") table.

* *Session counters (session specific)*

  Session counters relate to the [`Ndb`](/doc/ndbapi/en/ndb-ndb.html) objects in use by (only) the current session. Use of such objects by other MySQL clients does not influence these counts.

  In order to minimize confusion with standard MySQL session variables, we refer to the variables that correspond to these NDB API session counters as “`_session` variables”, with a leading underscore.

* *Replica counters (global)*

  This set of counters relates to the [`Ndb`](/doc/ndbapi/en/ndb-ndb.html) objects used by the replicat SQL thread, if any. If this [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") does not act as a replica, or does not use [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables, then all of these counts are 0.

  We refer to the related status variables as “`_slave` variables” (with a leading underscore).

* *Injector counters (global)*

  Injector counters relate to the [`Ndb`](/doc/ndbapi/en/ndb-ndb.html) object used to listen to cluster events by the binary log injector thread. Even when not writing a binary log, [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") processes attached to an NDB Cluster continue to listen for some events, such as schema changes.

  We refer to the status variables that correspond to NDB API injector counters as “`_injector` variables” (with a leading underscore).

* *Server (Global) counters (global)*

  This set of counters relates to all [`Ndb`](/doc/ndbapi/en/ndb-ndb.html) objects currently used by this [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). This includes all MySQL client applications, the replica SQL thread (if any), the binlog injector, and the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") utility thread.

  We refer to the status variables that correspond to these counters as “global variables” or “[**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server")-level variables”.

You can obtain values for a particular set of variables by additionally filtering for the substring `session`, `slave`, or `injector` in the variable name (along with the common prefix `Ndb_api`). For `_session` variables, this can be done as shown here:

```sql
mysql> SHOW STATUS LIKE 'ndb_api%session';
+--------------------------------------------+---------+
| Variable_name                              | Value   |
+--------------------------------------------+---------+
| Ndb_api_wait_exec_complete_count_session   | 2       |
| Ndb_api_wait_scan_result_count_session     | 0       |
| Ndb_api_wait_meta_request_count_session    | 1       |
| Ndb_api_wait_nanos_count_session           | 8144375 |
| Ndb_api_bytes_sent_count_session           | 68      |
| Ndb_api_bytes_received_count_session       | 84      |
| Ndb_api_trans_start_count_session          | 1       |
| Ndb_api_trans_commit_count_session         | 1       |
| Ndb_api_trans_abort_count_session          | 0       |
| Ndb_api_trans_close_count_session          | 1       |
| Ndb_api_pk_op_count_session                | 1       |
| Ndb_api_uk_op_count_session                | 0       |
| Ndb_api_table_scan_count_session           | 0       |
| Ndb_api_range_scan_count_session           | 0       |
| Ndb_api_pruned_scan_count_session          | 0       |
| Ndb_api_scan_batch_count_session           | 0       |
| Ndb_api_read_row_count_session             | 1       |
| Ndb_api_trans_local_read_row_count_session | 1       |
+--------------------------------------------+---------+
18 rows in set (0.50 sec)
```

To obtain a listing of the NDB API [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server")-level status variables, filter for variable names beginning with `ndb_api` and ending in `_count`, like this:

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.SESSION_STATUS
    ->     WHERE VARIABLE_NAME LIKE 'ndb_api%count';
+------------------------------------+----------------+
| VARIABLE_NAME                      | VARIABLE_VALUE |
+------------------------------------+----------------+
| NDB_API_WAIT_EXEC_COMPLETE_COUNT   | 4              |
| NDB_API_WAIT_SCAN_RESULT_COUNT     | 3              |
| NDB_API_WAIT_META_REQUEST_COUNT    | 28             |
| NDB_API_WAIT_NANOS_COUNT           | 53756398       |
| NDB_API_BYTES_SENT_COUNT           | 1060           |
| NDB_API_BYTES_RECEIVED_COUNT       | 9724           |
| NDB_API_TRANS_START_COUNT          | 3              |
| NDB_API_TRANS_COMMIT_COUNT         | 2              |
| NDB_API_TRANS_ABORT_COUNT          | 0              |
| NDB_API_TRANS_CLOSE_COUNT          | 3              |
| NDB_API_PK_OP_COUNT                | 2              |
| NDB_API_UK_OP_COUNT                | 0              |
| NDB_API_TABLE_SCAN_COUNT           | 1              |
| NDB_API_RANGE_SCAN_COUNT           | 0              |
| NDB_API_PRUNED_SCAN_COUNT          | 0              |
| NDB_API_SCAN_BATCH_COUNT           | 0              |
| NDB_API_READ_ROW_COUNT             | 2              |
| NDB_API_TRANS_LOCAL_READ_ROW_COUNT | 2              |
| NDB_API_EVENT_DATA_COUNT           | 0              |
| NDB_API_EVENT_NONDATA_COUNT        | 0              |
| NDB_API_EVENT_BYTES_COUNT          | 0              |
+------------------------------------+----------------+
21 rows in set (0.09 sec)
```

Not all counters are reflected in all 4 sets of status variables. For the event counters `DataEventsRecvdCount`, `NondataEventsRecvdCount`, and `EventBytesRecvdCount`, only `_injector` and [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server")-level NDB API status variables are available:

```sql
mysql> SHOW STATUS LIKE 'ndb_api%event%';
+--------------------------------------+-------+
| Variable_name                        | Value |
+--------------------------------------+-------+
| Ndb_api_event_data_count_injector    | 0     |
| Ndb_api_event_nondata_count_injector | 0     |
| Ndb_api_event_bytes_count_injector   | 0     |
| Ndb_api_event_data_count             | 0     |
| Ndb_api_event_nondata_count          | 0     |
| Ndb_api_event_bytes_count            | 0     |
+--------------------------------------+-------+
6 rows in set (0.00 sec)
```

`_injector` status variables are not implemented for any other NDB API counters, as shown here:

```sql
mysql> SHOW STATUS LIKE 'ndb_api%injector%';
+--------------------------------------+-------+
| Variable_name                        | Value |
+--------------------------------------+-------+
| Ndb_api_event_data_count_injector    | 0     |
| Ndb_api_event_nondata_count_injector | 0     |
| Ndb_api_event_bytes_count_injector   | 0     |
+--------------------------------------+-------+
3 rows in set (0.00 sec)
```

The names of the status variables can easily be associated with the names of the corresponding counters. Each NDB API statistics counter is listed in the following table with a description as well as the names of any MySQL server status variables corresponding to this counter.

**Table 21.61 NDB API statistics counters**

<table><col style="width: 30%"/><col style="width: 35%"/><col style="width: 40%"/><thead><tr> <th>Counter Name</th> <th>Description</th> <th>Status Variables (by statistic type): <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> Session </p></li><li class="listitem"><p> Slave (replica) </p></li><li class="listitem"><p> Injector </p></li><li class="listitem"><p> Server </p></li></ul> </div> </th> </tr></thead><tbody><tr> <th><code>WaitExecCompleteCount</code></th> <td>Number of times thread has been blocked while waiting for execution of an operation to complete. Includes all <a class="ulink" href="/doc/ndbapi/en/ndb-ndbtransaction.html#ndb-ndbtransaction-execute" target="_top"><code>execute()</code></a> calls as well as implicit executes for blob operations and auto-increment not visible to clients.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_wait_exec_complete_count_session"><code>Ndb_api_wait_exec_complete_count_session</code></a> </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_wait_exec_complete_count_slave"><code>Ndb_api_wait_exec_complete_count_slave</code></a> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_wait_exec_complete_count"><code>Ndb_api_wait_exec_complete_count</code></a> </p></li></ul> </div> </td> </tr><tr> <th><code>WaitScanResultCount</code></th> <td>Number of times thread has been blocked while waiting for a scan-based signal, such waiting for additional results, or for a scan to close.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_wait_scan_result_count_session"><code>Ndb_api_wait_scan_result_count_session</code></a> </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_wait_scan_result_count_slave"><code>Ndb_api_wait_scan_result_count_slave</code></a> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_wait_scan_result_count"><code>Ndb_api_wait_scan_result_count</code></a> </p></li></ul> </div> </td> </tr><tr> <th><code>WaitMetaRequestCount</code></th> <td>Number of times thread has been blocked waiting for a metadata-based signal; this can occur when waiting for a DDL operation or for an epoch to be started (or ended).</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_wait_meta_request_count_session"><code>Ndb_api_wait_meta_request_count_session</code></a> </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_wait_meta_request_count_slave"><code>Ndb_api_wait_meta_request_count_slave</code></a> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_wait_meta_request_count"><code>Ndb_api_wait_meta_request_count</code></a> </p></li></ul> </div> </td> </tr><tr> <th><code>WaitNanosCount</code></th> <td>Total time (in nanoseconds) spent waiting for some type of signal from the data nodes.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_wait_nanos_count_session"><code>Ndb_api_wait_nanos_count_session</code></a> </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_wait_nanos_count_slave"><code>Ndb_api_wait_nanos_count_slave</code></a> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_wait_nanos_count"><code>Ndb_api_wait_nanos_count</code></a> </p></li></ul> </div> </td> </tr><tr> <th><code>BytesSentCount</code></th> <td>Amount of data (in bytes) sent to the data nodes</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_bytes_sent_count_session"><code>Ndb_api_bytes_sent_count_session</code></a> </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_bytes_sent_count_slave"><code>Ndb_api_bytes_sent_count_slave</code></a> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_bytes_sent_count"><code>Ndb_api_bytes_sent_count</code></a> </p></li></ul> </div> </td> </tr><tr> <th><code>BytesRecvdCount</code></th> <td>Amount of data (in bytes) received from the data nodes</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_bytes_received_count_session"><code>Ndb_api_bytes_received_count_session</code></a> </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_bytes_received_count_slave"><code>Ndb_api_bytes_received_count_slave</code></a> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_bytes_received_count"><code>Ndb_api_bytes_received_count</code></a> </p></li></ul> </div> </td> </tr><tr> <th><code>TransStartCount</code></th> <td>Number of transactions started.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_trans_start_count_session"><code>Ndb_api_trans_start_count_session</code></a> </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_trans_start_count_slave"><code>Ndb_api_trans_start_count_slave</code></a> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_trans_start_count"><code>Ndb_api_trans_start_count</code></a> </p></li></ul> </div> </td> </tr><tr> <th><code>TransCommitCount</code></th> <td>Number of transactions committed.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_trans_commit_count_session"><code>Ndb_api_trans_commit_count_session</code></a> </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_trans_commit_count_slave"><code>Ndb_api_trans_commit_count_slave</code></a> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_trans_commit_count"><code>Ndb_api_trans_commit_count</code></a> </p></li></ul> </div> </td> </tr><tr> <th><code>TransAbortCount</code></th> <td>Number of transactions aborted.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_trans_abort_count_session"><code>Ndb_api_trans_abort_count_session</code></a> </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_trans_abort_count_slave"><code>Ndb_api_trans_abort_count_slave</code></a> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_trans_abort_count"><code>Ndb_api_trans_abort_count</code></a> </p></li></ul> </div> </td> </tr><tr> <th><code>TransCloseCount</code></th> <td>Number of transactions aborted. (This value may be greater than the sum of <code>TransCommitCount</code> and <code>TransAbortCount</code>.)</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_trans_close_count_session"><code>Ndb_api_trans_close_count_session</code></a> </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_trans_close_count_slave"><code>Ndb_api_trans_close_count_slave</code></a> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_trans_close_count"><code>Ndb_api_trans_close_count</code></a> </p></li></ul> </div> </td> </tr><tr> <th><code>PkOpCount</code></th> <td>Number of operations based on or using primary keys. This count includes blob-part table operations, implicit unlocking operations, and auto-increment operations, as well as primary key operations normally visible to MySQL clients.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_pk_op_count_session"><code>Ndb_api_pk_op_count_session</code></a> </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_pk_op_count_slave"><code>Ndb_api_pk_op_count_slave</code></a> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_pk_op_count"><code>Ndb_api_pk_op_count</code></a> </p></li></ul> </div> </td> </tr><tr> <th><code>UkOpCount</code></th> <td>Number of operations based on or using unique keys.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_uk_op_count_session"><code>Ndb_api_uk_op_count_session</code></a> </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_uk_op_count_slave"><code>Ndb_api_uk_op_count_slave</code></a> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_uk_op_count"><code>Ndb_api_uk_op_count</code></a> </p></li></ul> </div> </td> </tr><tr> <th><code>TableScanCount</code></th> <td>Number of table scans that have been started. This includes scans of internal tables.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_table_scan_count_session"><code>Ndb_api_table_scan_count_session</code></a> </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_table_scan_count_slave"><code>Ndb_api_table_scan_count_slave</code></a> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_table_scan_count"><code>Ndb_api_table_scan_count</code></a> </p></li></ul> </div> </td> </tr><tr> <th><code>RangeScanCount</code></th> <td>Number of range scans that have been started.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_range_scan_count_session"><code>Ndb_api_range_scan_count_session</code></a> </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_range_scan_count_slave"><code>Ndb_api_range_scan_count_slave</code></a> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_range_scan_count"><code>Ndb_api_range_scan_count</code></a> </p></li></ul> </div> </td> </tr><tr> <th><code>PrunedScanCount</code></th> <td>Number of scans that have been pruned to a single partition.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_pruned_scan_count_session"><code>Ndb_api_pruned_scan_count_session</code></a> </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_pruned_scan_count_slave"><code>Ndb_api_pruned_scan_count_slave</code></a> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_pruned_scan_count"><code>Ndb_api_pruned_scan_count</code></a> </p></li></ul> </div> </td> </tr><tr> <th><code>ScanBatchCount</code></th> <td>Number of batches of rows received. (A <span class="firstterm">batch</span> in this context is a set of scan results from a single fragment.)</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_scan_batch_count_session"><code>Ndb_api_scan_batch_count_session</code></a> </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_scan_batch_count_slave"><code>Ndb_api_scan_batch_count_slave</code></a> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_scan_batch_count"><code>Ndb_api_scan_batch_count</code></a> </p></li></ul> </div> </td> </tr><tr> <th><code>ReadRowCount</code></th> <td>Total number of rows that have been read. Includes rows read using primary key, unique key, and scan operations.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_read_row_count_session"><code>Ndb_api_read_row_count_session</code></a> </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_read_row_count_slave"><code>Ndb_api_read_row_count_slave</code></a> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_read_row_count"><code>Ndb_api_read_row_count</code></a> </p></li></ul> </div> </td> </tr><tr> <th><code>TransLocalReadRowCount</code></th> <td>Number of rows read from the data same node on which the transaction was being run.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_trans_local_read_row_count_session"><code>Ndb_api_trans_local_read_row_count_session</code></a> </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_trans_local_read_row_count_slave"><code>Ndb_api_trans_local_read_row_count_slave</code></a> </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_trans_local_read_row_count"><code>Ndb_api_trans_local_read_row_count</code></a> </p></li></ul> </div> </td> </tr><tr> <th><code>DataEventsRecvdCount</code></th> <td>Number of row change events received.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> [none] </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_event_data_count_injector"><code>Ndb_api_event_data_count_injector</code></a> </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_event_data_count"><code>Ndb_api_event_data_count</code></a> </p></li></ul> </div> </td> </tr><tr> <th><code>NondataEventsRecvdCount</code></th> <td>Number of events received, other than row change events.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> [none] </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_event_nondata_count_injector"><code>Ndb_api_event_nondata_count_injector</code></a> </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_event_nondata_count"><code>Ndb_api_event_nondata_count</code></a> </p></li></ul> </div> </td> </tr><tr> <th><code>EventBytesRecvdCount</code></th> <td>Number of bytes of events received.</td> <td> <div class="itemizedlist"> <ul class="itemizedlist" style="list-style-type: disc; "><li class="listitem"><p> [none] </p></li><li class="listitem"><p> [none] </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_event_bytes_count_injector"><code>Ndb_api_event_bytes_count_injector</code></a> </p></li><li class="listitem"><p> <a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_event_bytes_count"><code>Ndb_api_event_bytes_count</code></a> </p></li></ul> </div> </td> </tr></tbody></table>

To see all counts of committed transactions—that is, all `TransCommitCount` counter status variables—you can filter the results of [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") for the substring `trans_commit_count`, like this:

```sql
mysql> SHOW STATUS LIKE '%trans_commit_count%';
+------------------------------------+-------+
| Variable_name                      | Value |
+------------------------------------+-------+
| Ndb_api_trans_commit_count_session | 1     |
| Ndb_api_trans_commit_count_slave   | 0     |
| Ndb_api_trans_commit_count         | 2     |
+------------------------------------+-------+
3 rows in set (0.00 sec)
```

From this you can determine that 1 transaction has been committed in the current [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client session, and 2 transactions have been committed on this [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") since it was last restarted.

You can see how various NDB API counters are incremented by a given SQL statement by comparing the values of the corresponding `_session` status variables immediately before and after performing the statement. In this example, after getting the initial values from [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), we create in the `test` database an [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") table, named `t`, that has a single column:

```sql
mysql> SHOW STATUS LIKE 'ndb_api%session%';
+--------------------------------------------+--------+
| Variable_name                              | Value  |
+--------------------------------------------+--------+
| Ndb_api_wait_exec_complete_count_session   | 2      |
| Ndb_api_wait_scan_result_count_session     | 0      |
| Ndb_api_wait_meta_request_count_session    | 3      |
| Ndb_api_wait_nanos_count_session           | 820705 |
| Ndb_api_bytes_sent_count_session           | 132    |
| Ndb_api_bytes_received_count_session       | 372    |
| Ndb_api_trans_start_count_session          | 1      |
| Ndb_api_trans_commit_count_session         | 1      |
| Ndb_api_trans_abort_count_session          | 0      |
| Ndb_api_trans_close_count_session          | 1      |
| Ndb_api_pk_op_count_session                | 1      |
| Ndb_api_uk_op_count_session                | 0      |
| Ndb_api_table_scan_count_session           | 0      |
| Ndb_api_range_scan_count_session           | 0      |
| Ndb_api_pruned_scan_count_session          | 0      |
| Ndb_api_scan_batch_count_session           | 0      |
| Ndb_api_read_row_count_session             | 1      |
| Ndb_api_trans_local_read_row_count_session | 1      |
+--------------------------------------------+--------+
18 rows in set (0.00 sec)

mysql> USE test;
Database changed
mysql> CREATE TABLE t (c INT) ENGINE NDBCLUSTER;
Query OK, 0 rows affected (0.85 sec)
```

Now you can execute a new [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") statement and observe the changes, as shown here (with the changed rows highlighted in the output):

```sql
mysql> SHOW STATUS LIKE 'ndb_api%session%';
+--------------------------------------------+-----------+
| Variable_name                              | Value     |
+--------------------------------------------+-----------+
| Ndb_api_wait_exec_complete_count_session   | 8         |
| Ndb_api_wait_scan_result_count_session     | 0         |
| Ndb_api_wait_meta_request_count_session    | 17        |
| Ndb_api_wait_nanos_count_session           | 706871709 |
| Ndb_api_bytes_sent_count_session           | 2376      |
| Ndb_api_bytes_received_count_session       | 3844      |
| Ndb_api_trans_start_count_session          | 4         |
| Ndb_api_trans_commit_count_session         | 4         |
| Ndb_api_trans_abort_count_session          | 0         |
| Ndb_api_trans_close_count_session          | 4         |
| Ndb_api_pk_op_count_session                | 6         |
| Ndb_api_uk_op_count_session                | 0         |
| Ndb_api_table_scan_count_session           | 0         |
| Ndb_api_range_scan_count_session           | 0         |
| Ndb_api_pruned_scan_count_session          | 0         |
| Ndb_api_scan_batch_count_session           | 0         |
| Ndb_api_read_row_count_session             | 2         |
| Ndb_api_trans_local_read_row_count_session | 1         |
+--------------------------------------------+-----------+
18 rows in set (0.00 sec)
```

Similarly, you can see the changes in the NDB API statistics counters caused by inserting a row into `t`: Insert the row, then run the same [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") statement used in the previous example, as shown here:

```sql
mysql> INSERT INTO t VALUES (100);
Query OK, 1 row affected (0.00 sec)

mysql> SHOW STATUS LIKE 'ndb_api%session%';
+--------------------------------------------+-----------+
| Variable_name                              | Value     |
+--------------------------------------------+-----------+
| Ndb_api_wait_exec_complete_count_session   | 11        |
| Ndb_api_wait_scan_result_count_session     | 6         |
| Ndb_api_wait_meta_request_count_session    | 20        |
| Ndb_api_wait_nanos_count_session           | 707370418 |
| Ndb_api_bytes_sent_count_session           | 2724      |
| Ndb_api_bytes_received_count_session       | 4116      |
| Ndb_api_trans_start_count_session          | 7         |
| Ndb_api_trans_commit_count_session         | 6         |
| Ndb_api_trans_abort_count_session          | 0         |
| Ndb_api_trans_close_count_session          | 7         |
| Ndb_api_pk_op_count_session                | 8         |
| Ndb_api_uk_op_count_session                | 0         |
| Ndb_api_table_scan_count_session           | 1         |
| Ndb_api_range_scan_count_session           | 0         |
| Ndb_api_pruned_scan_count_session          | 0         |
| Ndb_api_scan_batch_count_session           | 0         |
| Ndb_api_read_row_count_session             | 3         |
| Ndb_api_trans_local_read_row_count_session | 2         |
+--------------------------------------------+-----------+
18 rows in set (0.00 sec)
```

We can make a number of observations from these results:

* Although we created `t` with no explicit primary key, 5 primary key operations were performed in doing so (the difference in the “before” and “after” values of [`Ndb_api_pk_op_count_session`](mysql-cluster-options-variables.html#statvar_Ndb_api_pk_op_count_session), or 6 minus 1). This reflects the creation of the hidden primary key that is a feature of all tables using the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine.

* By comparing successive values for [`Ndb_api_wait_nanos_count_session`](mysql-cluster-options-variables.html#statvar_Ndb_api_wait_nanos_count_session), we can see that the NDB API operations implementing the [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement waited much longer (706871709 - 820705 = 706051004 nanoseconds, or approximately 0.7 second) for responses from the data nodes than those executed by the [`INSERT`](insert.html "13.2.5 INSERT Statement") (707370418 - 706871709 = 498709 ns or roughly .0005 second). The execution times reported for these statements in the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client correlate roughly with these figures.

  On platforms without sufficient (nanosecond) time resolution, small changes in the value of the `WaitNanosCount` NDB API counter due to SQL statements that execute very quickly may not always be visible in the values of [`Ndb_api_wait_nanos_count_session`](mysql-cluster-options-variables.html#statvar_Ndb_api_wait_nanos_count_session), [`Ndb_api_wait_nanos_count_slave`](mysql-cluster-options-variables.html#statvar_Ndb_api_wait_nanos_count_slave), or [`Ndb_api_wait_nanos_count`](mysql-cluster-options-variables.html#statvar_Ndb_api_wait_nanos_count).

* The [`INSERT`](insert.html "13.2.5 INSERT Statement") statement incremented both the `ReadRowCount` and `TransLocalReadRowCount` NDB API statistics counters, as reflected by the increased values of [`Ndb_api_read_row_count_session`](mysql-cluster-options-variables.html#statvar_Ndb_api_read_row_count_session) and [`Ndb_api_trans_local_read_row_count_session`](mysql-cluster-options-variables.html#statvar_Ndb_api_trans_local_read_row_count_session).
