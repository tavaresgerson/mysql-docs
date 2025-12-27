#### 6.4.5.10 Legacy Mode Audit Log Filtering

Note

This section describes legacy audit log filtering, which applies under either of these circumstances:

* Before MySQL 5.7.13, that is, prior to the introduction of rule-based audit log filtering described in [Section 6.4.5.7, “Audit Log Filtering”](audit-log-filtering.html "6.4.5.7 Audit Log Filtering").

* As of MySQL 5.7.13, if the `audit_log` plugin is installed without the accompanying audit tables and functions needed for rule-based filtering.

The audit log plugin can filter audited events. This enables you to control whether audited events are written to the audit log file based on the account from which events originate or event status. Status filtering occurs separately for connection events and statement events.

* [Legacy Event Filtering by Account](audit-log-legacy-filtering.html#audit-log-account-filtering "Legacy Event Filtering by Account")
* [Legacy Event Filtering by Status](audit-log-legacy-filtering.html#audit-log-status-filtering "Legacy Event Filtering by Status")

##### Legacy Event Filtering by Account

To filter audited events based on the originating account, set one (not both) of the following system variables at server startup or runtime. These variables apply only for legacy audit log filtering.

* [`audit_log_include_accounts`](audit-log-reference.html#sysvar_audit_log_include_accounts): The accounts to include in audit logging. If this variable is set, only these accounts are audited.

* [`audit_log_exclude_accounts`](audit-log-reference.html#sysvar_audit_log_exclude_accounts): The accounts to exclude from audit logging. If this variable is set, all but these accounts are audited.

The value for either variable can be `NULL` or a string containing one or more comma-separated account names, each in `user_name@host_name` format. By default, both variables are `NULL`, in which case, no account filtering is done and auditing occurs for all accounts.

Modifications to [`audit_log_include_accounts`](audit-log-reference.html#sysvar_audit_log_include_accounts) or [`audit_log_exclude_accounts`](audit-log-reference.html#sysvar_audit_log_exclude_accounts) affect only connections created subsequent to the modification, not existing connections.

Example: To enable audit logging only for the `user1` and `user2` local host accounts, set the [`audit_log_include_accounts`](audit-log-reference.html#sysvar_audit_log_include_accounts) system variable like this:

```sql
SET GLOBAL audit_log_include_accounts = 'user1@localhost,user2@localhost';
```

Only one of [`audit_log_include_accounts`](audit-log-reference.html#sysvar_audit_log_include_accounts) or [`audit_log_exclude_accounts`](audit-log-reference.html#sysvar_audit_log_exclude_accounts) can be non-`NULL` at a time:

* If you set [`audit_log_include_accounts`](audit-log-reference.html#sysvar_audit_log_include_accounts), the server sets [`audit_log_exclude_accounts`](audit-log-reference.html#sysvar_audit_log_exclude_accounts) to `NULL`.

* If you attempt to set [`audit_log_exclude_accounts`](audit-log-reference.html#sysvar_audit_log_exclude_accounts), an error occurs unless [`audit_log_include_accounts`](audit-log-reference.html#sysvar_audit_log_include_accounts) is `NULL`. In this case, you must first clear [`audit_log_include_accounts`](audit-log-reference.html#sysvar_audit_log_include_accounts) by setting it to `NULL`.

```sql
-- This sets audit_log_exclude_accounts to NULL
SET GLOBAL audit_log_include_accounts = value;

-- This fails because audit_log_include_accounts is not NULL
SET GLOBAL audit_log_exclude_accounts = value;

-- To set audit_log_exclude_accounts, first set
-- audit_log_include_accounts to NULL
SET GLOBAL audit_log_include_accounts = NULL;
SET GLOBAL audit_log_exclude_accounts = value;
```

If you inspect the value of either variable, be aware that [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") displays `NULL` as an empty string. To display `NULL` as `NULL`, use [`SELECT`](select.html "13.2.9 SELECT Statement") instead:

```sql
mysql> SHOW VARIABLES LIKE 'audit_log_include_accounts';
+----------------------------+-------+
| Variable_name              | Value |
+----------------------------+-------+
| audit_log_include_accounts |       |
+----------------------------+-------+
mysql> SELECT @@audit_log_include_accounts;
+------------------------------+
| @@audit_log_include_accounts |
+------------------------------+
| NULL                         |
+------------------------------+
```

If a user name or host name requires quoting because it contains a comma, space, or other special character, quote it using single quotes. If the variable value itself is quoted with single quotes, double each inner single quote or escape it with a backslash. The following statements each enable audit logging for the local `root` account and are equivalent, even though the quoting styles differ:

```sql
SET GLOBAL audit_log_include_accounts = 'root@localhost';
SET GLOBAL audit_log_include_accounts = '''root''@''localhost''';
SET GLOBAL audit_log_include_accounts = '\'root\'@\'localhost\'';
SET GLOBAL audit_log_include_accounts = "'root'@'localhost'";
```

The last statement does not work if the `ANSI_QUOTES` SQL mode is enabled because in that mode double quotes signify identifier quoting, not string quoting.

##### Legacy Event Filtering by Status

To filter audited events based on status, set the following system variables at server startup or runtime. These variables apply only for legacy audit log filtering. For JSON audit log filtering, different status variables apply; see [Audit Log Options and Variables](audit-log-reference.html#audit-log-options-variables "Audit Log Options and Variables").

* [`audit_log_connection_policy`](audit-log-reference.html#sysvar_audit_log_connection_policy): Logging policy for connection events

* [`audit_log_statement_policy`](audit-log-reference.html#sysvar_audit_log_statement_policy): Logging policy for statement events

Each variable takes a value of `ALL` (log all associated events; this is the default), `ERRORS` (log only failed events), or `NONE` (do not log events). For example, to log all statement events but only failed connection events, use these settings:

```sql
SET GLOBAL audit_log_statement_policy = ALL;
SET GLOBAL audit_log_connection_policy = ERRORS;
```

Another policy system variable, [`audit_log_policy`](audit-log-reference.html#sysvar_audit_log_policy), is available but does not afford as much control as [`audit_log_connection_policy`](audit-log-reference.html#sysvar_audit_log_connection_policy) and [`audit_log_statement_policy`](audit-log-reference.html#sysvar_audit_log_statement_policy). It can be set only at server startup. At runtime, it is a read-only variable. It takes a value of `ALL` (log all events; this is the default), `LOGINS` (log connection events), `QUERIES` (log statement events), or `NONE` (do not log events). For any of those values, the audit log plugin logs all selected events without distinction as to success or failure. Use of [`audit_log_policy`](audit-log-reference.html#sysvar_audit_log_policy) at startup works as follows:

* If you do not set [`audit_log_policy`](audit-log-reference.html#sysvar_audit_log_policy) or set it to its default of `ALL`, any explicit settings for [`audit_log_connection_policy`](audit-log-reference.html#sysvar_audit_log_connection_policy) or [`audit_log_statement_policy`](audit-log-reference.html#sysvar_audit_log_statement_policy) apply as specified. If not specified, they default to `ALL`.

* If you set [`audit_log_policy`](audit-log-reference.html#sysvar_audit_log_policy) to a non-`ALL` value, that value takes precedence over and is used to set [`audit_log_connection_policy`](audit-log-reference.html#sysvar_audit_log_connection_policy) and [`audit_log_statement_policy`](audit-log-reference.html#sysvar_audit_log_statement_policy), as indicated in the following table. If you also set either of those variables to a value other than their default of `ALL`, the server writes a message to the error log to indicate that their values are being overridden.

  <table summary="How the server uses audit_log_policy to set audit_log_connection_policy and audit_log_statement_policy at startup."><col style="width: 33%"/><col style="width: 33%"/><col style="width: 33%"/><thead><tr> <th scope="col">Startup audit_log_policy Value</th> <th scope="col">Resulting audit_log_connection_policy Value</th> <th scope="col">Resulting audit_log_statement_policy Value</th> </tr></thead><tbody><tr> <th scope="row"><code class="literal">LOGINS</code></th> <td><code class="literal">ALL</code></td> <td><code class="literal">NONE</code></td> </tr><tr> <th scope="row"><code class="literal">QUERIES</code></th> <td><code class="literal">NONE</code></td> <td><code class="literal">ALL</code></td> </tr><tr> <th scope="row"><code class="literal">NONE</code></th> <td><code class="literal">NONE</code></td> <td><code class="literal">NONE</code></td> </tr></tbody></table>
