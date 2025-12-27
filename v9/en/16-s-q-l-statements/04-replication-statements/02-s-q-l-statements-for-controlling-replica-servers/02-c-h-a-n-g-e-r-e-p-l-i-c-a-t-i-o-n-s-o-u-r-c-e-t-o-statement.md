#### 15.4.2.2 CHANGE REPLICATION SOURCE TO Statement

```
CHANGE REPLICATION SOURCE TO option [, option] ... [ channel_option ]

option: {
    SOURCE_BIND = 'interface_name'
  | SOURCE_HOST = 'host_name'
  | SOURCE_USER = 'user_name'
  | SOURCE_PASSWORD = 'password'
  | SOURCE_PORT = port_num
  | PRIVILEGE_CHECKS_USER = {NULL | 'account'}
  | REQUIRE_ROW_FORMAT = {0|1}
  | REQUIRE_TABLE_PRIMARY_KEY_CHECK = {STREAM | ON | OFF | GENERATE}
  | ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS = {OFF | LOCAL | uuid}
  | SOURCE_LOG_FILE = 'source_log_name'
  | SOURCE_LOG_POS = source_log_pos
  | SOURCE_AUTO_POSITION = {0|1}
  | RELAY_LOG_FILE = 'relay_log_name'
  | RELAY_LOG_POS = relay_log_pos
  | SOURCE_HEARTBEAT_PERIOD = interval
  | SOURCE_CONNECT_RETRY = interval
  | SOURCE_RETRY_COUNT = count
  | SOURCE_CONNECTION_AUTO_FAILOVER = {0|1}
  | SOURCE_DELAY = interval
  | SOURCE_COMPRESSION_ALGORITHMS = 'algorithm[,algorithm][,algorithm]'
  | SOURCE_ZSTD_COMPRESSION_LEVEL = level
  | SOURCE_SSL = {0|1}
  | SOURCE_SSL_CA = 'ca_file_name'
  | SOURCE_SSL_CAPATH = 'ca_directory_name'
  | SOURCE_SSL_CERT = 'cert_file_name'
  | SOURCE_SSL_CRL = 'crl_file_name'
  | SOURCE_SSL_CRLPATH = 'crl_directory_name'
  | SOURCE_SSL_KEY = 'key_file_name'
  | SOURCE_SSL_CIPHER = 'cipher_list'
  | SOURCE_SSL_VERIFY_SERVER_CERT = {0|1}
  | SOURCE_TLS_VERSION = 'protocol_list'
  | SOURCE_TLS_CIPHERSUITES = 'ciphersuite_list'
  | SOURCE_PUBLIC_KEY_PATH = 'key_file_name'
  | GET_SOURCE_PUBLIC_KEY = {0|1}
  | NETWORK_NAMESPACE = 'namespace'
  | IGNORE_SERVER_IDS = (server_id_list),
  | GTID_ONLY = {0|1}
}

channel_option:
    FOR CHANNEL channel

server_id_list:
    [server_id [, server_id] ... ]
```

`CHANGE REPLICATION SOURCE TO` changes the parameters that the replica server uses for connecting to the source and reading data from the source. It also updates the contents of the replication metadata repositories (see Section 19.2.4, “Relay Log and Replication Metadata Repositories”).

`CHANGE REPLICATION SOURCE TO` requires the `REPLICATION_SLAVE_ADMIN` privilege (or the deprecated `SUPER` privilege).

Options that you do not specify on a `CHANGE REPLICATION SOURCE TO` statement retain their value, except as indicated in the following discussion. In most cases, there is therefore no need to specify options that do not change.

Values used for `SOURCE_HOST` and other `CHANGE REPLICATION SOURCE TO` options are checked for linefeed (`\n` or `0x0A`) characters. The presence of such characters in these values causes the statement to fail with an error.

The optional `FOR CHANNEL channel` clause lets you name which replication channel the statement applies to. Providing a `FOR CHANNEL channel` clause applies the `CHANGE REPLICATION SOURCE TO` statement to a specific replication channel, and is used to add a new channel or modify an existing channel. For example, to add a new channel called `channel2`:

```
CHANGE REPLICATION SOURCE TO SOURCE_HOST=host1, SOURCE_PORT=3002 FOR CHANNEL 'channel2';
```

If no clause is named and no extra channels exist, a `CHANGE REPLICATION SOURCE TO` statement applies to the default channel, whose name is the empty string (""). When you have set up multiple replication channels, every `CHANGE REPLICATION SOURCE TO` statement must name a channel using the `FOR CHANNEL channel` clause. See Section 19.2.2, “Replication Channels” for more information.

For some of the options of the `CHANGE REPLICATION SOURCE TO` statement, you must issue a `STOP REPLICA` statement prior to issuing a `CHANGE REPLICATION SOURCE TO` statement (and a `START REPLICA` statement afterwards). Sometimes, you only need to stop the replication SQL (applier) thread or the replication I/O (receiver) thread, not both:

* When the applier thread is stopped, you can execute `CHANGE REPLICATION SOURCE TO` using any combination that is otherwise allowed of `RELAY_LOG_FILE`, `RELAY_LOG_POS`, and `SOURCE_DELAY` options, even if the replication receiver thread is running. No other options may be used with this statement when the receiver thread is running.

