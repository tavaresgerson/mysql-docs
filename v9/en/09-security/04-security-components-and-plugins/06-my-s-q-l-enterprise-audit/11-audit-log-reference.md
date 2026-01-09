#### 8.4.6.11 Audit Log Reference

The following sections provide a reference to MySQL Enterprise Audit elements:

* Audit Log Tables
* Audit Log Functions
* Audit Log Option and Variable Reference
* Audit Log Options and Variables
* Audit Log Status Variables

To install the audit log tables and functions, use the instructions provided in Section 8.4.6.2, “Installing or Uninstalling MySQL Enterprise Audit”. Unless those objects are installed, the `audit_log` plugin operates in (deprecated) legacy mode. See Section 8.4.6.10, “Legacy Mode Audit Log Filtering”.

##### Audit Log Tables

MySQL Enterprise Audit uses tables in the `mysql` system database for persistent storage of filter and user account data. The tables can be accessed only by users who have privileges for that database. To use a different database, set the `audit_log_database` system variable at server startup. The tables use the `InnoDB` storage engine.

If these tables are missing, the `audit_log` plugin operates in (deprecated) legacy mode. See Section 8.4.6.10, “Legacy Mode Audit Log Filtering”.

The `audit_log_filter` table stores filter definitions. The table has these columns:

* `NAME`

  The filter name.

* `FILTER`

  The filter definition associated with the filter name. Definitions are stored as `JSON` values.

The `audit_log_user` table stores user account information. The table has these columns:

* `USER`

  The user name part of an account. For an account `user1@localhost`, the `USER` part is `user1`.

* `HOST`

  The host name part of an account. For an account `user1@localhost`, the `HOST` part is `localhost`.

* `FILTERNAME`

  The name of the filter assigned to the account. The filter name associates the account with a filter defined in the `audit_log_filter` table.

##### Audit Log Functions

This section describes, for each audit log function, its purpose, calling sequence, and return value. For information about the conditions under which these functions can be invoked, see Section 8.4.6.7, “Audit Log Filtering”.

Each audit log function returns a string that indicates whether the operation succeeded. `OK` indicates success. `ERROR: message` indicates failure.

Audit log functions convert string arguments to `utf8mb4` and string return values are `utf8mb4` strings. Previously, audit log functions treated string arguments as binary strings (which means they did not distinguish lettercase), and string return values were binary strings.

If an audit log function is invoked from within the **mysql** client, binary string results display using hexadecimal notation, depending on the value of the `--binary-as-hex`. For more information about that option, see Section 6.5.1, “mysql — The MySQL Command-Line Client”.

To verify installation of audit log functions, use this command:

```
SELECT * FROM performance_schema.user_defined_functions;
```

To learn more, see Section 7.7.2, “Obtaining Information About Loadable Functions”.

These audit log functions are available:

* `audit_log_encryption_password_get([keyring_id])`

  This function fetches an audit log encryption password from the MySQL keyring, which must be enabled or an error occurs. Any keyring component or plugin can be used; for instructions, see Section 8.4.5, “The MySQL Keyring”.

  With no argument, the function retrieves the current encryption password as a binary string. An argument may be given to specify which audit log encryption password to retrieve. The argument must be the keyring ID of the current password or an archived password.

  For additional information about audit log encryption, see Encrypting Audit Log Files.

  Arguments:

  *`keyring_id`*: This optional argument indicates the keyring ID of the password to retrieve. The maximum permitted length is 766 bytes. If omitted, the function retrieves the current password.

  Return value:

  The password string for success (up to 766 bytes), or `NULL` and an error for failure.

  Example:

  Retrieve the current password:

  ```
  mysql> SELECT audit_log_encryption_password_get();
  +-------------------------------------+
  | audit_log_encryption_password_get() |
  +-------------------------------------+
  | secret                              |
  +-------------------------------------+
  ```

  To retrieve a password by ID, you can determine which audit log keyring IDs exist by querying the Performance Schema `keyring_keys` table:

  ```
  mysql> SELECT KEY_ID FROM performance_schema.keyring_keys
         WHERE KEY_ID LIKE 'audit_log%'
         ORDER BY KEY_ID;
  +-----------------------------+
  | KEY_ID                      |
  +-----------------------------+
  | audit_log-20190415T152248-1 |
  | audit_log-20190415T153507-1 |
  | audit_log-20190416T125122-1 |
  | audit_log-20190416T141608-1 |
  +-----------------------------+
  mysql> SELECT audit_log_encryption_password_get('audit_log-20190416T125122-1');
  +------------------------------------------------------------------+
  | audit_log_encryption_password_get('audit_log-20190416T125122-1') |
  +------------------------------------------------------------------+
  | segreto                                                          |
  +------------------------------------------------------------------+
  ```

* `audit_log_encryption_password_set(password)`

  Sets the current audit log encryption password to the argument and stores the password in the MySQL keyring. The password is stored as a `utf8mb4` string. Previously, the password was stored in binary form.

  If encryption is enabled, this function performs a log file rotation operation that renames the current log file, and begins a new log file encrypted with the password. The keyring must be enabled or an error occurs. Any keyring component or plugin can be used; for instructions, see Section 8.4.5, “The MySQL Keyring”.

  For additional information about audit log encryption, see Encrypting Audit Log Files.

  Arguments:

  *`password`*: The password string. The maximum permitted length is 766 bytes.

  Return value:

  1 for success, 0 for failure.

  Example:

  ```
  mysql> SELECT audit_log_encryption_password_set(password);
  +---------------------------------------------+
  | audit_log_encryption_password_set(password) |
  +---------------------------------------------+
  | 1                                           |
  +---------------------------------------------+
  ```

