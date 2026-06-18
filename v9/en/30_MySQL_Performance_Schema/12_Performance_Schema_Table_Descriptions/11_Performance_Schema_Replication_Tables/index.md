### 29.12.11 Performance Schema Replication Tables

[29.12.11.1 The binary\_log\_transaction\_compression\_stats Table](performance-schema-binary-log-transaction-compression-stats-table.html)

[29.12.11.2 The replication\_applier\_configuration Table](performance-schema-replication-applier-configuration-table.html)

[29.12.11.3 The replication\_applier\_filters Table](performance-schema-replication-applier-filters-table.html)

[29.12.11.4 The replication\_applier\_global\_filters Table](performance-schema-replication-applier-global-filters-table.html)

[29.12.11.5 The replication\_applier\_metrics Table](performance-schema-replication-applier-metrics-table.html)

[29.12.11.6 The replication\_applier\_progress\_by\_worker Table](performance-schema-replication-applier-progress-by-worker-table.html)

[29.12.11.7 The replication\_applier\_status Table](performance-schema-replication-applier-status-table.html)

[29.12.11.8 The replication\_applier\_status\_by\_coordinator Table](performance-schema-replication-applier-status-by-coordinator-table.html)

[29.12.11.9 The replication\_applier\_status\_by\_worker Table](performance-schema-replication-applier-status-by-worker-table.html)

[29.12.11.10 The replication\_asynchronous\_connection\_failover Table](performance-schema-replication-asynchronous-connection-failover-table.html)

[29.12.11.11 The replication\_asynchronous\_connection\_failover\_managed Table](performance-schema-replication-asynchronous-connection-failover-managed-table.html)

[29.12.11.12 The replication\_connection\_configuration Table](performance-schema-replication-connection-configuration-table.html)

[29.12.11.13 The replication\_connection\_status Table](performance-schema-replication-connection-status-table.html)

[29.12.11.14 The replication\_group\_communication\_information Table](performance-schema-replication-group-communication-information-table.html)

[29.12.11.15 The replication\_group\_configuration\_version Table](performance-schema-replication-group-configuration-version-table.html)

[29.12.11.16 The replication\_group\_member\_actions Table](performance-schema-replication-group-member-actions-table.html)

[29.12.11.17 The replication\_group\_member\_stats Table](performance-schema-replication-group-member-stats-table.html)

[29.12.11.18 The replication\_group\_members Table](performance-schema-replication-group-members-table.html)

The Performance Schema provides tables that expose replication
information. This is similar to the information available from
the [`SHOW
REPLICA STATUS`](show-replica-status.html "15.7.7.36 SHOW REPLICA STATUS Statement") statement, but representation in table
form is more accessible and has usability benefits:

