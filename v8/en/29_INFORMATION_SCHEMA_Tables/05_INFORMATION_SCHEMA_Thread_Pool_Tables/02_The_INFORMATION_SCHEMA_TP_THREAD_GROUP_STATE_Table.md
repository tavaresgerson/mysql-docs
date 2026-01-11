### 28.5.2 The INFORMATION_SCHEMA TP_THREAD_GROUP_STATE Table

Note

As of MySQL 8.0.14, the thread pool `INFORMATION_SCHEMA` tables are also available as Performance Schema tables. (See Section 29.12.16, “Performance Schema Thread Pool Tables”.) The `INFORMATION_SCHEMA` tables are deprecated; expect them to be removed in a future version of MySQL. Applications should transition away from the old tables to the new tables. For example, if an application uses this query:

```
SELECT * FROM INFORMATION_SCHEMA.TP_THREAD_GROUP_STATE;
```

The application should use this query instead:

```
SELECT * FROM performance_schema.tp_thread_group_state;
```

The `TP_THREAD_GROUP_STATE` table has one row per thread group in the thread pool. Each row provides information about the current state of a group.

For descriptions of the columns in the `INFORMATION_SCHEMA` `TP_THREAD_GROUP_STATE` table, see Section 29.12.16.1, “The tp_thread_group_state Table”. The Performance Schema `tp_thread_group_state` table has equivalent columns.
