#### 21.5.24.2 Restoring to a different number of data nodes

It is possible to restore from an NDB backup to a cluster having a different number of data nodes than the original from which the backup was taken. The following two sections discuss, respectively, the cases where the target cluster has a lesser or greater number of data nodes than the source of the backup.

##### 21.5.24.2.1 Restoring to Fewer Nodes Than the Original

You can restore to a cluster having fewer data nodes than the original provided that the larger number of nodes is an even multiple of the smaller number. In the following example, we use a backup taken on a cluster having four data nodes to a cluster having two data nodes.

1. The management server for the original cluster is on host `host10`. The original cluster has four data nodes, with the node IDs and host names shown in the following extract from the management server's `config.ini` file:

   ```sql
   [ndbd]
   NodeId=2
   HostName=host2

   [ndbd]
   NodeId=4
   HostName=host4

   [ndbd]
   NodeId=6
   HostName=host6

   [ndbd]
   NodeId=8
   HostName=host8
   ```

   We assume that each data node was originally started with [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") [`--ndb-connectstring=host10`](mysql-cluster-programs-ndbd.html#option_ndbd_ndb-connectstring) or the equivalent.

2. Perform a backup in the normal manner. See [Section 21.6.8.2, “Using The NDB Cluster Management Client to Create a Backup”](mysql-cluster-backup-using-management-client.html "21.6.8.2 Using The NDB Cluster Management Client to Create a Backup"), for information about how to do this.

3. The files created by the backup on each data node are listed here, where *`N`* is the node ID and *`B`* is the backup ID.

   * `BACKUP-B-0.N.Data`
   * `BACKUP-B.N.ctl`
   * `BACKUP-B.N.log`

   These files are found under [`BackupDataDir`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-backupdatadir)`/BACKUP/BACKUP-B`, on each data node. For the rest of this example, we assume that the backup ID is 1.

   Have all of these files available for later copying to the new data nodes (where they can be accessed on the data node's local file system by [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup")). It is simplest to copy them all to a single location; we assume that this is what you have done.

4. The management server for the target cluster is on host `host20`, and the target has two data nodes, with the node IDs and host names shown, from the management server `config.ini` file on `host20`:

   ```sql
   [ndbd]
   NodeId=3
   hostname=host3

   [ndbd]
   NodeId=5
   hostname=host5
   ```

   Each of the data node processes on `host3` and `host5` should be started with [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") `-c host20` [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial) or the equivalent, so that the new (target) cluster starts with clean data node file systems.

5. Copy two different sets of two backup files to each of the target data nodes. For this example, copy the backup files from nodes 2 and 4 from the original cluster to node 3 in the target cluster. These files are listed here:

   * `BACKUP-1-0.2.Data`
   * `BACKUP-1.2.ctl`
   * `BACKUP-1.2.log`
   * `BACKUP-1-0.4.Data`
   * `BACKUP-1.4.ctl`
   * `BACKUP-1.4.log`

   Then copy the backup files from nodes 6 and 8 to node 5; these files are shown in the following list:

   * `BACKUP-1-0.6.Data`
   * `BACKUP-1.6.ctl`
   * `BACKUP-1.6.log`
   * `BACKUP-1-0.8.Data`
   * `BACKUP-1.8.ctl`
   * `BACKUP-1.8.log`

   For the remainder of this example, we assume that the respective backup files have been saved to the directory `/BACKUP-1` on each of nodes 3 and 5.

6. On each of the two target data nodes, you must restore from both sets of backups. First, restore the backups from nodes 2 and 4 to node 3 by invoking [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") on `host3` as shown here:

   ```sql
   $> ndb_restore -c host20 --nodeid=2 --backupid=1 --restore-data --backup-path=/BACKUP-1

   $> ndb_restore -c host20 --nodeid=4 --backupid=1 --restore-data --backup-path=/BACKUP-1
   ```

   Then restore the backups from nodes 6 and 8 to node 5 by invoking [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") on `host5`, like this:

   ```sql
   $> ndb_restore -c host20 --nodeid=6 --backupid=1 --restore-data --backup-path=/BACKUP-1

   $> ndb_restore -c host20 --nodeid=8 --backupid=1 --restore-data --backup-path=/BACKUP-1
   ```

##### 21.5.24.2.2 Restoring to More Nodes Than the Original

The node ID specified for a given [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") command is that of the node in the original backup and not that of the data node to restore it to. When performing a backup using the method described in this section, [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") connects to the management server and obtains a list of data nodes in the cluster the backup is being restored to. The restored data is distributed accordingly, so that the number of nodes in the target cluster does not need to be to be known or calculated when performing the backup.

Note

When changing the total number of LCP threads or LQH threads per node group, you should recreate the schema from backup created using [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program").

1. *Create the backup of the data*. You can do this by invoking the [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") client `START BACKUP` command from the system shell, like this:

   ```sql
   $> ndb_mgm -e "START BACKUP 1"
   ```

   This assumes that the desired backup ID is 1.

2. Create a backup of the schema. In NDB 7.5.2 and later, this step is necessary only if the total number of LCP threads or LQH threads per node group is changed.

   ```sql
   $> mysqldump --no-data --routines --events --triggers --databases > myschema.sql
   ```

   Important

   Once you have created the `NDB` native backup using [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client"), you must not make any schema changes before creating the backup of the schema, if you do so.

3. Copy the backup directory to the new cluster. For example if the backup you want to restore has ID 1 and `BackupDataDir` = `/backups/node_nodeid`, then the path to the backup on this node is `/backups/node_1/BACKUP/BACKUP-1`. Inside this directory there are three files, listed here:

   * `BACKUP-1-0.1.Data`
   * `BACKUP-1.1.ctl`
   * `BACKUP-1.1.log`

   You should copy the entire directory to the new node.

   If you needed to create a schema file, copy this to a location on an SQL node where it can be read by [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

There is no requirement for the backup to be restored from a specific node or nodes.

To restore from the backup just created, perform the following steps:

1. *Restore the schema*.

   * If you created a separate schema backup file using [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program"), import this file using the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client, similar to what is shown here:

     ```sql
     $> mysql < myschema.sql
     ```

     When importing the schema file, you may need to specify the [`--user`](mysql-command-options.html#option_mysql_user) and [`--password`](mysql-command-options.html#option_mysql_password) options (and possibly others) in addition to what is shown, in order for the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client to be able to connect to the MySQL server.

   * If you did *not* need to create a schema file, you can re-create the schema using [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") [`--restore-meta`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_restore-meta) (short form `-m`), similar to what is shown here:

     ```sql
     $> ndb_restore --nodeid=1 --backupid=1 --restore-meta --backup-path=/backups/node_1/BACKUP/BACKUP-1
     ```

     [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") must be able to contact the management server; add the [`--ndb-connectstring`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_ndb-connectstring) option if and as needed to make this possible.

2. *Restore the data*. This needs to be done once for each data node in the original cluster, each time using that data node's node ID. Assuming that there were 4 data nodes originally, the set of commands required would look something like this:

   ```sql
   ndb_restore --nodeid=1 --backupid=1 --restore-data --backup-path=/backups/node_1/BACKUP/BACKUP-1 --disable-indexes
   ndb_restore --nodeid=2 --backupid=1 --restore-data --backup-path=/backups/node_2/BACKUP/BACKUP-1 --disable-indexes
   ndb_restore --nodeid=3 --backupid=1 --restore-data --backup-path=/backups/node_3/BACKUP/BACKUP-1 --disable-indexes
   ndb_restore --nodeid=4 --backupid=1 --restore-data --backup-path=/backups/node_4/BACKUP/BACKUP-1 --disable-indexes
   ```

   These can be run in parallel.

   Be sure to add the [`--ndb-connectstring`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_ndb-connectstring) option as needed.

3. *Rebuild the indexes*. These were disabled by the [`--disable-indexes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_disable-indexes) option used in the commands just shown. Recreating the indexes avoids errors due to the restore not being consistent at all points. Rebuilding the indexes can also improve performance in some cases. To rebuild the indexes, execute the following command once, on a single node:

   ```sql
   $> ndb_restore --nodeid=1 --backupid=1 --backup-path=/backups/node_1/BACKUP/BACKUP-1 --rebuild-indexes
   ```

   As mentioned previously, you may need to add the [`--ndb-connectstring`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_ndb-connectstring) option, so that [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") can contact the management server.
