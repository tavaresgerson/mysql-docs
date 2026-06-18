#### 26.4.4.7 The ps\_setup\_disable\_thread() Procedure

Given a connection ID, disables Performance Schema
instrumentation for the thread. Produces a result set
indicating how many threads were disabled. Already disabled
threads do not count.

##### Parameters

* `in_connection_id BIGINT`: The
  connection ID. This is a value of the type given in the
  `PROCESSLIST_ID` column of the
  Performance Schema [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table")
  table or the `Id` column of
  [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") output.

##### Example

Disable a specific connection by its connection ID:

```sql
mysql> CALL sys.ps_setup_disable_thread(225);
+-------------------+
| summary           |
+-------------------+
| Disabled 1 thread |
+-------------------+
```

Disable the current connection:

```sql
mysql> CALL sys.ps_setup_disable_thread(CONNECTION_ID());
+-------------------+
| summary           |
+-------------------+
| Disabled 1 thread |
+-------------------+
```