## 25.4 Configuration of NDB Cluster

25.4.1 Quick Test Setup of NDB Cluster

25.4.2 Overview of NDB Cluster Configuration Parameters, Options, and Variables

25.4.3 NDB Cluster Configuration Files

25.4.4 Using High-Speed Interconnects with NDB Cluster

A MySQL server that is part of an NDB Cluster differs in one chief respect from a normal (nonclustered) MySQL server, in that it employs the `NDB` storage engine. This engine is also referred to sometimes as `NDBCLUSTER`, although `NDB` is preferred.

To avoid unnecessary allocation of resources, the server is configured by default with the `NDB` storage engine disabled. To enable `NDB`, you must modify the server's `my.cnf` configuration file, or start the server with the `--ndbcluster` option.

This MySQL server is a part of the cluster, so it also must know how to access a management node to obtain the cluster configuration data. The default behavior is to look for the management node on `localhost`. However, should you need to specify that its location is elsewhere, this can be done in `my.cnf`, or with the **mysql** client. Before the `NDB` storage engine can be used, at least one management node must be operational, as well as any desired data nodes.

For more information about `--ndbcluster` and other **mysqld** options specific to NDB Cluster, see Section 25.4.3.9.1, “MySQL Server Options for NDB Cluster”.

For general information about installing NDB Cluster, see Section 25.3, “NDB Cluster Installation”.
