#### 7.6.3.1 Thread Pool Elements

MySQL Enterprise Thread Pool comprises these elements:

* A plugin library file implements a plugin for the thread pool code as well as several associated monitoring tables that provide information about thread pool operation:

  + In MySQL 9.5, the monitoring tables are Performance Schema tables; see Section 29.12.16, “Performance Schema Thread Pool Tables”.

  + In older versions of MySQL, the monitoring tables were `INFORMATION_SCHEMA` tables (see Section 28.5, “INFORMATION\_SCHEMA Thread Pool Tables”). The `INFORMATION_SCHEMA` tables are deprecated; expect them to be removed in a future version of MySQL. Applications should transition away from the `INFORMATION_SCHEMA` tables to the Performance Schema tables. For example, if an application uses this query:

    ```
    SELECT * FROM INFORMATION_SCHEMA.TP_THREAD_STATE;
    ```

    The application should use this query instead:

    ```
    SELECT * FROM performance_schema.tp_thread_state;
    ```

  Note

  If you do not load all the monitoring tables, some or all MySQL Enterprise Monitor thread pool graphs may be empty.

  For a detailed description of how the thread pool works, see Section 7.6.3.3, “Thread Pool Operation”.

* Several system variables are related to the thread pool. The `thread_handling` system variable has a value of `loaded-dynamically` when the server successfully loads the thread pool plugin.

  The other related system variables are implemented by the thread pool plugin and are not available unless it is enabled. For information about using these variables, see Section 7.6.3.3, “Thread Pool Operation”, and Section 7.6.3.4, “Thread Pool Tuning”.

* The Performance Schema has instruments that expose information about the thread pool and may be used to investigate operational performance. To identify them, use this query:

  ```
  SELECT * FROM performance_schema.setup_instruments
  WHERE NAME LIKE '%thread_pool%';
  ```

  For more information, see Chapter 29, *MySQL Performance Schema*.
