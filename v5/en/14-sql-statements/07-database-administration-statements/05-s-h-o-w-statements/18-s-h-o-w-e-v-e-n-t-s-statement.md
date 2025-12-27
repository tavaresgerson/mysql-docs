#### 13.7.5.18 SHOW EVENTS Statement

```sql
SHOW EVENTS
    [{FROM | IN} schema_name]
    [LIKE 'pattern' | WHERE expr]
```

This statement displays information about Event Manager events, which are discussed in [Section 23.4, “Using the Event Scheduler”](event-scheduler.html "23.4 Using the Event Scheduler"). It requires the [`EVENT`](privileges-provided.html#priv_event) privilege for the database from which the events are to be shown.

In its simplest form, [`SHOW EVENTS`](show-events.html "13.7.5.18 SHOW EVENTS Statement") lists all of the events in the current schema:

```sql
mysql> SELECT CURRENT_USER(), SCHEMA();
+----------------+----------+
| CURRENT_USER() | SCHEMA() |
+----------------+----------+
| jon@ghidora    | myschema |
+----------------+----------+
1 row in set (0.00 sec)

mysql> SHOW EVENTS\G
*************************** 1. row ***************************
                  Db: myschema
                Name: e_daily
             Definer: jon@ghidora
           Time zone: SYSTEM
                Type: RECURRING
          Execute at: NULL
      Interval value: 1
      Interval field: DAY
              Starts: 2018-08-08 11:06:34
                Ends: NULL
              Status: ENABLED
          Originator: 1
character_set_client: utf8
collation_connection: utf8_general_ci
  Database Collation: latin1_swedish_ci
```

To see events for a specific schema, use the `FROM` clause. For example, to see events for the `test` schema, use the following statement:

```sql
SHOW EVENTS FROM test;
```

The [`LIKE`](string-comparison-functions.html#operator_like) clause, if present, indicates which event names to match. The `WHERE` clause can be given to select rows using more general conditions, as discussed in [Section 24.8, “Extensions to SHOW Statements”](extended-show.html "24.8 Extensions to SHOW Statements").

[`SHOW EVENTS`](show-events.html "13.7.5.18 SHOW EVENTS Statement") output has these columns:

* `Db`

  The name of the schema (database) to which the event belongs.

* `Name`

  The name of the event.

* `Definer`

  The account of the user who created the event, in `'user_name'@'host_name'` format.

* `Time zone`

  The event time zone, which is the time zone used for scheduling the event and that is in effect within the event as it executes. The default value is `SYSTEM`.

* `Type`

  The event repetition type, either `ONE TIME` (transient) or `RECURRING` (repeating).

* `Execute At`

  For a one-time event, this is the [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") value specified in the `AT` clause of the [`CREATE EVENT`](create-event.html "13.1.12 CREATE EVENT Statement") statement used to create the event, or of the last [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement") statement that modified the event. The value shown in this column reflects the addition or subtraction of any `INTERVAL` value included in the event's `AT` clause. For example, if an event is created using `ON SCHEDULE AT CURRENT_TIMESTAMP + '1:6' DAY_HOUR`, and the event was created at 2018-02-09 14:05:30, the value shown in this column would be `'2018-02-10 20:05:30'`. If the event's timing is determined by an `EVERY` clause instead of an `AT` clause (that is, if the event is recurring), the value of this column is `NULL`.

* `Interval Value`

  For a recurring event, the number of intervals to wait between event executions. For a transient event, the value of this column is always `NULL`.

* `Interval Field`

  The time units used for the interval which a recurring event waits before repeating. For a transient event, the value of this column is always `NULL`.

* `Starts`

  The start date and time for a recurring event. This is displayed as a [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") value, and is `NULL` if no start date and time are defined for the event. For a transient event, this column is always `NULL`. For a recurring event whose definition includes a `STARTS` clause, this column contains the corresponding [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") value. As with the `Execute At` column, this value resolves any expressions used. If there is no `STARTS` clause affecting the timing of the event, this column is `NULL`

* `Ends`

  For a recurring event whose definition includes a `ENDS` clause, this column contains the corresponding [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") value. As with the `Execute At` column, this value resolves any expressions used. If there is no `ENDS` clause affecting the timing of the event, this column is `NULL`.

* `Status`

  The event status. One of `ENABLED`, `DISABLED`, or `SLAVESIDE_DISABLED`. `SLAVESIDE_DISABLED` indicates that the creation of the event occurred on another MySQL server acting as a replication source and replicated to the current MySQL server which is acting as a replica, but the event is not presently being executed on the replica. For more information, see [Section 16.4.1.16, “Replication of Invoked Features”](replication-features-invoked.html "16.4.1.16 Replication of Invoked Features"). information.

* `Originator`

  The server ID of the MySQL server on which the event was created; used in replication. This value may be updated by [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement") to the server ID of the server on which that statement occurs, if executed on a source server. The default value is 0.

* `character_set_client`

  The session value of the [`character_set_client`](server-system-variables.html#sysvar_character_set_client) system variable when the event was created.

* `collation_connection`

  The session value of the [`collation_connection`](server-system-variables.html#sysvar_collation_connection) system variable when the event was created.

* `Database Collation`

  The collation of the database with which the event is associated.

For more information about `SLAVESIDE_DISABLED` and the `Originator` column, see [Section 16.4.1.16, “Replication of Invoked Features”](replication-features-invoked.html "16.4.1.16 Replication of Invoked Features").

Times displayed by [`SHOW EVENTS`](show-events.html "13.7.5.18 SHOW EVENTS Statement") are given in the event time zone, as discussed in [Section 23.4.4, “Event Metadata”](events-metadata.html "23.4.4 Event Metadata").

Event information is also available from the `INFORMATION_SCHEMA` [`EVENTS`](information-schema-events-table.html "24.3.8 The INFORMATION_SCHEMA EVENTS Table") table. See [Section 24.3.8, “The INFORMATION\_SCHEMA EVENTS Table”](information-schema-events-table.html "24.3.8 The INFORMATION_SCHEMA EVENTS Table").

The event action statement is not shown in the output of [`SHOW EVENTS`](show-events.html "13.7.5.18 SHOW EVENTS Statement"). Use [`SHOW CREATE EVENT`](show-create-event.html "13.7.5.7 SHOW CREATE EVENT Statement") or the `INFORMATION_SCHEMA` [`EVENTS`](information-schema-events-table.html "24.3.8 The INFORMATION_SCHEMA EVENTS Table") table.
