### 19.1.2 Setting Up Binary Log File Position Based Replication

19.1.2.1 Setting the Replication Source Configuration

19.1.2.2 Setting the Replica Configuration

19.1.2.3 Creating a User for Replication

19.1.2.4 Obtaining the Replication Source Binary Log Coordinates

19.1.2.5 Choosing a Method for Data Snapshots

19.1.2.6 Setting Up Replicas

19.1.2.7 Setting the Source Configuration on the Replica

19.1.2.8 Adding Replicas to a Replication Environment

This section describes how to set up a MySQL server to use binary log file position based replication. There are a number of different methods for setting up replication, and the exact method to use depends on how you are setting up replication, and whether you already have data in the database on the source that you want to replicate.

Tip

To deploy multiple instances of MySQL, you can use InnoDB Cluster which enables you to easily administer a group of MySQL server instances in MySQL Shell. InnoDB Cluster wraps MySQL Group Replication in a programmatic environment that enables you easily deploy a cluster of MySQL instances to achieve high availability. In addition, InnoDB Cluster interfaces seamlessly with MySQL Router, which enables your applications to connect to the cluster without writing your own failover process. For similar use cases that do not require high availability, however, you can use InnoDB ReplicaSet. Installation instructions for MySQL Shell can be found here.

There are some generic tasks that are common to all setups:

* On the source, you must ensure that binary logging is enabled, and configure a unique server ID. This might require a server restart. See Section 19.1.2.1, “Setting the Replication Source Configuration”.

* On each replica that you want to connect to the source, you must configure a unique server ID. This might require a server restart. See Section 19.1.2.2, “Setting the Replica Configuration”.

* Optionally, create a separate user for your replicas to use during authentication with the source when reading the binary log for replication. See Section 19.1.2.3, “Creating a User for Replication”.

* Before creating a data snapshot or starting the replication process, on the source you should record the current position in the binary log. You need this information when configuring the replica so that the replica knows where within the binary log to start executing events. See Section 19.1.2.4, “Obtaining the Replication Source Binary Log Coordinates”.

* If you already have data on the source and want to use it to synchronize the replica, you need to create a data snapshot to copy the data to the replica. The storage engine you are using has an impact on how you create the snapshot. When you are using `MyISAM`, you must stop processing statements on the source to obtain a read-lock, then obtain its current binary log coordinates and dump its data, before permitting the source to continue executing statements. If you do not stop the execution of statements, the data dump and the source status information become mismatched, resulting in inconsistent or corrupted databases on the replicas. For more information on replicating a `MyISAM` source, see Section 19.1.2.4, “Obtaining the Replication Source Binary Log Coordinates”. If you are using `InnoDB`, you do not need a read-lock and a transaction that is long enough to transfer the data snapshot is sufficient. For more information, see Section 17.19, “InnoDB and MySQL Replication”.

* Configure the replica with settings for connecting to the source, such as the host name, login credentials, and binary log file name and position. See Section 19.1.2.7, “Setting the Source Configuration on the Replica”.

* Implement replication-specific security measures on the sources and replicas as appropriate for your system. See Section 19.3, “Replication Security”.

Note

Certain steps within the setup process require the `SUPER` privilege. If you do not have this privilege, it might not be possible to enable replication.

After configuring the basic options, select your scenario:

* To set up replication for a fresh installation of a source and replicas that contain no data, see Section 19.1.2.6.1, “Setting Up Replication with New Source and Replicas”.

* To set up replication of a new source using the data from an existing MySQL server, see Section 19.1.2.6.2, “Setting Up Replication with Existing Data”.

* To add replicas to an existing replication environment, see Section 19.1.2.8, “Adding Replicas to a Replication Environment”.

Before administering MySQL replication servers, read this entire chapter and try all statements mentioned in Section 15.4.1, “SQL Statements for Controlling Source Servers”, and Section 15.4.2, “SQL Statements for Controlling Replica Servers”. Also familiarize yourself with the replication startup options described in Section 19.1.6, “Replication and Binary Logging Options and Variables”.
