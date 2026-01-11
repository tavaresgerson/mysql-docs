#### 29.12.8.3 The users Table

The `users` table contains a row for each user who has connected to the MySQL server. For each user name, the table counts the current and total number of connections. The table size is autosized at server startup. To set the table size explicitly, set the `performance_schema_users_size` system variable at server startup. To disable user statistics, set this variable to 0.

The `users` table has the following columns. For a description of how the Performance Schema maintains rows in this table, including the effect of `TRUNCATE TABLE`, see Section 29.12.8, “Performance Schema Connection Tables”.

* `USER`

  The client user name for the connection. This is `NULL` for an internal thread, or for a user session that failed to authenticate.

* `CURRENT_CONNECTIONS`

  The current number of connections for the user.

* `TOTAL_CONNECTIONS`

  The total number of connections for the user.

* `MAX_SESSION_CONTROLLED_MEMORY`

  Reports the maximum amount of controlled memory used by a session belonging to the user.

  This column was added in MySQL 8.0.31.

* `MAX_SESSION_TOTAL_MEMORY`

  Reports the maximum amount of memory used by a session belonging to the user.

  This column was added in MySQL 8.0.31.

The `users` table has these indexes:

* Primary key on (`USER`)
