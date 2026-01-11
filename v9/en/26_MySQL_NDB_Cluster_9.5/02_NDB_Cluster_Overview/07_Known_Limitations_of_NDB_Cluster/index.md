### 25.2.7 Known Limitations of NDB Cluster

25.2.7.1 Noncompliance with SQL Syntax in NDB Cluster

25.2.7.2 Limits and Differences of NDB Cluster from Standard MySQL Limits

25.2.7.3 Limits Relating to Transaction Handling in NDB Cluster

25.2.7.4 NDB Cluster Error Handling

25.2.7.5 Limits Associated with Database Objects in NDB Cluster

25.2.7.6 Unsupported or Missing Features in NDB Cluster

25.2.7.7 Limitations Relating to Performance in NDB Cluster

25.2.7.8 Issues Exclusive to NDB Cluster

25.2.7.9 Limitations Relating to NDB Cluster Disk Data Storage

25.2.7.10 Limitations Relating to Multiple NDB Cluster Nodes

In the sections that follow, we discuss known limitations in current releases of NDB Cluster as compared with the features available when using the `MyISAM` and `InnoDB` storage engines. If you check the “Cluster” category in the MySQL bugs database at <http://bugs.mysql.com>, you can find known bugs in the following categories under “MySQL Server:” in the MySQL bugs database at <http://bugs.mysql.com>, which we intend to correct in upcoming releases of NDB Cluster:

* NDB Cluster
* Cluster Direct API (NDBAPI)
* Cluster Disk Data
* Cluster Replication
* ClusterJ

This information is intended to be complete with respect to the conditions just set forth. You can report any discrepancies that you encounter to the MySQL bugs database using the instructions given in Section 1.6, “How to Report Bugs or Problems”. Any problem which we do not plan to fix in NDB Cluster 9.5, is added to the list.

Note

Limitations and other issues specific to NDB Cluster Replication are described in Section 25.7.3, “Known Issues in NDB Cluster Replication”.
