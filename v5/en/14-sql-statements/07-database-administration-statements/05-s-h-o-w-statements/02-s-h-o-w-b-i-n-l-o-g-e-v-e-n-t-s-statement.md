#### 13.7.5.2 SHOW BINLOG EVENTS Statement

```sql
SHOW BINLOG EVENTS
   [IN 'log_name']
   [FROM pos]
   [LIMIT [offset,] row_count]
```

Shows the events in the binary log. If you do not specify `'log_name'`, the first binary log is displayed. [`SHOW BINLOG EVENTS`](show-binlog-events.html "13.7.5.2 SHOW BINLOG EVENTS Statement") requires the [`REPLICATION SLAVE`](privileges-provided.html#priv_replication-slave) privilege.

The `LIMIT` clause has the same syntax as for the [`SELECT`](select.html "13.2.9 SELECT Statement") statement. See [Section 13.2.9, “SELECT Statement”](select.html "13.2.9 SELECT Statement").

Note

Issuing a [`SHOW BINLOG EVENTS`](show-binlog-events.html "13.7.5.2 SHOW BINLOG EVENTS Statement") with no `LIMIT` clause could start a very time- and resource-consuming process because the server returns to the client the complete contents of the binary log (which includes all statements executed by the server that modify data). As an alternative to [`SHOW BINLOG EVENTS`](show-binlog-events.html "13.7.5.2 SHOW BINLOG EVENTS Statement"), use the [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files") utility to save the binary log to a text file for later examination and analysis. See [Section 4.6.7, “mysqlbinlog — Utility for Processing Binary Log Files”](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files").

[`SHOW BINLOG EVENTS`](show-binlog-events.html "13.7.5.2 SHOW BINLOG EVENTS Statement") displays the following fields for each event in the binary log:

* `Log_name`

  The name of the file that is being listed.

* `Pos`

  The position at which the event occurs.

* `Event_type`

  An identifier that describes the event type.

* `Server_id`

  The server ID of the server on which the event originated.

* `End_log_pos`

  The position at which the next event begins, which is equal to `Pos` plus the size of the event.

* `Info`

  More detailed information about the event type. The format of this information depends on the event type.

Note

Some events relating to the setting of user and system variables are not included in the output from [`SHOW BINLOG EVENTS`](show-binlog-events.html "13.7.5.2 SHOW BINLOG EVENTS Statement"). To get complete coverage of events within a binary log, use [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files").

Note

[`SHOW BINLOG EVENTS`](show-binlog-events.html "13.7.5.2 SHOW BINLOG EVENTS Statement") does *not* work with relay log files. You can use [`SHOW RELAYLOG EVENTS`](show-relaylog-events.html "13.7.5.32 SHOW RELAYLOG EVENTS Statement") for this purpose.
