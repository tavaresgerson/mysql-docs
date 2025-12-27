#### 16.1.3.6 Restrictions on Replication with GTIDs

Because GTID-based replication is dependent on transactions, some features otherwise available in MySQL are not supported when using it. This section provides information about restrictions on and limitations of replication with GTIDs.

**Updates involving nontransactional storage engines.** When using GTIDs, updates to tables using nontransactional storage engines such as [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") cannot be made in the same statement or transaction as updates to tables using transactional storage engines such as [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine").

This restriction is due to the fact that updates to tables that use a nontransactional storage engine mixed with updates to tables that use a transactional storage engine within the same transaction can result in multiple GTIDs being assigned to the same transaction.

Such problems can also occur when the source and the replica use different storage engines for their respective versions of the same table, where one storage engine is transactional and the other is not. Also be aware that triggers that are defined to operate on nontransactional tables can be the cause of these problems.

In any of the cases just mentioned, the one-to-one correspondence between transactions and GTIDs is broken, with the result that GTID-based replication cannot function correctly.

**CREATE TABLE ... SELECT statements.** [`CREATE TABLE ... SELECT`](create-table-select.html "13.1.18.4 CREATE TABLE ... SELECT Statement") statements are not allowed when using GTID-based replication. When [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format) is set to STATEMENT, a `CREATE TABLE ... SELECT` statement is recorded in the binary log as one transaction with one GTID, but if ROW format is used, the statement is recorded as two transactions with two GTIDs. If a source used STATEMENT format and a replica used ROW format, the replica would be unable to handle the transaction correctly, therefore the `CREATE TABLE ... SELECT` statement is disallowed with GTIDs to prevent this scenario.

**Temporary tables.** [`CREATE TEMPORARY TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") and [`DROP TEMPORARY TABLE`](drop-table.html "13.1.29 DROP TABLE Statement") statements are not supported inside transactions, procedures, functions, and triggers when using GTIDs (that is, when the [`enforce_gtid_consistency`](replication-options-gtids.html#sysvar_enforce_gtid_consistency) system variable is set to `ON`). It is possible to use these statements with GTIDs enabled, but only outside of any transaction, and only with [`autocommit=1`](server-system-variables.html#sysvar_autocommit).

**Preventing execution of unsupported statements.** To prevent execution of statements that would cause GTID-based replication to fail, all servers must be started with the [`--enforce-gtid-consistency`](replication-options-gtids.html#sysvar_enforce_gtid_consistency) option when enabling GTIDs. This causes statements of any of the types discussed previously in this section to fail with an error.

Note that [`--enforce-gtid-consistency`](replication-options-gtids.html#sysvar_enforce_gtid_consistency) only takes effect if binary logging takes place for a statement. If binary logging is disabled on the server, or if statements are not written to the binary log because they are removed by a filter, GTID consistency is not checked or enforced for the statements that are not logged.

For information about other required startup options when enabling GTIDs, see [Section 16.1.3.4, “Setting Up Replication Using GTIDs”](replication-gtids-howto.html "16.1.3.4 Setting Up Replication Using GTIDs").

**Skipping transactions.** [`sql_slave_skip_counter`](replication-options-replica.html#sysvar_sql_slave_skip_counter) is not supported when using GTIDs. If you need to skip transactions, use the value of the source's [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) variable instead. For instructions, see [Section 16.1.7.3, “Skipping Transactions”](replication-administration-skip.html "16.1.7.3 Skipping Transactions").

**Ignoring servers.** The IGNORE\_SERVER\_IDS option of the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement is deprecated when using GTIDs, because transactions that have already been applied are automatically ignored. Before starting GTID-based replication, check for and clear all ignored server ID lists that have previously been set on the servers involved. The [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement") statement, which can be issued for individual channels, displays the list of ignored server IDs if there is one. If there is no list, the `Replicate_Ignore_Server_Ids` field is blank.

**GTID mode and mysqldump.** It is possible to import a dump made using [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") into a MySQL server running with GTID mode enabled, provided that there are no GTIDs in the target server's binary log.

**GTID mode and mysql\_upgrade.** When the server is running with global transaction identifiers (GTIDs) enabled ([`gtid_mode=ON`](replication-options-gtids.html#sysvar_gtid_mode)), do not enable binary logging by [**mysql\_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables") (the [`--write-binlog`](mysql-upgrade.html#option_mysql_upgrade_write-binlog) option).
