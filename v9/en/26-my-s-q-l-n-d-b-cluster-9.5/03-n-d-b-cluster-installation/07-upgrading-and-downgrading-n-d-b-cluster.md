### 25.3.7 Upgrading and Downgrading NDB Cluster

* Versions Supported for Upgrade to NDB 9.5
* Known Issues When Upgrading or Downgrading NDB Cluster

This section provides information about NDB Cluster software and compatibility between different NDB Cluster releases with regard to performing upgrades and downgrades. You should already be familiar with installing and configuring NDB Cluster prior to attempting an upgrade or downgrade. See Section 25.4, “Configuration of NDB Cluster”.

For information about upgrades to NDB 9.5 from previous versions, see Versions Supported for Upgrade to NDB 9.5.

For information about known issues and problems encountered when upgrading or downgrading NDB 9.5, see Known Issues When Upgrading or Downgrading NDB Cluster.

#### Versions Supported for Upgrade to NDB 9.5

The following versions of NDB Cluster are supported for upgrades to NDB Cluster 9.5:

* NDB Cluster 8.0: NDB 8.0.19 and later
* NDB Cluster 8.1 (8.1.0)
* NDB Cluster 8.2 (8.2.0)
* NDB Cluster 8.3 (8.3.0)

#### Known Issues When Upgrading or Downgrading NDB Cluster

In this section, provide information about issues known to occur when upgrading or downgrading to or from NDB 9.5.

We recommend that you not attempt any schema changes during any NDB Cluster software upgrade or downgrade. Some of the reasons for this are listed here:

* DDL statements on `NDB` tables are not possible during some phases of data node startup.

* DDL statements on `NDB` tables may be rejected if any data nodes are stopped during execution; stopping each data node binary (so it can be replaced with a binary from the target version) is required as part of the upgrade or downgrade process.

* DDL statements on `NDB` tables are not allowed while there are data nodes in the same cluster running different release versions of the NDB Cluster software.

For additional information regarding the rolling restart procedure used to perform an online upgrade or downgrade of the data nodes, see Section 25.6.5, “Performing a Rolling Restart of an NDB Cluster”.
