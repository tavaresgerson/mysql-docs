#### 21.2.7.6 Unsupported or Missing Features in NDB Cluster

A number of features supported by other storage engines are not supported for [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables. Trying to use any of these features in NDB Cluster does not cause errors in or of itself; however, errors may occur in applications that expects the features to be supported or enforced. Statements referencing such features, even if effectively ignored by `NDB`, must be syntactically and otherwise valid.

* **Index prefixes.** Prefixes on indexes are not supported for `NDB` tables. If a prefix is used as part of an index specification in a statement such as [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement"), [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"), or [`CREATE INDEX`](create-index.html "13.1.14 CREATE INDEX Statement"), the prefix is not created by `NDB`.

  A statement containing an index prefix, and creating or modifying an `NDB` table, must still be syntactically valid. For example, the following statement always fails with Error 1089 Incorrect prefix key; the used key part isn't a string, the used length is longer than the key part, or the storage engine does not support unique prefix keys, regardless of storage engine:

  ```sql
  CREATE TABLE t1 (
      c1 INT NOT NULL,
      c2 VARCHAR(100),
      INDEX i1 (c2(500))
  );
  ```

  This happens on account of the SQL syntax rule that no index may have a prefix larger than itself.

* **Savepoints and rollbacks.** Savepoints and rollbacks to savepoints are ignored as in [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine").

* **Durability of commits.** There are no durable commits on disk. Commits are replicated, but there is no guarantee that logs are flushed to disk on commit.

* **Replication.** Statement-based replication is not supported. Use [`--binlog-format=ROW`](replication-options-binary-log.html#sysvar_binlog_format) (or [`--binlog-format=MIXED`](replication-options-binary-log.html#sysvar_binlog_format)) when setting up cluster replication. See [Section 21.7, “NDB Cluster Replication”](mysql-cluster-replication.html "21.7 NDB Cluster Replication"), for more information.

  Replication using global transaction identifiers (GTIDs) is not compatible with NDB Cluster, and is not supported in NDB Cluster 7.5 or NDB CLuster 7.6. Do not enable GTIDs when using the `NDB` storage engine, as this is very likely to cause problems up to and including failure of NDB Cluster Replication.

  Semisynchronous replication is not supported in NDB Cluster.

  When replicating between clusters, it is possible to use IPv6 addresses between SQL nodes in different clusters, but all connections within a given cluster must use IPv4 addressing. For more information, see [NDB Cluster Replication and IPv6](mysql-cluster-replication-issues.html#mysql-cluster-replication-ipv6 "NDB Cluster Replication and IPv6").

* **Generated columns.** The `NDB` storage engine does not support indexes on virtual generated columns.

  As with other storage engines, you can create an index on a stored generated column, but you should bear in mind that `NDB` uses [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) for storage of the generated column as well as [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory) for the index. See [JSON columns and indirect indexing in NDB Cluster](create-table-secondary-indexes.html#json-column-indirect-index-mysql-cluster "JSON columns and indirect indexing in NDB Cluster"), for an example.

  NDB Cluster writes changes in stored generated columns to the binary log, but does log not those made to virtual columns. This should not effect NDB Cluster Replication or replication between `NDB` and other MySQL storage engines.

Note

See [Section 21.2.7.3, “Limits Relating to Transaction Handling in NDB Cluster”](mysql-cluster-limitations-transactions.html "21.2.7.3 Limits Relating to Transaction Handling in NDB Cluster"), for more information relating to limitations on transaction handling in [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6").
