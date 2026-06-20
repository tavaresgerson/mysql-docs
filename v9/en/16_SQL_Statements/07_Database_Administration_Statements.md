## 15.7 Database Administration Statements


### 15.7.1 Account Management Statements

MySQL account information is stored in the tables of the `mysql` system schema. This database and the access control system are discussed extensively in Chapter 7, *MySQL Server Administration*, which you should consult for additional details.

Important

Some MySQL releases introduce changes to the grant tables to add new privileges or features. To make sure that you can take advantage of any new capabilities, update your grant tables to the current structure whenever you upgrade MySQL. See Chapter 3, *Upgrading MySQL*.

When the `read_only` system variable is enabled, account-management statements require the `CONNECTION_ADMIN` privilege (or the deprecated `SUPER` privilege), in addition to any other required privileges. This is because they modify tables in the `mysql` system schema.

Account management statements are atomic and crash safe. For more information, see Section 15.1.1, “Atomic Data Definition Statement Support”.


#### 15.7.1.1 ALTER USER Statement

```
ALTER USER [IF EXISTS]
    user [auth_option] [, user [auth_option]] ...
    [REQUIRE {NONE | tls_option [[AND] tls_option] ...}]
    [WITH resource_option [resource_option] ...]
    [password_option | lock_option] ...
    [COMMENT 'comment_string' | ATTRIBUTE 'json_object']

ALTER USER [IF EXISTS]
    USER() user_func_auth_option

ALTER USER [IF EXISTS]
    user [registration_option]

ALTER USER [IF EXISTS]
    USER() [registration_option]

ALTER USER [IF EXISTS]
    user DEFAULT ROLE
    {NONE | ALL | role [, role ] ...}

user:
    (see Section 8.2.4, “Specifying Account Names”)

auth_option: {
    IDENTIFIED BY 'auth_string'
        [REPLACE 'current_auth_string']
        [RETAIN CURRENT PASSWORD]
  | IDENTIFIED BY RANDOM PASSWORD
        [REPLACE 'current_auth_string']
        [RETAIN CURRENT PASSWORD]
  | IDENTIFIED WITH auth_plugin
  | IDENTIFIED WITH auth_plugin BY 'auth_string'
        [REPLACE 'current_auth_string']
        [RETAIN CURRENT PASSWORD]
  | IDENTIFIED WITH auth_plugin BY RANDOM PASSWORD
        [REPLACE 'current_auth_string']
        [RETAIN CURRENT PASSWORD]
  | IDENTIFIED WITH auth_plugin AS 'auth_string'
  | DISCARD OLD PASSWORD
  | ADD factor factor_auth_option [ADD factor factor_auth_option]
  | MODIFY factor factor_auth_option [MODIFY factor factor_auth_option]
  | DROP factor [DROP factor]
}

user_func_auth_option: {
    IDENTIFIED BY 'auth_string'
        [REPLACE 'current_auth_string']
        [RETAIN CURRENT PASSWORD]
  | DISCARD OLD PASSWORD
}

factor_auth_option: {
    IDENTIFIED BY 'auth_string'
  | IDENTIFIED BY RANDOM PASSWORD
  | IDENTIFIED WITH auth_plugin BY 'auth_string'
  | IDENTIFIED WITH auth_plugin BY RANDOM PASSWORD
  | IDENTIFIED WITH auth_plugin AS 'auth_string'
}

registration_option: {
    factor INITIATE REGISTRATION
  | factor FINISH REGISTRATION SET CHALLENGE_RESPONSE AS 'auth_string'
  | factor UNREGISTER
}

factor: {2 | 3} FACTOR

tls_option: {
   SSL
 | X509
 | CIPHER 'cipher'
 | ISSUER 'issuer'
 | SUBJECT 'subject'
}

resource_option: {
    MAX_QUERIES_PER_HOUR count
  | MAX_UPDATES_PER_HOUR count
  | MAX_CONNECTIONS_PER_HOUR count
  | MAX_USER_CONNECTIONS count
}

password_option: {
    PASSWORD EXPIRE [DEFAULT | NEVER | INTERVAL N DAY]
  | PASSWORD HISTORY {DEFAULT | N}
  | PASSWORD REUSE INTERVAL {DEFAULT | N DAY}
  | PASSWORD REQUIRE CURRENT [DEFAULT | OPTIONAL]
  | FAILED_LOGIN_ATTEMPTS N
  | PASSWORD_LOCK_TIME {N | UNBOUNDED}
}

lock_option: {
    ACCOUNT LOCK
  | ACCOUNT UNLOCK
}
```

The `ALTER USER` statement modifies MySQL accounts. It enables authentication, role, SSL/TLS, resource-limit, password-management, comment, and attribute properties to be modified for existing accounts. It can also be used to lock and unlock accounts.

In most cases, `ALTER USER` requires the global `CREATE USER` privilege, or the `UPDATE` privilege for the `mysql` system schema. The exceptions are:

* Any client who connects to the server using a nonanonymous account can change the password for that account. (In particular, you can change your own password.) To see which account the server authenticated you as, invoke the `CURRENT_USER()` function:

  ```
  SELECT CURRENT_USER();
  ```

* For `DEFAULT ROLE` syntax, `ALTER USER` requires these privileges:

  + Setting the default roles for another user requires the global `CREATE USER` privilege, or the `UPDATE` privilege for the `mysql.default_roles` system table.

  + Setting the default roles for yourself requires no special privileges, as long as the roles you want as the default have been granted to you.

* Statements that modify secondary passwords require these privileges:

  + The `APPLICATION_PASSWORD_ADMIN` privilege is required to use the `RETAIN CURRENT PASSWORD` or `DISCARD OLD PASSWORD` clause for [`ALTER USER`](alter-user.html "15.7.1.1 ALTER USER Statement") statements that apply to your own account. The privilege is required to manipulate your own secondary password because most users require only one password.

  + If an account is to be permitted to manipulate secondary passwords for all accounts, it requires the `CREATE USER` privilege rather than `APPLICATION_PASSWORD_ADMIN`.

When the `read_only` system variable is enabled, `ALTER USER` additionally requires the `CONNECTION_ADMIN` privilege (or the deprecated `SUPER` privilege).

These additional privilege considerations also apply:

* The `authentication_policy` system variable places certain constraints on how the authentication-related clauses of [`ALTER USER`](alter-user.html "15.7.1.1 ALTER USER Statement") statements may be used; for details, see the description of that variable. These constraints do not apply if you have the `AUTHENTICATION_POLICY_ADMIN` privilege.

* To modify an account that uses passwordless authentication, you must have the `PASSWORDLESS_USER_ADMIN` privilege.

By default, an error occurs if you try to modify a user that does not exist. If the `IF EXISTS` clause is given, the statement produces a warning for each named user that does not exist, rather than an error.

Important

Under some circumstances, [`ALTER USER`](alter-user.html "15.7.1.1 ALTER USER Statement") may be recorded in server logs or on the client side in a history file such as `~/.mysql_history`, which means that cleartext passwords may be read by anyone having read access to that information. For information about the conditions under which this occurs for the server logs and how to control it, see Section 8.1.2.3, “Passwords and Logging”. For similar information about client-side logging, see Section 6.5.1.3, “mysql Client Logging”.

There are several aspects to the [`ALTER USER`](alter-user.html "15.7.1.1 ALTER USER Statement") statement, described under the following topics:

* ALTER USER Overview
* ALTER USER Authentication Options
* ALTER USER Multifactor Authentication Options
* ALTER USER Registration Options
* ALTER USER Role Options
* ALTER USER SSL/TLS Options
* ALTER USER Resource-Limit Options
* ALTER USER Password-Management Options
* ALTER USER Comment and Attribute Options
* ALTER USER Account-Locking Options
* ALTER USER Binary Logging

##### ALTER USER Overview

For each affected account, [`ALTER USER`](alter-user.html "15.7.1.1 ALTER USER Statement") modifies the corresponding row in the `mysql.user` system table to reflect the properties specified in the statement. Unspecified properties retain their current values.

Each account name uses the format described in Section 8.2.4, “Specifying Account Names”. The host name part of the account name, if omitted, defaults to `'%'`. It is also possible to specify `CURRENT_USER` or `CURRENT_USER()` to refer to the account associated with the current session.

In one case only, the account may be specified with the `USER()` function:

```
ALTER USER USER() IDENTIFIED BY 'auth_string';
```

This syntax enables changing your own password without naming your account literally. (The syntax also supports the `REPLACE`, `RETAIN CURRENT PASSWORD`, and `DISCARD OLD PASSWORD` clauses described at ALTER USER Authentication Options.)

For `ALTER USER` syntax that permits an *`auth_option`* value to follow a *`user`* value, *`auth_option`* indicates how the account authenticates by specifying an account authentication plugin, credentials (for example, a password), or both. Each *`auth_option`* value applies *only* to the account named immediately preceding it.

Following the *`user`* specifications, the statement may include options for SSL/TLS, resource-limit, password-management, and locking properties. All such options are *global* to the statement and apply to *all* accounts named in the statement.

Example: Change an account's password and expire it. As a result, the user must connect with the named password and choose a new one at the next connection:

```
ALTER USER 'jeffrey'@'localhost'
  IDENTIFIED BY 'new_password' PASSWORD EXPIRE;
```

Example: Modify an account to use the `caching_sha2_password` authentication plugin and the given password. Require that a new password be chosen every 180 days, and enable failed-login tracking, such that three consecutive incorrect passwords cause temporary account locking for two days:

```
ALTER USER 'jeffrey'@'localhost'
  IDENTIFIED WITH caching_sha2_password BY 'new_password'
  PASSWORD EXPIRE INTERVAL 180 DAY
  FAILED_LOGIN_ATTEMPTS 3 PASSWORD_LOCK_TIME 2;
```

Example: Lock or unlock an account:

```
ALTER USER 'jeffrey'@'localhost' ACCOUNT LOCK;
ALTER USER 'jeffrey'@'localhost' ACCOUNT UNLOCK;
```

Example: Require an account to connect using SSL and establish a limit of 20 connections per hour:

```
ALTER USER 'jeffrey'@'localhost'
  REQUIRE SSL WITH MAX_CONNECTIONS_PER_HOUR 20;
```

Example: Alter multiple accounts, specifying some per-account properties and some global properties:

```
ALTER USER
  'jeffrey'@'localhost'
    IDENTIFIED BY 'jeffrey_new_password',
  'jeanne'@'localhost',
  'josh'@'localhost'
    IDENTIFIED BY 'josh_new_password'
    REPLACE 'josh_current_password'
    RETAIN CURRENT PASSWORD
  REQUIRE SSL WITH MAX_USER_CONNECTIONS 2
  PASSWORD HISTORY 5;
```

The `IDENTIFIED BY` value following `jeffrey` applies only to its immediately preceding account, so it changes the password to `'jeffrey_new_password'` only for `jeffrey`. For `jeanne`, there is no per-account value (thus leaving the password unchanged). For `josh`, `IDENTIFIED BY` establishes a new password (`'josh_new_password'`), `REPLACE` is specified to verify that the user issuing the `ALTER USER` statement knows the current password (`'josh_current_password'`), and that current password is also retained as the account secondary password. (As a result, `josh` can connect with either the primary or secondary password.)

The remaining properties apply globally to all accounts named in the statement, so for both accounts:

* Connections are required to use SSL.
* The account can be used for a maximum of two simultaneous connections.

* Password changes cannot reuse any of the five most recent passwords.

Example: Discard the secondary password for `josh`, leaving the account with only its primary password:

```
ALTER USER 'josh'@'localhost' DISCARD OLD PASSWORD;
```

In the absence of a particular type of option, the account remains unchanged in that respect. For example, with no locking option, the locking state of the account is not changed.

##### ALTER USER Authentication Options

An account name may be followed by an *`auth_option`* authentication option that specifies the account authentication plugin, credentials, or both. It may also include a password-verification clause that specifies the account current password to be replaced, and clauses that manage whether an account has a secondary password.

Note

Clauses for random password generation, password verification, and secondary passwords apply only to accounts that use an authentication plugin that stores credentials internally to MySQL. For accounts that use a plugin that performs authentication against a credentials system that is external to MySQL, password management must be handled externally against that system as well. For more information about internal credentials storage, see Section 8.2.15, “Password Management”.

* *`auth_plugin`* names an authentication plugin. The plugin name can be a quoted string literal or an unquoted name. Plugin names are stored in the `plugin` column of the `mysql.user` system table.

  For *`auth_option`* syntax that does not specify an authentication plugin, the server assigns the default plugin, determined as described in The Default Authentication Plugin. For descriptions of each plugin, see Section 8.4.1, “Authentication Plugins”.

* Credentials that are stored internally are stored in the `mysql.user` system table. An `'auth_string'` value or `RANDOM PASSWORD` specifies account credentials, either as a cleartext (unencrypted) string or hashed in the format expected by the authentication plugin associated with the account, respectively:

  + For syntax that uses `BY 'auth_string'`, the string is cleartext and is passed to the authentication plugin for possible hashing. The result returned by the plugin is stored in the `mysql.user` table. A plugin may use the value as specified, in which case no hashing occurs.

  + For syntax that uses `BY RANDOM PASSWORD`, MySQL generates a random password and as cleartext and passes it to the authentication plugin for possible hashing. The result returned by the plugin is stored in the `mysql.user` table. A plugin may use the value as specified, in which case no hashing occurs.

    Randomly generated passwords have the characteristics described in Random Password Generation.

  + For syntax that uses `AS 'auth_string'`, the string is assumed to be already in the format the authentication plugin requires, and is stored as is in the `mysql.user` table. If a plugin requires a hashed value, the value must be already hashed in a format appropriate for the plugin; otherwise, the value cannot be used by the plugin and correct authentication of client connections does not occur.

    A hashed string can be either a string literal or a hexadecimal value. The latter corresponds to the type of value displayed by [`SHOW CREATE USER`](show-create-user.html "15.7.7.14 SHOW CREATE USER Statement") for password hashes containing unprintable characters when the `print_identified_with_as_hex` system variable is enabled.

  + If an authentication plugin performs no hashing of the authentication string, the `BY 'auth_string'` and `AS 'auth_string'` clauses have the same effect: The authentication string is stored as is in the `mysql.user` system table.

* The `REPLACE 'current_auth_string'` clause performs password verification. If given:

  + `REPLACE` specifies the account current password to be replaced, as a cleartext (unencrypted) string.

  + The clause must be given if password changes for the account are required to specify the current password, as verification that the user attempting to make the change actually knows the current password.

  + The clause is optional if password changes for the account may but need not specify the current password.

  + The statement fails if the clause is given but does not match the current password, even if the clause is optional.

  + `REPLACE` can be specified only when changing the account password for the current user.

  For more information about password verification by specifying the current password, see Section 8.2.15, “Password Management”.

* The `RETAIN CURRENT PASSWORD` and `DISCARD OLD PASSWORD` clauses implement dual-password capability. Both are optional, but if given, have the following effects:

  + `RETAIN CURRENT PASSWORD` retains an account current password as its secondary password, replacing any existing secondary password. The new password becomes the primary password, but clients can use the account to connect to the server using either the primary or secondary password. (Exception: If the new password specified by the `ALTER USER` statement is empty, the secondary password becomes empty as well, even if `RETAIN CURRENT PASSWORD` is given.)

  + If you specify `RETAIN CURRENT PASSWORD` for an account that has an empty primary password, the statement fails.

  + If an account has a secondary password and you change its primary password without specifying `RETAIN CURRENT PASSWORD`, the secondary password remains unchanged.

  + If you change the authentication plugin assigned to the account, the secondary password is discarded. If you change the authentication plugin and also specify `RETAIN CURRENT PASSWORD`, the statement fails.

  + `DISCARD OLD PASSWORD` discards the secondary password, if one exists. The account retains only its primary password, and clients can use the account to connect to the server only with the primary password.

  For more information about use of dual passwords, see Section 8.2.15, “Password Management”.

`ALTER USER` permits these *`auth_option`* syntaxes:

* `IDENTIFIED BY 'auth_string' [REPLACE 'current_auth_string'] [RETAIN CURRENT PASSWORD]`

  Sets the account authentication plugin to the default plugin, passes the cleartext `'auth_string'` value to the plugin for possible hashing, and stores the result in the account row in the `mysql.user` system table.

  The `REPLACE` clause, if given, specifies the account current password, as described previously in this section.

  The `RETAIN CURRENT PASSWORD` clause, if given, causes the account current password to be retained as its secondary password, as described previously in this section.

* `IDENTIFIED BY RANDOM PASSWORD [REPLACE 'current_auth_string'] [RETAIN CURRENT PASSWORD]`

  Sets the account authentication plugin to the default plugin, generates a random password, passes the cleartext password value to the plugin for possible hashing, and stores the result in the account row in the `mysql.user` system table. The statement also returns the cleartext password in a result set to make it available to the user or application executing the statement. For details about the result set and characteristics of randomly generated passwords, see Random Password Generation.

  The `REPLACE` clause, if given, specifies the account current password, as described previously in this section.

  The `RETAIN CURRENT PASSWORD` clause, if given, causes the account current password to be retained as its secondary password, as described previously in this section.

* `IDENTIFIED WITH auth_plugin`

  Sets the account authentication plugin to *`auth_plugin`*, clears the credentials to the empty string (the credentials are associated with the old authentication plugin, not the new one), and stores the result in the account row in the `mysql.user` system table.

  In addition, the password is marked expired. The user must choose a new one when next connecting.

* `IDENTIFIED WITH auth_plugin BY 'auth_string' [REPLACE 'current_auth_string'] [RETAIN CURRENT PASSWORD]`

  Sets the account authentication plugin to *`auth_plugin`*, passes the cleartext `'auth_string'` value to the plugin for possible hashing, and stores the result in the account row in the `mysql.user` system table.

  The `REPLACE` clause, if given, specifies the account current password, as described previously in this section.

  The `RETAIN CURRENT PASSWORD` clause, if given, causes the account current password to be retained as its secondary password, as described previously in this section.

* `IDENTIFIED WITH auth_plugin BY RANDOM PASSWORD [REPLACE 'current_auth_string'] [RETAIN CURRENT PASSWORD]`

  Sets the account authentication plugin to *`auth_plugin`*, generates a random password, passes the cleartext password value to the plugin for possible hashing, and stores the result in the account row in the `mysql.user` system table. The statement also returns the cleartext password in a result set to make it available to the user or application executing the statement. For details about the result set and characteristics of randomly generated passwords, see Random Password Generation.

  The `REPLACE` clause, if given, specifies the account current password, as described previously in this section.

  The `RETAIN CURRENT PASSWORD` clause, if given, causes the account current password to be retained as its secondary password, as described previously in this section.

* `IDENTIFIED WITH auth_plugin AS 'auth_string'`

  Sets the account authentication plugin to *`auth_plugin`* and stores the `'auth_string'` value as is in the `mysql.user` account row. If the plugin requires a hashed string, the string is assumed to be already hashed in the format the plugin requires.

* `DISCARD OLD PASSWORD`

  Discards the account secondary password, if there is one, as described previously in this section.

Example: Specify the password as cleartext; the default plugin is used:

```
ALTER USER 'jeffrey'@'localhost'
  IDENTIFIED BY 'password';
```

Example: Specify the authentication plugin, along with a cleartext password value:

```
ALTER USER 'jeffrey'@'localhost'
  IDENTIFIED WITH sha2_password
             BY 'password';
```

Example: Like the preceding example, but in addition, specify the current password as a cleartext value to satisfy any account requirement that the user making the change knows that password:

```
ALTER USER 'jeffrey'@'localhost'
  IDENTIFIED WITH sha2_password
             BY 'password'
             REPLACE 'current_password';
```

The preceding statement fails unless the current user is `jeffrey` because `REPLACE` is permitted only for changes to the current user's password.

Example: Establish a new primary password and retain the existing password as the secondary password:

```
ALTER USER 'jeffrey'@'localhost'
  IDENTIFIED BY 'new_password'
  RETAIN CURRENT PASSWORD;
```

Example: Discard the secondary password, leaving the account with only its primary password:

```
ALTER USER 'jeffery'@'localhost' DISCARD OLD PASSWORD;
```

Example: Specify the authentication plugin, along with a hashed password value:

```
ALTER USER 'jeffrey'@'localhost'
  IDENTIFIED WITH caching_sha2_password
             AS '*6C8989366EAF75BB670AD8EA7A7FC1176A95CEF4';
```

For additional information about setting passwords and authentication plugins, see Section 8.2.14, “Assigning Account Passwords”, and Section 8.2.17, “Pluggable Authentication”.

##### ALTER USER Multifactor Authentication Options

`ALTER USER` has `ADD`, `MODIFY`, and `DROP` clauses that enable authentication factors to be added, modified, or dropped. In each case, the clause specifies an operation to perform on one authentication factor, and optionally an operation on another authentication factor. For each operation, the *`factor`* item specifies the `FACTOR` keyword preceded by the number 2 or 3 to indicate whether the operation applies to the second or third authentication factor. (1 is not permitted in this context. To act on the first authentication factor, use the syntax described in ALTER USER Authentication Options.)

`ALTER USER` multifactor authentication clause constraints are defined by the `authentication_policy` system variable. For example, the `authentication_policy` setting controls the number of authentication factors that accounts may have, and for each factor, which authentication methods are permitted. See Configuring the Multifactor Authentication Policy.

When `ALTER USER` adds, modifies, or drops second and third factors in a single statement, operations are executed sequentially, but if any operation in the sequence fails the entire [`ALTER USER`](alter-user.html "15.7.1.1 ALTER USER Statement") statement fails.

For `ADD`, each named factor must not already exist or it cannot be added. For `MODIFY` and `DROP`, each named factor must exist to be modified or dropped. If a second and third factor are defined, dropping the second factor causes the third factor to take its place as the second factor.

This statement drops authentication factors 2 and 3, which has the effect of converting the account from 3FA to 1FA:

```
ALTER USER 'user' DROP 2 FACTOR 3 FACTOR;
```

For additional `ADD`, `MODIFY`, and `DROP` examples, see Getting Started with Multifactor Authentication.

For information about factor-specific rules that determine the default authentication plugin for authentication clauses that do not name a plugin, see The Default Authentication Plugin.

##### ALTER USER Registration Options

`ALTER USER` has clauses that enable FIDO/FIDO2 devices to be registered and unregistered. For more information, see Using WebAuthn Authentication, Device Unregistration for WebAuthn, and the **mysql** client `--register-factor` option description.

The **mysql** client `--register-factor` option, used for FIDO/FIDO2 device registration, causes the **mysql** client to generate and execute `INITIATE REGISTRATION` and `FINISH REGISTRATION` statements. These statements are not intended for manual execution.

##### ALTER USER Role Options

[`ALTER USER ... DEFAULT ROLE`](alter-user.html "15.7.1.1 ALTER USER Statement") defines which roles become active when the user connects to the server and authenticates, or when the user executes the [`SET ROLE DEFAULT`](set-role.html "15.7.1.11 SET ROLE Statement") statement during a session.

[`ALTER USER ... DEFAULT ROLE`](alter-user.html "15.7.1.1 ALTER USER Statement") is alternative syntax for `SET DEFAULT ROLE` (see Section 15.7.1.9, “SET DEFAULT ROLE Statement”). However, `ALTER USER` can set the default for only a single user, whereas [`SET DEFAULT ROLE`](set-default-role.html "15.7.1.9 SET DEFAULT ROLE Statement") can set the default for multiple users. On the other hand, you can specify `CURRENT_USER` as the user name for the `ALTER USER` statement, whereas you cannot for [`SET DEFAULT ROLE`](set-default-role.html "15.7.1.9 SET DEFAULT ROLE Statement").

Each user account name uses the format described previously.

Each role name uses the format described in Section 8.2.5, “Specifying Role Names”. For example:

```
ALTER USER 'joe'@'10.0.0.1' DEFAULT ROLE administrator, developer;
```

The host name part of the role name, if omitted, defaults to `'%'`.

The clause following the `DEFAULT ROLE` keywords permits these values:

* `NONE`: Set the default to `NONE` (no roles).

* `ALL`: Set the default to all roles granted to the account.

* `role [, role ] ...`: Set the default to the named roles, which must exist and be granted to the account at the time [`ALTER USER ... DEFAULT ROLE`](alter-user.html "15.7.1.1 ALTER USER Statement") is executed.

##### ALTER USER SSL/TLS Options

MySQL can check X.509 certificate attributes in addition to the usual authentication that is based on the user name and credentials. For background information on the use of SSL/TLS with MySQL, see Section 8.3, “Using Encrypted Connections”.

To specify SSL/TLS-related options for a MySQL account, use a `REQUIRE` clause that specifies one or more *`tls_option`* values.

Order of `REQUIRE` options does not matter, but no option can be specified twice. The `AND` keyword is optional between `REQUIRE` options.

`ALTER USER` permits these *`tls_option`* values:

* `NONE`

  Indicates that all accounts named by the statement have no SSL or X.509 requirements. Unencrypted connections are permitted if the user name and password are valid. Encrypted connections can be used, at the client's option, if the client has the proper certificate and key files.

  ```
  ALTER USER 'jeffrey'@'localhost' REQUIRE NONE;
  ```

  Clients attempt to establish a secure connection by default. For clients that have `REQUIRE NONE`, the connection attempt falls back to an unencrypted connection if a secure connection cannot be established. To require an encrypted connection, a client need specify only the `--ssl-mode=REQUIRED` option; the connection attempt fails if a secure connection cannot be established.

* `SSL`

  Tells the server to permit only encrypted connections for all accounts named by the statement.

  ```
  ALTER USER 'jeffrey'@'localhost' REQUIRE SSL;
  ```

  Clients attempt to establish a secure connection by default. For accounts that have `REQUIRE SSL`, the connection attempt fails if a secure connection cannot be established.

* `X509`

  For all accounts named by the statement, requires that clients present a valid certificate, but the exact certificate, issuer, and subject do not matter. The only requirement is that it should be possible to verify its signature with one of the CA certificates. Use of X.509 certificates always implies encryption, so the `SSL` option is unnecessary in this case.

  ```
  ALTER USER 'jeffrey'@'localhost' REQUIRE X509;
  ```

  For accounts with `REQUIRE X509`, clients must specify the `--ssl-key` and `--ssl-cert` options to connect. (It is recommended but not required that `--ssl-ca` also be specified so that the public certificate provided by the server can be verified.) This is true for `ISSUER` and `SUBJECT` as well because those `REQUIRE` options imply the requirements of `X509`.

* `ISSUER 'issuer'`

  For all accounts named by the statement, requires that clients present a valid X.509 certificate issued by CA `'issuer'`. If a client presents a certificate that is valid but has a different issuer, the server rejects the connection. Use of X.509 certificates always implies encryption, so the `SSL` option is unnecessary in this case.

  ```
  ALTER USER 'jeffrey'@'localhost'
    REQUIRE ISSUER '/C=SE/ST=Stockholm/L=Stockholm/
      O=MySQL/CN=CA/emailAddress=ca@example.com';
  ```

  Because `ISSUER` implies the requirements of `X509`, clients must specify the `--ssl-key` and `--ssl-cert` options to connect. (It is recommended but not required that `--ssl-ca` also be specified so that the public certificate provided by the server can be verified.)

* `SUBJECT 'subject'`

  For all accounts named by the statement, requires that clients present a valid X.509 certificate containing the subject *`subject`*. If a client presents a certificate that is valid but has a different subject, the server rejects the connection. Use of X.509 certificates always implies encryption, so the `SSL` option is unnecessary in this case.

  ```
  ALTER USER 'jeffrey'@'localhost'
    REQUIRE SUBJECT '/C=SE/ST=Stockholm/L=Stockholm/
      O=MySQL demo client certificate/
      CN=client/emailAddress=client@example.com';
  ```

  MySQL does a simple string comparison of the `'subject'` value to the value in the certificate, so lettercase and component ordering must be given exactly as present in the certificate.

  Because `SUBJECT` implies the requirements of `X509`, clients must specify the `--ssl-key` and `--ssl-cert` options to connect. (It is recommended but not required that `--ssl-ca` also be specified so that the public certificate provided by the server can be verified.)

* `CIPHER 'cipher'`

  For all accounts named by the statement, requires a specific cipher method for encrypting connections. This option is needed to ensure that ciphers and key lengths of sufficient strength are used. Encryption can be weak if old algorithms using short encryption keys are used.

  ```
  ALTER USER 'jeffrey'@'localhost'
    REQUIRE CIPHER 'EDH-RSA-DES-CBC3-SHA';
  ```

The `SUBJECT`, `ISSUER`, and `CIPHER` options can be combined in the `REQUIRE` clause:

```
ALTER USER 'jeffrey'@'localhost'
  REQUIRE SUBJECT '/C=SE/ST=Stockholm/L=Stockholm/
    O=MySQL demo client certificate/
    CN=client/emailAddress=client@example.com'
  AND ISSUER '/C=SE/ST=Stockholm/L=Stockholm/
    O=MySQL/CN=CA/emailAddress=ca@example.com'
  AND CIPHER 'EDH-RSA-DES-CBC3-SHA';
```

##### ALTER USER Resource-Limit Options

It is possible to place limits on use of server resources by an account, as discussed in Section 8.2.21, “Setting Account Resource Limits”. To do so, use a `WITH` clause that specifies one or more *`resource_option`* values.

Order of `WITH` options does not matter, except that if a given resource limit is specified multiple times, the last instance takes precedence.

`ALTER USER` permits these *`resource_option`* values:

* `MAX_QUERIES_PER_HOUR count`, `MAX_UPDATES_PER_HOUR count`, `MAX_CONNECTIONS_PER_HOUR count`

  For all accounts named by the statement, these options restrict how many queries, updates, and connections to the server are permitted to each account during any given one-hour period. If *`count`* is `0` (the default), this means that there is no limitation for the account.

* `MAX_USER_CONNECTIONS count`

  For all accounts named by the statement, restricts the maximum number of simultaneous connections to the server by each account. A nonzero *`count`* specifies the limit for the account explicitly. If *`count`* is `0` (the default), the server determines the number of simultaneous connections for the account from the global value of the `max_user_connections` system variable. If `max_user_connections` is also zero, there is no limit for the account.

Example:

```
ALTER USER 'jeffrey'@'localhost'
  WITH MAX_QUERIES_PER_HOUR 500 MAX_UPDATES_PER_HOUR 100;
```

##### ALTER USER Password-Management Options

`ALTER USER` supports several *`password_option`* values for password management:

* Password expiration options: You can expire an account password manually and establish its password expiration policy. Policy options do not expire the password. Instead, they determine how the server applies automatic expiration to the account based on password age, which is assessed from the date and time of the most recent account password change.

* Password reuse options: You can restrict password reuse based on number of password changes, time elapsed, or both.

* Password verification-required options: You can indicate whether attempts to change an account password must specify the current password, as verification that the user attempting to make the change actually knows the current password.

* Incorrect-password failed-login tracking options: You can cause the server to track failed login attempts and temporarily lock accounts for which too many consecutive incorrect passwords are given. The required number of failures and the lock time are configurable.

This section describes the syntax for password-management options. For information about establishing policy for password management, see Section 8.2.15, “Password Management”.

If multiple password-management options of a given type are specified, the last one takes precedence. For example, `PASSWORD EXPIRE DEFAULT PASSWORD EXPIRE NEVER` is the same as `PASSWORD EXPIRE NEVER`.

Note

Except for the options that pertain to failed-login tracking, password-management options apply only to accounts that use an authentication plugin that stores credentials internally to MySQL. For accounts that use a plugin that performs authentication against a credentials system that is external to MySQL, password management must be handled externally against that system as well. For more information about internal credentials storage, see Section 8.2.15, “Password Management”.

A client has an expired password if the account password was expired manually or the password age is considered greater than its permitted lifetime per the automatic expiration policy. In this case, the server either disconnects the client or restricts the operations permitted to it (see Section 8.2.16, “Server Handling of Expired Passwords”). Operations performed by a restricted client result in an error until the user establishes a new account password.

Note

Although it is possible to “reset” an expired password by setting it to its current value, it is preferable, as a matter of good policy, to choose a different password. DBAs can enforce non-reuse by establishing an appropriate password-reuse policy. See Password Reuse Policy.

`ALTER USER` permits these *`password_option`* values for controlling password expiration:

* `PASSWORD EXPIRE`

  Immediately marks the password expired for all accounts named by the statement.

  ```
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE;
  ```

* `PASSWORD EXPIRE DEFAULT`

  Sets all accounts named by the statement so that the global expiration policy applies, as specified by the `default_password_lifetime` system variable.

  ```
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE DEFAULT;
  ```

* `PASSWORD EXPIRE NEVER`

  This expiration option overrides the global policy for all accounts named by the statement. For each, it disables password expiration so that the password never expires.

  ```
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE NEVER;
  ```

* `PASSWORD EXPIRE INTERVAL N DAY`

  This expiration option overrides the global policy for all accounts named by the statement. For each, it sets the password lifetime to *`N`* days. The following statement requires the password to be changed every 180 days:

  ```
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE INTERVAL 180 DAY;
  ```

`ALTER USER` permits these *`password_option`* values for controlling reuse of previous passwords based on required minimum number of password changes:

* `PASSWORD HISTORY DEFAULT`

  Sets all accounts named by the statement so that the global policy about password history length applies, to prohibit reuse of passwords before the number of changes specified by the `password_history` system variable.

  ```
  ALTER USER 'jeffrey'@'localhost' PASSWORD HISTORY DEFAULT;
  ```

* `PASSWORD HISTORY N`

  This history-length option overrides the global policy for all accounts named by the statement. For each, it sets the password history length to *`N`* passwords, to prohibit reusing any of the *`N`* most recently chosen passwords. The following statement prohibits reuse of any of the previous 6 passwords:

  ```
  ALTER USER 'jeffrey'@'localhost' PASSWORD HISTORY 6;
  ```

`ALTER USER` permits these *`password_option`* values for controlling reuse of previous passwords based on time elapsed:

* `PASSWORD REUSE INTERVAL DEFAULT`

  Sets all statements named by the account so that the global policy about time elapsed applies, to prohibit reuse of passwords newer than the number of days specified by the `password_reuse_interval` system variable.

  ```
  ALTER USER 'jeffrey'@'localhost' PASSWORD REUSE INTERVAL DEFAULT;
  ```

* `PASSWORD REUSE INTERVAL N DAY`

  This time-elapsed option overrides the global policy for all accounts named by the statement. For each, it sets the password reuse interval to *`N`* days, to prohibit reuse of passwords newer than that many days. The following statement prohibits password reuse for 360 days:

  ```
  ALTER USER 'jeffrey'@'localhost' PASSWORD REUSE INTERVAL 360 DAY;
  ```

`ALTER USER` permits these *`password_option`* values for controlling whether attempts to change an account password must specify the current password, as verification that the user attempting to make the change actually knows the current password:

* `PASSWORD REQUIRE CURRENT`

  This verification option overrides the global policy for all accounts named by the statement. For each, it requires that password changes specify the current password.

  ```
  ALTER USER 'jeffrey'@'localhost' PASSWORD REQUIRE CURRENT;
  ```

* `PASSWORD REQUIRE CURRENT OPTIONAL`

  This verification option overrides the global policy for all accounts named by the statement. For each, it does not require that password changes specify the current password. (The current password may but need not be given.)

  ```
  ALTER USER 'jeffrey'@'localhost' PASSWORD REQUIRE CURRENT OPTIONAL;
  ```

* `PASSWORD REQUIRE CURRENT DEFAULT`

  Sets all statements named by the account so that the global policy about password verification applies, as specified by the `password_require_current` system variable.

  ```
  ALTER USER 'jeffrey'@'localhost' PASSWORD REQUIRE CURRENT DEFAULT;
  ```

`ALTER USER` permits these *`password_option`* values for controlling failed-login tracking:

* `FAILED_LOGIN_ATTEMPTS N`

  Whether to track account login attempts that specify an incorrect password. *`N`* must be a number from 0 to 32767. A value of 0 disables failed-login tracking. Values greater than 0 indicate how many consecutive password failures cause temporary account locking (if `PASSWORD_LOCK_TIME` is also nonzero).

* `PASSWORD_LOCK_TIME {N | UNBOUNDED}`

  How long to lock the account after too many consecutive login attempts provide an incorrect password. *`N`* must be a number from 0 to 32767, or `UNBOUNDED`. A value of 0 disables temporary account locking. Values greater than 0 indicate how long to lock the account in days. A value of `UNBOUNDED` causes the account locking duration to be unbounded; once locked, the account remains in a locked state until unlocked. For information about the conditions under which unlocking occurs, see Failed-Login Tracking and Temporary Account Locking.

For failed-login tracking and temporary locking to occur, an account's `FAILED_LOGIN_ATTEMPTS` and `PASSWORD_LOCK_TIME` options both must be nonzero. The following statement modifies an account such that it remains locked for two days after four consecutive password failures:

```
ALTER USER 'jeffrey'@'localhost'
  FAILED_LOGIN_ATTEMPTS 4 PASSWORD_LOCK_TIME 2;
```

##### ALTER USER Comment and Attribute Options

MySQL 9.5 supports user comments and user attributes, as described in Section 15.7.1.3, “CREATE USER Statement”. These can be modified employing `ALTER USER` by means of the `COMMENT` and `ATTRIBUTE` options, respectively. You cannot specify both options in the same `ALTER USER` statement; attempting to do so results in a syntax error.

The user comment and user attribute are stored in the Information Schema `USER_ATTRIBUTES` table as a JSON object; the user comment is stored as the value for a `comment` key in the ATTRIBUTE column of this table, as shown later in this discussion. The `COMMENT` text can be any arbitrary quoted text, and replaces any existing user comment. The `ATTRIBUTE` value must be the valid string representation of a JSON object. This is merged with any existing user attribute as if the `JSON_MERGE_PATCH()` function had been used on the existing user attribute and the new one; for any keys that are re-used, the new value overwrites the old one, as shown here:

```
mysql> SELECT * FROM INFORMATION_SCHEMA.USER_ATTRIBUTES
    ->     WHERE USER='bill' AND HOST='localhost';
+------+-----------+----------------+
| USER | HOST      | ATTRIBUTE      |
+------+-----------+----------------+
| bill | localhost | {"foo": "bar"} |
+------+-----------+----------------+
1 row in set (0.11 sec)

mysql> ALTER USER 'bill'@'localhost' ATTRIBUTE '{"baz": "faz", "foo": "moo"}';
Query OK, 0 rows affected (0.22 sec)

mysql> SELECT * FROM INFORMATION_SCHEMA.USER_ATTRIBUTES
    ->     WHERE USER='bill' AND HOST='localhost';
+------+-----------+------------------------------+
| USER | HOST      | ATTRIBUTE                    |
+------+-----------+------------------------------+
| bill | localhost | {"baz": "faz", "foo": "moo"} |
+------+-----------+------------------------------+
1 row in set (0.00 sec)
```

To remove a key and its value from the user attribute, set the key to JSON `null` (must be lowercase and unquoted), like this:

```
mysql> ALTER USER 'bill'@'localhost' ATTRIBUTE '{"foo": null}';
Query OK, 0 rows affected (0.08 sec)

mysql> SELECT * FROM INFORMATION_SCHEMA.USER_ATTRIBUTES
    ->     WHERE USER='bill' AND HOST='localhost';
+------+-----------+----------------+
| USER | HOST      | ATTRIBUTE      |
+------+-----------+----------------+
| bill | localhost | {"baz": "faz"} |
+------+-----------+----------------+
1 row in set (0.00 sec)
```

To set an existing user comment to an empty string, use `ALTER USER ... COMMENT ''`. This leaves an empty `comment` value in the `USER_ATTRIBUTES` table; to remove the user comment completely, use `ALTER USER ... ATTRIBUTE ...` with the value for the column key set to JSON `null` (unquoted, in lower case). This is illustrated by the following sequence of SQL statements:

```
mysql> ALTER USER 'bill'@'localhost' COMMENT 'Something about Bill';
Query OK, 0 rows affected (0.06 sec)

mysql> SELECT * FROM INFORMATION_SCHEMA.USER_ATTRIBUTES
    ->     WHERE USER='bill' AND HOST='localhost';
+------+-----------+---------------------------------------------------+
| USER | HOST      | ATTRIBUTE                                         |
+------+-----------+---------------------------------------------------+
| bill | localhost | {"baz": "faz", "comment": "Something about Bill"} |
+------+-----------+---------------------------------------------------+
1 row in set (0.00 sec)

mysql> ALTER USER 'bill'@'localhost' COMMENT '';
Query OK, 0 rows affected (0.09 sec)

mysql> SELECT * FROM INFORMATION_SCHEMA.USER_ATTRIBUTES
    ->     WHERE USER='bill' AND HOST='localhost';
+------+-----------+-------------------------------+
| USER | HOST      | ATTRIBUTE                     |
+------+-----------+-------------------------------+
| bill | localhost | {"baz": "faz", "comment": ""} |
+------+-----------+-------------------------------+
1 row in set (0.00 sec)

mysql> ALTER USER 'bill'@'localhost' ATTRIBUTE '{"comment": null}';
Query OK, 0 rows affected (0.07 sec)

mysql> SELECT * FROM INFORMATION_SCHEMA.USER_ATTRIBUTES
    ->     WHERE USER='bill' AND HOST='localhost';
+------+-----------+----------------+
| USER | HOST      | ATTRIBUTE      |
+------+-----------+----------------+
| bill | localhost | {"baz": "faz"} |
+------+-----------+----------------+
1 row in set (0.00 sec)
```

##### ALTER USER Account-Locking Options

MySQL supports account locking and unlocking using the `ACCOUNT LOCK` and `ACCOUNT UNLOCK` options, which specify the locking state for an account. For additional discussion, see Section 8.2.20, “Account Locking”.

If multiple account-locking options are specified, the last one takes precedence.

[`ALTER USER ... ACCOUNT UNLOCK`](alter-user.html "15.7.1.1 ALTER USER Statement") unlocks any account named by the statement that is temporarily locked due to too many failed logins. See Section 8.2.15, “Password Management”.

##### ALTER USER Binary Logging

`ALTER USER` is written to the binary log if it succeeds, but not if it fails; in that case, rollback occurs and no changes are made. A statement written to the binary log includes all named users. If the `IF EXISTS` clause is given, this includes even users that do not exist and were not altered.

If the original statement changes the credentials for a user, the statement written to the binary log specifies the applicable authentication plugin for that user, determined as follows:

* The plugin named in the original statement, if one was specified.

* Otherwise, the plugin associated with the user account if the user exists, or the default authentication plugin if the user does not exist. (If the statement written to the binary log must specify a particular authentication plugin for a user, include it in the original statement.)

If the server adds the default authentication plugin for any users in the statement written to the binary log, it writes a warning to the error log naming those users.

If the original statement specifies the `FAILED_LOGIN_ATTEMPTS` or `PASSWORD_LOCK_TIME` option, the statement written to the binary log includes the option.

`ALTER USER` statements with clauses that support multifactor authentication (MFA) are written to the binary log with the exception of `ALTER USER user factor INITIATE REGISTRATION` statements.

* `ALTER USER user factor FINISH REGISTRATION SET CHALLENGE_RESPONSE AS 'auth_string'` statements are written to the binary log as `ALTER USER user MODIFY factor IDENTIFIED WITH authentication_webauthn AS webauthn_hash_string`;

* In a replication context, the replication user requires `PASSWORDLESS_USER_ADMIN` privilege to execute `ALTER USER ... MODIFY` operations on accounts configured for passwordless authentication using the `authentication_webauthn` plugin.


#### 15.7.1.2 CREATE ROLE Statement

```
CREATE ROLE [IF NOT EXISTS] role [, role ] ...
```

`CREATE ROLE` creates one or more roles, which are named collections of privileges. To use this statement, you must have the global [`CREATE ROLE`](privileges-provided.html#priv_create-role) or `CREATE USER` privilege. When the `read_only` system variable is enabled, [`CREATE ROLE`](create-role.html "15.7.1.2 CREATE ROLE Statement") additionally requires the `CONNECTION_ADMIN` privilege (or the deprecated `SUPER` privilege).

A role when created is locked, has no password, and is assigned the default authentication plugin. (These role attributes can be changed later with the `ALTER USER` statement, by users who have the global `CREATE USER` privilege.)

`CREATE ROLE` either succeeds for all named roles or rolls back and has no effect if any error occurs. By default, an error occurs if you try to create a role that already exists. If the `IF NOT EXISTS` clause is given, the statement produces a warning for each named role that already exists, rather than an error.

The statement is written to the binary log if it succeeds, but not if it fails; in that case, rollback occurs and no changes are made. A statement written to the binary log includes all named roles. If the `IF NOT EXISTS` clause is given, this includes even roles that already exist and were not created.

Each role name uses the format described in Section 8.2.5, “Specifying Role Names”. For example:

```
CREATE ROLE 'admin', 'developer';
CREATE ROLE 'webapp'@'localhost';
```

The host name part of the role name, if omitted, defaults to `'%'`.

For role usage examples, see Section 8.2.10, “Using Roles”.


#### 15.7.1.3 CREATE USER Statement

```
CREATE USER [IF NOT EXISTS]
    user [auth_option] [, user [auth_option]] ...
    DEFAULT ROLE role [, role ] ...
    [REQUIRE {NONE | tls_option [[AND] tls_option] ...}]
    [WITH resource_option [resource_option] ...]
    [password_option | lock_option] ...
    [COMMENT 'comment_string' | ATTRIBUTE 'json_object']

user:
    (see Section 8.2.4, “Specifying Account Names”)

auth_option: {
    IDENTIFIED BY 'auth_string' [AND 2fa_auth_option]
  | IDENTIFIED BY RANDOM PASSWORD [AND 2fa_auth_option]
  | IDENTIFIED WITH auth_plugin [AND 2fa_auth_option]
  | IDENTIFIED WITH auth_plugin BY 'auth_string' [AND 2fa_auth_option]
  | IDENTIFIED WITH auth_plugin BY RANDOM PASSWORD [AND 2fa_auth_option]
  | IDENTIFIED WITH auth_plugin AS 'auth_string' [AND 2fa_auth_option]
  | IDENTIFIED WITH auth_plugin [initial_auth_option]
}

2fa_auth_option: {
    IDENTIFIED BY 'auth_string' [AND 3fa_auth_option]
  | IDENTIFIED BY RANDOM PASSWORD [AND 3fa_auth_option]
  | IDENTIFIED WITH auth_plugin [AND 3fa_auth_option]
  | IDENTIFIED WITH auth_plugin BY 'auth_string' [AND 3fa_auth_option]
  | IDENTIFIED WITH auth_plugin BY RANDOM PASSWORD [AND 3fa_auth_option]
  | IDENTIFIED WITH auth_plugin AS 'auth_string' [AND 3fa_auth_option]
}

3fa_auth_option: {
    IDENTIFIED BY 'auth_string'
  | IDENTIFIED BY RANDOM PASSWORD
  | IDENTIFIED WITH auth_plugin
  | IDENTIFIED WITH auth_plugin BY 'auth_string'
  | IDENTIFIED WITH auth_plugin BY RANDOM PASSWORD
  | IDENTIFIED WITH auth_plugin AS 'auth_string'
}

initial_auth_option: {
    INITIAL AUTHENTICATION IDENTIFIED BY {RANDOM PASSWORD | 'auth_string'}
  | INITIAL AUTHENTICATION IDENTIFIED WITH auth_plugin AS 'auth_string'
}

tls_option: {
   SSL
 | X509
 | CIPHER 'cipher'
 | ISSUER 'issuer'
 | SUBJECT 'subject'
}

resource_option: {
    MAX_QUERIES_PER_HOUR count
  | MAX_UPDATES_PER_HOUR count
  | MAX_CONNECTIONS_PER_HOUR count
  | MAX_USER_CONNECTIONS count
}

password_option: {
    PASSWORD EXPIRE [DEFAULT | NEVER | INTERVAL N DAY]
  | PASSWORD HISTORY {DEFAULT | N}
  | PASSWORD REUSE INTERVAL {DEFAULT | N DAY}
  | PASSWORD REQUIRE CURRENT [DEFAULT | OPTIONAL]
  | FAILED_LOGIN_ATTEMPTS N
  | PASSWORD_LOCK_TIME {N | UNBOUNDED}
}

lock_option: {
    ACCOUNT LOCK
  | ACCOUNT UNLOCK
}
```

The `CREATE USER` statement creates new MySQL accounts. It enables authentication, role, SSL/TLS, resource-limit, password-management, comment, and attribute properties to be established for new accounts. It also controls whether accounts are initially locked or unlocked.

To use `CREATE USER`, you must have the global `CREATE USER` privilege, or the `INSERT` privilege for the `mysql` system schema. When the `read_only` system variable is enabled, `CREATE USER` additionally requires the `CONNECTION_ADMIN` privilege (or the deprecated `SUPER` privilege).

These additional privilege considerations also apply:

* The `authentication_policy` system variable places certain constraints on how the authentication-related clauses of `CREATE USER` statements may be used; for details, see the description of that variable. These constraints do not apply if you have the `AUTHENTICATION_POLICY_ADMIN` privilege.

* To create an account that uses passwordless authentication, you must have the `PASSWORDLESS_USER_ADMIN` privilege.

`CREATE USER` fails with an error if any account to be created is named as the `DEFINER` attribute for any stored object. (That is, the statement fails if creating an account would cause the account to adopt a currently orphaned stored object.) To perform the operation anyway, you must have the `SET_ANY_DEFINER` or `ALLOW_NONEXISTENT_DEFINER` privilege; in this case, the statement succeeds with a warning rather than failing with an error. To perform the user-creation operation without either of these, drop the orphan objects, create the account and grant its privileges, and then re-create the dropped objects. For additional information, including how to identify which objects name a given account as the `DEFINER` attribute, see Orphan Stored Objects.

`CREATE USER` either succeeds for all named users or rolls back and has no effect if any error occurs. By default, an error occurs if you try to create a user that already exists. If the `IF NOT EXISTS` clause is given, the statement produces a warning for each named user that already exists, rather than an error.

Important

Under some circumstances, [`CREATE USER`](create-user.html "15.7.1.3 CREATE USER Statement") may be recorded in server logs or on the client side in a history file such as `~/.mysql_history`, which means that cleartext passwords may be read by anyone having read access to that information. For information about the conditions under which this occurs for the server logs and how to control it, see Section 8.1.2.3, “Passwords and Logging”. For similar information about client-side logging, see Section 6.5.1.3, “mysql Client Logging”.

There are several aspects to the [`CREATE USER`](create-user.html "15.7.1.3 CREATE USER Statement") statement, described under the following topics:

* CREATE USER Overview
* CREATE USER Authentication Options
* CREATE USER Multifactor Authentication Options
* CREATE USER Role Options
* CREATE USER SSL/TLS Options
* CREATE USER Resource-Limit Options
* CREATE USER Password-Management Options
* CREATE USER Comment and Attribute Options
* CREATE USER Account-Locking Options
* CREATE USER Binary Logging

##### CREATE USER Overview

For each account, `CREATE USER` creates a new row in the `mysql.user` system table. The account row reflects the properties specified in the statement. Unspecified properties are set to their default values:

* Authentication: The default authentication plugin (determined as described in The Default Authentication Plugin), and empty credentials

* Default role: `NONE`
* SSL/TLS: `NONE`
* Resource limits: Unlimited
* Password management: `PASSWORD EXPIRE DEFAULT PASSWORD HISTORY DEFAULT PASSWORD REUSE INTERVAL DEFAULT PASSWORD REQUIRE CURRENT DEFAULT`; failed-login tracking and temporary account locking are disabled

* Account locking: `ACCOUNT UNLOCK`

An account when first created has no privileges and the default role `NONE`. To assign privileges or roles to this account, use one or more `GRANT` statements.

Each account name uses the format described in Section 8.2.4, “Specifying Account Names”. For example:

```
CREATE USER 'jeffrey'@'localhost' IDENTIFIED BY 'password';
```

The host name part of the account name, if omitted, defaults to `'%'`. You should be aware that, while MySQL 9.5 treats grants made to such a user as though they had been granted to `'user'@'localhost'`, this behavior is deprecated, and thus subject to removal in a future version of MySQL.

Each *`user`* value naming an account may be followed by an optional *`auth_option`* value that indicates how the account authenticates. These values enable account authentication plugins and credentials (for example, a password) to be specified. Each *`auth_option`* value applies *only* to the account named immediately preceding it.

Following the *`user`* specifications, the statement may include options for SSL/TLS, resource-limit, password-management, and locking properties. All such options are *global* to the statement and apply to *all* accounts named in the statement.

Example: Create an account that uses the default authentication plugin and the given password. Mark the password expired so that the user must choose a new one at the first connection to the server:

```
CREATE USER 'jeffrey'@'localhost'
  IDENTIFIED BY 'new_password' PASSWORD EXPIRE;
```

Example: Create an account that uses the `caching_sha2_password` authentication plugin and the given password. Require that a new password be chosen every 180 days, and enable failed-login tracking, such that three consecutive incorrect passwords cause temporary account locking for two days:

```
CREATE USER 'jeffrey'@'localhost'
  IDENTIFIED WITH caching_sha2_password BY 'new_password'
  PASSWORD EXPIRE INTERVAL 180 DAY
  FAILED_LOGIN_ATTEMPTS 3 PASSWORD_LOCK_TIME 2;
```

Example: Create multiple accounts, specifying some per-account properties and some global properties:

```
CREATE USER
  'jeffrey'@'localhost' IDENTIFIED WITH caching_sha2_password
                                BY 'new_password1',
  'jeanne'@'localhost' IDENTIFIED WITH caching_sha2_password
                                BY 'new_password2'
  REQUIRE X509 WITH MAX_QUERIES_PER_HOUR 60
  PASSWORD HISTORY 5
  ACCOUNT LOCK;
```

Each *`auth_option`* value (`IDENTIFIED WITH ... BY` in this case) applies only to the account named immediately preceding it, so each account uses the immediately following authentication plugin and password.

The remaining properties apply globally to all accounts named in the statement, so for both accounts:

* Connections must be made using a valid X.509 certificate.
* Up to 60 queries per hour are permitted.
* Password changes cannot reuse any of the five most recent passwords.

* The account is locked initially, so effectively it is a placeholder and cannot be used until an administrator unlocks it.

##### CREATE USER Authentication Options

An account name may be followed by an *`auth_option`* authentication option that specifies the account authentication plugin, credentials, or both.

Note

MySQL 9.5 supports multifactor authentication (MFA), such that accounts can have up to three authentication methods. That is, accounts can use two-factor authentication (2FA) or three-factor authentication (3FA). The syntax and semantics of *`auth_option`* remain unchanged, but *`auth_option`* may be followed by specifications for additional authentication methods. This section describes *`auth_option`*. For details about the optional MFA-related following clauses, see CREATE USER Multifactor Authentication Options.

Note

Clauses for random password generation apply only to accounts that use an authentication plugin that stores credentials internally to MySQL. For accounts that use a plugin that performs authentication against a credentials system that is external to MySQL, password management must be handled externally against that system as well. For more information about internal credentials storage, see Section 8.2.15, “Password Management”.

* *`auth_plugin`* names an authentication plugin. The plugin name can be a quoted string literal or an unquoted name. Plugin names are stored in the `plugin` column of the `mysql.user` system table.

  For *`auth_option`* syntax that does not specify an authentication plugin, the server assigns the default plugin, determined as described in The Default Authentication Plugin. For descriptions of each plugin, see Section 8.4.1, “Authentication Plugins”.

* Credentials that are stored internally are stored in the `mysql.user` system table. An `'auth_string'` value or `RANDOM PASSWORD` specifies account credentials, either as a cleartext (unencrypted) string or hashed in the format expected by the authentication plugin associated with the account, respectively:

  + For syntax that uses `BY 'auth_string'`, the string is cleartext and is passed to the authentication plugin for possible hashing. The result returned by the plugin is stored in the `mysql.user` table. A plugin may use the value as specified, in which case no hashing occurs.

  + For syntax that uses `BY RANDOM PASSWORD`, MySQL generates a random password and as cleartext and passes it to the authentication plugin for possible hashing. The result returned by the plugin is stored in the `mysql.user` table. A plugin may use the value as specified, in which case no hashing occurs.

    Randomly generated passwords have the characteristics described in Random Password Generation.

  + For syntax that uses `AS 'auth_string'`, the string is assumed to be already in the format the authentication plugin requires, and is stored as is in the `mysql.user` table. If a plugin requires a hashed value, the value must be already hashed in a format appropriate for the plugin; otherwise, the value cannot be used by the plugin and correct authentication of client connections does not occur.

    A hashed string can be either a string literal or a hexadecimal value. The latter corresponds to the type of value displayed by [`SHOW CREATE USER`](show-create-user.html "15.7.7.14 SHOW CREATE USER Statement") for password hashes containing unprintable characters when the `print_identified_with_as_hex` system variable is enabled.

    Important

    Although we show `'auth_string'` with quotation marks, a hexadecimal value used for this purpose must *not* be quoted.

  + If an authentication plugin performs no hashing of the authentication string, the `BY 'auth_string'` and `AS 'auth_string'` clauses have the same effect: The authentication string is stored as is in the `mysql.user` system table.

`CREATE USER` permits these *`auth_option`* syntaxes:

* `IDENTIFIED BY 'auth_string'`

  Sets the account authentication plugin to the default plugin, passes the cleartext `'auth_string'` value to the plugin for possible hashing, and stores the result in the account row in the `mysql.user` system table.

* `IDENTIFIED BY RANDOM PASSWORD`

  Sets the account authentication plugin to the default plugin, generates a random password, passes the cleartext password value to the plugin for possible hashing, and stores the result in the account row in the `mysql.user` system table. The statement also returns the cleartext password in a result set to make it available to the user or application executing the statement. For details about the result set and characteristics of randomly generated passwords, see Random Password Generation.

* `IDENTIFIED WITH auth_plugin`

  Sets the account authentication plugin to *`auth_plugin`*, clears the credentials to the empty string, and stores the result in the account row in the `mysql.user` system table.

* `IDENTIFIED WITH auth_plugin BY 'auth_string'`

  Sets the account authentication plugin to *`auth_plugin`*, passes the cleartext `'auth_string'` value to the plugin for possible hashing, and stores the result in the account row in the `mysql.user` system table.

* `IDENTIFIED WITH auth_plugin BY RANDOM PASSWORD`

  Sets the account authentication plugin to *`auth_plugin`*, generates a random password, passes the cleartext password value to the plugin for possible hashing, and stores the result in the account row in the `mysql.user` system table. The statement also returns the cleartext password in a result set to make it available to the user or application executing the statement. For details about the result set and characteristics of randomly generated passwords, see Random Password Generation.

* `IDENTIFIED WITH auth_plugin AS 'auth_string'`

  Sets the account authentication plugin to *`auth_plugin`* and stores the `'auth_string'` value as is in the `mysql.user` account row. If the plugin requires a hashed string, the string is assumed to be already hashed in the format the plugin requires.

Example: Specify the password as cleartext; the default plugin is used:

```
CREATE USER 'jeffrey'@'localhost'
  IDENTIFIED BY 'password';
```

Example: Specify the authentication plugin, along with a cleartext password value:

```
CREATE USER 'jeffrey'@'localhost'
  IDENTIFIED WITH caching_sha2_password BY 'password';
```

In each case, the password value stored in the account row is the cleartext value `'password'` after it has been hashed by the authentication plugin associated with the account.

For additional information about setting passwords and authentication plugins, see Section 8.2.14, “Assigning Account Passwords”, and Section 8.2.17, “Pluggable Authentication”.

##### CREATE USER Multifactor Authentication Options

The *`auth_option`* part of `CREATE USER` defines an authentication method for one-factor/single-factor authentication (1FA/SFA). [`CREATE USER`](create-user.html "15.7.1.3 CREATE USER Statement") also supports multifactor authentication (MFA), such that accounts can have up to three authentication methods. That is, accounts can use two-factor authentication (2FA) or three-factor authentication (3FA).

The `authentication_policy` system variable defines constraints for `CREATE USER` statements with multifactor authentication (MFA) clauses. For example, the `authentication_policy` setting controls the number of authentication factors that accounts may have, and for each factor, which authentication methods are permitted. See Configuring the Multifactor Authentication Policy.

For information about factor-specific rules that determine the default authentication plugin for authentication clauses that name no plugin, see The Default Authentication Plugin.

Following *`auth_option`*, there may appear different optional MFA clauses:

* *`2fa_auth_option`*: Specifies a factor 2 authentication method. The following example defines `caching_sha2_password` as the factor 1 authentication method, and `authentication_ldap_sasl` as the factor 2 authentication method.

  ```
  CREATE USER 'u1'@'localhost'
    IDENTIFIED WITH caching_sha2_password
      BY 'sha2_password'
    AND IDENTIFIED WITH authentication_ldap_sasl
      AS 'uid=u1_ldap,ou=People,dc=example,dc=com';
  ```

* *`3fa_auth_option`*: Following *`2fa_auth_option`*, there may appear a *`3fa_auth_option`* clause to specify a factor 3 authentication method. The following example defines `caching_sha2_password` as the factor 1 authentication method, `authentication_ldap_sasl` as the factor 2 authentication method, and `authentication_webauthn` as the factor 3 authentication method

  ```
  CREATE USER 'u1'@'localhost'
    IDENTIFIED WITH caching_sha2_password
      BY 'sha2_password'
    AND IDENTIFIED WITH authentication_ldap_sasl
      AS 'uid=u1_ldap,ou=People,dc=example,dc=com'
    AND IDENTIFIED WITH authentication_webauthn;
  ```

* *`initial_auth_option`*: Specifies an initial authentication method for configuring FIDO/FIDO2 passwordless authentication. As shown in the following, temporary authentication using either a generated random password or a user-specified *`auth-string`* is required to enable WebAuthn passwordless authentication.

  ```
  CREATE USER user
    IDENTIFIED WITH authentication_webauthn
    INITIAL AUTHENTICATION IDENTIFIED BY {RANDOM PASSWORD | 'auth_string'};
  ```

  For information about configuring passwordless authentication using WebAuthn pluggable authentication, See WebAuthn Passwordless Authentication.

##### CREATE USER Role Options

The `DEFAULT ROLE` clause defines which roles become active when the user connects to the server and authenticates, or when the user executes the [`SET ROLE DEFAULT`](set-role.html "15.7.1.11 SET ROLE Statement") statement during a session.

Each role name uses the format described in Section 8.2.5, “Specifying Role Names”. For example:

```
CREATE USER 'joe'@'10.0.0.1' DEFAULT ROLE administrator, developer;
```

The host name part of the role name, if omitted, defaults to `'%'`.

The `DEFAULT ROLE` clause permits a list of one or more comma-separated role names. These roles must exist at the time `CREATE USER` is executed; otherwise the statement raises an error (`ER_USER_DOES_NOT_EXIST`), and the user is not created.

##### CREATE USER SSL/TLS Options

MySQL can check X.509 certificate attributes in addition to the usual authentication that is based on the user name and credentials. For background information on the use of SSL/TLS with MySQL, see Section 8.3, “Using Encrypted Connections”.

To specify SSL/TLS-related options for a MySQL account, use a `REQUIRE` clause that specifies one or more *`tls_option`* values.

Order of `REQUIRE` options does not matter, but no option can be specified twice. The `AND` keyword is optional between `REQUIRE` options.

`CREATE USER` permits these *`tls_option`* values:

* `NONE`

  Indicates that all accounts named by the statement have no SSL or X.509 requirements. Unencrypted connections are permitted if the user name and password are valid. Encrypted connections can be used, at the client's option, if the client has the proper certificate and key files.

  ```
  CREATE USER 'jeffrey'@'localhost' REQUIRE NONE;
  ```

  Clients attempt to establish a secure connection by default. For clients that have `REQUIRE NONE`, the connection attempt falls back to an unencrypted connection if a secure connection cannot be established. To require an encrypted connection, a client need specify only the `--ssl-mode=REQUIRED` option; the connection attempt fails if a secure connection cannot be established.

  `NONE` is the default if no SSL-related `REQUIRE` options are specified.

* `SSL`

  Tells the server to permit only encrypted connections for all accounts named by the statement.

  ```
  CREATE USER 'jeffrey'@'localhost' REQUIRE SSL;
  ```

  Clients attempt to establish a secure connection by default. For accounts that have `REQUIRE SSL`, the connection attempt fails if a secure connection cannot be established.

* `X509`

  For all accounts named by the statement, requires that clients present a valid certificate, but the exact certificate, issuer, and subject do not matter. The only requirement is that it should be possible to verify its signature with one of the CA certificates. Use of X.509 certificates always implies encryption, so the `SSL` option is unnecessary in this case.

  ```
  CREATE USER 'jeffrey'@'localhost' REQUIRE X509;
  ```

  For accounts with `REQUIRE X509`, clients must specify the `--ssl-key` and `--ssl-cert` options to connect. (It is recommended but not required that `--ssl-ca` also be specified so that the public certificate provided by the server can be verified.) This is true for `ISSUER` and `SUBJECT` as well because those `REQUIRE` options imply the requirements of `X509`.

* `ISSUER 'issuer'`

  For all accounts named by the statement, requires that clients present a valid X.509 certificate issued by CA `'issuer'`. If a client presents a certificate that is valid but has a different issuer, the server rejects the connection. Use of X.509 certificates always implies encryption, so the `SSL` option is unnecessary in this case.

  ```
  CREATE USER 'jeffrey'@'localhost'
    REQUIRE ISSUER '/C=SE/ST=Stockholm/L=Stockholm/
      O=MySQL/CN=CA/emailAddress=ca@example.com';
  ```

  Because `ISSUER` implies the requirements of `X509`, clients must specify the `--ssl-key` and `--ssl-cert` options to connect. (It is recommended but not required that `--ssl-ca` also be specified so that the public certificate provided by the server can be verified.)

* `SUBJECT 'subject'`

  For all accounts named by the statement, requires that clients present a valid X.509 certificate containing the subject *`subject`*. If a client presents a certificate that is valid but has a different subject, the server rejects the connection. Use of X.509 certificates always implies encryption, so the `SSL` option is unnecessary in this case.

  ```
  CREATE USER 'jeffrey'@'localhost'
    REQUIRE SUBJECT '/C=SE/ST=Stockholm/L=Stockholm/
      O=MySQL demo client certificate/
      CN=client/emailAddress=client@example.com';
  ```

  MySQL does a simple string comparison of the `'subject'` value to the value in the certificate, so lettercase and component ordering must be given exactly as present in the certificate.

  Because `SUBJECT` implies the requirements of `X509`, clients must specify the `--ssl-key` and `--ssl-cert` options to connect. (It is recommended but not required that `--ssl-ca` also be specified so that the public certificate provided by the server can be verified.)

* `CIPHER 'cipher'`

  For all accounts named by the statement, requires a specific cipher method for encrypting connections. This option is needed to ensure that ciphers and key lengths of sufficient strength are used. Encryption can be weak if old algorithms using short encryption keys are used.

  ```
  CREATE USER 'jeffrey'@'localhost'
    REQUIRE CIPHER 'EDH-RSA-DES-CBC3-SHA';
  ```

The `SUBJECT`, `ISSUER`, and `CIPHER` options can be combined in the `REQUIRE` clause:

```
CREATE USER 'jeffrey'@'localhost'
  REQUIRE SUBJECT '/C=SE/ST=Stockholm/L=Stockholm/
    O=MySQL demo client certificate/
    CN=client/emailAddress=client@example.com'
  AND ISSUER '/C=SE/ST=Stockholm/L=Stockholm/
    O=MySQL/CN=CA/emailAddress=ca@example.com'
  AND CIPHER 'EDH-RSA-DES-CBC3-SHA';
```

##### CREATE USER Resource-Limit Options

It is possible to place limits on use of server resources by an account, as discussed in Section 8.2.21, “Setting Account Resource Limits”. To do so, use a `WITH` clause that specifies one or more *`resource_option`* values.

Order of `WITH` options does not matter, except that if a given resource limit is specified multiple times, the last instance takes precedence.

`CREATE USER` permits these *`resource_option`* values:

* `MAX_QUERIES_PER_HOUR count`, `MAX_UPDATES_PER_HOUR count`, `MAX_CONNECTIONS_PER_HOUR count`

  For all accounts named by the statement, these options restrict how many queries, updates, and connections to the server are permitted to each account during any given one-hour period. If *`count`* is `0` (the default), this means that there is no limitation for the account.

* `MAX_USER_CONNECTIONS count`

  For all accounts named by the statement, restricts the maximum number of simultaneous connections to the server by each account. A nonzero *`count`* specifies the limit for the account explicitly. If *`count`* is `0` (the default), the server determines the number of simultaneous connections for the account from the global value of the `max_user_connections` system variable. If `max_user_connections` is also zero, there is no limit for the account.

Example:

```
CREATE USER 'jeffrey'@'localhost'
  WITH MAX_QUERIES_PER_HOUR 500 MAX_UPDATES_PER_HOUR 100;
```

##### CREATE USER Password-Management Options

`CREATE USER` supports several *`password_option`* values for password management:

* Password expiration options: You can expire an account password manually and establish its password expiration policy. Policy options do not expire the password. Instead, they determine how the server applies automatic expiration to the account based on password age, which is assessed from the date and time of the most recent account password change.

* Password reuse options: You can restrict password reuse based on number of password changes, time elapsed, or both.

* Password verification-required options: You can indicate whether attempts to change an account password must specify the current password, as verification that the user attempting to make the change actually knows the current password.

* Incorrect-password failed-login tracking options: You can cause the server to track failed login attempts and temporarily lock accounts for which too many consecutive incorrect passwords are given. The required number of failures and the lock time are configurable.

This section describes the syntax for password-management options. For information about establishing policy for password management, see Section 8.2.15, “Password Management”.

If multiple password-management options of a given type are specified, the last one takes precedence. For example, `PASSWORD EXPIRE DEFAULT PASSWORD EXPIRE NEVER` is the same as `PASSWORD EXPIRE NEVER`.

Note

Except for the options that pertain to failed-login tracking, password-management options apply only to accounts that use an authentication plugin that stores credentials internally to MySQL. For accounts that use a plugin that performs authentication against a credentials system that is external to MySQL, password management must be handled externally against that system as well. For more information about internal credentials storage, see Section 8.2.15, “Password Management”.

A client has an expired password if the account password was expired manually or the password age is considered greater than its permitted lifetime per the automatic expiration policy. In this case, the server either disconnects the client or restricts the operations permitted to it (see Section 8.2.16, “Server Handling of Expired Passwords”). Operations performed by a restricted client result in an error until the user establishes a new account password.

`CREATE USER` permits these *`password_option`* values for controlling password expiration:

* `PASSWORD EXPIRE`

  Immediately marks the password expired for all accounts named by the statement.

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE;
  ```

* `PASSWORD EXPIRE DEFAULT`

  Sets all accounts named by the statement so that the global expiration policy applies, as specified by the `default_password_lifetime` system variable.

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE DEFAULT;
  ```

* `PASSWORD EXPIRE NEVER`

  This expiration option overrides the global policy for all accounts named by the statement. For each, it disables password expiration so that the password never expires.

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE NEVER;
  ```

* `PASSWORD EXPIRE INTERVAL N DAY`

  This expiration option overrides the global policy for all accounts named by the statement. For each, it sets the password lifetime to *`N`* days. The following statement requires the password to be changed every 180 days:

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD EXPIRE INTERVAL 180 DAY;
  ```

`CREATE USER` permits these *`password_option`* values for controlling reuse of previous passwords based on required minimum number of password changes:

* `PASSWORD HISTORY DEFAULT`

  Sets all accounts named by the statement so that the global policy about password history length applies, to prohibit reuse of passwords before the number of changes specified by the `password_history` system variable.

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD HISTORY DEFAULT;
  ```

* `PASSWORD HISTORY N`

  This history-length option overrides the global policy for all accounts named by the statement. For each, it sets the password history length to *`N`* passwords, to prohibit reusing any of the *`N`* most recently chosen passwords. The following statement prohibits reuse of any of the previous 6 passwords:

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD HISTORY 6;
  ```

`CREATE USER` permits these *`password_option`* values for controlling reuse of previous passwords based on time elapsed:

* `PASSWORD REUSE INTERVAL DEFAULT`

  Sets all statements named by the account so that the global policy about time elapsed applies, to prohibit reuse of passwords newer than the number of days specified by the `password_reuse_interval` system variable.

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD REUSE INTERVAL DEFAULT;
  ```

* `PASSWORD REUSE INTERVAL N DAY`

  This time-elapsed option overrides the global policy for all accounts named by the statement. For each, it sets the password reuse interval to *`N`* days, to prohibit reuse of passwords newer than that many days. The following statement prohibits password reuse for 360 days:

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD REUSE INTERVAL 360 DAY;
  ```

`CREATE USER` permits these *`password_option`* values for controlling whether attempts to change an account password must specify the current password, as verification that the user attempting to make the change actually knows the current password:

* `PASSWORD REQUIRE CURRENT`

  This verification option overrides the global policy for all accounts named by the statement. For each, it requires that password changes specify the current password.

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD REQUIRE CURRENT;
  ```

* `PASSWORD REQUIRE CURRENT OPTIONAL`

  This verification option overrides the global policy for all accounts named by the statement. For each, it does not require that password changes specify the current password. (The current password may but need not be given.)

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD REQUIRE CURRENT OPTIONAL;
  ```

* `PASSWORD REQUIRE CURRENT DEFAULT`

  Sets all statements named by the account so that the global policy about password verification applies, as specified by the `password_require_current` system variable.

  ```
  CREATE USER 'jeffrey'@'localhost' PASSWORD REQUIRE CURRENT DEFAULT;
  ```

`CREATE USER` permits these *`password_option`* values for controlling failed-login tracking:

* `FAILED_LOGIN_ATTEMPTS N`

  Whether to track account login attempts that specify an incorrect password. *`N`* must be a number from 0 to 32767. A value of 0 disables failed-login tracking. Values greater than 0 indicate how many consecutive password failures cause temporary account locking (if `PASSWORD_LOCK_TIME` is also nonzero).

* `PASSWORD_LOCK_TIME {N | UNBOUNDED}`

  How long to lock the account after too many consecutive login attempts provide an incorrect password. *`N`* must be a number from 0 to 32767, or `UNBOUNDED`. A value of 0 disables temporary account locking. Values greater than 0 indicate how long to lock the account in days. A value of `UNBOUNDED` causes the account locking duration to be unbounded; once locked, the account remains in a locked state until unlocked. For information about the conditions under which unlocking occurs, see Failed-Login Tracking and Temporary Account Locking.

For failed-login tracking and temporary locking to occur, an account's `FAILED_LOGIN_ATTEMPTS` and `PASSWORD_LOCK_TIME` options both must be nonzero. The following statement creates an account that remains locked for two days after four consecutive password failures:

```
CREATE USER 'jeffrey'@'localhost'
  FAILED_LOGIN_ATTEMPTS 4 PASSWORD_LOCK_TIME 2;
```

##### CREATE USER Comment and Attribute Options

You can also include an optional comment or attribute when creating a user, as described here:

* **User comment**

  To set a user comment, add `COMMENT 'user_comment'` to the `CREATE USER` statement, where *`user_comment`* is the text of the user comment.

  Example (omitting any other options):

  ```
  CREATE USER 'jon'@'localhost' COMMENT 'Some information about Jon';
  ```

* **User attribute**

  A user attribute is a JSON object made up of one or more key-value pairs, and is set by including `ATTRIBUTE 'json_object'` as part of `CREATE USER`. *`json_object`* must be a valid JSON object.

  Example (omitting any other options):

  ```
  CREATE USER 'jim'@'localhost'
      ATTRIBUTE '{"fname": "James", "lname": "Scott", "phone": "123-456-7890"}';
  ```

User comments and user attributes are stored together in the `ATTRIBUTE` column of the Information Schema `USER_ATTRIBUTES` table. This query displays the row in this table inserted by the statement just shown for creating the user `jim@localhost`:

```
mysql> SELECT * FROM INFORMATION_SCHEMA.USER_ATTRIBUTES
    ->    WHERE USER = 'jim' AND HOST = 'localhost'\G
*************************** 1. row ***************************
     USER: jim
     HOST: localhost
ATTRIBUTE: {"fname": "James", "lname": "Scott", "phone": "123-456-7890"}
1 row in set (0.00 sec)
```

The `COMMENT` option in actuality provides a shortcut for setting a user attribute whose only element has `comment` as its key and whose value is the argument supplied for the option. You can see this by executing the statement `CREATE USER 'jon'@'localhost' COMMENT 'Some information about Jon'`, and observing the row which it inserts into the `USER_ATTRIBUTES` table:

```
mysql> CREATE USER 'jon'@'localhost' COMMENT 'Some information about Jon';
Query OK, 0 rows affected (0.06 sec)

mysql> SELECT * FROM INFORMATION_SCHEMA.USER_ATTRIBUTES
    ->    WHERE USER = 'jon' AND HOST = 'localhost';
+------+-----------+-------------------------------------------+
| USER | HOST      | ATTRIBUTE                                 |
+------+-----------+-------------------------------------------+
| jon  | localhost | {"comment": "Some information about Jon"} |
+------+-----------+-------------------------------------------+
1 row in set (0.00 sec)
```

You cannot use `COMMENT` and `ATTRIBUTE` together in the same `CREATE USER` statement; attempting to do so causes a syntax error. To set a user comment concurrently with setting a user attribute, use `ATTRIBUTE` and include in its argument a value with a `comment` key, like this:

```
mysql> CREATE USER 'bill'@'localhost'
    ->        ATTRIBUTE '{"fname":"William", "lname":"Schmidt",
    ->        "comment":"Website developer"}';
Query OK, 0 rows affected (0.16 sec)
```

Since the content of the `ATTRIBUTE` row is a JSON object, you can employ any appropriate MySQL JSON functions or operators to manipulate it, as shown here:

```
mysql> SELECT
    ->   USER AS User,
    ->   HOST AS Host,
    ->   CONCAT(ATTRIBUTE->>"$.fname"," ",ATTRIBUTE->>"$.lname") AS 'Full Name',
    ->   ATTRIBUTE->>"$.comment" AS Comment
    -> FROM INFORMATION_SCHEMA.USER_ATTRIBUTES
    -> WHERE USER='bill' AND HOST='localhost';
+------+-----------+-----------------+-------------------+
| User | Host      | Full Name       | Comment           |
+------+-----------+-----------------+-------------------+
| bill | localhost | William Schmidt | Website developer |
+------+-----------+-----------------+-------------------+
1 row in set (0.00 sec)
```

To set or to make changes in the user comment or user attribute for an existing user, you can use a `COMMENT` or `ATTRIBUTE` option with an `ALTER USER` statement.

Because the user comment and user attribute are stored together internally in a single `JSON` column, this sets an upper limit on their maximum combined size; see JSON Storage Requirements, for more information.

See also the description of the Information Schema `USER_ATTRIBUTES` table for more information and examples.

##### CREATE USER Account-Locking Options

MySQL supports account locking and unlocking using the `ACCOUNT LOCK` and `ACCOUNT UNLOCK` options, which specify the locking state for an account. For additional discussion, see Section 8.2.20, “Account Locking”.

If multiple account-locking options are specified, the last one takes precedence.

##### CREATE USER Binary Logging

`CREATE USER` is written to the binary log if it succeeds, but not if it fails; in that case, rollback occurs and no changes are made. A statement written to the binary log includes all named users. If the `IF NOT EXISTS` clause is given, this includes even users that already exist and were not created.

The statement written to the binary log specifies an authentication plugin for each user, determined as follows:

* The plugin named in the original statement, if one was specified.

* Otherwise, the default authentication plugin. In particular, if a user `u1` already exists and uses a nondefault authentication plugin, the statement written to the binary log for `CREATE USER IF NOT EXISTS u1` names the default authentication plugin. (If the statement written to the binary log must specify a nondefault authentication plugin for a user, include it in the original statement.)

If the server adds the default authentication plugin for any nonexisting users in the statement written to the binary log, it writes a warning to the error log naming those users.

If the original statement specifies the `FAILED_LOGIN_ATTEMPTS` or `PASSWORD_LOCK_TIME` option, the statement written to the binary log includes the option.

`CREATE USER` statements with clauses that support multifactor authentication (MFA) are written to the binary log.

* `CREATE USER ... IDENTIFIED WITH .. INITIAL AUTHENTICATION IDENTIFIED WITH ...` statements are written to the binary log as `CREATE USER .. IDENTIFIED WITH .. INITIAL AUTHENTICATION IDENTIFIED WITH .. AS 'password-hash'`, where the *`password-hash`* is the user-specified *`auth-string`* or the random password generated by server when the `RANDOM PASSWORD` clause is specified.


#### 15.7.1.4 DROP ROLE Statement

```
DROP ROLE [IF EXISTS] role [, role ] ...
```

`DROP ROLE` removes one or more roles (named collections of privileges). To use this statement, you must have the global [`DROP ROLE`](privileges-provided.html#priv_drop-role) or `CREATE USER` privilege. When the `read_only` system variable is enabled, [`DROP ROLE`](drop-role.html "15.7.1.4 DROP ROLE Statement") additionally requires the `CONNECTION_ADMIN` privilege (or the deprecated `SUPER` privilege).

Users who have the `CREATE USER` privilege can use this statement to drop accounts that are locked or unlocked. Users who have the [`DROP ROLE`](privileges-provided.html#priv_drop-role) privilege can use this statement only to drop accounts that are locked (unlocked accounts are presumably user accounts used to log in to the server and not just as roles).

Roles named in the `mandatory_roles` system variable value cannot be dropped.

`DROP ROLE` either succeeds for all named roles or rolls back and has no effect if any error occurs. By default, an error occurs if you try to drop a role that does not exist. If the `IF EXISTS` clause is given, the statement produces a warning for each named role that does not exist, rather than an error.

The statement is written to the binary log if it succeeds, but not if it fails; in that case, rollback occurs and no changes are made. A statement written to the binary log includes all named roles. If the `IF EXISTS` clause is given, this includes even roles that do not exist and were not dropped.

Each role name uses the format described in Section 8.2.5, “Specifying Role Names”. For example:

```
DROP ROLE 'admin', 'developer';
DROP ROLE 'webapp'@'localhost';
```

The host name part of the role name, if omitted, defaults to `'%'`.

A dropped role is automatically revoked from any user account (or role) to which the role was granted. Within any current session for such an account, its adjusted privileges apply beginning with the next statement executed.

For role usage examples, see Section 8.2.10, “Using Roles”.


#### 15.7.1.5 DROP USER Statement

```
DROP USER [IF EXISTS] user [, user] ...
```

The `DROP USER` statement removes one or more MySQL accounts and their privileges. It removes privilege rows for the account from all grant tables.

Roles named in the `mandatory_roles` system variable value cannot be dropped.

To use `DROP USER`, you must have the global `CREATE USER` privilege, or the `DELETE` privilege for the `mysql` system schema. When the `read_only` system variable is enabled, `DROP USER` additionally requires the `CONNECTION_ADMIN` privilege (or the deprecated `SUPER` privilege).

`DROP USER` fails with an error if any account to be dropped is named as the `DEFINER` attribute for any stored object. (That is, the statement fails if dropping an account would cause a stored object to become orphaned.) To perform the operation anyway, you must have the `SET_ANY_DEFINER` or `ALLOW_NONEXISTENT_DEFINER` privilege; in this case, the statement succeeds with a warning rather than failing with an error. For additional information, including how to identify which objects name a given account as the `DEFINER` attribute, see Orphan Stored Objects.

`DROP USER` either succeeds for all named users or rolls back and has no effect if any error occurs. By default, an error occurs if you try to drop a user that does not exist. If the `IF EXISTS` clause is given, the statement produces a warning for each named user that does not exist, rather than an error.

The statement is written to the binary log if it succeeds, but not if it fails; in that case, rollback occurs and no changes are made. A statement written to the binary log includes all named users. If the `IF EXISTS` clause is given, this includes even users that do not exist and were not dropped.

Each account name uses the format described in Section 8.2.4, “Specifying Account Names”. For example:

```
DROP USER 'jeffrey'@'localhost';
```

The host name part of the account name, if omitted, defaults to `'%'`.

Important

`DROP USER` does not automatically close any open user sessions. Rather, in the event that a user with an open session is dropped, the statement does not take effect until that user's session is closed. Once the session is closed, the user is dropped, and that user's next attempt to log in fails. *This is by design*.

`DROP USER` does not automatically drop or invalidate databases or objects within them that the old user created. This includes stored programs or views for which the `DEFINER` attribute names the dropped user. Attempts to access such objects may produce an error if they execute in definer security context. (For information about security context, see Section 27.8, “Stored Object Access Control”.)


#### 15.7.1.6 GRANT Statement

```
GRANT
    priv_type [(column_list)]
      [, priv_type [(column_list)]] ...
    ON [object_type] priv_level
    TO user_or_role [, user_or_role] ...
    [WITH GRANT OPTION]
    [AS user
        [WITH ROLE
            DEFAULT
          | NONE
          | ALL
          | ALL EXCEPT role [, role ] ...
          | role [, role ] ...
        ]
    ]
}

GRANT PROXY ON user_or_role
    TO user_or_role [, user_or_role] ...
    [WITH GRANT OPTION]

GRANT role [, role] ...
    TO user_or_role [, user_or_role] ...
    [WITH ADMIN OPTION]

object_type: {
    TABLE
  | EVENT
  | FUNCTION
  | LIBRARY
  | PROCEDURE
}

priv_level: {
    *
  | *.*
  | db_name.*
  | db_name.tbl_name
  | tbl_name
  | db_name.routine_name
}

user_or_role: {
    user (see Section 8.2.4, “Specifying Account Names”)
  | role (see Section 8.2.5, “Specifying Role Names”)
}
```

The `GRANT` statement assigns privileges and roles to MySQL user accounts and roles. There are several aspects to the `GRANT` statement, described under the following topics:

* GRANT General Overview
* Object Quoting Guidelines
* Account Names
* Privileges Supported by MySQL
* Global Privileges
* Database Privileges
* Table Privileges
* Column Privileges
* Stored Routine Privileges
* Proxy User Privileges
* Granting Roles
* The `AS` Clause and Privilege Restrictions
* Other Account Characteristics
* MySQL and Standard SQL Versions of GRANT

##### GRANT General Overview

The `GRANT` statement enables system administrators to grant privileges and roles, which can be granted to user accounts and roles. These syntax restrictions apply:

* `GRANT` cannot mix granting both privileges and roles in the same statement. A given `GRANT` statement must grant either privileges or roles.

* The `ON` clause distinguishes whether the statement grants privileges or roles:

  + With `ON`, the statement grants privileges.

  + Without `ON`, the statement grants roles.

  + It is permitted to assign both privileges and roles to an account, but you must use separate `GRANT` statements, each with syntax appropriate to what is to be granted.

For more information about roles, see Section 8.2.10, “Using Roles”.

To grant a privilege with `GRANT`, you must have the `GRANT OPTION` privilege, and you must have the privileges that you are granting. (Alternatively, if you have the `UPDATE` privilege for the grant tables in the `mysql` system schema, you can grant any account any privilege.) When the `read_only` system variable is enabled, `GRANT` additionally requires the `CONNECTION_ADMIN` privilege (or the deprecated `SUPER` privilege).

`GRANT` either succeeds for all named users and roles or rolls back and has no effect if any error occurs. The statement is written to the binary log only if it succeeds for all named users and roles.

The `REVOKE` statement is related to `GRANT` and enables administrators to remove account privileges. See Section 15.7.1.8, “REVOKE Statement”.

Each account name uses the format described in Section 8.2.4, “Specifying Account Names”. Each role name uses the format described in Section 8.2.5, “Specifying Role Names”. For example:

```
GRANT ALL ON db1.* TO 'jeffrey'@'localhost';
GRANT 'role1', 'role2' TO 'user1'@'localhost', 'user2'@'localhost';
GRANT SELECT ON world.* TO 'role3';
```

The host name part of the account or role name, if omitted, defaults to `'%'`.

Normally, a database administrator first uses `CREATE USER` to create an account and define its nonprivilege characteristics such as its password, whether it uses secure connections, and limits on access to server resources, then uses `GRANT` to define its privileges. `ALTER USER` may be used to change the nonprivilege characteristics of existing accounts. For example:

```
CREATE USER 'jeffrey'@'localhost' IDENTIFIED BY 'password';
GRANT ALL ON db1.* TO 'jeffrey'@'localhost';
GRANT SELECT ON db2.invoice TO 'jeffrey'@'localhost';
ALTER USER 'jeffrey'@'localhost' WITH MAX_QUERIES_PER_HOUR 90;
```

From the **mysql** program, `GRANT` responds with `Query OK, 0 rows affected` when executed successfully. To determine what privileges result from the operation, use `SHOW GRANTS`. See Section 15.7.7.23, “SHOW GRANTS Statement”.

Important

Under some circumstances, `GRANT` may be recorded in server logs or on the client side in a history file such as `~/.mysql_history`, which means that cleartext passwords may be read by anyone having read access to that information. For information about the conditions under which this occurs for the server logs and how to control it, see Section 8.1.2.3, “Passwords and Logging”. For similar information about client-side logging, see Section 6.5.1.3, “mysql Client Logging”.

`GRANT` supports host names up to 255 characters long. User names can be up to 32 characters. Database, table, column, and routine names can be up to 64 characters.

Warning

*Do not attempt to change the permissible length for user names by altering the `mysql.user` system table. Doing so results in unpredictable behavior which may even make it impossible for users to log in to the MySQL server*. Never alter the structure of tables in the `mysql` system schema in any manner except by means of the procedure described in Chapter 3, *Upgrading MySQL*.

##### Object Quoting Guidelines

Several objects within `GRANT` statements are subject to quoting, although quoting is optional in many cases: Account, role, database, table, column, and routine names. For example, if a *`user_name`* or *`host_name`* value in an account name is legal as an unquoted identifier, you need not quote it. However, quotation marks are necessary to specify a *`user_name`* string containing special characters (such as `-`), or a *`host_name`* string containing special characters or wildcard characters such as `%` (for example, `'test-user'@'%.com'`). Quote the user name and host name separately.

To specify quoted values:

* Quote database, table, column, and routine names as identifiers.

* Quote user names and host names as identifiers or as strings.

* Quote passwords as strings.

For string-quoting and identifier-quoting guidelines, see Section 11.1.1, “String Literals”, and Section 11.2, “Schema Object Names”.

Important

The use of the wildcard characters `%` and `_` as described in the next few paragraphs is deprecated, and thus subject to removal in a future version of MySQL.

The `_` and `%` wildcards are permitted when specifying database names in `GRANT` statements that grant privileges at the database level (`GRANT ... ON db_name.*`). This means, for example, that to use a `_` character as part of a database name, specify it using the `\` escape character as `\_` in the `GRANT` statement, to prevent the user from being able to access additional databases matching the wildcard pattern (for example, `` GRANT ... ON `foo\_bar`.* TO ... ``).

Issuing multiple `GRANT` statements containing wildcards may not have the expected effect on DML statements; when resolving grants involving wildcards, MySQL takes only the first matching grant into consideration. In other words, if a user has two database-level grants using wildcards that match the same database, the grant which was created first is applied. Consider the database `db` and table `t` created using the statements shown here:

```
mysql> CREATE DATABASE db;
Query OK, 1 row affected (0.01 sec)

mysql> CREATE TABLE db.t (c INT);
Query OK, 0 rows affected (0.01 sec)

mysql> INSERT INTO db.t VALUES ROW(1);
Query OK, 1 row affected (0.00 sec)
```

Next (assuming that the current account is the MySQL `root` account or another account having the necessary privileges), we create a user `u` then issue two `GRANT` statements containing wildcards, like this:

```
mysql> CREATE USER u;
Query OK, 0 rows affected (0.01 sec)

mysql> GRANT SELECT ON `d_`.* TO u;
Query OK, 0 rows affected (0.01 sec)

mysql> GRANT INSERT ON `d%`.* TO u;
Query OK, 0 rows affected (0.00 sec)

mysql> EXIT
```

```
Bye
```

If we end the session and then log in again with the **mysql** client, this time as **u**, we see that this account has only the privilege provided by the first matching grant, but not the second:

```
$> mysql -uu -hlocalhost
```

```
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 10
Server version: 9.5.0-tr Source distribution

Copyright (c) 2000, 2023, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input
statement.

mysql> TABLE db.t;
+------+
| c    |
+------+
|    1 |
+------+
1 row in set (0.00 sec)

mysql> INSERT INTO db.t VALUES ROW(2);
ERROR 1142 (42000): INSERT command denied to user 'u'@'localhost' for table 't'
```

In privilege assignments, MySQL interprets occurrences of unescaped `_` and `%` SQL wildcard characters in database names as literal characters under these circumstances:

* When a database name is not used to grant privileges at the database level, but as a qualifier for granting privileges to some other object such as a table or routine (for example, `GRANT ... ON db_name.tbl_name`).

* Enabling `partial_revokes` causes MySQL to interpret unescaped `_` and `%` wildcard characters in database names as literal characters, just as if they had been escaped as `\_` and `\%`. Because this changes how MySQL interprets privileges, it may be advisable to avoid unescaped wildcard characters in privilege assignments for installations where `partial_revokes` may be enabled. For more information, see Section 8.2.12, “Privilege Restriction Using Partial Revokes”.

##### Account Names

A *`user`* value in a `GRANT` statement indicates a MySQL account to which the statement applies. To accommodate granting rights to users from arbitrary hosts, MySQL supports specifying the *`user`* value in the form `'user_name'@'host_name'`.

You can specify wildcards in the host name. For example, `'user_name'@'%.example.com'` applies to *`user_name`* for any host in the `example.com` domain, and `'user_name'@'198.51.100.%'` applies to *`user_name`* for any host in the `198.51.100` class C subnet.

The simple form `'user_name'` is a synonym for `'user_name'@'%'`.

Note

MySQL automatically assigns all privileges granted to `'username'@'%'` to the `'username'@'localhost'` account as well. This behavior is deprecated, and is subject to removal in a future version of MySQL.

*MySQL does not support wildcards in user names*. To refer to an anonymous user, specify an account with an empty user name with the `GRANT` statement:

```
GRANT ALL ON test.* TO ''@'localhost' ...;
```

In this case, any user who connects from the local host with the correct password for the anonymous user is permitted access, with the privileges associated with the anonymous-user account.

For additional information about user name and host name values in account names, see Section 8.2.4, “Specifying Account Names”.

Warning

If you permit local anonymous users to connect to the MySQL server, you should also grant privileges to all local users as `'user_name'@'localhost'`. Otherwise, the anonymous user account for `localhost` in the `mysql.user` system table is used when named users try to log in to the MySQL server from the local machine. For details, see Section 8.2.6, “Access Control, Stage 1: Connection Verification”.

To determine whether this issue applies to you, execute the following query, which lists any anonymous users:

```
SELECT Host, User FROM mysql.user WHERE User='';
```

To avoid the problem just described, delete the local anonymous user account using this statement:

```
DROP USER ''@'localhost';
```

##### Privileges Supported by MySQL

The following tables summarize the permissible static and dynamic *`priv_type`* privilege types that can be specified for the `GRANT` and `REVOKE` statements, and the levels at which each privilege can be granted. For additional information about each privilege, see Section 8.2.2, “Privileges Provided by MySQL”. For information about the differences between static and dynamic privileges, see Static Versus Dynamic Privileges.

**Table 15.11 Permissible Static Privileges for GRANT and REVOKE**

<table><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Privilege</th> <th>Meaning and Grantable Levels</th> </tr></thead><tbody><tr> <td><a class="link" href="privileges-provided.html#priv_all"><code class="literal">ALL [PRIVILEGES]</code></a></td> <td>Grant all privileges at specified access level except <a class="link" href="privileges-provided.html#priv_grant-option"><code class="literal">GRANT OPTION</code></a> and <a class="link" href="privileges-provided.html#priv_proxy"><code class="literal">PROXY</code></a>.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_alter"><code class="literal">ALTER</code></a></td> <td>Enable use of <a class="link" href="alter-table.html" title="15.1.11 ALTER TABLE Statement"><code class="literal">ALTER TABLE</code></a>. Levels: Global, database, table.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_alter-routine"><code class="literal">ALTER ROUTINE</code></a></td> <td>Enable stored routines to be altered or dropped. Levels: Global, database, routine.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_create"><code class="literal">CREATE</code></a></td> <td>Enable database and table creation. Levels: Global, database, table.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_create-role"><code class="literal">CREATE ROLE</code></a></td> <td>Enable role creation. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_create-routine"><code class="literal">CREATE ROUTINE</code></a></td> <td>Enable stored routine creation. Levels: Global, database.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_create-tablespace"><code class="literal">CREATE TABLESPACE</code></a></td> <td>Enable tablespaces and log file groups to be created, altered, or dropped. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_create-temporary-tables"><code class="literal">CREATE TEMPORARY TABLES</code></a></td> <td>Enable use of <a class="link" href="create-table.html" title="15.1.24 CREATE TABLE Statement"><code class="literal">CREATE TEMPORARY TABLE</code></a>. Levels: Global, database.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_create-user"><code class="literal">CREATE USER</code></a></td> <td>Enable use of <a class="link" href="create-user.html" title="15.7.1.3 CREATE USER Statement"><code class="literal">CREATE USER</code></a>, <a class="link" href="drop-user.html" title="15.7.1.5 DROP USER Statement"><code class="literal">DROP USER</code></a>, <a class="link" href="rename-user.html" title="15.7.1.7 RENAME USER Statement"><code class="literal">RENAME USER</code></a>, and <a class="link" href="revoke.html" title="15.7.1.8 REVOKE Statement"><code class="literal">REVOKE ALL PRIVILEGES</code></a>. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_create-view"><code class="literal">CREATE VIEW</code></a></td> <td>Enable views to be created or altered. Levels: Global, database, table.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_delete"><code class="literal">DELETE</code></a></td> <td>Enable use of <a class="link" href="delete.html" title="15.2.2 DELETE Statement"><code class="literal">DELETE</code></a>. Level: Global, database, table.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_drop"><code class="literal">DROP</code></a></td> <td>Enable databases, tables, and views to be dropped. Levels: Global, database, table.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_drop-role"><code class="literal">DROP ROLE</code></a></td> <td>Enable roles to be dropped. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_event"><code class="literal">EVENT</code></a></td> <td>Enable use of events for the Event Scheduler. Levels: Global, database.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_execute"><code class="literal">EXECUTE</code></a></td> <td>Enable the user to execute stored routines. Levels: Global, database, routine.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_file"><code class="literal">FILE</code></a></td> <td>Enable the user to cause the server to read or write files. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_flush-privileges"><code class="literal">FLUSH_PRIVILEGES</code></a></td> <td>Enable the user to issue <a class="link" href="flush.html" title="15.7.8.3 FLUSH Statement"><code class="literal">FLUSH PRIVILEGES</code></a> statements. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_grant-option"><code class="literal">GRANT OPTION</code></a></td> <td>Enable privileges to be granted to or removed from other accounts. Levels: Global, database, table, routine, proxy.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_index"><code class="literal">INDEX</code></a></td> <td>Enable indexes to be created or dropped. Levels: Global, database, table.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_insert"><code class="literal">INSERT</code></a></td> <td>Enable use of <a class="link" href="insert.html" title="15.2.7 INSERT Statement"><code class="literal">INSERT</code></a>. Levels: Global, database, table, column.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_lock-tables"><code class="literal">LOCK TABLES</code></a></td> <td>Enable use of <a class="link" href="lock-tables.html" title="15.3.6 LOCK TABLES and UNLOCK TABLES Statements"><code class="literal">LOCK TABLES</code></a> on tables for which you have the <a class="link" href="select.html" title="15.2.13 SELECT Statement"><code class="literal">SELECT</code></a> privilege. Levels: Global, database.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_optimize-local-table"><code class="literal">OPTIMIZE_LOCAL_TABLE</code></a></td> <td>Enable use of <a class="link" href="optimize-table.html" title="15.7.3.4 OPTIMIZE TABLE Statement"><code class="literal">OPTIMIZE LOCAL TABLE</code></a> or <code class="literal">OPTIMIZE NO_WRITE_TO_BINLOG TABLE</code>. Levels: Global, database, table.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_process"><code class="literal">PROCESS</code></a></td> <td>Enable the user to see all processes with <a class="link" href="show-processlist.html" title="15.7.7.32 SHOW PROCESSLIST Statement"><code class="literal">SHOW PROCESSLIST</code></a>. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_proxy"><code class="literal">PROXY</code></a></td> <td>Enable user proxying. Level: From user to user.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_references"><code class="literal">REFERENCES</code></a></td> <td>Enable foreign key creation. Levels: Global, database, table, column.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_reload"><code class="literal">RELOAD</code></a></td> <td>Enable use of <a class="link" href="flush.html" title="15.7.8.3 FLUSH Statement"><code class="literal">FLUSH</code></a> operations. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_replication-client"><code class="literal">REPLICATION CLIENT</code></a></td> <td>Enable the user to ask where source or replica servers are. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_replication-slave"><code class="literal">REPLICATION SLAVE</code></a></td> <td>Enable replicas to read binary log events from the source. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_select"><code class="literal">SELECT</code></a></td> <td>Enable use of <a class="link" href="select.html" title="15.2.13 SELECT Statement"><code class="literal">SELECT</code></a>. Levels: Global, database, table, column.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_show-databases"><code class="literal">SHOW DATABASES</code></a></td> <td>Enable <a class="link" href="show-databases.html" title="15.7.7.16 SHOW DATABASES Statement"><code class="literal">SHOW DATABASES</code></a> to show all databases. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_show-view"><code class="literal">SHOW VIEW</code></a></td> <td>Enable use of <a class="link" href="show-create-view.html" title="15.7.7.15 SHOW CREATE VIEW Statement"><code class="literal">SHOW CREATE VIEW</code></a>. Levels: Global, database, table.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_shutdown"><code class="literal">SHUTDOWN</code></a></td> <td>Enable use of <a class="link" href="mysqladmin.html" title="6.5.2 mysqladmin — A MySQL Server Administration Program"><span class="command"><strong>mysqladmin shutdown</strong></span></a>. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_super"><code class="literal">SUPER</code></a></td> <td>Enable use of other administrative operations such as <a class="link" href="change-replication-source-to.html" title="15.4.2.2 CHANGE REPLICATION SOURCE TO Statement"><code class="literal">CHANGE REPLICATION SOURCE TO</code></a>, <a class="link" href="kill.html" title="15.7.8.4 KILL Statement"><code class="literal">KILL</code></a>, <a class="link" href="purge-binary-logs.html" title="15.4.1.1 PURGE BINARY LOGS Statement"><code class="literal">PURGE BINARY LOGS</code></a>, <a class="link" href="set-variable.html" title="15.7.6.1 SET Syntax for Variable Assignment"><code class="literal">SET GLOBAL</code></a>, and <a class="link" href="mysqladmin.html" title="6.5.2 mysqladmin — A MySQL Server Administration Program"><span class="command"><strong>mysqladmin debug</strong></span></a> command. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_trigger"><code class="literal">TRIGGER</code></a></td> <td>Enable trigger operations. Levels: Global, database, table.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_update"><code class="literal">UPDATE</code></a></td> <td>Enable use of <a class="link" href="update.html" title="15.2.17 UPDATE Statement"><code class="literal">UPDATE</code></a>. Levels: Global, database, table, column.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_usage"><code class="literal">USAGE</code></a></td> <td>Synonym for <span class="quote">“<span class="quote">no privileges</span>”</span></td> </tr></tbody></table>

**Table 15.12 Permissible Dynamic Privileges for GRANT and REVOKE**

<table><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Privilege</th> <th>Meaning and Grantable Levels</th> </tr></thead><tbody><tr> <td><a class="link" href="privileges-provided.html#priv_application-password-admin"><code class="literal">APPLICATION_PASSWORD_ADMIN</code></a></td> <td>Enable dual password administration. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_audit-abort-exempt"><code class="literal">AUDIT_ABORT_EXEMPT</code></a></td> <td>Allow queries blocked by audit log filter. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_audit-admin"><code class="literal">AUDIT_ADMIN</code></a></td> <td>Enable audit log configuration. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_authentication-policy-admin"><code class="literal">AUTHENTICATION_POLICY_ADMIN</code></a></td> <td>Enable authentication policy administration. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_backup-admin"><code class="literal">BACKUP_ADMIN</code></a></td> <td>Enable backup administration. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_binlog-admin"><code class="literal">BINLOG_ADMIN</code></a></td> <td>Enable binary log control. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_binlog-encryption-admin"><code class="literal">BINLOG_ENCRYPTION_ADMIN</code></a></td> <td>Enable activation and deactivation of binary log encryption. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_clone-admin"><code class="literal">CLONE_ADMIN</code></a></td> <td>Enable clone administration. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_connection-admin"><code class="literal">CONNECTION_ADMIN</code></a></td> <td>Enable connection limit/restriction control. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_encryption-key-admin"><code class="literal">ENCRYPTION_KEY_ADMIN</code></a></td> <td>Enable <code class="literal">InnoDB</code> key rotation. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_firewall-admin"><code class="literal">FIREWALL_ADMIN</code></a></td> <td>Enable firewall rule administration, any user. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_firewall-exempt"><code class="literal">FIREWALL_EXEMPT</code></a></td> <td>Exempt user from firewall restrictions. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_firewall-user"><code class="literal">FIREWALL_USER</code></a></td> <td>Enable firewall rule administration, self. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_flush-optimizer-costs"><code class="literal">FLUSH_OPTIMIZER_COSTS</code></a></td> <td>Enable optimizer cost reloading. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_flush-status"><code class="literal">FLUSH_STATUS</code></a></td> <td>Enable status indicator flushing. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_flush-tables"><code class="literal">FLUSH_TABLES</code></a></td> <td>Enable table flushing. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_flush-user-resources"><code class="literal">FLUSH_USER_RESOURCES</code></a></td> <td>Enable user-resource flushing. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_group-replication-admin"><code class="literal">GROUP_REPLICATION_ADMIN</code></a></td> <td>Enable Group Replication control. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_innodb-redo-log-archive"><code class="literal">INNODB_REDO_LOG_ARCHIVE</code></a></td> <td>Enable redo log archiving administration. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_innodb-redo-log-enable"><code class="literal">INNODB_REDO_LOG_ENABLE</code></a></td> <td>Enable or disable redo logging. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_ndb-stored-user"><code class="literal">NDB_STORED_USER</code></a></td> <td>Enable sharing of user or role between SQL nodes (NDB Cluster). Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_passwordless-user-admin"><code class="literal">PASSWORDLESS_USER_ADMIN</code></a></td> <td>Enable passwordless user account administration. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_persist-ro-variables-admin"><code class="literal">PERSIST_RO_VARIABLES_ADMIN</code></a></td> <td>Enable persisting read-only system variables. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_replication-applier"><code class="literal">REPLICATION_APPLIER</code></a></td> <td>Act as the <code class="literal">PRIVILEGE_CHECKS_USER</code> for a replication channel. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_replication-slave-admin"><code class="literal">REPLICATION_SLAVE_ADMIN</code></a></td> <td>Enable regular replication control. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_resource-group-admin"><code class="literal">RESOURCE_GROUP_ADMIN</code></a></td> <td>Enable resource group administration. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_resource-group-user"><code class="literal">RESOURCE_GROUP_USER</code></a></td> <td>Enable resource group administration. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_role-admin"><code class="literal">ROLE_ADMIN</code></a></td> <td>Enable roles to be granted or revoked, use of <code class="literal">WITH ADMIN OPTION</code>. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_session-variables-admin"><code class="literal">SESSION_VARIABLES_ADMIN</code></a></td> <td>Enable setting restricted session system variables. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_show-routine"><code class="literal">SHOW_ROUTINE</code></a></td> <td>Enable access to stored routine definitions. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_skip-query-rewrite"><code class="literal">SKIP_QUERY_REWRITE</code></a></td> <td>Do not rewrite queries executed by this user. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_system-user"><code class="literal">SYSTEM_USER</code></a></td> <td>Designate account as system account. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_system-variables-admin"><code class="literal">SYSTEM_VARIABLES_ADMIN</code></a></td> <td>Enable modifying or persisting global system variables. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_table-encryption-admin"><code class="literal">TABLE_ENCRYPTION_ADMIN</code></a></td> <td>Enable overriding default encryption settings. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_telemetry-log-admin"><code class="literal">TELEMETRY_LOG_ADMIN</code></a></td> <td>Enable telemetry log configuration for MySQL HeatWave on AWS. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_tp-connection-admin"><code class="literal">TP_CONNECTION_ADMIN</code></a></td> <td>Enable thread pool connection administration. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_version-token-admin"><code class="literal">VERSION_TOKEN_ADMIN</code></a></td> <td>Enable use of Version Tokens functions. Level: Global.</td> </tr><tr> <td><a class="link" href="privileges-provided.html#priv_xa-recover-admin"><code class="literal">XA_RECOVER_ADMIN</code></a></td> <td>Enable <a class="link" href="xa-statements.html" title="15.3.8.1 XA Transaction SQL Statements"><code class="literal">XA RECOVER</code></a> execution. Level: Global.</td> </tr></tbody></table>

A trigger is associated with a table. To create or drop a trigger, you must have the `TRIGGER` privilege for the table, not the trigger.

In `GRANT` statements, the [`ALL [PRIVILEGES]`](privileges-provided.html#priv_all) or `PROXY` privilege must be named by itself and cannot be specified along with other privileges. [`ALL [PRIVILEGES]`](privileges-provided.html#priv_all) stands for all privileges available for the level at which privileges are to be granted except for the `GRANT OPTION` and `PROXY` privileges.

MySQL account information is stored in the tables of the `mysql` system schema. For additional details, consult Section 8.2, “Access Control and Account Management”, which discusses the `mysql` system schema and the access control system extensively.

If the grant tables hold privilege rows that contain mixed-case database or table names and the `lower_case_table_names` system variable is set to a nonzero value, `REVOKE` cannot be used to revoke these privileges. It is necessary in such cases to manipulate the grant tables directly. (`GRANT` does not create such rows when `lower_case_table_names` is set, but such rows might have been created prior to setting that variable. The `lower_case_table_names` setting can only be configured at server startup.)

Privileges can be granted at several levels, depending on the syntax used for the `ON` clause. For `REVOKE`, the same `ON` syntax specifies which privileges to remove.

For the global, database, table, and routine levels, `GRANT ALL` assigns only the privileges that exist at the level you are granting. For example, `GRANT ALL ON db_name.*` is a database-level statement, so it does not grant any global-only privileges such as `FILE`. Granting `ALL` does not assign the `GRANT OPTION` or `PROXY` privilege.

The *`object_type`* clause, if present, should be specified as `TABLE`, `EVENT`, `FUNCTION`, `LIBRARY`, or `PROCEDURE` when the following object is a table, an event, a stored function, a JavaScript library, or a stored procedure.

The privileges that a user holds for a database, table, column, or routine are formed additively as the logical `OR` of the account privileges at each of the privilege levels, including the global level. It is not possible to deny a privilege granted at a higher level by absence of that privilege at a lower level. For example, this statement grants the `SELECT` and `INSERT` privileges globally:

```
GRANT SELECT, INSERT ON *.* TO u1;
```

The globally granted privileges apply to all databases, tables, and columns, even though not granted at any of those lower levels.

It is possible to deny explicitly a privilege granted at the global level by revoking it for particular databases, if the `partial_revokes` system variable is enabled:

```
GRANT SELECT, INSERT, UPDATE ON *.* TO u1;
REVOKE INSERT, UPDATE ON db1.* FROM u1;
```

The result of the preceding statements is that `SELECT` applies globally to all tables, whereas `INSERT` and `UPDATE` apply globally except to tables in `db1`. Account access to `db1` is read only.

Details of the privilege-checking procedure are presented in Section 8.2.7, “Access Control, Stage 2: Request Verification”.

If you are using table, column, or routine privileges for even one user, the server examines table, column, and routine privileges for all users and this slows down MySQL a bit. Similarly, if you limit the number of queries, updates, or connections for any users, the server must monitor these values.

MySQL enables you to grant privileges on databases or tables that do not exist. For tables, the privileges to be granted must include the `CREATE` privilege. *This behavior is by design*, and is intended to enable the database administrator to prepare user accounts and privileges for databases or tables that are to be created at a later time.

Important

*MySQL does not automatically revoke any privileges when you drop a database or table*. However, if you drop a routine, any routine-level privileges granted for that routine are revoked.

##### Global Privileges

Global privileges are administrative or apply to all databases on a given server. To assign global privileges, use `ON *.*` syntax:

```
GRANT ALL ON *.* TO 'someuser'@'somehost';
GRANT SELECT, INSERT ON *.* TO 'someuser'@'somehost';
```

The `CREATE TABLESPACE`, `CREATE USER`, `FILE`, `PROCESS`, `RELOAD`, `REPLICATION CLIENT`, `REPLICATION SLAVE`, `SHOW DATABASES`, `SHUTDOWN`, `SUPER`, `CREATE ROLE` and `DROP ROLE` static privileges are administrative and can only be granted globally.

Dynamic privileges are all global and can only be granted globally.

Other privileges can be granted globally or at more specific levels.

The effect of `GRANT OPTION` granted at the global level differs for static and dynamic privileges:

* `GRANT OPTION` granted for any static global privilege applies to all static global privileges.

* `GRANT OPTION` granted for any dynamic privilege applies only to that dynamic privilege.

`GRANT ALL` at the global level grants all static global privileges and all currently registered dynamic privileges. A dynamic privilege registered subsequent to execution of the `GRANT` statement is not granted retroactively to any account.

MySQL stores global privileges in the `mysql.user` system table.

##### Database Privileges

Database privileges apply to all objects in a given database. To assign database-level privileges, use `ON db_name.*` syntax:

```
GRANT ALL ON mydb.* TO 'someuser'@'somehost';
GRANT SELECT, INSERT ON mydb.* TO 'someuser'@'somehost';
```

If you use `ON *` syntax (rather than `ON *.*`), privileges are assigned at the database level for the default database. An error occurs if there is no default database.

The `CREATE`, `DROP`, `EVENT`, `GRANT OPTION`, `LOCK TABLES`, and `REFERENCES` privileges can be specified at the database level. Table or routine privileges also can be specified at the database level, in which case they apply to all tables or routines in the database.

MySQL stores database privileges in the `mysql.db` system table.

##### Table Privileges

Table privileges apply to all columns in a given table. To assign table-level privileges, use `ON db_name.tbl_name` syntax:

```
GRANT ALL ON mydb.mytbl TO 'someuser'@'somehost';
GRANT SELECT, INSERT ON mydb.mytbl TO 'someuser'@'somehost';
```

If you specify *`tbl_name`* rather than *`db_name.tbl_name`*, the statement applies to *`tbl_name`* in the default database. An error occurs if there is no default database.

The permissible *`priv_type`* values at the table level are `ALTER`, `CREATE VIEW`, `CREATE`, `DELETE`, `DROP`, `GRANT OPTION`, `INDEX`, `INSERT`, `REFERENCES`, `SELECT`, `SHOW VIEW`, `TRIGGER`, and `UPDATE`.

Table-level privileges apply to base tables and views. They do not apply to tables created with [`CREATE TEMPORARY TABLE`](create-temporary-table.html "15.1.24.2 CREATE TEMPORARY TABLE Statement"), even if the table names match. For information about `TEMPORARY` table privileges, see Section 15.1.24.2, “CREATE TEMPORARY TABLE Statement”.

MySQL stores table privileges in the `mysql.tables_priv` system table.

##### Column Privileges

Column privileges apply to single columns in a given table. Each privilege to be granted at the column level must be followed by the column or columns, enclosed within parentheses.

```
GRANT SELECT (col1), INSERT (col1, col2) ON mydb.mytbl TO 'someuser'@'somehost';
```

The permissible *`priv_type`* values for a column (that is, when you use a *`column_list`* clause) are `INSERT`, `REFERENCES`, `SELECT`, and `UPDATE`.

MySQL stores column privileges in the `mysql.columns_priv` system table.

##### Stored Routine Privileges

The `ALTER ROUTINE`, `CREATE ROUTINE`, `EXECUTE`, and `GRANT OPTION` privileges apply to stored routines (procedures and functions). They can be granted at the global and database levels. Except for `CREATE ROUTINE`, these privileges can be granted at the routine level for individual routines.

```
GRANT CREATE ROUTINE ON mydb.* TO 'someuser'@'somehost';
GRANT EXECUTE ON PROCEDURE mydb.myproc TO 'someuser'@'somehost';
```

The permissible *`priv_type`* values at the routine level are [`ALTER ROUTINE`](privileges-provided.html#priv_alter-routine), `EXECUTE`, and `GRANT OPTION`. `CREATE ROUTINE` is not a routine-level privilege because you must have the privilege at the global or database level to create a routine in the first place.

MySQL stores routine-level privileges in the `mysql.procs_priv` system table.

##### Proxy User Privileges

The `PROXY` privilege enables one user to be a proxy for another. The proxy user impersonates or takes the identity of the proxied user; that is, it assumes the privileges of the proxied user.

```
GRANT PROXY ON 'localuser'@'localhost' TO 'externaluser'@'somehost';
```

When `PROXY` is granted, it must be the only privilege named in the `GRANT` statement, and the only permitted `WITH` option is `WITH GRANT OPTION`.

Proxying requires that the proxy user authenticate through a plugin that returns the name of the proxied user to the server when the proxy user connects, and that the proxy user have the `PROXY` privilege for the proxied user. For details and examples, see Section 8.2.19, “Proxy Users”.

MySQL stores proxy privileges in the `mysql.proxies_priv` system table.

##### Granting Roles

`GRANT` syntax without an `ON` clause grants roles rather than individual privileges. A role is a named collection of privileges; see Section 8.2.10, “Using Roles”. For example:

```
GRANT 'role1', 'role2' TO 'user1'@'localhost', 'user2'@'localhost';
```

Each role to be granted must exist, as well as each user account or role to which it is to be granted. Roles cannot be granted to anonymous users.

Granting a role does not automatically cause the role to be active. For information about role activation and inactivation, see Activating Roles.

These privileges are required to grant roles:

* If you have the `ROLE_ADMIN` privilege (or the deprecated `SUPER` privilege), you can grant or revoke any role to users or roles.

* If you were granted a role with a `GRANT` statement that includes the `WITH ADMIN OPTION` clause, you become able to grant that role to other users or roles, or revoke it from other users or roles, as long as the role is active at such time as you subsequently grant or revoke it. This includes the ability to use `WITH ADMIN OPTION` itself.

* To grant a role that has the `SYSTEM_USER` privilege, you must have the `SYSTEM_USER` privilege.

It is possible to create circular references with `GRANT`. For example:

```
CREATE USER 'u1', 'u2';
CREATE ROLE 'r1', 'r2';

GRANT 'u1' TO 'u1';   -- simple loop: u1 => u1
GRANT 'r1' TO 'r1';   -- simple loop: r1 => r1

GRANT 'r2' TO 'u2';
GRANT 'u2' TO 'r2';   -- mixed user/role loop: u2 => r2 => u2
```

Circular grant references are permitted but add no new privileges or roles to the grantee because a user or role already has its privileges and roles.

##### The `AS` Clause and Privilege Restrictions

`GRANT` can specify additional information about the privilege context to use for statement execution by using an `AS user [WITH ROLE]` clause. This syntax is visible at the SQL level, although its primary purpose is to enable uniform replication across all nodes of grantor privilege restrictions imposed by partial revokes, by causing those restrictions to appear in the binary log. For information about partial revokes, see Section 8.2.12, “Privilege Restriction Using Partial Revokes”.

When the `AS user` clause is specified, statement execution takes into account any privilege restrictions associated with the named user, including all roles specified by `WITH ROLE`, if present. The result is that the privileges actually granted by the statement may be reduced relative to those specified.

These conditions apply to the `AS user` clause:

* `AS` has an effect only when the named *`user`* has privilege restrictions (which implies that the `partial_revokes` system variable is enabled).

* If `WITH ROLE` is given, all roles named must be granted to the named *`user`*.

* The named *`user`* should be a MySQL account specified as `'user_name'@'host_name'`, `CURRENT_USER`, or `CURRENT_USER()`. The current user may be named together with `WITH ROLE` for the case that the executing user wants `GRANT` to execute with a set of roles applied that may differ from the roles active within the current session.

* `AS` cannot be used to gain privileges not possessed by the user who executes the `GRANT` statement. The executing user must have at least the privileges to be granted, but the `AS` clause can only restrict the privileges granted, not escalate them.

* With respect to the privileges to be granted, `AS` cannot specify a user/role combination that has more privileges (fewer restrictions) than the user who executes the `GRANT` statement. The `AS` user/role combination is permitted to have more privileges than the executing user, but only if the statement does not grant those additional privileges.

* `AS` is supported only for granting global privileges (`ON *.*`).

* `AS` is not supported for `PROXY` grants.

The following example illustrates the effect of the `AS` clause. Create a user `u1` that has some global privileges, as well as restrictions on those privileges:

```
CREATE USER u1;
GRANT SELECT, INSERT, UPDATE, DELETE ON *.* TO u1;
REVOKE INSERT, UPDATE ON schema1.* FROM u1;
REVOKE SELECT ON schema2.* FROM u1;
```

Also create a role `r1` that lifts some of the privilege restrictions and grant the role to `u1`:

```
CREATE ROLE r1;
GRANT INSERT ON schema1.* TO r1;
GRANT SELECT ON schema2.* TO r1;
GRANT r1 TO u1;
```

Now, using an account that has no privilege restrictions of its own, grant to multiple users the same set of global privileges, but each with different restrictions imposed by the `AS` clause, and check which privileges are actually granted.

* The `GRANT` statement here has no `AS` clause, so the privileges granted are exactly those specified:

  ```
  mysql> CREATE USER u2;
  mysql> GRANT SELECT, INSERT, UPDATE ON *.* TO u2;
  mysql> SHOW GRANTS FOR u2;
  +-------------------------------------------------+
  | Grants for u2@%                                 |
  +-------------------------------------------------+
  | GRANT SELECT, INSERT, UPDATE ON *.* TO `u2`@`%` |
  +-------------------------------------------------+
  ```

* The `GRANT` statement here has an `AS` clause, so the privileges granted are those specified but with the restrictions from `u1` applied:

  ```
  mysql> CREATE USER u3;
  mysql> GRANT SELECT, INSERT, UPDATE ON *.* TO u3 AS u1;
  mysql> SHOW GRANTS FOR u3;
  +----------------------------------------------------+
  | Grants for u3@%                                    |
  +----------------------------------------------------+
  | GRANT SELECT, INSERT, UPDATE ON *.* TO `u3`@`%`    |
  | REVOKE INSERT, UPDATE ON `schema1`.* FROM `u3`@`%` |
  | REVOKE SELECT ON `schema2`.* FROM `u3`@`%`         |
  +----------------------------------------------------+
  ```

  As mentioned previously, the `AS` clause can only add privilege restrictions; it cannot escalate privileges. Thus, although `u1` has the `DELETE` privilege, that is not included in the privileges granted because the statement does not specify granting `DELETE`.

* The `AS` clause for the `GRANT` statement here makes the role `r1` active for `u1`. That role lifts some of the restrictions on `u1`. Consequently, the privileges granted have some restrictions, but not so many as for the previous `GRANT` statement:

  ```
  mysql> CREATE USER u4;
  mysql> GRANT SELECT, INSERT, UPDATE ON *.* TO u4 AS u1 WITH ROLE r1;
  mysql> SHOW GRANTS FOR u4;
  +-------------------------------------------------+
  | Grants for u4@%                                 |
  +-------------------------------------------------+
  | GRANT SELECT, INSERT, UPDATE ON *.* TO `u4`@`%` |
  | REVOKE UPDATE ON `schema1`.* FROM `u4`@`%`      |
  +-------------------------------------------------+
  ```

If a `GRANT` statement includes an `AS user` clause, privilege restrictions on the user who executes the statement are ignored (rather than applied as they would be in the absence of an `AS` clause).

##### Other Account Characteristics

The optional `WITH` clause is used to enable a user to grant privileges to other users. The `WITH GRANT OPTION` clause gives the user the ability to give to other users any privileges the user has at the specified privilege level.

To grant the `GRANT OPTION` privilege to an account without otherwise changing its privileges, do this:

```
GRANT USAGE ON *.* TO 'someuser'@'somehost' WITH GRANT OPTION;
```

Be careful to whom you give the [`GRANT OPTION`](privileges-provided.html#priv_grant-option) privilege because two users with different privileges may be able to combine privileges!

You cannot grant another user a privilege which you yourself do not have; the `GRANT OPTION` privilege enables you to assign only those privileges which you yourself possess.

Be aware that when you grant a user the `GRANT OPTION` privilege at a particular privilege level, any privileges the user possesses (or may be given in the future) at that level can also be granted by that user to other users. Suppose that you grant a user the `INSERT` privilege on a database. If you then grant the `SELECT` privilege on the database and specify `WITH GRANT OPTION`, that user can give to other users not only the `SELECT` privilege, but also `INSERT`. If you then grant the `UPDATE` privilege to the user on the database, the user can grant `INSERT`, `SELECT`, and `UPDATE`.

For a nonadministrative user, you should not grant the `ALTER` privilege globally or for the `mysql` system schema. If you do that, the user can try to subvert the privilege system by renaming tables!

For additional information about security risks associated with particular privileges, see Section 8.2.2, “Privileges Provided by MySQL”.

##### MySQL and Standard SQL Versions of GRANT

The biggest differences between the MySQL and standard SQL versions of `GRANT` are:

* MySQL associates privileges with the combination of a host name and user name and not with only a user name.

* Standard SQL does not have global or database-level privileges, nor does it support all the privilege types that MySQL supports.

* MySQL does not support the standard SQL `UNDER` privilege.

* Standard SQL privileges are structured in a hierarchical manner. If you remove a user, all privileges the user has been granted are revoked. This is also true in MySQL if you use `DROP USER`. See Section 15.7.1.5, “DROP USER Statement”.

* In standard SQL, when you drop a table, all privileges for the table are revoked. In standard SQL, when you revoke a privilege, all privileges that were granted based on that privilege are also revoked. In MySQL, privileges can be dropped with `DROP USER` or `REVOKE` statements.

* In MySQL, it is possible to have the `INSERT` privilege for only some of the columns in a table. In this case, you can still execute `INSERT` statements on the table, provided that you insert values only for those columns for which you have the `INSERT` privilege. The omitted columns are set to their implicit default values if strict SQL mode is not enabled. In strict mode, the statement is rejected if any of the omitted columns have no default value. (Standard SQL requires you to have the `INSERT` privilege on all columns.) For information about strict SQL mode and implicit default values, see Section 7.1.11, “Server SQL Modes”, and Section 13.6, “Data Type Default Values”.


#### 15.7.1.7 RENAME USER Statement

```
RENAME USER old_user TO new_user
    [, old_user TO new_user] ...
```

The `RENAME USER` statement renames existing MySQL accounts. An error occurs for old accounts that do not exist or new accounts that already exist.

To use `RENAME USER`, you must have the global `CREATE USER` privilege, or the `UPDATE` privilege for the `mysql` system schema. When the `read_only` system variable is enabled, `RENAME USER` additionally requires the `CONNECTION_ADMIN` privilege (or the deprecated `SUPER` privilege).

`RENAME USER` fails with an error if any account to be renamed is named as the `DEFINER` attribute for any stored object. (That is, the statement fails if renaming an account would cause a stored object to become orphaned.) To perform the operation anyway, you must have the `SET_ANY_DEFINER` or `ALLOW_NONEXISTENT_DEFINER` privilege; in this case, the statement succeeds with a warning rather than failing with an error. For additional information, including how to identify which objects name a given account as the `DEFINER` attribute, see Orphan Stored Objects.

Each account name uses the format described in Section 8.2.4, “Specifying Account Names”. For example:

```
RENAME USER 'jeffrey'@'localhost' TO 'jeff'@'127.0.0.1';
```

The host name part of the account name, if omitted, defaults to `'%'`.

`RENAME USER` causes the privileges held by the old user to be those held by the new user. However, `RENAME USER` does not automatically drop or invalidate databases or objects within them that the old user created. This includes stored programs or views for which the `DEFINER` attribute names the old user. Attempts to access such objects may produce an error if they execute in definer security context. (For information about security context, see Section 27.8, “Stored Object Access Control”.)

The privilege changes take effect as indicated in Section 8.2.13, “When Privilege Changes Take Effect”.


#### 15.7.1.8 REVOKE Statement

```
REVOKE [IF EXISTS]
    priv_type [(column_list)]
      [, priv_type [(column_list)]] ...
    ON [object_type] priv_level
    FROM user_or_role [, user_or_role] ...
    [IGNORE UNKNOWN USER]

REVOKE [IF EXISTS] ALL [PRIVILEGES], GRANT OPTION
    FROM user_or_role [, user_or_role] ...
    [IGNORE UNKNOWN USER]

REVOKE [IF EXISTS] PROXY ON user_or_role
    FROM user_or_role [, user_or_role] ...
    [IGNORE UNKNOWN USER]

REVOKE [IF EXISTS] role [, role ] ...
    FROM user_or_role [, user_or_role ] ...
    [IGNORE UNKNOWN USER]

user_or_role: {
    user (see Section 8.2.4, “Specifying Account Names”)
  | role (see Section 8.2.5, “Specifying Role Names”
}
```

The `REVOKE` statement enables system administrators to revoke privileges and roles, which can be revoked from user accounts and roles.

For details on the levels at which privileges exist, the permissible *`priv_type`*, *`priv_level`*, and *`object_type`* values, and the syntax for specifying users and passwords, see Section 15.7.1.6, “GRANT Statement”.

For information about roles, see Section 8.2.10, “Using Roles”.

When the `read_only` system variable is enabled, `REVOKE` requires the `CONNECTION_ADMIN` or privilege (or the deprecated `SUPER` privilege), in addition to any other required privileges described in the following discussion.

All the forms shown for `REVOKE` support an `IF EXISTS` option as well as an `IGNORE UNKNOWN USER` option. With neither of these modifications, `REVOKE` either succeeds for all named users and roles, or rolls back and has no effect if any error occurs; the statement is written to the binary log only if it succeeds for all named users and roles. The precise effects of `IF EXISTS` and `IGNORE UNKNOWN USER` are discussed later in this section.

Each account name uses the format described in Section 8.2.4, “Specifying Account Names”. Each role name uses the format described in Section 8.2.5, “Specifying Role Names”. For example:

```
REVOKE INSERT ON *.* FROM 'jeffrey'@'localhost';
REVOKE 'role1', 'role2' FROM 'user1'@'localhost', 'user2'@'localhost';
REVOKE SELECT ON world.* FROM 'role3';
```

The host name part of the account or role name, if omitted, defaults to `'%'`.

To use the first `REVOKE` syntax, you must have the `GRANT OPTION` privilege, and you must have the privileges that you are revoking.

To revoke all privileges from a user, use one of the following statements; either of these statements drops all global, database, table, column, and routine privileges for the named users or roles:

```
REVOKE ALL PRIVILEGES, GRANT OPTION
  FROM user_or_role [, user_or_role] ...

REVOKE ALL ON *.*
  FROM user_or_role [, user_or_role] ...
```

Neither of the two statements just shown revokes any roles.

To use these `REVOKE` statements, you must have the global [`CREATE USER`](privileges-provided.html#priv_create-user) privilege, or the `UPDATE` privilege for the `mysql` system schema.

The syntax for which the `REVOKE` keyword is followed by one or more role names takes a `FROM` clause indicating one or more users or roles from which to revoke the roles.

The `IF EXISTS` and `IGNORE UNKNOWN USER` options have the effects listed here:

* `IF EXISTS` means that, if the target user or role exists but no such privilege or role is found assigned to the target for any reason, a warning is raised, instead of an error; if no privilege or role named by the statement is assigned to the target, the statement has no (other) effect. Otherwise, `REVOKE` executes normally; if the user does not exist, the statement raises an error.

  *Example*: Given table `t1` in database `test`, we execute the following statements, with the results shown.

  ```
  mysql> CREATE USER jerry@localhost;
  Query OK, 0 rows affected (0.01 sec)

  mysql> REVOKE SELECT ON test.t1 FROM jerry@localhost;
  ERROR 1147 (42000): There is no such grant defined for user 'jerry' on host
  'localhost' on table 't1'
  mysql> REVOKE IF EXISTS SELECT ON test.t1 FROM jerry@localhost;
  Query OK, 0 rows affected, 1 warning (0.00 sec)

  mysql> SHOW WARNINGS\G
  *************************** 1. row ***************************
    Level: Warning
     Code: 1147
  Message: There is no such grant defined for user 'jerry' on host 'localhost' on
  table 't1'
  1 row in set (0.00 sec)
  ```

  `IF EXISTS` causes an error to be demoted to a warning even if the privilege or role named does not exist, or the statement attempts to assign it at the wrong level.

* If the `REVOKE` statement includes `IGNORE UNKNOWN USER`, the statement raises a warning for any target user or role named in the statement but not found; if no target named by the statement exists, `REVOKE` succeeds but has no actual effect. Otherwise, the statement executes as usual, and attempting to revoke a privilege not assigned to the target for whatever reason raises an error, as expected.

  *Example* (continuing from the previous example):

  ```
  mysql> DROP USER IF EXISTS jerry@localhost;
  Query OK, 0 rows affected (0.01 sec)

  mysql> REVOKE SELECT ON test.t1 FROM jerry@localhost;
  ERROR 1147 (42000): There is no such grant defined for user 'jerry' on host
  'localhost' on table 't1'
  mysql> REVOKE SELECT ON test.t1 FROM jerry@localhost IGNORE UNKNOWN USER;
  Query OK, 0 rows affected, 1 warning (0.01 sec)

  mysql> SHOW WARNINGS\G
  *************************** 1. row ***************************
    Level: Warning
     Code: 3162
  Message: Authorization ID jerry does not exist.
  1 row in set (0.00 sec)
  ```

* The combination of `IF EXISTS` and `IGNORE UNKNOWN USER` means that `REVOKE` never raises an error for an unknown target user or role or for an unassigned or unavailable privilege, and the statement as whole in such cases succeeds; roles or privileges are removed from existing target users or roles whenever possible, and any revocation which is not possible raises a warning and executes as a `NOOP`.

  *Example* (again continuing from example in the previous item):

  ```
  # No such user, no such role
  mysql> DROP ROLE IF EXISTS Bogus;
  Query OK, 0 rows affected, 1 warning (0.02 sec)

  mysql> SHOW WARNINGS;
  +-------+------+----------------------------------------------+
  | Level | Code | Message                                      |
  +-------+------+----------------------------------------------+
  | Note  | 3162 | Authorization ID 'Bogus'@'%' does not exist. |
  +-------+------+----------------------------------------------+
  1 row in set (0.00 sec)

  # This statement attempts to revoke a nonexistent role from a nonexistent user
  mysql> REVOKE Bogus ON test FROM jerry@localhost;
  ERROR 3619 (HY000): Illegal privilege level specified for test

  # The same, with IF EXISTS
  mysql> REVOKE IF EXISTS Bogus ON test FROM jerry@localhost;
  ERROR 1147 (42000): There is no such grant defined for user 'jerry' on host
  'localhost' on table 'test'

  # The same, with IGNORE UNKNOWN USER
  mysql> REVOKE Bogus ON test FROM jerry@localhost IGNORE UNKNOWN USER;
  ERROR 3619 (HY000): Illegal privilege level specified for test

  # The same, with both options
  mysql> REVOKE IF EXISTS Bogus ON test FROM jerry@localhost IGNORE UNKNOWN USER;
  Query OK, 0 rows affected, 2 warnings (0.01 sec)

  mysql> SHOW WARNINGS;
  +---------+------+--------------------------------------------+
  | Level   | Code | Message                                    |
  +---------+------+--------------------------------------------+
  | Warning | 3619 | Illegal privilege level specified for test |
  | Warning | 3162 | Authorization ID jerry does not exist.     |
  +---------+------+--------------------------------------------+
  2 rows in set (0.00 sec)
  ```

Roles named in the `mandatory_roles` system variable value cannot be revoked. When `IF EXISTS` and `IGNORE UNKNOWN USER` are used together in a statement that tries to remove a mandatory privilege, the error normally raised by attempting to do this is demoted to a warning; the statement executes successfully, but does not make any changes.

A revoked role immediately affects any user account from which it was revoked, such that within any current session for the account, its privileges are adjusted for the next statement executed.

Revoking a role revokes the role itself, not the privileges that it represents. Suppose that an account is granted a role that includes a given privilege, and is also granted the privilege explicitly or another role that includes the privilege. In this case, the account still possesses that privilege if the first role is revoked. For example, if an account is granted two roles that each include `SELECT`, the account still can select after either role is revoked.

`REVOKE ALL ON *.*` (at the global level) revokes all granted static global privileges and all granted dynamic privileges.

A revoked privilege that is granted but not known to the server is revoked with a warning. This situation can occur for dynamic privileges. For example, a dynamic privilege can be granted while the component that registers it is installed, but if that component is subsequently uninstalled, the privilege becomes unregistered, although accounts that possess the privilege still possess it and it can be revoked from them.

`REVOKE` removes privileges, but does not remove rows from the `mysql.user` system table. To remove a user account entirely, use `DROP USER`. See Section 15.7.1.5, “DROP USER Statement”.

If the grant tables hold privilege rows that contain mixed-case database or table names and the `lower_case_table_names` system variable is set to a nonzero value, `REVOKE` cannot be used to revoke these privileges. It is necessary in such cases to manipulate the grant tables directly. (`GRANT` does not create such rows when `lower_case_table_names` is set, but such rows might have been created prior to setting the variable. The `lower_case_table_names` setting can only be configured when initializing the server.)

When successfully executed from the **mysql** program, `REVOKE` responds with `Query OK, 0 rows affected`. To determine what privileges remain after the operation, use `SHOW GRANTS`. See Section 15.7.7.23, “SHOW GRANTS Statement”.


#### 15.7.1.9 SET DEFAULT ROLE Statement

```
SET DEFAULT ROLE
    {NONE | ALL | role [, role ] ...}
    TO user [, user ] ...
```

For each *`user`* named immediately after the `TO` keyword, this statement defines which roles become active when the user connects to the server and authenticates, or when the user executes the [`SET ROLE DEFAULT`](set-role.html "15.7.1.11 SET ROLE Statement") statement during a session.

`SET DEFAULT ROLE` is alternative syntax for [`ALTER USER ... DEFAULT ROLE`](alter-user.html "15.7.1.1 ALTER USER Statement") (see Section 15.7.1.1, “ALTER USER Statement”). However, `ALTER USER` can set the default for only a single user, whereas [`SET DEFAULT ROLE`](set-default-role.html "15.7.1.9 SET DEFAULT ROLE Statement") can set the default for multiple users. On the other hand, you can specify `CURRENT_USER` as the user name for the `ALTER USER` statement, whereas you cannot for [`SET DEFAULT ROLE`](set-default-role.html "15.7.1.9 SET DEFAULT ROLE Statement").

`SET DEFAULT ROLE` requires these privileges:

* Setting the default roles for another user requires the global `CREATE USER` privilege, or the `UPDATE` privilege for the `mysql.default_roles` system table.

* Setting the default roles for yourself requires no special privileges, as long as the roles you want as the default have been granted to you.

Each role name uses the format described in Section 8.2.5, “Specifying Role Names”. For example:

```
SET DEFAULT ROLE 'admin', 'developer' TO 'joe'@'10.0.0.1';
```

The host name part of the role name, if omitted, defaults to `'%'`.

The clause following the `DEFAULT ROLE` keywords permits these values:

* `NONE`: Set the default to `NONE` (no roles).

* `ALL`: Set the default to all roles granted to the account.

* `role [, role ] ...`: Set the default to the named roles, which must exist and be granted to the account at the time [`SET DEFAULT ROLE`](set-default-role.html "15.7.1.9 SET DEFAULT ROLE Statement") is executed.

Note

`SET DEFAULT ROLE` and [`SET ROLE DEFAULT`](set-role.html "15.7.1.11 SET ROLE Statement") are different statements:

* `SET DEFAULT ROLE` defines which account roles to activate by default within account sessions.

* [`SET ROLE DEFAULT`](set-role.html "15.7.1.11 SET ROLE Statement") sets the active roles within the current session to the current account default roles.

For role usage examples, see Section 8.2.10, “Using Roles”.


#### 15.7.1.10 SET PASSWORD Statement

```
SET PASSWORD [FOR user] auth_option
    [REPLACE 'current_auth_string']
    [RETAIN CURRENT PASSWORD]

auth_option: {
    = 'auth_string'
  | TO RANDOM
}
```

The `SET PASSWORD` statement assigns a password to a MySQL user account. The password may be either explicitly specified in the statement or randomly generated by MySQL. The statement may also include a password-verification clause that specifies the account current password to be replaced, and a clause that manages whether an account has a secondary password. `'auth_string'` and `'current_auth_string'` each represent a cleartext (unencrypted) password.

Note

Rather than using `SET PASSWORD` to assign passwords, `ALTER USER` is the preferred statement for account alterations, including assigning passwords. For example:

```
ALTER USER user IDENTIFIED BY 'auth_string';
```

Note

Clauses for random password generation, password verification, and secondary passwords apply only to accounts that use an authentication plugin that stores credentials internally to MySQL. For accounts that use a plugin that performs authentication against a credentials system that is external to MySQL, password management must be handled externally against that system as well. For more information about internal credentials storage, see Section 8.2.15, “Password Management”.

The `REPLACE 'current_auth_string'` clause performs password verification. If given:

* `REPLACE` specifies the account current password to be replaced, as a cleartext (unencrypted) string.

* The clause must be given if password changes for the account are required to specify the current password, as verification that the user attempting to make the change actually knows the current password.

* The clause is optional if password changes for the account may but need not specify the current password.

* The statement fails if the clause is given but does not match the current password, even if the clause is optional.

* `REPLACE` can be specified only when changing the account password for the current user.

For more information about password verification by specifying the current password, see Section 8.2.15, “Password Management”.

The `RETAIN CURRENT PASSWORD` clause implements dual-password capability. If given:

* `RETAIN CURRENT PASSWORD` retains an account current password as its secondary password, replacing any existing secondary password. The new password becomes the primary password, but clients can use the account to connect to the server using either the primary or secondary password. (Exception: If the new password specified by the `SET PASSWORD` statement is empty, the secondary password becomes empty as well, even if `RETAIN CURRENT PASSWORD` is given.)

* If you specify `RETAIN CURRENT PASSWORD` for an account that has an empty primary password, the statement fails.

* If an account has a secondary password and you change its primary password without specifying `RETAIN CURRENT PASSWORD`, the secondary password remains unchanged.

For more information about use of dual passwords, see Section 8.2.15, “Password Management”.

`SET PASSWORD` permits these *`auth_option`* syntaxes:

* `= 'auth_string'`

  Assigns the account the given literal password.

* `TO RANDOM`

  Assigns the account a password randomly generated by MySQL. The statement also returns the cleartext password in a result set to make it available to the user or application executing the statement.

  For details about the result set and characteristics of randomly generated passwords, see Random Password Generation.

Important

Under some circumstances, [`SET PASSWORD`](set-password.html "15.7.1.10 SET PASSWORD Statement") may be recorded in server logs or on the client side in a history file such as `~/.mysql_history`, which means that cleartext passwords may be read by anyone having read access to that information. For information about the conditions under which this occurs for the server logs and how to control it, see Section 8.1.2.3, “Passwords and Logging”. For similar information about client-side logging, see Section 6.5.1.3, “mysql Client Logging”.

`SET PASSWORD` can be used with or without a `FOR` clause that explicitly names a user account:

* With a `FOR user` clause, the statement sets the password for the named account, which must exist:

  ```
  SET PASSWORD FOR 'jeffrey'@'localhost' = 'auth_string';
  ```

* With no `FOR user` clause, the statement sets the password for the current user:

  ```
  SET PASSWORD = 'auth_string';
  ```

  Any client who connects to the server using a nonanonymous account can change the password for that account. (In particular, you can change your own password.) To see which account the server authenticated you as, invoke the `CURRENT_USER()` function:

  ```
  SELECT CURRENT_USER();
  ```

If a `FOR user` clause is given, the account name uses the format described in Section 8.2.4, “Specifying Account Names”. For example:

```
SET PASSWORD FOR 'bob'@'%.example.org' = 'auth_string';
```

The host name part of the account name, if omitted, defaults to `'%'`.

`SET PASSWORD` interprets the string as a cleartext string, passes it to the authentication plugin associated with the account, and stores the result returned by the plugin in the account row in the `mysql.user` system table. (The plugin is given the opportunity to hash the value into the encryption format it expects. The plugin may use the value as specified, in which case no hashing occurs.)

Setting the password for a named account (with a `FOR` clause) requires the `UPDATE` privilege for the `mysql` system schema. Setting the password for yourself (for a nonanonymous account with no `FOR` clause) requires no special privileges.

Statements that modify secondary passwords require these privileges:

* The `APPLICATION_PASSWORD_ADMIN` privilege is required to use the `RETAIN CURRENT PASSWORD` clause for [`SET PASSWORD`](set-password.html "15.7.1.10 SET PASSWORD Statement") statements that apply to your own account. The privilege is required to manipulate your own secondary password because most users require only one password.

* If an account is to be permitted to manipulate secondary passwords for all accounts, it should be granted the `CREATE USER` privilege rather than `APPLICATION_PASSWORD_ADMIN`.

When the `read_only` system variable is enabled, `SET PASSWORD` requires the `CONNECTION_ADMIN` privilege (or the deprecated `SUPER` privilege), in addition to any other required privileges.

For additional information about setting passwords and authentication plugins, see Section 8.2.14, “Assigning Account Passwords”, and Section 8.2.17, “Pluggable Authentication”.


#### 15.7.1.11 SET ROLE Statement

```
SET ROLE {
    DEFAULT
  | NONE
  | ALL
  | ALL EXCEPT role [, role ] ...
  | role [, role ] ...
}
```

`SET ROLE` modifies the current user's effective privileges within the current session by specifying which of its granted roles are active. Granted roles include those granted explicitly to the user and those named in the `mandatory_roles` system variable value.

Examples:

```
SET ROLE DEFAULT;
SET ROLE 'role1', 'role2';
SET ROLE ALL;
SET ROLE ALL EXCEPT 'role1', 'role2';
```

Each role name uses the format described in Section 8.2.5, “Specifying Role Names”. The host name part of the role name, if omitted, defaults to `'%'`.

Privileges that the user has been granted directly (rather than through roles) remain unaffected by changes to the active roles.

The statement permits these role specifiers:

* `DEFAULT`: Activate the account default roles. Default roles are those specified with `SET DEFAULT ROLE`.

  When a user connects to the server and authenticates successfully, the server determines which roles to activate as the default roles. If the `activate_all_roles_on_login` system variable is enabled, the server activates all granted roles. Otherwise, the server executes [`SET ROLE DEFAULT`](set-role.html "15.7.1.11 SET ROLE Statement") implicitly. The server activates only default roles that can be activated. The server writes warnings to its error log for default roles that cannot be activated, but the client receives no warnings.

  If a user executes [`SET ROLE DEFAULT`](set-role.html "15.7.1.11 SET ROLE Statement") during a session, an error occurs if any default role cannot be activated (for example, if it does not exist or is not granted to the user). In this case, the current active roles are not changed.

* `NONE`: Set the active roles to `NONE` (no active roles).

* `ALL`: Activate all roles granted to the account.

* `ALL EXCEPT role [, role ] ...`: Activate all roles granted to the account except those named. The named roles need not exist or be granted to the account.

* `role [, role ] ...`: Activate the named roles, which must be granted to the account.

Note

`SET DEFAULT ROLE` and [`SET ROLE DEFAULT`](set-role.html "15.7.1.11 SET ROLE Statement") are different statements:

* `SET DEFAULT ROLE` defines which account roles to activate by default within account sessions.

* [`SET ROLE DEFAULT`](set-role.html "15.7.1.11 SET ROLE Statement") sets the active roles within the current session to the current account default roles.

For role usage examples, see Section 8.2.10, “Using Roles”.


### 15.7.2 Resource Group Management Statements

MySQL supports creation and management of resource groups, and permits assigning threads running within the server to particular groups so that threads execute according to the resources available to the group. This section describes the SQL statements available for resource group management. For general discussion of the resource group capability, see Section 7.1.16, “Resource Groups”.


#### 15.7.2.1 ALTER RESOURCE GROUP Statement

```
ALTER RESOURCE GROUP group_name
    [VCPU [=] vcpu_spec [, vcpu_spec] ...]
    [THREAD_PRIORITY [=] N]
    [ENABLE|DISABLE [FORCE]]

vcpu_spec: {N | M - N}
```

`ALTER RESOURCE GROUP` is used for resource group management (see Section 7.1.16, “Resource Groups”). This statement alters modifiable attributes of an existing resource group. It requires the `RESOURCE_GROUP_ADMIN` privilege.

*`group_name`* identifies which resource group to alter. If the group does not exist, an error occurs.

The attributes for CPU affinity, priority, and whether the group is enabled can be modified with [`ALTER RESOURCE GROUP`](alter-resource-group.html "15.7.2.1 ALTER RESOURCE GROUP Statement"). These attributes are specified the same way as described for [`CREATE RESOURCE GROUP`](create-resource-group.html "15.7.2.2 CREATE RESOURCE GROUP Statement") (see Section 15.7.2.2, “CREATE RESOURCE GROUP Statement”). Only the attributes specified are altered. Unspecified attributes retain their current values.

The `FORCE` modifier is used with `DISABLE`. It determines statement behavior if the resource group has any threads assigned to it:

* If `FORCE` is not given, existing threads in the group continue to run until they terminate, but new threads cannot be assigned to the group.

* If `FORCE` is given, existing threads in the group are moved to their respective default group (system threads to `SYS_default`, user threads to `USR_default`).

The name and type attributes are set at group creation time and cannot be modified thereafter with [`ALTER RESOURCE GROUP`](alter-resource-group.html "15.7.2.1 ALTER RESOURCE GROUP Statement").

Examples:

* Alter a group CPU affinity:

  ```
  ALTER RESOURCE GROUP rg1 VCPU = 0-63;
  ```

* Alter a group thread priority:

  ```
  ALTER RESOURCE GROUP rg2 THREAD_PRIORITY = 5;
  ```

* Disable a group, moving any threads assigned to it to the default groups:

  ```
  ALTER RESOURCE GROUP rg3 DISABLE FORCE;
  ```

Resource group management is local to the server on which it occurs. `ALTER RESOURCE GROUP` statements are not written to the binary log and are not replicated.


#### 15.7.2.2 CREATE RESOURCE GROUP Statement

```
CREATE RESOURCE GROUP group_name
    TYPE = {SYSTEM|USER}
    [VCPU [=] vcpu_spec [, vcpu_spec] ...]
    [THREAD_PRIORITY [=] N]
    [ENABLE|DISABLE]

vcpu_spec: {N | M - N}
```

`CREATE RESOURCE GROUP` is used for resource group management (see Section 7.1.16, “Resource Groups”). This statement creates a new resource group and assigns its initial attribute values. It requires the `RESOURCE_GROUP_ADMIN` privilege.

*`group_name`* identifies which resource group to create. If the group already exists, an error occurs.

The `TYPE` attribute is required. It should be `SYSTEM` for a system resource group, `USER` for a user resource group. The group type affects permitted `THREAD_PRIORITY` values, as described later.

The `VCPU` attribute indicates the CPU affinity; that is, the set of virtual CPUs the group can use:

* If `VCPU` is not given, the resource group has no CPU affinity and can use all available CPUs.

* If `VCPU` is given, the attribute value is a list of comma-separated CPU numbers or ranges:

  + Each number must be an integer in the range from 0 to the number of CPUs − 1. For example, on a system with 64 CPUs, the number can range from 0 to 63.

  + A range is given in the form *`M`* − *`N`*, where *`M`* is less than or equal to *`N`* and both numbers are in the CPU range.

  + If a CPU number is an integer outside the permitted range or is not an integer, an error occurs.

Example `VCPU` specifiers (these are all equivalent):

```
VCPU = 0,1,2,3,9,10
VCPU = 0-3,9-10
VCPU = 9,10,0-3
VCPU = 0,10,1,9,3,2
```

The `THREAD_PRIORITY` attribute indicates the priority for threads assigned to the group:

* If `THREAD_PRIORITY` is not given, the default priority is 0.

* If `THREAD_PRIORITY` is given, the attribute value must be in the range from -20 (highest priority) to 19 (lowest priority). The priority for system resource groups must be in the range from -20 to 0. The priority for user resource groups must be in the range from 0 to 19. Use of different ranges for system and user groups ensures that user threads never have a higher priority than system threads.

`ENABLE` and `DISABLE` specify that the resource group is initially enabled or disabled. If neither is specified, the group is enabled by default. A disabled group cannot have threads assigned to it.

Examples:

* Create an enabled user group that has a single CPU and the lowest priority:

  ```
  CREATE RESOURCE GROUP rg1
    TYPE = USER
    VCPU = 0
    THREAD_PRIORITY = 19;
  ```

* Create a disabled system group that has no CPU affinity (can use all CPUs) and the highest priority:

  ```
  CREATE RESOURCE GROUP rg2
    TYPE = SYSTEM
    THREAD_PRIORITY = -20
    DISABLE;
  ```

Resource group management is local to the server on which it occurs. `CREATE RESOURCE GROUP` statements are not written to the binary log and are not replicated.


#### 15.7.2.3 DROP RESOURCE GROUP Statement

```
DROP RESOURCE GROUP group_name [FORCE]
```

`DROP RESOURCE GROUP` is used for resource group management (see Section 7.1.16, “Resource Groups”). This statement drops a resource group. It requires the `RESOURCE_GROUP_ADMIN` privilege.

*`group_name`* identifies which resource group to drop. If the group does not exist, an error occurs.

The `FORCE` modifier determines statement behavior if the resource group has any threads assigned to it:

* If `FORCE` is not given and any threads are assigned to the group, an error occurs.

* If `FORCE` is given, existing threads in the group are moved to their respective default group (system threads to `SYS_default`, user threads to `USR_default`).

Examples:

* Drop a group, failing if the group contains any threads:

  ```
  DROP RESOURCE GROUP rg1;
  ```

* Drop a group and move existing threads to the default groups:

  ```
  DROP RESOURCE GROUP rg2 FORCE;
  ```

Resource group management is local to the server on which it occurs. `DROP RESOURCE GROUP` statements are not written to the binary log and are not replicated.


#### 15.7.2.4 SET RESOURCE GROUP Statement

```
SET RESOURCE GROUP group_name
    [FOR thread_id [, thread_id] ...]
```

`SET RESOURCE GROUP` is used for resource group management (see Section 7.1.16, “Resource Groups”). This statement assigns threads to a resource group. It requires the `RESOURCE_GROUP_ADMIN` or `RESOURCE_GROUP_USER` privilege.

*`group_name`* identifies which resource group to be assigned. Any *`thread_id`* values indicate threads to assign to the group. Thread IDs can be determined from the Performance Schema `threads` table. If the resource group or any named thread ID does not exist, an error occurs.

With no `FOR` clause, the statement assigns the current thread for the session to the resource group.

With a `FOR` clause that names thread IDs, the statement assigns those threads to the resource group.

For attempts to assign a system thread to a user resource group or a user thread to a system resource group, a warning occurs.

Examples:

* Assign the current session thread to a group:

  ```
  SET RESOURCE GROUP rg1;
  ```

* Assign the named threads to a group:

  ```
  SET RESOURCE GROUP rg2 FOR 14, 78, 4;
  ```

Resource group management is local to the server on which it occurs. `SET RESOURCE GROUP` statements are not written to the binary log and are not replicated.

An alternative to [`SET RESOURCE GROUP`](set-resource-group.html "15.7.2.4 SET RESOURCE GROUP Statement") is the `RESOURCE_GROUP` optimizer hint, which assigns individual statements to a resource group. See Section 10.9.3, “Optimizer Hints”.


### 15.7.3 Table Maintenance Statements


#### 15.7.3.1 ANALYZE TABLE Statement

```
ANALYZE [NO_WRITE_TO_BINLOG | LOCAL]
    TABLE tbl_name [, tbl_name] ...

ANALYZE [NO_WRITE_TO_BINLOG | LOCAL]
    TABLE tbl_name
    UPDATE HISTOGRAM ON col_name [, col_name] ...
        [WITH N BUCKETS]
    [{MANUAL | AUTO} UPDATE]

ANALYZE [NO_WRITE_TO_BINLOG | LOCAL]
    TABLE tbl_name
    UPDATE HISTOGRAM ON col_name [USING DATA 'json_data']

ANALYZE [NO_WRITE_TO_BINLOG | LOCAL]
    TABLE tbl_name
    DROP HISTOGRAM ON col_name [, col_name] ...
```

`ANALYZE TABLE` generates table statistics:

* `ANALYZE TABLE` without any `HISTOGRAM` clause performs a key distribution analysis and stores the distribution for the named table or tables. For `MyISAM` tables, `ANALYZE TABLE` for key distribution analysis is equivalent to using **myisamchk --analyze**.

* `ANALYZE TABLE` with the `UPDATE HISTOGRAM` clause generates histogram statistics for the named table columns and stores them in the data dictionary. Only one table name is permitted with this syntax. MySQL also supports setting the histogram of a single column to a user-defined JSON value.

* `ANALYZE TABLE` with the `DROP HISTOGRAM` clause removes histogram statistics for the named table columns from the data dictionary. Only one table name is permitted for this syntax.

This statement requires `SELECT` and `INSERT` privileges for the table.

`ANALYZE TABLE` works with `InnoDB`, `NDB`, and `MyISAM` tables. It does not work with views.

If the `innodb_read_only` system variable is enabled, [`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") may fail because it cannot update statistics tables in the data dictionary, which use `InnoDB`. For [`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") operations that update the key distribution, failure may occur even if the operation updates the table itself (for example, if it is a `MyISAM` table). To obtain the updated distribution statistics, set `information_schema_stats_expiry=0`.

`ANALYZE TABLE` is supported for partitioned tables, and you can use `ALTER TABLE ... ANALYZE PARTITION` to analyze one or more partitions; for more information, see Section 15.1.11, “ALTER TABLE Statement”, and Section 26.3.4, “Maintenance of Partitions”.

During the analysis, the table is locked with a read lock for `InnoDB` and `MyISAM`.

By default, the server writes [`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") statements to the binary log so that they replicate to replicas. To suppress logging, specify the optional `NO_WRITE_TO_BINLOG` keyword or its alias `LOCAL`.

* ANALYZE TABLE Output
* Key Distribution Analysis
* Histogram Statistics Analysis
* Other Considerations

##### ANALYZE TABLE Output

`ANALYZE TABLE` returns a result set with the columns shown in the following table.

<table summary="Columns of the ANALYZE TABLE result set."><col style="width: 15%"/><col style="width: 60%"/><thead><tr> <th>Column</th> <th>Value</th> </tr></thead><tbody><tr> <td><code class="literal">Table</code></td> <td>The table name</td> </tr><tr> <td><code class="literal">Op</code></td> <td><code class="literal">analyze</code> or <code class="literal">histogram</code></td> </tr><tr> <td><code class="literal">Msg_type</code></td> <td><code class="literal">status</code>, <code class="literal">error</code>, <code class="literal">info</code>, <code class="literal">note</code>, or <code class="literal">warning</code></td> </tr><tr> <td><code class="literal">Msg_text</code></td> <td>An informational message</td> </tr></tbody></table>

##### Key Distribution Analysis

`ANALYZE TABLE` without either `HISTOGRAM` clause performs a key distribution analysis and stores the distribution for the table or tables. Any existing histogram statistics remain unaffected.

If the table has not changed since the last key distribution analysis, the table is not analyzed again.

MySQL uses the stored key distribution to decide the order in which tables should be joined for joins on something other than a constant. In addition, key distributions can be used when deciding which indexes to use for a specific table within a query.

To check the stored key distribution cardinality, use the `SHOW INDEX` statement or the `INFORMATION_SCHEMA` `STATISTICS` table. See Section 15.7.7.24, “SHOW INDEX Statement”, and Section 28.3.40, “The INFORMATION\_SCHEMA STATISTICS Table”.

For `InnoDB` tables, `ANALYZE TABLE` determines index cardinality by performing random dives on each of the index trees and updating index cardinality estimates accordingly. Because these are only estimates, repeated runs of `ANALYZE TABLE` could produce different numbers. This makes [`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") fast on `InnoDB` tables but not 100% accurate because it does not take all rows into account.

You can make the statistics collected by `ANALYZE TABLE` more precise and more stable by enabling `innodb_stats_persistent`, as explained in Section 17.8.10.1, “Configuring Persistent Optimizer Statistics Parameters”. When `innodb_stats_persistent` is enabled, it is important to run [`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") after major changes to index column data, as statistics are not recalculated periodically (such as after a server restart).

If `innodb_stats_persistent` is enabled, you can change the number of random dives by modifying the `innodb_stats_persistent_sample_pages` system variable. If `innodb_stats_persistent` is disabled, modify `innodb_stats_transient_sample_pages` instead.

For more information about key distribution analysis in `InnoDB`, see Section 17.8.10.1, “Configuring Persistent Optimizer Statistics Parameters”, and Section 17.8.10.3, “Estimating ANALYZE TABLE Complexity for InnoDB Tables”.

MySQL uses index cardinality estimates in join optimization. If a join is not optimized in the right way, try running `ANALYZE TABLE`. In the few cases that `ANALYZE TABLE` does not produce values good enough for your particular tables, you can use `FORCE INDEX` with your queries to force the use of a particular index, or set the `max_seeks_for_key` system variable to ensure that MySQL prefers index lookups over table scans. See Section B.3.5, “Optimizer-Related Issues”.

##### Histogram Statistics Analysis

`ANALYZE TABLE` with the `HISTOGRAM` clause enables management of histogram statistics for table column values. For information about histogram statistics, see Section 10.9.6, “Optimizer Statistics”.

These histogram operations are available:

* `ANALYZE TABLE` with an `UPDATE HISTOGRAM` clause generates histogram statistics for the named table columns and stores them in the data dictionary. Only one table name is permitted for this syntax.

  The optional `WITH N BUCKETS` clause specifies the number of buckets for the histogram. The value of *`N`* must be an integer in the range from 1 to 1024. If this clause is omitted, the number of buckets is 100.

  The optional `AUTO UPDATE` clause enables automatic updates of histograms on the table. When enabled, an `ANALYZE TABLE` statement on this table automatically updates the histogram, using the same number of buckets as last specified by `WITH ... BUCKETS` if this was previously set for this table. In addition, when recalculating persistent statistics for the table (see Section 17.8.10.1, “Configuring Persistent Optimizer Statistics Parameters”), the `InnoDB` background statistics thread also updates the histogram. `MANUAL UPDATE` disables automatic updates, and is the default setting if not specified.

* `ANALYZE TABLE` with a `DROP HISTOGRAM` clause removes histogram statistics for the named table columns from the data dictionary. Only one table name is permitted for this syntax.

Stored histogram management statements affect only the named columns. Consider these statements:

```
ANALYZE TABLE t UPDATE HISTOGRAM ON c1, c2, c3 WITH 10 BUCKETS;
ANALYZE TABLE t UPDATE HISTOGRAM ON c1, c3 WITH 10 BUCKETS;
ANALYZE TABLE t DROP HISTOGRAM ON c2;
```

The first statement updates the histograms for columns `c1`, `c2`, and `c3`, replacing any existing histograms for those columns. The second statement updates the histograms for `c1` and `c3`, leaving the `c2` histogram unaffected. The third statement removes the histogram for `c2`, leaving those for `c1` and `c3` unaffected.

When sampling user data as part of building a histogram, not all values are read; this may lead to missing some values considered important. In such cases, it might be useful to modify the histogram, or to set your own histogram explicitly based on your own criteria, such as the complete data set. `ANALYZE TABLE tbl_name UPDATE HISTOGRAM ON col_name USING DATA 'json_data'` updates a column of the histogram table with data supplied in the same JSON format used to display `HISTOGRAM` column values from the Information Schema `COLUMN_STATISTICS` table. Only one column can be modified when updating the histogram with JSON data.

We can illustrate the use of `USING DATA` by first generating a histogram on column `c1` of table `t`, like this:

```
mysql> ANALYZE TABLE t UPDATE HISTOGRAM ON c1;
+-------+-----------+----------+-----------------------------------------------+
| Table | Op        | Msg_type | Msg_text                                      |
+-------+-----------+----------+-----------------------------------------------+
| h.t   | histogram | status   | Histogram statistics created for column 'c1'. |
+-------+-----------+----------+-----------------------------------------------+
1 row in set (0.00 sec)
```

We can see the histogram generated in the `COLUMN_STATISTICS` table:

```
mysql> TABLE information_schema.column_statistics\G
*************************** 1. row ***************************
SCHEMA_NAME: h
 TABLE_NAME: t
COLUMN_NAME: c1
  HISTOGRAM: {"buckets": [], "data-type": "int", "auto-update": false,
"null-values": 0.0, "collation-id": 8, "last-updated": "2024-03-26
16:54:43.674995", "sampling-rate": 1.0, "histogram-type": "singleton",
"number-of-buckets-specified": 100}
1 row in set (0.00 sec)
```

Now we drop the histogram, and when we check `COLUMN_STATISTICS`, it is empty:

```
mysql> ANALYZE TABLE t DROP HISTOGRAM ON c1;
+-------+-----------+----------+-----------------------------------------------+
| Table | Op        | Msg_type | Msg_text                                      |
+-------+-----------+----------+-----------------------------------------------+
| h.t   | histogram | status   | Histogram statistics removed for column 'c1'. |
+-------+-----------+----------+-----------------------------------------------+
1 row in set (0.01 sec)

mysql> TABLE information_schema.column_statistics\G
Empty set (0.00 sec)
```

We can restore the dropped histogram by inserting its JSON representation obtained previously from the `HISTOGRAM` column of the `COLUMN_STATISTICS` table, and when we query that table again, we can see that the histogram has been restored to its previous state:

```
mysql> ANALYZE TABLE t UPDATE HISTOGRAM ON c1
    ->     USING DATA '{"buckets": [], "data-type": "int", "auto-update": false,
    ->               "null-values": 0.0, "collation-id": 8, "last-updated": "2024-03-26
    ->               16:54:43.674995", "sampling-rate": 1.0, "histogram-type": "singleton",
    ->               "number-of-buckets-specified": 100}';
+-------+-----------+----------+-----------------------------------------------+
| Table | Op        | Msg_type | Msg_text                                      |
+-------+-----------+----------+-----------------------------------------------+
| h.t   | histogram | status   | Histogram statistics created for column 'c1'. |
+-------+-----------+----------+-----------------------------------------------+

mysql> TABLE information_schema.column_statistics\G
*************************** 1. row ***************************
SCHEMA_NAME: h
 TABLE_NAME: t
COLUMN_NAME: c1
  HISTOGRAM: {"buckets": [], "data-type": "int", "auto-update": false,
"null-values": 0.0, "collation-id": 8, "last-updated": "2024-03-26
16:54:43.674995", "sampling-rate": 1.0, "histogram-type": "singleton",
"number-of-buckets-specified": 100}
```

Histogram generation is not supported for encrypted tables (to avoid exposing data in the statistics) or `TEMPORARY` tables.

Histogram generation applies to columns of all data types except geometry types (spatial data) and `JSON`.

Histograms can be generated for stored and virtual generated columns.

Histograms cannot be generated for columns that are covered by single-column unique indexes.

Histogram management statements attempt to perform as much of the requested operation as possible, and report diagnostic messages for the remainder. For example, if an `UPDATE HISTOGRAM` statement names multiple columns, but some of them do not exist or have an unsupported data type, histograms are generated for the other columns, and messages are produced for the invalid columns.

Histograms are affected by these DDL statements:

* `DROP TABLE` removes histograms for columns in the dropped table.

* `DROP DATABASE` removes histograms for any table in the dropped database because the statement drops all tables in the database.

* `RENAME TABLE` does not remove histograms. Instead, it renames histograms for the renamed table to be associated with the new table name.

* `ALTER TABLE` statements that remove or modify a column remove histograms for that column.

* [`ALTER TABLE ... CONVERT TO CHARACTER SET`](alter-table.html "15.1.11 ALTER TABLE Statement") removes histograms for character columns because they are affected by the change of character set. Histograms for noncharacter columns remain unaffected.

The `histogram_generation_max_mem_size` system variable controls the maximum amount of memory available for histogram generation. The global and session values may be set at runtime.

Changing the global `histogram_generation_max_mem_size` value requires privileges sufficient to set global system variables. Changing the session `histogram_generation_max_mem_size` value requires privileges sufficient to set restricted session system variables. See Section 7.1.9.1, “System Variable Privileges”.

If the estimated amount of data to be read into memory for histogram generation exceeds the limit defined by `histogram_generation_max_mem_size`, MySQL samples the data rather than reading all of it into memory. Sampling is evenly distributed over the entire table. MySQL uses `SYSTEM` sampling, which is a page-level sampling method.

The `sampling-rate` value in the `HISTOGRAM` column of the Information Schema `COLUMN_STATISTICS` table can be queried to determine the fraction of data that was sampled to create the histogram. The `sampling-rate` is a number between 0.0 and 1.0. A value of 1 means that all of the data was read (no sampling).

The following example demonstrates sampling. To ensure that the amount of data exceeds the `histogram_generation_max_mem_size` limit for the purpose of the example, the limit is set to a low value (2000000 bytes) prior to generating histogram statistics for the `birth_date` column of the `employees` table.

```
mysql> SET histogram_generation_max_mem_size = 2000000;

mysql> USE employees;

mysql> ANALYZE TABLE employees UPDATE HISTOGRAM ON birth_date WITH 16 BUCKETS\G
*************************** 1. row ***************************
   Table: employees.employees
      Op: histogram
Msg_type: status
Msg_text: Histogram statistics created for column 'birth_date'.

mysql> SELECT HISTOGRAM->>'$."sampling-rate"'
       FROM INFORMATION_SCHEMA.COLUMN_STATISTICS
       WHERE TABLE_NAME = "employees"
       AND COLUMN_NAME = "birth_date";
+---------------------------------+
| HISTOGRAM->>'$."sampling-rate"' |
+---------------------------------+
| 0.0491431208869665              |
+---------------------------------+
```

A `sampling-rate` value of 0.0491431208869665 means that approximately 4.9% of the data from the `birth_date` column was read into memory for generating histogram statistics.

The `InnoDB` storage engine provides its own sampling implementation for data stored in `InnoDB` tables. The default sampling implementation used by MySQL when storage engines do not provide their own requires a full table scan, which is costly for large tables. The `InnoDB` sampling implementation improves sampling performance by avoiding full table scans.

The `sampled_pages_read` and `sampled_pages_skipped` `INNODB_METRICS` counters can be used to monitor sampling of `InnoDB` data pages. (For general `INNODB_METRICS` counter usage information, see Section 28.4.21, “The INFORMATION\_SCHEMA INNODB\_METRICS Table”.)

The following example demonstrates sampling counter usage, which requires enabling the counters prior to generating histogram statistics.

```
mysql> SET GLOBAL innodb_monitor_enable = 'sampled%';

mysql> USE employees;

mysql> ANALYZE TABLE employees UPDATE HISTOGRAM ON birth_date WITH 16 BUCKETS\G
*************************** 1. row ***************************
   Table: employees.employees
      Op: histogram
Msg_type: status
Msg_text: Histogram statistics created for column 'birth_date'.

mysql> USE INFORMATION_SCHEMA;

mysql> SELECT NAME, COUNT FROM INNODB_METRICS WHERE NAME LIKE 'sampled%'\G
*************************** 1. row ***************************
 NAME: sampled_pages_read
COUNT: 43
*************************** 2. row ***************************
 NAME: sampled_pages_skipped
COUNT: 843
```

This formula approximates a sampling rate based on the sampling counter data:

```
sampling rate = sampled_page_read/(sampled_pages_read + sampled_pages_skipped)
```

A sampling rate based on sampling counter data is roughly the same as the `sampling-rate` value in the `HISTOGRAM` column of the Information Schema `COLUMN_STATISTICS` table.

For information about memory allocations performed for histogram generation, monitor the Performance Schema `memory/sql/histograms` instrument. See Section 29.12.20.10, “Memory Summary Tables”.

##### Other Considerations

`ANALYZE TABLE` clears table statistics from the Information Schema `INNODB_TABLESTATS` table and sets the `STATS_INITIALIZED` column to `Uninitialized`. Statistics are collected again the next time the table is accessed.


#### 15.7.3.2 CHECK TABLE Statement

```
CHECK TABLE tbl_name [, tbl_name] ... [option] ...

option: {
    FOR UPGRADE
  | QUICK
  | FAST
  | MEDIUM
  | EXTENDED
  | CHANGED
}
```

`CHECK TABLE` checks a table or tables for errors. `CHECK TABLE` can also check views for problems, such as tables that are referenced in the view definition that no longer exist.

To check a table, you must have some privilege for it.

`CHECK TABLE` works for `InnoDB`, `MyISAM`, `ARCHIVE`, and `CSV` tables.

Before running `CHECK TABLE` on `InnoDB` tables, see CHECK TABLE Usage Notes for InnoDB Tables.

`CHECK TABLE` is supported for partitioned tables, and you can use `ALTER TABLE ... CHECK PARTITION` to check one or more partitions; for more information, see Section 15.1.11, “ALTER TABLE Statement”, and Section 26.3.4, “Maintenance of Partitions”.

`CHECK TABLE` ignores virtual generated columns that are not indexed.

* CHECK TABLE Output
* Checking Version Compatibility
* Checking Data Consistency
* CHECK TABLE Usage Notes for InnoDB Tables
* CHECK TABLE Usage Notes for MyISAM Tables

##### CHECK TABLE Output

`CHECK TABLE` returns a result set with the columns shown in the following table.

<table summary="Columns of the CHECK TABLE result set."><col style="width: 15%"/><col style="width: 60%"/><thead><tr> <th>Column</th> <th>Value</th> </tr></thead><tbody><tr> <td><code class="literal">Table</code></td> <td>The table name</td> </tr><tr> <td><code class="literal">Op</code></td> <td>Always <code class="literal">check</code></td> </tr><tr> <td><code class="literal">Msg_type</code></td> <td><code class="literal">status</code>, <code class="literal">error</code>, <code class="literal">info</code>, <code class="literal">note</code>, or <code class="literal">warning</code></td> </tr><tr> <td><code class="literal">Msg_text</code></td> <td>An informational message</td> </tr></tbody></table>

The statement might produce many rows of information for each checked table. The last row has a `Msg_type` value of `status` and the `Msg_text` normally should be `OK`. `Table is already up to date` means that the storage engine for the table indicated that there was no need to check the table.

##### Checking Version Compatibility

The `FOR UPGRADE` option checks whether the named tables are compatible with the current version of MySQL. With `FOR UPGRADE`, the server checks each table to determine whether there have been any incompatible changes in any of the table's data types or indexes since the table was created. If not, the check succeeds. Otherwise, if there is a possible incompatibility, the server runs a full check on the table (which might take some time).

Incompatibilities might occur because the storage format for a data type has changed or because its sort order has changed. Our aim is to avoid these changes, but occasionally they are necessary to correct problems that would be worse than an incompatibility between releases.

`FOR UPGRADE` discovers these incompatibilities:

* The indexing order for end-space in `TEXT` columns for `InnoDB` and `MyISAM` tables changed between MySQL 4.1 and 5.0.

* The storage method of the new `DECIMAL` - DECIMAL, NUMERIC") data type changed between MySQL 5.0.3 and 5.0.5.

* Changes are sometimes made to character sets or collations that require table indexes to be rebuilt. For details about such changes, see Section 3.5, “Changes in MySQL 9.5”. For information about rebuilding tables, see Section 3.14, “Rebuilding or Repairing Tables or Indexes”.

* MySQL 9.5 does not support the 2-digit `YEAR(2)` data type permitted in older versions of MySQL. For tables containing `YEAR(2)` columns, `CHECK TABLE` recommends `REPAIR TABLE`, which converts 2-digit `YEAR(2)` columns to 4-digit `YEAR` columns.

* Trigger creation time is maintained.
* A table is reported as needing a rebuild if it contains old temporal columns in pre-5.6.4 format (`TIME`, `DATETIME`, and `TIMESTAMP` columns without support for fractional seconds precision). This helps the MySQL upgrade procedure detect and upgrade tables containing old temporal columns.

* Warnings are issued for tables that use nonnative partitioning because nonnative partitioning is removed in MySQL 9.5. See Chapter 26, *Partitioning*.

##### Checking Data Consistency

The following table shows the other check options that can be given. These options are passed to the storage engine, which may use or ignore them.

<table summary="Other CHECK TABLE options."><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Type</th> <th>Meaning</th> </tr></thead><tbody><tr> <td><code class="literal">QUICK</code></td> <td>Do not scan the rows to check for incorrect links. Applies to <code class="literal">InnoDB</code> and <code class="literal">MyISAM</code> tables and views.</td> </tr><tr> <td><code class="literal">FAST</code></td> <td>Check only tables that have not been closed properly. Ignored for <code class="literal">InnoDB</code>; applies only to <code class="literal">MyISAM</code> tables and views.</td> </tr><tr> <td><code class="literal">CHANGED</code></td> <td>Check only tables that have been changed since the last check or that have not been closed properly. Ignored for <code class="literal">InnoDB</code>; applies only to <code class="literal">MyISAM</code> tables and views.</td> </tr><tr> <td><code class="literal">MEDIUM</code></td> <td>Scan rows to verify that deleted links are valid. This also calculates a key checksum for the rows and verifies this with a calculated checksum for the keys. Ignored for <code class="literal">InnoDB</code>; applies only to <code class="literal">MyISAM</code> tables and views.</td> </tr><tr> <td><code class="literal">EXTENDED</code></td> <td>Do a full key lookup for all keys for each row. This ensures that the table is 100% consistent, but takes a long time. Ignored for <code class="literal">InnoDB</code>; applies only to <code class="literal">MyISAM</code> tables and views.</td> </tr></tbody></table>

You can combine check options, as in the following example that does a quick check on the table to determine whether it was closed properly:

```
CHECK TABLE test_table FAST QUICK;
```

Note

If `CHECK TABLE` finds no problems with a table that is marked as “corrupted” or “not closed properly”, `CHECK TABLE` may remove the mark.

If a table is corrupted, the problem is most likely in the indexes and not in the data part. All of the preceding check types check the indexes thoroughly and should thus find most errors.

To check a table that you assume is okay, use no check options or the `QUICK` option. The latter should be used when you are in a hurry and can take the very small risk that `QUICK` does not find an error in the data file. (In most cases, under normal usage, MySQL should find any error in the data file. If this happens, the table is marked as “corrupted” and cannot be used until it is repaired.)

`FAST` and `CHANGED` are mostly intended to be used from a script (for example, to be executed from **cron**) to check tables periodically. In most cases, `FAST` is to be preferred over `CHANGED`. (The only case when it is not preferred is when you suspect that you have found a bug in the `MyISAM` code.)

`EXTENDED` is to be used only after you have run a normal check but still get errors from a table when MySQL tries to update a row or find a row by key. This is very unlikely if a normal check has succeeded.

Use of [`CHECK TABLE ... EXTENDED`](check-table.html "15.7.3.2 CHECK TABLE Statement") might influence execution plans generated by the query optimizer.

Some problems reported by [`CHECK TABLE`](check-table.html "15.7.3.2 CHECK TABLE Statement") cannot be corrected automatically:

* `Found row where the auto_increment column has the value 0`.

  This means that you have a row in the table where the `AUTO_INCREMENT` index column contains the value 0. (It is possible to create a row where the `AUTO_INCREMENT` column is 0 by explicitly setting the column to 0 with an `UPDATE` statement.)

  This is not an error in itself, but could cause trouble if you decide to dump the table and restore it or do an `ALTER TABLE` on the table. In this case, the `AUTO_INCREMENT` column changes value according to the rules of `AUTO_INCREMENT` columns, which could cause problems such as a duplicate-key error.

  To get rid of the warning, execute an `UPDATE` statement to set the column to some value other than 0.

##### CHECK TABLE Usage Notes for InnoDB Tables

The following notes apply to `InnoDB` tables:

* If `CHECK TABLE` encounters a corrupt page, the server exits to prevent error propagation (Bug #10132). If the corruption occurs in a secondary index but table data is readable, running `CHECK TABLE` can still cause a server exit.

* If `CHECK TABLE` encounters a corrupted `DB_TRX_ID` or `DB_ROLL_PTR` field in a clustered index, `CHECK TABLE` can cause `InnoDB` to access an invalid undo log record, resulting in an MVCC-related server exit.

* If `CHECK TABLE` encounters errors in `InnoDB` tables or indexes, it reports an error, and usually marks the index and sometimes marks the table as corrupted, preventing further use of the index or table. Such errors include an incorrect number of entries in a secondary index or incorrect links.

* If `CHECK TABLE` finds an incorrect number of entries in a secondary index, it reports an error but does not cause a server exit or prevent access to the file.

* `CHECK TABLE` surveys the index page structure, then surveys each key entry. It does not validate the key pointer to a clustered record or follow the path for `BLOB` pointers.

* When an `InnoDB` table is stored in its own [`.ibd` file](/doc/refman/8.4/en/glossary.html#glos_ibd_file), the first 3 pages of the `.ibd` file contain header information rather than table or index data. The `CHECK TABLE` statement does not detect inconsistencies that affect only the header data. To verify the entire contents of an `InnoDB` `.ibd` file, use the **innochecksum** command.

* When running `CHECK TABLE` on large `InnoDB` tables, other threads may be blocked during [`CHECK TABLE`](check-table.html "15.7.3.2 CHECK TABLE Statement") execution. To avoid timeouts, the semaphore wait threshold (600 seconds) is extended by 2 hours (7200 seconds) for [`CHECK TABLE`](check-table.html "15.7.3.2 CHECK TABLE Statement") operations. If `InnoDB` detects semaphore waits of 240 seconds or more, it starts printing `InnoDB` monitor output to the error log. If a lock request extends beyond the semaphore wait threshold, `InnoDB` aborts the process. To avoid the possibility of a semaphore wait timeout entirely, run [`CHECK TABLE QUICK`](check-table.html "15.7.3.2 CHECK TABLE Statement") instead of [`CHECK TABLE`](check-table.html "15.7.3.2 CHECK TABLE Statement").

* `CHECK TABLE` functionality for `InnoDB` `SPATIAL` indexes includes an R-tree validity check and a check to ensure that the R-tree row count matches the clustered index.

* `CHECK TABLE` supports secondary indexes on virtual generated columns, which are supported by `InnoDB`.

* `InnoDB` supports parallel clustered index reads, which can improve `CHECK TABLE` performance. `InnoDB` reads the clustered index twice during a `CHECK TABLE` operation. The second read can be performed in parallel. The `innodb_parallel_read_threads` session variable must be set to a value greater than 1 for parallel clustered index reads to occur. The actual number of threads used to perform a parallel clustered index read is determined by the `innodb_parallel_read_threads` setting or the number of index subtrees to scan, whichever is smaller.

##### CHECK TABLE Usage Notes for MyISAM Tables

The following notes apply to `MyISAM` tables:

* `CHECK TABLE` updates key statistics for `MyISAM` tables.

* If `CHECK TABLE` output does not return `OK` or `Table is already up to date`, you should normally run a repair of the table. See Section 9.6, “MyISAM Table Maintenance and Crash Recovery”.

* If none of the `CHECK TABLE` options `QUICK`, `MEDIUM`, or `EXTENDED` are specified, the default check type for dynamic-format `MyISAM` tables is `MEDIUM`. This has the same result as running [**myisamchk --medium-check *`tbl_name`***](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") on the table. The default check type also is `MEDIUM` for static-format `MyISAM` tables, unless `CHANGED` or `FAST` is specified. In that case, the default is `QUICK`. The row scan is skipped for `CHANGED` and `FAST` because the rows are very seldom corrupted.


#### 15.7.3.3 CHECKSUM TABLE Statement

```
CHECKSUM TABLE tbl_name [, tbl_name] ... [QUICK | EXTENDED]
```

`CHECKSUM TABLE` reports a checksum for the contents of a table. You can use this statement to verify that the contents are the same before and after a backup, rollback, or other operation that is intended to put the data back to a known state.

This statement requires the `SELECT` privilege for the table.

This statement is not supported for views. If you run `CHECKSUM TABLE` against a view, the `Checksum` value is always `NULL`, and a warning is returned.

For a nonexistent table, [`CHECKSUM TABLE`](checksum-table.html "15.7.3.3 CHECKSUM TABLE Statement") returns `NULL` and generates a warning.

During the checksum operation, the table is locked with a read lock for `InnoDB` and `MyISAM`.

##### Performance Considerations

By default, the entire table is read row by row and the checksum is calculated. For large tables, this could take a long time, thus you would only perform this operation occasionally. This row-by-row calculation is what you get with the `EXTENDED` clause, with `InnoDB` and all other storage engines other than `MyISAM`, and with `MyISAM` tables not created with the `CHECKSUM=1` clause.

For `MyISAM` tables created with the `CHECKSUM=1` clause, `CHECKSUM TABLE` or [`CHECKSUM TABLE ... QUICK`](checksum-table.html "15.7.3.3 CHECKSUM TABLE Statement") returns the “live” table checksum that can be returned very fast. If the table does not meet all these conditions, the `QUICK` method returns `NULL`. The `QUICK` method is not supported with `InnoDB` tables. See Section 15.1.24, “CREATE TABLE Statement” for the syntax of the `CHECKSUM` clause.

The checksum value depends on the table row format. If the row format changes, the checksum also changes. For example, the storage format for temporal types such as `TIME`, `DATETIME`, and `TIMESTAMP` changed in MySQL 5.6 prior to MySQL 5.6.5, so if a 5.5 table is upgraded to MySQL 5.6, the checksum value may change.

Important

If the checksums for two tables are different, then it is almost certain that the tables are different in some way. However, because the hashing function used by `CHECKSUM TABLE` is not guaranteed to be collision-free, there is a slight chance that two tables which are not identical can produce the same checksum.


#### 15.7.3.4 OPTIMIZE TABLE Statement

```
OPTIMIZE [NO_WRITE_TO_BINLOG | LOCAL]
    TABLE tbl_name [, tbl_name] ...
```

`OPTIMIZE TABLE` reorganizes the physical storage of table data and associated index data, to reduce storage space and improve I/O efficiency when accessing the table. The exact changes made to each table depend on the storage engine used by that table.

Use `OPTIMIZE TABLE` in these cases, depending on the type of table:

* After doing substantial insert, update, or delete operations on an `InnoDB` table that has its own .ibd file because it was created with the `innodb_file_per_table` option enabled. The table and indexes are reorganized, and disk space can be reclaimed for use by the operating system.

* After doing substantial insert, update, or delete operations on columns that are part of a `FULLTEXT` index in an `InnoDB` table. Set the configuration option `innodb_optimize_fulltext_only=1` first. To keep the index maintenance period to a reasonable time, set the `innodb_ft_num_word_optimize` option to specify how many words to update in the search index, and run a sequence of `OPTIMIZE TABLE` statements until the search index is fully updated.

* After deleting a large part of a `MyISAM` or `ARCHIVE` table, or making many changes to a `MyISAM` or `ARCHIVE`table with variable-length rows (tables that have `VARCHAR`, `VARBINARY`, `BLOB`, or `TEXT` columns). Deleted rows are maintained in a linked list and subsequent `INSERT` operations reuse old row positions. You can use [`OPTIMIZE TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement") to reclaim the unused space and to defragment the data file. After extensive changes to a table, this statement may also improve performance of statements that use the table, sometimes significantly.

This statement requires `SELECT` and `INSERT` privileges for the table.

`OPTIMIZE TABLE` works for `InnoDB`, `MyISAM`, and `ARCHIVE` tables. `OPTIMIZE TABLE` is also supported for dynamic columns of in-memory `NDB` tables. It does not work for fixed-width columns of in-memory tables, nor does it work for Disk Data tables. The performance of `OPTIMIZE` on NDB Cluster tables can be tuned using `--ndb-optimization-delay`, which controls the length of time to wait between processing batches of rows by `OPTIMIZE TABLE`.

For NDB Cluster tables, [`OPTIMIZE TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement") can be interrupted by (for example) killing the SQL thread performing the `OPTIMIZE` operation.

By default, `OPTIMIZE TABLE` does *not* work for tables created using any other storage engine and returns a result indicating this lack of support. You can make [`OPTIMIZE TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement") work for other storage engines by starting **mysqld** with the `--skip-new` option. In this case, `OPTIMIZE TABLE` is just mapped to `ALTER TABLE`.

This statement does not work with views.

`OPTIMIZE TABLE` is supported for partitioned tables. For information about using this statement with partitioned tables and table partitions, see Section 26.3.4, “Maintenance of Partitions”.

By default, the server writes [`OPTIMIZE TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement") statements to the binary log so that they replicate to replicas. To suppress logging, specify the optional `NO_WRITE_TO_BINLOG` keyword or its alias `LOCAL`. You must have the `OPTIMIZE_LOCAL_TABLE` privilege to use this option.

* OPTIMIZE TABLE Output
* InnoDB Details
* MyISAM Details
* Other Considerations

##### OPTIMIZE TABLE Output

`OPTIMIZE TABLE` returns a result set with the columns shown in the following table.

<table summary="Columns of the OPTIMIZE TABLE result set."><col style="width: 15%"/><col style="width: 60%"/><thead><tr> <th>Column</th> <th>Value</th> </tr></thead><tbody><tr> <td><code class="literal">Table</code></td> <td>The table name</td> </tr><tr> <td><code class="literal">Op</code></td> <td>Always <code class="literal">optimize</code></td> </tr><tr> <td><code class="literal">Msg_type</code></td> <td><code class="literal">status</code>, <code class="literal">error</code>, <code class="literal">info</code>, <code class="literal">note</code>, or <code class="literal">warning</code></td> </tr><tr> <td><code class="literal">Msg_text</code></td> <td>An informational message</td> </tr></tbody></table>

`OPTIMIZE TABLE` table catches and throws any errors that occur while copying table statistics from the old file to the newly created file. For example. if the user ID of the owner of the `.MYD` or `.MYI` file is different from the user ID of the **mysqld** process, `OPTIMIZE TABLE` generates a "cannot change ownership of the file" error unless **mysqld** is started by the `root` user.

##### InnoDB Details

For `InnoDB` tables, `OPTIMIZE TABLE` is mapped to [`ALTER TABLE ... FORCE`](alter-table.html "15.1.11 ALTER TABLE Statement"), which rebuilds the table to update index statistics and free unused space in the clustered index. This is displayed in the output of [`OPTIMIZE TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement") when you run it on an `InnoDB` table, as shown here:

```
mysql> OPTIMIZE TABLE foo;
+----------+----------+----------+-------------------------------------------------------------------+
| Table    | Op       | Msg_type | Msg_text                                                          |
+----------+----------+----------+-------------------------------------------------------------------+
| test.foo | optimize | note     | Table does not support optimize, doing recreate + analyze instead |
| test.foo | optimize | status   | OK                                                                |
+----------+----------+----------+-------------------------------------------------------------------+
```

`OPTIMIZE TABLE` uses online DDL for regular and partitioned `InnoDB` tables, which reduces downtime for concurrent DML operations. The table rebuild triggered by [`OPTIMIZE TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement") is completed in place. An exclusive table lock is only taken briefly during the prepare phase and the commit phase of the operation. During the prepare phase, metadata is updated and an intermediate table is created. During the commit phase, table metadata changes are committed.

`OPTIMIZE TABLE` rebuilds the table using the table copy method under the following conditions:

* When the `old_alter_table` system variable is enabled.

* When the server is started with the `--skip-new` option.

`OPTIMIZE TABLE` using online DDL is not supported for `InnoDB` tables that contain `FULLTEXT` indexes. The table copy method is used instead.

`InnoDB` stores data using a page-allocation method and does not suffer from fragmentation in the same way that legacy storage engines (such as `MyISAM`) do. When considering whether or not to run optimize, consider the workload of transactions that your server is expected to process:

* Some level of fragmentation is expected. `InnoDB` only fills pages 93% full, to leave room for updates without having to split pages.

* Delete operations might leave gaps that leave pages less filled than desired, which could make it worthwhile to optimize the table.

* Updates to rows usually rewrite the data within the same page, depending on the data type and row format, when sufficient space is available. See Section 17.9.1.5, “How Compression Works for InnoDB Tables” and Section 17.10, “InnoDB Row Formats”.

* High-concurrency workloads might leave gaps in indexes over time, as `InnoDB` retains multiple versions of the same data due through its MVCC mechanism. See Section 17.3, “InnoDB Multi-Versioning”.

##### MyISAM Details

For `MyISAM` tables, `OPTIMIZE TABLE` works as follows:

1. If the table has deleted or split rows, repair the table.
2. If the index pages are not sorted, sort them.
3. If the table's statistics are not up to date (and the repair could not be accomplished by sorting the index), update them.

##### Other Considerations

`OPTIMIZE TABLE` is performed online for regular and partitioned `InnoDB` tables. Otherwise, MySQL [locks the table](glossary.html#glos_table_lock "table lock") during the time [`OPTIMIZE TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement") is running.

`OPTIMIZE TABLE` does not sort R-tree indexes, such as spatial indexes on `POINT` columns. (Bug #23578)


#### 15.7.3.5 REPAIR TABLE Statement

```
REPAIR [NO_WRITE_TO_BINLOG | LOCAL]
    TABLE tbl_name [, tbl_name] ...
    [QUICK] [EXTENDED] [USE_FRM]
```

`REPAIR TABLE` repairs a possibly corrupted table, for certain storage engines only.

This statement requires `SELECT` and `INSERT` privileges for the table.

Although normally you should never have to run `REPAIR TABLE`, if disaster strikes, this statement is very likely to get back all your data from a `MyISAM` table. If your tables become corrupted often, try to find the reason for it, to eliminate the need to use `REPAIR TABLE`. See Section B.3.3.3, “What to Do If MySQL Keeps Crashing”, and Section 18.2.4, “MyISAM Table Problems”.

`REPAIR TABLE` checks the table to see whether an upgrade is required. If so, it performs the upgrade, following the same rules as [`CHECK TABLE ... FOR UPGRADE`](check-table.html "15.7.3.2 CHECK TABLE Statement"). See Section 15.7.3.2, “CHECK TABLE Statement”, for more information.

Important

* Make a backup of a table before performing a table repair operation; under some circumstances the operation might cause data loss. Possible causes include but are not limited to file system errors. See Chapter 9, *Backup and Recovery*.

* If the server exits during a [`REPAIR TABLE`](repair-table.html "15.7.3.5 REPAIR TABLE Statement") operation, it is essential after restarting it that you immediately execute another `REPAIR TABLE` statement for the table before performing any other operations on it. In the worst case, you might have a new clean index file without information about the data file, and then the next operation you perform could overwrite the data file. This is an unlikely but possible scenario that underscores the value of making a backup first.

* In the event that a table on the source becomes corrupted and you run `REPAIR TABLE` on it, any resulting changes to the original table are *not* propagated to replicas.

* REPAIR TABLE Storage Engine and Partitioning Support
* REPAIR TABLE Options
* REPAIR TABLE Output
* Table Repair Considerations

##### REPAIR TABLE Storage Engine and Partitioning Support

`REPAIR TABLE` works for `MyISAM`, `ARCHIVE`, and `CSV` tables. For `MyISAM` tables, it has the same effect as [**myisamchk --recover *`tbl_name`***](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") by default. This statement does not work with views.

`REPAIR TABLE` is supported for partitioned tables. However, the `USE_FRM` option cannot be used with this statement on a partitioned table.

You can use `ALTER TABLE ... REPAIR PARTITION` to repair one or more partitions; for more information, see Section 15.1.11, “ALTER TABLE Statement”, and Section 26.3.4, “Maintenance of Partitions”.

##### REPAIR TABLE Options

* `NO_WRITE_TO_BINLOG` or `LOCAL`

  By default, the server writes [`REPAIR TABLE`](repair-table.html "15.7.3.5 REPAIR TABLE Statement") statements to the binary log so that they replicate to replicas. To suppress logging, specify the optional `NO_WRITE_TO_BINLOG` keyword or its alias `LOCAL`.

* `QUICK`

  If you use the `QUICK` option, `REPAIR TABLE` tries to repair only the index file, and not the data file. This type of repair is like that done by [**myisamchk --recover --quick**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility").

* `EXTENDED`

  If you use the `EXTENDED` option, MySQL creates the index row by row instead of creating one index at a time with sorting. This type of repair is like that done by **myisamchk --safe-recover**.

* `USE_FRM`

  The `USE_FRM` option is available for use if the `.MYI` index file is missing or if its header is corrupted. This option tells MySQL not to trust the information in the `.MYI` file header and to re-create it using information from the data dictionary. This kind of repair cannot be done with **myisamchk**.

  Caution

  Use the `USE_FRM` option *only* if you cannot use regular `REPAIR` modes. Telling the server to ignore the `.MYI` file makes important table metadata stored in the `.MYI` unavailable to the repair process, which can have deleterious consequences:

  + The current `AUTO_INCREMENT` value is lost.

  + The link to deleted records in the table is lost, which means that free space for deleted records remains unoccupied thereafter.

  + The `.MYI` header indicates whether the table is compressed. If the server ignores this information, it cannot tell that a table is compressed and repair can cause change or loss of table contents. This means that `USE_FRM` should not be used with compressed tables. That should not be necessary, anyway: Compressed tables are read only, so they should not become corrupt.

  If you use `USE_FRM` for a table that was created by a different version of the MySQL server than the one you are currently running, `REPAIR TABLE` does not attempt to repair the table. In this case, the result set returned by [`REPAIR TABLE`](repair-table.html "15.7.3.5 REPAIR TABLE Statement") contains a line with a `Msg_type` value of `error` and a `Msg_text` value of `Failed repairing incompatible .FRM file`.

  If `USE_FRM` is used, `REPAIR TABLE` does not check the table to see whether an upgrade is required.

##### REPAIR TABLE Output

`REPAIR TABLE` returns a result set with the columns shown in the following table.

<table summary="Columns of the REPAIR TABLE result set."><col style="width: 15%"/><col style="width: 60%"/><thead><tr> <th>Column</th> <th>Value</th> </tr></thead><tbody><tr> <td><code class="literal">Table</code></td> <td>The table name</td> </tr><tr> <td><code class="literal">Op</code></td> <td>Always <code class="literal">repair</code></td> </tr><tr> <td><code class="literal">Msg_type</code></td> <td><code class="literal">status</code>, <code class="literal">error</code>, <code class="literal">info</code>, <code class="literal">note</code>, or <code class="literal">warning</code></td> </tr><tr> <td><code class="literal">Msg_text</code></td> <td>An informational message</td> </tr></tbody></table>

The `REPAIR TABLE` statement might produce many rows of information for each repaired table. The last row has a `Msg_type` value of `status` and `Msg_test` normally should be `OK`. For a `MyISAM` table, if you do not get `OK`, you should try repairing it with **myisamchk --safe-recover**. (`REPAIR TABLE` does not implement all the options of **myisamchk**. With **myisamchk --safe-recover**, you can also use options that `REPAIR TABLE` does not support, such as `--max-record-length`.)

`REPAIR TABLE` table catches and throws any errors that occur while copying table statistics from the old corrupted file to the newly created file. For example. if the user ID of the owner of the `.MYD` or `.MYI` file is different from the user ID of the **mysqld** process, `REPAIR TABLE` generates a "cannot change ownership of the file" error unless **mysqld** is started by the `root` user.

##### Table Repair Considerations

You may be able to increase [`REPAIR TABLE`](repair-table.html "15.7.3.5 REPAIR TABLE Statement") performance by setting certain system variables. See Section 10.6.3, “Optimizing REPAIR TABLE Statements”.

`REPAIR TABLE` upgrades a table if it contains old temporal columns in pre-5.6.4 format; namely, the `TIME`, `DATETIME`, and `TIMESTAMP` columns that lacked support for fractional seconds precision.


### 15.7.4 Component, Plugin, and Loadable Function Statements


#### 15.7.4.1 CREATE FUNCTION Statement for Loadable Functions

```
CREATE [AGGREGATE] FUNCTION [IF NOT EXISTS] function_name
    RETURNS {STRING|INTEGER|REAL|DECIMAL}
    SONAME shared_library_name
```

This statement loads the loadable function named *`function_name`*. (`CREATE FUNCTION` is also used to created stored functions; see Section 15.1.21, “CREATE PROCEDURE and CREATE FUNCTION Statements”.)

A loadable function is a way to extend MySQL with a new function that works like a native (built-in) MySQL function such as `ABS()` or `CONCAT()`. See Adding a Loadable Function.

*`function_name`* is the name that should be used in SQL statements to invoke the function. The `RETURNS` clause indicates the type of the function's return value. `DECIMAL` is a legal value after `RETURNS`, but currently `DECIMAL` functions return string values and should be written like `STRING` functions.

`IF NOT EXISTS` prevents an error from occurring if there already exists a loadable function with the same name. It does *not* prevent an error from occurring if there already exists a built-in function having the same name. `IF NOT EXISTS` is also supported for `CREATE FUNCTION` statements. See Function Name Resolution.

The `AGGREGATE` keyword, if given, signifies that the function is an aggregate (group) function. An aggregate function works exactly like a native MySQL aggregate function such as `SUM()` or `COUNT()`.

*`shared_library_name`* is the base name of the shared library file containing the code that implements the function. The file must be located in the plugin directory. This directory is given by the value of the `plugin_dir` system variable. For more information, see Section 7.7.1, “Installing and Uninstalling Loadable Functions”.

[`CREATE FUNCTION`](create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions") requires the `INSERT` privilege for the `mysql` system schema because it adds a row to the `mysql.func` system table to register the function.

[`CREATE FUNCTION`](create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions") also adds the function to the Performance Schema `user_defined_functions` table that provides runtime information about installed loadable functions. See Section 29.12.22.12, “The user\_defined\_functions Table”.

Note

Like the `mysql.func` system table, the Performance Schema `user_defined_functions` table lists loadable functions installed using [`CREATE FUNCTION`](create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions"). Unlike the `mysql.func` table, the `user_defined_functions` table also lists loadable functions installed automatically by server components or plugins. This difference makes `user_defined_functions` preferable to `mysql.func` for checking which loadable functions are installed.

During the normal startup sequence, the server loads functions registered in the `mysql.func` table. If the server is started with the `--skip-grant-tables` option, functions registered in the table are not loaded and are unavailable.

Note

To upgrade the shared library associated with a loadable function, issue a [`DROP FUNCTION`](drop-function-loadable.html "15.7.4.2 DROP FUNCTION Statement for Loadable Functions") statement, upgrade the shared library, and then issue a [`CREATE FUNCTION`](create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions") statement. If you upgrade the shared library first and then use [`DROP FUNCTION`](drop-function-loadable.html "15.7.4.2 DROP FUNCTION Statement for Loadable Functions"), the server may unexpectedly shut down.


#### 15.7.4.2 DROP FUNCTION Statement for Loadable Functions

```
DROP FUNCTION [IF EXISTS] function_name
```

This statement drops the loadable function named *`function_name`*. (`DROP FUNCTION` is also used to drop stored functions; see Section 15.1.34, “DROP PROCEDURE and DROP FUNCTION Statements”.)

[`DROP FUNCTION`](drop-function-loadable.html "15.7.4.2 DROP FUNCTION Statement for Loadable Functions") is the complement of [`CREATE FUNCTION`](create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions"). It requires the `DELETE` privilege for the `mysql` system schema because it removes the row from the `mysql.func` system table that registers the function.

[`DROP FUNCTION`](drop-function-loadable.html "15.7.4.2 DROP FUNCTION Statement for Loadable Functions") also removes the function from the Performance Schema `user_defined_functions` table that provides runtime information about installed loadable functions. See Section 29.12.22.12, “The user\_defined\_functions Table”.

During the normal startup sequence, the server loads functions registered in the `mysql.func` table. Because [`DROP FUNCTION`](drop-function-loadable.html "15.7.4.2 DROP FUNCTION Statement for Loadable Functions") removes the `mysql.func` row for the dropped function, the server does not load the function during subsequent restarts.

[`DROP FUNCTION`](drop-function-loadable.html "15.7.4.2 DROP FUNCTION Statement for Loadable Functions") cannot be used to drop a loadable function that is installed automatically by components or plugins rather than by using [`CREATE FUNCTION`](create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions"). Such a function is also dropped automatically, when the component or plugin that installed it is uninstalled.

Note

To upgrade the shared library associated with a loadable function, issue a [`DROP FUNCTION`](drop-function-loadable.html "15.7.4.2 DROP FUNCTION Statement for Loadable Functions") statement, upgrade the shared library, and then issue a [`CREATE FUNCTION`](create-function-loadable.html "15.7.4.1 CREATE FUNCTION Statement for Loadable Functions") statement. If you upgrade the shared library first and then use [`DROP FUNCTION`](drop-function-loadable.html "15.7.4.2 DROP FUNCTION Statement for Loadable Functions"), the server may unexpectedly shut down.


#### 15.7.4.3 INSTALL COMPONENT Statement

```
INSTALL COMPONENT component_name  [, component_name ...
     [SET variable = expr [, variable = expr] ...]

  variable: {
    {GLOBAL | @@GLOBAL.} [component_prefix.]system_var_name
  | {PERSIST | @@PERSIST.} [component_prefix.]system_var_name
}
```

This statement installs one or more components, which become active immediately. A component provides services that are available to the server and other components; see Section 7.5, “MySQL Components”. [`INSTALL COMPONENT`](install-component.html "15.7.4.3 INSTALL COMPONENT Statement") requires the `INSERT` privilege for the `mysql.component` system table because it adds a row to that table to register the component.

Example:

```
INSTALL COMPONENT 'file://component1', 'file://component2';
```

A component is named using a URN that begins with `file://` and indicates the base name of the library file that implements the component, located in the directory named by the `plugin_dir` system variable. Component names do not include any platform-dependent file name suffix such as `.so` or `.dll`. (These naming details are subject to change because component name interpretation is itself performed by a service and the component infrastructure makes it possible to replace the default service implementation with alternative implementations.)

`INSTALL COMPONENT` permits setting the values of component system variables when you install one or more components. The `SET` clause enables you to specify variable values precisely when they are needed, without the inconvenience or limitations associated with other forms of assignment. Specifically, you can also set component variables with these alternatives:

* At server startup using options on the command line or in an option file, but doing so involves a server restart. The values do not take effect until you install the component. You can specify an invalid variable name for a component on the command line without triggering an error.

* Dynamically while the server is running by means of the `SET` statement, which enables you to modify operation of the server without having to stop and restart it. Setting a read-only variable is not permitted.

The optional `SET` clause applies a value, or values, only to the component specified in the `INSTALL COMPONENT` statement, rather than to all subsequent installations of that component. `SET GLOBAL|PERSIST` works for all types of variables, including read-only variables, without having to restart the server. A component system variable that you set using `INSTALL COMPONENT` takes precedence over any conflicting value coming from the command line or an option file.

Example:

```
INSTALL COMPONENT 'file://component1', 'file://component2'
    SET GLOBAL component1.var1 = 12 + 3, PERSIST component2.var2 = 'strings';
```

Omitting `PERSIST` or `GLOBAL` is equivalent to specifying `GLOBAL`.

Specifying `PERSIST` for any variable in `SET` silently executes `SET PERSIST_ONLY` immediately after `INSTALL COMPONENT` loads the components, but before updating the `mysql.component` table. If `SET PERSIST_ONLY` fails, then the server unloads all of the previously loaded new components without persisting anything to `mysql.component`.

The `SET` clause accepts only valid variable names of the component being installed and emits an error message for all invalid names. Subqueries, stored functions, and aggregate functions are not permitted as part of the value expression. If you install a single component, it is not necessary to prefix the variable name with the component name.

Note

While specifying a variable value using the `SET` clause is similar to that of the command line—it is available immediately at variable registration—there is a distinct difference in how the `SET` clause handles *invalid numerical* values for boolean variables. For example, if you set a boolean variable to 11 (`component1.boolvar = 11`), you see the following behavior:

* `SET` clause yields true
* Command line yields false (11 is neither ON nor 1)

If any error occurs, the statement fails and has no effect. For example, this happens if a component name is erroneous, a named component does not exist or is already installed, or component initialization fails.

A loader service handles component loading, which includes adding installed components to the `mysql.component` system table that serves as a registry. For subsequent server restarts, any components listed in `mysql.component` are loaded by the loader service during the startup sequence. This occurs even if the server is started with the `--skip-grant-tables` option.

If a component depends on services not present in the registry and you attempt to install the component without also installing the component or components that provide the services on which it depends, an error occurs:

```
ERROR 3527 (HY000): Cannot satisfy dependency for service 'component_a'
required by component 'component_b'.
```

To avoid this problem, either install all components in the same statement, or install the dependent component after installing any components on which it depends.

Note

For keyring components, do not use `INSTALL COMPONENT`. Instead, configure keyring component loading using a manifest file. See Section 8.4.5.2, “Keyring Component Installation”.


#### 15.7.4.4 INSTALL PLUGIN Statement

```
INSTALL PLUGIN plugin_name SONAME 'shared_library_name'
```

This statement installs a server plugin. It requires the `INSERT` privilege for the `mysql.plugin` system table because it adds a row to that table to register the plugin.

*`plugin_name`* is the name of the plugin as defined in the plugin descriptor structure contained in the library file (see Plugin Data Structures). Plugin names are not case-sensitive. For maximal compatibility, plugin names should be limited to ASCII letters, digits, and underscore because they are used in C source files, shell command lines, M4 and Bourne shell scripts, and SQL environments.

*`shared_library_name`* is the name of the shared library that contains the plugin code. The name includes the file name extension (for example, `libmyplugin.so`, `libmyplugin.dll`, or `libmyplugin.dylib`).

The shared library must be located in the plugin directory (the directory named by the `plugin_dir` system variable). The library must be in the plugin directory itself, not in a subdirectory. By default, `plugin_dir` is the `plugin` directory under the directory named by the `pkglibdir` configuration variable, but it can be changed by setting the value of `plugin_dir` at server startup. For example, set its value in a `my.cnf` file:

```
[mysqld]
plugin_dir=/path/to/plugin/directory
```

If the value of `plugin_dir` is a relative path name, it is taken to be relative to the MySQL base directory (the value of the `basedir` system variable).

`INSTALL PLUGIN` loads and initializes the plugin code to make the plugin available for use. A plugin is initialized by executing its initialization function, which handles any setup that the plugin must perform before it can be used. When the server shuts down, it executes the deinitialization function for each plugin that is loaded so that the plugin has a chance to perform any final cleanup.

`INSTALL PLUGIN` also registers the plugin by adding a line that indicates the plugin name and library file name to the `mysql.plugin` system table. During the normal startup sequence, the server loads and initializes plugins registered in `mysql.plugin`. This means that a plugin is installed with `INSTALL PLUGIN` only once, not every time the server starts. If the server is started with the `--skip-grant-tables` option, plugins registered in the `mysql.plugin` table are not loaded and are unavailable.

A plugin library can contain multiple plugins. For each of them to be installed, use a separate [`INSTALL PLUGIN`](install-plugin.html "15.7.4.4 INSTALL PLUGIN Statement") statement. Each statement names a different plugin, but all of them specify the same library name.

`INSTALL PLUGIN` causes the server to read option (`my.cnf`) files just as during server startup. This enables the plugin to pick up any relevant options from those files. It is possible to add plugin options to an option file even before loading a plugin (if the `loose` prefix is used). It is also possible to uninstall a plugin, edit `my.cnf`, and install the plugin again. Restarting the plugin this way enables it to the new option values without a server restart.

For options that control individual plugin loading at server startup, see Section 7.6.1, “Installing and Uninstalling Plugins”. If you need to load plugins for a single server startup when the `--skip-grant-tables` option is given (which tells the server not to read system tables), use the `--plugin-load` option. See Section 7.1.7, “Server Command Options”.

To remove a plugin, use the [`UNINSTALL PLUGIN`](uninstall-plugin.html "15.7.4.6 UNINSTALL PLUGIN Statement") statement.

For additional information about plugin loading, see Section 7.6.1, “Installing and Uninstalling Plugins”.

To see what plugins are installed, use the `SHOW PLUGINS` statement or query the `INFORMATION_SCHEMA` the `PLUGINS` table.

If you recompile a plugin library and need to reinstall it, you can use either of the following methods:

* Use `UNINSTALL PLUGIN` to uninstall all plugins in the library, install the new plugin library file in the plugin directory, and then use `INSTALL PLUGIN` to install all plugins in the library. This procedure has the advantage that it can be used without stopping the server. However, if the plugin library contains many plugins, you must issue many `INSTALL PLUGIN` and `UNINSTALL PLUGIN` statements.

* Stop the server, install the new plugin library file in the plugin directory, and restart the server.


#### 15.7.4.5 UNINSTALL COMPONENT Statement

```
UNINSTALL COMPONENT component_name [, component_name ] ...
```

This statement deactivates and uninstalls one or more components. A component provides services that are available to the server and other components; see Section 7.5, “MySQL Components”. [`UNINSTALL COMPONENT`](uninstall-component.html "15.7.4.5 UNINSTALL COMPONENT Statement") is the complement of `INSTALL COMPONENT`. It requires the `DELETE` privilege for the `mysql.component` system table because it removes the row from that table that registers the component. `UNINSTALL COMPONENT` does not undo persisted variables, including the variables persisted using `INSTALL COMPONENT ... SET PERSIST`.

Example:

```
UNINSTALL COMPONENT 'file://component1', 'file://component2';
```

For information about component naming, see Section 15.7.4.3, “INSTALL COMPONENT Statement”.

If any error occurs, the statement fails and has no effect. For example, this happens if a component name is erroneous, a named component is not installed, or cannot be uninstalled because other installed components depend on it.

A loader service handles component unloading, which includes removing uninstalled components from the `mysql.component` system table that serves as a registry. As a result, unloaded components are not loaded during the startup sequence for subsequent server restarts.

Note

This statement has no effect for keyring components, which are loaded using a manifest file and cannot be uninstalled. See Section 8.4.5.2, “Keyring Component Installation”.


#### 15.7.4.6 UNINSTALL PLUGIN Statement

```
UNINSTALL PLUGIN plugin_name
```

This statement removes an installed server plugin. `UNINSTALL PLUGIN` is the complement of `INSTALL PLUGIN`. It requires the `DELETE` privilege for the `mysql.plugin` system table because it removes the row from that table that registers the plugin.

*`plugin_name`* must be the name of some plugin that is listed in the `mysql.plugin` table. The server executes the plugin's deinitialization function and removes the row for the plugin from the `mysql.plugin` system table, so that subsequent server restarts do not load and initialize the plugin. `UNINSTALL PLUGIN` does not remove the plugin's shared library file.

You cannot uninstall a plugin if any table that uses it is open.

Plugin removal has implications for the use of associated tables. For example, if a full-text parser plugin is associated with a `FULLTEXT` index on the table, uninstalling the plugin makes the table unusable. Any attempt to access the table results in an error. The table cannot even be opened, so you cannot drop an index for which the plugin is used. This means that uninstalling a plugin is something to do with care unless you do not care about the table contents. If you are uninstalling a plugin with no intention of reinstalling it later and you care about the table contents, you should dump the table with **mysqldump** and remove the `WITH PARSER` clause from the dumped `CREATE TABLE` statement so that you can reload the table later. If you do not care about the table, `DROP TABLE` can be used even if any plugins associated with the table are missing.

For additional information about plugin loading, see Section 7.6.1, “Installing and Uninstalling Plugins”.


### 15.7.5 CLONE Statement

```
CLONE clone_action

clone_action: {
    LOCAL DATA DIRECTORY [=] 'clone_dir';
  | INSTANCE FROM 'user'@'host':port
    IDENTIFIED BY 'password'
    [DATA DIRECTORY [=] 'clone_dir']
    [REQUIRE [NO] SSL]
}
```

The `CLONE` statement is used to clone data locally or from a remote MySQL server instance. To use `CLONE` syntax, the clone plugin must be installed. See Section 7.6.6, “The Clone Plugin”.

[`CLONE LOCAL DATA DIRECTORY`](clone.html "15.7.5 CLONE Statement") syntax clones data from the local MySQL data directory to a directory on the same server or node where the MySQL server instance runs. The `'clone_dir'` directory is the full path of the local directory that data is cloned to. An absolute path is required. The specified directory must not exist, but the specified path must be an existent path. The MySQL server requires the necessary write access to create the specified directory. For more information, see Section 7.6.6.2, “Cloning Data Locally”.

`CLONE INSTANCE` syntax clones data from a remote MySQL server instance (the donor) and transfers it to the MySQL instance where the cloning operation was initiated (the recipient).

* `user` is the clone user on the donor MySQL server instance.

* `host` is the `hostname` address of the donor MySQL server instance. Internet Protocol version 6 (IPv6) address format is not supported. An alias to the IPv6 address can be used instead. An IPv4 address can be used as is.

* `port` is the `port` number of the donor MySQL server instance. (The X Protocol port specified by `mysqlx_port` is not supported. Connecting to the donor MySQL server instance through MySQL Router is also not supported.)

* `IDENTIFIED BY 'password'` specifies the password of the clone user on the donor MySQL server instance.

* `DATA DIRECTORY [=] 'clone_dir'` is an optional clause used to specify a directory on the recipient for the data you are cloning. Use this option if you do not want to remove existing data in the recipient data directory. An absolute path is required, and the directory must not exist. The MySQL server must have the necessary write access to create the directory.

  When the optional `DATA DIRECTORY [=] 'clone_dir'` clause is not used, a cloning operation removes existing data in the recipient data directory, replaces it with the cloned data, and automatically restarts the server afterward.

* `[REQUIRE [NO] SSL]` explicitly specifies whether an encrypted connection is to be used or not when transferring cloned data over the network. An error is returned if the explicit specification cannot be satisfied. If an SSL clause is not specified, clone attempts to establish an encrypted connection by default, falling back to an insecure connection if the secure connection attempt fails. A secure connection is required when cloning encrypted data regardless of whether this clause is specified. For more information, see Configuring an Encrypted Connection for Cloning.

For additional information about cloning data from a remote MySQL server instance, see Section 7.6.6.3, “Cloning Remote Data”.


### 15.7.6 SET Statements

The `SET` statement has several forms. Descriptions for those forms that are not associated with a specific server capability appear in subsections of this section:

* [`SET var_name = value`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") enables you to assign values to variables that affect the operation of the server or clients. See Section 15.7.6.1, “SET Syntax for Variable Assignment”.

* `SET CHARACTER SET` and `SET NAMES` assign values to character set and collation variables associated with the current connection to the server. See Section 15.7.6.2, “SET CHARACTER SET Statement”, and Section 15.7.6.3, “SET NAMES Statement”.

Descriptions for the other forms appear elsewhere, grouped with other statements related to the capability they help implement:

* `SET DEFAULT ROLE` and `SET ROLE` set the default role and current role for user accounts. See Section 15.7.1.9, “SET DEFAULT ROLE Statement”, and Section 15.7.1.11, “SET ROLE Statement”.

* `SET PASSWORD` assigns account passwords. See Section 15.7.1.10, “SET PASSWORD Statement”.

* `SET RESOURCE GROUP` assigns threads to a resource group. See Section 15.7.2.4, “SET RESOURCE GROUP Statement”.

* [`SET TRANSACTION ISOLATION LEVEL`](set-transaction.html "15.3.7 SET TRANSACTION Statement") sets the isolation level for transaction processing. See Section 15.3.7, “SET TRANSACTION Statement”.


#### 15.7.6.1 SET Syntax for Variable Assignment

```
SET variable = expr [, variable = expr] ...

variable: {
    user_var_name
  | param_name
  | local_var_name
  | {GLOBAL | @@GLOBAL.} system_var_name
  | {PERSIST | @@PERSIST.} system_var_name
  | {PERSIST_ONLY | @@PERSIST_ONLY.} system_var_name
  | [SESSION | @@SESSION. | @@] system_var_name
}
```

`SET` syntax for variable assignment enables you to assign values to different types of variables that affect the operation of the server or clients:

* User-defined variables. See Section 11.4, “User-Defined Variables”.

* Stored procedure and function parameters, and stored program local variables. See Section 15.6.4, “Variables in Stored Programs”.

* System variables. See Section 7.1.8, “Server System Variables”. System variables also can be set at server startup, as described in Section 7.1.9, “Using System Variables”.

A `SET` statement that assigns variable values is not written to the binary log, so in replication scenarios it affects only the host on which you execute it. To affect all replication hosts, execute the statement on each host.

The following sections describe `SET` syntax for setting variables. They use the `=` assignment operator, but the `:=` assignment operator is also permitted for this purpose.

* User-Defined Variable Assignment
* Parameter and Local Variable Assignment
* System Variable Assignment
* SET Error Handling
* Multiple Variable Assignment
* System Variable References in Expressions

##### User-Defined Variable Assignment

User-defined variables are created locally within a session and exist only within the context of that session; see Section 11.4, “User-Defined Variables”.

A user-defined variable is written as `@var_name` and is assigned an expression value as follows:

```
SET @var_name = expr;
```

Examples:

```
SET @name = 43;
SET @total_tax = (SELECT SUM(tax) FROM taxable_transactions);
```

As demonstrated by those statements, *`expr`* can range from simple (a literal value) to more complex (the value returned by a scalar subquery).

The Performance Schema `user_variables_by_thread` table contains information about user-defined variables. See Section 29.12.10, “Performance Schema User-Defined Variable Tables”.

##### Parameter and Local Variable Assignment

`SET` applies to parameters and local variables in the context of the stored object within which they are defined. The following procedure uses the `increment` procedure parameter and `counter` local variable:

```
CREATE PROCEDURE p(increment INT)
BEGIN
  DECLARE counter INT DEFAULT 0;
  WHILE counter < 10 DO
    -- ... do work ...
    SET counter = counter + increment;
  END WHILE;
END;
```

##### System Variable Assignment

The MySQL server maintains system variables that configure its operation. A system variable can have a global value that affects server operation as a whole, a session value that affects the current session, or both. Many system variables are dynamic and can be changed at runtime using the `SET` statement to affect operation of the current server instance. `SET` can also be used to persist certain system variables to the `mysqld-auto.cnf` file in the data directory, to affect server operation for subsequent startups.

If a `SET` statement is issued for a sensitive system variable, the query is rewritten to replace the value with “`<redacted>`” before it is logged to the general log and audit log. This takes place even if secure storage through a keyring component is not available on the server instance.

If you change a session system variable, the value remains in effect within your session until you change the variable to a different value or the session ends. The change has no effect on other sessions.

If you change a global system variable, the value is remembered and used to initialize the session value for new sessions until you change the variable to a different value or the server exits. The change is visible to any client that accesses the global value. However, the change affects the corresponding session value only for clients that connect after the change. The global variable change does not affect the session value for any current client sessions (not even the session within which the global value change occurs).

To make a global system variable setting permanent so that it applies across server restarts, you can persist it to the `mysqld-auto.cnf` file in the data directory. It is also possible to make persistent configuration changes by manually modifying a `my.cnf` option file, but that is more cumbersome, and an error in a manually entered setting might not be discovered until much later. `SET` statements that persist system variables are more convenient and avoid the possibility of malformed settings because settings with syntax errors do not succeed and do not change server configuration. For more information about persisting system variables and the `mysqld-auto.cnf` file, see Section 7.1.9.3, “Persisted System Variables”.

Note

Setting or persisting a global system variable value always requires special privileges. Setting a session system variable value normally requires no special privileges and can be done by any user, although there are exceptions. For more information, see Section 7.1.9.1, “System Variable Privileges”.

The following discussion describes the syntax options for setting and persisting system variables:

* To assign a value to a global system variable, precede the variable name by the `GLOBAL` keyword or the `@@GLOBAL.` qualifier:

  ```
  SET GLOBAL max_connections = 1000;
  SET @@GLOBAL.max_connections = 1000;
  ```

* To assign a value to a session system variable, precede the variable name by the `SESSION` or `LOCAL` keyword, by the `@@SESSION.`, `@@LOCAL.`, or `@@` qualifier, or by no keyword or no modifier at all:

  ```
  SET SESSION sql_mode = 'TRADITIONAL';
  SET LOCAL sql_mode = 'TRADITIONAL';
  SET @@SESSION.sql_mode = 'TRADITIONAL';
  SET @@LOCAL.sql_mode = 'TRADITIONAL';
  SET @@sql_mode = 'TRADITIONAL';
  SET sql_mode = 'TRADITIONAL';
  ```

  A client can change its own session variables, but not those of any other client.

* To persist a global system variable to the `mysqld-auto.cnf` option file in the data directory, precede the variable name by the `PERSIST` keyword or the `@@PERSIST.` qualifier:

  ```
  SET PERSIST max_connections = 1000;
  SET @@PERSIST.max_connections = 1000;
  ```

  This `SET` syntax enables you to make configuration changes at runtime that also persist across server restarts. Like [`SET GLOBAL`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment"), [`SET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") sets the global variable runtime value, but also writes the variable setting to the `mysqld-auto.cnf` file (replacing any existing variable setting if there is one).

* To persist a global system variable to the `mysqld-auto.cnf` file without setting the global variable runtime value, precede the variable name by the `PERSIST_ONLY` keyword or the `@@PERSIST_ONLY.` qualifier:

  ```
  SET PERSIST_ONLY back_log = 100;
  SET @@PERSIST_ONLY.back_log = 100;
  ```

  Like `PERSIST`, `PERSIST_ONLY` writes the variable setting to `mysqld-auto.cnf`. However, unlike `PERSIST`, `PERSIST_ONLY` does not modify the global variable runtime value. This makes `PERSIST_ONLY` suitable for configuring read-only system variables that can be set only at server startup.

To set a global system variable value to the compiled-in MySQL default value or a session system variable to the current corresponding global value, set the variable to the value `DEFAULT`. For example, the following two statements are identical in setting the session value of `max_join_size` to the current global value:

```
SET @@SESSION.max_join_size = DEFAULT;
SET @@SESSION.max_join_size = @@GLOBAL.max_join_size;
```

Using `SET` to persist a global system variable to a value of `DEFAULT` or to its literal default value assigns the variable its default value and adds a setting for the variable to `mysqld-auto.cnf`. To remove the variable from the file, use `RESET PERSIST`.

Some system variables cannot be persisted or are persist-restricted. See Section 7.1.9.4, “Nonpersistible and Persist-Restricted System Variables”.

A system variable implemented by a plugin can be persisted if the plugin is installed when the `SET` statement is executed. Assignment of the persisted plugin variable takes effect for subsequent server restarts if the plugin is still installed. If the plugin is no longer installed, the plugin variable no longer exists when the server reads the `mysqld-auto.cnf` file. In this case, the server writes a warning to the error log and continues:

```
currently unknown variable 'var_name'
was read from the persisted config file
```

To display system variable names and values:

* Use the `SHOW VARIABLES` statement; see Section 15.7.7.42, “SHOW VARIABLES Statement”.

* Several Performance Schema tables provide system variable information. See Section 29.12.14, “Performance Schema System Variable Tables”.

* The Performance Schema `variables_info` table contains information showing when and by which user each system variable was most recently set. See Section 29.12.14.3, “Performance Schema variables\_info Table”.

* The Performance Schema `persisted_variables` table provides an SQL interface to the `mysqld-auto.cnf` file, enabling its contents to be inspected at runtime using `SELECT` statements. See Section 29.12.14.2, “Performance Schema persisted\_variables Table”.

##### SET Error Handling

If any variable assignment in a `SET` statement fails, the entire statement fails and no variables are changed, nor is the `mysqld-auto.cnf` file changed.

`SET` produces an error under the circumstances described here. Most of the examples show `SET` statements that use keyword syntax (for example, `GLOBAL` or `SESSION`), but the principles are also true for statements that use the corresponding modifiers (for example, `@@GLOBAL.` or `@@SESSION.`).

* Use of `SET` (any variant) to set a read-only variable:

  ```
  mysql> SET GLOBAL version = 'abc';
  ERROR 1238 (HY000): Variable 'version' is a read only variable
  ```

* Use of `GLOBAL`, `PERSIST`, or `PERSIST_ONLY` to set a variable that has only a session value:

  ```
  mysql> SET GLOBAL sql_log_bin = ON;
  ERROR 1228 (HY000): Variable 'sql_log_bin' is a SESSION
  variable and can't be used with SET GLOBAL
  ```

* Use of `SESSION` to set a variable that has only a global value:

  ```
  mysql> SET SESSION max_connections = 1000;
  ERROR 1229 (HY000): Variable 'max_connections' is a
  GLOBAL variable and should be set with SET GLOBAL
  ```

* Omission of `GLOBAL`, `PERSIST`, or `PERSIST_ONLY` to set a variable that has only a global value:

  ```
  mysql> SET max_connections = 1000;
  ERROR 1229 (HY000): Variable 'max_connections' is a
  GLOBAL variable and should be set with SET GLOBAL
  ```

* Use of `PERSIST` or `PERSIST_ONLY` to set a variable that cannot be persisted:

  ```
  mysql> SET PERSIST port = 3307;
  ERROR 1238 (HY000): Variable 'port' is a read only variable
  mysql> SET PERSIST_ONLY port = 3307;
  ERROR 1238 (HY000): Variable 'port' is a non persistent read only variable
  ```

* The `@@GLOBAL.`, `@@PERSIST.`, `@@PERSIST_ONLY.`, `@@SESSION.`, and `@@` modifiers apply only to system variables. An error occurs for attempts to apply them to user-defined variables, stored procedure or function parameters, or stored program local variables.

* Not all system variables can be set to `DEFAULT`. In such cases, assigning `DEFAULT` results in an error.

* An error occurs for attempts to assign `DEFAULT` to user-defined variables, stored procedure or function parameters, or stored program local variables.

##### Multiple Variable Assignment

A `SET` statement can contain multiple variable assignments, separated by commas. This statement assigns values to a user-defined variable and a system variable:

```
SET @x = 1, SESSION sql_mode = '';
```

If you set multiple system variables in a single statement, the most recent `GLOBAL`, `PERSIST`, `PERSIST_ONLY`, or `SESSION` keyword in the statement is used for following assignments that have no keyword specified.

Examples of multiple-variable assignment:

```
SET GLOBAL sort_buffer_size = 1000000, SESSION sort_buffer_size = 1000000;
SET @@GLOBAL.sort_buffer_size = 1000000, @@LOCAL.sort_buffer_size = 1000000;
SET GLOBAL max_connections = 1000, sort_buffer_size = 1000000;
```

The `@@GLOBAL.`, `@@PERSIST.`, `@@PERSIST_ONLY.`, `@@SESSION.`, and `@@` modifiers apply only to the immediately following system variable, not any remaining system variables. This statement sets the `sort_buffer_size` global value to 50000 and the session value to 1000000:

```
SET @@GLOBAL.sort_buffer_size = 50000, sort_buffer_size = 1000000;
```

##### System Variable References in Expressions

To refer to the value of a system variable in expressions, use one of the `@@`-modifiers (except `@@PERSIST.` and `@@PERSIST_ONLY.`, which are not permitted in expressions). For example, you can retrieve system variable values in a `SELECT` statement like this:

```
SELECT @@GLOBAL.sql_mode, @@SESSION.sql_mode, @@sql_mode;
```

Note

A reference to a system variable in an expression as `@@var_name` (with `@@` rather than `@@GLOBAL.` or `@@SESSION.`) returns the session value if it exists and the global value otherwise. This differs from `SET @@var_name = expr`, which always refers to the session value.


#### 15.7.6.2 SET CHARACTER SET Statement

```
SET {CHARACTER SET | CHARSET}
    {'charset_name' | DEFAULT}
```

This statement maps all strings sent between the server and the current client with the given mapping. `SET CHARACTER SET` sets three session system variables: `character_set_client` and `character_set_results` are set to the given character set, and `character_set_connection` to the value of `character_set_database`. See Section 12.4, “Connection Character Sets and Collations”.

*`charset_name`* may be quoted or unquoted.

The default character set mapping can be restored by using the value `DEFAULT`. The default depends on the server configuration.

Some character sets cannot be used as the client character set. Attempting to use them with [`SET CHARACTER SET`](set-character-set.html "15.7.6.2 SET CHARACTER SET Statement") produces an error. See Impermissible Client Character Sets.


#### 15.7.6.3 SET NAMES Statement

```
SET NAMES {'charset_name'
    [COLLATE 'collation_name'] | DEFAULT}
```

This statement sets the three session system variables `character_set_client`, `character_set_connection`, and `character_set_results` to the given character set. Setting `character_set_connection` to `charset_name` also sets `collation_connection` to the default collation for `charset_name`. See Section 12.4, “Connection Character Sets and Collations”.

The optional `COLLATE` clause may be used to specify a collation explicitly. If given, the collation must one of the permitted collations for *`charset_name`*.

*`charset_name`* and *`collation_name`* may be quoted or unquoted.

The default mapping can be restored by using a value of `DEFAULT`. The default depends on the server configuration.

Some character sets cannot be used as the client character set. Attempting to use them with [`SET NAMES`](set-names.html "15.7.6.3 SET NAMES Statement") produces an error. See Impermissible Client Character Sets.


### 15.7.7 SHOW Statements

`SHOW` has many forms that provide information about databases, tables, columns, or status information about the server. This section describes those following:

```
SHOW BINARY LOG STATUS
SHOW BINARY LOGS
SHOW BINLOG EVENTS [IN 'log_name'] [FROM pos] [LIMIT [offset,] row_count]
SHOW {CHARACTER SET | CHARSET} [like_or_where]
SHOW COLLATION [like_or_where]
SHOW [FULL] COLUMNS FROM tbl_name [FROM db_name] [like_or_where]
SHOW CREATE DATABASE db_name
SHOW CREATE EVENT event_name
SHOW CREATE FUNCTION func_name
SHOW CREATE PROCEDURE proc_name
SHOW CREATE TABLE tbl_name
SHOW CREATE TRIGGER trigger_name
SHOW CREATE VIEW view_name
SHOW DATABASES [like_or_where]
SHOW ENGINE engine_name {STATUS | MUTEX}
SHOW [STORAGE] ENGINES
SHOW ERRORS [LIMIT [offset,] row_count]
SHOW EVENTS
SHOW FUNCTION CODE func_name
SHOW FUNCTION STATUS [like_or_where]
SHOW GRANTS FOR user
SHOW INDEX FROM tbl_name [FROM db_name]
SHOW OPEN TABLES [FROM db_name] [like_or_where]
SHOW PLUGINS
SHOW PROCEDURE CODE proc_name
SHOW PROCEDURE STATUS [like_or_where]
SHOW PRIVILEGES
SHOW [FULL] PROCESSLIST
SHOW PROFILE [types] [FOR QUERY n] [OFFSET n] [LIMIT n]
SHOW PROFILES
SHOW RELAYLOG EVENTS [IN 'log_name'] [FROM pos] [LIMIT [offset,] row_count]
SHOW REPLICA STATUS [FOR CHANNEL channel]
SHOW REPLICAS
SHOW [GLOBAL | SESSION] STATUS [like_or_where]
SHOW TABLE STATUS [FROM db_name] [like_or_where]
SHOW [FULL] TABLES [FROM db_name] [like_or_where]
SHOW TRIGGERS [FROM db_name] [like_or_where]
SHOW [GLOBAL | SESSION] VARIABLES [like_or_where]
SHOW WARNINGS [LIMIT [offset,] row_count]

like_or_where: {
    LIKE 'pattern'
  | WHERE expr
}
```

If the syntax for a given `SHOW` statement includes a [`LIKE 'pattern'`](string-comparison-functions.html#operator_like) part, `'pattern'` is a string that can contain the SQL `%` and `_` wildcard characters. The pattern is useful for restricting statement output to matching values.

Several `SHOW` statements also accept a `WHERE` clause that provides more flexibility in specifying which rows to display. See Section 28.8, “Extensions to SHOW Statements”.

In `SHOW` statement results, user names and host names are quoted using backticks (`).

Many MySQL APIs (such as PHP) enable you to treat the result returned from a `SHOW` statement as you would a result set from a `SELECT`; see Chapter 31, *Connectors and APIs*, or your API documentation for more information. In addition, you can work in SQL with results from queries on tables in the `INFORMATION_SCHEMA` database, which you cannot easily do with results from `SHOW` statements. See Chapter 28, *INFORMATION\_SCHEMA Tables*.


#### 15.7.7.1 SHOW BINARY LOG STATUS Statement

```
SHOW BINARY LOG STATUS
```

This statement provides status information about binary log files on the source server, and requires the `REPLICATION CLIENT` privilege (or the deprecated `SUPER` privilege).

Example:

```
mysql> SHOW BINARY LOG STATUS\G
*************************** 1. row ***************************
             File: source-bin.000002
         Position: 1307
     Binlog_Do_DB: test
 Binlog_Ignore_DB: manual, mysql
Executed_Gtid_Set: 3E11FA47-71CA-11E1-9E33-C80AA9429562:1-5
1 row in set (0.00 sec)
```

When global transaction IDs are in use, `Executed_Gtid_Set` shows the set of GTIDs for transactions that have been executed on the source. This is the same as the value for the `gtid_executed` system variable on this server, as well as the value for `Executed_Gtid_Set` in the output of `SHOW REPLICA STATUS` on this server.


#### 15.7.7.2 SHOW BINARY LOGS Statement

```
SHOW BINARY LOGS
```

Lists the binary log files on the server. This statement is used as part of the procedure described in Section 15.4.1.1, “PURGE BINARY LOGS Statement”, that shows how to determine which logs can be purged. [`SHOW BINARY LOGS`](show-binary-logs.html "15.7.7.2 SHOW BINARY LOGS Statement") requires the [`REPLICATION CLIENT`](privileges-provided.html#priv_replication-client) privilege (or the deprecated `SUPER` privilege).

Encrypted binary log files have a 512-byte file header that stores information required for encryption and decryption of the file. This is included in the file size displayed by `SHOW BINARY LOGS`. The `Encrypted` column shows whether or not the binary log file is encrypted. Binary log encryption is active if `binlog_encryption=ON` is set for the server. Existing binary log files are not encrypted or decrypted if binary log encryption is activated or deactivated while the server is running.

```
mysql> SHOW BINARY LOGS;
+---------------+-----------+-----------+
| Log_name      | File_size | Encrypted |
+---------------+-----------+-----------+
| binlog.000015 |    724935 |       Yes |
| binlog.000016 |    733481 |       Yes |
+---------------+-----------+-----------+
```


#### 15.7.7.3 SHOW BINLOG EVENTS Statement

```
SHOW BINLOG EVENTS
   [IN 'log_name']
   [FROM pos]
   [LIMIT [offset,] row_count]
```

Shows the events in the binary log. If you do not specify `'log_name'`, the first binary log is displayed. `SHOW BINLOG EVENTS` requires the [`REPLICATION SLAVE`](privileges-provided.html#priv_replication-slave) privilege.

The `LIMIT` clause has the same syntax as for the `SELECT` statement. See Section 15.2.13, “SELECT Statement”.

Note

Issuing a `SHOW BINLOG EVENTS` with no `LIMIT` clause could start a very time- and resource-consuming process because the server returns to the client the complete contents of the binary log (which includes all statements executed by the server that modify data). As an alternative to [`SHOW BINLOG EVENTS`](show-binlog-events.html "15.7.7.3 SHOW BINLOG EVENTS Statement"), use the **mysqlbinlog** utility to save the binary log to a text file for later examination and analysis. See Section 6.6.9, “mysqlbinlog — Utility for Processing Binary Log Files”.

`SHOW BINLOG EVENTS` displays the following fields for each event in the binary log:

* `Log_name`

  The name of the file that is being listed.

* `Pos`

  The position at which the event occurs.

* `Event_type`

  An identifier that describes the event type.

* `Server_id`

  The server ID of the server on which the event originated.

* `End_log_pos`

  The position at which the next event begins, which is equal to `Pos` plus the size of the event.

* `Info`

  More detailed information about the event type. The format of this information depends on the event type.

For compressed transaction payloads, the `Transaction_payload_event` is first printed as a single unit, then it is unpacked and each event inside it is printed.

Some events relating to the setting of user and system variables are not included in the output from [`SHOW BINLOG EVENTS`](show-binlog-events.html "15.7.7.3 SHOW BINLOG EVENTS Statement"). To get complete coverage of events within a binary log, use **mysqlbinlog**.

`SHOW BINLOG EVENTS` does *not* work with relay log files. You can use `SHOW RELAYLOG EVENTS` for this purpose.


#### 15.7.7.4 SHOW CHARACTER SET Statement

```
SHOW {CHARACTER SET | CHARSET}
    [LIKE 'pattern' | WHERE expr]
```

The `SHOW CHARACTER SET` statement shows all available character sets. The `LIKE` clause, if present, indicates which character set names to match. The `WHERE` clause can be given to select rows using more general conditions, as discussed in Section 28.8, “Extensions to SHOW Statements”. For example:

```
mysql> SHOW CHARACTER SET LIKE 'latin%';
+---------+-----------------------------+-------------------+--------+
| Charset | Description                 | Default collation | Maxlen |
+---------+-----------------------------+-------------------+--------+
| latin1  | cp1252 West European        | latin1_swedish_ci |      1 |
| latin2  | ISO 8859-2 Central European | latin2_general_ci |      1 |
| latin5  | ISO 8859-9 Turkish          | latin5_turkish_ci |      1 |
| latin7  | ISO 8859-13 Baltic          | latin7_general_ci |      1 |
+---------+-----------------------------+-------------------+--------+
```

`SHOW CHARACTER SET` output has these columns:

* `Charset`

  The character set name.

* `Description`

  A description of the character set.

* `Default collation`

  The default collation for the character set.

* `Maxlen`

  The maximum number of bytes required to store one character.

The `filename` character set is for internal use only; consequently, [`SHOW CHARACTER SET`](show-character-set.html "15.7.7.4 SHOW CHARACTER SET Statement") does not display it.

Character set information is also available from the `INFORMATION_SCHEMA` `CHARACTER_SETS` table.


#### 15.7.7.5 SHOW COLLATION Statement

```
SHOW COLLATION
    [LIKE 'pattern' | WHERE expr]
```

This statement lists collations supported by the server. By default, the output from [`SHOW COLLATION`](show-collation.html "15.7.7.5 SHOW COLLATION Statement") includes all available collations. The `LIKE` clause, if present, indicates which collation names to match. The `WHERE` clause can be given to select rows using more general conditions, as discussed in Section 28.8, “Extensions to SHOW Statements”. For example:

```
mysql> SHOW COLLATION WHERE Charset = 'latin1';
+-------------------+---------+----+---------+----------+---------+
| Collation         | Charset | Id | Default | Compiled | Sortlen |
+-------------------+---------+----+---------+----------+---------+
| latin1_german1_ci | latin1  |  5 |         | Yes      |       1 |
| latin1_swedish_ci | latin1  |  8 | Yes     | Yes      |       1 |
| latin1_danish_ci  | latin1  | 15 |         | Yes      |       1 |
| latin1_german2_ci | latin1  | 31 |         | Yes      |       2 |
| latin1_bin        | latin1  | 47 |         | Yes      |       1 |
| latin1_general_ci | latin1  | 48 |         | Yes      |       1 |
| latin1_general_cs | latin1  | 49 |         | Yes      |       1 |
| latin1_spanish_ci | latin1  | 94 |         | Yes      |       1 |
+-------------------+---------+----+---------+----------+---------+
```

`SHOW COLLATION` output has these columns:

* `Collation`

  The collation name.

* `Charset`

  The name of the character set with which the collation is associated.

* `Id`

  The collation ID.

* `Default`

  Whether the collation is the default for its character set.

* `Compiled`

  Whether the character set is compiled into the server.

* `Sortlen`

  This is related to the amount of memory required to sort strings expressed in the character set.

* `Pad_attribute`

  The collation pad attribute, one of `NO PAD` or `PAD SPACE`. This attribute affects whether trailing spaces are significant in string comparisons; for more information, see Trailing Space Handling in Comparisons.

To see the default collation for each character set, use the following statement. `Default` is a reserved word, so to use it as an identifier, it must be quoted as such:

```
mysql> SHOW COLLATION WHERE `Default` = 'Yes';
+---------------------+----------+----+---------+----------+---------+
| Collation           | Charset  | Id | Default | Compiled | Sortlen |
+---------------------+----------+----+---------+----------+---------+
| big5_chinese_ci     | big5     |  1 | Yes     | Yes      |       1 |
| dec8_swedish_ci     | dec8     |  3 | Yes     | Yes      |       1 |
| cp850_general_ci    | cp850    |  4 | Yes     | Yes      |       1 |
| hp8_english_ci      | hp8      |  6 | Yes     | Yes      |       1 |
| koi8r_general_ci    | koi8r    |  7 | Yes     | Yes      |       1 |
| latin1_swedish_ci   | latin1   |  8 | Yes     | Yes      |       1 |
...
```

Collation information is also available from the `INFORMATION_SCHEMA` `COLLATIONS` table. See Section 28.3.6, “The INFORMATION\_SCHEMA COLLATIONS Table”.


#### 15.7.7.6 SHOW COLUMNS Statement

```
SHOW [EXTENDED] [FULL] {COLUMNS | FIELDS}
    {FROM | IN} tbl_name
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

`SHOW COLUMNS` displays information about the columns in a given table. It also works for views. `SHOW COLUMNS` displays information only for those columns for which you have some privilege.

```
mysql> SHOW COLUMNS FROM City;
+-------------+----------+------+-----+---------+----------------+
| Field       | Type     | Null | Key | Default | Extra          |
+-------------+----------+------+-----+---------+----------------+
| ID          | int(11)  | NO   | PRI | NULL    | auto_increment |
| Name        | char(35) | NO   |     |         |                |
| CountryCode | char(3)  | NO   | MUL |         |                |
| District    | char(20) | NO   |     |         |                |
| Population  | int(11)  | NO   |     | 0       |                |
+-------------+----------+------+-----+---------+----------------+
```

An alternative to `tbl_name FROM db_name` syntax is *`db_name.tbl_name`*. These two statements are equivalent:

```
SHOW COLUMNS FROM mytable FROM mydb;
SHOW COLUMNS FROM mydb.mytable;
```

The optional `EXTENDED` keyword causes the output to include information about hidden columns that MySQL uses internally and are not accessible by users.

The optional `FULL` keyword causes the output to include the column collation and comments, as well as the privileges you have for each column.

The `LIKE` clause, if present, indicates which column names to match. The `WHERE` clause can be given to select rows using more general conditions, as discussed in Section 28.8, “Extensions to SHOW Statements”.

The data types may differ from what you expect them to be based on a `CREATE TABLE` statement because MySQL sometimes changes data types when you create or alter a table. The conditions under which this occurs are described in Section 15.1.24.7, “Silent Column Specification Changes”.

`SHOW COLUMNS` displays the following values for each table column:

* `Field`

  The name of the column.

* `Type`

  The column data type.

* `Collation`

  The collation for nonbinary string columns, or `NULL` for other columns. This value is displayed only if you use the `FULL` keyword.

* `Null`

  The column nullability. The value is `YES` if `NULL` values can be stored in the column, `NO` if not.

* `Key`

  Whether the column is indexed:

  + If `Key` is empty, the column either is not indexed or is indexed only as a secondary column in a multiple-column, nonunique index.

  + If `Key` is `PRI`, the column is a `PRIMARY KEY` or is one of the columns in a multiple-column `PRIMARY KEY`.

  + If `Key` is `UNI`, the column is the first column of a `UNIQUE` index. (A `UNIQUE` index permits multiple `NULL` values, but you can tell whether the column permits `NULL` by checking the `Null` field.)

  + If `Key` is `MUL`, the column is the first column of a nonunique index in which multiple occurrences of a given value are permitted within the column.

  If more than one of the `Key` values applies to a given column of a table, `Key` displays the one with the highest priority, in the order `PRI`, `UNI`, `MUL`.

  A `UNIQUE` index may be displayed as `PRI` if it cannot contain `NULL` values and there is no `PRIMARY KEY` in the table. A `UNIQUE` index may display as `MUL` if several columns form a composite `UNIQUE` index; although the combination of the columns is unique, each column can still hold multiple occurrences of a given value.

* `Default`

  The default value for the column. This is `NULL` if the column has an explicit default of `NULL`, or if the column definition includes no `DEFAULT` clause.

* `Extra`

  Any additional information that is available about a given column. The value is nonempty in these cases:

  + `auto_increment` for columns that have the `AUTO_INCREMENT` attribute.

  + `on update CURRENT_TIMESTAMP` for `TIMESTAMP` or `DATETIME` columns that have the `ON UPDATE CURRENT_TIMESTAMP` attribute.

  + `VIRTUAL GENERATED` or `STORED GENERATED` for generated columns.

  + `DEFAULT_GENERATED` for columns that have an expression default value.

* `Privileges`

  The privileges you have for the column. This value is displayed only if you use the `FULL` keyword.

* `Comment`

  Any comment included in the column definition. This value is displayed only if you use the `FULL` keyword.

Table column information is also available from the `INFORMATION_SCHEMA` `COLUMNS` table. See Section 28.3.8, “The INFORMATION\_SCHEMA COLUMNS Table”. The extended information about hidden columns is available only using `SHOW EXTENDED COLUMNS`; it cannot be obtained from the `COLUMNS` table.

You can list a table's columns with the [**mysqlshow *`db_name`* *`tbl_name`***](mysqlshow.html "6.5.6 mysqlshow — Display Database, Table, and Column Information") command.

The `DESCRIBE` statement provides information similar to [`SHOW COLUMNS`](show-columns.html "15.7.7.6 SHOW COLUMNS Statement"). See Section 15.8.1, “DESCRIBE Statement”.

The `SHOW CREATE TABLE`, `SHOW TABLE STATUS`, and `SHOW INDEX` statements also provide information about tables. See Section 15.7.7, “SHOW Statements”.

`SHOW COLUMNS` includes the table's generated invisible primary key, if it has one, by default. You can cause this information to be suppressed in the statement's output by setting [`show_gipk_in_create_table_and_information_schema = OFF`](server-system-variables.html#sysvar_show_gipk_in_create_table_and_information_schema). For more information, see Section 15.1.24.11, “Generated Invisible Primary Keys”.


#### 15.7.7.7 SHOW CREATE DATABASE Statement

```
SHOW CREATE {DATABASE | SCHEMA} [IF NOT EXISTS] db_name
```

Shows the `CREATE DATABASE` statement that creates the named database. If the `SHOW` statement includes an `IF NOT EXISTS` clause, the output too includes such a clause. [`SHOW CREATE SCHEMA`](show-create-database.html "15.7.7.7 SHOW CREATE DATABASE Statement") is a synonym for `SHOW CREATE DATABASE`.

```
mysql> SHOW CREATE DATABASE test\G
*************************** 1. row ***************************
       Database: test
Create Database: CREATE DATABASE `test` /*!40100 DEFAULT CHARACTER SET utf8mb4
                 COLLATE utf8mb4_0900_ai_ci */ /*!80014 DEFAULT ENCRYPTION='N' */

mysql> SHOW CREATE SCHEMA test\G
*************************** 1. row ***************************
       Database: test
Create Database: CREATE DATABASE `test` /*!40100 DEFAULT CHARACTER SET utf8mb4
                 COLLATE utf8mb4_0900_ai_ci */ /*!80014 DEFAULT ENCRYPTION='N' */
```

`SHOW CREATE DATABASE` quotes table and column names according to the value of the `sql_quote_show_create` option. See Section 7.1.8, “Server System Variables”.


#### 15.7.7.8 SHOW CREATE EVENT Statement

```
SHOW CREATE EVENT event_name
```

This statement displays the [`CREATE EVENT`](create-event.html "15.1.15 CREATE EVENT Statement") statement needed to re-create a given event. It requires the `EVENT` privilege for the database from which the event is to be shown. For example (using the same event `e_daily` defined and then altered in Section 15.7.7.20, “SHOW EVENTS Statement”):

```
mysql> SHOW CREATE EVENT myschema.e_daily\G
*************************** 1. row ***************************
               Event: e_daily
            sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
                      NO_ZERO_IN_DATE,NO_ZERO_DATE,
                      ERROR_FOR_DIVISION_BY_ZERO,
                      NO_ENGINE_SUBSTITUTION
           time_zone: SYSTEM
        Create Event: CREATE DEFINER=`jon`@`ghidora` EVENT `e_daily`
                        ON SCHEDULE EVERY 1 DAY
                        STARTS CURRENT_TIMESTAMP + INTERVAL 6 HOUR
                        ON COMPLETION NOT PRESERVE
                        ENABLE
                        COMMENT 'Saves total number of sessions then
                                clears the table each day'
                        DO BEGIN
                          INSERT INTO site_activity.totals (time, total)
                            SELECT CURRENT_TIMESTAMP, COUNT(*)
                              FROM site_activity.sessions;
                          DELETE FROM site_activity.sessions;
                        END
character_set_client: utf8mb4
collation_connection: utf8mb4_0900_ai_ci
  Database Collation: utf8mb4_0900_ai_ci
```

`character_set_client` is the session value of the `character_set_client` system variable when the event was created. `collation_connection` is the session value of the `collation_connection` system variable when the event was created. `Database Collation` is the collation of the database with which the event is associated.

The output reflects the current status of the event (`ENABLE`) rather than the status with which it was created.


#### 15.7.7.9 SHOW CREATE FUNCTION Statement

```
SHOW CREATE FUNCTION func_name
```

This statement is similar to [`SHOW CREATE PROCEDURE`](show-create-procedure.html "15.7.7.11 SHOW CREATE PROCEDURE Statement") but for stored functions. See Section 15.7.7.11, “SHOW CREATE PROCEDURE Statement”.


#### 15.7.7.10 SHOW CREATE LIBRARY Statement

```
SHOW CREATE LIBRARY [database_name.]library_name
```

Returns the text that can be used to re-create the named JavaScript or WebAssembly library in the named database; the database defaults to the current database if one is not specified. See Section 15.1.19, “CREATE LIBRARY Statement”, for more information.

For an account other than the account which created the library, access to routine properties depends on the privileges granted to the account, as described here:

* With the `SHOW_ROUTINE` privilege or the global `SELECT` privilege, the account can see all library properties, including its definition. This means that `SHOW CREATE LIBRARY` prints the source code of the library, and all libraries in the Information Schema `libraries` table are visible to this account.

* With the `CREATE ROUTINE`, `ALTER ROUTINE`, or `EXECUTE` privilege granted at a scope that includes the library, the account can see all routine properties except its definition. This means that the associated row in `INFORMATION_SCHEMA.LIBRARIES` is visible but, `SHOW CREATE LIBRARY` does not print the library's source code.

Library code may contain SQL statements (known as a JavaScript SQL callout). The statements are restricted, based on the `INVOKER` and `DEFINER` security contexts of the stored program using that library. Such SQL statements follow the usual restrictions applying to stored functions and stored procedures (see Section 27.10, “Restrictions on Stored Programs”).

```
mysql> SHOW CREATE LIBRARY jslib.lib1\G
*************************** 1. row ***************************
       Library: lib1
      sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,
NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
Create Library: CREATE LIBRARY `lib1`
    LANGUAGE JAVASCRIPT COMMENT "This is lib1"
AS $$
      export function f(n) {
        return n
      }
    $$
1 row in set (0.00 sec)

mysql> SHOW CREATE LIBRARY jslib.lib2\G
*************************** 1. row ***************************
       Library: lib2
      sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,
NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
Create Library: CREATE LIBRARY `lib2`
    LANGUAGE JAVASCRIPT COMMENT "This is lib2"
AS $$
      export function g(n) {
        return n * 2
      }
    $$
1 row in set (0.00 sec)

mysql> SHOW CREATE LIBRARY wasmlib.lib1\G
*************************** 1. row ***************************
       Library: lib1
      sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
Create Library: CREATE LIBRARY `lib1`
    LANGUAGE WASM
AS $$AGFzbQEAAAABJwdgA39/fwF/YAAAYAF/AX9gAX8AYAN/fn8BfmAAAX9gBH9/f38BfwJGAhZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxCXByb2NfZXhpdAADFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUABgMPDgEBAQMFAgEAAgQCAwIFBAUBcAEFBQUGAQGCAoICBggBfwFB0JEECweUAQcGbWVtb3J5AgANcHJpbnRfbWVzc2FnZQADGV9faW5kaXJlY3RfZnVuY3Rpb25fdGFibGUBAAZfc3RhcnQABBlfZW1zY3JpcHRlbl9zdGFja19yZXN0b3JlAA0XX2Vtc2NyaXB0ZW5fc3RhY2tfYWxsb2MADhxlbXNjcmlwdGVuX3N0YWNrX2dldF9jdXJyZW50AA8JCgEAQQELBAIKCQsMAQcK9wwOAwABCwQAEAgLPgEBfxAIQbgJKAIAIgAEQANAIAAQBSAAKAI4IgANAAsLQbwJKAIAEAVBoAkoAgAQBUG8CSgCABAFQQAQAAALUwECfwJAIABFDQAgACgCTBogACgCFCAAKAIcRwRAIABBAEEAIAAoAiQRAAAaCyAAKAIEIgEgACgCCCICRg0AIAAgASACa6xBASAAKAIoEQQAGgsLYwEBf0HYCEHYCCgCACIAQQFrIAByNgIAQZAIKAIAIgBBCHEEQEGQCCAAQSByNgIAQX8PC0GUCEIANwIAQawIQbwIKAIAIgA2AgBBpAggADYCAEGgCCAAQcAIKAIAajYCAEEAC6YFAQZ/AkBBoAgoAgAiAgR/IAIFEAYNAUGgCCgCAAtBpAgoAgAiAWsgAEkEQEGQCEGACCAAQbQIKAIAEQAADwsCQAJAIABFQeAIKAIAQQBIcg0AIAAhAwNAIANBgAhqIgJBAWstAABBCkcEQCADQQFrIgMNAQwCCwtBkAhBgAggA0G0CCgCABEAACIBIANJDQIgACADayEAQaQIKAIAIQEMAQtBgAghAkEAIQMLAkAgAEGABE8EQCAABEAgASACIAD8CgAACwwBCyAAIAFqIQQCQCABIAJzQQNxRQRAAkAgAUEDcUUgAEVyDQADQCABIAItAAA6AAAgAkEBaiECIAFBAWoiAUEDcUUNASABIARJDQALCyAEQXxxIQUCQCAEQcAASQ0AIAEgBUFAaiIGSw0AA0AgASACKAIANgIAIAEgAigCBDYCBCABIAIoAgg2AgggASACKAIMNgIMIAEgAigCEDYCECABIAIoAhQ2AhQgASACKAIYNgIYIAEgAigCHDYCHCABIAIoAiA2AiAgASACKAIkNgIkIAEgAigCKDYCKCABIAIoAiw2AiwgASACKAIwNgIwIAEgAigCNDYCNCABIAIoAjg2AjggASACKAI8NgI8IAJBQGshAiABQUBrIgEgBk0NAAsLIAEgBU8NAQNAIAEgAigCADYCACACQQRqIQIgAUEEaiIBIAVJDQALDAELIARBBEkgAEEESXINACAEQQRrIQYDQCABIAItAAA6AAAgASACLQABOgABIAEgAi0AAjoAAiABIAItAAM6AAMgAkEEaiECIAFBBGoiASAGTQ0ACwsgASAESQRAA0AgASACLQAAOgAAIAJBAWohAiABQQFqIgEgBEcNAAsLC0GkCEGkCCgCACAAajYCACAAIANqIQELIAELtQIBA39B3AgoAgAaQYAIIQEDQCABIgBBBGohAUGAgoQIIAAoAgAiAmsgAnJBgIGChHhxQYCBgoR4Rg0ACwNAIAAiAUEBaiEAIAEtAAANAAsCQAJ/IAFBgAhrIgACf0HcCCgCAEEASARAIAAQBwwBCyAAEAcLIgEgAEYNABogAQsgAEcNAAJAQeAIKAIAQQpGDQBBpAgoAgAiAEGgCCgCAEYNAEGkCCAAQQFqNgIAIABBCjoAAAwBCyMAQRBrIgAkACAAQQo6AA8CQAJAQaAIKAIAIgEEfyABBRAGDQJBoAgoAgALQaQIKAIAIgFGDQBB4AgoAgBBCkYNAEGkCCABQQFqNgIAIAFBCjoAAAwBC0GQCCAAQQ9qQQFBtAgoAgARAABBAUcNACAALQAPGgsgAEEQaiQACwvYAgEHfyMAQSBrIgMkACADIAAoAhwiBDYCECAAKAIUIQUgAyACNgIcIAMgATYCGCADIAUgBGsiATYCFCABIAJqIQUgA0EQaiEBQQIhBwJ/AkACQAJAIAAoAjwgAUECIANBDGoQARAMBEAgASEEDAELA0AgBSADKAIMIgZGDQIgBkEASARAIAEhBAwECyABQQhBACAGIAEoAgQiCEsiCRtqIgQgBiAIQQAgCRtrIgggBCgCAGo2AgAgAUEMQQQgCRtqIgEgASgCACAIazYCACAFIAZrIQUgACgCPCAEIgEgByAJayIHIANBDGoQARAMRQ0ACwsgBUF/Rw0BCyAAIAAoAiwiATYCHCAAIAE2AhQgACABIAAoAjBqNgIQIAIMAQsgAEEANgIcIABCADcDECAAIAAoAgBBIHI2AgBBACAHQQJGDQAaIAIgBCgCBGsLIQEgA0EgaiQAIAELBABBAAsEAEIACxUAIABFBEBBAA8LQbAJIAA2AgBBfwsGACAAJAALEAAjACAAa0FwcSIAJAAgAAsEACMACwtPBwBBgAgLDFRoaXMgaXMgV0FTTQBBkAgLAQUAQZwICwECAEG0CAsOAwAAAAQAAADIBAAAAAQAQcwICwEBAEHcCAsF/////woAQaAJCwIQBA==$$
1 row in set (0.0002 sec)

mysql> SHOW CREATE LIBRARY wasmlib.lib2\G
*************************** 1. row ***************************
       Library: lib2
      sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION
Create Library: CREATE LIBRARY `lib2`
    LANGUAGE WASM
AS 0x
1 row in set (0.000 sec)
```

For further information and examples, see Section 27.3.8, “Using JavaScript Libraries”.


#### 15.7.7.11 SHOW CREATE PROCEDURE Statement

```
SHOW CREATE PROCEDURE proc_name
```

This statement is a MySQL extension. It returns the exact string that can be used to re-create the named stored procedure. A similar statement, [`SHOW CREATE FUNCTION`](show-create-function.html "15.7.7.9 SHOW CREATE FUNCTION Statement"), displays information about stored functions (see Section 15.7.7.9, “SHOW CREATE FUNCTION Statement”).

To use either statement, you must be the user named as the routine `DEFINER`, have the `SHOW_ROUTINE` privilege, have the `SELECT` privilege at the global level, or have the [`CREATE ROUTINE`](privileges-provided.html#priv_create-routine), `ALTER ROUTINE`, or `EXECUTE` privilege granted at a scope that includes the routine. The value displayed for the `Create Procedure` or `Create Function` field is `NULL` if you have only `CREATE ROUTINE`, `ALTER ROUTINE`, or `EXECUTE`.

```
mysql> SHOW CREATE PROCEDURE test.citycount\G
*************************** 1. row ***************************
           Procedure: citycount
            sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
                      NO_ZERO_IN_DATE,NO_ZERO_DATE,
                      ERROR_FOR_DIVISION_BY_ZERO,
                      NO_ENGINE_SUBSTITUTION
    Create Procedure: CREATE DEFINER=`me`@`localhost`
                      PROCEDURE `citycount`(IN country CHAR(3), OUT cities INT)
                      BEGIN
                        SELECT COUNT(*) INTO cities FROM world.city
                        WHERE CountryCode = country;
                      END
character_set_client: utf8mb4
collation_connection: utf8mb4_0900_ai_ci
  Database Collation: utf8mb4_0900_ai_ci

mysql> SHOW CREATE FUNCTION test.hello\G
*************************** 1. row ***************************
            Function: hello
            sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
                      NO_ZERO_IN_DATE,NO_ZERO_DATE,
                      ERROR_FOR_DIVISION_BY_ZERO,
                      NO_ENGINE_SUBSTITUTION
     Create Function: CREATE DEFINER=`me`@`localhost`
                      FUNCTION `hello`(s CHAR(20))
                      RETURNS char(50) CHARSET utf8mb4
                      DETERMINISTIC
                      RETURN CONCAT('Hello, ',s,'!')
character_set_client: utf8mb4
collation_connection: utf8mb4_0900_ai_ci
  Database Collation: utf8mb4_0900_ai_ci
```

`character_set_client` is the session value of the `character_set_client` system variable when the routine was created. `collation_connection` is the session value of the `collation_connection` system variable when the routine was created. `Database Collation` is the collation of the database with which the routine is associated.

For a JavaScript stored routine that was created with `USING` to import one or more libraries, the full list of libraries is included in the output of `SHOW CREATE PROCEDURE`, even for libraries listed which do not actually exist. This is true also for `SHOW CREATE FUNCTION`.


#### 15.7.7.12 SHOW CREATE TABLE Statement

```
SHOW CREATE TABLE tbl_name
```

Shows the `CREATE TABLE` statement that creates the named table. To use this statement, you must have some privilege for the table. This statement also works with views.

```
mysql> SHOW CREATE TABLE t\G
*************************** 1. row ***************************
       Table: t
Create Table: CREATE TABLE `t` (
  `id` int NOT NULL AUTO_INCREMENT,
  `s` char(60) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

`SHOW CREATE TABLE` displays all `CHECK` constraints as table constraints. That is, a `CHECK` constraint originally specified as part of a column definition displays as a separate clause not part of the column definition. Example:

```
mysql> CREATE TABLE t1 (
         i1 INT CHECK (i1 <> 0),      -- column constraint
         i2 INT,
         CHECK (i2 > i1),             -- table constraint
         CHECK (i2 <> 0) NOT ENFORCED -- table constraint, not enforced
       );

mysql> SHOW CREATE TABLE t1\G
*************************** 1. row ***************************
       Table: t1
Create Table: CREATE TABLE `t1` (
  `i1` int DEFAULT NULL,
  `i2` int DEFAULT NULL,
  CONSTRAINT `t1_chk_1` CHECK ((`i1` <> 0)),
  CONSTRAINT `t1_chk_2` CHECK ((`i2` > `i1`)),
  CONSTRAINT `t1_chk_3` CHECK ((`i2` <> 0)) /*!80016 NOT ENFORCED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
```

`SHOW CREATE TABLE` quotes table and column names according to the value of the `sql_quote_show_create` option. See Section 7.1.8, “Server System Variables”.

When altering the storage engine of a table, table options that are not applicable to the new storage engine are retained in the table definition to enable reverting the table with its previously defined options to the original storage engine, if necessary. For example, when changing the storage engine from `InnoDB` to `MyISAM`, options specific to `InnoDB`, such as `ROW_FORMAT=COMPACT`, are retained, as shown here:

```
mysql> CREATE TABLE t1 (c1 INT PRIMARY KEY) ROW_FORMAT=COMPACT ENGINE=InnoDB;
mysql> ALTER TABLE t1 ENGINE=MyISAM;
mysql> SHOW CREATE TABLE t1\G
*************************** 1. row ***************************
       Table: t1
Create Table: CREATE TABLE `t1` (
  `c1` int NOT NULL,
  PRIMARY KEY (`c1`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=COMPACT
```

When creating a table with strict mode disabled, the storage engine's default row format is used if the specified row format is not supported. The actual row format of the table is reported in the `Row_format` column in response to [`SHOW TABLE STATUS`](show-table-status.html "15.7.7.39 SHOW TABLE STATUS Statement"). [`SHOW CREATE TABLE`](show-create-table.html "15.7.7.12 SHOW CREATE TABLE Statement") shows the row format that was specified in the `CREATE TABLE` statement.

`SHOW CREATE TABLE` also includes the definition of the table's generated invisible primary key, if it has such a key, by default. You can cause this information to be suppressed in the statement's output by setting [`show_gipk_in_create_table_and_information_schema = OFF`](server-system-variables.html#sysvar_show_gipk_in_create_table_and_information_schema). For more information, see Section 15.1.24.11, “Generated Invisible Primary Keys”.


#### 15.7.7.13 SHOW CREATE TRIGGER Statement

```
SHOW CREATE TRIGGER trigger_name
```

This statement shows the [`CREATE TRIGGER`](create-trigger.html "15.1.26 CREATE TRIGGER Statement") statement that creates the named trigger. This statement requires the `TRIGGER` privilege for the table associated with the trigger.

```
mysql> SHOW CREATE TRIGGER ins_sum\G
*************************** 1. row ***************************
               Trigger: ins_sum
              sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
                        NO_ZERO_IN_DATE,NO_ZERO_DATE,
                        ERROR_FOR_DIVISION_BY_ZERO,
                        NO_ENGINE_SUBSTITUTION
SQL Original Statement: CREATE DEFINER=`me`@`localhost` TRIGGER `ins_sum`
                        BEFORE INSERT ON `account`
                        FOR EACH ROW SET @sum = @sum + NEW.amount
  character_set_client: utf8mb4
  collation_connection: utf8mb4_0900_ai_ci
    Database Collation: utf8mb4_0900_ai_ci
               Created: 2018-08-08 10:10:12.61
```

`SHOW CREATE TRIGGER` output has these columns:

* `Trigger`: The trigger name.
* `sql_mode`: The SQL mode in effect when the trigger executes.

* `SQL Original Statement`: The `CREATE TRIGGER` statement that defines the trigger.

* `character_set_client`: The session value of the `character_set_client` system variable when the trigger was created.

* `collation_connection`: The session value of the `collation_connection` system variable when the trigger was created.

* `Database Collation`: The collation of the database with which the trigger is associated.

* `Created`: The date and time when the trigger was created. This is a `TIMESTAMP(2)` value (with a fractional part in hundredths of seconds) for triggers.

Trigger information is also available from the `INFORMATION_SCHEMA` `TRIGGERS` table. See Section 28.3.50, “The INFORMATION\_SCHEMA TRIGGERS Table”.


#### 15.7.7.14 SHOW CREATE USER Statement

```
SHOW CREATE USER user
```

This statement shows the [`CREATE USER`](create-user.html "15.7.1.3 CREATE USER Statement") statement that creates the named user. An error occurs if the user does not exist. The statement requires the `SELECT` privilege for the `mysql` system schema, except to see information for the current user. For the current user, the `SELECT` privilege for the `mysql.user` system table is required for display of the password hash in the `IDENTIFIED AS` clause; otherwise, the hash displays as `<secret>`.

To name the account, use the format described in Section 8.2.4, “Specifying Account Names”. The host name part of the account name, if omitted, defaults to `'%'`. It is also possible to specify `CURRENT_USER` or `CURRENT_USER()` to refer to the account associated with the current session.

Password hash values displayed in the `IDENTIFIED WITH` clause of output from [`SHOW CREATE USER`](show-create-user.html "15.7.7.14 SHOW CREATE USER Statement") may contain unprintable characters that have adverse effects on terminal displays and in other environments. Enabling the `print_identified_with_as_hex` system variable causes [`SHOW CREATE USER`](show-create-user.html "15.7.7.14 SHOW CREATE USER Statement") to display such hash values as hexadecimal strings rather than as regular string literals. Hash values that do not contain unprintable characters still display as regular string literals, even with this variable enabled.

```
mysql> CREATE USER 'u1'@'localhost' IDENTIFIED BY 'secret';
mysql> SET print_identified_with_as_hex = ON;
mysql> SHOW CREATE USER 'u1'@'localhost'\G
*************************** 1. row ***************************
CREATE USER for u1@localhost: CREATE USER `u1`@`localhost`
IDENTIFIED WITH 'caching_sha2_password'
AS 0x244124303035240C7745603626313D613C4C10633E0A104B1E14135A544A7871567245614F4872344643546336546F624F6C7861326932752F45622F4F473273597557627139
REQUIRE NONE PASSWORD EXPIRE DEFAULT ACCOUNT UNLOCK
PASSWORD HISTORY DEFAULT PASSWORD REUSE INTERVAL DEFAULT
PASSWORD REQUIRE CURRENT DEFAULT
```

To display the privileges granted to an account, use the `SHOW GRANTS` statement. See Section 15.7.7.23, “SHOW GRANTS Statement”.


#### 15.7.7.15 SHOW CREATE VIEW Statement

```
SHOW CREATE VIEW view_name
```

This statement shows the [`CREATE VIEW`](create-view.html "15.1.27 CREATE VIEW Statement") statement that creates the named view.

```
mysql> SHOW CREATE VIEW v\G
*************************** 1. row ***************************
                View: v
         Create View: CREATE ALGORITHM=UNDEFINED
                      DEFINER=`bob`@`localhost`
                      SQL SECURITY DEFINER VIEW
                      `v` AS select 1 AS `a`,2 AS `b`
character_set_client: utf8mb4
collation_connection: utf8mb4_0900_ai_ci
```

`character_set_client` is the session value of the `character_set_client` system variable when the view was created. `collation_connection` is the session value of the `collation_connection` system variable when the view was created.

Use of `SHOW CREATE VIEW` requires the `SHOW VIEW` privilege, and the `SELECT` privilege for the view in question.

View information is also available from the `INFORMATION_SCHEMA` `VIEWS` table. See Section 28.3.53, “The INFORMATION\_SCHEMA VIEWS Table”.

This statement also works to show the `CREATE JSON DUALITY VIEW` statement required to create a JSON duality view. You can also obtain information about JSON duality views from the `INFORMATION_SCHEMA` tables `JSON_DUALITY_VIEWS`, `JSON_DUALITY_VIEW_COLUMNS`, `JSON_DUALITY_VIEW_LINKS`, and `JSON_DUALITY_VIEW_TABLES`. See also Section 27.7.3, “JSON Duality View Metadata”.

The following example shows the [`SHOW CREATE VIEW`](show-create-view.html "15.7.7.15 SHOW CREATE VIEW Statement") statement used to create a JSON duality view:

```
mysql> SHOW CREATE VIEW order_dv\G
*************************** 1. row ***************************
                View: order_dv
         Create View: CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER JSON RELATIONAL DUALITY VIEW `order_dv`
                      AS select json_duality_object( WITH (INSERT,UPDATE,DELETE) '_id':`orders`.`order_id`,'product':`orders`.`product`,'amount':`orders`.`amount`,'customer':
                      (select json_duality_object( WITH (INSERT,UPDATE) 'customer_id':`customers`.`customer_id`,'customer_name':`customers`.`name`)
                      from `customers` where (`customers`.`customer_id` = `orders`.`customer_id`))) AS `Name_exp_1` from `orders`
character_set_client: utf8mb4
collation_connection: utf8mb4_0900_ai_ci
1 row in set (0.002 sec)
```

MySQL lets you use different `sql_mode` settings to tell the server the type of SQL syntax to support. For example, you might use the `ANSI` SQL mode to ensure MySQL correctly interprets the standard SQL concatenation operator, the double bar (`||`), in your queries. If you then create a view that concatenates items, you might worry that changing the `sql_mode` setting to a value different from `ANSI` could cause the view to become invalid. But this is not the case. No matter how you write out a view definition, MySQL always stores it the same way, in a canonical form. Here is an example that shows how the server changes a double bar concatenation operator to a `CONCAT()` function:

```
mysql> SET sql_mode = 'ANSI';
Query OK, 0 rows affected (0.00 sec)

mysql> CREATE VIEW test.v AS SELECT 'a' || 'b' as col1;
Query OK, 0 rows affected (0.01 sec)

mysql> SHOW CREATE VIEW test.v\G
*************************** 1. row ***************************
                View: v
         Create View: CREATE VIEW "v" AS select concat('a','b') AS "col1"
...
1 row in set (0.00 sec)
```

The advantage of storing a view definition in canonical form is that changes made later to the value of `sql_mode` do not affect the results from the view. However an additional consequence is that comments prior to `SELECT` are stripped from the definition by the server.


#### 15.7.7.16 SHOW DATABASES Statement

```
SHOW {DATABASES | SCHEMAS}
    [LIKE 'pattern' | WHERE expr]
```

`SHOW DATABASES` lists the databases on the MySQL server host. [`SHOW SCHEMAS`](show-databases.html "15.7.7.16 SHOW DATABASES Statement") is a synonym for [`SHOW DATABASES`](show-databases.html "15.7.7.16 SHOW DATABASES Statement"). The `LIKE` clause, if present, indicates which database names to match. The `WHERE` clause can be given to select rows using more general conditions, as discussed in Section 28.8, “Extensions to SHOW Statements”.

You see only those databases for which you have some kind of privilege, unless you have the global [`SHOW DATABASES`](show-databases.html "15.7.7.16 SHOW DATABASES Statement") privilege. You can also get this list using the **mysqlshow** command.

If the server was started with the `--skip-show-database` option, you cannot use this statement at all unless you have the `SHOW DATABASES` privilege.

MySQL implements databases as directories in the data directory, so this statement simply lists directories in that location. However, the output may include names of directories that do not correspond to actual databases.

Database information is also available from the `INFORMATION_SCHEMA` `SCHEMATA` table. See Section 28.3.37, “The INFORMATION\_SCHEMA SCHEMATA Table”.

Caution

Because any static global privilege is considered a privilege for all databases, any static global privilege enables a user to see all database names with [`SHOW DATABASES`](show-databases.html "15.7.7.16 SHOW DATABASES Statement") or by examining the `SCHEMATA` table of `INFORMATION_SCHEMA`, except databases that have been restricted at the database level by partial revokes.


#### 15.7.7.17 SHOW ENGINE Statement

```
SHOW ENGINE engine_name {STATUS | MUTEX}
```

`SHOW ENGINE` displays operational information about a storage engine. It requires the `PROCESS` privilege. The statement has these variants:

```
SHOW ENGINE INNODB STATUS
SHOW ENGINE INNODB MUTEX
SHOW ENGINE PERFORMANCE_SCHEMA STATUS
```

`SHOW ENGINE INNODB STATUS` displays extensive information from the standard `InnoDB` Monitor about the state of the `InnoDB` storage engine. For information about the standard monitor and other `InnoDB` Monitors that provide information about `InnoDB` processing, see Section 17.17, “InnoDB Monitors”.

`SHOW ENGINE INNODB MUTEX` displays `InnoDB` mutex and rw-lock statistics.

Note

`InnoDB` mutexes and rwlocks can also be monitored using [Performance Schema](performance-schema.html "Chapter 29 MySQL Performance Schema") tables. See Section 17.16.2, “Monitoring InnoDB Mutex Waits Using Performance Schema”.

Mutex statistics collection is configured dynamically using the following options:

* To enable the collection of mutex statistics, run:

  ```
  SET GLOBAL innodb_monitor_enable='latch';
  ```

* To reset mutex statistics, run:

  ```
  SET GLOBAL innodb_monitor_reset='latch';
  ```

* To disable the collection of mutex statistics, run:

  ```
  SET GLOBAL innodb_monitor_disable='latch';
  ```

Collection of mutex statistics for `SHOW ENGINE INNODB MUTEX` can also be enabled by setting `innodb_monitor_enable='all'`, or disabled by setting `innodb_monitor_disable='all'`.

`SHOW ENGINE INNODB MUTEX` output has these columns:

* `Type`

  Always `InnoDB`.

* `Name`

  For mutexes, the `Name` field reports only the mutex name. For rwlocks, the `Name` field reports the source file where the rwlock is implemented, and the line number in the file where the rwlock is created. The line number is specific to your version of MySQL.

* `Status`

  The mutex status. This field reports the number of spins, waits, and calls. Statistics for low-level operating system mutexes, which are implemented outside of `InnoDB`, are not reported.

  + `spins` indicates the number of spins.
  + `waits` indicates the number of mutex waits.

  + `calls` indicates how many times the mutex was requested.

`SHOW ENGINE INNODB MUTEX` does not list mutexes and rw-locks for each buffer pool block, as the amount of output would be overwhelming on systems with a large buffer pool. `SHOW ENGINE INNODB MUTEX` does, however, print aggregate `BUF_BLOCK_MUTEX` spin, wait, and call values for buffer pool block mutexes and rw-locks. `SHOW ENGINE INNODB MUTEX` also does not list any mutexes or rw-locks that have never been waited on (`os_waits=0`). Thus, `SHOW ENGINE INNODB MUTEX` only displays information about mutexes and rw-locks outside of the buffer pool that have caused at least one OS-level wait.

Use `SHOW ENGINE PERFORMANCE_SCHEMA STATUS` to inspect the internal operation of the Performance Schema code:

```
mysql> SHOW ENGINE PERFORMANCE_SCHEMA STATUS\G
...
*************************** 3. row ***************************
  Type: performance_schema
  Name: events_waits_history.size
Status: 76
*************************** 4. row ***************************
  Type: performance_schema
  Name: events_waits_history.count
Status: 10000
*************************** 5. row ***************************
  Type: performance_schema
  Name: events_waits_history.memory
Status: 760000
...
*************************** 57. row ***************************
  Type: performance_schema
  Name: performance_schema.memory
Status: 26459600
...
```

This statement is intended to help the DBA understand the effects that different Performance Schema options have on memory requirements.

`Name` values consist of two parts, which name an internal buffer and a buffer attribute, respectively. Interpret buffer names as follows:

* An internal buffer that is not exposed as a table is named within parentheses. Examples: `(pfs_cond_class).size`, `(pfs_mutex_class).memory`.

* An internal buffer that is exposed as a table in the `performance_schema` database is named after the table, without parentheses. Examples: `events_waits_history.size`, `mutex_instances.count`.

* A value that applies to the Performance Schema as a whole begins with `performance_schema`. Example: `performance_schema.memory`.

Buffer attributes have these meanings:

* `size` is the size of the internal record used by the implementation, such as the size of a row in a table. `size` values cannot be changed.

* `count` is the number of internal records, such as the number of rows in a table. `count` values can be changed using Performance Schema configuration options.

* For a table, `tbl_name.memory` is the product of `size` and `count`. For the Performance Schema as a whole, `performance_schema.memory` is the sum of all the memory used (the sum of all other `memory` values).

In some cases, there is a direct relationship between a Performance Schema configuration parameter and a `SHOW ENGINE` value. For example, `events_waits_history_long.count` corresponds to `performance_schema_events_waits_history_long_size`. In other cases, the relationship is more complex. For example, `events_waits_history.count` corresponds to `performance_schema_events_waits_history_size` (the number of rows per thread) multiplied by `performance_schema_max_thread_instances` (the number of threads).

**SHOW ENGINE NDB STATUS.** If the server has the `NDB` storage engine enabled, `SHOW ENGINE NDB STATUS` displays cluster status information such as the number of connected data nodes, the cluster connectstring, and cluster binary log epochs, as well as counts of various Cluster API objects created by the MySQL Server when connected to the cluster. Sample output from this statement is shown here:

```
mysql> SHOW ENGINE NDB STATUS;
+------------+-----------------------+--------------------------------------------------+
| Type       | Name                  | Status                                           |
+------------+-----------------------+--------------------------------------------------+
| ndbcluster | connection            | cluster_node_id=7,
  connected_host=198.51.100.103, connected_port=1186, number_of_data_nodes=4,
  number_of_ready_data_nodes=3, connect_count=0                                         |
| ndbcluster | NdbTransaction        | created=6, free=0, sizeof=212                    |
| ndbcluster | NdbOperation          | created=8, free=8, sizeof=660                    |
| ndbcluster | NdbIndexScanOperation | created=1, free=1, sizeof=744                    |
| ndbcluster | NdbIndexOperation     | created=0, free=0, sizeof=664                    |
| ndbcluster | NdbRecAttr            | created=1285, free=1285, sizeof=60               |
| ndbcluster | NdbApiSignal          | created=16, free=16, sizeof=136                  |
| ndbcluster | NdbLabel              | created=0, free=0, sizeof=196                    |
| ndbcluster | NdbBranch             | created=0, free=0, sizeof=24                     |
| ndbcluster | NdbSubroutine         | created=0, free=0, sizeof=68                     |
| ndbcluster | NdbCall               | created=0, free=0, sizeof=16                     |
| ndbcluster | NdbBlob               | created=1, free=1, sizeof=264                    |
| ndbcluster | NdbReceiver           | created=4, free=0, sizeof=68                     |
| ndbcluster | binlog                | latest_epoch=155467, latest_trans_epoch=148126,
  latest_received_binlog_epoch=0, latest_handled_binlog_epoch=0,
  latest_applied_binlog_epoch=0                                                         |
+------------+-----------------------+--------------------------------------------------+
```

The `Status` column in each of these rows provides information about the MySQL server's connection to the cluster and about the cluster binary log's status, respectively. The `Status` information is in the form of comma-delimited set of name-value pairs.

The `connection` row's `Status` column contains the name-value pairs described in the following table.

<table summary="Name and value pairs found in the connection row Status column in the output of the SHOW ENGINE NDB STATUS statement."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Name</th> <th>Value</th> </tr></thead><tbody><tr> <td><code class="literal">cluster_node_id</code></td> <td>The node ID of the MySQL server in the cluster</td> </tr><tr> <td><code class="literal">connected_host</code></td> <td>The host name or IP address of the cluster management server to which the MySQL server is connected</td> </tr><tr> <td><code class="literal">connected_port</code></td> <td>The port used by the MySQL server to connect to the management server (<code class="literal">connected_host</code>)</td> </tr><tr> <td><code class="literal">number_of_data_nodes</code></td> <td>The number of data nodes configured for the cluster (that is, the number of <code class="literal">[ndbd]</code> sections in the cluster <code class="filename">config.ini</code> file)</td> </tr><tr> <td><code class="literal">number_of_ready_data_nodes</code></td> <td>The number of data nodes in the cluster that are actually running</td> </tr><tr> <td><code class="literal">connect_count</code></td> <td>The number of times this <a class="link" href="mysqld.html" title="6.3.1 mysqld — The MySQL Server"><span class="command"><strong>mysqld</strong></span></a> has connected or reconnected to cluster data nodes</td> </tr></tbody></table>

The `binlog` row's `Status` column contains information relating to NDB Cluster Replication. The name-value pairs it contains are described in the following table.

<table summary="Name and value pairs found in the binlog row Status column in the output of the SHOW ENGINE NDB STATUS statement."><col style="width: 40%"/><col style="width: 60%"/><thead><tr> <th>Name</th> <th>Value</th> </tr></thead><tbody><tr> <td><code class="literal">latest_epoch</code></td> <td>The most recent epoch most recently run on this MySQL server (that is, the sequence number of the most recent transaction run on the server)</td> </tr><tr> <td><code class="literal">latest_trans_epoch</code></td> <td>The most recent epoch processed by the cluster's data nodes</td> </tr><tr> <td><code class="literal">latest_received_binlog_epoch</code></td> <td>The most recent epoch received by the binary log thread</td> </tr><tr> <td><code class="literal">latest_handled_binlog_epoch</code></td> <td>The most recent epoch processed by the binary log thread (for writing to the binary log)</td> </tr><tr> <td><code class="literal">latest_applied_binlog_epoch</code></td> <td>The most recent epoch actually written to the binary log</td> </tr></tbody></table>

See Section 25.7, “NDB Cluster Replication”, for more information.

The remaining rows from the output of `SHOW ENGINE NDB STATUS` which are most likely to prove useful in monitoring the cluster are listed here by `Name`:

* `NdbTransaction`: The number and size of `NdbTransaction` objects that have been created. An `NdbTransaction` is created each time a table schema operation (such as `CREATE TABLE` or `ALTER TABLE`) is performed on an `NDB` table.

* `NdbOperation`: The number and size of `NdbOperation` objects that have been created.

* `NdbIndexScanOperation`: The number and size of `NdbIndexScanOperation` objects that have been created.

* `NdbIndexOperation`: The number and size of `NdbIndexOperation` objects that have been created.

* `NdbRecAttr`: The number and size of `NdbRecAttr` objects that have been created. In general, one of these is created each time a data manipulation statement is performed by an SQL node.

* `NdbBlob`: The number and size of `NdbBlob` objects that have been created. An `NdbBlob` is created for each new operation involving a `BLOB` column in an `NDB` table.

* `NdbReceiver`: The number and size of any `NdbReceiver` object that have been created. The number in the `created` column is the same as the number of data nodes in the cluster to which the MySQL server has connected.

Note

`SHOW ENGINE NDB STATUS` returns an empty result if no operations involving `NDB` tables have been performed during the current session by the MySQL client accessing the SQL node on which this statement is run.


#### 15.7.7.18 SHOW ENGINES Statement

```
SHOW [STORAGE] ENGINES
```

`SHOW ENGINES` displays status information about the server's storage engines. This is particularly useful for checking whether a storage engine is supported, or to see what the default engine is.

For information about MySQL storage engines, see Chapter 17, *The InnoDB Storage Engine*, and Chapter 18, *Alternative Storage Engines*.

```
mysql> SHOW ENGINES\G
*************************** 1. row ***************************
      Engine: MEMORY
     Support: YES
     Comment: Hash based, stored in memory, useful for temporary tables
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 2. row ***************************
      Engine: InnoDB
     Support: DEFAULT
     Comment: Supports transactions, row-level locking, and foreign keys
Transactions: YES
          XA: YES
  Savepoints: YES
*************************** 3. row ***************************
      Engine: PERFORMANCE_SCHEMA
     Support: YES
     Comment: Performance Schema
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 4. row ***************************
      Engine: MyISAM
     Support: YES
     Comment: MyISAM storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 5. row ***************************
      Engine: MRG_MYISAM
     Support: YES
     Comment: Collection of identical MyISAM tables
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 6. row ***************************
      Engine: BLACKHOLE
     Support: YES
     Comment: /dev/null storage engine (anything you write to it disappears)
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 7. row ***************************
      Engine: CSV
     Support: YES
     Comment: CSV storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
*************************** 8. row ***************************
      Engine: ARCHIVE
     Support: YES
     Comment: Archive storage engine
Transactions: NO
          XA: NO
  Savepoints: NO
```

The output from `SHOW ENGINES` may vary according to the MySQL version used and other factors.

`SHOW ENGINES` output has these columns:

* `Engine`

  The name of the storage engine.

* `Support`

  The server's level of support for the storage engine, as shown in the following table.

  <table summary="Values for the Support column in the output of the SHOW ENGINES statement."><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Value</th> <th>Meaning</th> </tr></thead><tbody><tr> <td><code class="literal">YES</code></td> <td>The engine is supported and is active</td> </tr><tr> <td><code class="literal">DEFAULT</code></td> <td>Like <code class="literal">YES</code>, plus this is the default engine</td> </tr><tr> <td><code class="literal">NO</code></td> <td>The engine is not supported</td> </tr><tr> <td><code class="literal">DISABLED</code></td> <td>The engine is supported but has been disabled</td> </tr></tbody></table>

  A value of `NO` means that the server was compiled without support for the engine, so it cannot be enabled at runtime.

  A value of `DISABLED` occurs either because the server was started with an option that disables the engine, or because not all options required to enable it were given. In the latter case, the error log should contain a reason indicating why the option is disabled. See Section 7.4.2, “The Error Log”.

  You might also see `DISABLED` for a storage engine if the server was compiled to support it, but was started with a `--skip-engine_name` option. For the `NDB` storage engine, `DISABLED` means the server was compiled with support for NDB Cluster, but was not started with the `--ndbcluster` option.

  All MySQL servers support `MyISAM` tables. It is not possible to disable `MyISAM`.

* `Comment`

  A brief description of the storage engine.

* `Transactions`

  Whether the storage engine supports transactions.

* `XA`

  Whether the storage engine supports XA transactions.

* `Savepoints`

  Whether the storage engine supports savepoints.

Storage engine information is also available from the `INFORMATION_SCHEMA` `ENGINES` table. See Section 28.3.13, “The INFORMATION\_SCHEMA ENGINES Table”.


#### 15.7.7.19 SHOW ERRORS Statement

```
SHOW ERRORS [LIMIT [offset,] row_count]
SHOW COUNT(*) ERRORS
```

`SHOW ERRORS` is a diagnostic statement that is similar to [`SHOW WARNINGS`](show-warnings.html "15.7.7.43 SHOW WARNINGS Statement"), except that it displays information only for errors, rather than for errors, warnings, and notes.

The `LIMIT` clause has the same syntax as for the `SELECT` statement. See Section 15.2.13, “SELECT Statement”.

The [`SHOW COUNT(*) ERRORS`](show-errors.html "15.7.7.19 SHOW ERRORS Statement") statement displays the number of errors. You can also retrieve this number from the `error_count` variable:

```
SHOW COUNT(*) ERRORS;
SELECT @@error_count;
```

`SHOW ERRORS` and `error_count` apply only to errors, not warnings or notes. In other respects, they are similar to `SHOW WARNINGS` and `warning_count`. In particular, `SHOW ERRORS` cannot display information for more than `max_error_count` messages, and `error_count` can exceed the value of `max_error_count` if the number of errors exceeds `max_error_count`.

For more information, see Section 15.7.7.43, “SHOW WARNINGS Statement”.


#### 15.7.7.20 SHOW EVENTS Statement

```
SHOW EVENTS
    [{FROM | IN} schema_name]
    [LIKE 'pattern' | WHERE expr]
```

This statement displays information about Event Manager events, which are discussed in Section 27.5, “Using the Event Scheduler”. It requires the `EVENT` privilege for the database from which the events are to be shown.

In its simplest form, `SHOW EVENTS` lists all of the events in the current schema:

```
mysql> SELECT CURRENT_USER(), SCHEMA();
+----------------+----------+
| CURRENT_USER() | SCHEMA() |
+----------------+----------+
| jon@ghidora    | myschema |
+----------------+----------+
1 row in set (0.00 sec)

mysql> SHOW EVENTS\G
*************************** 1. row ***************************
                  Db: myschema
                Name: e_daily
             Definer: jon@ghidora
           Time zone: SYSTEM
                Type: RECURRING
          Execute at: NULL
      Interval value: 1
      Interval field: DAY
              Starts: 2018-08-08 11:06:34
                Ends: NULL
              Status: ENABLED
          Originator: 1
character_set_client: utf8mb4
collation_connection: utf8mb4_0900_ai_ci
  Database Collation: utf8mb4_0900_ai_ci
```

To see events for a specific schema, use the `FROM` clause. For example, to see events for the `test` schema, use the following statement:

```
SHOW EVENTS FROM test;
```

The `LIKE` clause, if present, indicates which event names to match. The `WHERE` clause can be given to select rows using more general conditions, as discussed in Section 28.8, “Extensions to SHOW Statements”.

`SHOW EVENTS` output has these columns:

* `Db`

  The name of the schema (database) to which the event belongs.

* `Name`

  The name of the event.

* `Definer`

  The account of the user who created the event, in `'user_name'@'host_name'` format.

* `Time zone`

  The event time zone, which is the time zone used for scheduling the event and that is in effect within the event as it executes. The default value is `SYSTEM`.

* `Type`

  The event repetition type, either `ONE TIME` (transient) or `RECURRING` (repeating).

* `Execute At`

  For a one-time event, this is the `DATETIME` value specified in the `AT` clause of the `CREATE EVENT` statement used to create the event, or of the last `ALTER EVENT` statement that modified the event. The value shown in this column reflects the addition or subtraction of any `INTERVAL` value included in the event's `AT` clause. For example, if an event is created using `ON SCHEDULE AT CURRENT_TIMESTAMP + '1:6' DAY_HOUR`, and the event was created at 2018-02-09 14:05:30, the value shown in this column would be `'2018-02-10 20:05:30'`. If the event's timing is determined by an `EVERY` clause instead of an `AT` clause (that is, if the event is recurring), the value of this column is `NULL`.

* `Interval Value`

  For a recurring event, the number of intervals to wait between event executions. For a transient event, the value of this column is always `NULL`.

* `Interval Field`

  The time units used for the interval which a recurring event waits before repeating. For a transient event, the value of this column is always `NULL`.

* `Starts`

  The start date and time for a recurring event. This is displayed as a `DATETIME` value, and is `NULL` if no start date and time are defined for the event. For a transient event, this column is always `NULL`. For a recurring event whose definition includes a `STARTS` clause, this column contains the corresponding `DATETIME` value. As with the `Execute At` column, this value resolves any expressions used. If there is no `STARTS` clause affecting the timing of the event, this column is `NULL`

* `Ends`

  For a recurring event whose definition includes a `ENDS` clause, this column contains the corresponding `DATETIME` value. As with the `Execute At` column, this value resolves any expressions used. If there is no `ENDS` clause affecting the timing of the event, this column is `NULL`.

* `Status`

  The event status. One of `ENABLED`, `DISABLED`, or `REPLICA_SIDE_DISABLED`. `REPLICA_SIDE_DISABLED` indicates that the creation of the event occurred on another MySQL server acting as a replication source and replicated to the current MySQL server which is acting as a replica, but the event is not presently being executed on the replica. For more information, see Section 19.5.1.16, “Replication of Invoked Features”. information.

  `REPLICA_SIDE_DISABLED` replaces `SLAVESIDE_DISABLED`, which is now deprecated and subject to removal in a future version of MySQL.

* `Originator`

  The server ID of the MySQL server on which the event was created; used in replication. This value may be updated by `ALTER EVENT` to the server ID of the server on which that statement occurs, if executed on a source server. The default value is 0.

* `character_set_client`

  The session value of the `character_set_client` system variable when the event was created.

* `collation_connection`

  The session value of the `collation_connection` system variable when the event was created.

* `Database Collation`

  The collation of the database with which the event is associated.

For more information about `REPLICA_SIDE_DISABLED` and the `Originator` column, see Section 19.5.1.16, “Replication of Invoked Features”.

Times displayed by `SHOW EVENTS` are given in the event time zone, as discussed in Section 27.5.4, “Event Metadata”.

Event information is also available from the `INFORMATION_SCHEMA` `EVENTS` table. See Section 28.3.14, “The INFORMATION\_SCHEMA EVENTS Table”.

The event action statement is not shown in the output of `SHOW EVENTS`. Use `SHOW CREATE EVENT` or the `INFORMATION_SCHEMA` `EVENTS` table.


#### 15.7.7.21 SHOW FUNCTION CODE Statement

```
SHOW FUNCTION CODE func_name
```

This statement is similar to [`SHOW PROCEDURE CODE`](show-procedure-code.html "15.7.7.30 SHOW PROCEDURE CODE Statement") but for stored functions. See Section 15.7.7.30, “SHOW PROCEDURE CODE Statement”.


#### 15.7.7.22 SHOW FUNCTION STATUS Statement

```
SHOW FUNCTION STATUS
    [LIKE 'pattern' | WHERE expr]
```

This statement is similar to [`SHOW PROCEDURE STATUS`](show-procedure-status.html "15.7.7.31 SHOW PROCEDURE STATUS Statement") but for stored functions. See Section 15.7.7.31, “SHOW PROCEDURE STATUS Statement”.


#### 15.7.7.23 SHOW GRANTS Statement

```
SHOW GRANTS
    [FOR user_or_role
        [USING role [, role] ...]]

user_or_role: {
    user (see Section 8.2.4, “Specifying Account Names”)
  | role (see Section 8.2.5, “Specifying Role Names”.
}
```

This statement displays the privileges and roles that are assigned to a MySQL user account or role, in the form of `GRANT` statements that must be executed to duplicate the privilege and role assignments.

Note

To display nonprivilege information for MySQL accounts, use the `SHOW CREATE USER` statement. See Section 15.7.7.14, “SHOW CREATE USER Statement”.

`SHOW GRANTS` requires the `SELECT` privilege for the `mysql` system schema, except to display privileges and roles for the current user.

To name the account or role for [`SHOW GRANTS`](show-grants.html "15.7.7.23 SHOW GRANTS Statement"), use the same format as for the `GRANT` statement (for example, `'jeffrey'@'localhost'`):

```
mysql> SHOW GRANTS FOR 'jeffrey'@'localhost';
+------------------------------------------------------------------+
| Grants for jeffrey@localhost                                     |
+------------------------------------------------------------------+
| GRANT USAGE ON *.* TO `jeffrey`@`localhost`                      |
| GRANT SELECT, INSERT, UPDATE ON `db1`.* TO `jeffrey`@`localhost` |
+------------------------------------------------------------------+
```

The host part, if omitted, defaults to `'%'`. For additional information about specifying account and role names, see Section 8.2.4, “Specifying Account Names”, and Section 8.2.5, “Specifying Role Names”.

To display the privileges granted to the current user (the account you are using to connect to the server), you can use any of the following statements:

```
SHOW GRANTS;
SHOW GRANTS FOR CURRENT_USER;
SHOW GRANTS FOR CURRENT_USER();
```

If `SHOW GRANTS FOR CURRENT_USER` (or any equivalent syntax) is used in definer context, such as within a stored procedure that executes with definer rather than invoker privileges, the grants displayed are those of the definer and not the invoker.

In MySQL 9.5 compared to previous series, `SHOW GRANTS` no longer displays `ALL PRIVILEGES` in its global-privileges output because the meaning of `ALL PRIVILEGES` at the global level varies depending on which dynamic privileges are defined. Instead, `SHOW GRANTS` explicitly lists each granted global privilege:

```
mysql> SHOW GRANTS FOR 'root'@'localhost';
+---------------------------------------------------------------------+
| Grants for root@localhost                                           |
+---------------------------------------------------------------------+
| GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, RELOAD,         |
| SHUTDOWN, PROCESS, FILE, REFERENCES, INDEX, ALTER, SHOW DATABASES,  |
| SUPER, CREATE TEMPORARY TABLES, LOCK TABLES, EXECUTE, REPLICATION   |
| SLAVE, REPLICATION CLIENT, CREATE VIEW, SHOW VIEW, CREATE ROUTINE,  |
| ALTER ROUTINE, CREATE USER, EVENT, TRIGGER, CREATE TABLESPACE,      |
| CREATE ROLE, DROP ROLE ON *.* TO `root`@`localhost` WITH GRANT      |
| OPTION                                                              |
| GRANT PROXY ON ''@'' TO `root`@`localhost` WITH GRANT OPTION        |
+---------------------------------------------------------------------+
```

Applications that process [`SHOW GRANTS`](show-grants.html "15.7.7.23 SHOW GRANTS Statement") output should be adjusted accordingly.

At the global level, `GRANT OPTION` applies to all granted static global privileges if granted for any of them, but applies individually to granted dynamic privileges. `SHOW GRANTS` displays global privileges this way:

* One line listing all granted static privileges, if there are any, including `WITH GRANT OPTION` if appropriate.

* One line listing all granted dynamic privileges for which `GRANT OPTION` is granted, if there are any, including `WITH GRANT OPTION`.

* One line listing all granted dynamic privileges for which `GRANT OPTION` is not granted, if there are any, without `WITH GRANT OPTION`.

With the optional `USING` clause, `SHOW GRANTS` enables you to examine the privileges associated with roles for the user. Each role named in the `USING` clause must be granted to the user.

Suppose that user `u1` is assigned roles `r1` and `r2`, as follows:

```
CREATE ROLE 'r1', 'r2';
GRANT SELECT ON db1.* TO 'r1';
GRANT INSERT, UPDATE, DELETE ON db1.* TO 'r2';
CREATE USER 'u1'@'localhost' IDENTIFIED BY 'u1pass';
GRANT 'r1', 'r2' TO 'u1'@'localhost';
```

`SHOW GRANTS` without `USING` shows the granted roles:

```
mysql> SHOW GRANTS FOR 'u1'@'localhost';
+---------------------------------------------+
| Grants for u1@localhost                     |
+---------------------------------------------+
| GRANT USAGE ON *.* TO `u1`@`localhost`      |
| GRANT `r1`@`%`,`r2`@`%` TO `u1`@`localhost` |
+---------------------------------------------+
```

Adding a `USING` clause causes the statement to also display the privileges associated with each role named in the clause:

```
mysql> SHOW GRANTS FOR 'u1'@'localhost' USING 'r1';
+---------------------------------------------+
| Grants for u1@localhost                     |
+---------------------------------------------+
| GRANT USAGE ON *.* TO `u1`@`localhost`      |
| GRANT SELECT ON `db1`.* TO `u1`@`localhost` |
| GRANT `r1`@`%`,`r2`@`%` TO `u1`@`localhost` |
+---------------------------------------------+
mysql> SHOW GRANTS FOR 'u1'@'localhost' USING 'r2';
+-------------------------------------------------------------+
| Grants for u1@localhost                                     |
+-------------------------------------------------------------+
| GRANT USAGE ON *.* TO `u1`@`localhost`                      |
| GRANT INSERT, UPDATE, DELETE ON `db1`.* TO `u1`@`localhost` |
| GRANT `r1`@`%`,`r2`@`%` TO `u1`@`localhost`                 |
+-------------------------------------------------------------+
mysql> SHOW GRANTS FOR 'u1'@'localhost' USING 'r1', 'r2';
+---------------------------------------------------------------------+
| Grants for u1@localhost                                             |
+---------------------------------------------------------------------+
| GRANT USAGE ON *.* TO `u1`@`localhost`                              |
| GRANT SELECT, INSERT, UPDATE, DELETE ON `db1`.* TO `u1`@`localhost` |
| GRANT `r1`@`%`,`r2`@`%` TO `u1`@`localhost`                         |
+---------------------------------------------------------------------+
```

Note

A privilege granted to an account is always in effect, but a role is not. The active roles for an account can differ across and within sessions, depending on the value of the `activate_all_roles_on_login` system variable, the account default roles, and whether `SET ROLE` has been executed within a session.

MySQL supports partial revocation of global privileges, such that a global privilege can be restricted from applying to particular schemas (see Section 8.2.12, “Privilege Restriction Using Partial Revokes”). To indicate which global schema privileges have been revoked for particular schemas, `SHOW GRANTS` output includes `REVOKE` statements:

```
mysql> SET PERSIST partial_revokes = ON;
mysql> CREATE USER u1;
mysql> GRANT SELECT, INSERT, DELETE ON *.* TO u1;
mysql> REVOKE SELECT, INSERT ON mysql.* FROM u1;
mysql> REVOKE DELETE ON world.* FROM u1;
mysql> SHOW GRANTS FOR u1;
+--------------------------------------------------+
| Grants for u1@%                                  |
+--------------------------------------------------+
| GRANT SELECT, INSERT, DELETE ON *.* TO `u1`@`%`  |
| REVOKE SELECT, INSERT ON `mysql`.* FROM `u1`@`%` |
| REVOKE DELETE ON `world`.* FROM `u1`@`%`         |
+--------------------------------------------------+
```

`SHOW GRANTS` does not display privileges that are available to the named account but are granted to a different account. For example, if an anonymous account exists, the named account might be able to use its privileges, but `SHOW GRANTS` does not display them.

`SHOW GRANTS` displays mandatory roles named in the `mandatory_roles` system variable value as follows:

* `SHOW GRANTS` without a `FOR` clause displays privileges for the current user, and includes mandatory roles.

* [`SHOW GRANTS FOR user`](show-grants.html "15.7.7.23 SHOW GRANTS Statement") displays privileges for the named user, and does not include mandatory roles.

This behavior is for the benefit of applications that use the output of [`SHOW GRANTS FOR user`](show-grants.html "15.7.7.23 SHOW GRANTS Statement") to determine which privileges are granted explicitly to the named user. Were that output to include mandatory roles, it would be difficult to distinguish roles granted explicitly to the user from mandatory roles.

For the current user, applications can determine privileges with or without mandatory roles by using [`SHOW GRANTS`](show-grants.html "15.7.7.23 SHOW GRANTS Statement") or [`SHOW GRANTS FOR CURRENT_USER`](show-grants.html "15.7.7.23 SHOW GRANTS Statement"), respectively.


#### 15.7.7.24 SHOW INDEX Statement

```
SHOW [EXTENDED] {INDEX | INDEXES | KEYS}
    {FROM | IN} tbl_name
    [{FROM | IN} db_name]
    [WHERE expr]
```

`SHOW INDEX` returns table index information. The format resembles that of the `SQLStatistics` call in ODBC. This statement requires some privilege for any column in the table.

```
mysql> SHOW INDEX FROM City\G
*************************** 1. row ***************************
        Table: city
   Non_unique: 0
     Key_name: PRIMARY
 Seq_in_index: 1
  Column_name: ID
    Collation: A
  Cardinality: 4188
     Sub_part: NULL
       Packed: NULL
         Null:
   Index_type: BTREE
      Comment:
Index_comment:
      Visible: YES
   Expression: NULL
*************************** 2. row ***************************
        Table: city
   Non_unique: 1
     Key_name: CountryCode
 Seq_in_index: 1
  Column_name: CountryCode
    Collation: A
  Cardinality: 232
     Sub_part: NULL
       Packed: NULL
         Null:
   Index_type: BTREE
      Comment:
Index_comment:
      Visible: YES
   Expression: NULL
```

An alternative to `tbl_name FROM db_name` syntax is *`db_name`*.*`tbl_name`*. These two statements are equivalent:

```
SHOW INDEX FROM mytable FROM mydb;
SHOW INDEX FROM mydb.mytable;
```

The optional `EXTENDED` keyword causes the output to include information about hidden indexes that MySQL uses internally and are not accessible by users.

The `WHERE` clause can be given to select rows using more general conditions, as discussed in Section 28.8, “Extensions to SHOW Statements”.

`SHOW INDEX` returns the following fields:

* `Table`

  The name of the table.

* `Non_unique`

  0 if the index cannot contain duplicates, 1 if it can.

* `Key_name`

  The name of the index. If the index is the primary key, the name is always `PRIMARY`.

* `Seq_in_index`

  The column sequence number in the index, starting with 1.

* `Column_name`

  The column name. See also the description for the `Expression` column.

* `Collation`

  How the column is sorted in the index. This can have values `A` (ascending), `D` (descending), or `NULL` (not sorted).

* `Cardinality`

  An estimate of the number of unique values in the index. To update this number, run [`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") or (for `MyISAM` tables) **myisamchk -a**.

  `Cardinality` is counted based on statistics stored as integers, so the value is not necessarily exact even for small tables. The higher the cardinality, the greater the chance that MySQL uses the index when doing joins.

* `Sub_part`

  The index prefix. That is, the number of indexed characters if the column is only partly indexed, `NULL` if the entire column is indexed.

  Note

  Prefix *limits* are measured in bytes. However, prefix *lengths* for index specifications in [`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement"), [`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement"), and [`CREATE INDEX`](create-index.html "15.1.18 CREATE INDEX Statement") statements are interpreted as number of characters for nonbinary string types (`CHAR`, `VARCHAR`, `TEXT`) and number of bytes for binary string types (`BINARY`, `VARBINARY`, `BLOB`). Take this into account when specifying a prefix length for a nonbinary string column that uses a multibyte character set.

  For additional information about index prefixes, see Section 10.3.5, “Column Indexes”, and Section 15.1.18, “CREATE INDEX Statement”.

* `Packed`

  Indicates how the key is packed. `NULL` if it is not.

* `Null`

  Contains `YES` if the column may contain `NULL` values and `''` if not.

* `Index_type`

  The index method used (`BTREE`, `FULLTEXT`, `HASH`, `RTREE`).

* `Comment`

  Information about the index not described in its own column, such as `disabled` if the index is disabled.

* `Index_comment`

  Any comment provided for the index with a `COMMENT` attribute when the index was created.

* `Visible`

  Whether the index is visible to the optimizer. See Section 10.3.12, “Invisible Indexes”.

* `Expression`

  MySQL supports functional key parts (see Functional Key Parts); this affects both the `Column_name` and `Expression` columns:

  + For a nonfunctional key part, `Column_name` indicates the column indexed by the key part and `Expression` is `NULL`.

  + For a functional key part, `Column_name` column is `NULL` and `Expression` indicates the expression for the key part.

Information about table indexes is also available from the `INFORMATION_SCHEMA` `STATISTICS` table. See Section 28.3.40, “The INFORMATION\_SCHEMA STATISTICS Table”. The extended information about hidden indexes is available only using `SHOW EXTENDED INDEX`; it cannot be obtained from the `STATISTICS` table.

You can list a table's indexes with the [**mysqlshow -k *`db_name`* *`tbl_name`***](mysqlshow.html "6.5.6 mysqlshow — Display Database, Table, and Column Information") command.

`SHOW INDEX` includes the table's generated invisible key, if it has one, by default. You can cause this information to be suppressed in the statement's output by setting [`show_gipk_in_create_table_and_information_schema = OFF`](server-system-variables.html#sysvar_show_gipk_in_create_table_and_information_schema). For more information, see Section 15.1.24.11, “Generated Invisible Primary Keys”.


#### 15.7.7.25 SHOW LIBRARY STATUS Statement

```
SHOW LIBRARY STATUS
    [LIKE 'pattern' | WHERE expr]
```

This statement provides information about one or more JavaScript libraries. Like [`SHOW FUNCTION STATUS`](show-function-status.html "15.7.7.22 SHOW FUNCTION STATUS Statement") and [`SHOW PROCEDURE STATUS`](show-procedure-status.html "15.7.7.31 SHOW PROCEDURE STATUS Statement"), it supports `LIKE` and `WHERE` clauses for filtering the output. See Section 15.7.7.31, “SHOW PROCEDURE STATUS Statement”, for information about how these clauses work.

`SHOW LIBRARY STATUS` contains the following columns:

* `Db`

  The name of the database containing the library.

* `Name`

  The name of the library.

* `Type`

  The library's type. This is always `LIBRARY`.

* `Creator`

  The account which created the library.

* `Modified`

  Timestamp showing when the library was last modified.

* `Created`

  Timestamp showing when the library was created.

* `Comment`

  Comment text, if any.

Example:

```
mysql> SHOW LIBRARY STATUS LIKE 'my_lib'\G
*************************** 1. row ***************************
                  Db: test
                Name: my_lib
                Type: LIBRARY
             Creator: jon@localhost
            Modified: 2025-03-21 08:42:17
             Created: 2025-01-13 17:24:08
             Comment: This is my_lib. There are many others like it, but
                      this one is mine.
1 row in set (0.00 sec)
```

See Section 27.3.8, “Using JavaScript Libraries”, for more information.


#### 15.7.7.26 SHOW OPEN TABLES Statement

```
SHOW OPEN TABLES
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

`SHOW OPEN TABLES` lists the non-`TEMPORARY` tables that are currently open in the table cache. See Section 10.4.3.1, “How MySQL Opens and Closes Tables”. The `FROM` clause, if present, restricts the tables shown to those present in the *`db_name`* database. The `LIKE` clause, if present, indicates which table names to match. The `WHERE` clause can be given to select rows using more general conditions, as discussed in Section 28.8, “Extensions to SHOW Statements”.

`SHOW OPEN TABLES` output has these columns:

* `Database`

  The database containing the table.

* `Table`

  The table name.

* `In_use`

  The number of table locks or lock requests there are for the table. For example, if one client acquires a lock for a table using `LOCK TABLE t1 WRITE`, `In_use` is 1. If another client issues `LOCK TABLE t1 WRITE` while the table remains locked, the client blocks, waiting for the lock, but the lock request causes `In_use` to be 2. If the count is zero, the table is open but not currently being used. `In_use` is also increased by the [`HANDLER ... OPEN`](handler.html "15.2.5 HANDLER Statement") statement and decreased by [`HANDLER ... CLOSE`](handler.html "15.2.5 HANDLER Statement").

* `Name_locked`

  Whether the table name is locked. Name locking is used for operations such as dropping or renaming tables.

If you have no privileges for a table, it does not show up in the output from `SHOW OPEN TABLES`.


#### 15.7.7.27 SHOW PARSE\_TREE Statement

```
SHOW PARSE_TREE select_statement
```

`SHOW PARSE_TREE` displays a representation of the parse tree for the input `SELECT` statement, in JSON format.

Note

This statement is available only in debug builds, or if the MySQL server was built using `-DWITH_SHOW_PARSE_TREE`. It is intended for use in testing and development only, and not in production.

Example:

```
mysql> SHOW PARSE_TREE SELECT * FROM t3 WHERE o_id > 2\G
*************************** 1. row ***************************
Show_parse_tree: {
  "text": "SELECT * FROM t3 WHERE o_id > 2",
  "type": "PT_select_stmt",
  "components": [
    {
      "text": "SELECT * FROM t3 WHERE o_id > 2",
      "type": "PT_query_expression",
      "components": [
        {
          "text": "SELECT * FROM t3 WHERE o_id > 2",
          "type": "PT_query_specification",
          "components": [
            {
              "text": "*",
              "type": "PT_select_item_list",
              "components": [
                {
                  "text": "*",
                  "type": "Item_asterisk"
                }
              ]
            },
            {
              "text": "t3",
              "type": "PT_table_factor_table_ident",
              "table_ident": "`t3`"
            },
            {
              "text": "o_id > 2",
              "type": "PTI_where",
              "components": [
                {
                  "text": "o_id > 2",
                  "type": "PTI_comp_op",
                  "operator": ">",
                  "components": [
                    {
                      "text": "o_id",
                      "type": "PTI_simple_ident_ident"
                    },
                    {
                      "text": "2",
                      "type": "Item_int"
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
1 row in set (0.01 sec)
```


#### 15.7.7.28 SHOW PLUGINS Statement

```
SHOW PLUGINS
```

`SHOW PLUGINS` displays information about server plugins.

Example of `SHOW PLUGINS` output:

```
mysql> SHOW PLUGINS\G
*************************** 1. row ***************************
   Name: binlog
 Status: ACTIVE
   Type: STORAGE ENGINE
Library: NULL
License: GPL
*************************** 2. row ***************************
   Name: CSV
 Status: ACTIVE
   Type: STORAGE ENGINE
Library: NULL
License: GPL
*************************** 3. row ***************************
   Name: MEMORY
 Status: ACTIVE
   Type: STORAGE ENGINE
Library: NULL
License: GPL
*************************** 4. row ***************************
   Name: MyISAM
 Status: ACTIVE
   Type: STORAGE ENGINE
Library: NULL
License: GPL
...
```

`SHOW PLUGINS` output has these columns:

* `Name`

  The name used to refer to the plugin in statements such as `INSTALL PLUGIN` and `UNINSTALL PLUGIN`.

* `Status`

  The plugin status, one of `ACTIVE`, `INACTIVE`, `DISABLED`, `DELETING`, or `DELETED`.

* `Type`

  The type of plugin, such as `STORAGE ENGINE`, `INFORMATION_SCHEMA`, or `AUTHENTICATION`.

* `Library`

  The name of the plugin shared library file. This is the name used to refer to the plugin file in statements such as `INSTALL PLUGIN` and `UNINSTALL PLUGIN`. This file is located in the directory named by the `plugin_dir` system variable. If the library name is `NULL`, the plugin is compiled in and cannot be uninstalled with `UNINSTALL PLUGIN`.

* `License`

  How the plugin is licensed (for example, `GPL`).

For plugins installed with [`INSTALL PLUGIN`](install-plugin.html "15.7.4.4 INSTALL PLUGIN Statement"), the `Name` and `Library` values are also registered in the `mysql.plugin` system table.

For information about plugin data structures that form the basis of the information displayed by [`SHOW PLUGINS`](show-plugins.html "15.7.7.28 SHOW PLUGINS Statement"), see The MySQL Plugin API.

Plugin information is also available from the `INFORMATION_SCHEMA` `.PLUGINS` table. See Section 28.3.27, “The INFORMATION\_SCHEMA PLUGINS Table”.


#### 15.7.7.29 SHOW PRIVILEGES Statement

```
SHOW PRIVILEGES
```

`SHOW PRIVILEGES` shows the list of system privileges that the MySQL server supports. The privileges displayed include all static privileges, and all currently registered dynamic privileges.

```
mysql> SHOW PRIVILEGES\G
*************************** 1. row ***************************
Privilege: Alter
  Context: Tables
  Comment: To alter the table
*************************** 2. row ***************************
Privilege: Alter routine
  Context: Functions,Procedures
  Comment: To alter or drop stored functions/procedures
*************************** 3. row ***************************
Privilege: Create
  Context: Databases,Tables,Indexes
  Comment: To create new databases and tables
*************************** 4. row ***************************
Privilege: Create routine
  Context: Databases
  Comment: To use CREATE FUNCTION/PROCEDURE
*************************** 5. row ***************************
Privilege: Create role
  Context: Server Admin
  Comment: To create new roles
...
```

Privileges belonging to a specific user are displayed by the `SHOW GRANTS` statement. See Section 15.7.7.23, “SHOW GRANTS Statement”, for more information.


#### 15.7.7.30 SHOW PROCEDURE CODE Statement

```
SHOW PROCEDURE CODE proc_name
```

This statement is a MySQL extension that is available only for servers that have been built with debugging support. It displays a representation of the internal implementation of the named stored procedure. A similar statement, [`SHOW FUNCTION CODE`](show-function-code.html "15.7.7.21 SHOW FUNCTION CODE Statement"), displays information about stored functions (see Section 15.7.7.21, “SHOW FUNCTION CODE Statement”).

To use either statement, you must be the user named as the routine `DEFINER`, have the `SHOW_ROUTINE` privilege, or have the `SELECT` privilege at the global level.

If the named routine is available, each statement produces a result set. Each row in the result set corresponds to one “instruction” in the routine. The first column is `Pos`, which is an ordinal number beginning with 0. The second column is `Instruction`, which contains an SQL statement (usually changed from the original source), or a directive which has meaning only to the stored-routine handler.

```
mysql> DELIMITER //
mysql> CREATE PROCEDURE p1 ()
       BEGIN
         DECLARE fanta INT DEFAULT 55;
         DROP TABLE t2;
         LOOP
           INSERT INTO t3 VALUES (fanta);
           END LOOP;
         END//
Query OK, 0 rows affected (0.01 sec)

mysql> SHOW PROCEDURE CODE p1//
+-----+----------------------------------------+
| Pos | Instruction                            |
+-----+----------------------------------------+
|   0 | set fanta@0 55                         |
|   1 | stmt 9 "DROP TABLE t2"                 |
|   2 | stmt 5 "INSERT INTO t3 VALUES (fanta)" |
|   3 | jump 2                                 |
+-----+----------------------------------------+
4 rows in set (0.00 sec)

mysql> CREATE FUNCTION test.hello (s CHAR(20))
       RETURNS CHAR(50) DETERMINISTIC
       RETURN CONCAT('Hello, ',s,'!');
Query OK, 0 rows affected (0.00 sec)

mysql> SHOW FUNCTION CODE test.hello;
+-----+---------------------------------------+
| Pos | Instruction                           |
+-----+---------------------------------------+
|   0 | freturn 254 concat('Hello, ',s@0,'!') |
+-----+---------------------------------------+
1 row in set (0.00 sec)
```

In this example, the nonexecutable `BEGIN` and `END` statements have disappeared, and for the `DECLARE variable_name` statement, only the executable part appears (the part where the default is assigned). For each statement that is taken from source, there is a code word `stmt` followed by a type (9 means `DROP`, 5 means `INSERT`, and so on). The final row contains an instruction `jump 2`, meaning `GOTO instruction #2`.


#### 15.7.7.31 SHOW PROCEDURE STATUS Statement

```
SHOW PROCEDURE STATUS
    [LIKE 'pattern' | WHERE expr]
```

This statement is a MySQL extension. It returns characteristics of a stored procedure, such as the database, name, type, creator, creation and modification dates, and character set information. A similar statement, [`SHOW FUNCTION STATUS`](show-function-status.html "15.7.7.22 SHOW FUNCTION STATUS Statement"), displays information about stored functions (see Section 15.7.7.22, “SHOW FUNCTION STATUS Statement”).

To use either statement, you must be the user named as the routine `DEFINER`, have the `SHOW_ROUTINE` privilege, have the `SELECT` privilege at the global level, or have the [`CREATE ROUTINE`](privileges-provided.html#priv_create-routine), `ALTER ROUTINE`, or `EXECUTE` privilege granted at a scope that includes the routine.

The `LIKE` clause, if present, indicates which procedure or function names to match. The `WHERE` clause can be given to select rows using more general conditions, as discussed in Section 28.8, “Extensions to SHOW Statements”.

```
mysql> SHOW PROCEDURE STATUS LIKE 'sp1'\G
*************************** 1. row ***************************
                  Db: test
                Name: sp1
                Type: PROCEDURE
             Definer: testuser@localhost
            Modified: 2018-08-08 13:54:11
             Created: 2018-08-08 13:54:11
       Security_type: DEFINER
             Comment:
character_set_client: utf8mb4
collation_connection: utf8mb4_0900_ai_ci
  Database Collation: utf8mb4_0900_ai_ci

mysql> SHOW FUNCTION STATUS LIKE 'hello'\G
*************************** 1. row ***************************
                  Db: test
                Name: hello
                Type: FUNCTION
             Definer: testuser@localhost
            Modified: 2020-03-10 11:10:03
             Created: 2020-03-10 11:10:03
       Security_type: DEFINER
             Comment:
character_set_client: utf8mb4
collation_connection: utf8mb4_0900_ai_ci
  Database Collation: utf8mb4_0900_ai_ci
```

`character_set_client` is the session value of the `character_set_client` system variable when the routine was created. `collation_connection` is the session value of the `collation_connection` system variable when the routine was created. `Database Collation` is the collation of the database with which the routine is associated.

Stored routine information is also available from the `INFORMATION_SCHEMA` `PARAMETERS` and `ROUTINES` tables. See Section 28.3.25, “The INFORMATION\_SCHEMA PARAMETERS Table”, and Section 28.3.36, “The INFORMATION\_SCHEMA ROUTINES Table”.


#### 15.7.7.32 SHOW PROCESSLIST Statement

```
SHOW [FULL] PROCESSLIST
```

Important

The INFORMATION SCHEMA implementation of `SHOW PROCESSLIST` is deprecated and subject to removal in a future MySQL release. It is recommended to use the Performance Schema implementation of `SHOW PROCESSLIST` instead.

The MySQL process list indicates the operations currently being performed by the set of threads executing within the server. The `SHOW PROCESSLIST` statement is one source of process information. For a comparison of this statement with other sources, see Sources of Process Information.

Note

An alternative implementation for [`SHOW PROCESSLIST`](show-processlist.html "15.7.7.32 SHOW PROCESSLIST Statement") is available based on the Performance Schema `processlist` table, which, unlike the default [`SHOW PROCESSLIST`](show-processlist.html "15.7.7.32 SHOW PROCESSLIST Statement") implementation, does not require a mutex and has better performance characteristics. For details, see Section 29.12.22.9, “The processlist Table”.

If you have the `PROCESS` privilege, you can see all threads, even those belonging to other users. Otherwise (without the `PROCESS` privilege), nonanonymous users have access to information about their own threads but not threads for other users, and anonymous users have no access to thread information.

Without the `FULL` keyword, `SHOW PROCESSLIST` displays only the first 100 characters of each statement in the `Info` field.

The `SHOW PROCESSLIST` statement is very useful if you get the “too many connections” error message and want to find out what is going on. MySQL reserves one extra connection to be used by accounts that have the `CONNECTION_ADMIN` privilege (or the deprecated `SUPER` privilege), to ensure that administrators should always be able to connect and check the system (assuming that you are not giving this privilege to all your users).

Threads can be killed with the `KILL` statement. See Section 15.7.8.4, “KILL Statement”.

Example of `SHOW PROCESSLIST` output:

```
mysql> SHOW FULL PROCESSLIST\G
*************************** 1. row ***************************
     Id: 1
   User: system user
   Host:
     db: NULL
Command: Connect
   Time: 1030455
  State: Waiting for source to send event
   Info: NULL
*************************** 2. row ***************************
     Id: 2
   User: system user
   Host:
     db: NULL
Command: Connect
   Time: 1004
  State: Has read all relay log; waiting for the replica
         I/O thread to update it
   Info: NULL
*************************** 3. row ***************************
     Id: 3112
   User: replikator
   Host: artemis:2204
     db: NULL
Command: Binlog Dump
   Time: 2144
  State: Has sent all binlog to replica; waiting for binlog to be updated
   Info: NULL
*************************** 4. row ***************************
     Id: 3113
   User: replikator
   Host: iconnect2:45781
     db: NULL
Command: Binlog Dump
   Time: 2086
  State: Has sent all binlog to replica; waiting for binlog to be updated
   Info: NULL
*************************** 5. row ***************************
     Id: 3123
   User: stefan
   Host: localhost
     db: apollon
Command: Query
   Time: 0
  State: NULL
   Info: SHOW FULL PROCESSLIST
```

`SHOW PROCESSLIST` output has these columns:

* `Id`

  The connection identifier. This is the same value displayed in the `ID` column of the `INFORMATION_SCHEMA` `PROCESSLIST` table, displayed in the `PROCESSLIST_ID` column of the Performance Schema `threads` table, and returned by the `CONNECTION_ID()` function within the thread.

* `User`

  The MySQL user who issued the statement. A value of `system user` refers to a nonclient thread spawned by the server to handle tasks internally, for example, a delayed-row handler thread or an I/O (receiver) or SQL (applier) thread used on replica hosts. For `system user`, there is no host specified in the `Host` column. `unauthenticated user` refers to a thread that has become associated with a client connection but for which authentication of the client user has not yet occurred. `event_scheduler` refers to the thread that monitors scheduled events (see Section 27.5, “Using the Event Scheduler”).

  Note

  A `User` value of `system user` is distinct from the `SYSTEM_USER` privilege. The former designates internal threads. The latter distinguishes the system user and regular user account categories (see Section 8.2.11, “Account Categories”).

* `Host`

  The host name of the client issuing the statement (except for `system user`, for which there is no host). The host name for TCP/IP connections is reported in `host_name:client_port` format to make it easier to determine which client is doing what.

* `db`

  The default database for the thread, or `NULL` if none has been selected.

* `Command`

  The type of command the thread is executing on behalf of the client, or `Sleep` if the session is idle. For descriptions of thread commands, see Section 10.14, “Examining Server Thread (Process) Information” Information"). The value of this column corresponds to the `COM_xxx` commands of the client/server protocol and `Com_xxx` status variables. See Section 7.1.10, “Server Status Variables”.

* `Time`

  The time in seconds that the thread has been in its current state. For a replica SQL thread, the value is the number of seconds between the timestamp of the last replicated event and the real time of the replica host. See Section 19.2.3, “Replication Threads”.

* `State`

  An action, event, or state that indicates what the thread is doing. For descriptions of `State` values, see Section 10.14, “Examining Server Thread (Process) Information” Information").

  Most states correspond to very quick operations. If a thread stays in a given state for many seconds, there might be a problem that needs to be investigated.

* `Info`

  The statement the thread is executing, or `NULL` if it is executing no statement. The statement might be the one sent to the server, or an innermost statement if the statement executes other statements. For example, if a `CALL` statement executes a stored procedure that is executing a `SELECT` statement, the `Info` value shows the `SELECT` statement.


#### 15.7.7.33 SHOW PROFILE Statement

```
SHOW PROFILE [type [, type] ... ]
    [FOR QUERY n]
    [LIMIT row_count [OFFSET offset]]

type: {
    ALL
  | BLOCK IO
  | CONTEXT SWITCHES
  | CPU
  | IPC
  | MEMORY
  | PAGE FAULTS
  | SOURCE
  | SWAPS
}
```

The `SHOW PROFILE` and `SHOW PROFILES` statements display profiling information that indicates resource usage for statements executed during the course of the current session.

Note

The `SHOW PROFILE` and `SHOW PROFILES` statements are deprecated; expect them to be removed in a future MySQL release. Use the Performance Schema instead; see Section 29.19.1, “Query Profiling Using Performance Schema”.

To control profiling, use the `profiling` session variable, which has a default value of 0 (`OFF`). Enable profiling by setting `profiling` to 1 or `ON`:

```
mysql> SET profiling = 1;
```

`SHOW PROFILES` displays a list of the most recent statements sent to the server. The size of the list is controlled by the `profiling_history_size` session variable, which has a default value of 15. The maximum value is

100. Setting the value to 0 has the practical effect of disabling profiling.

All statements are profiled except [`SHOW PROFILE`](show-profile.html "15.7.7.33 SHOW PROFILE Statement") and [`SHOW PROFILES`](show-profiles.html "15.7.7.34 SHOW PROFILES Statement"), so neither of those statements appears in the profile list. Malformed statements are profiled. For example, `SHOW PROFILING` is an illegal statement, and a syntax error occurs if you try to execute it, but it shows up in the profiling list.

`SHOW PROFILE` displays detailed information about a single statement. Without the `FOR QUERY n` clause, the output pertains to the most recently executed statement. If `FOR QUERY n` is included, `SHOW PROFILE` displays information for statement *`n`*. The values of *`n`* correspond to the `Query_ID` values displayed by `SHOW PROFILES`.

The `LIMIT row_count` clause may be given to limit the output to *`row_count`* rows. If `LIMIT` is given, `OFFSET offset` may be added to begin the output *`offset`* rows into the full set of rows.

By default, `SHOW PROFILE` displays `Status` and `Duration` columns. The `Status` values are like the `State` values displayed by `SHOW PROCESSLIST`, although there might be some minor differences in interpretation for the two statements for some status values (see Section 10.14, “Examining Server Thread (Process) Information” Information")).

Optional *`type`* values may be specified to display specific additional types of information:

* `ALL` displays all information
* `BLOCK IO` displays counts for block input and output operations

* `CONTEXT SWITCHES` displays counts for voluntary and involuntary context switches

* `CPU` displays user and system CPU usage times

* `IPC` displays counts for messages sent and received

* `MEMORY` is not currently implemented
* `PAGE FAULTS` displays counts for major and minor page faults

* `SOURCE` displays the names of functions from the source code, together with the name and line number of the file in which the function occurs

* `SWAPS` displays swap counts

Profiling is enabled per session. When a session ends, its profiling information is lost.

```
mysql> SELECT @@profiling;
+-------------+
| @@profiling |
+-------------+
|           0 |
+-------------+
1 row in set (0.00 sec)

mysql> SET profiling = 1;
Query OK, 0 rows affected (0.00 sec)

mysql> DROP TABLE IF EXISTS t1;
Query OK, 0 rows affected, 1 warning (0.00 sec)

mysql> CREATE TABLE T1 (id INT);
Query OK, 0 rows affected (0.01 sec)

mysql> SHOW PROFILES;
+----------+----------+--------------------------+
| Query_ID | Duration | Query                    |
+----------+----------+--------------------------+
|        0 | 0.000088 | SET PROFILING = 1        |
|        1 | 0.000136 | DROP TABLE IF EXISTS t1  |
|        2 | 0.011947 | CREATE TABLE t1 (id INT) |
+----------+----------+--------------------------+
3 rows in set (0.00 sec)

mysql> SHOW PROFILE;
+----------------------+----------+
| Status               | Duration |
+----------------------+----------+
| checking permissions | 0.000040 |
| creating table       | 0.000056 |
| After create         | 0.011363 |
| query end            | 0.000375 |
| freeing items        | 0.000089 |
| logging slow query   | 0.000019 |
| cleaning up          | 0.000005 |
+----------------------+----------+
7 rows in set (0.00 sec)

mysql> SHOW PROFILE FOR QUERY 1;
+--------------------+----------+
| Status             | Duration |
+--------------------+----------+
| query end          | 0.000107 |
| freeing items      | 0.000008 |
| logging slow query | 0.000015 |
| cleaning up        | 0.000006 |
+--------------------+----------+
4 rows in set (0.00 sec)

mysql> SHOW PROFILE CPU FOR QUERY 2;
+----------------------+----------+----------+------------+
| Status               | Duration | CPU_user | CPU_system |
+----------------------+----------+----------+------------+
| checking permissions | 0.000040 | 0.000038 |   0.000002 |
| creating table       | 0.000056 | 0.000028 |   0.000028 |
| After create         | 0.011363 | 0.000217 |   0.001571 |
| query end            | 0.000375 | 0.000013 |   0.000028 |
| freeing items        | 0.000089 | 0.000010 |   0.000014 |
| logging slow query   | 0.000019 | 0.000009 |   0.000010 |
| cleaning up          | 0.000005 | 0.000003 |   0.000002 |
+----------------------+----------+----------+------------+
7 rows in set (0.00 sec)
```

Note

Profiling is only partially functional on some architectures. For values that depend on the `getrusage()` system call, `NULL` is returned on systems such as Windows that do not support the call. In addition, profiling is per process and not per thread. This means that activity on threads within the server other than your own may affect the timing information that you see.

Profiling information is also available from the `INFORMATION_SCHEMA` `PROFILING` table. See Section 28.3.29, “The INFORMATION\_SCHEMA PROFILING Table”. For example, the following queries are equivalent:

```
SHOW PROFILE FOR QUERY 2;

SELECT STATE, FORMAT(DURATION, 6) AS DURATION
FROM INFORMATION_SCHEMA.PROFILING
WHERE QUERY_ID = 2 ORDER BY SEQ;
```


#### 15.7.7.34 SHOW PROFILES Statement

```
SHOW PROFILES
```

The `SHOW PROFILES` statement, together with `SHOW PROFILE`, displays profiling information that indicates resource usage for statements executed during the course of the current session. For more information, see Section 15.7.7.33, “SHOW PROFILE Statement”.

Note

The `SHOW PROFILE` and `SHOW PROFILES` statements are deprecated; expect it to be removed in a future MySQL release. Use the [Performance Schema](performance-schema.html "Chapter 29 MySQL Performance Schema") instead; see Section 29.19.1, “Query Profiling Using Performance Schema”.


#### 15.7.7.35 SHOW RELAYLOG EVENTS Statement

```
SHOW RELAYLOG EVENTS
    [IN 'log_name']
    [FROM pos]
    [LIMIT [offset,] row_count]
    [channel_option]

channel_option:
    FOR CHANNEL channel
```

Shows the events in the relay log of a replica. If you do not specify `'log_name'`, the first relay log is displayed. This statement has no effect on the source. `SHOW RELAYLOG EVENTS` requires the `REPLICATION SLAVE` privilege.

The `LIMIT` clause has the same syntax as for the `SELECT` statement. See Section 15.2.13, “SELECT Statement”.

Note

Issuing a `SHOW RELAYLOG EVENTS` with no `LIMIT` clause could start a very time- and resource-consuming process because the server returns to the client the complete contents of the relay log (including all statements modifying data that have been received by the replica).

The optional `FOR CHANNEL channel` clause enables you to name which replication channel the statement applies to. Providing a `FOR CHANNEL channel` clause applies the statement to a specific replication channel. If no channel is named and no extra channels exist, the statement applies to the default channel.

When using multiple replication channels, if a `SHOW RELAYLOG EVENTS` statement does not have a channel defined using a `FOR CHANNEL channel` clause an error is generated. See Section 19.2.2, “Replication Channels” for more information.

`SHOW RELAYLOG EVENTS` displays the following fields for each event in the relay log:

* `Log_name`

  The name of the file that is being listed.

* `Pos`

  The position at which the event occurs.

* `Event_type`

  An identifier that describes the event type.

* `Server_id`

  The server ID of the server on which the event originated.

* `End_log_pos`

  The value of `End_log_pos` for this event in the source's binary log.

* `Info`

  More detailed information about the event type. The format of this information depends on the event type.

For compressed transaction payloads, the `Transaction_payload_event` is first printed as a single unit, then it is unpacked and each event inside it is printed.

Some events relating to the setting of user and system variables are not included in the output from [`SHOW RELAYLOG EVENTS`](show-relaylog-events.html "15.7.7.35 SHOW RELAYLOG EVENTS Statement"). To get complete coverage of events within a relay log, use **mysqlbinlog**.


#### 15.7.7.36 SHOW REPLICA STATUS Statement

```
SHOW REPLICA STATUS [FOR CHANNEL channel]
```

This statement provides status information on essential parameters of the replica threads. The statement requires the `REPLICATION CLIENT` privilege (or the deprecated `SUPER` privilege).

`SHOW REPLICA STATUS` is nonblocking. When run concurrently with [`STOP REPLICA`](stop-replica.html "15.4.2.5 STOP REPLICA Statement"), `SHOW REPLICA STATUS` returns without waiting for [`STOP REPLICA`](stop-replica.html "15.4.2.5 STOP REPLICA Statement") to finish shutting down the replication SQL (applier) thread or replication I/O (receiver) thread (or both). This permits use in monitoring and other applications where getting an immediate response from `SHOW REPLICA STATUS` is more important than ensuring that it returned the latest data.

If you issue this statement using the **mysql** client, you can use a `\G` statement terminator rather than a semicolon to obtain a more readable vertical layout:

```
mysql> SHOW REPLICA STATUS\G
*************************** 1. row ***************************
             Replica_IO_State: Waiting for source to send event
                  Source_Host: 127.0.0.1
                  Source_User: root
                  Source_Port: 13000
                Connect_Retry: 1
              Source_Log_File: master-bin.000001
          Read_Source_Log_Pos: 927
               Relay_Log_File: slave-relay-bin.000002
                Relay_Log_Pos: 1145
        Relay_Source_Log_File: master-bin.000001
           Replica_IO_Running: Yes
          Replica_SQL_Running: Yes
              Replicate_Do_DB:
          Replicate_Ignore_DB:
           Replicate_Do_Table:
       Replicate_Ignore_Table:
      Replicate_Wild_Do_Table:
  Replicate_Wild_Ignore_Table:
                   Last_Errno: 0
                   Last_Error:
                 Skip_Counter: 0
          Exec_Source_Log_Pos: 927
              Relay_Log_Space: 1355
              Until_Condition: None
               Until_Log_File:
                Until_Log_Pos: 0
           Source_SSL_Allowed: No
           Source_SSL_CA_File:
           Source_SSL_CA_Path:
              Source_SSL_Cert:
            Source_SSL_Cipher:
               Source_SSL_Key:
        Seconds_Behind_Source: 0
Source_SSL_Verify_Server_Cert: No
                Last_IO_Errno: 0
                Last_IO_Error:
               Last_SQL_Errno: 0
               Last_SQL_Error:
  Replicate_Ignore_Server_Ids:
             Source_Server_Id: 1
                  Source_UUID: 73f86016-978b-11ee-ade5-8d2a2a562feb
             Source_Info_File: mysql.slave_master_info
                    SQL_Delay: 0
          SQL_Remaining_Delay: NULL
    Replica_SQL_Running_State: Replica has read all relay log; waiting for more updates
           Source_Retry_Count: 10
                  Source_Bind:
      Last_IO_Error_Timestamp:
     Last_SQL_Error_Timestamp:
               Source_SSL_Crl:
           Source_SSL_Crlpath:
           Retrieved_Gtid_Set: 73f86016-978b-11ee-ade5-8d2a2a562feb:1-3
            Executed_Gtid_Set: 73f86016-978b-11ee-ade5-8d2a2a562feb:1-3
                Auto_Position: 1
         Replicate_Rewrite_DB:
                 Channel_Name:
           Source_TLS_Version:
       Source_public_key_path:
        Get_Source_public_key: 0
            Network_Namespace:
```

The Performance Schema provides tables that expose replication information. This is similar to the information available from the `SHOW REPLICA STATUS` statement, but represented in table form. For details, see Section 29.12.11, “Performance Schema Replication Tables”.

You can set the `GTID_ONLY` option for the `CHANGE REPLICATION SOURCE TO` statement to stop a replication channel from persisting file names and file positions in the replication metadata repositories. With this setting, file positions for the source binary log file and the relay log file are tracked in memory. The `SHOW REPLICA STATUS` statement still displays file positions in normal use. However, because the file positions are not being regularly updated in the connection metadata repository and the applier metadata repository except in a few situations, they are likely to be out of date if the server is restarted.

For a replication channel with the `GTID_ONLY` setting after a server start, the read and applied file positions for the source binary log file (`Read_Source_Log_Pos` and `Exec_Source_Log_Pos`) are set to zero, and the file names (`Source_Log_File` and `Relay_Source_Log_File`) are set to `INVALID`. The relay log file name (`Relay_Log_File`) is set according to the relay\_log\_recovery setting, either a new file that was created at server start or the first relay log file present. The file position (`Relay_Log_Pos`) is set to position 4, and GTID auto-skip is used to skip any transactions in the file that were already applied.

When the receiver thread contacts the source and gets valid position information, the read position (`Read_Source_Log_Pos`) and file name (`Source_Log_File`) are updated with the correct data and become valid. When the applier thread applies a transaction from the source, or skips an already executed transaction, the executed position (`Exec_Source_Log_Pos`) and file name (`Relay_Source_Log_File`) are updated with the correct data and become valid. The relay log file position (`Relay_Log_Pos`) is also updated at that time.

The following list describes the fields returned by [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.36 SHOW REPLICA STATUS Statement"). For additional information about interpreting their meanings, see Section 19.1.7.1, “Checking Replication Status”.

* `Replica_IO_State`

  A copy of the `State` field of the `SHOW PROCESSLIST` output for the replica I/O (receiver) thread. This tells you what the thread is doing: trying to connect to the source, waiting for events from the source, reconnecting to the source, and so on. For a listing of possible states, see Section 10.14.5, “Replication I/O (Receiver) Thread States” Thread States").

* `Source_Host`

  The source host that the replica is connected to.

* `Source_User`

  The user name of the account used to connect to the source.

* `Source_Port`

  The port used to connect to the source.

* `Connect_Retry`

  The number of seconds between connect retries (default 60). This can be set with a [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement") statement.

* `Source_Log_File`

  The name of the source binary log file from which the I/O (receiver) thread is currently reading. This is set to `INVALID` for a replication channel with the `GTID_ONLY` setting after a server start. It will be updated when the replica contacts the source.

* `Read_Source_Log_Pos`

  The position in the current source binary log file up to which the I/O (receiver) thread has read. This is set to zero for a replication channel with the `GTID_ONLY` setting after a server start. It will be updated when the replica contacts the source.

* `Relay_Log_File`

  The name of the relay log file from which the SQL (applier) thread is currently reading and executing.

* `Relay_Log_Pos`

  The position in the current relay log file up to which the SQL (applier) thread has read and executed.

* `Relay_Source_Log_File`

  The name of the source binary log file containing the most recent event executed by the SQL (applier) thread. This is set to `INVALID` for a replication channel with the `GTID_ONLY` setting after a server start. It will be updated when a transaction is executed or skipped.

* `Replica_IO_Running`

  Whether the replication I/O (receiver) thread is started and has connected successfully to the source. Internally, the state of this thread is represented by one of the following three values:

  + **MYSQL\_REPLICA\_NOT\_RUN.** The replication I/O (receiver) thread is not running. For this state, `Replica_IO_Running` is `No`.

  + **MYSQL\_REPLICA\_RUN\_NOT\_CONNECT.** The replication I/O (receiver) thread is running, but is not connected to a replication source. For this state, `Replica_IO_Running` is `Connecting`.

  + **MYSQL\_REPLICA\_RUN\_CONNECT.** The replication I/O (receiver) thread is running, and is connected to a replication source. For this state, `Replica_IO_Running` is `Yes`.

* `Replica_SQL_Running`

  Whether the replication SQL (applier) thread is started.

* `Replicate_Do_DB`, `Replicate_Ignore_DB`

  The names of any databases that were specified with the `--replicate-do-db` and `--replicate-ignore-db` options, or the [`CHANGE REPLICATION FILTER`](change-replication-filter.html "15.4.2.1 CHANGE REPLICATION FILTER Statement") statement. If the `FOR CHANNEL` clause was used, the channel specific replication filters are shown. Otherwise, the replication filters for every replication channel are shown.

* `Replicate_Do_Table`, `Replicate_Ignore_Table`, `Replicate_Wild_Do_Table`, `Replicate_Wild_Ignore_Table`

  The names of any tables that were specified with the `--replicate-do-table`, `--replicate-ignore-table`, `--replicate-wild-do-table`, and `--replicate-wild-ignore-table` options, or the [`CHANGE REPLICATION FILTER`](change-replication-filter.html "15.4.2.1 CHANGE REPLICATION FILTER Statement") statement. If the `FOR CHANNEL` clause was used, the channel specific replication filters are shown. Otherwise, the replication filters for every replication channel are shown.

* `Last_Errno`, `Last_Error`

  These columns are aliases for `Last_SQL_Errno` and `Last_SQL_Error`.

  Issuing [`RESET BINARY LOGS AND GTIDS`](reset-binary-logs-and-gtids.html "15.4.1.2 RESET BINARY LOGS AND GTIDS Statement") or [`RESET REPLICA`](reset-replica.html "15.4.2.3 RESET REPLICA Statement") resets the values shown in these columns.

  Note

  When the replication SQL thread receives an error, it reports the error first, then stops the SQL thread. This means that there is a small window of time during which `SHOW REPLICA STATUS` shows a nonzero value for `Last_SQL_Errno` even though `Replica_SQL_Running` still displays `Yes`.

* `Skip_Counter`

  The current value of the `sql_replica_skip_counter` system variable.

* `Exec_Source_Log_Pos`

  The position in the current source binary log file to which the replication SQL thread has read and executed, marking the start of the next transaction or event to be processed. This is set to zero for a replication channel with the `GTID_ONLY` setting after a server start. It will be updated when a transaction is executed or skipped.

  You can use this value with the [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement") statement's `SOURCE_LOG_POS` option when starting a new replica from an existing replica, so that the new replica reads from this point. The coordinates given by (`Relay_Source_Log_File`, `Exec_Source_Log_Pos`) in the source's binary log correspond to the coordinates given by (`Relay_Log_File`, `Relay_Log_Pos`) in the relay log.

  Inconsistencies in the sequence of transactions from the relay log which have been executed can cause this value to be a “low-water mark”. In other words, transactions appearing before the position are guaranteed to have committed, but transactions after the position may have committed or not. If these gaps need to be corrected, use [`START REPLICA UNTIL SQL_AFTER_MTS_GAPS`](start-replica.html "15.4.2.4 START REPLICA Statement"). See Section 19.5.1.35, “Replication and Transaction Inconsistencies” for more information.

* `Relay_Log_Space`

  The total combined size of all existing relay log files.

* `Until_Condition`, `Until_Log_File`, `Until_Log_Pos`

  The values specified in the `UNTIL` clause of the [`START REPLICA`](start-replica.html "15.4.2.4 START REPLICA Statement") statement.

  `Until_Condition` has these values:

  + `None` if no `UNTIL` clause was specified.

  + `Source` if the replica is reading until a given position in the source's binary log.

  + `Relay` if the replica is reading until a given position in its relay log.

  + `SQL_BEFORE_GTIDS` if the replication SQL thread is processing transactions until it has reached the first transaction whose GTID is listed in the `gtid_set`.

  + `SQL_AFTER_GTIDS` if the replication threads are processing all transactions until the last transaction in the `gtid_set` has been processed by both threads.

  + `SQL_AFTER_MTS_GAPS` if a multithreaded replica's SQL threads are running until no more gaps are found in the relay log.

  `Until_Log_File` and `Until_Log_Pos` indicate the log file name and position that define the coordinates at which the replication SQL thread stops executing.

  For more information on `UNTIL` clauses, see Section 15.4.2.4, “START REPLICA Statement”.

* `Source_SSL_Allowed`, `Source_SSL_CA_File`, `Source_SSL_CA_Path`, `Source_SSL_Cert`, `Source_SSL_Cipher`, `Source_SSL_CRL_File`, `Source_SSL_CRL_Path`, `Source_SSL_Key`, `Source_SSL_Verify_Server_Cert`

  These fields show the SSL parameters used by the replica to connect to the source, if any.

  `Source_SSL_Allowed` has these values:

  + `Yes` if an SSL connection to the source is permitted.

  + `No` if an SSL connection to the source is not permitted.

  + `Ignored` if an SSL connection is permitted but the replica server does not have SSL support enabled.

  The values of the other SSL-related fields correspond to the values of the `SOURCE_SSL_*` options of the `CHANGE REPLICATION SOURCE TO` statement.

* `Seconds_Behind_Source`

  This field is an indication of how “late” the replica is:

  + When the replica is actively processing updates, this field shows the difference between the current timestamp on the replica and the original timestamp logged on the source for the event currently being processed on the replica.

  + When no event is currently being processed on the replica, this value is 0.

  In essence, this field measures the time difference in seconds between the replication SQL (applier) thread and the replication I/O (receiver) thread. If the network connection between source and replica is fast, the replication receiver thread is very close to the source, so this field is a good approximation of how late the replication applier thread is compared to the source. If the network is slow, this is *not* a good approximation; the replication applier thread may quite often be caught up with the slow-reading replication receiver thread, so `Seconds_Behind_Source` often shows a value of 0, even if the replication receiver thread is late compared to the source. In other words, *this column is useful only for fast networks*.

  This time difference computation works even if the source and replica do not have identical clock times, provided that the difference, computed when the replica receiver thread starts, remains constant from then on. Any changes, including NTP updates, can lead to clock skews that can make calculation of `Seconds_Behind_Source` less reliable.

  In MySQL 9.5, this field is `NULL` (undefined or unknown) if the replication applier thread is not running, or if the applier thread has consumed all of the relay log and the replication receiver thread is not running. (In older versions of MySQL, this field was `NULL` if the replication applier thread or the replication receiver thread was not running or was not connected to the source.) If the replication receiver thread is running but the relay log is exhausted, `Seconds_Behind_Source` is set to 0.

  The value of `Seconds_Behind_Source` is based on the timestamps stored in events, which are preserved through replication. This means that if a source M1 is itself a replica of M0, any event from M1's binary log that originates from M0's binary log has M0's timestamp for that event. This enables MySQL to replicate `TIMESTAMP` successfully. However, the problem for `Seconds_Behind_Source` is that if M1 also receives direct updates from clients, the `Seconds_Behind_Source` value randomly fluctuates because sometimes the last event from M1 originates from M0 and sometimes is the result of a direct update on M1.

  When using a multithreaded replica, you should keep in mind that this value is based on `Exec_Source_Log_Pos`, and so may not reflect the position of the most recently committed transaction.

* `Last_IO_Errno`, `Last_IO_Error`

  The error number and error message of the most recent error that caused the replication I/O (receiver) thread to stop. An error number of 0 and message of the empty string mean “no error.” If the `Last_IO_Error` value is not empty, the error values also appear in the replica's error log.

  I/O error information includes a timestamp showing when the most recent I/O (receiver)thread error occurred. This timestamp uses the format *`YYMMDD hh:mm:ss`*, and appears in the `Last_IO_Error_Timestamp` column.

  Issuing [`RESET BINARY LOGS AND GTIDS`](reset-binary-logs-and-gtids.html "15.4.1.2 RESET BINARY LOGS AND GTIDS Statement") or [`RESET REPLICA`](reset-replica.html "15.4.2.3 RESET REPLICA Statement") resets the values shown in these columns.

* `Last_SQL_Errno`, `Last_SQL_Error`

  The error number and error message of the most recent error that caused the replication SQL (applier) thread to stop. An error number of 0 and message of the empty string mean “no error.” If the `Last_SQL_Error` value is not empty, the error values also appear in the replica's error log.

  If the replica is multithreaded, the replication SQL thread is the coordinator for worker threads. In this case, the `Last_SQL_Error` field shows exactly what the `Last_Error_Message` column in the Performance Schema `replication_applier_status_by_coordinator` table shows. The field value is modified to suggest that there may be more failures in the other worker threads which can be seen in the `replication_applier_status_by_worker` table that shows each worker thread's status. If that table is not available, the replica error log can be used. The log or the `replication_applier_status_by_worker` table should also be used to learn more about the failure shown by [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.36 SHOW REPLICA STATUS Statement") or the coordinator table.

  SQL error information includes a timestamp showing when the most recent SQL (applier) thread error occurred. This timestamp uses the format *`YYMMDD hh:mm:ss`*, and appears in the `Last_SQL_Error_Timestamp` column.

  Issuing [`RESET BINARY LOGS AND GTIDS`](reset-binary-logs-and-gtids.html "15.4.1.2 RESET BINARY LOGS AND GTIDS Statement") or [`RESET REPLICA`](reset-replica.html "15.4.2.3 RESET REPLICA Statement") resets the values shown in these columns.

  In MySQL 9.5, all error codes and messages displayed in the `Last_SQL_Errno` and `Last_SQL_Error` columns correspond to error values listed in Server Error Message Reference. This was not always true in previous versions. (Bug #11760365, Bug #52768)

* `Replicate_Ignore_Server_Ids`

  Any server IDs that have been specified using the `IGNORE_SERVER_IDS` option of the `CHANGE REPLICATION SOURCE TO` statement, so that the replica ignores events from these servers. This option is used in a circular or other multi-source replication setup when one of the servers is removed. If any server IDs have been set in this way, a comma-delimited list of one or more numbers is shown. If no server IDs have been set, the field is blank.

  Note

  The `Ignored_server_ids` value in the `slave_master_info` table also shows the server IDs to be ignored, but as a space-delimited list, preceded by the total number of server IDs to be ignored. For example, if a [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement") statement containing the `IGNORE_SERVER_IDS = (2,6,9)` option has been issued to tell a replica to ignore sources having the server ID 2, 6, or 9, that information appears as shown here:

  ```
  	Replicate_Ignore_Server_Ids: 2, 6, 9
  ```

  ```
  	Ignored_server_ids: 3, 2, 6, 9
  ```

  `Replicate_Ignore_Server_Ids` filtering is performed by the I/O (receiver) thread, rather than by the SQL (applier) thread, which means that events which are filtered out are not written to the relay log. This differs from the filtering actions taken by server options such `--replicate-do-table`, which apply to the applier thread.

  If `SET gtid_mode=ON` is issued when any channel has existing server IDs set with `IGNORE_SERVER_IDS`, the statement is rejected with an error. Before starting GTID-based replication, use [`SHOW REPLICA STATUS`](show-replica-status.html "15.7.7.36 SHOW REPLICA STATUS Statement") to check for and clear all ignored server ID lists on the servers involved. You can clear a list by issuing a [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement") statement using `IGNORE_SERVER_IDS=()`—that is, with an empty list of server IDs.

* `Source_Server_Id`

  The `server_id` value from the source.

* `Source_UUID`

  The `server_uuid` value from the source.

* `Source_Info_File`

  The location of the `master.info` file, the use of which is now deprecated. By default, a table is used instead for the replica's connection metadata repository.

* `SQL_Delay`

  The number of seconds that the replica must lag the source.

* `SQL_Remaining_Delay`

  When `Replica_SQL_Running_State` is `Waiting until SOURCE_DELAY seconds after source executed event`, this field contains the number of delay seconds remaining. At other times, this field is `NULL`.

* `Replica_SQL_Running_State`

  The state of the SQL thread (analogous to `Replica_IO_State`). The value is identical to the `State` value of the SQL thread as displayed by [`SHOW PROCESSLIST`](show-processlist.html "15.7.7.32 SHOW PROCESSLIST Statement"). Section 10.14.6, “Replication SQL Thread States”, provides a listing of possible states.

* `Source_Retry_Count`

  The number of times the replica can attempt to reconnect to the source in the event of a lost connection. This value can be set using the `SOURCE_RETRY_COUNT` option of the [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement") statement.

* `Source_Bind`

  The network interface that the replica is bound to, if any. This is set using the `SOURCE_BIND` option for the [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement") statement.

* `Last_IO_Error_Timestamp`

  A timestamp in *`YYMMDD hh:mm:ss`* format that shows when the most recent I/O error took place.

* `Last_SQL_Error_Timestamp`

  A timestamp in *`YYMMDD hh:mm:ss`* format that shows when the most recent SQL error occurred.

* `Retrieved_Gtid_Set`

  The set of global transaction IDs corresponding to all transactions received by this replica. Empty if GTIDs are not in use. See GTID Sets for more information.

  This is the set of all GTIDs that exist or have existed in the relay logs. Each GTID is added as soon as the `Gtid_log_event` is received. This can cause partially transmitted transactions to have their GTIDs included in the set.

  When all relay logs are lost due to executing `RESET REPLICA` or `CHANGE REPLICATION SOURCE TO`, or due to the effects of the `--relay-log-recovery` option, the set is cleared. When `relay_log_purge = 1`, the newest relay log is always kept, and the set is not cleared.

* `Executed_Gtid_Set`

  The set of global transaction IDs written in the binary log. This is the same as the value for the global `gtid_executed` system variable on this server, as well as the value for `Executed_Gtid_Set` in the output of `SHOW BINARY LOG STATUS` on this server. Empty if GTIDs are not in use. See GTID Sets for more information.

* `Auto_Position`

  1 if GTID auto-positioning is in use for the channel, otherwise 0.

* `Replicate_Rewrite_DB`

  The `Replicate_Rewrite_DB` value displays any replication filtering rules that were specified. For example, if the following replication filter rule was set:

  ```
  CHANGE REPLICATION FILTER REPLICATE_REWRITE_DB=((db1,db2), (db3,db4));
  ```

  the `Replicate_Rewrite_DB` value displays:

  ```
  Replicate_Rewrite_DB: (db1,db2),(db3,db4)
  ```

  For more information, see Section 15.4.2.1, “CHANGE REPLICATION FILTER Statement”.

* `Channel_name`

  The replication channel which is being displayed. There is always a default replication channel, and more replication channels can be added. See Section 19.2.2, “Replication Channels” for more information.

* `Master_TLS_Version`

  The TLS version used on the source. For TLS version information, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

* `Source_public_key_path`

  The path name to a file containing a replica-side copy of the public key required by the source for RSA key pair-based password exchange. The file must be in PEM format. This column applies to replicas that authenticate with the `sha256_password` or `caching_sha2_password` authentication plugin.

  If `Source_public_key_path` is given and specifies a valid public key file, it takes precedence over `Get_source_public_key`.

* `Get_source_public_key`

  Whether to request from the source the public key required for RSA key pair-based password exchange. This column applies to replicas that authenticate with the `caching_sha2_password` authentication plugin. For that plugin, the source does not send the public key unless requested.

  If `Source_public_key_path` is given and specifies a valid public key file, it takes precedence over `Get_source_public_key`.

* `Network_Namespace`

  The network namespace name; empty if the connection uses the default (global) namespace. For information about network namespaces, see Section 7.1.14, “Network Namespace Support”.


#### 15.7.7.37 SHOW REPLICAS Statement

```
SHOW REPLICAS
```

Displays a list of replicas currently registered with the source. `SHOW REPLICAS` requires the `REPLICATION SLAVE` privilege.

`SHOW REPLICAS` should be executed on a server that acts as a replication source. The statement displays information about servers that are or have been connected as replicas, with each row of the result corresponding to one replica server, as shown here:

```
mysql> SHOW REPLICAS;
+------------+-----------+------+-----------+--------------------------------------+
| Server_id  | Host      | Port | Source_id | Replica_UUID                         |
+------------+-----------+------+-----------+--------------------------------------+
|         10 | iconnect2 | 3306 |         3 | 14cb6624-7f93-11e0-b2c0-c80aa9429562 |
|         21 | athena    | 3306 |         3 | 07af4990-f41f-11df-a566-7ac56fdaf645 |
+------------+-----------+------+-----------+--------------------------------------+
```

* `Server_id`: The unique server ID of the replica server, as configured in the replica server's option file, or on the command line with `--server-id=value`.

* `Host`: The host name of the replica server, as specified on the replica with the `--report-host` option. This can differ from the machine name as configured in the operating system.

* `User`: The replica server user name, as specified on the replica with the `--report-user` option. Statement output includes this column only if the source server is started with the `--show-replica-auth-info` option.

* `Password`: The replica server password, as specified on the replica with the `--report-password` option. Statement output includes this column only if the source server is started with the `--show-replica-auth-info` option.

* `Port`: The port on the source to which the replica server is listening, as specified on the replica with the `--report-port` option.

  A zero in this column means that the replica port (`--report-port`) was not set.

* `Source_id`: The unique server ID of the source server that the replica server is replicating from. This is the server ID of the server on which `SHOW REPLICAS` is executed, so this same value is listed for each row in the result.

* `Replica_UUID`: The globally unique ID of this replica, as generated on the replica and found in the replica's `auto.cnf` file.


#### 15.7.7.38 SHOW STATUS Statement

```
SHOW [GLOBAL | SESSION] STATUS
    [LIKE 'pattern' | WHERE expr]
```

`SHOW STATUS` provides server status information (see Section 7.1.10, “Server Status Variables”). This statement does not require any privilege. It requires only the ability to connect to the server.

Status variable information is also available from these sources:

* Performance Schema tables. See Section 29.12.15, “Performance Schema Status Variable Tables”.

* The **mysqladmin extended-status** command. See Section 6.5.2, “mysqladmin — A MySQL Server Administration Program”.

For `SHOW STATUS`, a `LIKE` clause, if present, indicates which variable names to match. A `WHERE` clause can be given to select rows using more general conditions, as discussed in Section 28.8, “Extensions to SHOW Statements”.

`SHOW STATUS` accepts an optional `GLOBAL` or `SESSION` variable scope modifier:

* With a `GLOBAL` modifier, the statement displays the global status values. A global status variable may represent status for some aspect of the server itself (for example, `Aborted_connects`), or the aggregated status over all connections to MySQL (for example, `Bytes_received` and `Bytes_sent`). If a variable has no global value, the session value is displayed.

* With a `SESSION` modifier, the statement displays the status variable values for the current connection. If a variable has no session value, the global value is displayed. `LOCAL` is a synonym for `SESSION`.

* If no modifier is present, the default is `SESSION`.

The scope for each status variable is listed at Section 7.1.10, “Server Status Variables”.

Each invocation of the [`SHOW STATUS`](show-status.html "15.7.7.38 SHOW STATUS Statement") statement uses an internal temporary table and increments the global `Created_tmp_tables` value.

Partial output is shown here. The list of names and values may differ for your server. The meaning of each variable is given in Section 7.1.10, “Server Status Variables”.

```
mysql> SHOW STATUS;
+--------------------------+------------+
| Variable_name            | Value      |
+--------------------------+------------+
| Aborted_clients          | 0          |
| Aborted_connects         | 0          |
| Bytes_received           | 155372598  |
| Bytes_sent               | 1176560426 |
| Connections              | 30023      |
| Created_tmp_disk_tables  | 0          |
| Created_tmp_tables       | 8340       |
| Created_tmp_files        | 60         |
...
| Open_tables              | 1          |
| Open_files               | 2          |
| Open_streams             | 0          |
| Opened_tables            | 44600      |
| Questions                | 2026873    |
...
| Table_locks_immediate    | 1920382    |
| Table_locks_waited       | 0          |
| Threads_cached           | 0          |
| Threads_created          | 30022      |
| Threads_connected        | 1          |
| Threads_running          | 1          |
| Uptime                   | 80380      |
+--------------------------+------------+
```

With a `LIKE` clause, the statement displays only rows for those variables with names that match the pattern:

```
mysql> SHOW STATUS LIKE 'Key%';
+--------------------+----------+
| Variable_name      | Value    |
+--------------------+----------+
| Key_blocks_used    | 14955    |
| Key_read_requests  | 96854827 |
| Key_reads          | 162040   |
| Key_write_requests | 7589728  |
| Key_writes         | 3813196  |
+--------------------+----------+
```


#### 15.7.7.39 SHOW TABLE STATUS Statement

```
SHOW TABLE STATUS
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

`SHOW TABLE STATUS` works like `SHOW TABLES`, but provides a lot of information about each non-`TEMPORARY` table. You can also get this list using the [**mysqlshow --status *`db_name`***](mysqlshow.html "6.5.6 mysqlshow — Display Database, Table, and Column Information") command. The `LIKE` clause, if present, indicates which table names to match. The `WHERE` clause can be given to select rows using more general conditions, as discussed in Section 28.8, “Extensions to SHOW Statements”.

This statement also displays information about views.

`SHOW TABLE STATUS` output has these columns:

* `Name`

  The name of the table.

* `Engine`

  The storage engine for the table. See Chapter 17, *The InnoDB Storage Engine*, and Chapter 18, *Alternative Storage Engines*.

  For partitioned tables, `Engine` shows the name of the storage engine used by all partitions.

* `Version`

  This column is unused. With the removal of `.frm` files in MySQL 8.0, this column now reports a hardcoded value of `10`, which was the last `.frm` file version used in MySQL 5.7.

* `Row_format`

  The row-storage format (`Fixed`, `Dynamic`, `Compressed`, `Redundant`, `Compact`). For `MyISAM` tables, `Dynamic` corresponds to what **myisamchk -dvv** reports as `Packed`.

* `Rows`

  The number of rows. Some storage engines, such as `MyISAM`, store the exact count. For other storage engines, such as `InnoDB`, this value is an approximation, and may vary from the actual value by as much as 40% to 50%. In such cases, use `SELECT COUNT(*)` to obtain an accurate count.

  The `Rows` value is `NULL` for `INFORMATION_SCHEMA` tables.

  For `InnoDB` tables, the row count is only a rough estimate used in SQL optimization. (This is also true if the `InnoDB` table is partitioned.)

* `Avg_row_length`

  The average row length.

* `Data_length`

  For `MyISAM`, `Data_length` is the length of the data file, in bytes.

  For `InnoDB`, `Data_length` is the approximate amount of space allocated for the clustered index, in bytes. Specifically, it is the clustered index size, in pages, multiplied by the `InnoDB` page size.

  Refer to the notes at the end of this section for information regarding other storage engines.

* `Max_data_length`

  For `MyISAM`, `Max_data_length` is maximum length of the data file. This is the total number of bytes of data that can be stored in the table, given the data pointer size used.

  Unused for `InnoDB`.

  Refer to the notes at the end of this section for information regarding other storage engines.

* `Index_length`

  For `MyISAM`, `Index_length` is the length of the index file, in bytes.

  For `InnoDB`, `Index_length` is the approximate amount of space allocated for non-clustered indexes, in bytes. Specifically, it is the sum of non-clustered index sizes, in pages, multiplied by the `InnoDB` page size.

  Refer to the notes at the end of this section for information regarding other storage engines.

* `Data_free`

  The number of allocated but unused bytes.

  `InnoDB` tables report the free space of the tablespace to which the table belongs. For a table located in the shared tablespace, this is the free space of the shared tablespace. If you are using multiple tablespaces and the table has its own tablespace, the free space is for only that table. Free space means the number of bytes in completely free extents minus a safety margin. Even if free space displays as 0, it may be possible to insert rows as long as new extents need not be allocated.

  For NDB Cluster, `Data_free` shows the space allocated on disk for, but not used by, a Disk Data table or fragment on disk. (In-memory data resource usage is reported by the `Data_length` column.)

  For partitioned tables, this value is only an estimate and may not be absolutely correct. A more accurate method of obtaining this information in such cases is to query the `INFORMATION_SCHEMA` `PARTITIONS` table, as shown in this example:

  ```
  SELECT SUM(DATA_FREE)
      FROM  INFORMATION_SCHEMA.PARTITIONS
      WHERE TABLE_SCHEMA = 'mydb'
      AND   TABLE_NAME   = 'mytable';
  ```

  For more information, see Section 28.3.26, “The INFORMATION\_SCHEMA PARTITIONS Table”.

* `Auto_increment`

  The next `AUTO_INCREMENT` value.

* `Create_time`

  When the table was created.

* `Update_time`

  When the data file was last updated. For some storage engines, this value is `NULL`. For example, `InnoDB` stores multiple tables in its [system tablespace](/doc/refman/8.4/en/glossary.html#glos_system_tablespace) and the data file timestamp does not apply. Even with file-per-table mode with each `InnoDB` table in a separate `.ibd` file, [change buffering](glossary.html#glos_change_buffering "change buffering") can delay the write to the data file, so the file modification time is different from the time of the last insert, update, or delete. For `MyISAM`, the data file timestamp is used; however, on Windows the timestamp is not updated by updates, so the value is inaccurate.

  `Update_time` displays a timestamp value for the last `UPDATE`, `INSERT`, or `DELETE` performed on `InnoDB` tables that are not partitioned. For MVCC, the timestamp value reflects the `COMMIT` time, which is considered the last update time. Timestamps are not persisted when the server is restarted or when the table is evicted from the `InnoDB` data dictionary cache.

* `Check_time`

  When the table was last checked. Not all storage engines update this time, in which case, the value is always `NULL`.

  For partitioned `InnoDB` tables, `Check_time` is always `NULL`.

* `Collation`

  The table default collation. The output does not explicitly list the table default character set, but the collation name begins with the character set name.

* `Checksum`

  The live checksum value, if any.

* `Create_options`

  Extra options used with [`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement").

  `Create_options` shows `partitioned` for a partitioned table.

  `Create_options` shows the `ENCRYPTION` clause for file-per-table tablespaces if the table is encrypted or if the specified encryption differs from the schema encryption. The encryption clause is not shown for tables created in general tablespaces. To identify encrypted file-per-table and general tablespaces, query the `INNODB_TABLESPACES` `ENCRYPTION` column.

  When creating a table with strict mode disabled, the storage engine's default row format is used if the specified row format is not supported. The actual row format of the table is reported in the `Row_format` column. `Create_options` shows the row format that was specified in the [`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement") statement.

  When altering the storage engine of a table, table options that are not applicable to the new storage engine are retained in the table definition to enable reverting the table with its previously defined options to the original storage engine, if necessary. `Create_options` may show retained options.

* `Comment`

  The comment used when creating the table (or information as to why MySQL could not access the table information).

##### Notes

* For `InnoDB` tables, `SHOW TABLE STATUS` does not give accurate statistics except for the physical size reserved by the table. The row count is only a rough estimate used in SQL optimization.

* For `NDB` tables, the output of this statement shows appropriate values for the `Avg_row_length` and `Data_length` columns, with the exception that `BLOB` columns are not taken into account.

* For `NDB` tables, `Data_length` includes data stored in main memory only; the `Max_data_length` and `Data_free` columns apply to Disk Data.

* For NDB Cluster Disk Data tables, `Max_data_length` shows the space allocated for the disk part of a Disk Data table or fragment. (In-memory data resource usage is reported by the `Data_length` column.)

* For `MEMORY` tables, the `Data_length`, `Max_data_length`, and `Index_length` values approximate the actual amount of allocated memory. The allocation algorithm reserves memory in large amounts to reduce the number of allocation operations.

* For views, most columns displayed by `SHOW TABLE STATUS` are 0 or `NULL` except that `Name` indicates the view name, `Create_time` indicates the creation time, and `Comment` says `VIEW`.

Table information is also available from the `INFORMATION_SCHEMA` `TABLES` table. See Section 28.3.44, “The INFORMATION\_SCHEMA TABLES Table”.


#### 15.7.7.40 SHOW TABLES Statement

```
SHOW [EXTENDED] [FULL] TABLES
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

`SHOW TABLES` lists the non-`TEMPORARY` tables in a given database. You can also get this list using the [**mysqlshow *`db_name`***](mysqlshow.html "6.5.6 mysqlshow — Display Database, Table, and Column Information") command. The `LIKE` clause, if present, indicates which table names to match. The `WHERE` clause can be given to select rows using more general conditions, as discussed in Section 28.8, “Extensions to SHOW Statements”.

Matching performed by the `LIKE` clause is dependent on the setting of the `lower_case_table_names` system variable.

The optional `EXTENDED` modifier causes `SHOW TABLES` to list hidden tables created by failed `ALTER TABLE` statements. These temporary tables have names beginning with `#sql` and can be dropped using `DROP TABLE`.

This statement also lists any views in the database. The optional `FULL` modifier causes `SHOW TABLES` to display a second output column with values of `BASE TABLE` for a table, `VIEW` for a view, or `SYSTEM VIEW` for an `INFORMATION_SCHEMA` table.

If you have no privileges for a base table or view, it does not show up in the output from [`SHOW TABLES`](show-tables.html "15.7.7.40 SHOW TABLES Statement") or **mysqlshow db\_name**.

Table information is also available from the `INFORMATION_SCHEMA` `TABLES` table. See Section 28.3.44, “The INFORMATION\_SCHEMA TABLES Table”.


#### 15.7.7.41 SHOW TRIGGERS Statement

```
SHOW TRIGGERS
    [{FROM | IN} db_name]
    [LIKE 'pattern' | WHERE expr]
```

`SHOW TRIGGERS` lists the triggers currently defined for tables in a database (the default database unless a `FROM` clause is given). This statement returns results only for databases and tables for which you have the `TRIGGER` privilege. The `LIKE` clause, if present, indicates which table names (not trigger names) to match and causes the statement to display triggers for those tables. The `WHERE` clause can be given to select rows using more general conditions, as discussed in Section 28.8, “Extensions to SHOW Statements”.

For the `ins_sum` trigger defined in Section 27.4, “Using Triggers”, the output of `SHOW TRIGGERS` is as shown here:

```
mysql> SHOW TRIGGERS LIKE 'acc%'\G
*************************** 1. row ***************************
             Trigger: ins_sum
               Event: INSERT
               Table: account
           Statement: SET @sum = @sum + NEW.amount
              Timing: BEFORE
             Created: 2018-08-08 10:10:12.61
            sql_mode: ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,
                      NO_ZERO_IN_DATE,NO_ZERO_DATE,
                      ERROR_FOR_DIVISION_BY_ZERO,
                      NO_ENGINE_SUBSTITUTION
             Definer: me@localhost
character_set_client: utf8mb4
collation_connection: utf8mb4_0900_ai_ci
  Database Collation: utf8mb4_0900_ai_ci
```

`SHOW TRIGGERS` output has these columns:

* `Trigger`

  The name of the trigger.

* `Event`

  The trigger event. This is the type of operation on the associated table for which the trigger activates. The value is `INSERT` (a row was inserted), `DELETE` (a row was deleted), or `UPDATE` (a row was modified).

* `Table`

  The table for which the trigger is defined.

* `Statement`

  The trigger body; that is, the statement executed when the trigger activates.

* `Timing`

  Whether the trigger activates before or after the triggering event. The value is `BEFORE` or `AFTER`.

* `Created`

  The date and time when the trigger was created. This is a `TIMESTAMP(2)` value (with a fractional part in hundredths of seconds) for triggers.

* `sql_mode`

  The SQL mode in effect when the trigger was created, and under which the trigger executes. For the permitted values, see Section 7.1.11, “Server SQL Modes”.

* `Definer`

  The account of the user who created the trigger, in `'user_name'@'host_name'` format.

* `character_set_client`

  The session value of the `character_set_client` system variable when the trigger was created.

* `collation_connection`

  The session value of the `collation_connection` system variable when the trigger was created.

* `Database Collation`

  The collation of the database with which the trigger is associated.

Trigger information is also available from the `INFORMATION_SCHEMA` `TRIGGERS` table. See Section 28.3.50, “The INFORMATION\_SCHEMA TRIGGERS Table”.


#### 15.7.7.42 SHOW VARIABLES Statement

```
SHOW [GLOBAL | SESSION] VARIABLES
    [LIKE 'pattern' | WHERE expr]
```

`SHOW VARIABLES` shows the values of MySQL system variables (see Section 7.1.8, “Server System Variables”). This statement does not require any privilege. It requires only the ability to connect to the server.

System variable information is also available from these sources:

* Performance Schema tables. See Section 29.12.14, “Performance Schema System Variable Tables”.

* The **mysqladmin variables** command. See Section 6.5.2, “mysqladmin — A MySQL Server Administration Program”.

For `SHOW VARIABLES`, a `LIKE` clause, if present, indicates which variable names to match. A `WHERE` clause can be given to select rows using more general conditions, as discussed in Section 28.8, “Extensions to SHOW Statements”.

`SHOW VARIABLES` accepts an optional `GLOBAL` or `SESSION` variable scope modifier:

* With a `GLOBAL` modifier, the statement displays global system variable values. These are the values used to initialize the corresponding session variables for new connections to MySQL. If a variable has no global value, no value is displayed.

* With a `SESSION` modifier, the statement displays the system variable values that are in effect for the current connection. If a variable has no session value, the global value is displayed. `LOCAL` is a synonym for `SESSION`.

* If no modifier is present, the default is `SESSION`.

The scope for each system variable is listed at Section 7.1.8, “Server System Variables”.

`SHOW VARIABLES` is subject to a version-dependent display-width limit. For variables with very long values that are not completely displayed, use `SELECT` as a workaround. For example:

```
SELECT @@GLOBAL.innodb_data_file_path;
```

Most system variables can be set at server startup (read-only variables such as `version_comment` are exceptions). Many can be changed at runtime with the `SET` statement. See Section 7.1.9, “Using System Variables”, and Section 15.7.6.1, “SET Syntax for Variable Assignment”.

Partial output is shown here. The list of names and values may differ for your server. Section 7.1.8, “Server System Variables”, describes the meaning of each variable, and Section 7.1.1, “Configuring the Server”, provides information about tuning them.

```
mysql> SHOW VARIABLES;
+-------------------------------------------------------+-----------------------+
| Variable_name                                         | Value                 |
+-------------------------------------------------------+-----------------------+
| activate_all_roles_on_login                           | OFF                   |
| admin_address                                         |                       |
| admin_port                                            | 33062                 |
| admin_ssl_ca                                          |                       |
| admin_ssl_capath                                      |                       |
| admin_ssl_cert                                        |                       |
| admin_ssl_cipher                                      |                       |
| admin_ssl_crl                                         |                       |
| admin_ssl_crlpath                                     |                       |
| admin_ssl_key                                         |                       |
| admin_tls_ciphersuites                                |                       |
| admin_tls_version                                     | TLSv1.2,TLSv1.3       |
| authentication_policy                                 | *,,                   |
| auto_generate_certs                                   | ON                    |
| auto_increment_increment                              | 1                     |
| auto_increment_offset                                 | 1                     |
| autocommit                                            | ON                    |
| automatic_sp_privileges                               | ON                    |
| avoid_temporal_upgrade                                | OFF                   |
| back_log                                              | 151                   |
| basedir                                               | /local/mysql-8.4/     |
| big_tables                                            | OFF                   |
| bind_address                                          | 127.0.0.1             |
| binlog_cache_size                                     | 32768                 |
| binlog_checksum                                       | CRC32                 |
| binlog_direct_non_transactional_updates               | OFF                   |
| binlog_encryption                                     | OFF                   |
| binlog_error_action                                   | ABORT_SERVER          |
| binlog_expire_logs_auto_purge                         | ON                    |
| binlog_expire_logs_seconds                            | 2592000               |

...

| max_error_count                                       | 1024                  |
| max_execution_time                                    | 0                     |
| max_heap_table_size                                   | 16777216              |
| max_insert_delayed_threads                            | 20                    |
| max_join_size                                         | 18446744073709551615  |
| max_length_for_sort_data                              | 4096                  |
| max_points_in_geometry                                | 65536                 |
| max_prepared_stmt_count                               | 16382                 |
| max_relay_log_size                                    | 0                     |
| max_seeks_for_key                                     | 18446744073709551615  |
| max_sort_length                                       | 1024                  |
| max_sp_recursion_depth                                | 0                     |
| max_user_connections                                  | 0                     |
| max_write_lock_count                                  | 18446744073709551615  |

...

| time_zone                                             | SYSTEM                |
| timestamp                                             | 1682684938.710453     |
| tls_certificates_enforced_validation                  | OFF                   |
| tls_ciphersuites                                      |                       |
| tls_version                                           | TLSv1.2,TLSv1.3       |
| tmp_table_size                                        | 16777216              |
| tmpdir                                                | /tmp                  |
| transaction_alloc_block_size                          | 8192                  |
| transaction_allow_batching                            | OFF                   |
| transaction_isolation                                 | REPEATABLE-READ       |
| transaction_prealloc_size                             | 4096                  |
| transaction_read_only                                 | OFF                   |
| unique_checks                                         | ON                    |
| updatable_views_with_limit                            | YES                   |
| use_secondary_engine                                  | ON                    |
| version                                               | 9.5.0                 |
| version_comment                                       | Source distribution   |
| version_compile_machine                               | x86_64                |
| version_compile_os                                    | Linux                 |
| version_compile_zlib                                  | 1.2.13                |
| wait_timeout                                          | 28800                 |
| warning_count                                         | 0                     |
| windowing_use_high_precision                          | ON                    |
| xa_detach_on_prepare                                  | ON                    |
+-------------------------------------------------------+-----------------------+
```

With a `LIKE` clause, the statement displays only rows for those variables with names that match the pattern. To obtain the row for a specific variable, use a `LIKE` clause as shown:

```
SHOW VARIABLES LIKE 'max_join_size';
SHOW SESSION VARIABLES LIKE 'max_join_size';
```

To get a list of variables whose name match a pattern, use the `%` wildcard character in a `LIKE` clause:

```
SHOW VARIABLES LIKE '%size%';
SHOW GLOBAL VARIABLES LIKE '%size%';
```

Wildcard characters can be used in any position within the pattern to be matched. Strictly speaking, because `_` is a wildcard that matches any single character, you should escape it as `\_` to match it literally. In practice, this is rarely necessary.


#### 15.7.7.43 SHOW WARNINGS Statement

```
SHOW WARNINGS [LIMIT [offset,] row_count]
SHOW COUNT(*) WARNINGS
```

`SHOW WARNINGS` is a diagnostic statement that displays information about the conditions (errors, warnings, and notes) resulting from executing a statement in the current session. Warnings are generated for DML statements such as `INSERT`, `UPDATE`, and `LOAD DATA` as well as DDL statements such as `CREATE TABLE` and `ALTER TABLE`.

The `LIMIT` clause has the same syntax as for the `SELECT` statement. See Section 15.2.13, “SELECT Statement”.

`SHOW WARNINGS` is also used following `EXPLAIN`, to display the extended information generated by `EXPLAIN`. See Section 10.8.3, “Extended EXPLAIN Output Format”.

`SHOW WARNINGS` displays information about the conditions resulting from execution of the most recent nondiagnostic statement in the current session. If the most recent statement resulted in an error during parsing, `SHOW WARNINGS` shows the resulting conditions, regardless of statement type (diagnostic or nondiagnostic).

The [`SHOW COUNT(*) WARNINGS`](show-warnings.html "15.7.7.43 SHOW WARNINGS Statement") diagnostic statement displays the total number of errors, warnings, and notes. You can also retrieve this number from the `warning_count` system variable:

```
SHOW COUNT(*) WARNINGS;
SELECT @@warning_count;
```

A difference in these statements is that the first is a diagnostic statement that does not clear the message list. The second, because it is a `SELECT` statement is considered nondiagnostic and does clear the message list.

A related diagnostic statement, [`SHOW ERRORS`](show-errors.html "15.7.7.19 SHOW ERRORS Statement"), shows only error conditions (it excludes warnings and notes), and [`SHOW COUNT(*) ERRORS`](show-warnings.html "15.7.7.43 SHOW WARNINGS Statement") statement displays the total number of errors. See Section 15.7.7.19, “SHOW ERRORS Statement”. [`GET DIAGNOSTICS`](get-diagnostics.html "15.6.7.3 GET DIAGNOSTICS Statement") can be used to examine information for individual conditions. See Section 15.6.7.3, “GET DIAGNOSTICS Statement”.

Here is a simple example that shows data-conversion warnings for `INSERT`. The example assumes that strict SQL mode is disabled. With strict mode enabled, the warnings would become errors and terminate the `INSERT`.

```
mysql> CREATE TABLE t1 (a TINYINT NOT NULL, b CHAR(4));
Query OK, 0 rows affected (0.05 sec)

mysql> INSERT INTO t1 VALUES(10,'mysql'), (NULL,'test'), (300,'xyz');
Query OK, 3 rows affected, 3 warnings (0.00 sec)
Records: 3  Duplicates: 0  Warnings: 3

mysql> SHOW WARNINGS\G
*************************** 1. row ***************************
  Level: Warning
   Code: 1265
Message: Data truncated for column 'b' at row 1
*************************** 2. row ***************************
  Level: Warning
   Code: 1048
Message: Column 'a' cannot be null
*************************** 3. row ***************************
  Level: Warning
   Code: 1264
Message: Out of range value for column 'a' at row 3
3 rows in set (0.00 sec)
```

The `max_error_count` system variable controls the maximum number of error, warning, and note messages for which the server stores information, and thus the number of messages that [`SHOW WARNINGS`](show-warnings.html "15.7.7.43 SHOW WARNINGS Statement") displays. To change the number of messages the server can store, change the value of `max_error_count`.

`max_error_count` controls only how many messages are stored, not how many are counted. The value of `warning_count` is not limited by `max_error_count`, even if the number of messages generated exceeds `max_error_count`. The following example demonstrates this. The [`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement") statement produces three warning messages (strict SQL mode is disabled for the example to prevent an error from occurring after a single conversion issue). Only one message is stored and displayed because `max_error_count` has been set to 1, but all three are counted (as shown by the value of `warning_count`):

```
mysql> SHOW VARIABLES LIKE 'max_error_count';
+-----------------+-------+
| Variable_name   | Value |
+-----------------+-------+
| max_error_count | 1024  |
+-----------------+-------+
1 row in set (0.00 sec)

mysql> SET max_error_count=1, sql_mode = '';
Query OK, 0 rows affected (0.00 sec)

mysql> ALTER TABLE t1 MODIFY b CHAR;
Query OK, 3 rows affected, 3 warnings (0.00 sec)
Records: 3  Duplicates: 0  Warnings: 3

mysql> SHOW WARNINGS;
+---------+------+----------------------------------------+
| Level   | Code | Message                                |
+---------+------+----------------------------------------+
| Warning | 1263 | Data truncated for column 'b' at row 1 |
+---------+------+----------------------------------------+
1 row in set (0.00 sec)

mysql> SELECT @@warning_count;
+-----------------+
| @@warning_count |
+-----------------+
|               3 |
+-----------------+
1 row in set (0.01 sec)
```

To disable message storage, set `max_error_count` to 0. In this case, `warning_count` still indicates how many warnings occurred, but messages are not stored and cannot be displayed.

The `sql_notes` system variable controls whether note messages increment `warning_count` and whether the server stores them. By default, `sql_notes` is 1, but if set to 0, notes do not increment `warning_count` and the server does not store them:

```
mysql> SET sql_notes = 1;
mysql> DROP TABLE IF EXISTS test.no_such_table;
Query OK, 0 rows affected, 1 warning (0.00 sec)
mysql> SHOW WARNINGS;
+-------+------+------------------------------------+
| Level | Code | Message                            |
+-------+------+------------------------------------+
| Note  | 1051 | Unknown table 'test.no_such_table' |
+-------+------+------------------------------------+
1 row in set (0.00 sec)

mysql> SET sql_notes = 0;
mysql> DROP TABLE IF EXISTS test.no_such_table;
Query OK, 0 rows affected (0.00 sec)
mysql> SHOW WARNINGS;
Empty set (0.00 sec)
```

The MySQL server sends to each client a count indicating the total number of errors, warnings, and notes resulting from the most recent statement executed by that client. From the C API, this value can be obtained by calling `mysql_warning_count()`. See mysql\_warning\_count().

In the **mysql** client, you can enable and disable automatic warnings display using the `warnings` and `nowarning` commands, respectively, or their shortcuts, `\W` and `\w` (see Section 6.5.1.2, “mysql Client Commands”). For example:

```
mysql> \W
Show warnings enabled.
mysql> SELECT 1/0;
+------+
| 1/0  |
+------+
| NULL |
+------+
1 row in set, 1 warning (0.03 sec)

Warning (Code 1365): Division by 0
mysql> \w
Show warnings disabled.
```


### 15.7.8 Other Administrative Statements


#### 15.7.8.1 BINLOG Statement

```
BINLOG 'str'
```

`BINLOG` is an internal-use statement. It is generated by the **mysqlbinlog** program as the printable representation of certain events in binary log files. (See Section 6.6.9, “mysqlbinlog — Utility for Processing Binary Log Files”.) The `'str'` value is a base 64-encoded string the that server decodes to determine the data change indicated by the corresponding event.

To execute `BINLOG` statements when applying **mysqlbinlog** output, a user account requires the `BINLOG_ADMIN` privilege (or the deprecated `SUPER` privilege), or the `REPLICATION_APPLIER` privilege plus the appropriate privileges to execute each log event.

This statement can execute only format description events and row events.


#### 15.7.8.2 CACHE INDEX Statement

```
CACHE INDEX {
      tbl_index_list [, tbl_index_list] ...
    | tbl_name PARTITION (partition_list)
  }
  IN key_cache_name

tbl_index_list:
  tbl_name [{INDEX|KEY} (index_name[, index_name] ...)]

partition_list: {
    partition_name[, partition_name] ...
  | ALL
}
```

The `CACHE INDEX` statement assigns table indexes to a specific key cache. It applies only to `MyISAM` tables, including partitioned `MyISAM` tables. After the indexes have been assigned, they can be preloaded into the cache if desired with [`LOAD INDEX INTO CACHE`](load-index.html "15.7.8.5 LOAD INDEX INTO CACHE Statement").

The following statement assigns indexes from the tables `t1`, `t2`, and `t3` to the key cache named `hot_cache`:

```
mysql> CACHE INDEX t1, t2, t3 IN hot_cache;
+---------+--------------------+----------+----------+
| Table   | Op                 | Msg_type | Msg_text |
+---------+--------------------+----------+----------+
| test.t1 | assign_to_keycache | status   | OK       |
| test.t2 | assign_to_keycache | status   | OK       |
| test.t3 | assign_to_keycache | status   | OK       |
+---------+--------------------+----------+----------+
```

The syntax of `CACHE INDEX` enables you to specify that only particular indexes from a table should be assigned to the cache. However, the implementation assigns all the table's indexes to the cache, so there is no reason to specify anything other than the table name.

The key cache referred to in a [`CACHE INDEX`](cache-index.html "15.7.8.2 CACHE INDEX Statement") statement can be created by setting its size with a parameter setting statement or in the server parameter settings. For example:

```
SET GLOBAL keycache1.key_buffer_size=128*1024;
```

Key cache parameters are accessed as members of a structured system variable. See Section 7.1.9.5, “Structured System Variables”.

A key cache must exist before you assign indexes to it, or an error occurs:

```
mysql> CACHE INDEX t1 IN non_existent_cache;
ERROR 1284 (HY000): Unknown key cache 'non_existent_cache'
```

By default, table indexes are assigned to the main (default) key cache created at the server startup. When a key cache is destroyed, all indexes assigned to it are reassigned to the default key cache.

Index assignment affects the server globally: If one client assigns an index to a given cache, this cache is used for all queries involving the index, no matter which client issues the queries.

`CACHE INDEX` is supported for partitioned `MyISAM` tables. You can assign one or more indexes for one, several, or all partitions to a given key cache. For example, you can do the following:

```
CREATE TABLE pt (c1 INT, c2 VARCHAR(50), INDEX i(c1))
    ENGINE=MyISAM
    PARTITION BY HASH(c1)
    PARTITIONS 4;

SET GLOBAL kc_fast.key_buffer_size = 128 * 1024;
SET GLOBAL kc_slow.key_buffer_size = 128 * 1024;

CACHE INDEX pt PARTITION (p0) IN kc_fast;
CACHE INDEX pt PARTITION (p1, p3) IN kc_slow;
```

The previous set of statements performs the following actions:

* Creates a partitioned table with 4 partitions; these partitions are automatically named `p0`, ..., `p3`; this table has an index named `i` on column `c1`.

* Creates 2 key caches named `kc_fast` and `kc_slow`

* Assigns the index for partition `p0` to the `kc_fast` key cache and the index for partitions `p1` and `p3` to the `kc_slow` key cache; the index for the remaining partition (`p2`) uses the server's default key cache.

If you wish instead to assign the indexes for all partitions in table `pt` to a single key cache named `kc_all`, you can use either of the following two statements:

```
CACHE INDEX pt PARTITION (ALL) IN kc_all;

CACHE INDEX pt IN kc_all;
```

The two statements just shown are equivalent, and issuing either one has exactly the same effect. In other words, if you wish to assign indexes for all partitions of a partitioned table to the same key cache, the `PARTITION (ALL)` clause is optional.

When assigning indexes for multiple partitions to a key cache, the partitions need not be contiguous, and you need not list their names in any particular order. Indexes for any partitions not explicitly assigned to a key cache automatically use the server default key cache.

Index preloading is also supported for partitioned `MyISAM` tables. For more information, see Section 15.7.8.5, “LOAD INDEX INTO CACHE Statement”.


#### 15.7.8.3 FLUSH Statement

```
FLUSH [NO_WRITE_TO_BINLOG | LOCAL] {
    flush_option [, flush_option] ...
  | tables_option
}

flush_option: {
    BINARY LOGS
  | ENGINE LOGS
  | ERROR LOGS
  | GENERAL LOGS
  | LOGS
  | PRIVILEGES
  | OPTIMIZER_COSTS
  | RELAY LOGS [FOR CHANNEL channel]
  | SLOW LOGS
  | STATUS
  | USER_RESOURCES
}

tables_option: {
    table_synonym
  | table_synonym tbl_name [, tbl_name] ...
  | table_synonym WITH READ LOCK
  | table_synonym tbl_name [, tbl_name] ... WITH READ LOCK
  | table_synonym tbl_name [, tbl_name] ... FOR EXPORT
}

table_synonym: {
    TABLE
  | TABLES
}
```

The `FLUSH` statement has several variant forms that clear or reload various internal caches, flush tables, or acquire locks. Each `FLUSH` operation requires the privileges indicated in its description.

Note

It is not possible to issue `FLUSH` statements within stored functions or triggers. However, you may use `FLUSH` in stored procedures, so long as these are not called from stored functions or triggers. See Section 27.10, “Restrictions on Stored Programs”.

By default, the server writes `FLUSH` statements to the binary log so that they replicate to replicas. To suppress logging, specify the optional `NO_WRITE_TO_BINLOG` keyword or its alias `LOCAL`.

Note

`FLUSH LOGS`, `FLUSH BINARY LOGS`, `FLUSH TABLES WITH READ LOCK` (with or without a table list), and [`FLUSH TABLES tbl_name ... FOR EXPORT`](flush.html#flush-tables-for-export-with-list) are not written to the binary log in any case because they would cause problems if replicated to a replica.

The `FLUSH` statement causes an implicit commit. See Section 15.3.3, “Statements That Cause an Implicit Commit”.

The **mysqladmin** utility provides a command-line interface to some flush operations, using commands such as `flush-logs`, `flush-privileges`, `flush-status`, and `flush-tables`. See Section 6.5.2, “mysqladmin — A MySQL Server Administration Program”.

Sending a `SIGHUP` or `SIGUSR1` signal to the server causes several flush operations to occur that are similar to various forms of the `FLUSH` statement. Signals can be sent by the `root` system account or the system account that owns the server process. This enables the flush operations to be performed without having to connect to the server, which requires a MySQL account that has privileges sufficient for those operations. See Section 6.10, “Unix Signal Handling in MySQL”.

The `RESET` statement is similar to `FLUSH`. See Section 15.7.8.6, “RESET Statement”, for information about using `RESET` with replication.

The following list describes the permitted `FLUSH` statement *`flush_option`* values. For descriptions of the permitted *`tables_option`* values, see FLUSH TABLES Syntax.

* `FLUSH BINARY LOGS`

  Closes and reopens any binary log file to which the server is writing. If binary logging is enabled, the sequence number of the binary log file is incremented by one relative to the previous file.

  This operation requires the `RELOAD` privilege.

* `FLUSH ENGINE LOGS`

  Closes and reopens any flushable logs for installed storage engines. This causes `InnoDB` to flush its logs to disk.

  This operation requires the `RELOAD` privilege.

* `FLUSH ERROR LOGS`

  Closes and reopens any error log file to which the server is writing.

  This operation requires the `RELOAD` privilege.

* `FLUSH GENERAL LOGS`

  Closes and reopens any general query log file to which the server is writing.

  This operation requires the `RELOAD` privilege.

  This operation has no effect on tables used for the general query log (see Section 7.4.1, “Selecting General Query Log and Slow Query Log Output Destinations”).

* `FLUSH LOGS`

  Closes and reopens any log file to which the server is writing.

  This operation requires the `RELOAD` privilege.

  The effect of this operation is equivalent to the combined effects of these operations:

  ```
  FLUSH BINARY LOGS
  FLUSH ENGINE LOGS
  FLUSH ERROR LOGS
  FLUSH GENERAL LOGS
  FLUSH RELAY LOGS
  FLUSH SLOW LOGS
  ```

* `FLUSH OPTIMIZER_COSTS`

  Re-reads the cost model tables so that the optimizer starts using the current cost estimates stored in them.

  This operation requires the `FLUSH_OPTIMIZER_COSTS` or `RELOAD` privilege.

  The server writes a warning to the error log for any unrecognized cost model table entries. For information about these tables, see Section 10.9.5, “The Optimizer Cost Model”. This operation affects only sessions that begin subsequent to the flush. Existing sessions continue to use the cost estimates that were current when they began.

* `FLUSH PRIVILEGES`

  Note

  This statement is deprecated, and triggers a deprecation warning when used; you should expect `FLUSH PRIVILEGES` to be removed in a future version of MySQL.

  Re-reads the privileges from the grant tables in the `mysql` system schema. As part of this operation, the server reads the `global_grants` table containing dynamic privilege assignments and registers any unregistered privileges found there.

  Reloading the grant tables is necessary to enable updates to MySQL privileges and users only if you make such changes directly to the grant tables; it is not needed for account management statements such as `GRANT` or `REVOKE`, which take effect immediately. See Section 8.2.13, “When Privilege Changes Take Effect”, for more information.

  Manipulating the grant tables directly is not recommended, and should be considered deprecated functionality. Use access control statements such as `CREATE USER`, `GRANT`, `REVOKE`, as described in Section 8.2.8, “Adding Accounts, Assigning Privileges, and Dropping Accounts”, instead.

  This operation requires the `FLUSH_PRIVILEGES` privilege (deprecated) or the `RELOAD` privilege.

  If the `--skip-grant-tables` option was specified at server startup to disable the MySQL privilege system, [`FLUSH PRIVILEGES`](flush.html#flush-privileges) provides a way to enable the privilege system at runtime.

  Resets failed-login tracking (or enables it if the server was started with `--skip-grant-tables`) and unlocks any temporarily locked accounts. See Section 8.2.15, “Password Management”.

  Frees memory cached by the server as a result of `GRANT`, `CREATE USER`, `CREATE SERVER`, and `INSTALL PLUGIN` statements. This memory is not released by the corresponding `REVOKE`, `DROP USER`, `DROP SERVER`, and `UNINSTALL PLUGIN` statements, so for a server that executes many instances of the statements that cause caching, there is an increase in cached memory use unless it is freed with `FLUSH PRIVILEGES`.

  Clears the in-memory cache used by the `caching_sha2_password` authentication plugin. See Cache Operation for SHA-2 Pluggable Authentication.

* [`FLUSH RELAY LOGS [FOR CHANNEL channel]`](flush.html#flush-relay-logs)

  Closes and reopens any relay log file to which the server is writing. If relay logging is enabled, the sequence number of the relay log file is incremented by one relative to the previous file.

  This operation requires the `RELOAD` privilege.

  The `FOR CHANNEL channel` clause enables you to name which replication channel the operation applies to. Execute [`FLUSH RELAY LOGS FOR CHANNEL channel`](flush.html#flush-relay-logs) to flush the relay log for a specific replication channel. If no channel is named and no extra replication channels exist, the operation applies to the default channel. If no channel is named and multiple replication channels exist, the operation applies to all replication channels. For more information, see Section 19.2.2, “Replication Channels”.

* `FLUSH SLOW LOGS`

  Closes and reopens any slow query log file to which the server is writing.

  This operation requires the `RELOAD` privilege.

  This operation has no effect on tables used for the slow query log (see Section 7.4.1, “Selecting General Query Log and Slow Query Log Output Destinations”).

* `FLUSH STATUS`

  Flushes status indicators.

  This operation adds the current thread's session status variable values to the global values and resets the session values to zero. Some global variables may be reset to zero as well. It also resets the counters for key caches (default and named) to zero and sets `Max_used_connections` to the current number of open connections. This information may be of use when debugging a query. See Section 1.6, “How to Report Bugs or Problems”.

  `FLUSH STATUS` is unaffected by `read_only` or `super_read_only`, and is always written to the binary log.

  This operation requires the `FLUSH_STATUS` or `RELOAD` privilege.

* `FLUSH USER_RESOURCES`

  Resets all per-hour user resource indicators to zero.

  This operation requires the `FLUSH_USER_RESOURCES` or `RELOAD` privilege.

  Resetting resource indicators enables clients that have reached their hourly connection, query, or update limits to resume activity immediately. [`FLUSH USER_RESOURCES`](flush.html#flush-user-resources) does not apply to the limit on maximum simultaneous connections that is controlled by the `max_user_connections` system variable. See Section 8.2.21, “Setting Account Resource Limits”.

##### FLUSH TABLES Syntax

`FLUSH TABLES` flushes tables, and, depending on the variant used, acquires locks. Any `TABLES` variant used in a `FLUSH` statement must be the only option used. [`FLUSH TABLE`](flush.html#flush-tables) is a synonym for [`FLUSH TABLES`](flush.html#flush-tables).

Note

The descriptions here that indicate tables are flushed by closing them apply differently for `InnoDB`, which flushes table contents to disk but leaves them open. This still permits table files to be copied while the tables are open, as long as other activity does not modify them.

* `FLUSH TABLES`

  Closes all open tables, forces all tables in use to be closed, and flushes the prepared statement cache.

  This operation requires the `FLUSH_TABLES` or `RELOAD` privilege.

  For information about prepared statement caching, see Section 10.10.3, “Caching of Prepared Statements and Stored Programs”.

  `FLUSH TABLES` is not permitted when there is an active [`LOCK TABLES ... READ`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements"). To flush and lock tables, use [`FLUSH TABLES tbl_name ... WITH READ LOCK`](flush.html#flush-tables-with-read-lock-with-list) instead.

* [`FLUSH TABLES tbl_name [, tbl_name] ...`](flush.html#flush-tables-with-list)

  With a list of one or more comma-separated table names, this operation is like [`FLUSH TABLES`](flush.html#flush-tables) with no names except that the server flushes only the named tables. If a named table does not exist, no error occurs.

  This operation requires the `FLUSH_TABLES` or `RELOAD` privilege.

* [`FLUSH TABLES WITH READ LOCK`](flush.html#flush-tables-with-read-lock)

  Closes all open tables and locks all tables for all databases with a global read lock.

  This operation requires the `FLUSH_TABLES` or `RELOAD` privilege.

  This operation is a very convenient way to get backups if you have a file system such as Veritas or ZFS that can take snapshots in time. Use [`UNLOCK TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") to release the lock.

  `FLUSH TABLES WITH READ LOCK` acquires a global read lock rather than table locks, so it is not subject to the same behavior as `LOCK TABLES` and [`UNLOCK TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") with respect to table locking and implicit commits:

  + [`UNLOCK TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") implicitly commits any active transaction only if any tables currently have been locked with `LOCK TABLES`. The commit does not occur for [`UNLOCK TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") following [`FLUSH TABLES WITH READ LOCK`](flush.html#flush-tables-with-read-lock) because the latter statement does not acquire table locks.

  + Beginning a transaction causes table locks acquired with `LOCK TABLES` to be released, as though you had executed [`UNLOCK TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements"). Beginning a transaction does not release a global read lock acquired with [`FLUSH TABLES WITH READ LOCK`](flush.html#flush-tables-with-read-lock).

  `FLUSH TABLES WITH READ LOCK` does not prevent the server from inserting rows into the log tables (see Section 7.4.1, “Selecting General Query Log and Slow Query Log Output Destinations”).

* [`FLUSH TABLES tbl_name [, tbl_name] ... WITH READ LOCK`](flush.html#flush-tables-with-read-lock-with-list)

  Flushes and acquires read locks for the named tables.

  This operation requires the `FLUSH_TABLES` or `RELOAD` privilege. Because it acquires table locks, it also requires the `LOCK TABLES` privilege for each table.

  The operation first acquires exclusive metadata locks for the tables, so it waits for transactions that have those tables open to complete. Then the operation flushes the tables from the table cache, reopens the tables, acquires table locks (like [`LOCK TABLES ... READ`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements")), and downgrades the metadata locks from exclusive to shared. After the operation acquires locks and downgrades the metadata locks, other sessions can read but not modify the tables.

  This operation applies only to existing base (non-`TEMPORARY)` tables. If a name refers to a base table, that table is used. If it refers to a `TEMPORARY` table, it is ignored. If a name applies to a view, an `ER_WRONG_OBJECT` error occurs. Otherwise, an `ER_NO_SUCH_TABLE` error occurs.

  Use [`UNLOCK TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") to release the locks, `LOCK TABLES` to release the locks and acquire other locks, or [`START TRANSACTION`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") to release the locks and begin a new transaction.

  This `FLUSH TABLES` variant enables tables to be flushed and locked in a single operation. It provides a workaround for the restriction that `FLUSH TABLES` is not permitted when there is an active [`LOCK TABLES ... READ`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements").

  This operation does not perform an implicit [`UNLOCK TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements"), so an error results if you perform the operation while there is any active `LOCK TABLES` or use it a second time without first releasing the locks acquired.

  If a flushed table was opened with `HANDLER`, the handler is implicitly flushed and loses its position.

* [`FLUSH TABLES tbl_name [, tbl_name] ... FOR EXPORT`](flush.html#flush-tables-for-export-with-list)

  This `FLUSH TABLES` variant applies to `InnoDB` tables. It ensures that changes to the named tables have been flushed to disk so that binary table copies can be made while the server is running.

  This operation requires the `FLUSH_TABLES` or `RELOAD` privilege. Because it acquires locks on tables in preparation for exporting them, it also requires the [`LOCK TABLES`](privileges-provided.html#priv_lock-tables) and `SELECT` privileges for each table.

  The operation works like this:

  1. It acquires shared metadata locks for the named tables. The operation blocks as long as other sessions have active transactions that have modified those tables or hold table locks for them. When the locks have been acquired, the operation blocks transactions that attempt to update the tables, while permitting read-only operations to continue.

  2. It checks whether all storage engines for the tables support `FOR EXPORT`. If any do not, an `ER_ILLEGAL_HA` error occurs and the operation fails.

  3. The operation notifies the storage engine for each table to make the table ready for export. The storage engine must ensure that any pending changes are written to disk.

  4. The operation puts the session in lock-tables mode so that the metadata locks acquired earlier are not released when the `FOR EXPORT` operation completes.

  This operation applies only to existing base (non-`TEMPORARY`) tables. If a name refers to a base table, that table is used. If it refers to a `TEMPORARY` table, it is ignored. If a name applies to a view, an `ER_WRONG_OBJECT` error occurs. Otherwise, an `ER_NO_SUCH_TABLE` error occurs.

  `InnoDB` supports `FOR EXPORT` for tables that have their own [`.ibd` file](/doc/refman/8.4/en/glossary.html#glos_ibd_file) file (that is, tables created with the `innodb_file_per_table` setting enabled). `InnoDB` ensures when notified by the `FOR EXPORT` operation that any changes have been flushed to disk. This permits a binary copy of table contents to be made while the `FOR EXPORT` operation is in effect because the `.ibd` file is transaction consistent and can be copied while the server is running. `FOR EXPORT` does not apply to `InnoDB` system tablespace files, or to `InnoDB` tables that have `FULLTEXT` indexes.

  [`FLUSH TABLES ...FOR EXPORT`](flush.html#flush-tables-for-export-with-list) is supported for partitioned `InnoDB` tables.

  When notified by `FOR EXPORT`, `InnoDB` writes to disk certain kinds of data that is normally held in memory or in separate disk buffers outside the tablespace files. For each table, `InnoDB` also produces a file named `table_name.cfg` in the same database directory as the table. The `.cfg` file contains metadata needed to reimport the tablespace files later, into the same or different server.

  When the `FOR EXPORT` operation completes, `InnoDB` has flushed all dirty pages to the table data files. Any change buffer entries are merged prior to flushing. At this point, the tables are locked and quiescent: The tables are in a transactionally consistent state on disk and you can copy the `.ibd` tablespace files along with the corresponding `.cfg` files to get a consistent snapshot of those tables.

  For the procedure to reimport the copied table data into a MySQL instance, see Section 17.6.1.3, “Importing InnoDB Tables”.

  After you are done with the tables, use [`UNLOCK TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") to release the locks, `LOCK TABLES` to release the locks and acquire other locks, or [`START TRANSACTION`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") to release the locks and begin a new transaction.

  While any of these statements is in effect within the session, attempts to use [`FLUSH TABLES ... FOR EXPORT`](flush.html#flush-tables-for-export-with-list) produce an error:

  ```
  FLUSH TABLES ... WITH READ LOCK
  FLUSH TABLES ... FOR EXPORT
  LOCK TABLES ... READ
  LOCK TABLES ... WRITE
  ```

  While [`FLUSH TABLES ... FOR EXPORT`](flush.html#flush-tables-for-export-with-list) is in effect within the session, attempts to use any of these statements produce an error:

  ```
  FLUSH TABLES WITH READ LOCK
  FLUSH TABLES ... WITH READ LOCK
  FLUSH TABLES ... FOR EXPORT
  ```


#### 15.7.8.4 KILL Statement

```
KILL [CONNECTION | QUERY] processlist_id
```

Each connection to **mysqld** runs in a separate thread. You can kill a thread with the `KILL processlist_id` statement.

Thread processlist identifiers can be determined from the `ID` column of the `INFORMATION_SCHEMA` `PROCESSLIST` table, the `Id` column of [`SHOW PROCESSLIST`](show-processlist.html "15.7.7.32 SHOW PROCESSLIST Statement") output, and the `PROCESSLIST_ID` column of the Performance Schema `threads` table. The value for the current thread is returned by the `CONNECTION_ID()` function.

`KILL` permits an optional `CONNECTION` or `QUERY` modifier:

* [`KILL CONNECTION`](kill.html "15.7.8.4 KILL Statement") is the same as `KILL` with no modifier: It terminates the connection associated with the given *`processlist_id`*, after terminating any statement the connection is executing.

* `KILL QUERY` terminates the statement the connection is currently executing, but leaves the connection itself intact.

The ability to see which threads are available to be killed depends on the `PROCESS` privilege:

* Without `PROCESS`, you can see only your own threads.

* With `PROCESS`, you can see all threads.

The ability to kill threads and statements depends on the `CONNECTION_ADMIN` privilege and the deprecated `SUPER` privilege:

* Without `CONNECTION_ADMIN` or `SUPER`, you can kill only your own threads and statements.

* With `CONNECTION_ADMIN` or `SUPER`, you can kill all threads and statements, except that to affect a thread or statement that is executing with the `SYSTEM_USER` privilege, your own session must additionally have the `SYSTEM_USER` privilege.

You can also use the **mysqladmin processlist** and **mysqladmin kill** commands to examine and kill threads.

When you use `KILL`, a thread-specific kill flag is set for the thread. In most cases, it might take some time for the thread to die because the kill flag is checked only at specific intervals:

* During `SELECT` operations, for `ORDER BY` and `GROUP BY` loops, the flag is checked after reading a block of rows. If the kill flag is set, the statement is aborted.

* `ALTER TABLE` operations that make a table copy check the kill flag periodically for each few copied rows read from the original table. If the kill flag was set, the statement is aborted and the temporary table is deleted.

  The `KILL` statement returns without waiting for confirmation, but the kill flag check aborts the operation within a reasonably small amount of time. Aborting the operation to perform any necessary cleanup also takes some time.

* During `UPDATE` or `DELETE` operations, the kill flag is checked after each block read and after each updated or deleted row. If the kill flag is set, the statement is aborted. If you are not using transactions, the changes are not rolled back.

* `GET_LOCK()` aborts and returns `NULL`.

* If the thread is in the table lock handler (state: `Locked`), the table lock is quickly aborted.

* If the thread is waiting for free disk space in a write call, the write is aborted with a “disk full” error message.

* `EXPLAIN ANALYZE` aborts and prints the first row of output.

Warning

Killing a `REPAIR TABLE` or `OPTIMIZE TABLE` operation on a `MyISAM` table results in a table that is corrupted and unusable. Any reads or writes to such a table fail until you optimize or repair it again (without interruption).


#### 15.7.8.5 LOAD INDEX INTO CACHE Statement

```
LOAD INDEX INTO CACHE
  tbl_index_list [, tbl_index_list] ...

tbl_index_list:
  tbl_name
    [PARTITION (partition_list)]
    [{INDEX|KEY} (index_name[, index_name] ...)]
    [IGNORE LEAVES]

partition_list: {
    partition_name[, partition_name] ...
  | ALL
}
```

The [`LOAD INDEX INTO CACHE`](load-index.html "15.7.8.5 LOAD INDEX INTO CACHE Statement") statement preloads a table index into the key cache to which it has been assigned by an explicit `CACHE INDEX` statement, or into the default key cache otherwise.

[`LOAD INDEX INTO CACHE`](load-index.html "15.7.8.5 LOAD INDEX INTO CACHE Statement") applies only to `MyISAM` tables, including partitioned `MyISAM` tables. In addition, indexes on partitioned tables can be preloaded for one, several, or all partitions.

The `IGNORE LEAVES` modifier causes only blocks for the nonleaf nodes of the index to be preloaded.

`IGNORE LEAVES` is also supported for partitioned `MyISAM` tables.

The following statement preloads nodes (index blocks) of indexes for the tables `t1` and `t2`:

```
mysql> LOAD INDEX INTO CACHE t1, t2 IGNORE LEAVES;
+---------+--------------+----------+----------+
| Table   | Op           | Msg_type | Msg_text |
+---------+--------------+----------+----------+
| test.t1 | preload_keys | status   | OK       |
| test.t2 | preload_keys | status   | OK       |
+---------+--------------+----------+----------+
```

This statement preloads all index blocks from `t1`. It preloads only blocks for the nonleaf nodes from `t2`.

The syntax of [`LOAD INDEX INTO CACHE`](load-index.html "15.7.8.5 LOAD INDEX INTO CACHE Statement") enables you to specify that only particular indexes from a table should be preloaded. However, the implementation preloads all the table's indexes into the cache, so there is no reason to specify anything other than the table name.

It is possible to preload indexes on specific partitions of partitioned `MyISAM` tables. For example, of the following 2 statements, the first preloads indexes for partition `p0` of a partitioned table `pt`, while the second preloads the indexes for partitions `p1` and `p3` of the same table:

```
LOAD INDEX INTO CACHE pt PARTITION (p0);
LOAD INDEX INTO CACHE pt PARTITION (p1, p3);
```

To preload the indexes for all partitions in table `pt`, you can use either of the following two statements:

```
LOAD INDEX INTO CACHE pt PARTITION (ALL);

LOAD INDEX INTO CACHE pt;
```

The two statements just shown are equivalent, and issuing either one has exactly the same effect. In other words, if you wish to preload indexes for all partitions of a partitioned table, the `PARTITION (ALL)` clause is optional.

When preloading indexes for multiple partitions, the partitions need not be contiguous, and you need not list their names in any particular order.

[`LOAD INDEX INTO CACHE ... IGNORE LEAVES`](load-index.html "15.7.8.5 LOAD INDEX INTO CACHE Statement") fails unless all indexes in a table have the same block size. To determine index block sizes for a table, use **myisamchk -dv** and check the `Blocksize` column.


#### 15.7.8.6 RESET Statement

```
RESET reset_option [, reset_option] ...

reset_option: {
    BINARY LOGS AND GTIDS
  | REPLICA
}
```

The `RESET` statement is used to clear the state of various server operations. You must have the `RELOAD` privilege to execute `RESET`.

For information about the [`RESET PERSIST`](reset-persist.html "15.7.8.7 RESET PERSIST Statement") statement that removes persisted global system variables, see Section 15.7.8.7, “RESET PERSIST Statement”.

`RESET` acts as a stronger version of the `FLUSH` statement. See Section 15.7.8.3, “FLUSH Statement”.

The `RESET` statement causes an implicit commit. See Section 15.3.3, “Statements That Cause an Implicit Commit”.

The following list describes the permitted `RESET` statement *`reset_option`* values:

* `RESET BINARY LOGS AND GTIDS`

  Deletes all binary logs listed in the index file, resets the binary log index file to be empty, and creates a new binary log file.

* [`RESET REPLICA`](reset-replica.html "15.4.2.3 RESET REPLICA Statement")

  Makes the replica forget its replication position in the source binary logs. Also resets the relay log by deleting any existing relay log files and beginning a new one.


#### 15.7.8.7 RESET PERSIST Statement

```
RESET PERSIST [[IF EXISTS] system_var_name]
```

`RESET PERSIST` removes persisted global system variable settings from the `mysqld-auto.cnf` option file in the data directory. Removing a persisted system variable causes the variable no longer to be initialized from `mysqld-auto.cnf` at server startup. For more information about persisting system variables and the `mysqld-auto.cnf` file, see Section 7.1.9.3, “Persisted System Variables”.

The privileges required for [`RESET PERSIST`](reset-persist.html "15.7.8.7 RESET PERSIST Statement") depend on the type of system variable to be removed:

* For dynamic system variables, this statement requires the `SYSTEM_VARIABLES_ADMIN` privilege (or the deprecated `SUPER` privilege).

* For read-only system variables, this statement requires the `SYSTEM_VARIABLES_ADMIN` and `PERSIST_RO_VARIABLES_ADMIN` privileges.

See Section 7.1.9.1, “System Variable Privileges”.

Depending on whether the variable name and `IF EXISTS` clauses are present, the `RESET PERSIST` statement has these forms:

* To remove all persisted variables from `mysqld-auto.cnf`, use `RESET PERSIST` without naming any system variable:

  ```
  RESET PERSIST;
  ```

  You must have privileges for removing both dynamic and read-only system variables if `mysqld-auto.cnf` contains both kinds of variables.

* To remove a specific persisted variable from `mysqld-auto.cnf`, name it in the statement:

  ```
  RESET PERSIST system_var_name;
  ```

  This includes plugin system variables, even if the plugin is not currently installed. If the variable is not present in the file, an error occurs.

* To remove a specific persisted variable from `mysqld-auto.cnf`, but produce a warning rather than an error if the variable is not present in the file, add an `IF EXISTS` clause to the previous syntax:

  ```
  RESET PERSIST IF EXISTS system_var_name;
  ```

`RESET PERSIST` is not affected by the value of the `persisted_globals_load` system variable.

`RESET PERSIST` affects the contents of the Performance Schema `persisted_variables` table because the table contents correspond to the contents of the `mysqld-auto.cnf` file. On the other hand, because `RESET PERSIST` does not change variable values, it has no effect on the contents of the Performance Schema `variables_info` table until the server is restarted.

For information about `RESET` statement variants that clear the state of other server operations, see Section 15.7.8.6, “RESET Statement”.


#### 15.7.8.8 RESTART Statement

```
RESTART
```

This statement stops and restarts the MySQL server. It requires the `SHUTDOWN` privilege.

One use for `RESTART` is when it is not possible or convenient to gain command-line access to the MySQL server on the server host to restart it. For example, [`SET PERSIST_ONLY`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") can be used at runtime to make configuration changes to system variables that can be set only at server startup, but the server must still be restarted for those changes to take effect. The `RESTART` statement provides a way to do so from within client sessions, without requiring command-line access on the server host.

Note

After executing a `RESTART` statement, the client can expect the current connection to be lost. If auto-reconnect is enabled, the connection is reestablished after the server restarts. Otherwise, the connection must be reestablished manually.

A successful `RESTART` operation requires **mysqld** to be running in an environment that has a monitoring process available to detect a server shutdown performed for restart purposes:

* In the presence of a monitoring process, `RESTART` causes **mysqld** to terminate such that the monitoring process can determine that it should start a new **mysqld** instance.

* If no monitoring process is present, `RESTART` fails with an error.

These platforms provide the necessary monitoring support for the `RESTART` statement:

* Windows, when **mysqld** is started as a Windows service or standalone. (**mysqld** forks, and one process acts as a monitor to the other, which acts as the server.)

* Unix and Unix-like systems that use systemd or **mysqld\_safe** to manage **mysqld**.

To configure a monitoring environment such that **mysqld** enables the `RESTART` statement:

1. Set the `MYSQLD_PARENT_PID` environment variable to the value of the process ID of the process that starts **mysqld**, before starting **mysqld**.

2. When **mysqld** performs a shutdown due to use of the `RESTART` statement, it returns exit code 16.

3. When the monitoring process detects an exit code of 16, it starts **mysqld** again. Otherwise, it exits.

Here is a minimal example as implemented in the **bash** shell:

```
#!/bin/bash

export MYSQLD_PARENT_PID=$$

export MYSQLD_RESTART_EXIT=16

while true ; do
  bin/mysqld mysqld options here
  if [ $? -ne $MYSQLD_RESTART_EXIT ]; then
    break
  fi
done
```

On Windows, the forking used to implement `RESTART` makes determining the server process to attach to for debugging more difficult. To alleviate this, starting the server with `--gdb` suppresses forking, in addition to its other actions done to set up a debugging environment. In non-debug settings, `--no-monitor` may be used for the sole purpose of suppressing forking the monitor process. For a server started with either `--gdb` or `--no-monitor`, executing `RESTART` causes the server to simply exit without restarting.

The `Com_restart` status variable tracks the number of `RESTART` statements. Because status variables are initialized for each server startup and do not persist across restarts, `Com_restart` normally has a value of zero, but can be nonzero if `RESTART` statements were executed but failed.


#### 15.7.8.9 SHUTDOWN Statement

```
SHUTDOWN
```

This statement stops the MySQL server. It requires the `SHUTDOWN` privilege.

`SHUTDOWN` provides an SQL-level interface to the same functionality available using the **mysqladmin shutdown** command. A successful `SHUTDOWN` sequence consists of checking the privileges, validating the arguments, and sending an OK packet to the client. Then the server is shut down.

The `Com_shutdown` status variable tracks the number of `SHUTDOWN` statements. Because status variables are initialized for each server startup and do not persist across restarts, `Com_shutdown` normally has a value of zero, but can be nonzero if `SHUTDOWN` statements were executed but failed.

Another way to stop the server is to send it a `SIGTERM` signal, which can be done by `root` or the account that owns the server process. `SIGTERM` enables server shutdown to be performed without having to connect to the server. See Section 6.10, “Unix Signal Handling in MySQL”.
