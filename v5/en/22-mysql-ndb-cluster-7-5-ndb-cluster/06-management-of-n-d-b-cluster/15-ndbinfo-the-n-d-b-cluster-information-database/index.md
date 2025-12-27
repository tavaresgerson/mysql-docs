### 21.6.15 ndbinfo: The NDB Cluster Information Database

[21.6.15.1 The ndbinfo arbitrator\_validity\_detail Table](mysql-cluster-ndbinfo-arbitrator-validity-detail.html)

[21.6.15.2 The ndbinfo arbitrator\_validity\_summary Table](mysql-cluster-ndbinfo-arbitrator-validity-summary.html)

[21.6.15.3 The ndbinfo blocks Table](mysql-cluster-ndbinfo-blocks.html)

[21.6.15.4 The ndbinfo cluster\_locks Table](mysql-cluster-ndbinfo-cluster-locks.html)

[21.6.15.5 The ndbinfo cluster\_operations Table](mysql-cluster-ndbinfo-cluster-operations.html)

[21.6.15.6 The ndbinfo cluster\_transactions Table](mysql-cluster-ndbinfo-cluster-transactions.html)

[21.6.15.7 The ndbinfo config\_nodes Table](mysql-cluster-ndbinfo-config-nodes.html)

[21.6.15.8 The ndbinfo config\_params Table](mysql-cluster-ndbinfo-config-params.html)

[21.6.15.9 The ndbinfo config\_values Table](mysql-cluster-ndbinfo-config-values.html)

[21.6.15.10 The ndbinfo counters Table](mysql-cluster-ndbinfo-counters.html)

[21.6.15.11 The ndbinfo cpustat Table](mysql-cluster-ndbinfo-cpustat.html)

[21.6.15.12 The ndbinfo cpustat\_50ms Table](mysql-cluster-ndbinfo-cpustat-50ms.html)

[21.6.15.13 The ndbinfo cpustat\_1sec Table](mysql-cluster-ndbinfo-cpustat-1sec.html)

[21.6.15.14 The ndbinfo cpustat\_20sec Table](mysql-cluster-ndbinfo-cpustat-20sec.html)

[21.6.15.15 The ndbinfo dict\_obj\_info Table](mysql-cluster-ndbinfo-dict-obj-info.html)

[21.6.15.16 The ndbinfo dict\_obj\_types Table](mysql-cluster-ndbinfo-dict-obj-types.html)

[21.6.15.17 The ndbinfo disk\_write\_speed\_base Table](mysql-cluster-ndbinfo-disk-write-speed-base.html)

[21.6.15.18 The ndbinfo disk\_write\_speed\_aggregate Table](mysql-cluster-ndbinfo-disk-write-speed-aggregate.html)

[21.6.15.19 The ndbinfo disk\_write\_speed\_aggregate\_node Table](mysql-cluster-ndbinfo-disk-write-speed-aggregate-node.html)

[21.6.15.20 The ndbinfo diskpagebuffer Table](mysql-cluster-ndbinfo-diskpagebuffer.html)

[21.6.15.21 The ndbinfo error\_messages Table](mysql-cluster-ndbinfo-error-messages.html)

[21.6.15.22 The ndbinfo locks\_per\_fragment Table](mysql-cluster-ndbinfo-locks-per-fragment.html)

[21.6.15.23 The ndbinfo logbuffers Table](mysql-cluster-ndbinfo-logbuffers.html)

[21.6.15.24 The ndbinfo logspaces Table](mysql-cluster-ndbinfo-logspaces.html)

[21.6.15.25 The ndbinfo membership Table](mysql-cluster-ndbinfo-membership.html)

[21.6.15.26 The ndbinfo memoryusage Table](mysql-cluster-ndbinfo-memoryusage.html)

[21.6.15.27 The ndbinfo memory\_per\_fragment Table](mysql-cluster-ndbinfo-memory-per-fragment.html)

[21.6.15.28 The ndbinfo nodes Table](mysql-cluster-ndbinfo-nodes.html)

[21.6.15.29 The ndbinfo operations\_per\_fragment Table](mysql-cluster-ndbinfo-operations-per-fragment.html)

