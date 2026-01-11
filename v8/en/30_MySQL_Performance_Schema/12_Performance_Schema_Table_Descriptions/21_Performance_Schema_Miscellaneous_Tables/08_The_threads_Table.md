#### 29.12.21.8 The threads Table

The `threads` table contains a row for each server thread. Each row contains information about a thread and indicates whether monitoring and historical event logging are enabled for it:

```
mysql> SELECT * FROM performance_schema.threads\G
*************************** 1. row ***************************
            THREAD_ID: 1
                 NAME: thread/sql/main
                 TYPE: BACKGROUND
       PROCESSLIST_ID: NULL
     PROCESSLIST_USER: NULL
     PROCESSLIST_HOST: NULL
       PROCESSLIST_DB: mysql
  PROCESSLIST_COMMAND: NULL
     PROCESSLIST_TIME: 418094
    PROCESSLIST_STATE: NULL
     PROCESSLIST_INFO: NULL
     PARENT_THREAD_ID: NULL
                 ROLE: NULL
         INSTRUMENTED: YES
              HISTORY: YES
      CONNECTION_TYPE: NULL
         THREAD_OS_ID: 5856
       RESOURCE_GROUP: SYS_default
     EXECUTION_ENGINE: PRIMARY
    CONTROLLED_MEMORY: 1456
MAX_CONTROLLED_MEMORY: 67480
         TOTAL_MEMORY: 1270430
     MAX_TOTAL_MEMORY: 1307317
     TELEMETRY_ACTIVE: NO
...
```

When the Performance Schema initializes, it populates the `threads` table based on the threads in existence then. Thereafter, a new row is added each time the server creates a thread.

The `INSTRUMENTED` and `HISTORY` column values for new threads are determined by the contents of the `setup_actors` table. For information about how to use the `setup_actors` table to control these columns, see Section 29.4.6, “Pre-Filtering by Thread”.

Removal of rows from the `threads` table occurs when threads end. For a thread associated with a client session, removal occurs when the session ends. If a client has auto-reconnect enabled and the session reconnects after a disconnect, the session becomes associated with a new row in the `threads` table that has a different `PROCESSLIST_ID` value. The initial `INSTRUMENTED` and `HISTORY` values for the new thread may be different from those of the original thread: The `setup_actors` table may have changed in the meantime, and if the `INSTRUMENTED` or `HISTORY` value for the original thread was changed after the row was initialized, the change does not carry over to the new thread.

You can enable or disable thread monitoring (that is, whether events executed by the thread are instrumented) and historical event logging. To control the initial `INSTRUMENTED` and `HISTORY` values for new foreground threads, use the `setup_actors` table. To control these aspects of existing threads, set the `INSTRUMENTED` and `HISTORY` columns of `threads` table rows. (For more information about the conditions under which thread monitoring and historical event logging occur, see the descriptions of the `INSTRUMENTED` and `HISTORY` columns.)

For a comparison of the `threads` table columns with names having a prefix of `PROCESSLIST_` to other process information sources, see Sources of Process Information.

Important

For thread information sources other than the `threads` table, information about threads for other users is shown only if the current user has the `PROCESS` privilege. That is not true of the `threads` table; all rows are shown to any user who has the `SELECT` privilege for the table. Users who should not be able to see threads for other users by accessing the `threads` table should not be given the `SELECT` privilege for it.

The `threads` table has these columns:

* `THREAD_ID`

  A unique thread identifier.

* `NAME`

  The name associated with the thread instrumentation code in the server. For example, `thread/sql/one_connection` corresponds to the thread function in the code responsible for handling a user connection, and `thread/sql/main` stands for the `main()` function of the server.

* `TYPE`

  The thread type, either `FOREGROUND` or `BACKGROUND`. User connection threads are foreground threads. Threads associated with internal server activity are background threads. Examples are internal `InnoDB` threads, “binlog dump” threads sending information to replicas, and replication I/O and SQL threads.

* `PROCESSLIST_ID`

  For a foreground thread (associated with a user connection), this is the connection identifier. This is the same value displayed in the `ID` column of the `INFORMATION_SCHEMA` `PROCESSLIST` table, displayed in the `Id` column of `SHOW PROCESSLIST` output, and returned by the `CONNECTION_ID()` function within the thread.

  For a background thread (not associated with a user connection), `PROCESSLIST_ID` is `NULL`, so the values are not unique.

* `PROCESSLIST_USER`

  The user associated with a foreground thread, `NULL` for a background thread.

