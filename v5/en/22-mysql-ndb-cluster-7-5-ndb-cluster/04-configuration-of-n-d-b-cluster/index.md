## 21.4 Configuration of NDB Cluster

[21.4.1 Quick Test Setup of NDB Cluster](mysql-cluster-quick.html)

[21.4.2 Overview of NDB Cluster Configuration Parameters, Options, and Variables](mysql-cluster-configuration-overview.html)

[21.4.3 NDB Cluster Configuration Files](mysql-cluster-config-file.html)

[21.4.4 Using High-Speed Interconnects with NDB Cluster](mysql-cluster-interconnects.html)

A MySQL server that is part of an NDB Cluster differs in one chief respect from a normal (nonclustered) MySQL server, in that it employs the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine. This engine is also referred to sometimes as [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), although `NDB` is preferred.

To avoid unnecessary allocation of resources, the server is configured by default with the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine disabled. To enable [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), you must modify the server's `my.cnf` configuration file, or start the server with the [`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster) option.

This MySQL server is a part of the cluster, so it also must know how to access a management node to obtain the cluster configuration data. The default behavior is to look for the management node on `localhost`. However, should you need to specify that its location is elsewhere, this can be done in `my.cnf`, or with the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client. Before the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine can be used, at least one management node must be operational, as well as any desired data nodes.

For more information about [`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster) and other [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") options specific to NDB Cluster, see [Section 21.4.3.9.1, “MySQL Server Options for NDB Cluster”](mysql-cluster-options-variables.html#mysql-cluster-program-options-mysqld "21.4.3.9.1 MySQL Server Options for NDB Cluster").

For general information about installing NDB Cluster, see [Section 21.3, “NDB Cluster Installation”](mysql-cluster-installation.html "21.3 NDB Cluster Installation").
