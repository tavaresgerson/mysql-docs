### 25.3.6 Safe Shutdown and Restart of NDB Cluster

To shut down the cluster, enter the following command in a shell on the machine hosting the management node:

```
$> ndb_mgm -e shutdown
```

The `-e` option here is used to pass a command to the **ndb_mgm** client from the shell. The command causes the **ndb_mgm**, **ndb_mgmd**, and any **ndbd** or **ndbmtd**") processes to terminate gracefully. Any SQL nodes can be terminated using **mysqladmin shutdown** and other means. On Windows platforms, assuming that you have installed the SQL node as a Windows service, you can use **SC STOP *`service_name`*** or **NET STOP *`service_name`***.

To restart the cluster on Unix platforms, run these commands:

* On the management host (`198.51.100.10` in our example setup):

  ```
  $> ndb_mgmd -f /var/lib/mysql-cluster/config.ini
  ```

* On each of the data node hosts (`198.51.100.30` and `198.51.100.40`):

  ```
  $> ndbd
  ```

* Use the **ndb_mgm** client to verify that both data nodes have started successfully.

* On the SQL host (`198.51.100.20`):

  ```
  $> mysqld_safe &
  ```

On Windows platforms, assuming that you have installed all NDB Cluster processes as Windows services using the default service names (see Section 25.3.2.4, “Installing NDB Cluster Processes as Windows Services”), you can restart the cluster as follows:

* On the management host (`198.51.100.10` in our example setup), execute the following command:

  ```
  C:\> SC START ndb_mgmd
  ```

* On each of the data node hosts (`198.51.100.30` and `198.51.100.40`), execute the following command:

  ```
  C:\> SC START ndbd
  ```

* On the management node host, use the **ndb_mgm** client to verify that the management node and both data nodes have started successfully (see Section 25.3.2.3, “Initial Startup of NDB Cluster on Windows”).

* On the SQL node host (`198.51.100.20`), execute the following command:

  ```
  C:\> SC START mysql
  ```

In a production setting, it is usually not desirable to shut down the cluster completely. In many cases, even when making configuration changes, or performing upgrades to the cluster hardware or software (or both), which require shutting down individual host machines, it is possible to do so without shutting down the cluster as a whole by performing a rolling restart of the cluster. For more information about doing this, see Section 25.6.5, “Performing a Rolling Restart of an NDB Cluster”.
