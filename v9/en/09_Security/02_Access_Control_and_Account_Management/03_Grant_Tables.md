### 8.2.3 Grant Tables

The `mysql` system database includes several grant tables that contain information about user accounts and the privileges held by them. This section describes those tables. For information about other tables in the system database, see Section 7.3, “The mysql System Schema”.

The discussion here describes the underlying structure of the grant tables and how the server uses their contents when interacting with clients. However, normally you do not modify the grant tables directly. Modifications occur indirectly when you use account-management statements such as `CREATE USER`, `GRANT`, and `REVOKE` to set up accounts and control the privileges available to each one. See Section 15.7.1, “Account Management Statements”. When you use such statements to perform account manipulations, the server modifies the grant tables on your behalf.

Note

Direct modification of grant tables using statements such as `INSERT`, `UPDATE`, or `DELETE` is discouraged and done at your own risk. The server is free to ignore rows that become malformed as a result of such modifications.

For any operation that modifies a grant table, the server checks whether the table has the expected structure and produces an error if not. To update the tables to the expected structure, perform the MySQL upgrade procedure. See Chapter 3, *Upgrading MySQL*.

* Grant Table Overview
* The user and db Grant Tables
* The tables\_priv and columns\_priv Grant Tables
* The procs\_priv Grant Table
* The proxies\_priv Grant Table
* The global\_grants Grant Table
* The default\_roles Grant Table
* The role\_edges Grant Table
* The password\_history Grant Table
* Grant Table Scope Column Properties
* Grant Table Privilege Column Properties
* Grant Table Concurrency

#### Grant Table Overview

These `mysql` database tables contain grant information:

* `user`: User accounts, static global privileges, and other nonprivilege columns.

* `global_grants`: Dynamic global privileges.

* `db`: Database-level privileges.

* `tables_priv`: Table-level privileges.

* `columns_priv`: Column-level privileges.

* `procs_priv`: Stored procedure and function privileges.

* `proxies_priv`: Proxy-user privileges.

* `default_roles`: Default user roles.

* `role_edges`: Edges for role subgraphs.

* `password_history`: Password change history.

For information about the differences between static and dynamic global privileges, see Static Versus Dynamic Privileges.)

Grant tables use the `InnoDB` storage engine and are transactional. Each statement either succeeds for all named users or rolls back and has no effect if any error occurs.

Each grant table contains scope columns and privilege columns:

* Scope columns determine the scope of each row in the tables; that is, the context in which the row applies. For example, a `user` table row with `Host` and `User` values of `'h1.example.net'` and `'bob'` applies to authenticating connections made to the server from the host `h1.example.net` by a client that specifies a user name of `bob`. Similarly, a `db` table row with `Host`, `User`, and `Db` column values of `'h1.example.net'`, `'bob'` and `'reports'` applies when `bob` connects from the host `h1.example.net` to access the `reports` database. The `tables_priv` and `columns_priv` tables contain scope columns indicating tables or table/column combinations to which each row applies. The `procs_priv` scope columns indicate the stored routine to which each row applies.

* Privilege columns indicate which privileges a table row grants; that is, which operations it permits to be performed. The server combines the information in the various grant tables to form a complete description of a user's privileges. Section 8.2.7, “Access Control, Stage 2: Request Verification”, describes the rules for this.

In addition, a grant table may contain columns used for purposes other than scope or privilege assessment.

The server uses the grant tables in the following manner:

* The `user` table scope columns determine whether to reject or permit incoming connections. For permitted connections, any privileges granted in the `user` table indicate the user's static global privileges. Any privileges granted in this table apply to *all* databases on the server.

  Caution

  Because any static global privilege is considered a privilege for all databases, any static global privilege enables a user to see all database names with `SHOW DATABASES` or by examining the `SCHEMATA` table of `INFORMATION_SCHEMA`, except databases that have been restricted at the database level by partial revokes.

