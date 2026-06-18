#### 19.5.1.8 Replication of CURRENT\_USER()

The following statements support use of the
[`CURRENT_USER()`](information-functions.html#function_current-user) function to take
the place of the name of, and possibly the host for, an affected
user or a definer:

* [`DROP USER`](drop-user.html "15.7.1.5 DROP USER Statement")
* [`RENAME USER`](rename-user.html "15.7.1.7 RENAME USER Statement")
* [`GRANT`](grant.html "15.7.1.6 GRANT Statement")
* [`REVOKE`](revoke.html "15.7.1.8 REVOKE Statement")
* [`CREATE FUNCTION`](create-function.html "15.1.14 CREATE FUNCTION Statement")
* [`CREATE PROCEDURE`](create-procedure.html "15.1.17 CREATE PROCEDURE and CREATE FUNCTION Statements")
* [`CREATE TRIGGER`](create-trigger.html "15.1.22 CREATE TRIGGER Statement")
* [`CREATE EVENT`](create-event.html "15.1.13 CREATE EVENT Statement")
* [`CREATE VIEW`](create-view.html "15.1.23 CREATE VIEW Statement")
* [`ALTER EVENT`](alter-event.html "15.1.3 ALTER EVENT Statement")
* [`ALTER VIEW`](alter-view.html "15.1.11 ALTER VIEW Statement")
* [`SET PASSWORD`](set-password.html "15.7.1.10 SET PASSWORD Statement")

When binary logging is enabled and
[`CURRENT_USER()`](information-functions.html#function_current-user) or
[`CURRENT_USER`](information-functions.html#function_current-user) is used as the
definer in any of these statements, MySQL Server ensures that
the statement is applied to the same user on both the source and
the replica when the statement is replicated. In some cases,
such as statements that change passwords, the function reference
is expanded before it is written to the binary log, so that the
statement includes the user name. For all other cases, the name
of the current user on the source is replicated to the replica
as metadata, and the replica applies the statement to the
current user named in the metadata, rather than to the current
user on the replica.