### 23.4.6 The Event Scheduler and MySQL Privileges

To enable or disable the execution of scheduled events, it is
necessary to set the value of the global
[`event_scheduler`](server-system-variables.html#sysvar_event_scheduler) system variable.
This requires privileges sufficient to set global system
variables. See [Section 5.1.8.1, “System Variable Privileges”](system-variable-privileges.html "5.1.8.1 System Variable Privileges").

The [`EVENT`](privileges-provided.html#priv_event) privilege governs the
creation, modification, and deletion of events. This privilege can
be bestowed using [`GRANT`](grant.html "13.7.1.4 GRANT Statement"). For
example, this [`GRANT`](grant.html "13.7.1.4 GRANT Statement") statement
confers the [`EVENT`](privileges-provided.html#priv_event) privilege for the
schema named `myschema` on the user
`jon@ghidora`:

```sql
GRANT EVENT ON myschema.* TO jon@ghidora;
```

(We assume that this user account already exists, and that we wish
for it to remain unchanged otherwise.)

To grant this same user the [`EVENT`](privileges-provided.html#priv_event)
privilege on all schemas, use the following statement:

```sql
GRANT EVENT ON *.* TO jon@ghidora;
```

The [`EVENT`](privileges-provided.html#priv_event) privilege has global or
schema-level scope. Therefore, trying to grant it on a single
table results in an error as shown:

```sql
mysql> GRANT EVENT ON myschema.mytable TO jon@ghidora;
ERROR 1144 (42000): Illegal GRANT/REVOKE command; please
consult the manual to see which privileges can be used
```

It is important to understand that an event is executed with the
privileges of its definer, and that it cannot perform any actions
for which its definer does not have the requisite privileges. For
example, suppose that `jon@ghidora` has the
[`EVENT`](privileges-provided.html#priv_event) privilege for
`myschema`. Suppose also that this user has the
[`SELECT`](privileges-provided.html#priv_select) privilege for
`myschema`, but no other privileges for this
schema. It is possible for `jon@ghidora` to
create a new event such as this one:

```sql
CREATE EVENT e_store_ts
    ON SCHEDULE
      EVERY 10 SECOND
    DO
      INSERT INTO myschema.mytable VALUES (UNIX_TIMESTAMP());
```

The user waits for a minute or so, and then performs a
`SELECT * FROM mytable;` query, expecting to see
several new rows in the table. Instead, the table is empty. Since
the user does not have the [`INSERT`](privileges-provided.html#priv_insert)
privilege for the table in question, the event has no effect.

If you inspect the MySQL error log
(`hostname.err`),
you can see that the event is executing, but the action it is
attempting to perform fails:

```sql
2013-09-24T12:41:31.261992Z 25 [ERROR] Event Scheduler:
[jon@ghidora][cookbook.e_store_ts] INSERT command denied to user
'jon'@'ghidora' for table 'mytable'
2013-09-24T12:41:31.262022Z 25 [Note] Event Scheduler:
[jon@ghidora].[myschema.e_store_ts] event execution failed.
2013-09-24T12:41:41.271796Z 26 [ERROR] Event Scheduler:
[jon@ghidora][cookbook.e_store_ts] INSERT command denied to user
'jon'@'ghidora' for table 'mytable'
2013-09-24T12:41:41.272761Z 26 [Note] Event Scheduler:
[jon@ghidora].[myschema.e_store_ts] event execution failed.
```

Since this user very likely does not have access to the error log,
it is possible to verify whether the event's action statement is
valid by executing it directly:

```sql
mysql> INSERT INTO myschema.mytable VALUES (UNIX_TIMESTAMP());
ERROR 1142 (42000): INSERT command denied to user
'jon'@'ghidora' for table 'mytable'
```

Inspection of the Information Schema
[`EVENTS`](information-schema-events-table.html "24.3.8 The INFORMATION_SCHEMA EVENTS Table") table shows that
`e_store_ts` exists and is enabled, but its
`LAST_EXECUTED` column is
`NULL`:

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.EVENTS
     >     WHERE EVENT_NAME='e_store_ts'
     >     AND EVENT_SCHEMA='myschema'\G
*************************** 1. row ***************************
   EVENT_CATALOG: NULL
    EVENT_SCHEMA: myschema
      EVENT_NAME: e_store_ts
         DEFINER: jon@ghidora
      EVENT_BODY: SQL
EVENT_DEFINITION: INSERT INTO myschema.mytable VALUES (UNIX_TIMESTAMP())
      EVENT_TYPE: RECURRING
      EXECUTE_AT: NULL
  INTERVAL_VALUE: 5
  INTERVAL_FIELD: SECOND
        SQL_MODE: NULL
          STARTS: 0000-00-00 00:00:00
            ENDS: 0000-00-00 00:00:00
          STATUS: ENABLED
   ON_COMPLETION: NOT PRESERVE
         CREATED: 2006-02-09 22:36:06
    LAST_ALTERED: 2006-02-09 22:36:06
   LAST_EXECUTED: NULL
   EVENT_COMMENT:
1 row in set (0.00 sec)
```

To rescind the [`EVENT`](privileges-provided.html#priv_event) privilege, use
the [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement") statement. In this
example, the [`EVENT`](privileges-provided.html#priv_event) privilege on the
schema `myschema` is removed from the
`jon@ghidora` user account:

```sql
REVOKE EVENT ON myschema.* FROM jon@ghidora;
```

Important

Revoking the [`EVENT`](privileges-provided.html#priv_event) privilege from
a user does not delete or disable any events that may have been
created by that user.

An event is not migrated or dropped as a result of renaming or
dropping the user who created it.

Suppose that the user `jon@ghidora` has been
granted the [`EVENT`](privileges-provided.html#priv_event) and
[`INSERT`](privileges-provided.html#priv_insert) privileges on the
`myschema` schema. This user then creates the
following event:

```sql
CREATE EVENT e_insert
    ON SCHEDULE
      EVERY 7 SECOND
    DO
      INSERT INTO myschema.mytable;
```

After this event has been created, `root` revokes
the [`EVENT`](privileges-provided.html#priv_event) privilege for
`jon@ghidora`. However,
`e_insert` continues to execute, inserting a new
row into `mytable` each seven seconds. The same
would be true if `root` had issued either of
these statements:

* `DROP USER jon@ghidora;`
* `RENAME USER jon@ghidora TO
  someotherguy@ghidora;`

You can verify that this is true by examining the
`mysql.event` table (discussed later in this
section) or the Information Schema
[`EVENTS`](information-schema-events-table.html "24.3.8 The INFORMATION_SCHEMA EVENTS Table") table before and after issuing
a [`DROP USER`](drop-user.html "13.7.1.3 DROP USER Statement") or
[`RENAME USER`](rename-user.html "13.7.1.5 RENAME USER Statement") statement.

Event definitions are stored in the `mysql.event`
table. To drop an event created by another user account, the MySQL
`root` user (or another user with the necessary
privileges) can delete rows from this table. For example, to
remove the event `e_insert` shown previously,
`root` can use the following statement:

```sql
DELETE FROM mysql.event
    WHERE db = 'myschema'
      AND name = 'e_insert';
```

It is very important to match the event name and database schema
name when deleting rows from the `mysql.event`
table. This is because different events of the same name can exist
in different schemas.

Users' [`EVENT`](privileges-provided.html#priv_event) privileges are stored
in the `Event_priv` columns of the
`mysql.user` and `mysql.db`
tables. In both cases, this column holds one of the values
'`Y`' or '`N`'.
'`N`' is the default.
`mysql.user.Event_priv` is set to
'`Y`' for a given user only if that user has the
global [`EVENT`](privileges-provided.html#priv_event) privilege (that is, if
the privilege was bestowed using `GRANT EVENT ON
*.*`). For a schema-level
[`EVENT`](privileges-provided.html#priv_event) privilege,
[`GRANT`](grant.html "13.7.1.4 GRANT Statement") creates a row in
`mysql.db` and sets that row's
`Db` column to the name of the schema, the
`User` column to the name of the user, and the
`Event_priv` column to '`Y`'.
There should never be any need to manipulate these tables
directly, since the [`GRANT
EVENT`](grant.html "13.7.1.4 GRANT Statement") and `REVOKE EVENT` statements
perform the required operations on them.

Five status variables provide counts of event-related operations
(but *not* of statements executed by events;
see [Section 23.8, “Restrictions on Stored Programs”](stored-program-restrictions.html "23.8 Restrictions on Stored Programs")). These are:

* `Com_create_event`: The number of
  [`CREATE EVENT`](create-event.html "13.1.12 CREATE EVENT Statement") statements
  executed since the last server restart.

* `Com_alter_event`: The number of
  [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement") statements executed
  since the last server restart.

* `Com_drop_event`: The number of
  [`DROP EVENT`](drop-event.html "13.1.23 DROP EVENT Statement") statements executed
  since the last server restart.

* `Com_show_create_event`: The number of
  [`SHOW CREATE EVENT`](show-create-event.html "13.7.5.7 SHOW CREATE EVENT Statement") statements
  executed since the last server restart.

* `Com_show_events`: The number of
  [`SHOW EVENTS`](show-events.html "13.7.5.18 SHOW EVENTS Statement") statements executed
  since the last server restart.

You can view current values for all of these at one time by
running the statement `SHOW STATUS LIKE
'%event%';`.