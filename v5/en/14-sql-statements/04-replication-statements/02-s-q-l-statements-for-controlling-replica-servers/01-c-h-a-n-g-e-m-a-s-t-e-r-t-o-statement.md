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

[`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") changes the parameters that the replica uses for connecting to the replication source server, for reading the source's binary log, and reading the replica's relay log. It also updates the contents of the replication metadata repositories (see [Section 16.2.4, “Relay Log and Replication Metadata Repositories”](replica-logs.html "16.2.4 Relay Log and Replication Metadata Repositories")). [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") requires the [`SUPER`](privileges-provided.html#priv_super) privilege.

Prior to MySQL 5.7.4, the replication threads must be stopped, using [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") if necessary, before issuing this statement. In MySQL 5.7.4 and later, you can issue `CHANGE MASTER TO` statements on a running replica without doing this, depending on the states of the replication SQL thread and replication I/O thread. The rules governing such use are provided later in this section.

When using a multithreaded replica (in other words [`slave_parallel_workers`](replication-options-replica.html#sysvar_slave_parallel_workers) is greater than 0), stopping the replica can cause “gaps” in the sequence of transactions that have been executed from the relay log, regardless of whether the replica was stopped intentionally or otherwise. When such gaps exist, issuing [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") fails. The solution in this situation is to issue [`START SLAVE UNTIL SQL_AFTER_MTS_GAPS`](start-slave.html "13.4.2.5 START SLAVE Statement") which ensures that the gaps are closed.

The optional `FOR CHANNEL channel` clause enables you to name which replication channel the statement applies to. Providing a `FOR CHANNEL channel` clause applies the `CHANGE MASTER TO` statement to a specific replication channel, and is used to add a new channel or modify an existing channel. For example, to add a new channel called channel2:

```sql
CHANGE MASTER TO MASTER_HOST=host1, MASTER_PORT=3002 FOR CHANNEL 'channel2'
```

If no clause is named and no extra channels exist, the statement applies to the default channel.

When using multiple replication channels, if a `CHANGE MASTER TO` statement does not name a channel using a `FOR CHANNEL channel` clause, an error occurs. See [Section 16.2.2, “Replication Channels”](replication-channels.html "16.2.2 Replication Channels") for more information.

Options not specified retain their value, except as indicated in the following discussion. Thus, in most cases, there is no need to specify options that do not change. For example, if the password to connect to your replication source server has changed, issue this statement to tell the replica about the new password:

```sql
CHANGE MASTER TO MASTER_PASSWORD='new3cret';
```

`MASTER_HOST`, `MASTER_USER`, `MASTER_PASSWORD`, and `MASTER_PORT` provide information to the replica about how to connect to its replication source server:

* `MASTER_HOST` and `MASTER_PORT` are the host name (or IP address) of the master host and its TCP/IP port.

  Note

  Replication cannot use Unix socket files. You must be able to connect to the replication source server using TCP/IP.

  If you specify the `MASTER_HOST` or `MASTER_PORT` option, the replica assumes that the source is different from before (even if the option value is the same as its current value.) In this case, the old values for the source's binary log file name and position are considered no longer applicable, so if you do not specify `MASTER_LOG_FILE` and `MASTER_LOG_POS` in the statement, `MASTER_LOG_FILE=''` and `MASTER_LOG_POS=4` are silently appended to it.

  Setting `MASTER_HOST=''` (that is, setting its value explicitly to an empty string) is *not* the same as not setting `MASTER_HOST` at all. Beginning with MySQL 5.5, trying to set `MASTER_HOST` to an empty string fails with an error. Previously, setting `MASTER_HOST` to an empty string caused [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") subsequently to fail. (Bug #28796)

  Values used for `MASTER_HOST` and other `CHANGE MASTER TO` options are checked for linefeed (`\n` or `0x0A`) characters; the presence of such characters in these values causes the statement to fail with [`ER_MASTER_INFO`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_master_info). (Bug
  #11758581, Bug #50801)

* `MASTER_USER` and `MASTER_PASSWORD` are the user name and password of the account to use for connecting to the source. If you specify `MASTER_PASSWORD`, `MASTER_USER` is also required. The password used for a replication user account in a `CHANGE MASTER TO` statement is limited to 32 characters in length; prior to MySQL 5.7.5, if the password was longer, the statement succeeded, but any excess characters were silently truncated. In MySQL 5.7.5 and later, trying to use a password of more than 32 characters causes `CHANGE MASTER TO` to fail. (Bug
  #11752299, Bug #43439)

  It is possible to set an empty user name by specifying `MASTER_USER=''`, but the replication channel cannot be started with an empty user name. Only set an empty `MASTER_USER` user name if you need to clear previously used credentials from the replica's repositories for security purposes, and do not attempt to use the channel afterwards.

  The text of a running [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement, including values for `MASTER_USER` and `MASTER_PASSWORD`, can be seen in the output of a concurrent [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") statement. (The complete text of a [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") statement is also visible to [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement").)

Setting `MASTER_SSL=1` for a replication connection and then setting no further `MASTER_SSL_xxx` options corresponds to setting `--ssl-mode=REQUIRED` for the client, as described in [Command Options for Encrypted Connections](connection-options.html#encrypted-connection-options "Command Options for Encrypted Connections"). With `MASTER_SSL=1`, the connection attempt only succeeds if an encrypted connection can be established. A replication connection does not fall back to an unencrypted connection, so there is no setting corresponding to the `--ssl-mode=PREFERRED` setting for replication. If `MASTER_SSL=0` is set, this corresponds to `--ssl-mode=DISABLED`.

Important

To help prevent sophisticated man-in-the-middle attacks, it is important for the replica to verify the server’s identity. You can specify additional `MASTER_SSL_xxx` options to correspond to the settings `--ssl-mode=VERIFY_CA` and `--ssl-mode=VERIFY_IDENTITY`, which are a better choice than the default setting to help prevent this type of attack. With these settings, the replica checks that the server’s certificate is valid, and checks that the host name the replica is using matches the identity in the server’s certificate. To implement one of these levels of verification, you must first ensure that the CA certificate for the server is reliably available to the replica, otherwise availability issues will result. For this reason, they are not the default setting.

The `MASTER_SSL_xxx` options and the `MASTER_TLS_VERSION` option specify how the replica uses encryption and ciphers to secure the replication connection. These options can be changed even on replicas that are compiled without SSL support. They are saved to the source metadata repository, but are ignored if the replica does not have SSL support enabled. The `MASTER_SSL_xxx` and `MASTER_TLS_VERSION` options perform the same functions as the `--ssl-xxx` and `--tls-version` client options described in [Command Options for Encrypted Connections](connection-options.html#encrypted-connection-options "Command Options for Encrypted Connections"). The correspondence between the two sets of options, and the use of the `MASTER_SSL_xxx` and `MASTER_TLS_VERSION` options to set up a secure connection, is explained in [Section 16.3.8, “Setting Up Replication to Use Encrypted Connections”](replication-encrypted-connections.html "16.3.8 Setting Up Replication to Use Encrypted Connections").

The `MASTER_HEARTBEAT_PERIOD`, `MASTER_CONNECT_RETRY`, and `MASTER_RETRY_COUNT` options control how the replica recognizes that the connection to the source has been lost and makes attempts to reconnect.

* The [`slave_net_timeout`](replication-options-replica.html#sysvar_slave_net_timeout) system variable specifies the number of seconds that the replica waits for either more data or a heartbeat signal from the source, before the replica considers the connection broken, aborts the read, and tries to reconnect. The default value is 60 seconds (one minute). Prior to MySQL 5.7.7, the default was 3600 seconds (one hour).

* The heartbeat interval, which stops the connection timeout occurring in the absence of data if the connection is still good, is controlled by the `MASTER_HEARTBEAT_PERIOD` option. A heartbeat signal is sent to the replica after that number of seconds, and the waiting period is reset whenever the source's binary log is updated with an event. Heartbeats are therefore sent by the source only if there are no unsent events in the binary log file for a period longer than this. The heartbeat interval *`interval`* is a decimal value having the range 0 to 4294967 seconds and a resolution in milliseconds; the smallest nonzero value is 0.001. Setting *`interval`* to 0 disables heartbeats altogether. The heartbeat interval defaults to half the value of the [`slave_net_timeout`](replication-options-replica.html#sysvar_slave_net_timeout) system variable. It is recorded in the source metadata repository and shown in the [`replication_connection_configuration`](performance-schema-replication-connection-configuration-table.html "25.12.11.1 The replication_connection_configuration Table") Performance Schema table.

* Prior to MySQL 5.7.4, not including `MASTER_HEARTBEAT_PERIOD` caused `CHANGE MASTER TO` to reset the heartbeat interval to the default (half the value of the [`slave_net_timeout`](replication-options-replica.html#sysvar_slave_net_timeout) system variable), and [`Slave_received_heartbeats`](server-status-variables.html#statvar_Slave_received_heartbeats) to 0. The heartbeat interval is now not reset except by [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement"). (Bug #18185490)

* Note that a change to the value or default setting of [`slave_net_timeout`](replication-options-replica.html#sysvar_slave_net_timeout) does not automatically change the heartbeat interval, whether that has been set explicitly or is using a previously calculated default. A warning is issued if you set `@@GLOBAL.slave_net_timeout` to a value less than that of the current heartbeat interval. If [`slave_net_timeout`](replication-options-replica.html#sysvar_slave_net_timeout) is changed, you must also issue [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") to adjust the heartbeat interval to an appropriate value so that the heartbeat signal occurs before the connection timeout. If you do not do this, the heartbeat signal has no effect, and if no data is received from the source, the replica can make repeated reconnection attempts, creating zombie dump threads.

* If the replica does need to reconnect, the first retry occurs immediately after the timeout. `MASTER_CONNECT_RETRY` specifies the interval between reconnection attempts, and `MASTER_RETRY_COUNT` limits the number of reconnection attempts. If both the default settings are used, the replica waits 60 seconds between reconnection attempts (`MASTER_CONNECT_RETRY=60`), and keeps attempting to reconnect at this rate for 60 days (`MASTER_RETRY_COUNT=86400`). A setting of 0 for `MASTER_RETRY_COUNT` means that there is no limit on the number of reconnection attempts, so the replica keeps trying to reconnect indefinitely. These values are recorded in the source metadata repository and shown in the [`replication_connection_configuration`](performance-schema-replication-connection-configuration-table.html "25.12.11.1 The replication_connection_configuration Table") Performance Schema table. `MASTER_RETRY_COUNT` supersedes the [`--master-retry-count`](replication-options-replica.html#option_mysqld_master-retry-count) server startup option.

`MASTER_DELAY` specifies how many seconds behind the source the replica must lag. An event received from the source is not executed until at least *`interval`* seconds later than its execution on the source. The default is 0. An error occurs if *`interval`* is not a nonnegative integer in the range from 0 to 231−1. For more information, see [Section 16.3.10, “Delayed Replication”](replication-delayed.html "16.3.10 Delayed Replication").

From MySQL 5.7, a `CHANGE MASTER TO` statement employing the `MASTER_DELAY` option can be executed on a running replica when the replication SQL thread is stopped.

`MASTER_BIND` is for use on replicas having multiple network interfaces, and determines which of the replica's network interfaces is chosen for connecting to the source.

The address configured with this option, if any, can be seen in the `Master_Bind` column of the output from [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement"). If you are using a table for the source metadata repository (server started with [`master_info_repository=TABLE`](replication-options-replica.html#sysvar_master_info_repository)), the value can also be seen as the `Master_bind` column of the `mysql.slave_master_info` table.

The ability to bind a replica to a specific network interface is also supported by NDB Cluster.

`MASTER_LOG_FILE` and `MASTER_LOG_POS` are the coordinates at which the replication I/O thread should begin reading from the source the next time the thread starts. `RELAY_LOG_FILE` and `RELAY_LOG_POS` are the coordinates at which the replication SQL thread should begin reading from the relay log the next time the thread starts. If you specify any of these options, you cannot specify `MASTER_AUTO_POSITION = 1` (described later in this section). If neither of `MASTER_LOG_FILE` or `MASTER_LOG_POS` is specified, the replica uses the last coordinates of the *replication SQL thread* before [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") was issued. This ensures that there is no discontinuity in replication, even if the replication SQL thread was late compared to the replication I/O thread, when you merely want to change, say, the password to use.

From MySQL 5.7, a `CHANGE MASTER TO` statement employing `RELAY_LOG_FILE`, `RELAY_LOG_POS`, or both options can be executed on a running replica when the replication SQL thread is stopped. Prior to MySQL 5.7.4, `CHANGE MASTER TO` deletes all relay log files and starts a new one, unless you specify `RELAY_LOG_FILE` or `RELAY_LOG_POS`. In that case, relay log files are kept; the [`relay_log_purge`](replication-options-replica.html#sysvar_relay_log_purge) global variable is set silently to 0. In MySQL 5.7.4 and later, relay logs are preserved if at least one of the replication SQL thread and the replication I/O thread is running. If both threads are stopped, all relay log files are deleted unless at least one of `RELAY_LOG_FILE` or `RELAY_LOG_POS` is specified. For the Group Replication applier channel (`group_replication_applier`), which only has an SQL thread and no I/O thread, this is the case if the SQL thread is stopped, but with that channel you cannot use the `RELAY_LOG_FILE` and `RELAY_LOG_POS` options.

`RELAY_LOG_FILE` can use either an absolute or relative path, and uses the same base name as `MASTER_LOG_FILE`. (Bug #12190)

When `MASTER_AUTO_POSITION = 1` is used with `CHANGE MASTER TO`, the replica attempts to connect to the source using the auto-positioning feature of GTID-based replication, rather than a binary log file based position. From MySQL 5.7, this option can be employed by `CHANGE MASTER TO` only if both the replication SQL thread and the replication I/O thread are stopped. Both the replica and the source must have GTIDs enabled ([`GTID_MODE=ON`](replication-options-gtids.html#sysvar_gtid_mode), `ON_PERMISSIVE,` or `OFF_PERMISSIVE` on the replica, and [`GTID_MODE=ON`](replication-options-gtids.html#sysvar_gtid_mode) on the source). `MASTER_LOG_FILE`, `MASTER_LOG_POS`, `RELAY_LOG_FILE`, and `RELAY_LOG_POS` cannot be specified together with `MASTER_AUTO_POSITION = 1`. If multi-source replication is enabled on the replica, you need to set the `MASTER_AUTO_POSITION = 1` option for each applicable replication channel.

With `MASTER_AUTO_POSITION = 1` set, in the initial connection handshake, the replica sends a GTID set containing the transactions that it has already received, committed, or both. The source responds by sending all transactions recorded in its binary log whose GTID is not included in the GTID set sent by the replica. This exchange ensures that the source only sends the transactions with a GTID that the replica has not already recorded or committed. If the replica receives transactions from more than one source, as in the case of a diamond topology, the auto-skip function ensures that the transactions are not applied twice. For details of how the GTID set sent by the replica is computed, see [Section 16.1.3.3, “GTID Auto-Positioning”](replication-gtids-auto-positioning.html "16.1.3.3 GTID Auto-Positioning").

If any of the transactions that should be sent by the source have been purged from the source's binary log, or added to the set of GTIDs in the [`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged) system variable by another method, the source sends the error [`ER_MASTER_HAS_PURGED_REQUIRED_GTIDS`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_master_has_purged_required_gtids) to the replica, and replication does not start. Also, if during the exchange of transactions it is found that the replica has recorded or committed transactions with the source's UUID in the GTID, but the source itself has not committed them, the source sends the error [`ER_SLAVE_HAS_MORE_GTIDS_THAN_MASTER`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_slave_has_more_gtids_than_master) to the replica and replication does not start. For information on how to handle these situations, see [Section 16.1.3.3, “GTID Auto-Positioning”](replication-gtids-auto-positioning.html "16.1.3.3 GTID Auto-Positioning").

