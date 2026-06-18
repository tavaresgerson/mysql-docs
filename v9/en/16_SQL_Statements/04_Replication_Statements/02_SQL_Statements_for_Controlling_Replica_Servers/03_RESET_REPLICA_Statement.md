#### 15.4.2.3 RESET REPLICA Statement

```
RESET REPLICA [ALL] [channel_option]

channel_option:
    FOR CHANNEL channel
```

`RESET REPLICA` makes the replica forget its
position in the source's binary log.

This statement is meant to be used for a clean start; it clears
the replication metadata repositories, deletes all the relay log
files, and starts a new relay log file. It also resets to 0 the
replication delay specified with the
`SOURCE_DELAY` option of the
[`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement")
statement.

Note

All relay log files are deleted, even if they have not been
completely executed by the replication SQL thread. (This is a
condition likely to exist on a replica if you have issued a
[`STOP
REPLICA`](stop-replica.html "15.4.2.5 STOP REPLICA Statement") statement or if the replica is highly
loaded.)

For a server where GTIDs are in use
([`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) is
`ON`), issuing `RESET REPLICA`
has no effect on the GTID execution history. The statement does
not change the values of `gtid_executed` or
`gtid_purged`, or the
`mysql.gtid_executed` table. If you need to
reset the GTID execution history, use [`RESET
BINARY LOGS AND GTIDS`](reset-binary-logs-and-gtids.html "15.4.1.2 RESET BINARY LOGS AND GTIDS Statement"), even if the GTID-enabled server
is a replica where binary logging is disabled.

`RESET REPLICA` requires the
[`RELOAD`](privileges-provided.html#priv_reload) privilege.

To use `RESET REPLICA`, the replication SQL
thread and replication I/O (receiver) thread must be stopped, so
on a running replica use
[`STOP
REPLICA`](stop-replica.html "15.4.2.5 STOP REPLICA Statement") before issuing `RESET
REPLICA`. To use `RESET REPLICA` on a
Group Replication group member, the member status must be
`OFFLINE`, meaning that the plugin is loaded
but the member does not currently belong to any group. A group
member can be taken offline by using a [`STOP
GROUP REPLICATION`](stop-group-replication.html "15.4.3.2 STOP GROUP_REPLICATION Statement") statement.

The optional `FOR CHANNEL
channel` clause enables you
to name which replication channel the statement applies to.
Providing a `FOR CHANNEL
channel` clause applies the
`RESET REPLICA` statement to a specific
replication channel. Combining a `FOR CHANNEL
channel` clause with the
`ALL` option deletes the specified channel. If
no channel is named and no extra channels exist, the statement
applies to the default channel. Issuing a `RESET REPLICA
ALL` statement without a `FOR CHANNEL
channel` clause when
multiple replication channels exist deletes
*all* replication channels and recreates only
the default channel. See [Section 19.2.2, “Replication Channels”](replication-channels.html "19.2.2 Replication Channels")
for more information.

`RESET REPLICA` does not change any replication
connection parameters, which include the source's host name and
port, the replication user account and its password, the
`PRIVILEGE_CHECKS_USER` account, the
`REQUIRE_ROW_FORMAT` option, the
`REQUIRE_TABLE_PRIMARY_KEY_CHECK` option,and
the `ASSIGN_GTIDS_TO_ANONYMOUS_TRANSACTIONS`
option. If you want to change any of the replication connection
parameters, you can do this using a [`CHANGE
REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement") statement after the server
starts. If you want to remove all of the replication connection
parameters, use `RESET REPLICA ALL`.
`RESET REPLICA ALL` also clears the
`IGNORE_SERVER_IDS` list set by
[`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement").
When you have used `RESET REPLICA ALL`, if you
want to use the instance as a replica again, you need to issue a
[`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement")
statement after the server start to specify new connection
parameters.

You can set the `GTID_ONLY` option on the
[`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement")
statement to stop a replication channel from persisting file
names and file positions in the replication metadata
repositories. When you issue [`RESET
REPLICA`](reset-replica.html "15.4.2.3 RESET REPLICA Statement"), the replication metadata repositories are
synchronized. `RESET REPLICA ALL` deletes
rather than updates the repositories, so they are synchronized
implicitly.

In the event of an unexpected server exit or deliberate restart
after issuing `RESET REPLICA` but before
issuing [`START REPLICA`](start-replica.html "15.4.2.4 START REPLICA Statement"),
replication connection parameters are preserved in the
crash-safe [`InnoDB`](innodb-storage-engine.html "Chapter 17 The InnoDB Storage Engine") tables
`mysql.slave_master_info` and
`mysql.slave_relay_log_info` as part of the
`RESET REPLICA` operation. They are also
retained in memory. In the event of an unexpected server exit or
deliberate restart after issuing `RESET
REPLICA` but before issuing [`START
REPLICA`](start-replica.html "15.4.2.4 START REPLICA Statement"), the replication connection parameters are
retrieved from the tables and reapplied to the channel. This
applies for both the connection and applier metadata
repositories.

`RESET REPLICA` does not change any replication
filter settings (such as
[`--replicate-ignore-table`](replication-options-replica.html#option_mysqld_replicate-ignore-table)) for
channels affected by the statement. However, `RESET
REPLICA ALL` removes the replication filters that were
set on the channels deleted by the statement. When the deleted
channel or channels are recreated, any global replication
filters specified for the replica are copied to them, and no
channel specific replication filters are applied. For more
information see
[Section 19.2.5.4, “Replication Channel Based Filters”](replication-rules-channel-based-filters.html "19.2.5.4 Replication Channel Based Filters").

`RESET REPLICA` causes an implicit commit of an
ongoing transaction. See [Section 15.3.3, “Statements That Cause an Implicit Commit”](implicit-commit.html "15.3.3 Statements That Cause an Implicit Commit").

If the replication SQL thread was in the middle of replicating
temporary tables when it was stopped, and `RESET
REPLICA` is issued, these replicated temporary tables
are deleted on the replica.

Note

When used on an NDB Cluster replica SQL node, `RESET
REPLICA` clears the
`mysql.ndb_apply_status` table. You should
keep in mind when using this statement that
`ndb_apply_status` uses the
[`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 9.5") storage engine and so is
shared by all SQL nodes attached to the cluster.

You can override this behavior by issuing
[`SET`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment")
`GLOBAL
@@`[`ndb_clear_apply_status=OFF`](mysql-cluster-options-variables.html#sysvar_ndb_clear_apply_status)
prior to executing `RESET REPLICA`, which
keeps the replica from purging the
`ndb_apply_status` table in such cases.