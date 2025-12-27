#### 19.1.2.6 Setting Up Replicas

The following sections describe how to set up replicas. Before you proceed, ensure that you have:

* Configured the source with the necessary configuration properties. See Section 19.1.2.1, “Setting the Replication Source Configuration”.

* Obtained the source status information, or a copy of the source's binary log index file made during a shutdown for the data snapshot. See Section 19.1.2.4, “Obtaining the Replication Source Binary Log Coordinates”.

* On the source, released the read lock:

  ```
  mysql> UNLOCK TABLES;
  ```

* On the replica, edited the MySQL configuration. See Section 19.1.2.2, “Setting the Replica Configuration”.

The next steps depend on whether you have existing data to import to the replica or not. See Section 19.1.2.5, “Choosing a Method for Data Snapshots” for more information. Choose one of the following:

* If you do not have a snapshot of a database to import, see Section 19.1.2.6.1, “Setting Up Replication with New Source and Replicas”.

* If you have a snapshot of a database to import, see Section 19.1.2.6.2, “Setting Up Replication with Existing Data”.

##### 19.1.2.6.1 Setting Up Replication with New Source and Replicas

When there is no snapshot of a previous database to import, configure the replica to start replication from the new source.

To set up replication between a source and a new replica:

1. Start up the replica.
2. Execute a `CHANGE REPLICATION SOURCE TO` statement on the replica to set the source configuration. See Section 19.1.2.7, “Setting the Source Configuration on the Replica”.

Perform these replica setup steps on each replica.

This method can also be used if you are setting up new servers but have an existing dump of the databases from a different server that you want to load into your replication configuration. By loading the data into a new source, the data is automatically replicated to the replicas.

If you are setting up a new replication environment using the data from a different existing database server to create a new source, run the dump file generated from that server on the new source. The database updates are automatically propagated to the replicas:

```
$> mysql -h source < fulldb.dump
```

##### 19.1.2.6.2 Setting Up Replication with Existing Data

When setting up replication with existing data, transfer the snapshot from the source to the replica before starting replication. The process for importing data to the replica depends on how you created the snapshot of data on the source.

Tip

To deploy multiple instances of MySQL, you can use InnoDB Cluster which enables you to easily administer a group of MySQL server instances in MySQL Shell. InnoDB Cluster wraps MySQL Group Replication in a programmatic environment that enables you easily deploy a cluster of MySQL instances to achieve high availability. In addition, InnoDB Cluster interfaces seamlessly with MySQL Router, which enables your applications to connect to the cluster without writing your own failover process. For similar use cases that do not require high availability, however, you can use InnoDB ReplicaSet. Installation instructions for MySQL Shell can be found here.

Note

If the replication source server or existing replica that you are copying to create the new replica has any scheduled events, ensure that these are disabled on the new replica before you start it. If an event runs on the new replica that has already run on the source, the duplicated operation causes an error. The Event Scheduler is controlled by the `event_scheduler` system variable (default `ON`), so events that are active on the original server run by default when the new replica starts up. To stop all events from running on the new replica, set the `event_scheduler` system variable to `OFF` or `DISABLED` on the new replica. Alternatively, you can use the `ALTER EVENT` statement to set individual events to `DISABLE` or `DISABLE ON REPLICA` to prevent them from running on the new replica. You can list the events on a server using the `SHOW` statement or the Information Schema `EVENTS` table. For more information, see Section 19.5.1.16, “Replication of Invoked Features”.

As an alternative to creating a new replica in this way, MySQL Server's clone plugin can be used to transfer all the data and replication settings from an existing replica to a clone. For instructions to use this method, see Section 7.6.6.7, “Cloning for Replication”.

Follow this procedure to set up replication with existing data:

1. If you used MySQL Server's clone plugin to create a clone from an existing replica (see Section 7.6.6.7, “Cloning for Replication”), the data is already transferred. Otherwise, import the data to the replica using one of the following methods.

   1. If you used **mysqldump**, start the replica server, ensuring that replication does not start by starting the server with `--skip-replica-start`. Then import the dump file:

      ```
      $> mysql < fulldb.dump
      ```

   2. If you created a snapshot using the raw data files, extract the data files into your replica's data directory. For example:

      ```
      $> tar xvf dbdump.tar
      ```

      You may need to set permissions and ownership on the files so that the replica server can access and modify them. Then start the replica server, ensuring that replication does not start by using `--skip-replica-start`.

2. Configure the replica with the replication coordinates from the source. This tells the replica the binary log file and position within the file where replication needs to start. Also, configure the replica with the login credentials and host name of the source. For more information on the `CHANGE REPLICATION SOURCE TO` statement required, see Section 19.1.2.7, “Setting the Source Configuration on the Replica”.

3. Start the replication threads by issuing a `START REPLICA` statement.

After you have performed this procedure, the replica connects to the source and replicates any updates that have occurred on the source since the snapshot was taken. Error messages are issued to the replica's error log if it is not able to replicate for any reason.

The replica uses information logged in its connection metadata repository and applier metadata repository to keep track of how much of the source's binary log it has processed. By default, these repositories are tables named `slave_master_info` and `slave_relay_log_info` in the `mysql` database. Do *not* remove or edit these tables unless you know exactly what you are doing and fully understand the implications. Even in that case, it is preferred that you use the `CHANGE REPLICATION SOURCE TO` statement to change replication parameters. The replica uses the values specified in the statement to update the replication metadata repositories automatically. See Section 19.2.4, “Relay Log and Replication Metadata Repositories”, for more information.

Note

The contents of the replica's connection metadata repository override some of the server options specified on the command line or in `my.cnf`. See Section 19.1.6, “Replication and Binary Logging Options and Variables”, for more details.

A single snapshot of the source suffices for multiple replicas. To set up additional replicas, use the same source snapshot and follow the replica portion of the procedure just described.
