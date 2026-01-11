#### 29.12.22.3 The error\_log Table

Of the logs the MySQL server maintains, one is the error log to which it writes diagnostic messages (see Section 7.4.2, “The Error Log”). Typically, the server writes diagnostics to a file on the server host or to a system log service. Depending on error log configuration, the server can also write the most recent error events to the Performance Schema `error_log` table. Granting the `SELECT` privilege for the `error_log` table thus gives clients and applications access to error log contents using SQL queries, enabling DBAs to provide access to the log without the need to permit direct file system access on the server host.

The `error_log` table supports focused queries based on its more structured columns. It also includes the full text of error messages to support more free-form analysis.

The table implementation uses a fixed-size, in-memory ring buffer, with old events automatically discarded as necessary to make room for new ones.

Example `error_log` contents:

```
mysql> SELECT * FROM performance_schema.error_log\G
*************************** 1. row ***************************
    LOGGED: 2020-08-06 09:25:00.338624
 THREAD_ID: 0
      PRIO: System
ERROR_CODE: MY-010116
 SUBSYSTEM: Server
      DATA: mysqld (mysqld 9.5.0) starting as process 96344
*************************** 2. row ***************************
    LOGGED: 2020-08-06 09:25:00.363521
 THREAD_ID: 1
      PRIO: System
ERROR_CODE: MY-013576
 SUBSYSTEM: InnoDB
      DATA: InnoDB initialization has started.
...
*************************** 65. row ***************************
    LOGGED: 2020-08-06 09:25:02.936146
 THREAD_ID: 0
      PRIO: Warning
ERROR_CODE: MY-010068
 SUBSYSTEM: Server
      DATA: CA certificate /var/mysql/sslinfo/cacert.pem is self signed.
...
*************************** 89. row ***************************
    LOGGED: 2020-08-06 09:25:03.112801
 THREAD_ID: 0
      PRIO: System
ERROR_CODE: MY-013292
 SUBSYSTEM: Server
      DATA: Admin interface ready for connections, address: '127.0.0.1' port: 33062
```

The `error_log` table has the following columns. As indicated in the descriptions, all but the `DATA` column correspond to fields of the underlying error event structure, which is described in Section 7.4.2.3, “Error Event Fields”.

* `LOGGED`

  The event timestamp, with microsecond precision. `LOGGED` corresponds to the `time` field of error events, although with certain potential differences:

  + `time` values in the error log are displayed according to the `log_timestamps` system variable setting; see Early-Startup Logging Output Format.

  + The `LOGGED` column stores values using the `TIMESTAMP` data type, for which values are stored in UTC but displayed when retrieved in the current session time zone; see Section 13.2.2, “The DATE, DATETIME, and TIMESTAMP Types”.

  To display `LOGGED` values in the same time zone as displayed in the error log file, first set the session time zone as follows:

  ```
  SET @@session.time_zone = @@global.log_timestamps;
  ```

  If the `log_timestamps` value is `UTC` and your system does not have named time zone support installed (see Section 7.1.15, “MySQL Server Time Zone Support”), set the time zone like this:

  ```
  SET @@session.time_zone = '+00:00';
  ```

* `THREAD_ID`

  The MySQL thread ID. `THREAD_ID` corresponds to the `thread` field of error events.

  Within the Performance Schema, the `THREAD_ID` column in the `error_log` table is most similar to the `PROCESSLIST_ID` column of the `threads` table:

  + For foreground threads, `THREAD_ID` and `PROCESSLIST_ID` represent a connection identifier. This is the same value displayed in the `ID` column of the `INFORMATION_SCHEMA` `PROCESSLIST` table, displayed in the `Id` column of `SHOW PROCESSLIST` output, and returned by the `CONNECTION_ID()` function within the thread.

  + For background threads, `THREAD_ID` is 0 and `PROCESSLIST_ID` is `NULL`.

  Many Performance Schema tables other than `error_log` has a column named `THREAD_ID`, but in those tables, the `THREAD_ID` column is a value assigned internally by the Performance Schema.

