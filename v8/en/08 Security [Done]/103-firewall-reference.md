#### 8.4.7.4 MySQL Enterprise Firewall Reference

The following sections provide a reference to MySQL Enterprise Firewall elements:

*  MySQL Enterprise Firewall Tables
*  MySQL Enterprise Firewall Stored Procedures
*  MySQL Enterprise Firewall Administrative Functions
*  MySQL Enterprise Firewall System Variables
*  MySQL Enterprise Firewall Status Variables

##### MySQL Enterprise Firewall Tables

MySQL Enterprise Firewall maintains profile information on a per-group and per-account basis, using tables in the firewall database for persistent storage and Information Schema and Performance Schema tables to provide views into in-memory cached data. When enabled, the firewall bases operational decisions on the cached data. The firewall database can be the `mysql` system database or a custom schema (see  Installing MySQL Enterprise Firewall).

Tables in the firewall database are covered in this section. For information about MySQL Enterprise Firewall Information Schema and Performance Schema tables, see Section 28.7, “INFORMATION\_SCHEMA MySQL Enterprise Firewall Tables”, and Section 29.12.17, “Performance Schema Firewall Tables”, respectively.

*  Firewall Group Profile Tables
*  Firewall Account Profile Tables

###### Firewall Group Profile Tables

MySQL Enterprise Firewall maintains group profile information using tables in the firewall database (`mysql` or custom) for persistent storage and Performance Schema tables to provide views into in-memory cached data.

Each system and Performance Schema table is accessible only by accounts that have the  `SELECT` privilege for it.

The `firewall-database.firewall_groups` table lists names and operational modes of registered firewall group profiles. The table has the following columns (with the corresponding Performance Schema `firewall_groups` table having similar but not necessarily identical columns):

* `NAME`

  The group profile name.
* `MODE`

  The current operational mode for the profile. Permitted mode values are `OFF`, `DETECTING`, `PROTECTING`, and `RECORDING`. For details about their meanings, see  Firewall Concepts.
* `USERHOST`

  The training account for the group profile, to be used when the profile is in `RECORDING` mode. The value is `NULL`, or a non-`NULL` account that has the format `user_name@host_name`:

  + If the value is `NULL`, the firewall records allowlist rules for statements received from any account that is a member of the group.
  + If the value is non-`NULL`, the firewall records allowlist rules only for statements received from the named account (which should be a member of the group).

The `firewall-database.firewall_group_allowlist` table lists allowlist rules of registered firewall group profiles. The table has the following columns (with the corresponding Performance Schema `firewall_group_allowlist` table having similar but not necessarily identical columns):

* `NAME`

  The group profile name.
* `RULE`

  A normalized statement indicating an acceptable statement pattern for the profile. A profile allowlist is the union of its rules.
* `ID`

  An integer column that is a primary key for the table.

The `firewall-database.firewall_membership` table lists the members (accounts) of registered firewall group profiles. The table has the following columns (with the corresponding Performance Schema `firewall_membership` table having similar but not necessarily identical columns):

* `GROUP_ID`

  The group profile name.
* `MEMBER_ID`

  The name of an account that is a member of the profile.

###### Firewall Account Profile Tables

MySQL Enterprise Firewall maintains account profile information using tables in the firewall database for persistent storage and `INFORMATION_SCHEMA` tables to provide views into in-memory cached data. The firewall database can be the `mysql` system database or a custom schema (see  Installing MySQL Enterprise Firewall).

Each default database table is accessible only by accounts that have the  `SELECT` privilege for it. The `INFORMATION_SCHEMA` tables are accessible by anyone.

These tables are deprecated, and subject to removal in a future MySQL version. See Migrating Account Profiles to Group Profiles.

The `firewall-database.firewall_users` table lists names and operational modes of registered firewall account profiles. The table has the following columns (with the corresponding `MYSQL_FIREWALL_USERS` table having similar but not necessarily identical columns):

* `USERHOST`

  The account profile name. Each account name has the format `user_name@host_name`.
* `MODE`

  The current operational mode for the profile. Permitted mode values are `OFF`, `DETECTING`, `PROTECTING`, `RECORDING`, and `RESET`. For details about their meanings, see  Firewall Concepts.

The `firewall-database.firewall_whitelist` table lists allowlist rules of registered firewall account profiles. The table has the following columns (with the corresponding `MYSQL_FIREWALL_WHITELIST` table having similar but not necessarily identical columns):

* `USERHOST`

  The account profile name. Each account name has the format `user_name@host_name`.
