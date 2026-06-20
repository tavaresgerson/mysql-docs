# Chapter 27 Stored Objects

This chapter discusses stored database objects that are defined in terms of SQL code that is stored on the server for later execution.

Stored objects include these object types:

* Stored procedure: An object created with `CREATE PROCEDURE` and invoked using the `CALL` statement. A procedure does not have a return value but can modify its parameters for later inspection by the caller. It can also generate result sets to be returned to the client program.

* Stored function: An object created with `CREATE FUNCTION` and used much like a built-in function. You invoke it in an expression and it returns a value during expression evaluation.

* Trigger: An object created with [`CREATE TRIGGER`](create-trigger.html "15.1.26 CREATE TRIGGER Statement") that is associated with a table. A trigger is activated when a particular event occurs for the table, such as an insert or update.

* Event: An object created with [`CREATE EVENT`](create-event.html "15.1.15 CREATE EVENT Statement") and invoked by the server according to schedule.

* View: An object created with [`CREATE VIEW`](create-view.html "15.1.27 CREATE VIEW Statement") that when referenced produces a result set. A view acts as a virtual table.

* JSON Relational Duality View: An object created with `CREATE JSON DUALITY VIEW` that exposes selected columns of one or more tables as a JSON document. Also referred to as a JSON duality view, this object acts as a virtual JSON document.

Terminology used in this document reflects the stored object hierarchy:

* Stored routines include stored procedures and functions.
* Stored programs include stored routines, triggers, and events.
* Stored objects include stored programs and views.

This chapter describes how to use stored objects. The following sections provide additional information about SQL syntax for statements related to these objects, and about object processing:

* For each object type, there are `CREATE`, `ALTER`, and `DROP` statements that control which objects exist and how they are defined. See Section 15.1, “Data Definition Statements”.

* The `CALL` statement is used to invoke stored procedures. See Section 15.2.1, “CALL Statement”.

* Stored program definitions include a body that may use compound statements, loops, conditionals, and declared variables. See Section 15.6, “Compound Statement Syntax”.

* Metadata changes to objects referred to by stored programs are detected and cause automatic reparsing of the affected statements when the program is next executed. For more information, see Section 10.10.3, “Caching of Prepared Statements and Stored Programs”.