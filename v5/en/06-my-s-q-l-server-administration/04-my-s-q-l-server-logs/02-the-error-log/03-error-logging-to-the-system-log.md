#### 5.4.2.3 Error Logging to the System Log

It is possible to have [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") write the error log to the system log (the Event Log on Windows, and `syslog` on Unix and Unix-like systems). To do so, use these system variables:

* [`log_syslog`](server-system-variables.html#sysvar_log_syslog): Enable this variable to send the error log to the system log. (On Windows, [`log_syslog`](server-system-variables.html#sysvar_log_syslog) is enabled by default.)

  If [`log_syslog`](server-system-variables.html#sysvar_log_syslog) is enabled, the following system variables can also be used for finer control.

* [`log_syslog_facility`](server-system-variables.html#sysvar_log_syslog_facility): The default facility for `syslog` messages is `daemon`. Set this variable to specify a different facility.

* [`log_syslog_include_pid`](server-system-variables.html#sysvar_log_syslog_include_pid): Whether to include the server process ID in each line of `syslog` output.

* [`log_syslog_tag`](server-system-variables.html#sysvar_log_syslog_tag): This variable defines a tag to add to the server identifier (`mysqld`) in `syslog` messages. If defined, the tag is appended to the identifier with a leading hyphen.

Note

Error logging to the system log may require additional system configuration. Consult the system log documentation for your platform.

On Unix and Unix-like systems, control of output to `syslog` is also available using [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script"), which can capture server error output and pass it to `syslog`.

Note

Using [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") for `syslog` error logging is deprecated; you should use the server system variables instead.

[**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") has three error-logging options, [`--syslog`](mysqld-safe.html#option_mysqld_safe_syslog), [`--skip-syslog`](mysqld-safe.html#option_mysqld_safe_syslog), and [`--log-error`](mysqld-safe.html#option_mysqld_safe_log-error). The default with no logging options or with [`--skip-syslog`](mysqld-safe.html#option_mysqld_safe_syslog) is to use the default log file. To explicitly specify use of an error log file, specify [`--log-error=file_name`](mysqld-safe.html#option_mysqld_safe_log-error) to [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script"), which then arranges for [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") to write messages to a log file. To use `syslog`, specify the [`--syslog`](mysqld-safe.html#option_mysqld_safe_syslog) option. For `syslog` output, a tag can be specified with [`--syslog-tag=tag_val`](mysqld-safe.html#option_mysqld_safe_syslog-tag); this is appended to the `mysqld` server identifier with a leading hyphen.
