#### 5.5.3.1 Thread Pool Elements

MySQL Enterprise Thread Pool comprises these elements:

* A plugin library file implements a plugin for the thread pool code as well as several associated monitoring tables that provide information about thread pool operation.

  For a detailed description of how the thread pool works, see [Section 5.5.3.3, “Thread Pool Operation”](thread-pool-operation.html "5.5.3.3 Thread Pool Operation").

  The `INFORMATION_SCHEMA` tables are named [`TP_THREAD_STATE`](information-schema-tp-thread-state-table.html "24.5.4 The INFORMATION_SCHEMA TP_THREAD_STATE Table"), [`TP_THREAD_GROUP_STATE`](information-schema-tp-thread-group-state-table.html "24.5.2 The INFORMATION_SCHEMA TP_THREAD_GROUP_STATE Table"), and [`TP_THREAD_GROUP_STATS`](information-schema-tp-thread-group-stats-table.html "24.5.3 The INFORMATION_SCHEMA TP_THREAD_GROUP_STATS Table"). These tables provide information about thread pool operation. For more information, see [Section 24.5, “INFORMATION\_SCHEMA Thread Pool Tables”](thread-pool-information-schema-tables.html "24.5 INFORMATION_SCHEMA Thread Pool Tables").

* Several system variables are related to the thread pool. The [`thread_handling`](server-system-variables.html#sysvar_thread_handling) system variable has a value of `loaded-dynamically` when the server successfully loads the thread pool plugin.

  The other related system variables are implemented by the thread pool plugin and are not available unless it is enabled. For information about using these variables, see [Section 5.5.3.3, “Thread Pool Operation”](thread-pool-operation.html "5.5.3.3 Thread Pool Operation"), and [Section 5.5.3.4, “Thread Pool Tuning”](thread-pool-tuning.html "5.5.3.4 Thread Pool Tuning").

* The Performance Schema has instruments that expose information about the thread pool and may be used to investigate operational performance. To identify them, use this query:

  ```sql
  SELECT * FROM performance_schema.setup_instruments
  WHERE NAME LIKE '%thread_pool%';
  ```

  For more information, see [Chapter 25, *MySQL Performance Schema*](performance-schema.html "Chapter 25 MySQL Performance Schema").
