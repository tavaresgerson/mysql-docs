### 21.3.7 Upgrading and Downgrading NDB Cluster

[21.3.7.1 Upgrading and Downgrading NDB 7.5](mysql-cluster-upgrade-downgrade-7-5.html)

[21.3.7.2 Upgrading and Downgrading NDB 7.6](mysql-cluster-upgrade-downgrade-7-6.html)

The following sections provide information about upgrading and downgrading NDB Cluster 7.5 and 7.6.

Schema operations, including SQL DDL statements, cannot be performed while any data nodes are restarting, and thus during an online upgrade or downgrade of the cluster. For other information regarding the rolling restart procedure used to perform an online upgrade, see [Section 21.6.5, “Performing a Rolling Restart of an NDB Cluster”](mysql-cluster-rolling-restart.html "21.6.5 Performing a Rolling Restart of an NDB Cluster").

Important

Compatibility between release versions is taken into account only with regard to [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") in this section, and there are additional issues to be considered. See [Section 2.10, “Upgrading MySQL”](upgrading.html "2.10 Upgrading MySQL").

*As with any other MySQL software upgrade or downgrade, you are strongly encouraged to review the relevant portions of the MySQL Manual for the MySQL versions from which and to which you intend to migrate, before attempting an upgrade or downgrade of the NDB Cluster software*.