* The `global_grants` table lists current assignments of dynamic global privileges to user accounts. For each row, the scope columns determine which user has the privilege named in the privilege column.

* The `db` table scope columns determine which users can access which databases from which hosts. The privilege columns determine the permitted operations. A privilege granted at the database level applies to the database and to all objects in the database, such as tables and stored programs.

* The `tables_priv` and `columns_priv` tables are similar to the `db` table, but are more fine-grained: They apply at the table and column levels rather than at the database level. A privilege granted at the table level applies to the table and to all its columns. A privilege granted at the column level applies only to a specific column.

* The `procs_priv` table applies to stored routines (stored procedures and functions). A privilege granted at the routine level applies only to a single procedure or function.

* The `proxies_priv` table indicates which users can act as proxies for other users and whether a user can grant the `PROXY` privilege to other users.

* The `default_roles` and `role_edges` tables contain information about role relationships.

* The `password_history` table retains previously chosen passwords to enable restrictions on password reuse. See Section 8.2.15, “Password Management”.

The server reads the contents of the grant tables into memory when it starts. You can tell it to reload the tables by issuing a `FLUSH PRIVILEGES` statement or executing a **mysqladmin flush-privileges** or **mysqladmin reload** command. Changes to the grant tables take effect as indicated in Section 8.2.13, “When Privilege Changes Take Effect”.

When you modify an account, it is a good idea to verify that your changes have the intended effect. To check the privileges for a given account, use the `SHOW GRANTS` statement. For example, to determine the privileges that are granted to an account with user name and host name values of `bob` and `pc84.example.com`, use this statement:

```
SHOW GRANTS FOR 'bob'@'pc84.example.com';
```

To display nonprivilege properties of an account, use `SHOW CREATE USER`:

```
SHOW CREATE USER 'bob'@'pc84.example.com';
```

#### The user and db Grant Tables

The server uses the `user` and `db` tables in the `mysql` database at both the first and second stages of access control (see Section 8.2, “Access Control and Account Management”). The columns in the `user` and `db` tables are shown here.

**Table 8.4 user and db Table Columns**

