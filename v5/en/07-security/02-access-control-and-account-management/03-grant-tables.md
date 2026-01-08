### 6.2.3 Grant Tables

The `mysql` system database includes several grant tables that contain information about user accounts and the privileges held by them. This section describes those tables. For information about other tables in the system database, see [Section 5.3, “The mysql System Database”](system-schema.html "5.3 The mysql System Database").

The discussion here describes the underlying structure of the grant tables and how the server uses their contents when interacting with clients. However, normally you do not modify the grant tables directly. Modifications occur indirectly when you use account-management statements such as [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"), [`GRANT`](grant.html "13.7.1.4 GRANT Statement"), and [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement") to set up accounts and control the privileges available to each one. See [Section 13.7.1, “Account Management Statements”](account-management-statements.html "13.7.1 Account Management Statements"). When you use such statements to perform account manipulations, the server modifies the grant tables on your behalf.

Note

Direct modification of grant tables using statements such as [`INSERT`](insert.html "13.2.5 INSERT Statement"), [`UPDATE`](update.html "13.2.11 UPDATE Statement"), or [`DELETE`](delete.html "13.2.2 DELETE Statement") is discouraged and done at your own risk. The server is free to ignore rows that become malformed as a result of such modifications.

As of MySQL 5.7.18, for any operation that modifies a grant table, the server checks whether the table has the expected structure and produces an error if not. To update the tables to the expected structure, perform the MySQL upgrade procedure. See [Section 2.10, “Upgrading MySQL”](upgrading.html "2.10 Upgrading MySQL").

