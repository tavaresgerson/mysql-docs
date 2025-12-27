### 7.3.3 Backup Strategy Summary

In case of an operating system crash or power failure, `InnoDB` itself does all the job of recovering data. But to make sure that you can sleep well, observe the following guidelines:

* Always run the MySQL server with the `--log-bin` option, or even `--log-bin=log_name`, where the log file name is located on some safe media different from the drive on which the data directory is located. If you have such safe media, this technique can also be good for disk load balancing (which results in a performance improvement).

* Make periodic full backups, using the **mysqldump** command shown earlier in Section 7.3.1, “Establishing a Backup Policy”, that makes an online, nonblocking backup.

* Make periodic incremental backups by flushing the logs with `FLUSH LOGS` or **mysqladmin flush-logs**.
