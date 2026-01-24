#### 16.4.1.32 Replication and Transaction Inconsistencies

Inconsistencies in the sequence of transactions that have been executed from the relay log can occur depending on your replication configuration. This section explains how to avoid inconsistencies and solve any problems they cause.

The following types of inconsistencies can exist:

* *Half-applied transactions*. A transaction which updates non-transactional tables has applied some but not all of its changes.

* *Gaps*. A gap is a transaction that has not been fully applied, even though some transaction later in the sequence has been applied. Gaps can only appear when using a multithreaded replica. To avoid gaps occurring, set [`slave_preserve_commit_order=1`](replication-options-replica.html#sysvar_slave_preserve_commit_order), which requires [`slave_parallel_type=LOGICAL_CLOCK`](replication-options-replica.html#sysvar_slave_parallel_type), and that [`log-bin`](replication-options-binary-log.html#sysvar_log_bin) and [`log-slave-updates`](replication-options-binary-log.html#sysvar_log_slave_updates) are also enabled. Note that [`slave_preserve_commit_order=1`](replication-options-replica.html#sysvar_slave_preserve_commit_order) does not preserve the order of non-transactional DML updates, so these might commit before transactions that precede them in the relay log, which might result in gaps.

* *Source binary log position lag*. Even in the absence of gaps, it is possible that transactions after `Exec_master_log_pos` have been applied. That is, all transactions up to point `N` have been applied, and no transactions after `N` have been applied, but `Exec_master_log_pos` has a value smaller than `N`. In this situation, `Exec_master_log_pos` is a “low-water mark” of the transactions applied, and lags behind the position of the most recently applied transaction. This can only happen on multithreaded replicas. Enabling [`slave_preserve_commit_order`](replication-options-replica.html#sysvar_slave_preserve_commit_order) does not prevent source binary log position lag.

The following scenarios are relevant to the existence of half-applied transactions, gaps, and source binary log position lag:

1. While replication threads are running, there may be gaps and half-applied transactions.

2. [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") shuts down. Both clean and unclean shutdown abort ongoing transactions and may leave gaps and half-applied transactions.

3. [`KILL`](kill.html "13.7.6.4 KILL Statement") of replication threads (the SQL thread when using a single-threaded replica, the coordinator thread when using a multithreaded replica). This aborts ongoing transactions and may leave gaps and half-applied transactions.

4. Error in applier threads. This may leave gaps. If the error is in a mixed transaction, that transaction is half-applied. When using a multithreaded replica, workers which have not received an error complete their queues, so it may take time to stop all threads.

5. [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") when using a multithreaded replica. After issuing [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement"), the replica waits for any gaps to be filled and then updates `Exec_master_log_pos`. This ensures it never leaves gaps or source binary log position lag, unless any of the cases above applies, in other words, before [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") completes, either an error happens, or another thread issues [`KILL`](kill.html "13.7.6.4 KILL Statement"), or the server restarts. In these cases, [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") returns successfully.

6. If the last transaction in the relay log is only half-received and the multithreaded replica coordinator has started to schedule the transaction to a worker, then [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") waits up to 60 seconds for the transaction to be received. After this timeout, the coordinator gives up and aborts the transaction. If the transaction is mixed, it may be left half-completed.

7. [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") when the ongoing transaction updates transactional tables only, in which case it is rolled back and [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") stops immediately. If the ongoing transaction is mixed, [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") waits up to 60 seconds for the transaction to complete. After this timeout, it aborts the transaction, so it may be left half-completed.

The global variable [`rpl_stop_slave_timeout`](replication-options-replica.html#sysvar_rpl_stop_slave_timeout) is unrelated to the process of stopping the replication threads. It only makes the client that issues [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") return to the client, but the replication threads continue to try to stop.

If a replication channel has gaps, it has the following consequences:

1. The replica database is in a state that may never have existed on the source.

2. The field `Exec_master_log_pos` in [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") is only a “low-water mark”. In other words, transactions appearing before the position are guaranteed to have committed, but transactions after the position may have committed or not.

3. [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statements for that channel fail with an error, unless the applier threads are running and the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement only sets receiver options.

4. If [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") is started with [`--relay-log-recovery`](replication-options-replica.html#sysvar_relay_log_recovery), no recovery is done for that channel, and a warning is printed.

5. If [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") is used with [`--dump-slave`](mysqldump.html#option_mysqldump_dump-slave), it does not record the existence of gaps; thus it prints [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") with `RELAY_LOG_POS` set to the “low-water mark” position in `Exec_master_log_pos`.

   After applying the dump on another server, and starting the replication threads, transactions appearing after the position are replicated again. Note that this is harmless if GTIDs are enabled (however, in that case it is not recommended to use [`--dump-slave`](mysqldump.html#option_mysqldump_dump-slave)).

If a replication channel has source binary log position lag but no gaps, cases 2 to 5 above apply, but case 1 does not.

The source binary log position information is persisted in binary format in the internal table `mysql.slave_worker_info`. [`START SLAVE [SQL_THREAD]`](start-slave.html "13.4.2.5 START SLAVE Statement") always consults this information so that it applies only the correct transactions. This remains true even if [`slave_parallel_workers`](replication-options-replica.html#sysvar_slave_parallel_workers) has been changed to 0 before [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement"), and even if [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") is used with `UNTIL` clauses. [`START SLAVE UNTIL SQL_AFTER_MTS_GAPS`](start-slave.html "13.4.2.5 START SLAVE Statement") only applies as many transactions as needed in order to fill in the gaps. If [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") is used with `UNTIL` clauses that tell it to stop before it has consumed all the gaps, then it leaves remaining gaps.

Warning

[`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") removes the relay logs and resets the replication position. Thus issuing [`RESET SLAVE`](reset-slave.html "13.4.2.3 RESET SLAVE Statement") on a replica with gaps means the replica loses any information about the gaps, without correcting the gaps.

When GTID-based replication is in use, from MySQL 5.7.28 a multithreaded replica checks first whether `MASTER_AUTO_POSITION` is set to `ON`, and if it is, omits the step of calculating the transactions that should be skipped or not skipped. In that situation, the old relay logs are not required for the recovery process.
