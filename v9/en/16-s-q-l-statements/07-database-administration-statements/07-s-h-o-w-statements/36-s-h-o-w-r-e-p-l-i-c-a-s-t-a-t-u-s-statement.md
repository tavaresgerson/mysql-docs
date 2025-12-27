#### 15.7.7.36 SHOW REPLICA STATUS Statement

```
SHOW REPLICA STATUS [FOR CHANNEL channel]
```

This statement provides status information on essential parameters of the replica threads. The statement requires the `REPLICATION CLIENT` privilege (or the deprecated `SUPER` privilege).

`SHOW REPLICA STATUS` is nonblocking. When run concurrently with `STOP REPLICA`, `SHOW REPLICA STATUS` returns without waiting for `STOP REPLICA` to finish shutting down the replication SQL (applier) thread or replication I/O (receiver) thread (or both). This permits use in monitoring and other applications where getting an immediate response from `SHOW REPLICA STATUS` is more important than ensuring that it returned the latest data.

If you issue this statement using the **mysql** client, you can use a `\G` statement terminator rather than a semicolon to obtain a more readable vertical layout:

```
mysql> SHOW REPLICA STATUS\G
*************************** 1. row ***************************
             Replica_IO_State: Waiting for source to send event
                  Source_Host: 127.0.0.1
                  Source_User: root
                  Source_Port: 13000
                Connect_Retry: 1
              Source_Log_File: master-bin.000001
          Read_Source_Log_Pos: 927
               Relay_Log_File: slave-relay-bin.000002
                Relay_Log_Pos: 1145
        Relay_Source_Log_File: master-bin.000001
           Replica_IO_Running: Yes
          Replica_SQL_Running: Yes
              Replicate_Do_DB:
          Replicate_Ignore_DB:
           Replicate_Do_Table:
       Replicate_Ignore_Table:
      Replicate_Wild_Do_Table:
  Replicate_Wild_Ignore_Table:
                   Last_Errno: 0
                   Last_Error:
                 Skip_Counter: 0
          Exec_Source_Log_Pos: 927
              Relay_Log_Space: 1355
              Until_Condition: None
               Until_Log_File:
                Until_Log_Pos: 0
           Source_SSL_Allowed: No
           Source_SSL_CA_File:
           Source_SSL_CA_Path:
              Source_SSL_Cert:
            Source_SSL_Cipher:
               Source_SSL_Key:
        Seconds_Behind_Source: 0
Source_SSL_Verify_Server_Cert: No
                Last_IO_Errno: 0
                Last_IO_Error:
               Last_SQL_Errno: 0
               Last_SQL_Error:
  Replicate_Ignore_Server_Ids:
             Source_Server_Id: 1
                  Source_UUID: 73f86016-978b-11ee-ade5-8d2a2a562feb
             Source_Info_File: mysql.slave_master_info
                    SQL_Delay: 0
          SQL_Remaining_Delay: NULL
    Replica_SQL_Running_State: Replica has read all relay log; waiting for more updates
           Source_Retry_Count: 10
                  Source_Bind:
      Last_IO_Error_Timestamp:
     Last_SQL_Error_Timestamp:
               Source_SSL_Crl:
           Source_SSL_Crlpath:
           Retrieved_Gtid_Set: 73f86016-978b-11ee-ade5-8d2a2a562feb:1-3
            Executed_Gtid_Set: 73f86016-978b-11ee-ade5-8d2a2a562feb:1-3
                Auto_Position: 1
         Replicate_Rewrite_DB:
                 Channel_Name:
           Source_TLS_Version:
       Source_public_key_path:
        Get_Source_public_key: 0
            Network_Namespace:
```

The Performance Schema provides tables that expose replication information. This is similar to the information available from the `SHOW REPLICA STATUS` statement, but represented in table form. For details, see Section 29.12.11, “Performance Schema Replication Tables”.

You can set the `GTID_ONLY` option for the `CHANGE REPLICATION SOURCE TO` statement to stop a replication channel from persisting file names and file positions in the replication metadata repositories. With this setting, file positions for the source binary log file and the relay log file are tracked in memory. The `SHOW REPLICA STATUS` statement still displays file positions in normal use. However, because the file positions are not being regularly updated in the connection metadata repository and the applier metadata repository except in a few situations, they are likely to be out of date if the server is restarted.

