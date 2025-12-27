### 16.4.4 Troubleshooting Replication

If you have followed the instructions but your replication setup is not working, the first thing to do is *check the error log for messages*. Many users have lost time by not doing this soon enough after encountering problems.

If you cannot tell from the error log what the problem was, try the following techniques:

* Verify that the source has binary logging enabled by issuing a [`SHOW MASTER STATUS`](show-master-status.html "13.7.5.23 SHOW MASTER STATUS Statement") statement. If logging is enabled, `Position` is nonzero. If binary logging is not enabled, verify that you are running the source server with the [`--log-bin`](replication-options-binary-log.html#option_mysqld_log-bin) option.

* Verify that the [`server_id`](replication-options.html#sysvar_server_id) system variable was set at startup on both the source and replica and that the ID value is unique on each server.

* Verify that the replica is running. Use [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") to check whether the `Slave_IO_Running` and `Slave_SQL_Running` values are both `Yes`. If not, verify the options that were used when starting the replica server. For example, [`--skip-slave-start`](replication-options-replica.html#option_mysqld_skip-slave-start) prevents the replica threads from starting until you issue a [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") statement.

* If the replica is running, check whether it established a connection to the source. Use [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement"), find the I/O and SQL threads and check their `State` column to see what they display. See [Section 16.2.3, “Replication Threads”](replication-threads.html "16.2.3 Replication Threads"). If the replication I/O thread state says `Connecting to master`, check the following:

  + Verify the privileges for the user being used for replication on the source.

  + Check that the host name of the source is correct and that you are using the correct port to connect to the source. The port used for replication is the same as used for client network communication (the default is `3306`). For the host name, ensure that the name resolves to the correct IP address.

  + Check the configuration file to see whether the [`skip_networking`](server-system-variables.html#sysvar_skip_networking) system variable has been enabled on the source or replica to disable networking. If so, comment the setting or remove it.

  + If the source has a firewall or IP filtering configuration, ensure that the network port being used for MySQL is not being filtered.

  + Check that you can reach the source by using `ping` or `traceroute`/`tracert` to reach the host.

* If the replica was running previously but has stopped, the reason usually is that some statement that succeeded on the source failed on the replica. This should never happen if you have taken a proper snapshot of the source, and never modified the data on the replica outside of the replication threads. If the replica stops unexpectedly, it is a bug or you have encountered one of the known replication limitations described in [Section 16.4.1, “Replication Features and Issues”](replication-features.html "16.4.1 Replication Features and Issues"). If it is a bug, see [Section 16.4.5, “How to Report Replication Bugs or Problems”](replication-bugs.html "16.4.5 How to Report Replication Bugs or Problems"), for instructions on how to report it.

* If a statement that succeeded on the source refuses to run on the replica, try the following procedure if it is not feasible to do a full database resynchronization by deleting the replica's databases and copying a new snapshot from the source:

  1. Determine whether the affected table on the replica is different from the table on the source. Try to understand how this happened. Then make the replica's table identical to the source's and run [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement").

  2. If the preceding step does not work or does not apply, try to understand whether it would be safe to make the update manually (if needed) and then ignore the next statement from the source.

  3. If you decide that the replica can skip the next statement from the source, issue the following statements:

     ```sql
     mysql> SET GLOBAL sql_slave_skip_counter = N;
     mysql> START SLAVE;
     ```

     The value of *`N`* should be 1 if the next statement from the source does not use `AUTO_INCREMENT` or [`LAST_INSERT_ID()`](information-functions.html#function_last-insert-id). Otherwise, the value should be 2. The reason for using a value of 2 for statements that use `AUTO_INCREMENT` or [`LAST_INSERT_ID()`](information-functions.html#function_last-insert-id) is that they take two events in the binary log of the source.

     See also [Section 13.4.2.4, “SET GLOBAL sql\_slave\_skip\_counter Syntax”](set-global-sql-slave-skip-counter.html "13.4.2.4 SET GLOBAL sql_slave_skip_counter Syntax").

  4. If you are sure that the replica started out perfectly synchronized with the source, and that no one has updated the tables involved outside of the replication threads, then presumably the discrepancy is the result of a bug. If you are running the most recent version of MySQL, please report the problem. If you are running an older version, try upgrading to the latest production release to determine whether the problem persists.
