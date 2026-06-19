## 13.4 Replication Statements

Replication can be controlled through the SQL interface using the statements described in this section. Statements are split into a group which controls replication source servers, a group which controls replica servers, and a group which can be applied to any servers in a replication topology.


### 13.4.1 SQL Statements for Controlling Replication Source Servers

This section discusses statements for managing replication source servers. Section 13.4.2, “SQL Statements for Controlling Replica Servers”, discusses statements for managing replica servers.

In addition to the statements described here, the following `SHOW` statements are used with source servers in replication. For information about these statements, see Section 13.7.5, “SHOW Statements”.

* `SHOW BINARY LOGS`
* `SHOW BINLOG EVENTS`
* `SHOW MASTER STATUS`
* `SHOW SLAVE HOSTS`


#### 13.4.1.1 PURGE BINARY LOGS Statement

```sql
PURGE { BINARY | MASTER } LOGS {
    TO 'log_name'
  | BEFORE datetime_expr
}
```

The binary log is a set of files that contain information about data modifications made by the MySQL server. The log consists of a set of binary log files, plus an index file (see Section 5.4.4, “The Binary Log”).

The `PURGE BINARY LOGS` statement deletes all the binary log files listed in the log index file prior to the specified log file name or date. `BINARY` and `MASTER` are synonyms. Deleted log files also are removed from the list recorded in the index file, so that the given log file becomes the first in the list.

`PURGE BINARY LOGS` requires the `BINLOG_ADMIN` privilege. This statement has no effect if the server was not started with the `--log-bin` option to enable binary logging.

Examples:

```sql
PURGE BINARY LOGS TO 'mysql-bin.010';
PURGE BINARY LOGS BEFORE '2019-04-02 22:46:26';
```

The `BEFORE` variant's *`datetime_expr`* argument should evaluate to a `DATETIME` value (a value in `'YYYY-MM-DD hh:mm:ss'` format).

This statement is safe to run while replicas are replicating. You need not stop them. If you have an active replica that currently is reading one of the log files you are trying to delete, this statement does not delete the log file that is in use or any log files later than that one, but it deletes any earlier log files. A warning message is issued in this situation. However, if a replica is not connected and you happen to purge one of the log files it has yet to read, the replica cannot replicate after it reconnects.

To safely purge binary log files, follow this procedure:

1. On each replica, use `SHOW SLAVE STATUS` to check which log file it is reading.

2. Obtain a listing of the binary log files on the replication source server with `SHOW BINARY LOGS`.

3. Determine the earliest log file among all the replicas. This is the target file. If all the replicas are up to date, this is the last log file on the list.

4. Make a backup of all the log files you are about to delete. (This step is optional, but always advisable.)

5. Purge all log files up to but not including the target file.

You can also set the `expire_logs_days` system variable to expire binary log files automatically after a given number of days (see Section 5.1.7, “Server System Variables”). If you are using replication, you should set the variable no lower than the maximum number of days your replicas might lag behind the source.

