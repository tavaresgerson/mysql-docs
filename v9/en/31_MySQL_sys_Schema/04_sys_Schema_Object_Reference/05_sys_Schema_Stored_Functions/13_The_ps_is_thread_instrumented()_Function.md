#### 30.4.5.13 The ps\_is\_thread\_instrumented() Function

Returns `YES` or `NO` to
indicate whether Performance Schema instrumentation for a
given connection ID is enabled, `UNKNOWN` if
the ID is unknown, or `NULL` if the ID is
`NULL`.

##### Parameters

* `in_connection_id BIGINT UNSIGNED`: The
  connection ID. This is a value of the type given in the
  `PROCESSLIST_ID` column of the
  Performance Schema [`threads`](performance-schema-threads-table.html "29.12.22.10 The threads Table")
  table or the `Id` column of
  [`SHOW PROCESSLIST`](show-processlist.html "15.7.7.32 SHOW PROCESSLIST Statement") output.

##### Return Value

An `ENUM('YES','NO','UNKNOWN')` value.

##### Example

```
mysql> SELECT sys.ps_is_thread_instrumented(43);
+-----------------------------------+
| sys.ps_is_thread_instrumented(43) |
+-----------------------------------+
| UNKNOWN                           |
+-----------------------------------+
mysql> SELECT sys.ps_is_thread_instrumented(CONNECTION_ID());
+------------------------------------------------+
| sys.ps_is_thread_instrumented(CONNECTION_ID()) |
+------------------------------------------------+
| YES                                            |
+------------------------------------------------+
```