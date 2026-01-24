#### 16.1.7.3 Skipping Transactions

If replication stops due to an issue with an event in a replicated transaction, you can resume replication by skipping the failed transaction on the replica. Before skipping a transaction, ensure that the replication I/O thread is stopped as well as the replication SQL thread.

First you need to identify the replicated event that caused the error. Details of the error and the last successfully applied transaction are recorded in the Performance Schema table [`replication_applier_status_by_worker`](performance-schema-replication-applier-status-by-worker-table.html "25.12.11.6 The replication_applier_status_by_worker Table"). You can use [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files") to retrieve and display the events that were logged around the time of the error. For instructions to do this, see [Section 7.5, “Point-in-Time (Incremental) Recovery”](point-in-time-recovery.html "7.5 Point-in-Time (Incremental) Recovery"). Alternatively, you can issue [`SHOW RELAYLOG EVENTS`](show-relaylog-events.html "13.7.5.32 SHOW RELAYLOG EVENTS Statement") on the replica or [`SHOW BINLOG EVENTS`](show-binlog-events.html "13.7.5.2 SHOW BINLOG EVENTS Statement") on the source.

Before skipping the transaction and restarting the replica, check these points:

* Is the transaction that stopped replication from an unknown or untrusted source? If so, investigate the cause in case there are any security considerations that indicate the replica should not be restarted.

* Does the transaction that stopped replication need to be applied on the replica? If so, either make the appropriate corrections and reapply the transaction, or manually reconcile the data on the replica.

* Did the transaction that stopped replication need to be applied on the source? If not, undo the transaction manually on the server where it originally took place.

To skip the transaction, choose one of the following methods as appropriate:

* When GTIDs are in use ([`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) is `ON`), see [Section 16.1.7.3.1, “Skipping Transactions With GTIDs”](replication-administration-skip.html#replication-administration-skip-gtid "16.1.7.3.1 Skipping Transactions With GTIDs") .

* When GTIDs are not in use or are being phased in ([`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) is `OFF`, `OFF_PERMISSIVE`, or `ON_PERMISSIVE`), see [Section 16.1.7.3.2, “Skipping Transactions Without GTIDs”](replication-administration-skip.html#replication-administration-skip-nogtid "16.1.7.3.2 Skipping Transactions Without GTIDs").

To restart replication after skipping the transaction, issue [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement"), with the `FOR CHANNEL` clause if the replica is a multi-source replica.

##### 16.1.7.3.1 Skipping Transactions With GTIDs

When GTIDs are in use ([`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) is `ON`), the GTID for a committed transaction is persisted on the replica even if the content of the transaction is filtered out. This feature prevents a replica from retrieving previously filtered transactions when it reconnects to the source using GTID auto-positioning. It can also be used to skip a transaction on the replica, by committing an empty transaction in place of the failing transaction.

If the failing transaction generated an error in a worker thread, you can obtain its GTID directly from the `APPLYING_TRANSACTION` field in the Performance Schema table [`replication_applier_status_by_worker`](performance-schema-replication-applier-status-by-worker-table.html "25.12.11.6 The replication_applier_status_by_worker Table"). To see what the transaction is, issue [`SHOW RELAYLOG EVENTS`](show-relaylog-events.html "13.7.5.32 SHOW RELAYLOG EVENTS Statement") on the replica or [`SHOW BINLOG EVENTS`](show-binlog-events.html "13.7.5.2 SHOW BINLOG EVENTS Statement") on the source, and search the output for a transaction preceded by that GTID.

When you have assessed the failing transaction for any other appropriate actions as described previously (such as security considerations), to skip it, commit an empty transaction on the replica that has the same GTID as the failing transaction. For example:

```sql
SET GTID_NEXT='aaa-bbb-ccc-ddd:N';
BEGIN;
COMMIT;
SET GTID_NEXT='AUTOMATIC';
```

The presence of this empty transaction on the replica means that when you issue a [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") statement to restart replication, the replica uses the auto-skip function to ignore the failing transaction, because it sees a transaction with that GTID has already been applied. If the replica is a multi-source replica, you do not need to specify the channel name when you commit the empty transaction, but you do need to specify the channel name when you issue [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement").

Note that if binary logging is in use on this replica, the empty transaction enters the replication stream if the replica becomes a source or primary in the future. If you need to avoid this possibility, consider flushing and purging the replica's binary logs, as in this example:

```sql
FLUSH LOGS;
PURGE BINARY LOGS TO 'binlog.000146';
```

The GTID of the empty transaction is persisted, but the transaction itself is removed by purging the binary log files.

##### 16.1.7.3.2 Skipping Transactions Without GTIDs

To skip failing transactions when GTIDs are not in use or are being phased in ([`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) is `OFF`, `OFF_PERMISSIVE`, or `ON_PERMISSIVE`), you can skip a specified number of events by issuing a `SET GLOBAL sql_slave_skip_counter` statement. Alternatively, you can skip past an event or events by issuing a [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement to move the source's binary log position forward.

When you use these methods, it is important to understand that you are not necessarily skipping a complete transaction, as is always the case with the GTID-based method described previously. These non-GTID-based methods are not aware of transactions as such, but instead operate on events. The binary log is organized as a sequence of groups known as event groups, and each event group consists of a sequence of events.

* For transactional tables, an event group corresponds to a transaction.

* For nontransactional tables, an event group corresponds to a single SQL statement.

A single transaction can contain changes to both transactional and nontransactional tables.

When you use a `SET GLOBAL sql_slave_skip_counter` statement to skip events and the resulting position is in the middle of an event group, the replica continues to skip events until it reaches the end of the group. Execution then starts with the next event group. The [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement does not have this function, so you must be careful to identify the correct location to restart replication at the beginning of an event group. However, using [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") means you do not have to count the events that need to be skipped, as you do with a `SET GLOBAL sql_slave_skip_counter`, and instead you can just specify the location to restart.

###### 16.1.7.3.2.1 Skipping Transactions With `SET GLOBAL sql_slave_skip_counter`

When you have assessed the failing transaction for any other appropriate actions as described previously (such as security considerations), count the number of events that you need to skip. One event normally corresponds to one SQL statement in the binary log, but note that statements that use `AUTO_INCREMENT` or `LAST_INSERT_ID()` count as two events in the binary log.

If you want to skip the complete transaction, you can count the events to the end of the transaction, or you can just skip the relevant event group. Remember that with `SET GLOBAL sql_slave_skip_counter`, the replica continues to skip to the end of an event group. Make sure you do not skip too far forward and go into the next event group or transaction, as this then causes it to be skipped as well.

Issue the `SET` statement as follows, where *`N`* is the number of events from the source to skip:

```sql
SET GLOBAL sql_slave_skip_counter = N
```

This statement cannot be issued if [`gtid_mode=ON`](replication-options-gtids.html#sysvar_gtid_mode) is set, or if the replica threads are running.

The `SET GLOBAL sql_slave_skip_counter` statement has no immediate effect. When you issue the [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") statement for the next time following this `SET` statement, the new value for the system variable [`sql_slave_skip_counter`](replication-options-replica.html#sysvar_sql_slave_skip_counter) is applied, and the events are skipped. That [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") statement also automatically sets the value of the system variable back to

0. If the replica is a multi-source replica, when you issue that [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") statement, the `FOR CHANNEL` clause is required. Make sure that you name the correct channel, otherwise events are skipped on the wrong channel.

###### 16.1.7.3.2.2 Skipping Transactions With `CHANGE MASTER TO`

When you have assessed the failing transaction for any other appropriate actions as described previously (such as security considerations), identify the coordinates (file and position) in the source's binary log that represent a suitable position to restart replication. This can be the start of the event group following the event that caused the issue, or the start of the next transaction. The replication I/O thread begins reading from the source at these coordinates the next time the thread starts, skipping the failing event. Make sure that you have identified the position accurately, because this statement does not take event groups into account.

Issue the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement as follows, where *`source_log_name`* is the binary log file that contains the restart position, and *`source_log_pos`* is the number representing the restart position as stated in the binary log file:

```sql
CHANGE MASTER TO MASTER_LOG_FILE='source_log_name', MASTER_LOG_POS=source_log_pos;
```

If the replica is a multi-source replica, you must use the `FOR CHANNEL` clause to name the appropriate channel on the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement.

This statement cannot be issued if `MASTER_AUTO_POSITION=1` is set, or if the replication threads are running. If you need to use this method of skipping a transaction when `MASTER_AUTO_POSITION=1` is normally set, you can change the setting to `MASTER_AUTO_POSITION=0` while issuing the statement, then change it back again afterwards. For example:

```sql
CHANGE MASTER TO MASTER_AUTO_POSITION=0, MASTER_LOG_FILE='binlog.000145', MASTER_LOG_POS=235;
CHANGE MASTER TO MASTER_AUTO_POSITION=1;
```
