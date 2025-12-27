#### 21.3.2.3 Initial Startup of NDB Cluster on Windows

Once the NDB Cluster executables and needed configuration files are in place, performing an initial start of the cluster is simply a matter of starting the NDB Cluster executables for all nodes in the cluster. Each cluster node process must be started separately, and on the host computer where it resides. The management node should be started first, followed by the data nodes, and then finally by any SQL nodes.

1. On the management node host, issue the following command from the command line to start the management node process. The output should appear similar to what is shown here:

   ```sql
   C:\mysql\bin> ndb_mgmd
   2010-06-23 07:53:34 [MgmtSrvr] INFO -- NDB Cluster Management Server. mysql-5.7.44-ndb-7.6.36
   2010-06-23 07:53:34 [MgmtSrvr] INFO -- Reading cluster configuration from 'config.ini'
   ```

   The management node process continues to print logging output to the console. This is normal, because the management node is not running as a Windows service. (If you have used NDB Cluster on a Unix-like platform such as Linux, you may notice that the management node's default behavior in this regard on Windows is effectively the opposite of its behavior on Unix systems, where it runs by default as a Unix daemon process. This behavior is also true of NDB Cluster data node processes running on Windows.) For this reason, do not close the window in which [**ndb\_mgmd.exe**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") is running; doing so kills the management node process. (See [Section 21.3.2.4, “Installing NDB Cluster Processes as Windows Services”](mysql-cluster-install-windows-service.html "21.3.2.4 Installing NDB Cluster Processes as Windows Services"), where we show how to install and run NDB Cluster processes as Windows services.)

   The required `-f` option tells the management node where to find the global configuration file (`config.ini`). The long form of this option is [`--config-file`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file).

   Important

   An NDB Cluster management node caches the configuration data that it reads from `config.ini`; once it has created a configuration cache, it ignores the `config.ini` file on subsequent starts unless forced to do otherwise. This means that, if the management node fails to start due to an error in this file, you must make the management node re-read `config.ini` after you have corrected any errors in it. You can do this by starting [**ndb\_mgmd.exe**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") with the [`--reload`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_reload) or [`--initial`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_initial) option on the command line. Either of these options works to refresh the configuration cache.

   It is not necessary or advisable to use either of these options in the management node's `my.ini` file.

2. On each of the data node hosts, run the command shown here to start the data node processes:

   ```sql
   C:\mysql\bin> ndbd
   2010-06-23 07:53:46 [ndbd] INFO -- Configuration fetched from 'localhost:1186', generation: 1
   ```

   In each case, the first line of output from the data node process should resemble what is shown in the preceding example, and is followed by additional lines of logging output. As with the management node process, this is normal, because the data node is not running as a Windows service. For this reason, do not close the console window in which the data node process is running; doing so kills [**ndbd.exe**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon"). (For more information, see [Section 21.3.2.4, “Installing NDB Cluster Processes as Windows Services”](mysql-cluster-install-windows-service.html "21.3.2.4 Installing NDB Cluster Processes as Windows Services").)

3. Do not start the SQL node yet; it cannot connect to the cluster until the data nodes have finished starting, which may take some time. Instead, in a new console window on the management node host, start the NDB Cluster management client [**ndb\_mgm.exe**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client"), which should be in `C:\mysql\bin` on the management node host. (Do not try to re-use the console window where [**ndb\_mgmd.exe**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") is running by typing **CTRL**+**C**, as this kills the management node.) The resulting output should look like this:

   ```sql
   C:\mysql\bin> ndb_mgm
   -- NDB Cluster -- Management Client --
   ndb_mgm>
   ```

   When the prompt `ndb_mgm>` appears, this indicates that the management client is ready to receive NDB Cluster management commands. You can observe the status of the data nodes as they start by entering [`ALL STATUS`](mysql-cluster-mgm-client-commands.html#ndbclient-status) at the management client prompt. This command causes a running report of the data nodes's startup sequence, which should look something like this:

   ```sql
   ndb_mgm> ALL STATUS
   Connected to Management Server at: localhost:1186
   Node 2: starting (Last completed phase 3) (mysql-5.7.44-ndb-7.6.36)
   Node 3: starting (Last completed phase 3) (mysql-5.7.44-ndb-7.6.36)

   Node 2: starting (Last completed phase 4) (mysql-5.7.44-ndb-7.6.36)
   Node 3: starting (Last completed phase 4) (mysql-5.7.44-ndb-7.6.36)

   Node 2: Started (version 7.6.36)
   Node 3: Started (version 7.6.36)

   ndb_mgm>
   ```

   Note

   Commands issued in the management client are not case-sensitive; we use uppercase as the canonical form of these commands, but you are not required to observe this convention when inputting them into the [**ndb\_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") client. For more information, see [Section 21.6.1, “Commands in the NDB Cluster Management Client”](mysql-cluster-mgm-client-commands.html "21.6.1 Commands in the NDB Cluster Management Client").

   The output produced by [`ALL STATUS`](mysql-cluster-mgm-client-commands.html#ndbclient-status) is likely to vary from what is shown here, according to the speed at which the data nodes are able to start, the release version number of the NDB Cluster software you are using, and other factors. What is significant is that, when you see that both data nodes have started, you are ready to start the SQL node.

   You can leave [**ndb\_mgm.exe**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") running; it has no negative impact on the performance of the NDB Cluster, and we use it in the next step to verify that the SQL node is connected to the cluster after you have started it.

4. On the computer designated as the SQL node host, open a console window and navigate to the directory where you unpacked the NDB Cluster binaries (if you are following our example, this is `C:\mysql\bin`).

   Start the SQL node by invoking [**mysqld.exe**](mysqld.html "4.3.1 mysqld — The MySQL Server") from the command line, as shown here:

   ```sql
   C:\mysql\bin> mysqld --console
   ```

   The [`--console`](server-options.html#option_mysqld_console) option causes logging information to be written to the console, which can be helpful in the event of problems. (Once you are satisfied that the SQL node is running in a satisfactory manner, you can stop it and restart it out without the [`--console`](server-options.html#option_mysqld_console) option, so that logging is performed normally.)

   In the console window where the management client ([**ndb\_mgm.exe**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client")) is running on the management node host, enter the [`SHOW`](mysql-cluster-mgm-client-commands.html#ndbclient-show) command, which should produce output similar to what is shown here:

   ```sql
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

   You can also verify that the SQL node is connected to the NDB Cluster in the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client ([**mysql.exe**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client")) using the [`SHOW ENGINE NDB STATUS`](show-engine.html#show-engine-ndb-status "SHOW ENGINE NDB STATUS") statement.

You should now be ready to work with database objects and data using NDB Cluster 's [`NDBCLUSTER`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") storage engine. See [Section 21.3.5, “NDB Cluster Example with Tables and Data”](mysql-cluster-install-example-data.html "21.3.5 NDB Cluster Example with Tables and Data"), for more information and examples.

You can also install [**ndb\_mgmd.exe**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon"), [**ndbd.exe**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon"), and [**ndbmtd.exe**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") as Windows services. For information on how to do this, see [Section 21.3.2.4, “Installing NDB Cluster Processes as Windows Services”](mysql-cluster-install-windows-service.html "21.3.2.4 Installing NDB Cluster Processes as Windows Services")).