* `audit_log_filter_flush()`

  Calling any of the other filtering functions affects operational audit log filtering immediately and updates the audit log tables. If instead you modify the contents of those tables directly using statements such as `INSERT`, `UPDATE`, and `DELETE`, the changes do not affect filtering immediately. To flush your changes and make them operational, call `audit_log_filter_flush()`.

  Warning

  `audit_log_filter_flush()` should be used only after modifying the audit tables directly, to force reloading all filters. Otherwise, this function should be avoided. It is, in effect, a simplified version of unloading and reloading the `audit_log` plugin with `UNINSTALL PLUGIN` plus `INSTALL PLUGIN`.

  `audit_log_filter_flush()` affects all current sessions and detaches them from their previous filters. Current sessions are no longer logged unless they disconnect and reconnect, or execute a change-user operation.

  If this function fails, an error message is returned and the audit log is disabled until the next successful call to `audit_log_filter_flush()`.

  Arguments:

  None.

  Return value:

  A string that indicates whether the operation succeeded. `OK` indicates success. `ERROR: message` indicates failure.

  Example:

  ```
  mysql> SELECT audit_log_filter_flush();
  +--------------------------+
  | audit_log_filter_flush() |
  +--------------------------+
  | OK                       |
  +--------------------------+
  ```

* `audit_log_filter_remove_filter(filter_name)`

  Given a filter name, removes the filter from the current set of filters. It is not an error for the filter not to exist.

  If a removed filter is assigned to any user accounts, those users stop being filtered (they are removed from the `audit_log_user` table). Termination of filtering includes any current sessions for those users: They are detached from the filter and no longer logged.

  Arguments:

  + *`filter_name`*: A string that specifies the filter name.

  Return value:

  A string that indicates whether the operation succeeded. `OK` indicates success. `ERROR: message` indicates failure.

  Example:

  ```
  mysql> SELECT audit_log_filter_remove_filter('SomeFilter');
  +----------------------------------------------+
  | audit_log_filter_remove_filter('SomeFilter') |
  +----------------------------------------------+
  | OK                                           |
  +----------------------------------------------+
  ```

* `audit_log_filter_remove_user(user_name)`

  Given a user account name, cause the user to be no longer assigned to a filter. It is not an error if the user has no filter assigned. Filtering of current sessions for the user remains unaffected. New connections for the user are filtered using the default account filter if there is one, and are not logged otherwise.

  If the name is `%`, the function removes the default account filter that is used for any user account that has no explicitly assigned filter.

  Arguments:

  + *`user_name`*: The user account name as a string in `user_name@host_name` format, or `%` to represent the default account.

  Return value:

  A string that indicates whether the operation succeeded. `OK` indicates success. `ERROR: message` indicates failure.

  Example:

  ```
  mysql> SELECT audit_log_filter_remove_user('user1@localhost');
  +-------------------------------------------------+
  | audit_log_filter_remove_user('user1@localhost') |
  +-------------------------------------------------+
  | OK                                              |
  +-------------------------------------------------+
  ```

* `audit_log_filter_set_filter(filter_name, definition)`

  Given a filter name and definition, adds the filter to the current set of filters. If the filter already exists and is used by any current sessions, those sessions are detached from the filter and are no longer logged. This occurs because the new filter definition has a new filter ID that differs from its previous ID.

  Arguments:

  + *`filter_name`*: A string that specifies the filter name.

  + *`definition`*: A `JSON` value that specifies the filter definition.

  Return value:

  A string that indicates whether the operation succeeded. `OK` indicates success. `ERROR: message` indicates failure.

  Example:

  ```
  mysql> SET @f = '{ "filter": { "log": false } }';
  mysql> SELECT audit_log_filter_set_filter('SomeFilter', @f);
  +-----------------------------------------------+
  | audit_log_filter_set_filter('SomeFilter', @f) |
  +-----------------------------------------------+
  | OK                                            |
  +-----------------------------------------------+
  ```

* `audit_log_filter_set_user(user_name, filter_name)`

  Given a user account name and a filter name, assigns the filter to the user. A user can be assigned only one filter, so if the user was already assigned a filter, the assignment is replaced. Filtering of current sessions for the user remains unaffected. New connections are filtered using the new filter.

  As a special case, the name `%` represents the default account. The filter is used for connections from any user account that has no explicitly assigned filter.

  Arguments:

  + *`user_name`*: The user account name as a string in `user_name@host_name` format, or `%` to represent the default account.

  + *`filter_name`*: A string that specifies the filter name.

  Return value:

  A string that indicates whether the operation succeeded. `OK` indicates success. `ERROR: message` indicates failure.

  Example:

  ```
  mysql> SELECT audit_log_filter_set_user('user1@localhost', 'SomeFilter');
  +------------------------------------------------------------+
  | audit_log_filter_set_user('user1@localhost', 'SomeFilter') |
  +------------------------------------------------------------+
  | OK                                                         |
  +------------------------------------------------------------+
  ```

