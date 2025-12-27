#### 5.4.2.6 Error Log File Flushing and Renaming

If you flush the error log using a [`FLUSH ERROR LOGS`](flush.html#flush-error-logs) or [`FLUSH LOGS`](flush.html#flush-logs) statment, or a [**mysqladmin flush-logs**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") command, the server closes and reopens any error log file to which it is writing. To rename an error log file, do so manually before flushing. Flushing the logs then opens a new file with the original file name. For example, assuming a log file name of `host_name.err`, use the following commands to rename the file and create a new one:

```sql
mv host_name.err host_name.err-old
mysqladmin flush-logs error
mv host_name.err-old backup-directory
```

On Windows, use **rename** rather than **mv**.

If the location of the error log file is not writable by the server, the log-flushing operation fails to create a new log file. For example, on Linux, the server might write the error log to the `/var/log/mysqld.log` file, where the `/var/log` directory is owned by `root` and is not writable by [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). For information about handling this case, see [Section 5.4.7, “Server Log Maintenance”](log-file-maintenance.html "5.4.7 Server Log Maintenance").

If the server is not writing to a named error log file, no error log file renaming occurs when the error log is flushed.