* `RULE`

  A normalized statement indicating an acceptable statement pattern for the profile. A profile allowlist is the union of its rules.
* `ID`

  An integer column that is a primary key for the table.

##### MySQL Enterprise Firewall Stored Procedures

MySQL Enterprise Firewall stored procedures perform tasks such as registering profiles with the firewall, establishing their operational mode, and managing transfer of firewall data between the cache and persistent storage. These procedures invoke administrative functions that provide an API for lower-level tasks.

Firewall stored procedures are created in the firewall database. The firewall database can be the `mysql` system database or a custom schema (see  Installing MySQL Enterprise Firewall).

To invoke a firewall stored procedure, either do so while the specified firewall database is the default database, or qualify the procedure name with the database name. For example, if `mysql` is the firewall database:

```
CALL mysql.sp_set_firewall_group_mode(group, mode);
```

In MySQL 8.4, firewall stored procedures are transactional; if an error occurs during execution of a firewall stored procedure, all changes made by it up to that point are rolled back, and an error is reported.

::: info Note

If you have installed MySQL Enterprise Firewall in a custom schema, then make appropriate substitution for your system. For example, if the firewall is installed in the `fwdb` schema, then execute the stored procedures like this:

```
CALL fwdb.sp_set_firewall_group_mode(group, mode);
```

:::

*  Firewall Group Profile Stored Procedures
*  Firewall Account Profile Stored Procedures
*  Firewall Miscellaneous Stored Procedures

###### Firewall Group Profile Stored Procedures

These stored procedures perform management operations on firewall group profiles:

* `sp_firewall_group_delist(group, user)`

  This stored procedure removes an account from a firewall group profile.

  If the call succeeds, the change in group membership is made to both the in-memory cache and persistent storage.

  Arguments:

  + *`group`*: The name of the affected group profile.
  + *`user`*: The account to remove, as a string in `user_name@host_name` format.

  Example:

  ```
  CALL mysql.sp_firewall_group_delist('g', 'fwuser@localhost');
  ```
* `sp_firewall_group_enlist(group, user)`

  This stored procedure adds an account to a firewall group profile. It is not necessary to register the account itself with the firewall before adding the account to the group.

  If the call succeeds, the change in group membership is made to both the in-memory cache and persistent storage.

  Arguments:

  + *`group`*: The name of the affected group profile.
  + *`user`*: The account to add, as a string in `user_name@host_name` format.

  Example:

  ```
  CALL mysql.sp_firewall_group_enlist('g', 'fwuser@localhost');
  ```
* `sp_reload_firewall_group_rules(group)`

  This stored procedure provides control over firewall operation for individual group profiles. The procedure uses firewall administrative functions to reload the in-memory rules for a group profile from the rules stored in the `firewall-database.firewall_group_allowlist` table.

  Arguments:

  + *`group`*: The name of the affected group profile.

  Example:

  ```
  CALL mysql.sp_reload_firewall_group_rules('myapp');
  ```

  Warning

  This procedure clears the group profile in-memory allowlist rules before reloading them from persistent storage, and sets the profile mode to `OFF`. If the profile mode was not `OFF` prior to the `sp_reload_firewall_group_rules()` call, use `sp_set_firewall_group_mode()` to restore its previous mode after reloading the rules. For example, if the profile was in `PROTECTING` mode, that is no longer true after calling `sp_reload_firewall_group_rules()` and you must set it to `PROTECTING` again explicitly.
* `sp_set_firewall_group_mode(group, mode)`

  This stored procedure establishes the operational mode for a firewall group profile, after registering the profile with the firewall if it was not already registered. The procedure also invokes firewall administrative functions as necessary to transfer firewall data between the cache and persistent storage. This procedure may be called even if the `mysql_firewall_mode` system variable is `OFF`, although setting the mode for a profile has no operational effect until the firewall is enabled.

  If the profile previously existed, any recording limitation for it remains unchanged. To set or clear the limitation, call `sp_set_firewall_group_mode_and_user()` instead.

  Arguments:

  + *`group`*: The name of the affected group profile.
  + *`mode`*: The operational mode for the profile, as a string. Permitted mode values are `OFF`, `DETECTING`, `PROTECTING`, and `RECORDING`. For details about their meanings, see  Firewall Concepts.

  Example:

  ```
  CALL mysql.sp_set_firewall_group_mode('myapp', 'PROTECTING');
  ```