* `audit_log_read([arg])`

  Reads the audit log and returns a `JSON` string result. If the audit log format is not `JSON`, an error occurs.

  With no argument or a `JSON` hash argument, `audit_log_read()` reads events from the audit log and returns a `JSON` string containing an array of audit events. Items in the hash argument influence how reading occurs, as described later. Each element in the returned array is an event represented as a `JSON` hash, with the exception that the last element may be a `JSON` `null` value to indicate no following events are available to read.

  With an argument consisting of a `JSON` `null` value, `audit_log_read()` closes the current read sequence.

  For additional details about the audit log-reading process, see Section 8.4.6.6, “Reading Audit Log Files”.

  Arguments:

  To obtain a bookmark for the most recently written event, call `audit_log_read_bookmark()`.

  *`arg`*: The argument is optional. If omitted, the function reads events from the current position. If present, the argument can be a `JSON` `null` value to close the read sequence, or a `JSON` hash. Within a hash argument, items are optional and control aspects of the read operation such as the position at which to begin reading or how many events to read. The following items are significant (other items are ignored):

  + `start`: The position within the audit log of the first event to read. The position is given as a timestamp and the read starts from the first event that occurs on or after the timestamp value. The `start` item has this format, where *`value`* is a literal timestamp value:

    ```
    "start": { "timestamp": "value" }
    ```

  + `timestamp`, `id`: The position within the audit log of the first event to read. The `timestamp` and `id` items together comprise a bookmark that uniquely identify a particular event. If an `audit_log_read()` argument includes either item, it must include both to completely specify a position or an error occurs.

  + `max_array_length`: The maximum number of events to read from the log. If this item is omitted, the default is to read to the end of the log or until the read buffer is full, whichever comes first.

  To specify a starting position to `audit_log_read()`, pass a hash argument that includes either a `start` item or a bookmark consisting of `timestamp` and `id` items. If a hash argument includes both a `start` item and a bookmark, an error occurs.

  If a hash argument specifies no starting position, reading continues from the current position.

  If a timestamp value includes no time part, a time part of `00:00:00` is assumed.

  Return value:

  If the call succeeds, the return value is a `JSON` string containing an array of audit events, or a `JSON` `null` value if that was passed as the argument to close the read sequence. If the call fails, the return value is `NULL` and an error occurs.

  Example:

  ```
  mysql> SELECT audit_log_read(audit_log_read_bookmark());
  +-----------------------------------------------------------------------+
  | audit_log_read(audit_log_read_bookmark())                             |
  +-----------------------------------------------------------------------+
  | [ {"timestamp":"2020-05-18 22:41:24","id":0,"class":"connection", ... |
  +-----------------------------------------------------------------------+
  mysql> SELECT audit_log_read('null');
  +------------------------+
  | audit_log_read('null') |
  +------------------------+
  | null                   |
  +------------------------+
  ```

* `audit_log_read_bookmark()`

  Returns a `JSON` string representing a bookmark for the most recently written audit log event. If the audit log format is not `JSON`, an error occurs.

  The bookmark is a `JSON` hash with `timestamp` and `id` items that uniquely identify the position of an event within the audit log. It is suitable for passing to `audit_log_read()` to indicate to that function the position at which to begin reading.

  For additional details about the audit log-reading process, see Section 8.4.6.6, “Reading Audit Log Files”.

  Arguments:

  None.

  Return value:

  A `JSON` string containing a bookmark for success, or `NULL` and an error for failure.

  Example:

  ```
  mysql> SELECT audit_log_read_bookmark();
  +-------------------------------------------------+
  | audit_log_read_bookmark()                       |
  +-------------------------------------------------+
  | { "timestamp": "2019-10-03 21:03:44", "id": 0 } |
  +-------------------------------------------------+
  ```

* `audit_log_rotate()`

  Arguments:

  None.

  Return value:

  The renamed file name.

  Example:

  ```
  mysql> SELECT audit_log_rotate();
  ```

  Using `audit_log_rotate()` requires the `AUDIT_ADMIN` privilege.

##### Audit Log Option and Variable Reference

**Table 8.44 Audit Log Option and Variable Reference**

<table frame="box" rules="all" summary="Reference for audit log command-line options, system variables, and status variables."><col style="width: 20%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><thead><tr><th>Name</th> <th>Cmd-Line</th> <th>Option File</th> <th>System Var</th> <th>Status Var</th> <th>Var Scope</th> <th>Dynamic</th> </tr></thead><tbody><tr><th><a class="link" href="audit-log-reference.html#option_mysqld_audit-log">audit-log</a></th> <td>Yes</td> <td>Yes</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_buffer_size">audit_log_buffer_size</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_compression">audit_log_compression</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_connection_policy">audit_log_connection_policy</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_current_session">audit_log_current_session</a></th> <td></td> <td></td> <td>Yes</td> <td></td> <td>Both</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#statvar_Audit_log_current_size">Audit_log_current_size</a></th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_database">audit_log_database</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#statvar_Audit_log_direct_writes">Audit_log_direct_writes</a></th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_disable">audit_log_disable</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_encryption">audit_log_encryption</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#statvar_Audit_log_event_max_drop_size">Audit_log_event_max_drop_size</a></th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#statvar_Audit_log_events">Audit_log_events</a></th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#statvar_Audit_log_events_filtered">Audit_log_events_filtered</a></th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#statvar_Audit_log_events_lost">Audit_log_events_lost</a></th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#statvar_Audit_log_events_written">Audit_log_events_written</a></th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_exclude_accounts">audit_log_exclude_accounts</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_file">audit_log_file</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_filter_id">audit_log_filter_id</a></th> <td></td> <td></td> <td>Yes</td> <td></td> <td>Both</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_flush">audit_log_flush</a></th> <td></td> <td></td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_flush_interval_seconds">audit_log_flush_interval_seconds</a></th> <td>Yes</td> <td></td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_format">audit_log_format</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_include_accounts">audit_log_include_accounts</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_max_size">audit_log_max_size</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_password_history_keep_days">audit_log_password_history_keep_days</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_policy">audit_log_policy</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_prune_seconds">audit_log_prune_seconds</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_read_buffer_size">audit_log_read_buffer_size</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Both</td> <td>Yes</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_rotate_on_size">audit_log_rotate_on_size</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_statement_policy">audit_log_statement_policy</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_strategy">audit_log_strategy</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#statvar_Audit_log_total_size">Audit_log_total_size</a></th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#statvar_Audit_log_write_waits">Audit_log_write_waits</a></th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr></tbody></table>

