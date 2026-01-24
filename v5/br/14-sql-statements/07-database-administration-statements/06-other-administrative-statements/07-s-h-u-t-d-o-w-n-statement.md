#### 13.7.6.7 SHUTDOWN Statement

```sql
SHUTDOWN
```

This statement stops the MySQL server. It requires the [`SHUTDOWN`](privileges-provided.html#priv_shutdown) privilege.

[`SHUTDOWN`](shutdown.html "13.7.6.7 SHUTDOWN Statement") provides an SQL-level interface to the same functionality available using the [**mysqladmin shutdown**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") command or the [`mysql_shutdown()`](/doc/c-api/5.7/en/mysql-shutdown.html) C API function. A successful [`SHUTDOWN`](shutdown.html "13.7.6.7 SHUTDOWN Statement") sequence consists of checking the privileges, validating the arguments, and sending an OK packet to the client. Then the server is shut down.

The [`Com_shutdown`](server-status-variables.html#statvar_Com_xxx) status variable tracks the number of [`SHUTDOWN`](shutdown.html "13.7.6.7 SHUTDOWN Statement") statements. Because status variables are initialized for each server startup and do not persist across restarts, `Com_shutdown` normally has a value of zero, but can be nonzero if [`SHUTDOWN`](shutdown.html "13.7.6.7 SHUTDOWN Statement") statements were executed but failed.

Another way to stop the server is to send it a `SIGTERM` signal, which can be done by `root` or the account that owns the server process. `SIGTERM` enables server shutdown to be performed without having to connect to the server. See [Section 4.10, “Unix Signal Handling in MySQL”](unix-signal-response.html "4.10 Unix Signal Handling in MySQL").
