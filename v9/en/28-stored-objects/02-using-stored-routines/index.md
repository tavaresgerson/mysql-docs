## 27.2 Using Stored Routines

27.2.1 Stored Routine Syntax

27.2.2 Stored Routines and MySQL Privileges

27.2.3 Stored Routine Metadata

27.2.4 Stored Procedures, Functions, Triggers, and LAST_INSERT_ID()

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
