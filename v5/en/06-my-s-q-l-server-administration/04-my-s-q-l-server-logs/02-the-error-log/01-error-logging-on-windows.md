#### 5.4.2.1 Error Logging on Windows

On Windows, [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") uses the [`--log-error`](server-options.html#option_mysqld_log-error), [`--pid-file`](server-system-variables.html#sysvar_pid_file), and [`--console`](server-options.html#option_mysqld_console) options to determine whether [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") writes the error log to the console or a file, and, if to a file, the file name:

* If [`--console`](server-options.html#option_mysqld_console) is given, [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") writes the error log to the console. ([`--console`](server-options.html#option_mysqld_console) takes precedence over [`--log-error`](server-options.html#option_mysqld_log-error) if both are given, and the following items regarding [`--log-error`](server-options.html#option_mysqld_log-error) do not apply. Prior to MySQL 5.7, this is reversed: [`--log-error`](server-options.html#option_mysqld_log-error) takes precedence over [`--console`](server-options.html#option_mysqld_console).)

* If [`--log-error`](server-options.html#option_mysqld_log-error) is not given, or is given without naming a file, [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") writes the error log to a file named `host_name.err` in the data directory, unless the [`--pid-file`](server-system-variables.html#sysvar_pid_file) option is specified. In that case, the file name is the PID file base name with a suffix of `.err` in the data directory.

* If [`--log-error`](server-options.html#option_mysqld_log-error) is given to name a file, [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") writes the error log to that file (with an `.err` suffix added if the name has no suffix). The file location is under the data directory unless an absolute path name is given to specify a different location.

If the server writes the error log to the console, it sets the [`log_error`](server-system-variables.html#sysvar_log_error) system variable to `stderr`. Otherwise, the server writes the error log to a file and sets [`log_error`](server-system-variables.html#sysvar_log_error) to the file name.

In addition, the server by default writes events and error messages to the Windows Event Log within the Application log:

* Entries marked as `Error`, `Warning`, and `Note` are written to the Event Log, but not messages such as information statements from individual storage engines.

* Event Log entries have a source of `MySQL`.
* Information written to the Event Log is controlled using the [`log_syslog`](server-system-variables.html#sysvar_log_syslog) system variable, which on Windows is enabled by default. See [Section 5.4.2.3, “Error Logging to the System Log”](error-log-syslog.html "5.4.2.3 Error Logging to the System Log").
