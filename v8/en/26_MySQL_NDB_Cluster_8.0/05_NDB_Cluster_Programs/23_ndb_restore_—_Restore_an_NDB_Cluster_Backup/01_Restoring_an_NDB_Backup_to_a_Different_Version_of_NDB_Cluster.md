#### 25.5.23.1 Restoring an NDB Backup to a Different Version of NDB Cluster

The following two sections provide information about restoring
a native NDB backup to a different version of NDB Cluster from
the version in which the backup was taken.

In addition, you should consult
[Section 25.3.7, “Upgrading and Downgrading NDB Cluster”](mysql-cluster-upgrade-downgrade.html "25.3.7 Upgrading and Downgrading NDB Cluster"), for other
issues you may encounter when attempting to restore an NDB
backup to a cluster running a different version of the NDB
software.

It is also advisable to review
[What is New in NDB Cluster 8.0](mysql-cluster-what-is-new.html#mysql-cluster-what-is-new-8-0 "What is New in NDB Cluster 8.0"), as well as
[Section 3.5, “Changes in MySQL 8.0”](upgrading-from-previous-series.html "3.5 Changes in MySQL 8.0"), for other
changes between NDB 8.0 and previous versions of NDB Cluster
that may be relevant to your particular circumstances.

##### 25.5.23.1.1 Restoring an NDB backup to a previous version of NDB Cluster

You may encounter issues when restoring a backup taken from
a later version of NDB Cluster to a previous one, due to the
use of features which do not exist in the earlier version.
Some of these issues are listed here:

* **utf8mb4\_ai\_ci character set.**
  Tables created in NDB 8.0 by default use the
  `utf8mb4_ai_ci` character set, which
  is not available in NDB 7.6 and earlier, and so cannot
  be read by an [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup") binary
  from one of these earlier versions. In such cases, it
  is necessary to alter any tables using
  `utf8mb4_ai_ci` so that they use a
  character set supported in the older version prior to
  performing the backup.

* **Table metadata format.**
  Due to changes in how the MySQL Server and NDB handle
  table metadata, tables created or altered using the
  included MySQL server binary from NDB 8.0 cannot be
  restored using [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup") to NDB
  7.6 or an earlier version of NDB Cluster. Such tables
  use `.sdi` files which are not
  understood by older versions of
  [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server").

  A backup taken in NDB 8.0 of tables which were created
  in NDB 7.6 or earlier, and which have not been altered
  since upgrading to NDB 8.0, should be restorable to
  older versions of NDB Cluster.

  Since it is possible to restore metadata and table data
  separately, you can in such cases restore the table
  schemas from a dump made using
  [**mysqldump**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program"), or by executing the
  necessary [`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement")
  statements manually, then import only the table data
  using [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup") with the
  [`--restore-data`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_restore-data)
  option.

* **Multi-threaded backups.**
  Multi-threaded backups taken in NDB 8.0 can be
  restored to an cluster running an earlier version of
  `NDB` in either of the following two
  ways:

  + Using an [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup") binary from
    NDB 8.0, perform a parallel restore. See
    [Section 25.5.23.3.1, “Restoring a parallel backup in parallel”](ndb-restore-parallel-data-node-backup.html#ndb-restore-parallel-backup-in-parallel "25.5.23.3.1 Restoring a parallel backup in parallel").

  + Restore the backups serially; in this case, a later
    version of [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup") is not
    required. See
    [Section 25.5.23.3.2, “Restoring a parallel backup serially”](ndb-restore-parallel-data-node-backup.html#ndb-restore-parallel-backup-serial "25.5.23.3.2 Restoring a parallel backup serially").

* **Encrypted backups.**
  Encrypted backups created in NDB 8.0.22 and later
  cannot be restored using
  [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup") from NDB 8.0.21 or
  earlier.

* **NDB\_STORED\_USER privilege.**
  The [`NDB_STORED_USER`](privileges-provided.html#priv_ndb-stored-user)
  privilege is supported only in NDB 8.0.

* **Maximum number of data nodes.**
  NDB Cluster 8.0 supports up to 144 data nodes, while
  earlier versions support a maximum of only 48 data
  nodes. See
  [Section 25.5.23.2.1, “Restoring to Fewer Nodes Than the Original”](ndb-restore-different-number-nodes.html#ndb-restore-to-fewer-nodes "25.5.23.2.1 Restoring to Fewer Nodes Than the Original"), for
  information with situations in which this
  incompatibility causes an issue.

##### 25.5.23.1.2 Restoring an NDB backup to a later version of NDB Cluster

In general, it should be possible to restore a backup
created using the [**ndb\_mgm**](mysql-cluster-programs-ndb-mgm.html "25.5.5 ndb_mgm — The NDB Cluster Management Client") client
[`START BACKUP`](mysql-cluster-backup-using-management-client.html "25.6.8.2 Using The NDB Cluster Management Client to Create a Backup") command in
an older version of NDB to a newer version, provided that
you use the [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup") binary that comes
with the newer version. (It may be possible to use the older
version of [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup"), but this is not
recommended.) Additional potential issues are listed here:

* When restoring the metadata from a backup
  ([`--restore-meta`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_restore-meta)
  option), [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup") normally
  attempts to reproduce the captured table schema exactly
  as it was when the backup was taken.

  Tables created in versions of NDB prior to 8.0 use
  `.frm` files for their metadata.
  These files can be read by the [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server")
  in NDB 8.0, which can use the information contained
  therein to create the `.sdi` files
  used by the MySQL data dictionary in later versions.

* When restoring an older backup to a newer version of
  NDB, it may not be possible to take advantage of newer
  features such as hashmap partitioning, greater number of
  hashmap buckets, read backup, and different partitioning
  layouts. For this reason, it may be preferable to
  restore older schemas using [**mysqldump**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program")
  and the [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") client, which allows
  NDB to make use of the new schema features.

* Tables using the old temporal types which did not
  support fractional seconds (used prior to MySQL 5.6.4
  and NDB 7.3.31) cannot be restored to NDB 8.0 using
  [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup"). You can check such
  tables using [`CHECK TABLE`](check-table.html "15.7.3.2 CHECK TABLE Statement"),
  and then upgrade them to the newer temporal column
  format, if necessary, using [`REPAIR
  TABLE`](repair-table.html "15.7.3.5 REPAIR TABLE Statement") in the [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") client;
  this must be done prior to taking the backup. See
  [Section 3.6, “Preparing Your Installation for Upgrade”](upgrade-prerequisites.html "3.6 Preparing Your Installation for Upgrade"), for more
  information.

  You also restore such tables using a dump created with
  [**mysqldump**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program").

* Distributed grant tables created in NDB 7.6 and earlier
  are not supported in NDB 8.0. Such tables can be
  restored to an NDB 8.0 cluster, but they have no effect
  on access control.