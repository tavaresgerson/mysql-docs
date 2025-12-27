### 5.4.7 Server Log Maintenance

As described in [Section 5.4, “MySQL Server Logs”](server-logs.html "5.4 MySQL Server Logs"), MySQL Server can create several different log files to help you see what activity is taking place. However, you must clean up these files regularly to ensure that the logs do not take up too much disk space.

When using MySQL with logging enabled, you may want to back up and remove old log files from time to time and tell MySQL to start logging to new files. See [Section 7.2, “Database Backup Methods”](backup-methods.html "7.2 Database Backup Methods").

On a Linux (Red Hat) installation, you can use the `mysql-log-rotate` script for log maintenance. If you installed MySQL from an RPM distribution, this script should have been installed automatically. Be careful with this script if you are using the binary log for replication. You should not remove binary logs until you are certain that their contents have been processed by all replicas.

On other systems, you must install a short script yourself that you start from **cron** (or its equivalent) for handling log files.

For the binary log, you can set the [`expire_logs_days`](replication-options-binary-log.html#sysvar_expire_logs_days) system variable to expire binary log files automatically after a given number of days (see [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables")). If you are using replication, you should set the variable no lower than the maximum number of days your replicas might lag behind the source. To remove binary logs on demand, use the [`PURGE BINARY LOGS`](purge-binary-logs.html "13.4.1.1 PURGE BINARY LOGS Statement") statement (see [Section 13.4.1.1, “PURGE BINARY LOGS Statement”](purge-binary-logs.html "13.4.1.1 PURGE BINARY LOGS Statement")).

To force MySQL to start using new log files, flush the logs. Log flushing occurs when you execute a [`FLUSH LOGS`](flush.html#flush-logs) statement or a [**mysqladmin flush-logs**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program"), [**mysqladmin refresh**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program"), [**mysqldump --flush-logs**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program"), or [**mysqldump --master-data**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") command. See [Section 13.7.6.3, “FLUSH Statement”](flush.html "13.7.6.3 FLUSH Statement"), [Section 4.5.2, “mysqladmin — A MySQL Server Administration Program”](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program"), and [Section 4.5.4, “mysqldump — A Database Backup Program”](mysqldump.html "4.5.4 mysqldump — A Database Backup Program"). In addition, the server flushes the binary log automatically when current binary log file size reaches the value of the [`max_binlog_size`](replication-options-binary-log.html#sysvar_max_binlog_size) system variable.

[`FLUSH LOGS`](flush.html#flush-logs) supports optional modifiers to enable selective flushing of individual logs (for example, [`FLUSH BINARY LOGS`](flush.html#flush-binary-logs)). See [Section 13.7.6.3, “FLUSH Statement”](flush.html "13.7.6.3 FLUSH Statement").

A log-flushing operation has the following effects:

* If binary logging is enabled, the server closes the current binary log file and opens a new log file with the next sequence number.

* If general query logging or slow query logging to a log file is enabled, the server closes and reopens the log file.

* If the server was started with the [`--log-error`](server-options.html#option_mysqld_log-error) option to cause the error log to be written to a file, the server closes and reopens the log file.

Execution of log-flushing statements or commands requires connecting to the server using an account that has the [`RELOAD`](privileges-provided.html#priv_reload) privilege. On Unix and Unix-like systems, another way to flush the logs is to send a `SIGHUP` signal to the server, which can be done by `root` or the account that owns the server process. Signals enable log flushing to be performed without having to connect to the server. However, `SIGHUP` has additional effects other than log flushing that might be undesirable. For details, see [Section 4.10, “Unix Signal Handling in MySQL”](unix-signal-response.html "4.10 Unix Signal Handling in MySQL").

As mentioned previously, flushing the binary log creates a new binary log file, whereas flushing the general query log, slow query log, or error log just closes and reopens the log file. For the latter logs, to cause a new log file to be created on Unix, rename the current log file first before flushing it. At flush time, the server opens the new log file with the original name. For example, if the general query log, slow query log, and error log files are named `mysql.log`, `mysql-slow.log`, and `err.log`, you can use a series of commands like this from the command line:

```sql
cd mysql-data-directory
mv mysql.log mysql.log.old
mv mysql-slow.log mysql-slow.log.old
mv err.log err.log.old
mysqladmin flush-logs
```

On Windows, use **rename** rather than **mv**.

At this point, you can make a backup of `mysql.log.old`, `mysql-slow.log.old`, and `err.log.old`, then remove them from disk.

To rename the general query log or slow query log at runtime, first connect to the server and disable the log:

```sql
SET GLOBAL general_log = 'OFF';
SET GLOBAL slow_query_log = 'OFF';
```

With the logs disabled, rename the log files externally (for example, from the command line). Then enable the logs again:

```sql
SET GLOBAL general_log = 'ON';
SET GLOBAL slow_query_log = 'ON';
```

This method works on any platform and does not require a server restart.

Note

For the server to recreate a given log file after you have renamed the file externally, the file location must be writable by the server. This may not always be the case. For example, on Linux, the server might write the error log as `/var/log/mysqld.log`, where `/var/log` is owned by `root` and not writable by [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). In this case, log-flushing operations fail to create a new log file.

To handle this situation, you must manually create the new log file with the proper ownership after renaming the original log file. For example, execute these commands as `root`:

```sql
mv /var/log/mysqld.log /var/log/mysqld.log.old
install -omysql -gmysql -m0644 /dev/null /var/log/mysqld.log
```