For a replication channel with the `GTID_ONLY` setting after a server start, the read and applied file positions for the source binary log file (`Read_Source_Log_Pos` and `Exec_Source_Log_Pos`) are set to zero, and the file names (`Source_Log_File` and `Relay_Source_Log_File`) are set to `INVALID`. The relay log file name (`Relay_Log_File`) is set according to the relay\_log\_recovery setting, either a new file that was created at server start or the first relay log file present. The file position (`Relay_Log_Pos`) is set to position 4, and GTID auto-skip is used to skip any transactions in the file that were already applied.

When the receiver thread contacts the source and gets valid position information, the read position (`Read_Source_Log_Pos`) and file name (`Source_Log_File`) are updated with the correct data and become valid. When the applier thread applies a transaction from the source, or skips an already executed transaction, the executed position (`Exec_Source_Log_Pos`) and file name (`Relay_Source_Log_File`) are updated with the correct data and become valid. The relay log file position (`Relay_Log_Pos`) is also updated at that time.

The following list describes the fields returned by `SHOW REPLICA STATUS`. For additional information about interpreting their meanings, see Section 19.1.7.1, “Checking Replication Status”.

* `Replica_IO_State`

  A copy of the `State` field of the `SHOW PROCESSLIST` output for the replica I/O (receiver) thread. This tells you what the thread is doing: trying to connect to the source, waiting for events from the source, reconnecting to the source, and so on. For a listing of possible states, see Section 10.14.5, “Replication I/O (Receiver) Thread States” Thread States").

* `Source_Host`

  The source host that the replica is connected to.

* `Source_User`

  The user name of the account used to connect to the source.

* `Source_Port`

  The port used to connect to the source.

* `Connect_Retry`

  The number of seconds between connect retries (default 60). This can be set with a `CHANGE REPLICATION SOURCE TO` statement.

* `Source_Log_File`

  The name of the source binary log file from which the I/O (receiver) thread is currently reading. This is set to `INVALID` for a replication channel with the `GTID_ONLY` setting after a server start. It will be updated when the replica contacts the source.

* `Read_Source_Log_Pos`

  The position in the current source binary log file up to which the I/O (receiver) thread has read. This is set to zero for a replication channel with the `GTID_ONLY` setting after a server start. It will be updated when the replica contacts the source.

* `Relay_Log_File`

  The name of the relay log file from which the SQL (applier) thread is currently reading and executing.

* `Relay_Log_Pos`

  The position in the current relay log file up to which the SQL (applier) thread has read and executed.

* `Relay_Source_Log_File`

  The name of the source binary log file containing the most recent event executed by the SQL (applier) thread. This is set to `INVALID` for a replication channel with the `GTID_ONLY` setting after a server start. It will be updated when a transaction is executed or skipped.

* `Replica_IO_Running`

  Whether the replication I/O (receiver) thread is started and has connected successfully to the source. Internally, the state of this thread is represented by one of the following three values:

  + **MYSQL\_REPLICA\_NOT\_RUN.** The replication I/O (receiver) thread is not running. For this state, `Replica_IO_Running` is `No`.

  + **MYSQL\_REPLICA\_RUN\_NOT\_CONNECT.** The replication I/O (receiver) thread is running, but is not connected to a replication source. For this state, `Replica_IO_Running` is `Connecting`.

  + **MYSQL\_REPLICA\_RUN\_CONNECT.** The replication I/O (receiver) thread is running, and is connected to a replication source. For this state, `Replica_IO_Running` is `Yes`.

* `Replica_SQL_Running`

  Whether the replication SQL (applier) thread is started.

* `Replicate_Do_DB`, `Replicate_Ignore_DB`

  The names of any databases that were specified with the `--replicate-do-db` and `--replicate-ignore-db` options, or the `CHANGE REPLICATION FILTER` statement. If the `FOR CHANNEL` clause was used, the channel specific replication filters are shown. Otherwise, the replication filters for every replication channel are shown.

* `Replicate_Do_Table`, `Replicate_Ignore_Table`, `Replicate_Wild_Do_Table`, `Replicate_Wild_Ignore_Table`

  The names of any tables that were specified with the `--replicate-do-table`, `--replicate-ignore-table`, `--replicate-wild-do-table`, and `--replicate-wild-ignore-table` options, or the `CHANGE REPLICATION FILTER` statement. If the `FOR CHANNEL` clause was used, the channel specific replication filters are shown. Otherwise, the replication filters for every replication channel are shown.

* `Last_Errno`, `Last_Error`

  These columns are aliases for `Last_SQL_Errno` and `Last_SQL_Error`.

  Issuing `RESET BINARY LOGS AND GTIDS` or `RESET REPLICA` resets the values shown in these columns.

  Note

  When the replication SQL thread receives an error, it reports the error first, then stops the SQL thread. This means that there is a small window of time during which `SHOW REPLICA STATUS` shows a nonzero value for `Last_SQL_Errno` even though `Replica_SQL_Running` still displays `Yes`.

