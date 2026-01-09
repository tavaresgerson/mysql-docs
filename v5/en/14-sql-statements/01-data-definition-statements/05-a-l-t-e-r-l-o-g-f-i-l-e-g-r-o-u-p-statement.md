### 13.1.5 ALTER LOGFILE GROUP Statement

```sql
ALTER LOGFILE GROUP logfile_group
    ADD UNDOFILE 'file_name'
    [INITIAL_SIZE [=] size]
    [WAIT]
    ENGINE [=] engine_name
```

This statement adds an `UNDO` file named '*`file_name`*' to an existing log file group *`logfile_group`*. An [`ALTER LOGFILE GROUP`](alter-logfile-group.html "13.1.5 ALTER LOGFILE GROUP Statement") statement has one and only one `ADD UNDOFILE` clause. No `DROP UNDOFILE` clause is currently supported.

Note

All NDB Cluster Disk Data objects share the same namespace. This means that *each Disk Data object* must be uniquely named (and not merely each Disk Data object of a given type). For example, you cannot have a tablespace and an undo log file with the same name, or an undo log file and a data file with the same name.

The optional `INITIAL_SIZE` parameter sets the `UNDO` file's initial size in bytes; if not specified, the initial size defaults to 134217728 (128 MB). You may optionally follow *`size`* with a one-letter abbreviation for an order of magnitude, similar to those used in `my.cnf`. Generally, this is one of the letters `M` (megabytes) or `G` (gigabytes). (Bug #13116514, Bug #16104705, Bug #62858)

On 32-bit systems, the maximum supported value for `INITIAL_SIZE` is 4294967296 (4 GB). (Bug #29186)

The minimum allowed value for `INITIAL_SIZE` is 1048576 (1 MB). (Bug #29574)

Note

`WAIT` is parsed but otherwise ignored. This keyword currently has no effect, and is intended for future expansion.

The `ENGINE` parameter (required) determines the storage engine which is used by this log file group, with *`engine_name`* being the name of the storage engine. Currently, the only accepted values for *`engine_name`* are “[`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6")” and “[`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6")”. The two values are equivalent.

Here is an example, which assumes that the log file group `lg_3` has already been created using [`CREATE LOGFILE GROUP`](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement") (see [Section 13.1.15, “CREATE LOGFILE GROUP Statement”](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement")):

```sql
ALTER LOGFILE GROUP lg_3
    ADD UNDOFILE 'undo_10.dat'
    INITIAL_SIZE=32M
    ENGINE=NDBCLUSTER;
```

When [`ALTER LOGFILE GROUP`](alter-logfile-group.html "13.1.5 ALTER LOGFILE GROUP Statement") is used with `ENGINE = NDBCLUSTER` (alternatively, `ENGINE = NDB`), an `UNDO` log file is created on each NDB Cluster data node. You can verify that the `UNDO` files were created and obtain information about them by querying the Information Schema [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") table. For example:

```sql
mysql> SELECT FILE_NAME, LOGFILE_GROUP_NUMBER, EXTRA
    -> FROM INFORMATION_SCHEMA.FILES
    -> WHERE LOGFILE_GROUP_NAME = 'lg_3';
+-------------+----------------------+----------------+
| FILE_NAME   | LOGFILE_GROUP_NUMBER | EXTRA          |
+-------------+----------------------+----------------+
| newdata.dat |                    0 | CLUSTER_NODE=3 |
| newdata.dat |                    0 | CLUSTER_NODE=4 |
| undo_10.dat |                   11 | CLUSTER_NODE=3 |
| undo_10.dat |                   11 | CLUSTER_NODE=4 |
+-------------+----------------------+----------------+
4 rows in set (0.01 sec)
```

(See [Section 24.3.9, “The INFORMATION_SCHEMA FILES Table”](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table").)

Memory used for `UNDO_BUFFER_SIZE` comes from the global pool whose size is determined by the value of the [`SharedGlobalMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-sharedglobalmemory) data node configuration parameter. This includes any default value implied for this option by the setting of the [`InitialLogFileGroup`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-initiallogfilegroup) data node configuration parameter.

[`ALTER LOGFILE GROUP`](alter-logfile-group.html "13.1.5 ALTER LOGFILE GROUP Statement") is useful only with Disk Data storage for NDB Cluster. For more information, see [Section 21.6.11, “NDB Cluster Disk Data Tables”](mysql-cluster-disk-data.html "21.6.11 NDB Cluster Disk Data Tables").