* `sp_set_firewall_group_mode_and_user(group, mode, user)`

  This stored procedure registers a group with the firewall and establishes its operational mode, similar to `sp_set_firewall_group_mode()`, but also specifies the training account to be used when the group is in `RECORDING` mode.

  Arguments:

  + *`group`*: The name of the affected group profile.
  + *`mode`*: The operational mode for the profile, as a string. Permitted mode values are `OFF`, `DETECTING`, `PROTECTING`, and `RECORDING`. For details about their meanings, see  Firewall Concepts.
  + *`user`*: The training account for the group profile, to be used when the profile is in `RECORDING` mode. The value is `NULL`, or a non-`NULL` account that has the format `user_name@host_name`:

    - If the value is `NULL`, the firewall records allowlist rules for statements received from any account that is a member of the group.
    - If the value is non-`NULL`, the firewall records allowlist rules only for statements received from the named account (which should be a member of the group).

  Example:

  ```
  CALL mysql.sp_set_firewall_group_mode_and_user('myapp', 'RECORDING', 'myapp_user1@localhost');
  ```

###### Firewall Account Profile Stored Procedures

These stored procedures perform management operations on firewall account profiles:

* `sp_reload_firewall_rules(user)`

  This stored procedure provides control over firewall operation for individual account profiles. The procedure uses firewall administrative functions to reload the in-memory rules for an account profile from the rules stored in the `firewall-database.firewall_whitelist` table.

  Arguments:

  + *`user`*: The name of the affected account profile, as a string in `user_name@host_name` format.

  Example:

  ```
  CALL sp_reload_firewall_rules('fwuser@localhost');
  ```

  Warning

  This procedure clears the account profile in-memory allowlist rules before reloading them from persistent storage, and sets the profile mode to `OFF`. If the profile mode was not `OFF` prior to the `sp_reload_firewall_rules()` call, use `sp_set_firewall_mode()` to restore its previous mode after reloading the rules. For example, if the profile was in `PROTECTING` mode, that is no longer true after calling `sp_reload_firewall_rules()` and you must set it to `PROTECTING` again explicitly.

  This procedure is deprecated, and subject to removal in a future MySQL version. See Migrating Account Profiles to Group Profiles.
* `sp_set_firewall_mode(user, mode)`

  This stored procedure establishes the operational mode for a firewall account profile, after registering the profile with the firewall if it was not already registered. The procedure also invokes firewall administrative functions as necessary to transfer firewall data between the cache and persistent storage. This procedure may be called even if the `mysql_firewall_mode` system variable is `OFF`, although setting the mode for a profile has no operational effect until the firewall is enabled.

  Arguments:

  + *`user`*: The name of the affected account profile, as a string in `user_name@host_name` format.
  + *`mode`*: The operational mode for the profile, as a string. Permitted mode values are `OFF`, `DETECTING`, `PROTECTING`, `RECORDING`, and `RESET`. For details about their meanings, see  Firewall Concepts.

  Switching an account profile to any mode but `RECORDING` synchronizes its firewall cache data to the firewall database tables that provide persistent underlying storage (`mysql` or custom). Switching the mode from `OFF` to `RECORDING` reloads the allowlist from the `firewall-database.firewall_whitelist` table into the cache.

  If an account profile has an empty allowlist, its mode cannot be set to `PROTECTING` because the profile would reject every statement, effectively prohibiting the account from executing statements. In response to such a mode-setting attempt, the firewall produces a diagnostic message that is returned as a result set rather than as an SQL error:

  ```
  mysql> CALL sp_set_firewall_mode('a@b','PROTECTING');
  +----------------------------------------------------------------------+
  | set_firewall_mode(arg_userhost, arg_mode)                            |
  +----------------------------------------------------------------------+
  | ERROR: PROTECTING mode requested for a@b but the allowlist is empty. |
  +----------------------------------------------------------------------+
  ```

  This procedure is deprecated, and subject to removal in a future MySQL version. See Migrating Account Profiles to Group Profiles.

###### Firewall Miscellaneous Stored Procedures

These stored procedures perform miscellaneous firewall management operations.

* `sp_migrate_firewall_user_to_group(user, group)`

  The `sp_migrate_firewall_user_to_group()` stored procedure converts a firewall account profile to a group profile with the account as its single enlisted member. Run the `firewall_profile_migration.sql` script to install it. The conversion procedure is discussed in Migrating Account Profiles to Group Profiles.

  This routine requires the `FIREWALL_ADMIN` privilege.

  Arguments:

  + *`user`*: The name of the account profile to convert to a group profile, as a string in `user_name@host_name` format. The account profile must exist, and must not currently be in `RECORDING` mode.
  + *`group`*: The name of the new group profile, which must not already exist. The new group profile has the named account as its single enlisted member, and that member is set as the group training account. The group profile operational mode is taken from the account profile operational mode.

  Example:

  ```
  CALL sp_migrate_firewall_user_to_group('fwuser@localhost', 'mygroup);
  ```

