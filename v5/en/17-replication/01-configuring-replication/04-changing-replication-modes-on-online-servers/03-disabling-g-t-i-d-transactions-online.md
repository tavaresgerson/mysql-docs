#### 16.1.4.3 Disabling GTID Transactions Online

This section describes how to disable GTID transactions on servers that are already online. This procedure does not require taking the server offline and is suited to use in production. However, if you have the possibility to take the servers offline when disabling GTIDs mode that process is easier.

The process is similar to enabling GTID transactions while the server is online, but reversing the steps. The only thing that differs is the point at which you wait for logged transactions to replicate.

Before you start, ensure that the servers meet the following pre-conditions:

* *All* servers in your topology must use MySQL 5.7.6 or later. You cannot disable GTID transactions online on any single server unless *all* servers which are in the topology are using this version.

* All servers have [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode) set to `ON`.

1. Execute the following on each replica, and if you using multi-source replication, do it for each channel and include the `FOR CHANNEL` channel clause:

   ```sql
   STOP SLAVE [FOR CHANNEL 'channel'];
   CHANGE MASTER TO MASTER_AUTO_POSITION = 0, MASTER_LOG_FILE = file, \
   MASTER_LOG_POS = position [FOR CHANNEL 'channel'];
   START SLAVE [FOR CHANNEL 'channel'];
   ```

2. On each server, execute:

   ```sql
   SET @@GLOBAL.GTID_MODE = ON_PERMISSIVE;
   ```

3. On each server, execute:

   ```sql
   SET @@GLOBAL.GTID_MODE = OFF_PERMISSIVE;
   ```

4. On each server, wait until the variable @@GLOBAL.GTID\_OWNED is equal to the empty string. This can be checked using:

   ```sql
   SELECT @@GLOBAL.GTID_OWNED;
   ```

   On a replica, it is theoretically possible that this is empty and then nonempty again. This is not a problem, it suffices that it is empty once.

5. Wait for all transactions that currently exist in any binary log to replicate to all replicas. See [Section 16.1.4.4, “Verifying Replication of Anonymous Transactions”](replication-mode-change-online-verify-transactions.html "16.1.4.4 Verifying Replication of Anonymous Transactions") for one method of checking that all anonymous transactions have replicated to all servers.

6. If you use binary logs for anything else than replication, for example to do point in time backup or restore: wait until you do not need the old binary logs having GTID transactions.

   For instance, after step 5 has completed, you can execute [`FLUSH LOGS`](flush.html#flush-logs) on the server where you are taking the backup. Then either explicitly take a backup or wait for the next iteration of any periodic backup routine you may have set up.

   Ideally, wait for the server to purge all binary logs that existed when step 5 was completed. Also wait for any backup taken before step 5 to expire.

   Important

   This is the one important point during this procedure. It is important to understand that logs containing GTID transactions cannot be used after the next step. Before proceeding you must be sure that GTID transactions do not exist anywhere in the topology.

7. On each server, execute:

   ```sql
   SET @@GLOBAL.GTID_MODE = OFF;
   ```

8. On each server, set [`gtid_mode=OFF`](replication-options-gtids.html#sysvar_gtid_mode) in `my.cnf`.

   If you want to set [`enforce_gtid_consistency=OFF`](replication-options-gtids.html#sysvar_enforce_gtid_consistency), you can do so now. After setting it, you should add [`enforce_gtid_consistency=OFF`](replication-options-gtids.html#sysvar_enforce_gtid_consistency) to your configuration file.

If you want to downgrade to an earlier version of MySQL, you can do so now, using the normal downgrade procedure.
