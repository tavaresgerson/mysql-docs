#### 16.1.2.4 Choosing a Method for Data Snapshots

If the database on the source contains existing data it is necessary to copy this data to each replica. There are different ways to dump the data from the source. The following sections describe possible options.

To select the appropriate method of dumping the database, choose between these options:

* Use the [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") tool to create a dump of all the databases you want to replicate. This is the recommended method, especially when using [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine").

* If your database is stored in binary portable files, you can copy the raw data files to a replica. This can be more efficient than using [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") and importing the file on each replica, because it skips the overhead of updating indexes as the `INSERT` statements are replayed. With storage engines such as [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") this is not recommended.

##### 16.1.2.4.1 Creating a Data Snapshot Using mysqldump

To create a snapshot of the data in an existing source, use the [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") tool. Once the data dump has been completed, import this data into the replica before starting the replication process.

The following example dumps all databases to a file named `dbdump.db`, and includes the [`--master-data`](mysqldump.html#option_mysqldump_master-data) option which automatically appends the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement required on the replica to start the replication process:

```sql
$> mysqldump --all-databases --master-data > dbdump.db
```

Note

If you do not use [`--master-data`](mysqldump.html#option_mysqldump_master-data), then it is necessary to lock all tables in a separate session manually. See [Section 16.1.2.3, “Obtaining the Replication Source's Binary Log Coordinates”](replication-howto-masterstatus.html "16.1.2.3 Obtaining the Replication Source's Binary Log Coordinates").

It is possible to exclude certain databases from the dump using the [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") tool. If you want to choose which databases to include in the dump, do not use [`--all-databases`](mysqldump.html#option_mysqldump_all-databases). Choose one of these options:

* Exclude all the tables in the database using [`--ignore-table`](mysqldump.html#option_mysqldump_ignore-table) option.

* Name only those databases which you want dumped using the [`--databases`](mysqldump.html#option_mysqldump_databases) option.

For more information, see [Section 4.5.4, “mysqldump — A Database Backup Program”](mysqldump.html "4.5.4 mysqldump — A Database Backup Program").

To import the data, either copy the dump file to the replica, or access the file from the source when connecting remotely to the replica.

##### 16.1.2.4.2 Creating a Data Snapshot Using Raw Data Files

This section describes how to create a data snapshot using the raw files which make up the database. Employing this method with a table using a storage engine that has complex caching or logging algorithms requires extra steps to produce a perfect “point in time” snapshot: the initial copy command could leave out cache information and logging updates, even if you have acquired a global read lock. How the storage engine responds to this depends on its crash recovery abilities.

If you use [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") tables, you can use the **mysqlbackup** command from the MySQL Enterprise Backup component to produce a consistent snapshot. This command records the log name and offset corresponding to the snapshot to be used on the replica. MySQL Enterprise Backup is a commercial product that is included as part of a MySQL Enterprise subscription. See [Section 28.1, “MySQL Enterprise Backup Overview”](mysql-enterprise-backup.html "28.1 MySQL Enterprise Backup Overview") for detailed information.

This method also does not work reliably if the source and replica have different values for [`ft_stopword_file`](server-system-variables.html#sysvar_ft_stopword_file), [`ft_min_word_len`](server-system-variables.html#sysvar_ft_min_word_len), or [`ft_max_word_len`](server-system-variables.html#sysvar_ft_max_word_len) and you are copying tables having full-text indexes.

Assuming the above exceptions do not apply to your database, use the [cold backup](glossary.html#glos_cold_backup "cold backup") technique to obtain a reliable binary snapshot of `InnoDB` tables: do a [slow shutdown](glossary.html#glos_slow_shutdown "slow shutdown") of the MySQL Server, then copy the data files manually.

To create a raw data snapshot of [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") tables when your MySQL data files exist on a single file system, you can use standard file copy tools such as **cp** or **copy**, a remote copy tool such as **scp** or **rsync**, an archiving tool such as **zip** or **tar**, or a file system snapshot tool such as **dump**. If you are replicating only certain databases, copy only those files that relate to those tables. For `InnoDB`, all tables in all databases are stored in the [system tablespace](glossary.html#glos_system_tablespace "system tablespace") files, unless you have the [`innodb_file_per_table`](innodb-parameters.html#sysvar_innodb_file_per_table) option enabled.

The following files are not required for replication:

* Files relating to the `mysql` database.
* The replica's connection metadata repository file, if used (see [Section 16.2.4, “Relay Log and Replication Metadata Repositories”](replica-logs.html "16.2.4 Relay Log and Replication Metadata Repositories")).

* The source's binary log files, with the exception of the binary log index file if you are going to use this to locate the source's binary log coordinates for the replica.

* Any relay log files.

Depending on whether you are using `InnoDB` tables or not, choose one of the following:

If you are using [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") tables, and also to get the most consistent results with a raw data snapshot, shut down the source server during the process, as follows:

1. Acquire a read lock and get the source's status. See [Section 16.1.2.3, “Obtaining the Replication Source's Binary Log Coordinates”](replication-howto-masterstatus.html "16.1.2.3 Obtaining the Replication Source's Binary Log Coordinates").

2. In a separate session, shut down the source server:

   ```sql
   $> mysqladmin shutdown
   ```

3. Make a copy of the MySQL data files. The following examples show common ways to do this. You need to choose only one of them:

   ```sql
   $> tar cf /tmp/db.tar ./data
   $> zip -r /tmp/db.zip ./data
   $> rsync --recursive ./data /tmp/dbdata
   ```

4. Restart the source server.

If you are not using [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") tables, you can get a snapshot of the system from a source without shutting down the server as described in the following steps:

1. Acquire a read lock and get the source's status. See [Section 16.1.2.3, “Obtaining the Replication Source's Binary Log Coordinates”](replication-howto-masterstatus.html "16.1.2.3 Obtaining the Replication Source's Binary Log Coordinates").

2. Make a copy of the MySQL data files. The following examples show common ways to do this. You need to choose only one of them:

   ```sql
   $> tar cf /tmp/db.tar ./data
   $> zip -r /tmp/db.zip ./data
   $> rsync --recursive ./data /tmp/dbdata
   ```

3. In the client where you acquired the read lock, release the lock:

   ```sql
   mysql> UNLOCK TABLES;
   ```

Once you have created the archive or copy of the database, copy the files to each replica before starting the replication process.
