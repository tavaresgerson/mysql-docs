## 16.1 Configuring Replication

This section describes how to configure the different types of replication available in MySQL and includes the setup and configuration required for a replication environment, including step-by-step instructions for creating a new replication environment. The major components of this section are:

* For a guide to setting up two or more servers for replication using binary log file positions, Section 16.1.2, “Setting Up Binary Log File Position Based Replication”, deals with the configuration of the servers and provides methods for copying data between the source and replicas.

* For a guide to setting up two or more servers for replication using GTID transactions, Section 16.1.3, “Replication with Global Transaction Identifiers”, deals with the configuration of the servers.

* Events in the binary log are recorded using a number of formats. These are referred to as statement-based replication (SBR) or row-based replication (RBR). A third type, mixed-format replication (MIXED), uses SBR or RBR replication automatically to take advantage of the benefits of both SBR and RBR formats when appropriate. The different formats are discussed in Section 16.2.1, “Replication Formats”.

* Detailed information on the different configuration options and variables that apply to replication is provided in Section 16.1.6, “Replication and Binary Logging Options and Variables”.

* Once started, the replication process should require little administration or monitoring. However, for advice on common tasks that you may want to execute, see Section 16.1.7, “Common Replication Administration Tasks”.


### 16.1.1 Binary Log File Position Based Replication Configuration Overview

This section describes replication between MySQL servers based on the binary log file position method, where the MySQL instance operating as the source (where the database changes originate) writes updates and changes as “events” to the binary log. The information in the binary log is stored in different logging formats according to the database changes being recorded. Replicas are configured to read the binary log from the source and to execute the events in the binary log on the replica's local database.

Each replica receives a copy of the entire contents of the binary log. It is the responsibility of the replica to decide which statements in the binary log should be executed. Unless you specify otherwise, all events in the source's binary log are executed on the replica. If required, you can configure the replica to process only events that apply to particular databases or tables.

Important

You cannot configure the source to log only certain events.

Each replica keeps a record of the binary log coordinates: the file name and position within the file that it has read and processed from the source. This means that multiple replicas can be connected to the source and executing different parts of the same binary log. Because the replicas control this process, individual replicas can be connected and disconnected from the server without affecting the source's operation. Also, because each replica records the current position within the binary log, it is possible for replicas to be disconnected, reconnect and then resume processing.

The source and each replica must be configured with a unique ID (using the `server_id` system variable). In addition, each replica must be configured with information about the source's host name, log file name, and position within that file. These details can be controlled from within a MySQL session using the `CHANGE MASTER TO` statement on the replica. The details are stored within the replica's connection metadata repository, which can be either a file or a table (see Section 16.2.4, “Relay Log and Replication Metadata Repositories”).


### 16.1.2 Setting Up Binary Log File Position Based Replication

This section describes how to set up a MySQL server to use binary log file position based replication. There are a number of different methods for setting up replication, and the exact method to use depends on how you are setting up replication, and whether you already have data in the database on the source.

There are some generic tasks that are common to all setups:

* On the source, you must enable binary logging and configure a unique server ID. This might require a server restart. See Section 16.1.2.1, “Setting the Replication Source Configuration”.

* On each replica that you want to connect to the source, you must configure a unique server ID. This might require a server restart. See Section 16.1.2.5.1, “Setting the Replica Configuration”.

* Optionally, create a separate user for your replicas to use during authentication with the source when reading the binary log for replication. See Section 16.1.2.2, “Creating a User for Replication”.

* Before creating a data snapshot or starting the replication process, on the source you should record the current position in the binary log. You need this information when configuring the replica so that the replica knows where in the binary log to start executing events. See Section 16.1.2.3, “Obtaining the Replication Source's Binary Log Coordinates”.

* If you already have data on the source and want to use it to synchronize the replica, you need to create a data snapshot to copy the data to the replica. The storage engine you are using has an impact on how you create the snapshot. When you are using `MyISAM`, you must stop processing statements on the source to obtain a read-lock, then obtain its current binary log coordinates and dump its data, before permitting the source to continue executing statements. If you do not stop the execution of statements, the data dump and the source's status information do not match, resulting in inconsistent or corrupted databases on the replicas. For more information on replicating a `MyISAM` source, see Section 16.1.2.3, “Obtaining the Replication Source's Binary Log Coordinates”. If you are using `InnoDB`, you do not need a read-lock and a transaction that is long enough to transfer the data snapshot is sufficient. For more information, see Section 14.20, “InnoDB and MySQL Replication”.

* Configure the replica with settings for connecting to the source, such as the host name, login credentials, and binary log file name and position. See Section 16.1.2.5.2, “Setting the Source Configuration on the Replica”.

Note

Certain steps within the setup process require the `SUPER` privilege. If you do not have this privilege, it might not be possible to enable replication.

After configuring the basic options, select your scenario:

* To set up replication for a fresh installation of a source and replicas that contain no data, see Section 16.1.2.5.3, “Setting Up Replication between a New Source and Replicas”.

* To set up replication of a new source using the data from an existing MySQL server, see Section 16.1.2.5.4, “Setting Up Replication with Existing Data”.

* To add replicas to an existing replication environment, see Section 16.1.2.6, “Adding Replicas to a Replication Topology”.

Before administering MySQL replication servers, read this entire chapter and try all statements mentioned in Section 13.4.1, “SQL Statements for Controlling Replication Source Servers”, and Section 13.4.2, “SQL Statements for Controlling Replica Servers”. Also familiarize yourself with the replication startup options described in Section 16.1.6, “Replication and Binary Logging Options and Variables”.


#### 16.1.2.1 Setting the Replication Source Configuration

To configure a source to use binary log file position based replication, you must ensure that binary logging is enabled, and establish a unique server ID.

Each server within a replication topology must be configured with a unique server ID, which you can specify using the `server_id` system variable. This server ID is used to identify individual servers within the replication topology, and must be a positive integer between 1 and (232)−1. You can change the `server_id` value dynamically by issuing a statement like this:

```sql
SET GLOBAL server_id = 2;
```

With the default server ID of 0, a source refuses any connections from replicas, and a replica refuses to connect to a source, so this value cannot be used in a replication topology. Other than that, how you organize and select the server IDs is your choice, so long as each server ID is different from every other server ID in use by any other server in the replication topology. Note that if a value of 0 was set previously for the server ID, you must restart the server to initialize the source with your new nonzero server ID. Otherwise, a server restart is not needed, unless you need to enable binary logging or make other configuration changes that require a restart.

Binary logging *must* be enabled on the source because the binary log is the basis for replicating changes from the source to its replicas. If binary logging is not enabled on the source using the `log-bin` option, replication is not possible. To enable binary logging on a server where it is not already enabled, you must restart the server. In this case, shut down the MySQL server and edit the `my.cnf` or `my.ini` file. Within the `[mysqld]` section of the configuration file, add the `log-bin` and `server-id` options. If these options already exist, but are commented out, uncomment the options and alter them according to your needs. For example, to enable binary logging using a log file name prefix of `mysql-bin`, and configure a server ID of 1, use these lines:

```sql
[mysqld]
log-bin=mysql-bin
server-id=1
```

After making the changes, restart the server.

Note

The following options have an impact on this procedure:

* For the greatest possible durability and consistency in a replication setup using `InnoDB` with transactions, you should use `innodb_flush_log_at_trx_commit=1` and `sync_binlog=1` in the source's `my.cnf` file.

* Ensure that the `skip_networking` system variable is not enabled on your source. If networking has been disabled, the replica cannot communicate with the source and replication fails.


#### 16.1.2.2 Creating a User for Replication

Each replica connects to the source using a MySQL user name and password, so there must be a user account on the source that the replica can use to connect. The user name is specified by the `MASTER_USER` option on the `CHANGE MASTER TO` command when you set up a replica. Any account can be used for this operation, providing it has been granted the `REPLICATION SLAVE` privilege. You can choose to create a different account for each replica, or connect to the source using the same account for each replica.

Although you do not have to create an account specifically for replication, you should be aware that the replication user name and password are stored in plain text in the replication metadata repositories (see Section 16.2.4.2, “Replication Metadata Repositories”). Therefore, you may want to create a separate account that has privileges only for the replication process, to minimize the possibility of compromise to other accounts.

To create a new account, use `CREATE USER`. To grant this account the privileges required for replication, use the `GRANT` statement. If you create an account solely for the purposes of replication, that account needs only the `REPLICATION SLAVE` privilege. For example, to set up a new user, `repl`, that can connect for replication from any host within the `example.com` domain, issue these statements on the source:

```sql
mysql> CREATE USER 'repl'@'%.example.com' IDENTIFIED BY 'password';
mysql> GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%.example.com';
```

See Section 13.7.1, “Account Management Statements”, for more information on statements for manipulation of user accounts.


#### 16.1.2.3 Obtaining the Replication Source's Binary Log Coordinates

To configure the replica to start the replication process at the correct point, you need to note the source's current coordinates within its binary log.

Warning

This procedure uses `FLUSH TABLES WITH READ LOCK`, which blocks `COMMIT` operations for `InnoDB` tables.

If you are planning to shut down the source to create a data snapshot, you can optionally skip this procedure and instead store a copy of the binary log index file along with the data snapshot. In that situation, the source creates a new binary log file on restart. The source's binary log coordinates where the replica must start the replication process are therefore the start of that new file, which is the next binary log file on the source following after the files that are listed in the copied binary log index file.

To obtain the source's binary log coordinates, follow these steps:

1. Start a session on the source by connecting to it with the command-line client, and flush all tables and block write statements by executing the `FLUSH TABLES WITH READ LOCK` statement:

   ```sql
   mysql> FLUSH TABLES WITH READ LOCK;
   ```

   Warning

   Leave the client from which you issued the `FLUSH TABLES` statement running so that the read lock remains in effect. If you exit the client, the lock is released.

2. In a different session on the source, use the `SHOW MASTER STATUS` statement to determine the current binary log file name and position:

   ```sql
   mysql> SHOW MASTER STATUS\G
   *************************** 1. row ***************************
                File: mysql-bin.000003
            Position: 73
        Binlog_Do_DB: test
    Binlog_Ignore_DB: manual, mysql
   Executed_Gtid_Set: 3E11FA47-71CA-11E1-9E33-C80AA9429562:1-5
   1 row in set (0.00 sec)
   ```

   The `File` column shows the name of the log file and the `Position` column shows the position within the file. In this example, the binary log file is `mysql-bin.000003` and the position is 73. Record these values. You need them later when you are setting up the replica. They represent the replication coordinates at which the replica should begin processing new updates from the source.

   If the source has been running previously without binary logging enabled, the log file name and position values displayed by `SHOW MASTER STATUS` or **mysqldump --master-data** are empty. In that case, the values that you need to use later when specifying the source's log file and position are the empty string (`''`) and `4`.

You now have the information you need to enable the replica to start reading from the binary log in the correct place to start replication.

The next step depends on whether you have existing data on the source. Choose one of the following options:

* If you have existing data that needs be to synchronized with the replica before you start replication, leave the client running so that the lock remains in place. This prevents any further changes being made, so that the data copied to the replica is in synchrony with the source. Proceed to Section 16.1.2.4, “Choosing a Method for Data Snapshots”.

* If you are setting up a new replication topology, you can exit the first session to release the read lock. See Section 16.1.2.5.3, “Setting Up Replication between a New Source and Replicas” for how to proceed.


#### 16.1.2.4 Choosing a Method for Data Snapshots

If the database on the source contains existing data it is necessary to copy this data to each replica. There are different ways to dump the data from the source. The following sections describe possible options.

To select the appropriate method of dumping the database, choose between these options:

* Use the **mysqldump** tool to create a dump of all the databases you want to replicate. This is the recommended method, especially when using `InnoDB`.

* If your database is stored in binary portable files, you can copy the raw data files to a replica. This can be more efficient than using **mysqldump** and importing the file on each replica, because it skips the overhead of updating indexes as the `INSERT` statements are replayed. With storage engines such as `InnoDB` this is not recommended.

##### 16.1.2.4.1 Creating a Data Snapshot Using mysqldump

To create a snapshot of the data in an existing source, use the **mysqldump** tool. Once the data dump has been completed, import this data into the replica before starting the replication process.

The following example dumps all databases to a file named `dbdump.db`, and includes the `--master-data` option which automatically appends the `CHANGE MASTER TO` statement required on the replica to start the replication process:

```sql
$> mysqldump --all-databases --master-data > dbdump.db
```

Note

If you do not use `--master-data`, then it is necessary to lock all tables in a separate session manually. See Section 16.1.2.3, “Obtaining the Replication Source's Binary Log Coordinates”.

It is possible to exclude certain databases from the dump using the **mysqldump** tool. If you want to choose which databases to include in the dump, do not use `--all-databases`. Choose one of these options:

* Exclude all the tables in the database using `--ignore-table` option.

* Name only those databases which you want dumped using the `--databases` option.

For more information, see Section 4.5.4, “mysqldump — A Database Backup Program”.

To import the data, either copy the dump file to the replica, or access the file from the source when connecting remotely to the replica.

##### 16.1.2.4.2 Creating a Data Snapshot Using Raw Data Files

This section describes how to create a data snapshot using the raw files which make up the database. Employing this method with a table using a storage engine that has complex caching or logging algorithms requires extra steps to produce a perfect “point in time” snapshot: the initial copy command could leave out cache information and logging updates, even if you have acquired a global read lock. How the storage engine responds to this depends on its crash recovery abilities.

If you use `InnoDB` tables, you can use the **mysqlbackup** command from the MySQL Enterprise Backup component to produce a consistent snapshot. This command records the log name and offset corresponding to the snapshot to be used on the replica. MySQL Enterprise Backup is a commercial product that is included as part of a MySQL Enterprise subscription. See Section 28.1, “MySQL Enterprise Backup Overview” for detailed information.

This method also does not work reliably if the source and replica have different values for `ft_stopword_file`, `ft_min_word_len`, or `ft_max_word_len` and you are copying tables having full-text indexes.

Assuming the above exceptions do not apply to your database, use the cold backup technique to obtain a reliable binary snapshot of `InnoDB` tables: do a slow shutdown of the MySQL Server, then copy the data files manually.

To create a raw data snapshot of `MyISAM` tables when your MySQL data files exist on a single file system, you can use standard file copy tools such as **cp** or **copy**, a remote copy tool such as **scp** or **rsync**, an archiving tool such as **zip** or **tar**, or a file system snapshot tool such as **dump**. If you are replicating only certain databases, copy only those files that relate to those tables. For `InnoDB`, all tables in all databases are stored in the system tablespace files, unless you have the `innodb_file_per_table` option enabled.

The following files are not required for replication:

* Files relating to the `mysql` database.
* The replica's connection metadata repository file, if used (see Section 16.2.4, “Relay Log and Replication Metadata Repositories”).

* The source's binary log files, with the exception of the binary log index file if you are going to use this to locate the source's binary log coordinates for the replica.

* Any relay log files.

Depending on whether you are using `InnoDB` tables or not, choose one of the following:

If you are using `InnoDB` tables, and also to get the most consistent results with a raw data snapshot, shut down the source server during the process, as follows:

1. Acquire a read lock and get the source's status. See Section 16.1.2.3, “Obtaining the Replication Source's Binary Log Coordinates”.

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

If you are not using `InnoDB` tables, you can get a snapshot of the system from a source without shutting down the server as described in the following steps:

1. Acquire a read lock and get the source's status. See Section 16.1.2.3, “Obtaining the Replication Source's Binary Log Coordinates”.

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


#### 16.1.2.5 Setting Up Replicas

The following sections describe how to set up replicas. Before you proceed, ensure that you have:

* Configured the source with the necessary configuration properties. See Section 16.1.2.1, “Setting the Replication Source Configuration”.

* Obtained the source's status information, or a copy of the source's binary log index file made during a shutdown for the data snapshot. See Section 16.1.2.3, “Obtaining the Replication Source's Binary Log Coordinates”.

* On the source, released the read lock:

  ```sql
  mysql> UNLOCK TABLES;
  ```

##### 16.1.2.5.1 Setting the Replica Configuration

Each replica must have a unique server ID, as specified by the `server_id` system variable. If you are setting up multiple replicas, each one must have a unique `server_id` value that differs from that of the source and from any of the other replicas. If the replica's server ID is not already set, or the current value conflicts with the value that you have chosen for the source server or another replica, you must change it. With the default `server_id` value of 0, a replica refuses to connect to a source.

You can change the `server_id` value dynamically by issuing a statement like this:

```sql
SET GLOBAL server_id = 21;
```

If the default `server_id` value of 0 was set previously, you must restart the server to initialize the replica with your new nonzero server ID. Otherwise, a server restart is not needed when you change the server ID, unless you make other configuration changes that require it. For example, if binary logging was disabled on the server and you want it enabled for your replica, a server restart is required to enable this.

If you are shutting down the replica server, you can edit the `[mysqld]` section of the configuration file to specify a unique server ID. For example:

```sql
[mysqld]
server-id=21
```

A replica is not required to have binary logging enabled for replication to take place. However, binary logging on a replica means that the replica's binary log can be used for data backups and crash recovery. Replicas that have binary logging enabled can also be used as part of a more complex replication topology. If you want to enable binary logging on a replica, use the `log-bin` option in the `[mysqld]` section of the configuration file. A server restart is required to start binary logging on a server that did not previously use it.

##### 16.1.2.5.2 Setting the Source Configuration on the Replica

To set up the replica to communicate with the source for replication, configure the replica with the necessary connection information. To do this, execute the following statement on the replica, replacing the option values with the actual values relevant to your system:

```sql
mysql> CHANGE MASTER TO
    ->     MASTER_HOST='source_host_name',
    ->     MASTER_USER='replication_user_name',
    ->     MASTER_PASSWORD='replication_password',
    ->     MASTER_LOG_FILE='recorded_log_file_name',
    ->     MASTER_LOG_POS=recorded_log_position;
```

Note

Replication cannot use Unix socket files. You must be able to connect to the source MySQL server using TCP/IP.

The `CHANGE MASTER TO` statement has other options as well. For example, it is possible to set up secure replication using SSL. For a full list of options, and information about the maximum permissible length for the string-valued options, see Section 13.4.2.1, “CHANGE MASTER TO Statement”.

The next steps depend on whether you have existing data to import to the replica or not. See Section 16.1.2.4, “Choosing a Method for Data Snapshots” for more information. Choose one of the following:

* If you do not have a snapshot of a database to import, see Section 16.1.2.5.3, “Setting Up Replication between a New Source and Replicas”.

* If you have a snapshot of a database to import, see Section 16.1.2.5.4, “Setting Up Replication with Existing Data”.

##### 16.1.2.5.3 Setting Up Replication between a New Source and Replicas

When there is no snapshot of a previous database to import, configure the replica to start replication from the new source.

To set up replication between a source and a new replica:

1. Start up the replica and connect to it.
2. Execute a `CHANGE MASTER TO` statement to set the source configuration. See Section 16.1.2.5.2, “Setting the Source Configuration on the Replica”.

Perform these setup steps on each replica.

This method can also be used if you are setting up new servers but have an existing dump of the databases from a different server that you want to load into your replication configuration. By loading the data into a new source, the data is automatically replicated to the replicas.

If you are setting up a new replication environment using the data from a different existing database server to create a new source, run the dump file generated from that server on the new source. The database updates are automatically propagated to the replicas:

```sql
$> mysql -h master < fulldb.dump
```

##### 16.1.2.5.4 Setting Up Replication with Existing Data

When setting up replication with existing data, transfer the snapshot from the source to the replica before starting replication. The process for importing data to the replica depends on how you created the snapshot of data on the source.

Follow this procedure to set up replication with existing data:

1. Import the data to the replica using one of the following methods:

   1. If you used **mysqldump**, start the replica server, ensuring that replication does not start by using the `--skip-slave-start` option. Then import the dump file:

      ```sql
      $> mysql < fulldb.dump
      ```

   2. If you created a snapshot using the raw data files, extract the data files into your replica's data directory. For example:

      ```sql
      $> tar xvf dbdump.tar
      ```

      You may need to set permissions and ownership on the files so that the replica server can access and modify them. Then start the replica server, ensuring that replication does not start by using the `--skip-slave-start` option.

2. Configure the replica with the replication coordinates from the source. This tells the replica the binary log file and position within the file where replication needs to start. Also, configure the replica with the login credentials and host name of the source. For more information on the `CHANGE MASTER TO` statement required, see Section 16.1.2.5.2, “Setting the Source Configuration on the Replica”.

3. Start the replication threads:

   ```sql
   mysql> START SLAVE;
   ```

After you have performed this procedure, the replica connects to the source and replicates any updates that have occurred on the source since the snapshot was taken.

If the `server_id` system variable for the source is not correctly set, replicas cannot connect to it. Similarly, if you have not set `server_id` correctly for the replica, you get the following error in the replica's error log:

```sql
Warning: You should set server-id to a non-0 value if master_host
is set; we will force server id to 2, but this MySQL server will
not act as a slave.
```

You also find error messages in the replica's error log if it is not able to replicate for any other reason.

The replica stores information about the source you have configured in its connection metadata repository. The connection metadata repository can be in the form of files or a table, as determined by the value set for the `master_info_repository` system variable. When a replica runs with `master_info_repository=FILE`, two files are stored in the data directory, named `master.info` and `relay-log.info`. If `master_info_repository=TABLE` instead, this information is saved in the `master_slave_info` table in the `mysql` database. In either case, do *not* remove or edit the files or table. Always use the `CHANGE MASTER TO` statement to change replication parameters. The replica can use the values specified in the statement to update the status files automatically. See Section 16.2.4, “Relay Log and Replication Metadata Repositories”, for more information.

Note

The contents of the connection metadata repository override some of the server options specified on the command line or in `my.cnf`. See Section 16.1.6, “Replication and Binary Logging Options and Variables”, for more details.

A single snapshot of the source suffices for multiple replicas. To set up additional replicas, use the same source snapshot and follow the replica portion of the procedure just described.


#### 16.1.2.6 Adding Replicas to a Replication Topology

You can add another replica to an existing replication configuration without stopping the source server. To do this, you can set up the new replica by copying the data directory of an existing replica, and giving the new replica a different server ID (which is user-specified) and server UUID (which is generated at startup).

To duplicate an existing replica:

1. Stop the existing replica and record the replica status information, particularly the source's binary log file and relay log file positions. You can view the replica status either in the Performance Schema replication tables (see Section 25.12.11, “Performance Schema Replication Tables”), or by issuing `SHOW SLAVE STATUS` as follows:

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

   * During copying, if files have been used for the replication metadata repositories (see Section 16.2.4, “Relay Log and Replication Metadata Repositories”), which is the default in MySQL 5.7, ensure that you also copy these files from the existing replica to the new replica. If tables have been used for the repositories, the tables are in the data directory.

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

   This situation can occur if the `relay_log` system variable is not specified, as the relay log files contain the host name as part of their file names. This is also true of the relay log index file if the `relay_log_index` system variable is not used. For more information about these variables, see Section 16.1.6, “Replication and Binary Logging Options and Variables”.

   To avoid this problem, use the same value for `relay_log` on the new replica that was used on the existing replica. If this option was not set explicitly on the existing replica, use `existing_replica_hostname-relay-bin`. If this is not possible, copy the existing replica's relay log index file to the new replica and set the `relay_log_index` system variable on the new replica to match what was used on the existing replica. If this option was not set explicitly on the existing replica, use `existing_replica_hostname-relay-bin.index`. Alternatively, if you have already tried to start the new replica after following the remaining steps in this section and have encountered errors like those described previously, then perform the following steps:

   1. If you have not already done so, issue `STOP SLAVE` on the new replica.

      If you have already started the existing replica again, issue `STOP SLAVE` on the existing replica as well.

   2. Copy the contents of the existing replica's relay log index file into the new replica's relay log index file, making sure to overwrite any content already in the file.

   3. Proceed with the remaining steps in this section.
4. When copying is complete, restart the existing replica.
5. On the new replica, edit the configuration and give the new replica a unique server ID (using the `server_id` system variable) that is not used by the source or any of the existing replicas.

6. Start the new replica server, specifying the `--skip-slave-start` option so that replication does not start yet. Use the Performance Schema replication tables or issue `SHOW SLAVE STATUS` to confirm that the new replica has the correct settings when compared with the existing replica. Also display the server ID and server UUID and verify that these are correct and unique for the new replica.

7. Start the replication threads by issuing a `START SLAVE` statement:

   ```sql
   mysql> START SLAVE;
   ```

   The new replica now uses the information in its connection metadata repository to start the replication process.


### 16.1.3 Replication with Global Transaction Identifiers

This section explains transaction-based replication using global transaction identifiers (GTIDs). When using GTIDs, each transaction can be identified and tracked as it is committed on the originating server and applied by any replicas; this means that it is not necessary when using GTIDs to refer to log files or positions within those files when starting a new replica or failing over to a new source, which greatly simplifies these tasks. Because GTID-based replication is completely transaction-based, it is simple to determine whether sources and replicas are consistent; as long as all transactions committed on a source are also committed on a replica, consistency between the two is guaranteed. You can use either statement-based or row-based replication with GTIDs (see Section 16.2.1, “Replication Formats”); however, for best results, we recommend that you use the row-based format.

GTIDs are always preserved between source and replica. This means that you can always determine the source for any transaction applied on any replica by examining its binary log. In addition, once a transaction with a given GTID is committed on a given server, any subsequent transaction having the same GTID is ignored by that server. Thus, a transaction committed on the source can be applied no more than once on the replica, which helps to guarantee consistency.

This section discusses the following topics:

* How GTIDs are defined and created, and how they are represented in a MySQL server (see Section 16.1.3.1, “GTID Format and Storage”).

* The life cycle of a GTID (see Section 16.1.3.2, “GTID Life Cycle”).

* The auto-positioning function for synchronizing a replica and source that use GTIDs (see Section 16.1.3.3, “GTID Auto-Positioning”).

* A general procedure for setting up and starting GTID-based replication (see Section 16.1.3.4, “Setting Up Replication Using GTIDs”).

* Suggested methods for provisioning new replication servers when using GTIDs (see Section 16.1.3.5, “Using GTIDs for Failover and Scaleout”).

* Restrictions and limitations that you should be aware of when using GTID-based replication (see Section 16.1.3.6, “Restrictions on Replication with GTIDs”).

* Stored functions that you can use to work with GTIDs (see Section 16.1.3.7, “Stored Function Examples to Manipulate GTIDs”).

For information about MySQL Server options and variables relating to GTID-based replication, see Section 16.1.6.5, “Global Transaction ID System Variables”. See also Section 12.18, “Functions Used with Global Transaction Identifiers (GTIDs)”"), which describes SQL functions supported by MySQL 5.7 for use with GTIDs.


#### 16.1.3.1 GTID Format and Storage

A global transaction identifier (GTID) is a unique identifier created and associated with each transaction committed on the server of origin (the source). This identifier is unique not only to the server on which it originated, but is unique across all servers in a given replication topology.

GTID assignment distinguishes between client transactions, which are committed on the source, and replicated transactions, which are reproduced on a replica. When a client transaction is committed on the source, it is assigned a new GTID, provided that the transaction was written to the binary log. Client transactions are guaranteed to have monotonically increasing GTIDs without gaps between the generated numbers. If a client transaction is not written to the binary log (for example, because the transaction was filtered out, or the transaction was read-only), it is not assigned a GTID on the server of origin.

Replicated transactions retain the same GTID that was assigned to the transaction on the server of origin. The GTID is present before the replicated transaction begins to execute, and is persisted even if the replicated transaction is not written to the binary log on the replica, or is filtered out on the replica. The MySQL system table `mysql.gtid_executed` is used to preserve the assigned GTIDs of all the transactions applied on a MySQL server, except those that are stored in a currently active binary log file.

The auto-skip function for GTIDs means that a transaction committed on the source can be applied no more than once on the replica, which helps to guarantee consistency. Once a transaction with a given GTID has been committed on a given server, any attempt to execute a subsequent transaction with the same GTID is ignored by that server. No error is raised, and no statement in the transaction is executed.

If a transaction with a given GTID has started to execute on a server, but has not yet committed or rolled back, any attempt to start a concurrent transaction on the server with the same GTID blocks. The server neither begins to execute the concurrent transaction nor returns control to the client. Once the first attempt at the transaction commits or rolls back, concurrent sessions that were blocking on the same GTID may proceed. If the first attempt rolled back, one concurrent session proceeds to attempt the transaction, and any other concurrent sessions that were blocking on the same GTID remain blocked. If the first attempt committed, all the concurrent sessions stop being blocked, and auto-skip all the statements of the transaction.

A GTID is represented as a pair of coordinates, separated by a colon character (`:`), as shown here:

```sql
GTID = source_id:transaction_id
```

The *`source_id`* identifies the originating server. Normally, the source's `server_uuid` is used for this purpose. The *`transaction_id`* is a sequence number determined by the order in which the transaction was committed on the source. For example, the first transaction to be committed has `1` as its *`transaction_id`*, and the tenth transaction to be committed on the same originating server is assigned a *`transaction_id`* of `10`. It is not possible for a transaction to have `0` as a sequence number in a GTID. For example, the twenty-third transaction to be committed originally on the server with the UUID `3E11FA47-71CA-11E1-9E33-C80AA9429562` has this GTID:

```sql
3E11FA47-71CA-11E1-9E33-C80AA9429562:23
```

The upper limit for sequence numbers for GTIDs on a server instance is the number of non-negative values for a signed 64-bit integer (2 to the power of 63 minus 1, or 9,223,372,036,854,775,807). If the server runs out of GTIDs, it takes the action specified by `binlog_error_action`.

The GTID for a transaction is shown in the output from **mysqlbinlog**, and it is used to identify an individual transaction in the Performance Schema replication status tables, for example, `replication_applier_status_by_worker`. The value stored by the `gtid_next` system variable (`@@GLOBAL.gtid_next`) is a single GTID.

##### GTID Sets

A GTID set is a set comprising one or more single GTIDs or ranges of GTIDs. GTID sets are used in a MySQL server in several ways. For example, the values stored by the `gtid_executed` and `gtid_purged` system variables are GTID sets. The `START SLAVE` clauses `UNTIL SQL_BEFORE_GTIDS` and `UNTIL SQL_AFTER_GTIDS` can be used to make a replica process transactions only up to the first GTID in a GTID set, or stop after the last GTID in a GTID set. The built-in functions `GTID_SUBSET()` and `GTID_SUBTRACT()` require GTID sets as input.

A range of GTIDs originating from the same server can be collapsed into a single expression, as shown here:

```sql
3E11FA47-71CA-11E1-9E33-C80AA9429562:1-5
```

The above example represents the first through fifth transactions originating on the MySQL server whose `server_uuid` is `3E11FA47-71CA-11E1-9E33-C80AA9429562`. Multiple single GTIDs or ranges of GTIDs originating from the same server can also be included in a single expression, with the GTIDs or ranges separated by colons, as in the following example:

```sql
3E11FA47-71CA-11E1-9E33-C80AA9429562:1-3:11:47-49
```

A GTID set can include any combination of single GTIDs and ranges of GTIDs, and it can include GTIDs originating from different servers. This example shows the GTID set stored in the `gtid_executed` system variable (`@@GLOBAL.gtid_executed`) of a replica that has applied transactions from more than one source:

```sql
2174B383-5441-11E8-B90A-C80AA9429562:1-3, 24DA167-0C0C-11E8-8442-00059A3C7B00:1-19
```

When GTID sets are returned from server variables, UUIDs are in alphabetical order, and numeric intervals are merged and in ascending order.

The syntax for a GTID set is as follows:

```sql
gtid_set:
    uuid_set [, uuid_set] ...
    | ''

uuid_set:
    uuid:interval[:interval]...

uuid:
    hhhhhhhh-hhhh-hhhh-hhhh-hhhhhhhhhhhh

h:
    [0-9|A-F]

interval:
    n[-n]

    (n >= 1)
```

##### mysql.gtid\_executed Table

GTIDs are stored in a table named `gtid_executed`, in the `mysql` database. A row in this table contains, for each GTID or set of GTIDs that it represents, the UUID of the originating server, and the starting and ending transaction IDs of the set; for a row referencing only a single GTID, these last two values are the same.

The `mysql.gtid_executed` table is created (if it does not already exist) when MySQL Server is installed or upgraded, using a `CREATE TABLE` statement similar to that shown here:

```sql
CREATE TABLE gtid_executed (
    source_uuid CHAR(36) NOT NULL,
    interval_start BIGINT(20) NOT NULL,
    interval_end BIGINT(20) NOT NULL,
    PRIMARY KEY (source_uuid, interval_start)
)
```

Warning

As with other MySQL system tables, do not attempt to create or modify this table yourself.

The `mysql.gtid_executed` table is provided for internal use by the MySQL server. It enables a replica to use GTIDs when binary logging is disabled on the replica, and it enables retention of the GTID state when the binary logs have been lost. Note that the `mysql.gtid_executed` table is cleared if you issue `RESET MASTER`.

GTIDs are stored in the `mysql.gtid_executed` table only when `gtid_mode` is `ON` or `ON_PERMISSIVE`. The point at which GTIDs are stored depends on whether binary logging is enabled or disabled:

* If binary logging is disabled (`log_bin` is `OFF`), or if `log_slave_updates` is disabled, the server stores the GTID belonging to each transaction together with the transaction in the buffer when the transaction is committed, and the background thread adds the contents of the buffer periodically as one or more entries to the `mysql.gtid_executed` table. In addition, the table is compressed periodically at a user-configurable rate; see mysql.gtid\_executed Table Compression, for more information. This situation can only apply on a replica where binary logging or replica update logging is disabled. It does not apply on a replication source server, because on the source, binary logging must be enabled for replication to take place.

* If binary logging is enabled (`log_bin` is `ON`), whenever the binary log is rotated or the server is shut down, the server writes GTIDs for all transactions that were written into the previous binary log into the `mysql.gtid_executed` table. This situation applies on a replication source server, or a replica where binary logging is enabled.

  In the event of the server stopping unexpectedly, the set of GTIDs from the current binary log file is not saved in the `mysql.gtid_executed` table. These GTIDs are added to the table from the binary log file during recovery. The exception to this is if binary logging is not enabled when the server is restarted. In this situation, the server cannot access the binary log file to recover the GTIDs, so replication cannot be started.

  When binary logging is enabled, the `mysql.gtid_executed` table does not hold a complete record of the GTIDs for all executed transactions. That information is provided by the global value of the `gtid_executed` system variable. Always use `@@GLOBAL.gtid_executed`, which is updated after every commit, to represent the GTID state for the MySQL server, and do not query the `mysql.gtid_executed` table.

##### mysql.gtid\_executed Table Compression

Over the course of time, the `mysql.gtid_executed` table can become filled with many rows referring to individual GTIDs that originate on the same server, and whose transaction IDs make up a range, similar to what is shown here:

```sql
+--------------------------------------+----------------+--------------+
| source_uuid                          | interval_start | interval_end |
|--------------------------------------+----------------+--------------|
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 37             | 37           |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 38             | 38           |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 39             | 39           |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 40             | 40           |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 41             | 41           |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 42             | 42           |
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 43             | 43           |
...
```

To save space, the MySQL server compresses the `mysql.gtid_executed` table periodically by replacing each such set of rows with a single row that spans the entire interval of transaction identifiers, like this:

