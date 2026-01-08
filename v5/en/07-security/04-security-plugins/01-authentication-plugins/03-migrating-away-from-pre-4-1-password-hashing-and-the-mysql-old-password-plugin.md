#### 6.4.1.3 Migrating Away from Pre-4.1 Password Hashing and the mysql\_old\_password Plugin

The MySQL server authenticates connection attempts for each account listed in the `mysql.user` system table using the authentication plugin named in the `plugin` column. If the `plugin` column is empty, the server authenticates the account as follows:

* Before MySQL 5.7, the server uses the `mysql_native_password` or `mysql_old_password` plugin implicitly, depending on the format of the password hash in the `Password` column. If the `Password` value is empty or a 4.1 password hash (41 characters), the server uses `mysql_native_password`. If the password value is a pre-4.1 password hash (16 characters), the server uses `mysql_old_password`. (For additional information about these hash formats, see [Section 6.1.2.4, “Password Hashing in MySQL”](password-hashing.html "6.1.2.4 Password Hashing in MySQL").)

* As of MySQL 5.7, the server requires the `plugin` column to be nonempty and disables accounts that have an empty `plugin` value.

Pre-4.1 password hashes and the `mysql_old_password` plugin are deprecated in MySQL 5.6 and support for them is removed in MySQL 5.7. They provide a level of security inferior to that offered by 4.1 password hashing and the `mysql_native_password` plugin.

Given the requirement in MySQL 5.7 that the `plugin` column must be nonempty, coupled with removal of `mysql_old_password` support, DBAs are advised to upgrade accounts as follows:

* Upgrade accounts that use `mysql_native_password` implicitly to use it explicitly

* Upgrade accounts that use `mysql_old_password` (either implicitly or explicitly) to use `mysql_native_password` explicitly

The instructions in this section describe how to perform those upgrades. The result is that no account has an empty `plugin` value and no account uses pre-4.1 password hashing or the `mysql_old_password` plugin.

As a variant on these instructions, DBAs might offer users the choice to upgrade to the `sha256_password` plugin, which authenticates using SHA-256 password hashes. For information about this plugin, see [Section 6.4.1.5, “SHA-256 Pluggable Authentication”](sha256-pluggable-authentication.html "6.4.1.5 SHA-256 Pluggable Authentication").

The following table lists the types of `mysql.user` accounts considered in this discussion.

<table summary="Characteristics of MySQL accounts and what must be done to upgrade them."><col style="width: 30%"/><col style="width: 20%"/><col style="width: 30%"/><col style="width: 20%"/><thead><tr> <th scope="col"><code>plugin</code> Column</th> <th scope="col"><code>Password</code> Column</th> <th scope="col">Authentication Result</th> <th scope="col">Upgrade Action</th> </tr></thead><tbody><tr> <th scope="row">Empty</th> <td>Empty</td> <td>Implicitly uses <code>mysql_native_password</code></td> <td>Assign plugin</td> </tr><tr> <th scope="row">Empty</th> <td>4.1 hash</td> <td>Implicitly uses <code>mysql_native_password</code></td> <td>Assign plugin</td> </tr><tr> <th scope="row">Empty</th> <td>Pre-4.1 hash</td> <td>Implicitly uses <code>mysql_old_password</code></td> <td>Assign plugin, rehash password</td> </tr><tr> <th scope="row"><code>mysql_native_password</code></th> <td>Empty</td> <td>Explicitly uses <code>mysql_native_password</code></td> <td>None</td> </tr><tr> <th scope="row"><code>mysql_native_password</code></th> <td>4.1 hash</td> <td>Explicitly uses <code>mysql_native_password</code></td> <td>None</td> </tr><tr> <th scope="row"><code>mysql_old_password</code></th> <td>Empty</td> <td>Explicitly uses <code>mysql_old_password</code></td> <td>Upgrade plugin</td> </tr><tr> <th scope="row"><code>mysql_old_password</code></th> <td>Pre-4.1 hash</td> <td>Explicitly uses <code>mysql_old_password</code></td> <td>Upgrade plugin, rehash password</td> </tr></tbody></table>

