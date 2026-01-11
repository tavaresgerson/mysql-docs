#### 19.1.4.2 Enabling GTID Transactions Online

This section describes how to enable GTID transactions, and optionally auto-positioning, on servers that are already online and using anonymous transactions. This procedure does not require taking the server offline and is suited to use in production. However, if you have the possibility to take the servers offline when enabling GTID transactions that process is easier.

You can set up replication channels to assign GTIDs to replicated transactions that do not already have any. This feature enables replication from a source server that does not use GTID-based replication, to a replica that does. If it is possible to enable GTIDs on the replication source server, as described in this procedure, use this approach instead. Assigning GTIDs is designed for replication source servers where you cannot enable GTIDs. For more information on this option, see Section 19.1.3.6, “Replication From a Source Without GTIDs to a Replica With GTIDs”.

Before you start, ensure that `gtid_mode` is `OFF` on all servers.

The following procedure can be paused at any time and later resumed where it was, or reversed by jumping to the corresponding step of Section 19.1.4.3, “Disabling GTID Transactions Online”, the online procedure to disable GTIDs. This makes the procedure fault-tolerant because any unrelated issues that may appear in the middle of the procedure can be handled as usual, and then the procedure continued where it was left off.

To enable GTID transactions, you must complete each of the following steps before continuing to the next one.

1. On each server, execute the following statement:

   ```
   SET @@GLOBAL.enforce_gtid_consistency = WARN;
   ```

   Let the server run for a while with your normal workload and monitor the logs. If this step causes any warnings in the log, adjust your application so that it only uses GTID-compatible features and does not generate any warnings.

2. On each server, execute this statement:

   ```
   SET @@GLOBAL.enforce_gtid_consistency = ON;
   ```

3. On each server, execute the following statement:

   ```
   SET @@GLOBAL.gtid_mode = OFF_PERMISSIVE;
   ```

   The order in which the servers execute this statement makes no difference, but all servers must do so before beginning the next step.

4. On each server, execute the followng statement:

   ```
   SET @@GLOBAL.gtid_mode = ON_PERMISSIVE;
   ```

   As in the previous step, it makes no difference which server executes the statement first, as long as each server does so before proceeding further.

5. On each server, wait until `Ongoing_anonymous_transaction_count` is `0`. You can check its value using a `SHOW STATUS` statement, like this:

   ```
   mysql> SHOW STATUS LIKE 'Ongoing%';
   +-------------------------------------+-------+
   | Variable_name                       | Value |
   +-------------------------------------+-------+
   | Ongoing_anonymous_transaction_count | 0     |
   +-------------------------------------+-------+
   1 row in set (0.00 sec)
   ```

   On a replica, it is theoretically possible that this is `0` and then a nonzero value again. This is not a problem, as long as it is `0` at least once.

6. Wait for all transactions generated up to the previous step to replicate to all servers. You can do this without stopping updates; what matters is that all anonymous transactions are replicated before proceeding further.

   See Section 19.1.4.4, “Verifying Replication of Anonymous Transactions” for one method of checking that all anonymous transactions have replicated to all servers.

7. If you use binary logs for anything other than replication, such as point-in-time backup and restore, wait until you no longer need the old binary logs containing transactions without GTIDs.

   For instance, after all transactions have been replicated, you can execute `FLUSH LOGS` on the server where you are taking backups. Then either explicitly take a backup or wait for the next iteration of any periodic backup routine you may have set up.

   Ideally, you should wait for the server to purge all binary logs that existed when the previous step was completed, and for any backup taken before then to expire.

   Keep in mind that binary logs containing anonymous transactions (that is, transactions without GTIDs) cannot be used following the next step, after which, you must make sure that no transactions without GTIDs remain uncommitted on any server.

8. On each server, execute this statement:

   ```
   SET @@GLOBAL.GTID_MODE = ON;
   ```

9. On each server, add `gtid-mode=ON` and `enforce-gtid-consistency=ON` to `my.cnf`. This guarantees that GTIDs are used for all transactions which have not already been processed. To start using the GTID protocol so that you can later perform automatic failover, execute the the next set of statements on each replica. If you use multi-source replication, do this for each channel, including the `FOR CHANNEL channel` clause:

   ```
   STOP REPLICA [FOR CHANNEL 'channel'];

   CHANGE REPLICATION SOURCE TO SOURCE_AUTO_POSITION = 1 [FOR CHANNEL 'channel'];

   START REPLICA [FOR CHANNEL 'channel'];
   ```
