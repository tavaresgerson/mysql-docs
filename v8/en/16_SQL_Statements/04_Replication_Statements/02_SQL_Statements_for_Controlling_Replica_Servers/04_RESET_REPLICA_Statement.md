#### 15.4.2.4 RESET REPLICA Statement

```
RESET REPLICA [ALL] [channel_option]

channel_option:
    FOR CHANNEL channel
```

`RESET REPLICA` makes the replica forget its position in the source's binary log. From MySQL 8.0.22, use `RESET REPLICA` in place of `RESET SLAVE`, which is deprecated from that release. In releases before MySQL 8.0.22, use `RESET SLAVE`.

This statement is meant to be used for a clean start; it clears the replication metadata repositories, deletes all the relay log files, and starts a new relay log file. It also resets to 0 the replication delay specified with the `SOURCE_DELAY` | `MASTER_DELAY` option of the `CHANGE REPLICATION SOURCE TO` statement (from MySQL 8.0.23) or `CHANGE MASTER TO` statement (before MySQL 8.0.23).

Note

All relay log files are deleted, even if they have not been completely executed by the replication SQL thread. (This is a condition likely to exist on a replica if you have issued a `STOP REPLICA` statement or if the replica is highly loaded.)

For a server where GTIDs are in use (`gtid_mode` is `ON`), issuing `RESET REPLICA` has no effect on the GTID execution history. The statement does not change the values of `gtid_executed` or `gtid_purged`, or the `mysql.gtid_executed` table. If you need to reset the GTID execution history, use `RESET MASTER`, even if the GTID-enabled server is a replica where binary logging is disabled.

`RESET REPLICA` requires the `RELOAD` privilege.

To use `RESET REPLICA`, the replication SQL thread and replication I/O (receiver) thread must be stopped, so on a running replica use `STOP REPLICA` before issuing `RESET REPLICA`. To use `RESET REPLICA` on a Group Replication group member, the member status must be `OFFLINE`, meaning that the plugin is loaded but the member does not currently belong to any group. A group member can be taken offline by using a `STOP GROUP REPLICATION` statement.

The optional `FOR CHANNEL channel` clause enables you to name which replication channel the statement applies to. Providing a `FOR CHANNEL channel` clause applies the `RESET REPLICA` statement to a specific replication channel. Combining a `FOR CHANNEL channel` clause with the `ALL` option deletes the specified channel. If no channel is named and no extra channels exist, the statement applies to the default channel. Issuing a `RESET REPLICA ALL` statement without a `FOR CHANNEL channel` clause when multiple replication channels exist deletes *all* replication channels and recreates only the default channel. See Section 19.2.2, “Replication Channels” for more information.

`RESET REPLICA` does not change any replication connection parameters, which include the source's host name and port, the replication user account and its password, the `PRIVILEGE_CHECKS_USER` account, the `REQUIRE_ROW_FORMAT` option, the `REQUIRE_TABLE_PRIMARY_KEY_CHECK` option,and the `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS` option. If you want to change any of the replication connection parameters, you can do this using a `CHANGE REPLICATION SOURCE TO` statement (from MySQL 8.0.23) or `CHANGE MASTER TO` statement (before MySQL 8.0.23) after the server start. If you want to remove all of the replication connection parameters, use `RESET REPLICA ALL`. `RESET REPLICA ALL` also clears the `IGNORE_SERVER_IDS` list set by `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO`. When you have used `RESET REPLICA ALL`, if you want to use the instance as a replica again, you need to issue a `CHANGE REPLICATION SOURCE TO` | `CHANGE MASTER TO` statement after the server start to specify new connection parameters.

From MySQL 8.0.27, you can set the `GTID_ONLY` option on the `CHANGE REPLICATION SOURCE TO` statement to stop a replication channel from persisting file names and file positions in the replication metadata repositories. When you issue a `RESET REPLICA` statement, the replication metadata repositories are synchronized. `RESET REPLICA ALL` deletes rather than updates the repositories, so they are synchronized implicitly.

In the event of an unexpected server exit or deliberate restart after issuing `RESET REPLICA` but before issuing `START REPLICA`, retention of the replication connection parameters depends on the repository used for the replication metadata:

* When `master_info_repository=TABLE` and `relay_log_info_repository=TABLE` are set on the server (which are the default settings from MySQL 8.0), replication connection parameters are preserved in the crash-safe `InnoDB` tables `mysql.slave_master_info` and `mysql.slave_relay_log_info` as part of the `RESET REPLICA` operation. They are also retained in memory. In the event of an unexpected server exit or deliberate restart after issuing `RESET REPLICA` but before issuing `START REPLICA`, the replication connection parameters are retrieved from the tables and reapplied to the channel. This situation applies from MySQL 8.0.13 for the connection metadata repository, and from MySQL 8.0.19 for the applier metadata repository.

* If `master_info_repository=FILE` and `relay_log_info_repository=FILE` are set on the server, which is deprecated from MySQL 8.0, or the MySQL Server release is earlier than those specified above, replication connection parameters are only retained in memory. If the replica **mysqld** is restarted immediately after issuing `RESET REPLICA` due to an unexpected server exit or deliberate restart, the connection parameters are lost. In that case, you must issue a `CHANGE REPLICATION SOURCE TO` statement (from MySQL 8.0.23) or `CHANGE MASTER TO` statement (before MySQL 8.0.23) after the server start to respecify the connection parameters before issuing `START REPLICA`.

`RESET REPLICA` does not change any replication filter settings (such as `--replicate-ignore-table`) for channels affected by the statement. However, `RESET REPLICA ALL` removes the replication filters that were set on the channels deleted by the statement. When the deleted channel or channels are recreated, any global replication filters specified for the replica are copied to them, and no channel specific replication filters are applied. For more information see Section 19.2.5.4, “Replication Channel Based Filters”.

`RESET REPLICA` causes an implicit commit of an ongoing transaction. See Section 15.3.3, “Statements That Cause an Implicit Commit”.

If the replication SQL thread was in the middle of replicating temporary tables when it was stopped, and `RESET REPLICA` is issued, these replicated temporary tables are deleted on the replica.

Note

When used on an NDB Cluster replica SQL node, `RESET REPLICA` clears the `mysql.ndb_apply_status` table. You should keep in mind when using this statement that `ndb_apply_status` uses the `NDB` storage engine and so is shared by all SQL nodes attached to the cluster.

You can override this behavior by issuing `SET` `GLOBAL @@``ndb_clear_apply_status=OFF` prior to executing `RESET REPLICA`, which keeps the replica from purging the `ndb_apply_status` table in such cases.
