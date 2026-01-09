#### 30.4.5.14 The ps_thread_account() Function

Given a Performance Schema thread ID, returns the `user_name@host_name` account associated with the thread.

##### Parameters

* `in_thread_id BIGINT UNSIGNED`: The thread ID for which to return the account. The value should match the `THREAD_ID` column from some Performance Schema `threads` table row.

##### Return Value

A `TEXT` value.

##### Example

```
mysql> SELECT sys.ps_thread_account(sys.ps_thread_id(CONNECTION_ID()));
+----------------------------------------------------------+
| sys.ps_thread_account(sys.ps_thread_id(CONNECTION_ID())) |
+----------------------------------------------------------+
| root@localhost                                           |
+----------------------------------------------------------+
```
