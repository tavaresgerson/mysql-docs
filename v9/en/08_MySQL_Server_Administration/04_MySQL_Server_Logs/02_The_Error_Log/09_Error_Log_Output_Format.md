#### 7.4.2.9 Error Log Output Format

Each error log sink (writer) component has a characteristic output format it uses to write messages to its destination, but other factors may influence the content of the messages:

* The information available to the log sink. If a log filter component executed prior to execution of the sink component removes a log event field, that field is not available for writing. For information about log filtering, see Section 7.4.2.4, “Types of Error Log Filtering”.

* The information relevant to the log sink. Not every sink writes all fields available in error events.

* System variables may affect log sinks. See System Variables That Affect Error Log Format.

For names and descriptions of the fields in error events, see Section 7.4.2.3, “Error Event Fields”. For all log sinks, the thread ID included in error log messages is that of the thread within **mysqld** responsible for writing the message. This ID indicates which part of the server produced the message, and is consistent with general query log and slow query log messages, which include the connection thread ID.

* log\_sink\_internal Output Format
* log\_sink\_json Output Format
* log\_sink\_syseventlog Output Format
* Early-Startup Logging Output Format
* System Variables That Affect Error Log Format

##### log\_sink\_internal Output Format

The internal log sink produces traditional error log output. For example:

```
2020-08-06T14:25:02.835618Z 0 [Note] [MY-012487] [InnoDB] DDL log recovery : begin
2020-08-06T14:25:02.936146Z 0 [Warning] [MY-010068] [Server] CA certificate /var/mysql/sslinfo/cacert.pem is self signed.
2020-08-06T14:25:02.963127Z 0 [Note] [MY-010253] [Server] IPv6 is available.
2020-08-06T14:25:03.109022Z 5 [Note] [MY-010051] [Server] Event Scheduler: scheduler thread started with id 5
```

Traditional-format messages have these fields:

```
time thread [label] [err_code] [subsystem] msg
```

The `[` and `]` square bracket characters are literal characters in the message format. They do not indicate that fields are optional.

The `label` value corresponds to the string form of the `prio` error event priority field.

##### log\_sink\_json Output Format

The JSON-format log sink produces messages as JSON objects that contain key-value pairs. For example:

```
{
  "prio": 3,
  "err_code": 10051,
  "source_line": 561,
  "source_file": "event_scheduler.cc",
  "function": "run",
  "msg": "Event Scheduler: scheduler thread started with id 5",
  "time": "2020-08-06T14:25:03.109022Z",
  "ts": 1596724012005,
  "thread": 5,
  "err_symbol": "ER_SCHEDULER_STARTED",
  "SQL_state": "HY000",
  "subsystem": "Server",
  "buffered": 1596723903109022,
  "label": "Note"
}
```

The message shown is reformatted for readability. Events written to the error log appear one message per line.

The `ts` (timestamp) key is unique to the JSON-format log sink. The value is an integer indicating milliseconds since the epoch (`'1970-01-01 00:00:00'` UTC).

The `ts` and `buffered` values are Unix timestamp values and can be converted using `FROM_UNIXTIME()` and an appropriate divisor:

```
mysql> SET time_zone = '+00:00';
mysql> SELECT FROM_UNIXTIME(1596724012005/1000.0);
+-------------------------------------+
| FROM_UNIXTIME(1596724012005/1000.0) |
+-------------------------------------+
| 2020-08-06 14:26:52.0050            |
+-------------------------------------+
mysql> SELECT FROM_UNIXTIME(1596723903109022/1000000.0);
+-------------------------------------------+
| FROM_UNIXTIME(1596723903109022/1000000.0) |
+-------------------------------------------+
| 2020-08-06 14:25:03.1090                  |
+-------------------------------------------+
```

##### log\_sink\_syseventlog Output Format

The system log sink produces output that conforms to the system log format used on the local platform.

##### Early-Startup Logging Output Format

The server generates some error log messages before startup options have been processed, and thus before it knows error log settings such as the `log_error_verbosity` and `log_timestamps` system variable values, and before it knows which log components are to be used. The server handles error log messages that are generated early in the startup process as follows:

* The server buffers log events (rather than formatted log messages), which enables it to apply configuration settings to those events retroactively, after the settings are known, with the result that flushed messages use the configured settings, not the defaults. Also, messages are flushed to all configured sinks, not just the default sink.

  If a fatal error occurs before log configuration is known and the server must exit, the server formats buffered messages using the logging defaults so they are not lost. If no fatal error occurs but startup is excessively slow prior to processing startup options, the server periodically formats and flushes buffered messages using the logging defaults so as not to appear unresponsive. Although this behavior uses the defaults, it is preferable to losing messages when exceptional conditions occur.

##### System Variables That Affect Error Log Format

The `log_timestamps` system variable controls the time zone of timestamps in messages written to the error log (as well as to general query log and slow query log files). The server applies `log_timestamps` to error events before they reach any log sink; it thus affects error message output from all sinks.

Permitted `log_timestamps` values are `UTC` (the default) and `SYSTEM` (the local system time zone). Timestamps are written using ISO 8601 / RFC 3339 format: `YYYY-MM-DDThh:mm:ss.uuuuuu` plus a tail value of `Z` signifying Zulu time (UTC) or `±hh:mm` (an offset that indicates the local system time zone adjustment relative to UTC). For example:

```
2020-08-07T15:02:00.832521Z            (UTC)
2020-08-07T10:02:00.832521-05:00       (SYSTEM)
```