* [Grant Table Overview](grant-tables.html#grant-tables-overview "Grant Table Overview")
* [The user and db Grant Tables](grant-tables.html#grant-tables-user-db "The user and db Grant Tables")
* [The tables\_priv and columns\_priv Grant Tables](grant-tables.html#grant-tables-tables-priv-columns-priv "The tables_priv and columns_priv Grant Tables")
* [The procs\_priv Grant Table](grant-tables.html#grant-tables-procs-priv "The procs_priv Grant Table")
* [The proxies\_priv Grant Table](grant-tables.html#grant-tables-proxies-priv "The proxies_priv Grant Table")
* [Grant Table Scope Column Properties](grant-tables.html#grant-tables-scope-column-properties "Grant Table Scope Column Properties")
* [Grant Table Privilege Column Properties](grant-tables.html#grant-tables-privilege-column-properties "Grant Table Privilege Column Properties")

#### Grant Table Overview

These `mysql` database tables contain grant information:

* [`user`](grant-tables.html#grant-tables-user-db "The user and db Grant Tables"): User accounts, global privileges, and other nonprivilege columns.

* [`db`](grant-tables.html#grant-tables-user-db "The user and db Grant Tables"): Database-level privileges.

* [`tables_priv`](grant-tables.html#grant-tables-tables-priv-columns-priv "The tables_priv and columns_priv Grant Tables"): Table-level privileges.

* [`columns_priv`](grant-tables.html#grant-tables-tables-priv-columns-priv "The tables_priv and columns_priv Grant Tables"): Column-level privileges.

* [`procs_priv`](grant-tables.html#grant-tables-procs-priv "The procs_priv Grant Table"): Stored procedure and function privileges.

* [`proxies_priv`](grant-tables.html#grant-tables-proxies-priv "The proxies_priv Grant Table"): Proxy-user privileges.

Each grant table contains scope columns and privilege columns:

* Scope columns determine the scope of each row in the tables; that is, the context in which the row applies. For example, a `user` table row with `Host` and `User` values of `'h1.example.net'` and `'bob'` applies to authenticating connections made to the server from the host `h1.example.net` by a client that specifies a user name of `bob`. Similarly, a `db` table row with `Host`, `User`, and `Db` column values of `'h1.example.net'`, `'bob'` and `'reports'` applies when `bob` connects from the host `h1.example.net` to access the `reports` database. The `tables_priv` and `columns_priv` tables contain scope columns indicating tables or table/column combinations to which each row applies. The `procs_priv` scope columns indicate the stored routine to which each row applies.

* Privilege columns indicate which privileges a table row grants; that is, which operations it permits to be performed. The server combines the information in the various grant tables to form a complete description of a user's privileges. [Section 6.2.6, “Access Control, Stage 2: Request Verification”](request-access.html "6.2.6 Access Control, Stage 2: Request Verification"), describes the rules for this.

In addition, a grant table may contain columns used for purposes other than scope or privilege assessment.

The server uses the grant tables in the following manner:

* The `user` table scope columns determine whether to reject or permit incoming connections. For permitted connections, any privileges granted in the `user` table indicate the user's global privileges. Any privileges granted in this table apply to *all* databases on the server.

  Caution

  Because a global privilege is considered a privilege for all databases, *any* global privilege enables a user to see all database names with [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement") or by examining the `INFORMATION_SCHEMA` [`SCHEMATA`](information-schema-schemata-table.html "24.3.22 The INFORMATION_SCHEMA SCHEMATA Table") table.

* The `db` table scope columns determine which users can access which databases from which hosts. The privilege columns determine the permitted operations. A privilege granted at the database level applies to the database and to all objects in the database, such as tables and stored programs.

* The `tables_priv` and `columns_priv` tables are similar to the `db` table, but are more fine-grained: They apply at the table and column levels rather than at the database level. A privilege granted at the table level applies to the table and to all its columns. A privilege granted at the column level applies only to a specific column.

* The `procs_priv` table applies to stored routines (stored procedures and functions). A privilege granted at the routine level applies only to a single procedure or function.

* The `proxies_priv` table indicates which users can act as proxies for other users and whether a user can grant the [`PROXY`](privileges-provided.html#priv_proxy) privilege to other users.

The server reads the contents of the grant tables into memory when it starts. You can tell it to reload the tables by issuing a [`FLUSH PRIVILEGES`](flush.html#flush-privileges) statement or executing a [**mysqladmin flush-privileges**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") or [**mysqladmin reload**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") command. Changes to the grant tables take effect as indicated in [Section 6.2.9, “When Privilege Changes Take Effect”](privilege-changes.html "6.2.9 When Privilege Changes Take Effect").

When you modify an account, it is a good idea to verify that your changes have the intended effect. To check the privileges for a given account, use the [`SHOW GRANTS`](show-grants.html "13.7.5.21 SHOW GRANTS Statement") statement. For example, to determine the privileges that are granted to an account with user name and host name values of `bob` and `pc84.example.com`, use this statement:

```sql
SHOW GRANTS FOR 'bob'@'pc84.example.com';
```

To display nonprivilege properties of an account, use [`SHOW CREATE USER`](show-create-user.html "13.7.5.12 SHOW CREATE USER Statement"):

```sql
SHOW CREATE USER 'bob'@'pc84.example.com';
```

#### The user and db Grant Tables

The server uses the `user` and `db` tables in the `mysql` database at both the first and second stages of access control (see [Section 6.2, “Access Control and Account Management”](access-control.html "6.2 Access Control and Account Management")). The columns in the `user` and `db` tables are shown here.

**Table 6.3 user and db Table Columns**

<table><col style="width: 40%"/><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th scope="col">Table Name</th> <th scope="col"><code>user</code></th> <th scope="col"><code>db</code></th> </tr></thead><tbody><tr> <th scope="row"><span class="bold"><strong>Scope columns</strong></span></th> <td><code>Host</code></td> <td><code>Host</code></td> </tr><tr> <th scope="row"></th> <td><code>User</code></td> <td><code>Db</code></td> </tr><tr> <th scope="row"></th> <td></td> <td><code>User</code></td> </tr><tr> <th scope="row"><span class="bold"><strong>Privilege columns</strong></span></th> <td><code>Select_priv</code></td> <td><code>Select_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Insert_priv</code></td> <td><code>Insert_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Update_priv</code></td> <td><code>Update_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Delete_priv</code></td> <td><code>Delete_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Index_priv</code></td> <td><code>Index_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Alter_priv</code></td> <td><code>Alter_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Create_priv</code></td> <td><code>Create_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Drop_priv</code></td> <td><code>Drop_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Grant_priv</code></td> <td><code>Grant_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Create_view_priv</code></td> <td><code>Create_view_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Show_view_priv</code></td> <td><code>Show_view_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Create_routine_priv</code></td> <td><code>Create_routine_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Alter_routine_priv</code></td> <td><code>Alter_routine_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Execute_priv</code></td> <td><code>Execute_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Trigger_priv</code></td> <td><code>Trigger_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Event_priv</code></td> <td><code>Event_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Create_tmp_table_priv</code></td> <td><code>Create_tmp_table_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Lock_tables_priv</code></td> <td><code>Lock_tables_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>References_priv</code></td> <td><code>References_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Reload_priv</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>Shutdown_priv</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>Process_priv</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>File_priv</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>Show_db_priv</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>Super_priv</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>Repl_slave_priv</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>Repl_client_priv</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>Create_user_priv</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>Create_tablespace_priv</code></td> <td></td> </tr><tr> <th scope="row"><span class="bold"><strong>Security columns</strong></span></th> <td><code>ssl_type</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>ssl_cipher</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>x509_issuer</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>x509_subject</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>plugin</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>authentication_string</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>password_expired</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>password_last_changed</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>password_lifetime</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>account_locked</code></td> <td></td> </tr><tr> <th scope="row"><span class="bold"><strong>Resource control columns</strong></span></th> <td><code>max_questions</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>max_updates</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>max_connections</code></td> <td></td> </tr><tr> <th scope="row"></th> <td><code>max_user_connections</code></td> <td></td> </tr></tbody></table>

The `user` table `plugin` and `authentication_string` columns store authentication plugin and credential information.

The server uses the plugin named in the `plugin` column of an account row to authenticate connection attempts for the account.

The `plugin` column must be nonempty. At startup, and at runtime when [`FLUSH PRIVILEGES`](flush.html#flush-privileges) is executed, the server checks `user` table rows. For any row with an empty `plugin` column, the server writes a warning to the error log of this form:

```sql
[Warning] User entry 'user_name'@'host_name' has an empty plugin
value. The user will be ignored and no one can login with this user
anymore.
```

To address this problem, see [Section 6.4.1.3, “Migrating Away from Pre-4.1 Password Hashing and the mysql\_old\_password Plugin”](account-upgrades.html "6.4.1.3 Migrating Away from Pre-4.1 Password Hashing and the mysql_old_password Plugin").

The `password_expired` column permits DBAs to expire account passwords and require users to reset their password. The default `password_expired` value is `'N'`, but can be set to `'Y'` with the [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") statement. After an account's password has been expired, all operations performed by the account in subsequent connections to the server result in an error until the user issues an [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") statement to establish a new account password.

Note

Although it is possible to “reset” an expired password by setting it to its current value, it is preferable, as a matter of good policy, to choose a different password.

`password_last_changed` is a `TIMESTAMP` column indicating when the password was last changed. The value is non-`NULL` only for accounts that use MySQL built-in authentication methods (accounts that use an authentication plugin of `mysql_native_password` or `sha256_password`). The value is `NULL` for other accounts, such as those authenticated using an external authentication system.

`password_last_changed` is updated by the [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"), [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement"), and [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement") statements, and by [`GRANT`](grant.html "13.7.1.4 GRANT Statement") statements that create an account or change an account password.

`password_lifetime` indicates the account password lifetime, in days. If the password is past its lifetime (assessed using the `password_last_changed` column), the server considers the password expired when clients connect using the account. A value of *`N`* greater than zero means that the password must be changed every *`N`* days. A value of 0 disables automatic password expiration. If the value is `NULL` (the default), the global expiration policy applies, as defined by the [`default_password_lifetime`](server-system-variables.html#sysvar_default_password_lifetime) system variable.

`account_locked` indicates whether the account is locked (see [Section 6.2.15, “Account Locking”](account-locking.html "6.2.15 Account Locking")).

#### The tables\_priv and columns\_priv Grant Tables

During the second stage of access control, the server performs request verification to ensure that each client has sufficient privileges for each request that it issues. In addition to the `user` and `db` grant tables, the server may also consult the `tables_priv` and `columns_priv` tables for requests that involve tables. The latter tables provide finer privilege control at the table and column levels. They have the columns shown in the following table.

**Table 6.4 tables\_priv and columns\_priv Table Columns**

<table><col style="width: 20%"/><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th scope="col">Table Name</th> <th scope="col"><code>tables_priv</code></th> <th scope="col"><code>columns_priv</code></th> </tr></thead><tbody><tr> <th scope="row"><span class="bold"><strong>Scope columns</strong></span></th> <td><code>Host</code></td> <td><code>Host</code></td> </tr><tr> <th scope="row"></th> <td><code>Db</code></td> <td><code>Db</code></td> </tr><tr> <th scope="row"></th> <td><code>User</code></td> <td><code>User</code></td> </tr><tr> <th scope="row"></th> <td><code>Table_name</code></td> <td><code>Table_name</code></td> </tr><tr> <th scope="row"></th> <td></td> <td><code>Column_name</code></td> </tr><tr> <th scope="row"><span class="bold"><strong>Privilege columns</strong></span></th> <td><code>Table_priv</code></td> <td><code>Column_priv</code></td> </tr><tr> <th scope="row"></th> <td><code>Column_priv</code></td> <td></td> </tr><tr> <th scope="row"><span class="bold"><strong>Other columns</strong></span></th> <td><code>Timestamp</code></td> <td><code>Timestamp</code></td> </tr><tr> <th scope="row"></th> <td><code>Grantor</code></td> <td></td> </tr></tbody></table>

The `Timestamp` and `Grantor` columns are set to the current timestamp and the [`CURRENT_USER`](information-functions.html#function_current-user) value, respectively, but are otherwise unused.

#### The procs\_priv Grant Table

For verification of requests that involve stored routines, the server may consult the `procs_priv` table, which has the columns shown in the following table.

**Table 6.5 procs\_priv Table Columns**

<table><col style="width: 20%"/><col style="width: 20%"/><thead><tr> <th>Table Name</th> <th><code>procs_priv</code></th> </tr></thead><tbody><tr> <td><span class="bold"><strong>Scope columns</strong></span></td> <td><code>Host</code></td> </tr><tr> <td></td> <td><code>Db</code></td> </tr><tr> <td></td> <td><code>User</code></td> </tr><tr> <td></td> <td><code>Routine_name</code></td> </tr><tr> <td></td> <td><code>Routine_type</code></td> </tr><tr> <td><span class="bold"><strong>Privilege columns</strong></span></td> <td><code>Proc_priv</code></td> </tr><tr> <td><span class="bold"><strong>Other columns</strong></span></td> <td><code>Timestamp</code></td> </tr><tr> <td></td> <td><code>Grantor</code></td> </tr></tbody></table>

The `Routine_type` column is an [`ENUM`](enum.html "11.3.5 The ENUM Type") column with values of `'FUNCTION'` or `'PROCEDURE'` to indicate the type of routine the row refers to. This column enables privileges to be granted separately for a function and a procedure with the same name.

The `Timestamp` and `Grantor` columns are unused.

#### The proxies\_priv Grant Table

The `proxies_priv` table records information about proxy accounts. It has these columns:

* `Host`, `User`: The proxy account; that is, the account that has the [`PROXY`](privileges-provided.html#priv_proxy) privilege for the proxied account.

* `Proxied_host`, `Proxied_user`: The proxied account.

* `Grantor`, `Timestamp`: Unused.

* `With_grant`: Whether the proxy account can grant the [`PROXY`](privileges-provided.html#priv_proxy) privilege to other accounts.

For an account to be able to grant the [`PROXY`](privileges-provided.html#priv_proxy) privilege to other accounts, it must have a row in the `proxies_priv` table with `With_grant` set to 1 and `Proxied_host` and `Proxied_user` set to indicate the account or accounts for which the privilege can be granted. For example, the `'root'@'localhost'` account created during MySQL installation has a row in the `proxies_priv` table that enables granting the [`PROXY`](privileges-provided.html#priv_proxy) privilege for `''@''`, that is, for all users and all hosts. This enables `root` to set up proxy users, as well as to delegate to other accounts the authority to set up proxy users. See [Section 6.2.14, “Proxy Users”](proxy-users.html "6.2.14 Proxy Users").

#### Grant Table Scope Column Properties

Scope columns in the grant tables contain strings. The default value for each is the empty string. The following table shows the number of characters permitted in each column.

**Table 6.6 Grant Table Scope Column Lengths**

<table><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Column Name</th> <th>Maximum Permitted Characters</th> </tr></thead><tbody><tr> <td><code>Host</code>, <code>Proxied_host</code></td> <td>60</td> </tr><tr> <td><code>User</code>, <code>Proxied_user</code></td> <td>32</td> </tr><tr> <td><code>Password</code></td> <td>41</td> </tr><tr> <td><code>Db</code></td> <td>64</td> </tr><tr> <td><code>Table_name</code></td> <td>64</td> </tr><tr> <td><code>Column_name</code></td> <td>64</td> </tr><tr> <td><code>Routine_name</code></td> <td>64</td> </tr></tbody></table>

`Host` and `Proxied_host` values are converted to lowercase before being stored in the grant tables.

For access-checking purposes, comparisons of `User`, `Proxied_user`, `Password`, `authentication_string`, `Db`, and `Table_name` values are case-sensitive. Comparisons of `Host`, `Proxied_host`, `Column_name`, and `Routine_name` values are not case-sensitive.

#### Grant Table Privilege Column Properties

The `user` and `db` tables list each privilege in a separate column that is declared as `ENUM('N','Y') DEFAULT 'N'`. In other words, each privilege can be disabled or enabled, with the default being disabled.

The `tables_priv`, `columns_priv`, and `procs_priv` tables declare the privilege columns as [`SET`](set.html "11.3.6 The SET Type") columns. Values in these columns can contain any combination of the privileges controlled by the table. Only those privileges listed in the column value are enabled.

**Table 6.7 Set-Type Privilege Column Values**

<table><col style="width: 20%"/><col style="width: 25%"/><col style="width: 45%"/><thead><tr> <th scope="col">Table Name</th> <th scope="col">Column Name</th> <th scope="col">Possible Set Elements</th> </tr></thead><tbody><tr> <th scope="row"><code>tables_priv</code></th> <td><code>Table_priv</code></td> <td><code>'Select', 'Insert', 'Update', 'Delete', 'Create', 'Drop', 'Grant', 'References', 'Index', 'Alter', 'Create View', 'Show view', 'Trigger'</code></td> </tr><tr> <th scope="row"><code>tables_priv</code></th> <td><code>Column_priv</code></td> <td><code>'Select', 'Insert', 'Update', 'References'</code></td> </tr><tr> <th scope="row"><code>columns_priv</code></th> <td><code>Column_priv</code></td> <td><code>'Select', 'Insert', 'Update', 'References'</code></td> </tr><tr> <th scope="row"><code>procs_priv</code></th> <td><code>Proc_priv</code></td> <td><code>'Execute', 'Alter Routine', 'Grant'</code></td> </tr></tbody></table>

Only the `user` table specifies administrative privileges, such as [`RELOAD`](privileges-provided.html#priv_reload) and [`SHUTDOWN`](privileges-provided.html#priv_shutdown). Administrative operations are operations on the server itself and are not database-specific, so there is no reason to list these privileges in the other grant tables. Consequently, the server need consult only the `user` table to determine whether a user can perform an administrative operation.

The [`FILE`](privileges-provided.html#priv_file) privilege also is specified only in the `user` table. It is not an administrative privilege as such, but a user's ability to read or write files on the server host is independent of the database being accessed.
