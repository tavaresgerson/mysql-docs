#### 19.2.2.1 Commands for Operations on a Single Channel

To enable MySQL replication operations to act on individual
replication channels, use the `FOR CHANNEL
channel` clause with the
following replication statements:

* [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement")
* [`START REPLICA`](start-replica.html "15.4.2.4 START REPLICA Statement")
* [`STOP REPLICA`](stop-replica.html "15.4.2.5 STOP REPLICA Statement")
* [`SHOW RELAYLOG EVENTS`](show-relaylog-events.html "15.7.7.35 SHOW RELAYLOG EVENTS Statement")
* [`FLUSH RELAY
  LOGS`](flush.html "15.7.8.3 FLUSH Statement")

* [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.36 SHOW REPLICA STATUS Statement")
* [`RESET REPLICA`](reset-replica.html "15.4.2.3 RESET REPLICA Statement")

The [`SOURCE_POS_WAIT()`](replication-functions-synchronization.html#function_source-pos-wait) function has
a `channel` parameter.

[`START REPLICA`](start-replica.html "15.4.2.4 START REPLICA Statement") and
[`STOP REPLICA`](stop-replica.html "15.4.2.5 STOP REPLICA Statement")are disallowed for the
`group_replication_recovery` and
`group_replication_applier` channels.
[`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.36 SHOW REPLICA STATUS Statement") is also not
allowed with the `group_replication_applier`
channel.

[`FLUSH RELAY LOGS`](flush.html "15.7.8.3 FLUSH Statement")
is allowed for the `group_replication_applier`
channel, but if the request is received while a transaction is
being applied, the request is not performed until after the
transaction ends. The requester must wait while the transaction is
completed and the rotation takes place. This prevents transactions
from being split, which is not allowed for Group Replication.