* When the receiver thread is stopped, you can execute `CHANGE REPLICATION SOURCE TO` using any of the options for this statement (in any allowed combination) *except* `RELAY_LOG_FILE`, `RELAY_LOG_POS`, `SOURCE_DELAY`, or `SOURCE_AUTO_POSITION = 1` even when the applier thread is running.

* Both the receiver thread and the applier thread must be stopped before issuing a `CHANGE REPLICATION SOURCE TO` statement that employs `SOURCE_AUTO_POSITION = 1`, `GTID_ONLY = 1`, or `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`.

You can check the current state of the replication applier thread and replication receiver thread using `SHOW REPLICA STATUS`. Note that the Group Replication applier channel (`group_replication_applier`) has no receiver thread, only an applier thread.

`CHANGE REPLICATION SOURCE TO` statements have a number of side-effects and interactions that you should be aware of beforehand:

* `CHANGE REPLICATION SOURCE TO` causes an implicit commit of an ongoing transaction. See Section 15.3.3, “Statements That Cause an Implicit Commit”.

* `CHANGE REPLICATION SOURCE TO` causes the previous values for `SOURCE_HOST`, `SOURCE_PORT`, `SOURCE_LOG_FILE`, and `SOURCE_LOG_POS` to be written to the error log, along with other information about the replica's state prior to execution.

* If you are using statement-based replication and temporary tables, it is possible for a `CHANGE REPLICATION SOURCE TO` statement following a `STOP REPLICA` statement to leave behind temporary tables on the replica. A warning (`ER_WARN_OPEN_TEMP_TABLES_MUST_BE_ZERO`) is issued whenever this occurs. You can avoid this in such cases by making sure that the value of the `Replica_open_temp_tables` system status variable is equal to 0 prior to executing such a `CHANGE REPLICATION SOURCE TO` statement.

* Stopping the replica can cause gaps in the sequence of transactions that have been executed from the relay log, regardless of whether the replica was stopped intentionally or otherwise. In MySQL 9.5, these can be resolved using GTID auto-positioning.

The following options are available for `CHANGE REPLICATION SOURCE TO` statements:

* `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS = {OFF | LOCAL | uuid}`

  Makes the replication channel assign a GTID to replicated transactions that do not have one, enabling replication from a source that does not use GTID-based replication, to a replica that does. For a multi-source replica, you can have a mix of channels that use `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`, and channels that do not. The default is `OFF`, meaning that the feature is not used.

  `LOCAL` assigns a GTID including the replica's own UUID (the `server_uuid` setting). `uuid` assigns a GTID including the specified UUID, such as the `server_uuid` setting for the replication source server. Using a nonlocal UUID lets you differentiate between transactions that originated on the replica and transactions that originated on the source, and for a multi-source replica, between transactions that originated on different sources. The UUID you choose only has significance for the replica's own use. If any of the transactions sent by the source do have a GTID already, that GTID is retained.

  Channels specific to Group Replication cannot use `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`, but an asynchronous replication channel for another source on a server instance that is a Group Replication group member can do so. In that case, do not specify the Group Replication group name as the UUID for creating the GTIDs.

  To set `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` to `LOCAL` or `uuid`, the replica must have `gtid_mode=ON` set, and this cannot be changed afterwards. This option is for use with a source that has binary log file position based replication, so `SOURCE_AUTO_POSITION=1` cannot be set for the channel. Both the replication SQL thread and the replication I/O (receiver) thread must be stopped before setting this option.

  Important

  A replica set up with `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` on any channel cannot be promoted to replace the replication source server in the event that a failover is required, and a backup taken from the replica cannot be used to restore the replication source server. The same restriction applies to replacing or restoring other replicas that use `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` on any channel.

  For further restrictions and information, see Section 19.1.3.6, “Replication From a Source Without GTIDs to a Replica With GTIDs”.

* `GET_SOURCE_PUBLIC_KEY = {0|1}`

  Enables RSA key pair-based password exchange by requesting the public key from the source. The option is disabled by default.

  This option applies to replicas that authenticate with the `caching_sha2_password` authentication plugin. For connections by accounts that authenticate using this plugin, the source does not send the public key unless requested, so it must be requested or specified in the client. If `SOURCE_PUBLIC_KEY_PATH` is given and specifies a valid public key file, it takes precedence over `GET_SOURCE_PUBLIC_KEY`. If you are using a replication user account that authenticates with the `caching_sha2_password` plugin (the default), and you are not using a secure connection, you must specify either this option or the `SOURCE_PUBLIC_KEY_PATH` option to provide the RSA public key to the replica.