`IGNORE_SERVER_IDS` takes a comma-separated list of 0 or more server IDs. Events originating from the corresponding servers are ignored, with the exception of log rotation and deletion events, which are still recorded in the relay log.

In circular replication, the originating server normally acts as the terminator of its own events, so that they are not applied more than once. Thus, this option is useful in circular replication when one of the servers in the circle is removed. Suppose that you have a circular replication setup with 4 servers, having server IDs 1, 2, 3, and 4, and server 3 fails. When bridging the gap by starting replication from server 2 to server 4, you can include `IGNORE_SERVER_IDS = (3)` in the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement that you issue on server 4 to tell it to use server 2 as its source instead of server 3. Doing so causes it to ignore and not to propagate any statements that originated with the server that is no longer in use.

If a [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement is issued without any `IGNORE_SERVER_IDS` option, any existing list is preserved. To clear the list of ignored servers, it is necessary to use the option with an empty list:

```sql
CHANGE MASTER TO IGNORE_SERVER_IDS = ();
```

Prior to MySQL 5.7.5, [`RESET SLAVE ALL`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") has no effect on the server ID list. In MySQL 5.7.5 and later, `RESET SLAVE ALL` clears `IGNORE_SERVER_IDS`. (Bug #18816897)

If `IGNORE_SERVER_IDS` contains the server's own ID and the server was started with the [`--replicate-same-server-id`](replication-options-replica.html#option_mysqld_replicate-same-server-id) option enabled, an error results.

The source metadata repository and the output of [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") provide the list of servers that are currently ignored. For more information, see [Section 16.2.4.2, “Replication Metadata Repositories”](replica-logs-status.html "16.2.4.2 Replication Metadata Repositories"), and [Section 13.7.5.34, “SHOW SLAVE STATUS Statement”](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement").

Invoking [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") causes the previous values for `MASTER_HOST`, `MASTER_PORT`, `MASTER_LOG_FILE`, and `MASTER_LOG_POS` to be written to the error log, along with other information about the replica's state prior to execution.

`CHANGE MASTER TO` causes an implicit commit of an ongoing transaction. See [Section 13.3.3, “Statements That Cause an Implicit Commit”](implicit-commit.html "13.3.3 Statements That Cause an Implicit Commit").

In MySQL 5.7.4 and later, the strict requirement to execute [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") prior to issuing any [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement (and [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") afterward) is removed. Instead of depending on whether the replica is stopped, the behavior of `CHANGE MASTER TO` depends (in MySQL 5.7.4 and later) on the states of the replication SQL thread and the replication I/O thread; which of these threads is stopped or running now determines the options that can or cannot be used with a `CHANGE MASTER TO` statement at a given point in time. The rules for making this determination are listed here:

* If the SQL thread is stopped, you can execute `CHANGE MASTER TO` using any combination that is otherwise allowed of `RELAY_LOG_FILE`, `RELAY_LOG_POS`, and `MASTER_DELAY` options, even if the replication I/O thread is running. No other options may be used with this statement when the I/O thread is running.

* If the I/O thread is stopped, you can execute `CHANGE MASTER TO` using any of the options for this statement (in any allowed combination) *except* `RELAY_LOG_FILE`, `RELAY_LOG_POS`, `MASTER_DELAY`, or `MASTER_AUTO_POSITION = 1` even when the SQL thread is running.

* Both the SQL thread and the I/O thread must be stopped before issuing a `CHANGE MASTER TO` statement that employs `MASTER_AUTO_POSITION = 1`.

You can check the current state of the replication SQL thread and the replication I/O thread using [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement"). Note that the Group Replication applier channel (`group_replication_applier`) has no I/O thread, only an SQL thread.

For more information, see [Section 16.3.7, “Switching Sources During Failover”](replication-solutions-switch.html "16.3.7 Switching Sources During Failover").

If you are using statement-based replication and temporary tables, it is possible for a `CHANGE MASTER TO` statement following a `STOP SLAVE` statement to leave behind temporary tables on the replica. From MySQL 5.7, a warning ([`ER_WARN_OPEN_TEMP_TABLES_MUST_BE_ZERO`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_warn_open_temp_tables_must_be_zero)) is issued whenever this occurs. You can avoid this in such cases by making sure that the value of the [`Slave_open_temp_tables`](server-status-variables.html#statvar_Slave_open_temp_tables) system status variable is equal to 0 prior to executing such a `CHANGE MASTER TO` statement.

[`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") is useful for setting up a replica when you have the snapshot of the replication source server and have recorded the source's binary log coordinates corresponding to the time of the snapshot. After loading the snapshot into the replica to synchronize it with the source, you can run `CHANGE MASTER TO MASTER_LOG_FILE='log_name', MASTER_LOG_POS=log_pos` on the replica to specify the coordinates at which the replica should begin reading the source's binary log.

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

The next example shows an operation that is less frequently employed. It is used when the replica has relay log files that you want it to execute again for some reason. To do this, the source need not be reachable. You need only use [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") and start the SQL thread (`START SLAVE SQL_THREAD`):

```sql
CHANGE MASTER TO
  RELAY_LOG_FILE='replica-relay-bin.006',
  RELAY_LOG_POS=4025;
```

The following table shows the maximum permissible length for the string-valued options.

<table summary="The maximum permissible length for CHANGE MASTER TO string-valued options."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Option</th> <th>Maximum Length</th> </tr></thead><tbody><tr> <td><code class="literal">MASTER_HOST</code></td> <td>60</td> </tr><tr> <td><code class="literal">MASTER_USER</code></td> <td>96</td> </tr><tr> <td><code class="literal">MASTER_PASSWORD</code></td> <td>32</td> </tr><tr> <td><code class="literal">MASTER_LOG_FILE</code></td> <td>511</td> </tr><tr> <td><code class="literal">RELAY_LOG_FILE</code></td> <td>511</td> </tr><tr> <td><code class="literal">MASTER_SSL_CA</code></td> <td>511</td> </tr><tr> <td><code class="literal">MASTER_SSL_CAPATH</code></td> <td>511</td> </tr><tr> <td><code class="literal">MASTER_SSL_CERT</code></td> <td>511</td> </tr><tr> <td><code class="literal">MASTER_SSL_CRL</code></td> <td>511</td> </tr><tr> <td><code class="literal">MASTER_SSL_CRLPATH</code></td> <td>511</td> </tr><tr> <td><code class="literal">MASTER_SSL_KEY</code></td> <td>511</td> </tr><tr> <td><code class="literal">MASTER_SSL_CIPHER</code></td> <td>511</td> </tr><tr> <td><code class="literal">MASTER_TLS_VERSION</code></td> <td>511</td> </tr></tbody></table>
