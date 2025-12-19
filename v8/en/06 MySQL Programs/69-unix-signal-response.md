## 6.10 Unix Signal Handling in MySQL

On Unix and Unix-like systems, a process can be the recipient of signals sent to it by the `root` system account or the system account that owns the process. Signals can be sent using the  **kill** command. Some command interpreters associate certain key sequences with signals, such as **Control+C** to send a `SIGINT` signal. This section describes how the MySQL server and client programs respond to signals.

*  Server Response to Signals
*  Client Response to Signals

### Server Response to Signals

 **mysqld** responds to signals as follows:

* `SIGTERM` causes the server to shut down. This is like executing a `SHUTDOWN` statement without having to connect to the server (which for shutdown requires an account that has the `SHUTDOWN` privilege).
* `SIGHUP` causes the server to reload the grant tables and to flush tables, logs, the thread cache, and the host cache. These actions are like various forms of the  `FLUSH` statement. Sending the signal enables the flush operations to be performed without having to connect to the server, which requires a MySQL account that has privileges sufficient for those operations.
* `SIGUSR1` causes the server to flush the error log, general query log, and slow query log. One use for `SIGUSR1` is to implement log rotation without having to connect to the server, which requires a MySQL account that has privileges sufficient for those operations. For information about log rotation, see Section 7.4.6, “Server Log Maintenance”.

  The server response to `SIGUSR1` is a subset of the response to `SIGHUP`, enabling `SIGUSR1` to be used as a more “lightweight” signal that flushes certain logs without the other `SIGHUP` effects such as flushing the thread and host caches and writing a status report to the error log.
* `SIGINT` normally is ignored by the server. Starting the server with the `--gdb` option installs an interrupt handler for `SIGINT` for debugging purposes. See Section 7.9.1.4, “Debugging mysqld under gdb”.

### Client Response to Signals

MySQL client programs respond to signals as follows:

* The  **mysql** client interprets `SIGINT` (typically the result of typing **Control+C**) as instruction to interrupt the current statement if there is one, or to cancel any partial input line otherwise. This behavior can be disabled using the  `--sigint-ignore` option to ignore `SIGINT` signals.
* Client programs that use the MySQL client library block `SIGPIPE` signals by default. These variations are possible:

  + Client can install their own `SIGPIPE` handler to override the default behavior. See Writing C API Threaded Client Programs.
  + Clients can prevent installation of `SIGPIPE` handlers by specifying the `CLIENT_IGNORE_SIGPIPE` option to `mysql_real_connect()` at connect time. See  mysql\_real\_connect().
