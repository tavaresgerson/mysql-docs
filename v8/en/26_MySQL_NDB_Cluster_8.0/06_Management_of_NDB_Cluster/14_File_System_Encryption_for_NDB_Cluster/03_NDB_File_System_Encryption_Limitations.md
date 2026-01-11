#### 25.6.14.3 NDB File System Encryption Limitations

Transparent data encryption in NDB Cluster is subject to the following restrictions and limitations:

* The file system password must be supplied to each individual data node.

* File system password rotation requires an initial rolling restart of the data nodes; this must be performed manually, or by an application external to `NDB`).

* For a cluster with only a single replica (`NoOfReplicas = 1`), a full backup and restore is required for file system password rotation.

* Rotation of all data encryption keys requires an initial node restart.

**NDB TDE and NDB Replication.** The use of an encrypted filesystem does not have any effect on NDB Replication. All of the following scenarios are supported:

* Replication of an NDB Cluster having an encrypted file system to an NDB Cluster whose file system is not encrypted.

* Replication of an NDB Cluster whose file system is not encrypted to an NDB Cluster whose file system is encrypted.

* Replication of an NDB Cluster whose file system is encrypted to a standalone MySQL server using `InnoDB` tables which are not encrypted.

* Replication of an NDB Cluster with an unencrypted file system to a standalone MySQL server using `InnoDB` tables with file sytem encryption.
