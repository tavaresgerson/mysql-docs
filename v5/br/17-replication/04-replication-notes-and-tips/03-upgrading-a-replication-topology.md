### 16.4.3 Upgrading a Replication Topology

When you upgrade servers that participate in a replication topology, you need to take into account each server's role in the topology and look out for issues specific to replication. For general information and instructions for upgrading a MySQL Server instance, see [Section 2.10, “Upgrading MySQL”](upgrading.html "2.10 Upgrading MySQL").

As explained in [Section 16.4.2, “Replication Compatibility Between MySQL Versions”](replication-compatibility.html "16.4.2 Replication Compatibility Between MySQL Versions"), MySQL supports replication from a source running one release series to a replica running the next higher release series, but does not support replication from a source running a later release to a replica running an earlier release. A replica at an earlier release might not have the required capability to process transactions that can be handled by the source at a later release. You must therefore upgrade all of the replicas in a replication topology to the target MySQL Server release, before you upgrade the source server to the target release. In this way you will never be in the situation where a replica still at the earlier release is attempting to handle transactions from a source at the later release.

In a replication topology where there are multiple sources (multi-source replication), the use of more than two MySQL Server versions is not supported, regardless of the number of source or replica MySQL servers. This restriction applies not only to release series, but to version numbers within the same release series as well. For example, you cannot use MySQL 5.7.22, MySQL 5.7.24, and MySQL 5.7.28 concurrently in such a setup, although you could use any two of these releases together.

If you need to downgrade the servers in a replication topology, the source must be downgraded before the replicas are downgraded. On the replicas, you must ensure that the binary log and relay log have been fully processed, and remove them before proceeding with the downgrade.

#### Behavior Changes Between Releases

Although this upgrade sequence is correct, it is possible to still encounter replication difficulties when replicating from a source at an earlier release that has not yet been upgraded, to a replica at a later release that has been upgraded. This can happen if the source uses statements or relies on behavior that is no longer supported in the later release installed on the replica. You can use MySQL Shell's upgrade checker utility `util.checkForServerUpgrade()` to check MySQL 5.7 server instances or MySQL 8.0 server instances for upgrade to a GA MySQL 8.0 release. The utility identifies anything that needs to be fixed for that server instance so that it does not cause an issue after the upgrade, including features and behaviors that are no longer available in the later release. See [Upgrade Checker Utility](/doc/mysql-shell/8.0/en/mysql-shell-utilities-upgrade.html) for information on the upgrade checker utility.

If you are upgrading an existing replication setup from a version of MySQL that does not support global transaction identifiers (GTIDs) to a version that does, only enable GTIDs on the source and the replicas when you have made sure that the setup meets all the requirements for GTID-based replication. See [Section 16.1.3.4, “Setting Up Replication Using GTIDs”](replication-gtids-howto.html "16.1.3.4 Setting Up Replication Using GTIDs") for information about converting binary log file position based replication setups to use GTID-based replication.

