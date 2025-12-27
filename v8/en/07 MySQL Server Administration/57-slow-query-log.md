### 7.4.5 The Slow Query Log

The slow query log consists of SQL statements that take more than `long_query_time` seconds to execute and require at least `min_examined_row_limit` rows to be examined. The slow query log can be used to find queries that take a long time to execute and are therefore candidates for optimization. However, examining a long slow query log can be a time-consuming task. To make this easier, you can use the  `mysqldumpslow` command to process a slow query log file and summarize its contents. See Section 6.6.10, “mysqldumpslow — Summarize Slow Query Log Files”.

The time to acquire the initial locks is not counted as execution time.  `mysqld` writes a statement to the slow query log after it has been executed and after all locks have been released, so log order might differ from execution order.

*  Slow Query Log Parameters
*  Slow Query Log Contents

#### Slow Query Log Parameters

The minimum and default values of `long_query_time` are 0 and 10, respectively. The value can be specified to a resolution of microseconds.

By default, administrative statements are not logged, nor are queries that do not use indexes for lookups. This behavior can be changed using `log_slow_admin_statements` and `log_queries_not_using_indexes`, as described later.

By default, the slow query log is disabled. To specify the initial slow query log state explicitly, use `--slow_query_log[={0|1}]`. With no argument or an argument of 1, `--slow_query_log` enables the log. With an argument of 0, this option disables the log. To specify a log file name, use `--slow_query_log_file=file_name`. To specify the log destination, use the `log_output` system variable (as described in  Section 7.4.1, “Selecting General Query Log and Slow Query Log Output Destinations”).

::: info Note

If you specify the `TABLE` log destination, see  Log Tables and “Too many open files” Errors.

:::

If you specify no name for the slow query log file, the default name is `host_name-slow.log`. The server creates the file in the data directory unless an absolute path name is given to specify a different directory.

To disable or enable the slow query log or change the log file name at runtime, use the global `slow_query_log` and `slow_query_log_file` system variables. Set  `slow_query_log` to 0 to disable the log or to 1 to enable it. Set `slow_query_log_file` to specify the name of the log file. If a log file already is open, it is closed and the new file is opened.

The server writes less information to the slow query log if you use the  `--log-short-format` option.

To include slow administrative statements in the slow query log, enable the `log_slow_admin_statements` system variable. Administrative statements include `ALTER TABLE`, `ANALYZE TABLE`, `CHECK TABLE`, `CREATE INDEX`, `DROP INDEX`, `OPTIMIZE TABLE`, and `REPAIR TABLE`.

To include queries that do not use indexes for row lookups in the statements written to the slow query log, enable the `log_queries_not_using_indexes` system variable. (Even with that variable enabled, the server does not log queries that would not benefit from the presence of an index due to the table having fewer than two rows.)

When queries that do not use an index are logged, the slow query log may grow quickly. It is possible to put a rate limit on these queries by setting the `log_throttle_queries_not_using_indexes` system variable. By default, this variable is 0, which means there is no limit. Positive values impose a per-minute limit on logging of queries that do not use indexes. The first such query opens a 60-second window within which the server logs queries up to the given limit, then suppresses additional queries. If there are suppressed queries when the window ends, the server logs a summary that indicates how many there were and the aggregate time spent in them. The next 60-second window begins when the server logs the next query that does not use indexes.

The server uses the controlling parameters in the following order to determine whether to write a query to the slow query log:

1. The query must either not be an administrative statement, or `log_slow_admin_statements` must be enabled.
2. The query must have taken at least `long_query_time` seconds, or `log_queries_not_using_indexes` must be enabled and the query used no indexes for row lookups.
3. The query must have examined at least `min_examined_row_limit` rows.
4. The query must not be suppressed according to the `log_throttle_queries_not_using_indexes` setting.

The  `log_timestamps` system variable controls the time zone of timestamps in messages written to the slow query log file (as well as to the general query log file and the error log). It does not affect the time zone of general query log and slow query log messages written to log tables, but rows retrieved from those tables can be converted from the local system time zone to any desired time zone with  `CONVERT_TZ()` or by setting the session  `time_zone` system variable.