* `GTID_ONLY = {0|1}`

  Stops the replication channel persisting file names and file positions in the replication metadata repositories. `GTID_ONLY` is disabled by default for asynchronous replication channels, but is enabled by default for Group Replication channels, for which it cannot be disabled.

  For replication channels with this setting, in-memory file positions are still tracked, and file positions can still be observed for debugging purposes in error messages and through interfaces such as `SHOW REPLICA STATUS` statements (where they are shown as being invalid if they are out of date). However, the writes and reads required to persist and check the file positions are avoided in situations where GTID-based replication does not actually require them, including the transaction queuing and application process.

  This option can be used only if both the replication SQL (applier) thread and replication I/O (receiver) thread are stopped. To set `GTID_ONLY = 1` for a replication channel, GTIDs must be in use on the server (`gtid_mode = ON`), and row-based binary logging must be in use on the source (statement-based replication is not supported). The options `REQUIRE_ROW_FORMAT = 1` and `SOURCE_AUTO_POSITION = 1` must be set for the replication channel.

  When `GTID_ONLY = 1` is set, the replica uses `replica_parallel_workers=1` if that system variable is set to zero for the server, so it is always technically a multi-threaded applier. This is because a multi-threaded applier uses saved positions rather than the replication metadata repositories to locate the start of a transaction that it needs to reapply.

  If you disable `GTID_ONLY` after setting it, the existing relay logs are deleted and the existing known binary log file positions are persisted, even if they are stale. The file positions for the binary log and relay log in the replication metadata repositories might be invalid, and a warning is returned if this is the case. Provided that `SOURCE_AUTO_POSITION` is still enabled, GTID auto-positioning is used to provide the correct positioning.

  If you also disable `SOURCE_AUTO_POSITION`, the file positions for the binary log and relay log in the replication metadata repositories are used for positioning if they are valid. If they are marked as invalid, you must provide a valid binary log file name and position (`SOURCE_LOG_FILE` and `SOURCE_LOG_POS`). If you also provide a relay log file name and position (`RELAY_LOG_FILE` and `RELAY_LOG_POS`), the relay logs are preserved and the applier position is set to the stated position. GTID auto-skip ensures that any transactions already applied are skipped even if the eventual applier position is not correct.

* `IGNORE_SERVER_IDS = (server_id_list)`

  Makes the replica ignore events originating from the specified servers. The option takes a comma-separated list of 0 or more server IDs. Log rotation and deletion events from the servers are not ignored, and are recorded in the relay log.

  In circular replication, the originating server normally acts as the terminator of its own events, so that they are not applied more than once. Thus, this option is useful in circular replication when one of the servers in the circle is removed. Suppose that you have a circular replication setup with 4 servers, having server IDs 1, 2, 3, and 4, and server 3 fails. When bridging the gap by starting replication from server 2 to server 4, you can include `IGNORE_SERVER_IDS = (3)` in the `CHANGE REPLICATION SOURCE TO` statement that you issue on server 4 to tell it to use server 2 as its source instead of server 3. Doing so causes it to ignore and not to propagate any statements that originated with the server that is no longer in use.

  If `IGNORE_SERVER_IDS` contains the server's own ID and the server was started with the `--replicate-same-server-id` option enabled, an error results.

  The source metadata repository and the output of `SHOW REPLICA STATUS` provide the list of servers that are currently ignored. For more information, see Section 19.2.4.2, “Replication Metadata Repositories”, and Section 15.7.7.36, “SHOW REPLICA STATUS Statement”.

  If a `CHANGE REPLICATION SOURCE TO` statement is issued without `IGNORE_SERVER_IDS`, any existing list is preserved. To clear the list of ignored servers, it is necessary to use the option with an empty list, like this:

  ```
  CHANGE REPLICATION SOURCE TO IGNORE_SERVER_IDS = ();
  ```

  `RESET REPLICA ALL` also clears `IGNORE_SERVER_IDS`.

  When global transaction identifiers (GTIDs) are used for replication, transactions that have already been applied are automatically ignored. Because of this, `IGNORE_SERVER_IDS` is not compatible with `gtid_mode=ON`. If `gtid_mode` is `ON`, `CHANGE REPLICATION SOURCE TO` with a non-empty `IGNORE_SERVER_IDS` list is rejected with an error. Likewise, if any existing replication channel was created with a list of server IDs to be ignored, `SET gtid_mode=ON` is also rejected. Before starting GTID-based replication, check for and clear any ignored server ID lists on the servers involved; you can do this by checking the output from `SHOW REPLICA STATUS`. In such cases, you can clear the list by issuing `CHANGE REPLICATION SOURCE TO` with an empty list of server IDs as shown previously.

* `NETWORK_NAMESPACE = 'namespace'`

  The network namespace to use for TCP/IP connections to the replication source server or, if the MySQL communication stack is in use, for Group Replication’s group communication connections. The maximum length of the string value is 64 characters. If this option is omitted, connections from the replica use the default (global) namespace. On platforms that do not implement network namespace support, failure occurs when the replica attempts to connect to the source. For information about network namespaces, see Section 7.1.14, “Network Namespace Support”.

* `PRIVILEGE_CHECKS_USER = {NULL | 'account'}`

  Names a user account that supplies a security context for the specified channel. `NULL`, which is the default, means no security context is used.

  The user name and host name for the user account must follow the syntax described in Section 8.2.4, “Specifying Account Names”, and the user must not be an anonymous user (with a blank user name) or the `CURRENT_USER`. The account must have the `REPLICATION_APPLIER` privilege, plus the required privileges to execute the transactions replicated on the channel. For details of the privileges required by the account, see Section 19.3.3, “Replication Privilege Checks”. When you restart the replication channel, the privilege checks are applied from that point on. If you do not specify a channel and no other channels exist, the statement is applied to the default channel.

  The use of row-based binary logging is strongly recommended when `PRIVILEGE_CHECKS_USER` is set, and you can set `REQUIRE_ROW_FORMAT` to enforce this. For example, to start privilege checks on the channel `channel_1` on a running replica, issue the following statements:

  ```
  STOP REPLICA FOR CHANNEL 'channel_1';

  CHANGE REPLICATION SOURCE TO
      PRIVILEGE_CHECKS_USER = 'user'@'host',
      REQUIRE_ROW_FORMAT = 1,
      FOR CHANNEL 'channel_1';

  START REPLICA FOR CHANNEL 'channel_1';
  ```

