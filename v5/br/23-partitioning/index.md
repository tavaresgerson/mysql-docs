# Chapter 22 Partitioning

**Table of Contents**

[22.1 Overview of Partitioning in MySQL](partitioning-overview.html)

[22.2 Partitioning Types](partitioning-types.html) :   [22.2.1 RANGE Partitioning](partitioning-range.html)

    [22.2.2 LIST Partitioning](partitioning-list.html)

    [22.2.3 COLUMNS Partitioning](partitioning-columns.html)

    [22.2.4 HASH Partitioning](partitioning-hash.html)

    [22.2.5 KEY Partitioning](partitioning-key.html)

    [22.2.6 Subpartitioning](partitioning-subpartitions.html)

    [22.2.7 How MySQL Partitioning Handles NULL](partitioning-handling-nulls.html)

[22.3 Partition Management](partitioning-management.html) :   [22.3.1 Management of RANGE and LIST Partitions](partitioning-management-range-list.html)

    [22.3.2 Management of HASH and KEY Partitions](partitioning-management-hash-key.html)

    [22.3.3 Exchanging Partitions and Subpartitions with Tables](partitioning-management-exchange.html)

    [22.3.4 Maintenance of Partitions](partitioning-maintenance.html)

    [22.3.5 Obtaining Information About Partitions](partitioning-info.html)

[22.4 Partition Pruning](partitioning-pruning.html)

[22.5 Partition Selection](partitioning-selection.html)

[22.6 Restrictions and Limitations on Partitioning](partitioning-limitations.html) :   [22.6.1 Partitioning Keys, Primary Keys, and Unique Keys](partitioning-limitations-partitioning-keys-unique-keys.html)

    [22.6.2 Partitioning Limitations Relating to Storage Engines](partitioning-limitations-storage-engines.html)

    [22.6.3 Partitioning Limitations Relating to Functions](partitioning-limitations-functions.html)

    [22.6.4 Partitioning and Locking](partitioning-limitations-locking.html)

This chapter discusses MySQL's implementation of user-defined partitioning.

Note

