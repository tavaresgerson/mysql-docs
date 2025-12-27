#### 16.1.2.5 Setting Up Replicas

The following sections describe how to set up replicas. Before you proceed, ensure that you have:

* Configured the source with the necessary configuration properties. See [Section 16.1.2.1, “Setting the Replication Source Configuration”](replication-howto-masterbaseconfig.html "16.1.2.1 Setting the Replication Source Configuration").

* Obtained the source's status information, or a copy of the source's binary log index file made during a shutdown for the data snapshot. See [Section 16.1.2.3, “Obtaining the Replication Source's Binary Log Coordinates”](replication-howto-masterstatus.html "16.1.2.3 Obtaining the Replication Source's Binary Log Coordinates").

* On the source, released the read lock:

  ```sql
  mysql> UNLOCK TABLES;
  ```

##### 16.1.2.5.1 Setting the Replica Configuration

Each replica must have a unique server ID, as specified by the [`server_id`](replication-options.html#sysvar_server_id) system variable. If you are setting up multiple replicas, each one must have a unique [`server_id`](replication-options.html#sysvar_server_id) value that differs from that of the source and from any of the other replicas. If the replica's server ID is not already set, or the current value conflicts with the value that you have chosen for the source server or another replica, you must change it. With the default [`server_id`](replication-options.html#sysvar_server_id) value of 0, a replica refuses to connect to a source.

You can change the [`server_id`](replication-options.html#sysvar_server_id) value dynamically by issuing a statement like this:

```sql
SET GLOBAL server_id = 21;
```

If the default [`server_id`](replication-options.html#sysvar_server_id) value of 0 was set previously, you must restart the server to initialize the replica with your new nonzero server ID. Otherwise, a server restart is not needed when you change the server ID, unless you make other configuration changes that require it. For example, if binary logging was disabled on the server and you want it enabled for your replica, a server restart is required to enable this.

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

The [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement has other options as well. For example, it is possible to set up secure replication using SSL. For a full list of options, and information about the maximum permissible length for the string-valued options, see [Section 13.4.2.1, “CHANGE MASTER TO Statement”](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement").

The next steps depend on whether you have existing data to import to the replica or not. See [Section 16.1.2.4, “Choosing a Method for Data Snapshots”](replication-snapshot-method.html "16.1.2.4 Choosing a Method for Data Snapshots") for more information. Choose one of the following:

* If you do not have a snapshot of a database to import, see [Section 16.1.2.5.3, “Setting Up Replication between a New Source and Replicas”](replication-setup-replicas.html#replication-howto-newservers "16.1.2.5.3 Setting Up Replication between a New Source and Replicas").

* If you have a snapshot of a database to import, see [Section 16.1.2.5.4, “Setting Up Replication with Existing Data”](replication-setup-replicas.html#replication-howto-existingdata "16.1.2.5.4 Setting Up Replication with Existing Data").

##### 16.1.2.5.3 Setting Up Replication between a New Source and Replicas

When there is no snapshot of a previous database to import, configure the replica to start replication from the new source.

To set up replication between a source and a new replica:

1. Start up the replica and connect to it.
2. Execute a [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement to set the source configuration. See [Section 16.1.2.5.2, “Setting the Source Configuration on the Replica”](replication-setup-replicas.html#replication-howto-slaveinit "16.1.2.5.2 Setting the Source Configuration on the Replica").

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

   1. If you used [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program"), start the replica server, ensuring that replication does not start by using the [`--skip-slave-start`](replication-options-replica.html#option_mysqld_skip-slave-start) option. Then import the dump file:

      ```sql
      $> mysql < fulldb.dump
      ```

   2. If you created a snapshot using the raw data files, extract the data files into your replica's data directory. For example:

      ```sql
      $> tar xvf dbdump.tar
      ```

      You may need to set permissions and ownership on the files so that the replica server can access and modify them. Then start the replica server, ensuring that replication does not start by using the [`--skip-slave-start`](replication-options-replica.html#option_mysqld_skip-slave-start) option.

2. Configure the replica with the replication coordinates from the source. This tells the replica the binary log file and position within the file where replication needs to start. Also, configure the replica with the login credentials and host name of the source. For more information on the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement required, see [Section 16.1.2.5.2, “Setting the Source Configuration on the Replica”](replication-setup-replicas.html#replication-howto-slaveinit "16.1.2.5.2 Setting the Source Configuration on the Replica").

3. Start the replication threads:

   ```sql
   mysql> START SLAVE;
   ```

After you have performed this procedure, the replica connects to the source and replicates any updates that have occurred on the source since the snapshot was taken.

If the [`server_id`](replication-options.html#sysvar_server_id) system variable for the source is not correctly set, replicas cannot connect to it. Similarly, if you have not set [`server_id`](replication-options.html#sysvar_server_id) correctly for the replica, you get the following error in the replica's error log:

```sql
Warning: You should set server-id to a non-0 value if master_host
is set; we will force server id to 2, but this MySQL server will
not act as a slave.
```

You also find error messages in the replica's error log if it is not able to replicate for any other reason.

The replica stores information about the source you have configured in its connection metadata repository. The connection metadata repository can be in the form of files or a table, as determined by the value set for the [`master_info_repository`](replication-options-replica.html#sysvar_master_info_repository) system variable. When a replica runs with [`master_info_repository=FILE`](replication-options-replica.html#sysvar_master_info_repository), two files are stored in the data directory, named `master.info` and `relay-log.info`. If [`master_info_repository=TABLE`](replication-options-replica.html#sysvar_master_info_repository) instead, this information is saved in the `master_slave_info` table in the `mysql` database. In either case, do *not* remove or edit the files or table. Always use the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement to change replication parameters. The replica can use the values specified in the statement to update the status files automatically. See [Section 16.2.4, “Relay Log and Replication Metadata Repositories”](replica-logs.html "16.2.4 Relay Log and Replication Metadata Repositories"), for more information.

Note

The contents of the connection metadata repository override some of the server options specified on the command line or in `my.cnf`. See [Section 16.1.6, “Replication and Binary Logging Options and Variables”](replication-options.html "16.1.6 Replication and Binary Logging Options and Variables"), for more details.

A single snapshot of the source suffices for multiple replicas. To set up additional replicas, use the same source snapshot and follow the replica portion of the procedure just described.
