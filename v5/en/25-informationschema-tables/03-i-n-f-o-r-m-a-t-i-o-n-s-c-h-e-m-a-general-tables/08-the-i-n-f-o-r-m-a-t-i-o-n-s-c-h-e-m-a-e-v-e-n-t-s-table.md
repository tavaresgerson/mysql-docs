### 24.3.8 The INFORMATION\_SCHEMA EVENTS Table

The [`EVENTS`](information-schema-events-table.html "24.3.8 The INFORMATION_SCHEMA EVENTS Table") table provides information about Event Manager events, which are discussed in [Section 23.4, “Using the Event Scheduler”](event-scheduler.html "23.4 Using the Event Scheduler").

The [`EVENTS`](information-schema-events-table.html "24.3.8 The INFORMATION_SCHEMA EVENTS Table") table has these columns:

* `EVENT_CATALOG`

  The name of the catalog to which the event belongs. This value is always `def`.

* `EVENT_SCHEMA`

  The name of the schema (database) to which the event belongs.

* `EVENT_NAME`

  The name of the event.

* `DEFINER`

  The account named in the `DEFINER` clause (often the user who created the event), in `'user_name'@'host_name'` format.

* `TIME_ZONE`

  The event time zone, which is the time zone used for scheduling the event and that is in effect within the event as it executes. The default value is `SYSTEM`.

* `EVENT_BODY`

  The language used for the statements in the event's [`DO`](do.html "13.2.3 DO Statement") clause. The value is always `SQL`.

* `EVENT_DEFINITION`

  The text of the SQL statement making up the event's [`DO`](do.html "13.2.3 DO Statement") clause; in other words, the statement executed by this event.

* `EVENT_TYPE`

  The event repetition type, either `ONE TIME` (transient) or `RECURRING` (repeating).

* `EXECUTE_AT`

  For a one-time event, this is the [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") value specified in the `AT` clause of the [`CREATE EVENT`](create-event.html "13.1.12 CREATE EVENT Statement") statement used to create the event, or of the last [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement") statement that modified the event. The value shown in this column reflects the addition or subtraction of any `INTERVAL` value included in the event's `AT` clause. For example, if an event is created using `ON SCHEDULE AT CURRENT_TIMESTAMP + '1:6' DAY_HOUR`, and the event was created at 2018-02-09 14:05:30, the value shown in this column would be `'2018-02-10 20:05:30'`. If the event's timing is determined by an `EVERY` clause instead of an `AT` clause (that is, if the event is recurring), the value of this column is `NULL`.

* `INTERVAL_VALUE`

  For a recurring event, the number of intervals to wait between event executions. For a transient event, the value is always `NULL`.

* `INTERVAL_FIELD`

  The time units used for the interval which a recurring event waits before repeating. For a transient event, the value is always `NULL`.

* `SQL_MODE`

  The SQL mode in effect when the event was created or altered, and under which the event executes. For the permitted values, see [Section 5.1.10, “Server SQL Modes”](sql-mode.html "5.1.10 Server SQL Modes").

* `STARTS`

  The start date and time for a recurring event. This is displayed as a [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") value, and is `NULL` if no start date and time are defined for the event. For a transient event, this column is always `NULL`. For a recurring event whose definition includes a `STARTS` clause, this column contains the corresponding [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") value. As with the `EXECUTE_AT` column, this value resolves any expressions used. If there is no `STARTS` clause affecting the timing of the event, this column is `NULL`

