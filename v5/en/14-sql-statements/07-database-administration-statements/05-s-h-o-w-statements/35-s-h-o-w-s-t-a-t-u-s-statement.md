#### 13.7.5.35 SHOW STATUS Statement

```sql
SHOW [GLOBAL | SESSION] STATUS
    [LIKE 'pattern' | WHERE expr]
```

Note

The value of the [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) system variable affects the information available from and privileges required for the statement described here. For details, see the description of that variable in [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables").

[`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") provides server status information (see [Section 5.1.9, “Server Status Variables”](server-status-variables.html "5.1.9 Server Status Variables")). This statement does not require any privilege. It requires only the ability to connect to the server.

Status variable information is also available from these sources:

* Performance Schema tables. See [Section 25.12.14, “Performance Schema Status Variable Tables”](performance-schema-status-variable-tables.html "25.12.14 Performance Schema Status Variable Tables").

* The [`GLOBAL_STATUS`](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables") and [`SESSION_STATUS`](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables") tables. See [Section 24.3.10, “The INFORMATION\_SCHEMA GLOBAL\_STATUS and SESSION\_STATUS Tables”](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables").

* The [**mysqladmin extended-status**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") command. See [Section 4.5.2, “mysqladmin — A MySQL Server Administration Program”](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program").

For [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"), a [`LIKE`](string-comparison-functions.html#operator_like) clause, if present, indicates which variable names to match. A `WHERE` clause can be given to select rows using more general conditions, as discussed in [Section 24.8, “Extensions to SHOW Statements”](extended-show.html "24.8 Extensions to SHOW Statements").

[`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") accepts an optional `GLOBAL` or `SESSION` variable scope modifier:

* With a `GLOBAL` modifier, the statement displays the global status values. A global status variable may represent status for some aspect of the server itself (for example, `Aborted_connects`), or the aggregated status over all connections to MySQL (for example, `Bytes_received` and `Bytes_sent`). If a variable has no global value, the session value is displayed.

* With a `SESSION` modifier, the statement displays the status variable values for the current connection. If a variable has no session value, the global value is displayed. `LOCAL` is a synonym for `SESSION`.

* If no modifier is present, the default is `SESSION`.

The scope for each status variable is listed at [Section 5.1.9, “Server Status Variables”](server-status-variables.html "5.1.9 Server Status Variables").

Each invocation of the [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") statement uses an internal temporary table and increments the global [`Created_tmp_tables`](server-status-variables.html#statvar_Created_tmp_tables) value.

Partial output is shown here. The list of names and values may differ for your server. The meaning of each variable is given in [Section 5.1.9, “Server Status Variables”](server-status-variables.html "5.1.9 Server Status Variables").

```sql
mysql> SHOW STATUS;
+--------------------------+------------+
| Variable_name            | Value      |
+--------------------------+------------+
| Aborted_clients          | 0          |
| Aborted_connects         | 0          |
| Bytes_received           | 155372598  |
| Bytes_sent               | 1176560426 |
| Connections              | 30023      |
| Created_tmp_disk_tables  | 0          |
| Created_tmp_tables       | 8340       |
| Created_tmp_files        | 60         |
...
| Open_tables              | 1          |
| Open_files               | 2          |
| Open_streams             | 0          |
| Opened_tables            | 44600      |
| Questions                | 2026873    |
...
| Table_locks_immediate    | 1920382    |
| Table_locks_waited       | 0          |
| Threads_cached           | 0          |
| Threads_created          | 30022      |
| Threads_connected        | 1          |
| Threads_running          | 1          |
| Uptime                   | 80380      |
+--------------------------+------------+
```

With a [`LIKE`](string-comparison-functions.html#operator_like) clause, the statement displays only rows for those variables with names that match the pattern:

```sql
mysql> SHOW STATUS LIKE 'Key%';
+--------------------+----------+
| Variable_name      | Value    |
+--------------------+----------+
| Key_blocks_used    | 14955    |
| Key_read_requests  | 96854827 |
| Key_reads          | 162040   |
| Key_write_requests | 7589728  |
| Key_writes         | 3813196  |
+--------------------+----------+
```