```sql
+--------------------------------------+----------------+--------------+
| source_uuid                          | interval_start | interval_end |
|--------------------------------------+----------------+--------------|
| 3E11FA47-71CA-11E1-9E33-C80AA9429562 | 37             | 43           |
...
```

You can control the number of transactions that are allowed to elapse before the table is compressed, and thus the compression rate, by setting the `gtid_executed_compression_period` system variable. This variable's default value is 1000, meaning that by default, compression of the table is performed after each 1000 transactions. Setting `gtid_executed_compression_period` to 0 prevents the compression from being performed at all, and you should be prepared for a potentially large increase in the amount of disk space that may be required by the `gtid_executed` table if you do this.

Note

When binary logging is enabled, the value of `gtid_executed_compression_period` is *not* used and the `mysql.gtid_executed` table is compressed on each binary log rotation.

Compression of the `mysql.gtid_executed` table is performed by a dedicated foreground thread named `thread/sql/compress_gtid_table`. This thread is not listed in the output of `SHOW PROCESSLIST`, but it can be viewed as a row in the `threads` table, as shown here:

```sql
mysql> SELECT * FROM performance_schema.threads WHERE NAME LIKE '%gtid%'\G
*************************** 1. row ***************************
          THREAD_ID: 26
               NAME: thread/sql/compress_gtid_table
               TYPE: FOREGROUND
     PROCESSLIST_ID: 1
   PROCESSLIST_USER: NULL
   PROCESSLIST_HOST: NULL
     PROCESSLIST_DB: NULL
PROCESSLIST_COMMAND: Daemon
   PROCESSLIST_TIME: 1509
  PROCESSLIST_STATE: Suspending
   PROCESSLIST_INFO: NULL
   PARENT_THREAD_ID: 1
               ROLE: NULL
       INSTRUMENTED: YES
            HISTORY: YES
    CONNECTION_TYPE: NULL
       THREAD_OS_ID: 18677
```

The `thread/sql/compress_gtid_table` thread normally sleeps until `gtid_executed_compression_period` transactions have been executed, then wakes up to perform compression of the `mysql.gtid_executed` table as described previously. It then sleeps until another `gtid_executed_compression_period` transactions have taken place, then wakes up to perform the compression again, repeating this loop indefinitely. Setting this value to 0 when binary logging is disabled means that the thread always sleeps and never wakes up, meaning that this explicit compression method is not used. Instead, compression occurs implicitly as required.


#### 16.1.3.2 GTID Life Cycle

The life cycle of a GTID consists of the following steps:

1. A transaction is executed and committed on the replication source server. This client transaction is assigned a GTID composed of the source's UUID and the smallest nonzero transaction sequence number not yet used on this server. The GTID is written to the source's binary log (immediately preceding the transaction itself in the log). If a client transaction is not written to the binary log (for example, because the transaction was filtered out, or the transaction was read-only), it is not assigned a GTID.

2. If a GTID was assigned for the transaction, the GTID is persisted atomically at commit time by writing it to the binary log at the beginning of the transaction (as a `Gtid_log_event`). Whenever the binary log is rotated or the server is shut down, the server writes GTIDs for all transactions that were written into the previous binary log file into the `mysql.gtid_executed` table.

3. If a GTID was assigned for the transaction, the GTID is externalized non-atomically (very shortly after the transaction is committed) by adding it to the set of GTIDs in the `gtid_executed` system variable (`@@GLOBAL.gtid_executed`). This GTID set contains a representation of the set of all committed GTID transactions, and it is used in replication as a token that represents the server state. With binary logging enabled (as required for the source), the set of GTIDs in the `gtid_executed` system variable is a complete record of the transactions applied, but the `mysql.gtid_executed` table is not, because the most recent history is still in the current binary log file.

4. After the binary log data is transmitted to the replica and stored in the replica's relay log (using established mechanisms for this process, see Section 16.2, “Replication Implementation”, for details), the replica reads the GTID and sets the value of its `gtid_next` system variable as this GTID. This tells the replica that the next transaction must be logged using this GTID. It is important to note that the replica sets `gtid_next` in a session context.

5. The replica verifies that no thread has yet taken ownership of the GTID in `gtid_next` in order to process the transaction. By reading and checking the replicated transaction's GTID first, before processing the transaction itself, the replica guarantees not only that no previous transaction having this GTID has been applied on the replica, but also that no other session has already read this GTID but has not yet committed the associated transaction. So if multiple clients attempt to apply the same transaction concurrently, the server resolves this by letting only one of them execute. The `gtid_owned` system variable (`@@GLOBAL.gtid_owned`) for the replica shows each GTID that is currently in use and the ID of the thread that owns it. If the GTID has already been used, no error is raised, and the auto-skip function is used to ignore the transaction.

6. If the GTID has not been used, the replica applies the replicated transaction. Because `gtid_next` is set to the GTID already assigned by the source, the replica does not attempt to generate a new GTID for this transaction, but instead uses the GTID stored in `gtid_next`.

7. If binary logging is enabled on the replica, the GTID is persisted atomically at commit time by writing it to the binary log at the beginning of the transaction (as a `Gtid_log_event`). Whenever the binary log is rotated or the server is shut down, the server writes GTIDs for all transactions that were written into the previous binary log file into the `mysql.gtid_executed` table.

8. If binary logging is disabled on the replica, the GTID is persisted atomically by writing it directly into the `mysql.gtid_executed` table. MySQL appends a statement to the transaction to insert the GTID into the table. In this situation, the `mysql.gtid_executed` table is a complete record of the transactions applied on the replica. Note that in MySQL 5.7, the operation to insert the GTID into the table is atomic for DML statements, but not for DDL statements, so if the server exits unexpectedly after a transaction involving DDL statements, the GTID state might become inconsistent. From MySQL 8.0, the operation is atomic for DDL statements as well as for DML statements.

9. Very shortly after the replicated transaction is committed on the replica, the GTID is externalized non-atomically by adding it to the set of GTIDs in the `gtid_executed` system variable (`@@GLOBAL.gtid_executed`) for the replica. As for the source, this GTID set contains a representation of the set of all committed GTID transactions. If binary logging is disabled on the replica, the `mysql.gtid_executed` table is also a complete record of the transactions applied on the replica. If binary logging is enabled on the replica, meaning that some GTIDs are only recorded in the binary log, the set of GTIDs in the `gtid_executed` system variable is the only complete record.

Client transactions that are completely filtered out on the source are not assigned a GTID, therefore they are not added to the set of transactions in the `gtid_executed` system variable, or added to the `mysql.gtid_executed` table. However, the GTIDs of replicated transactions that are completely filtered out on the replica are persisted. If binary logging is enabled on the replica, the filtered-out transaction is written to the binary log as a `Gtid_log_event` followed by an empty transaction containing only `BEGIN` and `COMMIT` statements. If binary logging is disabled, the GTID of the filtered-out transaction is written to the `mysql.gtid_executed` table. Preserving the GTIDs for filtered-out transactions ensures that the `mysql.gtid_executed` table and the set of GTIDs in the `gtid_executed` system variable can be compressed. It also ensures that the filtered-out transactions are not retrieved again if the replica reconnects to the source, as explained in Section 16.1.3.3, “GTID Auto-Positioning”.

On a multithreaded replica (with `slave_parallel_workers > 0` ), transactions can be applied in parallel, so replicated transactions can commit out of order (unless `slave_preserve_commit_order=1` is set). When that happens, the set of GTIDs in the `gtid_executed` system variable contains multiple GTID ranges with gaps between them. (On a source or a single-threaded replica, there are monotonically increasing GTIDs without gaps between the numbers.) Gaps on multithreaded replicas only occur among the most recently applied transactions, and are filled in as replication progresses. When replication threads are stopped cleanly using the `STOP SLAVE` statement, ongoing transactions are applied so that the gaps are filled in. In the event of a shutdown such as a server failure or the use of the `KILL` statement to stop replication threads, the gaps might remain.

##### What changes are assigned a GTID?

The typical scenario is that the server generates a new GTID for a committed transaction. However, GTIDs can also be assigned to other changes besides transactions, and in some cases a single transaction can be assigned multiple GTIDs.

Every database change (DDL or DML) that is written to the binary log is assigned a GTID. This includes changes that are autocommitted, and changes that are committed using `BEGIN` and `COMMIT` or `START TRANSACTION` statements. A GTID is also assigned to the creation, alteration, or deletion of a database, and of a non-table database object such as a procedure, function, trigger, event, view, user, role, or grant.

Non-transactional updates as well as transactional updates are assigned GTIDs. In addition, for a non-transactional update, if a disk write failure occurs while attempting to write to the binary log cache and a gap is therefore created in the binary log, the resulting incident log event is assigned a GTID.

When a table is automatically dropped by a generated statement in the binary log, a GTID is assigned to the statement. Temporary tables are dropped automatically when a replica begins to apply events from a source that has just been started, and when statement-based replication is in use (`binlog_format=STATEMENT`) and a user session that has open temporary tables disconnects. Tables that use the `MEMORY` storage engine are deleted automatically the first time they are accessed after the server is started, because rows might have been lost during the shutdown.

