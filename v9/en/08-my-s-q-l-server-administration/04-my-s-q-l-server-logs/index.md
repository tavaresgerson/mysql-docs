## 7.4 MySQL Server Logs

7.4.1 Selecting General Query Log and Slow Query Log Output Destinations

7.4.2 The Error Log

7.4.3 The General Query Log

7.4.4 The Binary Log

7.4.5 The Slow Query Log

7.4.6 Server Log Maintenance

MySQL Server has several logs that can help you find out what activity is taking place.

<table summary="MySQL Server log types and the information written to each log."><thead><tr> <th>Log Type</th> <th>Information Written to Log</th> </tr></thead><tbody><tr> <td>Error log</td> <td>Problems encountered starting, running, or stopping <a class="link" href="mysqld.html" title="6.3.1 mysqld — The MySQL Server"><span class="command"><strong>mysqld</strong></span></a></td> </tr><tr> <td>General query log</td> <td>Established client connections and statements received from clients</td> </tr><tr> <td>Binary log</td> <td>Statements that change data (also used for replication)</td> </tr><tr> <td>Relay log</td> <td>Data changes received from a replication source server</td> </tr><tr> <td>Slow query log</td> <td>Queries that took more than <a class="link" href="server-system-variables.html#sysvar_long_query_time"><code class="literal">long_query_time</code></a> seconds to execute</td> </tr><tr> <td>DDL logs</td> <td>Atomic DDL operations performed by DDL statements</td> </tr></tbody></table>

By default, no logs are enabled, except the error log on Windows. For information about DDL log behavior, see Viewing DDL Logs. The following log-specific sections provide information about the server options that enable logging.

By default, the server writes files for all enabled logs in the data directory. You can force the server to close and reopen the log files (or in some cases switch to a new log file) by flushing the logs. Log flushing occurs when you issue a `FLUSH LOGS` statement; execute **mysqladmin** with a `flush-logs` or `refresh` argument; or execute **mysqldump** with a `--flush-logs` option. See Section 15.7.8.3, “FLUSH Statement”, Section 6.5.2, “mysqladmin — A MySQL Server Administration Program”, and Section 6.5.4, “mysqldump — A Database Backup Program”. In addition, the binary log is flushed when its size reaches the value of the `max_binlog_size` system variable.

You can control the general query and slow query logs during runtime. You can enable or disable logging, or change the log file name. You can tell the server to write general query and slow query entries to log tables, log files, or both. For details, see Section 7.4.1, “Selecting General Query Log and Slow Query Log Output Destinations”, Section 7.4.3, “The General Query Log”, and Section 7.4.5, “The Slow Query Log”.

The relay log is used only on replicas, to hold data changes from the replication source server that must also be made on the replica. For discussion of relay log contents and configuration, see Section 19.2.4.1, “The Relay Log”.

For information about log maintenance operations such as expiration of old log files, see Section 7.4.6, “Server Log Maintenance”.

For information about keeping logs secure, see Section 8.1.2.3, “Passwords and Logging”.
