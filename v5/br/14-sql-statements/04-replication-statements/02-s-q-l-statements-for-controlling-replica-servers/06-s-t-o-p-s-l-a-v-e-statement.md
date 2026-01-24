#### 13.4.2.6 STOP SLAVE Statement

```sql
STOP SLAVE [thread_types] [channel_option]

thread_types:
    [thread_type [, thread_type] ... ]

thread_type: IO_THREAD | SQL_THREAD

channel_option:
    FOR CHANNEL channel
```

Stops the replication threads. [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") requires the [`SUPER`](privileges-provided.html#priv_super) privilege. Recommended best practice is to execute `STOP SLAVE` on the replica before stopping the replica server (see [Section 5.1.16, “The Server Shutdown Process”](server-shutdown.html "5.1.16 The Server Shutdown Process"), for more information).

*When using the row-based logging format*: You should execute `STOP SLAVE` or `STOP SLAVE SQL_THREAD` on the replica prior to shutting down the replica server if you are replicating any tables that use a nontransactional storage engine (see the *Note* later in this section).

Like [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement"), this statement may be used with the `IO_THREAD` and `SQL_THREAD` options to name the thread or threads to be stopped. Note that the Group Replication applier channel (`group_replication_applier`) has no replication I/O thread, only a replication SQL thread. Using the `SQL_THREAD` option therefore stops this channel completely.

`STOP SLAVE` causes an implicit commit of an ongoing transaction. See [Section 13.3.3, “Statements That Cause an Implicit Commit”](implicit-commit.html "13.3.3 Statements That Cause an Implicit Commit").

[`gtid_next`](replication-options-gtids.html#sysvar_gtid_next) must be set to `AUTOMATIC` before issuing this statement.

You can control how long `STOP SLAVE` waits before timing out by setting the [`rpl_stop_slave_timeout`](replication-options-replica.html#sysvar_rpl_stop_slave_timeout) system variable. This can be used to avoid deadlocks between `STOP SLAVE` and other SQL statements using different client connections to the replica. When the timeout value is reached, the issuing client returns an error message and stops waiting, but the `STOP SLAVE` instruction remains in effect. Once the replication threads are no longer busy, the `STOP SLAVE` statement is executed and the replica stops.

Some `CHANGE MASTER TO` statements are allowed while the replica is running, depending on the states of the replication SQL thread and the replication I/O thread. However, using `STOP SLAVE` prior to executing `CHANGE MASTER TO` in such cases is still supported. See [Section 13.4.2.1, “CHANGE MASTER TO Statement”](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement"), and [Section 16.3.7, “Switching Sources During Failover”](replication-solutions-switch.html "16.3.7 Switching Sources During Failover"), for more information.

The optional `FOR CHANNEL channel` clause enables you to name which replication channel the statement applies to. Providing a `FOR CHANNEL channel` clause applies the `STOP SLAVE` statement to a specific replication channel. If no channel is named and no extra channels exist, the statement applies to the default channel. If a `STOP SLAVE` statement does not name a channel when using multiple channels, this statement stops the specified threads for all channels. This statement cannot be used with the `group_replication_recovery` channel. See [Section 16.2.2, “Replication Channels”](replication-channels.html "16.2.2 Replication Channels") for more information.

*When using statement-based replication*: changing the source while it has open temporary tables is potentially unsafe. This is one of the reasons why statement-based replication of temporary tables is not recommended. You can find out whether there are any temporary tables on the replica by checking the value of [`Slave_open_temp_tables`](server-status-variables.html#statvar_Slave_open_temp_tables); when using statement-based replication, this value should be 0 before executing `CHANGE MASTER TO`. If there are any temporary tables open on the replica, issuing a `CHANGE MASTER TO` statement after issuing a `STOP SLAVE` causes an [`ER_WARN_OPEN_TEMP_TABLES_MUST_BE_ZERO`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_warn_open_temp_tables_must_be_zero) warning.

When using a multithreaded replica ([`slave_parallel_workers`](replication-options-replica.html#sysvar_slave_parallel_workers) is a nonzero value), any gaps in the sequence of transactions executed from the relay log are closed as part of stopping the worker threads. If the replica is stopped unexpectedly (for example due to an error in a worker thread, or another thread issuing [`KILL`](kill.html "13.7.6.4 KILL Statement")) while a [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") statement is executing, the sequence of executed transactions from the relay log may become inconsistent. See [Section 16.4.1.32, “Replication and Transaction Inconsistencies”](replication-features-transaction-inconsistencies.html "16.4.1.32 Replication and Transaction Inconsistencies"), for more information.

If the current replication event group has modified one or more nontransactional tables, STOP SLAVE waits for up to 60 seconds for the event group to complete, unless you issue a [`KILL QUERY`](kill.html "13.7.6.4 KILL Statement") or [`KILL CONNECTION`](kill.html "13.7.6.4 KILL Statement") statement for the replication SQL thread. If the event group remains incomplete after the timeout, an error message is logged.