As of MySQL 5.7.17, the generic partitioning handler in the MySQL server is deprecated, and is removed in MySQL 8.0, when the storage engine used for a given table is expected to provide its own (“native”) partitioning handler. Currently, only the [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") and [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engines do this.

Use of tables with nonnative partitioning results in an [`ER_WARN_DEPRECATED_SYNTAX`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_warn_deprecated_syntax) warning. In MySQL 5.7.17 through 5.7.20, the server automatically performs a check at startup to identify tables that use nonnative partitioning; for any that are found, the server writes a message to its error log. To disable this check, use the [`--disable-partition-engine-check`](server-options.html#option_mysqld_disable-partition-engine-check) option. In MySQL 5.7.21 and later, this check is *not* performed; in these versions, you must start the server with [`--disable-partition-engine-check=false`](server-options.html#option_mysqld_disable-partition-engine-check), if you wish for the server to check for tables using the generic partitioning handler (Bug #85830, Bug #25846957).

To prepare for migration to MySQL 8.0, any table with nonnative partitioning should be changed to use an engine that provides native partitioning, or be made nonpartitioned. For example, to change a table to `InnoDB`, execute this statement:

```sql
ALTER TABLE table_name ENGINE = INNODB;
```

You can determine whether your MySQL Server supports partitioning by checking the output of the [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement") statement, like this:

```sql
mysql> SHOW PLUGINS;
+------------+----------+----------------+---------+---------+
| Name       | Status   | Type           | Library | License |
+------------+----------+----------------+---------+---------+
| binlog     | ACTIVE   | STORAGE ENGINE | NULL    | GPL     |
| partition  | ACTIVE   | STORAGE ENGINE | NULL    | GPL     |
| ARCHIVE    | ACTIVE   | STORAGE ENGINE | NULL    | GPL     |
| BLACKHOLE  | ACTIVE   | STORAGE ENGINE | NULL    | GPL     |
| CSV        | ACTIVE   | STORAGE ENGINE | NULL    | GPL     |
| FEDERATED  | DISABLED | STORAGE ENGINE | NULL    | GPL     |
| MEMORY     | ACTIVE   | STORAGE ENGINE | NULL    | GPL     |
| InnoDB     | ACTIVE   | STORAGE ENGINE | NULL    | GPL     |
| MRG_MYISAM | ACTIVE   | STORAGE ENGINE | NULL    | GPL     |
| MyISAM     | ACTIVE   | STORAGE ENGINE | NULL    | GPL     |
| ndbcluster | DISABLED | STORAGE ENGINE | NULL    | GPL     |
+------------+----------+----------------+---------+---------+
11 rows in set (0.00 sec)
```

You can also check the Information Schema [`PLUGINS`](information-schema-plugins-table.html "24.3.17 The INFORMATION_SCHEMA PLUGINS Table") table with a query similar to this one:

```sql
mysql> SELECT
    ->     PLUGIN_NAME as Name,
    ->     PLUGIN_VERSION as Version,
    ->     PLUGIN_STATUS as Status
    -> FROM INFORMATION_SCHEMA.PLUGINS
    -> WHERE PLUGIN_TYPE='STORAGE ENGINE';
+--------------------+---------+--------+
| Name               | Version | Status |
+--------------------+---------+--------+
| binlog             | 1.0     | ACTIVE |
| CSV                | 1.0     | ACTIVE |
| MEMORY             | 1.0     | ACTIVE |
| MRG_MYISAM         | 1.0     | ACTIVE |
| MyISAM             | 1.0     | ACTIVE |
| PERFORMANCE_SCHEMA | 0.1     | ACTIVE |
| BLACKHOLE          | 1.0     | ACTIVE |
| ARCHIVE            | 3.0     | ACTIVE |
| InnoDB             | 5.7     | ACTIVE |
| partition          | 1.0     | ACTIVE |
+--------------------+---------+--------+
10 rows in set (0.00 sec)
```

In either case, if you do not see the `partition` plugin listed with the value `ACTIVE` for the `Status` column in the output (shown in bold text in each of the examples just given), then your version of MySQL was not built with partitioning support.

MySQL 5.7 Community binaries provided by Oracle include partitioning support. For information about partitioning support offered in MySQL Enterprise Edition binaries, see [Chapter 28, *MySQL Enterprise Edition*](mysql-enterprise.html "Chapter 28 MySQL Enterprise Edition").

To enable partitioning if you are compiling MySQL 5.7 from source, the build must be configured with the [`-DWITH_PARTITION_STORAGE_ENGINE`](source-configuration-options.html#option_cmake_storage_engine_options "Storage Engine Options") option. For more information, see [Section 2.8, “Installing MySQL from Source”](source-installation.html "2.8 Installing MySQL from Source").

If your MySQL binary is built with partitioning support, nothing further needs to be done to enable it (for example, no special entries are required in your `my.cnf` file).

If you want to disable partitioning support, you can start the MySQL Server with the [`--skip-partition`](server-options.html#option_mysqld_skip-partition) option. When partitioning support is disabled, you can see any existing partitioned tables and drop them (although doing this is not advised), but you cannot otherwise manipulate them or access their data.

See [Section 22.1, “Overview of Partitioning in MySQL”](partitioning-overview.html "22.1 Overview of Partitioning in MySQL"), for an introduction to partitioning and partitioning concepts.

MySQL supports several types of partitioning as well as subpartitioning; see [Section 22.2, “Partitioning Types”](partitioning-types.html "22.2 Partitioning Types"), and [Section 22.2.6, “Subpartitioning”](partitioning-subpartitions.html "22.2.6 Subpartitioning").

[Section 22.3, “Partition Management”](partitioning-management.html "22.3 Partition Management"), covers methods of adding, removing, and altering partitions in existing partitioned tables.

[Section 22.3.4, “Maintenance of Partitions”](partitioning-maintenance.html "22.3.4 Maintenance of Partitions"), discusses table maintenance commands for use with partitioned tables.

The [`PARTITIONS`](information-schema-partitions-table.html "24.3.16 The INFORMATION_SCHEMA PARTITIONS Table") table in the `INFORMATION_SCHEMA` database provides information about partitions and partitioned tables. See [Section 24.3.16, “The INFORMATION_SCHEMA PARTITIONS Table”](information-schema-partitions-table.html "24.3.16 The INFORMATION_SCHEMA PARTITIONS Table"), for more information; for some examples of queries against this table, see [Section 22.2.7, “How MySQL Partitioning Handles NULL”](partitioning-handling-nulls.html "22.2.7 How MySQL Partitioning Handles NULL").

For known issues with partitioning in MySQL 5.7, see [Section 22.6, “Restrictions and Limitations on Partitioning”](partitioning-limitations.html "22.6 Restrictions and Limitations on Partitioning").

You may also find the following resources to be useful when working with partitioned tables.

**Additional Resources.** Other sources of information about user-defined partitioning in MySQL include the following:

* [MySQL Partitioning Forum](https://forums.mysql.com/list.php?106)

  This is the official discussion forum for those interested in or experimenting with MySQL Partitioning technology. It features announcements and updates from MySQL developers and others. It is monitored by members of the Partitioning Development and Documentation Teams.

* [PlanetMySQL](http://www.planetmysql.org/)

  A MySQL news site featuring MySQL-related blogs, which should be of interest to anyone using my MySQL. We encourage you to check here for links to blogs kept by those working with MySQL Partitioning, or to have your own blog added to those covered.

MySQL 5.7 binaries are available from <https://dev.mysql.com/downloads/mysql/5.7.html>. However, for the latest partitioning bugfixes and feature additions, you can obtain the source from our GitHub repository. To enable partitioning, the build must be configured with the [`-DWITH_PARTITION_STORAGE_ENGINE`](source-configuration-options.html#option_cmake_storage_engine_options "Storage Engine Options") option. For more information about building MySQL, see [Section 2.8, “Installing MySQL from Source”](source-installation.html "2.8 Installing MySQL from Source"). If you have problems compiling a partitioning-enabled MySQL 5.7 build, check the [MySQL Partitioning Forum](https://forums.mysql.com/list.php?106) and ask for assistance there if you do not find a solution to your problem already posted.
