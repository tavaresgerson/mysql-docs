### 28.5.4 The INFORMATION_SCHEMA TP_THREAD_STATE Table

Note

The `INFORMATION_SCHEMA` thread pool tables are deprecated, and subject to removal in a future version of MySQL. You should use the versions available as Performance Schema tables instead. See Section 29.12.16, “Performance Schema Thread Pool Tables”. Applications should transition away from the old tables to the new tables. For example, if an application uses this query:

```
SELECT * FROM INFORMATION_SCHEMA.TP_THREAD_STATE;
```

The application should use this query instead:

```
SELECT * FROM performance_schema.tp_thread_state;
```

The `TP_THREAD_STATE` table has one row per thread created by the thread pool to handle connections.

For descriptions of the columns in the `INFORMATION_SCHEMA` `TP_THREAD_STATE` table, see Section 29.12.16.4, “The tp_thread_state Table”. The Performance Schema `tp_thread_state` table has equivalent columns.