`PURGE BINARY LOGS TO` and `PURGE BINARY LOGS BEFORE` both fail with an error when binary log files listed in the `.index` file had been removed from the system by some other means (such as using **rm** on Linux). (Bug #18199, Bug #18453) To handle such errors, edit the `.index` file (which is a simple text file) manually to ensure that it lists only the binary log files that are actually present, then run again the `PURGE BINARY LOGS` statement that failed.


#### 13.4.1.2 RESET MASTER Statement

```sql
RESET MASTER
```

Warning

Use this statement with caution to ensure you do not lose any wanted binary log file data and GTID execution history.

`RESET MASTER` requires the `RELOAD` privilege.

For a server where binary logging is enabled (`log_bin` is `ON`), `RESET MASTER` deletes all existing binary log files and resets the binary log index file, resetting the server to its state before binary logging was started. A new empty binary log file is created so that binary logging can be restarted.

For a server where GTIDs are in use (`gtid_mode` is `ON`), issuing `RESET MASTER` resets the GTID execution history. The value of the `gtid_purged` system variable is set to an empty string (`''`), the global value (but not the session value) of the `gtid_executed` system variable is set to an empty string, and the `mysql.gtid_executed` table is cleared (see mysql.gtid\_executed Table). If the GTID-enabled server has binary logging enabled, `RESET MASTER` also resets the binary log as described above. Note that `RESET MASTER` is the method to reset the GTID execution history even if the GTID-enabled server is a replica where binary logging is disabled; `RESET SLAVE` has no effect on the GTID execution history. For more information on resetting the GTID execution history, see Resetting the GTID Execution History.

Important

The effects of `RESET MASTER` differ from those of `PURGE BINARY LOGS` in 2 key ways:

1. `RESET MASTER` removes *all* binary log files that are listed in the index file, leaving only a single, empty binary log file with a numeric suffix of `.000001`, whereas the numbering is not reset by `PURGE BINARY LOGS`.

2. `RESET MASTER` is *not* intended to be used while any replicas are running. The behavior of `RESET MASTER` when used while replicas are running is undefined (and thus unsupported), whereas `PURGE BINARY LOGS` may be safely used while replicas are running.

See also Section 13.4.1.1, “PURGE BINARY LOGS Statement”.

`RESET MASTER` can prove useful when you first set up the source and the replica, so that you can verify the setup as follows:

1. Start the source and replica, and start replication (see Section 16.1.2, “Setting Up Binary Log File Position Based Replication”).

2. Execute a few test queries on the source.
3. Check that the queries were replicated to the replica.
4. When replication is running correctly, issue `STOP SLAVE` followed by `RESET SLAVE` on the replica, then verify that any unwanted data no longer exists on the replica.

5. Issue `RESET MASTER` on the source to clean up the test queries.

After verifying the setup, resetting the source and replica and ensuring that no unwanted data or binary log files generated by testing remain on source or replica, you can start the replica and begin replicating.


#### 13.4.1.3 SET sql\_log\_bin Statement

```sql
SET sql_log_bin = {OFF|ON}
```

The `sql_log_bin` variable controls whether logging to the binary log is enabled for the current session (assuming that the binary log itself is enabled). The default value is `ON`. To disable or enable binary logging for the current session, set the session `sql_log_bin` variable to `OFF` or `ON`.

Set this variable to `OFF` for a session to temporarily disable binary logging while making changes to the source you do not want replicated to the replica.

Setting the session value of this system variable is a restricted operation. The session user must have privileges sufficient to set restricted session variables. See Section 5.1.8.1, “System Variable Privileges”.

It is not possible to set the session value of `sql_log_bin` within a transaction or subquery.

*Setting this variable to `OFF` prevents GTIDs from being assigned to transactions in the binary log*. If you are using GTIDs for replication, this means that even when binary logging is later enabled again, the GTIDs written into the log from this point do not account for any transactions that occurred in the meantime, so in effect those transactions are lost.

The global `sql_log_bin` variable is read only and cannot be modified. The global scope is deprecated; expect it to be removed in a future MySQL release.


### 13.4.2 SQL Statements for Controlling Replica Servers

This section discusses statements for managing replica servers. Section 13.4.1, “SQL Statements for Controlling Replication Source Servers”, discusses statements for managing source servers.

In addition to the statements described here, `SHOW SLAVE STATUS` and `SHOW RELAYLOG EVENTS` are also used with replicas. For information about these statements, see Section 13.7.5.34, “SHOW SLAVE STATUS Statement”, and Section 13.7.5.32, “SHOW RELAYLOG EVENTS Statement”.


#### 13.4.2.1 CHANGE MASTER TO Statement

```sql
CHANGE MASTER TO option [, option] ... [ channel_option ]

option: {
    MASTER_BIND = 'interface_name'
  | MASTER_HOST = 'host_name'
  | MASTER_USER = 'user_name'
  | MASTER_PASSWORD = 'password'
  | MASTER_PORT = port_num
  | MASTER_CONNECT_RETRY = interval
  | MASTER_RETRY_COUNT = count
  | MASTER_DELAY = interval
  | MASTER_HEARTBEAT_PERIOD = interval
  | MASTER_LOG_FILE = 'source_log_name'
  | MASTER_LOG_POS = source_log_pos
  | MASTER_AUTO_POSITION = {0|1}
  | RELAY_LOG_FILE = 'relay_log_name'
  | RELAY_LOG_POS = relay_log_pos
  | MASTER_SSL = {0|1}
  | MASTER_SSL_CA = 'ca_file_name'
  | MASTER_SSL_CAPATH = 'ca_directory_name'
  | MASTER_SSL_CERT = 'cert_file_name'
  | MASTER_SSL_CRL = 'crl_file_name'
  | MASTER_SSL_CRLPATH = 'crl_directory_name'
  | MASTER_SSL_KEY = 'key_file_name'
  | MASTER_SSL_CIPHER = 'cipher_list'
  | MASTER_SSL_VERIFY_SERVER_CERT = {0|1}
  | MASTER_TLS_VERSION = 'protocol_list'
  | IGNORE_SERVER_IDS = (server_id_list)
}

channel_option:
    FOR CHANNEL channel

server_id_list:
    [server_id [, server_id] ... ]
```

`CHANGE MASTER TO` changes the parameters that the replica uses for connecting to the replication source server, for reading the source's binary log, and reading the replica's relay log. It also updates the contents of the replication metadata repositories (see Section 16.2.4, “Relay Log and Replication Metadata Repositories”). `CHANGE MASTER TO` requires the `SUPER` privilege.

Prior to MySQL 5.7.4, the replication threads must be stopped, using `STOP SLAVE` if necessary, before issuing this statement. In MySQL 5.7.4 and later, you can issue `CHANGE MASTER TO` statements on a running replica without doing this, depending on the states of the replication SQL thread and replication I/O thread. The rules governing such use are provided later in this section.

When using a multithreaded replica (in other words `slave_parallel_workers` is greater than 0), stopping the replica can cause “gaps” in the sequence of transactions that have been executed from the relay log, regardless of whether the replica was stopped intentionally or otherwise. When such gaps exist, issuing `CHANGE MASTER TO` fails. The solution in this situation is to issue `START SLAVE UNTIL SQL_AFTER_MTS_GAPS` which ensures that the gaps are closed.

The optional `FOR CHANNEL channel` clause enables you to name which replication channel the statement applies to. Providing a `FOR CHANNEL channel` clause applies the `CHANGE MASTER TO` statement to a specific replication channel, and is used to add a new channel or modify an existing channel. For example, to add a new channel called channel2:

```sql
CHANGE MASTER TO MASTER_HOST=host1, MASTER_PORT=3002 FOR CHANNEL 'channel2'
```

If no clause is named and no extra channels exist, the statement applies to the default channel.

When using multiple replication channels, if a `CHANGE MASTER TO` statement does not name a channel using a `FOR CHANNEL channel` clause, an error occurs. See Section 16.2.2, “Replication Channels” for more information.

Options not specified retain their value, except as indicated in the following discussion. Thus, in most cases, there is no need to specify options that do not change. For example, if the password to connect to your replication source server has changed, issue this statement to tell the replica about the new password:

```sql
CHANGE MASTER TO MASTER_PASSWORD='new3cret';
```

`MASTER_HOST`, `MASTER_USER`, `MASTER_PASSWORD`, and `MASTER_PORT` provide information to the replica about how to connect to its replication source server:

* `MASTER_HOST` and `MASTER_PORT` are the host name (or IP address) of the master host and its TCP/IP port.

  Note

  Replication cannot use Unix socket files. You must be able to connect to the replication source server using TCP/IP.

  If you specify the `MASTER_HOST` or `MASTER_PORT` option, the replica assumes that the source is different from before (even if the option value is the same as its current value.) In this case, the old values for the source's binary log file name and position are considered no longer applicable, so if you do not specify `MASTER_LOG_FILE` and `MASTER_LOG_POS` in the statement, `MASTER_LOG_FILE=''` and `MASTER_LOG_POS=4` are silently appended to it.

  Setting `MASTER_HOST=''` (that is, setting its value explicitly to an empty string) is *not* the same as not setting `MASTER_HOST` at all. Beginning with MySQL 5.5, trying to set `MASTER_HOST` to an empty string fails with an error. Previously, setting `MASTER_HOST` to an empty string caused `START SLAVE` subsequently to fail. (Bug #28796)

  Values used for `MASTER_HOST` and other `CHANGE MASTER TO` options are checked for linefeed (`\n` or `0x0A`) characters; the presence of such characters in these values causes the statement to fail with `ER_MASTER_INFO`. (Bug #11758581, Bug #50801)

* `MASTER_USER` and `MASTER_PASSWORD` are the user name and password of the account to use for connecting to the source. If you specify `MASTER_PASSWORD`, `MASTER_USER` is also required. The password used for a replication user account in a `CHANGE MASTER TO` statement is limited to 32 characters in length; prior to MySQL 5.7.5, if the password was longer, the statement succeeded, but any excess characters were silently truncated. In MySQL 5.7.5 and later, trying to use a password of more than 32 characters causes `CHANGE MASTER TO` to fail. (Bug #11752299, Bug #43439)

  It is possible to set an empty user name by specifying `MASTER_USER=''`, but the replication channel cannot be started with an empty user name. Only set an empty `MASTER_USER` user name if you need to clear previously used credentials from the replica's repositories for security purposes, and do not attempt to use the channel afterwards.

  The text of a running `CHANGE MASTER TO` statement, including values for `MASTER_USER` and `MASTER_PASSWORD`, can be seen in the output of a concurrent `SHOW PROCESSLIST` statement. (The complete text of a `START SLAVE` statement is also visible to `SHOW PROCESSLIST`.)

Setting `MASTER_SSL=1` for a replication connection and then setting no further `MASTER_SSL_xxx` options corresponds to setting `--ssl-mode=REQUIRED` for the client, as described in Command Options for Encrypted Connections. With `MASTER_SSL=1`, the connection attempt only succeeds if an encrypted connection can be established. A replication connection does not fall back to an unencrypted connection, so there is no setting corresponding to the `--ssl-mode=PREFERRED` setting for replication. If `MASTER_SSL=0` is set, this corresponds to `--ssl-mode=DISABLED`.

Important

To help prevent sophisticated man-in-the-middle attacks, it is important for the replica to verify the server’s identity. You can specify additional `MASTER_SSL_xxx` options to correspond to the settings `--ssl-mode=VERIFY_CA` and `--ssl-mode=VERIFY_IDENTITY`, which are a better choice than the default setting to help prevent this type of attack. With these settings, the replica checks that the server’s certificate is valid, and checks that the host name the replica is using matches the identity in the server’s certificate. To implement one of these levels of verification, you must first ensure that the CA certificate for the server is reliably available to the replica, otherwise availability issues will result. For this reason, they are not the default setting.

The `MASTER_SSL_xxx` options and the `MASTER_TLS_VERSION` option specify how the replica uses encryption and ciphers to secure the replication connection. These options can be changed even on replicas that are compiled without SSL support. They are saved to the source metadata repository, but are ignored if the replica does not have SSL support enabled. The `MASTER_SSL_xxx` and `MASTER_TLS_VERSION` options perform the same functions as the `--ssl-xxx` and `--tls-version` client options described in Command Options for Encrypted Connections. The correspondence between the two sets of options, and the use of the `MASTER_SSL_xxx` and `MASTER_TLS_VERSION` options to set up a secure connection, is explained in Section 16.3.8, “Setting Up Replication to Use Encrypted Connections”.

The `MASTER_HEARTBEAT_PERIOD`, `MASTER_CONNECT_RETRY`, and `MASTER_RETRY_COUNT` options control how the replica recognizes that the connection to the source has been lost and makes attempts to reconnect.

* The `slave_net_timeout` system variable specifies the number of seconds that the replica waits for either more data or a heartbeat signal from the source, before the replica considers the connection broken, aborts the read, and tries to reconnect. The default value is 60 seconds (one minute). Prior to MySQL 5.7.7, the default was 3600 seconds (one hour).

* The heartbeat interval, which stops the connection timeout occurring in the absence of data if the connection is still good, is controlled by the `MASTER_HEARTBEAT_PERIOD` option. A heartbeat signal is sent to the replica after that number of seconds, and the waiting period is reset whenever the source's binary log is updated with an event. Heartbeats are therefore sent by the source only if there are no unsent events in the binary log file for a period longer than this. The heartbeat interval *`interval`* is a decimal value having the range 0 to 4294967 seconds and a resolution in milliseconds; the smallest nonzero value is 0.001. Setting *`interval`* to 0 disables heartbeats altogether. The heartbeat interval defaults to half the value of the `slave_net_timeout` system variable. It is recorded in the source metadata repository and shown in the `replication_connection_configuration` Performance Schema table.

* Prior to MySQL 5.7.4, not including `MASTER_HEARTBEAT_PERIOD` caused `CHANGE MASTER TO` to reset the heartbeat interval to the default (half the value of the `slave_net_timeout` system variable), and `Slave_received_heartbeats` to 0. The heartbeat interval is now not reset except by `RESET SLAVE`. (Bug #18185490)

* Note that a change to the value or default setting of `slave_net_timeout` does not automatically change the heartbeat interval, whether that has been set explicitly or is using a previously calculated default. A warning is issued if you set `@@GLOBAL.slave_net_timeout` to a value less than that of the current heartbeat interval. If `slave_net_timeout` is changed, you must also issue `CHANGE MASTER TO` to adjust the heartbeat interval to an appropriate value so that the heartbeat signal occurs before the connection timeout. If you do not do this, the heartbeat signal has no effect, and if no data is received from the source, the replica can make repeated reconnection attempts, creating zombie dump threads.

* If the replica does need to reconnect, the first retry occurs immediately after the timeout. `MASTER_CONNECT_RETRY` specifies the interval between reconnection attempts, and `MASTER_RETRY_COUNT` limits the number of reconnection attempts. If both the default settings are used, the replica waits 60 seconds between reconnection attempts (`MASTER_CONNECT_RETRY=60`), and keeps attempting to reconnect at this rate for 60 days (`MASTER_RETRY_COUNT=86400`). A setting of 0 for `MASTER_RETRY_COUNT` means that there is no limit on the number of reconnection attempts, so the replica keeps trying to reconnect indefinitely. These values are recorded in the source metadata repository and shown in the `replication_connection_configuration` Performance Schema table. `MASTER_RETRY_COUNT` supersedes the `--master-retry-count` server startup option.

`MASTER_DELAY` specifies how many seconds behind the source the replica must lag. An event received from the source is not executed until at least *`interval`* seconds later than its execution on the source. The default is 0. An error occurs if *`interval`* is not a nonnegative integer in the range from 0 to 231−1. For more information, see Section 16.3.10, “Delayed Replication”.

From MySQL 5.7, a `CHANGE MASTER TO` statement employing the `MASTER_DELAY` option can be executed on a running replica when the replication SQL thread is stopped.

`MASTER_BIND` is for use on replicas having multiple network interfaces, and determines which of the replica's network interfaces is chosen for connecting to the source.

The address configured with this option, if any, can be seen in the `Master_Bind` column of the output from `SHOW SLAVE STATUS`. If you are using a table for the source metadata repository (server started with `master_info_repository=TABLE`), the value can also be seen as the `Master_bind` column of the `mysql.slave_master_info` table.

The ability to bind a replica to a specific network interface is also supported by NDB Cluster.

`MASTER_LOG_FILE` and `MASTER_LOG_POS` are the coordinates at which the replication I/O thread should begin reading from the source the next time the thread starts. `RELAY_LOG_FILE` and `RELAY_LOG_POS` are the coordinates at which the replication SQL thread should begin reading from the relay log the next time the thread starts. If you specify any of these options, you cannot specify `MASTER_AUTO_POSITION = 1` (described later in this section). If neither of `MASTER_LOG_FILE` or `MASTER_LOG_POS` is specified, the replica uses the last coordinates of the *replication SQL thread* before `CHANGE MASTER TO` was issued. This ensures that there is no discontinuity in replication, even if the replication SQL thread was late compared to the replication I/O thread, when you merely want to change, say, the password to use.

From MySQL 5.7, a `CHANGE MASTER TO` statement employing `RELAY_LOG_FILE`, `RELAY_LOG_POS`, or both options can be executed on a running replica when the replication SQL thread is stopped. Prior to MySQL 5.7.4, `CHANGE MASTER TO` deletes all relay log files and starts a new one, unless you specify `RELAY_LOG_FILE` or `RELAY_LOG_POS`. In that case, relay log files are kept; the `relay_log_purge` global variable is set silently to 0. In MySQL 5.7.4 and later, relay logs are preserved if at least one of the replication SQL thread and the replication I/O thread is running. If both threads are stopped, all relay log files are deleted unless at least one of `RELAY_LOG_FILE` or `RELAY_LOG_POS` is specified. For the Group Replication applier channel (`group_replication_applier`), which only has an SQL thread and no I/O thread, this is the case if the SQL thread is stopped, but with that channel you cannot use the `RELAY_LOG_FILE` and `RELAY_LOG_POS` options.

`RELAY_LOG_FILE` can use either an absolute or relative path, and uses the same base name as `MASTER_LOG_FILE`. (Bug #12190)

When `MASTER_AUTO_POSITION = 1` is used with `CHANGE MASTER TO`, the replica attempts to connect to the source using the auto-positioning feature of GTID-based replication, rather than a binary log file based position. From MySQL 5.7, this option can be employed by `CHANGE MASTER TO` only if both the replication SQL thread and the replication I/O thread are stopped. Both the replica and the source must have GTIDs enabled (`GTID_MODE=ON`, `ON_PERMISSIVE,` or `OFF_PERMISSIVE` on the replica, and `GTID_MODE=ON` on the source). `MASTER_LOG_FILE`, `MASTER_LOG_POS`, `RELAY_LOG_FILE`, and `RELAY_LOG_POS` cannot be specified together with `MASTER_AUTO_POSITION = 1`. If multi-source replication is enabled on the replica, you need to set the `MASTER_AUTO_POSITION = 1` option for each applicable replication channel.

With `MASTER_AUTO_POSITION = 1` set, in the initial connection handshake, the replica sends a GTID set containing the transactions that it has already received, committed, or both. The source responds by sending all transactions recorded in its binary log whose GTID is not included in the GTID set sent by the replica. This exchange ensures that the source only sends the transactions with a GTID that the replica has not already recorded or committed. If the replica receives transactions from more than one source, as in the case of a diamond topology, the auto-skip function ensures that the transactions are not applied twice. For details of how the GTID set sent by the replica is computed, see Section 16.1.3.3, “GTID Auto-Positioning”.

If any of the transactions that should be sent by the source have been purged from the source's binary log, or added to the set of GTIDs in the `gtid_purged` system variable by another method, the source sends the error `ER_MASTER_HAS_PURGED_REQUIRED_GTIDS` to the replica, and replication does not start. Also, if during the exchange of transactions it is found that the replica has recorded or committed transactions with the source's UUID in the GTID, but the source itself has not committed them, the source sends the error `ER_SLAVE_HAS_MORE_GTIDS_THAN_MASTER` to the replica and replication does not start. For information on how to handle these situations, see Section 16.1.3.3, “GTID Auto-Positioning”.

`IGNORE_SERVER_IDS` takes a comma-separated list of 0 or more server IDs. Events originating from the corresponding servers are ignored, with the exception of log rotation and deletion events, which are still recorded in the relay log.

In circular replication, the originating server normally acts as the terminator of its own events, so that they are not applied more than once. Thus, this option is useful in circular replication when one of the servers in the circle is removed. Suppose that you have a circular replication setup with 4 servers, having server IDs 1, 2, 3, and 4, and server 3 fails. When bridging the gap by starting replication from server 2 to server 4, you can include `IGNORE_SERVER_IDS = (3)` in the `CHANGE MASTER TO` statement that you issue on server 4 to tell it to use server 2 as its source instead of server 3. Doing so causes it to ignore and not to propagate any statements that originated with the server that is no longer in use.

If a `CHANGE MASTER TO` statement is issued without any `IGNORE_SERVER_IDS` option, any existing list is preserved. To clear the list of ignored servers, it is necessary to use the option with an empty list:

```sql
CHANGE MASTER TO IGNORE_SERVER_IDS = ();
```

Prior to MySQL 5.7.5, `RESET SLAVE ALL` has no effect on the server ID list. In MySQL 5.7.5 and later, `RESET SLAVE ALL` clears `IGNORE_SERVER_IDS`. (Bug #18816897)

If `IGNORE_SERVER_IDS` contains the server's own ID and the server was started with the `--replicate-same-server-id` option enabled, an error results.

The source metadata repository and the output of `SHOW SLAVE STATUS` provide the list of servers that are currently ignored. For more information, see Section 16.2.4.2, “Replication Metadata Repositories”, and Section 13.7.5.34, “SHOW SLAVE STATUS Statement”.

Invoking `CHANGE MASTER TO` causes the previous values for `MASTER_HOST`, `MASTER_PORT`, `MASTER_LOG_FILE`, and `MASTER_LOG_POS` to be written to the error log, along with other information about the replica's state prior to execution.

`CHANGE MASTER TO` causes an implicit commit of an ongoing transaction. See Section 13.3.3, “Statements That Cause an Implicit Commit”.

In MySQL 5.7.4 and later, the strict requirement to execute `STOP SLAVE` prior to issuing any `CHANGE MASTER TO` statement (and `START SLAVE` afterward) is removed. Instead of depending on whether the replica is stopped, the behavior of `CHANGE MASTER TO` depends (in MySQL 5.7.4 and later) on the states of the replication SQL thread and the replication I/O thread; which of these threads is stopped or running now determines the options that can or cannot be used with a `CHANGE MASTER TO` statement at a given point in time. The rules for making this determination are listed here:

* If the SQL thread is stopped, you can execute `CHANGE MASTER TO` using any combination that is otherwise allowed of `RELAY_LOG_FILE`, `RELAY_LOG_POS`, and `MASTER_DELAY` options, even if the replication I/O thread is running. No other options may be used with this statement when the I/O thread is running.

* If the I/O thread is stopped, you can execute `CHANGE MASTER TO` using any of the options for this statement (in any allowed combination) *except* `RELAY_LOG_FILE`, `RELAY_LOG_POS`, `MASTER_DELAY`, or `MASTER_AUTO_POSITION = 1` even when the SQL thread is running.

* Both the SQL thread and the I/O thread must be stopped before issuing a `CHANGE MASTER TO` statement that employs `MASTER_AUTO_POSITION = 1`.

You can check the current state of the replication SQL thread and the replication I/O thread using `SHOW SLAVE STATUS`. Note that the Group Replication applier channel (`group_replication_applier`) has no I/O thread, only an SQL thread.

For more information, see Section 16.3.7, “Switching Sources During Failover”.

If you are using statement-based replication and temporary tables, it is possible for a `CHANGE MASTER TO` statement following a `STOP SLAVE` statement to leave behind temporary tables on the replica. From MySQL 5.7, a warning (`ER_WARN_OPEN_TEMP_TABLES_MUST_BE_ZERO`) is issued whenever this occurs. You can avoid this in such cases by making sure that the value of the `Slave_open_temp_tables` system status variable is equal to 0 prior to executing such a `CHANGE MASTER TO` statement.

`CHANGE MASTER TO` is useful for setting up a replica when you have the snapshot of the replication source server and have recorded the source's binary log coordinates corresponding to the time of the snapshot. After loading the snapshot into the replica to synchronize it with the source, you can run `CHANGE MASTER TO MASTER_LOG_FILE='log_name', MASTER_LOG_POS=log_pos` on the replica to specify the coordinates at which the replica should begin reading the source's binary log.

The following example changes the replication source server the replica uses and establishes the source's binary log coordinates from which the replica begins reading. This is used when you want to set up the replica to replicate the source:

```sql
CHANGE MASTER TO
  MASTER_HOST='source2.example.com',
  MASTER_USER='replication',
  MASTER_PASSWORD='password',
  MASTER_PORT=3306,
  MASTER_LOG_FILE='source2-bin.001',
  MASTER_LOG_POS=4,
  MASTER_CONNECT_RETRY=10;
```

The next example shows an operation that is less frequently employed. It is used when the replica has relay log files that you want it to execute again for some reason. To do this, the source need not be reachable. You need only use `CHANGE MASTER TO` and start the SQL thread (`START SLAVE SQL_THREAD`):

```sql
CHANGE MASTER TO
  RELAY_LOG_FILE='replica-relay-bin.006',
  RELAY_LOG_POS=4025;
```

The following table shows the maximum permissible length for the string-valued options.

<table summary="The maximum permissible length for CHANGE MASTER TO string-valued options."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Option</th> <th>Maximum Length</th> </tr></thead><tbody><tr> <td><code>MASTER_HOST</code></td> <td>60</td> </tr><tr> <td><code>MASTER_USER</code></td> <td>96</td> </tr><tr> <td><code>MASTER_PASSWORD</code></td> <td>32</td> </tr><tr> <td><code>MASTER_LOG_FILE</code></td> <td>511</td> </tr><tr> <td><code>RELAY_LOG_FILE</code></td> <td>511</td> </tr><tr> <td><code>MASTER_SSL_CA</code></td> <td>511</td> </tr><tr> <td><code>MASTER_SSL_CAPATH</code></td> <td>511</td> </tr><tr> <td><code>MASTER_SSL_CERT</code></td> <td>511</td> </tr><tr> <td><code>MASTER_SSL_CRL</code></td> <td>511</td> </tr><tr> <td><code>MASTER_SSL_CRLPATH</code></td> <td>511</td> </tr><tr> <td><code>MASTER_SSL_KEY</code></td> <td>511</td> </tr><tr> <td><code>MASTER_SSL_CIPHER</code></td> <td>511</td> </tr><tr> <td><code>MASTER_TLS_VERSION</code></td> <td>511</td> </tr></tbody></table>


#### 13.4.2.2 CHANGE REPLICATION FILTER Statement

```sql
CHANGE REPLICATION FILTER filter[, filter][, ...]

filter: {
    REPLICATE_DO_DB = (db_list)
  | REPLICATE_IGNORE_DB = (db_list)
  | REPLICATE_DO_TABLE = (tbl_list)
  | REPLICATE_IGNORE_TABLE = (tbl_list)
  | REPLICATE_WILD_DO_TABLE = (wild_tbl_list)
  | REPLICATE_WILD_IGNORE_TABLE = (wild_tbl_list)
  | REPLICATE_REWRITE_DB = (db_pair_list)
}

db_list:
    db_name[, db_name][, ...]

tbl_list:
    db_name.table_name[, db_table_name][, ...]
wild_tbl_list:
    'db_pattern.table_pattern'[, 'db_pattern.table_pattern'][, ...]

db_pair_list:
    (db_pair)[, (db_pair)][, ...]

db_pair:
    from_db, to_db
```

`CHANGE REPLICATION FILTER` sets one or more replication filtering rules on the replica in the same way as starting the replica `mysqld` with replication filtering options such as `--replicate-do-db` or `--replicate-wild-ignore-table`. Filters set using this statement differ from those set using the server options in two key respects:

1. The statement does not require restarting the server to take effect, only that the replication SQL thread be stopped using `STOP SLAVE SQL_THREAD` first (and restarted with `START SLAVE SQL_THREAD` afterwards).

2. The effects of the statement are not persistent; any filters set using `CHANGE REPLICATION FILTER` are lost following a restart of the replica `mysqld`.

`CHANGE REPLICATION FILTER` requires the `SUPER` privilege.

Note

Replication filters cannot be set on a MySQL server instance that is configured for Group Replication, because filtering transactions on some servers would make the group unable to reach agreement on a consistent state.

The following list shows the `CHANGE REPLICATION FILTER` options and how they relate to `--replicate-*` server options:

* `REPLICATE_DO_DB`: Include updates based on database name. Equivalent to `--replicate-do-db`.

* `REPLICATE_IGNORE_DB`: Exclude updates based on database name. Equivalent to `--replicate-ignore-db`.

* `REPLICATE_DO_TABLE`: Include updates based on table name. Equivalent to `--replicate-do-table`.

* `REPLICATE_IGNORE_TABLE`: Exclude updates based on table name. Equivalent to `--replicate-ignore-table`.

* `REPLICATE_WILD_DO_TABLE`: Include updates based on wildcard pattern matching table name. Equivalent to `--replicate-wild-do-table`.

* `REPLICATE_WILD_IGNORE_TABLE`: Exclude updates based on wildcard pattern matching table name. Equivalent to `--replicate-wild-ignore-table`.

* `REPLICATE_REWRITE_DB`: Perform updates on replica after substituting new name on replica for specified database on source. Equivalent to `--replicate-rewrite-db`.

The precise effects of `REPLICATE_DO_DB` and `REPLICATE_IGNORE_DB` filters are dependent on whether statement-based or row-based replication is in effect. See Section 16.2.5, “How Servers Evaluate Replication Filtering Rules”, for more information.

Multiple replication filtering rules can be created in a single `CHANGE REPLICATION FILTER` statement by separating the rules with commas, as shown here:

```sql
CHANGE REPLICATION FILTER
    REPLICATE_DO_DB = (d1), REPLICATE_IGNORE_DB = (d2);
```

Issuing the statement just shown is equivalent to starting the replica `mysqld` with the options `--replicate-do-db=d1` `--replicate-ignore-db=d2`.

If the same filtering rule is specified multiple times, only the *last* such rule is actually used. For example, the two statements shown here have exactly the same effect, because the first `REPLICATE_DO_DB` rule in the first statement is ignored:

```sql
CHANGE REPLICATION FILTER
    REPLICATE_DO_DB = (db1, db2), REPLICATE_DO_DB = (db3, db4);

CHANGE REPLICATION FILTER
    REPLICATE_DO_DB = (db3,db4);
```

Caution

This behavior differs from that of the `--replicate-*` filter options where specifying the same option multiple times causes the creation of multiple filter rules.

Names of tables and database not containing any special characters need not be quoted. Values used with `REPLICATION_WILD_TABLE` and `REPLICATION_WILD_IGNORE_TABLE` are string expressions, possibly containing (special) wildcard characters, and so must be quoted. This is shown in the following example statements:

```sql
CHANGE REPLICATION FILTER
    REPLICATE_WILD_DO_TABLE = ('db1.old%');

CHANGE REPLICATION FILTER
    REPLICATE_WILD_IGNORE_TABLE = ('db1.new%', 'db2.new%');
```

Values used with `REPLICATE_REWRITE_DB` represent *pairs* of database names; each such value must be enclosed in parentheses. The following statement rewrites statements occurring on database `db1` on the source to database `db2` on the replica:

```sql
CHANGE REPLICATION FILTER REPLICATE_REWRITE_DB = ((db1, db2));
```

The statement just shown contains two sets of parentheses, one enclosing the pair of database names, and the other enclosing the entire list. This is perhaps more easily seen in the following example, which creates two `rewrite-db` rules, one rewriting database `dbA` to `dbB`, and one rewriting database `dbC` to `dbD`:

```sql
CHANGE REPLICATION FILTER
  REPLICATE_REWRITE_DB = ((dbA, dbB), (dbC, dbD));
```

This statement leaves any existing replication filtering rules unchanged; to unset all filters of a given type, set the filter's value to an explicitly empty list, as shown in this example, which removes all existing `REPLICATE_DO_DB` and `REPLICATE_IGNORE_DB` rules:

```sql
CHANGE REPLICATION FILTER
    REPLICATE_DO_DB = (), REPLICATE_IGNORE_DB = ();
```

Setting a filter to empty in this way removes all existing rules, does not create any new ones, and does not restore any rules set at mysqld startup using `--replicate-*` options on the command line or in the configuration file.

Values employed with `REPLICATE_WILD_DO_TABLE` and `REPLICATE_WILD_IGNORE_TABLE` must be in the format `db_name.tbl_name`. Prior to MySQL 5.7.5, this was not strictly enforced, although using nonconforming values with these options could lead to erroneous results (Bug #18095449).

For more information, see Section 16.2.5, “How Servers Evaluate Replication Filtering Rules”.


#### 13.4.2.3 RESET SLAVE Statement

```sql
RESET SLAVE [ALL] [channel_option]

channel_option:
    FOR CHANNEL channel
```

`RESET SLAVE` makes the replica forget its replication position in the source's binary log. This statement is meant to be used for a clean start: It clears the replication metadata repositories, deletes all the relay log files, and starts a new relay log file. It also resets to 0 the replication delay specified with the `MASTER_DELAY` option to `CHANGE MASTER TO`.

Note

All relay log files are deleted, even if they have not been completely executed by the replication SQL thread. (This is a condition likely to exist on a replica if you have issued a `STOP SLAVE` statement or if the replica is highly loaded.)

For a server where GTIDs are in use (`gtid_mode` is `ON`), issuing `RESET SLAVE` has no effect on the GTID execution history. The statement does not change the values of `gtid_executed` or `gtid_purged`, or the `mysql.gtid_executed` table. If you need to reset the GTID execution history, use `RESET MASTER`, even if the GTID-enabled server is a replica where binary logging is disabled.

`RESET SLAVE` requires the `RELOAD` privilege.

To use `RESET SLAVE`, the replication threads must be stopped, so on a running replica use `STOP SLAVE` before issuing `RESET SLAVE`. To use `RESET SLAVE` on a Group Replication group member, the member status must be `OFFLINE`, meaning that the plugin is loaded but the member does not currently belong to any group. A group member can be taken offline by using a `STOP GROUP REPLICATION` statement.

The optional `FOR CHANNEL channel` clause enables you to name which replication channel the statement applies to. Providing a `FOR CHANNEL channel` clause applies the `RESET SLAVE` statement to a specific replication channel. Combining a `FOR CHANNEL channel` clause with the `ALL` option deletes the specified channel. If no channel is named and no extra channels exist, the statement applies to the default channel. Issuing a `RESET SLAVE ALL` statement without a `FOR CHANNEL channel` clause when multiple replication channels exist deletes *all* replication channels and recreates only the default channel. See Section 16.2.2, “Replication Channels” for more information.

`RESET SLAVE` does not change any replication connection parameters such as the source's host name and port, or the replication user account name and its password.

* From MySQL 5.7.24, when `master_info_repository=TABLE` is set on the server, replication connection parameters are preserved in the crash-safe `InnoDB` table `mysql.slave_master_info` as part of the `RESET SLAVE` operation. They are also retained in memory. In the event of an unexpected server exit or deliberate restart after issuing `RESET SLAVE` but before issuing `START SLAVE`, the replication connection parameters are retrieved from the table and reused for the new connection.

* When `master_info_repository=FILE` is set on the server (which is the default in MySQL 5.7), replication connection parameters are only retained in memory. If the replica `mysqld` is restarted immediately after issuing `RESET SLAVE` due to an unexpected server exit or deliberate restart, the connection parameters are lost. In that case, you must issue a `CHANGE MASTER TO` statement after the server start to respecify the connection parameters before issuing `START SLAVE`.

If you want to reset the connection parameters intentionally, you need to use `RESET SLAVE ALL`, which clears the connection parameters. In that case, you must issue a `CHANGE MASTER TO` statement after the server start to specify the new connection parameters.

`RESET SLAVE` causes an implicit commit of an ongoing transaction. See Section 13.3.3, “Statements That Cause an Implicit Commit”.

If the replication SQL thread was in the middle of replicating temporary tables when it was stopped, and `RESET SLAVE` is issued, these replicated temporary tables are deleted on the replica.

Prior to MySQL 5.7.5, `RESET SLAVE` also had the effect of resetting both the heartbeat period (`Slave_heartbeat_period`) and `SSL_VERIFY_SERVER_CERT`. This issue is fixed in MySQL 5.7.5 and later. (Bug #18777899, Bug #18778485)

Prior to MySQL 5.7.5, `RESET SLAVE ALL` did not clear the `IGNORE_SERVER_IDS` list set by `CHANGE MASTER TO`. In MySQL 5.7.5 and later, the statement clears the list. (Bug #18816897)

Note

When used on an NDB Cluster replica SQL node, `RESET SLAVE` clears the `mysql.ndb_apply_status` table. You should keep in mind when using this statement that `ndb_apply_status` uses the `NDB` storage engine and so is shared by all SQL nodes attached to the replica cluster.

You can override this behavior by issuing `SET` `GLOBAL @@``ndb_clear_apply_status=OFF` prior to executing `RESET SLAVE`, which keeps the replica from purging the `ndb_apply_status` table in such cases.


#### 13.4.2.4 SET GLOBAL sql\_slave\_skip\_counter Syntax

```sql
SET GLOBAL sql_slave_skip_counter = N
```

This statement skips the next *`N`* events from the master. This is useful for recovering from replication stops caused by a statement.

This statement is valid only when the slave threads are not running. Otherwise, it produces an error.

When using this statement, it is important to understand that the binary log is actually organized as a sequence of groups known as event groups. Each event group consists of a sequence of events.

* For transactional tables, an event group corresponds to a transaction.

* For nontransactional tables, an event group corresponds to a single SQL statement.

Note

A single transaction can contain changes to both transactional and nontransactional tables.

When you use `SET GLOBAL sql_slave_skip_counter` to skip events and the result is in the middle of a group, the slave continues to skip events until it reaches the end of the group. Execution then starts with the next event group.


#### 13.4.2.5 START SLAVE Statement

```sql
START SLAVE [thread_types] [until_option] [connection_options] [channel_option]

thread_types:
    [thread_type [, thread_type] ... ]

thread_type:
    IO_THREAD | SQL_THREAD

until_option:
    UNTIL {   {SQL_BEFORE_GTIDS | SQL_AFTER_GTIDS} = gtid_set
          |   MASTER_LOG_FILE = 'log_name', MASTER_LOG_POS = log_pos
          |   RELAY_LOG_FILE = 'log_name', RELAY_LOG_POS = log_pos
          |   SQL_AFTER_MTS_GAPS  }

connection_options:
    [USER='user_name'] [PASSWORD='user_pass'] [DEFAULT_AUTH='plugin_name'] [PLUGIN_DIR='plugin_dir']


channel_option:
    FOR CHANNEL channel

gtid_set:
    uuid_set [, uuid_set] ...
    | ''

uuid_set:
    uuid:interval[:interval]...

uuid:
    hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh

h:
    [0-9,A-F]

interval:
    n[-n]

    (n >= 1)
```

`START SLAVE` starts the replication threads, either together or separately. The statement requires the `SUPER` privilege. `START SLAVE` causes an implicit commit of an ongoing transaction (see Section 13.3.3, “Statements That Cause an Implicit Commit”).

For the thread type options, you can specify `IO_THREAD`, `SQL_THREAD`, both of these, or neither of them. Only the threads that are started are affected by the statement.

* `START SLAVE` with no thread type options starts all of the replication threads, and so does `START SLAVE` with both of the thread type options.

* `IO_THREAD` starts the replication receiver thread, which reads events from the source server and stores them in the relay log.

* `SQL_THREAD` starts the replication applier thread, which reads events from the relay log and executes them. A multithreaded replica (with `slave_parallel_workers` > 0) applies transactions using a coordinator thread and multiple applier threads, and `SQL_THREAD` starts all of these.

Important

`START SLAVE` sends an acknowledgment to the user after all the replication threads have started. However, the replication receiver thread might not yet have connected to the source successfully, or an applier thread might stop when applying an event right after starting. `START SLAVE` does not continue to monitor the threads after they are started, so it does not warn you if they subsequently stop or cannot connect. You must check the replica's error log for error messages generated by the replication threads, or check that they are running satisfactorily with `SHOW SLAVE STATUS`. A successful `START SLAVE` statement causes `SHOW SLAVE STATUS` to show `Slave_SQL_Running=Yes`, but it might or might not show `Slave_IO_Running=Yes`, because `Slave_IO_Running=Yes` is only shown if the receiver thread is both running and connected. For more information, see Section 16.1.7.1, “Checking Replication Status”.

The optional `FOR CHANNEL channel` clause enables you to name which replication channel the statement applies to. Providing a `FOR CHANNEL channel` clause applies the `START SLAVE` statement to a specific replication channel. If no clause is named and no extra channels exist, the statement applies to the default channel. If a `START SLAVE` statement does not have a channel defined when using multiple channels, this statement starts the specified threads for all channels. See Section 16.2.2, “Replication Channels” for more information.

The replication channels for Group Replication (`group_replication_applier` and `group_replication_recovery`) are managed automatically by the server instance. The only Group Replication channel that you can interact with is the `group_replication_applier` channel. This channel only has an applier thread and has no receiver thread, so it can be started by using the `SQL_THREAD` option without the `IO_THREAD` option. `START SLAVE` cannot be used at all with the `group_replication_recovery` channel.

`START SLAVE` supports pluggable user-password authentication (see Section 6.2.13, “Pluggable Authentication”) with the `USER`, `PASSWORD`, `DEFAULT_AUTH` and `PLUGIN_DIR` options, as described in the following list. When you use these options, you must start the receiver thread (`IO_THREAD` option) or all the replication threads; you cannot start the replication applier thread (`SQL_THREAD` option) alone.

`USER` :   The user name for the account. You must set this if `PASSWORD` is used. The option cannot be set to an empty or null string.

`PASSWORD` :   The password for the named user account.

`DEFAULT_AUTH` :   The name of the authentication plugin. The default is MySQL native authentication.

`PLUGIN_DIR` :   The location of the authentication plugin.

Important

The password that you set using `START SLAVE` is masked when it is written to MySQL Server’s logs, Performance Schema tables, and `SHOW PROCESSLIST` statements. However, it is sent in plain text over the connection to the replica server instance. To protect the password in transit, use SSL/TLS encryption, an SSH tunnel, or another method of protecting the connection from unauthorized viewing, for the connection between the replica server instance and the client that you use to issue `START SLAVE`.

The `UNTIL` clause makes the replica start replication, then process transactions up to the point that you specify in the `UNTIL` clause, then stop again. The `UNTIL` clause can be used to make a replica proceed until just before the point where you want to skip a transaction that is unwanted, and then skip the transaction as described in Section 16.1.7.3, “Skipping Transactions”. To identify a transaction, you can use **mysqlbinlog** with the source's binary log or the replica's relay log, or use a `SHOW BINLOG EVENTS` statement.

You can also use the `UNTIL` clause for debugging replication by processing transactions one at a time or in sections. If you are using the `UNTIL` clause to do this, start the replica with the `--skip-slave-start` option to prevent the SQL thread from running when the replica server starts. Remove the option after the procedure is complete, so that it is not forgotten in the event of an unexpected server restart.

The `SHOW SLAVE STATUS` statement includes output fields that display the current values of the `UNTIL` condition. The `UNTIL` condition lasts for as long as the affected threads are still running, and is removed when they stop.

The `UNTIL` clause operates on the replication applier thread (`SQL_THREAD` option). You can use the `SQL_THREAD` option or let the replica default to starting both threads. If you use the `IO_THREAD` option alone, the `UNTIL` clause is ignored because the applier thread is not started.

The point that you specify in the `UNTIL` clause can be any one (and only one) of the following options:

`SOURCE_LOG_FILE` and `SOURCE_LOG_POS` :   These options make the replication applier process transactions up to a position in its relay log, identified by the file name and file position of the corresponding point in the binary log on the source server. The applier thread finds the nearest transaction boundary at or after the specified position, finishes applying the transaction, and stops there.

`RELAY_LOG_FILE` and `RELAY_LOG_POS` :   These options make the replication applier process transactions up to a position in the replica’s relay log, identified by the relay log file name and a position in that file. The applier thread finds the nearest transaction boundary at or after the specified position, finishes applying the transaction, and stops there.

`SQL_BEFORE_GTIDS` :   This option makes the replication applier start processing transactions and stop when it encounters any transaction that is in the specified GTID set. The encountered transaction from the GTID set is not applied, and nor are any of the other transactions in the GTID set. The option takes a GTID set containing one or more global transaction identifiers as an argument (see GTID Sets). Transactions in a GTID set do not necessarily appear in the replication stream in the order of their GTIDs, so the transaction before which the applier stops is not necessarily the earliest.

`SQL_AFTER_GTIDS` :   This option makes the replication applier start processing transactions and stop when it has processed all of the transactions in a specified GTID set. The option takes a GTID set containing one or more global transaction identifiers as an argument (see GTID Sets).

    With `SQL_AFTER_GTIDS`, the replication threads stop after they have processed all transactions in the GTID set. Transactions are processed in the order received, so it is possible that these include transactions which are not part of the GTID set, but which are received (and processed) before all transactions in the set have been committed. For example, executing `START SLAVE UNTIL SQL_AFTER_GTIDS = 3E11FA47-71CA-11E1-9E33-C80AA9429562:11-56` causes the replica to obtain (and process) all transactions from the source until all of the transactions having the sequence numbers 11 through 56 have been processed, and then to stop without processing any additional transactions after that point has been reached.

    `SQL_AFTER_GTIDS` is not compatible with with multi-threaded slaves. If this option is used with a multi-threaded slave, a warning is raised, and the slave switches to single-threaded mode. Depending on the use case, it may be possible to to use `START SLAVE UNTIL MASTER_LOG_POS` or `START SLAVE UNTIL SQL_BEFORE_GTIDS` instead. You can also use `WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()`, which waits until the correct position is reached, but does not stop the slave thread.

`SQL_AFTER_MTS_GAPS` :   For a multithreaded replica only (with `slave_parallel_workers` > 0), this option makes the replica process transactions up to the point where there are no more gaps in the sequence of transactions executed from the relay log. When using a multithreaded replica, there is a chance of gaps occurring in the following situations:

    * The coordinator thread is stopped.
    * An error occurs in the applier threads.
    * `mysqld` shuts down unexpectedly.

    When a replication channel has gaps, the replica’s database is in a state that might never have existed on the source. The replica tracks the gaps internally and disallows `CHANGE MASTER TO` statements that would remove the gap information if they executed.

    Issuing `START SLAVE` on a multithreaded replica with gaps in the sequence of transactions executed from the relay log generates a warning. To correct this situation, the solution is to use `START SLAVE UNTIL SQL_AFTER_MTS_GAPS`. See Section 16.4.1.32, “Replication and Transaction Inconsistencies” for more information.

    If you need to change a failed multithreaded replica to single-threaded mode, you can issue the following series of statements, in the order shown:

    ```sql
    START SLAVE UNTIL SQL_AFTER_MTS_GAPS;
    SET @@GLOBAL.slave_parallel_workers = 0;
    START SLAVE SQL_THREAD;
    ```


#### 13.4.2.6 STOP SLAVE Statement

```sql
STOP SLAVE [thread_types] [channel_option]

thread_types:
    [thread_type [, thread_type] ... ]

thread_type: IO_THREAD | SQL_THREAD

channel_option:
    FOR CHANNEL channel
```

Stops the replication threads. `STOP SLAVE` requires the `SUPER` privilege. Recommended best practice is to execute `STOP SLAVE` on the replica before stopping the replica server (see Section 5.1.16, “The Server Shutdown Process”, for more information).

*When using the row-based logging format*: You should execute `STOP SLAVE` or `STOP SLAVE SQL_THREAD` on the replica prior to shutting down the replica server if you are replicating any tables that use a nontransactional storage engine (see the *Note* later in this section).

Like `START SLAVE`, this statement may be used with the `IO_THREAD` and `SQL_THREAD` options to name the thread or threads to be stopped. Note that the Group Replication applier channel (`group_replication_applier`) has no replication I/O thread, only a replication SQL thread. Using the `SQL_THREAD` option therefore stops this channel completely.

`STOP SLAVE` causes an implicit commit of an ongoing transaction. See Section 13.3.3, “Statements That Cause an Implicit Commit”.

`gtid_next` must be set to `AUTOMATIC` before issuing this statement.

You can control how long `STOP SLAVE` waits before timing out by setting the `rpl_stop_slave_timeout` system variable. This can be used to avoid deadlocks between `STOP SLAVE` and other SQL statements using different client connections to the replica. When the timeout value is reached, the issuing client returns an error message and stops waiting, but the `STOP SLAVE` instruction remains in effect. Once the replication threads are no longer busy, the `STOP SLAVE` statement is executed and the replica stops.

Some `CHANGE MASTER TO` statements are allowed while the replica is running, depending on the states of the replication SQL thread and the replication I/O thread. However, using `STOP SLAVE` prior to executing `CHANGE MASTER TO` in such cases is still supported. See Section 13.4.2.1, “CHANGE MASTER TO Statement”, and Section 16.3.7, “Switching Sources During Failover”, for more information.

The optional `FOR CHANNEL channel` clause enables you to name which replication channel the statement applies to. Providing a `FOR CHANNEL channel` clause applies the `STOP SLAVE` statement to a specific replication channel. If no channel is named and no extra channels exist, the statement applies to the default channel. If a `STOP SLAVE` statement does not name a channel when using multiple channels, this statement stops the specified threads for all channels. This statement cannot be used with the `group_replication_recovery` channel. See Section 16.2.2, “Replication Channels” for more information.

*When using statement-based replication*: changing the source while it has open temporary tables is potentially unsafe. This is one of the reasons why statement-based replication of temporary tables is not recommended. You can find out whether there are any temporary tables on the replica by checking the value of `Slave_open_temp_tables`; when using statement-based replication, this value should be 0 before executing `CHANGE MASTER TO`. If there are any temporary tables open on the replica, issuing a `CHANGE MASTER TO` statement after issuing a `STOP SLAVE` causes an `ER_WARN_OPEN_TEMP_TABLES_MUST_BE_ZERO` warning.

When using a multithreaded replica (`slave_parallel_workers` is a nonzero value), any gaps in the sequence of transactions executed from the relay log are closed as part of stopping the worker threads. If the replica is stopped unexpectedly (for example due to an error in a worker thread, or another thread issuing `KILL`) while a `STOP SLAVE` statement is executing, the sequence of executed transactions from the relay log may become inconsistent. See Section 16.4.1.32, “Replication and Transaction Inconsistencies”, for more information.

If the current replication event group has modified one or more nontransactional tables, STOP SLAVE waits for up to 60 seconds for the event group to complete, unless you issue a `KILL QUERY` or `KILL CONNECTION` statement for the replication SQL thread. If the event group remains incomplete after the timeout, an error message is logged.


### 13.4.3 SQL Statements for Controlling Group Replication

This section provides information about the statements used to control servers running the MySQL Group Replication plugin. See Chapter 17, *Group Replication* for more information.


#### 13.4.3.1 START GROUP\_REPLICATION Statement

```sql
START GROUP_REPLICATION
```

Starts Group Replication on this server instance. This statement requires the `SUPER` privilege. If `super_read_only=ON` and the member should join as a primary, `super_read_only` is set to `OFF` once Group Replication successfully starts.

A server that participates in a group in single-primary mode should use `skip_replica_start=ON`. Otherwise, the server is not allowed to join a group as a secondary.


#### 13.4.3.2 STOP GROUP\_REPLICATION Statement

```sql
STOP GROUP_REPLICATION
```

Stops Group Replication. This statement requires the `GROUP_REPLICATION_ADMIN` or `SUPER` privilege. As soon as you issue `STOP GROUP_REPLICATION` the member is set to `super_read_only=ON`, which ensures that no writes can be made to the member while Group Replication stops. Any other replication channels running on the member are also stopped.

Warning

Use this statement with extreme caution because it removes the server instance from the group, meaning it is no longer protected by Group Replication's consistency guarantee mechanisms. To be completely safe, ensure that your applications can no longer connect to the instance before issuing this statement to avoid any chance of stale reads.