[21.6.15.30 The ndbinfo processes Table](mysql-cluster-ndbinfo-processes.html)

[21.6.15.31 The ndbinfo resources Table](mysql-cluster-ndbinfo-resources.html)

[21.6.15.32 The ndbinfo restart\_info Table](mysql-cluster-ndbinfo-restart-info.html)

[21.6.15.33 The ndbinfo server\_locks Table](mysql-cluster-ndbinfo-server-locks.html)

[21.6.15.34 The ndbinfo server\_operations Table](mysql-cluster-ndbinfo-server-operations.html)

[21.6.15.35 The ndbinfo server\_transactions Table](mysql-cluster-ndbinfo-server-transactions.html)

[21.6.15.36 The ndbinfo table\_distribution\_status Table](mysql-cluster-ndbinfo-table-distribution-status.html)

[21.6.15.37 The ndbinfo table\_fragments Table](mysql-cluster-ndbinfo-table-fragments.html)

[21.6.15.38 The ndbinfo table\_info Table](mysql-cluster-ndbinfo-table-info.html)

[21.6.15.39 The ndbinfo table\_replicas Table](mysql-cluster-ndbinfo-table-replicas.html)

[21.6.15.40 The ndbinfo tc\_time\_track\_stats Table](mysql-cluster-ndbinfo-tc-time-track-stats.html)

[21.6.15.41 The ndbinfo threadblocks Table](mysql-cluster-ndbinfo-threadblocks.html)

[21.6.15.42 The ndbinfo threads Table](mysql-cluster-ndbinfo-threads.html)

[21.6.15.43 The ndbinfo threadstat Table](mysql-cluster-ndbinfo-threadstat.html)

[21.6.15.44 The ndbinfo transporters Table](mysql-cluster-ndbinfo-transporters.html)

`ndbinfo` is a database containing information specific to NDB Cluster.

This database contains a number of tables, each providing a different sort of data about NDB Cluster node status, resource usage, and operations. You can find more detailed information about each of these tables in the next several sections.

