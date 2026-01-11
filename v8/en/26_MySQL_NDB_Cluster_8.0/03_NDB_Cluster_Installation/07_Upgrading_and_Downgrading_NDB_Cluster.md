### 25.3.7 Upgrading and Downgrading NDB Cluster

* Versions Supported for Upgrade to NDB 8.0
* Reverting an NDB Cluster 8.0 Upgrade
* Known Issues When Upgrading or Downgrading NDB Cluster

This section provides information about NDB Cluster software and compatibility between different NDB Cluster 8.0 releases with regard to performing upgrades and downgrades. You should already be familiar with installing and configuring NDB Cluster prior to attempting an upgrade or downgrade. See Section 25.4, “Configuration of NDB Cluster”.

Important

Online upgrades and downgrades between minor releases of the `NDB` storage engine are supported within NDB 8.0. In-place upgrades of the included MySQL Server (SQL node **mysqld**) are also supported; with multiple SQL nodes, it is possible to keep an SQL application online while individual **mysqld** processes are restarted. In-place downgrades of the included MySQL Server are *not* supported (see Chapter 4, *Downgrading MySQL*).

It may be possible in some cases to revert a recent upgrade from one NDB 8.0 minor release version to a later one, and to restore the needed states of any MySQL Server instances running as SQL nodes. Against the event that this becomes desirable or necessary, you are strongly advised to take a complete backup of each SQL node prior to upgrading NDB Cluster. For the same reason, you should also start the **mysqld** binaries from the new version with `--ndb-schema-dist-upgrade-allowed=0`, and not allow it to be set back to 1 until you are sure any likelihood of reverting to an older version is past. For more information, see Reverting an NDB Cluster 8.0 Upgrade.

For information about upgrades to NDB 8.0 from versions previous to 8.0, see Versions Supported for Upgrade to NDB 8.0.

For information about known issues and problems encountered when upgrading or downgrading NDB 8.0, see Known Issues When Upgrading or Downgrading NDB Cluster.

#### Versions Supported for Upgrade to NDB 8.0

The following versions of NDB Cluster are supported for upgrades to GA releases of NDB Cluster 8.0 (8.0.19 and later):

* NDB Cluster 7.6: NDB 7.6.4 and later
* NDB Cluster 7.5: NDB 7.5.4 and later
* NDB Cluster 7.4: NDB 7.4.6 and later

To upgrade from a release series previous to NDB 7.4, you must upgrade in stages, first to one of the versions just listed, and then from that version to the latest NDB 8.0 release. In such cases, upgrading to the latest NDB 7.6 release is recommended as the first step. For information about upgrades to NDB 7.6 from previous versions, see Upgrading and Downgrading NDB 7.6.

#### Reverting an NDB Cluster 8.0 Upgrade

Following a recent software upgrade of an NDB Cluster to an NDB 8.0 release, it is possible to revert the `NDB` software back to the earlier version, provided certain conditions are met before the upgrade, during the time the cluster is running the newer version, and after the NDB Cluster software is reverted to the earlier version. Specifics depend on local conditions; this section provides general information about what should be done at each of the points in the upgrade and rollback process just described.

In most cases, upgrading and downgrading the data nodes can be done without issue, as described elsewhere; see Section 25.6.5, “Performing a Rolling Restart of an NDB Cluster”. (Prior to performing an upgrade or downgrade, you should perform an `NDB` backup; see Section 25.6.8, “Online Backup of NDB Cluster”, for information about how to do this.) Downgrading SQL nodes online is not supported, due to the following issues:

* **mysqld** from a version 8.0 release cannot start if it detects a file system from a later version of MySQL.

* In many cases, **mysqld** cannot open tables that were created or modified by a later version of MySQL.

* In most if not all cases, **mysqld** cannot read binary log files that were created or modified in a later version of MySQL.

The procedure outlined next provides the basic steps necessary to upgrade a cluster from version *`X`* to version *`Y`* while allowing for a possible future rollback to *`X`*. (The procedure for reverting the upgraded cluster to version *`X`* follows later in this section.) For this purpose, version *`X`* is any NDB 8.0 GA release, or any previous NDB release supported for upgrade to NDB 8.0 (see Versions Supported for Upgrade to NDB 8.0), and version *`Y`* is an NDB 8.0 release which is later than *`X`*.

* *Prior to upgrade*: Take backups of NDB *`X`* SQL node states. This can be accomplished as one or more of the following:

  + A copy of the version *`X`* SQL node file system in a quiescent state using one or more system tools such as **cp**, **rsync**, **fwbackups**, Amanda, and so forth.

    A dump of any version *`X`* tables not stored in `NDB`. You can generate this dump using **mysqldump**.

    A backup created using MySQL Enterprise Backup; see Section 32.1, “MySQL Enterprise Backup Overview”, for more information.

  Backing up the SQL nodes is recommended prior to any upgrade, whether or not you later intend to revert the cluster to the previous `NDB` version.

