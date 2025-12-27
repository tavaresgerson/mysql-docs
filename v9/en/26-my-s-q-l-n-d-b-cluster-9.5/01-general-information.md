## 25.1 General Information

MySQL NDB Cluster uses the MySQL server with the `NDB` storage engine. Support for the `NDB` storage engine is not included in standard MySQL Server 9.5 binaries built by Oracle. Instead, users of NDB Cluster binaries from Oracle should upgrade to the most recent binary release of NDB Cluster for supported platforms—these include RPMs that should work with most Linux distributions. NDB Cluster 9.5 users who build from source should use the sources provided for MySQL 9.5 and build with the options required to provide NDB support. (Locations where the sources can be obtained are listed later in this section.)

Important

MySQL NDB Cluster does not support InnoDB Cluster, which must be deployed using MySQL Server `InnoDB` storage engine as well as additional applications that are not included in the NDB Cluster distribution. MySQL Server 9.5 binaries cannot be used with MySQL NDB Cluster. For more information about deploying and using InnoDB Cluster, see MySQL AdminAPI. Section 25.2.6, “MySQL Server Using InnoDB Compared with NDB Cluster”, discusses differences between the `NDB` and `InnoDB` storage engines.

**Supported Platforms.** NDB Cluster is currently available and supported on a number of platforms. For exact levels of support available for on specific combinations of operating system versions, operating system distributions, and hardware platforms, please refer to <https://www.mysql.com/support/supportedplatforms/cluster.html>.

**Availability.** NDB Cluster binary and source packages are available for supported platforms from <https://dev.mysql.com/downloads/cluster/>.

**Version strings used in NDB Cluster software.** The version string displayed by the **mysql** client supplied with the MySQL NDB Cluster distribution uses this format:

```
mysql-mysql_server_version-cluster
```

*`mysql_server_version`* represents the version of the MySQL Server on which the NDB Cluster release is based. Building from source using `-DWITH_NDB` or the equivalent adds the `-cluster` suffix to the version string. (See Section 25.3.1.4, “Building NDB Cluster from Source on Linux”, and Section 25.3.2.2, “Compiling and Installing NDB Cluster from Source on Windows”.) You can see this format used in the **mysql** client, as shown here:

```
$> mysql
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 2
Server version: 9.4.0-cluster Source distribution

Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

mysql> SELECT VERSION()\G
*************************** 1. row ***************************
VERSION(): 9.4.0-cluster
1 row in set (0.00 sec)
```

The version string displayed by other NDB Cluster programs not normally included with the MySQL 9.5 distribution uses this format:

```
mysql-mysql_server_version ndb-ndb_engine_version
```

*`mysql_server_version`* represents the version of the MySQL Server on which the NDB Cluster release is based. For NDB Cluster 9.5, this is `9.5.n`, where *`n`* is the release number. *`ndb_engine_version`* is the version of the `NDB` storage engine used by this release of the NDB Cluster software. For NDB 9.5, this number is the same as the MySQL Server version. You can see this format used in the output of the `SHOW` command in the **ndb\_mgm** client, like this:

```
ndb_mgm> SHOW
Connected to Management Server at: localhost:1186 (using cleartext)
Cluster Configuration
---------------------
[ndbd(NDB)]     2 node(s)
id=1    @10.0.10.6  (mysql-9.5.0 ndb-9.5.0, Nodegroup: 0, *)
id=2    @10.0.10.8  (mysql-9.5.0 ndb-9.5.0, Nodegroup: 0)

[ndb_mgmd(MGM)] 1 node(s)
id=3    @10.0.10.2  (mysql-9.5.0 ndb-9.5.0)

[mysqld(API)]   2 node(s)
id=4    @10.0.10.10  (mysql-9.5.0 ndb-9.5.0)
id=5 (not connected, accepting connect from any host)
```

**Compatibility with standard MySQL 9.5 releases.** While many standard MySQL schemas and applications can work using NDB Cluster, it is also true that unmodified applications and database schemas may be slightly incompatible or have suboptimal performance when run using NDB Cluster (see Section 25.2.7, “Known Limitations of NDB Cluster”). Most of these issues can be overcome, but this also means that you are very unlikely to be able to switch an existing application datastore—that currently uses, for example, `MyISAM` or `InnoDB`—to use the `NDB` storage engine without allowing for the possibility of changes in schemas, queries, and applications. A **mysqld** compiled without `NDB` support (that is, built without `-DWITH_NDB` or `-DWITH_NDBCLUSTER_STORAGE_ENGINE`) cannot function as a drop-in replacement for a **mysqld** that is built with it.

**NDB Cluster development source trees.** NDB Cluster development trees can also be accessed from <https://github.com/mysql/mysql-server>.

The NDB Cluster development sources maintained at <https://github.com/mysql/mysql-server> are licensed under the GPL. For information about obtaining MySQL sources using Git and building them yourself, see Section 2.8.5, “Installing MySQL Using a Development Source Tree”.

Note

As with MySQL Server 9.5, NDB Cluster 9.5 releases are built using **CMake**.

NDB Cluster 9.5 is available as an Innovation release, with new features under development and intended for preview and testing. NDB Cluster 8.4 is the current LTS release series, and is recommended for new deployments (see MySQL NDB Cluster 8.4). NDB Cluster 8.0, 7.6, and 7.5 are previous GA releases still supported in production, although we recommend NDB Cluster 8.4 for new deployments intended for use in production.

Additional information regarding NDB Cluster can be found on the MySQL website at <https://www.mysql.com/products/cluster/>.

**Additional Resources.** More information about NDB Cluster can be found in the following places:

* For answers to some commonly asked questions about NDB Cluster, see Section A.10, “MySQL 9.5 FAQ: NDB Cluster”.

* The NDB Cluster Forum: <https://forums.mysql.com/list.php?25>.
* Many NDB Cluster users and developers blog about their experiences with NDB Cluster, and make feeds of these available through PlanetMySQL.