##### Audit Log Options and Variables

This section describes the command options and system variables that configure operation of MySQL Enterprise Audit. If values specified at startup time are incorrect, the `audit_log` plugin may fail to initialize properly and the server does not load it. In this case, the server may also produce error messages for other audit log settings because it does not recognize them.

To configure activation of the audit log plugin, use this option:

* `--audit-log[=value]`

  <table frame="box" rules="all" summary="Properties for audit-log"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">ON</code></p><p class="valid-value"><code class="literal">OFF</code></p><p class="valid-value"><code class="literal">FORCE</code></p><p class="valid-value"><code class="literal">FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  This option controls how the server loads the `audit_log` plugin at startup. It is available only if the plugin has been previously registered with `INSTALL PLUGIN` or is loaded with `--plugin-load` or `--plugin-load-add`. See Section 8.4.6.2, “Installing or Uninstalling MySQL Enterprise Audit”.

  The option value should be one of those available for plugin-loading options, as described in Section 7.6.1, “Installing and Uninstalling Plugins”. For example, `--audit-log=FORCE_PLUS_PERMANENT` tells the server to load the plugin and prevent it from being removed while the server is running.

If the audit log plugin is enabled, it exposes several system variables that permit control over logging:

```
mysql> SHOW VARIABLES LIKE 'audit_log%';
+--------------------------------------+--------------+
| Variable_name                        | Value        |
+--------------------------------------+--------------+
| audit_log_buffer_size                | 1048576      |
| audit_log_compression                | NONE         |
| audit_log_connection_policy          | ALL          |
| audit_log_current_session            | OFF          |
| audit_log_database                   | mysql        |
| audit_log_disable                    | OFF          |
| audit_log_encryption                 | NONE         |
| audit_log_exclude_accounts           |              |
| audit_log_file                       | audit.log    |
| audit_log_filter_id                  | 0            |
| audit_log_flush                      | OFF          |
| audit_log_flush_interval_seconds     | 0            |
| audit_log_format                     | NEW          |
| audit_log_format_unix_timestamp      | OFF          |
| audit_log_include_accounts           |              |
| audit_log_max_size                   | 0            |
| audit_log_password_history_keep_days | 0            |
| audit_log_policy                     | ALL          |
| audit_log_prune_seconds              | 0            |
| audit_log_read_buffer_size           | 32768        |
| audit_log_rotate_on_size             | 0            |
| audit_log_statement_policy           | ALL          |
| audit_log_strategy                   | ASYNCHRONOUS |
+--------------------------------------+--------------+
```

You can set any of these variables at server startup, and some of them at runtime. Those that are available only for legacy mode audit log filtering are so noted.

* `audit_log_buffer_size`

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="audit-log-reference.html#sysvar_audit_log_buffer_size">audit_log_buffer_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">4096</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code class="literal">18446744073709547520</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code class="literal">4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Note">Block Size</a></th> <td><code class="literal">4096</code></td> </tr></tbody></table>

  When the audit log plugin writes events to the log asynchronously, it uses a buffer to store event contents prior to writing them. This variable controls the size of that buffer, in bytes. The server adjusts the value to a multiple of 4096. The plugin uses a single buffer, which it allocates when it initializes and removes when it terminates. The plugin allocates this buffer only if logging is asynchronous.

* `audit_log_compression`

  <table frame="box" rules="all" summary="Properties for audit_log_compression"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--audit-log-compression=value</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="audit-log-reference.html#sysvar_audit_log_compression">audit_log_compression</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">NONE</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">NONE</code></p><p class="valid-value"><code class="literal">GZIP</code></p></td> </tr></tbody></table>

  The type of compression for the audit log file. Permitted values are `NONE` (no compression; the default) and `GZIP` (GNU Zip compression). For more information, see Compressing Audit Log Files.

* `audit_log_connection_policy`

  <table frame="box" rules="all" summary="Properties for audit_log_connection_policy"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--audit-log-connection-policy=value</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="audit-log-reference.html#sysvar_audit_log_connection_policy">audit_log_connection_policy</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">ALL</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">ALL</code></p><p class="valid-value"><code class="literal">ERRORS</code></p><p class="valid-value"><code class="literal">NONE</code></p></td> </tr></tbody></table>

  Note

  This deprecated variable applies only to legacy mode audit log filtering (see Section 8.4.6.10, “Legacy Mode Audit Log Filtering”).

  The policy controlling how the audit log plugin writes connection events to its log file. The following table shows the permitted values.

  <table summary="Permitted values for the audit_log_connection_policy variable."><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td><code class="literal">ALL</code></td> <td>Log all connection events</td> </tr><tr> <td><code class="literal">ERRORS</code></td> <td>Log only failed connection events</td> </tr><tr> <td><code class="literal">NONE</code></td> <td>Do not log connection events</td> </tr></tbody></table>

  Note

  At server startup, any explicit value given for `audit_log_connection_policy` may be overridden if `audit_log_policy` is also specified, as described in Section 8.4.6.5, “Configuring Audit Logging Characteristics”.

