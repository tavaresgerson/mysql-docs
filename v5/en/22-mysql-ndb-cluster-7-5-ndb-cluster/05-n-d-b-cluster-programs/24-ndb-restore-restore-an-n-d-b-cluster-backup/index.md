### 21.5.24 ndb_restore — Restore an NDB Cluster Backup

[21.5.24.1 Restoring an NDB Backup to a Different Version of NDB Cluster](ndb-restore-to-different-version.html)

[21.5.24.2 Restoring to a different number of data nodes](ndb-restore-different-number-nodes.html)

The NDB Cluster restoration program is implemented as a separate command-line utility [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup"), which can normally be found in the MySQL `bin` directory. This program reads the files created as a result of the backup and inserts the stored information into the database.

Note

Beginning with NDB 7.5.15 and 7.6.11, this program no longer prints `NDBT_ProgramExit: ...` when it finishes its run. Applications depending on this behavior should be modified accordingly when upgrading from earlier releases.

[**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") must be executed once for each of the backup files that were created by the [`START BACKUP`](mysql-cluster-backup-using-management-client.html "21.6.8.2 Using The NDB Cluster Management Client to Create a Backup") command used to create the backup (see [Section 21.6.8.2, “Using The NDB Cluster Management Client to Create a Backup”](mysql-cluster-backup-using-management-client.html "21.6.8.2 Using The NDB Cluster Management Client to Create a Backup")). This is equal to the number of data nodes in the cluster at the time that the backup was created.

Note

Before using [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup"), it is recommended that the cluster be running in single user mode, unless you are restoring multiple data nodes in parallel. See [Section 21.6.6, “NDB Cluster Single User Mode”](mysql-cluster-single-user-mode.html "21.6.6 NDB Cluster Single User Mode"), for more information.

Options that can be used with [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") are shown in the following table. Additional descriptions follow the table.

**Table 21.38 Command-line options used with the program ndb_restore**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Format</th> <th>Description</th> <th>Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code> --allow-pk-changes[=0|1] </code> </p></th> <td>Allow changes to set of columns making up table's primary key</td> <td><p> ADDED: NDB 7.6.14 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --append </code> </p></th> <td>Append data to tab-delimited file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --backup-path=path </code> </p></th> <td>Path to backup files directory</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--backupid=#</code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">-b
                #</a> </code> </p></th> <td>Restore from backup having this ID</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Alias for --connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retries=# </code> </p></th> <td>Number of times to retry connection before giving up</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retry-delay=# </code> </p></th> <td>Number of seconds to wait between attempts to contact management server</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --core-file </code> </p></th> <td>Write core file on error; used in debugging</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-extra-file=path </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-file=path </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-group-suffix=string </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --disable-indexes </code> </p></th> <td>Causes indexes from backup to be ignored; may decrease time needed to restore data</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--dont-ignore-systab-0</code>, </p><p> <code> -f </code> </p></th> <td>Do not ignore system table during restore; experimental only; not for production use</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --exclude-databases=list </code> </p></th> <td>List of one or more databases to exclude (includes those not named)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --exclude-intermediate-sql-tables[=TRUE|FALSE] </code> </p></th> <td>Do not restore any intermediate tables (having names prefixed with '#sql-') that were left over from copying ALTER TABLE operations; specify FALSE to restore such tables</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --exclude-missing-columns </code> </p></th> <td>Causes columns from backup version of table that are missing from version of table in database to be ignored</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --exclude-missing-tables </code> </p></th> <td>Causes tables from backup that are missing from database to be ignored</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --exclude-tables=list </code> </p></th> <td>List of one or more tables to exclude (includes those in same database that are not named); each table reference must include database name</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --fields-enclosed-by=char </code> </p></th> <td>Fields are enclosed by this character</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --fields-optionally-enclosed-by </code> </p></th> <td>Fields are optionally enclosed by this character</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --fields-terminated-by=char </code> </p></th> <td>Fields are terminated by this character</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code> -? </code> </p></th> <td>Display help text and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --hex </code> </p></th> <td>Print binary types in hexadecimal format</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ignore-extended-pk-updates[=0|1] </code> </p></th> <td>Ignore log entries containing updates to columns now included in extended primary key</td> <td><p> ADDED: NDB 7.6.14 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --include-databases=list </code> </p></th> <td>List of one or more databases to restore (excludes those not named)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --include-tables=list </code> </p></th> <td>List of one or more tables to restore (excludes those in same database that are not named); each table reference must include database name</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --lines-terminated-by=char </code> </p></th> <td>Lines are terminated by this character</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --login-path=path </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--lossy-conversions</code>, </p><p> <code> -L </code> </p></th> <td>Allow lossy conversions of column values (type demotions or changes in sign) when restoring data from backup</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-binlog </code> </p></th> <td>If mysqld is connected and using binary logging, do not log restored data</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-defaults </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--no-restore-disk-objects</code>, </p><p> <code> -d </code> </p></th> <td>Do not restore objects relating to Disk Data</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--no-upgrade</code>, </p><p> <code> -u </code> </p></th> <td>Do not upgrade array type for varsize attributes which do not already resize VAR data, and do not change column attributes</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-nodegroup-map=map</code>, </p><p> <code> -z </code> </p></th> <td>Specify node group map; unused, unsupported</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-nodeid=# </code> </p></th> <td>Set node ID for this node, overriding any ID set by --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-optimized-node-selection </code> </p></th> <td>Enable optimizations for selection of nodes for transactions. Enabled by default; use --skip-ndb-optimized-node-selection to disable</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--nodeid=#</code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_nodeid">-n
                #</a> </code> </p></th> <td>ID of node where backup was taken</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --num-slices=# </code> </p></th> <td>Number of slices to apply when restoring by slice</td> <td><p> ADDED: NDB 7.6.13 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--parallelism=#</code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_parallelism">-p
                #</a> </code> </p></th> <td>Number of parallel transactions to use while restoring data</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--preserve-trailing-spaces</code>, </p><p> <code> -P </code> </p></th> <td>Allow preservation of trailing spaces (including padding) when promoting fixed-width string types to variable-width types</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print </code> </p></th> <td>Print metadata, data, and log to stdout (equivalent to --print-meta --print-data --print-log)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-data </code> </p></th> <td>Print data to stdout</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-defaults </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-log </code> </p></th> <td>Print log to stdout</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-meta </code> </p></th> <td>Print metadata to stdout</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-sql-log </code> </p></th> <td>Write SQL log to stdout</td> <td><p> ADDED: NDB 7.5.4 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --progress-frequency=# </code> </p></th> <td>Print status of restore each given number of seconds</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--promote-attributes</code>, </p><p> <code> -A </code> </p></th> <td>Allow attributes to be promoted when restoring data from backup</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --rebuild-indexes </code> </p></th> <td>Causes multithreaded rebuilding of ordered indexes found in backup; number of threads used is determined by setting BuildIndexThreads</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --remap-column=string </code> </p></th> <td>Apply offset to value of specified column using indicated function and arguments. Format is [db].[tbl].[col]:[fn]:[args]; see documentation for details</td> <td><p> ADDED: NDB 7.6.14 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--restore-data</code>, </p><p> <code> -r </code> </p></th> <td>Restore table data and logs into NDB Cluster using NDB API</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--restore-epoch</code>, </p><p> <code> -e </code> </p></th> <td>Restore epoch info into status table; useful on replica cluster for starting replication; updates or inserts row in mysql.ndb_apply_status with ID 0</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--restore-meta</code>, </p><p> <code> -m </code> </p></th> <td>Restore metadata to NDB Cluster using NDB API</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --restore-privilege-tables </code> </p></th> <td>Restore MySQL privilege tables that were previously moved to NDB</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --rewrite-database=string </code> </p></th> <td>Restore to differently named database; format is olddb,newdb</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --skip-broken-objects </code> </p></th> <td>Ignore missing blob tables in backup file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--skip-table-check</code>, </p><p> <code> -s </code> </p></th> <td>Skip table structure check during restore</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --skip-unknown-objects </code> </p></th> <td>Causes schema objects not recognized by ndb_restore to be ignored when restoring backup made from newer NDB version to older version</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --slice-id=# </code> </p></th> <td>Slice ID, when restoring by slices</td> <td><p> ADDED: NDB 7.6.13 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--tab=path</code>, </p><p> <code> -T path </code> </p></th> <td>Creates a tab-separated .txt file for each table in path provided</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --timestamp-printouts{=true|false} </code> </p></th> <td>Prefix all info, error, and debug log messages with timestamps</td> <td><p> ADDED: NDB 7.5.30, 5.7.41-ndb-7.6.26 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code> -? </code> </p></th> <td>Display help text and exit; same as --help</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --verbose=# </code> </p></th> <td>Level of verbosity in output</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code> -V </code> </p></th> <td>Display version information and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody></table>

* `--allow-pk-changes`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><tbody><tr><th>Command-Line Format</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>

  When this option is set to `1`, [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") allows the primary keys in a table definition to differ from that of the same table in the backup. This may be desirable when backing up and restoring between different schema versions with primary key changes on one or more tables, and it appears that performing the restore operation using ndb_restore is simpler or mor efficient than issuing many [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statements after restoring table schemas and data.

  The following changes in primary key definitions are supported by `--allow-pk-changes`:

  + **Extending the primary key**: A non-nullable column that exists in the table schema in the backup becomes part of the table's primary key in the database.

    Important

    When extending a table's primary key, any columns which become part of primary key must not be updated while the backup is being taken; any such updates discovered by [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") cause the restore operation to fail, even when no change in value takes place. In some cases, it may be possible to override this behavior using the [`--ignore-extended-pk-updates`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_ignore-extended-pk-updates) option; see the description of this option for more information.

  + **Contracting the primary key (1)**: A column that is already part of the table's primary key in the backup schema is no longer part of the primary key, but remains in the table.

  + **Contracting the primary key (2)**: A column that is already part of the table's primary key in the backup schema is removed from the table entirely.

  These differences can be combined with other schema differences supported by [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup"), including changes to blob and text columns requiring the use of staging tables.

  Basic steps in a typical scenario using primary key schema changes are listed here:

  1. Restore table schemas using [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") [`--restore-meta`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_restore-meta)

  2. Alter schema to that desired, or create it
  3. Back up the desired schema
  4. Run [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") [`--disable-indexes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_disable-indexes) using the backup from the previous step, to drop indexes and constraints

  5. Run [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") [`--allow-pk-changes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_allow-pk-changes) (possibly along with [`--ignore-extended-pk-updates`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_ignore-extended-pk-updates), [`--disable-indexes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_disable-indexes), and possibly other options as needed) to restore all data

  6. Run [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") [`--rebuild-indexes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_rebuild-indexes) using the backup made with the desired schema, to rebuild indexes and constraints

  When extending the primary key, it may be necessary for [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") to use a temporary secondary unique index during the restore operation to map from the old primary key to the new one. Such an index is created only when necessary to apply events from the backup log to a table which has an extended primary key. This index is named `NDB$RESTORE_PK_MAPPING`, and is created on each table requiring it; it can be shared, if necessary, by multiple instances of [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") instances running in parallel. (Running [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") [`--rebuild-indexes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_rebuild-indexes) at the end of the restore process causes this index to be dropped.)

* `--append`

  <table frame="box" rules="all" summary="Properties for append"><tbody><tr><th>Command-Line Format</th> <td><code>--append</code></td> </tr></tbody></table>

  When used with the [`--tab`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_tab) and [`--print-data`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_print-data) options, this causes the data to be appended to any existing files having the same names.

* `--backup-path`=*`dir_name`*

  <table frame="box" rules="all" summary="Properties for backup-path"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>./</code></td> </tr></tbody></table>

  The path to the backup directory is required; this is supplied to [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") using the `--backup-path` option, and must include the subdirectory corresponding to the ID backup of the backup to be restored. For example, if the data node's [`DataDir`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datadir) is `/var/lib/mysql-cluster`, then the backup directory is `/var/lib/mysql-cluster/BACKUP`, and the backup files for the backup with the ID 3 can be found in `/var/lib/mysql-cluster/BACKUP/BACKUP-3`. The path may be absolute or relative to the directory in which the [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") executable is located, and may be optionally prefixed with `backup-path=`.

  It is possible to restore a backup to a database with a different configuration than it was created from. For example, suppose that a backup with backup ID `12`, created in a cluster with two storage nodes having the node IDs `2` and `3`, is to be restored to a cluster with four nodes. Then [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") must be run twice—once for each storage node in the cluster where the backup was taken. However, [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") cannot always restore backups made from a cluster running one version of MySQL to a cluster running a different MySQL version. See [Section 21.3.7, “Upgrading and Downgrading NDB Cluster”](mysql-cluster-upgrade-downgrade.html "21.3.7 Upgrading and Downgrading NDB Cluster"), for more information.

  Important

  It is not possible to restore a backup made from a newer version of NDB Cluster using an older version of [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup"). You can restore a backup made from a newer version of MySQL to an older cluster, but you must use a copy of [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") from the newer NDB Cluster version to do so.

  For example, to restore a cluster backup taken from a cluster running NDB Cluster 7.6.36 to a cluster running NDB Cluster 7.5.36, you must use the [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") that comes with the NDB Cluster 7.6.36 distribution.

  For more rapid restoration, the data may be restored in parallel, provided that there is a sufficient number of cluster connections available. That is, when restoring to multiple nodes in parallel, you must have an `[api]` or `[mysqld]` section in the cluster `config.ini` file available for each concurrent [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") process. However, the data files must always be applied before the logs.

* `--backupid`=*`#`*, `-b`

  <table frame="box" rules="all" summary="Properties for backupid"><tbody><tr><th>Command-Line Format</th> <td><code>--backupid=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr></tbody></table>

  This option is used to specify the ID or sequence number of the backup, and is the same number shown by the management client in the `Backup backup_id completed` message displayed upon completion of a backup. (See [Section 21.6.8.2, “Using The NDB Cluster Management Client to Create a Backup”](mysql-cluster-backup-using-management-client.html "21.6.8.2 Using The NDB Cluster Management Client to Create a Backup").)

  Important

  When restoring cluster backups, you must be sure to restore all data nodes from backups having the same backup ID. Using files from different backups can at best result in restoring the cluster to an inconsistent state, and may fail altogether.

  In NDB 7.5.13 and later, and in NDB 7.6.9 and later, this option is required.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Directory containing character sets.

* `--connect`, `-c`

  <table frame="box" rules="all" summary="Properties for connect"><tbody><tr><th>Command-Line Format</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost:1186</code></td> </tr></tbody></table>

  Alias for [`--ndb-connectstring`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_ndb-connectstring).

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

  Number of times to retry connection before giving up.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

  Number of seconds to wait between attempts to contact management server.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Same as [`--ndb-connectstring`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_ndb-connectstring).

* `--core-file`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><tbody><tr><th>Command-Line Format</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>

  Write core file on error; used in debugging.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><tbody><tr><th>Command-Line Format</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>

  Read given file after global files are read.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><tbody><tr><th>Command-Line Format</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>

  Read default options from given file only.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><tbody><tr><th>Command-Line Format</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>

  Also read groups with concat(group, suffix).

* `--disable-indexes`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><tbody><tr><th>Command-Line Format</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>

  Disable restoration of indexes during restoration of the data from a native `NDB` backup. Afterwards, you can restore indexes for all tables at once with multithreaded building of indexes using [`--rebuild-indexes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_rebuild-indexes), which should be faster than rebuilding indexes concurrently for very large tables.

  Beginning with NDB 7.5.24 and NDB 7.6.20, this option also drops any foreign keys specified in the backup.

* `--dont-ignore-systab-0`, `-f`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><tbody><tr><th>Command-Line Format</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>

  Normally, when restoring table data and metadata, [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") ignores the copy of the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") system table that is present in the backup. `--dont-ignore-systab-0` causes the system table to be restored. *This option is intended for experimental and development use only, and is not recommended in a production environment*.

* `--exclude-databases`=*`db-list`*

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><tbody><tr><th>Command-Line Format</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>

  Comma-delimited list of one or more databases which should not be restored.

  This option is often used in combination with [`--exclude-tables`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_exclude-tables); see that option's description for further information and examples.

* `--exclude-intermediate-sql-tables[`=*`TRUE|FALSE]`*

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><tbody><tr><th>Command-Line Format</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>

  When performing copying [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") operations, [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") creates intermediate tables (whose names are prefixed with `#sql-`). When `TRUE`, the `--exclude-intermediate-sql-tables` option keeps [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") from restoring such tables that may have been left over from these operations. This option is `TRUE` by default.

* `--exclude-missing-columns`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><tbody><tr><th>Command-Line Format</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>

  It is possible to restore only selected table columns using this option, which causes [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") to ignore any columns missing from tables being restored as compared to the versions of those tables found in the backup. This option applies to all tables being restored. If you wish to apply this option only to selected tables or databases, you can use it in combination with one or more of the `--include-*` or `--exclude-*` options described elsewhere in this section to do so, then restore data to the remaining tables using a complementary set of these options.

* `--exclude-missing-tables`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><tbody><tr><th>Command-Line Format</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>

  It is possible to restore only selected tables using this option, which causes [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") to ignore any tables from the backup that are not found in the target database.

* `--exclude-tables`=*`table-list`*

  <table frame="box" rules="all" summary="Properties for append"><tbody><tr><th>Command-Line Format</th> <td><code>--append</code></td> </tr></tbody></table>

  List of one or more tables to exclude; each table reference must include the database name. Often used together with [`--exclude-databases`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_exclude-databases).

  When `--exclude-databases` or `--exclude-tables` is used, only those databases or tables named by the option are excluded; all other databases and tables are restored by [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup").

  This table shows several invocations of [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") usng `--exclude-*` options (other options possibly required have been omitted for clarity), and the effects these options have on restoring from an NDB Cluster backup:

  **Table 21.39 Several invocations of ndb_restore using --exclude-\* options, and the effects these options have on restoring from an NDB Cluster backup.**

  <table frame="box" rules="all" summary="Properties for append"><tbody><tr><th>Command-Line Format</th> <td><code>--append</code></td> </tr></tbody></table>

  You can use these two options together. For example, the following causes all tables in all databases *except for* databases `db1` and `db2`, and tables `t1` and `t2` in database `db3`, to be restored:

  ```sql
  $> ndb_restore [...] --exclude-databases=db1,db2 --exclude-tables=db3.t1,db3.t2
  ```

  (Again, we have omitted other possibly necessary options in the interest of clarity and brevity from the example just shown.)

  You can use `--include-*` and `--exclude-*` options together, subject to the following rules:

  + The actions of all `--include-*` and `--exclude-*` options are cumulative.

  + All `--include-*` and `--exclude-*` options are evaluated in the order passed to ndb_restore, from right to left.

  + In the event of conflicting options, the first (rightmost) option takes precedence. In other words, the first option (going from right to left) that matches against a given database or table “wins”.

  For example, the following set of options causes [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") to restore all tables from database `db1` except `db1.t1`, while restoring no other tables from any other databases:

  ```sql
  --include-databases=db1 --exclude-tables=db1.t1
  ```

  However, reversing the order of the options just given simply causes all tables from database `db1` to be restored (including `db1.t1`, but no tables from any other database), because the [`--include-databases`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_include-databases) option, being farthest to the right, is the first match against database `db1` and thus takes precedence over any other option that matches `db1` or any tables in `db1`:

  ```sql
  --exclude-tables=db1.t1 --include-databases=db1
  ```

* `--fields-enclosed-by`=*`char`*

  <table frame="box" rules="all" summary="Properties for append"><tbody><tr><th>Command-Line Format</th> <td><code>--append</code></td> </tr></tbody></table>

  Each column value is enclosed by the string passed to this option (regardless of data type; see the description of [`--fields-optionally-enclosed-by`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_fields-optionally-enclosed-by)).

* `--fields-optionally-enclosed-by`

  <table frame="box" rules="all" summary="Properties for append"><tbody><tr><th>Command-Line Format</th> <td><code>--append</code></td> </tr></tbody></table>

  The string passed to this option is used to enclose column values containing character data (such as [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), [`BINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types"), or [`ENUM`](enum.html "11.3.5 The ENUM Type")).

* `--fields-terminated-by`=*`char`*

  <table frame="box" rules="all" summary="Properties for append"><tbody><tr><th>Command-Line Format</th> <td><code>--append</code></td> </tr></tbody></table>

  The string passed to this option is used to separate column values. The default value is a tab character (`\t`).

* `--help`

  <table frame="box" rules="all" summary="Properties for append"><tbody><tr><th>Command-Line Format</th> <td><code>--append</code></td> </tr></tbody></table>

  Display help text and exit.

* `--hex`

  <table frame="box" rules="all" summary="Properties for append"><tbody><tr><th>Command-Line Format</th> <td><code>--append</code></td> </tr></tbody></table>

  If this option is used, all binary values are output in hexadecimal format.

* `--ignore-extended-pk-updates`

  <table frame="box" rules="all" summary="Properties for append"><tbody><tr><th>Command-Line Format</th> <td><code>--append</code></td> </tr></tbody></table>

  When using the [`--allow-pk-changes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_allow-pk-changes) option, columns which become part of a table's primary key must not be updated while the backup is being taken; such columns should keep the same values from the time values are inserted into them until the rows containing the values are deleted. If [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") encounters updates to these columns when restoring a backup, the restore fails. Because some applications may set values for all columns when updating a row, even when some column values are not changed, the backup may include log events appearing to update columns which are not in fact modified. In such cases you can set `--ignore-extended-pk-updates` to `1`, forcing [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") to ignore such updates.

  Important

  When causing these updates to be ignored, the user is responsible for ensuring that there are no updates to the values of any columns that become part of the primary key.

  For more information, see the description of [`--allow-pk-changes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_allow-pk-changes).

* `--include-databases`=*`db-list`*

  <table frame="box" rules="all" summary="Properties for append"><tbody><tr><th>Command-Line Format</th> <td><code>--append</code></td> </tr></tbody></table>

  Comma-delimited list of one or more databases to restore. Often used together with [`--include-tables`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_include-tables); see the description of that option for further information and examples.

* `--include-tables`=*`table-list`*

  <table frame="box" rules="all" summary="Properties for append"><tbody><tr><th>Command-Line Format</th> <td><code>--append</code></td> </tr></tbody></table>

  Comma-delimited list of tables to restore; each table reference must include the database name.

  When `--include-databases` or `--include-tables` is used, only those databases or tables named by the option are restored; all other databases and tables are excluded by [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup"), and are not restored.

  The following table shows several invocations of [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") using `--include-*` options (other options possibly required have been omitted for clarity), and the effects these have on restoring from an NDB Cluster backup:

  **Table 21.40 Several invocations of ndb_restore using --include-\* options, and their effects on restoring from an NDB Cluster backup.**

  <table frame="box" rules="all" summary="Properties for backup-path"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>./</code></td> </tr></tbody></table>

  You can also use these two options together. For example, the following causes all tables in databases `db1` and `db2`, together with the tables `t1` and `t2` in database `db3`, to be restored (and no other databases or tables):

  ```sql
  $> ndb_restore [...] --include-databases=db1,db2 --include-tables=db3.t1,db3.t2
  ```

  (Again we have omitted other, possibly required, options in the example just shown.)

  It also possible to restore only selected databases, or selected tables from a single database, without any `--include-*` (or `--exclude-*`) options, using the syntax shown here:

  ```sql
  ndb_restore other_options db_name,[db_name[,...] | tbl_name[,tbl_name][,...
  ```

  In other words, you can specify either of the following to be restored:

  + All tables from one or more databases
  + One or more tables from a single database
* `--lines-terminated-by`=*`char`*

  <table frame="box" rules="all" summary="Properties for backup-path"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>./</code></td> </tr></tbody></table>

  Specifies the string used to end each line of output. The default is a linefeed character (`\n`).

* `--login-path`

  <table frame="box" rules="all" summary="Properties for backup-path"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>./</code></td> </tr></tbody></table>

  Read given path from login file.

* `--lossy-conversions`, `-L`

  <table frame="box" rules="all" summary="Properties for backup-path"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>./</code></td> </tr></tbody></table>

  This option is intended to complement the [`--promote-attributes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_promote-attributes) option. Using `--lossy-conversions` allows lossy conversions of column values (type demotions or changes in sign) when restoring data from backup. With some exceptions, the rules governing demotion are the same as for MySQL replication; see [Section 16.4.1.10.2, “Replication of Columns Having Different Data Types”](replication-features-differing-tables.html#replication-features-different-data-types "16.4.1.10.2 Replication of Columns Having Different Data Types"), for information about specific type conversions currently supported by attribute demotion.

  Beginning with NDB 7.5.23 and NDB 7.6.19, this option also makes it possible to restore a `NULL` column as `NOT NULL`. The column must not contain any `NULL` entries; otherwise [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") stops with an error.

  [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") reports any truncation of data that it performs during lossy conversions once per attribute and column.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for backup-path"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>./</code></td> </tr></tbody></table>

  Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for backup-path"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>./</code></td> </tr></tbody></table>

  Same as [`--ndb-connectstring`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_ndb-connectstring).

* `--ndb-nodegroup-map`=*`map`*, `-z`

  <table frame="box" rules="all" summary="Properties for backup-path"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>./</code></td> </tr></tbody></table>

  Intended for restoring a backup taken from one node group to a different node group, but never completely implemented; unsupported.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for backup-path"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>./</code></td> </tr></tbody></table>

  Set node ID for this node, overriding any ID set by [`--ndb-connectstring`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_ndb-connectstring).

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for backup-path"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>./</code></td> </tr></tbody></table>

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--no-binlog`

  <table frame="box" rules="all" summary="Properties for backup-path"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>./</code></td> </tr></tbody></table>

  This option prevents any connected SQL nodes from writing data restored by [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") to their binary logs.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for backupid"><tbody><tr><th>Command-Line Format</th> <td><code>--backupid=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr></tbody></table>

  Do not read default options from any option file other than login file.

* `--no-restore-disk-objects`, `-d`

  <table frame="box" rules="all" summary="Properties for backupid"><tbody><tr><th>Command-Line Format</th> <td><code>--backupid=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr></tbody></table>

  This option stops [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") from restoring any NDB Cluster Disk Data objects, such as tablespaces and log file groups; see [Section 21.6.11, “NDB Cluster Disk Data Tables”](mysql-cluster-disk-data.html "21.6.11 NDB Cluster Disk Data Tables"), for more information about these.

* `--no-upgrade`, `-u`

  <table frame="box" rules="all" summary="Properties for backupid"><tbody><tr><th>Command-Line Format</th> <td><code>--backupid=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr></tbody></table>

  When using [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") to restore a backup, [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") columns created using the old fixed format are resized and recreated using the variable-width format now employed. This behavior can be overridden by specifying `--no-upgrade`.

* `--nodeid`=*`#`*, `-n`

  <table frame="box" rules="all" summary="Properties for backupid"><tbody><tr><th>Command-Line Format</th> <td><code>--backupid=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr></tbody></table>

  Specify the node ID of the data node on which the backup was taken.

  When restoring to a cluster with different number of data nodes from that where the backup was taken, this information helps identify the correct set or sets of files to be restored to a given node. (In such cases, multiple files usually need to be restored to a single data node.) See [Section 21.5.24.2, “Restoring to a different number of data nodes”](ndb-restore-different-number-nodes.html "21.5.24.2 Restoring to a different number of data nodes"), for additional information and examples.

  In NDB 7.5.13 and later, and in NDB 7.6.9 and later, this option is required.

* `--num-slices`=*`#`*

  <table frame="box" rules="all" summary="Properties for backupid"><tbody><tr><th>Command-Line Format</th> <td><code>--backupid=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr></tbody></table>

  When restoring a backup by slices, this option sets the number of slices into which to divide the backup. This allows multiple instances of [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") to restore disjoint subsets in parallel, potentially reducing the amount of time required to perform the restore operation.

  A *slice* is a subset of the data in a given backup; that is, it is a set of fragments having the same slice ID, specified using the [`--slice-id`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_slice-id) option. The two options must always be used together, and the value set by `--slice-id` must always be less than the number of slices.

  [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") encounters fragments and assigns each one a fragment counter. When restoring by slices, a slice ID is assigned to each fragment; this slice ID is in the range 0 to 1 less than the number of slices. For a table that is not a [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") table, the slice to which a given fragment belongs is determined using the formula shown here:

  ```sql
  [slice_ID] = [fragment_counter] % [number_of_slices]
  ```

  For a [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") table, a fragment counter is not used; the fragment number is used instead, along with the ID of the main table for the `BLOB` table (recall that `NDB` stores *`BLOB`* values in a separate table internally). In this case, the slice ID for a given fragment is calculated as shown here:

  ```sql
  [slice_ID] =
  ([main_table_ID] + [fragment_ID]) % [number_of_slices]
  ```

  Thus, restoring by *`N`* slices means running *`N`* instances of [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup"), all with `--num-slices=N` (along with any other necessary options) and one each with [`--slice-id=1`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_slice-id), `--slice-id=2`, `--slice-id=3`, and so on through `slice-id=N-1`.

* `--parallelism`=*`#`*, `-p`

  <table frame="box" rules="all" summary="Properties for backupid"><tbody><tr><th>Command-Line Format</th> <td><code>--backupid=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr></tbody></table>

  [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") uses single-row transactions to apply many rows concurrently. This parameter determines the number of parallel transactions (concurrent rows) that an instance of [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") tries to use. By default, this is 128; the minimum is 1, and the maximum is 1024.

  The work of performing the inserts is parallelized across the threads in the data nodes involved. This mechanism is employed for restoring bulk data from the `.Data` file—that is, the fuzzy snapshot of the data; it is not used for building or rebuilding indexes. The change log is applied serially; index drops and builds are DDL operations and handled separately. There is no thread-level parallelism on the client side of the restore.

* `--preserve-trailing-spaces`, `-P`

  <table frame="box" rules="all" summary="Properties for backupid"><tbody><tr><th>Command-Line Format</th> <td><code>--backupid=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr></tbody></table>

  Cause trailing spaces to be preserved when promoting a fixed-width character data type to its variable-width equivalent—that is, when promoting a [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") column value to [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types"), or a `BINARY` column value to [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"). Otherwise, any trailing spaces are dropped from such column values when they are inserted into the new columns.

  Note

  Although you can promote [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") columns to [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") and `BINARY` columns to [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types"), you cannot promote [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") columns to [`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") or [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types") columns to `BINARY`.

* `--print`

  <table frame="box" rules="all" summary="Properties for backupid"><tbody><tr><th>Command-Line Format</th> <td><code>--backupid=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr></tbody></table>

  Causes [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") to print all data, metadata, and logs to `stdout`. Equivalent to using the [`--print-data`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_print-data), [`--print-meta`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_print-meta), and [`--print-log`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_print-log) options together.

  Note

  Use of `--print` or any of the `--print_*` options is in effect performing a dry run. Including one or more of these options causes any output to be redirected to `stdout`; in such cases, [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") makes no attempt to restore data or metadata to an NDB Cluster.

* `--print-data`

  <table frame="box" rules="all" summary="Properties for backupid"><tbody><tr><th>Command-Line Format</th> <td><code>--backupid=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr></tbody></table>

  Cause [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") to direct its output to `stdout`. Often used together with one or more of [`--tab`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_tab), [`--fields-enclosed-by`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_fields-enclosed-by), [`--fields-optionally-enclosed-by`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_fields-optionally-enclosed-by), [`--fields-terminated-by`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_fields-terminated-by), [`--hex`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_hex), and [`--append`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_append).

  [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") and [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") column values are always truncated. Such values are truncated to the first 256 bytes in the output. This cannot currently be overridden when using `--print-data`.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for backupid"><tbody><tr><th>Command-Line Format</th> <td><code>--backupid=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr></tbody></table>

  Print program argument list and exit.

* `--print-log`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Cause [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") to output its log to `stdout`.

* `--print-meta`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Print all metadata to `stdout`.

* `print-sql-log`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Log SQL statements to `stdout`. Use the option to enable; normally this behavior is disabled. The option checks before attempting to log whether all the tables being restored have explicitly defined primary keys; queries on a table having only the hidden primary key implemented by `NDB` cannot be converted to valid SQL.

  This option does not work with tables having [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") columns.

  The [`--print-sql-log`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_print-sql-log) option was added in NDB 7.5.4. (Bug #13511949)

* `--progress-frequency`=*`N`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Print a status report each *`N`* seconds while the backup is in progress. 0 (the default) causes no status reports to be printed. The maximum is 65535.

* `--promote-attributes`, `-A`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") supports limited attribute promotion in much the same way that it is supported by MySQL replication; that is, data backed up from a column of a given type can generally be restored to a column using a “larger, similar” type. For example, data from a `CHAR(20)` column can be restored to a column declared as `VARCHAR(20)`, `VARCHAR(30)`, or `CHAR(30)`; data from a [`MEDIUMINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") column can be restored to a column of type [`INT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") or [`BIGINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). See [Section 16.4.1.10.2, “Replication of Columns Having Different Data Types”](replication-features-differing-tables.html#replication-features-different-data-types "16.4.1.10.2 Replication of Columns Having Different Data Types"), for a table of type conversions currently supported by attribute promotion.

  Beginning with NDB 7.5.23 and NDB 7.6.19, this option also makes it possible to restore a `NOT NULL` column as `NULL`.

  Attribute promotion by [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") must be enabled explicitly, as follows:

  1. Prepare the table to which the backup is to be restored. [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") cannot be used to re-create the table with a different definition from the original; this means that you must either create the table manually, or alter the columns which you wish to promote using [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") after restoring the table metadata but before restoring the data.

  2. Invoke [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") with the [`--promote-attributes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_promote-attributes) option (short form `-A`) when restoring the table data. Attribute promotion does not occur if this option is not used; instead, the restore operation fails with an error.

  When converting between character data types and `TEXT` or `BLOB`, only conversions between character types ([`CHAR`](char.html "11.3.2 The CHAR and VARCHAR Types") and [`VARCHAR`](char.html "11.3.2 The CHAR and VARCHAR Types")) and binary types ([`BINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types") and [`VARBINARY`](binary-varbinary.html "11.3.3 The BINARY and VARBINARY Types")) can be performed at the same time. For example, you cannot promote an [`INT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") column to [`BIGINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") while promoting a `VARCHAR` column to `TEXT` in the same invocation of [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup").

  Converting between [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") columns using different character sets is not supported, and is expressly disallowed.

  When performing conversions of character or binary types to `TEXT` or `BLOB` with [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup"), you may notice that it creates and uses one or more staging tables named `table_name$STnode_id`. These tables are not needed afterwards, and are normally deleted by [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") following a successful restoration.

* `--rebuild-indexes`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Enable multithreaded rebuilding of the ordered indexes while restoring a native `NDB` backup. The number of threads used for building ordered indexes by [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") with this option is controlled by the [`BuildIndexThreads`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-buildindexthreads) data node configuration parameter and the number of LDMs.

  It is necessary to use this option only for the first run of [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup"); this causes all ordered indexes to be rebuilt without using `--rebuild-indexes` again when restoring subsequent nodes. You should use this option prior to inserting new rows into the database; otherwise, it is possible for a row to be inserted that later causes a unique constraint violation when trying to rebuild the indexes.

  Building of ordered indices is parallelized with the number of LDMs by default. Offline index builds performed during node and system restarts can be made faster using the [`BuildIndexThreads`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-buildindexthreads) data node configuration parameter; this parameter has no effect on dropping and rebuilding of indexes by [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup"), which is performed online.

  Rebuilding of unique indexes uses disk write bandwidth for redo logging and local checkpointing. An insufficient amount of this bandwith can lead to redo buffer overload or log overload errors. In such cases you can run [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") `--rebuild-indexes` again; the process resumes at the point where the error occurred. You can also do this when you have encountered temporary errors. You can repeat execution of [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") `--rebuild-indexes` indefinitely; you may be able to stop such errors by reducing the value of [`--parallelism`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_parallelism). If the problem is insufficient space, you can increase the size of the redo log ([`FragmentLogFileSize`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-fragmentlogfilesize) node configuration parameter), or you can increase the speed at which LCPs are performed ([`MaxDiskWriteSpeed`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-maxdiskwritespeed) and related parameters), in order to free space more quickly.

* `--remap-column=db.tbl.col:fn:args`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  When used together with [`--restore-data`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_restore-data), this option applies a function to the value of the indicated column. Values in the argument string are listed here:

  + *`db`*: Database name, following any renames performed by [`--rewrite-database`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_rewrite-database).

  + *`tbl`*: Table name.
  + *`col`*: Name of the column to be updated. This column must be of type [`INT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") or [`BIGINT`](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). The column can also be but is not required to be `UNSIGNED`.

  + *`fn`*: Function name; currently, the only supported name is `offset`.

  + *`args`*: Arguments supplied to the function. Currently, only a single argument, the size of the offset to be added by the `offset` function, is supported. Negative values are supported. The size of the argument cannot exceed that of the signed variant of the column's type; for example, if *`col`* is an `INT` column, then the allowed range of the argument passed to the `offset` function is `-2147483648` to `2147483647` (see [Section 11.1.2, “Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT”](integer-types.html "11.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")).

    If applying the offset value to the column would cause an overflow or underflow, the restore operation fails. This could happen, for example, if the column is a `BIGINT`, and the option attempts to apply an offset value of 8 on a row in which the column value is 4294967291, since `4294967291 + 8 = 4294967299 > 4294967295`.

  This option can be useful when you wish to merge data stored in multiple source instances of NDB Cluster (all using the same schema) into a single destination NDB Cluster, using NDB native backup (see [Section 21.6.8.2, “Using The NDB Cluster Management Client to Create a Backup”](mysql-cluster-backup-using-management-client.html "21.6.8.2 Using The NDB Cluster Management Client to Create a Backup")) and [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") to merge the data, where primary and unique key values are overlapping between source clusters, and it is necessary as part of the process to remap these values to ranges that do not overlap. It may also be necessary to preserve other relationships between tables. To fulfill such requirements, it is possible to use the option multiple times in the same invocation of [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") to remap columns of different tables, as shown here:

  ```sql
  $> ndb_restore --restore-data --remap-column=hr.employee.id:offset:1000 \
      --remap-column=hr.manager.id:offset:1000 --remap-column=hr.firstaiders.id:offset:1000
  ```

  (Other options not shown here may also be used.)

  `--remap-column` can also be used to update multiple columns of the same table. Combinations of multiple tables and columns are possible. Different offset values can also be used for different columns of the same table, like this:

  ```sql
  $> ndb_restore --restore-data --remap-column=hr.employee.salary:offset:10000 \
      --remap-column=hr.employee.hours:offset:-10
  ```

  When source backups contain duplicate tables which should not be merged, you can handle this by using [`--exclude-tables`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_exclude-tables), [`--exclude-databases`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_exclude-databases), or by some other means in your application.

  Information about the structure and other characteristics of tables to be merged can obtained using [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement"); the [**ndb_desc**](mysql-cluster-programs-ndb-desc.html "21.5.10 ndb_desc — Describe NDB Tables") tool; and [`MAX()`](aggregate-functions.html#function_max), [`MIN()`](aggregate-functions.html#function_min), [`LAST_INSERT_ID()`](information-functions.html#function_last-insert-id), and other MySQL functions.

  Replication of changes from merged to unmerged tables, or from unmerged to merged tables, in separate instances of NDB Cluster is not supported.

* `--restore-data`, `-r`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Output [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") table data and logs.

* `--restore-epoch`, `-e`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Add (or restore) epoch information to the cluster replication status table. This is useful for starting replication on an NDB replica cluster. When this option is used, the row in the `mysql.ndb_apply_status` having `0` in the `id` column is updated if it already exists; such a row is inserted if it does not already exist. (See [Section 21.7.9, “NDB Cluster Backups With NDB Cluster Replication”](mysql-cluster-replication-backups.html "21.7.9 NDB Cluster Backups With NDB Cluster Replication").)

* `--restore-meta`, `-m`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  This option causes [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") to print [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") table metadata.

  The first time you run the [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") restoration program, you also need to restore the metadata. In other words, you must re-create the database tables—this can be done by running it with the `--restore-meta` (`-m`) option. Restoring the metadata need be done only on a single data node; this is sufficient to restore it to the entire cluster.

  In older versions of NDB Cluster, tables whose schemas were restored using this option used the same number of partitions as they did on the original cluster, even if it had a differing number of data nodes from the new cluster. In NDB 7.5.2 and later, when restoring metadata, this is no longer an issue; [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") now uses the default number of partitions for the target cluster, unless the number of local data manager threads is also changed from what it was for data nodes in the original cluster.

  Note

  The cluster should have an empty database when starting to restore a backup. (In other words, you should start the data nodes with [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial) prior to performing the restore.)

* `--restore-privilege-tables`

  <table frame="box" rules="all" summary="Properties for connect"><tbody><tr><th>Command-Line Format</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost:1186</code></td> </tr></tbody></table>

  [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") does not by default restore distributed MySQL privilege tables. This option causes [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") to restore the privilege tables.

  This works only if the privilege tables were converted to [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") before the backup was taken. For more information, see [Section 21.6.13, “Distributed Privileges Using Shared Grant Tables”](mysql-cluster-privilege-distribution.html "21.6.13 Distributed Privileges Using Shared Grant Tables").

* `--rewrite-database`=*`olddb,newdb`*

  <table frame="box" rules="all" summary="Properties for connect"><tbody><tr><th>Command-Line Format</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost:1186</code></td> </tr></tbody></table>

  This option makes it possible to restore to a database having a different name from that used in the backup. For example, if a backup is made of a database named `products`, you can restore the data it contains to a database named `inventory`, use this option as shown here (omitting any other options that might be required):

  ```sql
  $> ndb_restore --rewrite-database=product,inventory
  ```

  The option can be employed multiple times in a single invocation of [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup"). Thus it is possible to restore simultaneously from a database named `db1` to a database named `db2` and from a database named `db3` to one named `db4` using `--rewrite-database=db1,db2 --rewrite-database=db3,db4`. Other [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") options may be used between multiple occurrences of `--rewrite-database`.

  In the event of conflicts between multiple `--rewrite-database` options, the last `--rewrite-database` option used, reading from left to right, is the one that takes effect. For example, if `--rewrite-database=db1,db2 --rewrite-database=db1,db3` is used, only `--rewrite-database=db1,db3` is honored, and `--rewrite-database=db1,db2` is ignored. It is also possible to restore from multiple databases to a single database, so that `--rewrite-database=db1,db3 --rewrite-database=db2,db3` restores all tables and data from databases `db1` and `db2` into database `db3`.

  Important

  When restoring from multiple backup databases into a single target database using `--rewrite-database`, no check is made for collisions between table or other object names, and the order in which rows are restored is not guaranteed. This means that it is possible in such cases for rows to be overwritten and updates to be lost.

* `--skip-broken-objects`

  <table frame="box" rules="all" summary="Properties for connect"><tbody><tr><th>Command-Line Format</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost:1186</code></td> </tr></tbody></table>

  This option causes [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") to ignore corrupt tables while reading a native [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") backup, and to continue restoring any remaining tables (that are not also corrupted). Currently, the `--skip-broken-objects` option works only in the case of missing blob parts tables.

* `--skip-table-check`, `-s`

  <table frame="box" rules="all" summary="Properties for connect"><tbody><tr><th>Command-Line Format</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost:1186</code></td> </tr></tbody></table>

  It is possible to restore data without restoring table metadata. By default when doing this, [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") fails with an error if a mismatch is found between the table data and the table schema; this option overrides that behavior.

  Some of the restrictions on mismatches in column definitions when restoring data using [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") are relaxed; when one of these types of mismatches is encountered, [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") does not stop with an error as it did previously, but rather accepts the data and inserts it into the target table while issuing a warning to the user that this is being done. This behavior occurs whether or not either of the options `--skip-table-check` or [`--promote-attributes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_promote-attributes) is in use. These differences in column definitions are of the following types:

  + Different `COLUMN_FORMAT` settings (`FIXED`, `DYNAMIC`, `DEFAULT`)

  + Different `STORAGE` settings (`MEMORY`, `DISK`)

  + Different default values
  + Different distribution key settings
* `--skip-unknown-objects`

  <table frame="box" rules="all" summary="Properties for connect"><tbody><tr><th>Command-Line Format</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost:1186</code></td> </tr></tbody></table>

  This option causes [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") to ignore any schema objects it does not recognize while reading a native [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") backup. This can be used for restoring a backup made from a cluster running (for example) NDB 7.6 to a cluster running NDB Cluster 7.5.

* `--slice-id`=*`#`*

  <table frame="box" rules="all" summary="Properties for connect"><tbody><tr><th>Command-Line Format</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost:1186</code></td> </tr></tbody></table>

  When restoring by slices, this is the ID of the slice to restore. This option is always used together with [`--num-slices`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_num-slices), and its value must be always less than that of `--num-slices`.

  For more information, see the description of the [`--num-slices`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_num-slices) elsewhere in this section.

* `--tab`=*`dir_name`*, `-T` *`dir_name`*

  <table frame="box" rules="all" summary="Properties for connect"><tbody><tr><th>Command-Line Format</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost:1186</code></td> </tr></tbody></table>

  Causes [`--print-data`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_print-data) to create dump files, one per table, each named `tbl_name.txt`. It requires as its argument the path to the directory where the files should be saved; use `.` for the current directory.

* `--timestamp-printouts`

  <table frame="box" rules="all" summary="Properties for connect"><tbody><tr><th>Command-Line Format</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost:1186</code></td> </tr></tbody></table>

  Causes info, error, and debug log messages to be prefixed with timestamps.

  This option is disabled by default in NDB 7.5 and NDB 7.6. Set it explicitly to `true` to enable.

* `--usage`

  <table frame="box" rules="all" summary="Properties for connect"><tbody><tr><th>Command-Line Format</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost:1186</code></td> </tr></tbody></table>

  Display help text and exit; same as [`--help`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_help).

* `--verbose`=*`#`*

  <table frame="box" rules="all" summary="Properties for connect"><tbody><tr><th>Command-Line Format</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost:1186</code></td> </tr></tbody></table>

  Sets the level for the verbosity of the output. The minimum is 0; the maximum is 255. The default value is 1.

* `--version`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

  Display version information and exit.

Typical options for this utility are shown here:

```sql
ndb_restore [-c connection_string] -n node_id -b backup_id \
      [-m] -r --backup-path=/path/to/backup/files
```

Normally, when restoring from an NDB Cluster backup, [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") requires at a minimum the [`--nodeid`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_nodeid) (short form: `-n`), [`--backupid`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid) (short form: `-b`), and [`--backup-path`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backup-path) options. In addition, when [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") is used to restore any tables containing unique indexes, you must include [`--disable-indexes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_disable-indexes) or [`--rebuild-indexes`](mysql-cluster-programs-ndb-restore.html#option_ndb_restore_rebuild-indexes). (Bug
#57782, Bug #11764893)

The `-c` option is used to specify a connection string which tells `ndb_restore` where to locate the cluster management server (see [Section 21.4.3.3, “NDB Cluster Connection Strings”](mysql-cluster-connection-strings.html "21.4.3.3 NDB Cluster Connection Strings")). If this option is not used, then [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") attempts to connect to a management server on `localhost:1186`. This utility acts as a cluster API node, and so requires a free connection “slot” to connect to the cluster management server. This means that there must be at least one `[api]` or `[mysqld]` section that can be used by it in the cluster `config.ini` file. It is a good idea to keep at least one empty `[api]` or `[mysqld]` section in `config.ini` that is not being used for a MySQL server or other application for this reason (see [Section 21.4.3.7, “Defining SQL and Other API Nodes in an NDB Cluster”](mysql-cluster-api-definition.html "21.4.3.7 Defining SQL and Other API Nodes in an NDB Cluster")).

You can verify that [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") is connected to the cluster by using the [`SHOW`](mysql-cluster-mgm-client-commands.html#ndbclient-show) command in the [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") management client. You can also accomplish this from a system shell, as shown here:

```sql
$> ndb_mgm -e "SHOW"
```

**Error reporting.** [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") reports both temporary and permanent errors. In the case of temporary errors, it may able to recover from them, and reports `Restore successful, but encountered temporary error, please look at configuration` in such cases.

Important

After using [**ndb_restore**](mysql-cluster-programs-ndb-restore.html "21.5.24 ndb_restore — Restore an NDB Cluster Backup") to initialize an NDB Cluster for use in circular replication, binary logs on the SQL node acting as the replica are not automatically created, and you must cause them to be created manually. To cause the binary logs to be created, issue a [`SHOW TABLES`](show-tables.html "13.7.5.37 SHOW TABLES Statement") statement on that SQL node before running [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement"). This is a known issue in NDB Cluster.
