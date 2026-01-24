#### 16.1.2.1 Setting the Replication Source Configuration

To configure a source to use binary log file position based replication, you must ensure that binary logging is enabled, and establish a unique server ID.

Each server within a replication topology must be configured with a unique server ID, which you can specify using the [`server_id`](replication-options.html#sysvar_server_id) system variable. This server ID is used to identify individual servers within the replication topology, and must be a positive integer between 1 and (232)−1. You can change the [`server_id`](replication-options.html#sysvar_server_id) value dynamically by issuing a statement like this:

```sql
SET GLOBAL server_id = 2;
```

With the default server ID of 0, a source refuses any connections from replicas, and a replica refuses to connect to a source, so this value cannot be used in a replication topology. Other than that, how you organize and select the server IDs is your choice, so long as each server ID is different from every other server ID in use by any other server in the replication topology. Note that if a value of 0 was set previously for the server ID, you must restart the server to initialize the source with your new nonzero server ID. Otherwise, a server restart is not needed, unless you need to enable binary logging or make other configuration changes that require a restart.

Binary logging *must* be enabled on the source because the binary log is the basis for replicating changes from the source to its replicas. If binary logging is not enabled on the source using the `log-bin` option, replication is not possible. To enable binary logging on a server where it is not already enabled, you must restart the server. In this case, shut down the MySQL server and edit the `my.cnf` or `my.ini` file. Within the `[mysqld]` section of the configuration file, add the `log-bin` and `server-id` options. If these options already exist, but are commented out, uncomment the options and alter them according to your needs. For example, to enable binary logging using a log file name prefix of `mysql-bin`, and configure a server ID of 1, use these lines:

```sql
[mysqld]
log-bin=mysql-bin
server-id=1
```

After making the changes, restart the server.

Note

The following options have an impact on this procedure:

* For the greatest possible durability and consistency in a replication setup using [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") with transactions, you should use `innodb_flush_log_at_trx_commit=1` and `sync_binlog=1` in the source's `my.cnf` file.

* Ensure that the [`skip_networking`](server-system-variables.html#sysvar_skip_networking) system variable is not enabled on your source. If networking has been disabled, the replica cannot communicate with the source and replication fails.
