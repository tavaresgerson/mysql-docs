### 8.2.8 Adding Accounts, Assigning Privileges, and Dropping Accounts

To manage MySQL accounts, use the SQL statements intended for that
purpose:

* [`CREATE USER`](create-user.html "15.7.1.3 CREATE USER Statement") and
  [`DROP USER`](drop-user.html "15.7.1.5 DROP USER Statement") create and remove
  accounts.

* [`GRANT`](grant.html "15.7.1.6 GRANT Statement") and
  [`REVOKE`](revoke.html "15.7.1.8 REVOKE Statement") assign privileges to and
  revoke privileges from accounts.

* [`SHOW GRANTS`](show-grants.html "15.7.7.21 SHOW GRANTS Statement") displays account
  privilege assignments.

Account-management statements cause the server to make appropriate
modifications to the underlying grant tables, which are discussed
in [Section 8.2.3, “Grant Tables”](grant-tables.html "8.2.3 Grant Tables").

Note

Direct modification of grant tables using statements such as
[`INSERT`](insert.html "15.2.7 INSERT Statement"),
[`UPDATE`](update.html "15.2.17 UPDATE Statement"), or
[`DELETE`](delete.html "15.2.2 DELETE Statement") is discouraged and done at
your own risk. The server is free to ignore rows that become
malformed as a result of such modifications.

For any operation that modifies a grant table, the server checks
whether the table has the expected structure and produces an
error if not. To update the tables to the expected structure,
perform the MySQL upgrade procedure. See
[Chapter 3, *Upgrading MySQL*](upgrading.html "Chapter 3 Upgrading MySQL").

Another option for creating accounts is to use the GUI tool
MySQL Workbench. Also, several third-party programs offer capabilities
for MySQL account administration. `phpMyAdmin` is
one such program.

This section discusses the following topics:

