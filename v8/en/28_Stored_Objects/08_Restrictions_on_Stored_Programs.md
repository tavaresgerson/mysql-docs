## 27.8 Restrictions on Stored Programs

* [SQL Statements Not Permitted in Stored Routines](stored-program-restrictions.html#stored-routine-sql-restrictions "SQL Statements Not Permitted in Stored Routines")
* [Restrictions for Stored Functions](stored-program-restrictions.html#stored-routines-function-restrictions "Restrictions for Stored Functions")
* [Restrictions for Triggers](stored-program-restrictions.html#stored-routines-trigger-restrictions "Restrictions for Triggers")
* [Name Conflicts within Stored Routines](stored-program-restrictions.html#stored-routine-name-conflicts "Name Conflicts within Stored Routines")
* [Replication Considerations](stored-program-restrictions.html#stored-routines-replication-restrictions "Replication Considerations")
* [Debugging Considerations](stored-program-restrictions.html#stored-routines-debugging-restrictions "Debugging Considerations")
* [Unsupported Syntax from the SQL:2003 Standard](stored-program-restrictions.html#stored-routines-standard-restrictions "Unsupported Syntax from the SQL:2003 Standard")
* [Stored Routine Concurrency Considerations](stored-program-restrictions.html#stored-routines-concurrency-restrictions "Stored Routine Concurrency Considerations")
* [Event Scheduler Restrictions](stored-program-restrictions.html#stored-routines-event-restrictions "Event Scheduler Restrictions")
* [Stored routines and triggers in NDB Cluster](stored-program-restrictions.html#stored-routines-ndbcluster "Stored routines and triggers in NDB Cluster")

These restrictions apply to the features described in
[Chapter 27, *Stored Objects*](stored-objects.html "Chapter 27 Stored Objects").

Some of the restrictions noted here apply to all stored routines;
that is, both to stored procedures and stored functions. There are
also some
[restrictions
specific to stored functions](stored-program-restrictions.html#stored-routines-function-restrictions "Restrictions for Stored Functions") but not to stored procedures.

The restrictions for stored functions also apply to triggers.
There are also some
[restrictions
specific to triggers](stored-program-restrictions.html#stored-routines-trigger-restrictions "Restrictions for Triggers").

The restrictions for stored procedures also apply to the
[`DO`](do.html "15.2.3 DO Statement") clause of Event Scheduler event
definitions. There are also some
[restrictions
specific to events](stored-program-restrictions.html#stored-routines-event-restrictions "Event Scheduler Restrictions").

### SQL Statements Not Permitted in Stored Routines

Stored routines cannot contain arbitrary SQL statements. The
following statements are not permitted:

* The locking statements [`LOCK
  TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") and
  [`UNLOCK
  TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements").

* [`ALTER VIEW`](alter-view.html "15.1.11 ALTER VIEW Statement").
* [`LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement") and
  [`LOAD XML`](load-xml.html "15.2.10 LOAD XML Statement").

* SQL prepared statements
  ([`PREPARE`](prepare.html "15.5.1 PREPARE Statement"),
  [`EXECUTE`](execute.html "15.5.2 EXECUTE Statement"),
  [`DEALLOCATE PREPARE`](deallocate-prepare.html "15.5.3 DEALLOCATE PREPARE Statement")) can be
  used in stored procedures, but not in stored functions or
  triggers. Thus, stored functions and triggers cannot use
  dynamic SQL (where you construct statements as strings and
  then execute them).

* Generally, statements not permitted in SQL prepared
  statements are also not permitted in stored programs. For a
  list of statements supported as prepared statements, see
  [Section 15.5, “Prepared Statements”](sql-prepared-statements.html "15.5 Prepared Statements"). Exceptions are
  [`SIGNAL`](signal.html "15.6.7.5 SIGNAL Statement"),
  [`RESIGNAL`](resignal.html "15.6.7.4 RESIGNAL Statement"), and
  [`GET DIAGNOSTICS`](get-diagnostics.html "15.6.7.3 GET DIAGNOSTICS Statement"), which are
  not permissible as prepared statements but are permitted in
  stored programs.

* Because local variables are in scope only during stored
  program execution, references to them are not permitted in
  prepared statements created within a stored program.
  Prepared statement scope is the current session, not the
  stored program, so the statement could be executed after the
  program ends, at which point the variables would no longer
  be in scope. For example, `SELECT ... INTO
  local_var` cannot be
  used as a prepared statement. This restriction also applies
  to stored procedure and function parameters. See
  [Section 15.5.1, “PREPARE Statement”](prepare.html "15.5.1 PREPARE Statement").

* Within all stored programs (stored procedures and functions,
  triggers, and events), the parser treats
  [`BEGIN
  [WORK]`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") as the beginning of a
  [`BEGIN ...
  END`](begin-end.html "15.6.1 BEGIN ... END Compound Statement") block.

  To begin a transaction within a stored procedure or event,
  use [`START
  TRANSACTION`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") instead.

  `START TRANSACTION` cannot be used within a
  stored function or trigger.

### Restrictions for Stored Functions

The following additional statements or operations are not
permitted within stored functions. They are permitted within
stored procedures, except stored procedures that are invoked
from within a stored function or trigger. For example, if you
use [`FLUSH`](flush.html "15.7.8.3 FLUSH Statement") in a stored procedure,
that stored procedure cannot be called from a stored function or
trigger.

* Statements that perform explicit or implicit commit or
  rollback. Support for these statements is not required by
  the SQL standard, which states that each DBMS vendor may
  decide whether to permit them.

* Statements that return a result set. This includes
  [`SELECT`](select.html "15.2.13 SELECT Statement") statements that do not
  have an `INTO
  var_list` clause and
  other statements such as
  [`SHOW`](show.html "15.7.7 SHOW Statements"),
  [`EXPLAIN`](explain.html "15.8.2 EXPLAIN Statement"), and
  [`CHECK TABLE`](check-table.html "15.7.3.2 CHECK TABLE Statement"). A function can
  process a result set either with
  [`SELECT ... INTO
  var_list`](select-into.html "15.2.13.1 SELECT ... INTO Statement") or by using a
  cursor and [`FETCH`](fetch.html "15.6.6.3 Cursor FETCH Statement") statements.
  See [Section 15.2.13.1, “SELECT ... INTO Statement”](select-into.html "15.2.13.1 SELECT ... INTO Statement"), and
  [Section 15.6.6, “Cursors”](cursors.html "15.6.6 Cursors").

* [`FLUSH`](flush.html "15.7.8.3 FLUSH Statement") statements.
* Stored functions cannot be used recursively.
* A stored function or trigger cannot modify a table that is
  already being used (for reading or writing) by the statement
  that invoked the function or trigger.

* If you refer to a temporary table multiple times in a stored
  function under different aliases, a `Can't reopen
  table:
  'tbl_name'`
  error occurs, even if the references occur in different
  statements within the function.

* [`HANDLER ...
  READ`](handler.html "15.2.5 HANDLER Statement") statements that invoke stored functions can
  cause replication errors and are disallowed.

### Restrictions for Triggers

For triggers, the following additional restrictions apply:

* Triggers are not activated by foreign key actions.
* When using row-based replication, triggers on the replica
  are not activated by statements originating on the source.
  The triggers on the replica are activated when using
  statement-based replication. For more information, see
  [Section 19.5.1.36, “Replication and Triggers”](replication-features-triggers.html "19.5.1.36 Replication and Triggers").

* The [`RETURN`](return.html "15.6.5.7 RETURN Statement") statement is not
  permitted in triggers, which cannot return a value. To exit
  a trigger immediately, use the
  [`LEAVE`](leave.html "15.6.5.4 LEAVE Statement") statement.

* Triggers are not permitted on tables in the
  `mysql` database. Nor are they permitted on
  `INFORMATION_SCHEMA` or
  `performance_schema` tables. Those tables
  are actually views and triggers are not permitted on views.

* The trigger cache does not detect when metadata of the
  underlying objects has changed. If a trigger uses a table
  and the table has changed since the trigger was loaded into
  the cache, the trigger operates using the outdated metadata.

### Name Conflicts within Stored Routines

The same identifier might be used for a routine parameter, a
local variable, and a table column. Also, the same local
variable name can be used in nested blocks. For example:

```
CREATE PROCEDURE p (i INT)
BEGIN
  DECLARE i INT DEFAULT 0;
  SELECT i FROM t;
  BEGIN
    DECLARE i INT DEFAULT 1;
    SELECT i FROM t;
  END;
END;
```

In such cases, the identifier is ambiguous and the following
precedence rules apply:

* A local variable takes precedence over a routine parameter
  or table column.

* A routine parameter takes precedence over a table column.
* A local variable in an inner block takes precedence over a
  local variable in an outer block.

The behavior that variables take precedence over table columns
is nonstandard.

### Replication Considerations

Use of stored routines can cause replication problems. This
issue is discussed further in
[Section 27.7, “Stored Program Binary Logging”](stored-programs-logging.html "27.7 Stored Program Binary Logging").

The
[`--replicate-wild-do-table=db_name.tbl_name`](replication-options-replica.html#option_mysqld_replicate-wild-do-table)
option applies to tables, views, and triggers. It does not apply
to stored procedures and functions, or events. To filter
statements operating on the latter objects, use one or more of
the `--replicate-*-db` options.

### Debugging Considerations

There are no stored routine debugging facilities.

### Unsupported Syntax from the SQL:2003 Standard

The MySQL stored routine syntax is based on the SQL:2003
standard. The following items from that standard are not
currently supported:

* `UNDO` handlers
* `FOR` loops

### Stored Routine Concurrency Considerations

To prevent problems of interaction between sessions, when a
client issues a statement, the server uses a snapshot of
routines and triggers available for execution of the statement.
That is, the server calculates a list of procedures, functions,
and triggers that may be used during execution of the statement,
loads them, and then proceeds to execute the statement. While
the statement executes, it does not see changes to routines
performed by other sessions.

For maximum concurrency, stored functions should minimize their
side-effects; in particular, updating a table within a stored
function can reduce concurrent operations on that table. A
stored function acquires table locks before executing, to avoid
inconsistency in the binary log due to mismatch of the order in
which statements execute and when they appear in the log. When
statement-based binary logging is used, statements that invoke a
function are recorded rather than the statements executed within
the function. Consequently, stored functions that update the
same underlying tables do not execute in parallel. In contrast,
stored procedures do not acquire table-level locks. All
statements executed within stored procedures are written to the
binary log, even for statement-based binary logging. See
[Section 27.7, “Stored Program Binary Logging”](stored-programs-logging.html "27.7 Stored Program Binary Logging").

### Event Scheduler Restrictions

The following limitations are specific to the Event Scheduler:

* Event names are handled in case-insensitive fashion. For
  example, you cannot have two events in the same database
  with the names `anEvent` and
  `AnEvent`.

* An event may not be created from within a stored program. An
  event may not be altered, or dropped from within a stored
  program, if the event name is specified by means of a
  variable. An event also may not create, alter, or drop
  stored routines or triggers.

* DDL statements on events are prohibited while a
  [`LOCK TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") statement is in
  effect.

* Event timings using the intervals `YEAR`,
  `QUARTER`, `MONTH`, and
  `YEAR_MONTH` are resolved in months; those
  using any other interval are resolved in seconds. There is
  no way to cause events scheduled to occur at the same second
  to execute in a given order. In addition—due to
  rounding, the nature of threaded applications, and the fact
  that a nonzero length of time is required to create events
  and to signal their execution—events may be delayed by
  as much as 1 or 2 seconds. However, the time shown in the
  Information Schema [`EVENTS`](information-schema-events-table.html "28.3.14 The INFORMATION_SCHEMA EVENTS Table")
  table's `LAST_EXECUTED` column is
  always accurate to within one second of the actual event
  execution time. (See also Bug #16522.)

* Each execution of the statements contained in the body of an
  event takes place in a new connection; thus, these
  statements have no effect in a given user session on the
  server's statement counts such as
  `Com_select` and
  `Com_insert` that are displayed by
  [`SHOW STATUS`](show-status.html "15.7.7.37 SHOW STATUS Statement"). However, such
  counts *are* updated in the global scope.
  (Bug #16422)

* Events do not support times later than the end of the Unix
  Epoch; this is approximately the beginning of the year 2038.
  Such dates are specifically not permitted by the Event
  Scheduler. (Bug #16396)

* References to stored functions, loadable functions, and
  tables in the `ON SCHEDULE` clauses of
  [`CREATE EVENT`](create-event.html "15.1.13 CREATE EVENT Statement") and
  [`ALTER EVENT`](alter-event.html "15.1.3 ALTER EVENT Statement") statements are
  not supported. These sorts of references are not permitted.
  (See Bug #22830 for more information.)

### Stored routines and triggers in NDB Cluster

While stored procedures, stored functions, triggers, and
scheduled events are all supported by tables using the
[`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 8.0") storage engine, you must keep
in mind that these do *not* propagate
automatically between MySQL Servers acting as Cluster SQL nodes.
This is because stored routine and trigger definitions are
stored in tables in the `mysql` system database
using `InnoDB` tables, which are not copied
between Cluster nodes.

Any stored routine or trigger that interacts with MySQL Cluster
tables must be re-created by running the appropriate
[`CREATE PROCEDURE`](create-procedure.html "15.1.17 CREATE PROCEDURE and CREATE FUNCTION Statements"),
[`CREATE FUNCTION`](create-function.html "15.1.14 CREATE FUNCTION Statement"), or
[`CREATE TRIGGER`](create-trigger.html "15.1.22 CREATE TRIGGER Statement") statements on each
MySQL Server that participates in the cluster where you wish to
use the stored routine or trigger. Similarly, any changes to
existing stored routines or triggers must be carried out
explicitly on all Cluster SQL nodes, using the appropriate
`ALTER` or `DROP` statements
on each MySQL Server accessing the cluster.

Warning

Do *not* attempt to work around the issue
just described by converting any `mysql`
database tables to use the [`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 8.0")
storage engine. *Altering the system tables in the
`mysql` database is not supported*
and is very likely to produce undesirable results.