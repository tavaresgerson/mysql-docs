#### 16.1.6.2 Replication Source Options and Variables

This section describes the server options and system variables that you can use on replication source servers. You can specify the options either on the [command line](command-line-options.html "4.2.2.1 Using Options on the Command Line") or in an [option file](option-files.html "4.2.2.2 Using Option Files"). You can specify system variable values using [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment").

On the source and each replica, you must set the [`server_id`](replication-options.html#sysvar_server_id) system variable to establish a unique replication ID. For each server, you should pick a unique positive integer in the range from 1 to 232 − 1, and each ID must be different from every other ID in use by any other source or replica in the replication topology. Example: `server-id=3`.

For options used on the source for controlling binary logging, see [Section 16.1.6.4, “Binary Logging Options and Variables”](replication-options-binary-log.html "16.1.6.4 Binary Logging Options and Variables").

##### Startup Options for Replication Source Servers

The following list describes startup options for controlling replication source servers. Replication-related system variables are discussed later in this section.

* [`--show-slave-auth-info`](replication-options-source.html#option_mysqld_show-slave-auth-info)

  <table frame="box" rules="all" summary="Properties for show-slave-auth-info"><tbody><tr><th>Command-Line Format</th> <td><code>--show-slave-auth-info[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Display replica user names and passwords in the output of [`SHOW SLAVE HOSTS`](show-slave-hosts.html "13.7.5.33 SHOW SLAVE HOSTS Statement") on the source server for replicas started with the [`--report-user`](replication-options-replica.html#sysvar_report_user) and [`--report-password`](replication-options-replica.html#sysvar_report_password) options.

##### System Variables Used on Replication Source Servers

The following system variables are used to control sources:

* [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment)

  <table frame="box" rules="all" summary="Properties for auto_increment_increment"><tbody><tr><th>Command-Line Format</th> <td><code>--auto-increment-increment=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-source.html#sysvar_auto_increment_increment">auto_increment_increment</a></code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>

  [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment) and [`auto_increment_offset`](replication-options-source.html#sysvar_auto_increment_offset) are intended for use with source-to-source replication, and can be used to control the operation of `AUTO_INCREMENT` columns. Both variables have global and session values, and each can assume an integer value between 1 and 65,535 inclusive. Setting the value of either of these two variables to 0 causes its value to be set to 1 instead. Attempting to set the value of either of these two variables to an integer greater than 65,535 or less than 0 causes its value to be set to 65,535 instead. Attempting to set the value of [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment) or [`auto_increment_offset`](replication-options-source.html#sysvar_auto_increment_offset) to a noninteger value produces an error, and the actual value of the variable remains unchanged.

  Note

  [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment) is also supported for use with [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables.

  When Group Replication is started on a server, the value of [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment) is changed to the value of [`group_replication_auto_increment_increment`](group-replication-system-variables.html#sysvar_group_replication_auto_increment_increment), which defaults to 7, and the value of [`auto_increment_offset`](replication-options-source.html#sysvar_auto_increment_offset) is changed to the server ID. The changes are reverted when Group Replication is stopped. These changes are only made and reverted if [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment) and [`auto_increment_offset`](replication-options-source.html#sysvar_auto_increment_offset) each have their default value of 1. If their values have already been modified from the default, Group Replication does not alter them.

  [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment) and [`auto_increment_offset`](replication-options-source.html#sysvar_auto_increment_offset) affect `AUTO_INCREMENT` column behavior as follows:

  + [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment) controls the interval between successive column values. For example:

    ```sql
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

  + [`auto_increment_offset`](replication-options-source.html#sysvar_auto_increment_offset) determines the starting point for the `AUTO_INCREMENT` column value. Consider the following, assuming that these statements are executed during the same session as the example given in the description for [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment):

    ```sql
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

    When the value of [`auto_increment_offset`](replication-options-source.html#sysvar_auto_increment_offset) is greater than that of [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment), the value of [`auto_increment_offset`](replication-options-source.html#sysvar_auto_increment_offset) is ignored.

  If either of these variables is changed, and then new rows inserted into a table containing an `AUTO_INCREMENT` column, the results may seem counterintuitive because the series of `AUTO_INCREMENT` values is calculated without regard to any values already present in the column, and the next value inserted is the least value in the series that is greater than the maximum existing value in the `AUTO_INCREMENT` column. The series is calculated like this:

  `auto_increment_offset` + *`N`* × `auto_increment_increment`

  where *`N`* is a positive integer value in the series [1, 2, 3, ...]. For example:

  ```sql
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

  The values shown for [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment) and [`auto_increment_offset`](replication-options-source.html#sysvar_auto_increment_offset) generate the series 5 + *`N`* × 10, that is, [5, 15, 25, 35, 45, ...]. The highest value present in the `col` column prior to the [`INSERT`](insert.html "13.2.5 INSERT Statement") is 31, and the next available value in the `AUTO_INCREMENT` series is 35, so the inserted values for `col` begin at that point and the results are as shown for the [`SELECT`](select.html "13.2.9 SELECT Statement") query.

  It is not possible to restrict the effects of these two variables to a single table; these variables control the behavior of all `AUTO_INCREMENT` columns in *all* tables on the MySQL server. If the global value of either variable is set, its effects persist until the global value is changed or overridden by setting the session value, or until [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") is restarted. If the local value is set, the new value affects `AUTO_INCREMENT` columns for all tables into which new rows are inserted by the current user for the duration of the session, unless the values are changed during that session.

  The default value of [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment) is

  1. See [Section 16.4.1.1, “Replication and AUTO\_INCREMENT”](replication-features-auto-increment.html "16.4.1.1 Replication and AUTO_INCREMENT").

* [`auto_increment_offset`](replication-options-source.html#sysvar_auto_increment_offset)

  <table frame="box" rules="all" summary="Properties for auto_increment_offset"><tbody><tr><th>Command-Line Format</th> <td><code>--auto-increment-offset=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-source.html#sysvar_auto_increment_offset">auto_increment_offset</a></code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>

  This variable has a default value of 1. If it is left with its default value, and Group Replication is started on the server, it is changed to the server ID. For more information, see the description for [`auto_increment_increment`](replication-options-source.html#sysvar_auto_increment_increment).

  Note

  `auto_increment_offset` is also supported for use with [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables.

* [`rpl_semi_sync_master_enabled`](replication-options-source.html#sysvar_rpl_semi_sync_master_enabled)

  <table frame="box" rules="all" summary="Properties for rpl_semi_sync_master_enabled"><tbody><tr><th>Command-Line Format</th> <td><code>--rpl-semi-sync-master-enabled[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-source.html#sysvar_rpl_semi_sync_master_enabled">rpl_semi_sync_master_enabled</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Controls whether semisynchronous replication is enabled on the source. To enable or disable the plugin, set this variable to `ON` or `OFF` (or 1 or 0), respectively. The default is `OFF`.

  This variable is available only if the source-side semisynchronous replication plugin is installed.

* [`rpl_semi_sync_master_timeout`](replication-options-source.html#sysvar_rpl_semi_sync_master_timeout)

  <table frame="box" rules="all" summary="Properties for rpl_semi_sync_master_timeout"><tbody><tr><th>Command-Line Format</th> <td><code>--rpl-semi-sync-master-timeout=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-source.html#sysvar_rpl_semi_sync_master_timeout">rpl_semi_sync_master_timeout</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>10000</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>milliseconds</td> </tr></tbody></table>

  A value in milliseconds that controls how long the source waits on a commit for acknowledgment from a replica before timing out and reverting to asynchronous replication. The default value is 10000 (10 seconds).

  This variable is available only if the source-side semisynchronous replication plugin is installed.

* [`rpl_semi_sync_master_trace_level`](replication-options-source.html#sysvar_rpl_semi_sync_master_trace_level)

  <table frame="box" rules="all" summary="Properties for rpl_semi_sync_master_trace_level"><tbody><tr><th>Command-Line Format</th> <td><code>--rpl-semi-sync-master-trace-level=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-source.html#sysvar_rpl_semi_sync_master_trace_level">rpl_semi_sync_master_trace_level</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>32</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  The semisynchronous replication debug trace level on the source. Four levels are defined:

  + 1 = general level (for example, time function failures)
  + 16 = detail level (more verbose information)
  + 32 = net wait level (more information about network waits)

  + 64 = function level (information about function entry and exit)

  This variable is available only if the source-side semisynchronous replication plugin is installed.

* [`rpl_semi_sync_master_wait_for_slave_count`](replication-options-source.html#sysvar_rpl_semi_sync_master_wait_for_slave_count)

  <table frame="box" rules="all" summary="Properties for rpl_semi_sync_master_wait_for_slave_count"><tbody><tr><th>Command-Line Format</th> <td><code>--rpl-semi-sync-master-wait-for-slave-count=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-source.html#sysvar_rpl_semi_sync_master_wait_for_slave_count">rpl_semi_sync_master_wait_for_slave_count</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>

  The number of replica acknowledgments the source must receive per transaction before proceeding. By default `rpl_semi_sync_master_wait_for_slave_count` is `1`, meaning that semisynchronous replication proceeds after receiving a single replica acknowledgment. Performance is best for small values of this variable.

  For example, if `rpl_semi_sync_master_wait_for_slave_count` is `2`, then 2 replicas must acknowledge receipt of the transaction before the timeout period configured by [`rpl_semi_sync_master_timeout`](replication-options-source.html#sysvar_rpl_semi_sync_master_timeout) for semisynchronous replication to proceed. If fewer replicas acknowledge receipt of the transaction during the timeout period, the source reverts to normal replication.

  Note

  This behavior also depends on [`rpl_semi_sync_master_wait_no_slave`](replication-options-source.html#sysvar_rpl_semi_sync_master_wait_no_slave)

  This variable is available only if the source-side semisynchronous replication plugin is installed.

* [`rpl_semi_sync_master_wait_no_slave`](replication-options-source.html#sysvar_rpl_semi_sync_master_wait_no_slave)

  <table frame="box" rules="all" summary="Properties for rpl_semi_sync_master_wait_no_slave"><tbody><tr><th>Command-Line Format</th> <td><code>--rpl-semi-sync-master-wait-no-slave[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-source.html#sysvar_rpl_semi_sync_master_wait_no_slave">rpl_semi_sync_master_wait_no_slave</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  Controls whether the source waits for the timeout period configured by [`rpl_semi_sync_master_timeout`](replication-options-source.html#sysvar_rpl_semi_sync_master_timeout) to expire, even if the replica count drops to less than the number of replicas configured by [`rpl_semi_sync_master_wait_for_slave_count`](replication-options-source.html#sysvar_rpl_semi_sync_master_wait_for_slave_count) during the timeout period.

  When the value of `rpl_semi_sync_master_wait_no_slave` is `ON` (the default), it is permissible for the replica count to drop to less than [`rpl_semi_sync_master_wait_for_slave_count`](replication-options-source.html#sysvar_rpl_semi_sync_master_wait_for_slave_count) during the timeout period. As long as enough replicas acknowledge the transaction before the timeout period expires, semisynchronous replication continues.

  When the value of `rpl_semi_sync_master_wait_no_slave` is `OFF`, if the replica count drops to less than the number configured in [`rpl_semi_sync_master_wait_for_slave_count`](replication-options-source.html#sysvar_rpl_semi_sync_master_wait_for_slave_count) at any time during the timeout period configured by [`rpl_semi_sync_master_timeout`](replication-options-source.html#sysvar_rpl_semi_sync_master_timeout), the source reverts to normal replication.

  This variable is available only if the source-side semisynchronous replication plugin is installed.

* [`rpl_semi_sync_master_wait_point`](replication-options-source.html#sysvar_rpl_semi_sync_master_wait_point)

  <table frame="box" rules="all" summary="Properties for rpl_semi_sync_master_wait_point"><tbody><tr><th>Command-Line Format</th> <td><code>--rpl-semi-sync-master-wait-point=value</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="replication-options-source.html#sysvar_rpl_semi_sync_master_wait_point">rpl_semi_sync_master_wait_point</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>AFTER_SYNC</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>AFTER_SYNC</code></p><p class="valid-value"><code>AFTER_COMMIT</code></p></td> </tr></tbody></table>

  This variable controls the point at which a semisynchronous source waits for replica acknowledgment of transaction receipt before returning a status to the client that committed the transaction. These values are permitted:

  + `AFTER_SYNC` (the default): The source writes each transaction to its binary log and the replica, and syncs the binary log to disk. The source waits for replica acknowledgment of transaction receipt after the sync. Upon receiving acknowledgment, the source commits the transaction to the storage engine and returns a result to the client, which then can proceed.

  + `AFTER_COMMIT`: The source writes each transaction to its binary log and the replica, syncs the binary log, and commits the transaction to the storage engine. The source waits for replica acknowledgment of transaction receipt after the commit. Upon receiving acknowledgment, the source returns a result to the client, which then can proceed.

  The replication characteristics of these settings differ as follows:

  + With `AFTER_SYNC`, all clients see the committed transaction at the same time: After it has been acknowledged by the replica and committed to the storage engine on the source. Thus, all clients see the same data on the source.

    In the event of source failure, all transactions committed on the source have been replicated to the replica (saved to its relay log). An unexpected exit of the source and failover to the replica is lossless because the replica is up to date. Note, however, that the source cannot be restarted in this scenario and must be discarded, because its binary log might contain uncommitted transactions that would cause a conflict with the replica when externalized after binary log recovery.

  + With `AFTER_COMMIT`, the client issuing the transaction gets a return status only after the server commits to the storage engine and receives replica acknowledgment. After the commit and before replica acknowledgment, other clients can see the committed transaction before the committing client.

    If something goes wrong such that the replica does not process the transaction, then in the event of an unexpected source exit and failover to the replica, it is possible for such clients to see a loss of data relative to what they saw on the source.

  This variable is available only if the source-side semisynchronous replication plugin is installed.

  [`rpl_semi_sync_master_wait_point`](replication-options-source.html#sysvar_rpl_semi_sync_master_wait_point) was added in MySQL 5.7.2. For older versions, semisynchronous source behavior is equivalent to a setting of `AFTER_COMMIT`.

  This change introduces a version compatibility constraint because it increments the semisynchronous interface version: Servers for MySQL 5.7.2 and up do not work with semisynchronous replication plugins from older versions, nor do servers from older versions work with semisynchronous replication plugins for MySQL 5.7.2 and up.
