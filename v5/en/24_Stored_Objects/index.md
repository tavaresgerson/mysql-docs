# Chapter 23 Stored Objects

**Table of Contents**

[23.1 Defining Stored Programs](stored-programs-defining.html)

[23.2 Using Stored Routines](stored-routines.html)
:   [23.2.1 Stored Routine Syntax](stored-routines-syntax.html)

    [23.2.2 Stored Routines and MySQL Privileges](stored-routines-privileges.html)

    [23.2.3 Stored Routine Metadata](stored-routines-metadata.html)

    [23.2.4 Stored Procedures, Functions, Triggers, and LAST\_INSERT\_ID()](stored-routines-last-insert-id.html)

[23.3 Using Triggers](triggers.html)
:   [23.3.1 Trigger Syntax and Examples](trigger-syntax.html)

    [23.3.2 Trigger Metadata](trigger-metadata.html)

[23.4 Using the Event Scheduler](event-scheduler.html)
:   [23.4.1 Event Scheduler Overview](events-overview.html)

    [23.4.2 Event Scheduler Configuration](events-configuration.html)

    [23.4.3 Event Syntax](events-syntax.html)

    [23.4.4 Event Metadata](events-metadata.html)

    [23.4.5 Event Scheduler Status](events-status-info.html)

    [23.4.6 The Event Scheduler and MySQL Privileges](events-privileges.html)

[23.5 Using Views](views.html)
:   [23.5.1 View Syntax](view-syntax.html)

    [23.5.2 View Processing Algorithms](view-algorithms.html)

    [23.5.3 Updatable and Insertable Views](view-updatability.html)

    [23.5.4 The View WITH CHECK OPTION Clause](view-check-option.html)

    [23.5.5 View Metadata](view-metadata.html)

[23.6 Stored Object Access Control](stored-objects-security.html)

[23.7 Stored Program Binary Logging](stored-programs-logging.html)

[23.8 Restrictions on Stored Programs](stored-program-restrictions.html)

[23.9 Restrictions on Views](view-restrictions.html)

This chapter discusses stored database objects that are defined in
terms of SQL code that is stored on the server for later execution.

Stored objects include these object types:

* Stored procedure: An object created with
  [`CREATE PROCEDURE`](create-procedure.html "13.1.16 CREATE PROCEDURE and CREATE FUNCTION Statements") and invoked
  using the [`CALL`](call.html "13.2.1 CALL Statement") statement. A
  procedure does not have a return value but can modify its
  parameters for later inspection by the caller. It can also
  generate result sets to be returned to the client program.

* Stored function: An object created with
  [`CREATE FUNCTION`](create-function.html "13.1.13 CREATE FUNCTION Statement") and used much
  like a built-in function. You invoke it in an expression and it
  returns a value during expression evaluation.

* Trigger: An object created with [`CREATE
  TRIGGER`](create-trigger.html "13.1.20 CREATE TRIGGER Statement") that is associated with a table. A trigger is
  activated when a particular event occurs for the table, such as
  an insert or update.

* Event: An object created with [`CREATE
  EVENT`](create-event.html "13.1.12 CREATE EVENT Statement") and invoked by the server according to schedule.

* View: An object created with [`CREATE
  VIEW`](create-view.html "13.1.21 CREATE VIEW Statement") that when referenced produces a result set. A
  view acts as a virtual table.

Terminology used in this document reflects the stored object
hierarchy:

* Stored routines include stored procedures and functions.
* Stored programs include stored routines, triggers, and events.
* Stored objects include stored programs and views.

This chapter describes how to use stored objects. The following
sections provide additional information about SQL syntax for
statements related to these objects, and about object processing:

* For each object type, there are `CREATE`,
  `ALTER`, and `DROP` statements
  that control which objects exist and how they are defined. See
  [Section 13.1, “Data Definition Statements”](sql-data-definition-statements.html "13.1 Data Definition Statements").

* The [`CALL`](call.html "13.2.1 CALL Statement") statement is used to
  invoke stored procedures. See [Section 13.2.1, “CALL Statement”](call.html "13.2.1 CALL Statement").

* Stored program definitions include a body that may use compound
  statements, loops, conditionals, and declared variables. See
  [Section 13.6, “Compound Statements”](sql-compound-statements.html "13.6 Compound Statements").

* Metadata changes to objects referred to by stored programs are
  detected and cause automatic reparsing of the affected
  statements when the program is next executed. For more
  information, see [Section 8.10.4, “Caching of Prepared Statements and Stored Programs”](statement-caching.html "8.10.4 Caching of Prepared Statements and Stored Programs").