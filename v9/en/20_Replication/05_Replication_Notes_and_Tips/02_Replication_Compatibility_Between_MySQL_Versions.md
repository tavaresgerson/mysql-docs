### 19.5.2 Replication Compatibility Between MySQL Versions

MySQL supports replication from an older source to a newer replica for version combinations where we support upgrades from the source version to the replica version as described at Section 1.3, “MySQL Releases: Innovation and LTS” and Section 3.2, “Upgrade Paths”. However, you might encounter difficulties when replicating from an older source to a newer replica if the source uses statements or relies on behavior no longer supported in the version of MySQL used on the replica.

The use of more than two MySQL Server versions is not supported in replication setups involving multiple sources, regardless of the number of source or replica MySQL servers. For example, if you are using a chained or circular replication setup, you cannot use MySQL X.Y.1, MySQL X.Y.2, and MySQL X.Y.3 concurrently, although you could use any two of these releases together.

Important

It is strongly recommended to use the most recent release available within a given MySQL release series because replication (and other) capabilities are continually being improved. It is also recommended to upgrade sources and replicas that use early releases of a release series of MySQL to GA (production) releases when the latter become available for that release series.

The server version is recorded in the binary log for each transaction for the server that originally committed the transaction (`original_server_version`), and for the server that is the immediate source of the current server in the replication topology (`immediate_server_version`).

Replication from newer sources to older replicas might be possible, but is generally not supported. This is due to a number of factors:

* **Binary log format changes.** The binary log format can change between major releases. While we attempt to maintain backward compatibility, this is not always possible. A source might also have optional features enabled that are not understood by older replicas, such as binary log transaction compression, where the resulting compressed transaction payloads cannot be read by a replica from a release prior to MySQL 8.0.20.

  This also has significant implications for upgrading replication servers; see Section 19.5.3, “Upgrading or Downgrading a Replication Topology”, for more information.

* **SQL incompatibilities.** You cannot replicate from a newer source to an older replica using statement-based replication if the statements to be replicated use SQL features available on the source but not on the replica.

  However, if both the source and the replica support row-based replication, and there are no data definition statements to be replicated that depend on SQL features found on the source but not on the replica, you can use row-based replication to replicate the effects of data modification statements even if the DDL run on the source is not supported on the replica.

  For more information about row-based replication, see Section 19.2.1, “Replication Formats”.

For more information on potential replication issues, see Section 19.5.1, “Replication Features and Issues”.
