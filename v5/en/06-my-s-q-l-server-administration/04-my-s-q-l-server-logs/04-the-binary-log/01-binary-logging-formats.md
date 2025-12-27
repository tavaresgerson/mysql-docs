#### 5.4.4.1 Binary Logging Formats

The server uses several logging formats to record information in the binary log. The exact format employed depends on the version of MySQL being used. There are three logging formats:

* Replication capabilities in MySQL originally were based on propagation of SQL statements from source to replica. This is called *statement-based logging*. You can cause this format to be used by starting the server with [`--binlog-format=STATEMENT`](replication-options-binary-log.html#sysvar_binlog_format).

* In *row-based logging*, the source writes events to the binary log that indicate how individual table rows are affected. It is important therefore that tables always use a primary key to ensure rows can be efficiently identified. You can cause the server to use row-based logging by starting it with [`--binlog-format=ROW`](replication-options-binary-log.html#sysvar_binlog_format).

* A third option is also available: *mixed logging*. With mixed logging, statement-based logging is used by default, but the logging mode switches automatically to row-based in certain cases as described below. You can cause MySQL to use mixed logging explicitly by starting [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") with the option [`--binlog-format=MIXED`](replication-options-binary-log.html#sysvar_binlog_format).

The logging format can also be set or limited by the storage engine being used. This helps to eliminate issues when replicating certain statements between a source and replica which are using different storage engines.

With statement-based replication, there may be issues with replicating nondeterministic statements. In deciding whether or not a given statement is safe for statement-based replication, MySQL determines whether it can guarantee that the statement can be replicated using statement-based logging. If MySQL cannot make this guarantee, it marks the statement as potentially unreliable and issues the warning, Statement may not be safe to log in statement format.

You can avoid these issues by using MySQL's row-based replication instead.
