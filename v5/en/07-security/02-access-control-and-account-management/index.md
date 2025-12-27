## 6.2 Access Control and Account Management

[6.2.1 Account User Names and Passwords](user-names.html)

[6.2.2 Privileges Provided by MySQL](privileges-provided.html)

[6.2.3 Grant Tables](grant-tables.html)

[6.2.4 Specifying Account Names](account-names.html)

[6.2.5 Access Control, Stage 1: Connection Verification](connection-access.html)

[6.2.6 Access Control, Stage 2: Request Verification](request-access.html)

[6.2.7 Adding Accounts, Assigning Privileges, and Dropping Accounts](creating-accounts.html)

[6.2.8 Reserved Accounts](reserved-accounts.html)

[6.2.9 When Privilege Changes Take Effect](privilege-changes.html)

[6.2.10 Assigning Account Passwords](assigning-passwords.html)

[6.2.11 Password Management](password-management.html)

[6.2.12 Server Handling of Expired Passwords](expired-password-handling.html)

[6.2.13 Pluggable Authentication](pluggable-authentication.html)

[6.2.14 Proxy Users](proxy-users.html)

[6.2.15 Account Locking](account-locking.html)

[6.2.16 Setting Account Resource Limits](user-resources.html)

[6.2.17 Troubleshooting Problems Connecting to MySQL](problems-connecting.html)

[6.2.18 SQL-Based Account Activity Auditing](account-activity-auditing.html)

MySQL enables the creation of accounts that permit client users to connect to the server and access data managed by the server. The primary function of the MySQL privilege system is to authenticate a user who connects from a given host and to associate that user with privileges on a database such as [`SELECT`](select.html "13.2.9 SELECT Statement"), [`INSERT`](insert.html "13.2.5 INSERT Statement"), [`UPDATE`](update.html "13.2.11 UPDATE Statement"), and [`DELETE`](delete.html "13.2.2 DELETE Statement"). Additional functionality includes the ability to grant privileges for administrative operations.

To control which users can connect, each account can be assigned authentication credentials such as a password. The user interface to MySQL accounts consists of SQL statements such as [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"), [`GRANT`](grant.html "13.7.1.4 GRANT Statement"), and [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement"). See [Section 13.7.1, “Account Management Statements”](account-management-statements.html "13.7.1 Account Management Statements").

The MySQL privilege system ensures that all users may perform only the operations permitted to them. As a user, when you connect to a MySQL server, your identity is determined by *the host from which you connect* and *the user name you specify*. When you issue requests after connecting, the system grants privileges according to your identity and *what you want to do*.

MySQL considers both your host name and user name in identifying you because there is no reason to assume that a given user name belongs to the same person on all hosts. For example, the user `joe` who connects from `office.example.com` need not be the same person as the user `joe` who connects from `home.example.com`. MySQL handles this by enabling you to distinguish users on different hosts that happen to have the same name: You can grant one set of privileges for connections by `joe` from `office.example.com`, and a different set of privileges for connections by `joe` from `home.example.com`. To see what privileges a given account has, use the [`SHOW GRANTS`](show-grants.html "13.7.5.21 SHOW GRANTS Statement") statement. For example:

```sql
SHOW GRANTS FOR 'joe'@'office.example.com';
SHOW GRANTS FOR 'joe'@'home.example.com';
```

Internally, the server stores privilege information in the grant tables of the `mysql` system database. The MySQL server reads the contents of these tables into memory when it starts and bases access-control decisions on the in-memory copies of the grant tables.

MySQL access control involves two stages when you run a client program that connects to the server:

**Stage 1:** The server accepts or rejects the connection based on your identity and whether you can verify your identity by supplying the correct password.

**Stage 2:** Assuming that you can connect, the server checks each statement you issue to determine whether you have sufficient privileges to perform it. For example, if you try to select rows from a table in a database or drop a table from the database, the server verifies that you have the [`SELECT`](privileges-provided.html#priv_select) privilege for the table or the [`DROP`](privileges-provided.html#priv_drop) privilege for the database.

For a more detailed description of what happens during each stage, see [Section 6.2.5, “Access Control, Stage 1: Connection Verification”](connection-access.html "6.2.5 Access Control, Stage 1: Connection Verification"), and [Section 6.2.6, “Access Control, Stage 2: Request Verification”](request-access.html "6.2.6 Access Control, Stage 2: Request Verification"). For help in diagnosing privilege-related problems, see [Section 6.2.17, “Troubleshooting Problems Connecting to MySQL”](problems-connecting.html "6.2.17 Troubleshooting Problems Connecting to MySQL").

If your privileges are changed (either by yourself or someone else) while you are connected, those changes do not necessarily take effect immediately for the next statement that you issue. For details about the conditions under which the server reloads the grant tables, see [Section 6.2.9, “When Privilege Changes Take Effect”](privilege-changes.html "6.2.9 When Privilege Changes Take Effect").

There are some things that you cannot do with the MySQL privilege system:

* You cannot explicitly specify that a given user should be denied access. That is, you cannot explicitly match a user and then refuse the connection.

* You cannot specify that a user has privileges to create or drop tables in a database but not to create or drop the database itself.

* A password applies globally to an account. You cannot associate a password with a specific object such as a database, table, or routine.
