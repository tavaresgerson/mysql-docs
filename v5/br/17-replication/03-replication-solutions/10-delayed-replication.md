### 16.3.10 Delayed Replication

MySQL 5.7 supports delayed replication such that a replica server deliberately lags behind the source by at least a specified amount of time. The default delay is 0 seconds. Use the `MASTER_DELAY` option for [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") to set the delay to *`N`* seconds:

```sql
CHANGE MASTER TO MASTER_DELAY = N;
```

An event received from the source is not executed until at least *`N`* seconds later than its execution on the source. The exceptions are that there is no delay for format description events or log file rotation events, which affect only the internal state of the SQL thread.

Delayed replication can be used for several purposes:

* To protect against user mistakes on the source. A DBA can roll back a delayed replica to the time just before the disaster.

* To test how the system behaves when there is a lag. For example, in an application, a lag might be caused by a heavy load on the replica. However, it can be difficult to generate this load level. Delayed replication can simulate the lag without having to simulate the load. It can also be used to debug conditions related to a lagging replica.

* To inspect what the database looked like long ago, without having to reload a backup. For example, if the delay is one week and the DBA needs to see what the database looked like before the last few days' worth of development, the delayed replica can be inspected.

[`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") and [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") take effect immediately and ignore any delay. [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") resets the delay to 0.

[`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") has three fields that provide information about the delay:

* `SQL_Delay`: A nonnegative integer indicating the number of seconds that the replica must lag the source.

* `SQL_Remaining_Delay`: When `Slave_SQL_Running_State` is `Waiting until MASTER_DELAY seconds after master executed event`, this field contains an integer indicating the number of seconds left of the delay. At other times, this field is `NULL`.

* `Slave_SQL_Running_State`: A string indicating the state of the SQL thread (analogous to `Slave_IO_State`). The value is identical to the `State` value of the SQL thread as displayed by [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement").

When the replication SQL thread is waiting for the delay to elapse before executing an event, [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") displays its `State` value as `Waiting until MASTER_DELAY seconds after master executed event`.