##### MySQL Enterprise Firewall Administrative Functions

MySQL Enterprise Firewall administrative functions provide an API for lower-level tasks such as synchronizing the firewall cache with the underlying system tables.

*Under normal operation, these functions are invoked by the firewall stored procedures, not directly by users.* For that reason, these function descriptions do not include details such as information about their arguments and return types.

*  Firewall Group Profile Functions
*  Firewall Account Profile Functions
*  Firewall Miscellaneous Functions

###### Firewall Group Profile Functions

These functions perform management operations on firewall group profiles:

* `firewall_group_delist(group, user)`

  This function removes an account from a group profile. It requires the  `FIREWALL_ADMIN` privilege.

  Example:

  ```
  SELECT firewall_group_delist('g', 'fwuser@localhost');
  ```
* `firewall_group_enlist(group, user)`

  This function adds an account to a group profile. It requires the  `FIREWALL_ADMIN` privilege.

  It is not necessary to register the account itself with the firewall before adding the account to the group.

  Example:

  ```
  SELECT firewall_group_enlist('g', 'fwuser@localhost');
  ```
* `read_firewall_group_allowlist(group, rule)`

  This aggregate function updates the recorded-statement cache for the named group profile through a `SELECT` statement on the `firewall-database.firewall_group_allowlist` table. It requires the `FIREWALL_ADMIN` privilege.

  Example:

  ```
  SELECT read_firewall_group_allowlist('my_fw_group', fgw.rule)
  FROM mysql.firewall_group_allowlist AS fgw
  WHERE NAME = 'my_fw_group';
  ```
* `read_firewall_groups(group, mode, user)`

  This aggregate function updates the firewall group profile cache through a  `SELECT` statement on the `firewall-database.firewall_groups` table. It requires the `FIREWALL_ADMIN` privilege.

  Example:

  ```
  SELECT read_firewall_groups('g', 'RECORDING', 'fwuser@localhost')
  FROM mysql.firewall_groups;
  ```
* `set_firewall_group_mode(group, mode[, user])`

  This function manages the group profile cache, establishes the profile operational mode, and optionally specifies the profile training account. It requires the `FIREWALL_ADMIN` privilege.

  If the optional *`user`* argument is not given, any previous *`user`* setting for the profile remains unchanged. To change the setting, call the function with a third argument.

  If the optional *`user`* argument is given, it specifies the training account for the group profile, to be used when the profile is in `RECORDING` mode. The value is `NULL`, or a non-`NULL` account that has the format `user_name@host_name`:

  + If the value is `NULL`, the firewall records allowlist rules for statements received from any account that is a member of the group.
  + If the value is non-`NULL`, the firewall records allowlist rules only for statements received from the named account (which should be a member of the group).

  Example:

  ```
  SELECT set_firewall_group_mode('g', 'DETECTING');
  ```

###### Firewall Account Profile Functions

These functions perform management operations on firewall account profiles:

* `read_firewall_users(user, mode)`

  This aggregate function updates the firewall account profile cache through a `SELECT` statement on the `firewall-database.firewall_users` table. It requires the `FIREWALL_ADMIN` privilege or the deprecated  `SUPER` privilege.

  Example:

  ```
  SELECT read_firewall_users('fwuser@localhost', 'RECORDING')
  FROM mysql.firewall_users;
  ```

  This function is deprecated, and subject to removal in a future MySQL version. See Migrating Account Profiles to Group Profiles.
* `read_firewall_whitelist(user, rule)`

  This aggregate function updates the recorded-statement cache for the named account profile through a `SELECT` statement on the `firewall-database.firewall_whitelist` table. It requires the `FIREWALL_ADMIN` privilege or the deprecated  `SUPER` privilege.

  Example:

  ```
  SELECT read_firewall_whitelist('fwuser@localhost', fw.rule)
  FROM mysql.firewall_whitelist AS fw
  WHERE USERHOST = 'fwuser@localhost';
  ```

  This function is deprecated, and subject to removal in a future MySQL version. See Migrating Account Profiles to Group Profiles.