* `PROCESSLIST_HOST`

  The host name of the client associated with a foreground thread, `NULL` for a background thread.

  Unlike the `HOST` column of the `INFORMATION_SCHEMA` `PROCESSLIST` table or the `Host` column of `SHOW PROCESSLIST` output, the `PROCESSLIST_HOST` column does not include the port number for TCP/IP connections. To obtain this information from the Performance Schema, enable the socket instrumentation (which is not enabled by default) and examine the `socket_instances` table:

  ```
  mysql> SELECT NAME, ENABLED, TIMED
         FROM performance_schema.setup_instruments
         WHERE NAME LIKE 'wait/io/socket%';
  +----------------------------------------+---------+-------+
  | NAME                                   | ENABLED | TIMED |
  +----------------------------------------+---------+-------+
  | wait/io/socket/sql/server_tcpip_socket | NO      | NO    |
  | wait/io/socket/sql/server_unix_socket  | NO      | NO    |
  | wait/io/socket/sql/client_connection   | NO      | NO    |
  +----------------------------------------+---------+-------+
  3 rows in set (0.01 sec)

  mysql> UPDATE performance_schema.setup_instruments
         SET ENABLED='YES'
         WHERE NAME LIKE 'wait/io/socket%';
  Query OK, 3 rows affected (0.00 sec)
  Rows matched: 3  Changed: 3  Warnings: 0

  mysql> SELECT * FROM performance_schema.socket_instances\G
  *************************** 1. row ***************************
             EVENT_NAME: wait/io/socket/sql/client_connection
  OBJECT_INSTANCE_BEGIN: 140612577298432
              THREAD_ID: 31
              SOCKET_ID: 53
                     IP: ::ffff:127.0.0.1
                   PORT: 55642
                  STATE: ACTIVE
  ...
  ```

* `PROCESSLIST_DB`

  The default database for the thread, or `NULL` if none has been selected.

* `PROCESSLIST_COMMAND`

  For foreground threads, the type of command the thread is executing on behalf of the client, or `Sleep` if the session is idle. For descriptions of thread commands, see Section 10.14, “Examining Server Thread (Process) Information” Information"). The value of this column corresponds to the `COM_xxx` commands of the client/server protocol and `Com_xxx` status variables. See Section 7.1.10, “Server Status Variables”

  Background threads do not execute commands on behalf of clients, so this column may be `NULL`.

* `PROCESSLIST_TIME`

  The time in seconds that the thread has been in its current state. For a replica SQL thread, the value is the number of seconds between the timestamp of the last replicated event and the real time of the replica host. See Section 19.2.3, “Replication Threads”.

* `PROCESSLIST_STATE`

  An action, event, or state that indicates what the thread is doing. For descriptions of `PROCESSLIST_STATE` values, see Section 10.14, “Examining Server Thread (Process) Information” Information"). If the value if `NULL`, the thread may correspond to an idle client session or the work it is doing is not instrumented with stages.

  Most states correspond to very quick operations. If a thread stays in a given state for many seconds, there might be a problem that bears investigation.

* `PROCESSLIST_INFO`

  The statement the thread is executing, or `NULL` if it is executing no statement. The statement might be the one sent to the server, or an innermost statement if the statement executes other statements. For example, if a `CALL` statement executes a stored procedure that is executing a `SELECT` statement, the `PROCESSLIST_INFO` value shows the `SELECT` statement.

* `PARENT_THREAD_ID`

  If this thread is a subthread (spawned by another thread), this is the `THREAD_ID` value of the spawning thread.

* `ROLE`

  Unused.

* `INSTRUMENTED`

  Whether events executed by the thread are instrumented. The value is `YES` or `NO`.

  + For foreground threads, the initial `INSTRUMENTED` value is determined by whether the user account associated with the thread matches any row in the `setup_actors` table. Matching is based on the values of the `PROCESSLIST_USER` and `PROCESSLIST_HOST` columns.

    If the thread spawns a subthread, matching occurs again for the `threads` table row created for the subthread.

  + For background threads, `INSTRUMENTED` is `YES` by default. `setup_actors` is not consulted because there is no associated user for background threads.

  + For any thread, its `INSTRUMENTED` value can be changed during the lifetime of the thread.

  For monitoring of events executed by the thread to occur, these things must be true:

  + The `thread_instrumentation` consumer in the `setup_consumers` table must be `YES`.

  + The `threads.INSTRUMENTED` column must be `YES`.

  + Monitoring occurs only for those thread events produced from instruments that have the `ENABLED` column set to `YES` in the `setup_instruments` table.

