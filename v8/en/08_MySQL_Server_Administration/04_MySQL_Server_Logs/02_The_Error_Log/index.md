### 7.4.2 The Error Log

7.4.2.1 Error Log Configuration

7.4.2.2 Default Error Log Destination Configuration

7.4.2.3 Error Event Fields

7.4.2.4 Types of Error Log Filtering

7.4.2.5 Priority-Based Error Log Filtering (log_filter_internal)

7.4.2.6 Rule-Based Error Log Filtering (log_filter_dragnet)

7.4.2.7 Error Logging in JSON Format

7.4.2.8 Error Logging to the System Log

7.4.2.9 Error Log Output Format

7.4.2.10 Error Log File Flushing and Renaming

This section discusses how to configure the MySQL server for logging of diagnostic messages to the error log. For information about selecting the error message character set and language, see Section 12.6, “Error Message Character Set”, and Section 12.12, “Setting the Error Message Language”.

The error log contains a record of **mysqld** startup and shutdown times. It also contains diagnostic messages such as errors, warnings, and notes that occur during server startup and shutdown, and while the server is running. For example, if **mysqld** notices that a table needs to be automatically checked or repaired, it writes a message to the error log.

Depending on error log configuration, error messages may also populate the Performance Schema `error_log` table, to provide an SQL interface to the log and enable its contents to be queried. See Section 29.12.21.2, “The error_log Table”.

On some operating systems, the error log contains a stack trace if **mysqld** exits abnormally. The trace can be used to determine where **mysqld** exited. See Section 7.9, “Debugging MySQL”.

If used to start **mysqld**, **mysqld_safe** may write messages to the error log. For example, when **mysqld_safe** notices abnormal **mysqld** exits, it restarts **mysqld** and writes a `mysqld restarted` message to the error log.

The following sections discuss aspects of configuring error logging.
