#### 13.7.1.4 GRANT Statement

```sql
GRANT
    priv_type [(column_list)]
      [, priv_type [(column_list) ...
    ON [object_type] priv_level
    TO user [auth_option] [, user [auth_option ...
    [REQUIRE {NONE | tls_option AND] tls_option] ...}]
    [WITH {GRANT OPTION | resource_option} ...]

GRANT PROXY ON user
    TO user [, user] ...
    [WITH GRANT OPTION]

object_type: {
    TABLE
  | FUNCTION
  | PROCEDURE
}

priv_level: {
    *
  | *.*
  | db_name.*
  | db_name.tbl_name
  | tbl_name
  | db_name.routine_name
}

user:
    (see Section 6.2.4, “Specifying Account Names”)

auth_option: {
    IDENTIFIED BY 'auth_string'
  | IDENTIFIED WITH auth_plugin
  | IDENTIFIED WITH auth_plugin BY 'auth_string'
  | IDENTIFIED WITH auth_plugin AS 'auth_string'
  | IDENTIFIED BY PASSWORD 'auth_string'
}

tls_option: {
    SSL
  | X509
  | CIPHER 'cipher'
  | ISSUER 'issuer'
  | SUBJECT 'subject'
}

resource_option: {
  | MAX_QUERIES_PER_HOUR count
  | MAX_UPDATES_PER_HOUR count
  | MAX_CONNECTIONS_PER_HOUR count
  | MAX_USER_CONNECTIONS count
}
```

The [`GRANT`](grant.html "13.7.1.4 GRANT Statement") statement grants privileges to MySQL user accounts. There are several aspects to the [`GRANT`](grant.html "13.7.1.4 GRANT Statement") statement, described under the following topics:

