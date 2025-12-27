### 16.2.2 Replication Channels

[16.2.2.1 Commands for Operations on a Single Channel](channels-commands-single-channel.html)

[16.2.2.2 Compatibility with Previous Replication Statements](channels-with-prev-replication.html)

[16.2.2.3 Startup Options and Replication Channels](channels-startup-options.html)

[16.2.2.4 Replication Channel Naming Conventions](channels-naming-conventions.html)

In MySQL multi-source replication, a replica opens multiple replication channels, one for each replication source server. The replication channels represent the path of transactions flowing from a source to the replica. Each replication channel has its own receiver (I/O) thread, one or more applier (SQL) threads, and relay log. When transactions from a source are received by a channel's receiver thread, they are added to the channel's relay log file and passed through to the channel's applier threads. This enables each channel to function independently.

This section describes how channels can be used in a replication topology, and the impact they have on single-source replication. For instructions to configure sources and replicas for multi-source replication, to start, stop and reset multi-source replicas, and to monitor multi-source replication, see [Section 16.1.5, “MySQL Multi-Source Replication”](replication-multi-source.html "16.1.5 MySQL Multi-Source Replication").

The maximum number of channels that can be created on one replica in a multi-source replication topology is 256. Each replication channel must have a unique (nonempty) name, as explained in [Section 16.2.2.4, “Replication Channel Naming Conventions”](channels-naming-conventions.html "16.2.2.4 Replication Channel Naming Conventions"). The error codes and messages that are issued when multi-source replication is enabled specify the channel that generated the error.

Note

Each channel on a multi-source replica must replicate from a different source. You cannot set up multiple replication channels from a single replica to a single source. This is because the server IDs of replicas must be unique in a replication topology. The source distinguishes replicas only by their server IDs, not by the names of the replication channels, so it cannot recognize different replication channels from the same replica.

A multi-source replica can also be set up as a multi-threaded replica, by setting the [`slave_parallel_workers`](replication-options-replica.html#sysvar_slave_parallel_workers) system variable to a value greater than 0. When you do this on a multi-source replica, each channel on the replica has the specified number of applier threads, plus a coordinator thread to manage them. You cannot configure the number of applier threads for individual channels.

To provide compatibility with previous versions, the MySQL server automatically creates on startup a default channel whose name is the empty string (`""`). This channel is always present; it cannot be created or destroyed by the user. If no other channels (having nonempty names) have been created, replication statements act on the default channel only, so that all replication statements from older replicas function as expected (see [Section 16.2.2.2, “Compatibility with Previous Replication Statements”](channels-with-prev-replication.html "16.2.2.2 Compatibility with Previous Replication Statements"). Statements applying to replication channels as described in this section can be used only when there is at least one named channel.
