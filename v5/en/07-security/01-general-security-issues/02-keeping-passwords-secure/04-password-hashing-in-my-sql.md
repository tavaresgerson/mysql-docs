#### 6.1.2.4 Password Hashing in MySQL

Note

The information in this section applies fully only before MySQL 5.7.5, and only for accounts that use the `mysql_native_password` or `mysql_old_password` authentication plugins. Support for pre-4.1 password hashes was removed in MySQL 5.7.5. This includes removal of the `mysql_old_password` authentication plugin and the `OLD_PASSWORD()` function. Also, [`secure_auth`](server-system-variables.html#sysvar_secure_auth) cannot be disabled, and [`old_passwords`](server-system-variables.html#sysvar_old_passwords) cannot be set to 1.

As of MySQL 5.7.5, only the information about 4.1 password hashes and the `mysql_native_password` authentication plugin remains relevant.

MySQL lists user accounts in the `user` table of the `mysql` database. Each MySQL account can be assigned a password, although the `user` table does not store the cleartext version of the password, but a hash value computed from it.

MySQL uses passwords in two phases of client/server communication:

* When a client attempts to connect to the server, there is an initial authentication step in which the client must present a password that has a hash value matching the hash value stored in the `user` table for the account the client wants to use.

* After the client connects, it can (if it has sufficient privileges) set or change the password hash for accounts listed in the `user` table. The client can do this by using the [`PASSWORD()`](encryption-functions.html#function_password) function to generate a password hash, or by using a password-generating statement ([`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement"), [`GRANT`](grant.html "13.7.1.4 GRANT Statement"), or [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement")).

In other words, the server *checks* hash values during authentication when a client first attempts to connect. The server *generates* hash values if a connected client invokes the [`PASSWORD()`](encryption-functions.html#function_password) function or uses a password-generating statement to set or change a password.

Password hashing methods in MySQL have the history described following. These changes are illustrated by changes in the result from the [`PASSWORD()`](encryption-functions.html#function_password) function that computes password hash values and in the structure of the `user` table where passwords are stored.

##### The Original (Pre-4.1) Hashing Method

The original hashing method produced a 16-byte string. Such hashes look like this:

```sql
mysql> SELECT PASSWORD('mypass');
+--------------------+
| PASSWORD('mypass') |
+--------------------+
| 6f8c114b58f2ce9e   |
+--------------------+
```

To store account passwords, the `Password` column of the `user` table was at this point 16 bytes long.

##### The 4.1 Hashing Method

MySQL 4.1 introduced password hashing that provided better security and reduced the risk of passwords being intercepted. There were several aspects to this change:

* Different format of password values produced by the [`PASSWORD()`](encryption-functions.html#function_password) function

* Widening of the `Password` column
* Control over the default hashing method
* Control over the permitted hashing methods for clients attempting to connect to the server

The changes in MySQL 4.1 took place in two stages:

* MySQL 4.1.0 used a preliminary version of the 4.1 hashing method. This method was short lived and the following discussion says nothing more about it.

* In MySQL 4.1.1, the hashing method was modified to produce a longer 41-byte hash value:

  ```sql
  mysql> SELECT PASSWORD('mypass');
  +-------------------------------------------+
  | PASSWORD('mypass')                        |
  +-------------------------------------------+
  | *6C8989366EAF75BB670AD8EA7A7FC1176A95CEF4 |
  +-------------------------------------------+
  ```

  The longer password hash format has better cryptographic properties, and client authentication based on long hashes is more secure than that based on the older short hashes.

  To accommodate longer password hashes, the `Password` column in the `user` table was changed at this point to be 41 bytes, its current length.

  A widened `Password` column can store password hashes in both the pre-4.1 and 4.1 formats. The format of any given hash value can be determined two ways:

  + The length: 4.1 and pre-4.1 hashes are 41 and 16 bytes, respectively.

  + Password hashes in the 4.1 format always begin with a `*` character, whereas passwords in the pre-4.1 format never do.

  To permit explicit generation of pre-4.1 password hashes, two additional changes were made:

  + The `OLD_PASSWORD()` function was added, which returns hash values in the 16-byte format.

  + For compatibility purposes, the [`old_passwords`](server-system-variables.html#sysvar_old_passwords) system variable was added, to enable DBAs and applications control over the hashing method. The default [`old_passwords`](server-system-variables.html#sysvar_old_passwords) value of 0 causes hashing to use the 4.1 method (41-byte hash values), but setting [`old_passwords=1`](server-system-variables.html#sysvar_old_passwords) causes hashing to use the pre-4.1 method. In this case, [`PASSWORD()`](encryption-functions.html#function_password) produces 16-byte values and is equivalent to `OLD_PASSWORD()`

  To permit DBAs control over how clients are permitted to connect, the [`secure_auth`](server-system-variables.html#sysvar_secure_auth) system variable was added. Starting the server with this variable disabled or enabled permits or prohibits clients to connect using the older pre-4.1 password hashing method. Before MySQL 5.6.5, [`secure_auth`](server-system-variables.html#sysvar_secure_auth) is disabled by default. As of 5.6.5, [`secure_auth`](server-system-variables.html#sysvar_secure_auth) is enabled by default to promote a more secure default configuration DBAs can disable it at their discretion, but this is not recommended, and pre-4.1 password hashes are deprecated and should be avoided. (For account upgrade instructions, see [Section 6.4.1.3, “Migrating Away from Pre-4.1 Password Hashing and the mysql\_old\_password Plugin”](account-upgrades.html "6.4.1.3 Migrating Away from Pre-4.1 Password Hashing and the mysql_old_password Plugin").)

  In addition, the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client supports a [`--secure-auth`](mysql-command-options.html#option_mysql_secure-auth) option that is analogous to [`secure_auth`](server-system-variables.html#sysvar_secure_auth), but from the client side. It can be used to prevent connections to less secure accounts that use pre-4.1 password hashing. This option is disabled by default before MySQL 5.6.7, enabled thereafter.

##### Compatibility Issues Related to Hashing Methods

The widening of the `Password` column in MySQL 4.1 from 16 bytes to 41 bytes affects installation or upgrade operations as follows:

* If you perform a new installation of MySQL, the `Password` column is made 41 bytes long automatically.

* Upgrades from MySQL 4.1 or later to current versions of MySQL should not give rise to any issues in regard to the `Password` column because both versions use the same column length and password hashing method.

* For upgrades from a pre-4.1 release to 4.1 or later, you must upgrade the system tables after upgrading. (See [Section 4.4.7, “mysql\_upgrade — Check and Upgrade MySQL Tables”](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables").)

The 4.1 hashing method is understood only by MySQL 4.1 (and higher) servers and clients, which can result in some compatibility problems. A 4.1 or higher client can connect to a pre-4.1 server, because the client understands both the pre-4.1 and 4.1 password hashing methods. However, a pre-4.1 client that attempts to connect to a 4.1 or higher server may run into difficulties. For example, a 4.0 [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client may fail with the following error message:

```sql
$> mysql -h localhost -u root
Client does not support authentication protocol requested
by server; consider upgrading MySQL client
```

The following discussion describes the differences between the pre-4.1 and 4.1 hashing methods, and what you should do if you upgrade your server but need to maintain backward compatibility with pre-4.1 clients. (However, permitting connections by old clients is not recommended and should be avoided if possible.) This information is of particular importance to PHP programmers migrating MySQL databases from versions older than 4.1 to 4.1 or higher.

The differences between short and long password hashes are relevant both for how the server uses passwords during authentication and for how it generates password hashes for connected clients that perform password-changing operations.

The way in which the server uses password hashes during authentication is affected by the width of the `Password` column:

* If the column is short, only short-hash authentication is used.

* If the column is long, it can hold either short or long hashes, and the server can use either format:

  + Pre-4.1 clients can connect, but because they know only about the pre-4.1 hashing method, they can authenticate only using accounts that have short hashes.

  + 4.1 and later clients can authenticate using accounts that have short or long hashes.

Even for short-hash accounts, the authentication process is actually a bit more secure for 4.1 and later clients than for older clients. In terms of security, the gradient from least to most secure is:

* Pre-4.1 client authenticating with short password hash
* 4.1 or later client authenticating with short password hash
* 4.1 or later client authenticating with long password hash

The way in which the server generates password hashes for connected clients is affected by the width of the `Password` column and by the [`old_passwords`](server-system-variables.html#sysvar_old_passwords) system variable. A 4.1 or later server generates long hashes only if certain conditions are met: The `Password` column must be wide enough to hold long values and [`old_passwords`](server-system-variables.html#sysvar_old_passwords) must not be set to 1.

Those conditions apply as follows:

* The `Password` column must be wide enough to hold long hashes (41 bytes). If the column has not been updated and still has the pre-4.1 width of 16 bytes, the server notices that long hashes cannot fit into it and generates only short hashes when a client performs password-changing operations using the [`PASSWORD()`](encryption-functions.html#function_password) function or a password-generating statement. This is the behavior that occurs if you have upgraded from a version of MySQL older than 4.1 to 4.1 or later but have not yet run the [**mysql\_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables") program to widen the `Password` column.

* If the `Password` column is wide, it can store either short or long password hashes. In this case, the [`PASSWORD()`](encryption-functions.html#function_password) function and password-generating statements generate long hashes unless the server was started with the [`old_passwords`](server-system-variables.html#sysvar_old_passwords) system variable set to 1 to force the server to generate short password hashes instead.

The purpose of the [`old_passwords`](server-system-variables.html#sysvar_old_passwords) system variable is to permit backward compatibility with pre-4.1 clients under circumstances where the server would otherwise generate long password hashes. The option does not affect authentication (4.1 and later clients can still use accounts that have long password hashes), but it does prevent creation of a long password hash in the `user` table as the result of a password-changing operation. Were that permitted to occur, the account could no longer be used by pre-4.1 clients. With [`old_passwords`](server-system-variables.html#sysvar_old_passwords) disabled, the following undesirable scenario is possible:

* An old pre-4.1 client connects to an account that has a short password hash.

* The client changes its own password. With [`old_passwords`](server-system-variables.html#sysvar_old_passwords) disabled, this results in the account having a long password hash.

* The next time the old client attempts to connect to the account, it cannot, because the account has a long password hash that requires the 4.1 hashing method during authentication. (Once an account has a long password hash in the user table, only 4.1 and later clients can authenticate for it because pre-4.1 clients do not understand long hashes.)

This scenario illustrates that, if you must support older pre-4.1 clients, it is problematic to run a 4.1 or higher server without [`old_passwords`](server-system-variables.html#sysvar_old_passwords) set to 1. By running the server with [`old_passwords=1`](server-system-variables.html#sysvar_old_passwords), password-changing operations do not generate long password hashes and thus do not cause accounts to become inaccessible to older clients. (Those clients cannot inadvertently lock themselves out by changing their password and ending up with a long password hash.)

The downside of [`old_passwords=1`](server-system-variables.html#sysvar_old_passwords) is that any passwords created or changed use short hashes, even for 4.1 or later clients. Thus, you lose the additional security provided by long password hashes. To create an account that has a long hash (for example, for use by 4.1 clients) or to change an existing account to use a long password hash, an administrator can set the session value of [`old_passwords`](server-system-variables.html#sysvar_old_passwords) set to 0 while leaving the global value set to 1:

```sql
mysql> SET @@SESSION.old_passwords = 0;
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT @@SESSION.old_passwords, @@GLOBAL.old_passwords;
+-------------------------+------------------------+
| @@SESSION.old_passwords | @@GLOBAL.old_passwords |
+-------------------------+------------------------+
|                       0 |                      1 |
+-------------------------+------------------------+
1 row in set (0.00 sec)

mysql> CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'newpass';
Query OK, 0 rows affected (0.03 sec)

mysql> SET PASSWORD FOR 'existinguser'@'localhost' = PASSWORD('existingpass');
Query OK, 0 rows affected (0.00 sec)
```

The following scenarios are possible in MySQL 4.1 or later. The factors are whether the `Password` column is short or long, and, if long, whether the server is started with [`old_passwords`](server-system-variables.html#sysvar_old_passwords) enabled or disabled.

**Scenario 1:** Short `Password` column in user table:

* Only short hashes can be stored in the `Password` column.

* The server uses only short hashes during client authentication.

* For connected clients, password hash-generating operations involving the [`PASSWORD()`](encryption-functions.html#function_password) function or password-generating statements use short hashes exclusively. Any change to an account's password results in that account having a short password hash.

* The value of [`old_passwords`](server-system-variables.html#sysvar_old_passwords) is irrelevant because with a short `Password` column, the server generates only short password hashes anyway.

This scenario occurs when a pre-4.1 MySQL installation has been upgraded to 4.1 or later but [**mysql\_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables") has not been run to upgrade the system tables in the `mysql` database. (This is not a recommended configuration because it does not permit use of more secure 4.1 password hashing.)

**Scenario 2:** Long `Password` column; server started with [`old_passwords=1`](server-system-variables.html#sysvar_old_passwords):

* Short or long hashes can be stored in the `Password` column.

* 4.1 and later clients can authenticate for accounts that have short or long hashes.

* Pre-4.1 clients can authenticate only for accounts that have short hashes.

* For connected clients, password hash-generating operations involving the [`PASSWORD()`](encryption-functions.html#function_password) function or password-generating statements use short hashes exclusively. Any change to an account's password results in that account having a short password hash.

In this scenario, newly created accounts have short password hashes because [`old_passwords=1`](server-system-variables.html#sysvar_old_passwords) prevents generation of long hashes. Also, if you create an account with a long hash before setting [`old_passwords`](server-system-variables.html#sysvar_old_passwords) to 1, changing the account's password while [`old_passwords=1`](server-system-variables.html#sysvar_old_passwords) results in the account being given a short password, causing it to lose the security benefits of a longer hash.

To create a new account that has a long password hash, or to change the password of any existing account to use a long hash, first set the session value of [`old_passwords`](server-system-variables.html#sysvar_old_passwords) set to 0 while leaving the global value set to 1, as described previously.

In this scenario, the server has an up to date `Password` column, but is running with the default password hashing method set to generate pre-4.1 hash values. This is not a recommended configuration but may be useful during a transitional period in which pre-4.1 clients and passwords are upgraded to 4.1 or later. When that has been done, it is preferable to run the server with [`old_passwords=0`](server-system-variables.html#sysvar_old_passwords) and [`secure_auth=1`](server-system-variables.html#sysvar_secure_auth).

**Scenario 3:** Long `Password` column; server started with [`old_passwords=0`](server-system-variables.html#sysvar_old_passwords):

* Short or long hashes can be stored in the `Password` column.

* 4.1 and later clients can authenticate using accounts that have short or long hashes.

* Pre-4.1 clients can authenticate only using accounts that have short hashes.

* For connected clients, password hash-generating operations involving the [`PASSWORD()`](encryption-functions.html#function_password) function or password-generating statements use long hashes exclusively. A change to an account's password results in that account having a long password hash.

As indicated earlier, a danger in this scenario is that it is possible for accounts that have a short password hash to become inaccessible to pre-4.1 clients. A change to such an account's password made using the [`PASSWORD()`](encryption-functions.html#function_password) function or a password-generating statement results in the account being given a long password hash. From that point on, no pre-4.1 client can connect to the server using that account. The client must upgrade to 4.1 or later.

If this is a problem, you can change a password in a special way. For example, normally you use [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement") as follows to change an account password:

```sql
SET PASSWORD FOR 'some_user'@'some_host' = PASSWORD('password');
```

To change the password but create a short hash, use the `OLD_PASSWORD()` function instead:

```sql
SET PASSWORD FOR 'some_user'@'some_host' = OLD_PASSWORD('password');
```

`OLD_PASSWORD()` is useful for situations in which you explicitly want to generate a short hash.

The disadvantages for each of the preceding scenarios may be summarized as follows:

In scenario 1, you cannot take advantage of longer hashes that provide more secure authentication.

In scenario 2, [`old_passwords=1`](server-system-variables.html#sysvar_old_passwords) prevents accounts with short hashes from becoming inaccessible, but password-changing operations cause accounts with long hashes to revert to short hashes unless you take care to change the session value of [`old_passwords`](server-system-variables.html#sysvar_old_passwords) to 0 first.

In scenario 3, accounts with short hashes become inaccessible to pre-4.1 clients if you change their passwords without explicitly using `OLD_PASSWORD()`.

The best way to avoid compatibility problems related to short password hashes is to not use them:

* Upgrade all client programs to MySQL 4.1 or later.
* Run the server with [`old_passwords=0`](server-system-variables.html#sysvar_old_passwords).

* Reset the password for any account with a short password hash to use a long password hash.

* For additional security, run the server with [`secure_auth=1`](server-system-variables.html#sysvar_secure_auth).