* *Upgrade to NDB *`Y`**: All NDB *`Y`* **mysqld** binaries must be started with `--ndb-schema-dist-upgrade-allowed=0` to prevent any automatic schema upgrade. (Once any possibility of a downgrade is past, you can safely change the corresponding system variable `ndb_schema_dist_upgrade_allowed` back to 1, the default, in the **mysql** client.) When each NDB *`Y`* SQL node starts, it connects to the cluster and synchronizes its `NDB` table schemas. After this, you can restore MySQL table and state data from backup.

  To assure continuity of NDB replication, it is necessary to upgrade the cluster's SQL nodes in such a way that at least one **mysqld** is acting as the replication source at any given point in time during the upgrade. With two SQL nodes *`A`* and *`B`*, you can do so like this:

  1. While using SQL node *`B`* as the replication channel, upgrade SQL node *`A`* from NDB version *`X`* to version *`Y`*. This results in a gap in the binary log on *`A`* at epoch *`E1`*.

  2. After all replication appliers have consumed the binary log from SQL node *`B`* past epoch *`E1`*, switch the replication channel to use SQL node *`A`*.

  3. Upgrade SQL node *`B`* to NDB version *`Y`*. This results in a gap in the binary log on *`B`* at epoch *`E2`*.

  4. After all replication appliers have consumed the binary log from SQL node *`A`* past epoch *`E2`*, you can once again switch the replication channel to use either SQL node as desired.

  Do not use `ALTER TABLE` on any existing `NDB` tables; do not create any new `NDB` tables which cannot be safely dropped prior to downgrading.

The following procedure shows the basic steps needed to roll back (revert) an NDB Cluster from version *`X`* to version *`Y`* after an upgrade performed as just described. Here, version *`X`* is any NDB 8.0 GA release, or any previous NDB release supported for upgrade to NDB 8.0 (see Versions Supported for Upgrade to NDB 8.0); version *`Y`* is an NDB 8.0 release which is later than *`X`*.

* *Prior to rollback*: Gather any **mysqld** state information from the NDB *`Y`* SQL nodes that should be retained. In most cases, you can do this using **mysqldump**.

  After backing up the state data, drop all `NDB` tables which have been created or altered since the upgrade took place.

  Backing up the SQL nodes is always recommended prior to any NDB Cluster software version change.

  You must provide a file system compatible with MySQL *`X`* for each **mysqld** (SQL node). You can use either of the following two methods:

  + Create a new, compatible file system state by reinitializing the on-disk state of the version *`X`* SQL node. You can do this by removing the SQL node file system, then running **mysqld** `--initialize`.

  + Restore a file system that is compatible from a backup taken prior to the upgrade (see Section 9.4, “Using mysqldump for Backups”).

* *Following `NDB` downgrade*: After downgrading the data nodes to NDB *`X`*, start the version *`X`* SQL nodes (instances of **mysqld**). Restore or repair any other local state information needed on each SQL node. The MySQLD state can be aligned as necessary with some combination (0 or more) of the following actions:

  + Initialization commands such as **mysqld** `--initialize`.

  + Restore any desired or required state information captured from the version *`X`* SQL node.

  + Restore any desired or required state information captured from the version *`Y`* SQL node.

  + Perform cleanup such as deleting stale logs such as binary logs, or relay logs, and removing any time-dependent state which is no longer valid.

  As when upgrading, it is necessary when downgrading to maintain continuity of NDB replication to downgrade the cluster's SQL nodes in such a way that at least one **mysqld** is acting as the replication source at any given point in time during the downgrade process. This can be done in a manner very similar to that described previously for upgrading the SQL nodes. With two SQL nodes *`A`* and *`B`*, you can maintain binary logging without any gaps during the downgrade like this:

  1. With SQL node *`B`* acting as the replication channel, downgrade SQL node *`A`* from NDB version *`Y`* to version *`X`*. This results in a gap in the binary log on *`A`* at epoch *`F1`*.

  2. After all replication appliers have consumed the binary log from SQL node *`B`* past epoch *`F1`*, switch the replication channel to use SQL node *`A`*.

  3. Downgrade SQL node *`B`* to NDB version *`X`*. This results in a gap in the binary log on *`B`* at epoch *`F2`*.

  4. After all replication appliers have consumed the binary log from SQL node *`A`* past epoch *`F2`*, redundancy of binary logging is restored, and you can again use either SQL node as the replication channel as desired.

  See also Section 25.7.7, “Using Two Replication Channels for NDB Cluster Replication”.

#### Known Issues When Upgrading or Downgrading NDB Cluster

