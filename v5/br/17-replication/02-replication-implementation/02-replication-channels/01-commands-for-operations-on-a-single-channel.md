#### 16.2.2.1 Commands for Operations on a Single Channel

To enable MySQL replication operations to act on individual replication channels, use the `FOR CHANNEL channel` clause with the following replication statements:

* [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement")
* [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement")
* [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement")
* [`SHOW RELAYLOG EVENTS`](show-relaylog-events.html "13.7.5.32 SHOW RELAYLOG EVENTS Statement")
* [`FLUSH RELAY LOGS`](flush.html "13.7.6.3 FLUSH Statement")

* [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement")
* [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement")

Similarly, an additional `channel` parameter is introduced for the following functions:

* [`MASTER_POS_WAIT()`](miscellaneous-functions.html#function_master-pos-wait)
* [`WAIT_UNTIL_SQL_THREAD_AFTER_GTIDS()`](gtid-functions.html#function_wait-until-sql-thread-after-gtids)

The following statements are disallowed for the `group_replication_recovery` channel:

* [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement")
* [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement")

The following statements are disallowed for the `group_replication_applier` channel:

* [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement")
* [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement")
* [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement")
* [`FLUSH RELAY LOGS`](flush.html "13.7.6.3 FLUSH Statement")
