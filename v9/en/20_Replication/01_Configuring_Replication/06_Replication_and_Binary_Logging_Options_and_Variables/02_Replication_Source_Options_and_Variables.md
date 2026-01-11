#### 19.1.6.2 Replication Source Options and Variables

This section describes the server options and system variables that you can use on replication source servers. You can specify the options either on the command line or in an option file. You can specify system variable values using `SET`.

On the source and each replica, you must set the `server_id` system variable to establish a unique replication ID. For each server, you should pick a unique positive integer in the range from 1 to 232 − 1, and each ID must be different from every other ID in use by any other source or replica in the replication topology. Example: `server-id=3`.

For options used on the source for controlling binary logging, see Section 19.1.6.4, “Binary Logging Options and Variables”.

##### Startup Options for Replication Source Servers

The following list describes startup options for controlling replication source servers. Replication-related system variables are discussed later in this section.

* `--show-replica-auth-info`

  <table frame="box" rules="all" summary="Properties for show-replica-auth-info"><tbody><tr><th>Command-Line Format</th> <td><code>--show-replica-auth-info[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Use `--show-replica-auth-info`, which displays replication user names and passwords in the output of `SHOW REPLICAS` on the source for replicas started with the `--report-user` and `--report-password` options.

* `--show-slave-auth-info`

  <table frame="box" rules="all" summary="Properties for show-slave-auth-info"><tbody><tr><th>Command-Line Format</th> <td><code>--show-slave-auth-info[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Deprecated alias for `--show-replica-auth-info`.

##### System Variables Used on Replication Source Servers

The following system variables are used for or by replication source servers:

* `auto_increment_increment`

  <table frame="box" rules="all" summary="Properties for auto_increment_increment"><tbody><tr><th>Command-Line Format</th> <td><code>--auto-increment-increment=#</code></td> </tr><tr><th>System Variable</th> <td><code>auto_increment_increment</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>

  `auto_increment_increment` and `auto_increment_offset` are intended for use with circular (source-to-source) replication, and can be used to control the operation of `AUTO_INCREMENT` columns. Both variables have global and session values, and each can assume an integer value between 1 and 65,535 inclusive. Setting the value of either of these two variables to 0 causes its value to be set to 1 instead. Attempting to set the value of either of these two variables to an integer greater than 65,535 or less than 0 causes its value to be set to 65,535 instead. Attempting to set the value of `auto_increment_increment` or `auto_increment_offset` to a non-integer value produces an error, and the actual value of the variable remains unchanged.

  Note

  `auto_increment_increment` is also supported for use with `NDB` tables.

  When Group Replication is started on a server, the value of `auto_increment_increment` is changed to the value of `group_replication_auto_increment_increment`, which defaults to 7, and the value of `auto_increment_offset` is changed to the server ID. The changes are reverted when Group Replication is stopped. These changes are only made and reverted if `auto_increment_increment` and `auto_increment_offset` each have their default value of 1. If their values have already been modified from the default, Group Replication does not alter them. These system variables are also not modified when Group Replication is in single-primary mode, where only one server writes.

  `auto_increment_increment` and `auto_increment_offset` affect `AUTO_INCREMENT` column behavior as follows:

  + `auto_increment_increment` controls the interval between successive column values. For example:

    ```
    mysql> SHOW VARIABLES LIKE 'auto_inc%';
    +--------------------------+-------+
    | Variable_name            | Value |
    +--------------------------+-------+
    | auto_increment_increment | 1     |
    | auto_increment_offset    | 1     |
    +--------------------------+-------+
    2 rows in set (0.00 sec)

    mysql> CREATE TABLE autoinc1
        -> (col INT NOT NULL AUTO_INCREMENT PRIMARY KEY);
      Query OK, 0 rows affected (0.04 sec)

    mysql> SET @@auto_increment_increment=10;
    Query OK, 0 rows affected (0.00 sec)

    mysql> SHOW VARIABLES LIKE 'auto_inc%';
    +--------------------------+-------+
    | Variable_name            | Value |
    +--------------------------+-------+
    | auto_increment_increment | 10    |
    | auto_increment_offset    | 1     |
    +--------------------------+-------+
    2 rows in set (0.01 sec)

    mysql> INSERT INTO autoinc1 VALUES (NULL), (NULL), (NULL), (NULL);
    Query OK, 4 rows affected (0.00 sec)
    Records: 4  Duplicates: 0  Warnings: 0

    mysql> SELECT col FROM autoinc1;
    +-----+
    | col |
    +-----+
    |   1 |
    |  11 |
    |  21 |
    |  31 |
    +-----+
    4 rows in set (0.00 sec)
    ```

  + `auto_increment_offset` determines the starting point for the `AUTO_INCREMENT` column value. Consider the following, assuming that these statements are executed during the same session as the example given in the description for `auto_increment_increment`:

    ```
    mysql> SET @@auto_increment_offset=5;
    Query OK, 0 rows affected (0.00 sec)

    mysql> SHOW VARIABLES LIKE 'auto_inc%';
    +--------------------------+-------+
    | Variable_name            | Value |
    +--------------------------+-------+
    | auto_increment_increment | 10    |
    | auto_increment_offset    | 5     |
    +--------------------------+-------+
    2 rows in set (0.00 sec)

    mysql> CREATE TABLE autoinc2
        -> (col INT NOT NULL AUTO_INCREMENT PRIMARY KEY);
    Query OK, 0 rows affected (0.06 sec)

    mysql> INSERT INTO autoinc2 VALUES (NULL), (NULL), (NULL), (NULL);
    Query OK, 4 rows affected (0.00 sec)
    Records: 4  Duplicates: 0  Warnings: 0

    mysql> SELECT col FROM autoinc2;
    +-----+
    | col |
    +-----+
    |   5 |
    |  15 |
    |  25 |
    |  35 |
    +-----+
    4 rows in set (0.02 sec)
    ```

    When the value of `auto_increment_offset` is greater than that of `auto_increment_increment`, the value of `auto_increment_offset` is ignored.

  If either of these variables is changed, and then new rows inserted into a table containing an `AUTO_INCREMENT` column, the results may seem counter-intuitive because the series of `AUTO_INCREMENT` values is calculated without regard to any values already present in the column, and the next value inserted is the least value in the series that is greater than the maximum existing value in the `AUTO_INCREMENT` column. The series is calculated like this:

  `auto_increment_offset` + *`N`* × `auto_increment_increment`

  where *`N`* is a positive integer value in the series [1, 2, 3, ...]. For example:

  ```
  mysql> SHOW VARIABLES LIKE 'auto_inc%';
  +--------------------------+-------+
  | Variable_name            | Value |
  +--------------------------+-------+
  | auto_increment_increment | 10    |
  | auto_increment_offset    | 5     |
  +--------------------------+-------+
  2 rows in set (0.00 sec)

  mysql> SELECT col FROM autoinc1;
  +-----+
  | col |
  +-----+
  |   1 |
  |  11 |
  |  21 |
  |  31 |
  +-----+
  4 rows in set (0.00 sec)

  mysql> INSERT INTO autoinc1 VALUES (NULL), (NULL), (NULL), (NULL);
  Query OK, 4 rows affected (0.00 sec)
  Records: 4  Duplicates: 0  Warnings: 0

  mysql> SELECT col FROM autoinc1;
  +-----+
  | col |
  +-----+
  |   1 |
  |  11 |
  |  21 |
  |  31 |
  |  35 |
  |  45 |
  |  55 |
  |  65 |
  +-----+
  8 rows in set (0.00 sec)
  ```

  The values shown for `auto_increment_increment` and `auto_increment_offset` generate the series 5 + *`N`* × 10, that is, [5, 15, 25, 35, 45, ...]. The highest value present in the `col` column prior to the `INSERT` is 31, and the next available value in the `AUTO_INCREMENT` series is 35, so the inserted values for `col` begin at that point and the results are as shown for the `SELECT` query.

  It is not possible to restrict the effects of these two variables to a single table; these variables control the behavior of all `AUTO_INCREMENT` columns in *all* tables on the MySQL server. If the global value of either variable is set, its effects persist until the global value is changed or overridden by setting the session value, or until **mysqld** is restarted. If the local value is set, the new value affects `AUTO_INCREMENT` columns for all tables into which new rows are inserted by the current user for the duration of the session, unless the values are changed during that session.

  The default value of `auto_increment_increment` is

  1. See Section 19.5.1.1, “Replication and AUTO\_INCREMENT”.

* `auto_increment_offset`

  <table frame="box" rules="all" summary="Properties for auto_increment_offset"><tbody><tr><th>Command-Line Format</th> <td><code>--auto-increment-offset=#</code></td> </tr><tr><th>System Variable</th> <td><code>auto_increment_offset</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>

  This variable has a default value of 1. If it is left with its default value, and Group Replication is started on the server in multi-primary mode, it is changed to the server ID. For more information, see the description for `auto_increment_increment`.

  Note

  `auto_increment_offset` is also supported for use with `NDB` tables.

* `immediate_server_version`

  <table frame="box" rules="all" summary="Properties for immediate_server_version"><tbody><tr><th>System Variable</th> <td><code>immediate_server_version</code></td> </tr><tr><th>Scope</th> <td>Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>999999</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>999999</code></td> </tr></tbody></table>

  For internal use by replication. This session system variable holds the MySQL Server release number of the server that is the immediate source in a replication topology (for example, `90500` for a MySQL 9.5.0 server instance). If this immediate server is at a release that does not support the session system variable, the value of the variable is set to 0 (`UNKNOWN_SERVER_VERSION`).

  The value of the variable is replicated from a source to a replica. With this information the replica can correctly process data originating from a source at an older release, by recognizing where syntax changes or semantic changes have occurred between the releases involved and handling these appropriately. The information can also be used in a Group Replication environment where one or more members of the replication group is at a newer release than the others. The value of the variable can be viewed in the binary log for each transaction (as part of the `Gtid_log_event`, or `Anonymous_gtid_log_event` if GTIDs are not in use on the server), and could be helpful in debugging cross-version replication issues.

  Setting the session value of this system variable is a restricted operation. The session user must have either the `REPLICATION_APPLIER` privilege (see Section 19.3.3, “Replication Privilege Checks”), or privileges sufficient to set restricted session variables (see Section 7.1.9.1, “System Variable Privileges”). However, note that the variable is not intended for users to set; it is set automatically by the replication infrastructure.

* `original_server_version`

  <table frame="box" rules="all" summary="Properties for original_server_version"><tbody><tr><th>System Variable</th> <td><code>original_server_version</code></td> </tr><tr><th>Scope</th> <td>Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>999999</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>999999</code></td> </tr></tbody></table>

  For internal use by replication. This session system variable holds the MySQL Server release number of the server where a transaction was originally committed (for example, `90500` for a MySQL 9.5.0 server instance). If this original server is at a release that does not support the session system variable, the value of the variable is set to 0 (`UNKNOWN_SERVER_VERSION`). Note that when a release number is set by the original server, the value of the variable is reset to 0 if the immediate server or any other intervening server in the replication topology does not support the session system variable, and so does not replicate its value.

  The value of the variable is set and used in the same ways as for the `immediate_server_version` system variable. If the value of the variable is the same as that for the `immediate_server_version` system variable, only the latter is recorded in the binary log, with an indicator that the original server version is the same.

  In a Group Replication environment, view change log events, which are special transactions queued by each group member when a new member joins the group, are tagged with the server version of the group member queuing the transaction. This ensures that the server version of the original donor is known to the joining member. Because the view change log events queued for a particular view change have the same GTID on all members, for this case only, instances of the same GTID might have a different original server version.

  Setting the session value of this system variable is a restricted operation. The session user must have either the `REPLICATION_APPLIER` privilege (see Section 19.3.3, “Replication Privilege Checks”), or privileges sufficient to set restricted session variables (see Section 7.1.9.1, “System Variable Privileges”). However, note that the variable is not intended for users to set; it is set automatically by the replication infrastructure.

* `rpl_semi_sync_master_enabled`

  <table frame="box" rules="all" summary="Properties for rpl_semi_sync_master_enabled"><tbody><tr><th>Command-Line Format</th> <td><code>--rpl-semi-sync-master-enabled[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes (removed in 9.5.0)</td> </tr><tr><th>System Variable</th> <td><code>rpl_semi_sync_master_enabled</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Deprecated synonym for `rpl_semi_sync_source_enabled`.

* `rpl_semi_sync_master_timeout`

  <table frame="box" rules="all" summary="Properties for rpl_semi_sync_master_timeout"><tbody><tr><th>Command-Line Format</th> <td><code>--rpl-semi-sync-master-timeout=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes (removed in 9.5.0)</td> </tr><tr><th>System Variable</th> <td><code>rpl_semi_sync_master_timeout</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>10000</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>milliseconds</td> </tr></tbody></table>

  Deprecated synonym for `rpl_semi_sync_source_timeout`.

* `rpl_semi_sync_master_trace_level`

  <table frame="box" rules="all" summary="Properties for rpl_semi_sync_master_trace_level"><tbody><tr><th>Command-Line Format</th> <td><code>--rpl-semi-sync-master-trace-level=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes (removed in 9.5.0)</td> </tr><tr><th>System Variable</th> <td><code>rpl_semi_sync_master_trace_level</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>32</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Deprecated synonym for `rpl_semi_sync_source_trace_level`.

* `rpl_semi_sync_master_wait_for_slave_count`

  <table frame="box" rules="all" summary="Properties for rpl_semi_sync_master_wait_for_slave_count"><tbody><tr><th>Command-Line Format</th> <td><code>--rpl-semi-sync-master-wait-for-slave-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes (removed in 9.5.0)</td> </tr><tr><th>System Variable</th> <td><code>rpl_semi_sync_master_wait_for_slave_count</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>

  Deprecated synonym for `rpl_semi_sync_source_wait_for_replica_count`.

* `rpl_semi_sync_master_wait_no_slave`

  <table frame="box" rules="all" summary="Properties for show-slave-auth-info"><tbody><tr><th>Command-Line Format</th> <td><code>--show-slave-auth-info[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>0

  Deprecated synonym for `rpl_semi_sync_source_wait_no_replica`.

* `rpl_semi_sync_master_wait_point`

  <table frame="box" rules="all" summary="Properties for show-slave-auth-info"><tbody><tr><th>Command-Line Format</th> <td><code>--show-slave-auth-info[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>1

  Deprecated synonym for `rpl_semi_sync_source_wait_point`.

* `rpl_semi_sync_source_enabled`

  <table frame="box" rules="all" summary="Properties for show-slave-auth-info"><tbody><tr><th>Command-Line Format</th> <td><code>--show-slave-auth-info[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>2

  `rpl_semi_sync_source_enabled` is available when the `rpl_semi_sync_source` (`semisync_source.so` library) plugin was installed on the replica to set up semisynchronous replication.

  `rpl_semi_sync_source_enabled` controls whether semisynchronous replication is enabled on the source server. To enable or disable the plugin, set this variable to `ON` or `OFF` (or 1 or 0), respectively. The default is `OFF`.

* `rpl_semi_sync_source_timeout`

  <table frame="box" rules="all" summary="Properties for show-slave-auth-info"><tbody><tr><th>Command-Line Format</th> <td><code>--show-slave-auth-info[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>3

  `rpl_semi_sync_source_timeout` is available when the `rpl_semi_sync_source` (`semisync_source.so` library) plugin is installed on the replica.

  `rpl_semi_sync_source_timeout` controls how long the source waits on a commit for acknowledgment from a replica before timing out and reverting to asynchronous replication. The value is specified in milliseconds, and the default value is 10000 (10 seconds).

* `rpl_semi_sync_source_trace_level`

  <table frame="box" rules="all" summary="Properties for show-slave-auth-info"><tbody><tr><th>Command-Line Format</th> <td><code>--show-slave-auth-info[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>4

  `rpl_semi_sync_source_trace_level` is available when the `rpl_semi_sync_source` (`semisync_source.so` library) plugin is installed on the replica.

  `rpl_semi_sync_source_trace_level` specifies the semisynchronous replication debug trace level on the source server. Four levels are defined:

  + 1 = general level (for example, time function failures)
  + 16 = detail level (more verbose information)
  + 32 = net wait level (more information about network waits)

  + 64 = function level (information about function entry and exit)

* `rpl_semi_sync_source_wait_for_replica_count`

  <table frame="box" rules="all" summary="Properties for show-slave-auth-info"><tbody><tr><th>Command-Line Format</th> <td><code>--show-slave-auth-info[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>5

  `rpl_semi_sync_source_wait_for_replica_count` is available when the `rpl_semi_sync_source` (`semisync_source.so` library) plugin is installed on the replica to set up semisynchronous replication.

  `rpl_semi_sync_source_wait_for_replica_count` specifies the number of replica acknowledgments the source must receive per transaction before proceeding. By default `rpl_semi_sync_source_wait_for_replica_count` is `1`, meaning that semisynchronous replication proceeds after receiving a single replica acknowledgment. Performance is best for small values of this variable.

  For example, if `rpl_semi_sync_source_wait_for_replica_count` is `2`, then 2 replicas must acknowledge receipt of the transaction before the timeout period configured by `rpl_semi_sync_source_timeout` for semisynchronous replication to proceed. If fewer replicas acknowledge receipt of the transaction during the timeout period, the source reverts to normal replication.

  Note

  This behavior also depends on `rpl_semi_sync_source_wait_no_replica`.

* `rpl_semi_sync_source_wait_no_replica`

  <table frame="box" rules="all" summary="Properties for show-slave-auth-info"><tbody><tr><th>Command-Line Format</th> <td><code>--show-slave-auth-info[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>6

  `rpl_semi_sync_source_wait_no_replica` is available when the `rpl_semi_sync_source` (`semisync_source.so` library) plugin is installed on the replica.

  `rpl_semi_sync_source_wait_no_replica` controls whether the source waits for the timeout period configured by `rpl_semi_sync_source_timeout` to expire, even if the replica count drops to less than the number of replicas configured by `rpl_semi_sync_source_wait_for_replica_count` during the timeout period.

  When the value of `rpl_semi_sync_source_wait_no_replica` is `ON` (the default), it is permissible for the replica count to drop to less than `rpl_semi_sync_source_wait_for_replica_count` during the timeout period. As long as enough replicas acknowledge the transaction before the timeout period expires, semisynchronous replication continues.

  When the value of `rpl_semi_sync_source_wait_no_replica` is `OFF`, if the replica count drops to less than the number configured in `rpl_semi_sync_source_wait_for_replica_count` at any time during the timeout period configured by `rpl_semi_sync_source_timeout`, the source reverts to normal replication.

* `rpl_semi_sync_source_wait_point`

  <table frame="box" rules="all" summary="Properties for show-slave-auth-info"><tbody><tr><th>Command-Line Format</th> <td><code>--show-slave-auth-info[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>7

  `rpl_semi_sync_source_wait_point` is available when the `rpl_semi_sync_source` (`semisync_source.so` library) plugin is installed on the replica.

  `rpl_semi_sync_source_wait_point` controls the point at which a semisynchronous replication source server waits for replica acknowledgment of transaction receipt before returning a status to the client that committed the transaction. These values are permitted:

  + `AFTER_SYNC` (the default): The source writes each transaction to its binary log and the replica, and syncs the binary log to disk. The source waits for replica acknowledgment of transaction receipt after the sync. Upon receiving acknowledgment, the source commits the transaction to the storage engine and returns a result to the client, which then can proceed.

  + `AFTER_COMMIT`: The source writes each transaction to its binary log and the replica, syncs the binary log, and commits the transaction to the storage engine. The source waits for replica acknowledgment of transaction receipt after the commit. Upon receiving acknowledgment, the source returns a result to the client, which then can proceed.

  The replication characteristics of these settings differ as follows:

  + With `AFTER_SYNC`, all clients see the committed transaction at the same time: After it has been acknowledged by the replica and committed to the storage engine on the source. Thus, all clients see the same data on the source.

    In the event of source failure, all transactions committed on the source have been replicated to the replica (saved to its relay log). An unexpected exit of the source server and failover to the replica is lossless because the replica is up to date. Note, however, that the source cannot be restarted in this scenario and must be discarded, because its binary log might contain uncommitted transactions that would cause a conflict with the replica when externalized after binary log recovery.

  + With `AFTER_COMMIT`, the client issuing the transaction gets a return status only after the server commits to the storage engine and receives replica acknowledgment. After the commit and before replica acknowledgment, other clients can see the committed transaction before the committing client.

    If something goes wrong such that the replica does not process the transaction, then in the event of an unexpected source server exit and failover to the replica, it is possible for such clients to see a loss of data relative to what they saw on the source.
