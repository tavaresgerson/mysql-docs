#### 8.4.5.7 Audit Log Filtering

::: info Note

For audit log filtering to work as described here, the audit log plugin *and the accompanying audit tables and functions* must be installed. If the plugin is installed without the accompanying audit tables and functions needed for rule-based filtering, the plugin operates in legacy filtering mode, described in Section 8.4.5.10, “Legacy Mode Audit Log Filtering”. Legacy mode (deprecated) is filtering behavior as it was prior to MySQL 5.7.13; that is, before the introduction of rule-based filtering.

:::

*  Properties of Audit Log Filtering
*  Constraints on Audit Log Filtering Functions
*  Using Audit Log Filtering Functions

##### Properties of Audit Log Filtering

The audit log plugin has the capability of controlling logging of audited events by filtering them:

* Audited events can be filtered using these characteristics:

  + User account
  + Audit event class
  + Audit event subclass
  + Audit event fields such as those that indicate operation status or SQL statement executed
* Audit filtering is rule based:

  + A filter definition creates a set of auditing rules. Definitions can be configured to include or exclude events for logging based on the characteristics just described.
  + Filter rules have the capability of blocking (aborting) execution of qualifying events, in addition to existing capabilities for event logging.
  + Multiple filters can be defined, and any given filter can be assigned to any number of user accounts.
  + It is possible to define a default filter to use with any user account that has no explicitly assigned filter.

  Audit log filtering is used to implement component services. To get the optional query statistics available from that release, you set them up as a filter using the service component, which implements the services that write the statistics to the audit log. For instructions to set this filter up, see Adding Query Statistics for Outlier Detection.

  For information about writing filtering rules, see Section 8.4.5.8, “Writing Audit Log Filter Definitions”.
* Audit log filters can be defined and modified using an SQL interface based on function calls. By default, audit log filter definitions are stored in the `mysql` system database, and you can display audit filters by querying the `mysql.audit_log_filter` table. It is possible to use a different database for this purpose, in which case you should query the `database_name.audit_log_filter` table instead. See Section 8.4.5.2, “Installing or Uninstalling MySQL Enterprise Audit”, for more information.
* Within a given session, the value of the read-only `audit_log_filter_id` system variable indicates whether a filter is assigned to the session.


::: info Note

By default, rule-based audit log filtering logs no auditable events for any users. To log all auditable events for all users, use the following statements, which create a simple filter to enable logging and assign it to the default account:

```
SELECT audit_log_filter_set_filter('log_all', '{ "filter": { "log": true } }');
SELECT audit_log_filter_set_user('%', 'log_all');
```

The filter assigned to `%` is used for connections from any account that has no explicitly assigned filter (which initially is true for all accounts).

:::

As previously mentioned, the SQL interface for audit filtering control is function based. The following list briefly summarizes these functions:

*  `audit_log_filter_set_filter()`: Define a filter.
*  `audit_log_filter_remove_filter()`: Remove a filter.
*  `audit_log_filter_set_user()`: Start filtering a user account.
*  `audit_log_filter_remove_user()`: Stop filtering a user account.
*  `audit_log_filter_flush()`: Flush manual changes to the filter tables to affect ongoing filtering.

For usage examples and complete details about the filtering functions, see Using Audit Log Filtering Functions, and Audit Log Functions.

##### Constraints on Audit Log Filtering Functions

Audit log filtering functions are subject to these constraints:

* To use any filtering function, the `audit_log` plugin must be enabled or an error occurs. In addition, the audit tables must exist or an error occurs. To install the `audit_log` plugin and its accompanying functions and tables, see Section 8.4.5.2, “Installing or Uninstalling MySQL Enterprise Audit”.
* To use any filtering function, a user must possess the `AUDIT_ADMIN` `SUPER` privilege or an error occurs. To grant one of these privileges to a user account, use this statement:

  ```
  GRANT privilege ON *.* TO user;
  ```

  Alternatively, should you prefer to avoid granting the `AUDIT_ADMIN` or `SUPER` privilege while still permitting users to access specific filtering functions, “wrapper” stored programs can be defined. This technique is described in the context of keyring functions in  Using General-Purpose Keyring Functions; it can be adapted for use with filtering functions.
* The `audit_log` plugin operates in legacy mode if it is installed but the accompanying audit tables and functions are not created. The plugin writes these messages to the error log at server startup:

  ```
  [Warning] Plugin audit_log reported: 'Failed to open the audit log filter tables.'
  [Warning] Plugin audit_log reported: 'Audit Log plugin supports a filtering,
  which has not been installed yet. Audit Log plugin will run in the legacy
  mode, which will be disabled in the next release.'
  ```

  In legacy mode, which is deprecated, filtering can be done based only on event account or status. For details, see Section 8.4.5.10, “Legacy Mode Audit Log Filtering”.