`ndbinfo` is included with NDB Cluster support in the MySQL Server; no special compilation or configuration steps are required; the tables are created by the MySQL Server when it connects to the cluster. You can verify that `ndbinfo` support is active in a given MySQL Server instance using [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement"); if `ndbinfo` support is enabled, you should see a row containing `ndbinfo` in the `Name` column and `ACTIVE` in the `Status` column, as shown here (emphasized text):

```sql
mysql> SHOW PLUGINS;
+----------------------------------+--------+--------------------+---------+---------+
| Name                             | Status | Type               | Library | License |
+----------------------------------+--------+--------------------+---------+---------+
| binlog                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| mysql_native_password            | ACTIVE | AUTHENTICATION     | NULL    | GPL     |
| sha256_password                  | ACTIVE | AUTHENTICATION     | NULL    | GPL     |
| MRG_MYISAM                       | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| MEMORY                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| CSV                              | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| MyISAM                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| InnoDB                           | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| INNODB_TRX                       | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_LOCKS                     | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_LOCK_WAITS                | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMP                       | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMP_RESET                 | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMPMEM                    | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMPMEM_RESET              | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMP_PER_INDEX             | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMP_PER_INDEX_RESET       | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_BUFFER_PAGE               | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_BUFFER_PAGE_LRU           | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_BUFFER_POOL_STATS         | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_TEMP_TABLE_INFO           | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_METRICS                   | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_FT_DEFAULT_STOPWORD       | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_FT_DELETED                | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_FT_BEING_DELETED          | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_FT_CONFIG                 | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_FT_INDEX_CACHE            | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_FT_INDEX_TABLE            | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_SYS_TABLES                | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_SYS_TABLESTATS            | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_SYS_INDEXES               | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_SYS_COLUMNS               | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_SYS_FIELDS                | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_SYS_FOREIGN               | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_SYS_FOREIGN_COLS          | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_SYS_TABLESPACES           | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_SYS_DATAFILES             | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_SYS_VIRTUAL               | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| PERFORMANCE_SCHEMA               | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ndbCluster                      | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ndbinfo                          | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ndb_transid_mysql_connection_map | ACTIVE | INFORMATION SCHEMA | NULL    | GPL     |
| BLACKHOLE                        | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ARCHIVE                          | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| partition                        | ACTIVE | STORAGE ENGINE     | NULL    | GPL     |
| ngram                            | ACTIVE | FTPARSER           | NULL    | GPL     |
+----------------------------------+--------+--------------------+---------+---------+
46 rows in set (0.00 sec)
```

You can also do this by checking the output of [`SHOW ENGINES`](show-engines.html "13.7.5.16 SHOW ENGINES Statement") for a line including `ndbinfo` in the `Engine` column and `YES` in the `Support` column, as shown here (emphasized text):

```sql
mysql> SHOW ENGINES\G
*************************** 1. row ***************************
      Engine: ndbcluster
     Support: YES
     Comment: Clustered, fault-tolerant tables
Transactions: YES
          XA: NO
  Savepoints: NO
*************************** 2. row ***************************
      Engine: CSV
     Support: YES
     Comment: CSV storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 3. row ***************************
      Engine: InnoDB
     Support: DEFAULT
     Comment: Supports transactions, row-level locking, and foreign keys
Transactions: YES
          XA: YES
  Savepoints: YES
*************************** 4. row ***************************
      Engine: BLACKHOLE
     Support: YES
     Comment: /dev/null storage engine (anything you write to it disappears)
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 5. row ***************************
      Engine: MyISAM
     Support: YES
     Comment: MyISAM storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 6. row ***************************
      Engine: MRG_MYISAM
     Support: YES
     Comment: Collection of identical MyISAM tables
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 7. row ***************************
      Engine: ARCHIVE
     Support: YES
     Comment: Archive storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 8. row ***************************
      Engine: ndbinfo
     Support: YES
     Comment: NDB Cluster system information storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 9. row ***************************
      Engine: PERFORMANCE_SCHEMA
     Support: YES
     Comment: Performance Schema
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 10. row ***************************
      Engine: MEMORY
     Support: YES
     Comment: Hash based, stored in memory, useful for temporary tables
Transactions: NO
          XA: NO
  Savepoints: NO
10 rows in set (0.00 sec)
```

If `ndbinfo` support is enabled, then you can access `ndbinfo` using SQL statements in [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") or another MySQL client. For example, you can see `ndbinfo` listed in the output of [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement"), as shown here (emphasized text):

```sql
mysql> SHOW DATABASES;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| ndbinfo            |
| performance_schema |
| sys                |
+--------------------+
5 rows in set (0.04 sec)
```

If the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") process was not started with the [`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster) option, `ndbinfo` is not available and is not displayed by [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement"). If [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") was formerly connected to an NDB Cluster but the cluster becomes unavailable (due to events such as cluster shutdown, loss of network connectivity, and so forth), `ndbinfo` and its tables remain visible, but an attempt to access any tables (other than `blocks` or `config_params`) fails with Got error 157 'Connection to NDB failed' from NDBINFO.

With the exception of the [`blocks`](mysql-cluster-ndbinfo-blocks.html "21.6.15.3 The ndbinfo blocks Table") and [`config_params`](mysql-cluster-ndbinfo-config-params.html "21.6.15.8 The ndbinfo config_params Table") tables, what we refer to as `ndbinfo` “tables” are actually views generated from internal [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables not normally visible to the MySQL Server. You can make these tables visible by setting the [`ndbinfo_show_hidden`](mysql-cluster-options-variables.html#sysvar_ndbinfo_show_hidden) system variable to `ON` (or `1`), but this is normally not necessary.

All `ndbinfo` tables are read-only, and are generated on demand when queried. Because many of them are generated in parallel by the data nodes while other are specific to a given SQL node, they are not guaranteed to provide a consistent snapshot.

In addition, pushing down of joins is not supported on `ndbinfo` tables; so joining large `ndbinfo` tables can require transfer of a large amount of data to the requesting API node, even when the query makes use of a `WHERE` clause.

`ndbinfo` tables are not included in the query cache. (Bug #59831)

You can select the `ndbinfo` database with a [`USE`](use.html "13.8.4 USE Statement") statement, and then issue a [`SHOW TABLES`](show-tables.html "13.7.5.37 SHOW TABLES Statement") statement to obtain a list of tables, just as for any other database, like this:

```sql
mysql> USE ndbinfo;
Database changed

mysql> SHOW TABLES;
+---------------------------------+
| Tables_in_ndbinfo               |
+---------------------------------+
| arbitrator_validity_detail      |
| arbitrator_validity_summary     |
| blocks                          |
| cluster_locks                   |
| cluster_operations              |
| cluster_transactions            |
| config_nodes                    |
| config_params                   |
| config_values                   |
| counters                        |
| cpustat                         |
| cpustat_1sec                    |
| cpustat_20sec                   |
| cpustat_50ms                    |
| dict_obj_info                   |
| dict_obj_types                  |
| disk_write_speed_aggregate      |
| disk_write_speed_aggregate_node |
| disk_write_speed_base           |
| diskpagebuffer                  |
| error_messages                  |
| locks_per_fragment              |
| logbuffers                      |
| logspaces                       |
| membership                      |
| memory_per_fragment             |
| memoryusage                     |
| nodes                           |
| operations_per_fragment         |
| processes                       |
| resources                       |
| restart_info                    |
| server_locks                    |
| server_operations               |
| server_transactions             |
| table_distribution_status       |
| table_fragments                 |
| table_info                      |
| table_replicas                  |
| tc_time_track_stats             |
| threadblocks                    |
| threads                         |
| threadstat                      |
| transporters                    |
+---------------------------------+
44 rows in set (0.00 sec)
```

In NDB 7.5.0 (and later), all `ndbinfo` tables use the `NDB` storage engine; however, an `ndbinfo` entry still appears in the output of [`SHOW ENGINES`](show-engines.html "13.7.5.16 SHOW ENGINES Statement") and [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement") as described previously.

The [`config_values`](mysql-cluster-ndbinfo-config-values.html "21.6.15.9 The ndbinfo config_values Table") table was added in NDB 7.5.0.

The [`cpustat`](mysql-cluster-ndbinfo-cpustat.html "21.6.15.11 The ndbinfo cpustat Table"), [`cpustat_50ms`](mysql-cluster-ndbinfo-cpustat-50ms.html "21.6.15.12 The ndbinfo cpustat_50ms Table"), [`cpustat_1sec`](mysql-cluster-ndbinfo-cpustat-1sec.html "21.6.15.13 The ndbinfo cpustat_1sec Table"), [`cpustat_20sec`](mysql-cluster-ndbinfo-cpustat-20sec.html "21.6.15.14 The ndbinfo cpustat_20sec Table"), and [`threads`](mysql-cluster-ndbinfo-threads.html "21.6.15.42 The ndbinfo threads Table") tables were added in NDB 7.5.2.

The [`cluster_locks`](mysql-cluster-ndbinfo-cluster-locks.html "21.6.15.4 The ndbinfo cluster_locks Table"), [`locks_per_fragment`](mysql-cluster-ndbinfo-locks-per-fragment.html "21.6.15.22 The ndbinfo locks_per_fragment Table"), and [`server_locks`](mysql-cluster-ndbinfo-server-locks.html "21.6.15.33 The ndbinfo server_locks Table") tables were added in NDB 7.5.3.

The [`dict_obj_info`](mysql-cluster-ndbinfo-dict-obj-info.html "21.6.15.15 The ndbinfo dict_obj_info Table"), [`table_distribution_status`](mysql-cluster-ndbinfo-table-distribution-status.html "21.6.15.36 The ndbinfo table_distribution_status Table"), [`table_fragments`](mysql-cluster-ndbinfo-table-fragments.html "21.6.15.37 The ndbinfo table_fragments Table"), [`table_info`](mysql-cluster-ndbinfo-table-info.html "21.6.15.38 The ndbinfo table_info Table"), and [`table_replicas`](mysql-cluster-ndbinfo-table-replicas.html "21.6.15.39 The ndbinfo table_replicas Table") tables were added in NDB 7.5.4.

The [`config_nodes`](mysql-cluster-ndbinfo-config-nodes.html "21.6.15.7 The ndbinfo config_nodes Table") and [`processes`](mysql-cluster-ndbinfo-processes.html "21.6.15.30 The ndbinfo processes Table") tables were added in NDB 7.5.7.

The [`error_messages`](mysql-cluster-ndbinfo-error-messages.html "21.6.15.21 The ndbinfo error_messages Table") table was added in NDB 7.6.

You can execute [`SELECT`](select.html "13.2.9 SELECT Statement") statements against these tables, just as you would normally expect:

```sql
mysql> SELECT * FROM memoryusage;
+---------+---------------------+--------+------------+------------+-------------+
| node_id | memory_type         | used   | used_pages | total      | total_pages |
+---------+---------------------+--------+------------+------------+-------------+
|       5 | Data memory         | 753664 |         23 | 1073741824 |       32768 |
|       5 | Index memory        | 163840 |         20 | 1074003968 |      131104 |
|       5 | Long message buffer |   2304 |          9 |   67108864 |      262144 |
|       6 | Data memory         | 753664 |         23 | 1073741824 |       32768 |
|       6 | Index memory        | 163840 |         20 | 1074003968 |      131104 |
|       6 | Long message buffer |   2304 |          9 |   67108864 |      262144 |
+---------+---------------------+--------+------------+------------+-------------+
6 rows in set (0.02 sec)
```

More complex queries, such as the two following [`SELECT`](select.html "13.2.9 SELECT Statement") statements using the [`memoryusage`](mysql-cluster-ndbinfo-memoryusage.html "21.6.15.26 The ndbinfo memoryusage Table") table, are possible:

```sql
mysql> SELECT SUM(used) as 'Data Memory Used, All Nodes'
     >     FROM memoryusage
     >     WHERE memory_type = 'Data memory';
+-----------------------------+
| Data Memory Used, All Nodes |
+-----------------------------+
|                        6460 |
+-----------------------------+
1 row in set (0.37 sec)

mysql> SELECT SUM(max) as 'Total IndexMemory Available'
     >     FROM memoryusage
     >     WHERE memory_type = 'Index memory';
+-----------------------------+
| Total IndexMemory Available |
+-----------------------------+
|                       25664 |
+-----------------------------+
1 row in set (0.33 sec)
```

`ndbinfo` table and column names are case-sensitive (as is the name of the `ndbinfo` database itself). These identifiers are in lowercase. Trying to use the wrong lettercase results in an error, as shown in this example:

```sql
mysql> SELECT * FROM nodes;
+---------+--------+---------+-------------+
| node_id | uptime | status  | start_phase |
+---------+--------+---------+-------------+
|       1 |  13602 | STARTED |           0 |
|       2 |     16 | STARTED |           0 |
+---------+--------+---------+-------------+
2 rows in set (0.04 sec)

mysql> SELECT * FROM Nodes;
ERROR 1146 (42S02): Table 'ndbinfo.Nodes' doesn't exist
```

[**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") ignores the `ndbinfo` database entirely, and excludes it from any output. This is true even when using the [`--databases`](mysqldump.html#option_mysqldump_databases) or [`--all-databases`](mysqldump.html#option_mysqldump_all-databases) option.

NDB Cluster also maintains tables in the `INFORMATION_SCHEMA` information database, including the [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") table which contains information about files used for NDB Cluster Disk Data storage, and the [`ndb_transid_mysql_connection_map`](information-schema-ndb-transid-mysql-connection-map-table.html "24.3.13 The INFORMATION_SCHEMA ndb_transid_mysql_connection_map Table") table, which shows the relationships between transactions, transaction coordinators, and NDB Cluster API nodes. For more information, see the descriptions of the tables or [Section 21.6.16, “INFORMATION\_SCHEMA Tables for NDB Cluster”](mysql-cluster-information-schema-tables.html "21.6.16 INFORMATION_SCHEMA Tables for NDB Cluster").
