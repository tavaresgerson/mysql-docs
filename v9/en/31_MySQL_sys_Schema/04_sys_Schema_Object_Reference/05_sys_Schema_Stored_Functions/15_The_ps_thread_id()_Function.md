#### 30.4.5.15 The ps\_thread\_id() Function

Note

[`ps_thread_id()`](sys-ps-thread-id.html "30.4.5.15 The ps_thread_id() Function") is deprecated,
and subject to removal in a future MySQL version.
Applications that use it should be migrated to use the
built-in [`PS_THREAD_ID()`](performance-schema-functions.html#function_ps-thread-id) and
[`PS_CURRENT_THREAD_ID()`](performance-schema-functions.html#function_ps-current-thread-id)
functions instead. See
[Section 14.22, “Performance Schema Functions”](performance-schema-functions.html "14.22 Performance Schema Functions")

Returns the Performance Schema thread ID assigned to a given
connection ID, or the thread ID for the current connection if
the connection ID is `NULL`.

##### Parameters

* `in_connection_id BIGINT UNSIGNED`: The
  ID of the connection for which to return the thread ID.
  This is a value of the type given in the
  `PROCESSLIST_ID` column of the
  Performance Schema [`threads`](performance-schema-threads-table.html "29.12.22.10 The threads Table")
  table or the `Id` column of
  [`SHOW PROCESSLIST`](show-processlist.html "15.7.7.32 SHOW PROCESSLIST Statement") output.

##### Return Value

A `BIGINT UNSIGNED` value.

##### Example

```
mysql> SELECT sys.ps_thread_id(260);
+-----------------------+
| sys.ps_thread_id(260) |
+-----------------------+
|                   285 |
+-----------------------+
```