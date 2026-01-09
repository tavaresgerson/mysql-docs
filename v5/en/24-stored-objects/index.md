# Chapter 23 Stored Objects

**Table of Contents**

23.1 Defining Stored Programs

23.2 Using Stored Routines :   23.2.1 Stored Routine Syntax

    23.2.2 Stored Routines and MySQL Privileges

    23.2.3 Stored Routine Metadata

    23.2.4 Stored Procedures, Functions, Triggers, and LAST_INSERT_ID()

23.3 Using Triggers :   23.3.1 Trigger Syntax and Examples

    23.3.2 Trigger Metadata

23.4 Using the Event Scheduler :   23.4.1 Event Scheduler Overview

    23.4.2 Event Scheduler Configuration

    23.4.3 Event Syntax

    23.4.4 Event Metadata

    23.4.5 Event Scheduler Status

    23.4.6 The Event Scheduler and MySQL Privileges

23.5 Using Views :   23.5.1 View Syntax

    23.5.2 View Processing Algorithms

    23.5.3 Updatable and Insertable Views

    23.5.4 The View WITH CHECK OPTION Clause

    23.5.5 View Metadata

23.6 Stored Object Access Control

23.7 Stored Program Binary Logging

23.8 Restrictions on Stored Programs

23.9 Restrictions on Views

This chapter discusses stored database objects that are defined in terms of SQL code that is stored on the server for later execution.

Stored objects include these object types:

* Stored procedure: An object created with `CREATE PROCEDURE` and invoked using the `CALL` statement. A procedure does not have a return value but can modify its parameters for later inspection by the caller. It can also generate result sets to be returned to the client program.

* Stored function: An object created with `CREATE FUNCTION` and used much like a built-in function. You invoke it in an expression and it returns a value during expression evaluation.

* Trigger: An object created with `CREATE TRIGGER` that is associated with a table. A trigger is activated when a particular event occurs for the table, such as an insert or update.

* Event: An object created with `CREATE EVENT` and invoked by the server according to schedule.

* View: An object created with `CREATE VIEW` that when referenced produces a result set. A view acts as a virtual table.

Terminology used in this document reflects the stored object hierarchy:

* Stored routines include stored procedures and functions.
* Stored programs include stored routines, triggers, and events.
* Stored objects include stored programs and views.

This chapter describes how to use stored objects. The following sections provide additional information about SQL syntax for statements related to these objects, and about object processing:

* For each object type, there are `CREATE`, `ALTER`, and `DROP` statements that control which objects exist and how they are defined. See Section 13.1, “Data Definition Statements”.

* The `CALL` statement is used to invoke stored procedures. See Section 13.2.1, “CALL Statement”.

* Stored program definitions include a body that may use compound statements, loops, conditionals, and declared variables. See Section 13.6, “Compound Statements”.

* Metadata changes to objects referred to by stored programs are detected and cause automatic reparsing of the affected statements when the program is next executed. For more information, see Section 8.10.4, “Caching of Prepared Statements and Stored Programs”.
