#### 21.7.9.2 Point-In-Time Recovery Using NDB Cluster Replication

Point-in-time recovery—that is, recovery of data changes made since a given point in time—is performed after restoring a full backup that returns the server to its state when the backup was made. Performing point-in-time recovery of NDB Cluster tables with NDB Cluster and NDB Cluster Replication can be accomplished using a native [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") data backup (taken by issuing [`CREATE BACKUP`](mysql-cluster-mgm-client-commands.html#ndbclient-create-nodegroup) in the [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") client) and restoring the `ndb_binlog_index` table (from a dump made using [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program")).

To perform point-in-time recovery of NDB Cluster, it is necessary to follow the steps shown here:

1. Back up all `NDB` databases in the cluster, using the [`START BACKUP`](mysql-cluster-backup-using-management-client.html "21.6.8.2 Using The NDB Cluster Management Client to Create a Backup") command in the [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") client (see [Section 21.6.8, “Online Backup of NDB Cluster”](mysql-cluster-backup.html "21.6.8 Online Backup of NDB Cluster")).

2. At some later point, prior to restoring the cluster, make a backup of the `mysql.ndb_binlog_index` table. It is probably simplest to use [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") for this task. Also back up the binary log files at this time.

   This backup should be updated regularly—perhaps even hourly—depending on your needs.

3. (*Catastrophic failure or error occurs*.)
4. Locate the last known good backup.
5. Clear the data node file systems (using [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial) or [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial)).

   Note

   NDB Cluster Disk Data tablespace and log files are not removed by [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial). You must delete these manually.

6. Use [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement") or [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") with the `mysql.ndb_binlog_index` table.

7. Execute [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup"), restoring all data. You must include the [`--restore-epoch`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_restore-epoch) option when you run [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup"), so that the `ndb_apply_status` table is populated correctly. (See [Section 21.5.24, “ndb_restore — Restore an NDB Cluster Backup”](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup"), for more information.)

8. Restore the `ndb_binlog_index` table from the output of [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") and restore the binary log files from backup, if necessary.

9. Find the epoch applied most recently—that is, the maximum `epoch` column value in the `ndb_apply_status` table—as the user variable `@LATEST_EPOCH` (emphasized):

   ```sql
   SELECT @LATEST_EPOCH:=MAX(epoch)
       FROM mysql.ndb_apply_status;
   ```

10. Find the latest binary log file (`@FIRST_FILE`) and position (`Position` column value) within this file that correspond to `@LATEST_EPOCH` in the `ndb_binlog_index` table:

    ```sql
    SELECT Position, @FIRST_FILE:=File
        FROM mysql.ndb_binlog_index
        WHERE epoch > @LATEST_EPOCH ORDER BY epoch ASC LIMIT 1;
    ```

11. Using [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files"), replay the binary log events from the given file and position up to the point of the failure. (See [Section 4.6.7, “mysqlbinlog — Utility for Processing Binary Log Files”](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files").)

See also [Section 7.5, “Point-in-Time (Incremental) Recovery”](point-in-time-recovery.html "7.5 Point-in-Time (Incremental) Recovery"), for more information about the binary log, replication, and incremental recovery.
