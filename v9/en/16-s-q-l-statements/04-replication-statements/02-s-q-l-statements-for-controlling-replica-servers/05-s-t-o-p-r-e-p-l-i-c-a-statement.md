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

When the source is using the row-based binary logging format, you should execute `STOP REPLICA` or `STOP REPLICA SQL_THREAD` on the replica prior to shutting down the replica server if you are replicating any tables that use a nontransactional storage engine. If the current replication event group has modified one or more nontransactional tables, `STOP REPLICA` waits for up to 60 seconds for the event group to complete, unless you issue a `KILL QUERY` or `KILL CONNECTION` statement for the replication SQL thread. If the event group remains incomplete after the timeout, an error message is logged.

When the source is using the statement-based binary logging format, changing the source while it has open temporary tables is potentially unsafe. This is one of the reasons why statement-based replication of temporary tables is not recommended. You can find out whether there are any temporary tables on the replica by checking the value of `Replica_open_temp_tables`. When using statement-based replication, this value should be 0 before executing `CHANGE REPLICATION SOURCE TO`. If there are any temporary tables open on the replica, issuing a `CHANGE REPLICATION SOURCE TO` statement after issuing a `STOP REPLICA` causes an `ER_WARN_OPEN_TEMP_TABLES_MUST_BE_ZERO` warning.
