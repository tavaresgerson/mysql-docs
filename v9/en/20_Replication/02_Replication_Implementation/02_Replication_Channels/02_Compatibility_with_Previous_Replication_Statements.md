#### 19.2.2.2 Compatibility with Previous Replication Statements

When a replica has multiple channels and a `FOR CHANNEL channel` option is not specified, a valid statement generally acts on all available channels, with some specific exceptions.

For example, the following statements behave as expected for all except certain Group Replication channels:

* `START REPLICA` starts replication threads for all channels, except the `group_replication_recovery` and `group_replication_applier` channels.

* `STOP REPLICA` stops replication threads for all channels, except the `group_replication_recovery` and `group_replication_applier` channels.

* `SHOW REPLICA STATUS` reports the status for all channels, except the `group_replication_applier` channel.

* `RESET REPLICA` resets all channels.

Warning

Use `RESET REPLICA` with caution as this statement deletes all existing channels, purges their relay log files, and recreates only the default channel.

Some replication statements cannot operate on all channels. In this case, error 1964 Multiple channels exist on the replica. Please provide channel name as an argument. is generated. The following statements and functions generate this error when used in a multi-source replication topology and a `FOR CHANNEL channel` option is not used to specify which channel to act on:

* `SHOW RELAYLOG EVENTS`
* `CHANGE REPLICATION SOURCE TO`
* `SOURCE_POS_WAIT()`

Note that a default channel always exists in a single source replication topology, where statements and functions behave as in previous versions of MySQL.
