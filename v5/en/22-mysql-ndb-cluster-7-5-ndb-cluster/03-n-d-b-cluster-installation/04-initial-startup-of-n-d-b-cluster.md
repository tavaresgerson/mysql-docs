### 21.3.4 Initial Startup of NDB Cluster

Starting the cluster is not very difficult after it has been configured. Each cluster node process must be started separately, and on the host where it resides. The management node should be started first, followed by the data nodes, and then finally by any SQL nodes:

1. On the management host, issue the following command from the system shell to start the management node process:

   ```sql
   $> ndb_mgmd --initial -f /var/lib/mysql-cluster/config.ini
   ```

   The first time that it is started, [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") must be told where to find its configuration file, using the `-f` or [`--config-file`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file) option. This option requires that [`--initial`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_initial) or [`--reload`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_reload) also be specified; see [Section 21.5.4, “ndb\_mgmd — The NDB Cluster Management Server Daemon”](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon"), for details.

2. On each of the data node hosts, run this command to start the [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") process:

   ```sql
   $> ndbd
   ```

3. If you used RPM files to install MySQL on the cluster host where the SQL node is to reside, you can (and should) use the supplied startup script to start the MySQL server process on the SQL node.

If all has gone well, and the cluster has been set up correctly, the cluster should now be operational. You can test this by invoking the [**ndb\_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") management node client. The output should look like that shown here, although you might see some slight differences in the output depending upon the exact version of MySQL that you are using:

```sql
$> ndb_mgm
-- NDB Cluster -- Management Client --
ndb_mgm> SHOW
Connected to Management Server at: localhost:1186
Cluster Configuration
---------------------
[ndbd(NDB)]     2 node(s)
id=2    @198.51.100.30  (Version: 5.7.44-ndb-7.6.36, Nodegroup: 0, *)
id=3    @198.51.100.40  (Version: 5.7.44-ndb-7.6.36, Nodegroup: 0)

[ndb_mgmd(MGM)] 1 node(s)
id=1    @198.51.100.10  (Version: 5.7.44-ndb-7.6.36)

[mysqld(API)]   1 node(s)
id=4    @198.51.100.20  (Version: 5.7.44-ndb-7.6.36)
```

The SQL node is referenced here as `[mysqld(API)]`, which reflects the fact that the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") process is acting as an NDB Cluster API node.

Note

The IP address shown for a given NDB Cluster SQL or other API node in the output of [`SHOW`](mysql-cluster-mgm-client-commands.html#ndbclient-show) is the address used by the SQL or API node to connect to the cluster data nodes, and not to any management node.

You should now be ready to work with databases, tables, and data in NDB Cluster. See [Section 21.3.5, “NDB Cluster Example with Tables and Data”](mysql-cluster-install-example-data.html "21.3.5 NDB Cluster Example with Tables and Data"), for a brief discussion.
