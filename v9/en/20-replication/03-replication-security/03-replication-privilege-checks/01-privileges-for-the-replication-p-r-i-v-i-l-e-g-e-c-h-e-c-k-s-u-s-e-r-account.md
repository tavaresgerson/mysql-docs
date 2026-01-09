#### 19.3.3.1 Privileges For The Replication PRIVILEGE_CHECKS_USER Account

The user account that is specified using the `CHANGE REPLICATION SOURCE TO` statement as the `PRIVILEGE_CHECKS_USER` account for a replication channel must have the `REPLICATION_APPLIER` privilege, otherwise the replication applier thread does not start. As explained in Section 19.3.3, “Replication Privilege Checks”, the account requires further privileges that are sufficient to apply all the expected transactions expected on the replication channel. These privileges are checked only when relevant transactions are executed.

The use of row-based binary logging (`binlog_format=ROW`) is strongly recommended for replication channels that are secured using a `PRIVILEGE_CHECKS_USER` account. With statement-based binary logging, some administrator-level privileges might be required for the `PRIVILEGE_CHECKS_USER` account to execute transactions successfully. The `REQUIRE_ROW_FORMAT` setting can be applied to secured channels, which restricts the channel from executing events that would require these privileges.

The `REPLICATION_APPLIER` privilege explicitly or implicitly allows the `PRIVILEGE_CHECKS_USER` account to carry out the following operations that a replication thread needs to perform:

* Setting the value of the system variables `gtid_next`, `original_commit_timestamp`, `original_server_version`, `immediate_server_version`, and `pseudo_replica_mode`, to apply appropriate metadata and behaviors when executing transactions.

* Executing internal-use `BINLOG` statements to apply **mysqlbinlog** output, provided that the account also has permission for the tables and operations in those statements.

* Updating the system tables `mysql.gtid_executed`, `mysql.slave_relay_log_info`, `mysql.slave_worker_info`, and `mysql.slave_master_info`, to update replication metadata. (If events access these tables explicitly for other purposes, you must grant the appropriate privileges on the tables.)

* Applying a binary log `Table_map_log_event`, which provides table metadata but does not make any database changes.

If the `REQUIRE_TABLE_PRIMARY_KEY_CHECK` option of the `CHANGE REPLICATION SOURCE TO` statement is set to the default value `STREAM`, the `PRIVILEGE_CHECKS_USER` account needs privileges sufficient to set restricted session variables, so that it can change the value of the `sql_require_primary_key` system variable for the duration of a session to match the setting replicated from the source. The `SESSION_VARIABLES_ADMIN` privilege gives the account this capability. This privilege also allows the account to apply **mysqlbinlog** output that was created using the `--disable-log-bin` option. If you set `REQUIRE_TABLE_PRIMARY_KEY_CHECK` to either `ON` or `OFF`, the replica always uses that value for the `sql_require_primary_key` system variable in replication operations, and so does not need these session administration level privileges.

If table encryption is in use, the `table_encryption_privilege_check` system variable is set to `ON`, and the encryption setting for the tablespace involved in any event differs from the applying server's default encryption setting (specified by the `default_table_encryption` system variable), the `PRIVILEGE_CHECKS_USER` account needs the `TABLE_ENCRYPTION_ADMIN` privilege in order to override the default encryption setting. It is strongly recommended that you do not grant this privilege. Instead, ensure that the default encryption setting on a replica matches the encryption status of the tablespaces that it replicates, and that replication group members have the same default encryption setting, so that the privilege is not needed.

In order to execute specific replicated transactions from the relay log, or transactions from **mysqlbinlog** output as required, the `PRIVILEGE_CHECKS_USER` account must have the following privileges:

* For a row insertion logged in row format (which are logged as a `Write_rows_log_event`), the `INSERT` privilege on the relevant table.

* For a row update logged in row format (which are logged as an `Update_rows_log_event`), the `UPDATE` privilege on the relevant table.

* For a row deletion logged in row format (which are logged as a `Delete_rows_log_event`), the `DELETE` privilege on the relevant table.

If statement-based binary logging is in use (which is not recommended with a `PRIVILEGE_CHECKS_USER` account), for a transaction control statement such as `BEGIN` or `COMMIT` or DML logged in statement format (which are logged as a `Query_log_event`), the `PRIVILEGE_CHECKS_USER` account needs privileges to execute the statement contained in the event.

If `LOAD DATA` operations need to be carried out on the replication channel, use row-based binary logging (`binlog_format=ROW`). With this logging format, the `FILE` privilege is not needed to execute the event, so do not give the `PRIVILEGE_CHECKS_USER` account this privilege. The use of row-based binary logging is strongly recommended with replication channels that are secured using a `PRIVILEGE_CHECKS_USER` account. If `REQUIRE_ROW_FORMAT` is set for the channel, row-based binary logging is required. The `Format_description_log_event`, which deletes any temporary files created by `LOAD DATA` events, is processed without privilege checks. For more information, see Section 19.5.1.20, “Replication and LOAD DATA”.

If the `init_replica` system variable is set to specify one or more SQL statements to be executed when the replication SQL thread starts, the `PRIVILEGE_CHECKS_USER` account must have the privileges needed to execute these statements.

It is recommended that you never give any ACL privileges to the `PRIVILEGE_CHECKS_USER` account, including `CREATE USER`, `CREATE ROLE`, `DROP ROLE`, and `GRANT OPTION`, and do not permit the account to update the `mysql.user` table. With these privileges, the account could be used to create or modify user accounts on the server. To avoid ACL statements issued on the source server being replicated to the secured channel for execution (where they fail in the absence of these privileges), you can issue `SET sql_log_bin = 0` before all ACL statements and `SET sql_log_bin = 1` after them, to omit the statements from the source's binary log. Alternatively, you can set a dedicated current database before executing all ACL statements, and use a replication filter (`--binlog-ignore-db`) to filter out this database on the replica.