* `RELAY_LOG_FILE = 'relay_log_file'` , `RELAY_LOG_POS = 'relay_log_pos'`

  The relay log file name, and the location in that file, at which the replication SQL thread begins reading from the replica's relay log the next time the thread starts. `RELAY_LOG_FILE` can use either an absolute or relative path, and uses the same base name as `SOURCE_LOG_FILE`. The maximum length of the string value is 511 characters.

  A `CHANGE REPLICATION SOURCE TO` statement using `RELAY_LOG_FILE`, `RELAY_LOG_POS`, or both options can be executed on a running replica when the replication SQL (applier) thread is stopped. Relay logs are preserved if at least one of the replication applier thread and the replication I/O (receiver) thread is running. If both threads are stopped, all relay log files are deleted unless at least one of `RELAY_LOG_FILE` or `RELAY_LOG_POS` is specified. For the Group Replication applier channel (`group_replication_applier`), which only has an applier thread and no receiver thread, this is the case if the applier thread is stopped, but with that channel you cannot use the `RELAY_LOG_FILE` and `RELAY_LOG_POS` options.

* `REQUIRE_ROW_FORMAT = {0|1}`

  Permits only row-based replication events to be processed by the replication channel. This option prevents the replication applier from taking actions such as creating temporary tables and executing `LOAD DATA INFILE` requests, which increases the security of the channel. The `REQUIRE_ROW_FORMAT` option is disabled by default for asynchronous replication channels, but it is enabled by default for Group Replication channels, and it cannot be disabled for them. For more information, see Section 19.3.3, “Replication Privilege Checks”.

* `REQUIRE_TABLE_PRIMARY_KEY_CHECK = {STREAM | ON | OFF | GENERATE}`

  This option lets a replica set its own policy for primary key checks, as follows:

  + `ON`: The replica sets `sql_require_primary_key = ON`; any replicated `CREATE TABLE` or `ALTER TABLE` statement must result in a table that contains a primary key.

  + `OFF`: The replica sets `sql_require_primary_key = OFF`; no replicated `CREATE TABLE` or `ALTER TABLE` statement is checked for the presence of a primary key.

  + `STREAM`: The replica uses whatever value of `sql_require_primary_key` is replicated from the source for each transaction. This is the default value, and the default behavior.

  + `GENERATE`: Causes the replica to generate an invisible primary key for any `InnoDB` table that, as replicated, lacks a primary key. See Section 15.1.24.11, “Generated Invisible Primary Keys”, for more information.

    `GENERATE` is not compatible with Group Replication; you can use `ON`, `OFF`, or `STREAM`.

  A divergence based on the presence of a generated invisible primary key solely on a source or replica table is supported by MySQL Replication as long as the source supports GIPKs and the replica uses MySQL version 8.0.32 or later. If you use GIPKs on a replica with the source using an earlier version of MySQL, such divergences in schema, other than the extra GIPK on the replica, are not supported and may result in replication errors.

  For multisource replication, setting `REQUIRE_TABLE_PRIMARY_KEY_CHECK` to `ON` or `OFF` lets the replica normalize behavior across replication channels for different sources, and to keep a consistent setting for `sql_require_primary_key`. Using `ON` safeguards against the accidental loss of primary keys when multiple sources update the same set of tables. Using `OFF` lets sources that can manipulate primary keys to work alongside sources that cannot.

  In the case of multiple replicas, when `REQUIRE_TABLE_PRIMARY_KEY_CHECK` is set to `GENERATE`, the generated invisible primary key added by a given replica is independent of any such key added on any other replica. This means that, if generated invisible primary keys are in use, the values in the generated primary key columns on different replicas are not guaranteed to be the same. This may be an issue when failing over to such a replica.

  When `PRIVILEGE_CHECKS_USER` is `NULL` (the default), the user account does not need administration level privileges to set restricted session variables. Setting this option to a value other than `NULL` means that, when `REQUIRE_TABLE_PRIMARY_KEY_CHECK` is `ON`, `OFF`, or `GENERATE`, the user account does not require session administration level privileges to set restricted session variables such as `sql_require_primary_key`, avoiding the need to grant the account such privileges. For more information, see Section 19.3.3, “Replication Privilege Checks”.

