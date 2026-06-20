## 27.2 Using Stored Routines

MySQL supports stored routines (procedures and functions). A stored routine is a set of SQL statements that can be stored in the server. Once this has been done, clients don't need to keep reissuing the individual statements but can refer to the stored routine instead.

Stored routines can be particularly useful in certain situations:

* When multiple client applications are written in different languages or work on different platforms, but need to perform the same database operations.

* When security is paramount. Banks, for example, use stored procedures and functions for all common operations. This provides a consistent and secure environment, and routines can ensure that each operation is properly logged. In such a setup, applications and users would have no access to the database tables directly, but can only execute specific stored routines.

Stored routines can provide improved performance because less information needs to be sent between the server and the client. The tradeoff is that this does increase the load on the database server because more of the work is done on the server side and less is done on the client (application) side. Consider this if many client machines (such as Web servers) are serviced by only one or a few database servers.

Stored routines also enable you to have libraries of functions in the database server. This is a feature shared by modern application languages that enable such design internally (for example, by using classes). Using these client application language features is beneficial for the programmer even outside the scope of database use.

MySQL follows the SQL:2003 syntax for stored routines, which is also used by IBM's DB2. All syntax described here is supported and any limitations and extensions are documented where appropriate.

### Additional Resources

* You may find the [Stored Procedures User Forum](https://forums.mysql.com/list.php?98) of use when working with stored procedures and functions.

* For answers to some commonly asked questions regarding stored routines in MySQL, see Section A.4, “MySQL 9.5 FAQ: Stored Procedures and Functions”.

* There are some restrictions on the use of stored routines. See Section 27.10, “Restrictions on Stored Programs”.

* Binary logging for stored routines takes place as described in Section 27.9, “Stored Program Binary Logging”.


### 27.2.1 Stored Routine Syntax

A stored routine is either a procedure or a function. Stored routines are created with the [`CREATE PROCEDURE`](create-procedure.html "15.1.21 CREATE PROCEDURE and CREATE FUNCTION Statements") and [`CREATE FUNCTION`](create-function.html "15.1.16 CREATE FUNCTION Statement") statements (see Section 15.1.21, “CREATE PROCEDURE and CREATE FUNCTION Statements”). A procedure is invoked using a `CALL` statement (see Section 15.2.1, “CALL Statement”), and can only pass back values using output variables. A function can be called from inside a statement just like any other function (that is, by invoking the function's name), and can return a scalar value. The body of a stored routine can use compound statements (see Section 15.6, “Compound Statement Syntax”).

Stored routines can be dropped with the [`DROP PROCEDURE`](drop-procedure.html "15.1.34 DROP PROCEDURE and DROP FUNCTION Statements") and [`DROP FUNCTION`](drop-function.html "15.1.30 DROP FUNCTION Statement") statements (see Section 15.1.34, “DROP PROCEDURE and DROP FUNCTION Statements”), and altered with the `ALTER PROCEDURE` and `ALTER FUNCTION` statements (see Section 15.1.9, “ALTER PROCEDURE Statement”).

A stored procedure or function is associated with a particular database. This has several implications:

* When the routine is invoked, an implicit `USE db_name` is performed (and undone when the routine terminates). `USE` statements within stored routines are not permitted.

* You can qualify routine names with the database name. This can be used to refer to a routine that is not in the current database. For example, to invoke a stored procedure `p` or function `f` that is associated with the `test` database, you can say `CALL test.p()` or `test.f()`.

* When a database is dropped, all stored routines associated with it are dropped as well.

Stored functions cannot be recursive.

Recursion in stored procedures is permitted but disabled by default. To enable recursion, set the `max_sp_recursion_depth` server system variable to a value greater than zero. Stored procedure recursion increases the demand on thread stack space. If you increase the value of `max_sp_recursion_depth`, it may be necessary to increase thread stack size by increasing the value of `thread_stack` at server startup. See Section 7.1.8, “Server System Variables”, for more information.

MySQL supports a very useful extension that enables the use of regular `SELECT` statements (that is, without using cursors or local variables) inside a stored procedure. The result set of such a query is simply sent directly to the client. Multiple `SELECT` statements generate multiple result sets, so the client must use a MySQL client library that supports multiple result sets. This means the client must use a client library from a version of MySQL at least as recent as 4.1. The client should also specify the `CLIENT_MULTI_RESULTS` option when it connects. For C programs, this can be done with the `mysql_real_connect()` C API function. See mysql\_real\_connect(), and Multiple Statement Execution Support.

A user variable referenced by a statement in a stored procedure has its type determined the first time the procedure is invoked, and retains this type each time the procedure is invoked thereafter.


### 27.2.2 Stored Routines and MySQL Privileges

The MySQL grant system takes stored routines into account as follows:

* The `CREATE ROUTINE` privilege is needed to create stored routines.

* The `ALTER ROUTINE` privilege is needed to alter or drop stored routines. This privilege is granted automatically to the creator of a routine if necessary, and dropped from the creator when the routine is dropped.

* The `EXECUTE` privilege is required to execute stored routines. However, this privilege is granted automatically to the creator of a routine if necessary (and dropped from the creator when the routine is dropped). Also, the default `SQL SECURITY` characteristic for a routine is `DEFINER`, which enables users who have access to the database with which the routine is associated to execute the routine.

* If the `automatic_sp_privileges` system variable is 0, the `EXECUTE` and `ALTER ROUTINE` privileges are not automatically granted to and dropped from the routine creator.

* The creator of a routine is the account used to execute the `CREATE` statement for it. This might not be the same as the account named as the `DEFINER` in the routine definition.

* The account named as a routine `DEFINER` can see all routine properties, including its definition. The account thus has full access to the routine output as produced by:

  + The contents of the Information Schema `ROUTINES` table.

  + The `SHOW CREATE FUNCTION` and `SHOW CREATE PROCEDURE` statements.

  + The `SHOW FUNCTION CODE` and `SHOW PROCEDURE CODE` statements.

  + The `SHOW FUNCTION STATUS` and `SHOW PROCEDURE STATUS` statements.

* For an account other than the account named as the routine `DEFINER`, access to routine properties depends on the privileges granted to the account:

  + With the `SHOW_ROUTINE` privilege or the global `SELECT` privilege, the account can see all routine properties, including its definition.

  + With the `CREATE ROUTINE`, `ALTER ROUTINE` or `EXECUTE` privilege granted at a scope that includes the routine, the account can see all routine properties except its definition.


### 27.2.3 Stored Routine Metadata

To obtain metadata about stored routines:

* Query the `ROUTINES` table of the `INFORMATION_SCHEMA` database. See Section 28.3.36, “The INFORMATION\_SCHEMA ROUTINES Table”.

* Use the `SHOW CREATE PROCEDURE` and `SHOW CREATE FUNCTION` statements to see routine definitions. See Section 15.7.7.11, “SHOW CREATE PROCEDURE Statement”.

* Use the `SHOW PROCEDURE STATUS` and `SHOW FUNCTION STATUS` statements to see routine characteristics. See Section 15.7.7.31, “SHOW PROCEDURE STATUS Statement”.

* Use the `SHOW PROCEDURE CODE` and `SHOW FUNCTION CODE` statements to see a representation of the internal implementation of the routine. See Section 15.7.7.30, “SHOW PROCEDURE CODE Statement”.


### 27.2.4 Stored Procedures, Functions, Triggers, and LAST\_INSERT\_ID()

Within the body of a stored routine (procedure or function) or a trigger, the value of `LAST_INSERT_ID()` changes the same way as for statements executed outside the body of these kinds of objects (see Section 14.15, “Information Functions”). The effect of a stored routine or trigger upon the value of `LAST_INSERT_ID()` that is seen by following statements depends on the kind of routine:

* If a stored procedure executes statements that change the value of `LAST_INSERT_ID()`, the changed value is seen by statements that follow the procedure call.

* For stored functions and triggers that change the value, the value is restored when the function or trigger ends, so following statements do not see a changed value.
