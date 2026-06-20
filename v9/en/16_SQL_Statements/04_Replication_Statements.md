## 15.4 Replication Statements

Replication can be controlled through the SQL interface using the statements described in this section. Statements are split into a group which controls source servers, a group which controls replica servers, and a group which can be applied to any replication servers.


### 15.4.1 SQL Statements for Controlling Source Servers

This section discusses statements for managing replication source servers. Section 15.4.2, “SQL Statements for Controlling Replica Servers”, discusses statements for managing replica servers.

In addition to the statements described here, the following `SHOW` statements are used with source servers in replication. For information about these statements, see Section 15.7.7, “SHOW Statements”.

* `SHOW BINARY LOGS`
* `SHOW BINLOG EVENTS`
* `SHOW BINARY LOG STATUS`
* [`SHOW REPLICAS`](show-replicas.html "15.7.7.37 SHOW REPLICAS Statement")


#### 15.4.1.1 PURGE BINARY LOGS Statement

```
PURGE BINARY LOGS {
    TO 'log_name'
  | BEFORE datetime_expr
}
```

The binary log is a set of files that contain information about data modifications made by the MySQL server. The log consists of a set of binary log files, plus an index file (see Section 7.4.4, “The Binary Log”).

The `PURGE BINARY LOGS` statement deletes all the binary log files listed in the log index file prior to the specified log file name or date. Deleted log files also are removed from the list recorded in the index file, so that the given log file becomes the first in the list.

`PURGE BINARY LOGS` requires the `BINLOG_ADMIN` privilege. This statement has no effect if the server was not started with the `--log-bin` option to enable binary logging.

Examples:

```
PURGE BINARY LOGS TO 'mysql-bin.010';
PURGE BINARY LOGS BEFORE '2019-04-02 22:46:26';
```

The `BEFORE` variant's *`datetime_expr`* argument should evaluate to a `DATETIME` value (a value in `'YYYY-MM-DD hh:mm:ss'` format).

`PURGE BINARY LOGS` is safe to run while replicas are replicating. You need not stop them. If you have an active replica that currently is reading one of the log files you are trying to delete, this statement does not delete the log file that is in use or any log files later than that one, but it deletes any earlier log files. A warning message is issued in this situation. However, if a replica is not connected and you happen to purge one of the log files it has yet to read, the replica cannot replicate after it reconnects.

`PURGE BINARY LOGS` cannot be issued while a [`LOCK INSTANCE FOR BACKUP`](lock-instance-for-backup.html "15.3.5 LOCK INSTANCE FOR BACKUP and UNLOCK INSTANCE Statements") statement is in effect for the instance, because it contravenes the rules of the backup lock by removing files from the server.

To safely purge binary log files, follow this procedure:

