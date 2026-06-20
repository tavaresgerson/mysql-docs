### 25.6.15 ndbinfo: The NDB Cluster Information Database

`ndbinfo` is a database containing information
specific to NDB Cluster.

This database contains a number of tables, each providing a
different sort of data about NDB Cluster node status, resource
usage, and operations. You can find more detailed information
about each of these tables in the next several sections.

`ndbinfo` is included with NDB Cluster support in
the MySQL Server; no special compilation or configuration steps
are required; the tables are created by the MySQL Server when it
connects to the cluster. You can verify that
`ndbinfo` support is active in a given MySQL
Server instance using [`SHOW PLUGINS`](show-plugins.html "15.7.7.28 SHOW PLUGINS Statement");
if `ndbinfo` support is enabled, you should see a
row containing `ndbinfo` in the
`Name` column and `ACTIVE` in
the `Status` column, as shown here (emphasized
text):

```
mysql> SHOW PLUGINS;
+----------------------------------+----------+--------------------+---------+---------+
| Name                             | Status   | Type               | Library | License |
+----------------------------------+----------+--------------------+---------+---------+
| binlog                           | ACTIVE   | STORAGE ENGINE     | NULL    | GPL     |
| sha256_password                  | ACTIVE   | AUTHENTICATION     | NULL    | GPL     |
| caching_sha2_password            | ACTIVE   | AUTHENTICATION     | NULL    | GPL     |
| daemon_keyring_proxy_plugin      | ACTIVE   | DAEMON             | NULL    | GPL     |
| CSV                              | ACTIVE   | STORAGE ENGINE     | NULL    | GPL     |
| MEMORY                           | ACTIVE   | STORAGE ENGINE     | NULL    | GPL     |
| InnoDB                           | ACTIVE   | STORAGE ENGINE     | NULL    | GPL     |
| INNODB_TRX                       | ACTIVE   | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMP                       | ACTIVE   | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMP_RESET                 | ACTIVE   | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMPMEM                    | ACTIVE   | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMPMEM_RESET              | ACTIVE   | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMP_PER_INDEX             | ACTIVE   | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CMP_PER_INDEX_RESET       | ACTIVE   | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_BUFFER_PAGE               | ACTIVE   | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_BUFFER_PAGE_LRU           | ACTIVE   | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_BUFFER_POOL_STATS         | ACTIVE   | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_TEMP_TABLE_INFO           | ACTIVE   | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_METRICS                   | ACTIVE   | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_FT_DEFAULT_STOPWORD       | ACTIVE   | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_FT_DELETED                | ACTIVE   | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_FT_BEING_DELETED          | ACTIVE   | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_FT_CONFIG                 | ACTIVE   | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_FT_INDEX_CACHE            | ACTIVE   | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_FT_INDEX_TABLE            | ACTIVE   | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_TABLES                    | ACTIVE   | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_TABLESTATS                | ACTIVE   | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_INDEXES                   | ACTIVE   | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_TABLESPACES               | ACTIVE   | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_COLUMNS                   | ACTIVE   | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_VIRTUAL                   | ACTIVE   | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_CACHED_INDEXES            | ACTIVE   | INFORMATION SCHEMA | NULL    | GPL     |
| INNODB_SESSION_TEMP_TABLESPACES  | ACTIVE   | INFORMATION SCHEMA | NULL    | GPL     |
| MyISAM                           | ACTIVE   | STORAGE ENGINE     | NULL    | GPL     |
| MRG_MYISAM                       | ACTIVE   | STORAGE ENGINE     | NULL    | GPL     |
| PERFORMANCE_SCHEMA               | ACTIVE   | STORAGE ENGINE     | NULL    | GPL     |
| TempTable                        | ACTIVE   | STORAGE ENGINE     | NULL    | GPL     |
| ARCHIVE                          | ACTIVE   | STORAGE ENGINE     | NULL    | GPL     |
| BLACKHOLE                        | ACTIVE   | STORAGE ENGINE     | NULL    | GPL     |
| ndbcluster                       | DISABLED | STORAGE ENGINE     | NULL    | GPL     |
| ndbinfo                          | DISABLED | STORAGE ENGINE     | NULL    | GPL     |
| ndb_transid_mysql_connection_map | DISABLED | INFORMATION SCHEMA | NULL    | GPL     |
| ngram                            | ACTIVE   | FTPARSER           | NULL    | GPL     |
| mysqlx_cache_cleaner             | ACTIVE   | AUDIT              | NULL    | GPL     |
| mysqlx                           | ACTIVE   | DAEMON             | NULL    | GPL     |
+----------------------------------+----------+--------------------+---------+---------+
45 rows in set (0.00 sec)
```

You can also do this by checking the output of
[`SHOW ENGINES`](show-engines.html "15.7.7.18 SHOW ENGINES Statement") for a line including
`ndbinfo` in the `Engine` column
and `YES` in the `Support`
column, as shown here (emphasized text):