* `set_firewall_mode(user, mode)`

  This function manages the account profile cache and establishes the profile operational mode. It requires the `FIREWALL_ADMIN` privilege or the deprecated  `SUPER` privilege.

  Example:

  ```
  SELECT set_firewall_mode('fwuser@localhost', 'RECORDING');
  ```

  This function is deprecated, and subject to removal in a future MySQL version. See Migrating Account Profiles to Group Profiles.

###### Firewall Miscellaneous Functions

These functions perform miscellaneous firewall operations:

*  `mysql_firewall_flush_status()`

  This function resets several firewall status variables to 0:

  +  `Firewall_access_denied`
  +  `Firewall_access_granted`
  +  `Firewall_access_suspicious`

  This function requires the `FIREWALL_ADMIN` privilege or the deprecated  `SUPER` privilege.

  Example:

  ```
  SELECT mysql_firewall_flush_status();
  ```
*  `normalize_statement(stmt)`

  This function normalizes an SQL statement into the digest form used for allowlist rules. It requires the `FIREWALL_ADMIN` privilege or the deprecated  `SUPER` privilege.

  Example:

  ```
  SELECT normalize_statement('SELECT * FROM t1 WHERE c1 > 2');
  ```

  ::: info Note

  The same digest functionality is available outside firewall context using the `STATEMENT_DIGEST_TEXT()` SQL function.

  :::

##### MySQL Enterprise Firewall System Variables

MySQL Enterprise Firewall supports the following system variables. Use them to configure firewall operation. These variables are unavailable unless the firewall is installed (see Section 8.4.7.2, “Installing or Uninstalling MySQL Enterprise Firewall”).

*  `mysql_firewall_database`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysql-firewall-database[=value]</code></td> </tr><tr><th>System Variable</th> <td><code>mysql_firewall_database</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>mysql</code></td> </tr></tbody></table>

  Specifies the database from which MySQL Enterprise Firewall reads data. Typically, the `MYSQL_FIREWALL` server-side plugin stores its internal data (tables, stored procedures, and functions) in the `mysql` system database, but you can create and use a custom schema instead (see Installing MySQL Enterprise Firewall). This variable permits specifying an alternative database name at startup.
*  `mysql_firewall_mode`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysql-firewall-mode[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>mysql_firewall_mode</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  Whether MySQL Enterprise Firewall is enabled (the default) or disabled.
*  `mysql_firewall_reload_interval_seconds`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysql-firewall-reload-interval-seconds[=value]</code></td> </tr><tr><th>System Variable</th> <td><code>mysql_firewall_reload_interval_seconds</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>60 (unless 0: OFF)</code></td> </tr><tr><th>Maximum Value</th> <td><code>INT_MAX</code></td> </tr><tr><th>Unit</th> <td>seconds</td> </tr></tbody></table>

  Specifies the interval (in seconds) that the server-side plugin uses to reload its internal cache from firewall tables. When `mysql_firewall_reload_interval_seconds` has a value of zero (the default), no periodic reloading of data from tables occurs at runtime. Values between `0` and `60` (1 to 59) are not acknowledged by the plugin. Instead, these values adjust to `60` automatically.

  This variable requires that the `scheduler` component be enabled (`ON`). For more information, see Scheduling Firewall Cache Reloads.
*  `mysql_firewall_trace`

  <table><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysql-firewall-trace[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>mysql_firewall_trace</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Whether the MySQL Enterprise Firewall trace is enabled or disabled (the default). When `mysql_firewall_trace` is enabled, for `PROTECTING` mode, the firewall writes rejected statements to the error log.

##### MySQL Enterprise Firewall Status Variables

MySQL Enterprise Firewall supports the following status variables. Use them to obtain information about firewall operational status. These variables are unavailable unless the firewall is installed (see  Section 8.4.7.2, “Installing or Uninstalling MySQL Enterprise Firewall”). Firewall status variables are set to 0 whenever the `MYSQL_FIREWALL` plugin is installed or the server is started. Many of them are reset to zero by the `mysql_firewall_flush_status()` function (see  MySQL Enterprise Firewall Administrative Functions).

*  `Firewall_access_denied`

  The number of statements rejected by MySQL Enterprise Firewall.
*  `Firewall_access_granted`

  The number of statements accepted by MySQL Enterprise Firewall.
*  `Firewall_access_suspicious`

  The number of statements logged by MySQL Enterprise Firewall as suspicious for users who are in `DETECTING` mode.
*  `Firewall_cached_entries`

  The number of statements recorded by MySQL Enterprise Firewall, including duplicates.
