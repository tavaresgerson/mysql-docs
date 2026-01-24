#### 25.12.16.4 The threads Table

The [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") table contains a row for each server thread. Each row contains information about a thread and indicates whether monitoring and historical event logging are enabled for it:

```sql
mysql> SELECT * FROM performance_schema.threads\G
*************************** 1. row ***************************
          THREAD_ID: 1
               NAME: thread/sql/main
               TYPE: BACKGROUND
     PROCESSLIST_ID: NULL
   PROCESSLIST_USER: NULL
   PROCESSLIST_HOST: NULL
     PROCESSLIST_DB: NULL
PROCESSLIST_COMMAND: NULL
   PROCESSLIST_TIME: 80284
  PROCESSLIST_STATE: NULL
   PROCESSLIST_INFO: NULL
   PARENT_THREAD_ID: NULL
               ROLE: NULL
       INSTRUMENTED: YES
            HISTORY: YES
    CONNECTION_TYPE: NULL
       THREAD_OS_ID: 489803
...
*************************** 4. row ***************************
          THREAD_ID: 51
               NAME: thread/sql/one_connection
               TYPE: FOREGROUND
     PROCESSLIST_ID: 34
   PROCESSLIST_USER: isabella
   PROCESSLIST_HOST: localhost
     PROCESSLIST_DB: performance_schema
PROCESSLIST_COMMAND: Query
   PROCESSLIST_TIME: 0
  PROCESSLIST_STATE: Sending data
   PROCESSLIST_INFO: SELECT * FROM performance_schema.threads
   PARENT_THREAD_ID: 1
               ROLE: NULL
       INSTRUMENTED: YES
            HISTORY: YES
    CONNECTION_TYPE: SSL/TLS
       THREAD_OS_ID: 755399
...
```

When the Performance Schema initializes, it populates the [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") table based on the threads in existence then. Thereafter, a new row is added each time the server creates a thread.

The `INSTRUMENTED` and `HISTORY` column values for new threads are determined by the contents of the [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") table. For information about how to use the [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") table to control these columns, see [Section 25.4.6, “Pre-Filtering by Thread”](performance-schema-thread-filtering.html "25.4.6 Pre-Filtering by Thread").

Removal of rows from the [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") table occurs when threads end. For a thread associated with a client session, removal occurs when the session ends. If a client has auto-reconnect enabled and the session reconnects after a disconnect, the session becomes associated with a new row in the [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") table that has a different `PROCESSLIST_ID` value. The initial `INSTRUMENTED` and `HISTORY` values for the new thread may be different from those of the original thread: The [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") table may have changed in the meantime, and if the `INSTRUMENTED` or `HISTORY` value for the original thread was changed after the row was initialized, the change does not carry over to the new thread.

You can enable or disable thread monitoring (that is, whether events executed by the thread are instrumented) and historical event logging. To control the initial `INSTRUMENTED` and `HISTORY` values for new foreground threads, use the [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") table. To control these aspects of existing threads, set the `INSTRUMENTED` and `HISTORY` columns of [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") table rows. (For more information about the conditions under which thread monitoring and historical event logging occur, see the descriptions of the `INSTRUMENTED` and `HISTORY` columns.)

For a comparison of the [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") table columns with names having a prefix of `PROCESSLIST_` to other process information sources, see [Sources of Process Information](processlist-access.html#processlist-sources "Sources of Process Information").

Important

For thread information sources other than the [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") table, information about threads for other users is shown only if the current user has the [`PROCESS`](privileges-provided.html#priv_process) privilege. That is not true of the [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") table; all rows are shown to any user who has the [`SELECT`](privileges-provided.html#priv_select) privilege for the table. Users who should not be able to see threads for other users by accessing the [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") table should not be given the [`SELECT`](privileges-provided.html#priv_select) privilege for it.

The [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") table has these columns:

* `THREAD_ID`

  A unique thread identifier.

* `NAME`

  The name associated with the thread instrumentation code in the server. For example, `thread/sql/one_connection` corresponds to the thread function in the code responsible for handling a user connection, and `thread/sql/main` stands for the `main()` function of the server.

* `TYPE`

  The thread type, either `FOREGROUND` or `BACKGROUND`. User connection threads are foreground threads. Threads associated with internal server activity are background threads. Examples are internal `InnoDB` threads, “binlog dump” threads sending information to replicas, and replication I/O and SQL threads.

* `PROCESSLIST_ID`

  For a foreground thread (associated with a user connection), this is the connection identifier. This is the same value displayed in the `ID` column of the `INFORMATION_SCHEMA` [`PROCESSLIST`](information-schema-processlist-table.html "24.3.18 The INFORMATION_SCHEMA PROCESSLIST Table") table, displayed in the `Id` column of [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") output, and returned by the [`CONNECTION_ID()`](information-functions.html#function_connection-id) function within the thread.

  For a background thread (not associated with a user connection), `PROCESSLIST_ID` is `NULL`, so the values are not unique.

* `PROCESSLIST_USER`

  The user associated with a foreground thread, `NULL` for a background thread.

* `PROCESSLIST_HOST`

  The host name of the client associated with a foreground thread, `NULL` for a background thread.

  Unlike the `HOST` column of the `INFORMATION_SCHEMA` [`PROCESSLIST`](information-schema-processlist-table.html "24.3.18 The INFORMATION_SCHEMA PROCESSLIST Table") table or the `Host` column of [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") output, the `PROCESSLIST_HOST` column does not include the port number for TCP/IP connections. To obtain this information from the Performance Schema, enable the socket instrumentation (which is not enabled by default) and examine the [`socket_instances`](performance-schema-socket-instances-table.html "25.12.3.5 The socket_instances Table") table:

  ```sql
  mysql> SELECT * FROM performance_schema.setup_instruments
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

  For foreground threads, the type of command the thread is executing on behalf of the client, or `Sleep` if the session is idle. For descriptions of thread commands, see [Section 8.14, “Examining Server Thread (Process) Information”](thread-information.html "8.14 Examining Server Thread (Process) Information"). The value of this column corresponds to the `COM_xxx` commands of the client/server protocol and `Com_xxx` status variables. See [Section 5.1.9, “Server Status Variables”](server-status-variables.html "5.1.9 Server Status Variables")

  Background threads do not execute commands on behalf of clients, so this column may be `NULL`.

* `PROCESSLIST_TIME`

  The time in seconds that the thread has been in its current state. For a replica SQL thread, the value is the number of seconds between the timestamp of the last replicated event and the real time of the replica host. See [Section 16.2.3, “Replication Threads”](replication-threads.html "16.2.3 Replication Threads").

* `PROCESSLIST_STATE`

  An action, event, or state that indicates what the thread is doing. For descriptions of `PROCESSLIST_STATE` values, see [Section 8.14, “Examining Server Thread (Process) Information”](thread-information.html "8.14 Examining Server Thread (Process) Information"). If the value if `NULL`, the thread may correspond to an idle client session or the work it is doing is not instrumented with stages.

  Most states correspond to very quick operations. If a thread stays in a given state for many seconds, there might be a problem that bears investigation.

* `PROCESSLIST_INFO`

  The statement the thread is executing, or `NULL` if it is executing no statement. The statement might be the one sent to the server, or an innermost statement if the statement executes other statements. For example, if a `CALL` statement executes a stored procedure that is executing a [`SELECT`](select.html "13.2.9 SELECT Statement") statement, the `PROCESSLIST_INFO` value shows the [`SELECT`](select.html "13.2.9 SELECT Statement") statement.

* `PARENT_THREAD_ID`

  If this thread is a subthread (spawned by another thread), this is the `THREAD_ID` value of the spawning thread.

* `ROLE`

  Unused.

* `INSTRUMENTED`

  Whether events executed by the thread are instrumented. The value is `YES` or `NO`.

  + For foreground threads, the initial `INSTRUMENTED` value is determined by whether the user account associated with the thread matches any row in the [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") table. Matching is based on the values of the `PROCESSLIST_USER` and `PROCESSLIST_HOST` columns.

    If the thread spawns a subthread, matching occurs again for the [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") table row created for the subthread.

  + For background threads, `INSTRUMENTED` is `YES` by default. [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") is not consulted because there is no associated user for background threads.

  + For any thread, its `INSTRUMENTED` value can be changed during the lifetime of the thread.

  For monitoring of events executed by the thread to occur, these things must be true:

  + The `thread_instrumentation` consumer in the [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table") table must be `YES`.

  + The `threads.INSTRUMENTED` column must be `YES`.

  + Monitoring occurs only for those thread events produced from instruments that have the `ENABLED` column set to `YES` in the [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") table.

* `HISTORY`

  Whether to log historical events for the thread. The value is `YES` or `NO`.

  + For foreground threads, the initial `HISTORY` value is determined by whether the user account associated with the thread matches any row in the [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") table. Matching is based on the values of the `PROCESSLIST_USER` and `PROCESSLIST_HOST` columns.

    If the thread spawns a subthread, matching occurs again for the [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") table row created for the subthread.

  + For background threads, `HISTORY` is `YES` by default. [`setup_actors`](performance-schema-setup-actors-table.html "25.12.2.1 The setup_actors Table") is not consulted because there is no associated user for background threads.

  + For any thread, its `HISTORY` value can be changed during the lifetime of the thread.

  For historical event logging for the thread to occur, these things must be true:

  + The appropriate history-related consumers in the [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table") table must be enabled. For example, wait event logging in the [`events_waits_history`](performance-schema-events-waits-history-table.html "25.12.4.2 The events_waits_history Table") and [`events_waits_history_long`](performance-schema-events-waits-history-long-table.html "25.12.4.3 The events_waits_history_long Table") tables requires the corresponding `events_waits_history` and `events_waits_history_long` consumers to be `YES`.

  + The `threads.HISTORY` column must be `YES`.

  + Logging occurs only for those thread events produced from instruments that have the `ENABLED` column set to `YES` in the [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") table.

* `CONNECTION_TYPE`

  The protocol used to establish the connection, or `NULL` for background threads. Permitted values are `TCP/IP` (TCP/IP connection established without encryption), `SSL/TLS` (TCP/IP connection established with encryption), `Socket` (Unix socket file connection), `Named Pipe` (Windows named pipe connection), and `Shared Memory` (Windows shared memory connection).

* `THREAD_OS_ID`

  The thread or task identifier as defined by the underlying operating system, if there is one:

  + When a MySQL thread is associated with the same operating system thread for its lifetime, `THREAD_OS_ID` contains the operating system thread ID.

  + When a MySQL thread is not associated with the same operating system thread for its lifetime, `THREAD_OS_ID` contains `NULL`. This is typical for user sessions when the thread pool plugin is used (see [Section 5.5.3, “MySQL Enterprise Thread Pool”](thread-pool.html "5.5.3 MySQL Enterprise Thread Pool")).

  For Windows, `THREAD_OS_ID` corresponds to the thread ID visible in Process Explorer (<https://technet.microsoft.com/en-us/sysinternals/bb896653.aspx>).

  For Linux, `THREAD_OS_ID` corresponds to the value of the `gettid()` function. This value is exposed, for example, using the **perf** or **ps -L** commands, or in the `proc` file system (`/proc/[pid]/task/[tid]`). For more information, see the `perf-stat(1)`, `ps(1)`, and `proc(5)` man pages.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is not permitted for the [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") table.
