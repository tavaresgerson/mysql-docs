### 9.3.3 Backup Strategy Summary

In case of an operating system crash or power failure, `InnoDB` itself does all the job of recovering data. But to make sure that you can sleep well, observe the following guidelines:

* Always tun the MySQL server with binary logging enabled (that is the default setting for MySQL 8.0). If you have such safe media, this technique can also be good for disk load balancing (which results in a performance improvement).

* Make periodic full backups, using the **mysqldump** command shown earlier in Section 9.3.1, “Establishing a Backup Policy”, that makes an online, nonblocking backup.

* Make periodic incremental backups by flushing the logs with `FLUSH LOGS` or **mysqladmin flush-logs**.