<table><thead><tr> <th>Table Name</th> <th><code>user</code></th> <th><code>db</code></th> </tr></thead><tbody><tr> <th><span><strong>Scope columns</strong></span></th> <td><code>Host</code></td> <td><code>Host</code></td> </tr><tr> <th></th> <td><code>User</code></td> <td><code>Db</code></td> </tr><tr> <th></th> <td></td> <td><code>User</code></td> </tr><tr> <th><span><strong>Privilege columns</strong></span></th> <td><code>Select_priv</code></td> <td><code>Select_priv</code></td> </tr><tr> <th></th> <td><code>Insert_priv</code></td> <td><code>Insert_priv</code></td> </tr><tr> <th></th> <td><code>Update_priv</code></td> <td><code>Update_priv</code></td> </tr><tr> <th></th> <td><code>Delete_priv</code></td> <td><code>Delete_priv</code></td> </tr><tr> <th></th> <td><code>Index_priv</code></td> <td><code>Index_priv</code></td> </tr><tr> <th></th> <td><code>Alter_priv</code></td> <td><code>Alter_priv</code></td> </tr><tr> <th></th> <td><code>Create_priv</code></td> <td><code>Create_priv</code></td> </tr><tr> <th></th> <td><code>Drop_priv</code></td> <td><code>Drop_priv</code></td> </tr><tr> <th></th> <td><code>Grant_priv</code></td> <td><code>Grant_priv</code></td> </tr><tr> <th></th> <td><code>Create_view_priv</code></td> <td><code>Create_view_priv</code></td> </tr><tr> <th></th> <td><code>Show_view_priv</code></td> <td><code>Show_view_priv</code></td> </tr><tr> <th></th> <td><code>Create_routine_priv</code></td> <td><code>Create_routine_priv</code></td> </tr><tr> <th></th> <td><code>Alter_routine_priv</code></td> <td><code>Alter_routine_priv</code></td> </tr><tr> <th></th> <td><code>Execute_priv</code></td> <td><code>Execute_priv</code></td> </tr><tr> <th></th> <td><code>Trigger_priv</code></td> <td><code>Trigger_priv</code></td> </tr><tr> <th></th> <td><code>Event_priv</code></td> <td><code>Event_priv</code></td> </tr><tr> <th></th> <td><code>Create_tmp_table_priv</code></td> <td><code>Create_tmp_table_priv</code></td> </tr><tr> <th></th> <td><code>Lock_tables_priv</code></td> <td><code>Lock_tables_priv</code></td> </tr><tr> <th></th> <td><code>References_priv</code></td> <td><code>References_priv</code></td> </tr><tr> <th></th> <td><code>Reload_priv</code></td> <td></td> </tr><tr> <th></th> <td><code>Shutdown_priv</code></td> <td></td> </tr><tr> <th></th> <td><code>Process_priv</code></td> <td></td> </tr><tr> <th></th> <td><code>File_priv</code></td> <td></td> </tr><tr> <th></th> <td><code>Show_db_priv</code></td> <td></td> </tr><tr> <th></th> <td><code>Super_priv</code></td> <td></td> </tr><tr> <th></th> <td><code>Repl_slave_priv</code></td> <td></td> </tr><tr> <th></th> <td><code>Repl_client_priv</code></td> <td></td> </tr><tr> <th></th> <td><code>Create_user_priv</code></td> <td></td> </tr><tr> <th></th> <td><code>Create_tablespace_priv</code></td> <td></td> </tr><tr> <th></th> <td><code>Create_role_priv</code></td> <td></td> </tr><tr> <th></th> <td><code>Drop_role_priv</code></td> <td></td> </tr><tr> <th><span><strong>Security columns</strong></span></th> <td><code>ssl_type</code></td> <td></td> </tr><tr> <th></th> <td><code>ssl_cipher</code></td> <td></td> </tr><tr> <th></th> <td><code>x509_issuer</code></td> <td></td> </tr><tr> <th></th> <td><code>x509_subject</code></td> <td></td> </tr><tr> <th></th> <td><code>plugin</code></td> <td></td> </tr><tr> <th></th> <td><code>authentication_string</code></td> <td></td> </tr><tr> <th></th> <td><code>password_expired</code></td> <td></td> </tr><tr> <th></th> <td><code>password_last_changed</code></td> <td></td> </tr><tr> <th></th> <td><code>password_lifetime</code></td> <td></td> </tr><tr> <th></th> <td><code>account_locked</code></td> <td></td> </tr><tr> <th></th> <td><code>Password_reuse_history</code></td> <td></td> </tr><tr> <th></th> <td><code>Password_reuse_time</code></td> <td></td> </tr><tr> <th></th> <td><code>Password_require_current</code></td> <td></td> </tr><tr> <th></th> <td><code>User_attributes</code></td> <td></td> </tr><tr> <th><span><strong>Resource control columns</strong></span></th> <td><code>max_questions</code></td> <td></td> </tr><tr> <th></th> <td><code>max_updates</code></td> <td></td> </tr><tr> <th></th> <td><code>max_connections</code></td> <td></td> </tr><tr> <th></th> <td><code>max_user_connections</code></td> <td></td> </tr></tbody></table>

The `user` table `plugin` and `authentication_string` columns store authentication plugin and credential information.

The server uses the plugin named in the `plugin` column of an account row to authenticate connection attempts for the account.

The `plugin` column must be nonempty. At startup, and at runtime when `FLUSH PRIVILEGES` is executed, the server checks `user` table rows. For any row with an empty `plugin` column, the server writes a warning to the error log of this form:

```
[Warning] User entry 'user_name'@'host_name' has an empty plugin
value. The user will be ignored and no one can login with this user
anymore.
```

To assign a plugin to an account that is missing one, use the `ALTER USER` statement.

