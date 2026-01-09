### 21.7.9 NDB Cluster Backups With NDB Cluster Replication

[21.7.9.1 NDB Cluster Replication: Automating Synchronization of the Replica to the Source Binary Log](mysql-cluster-replication-auto-sync.html)

[21.7.9.2 Point-In-Time Recovery Using NDB Cluster Replication](mysql-cluster-replication-pitr.html)

This section discusses making backups and restoring from them using NDB Cluster replication. We assume that the replication servers have already been configured as covered previously (see [Section 21.7.5, “Preparing the NDB Cluster for Replication”](mysql-cluster-replication-preparation.html "21.7.5 Preparing the NDB Cluster for Replication"), and the sections immediately following). This having been done, the procedure for making a backup and then restoring from it is as follows:

1. There are two different methods by which the backup may be started.

   * **Method A.** This method requires that the cluster backup process was previously enabled on the source server, prior to starting the replication process. This can be done by including the following line in a `[mysql_cluster]` section in the `my.cnf file`, where *`management_host`* is the IP address or host name of the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") management server for the source cluster, and *`port`* is the management server's port number:

     ```sql
     ndb-connectstring=management_host[:port]
     ```

     Note

     The port number needs to be specified only if the default port (1186) is not being used. See [Section 21.3.3, “Initial Configuration of NDB Cluster”](mysql-cluster-install-configuration.html "21.3.3 Initial Configuration of NDB Cluster"), for more information about ports and port allocation in NDB Cluster.

     In this case, the backup can be started by executing this statement on the replication source:

     ```sql
     shellS> ndb_mgm -e "START BACKUP"
     ```

   * **Method B.** If the `my.cnf` file does not specify where to find the management host, you can start the backup process by passing this information to the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") management client as part of the [`START BACKUP`](mysql-cluster-backup-using-management-client.html "21.6.8.2 Using The NDB Cluster Management Client to Create a Backup") command. This can be done as shown here, where *`management_host`* and *`port`* are the host name and port number of the management server:

     ```sql
     shellS> ndb_mgm management_host:port -e "START BACKUP"
     ```

     In our scenario as outlined earlier (see [Section 21.7.5, “Preparing the NDB Cluster for Replication”](mysql-cluster-replication-preparation.html "21.7.5 Preparing the NDB Cluster for Replication")), this would be executed as follows:

     ```sql
     shellS> ndb_mgm rep-source:1186 -e "START BACKUP"
     ```

2. Copy the cluster backup files to the replica that is being brought on line. Each system running an [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") process for the source cluster has cluster backup files located on it, and *all* of these files must be copied to the replica to ensure a successful restore. The backup files can be copied into any directory on the computer where the replica's management host resides, as long as the MySQL and NDB binaries have read permissions in that directory. In this case, we assume that these files have been copied into the directory `/var/BACKUPS/BACKUP-1`.

   While it is not necessary that the replica cluster have the same number of [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") processes (data nodes) as the source, it is highly recommended this number be the same. It *is* necessary that the replica be started with the [`--skip-slave-start`](replication-options-replica.html#option_mysqld_skip-slave-start) option, to prevent premature startup of the replication process.

3. Create any databases on the replica cluster that are present on the source cluster and that are to be replicated.

   Important

   A [`CREATE DATABASE`](create-database.html "13.1.11 CREATE DATABASE Statement") (or [`CREATE SCHEMA`](create-database.html "13.1.11 CREATE DATABASE Statement")) statement corresponding to each database to be replicated must be executed on each SQL node in the replica cluster.

4. Reset the replica cluster using this statement in the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client:

   ```sql
   mysqlR> RESET SLAVE;
   ```

5. You can now start the cluster restoration process on the replica using the [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") command for each backup file in turn. For the first of these, it is necessary to include the `-m` option to restore the cluster metadata, as shown here:

   ```sql
   shellR> ndb_restore -c replica_host:port -n node-id \
           -b backup-id -m -r dir
   ```

   *`dir`* is the path to the directory where the backup files have been placed on the replica. For the [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") commands corresponding to the remaining backup files, the `-m` option should *not* be used.

   For restoring from a source cluster with four data nodes (as shown in the figure in [Section 21.7, “NDB Cluster Replication”](mysql-cluster-replication.html "21.7 NDB Cluster Replication")) where the backup files have been copied to the directory `/var/BACKUPS/BACKUP-1`, the proper sequence of commands to be executed on the replica might look like this:

   ```sql
   shellR> ndb_restore -c replica-host:1186 -n 2 -b 1 -m \
           -r ./var/BACKUPS/BACKUP-1
   shellR> ndb_restore -c replica-host:1186 -n 3 -b 1 \
           -r ./var/BACKUPS/BACKUP-1
   shellR> ndb_restore -c replica-host:1186 -n 4 -b 1 \
           -r ./var/BACKUPS/BACKUP-1
   shellR> ndb_restore -c replica-host:1186 -n 5 -b 1 -e \
           -r ./var/BACKUPS/BACKUP-1
   ```

   Important

   The `-e` (or [`--restore-epoch`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_restore-epoch)) option in the final invocation of [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") in this example is required to make sure that the epoch is written to the replica's `mysql.ndb_apply_status` table. Without this information, the replica cannot synchronize properly with the source. (See [Section 21.5.24, “ndb_restore — Restore an NDB Cluster Backup”](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup").)

6. Now you need to obtain the most recent epoch from the `ndb_apply_status` table on the replica (as discussed in [Section 21.7.8, “Implementing Failover with NDB Cluster Replication”](mysql-cluster-replication-failover.html "21.7.8 Implementing Failover with NDB Cluster Replication")):

   ```sql
   mysqlR> SELECT @latest:=MAX(epoch)
           FROM mysql.ndb_apply_status;
   ```

7. Using `@latest` as the epoch value obtained in the previous step, you can obtain the correct starting position `@pos` in the correct binary log file `@file` from the `mysql.ndb_binlog_index` table on the source. The query shown here gets these from the `next_position` and `next_file` columns from the last epoch applied before the logical restore position:

   ```sql
   mysqlS> SELECT
        ->     @file:=SUBSTRING_INDEX(next_file, '/', -1),
        ->     @pos:=next_position
        -> FROM mysql.ndb_binlog_index
        -> WHERE epoch > @latest
        -> ORDER BY epoch ASC LIMIT 1;
   ```

   In the event that there is currently no replication traffic, you can get similar information by running [`SHOW MASTER STATUS`](show-master-status.html "13.7.5.23 SHOW MASTER STATUS Statement") on the source and using the value shown in the `Position` column of the output for the file whose name has the suffix with the greatest value for all files shown in the `File` column. In this case, you must determine which file this is and supply the name in the next step manually or by parsing the output with a script.

8. Using the values obtained in the previous step, you can now issue the appropriate [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement in the replica's [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client:

   ```sql
   mysqlR> CHANGE MASTER TO
        ->     MASTER_LOG_FILE='@file',
        ->     MASTER_LOG_POS=@pos;
   ```

9. Now that the replica knows from what point in which binary log file to start reading data from the source, you can cause the replica to begin replicating with this statement:

   ```sql
   mysqlR> START SLAVE;
   ```

To perform a backup and restore on a second replication channel, it is necessary only to repeat these steps, substituting the host names and IDs of the secondary source and replica for those of the primary source and replica servers where appropriate, and running the preceding statements on them.

For additional information on performing Cluster backups and restoring Cluster from backups, see [Section 21.6.8, “Online Backup of NDB Cluster”](mysql-cluster-backup.html "21.6.8 Online Backup of NDB Cluster").
