### 19.1.5 MySQL Multi-Source Replication

19.1.5.1 Configuring Multi-Source Replication

19.1.5.2 Provisioning a Multi-Source Replica for GTID-Based Replication

19.1.5.3 Adding GTID-Based Sources to a Multi-Source Replica

19.1.5.4 Adding Binary Log Based Replication Sources to a Multi-Source Replica

19.1.5.5 Starting Multi-Source Replicas

19.1.5.6 Stopping Multi-Source Replicas

19.1.5.7 Resetting Multi-Source Replicas

19.1.5.8 Monitoring Multi-Source Replication

Multi-source replication in MySQL 9.5 enables a replica to receive transactions from multiple immediate sources in parallel. In a multi-source replication topology, a replica creates a replication channel for each source that it should receive transactions from. For more information on how replication channels function, see Section 19.2.2, “Replication Channels”.

You might choose to implement multi-source replication to achieve goals like these:

* Backing up multiple servers to a single server.
* Merging table shards.
* Consolidating data from multiple servers to a single server.

Multi-source replication does not implement any conflict detection or resolution when applying transactions, and those tasks are left to the application if required.

Note

Each channel on a multi-source replica must replicate from a different source. You cannot set up multiple replication channels from a single replica to a single source. This is because the server IDs of replicas must be unique in a replication topology. The source distinguishes replicas only by their server IDs, not by the names of the replication channels, so it cannot recognize different replication channels from the same replica.

When a multi-source replica is also up as a multi-threaded replica, each channel on the replica has the specified number of applier threads, plus a coordinator thread to manage them. You cannot configure the number of applier threads for individual channels.

MySQL 9.5 also supports replication filters on specific replication channels with multi-source replicas. Channel specific replication filters can be used when the same database or table is present on multiple sources, and you only need the replica to replicate it from one source. For GTID-based replication, if the same transaction might arrive from multiple sources (such as in a diamond topology), you must ensure the filtering setup is the same on all channels. For more information, see Section 19.2.5.4, “Replication Channel Based Filters”.

This section provides tutorials on how to configure sources and replicas for multi-source replication, how to start, stop and reset multi-source replicas, and how to monitor multi-source replication.
