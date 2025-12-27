## 24.5 INFORMATION\_SCHEMA Thread Pool Tables

[24.5.1 INFORMATION\_SCHEMA Thread Pool Table Reference](information-schema-thread-pool-table-reference.html)

[24.5.2 The INFORMATION\_SCHEMA TP\_THREAD\_GROUP\_STATE Table](information-schema-tp-thread-group-state-table.html)

[24.5.3 The INFORMATION\_SCHEMA TP\_THREAD\_GROUP\_STATS Table](information-schema-tp-thread-group-stats-table.html)

[24.5.4 The INFORMATION\_SCHEMA TP\_THREAD\_STATE Table](information-schema-tp-thread-state-table.html)

The following sections describe the `INFORMATION_SCHEMA` tables associated with the thread pool plugin (see [Section 5.5.3, “MySQL Enterprise Thread Pool”](thread-pool.html "5.5.3 MySQL Enterprise Thread Pool")). They provide information about thread pool operation:

* [`TP_THREAD_GROUP_STATE`](information-schema-tp-thread-group-state-table.html "24.5.2 The INFORMATION_SCHEMA TP_THREAD_GROUP_STATE Table"): Information about thread pool thread group states

* [`TP_THREAD_GROUP_STATS`](information-schema-tp-thread-group-stats-table.html "24.5.3 The INFORMATION_SCHEMA TP_THREAD_GROUP_STATS Table"): Thread group statistics

* [`TP_THREAD_STATE`](information-schema-tp-thread-state-table.html "24.5.4 The INFORMATION_SCHEMA TP_THREAD_STATE Table"): Information about thread pool thread states

Rows in these tables represent snapshots in time. In the case of [`TP_THREAD_STATE`](information-schema-tp-thread-state-table.html "24.5.4 The INFORMATION_SCHEMA TP_THREAD_STATE Table"), all rows for a thread group comprise a snapshot in time. Thus, the MySQL server holds the mutex of the thread group while producing the snapshot. But it does not hold mutexes on all thread groups at the same time, to prevent a statement against [`TP_THREAD_STATE`](information-schema-tp-thread-state-table.html "24.5.4 The INFORMATION_SCHEMA TP_THREAD_STATE Table") from blocking the entire MySQL server.

The thread pool `INFORMATION_SCHEMA` tables are implemented by individual plugins and the decision whether to load one can be made independently of the others (see [Section 5.5.3.2, “Thread Pool Installation”](thread-pool-installation.html "5.5.3.2 Thread Pool Installation")). However, the content of all the tables depends on the thread pool plugin being enabled. If a table plugin is enabled but the thread pool plugin is not, the table becomes visible and can be accessed, but is empty.
