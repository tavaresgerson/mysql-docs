#### 6.4.6.4 MySQL Enterprise Firewall Reference

The following sections provide a reference to MySQL Enterprise Firewall elements:

* [MySQL Enterprise Firewall Tables](firewall-reference.html#firewall-tables "MySQL Enterprise Firewall Tables")
* [MySQL Enterprise Firewall Stored Procedures](firewall-reference.html#firewall-stored-routines "MySQL Enterprise Firewall Stored Procedures")
* [MySQL Enterprise Firewall Administrative Functions](firewall-reference.html#firewall-functions "MySQL Enterprise Firewall Administrative Functions")
* [MySQL Enterprise Firewall System Variables](firewall-reference.html#firewall-system-variables "MySQL Enterprise Firewall System Variables")
* [MySQL Enterprise Firewall Status Variables](firewall-reference.html#firewall-status-variables "MySQL Enterprise Firewall Status Variables")

##### MySQL Enterprise Firewall Tables

MySQL Enterprise Firewall maintains profile information on a per-group and per-account basis, using tables in the firewall database for persistent storage and Information Schema tables to provide views into in-memory cached data. When enabled, the firewall bases operational decisions on the cached data. The firewall database can be the `mysql` system database or a custom schema (see [Installing MySQL Enterprise Firewall](firewall-installation.html#firewall-install "Installing MySQL Enterprise Firewall")).

Tables in the firewall database are covered in this section. For information about MySQL Enterprise Firewall Information Schema tables, see [Section 24.7, “INFORMATION_SCHEMA MySQL Enterprise Firewall Tables”](firewall-information-schema-tables.html "24.7 INFORMATION_SCHEMA MySQL Enterprise Firewall Tables").

Each `mysql` system database table is accessible only by accounts that have the [`SELECT`](privileges-provided.html#priv_select) privilege for it. The `INFORMATION_SCHEMA` tables are accessible by anyone.

The `mysql.firewall_users` table lists names and operational modes of registered firewall account profiles. The table has the following columns (with the corresponding Information Schema [`MYSQL_FIREWALL_USERS`](information-schema-mysql-firewall-users-table.html "24.7.2 The INFORMATION_SCHEMA MYSQL_FIREWALL_USERS Table") table having similar but not necessarily identical columns):

* `USERHOST`

  The account profile name. Each account name has the format `user_name@host_name`.

* `MODE`

  The current operational mode for the profile. Permitted mode values are `OFF`, `DETECTING`, `PROTECTING`, `RECORDING`, and `RESET`. For details about their meanings, see [Firewall Concepts](firewall-usage.html#firewall-concepts "Firewall Concepts").

The `mysql.firewall_whitelist` table lists allowlist rules of registered firewall account profiles. The table has the following columns (with the corresponding Information Schema [`MYSQL_FIREWALL_WHITELIST`](information-schema-mysql-firewall-whitelist-table.html "24.7.3 The INFORMATION_SCHEMA MYSQL_FIREWALL_WHITELIST Table") table having similar but not necessarily identical columns):

* `USERHOST`

  The account profile name. Each account name has the format `user_name@host_name`.

* `RULE`

  A normalized statement indicating an acceptable statement pattern for the profile. A profile allowlist is the union of its rules.

* `ID`

  An integer column that is a primary key for the table. This column was added in MySQL 5.7.23.

##### MySQL Enterprise Firewall Stored Procedures

MySQL Enterprise Firewall stored procedures perform tasks such as registering profiles with the firewall, establishing their operational mode, and managing transfer of firewall data between the cache and persistent storage. These procedures invoke administrative functions that provide an API for lower-level tasks.

Firewall stored procedures are created in the `mysql` system database. To invoke a firewall stored procedure, either do so while `mysql` is the default database, or qualify the procedure name with the database name. For example:

```sql
CALL mysql.sp_set_firewall_mode(user, mode);
```

The following list describes each firewall stored procedure:

* `sp_reload_firewall_rules(user)`

  This stored procedure provides control over firewall operation for individual account profiles. The procedure uses firewall administrative functions to reload the in-memory rules for an account profile from the rules stored in the `mysql.firewall_whitelist` table.

  Arguments:

  + *`user`*: The name of the affected account profile, as a string in `user_name@host_name` format.

  Example:

  ```sql
  CALL mysql.sp_reload_firewall_rules('fwuser@localhost');
  ```

  Warning

  This procedure clears the account profile in-memory allowlist rules before reloading them from persistent storage, and sets the profile mode to `OFF`. If the profile mode was not `OFF` prior to the `sp_reload_firewall_rules()` call, use `sp_set_firewall_mode()` to restore its previous mode after reloading the rules. For example, if the profile was in `PROTECTING` mode, that is no longer true after calling `sp_reload_firewall_rules()` and you must set it to `PROTECTING` again explicitly.

* `sp_set_firewall_mode(user, mode)`

  This stored procedure establishes the operational mode for a firewall account profile, after registering the profile with the firewall if it was not already registered. The procedure also invokes firewall administrative functions as necessary to transfer firewall data between the cache and persistent storage. This procedure may be called even if the `mysql_firewall_mode` system variable is `OFF`, although setting the mode for a profile has no operational effect until the firewall is enabled.

  Arguments:

  + *`user`*: The name of the affected account profile, as a string in `user_name@host_name` format.

  + *`mode`*: The operational mode for the profile, as a string. Permitted mode values are `OFF`, `DETECTING`, `PROTECTING`, `RECORDING`, and `RESET`. For details about their meanings, see [Firewall Concepts](firewall-usage.html#firewall-concepts "Firewall Concepts").

  Switching an account profile to any mode but `RECORDING` synchronizes its firewall cache data to the `mysql` system database tables that provide persistent underlying storage. Switching the mode from `OFF` to `RECORDING` reloads the allowlist from the `mysql.firewall_whitelist` table into the cache.

  If an account profile has an empty allowlist, its mode cannot be set to `PROTECTING` because the profile would reject every statement, effectively prohibiting the account from executing statements. In response to such a mode-setting attempt, the firewall produces a diagnostic message that is returned as a result set rather than as an SQL error:

  ```sql
  mysql> CALL mysql.sp_set_firewall_mode('a@b','PROTECTING');
  +----------------------------------------------------------------------+
  | set_firewall_mode(arg_userhost, arg_mode)                            |
  +----------------------------------------------------------------------+
  | ERROR: PROTECTING mode requested for a@b but the whitelist is empty. |
  +----------------------------------------------------------------------+
  1 row in set (0.02 sec)

  Query OK, 0 rows affected (0.02 sec)
  ```

##### MySQL Enterprise Firewall Administrative Functions

MySQL Enterprise Firewall administrative functions provide an API for lower-level tasks such as synchronizing the firewall cache with the underlying system tables.

*Under normal operation, these functions are invoked by the firewall stored procedures, not directly by users.* For that reason, these function descriptions do not include details such as information about their arguments and return types.

* [Firewall Account Profile Functions](firewall-reference.html#firewall-functions-account "Firewall Account Profile Functions")
* [Firewall Miscellaneous Functions](firewall-reference.html#firewall-functions-miscellaneous "Firewall Miscellaneous Functions")

###### Firewall Account Profile Functions

These functions perform management operations on firewall account profiles:

* [`read_firewall_users(user, mode)`](firewall-reference.html#function_read-firewall-users)

  This aggregate function updates the firewall account profile cache through a `SELECT` statement on the `mysql.firewall_users` table. It requires the [`SUPER`](privileges-provided.html#priv_super) privilege.

  Example:

  ```sql
  SELECT read_firewall_users('fwuser@localhost', 'RECORDING')
  FROM mysql.firewall_users;
  ```

* [`read_firewall_whitelist(user, rule)`](firewall-reference.html#function_read-firewall-whitelist)

  This aggregate function updates the recorded-statement cache for the named account profile through a `SELECT` statement on the `mysql.firewall_whitelist` table. It requires the [`SUPER`](privileges-provided.html#priv_super) privilege.

  Example:

  ```sql
  SELECT read_firewall_whitelist('fwuser@localhost', fw.rule)
  FROM mysql.firewall_whitelist AS fw
  WHERE USERHOST = 'fwuser@localhost';
  ```

* [`set_firewall_mode(user, mode)`](firewall-reference.html#function_set-firewall-mode)

  This function manages the account profile cache and establishes the profile operational mode. It requires the [`SUPER`](privileges-provided.html#priv_super) privilege.

  Example:

  ```sql
  SELECT set_firewall_mode('fwuser@localhost', 'RECORDING');
  ```

###### Firewall Miscellaneous Functions

These functions perform miscellaneous firewall operations:

* [`mysql_firewall_flush_status()`](firewall-reference.html#function_mysql-firewall-flush-status)

  This function resets several firewall status variables to 0:

  + [`Firewall_access_denied`](firewall-reference.html#statvar_Firewall_access_denied)
  + [`Firewall_access_granted`](firewall-reference.html#statvar_Firewall_access_granted)
  + [`Firewall_access_suspicious`](firewall-reference.html#statvar_Firewall_access_suspicious)

  This function requires the [`SUPER`](privileges-provided.html#priv_super) privilege.

  Example:

  ```sql
  SELECT mysql_firewall_flush_status();
  ```

* [`normalize_statement(stmt)`](firewall-reference.html#function_normalize-statement)

  This function normalizes an SQL statement into the digest form used for allowlist rules. It requires the [`SUPER`](privileges-provided.html#priv_super) privilege.

  Example:

  ```sql
  SELECT normalize_statement('SELECT * FROM t1 WHERE c1 > 2');
  ```

##### MySQL Enterprise Firewall System Variables

MySQL Enterprise Firewall supports the following system variables. Use them to configure firewall operation. These variables are unavailable unless the firewall is installed (see [Section 6.4.6.2, “Installing or Uninstalling MySQL Enterprise Firewall”](firewall-installation.html "6.4.6.2 Installing or Uninstalling MySQL Enterprise Firewall")).

* [`mysql_firewall_mode`](firewall-reference.html#sysvar_mysql_firewall_mode)

  <table frame="box" rules="all" summary="Properties for mysql_firewall_mode"><tbody><tr><th>Command-Line Format</th> <td><code>--mysql-firewall-mode[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>mysql_firewall_mode</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  Whether MySQL Enterprise Firewall is enabled (the default) or disabled.

* [`mysql_firewall_trace`](firewall-reference.html#sysvar_mysql_firewall_trace)

  <table frame="box" rules="all" summary="Properties for mysql_firewall_trace"><tbody><tr><th>Command-Line Format</th> <td><code>--mysql-firewall-trace[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>mysql_firewall_trace</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Whether the MySQL Enterprise Firewall trace is enabled or disabled (the default). When [`mysql_firewall_trace`](firewall-reference.html#sysvar_mysql_firewall_trace) is enabled, for `PROTECTING` mode, the firewall writes rejected statements to the error log.

##### MySQL Enterprise Firewall Status Variables

MySQL Enterprise Firewall supports the following status variables. Use them to obtain information about firewall operational status. These variables are unavailable unless the firewall is installed (see [Section 6.4.6.2, “Installing or Uninstalling MySQL Enterprise Firewall”](firewall-installation.html "6.4.6.2 Installing or Uninstalling MySQL Enterprise Firewall")). Firewall status variables are set to 0 whenever the `MYSQL_FIREWALL` plugin is installed or the server is started. Many of them are reset to zero by the [`mysql_firewall_flush_status()`](firewall-reference.html#function_mysql-firewall-flush-status) function (see [MySQL Enterprise Firewall Administrative Functions](firewall-reference.html#firewall-functions "MySQL Enterprise Firewall Administrative Functions")).

* [`Firewall_access_denied`](firewall-reference.html#statvar_Firewall_access_denied)

  The number of statements rejected by MySQL Enterprise Firewall.

* [`Firewall_access_granted`](firewall-reference.html#statvar_Firewall_access_granted)

  The number of statements accepted by MySQL Enterprise Firewall.

* [`Firewall_access_suspicious`](firewall-reference.html#statvar_Firewall_access_suspicious)

  The number of statements logged by MySQL Enterprise Firewall as suspicious for users who are in `DETECTING` mode.

* [`Firewall_cached_entries`](firewall-reference.html#statvar_Firewall_cached_entries)

  The number of statements recorded by MySQL Enterprise Firewall, including duplicates.
