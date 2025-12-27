#### 5.4.2.2 Error Logging on Unix and Unix-Like Systems

On Unix and Unix-like systems, [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") uses the [`--log-error`](server-options.html#option_mysqld_log-error) option to determine whether [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") writes the error log to the console or a file, and, if to a file, the file name:

* If [`--log-error`](server-options.html#option_mysqld_log-error) is not given, [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") writes the error log to the console.

* If [`--log-error`](server-options.html#option_mysqld_log-error) is given without naming a file, [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") writes the error log to a file named `host_name.err` in the data directory.

* If [`--log-error`](server-options.html#option_mysqld_log-error) is given to name a file, [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") writes the error log to that file (with an `.err` suffix added if the name has no suffix). The file location is under the data directory unless an absolute path name is given to specify a different location.

* If [`--log-error`](server-options.html#option_mysqld_log-error) is given in an option file in a `[mysqld]`, `[server]`, or `[mysqld_safe]` section, on systems that use [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") to start the server, [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") finds and uses the option, and passes it to [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server").

Note

It is common for Yum or APT package installations to configure an error log file location under `/var/log` with an option like `log-error=/var/log/mysqld.log` in a server configuration file. Removing the path name from the option causes the `host_name.err` file in the data directory to be used.

If the server writes the error log to the console, it sets the [`log_error`](server-system-variables.html#sysvar_log_error) system variable to `stderr`. Otherwise, the server writes the error log to a file and sets [`log_error`](server-system-variables.html#sysvar_log_error) to the file name.
