### 23.4.3 Event Syntax

MySQL provides several SQL statements for working with scheduled
events:

* New events are defined using the [`CREATE
  EVENT`](create-event.html "13.1.12 CREATE EVENT Statement") statement. See [Section 13.1.12, “CREATE EVENT Statement”](create-event.html "13.1.12 CREATE EVENT Statement").

* The definition of an existing event can be changed by means of
  the [`ALTER EVENT`](alter-event.html "13.1.2 ALTER EVENT Statement") statement. See
  [Section 13.1.2, “ALTER EVENT Statement”](alter-event.html "13.1.2 ALTER EVENT Statement").

* When a scheduled event is no longer wanted or needed, it can
  be deleted from the server by its definer using the
  [`DROP EVENT`](drop-event.html "13.1.23 DROP EVENT Statement") statement. See
  [Section 13.1.23, “DROP EVENT Statement”](drop-event.html "13.1.23 DROP EVENT Statement"). Whether an event persists past
  the end of its schedule also depends on its `ON
  COMPLETION` clause, if it has one. See
  [Section 13.1.12, “CREATE EVENT Statement”](create-event.html "13.1.12 CREATE EVENT Statement").

  An event can be dropped by any user having the
  [`EVENT`](privileges-provided.html#priv_event) privilege for the
  database on which the event is defined. See
  [Section 23.4.6, “The Event Scheduler and MySQL Privileges”](events-privileges.html "23.4.6 The Event Scheduler and MySQL Privileges").