1. On each replica, use [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.36 SHOW REPLICA STATUS Statement") to check which log file it is reading.

2. Obtain a listing of the binary log files on the source with `SHOW BINARY LOGS`.

3. Determine the earliest log file among all the replicas. This is the target file. If all the replicas are up to date, this is the last log file on the list.

4. Make a backup of all the log files you are about to delete. (This step is optional, but always advisable.)

5. Purge all log files up to but not including the target file.

`PURGE BINARY LOGS TO` and `PURGE BINARY LOGS BEFORE` both fail with an error when binary log files listed in the `.index` file had been removed from the system by some other means (such as using **rm** on Linux). (Bug #18199, Bug #18453) To handle such errors, edit the `.index` file (which is a simple text file) manually to ensure that it lists only the binary log files that are actually present, then run again the `PURGE BINARY LOGS` statement that failed.

Binary log files are automatically removed after the server's binary log expiration period. Removal of the files can take place at startup and when the binary log is flushed. The default binary log expiration period is 30 days. You can specify an alternative expiration period using the `binlog_expire_logs_seconds` system variable. If you are using replication, you should specify an expiration period that is no lower than the maximum amount of time your replicas might lag behind the source.


#### 15.4.1.2 RESET BINARY LOGS AND GTIDS Statement

```
RESET BINARY LOGS AND GTIDS [TO binary_log_file_index_number]
```

Warning

Use this statement with caution to ensure you do not lose any wanted binary log file data and GTID execution history.

`RESET BINARY LOGS AND GTIDS` requires the `RELOAD` privilege.

For a server where binary logging is enabled (`log_bin` is `ON`), `RESET BINARY LOGS AND GTIDS` deletes all existing binary log files and resets the binary log index file, resetting the server to its state before binary logging was started. A new empty binary log file is created so that binary logging can be restarted.

For a server where GTIDs are in use (`gtid_mode` is `ON`), issuing `RESET BINARY LOGS AND GTIDS` resets the GTID execution history. The value of the `gtid_purged` system variable is set to an empty string (`''`), the global value (but not the session value) of the `gtid_executed` system variable is set to an empty string, and the `mysql.gtid_executed` table is cleared (see mysql.gtid_executed Table). If the GTID-enabled server has binary logging enabled, `RESET BINARY LOGS AND GTIDS` also resets the binary log as described above. Note that `RESET BINARY LOGS AND GTIDS` is the method to reset the GTID execution history even if the GTID-enabled server is a replica where binary logging is disabled; [`RESET REPLICA`](reset-replica.html "15.4.2.3 RESET REPLICA Statement") has no effect on the GTID execution history. For more information on resetting the GTID execution history, see Resetting the GTID Execution History.

Issuing `RESET BINARY LOGS AND GTIDS` without the optional `TO` clause deletes all binary log files listed in the index file, resets the binary log index file to be empty, and creates a new binary log file starting at `1`. Use the optional `TO` clause to start the binary log file index from a number other than `1` after the reset.

Check that you are using a reasonable value for the index number. If you enter an incorrect value, you can correct this by issuing another `RESET BINARY LOGS AND GTIDS` statement with or without the `TO` clause. If you do not correct a value that is out of range, the server cannot be restarted.

The following example demonstrates `TO` clause usage:

```
RESET BINARY LOGS AND GTIDS TO 1234;

SHOW BINARY LOGS;
+-------------------+-----------+-----------+
| Log_name          | File_size | Encrypted |
+-------------------+-----------+-----------+
| source-bin.001234 |       154 | No        |
+-------------------+-----------+-----------+
```

Important

The effects of `RESET BINARY LOGS AND GTIDS` without the `TO` clause differ from those of `PURGE BINARY LOGS` in 2 key ways:

1. `RESET BINARY LOGS AND GTIDS` removes *all* binary log files that are listed in the index file, leaving only a single, empty binary log file with a numeric suffix of `.000001`, whereas the numbering is not reset by `PURGE BINARY LOGS`.

2. `RESET BINARY LOGS AND GTIDS` is *not* intended to be used while any replicas are running. The behavior of `RESET BINARY LOGS AND GTIDS` when used while replicas are running is undefined (and thus unsupported), whereas `PURGE BINARY LOGS` may be safely used while replicas are running.

See also Section 15.4.1.1, “PURGE BINARY LOGS Statement”.

`RESET BINARY LOGS AND GTIDS` without the `TO` clause can prove useful when you first set up a source and replica, so that you can verify the setup as follows:

1. Start the source and replica, and start replication (see Section 19.1.2, “Setting Up Binary Log File Position Based Replication”).

2. Execute a few test queries on the source.
3. Check that the queries were replicated to the replica.
4. When replication is running correctly, issue `STOP REPLICA` followed by `RESET REPLICA` (both on the replica), then verify that no unwanted data from the test queries exists on the replica. Following this, issue `RESET BINARY LOGS AND GTIDS` (also on the replica) to remove binary logs and and associated transaction IDs.

5. Remove the unwanted data from the source, then issue `RESET BINARY LOGS AND GTIDS` to purge any binary log entries and identifiers associated with it.

After verifying the setup, resetting the source and replica and ensuring that no unwanted data or binary log files generated by testing remain on the source or replica, you can start the replica and begin replicating.


#### 15.4.1.3 SET sql_log_bin Statement

```
SET sql_log_bin = {OFF|ON}
```

The `sql_log_bin` variable controls whether logging to the binary log is enabled for the current session (assuming that the binary log itself is enabled). The default value is `ON`. To disable or enable binary logging for the current session, set the session `sql_log_bin` variable to `OFF` or `ON`.

Set this variable to `OFF` for a session to temporarily disable binary logging while making changes to the source that you do not want replicated to the replica.

Setting the session value of this system variable is a restricted operation. The session user must have privileges sufficient to set restricted session variables. See Section 7.1.9.1, “System Variable Privileges”.

It is not possible to set the session value of `sql_log_bin` within a transaction or subquery.

*Setting this variable to `OFF` prevents new GTIDs from being assigned to transactions in the binary log*. If you are using GTIDs for replication, this means that even when binary logging is later enabled again, the GTIDs written into the log from this point do not account for any transactions that occurred in the meantime, so in effect those transactions are lost.

**mysqldump** adds a `SET @@SESSION.sql_log_bin=0` statement to a dump file from a server where GTIDs are in use, which disables binary logging while the dump file is being reloaded. The statement prevents new GTIDs from being generated and assigned to the transactions in the dump file as they are executed, so that the original GTIDs for the transactions are used.


### 15.4.2 SQL Statements for Controlling Replica Servers

This section discusses statements for managing replica servers. Section 15.4.1, “SQL Statements for Controlling Source Servers”, discusses statements for managing source servers.

In addition to the statements described here, [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.36 SHOW REPLICA STATUS Statement") and [`SHOW RELAYLOG EVENTS`](show-relaylog-events.html "15.7.7.35 SHOW RELAYLOG EVENTS Statement") are also used with replicas. For information about these statements, see Section 15.7.7.36, “SHOW REPLICA STATUS Statement”, and Section 15.7.7.35, “SHOW RELAYLOG EVENTS Statement”.


#### 15.4.2.1 CHANGE REPLICATION FILTER Statement

```
CHANGE REPLICATION FILTER filter[, filter]
	[, ...] [FOR CHANNEL channel]

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
    db_name.table_name[, db_name.table_name][, ...]
wild_tbl_list:
    'db_pattern.table_pattern'[, 'db_pattern.table_pattern'][, ...]

db_pair_list:
    (db_pair)[, (db_pair)][, ...]

db_pair:
    from_db, to_db
```

`CHANGE REPLICATION FILTER` sets one or more replication filtering rules on the replica in the same way as starting the replica **mysqld** with replication filtering options such as `--replicate-do-db` or `--replicate-wild-ignore-table`. Filters set using this statement differ from those set using the server options in two key respects:

1. The statement does not require restarting the server to take effect, only that the replication SQL thread be stopped using [`STOP REPLICA SQL_THREAD`](stop-replica.html "15.4.2.5 STOP REPLICA Statement") first (and restarted with [`START REPLICA SQL_THREAD`](start-replica.html "15.4.2.4 START REPLICA Statement") afterwards).

2. The effects of the statement are not persistent; any filters set using `CHANGE REPLICATION FILTER` are lost following a restart of the replica **mysqld**.

`CHANGE REPLICATION FILTER` requires the `REPLICATION_SLAVE_ADMIN` privilege (or the deprecated `SUPER` privilege).

Use the `FOR CHANNEL channel` clause to make a replication filter specific to a replication channel, for example on a multi-source replica. Filters applied without a specific `FOR CHANNEL` clause are considered global filters, meaning that they are applied to all replication channels.

Note

Global replication filters cannot be set on a MySQL server instance that is configured for Group Replication, because filtering transactions on some servers would make the group unable to reach agreement on a consistent state. Channel specific replication filters can be set on replication channels that are not directly involved with Group Replication, such as where a group member also acts as a replica to a source that is outside the group. They cannot be set on the `group_replication_applier` or `group_replication_recovery` channels.

The following list shows the `CHANGE REPLICATION FILTER` options and how they relate to `--replicate-*` server options:

* `REPLICATE_DO_DB`: Include updates based on database name. Equivalent to `--replicate-do-db`.

* `REPLICATE_IGNORE_DB`: Exclude updates based on database name. Equivalent to `--replicate-ignore-db`.

* `REPLICATE_DO_TABLE`: Include updates based on table name. Equivalent to `--replicate-do-table`.

* `REPLICATE_IGNORE_TABLE`: Exclude updates based on table name. Equivalent to `--replicate-ignore-table`.

* `REPLICATE_WILD_DO_TABLE`: Include updates based on wildcard pattern matching table name. Equivalent to `--replicate-wild-do-table`.

* `REPLICATE_WILD_IGNORE_TABLE`: Exclude updates based on wildcard pattern matching table name. Equivalent to `--replicate-wild-ignore-table`.

* `REPLICATE_REWRITE_DB`: Perform updates on replica after substituting new name on replica for specified database on source. Equivalent to `--replicate-rewrite-db`.

The precise effects of `REPLICATE_DO_DB` and `REPLICATE_IGNORE_DB` filters are dependent on whether statement-based or row-based replication is in effect. See Section 19.2.5, “How Servers Evaluate Replication Filtering Rules”, for more information.

Multiple replication filtering rules can be created in a single `CHANGE REPLICATION FILTER` statement by separating the rules with commas, as shown here:

```
CHANGE REPLICATION FILTER
    REPLICATE_DO_DB = (d1), REPLICATE_IGNORE_DB = (d2);
```

Issuing the statement just shown is equivalent to starting the replica **mysqld** with the options `--replicate-do-db=d1` `--replicate-ignore-db=d2`.

On a multi-source replica, which uses multiple replication channels to process transaction from different sources, use the `FOR CHANNEL channel` clause to set a replication filter on a replication channel:

```
CHANGE REPLICATION FILTER REPLICATE_DO_DB = (d1) FOR CHANNEL channel_1;
```

This enables you to create a channel specific replication filter to filter out selected data from a source. When a `FOR CHANNEL` clause is provided, the replication filter statement acts on that replication channel, removing any existing replication filter which has the same filter type as the specified replication filters, and replacing them with the specified filter. Filter types not explicitly listed in the statement are not modified. If issued against a replication channel which is not configured, the statement fails with an ER_SLAVE_CONFIGURATION error. If issued against Group Replication channels, the statement fails with an ER_SLAVE_CHANNEL_OPERATION_NOT_ALLOWED error.

On a replica with multiple replication channels configured, issuing `CHANGE REPLICATION FILTER` with no `FOR CHANNEL` clause configures the replication filter for every configured replication channel, and for the global replication filters. For every filter type, if the filter type is listed in the statement, then any existing filter rules of that type are replaced by the filter rules specified in the most recently issued statement, otherwise the old value of the filter type is retained. For more information see Section 19.2.5.4, “Replication Channel Based Filters”.

If the same filtering rule is specified multiple times, only the *last* such rule is actually used. For example, the two statements shown here have exactly the same effect, because the first `REPLICATE_DO_DB` rule in the first statement is ignored:

```
CHANGE REPLICATION FILTER
    REPLICATE_DO_DB = (db1, db2), REPLICATE_DO_DB = (db3, db4);

CHANGE REPLICATION FILTER
    REPLICATE_DO_DB = (db3, db4);
```

Caution

This behavior differs from that of the `--replicate-*` filter options where specifying the same option multiple times causes the creation of multiple filter rules.

Names of tables and database not containing any special characters need not be quoted. Values used with `REPLICATION_WILD_TABLE` and `REPLICATION_WILD_IGNORE_TABLE` are string expressions, possibly containing (special) wildcard characters, and so must be quoted. This is shown in the following example statements:

```
CHANGE REPLICATION FILTER
    REPLICATE_WILD_DO_TABLE = ('db1.old%');

CHANGE REPLICATION FILTER
    REPLICATE_WILD_IGNORE_TABLE = ('db1.new%', 'db2.new%');
```

Values used with `REPLICATE_REWRITE_DB` represent *pairs* of database names; each such value must be enclosed in parentheses. The following statement rewrites statements occurring on database `db1` on the source to database `db2` on the replica:

```
CHANGE REPLICATION FILTER REPLICATE_REWRITE_DB = ((db1, db2));
```

The statement just shown contains two sets of parentheses, one enclosing the pair of database names, and the other enclosing the entire list. This is perhaps more easily seen in the following example, which creates two `rewrite-db` rules, one rewriting database `dbA` to `dbB`, and one rewriting database `dbC` to `dbD`:

```
CHANGE REPLICATION FILTER
  REPLICATE_REWRITE_DB = ((dbA, dbB), (dbC, dbD));
```

The `CHANGE REPLICATION FILTER` statement replaces replication filtering rules only for the filter types and replication channels affected by the statement, and leaves other rules and channels unchanged. If you want to unset all filters of a given type, set the filter's value to an explicitly empty list, as shown in this example, which removes all existing `REPLICATE_DO_DB` and `REPLICATE_IGNORE_DB` rules:

```
CHANGE REPLICATION FILTER
    REPLICATE_DO_DB = (), REPLICATE_IGNORE_DB = ();
```

Setting a filter to empty in this way removes all existing rules, does not create any new ones, and does not restore any rules set at mysqld startup using `--replicate-*` options on the command line or in the configuration file.

The [`RESET REPLICA ALL`](reset-replica.html "15.4.2.3 RESET REPLICA Statement") statement removes channel specific replication filters that were set on channels deleted by the statement. When the deleted channel or channels are recreated, any global replication filters specified for the replica are copied to them, and no channel specific replication filters are applied.

For more information, see Section 19.2.5, “How Servers Evaluate Replication Filtering Rules”.


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

Options that you do not specify on a [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement") statement retain their value, except as indicated in the following discussion. In most cases, there is therefore no need to specify options that do not change.

Values used for `SOURCE_HOST` and other `CHANGE REPLICATION SOURCE TO` options are checked for linefeed (`\n` or `0x0A`) characters. The presence of such characters in these values causes the statement to fail with an error.

The optional `FOR CHANNEL channel` clause lets you name which replication channel the statement applies to. Providing a `FOR CHANNEL channel` clause applies the `CHANGE REPLICATION SOURCE TO` statement to a specific replication channel, and is used to add a new channel or modify an existing channel. For example, to add a new channel called `channel2`:

```
CHANGE REPLICATION SOURCE TO SOURCE_HOST=host1, SOURCE_PORT=3002 FOR CHANNEL 'channel2';
```

If no clause is named and no extra channels exist, a `CHANGE REPLICATION SOURCE TO` statement applies to the default channel, whose name is the empty string (""). When you have set up multiple replication channels, every [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement") statement must name a channel using the `FOR CHANNEL channel` clause. See Section 19.2.2, “Replication Channels” for more information.

For some of the options of the [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement") statement, you must issue a `STOP REPLICA` statement prior to issuing a [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement") statement (and a [`START REPLICA`](start-replica.html "15.4.2.4 START REPLICA Statement") statement afterwards). Sometimes, you only need to stop the replication SQL (applier) thread or the replication I/O (receiver) thread, not both:

* When the applier thread is stopped, you can execute `CHANGE REPLICATION SOURCE TO` using any combination that is otherwise allowed of `RELAY_LOG_FILE`, `RELAY_LOG_POS`, and `SOURCE_DELAY` options, even if the replication receiver thread is running. No other options may be used with this statement when the receiver thread is running.

* When the receiver thread is stopped, you can execute `CHANGE REPLICATION SOURCE TO` using any of the options for this statement (in any allowed combination) *except* `RELAY_LOG_FILE`, `RELAY_LOG_POS`, `SOURCE_DELAY`, or `SOURCE_AUTO_POSITION = 1` even when the applier thread is running.

* Both the receiver thread and the applier thread must be stopped before issuing a [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement") statement that employs `SOURCE_AUTO_POSITION = 1`, `GTID_ONLY = 1`, or `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`.

You can check the current state of the replication applier thread and replication receiver thread using [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.36 SHOW REPLICA STATUS Statement"). Note that the Group Replication applier channel (`group_replication_applier`) has no receiver thread, only an applier thread.

`CHANGE REPLICATION SOURCE TO` statements have a number of side-effects and interactions that you should be aware of beforehand:

* `CHANGE REPLICATION SOURCE TO` causes an implicit commit of an ongoing transaction. See Section 15.3.3, “Statements That Cause an Implicit Commit”.

* `CHANGE REPLICATION SOURCE TO` causes the previous values for `SOURCE_HOST`, `SOURCE_PORT`, `SOURCE_LOG_FILE`, and `SOURCE_LOG_POS` to be written to the error log, along with other information about the replica's state prior to execution.

* If you are using statement-based replication and temporary tables, it is possible for a [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement") statement following a [`STOP REPLICA`](stop-replica.html "15.4.2.5 STOP REPLICA Statement") statement to leave behind temporary tables on the replica. A warning (`ER_WARN_OPEN_TEMP_TABLES_MUST_BE_ZERO`) is issued whenever this occurs. You can avoid this in such cases by making sure that the value of the `Replica_open_temp_tables` system status variable is equal to 0 prior to executing such a [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement") statement.

* Stopping the replica can cause gaps in the sequence of transactions that have been executed from the relay log, regardless of whether the replica was stopped intentionally or otherwise. In MySQL 9.5, these can be resolved using GTID auto-positioning.

The following options are available for `CHANGE REPLICATION SOURCE TO` statements:

* [`ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS = {OFF | LOCAL | uuid}`](change-replication-source-to.html#crs-opt-assign_gtids_to_anonymous_transactions)

  Makes the replication channel assign a GTID to replicated transactions that do not have one, enabling replication from a source that does not use GTID-based replication, to a replica that does. For a multi-source replica, you can have a mix of channels that use `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`, and channels that do not. The default is `OFF`, meaning that the feature is not used.

  `LOCAL` assigns a GTID including the replica's own UUID (the `server_uuid` setting). `uuid` assigns a GTID including the specified UUID, such as the `server_uuid` setting for the replication source server. Using a nonlocal UUID lets you differentiate between transactions that originated on the replica and transactions that originated on the source, and for a multi-source replica, between transactions that originated on different sources. The UUID you choose only has significance for the replica's own use. If any of the transactions sent by the source do have a GTID already, that GTID is retained.

  Channels specific to Group Replication cannot use `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`, but an asynchronous replication channel for another source on a server instance that is a Group Replication group member can do so. In that case, do not specify the Group Replication group name as the UUID for creating the GTIDs.

  To set `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` to `LOCAL` or `uuid`, the replica must have `gtid_mode=ON` set, and this cannot be changed afterwards. This option is for use with a source that has binary log file position based replication, so `SOURCE_AUTO_POSITION=1` cannot be set for the channel. Both the replication SQL thread and the replication I/O (receiver) thread must be stopped before setting this option.

  Important

  A replica set up with `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` on any channel cannot be promoted to replace the replication source server in the event that a failover is required, and a backup taken from the replica cannot be used to restore the replication source server. The same restriction applies to replacing or restoring other replicas that use `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` on any channel.

  For further restrictions and information, see Section 19.1.3.6, “Replication From a Source Without GTIDs to a Replica With GTIDs”.

* [`GET_SOURCE_PUBLIC_KEY = {0|1}`](change-replication-source-to.html#crs-opt-get_source_public_key)

  Enables RSA key pair-based password exchange by requesting the public key from the source. The option is disabled by default.

  This option applies to replicas that authenticate with the `caching_sha2_password` authentication plugin. For connections by accounts that authenticate using this plugin, the source does not send the public key unless requested, so it must be requested or specified in the client. If `SOURCE_PUBLIC_KEY_PATH` is given and specifies a valid public key file, it takes precedence over `GET_SOURCE_PUBLIC_KEY`. If you are using a replication user account that authenticates with the `caching_sha2_password` plugin (the default), and you are not using a secure connection, you must specify either this option or the `SOURCE_PUBLIC_KEY_PATH` option to provide the RSA public key to the replica.

* `GTID_ONLY = {0|1}`

  Stops the replication channel persisting file names and file positions in the replication metadata repositories. `GTID_ONLY` is disabled by default for asynchronous replication channels, but is enabled by default for Group Replication channels, for which it cannot be disabled.

  For replication channels with this setting, in-memory file positions are still tracked, and file positions can still be observed for debugging purposes in error messages and through interfaces such as [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.36 SHOW REPLICA STATUS Statement") statements (where they are shown as being invalid if they are out of date). However, the writes and reads required to persist and check the file positions are avoided in situations where GTID-based replication does not actually require them, including the transaction queuing and application process.

  This option can be used only if both the replication SQL (applier) thread and replication I/O (receiver) thread are stopped. To set `GTID_ONLY = 1` for a replication channel, GTIDs must be in use on the server (`gtid_mode = ON`), and row-based binary logging must be in use on the source (statement-based replication is not supported). The options `REQUIRE_ROW_FORMAT = 1` and `SOURCE_AUTO_POSITION = 1` must be set for the replication channel.

  When `GTID_ONLY = 1` is set, the replica uses `replica_parallel_workers=1` if that system variable is set to zero for the server, so it is always technically a multi-threaded applier. This is because a multi-threaded applier uses saved positions rather than the replication metadata repositories to locate the start of a transaction that it needs to reapply.

  If you disable `GTID_ONLY` after setting it, the existing relay logs are deleted and the existing known binary log file positions are persisted, even if they are stale. The file positions for the binary log and relay log in the replication metadata repositories might be invalid, and a warning is returned if this is the case. Provided that `SOURCE_AUTO_POSITION` is still enabled, GTID auto-positioning is used to provide the correct positioning.

  If you also disable `SOURCE_AUTO_POSITION`, the file positions for the binary log and relay log in the replication metadata repositories are used for positioning if they are valid. If they are marked as invalid, you must provide a valid binary log file name and position (`SOURCE_LOG_FILE` and `SOURCE_LOG_POS`). If you also provide a relay log file name and position (`RELAY_LOG_FILE` and `RELAY_LOG_POS`), the relay logs are preserved and the applier position is set to the stated position. GTID auto-skip ensures that any transactions already applied are skipped even if the eventual applier position is not correct.

* [`IGNORE_SERVER_IDS = (server_id_list)`](change-replication-source-to.html#crs-opt-ignore_server_ids)

  Makes the replica ignore events originating from the specified servers. The option takes a comma-separated list of 0 or more server IDs. Log rotation and deletion events from the servers are not ignored, and are recorded in the relay log.

  In circular replication, the originating server normally acts as the terminator of its own events, so that they are not applied more than once. Thus, this option is useful in circular replication when one of the servers in the circle is removed. Suppose that you have a circular replication setup with 4 servers, having server IDs 1, 2, 3, and 4, and server 3 fails. When bridging the gap by starting replication from server 2 to server 4, you can include `IGNORE_SERVER_IDS = (3)` in the `CHANGE REPLICATION SOURCE TO` statement that you issue on server 4 to tell it to use server 2 as its source instead of server 3. Doing so causes it to ignore and not to propagate any statements that originated with the server that is no longer in use.

  If `IGNORE_SERVER_IDS` contains the server's own ID and the server was started with the `--replicate-same-server-id` option enabled, an error results.

  The source metadata repository and the output of [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.36 SHOW REPLICA STATUS Statement") provide the list of servers that are currently ignored. For more information, see Section 19.2.4.2, “Replication Metadata Repositories”, and Section 15.7.7.36, “SHOW REPLICA STATUS Statement”.

  If a [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement") statement is issued without `IGNORE_SERVER_IDS`, any existing list is preserved. To clear the list of ignored servers, it is necessary to use the option with an empty list, like this:

  ```
  CHANGE REPLICATION SOURCE TO IGNORE_SERVER_IDS = ();
  ```

  [`RESET REPLICA ALL`](reset-replica.html "15.4.2.3 RESET REPLICA Statement") also clears `IGNORE_SERVER_IDS`.

  When global transaction identifiers (GTIDs) are used for replication, transactions that have already been applied are automatically ignored. Because of this, `IGNORE_SERVER_IDS` is not compatible with `gtid_mode=ON`. If `gtid_mode` is `ON`, `CHANGE REPLICATION SOURCE TO` with a non-empty `IGNORE_SERVER_IDS` list is rejected with an error. Likewise, if any existing replication channel was created with a list of server IDs to be ignored, `SET gtid_mode=ON` is also rejected. Before starting GTID-based replication, check for and clear any ignored server ID lists on the servers involved; you can do this by checking the output from `SHOW REPLICA STATUS`. In such cases, you can clear the list by issuing `CHANGE REPLICATION SOURCE TO` with an empty list of server IDs as shown previously.

* [`NETWORK_NAMESPACE = 'namespace'`](change-replication-source-to.html#crs-opt-network_namespace)

  The network namespace to use for TCP/IP connections to the replication source server or, if the MySQL communication stack is in use, for Group Replication’s group communication connections. The maximum length of the string value is 64 characters. If this option is omitted, connections from the replica use the default (global) namespace. On platforms that do not implement network namespace support, failure occurs when the replica attempts to connect to the source. For information about network namespaces, see Section 7.1.14, “Network Namespace Support”.

* [`PRIVILEGE_CHECKS_USER = {NULL | 'account'}`](change-replication-source-to.html#crs-opt-privilege_checks_user)

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

* [`RELAY_LOG_FILE = 'relay_log_file'`](change-replication-source-to.html#crs-opt-relay_log_file) , [`RELAY_LOG_POS = 'relay_log_pos'`](change-replication-source-to.html#crs-opt-relay_log_file)

  The relay log file name, and the location in that file, at which the replication SQL thread begins reading from the replica's relay log the next time the thread starts. `RELAY_LOG_FILE` can use either an absolute or relative path, and uses the same base name as `SOURCE_LOG_FILE`. The maximum length of the string value is 511 characters.

  A `CHANGE REPLICATION SOURCE TO` statement using `RELAY_LOG_FILE`, `RELAY_LOG_POS`, or both options can be executed on a running replica when the replication SQL (applier) thread is stopped. Relay logs are preserved if at least one of the replication applier thread and the replication I/O (receiver) thread is running. If both threads are stopped, all relay log files are deleted unless at least one of `RELAY_LOG_FILE` or `RELAY_LOG_POS` is specified. For the Group Replication applier channel (`group_replication_applier`), which only has an applier thread and no receiver thread, this is the case if the applier thread is stopped, but with that channel you cannot use the `RELAY_LOG_FILE` and `RELAY_LOG_POS` options.

* `REQUIRE_ROW_FORMAT = {0|1}`

  Permits only row-based replication events to be processed by the replication channel. This option prevents the replication applier from taking actions such as creating temporary tables and executing `LOAD DATA INFILE` requests, which increases the security of the channel. The `REQUIRE_ROW_FORMAT` option is disabled by default for asynchronous replication channels, but it is enabled by default for Group Replication channels, and it cannot be disabled for them. For more information, see Section 19.3.3, “Replication Privilege Checks”.

* [`REQUIRE_TABLE_PRIMARY_KEY_CHECK = {STREAM | ON | OFF | GENERATE}`](change-replication-source-to.html#crs-opt-require_table_primary_key_check)

  This option lets a replica set its own policy for primary key checks, as follows:

  + `ON`: The replica sets [`sql_require_primary_key = ON`](server-system-variables.html#sysvar_sql_require_primary_key); any replicated [`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement") or [`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement") statement must result in a table that contains a primary key.

  + `OFF`: The replica sets `sql_require_primary_key = OFF`; no replicated `CREATE TABLE` or `ALTER TABLE` statement is checked for the presence of a primary key.

  + `STREAM`: The replica uses whatever value of `sql_require_primary_key` is replicated from the source for each transaction. This is the default value, and the default behavior.

  + `GENERATE`: Causes the replica to generate an invisible primary key for any `InnoDB` table that, as replicated, lacks a primary key. See Section 15.1.24.11, “Generated Invisible Primary Keys”, for more information.

    `GENERATE` is not compatible with Group Replication; you can use `ON`, `OFF`, or `STREAM`.

  A divergence based on the presence of a generated invisible primary key solely on a source or replica table is supported by MySQL Replication as long as the source supports GIPKs and the replica uses MySQL version 8.0.32 or later. If you use GIPKs on a replica with the source using an earlier version of MySQL, such divergences in schema, other than the extra GIPK on the replica, are not supported and may result in replication errors.

  For multisource replication, setting `REQUIRE_TABLE_PRIMARY_KEY_CHECK` to `ON` or `OFF` lets the replica normalize behavior across replication channels for different sources, and to keep a consistent setting for `sql_require_primary_key`. Using `ON` safeguards against the accidental loss of primary keys when multiple sources update the same set of tables. Using `OFF` lets sources that can manipulate primary keys to work alongside sources that cannot.

  In the case of multiple replicas, when `REQUIRE_TABLE_PRIMARY_KEY_CHECK` is set to `GENERATE`, the generated invisible primary key added by a given replica is independent of any such key added on any other replica. This means that, if generated invisible primary keys are in use, the values in the generated primary key columns on different replicas are not guaranteed to be the same. This may be an issue when failing over to such a replica.

  When `PRIVILEGE_CHECKS_USER` is `NULL` (the default), the user account does not need administration level privileges to set restricted session variables. Setting this option to a value other than `NULL` means that, when `REQUIRE_TABLE_PRIMARY_KEY_CHECK` is `ON`, `OFF`, or `GENERATE`, the user account does not require session administration level privileges to set restricted session variables such as `sql_require_primary_key`, avoiding the need to grant the account such privileges. For more information, see Section 19.3.3, “Replication Privilege Checks”.

* [`SOURCE_AUTO_POSITION = {0|1}`](change-replication-source-to.html#crs-opt-source_auto_position)

  Makes the replica attempt to connect to the source using the auto-positioning feature of GTID-based replication, rather than a binary log file based position. This option is used to start a replica using GTID-based replication. The default is 0, meaning that GTID auto-positioning and GTID-based replication are not used. This option can be used with `CHANGE REPLICATION SOURCE TO` only if both the replication SQL (applier) thread and replication I/O (receiver) thread are stopped.

  Both the replica and the source must have GTIDs enabled (`GTID_MODE=ON`, `ON_PERMISSIVE,` or `OFF_PERMISSIVE` on the replica, and `GTID_MODE=ON` on the source). `SOURCE_LOG_FILE`, `SOURCE_LOG_POS`, `RELAY_LOG_FILE`, and `RELAY_LOG_POS` cannot be specified together with `SOURCE_AUTO_POSITION = 1`. If multi-source replication is enabled on the replica, you need to set the `SOURCE_AUTO_POSITION = 1` option for each applicable replication channel.

  With `SOURCE_AUTO_POSITION = 1` set, in the initial connection handshake, the replica sends a GTID set containing the transactions that it has already received, committed, or both. The source responds by sending all transactions recorded in its binary log whose GTID is not included in the GTID set sent by the replica. This exchange ensures that the source only sends the transactions with a GTID that the replica has not already recorded or committed. If the replica receives transactions from more than one source, as in the case of a diamond topology, the auto-skip function ensures that the transactions are not applied twice. For details of how the GTID set sent by the replica is computed, see Section 19.1.3.3, “GTID Auto-Positioning”.

  If any of the transactions that should be sent by the source have been purged from the source's binary log, or added to the set of GTIDs in the `gtid_purged` system variable by another method, the source sends the error `ER_SOURCE_HAS_PURGED_REQUIRED_GTIDS` to the replica, and replication does not start. The GTIDs of the missing purged transactions are identified and listed in the source's error log in the warning message `ER_FOUND_MISSING_GTIDS`. Also, if during the exchange of transactions it is found that the replica has recorded or committed transactions with the source's UUID in the GTID, but the source itself has not committed them, the source sends the error `ER_REPLICA_HAS_MORE_GTIDS_THAN_SOURCE` to the replica and replication does not start. For information on how to handle these situations, see Section 19.1.3.3, “GTID Auto-Positioning”.

  You can see whether replication is running with GTID auto-positioning enabled by checking the Performance Schema `replication_connection_status` table or the output of [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.36 SHOW REPLICA STATUS Statement"). Disabling the `SOURCE_AUTO_POSITION` option again makes the replica revert to file-based replication.

* [`SOURCE_BIND = 'interface_name'`](change-replication-source-to.html#crs-opt-source_bind)

  Determines which of the replica's network interfaces is chosen for connecting to the source, for use on replicas that have multiple network interfaces. Specify the IP address of the network interface. The maximum length of the string value is 255 characters.

  The IP address configured with this option, if any, can be seen in the `Source_Bind` column of the output from [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.36 SHOW REPLICA STATUS Statement"). In the source metadata repository table `mysql.slave_master_info`, the value can be seen as the `Source_bind` column. The ability to bind a replica to a specific network interface is also supported by NDB Cluster.

* [`SOURCE_COMPRESSION_ALGORITHMS = 'algorithm[,algorithm][,algorithm]'`](change-replication-source-to.html#crs-opt-source_compression_algorithms)

  Specifies one, two, or three of the permitted compression algorithms for connections to the replication source server, separated by commas. The maximum length of the string value is 99 characters. The default value is `uncompressed`.

  The available algorithms are `zlib`, `zstd`, and `uncompressed`, the same as for the `protocol_compression_algorithms` system variable. The algorithms can be specified in any order, but it is not an order of preference - the algorithm negotiation process attempts to use `zlib`, then `zstd`, then `uncompressed`, if they are specified.

  The value of `SOURCE_COMPRESSION_ALGORITHMS` applies only if the `replica_compressed_protocol` system variable is disabled. If `replica_compressed_protocol` is enabled, it takes precedence over `SOURCE_COMPRESSION_ALGORITHMS` and connections to the source use `zlib` compression if both source and replica support that algorithm. For more information, see Section 6.2.8, “Connection Compression Control”.

  Binary log transaction compression is activated by the `binlog_transaction_compression` system variable, and can also be used to save bandwidth. If you do this in combination with connection compression, connection compression has less opportunity to act on the data, but can still compress headers and those events and transaction payloads that are uncompressed. For more information on binary log transaction compression, see Section 7.4.4.5, “Binary Log Transaction Compression”.

* [`SOURCE_CONNECT_RETRY = interval`](change-replication-source-to.html#crs-opt-source_connect_retry)

  Specifies the interval in seconds between the reconnection attempts that the replica makes after the connection to the source times out. The default interval is 60.

  The number of attempts is limited by the `SOURCE_RETRY_COUNT` option. If both the default settings are used, the replica waits 60 seconds between reconnection attempts (`SOURCE_CONNECT_RETRY=60`), and keeps attempting to reconnect at this rate for 10 minutes (`SOURCE_RETRY_COUNT=10`). These values are recorded in the source metadata repository and shown in the `replication_connection_configuration` Performance Schema table.

* [`SOURCE_CONNECTION_AUTO_FAILOVER = {0|1}`](change-replication-source-to.html#crs-opt-source_connection_auto_failover)

  Activates the asynchronous connection failover mechanism for a replication channel if one or more alternative replication source servers are available (so when there are multiple MySQL servers or groups of servers that share the replicated data). The default is 0, meaning that the mechanism is not activated. For full information and instructions to set up this feature, see Section 19.4.9.2, “Asynchronous Connection Failover for Replicas”.

  The asynchronous connection failover mechanism takes over after the reconnection attempts controlled by `SOURCE_CONNECT_RETRY` and `SOURCE_RETRY_COUNT` are exhausted. It reconnects the replica to an alternative source chosen from a specified source list, which you can manage using the functions `asynchronous_connection_failover_add_source()` and `asynchronous_connection_failover_delete_source()`. To add and remove managed groups of servers, use `asynchronous_connection_failover_add_managed()` and `asynchronous_connection_failover_delete_managed()` instead. For more information, see Section 19.4.9, “Switching Sources and Replicas with Asynchronous Connection Failover”.

  Important

  1. You can only set `SOURCE_CONNECTION_AUTO_FAILOVER = 1` when GTID auto-positioning is in use (`SOURCE_AUTO_POSITION = 1`).

  2. When you set `SOURCE_CONNECTION_AUTO_FAILOVER = 1`, set `SOURCE_RETRY_COUNT` and `SOURCE_CONNECT_RETRY` to minimal numbers that just allow a few retry attempts with the same source, in case the connection failure is caused by a transient network outage. Otherwise the asynchronous connection failover mechanism cannot be activated promptly. Suitable values are `SOURCE_RETRY_COUNT=3` and `SOURCE_CONNECT_RETRY=10`, which make the replica retry the connection 3 times with 10-second intervals between.

  3. When you set `SOURCE_CONNECTION_AUTO_FAILOVER = 1`, the replication metadata repositories must contain the credentials for a replication user account that can be used to connect to all the servers on the source list for the replication channel. The account must also have `SELECT` permissions on the Performance Schema tables. These credentials can be set using the [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement") statement with the `SOURCE_USER` and `SOURCE_PASSWORD` options. For more information, see Section 19.4.9, “Switching Sources and Replicas with Asynchronous Connection Failover”.

  4. When you set `SOURCE_CONNECTION_AUTO_FAILOVER = 1`, asynchronous connection failover for replicas is automatically activated if this replication channel is on a Group Replication primary in a group in single-primary mode. With this function active, if the primary that is replicating goes offline or into an error state, the new primary starts replication on the same channel when it is elected. If you want to use the function, this replication channel must also be set up on all the secondary servers in the replication group, and on any new joining members. (If the servers are provisioned using MySQL’s clone functionality, this all happens automatically.) If you do not want to use the function, disable it by using the `group_replication_disable_member_action()` function to disable the Group Replication member action `mysql_start_failover_channels_if_primary`, which is enabled by default. For more information, see Section 19.4.9.2, “Asynchronous Connection Failover for Replicas”.

* [`SOURCE_DELAY = interval`](change-replication-source-to.html#crs-opt-source_delay)

  Specifies how many seconds behind the source the replica must lag. An event received from the source is not executed until at least *`interval`* seconds later than its execution on the source. *`interval`* must be a nonnegative integer in the range from 0 to 231−1. The default is 0. For more information, see Section 19.4.11, “Delayed Replication”.

  A `CHANGE REPLICATION SOURCE TO` statement using the `SOURCE_DELAY` option can be executed on a running replica when the replication SQL thread is stopped.

* [`SOURCE_HEARTBEAT_PERIOD = interval`](change-replication-source-to.html#crs-opt-source_heartbeat_period)

  Controls the heartbeat interval, which stops the connection timeout occurring in the absence of data if the connection is still good. A heartbeat signal is sent to the replica after that number of seconds, and the waiting period is reset whenever the source's binary log is updated with an event. Heartbeats are therefore sent by the source only if there are no unsent events in the binary log file for a period longer than this.

  The heartbeat interval *`interval`* is a decimal value having the range 0 to 4294967 seconds and a resolution in milliseconds; the smallest nonzero value is 0.001. Setting *`interval`* to 0 disables heartbeats altogether. The heartbeat interval defaults to half the value of the `replica_net_timeout` system variable. It is recorded in the source metadata repository and shown in the `replication_connection_configuration` Performance Schema table.

  The `replica_net_timeout` system variable specifies the number of seconds that the replica waits for either more data or a heartbeat signal from the source, before the replica considers the connection broken, aborts the read, and tries to reconnect. The default value is 60 seconds (one minute). Note that a change to the value or default setting of `replica_net_timeout` does not automatically change the heartbeat interval, whether that has been set explicitly or is using a previously calculated default. A warning is issued if you set the global value of `replica_net_timeout` to a value less than that of the current heartbeat interval. If `replica_net_timeout` is changed, you must also issue [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement") to adjust the heartbeat interval to an appropriate value so that the heartbeat signal occurs before the connection timeout. If you do not do this, the heartbeat signal has no effect, and if no data is received from the source, the replica can make repeated reconnection attempts, creating zombie dump threads.

* [`SOURCE_HOST = 'host_name'`](change-replication-source-to.html#crs-opt-source_host)

  The host name or IP address of the replication source server. The replica uses this to connect to the source. The maximum length of the string value is 255 characters.

  If you specify `SOURCE_HOST` or `SOURCE_PORT`, the replica assumes that the source server is different from before (even if the option value is the same as its current value.) In this case, the old values for the source's binary log file name and position are considered no longer applicable, so if you do not specify `SOURCE_LOG_FILE` and `SOURCE_LOG_POS` in the statement, `SOURCE_LOG_FILE=''` and `SOURCE_LOG_POS=4` are silently appended to it.

  Setting `SOURCE_HOST=''` (that is, setting its value explicitly to an empty string) is *not* the same as not setting `SOURCE_HOST` at all. Trying to set `SOURCE_HOST` to an empty string fails with an error.

* [`SOURCE_LOG_FILE = 'source_log_name'`](change-replication-source-to.html#crs-opt-source_log_file), [`SOURCE_LOG_POS = source_log_pos`](change-replication-source-to.html#crs-opt-source_log_file)

  The binary log file name, and the location in that file, at which the replication I/O (receiver) thread begins reading from the source's binary log the next time the thread starts. Specify these options if you are using binary log file position based replication.

  `SOURCE_LOG_FILE` must include the numeric suffix of a specific binary log file that is available on the source server, for example, `SOURCE_LOG_FILE='binlog.000145'`. The maximum length of the string value is 511 characters.

  `SOURCE_LOG_POS` is the numeric position for the replica to start reading in that file. `SOURCE_LOG_POS=4` represents the start of the events in a binary log file.

  If you specify either of `SOURCE_LOG_FILE` or `SOURCE_LOG_POS`, you cannot specify `SOURCE_AUTO_POSITION = 1`, which is for GTID-based replication.

  If neither of `SOURCE_LOG_FILE` or `SOURCE_LOG_POS` is specified, the replica uses the last coordinates of the *replication SQL thread* before `CHANGE REPLICATION SOURCE TO` was issued. This ensures that there is no discontinuity in replication, even if the replication SQL (applier) thread was late compared to the replication I/O (receiver) thread.

* [`SOURCE_PASSWORD = 'password'`](change-replication-source-to.html#crs-opt-source_password)

  The password for the replication user account to use for connecting to the replication source server. The maximum length of the string value is 32 characters. If you specify `SOURCE_PASSWORD`, `SOURCE_USER` is also required.

  The password used for a replication user account in a `CHANGE REPLICATION SOURCE TO` statement is limited to 32 characters in length. Trying to use a password of more than 32 characters causes `CHANGE REPLICATION SOURCE TO` to fail.

  The password is masked in MySQL Server’s logs, Performance Schema tables, and [`SHOW PROCESSLIST`](show-processlist.html "15.7.7.32 SHOW PROCESSLIST Statement") statements.

* [`SOURCE_PORT = port_num`](change-replication-source-to.html#crs-opt-source_port)

  The TCP/IP port number that the replica uses to connect to the replication source server.

  Note

  Replication cannot use Unix socket files. You must be able to connect to the replication source server using TCP/IP.

  If you specify `SOURCE_HOST` or `SOURCE_PORT`, the replica assumes that the source server is different from before (even if the option value is the same as its current value.) In this case, the old values for the source's binary log file name and position are considered no longer applicable, so if you do not specify `SOURCE_LOG_FILE` and `SOURCE_LOG_POS` in the statement, `SOURCE_LOG_FILE=''` and `SOURCE_LOG_POS=4` are silently appended to it.

* [`SOURCE_PUBLIC_KEY_PATH = 'key_file_name'`](change-replication-source-to.html#crs-opt-source_public_key_path)

  Enables RSA key pair-based password exchange by providing the path name to a file containing a replica-side copy of the public key required by the source. The file must be in PEM format. The maximum length of the string value is 511 characters.

  This option applies to replicas that authenticate with the `sha256_password` or `caching_sha2_password` authentication plugin. (For `sha256_password`, `SOURCE_PUBLIC_KEY_PATH` can be used only if MySQL was built using OpenSSL.) If you are using a replication user account that authenticates with the `caching_sha2_password` plugin (the default), and you are not using a secure connection, you must specify either this option or the `GET_SOURCE_PUBLIC_KEY=1` option to provide the RSA public key to the replica.

* [`SOURCE_RETRY_COUNT = count`](change-replication-source-to.html#crs-opt-source_retry_count)

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

* [`SOURCE_USER = 'user_name'`](change-replication-source-to.html#crs-opt-source_user)

  The user name for the replication user account to use for connecting to the replication source server. The maximum length of the string value is 96 characters.

  For Group Replication, this account must exist on every member of the replication group. It is used for distributed recovery if the XCom communication stack is in use for the group, and also used for group communication connections if the MySQL communication stack is in use for the group. With the MySQL communication stack, the account must have the `GROUP_REPLICATION_STREAM` permission.

  It is possible to set an empty user name by specifying `SOURCE_USER=''`, but the replication channel cannot be started with an empty user name. It is valid to set an empty `SOURCE_USER` user name and use the channel afterwards if you always provide user credentials using the [`START REPLICA`](start-replica.html "15.4.2.4 START REPLICA Statement") statement or [`START GROUP_REPLICATION`](start-group-replication.html "15.4.3.1 START GROUP_REPLICATION Statement") statement that starts the replication channel. This approach means that the replication channel always needs operator intervention to restart, but the user credentials are not recorded in the replication metadata repositories.

  Important

  To connect to the source using a replication user account that authenticates with the `caching_sha2_password` plugin, you must either set up a secure connection as described in Section 19.3.1, “Setting Up Replication to Use Encrypted Connections”, or enable the unencrypted connection to support password exchange using an RSA key pair. The `caching_sha2_password` authentication plugin is the default for new users (see Section 8.4.1.1, “Caching SHA-2 Pluggable Authentication”). If the user account that you create or use for replication uses this authentication plugin, and you are not using a secure connection, you must enable RSA key pair-based password exchange for a successful connection. You can do this using either the `SOURCE_PUBLIC_KEY_PATH` option or the `GET_SOURCE_PUBLIC_KEY=1` option for this statement.

* [`SOURCE_ZSTD_COMPRESSION_LEVEL = level`](change-replication-source-to.html#crs-opt-source_zstd_compression_level)

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


#### 15.4.2.3 RESET REPLICA Statement

```
RESET REPLICA [ALL] [channel_option]

channel_option:
    FOR CHANNEL channel
```

`RESET REPLICA` makes the replica forget its position in the source's binary log.

This statement is meant to be used for a clean start; it clears the replication metadata repositories, deletes all the relay log files, and starts a new relay log file. It also resets to 0 the replication delay specified with the `SOURCE_DELAY` option of the `CHANGE REPLICATION SOURCE TO` statement.

Note

All relay log files are deleted, even if they have not been completely executed by the replication SQL thread. (This is a condition likely to exist on a replica if you have issued a [`STOP REPLICA`](stop-replica.html "15.4.2.5 STOP REPLICA Statement") statement or if the replica is highly loaded.)

For a server where GTIDs are in use (`gtid_mode` is `ON`), issuing `RESET REPLICA` has no effect on the GTID execution history. The statement does not change the values of `gtid_executed` or `gtid_purged`, or the `mysql.gtid_executed` table. If you need to reset the GTID execution history, use [`RESET BINARY LOGS AND GTIDS`](reset-binary-logs-and-gtids.html "15.4.1.2 RESET BINARY LOGS AND GTIDS Statement"), even if the GTID-enabled server is a replica where binary logging is disabled.

`RESET REPLICA` requires the `RELOAD` privilege.

To use `RESET REPLICA`, the replication SQL thread and replication I/O (receiver) thread must be stopped, so on a running replica use [`STOP REPLICA`](stop-replica.html "15.4.2.5 STOP REPLICA Statement") before issuing `RESET REPLICA`. To use `RESET REPLICA` on a Group Replication group member, the member status must be `OFFLINE`, meaning that the plugin is loaded but the member does not currently belong to any group. A group member can be taken offline by using a [`STOP GROUP REPLICATION`](stop-group-replication.html "15.4.3.2 STOP GROUP_REPLICATION Statement") statement.

The optional `FOR CHANNEL channel` clause enables you to name which replication channel the statement applies to. Providing a `FOR CHANNEL channel` clause applies the `RESET REPLICA` statement to a specific replication channel. Combining a `FOR CHANNEL channel` clause with the `ALL` option deletes the specified channel. If no channel is named and no extra channels exist, the statement applies to the default channel. Issuing a `RESET REPLICA ALL` statement without a `FOR CHANNEL channel` clause when multiple replication channels exist deletes *all* replication channels and recreates only the default channel. See Section 19.2.2, “Replication Channels” for more information.

`RESET REPLICA` does not change any replication connection parameters, which include the source's host name and port, the replication user account and its password, the `PRIVILEGE_CHECKS_USER` account, the `REQUIRE_ROW_FORMAT` option, the `REQUIRE_TABLE_PRIMARY_KEY_CHECK` option,and the `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` option. If you want to change any of the replication connection parameters, you can do this using a [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement") statement after the server starts. If you want to remove all of the replication connection parameters, use `RESET REPLICA ALL`. `RESET REPLICA ALL` also clears the `IGNORE_SERVER_IDS` list set by `CHANGE REPLICATION SOURCE TO`. When you have used `RESET REPLICA ALL`, if you want to use the instance as a replica again, you need to issue a `CHANGE REPLICATION SOURCE TO` statement after the server start to specify new connection parameters.

You can set the `GTID_ONLY` option on the `CHANGE REPLICATION SOURCE TO` statement to stop a replication channel from persisting file names and file positions in the replication metadata repositories. When you issue [`RESET REPLICA`](reset-replica.html "15.4.2.3 RESET REPLICA Statement"), the replication metadata repositories are synchronized. `RESET REPLICA ALL` deletes rather than updates the repositories, so they are synchronized implicitly.

In the event of an unexpected server exit or deliberate restart after issuing `RESET REPLICA` but before issuing `START REPLICA`, replication connection parameters are preserved in the crash-safe `InnoDB` tables `mysql.slave_master_info` and `mysql.slave_relay_log_info` as part of the `RESET REPLICA` operation. They are also retained in memory. In the event of an unexpected server exit or deliberate restart after issuing `RESET REPLICA` but before issuing [`START REPLICA`](start-replica.html "15.4.2.4 START REPLICA Statement"), the replication connection parameters are retrieved from the tables and reapplied to the channel. This applies for both the connection and applier metadata repositories.

`RESET REPLICA` does not change any replication filter settings (such as `--replicate-ignore-table`) for channels affected by the statement. However, `RESET REPLICA ALL` removes the replication filters that were set on the channels deleted by the statement. When the deleted channel or channels are recreated, any global replication filters specified for the replica are copied to them, and no channel specific replication filters are applied. For more information see Section 19.2.5.4, “Replication Channel Based Filters”.

`RESET REPLICA` causes an implicit commit of an ongoing transaction. See Section 15.3.3, “Statements That Cause an Implicit Commit”.

If the replication SQL thread was in the middle of replicating temporary tables when it was stopped, and `RESET REPLICA` is issued, these replicated temporary tables are deleted on the replica.

Note

When used on an NDB Cluster replica SQL node, `RESET REPLICA` clears the `mysql.ndb_apply_status` table. You should keep in mind when using this statement that `ndb_apply_status` uses the `NDB` storage engine and so is shared by all SQL nodes attached to the cluster.

You can override this behavior by issuing `SET` `GLOBAL @@``ndb_clear_apply_status=OFF` prior to executing `RESET REPLICA`, which keeps the replica from purging the `ndb_apply_status` table in such cases.


#### 15.4.2.4 START REPLICA Statement

```
START REPLICA [thread_types] [until_option] [connection_options] [channel_option]

thread_types:
    [thread_type [, thread_type] ... ]

thread_type:
    IO_THREAD | SQL_THREAD

until_option:
    UNTIL {   {SQL_BEFORE_GTIDS | SQL_AFTER_GTIDS} = gtid_set
          |   SOURCE_LOG_FILE = 'log_name', SOURCE_LOG_POS = log_pos
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

`START REPLICA` starts the replication threads, either together or separately.

`START REPLICA` requires the `REPLICATION_SLAVE_ADMIN` privilege (or the deprecated `SUPER` privilege). `START REPLICA` causes an implicit commit of an ongoing transaction. See Section 15.3.3, “Statements That Cause an Implicit Commit”.

For the thread type options, you can specify `IO_THREAD`, `SQL_THREAD`, both of these, or neither of them. Only the threads that are started are affected by the statement.

* `START REPLICA` with no thread type options starts all of the replication threads, and so does `START REPLICA` with both of the thread type options.

* `IO_THREAD` starts the replication receiver thread, which reads events from the source server and stores them in the relay log.

* `SQL_THREAD` starts the replication applier thread, which reads events from the relay log and executes them. The replica applies transactions using a coordinator thread and multiple applier threads, and `SQL_THREAD` starts all of these.

Important

`START REPLICA` sends an acknowledgment to the user after all the replication threads have started. However, the replication receiver thread might not yet have connected to the source successfully, or an applier thread might stop when applying an event right after starting. `START REPLICA` does not continue to monitor the threads after they are started, so it does not warn you if they subsequently stop or cannot connect. You must check the replica's error log for error messages generated by the replication threads, or check that they are running satisfactorily with [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.36 SHOW REPLICA STATUS Statement"). A successful `START REPLICA` statement causes [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.36 SHOW REPLICA STATUS Statement") to show `Replica_SQL_Running=Yes`, but it might or might not show `Replica_IO_Running=Yes`, because `Replica_IO_Running=Yes` is only shown if the receiver thread is both running and connected. For more information, see Section 19.1.7.1, “Checking Replication Status”.

The optional `FOR CHANNEL channel` clause enables you to name which replication channel the statement applies to. Providing a `FOR CHANNEL channel` clause applies the `START REPLICA` statement to a specific replication channel. If no clause is named and no extra channels exist, the statement applies to the default channel. If a `START REPLICA` statement does not have a channel defined when using multiple channels, this statement starts the specified threads for all channels. See Section 19.2.2, “Replication Channels” for more information.

The replication channels for Group Replication (`group_replication_applier` and `group_replication_recovery`) are managed automatically by the server instance. `START REPLICA` cannot be used at all with the `group_replication_recovery` channel, and should only be used with the `group_replication_applier` channel when Group Replication is not running. The `group_replication_applier` channel only has an applier thread and has no receiver thread, so it can be started if required by using the `SQL_THREAD` option without the `IO_THREAD` option.

`START REPLICA` supports pluggable user-password authentication (see Section 8.2.17, “Pluggable Authentication”) with the `USER`, `PASSWORD`, `DEFAULT_AUTH` and `PLUGIN_DIR` options, as described in the following list. When you use these options, you must start the receiver thread (`IO_THREAD` option) or all the replication threads; you cannot start the replication applier thread (`SQL_THREAD` option) alone.

`USER` :   The user name for the account. You must set this if `PASSWORD` is used. The option cannot be set to an empty or null string.

`PASSWORD` :   The password for the named user account.

`DEFAULT_AUTH` :   The name of the authentication plugin. The default is MySQL native authentication.

`PLUGIN_DIR` :   The location of the authentication plugin.

Important

The password that you set using `START REPLICA` is masked when it is written to MySQL Server’s logs, Performance Schema tables, and `SHOW PROCESSLIST` statements. However, it is sent in plain text over the connection to the replica server instance. To protect the password in transit, use SSL/TLS encryption, an SSH tunnel, or another method of protecting the connection from unauthorized viewing, for the connection between the replica server instance and the client that you use to issue `START REPLICA`.

The `UNTIL` clause makes the replica start replication, then process transactions up to the point that you specify in the `UNTIL` clause, then stop again. The `UNTIL` clause can be used to make a replica proceed until just before the point where you want to skip a transaction that is unwanted, and then skip the transaction as described in Section 19.1.7.3, “Skipping Transactions”. To identify a transaction, you can use **mysqlbinlog** with the source's binary log or the replica's relay log, or use a `SHOW BINLOG EVENTS` statement.

You can also use the `UNTIL` clause for debugging replication by processing transactions one at a time or in sections. If you are using the `UNTIL` clause to do this, start the replica with `--skip-replica-start` to prevent the SQL thread from running when the replica server starts. Remove the option or system variable setting after the procedure is complete, so that it is not forgotten in the event of an unexpected server restart.

The `SHOW REPLICA STATUS` statement includes output fields that display the current values of the `UNTIL` condition. The `UNTIL` condition lasts for as long as the affected threads are still running, and is removed when they stop.

The `UNTIL` clause operates on the replication applier thread (`SQL_THREAD` option). You can use the `SQL_THREAD` option or let the replica default to starting both threads. If you use the `IO_THREAD` option alone, the `UNTIL` clause is ignored because the applier thread is not started.

The point that you specify in the `UNTIL` clause can be any one (and only one) of the following options:

`SOURCE_LOG_FILE` and `SOURCE_LOG_POS` :   These options make the replication applier process transactions up to a position in its relay log, identified by the file name and file position of the corresponding point in the binary log on the source server. The applier thread finds the nearest transaction boundary at or after the specified position, finishes applying the transaction, and stops there. For compressed transaction payloads, specify the end position of the compressed `Transaction_payload_event`.

    These options can still be used when the `GTID_ONLY` option was set on the [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement") statement to stop the replication channel from persisting file names and file positions in the replication metadata repositories. The file names and file positions are tracked in memory.

`RELAY_LOG_FILE` and `RELAY_LOG_POS` :   These options make the replication applier process transactions up to a position in the replica’s relay log, identified by the relay log file name and a position in that file. The applier thread finds the nearest transaction boundary at or after the specified position, finishes applying the transaction, and stops there. For compressed transaction payloads, specify the end position of the compressed `Transaction_payload_event`.

    These options can still be used when the `GTID_ONLY` option was set on the [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement") statement to stop the replication channel from persisting file names and file positions in the replication metadata repositories. The file names and file positions are tracked in memory.

`SQL_BEFORE_GTIDS` :   This option makes the replication applier start processing transactions and stop when it encounters any transaction that is in the specified GTID set. The encountered transaction from the GTID set is not applied, and nor are any of the other transactions in the GTID set. The option takes a GTID set containing one or more global transaction identifiers as an argument (see GTID Sets). Transactions in a GTID set do not necessarily appear in the replication stream in the order of their GTIDs, so the transaction before which the applier stops is not necessarily the earliest.

`SQL_AFTER_GTIDS` :   This option makes the replication applier start processing transactions and stop when it has processed all of the transactions in a specified GTID set. The option takes a GTID set containing one or more global transaction identifiers as an argument (see GTID Sets).

    With `SQL_AFTER_GTIDS`, the replication threads stop after they have processed all transactions in the GTID set. Transactions are processed in the order received, so it is possible that these include transactions which are not part of the GTID set, but which are received (and processed) before all transactions in the set have been committed. For example, executing `START REPLICA UNTIL SQL_AFTER_GTIDS = 3E11FA47-71CA-11E1-9E33-C80AA9429562:11-56` causes the replica to obtain (and process) all transactions from the source until all of the transactions having the sequence numbers 11 through 56 have been processed, and then to stop without processing any additional transactions after that point has been reached.

`SQL_AFTER_MTS_GAPS` :   This option makes the replica process transactions up to the point where there are no more gaps in the sequence of transactions executed from the relay log. When using a multithreaded replica, there is a chance of gaps occurring in the following situations:

    * The coordinator thread is stopped.
    * An error occurs in the applier threads.
    * **mysqld** shuts down unexpectedly.

    When a replication channel has gaps, the replica’s database is in a state that might never have existed on the source. The replica tracks the gaps internally and disallows [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement") statements that would remove the gap information if they executed.

    All replicas are multithreaded by default. When `replica_preserve_commit_order=ON` on the replica (the default), gaps should not occur except in the specific situations listed in the description for this variable. If `replica_preserve_commit_order` is `OFF`, the commit order of transactions is not preserved, so the chance of gaps occurring is much larger.


#### 15.4.2.5 STOP REPLICA Statement

```
STOP REPLICA [thread_types] [channel_option]

thread_types:
    [thread_type [, thread_type] ... ]

thread_type: IO_THREAD | SQL_THREAD

channel_option:
    FOR CHANNEL channel
```

Stops the replication threads.

`STOP REPLICA` requires the `REPLICATION_SLAVE_ADMIN` privilege (or the deprecated `SUPER` privilege). Recommended best practice is to execute `STOP REPLICA` on the replica before stopping the replica server (see Section 7.1.19, “The Server Shutdown Process”, for more information).

Like `START REPLICA`, this statement may be used with the `IO_THREAD` and `SQL_THREAD` options to name the replication thread or threads to be stopped. Note that the Group Replication applier channel (`group_replication_applier`) has no replication I/O (receiver) thread, only a replication SQL (applier) thread. Using the `SQL_THREAD` option therefore stops this channel completely.

`STOP REPLICA` causes an implicit commit of an ongoing transaction. See Section 15.3.3, “Statements That Cause an Implicit Commit”.

`gtid_next` must be set to `AUTOMATIC` before issuing this statement.

You can control how long `STOP REPLICA` waits before timing out by setting the system variable `rpl_stop_replica_timeout`. This can be used to avoid deadlocks between `STOP REPLICA` and other SQL statements using different client connections to the replica. When the timeout value is reached, the issuing client returns an error message and stops waiting, but the `STOP REPLICA` instruction remains in effect. Once the replication threads are no longer busy, the `STOP REPLICA` statement is executed and the replica stops.

Some `CHANGE REPLICATION SOURCE TO` statements are allowed while the replica is running, depending on the states of the replication threads. However, using `STOP REPLICA` prior to executing a `CHANGE REPLICATION SOURCE TO` statement in such cases is still supported. See Section 15.4.2.2, “CHANGE REPLICATION SOURCE TO Statement”, and Section 19.4.8, “Switching Sources During Failover”, for more information.

The optional `FOR CHANNEL channel` clause enables you to name which replication channel the statement applies to. Providing a `FOR CHANNEL channel` clause applies the `STOP REPLICA` statement to a specific replication channel. If no channel is named and no extra channels exist, the statement applies to the default channel. If a `STOP REPLICA` statement does not name a channel when using multiple channels, this statement stops the specified threads for all channels. See Section 19.2.2, “Replication Channels” for more information.

The replication channels for Group Replication (`group_replication_applier` and `group_replication_recovery`) are managed automatically by the server instance. `STOP REPLICA` cannot be used at all with the `group_replication_recovery` channel, and should only be used with the `group_replication_applier` channel when Group Replication is not running. The `group_replication_applier` channel only has an applier thread and has no receiver thread, so it can be stopped if required by using the `SQL_THREAD` option without the `IO_THREAD` option.

Any gaps in the sequence of transactions executed from the relay log are closed as part of stopping the worker threads. If the replica is stopped unexpectedly (for example due to an error in a worker thread, or another thread issuing `KILL`) while a `STOP REPLICA` statement is executing, the sequence of executed transactions from the relay log may become inconsistent. See Section 19.5.1.35, “Replication and Transaction Inconsistencies”, for more information.

When the source is using the row-based binary logging format, you should execute `STOP REPLICA` or `STOP REPLICA SQL_THREAD` on the replica prior to shutting down the replica server if you are replicating any tables that use a nontransactional storage engine. If the current replication event group has modified one or more nontransactional tables, `STOP REPLICA` waits for up to 60 seconds for the event group to complete, unless you issue a [`KILL QUERY`](kill.html "15.7.8.4 KILL Statement") or [`KILL CONNECTION`](kill.html "15.7.8.4 KILL Statement") statement for the replication SQL thread. If the event group remains incomplete after the timeout, an error message is logged.

When the source is using the statement-based binary logging format, changing the source while it has open temporary tables is potentially unsafe. This is one of the reasons why statement-based replication of temporary tables is not recommended. You can find out whether there are any temporary tables on the replica by checking the value of `Replica_open_temp_tables`. When using statement-based replication, this value should be 0 before executing [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement"). If there are any temporary tables open on the replica, issuing a [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement") statement after issuing a `STOP REPLICA` causes an `ER_WARN_OPEN_TEMP_TABLES_MUST_BE_ZERO` warning.


### 15.4.3 SQL Statements for Controlling Group Replication

This section provides information about the statements used for controlling group replication.


#### 15.4.3.1 START GROUP_REPLICATION Statement

```
  START GROUP_REPLICATION
          [USER='user_name']
          [, PASSWORD='user_pass']
          [, DEFAULT_AUTH='plugin_name']
```

Starts group replication. This statement requires the `GROUP_REPLICATION_ADMIN` privilege (or the deprecated `SUPER` privilege). If `super_read_only=ON` is set and the member should join as a primary, `super_read_only` is set to `OFF` once Group Replication successfully starts.

A server that participates in a group in single-primary mode should use `skip_replica_start=ON`. Otherwise, the server is not allowed to join a group as a secondary.

You can specify user credentials for distributed recovery in the `START GROUP_REPLICATION` statement using the `USER`, `PASSWORD`, and `DEFAULT_AUTH` options, as follows:

* `USER`: The replication user for distributed recovery. For instructions to set up this account, see Section 20.2.1.3, “User Credentials For Distributed Recovery”. You cannot specify an empty or null string, or omit the `USER` option if `PASSWORD` is specified.

* `PASSWORD`: The password for the replication user account. The password cannot be encrypted, but it is masked in the query log.

* `DEFAULT_AUTH`: The name of the authentication plugin used for the replication user account. If you do not specify this option, the `caching_sha2_password` plugin is assumed. This option acts as a hint to the server, and the donor for distributed recovery overrides it if a different plugin is associated with the user account on that server. The authentication plugin used by default when you create user accounts in MySQL 9.5 is the caching SHA-2 authentication plugin (`caching_sha2_password`). See Section 8.2.17, “Pluggable Authentication” for more information on authentication plugins.

These credentials are used for distributed recovery on the `group_replication_recovery` channel. When you specify user credentials on `START GROUP_REPLICATION`, the credentials are saved in memory only, and are removed by a `STOP GROUP_REPLICATION` statement or server shutdown. You must issue a `START GROUP_REPLICATION` statement to provide the credentials again. This method is therefore not compatible with starting Group Replication automatically on server start, as specified by the `group_replication_start_on_boot` system variable.

User credentials specified on `START GROUP_REPLICATION` take precedence over any user credentials set for the `group_replication_recovery` channel using a `CHANGE REPLICATION SOURCE TO`. Note that user credentials set using these statements are stored in the replication metadata repositories, and are used when `START GROUP_REPLICATION` is specified without user credentials, including automatic starts if the `group_replication_start_on_boot` system variable is set to `ON`. To gain the security benefits of specifying user credentials on `START GROUP_REPLICATION`, ensure that `group_replication_start_on_boot` is set to `OFF` (the default is `ON`), and clear any user credentials previously set for the `group_replication_recovery` channel, following the instructions in Section 20.6.3, “Securing Distributed Recovery Connections”.

While a member is rejoining a replication group, its status can be displayed as `OFFLINE` or `ERROR` before the group completes the compatibility checks and accepts it as a member. When the member is catching up with the group's transactions, its status is `RECOVERING`.


#### 15.4.3.2 STOP GROUP_REPLICATION Statement

```
STOP GROUP_REPLICATION
```

Stops Group Replication. This statement requires the `GROUP_REPLICATION_ADMIN` privilege (or the deprecated `SUPER` privilege). As soon as you issue [`STOP GROUP_REPLICATION`](stop-group-replication.html "15.4.3.2 STOP GROUP_REPLICATION Statement") the member is set to `super_read_only=ON`, which ensures that no writes can be made to the member while Group Replication stops. Any other asynchronous replication channels running on the member are also stopped. Any user credentials that you specified in the [`START GROUP_REPLICATION`](start-group-replication.html "15.4.3.1 START GROUP_REPLICATION Statement") statement when starting Group Replication on this member are removed from memory, and must be supplied when you start Group Replication again.

Warning

Use this statement with extreme caution because it removes the server instance from the group, meaning it is no longer protected by Group Replication's consistency guarantee mechanisms. To be completely safe, ensure that your applications can no longer connect to the instance before issuing this statement to avoid any chance of stale reads.

The `STOP GROUP_REPLICATION` statement stops asynchronous replication channels on the group member, but it does not implicitly commit transactions that are in progress on them like [`STOP REPLICA`](stop-replica.html "15.4.2.5 STOP REPLICA Statement") does. This is because on a Group Replication group member, an additional transaction committed during the shutdown operation would leave the member inconsistent with the group and cause an issue with rejoining. To avoid failed commits for transactions that are in progress while stopping Group Replication, the [`STOP GROUP_REPLICATION`](stop-group-replication.html "15.4.3.2 STOP GROUP_REPLICATION Statement") statement cannot be issued while a GTID is assigned as the value of the `gtid_next` system variable.

The `group_replication_components_stop_timeout` system variable specifies the time for which Group Replication waits for each of its modules to complete ongoing processes after this statement is issued. The timeout is used to resolve situations in which Group Replication components cannot be stopped normally, which can happen if the member is expelled from the group while it is in an error state, or while a process such as MySQL Enterprise Backup is holding a global lock on tables on the member. In such situations, the member cannot stop the applier thread or complete the distributed recovery process to rejoin. `STOP GROUP_REPLICATION` does not complete until either the situation is resolved (for example, by the lock being released), or the component timeout expires and the modules are shut down regardless of their status. The default value is 300 seconds; this means that Group Replication components are stopped after 5 minutes if the situation is not resolved before that time, allowing the member to be restarted and rejoin.