```
mysql> SHOW ENGINES\G
*************************** 1. row ***************************
      Engine: MEMORY
     Support: YES
     Comment: Hash based, stored in memory, useful for temporary tables
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 2. row ***************************
      Engine: InnoDB
     Support: DEFAULT
     Comment: Supports transactions, row-level locking, and foreign keys
Transactions: YES
          XA: YES
  Savepoints: YES
*************************** 3. row ***************************
      Engine: PERFORMANCE_SCHEMA
     Support: YES
     Comment: Performance Schema
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 4. row ***************************
      Engine: MyISAM
     Support: YES
     Comment: MyISAM storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 5. row ***************************
      Engine: ndbinfo
     Support: YES
     Comment: MySQL Cluster system information storage engine
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
      Engine: BLACKHOLE
     Support: YES
     Comment: /dev/null storage engine (anything you write to it disappears)
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 8. row ***************************
      Engine: CSV
     Support: YES
     Comment: CSV storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 9. row ***************************
      Engine: ARCHIVE
     Support: YES
     Comment: Archive storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 10. row ***************************
      Engine: ndbcluster
     Support: YES
     Comment: Clustered, fault-tolerant tables
Transactions: YES
          XA: NO
  Savepoints: NO
10 rows in set (0.01 sec)
```

