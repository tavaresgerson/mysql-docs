#### 19.2.2.1 Commands for Operations on a Single Channel

To enable MySQL replication operations to act on individual
replication channels, use the `FOR CHANNEL
channel` clause with the
following replication statements:

* [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.3 CHANGE REPLICATION SOURCE TO Statement")
* [`CHANGE MASTER TO`](change-master-to.html "15.4.2.1 CHANGE MASTER TO Statement")
* [`START REPLICA`](start-replica.html "15.4.2.6 START REPLICA Statement") (or before MySQL
  8.0.22, [`START SLAVE`](start-slave.html "15.4.2.7 START SLAVE Statement"))

* [`STOP REPLICA`](stop-replica.html "15.4.2.8 STOP REPLICA Statement") (or before MySQL
  8.0.22, [`STOP SLAVE`](stop-slave.html "15.4.2.9 STOP SLAVE Statement"))

* [`SHOW RELAYLOG EVENTS`](show-relaylog-events.html "15.7.7.32 SHOW RELAYLOG EVENTS Statement")
* [`FLUSH RELAY LOGS`](flush.html#flush-relay-logs)
* [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement") (or before
  MySQL 8.0.22, [`SHOW SLAVE
  STATUS`](show-slave-status.html "15.7.7.36 SHOW SLAVE | REPLICA STATUS Statement"))

* [`RESET REPLICA`](reset-replica.html "15.4.2.4 RESET REPLICA Statement") (or before MySQL
  8.0.22, [`RESET SLAVE`](reset-slave.html "15.4.2.5 RESET SLAVE Statement"))

The following functions have a `channel`
parameter:

* [`MASTER_POS_WAIT()`](replication-functions-synchronization.html#function_master-pos-wait)
* [`SOURCE_POS_WAIT()`](replication-functions-synchronization.html#function_source-pos-wait)

The following statements are disallowed for the
`group_replication_recovery` channel:

* [`START REPLICA`](start-replica.html "15.4.2.6 START REPLICA Statement")
* [`STOP REPLICA`](stop-replica.html "15.4.2.8 STOP REPLICA Statement")

The following statements are disallowed for the
`group_replication_applier` channel:

* [`START REPLICA`](start-replica.html "15.4.2.6 START REPLICA Statement")
* [`STOP REPLICA`](stop-replica.html "15.4.2.8 STOP REPLICA Statement")
* [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.35 SHOW REPLICA STATUS Statement")

[`FLUSH RELAY LOGS`](flush.html "15.7.8.3 FLUSH Statement")
is now permitted for the
`group_replication_applier` channel, but if the
request is received while a transaction is being applied, the
request is performed after the transaction ends. The requester
must wait while the transaction is completed and the rotation
takes place. This behavior prevents transactions from being split,
which is not permitted for Group Replication.