#### 16.1.3.4 Setting Up Replication Using GTIDs

This section describes a process for configuring and starting GTID-based replication in MySQL 5.7. This is a “cold start” procedure that assumes either that you are starting the replication source server for the first time, or that it is possible to stop it; for information about provisioning replicas using GTIDs from a running source, see [Section 16.1.3.5, “Using GTIDs for Failover and Scaleout”](replication-gtids-failover.html "16.1.3.5 Using GTIDs for Failover and Scaleout"). For information about changing GTID mode on servers online, see [Section 16.1.4, “Changing Replication Modes on Online Servers”](replication-mode-change-online.html "16.1.4 Changing Replication Modes on Online Servers").

The key steps in this startup process for the simplest possible GTID replication topology, consisting of one source and one replica, are as follows:

1. If replication is already running, synchronize both servers by making them read-only.

2. Stop both servers.
3. Restart both servers with GTIDs enabled and the correct options configured.

   The [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") options necessary to start the servers as described are discussed in the example that follows later in this section.

4. Instruct the replica to use the source as the replication data source and to use auto-positioning. The SQL statements needed to accomplish this step are described in the example that follows later in this section.

5. Take a new backup. Binary logs containing transactions without GTIDs cannot be used on servers where GTIDs are enabled, so backups taken before this point cannot be used with your new configuration.

6. Start the replica, then disable read-only mode on both servers, so that they can accept updates.

In the following example, two servers are already running as source and replica, using MySQL's binary log position-based replication protocol. If you are starting with new servers, see [Section 16.1.2.2, “Creating a User for Replication”](replication-howto-repuser.html "16.1.2.2 Creating a User for Replication") for information about adding a specific user for replication connections and [Section 16.1.2.1, “Setting the Replication Source Configuration”](replication-howto-masterbaseconfig.html "16.1.2.1 Setting the Replication Source Configuration") for information about setting the [`server_id`](replication-options.html#sysvar_server_id) variable. The following examples show how to store [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") startup options in server's option file, see [Section 4.2.2.2, “Using Option Files”](option-files.html "4.2.2.2 Using Option Files") for more information. Alternatively you can use startup options when running [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

Most of the steps that follow require the use of the MySQL `root` account or another MySQL user account that has the [`SUPER`](privileges-provided.html#priv_super) privilege. [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") `shutdown` requires either the `SUPER` privilege or the [`SHUTDOWN`](privileges-provided.html#priv_shutdown) privilege.

**Step 1: Synchronize the servers.** This step is only required when working with servers which are already replicating without using GTIDs. For new servers proceed to Step 3. Make the servers read-only by setting the [`read_only`](server-system-variables.html#sysvar_read_only) system variable to `ON` on each server by issuing the following:

```sql
mysql> SET @@GLOBAL.read_only = ON;
```

Wait for all ongoing transactions to commit or roll back. Then, allow the replica to catch up with the source. *It is extremely important that you make sure the replica has processed all updates before continuing*.

If you use binary logs for anything other than replication, for example to do point in time backup and restore, wait until you do not need the old binary logs containing transactions without GTIDs. Ideally, wait for the server to purge all binary logs, and wait for any existing backup to expire.

Important

It is important to understand that logs containing transactions without GTIDs cannot be used on servers where GTIDs are enabled. Before proceeding, you must be sure that transactions without GTIDs do not exist anywhere in the topology.

**Step 2: Stop both servers.** Stop each server using [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") as shown here, where *`username`* is the user name for a MySQL user having sufficient privileges to shut down the server:

```sql
$> mysqladmin -uusername -p shutdown
```

Then supply this user's password at the prompt.

**Step 3: Start both servers with GTIDs enabled.** To enable GTID-based replication, each server must be started with GTID mode enabled by setting the [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) variable to `ON`, and with the [`enforce_gtid_consistency`](replication-options-gtids.html#sysvar_enforce_gtid_consistency) variable enabled to ensure that only statements which are safe for GTID-based replication are logged. For example:

```sql
gtid_mode=ON
enforce-gtid-consistency=ON
```

In addition, you should start replicas with the [`--skip-slave-start`](replication-options-replica.html#option_mysqld_skip-slave-start) option before configuring the replica settings. For more information on GTID related options and variables, see [Section 16.1.6.5, “Global Transaction ID System Variables”](replication-options-gtids.html "16.1.6.5 Global Transaction ID System Variables").

It is not mandatory to have binary logging enabled in order to use GTIDs when using the [mysql.gtid\_executed Table](replication-gtids-concepts.html#replication-gtids-gtid-executed-table "mysql.gtid_executed Table"). Replication source server must always have binary logging enabled in order to be able to replicate. However, replica servers can use GTIDs but without binary logging. If you need to disable binary logging on a replica, you can do this by specifying the [`--skip-log-bin`](replication-options-binary-log.html#option_mysqld_log-bin) and [`--log-slave-updates=OFF`](replication-options-binary-log.html#sysvar_log_slave_updates) options for the replica.

**Step 4: Configure the replica to use GTID-based auto-positioning.** Tell the replica to use the source with GTID based transactions as the replication data source, and to use GTID-based auto-positioning rather than file-based positioning. Issue a [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement on the replica, including the `MASTER_AUTO_POSITION` option in the statement to tell the replica that the source's transactions are identified by GTIDs.

You may also need to supply appropriate values for the source's host name and port number as well as the user name and password for a replication user account which can be used by the replica to connect to the source; if these have already been set prior to Step 1 and no further changes need to be made, the corresponding options can safely be omitted from the statement shown here.

```sql
mysql> CHANGE MASTER TO
     >     MASTER_HOST = host,
     >     MASTER_PORT = port,
     >     MASTER_USER = user,
     >     MASTER_PASSWORD = password,
     >     MASTER_AUTO_POSITION = 1;
```

Neither the `MASTER_LOG_FILE` option nor the `MASTER_LOG_POS` option may be used with `MASTER_AUTO_POSITION` set equal to 1. Attempting to do so causes the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement to fail with an error.

**Step 5: Take a new backup.** Existing backups that were made before you enabled GTIDs can no longer be used on these servers now that you have enabled GTIDs. Take a new backup at this point, so that you are not left without a usable backup.

For instance, you can execute [`FLUSH LOGS`](flush.html#flush-logs) on the server where you are taking backups. Then either explicitly take a backup or wait for the next iteration of any periodic backup routine you may have set up.

**Step 6: Start the replica and disable read-only mode.** Start the replica like this:

```sql
mysql> START SLAVE;
```

The following step is only necessary if you configured a server to be read-only in Step 1. To allow the server to begin accepting updates again, issue the following statement:

```sql
mysql> SET @@GLOBAL.read_only = OFF;
```

GTID-based replication should now be running, and you can begin (or resume) activity on the source as before. [Section 16.1.3.5, “Using GTIDs for Failover and Scaleout”](replication-gtids-failover.html "16.1.3.5 Using GTIDs for Failover and Scaleout"), discusses creation of new replicas when using GTIDs.
