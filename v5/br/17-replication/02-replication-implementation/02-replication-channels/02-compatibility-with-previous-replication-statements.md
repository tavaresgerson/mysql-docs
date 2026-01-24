#### 16.2.2.2 Compatibility with Previous Replication Statements

When a replica has multiple channels and a `FOR CHANNEL channel` option is not specified, a valid statement generally acts on all available channels, with some specific exceptions.

For example, the following statements behave as expected for all except certain Group Replication channels:

* [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") starts replication threads for all channels, except the `group_replication_recovery` and `group_replication_applier` channels.

* [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") stops replication threads for all channels, except the `group_replication_recovery` and `group_replication_applier` channels.

* [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") reports the status for all channels, except the `group_replication_applier` channel.

* [`FLUSH RELAY LOGS`](flush.html "13.7.6.3 FLUSH Statement") flushes the relay logs for all channels, except the `group_replication_applier` channel.

* [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") resets all channels.

Warning

Use `RESET SLAVE` with caution as this statement deletes all existing channels, purges their relay log files, and recreates only the default channel.

Some replication statements cannot operate on all channels. In this case, error 1964 Multiple channels exist on the slave. Please provide channel name as an argument. is generated. The following statements and functions generate this error when used in a multi-source replication topology and a `FOR CHANNEL channel` option is not used to specify which channel to act on:

* [`SHOW RELAYLOG EVENTS`](show-relaylog-events.html "13.7.5.32 SHOW RELAYLOG EVENTS Statement")
* [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement")
* [`MASTER_POS_WAIT()`](miscellaneous-functions.html#function_master-pos-wait)
* [`WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()`](gtid-functions.html#function_wait-until-sql-thread-after-gtids)

Note that a default channel always exists in a single source replication topology, where statements and functions behave as in previous versions of MySQL.
