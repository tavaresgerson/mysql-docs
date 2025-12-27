### 5.4.2 The Error Log

[5.4.2.1 Error Logging on Windows](error-log-windows.html)

[5.4.2.2 Error Logging on Unix and Unix-Like Systems](error-log-unix.html)

[5.4.2.3 Error Logging to the System Log](error-log-syslog.html)

[5.4.2.4 Error Log Filtering](error-log-filtering.html)

[5.4.2.5 Error Log Output Format](error-log-format.html)

[5.4.2.6 Error Log File Flushing and Renaming](error-log-rotation.html)

This section discusses how to configure the MySQL server for logging of diagnostic messages to the error log. For information about selecting the error message character set and language, see [Section 10.6, “Error Message Character Set”](charset-errors.html "10.6 Error Message Character Set"), and [Section 10.12, “Setting the Error Message Language”](error-message-language.html "10.12 Setting the Error Message Language").

The error log contains a record of [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") startup and shutdown times. It also contains diagnostic messages such as errors, warnings, and notes that occur during server startup and shutdown, and while the server is running. For example, if [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") notices that a table needs to be automatically checked or repaired, it writes a message to the error log.

On some operating systems, the error log contains a stack trace if [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") exits abnormally. The trace can be used to determine where [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") exited. See [Section 5.8, “Debugging MySQL”](debugging-mysql.html "5.8 Debugging MySQL").

If used to start [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"), [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") may write messages to the error log. For example, when [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") notices abnormal [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") exits, it restarts [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") and writes a `mysqld restarted` message to the error log.

The following sections discuss aspects of configuring error logging. In the discussion, “console” means `stderr`, the standard error output. This is your terminal or console window unless the standard error output has been redirected to a different destination.

The server interprets options that determine where to write error messages somewhat differently for Windows and Unix systems. Be sure to configure error logging using the information appropriate to your platform.