* `SOURCE_AUTO_POSITION = {0|1}`

  Makes the replica attempt to connect to the source using the auto-positioning feature of GTID-based replication, rather than a binary log file based position. This option is used to start a replica using GTID-based replication. The default is 0, meaning that GTID auto-positioning and GTID-based replication are not used. This option can be used with `CHANGE REPLICATION SOURCE TO` only if both the replication SQL (applier) thread and replication I/O (receiver) thread are stopped.

  Both the replica and the source must have GTIDs enabled (`GTID_MODE=ON`, `ON_PERMISSIVE,` or `OFF_PERMISSIVE` on the replica, and `GTID_MODE=ON` on the source). `SOURCE_LOG_FILE`, `SOURCE_LOG_POS`, `RELAY_LOG_FILE`, and `RELAY_LOG_POS` cannot be specified together with `SOURCE_AUTO_POSITION = 1`. If multi-source replication is enabled on the replica, you need to set the `SOURCE_AUTO_POSITION = 1` option for each applicable replication channel.

  With `SOURCE_AUTO_POSITION = 1` set, in the initial connection handshake, the replica sends a GTID set containing the transactions that it has already received, committed, or both. The source responds by sending all transactions recorded in its binary log whose GTID is not included in the GTID set sent by the replica. This exchange ensures that the source only sends the transactions with a GTID that the replica has not already recorded or committed. If the replica receives transactions from more than one source, as in the case of a diamond topology, the auto-skip function ensures that the transactions are not applied twice. For details of how the GTID set sent by the replica is computed, see Section 19.1.3.3, “GTID Auto-Positioning”.

  If any of the transactions that should be sent by the source have been purged from the source's binary log, or added to the set of GTIDs in the `gtid_purged` system variable by another method, the source sends the error `ER_SOURCE_HAS_PURGED_REQUIRED_GTIDS` to the replica, and replication does not start. The GTIDs of the missing purged transactions are identified and listed in the source's error log in the warning message `ER_FOUND_MISSING_GTIDS`. Also, if during the exchange of transactions it is found that the replica has recorded or committed transactions with the source's UUID in the GTID, but the source itself has not committed them, the source sends the error `ER_REPLICA_HAS_MORE_GTIDS_THAN_SOURCE` to the replica and replication does not start. For information on how to handle these situations, see Section 19.1.3.3, “GTID Auto-Positioning”.

  You can see whether replication is running with GTID auto-positioning enabled by checking the Performance Schema `replication_connection_status` table or the output of `SHOW REPLICA STATUS`. Disabling the `SOURCE_AUTO_POSITION` option again makes the replica revert to file-based replication.

* `SOURCE_BIND = 'interface_name'`

  Determines which of the replica's network interfaces is chosen for connecting to the source, for use on replicas that have multiple network interfaces. Specify the IP address of the network interface. The maximum length of the string value is 255 characters.

  The IP address configured with this option, if any, can be seen in the `Source_Bind` column of the output from `SHOW REPLICA STATUS`. In the source metadata repository table `mysql.slave_master_info`, the value can be seen as the `Source_bind` column. The ability to bind a replica to a specific network interface is also supported by NDB Cluster.

* `SOURCE_COMPRESSION_ALGORITHMS = 'algorithm[,algorithm][,algorithm]'`

  Specifies one, two, or three of the permitted compression algorithms for connections to the replication source server, separated by commas. The maximum length of the string value is 99 characters. The default value is `uncompressed`.

  The available algorithms are `zlib`, `zstd`, and `uncompressed`, the same as for the `protocol_compression_algorithms` system variable. The algorithms can be specified in any order, but it is not an order of preference - the algorithm negotiation process attempts to use `zlib`, then `zstd`, then `uncompressed`, if they are specified.

  The value of `SOURCE_COMPRESSION_ALGORITHMS` applies only if the `replica_compressed_protocol` system variable is disabled. If `replica_compressed_protocol` is enabled, it takes precedence over `SOURCE_COMPRESSION_ALGORITHMS` and connections to the source use `zlib` compression if both source and replica support that algorithm. For more information, see Section 6.2.8, “Connection Compression Control”.

  Binary log transaction compression is activated by the `binlog_transaction_compression` system variable, and can also be used to save bandwidth. If you do this in combination with connection compression, connection compression has less opportunity to act on the data, but can still compress headers and those events and transaction payloads that are uncompressed. For more information on binary log transaction compression, see Section 7.4.4.5, “Binary Log Transaction Compression”.

* `SOURCE_CONNECT_RETRY = interval`

  Specifies the interval in seconds between the reconnection attempts that the replica makes after the connection to the source times out. The default interval is 60.

  The number of attempts is limited by the `SOURCE_RETRY_COUNT` option. If both the default settings are used, the replica waits 60 seconds between reconnection attempts (`SOURCE_CONNECT_RETRY=60`), and keeps attempting to reconnect at this rate for 10 minutes (`SOURCE_RETRY_COUNT=10`). These values are recorded in the source metadata repository and shown in the `replication_connection_configuration` Performance Schema table.

