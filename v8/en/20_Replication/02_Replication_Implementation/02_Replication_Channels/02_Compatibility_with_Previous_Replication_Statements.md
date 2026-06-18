#### 19.2.2.2 Compatibility with Previous Replication Statements

When a replica has multiple channels and a `FOR CHANNEL
channel` option is not
specified, a valid statement generally acts on all available
channels, with some specific exceptions.

For example, the following statements behave as expected for all
except certain Group Replication channels:

* [`START REPLICA`](start-replica.html "15.4.2.6 START REPLICA Statement") starts
  replication threads for all channels, except the
  `group_replication_recovery` and
  `group_replication_applier` channels.

* [`STOP REPLICA`](stop-replica.html "15.4.2.8 STOP REPLICA Statement") stops replication
  threads for all channels, except the
  `group_replication_recovery` and
  `group_replication_applier` channels.

* [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement") reports the
  status for all channels, except the
  `group_replication_applier` channel.

* [`RESET REPLICA`](reset-replica.html "15.4.2.4 RESET REPLICA Statement") resets all
  channels.

Warning

Use [`RESET REPLICA`](reset-replica.html "15.4.2.4 RESET REPLICA Statement") with caution as
this statement deletes all existing channels, purges their relay
log files, and recreates only the default channel.

Some replication statements cannot operate on all channels. In
this case, error 1964 Multiple channels exist on the
replica. Please provide channel name as an argument.
is generated. The following statements and functions generate this
error when used in a multi-source replication topology and a
`FOR CHANNEL channel`
option is not used to specify which channel to act on:

* [`SHOW RELAYLOG EVENTS`](show-relaylog-events.html "15.7.7.32 SHOW RELAYLOG EVENTS Statement")
* [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement")
* [`CHANGE MASTER TO`](change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement")
* [`MASTER_POS_WAIT()`](replication-functions-synchronization.html#function_master-pos-wait)
* [`SOURCE_POS_WAIT()`](replication-functions-synchronization.html#function_source-pos-wait)

Note that a default channel always exists in a single source
replication topology, where statements and functions behave as in
previous versions of MySQL.