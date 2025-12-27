### 6.2.2 Privileges Provided by MySQL

The privileges granted to a MySQL account determine which operations the account can perform. MySQL privileges differ in the contexts in which they apply and at different levels of operation:

* Administrative privileges enable users to manage operation of the MySQL server. These privileges are global because they are not specific to a particular database.

* Database privileges apply to a database and to all objects within it. These privileges can be granted for specific databases, or globally so that they apply to all databases.

* Privileges for database objects such as tables, indexes, views, and stored routines can be granted for specific objects within a database, for all objects of a given type within a database (for example, all tables in a database), or globally for all objects of a given type in all databases.

Information about account privileges is stored in the grant tables in the `mysql` system database. For a description of the structure and contents of these tables, see [Section 6.2.3, “Grant Tables”](grant-tables.html "6.2.3 Grant Tables"). The MySQL server reads the contents of the grant tables into memory when it starts, and reloads them under the circumstances indicated in [Section 6.2.9, “When Privilege Changes Take Effect”](privilege-changes.html "6.2.9 When Privilege Changes Take Effect"). The server bases access-control decisions on the in-memory copies of the grant tables.

Important

Some MySQL releases introduce changes to the grant tables to add new privileges or features. To make sure that you can take advantage of any new capabilities, update your grant tables to the current structure whenever you upgrade MySQL. See [Section 2.10, “Upgrading MySQL”](upgrading.html "2.10 Upgrading MySQL").

The following sections summarize the available privileges, provide more detailed descriptions of each privilege, and offer usage guidelines.

