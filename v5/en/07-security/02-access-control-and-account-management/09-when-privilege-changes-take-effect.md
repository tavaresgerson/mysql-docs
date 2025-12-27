### 6.2.9 When Privilege Changes Take Effect

If the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") server is started without the [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) option, it reads all grant table contents into memory during its startup sequence. The in-memory tables become effective for access control at that point.

If you modify the grant tables indirectly using an account-management statement, the server notices these changes and loads the grant tables into memory again immediately. Account-management statements are described in [Section 13.7.1, “Account Management Statements”](account-management-statements.html "13.7.1 Account Management Statements"). Examples include [`GRANT`](grant.html "13.7.1.4 GRANT Statement"), [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement"), [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement"), and [`RENAME USER`](rename-user.html "13.7.1.5 RENAME USER Statement").

If you modify the grant tables directly using statements such as [`INSERT`](insert.html "13.2.5 INSERT Statement"), [`UPDATE`](update.html "13.2.11 UPDATE Statement"), or [`DELETE`](delete.html "13.2.2 DELETE Statement") (which is not recommended), the changes have no effect on privilege checking until you either tell the server to reload the tables or restart it. Thus, if you change the grant tables directly but forget to reload them, the changes have *no effect* until you restart the server. This may leave you wondering why your changes seem to make no difference!

To tell the server to reload the grant tables, perform a flush-privileges operation. This can be done by issuing a [`FLUSH PRIVILEGES`](flush.html#flush-privileges) statement or by executing a [**mysqladmin flush-privileges**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") or [**mysqladmin reload**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") command.

A grant table reload affects privileges for each existing client session as follows:

* Table and column privilege changes take effect with the client's next request.

* Database privilege changes take effect the next time the client executes a `USE db_name` statement.

  Note

  Client applications may cache the database name; thus, this effect may not be visible to them without actually changing to a different database.

* Global privileges and passwords are unaffected for a connected client. These changes take effect only in sessions for subsequent connections.

If the server is started with the [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) option, it does not read the grant tables or implement any access control. Any user can connect and perform any operation, *which is insecure.* To cause a server thus started to read the tables and enable access checking, flush the privileges.