* [Creating Accounts and Granting Privileges](creating-accounts.html#creating-accounts-granting-privileges "Creating Accounts and Granting Privileges")
* [Checking Account Privileges and Properties](creating-accounts.html#checking-account-privileges "Checking Account Privileges and Properties")
* [Revoking Account Privileges](creating-accounts.html#revoking-account-privileges "Revoking Account Privileges")
* [Dropping Accounts](creating-accounts.html#dropping-accounts "Dropping Accounts")

For additional information about the statements discussed here,
see [Section 15.7.1, “Account Management Statements”](account-management-statements.html "15.7.1 Account Management Statements").

#### Creating Accounts and Granting Privileges

The following examples show how to use the
[**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") client program to set up new accounts.
These examples assume that the MySQL `root`
account has the [`CREATE USER`](privileges-provided.html#priv_create-user)
privilege and all privileges that it grants to other accounts.

At the command line, connect to the server as the MySQL
`root` user, supplying the appropriate password
at the password prompt:

```
$> mysql -u root -p
Enter password: (enter root password here)
```

After connecting to the server, you can add new accounts. The
following example uses [`CREATE USER`](create-user.html "15.7.1.3 CREATE USER Statement") and [`GRANT`](grant.html "15.7.1.6 GRANT Statement") statements
to set up four accounts (where you see
`'password'`,
substitute an appropriate password):

```
CREATE USER 'finley'@'localhost'
  IDENTIFIED BY 'password';
GRANT ALL
  ON *.*
  TO 'finley'@'localhost'
  WITH GRANT OPTION;

CREATE USER 'finley'@'%.example.com'
  IDENTIFIED BY 'password';
GRANT ALL
  ON *.*
  TO 'finley'@'%.example.com'
  WITH GRANT OPTION;

CREATE USER 'admin'@'localhost'
  IDENTIFIED BY 'password';
GRANT RELOAD,PROCESS
  ON *.*
  TO 'admin'@'localhost';

CREATE USER 'dummy'@'localhost';
```

The accounts created by those statements have the following
properties:

* Two accounts have a user name of `finley`.
  Both are superuser accounts with full global privileges to
  do anything. The `'finley'@'localhost'`
  account can be used only when connecting from the local
  host. The `'finley'@'%.example.com'`
  account uses the `'%'` wildcard in the host
  part, so it can be used to connect from any host in the
  `example.com` domain.

  The `'finley'@'localhost'` account is
  necessary if there is an anonymous-user account for
  `localhost`. Without the
  `'finley'@'localhost'` account, that
  anonymous-user account takes precedence when
  `finley` connects from the local host and
  `finley` is treated as an anonymous user.
  The reason for this is that the anonymous-user account has a
  more specific `Host` column value than the
  `'finley'@'%'` account and thus comes
  earlier in the `user` table sort order.
  (For information about `user` table
  sorting, see [Section 8.2.6, “Access Control, Stage 1: Connection Verification”](connection-access.html "8.2.6 Access Control, Stage 1: Connection Verification").)

* The `'admin'@'localhost'` account can be
  used only by `admin` to connect from the
  local host. It is granted the global
  [`RELOAD`](privileges-provided.html#priv_reload) and
  [`PROCESS`](privileges-provided.html#priv_process) administrative
  privileges. These privileges enable the
  `admin` user to execute the
  [**mysqladmin reload**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program"), [**mysqladmin
  refresh**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program"), and [**mysqladmin
  flush-*`xxx`***](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") commands, as
  well as [**mysqladmin processlist**](mysqladmin.html "6.5.2 mysqladmin — A MySQL Server Administration Program") . No
  privileges are granted for accessing any databases. You
  could add such privileges using
  [`GRANT`](grant.html "15.7.1.6 GRANT Statement") statements.

* The `'dummy'@'localhost'` account has no
  password (which is insecure and not recommended). This
  account can be used only to connect from the local host. No
  privileges are granted. It is assumed that you grant
  specific privileges to the account using
  [`GRANT`](grant.html "15.7.1.6 GRANT Statement") statements.

The previous example grants privileges at the global level. The
next example creates three accounts and grants them access at
lower levels; that is, to specific databases or objects within
databases. Each account has a user name of
`custom`, but the host name parts differ:

```
CREATE USER 'custom'@'localhost'
  IDENTIFIED BY 'password';
GRANT ALL
  ON bankaccount.*
  TO 'custom'@'localhost';

CREATE USER 'custom'@'host47.example.com'
  IDENTIFIED BY 'password';
GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP
  ON expenses.*
  TO 'custom'@'host47.example.com';

CREATE USER 'custom'@'%.example.com'
  IDENTIFIED BY 'password';
GRANT SELECT,INSERT,UPDATE,DELETE,CREATE,DROP
  ON customer.addresses
  TO 'custom'@'%.example.com';
```

The three accounts can be used as follows:

* The `'custom'@'localhost'` account has all
  database-level privileges to access the
  `bankaccount` database. The account can be
  used to connect to the server only from the local host.

* The `'custom'@'host47.example.com'` account
  has specific database-level privileges to access the
  `expenses` database. The account can be
  used to connect to the server only from the host
  `host47.example.com`.

* The `'custom'@'%.example.com'` account has
  specific table-level privileges to access the
  `addresses` table in the
  `customer` database, from any host in the
  `example.com` domain. The account can be
  used to connect to the server from all machines in the
  domain due to use of the `%` wildcard
  character in the host part of the account name.

#### Checking Account Privileges and Properties

To see the privileges for an account, use
[`SHOW GRANTS`](show-grants.html "15.7.7.21 SHOW GRANTS Statement"):

```
mysql> SHOW GRANTS FOR 'admin'@'localhost';
+-----------------------------------------------------+
| Grants for admin@localhost                          |
+-----------------------------------------------------+
| GRANT RELOAD, PROCESS ON *.* TO `admin`@`localhost` |
+-----------------------------------------------------+
```

To see nonprivilege properties for an account, use
[`SHOW CREATE USER`](show-create-user.html "15.7.7.12 SHOW CREATE USER Statement"):

```
mysql> SET print_identified_with_as_hex = ON;
mysql> SHOW CREATE USER 'admin'@'localhost'\G
*************************** 1. row ***************************
CREATE USER for admin@localhost: CREATE USER `admin`@`localhost`
IDENTIFIED WITH 'caching_sha2_password'
AS 0x24412430303524301D0E17054E2241362B1419313C3E44326F294133734B30792F436E77764270373039612E32445250786D43594F45354532324B6169794F47457852796E32
REQUIRE NONE PASSWORD EXPIRE DEFAULT ACCOUNT UNLOCK
PASSWORD HISTORY DEFAULT
PASSWORD REUSE INTERVAL DEFAULT
PASSWORD REQUIRE CURRENT DEFAULT
```

Enabling the
[`print_identified_with_as_hex`](server-system-variables.html#sysvar_print_identified_with_as_hex)
system variable (available as of MySQL 8.0.17) causes
[`SHOW CREATE USER`](show-create-user.html "15.7.7.12 SHOW CREATE USER Statement") to display hash
values that contain unprintable characters as hexadecimal
strings rather than as regular string literals.

#### Revoking Account Privileges

To revoke account privileges, use the
[`REVOKE`](revoke.html "15.7.1.8 REVOKE Statement") statement. Privileges can
be revoked at different levels, just as they can be granted at
different levels.

Revoke global privileges:

```
REVOKE ALL
  ON *.*
  FROM 'finley'@'%.example.com';

REVOKE RELOAD
  ON *.*
  FROM 'admin'@'localhost';
```

Revoke database-level privileges:

```
REVOKE CREATE,DROP
  ON expenses.*
  FROM 'custom'@'host47.example.com';
```

Revoke table-level privileges:

```
REVOKE INSERT,UPDATE,DELETE
  ON customer.addresses
  FROM 'custom'@'%.example.com';
```

To check the effect of privilege revocation, use
[`SHOW GRANTS`](show-grants.html "15.7.7.21 SHOW GRANTS Statement"):

```
mysql> SHOW GRANTS FOR 'admin'@'localhost';
+---------------------------------------------+
| Grants for admin@localhost                  |
+---------------------------------------------+
| GRANT PROCESS ON *.* TO `admin`@`localhost` |
+---------------------------------------------+
```

#### Dropping Accounts

To remove an account, use the [`DROP
USER`](drop-user.html "15.7.1.5 DROP USER Statement") statement. For example, to drop some of the
accounts created previously:

```
DROP USER 'finley'@'localhost';
DROP USER 'finley'@'%.example.com';
DROP USER 'admin'@'localhost';
DROP USER 'dummy'@'localhost';
```