* `HISTORY`

  Whether to log historical events for the thread. The value is `YES` or `NO`.

  + For foreground threads, the initial `HISTORY` value is determined by whether the user account associated with the thread matches any row in the `setup_actors` table. Matching is based on the values of the `PROCESSLIST_USER` and `PROCESSLIST_HOST` columns.

    If the thread spawns a subthread, matching occurs again for the `threads` table row created for the subthread.

  + For background threads, `HISTORY` is `YES` by default. `setup_actors` is not consulted because there is no associated user for background threads.

  + For any thread, its `HISTORY` value can be changed during the lifetime of the thread.

  For historical event logging for the thread to occur, these things must be true:

  + The appropriate history-related consumers in the `setup_consumers` table must be enabled. For example, wait event logging in the `events_waits_history` and `events_waits_history_long` tables requires the corresponding `events_waits_history` and `events_waits_history_long` consumers to be `YES`.

  + The `threads.HISTORY` column must be `YES`.

  + Logging occurs only for those thread events produced from instruments that have the `ENABLED` column set to `YES` in the `setup_instruments` table.

* `CONNECTION_TYPE`

  The protocol used to establish the connection, or `NULL` for background threads. Permitted values are `TCP/IP` (TCP/IP connection established without encryption), `SSL/TLS` (TCP/IP connection established with encryption), `Socket` (Unix socket file connection), `Named Pipe` (Windows named pipe connection), and `Shared Memory` (Windows shared memory connection).

* `THREAD_OS_ID`

  The thread or task identifier as defined by the underlying operating system, if there is one:

  + When a MySQL thread is associated with the same operating system thread for its lifetime, `THREAD_OS_ID` contains the operating system thread ID.

  + When a MySQL thread is not associated with the same operating system thread for its lifetime, `THREAD_OS_ID` contains `NULL`. This is typical for user sessions when the thread pool plugin is used (see Section 7.6.3, “MySQL Enterprise Thread Pool”).

  For Windows, `THREAD_OS_ID` corresponds to the thread ID visible in Process Explorer (<https://technet.microsoft.com/en-us/sysinternals/bb896653.aspx>).

  For Linux, `THREAD_OS_ID` corresponds to the value of the `gettid()` function. This value is exposed, for example, using the **perf** or **ps -L** commands, or in the `proc` file system (`/proc/[pid]/task/[tid]`). For more information, see the `perf-stat(1)`, `ps(1)`, and `proc(5)` man pages.

* `RESOURCE_GROUP`

  The resource group label. This value is `NULL` if resource groups are not supported on the current platform or server configuration (see Resource Group Restrictions).

* `EXECUTION_ENGINE`

  The query execution engine. The value is either `PRIMARY` or `SECONDARY`. For use with MySQL HeatWave Service and MySQL HeatWave, where the `PRIMARY` engine is `InnoDB` and the `SECONDARY` engine is MySQL HeatWave (`RAPID`). For MySQL Community Edition Server, MySQL Enterprise Edition Server (on-premise), and MySQL HeatWave Service without MySQL HeatWave, the value is always `PRIMARY`. This column was added in MySQL 8.0.29.

* `CONTROLLED_MEMORY`

  Amount of controlled memory used by the thread.

  This column was added in MySQL 8.0.31.

* `MAX_CONTROLLED_MEMORY`

  Maximum value of `CONTROLLED_MEMORY` seen during the thread execution.

  This column was added in MySQL 8.0.31.

* `TOTAL_MEMORY`

  The current amount of memory, controlled or not, used by the thread.

  This column was added in MySQL 8.0.31.

* `MAX_TOTAL_MEMORY`

  The maximum value of `TOTAL_MEMORY` seen during the thread execution.

  This column was added in MySQL 8.0.31.

* `TELEMETRY_ACTIVE`

  Whether the thread has an active telemetry seesion attached. The value is `YES` or `NO`.

  This column was added in MySQL 8.0.33.

The `threads` table has these indexes:

* Primary key on (`THREAD_ID`)
* Index on (`NAME`)
* Index on (`PROCESSLIST_ID`)
* Index on (`PROCESSLIST_USER`, `PROCESSLIST_HOST`)

* Index on (`PROCESSLIST_HOST`)
* Index on (`THREAD_OS_ID`)
* Index on (`RESOURCE_GROUP`)

`TRUNCATE TABLE` is not permitted for the `threads` table.