* `audit_log_current_session`

  <table frame="box" rules="all" summary="Properties for audit_log_current_session"><tbody><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="audit-log-reference.html#sysvar_audit_log_current_session">audit_log_current_session</a></code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">depends on filtering policy</code></td> </tr></tbody></table>

  Whether audit logging is enabled for the current session. The session value of this variable is read only. It is set when the session begins based on the values of the `audit_log_include_accounts` and `audit_log_exclude_accounts` system variables. The audit log plugin uses the session value to determine whether to audit events for the session. (There is a global value, but the plugin does not use it.)

* `audit_log_database`

  <table frame="box" rules="all" summary="Properties for audit_log_database"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--audit-log-database=value</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="audit-log-reference.html#sysvar_audit_log_database">audit_log_database</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">mysql</code></td> </tr></tbody></table>

  Specifies which database the `audit_log` plugin uses to find its tables. This variable is read only. For more information, see Section 8.4.6.2, “Installing or Uninstalling MySQL Enterprise Audit”).

* `audit_log_disable`

  <table frame="box" rules="all" summary="Properties for audit_log_disable"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--audit-log-disable[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="audit-log-reference.html#sysvar_audit_log_disable">audit_log_disable</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">OFF</code></td> </tr></tbody></table>

  Permits disabling audit logging for all connecting and connected sessions. In addition to the `SYSTEM_VARIABLES_ADMIN` privilege, disabling audit logging requires the `AUDIT_ADMIN` privilege. See Section 8.4.6.9, “Disabling Audit Logging”.

* `audit_log_encryption`

  <table frame="box" rules="all" summary="Properties for audit_log_encryption"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--audit-log-encryption=value</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="audit-log-reference.html#sysvar_audit_log_encryption">audit_log_encryption</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">NONE</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">NONE</code></p><p class="valid-value"><code class="literal">AES</code></p></td> </tr></tbody></table>

  The type of encryption for the audit log file. Permitted values are `NONE` (no encryption; the default) and `AES` (AES-256-CBC cipher encryption). For more information, see Encrypting Audit Log Files.

* `audit_log_exclude_accounts`

  <table frame="box" rules="all" summary="Properties for audit-log"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">ON</code></p><p class="valid-value"><code class="literal">OFF</code></p><p class="valid-value"><code class="literal">FORCE</code></p><p class="valid-value"><code class="literal">FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  Note

  This deprecated variable applies only to legacy mode audit log filtering (see Section 8.4.6.10, “Legacy Mode Audit Log Filtering”).

  The accounts for which events should not be logged. The value should be `NULL` or a string containing a list of one or more comma-separated account names. For more information, see Section 8.4.6.7, “Audit Log Filtering”.

  Modifications to `audit_log_exclude_accounts` affect only connections created subsequent to the modification, not existing connections.

* `audit_log_file`

  <table frame="box" rules="all" summary="Properties for audit-log"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">ON</code></p><p class="valid-value"><code class="literal">OFF</code></p><p class="valid-value"><code class="literal">FORCE</code></p><p class="valid-value"><code class="literal">FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  The base name and suffix of the file to which the audit log plugin writes events. The default value is `audit.log`, regardless of logging format. To have the name suffix correspond to the format, set the name explicitly, choosing a different suffix (for example, `audit.xml` for XML format, `audit.json` for JSON format).

  If the value of `audit_log_file` is a relative path name, the plugin interprets it relative to the data directory. If the value is a full path name, the plugin uses the value as is. A full path name may be useful if it is desirable to locate audit files on a separate file system or directory. For security reasons, write the audit log file to a directory accessible only to the MySQL server and to users with a legitimate reason to view the log.

  For details about how the audit log plugin interprets the `audit_log_file` value and the rules for file renaming that occurs at plugin initialization and termination, see Naming Conventions for Audit Log Files.

  The audit log plugin uses the directory containing the audit log file (determined from the `audit_log_file` value) as the location to search for readable audit log files. From these log files and the current file, the plugin constructs a list of the ones that are subject to use with the audit log bookmarking and reading functions. See Section 8.4.6.6, “Reading Audit Log Files”.

* `audit_log_filter_id`

  <table frame="box" rules="all" summary="Properties for audit-log"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">ON</code></p><p class="valid-value"><code class="literal">OFF</code></p><p class="valid-value"><code class="literal">FORCE</code></p><p class="valid-value"><code class="literal">FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  The session value of this variable indicates the internally maintained ID of the audit filter for the current session. A value of 0 means that the session has no filter assigned.

* `audit_log_flush`

  <table frame="box" rules="all" summary="Properties for audit-log"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">ON</code></p><p class="valid-value"><code class="literal">OFF</code></p><p class="valid-value"><code class="literal">FORCE</code></p><p class="valid-value"><code class="literal">FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  Note

  The `audit_log_flush` variable is deprecated; expect support for it to be removed in a future version of MySQL. It is superseded by the `audit_log_rotate()` function.

  If `audit_log_rotate_on_size` is 0, automatic audit log file rotation is disabled and rotation occurs only when performed manually. In that case, enabling `audit_log_flush` by setting it to 1 or `ON` causes the audit log plugin to close and reopen its log file to flush it. (The variable value remains `OFF` so that you need not disable it explicitly before enabling it again to perform another flush.) For more information, see Section 8.4.6.5, “Configuring Audit Logging Characteristics”.

* `audit_log_flush_interval_seconds`

  <table frame="box" rules="all" summary="Properties for audit-log"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">ON</code></p><p class="valid-value"><code class="literal">OFF</code></p><p class="valid-value"><code class="literal">FORCE</code></p><p class="valid-value"><code class="literal">FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  This system variable depends on the `scheduler` component, which must be installed and enabled (see Section 7.5.5, “Scheduler Component”). To check the status of the component:

  ```
  SHOW VARIABLES LIKE 'component_scheduler%';
  +-----------------------------+-------+
  | Variable_name               | Value |
  +-----------------------------+-------|
  | component_scheduler.enabled | On    |
  +-----------------------------+-------+
  ```

  When `audit_log_flush_interval_seconds` has a value of zero (the default), no automatic refresh of the privileges occurs, even if the `scheduler` component is enabled (`ON`).

  Values between `0` and `60` (1 to 59) are not acknowledged; instead, these values adjust to `60` automatically and the server emits a warning. Values greater than `60` define the number of seconds the `scheduler` component waits from startup, or from the beginning of the previous execution, until it attempts to schedule another execution.

  To persist this global system variable to the `mysqld-auto.cnf` file without setting the global variable runtime value, precede the variable name by the `PERSIST_ONLY` keyword or the `@@PERSIST_ONLY.` qualifier.

* `audit_log_format`

  <table frame="box" rules="all" summary="Properties for audit-log"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">ON</code></p><p class="valid-value"><code class="literal">OFF</code></p><p class="valid-value"><code class="literal">FORCE</code></p><p class="valid-value"><code class="literal">FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  The audit log file format. Permitted values are `OLD` (old-style XML), `NEW` (new-style XML; the default), and `JSON`. For details about each format, see Section 8.4.6.4, “Audit Log File Formats”.

* `audit_log_format_unix_timestamp`

  <table frame="box" rules="all" summary="Properties for audit-log"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">ON</code></p><p class="valid-value"><code class="literal">OFF</code></p><p class="valid-value"><code class="literal">FORCE</code></p><p class="valid-value"><code class="literal">FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  This variable applies only for JSON-format audit log output. When that is true, enabling this variable causes each log file record to include a `time` field. The field value is an integer that represents the UNIX timestamp value indicating the date and time when the audit event was generated.

  Changing the value of this variable at runtime causes log file rotation so that, for a given JSON-format log file, all records in the file either do or do not include the `time` field.

  Setting the runtime value of `audit_log_format_unix_timestamp` requires the `AUDIT_ADMIN` privilege, in addition to the `SYSTEM_VARIABLES_ADMIN` privilege (or the deprecated `SUPER` privilege) normally required to set a global system variable runtime value.

* `audit_log_include_accounts`

  <table frame="box" rules="all" summary="Properties for audit-log"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">ON</code></p><p class="valid-value"><code class="literal">OFF</code></p><p class="valid-value"><code class="literal">FORCE</code></p><p class="valid-value"><code class="literal">FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  Note

  This deprecated variable applies only to legacy mode audit log filtering (see Section 8.4.6.10, “Legacy Mode Audit Log Filtering”).

  The accounts for which events should be logged. The value should be `NULL` or a string containing a list of one or more comma-separated account names. For more information, see Section 8.4.6.7, “Audit Log Filtering”.

  Modifications to `audit_log_include_accounts` affect only connections created subsequent to the modification, not existing connections.

* `audit_log_max_size`

  <table frame="box" rules="all" summary="Properties for audit-log"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">ON</code></p><p class="valid-value"><code class="literal">OFF</code></p><p class="valid-value"><code class="literal">FORCE</code></p><p class="valid-value"><code class="literal">FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  `audit_log_max_size` pertains to audit log file pruning, which is supported for JSON-format log files only. It controls pruning based on combined log file size:

  + A value of 0 (the default) disables size-based pruning. No size limit is enforced.

  + A value greater than 0 enables size-based pruning. The value is the combined size above which audit log files become subject to pruning.

  If you set `audit_log_max_size` to a value that is not a multiple of 4096, it is truncated to the nearest multiple. In particular, setting it to a value less than 4096 sets it to 0 and no size-based pruning occurs.

  If both `audit_log_max_size` and `audit_log_rotate_on_size` are greater than 0, `audit_log_max_size` should be more than 7 times the value of `audit_log_rotate_on_size`. Otherwise, a warning is written to the server error log because in this case the “granularity” of size-based pruning may be insufficient to prevent removal of all or most rotated log files each time it occurs.

  Note

  Setting `audit_log_max_size` by itself is not sufficient to cause log file pruning to occur because the pruning algorithm uses `audit_log_rotate_on_size`, `audit_log_max_size`, and `audit_log_prune_seconds` in conjunction. For details, see Space Management of Audit Log Files.

* `audit_log_password_history_keep_days`

  <table frame="box" rules="all" summary="Properties for audit-log"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">ON</code></p><p class="valid-value"><code class="literal">OFF</code></p><p class="valid-value"><code class="literal">FORCE</code></p><p class="valid-value"><code class="literal">FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  The audit log plugin implements log file encryption using encryption passwords stored in the MySQL keyring (see Encrypting Audit Log Files). The plugin also implements password history, which includes password archiving and expiration (removal).

  When the audit log plugin creates a new encryption password, it archives the previous password, if one exists, for later use. The `audit_log_password_history_keep_days` variable controls automatic removal of expired archived passwords. Its value indicates the number of days after which archived audit log encryption passwords are removed. The default of 0 disables password expiration: the password retention period is forever.

  New audit log encryption passwords are created under these circumstances:

  + During plugin initialization, if the plugin finds that log file encryption is enabled, it checks whether the keyring contains an audit log encryption password. If not, the plugin automatically generates a random initial encryption password.

  + When the `audit_log_encryption_password_set()` function is called to set a specific password.

  In each case, the plugin stores the new password in the key ring and uses it to encrypt new log files.

  Removal of expired audit log encryption passwords occurs under these circumstances:

  + During plugin initialization.
  + When the `audit_log_encryption_password_set()` function is called.

  + When the runtime value of `audit_log_password_history_keep_days` is changed from its current value to a value greater than 0. Runtime value changes occur for `SET` statements that use the `GLOBAL` or `PERSIST` keyword, but not the `PERSIST_ONLY` keyword. `PERSIST_ONLY` writes the variable setting to `mysqld-auto.cnf`, but has no effect on the runtime value.

  When password removal occurs, the current value of `audit_log_password_history_keep_days` determines which passwords to remove:

  + If the value is 0, the plugin removes no passwords.
  + If the value is *`N`* > 0, the plugin removes passwords more than *`N`* days old.

  Note

  Take care not to expire old passwords that are still needed to read archived encrypted log files.

  If you normally leave password expiration disabled (that is, `audit_log_password_history_keep_days` has a value of 0), it is possible to perform an on-demand cleanup operation by temporarily assigning the variable a value greater than zero. For example, to expire passwords older than 365 days, do this:

  ```
  SET GLOBAL audit_log_password_history_keep_days = 365;
  SET GLOBAL audit_log_password_history_keep_days = 0;
  ```

  Setting the runtime value of `audit_log_password_history_keep_days` requires the `AUDIT_ADMIN` privilege, in addition to the `SYSTEM_VARIABLES_ADMIN` privilege (or the deprecated `SUPER` privilege) normally required to set a global system variable runtime value.

* `audit_log_policy`

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="audit-log-reference.html#sysvar_audit_log_buffer_size">audit_log_buffer_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">4096</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code class="literal">18446744073709547520</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code class="literal">4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Note">Block Size</a></th> <td><code class="literal">4096</code></td> </tr></tbody></table>

  Note

  This deprecated variable applies only to legacy mode audit log filtering (see Section 8.4.6.10, “Legacy Mode Audit Log Filtering”).

  The policy controlling how the audit log plugin writes events to its log file. The following table shows the permitted values.

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="audit-log-reference.html#sysvar_audit_log_buffer_size">audit_log_buffer_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">4096</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code class="literal">18446744073709547520</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code class="literal">4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Note">Block Size</a></th> <td><code class="literal">4096</code></td> </tr></tbody></table>

  `audit_log_policy` can be set only at server startup. At runtime, it is a read-only variable. Two other system variables, `audit_log_connection_policy` and `audit_log_statement_policy`, provide finer control over logging policy and can be set either at startup or at runtime. If you use `audit_log_policy` at startup instead of the other two variables, the server uses its value to set those variables. For more information about the policy variables and their interaction, see Section 8.4.6.5, “Configuring Audit Logging Characteristics”.

* `audit_log_prune_seconds`

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="audit-log-reference.html#sysvar_audit_log_buffer_size">audit_log_buffer_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">4096</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code class="literal">18446744073709547520</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code class="literal">4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Note">Block Size</a></th> <td><code class="literal">4096</code></td> </tr></tbody></table>

  `audit_log_prune_seconds` pertains to audit log file pruning, which is supported for JSON-format log files only. It controls pruning based on log file age:

  + A value of 0 (the default) disables age-based pruning. No age limit is enforced.

  + A value greater than 0 enables age-based pruning. The value is the number of seconds after which audit log files become subject to pruning.

  Note

  Setting `audit_log_prune_seconds` by itself is not sufficient to cause log file pruning to occur because the pruning algorithm uses `audit_log_rotate_on_size`, `audit_log_max_size`, and `audit_log_prune_seconds` in conjunction. For details, see Space Management of Audit Log Files.

* `audit_log_read_buffer_size`

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="audit-log-reference.html#sysvar_audit_log_buffer_size">audit_log_buffer_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">4096</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code class="literal">18446744073709547520</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code class="literal">4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Note">Block Size</a></th> <td><code class="literal">4096</code></td> </tr></tbody></table>

  The buffer size for reading from the audit log file, in bytes. The `audit_log_read()` function reads no more than this many bytes. Log file reading is supported only for JSON log format. For more information, see Section 8.4.6.6, “Reading Audit Log Files”.

  This variable has a default of 32KB and can be set at runtime. Each client should set its session value of `audit_log_read_buffer_size` appropriately for its use of `audit_log_read()`.

* `audit_log_rotate_on_size`

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="audit-log-reference.html#sysvar_audit_log_buffer_size">audit_log_buffer_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">4096</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code class="literal">18446744073709547520</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code class="literal">4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Note">Block Size</a></th> <td><code class="literal">4096</code></td> </tr></tbody></table>

  If `audit_log_rotate_on_size` is 0, the audit log plugin does not perform automatic size-based log file rotation. If rotation is to occur, you must perform it manually; see Manual Audit Log File Rotation.

  If `audit_log_rotate_on_size` is greater than 0, automatic size-based log file rotation occurs. Whenever a write to the log file causes its size to exceed the `audit_log_rotate_on_size` value, the audit log plugin renames the current log file and opens a new current log file using the original name.

  If you set `audit_log_rotate_on_size` to a value that is not a multiple of 4096, it is truncated to the nearest multiple. In particular, setting it to a value less than 4096 sets it to 0 and no rotation occurs, except manually.

  Note

  `audit_log_rotate_on_size` controls whether audit log file rotation occurs. It can also be used in conjunction with `audit_log_max_size` and `audit_log_prune_seconds` to configure pruning of rotated JSON-format log files. For details, see Space Management of Audit Log Files.

* `audit_log_statement_policy`

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="audit-log-reference.html#sysvar_audit_log_buffer_size">audit_log_buffer_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">4096</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code class="literal">18446744073709547520</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code class="literal">4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Note">Block Size</a></th> <td><code class="literal">4096</code></td> </tr></tbody></table>

  Note

  This deprecated variable applies only to legacy mode audit log filtering (see Section 8.4.6.10, “Legacy Mode Audit Log Filtering”).

  The policy controlling how the audit log plugin writes statement events to its log file. The following table shows the permitted values.

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="audit-log-reference.html#sysvar_audit_log_buffer_size">audit_log_buffer_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">4096</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code class="literal">18446744073709547520</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code class="literal">4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Note">Block Size</a></th> <td><code class="literal">4096</code></td> </tr></tbody></table>

  Note

  At server startup, any explicit value given for `audit_log_statement_policy` may be overridden if `audit_log_policy` is also specified, as described in Section 8.4.6.5, “Configuring Audit Logging Characteristics”.

* `audit_log_strategy`

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="audit-log-reference.html#sysvar_audit_log_buffer_size">audit_log_buffer_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">4096</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code class="literal">18446744073709547520</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code class="literal">4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Note">Block Size</a></th> <td><code class="literal">4096</code></td> </tr></tbody></table>

  The logging method used by the audit log plugin. These strategy values are permitted:

  + `ASYNCHRONOUS`: Log asynchronously. Wait for space in the output buffer.

  + `PERFORMANCE`: Log asynchronously. Drop requests for which there is insufficient space in the output buffer.

  + `SEMISYNCHRONOUS`: Log synchronously. Permit caching by the operating system.

  + `SYNCHRONOUS`: Log synchronously. Call `sync()` after each request.

##### Audit Log Status Variables

If the audit log plugin is enabled, it exposes several status variables that provide operational information. These variables are available for legacy mode audit filtering (deprecated) and JSON mode audit filtering.

* `Audit_log_current_size`

  The size of the current audit log file. The value increases when an event is written to the log and is reset to 0 when the log is rotated.

* `Audit_log_direct_writes`

  When the audit log plugin writes events to the JSON-format audit log, it uses a buffer to store event contents prior to writing them. If the query length is greater than the size of the buffer, then the plugin writes the event directly to the log, bypassing the buffer. This variable shows the number of direct writes. The plugin determines the count based on the current write strategy in use (see `audit_log_strategy`).

  **Table 8.45 Write-Strategy Effect on the Direct Write Count**

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code class="literal"><a class="link" href="audit-log-reference.html#sysvar_audit_log_buffer_size">audit_log_buffer_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><a class="link" href="optimizer-hints.html#optimizer-hints-set-var" title="Variable-Setting Hint Syntax"><code class="literal">SET_VAR</code></a> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">4096</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code class="literal">18446744073709547520</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code class="literal">4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Note">Block Size</a></th> <td><code class="literal">4096</code></td> </tr></tbody></table>

* `Audit_log_event_max_drop_size`

  The size of the largest dropped event in performance logging mode. For a description of logging modes, see Section 8.4.6.5, “Configuring Audit Logging Characteristics”.

* `Audit_log_events`

  The number of events handled by the audit log plugin, whether or not they were written to the log based on filtering policy (see Section 8.4.6.5, “Configuring Audit Logging Characteristics”).

* `Audit_log_events_filtered`

  The number of events handled by the audit log plugin that were filtered (not written to the log) based on filtering policy (see Section 8.4.6.5, “Configuring Audit Logging Characteristics”).

* `Audit_log_events_lost`

  The number of events lost in performance logging mode because an event was larger than the available audit log buffer space. This value may be useful for assessing how to set `audit_log_buffer_size` to size the buffer for performance mode. For a description of logging modes, see Section 8.4.6.5, “Configuring Audit Logging Characteristics”.

* `Audit_log_events_written`

  The number of events written to the audit log.

* `Audit_log_total_size`

  The total size of events written to all audit log files. Unlike `Audit_log_current_size`, the value of `Audit_log_total_size` increases even when the log is rotated.

* `Audit_log_write_waits`

  The number of times an event had to wait for space in the audit log buffer in asynchronous logging mode. For a description of logging modes, see Section 8.4.6.5, “Configuring Audit Logging Characteristics”.
