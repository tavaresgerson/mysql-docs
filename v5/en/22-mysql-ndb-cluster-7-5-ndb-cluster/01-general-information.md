## 21.1 General Information

MySQL NDB Cluster uses the MySQL server with the `NDB` storage engine. Support for the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine is not included in standard MySQL Server 5.7 binaries built by Oracle. Instead, users of NDB Cluster binaries from Oracle should upgrade to the most recent binary release of NDB Cluster for supported platforms—these include RPMs that should work with most Linux distributions. NDB Cluster users who build from source should use the sources provided for NDB Cluster. (Locations where the sources can be obtained are listed later in this section.)

Important

MySQL NDB Cluster does not support InnoDB Cluster, which must be deployed using MySQL Server 5.7 with the [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") storage engine as well as additional applications that are not included in the NDB Cluster distribution. MySQL Server 5.7 binaries cannot be used with MySQL NDB Cluster. For more information about deploying and using InnoDB Cluster, see [MySQL AdminAPI](/doc/mysql-shell/8.0/en/admin-api-userguide.html). [Section 21.2.6, “MySQL Server Using InnoDB Compared with NDB Cluster”](mysql-cluster-compared.html "21.2.6 MySQL Server Using InnoDB Compared with NDB Cluster"), discusses differences between the `NDB` and `InnoDB` storage engines.

**Supported Platforms.** NDB Cluster is currently available and supported on a number of platforms. For exact levels of support available for on specific combinations of operating system versions, operating system distributions, and hardware platforms, please refer to <https://www.mysql.com/support/supportedplatforms/cluster.html>.

**Availability.** NDB Cluster binary and source packages are available for supported platforms from <https://dev.mysql.com/downloads/cluster/>.

**NDB Cluster release numbers.** NDB Cluster follows a somewhat different release pattern from the mainline MySQL Server 5.7 series of releases. In this *Manual* and other MySQL documentation, we identify these and later NDB Cluster releases employing a version number that begins with “NDB”. This version number is that of the [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine used in the release, and not of the MySQL server version on which the NDB Cluster release is based.

**Version strings used in NDB Cluster software.** The version string displayed by NDB Cluster programs uses this format:

```sql
mysql-mysql_server_version-ndb-ndb_engine_version
```

*`mysql_server_version`* represents the version of the MySQL Server on which the NDB Cluster release is based. For all NDB Cluster 7.5 and NDB Cluster 7.6 releases, this is “5.7”. *`ndb_engine_version`* is the version of the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine used by this release of the NDB Cluster software. You can see this format used in the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client, as shown here:

```sql
$> mysql
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 2
Server version: 5.7.44-ndb-7.5.36 Source distribution

Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

mysql> SELECT VERSION()\G
*************************** 1. row ***************************
VERSION(): 5.7.44-ndb-7.5.36
1 row in set (0.00 sec)
```

This version string is also displayed in the output of the `SHOW` command in the [**ndb\_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") client:

```sql
ndb_mgm> SHOW
Connected to Management Server at: localhost:1186
Cluster Configuration
---------------------
[ndbd(NDB)]     2 node(s)
id=1    @10.0.10.6  (5.7.44-ndb-7.5.36, Nodegroup: 0, *)
id=2    @10.0.10.8  (5.7.44-ndb-7.5.36, Nodegroup: 0)

[ndb_mgmd(MGM)] 1 node(s)
id=3    @10.0.10.2  (5.7.44-ndb-7.5.36)

[mysqld(API)]   2 node(s)
id=4    @10.0.10.10  (5.7.44-ndb-7.5.36)
id=5 (not connected, accepting connect from any host)
```

The version string identifies the mainline MySQL version from which the NDB Cluster release was branched and the version of the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine used. For example, the full version string for NDB 7.5.4 (the first NDB 7.5 GA release) was `mysql-5.7.16-ndb-7.5.4`. From this we can determine the following:

* Since the portion of the version string preceding `-ndb-` is the base MySQL Server version, this means that NDB 7.5.4 derived from MySQL 5.7.16, and contained all feature enhancements and bug fixes from MySQL 5.7 up to and including MySQL 5.7.16.

* Since the portion of the version string following `-ndb-` represents the version number of the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") (or [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6")) storage engine, NDB 7.5.4 used version 7.5.4 of the [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine.

New NDB Cluster releases are numbered according to updates in the `NDB` storage engine, and do not necessarily correspond in a one-to-one fashion with mainline MySQL Server releases. For example, NDB 7.5.4 (as previously noted) was based on MySQL 5.7.16, while NDB 7.5.3 was based on MySQL 5.7.13 (version string: `mysql-5.7.13-ndb-7.5.3`).

**Compatibility with standard MySQL 5.7 releases.** While many standard MySQL schemas and applications can work using NDB Cluster, it is also true that unmodified applications and database schemas may be slightly incompatible or have suboptimal performance when run using NDB Cluster (see [Section 21.2.7, “Known Limitations of NDB Cluster”](mysql-cluster-limitations.html "21.2.7 Known Limitations of NDB Cluster")). Most of these issues can be overcome, but this also means that you are very unlikely to be able to switch an existing application datastore—that currently uses, for example, [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") or [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine")—to use the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine without allowing for the possibility of changes in schemas, queries, and applications. In addition, the MySQL Server and NDB Cluster codebases diverge considerably, so that the standard [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") cannot function as a drop-in replacement for the version of [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") supplied with NDB Cluster.

**NDB Cluster development source trees.** NDB Cluster development trees can also be accessed from <https://github.com/mysql/mysql-server>.

The NDB Cluster development sources maintained at <https://github.com/mysql/mysql-server> are licensed under the GPL. For information about obtaining MySQL sources using Git and building them yourself, see [Section 2.8.5, “Installing MySQL Using a Development Source Tree”](installing-development-tree.html "2.8.5 Installing MySQL Using a Development Source Tree").

Note

NDB Cluster 7.6 releases are built using **CMake**.

NDB Cluster 8.0 (GA) and NDB Cluster 8.4 (LTS), are recommended for new deployments; see [What is New in MySQL NDB Cluster 8.0](/doc/refman/8.0/en/mysql-cluster-what-is-new.html), and [What is New in MySQL NDB Cluster 8.4](/doc/refman/8.4/en/mysql-cluster-what-is-new.html), respectively, for more information about these release series. NDB Cluster 9.3 is also available as an Innovation release (see [What is New in MySQL NDB Cluster 9.4](/doc/refman/9.4/en/mysql-cluster-what-is-new.html)). NDB Cluster 7.6 is a previous GA release still supported in production. NDB Cluster 7.5 and earlier are previous GA releases which are no longer maintained. We recommend that new deployments for production use MySQL NDB Cluster 8.0.

The contents of this chapter are subject to revision as NDB Cluster continues to evolve. Additional information regarding NDB Cluster can be found on the MySQL website at <http://www.mysql.com/products/cluster/>.

**Additional Resources.** More information about NDB Cluster can be found in the following places:

* For answers to some commonly asked questions about NDB Cluster, see [Section A.10, “MySQL 5.7 FAQ: NDB Cluster”](faqs-mysql-cluster.html "A.10 MySQL 5.7 FAQ: NDB Cluster").

* The NDB Cluster Forum: <https://forums.mysql.com/list.php?25>.
* Many NDB Cluster users and developers blog about their experiences with NDB Cluster, and make feeds of these available through [PlanetMySQL](http://www.planetmysql.org/).
