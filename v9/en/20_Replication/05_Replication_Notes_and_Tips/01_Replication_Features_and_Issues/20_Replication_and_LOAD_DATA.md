#### 19.5.1.20 Replication and LOAD DATA

[`LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement") is considered unsafe
for statement-based logging (see
[Section 19.2.1.3, “Determination of Safe and Unsafe Statements in Binary Logging”](replication-rbr-safe-unsafe.html "19.2.1.3 Determination of Safe and Unsafe Statements in Binary Logging")). When
[`binlog_format=MIXED`](replication-options-binary-log.html#sysvar_binlog_format) is set, the
statement is logged in row-based format. When
[`binlog_format=STATEMENT`](replication-options-binary-log.html#sysvar_binlog_format) is set,
note that [`LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement") does not
generate a warning, unlike other unsafe statements.

If you use [`LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement") with
[`binlog_format=STATEMENT`](replication-options-binary-log.html#sysvar_binlog_format), each
replica on which the changes are to be applied creates a
temporary file containing the data. The replica then uses a
[`LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement") statement to apply the
changes. This temporary file is not encrypted, even if binary
log encryption is active on the source, If encryption is
required, use row-based or mixed binary logging format instead,
for which replicas do not create the temporary file.

If a `PRIVILEGE_CHECKS_USER` account has been
used to help secure the replication channel (see
[Section 19.3.3, “Replication Privilege Checks”](replication-privilege-checks.html "19.3.3 Replication Privilege Checks")), it is strongly
recommended that you log [`LOAD
DATA`](load-data.html "15.2.9 LOAD DATA Statement") operations using row-based binary logging
([`binlog_format=ROW`](replication-options-binary-log.html#sysvar_binlog_format)). If
`REQUIRE_ROW_FORMAT` is set for the channel,
row-based binary logging is required. With this logging format,
the [`FILE`](privileges-provided.html#priv_file) privilege is not needed
to execute the event, so do not give the
`PRIVILEGE_CHECKS_USER` account this privilege.
If you need to recover from a replication error involving a
`LOAD DATA INFILE` operation logged in
statement format, and the replicated event is trusted, you could
grant the [`FILE`](privileges-provided.html#priv_file) privilege to the
`PRIVILEGE_CHECKS_USER` account temporarily,
removing it after the replicated event has been applied.

When [**mysqlbinlog**](mysqlbinlog.html "6.6.9 mysqlbinlog — Utility for Processing Binary Log Files") reads log events for
[`LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement") statements logged in
statement-based format, a generated local file is created in a
temporary directory. These temporary files are not automatically
removed by [**mysqlbinlog**](mysqlbinlog.html "6.6.9 mysqlbinlog — Utility for Processing Binary Log Files") or any other MySQL
program. If you do use [`LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement")
statements with statement-based binary logging, you should
delete the temporary files yourself after you no longer need the
statement log. For more information, see
[Section 6.6.9, “mysqlbinlog — Utility for Processing Binary Log Files”](mysqlbinlog.html "6.6.9 mysqlbinlog — Utility for Processing Binary Log Files").