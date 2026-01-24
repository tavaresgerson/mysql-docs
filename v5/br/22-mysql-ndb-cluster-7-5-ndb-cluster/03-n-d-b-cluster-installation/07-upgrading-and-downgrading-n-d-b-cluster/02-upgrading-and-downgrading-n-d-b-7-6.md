#### 21.3.7.2 Upgrading and Downgrading NDB 7.6

This section provides information about compatibility between different NDB Cluster 7.6 releases with regard to performing upgrades and downgrades as well as compatibility matrices and notes. Additional information can also be found here regarding downgrades from NDB 7.6 to previous NDB release series. You should already be familiar with installation and configuration of NDB Cluster prior to attempting an upgrade or downgrade. See [Section 21.4, “Configuration of NDB Cluster”](mysql-cluster-configuration.html "21.4 Configuration of NDB Cluster").

The table shown here provides information on NDB Cluster upgrade and downgrade compatibility among different releases of NDB 7.6. Additional notes about upgrades and downgrades to, from, or within the NDB Cluster 7.6 release series can be found following the table.

**Figure 21.6 NDB Cluster Upgrade and Downgrade Compatibility, MySQL NDB Cluster 7.6**

![Graphical representation of the upgrade/downgrade matrix contained in the file storage/ndb/src/common/util/version.cpp from the NDB 7.6 source tree.](images/mysql-cluster-upgrade-downgrade-7-6.png)

**Version support.** The following versions of NDB Cluster are supported for upgrades to GA releases of NDB Cluster 7.6 (7.6.6 and later):

* NDB Cluster 7.5 GA releases (7.5.4 and later)
* NDB Cluster 7.4 GA releases (7.4.4 and later)
* NDB Cluster 7.3 GA releases (7.3.2 and later)

**Known Issues When Upgrading or Downgrading NDB Cluster 7.6.** The following issues are known to occur when upgrading to, downgrading from, or between NDB 7.6 releases:

**Changes in Disk Data file format.** Due to changes in disk format, upgrading to or downgrading from either of the versions listed here requires an initial node restart of each data node:

* NDB 7.6.2
* NDB 7.6.4

To avoid problems relating to the old format, you should re-create any existing tablespaces and undo log file groups when upgrading. You can do this by performing an initial restart of each data node (that is, using the [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial) option) as part of the upgrade process.

If you are using Disk Data tables, a downgrade from *any* NDB 7.6 release to any NDB 7.5 or earlier release requires that you restart all data nodes with [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial) as part of the downgrade process. This is because NDB 7.5 and earlier release series are not able to read the new Disk Data file format.

**IndexMemory changes.** If you are downgrading from NDB 7.6 to NDB 7.5 (or earlier), you must set an explicit value for [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory) in the cluster configuration file if none is already present. This is because NDB 7.6 does not use this parameter and sets it to 0 by default, whereas it is required in NDB 7.5 and earlier releases, in which the cluster refuses to start with Invalid configuration received from Management Server... if `IndexMemory` is not set to a nonzero value.

Important

Upgrading to NDB 7.6 from an earlier release, or downgrading from NDB 7.6 to an earlier release, requires purging then re-creating the `NDB` data node file system, which means that each data node must be restarted using the [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial) option as part of the rolling restart or system restart normally required. (Starting a data node with no file system is already equivalent to an initial restart; in such cases, `--initial` is implied and not required. This is unchanged from previous releases of NDB Cluster.)

When such a restart is performed as part of an upgrade to NDB 7.6, any existing LCP files are checked for the presence of the LCP `Sysfile`, indicating that the existing data node file system was written using NDB 7.6. If such a node file system exists, but does not contain the `Sysfile`, and if any data nodes are restarted without the [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial) option, `NDB` causes the restart to fail with an appropriate error message.

You should also be aware that no such protection is possible when downgrading from NDB 7.6 to a release previous to NDB 7.6.
