#### 16.1.7.1 Checking Replication Status

The most common task when managing a replication process is to ensure that replication is taking place and that there have been no errors between the replica and the source.

The [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") statement, which you must execute on each replica, provides information about the configuration and status of the connection between the replica server and the source server. From MySQL 5.7, the Performance Schema has replication tables that provide this information in a more accessible form. See [Section 25.12.11, “Performance Schema Replication Tables”](performance-schema-replication-tables.html "25.12.11 Performance Schema Replication Tables").

The [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") statement also provided some information relating specifically to replicas. As of MySQL version 5.7.5, the following status variables previously monitored using [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") were deprecated and moved to the Performance Schema replication tables:

* [`Slave_retried_transactions`](server-status-variables.html#statvar_Slave_retried_transactions)
* [`Slave_last_heartbeat`](server-status-variables.html#statvar_Slave_last_heartbeat)
* [`Slave_received_heartbeats`](server-status-variables.html#statvar_Slave_received_heartbeats)
* [`Slave_heartbeat_period`](server-status-variables.html#statvar_Slave_heartbeat_period)
* [`Slave_running`](server-status-variables.html#statvar_Slave_running)

The replication heartbeat information shown in the Performance Schema replication tables lets you check that the replication connection is active even if the source has not sent events to the replica recently. The source sends a heartbeat signal to a replica if there are no updates to, and no unsent events in, the binary log for a longer period than the heartbeat interval. The `MASTER_HEARTBEAT_PERIOD` setting on the source (set by the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement) specifies the frequency of the heartbeat, which defaults to half of the connection timeout interval for the replica ([`slave_net_timeout`](replication-options-replica.html#sysvar_slave_net_timeout)). The [`replication_connection_status`](performance-schema-replication-connection-status-table.html "25.12.11.2 The replication_connection_status Table") Performance Schema table shows when the most recent heartbeat signal was received by a replica, and how many heartbeat signals it has received.

If you are using the [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") statement to check on the status of an individual replica, the statement provides the following information:

```sql
mysql> SHOW SLAVE STATUS\G
*************************** 1. row ***************************
               Slave_IO_State: Waiting for master to send event
                  Master_Host: source1
                  Master_User: root
                  Master_Port: 3306
                Connect_Retry: 60
              Master_Log_File: mysql-bin.000004
          Read_Master_Log_Pos: 931
               Relay_Log_File: replica1-relay-bin.000056
                Relay_Log_Pos: 950
        Relay_Master_Log_File: mysql-bin.000004
             Slave_IO_Running: Yes
            Slave_SQL_Running: Yes
              Replicate_Do_DB:
          Replicate_Ignore_DB:
           Replicate_Do_Table:
       Replicate_Ignore_Table:
      Replicate_Wild_Do_Table:
  Replicate_Wild_Ignore_Table:
                   Last_Errno: 0
                   Last_Error:
                 Skip_Counter: 0
          Exec_Master_Log_Pos: 931
              Relay_Log_Space: 1365
              Until_Condition: None
               Until_Log_File:
                Until_Log_Pos: 0
           Master_SSL_Allowed: No
           Master_SSL_CA_File:
           Master_SSL_CA_Path:
              Master_SSL_Cert:
            Master_SSL_Cipher:
               Master_SSL_Key:
        Seconds_Behind_Master: 0
Master_SSL_Verify_Server_Cert: No
                Last_IO_Errno: 0
                Last_IO_Error:
               Last_SQL_Errno: 0
               Last_SQL_Error:
  Replicate_Ignore_Server_Ids: 0
```

The key fields from the status report to examine are:

* `Slave_IO_State`: The current status of the replica. See [Section 8.14.6, “Replication Replica I/O Thread States”](replica-io-thread-states.html "8.14.6 Replication Replica I/O Thread States"), and [Section 8.14.7, “Replication Replica SQL Thread States”](replica-sql-thread-states.html "8.14.7 Replication Replica SQL Thread States"), for more information.

* `Slave_IO_Running`: Whether the I/O thread for reading the source's binary log is running. Normally, you want this to be `Yes` unless you have not yet started replication or have explicitly stopped it with [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement").

* `Slave_SQL_Running`: Whether the SQL thread for executing events in the relay log is running. As with the I/O thread, this should normally be `Yes`.

* `Last_IO_Error`, `Last_SQL_Error`: The last errors registered by the I/O and SQL threads when processing the relay log. Ideally these should be blank, indicating no errors.

* `Seconds_Behind_Master`: The number of seconds that the replication SQL thread is behind processing the source's binary log. A high number (or an increasing one) can indicate that the replica is unable to handle events from the source in a timely fashion.

  A value of 0 for `Seconds_Behind_Master` can usually be interpreted as meaning that the replica has caught up with the source, but there are some cases where this is not strictly true. For example, this can occur if the network connection between source and replica is broken but the replication I/O thread has not yet noticed this—that is, [`slave_net_timeout`](replication-options-replica.html#sysvar_slave_net_timeout) has not yet elapsed.

  It is also possible that transient values for `Seconds_Behind_Master` may not reflect the situation accurately. When the replication SQL thread has caught up on I/O, `Seconds_Behind_Master` displays 0; but when the replication I/O thread is still queuing up a new event, `Seconds_Behind_Master` may show a large value until the SQL thread finishes executing the new event. This is especially likely when the events have old timestamps; in such cases, if you execute [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") several times in a relatively short period, you may see this value change back and forth repeatedly between 0 and a relatively large value.

Several pairs of fields provide information about the progress of the replica in reading events from the source's binary log and processing them in the relay log:

* (`Master_Log_file`, `Read_Master_Log_Pos`): Coordinates in the source's binary log indicating how far the replication I/O thread has read events from that log.

* (`Relay_Master_Log_File`, `Exec_Master_Log_Pos`): Coordinates in the source's binary log indicating how far the replication SQL thread has executed events received from that log.

* (`Relay_Log_File`, `Relay_Log_Pos`): Coordinates in the replica's relay log indicating how far the replication SQL thread has executed the relay log. These correspond to the preceding coordinates, but are expressed in the replica's relay log coordinates rather than the source's binary log coordinates.

On the source, you can check the status of connected replicas using [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") to examine the list of running processes. Replica connections have `Binlog Dump` in the `Command` field:

```sql
mysql> SHOW PROCESSLIST \G;
*************************** 4. row ***************************
     Id: 10
   User: root
   Host: replica1:58371
     db: NULL
Command: Binlog Dump
   Time: 777
  State: Has sent all binlog to slave; waiting for binlog to be updated
   Info: NULL
```

Because it is the replica that drives the replication process, very little information is available in this report.

For replicas that were started with the [`--report-host`](replication-options-replica.html#sysvar_report_host) option and are connected to the source, the [`SHOW SLAVE HOSTS`](show-slave-hosts.html "13.7.5.33 SHOW SLAVE HOSTS Statement") statement on the source shows basic information about the replicas. The output includes the ID of the replica server, the value of the [`--report-host`](replication-options-replica.html#sysvar_report_host) option, the connecting port, and source ID:

```sql
mysql> SHOW SLAVE HOSTS;
+-----------+----------+------+-------------------+-----------+
| Server_id | Host     | Port | Rpl_recovery_rank | Master_id |
+-----------+----------+------+-------------------+-----------+
|        10 | replica1 | 3306 |                 0 |         1 |
+-----------+----------+------+-------------------+-----------+
1 row in set (0.00 sec)
```
