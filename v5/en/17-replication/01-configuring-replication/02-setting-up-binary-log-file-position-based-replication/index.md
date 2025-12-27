### 16.1.2 Setting Up Binary Log File Position Based Replication

[16.1.2.1 Setting the Replication Source Configuration](replication-howto-masterbaseconfig.html)

[16.1.2.2 Creating a User for Replication](replication-howto-repuser.html)

[16.1.2.3 Obtaining the Replication Source's Binary Log Coordinates](replication-howto-masterstatus.html)

[16.1.2.4 Choosing a Method for Data Snapshots](replication-snapshot-method.html)

[16.1.2.5 Setting Up Replicas](replication-setup-replicas.html)

[16.1.2.6 Adding Replicas to a Replication Topology](replication-howto-additionalslaves.html)

This section describes how to set up a MySQL server to use binary log file position based replication. There are a number of different methods for setting up replication, and the exact method to use depends on how you are setting up replication, and whether you already have data in the database on the source.

There are some generic tasks that are common to all setups:

* On the source, you must enable binary logging and configure a unique server ID. This might require a server restart. See [Section 16.1.2.1, “Setting the Replication Source Configuration”](replication-howto-masterbaseconfig.html "16.1.2.1 Setting the Replication Source Configuration").

* On each replica that you want to connect to the source, you must configure a unique server ID. This might require a server restart. See [Section 16.1.2.5.1, “Setting the Replica Configuration”](replication-setup-replicas.html#replication-howto-slavebaseconfig "16.1.2.5.1 Setting the Replica Configuration").

* Optionally, create a separate user for your replicas to use during authentication with the source when reading the binary log for replication. See [Section 16.1.2.2, “Creating a User for Replication”](replication-howto-repuser.html "16.1.2.2 Creating a User for Replication").

* Before creating a data snapshot or starting the replication process, on the source you should record the current position in the binary log. You need this information when configuring the replica so that the replica knows where in the binary log to start executing events. See [Section 16.1.2.3, “Obtaining the Replication Source's Binary Log Coordinates”](replication-howto-masterstatus.html "16.1.2.3 Obtaining the Replication Source's Binary Log Coordinates").

* If you already have data on the source and want to use it to synchronize the replica, you need to create a data snapshot to copy the data to the replica. The storage engine you are using has an impact on how you create the snapshot. When you are using [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine"), you must stop processing statements on the source to obtain a read-lock, then obtain its current binary log coordinates and dump its data, before permitting the source to continue executing statements. If you do not stop the execution of statements, the data dump and the source's status information do not match, resulting in inconsistent or corrupted databases on the replicas. For more information on replicating a [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") source, see [Section 16.1.2.3, “Obtaining the Replication Source's Binary Log Coordinates”](replication-howto-masterstatus.html "16.1.2.3 Obtaining the Replication Source's Binary Log Coordinates"). If you are using [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), you do not need a read-lock and a transaction that is long enough to transfer the data snapshot is sufficient. For more information, see [Section 14.20, “InnoDB and MySQL Replication”](innodb-and-mysql-replication.html "14.20 InnoDB and MySQL Replication").

* Configure the replica with settings for connecting to the source, such as the host name, login credentials, and binary log file name and position. See [Section 16.1.2.5.2, “Setting the Source Configuration on the Replica”](replication-setup-replicas.html#replication-howto-slaveinit "16.1.2.5.2 Setting the Source Configuration on the Replica").

Note

Certain steps within the setup process require the [`SUPER`](privileges-provided.html#priv_super) privilege. If you do not have this privilege, it might not be possible to enable replication.

After configuring the basic options, select your scenario:

* To set up replication for a fresh installation of a source and replicas that contain no data, see [Section 16.1.2.5.3, “Setting Up Replication between a New Source and Replicas”](replication-setup-replicas.html#replication-howto-newservers "16.1.2.5.3 Setting Up Replication between a New Source and Replicas").

* To set up replication of a new source using the data from an existing MySQL server, see [Section 16.1.2.5.4, “Setting Up Replication with Existing Data”](replication-setup-replicas.html#replication-howto-existingdata "16.1.2.5.4 Setting Up Replication with Existing Data").

* To add replicas to an existing replication environment, see [Section 16.1.2.6, “Adding Replicas to a Replication Topology”](replication-howto-additionalslaves.html "16.1.2.6 Adding Replicas to a Replication Topology").

Before administering MySQL replication servers, read this entire chapter and try all statements mentioned in [Section 13.4.1, “SQL Statements for Controlling Replication Source Servers”](replication-statements-master.html "13.4.1 SQL Statements for Controlling Replication Source Servers"), and [Section 13.4.2, “SQL Statements for Controlling Replica Servers”](replication-statements-replica.html "13.4.2 SQL Statements for Controlling Replica Servers"). Also familiarize yourself with the replication startup options described in [Section 16.1.6, “Replication and Binary Logging Options and Variables”](replication-options.html "16.1.6 Replication and Binary Logging Options and Variables").
