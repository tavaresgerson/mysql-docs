# Chapter 27 Stored Objects

**Table of Contents**

[27.1 Defining Stored Programs](stored-programs-defining.html)

[27.2 Using Stored Routines](stored-routines.html)
:   [27.2.1 Stored Routine Syntax](stored-routines-syntax.html)

    [27.2.2 Stored Routines and MySQL Privileges](stored-routines-privileges.html)

    [27.2.3 Stored Routine Metadata](stored-routines-metadata.html)

    [27.2.4 Stored Procedures, Functions, Triggers, and LAST\_INSERT\_ID()](stored-routines-last-insert-id.html)

[27.3 JavaScript Stored Programs](stored-routines-js.html)
:   [27.3.1 JavaScript Stored Program Creation and Management](srjs-management.html)

    [27.3.2 Obtaining Information About JavaScript Stored Programs](srjs-metadata.html)

    [27.3.3 JavaScript Stored Program Language Support](srjs-language-support.html)

    [27.3.4 JavaScript Stored Program Data Types and Argument Handling](srjs-data-arguments.html)

    [27.3.5 JavaScript Stored Programs—Session Information and Options](srjs-session-info.html)

    [27.3.6 JavaScript SQL API](srjs-sql-api.html)

    [27.3.7 Using the JavaScript SQL API](srjs-api-using.html)

    [27.3.8 Using JavaScript Libraries](srjs-libraries.html)

    [27.3.9 Using WebAssembly Libraries](srjs-webassembly.html)

    [27.3.10 JavaScript GenAI API](srjs-genai-api.html)

    [27.3.11 JavaScript Stored Program Limitations and Restrictions](srjs-limitations.html)

    [27.3.12 JavaScript Stored Program Examples](srjs-examples.html)

[27.4 Using Triggers](triggers.html)
:   [27.4.1 Trigger Syntax and Examples](trigger-syntax.html)

    [27.4.2 Trigger Metadata](trigger-metadata.html)

[27.5 Using the Event Scheduler](event-scheduler.html)
:   [27.5.1 Event Scheduler Overview](events-overview.html)

    [27.5.2 Event Scheduler Configuration](events-configuration.html)

    [27.5.3 Event Syntax](events-syntax.html)

    [27.5.4 Event Metadata](events-metadata.html)

    [27.5.5 Event Scheduler Status](events-status-info.html)

    [27.5.6 The Event Scheduler and MySQL Privileges](events-privileges.html)

[27.6 Using Views](views.html)
:   [27.6.1 View Syntax](view-syntax.html)

    [27.6.2 View Processing Algorithms](view-algorithms.html)

    [27.6.3 Updatable and Insertable Views](view-updatability.html)

    [27.6.4 The View WITH CHECK OPTION Clause](view-check-option.html)

    [27.6.5 View Metadata](view-metadata.html)

[27.7 JSON Duality Views](json-duality-views.html)
:   [27.7.1 Creating JSON Duality Views](json-duality-views-syntax.html)

    [27.7.2 DML Operations on JSON Duality Views (MySQL Enterprise Edition)](json-duality-views-updatable.html)

    [27.7.3 JSON Duality View Metadata](json-duality-view-metadata.html)

[27.8 Stored Object Access Control](stored-objects-security.html)

[27.9 Stored Program Binary Logging](stored-programs-logging.html)

[27.10 Restrictions on Stored Programs](stored-program-restrictions.html)

[27.11 Restrictions on Views](view-restrictions.html)

This chapter discusses stored database objects that are defined in
terms of SQL code that is stored on the server for later execution.

Stored objects include these object types:

* Stored procedure: An object created with
  [`CREATE PROCEDURE`](create-procedure.html "15.1.21 CREATE PROCEDURE and CREATE FUNCTION Statements") and invoked
  using the [`CALL`](call.html "15.2.1 CALL Statement") statement. A
  procedure does not have a return value but can modify its
  parameters for later inspection by the caller. It can also
  generate result sets to be returned to the client program.

* Stored function: An object created with
  [`CREATE FUNCTION`](create-function.html "15.1.16 CREATE FUNCTION Statement") and used much
  like a built-in function. You invoke it in an expression and it
  returns a value during expression evaluation.

* Trigger: An object created with [`CREATE
  TRIGGER`](create-trigger.html "15.1.26 CREATE TRIGGER Statement") that is associated with a table. A trigger is
  activated when a particular event occurs for the table, such as
  an insert or update.

* Event: An object created with [`CREATE
  EVENT`](create-event.html "15.1.15 CREATE EVENT Statement") and invoked by the server according to schedule.

* View: An object created with [`CREATE
  VIEW`](create-view.html "15.1.27 CREATE VIEW Statement") that when referenced produces a result set. A
  view acts as a virtual table.

* JSON Relational Duality View: An object created with
  [`CREATE JSON DUALITY VIEW`](create-json-duality-view.html "15.1.17 CREATE JSON DUALITY VIEW Statement") that
  exposes selected columns of one or more tables as a JSON
  document. Also referred to as a JSON duality view, this object
  acts as a virtual JSON document.

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
  [Section 15.1, “Data Definition Statements”](sql-data-definition-statements.html "15.1 Data Definition Statements").

* The [`CALL`](call.html "15.2.1 CALL Statement") statement is used to
  invoke stored procedures. See [Section 15.2.1, “CALL Statement”](call.html "15.2.1 CALL Statement").

* Stored program definitions include a body that may use compound
  statements, loops, conditionals, and declared variables. See
  [Section 15.6, “Compound Statement Syntax”](sql-compound-statements.html "15.6 Compound Statement Syntax").

* Metadata changes to objects referred to by stored programs are
  detected and cause automatic reparsing of the affected
  statements when the program is next executed. For more
  information, see [Section 10.10.3, “Caching of Prepared Statements and Stored Programs”](statement-caching.html "10.10.3 Caching of Prepared Statements and Stored Programs").