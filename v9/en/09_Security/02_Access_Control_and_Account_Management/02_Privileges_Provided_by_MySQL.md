### 8.2.2 Privileges Provided by MySQL

The privileges granted to a MySQL account determine which
operations the account can perform. MySQL privileges differ in the
contexts in which they apply and at different levels of operation:

* Administrative privileges enable users to manage operation of
  the MySQL server. These privileges are global because they are
  not specific to a particular database.

* Database privileges apply to a database and to all objects
  within it. These privileges can be granted for specific
  databases, or globally so that they apply to all databases.

* Privileges for database objects such as tables, indexes,
  views, and stored routines can be granted for specific objects
  within a database, for all objects of a given type within a
  database (for example, all tables in a database), or globally
  for all objects of a given type in all databases.

Privileges also differ in terms of whether they are static (built
in to the server) or dynamic (defined at runtime). Whether a
privilege is static or dynamic affects its availability to be
granted to user accounts and roles. For information about the
differences between static and dynamic privileges, see
[Static Versus Dynamic Privileges](privileges-provided.html#static-dynamic-privileges "Static Versus Dynamic Privileges").)

Information about account privileges is stored in the grant tables
in the `mysql` system database. For a description
of the structure and contents of these tables, see
[Section 8.2.3, “Grant Tables”](grant-tables.html "8.2.3 Grant Tables"). The MySQL server reads the
contents of the grant tables into memory when it starts, and
reloads them under the circumstances indicated in
[Section 8.2.13, “When Privilege Changes Take Effect”](privilege-changes.html "8.2.13 When Privilege Changes Take Effect"). The server bases
access-control decisions on the in-memory copies of the grant
tables.

Important

Some MySQL releases introduce changes to the grant tables to add
new privileges or features. To make sure that you can take
advantage of any new capabilities, update your grant tables to
the current structure whenever you upgrade MySQL. See
[Chapter 3, *Upgrading MySQL*](upgrading.html "Chapter 3 Upgrading MySQL").

The following sections summarize the available privileges, provide
more detailed descriptions of each privilege, and offer usage
guidelines.

* [Summary of Available Privileges](privileges-provided.html#privileges-provided-summary "Summary of Available Privileges")
* [Static Privilege Descriptions](privileges-provided.html#privileges-provided-static "Static Privilege Descriptions")
* [Dynamic Privilege Descriptions](privileges-provided.html#privileges-provided-dynamic "Dynamic Privilege Descriptions")
* [Privilege-Granting Guidelines](privileges-provided.html#privileges-provided-guidelines "Privilege-Granting Guidelines")
* [Static Versus Dynamic Privileges](privileges-provided.html#static-dynamic-privileges "Static Versus Dynamic Privileges")
* [Migrating Accounts from SUPER to Dynamic Privileges](privileges-provided.html#dynamic-privileges-migration-from-super "Migrating Accounts from SUPER to Dynamic Privileges")

#### Summary of Available Privileges

The following table shows the static privilege names used in
[`GRANT`](grant.html "15.7.1.6 GRANT Statement") and
[`REVOKE`](revoke.html "15.7.1.8 REVOKE Statement") statements, along with the
column name associated with each privilege in the grant tables
and the context in which the privilege applies.

**Table 8.2 Permissible Static Privileges for GRANT and REVOKE**

<table><col style="width: 30%"/><col style="width: 33%"/><col style="width: 37%"/><thead><tr>
<th scope="col">Privilege</th>
<th scope="col">Grant Table Column</th>
<th scope="col">Context</th>
</tr></thead><tbody><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_all"><code class="literal">ALL [PRIVILEGES]</code></a></th>
<td>Synonym for <span class="quote">“<span class="quote">all privileges</span>”</span></td>
<td>Server administration</td>
</tr><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_alter"><code class="literal">ALTER</code></a></th>
<td><code class="literal">Alter_priv</code></td>
<td>Tables</td>
</tr><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_alter-routine"><code class="literal">ALTER ROUTINE</code></a></th>
<td><code class="literal">Alter_routine_priv</code></td>
<td>Stored routines</td>
</tr><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_create"><code class="literal">CREATE</code></a></th>
<td><code class="literal">Create_priv</code></td>
<td>Databases, tables, or indexes</td>
</tr><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_create-role"><code class="literal">CREATE ROLE</code></a></th>
<td><code class="literal">Create_role_priv</code></td>
<td>Server administration</td>
</tr><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_create-routine"><code class="literal">CREATE ROUTINE</code></a></th>
<td><code class="literal">Create_routine_priv</code></td>
<td>Stored routines</td>
</tr><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_create-tablespace"><code class="literal">CREATE TABLESPACE</code></a></th>
<td><code class="literal">Create_tablespace_priv</code></td>
<td>Server administration</td>
</tr><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_create-temporary-tables"><code class="literal">CREATE TEMPORARY TABLES</code></a></th>
<td><code class="literal">Create_tmp_table_priv</code></td>
<td>Tables</td>
</tr><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_create-user"><code class="literal">CREATE USER</code></a></th>
<td><code class="literal">Create_user_priv</code></td>
<td>Server administration</td>
</tr><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_create-view"><code class="literal">CREATE VIEW</code></a></th>
<td><code class="literal">Create_view_priv</code></td>
<td>Views</td>
</tr><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_delete"><code class="literal">DELETE</code></a></th>
<td><code class="literal">Delete_priv</code></td>
<td>Tables</td>
</tr><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_drop"><code class="literal">DROP</code></a></th>
<td><code class="literal">Drop_priv</code></td>
<td>Databases, tables, or views</td>
</tr><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_drop-role"><code class="literal">DROP ROLE</code></a></th>
<td><code class="literal">Drop_role_priv</code></td>
<td>Server administration</td>
</tr><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_event"><code class="literal">EVENT</code></a></th>
<td><code class="literal">Event_priv</code></td>
<td>Databases</td>
</tr><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_execute"><code class="literal">EXECUTE</code></a></th>
<td><code class="literal">Execute_priv</code></td>
<td>Stored routines</td>
</tr><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_file"><code class="literal">FILE</code></a></th>
<td><code class="literal">File_priv</code></td>
<td>File access on server host</td>
</tr><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_grant-option"><code class="literal">GRANT OPTION</code></a></th>
<td><code class="literal">Grant_priv</code></td>
<td>Databases, tables, or stored routines</td>
</tr><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_index"><code class="literal">INDEX</code></a></th>
<td><code class="literal">Index_priv</code></td>
<td>Tables</td>
</tr><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_insert"><code class="literal">INSERT</code></a></th>
<td><code class="literal">Insert_priv</code></td>
<td>Tables or columns</td>
</tr><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_lock-tables"><code class="literal">LOCK TABLES</code></a></th>
<td><code class="literal">Lock_tables_priv</code></td>
<td>Databases</td>
</tr><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_process"><code class="literal">PROCESS</code></a></th>
<td><code class="literal">Process_priv</code></td>
<td>Server administration</td>
</tr><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_proxy"><code class="literal">PROXY</code></a></th>
<td>See <code class="literal">proxies_priv</code> table</td>
<td>Server administration</td>
</tr><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_references"><code class="literal">REFERENCES</code></a></th>
<td><code class="literal">References_priv</code></td>
<td>Databases or tables</td>
</tr><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_reload"><code class="literal">RELOAD</code></a></th>
<td><code class="literal">Reload_priv</code></td>
<td>Server administration</td>
</tr><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_replication-client"><code class="literal">REPLICATION CLIENT</code></a></th>
<td><code class="literal">Repl_client_priv</code></td>
<td>Server administration</td>
</tr><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_replication-slave"><code class="literal">REPLICATION SLAVE</code></a></th>
<td><code class="literal">Repl_slave_priv</code></td>
<td>Server administration</td>
</tr><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_select"><code class="literal">SELECT</code></a></th>
<td><code class="literal">Select_priv</code></td>
<td>Tables or columns</td>
</tr><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_show-databases"><code class="literal">SHOW DATABASES</code></a></th>
<td><code class="literal">Show_db_priv</code></td>
<td>Server administration</td>
</tr><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_show-view"><code class="literal">SHOW VIEW</code></a></th>
<td><code class="literal">Show_view_priv</code></td>
<td>Views</td>
</tr><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_shutdown"><code class="literal">SHUTDOWN</code></a></th>
<td><code class="literal">Shutdown_priv</code></td>
<td>Server administration</td>
</tr><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_super"><code class="literal">SUPER</code></a></th>
<td><code class="literal">Super_priv</code></td>
<td>Server administration</td>
</tr><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_trigger"><code class="literal">TRIGGER</code></a></th>
<td><code class="literal">Trigger_priv</code></td>
<td>Tables</td>
</tr><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_update"><code class="literal">UPDATE</code></a></th>
<td><code class="literal">Update_priv</code></td>
<td>Tables or columns</td>
</tr><tr>
<th scope="row"><a class="link" href="privileges-provided.html#priv_usage"><code class="literal">USAGE</code></a></th>
<td>Synonym for <span class="quote">“<span class="quote">no privileges</span>”</span></td>
<td>Server administration</td>
</tr></tbody></table>

The following table shows the dynamic privilege names used in
[`GRANT`](grant.html "15.7.1.6 GRANT Statement") and
[`REVOKE`](revoke.html "15.7.1.8 REVOKE Statement") statements, along with the
context in which the privilege applies.

**Table 8.3 Permissible Dynamic Privileges for GRANT and REVOKE**

<table><col style="width: 35%"/><col style="width: 65%"/><thead><tr>
<th>Privilege</th>
<th>Context</th>
</tr></thead><tbody><tr>
<td><a class="link" href="privileges-provided.html#priv_allow-nonexistent-definer"><code class="literal">ALLOW_NONEXISTENT_DEFINER</code></a></td>
<td>Orphan object protection</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_application-password-admin"><code class="literal">APPLICATION_PASSWORD_ADMIN</code></a></td>
<td>Dual password administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_audit-abort-exempt"><code class="literal">AUDIT_ABORT_EXEMPT</code></a></td>
<td>Allow queries blocked by audit log filter</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_audit-admin"><code class="literal">AUDIT_ADMIN</code></a></td>
<td>Audit log administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_authentication-policy-admin"><code class="literal">AUTHENTICATION_POLICY_ADMIN</code></a></td>
<td>Authentication administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_backup-admin"><code class="literal">BACKUP_ADMIN</code></a></td>
<td>Backup administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_binlog-admin"><code class="literal">BINLOG_ADMIN</code></a></td>
<td>Backup and Replication administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_binlog-encryption-admin"><code class="literal">BINLOG_ENCRYPTION_ADMIN</code></a></td>
<td>Backup and Replication administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_clone-admin"><code class="literal">CLONE_ADMIN</code></a></td>
<td>Clone administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_connection-admin"><code class="literal">CONNECTION_ADMIN</code></a></td>
<td>Server administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_create-spatial-reference-system"><code class="literal">CREATE_SPATIAL_REFERENCE_SYSTEM</code></a></td>
<td>GIS administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_encryption-key-admin"><code class="literal">ENCRYPTION_KEY_ADMIN</code></a></td>
<td>Server administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_export-query-results"><code class="literal">EXPORT_QUERY_RESULTS</code></a></td>
<td>Allow user to export query results</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_firewall-admin"><code class="literal">FIREWALL_ADMIN</code></a></td>
<td>Firewall administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_firewall-exempt"><code class="literal">FIREWALL_EXEMPT</code></a></td>
<td>Firewall administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_firewall-user"><code class="literal">FIREWALL_USER</code></a></td>
<td>Firewall administration (deprecated)</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_flush-optimizer-costs"><code class="literal">FLUSH_OPTIMIZER_COSTS</code></a></td>
<td>Server administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_flush-privileges"><code class="literal">FLUSH_PRIVILEGES</code></a> (Deprecated)</td>
<td>Server administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_flush-status"><code class="literal">FLUSH_STATUS</code></a></td>
<td>Server administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_flush-tables"><code class="literal">FLUSH_TABLES</code></a></td>
<td>Server administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_flush-user-resources"><code class="literal">FLUSH_USER_RESOURCES</code></a></td>
<td>Server administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_group-replication-admin"><code class="literal">GROUP_REPLICATION_ADMIN</code></a></td>
<td>Replication administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_group-replication-stream"><code class="literal">GROUP_REPLICATION_STREAM</code></a></td>
<td>Replication administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_innodb-redo-log-archive"><code class="literal">INNODB_REDO_LOG_ARCHIVE</code></a></td>
<td>Redo log archiving administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_innodb-redo-log-enable"><code class="literal">INNODB_REDO_LOG_ENABLE</code></a></td>
<td>Redo log administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_masking-dictionaries-admin"><code class="literal">MASKING_DICTIONARIES_ADMIN</code></a></td>
<td>Server administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_ndb-stored-user"><code class="literal">NDB_STORED_USER</code></a></td>
<td>NDB Cluster</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_optimize-local-table"><code class="literal">OPTIMIZE_LOCAL_TABLE</code></a></td>
<td><a class="link" href="optimize-table.html" title="15.7.3.4 OPTIMIZE TABLE Statement"><code class="literal">OPTIMIZE LOCAL
              TABLE</code></a> statements</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_option-tracker-observer"><code class="literal">OPTION_TRACKER_OBSERVER</code></a></td>
<td>Option Tracker <code class="literal">mysql_option.option_usage</code> table read
              access</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_option-tracker-updater"><code class="literal">OPTION_TRACKER_UPDATER</code></a></td>
<td>Option Tracker <code class="literal">mysql_option.option_usage</code> table write
              access</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_passwordless-user-admin"><code class="literal">PASSWORDLESS_USER_ADMIN</code></a></td>
<td>Authentication administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_persist-ro-variables-admin"><code class="literal">PERSIST_RO_VARIABLES_ADMIN</code></a></td>
<td>Server administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_replication-applier"><code class="literal">REPLICATION_APPLIER</code></a></td>
<td><code class="literal">PRIVILEGE_CHECKS_USER</code> for a replication channel</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_replication-slave-admin"><code class="literal">REPLICATION_SLAVE_ADMIN</code></a></td>
<td>Replication administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_resource-group-admin"><code class="literal">RESOURCE_GROUP_ADMIN</code></a></td>
<td>Resource group administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_resource-group-user"><code class="literal">RESOURCE_GROUP_USER</code></a></td>
<td>Resource group administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_role-admin"><code class="literal">ROLE_ADMIN</code></a></td>
<td>Server administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_sensitive-variables-observer"><code class="literal">SENSITIVE_VARIABLES_OBSERVER</code></a></td>
<td>Server administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_session-variables-admin"><code class="literal">SESSION_VARIABLES_ADMIN</code></a></td>
<td>Server administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_set-any-definer"><code class="literal">SET_ANY_DEFINER</code></a></td>
<td>Server administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_show-routine"><code class="literal">SHOW_ROUTINE</code></a></td>
<td>Server administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_skip-query-rewrite"><code class="literal">SKIP_QUERY_REWRITE</code></a></td>
<td>Server administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_system-user"><code class="literal">SYSTEM_USER</code></a></td>
<td>Server administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_system-variables-admin"><code class="literal">SYSTEM_VARIABLES_ADMIN</code></a></td>
<td>Server administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_table-encryption-admin"><code class="literal">TABLE_ENCRYPTION_ADMIN</code></a></td>
<td>Server administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_telemetry-log-admin"><code class="literal">TELEMETRY_LOG_ADMIN</code></a></td>
<td>Telemetry log administration for MySQL HeatWave on AWS</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_tp-connection-admin"><code class="literal">TP_CONNECTION_ADMIN</code></a></td>
<td>Thread pool administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_transaction-gtid-tag"><code class="literal">TRANSACTION_GTID_TAG</code></a></td>
<td>Replication administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_version-token-admin"><code class="literal">VERSION_TOKEN_ADMIN</code></a> (Deprecated)</td>
<td>Server administration</td>
</tr><tr>
<td><a class="link" href="privileges-provided.html#priv_xa-recover-admin"><code class="literal">XA_RECOVER_ADMIN</code></a></td>
<td>Server administration</td>
</tr></tbody></table>

#### Static Privilege Descriptions

Static privileges are built in to the server, in contrast to
dynamic privileges, which are defined at runtime. The following
list describes each static privilege available in MySQL.

Particular SQL statements might have more specific privilege
requirements than indicated here. If so, the description for the
statement in question provides the details.

* [`ALL`](privileges-provided.html#priv_all),
  [`ALL
  PRIVILEGES`](privileges-provided.html#priv_all)

  These privilege specifiers are shorthand for “all
  privileges available at a given privilege level”
  (except [`GRANT OPTION`](privileges-provided.html#priv_grant-option)). For
  example, granting [`ALL`](privileges-provided.html#priv_all) at the
  global or table level grants all global privileges or all
  table-level privileges, respectively.

* [`ALTER`](privileges-provided.html#priv_alter)

  Enables use of the [`ALTER
  TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement") statement to change the structure of tables.
  [`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement") also requires the
  [`CREATE`](privileges-provided.html#priv_create) and
  [`INSERT`](privileges-provided.html#priv_insert) privileges. Renaming a
  table requires [`ALTER`](privileges-provided.html#priv_alter) and
  [`DROP`](privileges-provided.html#priv_drop) on the old table,
  [`CREATE`](privileges-provided.html#priv_create), and
  [`INSERT`](privileges-provided.html#priv_insert) on the new table.

* [`ALTER ROUTINE`](privileges-provided.html#priv_alter-routine)

  Enables use of statements that alter or drop stored routines
  (stored procedures and functions). For routines that fall
  within the scope at which the privilege is granted and for
  which the user is not the user named as the routine
  `DEFINER`, also enables access to routine
  properties other than the routine definition.

* [`CREATE`](privileges-provided.html#priv_create)

  Enables use of statements that create new databases and
  tables.

* [`CREATE ROLE`](privileges-provided.html#priv_create-role)

  Enables use of the [`CREATE
  ROLE`](create-role.html "15.7.1.2 CREATE ROLE Statement") statement. (The [`CREATE
  USER`](privileges-provided.html#priv_create-user) privilege also enables use of the
  [`CREATE ROLE`](create-role.html "15.7.1.2 CREATE ROLE Statement") statement.) See
  [Section 8.2.10, “Using Roles”](roles.html "8.2.10 Using Roles").

  The [`CREATE ROLE`](privileges-provided.html#priv_create-role) and
  [`DROP ROLE`](privileges-provided.html#priv_drop-role) privileges are not
  as powerful as [`CREATE USER`](privileges-provided.html#priv_create-user)
  because they can be used only to create and drop accounts.
  They cannot be used as [`CREATE
  USER`](privileges-provided.html#priv_create-user) can be modify account attributes or rename
  accounts. See
  [User and Role Interchangeability](roles.html#role-user-interchangeability "User and Role Interchangeability").

* [`CREATE ROUTINE`](privileges-provided.html#priv_create-routine)

  Enables use of statements that create stored routines
  (stored procedures and functions). For routines that fall
  within the scope at which the privilege is granted and for
  which the user is not the user named as the routine
  `DEFINER`, also enables access to routine
  properties other than the routine definition.

* [`CREATE TABLESPACE`](privileges-provided.html#priv_create-tablespace)

  Enables use of statements that create, alter, or drop
  tablespaces and log file groups.

* [`CREATE TEMPORARY TABLES`](privileges-provided.html#priv_create-temporary-tables)

  Enables the creation of temporary tables using the
  [`CREATE TEMPORARY TABLE`](create-temporary-table.html "15.1.24.2 CREATE TEMPORARY TABLE Statement")
  statement.

  After a session has created a temporary table, the server
  performs no further privilege checks on the table. The
  creating session can perform any operation on the table,
  such as [`DROP TABLE`](drop-table.html "15.1.37 DROP TABLE Statement"),
  [`INSERT`](insert.html "15.2.7 INSERT Statement"),
  [`UPDATE`](update.html "15.2.17 UPDATE Statement"), or
  [`SELECT`](select.html "15.2.13 SELECT Statement"). For more information,
  see [Section 15.1.24.2, “CREATE TEMPORARY TABLE Statement”](create-temporary-table.html "15.1.24.2 CREATE TEMPORARY TABLE Statement").

* [`CREATE USER`](privileges-provided.html#priv_create-user)

  Enables use of the [`ALTER
  USER`](alter-user.html "15.7.1.1 ALTER USER Statement"), [`CREATE ROLE`](create-role.html "15.7.1.2 CREATE ROLE Statement"),
  [`CREATE USER`](create-user.html "15.7.1.3 CREATE USER Statement"),
  [`DROP ROLE`](drop-role.html "15.7.1.4 DROP ROLE Statement"),
  [`DROP USER`](drop-user.html "15.7.1.5 DROP USER Statement"),
  [`RENAME USER`](rename-user.html "15.7.1.7 RENAME USER Statement"), and
  [`REVOKE ALL
  PRIVILEGES`](revoke.html "15.7.1.8 REVOKE Statement") statements.

* [`CREATE VIEW`](privileges-provided.html#priv_create-view)

  Enables use of the [`CREATE
  VIEW`](create-view.html "15.1.27 CREATE VIEW Statement") statement.

* [`DELETE`](privileges-provided.html#priv_delete)

  Enables rows to be deleted from tables in a database.

* [`DROP`](privileges-provided.html#priv_drop)

  Enables use of statements that drop (remove) existing
  databases, tables, and views. The
  [`DROP`](privileges-provided.html#priv_drop) privilege is required to
  use the `ALTER TABLE ... DROP PARTITION`
  statement on a partitioned table. The
  [`DROP`](privileges-provided.html#priv_drop) privilege is also
  required for [`TRUNCATE TABLE`](truncate-table.html "15.1.42 TRUNCATE TABLE Statement").

* [`DROP ROLE`](privileges-provided.html#priv_drop-role)

  Enables use of the [`DROP ROLE`](drop-role.html "15.7.1.4 DROP ROLE Statement")
  statement. (The [`CREATE USER`](privileges-provided.html#priv_create-user)
  privilege also enables use of the [`DROP
  ROLE`](drop-role.html "15.7.1.4 DROP ROLE Statement") statement.) See [Section 8.2.10, “Using Roles”](roles.html "8.2.10 Using Roles").

  The [`CREATE ROLE`](privileges-provided.html#priv_create-role) and
  [`DROP ROLE`](privileges-provided.html#priv_drop-role) privileges are not
  as powerful as [`CREATE USER`](privileges-provided.html#priv_create-user)
  because they can be used only to create and drop accounts.
  They cannot be used as [`CREATE
  USER`](privileges-provided.html#priv_create-user) can be modify account attributes or rename
  accounts. See
  [User and Role Interchangeability](roles.html#role-user-interchangeability "User and Role Interchangeability").

* [`EVENT`](privileges-provided.html#priv_event)

  Enables use of statements that create, alter, drop, or
  display events for the Event Scheduler.

* [`EXECUTE`](privileges-provided.html#priv_execute)

  Enables use of statements that execute stored routines
  (stored procedures and functions). For routines that fall
  within the scope at which the privilege is granted and for
  which the user is not the user named as the routine
  `DEFINER`, also enables access to routine
  properties other than the routine definition.

* [`FILE`](privileges-provided.html#priv_file)

  Affects the following operations and server behaviors:

  + Enables reading and writing files on the server host
    using the [`LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement") and
    [`SELECT ...
    INTO OUTFILE`](select-into.html "15.2.13.1 SELECT ... INTO Statement") statements and the
    [`LOAD_FILE()`](string-functions.html#function_load-file) function. A
    user who has the [`FILE`](privileges-provided.html#priv_file)
    privilege can read any file on the server host that is
    either world-readable or readable by the MySQL server.
    (This implies the user can read any file in any database
    directory, because the server can access any of those
    files.)

  + Enables creating new files in any directory where the
    MySQL server has write access. This includes the
    server's data directory containing the files that
    implement the privilege tables.

  + Enables use of the `DATA DIRECTORY` or
    `INDEX DIRECTORY` table option for the
    [`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement") statement.

  As a security measure, the server does not overwrite
  existing files.

  To limit the location in which files can be read and
  written, set the
  [`secure_file_priv`](server-system-variables.html#sysvar_secure_file_priv) system
  variable to a specific directory. See
  [Section 7.1.8, “Server System Variables”](server-system-variables.html "7.1.8 Server System Variables").

* [`GRANT OPTION`](privileges-provided.html#priv_grant-option)

  Enables you to grant to or revoke from other users those
  privileges that you yourself possess.

* [`INDEX`](privileges-provided.html#priv_index)

  Enables use of statements that create or drop (remove)
  indexes. [`INDEX`](privileges-provided.html#priv_index) applies to
  existing tables. If you have the
  [`CREATE`](privileges-provided.html#priv_create) privilege for a table,
  you can include index definitions in the
  [`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement") statement.

* [`INSERT`](privileges-provided.html#priv_insert)

  Enables rows to be inserted into tables in a database.
  [`INSERT`](privileges-provided.html#priv_insert) is also required for
  the [`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement"),
  [`OPTIMIZE TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement"), and
  [`REPAIR TABLE`](repair-table.html "15.7.3.5 REPAIR TABLE Statement")
  table-maintenance statements.

* [`LOCK TABLES`](privileges-provided.html#priv_lock-tables)

  Enables use of explicit [`LOCK
  TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") statements to lock tables for which you
  have the [`SELECT`](privileges-provided.html#priv_select) privilege.
  This includes use of write locks, which prevents other
  sessions from reading the locked table.

* [`PROCESS`](privileges-provided.html#priv_process)

  The [`PROCESS`](privileges-provided.html#priv_process) privilege
  controls access to information about threads executing
  within the server (that is, information about statements
  being executed by sessions). Thread information available
  using the [`SHOW PROCESSLIST`](show-processlist.html "15.7.7.32 SHOW PROCESSLIST Statement")
  statement, the [**mysqladmin processlist**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program")
  command, the Information Schema
  [`PROCESSLIST`](information-schema-processlist-table.html "28.3.28 The INFORMATION_SCHEMA PROCESSLIST Table") table, and the
  Performance Schema [`processlist`](performance-schema-processlist-table.html "29.12.22.9 The processlist Table")
  table is accessible as follows:

  + With the [`PROCESS`](privileges-provided.html#priv_process)
    privilege, a user has access to information about all
    threads, even those belonging to other users.

  + Without the [`PROCESS`](privileges-provided.html#priv_process)
    privilege, nonanonymous users have access to information
    about their own threads but not threads for other users,
    and anonymous users have no access to thread
    information.

  Note

  The Performance Schema
  [`threads`](performance-schema-threads-table.html "29.12.22.10 The threads Table") table also provides
  thread information, but table access uses a different
  privilege model. See
  [Section 29.12.22.10, “The threads Table”](performance-schema-threads-table.html "29.12.22.10 The threads Table").

  The [`PROCESS`](privileges-provided.html#priv_process) privilege also
  enables use of the [`SHOW
  ENGINE`](show-engine.html "15.7.7.17 SHOW ENGINE Statement") statement, access to the
  `INFORMATION_SCHEMA`
  `InnoDB` tables (tables with names that
  begin with `INNODB_`), and access to the
  `INFORMATION_SCHEMA`
  [`FILES`](information-schema-files-table.html "28.3.15 The INFORMATION_SCHEMA FILES Table") table.

* [`PROXY`](privileges-provided.html#priv_proxy)

  Enables one user to impersonate or become known as another
  user. See [Section 8.2.19, “Proxy Users”](proxy-users.html "8.2.19 Proxy Users").

* [`REFERENCES`](privileges-provided.html#priv_references)

  Creation of a foreign key constraint requires the
  [`REFERENCES`](privileges-provided.html#priv_references) privilege for the
  parent table.

* [`RELOAD`](privileges-provided.html#priv_reload)

  The [`RELOAD`](privileges-provided.html#priv_reload) enables the
  following operations:

  + Use of the [`FLUSH`](flush.html "15.7.8.3 FLUSH Statement")
    statement.

  + Use of [**mysqladmin**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") commands that are
    equivalent to [`FLUSH`](flush.html "15.7.8.3 FLUSH Statement")
    operations: `flush-hosts`,
    `flush-logs`,
    `flush-privileges`,
    `flush-status`,
    `flush-tables`,
    `refresh`, and
    `reload`.

    The `reload` command tells the server
    to reload the grant tables into memory.
    `flush-privileges` is a synonym for
    `reload`. The
    `refresh` command closes and reopens
    the log files and flushes all tables. The other
    `flush-xxx`
    commands perform functions similar to
    `refresh`, but are more specific and
    may be preferable in some instances. For example, if you
    want to flush just the log files,
    `flush-logs` is a better choice than
    `refresh`.

  + Use of [**mysqldump**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program") options that perform
    various [`FLUSH`](flush.html "15.7.8.3 FLUSH Statement") operations:
    [`--flush-logs`](mysqldump.html#option_mysqldump_flush-logs) and
    [`--source-data`](mysqldump.html#option_mysqldump_source-data).

  + Use of the [`RESET BINARY LOGS AND
    GTIDS`](reset-binary-logs-and-gtids.html "15.4.1.2 RESET BINARY LOGS AND GTIDS Statement") and [`RESET
    REPLICA`](reset-replica.html "15.4.2.3 RESET REPLICA Statement") statements.

* [`REPLICATION CLIENT`](privileges-provided.html#priv_replication-client)

  Enables use of the [`SHOW BINARY LOG
  STATUS`](show-binary-log-status.html "15.7.7.1 SHOW BINARY LOG STATUS Statement"), [`SHOW REPLICA
  STATUS`](show-replica-status.html "15.7.7.36 SHOW REPLICA STATUS Statement"), and [`SHOW BINARY
  LOGS`](show-binary-logs.html "15.7.7.2 SHOW BINARY LOGS Statement") statements.

* [`REPLICATION SLAVE`](privileges-provided.html#priv_replication-slave)

  Enables the account to request updates that have been made
  to databases on the replication source server, using the
  [`SHOW
  REPLICAS`](show-replicas.html "15.7.7.37 SHOW REPLICAS Statement"), [`SHOW RELAYLOG
  EVENTS`](show-relaylog-events.html "15.7.7.35 SHOW RELAYLOG EVENTS Statement"), and [`SHOW BINLOG
  EVENTS`](show-binlog-events.html "15.7.7.3 SHOW BINLOG EVENTS Statement") statements. This privilege is also required
  to use the [**mysqlbinlog**](mysqlbinlog.html "6.6.9 mysqlbinlog — Utility for Processing Binary Log Files") options
  [`--read-from-remote-server`](mysqlbinlog.html#option_mysqlbinlog_read-from-remote-server)
  (`-R`) and
  [`--read-from-remote-source`](mysqlbinlog.html#option_mysqlbinlog_read-from-remote-source).
  Grant this privilege to accounts that are used by replicas
  to connect to the current server as their replication source
  server.

* [`SELECT`](privileges-provided.html#priv_select)

  Enables rows to be selected from tables in a database.
  [`SELECT`](select.html "15.2.13 SELECT Statement") statements require the
  [`SELECT`](privileges-provided.html#priv_select) privilege only if they
  actually access tables. Some
  [`SELECT`](select.html "15.2.13 SELECT Statement") statements do not
  access tables and can be executed without permission for any
  database. For example, you can use
  [`SELECT`](select.html "15.2.13 SELECT Statement") as a simple calculator
  to evaluate expressions that make no reference to tables:

  ```
  SELECT 1+1;
  SELECT PI()*2;
  ```

  The [`SELECT`](privileges-provided.html#priv_select) privilege is also
  needed for other statements that read column values. For
  example, [`SELECT`](privileges-provided.html#priv_select) is needed for
  columns referenced on the right hand side of
  *`col_name`*=*`expr`*
  assignment in [`UPDATE`](update.html "15.2.17 UPDATE Statement")
  statements or for columns named in the
  `WHERE` clause of
  [`DELETE`](delete.html "15.2.2 DELETE Statement") or
  [`UPDATE`](update.html "15.2.17 UPDATE Statement") statements.

  The [`SELECT`](privileges-provided.html#priv_select) privilege is
  needed for tables or views used with
  [`EXPLAIN`](explain.html "15.8.2 EXPLAIN Statement"), including any
  underlying tables in view definitions.

* [`SHOW DATABASES`](privileges-provided.html#priv_show-databases)

  Enables the account to see database names by issuing the
  `SHOW DATABASE` statement. Accounts that do
  not have this privilege see only databases for which they
  have some privileges, and cannot use the statement at all if
  the server was started with the
  [`--skip-show-database`](server-options.html#option_mysqld_skip-show-database) option.

  Caution

  Because any static global privilege is considered a
  privilege for all databases, any static global privilege
  enables a user to see all database names with
  [`SHOW DATABASES`](show-databases.html "15.7.7.16 SHOW DATABASES Statement") or by
  examining the [`SCHEMATA`](information-schema-schemata-table.html "28.3.37 The INFORMATION_SCHEMA SCHEMATA Table") table
  of `INFORMATION_SCHEMA`, except databases
  that have been restricted at the database level by partial
  revokes.

* [`SHOW VIEW`](privileges-provided.html#priv_show-view)

  Enables use of the [`SHOW CREATE
  VIEW`](show-create-view.html "15.7.7.15 SHOW CREATE VIEW Statement") statement. This privilege is also needed for
  views used with [`EXPLAIN`](explain.html "15.8.2 EXPLAIN Statement").

* [`SHUTDOWN`](privileges-provided.html#priv_shutdown)

  Enables use of the [`SHUTDOWN`](shutdown.html "15.7.8.9 SHUTDOWN Statement")
  and [`RESTART`](restart.html "15.7.8.8 RESTART Statement") statements, the
  [**mysqladmin shutdown**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") command, and the
  [`mysql_shutdown()`](/doc/c-api/9.5/en/mysql-shutdown.html) C API
  function.

* [`SUPER`](privileges-provided.html#priv_super)

  [`SUPER`](privileges-provided.html#priv_super) is a powerful and
  far-reaching privilege and should not be granted lightly. If
  an account needs to perform only a subset of
  [`SUPER`](privileges-provided.html#priv_super) operations, it may be
  possible to achieve the desired privilege set by instead
  granting one or more dynamic privileges, each of which
  confers more limited capabilities. See
  [Dynamic Privilege Descriptions](privileges-provided.html#privileges-provided-dynamic "Dynamic Privilege Descriptions").

  Note

  [`SUPER`](privileges-provided.html#priv_super) is deprecated, and
  you should expect it to be removed in a future version of
  MySQL. See
  [Migrating Accounts from SUPER to Dynamic Privileges](privileges-provided.html#dynamic-privileges-migration-from-super "Migrating Accounts from SUPER to Dynamic Privileges").

  [`SUPER`](privileges-provided.html#priv_super) affects the following
  operations and server behaviors:

  + Enables system variable changes at runtime:

    - Enables server configuration changes to global
      system variables with
      [`SET
      GLOBAL`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") and
      [`SET
      PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment").

      The corresponding dynamic privilege is
      [`SYSTEM_VARIABLES_ADMIN`](privileges-provided.html#priv_system-variables-admin).

    - Enables setting restricted session system variables
      that require a special privilege.

      The corresponding dynamic privilege is
      [`SESSION_VARIABLES_ADMIN`](privileges-provided.html#priv_session-variables-admin).

    See also [Section 7.1.9.1, “System Variable Privileges”](system-variable-privileges.html "7.1.9.1 System Variable Privileges").

  + Enables changes to global transaction characteristics
    (see [Section 15.3.7, “SET TRANSACTION Statement”](set-transaction.html "15.3.7 SET TRANSACTION Statement")).

    The corresponding dynamic privilege is
    [`SYSTEM_VARIABLES_ADMIN`](privileges-provided.html#priv_system-variables-admin).

  + Enables the account to start and stop replication,
    including Group Replication.

    The corresponding dynamic privilege is
    [`REPLICATION_SLAVE_ADMIN`](privileges-provided.html#priv_replication-slave-admin)
    for regular replication,
    [`GROUP_REPLICATION_ADMIN`](privileges-provided.html#priv_group-replication-admin)
    for Group Replication.

  + Enables use of [`CHANGE REPLICATION
    SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement") and [`CHANGE
    REPLICATION FILTER`](change-replication-filter.html "15.4.2.1 CHANGE REPLICATION FILTER Statement") statements.

    The corresponding dynamic privilege is
    [`REPLICATION_SLAVE_ADMIN`](privileges-provided.html#priv_replication-slave-admin).

  + Enables binary log control by means of the
    [`PURGE BINARY LOGS`](purge-binary-logs.html "15.4.1.1 PURGE BINARY LOGS Statement") and
    [`BINLOG`](binlog.html "15.7.8.1 BINLOG Statement") statements.

    The corresponding dynamic privilege is
    [`BINLOG_ADMIN`](privileges-provided.html#priv_binlog-admin).

  + Enables setting the effective authorization ID when
    executing a view or stored program. A user with this
    privilege can specify any account in the
    `DEFINER` attribute of a view or stored
    program.

    The corresponding dynamic privileges are
    [`SET_ANY_DEFINER`](privileges-provided.html#priv_set-any-definer) and
    [`ALLOW_NONEXISTENT_DEFINER`](privileges-provided.html#priv_allow-nonexistent-definer).

  + Enables use of the [`CREATE
    SERVER`](create-server.html "15.1.22 CREATE SERVER Statement"), [`ALTER
    SERVER`](alter-server.html "15.1.10 ALTER SERVER Statement"), and [`DROP
    SERVER`](drop-server.html "15.1.35 DROP SERVER Statement") statements.

  + Enables use of the [**mysqladmin debug**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program")
    command.

  + Enables `InnoDB` encryption key
    rotation.

    The corresponding dynamic privilege is
    [`ENCRYPTION_KEY_ADMIN`](privileges-provided.html#priv_encryption-key-admin).

  + Enables execution of deprecated Version Tokens
    functions.

    The corresponding dynamic privilege is
    [`VERSION_TOKEN_ADMIN`](privileges-provided.html#priv_version-token-admin),
    which is deprecated.

  + Enables granting and revoking roles, use of the
    `WITH ADMIN OPTION` clause of the
    [`GRANT`](grant.html "15.7.1.6 GRANT Statement") statement, and
    nonempty `<graphml>` element
    content in the result from the
    [`ROLES_GRAPHML()`](information-functions.html#function_roles-graphml) function.

    The corresponding dynamic privilege is
    [`ROLE_ADMIN`](privileges-provided.html#priv_role-admin).

  + Enables control over client connections not permitted to
    non-[`SUPER`](privileges-provided.html#priv_super) accounts:

    - Enables use of the
      [`KILL`](kill.html "15.7.8.4 KILL Statement") statement or
      [**mysqladmin kill**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") command to kill
      threads belonging to other accounts. (An account can
      always kill its own threads.)

    - The server does not execute
      [`init_connect`](server-system-variables.html#sysvar_init_connect) system
      variable content when
      [`SUPER`](privileges-provided.html#priv_super) clients
      connect.

    - The server accepts one connection from a
      [`SUPER`](privileges-provided.html#priv_super) client even if
      the connection limit configured by the
      [`max_connections`](server-system-variables.html#sysvar_max_connections)
      system variable is reached.

    - A server in offline mode
      ([`offline_mode`](server-system-variables.html#sysvar_offline_mode)
      enabled) does not terminate
      [`SUPER`](privileges-provided.html#priv_super) client
      connections at the next client request, and accepts
      new connections from
      [`SUPER`](privileges-provided.html#priv_super) clients.

    - Updates can be performed even when the
      [`read_only`](server-system-variables.html#sysvar_read_only) system
      variable is enabled. This applies to explicit table
      updates, and to use of account-management statements
      such as [`GRANT`](grant.html "15.7.1.6 GRANT Statement") and
      [`REVOKE`](revoke.html "15.7.1.8 REVOKE Statement") that update
      tables implicitly.

    The corresponding dynamic privilege for the preceding
    connection control operations is
    [`CONNECTION_ADMIN`](privileges-provided.html#priv_connection-admin).

  You may also need the [`SUPER`](privileges-provided.html#priv_super)
  privilege to create or alter stored functions if binary
  logging is enabled, as described in
  [Section 27.9, “Stored Program Binary Logging”](stored-programs-logging.html "27.9 Stored Program Binary Logging").

* [`TRIGGER`](privileges-provided.html#priv_trigger)

  Enables trigger operations. You must have this privilege for
  a table to create, drop, execute, or display triggers for
  that table.

  When a trigger is activated (by a user who has privileges to
  execute [`INSERT`](insert.html "15.2.7 INSERT Statement"),
  [`UPDATE`](update.html "15.2.17 UPDATE Statement"), or
  [`DELETE`](delete.html "15.2.2 DELETE Statement") statements for the
  table associated with the trigger), trigger execution
  requires that the user who defined the trigger still have
  the [`TRIGGER`](privileges-provided.html#priv_trigger) privilege for the
  table.

* [`UPDATE`](privileges-provided.html#priv_update)

  Enables rows to be updated in tables in a database.

* [`USAGE`](privileges-provided.html#priv_usage)

  This privilege specifier stands for “no
  privileges.” It is used at the global level with
  [`GRANT`](grant.html "15.7.1.6 GRANT Statement") to specify clauses such
  as `WITH GRANT OPTION` without naming
  specific account privileges in the privilege list.
  [`SHOW GRANTS`](show-grants.html "15.7.7.23 SHOW GRANTS Statement") displays
  [`USAGE`](privileges-provided.html#priv_usage) to indicate that an
  account has no privileges at a privilege level.

#### Dynamic Privilege Descriptions

Dynamic privileges are defined at runtime, in contrast to static
privileges, which are built in to the server. The following list
describes each dynamic privilege available in MySQL.

Most dynamic privileges are defined at server startup. Others
are defined by a particular component or plugin, as indicated in
the privilege descriptions. In such cases, the privilege is
unavailable unless the component or plugin that defines it is
enabled.

Particular SQL statements might have more specific privilege
requirements than indicated here. If so, the description for the
statement in question provides the details.

* [`ALLOW_NONEXISTENT_DEFINER`](privileges-provided.html#priv_allow-nonexistent-definer)

  Enables overriding security checks designed to prevent
  operations that (perhaps inadvertently) cause stored objects
  to become orphaned or that cause adoption of stored objects
  that are currently orphaned. Without this privilege, any
  attempt to produce an orphaned SQL procedure, function, or
  view results in an error. An attempt to produce orphaned
  objects using [`CREATE
  PROCEDURE`](create-procedure.html "15.1.21 CREATE PROCEDURE and CREATE FUNCTION Statements"), [`CREATE
  FUNCTION`](create-function.html "15.1.16 CREATE FUNCTION Statement"), [`CREATE
  TRIGGER`](create-trigger.html "15.1.26 CREATE TRIGGER Statement"), [`CREATE
  EVENT`](create-event.html "15.1.15 CREATE EVENT Statement"), or [`CREATE
  VIEW`](create-view.html "15.1.27 CREATE VIEW Statement") also requires
  [`SET_ANY_DEFINER`](privileges-provided.html#priv_set-any-definer) in addition
  to [`ALLOW_NONEXISTENT_DEFINER`](privileges-provided.html#priv_allow-nonexistent-definer),
  so that a definer different from the current user is
  permissible.

  For details, see
  [Orphan Stored Objects](stored-objects-security.html#stored-objects-security-orphan-objects "Orphan Stored Objects").

* [`APPLICATION_PASSWORD_ADMIN`](privileges-provided.html#priv_application-password-admin)

  For dual-password capability, this privilege enables use of
  the `RETAIN CURRENT PASSWORD` and
  `DISCARD OLD PASSWORD` clauses for
  [`ALTER USER`](alter-user.html "15.7.1.1 ALTER USER Statement") and
  [`SET PASSWORD`](set-password.html "15.7.1.10 SET PASSWORD Statement") statements that
  apply to your own account. This privilege is required to
  manipulate your own secondary password because most users
  require only one password.

  If an account is to be permitted to manipulate secondary
  passwords for all accounts, it should be granted the
  [`CREATE USER`](privileges-provided.html#priv_create-user) privilege rather
  than
  [`APPLICATION_PASSWORD_ADMIN`](privileges-provided.html#priv_application-password-admin).

  For more information about use of dual passwords, see
  [Section 8.2.15, “Password Management”](password-management.html "8.2.15 Password Management").

* [`AUDIT_ABORT_EXEMPT`](privileges-provided.html#priv_audit-abort-exempt)

  Allows queries blocked by an “abort” item in
  the audit log filter. This privilege is defined by the
  `audit_log` plugin; see
  [Section 8.4.6, “MySQL Enterprise Audit”](audit-log.html "8.4.6 MySQL Enterprise Audit").

  Accounts created with the
  [`SYSTEM_USER`](privileges-provided.html#priv_system-user) privilege have
  the [`AUDIT_ABORT_EXEMPT`](privileges-provided.html#priv_audit-abort-exempt)
  privilege assigned automatically when they are created. The
  [`AUDIT_ABORT_EXEMPT`](privileges-provided.html#priv_audit-abort-exempt) privilege
  is also assigned to existing accounts with the
  [`SYSTEM_USER`](privileges-provided.html#priv_system-user)
  privilege when you carry out an upgrade procedure, if no
  existing accounts have that privilege assigned. Accounts
  with the [`SYSTEM_USER`](privileges-provided.html#priv_system-user)
  privilege can therefore be used to regain access to a system
  following an audit misconfiguration.

* [`AUDIT_ADMIN`](privileges-provided.html#priv_audit-admin)

  Enables audit log configuration. This privilege is defined
  by the `audit_log` plugin; see
  [Section 8.4.6, “MySQL Enterprise Audit”](audit-log.html "8.4.6 MySQL Enterprise Audit").

* [`BACKUP_ADMIN`](privileges-provided.html#priv_backup-admin)

  Enables execution of the [`LOCK INSTANCE
  FOR BACKUP`](lock-instance-for-backup.html "15.3.5 LOCK INSTANCE FOR BACKUP and UNLOCK INSTANCE Statements") statement and access to the Performance
  Schema [`log_status`](performance-schema-log-status-table.html "29.12.22.6 The log_status Table") table.

  Note

  Besides [`BACKUP_ADMIN`](privileges-provided.html#priv_backup-admin), the
  [`SELECT`](privileges-provided.html#priv_select) privilege on the
  [`log_status`](performance-schema-log-status-table.html "29.12.22.6 The log_status Table") table is also
  needed for its access.

  The [`BACKUP_ADMIN`](privileges-provided.html#priv_backup-admin) privilege is
  automatically granted to users with the
  [`RELOAD`](privileges-provided.html#priv_reload) privilege when
  performing an in-place upgrade to MySQL 9.5
  from an earlier version.

* [`AUTHENTICATION_POLICY_ADMIN`](privileges-provided.html#priv_authentication-policy-admin)

  The [`authentication_policy`](server-system-variables.html#sysvar_authentication_policy)
  system variable places certain constraints on how the
  authentication-related clauses of
  [`CREATE USER`](create-user.html "15.7.1.3 CREATE USER Statement") and
  [`ALTER USER`](alter-user.html "15.7.1.1 ALTER USER Statement") statements may be
  used. A user who has the
  [`AUTHENTICATION_POLICY_ADMIN`](privileges-provided.html#priv_authentication-policy-admin)
  privilege is not subject to these constraints. (A warning
  does occur for statements that otherwise would not be
  permitted.)

  For details about the constraints imposed by
  [`authentication_policy`](server-system-variables.html#sysvar_authentication_policy), see
  the description of that variable.

* [`BINLOG_ADMIN`](privileges-provided.html#priv_binlog-admin)

  Enables binary log control by means of the
  [`PURGE BINARY LOGS`](purge-binary-logs.html "15.4.1.1 PURGE BINARY LOGS Statement") and
  [`BINLOG`](binlog.html "15.7.8.1 BINLOG Statement") statements.

* [`BINLOG_ENCRYPTION_ADMIN`](privileges-provided.html#priv_binlog-encryption-admin)

  Enables setting the system variable
  [`binlog_encryption`](replication-options-binary-log.html#sysvar_binlog_encryption), which
  activates or deactivates encryption for binary log files and
  relay log files. This ability is not provided by the
  [`BINLOG_ADMIN`](privileges-provided.html#priv_binlog-admin),
  [`SYSTEM_VARIABLES_ADMIN`](privileges-provided.html#priv_system-variables-admin), or
  [`SESSION_VARIABLES_ADMIN`](privileges-provided.html#priv_session-variables-admin)
  privileges. The related system variable
  [`binlog_rotate_encryption_master_key_at_startup`](replication-options-binary-log.html#sysvar_binlog_rotate_encryption_master_key_at_startup),
  which rotates the binary log master key automatically when
  the server is restarted, does not require this privilege.

* [`CLONE_ADMIN`](privileges-provided.html#priv_clone-admin)

  Enables execution of the `CLONE`
  statements. Includes
  [`BACKUP_ADMIN`](privileges-provided.html#priv_backup-admin) and
  [`SHUTDOWN`](privileges-provided.html#priv_shutdown) privileges.

* [`CONNECTION_ADMIN`](privileges-provided.html#priv_connection-admin)

  Enables use of the [`KILL`](kill.html "15.7.8.4 KILL Statement")
  statement or [**mysqladmin kill**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") command to
  kill threads belonging to other accounts. (An account can
  always kill its own threads.)

  Enables setting system variables related to client
  connections, or circumventing restrictions related to client
  connections. [`CONNECTION_ADMIN`](privileges-provided.html#priv_connection-admin)
  is required to activate MySQL Server’s offline mode, which
  is done by changing the value of the
  [`offline_mode`](server-system-variables.html#sysvar_offline_mode) system
  variable to `ON`.

  The [`CONNECTION_ADMIN`](privileges-provided.html#priv_connection-admin)
  privilege enables administrators with it to bypass effects
  of these system variables:

  + [`init_connect`](server-system-variables.html#sysvar_init_connect): The
    server does not execute
    [`init_connect`](server-system-variables.html#sysvar_init_connect) system
    variable content when
    [`CONNECTION_ADMIN`](privileges-provided.html#priv_connection-admin) clients
    connect.

  + [`max_connections`](server-system-variables.html#sysvar_max_connections): The
    server accepts one connection from a
    [`CONNECTION_ADMIN`](privileges-provided.html#priv_connection-admin) client
    even if the connection limit configured by the
    [`max_connections`](server-system-variables.html#sysvar_max_connections) system
    variable is reached.

  + [`offline_mode`](server-system-variables.html#sysvar_offline_mode): A server
    in offline mode
    ([`offline_mode`](server-system-variables.html#sysvar_offline_mode) enabled)
    does not terminate
    [`CONNECTION_ADMIN`](privileges-provided.html#priv_connection-admin) client
    connections at the next client request, and accepts new
    connections from
    [`CONNECTION_ADMIN`](privileges-provided.html#priv_connection-admin) clients.

  + [`read_only`](server-system-variables.html#sysvar_read_only): Updates from
    [`CONNECTION_ADMIN`](privileges-provided.html#priv_connection-admin) clients
    can be performed even when the
    [`read_only`](server-system-variables.html#sysvar_read_only) system
    variable is enabled. This applies to explicit table
    updates, and to account management statements such as
    [`GRANT`](grant.html "15.7.1.6 GRANT Statement") and
    [`REVOKE`](revoke.html "15.7.1.8 REVOKE Statement") that update tables
    implicitly.

  Group Replication group members need the
  [`CONNECTION_ADMIN`](privileges-provided.html#priv_connection-admin) privilege so
  that Group Replication connections are not terminated if one
  of the servers involved is placed in offline mode. If the
  MySQL communication stack is in use
  ([`group_replication_communication_stack
  = MYSQL`](group-replication-system-variables.html#sysvar_group_replication_communication_stack)), without this privilege, a member that is
  placed in offline mode is expelled from the group.

* [`CREATE_SPATIAL_REFERENCE_SYSTEM`](privileges-provided.html#priv_create-spatial-reference-system)

  Enables use of the statements [`CREATE
  SPATIAL REFERENCE SYSTEM`](create-spatial-reference-system.html "15.1.23 CREATE SPATIAL REFERENCE SYSTEM Statement"), `CREATE OR
  REPLACE SPATIAL REFERENCE SYSTEM`, and
  [`DROP SPATIAL REFERENCE
  SYSTEM`](drop-spatial-reference-system.html "15.1.36 DROP SPATIAL REFERENCE SYSTEM Statement"). Trying to execute any of these statements
  without having this privilege (or the
  [`SUPER`](privileges-provided.html#priv_super) privilege) now raises
  the error
  [`ER_CMD_NEED_SUPER_OR_CREATE_SPATIAL_REFERENCE_SYSTEM`](/doc/mysql-errors/9.5/en/server-error-reference.html#error_er_cmd_need_super_or_create_spatial_reference_system).

  Use of this privilege is intended to supersede the use of
  [`SUPER`](privileges-provided.html#priv_super) for this purpose, which
  should be considered deprecated.

* [`ENCRYPTION_KEY_ADMIN`](privileges-provided.html#priv_encryption-key-admin)

  Enables `InnoDB` encryption key rotation.

* [`EXPORT_QUERY_RESULTS`](privileges-provided.html#priv_export-query-results)

  Allows the user to export query results to an OCI or AWS
  object store.

  Applies to MySQL HeatWave only.

* [`FIREWALL_ADMIN`](privileges-provided.html#priv_firewall-admin)

  Enables a user to administer firewall rules for any user.
  This privilege is defined by the
  `MYSQL_FIREWALL` plugin; see
  [Section 8.4.8, “MySQL Enterprise Firewall”](firewall.html "8.4.8 MySQL Enterprise Firewall").

* [`FIREWALL_EXEMPT`](privileges-provided.html#priv_firewall-exempt)

  A user with this privilege is exempt from firewall
  restrictions. This privilege is defined by the
  `MYSQL_FIREWALL` plugin; see
  [Section 8.4.8, “MySQL Enterprise Firewall”](firewall.html "8.4.8 MySQL Enterprise Firewall").

* [`FIREWALL_USER`](privileges-provided.html#priv_firewall-user)

  Enables users to update their own firewall rules. This
  privilege is defined by the MySQL Enterprise Firewall plugin (see
  [Section 8.4.8.1, “The MySQL Enterprise Firewall Plugin”](firewall-plugin.html "8.4.8.1 The MySQL Enterprise Firewall Plugin")).

  Like the firewall plugin, this privilege is deprecated, and
  thus subject to removal in a future version of MySQL.
  `FIREWALL_USER` is not supported by the
  MySQL Enterprise Firewall component (see [Section 8.4.8.2, “The MySQL Enterprise Firewall Component”](firewall-component.html "8.4.8.2 The MySQL Enterprise Firewall Component")),
  which replaces the plugin.

* [`FLUSH_OPTIMIZER_COSTS`](privileges-provided.html#priv_flush-optimizer-costs)

  Enables use of the [`FLUSH
  OPTIMIZER_COSTS`](flush.html#flush-optimizer-costs) statement.

* [`FLUSH_PRIVILEGES`](privileges-provided.html#priv_flush-privileges)

  Enables use of the [`FLUSH
  PRIVILEGES`](flush.html#flush-privileges) statement.

  Deprecated, along with the [`FLUSH
  PRIVILEGES`](flush.html#flush-privileges) statement; expect this privilege to be
  removed in a future version of MySQL. Granting the
  `FLUSH_PRIVILEGES` privilege triggers a
  deprecation warning.

* [`FLUSH_STATUS`](privileges-provided.html#priv_flush-status)

  Enables use of the [`FLUSH
  STATUS`](flush.html#flush-status) statement.

* [`FLUSH_TABLES`](privileges-provided.html#priv_flush-tables)

  Enables use of the [`FLUSH
  TABLES`](flush.html#flush-tables) statement.

* [`FLUSH_USER_RESOURCES`](privileges-provided.html#priv_flush-user-resources)

  Enables use of the [`FLUSH
  USER_RESOURCES`](flush.html#flush-user-resources) statement.

* [`GROUP_REPLICATION_ADMIN`](privileges-provided.html#priv_group-replication-admin)

  Enables the account to start and stop Group Replication
  using the [`START GROUP
  REPLICATION`](start-group-replication.html "15.4.3.1 START GROUP_REPLICATION Statement") and [`STOP GROUP
  REPLICATION`](stop-group-replication.html "15.4.3.2 STOP GROUP_REPLICATION Statement") statements, to change the global
  setting for the
  [`group_replication_consistency`](group-replication-system-variables.html#sysvar_group_replication_consistency)
  system variable, and to use the
  [`group_replication_set_write_concurrency()`](group-replication-functions-for-maximum-consensus.html#function_group-replication-set-write-concurrency)
  and
  [`group_replication_set_communication_protocol()`](group-replication-functions-for-communication-protocol.html#function_group-replication-set-communication-protocol)
  functions. Grant this privilege to accounts that are used to
  administer servers that are members of a replication group.

* [`GROUP_REPLICATION_STREAM`](privileges-provided.html#priv_group-replication-stream)

  Allows a user account to be used for establishing Group
  Replication's group communication connections. It must be
  granted to a recovery user when the MySQL communication
  stack is used for Group Replication
  ([`group_replication_communication_stack=MYSQL`](group-replication-system-variables.html#sysvar_group_replication_communication_stack)).

* [`INNODB_REDO_LOG_ARCHIVE`](privileges-provided.html#priv_innodb-redo-log-archive)

  Enables the account to activate and deactivate redo log
  archiving.

* [`INNODB_REDO_LOG_ENABLE`](privileges-provided.html#priv_innodb-redo-log-enable)

  Enables use of the
  [`ALTER
  INSTANCE {ENABLE|DISABLE} INNODB REDO_LOG`](alter-instance.html "15.1.5 ALTER INSTANCE Statement")
  statement to enable or disable redo logging.

  See [Disabling Redo Logging](innodb-redo-log.html#innodb-disable-redo-logging "Disabling Redo Logging").

* [`MASKING_DICTIONARIES_ADMIN`](privileges-provided.html#priv_masking-dictionaries-admin)

  Enables the account to add and remove dictionary terms using
  the
  [`masking_dictionary_term_add()`](data-masking-component-functions.html#function_masking-dictionary-term-add)
  and
  [`masking_dictionary_term_remove()`](data-masking-component-functions.html#function_masking-dictionary-term-remove)
  component functions. Accounts also require this dynamic
  privilege to remove a full dictionary using the
  [`masking_dictionary_remove()`](data-masking-component-functions.html#function_masking-dictionary-remove)
  function, which removes all of the terms associated with the
  named dictionary currently in the
  `mysql.masking_dictionaries` table.

  See [Section 8.5, “MySQL Enterprise Data Masking”](data-masking.html "8.5 MySQL Enterprise Data Masking").

* [`NDB_STORED_USER`](privileges-provided.html#priv_ndb-stored-user)

  Enables the user or role and its privileges to be shared and
  synchronized between all `NDB`-enabled
  MySQL servers as soon as they join a given NDB Cluster. This
  privilege is available only if the
  [`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 9.5") storage engine is enabled.

  Any changes to or revocations of privileges made for the
  given user or role are synchronized immediately with all
  connected MySQL servers (SQL nodes). You should be aware
  that there is no guarantee that multiple statements
  affecting privileges originating from different SQL nodes
  are executed on all SQL nodes in the same order. For this
  reason, it is highly recommended that all user
  administration be done from a single designated SQL node.

  `NDB_STORED_USER` is a global privilege and
  must be granted or revoked using `ON *.*`.
  Trying to set any other scope for this privilege results in
  an error. This privilege can be given to most application
  and administrative users, but it cannot be granted to system
  reserved accounts such as
  `mysql.session@localhost` or
  `mysql.infoschema@localhost`.

  A user that has been granted the
  `NDB_STORED_USER` privilege is stored in
  `NDB` (and thus shared by all SQL nodes),
  as is a role with this privilege. A user that is merely
  granted a role that has `NDB_STORED_USER`
  is *not* stored in
  `NDB`; each `NDB` stored
  user must be granted the privilege explicitly.

  For more detailed information about how this works in
  [`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 9.5"), see
  [Section 25.6.13, “Privilege Synchronization and NDB\_STORED\_USER”](mysql-cluster-privilege-synchronization.html "25.6.13 Privilege Synchronization and NDB_STORED_USER").

* [`OPTIMIZE_LOCAL_TABLE`](privileges-provided.html#priv_optimize-local-table)

  Enables use of
  [`OPTIMIZE
  LOCAL TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement") and
  [`OPTIMIZE
  NO_WRITE_TO_BINLOG TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement") statements.

* [`OPTION_TRACKER_OBSERVER`](privileges-provided.html#priv_option-tracker-observer)

  This privilege provides write access to the
  `mysql_option.option_usage` table; both the
  privilege and the table are supplied by the Option Tracker
  component. For more information, see
  [Section 7.5.8, “Option Tracker Component”](option-tracker-component.html "7.5.8 Option Tracker Component").

* [`OPTION_TRACKER_UPDATER`](privileges-provided.html#priv_option-tracker-updater)

  This privilege is required for write access to the
  `mysql_option.option_usage` table; both the
  privilege and the table are supplied by the Option Tracker
  component. For more information, see
  [Section 7.5.8, “Option Tracker Component”](option-tracker-component.html "7.5.8 Option Tracker Component").

* [`PASSWORDLESS_USER_ADMIN`](privileges-provided.html#priv_passwordless-user-admin)

  This privilege applies to passwordless user accounts:

  + For account creation, a user who executes
    [`CREATE USER`](create-user.html "15.7.1.3 CREATE USER Statement") to create a
    passwordless account must possess the
    [`PASSWORDLESS_USER_ADMIN`](privileges-provided.html#priv_passwordless-user-admin)
    privilege.

  + In replication context, the
    [`PASSWORDLESS_USER_ADMIN`](privileges-provided.html#priv_passwordless-user-admin)
    privilege applies to replication users and enables
    replication of
    [`ALTER USER
    ... MODIFY`](alter-user.html "15.7.1.1 ALTER USER Statement") statements for user accounts that
    are configured for passwordless authentication.

  For information about passwordless authentication, see
  [WebAuthn Passwordless Authentication](webauthn-pluggable-authentication.html#webauthn-pluggable-authentication-passwordless "WebAuthn Passwordless Authentication").

* [`PERSIST_RO_VARIABLES_ADMIN`](privileges-provided.html#priv_persist-ro-variables-admin)

  For users who also have
  [`SYSTEM_VARIABLES_ADMIN`](privileges-provided.html#priv_system-variables-admin),
  [`PERSIST_RO_VARIABLES_ADMIN`](privileges-provided.html#priv_persist-ro-variables-admin)
  enables use of
  [`SET
  PERSIST_ONLY`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") to persist global system variables to
  the `mysqld-auto.cnf` option file in the
  data directory. This statement is similar to
  [`SET
  PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") but does not modify the runtime global
  system variable value. This makes
  [`SET
  PERSIST_ONLY`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") suitable for configuring read-only
  system variables that can be set only at server startup.

  See also [Section 7.1.9.1, “System Variable Privileges”](system-variable-privileges.html "7.1.9.1 System Variable Privileges").

* [`REPLICATION_APPLIER`](privileges-provided.html#priv_replication-applier)

  Enables the account to act as the
  `PRIVILEGE_CHECKS_USER` for a replication
  channel, and to execute `BINLOG` statements
  in [**mysqlbinlog**](mysqlbinlog.html "6.6.9 mysqlbinlog — Utility for Processing Binary Log Files") output. Grant this
  privilege to accounts that are assigned using
  [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement")
  to provide a security context for replication channels, and
  to handle replication errors on those channels. As well as
  the `REPLICATION_APPLIER` privilege, you
  must also give the account the required privileges to
  execute the transactions received by the replication channel
  or contained in the [**mysqlbinlog**](mysqlbinlog.html "6.6.9 mysqlbinlog — Utility for Processing Binary Log Files") output,
  for example to update the affected tables. For more
  information, see
  [Section 19.3.3, “Replication Privilege Checks”](replication-privilege-checks.html "19.3.3 Replication Privilege Checks").

* [`REPLICATION_SLAVE_ADMIN`](privileges-provided.html#priv_replication-slave-admin)

  Enables the account to connect to the replication source
  server, start and stop replication using the
  [`START REPLICA`](start-replica.html "15.4.2.4 START REPLICA Statement") and
  [`STOP REPLICA`](stop-replica.html "15.4.2.5 STOP REPLICA Statement") statements, and
  use the [`CHANGE REPLICATION SOURCE
  TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement") and [`CHANGE REPLICATION
  FILTER`](change-replication-filter.html "15.4.2.1 CHANGE REPLICATION FILTER Statement") statements. Grant this privilege to
  accounts that are used by replicas to connect to the current
  server as their replication source server. This privilege
  does not apply to Group Replication; use
  `GROUP_REPLICATION_ADMIN` for that.

* [`RESOURCE_GROUP_ADMIN`](privileges-provided.html#priv_resource-group-admin)

  Enables resource group management, consisting of creating,
  altering, and dropping resource groups, and assignment of
  threads and statements to resource groups. A user with this
  privilege can perform any operation relating to resource
  groups.

* [`RESOURCE_GROUP_USER`](privileges-provided.html#priv_resource-group-user)

  Enables assigning threads and statements to resource groups.
  A user with this privilege can use the
  [`SET RESOURCE GROUP`](set-resource-group.html "15.7.2.4 SET RESOURCE GROUP Statement") statement
  and the [`RESOURCE_GROUP`](optimizer-hints.html#optimizer-hints-resource-group "Resource Group Hint Syntax")
  optimizer hint.

* [`ROLE_ADMIN`](privileges-provided.html#priv_role-admin)

  Enables granting and revoking roles, use of the
  `WITH ADMIN OPTION` clause of the
  [`GRANT`](grant.html "15.7.1.6 GRANT Statement") statement, and nonempty
  `<graphml>` element content in the
  result from the
  [`ROLES_GRAPHML()`](information-functions.html#function_roles-graphml) function.
  Required to set the value of the
  [`mandatory_roles`](server-system-variables.html#sysvar_mandatory_roles) system
  variable.

* [`SENSITIVE_VARIABLES_OBSERVER`](privileges-provided.html#priv_sensitive-variables-observer)

  Enables a holder to view the values of sensitive system
  variables in the Performance Schema tables
  [`global_variables`](performance-schema-system-variable-tables.html "29.12.14 Performance Schema System Variable Tables"),
  [`session_variables`](performance-schema-system-variable-tables.html "29.12.14 Performance Schema System Variable Tables"),
  [`variables_by_thread`](performance-schema-system-variable-tables.html "29.12.14 Performance Schema System Variable Tables"), and
  [`persisted_variables`](performance-schema-persisted-variables-table.html "29.12.14.2 Performance Schema persisted_variables Table"), to issue
  `SELECT` statements to return their values,
  and to track changes to them in session trackers for
  connections. Users without this privilege cannot view or
  track those system variable values. See
  [Persisting Sensitive System Variables](persisted-system-variables.html#persisted-system-variables-sensitive "Persisting Sensitive System Variables").

* [`SERVICE_CONNECTION_ADMIN`](privileges-provided.html#priv_service-connection-admin)

  Enables connections to the network interface that permits
  only administrative connections (see
  [Section 7.1.12.1, “Connection Interfaces”](connection-interfaces.html "7.1.12.1 Connection Interfaces")).

* [`SESSION_VARIABLES_ADMIN`](privileges-provided.html#priv_session-variables-admin)

  For most system variables, setting the session value
  requires no special privileges and can be done by any user
  to affect the current session. For some system variables,
  setting the session value can have effects outside the
  current session and thus is a restricted operation. For
  these, the
  [`SESSION_VARIABLES_ADMIN`](privileges-provided.html#priv_session-variables-admin)
  privilege enables the user to set the session value.

  If a system variable is restricted and requires a special
  privilege to set the session value, the variable description
  indicates that restriction. Examples include
  [`binlog_format`](replication-options-binary-log.html#sysvar_binlog_format),
  [`sql_log_bin`](replication-options-binary-log.html#sysvar_sql_log_bin), and
  [`sql_log_off`](server-system-variables.html#sysvar_sql_log_off).

  The [`SESSION_VARIABLES_ADMIN`](privileges-provided.html#priv_session-variables-admin)
  privilege is a subset of the
  [`SYSTEM_VARIABLES_ADMIN`](privileges-provided.html#priv_system-variables-admin) and
  [`SUPER`](privileges-provided.html#priv_super) privileges. A user who
  has either of those privileges is also permitted to set
  restricted session variables and effectively has
  [`SESSION_VARIABLES_ADMIN`](privileges-provided.html#priv_session-variables-admin) by
  implication and need not be granted
  [`SESSION_VARIABLES_ADMIN`](privileges-provided.html#priv_session-variables-admin)
  explicitly.

  See also [Section 7.1.9.1, “System Variable Privileges”](system-variable-privileges.html "7.1.9.1 System Variable Privileges").

* [`SET_ANY_DEFINER`](privileges-provided.html#priv_set-any-definer)

  Enables setting the effective authorization ID when
  executing a view or stored program. A user with this
  privilege can specify any account as the
  `DEFINER` attribute for
  [`CREATE PROCEDURE`](create-procedure.html "15.1.21 CREATE PROCEDURE and CREATE FUNCTION Statements"),
  [`CREATE FUNCTION`](create-function.html "15.1.16 CREATE FUNCTION Statement"),
  [`CREATE TRIGGER`](create-trigger.html "15.1.26 CREATE TRIGGER Statement"),
  [`CREATE EVENT`](create-event.html "15.1.15 CREATE EVENT Statement"),
  [`ALTER EVENT`](alter-event.html "15.1.3 ALTER EVENT Statement"),
  [`CREATE VIEW`](create-view.html "15.1.27 CREATE VIEW Statement"), and
  [`ALTER VIEW`](alter-view.html "15.1.13 ALTER VIEW Statement"). Without this
  privilege, only the effective authentication ID can be
  specified.

  Stored programs execute with the privileges of the specified
  account, so ensure that you follow the risk minimization
  guidelines listed in
  [Section 27.8, “Stored Object Access Control”](stored-objects-security.html "27.8 Stored Object Access Control").

* [`SHOW_ROUTINE`](privileges-provided.html#priv_show-routine)

  Enables a user to access definitions and properties of all
  stored routines (stored procedures and functions), even
  those for which the user is not named as the routine
  `DEFINER`. This access includes:

  + The contents of the Information Schema
    [`ROUTINES`](information-schema-routines-table.html "28.3.36 The INFORMATION_SCHEMA ROUTINES Table") table.

  + The [`SHOW CREATE FUNCTION`](show-create-function.html "15.7.7.9 SHOW CREATE FUNCTION Statement")
    and [`SHOW CREATE PROCEDURE`](show-create-procedure.html "15.7.7.11 SHOW CREATE PROCEDURE Statement")
    statements.

  + The [`SHOW FUNCTION CODE`](show-function-code.html "15.7.7.21 SHOW FUNCTION CODE Statement")
    and [`SHOW PROCEDURE CODE`](show-procedure-code.html "15.7.7.30 SHOW PROCEDURE CODE Statement")
    statements.

  + The [`SHOW FUNCTION STATUS`](show-function-status.html "15.7.7.22 SHOW FUNCTION STATUS Statement")
    and [`SHOW PROCEDURE STATUS`](show-procedure-status.html "15.7.7.31 SHOW PROCEDURE STATUS Statement")
    statements.

  [`SHOW_ROUTINE`](privileges-provided.html#priv_show-routine) may be granted
  instead as a privilege with a more restricted scope that
  permits access to routine definitions. (That is, an
  administrator can rescind global
  [`SELECT`](privileges-provided.html#priv_select) from users that do not
  otherwise require it and grant
  [`SHOW_ROUTINE`](privileges-provided.html#priv_show-routine) instead.) This
  enables an account to back up stored routines without
  requiring a broad privilege.

* [`SKIP_QUERY_REWRITE`](privileges-provided.html#priv_skip-query-rewrite)

  Queries issued by a user with this privilege are not subject
  to being rewritten by the `Rewriter` plugin
  (see [Section 7.6.4, “The Rewriter Query Rewrite Plugin”](rewriter-query-rewrite-plugin.html "7.6.4 The Rewriter Query Rewrite Plugin")).

  This privilege should be granted to users issuing
  administrative or control statements that should not be
  rewritten, as well as to
  `PRIVILEGE_CHECKS_USER` accounts (see
  [Section 19.3.3, “Replication Privilege Checks”](replication-privilege-checks.html "19.3.3 Replication Privilege Checks")) used to
  apply statements from a replication source.

* [`SYSTEM_USER`](privileges-provided.html#priv_system-user)

  The [`SYSTEM_USER`](privileges-provided.html#priv_system-user) privilege
  distinguishes system users from regular users:

  + A user with the
    [`SYSTEM_USER`](privileges-provided.html#priv_system-user) privilege is
    a system user.

  + A user without the
    [`SYSTEM_USER`](privileges-provided.html#priv_system-user) privilege is
    a regular user.

  The [`SYSTEM_USER`](privileges-provided.html#priv_system-user) privilege has
  an effect on the accounts to which a given user can apply
  its other privileges, as well as whether the user is
  protected from other accounts:

  + A system user can modify both system and regular
    accounts. That is, a user who has the appropriate
    privileges to perform a given operation on regular
    accounts is enabled by possession of
    [`SYSTEM_USER`](privileges-provided.html#priv_system-user) to also
    perform the operation on system accounts. A system
    account can be modified only by system users with
    appropriate privileges, not by regular users.

  + A regular user with appropriate privileges can modify
    regular accounts, but not system accounts. A regular
    account can be modified by both system and regular users
    with appropriate privileges.

  This also means that database objects created by users with
  the [`SYSTEM_USER`](privileges-provided.html#priv_system-user) privilege
  cannot be modified or dropped by users without the
  privilege. This also applies to routines for which the
  definer has this privilege.

  For more information, see
  [Section 8.2.11, “Account Categories”](account-categories.html "8.2.11 Account Categories").

  The protection against modification by regular accounts that
  is afforded to system accounts by the
  [`SYSTEM_USER`](privileges-provided.html#priv_system-user) privilege does
  not apply to regular accounts that have privileges on the
  `mysql` system schema and thus can directly
  modify the grant tables in that schema. For full protection,
  do not grant `mysql` schema privileges to
  regular accounts. See
  [Protecting System Accounts Against Manipulation by Regular Accounts](account-categories.html#protecting-system-accounts "Protecting System Accounts Against Manipulation by Regular Accounts").

  If the `audit_log` plugin is in use (see
  [Section 8.4.6, “MySQL Enterprise Audit”](audit-log.html "8.4.6 MySQL Enterprise Audit")), accounts with the
  [`SYSTEM_USER`](privileges-provided.html#priv_system-user) privilege are
  automatically assigned the
  [`AUDIT_ABORT_EXEMPT`](privileges-provided.html#priv_audit-abort-exempt) privilege,
  which permits their queries to be executed even if an
  “abort” item configured in the filter would
  block them. Accounts with the
  [`SYSTEM_USER`](privileges-provided.html#priv_system-user) privilege can
  therefore be used to regain access to a system following an
  audit misconfiguration.

* [`SYSTEM_VARIABLES_ADMIN`](privileges-provided.html#priv_system-variables-admin)

  Affects the following operations and server behaviors:

  + Enables system variable changes at runtime:

    - Enables server configuration changes to global
      system variables with
      [`SET
      GLOBAL`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") and
      [`SET
      PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment").

    - Enables server configuration changes to global
      system variables with
      [`SET
      PERSIST_ONLY`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment"), if the user also has
      [`PERSIST_RO_VARIABLES_ADMIN`](privileges-provided.html#priv_persist-ro-variables-admin).

    - Enables setting restricted session system variables
      that require a special privilege. In effect,
      [`SYSTEM_VARIABLES_ADMIN`](privileges-provided.html#priv_system-variables-admin)
      implies
      [`SESSION_VARIABLES_ADMIN`](privileges-provided.html#priv_session-variables-admin)
      without explicitly granting
      [`SESSION_VARIABLES_ADMIN`](privileges-provided.html#priv_session-variables-admin).

    See also [Section 7.1.9.1, “System Variable Privileges”](system-variable-privileges.html "7.1.9.1 System Variable Privileges").

  + Enables changes to global transaction characteristics
    (see [Section 15.3.7, “SET TRANSACTION Statement”](set-transaction.html "15.3.7 SET TRANSACTION Statement")).

* [`TABLE_ENCRYPTION_ADMIN`](privileges-provided.html#priv_table-encryption-admin)

  Enables a user to override default encryption settings when
  [`table_encryption_privilege_check`](server-system-variables.html#sysvar_table_encryption_privilege_check)
  is enabled; see
  [Defining an Encryption Default for Schemas and General Tablespaces](innodb-data-encryption.html#innodb-schema-tablespace-encryption-default "Defining an Encryption Default for Schemas and General Tablespaces").

* [`TELEMETRY_LOG_ADMIN`](privileges-provided.html#priv_telemetry-log-admin)

  Enables telemetry log configuration. This privilege is
  defined by the `telemetry_log` plugin,
  which is deployed through MySQL HeatWave on AWS.

* [`TP_CONNECTION_ADMIN`](privileges-provided.html#priv_tp-connection-admin)

  Enables connecting to the server with a privileged
  connection. When the limit defined by
  [`thread_pool_max_transactions_limit`](server-system-variables.html#sysvar_thread_pool_max_transactions_limit)
  has been reached, new connections are not permitted, unless
  overridden by
  [`thread_pool_longrun_trx_limit`](server-system-variables.html#sysvar_thread_pool_longrun_trx_limit).
  A privileged connection ignores the transaction limit and
  permits connecting to the server to increase the transaction
  limit, remove the limit, or kill running transactions. This
  privilege is not granted to any user by default. To
  establish a privileged connection, the user initiating a
  connection must have the
  [`TP_CONNECTION_ADMIN`](privileges-provided.html#priv_tp-connection-admin)
  privilege.

  A privileged connection can execute statements and start
  transactions when the limit defined by
  `thread_pool_max_transactions_limit` has
  been reached. A privileged connection is placed in the
  `Admin` thread group. See
  [Privileged Connections](thread-pool-operation.html#privileged-connections "Privileged Connections").

* [`TRANSACTION_GTID_TAG`](privileges-provided.html#priv_transaction-gtid-tag)

  Required for setting the
  [`gtid_next`](replication-options-gtids.html#sysvar_gtid_next) system variable
  to
  `AUTOMATIC:TAG`
  or
  `UUID:TAG:NUMBER`
  on a replication source server. In addition, at least one of
  [`SYSTEM_VARIABLES_ADMIN`](privileges-provided.html#priv_system-variables-admin),
  [`SESSION_VARIABLES_ADMIN`](privileges-provided.html#priv_session-variables-admin), or
  [`REPLICATION_APPLIER`](privileges-provided.html#priv_replication-applier) is also
  required to set `gtid_next` to one of these
  values on the source.

  The `REPLICATION_CHECKS_APPLIER` must also
  have this privilege as well as the
  `REPLICATION_APPLIER` privilege to set
  `gtid_next` to
  `AUTOMATIC:TAG`.
  This is checked when starting the replication applier
  thread.

  This privilege is also required to set the
  [`gtid_purged`](replication-options-gtids.html#sysvar_gtid_purged) server system
  variable.

  For more information about using tagged GTIDs, see the
  description of [`gtid_next`](replication-options-gtids.html#sysvar_gtid_next),
  as well as [Section 19.1.4, “Changing GTID Mode on Online Servers”](replication-mode-change-online.html "19.1.4 Changing GTID Mode on Online Servers").

* [`VERSION_TOKEN_ADMIN`](privileges-provided.html#priv_version-token-admin)

  Enables execution of Version Tokens functions. This
  privilege is deprecated. It is defined by the
  `version_tokens` plugin (also deprecated);
  see [Version Tokens](/doc/refman/8.4/en/version-tokens.html).

* [`XA_RECOVER_ADMIN`](privileges-provided.html#priv_xa-recover-admin)

  Enables execution of the
  [`XA
  RECOVER`](xa-statements.html "15.3.8.1 XA Transaction SQL Statements") statement; see
  [Section 15.3.8.1, “XA Transaction SQL Statements”](xa-statements.html "15.3.8.1 XA Transaction SQL Statements").

  Prior to MySQL 9.5, any user could execute the
  [`XA
  RECOVER`](xa-statements.html "15.3.8.1 XA Transaction SQL Statements") statement to discover the XID values for
  outstanding prepared XA transactions, possibly leading to
  commit or rollback of an XA transaction by a user other than
  the one who started it. In MySQL 9.5,
  [`XA
  RECOVER`](xa-statements.html "15.3.8.1 XA Transaction SQL Statements") is permitted only to users who have the
  [`XA_RECOVER_ADMIN`](privileges-provided.html#priv_xa-recover-admin) privilege,
  which is expected to be granted only to administrative users
  who have need for it. This might be the case, for example,
  for administrators of an XA application if it has crashed
  and it is necessary to find outstanding transactions started
  by the application so they can be rolled back. This
  privilege requirement prevents users from discovering the
  XID values for outstanding prepared XA transactions other
  than their own. It does not affect normal commit or rollback
  of an XA transaction because the user who started it knows
  its XID.

#### Privilege-Granting Guidelines

It is a good idea to grant to an account only those privileges
that it needs. You should exercise particular caution in
granting the [`FILE`](privileges-provided.html#priv_file) and
administrative privileges:

* [`FILE`](privileges-provided.html#priv_file) can be abused to read
  into a database table any files that the MySQL server can
  read on the server host. This includes all world-readable
  files and files in the server's data directory. The table
  can then be accessed using
  [`SELECT`](select.html "15.2.13 SELECT Statement") to transfer its
  contents to the client host.

* [`GRANT OPTION`](privileges-provided.html#priv_grant-option) enables users to
  give their privileges to other users. Two users that have
  different privileges and with the [`GRANT
  OPTION`](privileges-provided.html#priv_grant-option) privilege are able to combine privileges.

* [`ALTER`](privileges-provided.html#priv_alter) may be used to subvert
  the privilege system by renaming tables.

* [`SHUTDOWN`](privileges-provided.html#priv_shutdown) can be abused to
  deny service to other users entirely by terminating the
  server.

* [`PROCESS`](privileges-provided.html#priv_process) can be used to view
  the plain text of currently executing statements, including
  statements that set or change passwords.

* [`SUPER`](privileges-provided.html#priv_super) can be used to
  terminate other sessions or change how the server operates.

* Privileges granted for the `mysql` system
  database itself can be used to change passwords and other
  access privilege information:

  + Passwords are stored encrypted, so a malicious user
    cannot simply read them to know the plain text password.
    However, a user with write access to the
    `mysql.user` system table
    `authentication_string` column can
    change an account's password, and then connect to the
    MySQL server using that account.

  + [`INSERT`](privileges-provided.html#priv_insert) or
    [`UPDATE`](privileges-provided.html#priv_update) granted for the
    `mysql` system database enable a user
    to add privileges or modify existing privileges,
    respectively.

  + [`DROP`](privileges-provided.html#priv_drop) for the
    `mysql` system database enables a user
    to remote privilege tables, or even the database itself.

#### Static Versus Dynamic Privileges

MySQL supports static and dynamic privileges:

* Static privileges are built in to the server. They are
  always available to be granted to user accounts and cannot
  be unregistered.

* Dynamic privileges can be registered and unregistered at
  runtime. This affects their availability: A dynamic
  privilege that has not been registered cannot be granted.

For example, the [`SELECT`](privileges-provided.html#priv_select) and
[`INSERT`](privileges-provided.html#priv_insert) privileges are static and
always available, whereas a dynamic privilege becomes available
only if the component that implements it has been enabled.

The remainder of this section describes how dynamic privileges
work in MySQL. The discussion uses the term
“components” but applies equally to plugins.

Note

Server administrators should be aware of which server
components define dynamic privileges. For MySQL distributions,
documentation of components that define dynamic privileges
describes those privileges.

Third-party components may also define dynamic privileges; an
administrator should understand those privileges and not
install components that might conflict or compromise server
operation. For example, one component conflicts with another
if both define a privilege with the same name. Component
developers can reduce the likelihood of this occurrence by
choosing privilege names having a prefix based on the
component name.

The server maintains the set of registered dynamic privileges
internally in memory. Unregistration occurs at server shutdown.

Normally, a component that defines dynamic privileges registers
them when it is installed, during its initialization sequence.
When uninstalled, a component does not unregister its registered
dynamic privileges. (This is current practice, not a
requirement. That is, components could, but do not, unregister
at any time privileges they register.)

No warning or error occurs for attempts to register an already
registered dynamic privilege. Consider the following sequence of
statements:

```
INSTALL COMPONENT 'my_component';
UNINSTALL COMPONENT 'my_component';
INSTALL COMPONENT 'my_component';
```

The first [`INSTALL COMPONENT`](install-component.html "15.7.4.3 INSTALL COMPONENT Statement")
statement registers any privileges defined by component
`my_component`, but
[`UNINSTALL COMPONENT`](uninstall-component.html "15.7.4.5 UNINSTALL COMPONENT Statement") does not
unregister them. For the second [`INSTALL
COMPONENT`](install-component.html "15.7.4.3 INSTALL COMPONENT Statement") statement, the component privileges it
registers are found to be already registered, but no warnings or
errors occur.

Dynamic privileges apply only at the global level. The server
stores information about current assignments of dynamic
privileges to user accounts in the
`mysql.global_grants` system table:

* The server automatically registers privileges named in
  `global_grants` during server startup
  (unless the
  [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) option is
  given).

* The [`GRANT`](grant.html "15.7.1.6 GRANT Statement") and
  [`REVOKE`](revoke.html "15.7.1.8 REVOKE Statement") statements modify the
  contents of `global_grants`.

* Dynamic privilege assignments listed in
  `global_grants` are persistent. They are
  not removed at server shutdown.

Example: The following statement grants to user
`u1` the privileges required to control
replication (including Group Replication) on a replica, and to
modify system variables:

```
GRANT REPLICATION_SLAVE_ADMIN, GROUP_REPLICATION_ADMIN, BINLOG_ADMIN
ON *.* TO 'u1'@'localhost';
```

Granted dynamic privileges appear in the output from the
`SHOW GRANTS` statement and the
`INFORMATION_SCHEMA`
[`USER_PRIVILEGES`](information-schema-user-privileges-table.html "28.3.52 The INFORMATION_SCHEMA USER_PRIVILEGES Table") table.

For [`GRANT`](grant.html "15.7.1.6 GRANT Statement") and
[`REVOKE`](revoke.html "15.7.1.8 REVOKE Statement") at the global level, any
named privileges not recognized as static are checked against
the current set of registered dynamic privileges and granted if
found. Otherwise, an error occurs to indicate an unknown
privilege identifier.

For [`GRANT`](grant.html "15.7.1.6 GRANT Statement") and
[`REVOKE`](revoke.html "15.7.1.8 REVOKE Statement") the meaning of
`ALL [PRIVILEGES]` at the global level includes
all static global privileges, as well as all currently
registered dynamic privileges:

* `GRANT ALL` at the global level grants all
  static global privileges and all currently registered
  dynamic privileges. A dynamic privilege registered
  subsequent to execution of the `GRANT`
  statement is not granted retroactively to any account.

* `REVOKE ALL` at the global level revokes
  all granted static global privileges and all granted dynamic
  privileges.

The [`FLUSH PRIVILEGES`](flush.html#flush-privileges) statement
reads the `global_grants` table for dynamic
privilege assignments and registers any unregistered privileges
found there.

For descriptions of the dynamic privileges provided by MySQL
Server and components included in MySQL distributions, see
[Section 8.2.2, “Privileges Provided by MySQL”](privileges-provided.html "8.2.2 Privileges Provided by MySQL").

#### Migrating Accounts from SUPER to Dynamic Privileges

In MySQL 9.5, many operations that previously
required the [`SUPER`](privileges-provided.html#priv_super) privilege are
also associated with a dynamic privilege of more limited scope.
(For descriptions of these privileges, see
[Section 8.2.2, “Privileges Provided by MySQL”](privileges-provided.html "8.2.2 Privileges Provided by MySQL").) Each such operation can
be permitted to an account by granting the associated dynamic
privilege rather than [`SUPER`](privileges-provided.html#priv_super). This
change improves security by enabling DBAs to avoid granting
[`SUPER`](privileges-provided.html#priv_super) and tailor user privileges
more closely to the operations permitted.
[`SUPER`](privileges-provided.html#priv_super) is now deprecated; expect
it to be removed in a future version of MySQL.

When removal of [`SUPER`](privileges-provided.html#priv_super) occurs,
operations that formerly required
[`SUPER`](privileges-provided.html#priv_super) fail unless accounts
granted [`SUPER`](privileges-provided.html#priv_super) are migrated to the
appropriate dynamic privileges. Use the following instructions
to accomplish that goal so that accounts are ready prior to
[`SUPER`](privileges-provided.html#priv_super) removal:

1. Execute this query to identify accounts that are granted
   [`SUPER`](privileges-provided.html#priv_super):

   ```
   SELECT GRANTEE FROM INFORMATION_SCHEMA.USER_PRIVILEGES
   WHERE PRIVILEGE_TYPE = 'SUPER';
   ```

2. For each account identified by the preceding query,
   determine the operations for which it needs
   [`SUPER`](privileges-provided.html#priv_super). Then grant the dynamic
   privileges corresponding to those operations, and revoke
   [`SUPER`](privileges-provided.html#priv_super).

   For example, if `'u1'@'localhost'` requires
   [`SUPER`](privileges-provided.html#priv_super) for binary log purging
   and system variable modification, these statements make the
   required changes to the account:

   ```
   GRANT BINLOG_ADMIN, SYSTEM_VARIABLES_ADMIN ON *.* TO 'u1'@'localhost';
   REVOKE SUPER ON *.* FROM 'u1'@'localhost';
   ```

   After you have modified all applicable accounts, the
   `INFORMATION_SCHEMA` query in the first
   step should produce an empty result set.