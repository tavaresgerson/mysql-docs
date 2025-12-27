### 6.2.10 Assigning Account Passwords

Required credentials for clients that connect to the MySQL server can include a password. This section describes how to assign passwords for MySQL accounts.

MySQL stores credentials in the `user` table in the `mysql` system database. Operations that assign or modify passwords are permitted only to users with the [`CREATE USER`](privileges-provided.html#priv_create-user) privilege, or, alternatively, privileges for the `mysql` database ([`INSERT`](privileges-provided.html#priv_insert) privilege to create new accounts, [`UPDATE`](privileges-provided.html#priv_update) privilege to modify existing accounts). If the [`read_only`](server-system-variables.html#sysvar_read_only) system variable is enabled, use of account-modification statements such as [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") or [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") additionally requires the [`SUPER`](privileges-provided.html#priv_super) privilege.

The discussion here summarizes syntax only for the most common password-assignment statements. For complete details on other possibilities, see [Section 13.7.1.2, “CREATE USER Statement”](create-user.html "13.7.1.2 CREATE USER Statement"), [Section 13.7.1.1, “ALTER USER Statement”](alter-user.html "13.7.1.1 ALTER USER Statement"), [Section 13.7.1.4, “GRANT Statement”](grant.html "13.7.1.4 GRANT Statement"), and [Section 13.7.1.7, “SET PASSWORD Statement”](set-password.html "13.7.1.7 SET PASSWORD Statement").

MySQL uses plugins to perform client authentication; see [Section 6.2.13, “Pluggable Authentication”](pluggable-authentication.html "6.2.13 Pluggable Authentication"). In password-assigning statements, the authentication plugin associated with an account performs any hashing required of a cleartext password specified. This enables MySQL to obfuscate passwords prior to storing them in the `mysql.user` system table. For the statements described here, MySQL automatically hashes the password specified. There are also syntax for [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") and [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") that permits hashed values to be specified literally. For details, see the descriptions of those statements.

To assign a password when you create a new account, use [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") and include an `IDENTIFIED BY` clause:

```sql
CREATE USER 'jeffrey'@'localhost' IDENTIFIED BY 'password';
```

[`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") also supports syntax for specifying the account authentication plugin. See [Section 13.7.1.2, “CREATE USER Statement”](create-user.html "13.7.1.2 CREATE USER Statement").

To assign or change a password for an existing account, use the [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") statement with an `IDENTIFIED BY` clause:

```sql
ALTER USER 'jeffrey'@'localhost' IDENTIFIED BY 'password';
```

If you are not connected as an anonymous user, you can change your own password without naming your own account literally:

```sql
ALTER USER USER() IDENTIFIED BY 'password';
```

To change an account password from the command line, use the [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") command:

```sql
mysqladmin -u user_name -h host_name password "password"
```

The account for which this command sets the password is the one with a row in the `mysql.user` system table that matches *`user_name`* in the `User` column and the client host *from which you connect* in the `Host` column.

Warning

Setting a password using [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program") should be considered *insecure*. On some systems, your password becomes visible to system status programs such as **ps** that may be invoked by other users to display command lines. MySQL clients typically overwrite the command-line password argument with zeros during their initialization sequence. However, there is still a brief interval during which the value is visible. Also, on some systems this overwriting strategy is ineffective and the password remains visible to **ps**. (SystemV Unix systems and perhaps others are subject to this problem.)

If you are using MySQL Replication, be aware that, currently, a password used by a replica as part of a [`CHANGE MASTER TO`](change-master-to.html "13.4.2.1 CHANGE MASTER TO Statement") statement is effectively limited to 32 characters in length; if the password is longer, any excess characters are truncated. This is not due to any limit imposed by the MySQL Server generally, but rather is an issue specific to MySQL Replication. (For more information, see Bug #43439.)
