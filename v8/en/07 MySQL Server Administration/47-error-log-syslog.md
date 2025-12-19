#### 7.4.2.8 Error Logging to the System Log

It is possible to have  **mysqld** write the error log to the system log (the Event Log on Windows, and `syslog` on Unix and Unix-like systems).

This section describes how to configure error logging using the built-in filter, `log_filter_internal`, and the system log sink, `log_sink_syseventlog`, to take effect immediately and for subsequent server startups. For general information about configuring error logging, see Section 7.4.2.1, “Error Log Configuration”.

To enable the system log sink, first load the sink component, then modify the `log_error_services` value:

```
INSTALL COMPONENT 'file://component_log_sink_syseventlog';
SET PERSIST log_error_services = 'log_filter_internal; log_sink_syseventlog';
```

To set  `log_error_services` to take effect at server startup, use the instructions at Section 7.4.2.1, “Error Log Configuration”. Those instructions apply to other error-logging system variables as well.

::: info Note

Error logging to the system log may require additional system configuration. Consult the system log documentation for your platform.

:::

On Windows, error messages written to the Event Log within the Application log have these characteristics:

* Entries marked as `Error`, `Warning`, and `Note` are written to the Event Log, but not messages such as information statements from individual storage engines.
* Event Log entries have a source of `MySQL` (or `MySQL-tag` if  `syseventlog.tag` is defined as *`tag`*).

On Unix and Unix-like systems, logging to the system log uses `syslog`. The following system variables affect `syslog` messages:

*  `syseventlog.facility`: The default facility for `syslog` messages is `daemon`. Set this variable to specify a different facility.
*  `syseventlog.include_pid`: Whether to include the server process ID in each line of `syslog` output.
*  `syseventlog.tag`: This variable defines a tag to add to the server identifier (`mysqld`) in `syslog` messages. If defined, the tag is appended to the identifier with a leading hyphen.

MySQL uses the custom label “System” for important system messages about non-error situations, such as startup, shutdown, and some significant changes to settings. In logs that do not support custom labels, including the Event Log on Windows, and `syslog` on Unix and Unix-like systems, system messages are assigned the label used for the information priority level. However, these messages are printed to the log even if the MySQL `log_error_verbosity` setting normally excludes messages at the information level.

When a log sink must fall back to a label of “Information” instead of “System” in this way, and the log event is further processed outside of the MySQL server (for example, filtered or forwarded by a `syslog` configuration), these events may by default be processed by the secondary application as being of “Information” priority rather than “System” priority.
