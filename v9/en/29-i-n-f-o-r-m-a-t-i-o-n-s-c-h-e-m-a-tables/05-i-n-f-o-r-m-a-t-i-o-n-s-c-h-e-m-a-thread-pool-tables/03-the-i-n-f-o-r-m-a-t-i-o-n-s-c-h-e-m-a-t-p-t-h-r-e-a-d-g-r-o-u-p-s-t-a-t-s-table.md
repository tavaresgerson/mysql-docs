### 28.5.3 The INFORMATION_SCHEMA TP_THREAD_GROUP_STATS Table

Note

The `INFORMATION_SCHEMA` thread pool tables are deprecated, and subject to removal in a future version of MySQL. You should use the versions available as Performance Schema tables instead. See Section 29.12.16, “Performance Schema Thread Pool Tables”. Applications should transition away from the old tables to the new tables. For example, if an application uses this query:

```
SELECT * FROM INFORMATION_SCHEMA.TP_THREAD_GROUP_STATS;
```

The application should use this query instead:

```
SELECT * FROM performance_schema.tp_thread_group_stats;
```

The `TP_THREAD_GROUP_STATS` table reports statistics per thread group. There is one row per group.

For descriptions of the columns in the `INFORMATION_SCHEMA` `TP_THREAD_GROUP_STATS` table, see Section 29.12.16.3, “The tp_thread_group_stats Table”. The Performance Schema `tp_thread_group_stats` table has equivalent columns.
