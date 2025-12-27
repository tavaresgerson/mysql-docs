#### 19.4.10.1 Installing Semisynchronous Replication

Semisynchronous replication is implemented using plugins, which must be installed on the source and on the replicas to make semisynchronous replication available on the instances. There are different plugins for a source and for a replica. After a plugin has been installed, you control it by means of the system variables associated with it. These system variables are available only when the associated plugin has been installed.

This section describes how to install the semisynchronous replication plugins. For general information about installing plugins, see Section 7.6.1, “Installing and Uninstalling Plugins”.

To use semisynchronous replication, the following requirements must be satisfied:

* The capability of installing plugins requires a MySQL server that supports dynamic loading. To verify this, check that the value of the `have_dynamic_loading` system variable is `YES`. Binary distributions should support dynamic loading.

* Replication must already be working, see Section 19.1, “Configuring Replication”.

* There must not be multiple replication channels configured. Semisynchronous replication is only compatible with the default replication channel. See Section 19.2.2, “Replication Channels”.

MySQL 9.5 supplies versions of the plugins that implement semisynchronous replication—one for the source server and one for the replica—which replace the terms “master” and “slave” with “source” and “replica” in system variables and status variables; you must install these versions instead of the old ones (which have now been removed). Replication topologies that still use the old semisynchronous plugins must be upgraded to use the new plugins. For more information, see Upgrading Replication Topologies to Use New Semisynchronous Replication Plugins.

The file name suffix for the plugin library files differs per platform (for example, `.so` for Unix and Unix-like systems, and `.dll` for Windows). The plugin and library file names are as follows:

* Source server: `rpl_semi_sync_source` plugin (`semisync_source.so` or `semisync_source.dll` library)

* Replica: `rpl_semi_sync_replica` plugin (`semisync_replica.so` or `semisync_replica.dll` library)

To be usable by a source or replica server, the appropriate plugin library file must be located in the MySQL plugin directory (the directory named by the `plugin_dir` system variable). If necessary, configure the plugin directory location by setting the value of `plugin_dir` at server startup. The source plugin library file must be present in the plugin directory of the source server. The replica plugin library file must be present in the plugin directory of each replica server.

To set up semisynchronous replication, use the following instructions. The `INSTALL PLUGIN`, `SET GLOBAL`, `STOP REPLICA`, and `START REPLICA` statements mentioned here require the `REPLICATION_SLAVE_ADMIN` privilege (or the deprecated `SUPER` privilege).

To load the plugins, use the `INSTALL PLUGIN` statement on the source and on each replica that is to be semisynchronous, adjusting the `.so` suffix for your platform as necessary.

On the source:

```
INSTALL PLUGIN rpl_semi_sync_source SONAME 'semisync_source.so';
```

On each replica:

```
INSTALL PLUGIN rpl_semi_sync_replica SONAME 'semisync_replica.so';
```

If an attempt to install a plugin results in an error on Linux similar to that shown here, you must install `libimf`:

```
mysql> INSTALL PLUGIN rpl_semi_sync_source SONAME 'semisync_source.so';
ERROR 1126 (HY000): Can't open shared library
'/usr/local/mysql/lib/plugin/semisync_source.so'
(errno: 22 libimf.so: cannot open shared object file:
No such file or directory)
```

You can obtain `libimf` from <https://dev.mysql.com/downloads/os-linux.html>.

To verify plugin installation, examine the Information Schema `PLUGINS` table or use the `SHOW PLUGINS` statement (see Section 7.6.2, “Obtaining Server Plugin Information”). For example:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%semi%';
+----------------------+---------------+
| PLUGIN_NAME          | PLUGIN_STATUS |
+----------------------+---------------+
| rpl_semi_sync_source | ACTIVE        |
+----------------------+---------------+
```

If a plugin fails to initialize, check the server error log for diagnostic messages.

After a semisynchronous replication plugin has been installed, it is disabled by default. The plugins must be enabled both on the source side and the replica side to enable semisynchronous replication. If only one side is enabled, replication is asynchronous. To enable the plugins, set the appropriate system variable either at runtime using `SET GLOBAL`, or at server startup on the command line or in an option file. For example:

```
SET GLOBAL rpl_semi_sync_source_enabled = 1;
```

```
SET GLOBAL rpl_semi_sync_replica_enabled = 1;
```

If you enable semisynchronous replication on a replica at runtime, you must also start the replication I/O (receiver) thread (stopping it first if it is already running) to cause the replica to connect to the source and register as a semisynchronous replica:

```
STOP REPLICA IO_THREAD;
START REPLICA IO_THREAD;
```

If the replication I/O (receiver) thread is already running and you do not restart it, the replica continues to use asynchronous replication.

A setting listed in an option file takes effect each time the server starts. For example, you can set the variables in `my.cnf` files on the source and replica servers as follows. On the source:

```
[mysqld]
rpl_semi_sync_source_enabled=1
```

On each replica:

```
[mysqld]
rpl_semi_sync_replica_enabled=1
```

You can configure the behavior of the semisynchronous replication plugins using the system variables that become available when you install the plugins. For information on key system variables, see Section 19.4.10.2, “Configuring Semisynchronous Replication”.

##### Upgrading Replication Topologies to Use New Semisynchronous Replication Plugins

In replication topologies that still use the old semisynchronous plugins, the MySQL instances must first be reconfigured to use the new semisynchronous replication plugins. To reconfigure the MySQL instances:

1. Stop replication on each replica and source instances.
2. Uninstall the old `rpl_semi_sync_master` and `rpl_semi_sync_slave` plugins.

3. Install the new `rpl_semi_sync_source` and `rpl_semi_sync_source` plugins.

4. Enable semisynchronous replication again.

The replication topology upgrade must then be performed in the standard manner, starting with replicas and then proceeding to the source. For more information, see Section 19.5.3, “Upgrading or Downgrading a Replication Topology”.
