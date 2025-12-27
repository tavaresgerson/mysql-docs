### 25.12.4 Performance Schema Wait Event Tables

[25.12.4.1 The events\_waits\_current Table](performance-schema-events-waits-current-table.html)

[25.12.4.2 The events\_waits\_history Table](performance-schema-events-waits-history-table.html)

[25.12.4.3 The events\_waits\_history\_long Table](performance-schema-events-waits-history-long-table.html)

The Performance Schema instruments waits, which are events that take time. Within the event hierarchy, wait events nest within stage events, which nest within statement events, which nest within transaction events.

These tables store wait events:

* [`events_waits_current`](performance-schema-events-waits-current-table.html "25.12.4.1 The events_waits_current Table"): The current wait event for each thread.

* [`events_waits_history`](performance-schema-events-waits-history-table.html "25.12.4.2 The events_waits_history Table"): The most recent wait events that have ended per thread.

* [`events_waits_history_long`](performance-schema-events-waits-history-long-table.html "25.12.4.3 The events_waits_history_long Table"): The most recent wait events that have ended globally (across all threads).

The following sections describe the wait event tables. There are also summary tables that aggregate information about wait events; see [Section 25.12.15.1, “Wait Event Summary Tables”](performance-schema-wait-summary-tables.html "25.12.15.1 Wait Event Summary Tables").

For more information about the relationship between the three wait event tables, see [Section 25.9, “Performance Schema Tables for Current and Historical Events”](performance-schema-event-tables.html "25.9 Performance Schema Tables for Current and Historical Events").

#### Configuring Wait Event Collection

To control whether to collect wait events, set the state of the relevant instruments and consumers:

* The [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") table contains instruments with names that begin with `wait`. Use these instruments to enable or disable collection of individual wait event classes.

* The [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table") table contains consumer values with names corresponding to the current and historical wait event table names. Use these consumers to filter collection of wait events.

Some wait instruments are enabled by default; others are disabled. For example:

```sql
mysql> SELECT * FROM performance_schema.setup_instruments
       WHERE NAME LIKE 'wait/io/file/innodb%';
+--------------------------------------+---------+-------+
| NAME                                 | ENABLED | TIMED |
+--------------------------------------+---------+-------+
| wait/io/file/innodb/innodb_data_file | YES     | YES   |
| wait/io/file/innodb/innodb_log_file  | YES     | YES   |
| wait/io/file/innodb/innodb_temp_file | YES     | YES   |
+--------------------------------------+---------+-------+
mysql> SELECT *
       FROM performance_schema.setup_instruments WHERE
       NAME LIKE 'wait/io/socket/%';
+----------------------------------------+---------+-------+
| NAME                                   | ENABLED | TIMED |
+----------------------------------------+---------+-------+
| wait/io/socket/sql/server_tcpip_socket | NO      | NO    |
| wait/io/socket/sql/server_unix_socket  | NO      | NO    |
| wait/io/socket/sql/client_connection   | NO      | NO    |
+----------------------------------------+---------+-------+
```

The wait consumers are disabled by default:

```sql
mysql> SELECT *
       FROM performance_schema.setup_consumers
       WHERE NAME LIKE 'events_waits%';
+---------------------------+---------+
| NAME                      | ENABLED |
+---------------------------+---------+
| events_waits_current      | NO      |
| events_waits_history      | NO      |
| events_waits_history_long | NO      |
+---------------------------+---------+
```

To control wait event collection at server startup, use lines like these in your `my.cnf` file:

* Enable:

  ```sql
  [mysqld]
  performance-schema-instrument='wait/%=ON'
  performance-schema-consumer-events-waits-current=ON
  performance-schema-consumer-events-waits-history=ON
  performance-schema-consumer-events-waits-history-long=ON
  ```

* Disable:

  ```sql
  [mysqld]
  performance-schema-instrument='wait/%=OFF'
  performance-schema-consumer-events-waits-current=OFF
  performance-schema-consumer-events-waits-history=OFF
  performance-schema-consumer-events-waits-history-long=OFF
  ```

To control wait event collection at runtime, update the [`setup_instruments`](performance-schema-setup-instruments-table.html "25.12.2.3 The setup_instruments Table") and [`setup_consumers`](performance-schema-setup-consumers-table.html "25.12.2.2 The setup_consumers Table") tables:

* Enable:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'YES', TIMED = 'YES'
  WHERE NAME LIKE 'wait/%';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'YES'
  WHERE NAME LIKE 'events_waits%';
  ```

* Disable:

  ```sql
  UPDATE performance_schema.setup_instruments
  SET ENABLED = 'NO', TIMED = 'NO'
  WHERE NAME LIKE 'wait/%';

  UPDATE performance_schema.setup_consumers
  SET ENABLED = 'NO'
  WHERE NAME LIKE 'events_waits%';
  ```

To collect only specific wait events, enable only the corresponding wait instruments. To collect wait events only for specific wait event tables, enable the wait instruments but only the wait consumers corresponding to the desired tables.

The [`setup_timers`](performance-schema-setup-timers-table.html "25.12.2.5 The setup_timers Table") table contains a row with a `NAME` value of `wait` that indicates the unit for wait event timing. The default unit is `CYCLE`:

```sql
mysql> SELECT *
       FROM performance_schema.setup_timers
       WHERE NAME = 'wait';
+------+------------+
| NAME | TIMER_NAME |
+------+------------+
| wait | CYCLE      |
+------+------------+
```

To change the timing unit, modify the `TIMER_NAME` value:

```sql
UPDATE performance_schema.setup_timers
SET TIMER_NAME = 'NANOSECOND'
WHERE NAME = 'wait';
```

For additional information about configuring event collection, see [Section 25.3, “Performance Schema Startup Configuration”](performance-schema-startup-configuration.html "25.3 Performance Schema Startup Configuration"), and [Section 25.4, “Performance Schema Runtime Configuration”](performance-schema-runtime-configuration.html "25.4 Performance Schema Runtime Configuration").
