#### 13.6.6.5 Restrictions on Server-Side Cursors

Server-side cursors are implemented in the C API using the [`mysql_stmt_attr_set()`](/doc/c-api/5.7/en/mysql-stmt-attr-set.html) function. The same implementation is used for cursors in stored routines. A server-side cursor enables a result set to be generated on the server side, but not transferred to the client except for those rows that the client requests. For example, if a client executes a query but is only interested in the first row, the remaining rows are not transferred.

In MySQL, a server-side cursor is materialized into an internal temporary table. Initially, this is a `MEMORY` table, but is converted to a `MyISAM` table when its size exceeds the minimum value of the [`max_heap_table_size`](server-system-variables.html#sysvar_max_heap_table_size) and [`tmp_table_size`](server-system-variables.html#sysvar_tmp_table_size) system variables. The same restrictions apply to internal temporary tables created to hold the result set for a cursor as for other uses of internal temporary tables. See [Section 8.4.4, “Internal Temporary Table Use in MySQL”](internal-temporary-tables.html "8.4.4 Internal Temporary Table Use in MySQL"). One limitation of the implementation is that for a large result set, retrieving its rows through a cursor might be slow.

Cursors are read only; you cannot use a cursor to update rows.

`UPDATE WHERE CURRENT OF` and `DELETE WHERE CURRENT OF` are not implemented, because updatable cursors are not supported.

Cursors are nonholdable (not held open after a commit).

Cursors are asensitive.

Cursors are nonscrollable.

Cursors are not named. The statement handler acts as the cursor ID.

You can have open only a single cursor per prepared statement. If you need several cursors, you must prepare several statements.

You cannot use a cursor for a statement that generates a result set if the statement is not supported in prepared mode. This includes statements such as [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement"), `HANDLER READ`, and [`SHOW BINLOG EVENTS`](show-binlog-events.html "13.7.5.2 SHOW BINLOG EVENTS Statement").
