#### 6.4.5.11 Audit Log Reference

The following sections provide a reference to MySQL Enterprise Audit elements:

* [Audit Log Tables](audit-log-reference.html#audit-log-tables "Audit Log Tables")
* [Audit Log Functions](audit-log-reference.html#audit-log-routines "Audit Log Functions")
* [Audit Log Option and Variable Reference](audit-log-reference.html#audit-log-option-variable-reference "Audit Log Option and Variable Reference")
* [Audit Log Options and Variables](audit-log-reference.html#audit-log-options-variables "Audit Log Options and Variables")
* [Audit Log Status Variables](audit-log-reference.html#audit-log-status-variables "Audit Log Status Variables")

To install the audit log tables and functions, use the instructions provided in [Section 6.4.5.2, “Installing or Uninstalling MySQL Enterprise Audit”](audit-log-installation.html "6.4.5.2 Installing or Uninstalling MySQL Enterprise Audit"). Unless those objects are installed, the `audit_log` plugin operates in legacy mode. See [Section 6.4.5.10, “Legacy Mode Audit Log Filtering”](audit-log-legacy-filtering.html "6.4.5.10 Legacy Mode Audit Log Filtering").

##### Audit Log Tables

MySQL Enterprise Audit uses tables in the `mysql` system database for persistent storage of filter and user account data. The tables can be accessed only by users who have privileges for that database. The tables use the `InnoDB` storage engine (`MyISAM` prior to MySQL 5.7.21).

If these tables are missing, the `audit_log` plugin operates in legacy mode. See [Section 6.4.5.10, “Legacy Mode Audit Log Filtering”](audit-log-legacy-filtering.html "6.4.5.10 Legacy Mode Audit Log Filtering").

The `audit_log_filter` table stores filter definitions. The table has these columns:

* `NAME`

  The filter name.

* `FILTER`

  The filter definition associated with the filter name. Definitions are stored as [`JSON`](json.html "11.5 The JSON Data Type") values.

The `audit_log_user` table stores user account information. The table has these columns:

* `USER`

  The user name part of an account. For an account `user1@localhost`, the `USER` part is `user1`.

* `HOST`

  The host name part of an account. For an account `user1@localhost`, the `HOST` part is `localhost`.

* `FILTERNAME`

  The name of the filter assigned to the account. The filter name associates the account with a filter defined in the `audit_log_filter` table.

##### Audit Log Functions

This section describes, for each audit log function, its purpose, calling sequence, and return value. For information about the conditions under which these functions can be invoked, see [Section 6.4.5.7, “Audit Log Filtering”](audit-log-filtering.html "6.4.5.7 Audit Log Filtering").

Each audit log function returns a string that indicates whether the operation succeeded. `OK` indicates success. `ERROR: message` indicates failure.

Audit log functions treat string arguments as binary strings (which means they do not distinguish lettercase), and string return values are binary strings.

If an audit log function is invoked from within the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client, binary string results display using hexadecimal notation, depending on the value of the [`--binary-as-hex`](mysql-command-options.html#option_mysql_binary-as-hex). For more information about that option, see [Section 4.5.1, “mysql — The MySQL Command-Line Client”](mysql.html "4.5.1 mysql — The MySQL Command-Line Client").

These audit log functions are available:

* [`audit_log_encryption_password_get()`](audit-log-reference.html#function_audit-log-encryption-password-get)

  Retrieves the current audit log encryption password as a binary string. The password is fetched from the MySQL keyring, which must be enabled or an error occurs. Any keyring plugin can be used; for instructions, see [Section 6.4.4, “The MySQL Keyring”](keyring.html "6.4.4 The MySQL Keyring").

  For additional information about audit log encryption, see [Encrypting Audit Log Files](audit-log-logging-configuration.html#audit-log-file-encryption "Encrypting Audit Log Files").

  Arguments:

  None.

  Return value:

  The password string for success (up to 766 bytes), or `NULL` and an error for failure.

  Example:

  ```sql
  mysql> SELECT audit_log_encryption_password_get();
  +-------------------------------------+
  | audit_log_encryption_password_get() |
  +-------------------------------------+
  | secret                              |
  +-------------------------------------+
  ```

* [`audit_log_encryption_password_set(password)`](audit-log-reference.html#function_audit-log-encryption-password-set)

  Sets the audit log encryption password to the argument, stores the password in the MySQL keyring. If encryption is enabled, the function performs a log file rotation operation that renames the current log file, and begins a new log file encrypted with the password. The keyring must be enabled or an error occurs. Any keyring plugin can be used; for instructions, see [Section 6.4.4, “The MySQL Keyring”](keyring.html "6.4.4 The MySQL Keyring").

  For additional information about audit log encryption, see [Encrypting Audit Log Files](audit-log-logging-configuration.html#audit-log-file-encryption "Encrypting Audit Log Files").

  Arguments:

  *`password`*: The password string. The maximum permitted length is 766 bytes.

  Return value:

  1 for success, 0 for failure.

  Example:

  ```sql
  mysql> SELECT audit_log_encryption_password_set(password);
  +---------------------------------------------+
  | audit_log_encryption_password_set(password) |
  +---------------------------------------------+
  | 1                                           |
  +---------------------------------------------+
  ```

* [`audit_log_filter_flush()`](audit-log-reference.html#function_audit-log-filter-flush)

  Calling any of the other filtering functions affects operational audit log filtering immediately and updates the audit log tables. If instead you modify the contents of those tables directly using statements such as [`INSERT`](insert.html "13.2.5 INSERT Statement"), [`UPDATE`](update.html "13.2.11 UPDATE Statement"), and [`DELETE`](delete.html "13.2.2 DELETE Statement"), the changes do not affect filtering immediately. To flush your changes and make them operational, call [`audit_log_filter_flush()`](audit-log-reference.html#function_audit-log-filter-flush).

  Warning

  [`audit_log_filter_flush()`](audit-log-reference.html#function_audit-log-filter-flush) should be used only after modifying the audit tables directly, to force reloading all filters. Otherwise, this function should be avoided. It is, in effect, a simplified version of unloading and reloading the `audit_log` plugin with [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement") plus [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement").

  [`audit_log_filter_flush()`](audit-log-reference.html#function_audit-log-filter-flush) affects all current sessions and detaches them from their previous filters. Current sessions are no longer logged unless they disconnect and reconnect, or execute a change-user operation.

  If this function fails, an error message is returned and the audit log is disabled until the next successful call to [`audit_log_filter_flush()`](audit-log-reference.html#function_audit-log-filter-flush).

  Arguments:

  None.

  Return value:

  A string that indicates whether the operation succeeded. `OK` indicates success. `ERROR: message` indicates failure.

  Example:

  ```sql
  mysql> SELECT audit_log_filter_flush();
  +--------------------------+
  | audit_log_filter_flush() |
  +--------------------------+
  | OK                       |
  +--------------------------+
  ```

* [`audit_log_filter_remove_filter(filter_name)`](audit-log-reference.html#function_audit-log-filter-remove-filter)

  Given a filter name, removes the filter from the current set of filters. It is not an error for the filter not to exist.

  If a removed filter is assigned to any user accounts, those users stop being filtered (they are removed from the `audit_log_user` table). Termination of filtering includes any current sessions for those users: They are detached from the filter and no longer logged.

  Arguments:

  + *`filter_name`*: A string that specifies the filter name.

  Return value:

  A string that indicates whether the operation succeeded. `OK` indicates success. `ERROR: message` indicates failure.

  Example:

  ```sql
  mysql> SELECT audit_log_filter_remove_filter('SomeFilter');
  +----------------------------------------------+
  | audit_log_filter_remove_filter('SomeFilter') |
  +----------------------------------------------+
  | OK                                           |
  +----------------------------------------------+
  ```

* [`audit_log_filter_remove_user(user_name)`](audit-log-reference.html#function_audit-log-filter-remove-user)

  Given a user account name, cause the user to be no longer assigned to a filter. It is not an error if the user has no filter assigned. Filtering of current sessions for the user remains unaffected. New connections for the user are filtered using the default account filter if there is one, and are not logged otherwise.

  If the name is `%`, the function removes the default account filter that is used for any user account that has no explicitly assigned filter.

  Arguments:

  + *`user_name`*: The user account name as a string in `user_name@host_name` format, or `%` to represent the default account.

  Return value:

  A string that indicates whether the operation succeeded. `OK` indicates success. `ERROR: message` indicates failure.

  Example:

  ```sql
  mysql> SELECT audit_log_filter_remove_user('user1@localhost');
  +-------------------------------------------------+
  | audit_log_filter_remove_user('user1@localhost') |
  +-------------------------------------------------+
  | OK                                              |
  +-------------------------------------------------+
  ```

* [`audit_log_filter_set_filter(filter_name, definition)`](audit-log-reference.html#function_audit-log-filter-set-filter)

  Given a filter name and definition, adds the filter to the current set of filters. If the filter already exists and is used by any current sessions, those sessions are detached from the filter and are no longer logged. This occurs because the new filter definition has a new filter ID that differs from its previous ID.

  Arguments:

  + *`filter_name`*: A string that specifies the filter name.

  + *`definition`*: A [`JSON`](json.html "11.5 The JSON Data Type") value that specifies the filter definition.

  Return value:

  A string that indicates whether the operation succeeded. `OK` indicates success. `ERROR: message` indicates failure.

  Example:

  ```sql
  mysql> SET @f = '{ "filter": { "log": false } }';
  mysql> SELECT audit_log_filter_set_filter('SomeFilter', @f);
  +-----------------------------------------------+
  | audit_log_filter_set_filter('SomeFilter', @f) |
  +-----------------------------------------------+
  | OK                                            |
  +-----------------------------------------------+
  ```

* [`audit_log_filter_set_user(user_name, filter_name)`](audit-log-reference.html#function_audit-log-filter-set-user)

  Given a user account name and a filter name, assigns the filter to the user. A user can be assigned only one filter, so if the user was already assigned a filter, the assignment is replaced. Filtering of current sessions for the user remains unaffected. New connections are filtered using the new filter.

  As a special case, the name `%` represents the default account. The filter is used for connections from any user account that has no explicitly assigned filter.

  Arguments:

  + *`user_name`*: The user account name as a string in `user_name@host_name` format, or `%` to represent the default account.

  + *`filter_name`*: A string that specifies the filter name.

  Return value:

  A string that indicates whether the operation succeeded. `OK` indicates success. `ERROR: message` indicates failure.

  Example:

  ```sql
  mysql> SELECT audit_log_filter_set_user('user1@localhost', 'SomeFilter');
  +------------------------------------------------------------+
  | audit_log_filter_set_user('user1@localhost', 'SomeFilter') |
  +------------------------------------------------------------+
  | OK                                                         |
  +------------------------------------------------------------+
  ```

* [`audit_log_read([arg])`](audit-log-reference.html#function_audit-log-read)

  Reads the audit log and returns a binary [`JSON`](json.html "11.5 The JSON Data Type") string result. If the audit log format is not [`JSON`](json.html "11.5 The JSON Data Type"), an error occurs.

  With no argument or a [`JSON`](json.html "11.5 The JSON Data Type") hash argument, [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) reads events from the audit log and returns a [`JSON`](json.html "11.5 The JSON Data Type") string containing an array of audit events. Items in the hash argument influence how reading occurs, as described later. Each element in the returned array is an event represented as a [`JSON`](json.html "11.5 The JSON Data Type") hash, with the exception that the last element may be a [`JSON`](json.html "11.5 The JSON Data Type") `null` value to indicate no following events are available to read.

  With an argument consisting of a [`JSON`](json.html "11.5 The JSON Data Type") `null` value, [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) closes the current read sequence.

  For additional details about the audit log-reading process, see [Section 6.4.5.6, “Reading Audit Log Files”](audit-log-file-reading.html "6.4.5.6 Reading Audit Log Files").

  Arguments:

  *`arg`*: The argument is optional. If omitted, the function reads events from the current position. If present, the argument can be a [`JSON`](json.html "11.5 The JSON Data Type") `null` value to close the read sequence, or a [`JSON`](json.html "11.5 The JSON Data Type") hash. Within a hash argument, items are optional and control aspects of the read operation such as the position at which to begin reading or how many events to read. The following items are significant (other items are ignored):

  + `timestamp`, `id`: The position within the audit log of the first event to read. If the position is omitted from the argument, reading continues from the current position. The `timestamp` and `id` items together comprise a bookmark that uniquely identify a particular event. If an [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) argument includes either item, it must include both to completely specify a position or an error occurs.

    To obtain a bookmark for the most recently written event, call [`audit_log_read_bookmark()`](audit-log-reference.html#function_audit-log-read-bookmark).

  + `max_array_length`: The maximum number of events to read from the log. If this item is omitted, the default is to read to the end of the log or until the read buffer is full, whichever comes first.

  Return value:

  If the call succeeds, the return value is a binary [`JSON`](json.html "11.5 The JSON Data Type") string containing an array of audit events, or a [`JSON`](json.html "11.5 The JSON Data Type") `null` value if that was passed as the argument to close the read sequence. If the call fails, the return value is `NULL` and an error occurs.

  Example:

  ```sql
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

* [`audit_log_read_bookmark()`](audit-log-reference.html#function_audit-log-read-bookmark)

  Returns a binary [`JSON`](json.html "11.5 The JSON Data Type") string representing a bookmark for the most recently written audit log event. If the audit log format is not `JSON`, an error occurs.

  The bookmark is a [`JSON`](json.html "11.5 The JSON Data Type") hash with `timestamp` and `id` items that uniquely identify the position of an event within the audit log. It is suitable for passing to [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) to indicate to that function the position at which to begin reading.

  For additional details about the audit log-reading process, see [Section 6.4.5.6, “Reading Audit Log Files”](audit-log-file-reading.html "6.4.5.6 Reading Audit Log Files").

  Arguments:

  None.

  Return value:

  A binary [`JSON`](json.html "11.5 The JSON Data Type") string containing a bookmark for success, or `NULL` and an error for failure.

  Example:

  ```sql
  mysql> SELECT audit_log_read_bookmark();
  +-------------------------------------------------+
  | audit_log_read_bookmark()                       |
  +-------------------------------------------------+
  | { "timestamp": "2019-10-03 21:03:44", "id": 0 } |
  +-------------------------------------------------+
  ```

##### Audit Log Option and Variable Reference

**Table 6.34 Audit Log Option and Variable Reference**

<table frame="box" rules="all" summary="Reference for audit log command-line options, system variables, and status variables."><col style="width: 20%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><thead><tr><th>Name</th> <th>Cmd-Line</th> <th>Option File</th> <th>System Var</th> <th>Status Var</th> <th>Var Scope</th> <th>Dynamic</th> </tr></thead><tbody><tr><th><a class="link" href="audit-log-reference.html#option_mysqld_audit-log">audit-log</a></th> <td>Yes</td> <td>Yes</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_buffer_size">audit_log_buffer_size</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_compression">audit_log_compression</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_connection_policy">audit_log_connection_policy</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_current_session">audit_log_current_session</a></th> <td></td> <td></td> <td>Yes</td> <td></td> <td>Both</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#statvar_Audit_log_current_size">Audit_log_current_size</a></th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_disable">audit_log_disable</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_encryption">audit_log_encryption</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#statvar_Audit_log_event_max_drop_size">Audit_log_event_max_drop_size</a></th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#statvar_Audit_log_events">Audit_log_events</a></th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#statvar_Audit_log_events_filtered">Audit_log_events_filtered</a></th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#statvar_Audit_log_events_lost">Audit_log_events_lost</a></th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#statvar_Audit_log_events_written">Audit_log_events_written</a></th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_exclude_accounts">audit_log_exclude_accounts</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_file">audit_log_file</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_filter_id">audit_log_filter_id</a></th> <td></td> <td></td> <td>Yes</td> <td></td> <td>Both</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_flush">audit_log_flush</a></th> <td></td> <td></td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_format">audit_log_format</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_include_accounts">audit_log_include_accounts</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_policy">audit_log_policy</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_read_buffer_size">audit_log_read_buffer_size</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Varies</td> <td>Varies</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_rotate_on_size">audit_log_rotate_on_size</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_statement_policy">audit_log_statement_policy</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th><a class="link" href="audit-log-reference.html#sysvar_audit_log_strategy">audit_log_strategy</a></th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#statvar_Audit_log_total_size">Audit_log_total_size</a></th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th><a class="link" href="audit-log-reference.html#statvar_Audit_log_write_waits">Audit_log_write_waits</a></th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr></tbody></table>

##### Audit Log Options and Variables

This section describes the command options and system variables that configure operation of MySQL Enterprise Audit. If values specified at startup time are incorrect, the `audit_log` plugin may fail to initialize properly and the server does not load it. In this case, the server may also produce error messages for other audit log settings because it does not recognize them.

To configure activation of the audit log plugin, use this option:

* [`--audit-log[=value]`](audit-log-reference.html#option_mysqld_audit-log)

  <table frame="box" rules="all" summary="Properties for audit-log"><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  This option controls how the server loads the `audit_log` plugin at startup. It is available only if the plugin has been previously registered with [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") or is loaded with [`--plugin-load`](server-options.html#option_mysqld_plugin-load) or [`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add). See [Section 6.4.5.2, “Installing or Uninstalling MySQL Enterprise Audit”](audit-log-installation.html "6.4.5.2 Installing or Uninstalling MySQL Enterprise Audit").

  The option value should be one of those available for plugin-loading options, as described in [Section 5.5.1, “Installing and Uninstalling Plugins”](plugin-loading.html "5.5.1 Installing and Uninstalling Plugins"). For example, [`--audit-log=FORCE_PLUS_PERMANENT`](audit-log-reference.html#option_mysqld_audit-log) tells the server to load the plugin and prevent it from being removed while the server is running.

If the audit log plugin is enabled, it exposes several system variables that permit control over logging:

```sql
mysql> SHOW VARIABLES LIKE 'audit_log%';
+--------------------------------------+--------------+
| Variable_name                        | Value        |
+--------------------------------------+--------------+
| audit_log_buffer_size                | 1048576      |
| audit_log_compression                | NONE         |
| audit_log_connection_policy          | ALL          |
| audit_log_current_session            | OFF          |
| audit_log_disable                    | OFF          |
| audit_log_encryption                 | NONE         |
| audit_log_exclude_accounts           |              |
| audit_log_file                       | audit.log    |
| audit_log_filter_id                  | 0            |
| audit_log_flush                      | OFF          |
| audit_log_format                     | NEW          |
| audit_log_format_unix_timestamp      | OFF          |
| audit_log_include_accounts           |              |
| audit_log_policy                     | ALL          |
| audit_log_read_buffer_size           | 32768        |
| audit_log_rotate_on_size             | 0            |
| audit_log_statement_policy           | ALL          |
| audit_log_strategy                   | ASYNCHRONOUS |
+--------------------------------------+--------------+
```

You can set any of these variables at server startup, and some of them at runtime. Those that are available only for legacy mode audit log filtering are so noted.

* [`audit_log_buffer_size`](audit-log-reference.html#sysvar_audit_log_buffer_size)

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="audit-log-reference.html#sysvar_audit_log_buffer_size">audit_log_buffer_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code>4096</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Note">Block Size</a></th> <td><code>4096</code></td> </tr></tbody></table>

  When the audit log plugin writes events to the log asynchronously, it uses a buffer to store event contents prior to writing them. This variable controls the size of that buffer, in bytes. The server adjusts the value to a multiple of 4096. The plugin uses a single buffer, which it allocates when it initializes and removes when it terminates. The plugin allocates this buffer only if logging is asynchronous.

* [`audit_log_compression`](audit-log-reference.html#sysvar_audit_log_compression)

  <table frame="box" rules="all" summary="Properties for audit_log_compression"><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-compression=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.21</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="audit-log-reference.html#sysvar_audit_log_compression">audit_log_compression</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>NONE</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>NONE</code></p><p class="valid-value"><code>GZIP</code></p></td> </tr></tbody></table>

  The type of compression for the audit log file. Permitted values are `NONE` (no compression; the default) and `GZIP` (GNU Zip compression). For more information, see [Compressing Audit Log Files](audit-log-logging-configuration.html#audit-log-file-compression "Compressing Audit Log Files").

* [`audit_log_connection_policy`](audit-log-reference.html#sysvar_audit_log_connection_policy)

  <table frame="box" rules="all" summary="Properties for audit_log_connection_policy"><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-connection-policy=value</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="audit-log-reference.html#sysvar_audit_log_connection_policy">audit_log_connection_policy</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ALL</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>ALL</code></p><p class="valid-value"><code>ERRORS</code></p><p class="valid-value"><code>NONE</code></p></td> </tr></tbody></table>

  Note

  This variable applies only to legacy mode audit log filtering (see [Section 6.4.5.10, “Legacy Mode Audit Log Filtering”](audit-log-legacy-filtering.html "6.4.5.10 Legacy Mode Audit Log Filtering")).

  The policy controlling how the audit log plugin writes connection events to its log file. The following table shows the permitted values.

  <table summary="Permitted values for the audit_log_connection_policy variable."><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td><code>ALL</code></td> <td>Log all connection events</td> </tr><tr> <td><code>ERRORS</code></td> <td>Log only failed connection events</td> </tr><tr> <td><code>NONE</code></td> <td>Do not log connection events</td> </tr></tbody></table>

  Note

  At server startup, any explicit value given for [`audit_log_connection_policy`](audit-log-reference.html#sysvar_audit_log_connection_policy) may be overridden if [`audit_log_policy`](audit-log-reference.html#sysvar_audit_log_policy) is also specified, as described in [Section 6.4.5.5, “Configuring Audit Logging Characteristics”](audit-log-logging-configuration.html "6.4.5.5 Configuring Audit Logging Characteristics").

* [`audit_log_current_session`](audit-log-reference.html#sysvar_audit_log_current_session)

  <table frame="box" rules="all" summary="Properties for audit_log_current_session"><tbody><tr><th>System Variable</th> <td><code><a class="link" href="audit-log-reference.html#sysvar_audit_log_current_session">audit_log_current_session</a></code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>depends on filtering policy</code></td> </tr></tbody></table>

  Whether audit logging is enabled for the current session. The session value of this variable is read only. It is set when the session begins based on the values of the [`audit_log_include_accounts`](audit-log-reference.html#sysvar_audit_log_include_accounts) and [`audit_log_exclude_accounts`](audit-log-reference.html#sysvar_audit_log_exclude_accounts) system variables. The audit log plugin uses the session value to determine whether to audit events for the session. (There is a global value, but the plugin does not use it.)

* [`audit_log_disable`](audit-log-reference.html#sysvar_audit_log_disable)

  <table frame="box" rules="all" summary="Properties for audit_log_disable"><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-disable[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.37</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="audit-log-reference.html#sysvar_audit_log_disable">audit_log_disable</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Permits disabling audit logging for all connecting and connected sessions. Disabling audit logging requires the [`SUPER`](privileges-provided.html#priv_super) privilege. See [Section 6.4.5.9, “Disabling Audit Logging”](audit-log-disabling.html "6.4.5.9 Disabling Audit Logging").

* [`audit_log_encryption`](audit-log-reference.html#sysvar_audit_log_encryption)

  <table frame="box" rules="all" summary="Properties for audit_log_encryption"><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-encryption=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.21</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="audit-log-reference.html#sysvar_audit_log_encryption">audit_log_encryption</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>NONE</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>NONE</code></p><p class="valid-value"><code>AES</code></p></td> </tr></tbody></table>

  The type of encryption for the audit log file. Permitted values are `NONE` (no encryption; the default) and `AES` (AES-256-CBC cipher encryption). For more information, see [Encrypting Audit Log Files](audit-log-logging-configuration.html#audit-log-file-encryption "Encrypting Audit Log Files").

* [`audit_log_exclude_accounts`](audit-log-reference.html#sysvar_audit_log_exclude_accounts)

  <table frame="box" rules="all" summary="Properties for audit_log_exclude_accounts"><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-exclude-accounts=value</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="audit-log-reference.html#sysvar_audit_log_exclude_accounts">audit_log_exclude_accounts</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>

  Note

  This variable applies only to legacy mode audit log filtering (see [Section 6.4.5.10, “Legacy Mode Audit Log Filtering”](audit-log-legacy-filtering.html "6.4.5.10 Legacy Mode Audit Log Filtering")).

  The accounts for which events should not be logged. The value should be `NULL` or a string containing a list of one or more comma-separated account names. For more information, see [Section 6.4.5.7, “Audit Log Filtering”](audit-log-filtering.html "6.4.5.7 Audit Log Filtering").

  Modifications to [`audit_log_exclude_accounts`](audit-log-reference.html#sysvar_audit_log_exclude_accounts) affect only connections created subsequent to the modification, not existing connections.

* [`audit_log_file`](audit-log-reference.html#sysvar_audit_log_file)

  <table frame="box" rules="all" summary="Properties for audit-log"><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  The base name and suffix of the file to which the audit log plugin writes events. The default value is `audit.log`, regardless of logging format. To have the name suffix correspond to the format, set the name explicitly, choosing a different suffix (for example, `audit.xml` for XML format, `audit.json` for JSON format).

  If the value of [`audit_log_file`](audit-log-reference.html#sysvar_audit_log_file) is a relative path name, the plugin interprets it relative to the data directory. If the value is a full path name, the plugin uses the value as is. A full path name may be useful if it is desirable to locate audit files on a separate file system or directory. For security reasons, write the audit log file to a directory accessible only to the MySQL server and to users with a legitimate reason to view the log.

  For details about how the audit log plugin interprets the [`audit_log_file`](audit-log-reference.html#sysvar_audit_log_file) value and the rules for file renaming that occurs at plugin initialization and termination, see [Naming Conventions for Audit Log Files](audit-log-logging-configuration.html#audit-log-file-name "Naming Conventions for Audit Log Files").

  As of MySQL 5.7.21, the audit log plugin uses the directory containing the audit log file (determined from the [`audit_log_file`](audit-log-reference.html#sysvar_audit_log_file) value) as the location to search for readable audit log files. From these log files and the current file, the plugin constructs a list of the ones that are subject to use with the audit log bookmarking and reading functions. See [Section 6.4.5.6, “Reading Audit Log Files”](audit-log-file-reading.html "6.4.5.6 Reading Audit Log Files").

* [`audit_log_filter_id`](audit-log-reference.html#sysvar_audit_log_filter_id)

  <table frame="box" rules="all" summary="Properties for audit-log"><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  The session value of this variable indicates the internally maintained ID of the audit filter for the current session. A value of 0 means that the session has no filter assigned.

* [`audit_log_flush`](audit-log-reference.html#sysvar_audit_log_flush)

  <table frame="box" rules="all" summary="Properties for audit-log"><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  If [`audit_log_rotate_on_size`](audit-log-reference.html#sysvar_audit_log_rotate_on_size) is 0, automatic audit log file rotation is disabled and rotation occurs only when performed manually. In that case, enabling [`audit_log_flush`](audit-log-reference.html#sysvar_audit_log_flush) by setting it to 1 or `ON` causes the audit log plugin to close and reopen its log file to flush it. (The variable value remains `OFF` so that you need not disable it explicitly before enabling it again to perform another flush.) For more information, see [Section 6.4.5.5, “Configuring Audit Logging Characteristics”](audit-log-logging-configuration.html "6.4.5.5 Configuring Audit Logging Characteristics").

* [`audit_log_format`](audit-log-reference.html#sysvar_audit_log_format)

  <table frame="box" rules="all" summary="Properties for audit-log"><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  The audit log file format. Permitted values are `OLD` (old-style XML), `NEW` (new-style XML; the default), and (as of MySQL 5.7.21) `JSON`. For details about each format, see [Section 6.4.5.4, “Audit Log File Formats”](audit-log-file-formats.html "6.4.5.4 Audit Log File Formats").

  Note

  For information about issues to consider when changing the log format, see [Selecting Audit Log File Format](audit-log-logging-configuration.html#audit-log-file-format "Selecting Audit Log File Format").

* [`audit_log_format_unix_timestamp`](audit-log-reference.html#sysvar_audit_log_format_unix_timestamp)

  <table frame="box" rules="all" summary="Properties for audit-log"><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  This variable applies only for JSON-format audit log output. When that is true, enabling this variable causes each log file record to include a `time` field. The field value is an integer that represents the UNIX timestamp value indicating the date and time when the audit event was generated.

  Changing the value of this variable at runtime causes log file rotation so that, for a given JSON-format log file, all records in the file either do or do not include the `time` field.

* [`audit_log_include_accounts`](audit-log-reference.html#sysvar_audit_log_include_accounts)

  <table frame="box" rules="all" summary="Properties for audit-log"><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  Note

  This variable applies only to legacy mode audit log filtering (see [Section 6.4.5.10, “Legacy Mode Audit Log Filtering”](audit-log-legacy-filtering.html "6.4.5.10 Legacy Mode Audit Log Filtering")).

  The accounts for which events should be logged. The value should be `NULL` or a string containing a list of one or more comma-separated account names. For more information, see [Section 6.4.5.7, “Audit Log Filtering”](audit-log-filtering.html "6.4.5.7 Audit Log Filtering").

  Modifications to [`audit_log_include_accounts`](audit-log-reference.html#sysvar_audit_log_include_accounts) affect only connections created subsequent to the modification, not existing connections.

* [`audit_log_policy`](audit-log-reference.html#sysvar_audit_log_policy)

  <table frame="box" rules="all" summary="Properties for audit-log"><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  Note

  This variable applies only to legacy mode audit log filtering (see [Section 6.4.5.10, “Legacy Mode Audit Log Filtering”](audit-log-legacy-filtering.html "6.4.5.10 Legacy Mode Audit Log Filtering")).

  The policy controlling how the audit log plugin writes events to its log file. The following table shows the permitted values.

  <table frame="box" rules="all" summary="Properties for audit-log"><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  [`audit_log_policy`](audit-log-reference.html#sysvar_audit_log_policy) can be set only at server startup. At runtime, it is a read-only variable. Two other system variables, [`audit_log_connection_policy`](audit-log-reference.html#sysvar_audit_log_connection_policy) and [`audit_log_statement_policy`](audit-log-reference.html#sysvar_audit_log_statement_policy), provide finer control over logging policy and can be set either at startup or at runtime. If you use [`audit_log_policy`](audit-log-reference.html#sysvar_audit_log_policy) at startup instead of the other two variables, the server uses its value to set those variables. For more information about the policy variables and their interaction, see [Section 6.4.5.5, “Configuring Audit Logging Characteristics”](audit-log-logging-configuration.html "6.4.5.5 Configuring Audit Logging Characteristics").

* [`audit_log_read_buffer_size`](audit-log-reference.html#sysvar_audit_log_read_buffer_size)

  <table frame="box" rules="all" summary="Properties for audit-log"><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  The buffer size for reading from the audit log file, in bytes. The [`audit_log_read()`](audit-log-reference.html#function_audit-log-read) function reads no more than this many bytes. Log file reading is supported only for JSON log format. For more information, see [Section 6.4.5.6, “Reading Audit Log Files”](audit-log-file-reading.html "6.4.5.6 Reading Audit Log Files").

  As of MySQL 5.7.23, this variable has a default of 32KB and can be set at runtime. Each client should set its session value of [`audit_log_read_buffer_size`](audit-log-reference.html#sysvar_audit_log_read_buffer_size) appropriately for its use of [`audit_log_read()`](audit-log-reference.html#function_audit-log-read). Prior to MySQL 5.7.23, [`audit_log_read_buffer_size`](audit-log-reference.html#sysvar_audit_log_read_buffer_size) has a default of 1MB, affects all clients, and can be changed only at server startup.

* [`audit_log_rotate_on_size`](audit-log-reference.html#sysvar_audit_log_rotate_on_size)

  <table frame="box" rules="all" summary="Properties for audit-log"><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  If [`audit_log_rotate_on_size`](audit-log-reference.html#sysvar_audit_log_rotate_on_size) is 0, the audit log plugin does not perform automatic size-based log file rotation. If rotation is to occur, you must perform it manually; see [Manual Audit Log File Rotation](audit-log-logging-configuration.html#audit-log-manual-rotation "Manual Audit Log File Rotation").

  If [`audit_log_rotate_on_size`](audit-log-reference.html#sysvar_audit_log_rotate_on_size) is greater than 0, automatic size-based log file rotation occurs. Whenever a write to the log file causes its size to exceed the [`audit_log_rotate_on_size`](audit-log-reference.html#sysvar_audit_log_rotate_on_size) value, the audit log plugin renames the current log file and opens a new current log file using the original name.

  If you set [`audit_log_rotate_on_size`](audit-log-reference.html#sysvar_audit_log_rotate_on_size) to a value that is not a multiple of 4096, it is truncated to the nearest multiple. In particular, setting it to a value less than 4096 sets it to 0 and no rotation occurs, except manually.

  For more information about audit log file rotation, see [Space Management of Audit Log Files](audit-log-logging-configuration.html#audit-log-space-management "Space Management of Audit Log Files").

* [`audit_log_statement_policy`](audit-log-reference.html#sysvar_audit_log_statement_policy)

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="audit-log-reference.html#sysvar_audit_log_buffer_size">audit_log_buffer_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code>4096</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Note">Block Size</a></th> <td><code>4096</code></td> </tr></tbody></table>

  Note

  This variable applies only to legacy mode audit log filtering (see [Section 6.4.5.10, “Legacy Mode Audit Log Filtering”](audit-log-legacy-filtering.html "6.4.5.10 Legacy Mode Audit Log Filtering")).

  The policy controlling how the audit log plugin writes statement events to its log file. The following table shows the permitted values.

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="audit-log-reference.html#sysvar_audit_log_buffer_size">audit_log_buffer_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code>4096</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Note">Block Size</a></th> <td><code>4096</code></td> </tr></tbody></table>

  Note

  At server startup, any explicit value given for [`audit_log_statement_policy`](audit-log-reference.html#sysvar_audit_log_statement_policy) may be overridden if [`audit_log_policy`](audit-log-reference.html#sysvar_audit_log_policy) is also specified, as described in [Section 6.4.5.5, “Configuring Audit Logging Characteristics”](audit-log-logging-configuration.html "6.4.5.5 Configuring Audit Logging Characteristics").

* [`audit_log_strategy`](audit-log-reference.html#sysvar_audit_log_strategy)

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="audit-log-reference.html#sysvar_audit_log_buffer_size">audit_log_buffer_size</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code>4096</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th><a class="link" href="server-system-variables.html#system-variables-block-size" title="Note">Block Size</a></th> <td><code>4096</code></td> </tr></tbody></table>

  The logging method used by the audit log plugin. These strategy values are permitted:

  + `ASYNCHRONOUS`: Log asynchronously. Wait for space in the output buffer.

  + `PERFORMANCE`: Log asynchronously. Drop requests for which there is insufficient space in the output buffer.

  + `SEMISYNCHRONOUS`: Log synchronously. Permit caching by the operating system.

  + `SYNCHRONOUS`: Log synchronously. Call `sync()` after each request.

##### Audit Log Status Variables

If the audit log plugin is enabled, it exposes several status variables that provide operational information. These variables are available for legacy mode audit filtering and JSON mode audit filtering.

* [`Audit_log_current_size`](audit-log-reference.html#statvar_Audit_log_current_size)

  The size of the current audit log file. The value increases when an event is written to the log and is reset to 0 when the log is rotated.

* [`Audit_log_event_max_drop_size`](audit-log-reference.html#statvar_Audit_log_event_max_drop_size)

  The size of the largest dropped event in performance logging mode. For a description of logging modes, see [Section 6.4.5.5, “Configuring Audit Logging Characteristics”](audit-log-logging-configuration.html "6.4.5.5 Configuring Audit Logging Characteristics").

* [`Audit_log_events`](audit-log-reference.html#statvar_Audit_log_events)

  The number of events handled by the audit log plugin, whether or not they were written to the log based on filtering policy (see [Section 6.4.5.5, “Configuring Audit Logging Characteristics”](audit-log-logging-configuration.html "6.4.5.5 Configuring Audit Logging Characteristics")).

* [`Audit_log_events_filtered`](audit-log-reference.html#statvar_Audit_log_events_filtered)

  The number of events handled by the audit log plugin that were filtered (not written to the log) based on filtering policy (see [Section 6.4.5.5, “Configuring Audit Logging Characteristics”](audit-log-logging-configuration.html "6.4.5.5 Configuring Audit Logging Characteristics")).

* [`Audit_log_events_lost`](audit-log-reference.html#statvar_Audit_log_events_lost)

  The number of events lost in performance logging mode because an event was larger than the available audit log buffer space. This value may be useful for assessing how to set [`audit_log_buffer_size`](audit-log-reference.html#sysvar_audit_log_buffer_size) to size the buffer for performance mode. For a description of logging modes, see [Section 6.4.5.5, “Configuring Audit Logging Characteristics”](audit-log-logging-configuration.html "6.4.5.5 Configuring Audit Logging Characteristics").

* [`Audit_log_events_written`](audit-log-reference.html#statvar_Audit_log_events_written)

  The number of events written to the audit log.

* [`Audit_log_total_size`](audit-log-reference.html#statvar_Audit_log_total_size)

  The total size of events written to all audit log files. Unlike [`Audit_log_current_size`](audit-log-reference.html#statvar_Audit_log_current_size), the value of [`Audit_log_total_size`](audit-log-reference.html#statvar_Audit_log_total_size) increases even when the log is rotated.

* [`Audit_log_write_waits`](audit-log-reference.html#statvar_Audit_log_write_waits)

  The number of times an event had to wait for space in the audit log buffer in asynchronous logging mode. For a description of logging modes, see [Section 6.4.5.5, “Configuring Audit Logging Characteristics”](audit-log-logging-configuration.html "6.4.5.5 Configuring Audit Logging Characteristics").
