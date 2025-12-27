### 6.2.11 Password Management

MySQL enables database administrators to expire account passwords manually, and to establish a policy for automatic password expiration. Expiration policy can be established globally, and individual accounts can be set to either defer to the global policy or override the global policy with specific per-account behavior.

* [Internal Versus External Credentials Storage](password-management.html#internal-versus-external-credentials "Internal Versus External Credentials Storage")
* [Password Expiration Policy](password-management.html#password-expiration-policy "Password Expiration Policy")

#### Internal Versus External Credentials Storage

Some authentication plugins store account credentials internally to MySQL, in the `mysql.user` system table:

* `mysql_native_password`
* `sha256_password`

The discussion in this section applies to such authentication plugins because the password-management capabilities described here are based on internal credentials storage handled by MySQL itself.

Other authentication plugins store account credentials externally to MySQL. For accounts that use plugins that perform authentication against an external credentials system, password management must be handled externally against that system as well.

For information about individual authentication plugins, see [Section 6.4.1, “Authentication Plugins”](authentication-plugins.html "6.4.1 Authentication Plugins").

#### Password Expiration Policy

To expire an account password manually, use the [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") statement:

```sql
ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE;
```

This operation marks the password expired in the corresponding `mysql.user` system table row.

Password expiration according to policy is automatic and is based on password age, which for a given account is assessed from the date and time of its most recent password change. The `mysql.user` system table indicates for each account when its password was last changed, and the server automatically treats the password as expired at client connection time if its age is greater than its permitted lifetime. This works with no explicit manual password expiration.

To establish automatic password-expiration policy globally, use the [`default_password_lifetime`](server-system-variables.html#sysvar_default_password_lifetime) system variable. Its default value is 0, which disables automatic password expiration. If the value of [`default_password_lifetime`](server-system-variables.html#sysvar_default_password_lifetime) is a positive integer *`N`*, it indicates the permitted password lifetime, such that passwords must be changed every *`N`* days.

Note

Prior to 5.7.11, the default [`default_password_lifetime`](server-system-variables.html#sysvar_default_password_lifetime) value is 360 (passwords must be changed approximately once per year). For such versions, be aware that, if you make no changes to the [`default_password_lifetime`](server-system-variables.html#sysvar_default_password_lifetime) variable or to individual user accounts, each user password expires after 360 days and the account starts running in restricted mode. Clients that connect to the server using the account then get an error indicating that the password must be changed: `ERROR 1820 (HY000): You must reset your password using ALTER USER statement before executing this statement.`

However, this is easy to miss for clients that automatically connect to the server, such as connections made from scripts. To avoid having such clients suddenly stop working due to a password expiring, make sure to change the password expiration settings for those clients, like this:

```sql
ALTER USER 'script'@'localhost' PASSWORD EXPIRE NEVER
```

Alternatively, set the [`default_password_lifetime`](server-system-variables.html#sysvar_default_password_lifetime) variable to `0`, thus disabling automatic password expiration for all users.

Examples:

* To establish a global policy that passwords have a lifetime of approximately six months, start the server with these lines in a server `my.cnf` file:

  ```sql
  [mysqld]
  default_password_lifetime=180
  ```

* To establish a global policy such that passwords never expire, set [`default_password_lifetime`](server-system-variables.html#sysvar_default_password_lifetime) to 0:

  ```sql
  [mysqld]
  default_password_lifetime=0
  ```

* [`default_password_lifetime`](server-system-variables.html#sysvar_default_password_lifetime) can also be changed at runtime:

  ```sql
  SET GLOBAL default_password_lifetime = 180;
  SET GLOBAL default_password_lifetime = 0;
  ```

The global password-expiration policy applies to all accounts that have not been set to override it. To establish policy for individual accounts, use the `PASSWORD EXPIRE` options of the [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") and [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") statements. See [Section 13.7.1.2, “CREATE USER Statement”](create-user.html "13.7.1.2 CREATE USER Statement"), and [Section 13.7.1.1, “ALTER USER Statement”](alter-user.html "13.7.1.1 ALTER USER Statement").

Example account-specific statements:

* Require the password to be changed every 90 days:

  ```sql
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE INTERVAL 90 DAY;
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE INTERVAL 90 DAY;
  ```

  This expiration option overrides the global policy for all accounts named by the statement.

* Disable password expiration:

  ```sql
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE NEVER;
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE NEVER;
  ```

  This expiration option overrides the global policy for all accounts named by the statement.

* Defer to the global expiration policy for all accounts named by the statement:

  ```sql
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE DEFAULT;
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE DEFAULT;
  ```

When a client successfully connects, the server determines whether the account password has expired:

* The server checks whether the password has been manually expired.

* Otherwise, the server checks whether the password age is greater than its permitted lifetime according to the automatic password expiration policy. If so, the server considers the password expired.

If the password is expired (whether manually or automatically), the server either disconnects the client or restricts the operations permitted to it (see [Section 6.2.12, “Server Handling of Expired Passwords”](expired-password-handling.html "6.2.12 Server Handling of Expired Passwords")). Operations performed by a restricted client result in an error until the user establishes a new account password:

```sql
mysql> SELECT 1;
ERROR 1820 (HY000): You must reset your password using ALTER USER
statement before executing this statement.

mysql> ALTER USER USER() IDENTIFIED BY 'password';
Query OK, 0 rows affected (0.01 sec)

mysql> SELECT 1;
+---+
| 1 |
+---+
| 1 |
+---+
1 row in set (0.00 sec)
```

This restricted mode of operation permits [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") statements, which is useful before MySQL 5.7.6 if [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement") must be used instead of [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") and the account password has a hashing format that requires [`old_passwords`](server-system-variables.html#sysvar_old_passwords) to be set to a value different from its default.

After the client resets the password, the server restores normal access for the session, as well as for subsequent connections that use the account. It is also possible for an administrative user to reset the account password, but any existing restricted sessions for that account remain restricted. A client using the account must disconnect and reconnect before statements can be executed successfully.

Note

Although it is possible to “reset” an expired password by setting it to its current value, it is preferable, as a matter of good policy, to choose a different password.
