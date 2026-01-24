#### 13.7.5.34 SHOW SLAVE STATUS Statement

```sql
SHOW SLAVE STATUS [FOR CHANNEL channel]
```

This statement provides status information on essential parameters of the replica threads. It requires either the [`SUPER`](privileges-provided.html#priv_super) or [`REPLICATION CLIENT`](privileges-provided.html#priv_replication-client) privilege.

If you issue this statement using the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client, you can use a `\G` statement terminator rather than a semicolon to obtain a more readable vertical layout:

```sql
mysql> SHOW SLAVE STATUS\G
*************************** 1. row ***************************
               Slave_IO_State: Waiting for master to send event
                  Master_Host: localhost
                  Master_User: repl
                  Master_Port: 13000
                Connect_Retry: 60
              Master_Log_File: source-bin.000002
          Read_Master_Log_Pos: 1307
               Relay_Log_File: replica-relay-bin.000003
                Relay_Log_Pos: 1508
        Relay_Master_Log_File: source-bin.000002
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
          Exec_Master_Log_Pos: 1307
              Relay_Log_Space: 1858
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
  Replicate_Ignore_Server_Ids:
             Master_Server_Id: 1
                  Master_UUID: 3e11fa47-71ca-11e1-9e33-c80aa9429562
             Master_Info_File: /var/mysqld.2/data/master.info
                    SQL_Delay: 0
          SQL_Remaining_Delay: NULL
      Slave_SQL_Running_State: Reading event from the relay log
           Master_Retry_Count: 10
                  Master_Bind:
      Last_IO_Error_Timestamp:
     Last_SQL_Error_Timestamp:
               Master_SSL_Crl:
           Master_SSL_Crlpath:
           Retrieved_Gtid_Set: 3e11fa47-71ca-11e1-9e33-c80aa9429562:1-5
            Executed_Gtid_Set: 3e11fa47-71ca-11e1-9e33-c80aa9429562:1-5
                Auto_Position: 1
         Replicate_Rewrite_DB:
                 Channel_name:
           Master_TLS_Version: TLSv1.2
```

The Performance Schema provides tables that expose replication information. This is similar to the information available from the [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") statement, but represented in table form. For details, see [Section 25.12.11, “Performance Schema Replication Tables”](performance-schema-replication-tables.html "25.12.11 Performance Schema Replication Tables").

The following list describes the fields returned by [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement"). For additional information about interpreting their meanings, see [Section 16.1.7.1, “Checking Replication Status”](replication-administration-status.html "16.1.7.1 Checking Replication Status").

* `Slave_IO_State`

  A copy of the `State` field of the [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") output for the replica I/O thread. This tells you what the thread is doing: trying to connect to the source, waiting for events from the source, reconnecting to the source, and so on. For a listing of possible states, see [Section 8.14.6, “Replication Replica I/O Thread States”](replica-io-thread-states.html "8.14.6 Replication Replica I/O Thread States").

* `Master_Host`

  The source host that the replica is connected to.

* `Master_User`

  The user name of the account used to connect to the source.

* `Master_Port`

  The port used to connect to the source.

* `Connect_Retry`

  The number of seconds between connect retries (default 60). This can be set with the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement.

* `Master_Log_File`

  The name of the source binary log file from which the I/O thread is currently reading.

* `Read_Master_Log_Pos`

  The position in the current source binary log file up to which the I/O thread has read.

* `Relay_Log_File`

  The name of the relay log file from which the SQL thread is currently reading and executing.

* `Relay_Log_Pos`

  The position in the current relay log file up to which the SQL thread has read and executed.

* `Relay_Master_Log_File`

  The name of the source binary log file containing the most recent event executed by the SQL thread.

* `Slave_IO_Running`

  Whether the I/O thread is started and has connected successfully to the source. Internally, the state of this thread is represented by one of the following three values:

  + **MYSQL_SLAVE_NOT_RUN.** The replica I/O thread is not running. For this state, `Slave_IO_Running` is `No`.

  + **MYSQL_SLAVE_RUN_NOT_CONNECT.** The replica I/O thread is running, but is not connected to a replication source. For this state, `Slave_IO_Running` is `Connecting`.

  + **MYSQL_SLAVE_RUN_CONNECT.** The replica I/O thread is running, and is connected to a replication source. For this state, `Slave_IO_Running` is `Yes`.

  The value of the [`Slave_running`](server-status-variables.html#statvar_Slave_running) system status variable corresponds with this value.

* `Slave_SQL_Running`

  Whether the SQL thread is started.

* `Replicate_Do_DB`, `Replicate_Ignore_DB`

  The lists of databases that were specified with the [`--replicate-do-db`](replication-options-replica.html#option_mysqld_replicate-do-db) and [`--replicate-ignore-db`](replication-options-replica.html#option_mysqld_replicate-ignore-db) options, if any.

* `Replicate_Do_Table`, `Replicate_Ignore_Table`, `Replicate_Wild_Do_Table`, `Replicate_Wild_Ignore_Table`

  The lists of tables that were specified with the [`--replicate-do-table`](replication-options-replica.html#option_mysqld_replicate-do-table), [`--replicate-ignore-table`](replication-options-replica.html#option_mysqld_replicate-ignore-table), [`--replicate-wild-do-table`](replication-options-replica.html#option_mysqld_replicate-wild-do-table), and [`--replicate-wild-ignore-table`](replication-options-replica.html#option_mysqld_replicate-wild-ignore-table) options, if any.

* `Last_Errno`, `Last_Error`

  These columns are aliases for `Last_SQL_Errno` and `Last_SQL_Error`.

  Issuing [`RESET MASTER`](reset-master.html "13.4.1.2 RESET MASTER Statement") or [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") resets the values shown in these columns.

  Note

  When the replica SQL thread receives an error, it reports the error first, then stops the SQL thread. This means that there is a small window of time during which [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") shows a nonzero value for `Last_SQL_Errno` even though `Slave_SQL_Running` still displays `Yes`.

* `Skip_Counter`

  The current value of the [`sql_slave_skip_counter`](replication-options-replica.html#sysvar_sql_slave_skip_counter) system variable. See [Section 13.4.2.4, “SET GLOBAL sql_slave_skip_counter Syntax”](set-global-sql-slave-skip-counter.html "13.4.2.4 SET GLOBAL sql_slave_skip_counter Syntax").

* `Exec_Master_Log_Pos`

  The position in the current source binary log file to which the SQL thread has read and executed, marking the start of the next transaction or event to be processed. You can use this value with the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement's `MASTER_LOG_POS` option when starting a new replica from an existing replica, so that the new replica reads from this point. The coordinates given by (`Relay_Master_Log_File`, `Exec_Master_Log_Pos`) in the source's binary log correspond to the coordinates given by (`Relay_Log_File`, `Relay_Log_Pos`) in the relay log.

  Inconsistencies in the sequence of transactions from the relay log which have been executed can cause this value to be a “low-water mark”. In other words, transactions appearing before the position are guaranteed to have committed, but transactions after the position may have committed or not. If these gaps need to be corrected, use [`START SLAVE UNTIL SQL_AFTER_MTS_GAPS`](start-slave.html "13.4.2.5 START SLAVE Statement"). See [Section 16.4.1.32, “Replication and Transaction Inconsistencies”](replication-features-transaction-inconsistencies.html "16.4.1.32 Replication and Transaction Inconsistencies") for more information.

* `Relay_Log_Space`

  The total combined size of all existing relay log files.

* `Until_Condition`, `Until_Log_File`, `Until_Log_Pos`

  The values specified in the `UNTIL` clause of the [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") statement.

  `Until_Condition` has these values:

  + `None` if no `UNTIL` clause was specified

  + `Master` if the replica is reading until a given position in the source's binary log

  + `Relay` if the replica is reading until a given position in its relay log

  + `SQL_BEFORE_GTIDS` if the replica SQL thread is processing transactions until it has reached the first transaction whose GTID is listed in the `gtid_set`.

  + `SQL_AFTER_GTIDS` if the replica threads are processing all transactions until the last transaction in the `gtid_set` has been processed by both threads.

  + [`SQL_AFTER_MTS_GAPS`](start-slave.html "13.4.2.5 START SLAVE Statement") if a multithreaded replica's SQL threads are running until no more gaps are found in the relay log.

  `Until_Log_File` and `Until_Log_Pos` indicate the log file name and position that define the coordinates at which the SQL thread stops executing.

  For more information on `UNTIL` clauses, see [Section 13.4.2.5, “START SLAVE Statement”](start-slave.html "13.4.2.5 START SLAVE Statement").

* `Master_SSL_Allowed`, `Master_SSL_CA_File`, `Master_SSL_CA_Path`, `Master_SSL_Cert`, `Master_SSL_Cipher`, `Master_SSL_CRL_File`, `Master_SSL_CRL_Path`, `Master_SSL_Key`, `Master_SSL_Verify_Server_Cert`

  These fields show the SSL parameters used by the replica to connect to the source, if any.

  `Master_SSL_Allowed` has these values:

  + `Yes` if an SSL connection to the source is permitted

  + `No` if an SSL connection to the source is not permitted

  + `Ignored` if an SSL connection is permitted but the replica server does not have SSL support enabled

  The values of the other SSL-related fields correspond to the values of the `MASTER_SSL_CA`, `MASTER_SSL_CAPATH`, `MASTER_SSL_CERT`, `MASTER_SSL_CIPHER`, `MASTER_SSL_CRL`, `MASTER_SSL_CRLPATH`, `MASTER_SSL_KEY`, and `MASTER_SSL_VERIFY_SERVER_CERT` options to the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement. See [Section 13.4.2.1, “CHANGE MASTER TO Statement”](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement").

* `Seconds_Behind_Master`

  This field is an indication of how “late” the replica is:

  + When the replica is actively processing updates, this field shows the difference between the current timestamp on the replica and the original timestamp logged on the source for the event currently being processed on the replica.

  + When no event is currently being processed on the replica, this value is 0.

  In essence, this field measures the time difference in seconds between the replica SQL thread and the replica I/O thread. If the network connection between source and replica is fast, the replica I/O thread is very close to the source, so this field is a good approximation of how late the replica SQL thread is compared to the source. If the network is slow, this is *not* a good approximation; the replica SQL thread may quite often be caught up with the slow-reading replica I/O thread, so `Seconds_Behind_Master` often shows a value of 0, even if the I/O thread is late compared to the source. In other words, *this column is useful only for fast networks*.

  This time difference computation works even if the source and replica do not have identical clock times, provided that the difference, computed when the replica I/O thread starts, remains constant from then on. Any changes—including NTP updates—can lead to clock skews that can make calculation of `Seconds_Behind_Master` less reliable.

  In MySQL 5.7, this field is `NULL` (undefined or unknown) if the replica SQL thread is not running, or if the SQL thread has consumed all of the relay log and the replica I/O thread is not running. (In older versions of MySQL, this field was `NULL` if the replica SQL thread or the replica I/O thread was not running or was not connected to the source.) If the I/O thread is running but the relay log is exhausted, `Seconds_Behind_Master` is set to 0.

  The value of `Seconds_Behind_Master` is based on the timestamps stored in events, which are preserved through replication. This means that if a source M1 is itself a replica of M0, any event from M1's binary log that originates from M0's binary log has M0's timestamp for that event. This enables MySQL to replicate [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") successfully. However, the problem for `Seconds_Behind_Master` is that if M1 also receives direct updates from clients, the `Seconds_Behind_Master` value randomly fluctuates because sometimes the last event from M1 originates from M0 and sometimes is the result of a direct update on M1.

  When using a multithreaded replica, you should keep in mind that this value is based on `Exec_Master_Log_Pos`, and so may not reflect the position of the most recently committed transaction.

* `Last_IO_Errno`, `Last_IO_Error`

  The error number and error message of the most recent error that caused the I/O thread to stop. An error number of 0 and message of the empty string mean “no error.” If the `Last_IO_Error` value is not empty, the error values also appear in the replica's error log.

  I/O error information includes a timestamp showing when the most recent I/O thread error occurred. This timestamp uses the format *`YYMMDD hh:mm:ss`*, and appears in the `Last_IO_Error_Timestamp` column.

  Issuing [`RESET MASTER`](reset-master.html "13.4.1.2 RESET MASTER Statement") or [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") resets the values shown in these columns.

* `Last_SQL_Errno`, `Last_SQL_Error`

  The error number and error message of the most recent error that caused the SQL thread to stop. An error number of 0 and message of the empty string mean “no error.” If the `Last_SQL_Error` value is not empty, the error values also appear in the replica's error log.

  If the replica is multithreaded, the SQL thread is the coordinator for worker threads. In this case, the `Last_SQL_Error` field shows exactly what the `Last_Error_Message` column in the Performance Schema [`replication_applier_status_by_coordinator`](performance-schema-replication-applier-status-by-coordinator-table.html "25.12.11.5 The replication_applier_status_by_coordinator Table") table shows. The field value is modified to suggest that there may be more failures in the other worker threads which can be seen in the [`replication_applier_status_by_worker`](performance-schema-replication-applier-status-by-worker-table.html "25.12.11.6 The replication_applier_status_by_worker Table") table that shows each worker thread's status. If that table is not available, the replica error log can be used. The log or the [`replication_applier_status_by_worker`](performance-schema-replication-applier-status-by-worker-table.html "25.12.11.6 The replication_applier_status_by_worker Table") table should also be used to learn more about the failure shown by [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") or the coordinator table.

  SQL error information includes a timestamp showing when the most recent SQL thread error occurred. This timestamp uses the format *`YYMMDD hh:mm:ss`*, and appears in the `Last_SQL_Error_Timestamp` column.

  Issuing [`RESET MASTER`](reset-master.html "13.4.1.2 RESET MASTER Statement") or [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") resets the values shown in these columns.

  In MySQL 5.7, all error codes and messages displayed in the `Last_SQL_Errno` and `Last_SQL_Error` columns correspond to error values listed in [Server Error Message Reference](/doc/mysql-errors/5.7/en/server-error-reference.html). This was not always true in previous versions. (Bug #11760365, Bug
  #52768)

* `Replicate_Ignore_Server_Ids`

  In MySQL 5.7, you set a replica to ignore events from 0 or more sources using the `IGNORE_SERVER_IDS` option of the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement. By default this is blank, and is usually modified only when using a circular or other multi-source replication setup. The message shown for `Replicate_Ignore_Server_Ids` when not blank consists of a comma-delimited list of one or more numbers, indicating the server IDs to be ignored. For example:

  ```sql
  	Replicate_Ignore_Server_Ids: 2, 6, 9
  ```

  Note

  `Ignored_server_ids` also shows the server IDs to be ignored, but is a space-delimited list, which is preceded by the total number of server IDs to be ignored. For example, if a [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement containing the `IGNORE_SERVER_IDS = (2,6,9)` option has been issued to tell a replica to ignore sources having the server ID 2, 6, or 9, that information appears as shown here:

  ```sql
  	Ignored_server_ids: 3, 2, 6, 9
  ```

  The first number (in this case `3`) shows the number of server IDs being ignored.

  `Replicate_Ignore_Server_Ids` filtering is performed by the I/O thread, rather than by the SQL thread, which means that events which are filtered out are not written to the relay log. This differs from the filtering actions taken by server options such [`--replicate-do-table`](replication-options-replica.html#option_mysqld_replicate-do-table), which apply to the SQL thread.

* `Master_Server_Id`

  The [`server_id`](replication-options.html#sysvar_server_id) value from the source.

* `Master_UUID`

  The [`server_uuid`](replication-options.html#sysvar_server_uuid) value from the source.

* `Master_Info_File`

  The location of the `master.info` file.

* `SQL_Delay`

  The number of seconds that the replica must lag the source.

* `SQL_Remaining_Delay`

  When `Slave_SQL_Running_State` is `Waiting until MASTER_DELAY seconds after master executed event`, this field contains the number of delay seconds remaining. At other times, this field is `NULL`.

* `Slave_SQL_Running_State`

  The state of the SQL thread (analogous to `Slave_IO_State`). The value is identical to the `State` value of the SQL thread as displayed by [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement"). [Section 8.14.7, “Replication Replica SQL Thread States”](replica-sql-thread-states.html "8.14.7 Replication Replica SQL Thread States"), provides a listing of possible states

* `Master_Retry_Count`

  The number of times the replica can attempt to reconnect to the source in the event of a lost connection. This value can be set using the `MASTER_RETRY_COUNT` option of the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement (preferred) or the older [`--master-retry-count`](replication-options-replica.html#option_mysqld_master-retry-count) server option (still supported for backward compatibility).

* `Master_Bind`

  The network interface that the replica is bound to, if any. This is set using the `MASTER_BIND` option for the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement.

* `Last_IO_Error_Timestamp`

  A timestamp in *`YYMMDD hh:mm:ss`* format that shows when the most recent I/O error took place.

* `Last_SQL_Error_Timestamp`

  A timestamp in *`YYMMDD hh:mm:ss`* format that shows when the most recent SQL error occurred.

* `Retrieved_Gtid_Set`

  The set of global transaction IDs corresponding to all transactions received by this replica. Empty if GTIDs are not in use. See [GTID Sets](replication-gtids-concepts.html#replication-gtids-concepts-gtid-sets "GTID Sets") for more information.

  This is the set of all GTIDs that exist or have existed in the relay logs. Each GTID is added as soon as the `Gtid_log_event` is received. This can cause partially transmitted transactions to have their GTIDs included in the set.

  When all relay logs are lost due to executing [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") or [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement"), or due to the effects of the [`--relay-log-recovery`](replication-options-replica.html#sysvar_relay_log_recovery) option, the set is cleared. When [`relay_log_purge = 1`](replication-options-replica.html#sysvar_relay_log_purge), the newest relay log is always kept, and the set is not cleared.

* `Executed_Gtid_Set`

  The set of global transaction IDs written in the binary log. This is the same as the value for the global [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) system variable on this server, as well as the value for `Executed_Gtid_Set` in the output of [`SHOW MASTER STATUS`](show-master-status.html "13.7.5.23 SHOW MASTER STATUS Statement") on this server. Empty if GTIDs are not in use. See [GTID Sets](replication-gtids-concepts.html#replication-gtids-concepts-gtid-sets "GTID Sets") for more information.

* `Auto_Position`

  1 if autopositioning is in use; otherwise 0.

* `Replicate_Rewrite_DB`

  The `Replicate_Rewrite_DB` value displays any replication filtering rules that were specified. For example, if the following replication filter rule was set:

  ```sql
  CHANGE REPLICATION FILTER REPLICATE_REWRITE_DB=((db1,db2), (db3,db4));
  ```

  the `Replicate_Rewrite_DB` value displays:

  ```sql
  Replicate_Rewrite_DB: (db1,db2),(db3,db4)
  ```

  For more information, see [Section 13.4.2.2, “CHANGE REPLICATION FILTER Statement”](change-replication-filter.html "13.4.2.2 CHANGE REPLICATION FILTER Statement").

* `Channel_name`

  The replication channel which is being displayed. There is always a default replication channel, and more replication channels can be added. See [Section 16.2.2, “Replication Channels”](replication-channels.html "16.2.2 Replication Channels") for more information.

* `Master_TLS_Version`

  The TLS version used on the source. For TLS version information, see [Section 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”](encrypted-connection-protocols-ciphers.html "6.3.2 Encrypted Connection TLS Protocols and Ciphers"). This column was added in MySQL 5.7.10.