* `SOURCE_CONNECTION_AUTO_FAILOVER = {0|1}`

  Activates the asynchronous connection failover mechanism for a replication channel if one or more alternative replication source servers are available (so when there are multiple MySQL servers or groups of servers that share the replicated data). The default is 0, meaning that the mechanism is not activated. For full information and instructions to set up this feature, see Section 19.4.9.2, “Asynchronous Connection Failover for Replicas”.

  The asynchronous connection failover mechanism takes over after the reconnection attempts controlled by `SOURCE_CONNECT_RETRY` and `SOURCE_RETRY_COUNT` are exhausted. It reconnects the replica to an alternative source chosen from a specified source list, which you can manage using the functions `asynchronous_connection_failover_add_source()` and `asynchronous_connection_failover_delete_source()`. To add and remove managed groups of servers, use `asynchronous_connection_failover_add_managed()` and `asynchronous_connection_failover_delete_managed()` instead. For more information, see Section 19.4.9, “Switching Sources and Replicas with Asynchronous Connection Failover”.

  Important

  1. You can only set `SOURCE_CONNECTION_AUTO_FAILOVER = 1` when GTID auto-positioning is in use (`SOURCE_AUTO_POSITION = 1`).

  2. When you set `SOURCE_CONNECTION_AUTO_FAILOVER = 1`, set `SOURCE_RETRY_COUNT` and `SOURCE_CONNECT_RETRY` to minimal numbers that just allow a few retry attempts with the same source, in case the connection failure is caused by a transient network outage. Otherwise the asynchronous connection failover mechanism cannot be activated promptly. Suitable values are `SOURCE_RETRY_COUNT=3` and `SOURCE_CONNECT_RETRY=10`, which make the replica retry the connection 3 times with 10-second intervals between.

  3. When you set `SOURCE_CONNECTION_AUTO_FAILOVER = 1`, the replication metadata repositories must contain the credentials for a replication user account that can be used to connect to all the servers on the source list for the replication channel. The account must also have `SELECT` permissions on the Performance Schema tables. These credentials can be set using the `CHANGE REPLICATION SOURCE TO` statement with the `SOURCE_USER` and `SOURCE_PASSWORD` options. For more information, see Section 19.4.9, “Switching Sources and Replicas with Asynchronous Connection Failover”.

  4. When you set `SOURCE_CONNECTION_AUTO_FAILOVER = 1`, asynchronous connection failover for replicas is automatically activated if this replication channel is on a Group Replication primary in a group in single-primary mode. With this function active, if the primary that is replicating goes offline or into an error state, the new primary starts replication on the same channel when it is elected. If you want to use the function, this replication channel must also be set up on all the secondary servers in the replication group, and on any new joining members. (If the servers are provisioned using MySQL’s clone functionality, this all happens automatically.) If you do not want to use the function, disable it by using the `group_replication_disable_member_action()` function to disable the Group Replication member action `mysql_start_failover_channels_if_primary`, which is enabled by default. For more information, see Section 19.4.9.2, “Asynchronous Connection Failover for Replicas”.

* `SOURCE_DELAY = interval`

  Specifies how many seconds behind the source the replica must lag. An event received from the source is not executed until at least *`interval`* seconds later than its execution on the source. *`interval`* must be a nonnegative integer in the range from 0 to 231−1. The default is 0. For more information, see Section 19.4.11, “Delayed Replication”.

  A `CHANGE REPLICATION SOURCE TO` statement using the `SOURCE_DELAY` option can be executed on a running replica when the replication SQL thread is stopped.

* `SOURCE_HEARTBEAT_PERIOD = interval`

  Controls the heartbeat interval, which stops the connection timeout occurring in the absence of data if the connection is still good. A heartbeat signal is sent to the replica after that number of seconds, and the waiting period is reset whenever the source's binary log is updated with an event. Heartbeats are therefore sent by the source only if there are no unsent events in the binary log file for a period longer than this.

  The heartbeat interval *`interval`* is a decimal value having the range 0 to 4294967 seconds and a resolution in milliseconds; the smallest nonzero value is 0.001. Setting *`interval`* to 0 disables heartbeats altogether. The heartbeat interval defaults to half the value of the `replica_net_timeout` system variable. It is recorded in the source metadata repository and shown in the `replication_connection_configuration` Performance Schema table.

  The `replica_net_timeout` system variable specifies the number of seconds that the replica waits for either more data or a heartbeat signal from the source, before the replica considers the connection broken, aborts the read, and tries to reconnect. The default value is 60 seconds (one minute). Note that a change to the value or default setting of `replica_net_timeout` does not automatically change the heartbeat interval, whether that has been set explicitly or is using a previously calculated default. A warning is issued if you set the global value of `replica_net_timeout` to a value less than that of the current heartbeat interval. If `replica_net_timeout` is changed, you must also issue `CHANGE REPLICATION SOURCE TO` to adjust the heartbeat interval to an appropriate value so that the heartbeat signal occurs before the connection timeout. If you do not do this, the heartbeat signal has no effect, and if no data is received from the source, the replica can make repeated reconnection attempts, creating zombie dump threads.

* `SOURCE_HOST = 'host_name'`

  The host name or IP address of the replication source server. The replica uses this to connect to the source. The maximum length of the string value is 255 characters.

  If you specify `SOURCE_HOST` or `SOURCE_PORT`, the replica assumes that the source server is different from before (even if the option value is the same as its current value.) In this case, the old values for the source's binary log file name and position are considered no longer applicable, so if you do not specify `SOURCE_LOG_FILE` and `SOURCE_LOG_POS` in the statement, `SOURCE_LOG_FILE=''` and `SOURCE_LOG_POS=4` are silently appended to it.

  Setting `SOURCE_HOST=''` (that is, setting its value explicitly to an empty string) is *not* the same as not setting `SOURCE_HOST` at all. Trying to set `SOURCE_HOST` to an empty string fails with an error.