The `password_expired` column permits DBAs to expire account passwords and require users to reset their password. The default `password_expired` value is `'N'`, but can be set to `'Y'` with the `ALTER USER` statement. After an account's password has been expired, all operations performed by the account in subsequent connections to the server result in an error until the user issues an `ALTER USER` statement to establish a new account password.

Note

Although it is possible to “reset” an expired password by setting it to its current value, it is preferable, as a matter of good policy, to choose a different password. DBAs can enforce non-reuse by establishing an appropriate password-reuse policy. See Password Reuse Policy.

`password_last_changed` is a `TIMESTAMP` column indicating when the password was last changed. The value is non-`NULL` only for accounts that use a MySQL built-in authentication plugin (`sha256_password` or `caching_sha2_password`). The value is `NULL` for other accounts, such as those authenticated using an external authentication system.

`password_last_changed` is updated by the `CREATE USER`, `ALTER USER`, and `SET PASSWORD` statements, and by `GRANT` statements that create an account or change an account password.

`password_lifetime` indicates the account password lifetime, in days. If the password is past its lifetime (assessed using the `password_last_changed` column), the server considers the password expired when clients connect using the account. A value of *`N`* greater than zero means that the password must be changed every *`N`* days. A value of 0 disables automatic password expiration. If the value is `NULL` (the default), the global expiration policy applies, as defined by the `default_password_lifetime` system variable.

`account_locked` indicates whether the account is locked (see Section 8.2.20, “Account Locking”).

`Password_reuse_history` is the value of the `PASSWORD HISTORY` option for the account, or `NULL` for the default history.

`Password_reuse_time` is the value of the `PASSWORD REUSE INTERVAL` option for the account, or `NULL` for the default interval.

`Password_require_current` corresponds to the value of the `PASSWORD REQUIRE` option for the account, as shown by the following table.

**Table 8.5 Permitted Password\_require\_current Values**

<table summary="Permitted values of the user.Password_require_current column and how they correspond to PASSWORD REQUIRE options."><thead><tr> <th>Password_require_current Value</th> <th>Corresponding PASSWORD REQUIRE Option</th> </tr></thead><tbody><tr> <td><code>'Y'</code></td> <td><code>PASSWORD REQUIRE CURRENT</code></td> </tr><tr> <td><code>'N'</code></td> <td><code>PASSWORD REQUIRE CURRENT OPTIONAL</code></td> </tr><tr> <td><code>NULL</code></td> <td><code>PASSWORD REQUIRE CURRENT DEFAULT</code></td> </tr></tbody></table>

`User_attributes` is a JSON-format column that stores account attributes not stored in other columns. The `INFORMATION_SCHEMA` exposes these attributes through the `USER_ATTRIBUTES` table.

The `User_attributes` column may contain these attributes:

* `additional_password`: The secondary password, if any. See Dual Password Support.

* `Restrictions`: Restriction lists, if any. Restrictions are added by partial-revoke operations. The attribute value is an array of elements that each have `Database` and `Restrictions` keys indicating the name of a restricted database and the applicable restrictions on it (see Section 8.2.12, “Privilege Restriction Using Partial Revokes”).

* `Password_locking`: The conditions for failed-login tracking and temporary account locking, if any (see Failed-Login Tracking and Temporary Account Locking). The `Password_locking` attribute is updated according to the `FAILED_LOGIN_ATTEMPTS` and `PASSWORD_LOCK_TIME` options of the `CREATE USER` and `ALTER USER` statements. The attribute value is a hash with `failed_login_attempts` and `password_lock_time_days` keys indicating the value of such options as have been specified for the account. If a key is missing, its value is implicitly 0. If a key value is implicitly or explicitly 0, the corresponding capability is disabled.

