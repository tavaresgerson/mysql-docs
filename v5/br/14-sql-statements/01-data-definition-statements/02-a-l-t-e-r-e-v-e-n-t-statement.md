### 13.1.2 ALTER EVENT Statement

```sql
ALTER
    [DEFINER = user]
    EVENT event_name
    [ON SCHEDULE schedule]
    [ON COMPLETION [NOT] PRESERVE]
    [RENAME TO new_event_name]
    [ENABLE | DISABLE | DISABLE ON SLAVE]
    [COMMENT 'string']
    [DO event_body]
```

The [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement") statement changes one or more of the characteristics of an existing event without the need to drop and recreate it. The syntax for each of the `DEFINER`, `ON SCHEDULE`, `ON COMPLETION`, `COMMENT`, `ENABLE` / `DISABLE`, and [`DO`](do.html "13.2.3 DO Statement") clauses is exactly the same as when used with [`CREATE EVENT`](create-event.html "13.1.12 CREATE EVENT Statement"). (See [Section 13.1.12, “CREATE EVENT Statement”](create-event.html "13.1.12 CREATE EVENT Statement").)

Any user can alter an event defined on a database for which that user has the [`EVENT`](privileges-provided.html#priv_event) privilege. When a user executes a successful [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement") statement, that user becomes the definer for the affected event.

[`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement") works only with an existing event:

```sql
mysql> ALTER EVENT no_such_event
     >     ON SCHEDULE
     >       EVERY '2:3' DAY_HOUR;
ERROR 1517 (HY000): Unknown event 'no_such_event'
```

In each of the following examples, assume that the event named `myevent` is defined as shown here:

```sql
CREATE EVENT myevent
    ON SCHEDULE
      EVERY 6 HOUR
    COMMENT 'A sample comment.'
    DO
      UPDATE myschema.mytable SET mycol = mycol + 1;
```

The following statement changes the schedule for `myevent` from once every six hours starting immediately to once every twelve hours, starting four hours from the time the statement is run:

```sql
ALTER EVENT myevent
    ON SCHEDULE
      EVERY 12 HOUR
    STARTS CURRENT_TIMESTAMP + INTERVAL 4 HOUR;
```

It is possible to change multiple characteristics of an event in a single statement. This example changes the SQL statement executed by `myevent` to one that deletes all records from `mytable`; it also changes the schedule for the event such that it executes once, one day after this [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement") statement is run.

```sql
ALTER EVENT myevent
    ON SCHEDULE
      AT CURRENT_TIMESTAMP + INTERVAL 1 DAY
    DO
      TRUNCATE TABLE myschema.mytable;
```

Specify the options in an [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement") statement only for those characteristics that you want to change; omitted options keep their existing values. This includes any default values for [`CREATE EVENT`](create-event.html "13.1.12 CREATE EVENT Statement") such as `ENABLE`.

To disable `myevent`, use this [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement") statement:

```sql
ALTER EVENT myevent
    DISABLE;
```

The `ON SCHEDULE` clause may use expressions involving built-in MySQL functions and user variables to obtain any of the *`timestamp`* or *`interval`* values which it contains. You cannot use stored routines or loadable functions in such expressions, and you cannot use any table references; however, you can use `SELECT FROM DUAL`. This is true for both [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement") and [`CREATE EVENT`](create-event.html "13.1.12 CREATE EVENT Statement") statements. References to stored routines, loadable functions, and tables in such cases are specifically not permitted, and fail with an error (see Bug
#22830).

Although an [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement") statement that contains another [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement") statement in its [`DO`](do.html "13.2.3 DO Statement") clause appears to succeed, when the server attempts to execute the resulting scheduled event, the execution fails with an error.

To rename an event, use the [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement") statement's `RENAME TO` clause. This statement renames the event `myevent` to `yourevent`:

```sql
ALTER EVENT myevent
    RENAME TO yourevent;
```

You can also move an event to a different database using `ALTER EVENT ... RENAME TO ...` and `db_name.event_name` notation, as shown here:

```sql
ALTER EVENT olddb.myevent
    RENAME TO newdb.myevent;
```

To execute the previous statement, the user executing it must have the [`EVENT`](privileges-provided.html#priv_event) privilege on both the `olddb` and `newdb` databases.

Note

There is no `RENAME EVENT` statement.

The value `DISABLE ON SLAVE` is used on a replica instead of `ENABLE` or `DISABLE` to indicate an event that was created on the source and replicated to the replica, but that is not executed on the replica. Normally, `DISABLE ON SLAVE` is set automatically as required; however, there are some circumstances under which you may want or need to change it manually. See [Section 16.4.1.16, “Replication of Invoked Features”](replication-features-invoked.html "16.4.1.16 Replication of Invoked Features"), for more information.
