### 7.4.2 The Error Log

This section discusses how to configure the MySQL server for
logging of diagnostic messages to the error log. For information
about selecting the error message character set and language, see
[Section 12.6, “Error Message Character Set”](charset-errors.html "12.6 Error Message Character Set"), and
[Section 12.12, “Setting the Error Message Language”](error-message-language.html "12.12 Setting the Error Message Language").

The error log contains a record of [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server")
startup and shutdown times. It also contains diagnostic messages
such as errors, warnings, and notes that occur during server
startup and shutdown, and while the server is running. For
example, if [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") notices that a table needs
to be automatically checked or repaired, it writes a message to
the error log.

Depending on error log configuration, error messages may also
populate the Performance Schema
[`error_log`](performance-schema-error-log-table.html "29.12.22.3 The error_log Table") table, to provide an SQL
interface to the log and enable its contents to be queried. See
[Section 29.12.22.3, “The error\_log Table”](performance-schema-error-log-table.html "29.12.22.3 The error_log Table").

On some operating systems, the error log contains a stack trace if
[**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") exits abnormally. The trace can be used
to determine where [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") exited. See
[Section 7.9, “Debugging MySQL”](debugging-mysql.html "7.9 Debugging MySQL").

If used to start [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server"),
[**mysqld\_safe**](mysqld-safe.html "6.3.2 mysqld_safe — MySQL Server Startup Script") may write messages to the error
log. For example, when [**mysqld\_safe**](mysqld-safe.html "6.3.2 mysqld_safe — MySQL Server Startup Script") notices
abnormal [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") exits, it restarts
[**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") and writes a `mysqld
restarted` message to the error log.

The following sections discuss aspects of configuring error
logging.