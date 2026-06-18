#### 29.12.8.1 The accounts Table

The [`accounts`](performance-schema-accounts-table.html "29.12.8.1 The accounts Table") table contains a row
for each account that has connected to the MySQL server. For
each account, the table counts the current and total number of
connections. The table size is autosized at server startup. To
set the table size explicitly, set the
[`performance_schema_accounts_size`](performance-schema-system-variables.html#sysvar_performance_schema_accounts_size)
system variable at server startup. To disable account
statistics, set this variable to 0.

The [`accounts`](performance-schema-accounts-table.html "29.12.8.1 The accounts Table") table has the
following columns. For a description of how the Performance
Schema maintains rows in this table, including the effect of
[`TRUNCATE TABLE`](truncate-table.html "15.1.42 TRUNCATE TABLE Statement"), see
[Section 29.12.8, “Performance Schema Connection Tables”](performance-schema-connection-tables.html "29.12.8 Performance Schema Connection Tables").

* `USER`

  The client user name for the connection. This is
  `NULL` for an internal thread, or for a
  user session that failed to authenticate.

* `HOST`

  The host from which the client connected. This is
  `NULL` for an internal thread, or for a
  user session that failed to authenticate.

* `CURRENT_CONNECTIONS`

  The current number of connections for the account.

* `TOTAL_CONNECTIONS`

  The total number of connections for the account.

* `MAX_SESSION_CONTROLLED_MEMORY`

  Reports the maximum amount of controlled memory used by a
  session belonging to the account.

* `MAX_SESSION_TOTAL_MEMORY`

  Reports the maximum amount of memory used by a session
  belonging to the account.

The [`accounts`](performance-schema-accounts-table.html "29.12.8.1 The accounts Table") table has these
indexes:

* Primary key on (`USER`,
  `HOST`)