* [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.36 SHOW REPLICA STATUS Statement") output is
  useful for visual inspection, but not so much for
  programmatic use. By contrast, using the Performance Schema
  tables, information about replica status can be searched
  using general [`SELECT`](select.html "15.2.13 SELECT Statement") queries,
  including complex `WHERE` conditions,
  joins, and so forth.

* Query results can be saved in tables for further analysis,
  or assigned to variables and thus used in stored procedures.

* The replication tables provide better diagnostic
  information. For multithreaded replica operation,
  [`SHOW
  REPLICA STATUS`](show-replica-status.html "15.7.7.36 SHOW REPLICA STATUS Statement") reports all coordinator and worker
  thread errors using the `Last_SQL_Errno`
  and `Last_SQL_Error` fields, so only the
  most recent of those errors is visible and information can
  be lost. The replication tables store errors on a per-thread
  basis without loss of information.

* The last seen transaction is visible in the replication
  tables on a per-worker basis. This is information not
  available from
  [`SHOW
  REPLICA STATUS`](show-replica-status.html "15.7.7.36 SHOW REPLICA STATUS Statement").

* Developers familiar with the Performance Schema interface
  can extend the replication tables to provide additional
  information by adding rows to the tables.

Note

MySQL Enterprise Edition includes two components which provide information
relating to replication performance. The Group Replication
Flow Control Statistics component enables several server
status variables which provide information on Group
Replication flow control execution; see
[Section 7.5.6.2, “Group Replication Flow Control Statistics Component”](group-replication-flow-control-stats-component.html "7.5.6.2 Group Replication Flow Control Statistics Component").
The Replication Applier Metrics component implements two
Performance Schema tables
[`replication_applier_metrics`](performance-schema-replication-applier-metrics-table.html "29.12.11.5 The replication_applier_metrics Table") and
[`replication_applier_progress_by_worker`](performance-schema-replication-applier-progress-by-worker-table.html "29.12.11.6 The replication_applier_progress_by_worker Table"),
both of which are described later in this section; for
information about the component, see
[Section 7.5.6.1, “Replication Applier Metrics Component”](replication-applier-metrics-component.html "7.5.6.1 Replication Applier Metrics Component").

#### Replication Table Descriptions

The Performance Schema provides the following
replication-related tables:

* Tables that contain information about the connection of the
  replica to the source:

  + [`replication_connection_configuration`](performance-schema-replication-connection-configuration-table.html "29.12.11.12 The replication_connection_configuration Table"):
    Configuration parameters for connecting to the source

  + [`replication_connection_status`](performance-schema-replication-connection-status-table.html "29.12.11.13 The replication_connection_status Table"):
    Current status of the connection to the source

  + [`replication_asynchronous_connection_failover`](performance-schema-replication-asynchronous-connection-failover-table.html "29.12.11.10 The replication_asynchronous_connection_failover Table"):
    Source lists for the asynchronous connection failover
    mechanism

* Tables that contain general (not thread-specific)
  information about the transaction applier:

  + [`replication_applier_configuration`](performance-schema-replication-applier-configuration-table.html "29.12.11.2 The replication_applier_configuration Table"):
    Configuration parameters for the transaction applier on
    the replica.

  + [`replication_applier_status`](performance-schema-replication-applier-status-table.html "29.12.11.7 The replication_applier_status Table"):
    Current status of the transaction applier on the
    replica.

* Tables that contain information about specific threads
  responsible for applying transactions received from the
  source:

  + [`replication_applier_status_by_coordinator`](performance-schema-replication-applier-status-by-coordinator-table.html "29.12.11.8 The replication_applier_status_by_coordinator Table"):
    Status of the coordinator thread (empty unless the
    replica is multithreaded).

  + [`replication_applier_status_by_worker`](performance-schema-replication-applier-status-by-worker-table.html "29.12.11.9 The replication_applier_status_by_worker Table"):
    Status of the applier thread or worker threads if the
    replica is multithreaded.

* Tables that contain information about channel based
  replication filters:

  + [`replication_applier_filters`](performance-schema-replication-applier-filters-table.html "29.12.11.3 The replication_applier_filters Table"):
    Provides information about the replication filters
    configured on specific replication channels.

  + [`replication_applier_global_filters`](performance-schema-replication-applier-global-filters-table.html "29.12.11.4 The replication_applier_global_filters Table"):
    Provides information about global replication filters,
    which apply to all replication channels.

* Tables that contain information about Group Replication
  members:

  + [`replication_group_members`](performance-schema-replication-group-members-table.html "29.12.11.18 The replication_group_members Table"):
    Provides network and status information for group
    members.

  + [`replication_group_member_stats`](performance-schema-replication-group-member-stats-table.html "29.12.11.17 The replication_group_member_stats Table"):
    Provides statistical information about group members and
    transactions in which they participate.

  For more information see
  [Section 20.4, “Monitoring Group Replication”](group-replication-monitoring.html "20.4 Monitoring Group Replication").

The following Performance Schema replication tables continue to
be populated when the Performance Schema is disabled:

* [`replication_connection_configuration`](performance-schema-replication-connection-configuration-table.html "29.12.11.12 The replication_connection_configuration Table")
* [`replication_connection_status`](performance-schema-replication-connection-status-table.html "29.12.11.13 The replication_connection_status Table")
* [`replication_asynchronous_connection_failover`](performance-schema-replication-asynchronous-connection-failover-table.html "29.12.11.10 The replication_asynchronous_connection_failover Table")
* [`replication_applier_configuration`](performance-schema-replication-applier-configuration-table.html "29.12.11.2 The replication_applier_configuration Table")
* [`replication_applier_status`](performance-schema-replication-applier-status-table.html "29.12.11.7 The replication_applier_status Table")
* [`replication_applier_status_by_coordinator`](performance-schema-replication-applier-status-by-coordinator-table.html "29.12.11.8 The replication_applier_status_by_coordinator Table")
* [`replication_applier_status_by_worker`](performance-schema-replication-applier-status-by-worker-table.html "29.12.11.9 The replication_applier_status_by_worker Table")

The exception is local timing information (start and end
timestamps for transactions) in the replication tables
[`replication_connection_status`](performance-schema-replication-connection-status-table.html "29.12.11.13 The replication_connection_status Table"),
[`replication_applier_status_by_coordinator`](performance-schema-replication-applier-status-by-coordinator-table.html "29.12.11.8 The replication_applier_status_by_coordinator Table"),
and
[`replication_applier_status_by_worker`](performance-schema-replication-applier-status-by-worker-table.html "29.12.11.9 The replication_applier_status_by_worker Table").
This information is not collected when the Performance Schema is
disabled.

The following sections describe each replication table in more
detail, including the correspondence between the columns
produced by
[`SHOW
REPLICA STATUS`](show-replica-status.html "15.7.7.36 SHOW REPLICA STATUS Statement") and the replication table columns in
which the same information appears.

The remainder of this introduction to the replication tables
describes how the Performance Schema populates them and which
fields from
[`SHOW
REPLICA STATUS`](show-replica-status.html "15.7.7.36 SHOW REPLICA STATUS Statement") are not represented in the tables.

#### Replication Table Life Cycle

The Performance Schema populates the replication tables as
follows:

* Prior to execution of [`CHANGE
  REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement"), the tables are empty.

* After [`CHANGE REPLICATION SOURCE
  TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement"), the configuration parameters can be seen in
  the tables. At this time, there are no active replication
  threads, so the `THREAD_ID` columns are
  `NULL` and the
  `SERVICE_STATE` columns have a value of
  `OFF`.

* After [`START
  REPLICA`](start-replica.html "15.4.2.4 START REPLICA Statement"), non-null `THREAD_ID`
  values can be seen. Threads that are idle or active have a
  `SERVICE_STATE` value of
  `ON`. The thread that connects to the
  source has a value of `CONNECTING` while it
  establishes the connection, and `ON`
  thereafter as long as the connection lasts.

* After [`STOP
  REPLICA`](stop-replica.html "15.4.2.5 STOP REPLICA Statement"), the `THREAD_ID` columns
  become `NULL` and the
  `SERVICE_STATE` columns for threads that no
  longer exist have a value of `OFF`.

* The tables are preserved after
  [`STOP
  REPLICA`](stop-replica.html "15.4.2.5 STOP REPLICA Statement") or threads stopping due to an error.

* This table is populated when
  [`START
  REPLICA`](start-replica.html "15.4.2.4 START REPLICA Statement") is executed, and the number of rows shows
  the number of workers.

#### Replica Status Information Not In the Replication Tables

The information in the Performance Schema replication tables
differs somewhat from the information available from
[`SHOW
REPLICA STATUS`](show-replica-status.html "15.7.7.36 SHOW REPLICA STATUS Statement") because the tables are oriented toward
use of global transaction identifiers (GTIDs), not file names
and positions, and they represent server UUID values, not server
ID values. Due to these differences, several
[`SHOW
REPLICA STATUS`](show-replica-status.html "15.7.7.36 SHOW REPLICA STATUS Statement") columns are not preserved in the
Performance Schema replication tables, or are represented a
different way:

* The following fields refer to file names and positions and
  are not preserved:

  ```
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

* The `Master_Info_File` field is not
  preserved. It refers to the `master.info`
  file used for the replica's source metadata repository,
  which has been superseded by the use of crash-safe tables
  for the repository.

* The following fields are based on
  [`server_id`](replication-options.html#sysvar_server_id), not
  [`server_uuid`](replication-options.html#sysvar_server_uuid), and are not
  preserved:

  ```
  Master_Server_Id
  Replicate_Ignore_Server_Ids
  ```

* The `Skip_Counter` field is based on event
  counts, not GTIDs, and is not preserved.

* These error fields are aliases for
  `Last_SQL_Errno` and
  `Last_SQL_Error`, so they are not
  preserved:

  ```
  Last_Errno
  Last_Error
  ```

  In the Performance Schema, this error information is
  available in the `LAST_ERROR_NUMBER` and
  `LAST_ERROR_MESSAGE` columns of the
  [`replication_applier_status_by_worker`](performance-schema-replication-applier-status-by-worker-table.html "29.12.11.9 The replication_applier_status_by_worker Table")
  table (and
  [`replication_applier_status_by_coordinator`](performance-schema-replication-applier-status-by-coordinator-table.html "29.12.11.8 The replication_applier_status_by_coordinator Table")
  if the replica is multithreaded). Those tables provide more
  specific per-thread error information than is available from
  `Last_Errno` and
  `Last_Error`.

* Fields that provide information about command-line filtering
  options is not preserved:

  ```
  Replicate_Do_DB
  Replicate_Ignore_DB
  Replicate_Do_Table
  Replicate_Ignore_Table
  Replicate_Wild_Do_Table
  Replicate_Wild_Ignore_Table
  ```

* The `Replica_IO_State` and
  `Replica_SQL_Running_State` fields are not
  preserved. If needed, these values can be obtained from the
  process list by using the `THREAD_ID`
  column of the appropriate replication table and joining it
  with the `ID` column in the
  `INFORMATION_SCHEMA`
  [`PROCESSLIST`](information-schema-processlist-table.html "28.3.28 The INFORMATION_SCHEMA PROCESSLIST Table") table to select the
  `STATE` column of the latter table.

* The `Executed_Gtid_Set` field can show a
  large set with a great deal of text. Instead, the
  Performance Schema tables show GTIDs of transactions that
  are currently being applied by the replica. Alternatively,
  the set of executed GTIDs can be obtained from the value of
  the [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) system
  variable.

* The `Seconds_Behind_Master` and
  `Relay_Log_Space` fields are in
  to-be-decided status and are not preserved.

#### Replication Channels

The first column of the replication Performance Schema tables is
`CHANNEL_NAME`. This enables the tables to be
viewed per replication channel. In a non-multisource replication
setup there is a single default replication channel. When you
are using multiple replication channels on a replica, you can
filter the tables per replication channel to monitor a specific
replication channel. See [Section 19.2.2, “Replication Channels”](replication-channels.html "19.2.2 Replication Channels")
and [Section 19.1.5.8, “Monitoring Multi-Source Replication”](replication-multi-source-monitoring.html "19.1.5.8 Monitoring Multi-Source Replication") for
more information.