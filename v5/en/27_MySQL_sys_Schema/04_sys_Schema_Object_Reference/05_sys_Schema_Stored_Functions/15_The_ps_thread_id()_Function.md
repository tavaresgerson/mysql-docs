#### 26.4.5.15 The ps\_thread\_id() Function

Returns the Performance Schema thread ID assigned to a given
connection ID, or the thread ID for the current connection if
the connection ID is `NULL`.

##### Parameters

* `in_connection_id BIGINT UNSIGNED`: The
  ID of the connection for which to return the thread ID.
  This is a value of the type given in the
  `PROCESSLIST_ID` column of the
  Performance Schema [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table")
  table or the `Id` column of
  [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") output.

##### Return Value

A `BIGINT UNSIGNED` value.

##### Example

```sql
mysql> SELECT sys.ps_thread_id(260);
+-----------------------+
| sys.ps_thread_id(260) |
+-----------------------+
|                   285 |
+-----------------------+
```