* `ENDS`

  For a recurring event whose definition includes a `ENDS` clause, this column contains the corresponding [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") value. As with the `EXECUTE_AT` column, this value resolves any expressions used. If there is no `ENDS` clause affecting the timing of the event, this column is `NULL`.

* `STATUS`

  The event status. One of `ENABLED`, `DISABLED`, or `SLAVESIDE_DISABLED`. `SLAVESIDE_DISABLED` indicates that the creation of the event occurred on another MySQL server acting as a replication source and replicated to the current MySQL server which is acting as a replica, but the event is not presently being executed on the replica. For more information, see [Section 16.4.1.16, “Replication of Invoked Features”](replication-features-invoked.html "16.4.1.16 Replication of Invoked Features"). information.

* `ON_COMPLETION`

  One of the two values `PRESERVE` or `NOT PRESERVE`.

* `CREATED`

  The date and time when the event was created. This is a [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") value.

* `LAST_ALTERED`

  The date and time when the event was last modified. This is a [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") value. If the event has not been modified since its creation, this value is the same as the `CREATED` value.

* `LAST_EXECUTED`

  The date and time when the event last executed. This is a [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") value. If the event has never executed, this column is `NULL`.

  `LAST_EXECUTED` indicates when the event started. As a result, the `ENDS` column is never less than `LAST_EXECUTED`.

* `EVENT_COMMENT`

  The text of the comment, if the event has one. If not, this value is empty.

* `ORIGINATOR`

  The server ID of the MySQL server on which the event was created; used in replication. This value may be updated by [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement") to the server ID of the server on which that statement occurs, if executed on a replication source. The default value is 0.

* `CHARACTER_SET_CLIENT`

  The session value of the [`character_set_client`](server-system-variables.html#sysvar_character_set_client) system variable when the event was created.

* `COLLATION_CONNECTION`

  The session value of the [`collation_connection`](server-system-variables.html#sysvar_collation_connection) system variable when the event was created.

* `DATABASE_COLLATION`

  The collation of the database with which the event is associated.

#### Notes

* [`EVENTS`](information-schema-events-table.html "24.3.8 The INFORMATION_SCHEMA EVENTS Table") is a nonstandard `INFORMATION_SCHEMA` table.

* Times in the [`EVENTS`](information-schema-events-table.html "24.3.8 The INFORMATION_SCHEMA EVENTS Table") table are displayed using the event time zone, the current session time zone, or UTC, as described in [Section 23.4.4, “Event Metadata”](events-metadata.html "23.4.4 Event Metadata").

* For more information about `SLAVESIDE_DISABLED` and the `ORIGINATOR` column, see [Section 16.4.1.16, “Replication of Invoked Features”](replication-features-invoked.html "16.4.1.16 Replication of Invoked Features").

#### Example

Suppose that the user `'jon'@'ghidora'` creates an event named `e_daily`, and then modifies it a few minutes later using an [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement") statement, as shown here:

```sql
DELIMITER |

CREATE EVENT e_daily
    ON SCHEDULE
      EVERY 1 DAY
    COMMENT 'Saves total number of sessions then clears the table each day'
    DO
      BEGIN
        INSERT INTO site_activity.totals (time, total)
          SELECT CURRENT_TIMESTAMP, COUNT(*)
            FROM site_activity.sessions;
        DELETE FROM site_activity.sessions;
      END |

DELIMITER ;

ALTER EVENT e_daily
    ENABLE;
```

(Note that comments can span multiple lines.)

This user can then run the following [`SELECT`](select.html "13.2.9 SELECT Statement") statement, and obtain the output shown:

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.EVENTS
       WHERE EVENT_NAME = 'e_daily'
       AND EVENT_SCHEMA = 'myschema'\G
*************************** 1. row ***************************
       EVENT_CATALOG: def
        EVENT_SCHEMA: myschema
          EVENT_NAME: e_daily
             DEFINER: jon@ghidora
           TIME_ZONE: SYSTEM
          EVENT_BODY: SQL
    EVENT_DEFINITION: BEGIN
        INSERT INTO site_activity.totals (time, total)
          SELECT CURRENT_TIMESTAMP, COUNT(*)
            FROM site_activity.sessions;
        DELETE FROM site_activity.sessions;
      END
          EVENT_TYPE: RECURRING
          EXECUTE_AT: NULL
      INTERVAL_VALUE: 1
      INTERVAL_FIELD: DAY
            SQL_MODE: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
                      NO_ZERO_IN_DATE,NO_ZERO_DATE,
                      ERROR_FOR_DIVISION_BY_ZERO,
                      NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION
              STARTS: 2018-08-08 11:06:34
                ENDS: NULL
              STATUS: ENABLED
       ON_COMPLETION: NOT PRESERVE
             CREATED: 2018-08-08 11:06:34
        LAST_ALTERED: 2018-08-08 11:06:34
       LAST_EXECUTED: 2018-08-08 16:06:34
       EVENT_COMMENT: Saves total number of sessions then clears the
                      table each day
          ORIGINATOR: 1
CHARACTER_SET_CLIENT: utf8
COLLATION_CONNECTION: utf8_general_ci
  DATABASE_COLLATION: latin1_swedish_ci
```

Event information is also available from the [`SHOW EVENTS`](show-events.html "13.7.5.18 SHOW EVENTS Statement") statement. See [Section 13.7.5.18, “SHOW EVENTS Statement”](show-events.html "13.7.5.18 SHOW EVENTS Statement"). The following statements are equivalent:

```sql
SELECT
    EVENT_SCHEMA, EVENT_NAME, DEFINER, TIME_ZONE, EVENT_TYPE, EXECUTE_AT,
    INTERVAL_VALUE, INTERVAL_FIELD, STARTS, ENDS, STATUS, ORIGINATOR,
    CHARACTER_SET_CLIENT, COLLATION_CONNECTION, DATABASE_COLLATION
  FROM INFORMATION_SCHEMA.EVENTS
  WHERE table_schema = 'db_name'
  [AND column_name LIKE 'wild']

SHOW EVENTS
  [FROM db_name]
  [LIKE 'wild']
```
