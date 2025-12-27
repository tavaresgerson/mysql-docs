#### 25.12.16.3 The processlist Table

Note

The [`processlist`](performance-schema-processlist-table.html "25.12.16.3 The processlist Table") table is automatically created in the Performance Schema for new installations of MySQL 5.7.39, or higher. It is also created automatically by an upgrade.

The MySQL process list indicates the operations currently being performed by the set of threads executing within the server. The [`processlist`](performance-schema-processlist-table.html "25.12.16.3 The processlist Table") table is one source of process information. For a comparison of this table with other sources, see [Sources of Process Information](processlist-access.html#processlist-sources "Sources of Process Information").

The [`processlist`](performance-schema-processlist-table.html "25.12.16.3 The processlist Table") table can be queried directly. If you have the [`PROCESS`](privileges-provided.html#priv_process) privilege, you can see all threads, even those belonging to other users. Otherwise (without the [`PROCESS`](privileges-provided.html#priv_process) privilege), nonanonymous users have access to information about their own threads but not threads for other users, and anonymous users have no access to thread information.

Note

If the [`performance_schema_show_processlist`](performance-schema-system-variables.html#sysvar_performance_schema_show_processlist) system variable is enabled, the [`processlist`](performance-schema-processlist-table.html "25.12.16.3 The processlist Table") table also serves as the basis for an alternative implementation underlying the [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") statement. For details, see later in this section.

The [`processlist`](performance-schema-processlist-table.html "25.12.16.3 The processlist Table") table contains a row for each server process:

```sql
mysql> SELECT * FROM performance_schema.processlist\G
*************************** 1. row ***************************
     ID: 5
   USER: event_scheduler
   HOST: localhost
     DB: NULL
COMMAND: Daemon
   TIME: 137
  STATE: Waiting on empty queue
   INFO: NULL
*************************** 2. row ***************************
     ID: 9
   USER: me
   HOST: localhost:58812
     DB: NULL
COMMAND: Sleep
   TIME: 95
  STATE:
   INFO: NULL
*************************** 3. row ***************************
     ID: 10
   USER: me
   HOST: localhost:58834
     DB: test
COMMAND: Query
   TIME: 0
  STATE: executing
   INFO: SELECT * FROM performance_schema.processlist
...
```

The [`processlist`](performance-schema-processlist-table.html "25.12.16.3 The processlist Table") table has these columns:

* `ID`

  The connection identifier. This is the same value displayed in the `Id` column of the [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") statement, displayed in the `PROCESSLIST_ID` column of the Performance Schema [`threads`](performance-schema-threads-table.html "25.12.16.4 The threads Table") table, and returned by the [`CONNECTION_ID()`](information-functions.html#function_connection-id) function within the thread.

* `USER`

  The MySQL user who issued the statement. A value of `system user` refers to a nonclient thread spawned by the server to handle tasks internally, for example, a delayed-row handler thread or an I/O or SQL thread used on replica hosts. For `system user`, there is no host specified in the `Host` column. `unauthenticated user` refers to a thread that has become associated with a client connection but for which authentication of the client user has not yet occurred. `event_scheduler` refers to the thread that monitors scheduled events (see [Section 23.4, “Using the Event Scheduler”](event-scheduler.html "23.4 Using the Event Scheduler")).

  Note

  A `USER` value of `system user` is distinct from the [`SYSTEM_USER`](/doc/refman/8.0/en/privileges-provided.html#priv_system-user) privilege. The former designates internal threads. The latter distinguishes the system user and regular user account categories (see [Account Categories](/doc/refman/8.0/en/account-categories.html)).

* `HOST`

  The host name of the client issuing the statement (except for `system user`, for which there is no host). The host name for TCP/IP connections is reported in `host_name:client_port` format to make it easier to determine which client is doing what.

* `DB`

  The default database for the thread, or `NULL` if none has been selected.

* `COMMAND`

  The type of command the thread is executing on behalf of the client, or `Sleep` if the session is idle. For descriptions of thread commands, see [Section 8.14, “Examining Server Thread (Process) Information”](thread-information.html "8.14 Examining Server Thread (Process) Information"). The value of this column corresponds to the `COM_xxx` commands of the client/server protocol and `Com_xxx` status variables. See [Section 5.1.9, “Server Status Variables”](server-status-variables.html "5.1.9 Server Status Variables")

* `TIME`

  The time in seconds that the thread has been in its current state. For a replica SQL thread, the value is the number of seconds between the timestamp of the last replicated event and the real time of the replica host. See [Section 16.2.3, “Replication Threads”](replication-threads.html "16.2.3 Replication Threads").

* `STATE`

  An action, event, or state that indicates what the thread is doing. For descriptions of `STATE` values, see [Section 8.14, “Examining Server Thread (Process) Information”](thread-information.html "8.14 Examining Server Thread (Process) Information").

  Most states correspond to very quick operations. If a thread stays in a given state for many seconds, there might be a problem that needs to be investigated.

* `INFO`

  The statement the thread is executing, or `NULL` if it is executing no statement. The statement might be the one sent to the server, or an innermost statement if the statement executes other statements. For example, if a `CALL` statement executes a stored procedure that is executing a [`SELECT`](select.html "13.2.9 SELECT Statement") statement, the `INFO` value shows the [`SELECT`](select.html "13.2.9 SELECT Statement") statement.

* `EXECUTION_ENGINE`

  The query execution engine. The value is either `PRIMARY` or `SECONDARY`. For use with MySQL HeatWave Service and MySQL HeatWave, where the `PRIMARY` engine is `InnoDB` and the `SECONDARY` engine is MySQL HeatWave (`RAPID`). For MySQL Community Edition Server, MySQL Enterprise Edition Server (on-premise), and MySQL HeatWave Service without MySQL HeatWave, the value is always `PRIMARY`. This column was added in MySQL 8.0.29.

[`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") is not permitted for the [`processlist`](performance-schema-processlist-table.html "25.12.16.3 The processlist Table") table.

As mentioned previously, if the [`performance_schema_show_processlist`](performance-schema-system-variables.html#sysvar_performance_schema_show_processlist) system variable is enabled, the [`processlist`](performance-schema-processlist-table.html "25.12.16.3 The processlist Table") table serves as the basis for an alternative implementation of other process information sources:

* The [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") statement.

* The [**mysqladmin processlist**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") command (which uses [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") statement).

The default [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") implementation iterates across active threads from within the thread manager while holding a global mutex. This has negative performance consequences, particularly on busy systems. The alternative [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") implementation is based on the Performance Schema [`processlist`](performance-schema-processlist-table.html "25.12.16.3 The processlist Table") table. This implementation queries active thread data from the Performance Schema rather than the thread manager and does not require a mutex.

MySQL configuration affects [`processlist`](performance-schema-processlist-table.html "25.12.16.3 The processlist Table") table contents as follows:

* Minimum required configuration:

  + The MySQL server must be configured and built with thread instrumentation enabled. This is true by default; it is controlled using the [`DISABLE_PSI_THREAD`](source-configuration-options.html#option_cmake_disable_psi_thread) **CMake** option.

  + The Performance Schema must be enabled at server startup. This is true by default; it is controlled using the [`performance_schema`](performance-schema-system-variables.html#sysvar_performance_schema) system variable.

  With that configuration satisfied, [`performance_schema_show_processlist`](performance-schema-system-variables.html#sysvar_performance_schema_show_processlist) enables or disables the alternative [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement") implementation. If the minimum configuration is not satisfied, the [`processlist`](performance-schema-processlist-table.html "25.12.16.3 The processlist Table") table (and thus [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement")) may not return all data.

* Recommended configuration:

  + To avoid having some threads ignored:

    - Leave the [`performance_schema_max_thread_instances`](performance-schema-system-variables.html#sysvar_performance_schema_max_thread_instances) system variable set to its default or set it at least as great as the [`max_connections`](server-system-variables.html#sysvar_max_connections) system variable.

    - Leave the [`performance_schema_max_thread_classes`](performance-schema-system-variables.html#sysvar_performance_schema_max_thread_classes) system variable set to its default.

  + To avoid having some `STATE` column values be empty, leave the [`performance_schema_max_stage_classes`](performance-schema-system-variables.html#sysvar_performance_schema_max_stage_classes) system variable set to its default.

  The default for those configuration parameters is `-1`, which causes the Performance Schema to autosize them at server startup. With the parameters set as indicated, the [`processlist`](performance-schema-processlist-table.html "25.12.16.3 The processlist Table") table (and thus [`SHOW PROCESSLIST`](show-processlist.html "13.7.5.29 SHOW PROCESSLIST Statement")) produce complete process information.

The preceding configuration parameters affect the contents of the `processlist` table. For a given configuration, however, the [`processlist`](performance-schema-processlist-table.html "25.12.16.3 The processlist Table") contents are unaffected by the [`performance_schema_show_processlist`](performance-schema-system-variables.html#sysvar_performance_schema_show_processlist) setting.

The alternative process list implementation does not apply to the `INFORMATION_SCHEMA` [`PROCESSLIST`](information-schema-processlist-table.html "24.3.18 The INFORMATION_SCHEMA PROCESSLIST Table") table or the `COM_PROCESS_INFO` command of the MySQL client/server protocol.