When a transaction is not written to the binary log on the server of origin, the server does not assign a GTID to it. This includes transactions that are rolled back and transactions that are executed while binary logging is disabled on the server of origin, either globally (with `--skip-log-bin` specified in the server's configuration) or for the session (`SET @@SESSION.sql_log_bin = 0`). This also includes no-op transactions when row-based replication is in use (`binlog_format=ROW`).

XA transactions are assigned separate GTIDs for the `XA PREPARE` phase of the transaction and the `XA COMMIT` or `XA ROLLBACK` phase of the transaction. XA transactions are persistently prepared so that users can commit them or roll them back in the case of a failure (which in a replication topology might include a failover to another server). The two parts of the transaction are therefore replicated separately, so they must have their own GTIDs, even though a non-XA transaction that is rolled back would not have a GTID.

In the following special cases, a single statement can generate multiple transactions, and therefore be assigned multiple GTIDs:

* A stored procedure is invoked that commits multiple transactions. One GTID is generated for each transaction that the procedure commits.

* A multi-table `DROP TABLE` statement drops tables of different types.

* A `CREATE TABLE ... SELECT` statement is issued when row-based replication is in use (`binlog_format=ROW`). One GTID is generated for the `CREATE TABLE` action and one GTID is generated for the row-insert actions.

##### The `gtid_next` System Variable

By default, for new transactions committed in user sessions, the server automatically generates and assigns a new GTID. When the transaction is applied on a replica, the GTID from the server of origin is preserved. You can change this behavior by setting the session value of the `gtid_next` system variable:

* When `gtid_next` is set to `AUTOMATIC`, which is the default, and a transaction is committed and written to the binary log, the server automatically generates and assigns a new GTID. If a transaction is rolled back or not written to the binary log for another reason, the server does not generate and assign a GTID.

* If you set `gtid_next` to a valid GTID (consisting of a UUID and a transaction sequence number, separated by a colon), the server assigns that GTID to your transaction. This GTID is assigned and added to `gtid_executed` even when the transaction is not written to the binary log, or when the transaction is empty.

Note that after you set `gtid_next` to a specific GTID, and the transaction has been committed or rolled back, an explicit `SET @@SESSION.gtid_next` statement must be issued before any other statement. You can use this to set the GTID value back to `AUTOMATIC` if you do not want to assign any more GTIDs explicitly.

When replication applier threads apply replicated transactions, they use this technique, setting `@@SESSION.gtid_next` explicitly to the GTID of the replicated transaction as assigned on the server of origin. This means the GTID from the server of origin is retained, rather than a new GTID being generated and assigned by the replica. It also means the GTID is added to `gtid_executed` on the replica even when binary logging or replica update logging is disabled on the replica, or when the transaction is a no-op or is filtered out on the replica.

It is possible for a client to simulate a replicated transaction by setting `@@SESSION.gtid_next` to a specific GTID before executing the transaction. This technique is used by **mysqlbinlog** to generate a dump of the binary log that the client can replay to preserve GTIDs. A simulated replicated transaction committed through a client is completely equivalent to a replicated transaction committed through a replication applier thread, and they cannot be distinguished after the fact.

##### The `gtid_purged` System Variable

The set of GTIDs in the `gtid_purged` system variable (`@@GLOBAL.gtid_purged`) contains the GTIDs of all the transactions that have been committed on the server, but do not exist in any binary log file on the server. `gtid_purged` is a subset of `gtid_executed`. The following categories of GTIDs are in `gtid_purged`:

* GTIDs of replicated transactions that were committed with binary logging disabled on the replica.

* GTIDs of transactions that were written to a binary log file that has now been purged.

* GTIDs that were added explicitly to the set by the statement `SET @@GLOBAL.gtid_purged`.

You can change the value of `gtid_purged` in order to record on the server that the transactions in a certain GTID set have been applied, although they do not exist in any binary log on the server. When you add GTIDs to `gtid_purged`, they are also added to `gtid_executed`. An example use case for this action is when you are restoring a backup of one or more databases on a server, but you do not have the relevant binary logs containing the transactions on the server. In MySQL 5.7, you can only change the value of `gtid_purged` when `gtid_executed` (and therefore `gtid_purged`) is empty. For details of how to do this, see the description for `gtid_purged`.

The sets of GTIDs in the `gtid_executed` and `gtid_purged` system variables are initialized when the server starts. Every binary log file begins with the event `Previous_gtids_log_event`, which contains the set of GTIDs in all previous binary log files (composed from the GTIDs in the preceding file's `Previous_gtids_log_event`, and the GTIDs of every `Gtid_log_event` in the preceding file itself). The contents of `Previous_gtids_log_event` in the oldest and most recent binary log files are used to compute the `gtid_executed` and `gtid_purged` sets at server startup:

* `gtid_executed` is computed as the union of the GTIDs in `Previous_gtids_log_event` in the most recent binary log file, the GTIDs of transactions in that binary log file, and the GTIDs stored in the `mysql.gtid_executed` table. This GTID set contains all the GTIDs that have been used (or added explicitly to `gtid_purged`) on the server, whether or not they are currently in a binary log file on the server. It does not include the GTIDs for transactions that are currently being processed on the server (`@@GLOBAL.gtid_owned`).

* `gtid_purged` is computed by first adding the GTIDs in `Previous_gtids_log_event` in the most recent binary log file and the GTIDs of transactions in that binary log file. This step gives the set of GTIDs that are currently, or were once, recorded in a binary log on the server (`gtids_in_binlog`). Next, the GTIDs in `Previous_gtids_log_event` in the oldest binary log file are subtracted from `gtids_in_binlog`. This step gives the set of GTIDs that are currently recorded in a binary log on the server (`gtids_in_binlog_not_purged`). Finally, `gtids_in_binlog_not_purged` is subtracted from `gtid_executed`. The result is the set of GTIDs that have been used on the server, but are not currently recorded in a binary log file on the server, and this result is used to initialize `gtid_purged`.

If binary logs from MySQL 5.7.7 or older are involved in these computations, it is possible for incorrect GTID sets to be computed for `gtid_executed` and `gtid_purged`, and they remain incorrect even if the server is later restarted. For details, see the description for the `binlog_gtid_simple_recovery` system variable, which controls how the binary logs are iterated to compute the GTID sets. If one of the situations described there applies on a server, set `binlog_gtid_simple_recovery=FALSE` in the server's configuration file before starting it. That setting makes the server iterate all the binary log files (not just the newest and oldest) to find where GTID events start to appear. This process could take a long time if the server has a large number of binary log files without GTID events.

##### Resetting the GTID Execution History

If you need to reset the GTID execution history on a server, use the `RESET MASTER` statement. For example, you might need to do this after carrying out test queries to verify a replication setup on new GTID-enabled servers, or when you want to join a new server to a replication group but it contains some unwanted local transactions that are not accepted by Group Replication.

Warning

Use `RESET MASTER` with caution to avoid losing any wanted GTID execution history and binary log files.

Before issuing `RESET MASTER`, ensure that you have backups of the server's binary log files and binary log index file, if any, and obtain and save the GTID set held in the global value of the `gtid_executed` system variable (for example, by issuing a `SELECT @@GLOBAL.gtid_executed` statement and saving the results). If you are removing unwanted transactions from that GTID set, use **mysqlbinlog** to examine the contents of the transactions to ensure that they have no value, contain no data that must be saved or replicated, and did not result in data changes on the server.

When you issue `RESET MASTER`, the following reset operations are carried out:

* The value of the `gtid_purged` system variable is set to an empty string (`''`).

* The global value (but not the session value) of the `gtid_executed` system variable is set to an empty string.

* The `mysql.gtid_executed` table is cleared (see mysql.gtid\_executed Table).

* If the server has binary logging enabled, the existing binary log files are deleted and the binary log index file is cleared.

Note that `RESET MASTER` is the method to reset the GTID execution history even if the server is a replica where binary logging is disabled. `RESET SLAVE` has no effect on the GTID execution history.


#### 16.1.3.3 GTID Auto-Positioning

GTIDs replace the file-offset pairs previously required to determine points for starting, stopping, or resuming the flow of data between source and replica. When GTIDs are in use, all the information that the replica needs for synchronizing with the source is obtained directly from the replication data stream.

To start a replica using GTID-based replication, you do not include `MASTER_LOG_FILE` or `MASTER_LOG_POS` options in the `CHANGE MASTER TO` statement used to direct the replica to replicate from a given source. These options specify the name of the log file and the starting position within the file, but with GTIDs the replica does not need this nonlocal data. Instead, you need to enable the `MASTER_AUTO_POSITION` option. For full instructions to configure and start sources and replicas using GTID-based replication, see Section 16.1.3.4, “Setting Up Replication Using GTIDs”.

The `MASTER_AUTO_POSITION` option is disabled by default. If multi-source replication is enabled on the replica, you need to set this option for each applicable replication channel. Disabling the `MASTER_AUTO_POSITION` option again causes the replica to revert to position-based replication.

When a replica has GTIDs enabled (`GTID_MODE=ON`, `ON_PERMISSIVE,` or `OFF_PERMISSIVE` ) and the `MASTER_AUTO_POSITION` option enabled, auto-positioning is activated for connection to the source. The source must have `GTID_MODE=ON` set in order for the connection to succeed. In the initial handshake, the replica sends a GTID set containing the transactions that it has already received, committed, or both. This GTID set is equal to the union of the set of GTIDs in the `gtid_executed` system variable (`@@GLOBAL.gtid_executed`), and the set of GTIDs recorded in the Performance Schema `replication_connection_status` table as received transactions (the result of the statement `SELECT RECEIVED_TRANSACTION_SET FROM PERFORMANCE_SCHEMA.replication_connection_status`).

The source responds by sending all transactions recorded in its binary log whose GTID is not included in the GTID set sent by the replica. To do this, the source first identifies the appropriate binary log file to begin working with, by checking the `Previous_gtids_log_event` in the header of each of its binary log files, starting with the most recent. When the source finds the first `Previous_gtids_log_event` which contains no transactions that the replica is missing, it begins with that binary log file. This method is efficient and only takes a significant amount of time if the replica is behind the source by a large number of binary log files. The source then reads the transactions in that binary log file and subsequent files up to the current one, sending the transactions with GTIDs that the replica is missing, and skipping the transactions that were in the GTID set sent by the replica. The elapsed time until the replica receives the first missing transaction depends on its offset in the binary log file. This exchange ensures that the source only sends the transactions with a GTID that the replica has not already received or committed. If the replica receives transactions from more than one source, as in the case of a diamond topology, the auto-skip function ensures that the transactions are not applied twice.

If any of the transactions that should be sent by the source have been purged from the source's binary log, or added to the set of GTIDs in the `gtid_purged` system variable by another method, the source sends the error `ER_MASTER_HAS_PURGED_REQUIRED_GTIDS` to the replica, and replication does not start. The GTIDs of the missing purged transactions are identified and listed in the source's error log in the warning message `ER_FOUND_MISSING_GTIDS`. The replica cannot recover automatically from this error because parts of the transaction history that are needed to catch up with the source have been purged. Attempting to reconnect without the `MASTER_AUTO_POSITION` option enabled only results in the loss of the purged transactions on the replica. The correct approach to recover from this situation is for the replica to replicate the missing transactions listed in the `ER_FOUND_MISSING_GTIDS` message from another source, or for the replica to be replaced by a new replica created from a more recent backup. Consider revising the binary log expiration period on the source to ensure that the situation does not occur again.

If during the exchange of transactions it is found that the replica has received or committed transactions with the source's UUID in the GTID, but the source itself does not have a record of them, the source sends the error `ER_SLAVE_HAS_MORE_GTIDS_THAN_MASTER` to the replica and replication does not start. This situation can occur if a source that does not have `sync_binlog=1` set experiences a power failure or operating system crash, and loses committed transactions that have not yet been synchronized to the binary log file, but have been received by the replica. The source and replica can diverge if any clients commit transactions on the source after it is restarted, which can lead to the situation where the source and replica are using the same GTID for different transactions. The correct approach to recover from this situation is to check manually whether the source and replica have diverged. If the same GTID is now in use for different transactions, you either need to perform manual conflict resolution for individual transactions as required, or remove either the source or the replica from the replication topology. If the issue is only missing transactions on the source, you can make the source into a replica instead, allow it to catch up with the other servers in the replication topology, and then make it a source again if needed.


#### 16.1.3.4 Setting Up Replication Using GTIDs

This section describes a process for configuring and starting GTID-based replication in MySQL 5.7. This is a “cold start” procedure that assumes either that you are starting the replication source server for the first time, or that it is possible to stop it; for information about provisioning replicas using GTIDs from a running source, see Section 16.1.3.5, “Using GTIDs for Failover and Scaleout”. For information about changing GTID mode on servers online, see Section 16.1.4, “Changing Replication Modes on Online Servers”.

The key steps in this startup process for the simplest possible GTID replication topology, consisting of one source and one replica, are as follows:

1. If replication is already running, synchronize both servers by making them read-only.

2. Stop both servers.
3. Restart both servers with GTIDs enabled and the correct options configured.

   The `mysqld` options necessary to start the servers as described are discussed in the example that follows later in this section.

4. Instruct the replica to use the source as the replication data source and to use auto-positioning. The SQL statements needed to accomplish this step are described in the example that follows later in this section.

5. Take a new backup. Binary logs containing transactions without GTIDs cannot be used on servers where GTIDs are enabled, so backups taken before this point cannot be used with your new configuration.

6. Start the replica, then disable read-only mode on both servers, so that they can accept updates.

In the following example, two servers are already running as source and replica, using MySQL's binary log position-based replication protocol. If you are starting with new servers, see Section 16.1.2.2, “Creating a User for Replication” for information about adding a specific user for replication connections and Section 16.1.2.1, “Setting the Replication Source Configuration” for information about setting the `server_id` variable. The following examples show how to store `mysqld` startup options in server's option file, see Section 4.2.2.2, “Using Option Files” for more information. Alternatively you can use startup options when running `mysqld`.

Most of the steps that follow require the use of the MySQL `root` account or another MySQL user account that has the `SUPER` privilege. **mysqladmin** `shutdown` requires either the `SUPER` privilege or the `SHUTDOWN` privilege.

**Step 1: Synchronize the servers.** This step is only required when working with servers which are already replicating without using GTIDs. For new servers proceed to Step 3. Make the servers read-only by setting the `read_only` system variable to `ON` on each server by issuing the following:

```sql
mysql> SET @@GLOBAL.read_only = ON;
```

Wait for all ongoing transactions to commit or roll back. Then, allow the replica to catch up with the source. *It is extremely important that you make sure the replica has processed all updates before continuing*.

If you use binary logs for anything other than replication, for example to do point in time backup and restore, wait until you do not need the old binary logs containing transactions without GTIDs. Ideally, wait for the server to purge all binary logs, and wait for any existing backup to expire.

Important

It is important to understand that logs containing transactions without GTIDs cannot be used on servers where GTIDs are enabled. Before proceeding, you must be sure that transactions without GTIDs do not exist anywhere in the topology.

**Step 2: Stop both servers.** Stop each server using **mysqladmin** as shown here, where *`username`* is the user name for a MySQL user having sufficient privileges to shut down the server:

```sql
$> mysqladmin -uusername -p shutdown
```

Then supply this user's password at the prompt.

**Step 3: Start both servers with GTIDs enabled.** To enable GTID-based replication, each server must be started with GTID mode enabled by setting the `gtid_mode` variable to `ON`, and with the `enforce_gtid_consistency` variable enabled to ensure that only statements which are safe for GTID-based replication are logged. For example:

```sql
gtid_mode=ON
enforce-gtid-consistency=ON
```

In addition, you should start replicas with the `--skip-slave-start` option before configuring the replica settings. For more information on GTID related options and variables, see Section 16.1.6.5, “Global Transaction ID System Variables”.

It is not mandatory to have binary logging enabled in order to use GTIDs when using the mysql.gtid\_executed Table. Replication source server must always have binary logging enabled in order to be able to replicate. However, replica servers can use GTIDs but without binary logging. If you need to disable binary logging on a replica, you can do this by specifying the `--skip-log-bin` and `--log-slave-updates=OFF` options for the replica.

**Step 4: Configure the replica to use GTID-based auto-positioning.** Tell the replica to use the source with GTID based transactions as the replication data source, and to use GTID-based auto-positioning rather than file-based positioning. Issue a `CHANGE MASTER TO` statement on the replica, including the `MASTER_AUTO_POSITION` option in the statement to tell the replica that the source's transactions are identified by GTIDs.

You may also need to supply appropriate values for the source's host name and port number as well as the user name and password for a replication user account which can be used by the replica to connect to the source; if these have already been set prior to Step 1 and no further changes need to be made, the corresponding options can safely be omitted from the statement shown here.

```sql
mysql> CHANGE MASTER TO
     >     MASTER_HOST = host,
     >     MASTER_PORT = port,
     >     MASTER_USER = user,
     >     MASTER_PASSWORD = password,
     >     MASTER_AUTO_POSITION = 1;
```

Neither the `MASTER_LOG_FILE` option nor the `MASTER_LOG_POS` option may be used with `MASTER_AUTO_POSITION` set equal to 1. Attempting to do so causes the `CHANGE MASTER TO` statement to fail with an error.

**Step 5: Take a new backup.** Existing backups that were made before you enabled GTIDs can no longer be used on these servers now that you have enabled GTIDs. Take a new backup at this point, so that you are not left without a usable backup.

For instance, you can execute `FLUSH LOGS` on the server where you are taking backups. Then either explicitly take a backup or wait for the next iteration of any periodic backup routine you may have set up.

**Step 6: Start the replica and disable read-only mode.** Start the replica like this:

```sql
mysql> START SLAVE;
```

The following step is only necessary if you configured a server to be read-only in Step 1. To allow the server to begin accepting updates again, issue the following statement:

```sql
mysql> SET @@GLOBAL.read_only = OFF;
```

GTID-based replication should now be running, and you can begin (or resume) activity on the source as before. Section 16.1.3.5, “Using GTIDs for Failover and Scaleout”, discusses creation of new replicas when using GTIDs.


#### 16.1.3.5 Using GTIDs for Failover and Scaleout

There are a number of techniques when using MySQL Replication with Global Transaction Identifiers (GTIDs) for provisioning a new replica which can then be used for scaleout, being promoted to source as necessary for failover. This section describes the following techniques:

* Simple replication
* Copying data and transactions to the replica
* Injecting empty transactions
* Excluding transactions with gtid\_purged
* Restoring GTID mode replicas

Global transaction identifiers were added to MySQL Replication for the purpose of simplifying in general management of the replication data flow and of failover activities in particular. Each identifier uniquely identifies a set of binary log events that together make up a transaction. GTIDs play a key role in applying changes to the database: the server automatically skips any transaction having an identifier which the server recognizes as one that it has processed before. This behavior is critical for automatic replication positioning and correct failover.

The mapping between identifiers and sets of events comprising a given transaction is captured in the binary log. This poses some challenges when provisioning a new server with data from another existing server. To reproduce the identifier set on the new server, it is necessary to copy the identifiers from the old server to the new one, and to preserve the relationship between the identifiers and the actual events. This is necessary for restoring a replica that is immediately available as a candidate to become a new source on failover or switchover.

**Simple replication.** The easiest way to reproduce all identifiers and transactions on a new server is to make the new server into the replica of a source that has the entire execution history, and enable global transaction identifiers on both servers. See Section 16.1.3.4, “Setting Up Replication Using GTIDs”, for more information.

Once replication is started, the new server copies the entire binary log from the source and thus obtains all information about all GTIDs.

This method is simple and effective, but requires the replica to read the binary log from the source; it can sometimes take a comparatively long time for the new replica to catch up with the source, so this method is not suitable for fast failover or restoring from backup. This section explains how to avoid fetching all of the execution history from the source by copying binary log files to the new server.

**Copying data and transactions to the replica.** Executing the entire transaction history can be time-consuming when the source server has processed a large number of transactions previously, and this can represent a major bottleneck when setting up a new replica. To eliminate this requirement, a snapshot of the data set, the binary logs and the global transaction information the source server contains can be imported to the new replica. The source server can be either the source or the replica, but you must ensure that the source has processed all required transactions before copying the data.

There are several variants of this method, the difference being in the manner in which data dumps and transactions from binary logs are transfered to the replica, as outlined here:

Data Set :   1. Create a dump file using **mysqldump** on the source server. Set the **mysqldump** option `--master-data` (with the default value of 1) to include a `CHANGE MASTER TO` statement with binary logging information. Set the `--set-gtid-purged` option to `AUTO` (the default) or `ON`, to include information about executed transactions in the dump. Then use the **mysql** client to import the dump file on the target server.

    2. Alternatively, create a data snapshot of the source server using raw data files, then copy these files to the target server, following the instructions in Section 16.1.2.4, “Choosing a Method for Data Snapshots”. If you use `InnoDB` tables, you can use the **mysqlbackup** command from the MySQL Enterprise Backup component to produce a consistent snapshot. This command records the log name and offset corresponding to the snapshot to be used on the replica. MySQL Enterprise Backup is a commercial product that is included as part of a MySQL Enterprise subscription. See Section 28.1, “MySQL Enterprise Backup Overview” for detailed information.

    3. Alternatively, stop both the source and target servers, copy the contents of the source's data directory to the new replica's data directory, then restart the replica. If you use this method, the replica must be configured for GTID-based replication, in other words with `gtid_mode=ON`. For instructions and important information for this method, see Section 16.1.2.6, “Adding Replicas to a Replication Topology”.

Transaction History :   If the source server has a complete transaction history in its binary logs (that is, the GTID set `@@GLOBAL.gtid_purged` is empty), you can use these methods.

    1. Import the binary logs from the source server to the new replica using **mysqlbinlog**, with the `--read-from-remote-server` and `--read-from-remote-master` options.

    2. Alternatively, copy the source server's binary log files to the replica. You can make copies from the replica using **mysqlbinlog** with the `--read-from-remote-server` and `--raw` options. These can be read into the replica by using **mysqlbinlog** `>` `file` (without the `--raw` option) to export the binary log files to SQL files, then passing these files to the **mysql** client for processing. Ensure that all of the binary log files are processed using a single **mysql** process, rather than multiple connections. For example:

       ```sql
       $> mysqlbinlog copied-binlog.000001 copied-binlog.000002 | mysql -u root -p
       ```

       For more information, see Section 4.6.7.3, “Using mysqlbinlog to Back Up Binary Log Files”.

This method has the advantage that a new server is available almost immediately; only those transactions that were committed while the snapshot or dump file was being replayed still need to be obtained from the existing source. This means that the replica's availability is not instantanteous, but only a relatively short amount of time should be required for the replica to catch up with these few remaining transactions.

Copying over binary logs to the target server in advance is usually faster than reading the entire transaction execution history from the source in real time. However, it may not always be feasible to move these files to the target when required, due to size or other considerations. The two remaining methods for provisioning a new replica discussed in this section use other means to transfer information about transactions to the new replica.

**Injecting empty transactions.** The source's global `gtid_executed` variable contains the set of all transactions executed on the source. Rather than copy the binary logs when taking a snapshot to provision a new server, you can instead note the content of `gtid_executed` on the server from which the snapshot was taken. Before adding the new server to the replication chain, simply commit an empty transaction on the new server for each transaction identifier contained in the source's `gtid_executed`, like this:

```sql
SET GTID_NEXT='aaa-bbb-ccc-ddd:N';

BEGIN;
COMMIT;

SET GTID_NEXT='AUTOMATIC';
```

Once all transaction identifiers have been reinstated in this way using empty transactions, you must flush and purge the replica's binary logs, as shown here, where *`N`* is the nonzero suffix of the current binary log file name:

```sql
FLUSH LOGS;
PURGE BINARY LOGS TO 'source-bin.00000N';
```

You should do this to prevent this server from flooding the replication stream with false transactions in the event that it is later promoted to source. (The `FLUSH LOGS` statement forces the creation of a new binary log file; `PURGE BINARY LOGS` purges the empty transactions, but retains their identifiers.)

This method creates a server that is essentially a snapshot, but in time is able to become a source as its binary log history converges with that of the replication stream (that is, as it catches up with the source or sources). This outcome is similar in effect to that obtained using the remaining provisioning method, which we discuss in the next few paragraphs.

**Excluding transactions with gtid\_purged.** The source's global `gtid_purged` variable contains the set of all transactions that have been purged from the source's binary log. As with the method discussed previously (see Injecting empty transactions), you can record the value of `gtid_executed` on the server from which the snapshot was taken (in place of copying the binary logs to the new server). Unlike the previous method, there is no need to commit empty transactions (or to issue `PURGE BINARY LOGS`); instead, you can set `gtid_purged` on the replica directly, based on the value of `gtid_executed` on the server from which the backup or snapshot was taken.

As with the method using empty transactions, this method creates a server that is functionally a snapshot, but in time is able to become a source as its binary log history converges with that of the replication source server or the group.

**Restoring GTID mode replicas.** When restoring a replica in a GTID based replication setup that has encountered an error, injecting an empty transaction may not solve the problem because an event does not have a GTID.

Use **mysqlbinlog** to find the next transaction, which is probably the first transaction in the next log file after the event. Copy everything up to the `COMMIT` for that transaction, being sure to include the `SET @@SESSION.GTID_NEXT`. Even if you are not using row-based replication, you can still run binary log row events in the command line client.

Stop the replica and run the transaction you copied. The **mysqlbinlog** output sets the delimiter to `/*!*/;`, so set it back:

```sql
mysql> DELIMITER ;
```

Restart replication from the correct position automatically:

```sql
mysql> SET GTID_NEXT=automatic;
mysql> RESET SLAVE;
mysql> START SLAVE;
```


#### 16.1.3.6 Restrictions on Replication with GTIDs

Because GTID-based replication is dependent on transactions, some features otherwise available in MySQL are not supported when using it. This section provides information about restrictions on and limitations of replication with GTIDs.

**Updates involving nontransactional storage engines.** When using GTIDs, updates to tables using nontransactional storage engines such as `MyISAM` cannot be made in the same statement or transaction as updates to tables using transactional storage engines such as `InnoDB`.

This restriction is due to the fact that updates to tables that use a nontransactional storage engine mixed with updates to tables that use a transactional storage engine within the same transaction can result in multiple GTIDs being assigned to the same transaction.

Such problems can also occur when the source and the replica use different storage engines for their respective versions of the same table, where one storage engine is transactional and the other is not. Also be aware that triggers that are defined to operate on nontransactional tables can be the cause of these problems.

In any of the cases just mentioned, the one-to-one correspondence between transactions and GTIDs is broken, with the result that GTID-based replication cannot function correctly.

**CREATE TABLE ... SELECT statements.** `CREATE TABLE ... SELECT` statements are not allowed when using GTID-based replication. When `binlog_format` is set to STATEMENT, a `CREATE TABLE ... SELECT` statement is recorded in the binary log as one transaction with one GTID, but if ROW format is used, the statement is recorded as two transactions with two GTIDs. If a source used STATEMENT format and a replica used ROW format, the replica would be unable to handle the transaction correctly, therefore the `CREATE TABLE ... SELECT` statement is disallowed with GTIDs to prevent this scenario.

**Temporary tables.** `CREATE TEMPORARY TABLE` and `DROP TEMPORARY TABLE` statements are not supported inside transactions, procedures, functions, and triggers when using GTIDs (that is, when the `enforce_gtid_consistency` system variable is set to `ON`). It is possible to use these statements with GTIDs enabled, but only outside of any transaction, and only with `autocommit=1`.

**Preventing execution of unsupported statements.** To prevent execution of statements that would cause GTID-based replication to fail, all servers must be started with the `--enforce-gtid-consistency` option when enabling GTIDs. This causes statements of any of the types discussed previously in this section to fail with an error.

Note that `--enforce-gtid-consistency` only takes effect if binary logging takes place for a statement. If binary logging is disabled on the server, or if statements are not written to the binary log because they are removed by a filter, GTID consistency is not checked or enforced for the statements that are not logged.

For information about other required startup options when enabling GTIDs, see Section 16.1.3.4, “Setting Up Replication Using GTIDs”.

**Skipping transactions.** `sql_slave_skip_counter` is not supported when using GTIDs. If you need to skip transactions, use the value of the source's `gtid_executed` variable instead. For instructions, see Section 16.1.7.3, “Skipping Transactions”.

**Ignoring servers.** The IGNORE\_SERVER\_IDS option of the `CHANGE MASTER TO` statement is deprecated when using GTIDs, because transactions that have already been applied are automatically ignored. Before starting GTID-based replication, check for and clear all ignored server ID lists that have previously been set on the servers involved. The `SHOW SLAVE STATUS` statement, which can be issued for individual channels, displays the list of ignored server IDs if there is one. If there is no list, the `Replicate_Ignore_Server_Ids` field is blank.

**GTID mode and mysqldump.** It is possible to import a dump made using **mysqldump** into a MySQL server running with GTID mode enabled, provided that there are no GTIDs in the target server's binary log.

**GTID mode and mysql_upgrade.** When the server is running with global transaction identifiers (GTIDs) enabled (`gtid_mode=ON`), do not enable binary logging by `mysqld_upgrade` (the `--write-binlog` option).


#### 16.1.3.7 Stored Function Examples to Manipulate GTIDs

This section provides examples of stored functions (see Chapter 23, *Stored Objects*) which you can create using some of the built-in functions provided by MySQL for use with GTID-based replication, listed here:

* `GTID_SUBSET()`: Shows whether one GTID set is a subset of another.

* `GTID_SUBTRACT()`: Returns the GTIDs from one GTID set that are not in another.

* `WAIT_FOR_EXECUTED_GTID_SET()`: Waits until all transactions in a given GTID set have been executed.

See Section 12.18, “Functions Used with Global Transaction Identifiers (GTIDs)”"), more more information about the functions just listed.

Note that in these stored functions, the delimiter command has been used to change the MySQL statement delimiter to a vertical bar, like this:

```sql
mysql> delimiter |
```

All of the stored functions shown in this section take string representations of GTID sets as arguments, so GTID sets must always be quoted when used with them.

This function returns nonzero (true) if two GTID sets are the same set, even if they are not formatted in the same way:

```sql
CREATE FUNCTION GTID_IS_EQUAL(gs1 LONGTEXT, gs2 LONGTEXT)
  RETURNS INT
  RETURN GTID_SUBSET(gs1, gs2) AND GTID_SUBSET(gs2, gs1)
|
```

This function returns nonzero (true) if two GTID sets are disjoint:

```sql
CREATE FUNCTION GTID_IS_DISJOINT(gs1 LONGTEXT, gs2 LONGTEXT)
RETURNS INT
  RETURN GTID_SUBSET(gs1, GTID_SUBTRACT(gs1, gs2))
|
```

This function returns nonzero (true) if two GTID sets are disjoint and `sum` is their union:

```sql
CREATE FUNCTION GTID_IS_DISJOINT_UNION(gs1 LONGTEXT, gs2 LONGTEXT, sum LONGTEXT)
RETURNS INT
  RETURN GTID_IS_EQUAL(GTID_SUBTRACT(sum, gs1), gs2) AND
         GTID_IS_EQUAL(GTID_SUBTRACT(sum, gs2), gs1)
|
```

This function returns a normalized form of the GTID set, in all uppercase, with no whitespace and no duplicates, with UUIDs in alphabetic order and intervals in numeric order:

```sql
CREATE FUNCTION GTID_NORMALIZE(gs LONGTEXT)
RETURNS LONGTEXT
  RETURN GTID_SUBTRACT(gs, '')
|
```

This function returns the union of two GTID sets:

```sql
CREATE FUNCTION GTID_UNION(gs1 LONGTEXT, gs2 LONGTEXT)
RETURNS LONGTEXT
  RETURN GTID_NORMALIZE(CONCAT(gs1, ',', gs2))
|
```

This function returns the intersection of two GTID sets.

```sql
CREATE FUNCTION GTID_INTERSECTION(gs1 LONGTEXT, gs2 LONGTEXT)
RETURNS LONGTEXT
  RETURN GTID_SUBTRACT(gs1, GTID_SUBTRACT(gs1, gs2))
|
```

This function returns the symmetric difference between two GTID sets, that is, the GTIDs that exist in `gs1` but not in `gs2`, as well as the GTIDs that exist in `gs2` but not in `gs1`.

```sql
CREATE FUNCTION GTID_SYMMETRIC_DIFFERENCE(gs1 LONGTEXT, gs2 LONGTEXT)
RETURNS LONGTEXT
  RETURN GTID_SUBTRACT(CONCAT(gs1, ',', gs2), GTID_INTERSECTION(gs1, gs2))
|
```

This function removes from a GTID set all the GTIDs with the specified origin, and returns the remaining GTIDs, if any. The UUID is the identifier used by the server where the transaction originated, which is normally the value of `server_uuid`.

```sql
CREATE FUNCTION GTID_SUBTRACT_UUID(gs LONGTEXT, uuid TEXT)
RETURNS LONGTEXT
  RETURN GTID_SUBTRACT(gs, CONCAT(UUID, ':1-', (1 << 63) - 2))
|
```

This function acts as the reverse of the previous one; it returns only those GTIDs from the GTID set that originate from the server with the specified identifier (UUID).

```sql
CREATE FUNCTION GTID_INTERSECTION_WITH_UUID(gs LONGTEXT, uuid TEXT)
RETURNS LONGTEXT
  RETURN GTID_SUBTRACT(gs, GTID_SUBTRACT_UUID(gs, uuid))
|
```

**Example 16.1 Verifying that a replica is up to date**

The built-in functions `GTID_SUBSET()` and `GTID_SUBTRACT()` can be used to check that a replica has applied at least every transaction that a source has applied.

To perform this check with `GTID_SUBSET()`, execute the following statement on the replica:

```sql
SELECT GTID_SUBSET(source_gtid_executed, replica_gtid_executed);
```

If the returns value is `0` (false), this means that some GTIDs in *`source_gtid_executed`* are not present in *`replica_gtid_executed`*, and that the replica has not yet applied transactions that were applied on the source, which means that the replica is not up to date.

To perform the same check with `GTID_SUBTRACT()`, execute the following statement on the replica:

```sql
SELECT GTID_SUBTRACT(source_gtid_executed, replica_gtid_executed);
```

This statement returns any GTIDs that are in *`source_gtid_executed`* but not in *`replica_gtid_executed`*. If any GTIDs are returned, the source has applied some transactions that the replica has not applied, and the replica is therefore not up to date.

**Example 16.2 Backup and restore scenario**

The stored functions `GTID_IS_EQUAL()`, `GTID_IS_DISJOINT()`, and `GTID_IS_DISJOINT_UNION()` can be used to verify backup and restore operations involving multiple databases and servers. In this example scenario, `server1` contains database `db1`, and `server2` contains database `db2`. The goal is to copy database `db2` to `server1`, and the result on `server1` should be the union of the two databases. The procedure used is to back up `server2` using **mysqldump**, then to restore this backup on `server1`.

Provided that **mysqldump** was run with `--set-gtid-purged` set to `ON` or `AUTO` (the default), the output contains a `SET @@GLOBAL.gtid_purged` statement which adds the `gtid_executed` set from `server2` to the `gtid_purged` set on `server1`. `gtid_purged` contains the GTIDs of all the transactions that have been committed on a given server but which do not exist in any binary log file on the server. When database `db2` is copied to `server1`, the GTIDs of the transactions committed on `server2`, which are not in the binary log files on `server1`, must be added to `gtid_purged` for `server1` to make the set complete.

The stored functions can be used to assist with the following steps in this scenario:

* Use `GTID_IS_EQUAL()` to verify that the backup operation computed the correct GTID set for the `SET @@GLOBAL.gtid_purged` statement. On `server2`, extract that statement from the **mysqldump** output, and store the GTID set into a local variable, such as `$gtid_purged_set`. Then execute the following statement:

  ```sql
  server2> SELECT GTID_IS_EQUAL($gtid_purged_set, @@GLOBAL.gtid_executed);
  ```

  If the result is 1, the two GTID sets are equal, and the set has been computed correctly.

* Use `GTID_IS_DISJOINT()` to verify that the GTID set in the **mysqldump** output does not overlap with the `gtid_executed` set on `server1`. Having identical GTIDs present on both servers causes errors when copying database `db2` to `server1`. To check, on `server1`, extract and store `gtid_purged` from the output into a local variable as done previously, then execute the following statement:

  ```sql
  server1> SELECT GTID_IS_DISJOINT($gtid_purged_set, @@GLOBAL.gtid_executed);
  ```

  If the result is 1, there is no overlap between the two GTID sets, so no duplicate GTIDs are present.

* Use `GTID_IS_DISJOINT_UNION()` to verify that the restore operation resulted in the correct GTID state on `server1`. Before restoring the backup, on `server1`, obtain the existing `gtid_executed` set by executing the following statement:

  ```sql
  server1> SELECT @@GLOBAL.gtid_executed;
  ```

  Store the result in a local variable `$original_gtid_executed`, as well as the set from `gtid_purged` in another local variable as described previously. When the backup from `server2` has been restored onto `server1`, execute the following statement to verify the GTID state:

  ```sql
  server1> SELECT
        ->   GTID_IS_DISJOINT_UNION($original_gtid_executed,
        ->                          $gtid_purged_set,
        ->                          @@GLOBAL.gtid_executed);
  ```

  If the result is `1`, the stored function has verified that the original `gtid_executed` set from `server1` (`$original_gtid_executed`) and the `gtid_purged` set that was added from `server2` (`$gtid_purged_set`) have no overlap, and that the updated `gtid_executed` set on `server1` now consists of the previous `gtid_executed` set from `server1` plus the `gtid_purged` set from `server2`, which is the desired result. Ensure that this check is carried out before any further transactions take place on `server1`, otherwise the new transactions in `gtid_executed` cause it to fail.

**Example 16.3 Selecting the most up-to-date replica for manual failover**

The stored function `GTID_UNION()` can be used to identify the most up-to-date replica from a set of replicas, in order to perform a manual failover operation after a source server has stopped unexpectedly. If some of the replicas are experiencing replication lag, this stored function can be used to compute the most up-to-date replica without waiting for all the replicas to apply their existing relay logs, and therefore to minimize the failover time. The function can return the union of `gtid_executed` on each replica with the set of transactions received by the replica, which is recorded in the Performance Schema `replication_connection_status` table. You can compare these results to find which replica's record of transactions is the most up to date, even if not all of the transactions have been committed yet.

On each replica, compute the complete record of transactions by issuing the following statement:

```sql
SELECT GTID_UNION(RECEIVED_TRANSACTION_SET, @@GLOBAL.gtid_executed)
    FROM performance_schema.replication_connection_status
    WHERE channel_name = 'name';
```

You can then compare the results from each replica to see which one has the most up-to-date record of transactions, and use this replica as the new source.

**Example 16.4 Checking for extraneous transactions on a replica**

The stored function `GTID_SUBTRACT_UUID()` can be used to check whether a replica has received transactions that did not originate from its designated source or sources. If it has, there might be an issue with your replication setup, or with a proxy, router, or load balancer. This function works by removing from a GTID set all the GTIDs from a specified originating server, and returning the remaining GTIDs, if any.

For a replica with a single source, issue the following statement, giving the identifier of the originating source, which is normally the same as `server_uuid`:

```sql
SELECT GTID_SUBTRACT_UUID(@@GLOBAL.gtid_executed, server_uuid_of_source);
```

If the result is not empty, the transactions returned are extra transactions that did not originate from the designated source.

For a replica in a multisource topology, include the server UUID of each source in the function call, like this:

```sql
SELECT
  GTID_SUBTRACT_UUID(GTID_SUBTRACT_UUID(@@GLOBAL.gtid_executed,
                                        server_uuid_of_source_1),
                                        server_uuid_of_source_2);
```

If the result is not empty, the transactions returned are extra transactions that did not originate from any of the designated sources.

**Example 16.5 Verifying that a server in a replication topology is read-only**

The stored function `GTID_INTERSECTION_WITH_UUID()` can be used to verify that a server has not originated any GTIDs and is in a read-only state. The function returns only those GTIDs from the GTID set that originate from the server with the specified identifier. If any of the transactions listed in `gtid_executed` from this server use the server's own identifier, the server itself originated those transactions. You can issue the following statement on the server to check:

```sql
SELECT GTID_INTERSECTION_WITH_UUID(@@GLOBAL.gtid_executed, my_server_uuid);
```

**Example 16.6 Validating an additional replica in multisource replication**

The stored function `GTID_INTERSECTION_WITH_UUID()` can be used to find out if a replica attached to a multisource replication setup has applied all the transactions originating from one particular source. In this scenario, `source1` and `source2` are both sources and replicas and replicate to each other. `source2` also has its own replica. The replica also receives and applies transactions from `source1` if `source2` is configured with `log_replica_updates=ON`, but it does not do so if `source2` uses `log_replica_updates=OFF`. Whichever the case, we currently want only to find out if the replica is up to date with `source2`. In this situation, `GTID_INTERSECTION_WITH_UUID()` can be used to identify the transactions that `source2` originated, discarding the transactions that `source2` has replicated from `source1`. The built-in function `GTID_SUBSET()` can then be used to compare the result with the `gtid_executed` set on the replica. If the replica is up to date with `source2`, the `gtid_executed` set on the replica contains all the transactions in the intersection set (the transactions that originated from `source2`).

To carry out this check, store the values of `gtid_executed` and the server UUID from `source2` and the value of `gtid_executed` from the replica into user variables as follows:

```sql
source2> SELECT @@GLOBAL.gtid_executed INTO @source2_gtid_executed;

source2> SELECT @@GLOBAL.server_uuid INTO @source2_server_uuid;

replica> SELECT @@GLOBAL.gtid_executed INTO @replica_gtid_executed;
```

Then use `GTID_INTERSECTION_WITH_UUID()` and `GTID_SUBSET()` with these variables as input, as follows:

```sql
SELECT
  GTID_SUBSET(
    GTID_INTERSECTION_WITH_UUID(@source2_gtid_executed,
                                @source2_server_uuid),
                                @replica_gtid_executed);
```

The server identifier from `source2` (`@source2_server_uuid`) is used with `GTID_INTERSECTION_WITH_UUID()` to identify and return only those GTIDs from the set of GTIDs that originated on `source2`, omitting those that originated on `source1`. The resulting GTID set is then compared with the set of all executed GTIDs on the replica, using `GTID_SUBSET()`. If this statement returns nonzero (true), all the identified GTIDs from `source2` (the first set input) are also found in `gtid_executed` from the replica, meaning that the replica has received and executed all the transactions that originated from `source2`.


### 16.1.4 Changing Replication Modes on Online Servers

This section describes how to change the mode of replication being used without having to take the server offline.


#### 16.1.4.1 Replication Mode Concepts

To be able to safely configure the replication mode of an online server it is important to understand some key concepts of replication. This section explains these concepts and is essential reading before attempting to modify the replication mode of an online server.

The modes of replication available in MySQL rely on different techniques for identifying transactions which are logged. The types of transactions used by replication are as follows:

* GTID transactions are identified by a global transaction identifier (GTID) in the form `UUID:NUMBER`. Every GTID transaction in a log is always preceded by a `Gtid_log_event`. GTID transactions can be addressed using either the GTID or using the file name and position.

* Anonymous transactions do not have a GTID assigned, and MySQL ensures that every anonymous transaction in a log is preceded by an `Anonymous_gtid_log_event`. In previous versions, anonymous transactions were not preceded by any particular event. Anonymous transactions can only be addressed using file name and position.

When using GTIDs you can take advantage of auto-positioning and automatic fail-over, as well as use `WAIT_FOR_EXECUTED_GTID_SET()`, `session_track_gtids`, and monitor replicated transactions using Performance Schema tables. With GTIDs enabled you cannot use `sql_slave_skip_counter`, instead use empty transactions.

Transactions in a relay log that was received from a source running a previous version of MySQL may not be preceded by any particular event at all, but after being replayed and logged in the replica's binary log, they are preceded with an `Anonymous_gtid_log_event`.

The ability to configure the replication mode online means that the `gtid_mode` and `enforce_gtid_consistency` variables are now both dynamic and can be set from a top-level statement by an account that has privileges sufficient to set global system variables. See Section 5.1.8.1, “System Variable Privileges”. In previous versions, both of these variables could only be configured using the appropriate option at server start, meaning that changes to the replication mode required a server restart. In all versions `gtid_mode` could be set to `ON` or `OFF`, which corresponded to whether GTIDs were used to identify transactions or not. When `gtid_mode=ON` it is not possible to replicate anonymous transactions, and when `gtid_mode=OFF` only anonymous transactions can be replicated. As of MySQL 5.7.6, the `gtid_mode` variable has two additional states, `OFF_PERMISSIVE` and `ON_PERMISSIVE`. When `gtid_mode=OFF_PERMISSIVE` then *new* transactions are anonymous while permitting replicated transactions to be either GTID or anonymous transactions. When `gtid_mode=ON_PERMISSIVE` then *new* transactions use GTIDs while permitting replicated transactions to be either GTID or anonymous transactions. This means it is possible to have a replication topology that has servers using both anonymous and GTID transactions. For example a source with `gtid_mode=ON` could be replicating to a replica with `gtid_mode=ON_PERMISSIVE`. The valid values for `gtid_mode` are as follows and in this order:

* `OFF`
* `OFF_PERMISSIVE`
* `ON_PERMISSIVE`
* `ON`

It is important to note that the state of `gtid_mode` can only be changed by one step at a time based on the above order. For example, if `gtid_mode` is currently set to `OFF_PERMISSIVE`, it is possible to change to `OFF` or `ON_PERMISSIVE` but not to `ON`. This is to ensure that the process of changing from anonymous transactions to GTID transactions online is correctly handled by the server. When you switch between `gtid_mode=ON` and `gtid_mode=OFF`, the GTID state (in other words the value of `gtid_executed`) is persistent. This ensures that the GTID set that has been applied by the server is always retained, regardless of changes between types of `gtid_mode`.

As part of the changes introduced by MySQL 5.7.6, the fields related to GTIDs have been modified so that they display the correct information regardless of the currently selected `gtid_mode`. This means that fields which display GTID sets, such as `gtid_executed`, `gtid_purged`, `RECEIVED_TRANSACTION_SET` in the `replication_connection_status` Performance Schema table, and the GTID related results of `SHOW SLAVE STATUS`, now return the empty string when there are no GTIDs present. Fields that display a single GTID, such as `CURRENT_TRANSACTION` in the Performance Schema `replication_applier_status_by_worker` table, now display `ANONYMOUS` when GTID transactions are not being used.

Replication from a source using `gtid_mode=ON` provides the ability to use auto-positioning, configured using the `CHANGE MASTER TO MASTER_AUTO_POSITION = 1;` statement. The replication topology being used impacts on whether it is possible to enable auto-positioning or not, as this feature relies on GTIDs and is not compatible with anonymous transactions. An error is generated if auto-positioning is enabled and an anonymous transaction is encountered. It is strongly recommended to ensure there are no anonymous transactions remaining in the topology before enabling auto-positioning, see Section 16.1.4.2, “Enabling GTID Transactions Online”. The valid combinations of `gtid_mode` and auto-positioning on source and replica are shown in the following table, where the source's `gtid_mode` is shown on the horizontal and the replica's `gtid_mode` is on the vertical:

**Table 16.1 Valid Combinations of Source and Replica gtid\_mode**

<table width="708"><col style="width: 2%"/><col style="width: 1%"/><col style="width: 2%"/><col style="width: 21%"/><col style="width: 17%"/><thead><tr> <th><p> <code>gtid_mode</code> </p></th> <th><p> Source <code>OFF</code> </p></th> <th><p> Source <code>OFF_PERMISSIVE</code> </p></th> <th><p> Source <code>ON_PERMISSIVE</code> </p></th> <th><p> Source <code>ON</code> </p></th> </tr></thead><tbody><tr> <th><p> Replica <code>OFF</code> </p></th> <td><p> Y </p></td> <td><p> Y </p></td> <td><p> N </p></td> <td><p> N </p></td> </tr><tr> <th><p> Replica <code>OFF_PERMISSIVE</code> </p></th> <td><p> Y </p></td> <td><p> Y </p></td> <td><p> Y </p></td> <td><p> Y* </p></td> </tr><tr> <th><p> Replica <code>ON_PERMISSIVE</code> </p></th> <td><p> Y </p></td> <td><p> Y </p></td> <td><p> Y </p></td> <td><p> Y* </p></td> </tr><tr> <th><p> Replica <code>ON</code> </p></th> <td><p> N </p></td> <td><p> N </p></td> <td><p> Y </p></td> <td><p> Y* </p></td> </tr></tbody></table>

In the above table, the entries are:

* `Y`: the `gtid_mode` of source and replica is compatible

* `N`: the `gtid_mode` of source and replica is not compatible

* `*`: auto-positioning can be used

The currently selected `gtid_mode` also impacts on the `gtid_next` variable. The following table shows the behavior of the server for the different values of `gtid_mode` and `gtid_next`.

**Table 16.2 Valid Combinations of gtid\_mode and gtid\_next**

<table><col style="width: 2.03%"/><col style="width: 1%"/><col style="width: 2.01%"/><col style="width: 1.92%"/><col style="width: 1.04%"/><thead><tr> <th><p> <code>gtid_next</code> </p></th> <th><p> AUTOMATIC </p><p> binary log on </p></th> <th><p> AUTOMATIC </p><p> binary log off </p></th> <th><p> ANONYMOUS </p></th> <th><p> UUID:NUMBER </p></th> </tr></thead><tbody><tr> <th><p> <code>&gt;OFF</code> </p></th> <td><p> ANONYMOUS </p></td> <td><p> ANONYMOUS </p></td> <td>ANONYMOUS</td> <td><p> Error </p></td> </tr><tr> <th><p> <code>&gt;OFF_PERMISSIVE</code> </p></th> <td><p> ANONYMOUS </p></td> <td><p> ANONYMOUS </p></td> <td><p> ANONYMOUS </p></td> <td><p> UUID:NUMBER </p></td> </tr><tr> <th><p> <code>&gt;ON_PERMISSIVE</code> </p></th> <td><p> New GTID </p></td> <td><p> ANONYMOUS </p></td> <td><p> ANONYMOUS </p></td> <td><p> UUID:NUMBER </p></td> </tr><tr> <th><p> <code>&gt;ON</code> </p></th> <td><p> New GTID </p></td> <td><p> ANONYMOUS </p></td> <td><p> Error </p></td> <td><p> UUID:NUMBER </p></td> </tr></tbody></table>

In the above table, the entries are:

* `ANONYMOUS`: generate an anonymous transaction.

* `Error`: generate an error and fail to execute `SET GTID_NEXT`.

* `UUID:NUMBER`: generate a GTID with the specified UUID:NUMBER.

* `New GTID`: generate a GTID with an automatically generated number.

When the binary log is off and `gtid_next` is set to `AUTOMATIC`, then no GTID is generated. This is consistent with the behavior of previous versions.


#### 16.1.4.2 Enabling GTID Transactions Online

This section describes how to enable GTID transactions, and optionally auto-positioning, on servers that are already online and using anonymous transactions. This procedure does not require taking the server offline and is suited to use in production. However, if you have the possibility to take the servers offline when enabling GTID transactions that process is easier.

Before you start, ensure that the servers meet the following pre-conditions:

* *All* servers in your topology must use MySQL 5.7.6 or later. You cannot enable GTID transactions online on any single server unless *all* servers which are in the topology are using this version.

* All servers have `gtid_mode` set to the default value `OFF`.

The following procedure can be paused at any time and later resumed where it was, or reversed by jumping to the corresponding step of Section 16.1.4.3, “Disabling GTID Transactions Online”, the online procedure to disable GTIDs. This makes the procedure fault-tolerant because any unrelated issues that may appear in the middle of the procedure can be handled as usual, and then the procedure continued where it was left off.

Note

It is crucial that you complete every step before continuing to the next step.

To enable GTID transactions:

1. On each server, execute:

   ```sql
   SET @@GLOBAL.ENFORCE_GTID_CONSISTENCY = WARN;
   ```

   Let the server run for a while with your normal workload and monitor the logs. If this step causes any warnings in the log, adjust your application so that it only uses GTID-compatible features and does not generate any warnings.

   Important

   This is the first important step. You must ensure that no warnings are being generated in the error logs before going to the next step.

2. On each server, execute:

   ```sql
   SET @@GLOBAL.ENFORCE_GTID_CONSISTENCY = ON;
   ```

3. On each server, execute:

   ```sql
   SET @@GLOBAL.GTID_MODE = OFF_PERMISSIVE;
   ```

   It does not matter which server executes this statement first, but it is important that all servers complete this step before any server begins the next step.

4. On each server, execute:

   ```sql
   SET @@GLOBAL.GTID_MODE = ON_PERMISSIVE;
   ```

   It does not matter which server executes this statement first.

5. On each server, wait until the status variable `ONGOING_ANONYMOUS_TRANSACTION_COUNT` is zero. This can be checked using:

   ```sql
   SHOW STATUS LIKE 'ONGOING_ANONYMOUS_TRANSACTION_COUNT';
   ```

   Note

   On a replica, it is theoretically possible that this shows zero and then nonzero again. This is not a problem, it suffices that it shows zero once.

6. Wait for all transactions generated up to step 5 to replicate to all servers. You can do this without stopping updates: the only important thing is that all anonymous transactions get replicated.

   See Section 16.1.4.4, “Verifying Replication of Anonymous Transactions” for one method of checking that all anonymous transactions have replicated to all servers.

7. If you use binary logs for anything other than replication, for example point in time backup and restore, wait until you do not need the old binary logs having transactions without GTIDs.

   For instance, after step 6 has completed, you can execute `FLUSH LOGS` on the server where you are taking backups. Then either explicitly take a backup or wait for the next iteration of any periodic backup routine you may have set up.

   Ideally, wait for the server to purge all binary logs that existed when step 6 was completed. Also wait for any backup taken before step 6 to expire.

   Important

   This is the second important point. It is vital to understand that binary logs containing anonymous transactions, without GTIDs cannot be used after the next step. After this step, you must be sure that transactions without GTIDs do not exist anywhere in the topology.

8. On each server, execute:

   ```sql
   SET @@GLOBAL.GTID_MODE = ON;
   ```

9. On each server, add `gtid_mode=ON` and `enforce_gtid_consistency=ON` to `my.cnf`.

   You are now guaranteed that all transactions have a GTID (except transactions generated in step 5 or earlier, which have already been processed). To start using the GTID protocol so that you can later perform automatic fail-over, execute the following on each replica. Optionally, if you use multi-source replication, do this for each channel and include the `FOR CHANNEL channel` clause:

   ```sql
   STOP SLAVE [FOR CHANNEL 'channel'];
   CHANGE MASTER TO MASTER_AUTO_POSITION = 1 [FOR CHANNEL 'channel'];
   START SLAVE [FOR CHANNEL 'channel'];
   ```


#### 16.1.4.3 Disabling GTID Transactions Online

This section describes how to disable GTID transactions on servers that are already online. This procedure does not require taking the server offline and is suited to use in production. However, if you have the possibility to take the servers offline when disabling GTIDs mode that process is easier.

The process is similar to enabling GTID transactions while the server is online, but reversing the steps. The only thing that differs is the point at which you wait for logged transactions to replicate.

Before you start, ensure that the servers meet the following pre-conditions:

* *All* servers in your topology must use MySQL 5.7.6 or later. You cannot disable GTID transactions online on any single server unless *all* servers which are in the topology are using this version.

* All servers have `gtid_mode` set to `ON`.

1. Execute the following on each replica, and if you using multi-source replication, do it for each channel and include the `FOR CHANNEL` channel clause:

   ```sql
   STOP SLAVE [FOR CHANNEL 'channel'];
   CHANGE MASTER TO MASTER_AUTO_POSITION = 0, MASTER_LOG_FILE = file, \
   MASTER_LOG_POS = position [FOR CHANNEL 'channel'];
   START SLAVE [FOR CHANNEL 'channel'];
   ```

2. On each server, execute:

   ```sql
   SET @@GLOBAL.GTID_MODE = ON_PERMISSIVE;
   ```

3. On each server, execute:

   ```sql
   SET @@GLOBAL.GTID_MODE = OFF_PERMISSIVE;
   ```

4. On each server, wait until the variable @@GLOBAL.GTID\_OWNED is equal to the empty string. This can be checked using:

   ```sql
   SELECT @@GLOBAL.GTID_OWNED;
   ```

   On a replica, it is theoretically possible that this is empty and then nonempty again. This is not a problem, it suffices that it is empty once.

5. Wait for all transactions that currently exist in any binary log to replicate to all replicas. See Section 16.1.4.4, “Verifying Replication of Anonymous Transactions” for one method of checking that all anonymous transactions have replicated to all servers.

6. If you use binary logs for anything else than replication, for example to do point in time backup or restore: wait until you do not need the old binary logs having GTID transactions.

   For instance, after step 5 has completed, you can execute `FLUSH LOGS` on the server where you are taking the backup. Then either explicitly take a backup or wait for the next iteration of any periodic backup routine you may have set up.

   Ideally, wait for the server to purge all binary logs that existed when step 5 was completed. Also wait for any backup taken before step 5 to expire.

   Important

   This is the one important point during this procedure. It is important to understand that logs containing GTID transactions cannot be used after the next step. Before proceeding you must be sure that GTID transactions do not exist anywhere in the topology.

7. On each server, execute:

   ```sql
   SET @@GLOBAL.GTID_MODE = OFF;
   ```

8. On each server, set `gtid_mode=OFF` in `my.cnf`.

   If you want to set `enforce_gtid_consistency=OFF`, you can do so now. After setting it, you should add `enforce_gtid_consistency=OFF` to your configuration file.

If you want to downgrade to an earlier version of MySQL, you can do so now, using the normal downgrade procedure.


#### 16.1.4.4 Verifying Replication of Anonymous Transactions

This section explains how to monitor a replication topology and verify that all anonymous transactions have been replicated. This is helpful when changing the replication mode online as you can verify that it is safe to change to GTID transactions.

There are several possible ways to wait for transactions to replicate:

The simplest method, which works regardless of your topology but relies on timing is as follows: if you are sure that the replica never lags more than N seconds, just wait for a bit more than N seconds. Or wait for a day, or whatever time period you consider safe for your deployment.

A safer method in the sense that it does not depend on timing: if you only have a source with one or more replicas, do the following:

1. On the source, execute:

   ```sql
   SHOW MASTER STATUS;
   ```

   Note down the values in the `File` and `Position` column.

2. On every replica, use the file and position information from the source to execute:

   ```sql
   SELECT MASTER_POS_WAIT(file, position);
   ```

If you have a source and multiple levels of replicas, or in other words you have replicas of replicas, repeat step 2 on each level, starting from the source, then all the direct replicas, then all the replicas of replicas, and so on.

If you use a circular replication topology where multiple servers may have write clients, perform step 2 for each source-replica connection, until you have completed the full circle. Repeat the whole process so that you do the full circle *twice*.

For example, suppose you have three servers A, B, and C, replicating in a circle so that A -> B -> C -> A. The procedure is then:

* Do step 1 on A and step 2 on B.
* Do step 1 on B and step 2 on C.
* Do step 1 on C and step 2 on A.
* Do step 1 on A and step 2 on B.
* Do step 1 on B and step 2 on C.
* Do step 1 on C and step 2 on A.


### 16.1.5 MySQL Multi-Source Replication

MySQL multi-source replication enables a replica to receive transactions from multiple immediate sources in parallel. In a multi-source replication topology, a replica creates a replication channel for each source that it should receive transactions from. For more information on how replication channels function, see Section 16.2.2, “Replication Channels”.

You might choose to implement multi-source replication to achieve goals like these:

* Backing up multiple servers to a single server.
* Merging table shards.
* Consolidating data from multiple servers to a single server.

Multi-source replication does not implement any conflict detection or resolution when applying transactions, and those tasks are left to the application if required.

Note

Each channel on a multi-source replica must replicate from a different source. You cannot set up multiple replication channels from a single replica to a single source. This is because the server IDs of replicas must be unique in a replication topology. The source distinguishes replicas only by their server IDs, not by the names of the replication channels, so it cannot recognize different replication channels from the same replica.

A multi-source replica can also be set up as a multi-threaded replica, by setting the `slave_parallel_workers` system variable to a value greater than 0. When you do this on a multi-source replica, each channel on the replica has the specified number of applier threads, plus a coordinator thread to manage them. You cannot configure the number of applier threads for individual channels.

This section provides tutorials on how to configure sources and replicas for multi-source replication, how to start, stop and reset multi-source replicas, and how to monitor multi-source replication.


#### 16.1.5.1 Configuring Multi-Source Replication

A multi-source replication topology requires at least two sources and one replica configured. In these tutorials, we assume you have two sources `source1` and `source2`, and a replica `replicahost`. The replica replicates one database from each of the sources, `db1` from `source1` and `db2` from `source2`.

Sources in a multi-source replication topology can be configured to use either GTID-based replication, or binary log position-based replication. See Section 16.1.3.4, “Setting Up Replication Using GTIDs” for how to configure a source using GTID-based replication. See Section 16.1.2.1, “Setting the Replication Source Configuration” for how to configure a source using file position based replication.

Replicas in a multi-source replication topology require `TABLE` repositories for the connection metadata repository and applier metadata repository, as specified by the `master_info_repository` and `relay_log_info_repository` system variables. Multi-source replication is not compatible with `FILE` repositories.

To modify an existing replica that is using `FILE` repositories for the replication metadata repositories to use `TABLE` repositories, you can convert the existing repositories dynamically by using the **mysql** client to issue the following statements on the replica:

```sql
mysql> STOP SLAVE;
mysql> SET GLOBAL master_info_repository = 'TABLE';
mysql> SET GLOBAL relay_log_info_repository = 'TABLE';
```

Create a suitable user account on all the replication source servers that the replica can use to connect. You can use the same account on all the sources, or a different account on each. If you create an account solely for the purposes of replication, that account needs only the `REPLICATION SLAVE` privilege. For example, to set up a new user, `ted`, that can connect from the replica `replicahost`, use the **mysql** client to issue these statements on each of the sources:

```sql
mysql> CREATE USER 'ted'@'replicahost' IDENTIFIED BY 'password';
mysql> GRANT REPLICATION SLAVE ON *.* TO 'ted'@'replicahost';
```

For more details, see Section 16.1.2.2, “Creating a User for Replication”.


#### 16.1.5.2 Provisioning a Multi-Source Replica for GTID-Based Replication

If the sources in the multi-source replication topology have existing data, it can save time to provision the replica with the relevant data before starting replication. In a multi-source replication topology, copying the data directory cannot be used to provision the replica with data from all of the sources, and you might also want to replicate only specific databases from each source. The best strategy for provisioning such a replica is therefore to use **mysqldump** to create an appropriate dump file on each source, then use the **mysql** client to import the dump file on the replica.

If you are using GTID-based replication, you need to pay attention to the `SET @@GLOBAL.gtid_purged` statement that **mysqldump** places in the dump output. This statement transfers the GTIDs for the transactions executed on the source to the replica, and the replica requires this information. However, for any case more complex than provisioning one new, empty replica from one source, you need to check what effect the statement has in the replica's version of MySQL, and handle the statement accordingly. The following guidance summarizes suitable actions, but for more details, see the **mysqldump** documentation.

In MySQL 5.6 and 5.7, the `SET @@GLOBAL.gtid_purged` statement written by **mysqldump** replaces the value of `gtid_purged` on the replica. Also in those releases that value can only be changed when the replica's record of transactions with GTIDs (the `gtid_executed` set) is empty. In a multi-source replication topology, you must therefore remove the `SET @@GLOBAL.gtid_purged` statement from the dump output before replaying the dump files, because you cannot apply a second or subsequent dump file including this statement. As an alternative to removing the `SET @@GLOBAL.gtid_purged` statement, if you are provisioning the replica with two partial dumps from the same source, and the GTID set in the second dump is the same as the first (so no new transactions have been executed on the source in between the dumps), you can set **mysqldump**'s `--set-gtid-purged` option to `OFF` when you output the second dump file, to omit the statement.

For MySQL 5.6 and 5.7, these limitations mean all the dump files from the sources must be applied in a single operation on a replica with an empty `gtid_executed` set. You can clear a replica's GTID execution history by issuing `RESET MASTER` on the replica, but if you have other, wanted transactions with GTIDs on the replica, choose an alternative method of provisioning from those described in Section 16.1.3.5, “Using GTIDs for Failover and Scaleout”.

In the following provisioning example, we assume that the `SET @@GLOBAL.gtid_purged` statement needs to be removed from the files and handled manually. We also assume that there are no wanted transactions with GTIDs on the replica before provisioning starts.

1. To create dump files for a database named `db1` on `source1` and a database named `db2` on `source2`, run **mysqldump** for `source1` as follows:

   ```sql
   mysqldump -u<user> -p<password> --single-transaction --triggers --routines --set-gtid-purged=ON --databases db1 > dumpM1.sql
   ```

   Then run **mysqldump** for `source2` as follows:

   ```sql
   mysqldump -u<user> -p<password> --single-transaction --triggers --routines --set-gtid-purged=ON --databases db2 > dumpM2.sql
   ```

2. Record the `gtid_purged` value that **mysqldump** added to each of the dump files. For example, for dump files created on MySQL 5.6 or 5.7, you can extract the value like this:

   ```sql
   cat dumpM1.sql | grep GTID_PURGED | cut -f2 -d'=' | cut -f2 -d$'\''
   cat dumpM2.sql | grep GTID_PURGED | cut -f2 -d'=' | cut -f2 -d$'\''
   ```

   The result in each case should be a GTID set, for example:

   ```sql
   source1:   2174B383-5441-11E8-B90A-C80AA9429562:1-1029
   source2:   224DA167-0C0C-11E8-8442-00059A3C7B00:1-2695
   ```

3. Remove the line from each dump file that contains the `SET @@GLOBAL.gtid_purged` statement. For example:

   ```sql
   sed '/GTID_PURGED/d' dumpM1.sql > dumpM1_nopurge.sql
   sed '/GTID_PURGED/d' dumpM2.sql > dumpM2_nopurge.sql
   ```

4. Use the **mysql** client to import each edited dump file into the replica. For example:

   ```sql
   mysql -u<user> -p<password> < dumpM1_nopurge.sql
   mysql -u<user> -p<password> < dumpM2_nopurge.sql
   ```

5. On the replica, issue `RESET MASTER` to clear the GTID execution history (assuming, as explained above, that all the dump files have been imported and that there are no wanted transactions with GTIDs on the replica). Then issue a `SET @@GLOBAL.gtid_purged` statement to set the `gtid_purged` value to the union of all the GTID sets from all the dump files, as you recorded in Step 2. For example:

   ```sql
   mysql> RESET MASTER;
   mysql> SET @@GLOBAL.gtid_purged = "2174B383-5441-11E8-B90A-C80AA9429562:1-1029, 224DA167-0C0C-11E8-8442-00059A3C7B00:1-2695";
   ```

   If there are, or might be, overlapping transactions between the GTID sets in the dump files, you can use the stored functions described in Section 16.1.3.7, “Stored Function Examples to Manipulate GTIDs” to check this beforehand and to calculate the union of all the GTID sets.


#### 16.1.5.3 Adding GTID-Based Sources to a Multi-Source Replica

These steps assume you have enabled GTIDs for transactions on the replication source servers using `gtid_mode=ON`, created a replication user, ensured that the replica is using `TABLE` based replication metadata repositories, and provisioned the replica with data from the sources if appropriate.

Use the `CHANGE MASTER TO` statement to configure a replication channel for each source on the replica (see Section 16.2.2, “Replication Channels”). The `FOR CHANNEL` clause is used to specify the channel. For GTID-based replication, GTID auto-positioning is used to synchronize with the source (see Section 16.1.3.3, “GTID Auto-Positioning”). The `MASTER_AUTO_POSITION` option is set to specify the use of auto-positioning.

For example, to add `source1` and `source2` as sources to the replica, use the **mysql** client to issue the `CHANGE MASTER TO` statement twice on the replica, like this:

```sql
mysql> CHANGE MASTER TO MASTER_HOST="source1", MASTER_USER="ted", \
MASTER_PASSWORD="password", MASTER_AUTO_POSITION=1 FOR CHANNEL "source_1";
mysql> CHANGE MASTER TO MASTER_HOST="source2", MASTER_USER="ted", \
MASTER_PASSWORD="password", MASTER_AUTO_POSITION=1 FOR CHANNEL "source_2";
```

For the full syntax of the `CHANGE MASTER TO` statement and other available options, see Section 13.4.2.1, “CHANGE MASTER TO Statement”.


#### 16.1.5.4 Adding a Binary Log Based Source to a Multi-Source Replica

These steps assume that you have enabled binary logging on the replication source server using `--log-bin`, the replica is using `TABLE` based replication metadata repositories, and that you have enabled a replication user and noted the current binary log position. You need to know the current `MASTER_LOG_FILE` and `MASTER_LOG_POSITION`.

Use the `CHANGE MASTER TO` statement to configure a replication channel for each source on the replica (see Section 16.2.2, “Replication Channels”). The `FOR CHANNEL` clause is used to specify the channel. For example, to add `source1` and `source2` as sources to the replica, use the **mysql** client to issue the `CHANGE MASTER TO` statement twice on the replica, like this:

```sql
mysql> CHANGE MASTER TO MASTER_HOST="source1", MASTER_USER="ted", MASTER_PASSWORD="password", \
MASTER_LOG_FILE='source1-bin.000006', MASTER_LOG_POS=628 FOR CHANNEL "source_1";
mysql> CHANGE MASTER TO MASTER_HOST="source2", MASTER_USER="ted", MASTER_PASSWORD="password", \
MASTER_LOG_FILE='source2-bin.000018', MASTER_LOG_POS=104 FOR CHANNEL "source_2";
```

For the full syntax of the `CHANGE MASTER TO` statement and other available options, see Section 13.4.2.1, “CHANGE MASTER TO Statement”.


#### 16.1.5.5 Starting Multi-Source Replicas

Once you have added channels for all of the sources, issue a `START SLAVE` statement to start replication. When you have enabled multiple channels on a replica, you can choose to either start all channels, or select a specific channel to start. For example, to start the two channels separately, use the **mysql** client to issue the following statements:

```sql
mysql> START SLAVE FOR CHANNEL "source_1";
mysql> START SLAVE FOR CHANNEL "source_2";
```

For the full syntax of the `START SLAVE` command and other available options, see Section 13.4.2.5, “START SLAVE Statement”.

To verify that both channels have started and are operating correctly, you can issue `SHOW SLAVE STATUS` statements on the replica, for example:

```sql
mysql> SHOW SLAVE STATUS FOR CHANNEL "source_1"\G
mysql> SHOW SLAVE STATUS FOR CHANNEL "source_2"\G
```


#### 16.1.5.6 Stopping Multi-Source Replicas

The `STOP SLAVE` statement can be used to stop a multi-source replica. By default, if you use the `STOP SLAVE` statement on a multi-source replica all channels are stopped. Optionally, use the `FOR CHANNEL channel` clause to stop only a specific channel.

* To stop all currently configured replication channels:

  ```sql
  STOP SLAVE;
  ```

* To stop only a named channel, use a `FOR CHANNEL channel` clause:

  ```sql
  STOP SLAVE FOR CHANNEL "source_1";
  ```

For the full syntax of the `STOP SLAVE` command and other available options, see Section 13.4.2.6, “STOP SLAVE Statement”.


#### 16.1.5.7 Resetting Multi-Source Replicas

The `RESET SLAVE` statement can be used to reset a multi-source replica. By default, if you use the `RESET SLAVE` statement on a multi-source replica all channels are reset. Optionally, use the `FOR CHANNEL channel` clause to reset only a specific channel.

* To reset all currently configured replication channels:

  ```sql
  RESET SLAVE;
  ```

* To reset only a named channel, use a `FOR CHANNEL channel` clause:

  ```sql
  RESET SLAVE FOR CHANNEL "source_1";
  ```

For GTID-based replication, note that `RESET SLAVE` has no effect on the replica's GTID execution history. If you want to clear this, issue `RESET MASTER` on the replica.

`RESET SLAVE` makes the replica forget its replication position, and clears the relay log, but it does not change any replication connection parameters, such as the source's host name. If you want to remove these for a channel, issue `RESET SLAVE ALL`.

For the full syntax of the `RESET SLAVE` command and other available options, see Section 13.4.2.3, “RESET SLAVE Statement”.


#### 16.1.5.8 Multi-Source Replication Monitoring

To monitor the status of replication channels the following options exist:

* Using the replication Performance Schema tables. The first column of these tables is `Channel_Name`. This enables you to write complex queries based on `Channel_Name` as a key. See Section 25.12.11, “Performance Schema Replication Tables”.

* Using `SHOW SLAVE STATUS FOR CHANNEL channel`. By default, if the `FOR CHANNEL channel` clause is not used, this statement shows the replica status for all channels with one row per channel. The identifier `Channel_name` is added as a column in the result set. If a `FOR CHANNEL channel` clause is provided, the results show the status of only the named replication channel.

Note

The `SHOW VARIABLES` statement does not work with multiple replication channels. The information that was available through these variables has been migrated to the replication performance tables. Using a `SHOW VARIABLES` statement in a topology with multiple channels shows the status of only the default channel.

##### 16.1.5.8.1 Monitoring Channels Using Performance Schema Tables

This section explains how to use the replication Performance Schema tables to monitor channels. You can choose to monitor all channels, or a subset of the existing channels.

To monitor the connection status of all channels:

```sql
mysql> SELECT * FROM replication_connection_status\G;
*************************** 1. row ***************************
CHANNEL_NAME: source_1
GROUP_NAME:
SOURCE_UUID: 046e41f8-a223-11e4-a975-0811960cc264
THREAD_ID: 24
SERVICE_STATE: ON
COUNT_RECEIVED_HEARTBEATS: 0
LAST_HEARTBEAT_TIMESTAMP: 0000-00-00 00:00:00
RECEIVED_TRANSACTION_SET: 046e41f8-a223-11e4-a975-0811960cc264:4-37
LAST_ERROR_NUMBER: 0
LAST_ERROR_MESSAGE:
LAST_ERROR_TIMESTAMP: 0000-00-00 00:00:00
*************************** 2. row ***************************
CHANNEL_NAME: source_2
GROUP_NAME:
SOURCE_UUID: 7475e474-a223-11e4-a978-0811960cc264
THREAD_ID: 26
SERVICE_STATE: ON
COUNT_RECEIVED_HEARTBEATS: 0
LAST_HEARTBEAT_TIMESTAMP: 0000-00-00 00:00:00
RECEIVED_TRANSACTION_SET: 7475e474-a223-11e4-a978-0811960cc264:4-6
LAST_ERROR_NUMBER: 0
LAST_ERROR_MESSAGE:
LAST_ERROR_TIMESTAMP: 0000-00-00 00:00:00
2 rows in set (0.00 sec)
```

In the above output there are two channels enabled, and as shown by the `CHANNEL_NAME` field they are called `source_1` and `source_2`.

The addition of the `CHANNEL_NAME` field enables you to query the Performance Schema tables for a specific channel. To monitor the connection status of a named channel, use a `WHERE CHANNEL_NAME=channel` clause:

```sql
mysql> SELECT * FROM replication_connection_status WHERE CHANNEL_NAME='source_1'\G
*************************** 1. row ***************************
CHANNEL_NAME: source_1
GROUP_NAME:
SOURCE_UUID: 046e41f8-a223-11e4-a975-0811960cc264
THREAD_ID: 24
SERVICE_STATE: ON
COUNT_RECEIVED_HEARTBEATS: 0
LAST_HEARTBEAT_TIMESTAMP: 0000-00-00 00:00:00
RECEIVED_TRANSACTION_SET: 046e41f8-a223-11e4-a975-0811960cc264:4-37
LAST_ERROR_NUMBER: 0
LAST_ERROR_MESSAGE:
LAST_ERROR_TIMESTAMP: 0000-00-00 00:00:00
1 row in set (0.00 sec)
```

Similarly, the `WHERE CHANNEL_NAME=channel` clause can be used to monitor the other replication Performance Schema tables for a specific channel. For more information, see Section 25.12.11, “Performance Schema Replication Tables”.


### 16.1.6 Replication and Binary Logging Options and Variables

The following sections contain information about `mysqld` options and server variables that are used in replication and for controlling the binary log. Options and variables for use on sources and replicas are covered separately, as are options and variables relating to binary logging and global transaction identifiers (GTIDs). A set of quick-reference tables providing basic information about these options and variables is also included.

Of particular importance is the `server_id` system variable.

<table frame="box" rules="all" summary="Properties for server_id"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--server-id=#</code></td> </tr><tr><th>System Variable</th> <td><code>server_id</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

This variable specifies the server ID. In MySQL 5.7, `server_id` must be specified if binary logging is enabled, otherwise the server is not allowed to start.

`server_id` is set to 0 by default. On a replication source server and each replica, you *must* specify `server_id` to establish a unique replication ID in the range from 1 to 232 − 1. “Unique”, means that each ID must be different from every other ID in use by any other source or replica in the replication topology. For additional information, see Section 16.1.6.2, “Replication Source Options and Variables”, and Section 16.1.6.3, “Replica Server Options and Variables”.

If the server ID is set to 0, binary logging takes place, but a source with a server ID of 0 refuses any connections from replicas, and a replica with a server ID of 0 refuses to connect to a source. Note that although you can change the server ID dynamically to a nonzero value, doing so does not enable replication to start immediately. You must change the server ID and then restart the server to initialize the replica.

For more information, see Section 16.1.2.5.1, “Setting the Replica Configuration”.

`server_uuid`

In MySQL 5.7, the server generates a true UUID in addition to the `server_id` value supplied by the user. This is available as the global, read-only `server_uuid` system variable.

Note

The presence of the `server_uuid` system variable in MySQL 5.7 does not change the requirement for setting a unique `server_id` value for each MySQL server as part of preparing and running MySQL replication, as described earlier in this section.

<table frame="box" rules="all" summary="Properties for server_uuid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>server_uuid</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

When starting, the MySQL server automatically obtains a UUID as follows:

1. Attempt to read and use the UUID written in the file `data_dir/auto.cnf` (where *`data_dir`* is the server's data directory).

2. If `data_dir/auto.cnf` is not found, generate a new UUID and save it to this file, creating the file if necessary.

The `auto.cnf` file has a format similar to that used for `my.cnf` or `my.ini` files. In MySQL 5.7, `auto.cnf` has only a single `[auto]` section containing a single `server_uuid` setting and value; the file's contents appear similar to what is shown here:

```sql
[auto]
server_uuid=8a94f357-aab4-11df-86ab-c80aa9429562
```

Important

The `auto.cnf` file is automatically generated; do not attempt to write or modify this file.

When using MySQL replication, sources and replicas know each other's UUIDs. The value of a replica's UUID can be seen in the output of `SHOW SLAVE HOSTS`. Once `START SLAVE` has been executed, the value of the source's UUID is available on the replica in the output of `SHOW SLAVE STATUS`.

Note

Issuing a `STOP SLAVE` or `RESET SLAVE` statement does *not* reset the source's UUID as used on the replica.

A server's `server_uuid` is also used in GTIDs for transactions originating on that server. For more information, see Section 16.1.3, “Replication with Global Transaction Identifiers”.

When starting, the replication I/O thread generates an error and aborts if its source's UUID is equal to its own unless the `--replicate-same-server-id` option has been set. In addition, the replication I/O thread generates a warning if either of the following is true:

* No source having the expected `server_uuid` exists.

* The source's `server_uuid` has changed, although no `CHANGE MASTER TO` statement has ever been executed.


#### 16.1.6.1 Replication and Binary Logging Option and Variable Reference

The following two sections provide basic information about the MySQL command-line options and system variables applicable to replication and the binary log.

##### Replication Options and Variables

The command-line options and system variables in the following list relate to replication source servers and replicas. Section 16.1.6.2, “Replication Source Options and Variables” provides more detailed information about options and variables relating to replication source servers. For more information about options and variables relating to replicas, see Section 16.1.6.3, “Replica Server Options and Variables”.

* `abort-slave-event-count`: Option used by mysql-test for debugging and testing of replication.

* `auto_increment_increment`: AUTO\_INCREMENT columns are incremented by this value.

* `auto_increment_offset`: Offset added to AUTO\_INCREMENT columns.

* `Com_change_master`: Count of CHANGE REPLICATION SOURCE TO and CHANGE MASTER TO statements.

* `Com_show_master_status`: Count of SHOW MASTER STATUS statements.

* `Com_show_slave_hosts`: Count of SHOW REPLICAS and SHOW SLAVE HOSTS statements.

* `Com_show_slave_status`: Count of SHOW REPLICA STATUS and SHOW SLAVE STATUS statements.

* `Com_slave_start`: Count of START REPLICA and START SLAVE statements.

* `Com_slave_stop`: Count of STOP REPLICA and STOP SLAVE statements.

* `disconnect-slave-event-count`: Option used by mysql-test for debugging and testing of replication.

* `enforce_gtid_consistency`: Prevents execution of statements that cannot be logged in transactionally safe manner.

* `expire_logs_days`: Purge binary logs after this many days.

* `gtid_executed`: Global: All GTIDs in binary log (global) or current transaction (session). Read-only.

* `gtid_executed_compression_period`: Compress gtid\_executed table each time this many transactions have occurred. 0 means never compress this table. Applies only when binary logging is disabled.

* `gtid_mode`: Controls whether GTID based logging is enabled and what type of transactions logs can contain.

* `gtid_next`: Specifies GTID for subsequent transaction or transactions; see documentation for details.

* `gtid_owned`: Set of GTIDs owned by this client (session), or by all clients, together with thread ID of owner (global). Read-only.

* `gtid_purged`: Set of all GTIDs that have been purged from binary log.

* `init_slave`: Statements that are executed when replica connects to source.

* `log_bin_trust_function_creators`: If equal to 0 (default), then when --log-bin is used, stored function creation is allowed only to users having SUPER privilege and only if function created does not break binary logging.

* `log_builtin_as_identified_by_password`: Whether to log CREATE/ALTER USER, GRANT in backward-compatible fashion.

* `log_statements_unsafe_for_binlog`: Disables error 1592 warnings being written to error log.

* `master-info-file`: Location and name of file that remembers source and where I/O replication thread is in source's binary log.

* `master-retry-count`: Number of tries replica makes to connect to source before giving up.

* `master_info_repository`: Whether to write connection metadata repository, containing source information and replication I/O thread location in source's binary log, to file or table.

* `max_relay_log_size`: If nonzero, relay log is rotated automatically when its size exceeds this value. If zero, size at which rotation occurs is determined by value of max\_binlog\_size.

* `relay_log`: Location and base name to use for relay logs.

* `relay_log_basename`: Complete path to relay log, including file name.

* `relay_log_index`: Location and name to use for file that keeps list of last relay logs.

* `relay_log_info_file`: File name for applier metadata repository in which replica records information about relay logs.

* `relay_log_info_repository`: Whether to write location of replication SQL thread in relay logs to file or table.

* `relay_log_purge`: Determines whether relay logs are purged.

* `relay_log_recovery`: Whether automatic recovery of relay log files from source at startup is enabled; must be enabled for crash-safe replica.

* `relay_log_space_limit`: Maximum space to use for all relay logs.

* `replicate-do-db`: Tells replication SQL thread to restrict replication to specified database.

* `replicate-do-table`: Tells replication SQL thread to restrict replication to specified table.

* `replicate-ignore-db`: Tells replication SQL thread not to replicate to specified database.

* `replicate-ignore-table`: Tells replication SQL thread not to replicate to specified table.

* `replicate-rewrite-db`: Updates to database with different name from original.

* `replicate-same-server-id`: In replication, if enabled, do not skip events having our server id.

* `replicate-wild-do-table`: Tells replication SQL thread to restrict replication to tables that match specified wildcard pattern.

* `replicate-wild-ignore-table`: Tells replication SQL thread not to replicate to tables that match given wildcard pattern.

* `replication_optimize_for_static_plugin_config`: Shared locks for semisynchronous replication.

* `replication_sender_observe_commit_only`: Limited callbacks for semisynchronous replication.

* `report_host`: Host name or IP of replica to be reported to source during replica registration.

* `report_password`: Arbitrary password which replica server should report to source; not same as password for replication user account.

* `report_port`: Port for connecting to replica reported to source during replica registration.

* `report_user`: Arbitrary user name which replica server should report to source; not same as name used for replication user account.

* `Rpl_semi_sync_master_clients`: Number of semisynchronous replicas.

* `rpl_semi_sync_master_enabled`: Whether semisynchronous replication is enabled on source.

* `Rpl_semi_sync_master_net_avg_wait_time`: Average time source has waited for replies from replica.

* `Rpl_semi_sync_master_net_wait_time`: Total time source has waited for replies from replica.

* `Rpl_semi_sync_master_net_waits`: Total number of times source waited for replies from replica.

* `Rpl_semi_sync_master_no_times`: Number of times source turned off semisynchronous replication.

* `Rpl_semi_sync_master_no_tx`: Number of commits not acknowledged successfully.

* `Rpl_semi_sync_master_status`: Whether semisynchronous replication is operational on source.

* `Rpl_semi_sync_master_timefunc_failures`: Number of times source failed when calling time functions.

* `rpl_semi_sync_master_timeout`: Number of milliseconds to wait for replica acknowledgment.

* `rpl_semi_sync_master_trace_level`: Semisynchronous replication debug trace level on source.

* `Rpl_semi_sync_master_tx_avg_wait_time`: Average time source waited for each transaction.

* `Rpl_semi_sync_master_tx_wait_time`: Total time source waited for transactions.

* `Rpl_semi_sync_master_tx_waits`: Total number of times source waited for transactions.

* `rpl_semi_sync_master_wait_for_slave_count`: Number of replica acknowledgments source must receive per transaction before proceeding.

* `rpl_semi_sync_master_wait_no_slave`: Whether source waits for timeout even with no replicas.

* `rpl_semi_sync_master_wait_point`: Wait point for replica transaction receipt acknowledgment.

* `Rpl_semi_sync_master_wait_pos_backtraverse`: Total number of times source has waited for event with binary coordinates lower than events waited for previously.

* `Rpl_semi_sync_master_wait_sessions`: Number of sessions currently waiting for replica replies.

* `Rpl_semi_sync_master_yes_tx`: Number of commits acknowledged successfully.

* `rpl_semi_sync_slave_enabled`: Whether semisynchronous replication is enabled on replica.

* `Rpl_semi_sync_slave_status`: Whether semisynchronous replication is operational on replica.

* `rpl_semi_sync_slave_trace_level`: Semisynchronous replication debug trace level on replica.

* `rpl_stop_slave_timeout`: Number of seconds that STOP REPLICA or STOP SLAVE waits before timing out.

* `server_uuid`: Server's globally unique ID, automatically (re)generated at server start.

* `show-slave-auth-info`: Show user name and password in SHOW REPLICAS and SHOW SLAVE HOSTS on this source.

* `skip-slave-start`: If set, replication is not autostarted when replica server starts.

* `slave-skip-errors`: Tells replication thread to continue replication when query returns error from provided list.

* `slave_checkpoint_group`: Maximum number of transactions processed by multithreaded replica before checkpoint operation is called to update progress status. Not supported by NDB Cluster.

* `slave_checkpoint_period`: Update progress status of multithreaded replica and flush relay log info to disk after this number of milliseconds. Not supported by NDB Cluster.

* `slave_compressed_protocol`: Use compression of source/replica protocol.

* `slave_exec_mode`: Allows for switching replication thread between IDEMPOTENT mode (key and some other errors suppressed) and STRICT mode; STRICT mode is default, except for NDB Cluster, where IDEMPOTENT is always used.

* `Slave_heartbeat_period`: Replica's replication heartbeat interval, in seconds.

* `Slave_last_heartbeat`: Shows when latest heartbeat signal was received, in TIMESTAMP format.

* `slave_load_tmpdir`: Location where replica should put its temporary files when replicating LOAD DATA statements.

* `slave_max_allowed_packet`: Maximum size, in bytes, of packet that can be sent from replication source server to replica; overrides max\_allowed\_packet.

* `slave_net_timeout`: Number of seconds to wait for more data from source/replica connection before aborting read.

* `Slave_open_temp_tables`: Number of temporary tables that replication SQL thread currently has open.

* `slave_parallel_type`: Tells replica to use timestamp information (LOGICAL\_CLOCK) or database partioning (DATABASE) to parallelize transactions.

* `slave_parallel_workers`: Number of applier threads for executing replication transactions in parallel; 0 or 1 disables replica multithreading. NDB Cluster: see documentation.

* `slave_pending_jobs_size_max`: Maximum size of replica worker queues holding events not yet applied.

* `slave_preserve_commit_order`: Ensures that all commits by replica workers happen in same order as on source to maintain consistency when using parallel applier threads.

* `Slave_received_heartbeats`: Number of heartbeats received by replica since previous reset.

* `Slave_retried_transactions`: Total number of times since startup that replication SQL thread has retried transactions.

* `Slave_rows_last_search_algorithm_used`: Search algorithm most recently used by this replica to locate rows for row-based replication (index, table, or hash scan).

* `slave_rows_search_algorithms`: Determines search algorithms used for replica update batching. Any 2 or 3 from this list: INDEX\_SEARCH, TABLE\_SCAN, HASH\_SCAN.

* `Slave_running`: State of this server as replica (replication I/O thread status).

* `slave_transaction_retries`: Number of times replication SQL thread retries transaction in case it failed with deadlock or elapsed lock wait timeout, before giving up and stopping.

* `slave_type_conversions`: Controls type conversion mode on replica. Value is list of zero or more elements from this list: ALL\_LOSSY, ALL\_NON\_LOSSY. Set to empty string to disallow type conversions between source and replica.

* `sql_log_bin`: Controls binary logging for current session.

* `sql_slave_skip_counter`: Number of events from source that replica should skip. Not compatible with GTID replication.

* `sync_master_info`: Synchronize source information after every #th event.

* `sync_relay_log`: Synchronize relay log to disk after every #th event.

* `sync_relay_log_info`: Synchronize relay.info file to disk after every #th event.

* `transaction_write_set_extraction`: Defines algorithm used to hash writes extracted during transaction.

For a listing of all command-line options, system variables, and status variables used with `mysqld`, see Section 5.1.3, “Server Option, System Variable, and Status Variable Reference”.

##### Binary Logging Options and Variables

The command-line options and system variables in the following list relate to the binary log. Section 16.1.6.4, “Binary Logging Options and Variables”, provides more detailed information about options and variables relating to binary logging. For additional general information about the binary log, see Section 5.4.4, “The Binary Log”.

* `binlog-checksum`: Enable or disable binary log checksums.

* `binlog-do-db`: Limits binary logging to specific databases.

* `binlog-ignore-db`: Tells source that updates to given database should not be written to binary log.

* `binlog-row-event-max-size`: Binary log max event size.

* `Binlog_cache_disk_use`: Number of transactions which used temporary file instead of binary log cache.

* `binlog_cache_size`: Size of cache to hold SQL statements for binary log during transaction.

* `Binlog_cache_use`: Number of transactions that used temporary binary log cache.

* `binlog_checksum`: Enable or disable binary log checksums.

* `binlog_direct_non_transactional_updates`: Causes updates using statement format to nontransactional engines to be written directly to binary log. See documentation before using.

* `binlog_error_action`: Controls what happens when server cannot write to binary log.

* `binlog_format`: Specifies format of binary log.

* `binlog_group_commit_sync_delay`: Sets number of microseconds to wait before synchronizing transactions to disk.

* `binlog_group_commit_sync_no_delay_count`: Sets maximum number of transactions to wait for before aborting current delay specified by binlog\_group\_commit\_sync\_delay.

* `binlog_gtid_simple_recovery`: Controls how binary logs are iterated during GTID recovery.

* `binlog_max_flush_queue_time`: How long to read transactions before flushing to binary log.

* `binlog_order_commits`: Whether to commit in same order as writes to binary log.

* `binlog_row_image`: Use full or minimal images when logging row changes.

* `binlog_rows_query_log_events`: When enabled, enables logging of rows query log events when using row-based logging. Disabled by default..

* `Binlog_stmt_cache_disk_use`: Number of nontransactional statements that used temporary file instead of binary log statement cache.

* `binlog_stmt_cache_size`: Size of cache to hold nontransactional statements for binary log during transaction.

* `Binlog_stmt_cache_use`: Number of statements that used temporary binary log statement cache.

* `binlog_transaction_dependency_history_size`: Number of row hashes kept for looking up transaction that last updated some row.

* `binlog_transaction_dependency_tracking`: Source of dependency information (commit timestamps or transaction write sets) from which to assess which transactions can be executed in parallel by replica's multithreaded applier.

* `Com_show_binlog_events`: Count of SHOW BINLOG EVENTS statements.

* `Com_show_binlogs`: Count of SHOW BINLOGS statements.

* `log-bin`: Base name for binary log files.

* `log-bin-index`: Name of binary log index file.

* `log_bin`: Whether binary log is enabled.

* `log_bin_basename`: Path and base name for binary log files.

* `log_bin_use_v1_row_events`: Whether server is using version 1 binary log row events.

* `log_slave_updates`: Whether replica should log updates performed by its replication SQL thread to its own binary log.

* `master_verify_checksum`: Cause source to examine checksums when reading from binary log.

* `max-binlog-dump-events`: Option used by mysql-test for debugging and testing of replication.

* `max_binlog_cache_size`: Can be used to restrict total size in bytes used to cache multi-statement transactions.

* `max_binlog_size`: Binary log is rotated automatically when size exceeds this value.

* `max_binlog_stmt_cache_size`: Can be used to restrict total size used to cache all nontransactional statements during transaction.

* `slave-sql-verify-checksum`: Cause replica to examine checksums when reading from relay log.

* `slave_sql_verify_checksum`: Cause replica to examine checksums when reading from relay log.

* `sporadic-binlog-dump-fail`: Option used by mysql-test for debugging and testing of replication.

* `sync_binlog`: Synchronously flush binary log to disk after every #th event.

For a listing of all command-line options, system and status variables used with `mysqld`, see Section 5.1.3, “Server Option, System Variable, and Status Variable Reference”.


#### 16.1.6.2 Replication Source Options and Variables

This section describes the server options and system variables that you can use on replication source servers. You can specify the options either on the command line or in an option file. You can specify system variable values using `SET`.

On the source and each replica, you must set the `server_id` system variable to establish a unique replication ID. For each server, you should pick a unique positive integer in the range from 1 to 232 − 1, and each ID must be different from every other ID in use by any other source or replica in the replication topology. Example: `server-id=3`.

For options used on the source for controlling binary logging, see Section 16.1.6.4, “Binary Logging Options and Variables”.

##### Startup Options for Replication Source Servers

The following list describes startup options for controlling replication source servers. Replication-related system variables are discussed later in this section.

* `--show-slave-auth-info`

  <table frame="box" rules="all" summary="Properties for show-slave-auth-info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--show-slave-auth-info[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Display replica user names and passwords in the output of `SHOW SLAVE HOSTS` on the source server for replicas started with the `--report-user` and `--report-password` options.

##### System Variables Used on Replication Source Servers

The following system variables are used to control sources:

* `auto_increment_increment`

  <table frame="box" rules="all" summary="Properties for auto_increment_increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-increment-increment=#</code></td> </tr><tr><th>System Variable</th> <td><code>auto_increment_increment</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>

  `auto_increment_increment` and `auto_increment_offset` are intended for use with source-to-source replication, and can be used to control the operation of `AUTO_INCREMENT` columns. Both variables have global and session values, and each can assume an integer value between 1 and 65,535 inclusive. Setting the value of either of these two variables to 0 causes its value to be set to 1 instead. Attempting to set the value of either of these two variables to an integer greater than 65,535 or less than 0 causes its value to be set to 65,535 instead. Attempting to set the value of `auto_increment_increment` or `auto_increment_offset` to a noninteger value produces an error, and the actual value of the variable remains unchanged.

  Note

  `auto_increment_increment` is also supported for use with `NDB` tables.

  When Group Replication is started on a server, the value of `auto_increment_increment` is changed to the value of `group_replication_auto_increment_increment`, which defaults to 7, and the value of `auto_increment_offset` is changed to the server ID. The changes are reverted when Group Replication is stopped. These changes are only made and reverted if `auto_increment_increment` and `auto_increment_offset` each have their default value of 1. If their values have already been modified from the default, Group Replication does not alter them.

  `auto_increment_increment` and `auto_increment_offset` affect `AUTO_INCREMENT` column behavior as follows:

  + `auto_increment_increment` controls the interval between successive column values. For example:

    ```sql
    mysql> SHOW VARIABLES LIKE 'auto_inc%';
    +--------------------------+-------+
    | Variable_name            | Value |
    +--------------------------+-------+
    | auto_increment_increment | 1     |
    | auto_increment_offset    | 1     |
    +--------------------------+-------+
    2 rows in set (0.00 sec)

    mysql> CREATE TABLE autoinc1
        -> (col INT NOT NULL AUTO_INCREMENT PRIMARY KEY);
      Query OK, 0 rows affected (0.04 sec)

    mysql> SET @@auto_increment_increment=10;
    Query OK, 0 rows affected (0.00 sec)

    mysql> SHOW VARIABLES LIKE 'auto_inc%';
    +--------------------------+-------+
    | Variable_name            | Value |
    +--------------------------+-------+
    | auto_increment_increment | 10    |
    | auto_increment_offset    | 1     |
    +--------------------------+-------+
    2 rows in set (0.01 sec)

    mysql> INSERT INTO autoinc1 VALUES (NULL), (NULL), (NULL), (NULL);
    Query OK, 4 rows affected (0.00 sec)
    Records: 4  Duplicates: 0  Warnings: 0

    mysql> SELECT col FROM autoinc1;
    +-----+
    | col |
    +-----+
    |   1 |
    |  11 |
    |  21 |
    |  31 |
    +-----+
    4 rows in set (0.00 sec)
    ```

  + `auto_increment_offset` determines the starting point for the `AUTO_INCREMENT` column value. Consider the following, assuming that these statements are executed during the same session as the example given in the description for `auto_increment_increment`:

    ```sql
    mysql> SET @@auto_increment_offset=5;
    Query OK, 0 rows affected (0.00 sec)

    mysql> SHOW VARIABLES LIKE 'auto_inc%';
    +--------------------------+-------+
    | Variable_name            | Value |
    +--------------------------+-------+
    | auto_increment_increment | 10    |
    | auto_increment_offset    | 5     |
    +--------------------------+-------+
    2 rows in set (0.00 sec)

    mysql> CREATE TABLE autoinc2
        -> (col INT NOT NULL AUTO_INCREMENT PRIMARY KEY);
    Query OK, 0 rows affected (0.06 sec)

    mysql> INSERT INTO autoinc2 VALUES (NULL), (NULL), (NULL), (NULL);
    Query OK, 4 rows affected (0.00 sec)
    Records: 4  Duplicates: 0  Warnings: 0

    mysql> SELECT col FROM autoinc2;
    +-----+
    | col |
    +-----+
    |   5 |
    |  15 |
    |  25 |
    |  35 |
    +-----+
    4 rows in set (0.02 sec)
    ```

    When the value of `auto_increment_offset` is greater than that of `auto_increment_increment`, the value of `auto_increment_offset` is ignored.

  If either of these variables is changed, and then new rows inserted into a table containing an `AUTO_INCREMENT` column, the results may seem counterintuitive because the series of `AUTO_INCREMENT` values is calculated without regard to any values already present in the column, and the next value inserted is the least value in the series that is greater than the maximum existing value in the `AUTO_INCREMENT` column. The series is calculated like this:

  `auto_increment_offset` + *`N`* × `auto_increment_increment`

  where *`N`* is a positive integer value in the series [1, 2, 3, ...]. For example:

  ```sql
  mysql> SHOW VARIABLES LIKE 'auto_inc%';
  +--------------------------+-------+
  | Variable_name            | Value |
  +--------------------------+-------+
  | auto_increment_increment | 10    |
  | auto_increment_offset    | 5     |
  +--------------------------+-------+
  2 rows in set (0.00 sec)

  mysql> SELECT col FROM autoinc1;
  +-----+
  | col |
  +-----+
  |   1 |
  |  11 |
  |  21 |
  |  31 |
  +-----+
  4 rows in set (0.00 sec)

  mysql> INSERT INTO autoinc1 VALUES (NULL), (NULL), (NULL), (NULL);
  Query OK, 4 rows affected (0.00 sec)
  Records: 4  Duplicates: 0  Warnings: 0

  mysql> SELECT col FROM autoinc1;
  +-----+
  | col |
  +-----+
  |   1 |
  |  11 |
  |  21 |
  |  31 |
  |  35 |
  |  45 |
  |  55 |
  |  65 |
  +-----+
  8 rows in set (0.00 sec)
  ```

  The values shown for `auto_increment_increment` and `auto_increment_offset` generate the series 5 + *`N`* × 10, that is, [5, 15, 25, 35, 45, ...]. The highest value present in the `col` column prior to the `INSERT` is 31, and the next available value in the `AUTO_INCREMENT` series is 35, so the inserted values for `col` begin at that point and the results are as shown for the `SELECT` query.

  It is not possible to restrict the effects of these two variables to a single table; these variables control the behavior of all `AUTO_INCREMENT` columns in *all* tables on the MySQL server. If the global value of either variable is set, its effects persist until the global value is changed or overridden by setting the session value, or until `mysqld` is restarted. If the local value is set, the new value affects `AUTO_INCREMENT` columns for all tables into which new rows are inserted by the current user for the duration of the session, unless the values are changed during that session.

  The default value of `auto_increment_increment` is

  1. See Section 16.4.1.1, “Replication and AUTO\_INCREMENT”.

* `auto_increment_offset`

  <table frame="box" rules="all" summary="Properties for auto_increment_offset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-increment-offset=#</code></td> </tr><tr><th>System Variable</th> <td><code>auto_increment_offset</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>

  This variable has a default value of 1. If it is left with its default value, and Group Replication is started on the server, it is changed to the server ID. For more information, see the description for `auto_increment_increment`.

  Note

  `auto_increment_offset` is also supported for use with `NDB` tables.

* `rpl_semi_sync_master_enabled`

  <table frame="box" rules="all" summary="Properties for rpl_semi_sync_master_enabled"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--rpl-semi-sync-master-enabled[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>rpl_semi_sync_master_enabled</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Controls whether semisynchronous replication is enabled on the source. To enable or disable the plugin, set this variable to `ON` or `OFF` (or 1 or 0), respectively. The default is `OFF`.

  This variable is available only if the source-side semisynchronous replication plugin is installed.

* `rpl_semi_sync_master_timeout`

  <table frame="box" rules="all" summary="Properties for rpl_semi_sync_master_timeout"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--rpl-semi-sync-master-timeout=#</code></td> </tr><tr><th>System Variable</th> <td><code>rpl_semi_sync_master_timeout</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>10000</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>milliseconds</td> </tr></tbody></table>

  A value in milliseconds that controls how long the source waits on a commit for acknowledgment from a replica before timing out and reverting to asynchronous replication. The default value is 10000 (10 seconds).

  This variable is available only if the source-side semisynchronous replication plugin is installed.

* `rpl_semi_sync_master_trace_level`

  <table frame="box" rules="all" summary="Properties for rpl_semi_sync_master_trace_level"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--rpl-semi-sync-master-trace-level=#</code></td> </tr><tr><th>System Variable</th> <td><code>rpl_semi_sync_master_trace_level</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>32</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  The semisynchronous replication debug trace level on the source. Four levels are defined:

  + 1 = general level (for example, time function failures)
  + 16 = detail level (more verbose information)
  + 32 = net wait level (more information about network waits)

  + 64 = function level (information about function entry and exit)

  This variable is available only if the source-side semisynchronous replication plugin is installed.

* `rpl_semi_sync_master_wait_for_slave_count`

  <table frame="box" rules="all" summary="Properties for rpl_semi_sync_master_wait_for_slave_count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--rpl-semi-sync-master-wait-for-slave-count=#</code></td> </tr><tr><th>System Variable</th> <td><code>rpl_semi_sync_master_wait_for_slave_count</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>

  The number of replica acknowledgments the source must receive per transaction before proceeding. By default `rpl_semi_sync_master_wait_for_slave_count` is `1`, meaning that semisynchronous replication proceeds after receiving a single replica acknowledgment. Performance is best for small values of this variable.

  For example, if `rpl_semi_sync_master_wait_for_slave_count` is `2`, then 2 replicas must acknowledge receipt of the transaction before the timeout period configured by `rpl_semi_sync_master_timeout` for semisynchronous replication to proceed. If fewer replicas acknowledge receipt of the transaction during the timeout period, the source reverts to normal replication.

  Note

  This behavior also depends on `rpl_semi_sync_master_wait_no_slave`

  This variable is available only if the source-side semisynchronous replication plugin is installed.

* `rpl_semi_sync_master_wait_no_slave`

  <table frame="box" rules="all" summary="Properties for rpl_semi_sync_master_wait_no_slave"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--rpl-semi-sync-master-wait-no-slave[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>rpl_semi_sync_master_wait_no_slave</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  Controls whether the source waits for the timeout period configured by `rpl_semi_sync_master_timeout` to expire, even if the replica count drops to less than the number of replicas configured by `rpl_semi_sync_master_wait_for_slave_count` during the timeout period.

  When the value of `rpl_semi_sync_master_wait_no_slave` is `ON` (the default), it is permissible for the replica count to drop to less than `rpl_semi_sync_master_wait_for_slave_count` during the timeout period. As long as enough replicas acknowledge the transaction before the timeout period expires, semisynchronous replication continues.

  When the value of `rpl_semi_sync_master_wait_no_slave` is `OFF`, if the replica count drops to less than the number configured in `rpl_semi_sync_master_wait_for_slave_count` at any time during the timeout period configured by `rpl_semi_sync_master_timeout`, the source reverts to normal replication.

  This variable is available only if the source-side semisynchronous replication plugin is installed.

* `rpl_semi_sync_master_wait_point`

  <table frame="box" rules="all" summary="Properties for rpl_semi_sync_master_wait_point"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--rpl-semi-sync-master-wait-point=value</code></td> </tr><tr><th>System Variable</th> <td><code>rpl_semi_sync_master_wait_point</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>AFTER_SYNC</code></td> </tr><tr><th>Valid Values</th> <td><code>AFTER_SYNC</code><code>AFTER_COMMIT</code></td> </tr></tbody></table>

  This variable controls the point at which a semisynchronous source waits for replica acknowledgment of transaction receipt before returning a status to the client that committed the transaction. These values are permitted:

  + `AFTER_SYNC` (the default): The source writes each transaction to its binary log and the replica, and syncs the binary log to disk. The source waits for replica acknowledgment of transaction receipt after the sync. Upon receiving acknowledgment, the source commits the transaction to the storage engine and returns a result to the client, which then can proceed.

  + `AFTER_COMMIT`: The source writes each transaction to its binary log and the replica, syncs the binary log, and commits the transaction to the storage engine. The source waits for replica acknowledgment of transaction receipt after the commit. Upon receiving acknowledgment, the source returns a result to the client, which then can proceed.

  The replication characteristics of these settings differ as follows:

  + With `AFTER_SYNC`, all clients see the committed transaction at the same time: After it has been acknowledged by the replica and committed to the storage engine on the source. Thus, all clients see the same data on the source.

    In the event of source failure, all transactions committed on the source have been replicated to the replica (saved to its relay log). An unexpected exit of the source and failover to the replica is lossless because the replica is up to date. Note, however, that the source cannot be restarted in this scenario and must be discarded, because its binary log might contain uncommitted transactions that would cause a conflict with the replica when externalized after binary log recovery.

  + With `AFTER_COMMIT`, the client issuing the transaction gets a return status only after the server commits to the storage engine and receives replica acknowledgment. After the commit and before replica acknowledgment, other clients can see the committed transaction before the committing client.

    If something goes wrong such that the replica does not process the transaction, then in the event of an unexpected source exit and failover to the replica, it is possible for such clients to see a loss of data relative to what they saw on the source.

  This variable is available only if the source-side semisynchronous replication plugin is installed.

  `rpl_semi_sync_master_wait_point` was added in MySQL 5.7.2. For older versions, semisynchronous source behavior is equivalent to a setting of `AFTER_COMMIT`.

  This change introduces a version compatibility constraint because it increments the semisynchronous interface version: Servers for MySQL 5.7.2 and up do not work with semisynchronous replication plugins from older versions, nor do servers from older versions work with semisynchronous replication plugins for MySQL 5.7.2 and up.


#### 16.1.6.3 Replica Server Options and Variables

This section explains the server options and system variables that apply to replicas and contains the following:

* Startup Options for Replicas
* Options for Logging Replica Status to Tables
* System Variables Used on Replicas

Specify the options either on the command line or in an option file. Many of the options can be set while the server is running by using the `CHANGE MASTER TO` statement. Specify system variable values using `SET`.

**Server ID.** On the source and each replica, you must set the `server_id` system variable to establish a unique replication ID in the range from 1 to 232 − 1. “Unique” means that each ID must be different from every other ID in use by any other source or replica in the replication topology. Example `my.cnf` file:

```sql
[mysqld]
server-id=3
```

##### Startup Options for Replicas

This section explains startup options for controlling replica servers. Many of these options can be set while the server is running by using the `CHANGE MASTER TO` statement. Others, such as the `--replicate-*` options, can be set only when the replica server starts. Replication-related system variables are discussed later in this section.

* `--log-warnings[=level]`

  <table frame="box" rules="all" summary="Properties for log-warnings"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-warnings[=#]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code>log_warnings</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>2</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Note

  The `log_error_verbosity` system variable is preferred over, and should be used instead of, the `--log-warnings` option or `log_warnings` system variable. For more information, see the descriptions of `log_error_verbosity` and `log_warnings`. The `--log-warnings` command-line option and `log_warnings` system variable are deprecated; expect them to be removed in a future MySQL release.

  Causes the server to record more messages to the error log about what it is doing. With respect to replication, the server generates warnings that it succeeded in reconnecting after a network or connection failure, and provides information about how each replication thread started. This variable is set to 2 by default. To disable it, set it to 0. The server logs messages about statements that are unsafe for statement-based logging if the value is greater than 0. Aborted connections and access-denied errors for new connection attempts are logged if the value is greater than

  1. See Section B.3.2.9, “Communication Errors and Aborted Connections”.

  Note

  The effects of this option are not limited to replication. It affects diagnostic messages across a spectrum of server activities.

* `--master-info-file=file_name`

  <table frame="box" rules="all" summary="Properties for master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>

  The name to use for the file in which the replica records information about the source. The default name is `master.info` in the data directory. For information about the format of this file, see Section 16.2.4.2, “Replication Metadata Repositories”.

* `--master-retry-count=count`

  <table frame="box" rules="all" summary="Properties for master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>

  The number of times that the replica tries to reconnect to the source before giving up. The default value is 86400 times. A value of 0 means “infinite”, and the replica attempts to connect forever. Reconnection attempts are triggered when the replica reaches its connection timeout (specified by the `slave_net_timeout` system variable) without receiving data or a heartbeat signal from the source. Reconnection is attempted at intervals set by the `MASTER_CONNECT_RETRY` option of the `CHANGE MASTER TO` statement (which defaults to every 60 seconds).

  This option is deprecated; expect it to be removed in a future MySQL release. Use the `MASTER_RETRY_COUNT` option of the `CHANGE MASTER TO` statement instead.

* `--max-relay-log-size=size`

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>

  The size at which the server rotates relay log files automatically. If this value is nonzero, the relay log is rotated automatically when its size exceeds this value. If this value is zero (the default), the size at which relay log rotation occurs is determined by the value of `max_binlog_size`. For more information, see Section 16.2.4.1, “The Relay Log”.

* `--relay-log-purge={0|1}`

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  Disable or enable automatic purging of relay logs as soon as they are no longer needed. The default value is 1 (enabled). This is a global variable that can be changed dynamically with `SET GLOBAL relay_log_purge = N`. Disabling purging of relay logs when enabling the `--relay-log-recovery` option puts data consistency at risk.

* `--relay-log-space-limit=size`

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>

  This option places an upper limit on the total size in bytes of all relay logs on the replica. A value of 0 means “no limit”. This is useful for a replica server host that has limited disk space. When the limit is reached, the replication I/O thread stops reading binary log events from the source until the replication SQL thread has caught up and deleted some unused relay logs. Note that this limit is not absolute: There are cases where the SQL thread needs more events before it can delete relay logs. In that case, the I/O thread exceeds the limit until it becomes possible for the SQL thread to delete some relay logs because not doing so would cause a deadlock. You should not set `--relay-log-space-limit` to less than twice the value of `--max-relay-log-size` (or `--max-binlog-size` if `--max-relay-log-size` is 0). In that case, there is a chance that the I/O thread waits for free space because `--relay-log-space-limit` is exceeded, but the SQL thread has no relay log to purge and is unable to satisfy the I/O thread. This forces the I/O thread to ignore `--relay-log-space-limit` temporarily.

* `--replicate-do-db=db_name`

  <table frame="box" rules="all" summary="Properties for replicate-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Creates a replication filter using the name of a database. Such filters can also be created using `CHANGE REPLICATION FILTER REPLICATE_DO_DB`. The precise effect of this filtering depends on whether statement-based or row-based replication is in use, and are described in the next several paragraphs.

  Important

  Replication filters cannot be used on a MySQL server instance that is configured for Group Replication, because filtering transactions on some servers would make the group unable to reach agreement on a consistent state.

  **Statement-based replication.** Tell the replication SQL thread to restrict replication to statements where the default database (that is, the one selected by `USE`) is *`db_name`*. To specify more than one database, use this option multiple times, once for each database; however, doing so does *not* replicate cross-database statements such as `UPDATE some_db.some_table SET foo='bar'` while a different database (or no database) is selected.

  Warning

  To specify multiple databases you *must* use multiple instances of this option. Because database names can contain commas, if you supply a comma separated list then the list is treated as the name of a single database.

  An example of what does not work as you might expect when using statement-based replication: If the replica is started with `--replicate-do-db=sales` and you issue the following statements on the source, the `UPDATE` statement is *not* replicated:

  ```sql
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

  The main reason for this “check just the default database” behavior is that it is difficult from the statement alone to know whether it should be replicated (for example, if you are using multiple-table `DELETE` statements or multiple-table `UPDATE` statements that act across multiple databases). It is also faster to check only the default database rather than all databases if there is no need.

  **Row-based replication.** Tells the replication SQL thread to restrict replication to database *`db_name`*. Only tables belonging to *`db_name`* are changed; the current database has no effect on this. Suppose that the replica is started with `--replicate-do-db=sales` and row-based replication is in effect, and then the following statements are run on the source:

  ```sql
  USE prices;
  UPDATE sales.february SET amount=amount+100;
  ```

  The `february` table in the `sales` database on the replica is changed in accordance with the `UPDATE` statement; this occurs whether or not the `USE` statement was issued. However, issuing the following statements on the source has no effect on the replica when using row-based replication and `--replicate-do-db=sales`:

  ```sql
  USE prices;
  UPDATE prices.march SET amount=amount-25;
  ```

  Even if the statement `USE prices` were changed to `USE sales`, the `UPDATE` statement's effects would still not be replicated.

  Another important difference in how `--replicate-do-db` is handled in statement-based replication as opposed to row-based replication occurs with regard to statements that refer to multiple databases. Suppose that the replica is started with `--replicate-do-db=db1`, and the following statements are executed on the source:

  ```sql
  USE db1;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

  If you are using statement-based replication, then both tables are updated on the replica. However, when using row-based replication, only `table1` is affected on the replica; since `table2` is in a different database, `table2` on the replica is not changed by the `UPDATE`. Now suppose that, instead of the `USE db1` statement, a `USE db4` statement had been used:

  ```sql
  USE db4;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

  In this case, the `UPDATE` statement would have no effect on the replica when using statement-based replication. However, if you are using row-based replication, the `UPDATE` would change `table1` on the replica, but not `table2`—in other words, only tables in the database named by `--replicate-do-db` are changed, and the choice of default database has no effect on this behavior.

  If you need cross-database updates to work, use `--replicate-wild-do-table=db_name.%` instead. See Section 16.2.5, “How Servers Evaluate Replication Filtering Rules”.

  Note

  This option affects replication in the same manner that `--binlog-do-db` affects binary logging, and the effects of the replication format on how `--replicate-do-db` affects replication behavior are the same as those of the logging format on the behavior of `--binlog-do-db`.

  This option has no effect on `BEGIN`, `COMMIT`, or `ROLLBACK` statements.

* `--replicate-ignore-db=db_name`

  <table frame="box" rules="all" summary="Properties for replicate-ignore-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Creates a replication filter using the name of a database. Such filters can also be created using `CHANGE REPLICATION FILTER REPLICATE_IGNORE_DB`. As with `--replicate-do-db`, the precise effect of this filtering depends on whether statement-based or row-based replication is in use, and are described in the next several paragraphs.

  Important

  Replication filters cannot be used on a MySQL server instance that is configured for Group Replication, because filtering transactions on some servers would make the group unable to reach agreement on a consistent state.

  **Statement-based replication.** Tells the replication SQL thread not to replicate any statement where the default database (that is, the one selected by `USE`) is *`db_name`*.

  **Row-based replication.** Tells the replication SQL thread not to update any tables in the database *`db_name`*. The default database has no effect.

  When using statement-based replication, the following example does not work as you might expect. Suppose that the replica is started with `--replicate-ignore-db=sales` and you issue the following statements on the source:

  ```sql
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

  The `UPDATE` statement *is* replicated in such a case because `--replicate-ignore-db` applies only to the default database (determined by the `USE` statement). Because the `sales` database was specified explicitly in the statement, the statement has not been filtered. However, when using row-based replication, the `UPDATE` statement's effects are *not* propagated to the replica, and the replica's copy of the `sales.january` table is unchanged; in this instance, `--replicate-ignore-db=sales` causes *all* changes made to tables in the source's copy of the `sales` database to be ignored by the replica.

  To specify more than one database to ignore, use this option multiple times, once for each database. Because database names can contain commas, if you supply a comma separated list then the list is treated as the name of a single database.

  You should not use this option if you are using cross-database updates and you do not want these updates to be replicated. See Section 16.2.5, “How Servers Evaluate Replication Filtering Rules”.

  If you need cross-database updates to work, use `--replicate-wild-ignore-table=db_name.%` instead. See Section 16.2.5, “How Servers Evaluate Replication Filtering Rules”.

  Note

  This option affects replication in the same manner that `--binlog-ignore-db` affects binary logging, and the effects of the replication format on how `--replicate-ignore-db` affects replication behavior are the same as those of the logging format on the behavior of `--binlog-ignore-db`.

  This option has no effect on `BEGIN`, `COMMIT`, or `ROLLBACK` statements.

* `--replicate-do-table=db_name.tbl_name`

  <table frame="box" rules="all" summary="Properties for replicate-do-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Creates a replication filter by telling the replication SQL thread to restrict replication to a given table. To specify more than one table, use this option multiple times, once for each table. This works for both cross-database updates and default database updates, in contrast to `--replicate-do-db`. See Section 16.2.5, “How Servers Evaluate Replication Filtering Rules”. You can also create such a filter by issuing a `CHANGE REPLICATION FILTER REPLICATE_DO_TABLE` statement.

  Important

  Replication filters cannot be used on a MySQL server instance that is configured for Group Replication, because filtering transactions on some servers would make the group unable to reach agreement on a consistent state.

  This option affects only statements that apply to tables. It does not affect statements that apply only to other database objects, such as stored routines. To filter statements operating on stored routines, use one or more of the `--replicate-*-db` options.

* `--replicate-ignore-table=db_name.tbl_name`

  <table frame="box" rules="all" summary="Properties for replicate-ignore-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-ignore-table=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Creates a replication filter by telling the replication SQL thread not to replicate any statement that updates the specified table, even if any other tables might be updated by the same statement. To specify more than one table to ignore, use this option multiple times, once for each table. This works for cross-database updates, in contrast to `--replicate-ignore-db`. See Section 16.2.5, “How Servers Evaluate Replication Filtering Rules”. You can also create such a filter by issuing a `CHANGE REPLICATION FILTER REPLICATE_IGNORE_TABLE` statement.

  Note

  Replication filters cannot be used on a MySQL server instance that is configured for Group Replication, because filtering transactions on some servers would make the group unable to reach agreement on a consistent state.

  This option affects only statements that apply to tables. It does not affect statements that apply only to other database objects, such as stored routines. To filter statements operating on stored routines, use one or more of the `--replicate-*-db` options.

* `--replicate-rewrite-db=from_name->to_name`

  <table frame="box" rules="all" summary="Properties for master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>0

  Tells the replica to create a replication filter that translates the specified database to *`to_name`* if it was *`from_name`* on the source. Only statements involving tables are affected, not statements such as `CREATE DATABASE`, `DROP DATABASE`, and `ALTER DATABASE`.

  To specify multiple rewrites, use this option multiple times. The server uses the first one with a *`from_name`* value that matches. The database name translation is done *before* the `--replicate-*` rules are tested. You can also create such a filter by issuing a `CHANGE REPLICATION FILTER REPLICATE_REWRITE_DB` statement.

  If you use the `--replicate-rewrite-db` option on the command line and the `>` character is special to your command interpreter, quote the option value. For example:

  ```sql
  $> mysqld --replicate-rewrite-db="olddb->newdb"
  ```

  The effect of the `--replicate-rewrite-db` option differs depending on whether statement-based or row-based binary logging format is used for the query. With statement-based format, DML statements are translated based on the current database, as specified by the `USE` statement. With row-based format, DML statements are translated based on the database where the modified table exists. DDL statements are always filtered based on the current database, as specified by the `USE` statement, regardless of the binary logging format.

  To ensure that rewriting produces the expected results, particularly in combination with other replication filtering options, follow these recommendations when you use the `--replicate-rewrite-db` option:

  + Create the *`from_name`* and *`to_name`* databases manually on the source and the replica with different names.

  + If you use statement-based or mixed binary logging format, do not use cross-database queries, and do not specify database names in queries. For both DDL and DML statements, rely on the `USE` statement to specify the current database, and use only the table name in queries.

  + If you use row-based binary logging format exclusively, for DDL statements, rely on the `USE` statement to specify the current database, and use only the table name in queries. For DML statements, you can use a fully qualified table name (*`db`*.*`table`*) if you want.

  If these recommendations are followed, it is safe to use the `--replicate-rewrite-db` option in combination with table-level replication filtering options such as `--replicate-do-table`.

  Note

  Global replication filters cannot be used on a MySQL server instance that is configured for Group Replication, because filtering transactions on some servers would make the group unable to reach agreement on a consistent state.

* `--replicate-same-server-id`

  <table frame="box" rules="all" summary="Properties for master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>1

  To be used on replica servers. Usually you should use the default setting of 0, to prevent infinite loops caused by circular replication. If set to 1, the replica does not skip events having its own server ID. Normally, this is useful only in rare configurations. Cannot be set to 1 if `log_slave_updates` is enabled. By default, the replication I/O thread does not write binary log events to the relay log if they have the replica's server ID (this optimization helps save disk usage). If you want to use `--replicate-same-server-id`, be sure to start the replica with this option before you make the replica read its own events that you want the replication SQL thread to execute.

* `--replicate-wild-do-table=db_name.tbl_name`

  <table frame="box" rules="all" summary="Properties for master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>2

  Creates a replication filter by telling the replication SQL thread to restrict replication to statements where any of the updated tables match the specified database and table name patterns. Patterns can contain the `%` and `_` wildcard characters, which have the same meaning as for the `LIKE` pattern-matching operator. To specify more than one table, use this option multiple times, once for each table. This works for cross-database updates. See Section 16.2.5, “How Servers Evaluate Replication Filtering Rules”. You can also create such a filter by issuing a `CHANGE REPLICATION FILTER REPLICATE_WILD_DO_TABLE` statement.

  Note

  Replication filters cannot be used on a MySQL server instance that is configured for Group Replication, because filtering transactions on some servers would make the group unable to reach agreement on a consistent state.

  This option applies to tables, views, and triggers. It does not apply to stored procedures and functions, or events. To filter statements operating on the latter objects, use one or more of the `--replicate-*-db` options.

  As an example, `--replicate-wild-do-table=foo%.bar%` replicates only updates that use a table where the database name starts with `foo` and the table name starts with `bar`.

  If the table name pattern is `%`, it matches any table name and the option also applies to database-level statements (`CREATE DATABASE`, `DROP DATABASE`, and `ALTER DATABASE`). For example, if you use `--replicate-wild-do-table=foo%.%`, database-level statements are replicated if the database name matches the pattern `foo%`.

  Important

  Table-level replication filters are only applied to tables that are explicitly mentioned and operated on in the query. They do not apply to tables that are implicitly updated by the query. For example, a `GRANT` statement, which updates the `mysql.user` system table but does not mention that table, is not affected by a filter that specifies `mysql.%` as the wildcard pattern.

  To include literal wildcard characters in the database or table name patterns, escape them with a backslash. For example, to replicate all tables of a database that is named `my_own%db`, but not replicate tables from the `my1ownAABCdb` database, you should escape the `_` and `%` characters like this: `--replicate-wild-do-table=my\_own\%db`. If you use the option on the command line, you might need to double the backslashes or quote the option value, depending on your command interpreter. For example, with the **bash** shell, you would need to type `--replicate-wild-do-table=my\\_own\\%db`.

* `--replicate-wild-ignore-table=db_name.tbl_name`

  <table frame="box" rules="all" summary="Properties for master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>3

  Creates a replication filter which keeps the replication SQL thread from replicating a statement in which any table matches the given wildcard pattern. To specify more than one table to ignore, use this option multiple times, once for each table. This works for cross-database updates. See Section 16.2.5, “How Servers Evaluate Replication Filtering Rules”. You can also create such a filter by issuing a `CHANGE REPLICATION FILTER REPLICATE_WILD_IGNORE_TABLE` statement.

  Important

  Replication filters cannot be used on a MySQL server instance that is configured for Group Replication, because filtering transactions on some servers would make the group unable to reach agreement on a consistent state.

  As an example, `--replicate-wild-ignore-table=foo%.bar%` does not replicate updates that use a table where the database name starts with `foo` and the table name starts with `bar`.

  For information about how matching works, see the description of the `--replicate-wild-do-table` option. The rules for including literal wildcard characters in the option value are the same as for `--replicate-wild-ignore-table` as well.

  Important

  Table-level replication filters are only applied to tables that are explicitly mentioned and operated on in the query. They do not apply to tables that are implicitly updated by the query. For example, a `GRANT` statement, which updates the `mysql.user` system table but does not mention that table, is not affected by a filter that specifies `mysql.%` as the wildcard pattern.

  If you need to filter out `GRANT` statements or other administrative statements, a possible workaround is to use the `--replicate-ignore-db` filter. This filter operates on the default database that is currently in effect, as determined by the `USE` statement. You can therefore create a filter to ignore statements for a database that is not replicated, then issue the `USE` statement to switch the default database to that one immediately before issuing any administrative statements that you want to ignore. In the administrative statement, name the actual database where the statement is applied.

  For example, if `--replicate-ignore-db=nonreplicated` is configured on the replica server, the following sequence of statements causes the `GRANT` statement to be ignored, because the default database `nonreplicated` is in effect:

  ```sql
  USE nonreplicated;
  GRANT SELECT, INSERT ON replicated.t1 TO 'someuser'@'somehost';
  ```

* `--skip-slave-start`

  <table frame="box" rules="all" summary="Properties for master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>4

  Tells the replica server not to start the replication threads when the server starts. To start the threads later, use a `START SLAVE` statement.

* `--slave-skip-errors=[err_code1,err_code2,...|all|ddl_exist_errors]`

  <table frame="box" rules="all" summary="Properties for master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>5

  Normally, replication stops when an error occurs on the replica, which gives you the opportunity to resolve the inconsistency in the data manually. This option causes the replication SQL thread to continue replication when a statement returns any of the errors listed in the option value.

  Do not use this option unless you fully understand why you are getting errors. If there are no bugs in your replication setup and client programs, and no bugs in MySQL itself, an error that stops replication should never occur. Indiscriminate use of this option results in replicas becoming hopelessly out of synchrony with the source, with you having no idea why this has occurred.

  For error codes, you should use the numbers provided by the error message in the replica's error log and in the output of `SHOW SLAVE STATUS`. Appendix B, *Error Messages and Common Problems*, lists server error codes.

  The shorthand value `ddl_exist_errors` is equivalent to the error code list `1007,1008,1050,1051,1054,1060,1061,1068,1091,1146`.

  You can also (but should not) use the very nonrecommended value of `all` to cause the replica to ignore all error messages and keeps going regardless of what happens. Needless to say, if you use `all`, there are no guarantees regarding the integrity of your data. Please do not complain (or file bug reports) in this case if the replica's data is not anywhere close to what it is on the source. *You have been warned*.

  This option does not work in the same way when replicating between NDB Clusters, due to the internal `NDB` mechanism for checking epoch sequence numbers; as soon as `NDB` detects an epoch number that is missing or otherwise out of sequence, it immediately stops the replica applier thread.

  Examples:

  ```sql
  --slave-skip-errors=1062,1053
  --slave-skip-errors=all
  --slave-skip-errors=ddl_exist_errors
  ```

* `--slave-sql-verify-checksum={0|1}`

  <table frame="box" rules="all" summary="Properties for master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>6

  When this option is enabled, the replica examines checksums read from the relay log,. In the event of a mismatch, the replica stops with an error.

The following options are used internally by the MySQL test suite for replication testing and debugging. They are not intended for use in a production setting.

* `--abort-slave-event-count`

  <table frame="box" rules="all" summary="Properties for master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>7

  When this option is set to some positive integer *`value`* other than 0 (the default) it affects replication behavior as follows: After the replication SQL thread has started, *`value`* log events are permitted to be executed; after that, the replication SQL thread does not receive any more events, just as if the network connection from the source were cut. The replication SQL thread continues to run, and the output from `SHOW SLAVE STATUS` displays `Yes` in both the `Slave_IO_Running` and the `Slave_SQL_Running` columns, but no further events are read from the relay log.

  This option is used internally by the MySQL test suite for replication testing and debugging. It is not intended for use in a production setting.

* `--disconnect-slave-event-count`

  <table frame="box" rules="all" summary="Properties for master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>8

  This option is used internally by the MySQL test suite for replication testing and debugging. It is not intended for use in a production setting.

##### Options for Logging Replica Status to Tables

MySQL 5.7 supports logging of replication metadata to tables rather than files. Writing of the replica's connection metadata repository and applier metadata repository can be configured separately using these two system variables:

* `master_info_repository`
* `relay_log_info_repository`

For information about these variables, see Section 16.1.6.3, “Replica Server Options and Variables”.

These variables can be used to make a replica resilient to unexpected halts. See Section 16.3.2, “Handling an Unexpected Halt of a Replica”, for more information.

The info log tables and their contents are considered local to a given MySQL Server. They are not replicated, and changes to them are not written to the binary log.

For more information, see Section 16.2.4, “Relay Log and Replication Metadata Repositories”.

##### System Variables Used on Replicas

The following list describes system variables for controlling replica servers. They can be set at server startup and some of them can be changed at runtime using `SET`. Server options used with replicas are listed earlier in this section.

* `init_slave`

  <table frame="box" rules="all" summary="Properties for master-info-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-info-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>master.info</code></td> </tr></tbody></table>9

  This variable is similar to `init_connect`, but is a string to be executed by a replica server each time the replication SQL thread starts. The format of the string is the same as for the `init_connect` variable. The setting of this variable takes effect for subsequent `START SLAVE` statements.

  Note

  The replication SQL thread sends an acknowledgment to the client before it executes `init_slave`. Therefore, it is not guaranteed that `init_slave` has been executed when `START SLAVE` returns. See Section 13.4.2.5, “START SLAVE Statement”, for more information.

* `log_slow_slave_statements`

  <table frame="box" rules="all" summary="Properties for master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>0

  When the slow query log is enabled, this variable enables logging for queries that have taken more than `long_query_time` seconds to execute on the replica. Note that if row-based replication is in use (`binlog_format=ROW`), `log_slow_slave_statements` has no effect. Queries are only added to the replica's slow query log when they are logged in statement format in the binary log, that is, when `binlog_format=STATEMENT` is set, or when `binlog_format=MIXED` is set and the statement is logged in statement format. Slow queries that are logged in row format when `binlog_format=MIXED` is set, or that are logged when `binlog_format=ROW` is set, are not added to the replica's slow query log, even if `log_slow_slave_statements` is enabled.

  Setting `log_slow_slave_statements` has no immediate effect. The state of the variable applies on all subsequent `START SLAVE` statements. Also note that the global setting for `long_query_time` applies for the lifetime of the SQL thread. If you change that setting, you must stop and restart the replication SQL thread to implement the change there (for example, by issuing `STOP SLAVE` and `START SLAVE` statements with the `SQL_THREAD` option).

* `master_info_repository`

  <table frame="box" rules="all" summary="Properties for master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>1

  The setting of this variable determines whether the replica records metadata about the source, consisting of status and connection information, to an `InnoDB` table in the `mysql` system database, or as a file in the data directory. For more information on the connection metadata repository, see Section 16.2.4, “Relay Log and Replication Metadata Repositories”.

  The default setting is `FILE`. As a file, the replica's connection metadata repository is named `master.info` by default. You can change this name using the `--master-info-file` option.

  The alternative setting is `TABLE`. As an `InnoDB` table, the replica's connection metadata repository is named `mysql.slave_master_info`. The `TABLE` setting is required when multiple replication channels are configured.

  This variable must be set to `TABLE` before configuring multiple replication channels. If you are using multiple replication channels, you cannot set the value back to `FILE`.

  The setting for the location of the connection metadata repository has a direct influence on the effect had by the setting of the `sync_master_info` system variable. You can change the setting only when no replication threads are executing.

* `max_relay_log_size`

  <table frame="box" rules="all" summary="Properties for master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>2

  If a write by a replica to its relay log causes the current log file size to exceed the value of this variable, the replica rotates the relay logs (closes the current file and opens the next one). If `max_relay_log_size` is 0, the server uses `max_binlog_size` for both the binary log and the relay log. If `max_relay_log_size` is greater than 0, it constrains the size of the relay log, which enables you to have different sizes for the two logs. You must set `max_relay_log_size` to between 4096 bytes and 1GB (inclusive), or to 0. The default value is 0. See Section 16.2.3, “Replication Threads”.

* `relay_log`

  <table frame="box" rules="all" summary="Properties for master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>3

  The base name for relay log files. For the default replication channel, the default base name for relay logs is `host_name-relay-bin`. For non-default replication channels, the default base name for relay logs is `host_name-relay-bin-channel`, where *`channel`* is the name of the replication channel recorded in this relay log.

  The server writes the file in the data directory unless the base name is given with a leading absolute path name to specify a different directory. The server creates relay log files in sequence by adding a numeric suffix to the base name.

  Due to the manner in which MySQL parses server options, if you specify this variable at server startup, you must supply a value; *the default base name is used only if the option is not actually specified*. If you specify the `relay_log` system variable at server startup without specifying a value, unexpected behavior is likely to result; this behavior depends on the other options used, the order in which they are specified, and whether they are specified on the command line or in an option file. For more information about how MySQL handles server options, see Section 4.2.2, “Specifying Program Options”.

  If you specify this variable, the value specified is also used as the base name for the relay log index file. You can override this behavior by specifying a different relay log index file base name using the `relay_log_index` system variable.

  When the server reads an entry from the index file, it checks whether the entry contains a relative path. If it does, the relative part of the path is replaced with the absolute path set using the `relay_log` system variable. An absolute path remains unchanged; in such a case, the index must be edited manually to enable the new path or paths to be used.

  You may find the `relay_log` system variable useful in performing the following tasks:

  + Creating relay logs whose names are independent of host names.

  + If you need to put the relay logs in some area other than the data directory because your relay logs tend to be very large and you do not want to decrease `max_relay_log_size`.

  + To increase speed by using load-balancing between disks.

  You can obtain the relay log file name (and path) from the `relay_log_basename` system variable.

* `relay_log_basename`

  <table frame="box" rules="all" summary="Properties for master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>4

  Holds the base name and complete path to the relay log file. The maximum variable length is 256. This variable is set by the server and is read only.

* `relay_log_index`

  <table frame="box" rules="all" summary="Properties for master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>5

  The name for the relay log index file. The maximum variable length is 256. For the default replication channel, the default name is `host_name-relay-bin.index`. For non-default replication channels, the default name is `host_name-relay-bin-channel.index`, where *`channel`* is the name of the replication channel recorded in this relay log index.

  The server writes the file in the data directory unless the name is given with a leading absolute path name to specify a different directory. name.

  Due to the manner in which MySQL parses server options, if you specify this variable at server startup, you must supply a value; *the default base name is used only if the option is not actually specified*. If you specify the `relay_log_index` system variable at server startup without specifying a value, unexpected behavior is likely to result; this behavior depends on the other options used, the order in which they are specified, and whether they are specified on the command line or in an option file. For more information about how MySQL handles server options, see Section 4.2.2, “Specifying Program Options”.

* `relay_log_info_file`

  <table frame="box" rules="all" summary="Properties for master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>6

  The name of the file in which the replica records information about the relay logs, when `relay_log_info_repository=FILE`. If `relay_log_info_repository=TABLE`, it is the file name that would be used in case the repository was changed to `FILE`). The default name is `relay-log.info` in the data directory. For information about the applier metadata repository, see Section 16.2.4.2, “Replication Metadata Repositories”.

* `relay_log_info_repository`

  <table frame="box" rules="all" summary="Properties for master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>7

  The setting of this variable determines whether the replica server stores its applier metadata repository as an `InnoDB` table in the `mysql` system database, or as a file in the data directory. For more information on the applier metadata repository, see Section 16.2.4, “Relay Log and Replication Metadata Repositories”.

  The default setting is `FILE`. As a file, the replica's applier metadata repository is named `relay-log.info` by default, and you can change this name using the `relay_log_info_file` system variable.

  With the setting `TABLE`, as an `InnoDB` table, the replica's applier metadata repository is named `mysql.slave_relay_log_info`. The `TABLE` setting is required when multiple replication channels are configured. The `TABLE` setting for the replica's applier metadata repository is also required to make replication resilient to unexpected halts. See Section 16.3.2, “Handling an Unexpected Halt of a Replica” for more information.

  This variable must be set to `TABLE` before configuring multiple replication channels. If you are using multiple replication channels then you cannot set the value back to `FILE`.

  The setting for the location of the applier metadata repository has a direct influence on the effect had by the setting of the `sync_relay_log_info` system variable. You can change the setting only when no replication threads are executing.

* `relay_log_purge`

  <table frame="box" rules="all" summary="Properties for master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>8

  Disables or enables automatic purging of relay log files as soon as they are not needed any more. The default value is 1 (`ON`).

* `relay_log_recovery`

  <table frame="box" rules="all" summary="Properties for master-retry-count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--master-retry-count=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>86400</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr></tbody></table>9

  If enabled, this variable enables automatic relay log recovery immediately following server startup. The recovery process creates a new relay log file, initializes the SQL thread position to this new relay log, and initializes the I/O thread to the SQL thread position. Reading of the relay log from the source then continues.

  This global variable is read-only at runtime. Its value can be set with the `--relay-log-recovery` option at replica server startup, which should be used following an unexpected halt of a replica to ensure that no possibly corrupted relay logs are processed, and must be used in order to guarantee a crash-safe replica. The default value is 0 (disabled). For information on the combination of settings on a replica that is most resilient to unexpected halts, see Section 16.3.2, “Handling an Unexpected Halt of a Replica”.

  This variable also interacts with the `relay_log_purge` variable, which controls purging of logs when they are no longer needed. Enabling `relay_log_recovery` when `relay_log_purge` is disabled risks reading the relay log from files that were not purged, leading to data inconsistency.

  For a multithreaded replica (where `slave_parallel_workers` is greater than 0), from MySQL 5.7.13, setting `relay_log_recovery = ON` automatically handles any inconsistencies and gaps in the sequence of transactions that have been executed from the relay log. These gaps can occur when file position based replication is in use. (For more details, see Section 16.4.1.32, “Replication and Transaction Inconsistencies”.) The relay log recovery process deals with gaps using the same method as the `START SLAVE UNTIL SQL_AFTER_MTS_GAPS` statement would. When the replica reaches a consistent gap-free state, the relay log recovery process goes on to fetch further transactions from the source beginning at the replication SQL thread position. In MySQL versions prior to MySQL 5.7.13, this process was not automatic and required starting the server with `relay_log_recovery=0`, starting the replica with `START SLAVE UNTIL SQL_AFTER_MTS_GAPS` to fix any transaction inconsistencies, and then restarting the replica with `relay_log_recovery=1`. When GTID-based replication is in use, from MySQL 5.7.28 a multithreaded replica checks first whether `MASTER_AUTO_POSITION` is set to `ON`, and if it is, omits the step of calculating the transactions that should be skipped or not skipped, so that the old relay logs are not required for the recovery process.

  Note

  This variable does not affect the following Group Replication channels:

  + `group_replication_applier`
  + `group_replication_recovery`

  Any other channels running on a group are affected, such as a channel which is replicating from an outside source or another group.

* `relay_log_space_limit`

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>0

  The maximum amount of space to use for all relay logs.

* `replication_optimize_for_static_plugin_config`

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>1

  Use shared locks, and avoid unnecessary lock acquisitions, to improve performance for semisynchronous replication. While this system variable is enabled, the semisynchronous replication plugin cannot be uninstalled, so you must disable the system variable before the uninstall can complete.

  This system variable can be enabled before or after installing the semisynchronous replication plugin, and can be enabled while replication is running. Semisynchronous replication source servers can also get performance benefits from enabling this system variable, because they use the same locking mechanisms as the replicas.

  `replication_optimize_for_static_plugin_config` can be enabled when Group Replication is in use on a server. In that scenario, it might benefit performance when there is contention for locks due to high workloads.

* `replication_sender_observe_commit_only`

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>2

  Limit callbacks to improve performance for semisynchronous replication. This system variable can be enabled before or after installing the semisynchronous replication plugin, and can be enabled while replication is running. Semisynchronous replication source servers can also get performance benefits from enabling this system variable, because they use the same locking mechanisms as the replicas.

* `report_host`

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>3

  The host name or IP address of the replica to be reported to the source during replica registration. This value appears in the output of `SHOW SLAVE HOSTS` on the source server. Leave the value unset if you do not want the replica to register itself with the source.

  Note

  It is not sufficient for the source to simply read the IP address of the replica from the TCP/IP socket after the replica connects. Due to NAT and other routing issues, that IP may not be valid for connecting to the replica from the source or other hosts.

* `report_password`

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>4

  The replication user account password of the replica to be reported to the source during replica registration. This value appears in the output of `SHOW SLAVE HOSTS` on the source server if the source was started with `--show-slave-auth-info`.

  Although the name of this variable might imply otherwise, `report_password` is not connected to the MySQL user privilege system and so is not necessarily (or even likely to be) the same as the password for the MySQL replication user account.

* `report_port`

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>5

  The TCP/IP port number for connecting to the replica, to be reported to the source during replica registration. Set this only if the replica is listening on a nondefault port or if you have a special tunnel from the source or other clients to the replica. If you are not sure, do not use this option.

  The default value for this option is the port number actually used by the replica. This is also the default value displayed by `SHOW SLAVE HOSTS`.

* `report_user`

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>6

  The account user name of the replica to be reported to the source during replica registration. This value appears in the output of `SHOW SLAVE HOSTS` on the source server if the source was started with `--show-slave-auth-info`.

  Although the name of this variable might imply otherwise, `report_user` is not connected to the MySQL user privilege system and so is not necessarily (or even likely to be) the same as the name of the MySQL replication user account.

* `rpl_semi_sync_slave_enabled`

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>7

  Controls whether semisynchronous replication is enabled on the replica. To enable or disable the plugin, set this variable to `ON` or `OFF` (or 1 or 0), respectively. The default is `OFF`.

  This variable is available only if the replica-side semisynchronous replication plugin is installed.

* `rpl_semi_sync_slave_trace_level`

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>8

  The semisynchronous replication debug trace level on the replica. See `rpl_semi_sync_master_trace_level` for the permissible values.

  This variable is available only if the replica-side semisynchronous replication plugin is installed.

* `rpl_stop_slave_timeout`

  <table frame="box" rules="all" summary="Properties for max_relay_log_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-relay-log-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>max_relay_log_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1073741824</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>9

  You can control the length of time (in seconds) that `STOP SLAVE` waits before timing out by setting this variable. This can be used to avoid deadlocks between `STOP SLAVE` and other SQL statements using different client connections to the replica.

  The maximum and default value of `rpl_stop_slave_timeout` is 31536000 seconds (1 year). The minimum is 2 seconds. Changes to this variable take effect for subsequent `STOP SLAVE` statements.

  This variable affects only the client that issues a `STOP SLAVE` statement. When the timeout is reached, the issuing client returns an error message stating that the command execution is incomplete. The client then stops waiting for the replication threads to stop, but the replication threads continue to try to stop, and the `STOP SLAVE` instruction remains in effect. Once the replication threads are no longer busy, the `STOP SLAVE` statement is executed and the replica stops.

* `slave_checkpoint_group`

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>0

  Sets the maximum number of transactions that can be processed by a multithreaded replica before a checkpoint operation is called to update its status as shown by `SHOW SLAVE STATUS`. Setting this variable has no effect on replicas for which multithreading is not enabled. Setting this variable has no immediate effect. The state of the variable applies on all subsequent `START SLAVE` commands.

  Note

  Multithreaded replicas are not currently supported by NDB Cluster, which silently ignores the setting for this variable. See Section 21.7.3, “Known Issues in NDB Cluster Replication”, for more information.

  This variable works in combination with the `slave_checkpoint_period` system variable in such a way that, when either limit is exceeded, the checkpoint is executed and the counters tracking both the number of transactions and the time elapsed since the last checkpoint are reset.

  The minimum allowed value for this variable is 32, unless the server was built using `-DWITH_DEBUG`, in which case the minimum value is 1. The effective value is always a multiple of 8; you can set it to a value that is not such a multiple, but the server rounds it down to the next lower multiple of 8 before storing the value. (*Exception*: No such rounding is performed by the debug server.) Regardless of how the server was built, the default value is 512, and the maximum allowed value is 524280.

* `slave_checkpoint_period`

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>1

  Sets the maximum time (in milliseconds) that is allowed to pass before a checkpoint operation is called to update the status of a multithreaded replica as shown by `SHOW SLAVE STATUS`. Setting this variable has no effect on replicas for which multithreading is not enabled. Setting this variable takes effect for all replication channels immediately, including running channels.

  Note

  Multithreaded replicas are not currently supported by NDB Cluster, which silently ignores the setting for this variable. See Section 21.7.3, “Known Issues in NDB Cluster Replication”, for more information.

  This variable works in combination with the `slave_checkpoint_group` system variable in such a way that, when either limit is exceeded, the checkpoint is executed and the counters tracking both the number of transactions and the time elapsed since the last checkpoint are reset.

  The minimum allowed value for this variable is 1, unless the server was built using `-DWITH_DEBUG`, in which case the minimum value is 0. Regardless of how the server was built, the default value is 300 milliseconds, and the maximum possible value is 4294967295 milliseconds (approximately 49.7 days).

* `slave_compressed_protocol`

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>2

  Whether to use compression of the source/replica protocol if both source and replica support it. If this variable is disabled (the default), connections are uncompressed. Changes to this variable take effect on subsequent connection attempts; this includes after issuing a `START SLAVE` statement, as well as reconnections made by a running replication I/O thread (for example, after setting the `MASTER_RETRY_COUNT` option for the `CHANGE MASTER TO` statement). See also Section 4.2.6, “Connection Compression Control”.

* `slave_exec_mode`

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>3

  Controls how a replication thread resolves conflicts and errors during replication. `IDEMPOTENT` mode causes suppression of duplicate-key and no-key-found errors; `STRICT` means no such suppression takes place.

  `IDEMPOTENT` mode is intended for use in multi-source replication, circular replication, and some other special replication scenarios for NDB Cluster Replication. (See Section 21.7.10, “NDB Cluster Replication: Bidirectional and Circular Replication”, and Section 21.7.11, “NDB Cluster Replication Conflict Resolution”, for more information.) NDB Cluster ignores any value explicitly set for `slave_exec_mode`, and always treats it as `IDEMPOTENT`.

  In MySQL Server 5.7, `STRICT` mode is the default value.

  For storage engines other than `NDB`, *`IDEMPOTENT` mode should be used only when you are absolutely sure that duplicate-key errors and key-not-found errors can safely be ignored*. It is meant to be used in fail-over scenarios for NDB Cluster where multi-source replication or circular replication is employed, and is not recommended for use in other cases.

* `slave_load_tmpdir`

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>4

  The name of the directory where the replica creates temporary files. Setting this variable takes effect for all replication channels immediately, including running channels. The variable value is by default equal to the value of the `tmpdir` system variable, or the default that applies when that system variable is not specified.

  When the replication SQL thread replicates a `LOAD DATA` statement, it extracts the file to be loaded from the relay log into temporary files, and then loads these into the table. If the file loaded on the source is huge, the temporary files on the replica are huge, too. Therefore, it might be advisable to use this option to tell the replica to put temporary files in a directory located in some file system that has a lot of available space. In that case, the relay logs are huge as well, so you might also want to set the `relay_log` system variable to place the relay logs in that file system.

  The directory specified by this option should be located in a disk-based file system (not a memory-based file system) so that the temporary files used to replicate `LOAD DATA` statements can survive machine restarts. The directory also should not be one that is cleared by the operating system during the system startup process. However, replication can now continue after a restart if the temporary files have been removed.

* `slave_max_allowed_packet`

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>5

  This variable sets the maximum packet size for the replication SQL and I/O threads, so that large updates using row-based replication do not cause replication to fail because an update exceeded `max_allowed_packet`. Setting this variable takes effect for all replication channels immediately, including running channels.

  This global variable always has a value that is a positive integer multiple of 1024; if you set it to some value that is not, the value is rounded down to the next highest multiple of 1024 for it is stored or used; setting `slave_max_allowed_packet` to 0 causes 1024 to be used. (A truncation warning is issued in all such cases.) The default and maximum value is 1073741824 (1 GB); the minimum is 1024.

* `slave_net_timeout`

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>6

  The number of seconds to wait for more data or a heartbeat signal from the source before the replica considers the connection broken, aborts the read, and tries to reconnect. Setting this variable has no immediate effect. The state of the variable applies on all subsequent `START SLAVE` commands.

  The first retry occurs immediately after the timeout. The interval between retries is controlled by the `MASTER_CONNECT_RETRY` option for the `CHANGE MASTER TO` statement, and the number of reconnection attempts is limited by the `MASTER_RETRY_COUNT` option for the `CHANGE MASTER TO` statement.

  The heartbeat interval, which stops the connection timeout occurring in the absence of data if the connection is still good, is controlled by the `MASTER_HEARTBEAT_PERIOD` option for the `CHANGE MASTER TO` statement. The heartbeat interval defaults to half the value of `slave_net_timeout`, and it is recorded in the replica's connection metadata repository and shown in the `replication_connection_configuration` Performance Schema table. Note that a change to the value or default setting of `slave_net_timeout` does not automatically change the heartbeat interval, whether that has been set explicitly or is using a previously calculated default. If the connection timeout is changed, you must also issue `CHANGE MASTER TO` to adjust the heartbeat interval to an appropriate value so that it occurs before the connection timeout.

* `slave_parallel_type`

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>7

  When using a multithreaded replica (`slave_parallel_workers` is greater than 0), this variable specifies the policy used to decide which transactions are allowed to execute in parallel on the replica. The variable has no effect on replicas for which multithreading is not enabled. The possible values are:

  + `LOGICAL_CLOCK`: Transactions that are part of the same binary log group commit on a source are applied in parallel on a replica. The dependencies between transactions are tracked based on their timestamps to provide additional parallelization where possible. When this value is set, the `binlog_transaction_dependency_tracking` system variable can be used on the source to specify that write sets are used for parallelization in place of timestamps, if a write set is available for the transaction and gives improved results compared to timestamps.

  + `DATABASE`: Transactions that update different databases are applied in parallel. This value is only appropriate if data is partitioned into multiple databases which are being updated independently and concurrently on the source. There must be no cross-database constraints, as such constraints may be violated on the replica.

  When `slave_preserve_commit_order` is `1`, `slave_parallel_type` must be `LOGICAL_CLOCK`.

  All replication applier threads must be stopped prior to setting `slave_parallel_type`.

  When your replication topology uses multiple levels of replicas, `LOGICAL_CLOCK` may achieve less parallelization for each level the replica is away from the source. You can reduce this effect by using `binlog_transaction_dependency_tracking` on the source to specify that write sets are used instead of timestamps for parallelization where possible.

* `slave_parallel_workers`

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>8

  Sets the number of applier threads for executing replication transactions in parallel. Setting this variable to a number greater than 0 creates a multithreaded replica with this number of applier threads. When set to 0 (the default) parallel execution is disabled and the replica uses a single applier thread. Setting `slave_parallel_workers` has no immediate effect. The state of the variable applies on all subsequent `START SLAVE` statements.

  Note

  Multithreaded replicas are not currently supported by NDB Cluster, which silently ignores the setting for this variable. See Section 21.7.3, “Known Issues in NDB Cluster Replication”, for more information.

  A multithreaded replica provides parallel execution by using a coordinator thread and the number of applier threads configured by this variable. The way which transactions are distributed among applier threads is configured by `slave_parallel_type`. The transactions that the replica applies in parallel may commit out of order, unless `slave_preserve_commit_order=1`. Therefore, checking for the most recently executed transaction does not guarantee that all previous transactions from the source have been executed on the replica. This has implications for logging and recovery when using a multithreaded replica. For example, on a multithreaded replica the `START SLAVE UNTIL` statement only supports using `SQL_AFTER_MTS_GAPS`.

  In MySQL 5.7, retrying of transactions is supported when multithreading is enabled on a replica. In previous versions, `slave_transaction_retries` was treated as equal to 0 when using multithreaded replicas.

  Multithreaded replicas are not currently supported by NDB Cluster. See Section 21.7.3, “Known Issues in NDB Cluster Replication”, for more information about how `NDB` handles settings for this variable.

* `slave_pending_jobs_size_max`

  <table frame="box" rules="all" summary="Properties for relay_log_purge"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-purge[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_purge</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>9

  For multithreaded replicas, this variable sets the maximum amount of memory (in bytes) available to worker queues holding events not yet applied. Setting this variable has no effect on replicas for which multithreading is not enabled. Setting this variable has no immediate effect. The state of the variable applies on all subsequent `START SLAVE` commands.

  The minimum possible value for this variable is 1024; the default is 16MB. The maximum possible value is 18446744073709551615 (16 exabytes). Values that are not exact multiples of 1024 are rounded down to the next-highest multiple of 1024 prior to being stored.

  The value of this variable is a soft limit and can be set to match the normal workload. If an unusually large event exceeds this size, the transaction is held until all the worker threads have empty queues, and then processed. All subsequent transactions are held until the large transaction has been completed.

* `slave_preserve_commit_order`

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>0

  For multithreaded replicas, the setting 1 for this variable ensures that transactions are externalized on the replica in the same order as they appear in the replica's relay log, and prevents gaps in the sequence of transactions that have been executed from the relay log. This variable has no effect on replicas for which multithreading is not enabled. Note that `slave_preserve_commit_order=1` does not preserve the order of non-transactional DML updates, so these might commit before transactions that precede them in the relay log, which might result in gaps.

  `slave_preserve_commit_order=1` requires that `--log-bin` and `--log-slave-updates` are enabled on the replica, and `slave_parallel_type` is set to `LOGICAL_CLOCK`. Before changing this variable, all replication applier threads (for all replication channels if you are using multiple replication channels) must be stopped.

  With `slave_preserve_commit_order` enabled, the executing thread waits until all previous transactions are committed before committing. While the thread is waiting for other workers to commit their transactions it reports its status as `Waiting for preceding transaction to commit`. (Prior to MySQL 5.7.8, this was shown as `Waiting for its turn to commit`.) Enabling this mode on a multithreaded replica ensures that it never enters a state that the source was not in. This supports the use of replication for read scale-out. See Section 16.3.4, “Using Replication for Scale-Out”.

  If `slave_preserve_commit_order` is `0`, the transactions that the replica applies in parallel may commit out of order. Therefore, checking for the most recently executed transaction does not guarantee that all previous transactions from the source have been executed on the replica. There is a chance of gaps in the sequence of transactions that have been executed from the replica's relay log. This has implications for logging and recovery when using a multithreaded replica. Note that the setting `slave_preserve_commit_order=1` prevents gaps, but does not prevent source binary log position lag (where `Exec_master_log_pos` is behind the position up to which transactions have been executed). See Section 16.4.1.32, “Replication and Transaction Inconsistencies” for more information.

* `slave_rows_search_algorithms`

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>1

  When preparing batches of rows for row-based logging and replication, this variable controls how the rows are searched for matches, in particular whether hash scans are used. Setting this variable takes effect for all replication channels immediately, including running channels.

  Specify a comma-separated list of the following combinations of 2 values from the list `INDEX_SCAN`, `TABLE_SCAN`, `HASH_SCAN`. The value is expected as a string, so if set at runtime rather than at server startup, the value must be quoted. In addition, the value must not contain any spaces. The recommended combinations (lists) and their effects are shown in the following table:

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>2

  + The default value is `INDEX_SCAN,TABLE_SCAN`, which means that all searches that can use indexes do use them, and searches without any indexes use table scans.

  + To use hashing for any searches that do not use a primary or unique key, set `INDEX_SCAN,HASH_SCAN`. Specifying `INDEX_SCAN,HASH_SCAN` has the same effect as specifying `INDEX_SCAN,TABLE_SCAN,HASH_SCAN`, which is allowed.

  + Do not use the combination `TABLE_SCAN,HASH_SCAN`. This setting forces hashing for all searches. It has no advantage over `INDEX_SCAN,HASH_SCAN`, and it can lead to “record not found” errors or duplicate key errors in the case of a single event containing multiple updates to the same row, or updates that are order-dependent.

  The order in which the algorithms are specified in the list makes no difference to the order in which they are displayed by a `SELECT` or `SHOW VARIABLES` statement.

  It is possible to specify a single value, but this is not optimal, because setting a single value limits searches to using only that algorithm. In particular, setting `INDEX_SCAN` alone is not recommended, as in that case searches are unable to find rows at all if no index is present.

* `slave_skip_errors`

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>3

  Normally, replication stops when an error occurs on the replica, which gives you the opportunity to resolve the inconsistency in the data manually. This variable causes the replication SQL thread to continue replication when a statement returns any of the errors listed in the variable value.

* `slave_sql_verify_checksum`

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>4

  Cause the replication SQL thread to verify data using the checksums read from the relay log. In the event of a mismatch, the replica stops with an error. Setting this variable takes effect for all replication channels immediately, including running channels.

  Note

  The replication I/O thread always reads checksums if possible when accepting events from over the network.

* `slave_transaction_retries`

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>5

  If a replication SQL thread fails to execute a transaction because of an `InnoDB` deadlock or because the transaction's execution time exceeded `InnoDB`'s `innodb_lock_wait_timeout` or `NDB`'s `TransactionDeadlockDetectionTimeout` or `TransactionInactiveTimeout`, it automatically retries `slave_transaction_retries` times before stopping with an error. Transactions with a non-temporary error are not retried.

  The default value for `slave_transaction_retries` is 10. Setting the variable to 0 disables automatic retrying of transactions. Setting the variable takes effect for all replication channels immediately, including running channels.

  As of MySQL 5.7.5, retrying of transactions is supported when multithreading is enabled on a replica. In previous versions, `slave_transaction_retries` was treated as equal to 0 when using multithreaded replicas.

  The Performance Schema table `replication_applier_status` shows the number of retries that took place on each replication channel, in the `COUNT_TRANSACTIONS_RETRIES` column.

* `slave_type_conversions`

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>6

  Controls the type conversion mode in effect on the replica when using row-based replication. In MySQL 5.7.2 and higher, its value is a comma-delimited set of zero or more elements from the list: `ALL_LOSSY`, `ALL_NON_LOSSY`, `ALL_SIGNED`, `ALL_UNSIGNED`. Set this variable to an empty string to disallow type conversions between the source and the replica. Setting this variable takes effect for all replication channels immediately, including running channels.

  `ALL_SIGNED` and `ALL_UNSIGNED` were added in MySQL 5.7.2 (Bug#15831300). For additional information on type conversion modes applicable to attribute promotion and demotion in row-based replication, see Row-based replication: attribute promotion and demotion.

* `sql_slave_skip_counter`

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>7

  The number of events from the source that a replica should skip. Setting the option has no immediate effect. The variable applies to the next `START SLAVE` statement; the next `START SLAVE` statement also changes the value back to 0. When this variable is set to a nonzero value and there are multiple replication channels configured, the `START SLAVE` statement can only be used with the `FOR CHANNEL channel` clause.

  This option is incompatible with GTID-based replication, and must not be set to a nonzero value when `gtid_mode=ON`. If you need to skip transactions when employing GTIDs, use `gtid_executed` from the source instead. See Section 16.1.7.3, “Skipping Transactions”.

  Important

  If skipping the number of events specified by setting this variable would cause the replica to begin in the middle of an event group, the replica continues to skip until it finds the beginning of the next event group and begins from that point. For more information, see Section 16.1.7.3, “Skipping Transactions”.

* `sync_master_info`

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>8

  The effects of this variable on a replica depend on whether the replica's `master_info_repository` is set to `FILE` or `TABLE`, as explained in the following paragraphs.

  **master\_info\_repository = FILE.** If the value of `sync_master_info` is greater than 0, the replica synchronizes its `master.info` file to disk (using `fdatasync()`) after every `sync_master_info` events. If it is 0, the MySQL server performs no synchronization of the `master.info` file to disk; instead, the server relies on the operating system to flush its contents periodically as with any other file.

  **master\_info\_repository = TABLE.** If the value of `sync_master_info` is greater than 0, the replica updates its connection metadata repository table after every `sync_master_info` events. If it is 0, the table is never updated.

  The default value for `sync_master_info` is

  10000. Setting this variable takes effect for all replication channels immediately, including running channels.

* `sync_relay_log`

  <table frame="box" rules="all" summary="Properties for relay_log_space_limit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--relay-log-space-limit=#</code></td> </tr><tr><th>System Variable</th> <td><code>relay_log_space_limit</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>9

  If the value of this variable is greater than 0, the MySQL server synchronizes its relay log to disk (using `fdatasync()`) after every `sync_relay_log` events are written to the relay log. Setting this variable takes effect for all replication channels immediately, including running channels.

  Setting `sync_relay_log` to 0 causes no synchronization to be done to disk; in this case, the server relies on the operating system to flush the relay log's contents from time to time as for any other file.

  A value of 1 is the safest choice because in the event of an unexpected halt you lose at most one event from the relay log. However, it is also the slowest choice (unless the disk has a battery-backed cache, which makes synchronization very fast). For information on the combination of settings on a replica that is most resilient to unexpected halts, see Section 16.3.2, “Handling an Unexpected Halt of a Replica”.

* `sync_relay_log_info`

  <table frame="box" rules="all" summary="Properties for replicate-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--replicate-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

  The default value for `sync_relay_log_info` is 10000. Setting this variable takes effect for all replication channels immediately, including running channels.

  The effects of this variable on the replica depend on the server's `relay_log_info_repository` setting (`FILE` or `TABLE`). If the setting is `TABLE`, the effects of the variable also depend on whether the storage engine used by the relay log info table is transactional (such as `InnoDB`) or not transactional (`MyISAM`). The effects of these factors on the behavior of the server for `sync_relay_log_info` values of zero and greater than zero are as follows:

  `sync_relay_log_info = 0` :   + If `relay_log_info_repository` is set to `FILE`, the MySQL server performs no synchronization of the `relay-log.info` file to disk; instead, the server relies on the operating system to flush its contents periodically as with any other file.

      + If `relay_log_info_repository` is set to `TABLE`, and the storage engine for that table is transactional, the table is updated after each transaction. (The `sync_relay_log_info` setting is effectively ignored in this case.)

      + If `relay_log_info_repository` is set to `TABLE`, and the storage engine for that table is not transactional, the table is never updated.

  `sync_relay_log_info = N > 0` :   + If `relay_log_info_repository` is set to `FILE`, the replica synchronizes its `relay-log.info` file to disk (using `fdatasync()`) after every *`N`* transactions.

      + If `relay_log_info_repository` is set to `TABLE`, and the storage engine for that table is transactional, the table is updated after each transaction. (The `sync_relay_log_info` setting is effectively ignored in this case.)

      + If `relay_log_info_repository` is set to `TABLE`, and the storage engine for that table is not transactional, the table is updated after every *`N`* events.


#### 16.1.6.4 Binary Logging Options and Variables

* Startup Options Used with Binary Logging
* System Variables Used with Binary Logging

You can use the `mysqld` options and system variables that are described in this section to affect the operation of the binary log as well as to control which statements are written to the binary log. For additional information about the binary log, see Section 5.4.4, “The Binary Log”. For additional information about using MySQL server options and system variables, see Section 5.1.6, “Server Command Options”, and Section 5.1.7, “Server System Variables”.

##### Startup Options Used with Binary Logging

The following list describes startup options for enabling and configuring the binary log. System variables used with binary logging are discussed later in this section.

* `--binlog-row-event-max-size=N`

  <table frame="box" rules="all" summary="Properties for binlog-row-event-max-size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-row-event-max-size=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>8192</code></td> </tr><tr><th>Minimum Value</th> <td><code>256</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709551615</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr></tbody></table>

  Specify the maximum size of a row-based binary log event, in bytes. Rows are grouped into events smaller than this size if possible. The value should be a multiple of 256. The default is 8192. See Section 16.2.1, “Replication Formats”.

* `--log-bin[=base_name]`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  Enables binary logging. With binary logging enabled, the server logs all statements that change data to the binary log, which is used for backup and replication. The binary log is a sequence of files with a base name and numeric extension. For information on the format and management of the binary log, see Section 5.4.4, “The Binary Log”.

  If you supply a value for the `--log-bin` option, the value is used as the base name for the log sequence. The server creates binary log files in sequence by adding a numeric suffix to the base name. In MySQL 5.7, the base name defaults to `host_name-bin`, using the name of the host machine. It is recommended that you specify a base name, so that you can continue to use the same binary log file names regardless of changes to the default name.

  The default location for binary log files is the data directory. You can use the `--log-bin` option to specify an alternative location, by adding a leading absolute path name to the base name to specify a different directory. When the server reads an entry from the binary log index file, which tracks the binary log files that have been used, it checks whether the entry contains a relative path. If it does, the relative part of the path is replaced with the absolute path set using the `--log-bin` option. An absolute path recorded in the binary log index file remains unchanged; in such a case, the index file must be edited manually to enable a new path or paths to be used. (In older versions of MySQL, manual intervention was required whenever relocating the binary log or relay log files.) (Bug #11745230, Bug #12133)

  Setting this option causes the `log_bin` system variable to be set to `ON` (or `1`), and not to the base name. The binary log file base name and any specified path are available as the `log_bin_basename` system variable.

  If you specify the `--log-bin` option without also specifying the `server_id` system variable, the server is not allowed to start. (Bug #11763963, Bug #56739)

  When GTIDs are in use on the server, if binary logging is not enabled when restarting the server after an abnormal shutdown, some GTIDs are likely to be lost, causing replication to fail. In a normal shutdown, the set of GTIDs from the current binary log file is saved in the `mysql.gtid_executed` table. Following an abnormal shutdown where this did not happen, during recovery the GTIDs are added to the table from the binary log file, provided that binary logging is still enabled. If binary logging is disabled for the server restart, the server cannot access the binary log file to recover the GTIDs, so replication cannot be started. Binary logging can be disabled safely after a normal shutdown.

  If you want to disable binary logging for a server start but keep the `--log-bin` setting intact, you can specify the `--skip-log-bin` or `--disable-log-bin` option at startup. Specify the option after the `--log-bin` option, so that it takes precedence. When binary logging is disabled, the `log_bin` system variable is set to OFF.

* `--log-bin-index[=file_name]`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>log_bin_index</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  The name for the binary log index file, which contains the names of the binary log files. By default, it has the same location and base name as the value specified for the binary log files using the `--log-bin` option, plus the extension `.index`. If you do not specify `--log-bin`, the default binary log index file name is `binlog.index`. If you omit the file name and do not specify one with `--log-bin`, the default binary log index file name is `host_name-bin.index`, using the name of the host machine.

  For information on the format and management of the binary log, see Section 5.4.4, “The Binary Log”.

**Statement selection options.** The options in the following list affect which statements are written to the binary log, and thus sent by a replication source server to its replicas. There are also options for replica servers that control which statements received from the source should be executed or ignored. For details, see Section 16.1.6.3, “Replica Server Options and Variables”.

* `--binlog-do-db=db_name`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  This option affects binary logging in a manner similar to the way that `--replicate-do-db` affects replication.

  The effects of this option depend on whether the statement-based or row-based logging format is in use, in the same way that the effects of `--replicate-do-db` depend on whether statement-based or row-based replication is in use. You should keep in mind that the format used to log a given statement may not necessarily be the same as that indicated by the value of `binlog_format`. For example, DDL statements such as `CREATE TABLE` and `ALTER TABLE` are always logged as statements, without regard to the logging format in effect, so the following statement-based rules for `--binlog-do-db` always apply in determining whether or not the statement is logged.

  **Statement-based logging.** Only those statements are written to the binary log where the default database (that is, the one selected by `USE`) is *`db_name`*. To specify more than one database, use this option multiple times, once for each database; however, doing so does *not* cause cross-database statements such as `UPDATE some_db.some_table SET foo='bar'` to be logged while a different database (or no database) is selected.

  Warning

  To specify multiple databases you *must* use multiple instances of this option. Because database names can contain commas, the list is treated as the name of a single database if you supply a comma-separated list.

  An example of what does not work as you might expect when using statement-based logging: If the server is started with `--binlog-do-db=sales` and you issue the following statements, the `UPDATE` statement is *not* logged:

  ```sql
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

  The main reason for this “just check the default database” behavior is that it is difficult from the statement alone to know whether it should be replicated (for example, if you are using multiple-table `DELETE` statements or multiple-table `UPDATE` statements that act across multiple databases). It is also faster to check only the default database rather than all databases if there is no need.

  Another case which may not be self-evident occurs when a given database is replicated even though it was not specified when setting the option. If the server is started with `--binlog-do-db=sales`, the following `UPDATE` statement is logged even though `prices` was not included when setting `--binlog-do-db`:

  ```sql
  USE sales;
  UPDATE prices.discounts SET percentage = percentage + 10;
  ```

  Because `sales` is the default database when the `UPDATE` statement is issued, the `UPDATE` is logged.

  **Row-based logging.** Logging is restricted to database *`db_name`*. Only changes to tables belonging to *`db_name`* are logged; the default database has no effect on this. Suppose that the server is started with `--binlog-do-db=sales` and row-based logging is in effect, and then the following statements are executed:

  ```sql
  USE prices;
  UPDATE sales.february SET amount=amount+100;
  ```

  The changes to the `february` table in the `sales` database are logged in accordance with the `UPDATE` statement; this occurs whether or not the `USE` statement was issued. However, when using the row-based logging format and `--binlog-do-db=sales`, changes made by the following `UPDATE` are not logged:

  ```sql
  USE prices;
  UPDATE prices.march SET amount=amount-25;
  ```

  Even if the `USE prices` statement were changed to `USE sales`, the `UPDATE` statement's effects would still not be written to the binary log.

  Another important difference in `--binlog-do-db` handling for statement-based logging as opposed to the row-based logging occurs with regard to statements that refer to multiple databases. Suppose that the server is started with `--binlog-do-db=db1`, and the following statements are executed:

  ```sql
  USE db1;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

  If you are using statement-based logging, the updates to both tables are written to the binary log. However, when using the row-based format, only the changes to `table1` are logged; `table2` is in a different database, so it is not changed by the `UPDATE`. Now suppose that, instead of the `USE db1` statement, a `USE db4` statement had been used:

  ```sql
  USE db4;
  UPDATE db1.table1, db2.table2 SET db1.table1.col1 = 10, db2.table2.col2 = 20;
  ```

  In this case, the `UPDATE` statement is not written to the binary log when using statement-based logging. However, when using row-based logging, the change to `table1` is logged, but not that to `table2`—in other words, only changes to tables in the database named by `--binlog-do-db` are logged, and the choice of default database has no effect on this behavior.

* `--binlog-ignore-db=db_name`

  <table frame="box" rules="all" summary="Properties for binlog-ignore-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-ignore-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  This option affects binary logging in a manner similar to the way that `--replicate-ignore-db` affects replication.

  The effects of this option depend on whether the statement-based or row-based logging format is in use, in the same way that the effects of `--replicate-ignore-db` depend on whether statement-based or row-based replication is in use. You should keep in mind that the format used to log a given statement may not necessarily be the same as that indicated by the value of `binlog_format`. For example, DDL statements such as `CREATE TABLE` and `ALTER TABLE` are always logged as statements, without regard to the logging format in effect, so the following statement-based rules for `--binlog-ignore-db` always apply in determining whether or not the statement is logged.

  **Statement-based logging.** Tells the server to not log any statement where the default database (that is, the one selected by `USE`) is *`db_name`*.

  Prior to MySQL 5.7.2, this option caused any statements containing fully qualified table names not to be logged if there was no default database specified (that is, when `SELECT` `DATABASE()` returned `NULL`). In MySQL 5.7.2 and higher, when there is no default database, no `--binlog-ignore-db` options are applied, and such statements are always logged. (Bug #11829838, Bug #60188)

  **Row-based format.** Tells the server not to log updates to any tables in the database *`db_name`*. The current database has no effect.

  When using statement-based logging, the following example does not work as you might expect. Suppose that the server is started with `--binlog-ignore-db=sales` and you issue the following statements:

  ```sql
  USE prices;
  UPDATE sales.january SET amount=amount+1000;
  ```

  The `UPDATE` statement *is* logged in such a case because `--binlog-ignore-db` applies only to the default database (determined by the `USE` statement). Because the `sales` database was specified explicitly in the statement, the statement has not been filtered. However, when using row-based logging, the `UPDATE` statement's effects are *not* written to the binary log, which means that no changes to the `sales.january` table are logged; in this instance, `--binlog-ignore-db=sales` causes *all* changes made to tables in the source's copy of the `sales` database to be ignored for purposes of binary logging.

  To specify more than one database to ignore, use this option multiple times, once for each database. Because database names can contain commas, the list is treated as the name of a single database if you supply a comma-separated list.

  You should not use this option if you are using cross-database updates and you do not want these updates to be logged.

**Checksum options.** MySQL supports reading and writing of binary log checksums. These are enabled using the two options listed here:

* `--binlog-checksum={NONE|CRC32}`

  <table frame="box" rules="all" summary="Properties for binlog-checksum"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-checksum=type</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>CRC32</code></td> </tr><tr><th>Valid Values</th> <td><code>NONE</code><code>CRC32</code></td> </tr></tbody></table>

  Enabling this option causes the source to write checksums for events written to the binary log. Set to `NONE` to disable, or the name of the algorithm to be used for generating checksums; currently, only CRC32 checksums are supported, and CRC32 is the default. You cannot change the setting for this option within a transaction.

To control reading of checksums by the replica (from the relay log), use the `--slave-sql-verify-checksum` option.

**Testing and debugging options.** The following binary log options are used in replication testing and debugging. They are not intended for use in normal operations.

* `--max-binlog-dump-events=N`

  <table frame="box" rules="all" summary="Properties for max-binlog-dump-events"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--max-binlog-dump-events=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr></tbody></table>

  This option is used internally by the MySQL test suite for replication testing and debugging.

* `--sporadic-binlog-dump-fail`

  <table frame="box" rules="all" summary="Properties for sporadic-binlog-dump-fail"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--sporadic-binlog-dump-fail[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  This option is used internally by the MySQL test suite for replication testing and debugging.

##### System Variables Used with Binary Logging

The following list describes system variables for controlling binary logging. They can be set at server startup and some of them can be changed at runtime using `SET`. Server options used to control binary logging are listed earlier in this section.

* `binlog_cache_size`

  <table frame="box" rules="all" summary="Properties for binlog_cache_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-cache-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>binlog_cache_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>32768</code></td> </tr><tr><th>Minimum Value</th> <td><code>4096</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294963200</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>

  The size of the cache to hold changes to the binary log during a transaction.

  A binary log cache is allocated for each client if the server supports any transactional storage engines and if the server has the binary log enabled (`--log-bin` option). If you often use large transactions, you can increase this cache size to get better performance. The `Binlog_cache_use` and `Binlog_cache_disk_use` status variables can be useful for tuning the size of this variable. See Section 5.4.4, “The Binary Log”.

  `binlog_cache_size` sets the size for the transaction cache only; the size of the statement cache is governed by the `binlog_stmt_cache_size` system variable.

* `binlog_checksum`

  <table frame="box" rules="all" summary="Properties for binlog_checksum"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-checksum=type</code></td> </tr><tr><th>System Variable</th> <td><code>binlog_checksum</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>CRC32</code></td> </tr><tr><th>Valid Values</th> <td><code>NONE</code><code>CRC32</code></td> </tr></tbody></table>

  When enabled, this variable causes the source to write a checksum for each event in the binary log. `binlog_checksum` supports the values `NONE` (disabled) and `CRC32`. The default is `CRC32`. You cannot change the value of `binlog_checksum` within a transaction.

  When `binlog_checksum` is disabled (value `NONE`), the server verifies that it is writing only complete events to the binary log by writing and checking the event length (rather than a checksum) for each event.

  Changing the value of this variable causes the binary log to be rotated; checksums are always written to an entire binary log file, and never to only part of one.

  Setting this variable on the source to a value unrecognized by the replica causes the replica to set its own `binlog_checksum` value to `NONE`, and to stop replication with an error. (Bug #13553750, Bug #61096) If backward compatibility with older replicas is a concern, you may want to set the value explicitly to `NONE`.

* `binlog_direct_non_transactional_updates`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>0

  Due to concurrency issues, a replica can become inconsistent when a transaction contains updates to both transactional and nontransactional tables. MySQL tries to preserve causality among these statements by writing nontransactional statements to the transaction cache, which is flushed upon commit. However, problems arise when modifications done to nontransactional tables on behalf of a transaction become immediately visible to other connections because these changes may not be written immediately into the binary log.

  The `binlog_direct_non_transactional_updates` variable offers one possible workaround to this issue. By default, this variable is disabled. Enabling `binlog_direct_non_transactional_updates` causes updates to nontransactional tables to be written directly to the binary log, rather than to the transaction cache.

  *`binlog_direct_non_transactional_updates` works only for statements that are replicated using the statement-based binary logging format*; that is, it works only when the value of `binlog_format` is `STATEMENT`, or when `binlog_format` is `MIXED` and a given statement is being replicated using the statement-based format. This variable has no effect when the binary log format is `ROW`, or when `binlog_format` is set to `MIXED` and a given statement is replicated using the row-based format.

  Important

  Before enabling this variable, you must make certain that there are no dependencies between transactional and nontransactional tables; an example of such a dependency would be the statement `INSERT INTO myisam_table SELECT * FROM innodb_table`. Otherwise, such statements are likely to cause the replica to diverge from the source.

  This variable has no effect when the binary log format is `ROW` or `MIXED`.

* `binlog_error_action`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>1

  Controls what happens when the server encounters an error such as not being able to write to, flush or synchronize the binary log, which can cause the source's binary log to become inconsistent and replicas to lose synchronization.

  In MySQL 5.7.7 and higher, this variable defaults to `ABORT_SERVER`, which makes the server halt logging and shut down whenever it encounters such an error with the binary log. On restart, recovery proceeds as in the case of an unexpected server halt (see Section 16.3.2, “Handling an Unexpected Halt of a Replica”).

  When `binlog_error_action` is set to `IGNORE_ERROR`, if the server encounters such an error it continues the ongoing transaction, logs the error then halts logging, and continues performing updates. To resume binary logging `log_bin` must be enabled again, which requires a server restart. This setting provides backward compatibility with older versions of MySQL.

  In previous releases this variable was named `binlogging_impossible_mode`.

* `binlog_format`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>2

  This system variable sets the binary logging format, and can be any one of `STATEMENT`, `ROW`, or `MIXED`. See Section 16.2.1, “Replication Formats”. The setting takes effect when binary logging is enabled on the server, which is the case when the `log_bin` system variable is set to `ON`. In MySQL 5.7, binary logging is not enabled by default, and you enable it using the `--log-bin` option.

  `binlog_format` can be set at startup or at runtime, except that under some conditions, changing this variable at runtime is not possible or causes replication to fail, as described later.

  Prior to MySQL 5.7.7, the default format was `STATEMENT`. In MySQL 5.7.7 and higher, the default is `ROW`. *Exception*: In NDB Cluster, the default is `MIXED`; statement-based replication is not supported for NDB Cluster.

  Setting the session value of this system variable is a restricted operation. The session user must have privileges sufficient to set restricted session variables. See Section 5.1.8.1, “System Variable Privileges”.

  The rules governing when changes to this variable take effect and how long the effect lasts are the same as for other MySQL server system variables. For more information, see Section 13.7.4.1, “SET Syntax for Variable Assignment”.

  When `MIXED` is specified, statement-based replication is used, except for cases where only row-based replication is guaranteed to lead to proper results. For example, this happens when statements contain loadable functions or the `UUID()` function.

  For details of how stored programs (stored procedures and functions, triggers, and events) are handled when each binary logging format is set, see Section 23.7, “Stored Program Binary Logging”.

  There are exceptions when you cannot switch the replication format at runtime:

  + From within a stored function or a trigger.
  + If the session is currently in row-based replication mode and has open temporary tables.

  + From within a transaction.

  Trying to switch the format in those cases results in an error.

  Changing the logging format on a replication source server does not cause a replica to change its logging format to match. Switching the replication format while replication is ongoing can cause issues if a replica has binary logging enabled, and the change results in the replica using `STATEMENT` format logging while the source is using `ROW` or `MIXED` format logging. A replica is not able to convert binary log entries received in `ROW` logging format to `STATEMENT` format for use in its own binary log, so this situation can cause replication to fail. For more information, see Section 5.4.4.2, “Setting The Binary Log Format”.

  The binary log format affects the behavior of the following server options:

  + `--replicate-do-db`
  + `--replicate-ignore-db`
  + `--binlog-do-db`
  + `--binlog-ignore-db`

  These effects are discussed in detail in the descriptions of the individual options.

* `binlog_group_commit_sync_delay`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>3

  Controls how many microseconds the binary log commit waits before synchronizing the binary log file to disk. By default `binlog_group_commit_sync_delay` is set to 0, meaning that there is no delay. Setting `binlog_group_commit_sync_delay` to a microsecond delay enables more transactions to be synchronized together to disk at once, reducing the overall time to commit a group of transactions because the larger groups require fewer time units per group.

  When `sync_binlog=0` or `sync_binlog=1` is set, the delay specified by `binlog_group_commit_sync_delay` is applied for every binary log commit group before synchronization (or in the case of `sync_binlog=0`, before proceeding). When `sync_binlog` is set to a value *n* greater than 1, the delay is applied after every *n* binary log commit groups.

  Setting `binlog_group_commit_sync_delay` can increase the number of parallel committing transactions on any server that has (or might have after a failover) a replica, and therefore can increase parallel execution on the replicas. To benefit from this effect, the replica servers must have `slave_parallel_type=LOGICAL_CLOCK` set, and the effect is more significant when `binlog_transaction_dependency_tracking=COMMIT_ORDER` is also set. It is important to take into account both the source's throughput and the replicas' throughput when you are tuning the setting for `binlog_group_commit_sync_delay`.

  Setting `binlog_group_commit_sync_delay` can also reduce the number of `fsync()` calls to the binary log on any server (source or replica) that has a binary log.

  Note that setting `binlog_group_commit_sync_delay` increases the latency of transactions on the server, which might affect client applications. Also, on highly concurrent workloads, it is possible for the delay to increase contention and therefore reduce throughput. Typically, the benefits of setting a delay outweigh the drawbacks, but tuning should always be carried out to determine the optimal setting.

* `binlog_group_commit_sync_no_delay_count`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>4

  The maximum number of transactions to wait for before aborting the current delay as specified by `binlog_group_commit_sync_delay`. If `binlog_group_commit_sync_delay` is set to 0, then this option has no effect.

* `binlog_max_flush_queue_time`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>5

  Formerly, this controlled the time in microseconds to continue reading transactions from the flush queue before proceeding with group commit. In MySQL 5.7, this variable no longer has any effect.

  `binlog_max_flush_queue_time` is deprecated as of MySQL 5.7.9, and is marked for eventual removal in a future MySQL release.

* `binlog_order_commits`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>6

  When this variable is enabled on a replication source server (which is the default), transaction commit instructions issued to storage engines are serialized on a single thread, so that transactions are always committed in the same order as they are written to the binary log. Disabling this variable permits transaction commit instructions to be issued using multiple threads. Used in combination with binary log group commit, this prevents the commit rate of a single transaction being a bottleneck to throughput, and might therefore produce a performance improvement.

  Transactions are written to the binary log at the point when all the storage engines involved have confirmed that the transaction is prepared to commit. The binary log group commit logic then commits a group of transactions after their binary log write has taken place. When `binlog_order_commits` is disabled, because multiple threads are used for this process, transactions in a commit group might be committed in a different order from their order in the binary log. (Transactions from a single client always commit in chronological order.) In many cases this does not matter, as operations carried out in separate transactions should produce consistent results, and if that is not the case, a single transaction ought to be used instead.

  If you want to ensure that the transaction history on the source and on a multithreaded replica remains identical, set `slave_preserve_commit_order=1` on the replica.

* `binlog_row_image`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>7

  For MySQL row-based replication, this variable determines how row images are written to the binary log.

  In MySQL row-based replication, each row change event contains two images, a “before” image whose columns are matched against when searching for the row to be updated, and an “after” image containing the changes. Normally, MySQL logs full rows (that is, all columns) for both the before and after images. However, it is not strictly necessary to include every column in both images, and we can often save disk, memory, and network usage by logging only those columns which are actually required.

  Note

  When deleting a row, only the before image is logged, since there are no changed values to propagate following the deletion. When inserting a row, only the after image is logged, since there is no existing row to be matched. Only when updating a row are both the before and after images required, and both written to the binary log.

  For the before image, it is necessary only that the minimum set of columns required to uniquely identify rows is logged. If the table containing the row has a primary key, then only the primary key column or columns are written to the binary log. Otherwise, if the table has a unique key all of whose columns are `NOT NULL`, then only the columns in the unique key need be logged. (If the table has neither a primary key nor a unique key without any `NULL` columns, then all columns must be used in the before image, and logged.) In the after image, it is necessary to log only the columns which have actually changed.

  You can cause the server to log full or minimal rows using the `binlog_row_image` system variable. This variable actually takes one of three possible values, as shown in the following list:

  + `full`: Log all columns in both the before image and the after image.

  + `minimal`: Log only those columns in the before image that are required to identify the row to be changed; log only those columns in the after image where a value was specified by the SQL statement, or generated by auto-increment.

  + `noblob`: Log all columns (same as `full`), except for `BLOB` and `TEXT` columns that are not required to identify rows, or that have not changed.

  Note

  This variable is not supported by NDB Cluster; setting it has no effect on the logging of `NDB` tables.

  The default value is `full`.

  When using `minimal` or `noblob`, deletes and updates are guaranteed to work correctly for a given table if and only if the following conditions are true for both the source and destination tables:

  + All columns must be present and in the same order; each column must use the same data type as its counterpart in the other table.

  + The tables must have identical primary key definitions.

  (In other words, the tables must be identical with the possible exception of indexes that are not part of the tables' primary keys.)

  If these conditions are not met, it is possible that the primary key column values in the destination table may prove insufficient to provide a unique match for a delete or update. In this event, no warning or error is issued; the source and replica silently diverge, thus breaking consistency.

  Setting this variable has no effect when the binary logging format is `STATEMENT`. When `binlog_format` is `MIXED`, the setting for `binlog_row_image` is applied to changes that are logged using row-based format, but this setting has no effect on changes logged as statements.

  Setting `binlog_row_image` on either the global or session level does not cause an implicit commit; this means that this variable can be changed while a transaction is in progress without affecting the transaction.

* `binlog_rows_query_log_events`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>8

  This system variable affects row-based logging only. When enabled, it causes the server to write informational log events such as row query log events into its binary log. This information can be used for debugging and related purposes, such as obtaining the original query issued on the source when it cannot be reconstructed from the row updates.

  These informational events are normally ignored by MySQL programs reading the binary log and so cause no issues when replicating or restoring from backup. To view them, increase the verbosity level by using mysqlbinlog's `--verbose` option twice, either as `-vv` or `--verbose --verbose`.

* `binlog_stmt_cache_size`

  <table frame="box" rules="all" summary="Properties for log-bin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>9

  This variable determines the size of the cache for the binary log to hold nontransactional statements issued during a transaction.

  Separate binary log transaction and statement caches are allocated for each client if the server supports any transactional storage engines and if the server has the binary log enabled (`--log-bin` option). If you often use large nontransactional statements during transactions, you can increase this cache size to get better performance. The `Binlog_stmt_cache_use` and `Binlog_stmt_cache_disk_use` status variables can be useful for tuning the size of this variable. See Section 5.4.4, “The Binary Log”.

  The `binlog_cache_size` system variable sets the size for the transaction cache.

* `binlog_transaction_dependency_tracking`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>log_bin_index</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>0

  The source of dependency information that the source uses to determine which transactions can be executed in parallel by the replica's multithreaded applier. This variable can take one of the three values described in the following list:

  + `COMMIT_ORDER`: Dependency information is generated from the source's commit timestamps. This is the default.

  + `WRITESET`: Dependency information is generated from the source's write set, and any transactions which write different tuples can be parallelized.

  + `WRITESET_SESSION`: Dependency information is generated from the source's write set, and any transactions that write different tuples can be parallelized, with the exception that no two updates from the same session can be reordered.

  In `WRITESET` or `WRITESET_SESSION` mode, transactions can commit out of order unless you also set `slave_preserve_commit_order=1`.

  For some transactions, the `WRITESET` and `WRITESET_SESSION` modes cannot improve on the results that would have been returned in `COMMIT_ORDER` mode. This is the case for transactions that have empty or partial write sets, transactions that update tables without primary or unique keys, and transactions that update parent tables in a foreign key relationship. In these situations, the source uses `COMMIT_ORDER` mode to generate the dependency information instead.

  The value of this variable cannot be set to anything other than `COMMIT_ORDER` if `transaction_write_set_extraction` is `OFF`. You should also note that the value of `transaction_write_set_extraction` cannot be changed if the current value of `binlog_transaction_dependency_tracking` is `WRITESET` or `WRITESET_SESSION`. If you change the value, the new value does not take effect on replicas until after the replica has been stopped and restarted with `STOP SLAVE` and `START SLAVE` statements.

  The number of row hashes to be kept and checked for the latest transaction to have changed a given row is determined by the value of `binlog_transaction_dependency_history_size`.

* `binlog_transaction_dependency_history_size`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>log_bin_index</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>1

  Sets an upper limit on the number of row hashes which are kept in memory and used for looking up the transaction that last modified a given row. Once this number of hashes has been reached, the history is purged.

* `expire_logs_days`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>log_bin_index</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>2

  The number of days for automatic binary log file removal. The default is 0, which means “no automatic removal.” Possible removals happen at startup and when the binary log is flushed. Log flushing occurs as indicated in Section 5.4, “MySQL Server Logs”.

  To remove binary log files manually, use the `PURGE BINARY LOGS` statement. See Section 13.4.1.1, “PURGE BINARY LOGS Statement”.

* `log_bin`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>log_bin_index</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>3

  Whether the binary log is enabled. If the `--log-bin` option is used, then the value of this variable is `ON`; otherwise it is `OFF`. This variable reports only on the status of binary logging (enabled or disabled); it does not actually report the value to which `--log-bin` is set.

  See Section 5.4.4, “The Binary Log”.

* `log_bin_basename`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>log_bin_index</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>4

  Holds the base name and path for the binary log files, which can be set with the `--log-bin` server option. The maximum variable length is 256. In MySQL 5.7, the default base name is the name of the host machine with the suffix `-bin`. The default location is the data directory.

* `log_bin_index`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>log_bin_index</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>5

  Holds the base name and path for the binary log index file, which can be set with the `--log-bin-index` server option. The maximum variable length is 256.

* `log_bin_trust_function_creators`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>log_bin_index</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>6

  This variable applies when binary logging is enabled. It controls whether stored function creators can be trusted not to create stored functions that causes unsafe events to be written to the binary log. If set to 0 (the default), users are not permitted to create or alter stored functions unless they have the `SUPER` privilege in addition to the `CREATE ROUTINE` or `ALTER ROUTINE` privilege. A setting of 0 also enforces the restriction that a function must be declared with the `DETERMINISTIC` characteristic, or with the `READS SQL DATA` or `NO SQL` characteristic. If the variable is set to 1, MySQL does not enforce these restrictions on stored function creation. This variable also applies to trigger creation. See Section 23.7, “Stored Program Binary Logging”.

* `log_bin_use_v1_row_events`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>log_bin_index</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>7

  Whether Version 2 binary logging is in use. If this variable is 0 (disabled, the default), Version 2 binary log events are in use. If this variable is 1 (enabled), the server writes the binary log using Version 1 logging events (the only version of binary log events used in previous releases), and thus produces a binary log that can be read by older replicas.

  MySQL 5.7 uses Version 2 binary log row events by default. However, Version 2 events cannot be read by MySQL Server releases prior to MySQL 5.6.6. Enabling `log_bin_use_v1_row_events` causes `mysqld` to write the binary log using Version 1 logging events.

  This variable is read-only at runtime. To switch between Version 1 and Version 2 binary event binary logging, it is necessary to set `log_bin_use_v1_row_events` at server startup.

  Other than when performing upgrades of NDB Cluster Replication, `log_bin_use_v1_row_events` is chiefly of interest when setting up replication conflict detection and resolution using `NDB$EPOCH_TRANS()` as the conflict detection function, which requires Version 2 binary log row events. Thus, this variable and `--ndb-log-transaction-id` are not compatible.

  Note

  MySQL NDB Cluster 7.5 uses Version 2 binary log row events by default. You should keep this mind when planning upgrades or downgrades, and for setups using NDB Cluster Replication.

  For more information, see Section 21.7.11, “NDB Cluster Replication Conflict Resolution”.

* `log_builtin_as_identified_by_password`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>log_bin_index</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>8

  This variable affects binary logging of user-management statements. When enabled, the variable has the following effects:

  + Binary logging for `CREATE USER` statements involving built-in authentication plugins rewrites the statements to include an `IDENTIFIED BY PASSWORD` clause.

  + `SET PASSWORD` statements are logged as `SET PASSWORD` statements, rather than being rewritten to `ALTER USER` statements.

  + `SET PASSWORD` statements are changed to log the hash of the password instead of the supplied cleartext (unencrypted) password.

  Enabling this variable ensures better compatibility for cross-version replication with 5.6 and pre-5.7.6 replicas, and for applications that expect this syntax in the binary log.

* `log_slave_updates`

  <table frame="box" rules="all" summary="Properties for log-bin-index"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--log-bin-index=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>log_bin_index</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>9

  Whether updates received by a replica server from a source server should be logged to the replica's own binary log.

  Normally, a replica does not log to its own binary log any updates that are received from a source server. Enabling this variable causes the replica to write the updates performed by its replication SQL thread to its own binary log. For this option to have any effect, the replica must also be started with the `--log-bin` option to enable binary logging. See Section 16.1.6, “Replication and Binary Logging Options and Variables”.

  `log_slave_updates` is enabled when you want to chain replication servers. For example, you might want to set up replication servers using this arrangement:

  ```sql
  A -> B -> C
  ```

  Here, `A` serves as the source for the replica `B`, and `B` serves as the source for the replica `C`. For this to work, `B` must be both a source *and* a replica. You must start both `A` and `B` with `--log-bin` to enable binary logging, and `B` with `log_slave_updates` enabled so that updates received from `A` are logged by `B` to its binary log.

* `log_statements_unsafe_for_binlog`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>0

  If error 1592 is encountered, controls whether the generated warnings are added to the error log or not.

* `master_verify_checksum`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>1

  Enabling this variable causes the source to verify events read from the binary log by examining checksums, and to stop with an error in the event of a mismatch. `master_verify_checksum` is disabled by default; in this case, the source uses the event length from the binary log to verify events, so that only complete events are read from the binary log.

* `max_binlog_cache_size`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>2

  If a transaction requires more than this many bytes, the server generates a Multi-statement transaction required more than 'max\_binlog\_cache\_size' bytes of storage error. When `gtid_mode` is not `ON`, the maximum recommended value is 4GB, due to the fact that, in this case, MySQL cannot work with binary log positions greater than 4GB; when `gtid_mode` is `ON`, this limitation does not apply, and the server can work with binary log positions of arbitrary size.

  If, because `gtid_mode` is not `ON`, or for some other reason, you need to guarantee that the binary log does not exceed a given size *`maxsize`*, you should set this variable according to the formula shown here:

  ```sql
  max_binlog_cache_size <
    (((maxsize - max_binlog_size) / max_connections) - 1000) / 1.2
  ```

  This calculation takes into account the following conditions:

  + The server writes to the binary log as long as the size before it begins to write is less than `max_binlog_size`.

  + The server does not write single transactions, but rather groups of transactions. The maximum possible number of transactions in a group is equal to `max_connections`.

  + The server writes data that is not included in the cache. This includes a 4-byte checksum for each event; while this adds less than 20% to the transaction size, this amount is non-negible. In addition, the server writes a `Gtid_log_event` for each transaction; each of these events can add another 1 KB to what is written to the binary log.

  `max_binlog_cache_size` sets the size for the transaction cache only; the upper limit for the statement cache is governed by the `max_binlog_stmt_cache_size` system variable.

  The visibility to sessions of `max_binlog_cache_size` matches that of the `binlog_cache_size` system variable; in other words, changing its value affects only new sessions that are started after the value is changed.

* `max_binlog_size`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>3

  If a write to the binary log causes the current log file size to exceed the value of this variable, the server rotates the binary logs (closes the current file and opens the next one). The minimum value is 4096 bytes. The maximum and default value is 1GB.

  A transaction is written in one chunk to the binary log, so it is never split between several binary logs. Therefore, if you have big transactions, you might see binary log files larger than `max_binlog_size`.

  If `max_relay_log_size` is 0, the value of `max_binlog_size` applies to relay logs as well.

* `max_binlog_stmt_cache_size`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>4

  If nontransactional statements within a transaction require more than this many bytes of memory, the server generates an error. The minimum value is 4096. The maximum and default values are 4GB on 32-bit platforms and 16EB (exabytes) on 64-bit platforms.

  `max_binlog_stmt_cache_size` sets the size for the statement cache only; the upper limit for the transaction cache is governed exclusively by the `max_binlog_cache_size` system variable.

* `sql_log_bin`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>5

  This variable controls whether logging to the binary log is enabled for the current session (assuming that the binary log itself is enabled). The default value is `ON`. To disable or enable binary logging for the current session, set the session `sql_log_bin` variable to `OFF` or `ON`.

  Set this variable to `OFF` for a session to temporarily disable binary logging while making changes to the source you do not want replicated to the replica.

  Setting the session value of this system variable is a restricted operation. The session user must have privileges sufficient to set restricted session variables. See Section 5.1.8.1, “System Variable Privileges”.

  It is not possible to set the session value of `sql_log_bin` within a transaction or subquery.

  *Setting this variable to `OFF` prevents GTIDs from being assigned to transactions in the binary log*. If you are using GTIDs for replication, this means that even when binary logging is later enabled again, the GTIDs written into the log from this point do not account for any transactions that occurred in the meantime, so in effect those transactions are lost.

  The global `sql_log_bin` variable is read only and cannot be modified. The global scope is deprecated; expect it to be removed in a future MySQL release.

* `sync_binlog`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>6

  Controls how often the MySQL server synchronizes the binary log to disk.

  + `sync_binlog=0`: Disables synchronization of the binary log to disk by the MySQL server. Instead, the MySQL server relies on the operating system to flush the binary log to disk from time to time as it does for any other file. This setting provides the best performance, but in the event of a power failure or operating system crash, it is possible that the server has committed transactions that have not been synchronized to the binary log.

  + `sync_binlog=1`: Enables synchronization of the binary log to disk before transactions are committed. This is the safest setting but can have a negative impact on performance due to the increased number of disk writes. In the event of a power failure or operating system crash, transactions that are missing from the binary log are only in a prepared state. This permits the automatic recovery routine to roll back the transactions, which guarantees that no transaction is lost from the binary log.

  + `sync_binlog=N`, where *`N`* is a value other than 0 or 1: The binary log is synchronized to disk after `N` binary log commit groups have been collected. In the event of a power failure or operating system crash, it is possible that the server has committed transactions that have not been flushed to the binary log. This setting can have a negative impact on performance due to the increased number of disk writes. A higher value improves performance, but with an increased risk of data loss.

  For the greatest possible durability and consistency in a replication setup that uses `InnoDB` with transactions, use these settings:

  + `sync_binlog=1`.
  + `innodb_flush_log_at_trx_commit=1`.

  Caution

  Many operating systems and some disk hardware fool the flush-to-disk operation. They may tell `mysqld` that the flush has taken place, even though it has not. In this case, the durability of transactions is not guaranteed even with the recommended settings, and in the worst case, a power outage can corrupt `InnoDB` data. Using a battery-backed disk cache in the SCSI disk controller or in the disk itself speeds up file flushes, and makes the operation safer. You can also try to disable the caching of disk writes in hardware caches.

* `transaction_write_set_extraction`

  <table frame="box" rules="all" summary="Properties for binlog-do-db"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-do-db=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>7

  Defines the algorithm used to generate a hash identifying the writes associated with a transaction. If you are using Group Replication, the hash value is used for distributed conflict detection and handling. On 64-bit systems running Group Replication, we recommend setting this to `XXHASH64` in order to avoid unnecessary hash collisions which result in certification failures and the roll back of user transactions. See Section 17.3.1, “Group Replication Requirements”. `binlog_format` must be set to `ROW` to change the value of this variable. If you change the value, the new value does not take effect on replicas until after the replica has been stopped and restarted with `STOP SLAVE` and `START SLAVE` statements.

  Note

  When `WRITESET` or `WRITESET_SESSION` is set as the value for `binlog_transaction_dependency_tracking`, `transaction_write_set_extraction` must be set to specify an algorithm (not set to `OFF`). While the current value of `binlog_transaction_dependency_tracking` is `WRITESET` or `WRITESET_SESSION`, you cannot change the value of `transaction_write_set_extraction`.


#### 16.1.6.5 Global Transaction ID System Variables

The MySQL Server system variables described in this section are used to monitor and control Global Transaction Identifiers (GTIDs). For additional information, see Section 16.1.3, “Replication with Global Transaction Identifiers”.

* `binlog_gtid_simple_recovery`

  <table frame="box" rules="all" summary="Properties for binlog_gtid_simple_recovery"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--binlog-gtid-simple-recovery[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>binlog_gtid_simple_recovery</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  This variable controls how binary log files are iterated during the search for GTIDs when MySQL starts or restarts.

  When `binlog_gtid_simple_recovery=TRUE`, which is the default, the values of `gtid_executed` and `gtid_purged` are computed at startup based on the values of `Previous_gtids_log_event` in the most recent and oldest binary log files. For a description of the computation, see The `gtid_purged` System Variable. This setting accesses only two binary log files during server restart. If all binary logs on the server were generated using MySQL 5.7.8 or later and you are using MySQL 5.7.8 or later, `binlog_gtid_simple_recovery=TRUE` can always safely be used.

  With `binlog_gtid_simple_recovery=TRUE`, `gtid_executed` and `gtid_purged` might be initialized incorrectly in the following two situations:

  + The newest binary log was generated by MySQL 5.7.5 or earlier, and `gtid_mode` was `ON` for some binary logs but `OFF` for the newest binary log.

  + A `SET @@GLOBAL.gtid_purged` statement was issued on MySQL 5.7.7 or earlier, and the binary log that was active at the time of the `SET @@GLOBAL.gtid_purged` statement has not yet been purged.

  If an incorrect GTID set is computed in either situation, it remains incorrect even if the server is later restarted with `binlog_gtid_simple_recovery=FALSE`. If either of these situations applies on the server, set `binlog_gtid_simple_recovery=FALSE` before starting or restarting the server. To check for the second situation, if you are using MySQL 5.7.7 or earlier, after issuing a `SET @@GLOBAL.gtid_purged` statement note down the current binary log file name, which can be checked using `SHOW MASTER STATUS`. If the server is restarted before this file has been purged, then you should set `binlog_gtid_simple_recovery=FALSE`.

  When `binlog_gtid_simple_recovery=FALSE` is set, the method of computing `gtid_executed` and `gtid_purged` as described in The `gtid_purged` System Variable is changed to iterate the binary log files as follows:

  + Instead of using the value of `Previous_gtids_log_event` and GTID log events from the newest binary log file, the computation for `gtid_executed` iterates from the newest binary log file, and uses the value of `Previous_gtids_log_event` and any GTID log events from the first binary log file where it finds a `Previous_gtids_log_event` value. If the server's most recent binary log files do not have GTID log events, for example if `gtid_mode=ON` was used but the server was later changed to `gtid_mode=OFF`, this process can take a long time.

  + Instead of using the value of `Previous_gtids_log_event` from the oldest binary log file, the computation for `gtid_purged` iterates from the oldest binary log file, and uses the value of `Previous_gtids_log_event` from the first binary log file where it finds either a nonempty `Previous_gtids_log_event` value, or at least one GTID log event (indicating that the use of GTIDs starts at that point). If the server's older binary log files do not have GTID log events, for example if `gtid_mode=ON` was only set recently on the server, this process can take a long time.

  In MySQL version 5.7.5, this variable was added as `simplified_binlog_gtid_recovery` and in MySQL version 5.7.6 it was renamed to `binlog_gtid_simple_recovery`.

* `enforce_gtid_consistency`

  <table frame="box" rules="all" summary="Properties for enforce_gtid_consistency"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--enforce-gtid-consistency[=value]</code></td> </tr><tr><th>System Variable</th> <td><code>enforce_gtid_consistency</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr><tr><th>Valid Values</th> <td><code>OFF</code><code>ON</code><code>WARN</code></td> </tr></tbody></table>

  Depending on the value of this variable, the server enforces GTID consistency by allowing execution of only statements that can be safely logged using a GTID. You *must* set this variable to `ON` before enabling GTID based replication.

  The values that `enforce_gtid_consistency` can be configured to are:

  + `OFF`: all transactions are allowed to violate GTID consistency.

  + `ON`: no transaction is allowed to violate GTID consistency.

  + `WARN`: all transactions are allowed to violate GTID consistency, but a warning is generated in this case. `WARN` was added in MySQL 5.7.6.

  Only statements that can be logged using GTID safe statements can be logged when `enforce_gtid_consistency` is set to `ON`, so the operations listed here cannot be used with this option:

  + `CREATE TABLE ... SELECT` statements

  + `CREATE TEMPORARY TABLE` or `DROP TEMPORARY TABLE` statements inside transactions

  + Transactions or statements that update both transactional and nontransactional tables. There is an exception that nontransactional DML is allowed in the same transaction or in the same statement as transactional DML, if all *nontransactional* tables are temporary.

  `--enforce-gtid-consistency` only takes effect if binary logging takes place for a statement. If binary logging is disabled on the server, or if statements are not written to the binary log because they are removed by a filter, GTID consistency is not checked or enforced for the statements that are not logged.

  For more information, see Section 16.1.3.6, “Restrictions on Replication with GTIDs”.

  Prior to MySQL 5.7.6, the boolean `enforce_gtid_consistency` defaulted to `OFF`. To maintain compatibility with previous releases, in MySQL 5.7.6 the enumeration defaults to `OFF`, and setting `--enforce-gtid-consistency` without a value is interpreted as setting the value to `ON`. The variable also has multiple textual aliases for the values: `0=OFF=FALSE`, `1=ON=TRUE`,`2=WARN`. This differs from other enumeration types but maintains compatibility with the boolean type used in previous versions. These changes impact on what is returned by the variable. Using `SELECT @@ENFORCE_GTID_CONSISTENCY`, `SHOW VARIABLES LIKE 'ENFORCE_GTID_CONSISTENCY'`, and `SELECT * FROM INFORMATION_SCHEMA.VARIABLES WHERE 'VARIABLE_NAME' = 'ENFORCE_GTID_CONSISTENCY'`, all return the textual form, not the numeric form. This is an incompatible change, since `@@ENFORCE_GTID_CONSISTENCY` returns the numeric form for booleans but returns the textual form for `SHOW` and the Information Schema.

* `gtid_executed`

  <table frame="box" rules="all" summary="Properties for gtid_executed"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>gtid_executed</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Unit</th> <td>set of GTIDs</td> </tr></tbody></table>

  When used with global scope, this variable contains a representation of the set of all transactions executed on the server and GTIDs that have been set by a `SET` `gtid_purged` statement. This is the same as the value of the `Executed_Gtid_Set` column in the output of `SHOW MASTER STATUS` and `SHOW SLAVE STATUS`. The value of this variable is a GTID set, see GTID Sets for more information.

  When the server starts, `@@GLOBAL.gtid_executed` is initialized. See `binlog_gtid_simple_recovery` for more information on how binary logs are iterated to populate `gtid_executed`. GTIDs are then added to the set as transactions are executed, or if any `SET` `gtid_purged` statement is executed.

  The set of transactions that can be found in the binary logs at any given time is equal to `GTID_SUBTRACT(@@GLOBAL.gtid_executed, @@GLOBAL.gtid_purged)`; that is, to all transactions in the binary log that have not yet been purged.

  Issuing `RESET MASTER` causes the global value (but not the session value) of this variable to be reset to an empty string. GTIDs are not otherwise removed from this set other than when the set is cleared due to `RESET MASTER`.

  Prior to MySQL 5.7.7, this variable could also be used with session scope, where it contained a representation of the set of transactions that are written to the cache in the current session. The session scope was deprecated in MySQL 5.7.7.

* `gtid_executed_compression_period`

  <table frame="box" rules="all" summary="Properties for gtid_executed_compression_period"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--gtid-executed-compression-period=#</code></td> </tr><tr><th>System Variable</th> <td><code>gtid_executed_compression_period</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1000</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Compress the `mysql.gtid_executed` table each time this many transactions have been processed. When binary logging is enabled on the server, this compression method is not used, and instead the `mysql.gtid_executed` table is compressed on each binary log rotation. When binary logging is disabled on the server, the compression thread sleeps until the specified number of transactions have been executed, then wakes up to perform compression of the `mysql.gtid_executed` table. Setting the value of this system variable to 0 means that the thread never wakes up, so this explicit compression method is not used. Instead, compression occurs implicitly as required.

  See mysql.gtid\_executed Table Compression for more information.

  This variable was added in MySQL version 5.7.5 as `executed_gtids_compression_period` and renamed in MySQL version 5.7.6 to `gtid_executed_compression_period`.

* `gtid_mode`

  <table frame="box" rules="all" summary="Properties for gtid_mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--gtid-mode=MODE</code></td> </tr><tr><th>System Variable</th> <td><code>gtid_mode</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr><tr><th>Valid Values</th> <td><code>OFF</code><code>OFF_PERMISSIVE</code><code>ON_PERMISSIVE</code><code>ON</code></td> </tr></tbody></table>

  Controls whether GTID based logging is enabled and what type of transactions the logs can contain. Prior to MySQL 5.7.6, this variable was read-only and was set using `--gtid-mode` at server startup only. Prior to MySQL 5.7.5, starting the server with `--gtid-mode=ON` required that the server also be started with the `--log-bin` and `--log-slave-updates` options. As of MySQL 5.7.5, this is no longer a requirement. See mysql.gtid\_executed Table.

  MySQL 5.7.6 enables this variable to be set dynamically. You must have privileges sufficient to set global system variables. See Section 5.1.8.1, “System Variable Privileges”. `enforce_gtid_consistency` must be set to `ON` before you can set `gtid_mode=ON`. Before modifying this variable, see Section 16.1.4, “Changing Replication Modes on Online Servers”.

  Transactions logged in MySQL 5.7.6 and higher can be either anonymous or use GTIDs. Anonymous transactions rely on binary log file and position to identify specific transactions. GTID transactions have a unique identifier that is used to refer to transactions. The `OFF_PERMISSIVE` and `ON_PERMISSIVE` modes added in MySQL 5.7.6 permit a mix of these transaction types in the topology. The different modes are now:

  + `OFF`: Both new and replicated transactions must be anonymous.

  + `OFF_PERMISSIVE`: New transactions are anonymous. Replicated transactions can be either anonymous or GTID transactions.

  + `ON_PERMISSIVE`: New transactions are GTID transactions. Replicated transactions can be either anonymous or GTID transactions.

  + `ON`: Both new and replicated transactions must be GTID transactions.

  Changes from one value to another can only be one step at a time. For example, if `gtid_mode` is currently set to `OFF_PERMISSIVE`, it is possible to change to `OFF` or `ON_PERMISSIVE` but not to `ON`.

  In MySQL 5.7.6 and higher, the values of `gtid_purged` and `gtid_executed` are persistent regardless of the value of `gtid_mode`. Therefore even after changing the value of `gtid_mode`, these variables contain the correct values. In MySQL 5.7.5 and earlier, the values of `gtid_purged` and `gtid_executed` are not persistent while `gtid_mode=OFF`. Therefore, after changing `gtid_mode` to `OFF`, once all binary logs containing GTIDs are purged, the values of these variables are lost.

* `gtid_next`

  <table frame="box" rules="all" summary="Properties for gtid_next"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>gtid_next</code></td> </tr><tr><th>Scope</th> <td>Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>AUTOMATIC</code></td> </tr><tr><th>Valid Values</th> <td><code>AUTOMATIC</code><code>ANONYMOUS</code><code>&lt;UUID&gt;:&lt;NUMBER&gt;</code></td> </tr></tbody></table>

  This variable is used to specify whether and how the next GTID is obtained.

  Setting the session value of this system variable is a restricted operation. The session user must have privileges sufficient to set restricted session variables. See Section 5.1.8.1, “System Variable Privileges”.

  `gtid_next` can take any of the following values:

  + `AUTOMATIC`: Use the next automatically-generated global transaction ID.

  + `ANONYMOUS`: Transactions do not have global identifiers, and are identified by file and position only.

  + A global transaction ID in *`UUID`*:*`NUMBER`* format.

  Exactly which of the above options are valid depends on the setting of `gtid_mode`, see Section 16.1.4.1, “Replication Mode Concepts” for more information. Setting this variable has no effect if `gtid_mode` is `OFF`.

  After this variable has been set to *`UUID`*:*`NUMBER`*, and a transaction has been committed or rolled back, an explicit `SET GTID_NEXT` statement must again be issued before any other statement.

  In MySQL 5.7.5 and higher, `DROP TABLE` or `DROP TEMPORARY TABLE` fails with an explicit error when used on a combination of nontemporary tables with temporary tables, or of temporary tables using transactional storage engines with temporary tables using nontransactional storage engines. Prior to MySQL 5.7.5, when GTIDs were enabled but `gtid_next` was not `AUTOMATIC`, `DROP TABLE` did not work correctly when used with either of these combinations of tables. (Bug #17620053)

  In MySQL 5.7.1, you cannot execute any of the statements `CHANGE MASTER TO`, `START SLAVE`, `STOP SLAVE`, `REPAIR TABLE`, `OPTIMIZE TABLE`, `ANALYZE TABLE`, `CHECK TABLE`, `CREATE SERVER`, `ALTER SERVER`, `DROP SERVER`, `CACHE INDEX`, `LOAD INDEX INTO CACHE`, `FLUSH`, or `RESET` when `gtid_next` is set to any value other than `AUTOMATIC`; in such cases, the statement fails with an error. Such statements are *not* disallowed in MySQL 5.7.2 and later. (Bug #16062608, Bug #16715809, Bug #69045) (Bug #16062608)

* `gtid_owned`

  <table frame="box" rules="all" summary="Properties for gtid_owned"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>gtid_owned</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Unit</th> <td>set of GTIDs</td> </tr></tbody></table>

  This read-only variable is primarily for internal use. Its contents depend on its scope.

  + When used with global scope, `gtid_owned` holds a list of all the GTIDs that are currently in use on the server, with the IDs of the threads that own them. This variable is mainly useful for a multi-threaded replica to check whether a transaction is already being applied on another thread. An applier thread takes ownership of a transaction's GTID all the time it is processing the transaction, so `@@global.gtid_owned` shows the GTID and owner for the duration of processing. When a transaction has been committed (or rolled back), the applier thread releases ownership of the GTID.

  + When used with session scope, `gtid_owned` holds a single GTID that is currently in use by and owned by this session. This variable is mainly useful for testing and debugging the use of GTIDs when the client has explicitly assigned a GTID for the transaction by setting `gtid_next`. In this case, `@@session.gtid_owned` displays the GTID all the time the client is processing the transaction, until the transaction has been committed (or rolled back). When the client has finished processing the transaction, the variable is cleared. If `gtid_next=AUTOMATIC` is used for the session, `gtid_owned` is only populated briefly during the execution of the commit statement for the transaction, so it cannot be observed from the session concerned, although it is listed if `@@global.gtid_owned` is read at the right point. If you have a requirement to track the GTIDs that are handled by a client in a session, you can enable the session state tracker controlled by the `session_track_gtids` system variable.

* `gtid_purged`

  <table frame="box" rules="all" summary="Properties for gtid_purged"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>gtid_purged</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Unit</th> <td>set of GTIDs</td> </tr></tbody></table>

  The global value of the `gtid_purged` system variable (`@@GLOBAL.gtid_purged`) is a GTID set consisting of the GTIDs of all the transactions that have been committed on the server, but do not exist in any binary log file on the server. `gtid_purged` is a subset of `gtid_executed`. The following categories of GTIDs are in `gtid_purged`:

  + GTIDs of replicated transactions that were committed with binary logging disabled on the replica.

  + GTIDs of transactions that were written to a binary log file that has now been purged.

  + GTIDs that were added explicitly to the set by the statement `SET @@GLOBAL.gtid_purged`.

  When the server starts or restarts, the global value of `gtid_purged` is initialized to a set of GTIDs. For information on how this GTID set is computed, see The `gtid_purged` System Variable. If binary logs from MySQL 5.7.7 or older are present on the server, you might need to set `binlog_gtid_simple_recovery=FALSE` in the server's configuration file to produce the correct computation. See the description for `binlog_gtid_simple_recovery` for details of the situations in which this setting is needed.

  Issuing `RESET MASTER` causes the value of `gtid_purged` to be reset to an empty string.

  You can set the value of `gtid_purged` in order to record on the server that the transactions in a certain GTID set have been applied, although they do not exist in any binary log on the server. An example use case for this action is when you are restoring a backup of one or more databases on a server, but you do not have the relevant binary logs containing the transactions on the server.

  Important

  GTIDs are only available on a server instance up to the number of non-negative values for a signed 64-bit integer (2 to the power of 63, minus 1). If you set the value of `gtid_purged` to a number that approaches this limit, subsequent commits can cause the server to run out of GTIDs and take the action specified by `binlog_error_action`.

  In MySQL 5.7, it is possible to update the value of `gtid_purged` only when `gtid_executed` is the empty string, and therefore `gtid_purged` is the empty string. This is the case either when replication has not been started previously, or when replication did not previously use GTIDs. Prior to MySQL 5.7.6, `gtid_purged` was also settable only when `gtid_mode=ON`. In MySQL 5.7.6 and higher, `gtid_purged` is settable regardless of the value of `gtid_mode`.

  To replace the value of `gtid_purged` with your specified GTID set, use the following statement:

  ```sql
  SET @@GLOBAL.gtid_purged = 'gtid_set'
  ```

  Note

  If you are using MySQL 5.7.7 or earlier, after issuing a `SET @@GLOBAL.gtid_purged` statement, you might need to set `binlog_gtid_simple_recovery=FALSE` in the server's configuration file before restarting the server, otherwise `gtid_purged` can be computed incorrectly. See the description for `binlog_gtid_simple_recovery` for details of the situations in which this setting is needed. If all binary logs on the server were generated using MySQL 5.7.8 or later and you are using MySQL 5.7.8 or later, `binlog_gtid_simple_recovery=TRUE` (which is the default setting from MySQL 5.7.7) can always safely be used.


### 16.1.7 Common Replication Administration Tasks

Once replication has been started it executes without requiring much regular administration. This section describes how to check the status of replication and how to pause a replica.


#### 16.1.7.1 Checking Replication Status

The most common task when managing a replication process is to ensure that replication is taking place and that there have been no errors between the replica and the source.

The `SHOW SLAVE STATUS` statement, which you must execute on each replica, provides information about the configuration and status of the connection between the replica server and the source server. From MySQL 5.7, the Performance Schema has replication tables that provide this information in a more accessible form. See Section 25.12.11, “Performance Schema Replication Tables”.

The `SHOW STATUS` statement also provided some information relating specifically to replicas. As of MySQL version 5.7.5, the following status variables previously monitored using `SHOW STATUS` were deprecated and moved to the Performance Schema replication tables:

* `Slave_retried_transactions`
* `Slave_last_heartbeat`
* `Slave_received_heartbeats`
* `Slave_heartbeat_period`
* `Slave_running`

The replication heartbeat information shown in the Performance Schema replication tables lets you check that the replication connection is active even if the source has not sent events to the replica recently. The source sends a heartbeat signal to a replica if there are no updates to, and no unsent events in, the binary log for a longer period than the heartbeat interval. The `MASTER_HEARTBEAT_PERIOD` setting on the source (set by the `CHANGE MASTER TO` statement) specifies the frequency of the heartbeat, which defaults to half of the connection timeout interval for the replica (`slave_net_timeout`). The `replication_connection_status` Performance Schema table shows when the most recent heartbeat signal was received by a replica, and how many heartbeat signals it has received.

If you are using the `SHOW SLAVE STATUS` statement to check on the status of an individual replica, the statement provides the following information:

```sql
mysql> SHOW SLAVE STATUS\G
*************************** 1. row ***************************
               Slave_IO_State: Waiting for master to send event
                  Master_Host: source1
                  Master_User: root
                  Master_Port: 3306
                Connect_Retry: 60
              Master_Log_File: mysql-bin.000004
          Read_Master_Log_Pos: 931
               Relay_Log_File: replica1-relay-bin.000056
                Relay_Log_Pos: 950
        Relay_Master_Log_File: mysql-bin.000004
             Slave_IO_Running: Yes
            Slave_SQL_Running: Yes
              Replicate_Do_DB:
          Replicate_Ignore_DB:
           Replicate_Do_Table:
       Replicate_Ignore_Table:
      Replicate_Wild_Do_Table:
  Replicate_Wild_Ignore_Table:
                   Last_Errno: 0
                   Last_Error:
                 Skip_Counter: 0
          Exec_Master_Log_Pos: 931
              Relay_Log_Space: 1365
              Until_Condition: None
               Until_Log_File:
                Until_Log_Pos: 0
           Master_SSL_Allowed: No
           Master_SSL_CA_File:
           Master_SSL_CA_Path:
              Master_SSL_Cert:
            Master_SSL_Cipher:
               Master_SSL_Key:
        Seconds_Behind_Master: 0
Master_SSL_Verify_Server_Cert: No
                Last_IO_Errno: 0
                Last_IO_Error:
               Last_SQL_Errno: 0
               Last_SQL_Error:
  Replicate_Ignore_Server_Ids: 0
```

The key fields from the status report to examine are:

* `Slave_IO_State`: The current status of the replica. See Section 8.14.6, “Replication Replica I/O Thread States”, and Section 8.14.7, “Replication Replica SQL Thread States”, for more information.

* `Slave_IO_Running`: Whether the I/O thread for reading the source's binary log is running. Normally, you want this to be `Yes` unless you have not yet started replication or have explicitly stopped it with `STOP SLAVE`.

* `Slave_SQL_Running`: Whether the SQL thread for executing events in the relay log is running. As with the I/O thread, this should normally be `Yes`.

* `Last_IO_Error`, `Last_SQL_Error`: The last errors registered by the I/O and SQL threads when processing the relay log. Ideally these should be blank, indicating no errors.

* `Seconds_Behind_Master`: The number of seconds that the replication SQL thread is behind processing the source's binary log. A high number (or an increasing one) can indicate that the replica is unable to handle events from the source in a timely fashion.

  A value of 0 for `Seconds_Behind_Master` can usually be interpreted as meaning that the replica has caught up with the source, but there are some cases where this is not strictly true. For example, this can occur if the network connection between source and replica is broken but the replication I/O thread has not yet noticed this—that is, `slave_net_timeout` has not yet elapsed.

  It is also possible that transient values for `Seconds_Behind_Master` may not reflect the situation accurately. When the replication SQL thread has caught up on I/O, `Seconds_Behind_Master` displays 0; but when the replication I/O thread is still queuing up a new event, `Seconds_Behind_Master` may show a large value until the SQL thread finishes executing the new event. This is especially likely when the events have old timestamps; in such cases, if you execute `SHOW SLAVE STATUS` several times in a relatively short period, you may see this value change back and forth repeatedly between 0 and a relatively large value.

Several pairs of fields provide information about the progress of the replica in reading events from the source's binary log and processing them in the relay log:

* (`Master_Log_file`, `Read_Master_Log_Pos`): Coordinates in the source's binary log indicating how far the replication I/O thread has read events from that log.

* (`Relay_Master_Log_File`, `Exec_Master_Log_Pos`): Coordinates in the source's binary log indicating how far the replication SQL thread has executed events received from that log.

* (`Relay_Log_File`, `Relay_Log_Pos`): Coordinates in the replica's relay log indicating how far the replication SQL thread has executed the relay log. These correspond to the preceding coordinates, but are expressed in the replica's relay log coordinates rather than the source's binary log coordinates.

On the source, you can check the status of connected replicas using `SHOW PROCESSLIST` to examine the list of running processes. Replica connections have `Binlog Dump` in the `Command` field:

```sql
mysql> SHOW PROCESSLIST \G;
*************************** 4. row ***************************
     Id: 10
   User: root
   Host: replica1:58371
     db: NULL
Command: Binlog Dump
   Time: 777
  State: Has sent all binlog to slave; waiting for binlog to be updated
   Info: NULL
```

Because it is the replica that drives the replication process, very little information is available in this report.

For replicas that were started with the `--report-host` option and are connected to the source, the `SHOW SLAVE HOSTS` statement on the source shows basic information about the replicas. The output includes the ID of the replica server, the value of the `--report-host` option, the connecting port, and source ID:

```sql
mysql> SHOW SLAVE HOSTS;
+-----------+----------+------+-------------------+-----------+
| Server_id | Host     | Port | Rpl_recovery_rank | Master_id |
+-----------+----------+------+-------------------+-----------+
|        10 | replica1 | 3306 |                 0 |         1 |
+-----------+----------+------+-------------------+-----------+
1 row in set (0.00 sec)
```


#### 16.1.7.2 Pausing Replication on the Replica

You can stop and start replication on the replica using the `STOP SLAVE` and `START SLAVE` statements.

To stop processing of the binary log from the source, use `STOP SLAVE`:

```sql
mysql> STOP SLAVE;
```

When replication is stopped, the replication I/O thread stops reading events from the source's binary log and writing them to the relay log, and the replication SQL thread stops reading events from the relay log and executing them. You can pause the replication I/O and SQL threads individually by specifying the thread type:

```sql
mysql> STOP SLAVE IO_THREAD;
mysql> STOP SLAVE SQL_THREAD;
```

To start execution again, use the `START SLAVE` statement:

```sql
mysql> START SLAVE;
```

To start a particular thread, specify the thread type:

```sql
mysql> START SLAVE IO_THREAD;
mysql> START SLAVE SQL_THREAD;
```

For a replica that performs updates only by processing events from the source, stopping only the replication SQL thread can be useful if you want to perform a backup or other task. The replication I/O thread continues to read events from the source but they are not executed. This makes it easier for the replica to catch up when you restart the replication SQL thread.

Stopping only the replication I/O thread enables the events in the relay log to be executed by the replication SQL thread up to the point where the relay log ends. This can be useful when you want to pause execution to catch up with events already received from the source, when you want to perform administration on the replica but also ensure that it has processed all updates to a specific point. This method can also be used to pause event receipt on the replica while you conduct administration on the source. Stopping the I/O thread but permitting the SQL thread to run helps ensure that there is not a massive backlog of events to be executed when replication is started again.


#### 16.1.7.3 Skipping Transactions

If replication stops due to an issue with an event in a replicated transaction, you can resume replication by skipping the failed transaction on the replica. Before skipping a transaction, ensure that the replication I/O thread is stopped as well as the replication SQL thread.

First you need to identify the replicated event that caused the error. Details of the error and the last successfully applied transaction are recorded in the Performance Schema table `replication_applier_status_by_worker`. You can use **mysqlbinlog** to retrieve and display the events that were logged around the time of the error. For instructions to do this, see Section 7.5, “Point-in-Time (Incremental) Recovery” Recovery"). Alternatively, you can issue `SHOW RELAYLOG EVENTS` on the replica or `SHOW BINLOG EVENTS` on the source.

Before skipping the transaction and restarting the replica, check these points:

* Is the transaction that stopped replication from an unknown or untrusted source? If so, investigate the cause in case there are any security considerations that indicate the replica should not be restarted.

* Does the transaction that stopped replication need to be applied on the replica? If so, either make the appropriate corrections and reapply the transaction, or manually reconcile the data on the replica.

* Did the transaction that stopped replication need to be applied on the source? If not, undo the transaction manually on the server where it originally took place.

To skip the transaction, choose one of the following methods as appropriate:

* When GTIDs are in use (`gtid_mode` is `ON`), see Section 16.1.7.3.1, “Skipping Transactions With GTIDs” .

* When GTIDs are not in use or are being phased in (`gtid_mode` is `OFF`, `OFF_PERMISSIVE`, or `ON_PERMISSIVE`), see Section 16.1.7.3.2, “Skipping Transactions Without GTIDs”.

To restart replication after skipping the transaction, issue `START SLAVE`, with the `FOR CHANNEL` clause if the replica is a multi-source replica.

##### 16.1.7.3.1 Skipping Transactions With GTIDs

When GTIDs are in use (`gtid_mode` is `ON`), the GTID for a committed transaction is persisted on the replica even if the content of the transaction is filtered out. This feature prevents a replica from retrieving previously filtered transactions when it reconnects to the source using GTID auto-positioning. It can also be used to skip a transaction on the replica, by committing an empty transaction in place of the failing transaction.

If the failing transaction generated an error in a worker thread, you can obtain its GTID directly from the `APPLYING_TRANSACTION` field in the Performance Schema table `replication_applier_status_by_worker`. To see what the transaction is, issue `SHOW RELAYLOG EVENTS` on the replica or `SHOW BINLOG EVENTS` on the source, and search the output for a transaction preceded by that GTID.

When you have assessed the failing transaction for any other appropriate actions as described previously (such as security considerations), to skip it, commit an empty transaction on the replica that has the same GTID as the failing transaction. For example:

```sql
SET GTID_NEXT='aaa-bbb-ccc-ddd:N';
BEGIN;
COMMIT;
SET GTID_NEXT='AUTOMATIC';
```

The presence of this empty transaction on the replica means that when you issue a `START SLAVE` statement to restart replication, the replica uses the auto-skip function to ignore the failing transaction, because it sees a transaction with that GTID has already been applied. If the replica is a multi-source replica, you do not need to specify the channel name when you commit the empty transaction, but you do need to specify the channel name when you issue `START SLAVE`.

Note that if binary logging is in use on this replica, the empty transaction enters the replication stream if the replica becomes a source or primary in the future. If you need to avoid this possibility, consider flushing and purging the replica's binary logs, as in this example:

```sql
FLUSH LOGS;
PURGE BINARY LOGS TO 'binlog.000146';
```

The GTID of the empty transaction is persisted, but the transaction itself is removed by purging the binary log files.

##### 16.1.7.3.2 Skipping Transactions Without GTIDs

To skip failing transactions when GTIDs are not in use or are being phased in (`gtid_mode` is `OFF`, `OFF_PERMISSIVE`, or `ON_PERMISSIVE`), you can skip a specified number of events by issuing a `SET GLOBAL sql_slave_skip_counter` statement. Alternatively, you can skip past an event or events by issuing a `CHANGE MASTER TO` statement to move the source's binary log position forward.

When you use these methods, it is important to understand that you are not necessarily skipping a complete transaction, as is always the case with the GTID-based method described previously. These non-GTID-based methods are not aware of transactions as such, but instead operate on events. The binary log is organized as a sequence of groups known as event groups, and each event group consists of a sequence of events.

* For transactional tables, an event group corresponds to a transaction.

* For nontransactional tables, an event group corresponds to a single SQL statement.

A single transaction can contain changes to both transactional and nontransactional tables.

When you use a `SET GLOBAL sql_slave_skip_counter` statement to skip events and the resulting position is in the middle of an event group, the replica continues to skip events until it reaches the end of the group. Execution then starts with the next event group. The `CHANGE MASTER TO` statement does not have this function, so you must be careful to identify the correct location to restart replication at the beginning of an event group. However, using `CHANGE MASTER TO` means you do not have to count the events that need to be skipped, as you do with a `SET GLOBAL sql_slave_skip_counter`, and instead you can just specify the location to restart.

###### 16.1.7.3.2.1 Skipping Transactions With `SET GLOBAL sql_slave_skip_counter`

When you have assessed the failing transaction for any other appropriate actions as described previously (such as security considerations), count the number of events that you need to skip. One event normally corresponds to one SQL statement in the binary log, but note that statements that use `AUTO_INCREMENT` or `LAST_INSERT_ID()` count as two events in the binary log.

If you want to skip the complete transaction, you can count the events to the end of the transaction, or you can just skip the relevant event group. Remember that with `SET GLOBAL sql_slave_skip_counter`, the replica continues to skip to the end of an event group. Make sure you do not skip too far forward and go into the next event group or transaction, as this then causes it to be skipped as well.

Issue the `SET` statement as follows, where *`N`* is the number of events from the source to skip:

```sql
SET GLOBAL sql_slave_skip_counter = N
```

This statement cannot be issued if `gtid_mode=ON` is set, or if the replica threads are running.

The `SET GLOBAL sql_slave_skip_counter` statement has no immediate effect. When you issue the `START SLAVE` statement for the next time following this `SET` statement, the new value for the system variable `sql_slave_skip_counter` is applied, and the events are skipped. That `START SLAVE` statement also automatically sets the value of the system variable back to

0. If the replica is a multi-source replica, when you issue that `START SLAVE` statement, the `FOR CHANNEL` clause is required. Make sure that you name the correct channel, otherwise events are skipped on the wrong channel.

###### 16.1.7.3.2.2 Skipping Transactions With `CHANGE MASTER TO`

When you have assessed the failing transaction for any other appropriate actions as described previously (such as security considerations), identify the coordinates (file and position) in the source's binary log that represent a suitable position to restart replication. This can be the start of the event group following the event that caused the issue, or the start of the next transaction. The replication I/O thread begins reading from the source at these coordinates the next time the thread starts, skipping the failing event. Make sure that you have identified the position accurately, because this statement does not take event groups into account.

Issue the `CHANGE MASTER TO` statement as follows, where *`source_log_name`* is the binary log file that contains the restart position, and *`source_log_pos`* is the number representing the restart position as stated in the binary log file:

```sql
CHANGE MASTER TO MASTER_LOG_FILE='source_log_name', MASTER_LOG_POS=source_log_pos;
```

If the replica is a multi-source replica, you must use the `FOR CHANNEL` clause to name the appropriate channel on the `CHANGE MASTER TO` statement.

This statement cannot be issued if `MASTER_AUTO_POSITION=1` is set, or if the replication threads are running. If you need to use this method of skipping a transaction when `MASTER_AUTO_POSITION=1` is normally set, you can change the setting to `MASTER_AUTO_POSITION=0` while issuing the statement, then change it back again afterwards. For example:

```sql
CHANGE MASTER TO MASTER_AUTO_POSITION=0, MASTER_LOG_FILE='binlog.000145', MASTER_LOG_POS=235;
CHANGE MASTER TO MASTER_AUTO_POSITION=1;
```