* `multi_factor_authentication`: Rows in the `mysql.user` system table have a `plugin` column that indicates an authentication plugin. For single-factor authentication, that plugin is the only authentication factor. For two-factor or three-factor forms of multifactor authentication, that plugin corresponds to the first authentication factor, but additional information must be stored for the second and third factors. The `multi_factor_authentication` attribute holds this information.

  The `multi_factor_authentication` value is an array, where each array element is a hash that describes an authentication factor using these attributes:

  + `plugin`: The name of the authentication plugin.

  + `authentication_string`: The authentication string value.

  + `passwordless`: A flag that denotes whether the user is meant to be used without a password (with a security token as the only authentication method).

  + `requires_registration`: a flag that defines whether the user account has registered a security token.

  The first and second array elements describe multifactor authentication factors 2 and 3.

If no attributes apply, `User_attributes` is `NULL`.

Example: An account that has a secondary password and partially revoked database privileges has `additional_password` and `Restrictions` attributes in the column value:

```
mysql> SELECT User_attributes FROM mysql.User WHERE User = 'u'\G
*************************** 1. row ***************************
User_attributes: {"Restrictions":
                   [{"Database": "mysql", "Privileges": ["SELECT"]}],
                  "additional_password": "hashed_credentials"}
```

To determine which attributes are present, use the `JSON_KEYS()` function:

```
SELECT User, Host, JSON_KEYS(User_attributes)
FROM mysql.user WHERE User_attributes IS NOT NULL;
```

To extract a particular attribute, such as `Restrictions`, do this:

```
SELECT User, Host, User_attributes->>'$.Restrictions'
FROM mysql.user WHERE User_attributes->>'$.Restrictions' <> '';
```

Here is an example of the kind of information stored for `multi_factor_authentication`:

```
{
  "multi_factor_authentication": [
    {
      "plugin": "authentication_ldap_simple",
      "passwordless": 0,
      "authentication_string": "ldap auth string",
      "requires_registration": 0
    },
    {
      "plugin": "authentication_webauthn",
      "passwordless": 0,
      "authentication_string": "",
      "requires_registration": 1
    }
  ]
}
```

#### The tables\_priv and columns\_priv Grant Tables

During the second stage of access control, the server performs request verification to ensure that each client has sufficient privileges for each request that it issues. In addition to the `user` and `db` grant tables, the server may also consult the `tables_priv` and `columns_priv` tables for requests that involve tables. The latter tables provide finer privilege control at the table and column levels. They have the columns shown in the following table.

**Table 8.6 tables\_priv and columns\_priv Table Columns**

<table><thead><tr> <th>Table Name</th> <th><code>tables_priv</code></th> <th><code>columns_priv</code></th> </tr></thead><tbody><tr> <th><span><strong>Scope columns</strong></span></th> <td><code>Host</code></td> <td><code>Host</code></td> </tr><tr> <th></th> <td><code>Db</code></td> <td><code>Db</code></td> </tr><tr> <th></th> <td><code>User</code></td> <td><code>User</code></td> </tr><tr> <th></th> <td><code>Table_name</code></td> <td><code>Table_name</code></td> </tr><tr> <th></th> <td></td> <td><code>Column_name</code></td> </tr><tr> <th><span><strong>Privilege columns</strong></span></th> <td><code>Table_priv</code></td> <td><code>Column_priv</code></td> </tr><tr> <th></th> <td><code>Column_priv</code></td> <td></td> </tr><tr> <th><span><strong>Other columns</strong></span></th> <td><code>Timestamp</code></td> <td><code>Timestamp</code></td> </tr><tr> <th></th> <td><code>Grantor</code></td> <td></td> </tr></tbody></table>

The `Timestamp` and `Grantor` columns are set to the current timestamp and the `CURRENT_USER` value, respectively, but are otherwise unused.

#### The procs\_priv Grant Table

For verification of requests that involve stored routines, the server may consult the `procs_priv` table, which has the columns shown in the following table.

**Table 8.7 procs\_priv Table Columns**