* `PRIO`

  The event priority. Permitted values are `System`, `Error`, `Warning`, `Note`. The `PRIO` column is based on the `label` field of error events, which itself is based on the underlying numeric `prio` field value.

* `ERROR_CODE`

  The numeric event error code. `ERROR_CODE` corresponds to the `error_code` field of error events.

* `SUBSYSTEM`

  The subsystem in which the event occurred. `SUBSYSTEM` corresponds to the `subsystem` field of error events.

* `DATA`

  The text representation of the error event. The format of this value depends on the format produced by the log sink component that generates the `error_log` row. For example, if the log sink is `log_sink_internal` or `log_sink_json`, `DATA` values represent error events in traditional or JSON format, respectively. (See Section 7.4.2.9, “Error Log Output Format”.)

  Because the error log can be reconfigured to change the log sink component that supplies rows to the `error_log` table, and because different sinks produce different output formats, it is possible for rows written to the `error_log` table at different times to have different `DATA` formats.

The `error_log` table has these indexes:

* Primary key on (`LOGGED`)
* Index on (`THREAD_ID`)
* Index on (`PRIO`)
* Index on (`ERROR_CODE`)
* Index on (`SUBSYSTEM`)

`TRUNCATE TABLE` is not permitted for the `error_log` table.

##### Implementation and Configuration of the error\_log Table

The Performance Schema `error_log` table is populated by error log sink components that write to the table in addition to writing formatted error events to the error log. Performance Schema support by log sinks has two parts:

* A log sink can write new error events to the `error_log` table as they occur.

* A log sink can provide a parser for extraction of previously written error messages. This enables a server instance to read messages written to an error log file by the previous instance and store them in the `error_log` table. Messages written during shutdown by the previous instance may be useful for diagnosing why shutdown occurred.

Currently, the traditional-format `log_sink_internal` and JSON-format `log_sink_json` sinks support writing new events to the `error_log` table and provide a parser for reading previously written error log files.

The `log_error_services` system variable controls which log components to enable for error logging. Its value is a pipeline of log filter and log sink components to be executed in left-to-right order when error events occur. The `log_error_services` value pertains to populating the `error_log` table as follows:

* At startup, the server examines the `log_error_services` value and chooses from it the leftmost log sink that satisfies these conditions:

  + A sink that supports the `error_log` table and provides a parser.

  + If none, a sink that supports the `error_log` table but provides no parser.

  If no log sink satisfies those conditions, the `error_log` table remains empty. Otherwise, if the sink provides a parser and log configuration enables a previously written error log file to be found, the server uses the sink parser to read the last part of the file and writes the old events it contains to the table. The sink then writes new error events to the table as they occur.

* At runtime, if the value of `log_error_services` changes, the server again examines it, this time looking for the leftmost enabled log sink that supports the `error_log` table, regardless of whether it provides a parser.

  If no such log sink exists, no additional error events are written to the `error_log` table. Otherwise, the newly configured sink writes new error events to the table as they occur.

Any configuration that affects output written to the error log affects `error_log` table contents. This includes settings such as those for verbosity, message suppression, and message filtering. It also applies to information read at startup from a previous log file. For example, messages not written during a previous server instance configured with low verbosity do not become available if the file is read by a current instance configured with higher verbosity.

The `error_log` table is a view on a fixed-size, in-memory ring buffer, with old events automatically discarded as necessary to make room for new ones. As shown in the following table, several status variables provide information about ongoing `error_log` operation.

<table summary="error_log table status variables."><thead><tr> <th>Status Variable</th> <th>Meaning</th> </tr></thead><tbody><tr> <td><code>Error_log_buffered_bytes</code></td> <td>Bytes used in table</td> </tr><tr> <td><code>Error_log_buffered_events</code></td> <td>Events present in table</td> </tr><tr> <td><code>Error_log_expired_events</code></td> <td>Events discarded from table</td> </tr><tr> <td><code>Error_log_latest_write</code></td> <td>Time of last write to table</td> </tr></tbody></table>