* `Skip_Counter`

  The current value of the `sql_replica_skip_counter` system variable.

* `Exec_Source_Log_Pos`

  The position in the current source binary log file to which the replication SQL thread has read and executed, marking the start of the next transaction or event to be processed. This is set to zero for a replication channel with the `GTID_ONLY` setting after a server start. It will be updated when a transaction is executed or skipped.

  You can use this value with the `CHANGE REPLICATION SOURCE TO` statement's `SOURCE_LOG_POS` option when starting a new replica from an existing replica, so that the new replica reads from this point. The coordinates given by (`Relay_Source_Log_File`, `Exec_Source_Log_Pos`) in the source's binary log correspond to the coordinates given by (`Relay_Log_File`, `Relay_Log_Pos`) in the relay log.

  Inconsistencies in the sequence of transactions from the relay log which have been executed can cause this value to be a “low-water mark”. In other words, transactions appearing before the position are guaranteed to have committed, but transactions after the position may have committed or not. If these gaps need to be corrected, use `START REPLICA UNTIL SQL_AFTER_MTS_GAPS`. See Section 19.5.1.35, “Replication and Transaction Inconsistencies” for more information.

* `Relay_Log_Space`

  The total combined size of all existing relay log files.

* `Until_Condition`, `Until_Log_File`, `Until_Log_Pos`

  The values specified in the `UNTIL` clause of the `START REPLICA` statement.

  `Until_Condition` has these values:

  + `None` if no `UNTIL` clause was specified.

  + `Source` if the replica is reading until a given position in the source's binary log.

  + `Relay` if the replica is reading until a given position in its relay log.

  + `SQL_BEFORE_GTIDS` if the replication SQL thread is processing transactions until it has reached the first transaction whose GTID is listed in the `gtid_set`.

  + `SQL_AFTER_GTIDS` if the replication threads are processing all transactions until the last transaction in the `gtid_set` has been processed by both threads.

  + `SQL_AFTER_MTS_GAPS` if a multithreaded replica's SQL threads are running until no more gaps are found in the relay log.

  `Until_Log_File` and `Until_Log_Pos` indicate the log file name and position that define the coordinates at which the replication SQL thread stops executing.

  For more information on `UNTIL` clauses, see Section 15.4.2.4, “START REPLICA Statement”.

* `Source_SSL_Allowed`, `Source_SSL_CA_File`, `Source_SSL_CA_Path`, `Source_SSL_Cert`, `Source_SSL_Cipher`, `Source_SSL_CRL_File`, `Source_SSL_CRL_Path`, `Source_SSL_Key`, `Source_SSL_Verify_Server_Cert`

  These fields show the SSL parameters used by the replica to connect to the source, if any.

  `Source_SSL_Allowed` has these values:

  + `Yes` if an SSL connection to the source is permitted.

  + `No` if an SSL connection to the source is not permitted.

  + `Ignored` if an SSL connection is permitted but the replica server does not have SSL support enabled.

  The values of the other SSL-related fields correspond to the values of the `SOURCE_SSL_*` options of the `CHANGE REPLICATION SOURCE TO` statement.

* `Seconds_Behind_Source`

  This field is an indication of how “late” the replica is:

  + When the replica is actively processing updates, this field shows the difference between the current timestamp on the replica and the original timestamp logged on the source for the event currently being processed on the replica.

  + When no event is currently being processed on the replica, this value is 0.

  In essence, this field measures the time difference in seconds between the replication SQL (applier) thread and the replication I/O (receiver) thread. If the network connection between source and replica is fast, the replication receiver thread is very close to the source, so this field is a good approximation of how late the replication applier thread is compared to the source. If the network is slow, this is *not* a good approximation; the replication applier thread may quite often be caught up with the slow-reading replication receiver thread, so `Seconds_Behind_Source` often shows a value of 0, even if the replication receiver thread is late compared to the source. In other words, *this column is useful only for fast networks*.

  This time difference computation works even if the source and replica do not have identical clock times, provided that the difference, computed when the replica receiver thread starts, remains constant from then on. Any changes, including NTP updates, can lead to clock skews that can make calculation of `Seconds_Behind_Source` less reliable.

  In MySQL 9.5, this field is `NULL` (undefined or unknown) if the replication applier thread is not running, or if the applier thread has consumed all of the relay log and the replication receiver thread is not running. (In older versions of MySQL, this field was `NULL` if the replication applier thread or the replication receiver thread was not running or was not connected to the source.) If the replication receiver thread is running but the relay log is exhausted, `Seconds_Behind_Source` is set to 0.

  The value of `Seconds_Behind_Source` is based on the timestamps stored in events, which are preserved through replication. This means that if a source M1 is itself a replica of M0, any event from M1's binary log that originates from M0's binary log has M0's timestamp for that event. This enables MySQL to replicate `TIMESTAMP` successfully. However, the problem for `Seconds_Behind_Source` is that if M1 also receives direct updates from clients, the `Seconds_Behind_Source` value randomly fluctuates because sometimes the last event from M1 originates from M0 and sometimes is the result of a direct update on M1.

  When using a multithreaded replica, you should keep in mind that this value is based on `Exec_Source_Log_Pos`, and so may not reflect the position of the most recently committed transaction.