<table><thead><tr> <th>Table Name</th> <th><code>procs_priv</code></th> </tr></thead><tbody><tr> <td><span><strong>Scope columns</strong></span></td> <td><code>Host</code></td> </tr><tr> <td></td> <td><code>Db</code></td> </tr><tr> <td></td> <td><code>User</code></td> </tr><tr> <td></td> <td><code>Routine_name</code></td> </tr><tr> <td></td> <td><code>Routine_type</code></td> </tr><tr> <td><span><strong>Privilege columns</strong></span></td> <td><code>Proc_priv</code></td> </tr><tr> <td><span><strong>Other columns</strong></span></td> <td><code>Timestamp</code></td> </tr><tr> <td></td> <td><code>Grantor</code></td> </tr></tbody></table>

The `Routine_type` column is an `ENUM` column with values of `'FUNCTION'` or `'PROCEDURE'` to indicate the type of routine the row refers to. This column enables privileges to be granted separately for a function and a procedure with the same name.

The `Timestamp` and `Grantor` columns are unused.

#### The proxies\_priv Grant Table

The `proxies_priv` table records information about proxy accounts. It has these columns:

* `Host`, `User`: The proxy account; that is, the account that has the `PROXY` privilege for the proxied account.

* `Proxied_host`, `Proxied_user`: The proxied account.

* `Grantor`, `Timestamp`: Unused.

* `With_grant`: Whether the proxy account can grant the `PROXY` privilege to other accounts.

For an account to be able to grant the `PROXY` privilege to other accounts, it must have a row in the `proxies_priv` table with `With_grant` set to 1 and `Proxied_host` and `Proxied_user` set to indicate the account or accounts for which the privilege can be granted. For example, the `'root'@'localhost'` account created during MySQL installation has a row in the `proxies_priv` table that enables granting the `PROXY` privilege for `''@''`, that is, for all users and all hosts. This enables `root` to set up proxy users, as well as to delegate to other accounts the authority to set up proxy users. See Section 8.2.19, “Proxy Users”.

#### The global\_grants Grant Table

The `global_grants` table lists current assignments of dynamic global privileges to user accounts. The table has these columns:

* `USER`, `HOST`: The user name and host name of the account to which the privilege is granted.

* `PRIV`: The privilege name.
* `WITH_GRANT_OPTION`: Whether the account can grant the privilege to other accounts.

#### The default\_roles Grant Table

The `default_roles` table lists default user roles. It has these columns:

* `HOST`, `USER`: The account or role to which the default role applies.

* `DEFAULT_ROLE_HOST`, `DEFAULT_ROLE_USER`: The default role.

#### The role\_edges Grant Table

The `role_edges` table lists edges for role subgraphs. It has these columns:

* `FROM_HOST`, `FROM_USER`: The account that is granted a role.

* `TO_HOST`, `TO_USER`: The role that is granted to the account.

* `WITH_ADMIN_OPTION`: Whether the account can grant the role to and revoke it from other accounts by using `WITH ADMIN OPTION`.

#### The password\_history Grant Table

The `password_history` table contains information about password changes. It has these columns:

* `Host`, `User`: The account for which the password change occurred.

* `Password_timestamp`: The time when the password change occurred.

* `Password`: The new password hash value.

The `password_history` table accumulates a sufficient number of nonempty passwords per account to enable MySQL to perform checks against both the account password history length and reuse interval. Automatic pruning of entries that are outside both limits occurs when password-change attempts occur.

Note

The empty password does not count in the password history and is subject to reuse at any time.

If an account is renamed, its entries are renamed to match. If an account is dropped or its authentication plugin is changed, its entries are removed.

#### Grant Table Scope Column Properties

Scope columns in the grant tables contain strings. The default value for each is the empty string. The following table shows the number of characters permitted in each column.

**Table 8.8 Grant Table Scope Column Lengths**