* `SOURCE_LOG_FILE = 'source_log_name'`, `SOURCE_LOG_POS = source_log_pos`

  The binary log file name, and the location in that file, at which the replication I/O (receiver) thread begins reading from the source's binary log the next time the thread starts. Specify these options if you are using binary log file position based replication.

  `SOURCE_LOG_FILE` must include the numeric suffix of a specific binary log file that is available on the source server, for example, `SOURCE_LOG_FILE='binlog.000145'`. The maximum length of the string value is 511 characters.

  `SOURCE_LOG_POS` is the numeric position for the replica to start reading in that file. `SOURCE_LOG_POS=4` represents the start of the events in a binary log file.

  If you specify either of `SOURCE_LOG_FILE` or `SOURCE_LOG_POS`, you cannot specify `SOURCE_AUTO_POSITION = 1`, which is for GTID-based replication.

  If neither of `SOURCE_LOG_FILE` or `SOURCE_LOG_POS` is specified, the replica uses the last coordinates of the *replication SQL thread* before `CHANGE REPLICATION SOURCE TO` was issued. This ensures that there is no discontinuity in replication, even if the replication SQL (applier) thread was late compared to the replication I/O (receiver) thread.

* `SOURCE_PASSWORD = 'password'`

  The password for the replication user account to use for connecting to the replication source server. The maximum length of the string value is 32 characters. If you specify `SOURCE_PASSWORD`, `SOURCE_USER` is also required.

  The password used for a replication user account in a `CHANGE REPLICATION SOURCE TO` statement is limited to 32 characters in length. Trying to use a password of more than 32 characters causes `CHANGE REPLICATION SOURCE TO` to fail.

  The password is masked in MySQL Server’s logs, Performance Schema tables, and `SHOW PROCESSLIST` statements.

* `SOURCE_PORT = port_num`

  The TCP/IP port number that the replica uses to connect to the replication source server.

  Note

  Replication cannot use Unix socket files. You must be able to connect to the replication source server using TCP/IP.

  If you specify `SOURCE_HOST` or `SOURCE_PORT`, the replica assumes that the source server is different from before (even if the option value is the same as its current value.) In this case, the old values for the source's binary log file name and position are considered no longer applicable, so if you do not specify `SOURCE_LOG_FILE` and `SOURCE_LOG_POS` in the statement, `SOURCE_LOG_FILE=''` and `SOURCE_LOG_POS=4` are silently appended to it.

* `SOURCE_PUBLIC_KEY_PATH = 'key_file_name'`

  Enables RSA key pair-based password exchange by providing the path name to a file containing a replica-side copy of the public key required by the source. The file must be in PEM format. The maximum length of the string value is 511 characters.

  This option applies to replicas that authenticate with the `sha256_password` or `caching_sha2_password` authentication plugin. (For `sha256_password`, `SOURCE_PUBLIC_KEY_PATH` can be used only if MySQL was built using OpenSSL.) If you are using a replication user account that authenticates with the `caching_sha2_password` plugin (the default), and you are not using a secure connection, you must specify either this option or the `GET_SOURCE_PUBLIC_KEY=1` option to provide the RSA public key to the replica.

* `SOURCE_RETRY_COUNT = count`

  Sets the maximum number of reconnection attempts that the replica makes after the connection to the source times out, as determined by the `replica_net_timeout` system variable. If the replica does need to reconnect, the first retry occurs immediately after the timeout. The default is 10 attempts.

  The interval between the attempts is specified by the `SOURCE_CONNECT_RETRY` option. If both the default settings are used, the replica waits 60 seconds between reconnection attempts (`SOURCE_CONNECT_RETRY=60`), and keeps attempting to reconnect at this rate for 10 minutes (`SOURCE_RETRY_COUNT=10`). A setting of 0 for `SOURCE_RETRY_COUNT` means that there is no limit on the number of reconnection attempts, so the replica keeps trying to reconnect indefinitely.

  The values for `SOURCE_CONNECT_RETRY` and `SOURCE_RETRY_COUNT` are recorded in the source metadata repository and shown in the `replication_connection_configuration` Performance Schema table. `SOURCE_RETRY_COUNT` supersedes the `--master-retry-count` server startup option.

* `SOURCE_SSL = {0|1}`

  Specify whether the replica encrypts the replication connection. The default is 1, meaning you can configure the encryption using the `SOURCE_SSL_xxx` and `SOURCE_TLS_xxx` options. If you set `SOURCE_SSL=0`, the replica does not encrypt the replication connection.

  With the `SOURCE_SSL=1` setting for a replication connection, no further setting of `SOURCE_SSL_xxx` options corresponds to setting `--ssl-mode=REQUIRED` for the client, as described in Command Options for Encrypted Connections. With `SOURCE_SSL=1`, the connection attempt only succeeds if an encrypted connection can be established. A replication connection does not fall back to an unencrypted connection, so there is no setting corresponding to the `--ssl-mode=PREFERRED` setting for replication. If `SOURCE_SSL=0` is set, this corresponds to `--ssl-mode=DISABLED`.

  Important

  To help prevent sophisticated man-in-the-middle attacks, it is important for the replica to verify the server’s identity. You can specify additional `SOURCE_SSL_xxx` options to correspond to the settings `--ssl-mode=VERIFY_CA` and `--ssl-mode=VERIFY_IDENTITY`, which are a better choice than the default setting to help prevent this type of attack. With these settings, the replica checks that the server’s certificate is valid, and checks that the host name the replica is using matches the identity in the server’s certificate. To implement one of these levels of verification, you must first ensure that the CA certificate for the server is reliably available to the replica, otherwise availability issues will result. For this reason, they are not the default setting.