* [GRANT General Overview](grant.html#grant-overview "GRANT General Overview")
* [Object Quoting Guidelines](grant.html#grant-quoting "Object Quoting Guidelines")
* [Privileges Supported by MySQL](grant.html#grant-privileges "Privileges Supported by MySQL")
* [Account Names and Passwords](grant.html#grant-accounts-passwords "Account Names and Passwords")
* [Global Privileges](grant.html#grant-global-privileges "Global Privileges")
* [Database Privileges](grant.html#grant-database-privileges "Database Privileges")
* [Table Privileges](grant.html#grant-table-privileges "Table Privileges")
* [Column Privileges](grant.html#grant-column-privileges "Column Privileges")
* [Stored Routine Privileges](grant.html#grant-routine-privileges "Stored Routine Privileges")
* [Proxy User Privileges](grant.html#grant-proxy-privileges "Proxy User Privileges")
* [Implicit Account Creation](grant.html#grant-account-creation "Implicit Account Creation")
* [Other Account Characteristics](grant.html#grant-other-characteristics "Other Account Characteristics")
* [MySQL and Standard SQL Versions of GRANT](grant.html#grant-mysql-vs-standard-sql "MySQL and Standard SQL Versions of GRANT")

##### GRANT General Overview

The [`GRANT`](grant.html "13.7.1.4 GRANT Statement") statement grants privileges to MySQL user accounts.

To grant a privilege with [`GRANT`](grant.html "13.7.1.4 GRANT Statement"), you must have the [`GRANT OPTION`](privileges-provided.html#priv_grant-option) privilege, and you must have the privileges that you are granting. (Alternatively, if you have the [`UPDATE`](privileges-provided.html#priv_update) privilege for the grant tables in the `mysql` system database, you can grant any account any privilege.) When the [`read_only`](server-system-variables.html#sysvar_read_only) system variable is enabled, [`GRANT`](grant.html "13.7.1.4 GRANT Statement") additionally requires the [`SUPER`](privileges-provided.html#priv_super) privilege.

The [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement") statement is related to [`GRANT`](grant.html "13.7.1.4 GRANT Statement") and enables administrators to remove account privileges. See [Section 13.7.1.6, “REVOKE Statement”](revoke.html "13.7.1.6 REVOKE Statement").

Each account name uses the format described in [Section 6.2.4, “Specifying Account Names”](account-names.html "6.2.4 Specifying Account Names"). For example:

```sql
GRANT ALL ON db1.* TO 'jeffrey'@'localhost';
```

The host name part of the account, if omitted, defaults to `'%'`.

Normally, a database administrator first uses [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") to create an account and define its nonprivilege characteristics such as its password, whether it uses secure connections, and limits on access to server resources, then uses [`GRANT`](grant.html "13.7.1.4 GRANT Statement") to define its privileges. [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") may be used to change the nonprivilege characteristics of existing accounts. For example:

```sql
CREATE USER 'jeffrey'@'localhost' IDENTIFIED BY 'password';
GRANT ALL ON db1.* TO 'jeffrey'@'localhost';
GRANT SELECT ON db2.invoice TO 'jeffrey'@'localhost';
ALTER USER 'jeffrey'@'localhost' WITH MAX_QUERIES_PER_HOUR 90;
```

Note

Examples shown here include no `IDENTIFIED` clause. It is assumed that you establish passwords with [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") at account-creation time to avoid creating insecure accounts.

Note

If an account named in a [`GRANT`](grant.html "13.7.1.4 GRANT Statement") statement does not already exist, [`GRANT`](grant.html "13.7.1.4 GRANT Statement") may create it under the conditions described later in the discussion of the [`NO_AUTO_CREATE_USER`](sql-mode.html#sqlmode_no_auto_create_user) SQL mode. It is also possible to use [`GRANT`](grant.html "13.7.1.4 GRANT Statement") to specify nonprivilege account characteristics such as whether it uses secure connections and limits on access to server resources.

However, use of [`GRANT`](grant.html "13.7.1.4 GRANT Statement") to create accounts or define nonprivilege characteristics is deprecated in MySQL 5.7. Instead, perform these tasks using [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") or [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement").

From the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") program, [`GRANT`](grant.html "13.7.1.4 GRANT Statement") responds with `Query OK, 0 rows affected` when executed successfully. To determine what privileges result from the operation, use [`SHOW GRANTS`](show-grants.html "13.7.5.21 SHOW GRANTS Statement"). See [Section 13.7.5.21, “SHOW GRANTS Statement”](show-grants.html "13.7.5.21 SHOW GRANTS Statement").

Important

Under some circumstances, [`GRANT`](grant.html "13.7.1.4 GRANT Statement") may be recorded in server logs or on the client side in a history file such as `~/.mysql_history`, which means that cleartext passwords may be read by anyone having read access to that information. For information about the conditions under which this occurs for the server logs and how to control it, see [Section 6.1.2.3, “Passwords and Logging”](password-logging.html "6.1.2.3 Passwords and Logging"). For similar information about client-side logging, see [Section 4.5.1.3, “mysql Client Logging”](mysql-logging.html "4.5.1.3 mysql Client Logging").

[`GRANT`](grant.html "13.7.1.4 GRANT Statement") supports host names up to 60 characters long. User names can be up to 32 characters. Database, table, column, and routine names can be up to 64 characters.

Warning

*Do not attempt to change the permissible length for user names by altering the `mysql.user` system table. Doing so results in unpredictable behavior which may even make it impossible for users to log in to the MySQL server*. Never alter the structure of tables in the `mysql` system database in any manner except by means of the procedure described in [Section 2.10, “Upgrading MySQL”](upgrading.html "2.10 Upgrading MySQL").

##### Object Quoting Guidelines

Several objects within [`GRANT`](grant.html "13.7.1.4 GRANT Statement") statements are subject to quoting, although quoting is optional in many cases: Account, database, table, column, and routine names. For example, if a *`user_name`* or *`host_name`* value in an account name is legal as an unquoted identifier, you need not quote it. However, quotation marks are necessary to specify a *`user_name`* string containing special characters (such as `-`), or a *`host_name`* string containing special characters or wildcard characters such as `%` (for example, `'test-user'@'%.com'`). Quote the user name and host name separately.

To specify quoted values:

* Quote database, table, column, and routine names as identifiers.

* Quote user names and host names as identifiers or as strings.

* Quote passwords as strings.

For string-quoting and identifier-quoting guidelines, see [Section 9.1.1, “String Literals”](string-literals.html "9.1.1 String Literals"), and [Section 9.2, “Schema Object Names”](identifiers.html "9.2 Schema Object Names").

The `_` and `%` wildcards are permitted when specifying database names in [`GRANT`](grant.html "13.7.1.4 GRANT Statement") statements that grant privileges at the database level (`GRANT ... ON db_name.*`). This means, for example, that to use a `_` character as part of a database name, specify it using the `\` escape character as `_` in the [`GRANT`](grant.html "13.7.1.4 GRANT Statement") statement, to prevent the user from being able to access additional databases matching the wildcard pattern (for example, `` GRANT ... ON `foo_bar`.* TO ... ``).

Issuing multiple `GRANT` statements containing wildcards may not have the expected effect on DML statements; when resolving grants involving wildcards, MySQL takes only the first matching grant into consideration. In other words, if a user has two database-level grants using wildcards that match the same database, the grant which was created first is applied. Consider the database `db` and table `t` created using the statements shown here:

```sql
mysql> CREATE DATABASE db;
Query OK, 1 row affected (0.01 sec)

mysql> CREATE TABLE db.t (c INT);
Query OK, 0 rows affected (0.01 sec)

mysql> INSERT INTO db.t VALUES ROW(1);
Query OK, 1 row affected (0.00 sec)
```

Next (assuming that the current account is the MySQL `root` account or another account having the necessary privileges), we create a user `u` then issue two `GRANT` statements containing wildcards, like this:

```sql
mysql> CREATE USER u;
Query OK, 0 rows affected (0.01 sec)

mysql> GRANT SELECT ON `d_`.* TO u;
Query OK, 0 rows affected (0.01 sec)

mysql> GRANT INSERT ON `d%`.* TO u;
Query OK, 0 rows affected (0.00 sec)

mysql> EXIT
```

```sql
Bye
```

If we end the session and then log in again with the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client, this time as **u**, we see that this account has only the privilege provided by the first matching grant, but not the second:

```sql
$> mysql -uu -hlocalhost
```

```sql
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 10
Server version: 5.7.52-tr Source distribution

Copyright (c) 2000, 2023, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input
statement.

mysql> TABLE db.t;
+------+
| c    |
+------+
|    1 |
+------+
1 row in set (0.00 sec)

mysql> INSERT INTO db.t VALUES ROW(2);
ERROR 1142 (42000): INSERT command denied to user 'u'@'localhost' for table 't'
```

When a database name is not used to grant privileges at the database level, but as a qualifier for granting privileges to some other object such as a table or routine (for example, `GRANT ... ON db_name.tbl_name`), MySQL interprets wildcard characters as literal characters.

##### Privileges Supported by MySQL

The following table summarizes the permissible *`priv_type`* privilege types that can be specified for the [`GRANT`](grant.html "13.7.1.4 GRANT Statement") and [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement") statements, and the levels at which each privilege can be granted. For additional information about each privilege, see [Section 6.2.2, “Privileges Provided by MySQL”](privileges-provided.html "6.2.2 Privileges Provided by MySQL").

**Table 13.8 Permissible Privileges for GRANT and REVOKE**

<table><thead><tr> <th>Privilege</th> <th>Meaning and Grantable Levels</th> </tr></thead><tbody><tr> <td><code>ALL [PRIVILEGES]</code></td> <td>Grant all privileges at specified access level except <code>GRANT OPTION</code> and <code>PROXY</code>.</td> </tr><tr> <td><code>ALTER</code></td> <td>Enable use of <code>ALTER TABLE</code>. Levels: Global, database, table.</td> </tr><tr> <td><code>ALTER ROUTINE</code></td> <td>Enable stored routines to be altered or dropped. Levels: Global, database, routine.</td> </tr><tr> <td><code>CREATE</code></td> <td>Enable database and table creation. Levels: Global, database, table.</td> </tr><tr> <td><code>CREATE ROUTINE</code></td> <td>Enable stored routine creation. Levels: Global, database.</td> </tr><tr> <td><code>CREATE TABLESPACE</code></td> <td>Enable tablespaces and log file groups to be created, altered, or dropped. Level: Global.</td> </tr><tr> <td><code>CREATE TEMPORARY TABLES</code></td> <td>Enable use of <code>CREATE TEMPORARY TABLE</code>. Levels: Global, database.</td> </tr><tr> <td><code>CREATE USER</code></td> <td>Enable use of <code>CREATE USER</code>, <code>DROP USER</code>, <code>RENAME USER</code>, and <code>REVOKE ALL PRIVILEGES</code>. Level: Global.</td> </tr><tr> <td><code>CREATE VIEW</code></td> <td>Enable views to be created or altered. Levels: Global, database, table.</td> </tr><tr> <td><code>DELETE</code></td> <td>Enable use of <code>DELETE</code>. Level: Global, database, table.</td> </tr><tr> <td><code>DROP</code></td> <td>Enable databases, tables, and views to be dropped. Levels: Global, database, table.</td> </tr><tr> <td><code>EVENT</code></td> <td>Enable use of events for the Event Scheduler. Levels: Global, database.</td> </tr><tr> <td><code>EXECUTE</code></td> <td>Enable the user to execute stored routines. Levels: Global, database, routine.</td> </tr><tr> <td><code>FILE</code></td> <td>Enable the user to cause the server to read or write files. Level: Global.</td> </tr><tr> <td><code>GRANT OPTION</code></td> <td>Enable privileges to be granted to or removed from other accounts. Levels: Global, database, table, routine, proxy.</td> </tr><tr> <td><code>INDEX</code></td> <td>Enable indexes to be created or dropped. Levels: Global, database, table.</td> </tr><tr> <td><code>INSERT</code></td> <td>Enable use of <code>INSERT</code>. Levels: Global, database, table, column.</td> </tr><tr> <td><code>LOCK TABLES</code></td> <td>Enable use of <code>LOCK TABLES</code> on tables for which you have the <code>SELECT</code> privilege. Levels: Global, database.</td> </tr><tr> <td><code>PROCESS</code></td> <td>Enable the user to see all processes with <code>SHOW PROCESSLIST</code>. Level: Global.</td> </tr><tr> <td><code>PROXY</code></td> <td>Enable user proxying. Level: From user to user.</td> </tr><tr> <td><code>REFERENCES</code></td> <td>Enable foreign key creation. Levels: Global, database, table, column.</td> </tr><tr> <td><code>RELOAD</code></td> <td>Enable use of <code>FLUSH</code> operations. Level: Global.</td> </tr><tr> <td><code>REPLICATION CLIENT</code></td> <td>Enable the user to ask where source or replica servers are. Level: Global.</td> </tr><tr> <td><code>REPLICATION SLAVE</code></td> <td>Enable replicas to read binary log events from the source. Level: Global.</td> </tr><tr> <td><code>SELECT</code></td> <td>Enable use of <code>SELECT</code>. Levels: Global, database, table, column.</td> </tr><tr> <td><code>SHOW DATABASES</code></td> <td>Enable <code>SHOW DATABASES</code> to show all databases. Level: Global.</td> </tr><tr> <td><code>SHOW VIEW</code></td> <td>Enable use of <code>SHOW CREATE VIEW</code>. Levels: Global, database, table.</td> </tr><tr> <td><code>SHUTDOWN</code></td> <td>Enable use of <span><strong>mysqladmin shutdown</strong></span>. Level: Global.</td> </tr><tr> <td><code>SUPER</code></td> <td>Enable use of other administrative operations such as <code>CHANGE MASTER TO</code>, <code>KILL</code>, <code>PURGE BINARY LOGS</code>, <code>SET GLOBAL</code>, and <span><strong>mysqladmin debug</strong></span> command. Level: Global.</td> </tr><tr> <td><code>TRIGGER</code></td> <td>Enable trigger operations. Levels: Global, database, table.</td> </tr><tr> <td><code>UPDATE</code></td> <td>Enable use of <code>UPDATE</code>. Levels: Global, database, table, column.</td> </tr><tr> <td><code>USAGE</code></td> <td>Synonym for <span class="quote">“<span class="quote">no privileges</span>”</span></td> </tr></tbody></table>

A trigger is associated with a table. To create or drop a trigger, you must have the [`TRIGGER`](privileges-provided.html#priv_trigger) privilege for the table, not the trigger.

In [`GRANT`](grant.html "13.7.1.4 GRANT Statement") statements, the [`ALL [PRIVILEGES]`](privileges-provided.html#priv_all) or [`PROXY`](privileges-provided.html#priv_proxy) privilege must be named by itself and cannot be specified along with other privileges. [`ALL [PRIVILEGES]`](privileges-provided.html#priv_all) stands for all privileges available for the level at which privileges are to be granted except for the [`GRANT OPTION`](privileges-provided.html#priv_grant-option) and [`PROXY`](privileges-provided.html#priv_proxy) privileges.

[`USAGE`](privileges-provided.html#priv_usage) can be specified to create a user that has no privileges, or to specify the `REQUIRE` or `WITH` clauses for an account without changing its existing privileges. (However, use of [`GRANT`](grant.html "13.7.1.4 GRANT Statement") to define nonprivilege characteristics is deprecated.

MySQL account information is stored in the tables of the `mysql` system database. For additional details, consult [Section 6.2, “Access Control and Account Management”](access-control.html "6.2 Access Control and Account Management"), which discusses the `mysql` system database and the access control system extensively.

If the grant tables hold privilege rows that contain mixed-case database or table names and the [`lower_case_table_names`](server-system-variables.html#sysvar_lower_case_table_names) system variable is set to a nonzero value, [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement") cannot be used to revoke these privileges. It is necessary to manipulate the grant tables directly. ([`GRANT`](grant.html "13.7.1.4 GRANT Statement") does not create such rows when [`lower_case_table_names`](server-system-variables.html#sysvar_lower_case_table_names) is set, but such rows might have been created prior to setting that variable.)

Privileges can be granted at several levels, depending on the syntax used for the `ON` clause. For [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement"), the same `ON` syntax specifies which privileges to remove.

For the global, database, table, and routine levels, [`GRANT ALL`](grant.html "13.7.1.4 GRANT Statement") assigns only the privileges that exist at the level you are granting. For example, `GRANT ALL ON db_name.*` is a database-level statement, so it does not grant any global-only privileges such as [`FILE`](privileges-provided.html#priv_file). Granting [`ALL`](privileges-provided.html#priv_all) does not assign the [`GRANT OPTION`](privileges-provided.html#priv_grant-option) or [`PROXY`](privileges-provided.html#priv_proxy) privilege.

The *`object_type`* clause, if present, should be specified as `TABLE`, `FUNCTION`, or `PROCEDURE` when the following object is a table, a stored function, or a stored procedure.

The privileges that a user holds for a database, table, column, or routine are formed additively as the logical [`OR`](logical-operators.html#operator_or) of the account privileges at each of the privilege levels, including the global level. It is not possible to deny a privilege granted at a higher level by absence of that privilege at a lower level. For example, this statement grants the [`SELECT`](privileges-provided.html#priv_select) and [`INSERT`](privileges-provided.html#priv_insert) privileges globally:

```sql
GRANT SELECT, INSERT ON *.* TO u1;
```

The globally granted privileges apply to all databases, tables, and columns, even though not granted at any of those lower levels.

Details of the privilege-checking procedure are presented in [Section 6.2.6, “Access Control, Stage 2: Request Verification”](request-access.html "6.2.6 Access Control, Stage 2: Request Verification").

If you are using table, column, or routine privileges for even one user, the server examines table, column, and routine privileges for all users and this slows down MySQL a bit. Similarly, if you limit the number of queries, updates, or connections for any users, the server must monitor these values.

MySQL enables you to grant privileges on databases or tables that do not exist. For tables, the privileges to be granted must include the [`CREATE`](privileges-provided.html#priv_create) privilege. *This behavior is by design*, and is intended to enable the database administrator to prepare user accounts and privileges for databases or tables that are to be created at a later time.

Important

*MySQL does not automatically revoke any privileges when you drop a database or table*. However, if you drop a routine, any routine-level privileges granted for that routine are revoked.

##### Account Names and Passwords

A *`user`* value in a [`GRANT`](grant.html "13.7.1.4 GRANT Statement") statement indicates a MySQL account to which the statement applies. To accommodate granting rights to users from arbitrary hosts, MySQL supports specifying the *`user`* value in the form `'user_name'@'host_name'`.

You can specify wildcards in the host name. For example, `'user_name'@'%.example.com'` applies to *`user_name`* for any host in the `example.com` domain, and `'user_name'@'198.51.100.%'` applies to *`user_name`* for any host in the `198.51.100` class C subnet.

The simple form `'user_name'` is a synonym for `'user_name'@'%'`.

*MySQL does not support wildcards in user names*. To refer to an anonymous user, specify an account with an empty user name with the [`GRANT`](grant.html "13.7.1.4 GRANT Statement") statement:

```sql
GRANT ALL ON test.* TO ''@'localhost' ...;
```

In this case, any user who connects from the local host with the correct password for the anonymous user is permitted access, with the privileges associated with the anonymous user account.

For additional information about user name and host name values in account names, see [Section 6.2.4, “Specifying Account Names”](account-names.html "6.2.4 Specifying Account Names").

Warning

If you permit local anonymous users to connect to the MySQL server, you should also grant privileges to all local users as `'user_name'@'localhost'`. Otherwise, the anonymous user account for `localhost` in the `mysql.user` system table is used when named users try to log in to the MySQL server from the local machine. For details, see [Section 6.2.5, “Access Control, Stage 1: Connection Verification”](connection-access.html "6.2.5 Access Control, Stage 1: Connection Verification").

To determine whether this issue applies to you, execute the following query, which lists any anonymous users:

```sql
SELECT Host, User FROM mysql.user WHERE User='';
```

To avoid the problem just described, delete the local anonymous user account using this statement:

```sql
DROP USER ''@'localhost';
```

For [`GRANT`](grant.html "13.7.1.4 GRANT Statement") syntax that permits an *`auth_option`* value to follow a *`user`* value, *`auth_option`* begins with `IDENTIFIED` and indicates how the account authenticates by specifying an account authentication plugin, credentials (for example, a password), or both. Syntax of the *`auth_option`* clause is the same as for the [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") statement. For details, see [Section 13.7.1.2, “CREATE USER Statement”](create-user.html "13.7.1.2 CREATE USER Statement").

Note

Use of [`GRANT`](grant.html "13.7.1.4 GRANT Statement") to define account authentication characteristics is deprecated in MySQL 5.7. Instead, establish or change authentication characteristics using [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") or [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement"). Expect this [`GRANT`](grant.html "13.7.1.4 GRANT Statement") capability to be removed in a future MySQL release.

When `IDENTIFIED` is present and you have the global grant privilege ([`GRANT OPTION`](privileges-provided.html#priv_grant-option)), any password specified becomes the new password for the account, even if the account exists and already has a password. Without `IDENTIFIED`, the account password remains unchanged.

##### Global Privileges

Global privileges are administrative or apply to all databases on a given server. To assign global privileges, use `ON *.*` syntax:

```sql
GRANT ALL ON *.* TO 'someuser'@'somehost';
GRANT SELECT, INSERT ON *.* TO 'someuser'@'somehost';
```

The [`CREATE TABLESPACE`](privileges-provided.html#priv_create-tablespace), [`CREATE USER`](privileges-provided.html#priv_create-user), [`FILE`](privileges-provided.html#priv_file), [`PROCESS`](privileges-provided.html#priv_process), [`RELOAD`](privileges-provided.html#priv_reload), [`REPLICATION CLIENT`](privileges-provided.html#priv_replication-client), [`REPLICATION SLAVE`](privileges-provided.html#priv_replication-slave), [`SHOW DATABASES`](privileges-provided.html#priv_show-databases), [`SHUTDOWN`](privileges-provided.html#priv_shutdown), and [`SUPER`](privileges-provided.html#priv_super) privileges are administrative and can only be granted globally.

Other privileges can be granted globally or at more specific levels.

[`GRANT OPTION`](privileges-provided.html#priv_grant-option) granted at the global level for any global privilege applies to all global privileges.

MySQL stores global privileges in the `mysql.user` system table.

##### Database Privileges

Database privileges apply to all objects in a given database. To assign database-level privileges, use `ON db_name.*` syntax:

```sql
GRANT ALL ON mydb.* TO 'someuser'@'somehost';
GRANT SELECT, INSERT ON mydb.* TO 'someuser'@'somehost';
```

If you use `ON *` syntax (rather than `ON *.*`), privileges are assigned at the database level for the default database. An error occurs if there is no default database.

The [`CREATE`](privileges-provided.html#priv_create), [`DROP`](privileges-provided.html#priv_drop), [`EVENT`](privileges-provided.html#priv_event), [`GRANT OPTION`](privileges-provided.html#priv_grant-option), [`LOCK TABLES`](privileges-provided.html#priv_lock-tables), and [`REFERENCES`](privileges-provided.html#priv_references) privileges can be specified at the database level. Table or routine privileges also can be specified at the database level, in which case they apply to all tables or routines in the database.

MySQL stores database privileges in the `mysql.db` system table.

##### Table Privileges

Table privileges apply to all columns in a given table. To assign table-level privileges, use `ON db_name.tbl_name` syntax:

```sql
GRANT ALL ON mydb.mytbl TO 'someuser'@'somehost';
GRANT SELECT, INSERT ON mydb.mytbl TO 'someuser'@'somehost';
```

If you specify *`tbl_name`* rather than *`db_name.tbl_name`*, the statement applies to *`tbl_name`* in the default database. An error occurs if there is no default database.

The permissible *`priv_type`* values at the table level are [`ALTER`](privileges-provided.html#priv_alter), [`CREATE VIEW`](privileges-provided.html#priv_create-view), [`CREATE`](privileges-provided.html#priv_create), [`DELETE`](privileges-provided.html#priv_delete), [`DROP`](privileges-provided.html#priv_drop), [`GRANT OPTION`](privileges-provided.html#priv_grant-option), [`INDEX`](privileges-provided.html#priv_index), [`INSERT`](privileges-provided.html#priv_insert), [`REFERENCES`](privileges-provided.html#priv_references), [`SELECT`](privileges-provided.html#priv_select), [`SHOW VIEW`](privileges-provided.html#priv_show-view), [`TRIGGER`](privileges-provided.html#priv_trigger), and [`UPDATE`](privileges-provided.html#priv_update).

Table-level privileges apply to base tables and views. They do not apply to tables created with [`CREATE TEMPORARY TABLE`](create-temporary-table.html "13.1.18.2 CREATE TEMPORARY TABLE Statement"), even if the table names match. For information about `TEMPORARY` table privileges, see [Section 13.1.18.2, “CREATE TEMPORARY TABLE Statement”](create-temporary-table.html "13.1.18.2 CREATE TEMPORARY TABLE Statement").

MySQL stores table privileges in the `mysql.tables_priv` system table.

##### Column Privileges

Column privileges apply to single columns in a given table. Each privilege to be granted at the column level must be followed by the column or columns, enclosed within parentheses.

```sql
GRANT SELECT (col1), INSERT (col1, col2) ON mydb.mytbl TO 'someuser'@'somehost';
```

The permissible *`priv_type`* values for a column (that is, when you use a *`column_list`* clause) are [`INSERT`](privileges-provided.html#priv_insert), [`REFERENCES`](privileges-provided.html#priv_references), [`SELECT`](privileges-provided.html#priv_select), and [`UPDATE`](privileges-provided.html#priv_update).

MySQL stores column privileges in the `mysql.columns_priv` system table.

##### Stored Routine Privileges

The [`ALTER ROUTINE`](privileges-provided.html#priv_alter-routine), [`CREATE ROUTINE`](privileges-provided.html#priv_create-routine), [`EXECUTE`](privileges-provided.html#priv_execute), and [`GRANT OPTION`](privileges-provided.html#priv_grant-option) privileges apply to stored routines (procedures and functions). They can be granted at the global and database levels. Except for [`CREATE ROUTINE`](privileges-provided.html#priv_create-routine), these privileges can be granted at the routine level for individual routines.

```sql
GRANT CREATE ROUTINE ON mydb.* TO 'someuser'@'somehost';
GRANT EXECUTE ON PROCEDURE mydb.myproc TO 'someuser'@'somehost';
```

The permissible *`priv_type`* values at the routine level are [`ALTER ROUTINE`](privileges-provided.html#priv_alter-routine), [`EXECUTE`](privileges-provided.html#priv_execute), and [`GRANT OPTION`](privileges-provided.html#priv_grant-option). [`CREATE ROUTINE`](privileges-provided.html#priv_create-routine) is not a routine-level privilege because you must have the privilege at the global or database level to create a routine in the first place.

MySQL stores routine-level privileges in the `mysql.procs_priv` system table.

##### Proxy User Privileges

The [`PROXY`](privileges-provided.html#priv_proxy) privilege enables one user to be a proxy for another. The proxy user impersonates or takes the identity of the proxied user; that is, it assumes the privileges of the proxied user.

```sql
GRANT PROXY ON 'localuser'@'localhost' TO 'externaluser'@'somehost';
```

When [`PROXY`](privileges-provided.html#priv_proxy) is granted, it must be the only privilege named in the [`GRANT`](grant.html "13.7.1.4 GRANT Statement") statement, the `REQUIRE` clause cannot be given, and the only permitted `WITH` option is `WITH GRANT OPTION`.

Proxying requires that the proxy user authenticate through a plugin that returns the name of the proxied user to the server when the proxy user connects, and that the proxy user have the `PROXY` privilege for the proxied user. For details and examples, see [Section 6.2.14, “Proxy Users”](proxy-users.html "6.2.14 Proxy Users").

MySQL stores proxy privileges in the `mysql.proxies_priv` system table.

##### Implicit Account Creation

If an account named in a [`GRANT`](grant.html "13.7.1.4 GRANT Statement") statement does not exist, the action taken depends on the [`NO_AUTO_CREATE_USER`](sql-mode.html#sqlmode_no_auto_create_user) SQL mode:

* If [`NO_AUTO_CREATE_USER`](sql-mode.html#sqlmode_no_auto_create_user) is not enabled, [`GRANT`](grant.html "13.7.1.4 GRANT Statement") creates the account. *This is very insecure* unless you specify a nonempty password using `IDENTIFIED BY`.

* If [`NO_AUTO_CREATE_USER`](sql-mode.html#sqlmode_no_auto_create_user) is enabled, [`GRANT`](grant.html "13.7.1.4 GRANT Statement") fails and does not create the account, unless you specify a nonempty password using `IDENTIFIED BY` or name an authentication plugin using `IDENTIFIED WITH`.

If the account already exists, `IDENTIFIED WITH` is prohibited because it is intended only for use when creating new accounts.

##### Other Account Characteristics

MySQL can check X.509 certificate attributes in addition to the usual authentication that is based on the user name and credentials. For background information on the use of SSL with MySQL, see [Section 6.3, “Using Encrypted Connections”](encrypted-connections.html "6.3 Using Encrypted Connections").

The optional `REQUIRE` clause specifies SSL-related options for a MySQL account. The syntax is the same as for the [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") statement. For details, see [Section 13.7.1.2, “CREATE USER Statement”](create-user.html "13.7.1.2 CREATE USER Statement").

Note

Use of [`GRANT`](grant.html "13.7.1.4 GRANT Statement") to define account SSL characteristics is deprecated in MySQL 5.7. Instead, establish or change SSL characteristics using [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") or [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement"). Expect this [`GRANT`](grant.html "13.7.1.4 GRANT Statement") capability to be removed in a future MySQL release.

The optional `WITH` clause is used for these purposes:

* To enable a user to grant privileges to other users
* To specify resource limits for a user

The `WITH GRANT OPTION` clause gives the user the ability to give to other users any privileges the user has at the specified privilege level.

To grant the [`GRANT OPTION`](privileges-provided.html#priv_grant-option) privilege to an account without otherwise changing its privileges, do this:

```sql
GRANT USAGE ON *.* TO 'someuser'@'somehost' WITH GRANT OPTION;
```

Be careful to whom you give the [`GRANT OPTION`](privileges-provided.html#priv_grant-option) privilege because two users with different privileges may be able to combine privileges!

You cannot grant another user a privilege which you yourself do not have; the [`GRANT OPTION`](privileges-provided.html#priv_grant-option) privilege enables you to assign only those privileges which you yourself possess.

Be aware that when you grant a user the [`GRANT OPTION`](privileges-provided.html#priv_grant-option) privilege at a particular privilege level, any privileges the user possesses (or may be given in the future) at that level can also be granted by that user to other users. Suppose that you grant a user the [`INSERT`](privileges-provided.html#priv_insert) privilege on a database. If you then grant the [`SELECT`](privileges-provided.html#priv_select) privilege on the database and specify `WITH GRANT OPTION`, that user can give to other users not only the [`SELECT`](privileges-provided.html#priv_select) privilege, but also [`INSERT`](privileges-provided.html#priv_insert). If you then grant the [`UPDATE`](privileges-provided.html#priv_update) privilege to the user on the database, the user can grant [`INSERT`](privileges-provided.html#priv_insert), [`SELECT`](privileges-provided.html#priv_select), and [`UPDATE`](privileges-provided.html#priv_update).

For a nonadministrative user, you should not grant the [`ALTER`](privileges-provided.html#priv_alter) privilege globally or for the `mysql` system database. If you do that, the user can try to subvert the privilege system by renaming tables!

For additional information about security risks associated with particular privileges, see [Section 6.2.2, “Privileges Provided by MySQL”](privileges-provided.html "6.2.2 Privileges Provided by MySQL").

It is possible to place limits on use of server resources by an account, as discussed in [Section 6.2.16, “Setting Account Resource Limits”](user-resources.html "6.2.16 Setting Account Resource Limits"). To do so, use a `WITH` clause that specifies one or more *`resource_option`* values. Limits not specified retain their current values. The syntax is the same as for the [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") statement. For details, see [Section 13.7.1.2, “CREATE USER Statement”](create-user.html "13.7.1.2 CREATE USER Statement").

Note

Use of [`GRANT`](grant.html "13.7.1.4 GRANT Statement") to define account resource limits is deprecated in MySQL 5.7. Instead, establish or change resource limits using [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") or [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement"). Expect this [`GRANT`](grant.html "13.7.1.4 GRANT Statement") capability to be removed in a future MySQL release.

##### MySQL and Standard SQL Versions of GRANT

The biggest differences between the MySQL and standard SQL versions of [`GRANT`](grant.html "13.7.1.4 GRANT Statement") are:

* MySQL associates privileges with the combination of a host name and user name and not with only a user name.

* Standard SQL does not have global or database-level privileges, nor does it support all the privilege types that MySQL supports.

* MySQL does not support the standard SQL `UNDER` privilege.

* Standard SQL privileges are structured in a hierarchical manner. If you remove a user, all privileges the user has been granted are revoked. This is also true in MySQL if you use [`DROP USER`](drop-user.html "13.7.1.3 DROP USER Statement"). See [Section 13.7.1.3, “DROP USER Statement”](drop-user.html "13.7.1.3 DROP USER Statement").

* In standard SQL, when you drop a table, all privileges for the table are revoked. In standard SQL, when you revoke a privilege, all privileges that were granted based on that privilege are also revoked. In MySQL, privileges can be dropped with [`DROP USER`](drop-user.html "13.7.1.3 DROP USER Statement") or [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement") statements.

* In MySQL, it is possible to have the [`INSERT`](privileges-provided.html#priv_insert) privilege for only some of the columns in a table. In this case, you can still execute [`INSERT`](insert.html "13.2.5 INSERT Statement") statements on the table, provided that you insert values only for those columns for which you have the [`INSERT`](privileges-provided.html#priv_insert) privilege. The omitted columns are set to their implicit default values if strict SQL mode is not enabled. In strict mode, the statement is rejected if any of the omitted columns have no default value. (Standard SQL requires you to have the [`INSERT`](privileges-provided.html#priv_insert) privilege on all columns.) For information about strict SQL mode and implicit default values, see [Section 5.1.10, “Server SQL Modes”](sql-mode.html "5.1.10 Server SQL Modes"), and [Section 11.6, “Data Type Default Values”](data-type-defaults.html "11.6 Data Type Default Values").