* [Summary of Available Privileges](privileges-provided.html#privileges-provided-summary "Summary of Available Privileges")
* [Privilege Descriptions](privileges-provided.html#privileges-provided-static "Privilege Descriptions")
* [Privilege-Granting Guidelines](privileges-provided.html#privileges-provided-guidelines "Privilege-Granting Guidelines")

#### Summary of Available Privileges

The following table shows the privilege names used in [`GRANT`](grant.html "13.7.1.4 GRANT Statement") and [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement") statements, along with the column name associated with each privilege in the grant tables and the context in which the privilege applies.

**Table 6.2 Permissible Privileges for GRANT and REVOKE**

<table><col style="width: 30%"/><col style="width: 33%"/><col style="width: 37%"/><thead><tr> <th scope="col">Privilege</th> <th scope="col">Grant Table Column</th> <th scope="col">Context</th> </tr></thead><tbody><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_all"><code class="literal">ALL [PRIVILEGES]</code></a></th> <td>Synonym for <span class="quote">“<span class="quote">all privileges</span>”</span></td> <td>Server administration</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_alter"><code class="literal">ALTER</code></a></th> <td><code class="literal">Alter_priv</code></td> <td>Tables</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_alter-routine"><code class="literal">ALTER ROUTINE</code></a></th> <td><code class="literal">Alter_routine_priv</code></td> <td>Stored routines</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_create"><code class="literal">CREATE</code></a></th> <td><code class="literal">Create_priv</code></td> <td>Databases, tables, or indexes</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_create-routine"><code class="literal">CREATE ROUTINE</code></a></th> <td><code class="literal">Create_routine_priv</code></td> <td>Stored routines</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_create-tablespace"><code class="literal">CREATE TABLESPACE</code></a></th> <td><code class="literal">Create_tablespace_priv</code></td> <td>Server administration</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_create-temporary-tables"><code class="literal">CREATE TEMPORARY TABLES</code></a></th> <td><code class="literal">Create_tmp_table_priv</code></td> <td>Tables</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_create-user"><code class="literal">CREATE USER</code></a></th> <td><code class="literal">Create_user_priv</code></td> <td>Server administration</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_create-view"><code class="literal">CREATE VIEW</code></a></th> <td><code class="literal">Create_view_priv</code></td> <td>Views</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_delete"><code class="literal">DELETE</code></a></th> <td><code class="literal">Delete_priv</code></td> <td>Tables</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_drop"><code class="literal">DROP</code></a></th> <td><code class="literal">Drop_priv</code></td> <td>Databases, tables, or views</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_event"><code class="literal">EVENT</code></a></th> <td><code class="literal">Event_priv</code></td> <td>Databases</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_execute"><code class="literal">EXECUTE</code></a></th> <td><code class="literal">Execute_priv</code></td> <td>Stored routines</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_file"><code class="literal">FILE</code></a></th> <td><code class="literal">File_priv</code></td> <td>File access on server host</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_grant-option"><code class="literal">GRANT OPTION</code></a></th> <td><code class="literal">Grant_priv</code></td> <td>Databases, tables, or stored routines</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_index"><code class="literal">INDEX</code></a></th> <td><code class="literal">Index_priv</code></td> <td>Tables</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_insert"><code class="literal">INSERT</code></a></th> <td><code class="literal">Insert_priv</code></td> <td>Tables or columns</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_lock-tables"><code class="literal">LOCK TABLES</code></a></th> <td><code class="literal">Lock_tables_priv</code></td> <td>Databases</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_process"><code class="literal">PROCESS</code></a></th> <td><code class="literal">Process_priv</code></td> <td>Server administration</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_proxy"><code class="literal">PROXY</code></a></th> <td>See <code class="literal">proxies_priv</code> table</td> <td>Server administration</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_references"><code class="literal">REFERENCES</code></a></th> <td><code class="literal">References_priv</code></td> <td>Databases or tables</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_reload"><code class="literal">RELOAD</code></a></th> <td><code class="literal">Reload_priv</code></td> <td>Server administration</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_replication-client"><code class="literal">REPLICATION CLIENT</code></a></th> <td><code class="literal">Repl_client_priv</code></td> <td>Server administration</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_replication-slave"><code class="literal">REPLICATION SLAVE</code></a></th> <td><code class="literal">Repl_slave_priv</code></td> <td>Server administration</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_select"><code class="literal">SELECT</code></a></th> <td><code class="literal">Select_priv</code></td> <td>Tables or columns</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_show-databases"><code class="literal">SHOW DATABASES</code></a></th> <td><code class="literal">Show_db_priv</code></td> <td>Server administration</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_show-view"><code class="literal">SHOW VIEW</code></a></th> <td><code class="literal">Show_view_priv</code></td> <td>Views</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_shutdown"><code class="literal">SHUTDOWN</code></a></th> <td><code class="literal">Shutdown_priv</code></td> <td>Server administration</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_super"><code class="literal">SUPER</code></a></th> <td><code class="literal">Super_priv</code></td> <td>Server administration</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_trigger"><code class="literal">TRIGGER</code></a></th> <td><code class="literal">Trigger_priv</code></td> <td>Tables</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_update"><code class="literal">UPDATE</code></a></th> <td><code class="literal">Update_priv</code></td> <td>Tables or columns</td> </tr><tr> <th scope="row"><a class="link" href="privileges-provided.html#priv_usage"><code class="literal">USAGE</code></a></th> <td>Synonym for <span class="quote">“<span class="quote">no privileges</span>”</span></td> <td>Server administration</td> </tr></tbody></table>

#### Privilege Descriptions

The following list provides general descriptions of each privilege available in MySQL. Particular SQL statements might have more specific privilege requirements than indicated here. If so, the description for the statement in question provides the details.

* [`ALL`](privileges-provided.html#priv_all), [`ALL PRIVILEGES`](privileges-provided.html#priv_all)

  These privilege specifiers are shorthand for “all privileges available at a given privilege level” (except [`GRANT OPTION`](privileges-provided.html#priv_grant-option)). For example, granting [`ALL`](privileges-provided.html#priv_all) at the global or table level grants all global privileges or all table-level privileges, respectively.

* [`ALTER`](privileges-provided.html#priv_alter)

  Enables use of the [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement to change the structure of tables. [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") also requires the [`CREATE`](privileges-provided.html#priv_create) and [`INSERT`](privileges-provided.html#priv_insert) privileges. Renaming a table requires [`ALTER`](privileges-provided.html#priv_alter) and [`DROP`](privileges-provided.html#priv_drop) on the old table, [`CREATE`](privileges-provided.html#priv_create), and [`INSERT`](privileges-provided.html#priv_insert) on the new table.

* [`ALTER ROUTINE`](privileges-provided.html#priv_alter-routine)

  Enables use of statements that alter or drop stored routines (stored procedures and functions).

* [`CREATE`](privileges-provided.html#priv_create)

  Enables use of statements that create new databases and tables.

* [`CREATE ROUTINE`](privileges-provided.html#priv_create-routine)

  Enables use of statements that create stored routines (stored procedures and functions).

* [`CREATE TABLESPACE`](privileges-provided.html#priv_create-tablespace)

  Enables use of statements that create, alter, or drop tablespaces and log file groups.

* [`CREATE TEMPORARY TABLES`](privileges-provided.html#priv_create-temporary-tables)

  Enables the creation of temporary tables using the [`CREATE TEMPORARY TABLE`](create-temporary-table.html "13.1.18.2 CREATE TEMPORARY TABLE Statement") statement.

  After a session has created a temporary table, the server performs no further privilege checks on the table. The creating session can perform any operation on the table, such as [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement"), [`INSERT`](insert.html "13.2.5 INSERT Statement"), [`UPDATE`](update.html "13.2.11 UPDATE Statement"), or [`SELECT`](select.html "13.2.9 SELECT Statement"). For more information, see [Section 13.1.18.2, “CREATE TEMPORARY TABLE Statement”](create-temporary-table.html "13.1.18.2 CREATE TEMPORARY TABLE Statement").

* [`CREATE USER`](privileges-provided.html#priv_create-user)

  Enables use of the [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement"), [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"), [`DROP USER`](drop-user.html "13.7.1.3 DROP USER Statement"), [`RENAME USER`](rename-user.html "13.7.1.5 RENAME USER Statement"), and [`REVOKE ALL PRIVILEGES`](revoke.html "13.7.1.6 REVOKE Statement") statements.

* [`CREATE VIEW`](privileges-provided.html#priv_create-view)

  Enables use of the [`CREATE VIEW`](create-view.html "13.1.21 CREATE VIEW Statement") statement.

* [`DELETE`](privileges-provided.html#priv_delete)

  Enables rows to be deleted from tables in a database.

* [`DROP`](privileges-provided.html#priv_drop)

  Enables use of statements that drop (remove) existing databases, tables, and views. The [`DROP`](privileges-provided.html#priv_drop) privilege is required to use the `ALTER TABLE ... DROP PARTITION` statement on a partitioned table. The [`DROP`](privileges-provided.html#priv_drop) privilege is also required for [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement").

* [`EVENT`](privileges-provided.html#priv_event)

  Enables use of statements that create, alter, drop, or display events for the Event Scheduler.

* [`EXECUTE`](privileges-provided.html#priv_execute)

  Enables use of statements that execute stored routines (stored procedures and functions).

* [`FILE`](privileges-provided.html#priv_file)

  Affects the following operations and server behaviors:

  + Enables reading and writing files on the server host using the [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") and [`SELECT ... INTO OUTFILE`](select-into.html "13.2.9.1 SELECT ... INTO Statement") statements and the [`LOAD_FILE()`](string-functions.html#function_load-file) function. A user who has the [`FILE`](privileges-provided.html#priv_file) privilege can read any file on the server host that is either world-readable or readable by the MySQL server. (This implies the user can read any file in any database directory, because the server can access any of those files.)

  + Enables creating new files in any directory where the MySQL server has write access. This includes the server's data directory containing the files that implement the privilege tables.

  + As of MySQL 5.7.17, enables use of the `DATA DIRECTORY` or `INDEX DIRECTORY` table option for the [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement.

  As a security measure, the server does not overwrite existing files.

  To limit the location in which files can be read and written, set the [`secure_file_priv`](server-system-variables.html#sysvar_secure_file_priv) system variable to a specific directory. See [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

* [`GRANT OPTION`](privileges-provided.html#priv_grant-option)

  Enables you to grant to or revoke from other users those privileges that you yourself possess.

* [`INDEX`](privileges-provided.html#priv_index)

  Enables use of statements that create or drop (remove) indexes. [`INDEX`](privileges-provided.html#priv_index) applies to existing tables. If you have the [`CREATE`](privileges-provided.html#priv_create) privilege for a table, you can include index definitions in the [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement.

* [`INSERT`](privileges-provided.html#priv_insert)

  Enables rows to be inserted into tables in a database. [`INSERT`](privileges-provided.html#priv_insert) is also required for the [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement"), [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement"), and [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") table-maintenance statements.

* [`LOCK TABLES`](privileges-provided.html#priv_lock-tables)

  Enables use of explicit [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements") statements to lock tables for which you have the [`SELECT`](privileges-provided.html#priv_select) privilege. This includes use of write locks, which prevents other sessions from reading the locked table.

* [`PROCESS`](privileges-provided.html#priv_process)

  The [`PROCESS`](privileges-provided.html#priv_process) privilege controls access to information about threads executing within the server (that is, information about statements being executed by sessions). Thread information available using the [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") statement, the [**mysqladmin processlist**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") command, the [`INFORMATION_SCHEMA.PROCESSLIST`](information-schema-processlist-table.html "24.3.18 The INFORMATION_SCHEMA PROCESSLIST Table") table, and the Performance Schema [`processlist`](performance-schema-processlist-table.html "25.12.16.3 The processlist Table") table is accessible as follows:

  + With the [`PROCESS`](privileges-provided.html#priv_process) privilege, a user has access to information about all threads, even those belonging to other users.

  + Without the [`PROCESS`](privileges-provided.html#priv_process) privilege, nonanonymous users have access to information about their own threads but not threads for other users, and anonymous users have no access to thread information.

  Note

  The Performance Schema [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") table also provides thread information, but table access uses a different privilege model. See [Section 25.12.16.4, “The threads Table”](performance-schema-threads-table.html "25.12.16.4 The threads Table").

  The [`PROCESS`](privileges-provided.html#priv_process) privilege also enables use of the [`SHOW ENGINE`](show-engine.html "13.7.5.15 SHOW ENGINE Statement") statement, access to the `INFORMATION_SCHEMA` `InnoDB` tables (tables with names that begin with `INNODB_`), and (as of MySQL 5.7.31) access to the `INFORMATION_SCHEMA` [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") table.

* [`PROXY`](privileges-provided.html#priv_proxy)

  Enables one user to impersonate or become known as another user. See [Section 6.2.14, “Proxy Users”](proxy-users.html "6.2.14 Proxy Users").

* [`REFERENCES`](privileges-provided.html#priv_references)

  Creation of a foreign key constraint requires the [`REFERENCES`](privileges-provided.html#priv_references) privilege for the parent table.

* [`RELOAD`](privileges-provided.html#priv_reload)

  The [`RELOAD`](privileges-provided.html#priv_reload) enables the following operations:

  + Use of the [`FLUSH`](flush.html "13.7.6.3 FLUSH Statement") statement.

  + Use of [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") commands that are equivalent to [`FLUSH`](flush.html "13.7.6.3 FLUSH Statement") operations: `flush-hosts`, `flush-logs`, `flush-privileges`, `flush-status`, `flush-tables`, `flush-threads`, `refresh`, and `reload`.

    The `reload` command tells the server to reload the grant tables into memory. `flush-privileges` is a synonym for `reload`. The `refresh` command closes and reopens the log files and flushes all tables. The other `flush-xxx` commands perform functions similar to `refresh`, but are more specific and may be preferable in some instances. For example, if you want to flush just the log files, `flush-logs` is a better choice than `refresh`.

  + Use of [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") options that perform various [`FLUSH`](flush.html "13.7.6.3 FLUSH Statement") operations: [`--flush-logs`](mysqldump.html#option_mysqldump_flush-logs) and [`--master-data`](mysqldump.html#option_mysqldump_master-data).

  + Use of the [`RESET`](reset.html "13.7.6.6 RESET Statement") statement.

* [`REPLICATION CLIENT`](privileges-provided.html#priv_replication-client)

  Enables use of the [`SHOW MASTER STATUS`](show-master-status.html "13.7.5.23 SHOW MASTER STATUS Statement"), [`SHOW SLAVE STATUS`](show-slave-status.html "13.7.5.34 SHOW SLAVE STATUS Statement"), and [`SHOW BINARY LOGS`](show-binary-logs.html "13.7.5.1 SHOW BINARY LOGS Statement") statements.

* [`REPLICATION SLAVE`](privileges-provided.html#priv_replication-slave)

  Enables the account to request updates that have been made to databases on the source server, using the [`SHOW SLAVE HOSTS`](show-slave-hosts.html "13.7.5.33 SHOW SLAVE HOSTS Statement"), [`SHOW RELAYLOG EVENTS`](show-relaylog-events.html "13.7.5.32 SHOW RELAYLOG EVENTS Statement"), and [`SHOW BINLOG EVENTS`](show-binlog-events.html "13.7.5.2 SHOW BINLOG EVENTS Statement") statements. This privilege is also required to use the [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files") options [`--read-from-remote-server`](mysqlbinlog.html#option_mysqlbinlog_read-from-remote-server) (`-R`) and [`--read-from-remote-master`](mysqlbinlog.html#option_mysqlbinlog_read-from-remote-master). Grant this privilege to accounts that are used by replica servers to connect to the current server as their source.

* [`SELECT`](privileges-provided.html#priv_select)

  Enables rows to be selected from tables in a database. [`SELECT`](select.html "13.2.9 SELECT Statement") statements require the [`SELECT`](privileges-provided.html#priv_select) privilege only if they actually access tables. Some [`SELECT`](select.html "13.2.9 SELECT Statement") statements do not access tables and can be executed without permission for any database. For example, you can use [`SELECT`](select.html "13.2.9 SELECT Statement") as a simple calculator to evaluate expressions that make no reference to tables:

  ```sql
  SELECT 1+1;
  SELECT PI()*2;
  ```

  The [`SELECT`](privileges-provided.html#priv_select) privilege is also needed for other statements that read column values. For example, [`SELECT`](privileges-provided.html#priv_select) is needed for columns referenced on the right hand side of *`col_name`*=*`expr`* assignment in [`UPDATE`](update.html "13.2.11 UPDATE Statement") statements or for columns named in the `WHERE` clause of [`DELETE`](delete.html "13.2.2 DELETE Statement") or [`UPDATE`](update.html "13.2.11 UPDATE Statement") statements.

  The [`SELECT`](privileges-provided.html#priv_select) privilege is needed for tables or views used with [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement"), including any underlying tables in view definitions.

* [`SHOW DATABASES`](privileges-provided.html#priv_show-databases)

  Enables the account to see database names by issuing the `SHOW DATABASE` statement. Accounts that do not have this privilege see only databases for which they have some privileges, and cannot use the statement at all if the server was started with the [`--skip-show-database`](server-options.html#option_mysqld_skip-show-database) option.

  Caution

  Because a global privilege is considered a privilege for all databases, *any* global privilege enables a user to see all database names with [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement") or by examining the `INFORMATION_SCHEMA` [`SCHEMATA`](information-schema-schemata-table.html "24.3.22 The INFORMATION_SCHEMA SCHEMATA Table") table.

* [`SHOW VIEW`](privileges-provided.html#priv_show-view)

  Enables use of the [`SHOW CREATE VIEW`](show-create-view.html "13.7.5.13 SHOW CREATE VIEW Statement") statement. This privilege is also needed for views used with [`EXPLAIN`](explain.html "13.8.2 EXPLAIN Statement").

* [`SHUTDOWN`](privileges-provided.html#priv_shutdown)

  Enables use of the [`SHUTDOWN`](shutdown.html "13.7.6.7 SHUTDOWN Statement") statement, the [**mysqladmin shutdown**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") command, and the [`mysql_shutdown()`](/doc/c-api/5.7/en/mysql-shutdown.html) C API function.

* [`SUPER`](privileges-provided.html#priv_super)

  Affects the following operations and server behaviors:

  + Enables server configuration changes by modifying global system variables. For some system variables, setting the session value also requires the [`SUPER`](privileges-provided.html#priv_super) privilege. If a system variable is restricted and requires a special privilege to set the session value, the variable description indicates that restriction. Examples include [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format), [`sql_log_bin`](replication-options-binary-log.html#sysvar_sql_log_bin), and [`sql_log_off`](server-system-variables.html#sysvar_sql_log_off). See also [Section 5.1.8.1, “System Variable Privileges”](system-variable-privileges.html "5.1.8.1 System Variable Privileges").

  + Enables changes to global transaction characteristics (see [Section 13.3.6, “SET TRANSACTION Statement”](set-transaction.html "13.3.6 SET TRANSACTION Statement")).

  + Enables the account to start and stop replication, including Group Replication.

  + Enables use of the [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") and [`CHANGE REPLICATION FILTER`](change-replication-filter.html "13.4.2.2 CHANGE REPLICATION FILTER Statement") statements.

  + Enables binary log control by means of the [`PURGE BINARY LOGS`](purge-binary-logs.html "13.4.1.1 PURGE BINARY LOGS Statement") and [`BINLOG`](binlog.html "13.7.6.1 BINLOG Statement") statements.

  + Enables setting the effective authorization ID when executing a view or stored program. A user with this privilege can specify any account in the `DEFINER` attribute of a view or stored program.

  + Enables use of the [`CREATE SERVER`](create-server.html "13.1.17 CREATE SERVER Statement"), [`ALTER SERVER`](alter-server.html "13.1.7 ALTER SERVER Statement"), and [`DROP SERVER`](drop-server.html "13.1.28 DROP SERVER Statement") statements.

  + Enables use of the [**mysqladmin debug**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") command.

  + Enables `InnoDB` encryption key rotation.

  + Enables reading the DES key file by the [`DES_ENCRYPT()`](encryption-functions.html#function_des-encrypt) function.

  + Enables execution of Version Tokens functions.
  + Enables control over client connections not permitted to non-[`SUPER`](privileges-provided.html#priv_super) accounts:

    - Enables use of the [`KILL`](kill.html "13.7.6.4 KILL Statement") statement or [**mysqladmin kill**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") command to kill threads belonging to other accounts. (An account can always kill its own threads.)

    - The server does not execute [`init_connect`](server-system-variables.html#sysvar_init_connect) system variable content when [`SUPER`](privileges-provided.html#priv_super) clients connect.

    - The server accepts one connection from a [`SUPER`](privileges-provided.html#priv_super) client even if the connection limit configured by the [`max_connections`](server-system-variables.html#sysvar_max_connections) system variable is reached.

    - A server in offline mode ([`offline_mode`](server-system-variables.html#sysvar_offline_mode) enabled) does not terminate [`SUPER`](privileges-provided.html#priv_super) client connections at the next client request, and accepts new connections from [`SUPER`](privileges-provided.html#priv_super) clients.

    - Updates can be performed even when the [`read_only`](server-system-variables.html#sysvar_read_only) system variable is enabled. This applies to explicit table updates, and to use of account-management statements such as [`GRANT`](grant.html "13.7.1.4 GRANT Statement") and [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement") that update tables implicitly.

  You may also need the [`SUPER`](privileges-provided.html#priv_super) privilege to create or alter stored functions if binary logging is enabled, as described in [Section 23.7, “Stored Program Binary Logging”](stored-programs-logging.html "23.7 Stored Program Binary Logging").

* [`TRIGGER`](privileges-provided.html#priv_trigger)

  Enables trigger operations. You must have this privilege for a table to create, drop, execute, or display triggers for that table.

  When a trigger is activated (by a user who has privileges to execute [`INSERT`](insert.html "13.2.5 INSERT Statement"), [`UPDATE`](update.html "13.2.11 UPDATE Statement"), or [`DELETE`](delete.html "13.2.2 DELETE Statement") statements for the table associated with the trigger), trigger execution requires that the user who defined the trigger still have the [`TRIGGER`](privileges-provided.html#priv_trigger) privilege for the table.

* [`UPDATE`](privileges-provided.html#priv_update)

  Enables rows to be updated in tables in a database.

* [`USAGE`](privileges-provided.html#priv_usage)

  This privilege specifier stands for “no privileges.” It is used at the global level with [`GRANT`](grant.html "13.7.1.4 GRANT Statement") to modify account attributes such as resource limits or SSL characteristics without naming specific account privileges in the privilege list. [`SHOW GRANTS`](show-grants.html "13.7.5.21 SHOW GRANTS Statement") displays [`USAGE`](privileges-provided.html#priv_usage) to indicate that an account has no privileges at a privilege level.

#### Privilege-Granting Guidelines

It is a good idea to grant to an account only those privileges that it needs. You should exercise particular caution in granting the [`FILE`](privileges-provided.html#priv_file) and administrative privileges:

* [`FILE`](privileges-provided.html#priv_file) can be abused to read into a database table any files that the MySQL server can read on the server host. This includes all world-readable files and files in the server's data directory. The table can then be accessed using [`SELECT`](select.html "13.2.9 SELECT Statement") to transfer its contents to the client host.

* [`GRANT OPTION`](privileges-provided.html#priv_grant-option) enables users to give their privileges to other users. Two users that have different privileges and with the [`GRANT OPTION`](privileges-provided.html#priv_grant-option) privilege are able to combine privileges.

* [`ALTER`](privileges-provided.html#priv_alter) may be used to subvert the privilege system by renaming tables.

* [`SHUTDOWN`](privileges-provided.html#priv_shutdown) can be abused to deny service to other users entirely by terminating the server.

* [`PROCESS`](privileges-provided.html#priv_process) can be used to view the plain text of currently executing statements, including statements that set or change passwords.

* [`SUPER`](privileges-provided.html#priv_super) can be used to terminate other sessions or change how the server operates.

* Privileges granted for the `mysql` system database itself can be used to change passwords and other access privilege information:

  + Passwords are stored encrypted, so a malicious user cannot simply read them to know the plain text password. However, a user with write access to the `mysql.user` system table `authentication_string` column can change an account's password, and then connect to the MySQL server using that account.

  + [`INSERT`](privileges-provided.html#priv_insert) or [`UPDATE`](privileges-provided.html#priv_update) granted for the `mysql` system database enable a user to add privileges or modify existing privileges, respectively.

  + [`DROP`](privileges-provided.html#priv_drop) for the `mysql` system database enables a user to remote privilege tables, or even the database itself.
