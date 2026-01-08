## 5.4 MySQL Server Logs

[5.4.1 Selecting General Query Log and Slow Query Log Output Destinations](log-destinations.html)

[5.4.2 The Error Log](error-log.html)

[5.4.3 The General Query Log](query-log.html)

[5.4.4 The Binary Log](binary-log.html)

[5.4.5 The Slow Query Log](slow-query-log.html)

[5.4.6 The DDL Log](ddl-log.html)

[5.4.7 Server Log Maintenance](log-file-maintenance.html)

MySQL Server has several logs that can help you find out what activity is taking place.

<table summary="MySQL Server log types and the information written to each log."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Log Type</th> <th>Information Written to Log</th> </tr></thead><tbody><tr> <td>Error log</td> <td>Problems encountered starting, running, or stopping <a class="link" href="mysqld.html" title="4.3.1 mysqld — The MySQL Server"><span class="command"><strong>mysqld</strong></span></a></td> </tr><tr> <td>General query log</td> <td>Established client connections and statements received from clients</td> </tr><tr> <td>Binary log</td> <td>Statements that change data (also used for replication)</td> </tr><tr> <td>Relay log</td> <td>Data changes received from a replication source server</td> </tr><tr> <td>Slow query log</td> <td>Queries that took more than <a class="link" href="server-system-variables.html#sysvar_long_query_time"><code>long_query_time</code></a> seconds to execute</td> </tr><tr> <td>DDL log (metadata log)</td> <td>Metadata operations performed by DDL statements</td> </tr></tbody></table>

By default, no logs are enabled, except the error log on Windows. (The DDL log is always created when required, and has no user-configurable options; see [Section 5.4.6, “The DDL Log”](ddl-log.html "5.4.6 The DDL Log").) The following log-specific sections provide information about the server options that enable logging.

By default, the server writes files for all enabled logs in the data directory. You can force the server to close and reopen the log files (or in some cases switch to a new log file) by flushing the logs. Log flushing occurs when you issue a [`FLUSH LOGS`](flush.html#flush-logs) statement; execute [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") with a `flush-logs` or `refresh` argument; or execute [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") with a [`--flush-logs`](mysqldump.html#option_mysqldump_flush-logs) option. See [Section 13.7.6.3, “FLUSH Statement”](flush.html "13.7.6.3 FLUSH Statement"), [Section 4.5.2, “mysqladmin — A MySQL Server Administration Program”](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program"), and [Section 4.5.4, “mysqldump — A Database Backup Program”](mysqldump.html "4.5.4 mysqldump — A Database Backup Program"). In addition, the binary log is flushed when its size reaches the value of the [`max_binlog_size`](replication-options-binary-log.html#sysvar_max_binlog_size) system variable.

You can control the general query and slow query logs during runtime. You can enable or disable logging, or change the log file name. You can tell the server to write general query and slow query entries to log tables, log files, or both. For details, see [Section 5.4.1, “Selecting General Query Log and Slow Query Log Output Destinations”](log-destinations.html "5.4.1 Selecting General Query Log and Slow Query Log Output Destinations"), [Section 5.4.3, “The General Query Log”](query-log.html "5.4.3 The General Query Log"), and [Section 5.4.5, “The Slow Query Log”](slow-query-log.html "5.4.5 The Slow Query Log").

The relay log is used only on replicas, to hold data changes from the replication source server that must also be made on the replica. For discussion of relay log contents and configuration, see [Section 16.2.4.1, “The Relay Log”](replica-logs-relaylog.html "16.2.4.1 The Relay Log").

For information about log maintenance operations such as expiration of old log files, see [Section 5.4.7, “Server Log Maintenance”](log-file-maintenance.html "5.4.7 Server Log Maintenance").

For information about keeping logs secure, see [Section 6.1.2.3, “Passwords and Logging”](password-logging.html "6.1.2.3 Passwords and Logging").
