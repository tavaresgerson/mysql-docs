#### 29.12.20.12 Status Variable Summary Tables

The Performance Schema makes status variable information available in the tables described in Section 29.12.15, “Performance Schema Status Variable Tables”. It also makes aggregated status variable information available in summary tables, described here. Each status variable summary table has one or more grouping columns to indicate how the table aggregates status values:

* `status_by_account` has `USER`, `HOST`, and `VARIABLE_NAME` columns to summarize status variables by account.

* `status_by_host` has `HOST` and `VARIABLE_NAME` columns to summarize status variables by the host from which clients connected.

* `status_by_user` has `USER` and `VARIABLE_NAME` columns to summarize status variables by client user name.

Each status variable summary table has this summary column containing aggregated values:

* `VARIABLE_VALUE`

  The aggregated status variable value for active and terminated sessions.

The status variable summary tables have these indexes:

* `status_by_account`:

  + Primary key on (`USER`, `HOST`, `VARIABLE_NAME`)

* `status_by_host`:

  + Primary key on (`HOST`, `VARIABLE_NAME`)

* `status_by_user`:

  + Primary key on (`USER`, `VARIABLE_NAME`)

The meaning of “account” in these tables is similar to its meaning in the MySQL grant tables in the `mysql` system database, in the sense that the term refers to a combination of user and host values. They differ in that, for grant tables, the host part of an account can be a pattern, whereas for Performance Schema tables, the host value is always a specific nonpattern host name.

Account status is collected when sessions terminate. The session status counters are added to the global status counters and the corresponding account status counters. If account statistics are not collected, the session status is added to host and user status, if host and user status are collected.

Account, host, and user statistics are not collected if the `performance_schema_accounts_size`, `performance_schema_hosts_size`, and `performance_schema_users_size` system variables, respectively, are set to 0.

The Performance Schema supports `TRUNCATE TABLE` for status variable summary tables as follows; in all cases, status for active sessions is unaffected:

* `status_by_account`: Aggregates account status from terminated sessions to user and host status, then resets account status.

* `status_by_host`: Resets aggregated host status from terminated sessions.

* `status_by_user`: Resets aggregated user status from terminated sessions.

`FLUSH STATUS` adds the session status from all active sessions to the global status variables, resets the status of all active sessions, and resets account, host, and user status values aggregated from disconnected sessions.
