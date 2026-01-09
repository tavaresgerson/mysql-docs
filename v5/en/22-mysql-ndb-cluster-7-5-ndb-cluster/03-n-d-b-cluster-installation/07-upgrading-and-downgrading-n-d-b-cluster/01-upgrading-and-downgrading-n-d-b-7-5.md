#### 21.3.7.1 Upgrading and Downgrading NDB 7.5

This section provides information about compatibility between different NDB Cluster 7.5 releases with regard to performing upgrades and downgrades as well as compatibility matrices and notes. Additional information can also be found here regarding downgrades from NDB 7.5 to previous NDB release series. You should already be familiar with installing and configuring NDB Cluster prior to attempting an upgrade or downgrade. See [Section 21.4, “Configuration of NDB Cluster”](mysql-cluster-configuration.html "21.4 Configuration of NDB Cluster").

The table shown here provides information on NDB Cluster upgrade and downgrade compatibility among different releases of NDB 7.5. Additional notes about upgrades and downgrades to, from, or within the NDB Cluster 7.5 release series can be found following the table.

**Figure 21.5 NDB Cluster Upgrade and Downgrade Compatibility, MySQL NDB Cluster 7.5**

![Graphical representation of the upgrade/downgrade matrix contained in the file storage/ndb/src/common/util/version.cpp from the NDB 7.5 source tree.](images/mysql-cluster-upgrade-downgrade-7-5.png)

**Version support.** The following versions of NDB Cluster are supported for upgrades to GA releases of NDB Cluster 7.5 (7.5.4 and later):

* NDB Cluster 7.4 GA releases (7.4.4 and later)
* NDB Cluster 7.3 GA releases (7.3.2 and later)

**Known Issues When Upgrading or Downgrading NDB Cluster 7.5.** The following issues are known to occur when upgrading to or between NDB 7.5 releases:

* When run with `--initialize`, the server does not require [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") support; having `NDB` enabled at this time can cause problems with [`ndbinfo`](mysql-cluster-ndbinfo.html "21.6.15 ndbinfo: The NDB Cluster Information Database") tables. To keep this from happening, the `--initialize` option now causes [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") to ignore the `--ndbcluster` option if the latter is also specified.

  A workaround for an upgrade that has failed for these reasons can be accomplished as follows:

  1. Perform a rolling restart of the entire cluster
  2. Delete all `.frm` files in the `data/ndbinfo` directory

  3. Run [**mysql_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables").

  (Bug #81689, Bug #82724, Bug #24521927, Bug #23518923)

* During an online upgrade from an NDB Cluster 7.3 release to an NDB 7.4 (or later) release, the failures of several data nodes running the lower version during local checkpoints (LCPs), and just prior to upgrading these nodes, led to additional node failures following the upgrade. This was due to lingering elements of the `EMPTY_LCP` protocol initiated by the older nodes as part of an LCP-plus-restart sequence, and which is no longer used in NDB 7.4 and later due to LCP optimizations implemented in those versions. This issue was fixed in NDB 7.5.4. (Bug
  #23129433)

* In NDB 7.5 (and later), the `ndb_binlog_index` table uses the [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") storage engine. Use of the [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") storage engine for this table continues to be supported for backward compatibility.

  When upgrading a previous release to NDB 7.5 (or later), you can use the [`--force`](mysql-upgrade.html#option_mysql_upgrade_force) [`--upgrade-system-tables`](mysql-upgrade.html#option_mysql_upgrade_upgrade-system-tables) options with [**mysql_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables") so that it performs [`ALTER TABLE ... ENGINE=INNODB`](alter-table.html "13.1.8 ALTER TABLE Statement") on the `ndb_binlog_index` table.

  For more information, see [Section 21.7.4, “NDB Cluster Replication Schema and Tables”](mysql-cluster-replication-schema.html "21.7.4 NDB Cluster Replication Schema and Tables").
