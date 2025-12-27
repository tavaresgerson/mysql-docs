#### 25.12.8.2 The hosts Table

The [`hosts`](performance-schema-hosts-table.html "25.12.8.2 The hosts Table") table contains a row for each host from which clients have connected to the MySQL server. For each host name, the table counts the current and total number of connections. The table size is autosized at server startup. To set the table size explicitly, set the [`performance_schema_hosts_size`](performance-schema-system-variables.html#sysvar_performance_schema_hosts_size) system variable at server startup. To disable host statistics, set this variable to 0.

The [`hosts`](performance-schema-hosts-table.html "25.12.8.2 The hosts Table") table has the following columns. For a description of how the Performance Schema maintains rows in this table, including the effect of [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement"), see [Section 25.12.8, “Performance Schema Connection Tables”](performance-schema-connection-tables.html "25.12.8 Performance Schema Connection Tables").

* `HOST`

  The host from which the client connected. This is `NULL` for an internal thread, or for a user session that failed to authenticate.

* `CURRENT_CONNECTIONS`

  The current number of connections for the host.

* `TOTAL_CONNECTIONS`

  The total number of connections for the host.
