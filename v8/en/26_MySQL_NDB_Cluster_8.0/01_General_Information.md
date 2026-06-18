## 25.1 General Information

MySQL NDB Cluster uses the MySQL server with the
`NDB` storage engine. Support for the
[`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 8.0") storage engine is not included in
standard MySQL Server 8.0 binaries built by Oracle. Instead, users
of NDB Cluster binaries from Oracle should upgrade to the most
recent binary release of NDB Cluster for supported
platforms—these include RPMs that should work with most Linux
distributions. NDB Cluster 8.0 users who build from source should
use the sources provided for MySQL 8.0 and build with the options
required to provide NDB support. (Locations where the sources can be
obtained are listed later in this section.)

Important

MySQL NDB Cluster does not support InnoDB Cluster, which must be
deployed using MySQL Server 8.0 with the
[`InnoDB`](innodb-storage-engine.html "Chapter 17 The InnoDB Storage Engine") storage engine as well as
additional applications that are not included in the NDB Cluster
distribution. MySQL Server 8.0 binaries cannot be used with MySQL
NDB Cluster. For more information about deploying and using
InnoDB Cluster, see [MySQL AdminAPI](/doc/mysql-shell/8.0/en/admin-api-userguide.html).
[Section 25.2.6, “MySQL Server Using InnoDB Compared with NDB Cluster”](mysql-cluster-compared.html "25.2.6 MySQL Server Using InnoDB Compared with NDB Cluster"), discusses differences
between the `NDB` and `InnoDB`
storage engines.

**Supported Platforms.**
NDB Cluster is currently available and supported on a number of
platforms. For exact levels of support available for on specific
combinations of operating system versions, operating system
distributions, and hardware platforms, please refer to
<https://www.mysql.com/support/supportedplatforms/cluster.html>.

**Availability.**
NDB Cluster binary and source packages are available for supported
platforms from <https://dev.mysql.com/downloads/cluster/>.

**NDB Cluster release numbers.**
NDB 8.0 follows the same release pattern as the MySQL Server 8.0
series of releases, beginning with MySQL 8.0.13 and MySQL NDB
Cluster 8.0.13. In this *Manual* and other
MySQL documentation, we identify these and later NDB Cluster
releases employing a version number that begins with
“NDB”. This version number is that of the
[`NDBCLUSTER`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 8.0") storage engine used in the
NDB 8.0 release, and is the same as the MySQL 8.0 server version
on which the NDB Cluster 8.0 release is based.

**Version strings used in NDB Cluster software.**
The version string displayed by the [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client")
client supplied with the MySQL NDB Cluster distribution uses this
format:

```
mysql-mysql_server_version-cluster
```

*`mysql_server_version`* represents the
version of the MySQL Server on which the NDB Cluster release is
based. For all NDB Cluster 8.0 releases, this is
`8.0.n`, where
*`n`* is the release number. Building from
source using [`-DWITH_NDB`](source-configuration-options.html#option_cmake_with_ndb) or the
equivalent adds the `-cluster` suffix to the
version string. (See
[Section 25.3.1.4, “Building NDB Cluster from Source on Linux”](mysql-cluster-install-linux-source.html "25.3.1.4 Building NDB Cluster from Source on Linux"), and
[Section 25.3.2.2, “Compiling and Installing NDB Cluster from Source on Windows”](mysql-cluster-install-windows-source.html "25.3.2.2 Compiling and Installing NDB Cluster from Source on Windows").) You can see
this format used in the [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") client, as shown
here:

```
$> mysql
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 2
Server version: 8.0.44-cluster Source distribution

Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

mysql> SELECT VERSION()\G
*************************** 1. row ***************************
VERSION(): 8.0.44-cluster
1 row in set (0.00 sec)
```

The first General Availability release of NDB Cluster using MySQL
8.0 is NDB 8.0.19, using MySQL 8.0.19.

The version string displayed by other NDB Cluster programs not
normally included with the MySQL 8.0 distribution uses this format:

```
mysql-mysql_server_version ndb-ndb_engine_version
```

*`mysql_server_version`* represents the
version of the MySQL Server on which the NDB Cluster release is
based. For all NDB Cluster 8.0 releases, this is
`8.0.n`, where
*`n`* is the release number.
*`ndb_engine_version`* is the version of the
[`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 8.0") storage engine used by this release
of the NDB Cluster software. For all NDB 8.0 releases, this number
is the same as the MySQL Server version. You can see this format
used in the output of the `SHOW` command in the
[**ndb\_mgm**](mysql-cluster-programs-ndb-mgm.html "25.5.5 ndb_mgm — The NDB Cluster Management Client") client, like this:

```
ndb_mgm> SHOW
Connected to Management Server at: localhost:1186
Cluster Configuration
---------------------
[ndbd(NDB)]     2 node(s)
id=1    @10.0.10.6  (mysql-8.0.44 ndb-8.0.44, Nodegroup: 0, *)
id=2    @10.0.10.8  (mysql-8.0.44 ndb-8.0.44, Nodegroup: 0)

[ndb_mgmd(MGM)] 1 node(s)
id=3    @10.0.10.2  (mysql-8.0.44 ndb-8.0.44)

[mysqld(API)]   2 node(s)
id=4    @10.0.10.10  (mysql-8.0.44 ndb-8.0.44)
id=5 (not connected, accepting connect from any host)
```

**Compatibility with standard MySQL 8.0 releases.**
While many standard MySQL schemas and applications can work using
NDB Cluster, it is also true that unmodified applications and
database schemas may be slightly incompatible or have suboptimal
performance when run using NDB Cluster (see
[Section 25.2.7, “Known Limitations of NDB Cluster”](mysql-cluster-limitations.html "25.2.7 Known Limitations of NDB Cluster")). Most of these issues
can be overcome, but this also means that you are very unlikely to
be able to switch an existing application datastore—that
currently uses, for example, [`MyISAM`](myisam-storage-engine.html "18.2 The MyISAM Storage Engine")
or [`InnoDB`](innodb-storage-engine.html "Chapter 17 The InnoDB Storage Engine")—to use the
[`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 8.0") storage engine without allowing
for the possibility of changes in schemas, queries, and
applications. A [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") compiled without
`NDB` support (that is, built without
[`-DWITH_NDB`](source-configuration-options.html#option_cmake_with_ndb) or
[`-DWITH_NDBCLUSTER_STORAGE_ENGINE`](source-configuration-options.html#option_cmake_with_ndbcluster_storage_engine))
cannot function as a drop-in replacement for a
[**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") that is built with it.

**NDB Cluster development source trees.**
NDB Cluster development trees can also be accessed from
<https://github.com/mysql/mysql-server>.

The NDB Cluster development sources maintained at
<https://github.com/mysql/mysql-server> are licensed
under the GPL. For information about obtaining MySQL sources using
Git and building them yourself, see
[Section 2.8.5, “Installing MySQL Using a Development Source Tree”](installing-development-tree.html "2.8.5 Installing MySQL Using a Development Source Tree").

Note

As with MySQL Server 8.0, NDB Cluster 8.0 releases are built using
**CMake**.

NDB Cluster 8.0 is available beginning with NDB 8.0.19 as a General
Availability release, and is recommended for new deployments. NDB
Cluster 7.6 and 7.5 are previous GA releases still supported in
production; for information about NDB Cluster 7.6, see
[What is New in NDB Cluster 7.6](/doc/refman/5.7/en/mysql-cluster-what-is-new-7-6.html). For
similar information about NDB Cluster 7.5, see
[What is New in NDB Cluster 7.5](/doc/refman/5.7/en/mysql-cluster-what-is-new-7-5.html). NDB
Cluster 7.4 and 7.3 are previous GA releases which are no longer
maintained. We recommend that new deployments for production use
MySQL NDB Cluster 8.0.

The contents of this chapter are subject to revision as NDB Cluster
continues to evolve. Additional information regarding NDB Cluster
can be found on the MySQL website at
<http://www.mysql.com/products/cluster/>.

**Additional Resources.**
More information about NDB Cluster can be found in the following
places:

* For answers to some commonly asked questions about NDB Cluster,
  see [Section A.10, “MySQL 8.0 FAQ: NDB Cluster”](faqs-mysql-cluster.html "A.10 MySQL 8.0 FAQ: NDB Cluster").

* The NDB Cluster Forum: <https://forums.mysql.com/list.php?25>.
* Many NDB Cluster users and developers blog about their
  experiences with NDB Cluster, and make feeds of these available
  through
  [PlanetMySQL](http://www.planetmysql.org/).