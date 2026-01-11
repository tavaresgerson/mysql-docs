#### 30.4.3.22 The processlist and x$processlist Views

The MySQL process list indicates the operations currently being performed by the set of threads executing within the server. The `processlist` and `x$processlist` views summarize process information. They provide more complete information than the `SHOW PROCESSLIST` statement and the `INFORMATION_SCHEMA` `PROCESSLIST` table, and are also nonblocking. By default, rows are sorted by descending process time and descending wait time. For a comparison of process information sources, see Sources of Process Information.

The column descriptions here are brief. For additional information, see the description of the Performance Schema `threads` table at Section 29.12.22.10, “The threads Table”.

The `processlist` and `x$processlist` views have these columns:

* `thd_id`

  The thread ID.

* `conn_id`

  The connection ID.

* `user`

  The thread user or thread name.

* `db`

  The default database for the thread, or `NULL` if there is none.

* `command`

  For foreground threads, the type of command the thread is executing on behalf of the client, or `Sleep` if the session is idle.

* `state`

  An action, event, or state that indicates what the thread is doing.

* `time`

  The time in seconds that the thread has been in its current state.

* `current_statement`

  The statement the thread is executing, or `NULL` if it is not executing any statement.

* `execution_engine`

  The query execution engine. The value is either `PRIMARY` or `SECONDARY`. For use with MySQL HeatWave Service and MySQL HeatWave, where the `PRIMARY` engine is `InnoDB` and `SECONDARY` engine is MySQL HeatWave (`RAPID`). For MySQL Community Edition Server, MySQL Enterprise Edition Server (on-premise), and MySQL HeatWave Service without MySQL HeatWave, the value is always `PRIMARY`.

* `statement_latency`

  How long the statement has been executing.

* `progress`

  The percentage of work completed for stages that support progress reporting. See Section 30.3, “sys Schema Progress Reporting”.

* `lock_latency`

  The time spent waiting for locks by the current statement.

* `cpu_latency`

  The time spent on CPU for the current thread.

* `rows_examined`

  The number of rows read from storage engines by the current statement.

* `rows_sent`

  The number of rows returned by the current statement.

* `rows_affected`

  The number of rows affected by the current statement.

* `tmp_tables`

  The number of internal in-memory temporary tables created by the current statement.

* `tmp_disk_tables`

  The number of internal on-disk temporary tables created by the current statement.

* `full_scan`

  The number of full table scans performed by the current statement.

* `last_statement`

  The last statement executed by the thread, if there is no currently executing statement or wait.

* `last_statement_latency`

  How long the last statement executed.

* `current_memory`

  The number of bytes allocated by the thread.

* `last_wait`

  The name of the most recent wait event for the thread.

* `last_wait_latency`

  The wait time of the most recent wait event for the thread.

* `source`

  The source file and line number containing the instrumented code that produced the event.

* `trx_latency`

  The wait time of the current transaction for the thread.

* `trx_state`

  The state for the current transaction for the thread.

* `trx_autocommit`

  Whether autocommit mode was enabled when the current transaction started.

* `pid`

  The client process ID.

* `program_name`

  The client program name.