* `Last_IO_Errno`, `Last_IO_Error`

  The error number and error message of the most recent error that caused the replication I/O (receiver) thread to stop. An error number of 0 and message of the empty string mean “no error.” If the `Last_IO_Error` value is not empty, the error values also appear in the replica's error log.

  I/O error information includes a timestamp showing when the most recent I/O (receiver)thread error occurred. This timestamp uses the format *`YYMMDD hh:mm:ss`*, and appears in the `Last_IO_Error_Timestamp` column.

  Issuing `RESET BINARY LOGS AND GTIDS` or `RESET REPLICA` resets the values shown in these columns.

* `Last_SQL_Errno`, `Last_SQL_Error`

  The error number and error message of the most recent error that caused the replication SQL (applier) thread to stop. An error number of 0 and message of the empty string mean “no error.” If the `Last_SQL_Error` value is not empty, the error values also appear in the replica's error log.

  If the replica is multithreaded, the replication SQL thread is the coordinator for worker threads. In this case, the `Last_SQL_Error` field shows exactly what the `Last_Error_Message` column in the Performance Schema `replication_applier_status_by_coordinator` table shows. The field value is modified to suggest that there may be more failures in the other worker threads which can be seen in the `replication_applier_status_by_worker` table that shows each worker thread's status. If that table is not available, the replica error log can be used. The log or the `replication_applier_status_by_worker` table should also be used to learn more about the failure shown by `SHOW REPLICA STATUS` or the coordinator table.

  SQL error information includes a timestamp showing when the most recent SQL (applier) thread error occurred. This timestamp uses the format *`YYMMDD hh:mm:ss`*, and appears in the `Last_SQL_Error_Timestamp` column.

  Issuing `RESET BINARY LOGS AND GTIDS` or `RESET REPLICA` resets the values shown in these columns.

  In MySQL 9.5, all error codes and messages displayed in the `Last_SQL_Errno` and `Last_SQL_Error` columns correspond to error values listed in Server Error Message Reference. This was not always true in previous versions. (Bug #11760365, Bug
  #52768)

* `Replicate_Ignore_Server_Ids`

  Any server IDs that have been specified using the `IGNORE_SERVER_IDS` option of the `CHANGE REPLICATION SOURCE TO` statement, so that the replica ignores events from these servers. This option is used in a circular or other multi-source replication setup when one of the servers is removed. If any server IDs have been set in this way, a comma-delimited list of one or more numbers is shown. If no server IDs have been set, the field is blank.

  Note

  The `Ignored_server_ids` value in the `slave_master_info` table also shows the server IDs to be ignored, but as a space-delimited list, preceded by the total number of server IDs to be ignored. For example, if a `CHANGE REPLICATION SOURCE TO` statement containing the `IGNORE_SERVER_IDS = (2,6,9)` option has been issued to tell a replica to ignore sources having the server ID 2, 6, or 9, that information appears as shown here:

  ```
  	Replicate_Ignore_Server_Ids: 2, 6, 9
  ```

  ```
  	Ignored_server_ids: 3, 2, 6, 9
  ```

  `Replicate_Ignore_Server_Ids` filtering is performed by the I/O (receiver) thread, rather than by the SQL (applier) thread, which means that events which are filtered out are not written to the relay log. This differs from the filtering actions taken by server options such `--replicate-do-table`, which apply to the applier thread.

  If `SET gtid_mode=ON` is issued when any channel has existing server IDs set with `IGNORE_SERVER_IDS`, the statement is rejected with an error. Before starting GTID-based replication, use `SHOW REPLICA STATUS` to check for and clear all ignored server ID lists on the servers involved. You can clear a list by issuing a `CHANGE REPLICATION SOURCE TO` statement using `IGNORE_SERVER_IDS=()`—that is, with an empty list of server IDs.

* `Source_Server_Id`

  The `server_id` value from the source.

* `Source_UUID`

  The `server_uuid` value from the source.

* `Source_Info_File`

  The location of the `master.info` file, the use of which is now deprecated. By default, a table is used instead for the replica's connection metadata repository.

* `SQL_Delay`

  The number of seconds that the replica must lag the source.

* `SQL_Remaining_Delay`

  When `Replica_SQL_Running_State` is `Waiting until SOURCE_DELAY seconds after source executed event`, this field contains the number of delay seconds remaining. At other times, this field is `NULL`.

* `Replica_SQL_Running_State`

  The state of the SQL thread (analogous to `Replica_IO_State`). The value is identical to the `State` value of the SQL thread as displayed by `SHOW PROCESSLIST`. Section 10.14.6, “Replication SQL Thread States”, provides a listing of possible states.

* `Source_Retry_Count`

  The number of times the replica can attempt to reconnect to the source in the event of a lost connection. This value can be set using the `SOURCE_RETRY_COUNT` option of the `CHANGE REPLICATION SOURCE TO` statement.

* `Source_Bind`

  The network interface that the replica is bound to, if any. This is set using the `SOURCE_BIND` option for the `CHANGE REPLICATION SOURCE TO` statement.

* `Last_IO_Error_Timestamp`

  A timestamp in *`YYMMDD hh:mm:ss`* format that shows when the most recent I/O error took place.

* `Last_SQL_Error_Timestamp`

  A timestamp in *`YYMMDD hh:mm:ss`* format that shows when the most recent SQL error occurred.

* `Retrieved_Gtid_Set`

  The set of global transaction IDs corresponding to all transactions received by this replica. Empty if GTIDs are not in use. See GTID Sets for more information.

  This is the set of all GTIDs that exist or have existed in the relay logs. Each GTID is added as soon as the `Gtid_log_event` is received. This can cause partially transmitted transactions to have their GTIDs included in the set.

  When all relay logs are lost due to executing `RESET REPLICA` or `CHANGE REPLICATION SOURCE TO`, or due to the effects of the `--relay-log-recovery` option, the set is cleared. When `relay_log_purge = 1`, the newest relay log is always kept, and the set is not cleared.

* `Executed_Gtid_Set`

  The set of global transaction IDs written in the binary log. This is the same as the value for the global `gtid_executed` system variable on this server, as well as the value for `Executed_Gtid_Set` in the output of `SHOW BINARY LOG STATUS` on this server. Empty if GTIDs are not in use. See GTID Sets for more information.

* `Auto_Position`

  1 if GTID auto-positioning is in use for the channel, otherwise 0.

* `Replicate_Rewrite_DB`

  The `Replicate_Rewrite_DB` value displays any replication filtering rules that were specified. For example, if the following replication filter rule was set:

  ```
  CHANGE REPLICATION FILTER REPLICATE_REWRITE_DB=((db1,db2), (db3,db4));
  ```

  the `Replicate_Rewrite_DB` value displays:

  ```
  Replicate_Rewrite_DB: (db1,db2),(db3,db4)
  ```

  For more information, see Section 15.4.2.1, “CHANGE REPLICATION FILTER Statement”.

* `Channel_name`

  The replication channel which is being displayed. There is always a default replication channel, and more replication channels can be added. See Section 19.2.2, “Replication Channels” for more information.

* `Master_TLS_Version`

  The TLS version used on the source. For TLS version information, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

* `Source_public_key_path`

  The path name to a file containing a replica-side copy of the public key required by the source for RSA key pair-based password exchange. The file must be in PEM format. This column applies to replicas that authenticate with the `sha256_password` or `caching_sha2_password` authentication plugin.

  If `Source_public_key_path` is given and specifies a valid public key file, it takes precedence over `Get_source_public_key`.

* `Get_source_public_key`

  Whether to request from the source the public key required for RSA key pair-based password exchange. This column applies to replicas that authenticate with the `caching_sha2_password` authentication plugin. For that plugin, the source does not send the public key unless requested.

  If `Source_public_key_path` is given and specifies a valid public key file, it takes precedence over `Get_source_public_key`.

* `Network_Namespace`

  The network namespace name; empty if the connection uses the default (global) namespace. For information about network namespaces, see Section 7.1.14, “Network Namespace Support”.