By default, a replica does not write replicated queries to the slow query log. To change this, enable the `log_slow_replica_statements` system variable. Note that if row-based replication is in use ( `binlog_format=ROW`), these system variables have no effect. Queries are only added to the replica's slow query log when they are logged in statement format in the binary log, that is, when `binlog_format=STATEMENT` is set, or when  `binlog_format=MIXED` is set and the statement is logged in statement format. Slow queries that are logged in row format when `binlog_format=MIXED` is set, or that are logged when `binlog_format=ROW` is set, are not added to the replica's slow query log, even if `log_slow_replica_statements` is enabled.

#### Slow Query Log Contents

When the slow query log is enabled, the server writes output to any destinations specified by the `log_output` system variable. If you enable the log, the server opens the log file and writes startup messages to it. However, further logging of queries to the file does not occur unless the `FILE` log destination is selected. If the destination is `NONE`, the server writes no queries even if the slow query log is enabled. Setting the log file name has no effect on logging if `FILE` is not selected as an output destination.

If the slow query log is enabled and `FILE` is selected as an output destination, each statement written to the log is preceded by a line that begins with a `#` character and has these fields (with all fields on a single line):

* `Query_time: duration`

  The statement execution time in seconds.
* `Lock_time: duration`

  The time to acquire locks in seconds.
* `Rows_sent: N`

  The number of rows sent to the client.
* `Rows_examined:`

  The number of rows examined by the server layer (not counting any processing internal to storage engines).

Enabling the  `log_slow_extra` system variable causes the server to write the following extra fields to `FILE` output in addition to those just listed (`TABLE` output is unaffected). Some field descriptions refer to status variable names. Consult the status variable descriptions for more information. However, in the slow query log, the counters are per-statement values, not cumulative per-session values.

* `Thread_id: ID`

  The statement thread identifier.
* `Errno: error_number`

  The statement error number, or 0 if no error occurred.
* `Killed: N`

  If the statement was terminated, the error number indicating why, or 0 if the statement terminated normally.
* `Bytes_received: N`

  The  `Bytes_received` value for the statement.
* `Bytes_sent: N`

  The  `Bytes_sent` value for the statement.
* `Read_first: N`

  The  `Handler_read_first` value for the statement.
* `Read_last: N`

  The  `Handler_read_last` value for the statement.
* `Read_key: N`

  The  `Handler_read_key` value for the statement.
* `Read_next: N`

  The  `Handler_read_next` value for the statement.
* `Read_prev: N`

  The  `Handler_read_prev` value for the statement.
* `Read_rnd: N`

  The  `Handler_read_rnd` value for the statement.
* `Read_rnd_next: N`

  The  `Handler_read_rnd_next` value for the statement.
* `Sort_merge_passes: N`

  The  `Sort_merge_passes` value for the statement.
* `Sort_range_count: N`

  The  `Sort_range` value for the statement.
* `Sort_rows: N`

  The  `Sort_rows` value for the statement.
* `Sort_scan_count: N`

  The  `Sort_scan` value for the statement.
* `Created_tmp_disk_tables: N`

  The `Created_tmp_disk_tables` value for the statement.
* `Created_tmp_tables: N`

  The  `Created_tmp_tables` value for the statement.
* `Start: timestamp`

  The statement execution start time.
* `End: timestamp`

  The statement execution end time.

A given slow query log file may contain a mix of lines with and without the extra fields added by enabling `log_slow_extra`. Log file analyzers can determine whether a line contains the additional fields by the field count.

Each statement written to the slow query log file is preceded by a  `SET` statement that includes a timestamp, which indicates when the slow statement began executing.

Passwords in statements written to the slow query log are rewritten by the server not to occur literally in plain text. See  Section 8.1.2.3, “Passwords and Logging”.

Statements that cannot be parsed (due, for example, to syntax errors) are not written to the slow query log.
