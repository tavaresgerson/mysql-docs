### 25.7.5 Preparing the NDB Cluster for Replication

Preparing the NDB Cluster for replication consists of the following steps:

1. Check all MySQL servers for version compatibility (see Section 25.7.2, “General Requirements for NDB Cluster Replication”).

2. Create a replication account on the source Cluster with the appropriate privileges, using the following two SQL statements:

   ```
   mysqlS> CREATE USER 'replica_user'@'replica_host'
        -> IDENTIFIED BY 'replica_password';

   mysqlS> GRANT REPLICATION SLAVE ON *.*
        -> TO 'replica_user'@'replica_host';
   ```

   In the previous statement, *`replica_user`* is the replication account user name, *`replica_host`* is the host name or IP address of the replica, and *`replica_password`* is the password to assign to this account.

   For example, to create a replica user account with the name `myreplica`, logging in from the host named `replica-host`, and using the password `53cr37`, use the following `CREATE USER` and `GRANT` statements:

   ```
   mysqlS> CREATE USER 'myreplica'@'replica-host'
        -> IDENTIFIED BY '53cr37';

   mysqlS> GRANT REPLICATION SLAVE ON *.*
        -> TO 'myreplica'@'replica-host';
   ```

   For security reasons, it is preferable to use a unique user account—not employed for any other purpose—for the replication account.

3. Set up the replica to use the source. Using the **mysql** client, this can be accomplished with the `CHANGE REPLICATION SOURCE TO` statement (beginning with NDB 8.0.23) or `CHANGE MASTER TO` statement (prior to NDB 8.0.23):

   ```
   mysqlR> CHANGE MASTER TO
        -> MASTER_HOST='source_host',
        -> MASTER_PORT=source_port,
        -> MASTER_USER='replica_user',
        -> MASTER_PASSWORD='replica_password';
   ```

   Beginning with NDB 8.0.23, you can also use the following statement:

   ```
   mysqlR> CHANGE REPLICATION SOURCE TO
        -> SOURCE_HOST='source_host',
        -> SOURCE_PORT=source_port,
        -> SOURCE_USER='replica_user',
        -> SOURCE_PASSWORD='replica_password';
   ```

   In the previous statement, *`source_host`* is the host name or IP address of the replication source, *`source_port`* is the port for the replica to use when connecting to the source, *`replica_user`* is the user name set up for the replica on the source, and *`replica_password`* is the password set for that user account in the previous step.

   For example, to tell the replica to use the MySQL server whose host name is `rep-source` with the replication account created in the previous step, use the following statement:

   ```
   mysqlR> CHANGE MASTER TO
        -> MASTER_HOST='rep-source',
        -> MASTER_PORT=3306,
        -> MASTER_USER='myreplica',
        -> MASTER_PASSWORD='53cr37';
   ```

   Beginning with NDB 8.0.23, you can also use the following statement:

   ```
   mysqlR> CHANGE REPLICATION SOURCE TO
        -> SOURCE_HOST='rep-source',
        -> SOURCE_PORT=3306,
        -> SOURCE_USER='myreplica',
        -> SOURCE_PASSWORD='53cr37';
   ```

   For a complete list of options that can be used with this statement, see Section 15.4.2.1, “CHANGE MASTER TO Statement”.

   To provide replication backup capability, you also need to add an `--ndb-connectstring` option to the replica's `my.cnf` file prior to starting the replication process. See Section 25.7.9, “NDB Cluster Backups With NDB Cluster Replication”, for details.

   For additional options that can be set in `my.cnf` for replicas, see Section 19.1.6, “Replication and Binary Logging Options and Variables”.

4. If the source cluster is already in use, you can create a backup of the source and load this onto the replica to cut down on the amount of time required for the replica to synchronize itself with the source. If the replica is also running NDB Cluster, this can be accomplished using the backup and restore procedure described in Section 25.7.9, “NDB Cluster Backups With NDB Cluster Replication”.

   ```
   ndb-connectstring=management_host[:port]
   ```

   In the event that you are *not* using NDB Cluster on the replica, you can create a backup with this command on the source:

   ```
   shellS> mysqldump --master-data=1
   ```

   Then import the resulting data dump onto the replica by copying the dump file over to it. After this, you can use the **mysql** client to import the data from the dumpfile into the replica database as shown here, where *`dump_file`* is the name of the file that was generated using **mysqldump** on the source, and *`db_name`* is the name of the database to be replicated:

   ```
   shellR> mysql -u root -p db_name < dump_file
   ```

   For a complete list of options to use with **mysqldump**, see Section 6.5.4, “mysqldump — A Database Backup Program”.

   Note

   If you copy the data to the replica in this fashion, make sure that you stop the replica from trying to connect to the source to begin replicating before all the data has been loaded. You can do this by starting the replica with the `--skip-slave-start` option on the command line, by including `skip-slave-start` in the replica's `my.cnf` file, or beginning with NDB 8.0.24, by setting the `skip_slave_start` system variable. Beginning with NDB 8.0.26, use `--skip-replica-start` or `skip_replica_start` instead. Once the data loading has completed, follow the additional steps outlined in the next two sections.

5. Ensure that each MySQL server acting as a replication source is assigned a unique server ID, and has binary logging enabled, using the row-based format. (See Section 19.2.1, “Replication Formats”.) In addition, we strongly recommend enabling the `replica_allow_batching` system variable (NDB 8.0.26 and later; prior to NDB 8.0.26, use `slave_allow_batching`). Beginning with NDB 8.0.30, this is enabled by default.

   If you are using a release of NDB Cluster prior to NDB 8.0.30, you should also consider increasing the values used with the `--ndb-batch-size` and `--ndb-blob-write-batch-bytes` options as well. In NDB 8.0.30 and later, use `--ndb-replica-batch-size` to set the batch size used for writes on the replica instead of `--ndb-batch-size`, and `--ndb-replica-blob-write-batch-bytes` rather than `--ndb-blob-write-batch-bytes` to determine the batch size used by the replication applier for writing blob data. All of these options can be set either in the source server's `my.cnf` file, or on the command line when starting the source **mysqld** process. See Section 25.7.6, “Starting NDB Cluster Replication (Single Replication Channel)”"), for more information.
