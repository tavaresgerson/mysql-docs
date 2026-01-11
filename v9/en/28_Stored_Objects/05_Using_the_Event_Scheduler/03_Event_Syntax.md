### 27.5.3 Event Syntax

MySQL provides several SQL statements for working with scheduled events:

* New events are defined using the `CREATE EVENT` statement. See Section 15.1.15, “CREATE EVENT Statement”.

* The definition of an existing event can be changed by means of the `ALTER EVENT` statement. See Section 15.1.3, “ALTER EVENT Statement”.

* When a scheduled event is no longer wanted or needed, it can be deleted from the server by its definer using the `DROP EVENT` statement. See Section 15.1.29, “DROP EVENT Statement”. Whether an event persists past the end of its schedule also depends on its `ON COMPLETION` clause, if it has one. See Section 15.1.15, “CREATE EVENT Statement”.

  An event can be dropped by any user having the `EVENT` privilege for the database on which the event is defined. See Section 27.5.6, “The Event Scheduler and MySQL Privileges”.
