## 6.4 Security Plugins

MySQL includes several plugins that implement security features:

* Plugins for authenticating attempts by clients to connect to MySQL Server. Plugins are available for several authentication protocols. For general discussion of the authentication process, see Section 6.2.13, “Pluggable Authentication”. For characteristics of specific authentication plugins, see Section 6.4.1, “Authentication Plugins”.

* A password-validation plugin for implementing password strength policies and assessing the strength of potential passwords. See Section 6.4.3, “The Password Validation Plugin”.

* Keyring plugins that provide secure storage for sensitive information. See Section 6.4.4, “The MySQL Keyring”.

* (MySQL Enterprise Edition only) MySQL Enterprise Audit, implemented using a server plugin, uses the open MySQL Audit API to enable standard, policy-based monitoring and logging of connection and query activity executed on specific MySQL servers. Designed to meet the Oracle audit specification, MySQL Enterprise Audit provides an out of box, easy to use auditing and compliance solution for applications that are governed by both internal and external regulatory guidelines. See Section 6.4.5, “MySQL Enterprise Audit”.

* (MySQL Enterprise Edition only) MySQL Enterprise Firewall, an application-level firewall that enables database administrators to permit or deny SQL statement execution based on matching against lists of accepted statement patterns. This helps harden MySQL Server against attacks such as SQL injection or attempts to exploit applications by using them outside of their legitimate query workload characteristics. See Section 6.4.6, “MySQL Enterprise Firewall”.

* (MySQL Enterprise Edition only) MySQL Enterprise Data Masking and De-Identification, implemented as a plugin library containing a plugin and a set of functions. Data masking hides sensitive information by replacing real values with substitutes. MySQL Enterprise Data Masking and De-Identification functions enable masking existing data using several methods such as obfuscation (removing identifying characteristics), generation of formatted random data, and data replacement or substitution. See Section 6.5, “MySQL Enterprise Data Masking and De-Identification”.


### 6.4.1 Authentication Plugins

The following sections describe pluggable authentication methods available in MySQL and the plugins that implement these methods. For general discussion of the authentication process, see Section 6.2.13, “Pluggable Authentication”.

The default plugin is indicated by the value of the `default_authentication_plugin` system variable.


#### 6.4.1.1 Native Pluggable Authentication

MySQL includes two plugins that implement native authentication; that is, authentication based on the password hashing methods in use from before the introduction of pluggable authentication. This section describes `mysql_native_password`, which implements authentication against the `mysql.user` system table using the native password hashing method. For information about `mysql_old_password`, which implements authentication using the older (pre-4.1) native password hashing method, see Section 6.4.1.2, “Old Native Pluggable Authentication”. For information about these password hashing methods, see Section 6.1.2.4, “Password Hashing in MySQL”.

The following table shows the plugin names on the server and client sides.

**Table 6.8 Plugin and Library Names for Native Password Authentication**

<table summary="Names for the plugins and library file used for native password authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>mysql_native_password</code></td> </tr><tr> <td>Client-side plugin</td> <td><code>mysql_native_password</code></td> </tr><tr> <td>Library file</td> <td>None (plugins are built in)</td> </tr></tbody></table>

The following sections provide installation and usage information specific to native pluggable authentication:

* Installing Native Pluggable Authentication
* Using Native Pluggable Authentication

For general information about pluggable authentication in MySQL, see Section 6.2.13, “Pluggable Authentication”.

##### Installing Native Pluggable Authentication

The `mysql_native_password` plugin exists in server and client forms:

* The server-side plugin is built into the server, need not be loaded explicitly, and cannot be disabled by unloading it.

* The client-side plugin is built into the `libmysqlclient` client library and is available to any program linked against `libmysqlclient`.

##### Using Native Pluggable Authentication

MySQL client programs use `mysql_native_password` by default. The `--default-auth` option can be used as a hint about which client-side plugin the program can expect to use:

```sql
$> mysql --default-auth=mysql_native_password ...
```


#### 6.4.1.2 Old Native Pluggable Authentication

MySQL includes two plugins that implement native authentication; that is, authentication based on the password hashing methods in use from before the introduction of pluggable authentication. This section describes `mysql_old_password`, which implements authentication against the `mysql.user` system table using the older (pre-4.1) native password hashing method. For information about `mysql_native_password`, which implements authentication using the native password hashing method, see Section 6.4.1.1, “Native Pluggable Authentication”. For information about these password hashing methods, see Section 6.1.2.4, “Password Hashing in MySQL”.

Note

Passwords that use the pre-4.1 hashing method are less secure than passwords that use the native password hashing method and should be avoided. Pre-4.1 passwords are deprecated and support for them (including the `mysql_old_password` plugin) was removed in MySQL 5.7.5. For account upgrade instructions, see Section 6.4.1.3, “Migrating Away from Pre-4.1 Password Hashing and the mysql\_old\_password Plugin”.

The following table shows the plugin names on the server and client sides.

**Table 6.9 Plugin and Library Names for Old Native Password Authentication**

<table summary="Names for the plugins and library file used for old native password authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>mysql_old_password</code></td> </tr><tr> <td>Client-side plugin</td> <td><code>mysql_old_password</code></td> </tr><tr> <td>Library file</td> <td>None (plugins are built in)</td> </tr></tbody></table>

The following sections provide installation and usage information specific to old native pluggable authentication:

* Installing Old Native Pluggable Authentication
* Using Old Native Pluggable Authentication

For general information about pluggable authentication in MySQL, see Section 6.2.13, “Pluggable Authentication”.

##### Installing Old Native Pluggable Authentication

The `mysql_old_password` plugin exists in server and client forms:

* The server-side plugin is built into the server, need not be loaded explicitly, and cannot be disabled by unloading it.

* The client-side plugin is built into the `libmysqlclient` client library and is available to any program linked against `libmysqlclient`.

##### Using Old Native Pluggable Authentication

MySQL client programs can use the `--default-auth` option to specify the `mysql_old_password` plugin as a hint about which client-side plugin the program can expect to use:

```sql
$> mysql --default-auth=mysql_old_password ...
```


#### 6.4.1.3 Migrating Away from Pre-4.1 Password Hashing and the mysql\_old\_password Plugin

The MySQL server authenticates connection attempts for each account listed in the `mysql.user` system table using the authentication plugin named in the `plugin` column. If the `plugin` column is empty, the server authenticates the account as follows:

* Before MySQL 5.7, the server uses the `mysql_native_password` or `mysql_old_password` plugin implicitly, depending on the format of the password hash in the `Password` column. If the `Password` value is empty or a 4.1 password hash (41 characters), the server uses `mysql_native_password`. If the password value is a pre-4.1 password hash (16 characters), the server uses `mysql_old_password`. (For additional information about these hash formats, see Section 6.1.2.4, “Password Hashing in MySQL”.)

* As of MySQL 5.7, the server requires the `plugin` column to be nonempty and disables accounts that have an empty `plugin` value.

Pre-4.1 password hashes and the `mysql_old_password` plugin are deprecated in MySQL 5.6 and support for them is removed in MySQL 5.7. They provide a level of security inferior to that offered by 4.1 password hashing and the `mysql_native_password` plugin.

Given the requirement in MySQL 5.7 that the `plugin` column must be nonempty, coupled with removal of `mysql_old_password` support, DBAs are advised to upgrade accounts as follows:

* Upgrade accounts that use `mysql_native_password` implicitly to use it explicitly

* Upgrade accounts that use `mysql_old_password` (either implicitly or explicitly) to use `mysql_native_password` explicitly

The instructions in this section describe how to perform those upgrades. The result is that no account has an empty `plugin` value and no account uses pre-4.1 password hashing or the `mysql_old_password` plugin.

As a variant on these instructions, DBAs might offer users the choice to upgrade to the `sha256_password` plugin, which authenticates using SHA-256 password hashes. For information about this plugin, see Section 6.4.1.5, “SHA-256 Pluggable Authentication”.

The following table lists the types of `mysql.user` accounts considered in this discussion.

<table summary="Characteristics of MySQL accounts and what must be done to upgrade them.">
  <col style="width: 30%"/>
  <col style="width: 20%"/>
  <col style="width: 30%"/>
  <col style="width: 20%"/>
  <thead>
    <tr>
      <th><code>plugin</code> Column</th>
      <th><code>Password</code> Column</th>
      <th>Authentication Result</th>
      <th>Upgrade Action</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Empty</th>
      <td>Empty</td>
      <td>Implicitly uses <code>mysql_native_password</code></td>
      <td>Assign plugin</td>
    </tr>
    <tr>
      <th>Empty</th>
      <td>4.1 hash</td>
      <td>Implicitly uses <code>mysql_native_password</code></td>
      <td>Assign plugin</td>
    </tr>
    <tr>
      <th>Empty</th>
      <td>Pre-4.1 hash</td>
      <td>Implicitly uses <code>mysql_old_password</code></td>
      <td>Assign plugin, rehash password</td>
    </tr>
    <tr>
      <th><code>mysql_native_password</code></th>
      <td>Empty</td>
      <td>Explicitly uses <code>mysql_native_password</code></td>
      <td>None</td>
    </tr>
    <tr>
      <th><code>mysql_native_password</code></th>
      <td>4.1 hash</td>
      <td>Explicitly uses <code>mysql_native_password</code></td>
      <td>None</td>
    </tr>
    <tr>
      <th><code>mysql_old_password</code></th>
      <td>Empty</td>
      <td>Explicitly uses <code>mysql_old_password</code></td>
      <td>Upgrade plugin</td>
    </tr>
    <tr>
      <th><code>mysql_old_password</code></th>
      <td>Pre-4.1 hash</td>
      <td>Explicitly uses <code>mysql_old_password</code></td>
      <td>Upgrade plugin, rehash password</td>
    </tr>
  </tbody>
</table>

Accounts corresponding to lines for the `mysql_native_password` plugin require no upgrade action (because no change of plugin or hash format is required). For accounts corresponding to lines for which the password is empty, consider asking the account owners to choose a password (or require it by using `ALTER USER` to expire empty account passwords).

##### Upgrading Accounts from Implicit to Explicit mysql\_native\_password Use

Accounts that have an empty plugin and a 4.1 password hash use `mysql_native_password` implicitly. To upgrade these accounts to use `mysql_native_password` explicitly, execute these statements:

```sql
UPDATE mysql.user SET plugin = 'mysql_native_password'
WHERE plugin = '' AND (Password = '' OR LENGTH(Password) = 41);
FLUSH PRIVILEGES;
```

Before MySQL 5.7, you can execute those statements to uprade accounts proactively. As of MySQL 5.7, you can run `mysqld_upgrade`, which performs the same operation among its upgrade actions.

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

You should ensure that the server is running with `secure_auth=0`.

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

The client-side `--secure-auth` option is enabled by default, so remind users to disable it; otherwise, they cannot connect:

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

At that point, all accounts have been migrated away from pre-4.1 password hashing and the server no longer need be run with `secure_auth=0`.

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


#### 6.4.1.4 Caching SHA-2 Pluggable Authentication

MySQL provides two authentication plugins that implement SHA-256 hashing for user account passwords:

* `sha256_password`: Implements basic SHA-256 authentication.

* `caching_sha2_password`: Implements SHA-256 authentication (like `sha256_password`), but uses caching on the server side for better performance and has additional features for wider applicability. (In MySQL 5.7, `caching_sha2_password` is implemented only on the client side, as described later in this section.)

This section describes the caching SHA-2 authentication plugin, available as of MySQL 5.7.23. For information about the original basic (noncaching) plugin, see Section 6.4.1.5, “SHA-256 Pluggable Authentication”.

Important

In MySQL 5.7, the default authentication plugin is `mysql_native_password`. As of MySQL 8.0, the default authentication plugin is changed to `caching_sha2_password`. To enable MySQL 5.7 clients to connect to 8.0 and higher servers using accounts that authenticate with `caching_sha2_password`, the MySQL 5.7 client library and client programs support the `caching_sha2_password` client-side authentication plugin. This improves MySQL 5.7 client connect-capability compatibility with respect to MySQL 8.0 and higher servers, despite the differences in default authentication plugin.

Limiting `caching_sha2_password` support in MySQL 5.7 to the client-side plugin in the client library has these implications compared to MySQL 8.0:

* The `caching_sha2_password` server-side plugin is not implemented in MySQL 5.7.

* MySQL 5.7 servers do not support creating accounts that authenticate with `caching_sha2_password`.

* MySQL 5.7 servers do not implement system and status variables specific to `caching_sha2_password` server-side support: `caching_sha2_password_auto_generate_rsa_keys`, `caching_sha2_password_private_key_path`, `caching_sha2_password_public_key_path`, `Caching_sha2_password_rsa_public_key`.

In addition, there is no support for MySQL 5.7 replicas to connect to MySQL 8.0 replication source servers using accounts that authenticate with `caching_sha2_password`. That would involve a source replicating to a replica with a version number lower than the source version, whereas sources normally replicate to replicas having a version equal to or higher than the source version.

Important

To connect to a MySQL 8.0 or higher server using an account that authenticates with the `caching_sha2_password` plugin, you must use either a secure connection or an unencrypted connection that supports password exchange using an RSA key pair, as described later in this section. Either way, the `caching_sha2_password` plugin uses MySQL's encryption capabilities. See Section 6.3, “Using Encrypted Connections”.

Note

In the name `sha256_password`, “sha256” refers to the 256-bit digest length the plugin uses for encryption. In the name `caching_sha2_password`, “sha2” refers more generally to the SHA-2 class of encryption algorithms, of which 256-bit encryption is one instance. The latter name choice leaves room for future expansion of possible digest lengths without changing the plugin name.

The `caching_sha2_password` plugin has these advantages, compared to `sha256_password`:

* On the server side, an in-memory cache enables faster reauthentication of users who have connected previously when they connect again. (This server-side behavior is implemented only in MySQL 8.0 and higher.)

* Support is provided for client connections that use the Unix socket-file and shared-memory protocols.

The following table shows the plugin name on the client side.

**Table 6.10 Plugin and Library Names for SHA-2 Authentication**

<table summary="Names for the plugin and library file used for SHA-2 password authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Client-side plugin</td> <td><code>`caching_sha2_password`</code></td> </tr><tr> <td>Library file</td> <td>None (plugin is built in)</td> </tr></tbody></table>

The following sections provide installation and usage information specific to caching SHA-2 pluggable authentication:

* Installing SHA-2 Pluggable Authentication
* Using SHA-2 Pluggable Authentication
* Cache Operation for SHA-2 Pluggable Authentication

For general information about pluggable authentication in MySQL, see Section 6.2.13, “Pluggable Authentication”.

##### Installing SHA-2 Pluggable Authentication

In MySQL 5.7, the `caching_sha2_password` plugin exists in client form. The client-side plugin is built into the `libmysqlclient` client library and is available to any program linked against `libmysqlclient`.

##### Using SHA-2 Pluggable Authentication

In MySQL 5.7, the `caching_sha2_password` client-side plugin enables connecting to MySQL 8.0 or higher servers using accounts that authenticate with the `caching_sha2_password` server-side plugin. The discussion here assumes that an account named `'sha2user'@'localhost'` exists on the MySQL 8.0 or higher server. For example, the following statement creates such an account, where *`password`* is the desired account password:

```sql
CREATE USER 'sha2user'@'localhost'
IDENTIFIED WITH `caching_sha2_password` BY 'password';
```

`caching_sha2_password` supports connections over secure transport. `caching_sha2_password` also supports encrypted password exchange using RSA over unencrypted connections if these conditions are satisfied:

* The MySQL 5.7 client library and client programs are compiled using OpenSSL, not yaSSL. `caching_sha2_password` works with distributions compiled using either package, but RSA support requires OpenSSL.

  Note

  It is possible to compile MySQL using yaSSL as an alternative to OpenSSL only prior to MySQL 5.7.28. As of MySQL 5.7.28, support for yaSSL is removed and all MySQL builds use OpenSSL.

* The MySQL 8.0 or higher server to which you wish to connect is configured to support RSA (using the RSA configuration procedure given later in this section).

RSA support has these characteristics, where all aspects that pertain to the server side require a MySQL 8.0 or higher server:

* On the server side, two system variables name the RSA private and public key-pair files: `caching_sha2_password_private_key_path` and `caching_sha2_password_public_key_path`. The database administrator must set these variables at server startup if the key files to use have names that differ from the system variable default values.

* The server uses the `caching_sha2_password_auto_generate_rsa_keys` system variable to determine whether to automatically generate the RSA key-pair files. See Section 6.3.3, “Creating SSL and RSA Certificates and Keys”.

* The `Caching_sha2_password_rsa_public_key` status variable displays the RSA public key value used by the `caching_sha2_password` authentication plugin.

* Clients that are in possession of the RSA public key can perform RSA key pair-based password exchange with the server during the connection process, as described later.

* For connections by accounts that authenticate with `caching_sha2_password` and RSA key pair-based password exchange, the server does not send the RSA public key to clients by default. Clients can use a client-side copy of the required public key, or request the public key from the server.

  Use of a trusted local copy of the public key enables the client to avoid a round trip in the client/server protocol, and is more secure than requesting the public key from the server. On the other hand, requesting the public key from the server is more convenient (it requires no management of a client-side file) and may be acceptable in secure network environments.

  + For command-line clients, use the `--server-public-key-path` option to specify the RSA public key file. Use the `--get-server-public-key` option to request the public key from the server. The following programs support the two options: **mysql**, **mysqladmin**, **mysqlbinlog**, **mysqlcheck**, **mysqldump**, **mysqlimport**, **mysqlpump**, **mysqlshow**, **mysqlslap**, **mysqltest**.

  + For programs that use the C API, call `mysql_options()` to specify the RSA public key file by passing the `MYSQL_SERVER_PUBLIC_KEY` option and the name of the file, or request the public key from the server by passing the `MYSQL_OPT_GET_SERVER_PUBLIC_KEY` option.

  In all cases, if the option is given to specify a valid public key file, it takes precedence over the option to request the public key from the server.

For clients that use the `caching_sha2_password` plugin, passwords are never exposed as cleartext when connecting to the MySQL 8.0 or higher server. How password transmission occurs depends on whether a secure connection or RSA encryption is used:

* If the connection is secure, an RSA key pair is unnecessary and is not used. This applies to TCP connections encrypted using TLS, as well as Unix socket-file and shared-memory connections. The password is sent as cleartext but cannot be snooped because the connection is secure.

* If the connection is not secure, an RSA key pair is used. This applies to TCP connections not encrypted using TLS and named-pipe connections. RSA is used only for password exchange between client and server, to prevent password snooping. When the server receives the encrypted password, it decrypts it. A scramble is used in the encryption to prevent repeat attacks.

* If a secure connection is not used and RSA encryption is not available, the connection attempt fails because the password cannot be sent without being exposed as cleartext.

As mentioned previously, RSA password encryption is available only if MySQL 5.7 was compiled using OpenSSL. The implication for clients from MySQL 5.7 distributions compiled using yaSSL is that, to use SHA-2 passwords, clients *must* use an encrypted connection to access the server. See Section 6.3.1, “Configuring MySQL to Use Encrypted Connections”.

Assuming that MySQL 5.7 has been compiled using OpenSSL, use the following procedure to enable use of an RSA key pair for password exchange during the client connection process.

Important

Aspects of this procedure that pertain to server configuration must be done on the MySQL 8.0 or higher server to which you wish to connect using MySQL 5.7 clients, *not* on your MySQL 5.7 server.

1. Create the RSA private and public key-pair files using the instructions in Section 6.3.3, “Creating SSL and RSA Certificates and Keys”.

2. If the private and public key files are located in the data directory and are named `private_key.pem` and `public_key.pem` (the default values of the `caching_sha2_password_private_key_path` and `caching_sha2_password_public_key_path` system variables), the server uses them automatically at startup.

   Otherwise, to name the key files explicitly, set the system variables to the key file names in the server option file. If the files are located in the server data directory, you need not specify their full path names:

   ```sql
   [mysqld]
   caching_sha2_password_private_key_path=myprivkey.pem
   caching_sha2_password_public_key_path=mypubkey.pem
   ```

   If the key files are not located in the data directory, or to make their locations explicit in the system variable values, use full path names:

   ```sql
   [mysqld]
   caching_sha2_password_private_key_path=/usr/local/mysql/myprivkey.pem
   caching_sha2_password_public_key_path=/usr/local/mysql/mypubkey.pem
   ```

3. Restart the server, then connect to it and check the `Caching_sha2_password_rsa_public_key` status variable value. The actual value differs from that shown here, but should be nonempty:

   ```sql
   mysql> SHOW STATUS LIKE 'Caching_sha2_password_rsa_public_key'\G
   *************************** 1. row ***************************
   Variable_name: Caching_sha2_password_rsa_public_key
           Value: -----BEGIN PUBLIC KEY-----
   MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDO9nRUDd+KvSZgY7cNBZMNpwX6
   MvE1PbJFXO7u18nJ9lwc99Du/E7lw6CVXw7VKrXPeHbVQUzGyUNkf45Nz/ckaaJa
   aLgJOBCIDmNVnyU54OT/1lcs2xiyfaDMe8fCJ64ZwTnKbY2gkt1IMjUAB5Ogd5kJ
   g8aV7EtKwyhHb0c30QIDAQAB
   -----END PUBLIC KEY-----
   ```

   If the value is empty, the server found some problem with the key files. Check the error log for diagnostic information.

After the server has been configured with the RSA key files, accounts that authenticate with the `caching_sha2_password` plugin have the option of using those key files to connect to the server. As mentioned previously, such accounts can use either a secure connection (in which case RSA is not used) or an unencrypted connection that performs password exchange using RSA. Suppose that an unencrypted connection is used. For example:

```sql
$> mysql --ssl-mode=DISABLED -u sha2user -p
Enter password: password
```

For this connection attempt by `sha2user`, the server determines that `caching_sha2_password` is the appropriate authentication plugin and invokes it (because that was the plugin specified at `CREATE USER` time). The plugin finds that the connection is not encrypted and thus requires the password to be transmitted using RSA encryption. However, the server does not send the public key to the client, and the client provided no public key, so it cannot encrypt the password and the connection fails:

```sql
ERROR 2061 (HY000): Authentication plugin '`caching_sha2_password`'
reported error: Authentication requires secure connection.
```

To request the RSA public key from the server, specify the `--get-server-public-key` option:

```sql
$> mysql --ssl-mode=DISABLED -u sha2user -p --get-server-public-key
Enter password: password
```

In this case, the server sends the RSA public key to the client, which uses it to encrypt the password and returns the result to the server. The plugin uses the RSA private key on the server side to decrypt the password and accepts or rejects the connection based on whether the password is correct.

Alternatively, if the client has a file containing a local copy of the RSA public key required by the server, it can specify the file using the `--server-public-key-path` option:

```sql
$> mysql --ssl-mode=DISABLED -u sha2user -p --server-public-key-path=file_name
Enter password: password
```

In this case, the client uses the public key to encrypt the password and returns the result to the server. The plugin uses the RSA private key on the server side to decrypt the password and accepts or rejects the connection based on whether the password is correct.

The public key value in the file named by the `--server-public-key-path` option should be the same as the key value in the server-side file named by the `caching_sha2_password_public_key_path` system variable. If the key file contains a valid public key value but the value is incorrect, an access-denied error occurs. If the key file does not contain a valid public key, the client program cannot use it.

Client users can obtain the RSA public key two ways:

* The database administrator can provide a copy of the public key file.

* A client user who can connect to the server some other way can use a `SHOW STATUS LIKE 'Caching_sha2_password_rsa_public_key'` statement and save the returned key value in a file.

##### Cache Operation for SHA-2 Pluggable Authentication

On the server side, the `caching_sha2_password` plugin uses an in-memory cache for faster authentication of clients who have connected previously. For MySQL 5.7, which supports only the `caching_sha2_password` client-side plugin, this server-side caching thus takes place on the MySQL 8.0 or higher server to which you connect using MySQL 5.7 clients. For information about cache operation, see Cache Operation for SHA-2 Pluggable Authentication, in the *MySQL 8.0 Reference Manual*.


#### 6.4.1.5 SHA-256 Pluggable Authentication

MySQL provides two authentication plugins that implement SHA-256 hashing for user account passwords:

* `sha256_password`: Implements basic SHA-256 authentication.

* `caching_sha2_password`: Implements SHA-256 authentication (like `sha256_password`), but uses caching on the server side for better performance and has additional features for wider applicability.

This section describes the original noncaching SHA-2 authentication plugin. For information about the caching plugin, see Section 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

Important

To connect to the server using an account that authenticates with the `sha256_password` plugin, you must use either a TLS connection or an unencrypted connection that supports password exchange using an RSA key pair, as described later in this section. Either way, the `sha256_password` plugin uses MySQL' encryption capabilities. See Section 6.3, “Using Encrypted Connections”.

Note

In the name `sha256_password`, “sha256” refers to the 256-bit digest length the plugin uses for encryption. In the name `caching_sha2_password`, “sha2” refers more generally to the SHA-2 class of encryption algorithms, of which 256-bit encryption is one instance. The latter name choice leaves room for future expansion of possible digest lengths without changing the plugin name.

The following table shows the plugin names on the server and client sides.

**Table 6.11 Plugin and Library Names for SHA-256 Authentication**

<table summary="Names for the plugins and library file used for SHA-256 password authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>sha256_password</code></td> </tr><tr> <td>Client-side plugin</td> <td><code>sha256_password</code></td> </tr><tr> <td>Library file</td> <td>None (plugins are built in)</td> </tr></tbody></table>

The following sections provide installation and usage information specific to SHA-256 pluggable authentication:

* Installing SHA-256 Pluggable Authentication
* Using SHA-256 Pluggable Authentication

For general information about pluggable authentication in MySQL, see Section 6.2.13, “Pluggable Authentication”.

##### Installing SHA-256 Pluggable Authentication

The `sha256_password` plugin exists in server and client forms:

* The server-side plugin is built into the server, need not be loaded explicitly, and cannot be disabled by unloading it.

* The client-side plugin is built into the `libmysqlclient` client library and is available to any program linked against `libmysqlclient`.

##### Using SHA-256 Pluggable Authentication

To set up an account that uses the `sha256_password` plugin for SHA-256 password hashing, use the following statement, where *`password`* is the desired account password:

```sql
CREATE USER 'sha256user'@'localhost'
IDENTIFIED WITH sha256_password BY 'password';
```

The server assigns the `sha256_password` plugin to the account and uses it to encrypt the password using SHA-256, storing those values in the `plugin` and `authentication_string` columns of the `mysql.user` system table.

The preceding instructions do not assume that `sha256_password` is the default authentication plugin. If `sha256_password` is the default authentication plugin, a simpler `CREATE USER` syntax can be used.

To start the server with the default authentication plugin set to `sha256_password`, put these lines in the server option file:

```sql
[mysqld]
default_authentication_plugin=sha256_password
```

That causes the `sha256_password` plugin to be used by default for new accounts. As a result, it is possible to create the account and set its password without naming the plugin explicitly:

```sql
CREATE USER 'sha256user'@'localhost' IDENTIFIED BY 'password';
```

Another consequence of setting `default_authentication_plugin` to `sha256_password` is that, to use some other plugin for account creation, you must specify that plugin explicitly. For example, to use the `mysql_native_password` plugin, use this statement:

```sql
CREATE USER 'nativeuser'@'localhost'
IDENTIFIED WITH mysql_native_password BY 'password';
```

`sha256_password` supports connections over secure transport. `sha256_password` also supports encrypted password exchange using RSA over unencrypted connections if these conditions are satisfied:

* MySQL is compiled using OpenSSL, not yaSSL. `sha256_password` works with distributions compiled using either package, but RSA support requires OpenSSL.

  Note

  It is possible to compile MySQL using yaSSL as an alternative to OpenSSL only prior to MySQL 5.7.28. As of MySQL 5.7.28, support for yaSSL is removed and all MySQL builds use OpenSSL.

* The MySQL server to which you wish to connect is configured to support RSA (using the RSA configuration procedure given later in this section).

RSA support has these characteristics:

* On the server side, two system variables name the RSA private and public key-pair files: `sha256_password_private_key_path` and `sha256_password_public_key_path`. The database administrator must set these variables at server startup if the key files to use have names that differ from the system variable default values.

* The server uses the `sha256_password_auto_generate_rsa_keys` system variable to determine whether to automatically generate the RSA key-pair files. See Section 6.3.3, “Creating SSL and RSA Certificates and Keys”.

* The `Rsa_public_key` status variable displays the RSA public key value used by the `sha256_password` authentication plugin.

* Clients that are in possession of the RSA public key can perform RSA key pair-based password exchange with the server during the connection process, as described later.

* For connections by accounts that authenticate using `sha256_password` and RSA public key pair-based password exchange, the server sends the RSA public key to the client as needed. However, if a copy of the public key is available on the client host, the client can use it to save a round trip in the client/server protocol:

  + For these command-line clients, use the `--server-public-key-path` option to specify the RSA public key file: **mysql**, **mysqltest**, and (as of MySQL 5.7.23) **mysqladmin**, **mysqlbinlog**, **mysqlcheck**, **mysqldump**, **mysqlimport**, **mysqlpump**, **mysqlshow**, **mysqlslap**, **mysqltest**.

  + For programs that use the C API, call `mysql_options()` to specify the RSA public key file by passing the `MYSQL_SERVER_PUBLIC_KEY` option and the name of the file.

  + For replicas, RSA key pair-based password exchange cannot be used to connect to source servers for accounts that authenticate with the `sha256_password` plugin. For such accounts, only secure connections can be used.

For clients that use the `sha256_password` plugin, passwords are never exposed as cleartext when connecting to the server. How password transmission occurs depends on whether a secure connection or RSA encryption is used:

* If the connection is secure, an RSA key pair is unnecessary and is not used. This applies to connections encrypted using TLS. The password is sent as cleartext but cannot be snooped because the connection is secure.

  Note

  Unlike `caching_sha2_password`, the `sha256_password` plugin does not treat shared-memory connections as secure, even though share-memory transport is secure by default.

* If the connection is not secure, and an RSA key pair is available, the connection remains unencrypted. This applies to connections not encrypted using TLS. RSA is used only for password exchange between client and server, to prevent password snooping. When the server receives the encrypted password, it decrypts it. A scramble is used in the encryption to prevent repeat attacks.

* If a secure connection is not used and RSA encryption is not available, the connection attempt fails because the password cannot be sent without being exposed as cleartext.

As mentioned previously, RSA password encryption is available only if MySQL was compiled using OpenSSL. The implication for MySQL distributions compiled using yaSSL is that, to use SHA-256 passwords, clients *must* use an encrypted connection to access the server. See Section 6.3.1, “Configuring MySQL to Use Encrypted Connections”.

Note

To use RSA password encryption with `sha256_password`, the client and server both must be compiled using OpenSSL, not just one of them.

Assuming that MySQL has been compiled using OpenSSL, use the following procedure to enable use of an RSA key pair for password exchange during the client connection process:

1. Create the RSA private and public key-pair files using the instructions in Section 6.3.3, “Creating SSL and RSA Certificates and Keys”.

2. If the private and public key files are located in the data directory and are named `private_key.pem` and `public_key.pem` (the default values of the `sha256_password_private_key_path` and `sha256_password_public_key_path` system variables), the server uses them automatically at startup.

   Otherwise, to name the key files explicitly, set the system variables to the key file names in the server option file. If the files are located in the server data directory, you need not specify their full path names:

   ```sql
   [mysqld]
   sha256_password_private_key_path=myprivkey.pem
   sha256_password_public_key_path=mypubkey.pem
   ```

   If the key files are not located in the data directory, or to make their locations explicit in the system variable values, use full path names:

   ```sql
   [mysqld]
   sha256_password_private_key_path=/usr/local/mysql/myprivkey.pem
   sha256_password_public_key_path=/usr/local/mysql/mypubkey.pem
   ```

3. Restart the server, then connect to it and check the `Rsa_public_key` status variable value. The actual value differs from that shown here, but should be nonempty:

   ```sql
   mysql> SHOW STATUS LIKE 'Rsa_public_key'\G
   *************************** 1. row ***************************
   Variable_name: Rsa_public_key
           Value: -----BEGIN PUBLIC KEY-----
   MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDO9nRUDd+KvSZgY7cNBZMNpwX6
   MvE1PbJFXO7u18nJ9lwc99Du/E7lw6CVXw7VKrXPeHbVQUzGyUNkf45Nz/ckaaJa
   aLgJOBCIDmNVnyU54OT/1lcs2xiyfaDMe8fCJ64ZwTnKbY2gkt1IMjUAB5Ogd5kJ
   g8aV7EtKwyhHb0c30QIDAQAB
   -----END PUBLIC KEY-----
   ```

   If the value is empty, the server found some problem with the key files. Check the error log for diagnostic information.

After the server has been configured with the RSA key files, accounts that authenticate with the `sha256_password` plugin have the option of using those key files to connect to the server. As mentioned previously, such accounts can use either a secure connection (in which case RSA is not used) or an unencrypted connection that performs password exchange using RSA. Suppose that an unencrypted connection is used. For example:

```sql
$> mysql --ssl-mode=DISABLED -u sha256user -p
Enter password: password
```

For this connection attempt by `sha256user`, the server determines that `sha256_password` is the appropriate authentication plugin and invokes it (because that was the plugin specified at `CREATE USER` time). The plugin finds that the connection is not encrypted and thus requires the password to be transmitted using RSA encryption. In this case, the plugin sends the RSA public key to the client, which uses it to encrypt the password and returns the result to the server. The plugin uses the RSA private key on the server side to decrypt the password and accepts or rejects the connection based on whether the password is correct.

The server sends the RSA public key to the client as needed. However, if the client has a file containing a local copy of the RSA public key required by the server, it can specify the file using the `--server-public-key-path` option:

```sql
$> mysql --ssl-mode=DISABLED -u sha256user -p --server-public-key-path=file_name
Enter password: password
```

The public key value in the file named by the `--server-public-key-path` option should be the same as the key value in the server-side file named by the `sha256_password_public_key_path` system variable. If the key file contains a valid public key value but the value is incorrect, an access-denied error occurs. If the key file does not contain a valid public key, the client program cannot use it. In this case, the `sha256_password` plugin sends the public key to the client as if no `--server-public-key-path` option had been specified.

Client users can obtain the RSA public key two ways:

* The database administrator can provide a copy of the public key file.

* A client user who can connect to the server some other way can use a `SHOW STATUS LIKE 'Rsa_public_key'` statement and save the returned key value in a file.


#### 6.4.1.6 Client-Side Cleartext Pluggable Authentication

A client-side authentication plugin is available that enables clients to send passwords to the server as cleartext, without hashing or encryption. This plugin is built into the MySQL client library.

The following table shows the plugin name.

**Table 6.12 Plugin and Library Names for Cleartext Authentication**

<table summary="Names for the plugins and library file used for cleartext password authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td>None, see discussion</td> </tr><tr> <td>Client-side plugin</td> <td><code>mysql_clear_password</code></td> </tr><tr> <td>Library file</td> <td>None (plugin is built in)</td> </tr></tbody></table>

Many client-side authentication plugins perform hashing or encryption of a password before the client sends it to the server. This enables clients to avoid sending passwords as cleartext.

Hashing or encryption cannot be done for authentication schemes that require the server to receive the password as entered on the client side. In such cases, the client-side `mysql_clear_password` plugin is used, which enables the client to send the password to the server as cleartext. There is no corresponding server-side plugin. Rather, `mysql_clear_password` can be used on the client side in concert with any server-side plugin that needs a cleartext password. (Examples are the PAM and simple LDAP authentication plugins; see Section 6.4.1.7, “PAM Pluggable Authentication”, and Section 6.4.1.9, “LDAP Pluggable Authentication”.)

The following discussion provides usage information specific to cleartext pluggable authentication. For general information about pluggable authentication in MySQL, see Section 6.2.13, “Pluggable Authentication”.

Note

Sending passwords as cleartext may be a security problem in some configurations. To avoid problems if there is any possibility that the password would be intercepted, clients should connect to MySQL Server using a method that protects the password. Possibilities include SSL (see Section 6.3, “Using Encrypted Connections”), IPsec, or a private network.

To make inadvertent use of the `mysql_clear_password` plugin less likely, MySQL clients must explicitly enable it. This can be done in several ways:

* Set the `LIBMYSQL_ENABLE_CLEARTEXT_PLUGIN` environment variable to a value that begins with `1`, `Y`, or `y`. This enables the plugin for all client connections.

* The **mysql**, **mysqladmin**, and **mysqlslap** client programs (also **mysqlcheck**, **mysqldump**, and **mysqlshow** for MySQL 5.7.10 and later) support an `--enable-cleartext-plugin` option that enables the plugin on a per-invocation basis.

* The `mysql_options()` C API function supports a `MYSQL_ENABLE_CLEARTEXT_PLUGIN` option that enables the plugin on a per-connection basis. Also, any program that uses `libmysqlclient` and reads option files can enable the plugin by including an `enable-cleartext-plugin` option in an option group read by the client library.


#### 6.4.1.7 PAM Pluggable Authentication

Note

PAM pluggable authentication is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

MySQL Enterprise Edition supports an authentication method that enables MySQL Server to use PAM (Pluggable Authentication Modules) to authenticate MySQL users. PAM enables a system to use a standard interface to access various kinds of authentication methods, such as traditional Unix passwords or an LDAP directory.

PAM pluggable authentication provides these capabilities:

* External authentication: PAM authentication enables MySQL Server to accept connections from users defined outside the MySQL grant tables and that authenticate using methods supported by PAM.

* Proxy user support: PAM authentication can return to MySQL a user name different from the external user name passed by the client program, based on the PAM groups the external user is a member of and the authentication string provided. This means that the plugin can return the MySQL user that defines the privileges the external PAM-authenticated user should have. For example, an operating sytem user named `joe` can connect and have the privileges of a MySQL user named `developer`.

PAM pluggable authentication has been tested on Linux and macOS.

The following table shows the plugin and library file names. The file name suffix might differ on your system. The file must be located in the directory named by the `plugin_dir` system variable. For installation information, see Installing PAM Pluggable Authentication.

**Table 6.13 Plugin and Library Names for PAM Authentication**

<table summary="Names for the plugins and library file used for PAM password authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>authentication_pam</code></td> </tr><tr> <td>Client-side plugin</td> <td><code>mysql_clear_password</code></td> </tr><tr> <td>Library file</td> <td><code>authentication_pam.so</code></td> </tr></tbody></table>

The client-side `mysql_clear_password` cleartext plugin that communicates with the server-side PAM plugin is built into the `libmysqlclient` client library and is included in all distributions, including community distributions. Inclusion of the client-side cleartext plugin in all MySQL distributions enables clients from any distribution to connect to a server that has the server-side PAM plugin loaded.

The following sections provide installation and usage information specific to PAM pluggable authentication:

* How PAM Authentication of MySQL Users Works
* Installing PAM Pluggable Authentication
* Uninstalling PAM Pluggable Authentication
* Using PAM Pluggable Authentication
* PAM Unix Password Authentication without Proxy Users
* PAM LDAP Authentication without Proxy Users
* PAM Unix Password Authentication with Proxy Users and Group Mapping
* PAM Authentication Access to Unix Password Store
* PAM Authentication Debugging

For general information about pluggable authentication in MySQL, see Section 6.2.13, “Pluggable Authentication”. For information about the `mysql_clear_password` plugin, see Section 6.4.1.6, “Client-Side Cleartext Pluggable Authentication”. For proxy user information, see Section 6.2.14, “Proxy Users”.

##### How PAM Authentication of MySQL Users Works

This section provides an overview of how MySQL and PAM work together to authenticate MySQL users. For examples showing how to set up MySQL accounts to use specific PAM services, see Using PAM Pluggable Authentication.

1. The client program and the server communicate, with the client sending to the server the client user name (the operating system user name by default) and password:

   * The client user name is the external user name.
   * For accounts that use the PAM server-side authentication plugin, the corresponding client-side plugin is `mysql_clear_password`. This client-side plugin performs no password hashing, with the result that the client sends the password to the server as cleartext.

2. The server finds a matching MySQL account based on the external user name and the host from which the client connects. The PAM plugin uses the information passed to it by MySQL Server (such as user name, host name, password, and authentication string). When you define a MySQL account that authenticates using PAM, the authentication string contains:

   * A PAM service name, which is a name that the system administrator can use to refer to an authentication method for a particular application. There can be multiple applications associated with a single database server instance, so the choice of service name is left to the SQL application developer.

   * Optionally, if proxying is to be used, a mapping from PAM groups to MySQL user names.

3. The plugin uses the PAM service named in the authentication string to check the user credentials and returns `'Authentication succeeded, Username is user_name'` or `'Authentication failed'`. The password must be appropriate for the password store used by the PAM service. Examples:

   * For traditional Unix passwords, the service looks up passwords stored in the `/etc/shadow` file.

   * For LDAP, the service looks up passwords stored in an LDAP directory.

   If the credentials check fails, the server refuses the connection.

4. Otherwise, the authentication string indicates whether proxying occurs. If the string contains no PAM group mapping, proxying does not occur. In this case, the MySQL user name is the same as the external user name.

5. Otherwise, proxying is indicated based on the PAM group mapping, with the MySQL user name determined based on the first matching group in the mapping list. The meaning of “PAM group” depends on the PAM service. Examples:

   * For traditional Unix passwords, groups are Unix groups defined in the `/etc/group` file, possibly supplemented with additional PAM information in a file such as `/etc/security/group.conf`.

   * For LDAP, groups are LDAP groups defined in an LDAP directory.

   If the proxy user (the external user) has the `PROXY` privilege for the proxied MySQL user name, proxying occurs, with the proxy user assuming the privileges of the proxied user.

##### Installing PAM Pluggable Authentication

This section describes how to install the server-side PAM authentication plugin. For general information about installing plugins, see Section 5.5.1, “Installing and Uninstalling Plugins”.

To be usable by the server, the plugin library file must be located in the MySQL plugin directory (the directory named by the `plugin_dir` system variable). If necessary, configure the plugin directory location by setting the value of `plugin_dir` at server startup.

The plugin library file base name is `authentication_pam`. The file name suffix differs per platform (for example, `.so` for Unix and Unix-like systems, `.dll` for Windows).

To load the plugin at server startup, use the `--plugin-load-add` option to name the library file that contains it. With this plugin-loading method, the option must be given each time the server starts. For example, put these lines in the server `my.cnf` file, adjusting the `.so` suffix for your platform as necessary:

```sql
[mysqld]
plugin-load-add=authentication_pam.so
```

After modifying `my.cnf`, restart the server to cause the new settings to take effect.

Alternatively, to load the plugin at runtime, use this statement, adjusting the `.so` suffix for your platform as necessary:

```sql
INSTALL PLUGIN authentication_pam SONAME 'authentication_pam.so';
```

`INSTALL PLUGIN` loads the plugin immediately, and also registers it in the `mysql.plugins` system table to cause the server to load it for each subsequent normal startup without the need for `--plugin-load-add`.

To verify plugin installation, examine the Information Schema `PLUGINS` table or use the `SHOW PLUGINS` statement (see Section 5.5.2, “Obtaining Server Plugin Information”). For example:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%pam%';
+--------------------+---------------+
| PLUGIN_NAME        | PLUGIN_STATUS |
+--------------------+---------------+
| authentication_pam | ACTIVE        |
+--------------------+---------------+
```

If the plugin fails to initialize, check the server error log for diagnostic messages.

To associate MySQL accounts with the PAM plugin, see Using PAM Pluggable Authentication.

##### Uninstalling PAM Pluggable Authentication

The method used to uninstall the PAM authentication plugin depends on how you installed it:

* If you installed the plugin at server startup using a `--plugin-load-add` option, restart the server without the option.

* If you installed the plugin at runtime using an `INSTALL PLUGIN` statement, it remains installed across server restarts. To uninstall it, use `UNINSTALL PLUGIN`:

  ```sql
  UNINSTALL PLUGIN authentication_pam;
  ```

##### Using PAM Pluggable Authentication

This section describes in general terms how to use the PAM authentication plugin to connect from MySQL client programs to the server. The following sections provide instructions for using PAM authentication in specific ways. It is assumed that the server is running with the server-side PAM plugin enabled, as described in Installing PAM Pluggable Authentication.

To refer to the PAM authentication plugin in the `IDENTIFIED WITH` clause of a `CREATE USER` statement, use the name `authentication_pam`. For example:

```sql
CREATE USER user
  IDENTIFIED WITH authentication_pam
  AS 'auth_string';
```

The authentication string specifies the following types of information:

* The PAM service name (see How PAM Authentication of MySQL Users Works). Examples in the following discussion use a service name of `mysql-unix` for authentication using traditional Unix passwords, and `mysql-ldap` for authentication using LDAP.

* For proxy support, PAM provides a way for a PAM module to return to the server a MySQL user name other than the external user name passed by the client program when it connects to the server. Use the authentication string to control the mapping from external user names to MySQL user names. If you want to take advantage of proxy user capabilities, the authentication string must include this kind of mapping.

For example, if an account uses the `mysql-unix` PAM service name and should map operating system users in the `root` and `users` PAM groups to the `developer` and `data_entry` MySQL users, respectively, use a statement like this:

```sql
CREATE USER user
  IDENTIFIED WITH authentication_pam
  AS 'mysql-unix, root=developer, users=data_entry';
```

Authentication string syntax for the PAM authentication plugin follows these rules:

* The string consists of a PAM service name, optionally followed by a PAM group mapping list consisting of one or more keyword/value pairs each specifying a PAM group name and a MySQL user name:

  ```sql
  pam_service_name[,pam_group_name=mysql_user_name]...
  ```

  The plugin parses the authentication string for each connection attempt that uses the account. To minimize overhead, keep the string as short as possible.

* Each `pam_group_name=mysql_user_name` pair must be preceded by a comma.

* Leading and trailing spaces not inside double quotation marks are ignored.

* Unquoted *`pam_service_name`*, *`pam_group_name`*, and *`mysql_user_name`* values can contain anything except equal sign, comma, or space.

* If a *`pam_service_name`*, *`pam_group_name`*, or *`mysql_user_name`* value is quoted with double quotation marks, everything between the quotation marks is part of the value. This is necessary, for example, if the value contains space characters. All characters are legal except double quotation mark and backslash (`\`). To include either character, escape it with a backslash.

If the plugin successfully authenticates the external user name (the name passed by the client), it looks for a PAM group mapping list in the authentication string and, if present, uses it to return a different MySQL user name to the MySQL server based on which PAM groups the external user is a member of:

* If the authentication string contains no PAM group mapping list, the plugin returns the external name.

* If the authentication string does contain a PAM group mapping list, the plugin examines each `pam_group_name=mysql_user_name` pair in the list from left to right and tries to find a match for the *`pam_group_name`* value in a non-MySQL directory of the groups assigned to the authenticated user and returns *`mysql_user_name`* for the first match it finds. If the plugin finds no match for any PAM group, it returns the external name. If the plugin is not capable of looking up a group in a directory, it ignores the PAM group mapping list and returns the external name.

The following sections describe how to set up several authentication scenarios that use the PAM authentication plugin:

* No proxy users. This uses PAM only to check login names and passwords. Every external user permitted to connect to MySQL Server should have a matching MySQL account that is defined to use PAM authentication. (For a MySQL account of `'user_name'@'host_name'` to match the external user, *`user_name`* must be the external user name and *`host_name`* must match the host from which the client connects.) Authentication can be performed by various PAM-supported methods. Later discussion shows how to authenticate client credentials using traditional Unix passwords, and passwords in LDAP.

  PAM authentication, when not done through proxy users or PAM groups, requires the MySQL user name to be same as the operating system user name. MySQL user names are limited to 32 characters (see Section 6.2.3, “Grant Tables”), which limits PAM nonproxy authentication to Unix accounts with names of at most 32 characters.

* Proxy users only, with PAM group mapping. For this scenario, create one or more MySQL accounts that define different sets of privileges. (Ideally, nobody should connect using those accounts directly.) Then define a default user authenticating through PAM that uses some mapping scheme (usually based on the external PAM groups the users are members of) to map all the external user names to the few MySQL accounts holding the privilege sets. Any client who connects and specifies an external user name as the client user name is mapped to one of the MySQL accounts and uses its privileges. The discussion shows how to set this up using traditional Unix passwords, but other PAM methods such as LDAP could be used instead.

Variations on these scenarios are possible:

* You can permit some users to log in directly (without proxying) but require others to connect through proxy accounts.

* You can use one PAM authentication method for some users, and another method for other users, by using differing PAM service names among your PAM-authenticated accounts. For example, you can use the `mysql-unix` PAM service for some users, and `mysql-ldap` for others.

The examples make the following assumptions. You might need to make some adjustments if your system is set up differently.

* The login name and password are `antonio` and *`antonio_password`*, respectively. Change these to correspond to the user you want to authenticate.

* The PAM configuration directory is `/etc/pam.d`.

* The PAM service name corresponds to the authentication method (`mysql-unix` or `mysql-ldap` in this discussion). To use a given PAM service, you must set up a PAM file with the same name in the PAM configuration directory (creating the file if it does not exist). In addition, you must name the PAM service in the authentication string of the `CREATE USER` statement for any account that authenticates using that PAM service.

The PAM authentication plugin checks at initialization time whether the `AUTHENTICATION_PAM_LOG` environment value is set in the server's startup environment. If so, the plugin enables logging of diagnostic messages to the standard output. Depending on how your server is started, the message might appear on the console or in the error log. These messages can be helpful for debugging PAM-related issues that occur when the plugin performs authentication. For more information, see PAM Authentication Debugging.

##### PAM Unix Password Authentication without Proxy Users

This authentication scenario uses PAM to check external users defined in terms of operating system user names and Unix passwords, without proxying. Every such external user permitted to connect to MySQL Server should have a matching MySQL account that is defined to use PAM authentication through traditional Unix password store.

Note

Traditional Unix passwords are checked using the `/etc/shadow` file. For information regarding possible issues related to this file, see PAM Authentication Access to Unix Password Store.

1. Verify that Unix authentication permits logins to the operating system with the user name `antonio` and password *`antonio_password`*.

2. Set up PAM to authenticate MySQL connections using traditional Unix passwords by creating a `mysql-unix` PAM service file named `/etc/pam.d/mysql-unix`. The file contents are system dependent, so check existing login-related files in the `/etc/pam.d` directory to see what they look like. On Linux, the `mysql-unix` file might look like this:

   ```sql
   #%PAM-1.0
   auth            include         password-auth
   account         include         password-auth
   ```

   For macOS, use `login` rather than `password-auth`.

   The PAM file format might differ on some systems. For example, on Ubuntu and other Debian-based systems, use these file contents instead:

   ```sql
   @include common-auth
   @include common-account
   @include common-session-noninteractive
   ```

3. Create a MySQL account with the same user name as the operating system user name and define it to authenticate using the PAM plugin and the `mysql-unix` PAM service:

   ```sql
   CREATE USER 'antonio'@'localhost'
     IDENTIFIED WITH authentication_pam
     AS 'mysql-unix';
   GRANT ALL PRIVILEGES
     ON mydb.*
     TO 'antonio'@'localhost';
   ```

   Here, the authentication string contains only the PAM service name, `mysql-unix`, which authenticates Unix passwords.

4. Use the **mysql** command-line client to connect to the MySQL server as `antonio`. For example:

   ```sql
   $> mysql --user=antonio --password --enable-cleartext-plugin
   Enter password: antonio_password
   ```

   The server should permit the connection and the following query returns output as shown:

   ```sql
   mysql> SELECT USER(), CURRENT_USER(), @@proxy_user;
   +-------------------+-------------------+--------------+
   | USER()            | CURRENT_USER()    | @@proxy_user |
   +-------------------+-------------------+--------------+
   | antonio@localhost | antonio@localhost | NULL         |
   +-------------------+-------------------+--------------+
   ```

   This demonstrates that the `antonio` operating system user is authenticated to have the privileges granted to the `antonio` MySQL user, and that no proxying has occurred.

Note

The client-side `mysql_clear_password` authentication plugin leaves the password untouched, so client programs send it to the MySQL server as cleartext. This enables the password to be passed as is to PAM. A cleartext password is necessary to use the server-side PAM library, but may be a security problem in some configurations. These measures minimize the risk:

* To make inadvertent use of the `mysql_clear_password` plugin less likely, MySQL clients must explicitly enable it (for example, with the `--enable-cleartext-plugin` option). See Section 6.4.1.6, “Client-Side Cleartext Pluggable Authentication”.

* To avoid password exposure with the `mysql_clear_password` plugin enabled, MySQL clients should connect to the MySQL server using an encrypted connection. See Section 6.3.1, “Configuring MySQL to Use Encrypted Connections”.

##### PAM LDAP Authentication without Proxy Users

This authentication scenario uses PAM to check external users defined in terms of operating system user names and LDAP passwords, without proxying. Every such external user permitted to connect to MySQL Server should have a matching MySQL account that is defined to use PAM authentication through LDAP.

To use PAM LDAP pluggable authentication for MySQL, these prerequisites must be satisfied:

* An LDAP server must be available for the PAM LDAP service to communicate with.

* Each LDAP user to be authenticated by MySQL must be present in the directory managed by the LDAP server.

Note

Another way to use LDAP for MySQL user authentication is to use the LDAP-specific authentication plugins. See Section 6.4.1.9, “LDAP Pluggable Authentication”.

Configure MySQL for PAM LDAP authentication as follows:

1. Verify that Unix authentication permits logins to the operating system with the user name `antonio` and password *`antonio_password`*.

2. Set up PAM to authenticate MySQL connections using LDAP by creating a `mysql-ldap` PAM service file named `/etc/pam.d/mysql-ldap`. The file contents are system dependent, so check existing login-related files in the `/etc/pam.d` directory to see what they look like. On Linux, the `mysql-ldap` file might look like this:

   ```sql
   #%PAM-1.0
   auth        required    pam_ldap.so
   account     required    pam_ldap.so
   ```

   If PAM object files have a suffix different from `.so` on your system, substitute the correct suffix.

   The PAM file format might differ on some systems.

3. Create a MySQL account with the same user name as the operating system user name and define it to authenticate using the PAM plugin and the `mysql-ldap` PAM service:

   ```sql
   CREATE USER 'antonio'@'localhost'
     IDENTIFIED WITH authentication_pam
     AS 'mysql-ldap';
   GRANT ALL PRIVILEGES
     ON mydb.*
     TO 'antonio'@'localhost';
   ```

   Here, the authentication string contains only the PAM service name, `mysql-ldap`, which authenticates using LDAP.

4. Connecting to the server is the same as described in PAM Unix Password Authentication without Proxy Users.

##### PAM Unix Password Authentication with Proxy Users and Group Mapping

The authentication scheme described here uses proxying and PAM group mapping to map connecting MySQL users who authenticate using PAM onto other MySQL accounts that define different sets of privileges. Users do not connect directly through the accounts that define the privileges. Instead, they connect through a default proxy account authenticated using PAM, such that all the external users are mapped to the MySQL accounts that hold the privileges. Any user who connects using the proxy account is mapped to one of those MySQL accounts, the privileges for which determine the database operations permitted to the external user.

The procedure shown here uses Unix password authentication. To use LDAP instead, see the early steps of PAM LDAP Authentication without Proxy Users.

Note

Traditional Unix passwords are checked using the `/etc/shadow` file. For information regarding possible issues related to this file, see PAM Authentication Access to Unix Password Store.

1. Verify that Unix authentication permits logins to the operating system with the user name `antonio` and password *`antonio_password`*.

2. Verify that `antonio` is a member of the `root` or `users` PAM group.

3. Set up PAM to authenticate the `mysql-unix` PAM service through operating system users by creating a file named `/etc/pam.d/mysql-unix`. The file contents are system dependent, so check existing login-related files in the `/etc/pam.d` directory to see what they look like. On Linux, the `mysql-unix` file might look like this:

   ```sql
   #%PAM-1.0
   auth            include         password-auth
   account         include         password-auth
   ```

   For macOS, use `login` rather than `password-auth`.

   The PAM file format might differ on some systems. For example, on Ubuntu and other Debian-based systems, use these file contents instead:

   ```sql
   @include common-auth
   @include common-account
   @include common-session-noninteractive
   ```

4. Create a default proxy user (`''@''`) that maps external PAM users to the proxied accounts:

   ```sql
   CREATE USER ''@''
     IDENTIFIED WITH authentication_pam
     AS 'mysql-unix, root=developer, users=data_entry';
   ```

   Here, the authentication string contains the PAM service name, `mysql-unix`, which authenticates Unix passwords. The authentication string also maps external users in the `root` and `users` PAM groups to the `developer` and `data_entry` MySQL user names, respectively.

   The PAM group mapping list following the PAM service name is required when you set up proxy users. Otherwise, the plugin cannot tell how to perform mapping from external user names to the proper proxied MySQL user names.

   Note

   If your MySQL installation has anonymous users, they might conflict with the default proxy user. For more information about this issue, and ways of dealing with it, see Default Proxy User and Anonymous User Conflicts.

5. Create the proxied accounts and grant to each one the privileges it should have:

   ```sql
   CREATE USER 'developer'@'localhost'
     IDENTIFIED WITH mysql_no_login;
   CREATE USER 'data_entry'@'localhost'
     IDENTIFIED WITH mysql_no_login;

   GRANT ALL PRIVILEGES
     ON mydevdb.*
     TO 'developer'@'localhost';
   GRANT ALL PRIVILEGES
     ON mydb.*
     TO 'data_entry'@'localhost';
   ```

   The proxied accounts use the `mysql_no_login` authentication plugin to prevent clients from using the accounts to log in directly to the MySQL server. Instead, it is expected that users who authenticate using PAM use the `developer` or `data_entry` account by proxy based on their PAM group. (This assumes that the plugin is installed. For instructions, see Section 6.4.1.10, “No-Login Pluggable Authentication”.) For alternative methods of protecting proxied accounts against direct use, see Preventing Direct Login to Proxied Accounts.

6. Grant to the proxy account the `PROXY` privilege for each proxied account:

   ```sql
   GRANT PROXY
     ON 'developer'@'localhost'
     TO ''@'';
   GRANT PROXY
     ON 'data_entry'@'localhost'
     TO ''@'';
   ```

7. Use the **mysql** command-line client to connect to the MySQL server as `antonio`.

   ```sql
   $> mysql --user=antonio --password --enable-cleartext-plugin
   Enter password: antonio_password
   ```

   The server authenticates the connection using the default `''@''` proxy account. The resulting privileges for `antonio` depend on which PAM groups `antonio` is a member of. If `antonio` is a member of the `root` PAM group, the PAM plugin maps `root` to the `developer` MySQL user name and returns that name to the server. The server verifies that `''@''` has the `PROXY` privilege for `developer` and permits the connection. The following query returns output as shown:

   ```sql
   mysql> SELECT USER(), CURRENT_USER(), @@proxy_user;
   +-------------------+---------------------+--------------+
   | USER()            | CURRENT_USER()      | @@proxy_user |
   +-------------------+---------------------+--------------+
   | antonio@localhost | developer@localhost | ''@''        |
   +-------------------+---------------------+--------------+
   ```

   This demonstrates that the `antonio` operating system user is authenticated to have the privileges granted to the `developer` MySQL user, and that proxying occurs through the default proxy account.

   If `antonio` is not a member of the `root` PAM group but is a member of the `users` PAM group, a similar process occurs, but the plugin maps `user` PAM group membership to the `data_entry` MySQL user name and returns that name to the server:

   ```sql
   mysql> SELECT USER(), CURRENT_USER(), @@proxy_user;
   +-------------------+----------------------+--------------+
   | USER()            | CURRENT_USER()       | @@proxy_user |
   +-------------------+----------------------+--------------+
   | antonio@localhost | data_entry@localhost | ''@''        |
   +-------------------+----------------------+--------------+
   ```

   This demonstrates that the `antonio` operating system user is authenticated to have the privileges of the `data_entry` MySQL user, and that proxying occurs through the default proxy account.

Note

The client-side `mysql_clear_password` authentication plugin leaves the password untouched, so client programs send it to the MySQL server as cleartext. This enables the password to be passed as is to PAM. A cleartext password is necessary to use the server-side PAM library, but may be a security problem in some configurations. These measures minimize the risk:

* To make inadvertent use of the `mysql_clear_password` plugin less likely, MySQL clients must explicitly enable it (for example, with the `--enable-cleartext-plugin` option). See Section 6.4.1.6, “Client-Side Cleartext Pluggable Authentication”.

* To avoid password exposure with the `mysql_clear_password` plugin enabled, MySQL clients should connect to the MySQL server using an encrypted connection. See Section 6.3.1, “Configuring MySQL to Use Encrypted Connections”.

##### PAM Authentication Access to Unix Password Store

On some systems, Unix authentication uses a password store such as `/etc/shadow`, a file that typically has restricted access permissions. This can cause MySQL PAM-based authentication to fail. Unfortunately, the PAM implementation does not permit distinguishing “password could not be checked” (due, for example, to inability to read `/etc/shadow`) from “password does not match.” If you are using Unix password store for PAM authentication, you may be able to enable access to it from MySQL using one of the following methods:

* Assuming that the MySQL server is run from the `mysql` operating system account, put that account in the `shadow` group that has `/etc/shadow` access:

  1. Create a `shadow` group in `/etc/group`.

  2. Add the `mysql` operating system user to the `shadow` group in `/etc/group`.

  3. Assign `/etc/group` to the `shadow` group and enable the group read permission:

     ```sql
     chgrp shadow /etc/shadow
     chmod g+r /etc/shadow
     ```

  4. Restart the MySQL server.
* If you are using the `pam_unix` module and the **unix\_chkpwd** utility, enable password store access as follows:

  ```sql
  chmod u-s /usr/sbin/unix_chkpwd
  setcap cap_dac_read_search+ep /usr/sbin/unix_chkpwd
  ```

  Adjust the path to **unix\_chkpwd** as necessary for your platform.

##### PAM Authentication Debugging

The PAM authentication plugin checks at initialization time whether the `AUTHENTICATION_PAM_LOG` environment value is set. In MySQL 5.7, and in MySQL NDB Cluster rrior to NDB 7.5.33 and NDB 7.6.29, the value does not matter. The plugin enables logging of diagnostic messages to the standard output, including passwords. These messages may be helpful for debugging PAM-related issues that occur when the plugin performs authentication.

In MySQL NDB Cluster, beginning with versions 7.5.33 and 7.6.29, passwords are *not* included if you set `AUTHENTICATION_PAM_LOG=1` (or some other arbitrary value); you can enable logging of debugging messages, passwords included, by setting `AUTHENTICATION_PAM_LOG=PAM_LOG_WITH_SECRET_INFO`.

Some messages include reference to PAM plugin source files and line numbers, which enables plugin actions to be tied more closely to the location in the code where they occur.

Another technique for debugging connection failures and determining what is happening during connection attempts is to configure PAM authentication to permit all connections, then check the system log files. This technique should be used only on a *temporary* basis, and not on a production server.

Configure a PAM service file named `/etc/pam.d/mysql-any-password` with these contents (the format may differ on some systems):

```sql
#%PAM-1.0
auth        required    pam_permit.so
account     required    pam_permit.so
```

Create an account that uses the PAM plugin and names the `mysql-any-password` PAM service:

```sql
CREATE USER 'testuser'@'localhost'
  IDENTIFIED WITH authentication_pam
  AS 'mysql-any-password';
```

The `mysql-any-password` service file causes any authentication attempt to return true, even for incorrect passwords. If an authentication attempt fails, that tells you the configuration problem is on the MySQL side. Otherwise, the problem is on the operating system/PAM side. To see what might be happening, check system log files such as `/var/log/secure`, `/var/log/audit.log`, `/var/log/syslog`, or `/var/log/messages`.

After determining what the problem is, remove the `mysql-any-password` PAM service file to disable any-password access.


#### 6.4.1.8 Windows Pluggable Authentication

Note

Windows pluggable authentication is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

MySQL Enterprise Edition for Windows supports an authentication method that performs external authentication on Windows, enabling MySQL Server to use native Windows services to authenticate client connections. Users who have logged in to Windows can connect from MySQL client programs to the server based on the information in their environment without specifying an additional password.

The client and server exchange data packets in the authentication handshake. As a result of this exchange, the server creates a security context object that represents the identity of the client in the Windows OS. This identity includes the name of the client account. Windows pluggable authentication uses the identity of the client to check whether it is a given account or a member of a group. By default, negotiation uses Kerberos to authenticate, then NTLM if Kerberos is unavailable.

Windows pluggable authentication provides these capabilities:

* External authentication: Windows authentication enables MySQL Server to accept connections from users defined outside the MySQL grant tables who have logged in to Windows.

* Proxy user support: Windows authentication can return to MySQL a user name different from the external user name passed by the client program. This means that the plugin can return the MySQL user that defines the privileges the external Windows-authenticated user should have. For example, a Windows user named `joe` can connect and have the privileges of a MySQL user named `developer`.

The following table shows the plugin and library file names. The file must be located in the directory named by the `plugin_dir` system variable.

**Table 6.14 Plugin and Library Names for Windows Authentication**

<table summary="Names for the plugins and library file used for Windows password authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>authentication_windows</code></td> </tr><tr> <td>Client-side plugin</td> <td><code>authentication_windows_client</code></td> </tr><tr> <td>Library file</td> <td><code>authentication_windows.dll</code></td> </tr></tbody></table>

The library file includes only the server-side plugin. The client-side plugin is built into the `libmysqlclient` client library.

The server-side Windows authentication plugin is included only in MySQL Enterprise Edition. It is not included in MySQL community distributions. The client-side plugin is included in all distributions, including community distributions. This enables clients from any distribution to connect to a server that has the server-side plugin loaded.

The following sections provide installation and usage information specific to Windows pluggable authentication:

* Installing Windows Pluggable Authentication
* Uninstalling Windows Pluggable Authentication
* Using Windows Pluggable Authentication

For general information about pluggable authentication in MySQL, see Section 6.2.13, “Pluggable Authentication”. For proxy user information, see Section 6.2.14, “Proxy Users”.

##### Installing Windows Pluggable Authentication

This section describes how to install the server-side Windows authentication plugin. For general information about installing plugins, see Section 5.5.1, “Installing and Uninstalling Plugins”.

To be usable by the server, the plugin library file must be located in the MySQL plugin directory (the directory named by the `plugin_dir` system variable). If necessary, configure the plugin directory location by setting the value of `plugin_dir` at server startup.

To load the plugin at server startup, use the `--plugin-load-add` option to name the library file that contains it. With this plugin-loading method, the option must be given each time the server starts. For example, put these lines in the server `my.cnf` file:

```sql
[mysqld]
plugin-load-add=authentication_windows.dll
```

After modifying `my.cnf`, restart the server to cause the new settings to take effect.

Alternatively, to load the plugin at runtime, use this statement:

```sql
INSTALL PLUGIN authentication_windows SONAME 'authentication_windows.dll';
```

`INSTALL PLUGIN` loads the plugin immediately, and also registers it in the `mysql.plugins` system table to cause the server to load it for each subsequent normal startup without the need for `--plugin-load-add`.

To verify plugin installation, examine the Information Schema `PLUGINS` table or use the `SHOW PLUGINS` statement (see Section 5.5.2, “Obtaining Server Plugin Information”). For example:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%windows%';
+------------------------+---------------+
| PLUGIN_NAME            | PLUGIN_STATUS |
+------------------------+---------------+
| authentication_windows | ACTIVE        |
+------------------------+---------------+
```

If the plugin fails to initialize, check the server error log for diagnostic messages.

To associate MySQL accounts with the Windows authentication plugin, see Using Windows Pluggable Authentication. Additional plugin control is provided by the `authentication_windows_use_principal_name` and `authentication_windows_log_level` system variables. See Section 5.1.7, “Server System Variables”.

##### Uninstalling Windows Pluggable Authentication

The method used to uninstall the Windows authentication plugin depends on how you installed it:

* If you installed the plugin at server startup using a `--plugin-load-add` option, restart the server without the option.

* If you installed the plugin at runtime using an `INSTALL PLUGIN` statement, it remains installed across server restarts. To uninstall it, use `UNINSTALL PLUGIN`:

  ```sql
  UNINSTALL PLUGIN authentication_windows;
  ```

In addition, remove any startup options that set Windows plugin-related system variables.

##### Using Windows Pluggable Authentication

The Windows authentication plugin supports the use of MySQL accounts such that users who have logged in to Windows can connect to the MySQL server without having to specify an additional password. It is assumed that the server is running with the server-side plugin enabled, as described in Installing Windows Pluggable Authentication. Once the DBA has enabled the server-side plugin and set up accounts to use it, clients can connect using those accounts with no other setup required on their part.

To refer to the Windows authentication plugin in the `IDENTIFIED WITH` clause of a `CREATE USER` statement, use the name `authentication_windows`. Suppose that the Windows users `Rafal` and `Tasha` should be permitted to connect to MySQL, as well as any users in the `Administrators` or `Power Users` group. To set this up, create a MySQL account named `sql_admin` that uses the Windows plugin for authentication:

```sql
CREATE USER sql_admin
  IDENTIFIED WITH authentication_windows
  AS 'Rafal, Tasha, Administrators, "Power Users"';
```

The plugin name is `authentication_windows`. The string following the `AS` keyword is the authentication string. It specifies that the Windows users named `Rafal` or `Tasha` are permitted to authenticate to the server as the MySQL user `sql_admin`, as are any Windows users in the `Administrators` or `Power Users` group. The latter group name contains a space, so it must be quoted with double quote characters.

After you create the `sql_admin` account, a user who has logged in to Windows can attempt to connect to the server using that account:

```sql
C:\> mysql --user=sql_admin
```

No password is required here. The `authentication_windows` plugin uses the Windows security API to check which Windows user is connecting. If that user is named `Rafal` or `Tasha`, or is a member of the `Administrators` or `Power Users` group, the server grants access and the client is authenticated as `sql_admin` and has whatever privileges are granted to the `sql_admin` account. Otherwise, the server denies access.

Authentication string syntax for the Windows authentication plugin follows these rules:

* The string consists of one or more user mappings separated by commas.

* Each user mapping associates a Windows user or group name with a MySQL user name:

  ```sql
  win_user_or_group_name=mysql_user_name
  win_user_or_group_name
  ```

  For the latter syntax, with no *`mysql_user_name`* value given, the implicit value is the MySQL user created by the `CREATE USER` statement. Thus, these statements are equivalent:

  ```sql
  CREATE USER sql_admin
    IDENTIFIED WITH authentication_windows
    AS 'Rafal, Tasha, Administrators, "Power Users"';

  CREATE USER sql_admin
    IDENTIFIED WITH authentication_windows
    AS 'Rafal=sql_admin, Tasha=sql_admin, Administrators=sql_admin,
        "Power Users"=sql_admin';
  ```

* Each backslash character (`\`) in a value must be doubled because backslash is the escape character in MySQL strings.

* Leading and trailing spaces not inside double quotation marks are ignored.

* Unquoted *`win_user_or_group_name`* and *`mysql_user_name`* values can contain anything except equal sign, comma, or space.

* If a *`win_user_or_group_name`* and or *`mysql_user_name`* value is quoted with double quotation marks, everything between the quotation marks is part of the value. This is necessary, for example, if the name contains space characters. All characters within double quotes are legal except double quotation mark and backslash. To include either character, escape it with a backslash.

* *`win_user_or_group_name`* values use conventional syntax for Windows principals, either local or in a domain. Examples (note the doubling of backslashes):

  ```sql
  domain\\user
  .\\user
  domain\\group
  .\\group
  BUILTIN\\WellKnownGroup
  ```

When invoked by the server to authenticate a client, the plugin scans the authentication string left to right for a user or group match to the Windows user. If there is a match, the plugin returns the corresponding *`mysql_user_name`* to the MySQL server. If there is no match, authentication fails.

A user name match takes preference over a group name match. Suppose that the Windows user named `win_user` is a member of `win_group` and the authentication string looks like this:

```sql
'win_group = sql_user1, win_user = sql_user2'
```

When `win_user` connects to the MySQL server, there is a match both to `win_group` and to `win_user`. The plugin authenticates the user as `sql_user2` because the more-specific user match takes precedence over the group match, even though the group is listed first in the authentication string.

Windows authentication always works for connections from the same computer on which the server is running. For cross-computer connections, both computers must be registered with Microsoft Active Directory. If they are in the same Windows domain, it is unnecessary to specify a domain name. It is also possible to permit connections from a different domain, as in this example:

```sql
CREATE USER sql_accounting
  IDENTIFIED WITH authentication_windows
  AS 'SomeDomain\\Accounting';
```

Here `SomeDomain` is the name of the other domain. The backslash character is doubled because it is the MySQL escape character within strings.

MySQL supports the concept of proxy users whereby a client can connect and authenticate to the MySQL server using one account but while connected has the privileges of another account (see Section 6.2.14, “Proxy Users”). Suppose that you want Windows users to connect using a single user name but be mapped based on their Windows user and group names onto specific MySQL accounts as follows:

* The `local_user` and `MyDomain\domain_user` local and domain Windows users should map to the `local_wlad` MySQL account.

* Users in the `MyDomain\Developers` domain group should map to the `local_dev` MySQL account.

* Local machine administrators should map to the `local_admin` MySQL account.

To set this up, create a proxy account for Windows users to connect to, and configure this account so that users and groups map to the appropriate MySQL accounts (`local_wlad`, `local_dev`, `local_admin`). In addition, grant the MySQL accounts the privileges appropriate to the operations they need to perform. The following instructions use `win_proxy` as the proxy account, and `local_wlad`, `local_dev`, and `local_admin` as the proxied accounts.

1. Create the proxy MySQL account:

   ```sql
   CREATE USER win_proxy
     IDENTIFIED WITH  authentication_windows
     AS 'local_user = local_wlad,
         MyDomain\\domain_user = local_wlad,
         MyDomain\\Developers = local_dev,
         BUILTIN\\Administrators = local_admin';
   ```

2. For proxying to work, the proxied accounts must exist, so create them:

   ```sql
   CREATE USER local_wlad
     IDENTIFIED WITH mysql_no_login;
   CREATE USER local_dev
     IDENTIFIED WITH mysql_no_login;
   CREATE USER local_admin
     IDENTIFIED WITH mysql_no_login;
   ```

   The proxied accounts use the `mysql_no_login` authentication plugin to prevent clients from using the accounts to log in directly to the MySQL server. Instead, it is expected that users who authenticate using Windows use the `win_proxy` proxy account. (This assumes that the plugin is installed. For instructions, see Section 6.4.1.10, “No-Login Pluggable Authentication”.) For alternative methods of protecting proxied accounts against direct use, see Preventing Direct Login to Proxied Accounts.

   You should also execute `GRANT` statements (not shown) that grant each proxied account the privileges required for MySQL access.

3. Grant to the proxy account the `PROXY` privilege for each proxied account:

   ```sql
   GRANT PROXY ON local_wlad TO win_proxy;
   GRANT PROXY ON local_dev TO win_proxy;
   GRANT PROXY ON local_admin TO win_proxy;
   ```

Now the Windows users `local_user` and `MyDomain\domain_user` can connect to the MySQL server as `win_proxy` and when authenticated have the privileges of the account given in the authentication string (in this case, `local_wlad`). A user in the `MyDomain\Developers` group who connects as `win_proxy` has the privileges of the `local_dev` account. A user in the `BUILTIN\Administrators` group has the privileges of the `local_admin` account.

To configure authentication so that all Windows users who do not have their own MySQL account go through a proxy account, substitute the default proxy account (`''@''`) for `win_proxy` in the preceding instructions. For information about default proxy accounts, see Section 6.2.14, “Proxy Users”.

Note

If your MySQL installation has anonymous users, they might conflict with the default proxy user. For more information about this issue, and ways of dealing with it, see Default Proxy User and Anonymous User Conflicts.

To use the Windows authentication plugin with Connector/NET connection strings in Connector/NET 8.0 and higher, see Connector/NET Authentication.


#### 6.4.1.9 LDAP Pluggable Authentication

Note

LDAP pluggable authentication is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

As of MySQL 5.7.19, MySQL Enterprise Edition supports an authentication method that enables MySQL Server to use LDAP (Lightweight Directory Access Protocol) to authenticate MySQL users by accessing directory services such as X.500. MySQL uses LDAP to fetch user, credential, and group information.

LDAP pluggable authentication provides these capabilities:

* External authentication: LDAP authentication enables MySQL Server to accept connections from users defined outside the MySQL grant tables in LDAP directories.

* Proxy user support: LDAP authentication can return to MySQL a user name different from the external user name passed by the client program, based on the LDAP groups the external user is a member of. This means that an LDAP plugin can return the MySQL user that defines the privileges the external LDAP-authenticated user should have. For example, an LDAP user named `joe` can connect and have the privileges of a MySQL user named `developer`, if the LDAP group for `joe` is `developer`.

* Security: Using TLS, connections to the LDAP server can be secure.

The following tables show the plugin and library file names for simple and SASL-based LDAP authentication. The file name suffix might differ on your system. The files must be located in the directory named by the `plugin_dir` system variable.

**Table 6.15 Plugin and Library Names for Simple LDAP Authentication**

<table summary="Names for the plugins and library file used for simple LDAP password authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin name</td> <td><code>authentication_ldap_simple</code></td> </tr><tr> <td>Client-side plugin name</td> <td><code>mysql_clear_password</code></td> </tr><tr> <td>Library file name</td> <td><code>authentication_ldap_simple.so</code></td> </tr></tbody></table>

**Table 6.16 Plugin and Library Names for SASL-Based LDAP Authentication**

<table summary="Names for the plugins and library file used for SASL-based LDAP password authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin name</td> <td><code>authentication_ldap_sasl</code></td> </tr><tr> <td>Client-side plugin name</td> <td><code>authentication_ldap_sasl_client</code></td> </tr><tr> <td>Library file names</td> <td><code>authentication_ldap_sasl.so</code>, <code>authentication_ldap_sasl_client.so</code></td> </tr></tbody></table>

The library files include only the `authentication_ldap_XXX` authentication plugins. The client-side `mysql_clear_password` plugin is built into the `libmysqlclient` client library.

Each server-side LDAP plugin works with a specific client-side plugin:

* The server-side `authentication_ldap_simple` plugin performs simple LDAP authentication. For connections by accounts that use this plugin, client programs use the client-side `mysql_clear_password` plugin, which sends the password to the server as cleartext. No password hashing or encryption is used, so a secure connection between the MySQL client and server is recommended to prevent password exposure.

* The server-side `authentication_ldap_sasl` plugin performs SASL-based LDAP authentication. For connections by accounts that use this plugin, client programs use the client-side `authentication_ldap_sasl_client` plugin. The client-side and server-side SASL LDAP plugins use SASL messages for secure transmission of credentials within the LDAP protocol, to avoid sending the cleartext password between the MySQL client and server.

The server-side LDAP authentication plugins are included only in MySQL Enterprise Edition. They are not included in MySQL community distributions. The client-side SASL LDAP plugin is included in all distributions, including community distributions, and, as mentioned previously, the client-side `mysql_clear_password` plugin is built into the `libmysqlclient` client library, which also is included in all distributions. This enables clients from any distribution to connect to a server that has the appropriate server-side plugin loaded.

The following sections provide installation and usage information specific to LDAP pluggable authentication:

* Prerequisites for LDAP Pluggable Authentication
* How LDAP Authentication of MySQL Users Works
* Installing LDAP Pluggable Authentication
* Uninstalling LDAP Pluggable Authentication
* LDAP Pluggable Authentication and ldap.conf
* Using LDAP Pluggable Authentication
* Simple LDAP Authentication (Without Proxying)")
* SASL-Based LDAP Authentication (Without Proxying)")
* LDAP Authentication with Proxying
* LDAP Authentication Group Preference and Mapping Specification
* LDAP Authentication User DN Suffixes
* LDAP Authentication Methods

For general information about pluggable authentication in MySQL, see Section 6.2.13, “Pluggable Authentication”. For information about the `mysql_clear_password` plugin, see Section 6.4.1.6, “Client-Side Cleartext Pluggable Authentication”. For proxy user information, see Section 6.2.14, “Proxy Users”.

Note

If your system supports PAM and permits LDAP as a PAM authentication method, another way to use LDAP for MySQL user authentication is to use the server-side `authentication_pam` plugin. See Section 6.4.1.7, “PAM Pluggable Authentication”.

##### Prerequisites for LDAP Pluggable Authentication

To use LDAP pluggable authentication for MySQL, these prerequisites must be satisfied:

* An LDAP server must be available for the LDAP authentication plugins to communicate with.

* LDAP users to be authenticated by MySQL must be present in the directory managed by the LDAP server.

* An LDAP client library must be available on systems where the server-side `authentication_ldap_sasl` or `authentication_ldap_simple` plugin is used. Currently, supported libraries are the Windows native LDAP library, or the OpenLDAP library on non-Windows systems.

* To use SASL-based LDAP authentication:

  + The LDAP server must be configured to communicate with a SASL server.

  + A SASL client library must be available on systems where the client-side `authentication_ldap_sasl_client` plugin is used. Currently, the only supported library is the Cyrus SASL library.

##### How LDAP Authentication of MySQL Users Works

This section provides a general overview of how MySQL and LDAP work together to authenticate MySQL users. For examples showing how to set up MySQL accounts to use specific LDAP authentication plugins, see Using LDAP Pluggable Authentication.

The client connects to the MySQL server, providing the MySQL client user name and the LDAP password:

* For simple LDAP authentication, the client-side and server-side plugins communicate the password as cleartext. A secure connection between the MySQL client and server is recommended to prevent password exposure.

* For SASL-based LDAP authentication, the client-side and server-side plugins avoid sending the cleartext password between the MySQL client and server. For example, the plugins might use SASL messages for secure transmission of credentials within the LDAP protocol.

If the client user name and host name match no MySQL account, the connection is rejected.

If there is a matching MySQL account, authentication against LDAP occurs. The LDAP server looks for an entry matching the user and authenticates the entry against the LDAP password:

* If the MySQL account names an LDAP user distinguished name (DN), LDAP authentication uses that value and the LDAP password provided by the client. (To associate an LDAP user DN with a MySQL account, include a `BY` clause that specifies an authentication string in the `CREATE USER` statement that creates the account.)

* If the MySQL account names no LDAP user DN, LDAP authentication uses the user name and LDAP password provided by the client. In this case, the authentication plugin first binds to the LDAP server using the root DN and password as credentials to find the user DN based on the client user name, then authenticates that user DN against the LDAP password. This bind using the root credentials fails if the root DN and password are set to incorrect values, or are empty (not set) and the LDAP server does not permit anonymous connections.

If the LDAP server finds no match or multiple matches, authentication fails and the client connection is rejected.

If the LDAP server finds a single match, LDAP authentication succeeds (assuming that the password is correct), the LDAP server returns the LDAP entry, and the authentication plugin determines the name of the authenticated user based on that entry:

* If the LDAP entry has a group attribute (by default, the `cn` attribute), the plugin returns its value as the authenticated user name.

* If the LDAP entry has no group attribute, the authentication plugin returns the client user name as the authenticated user name.

The MySQL server compares the client user name with the authenticated user name to determine whether proxying occurs for the client session:

* If the names are the same, no proxying occurs: The MySQL account matching the client user name is used for privilege checking.

* If the names differ, proxying occurs: MySQL looks for an account matching the authenticated user name. That account becomes the proxied user, which is used for privilege checking. The MySQL account that matched the client user name is treated as the external proxy user.

##### Installing LDAP Pluggable Authentication

This section describes how to install the server-side LDAP authentication plugins. For general information about installing plugins, see Section 5.5.1, “Installing and Uninstalling Plugins”.

To be usable by the server, the plugin library files must be located in the MySQL plugin directory (the directory named by the `plugin_dir` system variable). If necessary, configure the plugin directory location by setting the value of `plugin_dir` at server startup.

The server-side plugin library file base names are `authentication_ldap_simple` and `authentication_ldap_sasl`. The file name suffix differs per platform (for example, `.so` for Unix and Unix-like systems, `.dll` for Windows).

To load the plugins at server startup, use `--plugin-load-add` options to name the library files that contain them. With this plugin-loading method, the options must be given each time the server starts. Also, specify values for any plugin-provided system variables you wish to configure.

Each server-side LDAP plugin exposes a set of system variables that enable its operation to be configured. Setting most of these is optional, but you must set the variables that specify the LDAP server host (so the plugin knows where to connect) and base distinguished name for LDAP bind operations (to limit the scope of searches and obtain faster searches). For details about all LDAP system variables, see Section 6.4.1.13, “Pluggable Authentication System Variables”.

To load the plugins and set the LDAP server host and base distinguished name for LDAP bind operations, put lines such as these in your `my.cnf` file, adjusting the `.so` suffix for your platform as necessary:

```sql
[mysqld]
plugin-load-add=authentication_ldap_simple.so
authentication_ldap_simple_server_host=127.0.0.1
authentication_ldap_simple_bind_base_dn="dc=example,dc=com"
plugin-load-add=authentication_ldap_sasl.so
authentication_ldap_sasl_server_host=127.0.0.1
authentication_ldap_sasl_bind_base_dn="dc=example,dc=com"
```

After modifying `my.cnf`, restart the server to cause the new settings to take effect.

Alternatively, to load the plugins at runtime, use these statements, adjusting the `.so` suffix for your platform as necessary:

```sql
INSTALL PLUGIN authentication_ldap_simple
  SONAME 'authentication_ldap_simple.so';
INSTALL PLUGIN authentication_ldap_sasl
  SONAME 'authentication_ldap_sasl.so';
```

`INSTALL PLUGIN` loads the plugin immediately, and also registers it in the `mysql.plugins` system table to cause the server to load it for each subsequent normal startup without the need for `--plugin-load-add`.

After installing the plugins at runtime, their system variables become available and you can add settings for them to your `my.cnf` file to configure the plugins for subsequent restarts. For example:

```sql
[mysqld]
authentication_ldap_simple_server_host=127.0.0.1
authentication_ldap_simple_bind_base_dn="dc=example,dc=com"
authentication_ldap_sasl_server_host=127.0.0.1
authentication_ldap_sasl_bind_base_dn="dc=example,dc=com"
```

After modifying `my.cnf`, restart the server to cause the new settings to take effect.

To verify plugin installation, examine the Information Schema `PLUGINS` table or use the `SHOW PLUGINS` statement (see Section 5.5.2, “Obtaining Server Plugin Information”). For example:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%ldap%';
+----------------------------+---------------+
| PLUGIN_NAME                | PLUGIN_STATUS |
+----------------------------+---------------+
| authentication_ldap_sasl   | ACTIVE        |
| authentication_ldap_simple | ACTIVE        |
+----------------------------+---------------+
```

If a plugin fails to initialize, check the server error log for diagnostic messages.

To associate MySQL accounts with an LDAP plugin, see Using LDAP Pluggable Authentication.

Additional Notes for SELinux

On systems running EL6 or EL that have SELinux enabled, changes to the SELinux policy are required to enable the MySQL LDAP plugins to communicate with the LDAP service:

1. Create a file `mysqlldap.te` with these contents:

   ```sql
   module mysqlldap 1.0;

   require {
           type ldap_port_t;
           type mysqld_t;
           class tcp_socket name_connect;
   }

   #============= mysqld_t ==============

   allow mysqld_t ldap_port_t:tcp_socket name_connect;
   ```

2. Compile the security policy module into a binary representation:

   ```sql
   checkmodule -M -m mysqlldap.te -o mysqlldap.mod
   ```

3. Create an SELinux policy module package:

   ```sql
   semodule_package -m mysqlldap.mod  -o mysqlldap.pp
   ```

4. Install the module package:

   ```sql
   semodule -i mysqlldap.pp
   ```

5. When the SELinux policy changes have been made, restart the MySQL server:

   ```sql
   service mysqld restart
   ```

##### Uninstalling LDAP Pluggable Authentication

The method used to uninstall the LDAP authentication plugins depends on how you installed them:

* If you installed the plugins at server startup using `--plugin-load-add` options, restart the server without those options.

* If you installed the plugins at runtime using `INSTALL PLUGIN`, they remain installed across server restarts. To uninstall them, use `UNINSTALL PLUGIN`:

  ```sql
  UNINSTALL PLUGIN authentication_ldap_simple;
  UNINSTALL PLUGIN authentication_ldap_sasl;
  ```

In addition, remove from your `my.cnf` file any startup options that set LDAP plugin-related system variables.

##### LDAP Pluggable Authentication and ldap.conf

For installations that use OpenLDAP, the `ldap.conf` file provides global defaults for LDAP clients. Options can be set in this file to affect LDAP clients, including the LDAP authentication plugins. OpenLDAP uses configuration options in this order of precedence:

* Configuration specified by the LDAP client.
* Configuration specified in the `ldap.conf` file. To disable use of this file, set the `LDAPNOINIT` environment variable.

* OpenLDAP library built-in defaults.

If the library defaults or `ldap.conf` values do not yield appropriate option values, an LDAP authentication plugin may be able to set related variables to affect the LDAP configuration directly. For example, LDAP plugins can override `ldap.conf` parameters for TLS configuration: System variables are available to enable TLS and control CA configuration, such as `authentication_ldap_simple_tls` and `authentication_ldap_simple_ca_path` for simple LDAP authentication, and `authentication_ldap_sasl_tls` and `authentication_ldap_sasl_ca_path` for SASL LDAP authentication.

For more information about `ldap.conf` consult the `ldap.conf(5)` man page.

##### Using LDAP Pluggable Authentication

This section describes how to enable MySQL accounts to connect to the MySQL server using LDAP pluggable authentication. It is assumed that the server is running with the appropriate server-side plugins enabled, as described in Installing LDAP Pluggable Authentication, and that the appropriate client-side plugins are available on the client host.

This section does not describe LDAP configuration or administration. You are assumed to be familiar with those topics.

The two server-side LDAP plugins each work with a specific client-side plugin:

* The server-side `authentication_ldap_simple` plugin performs simple LDAP authentication. For connections by accounts that use this plugin, client programs use the client-side `mysql_clear_password` plugin, which sends the password to the server as cleartext. No password hashing or encryption is used, so a secure connection between the MySQL client and server is recommended to prevent password exposure.

* The server-side `authentication_ldap_sasl` plugin performs SASL-based LDAP authentication. For connections by accounts that use this plugin, client programs use the client-side `authentication_ldap_sasl_client` plugin. The client-side and server-side SASL LDAP plugins use SASL messages for secure transmission of credentials within the LDAP protocol, to avoid sending the cleartext password between the MySQL client and server.

Overall requirements for LDAP authentication of MySQL users:

* There must be an LDAP directory entry for each user to be authenticated.

* There must be a MySQL user account that specifies a server-side LDAP authentication plugin and optionally names the associated LDAP user distinguished name (DN). (To associate an LDAP user DN with a MySQL account, include a `BY` clause in the `CREATE USER` statement that creates the account.) If an account names no LDAP string, LDAP authentication uses the user name specified by the client to find the LDAP entry.

* Client programs connect using the connection method appropriate for the server-side authentication plugin the MySQL account uses. For LDAP authentication, connections require the MySQL user name and LDAP password. In addition, for accounts that use the server-side `authentication_ldap_simple` plugin, invoke client programs with the `--enable-cleartext-plugin` option to enable the client-side `mysql_clear_password` plugin.

The instructions here assume the following scenario:

* MySQL users `betsy` and `boris` authenticate to the LDAP entries for `betsy_ldap` and `boris_ldap`, respectively. (It is not necessary that the MySQL and LDAP user names differ. The use of different names in this discussion helps clarify whether an operation context is MySQL or LDAP.)

* LDAP entries use the `uid` attribute to specify user names. This may vary depending on LDAP server. Some LDAP servers use the `cn` attribute for user names rather than `uid`. To change the attribute, modify the `authentication_ldap_simple_user_search_attr` or `authentication_ldap_sasl_user_search_attr` system variable appropriately.

* These LDAP entries are available in the directory managed by the LDAP server, to provide distinguished name values that uniquely identify each user:

  ```sql
  uid=betsy_ldap,ou=People,dc=example,dc=com
  uid=boris_ldap,ou=People,dc=example,dc=com
  ```

* `CREATE USER` statements that create MySQL accounts name an LDAP user in the `BY` clause, to indicate which LDAP entry the MySQL account authenticates against.

The instructions for setting up an account that uses LDAP authentication depend on which server-side LDAP plugin is used. The following sections describe several usage scenarios.

##### Simple LDAP Authentication (Without Proxying)

The procedure outlined in this section requires that `authentication_ldap_simple_group_search_attr` be set to an empty string, like this:

```sql
SET GLOBAL.authentication_ldap_simple_group_search_attr='';
```

Otherwise, proxying is used by default.

To set up a MySQL account for simple LDAP authentication, use a `CREATE USER` statement to specify the `authentication_ldap_simple` plugin, optionally including the LDAP user distinguished name (DN), as shown here:

```sql
CREATE USER user
  IDENTIFIED WITH authentication_ldap_simple
  [BY 'LDAP user DN'];
```

Suppose that MySQL user `betsy` has this entry in the LDAP directory:

```sql
uid=betsy_ldap,ou=People,dc=example,dc=com
```

Then the statement to create the MySQL account for `betsy` looks like this:

```sql
CREATE USER 'betsy'@'localhost'
  IDENTIFIED WITH authentication_ldap_simple
  AS 'uid=betsy_ldap,ou=People,dc=example,dc=com';
```

The authentication string specified in the `BY` clause does not include the LDAP password. That must be provided by the client user at connect time.

Clients connect to the MySQL server by providing the MySQL user name and LDAP password, and by enabling the client-side `mysql_clear_password` plugin:

```sql
$> mysql --user=betsy --password --enable-cleartext-plugin
Enter password: betsy_ldap_password
```

Note

The client-side `mysql_clear_password` authentication plugin leaves the password untouched, so client programs send it to the MySQL server as cleartext. This enables the password to be passed as is to the LDAP server. A cleartext password is necessary to use the server-side LDAP library without SASL, but may be a security problem in some configurations. These measures minimize the risk:

* To make inadvertent use of the `mysql_clear_password` plugin less likely, MySQL clients must explicitly enable it (for example, with the `--enable-cleartext-plugin` option). See Section 6.4.1.6, “Client-Side Cleartext Pluggable Authentication”.

* To avoid password exposure with the `mysql_clear_password` plugin enabled, MySQL clients should connect to the MySQL server using an encrypted connection. See Section 6.3.1, “Configuring MySQL to Use Encrypted Connections”.

The authentication process occurs as follows:

1. The client-side plugin sends `betsy` and *`betsy_password`* as the client user name and LDAP password to the MySQL server.

2. The connection attempt matches the `'betsy'@'localhost'` account. The server-side LDAP plugin finds that this account has an authentication string of `'uid=betsy_ldap,ou=People,dc=example,dc=com'` to name the LDAP user DN. The plugin sends this string and the LDAP password to the LDAP server.

3. The LDAP server finds the LDAP entry for `betsy_ldap` and the password matches, so LDAP authentication succeeds.

4. The LDAP entry has no group attribute, so the server-side plugin returns the client user name (`betsy`) as the authenticated user. This is the same user name supplied by the client, so no proxying occurs and the client session uses the `'betsy'@'localhost'` account for privilege checking.

Had the `CREATE USER` statement contained no `BY` clause to specify the `betsy_ldap` LDAP distinguished name, authentication attempts would use the user name provided by the client (in this case, `betsy`). In the absence of an LDAP entry for `betsy`, authentication would fail.

##### SASL-Based LDAP Authentication (Without Proxying)

The procedure outlined in this section requires that `authentication_ldap_sasl_group_search_attr` be set to an empty string, like this:

```sql
SET GLOBAL.authentication_ldap_sasl_group_search_attr='';
```

Otherwise, proxying is used by default.

To set up a MySQL account for SALS LDAP authentication, use a `CREATE USER` statement to specify the `authentication_ldap_sasl` plugin, optionally including the LDAP user distinguished name (DN), as shown here:

```sql
CREATE USER user
  IDENTIFIED WITH authentication_ldap_sasl
  [BY 'LDAP user DN'];
```

Suppose that MySQL user `boris` has this entry in the LDAP directory:

```sql
uid=boris_ldap,ou=People,dc=example,dc=com
```

Then the statement to create the MySQL account for `boris` looks like this:

```sql
CREATE USER 'boris'@'localhost'
  IDENTIFIED WITH authentication_ldap_sasl
  AS 'uid=boris_ldap,ou=People,dc=example,dc=com';
```

The authentication string specified in the `BY` clause does not include the LDAP password. That must be provided by the client user at connect time.

Clients connect to the MySQL server by providing the MySQL user name and LDAP password:

```sql
$> mysql --user=boris --password
Enter password: boris_ldap_password
```

For the server-side `authentication_ldap_sasl` plugin, clients use the client-side `authentication_ldap_sasl_client` plugin. If a client program does not find the client-side plugin, specify a `--plugin-dir` option that names the directory where the plugin library file is installed.

The authentication process for `boris` is similar to that previously described for `betsy` with simple LDAP authentication, except that the client-side and server-side SASL LDAP plugins use SASL messages for secure transmission of credentials within the LDAP protocol, to avoid sending the cleartext password between the MySQL client and server.

##### LDAP Authentication with Proxying

LDAP authentication plugins support proxying, enabling a user to connect to the MySQL server as one user but assume the privileges of a different user. This section describes basic LDAP plugin proxy support. The LDAP plugins also support specification of group preference and proxy user mapping; see LDAP Authentication Group Preference and Mapping Specification.

The proxying implementation described here is based on use of LDAP group attribute values to map connecting MySQL users who authenticate using LDAP onto other MySQL accounts that define different sets of privileges. Users do not connect directly through the accounts that define the privileges. Instead, they connect through a default proxy account authenticated with LDAP, such that all external logins are mapped to the proxied MySQL accounts that hold the privileges. Any user who connects using the proxy account is mapped to one of those proxied MySQL accounts, the privileges for which determine the database operations permitted to the external user.

The instructions here assume the following scenario:

* LDAP entries use the `uid` and `cn` attributes to specify user name and group values, respectively. To use different user and group attribute names, set the appropriate plugin-specific system variables:

  + For the `authentication_ldap_simple` plugin: Set `authentication_ldap_simple_user_search_attr` and `authentication_ldap_simple_group_search_attr`.

  + For the `authentication_ldap_sasl` plugin: Set `authentication_ldap_sasl_user_search_attr` and `authentication_ldap_sasl_group_search_attr`.

* These LDAP entries are available in the directory managed by the LDAP server, to provide distinguished name values that uniquely identify each user:

  ```sql
  uid=basha,ou=People,dc=example,dc=com,cn=accounting
  uid=basil,ou=People,dc=example,dc=com,cn=front_office
  ```

  At connect time, the group attribute values become the authenticated user names, so they name the `accounting` and `front_office` proxied accounts.

* The examples assume use of SASL LDAP authentication. Make the appropriate adjustments for simple LDAP authentication.

Create the default proxy MySQL account:

```sql
CREATE USER ''@'%'
  IDENTIFIED WITH authentication_ldap_sasl;
```

The proxy account definition has no `AS 'auth_string'` clause to name an LDAP user DN. Thus:

* When a client connects, the client user name becomes the LDAP user name to search for.

* The matching LDAP entry is expected to include a group attribute naming the proxied MySQL account that defines the privileges the client should have.

Note

If your MySQL installation has anonymous users, they might conflict with the default proxy user. For more information about this issue, and ways of dealing with it, see Default Proxy User and Anonymous User Conflicts.

Create the proxied accounts and grant to each one the privileges it should have:

```sql
CREATE USER 'accounting'@'localhost'
  IDENTIFIED WITH mysql_no_login;
CREATE USER 'front_office'@'localhost'
  IDENTIFIED WITH mysql_no_login;

GRANT ALL PRIVILEGES
  ON accountingdb.*
  TO 'accounting'@'localhost';
GRANT ALL PRIVILEGES
  ON frontdb.*
  TO 'front_office'@'localhost';
```

The proxied accounts use the `mysql_no_login` authentication plugin to prevent clients from using the accounts to log in directly to the MySQL server. Instead, users who authenticate using LDAP are expected to use the default `''@'%'` proxy account. (This assumes that the `mysql_no_login` plugin is installed. For instructions, see Section 6.4.1.10, “No-Login Pluggable Authentication”.) For alternative methods of protecting proxied accounts against direct use, see Preventing Direct Login to Proxied Accounts.

Grant to the proxy account the `PROXY` privilege for each proxied account:

```sql
GRANT PROXY
  ON 'accounting'@'localhost'
  TO ''@'%';
GRANT PROXY
  ON 'front_office'@'localhost'
  TO ''@'%';
```

Use the **mysql** command-line client to connect to the MySQL server as `basha`.

```sql
$> mysql --user=basha --password
Enter password: basha_password (basha LDAP password)
```

Authentication occurs as follows:

1. The server authenticates the connection using the default `''@'%'` proxy account, for client user `basha`.

2. The matching LDAP entry is:

   ```sql
   uid=basha,ou=People,dc=example,dc=com,cn=accounting
   ```

3. The matching LDAP entry has group attribute `cn=accounting`, so `accounting` becomes the authenticated proxied user.

4. The authenticated user differs from the client user name `basha`, with the result that `basha` is treated as a proxy for `accounting`, and `basha` assumes the privileges of the proxied `accounting` account. The following query returns output as shown:

   ```sql
   mysql> SELECT USER(), CURRENT_USER(), @@proxy_user;
   +-----------------+----------------------+--------------+
   | USER()          | CURRENT_USER()       | @@proxy_user |
   +-----------------+----------------------+--------------+
   | basha@localhost | accounting@localhost | ''@'%'       |
   +-----------------+----------------------+--------------+
   ```

This demonstrates that `basha` uses the privileges granted to the proxied `accounting` MySQL account, and that proxying occurs through the default proxy user account.

Now connect as `basil` instead:

```sql
$> mysql --user=basil --password
Enter password: basil_password (basil LDAP password)
```

The authentication process for `basil` is similar to that previously described for `basha`:

1. The server authenticates the connection using the default `''@'%'` proxy account, for client user `basil`.

2. The matching LDAP entry is:

   ```sql
   uid=basil,ou=People,dc=example,dc=com,cn=front_office
   ```

3. The matching LDAP entry has group attribute `cn=front_office`, so `front_office` becomes the authenticated proxied user.

4. The authenticated user differs from the client user name `basil`, with the result that `basil` is treated as a proxy for `front_office`, and `basil` assumes the privileges of the proxied `front_office` account. The following query returns output as shown:

   ```sql
   mysql> SELECT USER(), CURRENT_USER(), @@proxy_user;
   +-----------------+------------------------+--------------+
   | USER()          | CURRENT_USER()         | @@proxy_user |
   +-----------------+------------------------+--------------+
   | basil@localhost | front_office@localhost | ''@'%'       |
   +-----------------+------------------------+--------------+
   ```

This demonstrates that `basil` uses the privileges granted to the proxied `front_office` MySQL account, and that proxying occurs through the default proxy user account.

##### LDAP Authentication Group Preference and Mapping Specification

As described in LDAP Authentication with Proxying, basic LDAP authentication proxying works by the principle that the plugin uses the first group name returned by the LDAP server as the MySQL proxied user account name. This simple capability does not enable specifying any preference about which group name to use if the LDAP server returns multiple group names, or specifying any name other than the group name as the proxied user name.

As of MySQL 5.7.25, for MySQL accounts that use LDAP authentication, the authentication string can specify the following information to enable greater proxying flexibility:

* A list of groups in preference order, such that the plugin uses the first group name in the list that matches a group returned by the LDAP server.

* A mapping from group names to proxied user names, such that a group name when matched can provide a specified name to use as the proxied user. This provides an alternative to using the group name as the proxied user.

Consider the following MySQL proxy account definition:

```sql
CREATE USER ''@'%'
  IDENTIFIED WITH authentication_ldap_sasl
  AS '+ou=People,dc=example,dc=com#grp1=usera,grp2,grp3=userc';
```

The authentication string has a user DN suffix `ou=People,dc=example,dc=com` prefixed by the `+` character. Thus, as described in LDAP Authentication User DN Suffixes, the full user DN is constructed from the user DN suffix as specified, plus the client user name as the `uid` attribute.

The remaining part of the authentication string begins with `#`, which signifies the beginning of group preference and mapping information. This part of the authentication string lists group names in the order `grp1`, `grp2`, `grp3`. The LDAP plugin compares that list with the set of group names returned by the LDAP server, looking in list order for a match against the returned names. The plugin uses the first match, or if there is no match, authentication fails.

Suppose that the LDAP server returns groups `grp3`, `grp2`, and `grp7`. The LDAP plugin uses `grp2` because it is the first group in the authentication string that matches, even though it is not the first group returned by the LDAP server. If the LDAP server returns `grp4`, `grp2`, and `grp1`, the plugin uses `grp1` even though `grp2` also matches. `grp1` has a precedence higher than `grp2` because it is listed earlier in the authentication string.

Assuming that the plugin finds a group name match, it performs mapping from that group name to the MySQL proxied user name, if there is one. For the example proxy account, mapping occurs as follows:

* If the matching group name is `grp1` or `grp3`, those are associated in the authentication string with user names `usera` and `userc`, respectively. The plugin uses the corresponding associated user name as the proxied user name.

* If the matching group name is `grp2`, there is no associated user name in the authentication string. The plugin uses `grp2` as the proxied user name.

If the LDAP server returns a group in DN format, the LDAP plugin parses the group DN to extract the group name from it.

To specify LDAP group preference and mapping information, these principles apply:

* Begin the group preference and mapping part of the authentication string with a `#` prefix character.

* The group preference and mapping specification is a list of one or more items, separated by commas. Each item has the form `group_name=user_name` or *`group_name`*. Items should be listed in group name preference order. For a group name selected by the plugin as a match from set of group names returned by the LDAP server, the two syntaxes differ in effect as follows:

  + For an item specified as `group_name=user_name` (with a user name), the group name maps to the user name, which is used as the MySQL proxied user name.

  + For an item specified as *`group_name`* (with no user name), the group name is used as the MySQL proxied user name.

* To quote a group or user name that contains special characters such as space, surround it by double quote (`"`) characters. For example, if an item has group and user names of `my group name` and `my user name`, it must be written in a group mapping using quotes:

  ```sql
  "my group name"="my user name"
  ```

  If an item has group and user names of `my_group_name` and `my_user_name` (which contain no special characters), it may but need not be written using quotes. Any of the following are valid:

  ```sql
  my_group_name=my_user_name
  my_group_name="my_user_name"
  "my_group_name"=my_user_name
  "my_group_name"="my_user_name"
  ```

* To escape a character, precede it by a backslash (`\`). This is useful particularly to include a literal double quote or backslash, which are otherwise not included literally.

* A user DN need not be present in the authentication string, but if present, it must precede the group preference and mapping part. A user DN can be given as a full user DN, or as a user DN suffix with a `+` prefix character. (See LDAP Authentication User DN Suffixes.)

##### LDAP Authentication User DN Suffixes

As of MySQL 5.7.21, LDAP authentication plugins permit the authentication string that provides user DN information to begin with a `+` prefix character:

* In the absence of a `+` character, the authentication string value is treated as is without modification.

* If the authentication string begins with `+`, the plugin constructs the full user DN value from the user name sent by the client, together with the DN specified in the authentication string (with the `+` removed). In the constructed DN, the client user name becomes the value of the attribute that specifies LDAP user names. This is `uid` by default; to change the attribute, modify the appropriate system variable (`authentication_ldap_simple_user_search_attr` or `authentication_ldap_sasl_user_search_attr`). The authentication string is stored as given in the `mysql.user` system table, with the full user DN constructed on the fly before authentication.

This account authentication string does not have `+` at the beginning, so it is taken as the full user DN:

```sql
CREATE USER 'baldwin'
  IDENTIFIED WITH authentication_ldap_simple
  AS 'uid=admin,ou=People,dc=example,dc=com';
```

The client connects with the user name specified in the account (`baldwin`). In this case, that name is not used because the authentication string has no prefix and thus fully specifies the user DN.

This account authentication string does have `+` at the beginning, so it is taken as just part of the user DN:

```sql
CREATE USER 'accounting'
  IDENTIFIED WITH authentication_ldap_simple
  AS '+ou=People,dc=example,dc=com';
```

The client connects with the user name specified in the account (`accounting`), which in this case is used as the `uid` attribute together with the authentication string to construct the user DN: `uid=accounting,ou=People,dc=example,dc=com`

The accounts in the preceding examples have a nonempty user name, so the client always connects to the MySQL server using the same name as specified in the account definition. If an account has an empty user name, such as the default anonymous `''@'%'` proxy account described in LDAP Authentication with Proxying, clients might connect to the MySQL server with varying user names. But the principle is the same: If the authentication string begins with `+`, the plugin uses the user name sent by the client together with the authentication string to construct the user DN.

##### LDAP Authentication Methods

The LDAP authentication plugins use a configurable authentication method. The appropriate system variable and available method choices are plugin-specific:

* For the `authentication_ldap_simple` plugin: Configure the method by setting the `authentication_ldap_simple_auth_method_name` system variable. The permitted choices are `SIMPLE` and `AD-FOREST`.

* For the `authentication_ldap_sasl` plugin: Configure the method by setting the `authentication_ldap_sasl_auth_method_name` system variable. The only permitted choice is `SCRAM-SHA-1`.

See the system variable descriptions for information about each permitted method.


#### 6.4.1.10 No-Login Pluggable Authentication

The `mysql_no_login` server-side authentication plugin prevents all client connections to any account that uses it. Use cases for this plugin include:

* Accounts that must be able to execute stored programs and views with elevated privileges without exposing those privileges to ordinary users.

* Proxied accounts that should never permit direct login but are intended to be accessed only through proxy accounts.

The following table shows the plugin and library file names. The file name suffix might differ on your system. The file must be located in the directory named by the `plugin_dir` system variable.

**Table 6.17 Plugin and Library Names for No-Login Authentication**

<table summary="Names for the plugins and library file used for no-login password authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>mysql_no_login</code></td> </tr><tr> <td>Client-side plugin</td> <td>None</td> </tr><tr> <td>Library file</td> <td><code>mysql_no_login.so</code></td> </tr></tbody></table>

The following sections provide installation and usage information specific to no-login pluggable authentication:

* Installing No-Login Pluggable Authentication
* Uninstalling No-Login Pluggable Authentication
* Using No-Login Pluggable Authentication

For general information about pluggable authentication in MySQL, see Section 6.2.13, “Pluggable Authentication”. For proxy user information, see Section 6.2.14, “Proxy Users”.

##### Installing No-Login Pluggable Authentication

This section describes how to install the no-login authentication plugin. For general information about installing plugins, see Section 5.5.1, “Installing and Uninstalling Plugins”.

To be usable by the server, the plugin library file must be located in the MySQL plugin directory (the directory named by the `plugin_dir` system variable). If necessary, configure the plugin directory location by setting the value of `plugin_dir` at server startup.

The plugin library file base name is `mysql_no_login`. The file name suffix differs per platform (for example, `.so` for Unix and Unix-like systems, `.dll` for Windows).

To load the plugin at server startup, use the `--plugin-load-add` option to name the library file that contains it. With this plugin-loading method, the option must be given each time the server starts. For example, put these lines in the server `my.cnf` file, adjusting the `.so` suffix for your platform as necessary:

```sql
[mysqld]
plugin-load-add=mysql_no_login.so
```

After modifying `my.cnf`, restart the server to cause the new settings to take effect.

Alternatively, to load the plugin at runtime, use this statement, adjusting the `.so` suffix for your platform as necessary:

```sql
INSTALL PLUGIN mysql_no_login SONAME 'mysql_no_login.so';
```

`INSTALL PLUGIN` loads the plugin immediately, and also registers it in the `mysql.plugins` system table to cause the server to load it for each subsequent normal startup without the need for `--plugin-load-add`.

To verify plugin installation, examine the Information Schema `PLUGINS` table or use the `SHOW PLUGINS` statement (see Section 5.5.2, “Obtaining Server Plugin Information”). For example:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%login%';
+----------------+---------------+
| PLUGIN_NAME    | PLUGIN_STATUS |
+----------------+---------------+
| mysql_no_login | ACTIVE        |
+----------------+---------------+
```

If the plugin fails to initialize, check the server error log for diagnostic messages.

To associate MySQL accounts with the no-login plugin, see Using No-Login Pluggable Authentication.

##### Uninstalling No-Login Pluggable Authentication

The method used to uninstall the no-login authentication plugin depends on how you installed it:

* If you installed the plugin at server startup using a `--plugin-load-add` option, restart the server without the option.

* If you installed the plugin at runtime using an `INSTALL PLUGIN` statement, it remains installed across server restarts. To uninstall it, use `UNINSTALL PLUGIN`:

  ```sql
  UNINSTALL PLUGIN mysql_no_login;
  ```

##### Using No-Login Pluggable Authentication

This section describes how to use the no-login authentication plugin to prevent accounts from being used for connecting from MySQL client programs to the server. It is assumed that the server is running with the no-login plugin enabled, as described in Installing No-Login Pluggable Authentication.

To refer to the no-login authentication plugin in the `IDENTIFIED WITH` clause of a `CREATE USER` statement, use the name `mysql_no_login`.

An account that authenticates using `mysql_no_login` may be used as the `DEFINER` for stored program and view objects. If such an object definition also includes `SQL SECURITY DEFINER`, it executes with that account's privileges. DBAs can use this behavior to provide access to confidential or sensitive data that is exposed only through well-controlled interfaces.

The following example illustrates these principles. It defines an account that does not permit client connections, and associates with it a view that exposes only certain columns of the `mysql.user` system table:

```sql
CREATE DATABASE nologindb;
CREATE USER 'nologin'@'localhost'
  IDENTIFIED WITH mysql_no_login;
GRANT ALL ON nologindb.*
  TO 'nologin'@'localhost';
GRANT SELECT ON mysql.user
  TO 'nologin'@'localhost';
CREATE DEFINER = 'nologin'@'localhost'
  SQL SECURITY DEFINER
  VIEW nologindb.myview
  AS SELECT User, Host FROM mysql.user;
```

To provide protected access to the view to an ordinary user, do this:

```sql
GRANT SELECT ON nologindb.myview
  TO 'ordinaryuser'@'localhost';
```

Now the ordinary user can use the view to access the limited information it presents:

```sql
SELECT * FROM nologindb.myview;
```

Attempts by the user to access columns other than those exposed by the view result in an error, as do attempts to select from the view by users not granted access to it.

Note

Because the `nologin` account cannot be used directly, the operations required to set up objects that it uses must be performed by `root` or similar account that has the privileges required to create the objects and set `DEFINER` values.

The `mysql_no_login` plugin is also useful in proxying scenarios. (For a discussion of concepts involved in proxying, see Section 6.2.14, “Proxy Users”.) An account that authenticates using `mysql_no_login` may be used as a proxied user for proxy accounts:

```sql
-- create proxied account
CREATE USER 'proxied_user'@'localhost'
  IDENTIFIED WITH mysql_no_login;
-- grant privileges to proxied account
GRANT ...
  ON ...
  TO 'proxied_user'@'localhost';
-- permit proxy_user to be a proxy account for proxied account
GRANT PROXY
  ON 'proxied_user'@'localhost'
  TO 'proxy_user'@'localhost';
```

This enables clients to access MySQL through the proxy account (`proxy_user`) but not to bypass the proxy mechanism by connecting directly as the proxied user (`proxied_user`). A client who connects using the `proxy_user` account has the privileges of the `proxied_user` account, but `proxied_user` itself cannot be used to connect.

For alternative methods of protecting proxied accounts against direct use, see Preventing Direct Login to Proxied Accounts.


#### 6.4.1.11 Socket Peer-Credential Pluggable Authentication

The server-side `auth_socket` authentication plugin authenticates clients that connect from the local host through the Unix socket file. The plugin uses the `SO_PEERCRED` socket option to obtain information about the user running the client program. Thus, the plugin can be used only on systems that support the `SO_PEERCRED` option, such as Linux.

The source code for this plugin can be examined as a relatively simple example demonstrating how to write a loadable authentication plugin.

The following table shows the plugin and library file names. The file must be located in the directory named by the `plugin_dir` system variable.

**Table 6.18 Plugin and Library Names for Socket Peer-Credential Authentication**

<table summary="Names for the plugins and library file used for socket peer-credential password authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>auth_socket</code></td> </tr><tr> <td>Client-side plugin</td> <td>None, see discussion</td> </tr><tr> <td>Library file</td> <td><code>auth_socket.so</code></td> </tr></tbody></table>

The following sections provide installation and usage information specific to socket pluggable authentication:

* Installing Socket Pluggable Authentication
* Uninstalling Socket Pluggable Authentication
* Using Socket Pluggable Authentication

For general information about pluggable authentication in MySQL, see Section 6.2.13, “Pluggable Authentication”.

##### Installing Socket Pluggable Authentication

This section describes how to install the socket authentication plugin. For general information about installing plugins, see Section 5.5.1, “Installing and Uninstalling Plugins”.

To be usable by the server, the plugin library file must be located in the MySQL plugin directory (the directory named by the `plugin_dir` system variable). If necessary, configure the plugin directory location by setting the value of `plugin_dir` at server startup.

To load the plugin at server startup, use the `--plugin-load-add` option to name the library file that contains it. With this plugin-loading method, the option must be given each time the server starts. For example, put these lines in the server `my.cnf` file:

```sql
[mysqld]
plugin-load-add=auth_socket.so
```

After modifying `my.cnf`, restart the server to cause the new settings to take effect.

Alternatively, to load the plugin at runtime, use this statement:

```sql
INSTALL PLUGIN auth_socket SONAME 'auth_socket.so';
```

`INSTALL PLUGIN` loads the plugin immediately, and also registers it in the `mysql.plugins` system table to cause the server to load it for each subsequent normal startup without the need for `--plugin-load-add`.

To verify plugin installation, examine the Information Schema `PLUGINS` table or use the `SHOW PLUGINS` statement (see Section 5.5.2, “Obtaining Server Plugin Information”). For example:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%socket%';
+-------------+---------------+
| PLUGIN_NAME | PLUGIN_STATUS |
+-------------+---------------+
| auth_socket | ACTIVE        |
+-------------+---------------+
```

If the plugin fails to initialize, check the server error log for diagnostic messages.

To associate MySQL accounts with the socket plugin, see Using Socket Pluggable Authentication.

##### Uninstalling Socket Pluggable Authentication

The method used to uninstall the socket authentication plugin depends on how you installed it:

* If you installed the plugin at server startup using a `--plugin-load-add` option, restart the server without the option.

* If you installed the plugin at runtime using an `INSTALL PLUGIN` statement, it remains installed across server restarts. To uninstall it, use `UNINSTALL PLUGIN`:

  ```sql
  UNINSTALL PLUGIN auth_socket;
  ```

##### Using Socket Pluggable Authentication

The socket plugin checks whether the socket user name (the operating system user name) matches the MySQL user name specified by the client program to the server. If the names do not match, the plugin checks whether the socket user name matches the name specified in the `authentication_string` column of the `mysql.user` system table row. If a match is found, the plugin permits the connection. The `authentication_string` value can be specified using an `IDENTIFIED ...AS` clause with `CREATE USER` or `ALTER USER`.

Suppose that a MySQL account is created for an operating system user named `valerie` who is to be authenticated by the `auth_socket` plugin for connections from the local host through the socket file:

```sql
CREATE USER 'valerie'@'localhost' IDENTIFIED WITH auth_socket;
```

If a user on the local host with a login name of `stefanie` invokes **mysql** with the option `--user=valerie` to connect through the socket file, the server uses `auth_socket` to authenticate the client. The plugin determines that the `--user` option value (`valerie`) differs from the client user's name (`stephanie`) and refuses the connection. If a user named `valerie` tries the same thing, the plugin finds that the user name and the MySQL user name are both `valerie` and permits the connection. However, the plugin refuses the connection even for `valerie` if the connection is made using a different protocol, such as TCP/IP.

To permit both the `valerie` and `stephanie` operating system users to access MySQL through socket file connections that use the account, this can be done two ways:

* Name both users at account-creation time, one following `CREATE USER`, and the other in the authentication string:

  ```sql
  CREATE USER 'valerie'@'localhost' IDENTIFIED WITH auth_socket AS 'stephanie';
  ```

* If you have already used `CREATE USER` to create the account for a single user, use `ALTER USER` to add the second user:

  ```sql
  CREATE USER 'valerie'@'localhost' IDENTIFIED WITH auth_socket;
  ALTER USER 'valerie'@'localhost' IDENTIFIED WITH auth_socket AS 'stephanie';
  ```

To access the account, both `valerie` and `stephanie` specify `--user=valerie` at connect time.


#### 6.4.1.12 Test Pluggable Authentication

MySQL includes a test plugin that checks account credentials and logs success or failure to the server error log. This is a loadable plugin (not built in) and must be installed prior to use.

The test plugin source code is separate from the server source, unlike the built-in native plugin, so it can be examined as a relatively simple example demonstrating how to write a loadable authentication plugin.

Note

This plugin is intended for testing and development purposes, and is not for use in production environments or on servers that are exposed to public networks.

The following table shows the plugin and library file names. The file name suffix might differ on your system. The file must be located in the directory named by the `plugin_dir` system variable.

**Table 6.19 Plugin and Library Names for Test Authentication**

<table summary="Names for the plugins and library file used for test password authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>test_plugin_server</code></td> </tr><tr> <td>Client-side plugin</td> <td><code>auth_test_plugin</code></td> </tr><tr> <td>Library file</td> <td><code>auth_test_plugin.so</code></td> </tr></tbody></table>

The following sections provide installation and usage information specific to test pluggable authentication:

* Installing Test Pluggable Authentication
* Uninstalling Test Pluggable Authentication
* Using Test Pluggable Authentication

For general information about pluggable authentication in MySQL, see Section 6.2.13, “Pluggable Authentication”.

##### Installing Test Pluggable Authentication

This section describes how to install the server-side test authentication plugin. For general information about installing plugins, see Section 5.5.1, “Installing and Uninstalling Plugins”.

To be usable by the server, the plugin library file must be located in the MySQL plugin directory (the directory named by the `plugin_dir` system variable). If necessary, configure the plugin directory location by setting the value of `plugin_dir` at server startup.

To load the plugin at server startup, use the `--plugin-load-add` option to name the library file that contains it. With this plugin-loading method, the option must be given each time the server starts. For example, put these lines in the server `my.cnf` file, adjusting the `.so` suffix for your platform as necessary:

```sql
[mysqld]
plugin-load-add=auth_test_plugin.so
```

After modifying `my.cnf`, restart the server to cause the new settings to take effect.

Alternatively, to load the plugin at runtime, use this statement, adjusting the `.so` suffix for your platform as necessary:

```sql
INSTALL PLUGIN test_plugin_server SONAME 'auth_test_plugin.so';
```

`INSTALL PLUGIN` loads the plugin immediately, and also registers it in the `mysql.plugins` system table to cause the server to load it for each subsequent normal startup without the need for `--plugin-load-add`.

To verify plugin installation, examine the Information Schema `PLUGINS` table or use the `SHOW PLUGINS` statement (see Section 5.5.2, “Obtaining Server Plugin Information”). For example:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%test_plugin%';
+--------------------+---------------+
| PLUGIN_NAME        | PLUGIN_STATUS |
+--------------------+---------------+
| test_plugin_server | ACTIVE        |
+--------------------+---------------+
```

If the plugin fails to initialize, check the server error log for diagnostic messages.

To associate MySQL accounts with the test plugin, see Using Test Pluggable Authentication.

##### Uninstalling Test Pluggable Authentication

The method used to uninstall the test authentication plugin depends on how you installed it:

* If you installed the plugin at server startup using a `--plugin-load-add` option, restart the server without the option.

* If you installed the plugin at runtime using an `INSTALL PLUGIN` statement, it remains installed across server restarts. To uninstall it, use `UNINSTALL PLUGIN`:

  ```sql
  UNINSTALL PLUGIN test_plugin_server;
  ```

##### Using Test Pluggable Authentication

To use the test authentication plugin, create an account and name that plugin in the `IDENTIFIED WITH` clause:

```sql
CREATE USER 'testuser'@'localhost'
IDENTIFIED WITH test_plugin_server
BY 'testpassword';
```

Then provide the `--user` and `--password` options for that account when you connect to the server. For example:

```sql
$> mysql --user=testuser --password
Enter password: testpassword
```

The plugin fetches the password as received from the client and compares it with the value stored in the `authentication_string` column of the account row in the `mysql.user` system table. If the two values match, the plugin returns the `authentication_string` value as the new effective user ID.

You can look in the server error log for a message indicating whether authentication succeeded (notice that the password is reported as the “user”):

```sql
[Note] Plugin test_plugin_server reported:
'successfully authenticated user testpassword'
```


#### 6.4.1.13 Pluggable Authentication System Variables

These variables are unavailable unless the appropriate server-side plugin is installed:

* `authentication_ldap_sasl` for system variables with names of the form `authentication_ldap_sasl_xxx`

* `authentication_ldap_simple` for system variables with names of the form `authentication_ldap_simple_xxx`

**Table 6.20 Authentication Plugin System Variable Summary**

<table frame="box" rules="all" summary="Reference for authentication plugin system variables.">
  <col style="width: 20%"/>
  <col style="width: 15%"/>
  <col style="width: 15%"/>
  <col style="width: 15%"/>
  <col style="width: 15%"/>
  <col style="width: 15%"/>
  <col style="width: 15%"/>
  <thead>
    <tr>
      <th>Name*</th>
      <th>Cmd-Line</th>
      <th>Option File</th>
      <th>System Var</th>
      <th>Status Var</th>
      <th>Var Scope</th>
      <th>Dynamic</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>authentication_ldap_sasl_auth_method_name</th>
      <td>Yes</td>
      <td>Yes</td>
      <td>Yes</td>
      <td></td>
      <td>Global</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>authentication_ldap_sasl_bind_base_dn</th>
      <td>Yes</td>
      <td>Yes</td>
      <td>Yes</td>
      <td></td>
      <td>Global</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>authentication_ldap_sasl_bind_root_dn</th>
      <td>Yes</td>
      <td>Yes</td>
      <td>Yes</td>
      <td></td>
      <td>Global</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>authentication_ldap_sasl_bind_root_pwd</th>
      <td>Yes</td>
      <td>Yes</td>
      <td>Yes</td>
      <td></td>
      <td>Global</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>authentication_ldap_sasl_ca_path</th>
      <td>Yes</td>
      <td>Yes</td>
      <td>Yes</td>
      <td></td>
      <td>Global</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>authentication_ldap_sasl_group_search_attr</th>
      <td>Yes</td>
      <td>Yes</td>
      <td>Yes</td>
      <td></td>
      <td>Global</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>authentication_ldap_sasl_group_search_filter</th>
      <td>Yes</td>
      <td>Yes</td>
      <td>Yes</td>
      <td></td>
      <td>Global</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>authentication_ldap_sasl_init_pool_size</th>
      <td>Yes</td>
      <td>Yes</td>
      <td>Yes</td>
      <td></td>
      <td>Global</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>authentication_ldap_sasl_log_status</th>
      <td>Yes</td>
      <td>Yes</td>
      <td>Yes</td>
      <td></td>
      <td>Global</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>authentication_ldap_sasl_max_pool_size</th>
      <td>Yes</td>
      <td>Yes</td>
      <td>Yes</td>
      <td></td>
      <td>Global</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>authentication_ldap_sasl_server_host</th>
      <td>Yes</td>
      <td>Yes</td>
      <td>Yes</td>
      <td></td>
      <td>Global</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>authentication_ldap_sasl_server_port</th>
      <td>Yes</td>
      <td>Yes</td>
      <td>Yes</td>
      <td></td>
      <td>Global</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>authentication_ldap_sasl_tls</th>
      <td>Yes</td>
      <td>Yes</td>
      <td>Yes</td>
      <td></td>
      <td>Global</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>authentication_ldap_sasl_user_search_attr</th>
      <td>Yes</td>
      <td>Yes</td>
      <td>Yes</td>
      <td></td>
      <td>Global</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>authentication_ldap_simple_auth_method_name</th>
      <td>Yes</td>
      <td>Yes</td>
      <td>Yes</td>
      <td></td>
      <td>Global</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>authentication_ldap_simple_bind_base_dn</th>
      <td>Yes</td>
      <td>Yes</td>
      <td>Yes</td>
      <td></td>
      <td>Global</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>authentication_ldap_simple_bind_root_dn</th>
      <td>Yes</td>
      <td>Yes</td>
      <td>Yes</td>
      <td></td>
      <td>Global</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>authentication_ldap_simple_bind_root_pwd</th>
      <td>Yes</td>
      <td>Yes</td>
      <td>Yes</td>
      <td></td>
      <td>Global</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>authentication_ldap_simple_ca_path</th>
      <td>Yes</td>
      <td>Yes</td>
      <td>Yes</td>
      <td></td>
      <td>Global</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>authentication_ldap_simple_group_search_attr</th>
      <td>Yes</td>
      <td>Yes</td>
      <td>Yes</td>
      <td></td>
      <td>Global</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>authentication_ldap_simple_group_search_filter</th>
      <td>Yes</td>
      <td>Yes</td>
      <td>Yes</td>
      <td></td>
      <td>Global</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>authentication_ldap_simple_init_pool_size</th>
      <td>Yes</td>
      <td>Yes</td>
      <td>Yes</td>
      <td></td>
      <td>Global</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>authentication_ldap_simple_log_status</th>
      <td>Yes</td>
      <td>Yes</td>
      <td>Yes</td>
      <td></td>
      <td>Global</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>authentication_ldap_simple_max_pool_size</th>
      <td>Yes</td>
      <td>Yes</td>
      <td>Yes</td>
      <td></td>
      <td>Global</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>authentication_ldap_simple_server_host</th>
      <td>Yes</td>
      <td>Yes</td>
      <td>Yes</td>
      <td></td>
      <td>Global</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>authentication_ldap_simple_server_port</th>
      <td>Yes</td>
      <td>Yes</td>
      <td>Yes</td>
      <td></td>
      <td>Global</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>authentication_ldap_simple_tls</th>
      <td>Yes</td>
      <td>Yes</td>
      <td>Yes</td>
      <td></td>
      <td>Global</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>authentication_ldap_simple_user_search_attr</th>
      <td>Yes</td>
      <td>Yes</td>
      <td>Yes</td>
      <td></td>
      <td>Global</td>
      <td>Yes</td>
    </tr>
    <tr>
      <th>authentication_windows_log_level</th>
      <td>Yes</td>
      <td>Yes</td>
      <td>Yes</td>
      <td></td>
      <td>Global</td>
      <td>No</td>
    </tr>
    <tr>
      <th>authentication_windows_use_principal_name</th>
      <td>Yes</td>
      <td>Yes</td>
      <td>Yes</td>
      <td></td>
      <td>Global</td>
      <td>No</td>
    </tr>
  </tbody>
</table>

* `authentication_ldap_sasl_auth_method_name`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>SCRAM-SHA-1</code></td> </tr><tr><th>Valid Values</th> <td><code>SCRAM-SHA-1</code></td> </tr></tbody></table>

  For SASL LDAP authentication, the authentication method name. Communication between the authentication plugin and the LDAP server occurs according to this authentication method to ensure password security.

  These authentication method values are permitted:

  + `SCRAM-SHA-1`: Use a SASL challenge-response mechanism.

    The client-side `authentication_ldap_sasl_client` plugin communicates with the SASL server, using the password to create a challenge and obtain a SASL request buffer, then passes this buffer to the server-side `authentication_ldap_sasl` plugin. The client-side and server-side SASL LDAP plugins use SASL messages for secure transmission of credentials within the LDAP protocol, to avoid sending the cleartext password between the MySQL client and server.

* `authentication_ldap_sasl_bind_base_dn`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_base_dn"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-bind-base-dn=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_bind_base_dn</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>

  For SASL LDAP authentication, the base distinguished name (DN). This variable can be used to limit the scope of searches by anchoring them at a certain location (the “base”) within the search tree.

  Suppose that members of one set of LDAP user entries each have this form:

  ```sql
  uid=user_name,ou=People,dc=example,dc=com
  ```

  And that members of another set of LDAP user entries each have this form:

  ```sql
  uid=user_name,ou=Admin,dc=example,dc=com
  ```

  Then searches work like this for different base DN values:

  + If the base DN is `ou=People,dc=example,dc=com`: Searches find user entries only in the first set.

  + If the base DN is `ou=Admin,dc=example,dc=com`: Searches find user entries only in the second set.

  + If the base DN is `ou=dc=example,dc=com`: Searches find user entries in the first or second set.

  In general, more specific base DN values result in faster searches because they limit the search scope more.

* `authentication_ldap_sasl_bind_root_dn`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_root_dn"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-bind-root-dn=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_bind_root_dn</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>

  For SASL LDAP authentication, the root distinguished name (DN). This variable is used in conjunction with `authentication_ldap_sasl_bind_root_pwd` as the credentials for authenticating to the LDAP server for the purpose of performing searches. Authentication uses either one or two LDAP bind operations, depending on whether the MySQL account names an LDAP user DN:

  + If the account does not name a user DN: `authentication_ldap_sasl` performs an initial LDAP binding using `authentication_ldap_sasl_bind_root_dn` and `authentication_ldap_sasl_bind_root_pwd`. (These are both empty by default, so if they are not set, the LDAP server must permit anonymous connections.) The resulting bind LDAP handle is used to search for the user DN, based on the client user name. `authentication_ldap_sasl` performs a second bind using the user DN and client-supplied password.

  + If the account does name a user DN: The first bind operation is unnecessary in this case. `authentication_ldap_sasl` performs a single bind using the user DN and client-supplied password. This is faster than if the MySQL account does not specify an LDAP user DN.

* `authentication_ldap_sasl_bind_root_pwd`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_root_pwd"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-bind-root-pwd=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_bind_root_pwd</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>

  For SASL LDAP authentication, the password for the root distinguished name. This variable is used in conjunction with `authentication_ldap_sasl_bind_root_dn`. See the description of that variable.

* `authentication_ldap_sasl_ca_path`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_ca_path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-ca-path=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_ca_path</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>

  For SASL LDAP authentication, the absolute path of the certificate authority file. Specify this file if it is desired that the authentication plugin perform verification of the LDAP server certificate.

  Note

  In addition to setting the `authentication_ldap_sasl_ca_path` variable to the file name, you must add the appropriate certificate authority certificates to the file and enable the `authentication_ldap_sasl_tls` system variable. These variables can be set to override the default OpenLDAP TLS configuration; see LDAP Pluggable Authentication and ldap.conf

* `authentication_ldap_sasl_group_search_attr`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_group_search_attr"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-group-search-attr=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_group_search_attr</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>cn</code></td> </tr></tbody></table>

  For SASL LDAP authentication, the name of the attribute that specifies group names in LDAP directory entries. If `authentication_ldap_sasl_group_search_attr` has its default value of `cn`, searches return the `cn` value as the group name. For example, if an LDAP entry with a `uid` value of `user1` has a `cn` attribute of `mygroup`, searches for `user1` return `mygroup` as the group name.

  This variable should be the empty string if you want no group or proxy authentication.

  As of MySQL 5.7.21, if the group search attribute is `isMemberOf`, LDAP authentication directly retrieves the user attribute `isMemberOf` value and assigns it as group information. If the group search attribute is not `isMemberOf`, LDAP authentication searches for all groups where the user is a member. (The latter is the default behavior.) This behavior is based on how LDAP group information can be stored two ways: 1) A group entry can have an attribute named `memberUid` or `member` with a value that is a user name; 2) A user entry can have an attribute named `isMemberOf` with values that are group names.

* `authentication_ldap_sasl_group_search_filter`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_group_search_filter"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-group-search-filter=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.21</td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_group_search_filter</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>(|(&amp;(objectClass=posixGroup)(memberUid=%s))(&amp;(objectClass=group)(member=%s)))</code></td> </tr></tbody></table>

  For SASL LDAP authentication, the custom group search filter.

  As of MySQL 5.7.22, the search filter value can contain `{UA}` and `{UD}` notation to represent the user name and the full user DN. For example, `{UA}` is replaced with a user name such as `"admin"`, whereas `{UD}` is replaced with a use full DN such as `"uid=admin,ou=People,dc=example,dc=com"`. The following value is the default, which supports both OpenLDAP and Active Directory:

  ```sql
  (|(&(objectClass=posixGroup)(memberUid={UA}))
    (&(objectClass=group)(member={UD})))
  ```

  Previously, if the group search attribute was `isMemberOf` or `memberOf`, it was treated as a user attribute that has group information. However, in some cases for the user scenario, `memberOf` was a simple user attribute that held no group information. For additional flexibility, an optional `{GA}` prefix now can be used with the group search attribute. (Previously, it was assumed that if the group search attribute is `isMemberOf`, it is treated differently. Now any group attribute with a {GA} prefix is treated as a user attribute having group names.) For example, with a value of `{GA}MemberOf`, if the group value is the DN, the first attribute value from the group DN is returned as the group name.

  In MySQL 5.7.21, the search filter used `%s` notation, expanding it to the user name for OpenLDAP (`&(objectClass=posixGroup)(memberUid=%s)`) and to the full user DN for Active Directory (`&(objectClass=group)(member=%s)`).

* `authentication_ldap_sasl_init_pool_size`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_init_pool_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-init-pool-size=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_init_pool_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>10</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>32767</code></td> </tr><tr><th>Unit</th> <td>connections</td> </tr></tbody></table>

  For SASL LDAP authentication, the initial size of the pool of connections to the LDAP server. Choose the value for this variable based on the average number of concurrent authentication requests to the LDAP server.

  The plugin uses `authentication_ldap_sasl_init_pool_size` and `authentication_ldap_sasl_max_pool_size` together for connection-pool management:

  + When the authentication plugin initializes, it creates `authentication_ldap_sasl_init_pool_size` connections, unless `authentication_ldap_sasl_max_pool_size=0` to disable pooling.

  + If the plugin receives an anthentication request when there are no free connections in the current connection pool, the plugin can create a new connection, up to the maximum connection pool size given by `authentication_ldap_sasl_max_pool_size`.

  + If the plugin receives a request when the pool size is already at its maximum and there are no free connections, authentication fails.

  + When the plugin unloads, it closes all pooled connections.

  Changes to plugin system variable settings may have no effect on connections already in the pool. For example, modifying the LDAP server host, port, or TLS settings does not affect existing connections. However, if the original variable values were invalid and the connection pool could not be initialized, the plugin attempts to reinitialize the pool for the next LDAP request. In this case, the new system variable values are used for the reinitialization attempt.

  If `authentication_ldap_sasl_max_pool_size=0` to disable pooling, each LDAP connection opened by the plugin uses the values the system variables have at that time.

* `authentication_ldap_sasl_log_status`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_log_status"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-log-status=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_log_status</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

  For SASL LDAP authentication, the logging level for messages written to the error log. The following table shows the permitted level values and their meanings.

  **Table 6.21 Log Levels for authentication\_ldap\_sasl\_log\_status**

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>SCRAM-SHA-1</code></td> </tr><tr><th>Valid Values</th> <td><code>SCRAM-SHA-1</code></td> </tr></tbody></table>0

  On the client side, messages can be logged to the standard output by setting the `AUTHENTICATION_LDAP_CLIENT_LOG` environment variable. The permitted and default values are the same as for `authentication_ldap_sasl_log_status`.

  The `AUTHENTICATION_LDAP_CLIENT_LOG` environment variable applies only to SASL LDAP authentication. It has no effect for simple LDAP authentication because the client plugin in that case is `mysql_clear_password`, which knows nothing about LDAP operations.

* `authentication_ldap_sasl_max_pool_size`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>SCRAM-SHA-1</code></td> </tr><tr><th>Valid Values</th> <td><code>SCRAM-SHA-1</code></td> </tr></tbody></table>1

  For SASL LDAP authentication, the maximum size of the pool of connections to the LDAP server. To disable connection pooling, set this variable to 0.

  This variable is used in conjunction with `authentication_ldap_sasl_init_pool_size`. See the description of that variable.

* `authentication_ldap_sasl_server_host`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>SCRAM-SHA-1</code></td> </tr><tr><th>Valid Values</th> <td><code>SCRAM-SHA-1</code></td> </tr></tbody></table>2

  The LDAP server host for SASL LDAP authentication; this can be a host name or IP address.

* `authentication_ldap_sasl_server_port`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>SCRAM-SHA-1</code></td> </tr><tr><th>Valid Values</th> <td><code>SCRAM-SHA-1</code></td> </tr></tbody></table>3

  For SASL LDAP authentication, the LDAP server TCP/IP port number.

  As of MySQL 5.7.25, if the LDAP port number is configured as 636 or 3269, the plugin uses LDAPS (LDAP over SSL) instead of LDAP. (LDAPS differs from `startTLS`.)

* `authentication_ldap_sasl_tls`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>SCRAM-SHA-1</code></td> </tr><tr><th>Valid Values</th> <td><code>SCRAM-SHA-1</code></td> </tr></tbody></table>4

  For SASL LDAP authentication, whether connections by the plugin to the LDAP server are secure. If this variable is enabled, the plugin uses TLS to connect securely to the LDAP server. This variable can be set to override the default OpenLDAP TLS configuration; see LDAP Pluggable Authentication and ldap.conf If you enable this variable, you may also wish to set the `authentication_ldap_sasl_ca_path` variable.

  MySQL LDAP plugins support the StartTLS method, which initializes TLS on top of a plain LDAP connection.

  As of MySQL 5.7.25, LDAPS can be used by setting the `authentication_ldap_sasl_server_port` system variable.

* `authentication_ldap_sasl_user_search_attr`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>SCRAM-SHA-1</code></td> </tr><tr><th>Valid Values</th> <td><code>SCRAM-SHA-1</code></td> </tr></tbody></table>5

  For SASL LDAP authentication, the name of the attribute that specifies user names in LDAP directory entries. If a user distinguished name is not provided, the authentication plugin searches for the name using this attribute. For example, if the `authentication_ldap_sasl_user_search_attr` value is `uid`, a search for the user name `user1` finds entries with a `uid` value of `user1`.

* `authentication_ldap_simple_auth_method_name`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>SCRAM-SHA-1</code></td> </tr><tr><th>Valid Values</th> <td><code>SCRAM-SHA-1</code></td> </tr></tbody></table>6

  For simple LDAP authentication, the authentication method name. Communication between the authentication plugin and the LDAP server occurs according to this authentication method.

  Note

  For all simple LDAP authentication methods, it is recommended to also set TLS parameters to require that communication with the LDAP server take place over secure connections.

  These authentication method values are permitted:

  + `SIMPLE`: Use simple LDAP authentication. This method uses either one or two LDAP bind operations, depending on whether the MySQL account names an LDAP user distinguished name. See the description of `authentication_ldap_simple_bind_root_dn`.

  + `AD-FOREST`: A variation on `SIMPLE`, such that authentication searches all domains in the Active Directory forest, performing an LDAP bind to each Active Directory domain until the user is found in some domain.

* `authentication_ldap_simple_bind_base_dn`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>SCRAM-SHA-1</code></td> </tr><tr><th>Valid Values</th> <td><code>SCRAM-SHA-1</code></td> </tr></tbody></table>7

  For simple LDAP authentication, the base distinguished name (DN). This variable can be used to limit the scope of searches by anchoring them at a certain location (the “base”) within the search tree.

  Suppose that members of one set of LDAP user entries each have this form:

  ```sql
  uid=user_name,ou=People,dc=example,dc=com
  ```

  And that members of another set of LDAP user entries each have this form:

  ```sql
  uid=user_name,ou=Admin,dc=example,dc=com
  ```

  Then searches work like this for different base DN values:

  + If the base DN is `ou=People,dc=example,dc=com`: Searches find user entries only in the first set.

  + If the base DN is `ou=Admin,dc=example,dc=com`: Searches find user entries only in the second set.

  + If the base DN is `ou=dc=example,dc=com`: Searches find user entries in the first or second set.

  In general, more specific base DN values result in faster searches because they limit the search scope more.

* `authentication_ldap_simple_bind_root_dn`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>SCRAM-SHA-1</code></td> </tr><tr><th>Valid Values</th> <td><code>SCRAM-SHA-1</code></td> </tr></tbody></table>8

  For simple LDAP authentication, the root distinguished name (DN). This variable is used in conjunction with `authentication_ldap_simple_bind_root_pwd` as the credentials for authenticating to the LDAP server for the purpose of performing searches. Authentication uses either one or two LDAP bind operations, depending on whether the MySQL account names an LDAP user DN:

  + If the account does not name a user DN: `authentication_ldap_simple` performs an initial LDAP binding using `authentication_ldap_simple_bind_root_dn` and `authentication_ldap_simple_bind_root_pwd`. (These are both empty by default, so if they are not set, the LDAP server must permit anonymous connections.) The resulting bind LDAP handle is used to search for the user DN, based on the client user name. `authentication_ldap_simple` performs a second bind using the user DN and client-supplied password.

  + If the account does name a user DN: The first bind operation is unnecessary in this case. `authentication_ldap_simple` performs a single bind using the user DN and client-supplied password. This is faster than if the MySQL account does not specify an LDAP user DN.

* `authentication_ldap_simple_bind_root_pwd`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>SCRAM-SHA-1</code></td> </tr><tr><th>Valid Values</th> <td><code>SCRAM-SHA-1</code></td> </tr></tbody></table>9

  For simple LDAP authentication, the password for the root distinguished name. This variable is used in conjunction with `authentication_ldap_simple_bind_root_dn`. See the description of that variable.

* `authentication_ldap_simple_ca_path`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_base_dn"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-bind-base-dn=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_bind_base_dn</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>0

  For simple LDAP authentication, the absolute path of the certificate authority file. Specify this file if it is desired that the authentication plugin perform verification of the LDAP server certificate.

  Note

  In addition to setting the `authentication_ldap_simple_ca_path` variable to the file name, you must add the appropriate certificate authority certificates to the file and enable the `authentication_ldap_simple_tls` system variable. These variables can be set to override the default OpenLDAP TLS configuration; see LDAP Pluggable Authentication and ldap.conf

* `authentication_ldap_simple_group_search_attr`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_base_dn"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-bind-base-dn=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_bind_base_dn</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>1

  For simple LDAP authentication, the name of the attribute that specifies group names in LDAP directory entries. If `authentication_ldap_simple_group_search_attr` has its default value of `cn`, searches return the `cn` value as the group name. For example, if an LDAP entry with a `uid` value of `user1` has a `cn` attribute of `mygroup`, searches for `user1` return `mygroup` as the group name.

  As of MySQL 5.7.21, if the group search attribute is `isMemberOf`, LDAP authentication directly retrieves the user attribute `isMemberOf` value and assigns it as group information. If the group search attribute is not `isMemberOf`, LDAP authentication searches for all groups where the user is a member. (The latter is the default behavior.) This behavior is based on how LDAP group information can be stored two ways: 1) A group entry can have an attribute named `memberUid` or `member` with a value that is a user name; 2) A user entry can have an attribute named `isMemberOf` with values that are group names.

* `authentication_ldap_simple_group_search_filter`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_base_dn"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-bind-base-dn=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_bind_base_dn</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>2

  For simple LDAP authentication, the custom group search filter.

  As of MySQL 5.7.22, the search filter value can contain `{UA}` and `{UD}` notation to represent the user name and the full user DN. For example, `{UA}` is replaced with a user name such as `"admin"`, whereas `{UD}` is replaced with a use full DN such as `"uid=admin,ou=People,dc=example,dc=com"`. The following value is the default, which supports both OpenLDAP and Active Directory:

  ```sql
  (|(&(objectClass=posixGroup)(memberUid={UA}))
    (&(objectClass=group)(member={UD})))
  ```

  Previously, if the group search attribute was `isMemberOf` or `memberOf`, it was treated as a user attribute that has group information. However, in some cases for the user scenario, `memberOf` was a simple user attribute that held no group information. For additional flexibility, an optional `{GA}` prefix now can be used with the group search attribute. (Previously, it was assumed that if the group search attribute is `isMemberOf`, it is treated differently. Now any group attribute with a {GA} prefix is treated as a user attribute having group names.) For example, with a value of `{GA}MemberOf`, if the group value is the DN, the first attribute value from the group DN is returned as the group name.

  In MySQL 5.7.21, the search filter used `%s` notation, expanding it to the user name for OpenLDAP (`&(objectClass=posixGroup)(memberUid=%s)`) and to the full user DN for Active Directory (`&(objectClass=group)(member=%s)`).

* `authentication_ldap_simple_init_pool_size`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_base_dn"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-bind-base-dn=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_bind_base_dn</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>3

  For simple LDAP authentication, the initial size of the pool of connections to the LDAP server. Choose the value for this variable based on the average number of concurrent authentication requests to the LDAP server.

  The plugin uses `authentication_ldap_simple_init_pool_size` and `authentication_ldap_simple_max_pool_size` together for connection-pool management:

  + When the authentication plugin initializes, it creates `authentication_ldap_simple_init_pool_size` connections, unless `authentication_ldap_simple_max_pool_size=0` to disable pooling.

  + If the plugin receives an authentication request when there are no free connections in the current connection pool, the plugin can create a new connection, up to the maximum connection pool size given by `authentication_ldap_simple_max_pool_size`.

  + If the plugin receives a request when the pool size is already at its maximum and there are no free connections, authentication fails.

  + When the plugin unloads, it closes all pooled connections.

  Changes to plugin system variable settings may have no effect on connections already in the pool. For example, modifying the LDAP server host, port, or TLS settings does not affect existing connections. However, if the original variable values were invalid and the connection pool could not be initialized, the plugin attempts to reinitialize the pool for the next LDAP request. In this case, the new system variable values are used for the reinitialization attempt.

  If `authentication_ldap_simple_max_pool_size=0` to disable pooling, each LDAP connection opened by the plugin uses the values the system variables have at that time.

* `authentication_ldap_simple_log_status`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_base_dn"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-bind-base-dn=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_bind_base_dn</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>4

  For simple LDAP authentication, the logging level for messages written to the error log. The following table shows the permitted level values and their meanings.

  **Table 6.22 Log Levels for authentication\_ldap\_simple\_log\_status**

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_base_dn"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-bind-base-dn=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_bind_base_dn</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>5

* `authentication_ldap_simple_max_pool_size`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_base_dn"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-bind-base-dn=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_bind_base_dn</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>6

  For simple LDAP authentication, the maximum size of the pool of connections to the LDAP server. To disable connection pooling, set this variable to 0.

  This variable is used in conjunction with `authentication_ldap_simple_init_pool_size`. See the description of that variable.

* `authentication_ldap_simple_server_host`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_base_dn"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-bind-base-dn=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_bind_base_dn</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>7

  For simple LDAP authentication, the LDAP server host. The permitted values for this variable depend on the authentication method:

  + For `authentication_ldap_simple_auth_method_name=SIMPLE`: The LDAP server host can be a host name or IP address.

  + For `authentication_ldap_simple_auth_method_name=AD-FOREST`. The LDAP server host can be an Active Directory domain name. For example, for an LDAP server URL of `ldap://example.mem.local:389`, the domain name can be `mem.local`.

    An Active Directory forest setup can have multiple domains (LDAP server IPs), which can be discovered using DNS. On Unix and Unix-like systems, some additional setup may be required to configure your DNS server with SRV records that specify the LDAP servers for the Active Directory domain. For information about DNS SRV, see [RFC 2782](https://tools.ietf.org/html/rfc2782).

    Suppose that your configuration has these properties:

    - The name server that provides information about Active Directory domains has IP address `10.172.166.100`.

    - The LDAP servers have names `ldap1.mem.local` through `ldap3.mem.local` and IP addresses `10.172.166.101` through `10.172.166.103`.

    You want the LDAP servers to be discoverable using SRV searches. For example, at the command line, a command like this should list the LDAP servers:

    ```sql
    host -t SRV _ldap._tcp.mem.local
    ```

    Perform the DNS configuration as follows:

    1. Add a line to `/etc/resolv.conf` to specify the name server that provides information about Active Directory domains:

       ```sql
       nameserver 10.172.166.100
       ```

    2. Configure the appropriate zone file for the name server with SRV records for the LDAP servers:

       ```sql
       _ldap._tcp.mem.local. 86400 IN SRV 0 100 389 ldap1.mem.local.
       _ldap._tcp.mem.local. 86400 IN SRV 0 100 389 ldap2.mem.local.
       _ldap._tcp.mem.local. 86400 IN SRV 0 100 389 ldap3.mem.local.
       ```

    3. It may also be necessary to specify the IP address for the LDAP servers in `/etc/hosts` if the server host cannot be resolved. For example, add lines like this to the file:

       ```sql
       10.172.166.101 ldap1.mem.local
       10.172.166.102 ldap2.mem.local
       10.172.166.103 ldap3.mem.local
       ```

    With the DNS configured as just described, the server-side LDAP plugin can discover the LDAP servers and tries to authenticate in all domains until authentication succeeds or there are no more servers.

    Windows needs no such settings as just described. Given the LDAP server host in the `authentication_ldap_simple_server_host` value, the Windows LDAP library searches all domains and attempts to authenticate.

* `authentication_ldap_simple_server_port`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_base_dn"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-bind-base-dn=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_bind_base_dn</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>8

  For simple LDAP authentication, the LDAP server TCP/IP port number.

  As of MySQL 5.7.25, if the LDAP port number is configured as 636 or 3269, the plugin uses LDAPS (LDAP over SSL) instead of LDAP. (LDAPS differs from `startTLS`.)

* `authentication_ldap_simple_tls`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_base_dn"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-bind-base-dn=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_bind_base_dn</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>9

  For simple LDAP authentication, whether connections by the plugin to the LDAP server are secure. If this variable is enabled, the plugin uses TLS to connect securely to the LDAP server. This variable can be set to override the default OpenLDAP TLS configuration; see LDAP Pluggable Authentication and ldap.conf If you enable this variable, you may also wish to set the `authentication_ldap_simple_ca_path` variable.

  MySQL LDAP plugins support the StartTLS method, which initializes TLS on top of a plain LDAP connection.

  As of MySQL 5.7.25, LDAPS can be used by setting the `authentication_ldap_simple_server_port` system variable.

* `authentication_ldap_simple_user_search_attr`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_root_dn"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-bind-root-dn=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_bind_root_dn</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>0

  For simple LDAP authentication, the name of the attribute that specifies user names in LDAP directory entries. If a user distinguished name is not provided, the authentication plugin searches for the name using this attribute. For example, if the `authentication_ldap_simple_user_search_attr` value is `uid`, a search for the user name `user1` finds entries with a `uid` value of `user1`.


### 6.4.2 Connection Control Plugins

As of MySQL 5.7.17, MySQL Server includes a plugin library that enables administrators to introduce an increasing delay in server response to connection attempts after a configurable number of consecutive failed attempts. This capability provides a deterrent that slows down brute force attacks against MySQL user accounts. The plugin library contains two plugins:

* `CONNECTION_CONTROL` checks incoming connection attempts and adds a delay to server responses as necessary. This plugin also exposes system variables that enable its operation to be configured and a status variable that provides rudimentary monitoring information.

  The `CONNECTION_CONTROL` plugin uses the audit plugin interface (see Writing Audit Plugins). To collect information, it subscribes to the `MYSQL_AUDIT_CONNECTION_CLASSMASK` event class, and processes `MYSQL_AUDIT_CONNECTION_CONNECT` and `MYSQL_AUDIT_CONNECTION_CHANGE_USER` subevents to check whether the server should introduce a delay before responding to connection attempts.

* `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS` implements an `INFORMATION_SCHEMA` table that exposes more detailed monitoring information for failed connection attempts. For more information about this table, see Section 24.6.2, “The INFORMATION\_SCHEMA CONNECTION\_CONTROL\_FAILED\_LOGIN\_ATTEMPTS Table”.

The following sections provide information about connection control plugin installation and configuration.


#### 6.4.2.1 Connection Control Plugin Installation

This section describes how to install the connection control plugins, `CONNECTION_CONTROL` and `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS`. For general information about installing plugins, see Section 5.5.1, “Installing and Uninstalling Plugins”.

To be usable by the server, the plugin library file must be located in the MySQL plugin directory (the directory named by the `plugin_dir` system variable). If necessary, configure the plugin directory location by setting the value of `plugin_dir` at server startup.

The plugin library file base name is `connection_control`. The file name suffix differs per platform (for example, `.so` for Unix and Unix-like systems, `.dll` for Windows).

To load the plugins at server startup, use the `--plugin-load-add` option to name the library file that contains them. With this plugin-loading method, the option must be given each time the server starts. For example, put these lines in the server `my.cnf` file, adjusting the `.so` suffix for your platform as necessary:

```sql
[mysqld]
plugin-load-add=connection_control.so
```

After modifying `my.cnf`, restart the server to cause the new settings to take effect.

Alternatively, to load the plugins at runtime, use these statements, adjusting the `.so` suffix for your platform as necessary:

```sql
INSTALL PLUGIN CONNECTION_CONTROL
  SONAME 'connection_control.so';
INSTALL PLUGIN CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS
  SONAME 'connection_control.so';
```

`INSTALL PLUGIN` loads the plugin immediately, and also registers it in the `mysql.plugins` system table to cause the server to load it for each subsequent normal startup without the need for `--plugin-load-add`.

To verify plugin installation, examine the Information Schema `PLUGINS` table or use the `SHOW PLUGINS` statement (see Section 5.5.2, “Obtaining Server Plugin Information”). For example:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE 'connection%';
+------------------------------------------+---------------+
| PLUGIN_NAME                              | PLUGIN_STATUS |
+------------------------------------------+---------------+
| CONNECTION_CONTROL                       | ACTIVE        |
| CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS | ACTIVE        |
+------------------------------------------+---------------+
```

If a plugin fails to initialize, check the server error log for diagnostic messages.

If the plugins have been previously registered with `INSTALL PLUGIN` or are loaded with `--plugin-load-add`, you can use the `--connection-control` and `--connection-control-failed-login-attempts` options at server startup to control plugin activation. For example, to load the plugins at startup and prevent them from being removed at runtime, use these options:

```sql
[mysqld]
plugin-load-add=connection_control.so
connection-control=FORCE_PLUS_PERMANENT
connection-control-failed-login-attempts=FORCE_PLUS_PERMANENT
```

If it is desired to prevent the server from running without a given connection control plugin, use an option value of `FORCE` or `FORCE_PLUS_PERMANENT` to force server startup to fail if the plugin does not initialize successfully.

Note

It is possible to install one plugin without the other, but both must be installed for full connection control capability. In particular, installing only the `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS` plugin is of little use because, without the `CONNECTION_CONTROL` plugin to provide the data that populates the `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS` table, the table is always empty.

* Connection Delay Configuration
* Connection Failure Assessment
* Connection Failure Monitoring

##### Connection Delay Configuration

To enable configuring its operation, the `CONNECTION_CONTROL` plugin exposes these system variables:

* `connection_control_failed_connections_threshold`: The number of consecutive failed connection attempts permitted to accounts before the server adds a delay for subsequent connection attempts. To disable failed-connection counting, set `connection_control_failed_connections_threshold` to zero.

* `connection_control_min_connection_delay`: The minimum delay in milliseconds for connection failures above the threshold.

* `connection_control_max_connection_delay`: The maximum delay in milliseconds for connection failures above the threshold.

If `connection_control_failed_connections_threshold` is nonzero, failed-connection counting is enabled and has these properties:

* The delay is zero up through `connection_control_failed_connections_threshold` consecutive failed connection attempts.

* Thereafter, the server adds an increasing delay for subsequent consecutive attempts, until a successful connection occurs. The initial unadjusted delays begin at 1000 milliseconds (1 second) and increase by 1000 milliseconds per attempt. That is, once delay has been activated for an account, the unadjusted delays for subsequent failed attempts are 1000 milliseconds, 2000 milliseconds, 3000 milliseconds, and so forth.

* The actual delay experienced by a client is the unadjusted delay, adjusted to lie within the values of the `connection_control_min_connection_delay` and `connection_control_max_connection_delay` system variables, inclusive.

* Once delay has been activated for an account, the first successful connection thereafter by the account also experiences a delay, but failure counting is reset for subsequent connections.

For example, with the default `connection_control_failed_connections_threshold` value of 3, there is no delay for the first three consecutive failed connection attempts by an account. The actual adjusted delays experienced by the account for the fourth and subsequent failed connections depend on the `connection_control_min_connection_delay` and `connection_control_max_connection_delay` values:

* If `connection_control_min_connection_delay` and `connection_control_max_connection_delay` are 1000 and 20000, the adjusted delays are the same as the unadjusted delays, up to a maximum of 20000 milliseconds. The fourth and subsequent failed connections are delayed by 1000 milliseconds, 2000 milliseconds, 3000 milliseconds, and so forth.

* If `connection_control_min_connection_delay` and `connection_control_max_connection_delay` are 1500 and 20000, the adjusted delays for the fourth and subsequent failed connections are 1500 milliseconds, 2000 milliseconds, 3000 milliseconds, and so forth, up to a maximum of 20000 milliseconds.

* If `connection_control_min_connection_delay` and `connection_control_max_connection_delay` are 2000 and 3000, the adjusted delays for the fourth and subsequent failed connections are 2000 milliseconds, 2000 milliseconds, and 3000 milliseconds, with all subsequent failed connections also delayed by 3000 milliseconds.

You can set the `CONNECTION_CONTROL` system variables at server startup or runtime. Suppose that you want to permit four consecutive failed connection attempts before the server starts delaying its responses, with a minimum delay of 2000 milliseconds. To set the relevant variables at server startup, put these lines in the server `my.cnf` file:

```sql
[mysqld]
plugin-load-add=connection_control.so
connection-control-failed-connections-threshold=4
connection-control-min-connection-delay=2000
```

To set the variables at runtime, use these statements:

```sql
SET GLOBAL connection_control_failed_connections_threshold = 4;
SET GLOBAL connection_control_min_connection_delay = 1500;
```

`SET GLOBAL` sets the value for the running MySQL instance. To make the change permanent, add a line in your `my.cnf` file, as shown previously.

The `connection_control_min_connection_delay` and `connection_control_max_connection_delay` system variables both have minimum and maximum values of 1000 and 2147483647. In addition, the permitted range of values of each variable also depends on the current value of the other:

* `connection_control_min_connection_delay` cannot be set greater than the current value of `connection_control_max_connection_delay`.

* `connection_control_max_connection_delay` cannot be set less than the current value of `connection_control_min_connection_delay`.

Thus, to make the changes required for some configurations, you might need to set the variables in a specific order. Suppose that the current minimum and maximum delays are 1000 and 2000, and that you want to set them to 3000 and 5000. You cannot first set `connection_control_min_connection_delay` to 3000 because that is greater than the current `connection_control_max_connection_delay` value of 2000. Instead, set `connection_control_max_connection_delay` to 5000, then set `connection_control_min_connection_delay` to 3000.

##### Connection Failure Assessment

When the `CONNECTION_CONTROL` plugin is installed, it checks connection attempts and tracks whether they fail or succeed. For this purpose, a failed connection attempt is one for which the client user and host match a known MySQL account but the provided credentials are incorrect, or do not match any known account.

Failed-connection counting is based on the user/host combination for each connection attempt. Determination of the applicable user name and host name takes proxying into account and occurs as follows:

* If the client user proxies another user, the account for failed-connection counting is the proxying user, not the proxied user. For example, if `external_user@example.com` proxies `proxy_user@example.com`, connection counting uses the proxying user, `external_user@example.com`, rather than the proxied user, `proxy_user@example.com`. Both `external_user@example.com` and `proxy_user@example.com` must have valid entries in the `mysql.user` system table and a proxy relationship between them must be defined in the `mysql.proxies_priv` system table (see Section 6.2.14, “Proxy Users”).

* If the client user does not proxy another user, but does match a `mysql.user` entry, counting uses the `CURRENT_USER()` value corresponding to that entry. For example, if a user `user1` connecting from a host `host1.example.com` matches a `user1@host1.example.com` entry, counting uses `user1@host1.example.com`. If the user matches a `user1@%.example.com`, `user1@%.com`, or `user1@%` entry instead, counting uses `user1@%.example.com`, `user1@%.com`, or `user1@%`, respectively.

For the cases just described, the connection attempt matches some `mysql.user` entry, and whether the request succeeds or fails depends on whether the client provides the correct authentication credentials. For example, if the client presents an incorrect password, the connection attempt fails.

If the connection attempt matches no `mysql.user` entry, the attempt fails. In this case, no `CURRENT_USER()` value is available and connection-failure counting uses the user name provided by the client and the client host as determined by the server. For example, if a client attempts to connect as user `user2` from host `host2.example.com`, the user name part is available in the client request and the server determines the host information. The user/host combination used for counting is `user2@host2.example.com`.

Note

The server maintains information about which client hosts can possibly connect to the server (essentially the union of host values for `mysql.user` entries). If a client attempts to connect from any other host, the server rejects the attempt at an early stage of connection setup:

```sql
ERROR 1130 (HY000): Host 'host_name' is not
allowed to connect to this MySQL server
```

Because this type of rejection occurs so early, `CONNECTION_CONTROL` does not see it, and does not count it.

##### Connection Failure Monitoring

To monitor failed connections, use these information sources:

* The `Connection_control_delay_generated` status variable indicates the number of times the server added a delay to its response to a failed connection attempt. This does not count attempts that occur before reaching the threshold defined by the `connection_control_failed_connections_threshold` system variable.

* The `INFORMATION_SCHEMA` `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS` table provides information about the current number of consecutive failed connection attempts per account (user/host combination). This counts all failed attempts, regardless of whether they were delayed.

Assigning a value to `connection_control_failed_connections_threshold` at runtime has these effects:

* All accumulated failed-connection counters are reset to zero.

* The `Connection_control_delay_generated` status variable is reset to zero.

* The `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS` table becomes empty.


#### 6.4.2.2 Connection Control Plugin System and Status Variables

This section describes the system and status variables that the `CONNECTION_CONTROL` plugin provides to enable its operation to be configured and monitored.

* Connection Control Plugin System Variables
* Connection Control Plugin Status Variables

##### Connection Control Plugin System Variables

If the `CONNECTION_CONTROL` plugin is installed, it exposes these system variables:

* `connection_control_failed_connections_threshold`

  <table frame="box" rules="all" summary="Properties for connection_control_failed_connections_threshold"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connection-control-failed-connections-threshold=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>connection_control_failed_connections_threshold</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>3</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>2147483647</code></td> </tr></tbody></table>

  The number of consecutive failed connection attempts permitted to accounts before the server adds a delay for subsequent connection attempts:

  + If the variable has a nonzero value *`N`*, the server adds a delay beginning with consecutive failed attempt *`N`*+1. If an account has reached the point where connection responses are delayed, a delay also occurs for the next subsequent successful connection.

  + Setting this variable to zero disables failed-connection counting. In this case, the server never adds delays.

  For information about how `connection_control_failed_connections_threshold` interacts with other connection control system and status variables, see Section 6.4.2.1, “Connection Control Plugin Installation”.

* `connection_control_max_connection_delay`

  <table frame="box" rules="all" summary="Properties for connection_control_max_connection_delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connection-control-max-connection-delay=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>connection_control_max_connection_delay</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>2147483647</code></td> </tr><tr><th>Minimum Value</th> <td><code>1000</code></td> </tr><tr><th>Maximum Value</th> <td><code>2147483647</code></td> </tr><tr><th>Unit</th> <td>milliseconds</td> </tr></tbody></table>

  The maximum delay in milliseconds for server response to failed connection attempts, if `connection_control_failed_connections_threshold` is greater than zero.

  For information about how `connection_control_max_connection_delay` interacts with other connection control system and status variables, see Section 6.4.2.1, “Connection Control Plugin Installation”.

* `connection_control_min_connection_delay`

  <table frame="box" rules="all" summary="Properties for connection_control_min_connection_delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connection-control-min-connection-delay=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.17</td> </tr><tr><th>System Variable</th> <td><code>connection_control_min_connection_delay</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1000</code></td> </tr><tr><th>Minimum Value</th> <td><code>1000</code></td> </tr><tr><th>Maximum Value</th> <td><code>2147483647</code></td> </tr><tr><th>Unit</th> <td>milliseconds</td> </tr></tbody></table>

  The minimum delay in milliseconds for server response to failed connection attempts, if `connection_control_failed_connections_threshold` is greater than zero.

  For information about how `connection_control_min_connection_delay` interacts with other connection control system and status variables, see Section 6.4.2.1, “Connection Control Plugin Installation”.

##### Connection Control Plugin Status Variables

If the `CONNECTION_CONTROL` plugin is installed, it exposes this status variable:

* `Connection_control_delay_generated`

  The number of times the server added a delay to its response to a failed connection attempt. This does not count attempts that occur before reaching the threshold defined by the `connection_control_failed_connections_threshold` system variable.

  This variable provides a simple counter. For more detailed connection control monitoring information, examine the `INFORMATION_SCHEMA` `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS` table; see Section 24.6.2, “The INFORMATION\_SCHEMA CONNECTION\_CONTROL\_FAILED\_LOGIN\_ATTEMPTS Table”.

  Assigning a value to `connection_control_failed_connections_threshold` at runtime resets `Connection_control_delay_generated` to zero.

  This variable was added in MySQL 5.7.17.


### 6.4.3 The Password Validation Plugin

The `validate_password` plugin serves to improve security by requiring account passwords and enabling strength testing of potential passwords. This plugin exposes a set of system variables that enable you to configure password policy.

The `validate_password` plugin implements these capabilities:

* For SQL statements that assign a password supplied as a cleartext value, `validate_password` checks the password against the current password policy and rejects the password if it is weak (the statement returns an `ER_NOT_VALID_PASSWORD` error). This applies to the `ALTER USER`, `CREATE USER`, `GRANT`, and `SET PASSWORD` statements, and passwords given as arguments to the `PASSWORD()` function.

* For `CREATE USER` statements, `validate_password` requires that a password be given, and that it satisfies the password policy. This is true even if an account is locked initially because otherwise unlocking the account later would cause it to become accessible without a password that satisfies the policy.

* `validate_password` implements a `VALIDATE_PASSWORD_STRENGTH()` SQL function that assesses the strength of potential passwords. This function takes a password argument and returns an integer from 0 (weak) to 100 (strong).

Note

For statements that assign, modify, or generate account passwords (`ALTER USER`, `CREATE USER`, `GRANT`, and `SET PASSWORD`; statements that use `PASSWORD()`, the `validate_password` capabilities described here apply only to accounts that use an authentication plugin that stores credentials internally to MySQL. For accounts that use plugins that perform authentication against a credentials system external to MySQL, password management must be handled externally against that system as well. For more information about internal credentials storage, see Section 6.2.11, “Password Management”.

The preceding restriction does not apply to use of the `VALIDATE_PASSWORD_STRENGTH()` function because it does not affect accounts directly.

Examples:

* `validate_password` checks the cleartext password in the following statement. Under the default password policy, which requires passwords to be at least 8 characters long, the password is weak and the statement produces an error:

  ```sql
  mysql> ALTER USER USER() IDENTIFIED BY 'abc';
  ERROR 1819 (HY000): Your password does not satisfy the current
  policy requirements
  ```

* Passwords specified as hashed values are not checked because the original password value is not available for checking:

  ```sql
  mysql> ALTER USER 'jeffrey'@'localhost'
         IDENTIFIED WITH mysql_native_password
         AS '*0D3CED9BEC10A777AEC23CCC353A8C08A633045E';
  Query OK, 0 rows affected (0.01 sec)
  ```

* This account-creation statement fails, even though the account is locked initially, because it does not include a password that satisfies the current password policy:

  ```sql
  mysql> CREATE USER 'juanita'@'localhost' ACCOUNT LOCK;
  ERROR 1819 (HY000): Your password does not satisfy the current
  policy requirements
  ```

* To check a password, use the `VALIDATE_PASSWORD_STRENGTH()` function:

  ```sql
  mysql> SELECT VALIDATE_PASSWORD_STRENGTH('weak');
  +------------------------------------+
  | VALIDATE_PASSWORD_STRENGTH('weak') |
  +------------------------------------+
  |                                 25 |
  +------------------------------------+
  mysql> SELECT VALIDATE_PASSWORD_STRENGTH('lessweak$_@123');
  +----------------------------------------------+
  | VALIDATE_PASSWORD_STRENGTH('lessweak$_@123') |
  +----------------------------------------------+
  |                                           50 |
  +----------------------------------------------+
  mysql> SELECT VALIDATE_PASSWORD_STRENGTH('N0Tweak$_@123!');
  +----------------------------------------------+
  | VALIDATE_PASSWORD_STRENGTH('N0Tweak$_@123!') |
  +----------------------------------------------+
  |                                          100 |
  +----------------------------------------------+
  ```

To configure password checking, modify the system variables having names of the form `validate_password_xxx`; these are the parameters that control password policy. See Section 6.4.3.2, “Password Validation Plugin Options and Variables”.

If `validate_password` is not installed, the `validate_password_xxx` system variables are not available, passwords in statements are not checked, and the `VALIDATE_PASSWORD_STRENGTH()` function always returns 0. For example, without the plugin installed, accounts can be assigned passwords shorter than 8 characters, or no password at all.

Assuming that `validate_password` is installed, it implements three levels of password checking: `LOW`, `MEDIUM`, and `STRONG`. The default is `MEDIUM`; to change this, modify the value of `validate_password_policy`. The policies implement increasingly strict password tests. The following descriptions refer to default parameter values, which can be modified by changing the appropriate system variables.

* `LOW` policy tests password length only. Passwords must be at least 8 characters long. To change this length, modify `validate_password_length`.

* `MEDIUM` policy adds the conditions that passwords must contain at least 1 numeric character, 1 lowercase character, 1 uppercase character, and 1 special (nonalphanumeric) character. To change these values, modify `validate_password_number_count`, `validate_password_mixed_case_count`, and `validate_password_special_char_count`.

* `STRONG` policy adds the condition that password substrings of length 4 or longer must not match words in the dictionary file, if one has been specified. To specify the dictionary file, modify `validate_password_dictionary_file`.

In addition, as of MySQL 5.7.15, `validate_password` supports the capability of rejecting passwords that match the user name part of the effective user account for the current session, either forward or in reverse. To provide control over this capability, `validate_password` exposes a `validate_password_check_user_name` system variable, which is enabled by default.


#### 6.4.3.1 Password Validation Plugin Installation

This section describes how to install the `validate_password` password-validation plugin. For general information about installing plugins, see Section 5.5.1, “Installing and Uninstalling Plugins”.

Note

If you installed MySQL 5.7 using the [MySQL Yum repository](https://dev.mysql.com/downloads/repo/yum/), [MySQL SLES Repository](https://dev.mysql.com/downloads/repo/suse/), or RPM packages provided by Oracle, `validate_password` is enabled by default after you start your MySQL Server for the first time.

To be usable by the server, the plugin library file must be located in the MySQL plugin directory (the directory named by the `plugin_dir` system variable). If necessary, configure the plugin directory location by setting the value of `plugin_dir` at server startup.

The plugin library file base name is `validate_password`. The file name suffix differs per platform (for example, `.so` for Unix and Unix-like systems, `.dll` for Windows).

To load the plugin at server startup, use the `--plugin-load-add` option to name the library file that contains it. With this plugin-loading method, the option must be given each time the server starts. For example, put these lines in the server `my.cnf` file, adjusting the `.so` suffix for your platform as necessary:

```sql
[mysqld]
plugin-load-add=validate_password.so
```

After modifying `my.cnf`, restart the server to cause the new settings to take effect.

Alternatively, to load the plugin at runtime, use this statement, adjusting the `.so` suffix for your platform as necessary:

```sql
INSTALL PLUGIN validate_password SONAME 'validate_password.so';
```

`INSTALL PLUGIN` loads the plugin, and also registers it in the `mysql.plugins` system table to cause the plugin to be loaded for each subsequent normal server startup without the need for `--plugin-load-add`.

To verify plugin installation, examine the Information Schema `PLUGINS` table or use the `SHOW PLUGINS` statement (see Section 5.5.2, “Obtaining Server Plugin Information”). For example:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE 'validate%';
+-------------------+---------------+
| PLUGIN_NAME       | PLUGIN_STATUS |
+-------------------+---------------+
| validate_password | ACTIVE        |
+-------------------+---------------+
```

If the plugin fails to initialize, check the server error log for diagnostic messages.

If the plugin has been previously registered with `INSTALL PLUGIN` or is loaded with `--plugin-load-add`, you can use the `--validate-password` option at server startup to control plugin activation. For example, to load the plugin at startup and prevent it from being removed at runtime, use these options:

```sql
[mysqld]
plugin-load-add=validate_password.so
validate-password=FORCE_PLUS_PERMANENT
```

If it is desired to prevent the server from running without the password-validation plugin, use `--validate-password` with a value of `FORCE` or `FORCE_PLUS_PERMANENT` to force server startup to fail if the plugin does not initialize successfully.


#### 6.4.3.2 Password Validation Plugin Options and Variables

This section describes the options, system variables, and status variables that `validate_password` provides to enable its operation to be configured and monitored.

* Password Validation Plugin Options
* Password Validation Plugin System Variables
* Password Validation Plugin Status Variables

##### Password Validation Plugin Options

To control activation of the `validate_password` plugin, use this option:

* `--validate-password[=value]`

  <table frame="box" rules="all" summary="Properties for validate-password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><code>ON</code><code>OFF</code><code>FORCE</code><code>FORCE_PLUS_PERMANENT</code></td> </tr></tbody></table>

  This option controls how the server loads the `validate_password` plugin at startup. The value should be one of those available for plugin-loading options, as described in Section 5.5.1, “Installing and Uninstalling Plugins”. For example, `--validate-password=FORCE_PLUS_PERMANENT` tells the server to load the plugin at startup and prevents it from being removed while the server is running.

  This option is available only if the `validate_password` plugin has been previously registered with `INSTALL PLUGIN` or is loaded with `--plugin-load-add`. See Section 6.4.3.1, “Password Validation Plugin Installation”.

##### Password Validation Plugin System Variables

If the `validate_password` plugin is enabled, it exposes several system variables that enable configuration of password checking:

```sql
mysql> SHOW VARIABLES LIKE 'validate_password%';
+--------------------------------------+--------+
| Variable_name                        | Value  |
+--------------------------------------+--------+
| validate_password_check_user_name    | OFF    |
| validate_password_dictionary_file    |        |
| validate_password_length             | 8      |
| validate_password_mixed_case_count   | 1      |
| validate_password_number_count       | 1      |
| validate_password_policy             | MEDIUM |
| validate_password_special_char_count | 1      |
+--------------------------------------+--------+
```

To change how passwords are checked, you can set these system variables at server startup or at runtime. The following list describes the meaning of each variable.

* `validate_password_check_user_name`

  <table frame="box" rules="all" summary="Properties for validate_password_check_user_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password-check-user-name[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.15</td> </tr><tr><th>System Variable</th> <td><code>validate_password_check_user_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Whether `validate_password` compares passwords to the user name part of the effective user account for the current session and rejects them if they match. This variable is unavailable unless `validate_password` is installed.

  By default, `validate_password_check_user_name` is disabled. This variable controls user name matching independent of the value of `validate_password_policy`.

  When `validate_password_check_user_name` is enabled, it has these effects:

  + Checking occurs in all contexts for which `validate_password` is invoked, which includes use of statements such as `ALTER USER` or `SET PASSWORD` to change the current user's password, and invocation of functions such as `PASSWORD()` and `VALIDATE_PASSWORD_STRENGTH()`.

  + The user names used for comparison are taken from the values of the `USER()` and `CURRENT_USER()` functions for the current session. An implication is that a user who has sufficient privileges to set another user's password can set the password to that user's name, and cannot set that user' password to the name of the user executing the statement. For example, `'root'@'localhost'` can set the password for `'jeffrey'@'localhost'` to `'jeffrey'`, but cannot set the password to `'root`.

  + Only the user name part of the `USER()` and `CURRENT_USER()` function values is used, not the host name part. If a user name is empty, no comparison occurs.

  + If a password is the same as the user name or its reverse, a match occurs and the password is rejected.

  + User-name matching is case-sensitive. The password and user name values are compared as binary strings on a byte-by-byte basis.

  + If a password matches the user name, `VALIDATE_PASSWORD_STRENGTH()` returns 0 regardless of how other `validate_password` system variables are set.

* `validate_password_dictionary_file`

  <table frame="box" rules="all" summary="Properties for validate_password_dictionary_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password-dictionary-file=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password_dictionary_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  The path name of the dictionary file that `validate_password` uses for checking passwords. This variable is unavailable unless `validate_password` is installed.

  By default, this variable has an empty value and dictionary checks are not performed. For dictionary checks to occur, the variable value must be nonempty. If the file is named as a relative path, it is interpreted relative to the server data directory. File contents should be lowercase, one word per line. Contents are treated as having a character set of `utf8`. The maximum permitted file size is 1MB.

  For the dictionary file to be used during password checking, the password policy must be set to 2 (`STRONG`); see the description of the `validate_password_policy` system variable. Assuming that is true, each substring of the password of length 4 up to 100 is compared to the words in the dictionary file. Any match causes the password to be rejected. Comparisons are not case-sensitive.

  For `VALIDATE_PASSWORD_STRENGTH()`, the password is checked against all policies, including `STRONG`, so the strength assessment includes the dictionary check regardless of the `validate_password_policy` value.

  `validate_password_dictionary_file` can be set at runtime and assigning a value causes the named file to be read without a server restart.

* `validate_password_length`

  <table frame="box" rules="all" summary="Properties for validate_password_length"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password-length=#</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password_length</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>8</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr></tbody></table>

  The minimum number of characters that `validate_password` requires passwords to have. This variable is unavailable unless `validate_password` is installed.

  The `validate_password_length` minimum value is a function of several other related system variables. The value cannot be set less than the value of this expression:

  ```sql
  validate_password_number_count
  + validate_password_special_char_count
  + (2 * validate_password_mixed_case_count)
  ```

  If `validate_password` adjusts the value of `validate_password_length` due to the preceding constraint, it writes a message to the error log.

* `validate_password_mixed_case_count`

  <table frame="box" rules="all" summary="Properties for validate_password_mixed_case_count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password-mixed-case-count=#</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password_mixed_case_count</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr></tbody></table>

  The minimum number of lowercase and uppercase characters that `validate_password` requires passwords to have if the password policy is `MEDIUM` or stronger. This variable is unavailable unless `validate_password` is installed.

  For a given `validate_password_mixed_case_count` value, the password must have that many lowercase characters, and that many uppercase characters.

* `validate_password_number_count`

  <table frame="box" rules="all" summary="Properties for validate_password_number_count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password-number-count=#</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password_number_count</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr></tbody></table>

  The minimum number of numeric (digit) characters that `validate_password` requires passwords to have if the password policy is `MEDIUM` or stronger. This variable is unavailable unless `validate_password` is installed.

* `validate_password_policy`

  <table frame="box" rules="all" summary="Properties for validate_password_policy"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password-policy=value</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password_policy</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Valid Values</th> <td><code>0</code><code>1</code><code>2</code></td> </tr></tbody></table>

  The password policy enforced by `validate_password`. This variable is unavailable unless `validate_password` is installed.

  `validate_password_policy` affects how `validate_password` uses its other policy-setting system variables, except for checking passwords against user names, which is controlled independently by `validate_password_check_user_name`.

  The `validate_password_policy` value can be specified using numeric values 0, 1, 2, or the corresponding symbolic values `LOW`, `MEDIUM`, `STRONG`. The following table describes the tests performed for each policy. For the length test, the required length is the value of the `validate_password_length` system variable. Similarly, the required values for the other tests are given by other `validate_password_xxx` variables.

  <table summary="Password policies enforced by the validate_password plugin and the tests performed for each policy."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Policy</th> <th>Tests Performed</th> </tr></thead><tbody><tr> <td><code>0</code> or <code>LOW</code></td> <td>Length</td> </tr><tr> <td><code>1</code> or <code>MEDIUM</code></td> <td>Length; numeric, lowercase/uppercase, and special characters</td> </tr><tr> <td><code>2</code> or <code>STRONG</code></td> <td>Length; numeric, lowercase/uppercase, and special characters; dictionary file</td> </tr></tbody></table>

* `validate_password_special_char_count`

  <table frame="box" rules="all" summary="Properties for validate_password_special_char_count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password-special-char-count=#</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password_special_char_count</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr></tbody></table>

  The minimum number of nonalphanumeric characters that `validate_password` requires passwords to have if the password policy is `MEDIUM` or stronger. This variable is unavailable unless `validate_password` is installed.

##### Password Validation Plugin Status Variables

If the `validate_password` plugin is enabled, it exposes status variables that provide operational information:

```sql
mysql> SHOW STATUS LIKE 'validate_password%';
+-----------------------------------------------+---------------------+
| Variable_name                                 | Value               |
+-----------------------------------------------+---------------------+
| validate_password.dictionary_file_last_parsed | 2019-10-03 08:33:49 |
| validate_password_dictionary_file_words_count | 1902                |
+-----------------------------------------------+---------------------+
```

The following list describes the meaning of each status variable.

* `validate_password_dictionary_file_last_parsed`

  When the dictionary file was last parsed.

* `validate_password_dictionary_file_words_count`

  The number of words read from the dictionary file.


### 6.4.4 The MySQL Keyring

MySQL Server supports a keyring that enables internal server components and plugins to securely store sensitive information for later retrieval. The implementation comprises these elements:

* Keyring plugins that manage a backing store or communicate with a storage back end. These keyring plugins are available:

  + `keyring_file`: Stores keyring data in a file local to the server host. Available in MySQL Community Edition and MySQL Enterprise Edition distributions as of MySQL 5.7.11. See Section 6.4.4.2, “Using the keyring\_file File-Based Keyring Plugin”.

  + `keyring_encrypted_file`: Stores keyring data in an encrypted, password-protected file local to the server host. Available in MySQL Enterprise Edition distributions as of MySQL 5.7.21. See Section 6.4.4.3, “Using the keyring\_encrypted\_file Encrypted File-Based Keyring Plugin”.

  + `keyring_okv`: A KMIP 1.1 plugin for use with KMIP-compatible back end keyring storage products such as Oracle Key Vault and Gemalto SafeNet KeySecure Appliance. Available in MySQL Enterprise Edition distributions as of MySQL 5.7.12. See Section 6.4.4.4, “Using the keyring\_okv KMIP Plugin”.

  + `keyring_aws`: Communicates with the Amazon Web Services Key Management Service for key generation and uses a local file for key storage. Available in MySQL Enterprise Edition distributions as of MySQL 5.7.19. See Section 6.4.4.5, “Using the keyring\_aws Amazon Web Services Keyring Plugin”.

* A keyring service interface for keyring key management (MySQL 5.7.13 and higher). This service is accessible at two levels:

  + SQL interface: In SQL statements, call the functions described in Section 6.4.4.8, “General-Purpose Keyring Key-Management Functions”.

  + C interface: In C-language code, call the keyring service functions described in Section 5.5.6.2, “The Keyring Service”.

* A key migration capability. MySQL 5.7.21 and higher supports migration of keys between keystores, enabling DBAs to switch a MySQL installation from one keystore to another. See Section 6.4.4.7, “Migrating Keys Between Keyring Keystores”.

Warning

For encryption key management, the `keyring_file` and `keyring_encrypted_file` plugins are not intended as a regulatory compliance solution. Security standards such as PCI, FIPS, and others require use of key management systems to secure, manage, and protect encryption keys in key vaults or hardware security modules (HSMs).

Within MySQL, keyring service consumers include:

* The `InnoDB` storage engine uses the keyring to store its key for tablespace encryption. See Section 14.14, “InnoDB Data-at-Rest Encryption”.

* MySQL Enterprise Audit uses the keyring to store the audit log file encryption password. See Encrypting Audit Log Files.

For general keyring installation instructions, see Section 6.4.4.1, “Keyring Plugin Installation”. For installation and configuration information specific to a given keyring plugin, see the section describing that plugin.

For information about using the keyring functions, see Section 6.4.4.8, “General-Purpose Keyring Key-Management Functions”.

Keyring plugins and functions access a keyring service that provides the interface to the keyring. For information about accessing this service and writing keyring plugins, see Section 5.5.6.2, “The Keyring Service”, and Writing Keyring Plugins.


#### 6.4.4.1 Keyring Plugin Installation

Keyring service consumers require that a keyring plugin be installed. This section describes how to install the keyring plugin of your choosing. Also, for general information about installing plugins, see Section 5.5.1, “Installing and Uninstalling Plugins”.

If you intend to use keyring functions in conjunction with the chosen keyring plugin, install the functions after installing that plugin, using the instructions in Section 6.4.4.8, “General-Purpose Keyring Key-Management Functions”.

Note

Only one keyring plugin should be enabled at a time. Enabling multiple keyring plugins is unsupported and results may not be as anticipated.

MySQL provides these keyring plugin choices:

* `keyring_file`: Stores keyring data in a file local to the server host. Available in MySQL Community Edition and MySQL Enterprise Edition distributions.

* `keyring_encrypted_file`: Stores keyring data in an encrypted, password-protected file local to the server host. Available in MySQL Enterprise Edition distributions.

* `keyring_okv`: A KMIP 1.1 plugin for use with KMIP-compatible back end keyring storage products such as Oracle Key Vault and Gemalto SafeNet KeySecure Appliance. Available in MySQL Enterprise Edition distributions.

* `keyring_aws`: Communicates with the Amazon Web Services Key Management Service as a back end for key generation and uses a local file for key storage. Available in MySQL Enterprise Edition distributions.

To be usable by the server, the plugin library file must be located in the MySQL plugin directory (the directory named by the `plugin_dir` system variable). If necessary, configure the plugin directory location by setting the value of `plugin_dir` at server startup.

The keyring plugin must be loaded early during the server startup sequence so that components can access it as necessary during their own initialization. For example, the `InnoDB` storage engine uses the keyring for tablespace encryption, so the keyring plugin must be loaded and available prior to `InnoDB` initialization.

Installation for each keyring plugin is similar. The following instructions describe how to install `keyring_file`. To use a different keyring plugin, substitute its name for `keyring_file`.

The `keyring_file` plugin library file base name is `keyring_file`. The file name suffix differs per platform (for example, `.so` for Unix and Unix-like systems, `.dll` for Windows).

To load the plugin, use the `--early-plugin-load` option to name the plugin library file that contains it. For example, on platforms where the plugin library file suffix is `.so`, use these lines in the server `my.cnf` file, adjusting the `.so` suffix for your platform as necessary:

```sql
[mysqld]
early-plugin-load=keyring_file.so
```

Important

In MySQL 5.7.11, the default `--early-plugin-load` value is the name of the `keyring_file` plugin library file, causing that plugin to be loaded by default. In MySQL 5.7.12 and higher, the default `--early-plugin-load` value is empty; to load the `keyring_file` plugin, you must explicitly specify the option with a value naming the `keyring_file` plugin library file.

`InnoDB` tablespace encryption requires that the keyring plugin to be used be loaded prior to `InnoDB` initialization, so this change of default `--early-plugin-load` value introduces an incompatibility for upgrades from 5.7.11 to 5.7.12 or higher. Administrators who have encrypted `InnoDB` tablespaces must take explicit action to ensure continued loading of the keyring plugin: Start the server with an `--early-plugin-load` option that names the plugin library file.

Before starting the server, check the notes for your chosen keyring plugin for configuration instructions specific to that plugin:

* `keyring_file`: Section 6.4.4.2, “Using the keyring\_file File-Based Keyring Plugin”.

* `keyring_encrypted_file`: Section 6.4.4.3, “Using the keyring\_encrypted\_file Encrypted File-Based Keyring Plugin”.

* `keyring_okv`: Section 6.4.4.4, “Using the keyring\_okv KMIP Plugin”.

* `keyring_aws`: Section 6.4.4.5, “Using the keyring\_aws Amazon Web Services Keyring Plugin”

After performing any plugin-specific configuration, start the server. Verify plugin installation by examining the Information Schema `PLUGINS` table or use the `SHOW PLUGINS` statement (see Section 5.5.2, “Obtaining Server Plugin Information”). For example:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE 'keyring%';
+--------------+---------------+
| PLUGIN_NAME  | PLUGIN_STATUS |
+--------------+---------------+
| keyring_file | ACTIVE        |
+--------------+---------------+
```

If the plugin fails to initialize, check the server error log for diagnostic messages.

Plugins can be loaded by methods other than `--early-plugin-load`, such as the `--plugin-load` or `--plugin-load-add` option or the `INSTALL PLUGIN` statement. However, keyring plugins loaded using those methods may be available too late in the server startup sequence for certain components that use the keyring, such as `InnoDB`:

* Plugin loading using `--plugin-load` or `--plugin-load-add` occurs after `InnoDB` initialization.

* Plugins installed using `INSTALL PLUGIN` are registered in the `mysql.plugin` system table and loaded automatically for subsequent server restarts. However, because `mysql.plugin` is an `InnoDB` table, any plugins named in it can be loaded during startup only after `InnoDB` initialization.

If no keyring plugin is available when a component tries to access the keyring service, the service cannot be used by that component. As a result, the component may fail to initialize or may initialize with limited functionality. For example, if `InnoDB` finds that there are encrypted tablespaces when it initializes, it attempts to access the keyring. If the keyring is unavailable, `InnoDB` can access only unencrypted tablespaces. To ensure that `InnoDB` can access encrypted tablespaces as well, use `--early-plugin-load` to load the keyring plugin.


#### 6.4.4.2 Using the keyring\_file File-Based Keyring Plugin

The `keyring_file` keyring plugin stores keyring data in a file local to the server host.

Warning

For encryption key management, the `keyring_file` plugin is not intended as a regulatory compliance solution. Security standards such as PCI, FIPS, and others require use of key management systems to secure, manage, and protect encryption keys in key vaults or hardware security modules (HSMs).

To install `keyring_file`, use the general instructions found in Section 6.4.4.1, “Keyring Plugin Installation”, together with the configuration information specific to `keyring_file` found here.

To be usable during the server startup process, `keyring_file` must be loaded using the `--early-plugin-load` option. The `keyring_file_data` system variable optionally configures the location of the file used by the `keyring_file` plugin for data storage. The default value is platform specific. To configure the file location explicitly, set the variable value at startup. For example, use these lines in the server `my.cnf` file, adjusting the `.so` suffix and file location for your platform as necessary:

```sql
[mysqld]
early-plugin-load=keyring_file.so
keyring_file_data=/usr/local/mysql/mysql-keyring/keyring
```

If `keyring_file_data` is set to a new location, the keyring plugin creates a new, empty file containing no keys; this means that any existing encrypted tables can no longer be accessed.

Keyring operations are transactional: The `keyring_file` plugin uses a backup file during write operations to ensure that it can roll back to the original file if an operation fails. The backup file has the same name as the value of the `keyring_file_data` system variable with a suffix of `.backup`.

For additional information about `keyring_file_data`, see Section 6.4.4.12, “Keyring System Variables”.

As of MySQL 5.7.17, to ensure that keys are flushed only when the correct keyring storage file exists, `keyring_file` stores a SHA-256 checksum of the keyring in the file. Before updating the file, the plugin verifies that it contains the expected checksum.

The `keyring_file` plugin supports the functions that comprise the standard MySQL Keyring service interface. Keyring operations performed by those functions are accessible at two levels:

* SQL interface: In SQL statements, call the functions described in Section 6.4.4.8, “General-Purpose Keyring Key-Management Functions”.

* C interface: In C-language code, call the keyring service functions described in Section 5.5.6.2, “The Keyring Service”.

Example (using the SQL interface):

```sql
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

For information about the characteristics of key values permitted by `keyring_file`, see Section 6.4.4.6, “Supported Keyring Key Types and Lengths”.


#### 6.4.4.3 Using the keyring\_encrypted\_file Encrypted File-Based Keyring Plugin

Note

The `keyring_encrypted_file` plugin is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

The `keyring_encrypted_file` keyring plugin stores keyring data in an encrypted, password-protected file local to the server host. A password must be specified for the file. This plugin is available as of MySQL 5.7.21.

Warning

For encryption key management, the `keyring_encrypted_file` plugin is not intended as a regulatory compliance solution. Security standards such as PCI, FIPS, and others require use of key management systems to secure, manage, and protect encryption keys in key vaults or hardware security modules (HSMs).

To install `keyring_encrypted_file`, use the general instructions found in Section 6.4.4.1, “Keyring Plugin Installation”, together with the configuration information specific to `keyring_encrypted_file` found here.

To be usable during the server startup process, `keyring_encrypted_file` must be loaded using the `--early-plugin-load` option. To specify the password for encrypting the keyring data file, set the `keyring_encrypted_file_password` system variable. (The password is mandatory; if not specified at server startup, `keyring_encrypted_file` initialization fails.) The `keyring_encrypted_file_data` system variable optionally configures the location of the file used by the `keyring_encrypted_file` plugin for data storage. The default value is platform specific. To configure the file location explicitly, set the variable value at startup. For example, use these lines in the server `my.cnf` file, adjusting the `.so` suffix and file location for your platform as necessary and substituting your chosen password:

```sql
[mysqld]
early-plugin-load=keyring_encrypted_file.so
keyring_encrypted_file_data=/usr/local/mysql/mysql-keyring/keyring-encrypted
keyring_encrypted_file_password=password
```

Because the `my.cnf` file stores a password when written as shown, it should have a restrictive mode and be accessible only to the account used to run the MySQL server.

Keyring operations are transactional: The `keyring_encrypted_file` plugin uses a backup file during write operations to ensure that it can roll back to the original file if an operation fails. The backup file has the same name as the value of the `keyring_encrypted_file_data` system variable with a suffix of `.backup`.

For additional information about the system variables used to configure the `keyring_encrypted_file` plugin, see Section 6.4.4.12, “Keyring System Variables”.

To ensure that keys are flushed only when the correct keyring storage file exists, `keyring_encrypted_file` stores a SHA-256 checksum of the keyring in the file. Before updating the file, the plugin verifies that it contains the expected checksum. In addition, `keyring_encrypted_file` encrypts file contents using AES before writing the file, and decrypts file contents after reading the file.

The `keyring_encrypted_file` plugin supports the functions that comprise the standard MySQL Keyring service interface. Keyring operations performed by those functions are accessible at two levels:

* SQL interface: In SQL statements, call the functions described in Section 6.4.4.8, “General-Purpose Keyring Key-Management Functions”.

* C interface: In C-language code, call the keyring service functions described in Section 5.5.6.2, “The Keyring Service”.

Example (using the SQL interface):

```sql
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

For information about the characteristics of key values permitted by `keyring_encrypted_file`, see Section 6.4.4.6, “Supported Keyring Key Types and Lengths”.


#### 6.4.4.4 Using the keyring_okv KMIP Plugin

Note

The `keyring_okv` plugin is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

The Key Management Interoperability Protocol (KMIP) enables communication of cryptographic keys between a key management server and its clients. The `keyring_okv` keyring plugin uses the KMIP 1.1 protocol to communicate securely as a client of a KMIP back end. Keyring material is generated exclusively by the back end, not by `keyring_okv`. The plugin works with these KMIP-compatible products:

* Oracle Key Vault
* Gemalto SafeNet KeySecure Appliance
* Townsend Alliance Key Manager

Each MySQL Server instance must be registered separately as a client for KMIP. If two or more MySQL Server instances use the same set of credentials, they can interfere with each other’s functioning.

The `keyring_okv` plugin supports the functions that comprise the standard MySQL Keyring service interface. Keyring operations performed by those functions are accessible at two levels:

* SQL interface: In SQL statements, call the functions described in Section 6.4.4.8, “General-Purpose Keyring Key-Management Functions”.

* C interface: In C-language code, call the keyring service functions described in Section 5.5.6.2, “The Keyring Service”.

Example (using the SQL interface):

```sql
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

For information about the characteristics of key values permitted by `keyring_okv`, Section 6.4.4.6, “Supported Keyring Key Types and Lengths”.

To install `keyring_okv`, use the general instructions found in Section 6.4.4.1, “Keyring Plugin Installation”, together with the configuration information specific to `keyring_okv` found here.

* General keyring\_okv Configuration
* Configuring keyring\_okv for Oracle Key Vault
* Configuring keyring\_okv for Gemalto SafeNet KeySecure Appliance
* Configuring keyring\_okv for Townsend Alliance Key Manager
* Password-Protecting the keyring\_okv Key File

##### General keyring\_okv Configuration

Regardless of which KMIP back end the `keyring_okv` plugin uses for keyring storage, the `keyring_okv_conf_dir` system variable configures the location of the directory used by `keyring_okv` for its support files. The default value is empty, so you must set the variable to name a properly configured directory before the plugin can communicate with the KMIP back end. Unless you do so, `keyring_okv` writes a message to the error log during server startup that it cannot communicate:

```sql
[Warning] Plugin keyring_okv reported: 'For keyring_okv to be
initialized, please point the keyring_okv_conf_dir variable to a directory
containing Oracle Key Vault configuration file and ssl materials'
```

The `keyring_okv_conf_dir` variable must name a directory that contains the following items:

* `okvclient.ora`: A file that contains details of the KMIP back end with which `keyring_okv` communicates.

* `ssl`: A directory that contains the certificate and key files required to establish a secure connection with the KMIP back end: `CA.pem`, `cert.pem`, and `key.pem`. As of MySQL 5.7.20, if the key file is password-protected, the `ssl` directory can contain a single-line text file named `password.txt` containing the password needed to decrypt the key file.

Both the `okvclient.ora` file and `ssl` directory with the certificate and key files are required for `keyring_okv` to work properly. The procedure used to populate the configuration directory with these files depends on the KMIP back end used with `keyring_okv`, as described elsewhere.

The configuration directory used by `keyring_okv` as the location for its support files should have a restrictive mode and be accessible only to the account used to run the MySQL server. For example, on Unix and Unix-like systems, to use the `/usr/local/mysql/mysql-keyring-okv` directory, the following commands (executed as `root`) create the directory and set its mode and ownership:

```sql
cd /usr/local/mysql
mkdir mysql-keyring-okv
chmod 750 mysql-keyring-okv
chown mysql mysql-keyring-okv
chgrp mysql mysql-keyring-okv
```

To be usable during the server startup process, `keyring_okv` must be loaded using the `--early-plugin-load` option. Also, set the `keyring_okv_conf_dir` system variable to tell `keyring_okv` where to find its configuration directory. For example, use these lines in the server `my.cnf` file, adjusting the `.so` suffix and directory location for your platform as necessary:

```sql
[mysqld]
early-plugin-load=keyring_okv.so
keyring_okv_conf_dir=/usr/local/mysql/mysql-keyring-okv
```

For additional information about `keyring_okv_conf_dir`, see Section 6.4.4.12, “Keyring System Variables”.

##### Configuring keyring\_okv for Oracle Key Vault

The discussion here assumes that you are familiar with Oracle Key Vault. Some pertinent information sources:

* Oracle Key Vault site

* Oracle Key Vault documentation

In Oracle Key Vault terminology, clients that use Oracle Key Vault to store and retrieve security objects are called endpoints. To communicate with Oracle Key Vault, it is necessary to register as an endpoint and enroll by downloading and installing endpoint support files. Note that you must register a separate endpoint for each MySQL Server instance. If two or more MySQL Server instances use the same endpoint, they can interfere with each other’s functioning.

The following procedure briefly summarizes the process of setting up `keyring_okv` for use with Oracle Key Vault:

1. Create the configuration directory for the `keyring_okv` plugin to use.

2. Register an endpoint with Oracle Key Vault to obtain an enrollment token.

3. Use the enrollment token to obtain the `okvclient.jar` client software download.

4. Install the client software to populate the `keyring_okv` configuration directory that contains the Oracle Key Vault support files.

Use the following procedure to configure `keyring_okv` and Oracle Key Vault to work together. This description only summarizes how to interact with Oracle Key Vault. For details, visit the Oracle Key Vault site and consult the *Oracle Key Vault Administrator's Guide*.

1. Create the configuration directory that contains the Oracle Key Vault support files, and make sure that the `keyring_okv_conf_dir` system variable is set to name that directory (for details, see General keyring\_okv Configuration).

2. Log in to the Oracle Key Vault management console as a user who has the System Administrator role.

3. Select the Endpoints tab to arrive at the Endpoints page. On the Endpoints page, click Add.

4. Provide the required endpoint information and click Register. The endpoint type should be Other. Successful registration results in an enrollment token.

5. Log out from the Oracle Key Vault server.
6. Connect again to the Oracle Key Vault server, this time without logging in. Use the endpoint enrollment token to enroll and request the `okvclient.jar` software download. Save this file to your system.

7. Install the `okvclient.jar` file using the following command (you must have JDK 1.4 or higher):

   ```sql
   java -jar okvclient.jar -d dir_name [-v]
   ```

   The directory name following the `-d` option is the location in which to install extracted files. The `-v` option, if given, causes log information to be produced that may be useful if the command fails.

   When the command asks for an Oracle Key Vault endpoint password, do not provide one. Instead, press **Enter**. (The result is that no password is required when the endpoint connects to Oracle Key Vault.)

   The preceding command produces an `okvclient.ora` file, which should be in this location under the directory named by the `-d` option in the preceding **java -jar** command:

   ```sql
   install_dir/conf/okvclient.ora
   ```

   The expected file contents include lines that look like this:

   ```sql
   SERVER=host_ip:port_num
   STANDBY_SERVER=host_ip:port_num
   ```

   Note

   If the existing file is not in this format, then create a new file with the lines shown in the previous example. Also, consider backing up the `okvclient.ora` file before you run the **okvutil** command. Restore the file as needed.

   The `keyring_okv` plugin attempts to communicate with the server running on the host named by the `SERVER` variable and falls back to `STANDBY_SERVER` if that fails:

   * For the `SERVER` variable, a setting in the `okvclient.ora` file is mandatory.

   * For the `STANDBY_SERVER` variable, a setting in the `okvclient.ora` file is optional, as of MySQL 5.7.19. Prior to MySQL 5.7.19, a setting for `STANDBY_SERVER` is mandatory; if `okvclient.ora` is generated with no setting for `STANDBY_SERVER`, `keyring_okv` fails to initialize. The workaround is to check `oraclient.ora` and add a “dummy” setting for `STANDBY_SERVER`, if one is missing. For example:

     ```sql
     STANDBY_SERVER=127.0.0.1:5696
     ```

8. Go to the Oracle Key Vault installer directory and test the setup by running this command:

   ```sql
   okvutil/bin/okvutil list
   ```

   The output should look something like this:

   ```sql
   Unique ID                               Type            Identifier
   255AB8DE-C97F-482C-E053-0100007F28B9	Symmetric Key	-
   264BF6E0-A20E-7C42-E053-0100007FB29C	Symmetric Key	-
   ```

   For a fresh Oracle Key Vault server (a server without any key in it), the output looks like this instead, to indicate that there are no keys in the vault:

   ```sql
   no objects found
   ```

9. Use this command to extract the `ssl` directory containing SSL materials from the `okvclient.jar` file:

   ```sql
   jar xf okvclient.jar ssl
   ```

10. Copy the Oracle Key Vault support files (the `okvclient.ora` file and the `ssl` directory) into the configuration directory.

11. (Optional) If you wish to password-protect the key file, use the instructions in Password-Protecting the keyring\_okv Key File.

After completing the preceding procedure, restart the MySQL server. It loads the `keyring_okv` plugin and `keyring_okv` uses the files in its configuration directory to communicate with Oracle Key Vault.

##### Configuring keyring\_okv for Gemalto SafeNet KeySecure Appliance

Gemalto SafeNet KeySecure Appliance uses the KMIP protocol (version 1.1 or 1.2). As of MySQL 5.7.18, the `keyring_okv` keyring plugin (which supports KMIP 1.1) can use KeySecure as its KMIP back end for keyring storage.

Use the following procedure to configure `keyring_okv` and KeySecure to work together. The description only summarizes how to interact with KeySecure. For details, consult the section named Add a KMIP Server in the [KeySecure User Guide](https://www2.gemalto.com/aws-marketplace/usage/vks/uploadedFiles/Support_and_Downloads/AWS/007-012362-001-keysecure-appliance-user-guide-v7.1.0.pdf).

1. Create the configuration directory that contains the KeySecure support files, and make sure that the `keyring_okv_conf_dir` system variable is set to name that directory (for details, see General keyring\_okv Configuration).

2. In the configuration directory, create a subdirectory named `ssl` to use for storing the required SSL certificate and key files.

3. In the configuration directory, create a file named `okvclient.ora`. It should have following format:

   ```sql
   SERVER=host_ip:port_num
   STANDBY_SERVER=host_ip:port_num
   ```

   For example, if KeySecure is running on host 198.51.100.20 and listening on port 9002, the `okvclient.ora` file looks like this:

   ```sql
   SERVER=198.51.100.20:9002
   STANDBY_SERVER=198.51.100.20:9002
   ```

4. Connect to the KeySecure Management Console as an administrator with credentials for Certificate Authorities access.

5. Navigate to Security >> Local CAs and create a local certificate authority (CA).

6. Go to Trusted CA Lists. Select Default and click on Properties. Then select Edit for Trusted Certificate Authority List and add the CA just created.

7. Download the CA and save it in the `ssl` directory as a file named `CA.pem`.

8. Navigate to Security >> Certificate Requests and create a certificate. Then you can download a compressed **tar** file containing certificate PEM files.

9. Extract the PEM files from in the downloaded file. For example, if the file name is `csr_w_pk_pkcs8.gz`, decompress and unpack it using this command:

   ```sql
   tar zxvf csr_w_pk_pkcs8.gz
   ```

   Two files result from the extraction operation: `certificate_request.pem` and `private_key_pkcs8.pem`.

10. Use this **openssl** command to decrypt the private key and create a file named `key.pem`:

    ```sql
    openssl pkcs8 -in private_key_pkcs8.pem -out key.pem
    ```

11. Copy the `key.pem` file into the `ssl` directory.

12. Copy the certificate request in `certificate_request.pem` into the clipboard.

13. Navigate to Security >> Local CAs. Select the same CA that you created earlier (the one you downloaded to create the `CA.pem` file), and click Sign Request. Paste the Certificate Request from the clipboard, choose a certificate purpose of Client (the keyring is a client of KeySecure), and click Sign Request. The result is a certificate signed with the selected CA in a new page.

14. Copy the signed certificate to the clipboard, then save the clipboard contents as a file named `cert.pem` in the `ssl` directory.

15. (Optional) If you wish to password-protect the key file, use the instructions in Password-Protecting the keyring\_okv Key File.

After completing the preceding procedure, restart the MySQL server. It loads the `keyring_okv` plugin and `keyring_okv` uses the files in its configuration directory to communicate with KeySecure.

##### Configuring keyring\_okv for Townsend Alliance Key Manager

Townsend Alliance Key Manager uses the KMIP protocol. The `keyring_okv` keyring plugin can use Alliance Key Manager as its KMIP back end for keyring storage. For additional information, see [Alliance Key Manager for MySQL](https://www.townsendsecurity.com/product/encryption-key-management-mysql).

##### Password-Protecting the keyring\_okv Key File

As of MySQL 5.7.20, you can optionally protect the key file with a password and supply a file containing the password to enable the key file to be decrypted. To so do, change location to the `ssl` directory and perform these steps:

1. Encrypt the `key.pem` key file. For example, use a command like this, and enter the encryption password at the prompts:

   ```sql
   $> openssl rsa -des3 -in key.pem -out key.pem.new
   Enter PEM pass phrase:
   Verifying - Enter PEM pass phrase:
   ```

2. Save the encryption password in a single-line text file named `password.txt` in the `ssl` directory.

3. Verify that the encrypted key file can be decrypted using the following command. The decrypted file should display on the console:

   ```sql
   $> openssl rsa -in key.pem.new -passin file:password.txt
   ```

4. Remove the original `key.pem` file and rename `key.pem.new` to `key.pem`.

5. Change the ownership and access mode of new `key.pem` file and `password.txt` file as necessary to ensure that they have the same restrictions as other files in the `ssl` directory.


#### 6.4.4.5 Using the keyring\_aws Amazon Web Services Keyring Plugin

Note

The `keyring_aws` plugin is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

The `keyring_aws` keyring plugin communicates with the Amazon Web Services Key Management Service (AWS KMS) as a back end for key generation and uses a local file for key storage. All keyring material is generated exclusively by the AWS server, not by `keyring_aws`.

MySQL Enterprise Edition can work with `keyring_aws` on Red Hat Enterprise Linux, SUSE Linux Enterprise Server, Debian, Ubuntu, macOS, and Windows. MySQL Enterprise Edition does not support the use of `keyring_aws` on these platforms:

* EL6
* Generic Linux (glibc2.12)
* Solaris

The discussion here assumes that you are familiar with AWS in general and KMS in particular. Some pertinent information sources:

* [AWS site](https://aws.amazon.com/kms/)
* [KMS documentation](https://docs.aws.amazon.com/kms/)

The following sections provide configuration and usage information for the `keyring_aws` keyring plugin:

* keyring\_aws Configuration
* keyring\_aws Operation
* keyring\_aws Credential Changes

##### keyring\_aws Configuration

To install `keyring_aws`, use the general instructions found in Section 6.4.4.1, “Keyring Plugin Installation”, together with the plugin-specific configuration information found here.

The plugin library file contains the `keyring_aws` plugin and two loadable functions, `keyring_aws_rotate_cmk()` and `keyring_aws_rotate_keys()`.

To configure `keyring_aws`, you must obtain a secret access key that provides credentials for communicating with AWS KMS and write it to a configuration file:

1. Create an AWS KMS account.
2. Use AWS KMS to create a secret access key ID and secret access key. The access key serves to verify your identity and that of your applications.

3. Use the AWS KMS account to create a customer master key (CMK) ID. At MySQL startup, set the `keyring_aws_cmk_id` system variable to the CMK ID value. This variable is mandatory and there is no default. (Its value can be changed at runtime if desired using `SET GLOBAL`.)

4. If necessary, create the directory in which the configuration file should be located. The directory should have a restrictive mode and be accessible only to the account used to run the MySQL server. For example, on many Unix and Unix-like systems, such as Oracle Enterprise Linux, to use `/usr/local/mysql/mysql-keyring/keyring_aws_conf` as the file name, the following commands (executed as `root`) create its parent directory and set the directory mode and ownership:

   ```sql
   $> cd /usr/local/mysql
   $> mkdir mysql-keyring
   $> chmod 750 mysql-keyring
   $> chown mysql mysql-keyring
   $> chgrp mysql mysql-keyring
   ```

   At MySQL startup, set the `keyring_aws_conf_file` system variable to `/usr/local/mysql/mysql-keyring/keyring_aws_conf` to indicate the configuration file location to the server.

   The location of the configuration file may vary according to Linux distribution; the directory for this file may also already be provided by a system module or other application such as AppArmor. For example, under AppArmor on recent editions of Ubuntu Linux, the keyring directory is specified as `/var/lib/mysql-keyring`. See [Ubuntu Server: AppArmor](https://documentation.ubuntu.com/server/how-to/security/apparmor/index.html) for more information about using AppArmor on Ubuntu systems; see also [this example MySQL configuration file](https://exampleconfig.com/view/mysql-ubuntu20-04-etc-apparmor-d-usr-sbin-mysqld). For other operating platforms, see the system documentation for guidance.

5. Prepare the `keyring_aws` configuration file, which should contain two lines:

   * Line 1: The secret access key ID
   * Line 2: The secret access key

   For example, if the key ID is `wwwwwwwwwwwwwEXAMPLE` and the key is `xxxxxxxxxxxxx/yyyyyyy/zzzzzzzzEXAMPLEKEY`, the configuration file looks like this:

   ```sql
   wwwwwwwwwwwwwEXAMPLE
   xxxxxxxxxxxxx/yyyyyyy/zzzzzzzzEXAMPLEKEY
   ```

To be usable during the server startup process, `keyring_aws` must be loaded using the `--early-plugin-load` option. The `keyring_aws_cmk_id` system variable is mandatory and configures the customer master key (CMK) ID obtained from the AWS KMS server. The `keyring_aws_conf_file` and `keyring_aws_data_file` system variables optionally configure the locations of the files used by the `keyring_aws` plugin for configuration information and data storage. The file location variable default values are platform specific. To configure the locations explicitly, set the variable values at startup. For example, use these lines in the server `my.cnf` file, adjusting the `.so` suffix and file locations for your platform as necessary:

```sql
[mysqld]
early-plugin-load=keyring_aws.so
keyring_aws_cmk_id='arn:aws:kms:us-west-2:111122223333:key/abcd1234-ef56-ab12-cd34-ef56abcd1234'
keyring_aws_conf_file=/usr/local/mysql/mysql-keyring/keyring_aws_conf
keyring_aws_data_file=/usr/local/mysql/mysql-keyring/keyring_aws_data
```

For the `keyring_aws` plugin to start successfully, the configuration file must exist and contain valid secret access key information, initialized as described previously. The storage file need not exist. If it does not, `keyring_aws` attempts to create it (as well as its parent directory, if necessary).

Important

The default AWS region is `us-east-1`. For any other region, you must also set `keyring_aws_region` explicitly in `my.cnf`.

For additional information about the system variables used to configure the `keyring_aws` plugin, see Section 6.4.4.12, “Keyring System Variables”.

Start the MySQL server and install the functions associated with the `keyring_aws` plugin. This is a one-time operation, performed by executing the following statements, adjusting the `.so` suffix for your platform as necessary:

```sql
CREATE FUNCTION keyring_aws_rotate_cmk RETURNS INTEGER
  SONAME 'keyring_aws.so';
CREATE FUNCTION keyring_aws_rotate_keys RETURNS INTEGER
  SONAME 'keyring_aws.so';
```

For additional information about the `keyring_aws` functions, see Section 6.4.4.9, “Plugin-Specific Keyring Key-Management Functions”.

##### keyring\_aws Operation

At plugin startup, the `keyring_aws` plugin reads the AWS secret access key ID and key from its configuration file. It also reads any encrypted keys contained in its storage file into its in-memory cache.

During operation, `keyring_aws` maintains encrypted keys in the in-memory cache and uses the storage file as local persistent storage. Each keyring operation is transactional: `keyring_aws` either successfully changes both the in-memory key cache and the keyring storage file, or the operation fails and the keyring state remains unchanged.

To ensure that keys are flushed only when the correct keyring storage file exists, `keyring_aws` stores a SHA-256 checksum of the keyring in the file. Before updating the file, the plugin verifies that it contains the expected checksum.

The `keyring_aws` plugin supports the functions that comprise the standard MySQL Keyring service interface. Keyring operations performed by these functions are accessible at two levels:

* SQL interface: In SQL statements, call the functions described in Section 6.4.4.8, “General-Purpose Keyring Key-Management Functions”.

* C interface: In C-language code, call the keyring service functions described in Section 5.5.6.2, “The Keyring Service”.

Example (using the SQL interface):

```sql
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

In addition, the `keyring_aws_rotate_cmk()` and `keyring_aws_rotate_keys()` functions “extend” the keyring plugin interface to provide AWS-related capabilities not covered by the standard keyring service interface. These capabilities are accessible only by calling these functions using SQL. There are no corresponding C-languge key service functions.

For information about the characteristics of key values permitted by `keyring_aws`, see Section 6.4.4.6, “Supported Keyring Key Types and Lengths”.

##### keyring\_aws Credential Changes

Assuming that the `keyring_aws` plugin has initialized properly at server startup, it is possible to change the credentials used for communicating with AWS KMS:

1. Use AWS KMS to create a new secret access key ID and secret access key.

2. Store the new credentials in the configuration file (the file named by the `keyring_aws_conf_file` system variable). The file format is as described previously.

3. Reinitialize the `keyring_aws` plugin so that it re-reads the configuration file. Assuming that the new credentials are valid, the plugin should initialize successfully.

   There are two ways to reinitialize the plugin:

   * Restart the server. This is simpler and has no side effects, but is not suitable for installations that require minimal server downtime with as few restarts as possible.

   * Reinitialize the plugin without restarting the server by executing the following statements, adjusting the `.so` suffix for your platform as necessary:

     ```sql
     UNINSTALL PLUGIN keyring_aws;
     INSTALL PLUGIN keyring_aws SONAME 'keyring_aws.so';
     ```

     Note

     In addition to loading a plugin at runtime, `INSTALL PLUGIN` has the side effect of registering the plugin it in the `mysql.plugin` system table. Because of this, if you decide to stop using `keyring_aws`, it is not sufficient to remove the `--early-plugin-load` option from the set of options used to start the server. That stops the plugin from loading early, but the server still attempts to load it when it gets to the point in the startup sequence where it loads the plugins registered in `mysql.plugin`.

     Consequently, if you execute the `UNINSTALL PLUGIN` plus `INSTALL PLUGIN` sequence just described to change the AWS KMS credentials, then to stop using `keyring_aws`, it is necessary to execute `UNINSTALL PLUGIN` again to unregister the plugin in addition to removing the `--early-plugin-load` option.


#### 6.4.4.6 Supported Keyring Key Types and Lengths

MySQL Keyring supports keys of different types (encryption algorithms) and lengths:

* The available key types depend on which keyring plugin is installed.

* The permitted key lengths are subject to multiple factors:

  + General keyring loadable-function interface limits (for keys managed using one of the keyring functions described in Section 6.4.4.8, “General-Purpose Keyring Key-Management Functions”), or limits from back end implementations. These length limits can vary by key operation type.

  + In addition to the general limits, individual keyring plugins may impose restrictions on key lengths per key type.

Table 6.23, “General Keyring Key Length Limits” shows the general key-length limits. (The lower limits for `keyring_aws` are imposed by the AWS KMS interface, not the keyring functions.) Table 6.24, “Keyring Plugin Key Types and Lengths” shows the key types each keyring plugin permits, as well as any plugin-specific key-length restrictions.

**Table 6.23 General Keyring Key Length Limits**

<table summary="General limits on keyring key lengths."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Key Operation</th> <th>Maximum Key Length</th> </tr></thead><tbody><tr> <td>Generate key</td> <td>2,048 bytes; 1,024 for <code>keyring_aws</code></td> </tr><tr> <td>Store key</td> <td>2,048 bytes</td> </tr><tr> <td>Fetch key</td> <td>2,048 bytes</td> </tr></tbody></table>

**Table 6.24 Keyring Plugin Key Types and Lengths**

<table summary="Key types and lengths supported by keyring plugins.">
  <col style="width: 30%"/>
  <col style="width: 25%"/>
  <col style="width: 45%"/>
  <thead>
    <tr>
      <th>Plugin Name</th>
      <th>Permitted Key Type</th>
      <th>Plugin-Specific Length Restrictions</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th valign="top"><code>keyring_aws</code></th>
      <td>
        <code>AES</code>
      </td>
      <td>
        16, 24, or 32 bytes
      </td>
    </tr>
    <tr>
      <th valign="top"><code>keyring_encrypted_file</code></th>
      <td>
        <code>AES</code>
        <code>DSA</code>
        <code>RSA</code>
      </td>
      <td>
        None
        None
        None
      </td>
    </tr>
    <tr>
      <th valign="top"><code>keyring_file</code></th>
      <td>
        <code>AES</code>
        <code>DSA</code>
        <code>RSA</code>
      </td>
      <td>
        None
        None
        None
      </td>
    </tr>
    <tr>
      <th valign="top"><code>keyring_okv</code></th>
      <td>
        <code>AES</code>
      </td>
      <td>
        16, 24, or 32 bytes
      </td>
    </tr>
  </tbody>
</table>


#### 6.4.4.7 Migrating Keys Between Keyring Keystores

A keyring migration copies keys from one keystore to another, enabling a DBA to switch a MySQL installation to a different keystore. to another. A successful migration operation has this result:

* The destination keystore contains the keys it had prior to the migration, plus the keys from the source keystore.

* The source keystore remains the same before and after the migration (because keys are copied, not moved).

If a key to be copied already exists in the destination keystore, an error occurs and the destination keystore is restored to its premigration state.

The following sections discuss the characteristics of offline and online migrations and describe how to perform migrations.

* Offline and Online Key Migrations
* Key Migration Using a Migration Server
* Key Migration Involving Multiple Running Servers

##### Offline and Online Key Migrations

A key migration is either offline or online:

* Offline migration: For use when you are sure that no running server on the local host is using the source or destination keystore. In this case, the migration operation can copy keys from the source keystore to the destination without the possibility of a running server modifying keystore content during the operation.

* Online migration: For use when a running server on the local host is using the source or destination keystore. In this case, care must be taken to prevent that server from updating keystores during the migration. This involves connecting to the running server and instructing it to pause keyring operations so that keys can be copied safely from the source keystore to the destination. When key copying is complete, the running server is permitted to resume keyring operations.

When you plan a key migration, use these points to decide whether it should be offline or online:

* Do not perform offline migration involving a keystore that is in use by a running server.

* Pausing keyring operations during an online migration is accomplished by connecting to the running server and setting its global `keyring_operations` system variable to `OFF` before key copying and `ON` after key copying. This has several implications:

  + `keyring_operations` was introduced in MySQL 5.7.21, so online migration is possible only if the running server is from MySQL 5.7.21 or higher. If the running server is older, you must stop it, perform an offline migration, and restart it. All migration instructions elsewhere that refer to `keyring_operations` are subject to this condition.

  + The account used to connect to the running server must have the `SUPER` privilege required to modify `keyring_operations`.

  + For an online migration, the migration operation takes care of enabling and disabling `keyring_operations` on the running server. If the migration operation exits abnormally (for example, if it is forcibly terminated), it is possible for `keyring_operations` to remain disabled on the running server, leaving it unable to perform keyring operations. In this case, it may be necessary to connect to the running server and enable `keyring_operations` manually using this statement:

    ```sql
    SET GLOBAL keyring_operations = ON;
    ```

* Online key migration provides for pausing keyring operations on a single running server. To perform a migration if multiple running servers are using the keystores involved, use the procedure described at Key Migration Involving Multiple Running Servers.

##### Key Migration Using a Migration Server

As of MySQL 5.7.21, a MySQL server becomes a migration server if invoked in a special operational mode that supports key migration. A migration server does not accept client connections. Instead, it runs only long enough to migrate keys, then exits. A migration server reports errors to the console (the standard error output).

To perform a key migration operation using a migration server, determine the key migration options required to specify which keyring plugins or components are involved, and whether the migration is offline or online:

* To indicate the source and destination keyring plugins, specify these options:

  + `--keyring-migration-source`: The source keyring plugin that manages the keys to be migrated.

  + `--keyring-migration-destination`: The destination keyring plugin to which the migrated keys are to be copied.

  These options tell the server to run in key migration mode. For key migration operations, both options are mandatory. The source and destination plugins must differ, and the migration server must support both plugins.

* For an offline migration, no additional key migration options are needed.

* For an online migration, some running server currently is using the source or destination keystore. To invoke the migration server, specify additional key migration options that indicate how to connect to the running server. This is necessary so that the migration server can connect to the running server and tell it to pause keyring use during the migration operation.

  Use of any of the following options signifies an online migration:

  + `--keyring-migration-host`: The host where the running server is located. This is always the local host because the migration server can migrate keys only between keystores managed by local plugins.

  + `--keyring-migration-user`, `--keyring-migration-password`: The account credentials to use to connect to the running server.

  + `--keyring-migration-port`: For TCP/IP connections, the port number to connect to on the running server.

  + `--keyring-migration-socket`: For Unix socket file or Windows named pipe connections, the socket file or named pipe to connect to on the running server.

For additional details about the key migration options, see Section 6.4.4.11, “Keyring Command Options”.

Start the migration server with key migration options indicating the source and destination keystores and whether the migration is offline or online, possibly with other options. Keep the following considerations in mind:

* Other server options might be required, such as configuration parameters for the two keyring plugins. For example, if `keyring_file` is the source or destination, you must set the `keyring_file_data` system variable if the keyring data file location is not the default location. Other non-keyring options may be required as well. One way to specify these options is by using `--defaults-file` to name an option file that contains the required options.

* The migration server expects path name option values to be full paths. Relative path names may not be resolved as you expect.

* The user who invokes a server in key-migration mode must not be the `root` operating system user, unless the `--user` option is specified with a non-`root` user name to run the server as that user.

* The user a server in key-migration mode runs as must have permission to read and write any local keyring files, such as the data file for a file-based plugin.

  If you invoke the migration server from a system account different from that normally used to run MySQL, it might create keyring directories or files that are inaccessible to the server during normal operation. Suppose that `mysqld` normally runs as the `mysql` operating system user, but you invoke the migration server while logged in as `isabel`. Any new directories or files created by the migration server are owned by `isabel`. Subsequent startup fails when a server run as the `mysql` operating system user attempts to access file system objects owned by `isabel`.

  To avoid this issue, start the migration server as the `root` operating system user and provide a `--user=user_name` option, where *`user_name`* is the system account normally used to run MySQL. Alternatively, after the migration, examine the keyring-related file system objects and change their ownership and permissions if necessary using **chown**, **chmod**, or similar commands, so that the objects are accessible to the running server.

Example command line for offline migration (enter the command on a single line):

```sql
mysqld --defaults-file=/usr/local/mysql/etc/my.cnf
  --keyring-migration-source=keyring_file.so
  --keyring-migration-destination=keyring_encrypted_file.so
  --keyring_encrypted_file_password=password
```

Example command line for online migration:

```sql
mysqld --defaults-file=/usr/local/mysql/etc/my.cnf
  --keyring-migration-source=keyring_file.so
  --keyring-migration-destination=keyring_encrypted_file.so
  --keyring_encrypted_file_password=password
  --keyring-migration-host=127.0.0.1
  --keyring-migration-user=root
  --keyring-migration-password=root_password
```

The key migration server performs a migration operation as follows:

1. (Online migration only) Connect to the running server using the connection options.

2. (Online migration only) Disable `keyring_operations` on the running server.

3. Load the source and destination keyring plugins.
4. Copy keys from the source keystore to the destination.
5. Unload the keyring plugins.
6. (Online migration only) Enable `keyring_operations` on the running server.

7. (Online migration only) Disconnect from the running server.

If an error occurs during key migration, the destination keystore is restored to its premigration state.

Important

For an online migration operation, the migration server takes care of enabling and disabling `keyring_operations` on the running server. If the migration server exits abnormally (for example, if it is forcibly terminated), it is possible for `keyring_operations` to remain disabled on the running server, leaving it unable to perform keyring operations. In this case, it may be necessary to connect to the running server and enable `keyring_operations` manually using this statement:

```sql
SET GLOBAL keyring_operations = ON;
```

After a successful online key migration operation, the running server might need to be restarted:

* If the running server was using the source keystore before the migration and should continue to use it after the migration, it need not be restarted after the migration.

* If the running server was using the destination keystore before the migration and should continue to use it after the migration, it should be restarted after the migration to load all keys migrated into the destination keystore.

* If the running server was using the source keystore before the migration but should use the destination keystore after the migration, it must be reconfigured to use the destination keystore and restarted. In this case, be aware that although the running server is paused from modifying the source keystore during the migration itself, it is not paused during the interval between the migration and the subsequent restart. Care should be taken that the server does not modify the source keystore during this interval because any such changes will not be reflected in the destination keystore.

##### Key Migration Involving Multiple Running Servers

Online key migration provides for pausing keyring operations on a single running server. To perform a migration if multiple running servers are using the keystores involved, use this procedure:

1. Connect to each running server manually and set `keyring_operations=OFF`. This ensures that no running server is using the source or destination keystore and satisfies the required condition for offline migration.

2. Use a migration server to perform an offline key migration for each paused server.

3. Connect to each running server manually and set `keyring_operations=ON`.

All running servers must support the `keyring_operations` system variable. Any server that does not must be stopped before the migration and restarted after.


#### 6.4.4.8 General-Purpose Keyring Key-Management Functions

MySQL Server supports a keyring service that enables internal server components and plugins to store sensitive information securely for later retrieval.

As of MySQL 5.7.13, MySQL Server includes an SQL interface for keyring key management, implemented as a set of general-purpose functions that access the capabilities provided by the internal keyring service. The keyring functions are contained in a plugin library file, which also contains a `keyring_udf` plugin that must be enabled prior to function invocation. For these functions to be used, a keyring plugin such as `keyring_file` or `keyring_okv` must be enabled.

The functions described here are general-purpose and intended for use with any keyring component or plugin. A given keyring component or plugin may also provide functions of its own that are intended for use only with that component or plugin; see Section 6.4.4.9, “Plugin-Specific Keyring Key-Management Functions”.

The following sections provide installation instructions for the keyring functions and demonstrate how to use them. For information about the keyring service functions invoked by these functions, see Section 5.5.6.2, “The Keyring Service”. For general keyring information, see Section 6.4.4, “The MySQL Keyring”.

* Installing or Uninstalling General-Purpose Keyring Functions
* Using General-Purpose Keyring Functions
* General-Purpose Keyring Function Reference

##### Installing or Uninstalling General-Purpose Keyring Functions

This section describes how to install or uninstall the keyring functions, which are implemented in a plugin library file that also contains a `keyring_udf` plugin. For general information about installing or uninstalling plugins and loadable functions, see Section 5.5.1, “Installing and Uninstalling Plugins”, and Section 5.6.1, “Installing and Uninstalling Loadable Functions”.

The keyring functions enable keyring key management operations, but the `keyring_udf` plugin must also be installed because the functions do not work correctly without it. Attempts to use the functions without the `keyring_udf` plugin result in an error.

To be usable by the server, the plugin library file must be located in the MySQL plugin directory (the directory named by the `plugin_dir` system variable). If necessary, configure the plugin directory location by setting the value of `plugin_dir` at server startup.

The plugin library file base name is `keyring_udf`. The file name suffix differs per platform (for example, `.so` for Unix and Unix-like systems, `.dll` for Windows).

To install the `keyring_udf` plugin and the keyring functions, use the `INSTALL PLUGIN` and `CREATE FUNCTION` statements, adjusting the `.so` suffix for your platform as necessary:

```sql
INSTALL PLUGIN keyring_udf SONAME 'keyring_udf.so';
CREATE FUNCTION keyring_key_generate RETURNS INTEGER
  SONAME 'keyring_udf.so';
CREATE FUNCTION keyring_key_fetch RETURNS STRING
  SONAME 'keyring_udf.so';
CREATE FUNCTION keyring_key_length_fetch RETURNS INTEGER
  SONAME 'keyring_udf.so';
CREATE FUNCTION keyring_key_type_fetch RETURNS STRING
  SONAME 'keyring_udf.so';
CREATE FUNCTION keyring_key_store RETURNS INTEGER
  SONAME 'keyring_udf.so';
CREATE FUNCTION keyring_key_remove RETURNS INTEGER
  SONAME 'keyring_udf.so';
```

If the plugin and functions are used on a source replication server, install them on all replicas as well to avoid replication issues.

Once installed as just described, the plugin and functions remain installed until uninstalled. To remove them, use the `UNINSTALL PLUGIN` and `DROP FUNCTION` statements:

```sql
UNINSTALL PLUGIN keyring_udf;
DROP FUNCTION keyring_key_generate;
DROP FUNCTION keyring_key_fetch;
DROP FUNCTION keyring_key_length_fetch;
DROP FUNCTION keyring_key_type_fetch;
DROP FUNCTION keyring_key_store;
DROP FUNCTION keyring_key_remove;
```

##### Using General-Purpose Keyring Functions

Before using the keyring general-purpose functions, install them according to the instructions provided in Installing or Uninstalling General-Purpose Keyring Functions.

The keyring functions are subject to these constraints:

* To use any keyring function, the `keyring_udf` plugin must be enabled. Otherwise, an error occurs:

  ```sql
  ERROR 1123 (HY000): Can't initialize function 'keyring_key_generate';
  This function requires keyring_udf plugin which is not installed.
  Please install
  ```

  To install the `keyring_udf` plugin, see Installing or Uninstalling General-Purpose Keyring Functions.

* The keyring functions invoke keyring service functions (see Section 5.5.6.2, “The Keyring Service”). The service functions in turn use whatever keyring plugin is installed (for example, `keyring_file` or `keyring_okv`). Therefore, to use any keyring function, some underlying keyring plugin must be enabled. Otherwise, an error occurs:

  ```sql
  ERROR 3188 (HY000): Function 'keyring_key_generate' failed because
  underlying keyring service returned an error. Please check if a
  keyring plugin is installed and that provided arguments are valid
  for the keyring you are using.
  ```

  To install a keyring plugin, see Section 6.4.4.1, “Keyring Plugin Installation”.

* A user must possess the global `EXECUTE` privilege to use any keyring function. Otherwise, an error occurs:

  ```sql
  ERROR 1123 (HY000): Can't initialize function 'keyring_key_generate';
  The user is not privileged to execute this function. User needs to
  have EXECUTE
  ```

  To grant the global `EXECUTE` privilege to a user, use this statement:

  ```sql
  GRANT EXECUTE ON *.* TO user;
  ```

  Alternatively, should you prefer to avoid granting the global `EXECUTE` privilege while still permitting users to access specific key-management operations, “wrapper” stored programs can be defined (a technique described later in this section).

* A key stored in the keyring by a given user can be manipulated later only by the same user. That is, the value of the `CURRENT_USER()` function at the time of key manipulation must have the same value as when the key was stored in the keyring. (This constraint rules out the use of the keyring functions for manipulation of instance-wide keys, such as those created by `InnoDB` to support tablespace encryption.)

  To enable multiple users to perform operations on the same key, “wrapper” stored programs can be defined (a technique described later in this section).

* Keyring functions support the key types and lengths supported by the underlying keyring plugin. For information about keys specific to a particular keyring plugin, see Section 6.4.4.6, “Supported Keyring Key Types and Lengths”.

To create a new random key and store it in the keyring, call `keyring_key_generate()`, passing to it an ID for the key, along with the key type (encryption method) and its length in bytes. The following call creates a 2,048-bit DSA-encrypted key named `MyKey`:

```sql
mysql> SELECT keyring_key_generate('MyKey', 'DSA', 256);
+-------------------------------------------+
| keyring_key_generate('MyKey', 'DSA', 256) |
+-------------------------------------------+
|                                         1 |
+-------------------------------------------+
```

A return value of 1 indicates success. If the key cannot be created, the return value is `NULL` and an error occurs. One reason this might be is that the underlying keyring plugin does not support the specified combination of key type and key length; see Section 6.4.4.6, “Supported Keyring Key Types and Lengths”.

To be able to check the return type regardless of whether an error occurs, use `SELECT ... INTO @var_name` and test the variable value:

```sql
mysql> SELECT keyring_key_generate('', '', -1) INTO @x;
ERROR 3188 (HY000): Function 'keyring_key_generate' failed because
underlying keyring service returned an error. Please check if a
keyring plugin is installed and that provided arguments are valid
for the keyring you are using.
mysql> SELECT @x;
+------+
| @x   |
+------+
| NULL |
+------+
mysql> SELECT keyring_key_generate('x', 'AES', 16) INTO @x;
mysql> SELECT @x;
+------+
| @x   |
+------+
|    1 |
+------+
```

This technique also applies to other keyring functions that for failure return a value and an error.

The ID passed to `keyring_key_generate()` provides a means by which to refer to the key in subsequent functions calls. For example, use the key ID to retrieve its type as a string or its length in bytes as an integer:

```sql
mysql> SELECT keyring_key_type_fetch('MyKey');
+---------------------------------+
| keyring_key_type_fetch('MyKey') |
+---------------------------------+
| DSA                             |
+---------------------------------+
mysql> SELECT keyring_key_length_fetch('MyKey');
+-----------------------------------+
| keyring_key_length_fetch('MyKey') |
+-----------------------------------+
|                               256 |
+-----------------------------------+
```

To retrieve a key value, pass the key ID to `keyring_key_fetch()`. The following example uses `HEX()` to display the key value because it may contain nonprintable characters. The example also uses a short key for brevity, but be aware that longer keys provide better security:

```sql
mysql> SELECT keyring_key_generate('MyShortKey', 'DSA', 8);
+----------------------------------------------+
| keyring_key_generate('MyShortKey', 'DSA', 8) |
+----------------------------------------------+
|                                            1 |
+----------------------------------------------+
mysql> SELECT HEX(keyring_key_fetch('MyShortKey'));
+--------------------------------------+
| HEX(keyring_key_fetch('MyShortKey')) |
+--------------------------------------+
| 1DB3B0FC3328A24C                     |
+--------------------------------------+
```

Keyring functions treat key IDs, types, and values as binary strings, so comparisons are case-sensitive. For example, IDs of `MyKey` and `mykey` refer to different keys.

To remove a key, pass the key ID to `keyring_key_remove()`:

```sql
mysql> SELECT keyring_key_remove('MyKey');
+-----------------------------+
| keyring_key_remove('MyKey') |
+-----------------------------+
|                           1 |
+-----------------------------+
```

To obfuscate and store a key that you provide, pass the key ID, type, and value to `keyring_key_store()`:

```sql
mysql> SELECT keyring_key_store('AES_key', 'AES', 'Secret string');
+------------------------------------------------------+
| keyring_key_store('AES_key', 'AES', 'Secret string') |
+------------------------------------------------------+
|                                                    1 |
+------------------------------------------------------+
```

As indicated previously, a user must have the global `EXECUTE` privilege to call keyring functions, and the user who stores a key in the keyring initially must be the same user who performs subsequent operations on the key later, as determined from the `CURRENT_USER()` value in effect for each function call. To permit key operations to users who do not have the global `EXECUTE` privilege or who may not be the key “owner,” use this technique:

1. Define “wrapper” stored programs that encapsulate the required key operations and have a `DEFINER` value equal to the key owner.

2. Grant the `EXECUTE` privilege for specific stored programs to the individual users who should be able to invoke them.

3. If the operations implemented by the wrapper stored programs do not include key creation, create any necessary keys in advance, using the account named as the `DEFINER` in the stored program definitions.

This technique enables keys to be shared among users and provides to DBAs more fine-grained control over who can do what with keys, without having to grant global privileges.

The following example shows how to set up a shared key named `SharedKey` that is owned by the DBA, and a `get_shared_key()` stored function that provides access to the current key value. The value can be retrieved by any user with the `EXECUTE` privilege for that function, which is created in the `key_schema` schema.

From a MySQL administrative account (`'root'@'localhost'` in this example), create the administrative schema and the stored function to access the key:

```sql
mysql> CREATE SCHEMA key_schema;

mysql> CREATE DEFINER = 'root'@'localhost'
       FUNCTION key_schema.get_shared_key()
       RETURNS BLOB READS SQL DATA
       RETURN keyring_key_fetch('SharedKey');
```

From the administrative account, ensure that the shared key exists:

```sql
mysql> SELECT keyring_key_generate('SharedKey', 'DSA', 8);
+---------------------------------------------+
| keyring_key_generate('SharedKey', 'DSA', 8) |
+---------------------------------------------+
|                                           1 |
+---------------------------------------------+
```

From the administrative account, create an ordinary user account to which key access is to be granted:

```sql
mysql> CREATE USER 'key_user'@'localhost'
       IDENTIFIED BY 'key_user_pwd';
```

From the `key_user` account, verify that, without the proper `EXECUTE` privilege, the new account cannot access the shared key:

```sql
mysql> SELECT HEX(key_schema.get_shared_key());
ERROR 1370 (42000): execute command denied to user 'key_user'@'localhost'
for routine 'key_schema.get_shared_key'
```

From the administrative account, grant `EXECUTE` to `key_user` for the stored function:

```sql
mysql> GRANT EXECUTE ON FUNCTION key_schema.get_shared_key
       TO 'key_user'@'localhost';
```

From the `key_user` account, verify that the key is now accessible:

```sql
mysql> SELECT HEX(key_schema.get_shared_key());
+----------------------------------+
| HEX(key_schema.get_shared_key()) |
+----------------------------------+
| 9BAFB9E75CEEB013                 |
+----------------------------------+
```

##### General-Purpose Keyring Function Reference

For each general-purpose keyring function, this section describes its purpose, calling sequence, and return value. For information about the conditions under which these functions can be invoked, see Using General-Purpose Keyring Functions.

* `keyring_key_fetch(key_id)`

  Given a key ID, deobfuscates and returns the key value.

  Arguments:

  + *`key_id`*: A string that specifies the key ID.

  Return value:

  Returns the key value as a string for success, `NULL` if the key does not exist, or `NULL` and an error for failure.

  Note

  Key values retrieved using `keyring_key_fetch()` are subject to the general keyring function limits described in Section 6.4.4.6, “Supported Keyring Key Types and Lengths”. A key value longer than that length can be stored using a keyring service function (see Section 5.5.6.2, “The Keyring Service”), but if retrieved using `keyring_key_fetch()` is truncated to the general keyring function limit.

  Example:

  ```sql
  mysql> SELECT keyring_key_generate('RSA_key', 'RSA', 16);
  +--------------------------------------------+
  | keyring_key_generate('RSA_key', 'RSA', 16) |
  +--------------------------------------------+
  |                                          1 |
  +--------------------------------------------+
  mysql> SELECT HEX(keyring_key_fetch('RSA_key'));
  +-----------------------------------+
  | HEX(keyring_key_fetch('RSA_key')) |
  +-----------------------------------+
  | 91C2253B696064D3556984B6630F891A  |
  +-----------------------------------+
  mysql> SELECT keyring_key_type_fetch('RSA_key');
  +-----------------------------------+
  | keyring_key_type_fetch('RSA_key') |
  +-----------------------------------+
  | RSA                               |
  +-----------------------------------+
  mysql> SELECT keyring_key_length_fetch('RSA_key');
  +-------------------------------------+
  | keyring_key_length_fetch('RSA_key') |
  +-------------------------------------+
  |                                  16 |
  +-------------------------------------+
  ```

  The example uses `HEX()` to display the key value because it may contain nonprintable characters. The example also uses a short key for brevity, but be aware that longer keys provide better security.

* `keyring_key_generate(key_id, key_type, key_length)`

  Generates a new random key with a given ID, type, and length, and stores it in the keyring. The type and length values must be consistent with the values supported by the underlying keyring plugin. See Section 6.4.4.6, “Supported Keyring Key Types and Lengths”.

  Arguments:

  + *`key_id`*: A string that specifies the key ID.

  + *`key_type`*: A string that specifies the key type.

  + *`key_length`*: An integer that specifies the key length in bytes.

  Return value:

  Returns 1 for success, or `NULL` and an error for failure.

  Example:

  ```sql
  mysql> SELECT keyring_key_generate('RSA_key', 'RSA', 384);
  +---------------------------------------------+
  | keyring_key_generate('RSA_key', 'RSA', 384) |
  +---------------------------------------------+
  |                                           1 |
  +---------------------------------------------+
  ```

* `keyring_key_length_fetch(key_id)`

  Given a key ID, returns the key length.

  Arguments:

  + *`key_id`*: A string that specifies the key ID.

  Return value:

  Returns the key length in bytes as an integer for success, `NULL` if the key does not exist, or `NULL` and an error for failure.

  Example:

  See the description of `keyring_key_fetch()`.

* `keyring_key_remove(key_id)`

  Removes the key with a given ID from the keyring.

  Arguments:

  + *`key_id`*: A string that specifies the key ID.

  Return value:

  Returns 1 for success, or `NULL` for failure.

  Example:

  ```sql
  mysql> SELECT keyring_key_remove('AES_key');
  +-------------------------------+
  | keyring_key_remove('AES_key') |
  +-------------------------------+
  |                             1 |
  +-------------------------------+
  ```

* `keyring_key_store(key_id, key_type, key)`

  Obfuscates and stores a key in the keyring.

  Arguments:

  + *`key_id`*: A string that specifies the key ID.

  + *`key_type`*: A string that specifies the key type.

  + *`key`*: A string that specifies the key value.

  Return value:

  Returns 1 for success, or `NULL` and an error for failure.

  Example:

  ```sql
  mysql> SELECT keyring_key_store('new key', 'DSA', 'My key value');
  +-----------------------------------------------------+
  | keyring_key_store('new key', 'DSA', 'My key value') |
  +-----------------------------------------------------+
  |                                                   1 |
  +-----------------------------------------------------+
  ```

* `keyring_key_type_fetch(key_id)`

  Given a key ID, returns the key type.

  Arguments:

  + *`key_id`*: A string that specifies the key ID.

  Return value:

  Returns the key type as a string for success, `NULL` if the key does not exist, or `NULL` and an error for failure.

  Example:

  See the description of `keyring_key_fetch()`.


#### 6.4.4.9 Plugin-Specific Keyring Key-Management Functions

For each keyring plugin-specific function, this section describes its purpose, calling sequence, and return value. For information about general-purpose keyring functions, see Section 6.4.4.8, “General-Purpose Keyring Key-Management Functions”.

* `keyring_aws_rotate_cmk()`

  Associated keyring plugin: `keyring_aws`

  `keyring_aws_rotate_cmk()` rotates the customer master key (CMK). Rotation changes only the key that AWS KMS uses for subsequent data key-encryption operations. AWS KMS maintains previous CMK versions, so keys generated using previous CMKs remain decryptable after rotation.

  Rotation changes the CMK value used inside AWS KMS but does not change the ID used to refer to it, so there is no need to change the `keyring_aws_cmk_id` system variable after calling `keyring_aws_rotate_cmk()`.

  This function requires the `SUPER` privilege.

  Arguments:

  None.

  Return value:

  Returns 1 for success, or `NULL` and an error for failure.

* `keyring_aws_rotate_keys()`

  Associated keyring plugin: `keyring_aws`

  `keyring_aws_rotate_keys()` rotates keys stored in the `keyring_aws` storage file named by the `keyring_aws_data_file` system variable. Rotation sends each key stored in the file to AWS KMS for re-encryption using the value of the `keyring_aws_cmk_id` system variable as the CMK value, and stores the new encrypted keys in the file.

  `keyring_aws_rotate_keys()` is useful for key re-encryption under these circumstances:

  + After rotating the CMK; that is, after invoking the `keyring_aws_rotate_cmk()` function.

  + After changing the `keyring_aws_cmk_id` system variable to a different key value.

  This function requires the `SUPER` privilege.

  Arguments:

  None.

  Return value:

  Returns 1 for success, or `NULL` and an error for failure.


#### 6.4.4.10 Keyring Metadata

To see whether a keyring plugin is loaded, check the Information Schema `PLUGINS` table or use the `SHOW PLUGINS` statement (see Section 5.5.2, “Obtaining Server Plugin Information”). For example:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE 'keyring%';
+--------------+---------------+
| PLUGIN_NAME  | PLUGIN_STATUS |
+--------------+---------------+
| keyring_file | ACTIVE        |
+--------------+---------------+
```


#### 6.4.4.11 Keyring Command Options

MySQL supports the following keyring-related command-line options:

* `--keyring-migration-destination=plugin`

  <table frame="box" rules="all" summary="Properties for keyring-migration-destination"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-migration-destination=plugin_name</code></td> </tr><tr><th>Introduced</th> <td>5.7.21</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The destination keyring plugin for key migration. See Section 6.4.4.7, “Migrating Keys Between Keyring Keystores”. The format and interpretation of the option value is the same as described for the `--keyring-migration-source` option.

  Note

  `--keyring-migration-source` and `--keyring-migration-destination` are mandatory for all keyring migration operations. The source and destination plugins must differ, and the migration server must support both plugins.

* `--keyring-migration-host=host_name`

  <table frame="box" rules="all" summary="Properties for keyring-migration-host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-migration-host=host_name</code></td> </tr><tr><th>Introduced</th> <td>5.7.21</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost</code></td> </tr></tbody></table>

  The host location of the running server that is currently using one of the key migration keystores. See Section 6.4.4.7, “Migrating Keys Between Keyring Keystores”. Migration always occurs on the local host, so the option always specifies a value for connecting to a local server, such as `localhost`, `127.0.0.1`, `::1`, or the local host IP address or host name.

* `--keyring-migration-password[=password]`

  <table frame="box" rules="all" summary="Properties for keyring-migration-password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-migration-password[=password]</code></td> </tr><tr><th>Introduced</th> <td>5.7.21</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The password of the MySQL account used for connecting to the running server that is currently using one of the key migration keystores. See Section 6.4.4.7, “Migrating Keys Between Keyring Keystores”.

  The password value is optional. If not given, the server prompts for one. If given, there must be *no space* between `--keyring-migration-password=` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. See Section 6.1.2.1, “End-User Guidelines for Password Security”. You can use an option file to avoid giving the password on the command line. In this case, the file should have a restrictive mode and be accessible only to the account used to run the migration server.

* `--keyring-migration-port=port_num`

  <table frame="box" rules="all" summary="Properties for keyring-migration-port"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-migration-port=port_num</code></td> </tr><tr><th>Introduced</th> <td>5.7.21</td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>3306</code></td> </tr></tbody></table>

  For TCP/IP connections, the port number for connecting to the running server that is currently using one of the key migration keystores. See Section 6.4.4.7, “Migrating Keys Between Keyring Keystores”.

* `--keyring-migration-socket=path`

  <table frame="box" rules="all" summary="Properties for keyring-migration-socket"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-migration-socket={file_name|pipe_name}</code></td> </tr><tr><th>Introduced</th> <td>5.7.21</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  For Unix socket file or Windows named pipe connections, the socket file or named pipe for connecting to the running server that is currently using one of the key migration keystores. See Section 6.4.4.7, “Migrating Keys Between Keyring Keystores”.

* `--keyring-migration-source=plugin`

  <table frame="box" rules="all" summary="Properties for keyring-migration-source"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-migration-source=plugin_name</code></td> </tr><tr><th>Introduced</th> <td>5.7.21</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The source keyring plugin for key migration. See Section 6.4.4.7, “Migrating Keys Between Keyring Keystores”.

  The option value is similar to that for `--plugin-load`, except that only one plugin library can be specified. The value is given as *`plugin_library`* or *`name`*`=`*`plugin_library`*, where *`plugin_library`* is the name of a library file that contains plugin code, and *`name`* is the name of a plugin to load. If a plugin library is named without any preceding plugin name, the server loads all plugins in the library. With a preceding plugin name, the server loads only the named plugin from the libary. The server looks for plugin library files in the directory named by the `plugin_dir` system variable.

  Note

  `--keyring-migration-source` and `--keyring-migration-destination` are mandatory for all keyring migration operations. The source and destination plugins must differ, and the migration server must support both plugins.

* `--keyring-migration-user=user_name`

  <table frame="box" rules="all" summary="Properties for keyring-migration-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-migration-user=user_name</code></td> </tr><tr><th>Introduced</th> <td>5.7.21</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The user name of the MySQL account used for connecting to the running server that is currently using one of the key migration keystores. See Section 6.4.4.7, “Migrating Keys Between Keyring Keystores”.


#### 6.4.4.12 Keyring System Variables

MySQL Keyring plugins support the following system variables. Use them to configure keyring plugin operation. These variables are unavailable unless the appropriate keyring plugin is installed (see Section 6.4.4.1, “Keyring Plugin Installation”).

* `keyring_aws_cmk_id`

  <table frame="box" rules="all" summary="Properties for keyring_aws_cmk_id"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-cmk-id=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_cmk_id</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The customer master key (CMK) ID obtained from the AWS KMS server and used by the `keyring_aws` plugin. This variable is unavailable unless that plugin is installed.

  This variable is mandatory. If not specified, `keyring_aws` initialization fails.

* `keyring_aws_conf_file`

  <table frame="box" rules="all" summary="Properties for keyring_aws_conf_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-conf-file=file_name</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_conf_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>

  The location of the configuration file for the `keyring_aws` plugin. This variable is unavailable unless that plugin is installed.

  At plugin startup, `keyring_aws` reads the AWS secret access key ID and key from the configuration file. For the `keyring_aws` plugin to start successfully, the configuration file must exist and contain valid secret access key information, initialized as described in Section 6.4.4.5, “Using the keyring\_aws Amazon Web Services Keyring Plugin”.

  The default file name is `keyring_aws_conf`, located in the default keyring file directory. The location of this default directory is the same as for the `keyring_file_data` system variable. See the description of that variable for details, as well as for considerations to take into account if you create the directory manually.

* `keyring_aws_data_file`

  <table frame="box" rules="all" summary="Properties for keyring_aws_data_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-data-file</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_data_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>

  The location of the storage file for the `keyring_aws` plugin. This variable is unavailable unless that plugin is installed.

  At plugin startup, if the value assigned to `keyring_aws_data_file` specifies a file that does not exist, the `keyring_aws` plugin attempts to create it (as well as its parent directory, if necessary). If the file does exist, `keyring_aws` reads any encrypted keys contained in the file into its in-memory cache. `keyring_aws` does not cache unencrypted keys in memory.

  The default file name is `keyring_aws_data`, located in the default keyring file directory. The location of this default directory is the same as for the `keyring_file_data` system variable. See the description of that variable for details, as well as for considerations to take into account if you create the directory manually.

* `keyring_aws_region`

<table frame="box" rules="all" summary="Properties for keyring_aws_region">
  <col style="width: 30%"/>
  <col style="width: 70%"/>
  <tbody>
    <tr>
      <th>Command-Line Format</th>
      <td><code>--keyring-aws-region=value</code></td>
    </tr>
    <tr>
      <th>Introduced</th>
      <td>5.7.19</td>
    </tr>
    <tr>
      <th>System Variable</th>
      <td><code>keyring_aws_region</code></td>
    </tr>
    <tr>
      <th>Scope</th>
      <td>Global</td>
    </tr>
    <tr>
      <th>Dynamic</th>
      <td>Yes</td>
    </tr>
    <tr>
      <th>Type</th>
      <td>Enumeration</td>
    </tr>
    <tr>
      <th>Default Value</th>
      <td><code>us-east-1</code></td>
    </tr>
    <tr>
      <th>Valid Values (≥ 5.7.39)</th>
      <td><code>af-south-1</code><code>ap-east-1</code><code>ap-northeast-1</code><code>ap-northeast-2</code><code>ap-northeast-3</code><code>ap-south-1</code><code>ap-southeast-1</code><code>ap-southeast-2</code><code>ca-central-1</code><code>cn-north-1</code><code>cn-northwest-1</code><code>eu-central-1</code><code>eu-north-1</code><code>eu-south-1</code><code>eu-west-1</code><code>eu-west-2</code><code>eu-west-3</code><code>me-south-1</code><code>sa-east-1</code><code>us-east-1</code><code>us-east-2</code><code>us-gov-east-1</code><code>us-iso-east-1</code><code>us-iso-west-1</code><code>us-isob-east-1</code><code>us-west-1</code><code>us-west-2</code></td>
    </tr>
    <tr>
      <th>Valid Values (≥ 5.7.27, ≤ 5.7.38)</th>
      <td><code>ap-northeast-1</code><code>ap-northeast-2</code><code>ap-south-1</code><code>ap-southeast-1</code><code>ap-southeast-2</code><code>ca-central-1</code><code>cn-north-1</code><code>cn-northwest-1</code><code>eu-central-1</code><code>eu-west-1</code><code>eu-west-2</code><code>eu-west-3</code><code>sa-east-1</code><code>us-east-1</code><code>us-east-2</code><code>us-west-1</code><code>us-west-2</code></td>
    </tr>
    <tr>
      <th>Valid Values (≥ 5.7.19, ≤ 5.7.26)</th>
      <td><code>ap-northeast-1</code><code>ap-northeast-2</code><code>ap-south-1</code><code>ap-southeast-1</code><code>ap-southeast-2</code><code>eu-central-1</code><code>eu-west-1</code><code>sa-east-1</code><code>us-east-1</code><code>us-west-1</code><code>us-west-2</code></td>
    </tr>
  </tbody>
</table>

  The AWS region for the `keyring_aws` plugin. This variable is unavailable unless that plugin is installed.

  If not set, the AWS region defaults to `us-east-1`. Thus, for any other region, this variable must be set explicitly.

* `keyring_encrypted_file_data`

  <table frame="box" rules="all" summary="Properties for keyring_encrypted_file_data"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-encrypted-file-data=file_name</code></td> </tr><tr><th>Introduced</th> <td>5.7.21</td> </tr><tr><th>System Variable</th> <td><code>keyring_encrypted_file_data</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>

  The path name of the data file used for secure data storage by the `keyring_encrypted_file` plugin. This variable is unavailable unless that plugin is installed. The file location should be in a directory considered for use only by keyring plugins. For example, do not locate the file under the data directory.

  Keyring operations are transactional: The `keyring_encrypted_file` plugin uses a backup file during write operations to ensure that it can roll back to the original file if an operation fails. The backup file has the same name as the value of the `keyring_encrypted_file_data` system variable with a suffix of `.backup`.

  Do not use the same `keyring_encrypted_file` data file for multiple MySQL instances. Each instance should have its own unique data file.

  The default file name is `keyring_encrypted`, located in a directory that is platform specific and depends on the value of the `INSTALL_LAYOUT` **CMake** option, as shown in the following table. To specify the default directory for the file explicitly if you are building from source, use the `INSTALL_MYSQLKEYRINGDIR` **CMake** option.

  <table summary="The default keyring_encrypted_file_data value for different INSTALL_LAYOUT values."><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th><code>INSTALL_LAYOUT</code> Value</th> <th>Default <code>keyring_encrypted_file_data</code> Value</th> </tr></thead><tbody><tr> <td><code>DEB</code>, <code>RPM</code>, <code>SLES</code>, <code>SVR4</code></td> <td><code>/var/lib/mysql-keyring/keyring_encrypted</code></td> </tr><tr> <td>Otherwise</td> <td><code>keyring/keyring_encrypted</code> under the <code>CMAKE_INSTALL_PREFIX</code> value</td> </tr></tbody></table>

  At plugin startup, if the value assigned to `keyring_encrypted_file_data` specifies a file that does not exist, the `keyring_encrypted_file` plugin attempts to create it (as well as its parent directory, if necessary).

  If you create the directory manually, it should have a restrictive mode and be accessible only to the account used to run the MySQL server. For example, on Unix and Unix-like systems, to use the `/usr/local/mysql/mysql-keyring` directory, the following commands (executed as `root`) create the directory and set its mode and ownership:

  ```sql
  cd /usr/local/mysql
  mkdir mysql-keyring
  chmod 750 mysql-keyring
  chown mysql mysql-keyring
  chgrp mysql mysql-keyring
  ```

  If the `keyring_encrypted_file` plugin cannot create or access its data file, it writes an error message to the error log. If an attempted runtime assignment to `keyring_encrypted_file_data` results in an error, the variable value remains unchanged.

  Important

  Once the `keyring_encrypted_file` plugin has created its data file and started to use it, it is important not to remove the file. Loss of the file causes data encrypted using its keys to become inaccessible. (It is permissible to rename or move the file, as long as you change the value of `keyring_encrypted_file_data` to match.)

* `keyring_encrypted_file_password`

  <table frame="box" rules="all" summary="Properties for keyring_encrypted_file_password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-encrypted-file-password=password</code></td> </tr><tr><th>Introduced</th> <td>5.7.21</td> </tr><tr><th>System Variable</th> <td><code>keyring_encrypted_file_password</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The password used by the `keyring_encrypted_file` plugin. This variable is unavailable unless that plugin is installed.

  This variable is mandatory. If not specified, `keyring_encrypted_file` initialization fails.

  If this variable is specified in an option file, the file should have a restrictive mode and be accessible only to the account used to run the MySQL server.

  Important

  Once the `keyring_encrypted_file_password` value has been set, changing it does not rotate the keyring password and could make the server inaccessible. If an incorrect password is provided, the `keyring_encrypted_file` plugin cannot load keys from the encrypted keyring file.

  The password value cannot be displayed at runtime with `SHOW VARIABLES` or the Performance Schema `global_variables` table because the display value is obfuscated.

* `keyring_file_data`

  <table frame="box" rules="all" summary="Properties for keyring_file_data"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-file-data=file_name</code></td> </tr><tr><th>Introduced</th> <td>5.7.11</td> </tr><tr><th>System Variable</th> <td><code>keyring_file_data</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>

  The path name of the data file used for secure data storage by the `keyring_file` plugin. This variable is unavailable unless that plugin is installed. The file location should be in a directory considered for use only by keyring plugins. For example, do not locate the file under the data directory.

  Keyring operations are transactional: The `keyring_file` plugin uses a backup file during write operations to ensure that it can roll back to the original file if an operation fails. The backup file has the same name as the value of the `keyring_file_data` system variable with a suffix of `.backup`.

  Do not use the same `keyring_file` data file for multiple MySQL instances. Each instance should have its own unique data file.

  The default file name is `keyring`, located in a directory that is platform specific and depends on the value of the `INSTALL_LAYOUT` **CMake** option, as shown in the following table. To specify the default directory for the file explicitly if you are building from source, use the `INSTALL_MYSQLKEYRINGDIR` **CMake** option.

  <table summary="The default keyring_file_data value for different INSTALL_LAYOUT values."><col style="width: 35%"/><col style="width: 65%"/><thead><tr> <th><code>INSTALL_LAYOUT</code> Value</th> <th>Default <code>keyring_file_data</code> Value</th> </tr></thead><tbody><tr> <td><code>DEB</code>, <code>RPM</code>, <code>SLES</code>, <code>SVR4</code></td> <td><code>/var/lib/mysql-keyring/keyring</code></td> </tr><tr> <td>Otherwise</td> <td><code>keyring/keyring</code> under the <code>CMAKE_INSTALL_PREFIX</code> value</td> </tr></tbody></table>

  At plugin startup, if the value assigned to `keyring_file_data` specifies a file that does not exist, the `keyring_file` plugin attempts to create it (as well as its parent directory, if necessary).

  If you create the directory manually, it should have a restrictive mode and be accessible only to the account used to run the MySQL server. For example, on Unix and Unix-like systems, to use the `/usr/local/mysql/mysql-keyring` directory, the following commands (executed as `root`) create the directory and set its mode and ownership:

  ```sql
  cd /usr/local/mysql
  mkdir mysql-keyring
  chmod 750 mysql-keyring
  chown mysql mysql-keyring
  chgrp mysql mysql-keyring
  ```

  If the `keyring_file` plugin cannot create or access its data file, it writes an error message to the error log. If an attempted runtime assignment to `keyring_file_data` results in an error, the variable value remains unchanged.

  Important

  Once the `keyring_file` plugin has created its data file and started to use it, it is important not to remove the file. For example, `InnoDB` uses the file to store the master key used to decrypt the data in tables that use `InnoDB` tablespace encryption; see Section 14.14, “InnoDB Data-at-Rest Encryption”. Loss of the file causes data in such tables to become inaccessible. (It is permissible to rename or move the file, as long as you change the value of `keyring_file_data` to match.) It is recommended that you create a separate backup of the keyring data file immediately after you create the first encrypted table and before and after master key rotation.

* `keyring_okv_conf_dir`

  <table frame="box" rules="all" summary="Properties for keyring_okv_conf_dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-okv-conf-dir=dir_name</code></td> </tr><tr><th>Introduced</th> <td>5.7.12</td> </tr><tr><th>System Variable</th> <td><code>keyring_okv_conf_dir</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>empty string</code></td> </tr></tbody></table>

  The path name of the directory that stores configuration information used by the `keyring_okv` plugin. This variable is unavailable unless that plugin is installed. The location should be a directory considered for use only by the `keyring_okv` plugin. For example, do not locate the directory under the data directory.

  The default `keyring_okv_conf_dir` value is empty. For the `keyring_okv` plugin to be able to access Oracle Key Vault, the value must be set to a directory that contains Oracle Key Vault configuration and SSL materials. For instructions on setting up this directory, see Section 6.4.4.4, “Using the keyring\_okv KMIP Plugin”.

  The directory should have a restrictive mode and be accessible only to the account used to run the MySQL server. For example, on Unix and Unix-like systems, to use the `/usr/local/mysql/mysql-keyring-okv` directory, the following commands (executed as `root`) create the directory and set its mode and ownership:

  ```sql
  cd /usr/local/mysql
  mkdir mysql-keyring-okv
  chmod 750 mysql-keyring-okv
  chown mysql mysql-keyring-okv
  chgrp mysql mysql-keyring-okv
  ```

  If the value assigned to `keyring_okv_conf_dir` specifies a directory that does not exist, or that does not contain configuration information that enables a connection to Oracle Key Vault to be established, `keyring_okv` writes an error message to the error log. If an attempted runtime assignment to `keyring_okv_conf_dir` results in an error, the variable value and keyring operation remain unchanged.

* `keyring_operations`

  <table frame="box" rules="all" summary="Properties for keyring_aws_conf_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-conf-file=file_name</code></td> </tr><tr><th>Introduced</th> <td>5.7.19</td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_conf_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>0

  Whether keyring operations are enabled. This variable is used during key migration operations. See Section 6.4.4.7, “Migrating Keys Between Keyring Keystores”.


### 6.4.5 MySQL Enterprise Audit

Note

MySQL Enterprise Audit is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

MySQL Enterprise Edition includes MySQL Enterprise Audit, implemented using a server plugin named `audit_log`. MySQL Enterprise Audit uses the open MySQL Audit API to enable standard, policy-based monitoring, logging, and blocking of connection and query activity executed on specific MySQL servers. Designed to meet the Oracle audit specification, MySQL Enterprise Audit provides an out of box, easy to use auditing and compliance solution for applications that are governed by both internal and external regulatory guidelines.

When installed, the audit plugin enables MySQL Server to produce a log file containing an audit record of server activity. The log contents include when clients connect and disconnect, and what actions they perform while connected, such as which databases and tables they access.

After you install the audit plugin (see Section 6.4.5.2, “Installing or Uninstalling MySQL Enterprise Audit”), it writes an audit log file. By default, the file is named `audit.log` in the server data directory. To change the name of the file, set the `audit_log_file` system variable at server startup.

By default, audit log file contents are written in new-style XML format, without compression or encryption. To select the file format, set the `audit_log_format` system variable at server startup. For details on file format and contents, see Section 6.4.5.4, “Audit Log File Formats”.

For more information about controlling how logging occurs, including audit log file naming and format selection, see Section 6.4.5.5, “Configuring Audit Logging Characteristics”. To perform filtering of audited events, see Section 6.4.5.7, “Audit Log Filtering”. For descriptions of the parameters used to configure the audit log plugin, see Audit Log Options and Variables.

If the audit log plugin is enabled, the Performance Schema (see Chapter 25, *MySQL Performance Schema*) has instrumentation for it. To identify the relevant instruments, use this query:

```sql
SELECT NAME FROM performance_schema.setup_instruments
WHERE NAME LIKE '%/alog/%';
```


#### 6.4.5.1 Elements of MySQL Enterprise Audit

MySQL Enterprise Audit is based on the audit log plugin and related elements:

* A server-side plugin named `audit_log` examines auditable events and determines whether to write them to the audit log.

* A set of functions enables manipulation of filtering definitions that control logging behavior, the encryption password, and log file reading.

* Tables in the `mysql` system database provide persistent storage of filter and user account data.

* System variables enable audit log configuration and status variables provide runtime operational information.

Note

Prior to MySQL 5.7.13, MySQL Enterprise Audit consists only of the `audit_log` plugin and operates in legacy mode. See Section 6.4.5.10, “Legacy Mode Audit Log Filtering”.


#### 6.4.5.2 Installing or Uninstalling MySQL Enterprise Audit

This section describes how to install or uninstall MySQL Enterprise Audit, which is implemented using the audit log plugin and related elements described in Section 6.4.5.1, “Elements of MySQL Enterprise Audit”. For general information about installing plugins, see Section 5.5.1, “Installing and Uninstalling Plugins”.

Important

Read this entire section before following its instructions. Parts of the procedure differ depending on your environment.

Note

If installed, the `audit_log` plugin involves some minimal overhead even when disabled. To avoid this overhead, do not install MySQL Enterprise Audit unless you plan to use it.

To be usable by the server, the plugin library file must be located in the MySQL plugin directory (the directory named by the `plugin_dir` system variable). If necessary, configure the plugin directory location by setting the value of `plugin_dir` at server startup.

Note

The instructions here apply to MySQL 5.7.13 and later.

Also, prior to MySQL 5.7.13, MySQL Enterprise Audit consists only of the `audit_log` plugin and includes none of the other elements described in Section 6.4.5.1, “Elements of MySQL Enterprise Audit”. As of MySQL 5.7.13, if the `audit_log` plugin is already installed from a version of MySQL prior to 5.7.13, uninstall it using the following statement and restart the server before installing the current version:

```sql
UNINSTALL PLUGIN audit_log;
```

To install MySQL Enterprise Audit, look in the `share` directory of your MySQL installation and choose the script that is appropriate for your platform. The available scripts differ in the suffix used to refer to the plugin library file:

* `audit_log_filter_win_install.sql`: Choose this script for Windows systems that use `.dll` as the file name suffix.

* `audit_log_filter_linux_install.sql`: Choose this script for Linux and similar systems that use `.so` as the file name suffix.

Run the script as follows. The example here uses the Linux installation script. Make the appropriate substitution for your system.

```sql
$> mysql -u root -p < audit_log_filter_linux_install.sql
Enter password: (enter root password here)
```

Note

Some MySQL versions have introduced changes to the structure of the MySQL Enterprise Audit tables. To ensure that your tables are up to date for upgrades from earlier versions of MySQL 5.7, run **mysql_upgrade --force** (which also performs any other needed updates). If you prefer to run the update statements only for the MySQL Enterprise Audit tables, see the following discussion.

As of MySQL 5.7.23, for new MySQL installations, the `USER` and `HOST` columns in the `audit_log_user` table used by MySQL Enterprise Audit have definitions that better correspond to the definitions of the `User` and `Host` columns in the `mysql.user` system table. For upgrades to 5.7.23 or higher of an installation for which MySQL Enterprise Audit is already installed, it is recommended that you alter the table definitions as follows:

```sql
ALTER TABLE mysql.audit_log_user
  DROP FOREIGN KEY audit_log_user_ibfk_1;
ALTER TABLE mysql.audit_log_filter
  ENGINE=InnoDB;
ALTER TABLE mysql.audit_log_filter
  CONVERT TO CHARACTER SET utf8 COLLATE utf8_bin;
ALTER TABLE mysql.audit_log_user
  ENGINE=InnoDB;
ALTER TABLE mysql.audit_log_user
  CONVERT TO CHARACTER SET utf8 COLLATE utf8_bin;
ALTER TABLE mysql.audit_log_user
  MODIFY COLUMN USER VARCHAR(32);
ALTER TABLE mysql.audit_log_user
  ADD FOREIGN KEY (FILTERNAME) REFERENCES mysql.audit_log_filter(NAME);
```

As of MySQL 5.7.21, for a new installation of MySQL Enterprise Audit, `InnoDB` is used instead of `MyISAM` for the audit log tables. For upgrades to 5.7.21 or higher of an installation for which MySQL Enterprise Audit is already installed, it is recommended that you alter the audit log tables to use `InnoDB`:

```sql
ALTER TABLE mysql.audit_log_user ENGINE=InnoDB;
ALTER TABLE mysql.audit_log_filter ENGINE=InnoDB;
```

Note

To use MySQL Enterprise Audit in the context of source/replica replication, Group Replication, or InnoDB Cluster, you must use MySQL 5.7.21 or higher, and ensure that the audit log tables use `InnoDB` as just described. Then you must prepare the replica nodes prior to running the installation script on the source node. This is necessary because the `INSTALL PLUGIN` statement in the script is not replicated.

1. On each replica node, extract the `INSTALL PLUGIN` statement from the installation script and execute it manually.

2. On the source node, run the installation script as described previously.

To verify plugin installation, examine the Information Schema `PLUGINS` table or use the `SHOW PLUGINS` statement (see Section 5.5.2, “Obtaining Server Plugin Information”). For example:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE 'audit%';
+-------------+---------------+
| PLUGIN_NAME | PLUGIN_STATUS |
+-------------+---------------+
| audit_log   | ACTIVE        |
+-------------+---------------+
```

If the plugin fails to initialize, check the server error log for diagnostic messages.

After MySQL Enterprise Audit is installed, you can use the `--audit-log` option for subsequent server startups to control `audit_log` plugin activation. For example, to prevent the plugin from being removed at runtime, use this option:

```sql
[mysqld]
audit-log=FORCE_PLUS_PERMANENT
```

If it is desired to prevent the server from running without the audit plugin, use `--audit-log` with a value of `FORCE` or `FORCE_PLUS_PERMANENT` to force server startup to fail if the plugin does not initialize successfully.

Important

By default, rule-based audit log filtering logs no auditable events for any users. This differs from legacy audit log behavior (prior to MySQL 5.7.13), which logs all auditable events for all users (see Section 6.4.5.10, “Legacy Mode Audit Log Filtering”). Should you wish to produce log-everything behavior with rule-based filtering, create a simple filter to enable logging and assign it to the default account:

```sql
SELECT audit_log_filter_set_filter('log_all', '{ "filter": { "log": true } }');
SELECT audit_log_filter_set_user('%', 'log_all');
```

The filter assigned to `%` is used for connections from any account that has no explicitly assigned filter (which initially is true for all accounts).

Once installed as just described, MySQL Enterprise Audit remains installed until uninstalled. To remove it, execute the following statements:

```sql
DROP TABLE IF EXISTS mysql.audit_log_user;
DROP TABLE IF EXISTS mysql.audit_log_filter;
UNINSTALL PLUGIN audit_log;
DROP FUNCTION audit_log_filter_set_filter;
DROP FUNCTION audit_log_filter_remove_filter;
DROP FUNCTION audit_log_filter_set_user;
DROP FUNCTION audit_log_filter_remove_user;
DROP FUNCTION audit_log_filter_flush;
DROP FUNCTION audit_log_encryption_password_get;
DROP FUNCTION audit_log_encryption_password_set;
DROP FUNCTION audit_log_read;
DROP FUNCTION audit_log_read_bookmark;
```


#### 6.4.5.3 MySQL Enterprise Audit Security Considerations

By default, contents of audit log files produced by the audit log plugin are not encrypted and may contain sensitive information, such as the text of SQL statements. For security reasons, audit log files should be written to a directory accessible only to the MySQL server and to users with a legitimate reason to view the log. The default file name is `audit.log` in the data directory. This can be changed by setting the `audit_log_file` system variable at server startup. Other audit log files may exist due to log rotation.

For additional security, enable audit log file encryption. See Encrypting Audit Log Files.


#### 6.4.5.4 Audit Log File Formats

The MySQL server calls the audit log plugin to write an audit record to its log file whenever an auditable event occurs. Typically the first audit record written after plugin startup contains the server description and startup options. Elements following that one represent events such as client connect and disconnect events, executed SQL statements, and so forth. Only top-level statements are logged, not statements within stored programs such as triggers or stored procedures. Contents of files referenced by statements such as `LOAD DATA` are not logged.

To select the log format that the audit log plugin uses to write its log file, set the `audit_log_format` system variable at server startup. These formats are available:

* New-style XML format (`audit_log_format=NEW`): An XML format that has better compatibility with Oracle Audit Vault than old-style XML format. MySQL 5.7 uses new-style XML format by default.

* Old-style XML format (`audit_log_format=OLD`): The original audit log format used by default in older MySQL series.

* JSON format (`audit_log_format=JSON`)

By default, audit log file contents are written in new-style XML format, without compression or encryption.

Note

For information about issues to consider when changing the log format, see Selecting Audit Log File Format.

The following sections describe the available audit logging formats:

* New-Style XML Audit Log File Format
* Old-Style XML Audit Log File Format
* JSON Audit Log File Format

##### New-Style XML Audit Log File Format

Here is a sample log file in new-style XML format (`audit_log_format=NEW`), reformatted slightly for readability:

```sql
<?xml version="1.0" encoding="utf-8"?>
<AUDIT>
 <AUDIT_RECORD>
  <TIMESTAMP>2019-10-03T14:06:33 UTC</TIMESTAMP>
  <RECORD_ID>1_2019-10-03T14:06:33</RECORD_ID>
  <NAME>Audit</NAME>
  <SERVER_ID>1</SERVER_ID>
  <VERSION>1</VERSION>
  <STARTUP_OPTIONS>/usr/local/mysql/bin/mysqld
    --socket=/usr/local/mysql/mysql.sock
    --port=3306</STARTUP_OPTIONS>
  <OS_VERSION>i686-Linux</OS_VERSION>
  <MYSQL_VERSION>5.7.21-log</MYSQL_VERSION>
 </AUDIT_RECORD>
 <AUDIT_RECORD>
  <TIMESTAMP>2019-10-03T14:09:38 UTC</TIMESTAMP>
  <RECORD_ID>2_2019-10-03T14:06:33</RECORD_ID>
  <NAME>Connect</NAME>
  <CONNECTION_ID>5</CONNECTION_ID>
  <STATUS>0</STATUS>
  <STATUS_CODE>0</STATUS_CODE>
  <USER>root</USER>
  <OS_LOGIN/>
  <HOST>localhost</HOST>
  <IP>127.0.0.1</IP>
  <COMMAND_CLASS>connect</COMMAND_CLASS>
  <CONNECTION_TYPE>SSL/TLS</CONNECTION_TYPE>
  <PRIV_USER>root</PRIV_USER>
  <PROXY_USER/>
  <DB>test</DB>
 </AUDIT_RECORD>

...

 <AUDIT_RECORD>
  <TIMESTAMP>2019-10-03T14:09:38 UTC</TIMESTAMP>
  <RECORD_ID>6_2019-10-03T14:06:33</RECORD_ID>
  <NAME>Query</NAME>
  <CONNECTION_ID>5</CONNECTION_ID>
  <STATUS>0</STATUS>
  <STATUS_CODE>0</STATUS_CODE>
  <USER>root[root] @ localhost [127.0.0.1]</USER>
  <OS_LOGIN/>
  <HOST>localhost</HOST>
  <IP>127.0.0.1</IP>
  <COMMAND_CLASS>drop_table</COMMAND_CLASS>
  <SQLTEXT>DROP TABLE IF EXISTS t</SQLTEXT>
 </AUDIT_RECORD>

...

 <AUDIT_RECORD>
  <TIMESTAMP>2019-10-03T14:09:39 UTC</TIMESTAMP>
  <RECORD_ID>8_2019-10-03T14:06:33</RECORD_ID>
  <NAME>Quit</NAME>
  <CONNECTION_ID>5</CONNECTION_ID>
  <STATUS>0</STATUS>
  <STATUS_CODE>0</STATUS_CODE>
  <USER>root</USER>
  <OS_LOGIN/>
  <HOST>localhost</HOST>
  <IP>127.0.0.1</IP>
  <COMMAND_CLASS>connect</COMMAND_CLASS>
  <CONNECTION_TYPE>SSL/TLS</CONNECTION_TYPE>
 </AUDIT_RECORD>

...

 <AUDIT_RECORD>
  <TIMESTAMP>2019-10-03T14:09:43 UTC</TIMESTAMP>
  <RECORD_ID>11_2019-10-03T14:06:33</RECORD_ID>
  <NAME>Quit</NAME>
  <CONNECTION_ID>6</CONNECTION_ID>
  <STATUS>0</STATUS>
  <STATUS_CODE>0</STATUS_CODE>
  <USER>root</USER>
  <OS_LOGIN/>
  <HOST>localhost</HOST>
  <IP>127.0.0.1</IP>
  <COMMAND_CLASS>connect</COMMAND_CLASS>
  <CONNECTION_TYPE>SSL/TLS</CONNECTION_TYPE>
 </AUDIT_RECORD>
 <AUDIT_RECORD>
  <TIMESTAMP>2019-10-03T14:09:45 UTC</TIMESTAMP>
  <RECORD_ID>12_2019-10-03T14:06:33</RECORD_ID>
  <NAME>NoAudit</NAME>
  <SERVER_ID>1</SERVER_ID>
 </AUDIT_RECORD>
</AUDIT>
```

The audit log file is written as XML, using UTF-8 (up to 4 bytes per character). The root element is `<AUDIT>`. The root element contains `<AUDIT_RECORD>` elements, each of which provides information about an audited event. When the audit log plugin begins writing a new log file, it writes the XML declaration and opening `<AUDIT>` root element tag. When the plugin closes a log file, it writes the closing `</AUDIT>` root element tag. The closing tag is not present while the file is open.

Elements within `<AUDIT_RECORD>` elements have these characteristics:

* Some elements appear in every `<AUDIT_RECORD>` element. Others are optional and may appear depending on the audit record type.

* Order of elements within an `<AUDIT_RECORD>` element is not guaranteed.

* Element values are not fixed length. Long values may be truncated as indicated in the element descriptions given later.

* The `<`, `>`, `"`, and `&` characters are encoded as `&lt;`, `&gt;`, `&quot;`, and `&amp;`, respectively. NUL bytes (U+00) are encoded as the `?` character.

* Characters not valid as XML characters are encoded using numeric character references. Valid XML characters are:

  ```sql
  #x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
  ```

The following elements are mandatory in every `<AUDIT_RECORD>` element:

* `<NAME>`

  A string representing the type of instruction that generated the audit event, such as a command that the server received from a client.

  Example:

  ```sql
  <NAME>Query</NAME>
  ```

  Some common `<NAME>` values:

  ```sql
  Audit    When auditing starts, which may be server startup time
  Connect  When a client connects, also known as logging in
  Query    An SQL statement (executed directly)
  Prepare  Preparation of an SQL statement; usually followed by Execute
  Execute  Execution of an SQL statement; usually follows Prepare
  Shutdown Server shutdown
  Quit     When a client disconnects
  NoAudit  Auditing has been turned off
  ```

  The possible values are `Audit`, `Binlog Dump`, `Change user`, `Close stmt`, `Connect Out`, `Connect`, `Create DB`, `Daemon`, `Debug`, `Delayed insert`, `Drop DB`, `Execute`, `Fetch`, `Field List`, `Init DB`, `Kill`, `Long Data`, `NoAudit`, `Ping`, `Prepare`, `Processlist`, `Query`, `Quit`, `Refresh`, `Register Slave`, `Reset stmt`, `Set option`, `Shutdown`, `Sleep`, `Statistics`, `Table Dump`, `TableDelete`, `TableInsert`, `TableRead`, `TableUpdate`, `Time`.

  Many of these values correspond to the `COM_xxx` command values listed in the `my_command.h` header file. For example, `Create DB` and `Change user` correspond to `COM_CREATE_DB` and `COM_CHANGE_USER`, respectively.

  Events having `<NAME>` values of `TableXXX` accompany `Query` events. For example, the following statement generates one `Query` event, two `TableRead` events, and a `TableInsert` events:

  ```sql
  INSERT INTO t3 SELECT t1.* FROM t1 JOIN t2;
  ```

  Each `TableXXX` event contains `<TABLE>` and `<DB>` elements to identify the table to which the event refers and the database that contains the table.

* `<RECORD_ID>`

  A unique identifier for the audit record. The value is composed from a sequence number and timestamp, in the format `SEQ_TIMESTAMP`. When the audit log plugin opens the audit log file, it initializes the sequence number to the size of the audit log file, then increments the sequence by 1 for each record logged. The timestamp is a UTC value in `YYYY-MM-DDThh:mm:ss` format indicating the date and time when the audit log plugin opened the file.

  Example:

  ```sql
  <RECORD_ID>12_2019-10-03T14:06:33</RECORD_ID>
  ```

* `<TIMESTAMP>`

  A string representing a UTC value in `YYYY-MM-DDThh:mm:ss UTC` format indicating the date and time when the audit event was generated. For example, the event corresponding to execution of an SQL statement received from a client has a `<TIMESTAMP>` value occurring after the statement finishes, not when it was received.

  Example:

  ```sql
  <TIMESTAMP>2019-10-03T14:09:45 UTC</TIMESTAMP>
  ```

The following elements are optional in `<AUDIT_RECORD>` elements. Many of them occur only with specific `<NAME>` element values.

* `<COMMAND_CLASS>`

  A string that indicates the type of action performed.

  Example:

  ```sql
  <COMMAND_CLASS>drop_table</COMMAND_CLASS>
  ```

  The values correspond to the `statement/sql/xxx` command counters. For example, *`xxx`* is `drop_table` and `select` for `DROP TABLE` and `SELECT` statements, respectively. The following statement displays the possible names:

  ```sql
  SELECT REPLACE(EVENT_NAME, 'statement/sql/', '') AS name
  FROM performance_schema.events_statements_summary_global_by_event_name
  WHERE EVENT_NAME LIKE 'statement/sql/%'
  ORDER BY name;
  ```

* `<CONNECTION_ID>`

  An unsigned integer representing the client connection identifier. This is the same as the value returned by the `CONNECTION_ID()` function within the session.

  Example:

  ```sql
  <CONNECTION_ID>127</CONNECTION_ID>
  ```

* `<CONNECTION_TYPE>`

  The security state of the connection to the server. Permitted values are `TCP/IP` (TCP/IP connection established without encryption), `SSL/TLS` (TCP/IP connection established with encryption), `Socket` (Unix socket file connection), `Named Pipe` (Windows named pipe connection), and `Shared Memory` (Windows shared memory connection).

  Example:

  ```sql
  <CONNECTION_TYPE>SSL/TLS</CONNECTION_TYPE>
  ```

* `<DB>`

  A string representing a database name.

  Example:

  ```sql
  <DB>test</DB>
  ```

  For connect events, this element indicates the default database; the element is empty if there is no default database. For table-access events, the element indicates the database to which the accessed table belongs.

* `<HOST>`

  A string representing the client host name.

  Example:

  ```sql
  <HOST>localhost</HOST>
  ```

* `<IP>`

  A string representing the client IP address.

  Example:

  ```sql
  <IP>127.0.0.1</IP>
  ```

* `<MYSQL_VERSION>`

  A string representing the MySQL server version. This is the same as the value of the `VERSION()` function or `version` system variable.

  Example:

  ```sql
  <MYSQL_VERSION>5.7.21-log</MYSQL_VERSION>
  ```

* `<OS_LOGIN>`

  A string representing the external user name used during the authentication process, as set by the plugin used to authenticate the client. With native (built-in) MySQL authentication, or if the plugin does not set the value, this element is empty. The value is the same as that of the `external_user` system variable (see Section 6.2.14, “Proxy Users”).

  Example:

  ```sql
  <OS_LOGIN>jeffrey</OS_LOGIN>
  ```

* `<OS_VERSION>`

  A string representing the operating system on which the server was built or is running.

  Example:

  ```sql
  <OS_VERSION>x86_64-Linux</OS_VERSION>
  ```

* `<PRIV_USER>`

  A string representing the user that the server authenticated the client as. This is the user name that the server uses for privilege checking, and may differ from the `<USER>` value.

  Example:

  ```sql
  <PRIV_USER>jeffrey</PRIV_USER>
  ```

* `<PROXY_USER>`

  A string representing the proxy user (see Section 6.2.14, “Proxy Users”). The value is empty if user proxying is not in effect.

  Example:

  ```sql
  <PROXY_USER>developer</PROXY_USER>
  ```

* `<SERVER_ID>`

  An unsigned integer representing the server ID. This is the same as the value of the `server_id` system variable.

  Example:

  ```sql
  <SERVER_ID>1</SERVER_ID>
  ```

* `<SQLTEXT>`

  A string representing the text of an SQL statement. The value can be empty. Long values may be truncated. The string, like the audit log file itself, is written using UTF-8 (up to 4 bytes per character), so the value may be the result of conversion. For example, the original statement might have been received from the client as an SJIS string.

  Example:

  ```sql
  <SQLTEXT>DELETE FROM t1</SQLTEXT>
  ```

* `<STARTUP_OPTIONS>`

  A string representing the options that were given on the command line or in option files when the MySQL server was started. The first option is the path to the server executable.

  Example:

  ```sql
  <STARTUP_OPTIONS>/usr/local/mysql/bin/mysqld
    --port=3306 --log_output=FILE</STARTUP_OPTIONS>
  ```

* `<STATUS>`

  An unsigned integer representing the command status: 0 for success, nonzero if an error occurred. This is the same as the value of the `mysql_errno()` C API function. See the description for `<STATUS_CODE>` for information about how it differs from `<STATUS>`.

  The audit log does not contain the SQLSTATE value or error message. To see the associations between error codes, SQLSTATE values, and messages, see Server Error Message Reference.

  Warnings are not logged.

  Example:

  ```sql
  <STATUS>1051</STATUS>
  ```

* `<STATUS_CODE>`

  An unsigned integer representing the command status: 0 for success, 1 if an error occurred.

  The `STATUS_CODE` value differs from the `STATUS` value: `STATUS_CODE` is 0 for success and 1 for error, which is compatible with the EZ\_collector consumer for Audit Vault. `STATUS` is the value of the `mysql_errno()` C API function. This is 0 for success and nonzero for error, and thus is not necessarily 1 for error.

  Example:

  ```sql
  <STATUS_CODE>0</STATUS_CODE>
  ```

* `<TABLE>`

  A string representing a table name.

  Example:

  ```sql
  <TABLE>t3</TABLE>
  ```

* `<USER>`

  A string representing the user name sent by the client. This may differ from the `<PRIV_USER>` value.

  Example:

  ```sql
  <USER>root[root] @ localhost [127.0.0.1]</USER>
  ```

* `<VERSION>`

  An unsigned integer representing the version of the audit log file format.

  Example:

  ```sql
  <VERSION>1</VERSION>
  ```

##### Old-Style XML Audit Log File Format

Here is a sample log file in old-style XML format (`audit_log_format=OLD`), reformatted slightly for readability:

```sql
<?xml version="1.0" encoding="utf-8"?>
<AUDIT>
  <AUDIT_RECORD
    TIMESTAMP="2019-10-03T14:25:00 UTC"
    RECORD_ID="1_2019-10-03T14:25:00"
    NAME="Audit"
    SERVER_ID="1"
    VERSION="1"
    STARTUP_OPTIONS="--port=3306"
    OS_VERSION="i686-Linux"
    MYSQL_VERSION="5.7.21-log"/>
  <AUDIT_RECORD
    TIMESTAMP="2019-10-03T14:25:24 UTC"
    RECORD_ID="2_2019-10-03T14:25:00"
    NAME="Connect"
    CONNECTION_ID="4"
    STATUS="0"
    STATUS_CODE="0"
    USER="root"
    OS_LOGIN=""
    HOST="localhost"
    IP="127.0.0.1"
    COMMAND_CLASS="connect"
    CONNECTION_TYPE="SSL/TLS"
    PRIV_USER="root"
    PROXY_USER=""
    DB="test"/>

...

  <AUDIT_RECORD
    TIMESTAMP="2019-10-03T14:25:24 UTC"
    RECORD_ID="6_2019-10-03T14:25:00"
    NAME="Query"
    CONNECTION_ID="4"
    STATUS="0"
    STATUS_CODE="0"
    USER="root[root] @ localhost [127.0.0.1]"
    OS_LOGIN=""
    HOST="localhost"
    IP="127.0.0.1"
    COMMAND_CLASS="drop_table"
    SQLTEXT="DROP TABLE IF EXISTS t"/>

...

  <AUDIT_RECORD
    TIMESTAMP="2019-10-03T14:25:24 UTC"
    RECORD_ID="8_2019-10-03T14:25:00"
    NAME="Quit"
    CONNECTION_ID="4"
    STATUS="0"
    STATUS_CODE="0"
    USER="root"
    OS_LOGIN=""
    HOST="localhost"
    IP="127.0.0.1"
    COMMAND_CLASS="connect"
    CONNECTION_TYPE="SSL/TLS"/>
  <AUDIT_RECORD
    TIMESTAMP="2019-10-03T14:25:32 UTC"
    RECORD_ID="12_2019-10-03T14:25:00"
    NAME="NoAudit"
    SERVER_ID="1"/>
</AUDIT>
```

The audit log file is written as XML, using UTF-8 (up to 4 bytes per character). The root element is `<AUDIT>`. The root element contains `<AUDIT_RECORD>` elements, each of which provides information about an audited event. When the audit log plugin begins writing a new log file, it writes the XML declaration and opening `<AUDIT>` root element tag. When the plugin closes a log file, it writes the closing `</AUDIT>` root element tag. The closing tag is not present while the file is open.

Attributes of `<AUDIT_RECORD>` elements have these characteristics:

* Some attributes appear in every `<AUDIT_RECORD>` element. Others are optional and may appear depending on the audit record type.

* Order of attributes within an `<AUDIT_RECORD>` element is not guaranteed.

* Attribute values are not fixed length. Long values may be truncated as indicated in the attribute descriptions given later.

* The `<`, `>`, `"`, and `&` characters are encoded as `&lt;`, `&gt;`, `&quot;`, and `&amp;`, respectively. NUL bytes (U+00) are encoded as the `?` character.

* Characters not valid as XML characters are encoded using numeric character references. Valid XML characters are:

  ```sql
  #x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
  ```

The following attributes are mandatory in every `<AUDIT_RECORD>` element:

* `NAME`

  A string representing the type of instruction that generated the audit event, such as a command that the server received from a client.

  Example: `NAME="Query"`

  Some common `NAME` values:

  ```sql
  Audit    When auditing starts, which may be server startup time
  Connect  When a client connects, also known as logging in
  Query    An SQL statement (executed directly)
  Prepare  Preparation of an SQL statement; usually followed by Execute
  Execute  Execution of an SQL statement; usually follows Prepare
  Shutdown Server shutdown
  Quit     When a client disconnects
  NoAudit  Auditing has been turned off
  ```

  The possible values are `Audit`, `Binlog Dump`, `Change user`, `Close stmt`, `Connect Out`, `Connect`, `Create DB`, `Daemon`, `Debug`, `Delayed insert`, `Drop DB`, `Execute`, `Fetch`, `Field List`, `Init DB`, `Kill`, `Long Data`, `NoAudit`, `Ping`, `Prepare`, `Processlist`, `Query`, `Quit`, `Refresh`, `Register Slave`, `Reset stmt`, `Set option`, `Shutdown`, `Sleep`, `Statistics`, `Table Dump`, `TableDelete`, `TableInsert`, `TableRead`, `TableUpdate`, `Time`.

  Many of these values correspond to the `COM_xxx` command values listed in the `my_command.h` header file. For example, `"Create DB"` and `"Change user"` correspond to `COM_CREATE_DB` and `COM_CHANGE_USER`, respectively.

  Events having `NAME` values of `TableXXX` accompany `Query` events. For example, the following statement generates one `Query` event, two `TableRead` events, and a `TableInsert` events:

  ```sql
  INSERT INTO t3 SELECT t1.* FROM t1 JOIN t2;
  ```

  Each `TableXXX` event has `TABLE` and `DB` attributes to identify the table to which the event refers and the database that contains the table.

* `RECORD_ID`

  A unique identifier for the audit record. The value is composed from a sequence number and timestamp, in the format `SEQ_TIMESTAMP`. When the audit log plugin opens the audit log file, it initializes the sequence number to the size of the audit log file, then increments the sequence by 1 for each record logged. The timestamp is a UTC value in `YYYY-MM-DDThh:mm:ss` format indicating the date and time when the audit log plugin opened the file.

  Example: `RECORD_ID="12_2019-10-03T14:25:00"`

* `TIMESTAMP`

  A string representing a UTC value in `YYYY-MM-DDThh:mm:ss UTC` format indicating the date and time when the audit event was generated. For example, the event corresponding to execution of an SQL statement received from a client has a `TIMESTAMP` value occurring after the statement finishes, not when it was received.

  Example: `TIMESTAMP="2019-10-03T14:25:32 UTC"`

The following attributes are optional in `<AUDIT_RECORD>` elements. Many of them occur only for elements with specific values of the `NAME` attribute.

* `COMMAND_CLASS`

  A string that indicates the type of action performed.

  Example: `COMMAND_CLASS="drop_table"`

  The values correspond to the `statement/sql/xxx` command counters. For example, *`xxx`* is `drop_table` and `select` for `DROP TABLE` and `SELECT` statements, respectively. The following statement displays the possible names:

  ```sql
  SELECT REPLACE(EVENT_NAME, 'statement/sql/', '') AS name
  FROM performance_schema.events_statements_summary_global_by_event_name
  WHERE EVENT_NAME LIKE 'statement/sql/%'
  ORDER BY name;
  ```

* `CONNECTION_ID`

  An unsigned integer representing the client connection identifier. This is the same as the value returned by the `CONNECTION_ID()` function within the session.

  Example: `CONNECTION_ID="127"`

* `CONNECTION_TYPE`

  The security state of the connection to the server. Permitted values are `TCP/IP` (TCP/IP connection established without encryption), `SSL/TLS` (TCP/IP connection established with encryption), `Socket` (Unix socket file connection), `Named Pipe` (Windows named pipe connection), and `Shared Memory` (Windows shared memory connection).

  Example: `CONNECTION_TYPE="SSL/TLS"`

* `DB`

  A string representing a database name.

  Example: `DB="test"`

  For connect events, this attribute indicates the default database; the attribute is empty if there is no default database. For table-access events, the attribute indicates the database to which the accessed table belongs.

* `HOST`

  A string representing the client host name.

  Example: `HOST="localhost"`

* `IP`

  A string representing the client IP address.

  Example: `IP="127.0.0.1"`

* `MYSQL_VERSION`

  A string representing the MySQL server version. This is the same as the value of the `VERSION()` function or `version` system variable.

  Example: `MYSQL_VERSION="5.7.21-log"`

* `OS_LOGIN`

  A string representing the external user name used during the authentication process, as set by the plugin used to authenticate the client. With native (built-in) MySQL authentication, or if the plugin does not set the value, this attribute is empty. The value is the same as that of the `external_user` system variable (see Section 6.2.14, “Proxy Users”).

  Example: `OS_LOGIN="jeffrey"`

* `OS_VERSION`

  A string representing the operating system on which the server was built or is running.

  Example: `OS_VERSION="x86_64-Linux"`

* `PRIV_USER`

  A string representing the user that the server authenticated the client as. This is the user name that the server uses for privilege checking, and it may differ from the `USER` value.

  Example: `PRIV_USER="jeffrey"`

* `PROXY_USER`

  A string representing the proxy user (see Section 6.2.14, “Proxy Users”). The value is empty if user proxying is not in effect.

  Example: `PROXY_USER="developer"`

* `SERVER_ID`

  An unsigned integer representing the server ID. This is the same as the value of the `server_id` system variable.

  Example: `SERVER_ID="1"`

* `SQLTEXT`

  A string representing the text of an SQL statement. The value can be empty. Long values may be truncated. The string, like the audit log file itself, is written using UTF-8 (up to 4 bytes per character), so the value may be the result of conversion. For example, the original statement might have been received from the client as an SJIS string.

  Example: `SQLTEXT="DELETE FROM t1"`

* `STARTUP_OPTIONS`

  A string representing the options that were given on the command line or in option files when the MySQL server was started.

  Example: `STARTUP_OPTIONS="--port=3306 --log_output=FILE"`

* `STATUS`

  An unsigned integer representing the command status: 0 for success, nonzero if an error occurred. This is the same as the value of the `mysql_errno()` C API function. See the description for `STATUS_CODE` for information about how it differs from `STATUS`.

  The audit log does not contain the SQLSTATE value or error message. To see the associations between error codes, SQLSTATE values, and messages, see Server Error Message Reference.

  Warnings are not logged.

  Example: `STATUS="1051"`

* `STATUS_CODE`

  An unsigned integer representing the command status: 0 for success, 1 if an error occurred.

  The `STATUS_CODE` value differs from the `STATUS` value: `STATUS_CODE` is 0 for success and 1 for error, which is compatible with the EZ\_collector consumer for Audit Vault. `STATUS` is the value of the `mysql_errno()` C API function. This is 0 for success and nonzero for error, and thus is not necessarily 1 for error.

  Example: `STATUS_CODE="0"`

* `TABLE`

  A string representing a table name.

  Example: `TABLE="t3"`

* `USER`

  A string representing the user name sent by the client. This may differ from the `PRIV_USER` value.

* `VERSION`

  An unsigned integer representing the version of the audit log file format.

  Example: `VERSION="1"`

##### JSON Audit Log File Format

For JSON-format audit logging (`audit_log_format=JSON`), the log file contents form a `JSON` array with each array element representing an audited event as a `JSON` hash of key-value pairs. Examples of complete event records appear later in this section. The following is an excerpt of partial events:

```sql
[
  {
    "timestamp": "2019-10-03 13:50:01",
    "id": 0,
    "class": "audit",
    "event": "startup",
    ...
  },
  {
    "timestamp": "2019-10-03 15:02:32",
    "id": 0,
    "class": "connection",
    "event": "connect",
    ...
  },
  ...
  {
    "timestamp": "2019-10-03 17:37:26",
    "id": 0,
    "class": "table_access",
    "event": "insert",
      ...
  }
  ...
]
```

The audit log file is written using UTF-8 (up to 4 bytes per character). When the audit log plugin begins writing a new log file, it writes the opening `[` array marker. When the plugin closes a log file, it writes the closing `]` array marker. The closing marker is not present while the file is open.

Items within audit records have these characteristics:

* Some items appear in every audit record. Others are optional and may appear depending on the audit record type.

* Order of items within an audit record is not guaranteed.
* Item values are not fixed length. Long values may be truncated as indicated in the item descriptions given later.

* The `"` and `\` characters are encoded as `\"` and `\\`, respectively.

The following examples show the JSON object formats for different event types (as indicated by the `class` and `event` items), reformatted slightly for readability:

Auditing startup event:

```sql
{ "timestamp": "2019-10-03 14:21:56",
  "id": 0,
  "class": "audit",
  "event": "startup",
  "connection_id": 0,
  "startup_data": { "server_id": 1,
                    "os_version": "i686-Linux",
                    "mysql_version": "5.7.21-log",
                    "args": ["/usr/local/mysql/bin/mysqld",
                             "--loose-audit-log-format=JSON",
                             "--log-error=log.err",
                             "--pid-file=mysqld.pid",
                             "--port=3306" ] } }
```

When the audit log plugin starts as a result of server startup (as opposed to being enabled at runtime), `connection_id` is set to 0, and `account` and `login` are not present.

Auditing shutdown event:

```sql
{ "timestamp": "2019-10-03 14:28:20",
  "id": 3,
  "class": "audit",
  "event": "shutdown",
  "connection_id": 0,
  "shutdown_data": { "server_id": 1 } }
```

When the audit log plugin is uninstalled as a result of server shutdown (as opposed to being disabled at runtime), `connection_id` is set to 0, and `account` and `login` are not present.

Connect or change-user event:

```sql
{ "timestamp": "2019-10-03 14:23:18",
  "id": 1,
  "class": "connection",
  "event": "connect",
  "connection_id": 5,
  "account": { "user": "root", "host": "localhost" },
  "login": { "user": "root", "os": "", "ip": "::1", "proxy": "" },
  "connection_data": { "connection_type": "ssl",
                       "status": 0,
                       "db": "test" } }
```

Disconnect event:

```sql
{ "timestamp": "2019-10-03 14:24:45",
  "id": 3,
  "class": "connection",
  "event": "disconnect",
  "connection_id": 5,
  "account": { "user": "root", "host": "localhost" },
  "login": { "user": "root", "os": "", "ip": "::1", "proxy": "" },
  "connection_data": { "connection_type": "ssl" } }
```

Query event:

```sql
{ "timestamp": "2019-10-03 14:23:35",
  "id": 2,
  "class": "general",
  "event": "status",
  "connection_id": 5,
  "account": { "user": "root", "host": "localhost" },
  "login": { "user": "root", "os": "", "ip": "::1", "proxy": "" },
  "general_data": { "command": "Query",
                    "sql_command": "show_variables",
                    "query": "SHOW VARIABLES",
                    "status": 0 } }
```

Table access event (read, delete, insert, update):

```sql
{ "timestamp": "2019-10-03 14:23:41",
  "id": 0,
  "class": "table_access",
  "event": "insert",
  "connection_id": 5,
  "account": { "user": "root", "host": "localhost" },
  "login": { "user": "root", "os": "", "ip": "127.0.0.1", "proxy": "" },
  "table_access_data": { "db": "test",
                         "table": "t1",
                         "query": "INSERT INTO t1 (i) VALUES(1),(2),(3)",
                         "sql_command": "insert" } }
```

The items in the following list appear at the top level of JSON-format audit records: Each item value is either a scalar or a `JSON` hash. For items that have a hash value, the description lists only the item names within that hash. For more complete descriptions of second-level hash items, see later in this section.

* `account`

  The MySQL account associated with the event. The value is a hash containing these items equivalent to the value of the `CURRENT_USER()` function within the section: `user`, `host`.

  Example:

  ```sql
  "account": { "user": "root", "host": "localhost" }
  ```

* `class`

  A string representing the event class. The class defines the type of event, when taken together with the `event` item that specifies the event subclass.

  Example:

  ```sql
  "class": "connection"
  ```

  The following table shows the permitted combinations of `class` and `event` values.

  **Table 6.25 Audit Log Class and Event Combinations**

  <table summary="Permitted combinations of audit log class and event values."><col style="width: 30%"/><col style="width: 40%"/><thead><tr> <th>Class Value</th> <th>Permitted Event Values</th> </tr></thead><tbody><tr> <td><code>audit</code></td> <td><code>startup</code>, <code>shutdown</code></td> </tr><tr> <td><code>connection</code></td> <td><code>connect</code>, <code>change_user</code>, <code>disconnect</code></td> </tr><tr> <td><code>general</code></td> <td><code>status</code></td> </tr><tr> <td><code>table_access_data</code></td> <td><code>read</code>, <code>delete</code>, <code>insert</code>, <code>update</code></td> </tr></tbody></table>

* `connection_data`

  Information about a client connection. The value is a hash containing these items: `connection_type`, `status`, `db`. This item occurs only for audit records with a `class` value of `connection`.

  Example:

  ```sql
  "connection_data": { "connection_type": "ssl",
                       "status": 0,
                       "db": "test" }
  ```

* `connection_id`

  An unsigned integer representing the client connection identifier. This is the same as the value returned by the `CONNECTION_ID()` function within the session.

  Example:

  ```sql
  "connection_id": 5
  ```

* `event`

  A string representing the subclass of the event class. The subclass defines the type of event, when taken together with the `class` item that specifies the event class. For more information, see the `class` item description.

  Example:

  ```sql
  "event": "connect"
  ```

* `general_data`

  Information about an executed statement or command. The value is a hash containing these items: `command`, `sql_command`, `query`, `status`. This item occurs only for audit records with a `class` value of `general`.

  Example:

  ```sql
  "general_data": { "command": "Query",
                    "sql_command": "show_variables",
                    "query": "SHOW VARIABLES",
                    "status": 0 }
  ```

* `id`

  An unsigned integer representing an event ID.

  Example:

  ```sql
  "id": 2
  ```

  For audit records that have the same `timestamp` value, their `id` values distinguish them and form a sequence. Within the audit log, `timestamp`/`id` pairs are unique. These pairs are bookmarks that identify event locations within the log.

* `login`

  Information indicating how a client connected to the server. The value is a hash containing these items: `user`, `os`, `ip`, `proxy`.

  Example:

  ```sql
  "login": { "user": "root", "os": "", "ip": "::1", "proxy": "" }
  ```

* `shutdown_data`

  Information pertaining to audit log plugin termination. The value is a hash containing these items: `server_id` This item occurs only for audit records with `class` and `event` values of `audit` and `shutdown`, respectively.

  Example:

  ```sql
  "shutdown_data": { "server_id": 1 }
  ```

* `startup_data`

  Information pertaining to audit log plugin initialization. The value is a hash containing these items: `server_id`, `os_version`, `mysql_version`, `args`. This item occurs only for audit records with `class` and `event` values of `audit` and `startup`, respectively.

  Example:

  ```sql
  "startup_data": { "server_id": 1,
                    "os_version": "i686-Linux",
                    "mysql_version": "5.7.21-log",
                    "args": ["/usr/local/mysql/bin/mysqld",
                             "--loose-audit-log-format=JSON",
                             "--log-error=log.err",
                             "--pid-file=mysqld.pid",
                             "--port=3306" ] }
  ```

* `table_access_data`

  Information about an access to a table. The value is a hash containing these items: `db`, `table`, `query`, `sql_command`, This item occurs only for audit records with a `class` value of `table_access`.

  Example:

  ```sql
  "table_access_data": { "db": "test",
                         "table": "t1",
                         "query": "INSERT INTO t1 (i) VALUES(1),(2),(3)",
                         "sql_command": "insert" }
  ```

* `time`

  This field is similar to that in the `timestamp` field, but the value is an integer and represents the UNIX timestamp value indicating the date and time when the audit event was generated.

  Example:

  ```sql
  "time" : 1618498687
  ```

  The `time` field occurs in JSON-format log files only if the `audit_log_format_unix_timestamp` system variable is enabled.

* `timestamp`

  A string representing a UTC value in *`YYYY-MM-DD hh:mm:ss`* format indicating the date and time when the audit event was generated. For example, the event corresponding to execution of an SQL statement received from a client has a `timestamp` value occurring after the statement finishes, not when it was received.

  Example:

  ```sql
  "timestamp": "2019-10-03 13:50:01"
  ```

  For audit records that have the same `timestamp` value, their `id` values distinguish them and form a sequence. Within the audit log, `timestamp`/`id` pairs are unique. These pairs are bookmarks that identify event locations within the log.

These items appear within hash values associated with top-level items of JSON-format audit records:

* `args`

  An array of options that were given on the command line or in option files when the MySQL server was started. The first option is the path to the server executable.

  Example:

  ```sql
  "args": ["/usr/local/mysql/bin/mysqld",
           "--loose-audit-log-format=JSON",
           "--log-error=log.err",
           "--pid-file=mysqld.pid",
           "--port=3306" ]
  ```

* `command`

  A string representing the type of instruction that generated the audit event, such as a command that the server received from a client.

  Example:

  ```sql
  "command": "Query"
  ```

* `connection_type`

  The security state of the connection to the server. Permitted values are `tcp/ip` (TCP/IP connection established without encryption), `ssl` (TCP/IP connection established with encryption), `socket` (Unix socket file connection), `named_pipe` (Windows named pipe connection), and `shared_memory` (Windows shared memory connection).

  Example:

  ```sql
  "connection_type": "tcp/tcp"
  ```

* `db`

  A string representing a database name. For `connection_data`, it is the default database. For `table_access_data`, it is the table database.

  Example:

  ```sql
  "db": "test"
  ```

* `host`

  A string representing the client host name.

  Example:

  ```sql
  "host": "localhost"
  ```

* `ip`

  A string representing the client IP address.

  Example:

  ```sql
  "ip": "::1"
  ```

* `mysql_version`

  A string representing the MySQL server version. This is the same as the value of the `VERSION()` function or `version` system variable.

  Example:

  ```sql
  "mysql_version": "5.7.21-log"
  ```

* `os`

  A string representing the external user name used during the authentication process, as set by the plugin used to authenticate the client. With native (built-in) MySQL authentication, or if the plugin does not set the value, this attribute is empty. The value is the same as that of the `external_user` system variable. See Section 6.2.14, “Proxy Users”.

  Example:

  ```sql
  "os": "jeffrey"
  ```

* `os_version`

  A string representing the operating system on which the server was built or is running.

  Example:

  ```sql
  "os_version": "i686-Linux"
  ```

* `proxy`

  A string representing the proxy user (see Section 6.2.14, “Proxy Users”). The value is empty if user proxying is not in effect.

  Example:

  ```sql
  "proxy": "developer"
  ```

* `query`

  A string representing the text of an SQL statement. The value can be empty. Long values may be truncated. The string, like the audit log file itself, is written using UTF-8 (up to 4 bytes per character), so the value may be the result of conversion. For example, the original statement might have been received from the client as an SJIS string.

  Example:

  ```sql
  "query": "DELETE FROM t1"
  ```

* `server_id`

  An unsigned integer representing the server ID. This is the same as the value of the `server_id` system variable.

  Example:

  ```sql
  "server_id": 1
  ```

* `sql_command`

  A string that indicates the SQL statement type.

  Example:

  ```sql
  "sql_command": "insert"
  ```

  The values correspond to the `statement/sql/xxx` command counters. For example, *`xxx`* is `drop_table` and `select` for `DROP TABLE` and `SELECT` statements, respectively. The following statement displays the possible names:

  ```sql
  SELECT REPLACE(EVENT_NAME, 'statement/sql/', '') AS name
  FROM performance_schema.events_statements_summary_global_by_event_name
  WHERE EVENT_NAME LIKE 'statement/sql/%'
  ORDER BY name;
  ```

* `status`

  An unsigned integer representing the command status: 0 for success, nonzero if an error occurred. This is the same as the value of the `mysql_errno()` C API function.

  The audit log does not contain the SQLSTATE value or error message. To see the associations between error codes, SQLSTATE values, and messages, see Server Error Message Reference.

  Warnings are not logged.

  Example:

  ```sql
  "status": 1051
  ```

* `table`

  A string representing a table name.

  Example:

  ```sql
  "table": "t1"
  ```

* `user`

  A string representing a user name. The meaning differs depending on the item within which `user` occurs:

  + Within `account` items, `user` is a string representing the user that the server authenticated the client as. This is the user name that the server uses for privilege checking.

  + Within `login` items, `user` is a string representing the user name sent by the client.

  Example:

  ```sql
  "user": "root"
  ```


#### 6.4.5.5 Configuring Audit Logging Characteristics

This section describes how to configure audit logging characteristics, such as the file to which the audit log plugin writes events, the format of written events, whether to enable log file compression and encryption, and space management.

* Naming Conventions for Audit Log Files
* Selecting Audit Log File Format
* Compressing Audit Log Files
* Encrypting Audit Log Files
* Manually Uncompressing and Decrypting Audit Log Files
* Space Management of Audit Log Files
* Write Strategies for Audit Logging

For additional information about the functions and system variables that affect audit logging, see Audit Log Functions, and Audit Log Options and Variables.

The audit log plugin can also control which audited events are written to the audit log file, based on event content or the account from which events originate. See Section 6.4.5.7, “Audit Log Filtering”.

##### Naming Conventions for Audit Log Files

To configure the audit log file name, set the `audit_log_file` system variable at server startup. The default name is `audit.log` in the server data directory. For best security, write the audit log to a directory accessible only to the MySQL server and to users with a legitimate reason to view the log.

As of MySQL 5.7.21, the plugin interprets the `audit_log_file` value as composed of an optional leading directory name, a base name, and an optional suffix. If compression or encryption are enabled, the effective file name (the name actually used to create the log file) differs from the configured file name because it has additional suffixes:

* If compression is enabled, the plugin adds a suffix of `.gz`.

* If encryption is enabled, the plugin adds a suffix of `.enc`. The audit log plugin stores the encryption password in the keyring (see Encrypting Audit Log Files.

The effective audit log file name is the name resulting from the addition of applicable compression and encryption suffixes to the configured file name. For example, if the configured `audit_log_file` value is `audit.log`, the effective file name is one of the values shown in the following table.

<table summary="audit_log effective file names for various combinations of the compression and encryption features."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Enabled Features</th> <th>Effective File Name</th> </tr></thead><tbody><tr> <td>No compression or encryption</td> <td><code>audit.log</code></td> </tr><tr> <td>Compression</td> <td><code>audit.log.gz</code></td> </tr><tr> <td>Encryption</td> <td><code>audit.log.enc</code></td> </tr><tr> <td>Compression, encryption</td> <td><code>audit.log.gz.enc</code></td> </tr></tbody></table>

Prior to MySQL 5.7.21, the configured and effective log file names are the same. For example, if the configured `audit_log_file` value is `audit.log`, the audit log plugin writes to `audit.log`.

The audit log plugin performs certain actions during initialization and termination based on the effective audit log file name:

As of MySQL 5.7.21:

* During initialization, the plugin checks whether a file with the audit log file name already exists and renames it if so. (In this case, the plugin assumes that the previous server invocation exited unexpectedly with the audit log plugin running.) The plugin then writes to a new empty audit log file.

* During termination, the plugin renames the audit log file.
* File renaming (whether during plugin initialization or termination) occurs according to the usual rules for automatic size-based log file rotation; see Manual Audit Log File Rotation.

Prior to MySQL 5.7.21, only the XML log formats are available and the plugin performs rudimentary integrity checking:

* During initialization, the plugin checks whether the file ends with an `</AUDIT>` tag and truncates the tag before writing any `<AUDIT_RECORD>` elements. If the log file exists but does not end with `</AUDIT>` or the `</AUDIT>` tag cannot be truncated, the plugin considers the file malformed and renames it. (Such renaming can occur if the server exits unexpectedly with the audit log plugin running.) The plugin then writes to a new empty audit log file.

* At termination, no file renaming occurs.
* When renaming occurs at plugin initialization, the renamed file has `.corrupted`, a timestamp, and `.xml` added to the end. For example, if the file name is `audit.log`, the plugin renames it to a value such as `audit.log.corrupted.15081807937726520.xml`. The timestamp value is similar to a Unix timestamp, with the last 7 digits representing the fractional second part. For information about interpreting the timestamp, see Space Management of Audit Log Files.

##### Selecting Audit Log File Format

To configure the audit log file format, set the `audit_log_format` system variable at server startup. These formats are available:

* `NEW`: New-style XML format. This is the default.

* `OLD`: Old-style XML format.
* `JSON`: JSON format.

For details about each format, see Section 6.4.5.4, “Audit Log File Formats”.

If you change `audit_log_format`, it is recommended that you also change `audit_log_file`. For example, if you set `audit_log_format` to `JSON`, set `audit_log_file` to `audit.json`. Otherwise, newer log files will have a different format than older files, but they will all have the same base name with nothing to indicate when the format changed.

Note

Prior to MySQL 5.7.21, changing the value of `audit_log_format` can result in writing log entries in one format to an existing log file that contains entries in a different format. To avoid this issue, use the following procedure:

1. Stop the server.
2. Either change the value of the `audit_log_file` system variable so the plugin writes to a different file, or rename the current audit log file manually.

3. Restart the server with the new value of `audit_log_format`. The audit log plugin creates a new log file and writes entries to it in the selected format.

##### Compressing Audit Log Files

Audit log file compression is available as of MySQL 5.7.21. Compression can be enabled for any log format.

To configure audit log file compression, set the `audit_log_compression` system variable at server startup. Permitted values are `NONE` (no compression; the default) and `GZIP` (GNU Zip compression).

If both compression and encryption are enabled, compression occurs before encryption. To recover the original file manually, first decrypt it, then uncompress it. See Manually Uncompressing and Decrypting Audit Log Files.

##### Encrypting Audit Log Files

Audit log file encryption is available as of MySQL 5.7.21. Encryption can be enabled for any log format. Encryption is based on a user-defined password (with the exception of the initial password, which the audit log plugin generates). To use this feature, the MySQL keyring must be enabled because audit logging uses it for password storage. Any keyring plugin can be used; for instructions, see Section 6.4.4, “The MySQL Keyring”.

To configure audit log file encryption, set the `audit_log_encryption` system variable at server startup. Permitted values are `NONE` (no encryption; the default) and `AES` (AES-256-CBC cipher encryption).

To set or get an encryption password at runtime, use these audit log functions:

* To set the current encryption password, invoke `audit_log_encryption_password_set()`. This function stores the new password in the keyring. If encryption is enabled, it also performs a log file rotation operation that renames the current log file, and begins a new log file encrypted with the password. File renaming occurs according to the usual rules for automatic size-based log file rotation; see Manual Audit Log File Rotation.

  Previously written audit log files are not re-encrypted with the new password. Keep a record of the previous password should you need to decrypt those files manually.

* To get the current encryption password, invoke `audit_log_encryption_password_get()`, which retrieves the password from the keyring.

For additional information about audit log encryption functions, see Audit Log Functions.

When the audit log plugin initializes, if it finds that log file encryption is enabled, it checks whether the keyring contains an audit log encryption password. If not, the plugin automatically generates a random initial encryption password and stores it in the keyring. To discover this password, invoke `audit_log_encryption_password_get()`.

If both compression and encryption are enabled, compression occurs before encryption. To recover the original file manually, first decrypt it, then uncompress it. See Manually Uncompressing and Decrypting Audit Log Files.

##### Manually Uncompressing and Decrypting Audit Log Files

Audit log files can be uncompressed and decrypted using standard tools. This should be done only for log files that have been closed (archived) and are no longer in use, not for the log file that the audit log plugin is currently writing. You can recognize archived log files because they have been renamed by the audit log plugin to include a timestamp in the file name just after the base name.

For this discussion, assume that `audit_log_file` is set to `audit.log`. In that case, an archived audit log file has one of the names shown in the following table.

<table summary="audit_log archived file names for various combinations of the compression and encryption features."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Enabled Features</th> <th>Archived File Name</th> </tr></thead><tbody><tr> <td>No compression or encryption</td> <td><code>audit.<code>timestamp</code>.log</code></td> </tr><tr> <td>Compression</td> <td><code>audit.<code>timestamp</code>.log.gz</code></td> </tr><tr> <td>Encryption</td> <td><code>audit.<code>timestamp</code>.log.enc</code></td> </tr><tr> <td>Compression, encryption</td> <td><code>audit.<code>timestamp</code>.log.gz.enc</code></td> </tr></tbody></table>

To uncompress a compressed log file manually, use **gunzip**, **gzip -d**, or equivalent command. For example:

```sql
gunzip -c audit.timestamp.log.gz > audit.timestamp.log
```

To decrypt an encrypted log file manually, use the **openssl** command. For example:

```sql
openssl enc -d -aes-256-cbc -pass pass:password -md sha256
    -in audit.timestamp.log.enc
    -out audit.timestamp.log
```

If both compression and encryption are enabled for audit logging, compression occurs before encryption. In this case, the file name has `.gz` and `.enc` suffixes added, corresponding to the order in which those operations occur. To recover the original file manually, perform the operations in reverse. That is, first decrypt the file, then uncompress it:

```sql
openssl enc -d -aes-256-cbc -pass pass:password -md sha256
    -in audit.timestamp.log.gz.enc
    -out audit.timestamp.log.gz
gunzip -c audit.timestamp.log.gz > audit.timestamp.log
```

##### Space Management of Audit Log Files

The audit log file has the potential to grow quite large and consume a great deal of disk space. To manage the space used, log rotation can be employed. This involves rotating the current log file by renaming it, then opening a new current log file using the original name. Rotation can be performed manually, or configured to occur automatically.

To configure audit log file space management, use the following system variables:

* If `audit_log_rotate_on_size` is 0 (the default), automatic log file rotation is disabled:

  + No rotation occurs unless performed manually.
  + To rotate the current file, manually rename it, then enable `audit_log_flush` to close it and open a new current log file using the original name; see Manual Audit Log File Rotation.

* If `audit_log_rotate_on_size` is greater than 0, automatic audit log file rotation is enabled:

  + Automatic rotation occurs when a write to the current log file causes its size to exceed the `audit_log_rotate_on_size` value, as well as under certain other conditions; see Automatic Audit Log File Rotation. When rotation occurs, the audit log plugin renames the current log file and opens a new current log file using the original name.

  + With automatic rotation enabled, `audit_log_flush` has no effect.

Note

For JSON-format log files, rotation also occurs when the value of the `audit_log_format_unix_timestamp` system variable is changed at runtime. However, this does not occur for space-management purposes, but rather so that, for a given JSON-format log file, all records in the file either do or do not include the `time` field.

Note

Rotated (renamed) log files are not removed automatically. For example, with size-based log file rotation, renamed log files have unique names and accumulate indefinitely. They do not rotate off the end of the name sequence. To avoid excessive use of space, remove old files periodically, backing them up first as necessary.

The following sections describe log file rotation in greater detail.

* Manual Audit Log File Rotation
* Automatic Audit Log File Rotation

###### Manual Audit Log File Rotation

If `audit_log_rotate_on_size` is 0 (the default), no log rotation occurs unless performed manually. In this case, the audit log plugin closes and reopens the log file when the `audit_log_flush` value changes from disabled to enabled. Log file renaming must be done externally to the server. Suppose that the log file name is `audit.log` and you want to maintain the three most recent log files, cycling through the names `audit.log.1` through `audit.log.3`. On Unix, perform rotation manually like this:

1. From the command line, rename the current log files:

   ```sql
   mv audit.log.2 audit.log.3
   mv audit.log.1 audit.log.2
   mv audit.log audit.log.1
   ```

   This strategy overwrites the current `audit.log.3` contents, placing a bound on the number of archived log files and the space they use.

2. At this point, the plugin is still writing to the current log file, which has been renamed to `audit.log.1`. Connect to the server and flush the log file so the plugin closes it and reopens a new `audit.log` file:

   ```sql
   SET GLOBAL audit_log_flush = ON;
   ```

   `audit_log_flush` is special in that its value remains `OFF` so that you need not disable it explicitly before enabling it again to perform another flush.

Note

For JSON-format logging, renaming audit log files manually makes them unavailable to the log-reading functions because the audit log plugin can no longer determine that they are part of the log file sequence (see Section 6.4.5.6, “Reading Audit Log Files”). Consider setting `audit_log_rotate_on_size` greater than 0 to use size-based rotation instead.

###### Automatic Audit Log File Rotation

If `audit_log_rotate_on_size` is greater than 0, setting `audit_log_flush` has no effect. Instead, whenever a write to the current log file causes its size to exceed the `audit_log_rotate_on_size` value, the audit log plugin automatically renames the current log file and opens a new current log file using the original name.

Automatic size-based rotation also occurs under these conditions:

* During plugin initialization, if a file with the audit log file name already exists (see Naming Conventions for Audit Log Files).

* During plugin termination.
* When the `audit_log_encryption_password_set()` function is called to set the encryption password.

The plugin renames the original file as follows:

* As of MySQL 5.7.21, the renamed file has a timestamp inserted after its base name and before its suffix. For example, if the file name is `audit.log`, the plugin renames it to a value such as `audit.20180115T140633.log`. The timestamp is a UTC value in `YYYYMMDDThhmmss` format. For XML logging, the timestamp indicates rotation time. For JSON logging, the timestamp is that of the last event written to the file.

  If log files are encrypted, the original file name already contains a timestamp indicating the encryption password creation time (see Naming Conventions for Audit Log Files). In this case, the file name after rotation contains two timestamps. For example, an encrypted log file named `audit.log.20180110T130749-1.enc` is renamed to a value such as `audit.20180115T140633.log.20180110T130749-1.enc`.

* Prior to MySQL 5.7.21, the renamed file has a timestamp and `.xml` added to the end. For example, if the file name is `audit.log`, the plugin renames it to a value such as `audit.log.15159344437726520.xml`. The timestamp value is similar to a Unix timestamp, with the last 7 digits representing the fractional second part. By inserting a decimal point, the value can be interpreted using the `FROM_UNIXTIME()` function:

  ```sql
  mysql> SELECT FROM_UNIXTIME(1515934443.7726520);
  +-----------------------------------+
  | FROM_UNIXTIME(1515934443.7726520) |
  +-----------------------------------+
  | 2018-01-14 06:54:03.772652        |
  +-----------------------------------+
  ```

##### Write Strategies for Audit Logging

The audit log plugin can use any of several strategies for log writes. Regardless of strategy, logging occurs on a best-effort basis, with no guarantee of consistency.

To specify a write strategy, set the `audit_log_strategy` system variable at server startup. By default, the strategy value is `ASYNCHRONOUS` and the plugin logs asynchronously to a buffer, waiting if the buffer is full. You can tell the plugin not to wait (`PERFORMANCE`) or to log synchronously, either using file system caching (`SEMISYNCHRONOUS`) or forcing output with a `sync()` call after each write request (`SYNCHRONOUS`).

For asynchronous write strategy, the `audit_log_buffer_size` system variable is the buffer size in bytes. Set this variable at server startup to change the buffer size. The plugin uses a single buffer, which it allocates when it initializes and removes when it terminates. The plugin does not allocate this buffer for nonasynchronous write strategies.

Asynchronous logging strategy has these characteristics:

* Minimal impact on server performance and scalability.
* Blocking of threads that generate audit events for the shortest possible time; that is, time to allocate the buffer plus time to copy the event to the buffer.

* Output goes to the buffer. A separate thread handles writes from the buffer to the log file.

With asynchronous logging, the integrity of the log file may be compromised if a problem occurs during a write to the file or if the plugin does not shut down cleanly (for example, in the event that the server host exits unexpectedly). To reduce this risk, set `audit_log_strategy` to use synchronous logging.

A disadvantage of `PERFORMANCE` strategy is that it drops events when the buffer is full. For a heavily loaded server, the audit log may have events missing.


#### 6.4.5.6 Reading Audit Log Files

The audit log plugin supports functions that provide an SQL interface for reading JSON-format audit log files. (This capability does not apply to log files written in other formats.)

When the audit log plugin initializes and is configured for JSON logging, it uses the directory containing the current audit log file as the location to search for readable audit log files. The plugin determines the file location, base name, and suffix from the value of the `audit_log_file` system variable, then looks for files with names that match the following pattern, where `[...]` indicates optional file name parts:

```sql
basename[.timestamp].suffix[.gz][.enc]
```

If a file name ends with `.enc`, the file is encrypted and reading its unencrypted contents requires a decryption password obtained from the keyring. For more information about encrypted audit log files, see Encrypting Audit Log Files.

The plugin ignores files that have been renamed manually and do not match the pattern, and files that were encrypted with a password no longer available in the keyring. The plugin opens each remaining candidate file, verifies that the file actually contains `JSON` audit events, and sorts the files using the timestamps from the first event of each file. The result is a sequence of files that are subject to access using the log-reading functions:

* `audit_log_read()` reads events from the audit log or closes the reading process.

* `audit_log_read_bookmark()` returns a bookmark for the most recently written audit log event. This bookmark is suitable for passing to `audit_log_read()` to indicate where to begin reading.

`audit_log_read()` takes an optional `JSON` string argument, and the result returned from a successful call to either function is a `JSON` string.

To use the functions to read the audit log, follow these principles:

* Call `audit_log_read()` to read events beginning from a given position or the current position, or to close reading:

  + To initialize an audit log read sequence, pass an argument that indicates the position at which to begin. One way to do so is to pass the bookmark returned by `audit_log_read_bookmark()`:

    ```sql
    SELECT audit_log_read(audit_log_read_bookmark());
    ```

  + To continue reading from the current position in the sequence, call `audit_log_read()` with no position specified:

    ```sql
    SELECT audit_log_read();
    ```

  + To explicitly close the read sequence, pass a `JSON` `null` argument:

    ```sql
    SELECT audit_log_read('null');
    ```

    It is unnecessary to close reading explicitly. Reading is closed implicitly when the session ends or a new read sequence is initialized by calling `audit_log_read()` with an argument that indicates the position at which to begin.

* A successful call to `audit_log_read()` to read events returns a `JSON` string containing an array of audit events:

  + If the final value of the returned array is not a `JSON` `null` value, there are more events following those just read and `audit_log_read()` can be called again to read more of them.

  + If the final value of the returned array is a `JSON` `null` value, there are no more events left to be read in the current read sequence.

  Each non-`null` array element is an event represented as a `JSON` hash. For example:

  ```sql
  [
    {
      "timestamp": "2020-05-18 13:39:33", "id": 0,
      "class": "connection", "event": "connect",
      ...
    },
    {
      "timestamp": "2020-05-18 13:39:33", "id": 1,
      "class": "general", "event": "status",
      ...
    },
    {
      "timestamp": "2020-05-18 13:39:33", "id": 2,
      "class": "connection", "event": "disconnect",
      ...
    },
    null
  ]
  ```

  For more information about the content of JSON-format audit events, see JSON Audit Log File Format.

* An `audit_log_read()` call to read events that does not specify a position produces an error under any of these conditions:

  + A read sequence has not yet been initialized by passing a position to `audit_log_read()`.

  + There are no more events left to be read in the current read sequence; that is, `audit_log_read()` previously returned an array ending with a `JSON` `null` value.

  + The most recent read sequence has been closed by passing a `JSON` `null` value to `audit_log_read()`.

  To read events under those conditions, it is necessary to first initialize a read sequence by calling `audit_log_read()` with an argument that specifies a position.

To specify a position to `audit_log_read()`, pass a bookmark, which is a `JSON` hash containing `timestamp` and `id` elements that uniquely identify a particular event. Here is an example bookmark, obtained by calling the `audit_log_read_bookmark()` function:

```sql
mysql> SELECT audit_log_read_bookmark();
+-------------------------------------------------+
| audit_log_read_bookmark()                       |
+-------------------------------------------------+
| { "timestamp": "2020-05-18 21:03:44", "id": 0 } |
+-------------------------------------------------+
```

Passing the current bookmark to `audit_log_read()` initializes event reading beginning at the bookmark position:

```sql
mysql> SELECT audit_log_read(audit_log_read_bookmark());
+-----------------------------------------------------------------------+
| audit_log_read(audit_log_read_bookmark())                             |
+-----------------------------------------------------------------------+
| [ {"timestamp":"2020-05-18 22:41:24","id":0,"class":"connection", ... |
+-----------------------------------------------------------------------+
```

The argument to `audit_log_read()` is optional. If present, it can be a `JSON` `null` value to close the read sequence, or a `JSON` hash.

Within a hash argument to `audit_log_read()`, items are optional and control aspects of the read operation such as the position at which to begin reading or how many events to read. The following items are significant (other items are ignored):

* `timestamp`, `id`: The position within the audit log of the first event to read. If the position is omitted from the argument, reading continues from the current position. The `timestamp` and `id` items together comprise a bookmark that uniquely identify a particular event. If an `audit_log_read()` argument includes either item, it must include both to completely specify a position or an error occurs.

* `max_array_length`: The maximum number of events to read from the log. If this item is omitted, the default is to read to the end of the log or until the read buffer is full, whichever comes first.

Example arguments accepted by `audit_log_read()`:

* Read events starting with the event that has the exact timestamp and event ID:

  ```sql
  audit_log_read('{ "timestamp": "2020-05-24 12:30:00", "id": 0 }')
  ```

* Like the previous example, but read at most 3 events:

  ```sql
  audit_log_read('{ "timestamp": "2020-05-24 12:30:00", "id": 0, "max_array_length": 3 }')
  ```

* Read events from the current position in the read sequence:

  ```sql
  audit_log_read()
  ```

* Read at most 5 events beginning at the current position in the read sequence:

  ```sql
  audit_log_read('{ "max_array_length": 5 }')
  ```

* Close the current read sequence:

  ```sql
  audit_log_read('null')
  ```

To use the binary `JSON` string with functions that require a nonbinary string (such as functions that manipulate `JSON` values), perform a conversion to `utf8mb4`. Suppose that a call to obtain a bookmark produces this value:

```sql
mysql> SET @mark := audit_log_read_bookmark();
mysql> SELECT @mark;
+-------------------------------------------------+
| @mark                                           |
+-------------------------------------------------+
| { "timestamp": "2020-05-18 16:10:28", "id": 2 } |
+-------------------------------------------------+
```

Calling `audit_log_read()` with that argument can return multiple events. To limit `audit_log_read()` to reading at most *`N`* events, convert the string to `utf8mb4`, then add to it a `max_array_length` item with that value. For example, to read a single event, modify the string as follows:

```sql
mysql> SET @mark = CONVERT(@mark USING utf8mb4);
mysql> SET @mark := JSON_SET(@mark, '$.max_array_length', 1);
mysql> SELECT @mark;
+----------------------------------------------------------------------+
| @mark                                                                |
+----------------------------------------------------------------------+
| {"id": 2, "timestamp": "2020-05-18 16:10:28", "max_array_length": 1} |
+----------------------------------------------------------------------+
```

The modified string, when passed to `audit_log_read()`, produces a result containing at most one event, no matter how many are available.

To read a specific number of events beginning at the current position, pass a `JSON` hash that includes a `max_array_length` value but no position. This statement invoked repeatedly returns five events each time until no more events are available:

```sql
SELECT audit_log_read('{"max_array_length": 5}');
```

To set a limit on the number of bytes that `audit_log_read()` reads, set the `audit_log_read_buffer_size` system variable. As of MySQL 5.7.23, this variable has a default of 32KB and can be set at runtime. Each client should set its session value of `audit_log_read_buffer_size` appropriately for its use of `audit_log_read()`. Prior to MySQL 5.7.23, `audit_log_read_buffer_size` has a default of 1MB, affects all clients, and can be changed only at server startup.

For additional information about audit log-reading functions, see Audit Log Functions.


#### 6.4.5.7 Audit Log Filtering

Note

As of MySQL 5.7.13, for audit log filtering to work as described here, the audit log plugin *and the accompanying audit tables and functions* must be installed. If the plugin is installed without the accompanying audit tables and functions needed for rule-based filtering, the plugin operates in legacy filtering mode, described in Section 6.4.5.10, “Legacy Mode Audit Log Filtering”. Legacy mode is filtering behavior as it was prior to MySQL 5.7.13; that is, before the introduction of rule-based filtering.

* Properties of Audit Log Filtering
* Constraints on Audit Log Filtering Functions
* Using Audit Log Filtering Functions

##### Properties of Audit Log Filtering

The audit log plugin has the capability of controlling logging of audited events by filtering them:

* Audited events can be filtered using these characteristics:

  + User account
  + Audit event class
  + Audit event subclass
  + Audit event fields such as those that indicate operation status or SQL statement executed

* Audit filtering is rule based:

  + A filter definition creates a set of auditing rules. Definitions can be configured to include or exclude events for logging based on the characteristics just described.

  + As of MySQL 5.7.20, filter rules have the capability of blocking (aborting) execution of qualifying events, in addition to existing capabilities for event logging.

  + Multiple filters can be defined, and any given filter can be assigned to any number of user accounts.

  + It is possible to define a default filter to use with any user account that has no explicitly assigned filter.

  For information about writing filtering rules, see Section 6.4.5.8, “Writing Audit Log Filter Definitions”.

* Audit log filters can be defined and modified using an SQL interface based on function calls. By default, audit log filter definitions are stored in the `mysql` system database, and you can display audit filters by querying the `mysql.audit_log_filter` table. It is possible to use a different database for this purpose, in which case you should query the `database_name.audit_log_filter` table instead. See Section 6.4.5.2, “Installing or Uninstalling MySQL Enterprise Audit”, for more information.

* Within a given session, the value of the read-only `audit_log_filter_id` system variable indicates whether a filter is assigned to the session.

Note

By default, rule-based audit log filtering logs no auditable events for any users. To log all auditable events for all users, use the following statements, which create a simple filter to enable logging and assign it to the default account:

```sql
SELECT audit_log_filter_set_filter('log_all', '{ "filter": { "log": true } }');
SELECT audit_log_filter_set_user('%', 'log_all');
```

The filter assigned to `%` is used for connections from any account that has no explicitly assigned filter (which initially is true for all accounts).

As previously mentioned, the SQL interface for audit filtering control is function based. The following list briefly summarizes these functions:

* `audit_log_filter_set_filter()`: Define a filter.

* `audit_log_filter_remove_filter()`: Remove a filter.

* `audit_log_filter_set_user()`: Start filtering a user account.

* `audit_log_filter_remove_user()`: Stop filtering a user account.

* `audit_log_filter_flush()`: Flush manual changes to the filter tables to affect ongoing filtering.

For usage examples and complete details about the filtering functions, see Using Audit Log Filtering Functions, and Audit Log Functions.

##### Constraints on Audit Log Filtering Functions

Audit log filtering functions are subject to these constraints:

* To use any filtering function, the `audit_log` plugin must be enabled or an error occurs. In addition, the audit tables must exist or an error occurs. To install the `audit_log` plugin and its accompanying functions and tables, see Section 6.4.5.2, “Installing or Uninstalling MySQL Enterprise Audit”.

* To use any filtering function, a user must possess the `SUPER` privilege or an error occurs. To grant the `SUPER` privilege to a user account, use this statement:

  ```sql
  GRANT SUPER ON *.* TO user;
  ```

  Alternatively, should you prefer to avoid granting the `SUPER` privilege while still permitting users to access specific filtering functions, “wrapper” stored programs can be defined. This technique is described in the context of keyring functions in Using General-Purpose Keyring Functions; it can be adapted for use with filtering functions.

* The `audit_log` plugin operates in legacy mode if it is installed but the accompanying audit tables and functions are not created. The plugin writes these messages to the error log at server startup:

  ```sql
  [Warning] Plugin audit_log reported: 'Failed to open the audit log filter tables.'
  [Warning] Plugin audit_log reported: 'Audit Log plugin supports a filtering,
  which has not been installed yet. Audit Log plugin will run in the legacy
  mode, which will be disabled in the next release.'
  ```

  In legacy mode, filtering can be done based only on event account or status. For details, see Section 6.4.5.10, “Legacy Mode Audit Log Filtering”.

##### Using Audit Log Filtering Functions

Before using the audit log functions, install them according to the instructions provided in Section 6.4.5.2, “Installing or Uninstalling MySQL Enterprise Audit”. The `SUPER` privilege is required to use any of these functions.

The audit log filtering functions enable filtering control by providing an interface to create, modify, and remove filter definitions and assign filters to user accounts.

Filter definitions are `JSON` values. For information about using `JSON` data in MySQL, see Section 11.5, “The JSON Data Type”. This section shows some simple filter definitions. For more information about filter definitions, see Section 6.4.5.8, “Writing Audit Log Filter Definitions”.

When a connection arrives, the audit log plugin determines which filter to use for the new session by searching for the user account name in the current filter assignments:

* If a filter is assigned to the user, the audit log uses that filter.

* Otherwise, if no user-specific filter assignment exists, but there is a filter assigned to the default account (`%`), the audit log uses the default filter.

* Otherwise, the audit log selects no audit events from the session for processing.

If a change-user operation occurs during a session (see mysql\_change\_user()), filter assignment for the session is updated using the same rules but for the new user.

By default, no accounts have a filter assigned, so no processing of auditable events occurs for any account.

Suppose that you want to change the default to be to log only connection-related activity (for example, to see connect, change-user, and disconnect events, but not the SQL statements users execute while connected). To achieve this, define a filter (shown here named `log_conn_events`) that enables logging only of events in the `connection` class, and assign that filter to the default account, represented by the `%` account name:

```sql
SET @f = '{ "filter": { "class": { "name": "connection" } } }';
SELECT audit_log_filter_set_filter('log_conn_events', @f);
SELECT audit_log_filter_set_user('%', 'log_conn_events');
```

Now the audit log uses this default account filter for connections from any account that has no explicitly defined filter.

To assign a filter explicitly to a particular user account or accounts, define the filter, then assign it to the relevant accounts:

```sql
SELECT audit_log_filter_set_filter('log_all', '{ "filter": { "log": true } }');
SELECT audit_log_filter_set_user('user1@localhost', 'log_all');
SELECT audit_log_filter_set_user('user2@localhost', 'log_all');
```

Now full logging is enabled for `user1@localhost` and `user2@localhost`. Connections from other accounts continue to be filtered using the default account filter.

To disassociate a user account from its current filter, either unassign the filter or assign a different filter:

* To unassign the filter from the user account:

  ```sql
  SELECT audit_log_filter_remove_user('user1@localhost');
  ```

  Filtering of current sessions for the account remains unaffected. Subsequent connections from the account are filtered using the default account filter if there is one, and are not logged otherwise.

* To assign a different filter to the user account:

  ```sql
  SELECT audit_log_filter_set_filter('log_nothing', '{ "filter": { "log": false } }');
  SELECT audit_log_filter_set_user('user1@localhost', 'log_nothing');
  ```

  Filtering of current sessions for the account remains unaffected. Subsequent connections from the account are filtered using the new filter. For the filter shown here, that means no logging for new connections from `user1@localhost`.

For audit log filtering, user name and host name comparisons are case-sensitive. This differs from comparisons for privilege checking, for which host name comparisons are not case-sensitive.

To remove a filter, do this:

```sql
SELECT audit_log_filter_remove_filter('log_nothing');
```

Removing a filter also unassigns it from any users to whom it is assigned, including any current sessions for those users.

The filtering functions just described affect audit filtering immediately and update the audit log tables in the `mysql` system database that store filters and user accounts (see Audit Log Tables). It is also possible to modify the audit log tables directly using statements such as `INSERT`, `UPDATE`, and `DELETE`, but such changes do not affect filtering immediately. To flush your changes and make them operational, call `audit_log_filter_flush()`:

```sql
SELECT audit_log_filter_flush();
```

Warning

`audit_log_filter_flush()` should be used only after modifying the audit tables directly, to force reloading all filters. Otherwise, this function should be avoided. It is, in effect, a simplified version of unloading and reloading the `audit_log` plugin with `UNINSTALL PLUGIN` plus `INSTALL PLUGIN`.

`audit_log_filter_flush()` affects all current sessions and detaches them from their previous filters. Current sessions are no longer logged unless they disconnect and reconnect, or execute a change-user operation.

To determine whether a filter is assigned to the current session, check the session value of the read-only `audit_log_filter_id` system variable. If the value is 0, no filter is assigned. A nonzero value indicates the internally maintained ID of the assigned filter:

```sql
mysql> SELECT @@audit_log_filter_id;
+-----------------------+
| @@audit_log_filter_id |
+-----------------------+
|                     2 |
+-----------------------+
```


#### 6.4.5.8 Writing Audit Log Filter Definitions

Filter definitions are `JSON` values. For information about using `JSON` data in MySQL, see Section 11.5, “The JSON Data Type”.

Filter definitions have this form, where *`actions`* indicates how filtering takes place:

```sql
{ "filter": actions }
```

The following discussion describes permitted constructs in filter definitions.

* Logging All Events
* Logging Specific Event Classes
* Logging Specific Event Subclasses
* Inclusive and Exclusive Logging
* Testing Event Field Values
* Blocking Execution of Specific Events
* Logical Operators
* Referencing Predefined Variables
* Referencing Predefined Functions
* Replacing a User Filter

##### Logging All Events

To explicitly enable or disable logging of all events, use a `log` item in the filter:

```sql
{
  "filter": { "log": true }
}
```

The `log` value can be either `true` or `false`.

The preceding filter enables logging of all events. It is equivalent to:

```sql
{
  "filter": { }
}
```

Logging behavior depends on the `log` value and whether `class` or `event` items are specified:

* With `log` specified, its given value is used.

* Without `log` specified, logging is `true` if no `class` or `event` item is specified, and `false` otherwise (in which case, `class` or `event` can include their own `log` item).

##### Logging Specific Event Classes

To log events of a specific class, use a `class` item in the filter, with its `name` field denoting the name of the class to log:

```sql
{
  "filter": {
    "class": { "name": "connection" }
  }
}
```

The `name` value can be `connection`, `general`, or `table_access` to log connection, general, or table-access events, respectively.

The preceding filter enables logging of events in the `connection` class. It is equivalent to the following filter with `log` items made explicit:

```sql
{
  "filter": {
    "log": false,
    "class": { "log": true,
               "name": "connection" }
  }
}
```

To enable logging of multiple classes, define the `class` value as a `JSON` array element that names the classes:

```sql
{
  "filter": {
    "class": [
      { "name": "connection" },
      { "name": "general" },
      { "name": "table_access" }
    ]
  }
}
```

Note

When multiple instances of a given item appear at the same level within a filter definition, the item values can be combined into a single instance of that item within an array value. The preceding definition can be written like this:

```sql
{
  "filter": {
    "class": [
      { "name": [ "connection", "general", "table_access" ] }
    ]
  }
}
```

##### Logging Specific Event Subclasses

To select specific event subclasses, use an `event` item containing a `name` item that names the subclasses. The default action for events selected by an `event` item is to log them. For example, this filter enables logging for the named event subclasses:

```sql
{
  "filter": {
    "class": [
      {
        "name": "connection",
        "event": [
          { "name": "connect" },
          { "name": "disconnect" }
        ]
      },
      { "name": "general" },
      {
        "name": "table_access",
        "event": [
          { "name": "insert" },
          { "name": "delete" },
          { "name": "update" }
        ]
      }
    ]
  }
}
```

The `event` item can also contain explicit `log` items to indicate whether to log qualifying events. This `event` item selects multiple events and explicitly indicates logging behavior for them:

```sql
"event": [
  { "name": "read", "log": false },
  { "name": "insert", "log": true },
  { "name": "delete", "log": true },
  { "name": "update", "log": true }
]
```

As of MySQL 5.7.20, the `event` item can also indicate whether to block qualifying events, if it contains an `abort` item. For details, see Blocking Execution of Specific Events.

Table 6.26, “Event Class and Subclass Combinations” describes the permitted subclass values for each event class.

**Table 6.26 Event Class and Subclass Combinations**

<table summary="Permitted combiniations of event class and subclass values."><col style="width: 20%"/><col style="width: 20%"/><col style="width: 60%"/><thead><tr> <th>Event Class</th> <th>Event Subclass</th> <th>Description</th> </tr></thead><tbody><tr> <th><code>connection</code></th> <td><code>connect</code></td> <td>Connection initiation (successful or unsuccessful)</td> </tr><tr> <th><code>connection</code></th> <td><code>change_user</code></td> <td>User re-authentication with different user/password during session</td> </tr><tr> <th><code>connection</code></th> <td><code>disconnect</code></td> <td>Connection termination</td> </tr><tr> <th><code>general</code></th> <td><code>status</code></td> <td>General operation information</td> </tr><tr> <th><code>table_access</code></th> <td><code>read</code></td> <td>Table read statements, such as <code>SELECT</code> or <code>INSERT INTO ... SELECT</code></td> </tr><tr> <th><code>table_access</code></th> <td><code>delete</code></td> <td>Table delete statements, such as <code>DELETE</code> or <code>TRUNCATE TABLE</code></td> </tr><tr> <th><code>table_access</code></th> <td><code>insert</code></td> <td>Table insert statements, such as <code>INSERT</code> or <code>REPLACE</code></td> </tr><tr> <th><code>table_access</code></th> <td><code>update</code></td> <td>Table update statements, such as <code>UPDATE</code></td> </tr></tbody></table>

Table 6.27, “Log and Abort Characteristics Per Event Class and Subclass Combination” describes for each event subclass whether it can be logged or aborted.

**Table 6.27 Log and Abort Characteristics Per Event Class and Subclass Combination**

<table summary="Log and abort characteristics for event class and subclass combinations."><col style="width: 20%"/><col style="width: 20%"/><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th>Event Class</th> <th>Event Subclass</th> <th>Can be Logged</th> <th>Can be Aborted</th> </tr></thead><tbody><tr> <th><code>connection</code></th> <td><code>connect</code></td> <td>Yes</td> <td>No</td> </tr><tr> <th><code>connection</code></th> <td><code>change_user</code></td> <td>Yes</td> <td>No</td> </tr><tr> <th><code>connection</code></th> <td><code>disconnect</code></td> <td>Yes</td> <td>No</td> </tr><tr> <th><code>general</code></th> <td><code>status</code></td> <td>Yes</td> <td>No</td> </tr><tr> <th><code>table_access</code></th> <td><code>read</code></td> <td>Yes</td> <td>Yes</td> </tr><tr> <th><code>table_access</code></th> <td><code>delete</code></td> <td>Yes</td> <td>Yes</td> </tr><tr> <th><code>table_access</code></th> <td><code>insert</code></td> <td>Yes</td> <td>Yes</td> </tr><tr> <th><code>table_access</code></th> <td><code>update</code></td> <td>Yes</td> <td>Yes</td> </tr></tbody></table>

##### Inclusive and Exclusive Logging

A filter can be defined in inclusive or exclusive mode:

* Inclusive mode logs only explicitly specified items.
* Exclusive mode logs everything but explicitly specified items.

To perform inclusive logging, disable logging globally and enable logging for specific classes. This filter logs `connect` and `disconnect` events in the `connection` class, and events in the `general` class:

```sql
{
  "filter": {
    "log": false,
    "class": [
      {
        "name": "connection",
        "event": [
          { "name": "connect", "log": true },
          { "name": "disconnect", "log": true }
        ]
      },
      { "name": "general", "log": true }
    ]
  }
}
```

To perform exclusive logging, enable logging globally and disable logging for specific classes. This filter logs everything except events in the `general` class:

```sql
{
  "filter": {
    "log": true,
    "class":
      { "name": "general", "log": false }
  }
}
```

This filter logs `change_user` events in the `connection` class, and `table_access` events, by virtue of *not* logging everything else:

```sql
{
  "filter": {
    "log": true,
    "class": [
      {
        "name": "connection",
        "event": [
          { "name": "connect", "log": false },
          { "name": "disconnect", "log": false }
        ]
      },
      { "name": "general", "log": false }
    ]
  }
}
```

##### Testing Event Field Values

To enable logging based on specific event field values, specify a `field` item within the `log` item that indicates the field name and its expected value:

```sql
{
  "filter": {
    "class": {
    "name": "general",
      "event": {
        "name": "status",
        "log": {
          "field": { "name": "general_command.str", "value": "Query" }
        }
      }
    }
  }
}
```

Each event contains event class-specific fields that can be accessed from within a filter to perform custom filtering.

An event in the `connection` class indicates when a connection-related activity occurs during a session, such as a user connecting to or disconnecting from the server. Table 6.28, “Connection Event Fields” indicates the permitted fields for `connection` events.

**Table 6.28 Connection Event Fields**

<table summary="Permitted fields for connection events."><col style="width: 35%"/><col style="width: 20%"/><col style="width: 45%"/><thead><tr> <th>Field Name</th> <th>Field Type</th> <th>Description</th> </tr></thead><tbody><tr> <th><code>status</code></th> <td>integer</td> <td> Event status:  0: OK  Otherwise: Failed </td> </tr><tr> <th><code>connection_id</code></th> <td>unsigned integer</td> <td>Connection ID</td> </tr><tr> <th><code>user.str</code></th> <td>string</td> <td>User name specified during authentication</td> </tr><tr> <th><code>user.length</code></th> <td>unsigned integer</td> <td>User name length</td> </tr><tr> <th><code>priv_user.str</code></th> <td>string</td> <td>Authenticated user name (account user name)</td> </tr><tr> <th><code>priv_user.length</code></th> <td>unsigned integer</td> <td>Authenticated user name length</td> </tr><tr> <th><code>external_user.str</code></th> <td>string</td> <td>External user name (provided by third-party authentication plugin)</td> </tr><tr> <th><code>external_user.length</code></th> <td>unsigned integer</td> <td>External user name length</td> </tr><tr> <th><code>proxy_user.str</code></th> <td>string</td> <td>Proxy user name</td> </tr><tr> <th><code>proxy_user.length</code></th> <td>unsigned integer</td> <td>Proxy user name length</td> </tr><tr> <th><code>host.str</code></th> <td>string</td> <td>Connected user host</td> </tr><tr> <th><code>host.length</code></th> <td>unsigned integer</td> <td>Connected user host length</td> </tr><tr> <th><code>ip.str</code></th> <td>string</td> <td>Connected user IP address</td> </tr><tr> <th><code>ip.length</code></th> <td>unsigned integer</td> <td>Connected user IP address length</td> </tr><tr> <th><code>database.str</code></th> <td>string</td> <td>Database name specified at connect time</td> </tr><tr> <th><code>database.length</code></th> <td>unsigned integer</td> <td>Database name length</td> </tr><tr> <th><code>connection_type</code></th> <td>integer</td> <td> Connection type:  0 or <code>"::undefined"</code>: Undefined  1 or <code>"::tcp/ip"</code>: TCP/IP  2 or <code>"::socket"</code>: Socket  3 or <code>"::named_pipe"</code>: Named pipe  4 or <code>"::ssl"</code>: TCP/IP with encryption  5 or <code>"::shared_memory"</code>: Shared memory </td> </tr></tbody></table>

The `"::xxx"` values are symbolic pseudo-constants that may be given instead of the literal numeric values. They must be quoted as strings and are case-sensitive.

An event in the `general` class indicates the status code of an operation and its details. Table 6.29, “General Event Fields” indicates the permitted fields for `general` events.

**Table 6.29 General Event Fields**

<table summary="Permitted field types for general events."><col style="width: 35%"/><col style="width: 20%"/><col style="width: 45%"/><thead><tr> <th>Field Name</th> <th>Field Type</th> <th>Description</th> </tr></thead><tbody><tr> <th><code>general_error_code</code></th> <td>integer</td> <td> Event status:  0: OK  Otherwise: Failed </td> </tr><tr> <th><code>general_thread_id</code></th> <td>unsigned integer</td> <td>Connection/thread ID</td> </tr><tr> <th><code>general_user.str</code></th> <td>string</td> <td>User name specified during authentication</td> </tr><tr> <th><code>general_user.length</code></th> <td>unsigned integer</td> <td>User name length</td> </tr><tr> <th><code>general_command.str</code></th> <td>string</td> <td>Command name</td> </tr><tr> <th><code>general_command.length</code></th> <td>unsigned integer</td> <td>Command name length</td> </tr><tr> <th><code>general_query.str</code></th> <td>string</td> <td>SQL statement text</td> </tr><tr> <th><code>general_query.length</code></th> <td>unsigned integer</td> <td>SQL statement text length</td> </tr><tr> <th><code>general_host.str</code></th> <td>string</td> <td>Host name</td> </tr><tr> <th><code>general_host.length</code></th> <td>unsigned integer</td> <td>Host name length</td> </tr><tr> <th><code>general_sql_command.str</code></th> <td>string</td> <td>SQL command type name</td> </tr><tr> <th><code>general_sql_command.length</code></th> <td>unsigned integer</td> <td>SQL command type name length</td> </tr><tr> <th><code>general_external_user.str</code></th> <td>string</td> <td>External user name (provided by third-party authentication plugin)</td> </tr><tr> <th><code>general_external_user.length</code></th> <td>unsigned integer</td> <td>External user name length</td> </tr><tr> <th><code>general_ip.str</code></th> <td>string</td> <td>Connected user IP address</td> </tr><tr> <th><code>general_ip.length</code></th> <td>unsigned integer</td> <td>Connection user IP address length</td> </tr></tbody></table>

`general_command.str` indicates a command name: `Query`, `Execute`, `Quit`, or `Change user`.

A `general` event with the `general_command.str` field set to `Query` or `Execute` contains `general_sql_command.str` set to a value that specifies the type of SQL command: `alter_db`, `alter_db_upgrade`, `admin_commands`, and so forth. The available `general_sql_command.str` values can be seen as the last components of the Performance Schema instruments displayed by this statement:

```sql
mysql> SELECT NAME FROM performance_schema.setup_instruments
       WHERE NAME LIKE 'statement/sql/%' ORDER BY NAME;
+---------------------------------------+
| NAME                                  |
+---------------------------------------+
| statement/sql/alter_db                |
| statement/sql/alter_db_upgrade        |
| statement/sql/alter_event             |
| statement/sql/alter_function          |
| statement/sql/alter_instance          |
| statement/sql/alter_procedure         |
| statement/sql/alter_server            |
...
```

An event in the `table_access` class provides information about a specific type of access to a table. Table 6.30, “Table-Access Event Fields” indicates the permitted fields for `table_access` events.

**Table 6.30 Table-Access Event Fields**

<table summary="Permitted fields for table-access events."><col style="width: 35%"/><col style="width: 20%"/><col style="width: 45%"/><thead><tr> <th>Field Name</th> <th>Field Type</th> <th>Description</th> </tr></thead><tbody><tr> <th><code>connection_id</code></th> <td>unsigned integer</td> <td>Event connection ID</td> </tr><tr> <th><code>sql_command_id</code></th> <td>integer</td> <td>SQL command ID</td> </tr><tr> <th><code>query.str</code></th> <td>string</td> <td>SQL statement text</td> </tr><tr> <th><code>query.length</code></th> <td>unsigned integer</td> <td>SQL statement text length</td> </tr><tr> <th><code>table_database.str</code></th> <td>string</td> <td>Database name associated with event</td> </tr><tr> <th><code>table_database.length</code></th> <td>unsigned integer</td> <td>Database name length</td> </tr><tr> <th><code>table_name.str</code></th> <td>string</td> <td>Table name associated with event</td> </tr><tr> <th><code>table_name.length</code></th> <td>unsigned integer</td> <td>Table name length</td> </tr></tbody></table>

The following list shows which statements produce which table-access events:

* `read` event:

  + `SELECT`
  + `INSERT ... SELECT` (for tables referenced in `SELECT` clause)

  + `REPLACE ... SELECT` (for tables referenced in `SELECT` clause)

  + `UPDATE ... WHERE` (for tables referenced in `WHERE` clause)

  + `HANDLER ... READ`
* `delete` event:

  + `DELETE`
  + `TRUNCATE TABLE`
* `insert` event:

  + `INSERT`
  + `INSERT ... SELECT` (for table referenced in `INSERT` clause)

  + `REPLACE`
  + `REPLACE ... SELECT` (for table referenced in `REPLACE` clause

  + `LOAD DATA`
  + `LOAD XML`
* `update` event:

  + `UPDATE`
  + `UPDATE ... WHERE` (for tables referenced in `UPDATE` clause)

##### Blocking Execution of Specific Events

As of MySQL 5.7.20, `event` items can include an `abort` item that indicates whether to prevent qualifying events from executing. `abort` enables rules to be written that block execution of specific SQL statements.

The `abort` item must appear within an `event` item. For example:

```sql
"event": {
  "name": qualifying event subclass names
  "abort": condition
}
```

For event subclasses selected by the `name` item, the `abort` action is true or false, depending on *`condition`* evaluation. If the condition evaluates to true, the event is blocked. Otherwise, the event continues executing.

The *`condition`* specification can be as simple as `true` or `false`, or it can be more complex such that evaluation depends on event characteristics.

This filter blocks `INSERT`, `UPDATE`, and `DELETE` statements:

```sql
{
  "filter": {
    "class": {
      "name": "table_access",
      "event": {
        "name": [ "insert", "update", "delete" ],
        "abort": true
      }
    }
  }
}
```

This more complex filter blocks the same statements, but only for a specific table (`finances.bank_account`):

```sql
{
  "filter": {
    "class": {
      "name": "table_access",
      "event": {
        "name": [ "insert", "update", "delete" ],
        "abort": {
          "and": [
            { "field": { "name": "table_database.str", "value": "finances" } },
            { "field": { "name": "table_name.str", "value": "bank_account" } }
          ]
        }
      }
    }
  }
}
```

Statements matched and blocked by the filter return an error to the client:

```sql
ERROR 1045 (28000): Statement was aborted by an audit log filter
```

Not all events can be blocked (see Table 6.27, “Log and Abort Characteristics Per Event Class and Subclass Combination”). For an event that cannot be blocked, the audit log writes a warning to the error log rather than blocking it.

For attempts to define a filter in which the `abort` item appears elsewhere than in an `event` item, an error occurs.

##### Logical Operators

Logical operators (`and`, `or`, `not`) permit construction of complex conditions, enabling more advanced filtering configurations to be written. The following `log` item logs only `general` events with `general_command` fields having a specific value and length:

```sql
{
  "filter": {
    "class": {
      "name": "general",
      "event": {
        "name": "status",
        "log": {
          "or": [
            {
              "and": [
                { "field": { "name": "general_command.str",    "value": "Query" } },
                { "field": { "name": "general_command.length", "value": 5 } }
              ]
            },
            {
              "and": [
                { "field": { "name": "general_command.str",    "value": "Execute" } },
                { "field": { "name": "general_command.length", "value": 7 } }
              ]
            }
          ]
        }
      }
    }
  }
}
```

##### Referencing Predefined Variables

To refer to a predefined variable in a `log` condition, use a `variable` item, which takes `name` and `value` items and tests equality of the named variable against a given value:

```sql
"variable": {
  "name": "variable_name",
  "value": comparison_value
}
```

This is true if *`variable_name`* has the value *`comparison_value`*, false otherwise.

Example:

```sql
{
  "filter": {
    "class": {
      "name": "general",
      "event": {
        "name": "status",
        "log": {
          "variable": {
            "name": "audit_log_connection_policy_value",
            "value": "::none"
          }
        }
      }
    }
  }
}
```

Each predefined variable corresponds to a system variable. By writing a filter that tests a predefined variable, you can modify filter operation by setting the corresponding system variable, without having to redefine the filter. For example, by writing a filter that tests the value of the `audit_log_connection_policy_value` predefined variable, you can modify filter operation by changing the value of the `audit_log_connection_policy` system variable.

The `audit_log_xxx_policy` system variables are used for the legacy mode audit log (see Section 6.4.5.10, “Legacy Mode Audit Log Filtering”). With rule-based audit log filtering, those variables remain visible (for example, using `SHOW VARIABLES`), but changes to them have no effect unless you write filters containing constructs that refer to them.

The following list describes the permitted predefined variables for `variable` items:

* `audit_log_connection_policy_value`

  This variable corresponds to the value of the `audit_log_connection_policy` system variable. The value is an unsigned integer. Table 6.31, “audit\_log\_connection\_policy\_value Values” shows the permitted values and the corresponding `audit_log_connection_policy` values.

  **Table 6.31 audit\_log\_connection\_policy\_value Values**

  <table summary="Permitted audit_log_connection_policy_value values and the corresponding audit_log_connection_policy values."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Value</th> <th>Corresponding audit_log_connection_policy Value</th> </tr></thead><tbody><tr> <td><code>0</code> or <code>"::none"</code></td> <td><code>NONE</code></td> </tr><tr> <td><code>1</code> or <code>"::errors"</code></td> <td><code>ERRORS</code></td> </tr><tr> <td><code>2</code> or <code>"::all"</code></td> <td><code>ALL</code></td> </tr></tbody></table>

  The `"::xxx"` values are symbolic pseudo-constants that may be given instead of the literal numeric values. They must be quoted as strings and are case-sensitive.

* `audit_log_policy_value`

  This variable corresponds to the value of the `audit_log_policy` system variable. The value is an unsigned integer. Table 6.32, “audit\_log\_policy\_value Values” shows the permitted values and the corresponding `audit_log_policy` values.

  **Table 6.32 audit\_log\_policy\_value Values**

  <table summary="Permitted audit_log_policy_value values and the corresponding audit_log_policy values."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Value</th> <th>Corresponding audit_log_policy Value</th> </tr></thead><tbody><tr> <td><code>0</code> or <code>"::none"</code></td> <td><code>NONE</code></td> </tr><tr> <td><code>1</code> or <code>"::logins"</code></td> <td><code>LOGINS</code></td> </tr><tr> <td><code>2</code> or <code>"::all"</code></td> <td><code>ALL</code></td> </tr><tr> <td><code>3</code> or <code>"::queries"</code></td> <td><code>QUERIES</code></td> </tr></tbody></table>

  The `"::xxx"` values are symbolic pseudo-constants that may be given instead of the literal numeric values. They must be quoted as strings and are case-sensitive.

* `audit_log_statement_policy_value`

  This variable corresponds to the value of the `audit_log_statement_policy` system variable. The value is an unsigned integer. Table 6.33, “audit\_log\_statement\_policy\_value Values” shows the permitted values and the corresponding `audit_log_statement_policy` values.

  **Table 6.33 audit\_log\_statement\_policy\_value Values**

  <table summary="Permitted audit_log_statement_policy_value values and the corresponding audit_log_statement_policy values."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Value</th> <th>Corresponding audit_log_statement_policy Value</th> </tr></thead><tbody><tr> <td><code>0</code> or <code>"::none"</code></td> <td><code>NONE</code></td> </tr><tr> <td><code>1</code> or <code>"::errors"</code></td> <td><code>ERRORS</code></td> </tr><tr> <td><code>2</code> or <code>"::all"</code></td> <td><code>ALL</code></td> </tr></tbody></table>

  The `"::xxx"` values are symbolic pseudo-constants that may be given instead of the literal numeric values. They must be quoted as strings and are case-sensitive.

##### Referencing Predefined Functions

To refer to a predefined function in a `log` condition, use a `function` item, which takes `name` and `args` items to specify the function name and its arguments, respectively:

```sql
"function": {
  "name": "function_name",
  "args": arguments
}
```

The `name` item should specify the function name only, without parentheses or the argument list.

The `args` item must satisfy these conditions:

* If the function takes no arguments, no `args` item should be given.

* If the function does take arguments, an `args` item is needed, and the arguments must be given in the order listed in the function description. Arguments can refer to predefined variables, event fields, or string or numeric constants.

If the number of arguments is incorrect or the arguments are not of the correct data types required by the function an error occurs.

Example:

```sql
{
  "filter": {
    "class": {
      "name": "general",
      "event": {
        "name": "status",
        "log": {
          "function": {
            "name": "find_in_include_list",
            "args": [ { "string": [ { "field": "user.str" },
                                    { "string": "@"},
                                    { "field": "host.str" } ] } ]
          }
        }
      }
    }
  }
}
```

The preceding filter determines whether to log `general` class `status` events depending on whether the current user is found in the `audit_log_include_accounts` system variable. That user is constructed using fields in the event.

The following list describes the permitted predefined functions for `function` items:

* `audit_log_exclude_accounts_is_null()`

  Checks whether the `audit_log_exclude_accounts` system variable is `NULL`. This function can be helpful when defining filters that correspond to the legacy audit log implementation.

  Arguments:

  None.

* `audit_log_include_accounts_is_null()`

  Checks whether the `audit_log_include_accounts` system variable is `NULL`. This function can be helpful when defining filters that correspond to the legacy audit log implementation.

  Arguments:

  None.

* `debug_sleep(millisec)`

  Sleeps for the given number of milliseconds. This function is used during performance measurement.

  `debug_sleep()` is available for debug builds only.

  Arguments:

  + *`millisec`*: An unsigned integer that specifies the number of milliseconds to sleep.

* `find_in_exclude_list(account)`

  Checks whether an account string exists in the audit log exclude list (the value of the `audit_log_exclude_accounts` system variable).

  Arguments:

  + *`account`*: A string that specifies the user account name.

* `find_in_include_list(account)`

  Checks whether an account string exists in the audit log include list (the value of the `audit_log_include_accounts` system variable).

  Arguments:

  + *`account`*: A string that specifies the user account name.

* `string_find(text, substr)`

  Checks whether the `substr` value is contained in the `text` value. This search is case-sensitive.

  Arguments:

  + *`text`*: The text string to search.

  + *`substr`*: The substring to search for in *`text`*.

##### Replacing a User Filter

In some cases, the filter definition can be changed dynamically. To do this, define a `filter` configuration within an existing `filter`. For example:

```sql
{
  "filter": {
    "id": "main",
    "class": {
      "name": "table_access",
      "event": {
        "name": [ "update", "delete" ],
        "log": false,
        "filter": {
          "class": {
            "name": "general",
            "event" : { "name": "status",
                        "filter": { "ref": "main" } }
          },
          "activate": {
            "or": [
              { "field": { "name": "table_name.str", "value": "temp_1" } },
              { "field": { "name": "table_name.str", "value": "temp_2" } }
            ]
          }
        }
      }
    }
  }
}
```

A new filter is activated when the `activate` item within a subfilter evaluates to `true`. Using `activate` in a top-level `filter` is not permitted.

A new filter can be replaced with the original one by using a `ref` item inside the subfilter to refer to the original filter `id`.

The filter shown operates like this:

* The `main` filter waits for `table_access` events, either `update` or `delete`.

* If the `update` or `delete` `table_access` event occurs on the `temp_1` or `temp_2` table, the filter is replaced with the internal one (without an `id`, since there is no need to refer to it explicitly).

* If the end of the command is signalled (`general` / `status` event), an entry is written to the audit log file and the filter is replaced with the `main` filter.

The filter is useful to log statements that update or delete anything from the `temp_1` or `temp_2` tables, such as this one:

```sql
UPDATE temp_1, temp_3 SET temp_1.a=21, temp_3.a=23;
```

The statement generates multiple `table_access` events, but the audit log file contains only `general` or `status` entries.

Note

Any `id` values used in the definition are evaluated with respect only to that definition. They have nothing to do with the value of the `audit_log_filter_id` system variable.


#### 6.4.5.9 Disabling Audit Logging

The `audit_log_disable` variable, introduced in MySQL 5.7.37, permits disabling audit logging for all connecting and connected sessions. The `audit_log_disable` variable can be set in a MySQL Server option file, in a command-line startup string, or at runtime using a `SET` statement; for example:

```sql
SET GLOBAL audit_log_disable = true;
```

Setting `audit_log_disable` to true disables the audit log plugin. The plugin is re-enabled when `audit_log_disable` is set back to `false`, which is the default setting.

Starting the audit log plugin with `audit_log_disable = true` generates a warning (`ER_WARN_AUDIT_LOG_DISABLED`) with the following message: Audit Log is disabled. Enable it with audit\_log\_disable = false. Setting `audit_log_disable` to false also generates warning. When `audit_log_disable` is set to true, audit log function calls and variable changes generate a session warning.

Setting the runtime value of `audit_log_disable` requires the `SUPER` privilege.


#### 6.4.5.10 Legacy Mode Audit Log Filtering

Note

This section describes legacy audit log filtering, which applies under either of these circumstances:

* Before MySQL 5.7.13, that is, prior to the introduction of rule-based audit log filtering described in Section 6.4.5.7, “Audit Log Filtering”.

* As of MySQL 5.7.13, if the `audit_log` plugin is installed without the accompanying audit tables and functions needed for rule-based filtering.

The audit log plugin can filter audited events. This enables you to control whether audited events are written to the audit log file based on the account from which events originate or event status. Status filtering occurs separately for connection events and statement events.

* Legacy Event Filtering by Account
* Legacy Event Filtering by Status

##### Legacy Event Filtering by Account

To filter audited events based on the originating account, set one (not both) of the following system variables at server startup or runtime. These variables apply only for legacy audit log filtering.

* `audit_log_include_accounts`: The accounts to include in audit logging. If this variable is set, only these accounts are audited.

* `audit_log_exclude_accounts`: The accounts to exclude from audit logging. If this variable is set, all but these accounts are audited.

The value for either variable can be `NULL` or a string containing one or more comma-separated account names, each in `user_name@host_name` format. By default, both variables are `NULL`, in which case, no account filtering is done and auditing occurs for all accounts.

Modifications to `audit_log_include_accounts` or `audit_log_exclude_accounts` affect only connections created subsequent to the modification, not existing connections.

Example: To enable audit logging only for the `user1` and `user2` local host accounts, set the `audit_log_include_accounts` system variable like this:

```sql
SET GLOBAL audit_log_include_accounts = 'user1@localhost,user2@localhost';
```

Only one of `audit_log_include_accounts` or `audit_log_exclude_accounts` can be non-`NULL` at a time:

* If you set `audit_log_include_accounts`, the server sets `audit_log_exclude_accounts` to `NULL`.

* If you attempt to set `audit_log_exclude_accounts`, an error occurs unless `audit_log_include_accounts` is `NULL`. In this case, you must first clear `audit_log_include_accounts` by setting it to `NULL`.

```sql
-- This sets audit_log_exclude_accounts to NULL
SET GLOBAL audit_log_include_accounts = value;

-- This fails because audit_log_include_accounts is not NULL
SET GLOBAL audit_log_exclude_accounts = value;

-- To set audit_log_exclude_accounts, first set
-- audit_log_include_accounts to NULL
SET GLOBAL audit_log_include_accounts = NULL;
SET GLOBAL audit_log_exclude_accounts = value;
```

If you inspect the value of either variable, be aware that `SHOW VARIABLES` displays `NULL` as an empty string. To display `NULL` as `NULL`, use `SELECT` instead:

```sql
mysql> SHOW VARIABLES LIKE 'audit_log_include_accounts';
+----------------------------+-------+
| Variable_name              | Value |
+----------------------------+-------+
| audit_log_include_accounts |       |
+----------------------------+-------+
mysql> SELECT @@audit_log_include_accounts;
+------------------------------+
| @@audit_log_include_accounts |
+------------------------------+
| NULL                         |
+------------------------------+
```

If a user name or host name requires quoting because it contains a comma, space, or other special character, quote it using single quotes. If the variable value itself is quoted with single quotes, double each inner single quote or escape it with a backslash. The following statements each enable audit logging for the local `root` account and are equivalent, even though the quoting styles differ:

```sql
SET GLOBAL audit_log_include_accounts = 'root@localhost';
SET GLOBAL audit_log_include_accounts = '''root''@''localhost''';
SET GLOBAL audit_log_include_accounts = '\'root\'@\'localhost\'';
SET GLOBAL audit_log_include_accounts = "'root'@'localhost'";
```

The last statement does not work if the `ANSI_QUOTES` SQL mode is enabled because in that mode double quotes signify identifier quoting, not string quoting.

##### Legacy Event Filtering by Status

To filter audited events based on status, set the following system variables at server startup or runtime. These variables apply only for legacy audit log filtering. For JSON audit log filtering, different status variables apply; see Audit Log Options and Variables.

* `audit_log_connection_policy`: Logging policy for connection events

* `audit_log_statement_policy`: Logging policy for statement events

Each variable takes a value of `ALL` (log all associated events; this is the default), `ERRORS` (log only failed events), or `NONE` (do not log events). For example, to log all statement events but only failed connection events, use these settings:

```sql
SET GLOBAL audit_log_statement_policy = ALL;
SET GLOBAL audit_log_connection_policy = ERRORS;
```

Another policy system variable, `audit_log_policy`, is available but does not afford as much control as `audit_log_connection_policy` and `audit_log_statement_policy`. It can be set only at server startup. At runtime, it is a read-only variable. It takes a value of `ALL` (log all events; this is the default), `LOGINS` (log connection events), `QUERIES` (log statement events), or `NONE` (do not log events). For any of those values, the audit log plugin logs all selected events without distinction as to success or failure. Use of `audit_log_policy` at startup works as follows:

* If you do not set `audit_log_policy` or set it to its default of `ALL`, any explicit settings for `audit_log_connection_policy` or `audit_log_statement_policy` apply as specified. If not specified, they default to `ALL`.

* If you set `audit_log_policy` to a non-`ALL` value, that value takes precedence over and is used to set `audit_log_connection_policy` and `audit_log_statement_policy`, as indicated in the following table. If you also set either of those variables to a value other than their default of `ALL`, the server writes a message to the error log to indicate that their values are being overridden.

  <table summary="How the server uses audit_log_policy to set audit_log_connection_policy and audit_log_statement_policy at startup."><col style="width: 33%"/><col style="width: 33%"/><col style="width: 33%"/><thead><tr> <th>Startup audit_log_policy Value</th> <th>Resulting audit_log_connection_policy Value</th> <th>Resulting audit_log_statement_policy Value</th> </tr></thead><tbody><tr> <th><code>LOGINS</code></th> <td><code>ALL</code></td> <td><code>NONE</code></td> </tr><tr> <th><code>QUERIES</code></th> <td><code>NONE</code></td> <td><code>ALL</code></td> </tr><tr> <th><code>NONE</code></th> <td><code>NONE</code></td> <td><code>NONE</code></td> </tr></tbody></table>


#### 6.4.5.11 Audit Log Reference

The following sections provide a reference to MySQL Enterprise Audit elements:

* Audit Log Tables
* Audit Log Functions
* Audit Log Option and Variable Reference
* Audit Log Options and Variables
* Audit Log Status Variables

To install the audit log tables and functions, use the instructions provided in Section 6.4.5.2, “Installing or Uninstalling MySQL Enterprise Audit”. Unless those objects are installed, the `audit_log` plugin operates in legacy mode. See Section 6.4.5.10, “Legacy Mode Audit Log Filtering”.

##### Audit Log Tables

MySQL Enterprise Audit uses tables in the `mysql` system database for persistent storage of filter and user account data. The tables can be accessed only by users who have privileges for that database. The tables use the `InnoDB` storage engine (`MyISAM` prior to MySQL 5.7.21).

If these tables are missing, the `audit_log` plugin operates in legacy mode. See Section 6.4.5.10, “Legacy Mode Audit Log Filtering”.

The `audit_log_filter` table stores filter definitions. The table has these columns:

* `NAME`

  The filter name.

* `FILTER`

  The filter definition associated with the filter name. Definitions are stored as `JSON` values.

The `audit_log_user` table stores user account information. The table has these columns:

* `USER`

  The user name part of an account. For an account `user1@localhost`, the `USER` part is `user1`.

* `HOST`

  The host name part of an account. For an account `user1@localhost`, the `HOST` part is `localhost`.

* `FILTERNAME`

  The name of the filter assigned to the account. The filter name associates the account with a filter defined in the `audit_log_filter` table.

##### Audit Log Functions

This section describes, for each audit log function, its purpose, calling sequence, and return value. For information about the conditions under which these functions can be invoked, see Section 6.4.5.7, “Audit Log Filtering”.

Each audit log function returns a string that indicates whether the operation succeeded. `OK` indicates success. `ERROR: message` indicates failure.

Audit log functions treat string arguments as binary strings (which means they do not distinguish lettercase), and string return values are binary strings.

If an audit log function is invoked from within the **mysql** client, binary string results display using hexadecimal notation, depending on the value of the `--binary-as-hex`. For more information about that option, see Section 4.5.1, “mysql — The MySQL Command-Line Client”.

These audit log functions are available:

* `audit_log_encryption_password_get()`

  Retrieves the current audit log encryption password as a binary string. The password is fetched from the MySQL keyring, which must be enabled or an error occurs. Any keyring plugin can be used; for instructions, see Section 6.4.4, “The MySQL Keyring”.

  For additional information about audit log encryption, see Encrypting Audit Log Files.

  Arguments:

  None.

  Return value:

  The password string for success (up to 766 bytes), or `NULL` and an error for failure.

  Example:

  ```sql
  mysql> SELECT audit_log_encryption_password_get();
  +-------------------------------------+
  | audit_log_encryption_password_get() |
  +-------------------------------------+
  | secret                              |
  +-------------------------------------+
  ```

* `audit_log_encryption_password_set(password)`

  Sets the audit log encryption password to the argument, stores the password in the MySQL keyring. If encryption is enabled, the function performs a log file rotation operation that renames the current log file, and begins a new log file encrypted with the password. The keyring must be enabled or an error occurs. Any keyring plugin can be used; for instructions, see Section 6.4.4, “The MySQL Keyring”.

  For additional information about audit log encryption, see Encrypting Audit Log Files.

  Arguments:

  *`password`*: The password string. The maximum permitted length is 766 bytes.

  Return value:

  1 for success, 0 for failure.

  Example:

  ```sql
  mysql> SELECT audit_log_encryption_password_set(password);
  +---------------------------------------------+
  | audit_log_encryption_password_set(password) |
  +---------------------------------------------+
  | 1                                           |
  +---------------------------------------------+
  ```

* `audit_log_filter_flush()`

  Calling any of the other filtering functions affects operational audit log filtering immediately and updates the audit log tables. If instead you modify the contents of those tables directly using statements such as `INSERT`, `UPDATE`, and `DELETE`, the changes do not affect filtering immediately. To flush your changes and make them operational, call `audit_log_filter_flush()`.

  Warning

  `audit_log_filter_flush()` should be used only after modifying the audit tables directly, to force reloading all filters. Otherwise, this function should be avoided. It is, in effect, a simplified version of unloading and reloading the `audit_log` plugin with `UNINSTALL PLUGIN` plus `INSTALL PLUGIN`.

  `audit_log_filter_flush()` affects all current sessions and detaches them from their previous filters. Current sessions are no longer logged unless they disconnect and reconnect, or execute a change-user operation.

  If this function fails, an error message is returned and the audit log is disabled until the next successful call to `audit_log_filter_flush()`.

  Arguments:

  None.

  Return value:

  A string that indicates whether the operation succeeded. `OK` indicates success. `ERROR: message` indicates failure.

  Example:

  ```sql
  mysql> SELECT audit_log_filter_flush();
  +--------------------------+
  | audit_log_filter_flush() |
  +--------------------------+
  | OK                       |
  +--------------------------+
  ```

* `audit_log_filter_remove_filter(filter_name)`

  Given a filter name, removes the filter from the current set of filters. It is not an error for the filter not to exist.

  If a removed filter is assigned to any user accounts, those users stop being filtered (they are removed from the `audit_log_user` table). Termination of filtering includes any current sessions for those users: They are detached from the filter and no longer logged.

  Arguments:

  + *`filter_name`*: A string that specifies the filter name.

  Return value:

  A string that indicates whether the operation succeeded. `OK` indicates success. `ERROR: message` indicates failure.

  Example:

  ```sql
  mysql> SELECT audit_log_filter_remove_filter('SomeFilter');
  +----------------------------------------------+
  | audit_log_filter_remove_filter('SomeFilter') |
  +----------------------------------------------+
  | OK                                           |
  +----------------------------------------------+
  ```

* `audit_log_filter_remove_user(user_name)`

  Given a user account name, cause the user to be no longer assigned to a filter. It is not an error if the user has no filter assigned. Filtering of current sessions for the user remains unaffected. New connections for the user are filtered using the default account filter if there is one, and are not logged otherwise.

  If the name is `%`, the function removes the default account filter that is used for any user account that has no explicitly assigned filter.

  Arguments:

  + *`user_name`*: The user account name as a string in `user_name@host_name` format, or `%` to represent the default account.

  Return value:

  A string that indicates whether the operation succeeded. `OK` indicates success. `ERROR: message` indicates failure.

  Example:

  ```sql
  mysql> SELECT audit_log_filter_remove_user('user1@localhost');
  +-------------------------------------------------+
  | audit_log_filter_remove_user('user1@localhost') |
  +-------------------------------------------------+
  | OK                                              |
  +-------------------------------------------------+
  ```

* `audit_log_filter_set_filter(filter_name, definition)`

  Given a filter name and definition, adds the filter to the current set of filters. If the filter already exists and is used by any current sessions, those sessions are detached from the filter and are no longer logged. This occurs because the new filter definition has a new filter ID that differs from its previous ID.

  Arguments:

  + *`filter_name`*: A string that specifies the filter name.

  + *`definition`*: A `JSON` value that specifies the filter definition.

  Return value:

  A string that indicates whether the operation succeeded. `OK` indicates success. `ERROR: message` indicates failure.

  Example:

  ```sql
  mysql> SET @f = '{ "filter": { "log": false } }';
  mysql> SELECT audit_log_filter_set_filter('SomeFilter', @f);
  +-----------------------------------------------+
  | audit_log_filter_set_filter('SomeFilter', @f) |
  +-----------------------------------------------+
  | OK                                            |
  +-----------------------------------------------+
  ```

* `audit_log_filter_set_user(user_name, filter_name)`

  Given a user account name and a filter name, assigns the filter to the user. A user can be assigned only one filter, so if the user was already assigned a filter, the assignment is replaced. Filtering of current sessions for the user remains unaffected. New connections are filtered using the new filter.

  As a special case, the name `%` represents the default account. The filter is used for connections from any user account that has no explicitly assigned filter.

  Arguments:

  + *`user_name`*: The user account name as a string in `user_name@host_name` format, or `%` to represent the default account.

  + *`filter_name`*: A string that specifies the filter name.

  Return value:

  A string that indicates whether the operation succeeded. `OK` indicates success. `ERROR: message` indicates failure.

  Example:

  ```sql
  mysql> SELECT audit_log_filter_set_user('user1@localhost', 'SomeFilter');
  +------------------------------------------------------------+
  | audit_log_filter_set_user('user1@localhost', 'SomeFilter') |
  +------------------------------------------------------------+
  | OK                                                         |
  +------------------------------------------------------------+
  ```

* `audit_log_read([arg])`

  Reads the audit log and returns a binary `JSON` string result. If the audit log format is not `JSON`, an error occurs.

  With no argument or a `JSON` hash argument, `audit_log_read()` reads events from the audit log and returns a `JSON` string containing an array of audit events. Items in the hash argument influence how reading occurs, as described later. Each element in the returned array is an event represented as a `JSON` hash, with the exception that the last element may be a `JSON` `null` value to indicate no following events are available to read.

  With an argument consisting of a `JSON` `null` value, `audit_log_read()` closes the current read sequence.

  For additional details about the audit log-reading process, see Section 6.4.5.6, “Reading Audit Log Files”.

  Arguments:

  *`arg`*: The argument is optional. If omitted, the function reads events from the current position. If present, the argument can be a `JSON` `null` value to close the read sequence, or a `JSON` hash. Within a hash argument, items are optional and control aspects of the read operation such as the position at which to begin reading or how many events to read. The following items are significant (other items are ignored):

  + `timestamp`, `id`: The position within the audit log of the first event to read. If the position is omitted from the argument, reading continues from the current position. The `timestamp` and `id` items together comprise a bookmark that uniquely identify a particular event. If an `audit_log_read()` argument includes either item, it must include both to completely specify a position or an error occurs.

    To obtain a bookmark for the most recently written event, call `audit_log_read_bookmark()`.

  + `max_array_length`: The maximum number of events to read from the log. If this item is omitted, the default is to read to the end of the log or until the read buffer is full, whichever comes first.

  Return value:

  If the call succeeds, the return value is a binary `JSON` string containing an array of audit events, or a `JSON` `null` value if that was passed as the argument to close the read sequence. If the call fails, the return value is `NULL` and an error occurs.

  Example:

  ```sql
  mysql> SELECT audit_log_read(audit_log_read_bookmark());
  +-----------------------------------------------------------------------+
  | audit_log_read(audit_log_read_bookmark())                             |
  +-----------------------------------------------------------------------+
  | [ {"timestamp":"2020-05-18 22:41:24","id":0,"class":"connection", ... |
  +-----------------------------------------------------------------------+
  mysql> SELECT audit_log_read('null');
  +------------------------+
  | audit_log_read('null') |
  +------------------------+
  | null                   |
  +------------------------+
  ```

* `audit_log_read_bookmark()`

  Returns a binary `JSON` string representing a bookmark for the most recently written audit log event. If the audit log format is not `JSON`, an error occurs.

  The bookmark is a `JSON` hash with `timestamp` and `id` items that uniquely identify the position of an event within the audit log. It is suitable for passing to `audit_log_read()` to indicate to that function the position at which to begin reading.

  For additional details about the audit log-reading process, see Section 6.4.5.6, “Reading Audit Log Files”.

  Arguments:

  None.

  Return value:

  A binary `JSON` string containing a bookmark for success, or `NULL` and an error for failure.

  Example:

  ```sql
  mysql> SELECT audit_log_read_bookmark();
  +-------------------------------------------------+
  | audit_log_read_bookmark()                       |
  +-------------------------------------------------+
  | { "timestamp": "2019-10-03 21:03:44", "id": 0 } |
  +-------------------------------------------------+
  ```

##### Audit Log Option and Variable Reference

**Table 6.34 Audit Log Option and Variable Reference**

<table frame="box" rules="all" summary="Reference for audit log command-line options, system variables, and status variables."><col style="width: 20%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><thead><tr><th>Name</th> <th>Cmd-Line</th> <th>Option File</th> <th>System Var</th> <th>Status Var</th> <th>Var Scope</th> <th>Dynamic</th> </tr></thead><tbody><tr><th>audit-log</th> <td>Yes</td> <td>Yes</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th>audit_log_buffer_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th>audit_log_compression</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th>audit_log_connection_policy</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>audit_log_current_session</th> <td></td> <td></td> <td>Yes</td> <td></td> <td>Both</td> <td>No</td> </tr><tr><th>Audit_log_current_size</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th>audit_log_disable</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>audit_log_encryption</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th>Audit_log_event_max_drop_size</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th>Audit_log_events</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th>Audit_log_events_filtered</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th>Audit_log_events_lost</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th>Audit_log_events_written</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th>audit_log_exclude_accounts</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>audit_log_file</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th>audit_log_filter_id</th> <td></td> <td></td> <td>Yes</td> <td></td> <td>Both</td> <td>No</td> </tr><tr><th>audit_log_flush</th> <td></td> <td></td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>audit_log_format</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th>audit_log_include_accounts</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>audit_log_policy</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th>audit_log_read_buffer_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Varies</td> <td>Varies</td> </tr><tr><th>audit_log_rotate_on_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>audit_log_statement_policy</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th>audit_log_strategy</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th>Audit_log_total_size</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th>Audit_log_write_waits</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr></tbody></table>

##### Audit Log Options and Variables

This section describes the command options and system variables that configure operation of MySQL Enterprise Audit. If values specified at startup time are incorrect, the `audit_log` plugin may fail to initialize properly and the server does not load it. In this case, the server may also produce error messages for other audit log settings because it does not recognize them.

To configure activation of the audit log plugin, use this option:

* `--audit-log[=value]`

  <table frame="box" rules="all" summary="Properties for audit-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><code>ON</code><code>OFF</code><code>FORCE</code><code>FORCE_PLUS_PERMANENT</code></td> </tr></tbody></table>

  This option controls how the server loads the `audit_log` plugin at startup. It is available only if the plugin has been previously registered with `INSTALL PLUGIN` or is loaded with `--plugin-load` or `--plugin-load-add`. See Section 6.4.5.2, “Installing or Uninstalling MySQL Enterprise Audit”.

  The option value should be one of those available for plugin-loading options, as described in Section 5.5.1, “Installing and Uninstalling Plugins”. For example, `--audit-log=FORCE_PLUS_PERMANENT` tells the server to load the plugin and prevent it from being removed while the server is running.

If the audit log plugin is enabled, it exposes several system variables that permit control over logging:

```sql
mysql> SHOW VARIABLES LIKE 'audit_log%';
+--------------------------------------+--------------+
| Variable_name                        | Value        |
+--------------------------------------+--------------+
| audit_log_buffer_size                | 1048576      |
| audit_log_compression                | NONE         |
| audit_log_connection_policy          | ALL          |
| audit_log_current_session            | OFF          |
| audit_log_disable                    | OFF          |
| audit_log_encryption                 | NONE         |
| audit_log_exclude_accounts           |              |
| audit_log_file                       | audit.log    |
| audit_log_filter_id                  | 0            |
| audit_log_flush                      | OFF          |
| audit_log_format                     | NEW          |
| audit_log_format_unix_timestamp      | OFF          |
| audit_log_include_accounts           |              |
| audit_log_policy                     | ALL          |
| audit_log_read_buffer_size           | 32768        |
| audit_log_rotate_on_size             | 0            |
| audit_log_statement_policy           | ALL          |
| audit_log_strategy                   | ASYNCHRONOUS |
+--------------------------------------+--------------+
```

You can set any of these variables at server startup, and some of them at runtime. Those that are available only for legacy mode audit log filtering are so noted.

* `audit_log_buffer_size`

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code>4096</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>

  When the audit log plugin writes events to the log asynchronously, it uses a buffer to store event contents prior to writing them. This variable controls the size of that buffer, in bytes. The server adjusts the value to a multiple of 4096. The plugin uses a single buffer, which it allocates when it initializes and removes when it terminates. The plugin allocates this buffer only if logging is asynchronous.

* `audit_log_compression`

  <table frame="box" rules="all" summary="Properties for audit_log_compression"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-compression=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.21</td> </tr><tr><th>System Variable</th> <td><code>audit_log_compression</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>NONE</code></td> </tr><tr><th>Valid Values</th> <td><code>NONE</code><code>GZIP</code></td> </tr></tbody></table>

  The type of compression for the audit log file. Permitted values are `NONE` (no compression; the default) and `GZIP` (GNU Zip compression). For more information, see Compressing Audit Log Files.

* `audit_log_connection_policy`

  <table frame="box" rules="all" summary="Properties for audit_log_connection_policy"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-connection-policy=value</code></td> </tr><tr><th>System Variable</th> <td><code>audit_log_connection_policy</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ALL</code></td> </tr><tr><th>Valid Values</th> <td><code>ALL</code><code>ERRORS</code><code>NONE</code></td> </tr></tbody></table>

  Note

  This variable applies only to legacy mode audit log filtering (see Section 6.4.5.10, “Legacy Mode Audit Log Filtering”).

  The policy controlling how the audit log plugin writes connection events to its log file. The following table shows the permitted values.

  <table summary="Permitted values for the audit_log_connection_policy variable."><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td><code>ALL</code></td> <td>Log all connection events</td> </tr><tr> <td><code>ERRORS</code></td> <td>Log only failed connection events</td> </tr><tr> <td><code>NONE</code></td> <td>Do not log connection events</td> </tr></tbody></table>

  Note

  At server startup, any explicit value given for `audit_log_connection_policy` may be overridden if `audit_log_policy` is also specified, as described in Section 6.4.5.5, “Configuring Audit Logging Characteristics”.

* `audit_log_current_session`

  <table frame="box" rules="all" summary="Properties for audit_log_current_session"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>audit_log_current_session</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>depends on filtering policy</code></td> </tr></tbody></table>

  Whether audit logging is enabled for the current session. The session value of this variable is read only. It is set when the session begins based on the values of the `audit_log_include_accounts` and `audit_log_exclude_accounts` system variables. The audit log plugin uses the session value to determine whether to audit events for the session. (There is a global value, but the plugin does not use it.)

* `audit_log_disable`

  <table frame="box" rules="all" summary="Properties for audit_log_disable"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-disable[={OFF|ON}]</code></td> </tr><tr><th>Introduced</th> <td>5.7.37</td> </tr><tr><th>System Variable</th> <td><code>audit_log_disable</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Permits disabling audit logging for all connecting and connected sessions. Disabling audit logging requires the `SUPER` privilege. See Section 6.4.5.9, “Disabling Audit Logging”.

* `audit_log_encryption`

  <table frame="box" rules="all" summary="Properties for audit_log_encryption"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-encryption=value</code></td> </tr><tr><th>Introduced</th> <td>5.7.21</td> </tr><tr><th>System Variable</th> <td><code>audit_log_encryption</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>NONE</code></td> </tr><tr><th>Valid Values</th> <td><code>NONE</code><code>AES</code></td> </tr></tbody></table>

  The type of encryption for the audit log file. Permitted values are `NONE` (no encryption; the default) and `AES` (AES-256-CBC cipher encryption). For more information, see Encrypting Audit Log Files.

* `audit_log_exclude_accounts`

  <table frame="box" rules="all" summary="Properties for audit_log_exclude_accounts"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-exclude-accounts=value</code></td> </tr><tr><th>System Variable</th> <td><code>audit_log_exclude_accounts</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>

  Note

  This variable applies only to legacy mode audit log filtering (see Section 6.4.5.10, “Legacy Mode Audit Log Filtering”).

  The accounts for which events should not be logged. The value should be `NULL` or a string containing a list of one or more comma-separated account names. For more information, see Section 6.4.5.7, “Audit Log Filtering”.

  Modifications to `audit_log_exclude_accounts` affect only connections created subsequent to the modification, not existing connections.

* `audit_log_file`

  <table frame="box" rules="all" summary="Properties for audit-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><code>ON</code><code>OFF</code><code>FORCE</code><code>FORCE_PLUS_PERMANENT</code></td> </tr></tbody></table>0

  The base name and suffix of the file to which the audit log plugin writes events. The default value is `audit.log`, regardless of logging format. To have the name suffix correspond to the format, set the name explicitly, choosing a different suffix (for example, `audit.xml` for XML format, `audit.json` for JSON format).

  If the value of `audit_log_file` is a relative path name, the plugin interprets it relative to the data directory. If the value is a full path name, the plugin uses the value as is. A full path name may be useful if it is desirable to locate audit files on a separate file system or directory. For security reasons, write the audit log file to a directory accessible only to the MySQL server and to users with a legitimate reason to view the log.

  For details about how the audit log plugin interprets the `audit_log_file` value and the rules for file renaming that occurs at plugin initialization and termination, see Naming Conventions for Audit Log Files.

  As of MySQL 5.7.21, the audit log plugin uses the directory containing the audit log file (determined from the `audit_log_file` value) as the location to search for readable audit log files. From these log files and the current file, the plugin constructs a list of the ones that are subject to use with the audit log bookmarking and reading functions. See Section 6.4.5.6, “Reading Audit Log Files”.

* `audit_log_filter_id`

  <table frame="box" rules="all" summary="Properties for audit-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><code>ON</code><code>OFF</code><code>FORCE</code><code>FORCE_PLUS_PERMANENT</code></td> </tr></tbody></table>1

  The session value of this variable indicates the internally maintained ID of the audit filter for the current session. A value of 0 means that the session has no filter assigned.

* `audit_log_flush`

  <table frame="box" rules="all" summary="Properties for audit-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><code>ON</code><code>OFF</code><code>FORCE</code><code>FORCE_PLUS_PERMANENT</code></td> </tr></tbody></table>2

  If `audit_log_rotate_on_size` is 0, automatic audit log file rotation is disabled and rotation occurs only when performed manually. In that case, enabling `audit_log_flush` by setting it to 1 or `ON` causes the audit log plugin to close and reopen its log file to flush it. (The variable value remains `OFF` so that you need not disable it explicitly before enabling it again to perform another flush.) For more information, see Section 6.4.5.5, “Configuring Audit Logging Characteristics”.

* `audit_log_format`

  <table frame="box" rules="all" summary="Properties for audit-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><code>ON</code><code>OFF</code><code>FORCE</code><code>FORCE_PLUS_PERMANENT</code></td> </tr></tbody></table>3

  The audit log file format. Permitted values are `OLD` (old-style XML), `NEW` (new-style XML; the default), and (as of MySQL 5.7.21) `JSON`. For details about each format, see Section 6.4.5.4, “Audit Log File Formats”.

  Note

  For information about issues to consider when changing the log format, see Selecting Audit Log File Format.

* `audit_log_format_unix_timestamp`

  <table frame="box" rules="all" summary="Properties for audit-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><code>ON</code><code>OFF</code><code>FORCE</code><code>FORCE_PLUS_PERMANENT</code></td> </tr></tbody></table>4

  This variable applies only for JSON-format audit log output. When that is true, enabling this variable causes each log file record to include a `time` field. The field value is an integer that represents the UNIX timestamp value indicating the date and time when the audit event was generated.

  Changing the value of this variable at runtime causes log file rotation so that, for a given JSON-format log file, all records in the file either do or do not include the `time` field.

* `audit_log_include_accounts`

  <table frame="box" rules="all" summary="Properties for audit-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><code>ON</code><code>OFF</code><code>FORCE</code><code>FORCE_PLUS_PERMANENT</code></td> </tr></tbody></table>5

  Note

  This variable applies only to legacy mode audit log filtering (see Section 6.4.5.10, “Legacy Mode Audit Log Filtering”).

  The accounts for which events should be logged. The value should be `NULL` or a string containing a list of one or more comma-separated account names. For more information, see Section 6.4.5.7, “Audit Log Filtering”.

  Modifications to `audit_log_include_accounts` affect only connections created subsequent to the modification, not existing connections.

* `audit_log_policy`

  <table frame="box" rules="all" summary="Properties for audit-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><code>ON</code><code>OFF</code><code>FORCE</code><code>FORCE_PLUS_PERMANENT</code></td> </tr></tbody></table>6

  Note

  This variable applies only to legacy mode audit log filtering (see Section 6.4.5.10, “Legacy Mode Audit Log Filtering”).

  The policy controlling how the audit log plugin writes events to its log file. The following table shows the permitted values.

  <table frame="box" rules="all" summary="Properties for audit-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><code>ON</code><code>OFF</code><code>FORCE</code><code>FORCE_PLUS_PERMANENT</code></td> </tr></tbody></table>7

  `audit_log_policy` can be set only at server startup. At runtime, it is a read-only variable. Two other system variables, `audit_log_connection_policy` and `audit_log_statement_policy`, provide finer control over logging policy and can be set either at startup or at runtime. If you use `audit_log_policy` at startup instead of the other two variables, the server uses its value to set those variables. For more information about the policy variables and their interaction, see Section 6.4.5.5, “Configuring Audit Logging Characteristics”.

* `audit_log_read_buffer_size`

  <table frame="box" rules="all" summary="Properties for audit-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><code>ON</code><code>OFF</code><code>FORCE</code><code>FORCE_PLUS_PERMANENT</code></td> </tr></tbody></table>8

  The buffer size for reading from the audit log file, in bytes. The `audit_log_read()` function reads no more than this many bytes. Log file reading is supported only for JSON log format. For more information, see Section 6.4.5.6, “Reading Audit Log Files”.

  As of MySQL 5.7.23, this variable has a default of 32KB and can be set at runtime. Each client should set its session value of `audit_log_read_buffer_size` appropriately for its use of `audit_log_read()`. Prior to MySQL 5.7.23, `audit_log_read_buffer_size` has a default of 1MB, affects all clients, and can be changed only at server startup.

* `audit_log_rotate_on_size`

  <table frame="box" rules="all" summary="Properties for audit-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><code>ON</code><code>OFF</code><code>FORCE</code><code>FORCE_PLUS_PERMANENT</code></td> </tr></tbody></table>9

  If `audit_log_rotate_on_size` is 0, the audit log plugin does not perform automatic size-based log file rotation. If rotation is to occur, you must perform it manually; see Manual Audit Log File Rotation.

  If `audit_log_rotate_on_size` is greater than 0, automatic size-based log file rotation occurs. Whenever a write to the log file causes its size to exceed the `audit_log_rotate_on_size` value, the audit log plugin renames the current log file and opens a new current log file using the original name.

  If you set `audit_log_rotate_on_size` to a value that is not a multiple of 4096, it is truncated to the nearest multiple. In particular, setting it to a value less than 4096 sets it to 0 and no rotation occurs, except manually.

  For more information about audit log file rotation, see Space Management of Audit Log Files.

* `audit_log_statement_policy`

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code>4096</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>0

  Note

  This variable applies only to legacy mode audit log filtering (see Section 6.4.5.10, “Legacy Mode Audit Log Filtering”).

  The policy controlling how the audit log plugin writes statement events to its log file. The following table shows the permitted values.

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code>4096</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>1

  Note

  At server startup, any explicit value given for `audit_log_statement_policy` may be overridden if `audit_log_policy` is also specified, as described in Section 6.4.5.5, “Configuring Audit Logging Characteristics”.

* `audit_log_strategy`

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code>4096</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>2

  The logging method used by the audit log plugin. These strategy values are permitted:

  + `ASYNCHRONOUS`: Log asynchronously. Wait for space in the output buffer.

  + `PERFORMANCE`: Log asynchronously. Drop requests for which there is insufficient space in the output buffer.

  + `SEMISYNCHRONOUS`: Log synchronously. Permit caching by the operating system.

  + `SYNCHRONOUS`: Log synchronously. Call `sync()` after each request.

##### Audit Log Status Variables

If the audit log plugin is enabled, it exposes several status variables that provide operational information. These variables are available for legacy mode audit filtering and JSON mode audit filtering.

* `Audit_log_current_size`

  The size of the current audit log file. The value increases when an event is written to the log and is reset to 0 when the log is rotated.

* `Audit_log_event_max_drop_size`

  The size of the largest dropped event in performance logging mode. For a description of logging modes, see Section 6.4.5.5, “Configuring Audit Logging Characteristics”.

* `Audit_log_events`

  The number of events handled by the audit log plugin, whether or not they were written to the log based on filtering policy (see Section 6.4.5.5, “Configuring Audit Logging Characteristics”).

* `Audit_log_events_filtered`

  The number of events handled by the audit log plugin that were filtered (not written to the log) based on filtering policy (see Section 6.4.5.5, “Configuring Audit Logging Characteristics”).

* `Audit_log_events_lost`

  The number of events lost in performance logging mode because an event was larger than the available audit log buffer space. This value may be useful for assessing how to set `audit_log_buffer_size` to size the buffer for performance mode. For a description of logging modes, see Section 6.4.5.5, “Configuring Audit Logging Characteristics”.

* `Audit_log_events_written`

  The number of events written to the audit log.

* `Audit_log_total_size`

  The total size of events written to all audit log files. Unlike `Audit_log_current_size`, the value of `Audit_log_total_size` increases even when the log is rotated.

* `Audit_log_write_waits`

  The number of times an event had to wait for space in the audit log buffer in asynchronous logging mode. For a description of logging modes, see Section 6.4.5.5, “Configuring Audit Logging Characteristics”.


#### 6.4.5.12 Audit Log Restrictions

MySQL Enterprise Audit is subject to these general restrictions:

* Only SQL statements are logged. Changes made by no-SQL APIs, such as memcached, Node.JS, and the NDB API, are not logged.

* Only top-level statements are logged, not statements within stored programs such as triggers or stored procedures.

* Contents of files referenced by statements such as `LOAD DATA` are not logged.

* Prior to MySQL 5.7.21, MySQL Enterprise Audit uses `MyISAM` tables in the `mysql` system database. Group Replication does not support `MyISAM` tables. Consequently, MySQL Enterprise Audit and Group Replication cannot be used together.

**NDB Cluster.** It is possible to use MySQL Enterprise Audit with MySQL NDB Cluster, subject to the following conditions:

* All changes to be logged must be done using the SQL interface. Changes using no-SQL interfaces, such as those provided by the NDB API, memcached, or ClusterJ, are not logged.

* The plugin must be installed on each MySQL server that is used to execute SQL on the cluster.

* Audit plugin data must be aggregated amongst all MySQL servers used with the cluster. This aggregation is the responsibility of the application or user.
*


### 6.4.6 MySQL Enterprise Firewall

Note

MySQL Enterprise Firewall is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

MySQL Enterprise Edition includes MySQL Enterprise Firewall, an application-level firewall that enables database administrators to permit or deny SQL statement execution based on matching against lists of accepted statement patterns. This helps harden MySQL Server against attacks such as SQL injection or attempts to exploit applications by using them outside of their legitimate query workload characteristics.

Each MySQL account registered with the firewall has its own statement allowlist, enabling protection to be tailored per account. For a given account, the firewall can operate in recording, protecting, or detecting mode, for training in the accepted statement patterns, active protection against unacceptable statements, or passive detection of unacceptable statements. The diagram illustrates how the firewall processes incoming statements in each mode.

**Figure 6.1 MySQL Enterprise Firewall Operation**

![Flow chart showing how MySQL Enterprise Firewall processes incoming SQL statements in recording, protecting, and detecting modes.](images/firewall-diagram-1.png)

The following sections describe the elements of MySQL Enterprise Firewall, discuss how to install and use it, and provide reference information for its elements.


#### 6.4.6.1 Elements of MySQL Enterprise Firewall

MySQL Enterprise Firewall is based on a plugin library that includes these elements:

* A server-side plugin named `MYSQL_FIREWALL` examines SQL statements before they execute and, based on the registered firewall profiles, renders a decision whether to execute or reject each statement.

* Server-side plugins named `MYSQL_FIREWALL_USERS` and `MYSQL_FIREWALL_WHITELIST` implement `INFORMATION_SCHEMA` tables that provide views into the registered profiles.

* Profiles are cached in memory for better performance. Tables in the `mysql` system database provide persistent backing storage of firewall data.

* Stored procedures perform tasks such as registering firewall profiles, establishing their operational mode, and managing transfer of firewall data between the in-memory cache and persistent storage.

* Administrative functions provide an API for lower-level tasks such as synchronizing the cache with persistent storage.

* System variables enable firewall configuration and status variables provide runtime operational information.


#### 6.4.6.2 Installing or Uninstalling MySQL Enterprise Firewall

MySQL Enterprise Firewall installation is a one-time operation that installs the elements described in Section 6.4.6.1, “Elements of MySQL Enterprise Firewall”. Installation can be performed using a graphical interface or manually:

* On Windows, MySQL Installer includes an option to enable MySQL Enterprise Firewall for you.

* MySQL Workbench 6.3.4 or higher can install MySQL Enterprise Firewall, enable or disable an installed firewall, or uninstall the firewall.

* Manual MySQL Enterprise Firewall installation involves running a script located in the `share` directory of your MySQL installation.

Important

Read this entire section before following its instructions. Parts of the procedure differ depending on your environment.

Note

If installed, MySQL Enterprise Firewall involves some minimal overhead even when disabled. To avoid this overhead, do not install the firewall unless you plan to use it.

Note

MySQL Enterprise Firewall does not work together with the query cache. If the query cache is enabled, disable it before installing the firewall (see Section 8.10.3.3, “Query Cache Configuration”).

For usage instructions, see Section 6.4.6.3, “Using MySQL Enterprise Firewall”. For reference information, see Section 6.4.6.4, “MySQL Enterprise Firewall Reference”.

* Installing MySQL Enterprise Firewall
* Uninstalling MySQL Enterprise Firewall

##### Installing MySQL Enterprise Firewall

If MySQL Enterprise Firewall is already installed from an older version of MySQL, uninstall it using the instructions given later in this section and then restart your server before installing the current version. In this case, it is also necessary to register your configuration again.

On Windows, you can use MySQL Installer to install MySQL Enterprise Firewall, as shown in Figure 6.2, “MySQL Enterprise Firewall Installation on Windows”. Check the Enable MySQL Enterprise Firewall check box. (Open Firewall port for network access has a different purpose. It refers to Windows Firewall and controls whether Windows blocks the TCP/IP port on which the MySQL server listens for client connections.)

**Figure 6.2 MySQL Enterprise Firewall Installation on Windows**

![Content is described in the surrounding text.](images/firewall-windows-installer-option.png)

To install MySQL Enterprise Firewall using MySQL Workbench 6.3.4 or higher, see MySQL Enterprise Firewall Interface.

To install MySQL Enterprise Firewall manually, look in the `share` directory of your MySQL installation and choose the script that is appropriate for your platform. The available scripts differ in the suffix used to refer to the plugin library file:

* `win_install_firewall.sql`: Choose this script for Windows systems that use `.dll` as the file name suffix.

* `linux_install_firewall.sql`: Choose this script for Linux and similar systems that use `.so` as the file name suffix.

The installation script creates stored procedures in the default database, `mysql`. Run the script as follows on the command line. The example here uses the Linux installation script. Make the appropriate substitutions for your system.

```sql
$> mysql -u root -p < linux_install_firewall.sql
Enter password: (enter root password here)
```

Note

As of MySQL 5.7.21, for a new installation of MySQL Enterprise Firewall, `InnoDB` is used instead of `MyISAM` for the firewall tables. For upgrades to 5.7.21 or higher of an installation for which MySQL Enterprise Firewall is already installed, it is recommended that you alter the firewall tables to use `InnoDB`:

```sql
ALTER TABLE mysql.firewall_users ENGINE=InnoDB;
ALTER TABLE mysql.firewall_whitelist ENGINE=InnoDB;
```

Note

To use MySQL Enterprise Firewall in the context of source/replica replication, Group Replication, or InnoDB Cluster, you must use MySQL 5.7.21 or higher, and ensure that the firewall tables use `InnoDB` as just described. Then you must prepare the replica nodes prior to running the installation script on the source node. This is necessary because the `INSTALL PLUGIN` statements in the script are not replicated.

1. On each replica node, extract the `INSTALL PLUGIN` statements from the installation script and execute them manually.

2. On the source node, run the installation script as described previously.

Installing MySQL Enterprise Firewall either using a graphical interface or manually should enable the firewall. To verify that, connect to the server and execute this statement:

```sql
mysql> SHOW GLOBAL VARIABLES LIKE 'mysql_firewall_mode';
+---------------------+-------+
| Variable_name       | Value |
+---------------------+-------+
| mysql_firewall_mode | ON    |
+---------------------+-------+
```

If the plugin fails to initialize, check the server error log for diagnostic messages.

##### Uninstalling MySQL Enterprise Firewall

MySQL Enterprise Firewall can be uninstalled using MySQL Workbench or manually.

To uninstall MySQL Enterprise Firewall using MySQL Workbench 6.3.4 or higher, see MySQL Enterprise Firewall Interface, in Chapter 29, *MySQL Workbench*.

To uninstall MySQL Enterprise Firewall manually, execute the following statements. Statements use `IF EXISTS` because, depending on the previously installed firewall version, some objects might not exist.

```sql
DROP TABLE IF EXISTS mysql.firewall_users;
DROP TABLE IF EXISTS mysql.firewall_whitelist;

UNINSTALL PLUGIN MYSQL_FIREWALL;
UNINSTALL PLUGIN MYSQL_FIREWALL_USERS;
UNINSTALL PLUGIN MYSQL_FIREWALL_WHITELIST;

DROP FUNCTION IF EXISTS mysql_firewall_flush_status;
DROP FUNCTION IF EXISTS normalize_statement;
DROP FUNCTION IF EXISTS read_firewall_users;
DROP FUNCTION IF EXISTS read_firewall_whitelist;
DROP FUNCTION IF EXISTS set_firewall_mode;

DROP PROCEDURE IF EXISTS mysql.sp_reload_firewall_rules;
DROP PROCEDURE IF EXISTS mysql.sp_set_firewall_mode;
```


#### 6.4.6.3 Using MySQL Enterprise Firewall

Before using MySQL Enterprise Firewall, install it according to the instructions provided in Section 6.4.6.2, “Installing or Uninstalling MySQL Enterprise Firewall”. Also, MySQL Enterprise Firewall does not work together with the query cache; disable the query cache if it is enabled (see Section 8.10.3.3, “Query Cache Configuration”).

This section describes how to configure MySQL Enterprise Firewall using SQL statements. Alternatively, MySQL Workbench 6.3.4 or higher provides a graphical interface for firewall control. See MySQL Enterprise Firewall Interface.

* Enabling or Disabling the Firewall
* Assigning Firewall Privileges
* Firewall Concepts
* Registering Firewall Account Profiles
* Monitoring the Firewall

##### Enabling or Disabling the Firewall

To enable or disable the firewall, set the `mysql_firewall_mode` system variable. By default, this variable is enabled when the firewall is installed. To control the initial firewall state explicitly, you can set the variable at server startup. For example, to enable the firewall in an option file, use these lines:

```sql
[mysqld]
mysql_firewall_mode=ON
```

After modifying `my.cnf`, restart the server to cause the new setting to take effect.

It is also possible to disable or enable the firewall at runtime:

```sql
SET GLOBAL mysql_firewall_mode = OFF;
SET GLOBAL mysql_firewall_mode = ON;
```

##### Assigning Firewall Privileges

With the firewall installed, grant the appropriate privileges to the MySQL account or accounts to be used for administering it:

* Grant the `EXECUTE` privilege for the firewall stored procedures in the `mysql` system database. These may invoke administrative functions, so stored procedure access also requires the privileges needed for those functions.

* Grant the `SUPER` privilege so that the firewall administrative functions can be executed.

##### Firewall Concepts

The MySQL server permits clients to connect and receives from them SQL statements to be executed. If the firewall is enabled, the server passes to it each incoming statement that does not immediately fail with a syntax error. Based on whether the firewall accepts the statement, the server executes it or returns an error to the client. This section describes how the firewall accomplishes the task of accepting or rejecting statements.

* Firewall Profiles
* Firewall Statement Matching
* Profile Operational Modes

###### Firewall Profiles

The firewall uses a registry of profiles that determine whether to permit statement execution. Profiles have these attributes:

* An allowlist. The allowlist is the set of rules that defines which statements are acceptable to the profile.

* A current operational mode. The mode enables the profile to be used in different ways. For example: the profile can be placed in training mode to establish the allowlist; the allowlist can be used for restricting statement execution or intrusion detection; the profile can be disabled entirely.

* A scope of applicability. The scope indicates which client connections the profile applies to.

  The firewall supports account-based profiles such that each profile matches a particular client account (client user name and host name combination). For example, you can register one account profile for which the allowlist applies to connections originating from `admin@localhost` and another account profile for which the allowlist applies to connections originating from `myapp@apphost.example.com`.

Initially, no profiles exist, so by default, the firewall accepts all statements and has no effect on which statements MySQL accounts can execute. To apply firewall protective capabilities, explicit action is required:

* Register one or more profiles with the firewall.
* Train the firewall by establishing the allowlist for each profile; that is, the types of statements the profile permits clients to execute.

* Place the trained profiles in protecting mode to harden MySQL against unauthorized statement execution:

  + MySQL associates each client session with a specific user name and host name combination. This combination is the *session account*.

  + For each client connection, the firewall uses the session account to determine which profile applies to handling incoming statements from the client.

    The firewall accepts only statements permitted by the applicable profile allowlist.

The profile-based protection afforded by the firewall enables implementation of strategies such as these:

* If an application has unique protection requirements, configure it to use an account not used for any other purpose and set up a profile for that account.

* If related applications share protection requirements, configure them all to use the same account (and thus the same account profile).

###### Firewall Statement Matching

Statement matching performed by the firewall does not use SQL statements as received from clients. Instead, the server converts incoming statements to normalized digest form and firewall operation uses these digests. The benefit of statement normalization is that it enables similar statements to be grouped and recognized using a single pattern. For example, these statements are distinct from each other:

```sql
SELECT first_name, last_name FROM customer WHERE customer_id = 1;
select first_name, last_name from customer where customer_id = 99;
SELECT first_name, last_name FROM customer WHERE customer_id = 143;
```

But all of them have the same normalized digest form:

```sql
SELECT `first_name` , `last_name` FROM `customer` WHERE `customer_id` = ?
```

By using normalization, firewall allowlists can store digests that each match many different statements received from clients. For more information about normalization and digests, see Section 25.10, “Performance Schema Statement Digests”.

Warning

Setting the `max_digest_length` system variable to zero disables digest production, which also disables server functionality that requires digests, such as MySQL Enterprise Firewall.

###### Profile Operational Modes

Each profile registered with the firewall has its own operational mode, chosen from these values:

* `OFF`: This mode disables the profile. The firewall considers it inactive and ignores it.

* `RECORDING`: This is the firewall training mode. Incoming statements received from a client that matches the profile are considered acceptable for the profile and become part of its “fingerprint.” The firewall records the normalized digest form of each statement to learn the acceptable statement patterns for the profile. Each pattern is a rule, and the union of the rules is the profile allowlist.

* `PROTECTING`: In this mode, the profile allows or prevents statement execution. The firewall matches incoming statements against the profile allowlist, accepting only statements that match and rejecting those that do not. After training a profile in `RECORDING` mode, switch it to `PROTECTING` mode to harden MySQL against access by statements that deviate from the allowlist. If the `mysql_firewall_trace` system variable is enabled, the firewall also writes rejected statements to the error log.

* `DETECTING`: This mode detects but not does not block intrusions (statements that are suspicious because they match nothing in the profile allowlist). In `DETECTING` mode, the firewall writes suspicious statements to the error log but accepts them without denying access.

When a profile is assigned any of the preceding mode values, the firewall stores the mode in the profile. Firewall mode-setting operations also permit a mode value of `RESET`, but this value is not stored: setting a profile to `RESET` mode causes the firewall to delete all rules for the profile and set its mode to `OFF`.

Note

Messages written to the error log in `DETECTING` mode or because `mysql_firewall_trace` is enabled are written as Notes, which are information messages. To ensure that such messages appear in the error log and are not discarded, set the `log_error_verbosity` system variable to a value of 3.

As previously mentioned, MySQL associates each client session with a specific user name and host name combination known as the *session account*. The firewall matches the session account against registered profiles to determine which profile applies to handling incoming statements from the session:

* The firewall ignores inactive profiles (profiles with a mode of `OFF`).

* The session account matches an active account profile having the same user and host, if there is one. There is at most one such account profile.

After matching the session account to registered profiles, the firewall handles each incoming statement as follows:

* If there is no applicable profile, the firewall imposes no restrictions and accepts the statement.

* If there is an applicable profile, its mode determines statement handling:

  + In `RECORDING` mode, the firewall adds the statement to the profile allowlist rules and accepts it.

  + In `PROTECTING` mode, the firewall compares the statement to the rules in the profile allowlist. The firewall accepts the statement if there is a match, and rejects it otherwise. If the `mysql_firewall_trace` system variable is enabled, the firewall also writes rejected statements to the error log.

  + In `DETECTING` mode, the firewall detects instrusions without denying access. The firewall accepts the statement, but also matches it to the profile allowlist, as in `PROTECTING` mode. If the statement is suspicious (nonmatching), the firewall writes it to the error log.

##### Registering Firewall Account Profiles

MySQL Enterprise Firewall enables profiles to be registered that correspond to individual accounts. To use a firewall account profile to protect MySQL against incoming statements from a given account, follow these steps:

1. Register the account profile and put it in `RECORDING` mode.

2. Connect to the MySQL server using the account and execute statements to be learned. This trains the account profile and establishes the rules that form the profile allowlist.

3. Switch the account profile to `PROTECTING` mode. When a client connects to the server using the account, the account profile allowlist restricts statement execution.

4. Should additional training be necessary, switch the account profile to `RECORDING` mode again, update its allowlist with new statement patterns, then switch it back to `PROTECTING` mode.

Observe these guidelines for firewall-related account references:

* Take note of the context in which account references occur. To name an account for firewall operations, specify it as a single quoted string (`'user_name@host_name'`). This differs from the usual MySQL convention for statements such as `CREATE USER` and `GRANT`, for which you quote the user and host parts of an account name separately (`'user_name'@'host_name'`).

  The requirement for naming accounts as a single quoted string for firewall operations means that you cannot use accounts that have embedded `@` characters in the user name.

* The firewall assesses statements against accounts represented by actual user and host names as authenticated by the server. When registering accounts in profiles, do not use wildcard characters or netmasks:

  + Suppose that an account named `me@%.example.org` exists and a client uses it to connect to the server from the host `abc.example.org`.

  + The account name contains a `%` wildcard character, but the server authenticates the client as having a user name of `me` and host name of `abc.example.com`, and that is what the firewall sees.

  + Consequently, the account name to use for firewall operations is `me@abc.example.org` rather than `me@%.example.org`.

The following procedure shows how to register an account profile with the firewall, train the firewall to know the acceptable statements for that profile (its allowlist), and use the profile to protect MySQL against execution of unacceptable statements by the account. The example account, `fwuser@localhost`, is presumed for use by an application that accesses tables in the `sakila` database (available at https://dev.mysql.com/doc/index-other.html).

Use an administrative MySQL account to perform the steps in this procedure, except those steps designated for execution by the `fwuser@localhost` account that corresponds to the account profile registered with the firewall. For statements executed using this account, the default database should be `sakila`. (You can use a different database by adjusting the instructions accordingly.)

1. If necessary, create the account to use for executing statements (choose an appropriate password) and grant it privileges for the `sakila` database:

   ```sql
   CREATE USER 'fwuser'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL ON sakila.* TO 'fwuser'@'localhost';
   ```

2. Use the `sp_set_firewall_mode()` stored procedure to register the account profile with the firewall and place the profile in `RECORDING` (training) mode:

   ```sql
   CALL mysql.sp_set_firewall_mode('fwuser@localhost', 'RECORDING');
   ```

3. To train the registered account profile, connect to the server as `fwuser` from the server host so that the firewall sees a session account of `fwuser@localhost`. Then use the account to execute some statements to be considered legitimate for the profile. For example:

   ```sql
   SELECT first_name, last_name FROM customer WHERE customer_id = 1;
   UPDATE rental SET return_date = NOW() WHERE rental_id = 1;
   SELECT get_customer_balance(1, NOW());
   ```

   Because the profile is in `RECORDING` mode, the firewall records the normalized digest form of the statements as rules in the profile allowlist.

   Note

   Until the `fwuser@localhost` account profile receives statements in `RECORDING` mode, its allowlist is empty, which is equivalent to “deny all.” No statement can match an empty allowlist, which has these implications:

   * The account profile cannot be switched to `PROTECTING` mode. It would reject every statement, effectively prohibiting the account from executing any statement.

   * The account profile can be switched to `DETECTING` mode. In this case, the profile accepts every statement but logs it as suspicious.

4. At this point, the account profile information is cached. To see this information, query the `INFORMATION_SCHEMA` firewall tables:

   ```sql
   mysql> SELECT MODE FROM INFORMATION_SCHEMA.MYSQL_FIREWALL_USERS
          WHERE USERHOST = 'fwuser@localhost';
   +-----------+
   | MODE      |
   +-----------+
   | RECORDING |
   +-----------+
   mysql> SELECT RULE FROM INFORMATION_SCHEMA.MYSQL_FIREWALL_WHITELIST
          WHERE USERHOST = 'fwuser@localhost';
   +----------------------------------------------------------------------------+
   | RULE                                                                       |
   +----------------------------------------------------------------------------+
   | SELECT `first_name` , `last_name` FROM `customer` WHERE `customer_id` = ?  |
   | SELECT `get_customer_balance` ( ? , NOW ( ) )                              |
   | UPDATE `rental` SET `return_date` = NOW ( ) WHERE `rental_id` = ?          |
   | SELECT @@`version_comment` LIMIT ?                                         |
   +----------------------------------------------------------------------------+
   ```

   Note

   The `@@version_comment` rule comes from a statement sent automatically by the **mysql** client when you connect to the server.

   Important

   Train the firewall under conditions matching application use. For example, to determine server characteristics and capabilities, a given MySQL connector might send statements to the server at the beginning of each session. If an application normally is used through that connector, train the firewall using the connector, too. That enables those initial statements to become part of the allowlist for the account profile associated with the application.

5. Invoke `sp_set_firewall_mode()` again, this time switching the account profile to `PROTECTING` mode:

   ```sql
   CALL mysql.sp_set_firewall_mode('fwuser@localhost', 'PROTECTING');
   ```

   Important

   Switching the account profile out of `RECORDING` mode synchronizes its cached data to the `mysql` system database tables that provide persistent underlying storage. If you do not switch the mode for a profile that is being recorded, the cached data is not written to persistent storage and is lost when the server is restarted.

6. Test the account profile by using the account to execute some acceptable and unacceptable statements. The firewall matches each statement from the account against the profile allowlist and accepts or rejects it:

   * This statement is not identical to a training statement but produces the same normalized statement as one of them, so the firewall accepts it:

     ```sql
     mysql> SELECT first_name, last_name FROM customer WHERE customer_id = '48';
     +------------+-----------+
     | first_name | last_name |
     +------------+-----------+
     | ANN        | EVANS     |
     +------------+-----------+
     ```

   * These statements match nothing in the allowlist, so the firewall rejects each with an error:

     ```sql
     mysql> SELECT first_name, last_name FROM customer WHERE customer_id = 1 OR TRUE;
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> SHOW TABLES LIKE 'customer%';
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> TRUNCATE TABLE mysql.slow_log;
     ERROR 1045 (28000): Statement was blocked by Firewall
     ```

   * If the `mysql_firewall_trace` system variable is enabled, the firewall also writes rejected statements to the error log. For example:

     ```sql
     [Note] Plugin MYSQL_FIREWALL reported:
     'ACCESS DENIED for fwuser@localhost. Reason: No match in whitelist.
     Statement: TRUNCATE TABLE `mysql` . `slow_log` '
     ```

     These log messages may be helpful in identifying the source of attacks, should that be necessary.

The firewall account profile now is trained for the `fwuser@localhost` account. When clients connect using that account and attempt to execute statements, the profile protects MySQL against statements not matched by the profile allowlist.

It is possible to detect intrusions by logging nonmatching statements as suspicious without denying access. First, put the account profile in `DETECTING` mode:

```sql
CALL mysql.sp_set_firewall_mode('fwuser@localhost', 'DETECTING');
```

Then, using the account, execute a statement that does not match the account profile allowlist. In `DETECTING` mode, the firewall permits the nonmatching statement to execute:

```sql
mysql> SHOW TABLES LIKE 'customer%';
+------------------------------+
| Tables_in_sakila (customer%) |
+------------------------------+
| customer                     |
| customer_list                |
+------------------------------+
```

In addition, the firewall writes a message to the error log:

```sql
[Note] Plugin MYSQL_FIREWALL reported:
'SUSPICIOUS STATEMENT from 'fwuser@localhost'. Reason: No match in whitelist.
Statement: SHOW TABLES LIKE ? '
```

To disable an account profile, change its mode to `OFF`:

```sql
CALL mysql.sp_set_firewall_mode(user, 'OFF');
```

To forget all training for a profile and disable it, reset it:

```sql
CALL mysql.sp_set_firewall_mode(user, 'RESET');
```

The reset operation causes the firewall to delete all rules for the profile and set its mode to `OFF`.

##### Monitoring the Firewall

To assess firewall activity, examine its status variables. For example, after performing the procedure shown earlier to train and protect the `fwuser@localhost` account, the variables look like this:

```sql
mysql> SHOW GLOBAL STATUS LIKE 'Firewall%';
+----------------------------+-------+
| Variable_name              | Value |
+----------------------------+-------+
| Firewall_access_denied     | 3     |
| Firewall_access_granted    | 4     |
| Firewall_access_suspicious | 1     |
| Firewall_cached_entries    | 4     |
+----------------------------+-------+
```

The variables indicate the number of statements rejected, accepted, logged as suspicious, and added to the cache, respectively. The `Firewall_access_granted` count is 4 because of the `@@version_comment` statement sent by the **mysql** client each of the three times you connected using the registered account, plus the `SHOW TABLES` statement that was not blocked in `DETECTING` mode.


#### 6.4.6.4 MySQL Enterprise Firewall Reference

The following sections provide a reference to MySQL Enterprise Firewall elements:

* MySQL Enterprise Firewall Tables
* MySQL Enterprise Firewall Stored Procedures
* MySQL Enterprise Firewall Administrative Functions
* MySQL Enterprise Firewall System Variables
* MySQL Enterprise Firewall Status Variables

##### MySQL Enterprise Firewall Tables

MySQL Enterprise Firewall maintains profile information on a per-group and per-account basis, using tables in the firewall database for persistent storage and Information Schema tables to provide views into in-memory cached data. When enabled, the firewall bases operational decisions on the cached data. The firewall database can be the `mysql` system database or a custom schema (see Installing MySQL Enterprise Firewall).

Tables in the firewall database are covered in this section. For information about MySQL Enterprise Firewall Information Schema tables, see Section 24.7, “INFORMATION\_SCHEMA MySQL Enterprise Firewall Tables”.

Each `mysql` system database table is accessible only by accounts that have the `SELECT` privilege for it. The `INFORMATION_SCHEMA` tables are accessible by anyone.

The `mysql.firewall_users` table lists names and operational modes of registered firewall account profiles. The table has the following columns (with the corresponding Information Schema `MYSQL_FIREWALL_USERS` table having similar but not necessarily identical columns):

* `USERHOST`

  The account profile name. Each account name has the format `user_name@host_name`.

* `MODE`

  The current operational mode for the profile. Permitted mode values are `OFF`, `DETECTING`, `PROTECTING`, `RECORDING`, and `RESET`. For details about their meanings, see Firewall Concepts.

The `mysql.firewall_whitelist` table lists allowlist rules of registered firewall account profiles. The table has the following columns (with the corresponding Information Schema `MYSQL_FIREWALL_WHITELIST` table having similar but not necessarily identical columns):

* `USERHOST`

  The account profile name. Each account name has the format `user_name@host_name`.

* `RULE`

  A normalized statement indicating an acceptable statement pattern for the profile. A profile allowlist is the union of its rules.

* `ID`

  An integer column that is a primary key for the table. This column was added in MySQL 5.7.23.

##### MySQL Enterprise Firewall Stored Procedures

MySQL Enterprise Firewall stored procedures perform tasks such as registering profiles with the firewall, establishing their operational mode, and managing transfer of firewall data between the cache and persistent storage. These procedures invoke administrative functions that provide an API for lower-level tasks.

Firewall stored procedures are created in the `mysql` system database. To invoke a firewall stored procedure, either do so while `mysql` is the default database, or qualify the procedure name with the database name. For example:

```sql
CALL mysql.sp_set_firewall_mode(user, mode);
```

The following list describes each firewall stored procedure:

* `sp_reload_firewall_rules(user)`

  This stored procedure provides control over firewall operation for individual account profiles. The procedure uses firewall administrative functions to reload the in-memory rules for an account profile from the rules stored in the `mysql.firewall_whitelist` table.

  Arguments:

  + *`user`*: The name of the affected account profile, as a string in `user_name@host_name` format.

  Example:

  ```sql
  CALL mysql.sp_reload_firewall_rules('fwuser@localhost');
  ```

  Warning

  This procedure clears the account profile in-memory allowlist rules before reloading them from persistent storage, and sets the profile mode to `OFF`. If the profile mode was not `OFF` prior to the `sp_reload_firewall_rules()` call, use `sp_set_firewall_mode()` to restore its previous mode after reloading the rules. For example, if the profile was in `PROTECTING` mode, that is no longer true after calling `sp_reload_firewall_rules()` and you must set it to `PROTECTING` again explicitly.

* `sp_set_firewall_mode(user, mode)`

  This stored procedure establishes the operational mode for a firewall account profile, after registering the profile with the firewall if it was not already registered. The procedure also invokes firewall administrative functions as necessary to transfer firewall data between the cache and persistent storage. This procedure may be called even if the `mysql_firewall_mode` system variable is `OFF`, although setting the mode for a profile has no operational effect until the firewall is enabled.

  Arguments:

  + *`user`*: The name of the affected account profile, as a string in `user_name@host_name` format.

  + *`mode`*: The operational mode for the profile, as a string. Permitted mode values are `OFF`, `DETECTING`, `PROTECTING`, `RECORDING`, and `RESET`. For details about their meanings, see Firewall Concepts.

  Switching an account profile to any mode but `RECORDING` synchronizes its firewall cache data to the `mysql` system database tables that provide persistent underlying storage. Switching the mode from `OFF` to `RECORDING` reloads the allowlist from the `mysql.firewall_whitelist` table into the cache.

  If an account profile has an empty allowlist, its mode cannot be set to `PROTECTING` because the profile would reject every statement, effectively prohibiting the account from executing statements. In response to such a mode-setting attempt, the firewall produces a diagnostic message that is returned as a result set rather than as an SQL error:

  ```sql
  mysql> CALL mysql.sp_set_firewall_mode('a@b','PROTECTING');
  +----------------------------------------------------------------------+
  | set_firewall_mode(arg_userhost, arg_mode)                            |
  +----------------------------------------------------------------------+
  | ERROR: PROTECTING mode requested for a@b but the whitelist is empty. |
  +----------------------------------------------------------------------+
  1 row in set (0.02 sec)

  Query OK, 0 rows affected (0.02 sec)
  ```

##### MySQL Enterprise Firewall Administrative Functions

MySQL Enterprise Firewall administrative functions provide an API for lower-level tasks such as synchronizing the firewall cache with the underlying system tables.

*Under normal operation, these functions are invoked by the firewall stored procedures, not directly by users.* For that reason, these function descriptions do not include details such as information about their arguments and return types.

* Firewall Account Profile Functions
* Firewall Miscellaneous Functions

###### Firewall Account Profile Functions

These functions perform management operations on firewall account profiles:

* `read_firewall_users(user, mode)`

  This aggregate function updates the firewall account profile cache through a `SELECT` statement on the `mysql.firewall_users` table. It requires the `SUPER` privilege.

  Example:

  ```sql
  SELECT read_firewall_users('fwuser@localhost', 'RECORDING')
  FROM mysql.firewall_users;
  ```

* `read_firewall_whitelist(user, rule)`

  This aggregate function updates the recorded-statement cache for the named account profile through a `SELECT` statement on the `mysql.firewall_whitelist` table. It requires the `SUPER` privilege.

  Example:

  ```sql
  SELECT read_firewall_whitelist('fwuser@localhost', fw.rule)
  FROM mysql.firewall_whitelist AS fw
  WHERE USERHOST = 'fwuser@localhost';
  ```

* `set_firewall_mode(user, mode)`

  This function manages the account profile cache and establishes the profile operational mode. It requires the `SUPER` privilege.

  Example:

  ```sql
  SELECT set_firewall_mode('fwuser@localhost', 'RECORDING');
  ```

###### Firewall Miscellaneous Functions

These functions perform miscellaneous firewall operations:

* `mysql_firewall_flush_status()`

  This function resets several firewall status variables to 0:

  + `Firewall_access_denied`
  + `Firewall_access_granted`
  + `Firewall_access_suspicious`

  This function requires the `SUPER` privilege.

  Example:

  ```sql
  SELECT mysql_firewall_flush_status();
  ```

* `normalize_statement(stmt)`

  This function normalizes an SQL statement into the digest form used for allowlist rules. It requires the `SUPER` privilege.

  Example:

  ```sql
  SELECT normalize_statement('SELECT * FROM t1 WHERE c1 > 2');
  ```

##### MySQL Enterprise Firewall System Variables

MySQL Enterprise Firewall supports the following system variables. Use them to configure firewall operation. These variables are unavailable unless the firewall is installed (see Section 6.4.6.2, “Installing or Uninstalling MySQL Enterprise Firewall”).

* `mysql_firewall_mode`

  <table frame="box" rules="all" summary="Properties for mysql_firewall_mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysql-firewall-mode[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>mysql_firewall_mode</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  Whether MySQL Enterprise Firewall is enabled (the default) or disabled.

* `mysql_firewall_trace`

  <table frame="box" rules="all" summary="Properties for mysql_firewall_trace"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysql-firewall-trace[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>mysql_firewall_trace</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Whether the MySQL Enterprise Firewall trace is enabled or disabled (the default). When `mysql_firewall_trace` is enabled, for `PROTECTING` mode, the firewall writes rejected statements to the error log.

##### MySQL Enterprise Firewall Status Variables

MySQL Enterprise Firewall supports the following status variables. Use them to obtain information about firewall operational status. These variables are unavailable unless the firewall is installed (see Section 6.4.6.2, “Installing or Uninstalling MySQL Enterprise Firewall”). Firewall status variables are set to 0 whenever the `MYSQL_FIREWALL` plugin is installed or the server is started. Many of them are reset to zero by the `mysql_firewall_flush_status()` function (see MySQL Enterprise Firewall Administrative Functions).

* `Firewall_access_denied`

  The number of statements rejected by MySQL Enterprise Firewall.

* `Firewall_access_granted`

  The number of statements accepted by MySQL Enterprise Firewall.

* `Firewall_access_suspicious`

  The number of statements logged by MySQL Enterprise Firewall as suspicious for users who are in `DETECTING` mode.

* `Firewall_cached_entries`

  The number of statements recorded by MySQL Enterprise Firewall, including duplicates.
