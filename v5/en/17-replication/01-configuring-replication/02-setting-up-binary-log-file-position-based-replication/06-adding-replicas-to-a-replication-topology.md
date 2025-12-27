#### 16.1.2.6 Adding Replicas to a Replication Topology

You can add another replica to an existing replication configuration without stopping the source server. To do this, you can set up the new replica by copying the data directory of an existing replica, and giving the new replica a different server ID (which is user-specified) and server UUID (which is generated at startup).

To duplicate an existing replica:

1. Stop the existing replica and record the replica status information, particularly the source's binary log file and relay log file positions. You can view the replica status either in the Performance Schema replication tables (see [Section 25.12.11, “Performance Schema Replication Tables”](performance-schema-replication-tables.html "25.12.11 Performance Schema Replication Tables")), or by issuing [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") as follows:

   ```sql
   mysql> STOP SLAVE;
   mysql> SHOW SLAVE STATUS\G
   ```

2. Shut down the existing replica:

   ```sql
   $> mysqladmin shutdown
   ```

3. Copy the data directory from the existing replica to the new replica, including the log files and relay log files. You can do this by creating an archive using **tar** or `WinZip`, or by performing a direct copy using a tool such as **cp** or **rsync**.

   Important

   * Before copying, verify that all the files relating to the existing replica actually are stored in the data directory. For example, the `InnoDB` system tablespace, undo tablespace, and redo log might be stored in an alternative location. `InnoDB` tablespace files and file-per-table tablespaces might have been created in other directories. The binary logs and relay logs for the replica might be in their own directories outside the data directory. Check through the system variables that are set for the existing replica and look for any alternative paths that have been specified. If you find any, copy these directories over as well.

   * During copying, if files have been used for the replication metadata repositories (see [Section 16.2.4, “Relay Log and Replication Metadata Repositories”](replica-logs.html "16.2.4 Relay Log and Replication Metadata Repositories")), which is the default in MySQL 5.7, ensure that you also copy these files from the existing replica to the new replica. If tables have been used for the repositories, the tables are in the data directory.

   * After copying, delete the `auto.cnf` file from the copy of the data directory on the new replica, so that the new replica is started with a different generated server UUID. The server UUID must be unique.

   A common problem that is encountered when adding new replicas is that the new replica fails with a series of warning and error messages like these:

   ```sql
   071118 16:44:10 [Warning] Neither --relay-log nor --relay-log-index were used; so
   replication may break when this MySQL server acts as a slave and has his hostname
   changed!! Please use '--relay-log=new_replica_hostname-relay-bin' to avoid this problem.
   071118 16:44:10 [ERROR] Failed to open the relay log './old_replica_hostname-relay-bin.003525'
   (relay_log_pos 22940879)
   071118 16:44:10 [ERROR] Could not find target log during relay log initialization
   071118 16:44:10 [ERROR] Failed to initialize the master info structure
   ```

   This situation can occur if the [`relay_log`](replication-options-replica.html#sysvar_relay_log) system variable is not specified, as the relay log files contain the host name as part of their file names. This is also true of the relay log index file if the [`relay_log_index`](replication-options-replica.html#sysvar_relay_log_index) system variable is not used. For more information about these variables, see [Section 16.1.6, “Replication and Binary Logging Options and Variables”](replication-options.html "16.1.6 Replication and Binary Logging Options and Variables").

   To avoid this problem, use the same value for [`relay_log`](replication-options-replica.html#sysvar_relay_log) on the new replica that was used on the existing replica. If this option was not set explicitly on the existing replica, use `existing_replica_hostname-relay-bin`. If this is not possible, copy the existing replica's relay log index file to the new replica and set the [`relay_log_index`](replication-options-replica.html#sysvar_relay_log_index) system variable on the new replica to match what was used on the existing replica. If this option was not set explicitly on the existing replica, use `existing_replica_hostname-relay-bin.index`. Alternatively, if you have already tried to start the new replica after following the remaining steps in this section and have encountered errors like those described previously, then perform the following steps:

   1. If you have not already done so, issue [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") on the new replica.

      If you have already started the existing replica again, issue [`STOP SLAVE`](stop-slave.html "13.4.2.6 STOP SLAVE Statement") on the existing replica as well.

   2. Copy the contents of the existing replica's relay log index file into the new replica's relay log index file, making sure to overwrite any content already in the file.

   3. Proceed with the remaining steps in this section.
4. When copying is complete, restart the existing replica.
5. On the new replica, edit the configuration and give the new replica a unique server ID (using the [`server_id`](replication-options.html#sysvar_server_id) system variable) that is not used by the source or any of the existing replicas.

6. Start the new replica server, specifying the [`--skip-slave-start`](replication-options-replica.html#option_mysqld_skip-slave-start) option so that replication does not start yet. Use the Performance Schema replication tables or issue [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") to confirm that the new replica has the correct settings when compared with the existing replica. Also display the server ID and server UUID and verify that these are correct and unique for the new replica.

7. Start the replication threads by issuing a [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") statement:

   ```sql
   mysql> START SLAVE;
   ```

   The new replica now uses the information in its connection metadata repository to start the replication process.
