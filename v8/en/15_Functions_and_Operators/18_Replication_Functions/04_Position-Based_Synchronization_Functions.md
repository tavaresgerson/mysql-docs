### 14.18.4 Position-Based Synchronization Functions

The functions listed in this section are used for controlling position-based synchronization of source and replica servers in MySQL Replication.

**Table 14.28 Positional Synchronization Functions**

<table summary="A reference that lists functions used with position-based synchronization of replication source and replica servers."><thead><tr><th>Name</th> <th>Description</th> <th>Introduced</th> <th>Deprecated</th> </tr></thead><tbody><tr><th><code>MASTER_POS_WAIT()</code></th> <td> Block until the replica has read and applied all updates up to the specified position </td> <td></td> <td>8.0.26</td> </tr><tr><th><code>SOURCE_POS_WAIT()</code></th> <td> Block until the replica has read and applied all updates up to the specified position </td> <td>8.0.26</td> <td></td> </tr></tbody></table>

* `MASTER_POS_WAIT(log_name,log_pos[,timeout][,channel])`

  This function is for control of source-replica synchronization. It blocks until the replica has read and applied all updates up to the specified position in the source's binary log. From MySQL 8.0.26, `MASTER_POS_WAIT()` is deprecated and the alias `SOURCE_POS_WAIT()` should be used instead. In releases before MySQL 8.0.26, use `MASTER_POS_WAIT()`.

  The return value is the number of log events the replica had to wait for to advance to the specified position. The function returns `NULL` if the replication SQL thread is not started, the replica's source information is not initialized, the arguments are incorrect, or an error occurs. It returns `-1` if the timeout has been exceeded. If the replication SQL thread stops while `MASTER_POS_WAIT()` is waiting, the function returns `NULL`. If the replica is past the specified position, the function returns immediately.

  If the binary log file position has been marked as invalid, the function waits until a valid file position is known. The binary log file position can be marked as invalid when the `CHANGE REPLICATION SOURCE TO` option `GTID_ONLY` is set for the replication channel, and the server is restarted or replication is stopped. The file position becomes valid after a transaction is successfully applied past the given file position. If the applier does not reach the stated position, the function waits until the timeout. Use a `SHOW REPLICA STATUS` statement to check if the binary log file position has been marked as invalid.

  On a multithreaded replica, the function waits until expiry of the limit set by the `replica_checkpoint_group`, `slave_checkpoint_group`, `replica_checkpoint_period` or `slave_checkpoint_period` system variable, when the checkpoint operation is called to update the status of the replica. Depending on the setting for the system variables, the function might therefore return some time after the specified position was reached.

  If binary log transaction compression is in use and the transaction payload at the specified position is compressed (as a `Transaction_payload_event`), the function waits until the whole transaction has been read and applied, and the positions have updated.

  If a *`timeout`* value is specified, `MASTER_POS_WAIT()` stops waiting when *`timeout`* seconds have elapsed. *`timeout`* must be greater than or equal to 0. (When the server is running in strict SQL mode, a negative *`timeout`* value is immediately rejected with `ER_WRONG_ARGUMENTS`; otherwise the function returns **`NULL`**, and raises a warning.)

  The optional *`channel`* value enables you to name which replication channel the function applies to. See Section 19.2.2, “Replication Channels” for more information.

  This function is unsafe for statement-based replication. A warning is logged if you use this function when `binlog_format` is set to `STATEMENT`.

* `SOURCE_POS_WAIT(log_name,log_pos[,timeout][,channel])`

  This function is for control of source-replica synchronization. It blocks until the replica has read and applied all updates up to the specified position in the source's binary log. From MySQL 8.0.26, use `SOURCE_POS_WAIT()` in place of `MASTER_POS_WAIT()`, which is deprecated from that release. In releases before MySQL 8.0.26, use `MASTER_POS_WAIT()`.

  The return value is the number of log events the replica had to wait for to advance to the specified position. The function returns `NULL` if the replication SQL thread is not started, the replica's source information is not initialized, the arguments are incorrect, or an error occurs. It returns `-1` if the timeout has been exceeded. If the replication SQL thread stops while `SOURCE_POS_WAIT()` is waiting, the function returns `NULL`. If the replica is past the specified position, the function returns immediately.

  If the binary log file position has been marked as invalid, the function waits until a valid file position is known. The binary log file position can be marked as invalid when the `CHANGE REPLICATION SOURCE TO` option `GTID_ONLY` is set for the replication channel, and the server is restarted or replication is stopped. The file position becomes valid after a transaction is successfully applied past the given file position. If the applier does not reach the stated position, the function waits until the timeout. Use a `SHOW REPLICA STATUS` statement to check if the binary log file position has been marked as invalid.

  On a multithreaded replica, the function waits until expiry of the limit set by the `replica_checkpoint_group` or `replica_checkpoint_period` system variable, when the checkpoint operation is called to update the status of the replica. Depending on the setting for the system variables, the function might therefore return some time after the specified position was reached.

  If binary log transaction compression is in use and the transaction payload at the specified position is compressed (as a `Transaction_payload_event`), the function waits until the whole transaction has been read and applied, and the positions have updated.

  If a *`timeout`* value is specified, `SOURCE_POS_WAIT()` stops waiting when *`timeout`* seconds have elapsed. *`timeout`* must be greater than or equal to 0. (In strict SQL mode, a negative *`timeout`* value is immediately rejected with `ER_WRONG_ARGUMENTS`; otherwise the function returns `NULL`, and raises a warning.)

  The optional *`channel`* value enables you to name which replication channel the function applies to. See Section 19.2.2, “Replication Channels” for more information.

  This function is unsafe for statement-based replication. A warning is logged if you use this function when `binlog_format` is set to `STATEMENT`.