If `ndbinfo` support is enabled, then you can
access `ndbinfo` using SQL statements in
[**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") or another MySQL client. For example, you
can see `ndbinfo` listed in the output of
[`SHOW DATABASES`](show-databases.html "15.7.7.16 SHOW DATABASES Statement"), as shown here
(emphasized text):

```
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

If the [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") process was not started with the
[`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster) option,
`ndbinfo` is not available and is not displayed
by [`SHOW DATABASES`](show-databases.html "15.7.7.16 SHOW DATABASES Statement"). If
[**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") was formerly connected to an NDB Cluster
but the cluster becomes unavailable (due to events such as cluster
shutdown, loss of network connectivity, and so forth),
`ndbinfo` and its tables remain visible, but an
attempt to access any tables (other than `blocks`
or `config_params`) fails with Got
error 157 'Connection to NDB failed' from NDBINFO.

With the exception of the [`blocks`](mysql-cluster-ndbinfo-blocks.html "25.6.15.5 The ndbinfo blocks Table")
and [`config_params`](mysql-cluster-ndbinfo-config-params.html "25.6.15.11 The ndbinfo config_params Table") tables, what
we refer to as `ndbinfo` “tables”
are actually views generated from internal
[`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 9.5") tables not normally visible to
the MySQL Server. You can make these tables visible by setting the
[`ndbinfo_show_hidden`](mysql-cluster-options-variables.html#sysvar_ndbinfo_show_hidden) system
variable to `ON` (or `1`), but
this is normally not necessary.

All `ndbinfo` tables are read-only, and are
generated on demand when queried. Because many of them are
generated in parallel by the data nodes while other are specific
to a given SQL node, they are not guaranteed to provide a
consistent snapshot.

In addition, pushing down of joins is not supported on
`ndbinfo` tables; so joining large
`ndbinfo` tables can require transfer of a large
amount of data to the requesting API node, even when the query
makes use of a `WHERE` clause.

`ndbinfo` tables are not included in the query
cache. (Bug #59831)

You can select the `ndbinfo` database with a
[`USE`](use.html "15.8.4 USE Statement") statement, and then issue a
[`SHOW TABLES`](show-tables.html "15.7.7.40 SHOW TABLES Statement") statement to obtain a
list of tables, just as for any other database, like this:

```
mysql> USE ndbinfo;
Database changed

mysql> SHOW TABLES;
+---------------------------------+
| Tables_in_ndbinfo               |
+---------------------------------+
| arbitrator_validity_detail      |
| arbitrator_validity_summary     |
| backup_id                       |
| blobs                           |
| blocks                          |
| certificates                    |
| cluster_locks                   |
| cluster_operations              |
| cluster_transactions            |
| config_nodes                    |
| config_params                   |
| config_values                   |
| counters                        |
| cpudata                         |
| cpudata_1sec                    |
| cpudata_20sec                   |
| cpudata_50ms                    |
| cpuinfo                         |
| cpustat                         |
| cpustat_1sec                    |
| cpustat_20sec                   |
| cpustat_50ms                    |
| dict_obj_info                   |
| dict_obj_tree                   |
| dict_obj_types                  |
| dictionary_columns              |
| dictionary_tables               |
| disk_write_speed_aggregate      |
| disk_write_speed_aggregate_node |
| disk_write_speed_base           |
| diskpagebuffer                  |
| diskstat                        |
| diskstats_1sec                  |
| error_messages                  |
| events                          |
| files                           |
| foreign_keys                    |
| hash_maps                       |
| hwinfo                          |
| index_columns                   |
| index_stats                     |
| locks_per_fragment              |
| logbuffers                      |
| logspaces                       |
| membership                      |
| memory_per_fragment             |
| memoryusage                     |
| nodes                           |
| operations_per_fragment         |
| pgman_time_track_stats          |
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
| transporter_details             |
| transporters                    |
+---------------------------------+
66 rows in set (0.00 sec)
```

All `ndbinfo` tables use the
`NDB` storage engine; however, an
`ndbinfo` entry still appears in the output of
[`SHOW ENGINES`](show-engines.html "15.7.7.18 SHOW ENGINES Statement") and
[`SHOW PLUGINS`](show-plugins.html "15.7.7.28 SHOW PLUGINS Statement") as described
previously.

You can execute [`SELECT`](select.html "15.2.13 SELECT Statement") statements
against these tables, just as you would normally expect:

```
mysql> SELECT * FROM memoryusage;
+---------+---------------------+--------+------------+------------+-------------+
| node_id | memory_type         | used   | used_pages | total      | total_pages |
+---------+---------------------+--------+------------+------------+-------------+
|       5 | Data memory         | 425984 |         13 | 2147483648 |       65536 |
|       5 | Long message buffer | 393216 |       1536 |   67108864 |      262144 |
|       6 | Data memory         | 425984 |         13 | 2147483648 |       65536 |
|       6 | Long message buffer | 393216 |       1536 |   67108864 |      262144 |
|       7 | Data memory         | 425984 |         13 | 2147483648 |       65536 |
|       7 | Long message buffer | 393216 |       1536 |   67108864 |      262144 |
|       8 | Data memory         | 425984 |         13 | 2147483648 |       65536 |
|       8 | Long message buffer | 393216 |       1536 |   67108864 |      262144 |
+---------+---------------------+--------+------------+------------+-------------+
8 rows in set (0.09 sec)
```

More complex queries, such as the two following
[`SELECT`](select.html "15.2.13 SELECT Statement") statements using the
[`memoryusage`](mysql-cluster-ndbinfo-memoryusage.html "25.6.15.46 The ndbinfo memoryusage Table") table, are possible:

```
mysql> SELECT SUM(used) as 'Data Memory Used, All Nodes'
     >     FROM memoryusage
     >     WHERE memory_type = 'Data memory';
+-----------------------------+
| Data Memory Used, All Nodes |
+-----------------------------+
|                        6460 |
+-----------------------------+
1 row in set (0.09 sec)

mysql> SELECT SUM(used) as 'Long Message Buffer, All Nodes'
     >     FROM memoryusage
     >     WHERE memory_type = 'Long message buffer';
+-------------------------------------+
| Long Message Buffer Used, All Nodes |
+-------------------------------------+
|                             1179648 |
+-------------------------------------+
1 row in set (0.08 sec)
```

`ndbinfo` table and column names are
case-sensitive (as is the name of the `ndbinfo`
database itself). These identifiers are in lowercase. Trying to
use the wrong lettercase results in an error, as shown in this
example:

```
mysql> SELECT * FROM nodes;
+---------+--------+---------+-------------+-------------------+
| node_id | uptime | status  | start_phase | config_generation |
+---------+--------+---------+-------------+-------------------+
|       5 |  17707 | STARTED |           0 |                 1 |
|       6 |  17706 | STARTED |           0 |                 1 |
|       7 |  17705 | STARTED |           0 |                 1 |
|       8 |  17704 | STARTED |           0 |                 1 |
+---------+--------+---------+-------------+-------------------+
4 rows in set (0.06 sec)

mysql> SELECT * FROM Nodes;
ERROR 1146 (42S02): Table 'ndbinfo.Nodes' doesn't exist
```

[**mysqldump**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program") ignores the
`ndbinfo` database entirely, and excludes it from
any output. This is true even when using the
[`--databases`](mysqldump.html#option_mysqldump_databases) or
[`--all-databases`](mysqldump.html#option_mysqldump_all-databases) option.

NDB Cluster also maintains tables in the
`INFORMATION_SCHEMA` information database,
including the [`FILES`](information-schema-files-table.html "28.3.15 The INFORMATION_SCHEMA FILES Table") table which
contains information about files used for NDB Cluster Disk Data
storage, and the
[`ndb_transid_mysql_connection_map`](information-schema-ndb-transid-mysql-connection-map-table.html "28.3.23 The INFORMATION_SCHEMA ndb_transid_mysql_connection_map Table")
table, which shows the relationships between transactions,
transaction coordinators, and NDB Cluster API nodes. For more
information, see the descriptions of the tables or
[Section 25.6.16, “INFORMATION\_SCHEMA Tables for NDB Cluster”](mysql-cluster-information-schema-tables.html "25.6.16 INFORMATION_SCHEMA Tables for NDB Cluster").