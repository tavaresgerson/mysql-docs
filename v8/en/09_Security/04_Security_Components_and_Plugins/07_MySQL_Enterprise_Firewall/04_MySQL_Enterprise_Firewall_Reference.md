#### 8.4.7.4 MySQL Enterprise Firewall Reference

The following sections provide a reference to MySQL Enterprise Firewall elements:

* [MySQL Enterprise Firewall Tables](firewall-reference.html#firewall-tables "MySQL Enterprise Firewall Tables")
* [MySQL Enterprise Firewall Stored Procedures](firewall-reference.html#firewall-stored-routines "MySQL Enterprise Firewall Stored Procedures")
* [MySQL Enterprise Firewall Administrative Functions](firewall-reference.html#firewall-functions "MySQL Enterprise Firewall Administrative Functions")
* [MySQL Enterprise Firewall System Variables](firewall-reference.html#firewall-system-variables "MySQL Enterprise Firewall System Variables")
* [MySQL Enterprise Firewall Status Variables](firewall-reference.html#firewall-status-variables "MySQL Enterprise Firewall Status Variables")

##### MySQL Enterprise Firewall Tables

MySQL Enterprise Firewall maintains profile information on a per-group and
per-account basis, using tables in the firewall database for
persistent storage and Information Schema and Performance
Schema tables to provide views into in-memory cached data.
When enabled, the firewall bases operational decisions on the
cached data. The firewall database can be the
`mysql` system database or a custom schema
(see [Installing MySQL Enterprise Firewall](firewall-installation.html#firewall-install "Installing MySQL Enterprise Firewall")).

Tables in the firewall database are covered in this section.
For information about MySQL Enterprise Firewall Information Schema and
Performance Schema tables, see
[Section 28.7, “INFORMATION\_SCHEMA MySQL Enterprise Firewall Tables”](firewall-information-schema-tables.html "28.7 INFORMATION_SCHEMA MySQL Enterprise Firewall Tables"), and
[Section 29.12.17, “Performance Schema Firewall Tables”](performance-schema-firewall-tables.html "29.12.17 Performance Schema Firewall Tables"),
respectively.

* [Firewall Group Profile Tables](firewall-reference.html#firewall-tables-group "Firewall Group Profile Tables")
* [Firewall Account Profile Tables](firewall-reference.html#firewall-tables-account "Firewall Account Profile Tables")

###### Firewall Group Profile Tables

As of MySQL 8.0.23, MySQL Enterprise Firewall maintains group profile information
using tables in the `mysql` system database
for persistent storage and Performance Schema tables to
provide views into in-memory cached data.

Each system and Performance Schema table is accessible only by
accounts that have the [`SELECT`](privileges-provided.html#priv_select)
privilege for it.

The `mysql.firewall_groups` table lists names
and operational modes of registered firewall group profiles.
The table has the following columns (with the corresponding
Performance Schema
[`firewall_groups`](performance-schema-firewall-groups-table.html "29.12.17.1 The firewall_groups Table") table having
similar but not necessarily identical columns):

* `NAME`

  The group profile name.

* `MODE`

  The current operational mode for the profile. Permitted
  mode values are `OFF`,
  `DETECTING`,
  `PROTECTING`, and
  `RECORDING`. For details about their
  meanings, see [Firewall Concepts](firewall-usage.html#firewall-concepts "Firewall Concepts").

* `USERHOST`

  The training account for the group profile, to be used
  when the profile is in `RECORDING` mode.
  The value is `NULL`, or a
  non-`NULL` account that has the format
  `user_name@host_name`:

  + If the value is `NULL`, the firewall
    records allowlist rules for statements received from
    any account that is a member of the group.

  + If the value is non-`NULL`, the
    firewall records allowlist rules only for statements
    received from the named account (which should be a
    member of the group).

The `mysql.firewall_group_allowlist` table
lists allowlist rules of registered firewall group profiles.
The table has the following columns (with the corresponding
Performance Schema
[`firewall_group_allowlist`](performance-schema-firewall-group-allowlist-table.html "29.12.17.2 The firewall_group_allowlist Table") table
having similar but not necessarily identical columns):

* `NAME`

  The group profile name.

* `RULE`

  A normalized statement indicating an acceptable statement
  pattern for the profile. A profile allowlist is the union
  of its rules.

* `ID`

  An integer column that is a primary key for the table.

The `mysql.firewall_membership` table lists
the members (accounts) of registered firewall group profiles.
The table has the following columns (with the corresponding
Performance Schema
[`firewall_membership`](performance-schema-firewall-membership-table.html "29.12.17.3 The firewall_membership Table") table having
similar but not necessarily identical columns):

* `GROUP_ID`

  The group profile name.

* `MEMBER_ID`

  The name of an account that is a member of the profile.

###### Firewall Account Profile Tables

MySQL Enterprise Firewall maintains account profile information using tables in
the `mysql` system database for persistent
storage and `INFORMATION_SCHEMA` tables to
provide views into in-memory cached data.

Each `mysql` system database table is
accessible only by accounts that have the
[`SELECT`](privileges-provided.html#priv_select) privilege for it. The
`INFORMATION_SCHEMA` tables are accessible by
anyone.

As of MySQL 8.0.26, these tables are deprecated and subject to
removal in a future MySQL version. See
[Migrating Account Profiles to Group Profiles](firewall-usage.html#firewall-account-profile-migration "Migrating Account Profiles to Group Profiles").

The `mysql.firewall_users` table lists names
and operational modes of registered firewall account profiles.
The table has the following columns (with the corresponding
[`MYSQL_FIREWALL_USERS`](information-schema-mysql-firewall-users-table.html "28.7.2 The INFORMATION_SCHEMA MYSQL_FIREWALL_USERS Table") table having
similar but not necessarily identical columns):

* `USERHOST`

  The account profile name. Each account name has the format
  `user_name@host_name`.

* `MODE`

  The current operational mode for the profile. Permitted
  mode values are `OFF`,
  `DETECTING`,
  `PROTECTING`,
  `RECORDING`, and
  `RESET`. For details about their
  meanings, see [Firewall Concepts](firewall-usage.html#firewall-concepts "Firewall Concepts").

The `mysql.firewall_whitelist` table lists
allowlist rules of registered firewall account profiles. The
table has the following columns (with the corresponding
[`MYSQL_FIREWALL_WHITELIST`](information-schema-mysql-firewall-whitelist-table.html "28.7.3 The INFORMATION_SCHEMA MYSQL_FIREWALL_WHITELIST Table") table
having similar but not necessarily identical columns):

* `USERHOST`

  The account profile name. Each account name has the format
  `user_name@host_name`.

* `RULE`

  A normalized statement indicating an acceptable statement
  pattern for the profile. A profile allowlist is the union
  of its rules.

* `ID`

  An integer column that is a primary key for the table.
  This column was added in MySQL 8.0.12.

##### MySQL Enterprise Firewall Stored Procedures

MySQL Enterprise Firewall stored procedures perform tasks such as registering
profiles with the firewall, establishing their operational
mode, and managing transfer of firewall data between the cache
and persistent storage. These procedures invoke administrative
functions that provide an API for lower-level tasks.

Firewall stored procedures are created in the
`mysql` system database. To invoke a firewall
stored procedure, either do so while `mysql`
is the default database, or qualify the procedure name with
the database name. For example:

```
CALL mysql.sp_set_firewall_group_mode(group, mode);
```

* [Firewall Group Profile Stored Procedures](firewall-reference.html#firewall-stored-routines-group "Firewall Group Profile Stored Procedures")
* [Firewall Account Profile Stored Procedures](firewall-reference.html#firewall-stored-routines-account "Firewall Account Profile Stored Procedures")
* [Firewall Miscellaneous Stored Procedures](firewall-reference.html#firewall-stored-routines-miscellaneous "Firewall Miscellaneous Stored Procedures")

###### Firewall Group Profile Stored Procedures

These stored procedures perform management operations on
firewall group profiles:

* `sp_firewall_group_delist(group,
  user)`

  This stored procedure removes an account from a firewall
  group profile.

  If the call succeeds, the change in group membership is
  made to both the in-memory cache and persistent storage.

  Arguments:

  + *`group`*: The name of the
    affected group profile.

  + *`user`*: The account to
    remove, as a string in
    `user_name@host_name`
    format.

  Example:

  ```
  CALL sp_firewall_group_delist('g', 'fwuser@localhost');
  ```

  This procedure was added in MySQL 8.0.23.

* `sp_firewall_group_enlist(group,
  user)`

  This stored procedure adds an account to a firewall group
  profile. It is not necessary to register the account
  itself with the firewall before adding the account to the
  group.

  If the call succeeds, the change in group membership is
  made to both the in-memory cache and persistent storage.

  Arguments:

  + *`group`*: The name of the
    affected group profile.

  + *`user`*: The account to add,
    as a string in
    `user_name@host_name`
    format.

  Example:

  ```
  CALL sp_firewall_group_enlist('g', 'fwuser@localhost');
  ```

  This procedure was added in MySQL 8.0.23.

* `sp_reload_firewall_group_rules(group)`

  This stored procedure provides control over firewall
  operation for individual group profiles. The procedure
  uses firewall administrative functions to reload the
  in-memory rules for a group profile from the rules stored
  in the `mysql.firewall_group_allowlist`
  table.

  Arguments:

  + *`group`*: The name of the
    affected group profile.

  Example:

  ```
  CALL sp_reload_firewall_group_rules('myapp');
  ```

  Warning

  This procedure clears the group profile in-memory
  allowlist rules before reloading them from persistent
  storage, and sets the profile mode to
  `OFF`. If the profile mode was not
  `OFF` prior to the
  `sp_reload_firewall_group_rules()`
  call, use
  `sp_set_firewall_group_mode()` to
  restore its previous mode after reloading the rules. For
  example, if the profile was in
  `PROTECTING` mode, that is no longer
  true after calling
  `sp_reload_firewall_group_rules()` and
  you must set it to `PROTECTING` again
  explicitly.

  This procedure was added in MySQL 8.0.23.

* `sp_set_firewall_group_mode(group,
  mode)`

  This stored procedure establishes the operational mode for
  a firewall group profile, after registering the profile
  with the firewall if it was not already registered. The
  procedure also invokes firewall administrative functions
  as necessary to transfer firewall data between the cache
  and persistent storage. This procedure may be called even
  if the `mysql_firewall_mode` system
  variable is `OFF`, although setting the
  mode for a profile has no operational effect until the
  firewall is enabled.

  If the profile previously existed, any recording
  limitation for it remains unchanged. To set or clear the
  limitation, call
  `sp_set_firewall_group_mode_and_user()`
  instead.

  Arguments:

  + *`group`*: The name of the
    affected group profile.

  + *`mode`*: The operational mode
    for the profile, as a string. Permitted mode values
    are `OFF`,
    `DETECTING`,
    `PROTECTING`, and
    `RECORDING`. For details about their
    meanings, see [Firewall Concepts](firewall-usage.html#firewall-concepts "Firewall Concepts").

  Example:

  ```
  CALL sp_set_firewall_group_mode('myapp', 'PROTECTING');
  ```

  This procedure was added in MySQL 8.0.23.

* `sp_set_firewall_group_mode_and_user(group,
  mode,
  user)`

  This stored procedure registers a group with the firewall
  and establishes its operational mode, similar to
  `sp_set_firewall_group_mode()`, but also
  specifies the training account to be used when the group
  is in `RECORDING` mode.

  Arguments:

  + *`group`*: The name of the
    affected group profile.

  + *`mode`*: The operational mode
    for the profile, as a string. Permitted mode values
    are `OFF`,
    `DETECTING`,
    `PROTECTING`, and
    `RECORDING`. For details about their
    meanings, see [Firewall Concepts](firewall-usage.html#firewall-concepts "Firewall Concepts").

  + *`user`*: The training account
    for the group profile, to be used when the profile is
    in `RECORDING` mode. The value is
    `NULL`, or a
    non-`NULL` account that has the
    format
    `user_name@host_name`:

    - If the value is `NULL`, the
      firewall records allowlist rules for statements
      received from any account that is a member of the
      group.

    - If the value is non-`NULL`, the
      firewall records allowlist rules only for
      statements received from the named account (which
      should be a member of the group).

  Example:

  ```
  CALL sp_set_firewall_group_mode_and_user('myapp', 'RECORDING', 'myapp_user1@localhost');
  ```

  This procedure was added in MySQL 8.0.23.

###### Firewall Account Profile Stored Procedures

These stored procedures perform management operations on
firewall account profiles:

* `sp_reload_firewall_rules(user)`

  This stored procedure provides control over firewall
  operation for individual account profiles. The procedure
  uses firewall administrative functions to reload the
  in-memory rules for an account profile from the rules
  stored in the `mysql.firewall_whitelist`
  table.

  Arguments:

  + *`user`*: The name of the
    affected account profile, as a string in
    `user_name@host_name`
    format.

  Example:

  ```
  CALL mysql.sp_reload_firewall_rules('fwuser@localhost');
  ```

  Warning

  This procedure clears the account profile in-memory
  allowlist rules before reloading them from persistent
  storage, and sets the profile mode to
  `OFF`. If the profile mode was not
  `OFF` prior to the
  `sp_reload_firewall_rules()` call, use
  `sp_set_firewall_mode()` to restore its
  previous mode after reloading the rules. For example, if
  the profile was in `PROTECTING` mode,
  that is no longer true after calling
  `sp_reload_firewall_rules()` and you
  must set it to `PROTECTING` again
  explicitly.

  As of MySQL 8.0.26, this procedure is deprecated and
  subject to removal in a future MySQL version. See
  [Migrating Account Profiles to Group Profiles](firewall-usage.html#firewall-account-profile-migration "Migrating Account Profiles to Group Profiles").

* `sp_set_firewall_mode(user,
  mode)`

  This stored procedure establishes the operational mode for
  a firewall account profile, after registering the profile
  with the firewall if it was not already registered. The
  procedure also invokes firewall administrative functions
  as necessary to transfer firewall data between the cache
  and persistent storage. This procedure may be called even
  if the `mysql_firewall_mode` system
  variable is `OFF`, although setting the
  mode for a profile has no operational effect until the
  firewall is enabled.

  Arguments:

  + *`user`*: The name of the
    affected account profile, as a string in
    `user_name@host_name`
    format.

  + *`mode`*: The operational mode
    for the profile, as a string. Permitted mode values
    are `OFF`,
    `DETECTING`,
    `PROTECTING`,
    `RECORDING`, and
    `RESET`. For details about their
    meanings, see [Firewall Concepts](firewall-usage.html#firewall-concepts "Firewall Concepts").

  Switching an account profile to any mode but
  `RECORDING` synchronizes its firewall
  cache data to the `mysql` system database
  tables that provide persistent underlying storage.
  Switching the mode from `OFF` to
  `RECORDING` reloads the allowlist from
  the `mysql.firewall_whitelist` table into
  the cache.

  If an account profile has an empty allowlist, its mode
  cannot be set to `PROTECTING` because the
  profile would reject every statement, effectively
  prohibiting the account from executing statements. In
  response to such a mode-setting attempt, the firewall
  produces a diagnostic message that is returned as a result
  set rather than as an SQL error:

  ```
  mysql> CALL mysql.sp_set_firewall_mode('a@b','PROTECTING');
  +----------------------------------------------------------------------+
  | set_firewall_mode(arg_userhost, arg_mode)                            |
  +----------------------------------------------------------------------+
  | ERROR: PROTECTING mode requested for a@b but the allowlist is empty. |
  +----------------------------------------------------------------------+
  ```

  As of MySQL 8.0.26, this procedure is deprecated and
  subject to removal in a future MySQL version. See
  [Migrating Account Profiles to Group Profiles](firewall-usage.html#firewall-account-profile-migration "Migrating Account Profiles to Group Profiles").

###### Firewall Miscellaneous Stored Procedures

These stored procedures perform miscellaneous firewall
management operations.

* `sp_migrate_firewall_user_to_group(user,
  group)`

  As of MySQL 8.0.26, account profiles are deprecated
  because group profiles can do anything account profiles
  can do. The
  `sp_migrate_firewall_user_to_group()`
  stored procedure converts a firewall account profile to a
  group profile with the account as its single enlisted
  member. Run the
  `firewall_profile_migration.sql` script
  to install it. The conversion procedure is discussed in
  [Migrating Account Profiles to Group Profiles](firewall-usage.html#firewall-account-profile-migration "Migrating Account Profiles to Group Profiles").

  This routine requires the
  [`FIREWALL_ADMIN`](privileges-provided.html#priv_firewall-admin) privilege.

  Arguments:

  + *`user`*: The name of the
    account profile to convert to a group profile, as a
    string in
    `user_name@host_name`
    format. The account profile must exist, and must not
    currently be in `RECORDING` mode.

  + *`group`*: The name of the new
    group profile, which must not already exist. The new
    group profile has the named account as its single
    enlisted member, and that member is set as the group
    training account. The group profile operational mode
    is taken from the account profile operational mode.

  Example:

  ```
  CALL sp_migrate_firewall_user_to_group('fwuser@localhost', 'mygroup);
  ```

  This procedure was added in MySQL 8.0.26.

##### MySQL Enterprise Firewall Administrative Functions

MySQL Enterprise Firewall administrative functions provide an API for lower-level
tasks such as synchronizing the firewall cache with the
underlying system tables.

*Under normal operation, these functions are invoked
by the firewall stored procedures, not directly by
users.* For that reason, these function descriptions
do not include details such as information about their
arguments and return types.

* [Firewall Group Profile Functions](firewall-reference.html#firewall-functions-group "Firewall Group Profile Functions")
* [Firewall Account Profile Functions](firewall-reference.html#firewall-functions-account "Firewall Account Profile Functions")
* [Firewall Miscellaneous Functions](firewall-reference.html#firewall-functions-miscellaneous "Firewall Miscellaneous Functions")

###### Firewall Group Profile Functions

These functions perform management operations on firewall
group profiles:

* [`firewall_group_delist(group,
  user)`](firewall-reference.html#function_firewall-group-delist)

  This function removes an account from a group profile. It
  requires the [`FIREWALL_ADMIN`](privileges-provided.html#priv_firewall-admin)
  privilege.

  Example:

  ```
  SELECT firewall_group_delist('g', 'fwuser@localhost');
  ```

  This function was added in MySQL 8.0.23.

* [`firewall_group_enlist(group,
  user)`](firewall-reference.html#function_firewall-group-enlist)

  This function adds an account to a group profile. It
  requires the [`FIREWALL_ADMIN`](privileges-provided.html#priv_firewall-admin)
  privilege.

  It is not necessary to register the account itself with
  the firewall before adding the account to the group.

  Example:

  ```
  SELECT firewall_group_enlist('g', 'fwuser@localhost');
  ```

  This function was added in MySQL 8.0.23.

* [`read_firewall_group_allowlist(group,
  rule)`](firewall-reference.html#function_read-firewall-group-allowlist)

  This aggregate function updates the recorded-statement
  cache for the named group profile through a
  [`SELECT`](select.html "15.2.13 SELECT Statement") statement on the
  `mysql.firewall_group_allowlist` table.
  It requires the
  [`FIREWALL_ADMIN`](privileges-provided.html#priv_firewall-admin) privilege.

  Example:

  ```
  SELECT read_firewall_group_allowlist('my_fw_group', fgw.rule)
  FROM mysql.firewall_group_allowlist AS fgw
  WHERE NAME = 'my_fw_group';
  ```

  This function was added in MySQL 8.0.23.

* [`read_firewall_groups(group,
  mode,
  user)`](firewall-reference.html#function_read-firewall-groups)

  This aggregate function updates the firewall group profile
  cache through a [`SELECT`](select.html "15.2.13 SELECT Statement")
  statement on the `mysql.firewall_groups`
  table. It requires the
  [`FIREWALL_ADMIN`](privileges-provided.html#priv_firewall-admin) privilege.

  Example:

  ```
  SELECT read_firewall_groups('g', 'RECORDING', 'fwuser@localhost')
  FROM mysql.firewall_groups;
  ```

  This function was added in MySQL 8.0.23.

* [`set_firewall_group_mode(group,
  mode[,
  user])`](firewall-reference.html#function_set-firewall-group-mode)

  This function manages the group profile cache, establishes
  the profile operational mode, and optionally specifies the
  profile training account. It requires the
  [`FIREWALL_ADMIN`](privileges-provided.html#priv_firewall-admin) privilege.

  If the optional *`user`* argument
  is not given, any previous *`user`*
  setting for the profile remains unchanged. To change the
  setting, call the function with a third argument.

  If the optional *`user`* argument
  is given, it specifies the training account for the group
  profile, to be used when the profile is in
  `RECORDING` mode. The value is
  `NULL`, or a non-`NULL`
  account that has the format
  `user_name@host_name`:

  + If the value is `NULL`, the firewall
    records allowlist rules for statements received from
    any account that is a member of the group.

  + If the value is non-`NULL`, the
    firewall records allowlist rules only for statements
    received from the named account (which should be a
    member of the group).

  Example:

  ```
  SELECT set_firewall_group_mode('g', 'DETECTING');
  ```

  This function was added in MySQL 8.0.23.

###### Firewall Account Profile Functions

These functions perform management operations on firewall
account profiles:

* [`read_firewall_users(user,
  mode)`](firewall-reference.html#function_read-firewall-users)

  This aggregate function updates the firewall account
  profile cache through a `SELECT`
  statement on the `mysql.firewall_users`
  table. It requires the
  [`FIREWALL_ADMIN`](privileges-provided.html#priv_firewall-admin) privilege or
  the deprecated [`SUPER`](privileges-provided.html#priv_super)
  privilege.

  Example:

  ```
  SELECT read_firewall_users('fwuser@localhost', 'RECORDING')
  FROM mysql.firewall_users;
  ```

  As of MySQL 8.0.26, this function is deprecated and
  subject to removal in a future MySQL version. See
  [Migrating Account Profiles to Group Profiles](firewall-usage.html#firewall-account-profile-migration "Migrating Account Profiles to Group Profiles").

* [`read_firewall_whitelist(user,
  rule)`](firewall-reference.html#function_read-firewall-whitelist)

  This aggregate function updates the recorded-statement
  cache for the named account profile through a
  `SELECT` statement on the
  `mysql.firewall_whitelist` table. It
  requires the [`FIREWALL_ADMIN`](privileges-provided.html#priv_firewall-admin)
  privilege or the deprecated
  [`SUPER`](privileges-provided.html#priv_super) privilege.

  Example:

  ```
  SELECT read_firewall_whitelist('fwuser@localhost', fw.rule)
  FROM mysql.firewall_whitelist AS fw
  WHERE USERHOST = 'fwuser@localhost';
  ```

  As of MySQL 8.0.26, this function is deprecated and
  subject to removal in a future MySQL version. See
  [Migrating Account Profiles to Group Profiles](firewall-usage.html#firewall-account-profile-migration "Migrating Account Profiles to Group Profiles").

* [`set_firewall_mode(user,
  mode)`](firewall-reference.html#function_set-firewall-mode)

  This function manages the account profile cache and
  establishes the profile operational mode. It requires the
  [`FIREWALL_ADMIN`](privileges-provided.html#priv_firewall-admin) privilege or
  the deprecated [`SUPER`](privileges-provided.html#priv_super)
  privilege.

  Example:

  ```
  SELECT set_firewall_mode('fwuser@localhost', 'RECORDING');
  ```

  As of MySQL 8.0.26, this function is deprecated and
  subject to removal in a future MySQL version. See
  [Migrating Account Profiles to Group Profiles](firewall-usage.html#firewall-account-profile-migration "Migrating Account Profiles to Group Profiles").

###### Firewall Miscellaneous Functions

These functions perform miscellaneous firewall operations:

* [`mysql_firewall_flush_status()`](firewall-reference.html#function_mysql-firewall-flush-status)

  This function resets several firewall status variables to
  0:

  + [`Firewall_access_denied`](firewall-reference.html#statvar_Firewall_access_denied)
  + [`Firewall_access_granted`](firewall-reference.html#statvar_Firewall_access_granted)
  + [`Firewall_access_suspicious`](firewall-reference.html#statvar_Firewall_access_suspicious)

  This function requires the
  [`FIREWALL_ADMIN`](privileges-provided.html#priv_firewall-admin) privilege or
  the deprecated [`SUPER`](privileges-provided.html#priv_super)
  privilege.

  Example:

  ```
  SELECT mysql_firewall_flush_status();
  ```

* [`normalize_statement(stmt)`](firewall-reference.html#function_normalize-statement)

  This function normalizes an SQL statement into the digest
  form used for allowlist rules. It requires the
  [`FIREWALL_ADMIN`](privileges-provided.html#priv_firewall-admin) privilege or
  the deprecated [`SUPER`](privileges-provided.html#priv_super)
  privilege.

  Example:

  ```
  SELECT normalize_statement('SELECT * FROM t1 WHERE c1 > 2');
  ```

  Note

  The same digest functionality is available outside
  firewall context using the
  [`STATEMENT_DIGEST_TEXT()`](encryption-functions.html#function_statement-digest-text)
  SQL function.

##### MySQL Enterprise Firewall System Variables

MySQL Enterprise Firewall supports the following system variables. Use them to
configure firewall operation. These variables are unavailable
unless the firewall is installed (see
[Section 8.4.7.2, “Installing or Uninstalling MySQL Enterprise Firewall”](firewall-installation.html "8.4.7.2 Installing or Uninstalling MySQL Enterprise Firewall")).

* [`mysql_firewall_mode`](firewall-reference.html#sysvar_mysql_firewall_mode)

  <table frame="box" rules="all" summary="Properties for mysql_firewall_mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--mysql-firewall-mode[={OFF|ON}]</code></td>
</tr><tr><th>System Variable</th>
<td><code class="literal"><a class="link" href="firewall-reference.html#sysvar_mysql_firewall_mode">mysql_firewall_mode</a></code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>Yes</td>
</tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th>
<td>No</td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">ON</code></td>
</tr></tbody></table>

  Whether MySQL Enterprise Firewall is enabled (the default) or disabled.

* [`mysql_firewall_trace`](firewall-reference.html#sysvar_mysql_firewall_trace)

  <table frame="box" rules="all" summary="Properties for mysql_firewall_trace"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--mysql-firewall-trace[={OFF|ON}]</code></td>
</tr><tr><th>System Variable</th>
<td><code class="literal"><a class="link" href="firewall-reference.html#sysvar_mysql_firewall_trace">mysql_firewall_trace</a></code></td>
</tr><tr><th>Scope</th>
<td>Global</td>
</tr><tr><th>Dynamic</th>
<td>Yes</td>
</tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th>
<td>No</td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">OFF</code></td>
</tr></tbody></table>

  Whether the MySQL Enterprise Firewall trace is enabled or disabled (the
  default). When
  [`mysql_firewall_trace`](firewall-reference.html#sysvar_mysql_firewall_trace) is
  enabled, for `PROTECTING` mode, the
  firewall writes rejected statements to the error log.

##### MySQL Enterprise Firewall Status Variables

MySQL Enterprise Firewall supports the following status variables. Use them to
obtain information about firewall operational status. These
variables are unavailable unless the firewall is installed
(see [Section 8.4.7.2, “Installing or Uninstalling MySQL Enterprise Firewall”](firewall-installation.html "8.4.7.2 Installing or Uninstalling MySQL Enterprise Firewall")). Firewall status
variables are set to 0 whenever the
`MYSQL_FIREWALL` plugin is installed or the
server is started. Many of them are reset to zero by the
[`mysql_firewall_flush_status()`](firewall-reference.html#function_mysql-firewall-flush-status)
function (see [MySQL Enterprise Firewall Administrative Functions](firewall-reference.html#firewall-functions "MySQL Enterprise Firewall Administrative Functions")).

* [`Firewall_access_denied`](firewall-reference.html#statvar_Firewall_access_denied)

  The number of statements rejected by MySQL Enterprise Firewall.

* [`Firewall_access_granted`](firewall-reference.html#statvar_Firewall_access_granted)

  The number of statements accepted by MySQL Enterprise Firewall.

* [`Firewall_access_suspicious`](firewall-reference.html#statvar_Firewall_access_suspicious)

  The number of statements logged by MySQL Enterprise Firewall as suspicious
  for users who are in `DETECTING` mode.

* [`Firewall_cached_entries`](firewall-reference.html#statvar_Firewall_cached_entries)

  The number of statements recorded by MySQL Enterprise Firewall, including
  duplicates.