* `SOURCE_SSL_xxx`, `SOURCE_TLS_xxx`

  Specify how the replica uses encryption and ciphers to secure the replication connection. These options can be changed even on replicas that are compiled without SSL support. They are saved to the source metadata repository, but are ignored if the replica does not have SSL support enabled. The maximum length of the value for the string-valued `SOURCE_SSL_xxx` and `SOURCE_TLS_xxx` options is 511 characters, with the exception of `SOURCE_TLS_CIPHERSUITES`, for which it is 4000 characters.

  The `SOURCE_SSL_xxx` and `SOURCE_TLS_xxx` options perform the same functions as the `--ssl-xxx` and `--tls-xxx` client options described in Command Options for Encrypted Connections. The correspondence between the two sets of options, and the use of the `SOURCE_SSL_xxx` and `SOURCE_TLS_xxx` options to set up a secure connection, is explained in Section 19.3.1, “Setting Up Replication to Use Encrypted Connections”.

* `SOURCE_USER = 'user_name'`

  The user name for the replication user account to use for connecting to the replication source server. The maximum length of the string value is 96 characters.

  For Group Replication, this account must exist on every member of the replication group. It is used for distributed recovery if the XCom communication stack is in use for the group, and also used for group communication connections if the MySQL communication stack is in use for the group. With the MySQL communication stack, the account must have the `GROUP_REPLICATION_STREAM` permission.

  It is possible to set an empty user name by specifying `SOURCE_USER=''`, but the replication channel cannot be started with an empty user name. It is valid to set an empty `SOURCE_USER` user name and use the channel afterwards if you always provide user credentials using the `START REPLICA` statement or `START GROUP_REPLICATION` statement that starts the replication channel. This approach means that the replication channel always needs operator intervention to restart, but the user credentials are not recorded in the replication metadata repositories.

  Important

  To connect to the source using a replication user account that authenticates with the `caching_sha2_password` plugin, you must either set up a secure connection as described in Section 19.3.1, “Setting Up Replication to Use Encrypted Connections”, or enable the unencrypted connection to support password exchange using an RSA key pair. The `caching_sha2_password` authentication plugin is the default for new users (see Section 8.4.1.1, “Caching SHA-2 Pluggable Authentication”). If the user account that you create or use for replication uses this authentication plugin, and you are not using a secure connection, you must enable RSA key pair-based password exchange for a successful connection. You can do this using either the `SOURCE_PUBLIC_KEY_PATH` option or the `GET_SOURCE_PUBLIC_KEY=1` option for this statement.

* `SOURCE_ZSTD_COMPRESSION_LEVEL = level`

  The compression level to use for connections to the replication source server that use the `zstd` compression algorithm. The permitted levels are from 1 to 22, with larger values indicating increasing levels of compression. The default level is 3.

  The compression level setting has no effect on connections that do not use `zstd` compression. For more information, see Section 6.2.8, “Connection Compression Control”.

##### Examples

`CHANGE REPLICATION SOURCE TO` is useful for setting up a replica when you have the snapshot of the source and have recorded the source's binary log coordinates corresponding to the time of the snapshot. After loading the snapshot into the replica to synchronize it with the source, you can run `CHANGE REPLICATION SOURCE TO SOURCE_LOG_FILE='log_name', SOURCE_LOG_POS=log_pos` on the replica to specify the coordinates at which the replica should begin reading the source's binary log. The following example changes the source server the replica uses and establishes the source's binary log coordinates from which the replica begins reading:

```
CHANGE REPLICATION SOURCE TO
  SOURCE_HOST='source2.example.com',
  SOURCE_USER='replication',
  SOURCE_PASSWORD='password',
  SOURCE_PORT=3306,
  SOURCE_LOG_FILE='source2-bin.001',
  SOURCE_LOG_POS=4,
  SOURCE_CONNECT_RETRY=10;
```

For the procedure to switch an existing replica to a new source during failover, see Section 19.4.8, “Switching Sources During Failover”.

When GTIDs are in use on the source and the replica, specify GTID auto-positioning instead of giving the binary log file position, as in the following example. For full instructions to configure and start GTID-based replication on new or stopped servers, online servers, or additional replicas, see Section 19.1.3, “Replication with Global Transaction Identifiers”.

```
CHANGE REPLICATION SOURCE TO
  SOURCE_HOST='source3.example.com',
  SOURCE_USER='replication',
  SOURCE_PASSWORD='password',
  SOURCE_PORT=3306,
  SOURCE_AUTO_POSITION = 1,
  FOR CHANNEL "source_3";
```

In this example, multi-source replication is in use, and the `CHANGE REPLICATION SOURCE TO` statement is applied to the replication channel `"source_3"` that connects the replica to the specified host. For guidance on setting up multi-source replication, see Section 19.1.5, “MySQL Multi-Source Replication”.

The next example shows how to make the replica apply transactions from relay log files that you want to repeat. To do this, the source need not be reachable. You can use `CHANGE REPLICATION SOURCE TO` to locate the relay log position where you want the replica to start reapplying transactions, and then start the SQL thread:

```
CHANGE REPLICATION SOURCE TO
  RELAY_LOG_FILE='replica-relay-bin.006',
  RELAY_LOG_POS=4025;
START REPLICA SQL_THREAD;
```

`CHANGE REPLICATION SOURCE TO` can also be used to skip over transactions in the binary log that are causing replication to stop. The appropriate method to do this depends on whether GTIDs are in use or not. For instructions to skip transactions using `CHANGE REPLICATION SOURCE TO` or another method, see Section 19.1.7.3, “Skipping Transactions”.
