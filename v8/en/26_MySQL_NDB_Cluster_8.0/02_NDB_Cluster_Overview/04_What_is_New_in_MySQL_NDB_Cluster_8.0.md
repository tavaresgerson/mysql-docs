### 25.2.4 What is New in MySQL NDB Cluster 8.0

The following sections describe changes in the implementation of
MySQL NDB Cluster in NDB Cluster 8.0 through
8.0.44, as compared to earlier release series.

NDB Cluster 8.4 is also available for production; while NDB 8.0 is
still supported, we suggest that you use NDB 8.4 for new
deployments; for more information, see
[MySQL NDB Cluster 8.4](/doc/refman/8.4/en/mysql-cluster.html). NDB Cluster 9.3 is
available as a Development release for preview and testing of new
features currently under development; see
[What is New in NDB Cluster 9.4](/doc/refman/9.4/en/mysql-cluster-what-is-new.html#mysql-cluster-what-is-new-9-4).

NDB Cluster 7.6 (see
[What is New in NDB Cluster 7.6](/doc/refman/5.7/en/mysql-cluster-what-is-new-7-6.html)) is a
previous GA release which is still supported in production,
although we recommend that new deployments for production use
MySQL NDB Cluster 8.4. NDB Cluster 7.5, 7.4, and 7.3 were previous
GA releases which have reached their end of life, and are no
longer supported or maintained. We recommend that new deployments
for production use MySQL NDB Cluster 8.4.

#### What is New in NDB Cluster 8.0

Major changes and new features in NDB Cluster 8.0 which are likely
to be of interest are shown in the following list:

* **Compatibility enhancements.**
  The following changes reduce longstanding nonessential
  differences in `NDB` behavior as compared
  to that of other MySQL storage engines:

  + **Development in parallel with MySQL server.**
    Beginning with this release, MySQL NDB Cluster is being
    developed in parallel with the standard MySQL 8.0 server
    under a new unified release model with the following
    features:

    - NDB 8.0 is developed in, built from, and released with
      the MySQL 8.0 source code tree.

    - The numbering scheme for NDB Cluster 8.0 releases
      follows the scheme for MySQL 8.0.

    - Building the source with `NDB`
      support appends `-cluster` to the
      version string returned by [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client")
      `-V`, as shown here:

      ```
      $> mysql -V
      mysql  Ver 8.0.44-cluster for Linux on x86_64 (Source distribution)
      ```

      `NDB` binaries continue to display
      both the MySQL Server version and the
      `NDB` engine version, like this:

      ```
      $> ndb_mgm -V
      MySQL distrib mysql-8.0.44 ndb-8.0.44, for Linux (x86_64)
      ```

      In MySQL Cluster NDB 8.0, these two version numbers
      are always the same.

    To build the MySQL source with NDB Cluster support, use
    the CMake option [`-DWITH_NDB`](source-configuration-options.html#option_cmake_with_ndb)
    (NDB 8.0.31 and later; for earlier releases, use
    [`-DWITH_NDBCLUSTER`](source-configuration-options.html#option_cmake_with_ndbcluster) instead).

  + **Platform support notes.**
    NDB 8.0 makes the following changes in platform support:

    - `NDBCLUSTER` no longer supports
      32-bit platforms. Beginning with NDB 8.0.21, the NDB
      build process checks the system architecture and
      aborts if it is not a 64-bit platform.

    - It is now possible to build `NDB`
      from source for 64-bit `ARM` CPUs.
      Currently, this support is source-only, and we do not
      provide any precompiled binaries for this platform.

  + **Database and table names.**
    NDB 8.0 removes the previous 63-byte limit on
    identifiers for databases and tables. These identifiers
    can now use up to 64 bytes, as for such objects using
    other MySQL storage engines. See
    [Section 25.2.7.11, “Previous NDB Cluster Issues Resolved in NDB Cluster 8.0”](mysql-cluster-limitations-resolved.html "25.2.7.11 Previous NDB Cluster Issues Resolved in NDB Cluster 8.0").

  + **Generated names for foreign keys.**
    `NDB` now uses the pattern
    `tbl_name_fk_N`
    for naming internally generated foreign keys. This is
    similar to the pattern used by
    [`InnoDB`](innodb-storage-engine.html "Chapter 17 The InnoDB Storage Engine").

* **Schema and metadata distribution and synchronization.**
  NDB 8.0 makes use of the MySQL data dictionary to distribute
  schema information to SQL nodes joining a cluster and to
  synchronize new schema changes between existing SQL nodes.
  The following list describes individual enhancements
  relating to this integration work:

  + **Schema distribution enhancements.**
    The `NDB` schema distribution
    coordinator, which handles schema operations and tracks
    their progress, has been extended in NDB 8.0 to ensure
    that resources used during a schema operation are
    released at its conclusion. Previously, some of this
    work was done by the schema distribution client; this
    has been changed due to the fact that the client did not
    always have all needed state information, which could
    lead to resource leaks when the client decided to
    abandon the schema operation prior to completion and
    without informing the coordinator.

    To help fix this issue, schema operation timeout detection
    has been moved from the schema distribution client to the
    coordinator, providing the coordinator with an opportunity
    to clean up any resources used during the schema
    operation. The coordinator now checks ongoing schema
    operations for timeout at regular intervals, and marks
    participants that have not yet completed a given schema
    operation as failed when detecting timeout. It also
    provides suitable warnings whenever a schema operation
    timeout occurs. (It should be noted that, after such a
    timeout is detected, the schema operation itself
    continues.) Additional reporting is done by printing a
    list of active schema operations at regular intervals
    whenever one or more of these operations is ongoing.

    As an additional part of this work, a new
    [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") option
    [`--ndb-schema-dist-timeout`](mysql-cluster-options-variables.html#option_mysqld_ndb-schema-dist-timeout)
    makes it possible to set the length of time to wait until
    a schema operation is marked as having timed out.

  + **Disk data file distribution.**
    NDB Cluster 8.0.14, uses the MySQL data dictionary to
    make sure that disk data files and related constructs
    such as tablespaces and log file groups are correctly
    distributed between all connected SQL nodes.

  + **Schema synchronization of tablespace objects.**
    When a MySQL Server connects as an SQL node to an NDB
    cluster, it checks its data dictionary against the
    information found in the `NDB`
    dictionary.

    Previously, the only `NDB` objects
    synchronized on connection of a new SQL node were
    databases and tables; MySQL NDB Cluster 8.0 also
    implements schema synchronization of disk data objects
    including tablespaces and log file groups. Among other
    benefits, this eliminates the possibility of a mismatch
    between the MySQL data dictionary and the
    `NDB` dictionary following a native
    backup and restore, in which tablespaces and log file
    groups were restored to the `NDB`
    dictionary, but not to the MySQL Server's data
    dictionary.

    It is also no longer possible to issue a
    [`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement") statement that
    refers to a nonexistent tablespace. Such a statement now
    fails with an error.

  + **Database DDL synchronization enhancements.**
    Work done for NDB 8.0 insures that synchronization of
    databases by newly joined (or rejoined) SQL nodes with
    those on existing SQL nodes now makes proper use of the
    data dictionary so that any database-level operations
    ([`CREATE DATABASE`](create-database.html "15.1.12 CREATE DATABASE Statement"),
    [`ALTER DATABASE`](alter-database.html "15.1.2 ALTER DATABASE Statement"), or
    [`DROP DATABASE`](drop-database.html "15.1.24 DROP DATABASE Statement")) that may
    have been missed by this SQL node are now correctly
    duplicated on it when it connects (or reconnects) to the
    cluster.

    As part of the schema synchronization procedure performed
    when starting, an SQL node now compares all databases on
    the cluster's data nodes with those in its own data
    dictionary, and if any of these is found to be missing
    from the SQL node's data dictionary, the SQL Node
    installs it locally by executing a
    [`CREATE DATABASE`](create-database.html "15.1.12 CREATE DATABASE Statement") statement.
    A database thus created uses the default MySQL Server
    database properties (such as those as determined by
    [`character_set_database`](server-system-variables.html#sysvar_character_set_database)
    and [`collation_database`](server-system-variables.html#sysvar_collation_database))
    that are in effect on this SQL node at the time the
    statement is executed.

  + **NDB metadata change detection and synchronization.**
    NDB 8.0 implements a new mechanism for detection of
    updates to metadata for data objects such as tables,
    tablespaces, and log file groups with the MySQL data
    dictionary. This is done using a thread, the
    `NDB` metadata change monitor thread,
    which runs in the background and checks periodically for
    inconsistencies between the `NDB`
    dictionary and the MySQL data dictionary.

    The monitor performs metadata checks every 60 seconds by
    default. The polling interval can be adjusted by setting
    the value of the
    [`ndb_metadata_check_interval`](mysql-cluster-options-variables.html#sysvar_ndb_metadata_check_interval)
    system variable; polling can be disabled altogether by
    setting the
    [`ndb_metadata_check`](mysql-cluster-options-variables.html#sysvar_ndb_metadata_check) system
    variable to `OFF`. The status variable
    [`Ndb_metadata_detected_count`](mysql-cluster-options-variables.html#statvar_Ndb_metadata_detected_count)
    shows the number of times since [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server")
    was last started that inconsistencies have been detected.

    `NDB` ensures that `NDB`
    database, table, log file group, and tablespace objects
    submitted by the metadata change monitor thread during
    operations following startup are automatically checked for
    mismatches and synchronized by the `NDB`
    binlog thread.

    NDB 8.0 adds two status variables relating to automatic
    synchronization:
    [`Ndb_metadata_synced_count`](mysql-cluster-options-variables.html#statvar_Ndb_metadata_synced_count)
    shows the number of objects synchronized automatically;
    [`Ndb_metadata_excluded_count`](mysql-cluster-options-variables.html#statvar_Ndb_metadata_excluded_count)
    indicates the number of objects for which synchronization
    has failed (prior to NDB 8.0.22, this variable was named
    `Ndb_metadata_blacklist_size`). In
    addition, you can see which objects have been synchronized
    by inspecting the cluster log.

    Setting the
    [`ndb_metadata_sync`](mysql-cluster-options-variables.html#sysvar_ndb_metadata_sync) system
    variable to `true` overrides any settings
    that have been made for
    [`ndb_metadata_check_interval`](mysql-cluster-options-variables.html#sysvar_ndb_metadata_check_interval)
    and [`ndb_metadata_check`](mysql-cluster-options-variables.html#sysvar_ndb_metadata_check),
    causing the change monitor thread to begin continuous
    metadata change detection.

    In NDB 8.0.22 and later, setting
    `ndb_metadata_sync` to
    `true` clears the list of objects for
    which synchronization has failed previously, which means
    it is no longer necessary to discover individual tables or
    to re-trigger synchronization by reconnecting the SQL node
    to the cluster. In addition, setting this variable to
    `false` clears the list of objects
    waiting to be retried.

    Beginning with NDB 8.0.21, more detailed information about
    the current state of automatic synchronization than can be
    obtained from log messages or status variables is provided
    by two new tables added to the MySQL Performance Schema.
    The tables are listed here:

    - [`ndb_sync_pending_objects`](performance-schema-ndb-sync-pending-objects-table.html "29.12.12.1 The ndb_sync_pending_objects Table"):
      Contains information about database objects for which
      mismatches have been detected between the
      `NDB` dictionary and the MySQL data
      dictionary (and which have not been excluded from
      automatic synchronization).

    - [`ndb_sync_excluded_objects`](performance-schema-ndb-sync-excluded-objects-table.html "29.12.12.2 The ndb_sync_excluded_objects Table"):
      Contains information about `NDB`
      database objects which have been excluded because they
      cannot be synchronized between the
      `NDB` dictionary and the MySQL data
      dictionary, and thus require manual intervention.

    A row in one of these tables provides the database
    object's parent schema, name, and type. Types of
    objects include schemas, tablespaces, log file groups, and
    tables. (If the object is a log file group or tablespace,
    the parent schema is `NULL`.) In
    addition, the
    [`ndb_sync_excluded_objects`](performance-schema-ndb-sync-excluded-objects-table.html "29.12.12.2 The ndb_sync_excluded_objects Table")
    table shows the reason for which the object has been
    excluded.

    These tables are present only if
    `NDBCLUSTER` storage engine support is
    enabled. For more information about these tables, see
    [Section 29.12.12, “Performance Schema NDB Cluster Tables”](performance-schema-ndb-cluster-tables.html "29.12.12 Performance Schema NDB Cluster Tables").

  + **Changes in NDB table extra metadata.**
    The extra metadata property of an `NDB`
    table is used for storing serialized metadata from the
    MySQL data dictionary, rather than storing the binary
    representation of the table as in previous versions.
    (This was a `.frm` file, no longer
    used by the MySQL Server—see
    [Chapter 16, *MySQL Data Dictionary*](data-dictionary.html "Chapter 16 MySQL Data Dictionary").) As part of the work
    to support this change, the available size of the
    table's extra metadata has been increased. This
    means that `NDB` tables created in NDB
    Cluster 8.0 are not compatible with previous NDB Cluster
    releases. Tables created in previous releases can be
    used with NDB 8.0, but cannot be opened afterwards by an
    earlier version.

    This metadata is accessible using the NDB API methods
    [`getExtraMetadata()`](/doc/ndbapi/en/ndb-table.html#ndb-table-getextrametadata)
    and
    [`setExtraMetadata()`](/doc/ndbapi/en/ndb-table.html#ndb-table-setextrametadata).

    For more information, see
    [Section 25.3.7, “Upgrading and Downgrading NDB Cluster”](mysql-cluster-upgrade-downgrade.html "25.3.7 Upgrading and Downgrading NDB Cluster").

  + **On-the-fly upgrades of tables using .frm files.**
    A table created in NDB 7.6 and earlier contains metadata
    in the form of a compressed `.frm`
    file, which is no longer supported in MySQL 8.0. To
    facilitate online upgrades to NDB 8.0,
    `NDB` performs on-the-fly translation
    of this metadata and writes it into the MySQL
    Server's data dictionary, which enables the
    [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") in NDB Cluster 8.0 to work
    with the table without preventing subsequent use of the
    table by a previous version of the
    `NDB` software.

    Important

    Once a table's structure has been modified in NDB
    8.0, its metadata is stored using the data dictionary,
    and it can no longer be accessed by NDB 7.6 and earlier.

    This enhancement also makes it possible to restore an
    `NDB` backup made using an earlier
    version to a cluster running NDB 8.0 (or later).

  + **Metadata consistency check error logging.**
    As part of work previously done in NDB 8.0, the metadata
    check performed as part of auto-synchronization between
    the representation of an `NDB` table in
    the NDB dictionary and its counterpart in the MySQL data
    dictionary includes the table's name, storage
    engine, and internal ID. Beginning with NDB 8.0.23, the
    range of properties checked is expanded to include
    properties of the following data objects:

    - Columns
    - Indexes
    - Foreign keys

    In addition, details of any mismatches in metadata
    properties are now written to the MySQL server error log.
    The formats used for the error log messages differ
    slightly depending on whether the discrepancy is found on
    the table level or on the level of a column, index, or
    foreign key. The format for a log error resulting from a
    table-level property mismatch is shown here, where
    *`property`* is the property name,
    *`ndb_value`* is the property value
    as stored in the NDB dictionary, and
    *`mysqld_value`* is the value of
    the property as stored in the MySQL data dictionary:

    ```
    Diff in 'property' detected, 'ndb_value' != 'mysqld_value'
    ```

    For mismatches in properties of columns, indexes, and
    foreign keys, the format is as follows, where
    *`obj_type`* is one of
    `column`, `index`, or
    `foreign key`, and
    *`obj_name`* is the name of the
    object:

    ```
    Diff in obj_type 'obj_name.property' detected, 'ndb_value' != 'mysqld_value'
    ```

    Metadata checks are performed during automatic
    synchronization of `NDB` tables when they
    are installed in the data dictionary of any
    [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") acting as an SQL node in an NDB
    Cluster. If the [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") is
    debug-compiled, checks are also made whenever a
    [`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement") statement is
    executed, and whenever an `NDB` table is
    opened.

* **Synchronization of user privileges with NDB\_STORED\_USER.**
  A new mechanism for sharing and synchronizing users, roles,
  and privileges between SQL nodes is available in NDB 8.0,
  using the [`NDB_STORED_USER`](privileges-provided.html#priv_ndb-stored-user)
  privilege. Distributed privileges as implemented in NDB 7.6
  and earlier (see
  [Distributed Privileges Using Shared Grant Tables](/doc/refman/5.7/en/mysql-cluster-privilege-distribution.html))
  are no longer supported.

  Once a user account is created on an SQL node, the user and
  its privileges can be stored in `NDB` and
  thus shared between all SQL nodes in the cluster by issuing a
  [`GRANT`](grant.html "15.7.1.6 GRANT Statement") statement such as this
  one:

  ```
  GRANT NDB_STORED_USER ON *.* TO 'jon'@'localhost';
  ```

  `NDB_STORED_USER` always has global scope and
  must be granted using `ON *.*`. System
  reserved accounts such as
  `mysql.session@localhost` or
  `mysql.infoschema@localhost` cannot be
  assigned this privilege.

  Roles can also be shared between SQL nodes by issuing the
  appropriate `GRANT NDB_STORED_USER`
  statement. Assigning such a role to a user does not cause the
  user to be shared; the `NDB_STORED_USER`
  privilege must be granted to each user explicitly.

  A user or role having `NDB_STORED_USER`,
  along with its privileges, is shared with all SQL nodes as
  soon as they join a given NDB Cluster. It is possible to make
  such changes from any connected SQL node, but recommended
  practice is to do so from a designated SQL node only, since
  the order of execution of statements affecting privileges from
  different SQL nodes cannot be guaranteed to be the same on all
  SQL nodes.

  Prior to NDB 8.0.27, changes to the privileges of a user or
  role were synchronized immediately with all connected SQL
  nodes. Beginning with MySQL 8.0.27, an SQL node takes a global
  read lock when updating privileges, which keeps concurrent
  changes executed by multiple SQL nodes from causing a
  deadlock.

  **Implications for upgrades.**
  Due to changes in the MySQL server's privilege system
  (see [Section 8.2.3, “Grant Tables”](grant-tables.html "8.2.3 Grant Tables")), privilege tables using
  the `NDB` storage engine do not function
  correctly in NDB 8.0. It is safe but not necessary to retain
  such privilege tables created in NDB 7.6 or earlier, but
  they are no longer used for access control. In NDB 8.0, a
  [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") acting as an SQL node and
  detecting such tables in `NDB` writes a
  warning to the MySQL server log, and creates
  [`InnoDB`](innodb-storage-engine.html "Chapter 17 The InnoDB Storage Engine") shadow tables local to
  itself; such shadow tables are created on each MySQL server
  connected to the cluster. When performing an upgrade from
  NDB 7.6 or earlier, the privilege tables using
  `NDB` can be removed safely using
  [**ndb\_drop\_table**](mysql-cluster-programs-ndb-drop-table.html "25.5.11 ndb_drop_table — Drop an NDB Table") once all MySQL servers
  acting as SQL nodes have been upgraded (see
  [Section 25.3.7, “Upgrading and Downgrading NDB Cluster”](mysql-cluster-upgrade-downgrade.html "25.3.7 Upgrading and Downgrading NDB Cluster")).

  The [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup") utility's
  [`--restore-privilege-tables`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_restore-privilege-tables)
  option is deprecated but continues to be honored in NDB 8.0,
  and can still be used to restore distributed privilege tables
  present in a backup taken from a previous release of NDB
  Cluster to a cluster running NDB 8.0. These tables are handled
  as described in the preceding paragraph.

  Shared users and grants are stored in the
  `ndb_sql_metadata` table, which
  [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup") by default does not restore in
  NDB 8.0; you can specify the
  [`--include-stored-grants`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_include-stored-grants)
  option to cause it to do so.

  See [Section 25.6.13, “Privilege Synchronization and NDB\_STORED\_USER”](mysql-cluster-privilege-synchronization.html "25.6.13 Privilege Synchronization and NDB_STORED_USER"),
  for more information.

* **INFORMATION\_SCHEMA changes.**
  The following changes are made in the display of information
  regarding Disk Data files in the Information Schema
  [`FILES`](information-schema-files-table.html "28.3.15 The INFORMATION_SCHEMA FILES Table") table:

  + Tablespaces and log file groups are no longer represented
    in the `FILES` table. (These constructs
    are not actually files.)

  + Each data file is now represented by a single row in the
    `FILES` table. Each undo log file is also
    now represented in this table by one row only.
    (Previously, a row was displayed for each copy of each of
    these files on each data node.)

  In addition, [`INFORMATION_SCHEMA`](information-schema.html "Chapter 28 INFORMATION_SCHEMA Tables")
  tables are now populated with tablespace statistics for MySQL
  Cluster tables. (Bug #27167728)

* **Error information with ndb\_perror.**
  The deprecated `--ndb` option for
  [**perror**](perror.html "6.8.2 perror — Display MySQL Error Message Information") has been removed. Instead, use
  [**ndb\_perror**](mysql-cluster-programs-ndb-perror.html "25.5.16 ndb_perror — Obtain NDB Error Message Information") to obtain error message
  information from `NDB` error codes. (Bug
  #81704, Bug #81705, Bug #23523926, Bug #23523957)

* **Condition pushdown enhancements.**
  Previously, condition pushdown was limited to predicate
  terms referring to column values from the same table to
  which the condition was being pushed. In NDB 8.0, this
  restriction is removed such that column values from tables
  earlier in the query plan can also be referred to from
  pushed conditions. NDB 8.0 supports joins comparing column
  expressions, as well as comparisons between columns in the
  same table. Columns and column expressions to be compared
  must be of exactly the same type; this means they must also
  be of the same signedness, length, character set, precision,
  and scale, whenever these attributes apply. Conditions being
  pushed could not be part of pushed joins prior to NDB
  8.0.27, when this restriction is lifted.

  Pushing down larger parts of a condition allows more rows to
  be filtered out by the data nodes, thereby reducing the number
  of rows which [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") must handle during
  join processing. Another benefit of these enhancements is that
  filtering can be performed in parallel in the LDM threads,
  rather than in a single mysqld process on an SQL node; this
  has the potential to improve query performance significantly.

  Existing rules for type compatibility between column values
  being compared continue to apply (see
  [Section 10.2.1.5, “Engine Condition Pushdown Optimization”](engine-condition-pushdown-optimization.html "10.2.1.5 Engine Condition Pushdown Optimization")).

  **Pushdown of outer joins and semijoins.**
  Work done in NDB 8.0.20 allows many outer joins and
  semijoins, and not only those using a primary key or unique
  key lookup, to be pushed down to the data nodes (see
  [Section 10.2.1.5, “Engine Condition Pushdown Optimization”](engine-condition-pushdown-optimization.html "10.2.1.5 Engine Condition Pushdown Optimization")).

  Outer joins using scans which can now be pushed include those
  which meet the following conditions:

  + There are no unpushed conditions on the table
  + There are no unpushed conditions on other tables in the
    same join nest, or in upper join nests on which it depends

  + All other tables in the same join nest, or in upper join
    nests on which it depends, are also pushed

  A semijoin that uses an index scan can now be pushed if it
  meets the conditions just noted for a pushed outer join, and
  it uses the `firstMatch` strategy (see
  [Section 10.2.2.1, “Optimizing IN and EXISTS Subquery Predicates with Semijoin
  Transformations”](semijoins.html "10.2.2.1 Optimizing IN and EXISTS Subquery Predicates with Semijoin Transformations")).

  These additional improvements are made in NDB 8.0.21:

  + Antijoins produced by the MySQL Optimizer through the
    transformation of `NOT EXISTS` and
    `NOT IN` queries (see
    [Section 10.2.2.1, “Optimizing IN and EXISTS Subquery Predicates with Semijoin
    Transformations”](semijoins.html "10.2.2.1 Optimizing IN and EXISTS Subquery Predicates with Semijoin Transformations")) can be pushed down to the
    data nodes by `NDB`.

    This can be done when there is no unpushed condition on
    the table, and the query fulfills any other conditions
    which must be met for an outer join to be pushed down.

  + `NDB` attempts to identify and evaluate a
    non-dependent scalar subquery before trying to retrieve
    any rows from the table to which it is attached. When it
    can do so, the value obtained is used as part of a pushed
    condition, instead of using the subquery which provided
    the value.

  Beginning with NDB 8.0.27, conditions pushed as part of a
  pushed query can now refer to columns from ancestor tables
  within the same pushed query, subject to the following
  conditions:

  + Pushed conditions may include any of the comparison
    operators
    [`<`](comparison-operators.html#operator_less-than),
    [`<=`](comparison-operators.html#operator_less-than-or-equal),
    [`>`](comparison-operators.html#operator_greater-than),
    [`>=`](comparison-operators.html#operator_greater-than-or-equal),
    [`=`](comparison-operators.html#operator_equal), and
    [`<>`](comparison-operators.html#operator_not-equal).

  + Values being compared must be of the same type, including
    length, precision, and scale.

  + `NULL` handling is performed according to
    the comparison semantics specified by the ISO SQL
    standard; any comparison with `NULL`
    returns `NULL`.

  Consider the table created using the statement shown here:

  ```
  CREATE TABLE t (
      x INT PRIMARY KEY,
      y INT
  ) ENGINE=NDB;
  ```

  A query such as [`SELECT

  * FROM t AS m JOIN t AS n ON m.x >= n.y`](select.html "15.2.13 SELECT Statement") can now
  use the engine condition pushdown optimization to push down
  the condition column `y`.

  When a join cannot be pushed,
  [`EXPLAIN`](explain.html "15.8.2 EXPLAIN Statement") should provide the
  reason or reasons.

  See [Section 10.2.1.5, “Engine Condition Pushdown Optimization”](engine-condition-pushdown-optimization.html "10.2.1.5 Engine Condition Pushdown Optimization"),
  for more information.

  The NDB API methods
  [`branch_col_eq_param()`](/doc/ndbapi/en/ndb-ndbinterpretedcode.html#ndb-ndbinterpretedcode-branch-col-eq-param),
  [`branch_col_ne_param()`](/doc/ndbapi/en/ndb-ndbinterpretedcode.html#ndb-ndbinterpretedcode-branch-col-ne-param),
  [`branch_col_lt_param()`](/doc/ndbapi/en/ndb-ndbinterpretedcode.html#ndb-ndbinterpretedcode-branch-col-lt-param),
  [`branch_col_le_param()`](/doc/ndbapi/en/ndb-ndbinterpretedcode.html#ndb-ndbinterpretedcode-branch-col-le-param),
  [`branch_col_gt_param()`](/doc/ndbapi/en/ndb-ndbinterpretedcode.html#ndb-ndbinterpretedcode-branch-col-gt-param),
  and
  [`branch_col_ge_param()`](/doc/ndbapi/en/ndb-ndbinterpretedcode.html#ndb-ndbinterpretedcode-branch-col-ge-param)
  were added in NDB 8.0.27 as part of this work. These
  [`NdbInterpretedCode`](/doc/ndbapi/en/ndb-ndbinterpretedcode.html) can be
  used to compare column values with values of parameters.

  In addition,
  [`NdbScanFilter::cmp_param()`](/doc/ndbapi/en/ndb-ndbscanfilter.html#ndb-ndbscanfilter-cmp-param),
  also added in NDB 8.0.27, makes it possible to define
  comparisons between column values and parameter values for use
  in performing scans.

* **Increase in maximum row size.**
  NDB 8.0 increases the maximum number of bytes that can be
  stored in an `NDBCLUSTER` table from 14000
  to 30000 bytes.

  A [`BLOB`](blob.html "13.3.4 The BLOB and TEXT Types") or
  [`TEXT`](blob.html "13.3.4 The BLOB and TEXT Types") column continues to use
  264 bytes of this total, as before.

  The maximum offset for a fixed-width column of an
  `NDB` table is 8188 bytes; this is also
  unchanged from previous releases.

  See
  [Section 25.2.7.5, “Limits Associated with Database Objects in NDB Cluster”](mysql-cluster-limitations-database-objects.html "25.2.7.5 Limits Associated with Database Objects in NDB Cluster"),
  for more information.

* **ndb\_mgm SHOW command and single user mode.**
  In NDB 8.0, when the cluster in single user mode, the output
  of the management client
  [`SHOW`](mysql-cluster-mgm-client-commands.html#ndbclient-show) command indicates
  which API or SQL node has exclusive access while this mode
  is in effect.

* **Online column renames.**
  Columns of `NDB` tables can now be renamed
  online, using `ALGORITHM=INPLACE`. See
  [Section 25.6.12, “Online Operations with ALTER TABLE in NDB Cluster”](mysql-cluster-online-operations.html "25.6.12 Online Operations with ALTER TABLE in NDB Cluster"), for more
  information.

* **Improved ndb\_mgmd startup times.**
  Start times for management nodes daemon have been
  significantly improved in NDB 8.0, in the following ways:

  + Due to replacing the list data structure formerly used by
    `ndb_mgmd` for handling node properties
    from configuration data with a hash table, overall startup
    times for the management server have been decreased by a
    factor of 6 or more.

  + In addition, in cases where data and SQL node host names
    not present in the management server's
    `hosts` file are used in the cluster
    configuration file, [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "25.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") start
    times can be up to 20 times shorter than was previously
    the case.

* **NDB API enhancements.**
  [`NdbScanFilter::cmp()`](/doc/ndbapi/en/ndb-ndbscanfilter.html#ndb-ndbscanfilter-cmp) and
  several comparison methods of
  [`NdbInterpretedCode`](/doc/ndbapi/en/ndb-ndbinterpretedcode.html) can now
  be used to compare table column values with each other. The
  affected `NdbInterpretedCode` methods are
  listed here:

  + [`branch_col_eq()`](/doc/ndbapi/en/ndb-ndbinterpretedcode.html#ndb-ndbinterpretedcode-branch-col-eq)
  + [`branch_col_ge()`](/doc/ndbapi/en/ndb-ndbinterpretedcode.html#ndb-ndbinterpretedcode-branch-col-ge)
  + [`branch_col_gt()`](/doc/ndbapi/en/ndb-ndbinterpretedcode.html#ndb-ndbinterpretedcode-branch-col-gt)
  + [`branch_col_le()`](/doc/ndbapi/en/ndb-ndbinterpretedcode.html#ndb-ndbinterpretedcode-branch-col-le)
  + [`branch_col_lt()`](/doc/ndbapi/en/ndb-ndbinterpretedcode.html#ndb-ndbinterpretedcode-branch-col-lt)
  + [`branch_col_ne()`](/doc/ndbapi/en/ndb-ndbinterpretedcode.html#ndb-ndbinterpretedcode-branch-col-ne)

  For all of the methods just listed, table column values to be
  compared much be of exactly matching types, including with
  respect to length, precision, signedness, scale, character
  set, and collation, as applicable.

  See the descriptions of the individual API methods for more
  information.

* **Offline multithreaded index builds.**
  It is now possible to specify a set of cores to be used for
  I/O threads performing offline multithreaded builds of
  ordered indexes, as opposed to normal I/O duties such as
  file I/O， compression， or decompression.
  “Offline” in this context refers to building of
  ordered indexes performed when the parent table is not being
  written to; such building takes place when an
  `NDB` cluster performs a node or system
  restart, or as part of restoring a cluster from backup using
  [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup")
  [`--rebuild-indexes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_rebuild-indexes).

  In addition, the default behavior for offline index build work
  is modified to use all cores available to
  [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "25.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)"), rather limiting itself to the core
  reserved for the I/O thread. Doing so can improve restart and
  restore times and performance, availability, and the user
  experience.

  This enhancement is implemented as follows:

  1. The default value for
     [`BuildIndexThreads`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-buildindexthreads)
     is changed from 0 to 128. This means that offline ordered
     index builds are now multithreaded by default.

  2. The default value for
     [`TwoPassInitialNodeRestartCopy`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-twopassinitialnoderestartcopy)
     is changed from `false` to
     `true`. This means that an initial node
     restart first copies all data from a “live”
     node to one that is starting—without creating any
     indexes—builds ordered indexes offline, and then
     again synchronizes its data with the live node, that is,
     synchronizing twice and building indexes offline between
     the two synchronizations. This causes an initial node
     restart to behave more like the normal restart of a node,
     and reduces the time required for building indexes.

  3. A new thread type (`idxbld`) is defined
     for the
     [`ThreadConfig`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-threadconfig)
     configuration parameter, to allow locking of offline index
     build threads to specific CPUs.

  In addition, `NDB` now distinguishes the
  thread types that are accessible to
  `ThreadConfig` by these two criteria:

  1. Whether the thread is an execution thread. Threads of
     types `main`, `ldm`,
     `recv`, `rep`,
     `tc`, and `send` are
     execution threads; thread types `io`,
     `watchdog`, and `idxbld`
     are not.

  2. Whether the allocation of the thread to a given task is
     permanent or temporary. Currently all thread types except
     `idxbld` are permanent.

  For additional information, see the descriptions of the
  indicated parameters in the Manual. (Bug #25835748, Bug
  #26928111)

* **logbuffers table backup process information.**
  When performing an NDB backup, the
  [`ndbinfo.logbuffers`](mysql-cluster-ndbinfo-logbuffers.html "25.6.16.42 The ndbinfo logbuffers Table") table
  now displays information regarding buffer usage by the
  backup process on each data node. This is implemented as
  rows reflecting two new log types in addition to
  `REDO` and `DD-UNDO`. One
  of these rows has the log type
  `BACKUP-DATA`, which shows the amount of
  data buffer used during backup to copy fragments to backup
  files. The other row has the log type
  `BACKUP-LOG`, which displays the amount of
  log buffer used during the backup to record changes made
  after the backup has started. One each of these
  `log_type` rows is shown in the
  `logbuffers` table for each data node in
  the cluster. Rows having these two log types are present in
  the table only while an NDB backup is currently in progress.
  (Bug #25822988)

* **ndbinfo.processes table on Windows.**
  The process ID of the monitor process used on Windows
  platforms by [`RESTART`](restart.html "15.7.8.8 RESTART Statement") to spawn
  and restart a [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") is now shown in the
  [`processes`](mysql-cluster-ndbinfo-processes.html "25.6.16.50 The ndbinfo processes Table") table as an
  `angel_pid`.

* **String hashing improvements.**
  Prior to NDB 8.0, all string hashing was based on first
  transforming the string into a normalized form, then
  MD5-hashing the resulting binary image. This could give rise
  to some performance problems, for the following reasons:

  + The normalized string is always space padded to its full
    length. For a [`VARCHAR`](char.html "13.3.2 The CHAR and VARCHAR Types"), this
    often involved adding more spaces than there were
    characters in the original string.

  + The string libraries were not optimized for this space
    padding, which added considerable overhead in some use
    cases.

  + The padding semantics varied between character sets, some
    of which were not padded to their full length.

  + The transformed string could become quite large, even
    without space padding; some Unicode 9.0 collations can
    transform a single code point into 100 bytes or more of
    character data.

  + Subsequent MD5 hashing consisted mainly of padding with
    spaces, and was not particularly efficient, possibly
    causing additional performance penalties by flushing
    significant portions of the L1 cache.

  A collation provides its own hash function, which hashes the
  string directly without first creating a normalized string. In
  addition, for a Unicode 9.0 collation, the hash is computed
  without padding. `NDB` now takes advantage of
  this built-in function whenever hashing a string identified as
  using a Unicode 9.0 collation.

  Since, for other collations, there are existing databases
  which are hash partitioned on the transformed string,
  `NDB` continues to employ the previous method
  for hashing strings that use these, to maintain compatibility.
  (Bug #89590, Bug #89604, Bug #89609, Bug #27515000, Bug
  #27523758, Bug #27522732)

* **RESET MASTER changes.**
  Because the MySQL Server now executes
  [`RESET MASTER`](reset-master.html "15.4.1.2 RESET MASTER Statement") with a global
  read lock, the behavior of this statement when used with NDB
  Cluster has changed in the following two respects:

  + It is no longer guaranteed to be synchronous; that is, it
    is now possible that a read coming immediately before
    `RESET MASTER` is issued may not be
    logged until after the binary log has been rotated.

  + It now behaves in exactly the same fashion, whether the
    statement is issued on the same SQL node that is writing
    the binary log, or on a different SQL node in the same
    cluster.

  Note

  [`SHOW BINLOG EVENTS`](show-binlog-events.html "15.7.7.2 SHOW BINLOG EVENTS Statement"),
  [`FLUSH LOGS`](flush.html#flush-logs), and most data
  definition statements continue, as they did in previous
  `NDB` versions, to operate in a synchronous
  fashion.

* **ndb\_restore option usage.**
  The [`--nodeid`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_nodeid) and
  [`--backupid`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid) options are
  now both required when invoking
  [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup").

* **ndb\_log\_bin default.**
  NDB 8.0 changes the default value of the
  [`ndb_log_bin`](mysql-cluster-options-variables.html#sysvar_ndb_log_bin) system variable
  from `TRUE` to `FALSE`.

* **Dynamic transactional resource allocation.**
  Allocation of resources in the transaction coordinator is
  now performed using dynamic memory pools. This means that
  resource allocation determined by data node configuration
  parameters such as
  [`MaxDMLOperationsPerTransaction`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdmloperationspertransaction),
  [`MaxNoOfConcurrentIndexOperations`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrentindexoperations),
  [`MaxNoOfConcurrentOperations`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrentoperations),
  [`MaxNoOfConcurrentScans`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrentscans),
  [`MaxNoOfConcurrentTransactions`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnoofconcurrenttransactions),
  [`MaxNoOfFiredTriggers`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooffiredtriggers),
  [`MaxNoOfLocalScans`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxnooflocalscans),
  and
  [`TransactionBufferMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-transactionbuffermemory)
  is now done in such a way that, if the load represented by
  each of these parameters is within the target load for all
  such resources, others of these resources can be limited so
  as not to exceed the total resources available.

  As part of this work, several new data node parameters
  controlling transactional resources in
  [`DBTC`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbtc.html), listed here, have
  been added:

  + [`ReservedConcurrentIndexOperations`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-reservedconcurrentindexoperations)
  + [`ReservedConcurrentOperations`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-reservedconcurrentoperations)
  + [`ReservedConcurrentScans`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-reservedconcurrentscans)
  + [`ReservedConcurrentTransactions`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-reservedconcurrenttransactions)
  + [`ReservedFiredTriggers`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-reservedfiredtriggers)
  + [`ReservedLocalScans`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-reservedlocalscans)
  + [`ReservedTransactionBufferMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-reservedtransactionbuffermemory).

  See the descriptions of the parameters just listed for further
  information.

* **Backups using multiple LDMs per data node.**
  `NDB` backups can now be performed in a
  parallel fashion on individual data nodes using multiple
  local data managers (LDMs). (Previously, backups were done
  in parallel across data nodes, but were always serial within
  data node processes.) No special syntax is required for the
  [`START BACKUP`](mysql-cluster-backup-using-management-client.html "25.6.8.2 Using The NDB Cluster Management Client to Create a Backup") command in
  the [**ndb\_mgm**](mysql-cluster-programs-ndb-mgm.html "25.5.5 ndb_mgm — The NDB Cluster Management Client") client to enable this
  feature, but all data nodes must be using multiple LDMs.
  This means that data nodes must be running
  [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "25.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") ([**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") is
  single-threaded and thus always has only one LDM) and they
  must be configured to use multiple LDMs before taking the
  backup; you can do this by choosing an appropriate setting
  for one of the multi-threaded data node configuration
  parameters
  [`MaxNoOfExecutionThreads`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-maxnoofexecutionthreads)
  or [`ThreadConfig`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-threadconfig).

  Backups using multiple LDMs create subdirectories, one per
  LDM, under the
  `BACKUP/BACKUP-backup_id/`
  directory. [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup") now detects these
  subdirectories automatically, and if they exist, attempts to
  restore the backup in parallel; see
  [Section 25.5.23.3, “Restoring from a backup taken in parallel”](ndb-restore-parallel-data-node-backup.html "25.5.23.3 Restoring from a backup taken in parallel"), for
  details. (Single-threaded backups are restored as in previous
  versions of `NDB`.) It is also possible to
  restore backups taken in parallel using an
  [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup") binary from a previous version
  of NDB Cluster by modifying the usual restore procedure;
  [Section 25.5.23.3.2, “Restoring a parallel backup serially”](ndb-restore-parallel-data-node-backup.html#ndb-restore-parallel-backup-serial "25.5.23.3.2 Restoring a parallel backup serially"), provides
  information on how to do this.

  You can force the creation of single-threaded backups by
  setting the
  [`EnableMultithreadedBackup`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-enablemultithreadedbackup)
  data node parameter to 0 for all data nodes in the
  `[ndbd default]` section of the
  cluster's global configuration file
  (`config.ini`).

* **Binary configuration file enhancements.**
  NDB 8.0 uses a new format for the management server's
  binary configuration file. Previously, a maximum of 16381
  sections could appear in the cluster configuration file; now
  the maximum number of sections is 4G. This is intended to
  support larger numbers of nodes in a cluster than was
  possible before this change.

  Upgrades to the new format are relatively seamless, and should
  seldom if ever require manual intervention, as the management
  server continues to be able to read the old format without
  issue. A downgrade from NDB 8.0 to an older version of the NDB
  Cluster software requires manual removal of any binary
  configuration files or, alternatively, starting the older
  management server binary with the
  [`--initial`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_initial) option.

  For more information, see
  [Section 25.3.7, “Upgrading and Downgrading NDB Cluster”](mysql-cluster-upgrade-downgrade.html "25.3.7 Upgrading and Downgrading NDB Cluster").

* **Increased number of data nodes.**
  NDB 8.0 increases the maximum number of data nodes supported
  per cluster to 144 (previously, this was 48). Data nodes can
  now use node IDs in the range 1 to 144, inclusive.

  Previously, the recommended node IDs for management nodes were
  49 and 50. These are still supported for management nodes, but
  using them as such limits the maximum number of data nodes to
  142; for this reason, it is now recommended that node IDs 145
  and 146 are used for management nodes.

  As part of this work, the format used for the data node
  `sysfile` has been updated to version 2.
  This file records information such as the last global
  checkpoint index, restart status, and node group membership of
  each node (see
  [NDB Cluster Data Node File System Directory](/doc/ndb-internals/en/ndb-internals-ndbd-filesystemdir-files.html)).

* **RedoOverCommitCounter and RedoOverCommitLimit changes.**
  Due to ambiguities in the semantics for setting them to 0,
  the minimum value for each of the data node configuration
  parameters
  [`RedoOverCommitCounter`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-redoovercommitcounter)
  and
  [`RedoOverCommitLimit`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-redoovercommitlimit)
  has been increased to 1.

* **ndb\_autoincrement\_prefetch\_sz changes.**
  The default value of the
  [`ndb_autoincrement_prefetch_sz`](mysql-cluster-options-variables.html#sysvar_ndb_autoincrement_prefetch_sz)
  server system variable is increased to 512.

* **Changes in parameter maximums and defaults.**
  NDB 8.0 makes the following changes in configuration
  parameter maximum and default values:

  + The maximum for
    [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) is
    increased to 16 terabytes.

  + The maximum for
    [`DiskPageBufferMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskpagebuffermemory)
    is also increased to 16 terabytes.

  + The default value for
    [`StringMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-stringmemory) is
    increased to 25%.

  + The default for
    [`LcpScanProgressTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-lcpscanprogresstimeout)
    is increased to 180 seconds.

* **Disk Data checkpointing improvements.**
  NDB Cluster 8.0 provides a number of new enhancements which
  help to reduce the latency of checkpoints of Disk Data
  tables and tablespaces when using non-volatile memory
  devices such as solid-state drives and the NVMe
  specification for such devices. These improvements include
  those in the following list:

  + Avoiding bursts of checkpoint disk writes
  + Speeding up checkpoints for disk data tablespaces when the
    redo log or the undo log becomes full

  + Balancing checkpoints to disk and in-memory checkpoints
    against one other, when necessary

  + Protecting disk devices from overload to help ensure low
    latency under high loads

  As part of this work, two data node configuration parameters
  have been added.
  [`MaxDiskDataLatency`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskdatalatency)
  places a ceiling on the degree of latency permitted for disk
  access and causes transactions taking longer than this length
  of time to be aborted.
  [`DiskDataUsingSameDisk`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskdatausingsamedisk)
  makes it possible to take advantage of housing Disk Data
  tablespaces on separate disks by increasing the rate at which
  checkpoints of such tablespaces can be performed.

  In addition, three new tables in the
  [`ndbinfo`](mysql-cluster-ndbinfo.html "25.6.16 ndbinfo: The NDB Cluster Information Database") database provide
  information about Disk Data performance:

  + The [`diskstat`](mysql-cluster-ndbinfo-diskstat.html "25.6.16.31 The ndbinfo diskstat Table") table
    reports on writes to Disk Data tablespaces during the past
    second

  + The [`diskstats_1sec`](mysql-cluster-ndbinfo-diskstats-1sec.html "25.6.16.32 The ndbinfo diskstats_1sec Table") table
    reports on writes to Disk Data tablespaces for each of the
    last 20 seconds

  + The
    [`pgman_time_track_stats`](mysql-cluster-ndbinfo-pgman-time-track-stats.html "25.6.16.49 The ndbinfo pgman_time_track_stats Table")
    table reports on the latency of disk operations relating
    to Disk Data tablespaces

* **Memory allocation and TransactionMemory.**
  A new
  [`TransactionMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-transactionmemory)
  parameter simplifies allocation of data node memory for
  transactions as part of the work done to pool transactional
  and Local Data Manager (LDM) memory. This parameter is
  intended to replace several older transactional memory
  parameters which have been deprecated.

  Transaction memory can now be set in any of the three ways
  listed here:

  + Several configuration parameters are incompatible with
    [`TransactionMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-transactionmemory).
    If any of these are set,
    `TransactionMemory` cannot be set (see
    [Parameters incompatible with TransactionMemory](mysql-cluster-ndbd-definition.html#mysql-cluster-transactionmemory-incompatible "Parameters incompatible with TransactionMemory")),
    and the data node's transaction memory is determined
    as it was previous to NDB 8.0.

    Note

    Attempting to set `TransactionMemory`
    and any of these parameters concurrently in the
    `config.ini` file prevents the
    management server from starting.

  + If `TransactionMemory` is set, this value
    is used for determining transaction memory.
    `TransactionMemory` cannot be set if any
    of the incompatible parameters mentioned in the previous
    item have also been set.

  + If none of the incompatible parameters are set and
    `TransactionMemory` is also not set,
    transaction memory is set by `NDB`.

  For more information, see the description of
  [`TransactionMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-transactionmemory), as
  well as
  [Section 25.4.3.13, “Data Node Memory Management”](mysql-cluster-data-node-memory-management.html "25.4.3.13 Data Node Memory Management").

* **Support for additional fragment replicas.**
  NDB 8.0 increases the maximum number of fragment replicas
  supported in production from two to four. (Previously, it
  was possible to set
  [`NoOfReplicas`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-noofreplicas) to 3 or
  4, but this was not officially supported or verified in
  testing.)

* **Restoring by slices.**
  Beginning with NDB 8.0.20, it is possible to divide a backup
  into roughly equal portions (slices) and to restore these
  slices in parallel using two new options implemented for
  [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup"):

  + [`--num-slices`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_num-slices)
    determines the number of slices into which the backup
    should be divided.

  + [`--slice-id`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_slice-id) provides
    the ID of the slice to be restored by the current instance
    of [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup").

  This makes it possible to employ multiple instances of
  [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup") to restore subsets of the
  backup in parallel, potentially reducing the amount of time
  required to perform the restore operation.

  For more information, see the description of the
  [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup")
  [`--num-slices`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_num-slices) option.

* **Read from any fragment replica enabled.**
  Read from any fragment replica is enabled by default for all
  `NDB` tables. This means that the default
  value for the
  [`ndb_read_backup`](mysql-cluster-options-variables.html#sysvar_ndb_read_backup) system
  variable is now ON, and that the value of the
  `NDB_TABLE` comment option
  `READ_BACKUP` is 1 when creating a new
  `NDB` table. Enabling read from any
  fragment replica significantly improves performance for
  reads from `NDB` tables, with minimal
  impact on writes.

  For more information, see the description of the
  [`ndb_read_backup`](mysql-cluster-options-variables.html#sysvar_ndb_read_backup) system
  variable, and
  [Section 15.1.20.12, “Setting NDB Comment Options”](create-table-ndb-comment-options.html "15.1.20.12 Setting NDB Comment Options").

* **ndb\_blob\_tool enhancements.**
  Beginning with NDB 8.0.20, the
  [**ndb\_blob\_tool**](mysql-cluster-programs-ndb-blob-tool.html "25.5.6 ndb_blob_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables") utility can detect missing
  blob parts for which inline parts exist and replace these
  with placeholder blob parts (consisting of space characters)
  of the correct length. To check whether there are missing
  blob parts, use the
  [`--check-missing`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_check-missing) option
  with this program. To replace any missing blob parts with
  placeholders, use the
  [`--add-missing`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_add-missing) option.

  For more information, see
  [Section 25.5.6, “ndb\_blob\_tool — Check and Repair BLOB and TEXT columns of NDB Cluster
  Tables”](mysql-cluster-programs-ndb-blob-tool.html "25.5.6 ndb_blob_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables").

* **ndbinfo versioning.**
  `NDB` 8.0.20 and later supports versioning
  for [`ndbinfo`](mysql-cluster-ndbinfo.html "25.6.16 ndbinfo: The NDB Cluster Information Database") tables, and
  maintains the current definitions for its tables internally.
  At startup, `NDB` compares its supported
  `ndbinfo` version with the version stored
  in the data dictionary. If the versions differ,
  `NDB` drops any old
  `ndbinfo` tables and recreates them using
  the current definitions.

* **Support for Fedora Linux.**
  Beginning with NDB 8.0.20, Fedora Linux is a supported
  platform for NDB Cluster Community releases and can be
  installed using the RPMs supplied for this purpose by
  Oracle. These can be obtained from the
  [NDB Cluster
  downloads page](https://dev.mysql.com/downloads/cluster/).

* **NDB programs—NDBT dependency removal.**
  The dependency of a number of `NDB` utility
  programs on the `NDBT` library has been
  removed. This library is used internally for development,
  and is not required for normal use; its inclusion in these
  programs could lead to unwanted issues when testing.

  Affected programs are listed here, along with the
  `NDB` versions in which the dependency was
  removed:

  + [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup")
  + [**ndb\_delete\_all**](mysql-cluster-programs-ndb-delete-all.html "25.5.8 ndb_delete_all — Delete All Rows from an NDB Table")
  + [**ndb\_show\_tables**](mysql-cluster-programs-ndb-show-tables.html "25.5.27 ndb_show_tables — Display List of NDB Tables") (NDB 8.0.20)
  + [**ndb\_waiter**](mysql-cluster-programs-ndb-waiter.html "25.5.30 ndb_waiter — Wait for NDB Cluster to Reach a Given Status") (NDB 8.0.20)

  The principal effect of this change for users is that these
  programs no longer print `NDBT_ProgramExit -
  status` following
  completion of a run. Applications that depend upon such
  behavior should be updated to reflect the change when
  upgrading to the indicated versions.

* **Foreign keys and lettercasing.**
  [`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 8.0") stores the names of foreign
  keys using the case with which they were defined. Formerly,
  when the value of the
  [`lower_case_table_names`](server-system-variables.html#sysvar_lower_case_table_names)
  system variable was set to 0, it performed case-sensitive
  comparisons of foreign key names as used in
  [`SELECT`](select.html "15.2.13 SELECT Statement") and other SQL
  statements with the names as stored. Beginning with NDB
  8.0.20, such comparisons are now always performed in a
  case-insensitive fashion, regardless of the value of
  `lower_case_table_names`.

* **Multiple transporters.**
  NDB 8.0.20 introduces support for multiple transporters to
  handle node-to-node communication between pairs of data
  nodes. This facilitates higher rates of update operations
  for each node group in the cluster, and helps avoid
  constraints imposed by system or other limitations on
  inter-node communications using a single socket.

  By default, `NDB` now uses a number of
  transporters based on the number of local data management
  (LDM) threads or the number of transaction coordinator (TC)
  threads, whichever is greater. By default, the number of
  transporters is equal to half of this number. While the
  default should perform well for most workloads, it is possible
  to adjust the number of transporters employed by each node
  group by setting the
  [`NodeGroupTransporters`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-nodegrouptransporters)
  data node configuration parameter (also introduced in NDB
  8.0.20), up a maximum of the greater of the number of LDM
  threads or the number of TC threads. Setting it to 0 causes
  the number of transporters to be the same as the number of LDM
  threads.

* **ndb\_restore: primary key schema changes.**
  NDB 8.0.21 (and later) supports different primary key
  definitions for source and target tables when restoring an
  `NDB` native backup with
  [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup") when it is run with the
  [`--allow-pk-changes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_allow-pk-changes)
  option. Both increasing and decreasing the number of columns
  making up the original primary key are supported.

  When the primary key is extended with an additional column or
  columns, any columns added must be defined as `NOT
  NULL`, and no values in any such columns may be
  changed during the time that the backup is being taken.
  Because some applications set all column values in a row when
  updating it, whether or not all values are actually changed,
  this can cause a restore operation to fail even if no values
  in the column to be added to the primary key have changed. You
  can override this behavior using the
  [`--ignore-extended-pk-updates`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_ignore-extended-pk-updates)
  option also added in NDB 8.0.21; in this case, you must ensure
  that no such values are changed.

  A column can be removed from the table's primary key
  whether or not this column remains part of the table.

  For more information, see the description of the
  [`--allow-pk-changes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_allow-pk-changes) option
  for [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup").

* **Merging backups with ndb\_restore.**
  In some cases, it may be desirable to consolidate data
  originally stored in different instances of NDB Cluster (all
  using the same schema) into a single target NDB Cluster.
  This is now supported when using backups created in the
  [**ndb\_mgm**](mysql-cluster-programs-ndb-mgm.html "25.5.5 ndb_mgm — The NDB Cluster Management Client") client (see
  [Section 25.6.8.2, “Using The NDB Cluster Management Client to Create a Backup”](mysql-cluster-backup-using-management-client.html "25.6.8.2 Using The NDB Cluster Management Client to Create a Backup"))
  and restoring them with [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup"),
  using the [`--remap-column`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_remap-column)
  option added in NDB 8.0.21 along with
  [`--restore-data`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_restore-data) (and
  possibly additional compatible options as needed or
  desired). `--remap-column` can be employed to
  handle cases in which primary and unique key values are
  overlapping between source clusters, and it is necessary
  that they do not overlap in the target cluster, as well as
  to preserve other relationships between tables such as
  foreign keys.

  [`--remap-column`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_remap-column) takes as
  its argument a string having the format
  `db.tbl.col:fn:args`,
  where *`db`*,
  *`tbl`*, and
  *`col`* are, respectively, the names of
  the database, table, and column, *`fn`*
  is the name of a remapping function, and
  *`args`* is one or more arguments to
  *`fn`*. There is no default value. Only
  `offset` is supported as the function name,
  with *`args`* as the integer offset to
  be applied to the value of the column when inserting it into
  the target table from the backup. This column must be one of
  [`INT`](integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") or
  [`BIGINT`](integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"); the allowed range of
  the offset value is the same as the signed version of that
  type (this allows the offset to be negative if desired).

  The new option can be used multiple times in the same
  invocation of [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup"), so that you can
  remap to new values multiple columns of the same table,
  different tables, or both. The offset value does not have to
  be the same for all instances of the option.

  In addition, two new options are provided for
  [**ndb\_desc**](mysql-cluster-programs-ndb-desc.html "25.5.9 ndb_desc — Describe NDB Tables"), also beginning in NDB 8.0.21:

  + [`--auto-inc`](mysql-cluster-programs-ndb-desc.html#option_ndb_desc_auto-inc) (short form
    `-a`): Includes the next auto-increment
    value in the output, if the table has an
    `AUTO_INCREMENT` column.

  + [`--context`](mysql-cluster-programs-ndb-desc.html#option_ndb_desc_context) (short form
    `-x`): Provides extra information about the
    table, including the schema, database name, table name,
    and internal ID.

  For more information and examples, see the description of the
  [`--remap-column`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_remap-column) option.

* **Send thread improvements.**
  As of NDB 8.0.20, each send thread now handles sends to a
  subset of transporters, and each block thread now assists
  only one send thread, resulting in more send threads, and
  thus better performance and data node scalability.

* **Adaptive spin control using SpinMethod.**
  A simple interface for setting up adaptive CPU spin on
  platforms supporting it, using the
  [`SpinMethod`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-spinmethod) data node
  parameter. This parameter (added in NDB 8.0.20, functional
  beginning with NDB 8.0.24) has four settings, one each for
  static spinning, cost-based adaptive spinning,
  latency-optimized adaptive spinning, and adaptive spinning
  optimized for database machines on which each thread has its
  own CPU. Each of these settings causes the data node to use
  a set of predetermined values for one or more spin
  parameters which enable adaptive spinning, set spin timing,
  and set spin overhead, as appropriate to a given scenario,
  thus obviating the need to set these directly for common use
  cases.

  For fine-tuning spin behavior, it is also possible to set
  these and additional spin parameters directly, using the
  existing
  [`SchedulerSpinTimer`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-schedulerspintimer)
  data node configuration parameter as well as the following
  [`DUMP`](/doc/ndb-internals/en/dump-commands.html) commands in the
  [**ndb\_mgm**](mysql-cluster-programs-ndb-mgm.html "25.5.5 ndb_mgm — The NDB Cluster Management Client") client:

  + [`DUMP 104000
    (SetSchedulerSpinTimerAll)`](/doc/ndb-internals/en/dump-command-104000.html): Sets spin time for
    all threads

  + [`DUMP 104001
    (SetSchedulerSpinTimerThread)`](/doc/ndb-internals/en/dump-command-104001.html): Sets spin time
    for a specified thread

  + [`DUMP 104002
    (SetAllowedSpinOverhead)`](/doc/ndb-internals/en/dump-command-104002.html): Sets spin overhead as
    the number of units of CPU time allowed to gain 1 unit of
    latency

  + [`DUMP 104003
    (SetSpintimePerCall)`](/doc/ndb-internals/en/dump-command-104003.html): Sets the time for a call
    to spin

  + [`DUMP 104004
    (EnableAdaptiveSpinning)`](/doc/ndb-internals/en/dump-command-104004.html): Enables or disables
    adaptive spinning

  NDB 8.0.20 also adds a new TCP configuration parameter
  [`TcpSpinTime`](mysql-cluster-tcp-definition.html#ndbparam-tcp-tcpspintime) which sets
  the time to spin for a given TCP connection.

  The [**ndb\_top**](mysql-cluster-programs-ndb-top.html "25.5.29 ndb_top — View CPU usage information for NDB threads") tool is also enhanced to
  provide spin time information per thread.

  For additional information, see the description of the
  [`SpinMethod`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-spinmethod) parameter,
  the listed `DUMP` commands, and
  [Section 25.5.29, “ndb\_top — View CPU usage information for NDB threads”](mysql-cluster-programs-ndb-top.html "25.5.29 ndb_top — View CPU usage information for NDB threads").

* **Disk Data and cluster restarts.**
  Beginning with NDB 8.0.21, an initial restart of the cluster
  forces the removal of all Disk Data objects such as
  tablespaces and log file groups, including any data files
  and undo log files associated with these objects.

  See [Section 25.6.11, “NDB Cluster Disk Data Tables”](mysql-cluster-disk-data.html "25.6.11 NDB Cluster Disk Data Tables"), for more
  information.

* **Disk Data extent allocation.**
  Beginning with NDB 8.0.20, allocation of extents in data
  files is done in a round-robin fashion among all data files
  used by a given tablespace. This is expected to improve
  distribution of data in cases where multiple storage devices
  are used for Disk Data storage.

  For more information, see
  [Section 25.6.11.1, “NDB Cluster Disk Data Objects”](mysql-cluster-disk-data-objects.html "25.6.11.1 NDB Cluster Disk Data Objects").

* **--ndb-log-fail-terminate option.**
  Beginning with NDB 8.0.21, you can cause the SQL node to
  terminate whenever it is unable to log all row events fully.
  This can be done by starting [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") with
  the [`--ndb-log-fail-terminate`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-fail-terminate)
  option.

* **AllowUnresolvedHostNames parameter.**
  By default, a management node refuses to start when it
  cannot resolve a host name present in the global
  configuration file, which can be problematic in some
  environments such as Kubernetes. Beginning with NDB 8.0.22,
  it is possible to override this behavior by setting
  [`AllowUnresolvedHostNames`](mysql-cluster-tcp-definition.html#ndbparam-tcp-allowunresolvedhostnames)
  to `true` in the `[tcp
  default]` section of the cluster global
  configuration file (`config.ini` file).
  Doing so causes such errors to be treated as warnings
  instead, and to permit [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "25.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") to
  continue starting

* **Blob write performance enhancements.**
  NDB 8.0.22 implements a number of improvements which allow
  more efficient batching when modifying multiple blob columns
  in the same row, or when modifying multiple rows containing
  blob columns in the same statement, by reducing the number
  of round trips required between an SQL or other API node and
  the data nodes when applying these modifications. The
  performance of many [`INSERT`](insert.html "15.2.7 INSERT Statement"),
  [`UPDATE`](update.html "15.2.17 UPDATE Statement"), and
  [`DELETE`](delete.html "15.2.2 DELETE Statement") statements can thus be
  improved. Examples of such statements are listed here, where
  *`table`* is an
  `NDB` table containing one or more Blob
  columns:

  + `INSERT INTO table
    VALUES ROW(1, blob_value1,
    blob_value2, ...)`,
    that is, insertion of a row containing one or more Blob
    columns

  + `INSERT INTO table
    VALUES ROW(1, blob_value1),
    ROW(2, blob_value2), ROW(3,
    blob_value3), ...`,
    that is, insertion of multiple rows containing one or more
    Blob columns

  + `UPDATE table SET
    blob_column1 =
    blob_value1,
    blob_column2 =
    blob_value2, ...`

  + `UPDATE table SET
    blob_column =
    blob_value WHERE
    primary_key_column in
    (value_list)`, where
    the primary key column is not a Blob type

  + `DELETE FROM table
    WHERE primary_key_column =
    value`, where the
    primary key column is not a Blob type

  + `DELETE FROM table
    WHERE primary_key_column IN
    (value_list)`, where
    the primary key column is not a Blob type

  Other SQL statements may benefit from these improvements as
  well. These include
  [`LOAD DATA
  INFILE`](load-data.html "15.2.9 LOAD DATA Statement") and
  [`CREATE
  TABLE ... SELECT ...`](create-table-select.html "15.1.20.4 CREATE TABLE ... SELECT Statement"). In addition,
  [`ALTER TABLE
  table ENGINE = NDB`](alter-table.html "15.1.9 ALTER TABLE Statement"), where
  *`table`* uses a storage engine other
  than `NDB` prior to execution of the
  statement, may also execute more efficiently.

  This enhancement applies to statements affecting columns of
  MySQL type [`BLOB`](blob.html "13.3.4 The BLOB and TEXT Types"),
  [`MEDIUMBLOB`](blob.html "13.3.4 The BLOB and TEXT Types"),
  [`LONGBLOB`](blob.html "13.3.4 The BLOB and TEXT Types"),
  [`TEXT`](blob.html "13.3.4 The BLOB and TEXT Types"),
  [`MEDIUMTEXT`](blob.html "13.3.4 The BLOB and TEXT Types"), and
  [`LONGTEXT`](blob.html "13.3.4 The BLOB and TEXT Types"). Statements which
  update [`TINYBLOB`](blob.html "13.3.4 The BLOB and TEXT Types") or
  [`TINYTEXT`](blob.html "13.3.4 The BLOB and TEXT Types") columns (or both
  types) only are not affected by this work, and no changes in
  their performance should be expected.

  The performance of some SQL statements is not noticeably
  improved by this enhancement, due to the fact that they
  require scans of table Blob columns, which breaks up batching.
  Such statements include those of the types listed here:

  + [`SELECT FROM
    table [WHERE
    key_column IN
    (blob_value_list)]`](select.html "15.2.13 SELECT Statement"),
    where rows are selected by matching on a primary key or
    unique key column which uses a Blob type

  + `UPDATE table SET
    blob_column =
    blob_value WHERE
    condition`, using a
    *`condition`* which does not depend
    on a unique value

  + `DELETE FROM table
    WHERE condition` to
    delete rows containing one or more Blob columns, using a
    *`condition`* which does not depend
    on a unique value

  + A copying `ALTER TABLE` statement on a
    table which already used the `NDB`
    storage engine prior to executing the statement, and whose
    rows contain one or more Blob columns before or after the
    statement is executed (or both)

  To take advantage of this improvement to its fullest extent,
  you may wish to increase the values used for the
  [`--ndb-batch-size`](mysql-cluster-options-variables.html#option_mysqld_ndb-batch-size) and
  [`--ndb-blob-write-batch-bytes`](mysql-cluster-options-variables.html#option_mysqld_ndb-blob-write-batch-bytes)
  options for [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server"), to minimize the number
  of round trips required to modify blobs. For replication, it
  is also recommended that you enable the
  [`slave_allow_batching`](mysql-cluster-options-variables.html#sysvar_slave_allow_batching) system
  variable, which minimizes the number of round trips required
  by the replica cluster to apply epoch transactions.

  Note

  Beginning with NDB 8.0.30, you should also use
  [`ndb_replica_batch_size`](mysql-cluster-options-variables.html#sysvar_ndb_replica_batch_size)
  instead of `--ndb-batch-size`, and
  [`ndb_replica_blob_write_batch_bytes`](mysql-cluster-options-variables.html#sysvar_ndb_replica_blob_write_batch_bytes)
  rather than `--ndb-blob-write-batch-bytes`.
  See the descriptions of these variables, as well as
  [Section 25.7.5, “Preparing the NDB Cluster for Replication”](mysql-cluster-replication-preparation.html "25.7.5 Preparing the NDB Cluster for Replication"), for
  more information.

* **Node.js update.**
  Beginning with NDB 8.0.22, the `NDB`
  adapter for Node.js is built using version 12.18.3, and only
  that version (or a later version of Node.js) is now
  supported.

* **Encrypted backups.**
  NDB 8.0.22 adds support for backup files encrypted using
  AES-256-CBC; this is intended to protect against recovery of
  data from backups that have been accessed by unauthorized
  parties. When encrypted, backup data is protected by a
  user-supplied password. The password can be any string
  consisting of up to 256 characters from the range of
  printable ASCII characters other than `!`,
  `'`, `"`,
  `$`, `%`,
  `\`, and `^`. Retention of
  the password used to encrypt any given NDB Cluster backup
  must be performed by the user or application;
  `NDB` does not save the password. The
  password can be empty, although this is not recommended.

  When taking an NDB Cluster backup, you can encrypt it by using
  `ENCRYPT
  PASSWORD=password` with
  the management client [`START
  BACKUP`](mysql-cluster-backup-using-management-client.html "25.6.8.2 Using The NDB Cluster Management Client to Create a Backup") command. Users of the MGM API can also
  initiate an encrypted backup by calling
  [`ndb_mgm_start_backup4()`](/doc/ndbapi/en/mgm-functions-backup.html#mgm-ndb-mgm-start-backup4).

  You can encrypt existing backup files using the
  [**ndbxfrm**](mysql-cluster-programs-ndbxfrm.html "25.5.31 ndbxfrm — Compress, Decompress, Encrypt, and Decrypt Files Created by NDB Cluster") utility which is added to the NDB
  Cluster distribution in the 8.0.22 release; this program can
  also be employed for decrypting encrypted backup files. In
  addition, [**ndbxfrm**](mysql-cluster-programs-ndbxfrm.html "25.5.31 ndbxfrm — Compress, Decompress, Encrypt, and Decrypt Files Created by NDB Cluster") can compress backup files
  and decompress compressed backup files using the same method
  that is employed by NDB Cluster for creating backups when the
  [`CompressedBackup`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-compressedbackup)
  configuration parameter is set to 1.

  To restore from an encrypted backup, use
  [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup") with the options
  [`--decrypt`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_decrypt) and
  [`--backup-password`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backup-password). Both
  options are required, along with any others that would be
  needed to restore the same backup if it were not encrypted.
  [**ndb\_print\_backup\_file**](mysql-cluster-programs-ndb-print-backup-file.html "25.5.17 ndb_print_backup_file — Print NDB Backup File Contents") and
  [**ndbxfrm**](mysql-cluster-programs-ndbxfrm.html "25.5.31 ndbxfrm — Compress, Decompress, Encrypt, and Decrypt Files Created by NDB Cluster") can also read encrypted files
  using, respectively, `-P`
  *`password`* and
  [`--decrypt-password=password`](mysql-cluster-programs-ndbxfrm.html#option_ndbxfrm_decrypt-password).

  In all cases in which a password is supplied together with an
  option for encryption or decryption, the password must be
  quoted; you can use either single or double quotation marks to
  delimit the password.

  Beginning with NDB 8.0.24, several `NDB`
  programs, listed here, also support input of the password from
  standard input, similarly to how this is done when logging in
  interactively with the [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") client using
  the [`--password`](mysql-command-options.html#option_mysql_password) option (without
  including the password on the command line):

  + For [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup") and
    [**ndb\_print\_backup\_file**](mysql-cluster-programs-ndb-print-backup-file.html "25.5.17 ndb_print_backup_file — Print NDB Backup File Contents"), the
    [`--backup-password-from-stdin`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_backup-password-from-stdin)
    option enables input of the password in a secure fashion,
    similar to how it is done by the [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client")
    client' [`--password`](mysql-command-options.html#option_mysql_password)
    option. For [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup"), use the option
    together with the
    [`--decrypt`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_decrypt) option; for
    [**ndb\_print\_backup\_file**](mysql-cluster-programs-ndb-print-backup-file.html "25.5.17 ndb_print_backup_file — Print NDB Backup File Contents"), use the option
    in place of the `-P` option.

  + For [**ndb\_mgm**](mysql-cluster-programs-ndb-mgm.html "25.5.5 ndb_mgm — The NDB Cluster Management Client") the option
    [`--backup-password-from-stdin`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_backup-password-from-stdin),
    is supported together with
    [`--execute "START BACKUP
    [options]"`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_execute) for
    starting a cluster backup from the system shell.

  + Two [**ndbxfrm**](mysql-cluster-programs-ndbxfrm.html "25.5.31 ndbxfrm — Compress, Decompress, Encrypt, and Decrypt Files Created by NDB Cluster") options,
    [`--encrypt-password-from-stdin`](mysql-cluster-programs-ndbxfrm.html#option_ndbxfrm_encrypt-password-from-stdin)
    and
    [`--decrypt-password-from-stdin`](mysql-cluster-programs-ndbxfrm.html#option_ndbxfrm_decrypt-password-from-stdin),
    cause similar behavior when using that program to encrypt
    or to decrypt a backup file.

  See the descriptions of the programs just listed for more
  information.

  It is also possible, beginning with NDB 8.0.22, to enforce
  encryption of backups by setting
  [`RequireEncryptedBackup=1`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-requireencryptedbackup)
  in the `[ndbd default]` section of the
  cluster global configuration file. When this is done, the
  [**ndb\_mgm**](mysql-cluster-programs-ndb-mgm.html "25.5.5 ndb_mgm — The NDB Cluster Management Client") client rejects any attempt to
  perform a backup that is not encrypted.

  Beginning with NDB 8.0.24, you can cause
  [**ndb\_mgm**](mysql-cluster-programs-ndb-mgm.html "25.5.5 ndb_mgm — The NDB Cluster Management Client") to use encryption whenever it
  creates a backup by starting it with
  [`--encrypt-backup`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_encrypt-backup). In this
  case, the user is prompted for a password when invoking
  [`START BACKUP`](mysql-cluster-backup-using-management-client.html "25.6.8.2 Using The NDB Cluster Management Client to Create a Backup") if none is
  supplied.

* **IPv6 support.**
  Beginning with NDB 8.0.22, IPv6 addressing is supported for
  connections to management and data nodes; this includes
  connections between management and data nodes with SQL
  nodes. When configuring a cluster, you can use numeric IPv6
  addresses, host names which resolve to IPv6 addresses or
  both.

  For IPv6 addressing to work, the operating platform and
  network on which the cluster is deployed must support IPv6. As
  when using IPv4 addressing, hostname resolution to IPv6
  addresses must be provided by the operating platform.

  A known issue on Linux platforms when running NDB 8.0.22 and
  later was that the operating system kernel was required to
  provide IPv6 support, even when no IPv6 addresses were in use.
  This issue is fixed in NDB 8.0.34 and later, where it is safe
  to disable IPv6 support in the Linux kernel if you do not
  intend to use IPv6 addressing (Bug #33324817, Bug #33870642).

  IPv4 addressing continues to be supported by
  `NDB`. Using IPv4 and IPv6 addresses
  concurrently is not recommended, but can be made to work in
  the following cases:

  + When the management node is configured with IPv6 and data
    nodes are configured with IPv4 addresses in the
    `config.ini` file: This works if
    [`--bind-address`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_bind-address) is not
    used with **mgmd**, and data nodes are
    started with
    [`--ndb-connectstring`](mysql-cluster-programs-ndbd.html#option_ndbd_ndb-connectstring) set to
    the IPv4 address of the management nodes.

  + When the management node is configured with IPv4 and data
    nodes are configured with IPv6 addresses in
    `config.ini`: Similarly to the other
    case, this works if
    [`--bind-address`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_bind-address) is not
    passed to **mgmd** and data nodes are
    started with
    [`--ndb-connectstring`](mysql-cluster-programs-ndbd.html#option_ndbd_ndb-connectstring) set to
    the IPv6 address of the management node.

  These cases work because [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "25.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") does not
  bind to any IP address by default.

  To perform an upgrade from a version of `NDB`
  that does not support IPv6 addressing to one that does,
  provided that the network supports IPv4 and IPv6, first
  perform the software upgrade; after this has been done, you
  can update IPv4 addresses used in the
  `config.ini` file with IPv6 addresses.
  After this, to cause the configuration changes to take effect
  and to make the cluster start using the IPv6 addresses, it is
  necessary to perform a system restart of the cluster.

* **Auto-Installer deprecation and removal.**
  The MySQL NDB Cluster Auto-Installer web-based installation
  tool (**ndb\_setup.py**) is deprecated in NDB
  8.0.22, and is removed in NDB 8.0.23 and later. It is no
  longer supported.

* **ndbmemcache deprecation and removal.**
  `ndbmemcache` is no longer supported.
  `ndbmemcache` was deprecated in NDB 8.0.22,
  and removed in NDB 8.0.23.

* **ndbinfo backup\_id table.**
  NDB 8.0.24 adds a
  [`backup_id`](mysql-cluster-ndbinfo-backup-id.html "25.6.16.3 The ndbinfo backup_id Table") table to the
  [`ndbinfo`](mysql-cluster-ndbinfo.html "25.6.16 ndbinfo: The NDB Cluster Information Database") information
  database. This is intended to serve as a replacement for
  obtaining this information by using
  [**ndb\_select\_all**](mysql-cluster-programs-ndb-select-all.html "25.5.25 ndb_select_all — Print Rows from an NDB Table") to dump the contents of
  the internal `SYSTAB_0` table, which is
  error-prone and takes an excessively long time to perform.

  This table has a single column and row containing the ID of
  the most recent backup of the cluster taken using the
  [`START BACKUP`](mysql-cluster-backup-using-management-client.html "25.6.8.2 Using The NDB Cluster Management Client to Create a Backup") management
  client command. In the event that no backup of this cluster
  can be found, the table contains a single row whose column
  value is `0`.

* **Table partitioning enhancements.**
  NDB 8.0.23 introduces a new method for handling table
  partitions and fragments, which can determine the number of
  local data managers (LDMs) for a given data node
  independently of the number of redo log parts. This means
  that the number of LDMs can now be highly variable.
  [`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 8.0") can employ this method when
  the
  [`ClassicFragmentation`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-classicfragmentation)
  data node configuration parameter, also implemented in NDB
  8.0.23, is set to `false`; when this is the
  case, the number of LDMs is no longer used to determine how
  many partitions to create for a table per data node, and the
  value of the
  [`PartitionsPerNode`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-partitionspernode)
  parameter (also introduced in NDB 8.0.23) determines this
  number instead, which is also used for calculating the
  number of fragments used for a table.

  When `ClassicFragmentation` has its default
  value `true`, then the traditional method of
  using the number of LDMs is used to determine the number of
  fragments that a table should have.

  For more information, see the descriptions of the new
  parameters referenced previously, in
  [Multi-Threading Configuration Parameters (ndbmtd)](mysql-cluster-ndbd-definition.html#mysql-cluster-ndbd-definition-ndbmtd-parameters "Multi-Threading Configuration Parameters (ndbmtd)").

* **Terminology updates.**
  To align with work begun in MySQL 8.0.21 and NDB 8.0.21, NDB
  8.0.23 implements a number of changes in terminology, listed
  here:

  + The system variable
    [`ndb_slave_conflict_role`](mysql-cluster-options-variables.html#sysvar_ndb_slave_conflict_role)
    is now deprecated. It is replaced by
    [`ndb_conflict_role`](mysql-cluster-options-variables.html#sysvar_ndb_conflict_role).

  + Many `NDB` status variables are
    deprecated. These variables, and their replacements, are
    shown in the following table:

    **Table 25.1 Deprecated NDB status variables and their replacements**

    <table><col style="width: 50%"/><col style="width: 50%"/><thead><tr>
<th>Deprecated variable</th>
<th>Replacement</th>
</tr></thead><tbody><tr>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_adaptive_send_deferred_count_slave"><code class="literal">Ndb_api_adaptive_send_deferred_count_slave</code></a></td>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_adaptive_send_deferred_count_replica"><code class="literal">Ndb_api_adaptive_send_deferred_count_replica</code></a></td>
</tr><tr>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_adaptive_send_forced_count_slave"><code class="literal">Ndb_api_adaptive_send_forced_count_slave</code></a></td>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_adaptive_send_forced_count_replica"><code class="literal">Ndb_api_adaptive_send_forced_count_replica</code></a></td>
</tr><tr>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_adaptive_send_unforced_count_slave"><code class="literal">Ndb_api_adaptive_send_unforced_count_slave</code></a></td>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_adaptive_send_unforced_count_replica"><code class="literal">Ndb_api_adaptive_send_unforced_count_replica</code></a></td>
</tr><tr>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_bytes_received_count_slave"><code class="literal">Ndb_api_bytes_received_count_slave</code></a></td>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_bytes_received_count_replica"><code class="literal">Ndb_api_bytes_received_count_replica</code></a></td>
</tr><tr>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_bytes_sent_count_slave"><code class="literal">Ndb_api_bytes_sent_count_slave</code></a></td>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_bytes_sent_count_replica"><code class="literal">Ndb_api_bytes_sent_count_replica</code></a></td>
</tr><tr>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_pk_op_count_slave"><code class="literal">Ndb_api_pk_op_count_slave</code></a></td>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_pk_op_count_replica"><code class="literal">Ndb_api_pk_op_count_replica</code></a></td>
</tr><tr>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_pruned_scan_count_slave"><code class="literal">Ndb_api_pruned_scan_count_slave</code></a></td>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_pruned_scan_count_replica"><code class="literal">Ndb_api_pruned_scan_count_replica</code></a></td>
</tr><tr>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_range_scan_count_slave"><code class="literal">Ndb_api_range_scan_count_slave</code></a></td>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_range_scan_count_replica"><code class="literal">Ndb_api_range_scan_count_replica</code></a></td>
</tr><tr>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_read_row_count_slave"><code class="literal">Ndb_api_read_row_count_slave</code></a></td>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_read_row_count_replica"><code class="literal">Ndb_api_read_row_count_replica</code></a></td>
</tr><tr>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_scan_batch_count_slave"><code class="literal">Ndb_api_scan_batch_count_slave</code></a></td>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_scan_batch_count_replica"><code class="literal">Ndb_api_scan_batch_count_replica</code></a></td>
</tr><tr>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_table_scan_count_slave"><code class="literal">Ndb_api_table_scan_count_slave</code></a></td>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_table_scan_count_replica"><code class="literal">Ndb_api_table_scan_count_replica</code></a></td>
</tr><tr>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_trans_abort_count_slave"><code class="literal">Ndb_api_trans_abort_count_slave</code></a></td>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_trans_abort_count_replica"><code class="literal">Ndb_api_trans_abort_count_replica</code></a></td>
</tr><tr>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_trans_close_count_slave"><code class="literal">Ndb_api_trans_close_count_slave</code></a></td>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_trans_close_count_replica"><code class="literal">Ndb_api_trans_close_count_replica</code></a></td>
</tr><tr>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_trans_commit_count_slave"><code class="literal">Ndb_api_trans_commit_count_slave</code></a></td>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_trans_commit_count_replica"><code class="literal">Ndb_api_trans_commit_count_replica</code></a></td>
</tr><tr>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_trans_local_read_row_count_slave"><code class="literal">Ndb_api_trans_local_read_row_count_slave</code></a></td>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_trans_local_read_row_count_replica"><code class="literal">Ndb_api_trans_local_read_row_count_replica</code></a></td>
</tr><tr>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_trans_start_count_slave"><code class="literal">Ndb_api_trans_start_count_slave</code></a></td>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_trans_start_count_replica"><code class="literal">Ndb_api_trans_start_count_replica</code></a></td>
</tr><tr>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_uk_op_count_slave"><code class="literal">Ndb_api_uk_op_count_slave</code></a></td>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_uk_op_count_replica"><code class="literal">Ndb_api_uk_op_count_replica</code></a></td>
</tr><tr>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_wait_exec_complete_count_slave"><code class="literal">Ndb_api_wait_exec_complete_count_slave</code></a></td>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_wait_exec_complete_count_replica"><code class="literal">Ndb_api_wait_exec_complete_count_replica</code></a></td>
</tr><tr>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_wait_meta_request_count_slave"><code class="literal">Ndb_api_wait_meta_request_count_slave</code></a></td>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_wait_meta_request_count_replica"><code class="literal">Ndb_api_wait_meta_request_count_replica</code></a></td>
</tr><tr>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_wait_nanos_count_slave"><code class="literal">Ndb_api_wait_nanos_count_slave</code></a></td>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_wait_nanos_count_replica"><code class="literal">Ndb_api_wait_nanos_count_replica</code></a></td>
</tr><tr>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_wait_scan_result_count_slave"><code class="literal">Ndb_api_wait_scan_result_count_slave</code></a></td>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_api_wait_scan_result_count_replica"><code class="literal">Ndb_api_wait_scan_result_count_replica</code></a></td>
</tr><tr>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_slave_max_replicated_epoch"><code class="literal">Ndb_slave_max_replicated_epoch</code></a></td>
<td><a class="link" href="mysql-cluster-options-variables.html#statvar_Ndb_replica_max_replicated_epoch"><code class="literal">Ndb_replica_max_replicated_epoch</code></a></td>
</tr></tbody></table>

    The deprecated status variables continue to be shown in
    the output of [`SHOW STATUS`](show-status.html "15.7.7.37 SHOW STATUS Statement"),
    but applications should be updated as soon as possible not
    to rely upon them any longer, since their availability in
    future release series is not guaranteed.

  + The values `ADD_TABLE_MASTER` and
    `ADD_TABLE_SLAVE` previously shown in the
    `tab_copy_status` column of the
    `ndbinfo`
    [`ndbinfo.table_distribution_status`](mysql-cluster-ndbinfo-table-distribution-status.html "25.6.16.56 The ndbinfo table_distribution_status Table")
    table are deprecated. These are replaced by, respectively,
    the values `ADD_TABLE_COORDINATOR` and
    `ADD_TABLE_PARTICIPANT`.

  + The `--help` output of some
    `NDB` client and utility programs such as
    [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup") has been modified.

* **ThreadConfig enhancements.**
  As of NDB 8.0.23, the configurability of the
  [`ThreadConfig`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-threadconfig)
  parameter has been extended with two new thread types,
  listed here:

  + `query`: A query thread works (only) on
    [`READ COMMITTED`](innodb-transaction-isolation-levels.html#isolevel_read-committed) queries.
    A query thread also acts as a recovery thread. The number
    of query threads must be 0, 1, 2, or 3 times the number of
    LDM threads. 0 (the default, unless using
    [`ThreadConfig`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-threadconfig), or
    [`AutomaticThreadConfig`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-automaticthreadconfig)
    is enabled) causes LDMs to behave as they did prior to NDB
    8.0.23.

  + `recover`: A recovery thread retrieves
    data from a local checkpoint. A recovery thread specified
    as such never acts as a query thread.

  It is also possible to combine the existing
  `main` and `rep` threads in
  either of two ways:

  + Into a single thread by setting either one of these
    arguments to 0. When this is done, the resulting combined
    thread is shown with the name `main_rep`
    in the [`ndbinfo.threads`](mysql-cluster-ndbinfo-threads.html "25.6.16.62 The ndbinfo threads Table")
    table.

  + Together with the `recv` thread by
    setting both `ldm` and
    `tc` to 0, and setting
    `recv` to 1. In this case, the combined
    thread is named `main_rep_recv`.

  In addition, the maximum numbers of a number of existing
  thread types have been increased. The new maximums, including
  those for query threads and recovery threads, are listed here:

  + LDM: 332
  + Query: 332
  + Recovery: 332
  + TC: 128
  + Receive: 64
  + Send: 64
  + Main: 2

  Maximums for other thread types remain unchanged.

  Also, as the result of work done relating to this task,
  `NDB` now employs mutexes to protect job
  buffers when using more than 32 block threads. While this can
  cause a slight decrease in performance (1 to 2 percent in most
  cases), it also significantly reduces the amount of memory
  required by very large configurations. For example, a setup
  with 64 threads which used 2 GB of job buffer memory prior to
  NDB 8.0.23 should require only about 1 GB instead in NDB
  8.0.23 and later. In our testing this has resulted in an
  overall improvement on the order of 5 percent in the execution
  of very complex queries.

  For further information, see the descriptions of the
  [`ThreadConfig`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-threadconfig)
  parameter and the
  [`ndbinfo.threads`](mysql-cluster-ndbinfo-threads.html "25.6.16.62 The ndbinfo threads Table") table.

* **ThreadConfig thread count changes.**
  As the result of work done in NDB 8.0.30, setting the value
  of [`ThreadConfig`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-threadconfig)
  requires including `main`,
  `rep`, `recv`, and
  `ldm` in the
  `ThreadConfig` value string explicitly, in
  this and subsequent NDB Cluster releases. In addition,
  `count=0` must be set explicitly for each
  thread type (of `main`,
  `rep`, or `ldm`) that is
  not to be used, and setting `count=1` for
  replication threads (`rep`) requires also
  setting `count=1` for
  `main`.

  These changes can have a significant impact on upgrades of NDB
  clusters where this parameter is in use; see
  [Section 25.3.7, “Upgrading and Downgrading NDB Cluster”](mysql-cluster-upgrade-downgrade.html "25.3.7 Upgrading and Downgrading NDB Cluster"), for more
  information.

* **ndbmtd Thread Auto-Configuration.**
  Beginning with NDB 8.0.23, it is possible to employ
  automatic configuration of threads for multi-threaded data
  nodes using the [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "25.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") configuration
  parameter
  [`AutomaticThreadConfig`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-automaticthreadconfig).
  When this parameter is set to 1, `NDB` sets
  up thread assignments automatically, based on the number of
  processors available to applications, for all thread
  supported thread types, including the new
  `query` and `recover`
  thread types described in the previous item. If the system
  does not limit the number of processors, you can do so if
  desired by setting
  [`NumCPUs`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-numcpus) (also
  added in NDB 8.0.23). Otherwise, automatic thread
  configuration accommodates up to 1024 CPUs.

  Automatic thread configuration occurs regardless of any values
  set for [`ThreadConfig`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-threadconfig)
  or
  [`MaxNoOfExecutionThreads`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-maxnoofexecutionthreads)
  in `config.ini`; this means that it is not
  necessary to set either of these parameters.

  In addition, NDB 8.0.23 implements a number of new
  [`ndbinfo`](mysql-cluster-ndbinfo.html "25.6.16 ndbinfo: The NDB Cluster Information Database") information database
  tables providing information about hardware and CPU
  availability, as well as CPU usage by `NDB`
  data nodes. These tables are listed here:

  + [`cpudata`](mysql-cluster-ndbinfo-cpudata.html "25.6.16.13 The ndbinfo cpudata Table")
  + [`cpudata_1sec`](mysql-cluster-ndbinfo-cpudata-1sec.html "25.6.16.14 The ndbinfo cpudata_1sec Table")
  + [`cpudata_20sec`](mysql-cluster-ndbinfo-cpudata-20sec.html "25.6.16.15 The ndbinfo cpudata_20sec Table")
  + [`cpudata_50ms`](mysql-cluster-ndbinfo-cpudata-50ms.html "25.6.16.16 The ndbinfo cpudata_50ms Table")
  + [`cpuinfo`](mysql-cluster-ndbinfo-cpuinfo.html "25.6.16.17 The ndbinfo cpuinfo Table")
  + [`hwinfo`](mysql-cluster-ndbinfo-hwinfo.html "25.6.16.38 The ndbinfo hwinfo Table")

  Some of these tables are not available on every platform
  supported by NDB Cluster; see the individual descriptions of
  them for more information.

* **Hierarchical views of NDB database objects.**
  The [`dict_obj_tree`](mysql-cluster-ndbinfo-dict-obj-tree.html "25.6.16.25 The ndbinfo dict_obj_tree Table") table,
  added to the `ndbinfo` information database
  in NDB 8.0.24, can provide hierarchical and tree-like views
  of many `NDB` database objects, including
  the following:

  + Tables and associated indexes
  + Tablespaces and associated data files
  + Logfile groups and associated undo log files

  For more information and examples, see
  [Section 25.6.16.25, “The ndbinfo dict\_obj\_tree Table”](mysql-cluster-ndbinfo-dict-obj-tree.html "25.6.16.25 The ndbinfo dict_obj_tree Table").

* **Index statistics enhancements.**
  NDB 8.0.24 implements the following improvements in
  calculation of index statistics:

  + Index statistics were previously collected from one
    fragment only; this is changed such that this
    extrapolation is extended to additional fragments.

  + The algorithm used for very small tables, such as those
    having very few rows where results are discarded, has been
    improved, so that estimates for such tables should be more
    accurate than previously.

  As of NDB 8.0.27, the index statistics tables are created and
  updated automatically by default,
  [`IndexStatAutoCreate`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexstatautocreate)
  and
  [`IndexStatAutoUpdate`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexstatautoupdate)
  both default to `1` (enabled) rather than
  `0` (disabled), and it is no longer necessary
  to run [`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") to update
  the statistics.

  For additional information, see
  [Section 25.6.15, “NDB API Statistics Counters and Variables”](mysql-cluster-ndb-api-statistics.html "25.6.15 NDB API Statistics Counters and Variables").

* **Conversion between NULL and NOT NULL during restore operations.**
  Beginning with NDB 8.0.26, [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup")
  can support restoring of `NULL` columns as
  `NOT NULL` and the reverse, using the
  options listed here:

  + To restore a `NULL` column as
    `NOT NULL`, use the
    [`--lossy-conversions`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_lossy-conversions)
    option.

    The column originally declared as `NULL`
    must not contain any `NULL` rows; if it
    does, [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup") exits with an error.

  + To restore a `NOT NULL` column as
    `NULL`, use the
    [`--promote-attributes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_promote-attributes)
    option.

  For more information, see the descriptions of the indicated
  [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup") options.

* **SQL-compliant NULL comparison mode for NdbScanFilter.**
  Traditionally, when making comparisons involving
  `NULL`,
  [`NdbScanFilter`](/doc/ndbapi/en/ndb-ndbscanfilter.html) treats
  `NULL` as equal to `NULL`
  (and thus considers `NULL == NULL` to be
  `TRUE`). This is not the same as specified
  by the SQL Standard, which requires that any comparison with
  `NULL` return `NULL`,
  including `NULL == NULL`.

  Previously, it was not possible for an NDB API application to
  override this behavior; beginning with NDB 8.0.26, you can do
  so by calling
  [`NdbScanFilter::setSqlCmpSemantics()`](/doc/ndbapi/en/ndb-ndbscanfilter.html#ndb-ndbscanfilter-setsqlcmpsemantics)
  prior to creating a scan filter. (Thus, this method is always
  invoked as a class method and not as an instance method.)
  Doing so causes the next `NdbScanFilter`
  object to be created to employ SQL-compliant
  `NULL` comparison for all comparison
  operations performed over the lifetime of the instance. You
  must invoke the method for each
  [`NdbScanFilter`](/doc/ndbapi/en/ndb-ndbscanfilter.html) object that
  should use SQL-compliant comparisons.

  For more information, see
  [NdbScanFilter::setSqlCmpSemantics()](/doc/ndbapi/en/ndb-ndbscanfilter.html#ndb-ndbscanfilter-setsqlcmpsemantics).

* **Deprecation of NDB API .FRM file methods.**
  MySQL 8.0 and NDB 8.0 no longer use
  `.FRM` files for storing table metadata.
  For this reason, the NDB API methods
  [`getFrmData()`](/doc/ndbapi/en/ndb-table.html#ndb-table-getfrmdata),
  [`getFrmLength()`](/doc/ndbapi/en/ndb-table.html#ndb-table-getfrmlength), and
  [`setFrm()`](/doc/ndbapi/en/ndb-table.html#ndb-table-setfrm) are
  deprecated as of NDB 8.0.27, and subject to removal in a
  future release. For reading and writing table metadata, use
  [`getExtraMetadata()`](/doc/ndbapi/en/ndb-table.html#ndb-table-getextrametadata)
  and
  [`setExtraMetadata()`](/doc/ndbapi/en/ndb-table.html#ndb-table-setextrametadata)
  instead.

* **Preference for IPv4 or IPv6 addressing.**
  NDB 8.0.26 adds the
  [`PreferIPVersion`](mysql-cluster-tcp-definition.html#ndbparam-tcp-preferipversion)
  configuration parameter, which controls the addressing
  preference for DNS resolution. IPv4
  ([`PreferIPVersion=4`](mysql-cluster-tcp-definition.html#ndbparam-tcp-preferipversion))
  is the default. Because configuration retrieval in NDB
  requires that this preference be the same for all TCP
  connections, you should set it only in the `[tcp
  default]` section of the cluster global
  configuration (`config.ini`) file.

  See [Section 25.4.3.10, “NDB Cluster TCP/IP Connections”](mysql-cluster-tcp-definition.html "25.4.3.10 NDB Cluster TCP/IP Connections"), for more
  information.

* **Logging enhancements.**
  Previously, analysis of NDB Cluster data node and management
  node logs could be hampered by the fact that different log
  messages used different formats, and that not all log
  messages included timestamps. Such issues were due in part
  to the fact that logging was performed by a number of
  different mechanisms, such as the functions
  `printf`, `fprintf`,
  `ndbout`, and `ndbout_c`,
  overloading of the `<<` operator, and
  so on.

  We fix these problems by standardizing on the
  `EventLogger` mechanism, which is already
  present in `NDB`, and which begins each log
  message with a timestamp in `YYYY-MM-DD
  HH:MM:SS` format.

  See [Section 25.6.3, “Event Reports Generated in NDB Cluster”](mysql-cluster-event-reports.html "25.6.3 Event Reports Generated in NDB Cluster"), for more
  information about NDB Cluster event logs and the
  `EventLogger` log message format.

* **Copying ALTER TABLE improvements.**
  Beginning with NDB 8.0.27, a copying
  [`ALTER TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement") on an
  `NDB` table compares the fragment commit
  counts for the source table before and after performing the
  copy. This allows the SQL node executing this statement to
  determine whether there has been any concurrent write
  activity to the table being altered; if so, the SQL node can
  then terminate the operation.

  When concurrent writes are detected being made to the table
  being altered, the `ALTER TABLE` statement is
  rejected with the error Detected change to data in
  source table during copying ALTER TABLE. Alter aborted to
  avoid inconsistency
  ([`ER_TABLE_DEF_CHANGED`](/doc/mysql-errors/8.0/en/server-error-reference.html#error_er_table_def_changed)).
  Stopping the alter operation, rather than allowing it to
  proceed with concurrent writes taking place, can help prevent
  silent data loss or corruption.

* **ndbinfo index\_stats table.**
  NDB 8.0.28 adds the
  [`index_stats`](mysql-cluster-ndbinfo-index-stats.html "25.6.16.40 The ndbinfo index_stats Table") table, which
  provides basic information about NDB index statistics. It is
  intended primarily for internal testing, but may be useful
  as a supplement to [**ndb\_index\_stat**](mysql-cluster-programs-ndb-index-stat.html "25.5.14 ndb_index_stat — NDB Index Statistics Utility").

* **ndb\_import --table option.**
  Prior to NDB 8.0.28, [**ndb\_import**](mysql-cluster-programs-ndb-import.html "25.5.13 ndb_import — Import CSV Data Into NDB") always
  imported the data read from a CSV file into a table whose
  name was derived from the name of the file being read. NDB
  8.0.28 adds a [`--table`](mysql-cluster-programs-ndb-import.html#option_ndb_import_table)
  option (short form: `-t`) for this program to
  specify the name of the target table directly, and override
  the previous behavior.

  The default behavior for [**ndb\_import**](mysql-cluster-programs-ndb-import.html "25.5.13 ndb_import — Import CSV Data Into NDB") remains
  to use the base name of the input file as the name of the
  target table.

* **ndb\_import --missing-ai-column option.**
  Beginning with NDB 8.0.29, [**ndb\_import**](mysql-cluster-programs-ndb-import.html "25.5.13 ndb_import — Import CSV Data Into NDB") can
  import data from a CSV file that contains empty values for
  an `AUTO_INCREMENT` column, using the
  [`--missing-ai-column`](mysql-cluster-programs-ndb-import.html#option_ndb_import_missing-ai-column)
  option introduced in that release. The option can be used
  with one or more tables containing such a column.

  In order for this option to work, the
  `AUTO_INCREMENT` column in the CSV file must
  not contain any values. Otherwise, the import operation cannot
  proceed.

* **ndb\_import and empty lines.**
  [**ndb\_import**](mysql-cluster-programs-ndb-import.html "25.5.13 ndb_import — Import CSV Data Into NDB") has always rejected any empty
  lines encountered in an incoming CSV file. NDB 8.0.30 adds
  support for importing empty lines into a single column,
  provided that it is possible to convert the empty value into
  a column value.

* **ndb\_restore --with-apply-status option.**
  Beginning with NDB 8.0.29, it is possible to restore the
  `ndb_apply_status` table from an
  `NDB` backup, using
  [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup") with the
  [`--with-apply-status`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_with-apply-status)
  option added in that release. To use this option, you must
  also use [`--restore-data`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_restore-data)
  when invoking [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup").

  `--with-apply-status` restores all rows of the
  `ndb_apply_status` table except for the row
  having `server_id = 0`; to restore this row,
  use [`--restore-epoch`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_restore-epoch). For
  more information, see
  [ndb\_apply\_status Table](mysql-cluster-replication-schema.html#ndb-replication-ndb-apply-status "ndb_apply_status Table"), as the
  description of the `--with-apply-status`
  option.

* **SQL access to tables with missing indexes.**
  Prior to NDB 8.0.29, when a user query attempted to open an
  `NDB` table with a missing or broken index,
  the MySQL server raised `NDB` error
  [`4243`](/doc/ndbapi/en/ndb-error-codes-application-error.html#ndberrno-4243) (Index
  not found). This situation could arise when
  constraint violations or missing data make it impossible to
  restore an index on an `NDB` table, and
  [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup")
  [`--disable-indexes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_disable-indexes) was
  used to restore the data without the index.

  Beginning with NDB 8.0.29, an SQL query against an
  `NDB` table which has missing indexes
  succeeds if the query does not use any of the missing indexes.
  Otherwise, the query is rejected with
  [`ER_NOT_KEYFILE`](/doc/mysql-errors/8.0/en/server-error-reference.html#error_er_not_keyfile). In this case,
  you can use
  [`ALTER TABLE
  ... ALTER INDEX ... INVISIBLE`](alter-table.html#alter-table-index "Primary Keys and Indexes") to keep the MySQL
  Optimizer from trying to use the index, or drop the index (and
  then possibly re-create it) using the appropriate SQL
  statements.

* **NDB API List::clear() method.**
  The NDB API [`Dictionary`](/doc/ndbapi/en/ndb-dictionary.html)
  methods
  [`listEvents()`](/doc/ndbapi/en/ndb-dictionary.html#ndb-dictionary-listevents),
  [`listIndexes()`](/doc/ndbapi/en/ndb-dictionary.html#ndb-dictionary-listindexes),
  and
  [`listObjects()`](/doc/ndbapi/en/ndb-dictionary.html#ndb-dictionary-listobjects)
  each require a reference to a
  [`List`](/doc/ndbapi/en/ndb-list.html) object which is empty.
  Previously, reusing an existing `List` with
  any of these methods was problematic for this reason. NDB
  8.0.29 makes this easier by implementing a
  [`clear()`](/doc/ndbapi/en/ndb-list.html#ndb-list-clear) method which
  removes all data from the list.

  As part of this work, the `List` class
  destructor now calls `List::clear()` before
  removing any elements or attributes from the list.

* **NDB dictionary tables in ndbinfo.**
  NDB 8.0.29 introduces several new tables in the
  [`ndbinfo`](mysql-cluster-ndbinfo.html "25.6.16 ndbinfo: The NDB Cluster Information Database") database providing
  information from
  [`NdbDictionary`](/doc/ndbapi/en/ndb-ndbdictionary.html) that
  previously required the use of [**ndb\_desc**](mysql-cluster-programs-ndb-desc.html "25.5.9 ndb_desc — Describe NDB Tables"),
  [**ndb\_select\_all**](mysql-cluster-programs-ndb-select-all.html "25.5.25 ndb_select_all — Print Rows from an NDB Table"), and other
  **NDB** utility programs.

  Two of these tables are actually views. The
  [`hash_maps`](mysql-cluster-ndbinfo-hash-maps.html "25.6.16.37 The ndbinfo hash_maps Table") table provides
  information about hash maps used by `NDB`;
  the [`files`](mysql-cluster-ndbinfo-files.html "25.6.16.35 The ndbinfo files Table") table shows
  information regarding files used for storing data on disk (see
  [Section 25.6.11, “NDB Cluster Disk Data Tables”](mysql-cluster-disk-data.html "25.6.11 NDB Cluster Disk Data Tables")).

  The remaining six `ndbinfo` tables added in
  NDB 8.0.29 are base tables. These tables are not hidden and
  are not named using the prefix `ndb$`. These
  tables are listed here, with descriptions of the objects
  represented in each table:

  + [`blobs`](mysql-cluster-ndbinfo-blobs.html "25.6.16.4 The ndbinfo blobs Table"): Blob tables used
    to store the variable-size parts of
    [`BLOB`](blob.html "13.3.4 The BLOB and TEXT Types") and
    [`TEXT`](blob.html "13.3.4 The BLOB and TEXT Types") columns

  + [`dictionary_columns`](mysql-cluster-ndbinfo-dictionary-columns.html "25.6.16.22 The ndbinfo dictionary_columns Table"):
    Columns of `NDB` tables

  + [`dictionary_tables`](mysql-cluster-ndbinfo-dictionary-tables.html "25.6.16.23 The ndbinfo dictionary_tables Table"):
    `NDB` tables

  + [`events`](mysql-cluster-ndbinfo-events.html "25.6.16.34 The ndbinfo events Table"): Event
    subscriptions in the NDB API

  + [`foreign_keys`](mysql-cluster-ndbinfo-foreign-keys.html "25.6.16.36 The ndbinfo foreign_keys Table"): Foreign
    keys on `NDB` tables

  + [`index_columns`](mysql-cluster-ndbinfo-index-columns.html "25.6.16.39 The ndbinfo index_columns Table"): Indexes
    on `NDB` tables

  NDB 8.0.29 also makes changes in the
  `ndbinfo` storage engine's
  implementation of primary keys to improve compatibility with
  [`NdbDictionary`](/doc/ndbapi/en/ndb-ndbdictionary.html).

* **ndbcluster plugin and Performance Schema.**
  As of NDB 8.0.29, `ndbcluster` plugin
  threads are shown in the Performance Schema
  [`threads`](performance-schema-threads-table.html "29.12.21.8 The threads Table") and
  [`setup_threads`](performance-schema-setup-threads-table.html "29.12.2.5 The setup_threads Table") tables, making it
  possible to obtain information about the performance of
  these threads. The three threads exposed in
  [`performance_schema`](performance-schema.html "Chapter 29 MySQL Performance Schema") tables are
  listed here:

  + `ndb_binlog`: Binary logging thread
  + `ndb_index_stat`: Index statistics thread
  + `ndb_metadata`: Metadata thread

  See [ndbcluster Plugin Threads](mysql-cluster-ps-tables.html#mysql-cluster-plugin-threads "ndbcluster Plugin Threads"), for more
  information and examples.

  In NDB 8.0.30 and later, transaction batching memory usage is
  visible as
  `memory/ndbcluster/Thd_ndb::batch_mem_root`
  in the Performance Schema
  [`memory_summary_by_thread_by_event_name`](performance-schema-memory-summary-tables.html "29.12.20.10 Memory Summary Tables")
  and [`setup_instruments`](performance-schema-setup-instruments-table.html "29.12.2.3 The setup_instruments Table") tables. You
  can use this information to see how much memory is being used
  by transactions. For additional information, see
  [Transaction Memory Usage](mysql-cluster-ps-tables.html#mysql-cluster-trx-batch-memory "Transaction Memory Usage").

* **Configurable blob inline size.**
  Beginning with NDB 8.0.30, it is possible to set a blob
  column's inline size as part of
  [`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement") or
  [`ALTER TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement"). The maximum
  inline size supported by NDB Cluster is 29980 bytes.

  For additional information and examples, see
  [NDB\_COLUMN Options](create-table-ndb-comment-options.html#create-table-ndb-comment-column-options "NDB_COLUMN Options"), as
  well as [String Type Storage Requirements](storage-requirements.html#data-types-storage-reqs-strings "String Type Storage Requirements").

* **replica\_allow\_batching enabled by default.**
  Replica write batching improves NDB Cluster Replication
  performance greatly, especially when replicating blob-type
  columns ([`TEXT`](blob.html "13.3.4 The BLOB and TEXT Types"),
  [`BLOB`](blob.html "13.3.4 The BLOB and TEXT Types"), and
  [`JSON`](json.html "13.5 The JSON Data Type")), and so generally
  should be enabled whenever using replication with NDB
  Cluster. For this reason, beginning with NDB 8.0.30, the
  [`replica_allow_batching`](mysql-cluster-options-variables.html#sysvar_replica_allow_batching)
  system variable is enabled by default, and setting it to
  `OFF` raises a warning.

* **Conflict resolution insert operation support.**
  Prior to NDB 8.0.30, there were only two strategies
  available for resolving primary key conflicts for update and
  delete operations, implemented as the functions
  `NDB$MAX()` and
  `NDB$MAX_DELETE_WIN()`. Neither of these
  has any effect on write operations, other than that a write
  operation with the same primary key as a previous write is
  always rejected, and accepted and applied only if no
  operation having the same primary key already exists. NDB
  8.0.30 introduces two new conflict resolution functions
  `NDB$MAX_INS()`
  and
  `NDB$MAX_DEL_WIN_INS()`
  that handle primary key conflicts between insert operations.
  These functions handle conflicting writes as follows:

  1. If there is no conflicting write, apply this one (this is
     the same as `NDB$MAX()`).

  2. Otherwise, apply “greatest timestamp wins”
     conflict resolution, as follows:

     1. If the timestamp for the incoming write is greater
        than that of the conflicting write, apply the incoming
        operation.

     2. If the timestamp for the incoming write is
        *not* greater, reject the incoming
        write operation.

  For conflicting update and delete operations,
  `NDB$MAX_INS()` behaves as
  `NDB$MAX()`
  does, and `NDB$MAX_DEL_WIN_INS()` behaves in
  the same way as
  `NDB$MAX_DELETE_WIN()`.

  This enhancement provides support for configuring conflict
  detection when handling conflicting replicated write
  operations, so that a replicated
  [`INSERT`](insert.html "15.2.7 INSERT Statement") with a higher timestamp
  column value is applied idempotently, while a replicated
  `INSERT` with a lower timestamp column value
  is rejected.

  As with the other conflict resolution functions, rejected
  operations can optionally be logged in an exceptions table;
  rejected operations increment a counter (status variables
  [`Ndb_conflict_fn_max`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_fn_max) for
  “greatest timestamp wins” and
  [`Ndb_conflict_fn_old`](mysql-cluster-options-variables.html#statvar_Ndb_conflict_fn_old) for
  “same timestamp wins”).

  For more information, see the descriptions of the new conflict
  resolution functions, and as well as
  [Section 25.7.12, “NDB Cluster Replication Conflict Resolution”](mysql-cluster-replication-conflict-resolution.html "25.7.12 NDB Cluster Replication Conflict Resolution").

* **Replication applier batch size control.**
  Previously, the size of batches used when writing to a
  replica NDB Cluster was controlled by
  [`--ndb-batch-size`](mysql-cluster-options-variables.html#option_mysqld_ndb-batch-size), and the
  batch size used for writing blob data to the replica was
  determined by
  [`ndb-blob-write-batch-bytes`](mysql-cluster-options-variables.html#option_mysqld_ndb-blob-write-batch-bytes).
  One problem with this arrangement was that the replica used
  the global values of these variables which meant that
  changing either of them for the replica also affected the
  value used by all other sessions. In addition, it was not
  possible to set different defaults for these values
  exclusive to the replica, which should preferably have a
  higher default value than other sessions.

  NDB 8.0.30 adds two new system variables which are specific to
  the replica applier.
  [`ndb_replica_batch_size`](mysql-cluster-options-variables.html#sysvar_ndb_replica_batch_size) now
  controls the batch size used for the replica applier, and
  [`ndb_replica_blob_write_batch_bytes`](mysql-cluster-options-variables.html#sysvar_ndb_replica_blob_write_batch_bytes)
  variable now determines the blob write batch size used to
  perform batch blob writes on the replica.

  This change should improve the behavior of MySQL NDB Cluster
  Replication using default settings, and lets the user fine
  tune NDB replication performance without affecting user
  threads, such as those performing processing of SQL queries.

  For more information, see the descriptions of the new
  variables. See also
  [Section 25.7.5, “Preparing the NDB Cluster for Replication”](mysql-cluster-replication-preparation.html "25.7.5 Preparing the NDB Cluster for Replication").

* **Binary Log Transaction Compression.**
  NDB 8.0.31 adds support for binary logs using compressed
  transactions with `ZSTD` compression. To
  enable this feature, set the
  [`ndb_log_transaction_compression`](mysql-cluster-options-variables.html#sysvar_ndb_log_transaction_compression)
  system variable introduced in this release to
  `ON`. The level of compression used can be
  controlled using the
  [`ndb_log_transaction_compression_level_zstd`](mysql-cluster-options-variables.html#sysvar_ndb_log_transaction_compression_level_zstd)
  system variable, which is also added in that release; the
  default compression level is 3.

  Although the
  [`binlog_transaction_compression`](replication-options-binary-log.html#sysvar_binlog_transaction_compression)
  and
  [`binlog_transaction_compression_level_zstd`](replication-options-binary-log.html#sysvar_binlog_transaction_compression_level_zstd)
  server system variables have no effect on binary logging of
  `NDB` tables, starting
  [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") with
  `--binlog-transaction-compression=ON` causes
  `ndb_log_transaction_compression` to be
  enabled automatically. You can disable it in a MySQL client
  session using `SET
  @@global.ndb_log_transaction_compression=OFF` after
  server startup has completed.

  See the description of
  [`ndb_log_transaction_compression`](mysql-cluster-options-variables.html#sysvar_ndb_log_transaction_compression)
  as well as
  [Section 7.4.4.5, “Binary Log Transaction Compression”](binary-log-transaction-compression.html "7.4.4.5 Binary Log Transaction Compression"), for more
  information.

* **NDB Replication: Multithreaded Applier.**
  As of NDB 8.0.33, NDB Cluster replication supports the MySQL
  multithreaded applier (MTA) on replica servers (and nonzero
  values of
  [`replica_parallel_workers`](replication-options-replica.html#sysvar_replica_parallel_workers)),
  which enables the application of binary log transactions in
  parallel on the replica and thereby increasing throughput.
  (For more information about the multithreaded applier in the
  MySQL server, see [Section 19.2.3, “Replication Threads”](replication-threads.html "19.2.3 Replication Threads").)

  Enabling this feature on the replica requires that the source
  be started with
  [`--ndb-log-transaction-dependency`](mysql-cluster-options-variables.html#option_mysqld_ndb-log-transaction-dependency)
  set to `ON` (this option is also implemented
  in NDB 8.0.33). It is also necessary on the source to set
  [`binlog_transaction_dependency_tracking`](replication-options-binary-log.html#sysvar_binlog_transaction_dependency_tracking)
  to `WRITESET`. In addition, you must ensure
  that [`replica_parallel_workers`](replication-options-replica.html#sysvar_replica_parallel_workers)
  has a value greater than 1 on the replica, and thus, that the
  replica uses multiple worker threads.

  For additional information and requirements, see
  [Section 25.7.11, “NDB Cluster Replication Using the Multithreaded Applier”](mysql-cluster-replication-mta.html "25.7.11 NDB Cluster Replication Using the Multithreaded Applier").

* **Changes in build options.**
  NDB 8.0.31 makes the following changes in CMake options used
  for building MySQL Cluster.

  + The [`WITH_NDBCLUSTER`](source-configuration-options.html#option_cmake_with_ndbcluster) option
    is deprecated, and
    [`WITH_PLUGIN_NDBCLUSTER`](source-configuration-options.html#option_cmake_with_plugin_ndbcluster) is
    removed.

  + To build MySQL Cluster from source, use the newly-added
    [`WITH_NDB`](source-configuration-options.html#option_cmake_with_ndb) option.

  + [`WITH_NDBCLUSTER_STORAGE_ENGINE`](source-configuration-options.html#option_cmake_with_ndbcluster_storage_engine)
    continues to be supported, but is no longer needed for
    most builds.

  See [CMake Options for Compiling NDB Cluster](source-configuration-options.html#cmake-mysql-cluster-options "CMake Options for Compiling NDB Cluster"), for more
  information.

* **File system encryption.**
  Transparent Data Encryption (TDE) provides protection by
  encryption of `NDB` data at rest, that is,
  of all `NDB` table data and log files which
  are persisted to disk. This is intended to protect against
  recovering data after obtaining unauthorized access to NDB
  Cluster data files such as tablespace files or logs.

  Encryption is implemented transparently by the NDB file system
  layer ([`NDBFS`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-ndbfs.html)) on the data
  nodes; data is encrypted and decrypted as it is read from and
  written to the file, and `NDBFS` internal
  client blocks operate on files as normal.

  `NDBFS` can transparently encrypt a file
  directly from a user provided password, but decoupling the
  encryption and decryption of individual files from the user
  provided password can be advantageous for reasons of
  efficiency, usability, security, and flexibility. See
  [Section 25.6.14.2, “NDB File System Encryption Implementation”](mysql-cluster-tde-implementation.html "25.6.14.2 NDB File System Encryption Implementation").

  TDE uses two types of keys. A secret key is used to encrypt
  the actual data and log files stored on disk (including LCP,
  redo, undo, and tablespace files). A master key is then used
  to encrypt the secret key.

  The
  [`EncryptedFileSystem`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-encryptedfilesystem)
  data node configuration parameter, available beginning with
  NDB 8.0.29, when set to `1`, enforces
  encryption on files storing table data. This includes LCP data
  files, redo log files, tablespace files, and undo log files.

  It is also necessary to provide a password to each data node
  when starting or restarting it, using one of the options
  [`--filesystem-password`](mysql-cluster-programs-ndbd.html#option_ndbd_filesystem-password) or
  [`--filesystem-password-from-stdin`](mysql-cluster-programs-ndbd.html#option_ndbd_filesystem-password-from-stdin).
  See [Section 25.6.14.1, “NDB File System Encryption Setup and Usage”](mysql-cluster-tde-setup.html "25.6.14.1 NDB File System Encryption Setup and Usage"). This password
  uses the same format and is subject to the same constraints as
  the password used for an encrypted `NDB`
  backup (see the description of the
  [**ndb\_restore**](mysql-cluster-programs-ndb-restore.html "25.5.23 ndb_restore — Restore an NDB Cluster Backup")
  [`--backup-password`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backup-password) option
  for details).

  Only tables using the `NDB` storage engine
  are subject to encryption by this feature; see
  [Section 25.6.14.3, “NDB File System Encryption Limitations”](mysql-cluster-tde-limitations.html "25.6.14.3 NDB File System Encryption Limitations"). Other tables,
  such as those used for `NDB` schema
  distribution, replication, and binary logging, typically use
  [`InnoDB`](innodb-storage-engine.html "Chapter 17 The InnoDB Storage Engine"); see
  [Section 17.13, “InnoDB Data-at-Rest Encryption”](innodb-data-encryption.html "17.13 InnoDB Data-at-Rest Encryption"). For information
  about encryption of binary log files, see
  [Section 19.3.2, “Encrypting Binary Log Files and Relay Log Files”](replication-binlog-encryption.html "19.3.2 Encrypting Binary Log Files and Relay Log Files").

  Files generated or used by `NDB` processes,
  such as operating system logs, crash logs, and core dumps, are
  not encrypted. Files used by `NDB` but not
  containing any user table data are also not encrypted; these
  include LCP control files, schema files, and system files (see
  [NDB Cluster Data Node File System](/doc/ndb-internals/en/ndb-internals-ndbd-filesystem.html)). The
  management server configuration cache is also not encrypted.

  In addition, NDB 8.0.31 adds a new utility
  [**ndb\_secretsfile\_reader**](mysql-cluster-programs-ndb-secretsfile-reader.html "25.5.24 ndb_secretsfile_reader — Obtain Key Information from an Encrypted NDB Data File") for extracting key
  information from a secrets file
  (`S0.sysfile`).

  This enhancement builds on work done in NDB 8.0.22 to
  implement encrypted `NDB` backups. For more
  information about encrypted backups, see the description of
  the
  [`RequireEncryptedBackup`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-requireencryptedbackup)
  configuration parameter, as well as
  [Section 25.6.8.2, “Using The NDB Cluster Management Client to Create a Backup”](mysql-cluster-backup-using-management-client.html "25.6.8.2 Using The NDB Cluster Management Client to Create a Backup").

* **Removal of unneeded program options.**
  A number of “junk” command-line options for NDB
  utility and other programs which had never been implemented
  were removed in NDB Cluster 8.0.31. The options and the
  programs from which they have been dropped are listed here:

  + `--ndb-optimized-node-selection`:

    [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon"), [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "25.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)"),
    [**ndb\_mgm**](mysql-cluster-programs-ndb-mgm.html "25.5.5 ndb_mgm — The NDB Cluster Management Client"),
    [**ndb\_delete\_all**](mysql-cluster-programs-ndb-delete-all.html "25.5.8 ndb_delete_all — Delete All Rows from an NDB Table"),
    [**ndb\_desc**](mysql-cluster-programs-ndb-desc.html "25.5.9 ndb_desc — Describe NDB Tables"),
    [**ndb\_drop\_index**](mysql-cluster-programs-ndb-drop-index.html "25.5.10 ndb_drop_index — Drop Index from an NDB Table"),
    [**ndb\_drop\_table**](mysql-cluster-programs-ndb-drop-table.html "25.5.11 ndb_drop_table — Drop an NDB Table"),
    **ndb\_show\_table**,
    [**ndb\_blob\_tool**](mysql-cluster-programs-ndb-blob-tool.html "25.5.6 ndb_blob_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables"),
    [**ndb\_config**](mysql-cluster-programs-ndb-config.html "25.5.7 ndb_config — Extract NDB Cluster Configuration Information"),
    [**ndb\_index\_stat**](mysql-cluster-programs-ndb-index-stat.html "25.5.14 ndb_index_stat — NDB Index Statistics Utility"),
    [**ndb\_move\_data**](mysql-cluster-programs-ndb-move-data.html "25.5.15 ndb_move_data — NDB Data Copy Utility"),
    [**ndbinfo\_select\_all**](mysql-cluster-programs-ndbinfo-select-all.html "25.5.2 ndbinfo_select_all — Select From ndbinfo Tables"),
    [**ndb\_select\_count**](mysql-cluster-programs-ndb-select-count.html "25.5.26 ndb_select_count — Print Row Counts for NDB Tables")

  + `--character-sets-dir`:

    [**ndb\_mgm**](mysql-cluster-programs-ndb-mgm.html "25.5.5 ndb_mgm — The NDB Cluster Management Client"), [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "25.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon"),
    [**ndb\_config**](mysql-cluster-programs-ndb-config.html "25.5.7 ndb_config — Extract NDB Cluster Configuration Information"),
    [**ndb\_delete\_all**](mysql-cluster-programs-ndb-delete-all.html "25.5.8 ndb_delete_all — Delete All Rows from an NDB Table"),
    [**ndb\_desc**](mysql-cluster-programs-ndb-desc.html "25.5.9 ndb_desc — Describe NDB Tables"),
    [**ndb\_drop\_index**](mysql-cluster-programs-ndb-drop-index.html "25.5.10 ndb_drop_index — Drop Index from an NDB Table"),
    [**ndb\_drop\_table**](mysql-cluster-programs-ndb-drop-table.html "25.5.11 ndb_drop_table — Drop an NDB Table"),
    **ndb\_show\_table**,
    [**ndb\_blob\_tool**](mysql-cluster-programs-ndb-blob-tool.html "25.5.6 ndb_blob_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables"),
    [**ndb\_config**](mysql-cluster-programs-ndb-config.html "25.5.7 ndb_config — Extract NDB Cluster Configuration Information"),
    [**ndb\_index\_stat**](mysql-cluster-programs-ndb-index-stat.html "25.5.14 ndb_index_stat — NDB Index Statistics Utility"),
    [**ndb\_move\_data**](mysql-cluster-programs-ndb-move-data.html "25.5.15 ndb_move_data — NDB Data Copy Utility"),
    [**ndbinfo\_select\_all**](mysql-cluster-programs-ndbinfo-select-all.html "25.5.2 ndbinfo_select_all — Select From ndbinfo Tables"),
    [**ndb\_select\_count**](mysql-cluster-programs-ndb-select-count.html "25.5.26 ndb_select_count — Print Row Counts for NDB Tables"),
    [**ndb\_waiter**](mysql-cluster-programs-ndb-waiter.html "25.5.30 ndb_waiter — Wait for NDB Cluster to Reach a Given Status")

  + `--core-file`:

    [**ndb\_mgm**](mysql-cluster-programs-ndb-mgm.html "25.5.5 ndb_mgm — The NDB Cluster Management Client"), [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "25.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon"),
    [**ndb\_config**](mysql-cluster-programs-ndb-config.html "25.5.7 ndb_config — Extract NDB Cluster Configuration Information"),
    [**ndb\_delete\_all**](mysql-cluster-programs-ndb-delete-all.html "25.5.8 ndb_delete_all — Delete All Rows from an NDB Table"),
    [**ndb\_desc**](mysql-cluster-programs-ndb-desc.html "25.5.9 ndb_desc — Describe NDB Tables"),
    [**ndb\_drop\_index**](mysql-cluster-programs-ndb-drop-index.html "25.5.10 ndb_drop_index — Drop Index from an NDB Table"),
    [**ndb\_drop\_table**](mysql-cluster-programs-ndb-drop-table.html "25.5.11 ndb_drop_table — Drop an NDB Table"),
    **ndb\_show\_table**,
    [**ndb\_blob\_tool**](mysql-cluster-programs-ndb-blob-tool.html "25.5.6 ndb_blob_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables"),
    [**ndb\_config**](mysql-cluster-programs-ndb-config.html "25.5.7 ndb_config — Extract NDB Cluster Configuration Information"),
    [**ndb\_index\_stat**](mysql-cluster-programs-ndb-index-stat.html "25.5.14 ndb_index_stat — NDB Index Statistics Utility"),
    [**ndb\_move\_data**](mysql-cluster-programs-ndb-move-data.html "25.5.15 ndb_move_data — NDB Data Copy Utility"),
    [**ndbinfo\_select\_all**](mysql-cluster-programs-ndbinfo-select-all.html "25.5.2 ndbinfo_select_all — Select From ndbinfo Tables"),
    [**ndb\_select\_count**](mysql-cluster-programs-ndb-select-count.html "25.5.26 ndb_select_count — Print Row Counts for NDB Tables"),
    [**ndb\_waiter**](mysql-cluster-programs-ndb-waiter.html "25.5.30 ndb_waiter — Wait for NDB Cluster to Reach a Given Status")

  + `--connect-retries` and
    `--connect-retry-delay`:

    [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "25.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon")

  + `--ndb-nodeid`:

    [**ndb\_config**](mysql-cluster-programs-ndb-config.html "25.5.7 ndb_config — Extract NDB Cluster Configuration Information")

  For more information, see the relevant program and option
  descriptions in [Section 25.5, “NDB Cluster Programs”](mysql-cluster-programs.html "25.5 NDB Cluster Programs").

* **Reading Configuration Cache Files.**
  Beginning with NDB 8.0.32, it is possible to read binary
  configuration cache files created by
  [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "25.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") using the
  [**ndb\_config**](mysql-cluster-programs-ndb-config.html "25.5.7 ndb_config — Extract NDB Cluster Configuration Information") option
  [`--config-binary-file`](mysql-cluster-programs-ndb-config.html#option_ndb_config_config-binary-file)
  introduced in that release. This can simplify the process of
  determining whether the settings in a given configuration
  file have been applied to the cluster, or of recovery of
  settings from the binary cache after the
  `config.ini` file has somehow been
  damaged or lost.

  For more information and examples, see the description of this
  option in [Section 25.5.7, “ndb\_config — Extract NDB Cluster Configuration Information”](mysql-cluster-programs-ndb-config.html "25.5.7 ndb_config — Extract NDB Cluster Configuration Information").

* **ndbinfo transporter\_details table.**
  This [`ndbinfo`](mysql-cluster-ndbinfo.html "25.6.16 ndbinfo: The NDB Cluster Information Database") table
  provides information about individual transporters used in
  an NDB cluster. Added in NDB 8.0.37, it is otherwise similar
  to the `ndbinfo`
  [`transporters`](mysql-cluster-ndbinfo-transporters.html "25.6.16.65 The ndbinfo transporters Table") table.

  Several additional columns were added to this table in NDB
  8.0.38. These are listed here:

  + `sendbuffer_used_bytes`
  + `sendbuffer_max_used_bytes`
  + `sendbuffer_alloc_bytes`
  + `sendbuffer_max_alloc_bytes`
  + `type`

  See
  [Section 25.6.16.64, “The ndbinfo transporter\_details Table”](mysql-cluster-ndbinfo-transporter-details.html "25.6.16.64 The ndbinfo transporter_details Table"),
  for more information.

* **Binary log transaction cache sizing.**
  `NDB` 8.0.40 adds the
  [`ndb_log_cache_size`](mysql-cluster-options-variables.html#sysvar_ndb_log_cache_size) server
  system variable, which makes it possible to set the size of
  the transaction cache used for writing the binary log. This
  enables use of a large cache for logging NDB transactions,
  and (using
  [`binlog_cache_size`](replication-options-binary-log.html#sysvar_binlog_cache_size)) a
  smaller cache for logging other transactions, thus making
  more efficient use of resources.

* **Ndb.cfg file deprecation.**
  Use of an `Ndb.cfg` file for setting the
  connection string for an NDB process was not well documented
  or supported. As of NDB 8.0.40, use of this file is now
  formally deprecated; you should expect support for it to be
  removed in a future release of MySQL Cluster.

MySQL Cluster Manager provides support for NDB Cluster 8.0. MySQL Cluster Manager has an advanced
command-line interface that can simplify many complex NDB Cluster
management tasks. See [MySQL Cluster Manager 8.0.43 User Manual](/doc/mysql-cluster-manager/8.0/en/), for more information.