Accounts corresponding to lines for the `mysql_native_password` plugin require no upgrade action (because no change of plugin or hash format is required). For accounts corresponding to lines for which the password is empty, consider asking the account owners to choose a password (or require it by using [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") to expire empty account passwords).

##### Upgrading Accounts from Implicit to Explicit mysql\_native\_password Use

Accounts that have an empty plugin and a 4.1 password hash use `mysql_native_password` implicitly. To upgrade these accounts to use `mysql_native_password` explicitly, execute these statements:

```sql
UPDATE mysql.user SET plugin = 'mysql_native_password'
WHERE plugin = '' AND (Password = '' OR LENGTH(Password) = 41);
FLUSH PRIVILEGES;
```

Before MySQL 5.7, you can execute those statements to uprade accounts proactively. As of MySQL 5.7, you can run [**mysql\_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables"), which performs the same operation among its upgrade actions.

Notes:

* The upgrade operation just described is safe to execute at any time because it makes the `mysql_native_password` plugin explicit only for accounts that already use it implicitly.

* This operation requires no password changes, so it can be performed without affecting users or requiring their involvement in the upgrade process.

##### Upgrading Accounts from mysql\_old\_password to mysql\_native\_password

Accounts that use `mysql_old_password` (either implicitly or explicitly) should be upgraded to use `mysql_native_password` explicitly. This requires changing the plugin *and* changing the password from pre-4.1 to 4.1 hash format.

For the accounts covered in this step that must be upgraded, one of these conditions is true:

* The account uses `mysql_old_password` implicitly because the `plugin` column is empty and the password has the pre-4.1 hash format (16 characters).

* The account uses `mysql_old_password` explicitly.

To identify such accounts, use this query:

```sql
SELECT User, Host, Password FROM mysql.user
WHERE (plugin = '' AND LENGTH(Password) = 16)
OR plugin = 'mysql_old_password';
```

The following discussion provides two methods for updating that set of accounts. They have differing characteristics, so read both and decide which is most suitable for a given MySQL installation.

**Method 1.**

Characteristics of this method:

* It requires that server and clients be run with `secure_auth=0` until all users have been upgraded to `mysql_native_password`. (Otherwise, users cannot connect to the server using their old-format password hashes for the purpose of upgrading to a new-format hash.)

* It works for MySQL 5.5 and 5.6. In 5.7, it does not work because the server requires accounts to have a nonempty plugin and disables them otherwise. Therefore, if you have already upgraded to 5.7, choose Method 2, described later.

You should ensure that the server is running with [`secure_auth=0`](server-system-variables.html#sysvar_secure_auth).

For all accounts that use `mysql_old_password` explicitly, set them to the empty plugin:

```sql
UPDATE mysql.user SET plugin = ''
WHERE plugin = 'mysql_old_password';
FLUSH PRIVILEGES;
```

To also expire the password for affected accounts, use these statements instead:

```sql
UPDATE mysql.user SET plugin = '', password_expired = 'Y'
WHERE plugin = 'mysql_old_password';
FLUSH PRIVILEGES;
```

Now affected users can reset their password to use 4.1 hashing. Ask each user who now has an empty plugin to connect to the server and execute these statements:

```sql
SET old_passwords = 0;
SET PASSWORD = PASSWORD('user-chosen-password');
```

Note

The client-side [`--secure-auth`](mysql-command-options.html#option_mysql_secure-auth) option is enabled by default, so remind users to disable it; otherwise, they cannot connect:

```sql
$> mysql -u user_name -p --secure-auth=0
```

After an affected user has executed those statements, you can set the corresponding account plugin to `mysql_native_password` to make the plugin explicit. Or you can periodically run these statements to find and fix any accounts for which affected users have reset their password:

```sql
UPDATE mysql.user SET plugin = 'mysql_native_password'
WHERE plugin = '' AND (Password = '' OR LENGTH(Password) = 41);
FLUSH PRIVILEGES;
```

When there are no more accounts with an empty plugin, this query returns an empty result:

```sql
SELECT User, Host, Password FROM mysql.user
WHERE plugin = '' AND LENGTH(Password) = 16;
```

At that point, all accounts have been migrated away from pre-4.1 password hashing and the server no longer need be run with [`secure_auth=0`](server-system-variables.html#sysvar_secure_auth).

**Method 2.**

Characteristics of this method:

* It assigns each affected account a new password, so you must tell each such user the new password and ask the user to choose a new one. Communication of passwords to users is outside the scope of MySQL, but should be done carefully.

* It does not require server or clients to be run with `secure_auth=0`.

* It works for any version of MySQL 5.5 or later (and for 5.7 has an easier variant).

With this method, you update each account separately due to the need to set passwords individually. *Choose a different password for each account.*

Suppose that `'user1'@'localhost'` is one of the accounts to be upgraded. Modify it as follows:

* In MySQL 5.7, `ALTER USER` provides the capability of modifying both the account password and its authentication plugin, so you need not modify the `mysql.user` system table directly:

  ```sql
  ALTER USER 'user1'@'localhost'
  IDENTIFIED WITH mysql_native_password BY 'DBA-chosen-password';
  ```

  To also expire the account password, use this statement instead:

  ```sql
  ALTER USER 'user1'@'localhost'
  IDENTIFIED WITH mysql_native_password BY 'DBA-chosen-password'
  PASSWORD EXPIRE;
  ```

  Then tell the user the new password and ask the user to connect to the server with that password and execute this statement to choose a new password:

  ```sql
  ALTER USER USER() IDENTIFIED BY 'user-chosen-password';
  ```

* Before MySQL 5.7, you must modify the `mysql.user` system table directly using these statements:

  ```sql
  SET old_passwords = 0;
  UPDATE mysql.user SET plugin = 'mysql_native_password',
  Password = PASSWORD('DBA-chosen-password')
  WHERE (User, Host) = ('user1', 'localhost');
  FLUSH PRIVILEGES;
  ```

  To also expire the account password, use these statements instead:

  ```sql
  SET old_passwords = 0;
  UPDATE mysql.user SET plugin = 'mysql_native_password',
  Password = PASSWORD('DBA-chosen-password'), password_expired = 'Y'
  WHERE (User, Host) = ('user1', 'localhost');
  FLUSH PRIVILEGES;
  ```

  Then tell the user the new password and ask the user to connect to the server with that password and execute these statements to choose a new password:

  ```sql
  SET old_passwords = 0;
  SET PASSWORD = PASSWORD('user-chosen-password');
  ```

Repeat for each account to be upgraded.