* It is theoretically possible for a user with sufficient permissions to mistakenly create an “abort” item in the audit log filter that prevents themselves and other administrators from accessing the system. The `AUDIT_ABORT_EXEMPT` privilege is available to permit a user account’s queries to always be executed even if an “abort” item would block them. Accounts with this privilege can therefore be used to regain access to a system following an audit misconfiguration. The query is still logged in the audit log, but instead of being rejected, it is permitted due to the privilege.

  Accounts created with the `SYSTEM_USER` privilege have the  `AUDIT_ABORT_EXEMPT` privilege assigned automatically when they are created. The  `AUDIT_ABORT_EXEMPT` privilege is also assigned to existing accounts with the `SYSTEM_USER` privilege when you carry out an upgrade procedure, if no existing accounts have that privilege assigned.

##### Using Audit Log Filtering Functions

Before using the audit log functions, install them according to the instructions provided in Section 8.4.5.2, “Installing or Uninstalling MySQL Enterprise Audit”. The `AUDIT_ADMIN` or `SUPER` privilege is required to use any of these functions.

The audit log filtering functions enable filtering control by providing an interface to create, modify, and remove filter definitions and assign filters to user accounts.

Filter definitions are  `JSON` values. For information about using `JSON` data in MySQL, see Section 13.5, “The JSON Data Type”. This section shows some simple filter definitions. For more information about filter definitions, see  Section 8.4.5.8, “Writing Audit Log Filter Definitions”.

When a connection arrives, the audit log plugin determines which filter to use for the new session by searching for the user account name in the current filter assignments:

* If a filter is assigned to the user, the audit log uses that filter.
* Otherwise, if no user-specific filter assignment exists, but there is a filter assigned to the default account (`%`), the audit log uses the default filter.
* Otherwise, the audit log selects no audit events from the session for processing.

If a change-user operation occurs during a session (see mysql\_change\_user()), filter assignment for the session is updated using the same rules but for the new user.

By default, no accounts have a filter assigned, so no processing of auditable events occurs for any account.

Suppose that you want to change the default to be to log only connection-related activity (for example, to see connect, change-user, and disconnect events, but not the SQL statements users execute while connected). To achieve this, define a filter (shown here named `log_conn_events`) that enables logging only of events in the `connection` class, and assign that filter to the default account, represented by the `%` account name:

```
SET @f = '{ "filter": { "class": { "name": "connection" } } }';
SELECT audit_log_filter_set_filter('log_conn_events', @f);
SELECT audit_log_filter_set_user('%', 'log_conn_events');
```

Now the audit log uses this default account filter for connections from any account that has no explicitly defined filter.

To assign a filter explicitly to a particular user account or accounts, define the filter, then assign it to the relevant accounts:

```
SELECT audit_log_filter_set_filter('log_all', '{ "filter": { "log": true } }');
SELECT audit_log_filter_set_user('user1@localhost', 'log_all');
SELECT audit_log_filter_set_user('user2@localhost', 'log_all');
```

Now full logging is enabled for `user1@localhost` and `user2@localhost`. Connections from other accounts continue to be filtered using the default account filter.

To disassociate a user account from its current filter, either unassign the filter or assign a different filter:

* To unassign the filter from the user account:

  ```
  SELECT audit_log_filter_remove_user('user1@localhost');
  ```

  Filtering of current sessions for the account remains unaffected. Subsequent connections from the account are filtered using the default account filter if there is one, and are not logged otherwise.
* To assign a different filter to the user account:

  ```
  SELECT audit_log_filter_set_filter('log_nothing', '{ "filter": { "log": false } }');
  SELECT audit_log_filter_set_user('user1@localhost', 'log_nothing');
  ```

  Filtering of current sessions for the account remains unaffected. Subsequent connections from the account are filtered using the new filter. For the filter shown here, that means no logging for new connections from `user1@localhost`.

For audit log filtering, user name and host name comparisons are case-sensitive. This differs from comparisons for privilege checking, for which host name comparisons are not case-sensitive.

To remove a filter, do this:

```
SELECT audit_log_filter_remove_filter('log_nothing');
```

Removing a filter also unassigns it from any users to whom it is assigned, including any current sessions for those users.

The filtering functions just described affect audit filtering immediately and update the audit log tables in the `mysql` system database that store filters and user accounts (see  Audit Log Tables). It is also possible to modify the audit log tables directly using statements such as  `INSERT`, `UPDATE`, and `DELETE`, but such changes do not affect filtering immediately. To flush your changes and make them operational, call `audit_log_filter_flush()`:

```
SELECT audit_log_filter_flush();
```

Warning

 `audit_log_filter_flush()` should be used only after modifying the audit tables directly, to force reloading all filters. Otherwise, this function should be avoided. It is, in effect, a simplified version of unloading and reloading the `audit_log` plugin with `UNINSTALL PLUGIN` plus `INSTALL PLUGIN`.

 `audit_log_filter_flush()` affects all current sessions and detaches them from their previous filters. Current sessions are no longer logged unless they disconnect and reconnect, or execute a change-user operation.

To determine whether a filter is assigned to the current session, check the session value of the read-only `audit_log_filter_id` system variable. If the value is 0, no filter is assigned. A nonzero value indicates the internally maintained ID of the assigned filter:

```
mysql> SELECT @@audit_log_filter_id;
+-----------------------+
| @@audit_log_filter_id |
+-----------------------+
|                     2 |
+-----------------------+
```
