### 21.6.10 MySQL Server Usage for NDB Cluster

[**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") is the traditional MySQL server process. To be used with NDB Cluster, [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") needs to be built with support for the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine, as it is in the precompiled binaries available from <https://dev.mysql.com/downloads/>. If you build MySQL from source, you must invoke **CMake** with the [`-DWITH_NDBCLUSTER=1`](source-configuration-options.html#option_cmake_with_ndbcluster) option to include support for `NDB`.

For more information about compiling NDB Cluster from source, see [Section 21.3.1.4, “Building NDB Cluster from Source on Linux”](mysql-cluster-install-linux-source.html "21.3.1.4 Building NDB Cluster from Source on Linux"), and [Section 21.3.2.2, “Compiling and Installing NDB Cluster from Source on Windows”](mysql-cluster-install-windows-source.html "21.3.2.2 Compiling and Installing NDB Cluster from Source on Windows").

(For information about [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") options and variables, in addition to those discussed in this section, which are relevant to NDB Cluster, see [Section 21.4.3.9, “MySQL Server Options and Variables for NDB Cluster”](mysql-cluster-options-variables.html "21.4.3.9 MySQL Server Options and Variables for NDB Cluster").)

If the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") binary has been built with Cluster support, the [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine is still disabled by default. You can use either of two possible options to enable this engine:

* Use [`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster) as a startup option on the command line when starting [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

* Insert a line containing `ndbcluster` in the `[mysqld]` section of your `my.cnf` file.

An easy way to verify that your server is running with the [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine enabled is to issue the [`SHOW ENGINES`](show-engines.html "13.7.5.16 SHOW ENGINES Statement") statement in the MySQL Monitor ([**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client")). You should see the value `YES` as the `Support` value in the row for [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"). If you see `NO` in this row or if there is no such row displayed in the output, you are not running an [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6")-enabled version of MySQL. If you see `DISABLED` in this row, you need to enable it in either one of the two ways just described.

To read cluster configuration data, the MySQL server requires at a minimum three pieces of information:

* The MySQL server's own cluster node ID
* The host name or IP address for the management server
* The number of the TCP/IP port on which it can connect to the management server

Node IDs can be allocated dynamically, so it is not strictly necessary to specify them explicitly.

The [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") parameter `ndb-connectstring` is used to specify the connection string either on the command line when starting [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") or in `my.cnf`. The connection string contains the host name or IP address where the management server can be found, as well as the TCP/IP port it uses.

In the following example, `ndb_mgmd.mysql.com` is the host where the management server resides, and the management server listens for cluster messages on port 1186:

```sql
$> mysqld --ndbcluster --ndb-connectstring=ndb_mgmd.mysql.com:1186
```

See [Section 21.4.3.3, “NDB Cluster Connection Strings”](mysql-cluster-connection-strings.html "21.4.3.3 NDB Cluster Connection Strings"), for more information on connection strings.

Given this information, the MySQL server can act as a full participant in the cluster. (We often refer to a [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") process running in this manner as an SQL node.) It is fully aware of all cluster data nodes as well as their status, and establishes connections to all data nodes. In this case, it is able to use any data node as a transaction coordinator and to read and update node data.

You can see in the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client whether a MySQL server is connected to the cluster using [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement"). If the MySQL server is connected to the cluster, and you have the [`PROCESS`](privileges-provided.html#priv_process) privilege, then the first row of the output is as shown here:

```sql
mysql> SHOW PROCESSLIST \G
*************************** 1. row ***************************
     Id: 1
   User: system user
   Host:
     db:
Command: Daemon
   Time: 1
  State: Waiting for event from ndbcluster
   Info: NULL
```

Important

To participate in an NDB Cluster, the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") process must be started with *both* the options [`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster) and [`--ndb-connectstring`](mysql-cluster-options-variables.html#option_mysqld_ndb-connectstring) (or their equivalents in `my.cnf`). If [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") is started with only the [`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster) option, or if it is unable to contact the cluster, it is not possible to work with [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables, *nor is it possible to create any new tables regardless of storage engine*. The latter restriction is a safety measure intended to prevent the creation of tables having the same names as [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables while the SQL node is not connected to the cluster. If you wish to create tables using a different storage engine while the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") process is not participating in an NDB Cluster, you must restart the server *without* the [`--ndbcluster`](mysql-cluster-options-variables.html#option_mysqld_ndbcluster) option.
