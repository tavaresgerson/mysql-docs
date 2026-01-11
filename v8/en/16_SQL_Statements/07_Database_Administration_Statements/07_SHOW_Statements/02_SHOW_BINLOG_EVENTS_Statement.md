#### 15.7.7.2 SHOW BINLOG EVENTS Statement

```
SHOW BINLOG EVENTS
   [IN 'log_name']
   [FROM pos]
   [LIMIT [offset,] row_count]
```

Shows the events in the binary log. If you do not specify `'log_name'`, the first binary log is displayed. `SHOW BINLOG EVENTS` requires the `REPLICATION SLAVE` privilege.

The `LIMIT` clause has the same syntax as for the `SELECT` statement. See Section 15.2.13, “SELECT Statement”.

Note

Issuing a `SHOW BINLOG EVENTS` with no `LIMIT` clause could start a very time- and resource-consuming process because the server returns to the client the complete contents of the binary log (which includes all statements executed by the server that modify data). As an alternative to `SHOW BINLOG EVENTS`, use the **mysqlbinlog** utility to save the binary log to a text file for later examination and analysis. See Section 6.6.9, “mysqlbinlog — Utility for Processing Binary Log Files”.

`SHOW BINLOG EVENTS` displays the following fields for each event in the binary log:

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

For compressed transaction payloads, the `Transaction_payload_event` is first printed as a single unit, then it is unpacked and each event inside it is printed.

Some events relating to the setting of user and system variables are not included in the output from `SHOW BINLOG EVENTS`. To get complete coverage of events within a binary log, use **mysqlbinlog**.

`SHOW BINLOG EVENTS` does *not* work with relay log files. You can use `SHOW RELAYLOG EVENTS` for this purpose.
