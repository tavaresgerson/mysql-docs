# Chapter 22 Partitioning

This chapter discusses MySQL's implementation of user-defined partitioning.

Note

As of MySQL 5.7.17, the generic partitioning handler in the MySQL server is deprecated, and is removed in MySQL 8.0, when the storage engine used for a given table is expected to provide its own (“native”) partitioning handler. Currently, only the `InnoDB` and `NDB` storage engines do this.

Use of tables with nonnative partitioning results in an `ER_WARN_DEPRECATED_SYNTAX` warning. In MySQL 5.7.17 through 5.7.20, the server automatically performs a check at startup to identify tables that use nonnative partitioning; for any that are found, the server writes a message to its error log. To disable this check, use the `--disable-partition-engine-check` option. In MySQL 5.7.21 and later, this check is *not* performed; in these versions, you must start the server with `--disable-partition-engine-check=false`, if you wish for the server to check for tables using the generic partitioning handler (Bug #85830, Bug #25846957).

To prepare for migration to MySQL 8.0, any table with nonnative partitioning should be changed to use an engine that provides native partitioning, or be made nonpartitioned. For example, to change a table to `InnoDB`, execute this statement:

```sql
ALTER TABLE table_name ENGINE = INNODB;
```

You can determine whether your MySQL Server supports partitioning by checking the output of the `SHOW PLUGINS` statement, like this:

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

You can also check the Information Schema `PLUGINS` table with a query similar to this one:

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

MySQL 5.7 Community binaries provided by Oracle include partitioning support. For information about partitioning support offered in MySQL Enterprise Edition binaries, see Chapter 28, *MySQL Enterprise Edition*.

To enable partitioning if you are compiling MySQL 5.7 from source, the build must be configured with the `-DWITH_PARTITION_STORAGE_ENGINE` option. For more information, see Section 2.8, “Installing MySQL from Source”.

If your MySQL binary is built with partitioning support, nothing further needs to be done to enable it (for example, no special entries are required in your `my.cnf` file).

If you want to disable partitioning support, you can start the MySQL Server with the `--skip-partition` option. When partitioning support is disabled, you can see any existing partitioned tables and drop them (although doing this is not advised), but you cannot otherwise manipulate them or access their data.

See Section 22.1, “Overview of Partitioning in MySQL”, for an introduction to partitioning and partitioning concepts.

MySQL supports several types of partitioning as well as subpartitioning; see Section 22.2, “Partitioning Types”, and Section 22.2.6, “Subpartitioning”.

Section 22.3, “Partition Management”, covers methods of adding, removing, and altering partitions in existing partitioned tables.

Section 22.3.4, “Maintenance of Partitions”, discusses table maintenance commands for use with partitioned tables.

The `PARTITIONS` table in the `INFORMATION_SCHEMA` database provides information about partitions and partitioned tables. See Section 24.3.16, “The INFORMATION\_SCHEMA PARTITIONS Table”, for more information; for some examples of queries against this table, see Section 22.2.7, “How MySQL Partitioning Handles NULL”.

For known issues with partitioning in MySQL 5.7, see Section 22.6, “Restrictions and Limitations on Partitioning”.

You may also find the following resources to be useful when working with partitioned tables.

**Additional Resources.** Other sources of information about user-defined partitioning in MySQL include the following:

* [MySQL Partitioning Forum](https://forums.mysql.com/list.php?106)

  This is the official discussion forum for those interested in or experimenting with MySQL Partitioning technology. It features announcements and updates from MySQL developers and others. It is monitored by members of the Partitioning Development and Documentation Teams.

* PlanetMySQL

  A MySQL news site featuring MySQL-related blogs, which should be of interest to anyone using my MySQL. We encourage you to check here for links to blogs kept by those working with MySQL Partitioning, or to have your own blog added to those covered.

MySQL 5.7 binaries are available from <https://dev.mysql.com/downloads/mysql/5.7.html>. However, for the latest partitioning bugfixes and feature additions, you can obtain the source from our GitHub repository. To enable partitioning, the build must be configured with the `-DWITH_PARTITION_STORAGE_ENGINE` option. For more information about building MySQL, see Section 2.8, “Installing MySQL from Source”. If you have problems compiling a partitioning-enabled MySQL 5.7 build, check the [MySQL Partitioning Forum](https://forums.mysql.com/list.php?106) and ask for assistance there if you do not find a solution to your problem already posted.