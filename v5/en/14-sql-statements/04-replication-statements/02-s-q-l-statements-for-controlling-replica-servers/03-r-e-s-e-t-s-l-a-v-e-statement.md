#### 13.4.2.3 RESET SLAVE Statement

```sql
RESET SLAVE [ALL] [channel_option]

channel_option:
    FOR CHANNEL channel
```

[`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") makes the replica forget its replication position in the source's binary log. This statement is meant to be used for a clean start: It clears the replication metadata repositories, deletes all the relay log files, and starts a new relay log file. It also resets to 0 the replication delay specified with the `MASTER_DELAY` option to `CHANGE MASTER TO`.

Note

All relay log files are deleted, even if they have not been completely executed by the replication SQL thread. (This is a condition likely to exist on a replica if you have issued a [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") statement or if the replica is highly loaded.)

For a server where GTIDs are in use ([`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) is `ON`), issuing [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") has no effect on the GTID execution history. The statement does not change the values of `gtid_executed` or `gtid_purged`, or the `mysql.gtid_executed` table. If you need to reset the GTID execution history, use [`RESET MASTER`](reset-master.html "13.4.1.2 RESET MASTER Statement"), even if the GTID-enabled server is a replica where binary logging is disabled.

[`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") requires the [`RELOAD`](privileges-provided.html#priv_reload) privilege.

To use [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement"), the replication threads must be stopped, so on a running replica use [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") before issuing [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement"). To use [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") on a Group Replication group member, the member status must be `OFFLINE`, meaning that the plugin is loaded but the member does not currently belong to any group. A group member can be taken offline by using a [`STOP GROUP REPLICATION`](stop-group-replication.html "13.4.3.2 STOP GROUP_REPLICATION Statement") statement.

The optional `FOR CHANNEL channel` clause enables you to name which replication channel the statement applies to. Providing a `FOR CHANNEL channel` clause applies the `RESET SLAVE` statement to a specific replication channel. Combining a `FOR CHANNEL channel` clause with the `ALL` option deletes the specified channel. If no channel is named and no extra channels exist, the statement applies to the default channel. Issuing a [`RESET SLAVE ALL`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") statement without a `FOR CHANNEL channel` clause when multiple replication channels exist deletes *all* replication channels and recreates only the default channel. See [Section 16.2.2, “Replication Channels”](replication-channels.html "16.2.2 Replication Channels") for more information.

[`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") does not change any replication connection parameters such as the source's host name and port, or the replication user account name and its password.

* From MySQL 5.7.24, when [`master_info_repository=TABLE`](replication-options-replica.html#sysvar_master_info_repository) is set on the server, replication connection parameters are preserved in the crash-safe `InnoDB` table `mysql.slave_master_info` as part of the [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") operation. They are also retained in memory. In the event of an unexpected server exit or deliberate restart after issuing [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") but before issuing [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement"), the replication connection parameters are retrieved from the table and reused for the new connection.

* When [`master_info_repository=FILE`](replication-options-replica.html#sysvar_master_info_repository) is set on the server (which is the default in MySQL 5.7), replication connection parameters are only retained in memory. If the replica [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") is restarted immediately after issuing [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") due to an unexpected server exit or deliberate restart, the connection parameters are lost. In that case, you must issue a [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement after the server start to respecify the connection parameters before issuing [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement").

If you want to reset the connection parameters intentionally, you need to use [`RESET SLAVE ALL`](reset-slave.html "13.4.2.3 RESET SLAVE Statement"), which clears the connection parameters. In that case, you must issue a [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement after the server start to specify the new connection parameters.

`RESET SLAVE` causes an implicit commit of an ongoing transaction. See [Section 13.3.3, “Statements That Cause an Implicit Commit”](implicit-commit.html "13.3.3 Statements That Cause an Implicit Commit").

If the replication SQL thread was in the middle of replicating temporary tables when it was stopped, and [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") is issued, these replicated temporary tables are deleted on the replica.

Prior to MySQL 5.7.5, `RESET SLAVE` also had the effect of resetting both the heartbeat period ([`Slave_heartbeat_period`](server-status-variables.html#statvar_Slave_heartbeat_period)) and `SSL_VERIFY_SERVER_CERT`. This issue is fixed in MySQL 5.7.5 and later. (Bug #18777899, Bug #18778485)

Prior to MySQL 5.7.5, `RESET SLAVE ALL` did not clear the `IGNORE_SERVER_IDS` list set by [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement"). In MySQL 5.7.5 and later, the statement clears the list. (Bug #18816897)

Note

When used on an NDB Cluster replica SQL node, `RESET SLAVE` clears the `mysql.ndb_apply_status` table. You should keep in mind when using this statement that `ndb_apply_status` uses the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine and so is shared by all SQL nodes attached to the replica cluster.

You can override this behavior by issuing [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") `GLOBAL @@`[`ndb_clear_apply_status=OFF`](mysql-cluster-options-variables.html#sysvar_ndb_clear_apply_status) prior to executing `RESET SLAVE`, which keeps the replica from purging the `ndb_apply_status` table in such cases.