<table><thead><tr> <th>Column Name</th> <th>Maximum Permitted Characters</th> </tr></thead><tbody><tr> <td><code>Host</code>, <code>Proxied_host</code></td> <td>255</td> </tr><tr> <td><code>User</code>, <code>Proxied_user</code></td> <td>32</td> </tr><tr> <td><code>Db</code></td> <td>64</td> </tr><tr> <td><code>Table_name</code></td> <td>64</td> </tr><tr> <td><code>Column_name</code></td> <td>64</td> </tr><tr> <td><code>Routine_name</code></td> <td>64</td> </tr></tbody></table>

`Host` and `Proxied_host` values are converted to lowercase before being stored in the grant tables.

For access-checking purposes, comparisons of `User`, `Proxied_user`, `authentication_string`, `Db`, and `Table_name` values are case-sensitive. Comparisons of `Host`, `Proxied_host`, `Column_name`, and `Routine_name` values are not case-sensitive.

#### Grant Table Privilege Column Properties

The `user` and `db` tables list each privilege in a separate column that is declared as `ENUM('N','Y') DEFAULT 'N'`. In other words, each privilege can be disabled or enabled, with the default being disabled.

The `tables_priv`, `columns_priv`, and `procs_priv` tables declare the privilege columns as `SET` columns. Values in these columns can contain any combination of the privileges controlled by the table. Only those privileges listed in the column value are enabled.

**Table 8.9 Set-Type Privilege Column Values**

<table><thead><tr> <th>Table Name</th> <th>Column Name</th> <th>Possible Set Elements</th> </tr></thead><tbody><tr> <th><code>tables_priv</code></th> <td><code>Table_priv</code></td> <td><code>'Select', 'Insert', 'Update', 'Delete', 'Create', 'Drop', 'Grant', 'References', 'Index', 'Alter', 'Create View', 'Show view', 'Trigger'</code></td> </tr><tr> <th><code>tables_priv</code></th> <td><code>Column_priv</code></td> <td><code>'Select', 'Insert', 'Update', 'References'</code></td> </tr><tr> <th><code>columns_priv</code></th> <td><code>Column_priv</code></td> <td><code>'Select', 'Insert', 'Update', 'References'</code></td> </tr><tr> <th><code>procs_priv</code></th> <td><code>Proc_priv</code></td> <td><code>'Execute', 'Alter Routine', 'Grant'</code></td> </tr></tbody></table>

Only the `user` and `global_grants` tables specify administrative privileges, such as `RELOAD`, `SHUTDOWN`, and `SYSTEM_VARIABLES_ADMIN`. Administrative operations are operations on the server itself and are not database-specific, so there is no reason to list these privileges in the other grant tables. Consequently, the server need consult only the `user` and `global_grants` tables to determine whether a user can perform an administrative operation.

The `FILE` privilege also is specified only in the `user` table. It is not an administrative privilege as such, but a user's ability to read or write files on the server host is independent of the database being accessed.

#### Grant Table Concurrency

To permit concurrent DML and DDL operations on MySQL grant tables, read operations that previously acquired row locks on MySQL grant tables are executed as non-locking reads. Operations that are performed as non-locking reads on MySQL grant tables include:

* `SELECT` statements and other read-only statements that read data from grant tables through join lists and subqueries, including `SELECT ... FOR SHARE` statements, using any transaction isolation level.

* DML operations that read data from grant tables (through join lists or subqueries) but do not modify them, using any transaction isolation level.

Statements that no longer acquire row locks when reading data from grant tables report a warning if executed while using statement-based replication.

When using -`binlog_format=mixed`, DML operations that read data from grant tables are written to the binary log as row events to make the operations safe for mixed-mode replication.

`SELECT ... FOR SHARE` statements that read data from grant tables report a warning. With the `FOR SHARE` clause, read locks are not supported on grant tables.

DML operations that read data from grant tables and are executed using the `SERIALIZABLE` isolation level report a warning. Read locks that would normally be acquired when using the `SERIALIZABLE` isolation level are not supported on grant tables.
