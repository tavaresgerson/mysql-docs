#### 16.4.1.16 Replication of Invoked Features

Replication of invoked features such as loadable functions and stored programs (stored procedures and functions, triggers, and events) provides the following characteristics:

* The effects of the feature are always replicated.
* The following statements are replicated using statement-based replication:

  + [`CREATE EVENT`](create-event.html "13.1.12 CREATE EVENT Statement")
  + [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement")
  + [`DROP EVENT`](drop-event.html "13.1.23 DROP EVENT Statement")
  + [`CREATE PROCEDURE`](create-procedure.html "13.1.16 CREATE PROCEDURE and CREATE FUNCTION Statements")
  + [`DROP PROCEDURE`](drop-procedure.html "13.1.27 DROP PROCEDURE and DROP FUNCTION Statements")
  + [`CREATE FUNCTION`](create-function.html "13.1.13 CREATE FUNCTION Statement")
  + [`DROP FUNCTION`](drop-function.html "13.1.24 DROP FUNCTION Statement")
  + [`CREATE TRIGGER`](create-trigger.html "13.1.20 CREATE TRIGGER Statement")
  + [`DROP TRIGGER`](drop-trigger.html "13.1.31 DROP TRIGGER Statement")

  However, the *effects* of features created, modified, or dropped using these statements are replicated using row-based replication.

  Note

  Attempting to replicate invoked features using statement-based replication produces the warning Statement is not safe to log in statement format. For example, trying to replicate a loadable function with statement-based replication generates this warning because it currently cannot be determined by the MySQL server whether the function is deterministic. If you are absolutely certain that the invoked feature's effects are deterministic, you can safely disregard such warnings.

* In the case of [`CREATE EVENT`](create-event.html "13.1.12 CREATE EVENT Statement") and [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement"):

  + The status of the event is set to `SLAVESIDE_DISABLED` on the replica regardless of the state specified (this does not apply to [`DROP EVENT`](drop-event.html "13.1.23 DROP EVENT Statement")).

  + The source on which the event was created is identified on the replica by its server ID. The `ORIGINATOR` column in the Information Schema [`EVENTS`](information-schema-events-table.html "24.3.8 The INFORMATION_SCHEMA EVENTS Table") table and the `originator` column in `mysql.event` store this information. See [Section 24.3.8, “The INFORMATION_SCHEMA EVENTS Table”](information-schema-events-table.html "24.3.8 The INFORMATION_SCHEMA EVENTS Table"), and [Section 13.7.5.18, “SHOW EVENTS Statement”](show-events.html "13.7.5.18 SHOW EVENTS Statement"), for more information.

* The feature implementation resides on the replica in a renewable state so that if the source fails, the replica can be used as the source without loss of event processing.

To determine whether there are any scheduled events on a MySQL server that were created on a different server (that was acting as a replication source server), query the Information Schema [`EVENTS`](information-schema-events-table.html "24.3.8 The INFORMATION_SCHEMA EVENTS Table") table in a manner similar to what is shown here:

```sql
SELECT EVENT_SCHEMA, EVENT_NAME
    FROM INFORMATION_SCHEMA.EVENTS
    WHERE STATUS = 'SLAVESIDE_DISABLED';
```

Alternatively, you can use the [`SHOW EVENTS`](show-events.html "13.7.5.18 SHOW EVENTS Statement") statement, like this:

```sql
SHOW EVENTS
    WHERE STATUS = 'SLAVESIDE_DISABLED';
```

When promoting a replica having such events to a replication source server, you must enable each event using [`ALTER EVENT event_name ENABLE`](alter-event.html "13.1.2 ALTER EVENT Statement"), where *`event_name`* is the name of the event.

If more than one source was involved in creating events on this replica, and you wish to identify events that were created only on a given source having the server ID *`source_id`*, modify the previous query on the [`EVENTS`](information-schema-events-table.html "24.3.8 The INFORMATION_SCHEMA EVENTS Table") table to include the `ORIGINATOR` column, as shown here:

```sql
SELECT EVENT_SCHEMA, EVENT_NAME, ORIGINATOR
    FROM INFORMATION_SCHEMA.EVENTS
    WHERE STATUS = 'SLAVESIDE_DISABLED'
    AND   ORIGINATOR = 'source_id'
```

You can employ `ORIGINATOR` with the [`SHOW EVENTS`](show-events.html "13.7.5.18 SHOW EVENTS Statement") statement in a similar fashion:

```sql
SHOW EVENTS
    WHERE STATUS = 'SLAVESIDE_DISABLED'
    AND   ORIGINATOR = 'source_id'
```

Before enabling events that were replicated from the source, you should disable the MySQL Event Scheduler on the replica (using a statement such as `SET GLOBAL event_scheduler = OFF;`), run any necessary [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement") statements, restart the server, then re-enable the Event Scheduler on the replica afterward (using a statement such as `SET GLOBAL event_scheduler = ON;`)-

If you later demote the new source back to being a replica, you must disable manually all events enabled by the [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement") statements. You can do this by storing in a separate table the event names from the [`SELECT`](select.html "13.2.9 SELECT Statement") statement shown previously, or using [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement") statements to rename the events with a common prefix such as `replicated_` to identify them.

If you rename the events, then when demoting this server back to being a replica, you can identify the events by querying the [`EVENTS`](information-schema-events-table.html "24.3.8 The INFORMATION_SCHEMA EVENTS Table") table, as shown here:

```sql
SELECT CONCAT(EVENT_SCHEMA, '.', EVENT_NAME) AS 'Db.Event'
      FROM INFORMATION_SCHEMA.EVENTS
      WHERE INSTR(EVENT_NAME, 'replicated_') = 1;
```
