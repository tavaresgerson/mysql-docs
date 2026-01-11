#### 15.7.8.9 SHUTDOWN Statement

```
SHUTDOWN
```

This statement stops the MySQL server. It requires the `SHUTDOWN` privilege.

`SHUTDOWN` provides an SQL-level interface to the same functionality available using the **mysqladmin shutdown** command or the `mysql_shutdown()` C API function. A successful `SHUTDOWN` sequence consists of checking the privileges, validating the arguments, and sending an OK packet to the client. Then the server is shut down.

The `Com_shutdown` status variable tracks the number of `SHUTDOWN` statements. Because status variables are initialized for each server startup and do not persist across restarts, `Com_shutdown` normally has a value of zero, but can be nonzero if `SHUTDOWN` statements were executed but failed.

Another way to stop the server is to send it a `SIGTERM` signal, which can be done by `root` or the account that owns the server process. `SIGTERM` enables server shutdown to be performed without having to connect to the server. See Section 6.10, “Unix Signal Handling in MySQL”.