Changes affecting operations in strict SQL mode ([`STRICT_TRANS_TABLES`](sql-mode.html#sqlmode_strict_trans_tables) or [`STRICT_ALL_TABLES`](sql-mode.html#sqlmode_strict_all_tables)) may result in replication failure on an upgraded replica. If you use statement-based logging ([`binlog_format=STATEMENT`](replication-options-binary-log.html#sysvar_binlog_format)), if a replica is upgraded before the source, the source executes statements which succeed there but which may fail on the replica and so cause replication to stop. To deal with this, stop all new statements on the source and wait until the replicas catch up, then upgrade the replicas. Alternatively, if you cannot stop new statements, temporarily change to row-based logging on the source ([`binlog_format=ROW`](replication-options-binary-log.html#sysvar_binlog_format)) and wait until all replicas have processed all binary logs produced up to the point of this change, then upgrade the replicas.

The default character set has changed from `latin1` to `utf8mb4` in MySQL 8.0. In a replicated setting, when upgrading from MySQL 5.7 to 8.0, it is advisable to change the default character set back to the character set used in MySQL 5.7 before upgrading. After the upgrade is completed, the default character set can be changed to `utf8mb4`. Assuming that the previous defaults were used, one way to preserve them is to start the server with these lines in the `my.cnf` file:

```sql
[mysqld]
character_set_server=latin1
collation_server=latin1_swedish_ci
```

#### Standard Upgrade Procedure

To upgrade a replication topology, follow the instructions in [Section 2.10, “Upgrading MySQL”](upgrading.html "2.10 Upgrading MySQL") for each individual MySQL Server instance, using this overall procedure:

1. Upgrade the replicas first. On each replica instance:

   * Carry out the preliminary checks and steps described in [Preparing Your Installation for Upgrade](/doc/refman/8.0/en/upgrade-prerequisites.html).

   * Shut down MySQL Server.
   * Upgrade the MySQL Server binaries or packages.
   * Restart MySQL Server.
   * If you have upgraded to a release earlier than MySQL 8.0.16, invoke [**mysql_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables") manually to upgrade the system tables and schemas. When the server is running with global transaction identifiers (GTIDs) enabled ([`gtid_mode=ON`](replication-options-gtids.html#sysvar_gtid_mode)), do not enable binary logging by [**mysql_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables") (so do not use the [`--write-binlog`](mysql-upgrade.html#option_mysql_upgrade_write-binlog) option). Then shut down and restart the server.

   * If you have upgraded to MySQL 8.0.16 or later, do not invoke [**mysql_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables"). From that release, MySQL Server performs the entire MySQL upgrade procedure, disabling binary logging during the upgrade.

   * Restart replication using a [`START REPLICA`](/doc/refman/8.0/en/start-replica.html) or [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") statement.

2. When all the replicas have been upgraded, follow the same steps to upgrade and restart the source server, with the exception of the [`START REPLICA`](/doc/refman/8.0/en/start-replica.html) or [`START SLAVE`](start-slave.html "13.4.2.5 START SLAVE Statement") statement. If you made a temporary change to row-based logging or to the default character set, you can revert the change now.

#### Upgrade Procedure With Table Repair Or Rebuild

Some upgrades may require that you drop and re-create database objects when you move from one MySQL series to the next. For example, collation changes might require that table indexes be rebuilt. Such operations, if necessary, are detailed at [Section 2.10.3, “Changes in MySQL 5.7”](upgrading-from-previous-series.html "2.10.3 Changes in MySQL 5.7"). It is safest to perform these operations separately on the replicas and the source, and to disable replication of these operations from the source to the replica. To achieve this, use the following procedure:

1. Stop all the replicas and upgrade the binaries or packages. Restart them with the [`--skip-slave-start`](replication-options-replica.html#option_mysqld_skip-slave-start) option, or from MySQL 8.0.24, the [`skip_slave_start`](/doc/refman/8.0/en/replication-options-replica.html#sysvar_skip_slave_start) system variable, so that they do not connect to the source. Perform any table repair or rebuilding operations needed to re-create database objects, such as use of `REPAIR TABLE` or `ALTER TABLE`, or dumping and reloading tables or triggers.

2. Disable the binary log on the source. To do this without restarting the source, execute a `SET sql_log_bin = OFF` statement. Alternatively, stop the source and restart it with the [`--skip-log-bin`](replication-options-binary-log.html#option_mysqld_log-bin) option. If you restart the source, you might also want to disallow client connections. For example, if all clients connect using TCP/IP, enable the [`skip_networking`](server-system-variables.html#sysvar_skip_networking) system variable when you restart the source.

3. With the binary log disabled, perform any table repair or rebuilding operations needed to re-create database objects. The binary log must be disabled during this step to prevent these operations from being logged and sent to the replicas later.

4. Re-enable the binary log on the source. If you set [`sql_log_bin`](replication-options-binary-log.html#sysvar_sql_log_bin) to `OFF` earlier, execute a `SET sql_log_bin = ON` statement. If you restarted the source to disable the binary log, restart it without [`--skip-log-bin`](replication-options-binary-log.html#option_mysqld_log-bin), and without enabling the [`skip_networking`](server-system-variables.html#sysvar_skip_networking) system variable so that clients and replicas can connect.

5. Restart the replicas, this time without the [`--skip-slave-start`](replication-options-replica.html#option_mysqld_skip-slave-start) option or [`skip_slave_start`](/doc/refman/8.0/en/replication-options-replica.html#sysvar_skip_slave_start) system variable.