In this section, provide information about issues known to occur when upgrading or downgrading to, from, or between NDB 8.0 releases.

We recommend that you not attempt any schema changes during any NDB Cluster software upgrade or downgrade. Some of the reasons for this are listed here:

* DDL statements on `NDB` tables are not possible during some phases of data node startup.

* DDL statements on `NDB` tables may be rejected if any data nodes are stopped during execution; stopping each data node binary (so it can be replaced with a binary from the target version) is required as part of the upgrade or downgrade process.

* DDL statements on `NDB` tables are not allowed while there are data nodes in the same cluster running different release versions of the NDB Cluster software.

For additional information regarding the rolling restart procedure used to perform an online upgrade or downgrade of the data nodes, see Section 25.6.5, “Performing a Rolling Restart of an NDB Cluster”.

You should be aware of the issues in the following list when you perform an online upgrade between minor versions of NDB 8.0. These issues also apply when upgrading from a previous major version of NDB Cluster to any of the NDB 8.0 releases stated.

* NDB 8.0.22 adds support for IPv6 addressing for management nodes and data nodes in the `config.ini` file. To begin using IPv6 addresses as part of an upgrade, perform the following steps:

  1. Perform an upgrade of the cluster to version 8.0.22 or a later version of the NDB Cluster software in the usual manner.

  2. Change the addresses used in the `config.ini` file to IPv6 addresses.

  3. Perform a system restart of the cluster.

  A known issue on Linux platforms when running NDB 8.0.22 and later was that the operating system kernel was required to provide IPv6 support, even when no IPv6 addresses were in use. This issue is fixed in NDB 8.0.34 and later (Bug
  #33324817, Bug #33870642).

  If you are using an affected version and wish to disable support for IPv6 on the system (because you do not plan to use any IPv6 addresses for NDB Cluster nodes), do so after booting the system, like this:

  ```
  $> sysctl -w net.ipv6.conf.all.disable_ipv6=1
  $> sysctl -w net.ipv6.conf.default.disable_ipv6=1
  ```

  (Alternatively, you can add the corresponding lines to `/etc/sysctl.conf`.) In NDB Cluster 8.0.34 and later, the preceding is not necessary, and you can simply disable IPv6 support in the Linux kernel if you do not want or need it.

* Due to changes in the internal `mysql.ndb_schema` table, if you upgrade to an NDB 8.0 release prior to 8.0.24, then you are advised to use `--ndb-schema-dist-upgrade-allowed = 0` to avoid unexpected outages (Bug #30876990, Bug
  #31016905).

  In addition, if there is any possibility that you may revert to a previous version of NDB Cluster following an upgrade to a newer version, you must start all **mysqld** processes from the newer version with `--ndb-schema-dist-upgrade-allowed = 0` to prevent changes incompatible with the older version from being made to the `ndb_schema` table. See Reverting an NDB Cluster 8.0 Upgrade, for information about how to do this.

* The `EncryptedFileSystem` configuration parameter, introduced in NDB 8.0.29, could in some cases cause undo log files to be encrypted, even when set explicitly to `0`, which could lead to issues when using Disk Data tables and attempting to upgrade or downgrade to NDB 8.0.29. In such cases, you can work around the problem by performing initial restarts of the data nodes as part of the rolling restart process.

* If you are using multithreaded data nodes (**ndbmtd**")) and the `ThreadConfig` configuration parameter, you may need to make changes in the value set for this in the `config.ini` file when upgrading from a previous release to NDB 8.0.30 or later. When upgrading from NDB 8.0.23 or earlier, any usage of `main`, `rep`, `recv`, or `ldm` threads that was implicit in the earlier version must be explicitly set. When upgrading from NDB 8.0.23 or later to NDB 8.0.30 or later, any usage of `recv` threads must be set explicitly in the `ThreadConfig` string. In addition, to avoid using `main`, `rep`, or `ldm` threads in NDB 8.0.30 or later, you must set the thread count for the given type to `0` explicitly.

  An example follows.

  *NDB 8.0.22 and earlier*:

  + `config.ini` file contains `ThreadConfig=ldm`.

  + This is interpreted by these versions of `NDB` as `ThreadConfig=main,ldm,recv,rep`.

  + Required in `config.ini` to match effect in NDB 8.0.30 or later: `ThreadConfig=main,ldm,recv,rep`.

  *NDB 8.0.23—8.0.29*:

  + `config.ini` file contains `ThreadConfig=ldm`.

  + This is interpreted by these versions of `NDB` as `ThreadConfig=ldm,recv`.

  + Required in `config.ini` to match effect in NDB 8.0.30 or later: `ThreadConfig=main={count=0},ldm,recv,rep={count=0}`.

  For more information, see the description of the `ThreadConfig` configuration parameter.

Upgrades from previous major versions of NDB Cluster (7.4, 7.5, 7.6) to NDB 8.0 are supported; see Versions Supported for Upgrade to NDB 8.0, for specific versions. Such upgrades are subject to the issues listed here:

* In NDB 8.0, the default value for `log_bin` is 1, a change from earlier releases. In addition, as of NDB 8.0.16, the default value for `ndb_log_bin` changed from 1 to 0, which means that `ndb_log_bin` must be set explicitly to 1 to enable binary logging in this and later versions.

* Distributed privileges shared between MySQL servers as implemented in prior release series (see Distributed Privileges Using Shared Grant Tables) are not supported in NDB Cluster 8.0. When started, the **mysqld** supplied with NDB 8.0 and later checks for the existence of any grant tables which use the `NDB` storage engine; if it finds any, it creates local copies (“shadow tables”) of these using `InnoDB`. This is true for each MySQL server connected to NDB Cluster. After this has been performed on all MySQL servers acting as NDB Cluster SQL nodes, the `NDB` grant tables may be safely removed using the **ndb_drop_table** utility supplied with the NDB Cluster distribution, like this:

  ```
  ndb_drop_table -d mysql user db columns_priv tables_priv proxies_priv procs_priv
  ```

  It is safe to retain the `NDB` grant tables, but they are not used for access control and are effectively ignored.

  For more information about the MySQL privileges system used in NDB 8.0, see Section 25.6.13, “Privilege Synchronization and NDB_STORED_USER”, as well as Section 8.2.3, “Grant Tables”.

* It is necessary to restart all data nodes with `--initial` when upgrading any release prior to NDB 7.6 to any NDB 8.0 release. This is due to the addition of support for increased numbers of nodes in NDB 8.0.

Issues encountered when trying to downgrade from NDB 8.0 to a previous major version can be found in the following list:

* Tables created in NDB 8.0 are not backwards compatible with NDB 7.6 and earlier releases due to a change in usage of the extra metadata property implemented by `NDB` tables to provide full support for the MySQL data dictionary. This means that it is necessary to take extra steps to preserve any desired state information from the cluster's SQL nodes prior to the downgrade, and then to restore it afterwards.

  More specifically, online downgrades of the `NDBCLUSTER` storage engine—that is, of the data nodes—are supported, but SQL nodes cannot be downgraded online. This is because a MySQL Server (**mysqld**) of a given MySQL 8.0 or earlier version cannot use system files from a (later) 8.0 version, and cannot open tables that were created in the later version. It may be possible to roll back a cluster that has recently been upgraded from a previous NDB release; see Reverting an NDB Cluster 8.0 Upgrade, for information regarding when and how this can be done.

  For additional information relating to these issues, see Changes in NDB table extra metadata; see also Chapter 16, *MySQL Data Dictionary*.

* In NDB 8.0, the binary configuration file format has been enhanced to provide support for greater numbers of nodes than in previous versions. The new format is not accessible to nodes running older versions of `NDB`, although newer management servers can detect older nodes and communicate with them using the appropriate format.

  While upgrades to NDB 8.0 should not be problematic in this regard, older management servers cannot read the newer binary configuration file format, so that some manual intervention is required when downgrading from NDB 8.0 to a previous major version. When performing such a downgrade, it is necessary to remove any cached binary configuration files prior to starting the management using the older `NDB` software version, and to have the plaintext configuration file available for the management server to read. Alternatively, you can start the older management server using the `--initial` option (again, it is necessary to have the `config.ini` available). If the cluster uses multiple management servers, one of these two things must be done for each management server binary.

  Also in connection with support for increased numbers of nodes, and due to incompatible changes implemented in NDB 8.0 in the data node LCP `Sysfile`, it is necessary, when performing an online downgrade from NDB 8.0 to a prior major version, to restart all data nodes using the `--initial` option.

* Online downgrades of clusters running more than 48 data nodes, or with data nodes using node IDs greater than 48, to earlier NDB Cluster releases from NDB 8.0 are not supported. It is necessary in such cases to reduce the number of data nodes, to change the configurations for all data nodes such that they use node IDs less than or equal to 48, or both, as required not to exceed the old maximums.

* If you are downgrading from NDB 8.0 to NDB 7.5 or NDB 7.4, you must set an explicit value for `IndexMemory` in the cluster configuration file if none is already present. This is because NDB 8.0 does not use this parameter (which was removed in NDB 7.6) and sets it to 0 by default, whereas it is required in NDB 7.5 and NDB 7.4, in both of which the cluster refuses to start with Invalid configuration received from Management Server... if `IndexMemory` is not set to a nonzero value.

  Setting `IndexMemory` is *not* required for downgrades from NDB 8.0 to NDB 7.6.
