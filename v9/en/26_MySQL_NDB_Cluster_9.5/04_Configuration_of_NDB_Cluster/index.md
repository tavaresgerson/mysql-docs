## 25.4 Configuration of NDB Cluster

A MySQL server that is part of an NDB Cluster differs in one chief
respect from a normal (nonclustered) MySQL server, in that it
employs the [`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 9.5") storage engine. This
engine is also referred to sometimes as
[`NDBCLUSTER`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 9.5"), although
`NDB` is preferred.

To avoid unnecessary allocation of resources, the server is
configured by default with the [`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 9.5")
storage engine disabled. To enable [`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 9.5"),
you must modify the server's `my.cnf`
configuration file, or start the server with the
[`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster) option.

This MySQL server is a part of the cluster, so it also must know how
to access a management node to obtain the cluster configuration
data. The default behavior is to look for the management node on
`localhost`. However, should you need to specify
that its location is elsewhere, this can be done in
`my.cnf`, or with the [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client")
client. Before the [`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 9.5") storage engine
can be used, at least one management node must be operational, as
well as any desired data nodes.

For more information about
[`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster) and other
[**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") options specific to NDB Cluster, see
[Section 25.4.3.9.1, “MySQL Server Options for NDB Cluster”](mysql-cluster-options-variables.html#mysql-cluster-program-options-mysqld "25.4.3.9.1 MySQL Server Options for NDB Cluster").

For general information about installing NDB Cluster, see
[Section 25.3, “NDB Cluster Installation”](mysql-cluster-installation.html "25.3 NDB Cluster Installation").