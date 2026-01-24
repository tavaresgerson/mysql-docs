### 21.3.6 Safe Shutdown and Restart of NDB Cluster

To shut down the cluster, enter the following command in a shell on the machine hosting the management node:

```sql
$> ndb_mgm -e shutdown
```

The `-e` option here is used to pass a command to the [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") client from the shell. The command causes the [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client"), [**ndb_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon"), and any [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") or [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") processes to terminate gracefully. Any SQL nodes can be terminated using [**mysqladmin shutdown**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") and other means. On Windows platforms, assuming that you have installed the SQL node as a Windows service, you can use **SC STOP *`service_name`*** or **NET STOP *`service_name`***.

To restart the cluster on Unix platforms, run these commands:

* On the management host (`198.51.100.10` in our example setup):

  ```sql
  $> ndb_mgmd -f /var/lib/mysql-cluster/config.ini
  ```

* On each of the data node hosts (`198.51.100.30` and `198.51.100.40`):

  ```sql
  $> ndbd
  ```

* Use the [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") client to verify that both data nodes have started successfully.

* On the SQL host (`198.51.100.20`):

  ```sql
  $> mysqld_safe &
  ```

On Windows platforms, assuming that you have installed all NDB Cluster processes as Windows services using the default service names (see [Section 21.3.2.4, “Installing NDB Cluster Processes as Windows Services”](mysql-cluster-install-windows-service.html "21.3.2.4 Installing NDB Cluster Processes as Windows Services")), you can restart the cluster as follows:

* On the management host (`198.51.100.10` in our example setup), execute the following command:

  ```sql
  C:\> SC START ndb_mgmd
  ```

* On each of the data node hosts (`198.51.100.30` and `198.51.100.40`), execute the following command:

  ```sql
  C:\> SC START ndbd
  ```

* On the management node host, use the [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") client to verify that the management node and both data nodes have started successfully (see [Section 21.3.2.3, “Initial Startup of NDB Cluster on Windows”](mysql-cluster-install-windows-initial-start.html "21.3.2.3 Initial Startup of NDB Cluster on Windows")).

* On the SQL node host (`198.51.100.20`), execute the following command:

  ```sql
  C:\> SC START mysql
  ```

In a production setting, it is usually not desirable to shut down the cluster completely. In many cases, even when making configuration changes, or performing upgrades to the cluster hardware or software (or both), which require shutting down individual host machines, it is possible to do so without shutting down the cluster as a whole by performing a rolling restart of the cluster. For more information about doing this, see [Section 21.6.5, “Performing a Rolling Restart of an NDB Cluster”](mysql-cluster-rolling-restart.html "21.6.5 Performing a Rolling Restart of an NDB Cluster").
