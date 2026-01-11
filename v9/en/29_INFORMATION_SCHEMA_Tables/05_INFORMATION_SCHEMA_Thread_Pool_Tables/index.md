## 28.5 INFORMATION\_SCHEMA Thread Pool Tables

28.5.1 INFORMATION\_SCHEMA Thread Pool Table Reference

28.5.2 The INFORMATION\_SCHEMA TP\_THREAD\_GROUP\_STATE Table

28.5.3 The INFORMATION\_SCHEMA TP\_THREAD\_GROUP\_STATS Table

28.5.4 The INFORMATION\_SCHEMA TP\_THREAD\_STATE Table

Note

The `INFORMATION_SCHEMA` thread pool tables are deprecated, and subject to removal in a future version of MySQL. Accessing any of these tables produces a warning; you should use the versions available as Performance Schema tables instead. See Section 29.12.16, “Performance Schema Thread Pool Tables”. Applications should transition away from the old tables to the new tables. For example, if an application uses this query:

```
SELECT * FROM INFORMATION_SCHEMA.TP_THREAD_STATE;
```

The application should use this query instead:

```
SELECT * FROM performance_schema.tp_thread_state;
```

The following sections describe the `INFORMATION_SCHEMA` tables associated with the thread pool plugin (see Section 7.6.3, “MySQL Enterprise Thread Pool”). They provide information about thread pool operation:

* `TP_THREAD_GROUP_STATE`: Information about thread pool thread group states

* `TP_THREAD_GROUP_STATS`: Thread group statistics

* `TP_THREAD_STATE`: Information about thread pool thread states

Rows in these tables represent snapshots in time. In the case of `TP_THREAD_STATE`, all rows for a thread group comprise a snapshot in time. Thus, the MySQL server holds the mutex of the thread group while producing the snapshot. But it does not hold mutexes on all thread groups at the same time, to prevent a statement against `TP_THREAD_STATE` from blocking the entire MySQL server.

The `INFORMATION_SCHEMA` thread pool tables are implemented by individual plugins and the decision whether to load one can be made independently of the others (see Section 7.6.3.2, “Thread Pool Installation”). However, the content of all the tables depends on the thread pool plugin being enabled. If a table plugin is enabled but the thread pool plugin is not, the table becomes visible and can be accessed but is empty.
