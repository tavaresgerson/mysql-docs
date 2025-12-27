#### 19.1.2.5 Choosing a Method for Data Snapshots

If the source database contains existing data it is necessary to copy this data to each replica. There are different ways to dump the data from the source database. The following sections describe possible options.

To select the appropriate method of dumping the database, choose between these options:

* Use the **mysqldump** tool to create a dump of all the databases you want to replicate. This is the recommended method, especially when using `InnoDB`.

* If your database is stored in binary portable files, you can copy the raw data files to a replica. This can be more efficient than using **mysqldump** and importing the file on each replica, because it skips the overhead of updating indexes as the `INSERT` statements are replayed. With storage engines such as `InnoDB` this is not recommended.

* Use MySQL Server's clone plugin to transfer all the data from an existing replica to a clone. For instructions to use this method, see Section 7.6.6.7, “Cloning for Replication”.

Tip

To deploy multiple instances of MySQL, you can use InnoDB Cluster which enables you to easily administer a group of MySQL server instances in MySQL Shell. InnoDB Cluster wraps MySQL Group Replication in a programmatic environment that enables you easily deploy a cluster of MySQL instances to achieve high availability. In addition, InnoDB Cluster interfaces seamlessly with MySQL Router, which enables your applications to connect to the cluster without writing your own failover process. For similar use cases that do not require high availability, however, you can use InnoDB ReplicaSet. Installation instructions for MySQL Shell can be found here.

##### 19.1.2.5.1 Creating a Data Snapshot Using mysqldump

To create a snapshot of the data in an existing source database, use the **mysqldump** tool. Once the data dump has been completed, import this data into the replica before starting the replication process.

The following example dumps all databases to a file named `dbdump.db`, and includes the `--source-data` option which automatically appends the `CHANGE REPLICATION SOURCE TO` statement required on the replica to start the replication process:

```
$> mysqldump --all-databases --source-data > dbdump.db
```

Note

If you do not use `--source-data`, then it is necessary to lock all tables in a separate session manually. See Section 19.1.2.4, “Obtaining the Replication Source Binary Log Coordinates”.

It is possible to exclude certain databases from the dump using the **mysqldump** tool. If you want to choose which databases to include in the dump, do not use `--all-databases`. Choose one of these options:

* Exclude all the tables in the database using `--ignore-table` option.

* Name only those databases which you want dumped using the `--databases` option.

Note

By default, if GTIDs are in use on the source (`gtid_mode=ON`), **mysqldump** includes the GTIDs from the `gtid_executed` set on the source in the dump output to add them to the `gtid_purged` set on the replica. If you are dumping only specific databases or tables, it is important to note that the value that is included by **mysqldump** includes the GTIDs of all transactions in the `gtid_executed` set on the source, even those that changed suppressed parts of the database, or other databases on the server that were not included in the partial dump. Check the description for mysqldump's `--set-gtid-purged` option to find the outcome of the default behavior for the MySQL Server versions you are using, and how to change the behavior if this outcome is not suitable for your situation.

For more information, see Section 6.5.4, “mysqldump — A Database Backup Program”.

To import the data, either copy the dump file to the replica, or access the file from the source when connecting remotely to the replica.

##### 19.1.2.5.2 Creating a Data Snapshot Using Raw Data Files

This section describes how to create a data snapshot using the raw files which make up the database. Employing this method with a table using a storage engine that has complex caching or logging algorithms requires extra steps to produce a perfect “point in time” snapshot: the initial copy command could leave out cache information and logging updates, even if you have acquired a global read lock. How the storage engine responds to this depends on its crash recovery abilities.

If you use `InnoDB` tables, you can use the **mysqlbackup** command from the MySQL Enterprise Backup component to produce a consistent snapshot. This command records the log name and offset corresponding to the snapshot to be used on the replica. MySQL Enterprise Backup is a commercial product that is included as part of a MySQL Enterprise subscription. See Section 32.1, “MySQL Enterprise Backup Overview” for detailed information.

This method also does not work reliably if the source and replica have different values for `ft_stopword_file`, `ft_min_word_len`, or `ft_max_word_len` and you are copying tables having full-text indexes.

Assuming the above exceptions do not apply to your database, use the cold backup technique to obtain a reliable binary snapshot of `InnoDB` tables: do a slow shutdown of the MySQL Server, then copy the data files manually.

To create a raw data snapshot of `MyISAM` tables when your MySQL data files exist on a single file system, you can use standard file copy tools such as **cp** or **copy**, a remote copy tool such as **scp** or **rsync**, an archiving tool such as **zip** or **tar**, or a file system snapshot tool such as **dump**. If you are replicating only certain databases, copy only those files that relate to those tables. For `InnoDB`, all tables in all databases are stored in the system tablespace files, unless you have the `innodb_file_per_table` option enabled.

The following files are not required for replication:

* Files relating to the `mysql` database.
* The replica's connection metadata repository file `master.info`, if used; the use of this file is now deprecated (see Section 19.2.4, “Relay Log and Replication Metadata Repositories”).

* The source's binary log files, with the exception of the binary log index file if you are going to use this to locate the source binary log coordinates for the replica.

* Any relay log files.

Depending on whether you are using `InnoDB` tables or not, choose one of the following:

If you are using `InnoDB` tables, and also to get the most consistent results with a raw data snapshot, shut down the source server during the process, as follows:

1. Acquire a read lock and get the source's status. See Section 19.1.2.4, “Obtaining the Replication Source Binary Log Coordinates”.

2. In a separate session, shut down the source server:

   ```
   $> mysqladmin shutdown
   ```

3. Make a copy of the MySQL data files. The following examples show common ways to do this. You need to choose only one of them:

   ```
   $> tar cf /tmp/db.tar ./data
   $> zip -r /tmp/db.zip ./data
   $> rsync --recursive ./data /tmp/dbdata
   ```

4. Restart the source server.

If you are not using `InnoDB` tables, you can get a snapshot of the system from a source without shutting down the server as described in the following steps:

1. Acquire a read lock and get the source's status. See Section 19.1.2.4, “Obtaining the Replication Source Binary Log Coordinates”.

2. Make a copy of the MySQL data files. The following examples show common ways to do this. You need to choose only one of them:

   ```
   $> tar cf /tmp/db.tar ./data
   $> zip -r /tmp/db.zip ./data
   $> rsync --recursive ./data /tmp/dbdata
   ```

3. In the client where you acquired the read lock, release the lock:

   ```
   mysql> UNLOCK TABLES;
   ```

Once you have created the archive or copy of the database, copy the files to each replica before starting the replication process.
