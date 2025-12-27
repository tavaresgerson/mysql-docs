#### 21.2.7.2 Limits and Differences of NDB Cluster from Standard MySQL Limits

In this section, we list limits found in NDB Cluster that either differ from limits found in, or that are not found in, standard MySQL.

**Memory usage and recovery.** Memory consumed when data is inserted into an [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") table is not automatically recovered when deleted, as it is with other storage engines. Instead, the following rules hold true:

* A [`DELETE`](delete.html "13.2.2 DELETE Statement") statement on an [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") table makes the memory formerly used by the deleted rows available for re-use by inserts on the same table only. However, this memory can be made available for general re-use by performing [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement").

  A rolling restart of the cluster also frees any memory used by deleted rows. See [Section 21.6.5, “Performing a Rolling Restart of an NDB Cluster”](mysql-cluster-rolling-restart.html "21.6.5 Performing a Rolling Restart of an NDB Cluster").

* A [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement") or [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") operation on an [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") table frees the memory that was used by this table for re-use by any [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") table, either by the same table or by another [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") table.

  Note

  Recall that [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") drops and re-creates the table. See [Section 13.1.34, “TRUNCATE TABLE Statement”](truncate-table.html "13.1.34 TRUNCATE TABLE Statement").

* **Limits imposed by the cluster's configuration.** A number of hard limits exist which are configurable, but available main memory in the cluster sets limits. See the complete list of configuration parameters in [Section 21.4.3, “NDB Cluster Configuration Files”](mysql-cluster-config-file.html "21.4.3 NDB Cluster Configuration Files"). Most configuration parameters can be upgraded online. These hard limits include:

  + Database memory size and index memory size ([`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) and [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory), respectively).

    [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) is allocated as 32KB pages. As each [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) page is used, it is assigned to a specific table; once allocated, this memory cannot be freed except by dropping the table.

    See [Section 21.4.3.6, “Defining NDB Cluster Data Nodes”](mysql-cluster-ndbd-definition.html "21.4.3.6 Defining NDB Cluster Data Nodes"), for more information.

  + The maximum number of operations that can be performed per transaction is set using the configuration parameters [`MaxNoOfConcurrentOperations`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrentoperations) and [`MaxNoOfLocalOperations`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooflocaloperations).

    Note

    Bulk loading, [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement"), and [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") are handled as special cases by running multiple transactions, and so are not subject to this limitation.

  + Different limits related to tables and indexes. For example, the maximum number of ordered indexes in the cluster is determined by [`MaxNoOfOrderedIndexes`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooforderedindexes), and the maximum number of ordered indexes per table is 16.

* **Node and data object maximums.** The following limits apply to numbers of cluster nodes and metadata objects:

  + The maximum number of data nodes is 48.

    A data node must have a node ID in the range of 1 to 48, inclusive. (Management and API nodes may use node IDs in the range 1 to 255, inclusive.)

  + The total maximum number of nodes in an NDB Cluster is
    255. This number includes all SQL nodes (MySQL Servers), API nodes (applications accessing the cluster other than MySQL servers), data nodes, and management servers.

  + The maximum number of metadata objects in current versions of NDB Cluster is 20320. This limit is hard-coded.

  See [Previous NDB Cluster Issues Resolved in NDB Cluster 8.0](/doc/refman/8.0/en/mysql-cluster-limitations-resolved.html), for more information.
