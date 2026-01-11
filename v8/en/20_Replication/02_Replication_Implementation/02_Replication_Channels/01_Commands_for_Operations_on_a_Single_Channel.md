#### 19.2.2.1 Commands for Operations on a Single Channel

To enable MySQL replication operations to act on individual replication channels, use the `FOR CHANNEL channel` clause with the following replication statements:

* `CHANGE REPLICATION SOURCE TO`
* `CHANGE MASTER TO`
* `START REPLICA` (or before MySQL 8.0.22, `START SLAVE`)

* `STOP REPLICA` (or before MySQL 8.0.22, `STOP SLAVE`)

* `SHOW RELAYLOG EVENTS`
* `FLUSH RELAY LOGS`
* `SHOW REPLICA STATUS` (or before MySQL 8.0.22, `SHOW SLAVE STATUS`)

* `RESET REPLICA` (or before MySQL 8.0.22, `RESET SLAVE`)

The following functions have a `channel` parameter:

* `MASTER_POS_WAIT()`
* `SOURCE_POS_WAIT()`

The following statements are disallowed for the `group_replication_recovery` channel:

* `START REPLICA`
* `STOP REPLICA`

The following statements are disallowed for the `group_replication_applier` channel:

* `START REPLICA`
* `STOP REPLICA`
* `SHOW REPLICA STATUS`

`FLUSH RELAY LOGS` is now permitted for the `group_replication_applier` channel, but if the request is received while a transaction is being applied, the request is performed after the transaction ends. The requester must wait while the transaction is completed and the rotation takes place. This behavior prevents transactions from being split, which is not permitted for Group Replication.
