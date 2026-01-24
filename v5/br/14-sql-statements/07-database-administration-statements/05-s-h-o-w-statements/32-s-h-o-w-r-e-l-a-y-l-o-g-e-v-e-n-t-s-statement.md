#### 13.7.5.32 SHOW RELAYLOG EVENTS Statement

```sql
SHOW RELAYLOG EVENTS
    [IN 'log_name']
    [FROM pos]
    [LIMIT [offset,] row_count]
    [channel_option]

channel_option:
    FOR CHANNEL channel
```

Shows the events in the relay log of a replica. If you do not specify `'log_name'`, the first relay log is displayed. This statement has no effect on the source. [`SHOW RELAYLOG EVENTS`](show-relaylog-events.html "13.7.5.32 SHOW RELAYLOG EVENTS Statement") requires the [`REPLICATION SLAVE`](privileges-provided.html#priv_replication-slave) privilege.

The `LIMIT` clause has the same syntax as for the [`SELECT`](select.html "13.2.9 SELECT Statement") statement. See [Section 13.2.9, “SELECT Statement”](select.html "13.2.9 SELECT Statement").

Note

Issuing a [`SHOW RELAYLOG EVENTS`](show-relaylog-events.html "13.7.5.32 SHOW RELAYLOG EVENTS Statement") with no `LIMIT` clause could start a very time- and resource-consuming process because the server returns to the client the complete contents of the relay log (including all statements modifying data that have been received by the replica).

The optional `FOR CHANNEL channel` clause enables you to name which replication channel the statement applies to. Providing a `FOR CHANNEL channel` clause applies the statement to a specific replication channel. If no channel is named and no extra channels exist, the statement applies to the default channel.

When using multiple replication channels, if a [`SHOW RELAYLOG EVENTS`](show-relaylog-events.html "13.7.5.32 SHOW RELAYLOG EVENTS Statement") statement does not have a channel defined using a `FOR CHANNEL channel` clause an error is generated. See [Section 16.2.2, “Replication Channels”](replication-channels.html "16.2.2 Replication Channels") for more information.

[`SHOW RELAYLOG EVENTS`](show-relaylog-events.html "13.7.5.32 SHOW RELAYLOG EVENTS Statement") displays the following fields for each event in the relay log:

* `Log_name`

  The name of the file that is being listed.

* `Pos`

  The position at which the event occurs.

* `Event_type`

  An identifier that describes the event type.

* `Server_id`

  The server ID of the server on which the event originated.

* `End_log_pos`

  The value of `End_log_pos` for this event in the source's binary log.

* `Info`

  More detailed information about the event type. The format of this information depends on the event type.

Note

Some events relating to the setting of user and system variables are not included in the output from [`SHOW RELAYLOG EVENTS`](show-relaylog-events.html "13.7.5.32 SHOW RELAYLOG EVENTS Statement"). To get complete coverage of events within a relay log, use [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files").
