#### 19.1.4.3 Disabling GTID Transactions Online

This section describes how to disable GTID transactions on servers
that are already online. This procedure does not require taking
the server offline and is suited to use in production. However, if
you have the possibility to take the servers offline when
disabling GTIDs mode that process is easier.

The process is similar to enabling GTID transactions while the
server is online, but reversing the steps. The only thing that
differs is the point at which you wait for logged transactions to
replicate.

Before starting, all servers must meet the following conditions:

* All servers have [`gtid_mode`](replication-options-gtids.html#sysvar_gtid_mode)
  set to `ON`.

* The [`--replicate-same-server-id`](replication-options-replica.html#option_mysqld_replicate-same-server-id)
  option is not set on any server. You cannot disable GTID
  transactions if this option is set together with the
  [`--log-replica-updates`](replication-options-binary-log.html#sysvar_log_replica_updates) option
  (default) and binary logging is enabled (also the default).
  Without GTIDs, this combination of options causes infinite
  loops in circular replication.

1. Execute the following statements on each replica, and if you
   are using multi-source replication, do so for each channel,
   including the `FOR CHANNEL` clause when using
   multi-source replication:

   ```
   STOP REPLICA [FOR CHANNEL 'channel'];

   CHANGE REPLICATION SOURCE TO
     SOURCE_AUTO_POSITION = 0,
     SOURCE_LOG_FILE = 'file',
     SOURCE_LOG_POS = position
     [FOR CHANNEL 'channel'];

   START REPLICA [FOR CHANNEL 'channel'];
   ```

   You can obtain the values for *`file`*
   and *`position`* from the
   `relay_source_log_file` and
   `exec_source_log_position` columns in the
   output of [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.36 SHOW REPLICA STATUS Statement").
   The *`file`* and
   *`channel`* names are strings; both of
   these must be quoted when used in the
   [`STOP REPLICA`](stop-replica.html "15.4.2.5 STOP REPLICA Statement"),
   [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement"),
   and [`START REPLICA`](start-replica.html "15.4.2.4 START REPLICA Statement") statements.

2. On each server, execute the following statement:

   ```
   SET @@global.gtid_mode = ON_PERMISSIVE;
   ```

3. On each server, execute the following statement:

   ```
   SET @@global.gtid_mode = OFF_PERMISSIVE;
   ```

4. On each server, wait until the global value of
   [`gtid_owned`](replication-options-gtids.html#sysvar_gtid_owned) is equal to the
   empty string. This can be checked using the statement shown
   here:

   ```
   SELECT @@global.gtid_owned;
   ```

   On a replica, it is theoretically possible that this is empty
   and then becomes nonempty again. This is not a problem; it
   suffices that the value is empty at least once.

5. Wait for all transactions that currently exist in any binary
   log to be committed on all replicas. See
   [Section 19.1.4.4, “Verifying Replication of Anonymous Transactions”](replication-mode-change-online-verify-transactions.html "19.1.4.4 Verifying Replication of Anonymous Transactions"),
   for one method of checking that all anonymous transactions
   have replicated to all servers.

6. If you use binary logs for anything other than
   replication—for example, to perform point-in-time backup
   or restore—wait until you no longer need any old binary
   logs containing GTID transactions.

   For instance, after the previous step has completed, you can
   execute [`FLUSH LOGS`](flush.html#flush-logs) on the
   server where you are taking the backup. Then, either take a
   backup manually, or wait for the next iteration of any
   periodic backup routine you may have set up.

   Ideally, you should wait for the server to purge all binary
   logs that existed when step 5 was completed, and for any
   backup taken before then to expire.

   You should keep in mind that logs containing GTID transactions
   cannot be used after the next step. For this reason, before
   proceeding further, you must be sure that no uncommitted GTID
   transactions exist anywhere in the topology.

7. On each server, execute the following statement:

   ```
   SET @@global.gtid_mode = OFF;
   ```

8. On each server, set
   [`gtid_mode=OFF`](replication-options-gtids.html#sysvar_gtid_mode) in
   `my.cnf`.

   Optionally, you can also set
   [`enforce_gtid_consistency=OFF`](replication-options-gtids.html#sysvar_enforce_gtid_consistency).
   After doing so, you should add
   [`enforce_gtid_consistency=OFF`](replication-options-gtids.html#sysvar_enforce_gtid_consistency)
   to your configuration file.

If you want to downgrade to an earlier version of MySQL, you can
do so now, using the normal downgrade procedure.