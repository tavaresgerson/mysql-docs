#### 13.7.1.1 ALTER USER Statement

```sql
ALTER USER [IF EXISTS]
    user [auth_option] [, user [auth_option ...
    [REQUIRE {NONE | tls_option AND] tls_option] ...}]
    [WITH resource_option [resource_option] ...]
    [password_option | lock_option] ...

ALTER USER [IF EXISTS]
    USER() IDENTIFIED BY 'auth_string'

user:
    (see Section 6.2.4, “Specifying Account Names”)

auth_option: {
    IDENTIFIED BY 'auth_string'
  | IDENTIFIED WITH auth_plugin
  | IDENTIFIED WITH auth_plugin BY 'auth_string'
  | IDENTIFIED WITH auth_plugin AS 'auth_string'
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
    PASSWORD EXPIRE
  | PASSWORD EXPIRE DEFAULT
  | PASSWORD EXPIRE NEVER
  | PASSWORD EXPIRE INTERVAL N DAY
}

lock_option: {
    ACCOUNT LOCK
  | ACCOUNT UNLOCK
}
```

The [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") statement modifies MySQL accounts. It enables authentication, SSL/TLS, resource-limit, and password-management properties to be modified for existing accounts. It can also be used to lock and unlock accounts.

To use [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement"), you must have the global [`CREATE USER`](privileges-provided.html#priv_create-user) privilege or the [`UPDATE`](privileges-provided.html#priv_update) privilege for the `mysql` system database. When the [`read_only`](server-system-variables.html#sysvar_read_only) system variable is enabled, [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") additionally requires the [`SUPER`](privileges-provided.html#priv_super) privilege.

By default, an error occurs if you try to modify a user that does not exist. If the `IF EXISTS` clause is given, the statement produces a warning for each named user that does not exist, rather than an error.

Important

Under some circumstances, [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") may be recorded in server logs or on the client side in a history file such as `~/.mysql_history`, which means that cleartext passwords may be read by anyone having read access to that information. For information about the conditions under which this occurs for the server logs and how to control it, see [Section 6.1.2.3, “Passwords and Logging”](password-logging.html "6.1.2.3 Passwords and Logging"). For similar information about client-side logging, see [Section 4.5.1.3, “mysql Client Logging”](mysql-logging.html "4.5.1.3 mysql Client Logging").

There are several aspects to the [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") statement, described under the following topics:

* [ALTER USER Overview](alter-user.html#alter-user-overview "ALTER USER Overview")
* [ALTER USER Authentication Options](alter-user.html#alter-user-authentication "ALTER USER Authentication Options")
* [ALTER USER SSL/TLS Options](alter-user.html#alter-user-tls "ALTER USER SSL/TLS Options")
* [ALTER USER Resource-Limit Options](alter-user.html#alter-user-resource-limits "ALTER USER Resource-Limit Options")
* [ALTER USER Password-Management Options](alter-user.html#alter-user-password-management "ALTER USER Password-Management Options")
* [ALTER USER Account-Locking Options](alter-user.html#alter-user-account-locking "ALTER USER Account-Locking Options")

##### ALTER USER Overview

For each affected account, [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") modifies the corresponding row in the `mysql.user` system table to reflect the properties specified in the statement. Unspecified properties retain their current values.

Each account name uses the format described in [Section 6.2.4, “Specifying Account Names”](account-names.html "6.2.4 Specifying Account Names"). The host name part of the account name, if omitted, defaults to `'%'`. It is also possible to specify [`CURRENT_USER`](information-functions.html#function_current-user) or [`CURRENT_USER()`](information-functions.html#function_current-user) to refer to the account associated with the current session.

In one case only, the account may be specified with the [`USER()`](information-functions.html#function_user) function:

```sql
ALTER USER USER() IDENTIFIED BY 'auth_string';
```

This syntax enables changing your own password without naming your account literally.

For [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") syntax that permits an *`auth_option`* value to follow a *`user`* value, *`auth_option`* indicates how the account authenticates by specifying an account authentication plugin, credentials (for example, a password), or both. Each *`auth_option`* value applies *only* to the account named immediately preceding it.

Following the *`user`* specifications, the statement may include options for SSL/TLS, resource-limit, password-management, and locking properties. All such options are *global* to the statement and apply to *all* accounts named in the statement.

Example: Change an account's password and expire it. As a result, the user must connect with the named password and choose a new one at the next connection:

```sql
ALTER USER 'jeffrey'@'localhost'
  IDENTIFIED BY 'new_password' PASSWORD EXPIRE;
```

Example: Modify an account to use the `sha256_password` authentication plugin and the given password. Require that a new password be chosen every 180 days:

```sql
ALTER USER 'jeffrey'@'localhost'
  IDENTIFIED WITH sha256_password BY 'new_password'
  PASSWORD EXPIRE INTERVAL 180 DAY;
```

Example: Lock or unlock an account:

```sql
ALTER USER 'jeffrey'@'localhost' ACCOUNT LOCK;
ALTER USER 'jeffrey'@'localhost' ACCOUNT UNLOCK;
```

Example: Require an account to connect using SSL and establish a limit of 20 connections per hour:

```sql
ALTER USER 'jeffrey'@'localhost'
  REQUIRE SSL WITH MAX_CONNECTIONS_PER_HOUR 20;
```

Example: Alter multiple accounts, specifying some per-account properties and some global properties:

```sql
ALTER USER
  'jeffrey'@'localhost' IDENTIFIED BY 'new_password',
  'jeanne'@'localhost'
  REQUIRE SSL WITH MAX_USER_CONNECTIONS 2;
```

The `IDENTIFIED BY` value following `jeffrey` applies only to its immediately preceding account, so it changes the password to `'jeffrey_new_password'` only for `jeffrey`. For `jeanne`, there is no per-account value (thus leaving the password unchanged).

The remaining properties apply globally to all accounts named in the statement, so for both accounts:

* Connections are required to use SSL.
* The account can be used for a maximum of two simultaneous connections.

In the absence of a particular type of option, the account remains unchanged in that respect. For example, with no locking option, the locking state of the account is not changed.

##### ALTER USER Authentication Options

An account name may be followed by an *`auth_option`* authentication option that specifies the account authentication plugin, credentials, or both:

* *`auth_plugin`* names an authentication plugin. The plugin name can be a quoted string literal or an unquoted name. Plugin names are stored in the `plugin` column of the `mysql.user` system table.

  For *`auth_option`* syntax that does not specify an authentication plugin, the default plugin is indicated by the value of the [`default_authentication_plugin`](server-system-variables.html#sysvar_default_authentication_plugin) system variable. For descriptions of each plugin, see [Section 6.4.1, “Authentication Plugins”](authentication-plugins.html "6.4.1 Authentication Plugins").

* Credentials are stored in the `mysql.user` system table. An `'auth_string'` value specifies account credentials, either as a cleartext (unencrypted) string or hashed in the format expected by the authentication plugin associated with the account, respectively:

  + For syntax that uses `BY 'auth_string'`, the string is cleartext and is passed to the authentication plugin for possible hashing. The result returned by the plugin is stored in the `mysql.user` table. A plugin may use the value as specified, in which case no hashing occurs.

  + For syntax that uses `AS 'auth_string'`, the string is assumed to be already in the format the authentication plugin requires, and is stored as is in the `mysql.user` table. If a plugin requires a hashed value, the value must be already hashed in a format appropriate for the plugin, or the value cannot be used by the plugin and correct authentication of client connections cannot occur.

  + If an authentication plugin performs no hashing of the authentication string, the `BY 'auth_string'` and `AS 'auth_string'` clauses have the same effect: The authentication string is stored as is in the `mysql.user` system table.

[`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") permits these *`auth_option`* syntaxes:

* `IDENTIFIED BY 'auth_string'`

  Sets the account authentication plugin to the default plugin, passes the cleartext `'auth_string'` value to the plugin for possible hashing, and stores the result in the account row in the `mysql.user` system table.

* `IDENTIFIED WITH auth_plugin`

  Sets the account authentication plugin to *`auth_plugin`*, clears the credentials to the empty string (the credentials are associated with the old authentication plugin, not the new one), and stores the result in the account row in the `mysql.user` system table.

  In addition, the password is marked expired. The user must choose a new one when next connecting.

* `IDENTIFIED WITH auth_plugin BY 'auth_string'`

  Sets the account authentication plugin to *`auth_plugin`*, passes the cleartext `'auth_string'` value to the plugin for possible hashing, and stores the result in the account row in the `mysql.user` system table.

* `IDENTIFIED WITH auth_plugin AS 'auth_string'`

  Sets the account authentication plugin to *`auth_plugin`* and stores the `'auth_string'` value as is in the `mysql.user` account row. If the plugin requires a hashed string, the string is assumed to be already hashed in the format the plugin requires.

Example: Specify the password as cleartext; the default plugin is used:

```sql
ALTER USER 'jeffrey'@'localhost'
  IDENTIFIED BY 'password';
```

Example: Specify the authentication plugin, along with a cleartext password value:

```sql
ALTER USER 'jeffrey'@'localhost'
  IDENTIFIED WITH mysql_native_password
             BY 'password';
```

Example: Specify the authentication plugin, along with a hashed password value:

```sql
ALTER USER 'jeffrey'@'localhost'
  IDENTIFIED WITH mysql_native_password
             AS '*6C8989366EAF75BB670AD8EA7A7FC1176A95CEF4';
```

For additional information about setting passwords and authentication plugins, see [Section 6.2.10, “Assigning Account Passwords”](assigning-passwords.html "6.2.10 Assigning Account Passwords"), and [Section 6.2.13, “Pluggable Authentication”](pluggable-authentication.html "6.2.13 Pluggable Authentication").

##### ALTER USER SSL/TLS Options

MySQL can check X.509 certificate attributes in addition to the usual authentication that is based on the user name and credentials. For background information on the use of SSL/TLS with MySQL, see [Section 6.3, “Using Encrypted Connections”](encrypted-connections.html "6.3 Using Encrypted Connections").

To specify SSL/TLS-related options for a MySQL account, use a `REQUIRE` clause that specifies one or more *`tls_option`* values.

Order of `REQUIRE` options does not matter, but no option can be specified twice. The `AND` keyword is optional between `REQUIRE` options.

[`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") permits these *`tls_option`* values:

* `NONE`

  Indicates that all accounts named by the statement have no SSL or X.509 requirements. Unencrypted connections are permitted if the user name and password are valid. Encrypted connections can be used, at the client's option, if the client has the proper certificate and key files.

  ```sql
  ALTER USER 'jeffrey'@'localhost' REQUIRE NONE;
  ```

  Clients attempt to establish a secure connection by default. For clients that have `REQUIRE NONE`, the connection attempt falls back to an unencrypted connection if a secure connection cannot be established. To require an encrypted connection, a client need specify only the [`--ssl-mode=REQUIRED`](connection-options.html#option_general_ssl-mode) option; the connection attempt fails if a secure connection cannot be established.

* `SSL`

  Tells the server to permit only encrypted connections for all accounts named by the statement.

  ```sql
  ALTER USER 'jeffrey'@'localhost' REQUIRE SSL;
  ```

  Clients attempt to establish a secure connection by default. For accounts that have `REQUIRE SSL`, the connection attempt fails if a secure connection cannot be established.

* `X509`

  For all accounts named by the statement, requires that clients present a valid certificate, but the exact certificate, issuer, and subject do not matter. The only requirement is that it should be possible to verify its signature with one of the CA certificates. Use of X.509 certificates always implies encryption, so the `SSL` option is unnecessary in this case.

  ```sql
  ALTER USER 'jeffrey'@'localhost' REQUIRE X509;
  ```

  For accounts with `REQUIRE X509`, clients must specify the [`--ssl-key`](connection-options.html#option_general_ssl-key) and [`--ssl-cert`](connection-options.html#option_general_ssl-cert) options to connect. (It is recommended but not required that [`--ssl-ca`](connection-options.html#option_general_ssl-ca) also be specified so that the public certificate provided by the server can be verified.) This is true for `ISSUER` and `SUBJECT` as well because those `REQUIRE` options imply the requirements of `X509`.

* `ISSUER 'issuer'`

  For all accounts named by the statement, requires that clients present a valid X.509 certificate issued by CA `'issuer'`. If a client presents a certificate that is valid but has a different issuer, the server rejects the connection. Use of X.509 certificates always implies encryption, so the `SSL` option is unnecessary in this case.

  ```sql
  ALTER USER 'jeffrey'@'localhost'
    REQUIRE ISSUER '/C=SE/ST=Stockholm/L=Stockholm/
      O=MySQL/CN=CA/emailAddress=ca@example.com';
  ```

  Because `ISSUER` implies the requirements of `X509`, clients must specify the [`--ssl-key`](connection-options.html#option_general_ssl-key) and [`--ssl-cert`](connection-options.html#option_general_ssl-cert) options to connect. (It is recommended but not required that [`--ssl-ca`](connection-options.html#option_general_ssl-ca) also be specified so that the public certificate provided by the server can be verified.)

* `SUBJECT 'subject'`

  For all accounts named by the statement, requires that clients present a valid X.509 certificate containing the subject *`subject`*. If a client presents a certificate that is valid but has a different subject, the server rejects the connection. Use of X.509 certificates always implies encryption, so the `SSL` option is unnecessary in this case.

  ```sql
  ALTER USER 'jeffrey'@'localhost'
    REQUIRE SUBJECT '/C=SE/ST=Stockholm/L=Stockholm/
      O=MySQL demo client certificate/
      CN=client/emailAddress=client@example.com';
  ```

  MySQL does a simple string comparison of the `'subject'` value to the value in the certificate, so lettercase and component ordering must be given exactly as present in the certificate.

  Because `SUBJECT` implies the requirements of `X509`, clients must specify the [`--ssl-key`](connection-options.html#option_general_ssl-key) and [`--ssl-cert`](connection-options.html#option_general_ssl-cert) options to connect. (It is recommended but not required that [`--ssl-ca`](connection-options.html#option_general_ssl-ca) also be specified so that the public certificate provided by the server can be verified.)

* `CIPHER 'cipher'`

  For all accounts named by the statement, requires a specific cipher method for encrypting connections. This option is needed to ensure that ciphers and key lengths of sufficient strength are used. Encryption can be weak if old algorithms using short encryption keys are used.

  ```sql
  ALTER USER 'jeffrey'@'localhost'
    REQUIRE CIPHER 'EDH-RSA-DES-CBC3-SHA';
  ```

The `SUBJECT`, `ISSUER`, and `CIPHER` options can be combined in the `REQUIRE` clause:

```sql
ALTER USER 'jeffrey'@'localhost'
  REQUIRE SUBJECT '/C=SE/ST=Stockholm/L=Stockholm/
    O=MySQL demo client certificate/
    CN=client/emailAddress=client@example.com'
  AND ISSUER '/C=SE/ST=Stockholm/L=Stockholm/
    O=MySQL/CN=CA/emailAddress=ca@example.com'
  AND CIPHER 'EDH-RSA-DES-CBC3-SHA';
```

##### ALTER USER Resource-Limit Options

It is possible to place limits on use of server resources by an account, as discussed in [Section 6.2.16, “Setting Account Resource Limits”](user-resources.html "6.2.16 Setting Account Resource Limits"). To do so, use a `WITH` clause that specifies one or more *`resource_option`* values.

Order of `WITH` options does not matter, except that if a given resource limit is specified multiple times, the last instance takes precedence.

[`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") permits these *`resource_option`* values:

* `MAX_QUERIES_PER_HOUR count`, `MAX_UPDATES_PER_HOUR count`, `MAX_CONNECTIONS_PER_HOUR count`

  For all accounts named by the statement, these options restrict how many queries, updates, and connections to the server are permitted to each account during any given one-hour period. (Queries for which results are served from the query cache do not count against the `MAX_QUERIES_PER_HOUR` limit.) If *`count`* is `0` (the default), this means that there is no limitation for the account.

* `MAX_USER_CONNECTIONS count`

  For all accounts named by the statement, restricts the maximum number of simultaneous connections to the server by each account. A nonzero *`count`* specifies the limit for the account explicitly. If *`count`* is `0` (the default), the server determines the number of simultaneous connections for the account from the global value of the [`max_user_connections`](server-system-variables.html#sysvar_max_user_connections) system variable. If [`max_user_connections`](server-system-variables.html#sysvar_max_user_connections) is also zero, there is no limit for the account.

Example:

```sql
ALTER USER 'jeffrey'@'localhost'
  WITH MAX_QUERIES_PER_HOUR 500 MAX_UPDATES_PER_HOUR 100;
```

##### ALTER USER Password-Management Options

[`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") supports several *`password_option`* values for password expiration management, to either expire an account password manually or establish its password expiration policy. Policy options do not expire the password. Instead, they determine how the server applies automatic expiration to the account based on account password age. For a given account, its password age is assessed from the date and time of the most recent password change.

This section describes the syntax for password-management options. For information about establishing policy for password management, see [Section 6.2.11, “Password Management”](password-management.html "6.2.11 Password Management").

If multiple password-management options are specified, the last one takes precedence.

These options apply only to accounts that use an authentication plugin that stores credentials internally to MySQL. For accounts that use a plugin that performs authentication against a credentials system that is external to MySQL, password management must be handled externally against that system as well. For more information about internal credentials storage, see [Section 6.2.11, “Password Management”](password-management.html "6.2.11 Password Management").

A client session operates in restricted mode if the account password was expired manually or if the password age is considered greater than its permitted lifetime per the automatic expiration policy. In restricted mode, operations performed within the session result in an error until the user establishes a new account password. For information about restricted mode, see [Section 6.2.12, “Server Handling of Expired Passwords”](expired-password-handling.html "6.2.12 Server Handling of Expired Passwords").

Note

Although it is possible to “reset” an expired password by setting it to its current value, it is preferable, as a matter of good policy, to choose a different password.

[`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") permits these *`password_option`* values for controlling password expiration:

* `PASSWORD EXPIRE`

  Immediately marks the password expired for all accounts named by the statement.

  ```sql
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE;
  ```

* `PASSWORD EXPIRE DEFAULT`

  Sets all accounts named by the statement so that the global expiration policy applies, as specified by the [`default_password_lifetime`](server-system-variables.html#sysvar_default_password_lifetime) system variable.

  ```sql
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE DEFAULT;
  ```

* `PASSWORD EXPIRE NEVER`

  This expiration option overrides the global policy for all accounts named by the statement. For each, it disables password expiration so that the password never expires.

  ```sql
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE NEVER;
  ```

* `PASSWORD EXPIRE INTERVAL N DAY`

  This expiration option overrides the global policy for all accounts named by the statement. For each, it sets the password lifetime to *`N`* days. The following statement requires the password to be changed every 180 days:

  ```sql
  ALTER USER 'jeffrey'@'localhost' PASSWORD EXPIRE INTERVAL 180 DAY;
  ```

##### ALTER USER Account-Locking Options

MySQL supports account locking and unlocking using the `ACCOUNT LOCK` and `ACCOUNT UNLOCK` options, which specify the locking state for an account. For additional discussion, see [Section 6.2.15, “Account Locking”](account-locking.html "6.2.15 Account Locking").

If multiple account-locking options are specified, the last one takes precedence.
