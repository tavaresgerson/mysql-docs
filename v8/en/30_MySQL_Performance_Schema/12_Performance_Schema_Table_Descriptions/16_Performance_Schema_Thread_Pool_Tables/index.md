### 29.12.16 Performance Schema Thread Pool Tables

29.12.16.1 The tp_thread_group_state Table

29.12.16.2 The tp_thread_group_stats Table

29.12.16.3 The tp_thread_state Table

Note

The Performance Schema tables described here are available as of MySQL 8.0.14. Prior to MySQL 8.0.14, use the corresponding `INFORMATION_SCHEMA` tables instead; see Section 28.5, “INFORMATION_SCHEMA Thread Pool Tables”.

The following sections describe the Performance Schema tables associated with the thread pool plugin (see Section 7.6.3, “MySQL Enterprise Thread Pool”). They provide information about thread pool operation:

* `tp_thread_group_state`: Information about thread pool thread group states.

* `tp_thread_group_stats`: Thread group statistics.

* `tp_thread_state`: Information about thread pool thread states.

Rows in these tables represent snapshots in time. In the case of `tp_thread_state`, all rows for a thread group comprise a snapshot in time. Thus, the MySQL server holds the mutex of the thread group while producing the snapshot. But it does not hold mutexes on all thread groups at the same time, to prevent a statement against `tp_thread_state` from blocking the entire MySQL server.

The Performance Schema thread pool tables are implemented by the thread pool plugin and are loaded and unloaded when that plugin is loaded and unloaded (see Section 7.6.3.2, “Thread Pool Installation”). No special configuration step for the tables is needed. However, the tables depend on the thread pool plugin being enabled. If the thread pool plugin is loaded but disabled, the tables are not created.
