#### 13.7.1.7 SET PASSWORD Statement

```sql
SET PASSWORD [FOR user] = password_option

password_option: {
    'auth_string'
  | PASSWORD('auth_string')
}
```

The [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement") statement assigns a password to a MySQL user account. `'auth_string'` represents a cleartext (unencrypted) password.

Note

* [`SET PASSWORD ... = PASSWORD('auth_string')`](set-password.html "13.7.1.7 SET PASSWORD Statement") syntax is deprecated in MySQL 5.7 and is removed in MySQL 8.0.

* [`SET PASSWORD ... = 'auth_string'`](set-password.html "13.7.1.7 SET PASSWORD Statement") syntax is not deprecated, but [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") is the preferred statement for account alterations, including assigning passwords. For example:

  ```sql
  ALTER USER user IDENTIFIED BY 'auth_string';
  ```

Important

Under some circumstances, [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement") may be recorded in server logs or on the client side in a history file such as `~/.mysql_history`, which means that cleartext passwords may be read by anyone having read access to that information. For information about the conditions under which this occurs for the server logs and how to control it, see [Section 6.1.2.3, “Passwords and Logging”](password-logging.html "6.1.2.3 Passwords and Logging"). For similar information about client-side logging, see [Section 4.5.1.3, “mysql Client Logging”](mysql-logging.html "4.5.1.3 mysql Client Logging").

[`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement") can be used with or without a `FOR` clause that explicitly names a user account:

* With a `FOR user` clause, the statement sets the password for the named account, which must exist:

  ```sql
  SET PASSWORD FOR 'jeffrey'@'localhost' = 'auth_string';
  ```

* With no `FOR user` clause, the statement sets the password for the current user:

  ```sql
  SET PASSWORD = 'auth_string';
  ```

  Any client who connects to the server using a nonanonymous account can change the password for that account. (In particular, you can change your own password.) To see which account the server authenticated you as, invoke the [`CURRENT_USER()`](information-functions.html#function_current-user) function:

  ```sql
  SELECT CURRENT_USER();
  ```

If a `FOR user` clause is given, the account name uses the format described in [Section 6.2.4, “Specifying Account Names”](account-names.html "6.2.4 Specifying Account Names"). For example:

```sql
SET PASSWORD FOR 'bob'@'%.example.org' = 'auth_string';
```

The host name part of the account name, if omitted, defaults to `'%'`.

Setting the password for a named account (with a `FOR` clause) requires the [`UPDATE`](privileges-provided.html#priv_update) privilege for the `mysql` system database. Setting the password for yourself (for a nonanonymous account with no `FOR` clause) requires no special privileges. When the [`read_only`](server-system-variables.html#sysvar_read_only) system variable is enabled, [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement") requires the [`SUPER`](privileges-provided.html#priv_super) privilege in addition to any other required privileges.

The password can be specified in these ways:

* Use a string without [`PASSWORD()`](encryption-functions.html#function_password)

  ```sql
  SET PASSWORD FOR 'jeffrey'@'localhost' = 'password';
  ```

  [`SET PASSWORD`](set-password.html "13.7.1.7 SET PASSWORD Statement") interprets the string as a cleartext string, passes it to the authentication plugin associated with the account, and stores the result returned by the plugin in the account row in the `mysql.user` system table. (The plugin is given the opportunity to hash the value into the encryption format it expects. The plugin may use the value as specified, in which case no hashing occurs.)

* Use the [`PASSWORD()`](encryption-functions.html#function_password) function (deprecated in MySQL 5.7)

  ```sql
  SET PASSWORD FOR 'jeffrey'@'localhost' = PASSWORD('password');
  ```

  The [`PASSWORD()`](encryption-functions.html#function_password) argument is the cleartext (unencrypted) password. [`PASSWORD()`](encryption-functions.html#function_password) hashes the password and returns the encrypted password string for storage in the account row in the `mysql.user` system table.

  The [`PASSWORD()`](encryption-functions.html#function_password) function hashes the password using the hashing method determined by the value of the [`old_passwords`](server-system-variables.html#sysvar_old_passwords) system variable value. Be sure that [`old_passwords`](server-system-variables.html#sysvar_old_passwords) has the value corresponding to the hashing method expected by the authentication plugin associated with the account. For example, if the account uses the `mysql_native_password` plugin, the [`old_passwords`](server-system-variables.html#sysvar_old_passwords) value must be 0:

  ```sql
  SET old_passwords = 0;
  SET PASSWORD FOR 'jeffrey'@'localhost' = PASSWORD('password');
  ```

  If the [`old_passwords`](server-system-variables.html#sysvar_old_passwords) value differs from that required by the authentication plugin, the hashed password value returned by [`PASSWORD()`](encryption-functions.html#function_password) cannot be used by the plugin and correct authentication of client connections cannot occur.

The following table shows, for each password hashing method, the permitted value of `old_passwords` and which authentication plugins use the hashing method.

<table summary="For each password hashing method, the permitted value of old_passwords and which authentication plugins use the hashing method"><col style="width: 40%"/><col style="width: 20%"/><col style="width: 40%"/><thead><tr> <th>Password Hashing Method</th> <th>old_passwords Value</th> <th>Associated Authentication Plugin</th> </tr></thead><tbody><tr> <th>MySQL 4.1 native hashing</th> <td>0</td> <td><code>mysql_native_password</code></td> </tr><tr> <th>SHA-256 hashing</th> <td>2</td> <td><code>sha256_password</code></td> </tr></tbody></table>

For additional information about setting passwords and authentication plugins, see [Section 6.2.10, “Assigning Account Passwords”](assigning-passwords.html "6.2.10 Assigning Account Passwords"), and [Section 6.2.13, “Pluggable Authentication”](pluggable-authentication.html "6.2.13 Pluggable Authentication").
