#### 19.2.2.1 Commands for Operations on a Single Channel

To enable MySQL replication operations to act on individual replication channels, use the `FOR CHANNEL channel` clause with the following replication statements:

* `CHANGE REPLICATION SOURCE TO`
* `START REPLICA`
* `STOP REPLICA`
* `SHOW RELAYLOG EVENTS`
* `FLUSH RELAY LOGS`

* `SHOW REPLICA STATUS`
* `RESET REPLICA`

The `SOURCE_POS_WAIT()` function has a `channel` parameter.

`START REPLICA` and `STOP REPLICA`are disallowed for the `group_replication_recovery` and `group_replication_applier` channels. `SHOW REPLICA STATUS` is also not allowed with the `group_replication_applier` channel.

`FLUSH RELAY LOGS` is allowed for the `group_replication_applier` channel, but if the request is received while a transaction is being applied, the request is not performed until after the transaction ends. The requester must wait while the transaction is completed and the rotation takes place. This prevents transactions from being split, which is not allowed for Group Replication.
