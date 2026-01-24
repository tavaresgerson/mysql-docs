### 25.12.11 Performance Schema Replication Tables

[25.12.11.1 The replication_connection_configuration Table](performance-schema-replication-connection-configuration-table.html)

[25.12.11.2 The replication_connection_status Table](performance-schema-replication-connection-status-table.html)

[25.12.11.3 The replication_applier_configuration Table](performance-schema-replication-applier-configuration-table.html)

[25.12.11.4 The replication_applier_status Table](performance-schema-replication-applier-status-table.html)

[25.12.11.5 The replication_applier_status_by_coordinator Table](performance-schema-replication-applier-status-by-coordinator-table.html)

[25.12.11.6 The replication_applier_status_by_worker Table](performance-schema-replication-applier-status-by-worker-table.html)

[25.12.11.7 The replication_group_member_stats Table](performance-schema-replication-group-member-stats-table.html)

[25.12.11.8 The replication_group_members Table](performance-schema-replication-group-members-table.html)

The Performance Schema provides tables that expose replication information. This is similar to the information available from the [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") statement, but representation in table form is more accessible and has usability benefits:

* [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") output is useful for visual inspection, but not so much for programmatic use. By contrast, using the Performance Schema tables, information about replica status can be searched using general [`SELECT`](select.html "13.2.9 SELECT Statement") queries, including complex `WHERE` conditions, joins, and so forth.

* Query results can be saved in tables for further analysis, or assigned to variables and thus used in stored procedures.

* The replication tables provide better diagnostic information. For multithreaded replica operation, [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") reports all coordinator and worker thread errors using the `Last_SQL_Errno` and `Last_SQL_Error` fields, so only the most recent of those errors is visible and information can be lost. The replication tables store errors on a per-thread basis without loss of information.

* The last seen transaction is visible in the replication tables on a per-worker basis. This is information not avilable from [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement").

* Developers familiar with the Performance Schema interface can extend the replication tables to provide additional information by adding rows to the tables.

#### Replication Table Descriptions

The Performance Schema provides the following replication-related tables:

* Tables that contain information about the connection of a replica to the replication source server:

  + [`replication_connection_configuration`](performance-schema-replication-connection-configuration-table.html "25.12.11.1 The replication_connection_configuration Table"): Configuration parameters for connecting to the source

  + [`replication_connection_status`](performance-schema-replication-connection-status-table.html "25.12.11.2 The replication_connection_status Table"): Current status of the connection to the source

* Tables that contain general (not thread-specific) information about the transaction applier:

  + [`replication_applier_configuration`](performance-schema-replication-applier-configuration-table.html "25.12.11.3 The replication_applier_configuration Table"): Configuration parameters for the transaction applier on the replica.

  + [`replication_applier_status`](performance-schema-replication-applier-status-table.html "25.12.11.4 The replication_applier_status Table"): Current status of the transaction applier on the replica.

* Tables that contain information about specific threads responsible for applying transactions received from the source:

  + [`replication_applier_status_by_coordinator`](performance-schema-replication-applier-status-by-coordinator-table.html "25.12.11.5 The replication_applier_status_by_coordinator Table"): Status of the coordinator thread (empty unless the replica is multithreaded).

  + [`replication_applier_status_by_worker`](performance-schema-replication-applier-status-by-worker-table.html "25.12.11.6 The replication_applier_status_by_worker Table"): Status of the applier thread or worker threads if the replica is multithreaded.

* Tables that contain information about replication group members:

  + [`replication_group_members`](performance-schema-replication-group-members-table.html "25.12.11.8 The replication_group_members Table"): Provides network and status information for group members.

  + [`replication_group_member_stats`](performance-schema-replication-group-member-stats-table.html "25.12.11.7 The replication_group_member_stats Table"): Provides statistical information about group members and transaction in which they participate.

The following sections describe each replication table in more detail, including the correspondence between the columns produced by [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") and the replication table columns in which the same information appears.

The remainder of this introduction to the replication tables describes how the Performance Schema populates them and which fields from [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") are not represented in the tables.

#### Replication Table Life Cycle

The Performance Schema populates the replication tables as follows:

* Prior to execution of [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement"), the tables are empty.

* After [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement"), the configuration parameters can be seen in the tables. At this time, there are no active replica threads, so the `THREAD_ID` columns are `NULL` and the `SERVICE_STATE` columns have a value of `OFF`.

* After [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement"), non-`NULL` `THREAD_ID` values can be seen. Threads that are idle or active have a `SERVICE_STATE` value of `ON`. The thread that connects to the source has a value of `CONNECTING` while it establishes the connection, and `ON` thereafter as long as the connection lasts.

* After [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement"), the `THREAD_ID` columns become `NULL` and the `SERVICE_STATE` columns for threads that no longer exist have a value of `OFF`.

* The tables are preserved after [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") or threads dying due to an error.

* The [`replication_applier_status_by_worker`](performance-schema-replication-applier-status-by-worker-table.html "25.12.11.6 The replication_applier_status_by_worker Table") table is nonempty only when the replica is operating in multithreaded mode. That is, if the [`slave_parallel_workers`](replication-options-replica.html#sysvar_slave_parallel_workers) system variable is greater than 0, this table is populated when [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") is executed, and the number of rows shows the number of workers.

#### [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") Information Not In the Replication Tables

The information in the Performance Schema replication tables differs somewhat from the information available from [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") because the tables are oriented toward use of global transaction identifiers (GTIDs), not file names and positions, and they represent server UUID values, not server ID values. Due to these differences, several [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") columns are not preserved in the Performance Schema replication tables, or are represented a different way:

* The following fields refer to file names and positions and are not preserved:

  ```sql
  Master_Log_File
  Read_Master_Log_Pos
  Relay_Log_File
  Relay_Log_Pos
  Relay_Master_Log_File
  Exec_Master_Log_Pos
  Until_Condition
  Until_Log_File
  Until_Log_Pos
  ```

* The `Master_Info_File` field is not preserved. It refers to the `master.info` file, which has been superseded by crash-safe tables.

* The following fields are based on [`server_id`](replication-options.html#sysvar_server_id), not [`server_uuid`](replication-options.html#sysvar_server_uuid), and are not preserved:

  ```sql
  Master_Server_Id
  Replicate_Ignore_Server_Ids
  ```

* The `Skip_Counter` field is based on event counts, not GTIDs, and is not preserved.

* These error fields are aliases for `Last_SQL_Errno` and `Last_SQL_Error`, so they are not preserved:

  ```sql
  Last_Errno
  Last_Error
  ```

  In the Performance Schema, this error information is available in the `LAST_ERROR_NUMBER` and `LAST_ERROR_MESSAGE` columns of the [`replication_applier_status_by_worker`](performance-schema-replication-applier-status-by-worker-table.html "25.12.11.6 The replication_applier_status_by_worker Table") table (and [`replication_applier_status_by_coordinator`](performance-schema-replication-applier-status-by-coordinator-table.html "25.12.11.5 The replication_applier_status_by_coordinator Table") if the replica is multithreaded). Those tables provide more specific per-thread error information than is available from `Last_Errno` and `Last_Error`.

* Fields that provide information about command-line filtering options is not preserved:

  ```sql
  Replicate_Do_DB
  Replicate_Ignore_DB
  Replicate_Do_Table
  Replicate_Ignore_Table
  Replicate_Wild_Do_Table
  Replicate_Wild_Ignore_Table
  ```

* The `Slave_IO_State` and `Slave_SQL_Running_State` fields are not preserved. If needed, these values can be obtained from the process list by using the `THREAD_ID` column of the appropriate replication table and joining it with the `ID` column in the `INFORMATION_SCHEMA` [`PROCESSLIST`](information-schema-processlist-table.html "24.3.18 The INFORMATION_SCHEMA PROCESSLIST Table") table to select the `STATE` column of the latter table.

* The `Executed_Gtid_Set` field can show a large set with a great deal of text. Instead, the Performance Schema tables show GTIDs of transactions that are currently being applied by the replica. Alternatively, the set of executed GTIDs can be obtained from the value of the [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) system variable.

* The `Seconds_Behind_Master` and `Relay_Log_Space` fields are in to-be-decided status and are not preserved.

#### Status Variables Moved to Replication Tables

As of MySQL version 5.7.5, the following status variables (previously monitored using [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement")) were moved to the Perfomance Schema replication tables:

* [`Slave_retried_transactions`](server-status-variables.html#statvar_Slave_retried_transactions)
* [`Slave_last_heartbeat`](server-status-variables.html#statvar_Slave_last_heartbeat)
* [`Slave_received_heartbeats`](server-status-variables.html#statvar_Slave_received_heartbeats)
* [`Slave_heartbeat_period`](server-status-variables.html#statvar_Slave_heartbeat_period)
* [`Slave_running`](server-status-variables.html#statvar_Slave_running)

These status variables are now only relevant when a single replication channel is being used because they *only* report the status of the default replication channel. When multiple replication channels exist, use the Performance Schema replication tables described in this section, which report these variables for each existing replication channel.

#### Replication Channels

The first column of the replication Performance Schema tables is `CHANNEL_NAME`. This enables the tables to be viewed per replication channel. In a non-multisource replication setup there is a single default replication channel. When you are using multiple replication channels on a replica, you can filter the tables per replication channel to monitor a specific replication channel. See [Section 16.2.2, “Replication Channels”](replication-channels.html "16.2.2 Replication Channels") and [Section 16.1.5.8, “Multi-Source Replication Monitoring”](replication-multi-source-monitoring.html "16.1.5.8 Multi-Source Replication Monitoring") for more information.
