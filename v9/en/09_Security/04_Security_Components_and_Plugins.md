## 8.4 Security Components and Plugins

MySQL includes several components and plugins that implement security features:

* Plugins for authenticating attempts by clients to connect to MySQL Server. Plugins are available for several authentication protocols. For general discussion of the authentication process, see Section 8.2.17, “Pluggable Authentication”. For characteristics of specific authentication plugins, see Section 8.4.1, “Authentication Plugins”.

* A password-validation component for implementing password strength policies and assessing the strength of potential passwords. See Section 8.4.4, “The Password Validation Component”.

* Keyring components and plugins that provide secure storage for sensitive information. See Section 8.4.5, “The MySQL Keyring”.

* (MySQL Enterprise Edition only) MySQL Enterprise Audit, implemented using a server plugin, uses the open MySQL Audit API to enable standard, policy-based monitoring and logging of connection and query activity executed on specific MySQL servers. Designed to meet the Oracle audit specification, MySQL Enterprise Audit provides an out of box, easy to use auditing and compliance solution for applications that are governed by both internal and external regulatory guidelines. See Section 8.4.6, “MySQL Enterprise Audit”.

* A function enables applications to add their own message events to the audit log. See Section 8.4.7, “The Audit Message Component”.

* (MySQL Enterprise Edition only) MySQL Enterprise Firewall, an application-level firewall that enables database administrators to permit or deny SQL statement execution based on matching against lists of accepted statement patterns. This helps harden MySQL Server against attacks such as SQL injection or attempts to exploit applications by using them outside of their legitimate query workload characteristics. See Section 8.4.8, “MySQL Enterprise Firewall”.

* (MySQL Enterprise Edition only) MySQL Enterprise Data Masking, implemented as a plugin library containing a plugin and a set of functions. Data masking hides sensitive information by replacing real values with substitutes. MySQL Enterprise Data Masking functions enable masking existing data using several methods such as obfuscation (removing identifying characteristics), generation of formatted random data, and data replacement or substitution. See Section 8.5, “MySQL Enterprise Data Masking”.


### 8.4.1 Authentication Plugins

Note

If you are looking for information about the `authentication_oci` plugin, it is MySQL HeatWave Service only. See [authentication_oci plugin](https://docs.oracle.com/en-us/iaas/mysql-database/doc/connecting-db-system.html#MYAAS-GUID-232CA959-1FDD-4AA8-A77D-0A551C881C09), in the *MySQL HeatWave Service* manual.

The following sections describe pluggable authentication methods available in MySQL and the plugins that implement these methods. For general discussion of the authentication process, see Section 8.2.17, “Pluggable Authentication”.

The default authentication plugin is determined as described in The Default Authentication Plugin.


#### 8.4.1.1 Caching SHA-2 Pluggable Authentication

MySQL provides two authentication plugins that implement SHA-256 hashing for user account passwords:

* `caching_sha2_password`: Implements SHA-256 authentication (like `sha256_password`), but uses caching on the server side for better performance and has additional features for wider applicability.

* `sha256_password`: Implements basic SHA-256 authentication. This is deprecated and subject to removal, do not use this authentication plugin.

This section describes the caching SHA-2 authentication plugin. For information about the original basic (noncaching) deprecated plugin, see Section 8.4.1.2, “SHA-256 Pluggable Authentication”.

Important

In MySQL 9.5, `caching_sha2_password` is the default authentication plugin; `mysql_native_password` is no longer available. For information about the implications of this change for server operation and compatibility of the server with clients and connectors, see caching_sha2_password as the Preferred Authentication Plugin.

Important

To connect to the server using an account that authenticates with the `caching_sha2_password` plugin, you must use either a secure connection or an unencrypted connection that supports password exchange using an RSA key pair, as described later in this section. Either way, the `caching_sha2_password` plugin uses MySQL's encryption capabilities. See Section 8.3, “Using Encrypted Connections”.

Note

In the name `sha256_password`, “sha256” refers to the 256-bit digest length the plugin uses for encryption. In the name `caching_sha2_password`, “sha2” refers more generally to the SHA-2 class of encryption algorithms, of which 256-bit encryption is one instance. The latter name choice leaves room for future expansion of possible digest lengths without changing the plugin name.

The `caching_sha2_password` plugin has these advantages, compared to `sha256_password`:

* On the server side, an in-memory cache enables faster reauthentication of users who have connected previously when they connect again.

* RSA-based password exchange is available regardless of the SSL library against which MySQL is linked.

* Support is provided for client connections that use the Unix socket-file and shared-memory protocols.

The following table shows the plugin names on the server and client sides.

**Table 8.14 Plugin and Library Names for SHA-2 Authentication**

<table summary="Names for the plugins and library file used for SHA-2 password authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>caching_sha2_password</code></td> </tr><tr> <td>Client-side plugin</td> <td><code>caching_sha2_password</code></td> </tr><tr> <td>Library file</td> <td>None (plugins are built in)</td> </tr></tbody></table>

The following sections provide installation and usage information specific to caching SHA-2 pluggable authentication:

* Installing SHA-2 Pluggable Authentication
* Using SHA-2 Pluggable Authentication
* Cache Operation for SHA-2 Pluggable Authentication

For general information about pluggable authentication in MySQL, see Section 8.2.17, “Pluggable Authentication”.

##### Installing SHA-2 Pluggable Authentication

The `caching_sha2_password` plugin exists in server and client forms:

* The server-side plugin is built into the server, need not be loaded explicitly, and cannot be disabled by unloading it.

* The client-side plugin is built into the `libmysqlclient` client library and is available to any program linked against `libmysqlclient`.

The server-side plugin uses the `sha2_cache_cleaner` audit plugin as a helper to perform password cache management. `sha2_cache_cleaner`, like `caching_sha2_password`, is built in and need not be installed.

##### Using SHA-2 Pluggable Authentication

To set up an account that uses the `caching_sha2_password` plugin for SHA-256 password hashing, use the following statement, where *`password`* is the desired account password:

```
CREATE USER 'sha2user'@'localhost'
IDENTIFIED WITH caching_sha2_password BY 'password';
```

The server assigns the `caching_sha2_password` plugin to the account and uses it to encrypt the password using SHA-256, storing those values in the `plugin` and `authentication_string` columns of the `mysql.user` system table.

The preceding instructions do not assume that `caching_sha2_password` is the default authentication plugin. If `caching_sha2_password` is the default authentication plugin, a simpler [`CREATE USER`](create-user.html "15.7.1.3 CREATE USER Statement") syntax can be used:

```
CREATE USER 'sha2user'@'localhost' IDENTIFIED BY 'password';
```

The default plugin is determined by the value of the `authentication_policy` system variable; the default is to use `caching_sha2_password`.

To use a different plugin, you must specify it using `IDENTIFIED WITH`. For example, to specify the deprecated `sha256_password` plugin, use this statement:

```
CREATE USER 'nativeuser'@'localhost'
IDENTIFIED WITH sha256_password BY 'password';
```

`caching_sha2_password` supports connections over secure transport. If you follow the RSA configuration procedure given later in this section, it also supports encrypted password exchange using RSA over unencrypted connections. RSA support has these characteristics:

* On the server side, two system variables name the RSA private and public key-pair files: `caching_sha2_password_private_key_path` and `caching_sha2_password_public_key_path`. The database administrator must set these variables at server startup if the key files to use have names that differ from the system variable default values.

* The server uses the `caching_sha2_password_auto_generate_rsa_keys` system variable to determine whether to automatically generate the RSA key-pair files. See Section 8.3.3, “Creating SSL and RSA Certificates and Keys”.

* The `Caching_sha2_password_rsa_public_key` status variable displays the RSA public key value used by the `caching_sha2_password` authentication plugin.

* Clients that are in possession of the RSA public key can perform RSA key pair-based password exchange with the server during the connection process, as described later.

* For connections by accounts that authenticate with `caching_sha2_password` and RSA key pair-based password exchange, the server does not send the RSA public key to clients by default. Clients can use a client-side copy of the required public key, or request the public key from the server.

  Use of a trusted local copy of the public key enables the client to avoid a round trip in the client/server protocol, and is more secure than requesting the public key from the server. On the other hand, requesting the public key from the server is more convenient (it requires no management of a client-side file) and may be acceptable in secure network environments.

  + For command-line clients, use the `--server-public-key-path` option to specify the RSA public key file. Use the `--get-server-public-key` option to request the public key from the server. The following programs support the two options: **mysql**, **mysqlsh**, **mysqladmin**, **mysqlbinlog**, **mysqlcheck**, **mysqldump**, **mysqlimport**, **mysqlshow**, **mysqlslap**, **mysqltest**.

  + For programs that use the C API, call `mysql_options()` to specify the RSA public key file by passing the `MYSQL_SERVER_PUBLIC_KEY` option and the name of the file, or request the public key from the server by passing the `MYSQL_OPT_GET_SERVER_PUBLIC_KEY` option.

  + For replicas, use the [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement") statement with the `SOURCE_PUBLIC_KEY_PATH` option to specify the RSA public key file, or the `GET_SOURCE_PUBLIC_KEY` option to request the public key from the source. For Group Replication, the `group_replication_recovery_public_key_path` and `group_replication_recovery_get_public_key` system variables serve the same purpose.

  In all cases, if the option is given to specify a valid public key file, it takes precedence over the option to request the public key from the server.

For clients that use the `caching_sha2_password` plugin, passwords are never exposed as cleartext when connecting to the server. How password transmission occurs depends on whether a secure connection or RSA encryption is used:

* If the connection is secure, an RSA key pair is unnecessary and is not used. This applies to TCP connections encrypted using TLS, as well as Unix socket-file and shared-memory connections. The password is sent as cleartext but cannot be snooped because the connection is secure.

* If the connection is not secure, an RSA key pair is used. This applies to TCP connections not encrypted using TLS and named-pipe connections. RSA is used only for password exchange between client and server, to prevent password snooping. When the server receives the encrypted password, it decrypts it. A scramble is used in the encryption to prevent repeat attacks.

To enable use of an RSA key pair for password exchange during the client connection process, use the following procedure:

1. Create the RSA private and public key-pair files using the instructions in Section 8.3.3, “Creating SSL and RSA Certificates and Keys”.

2. If the private and public key files are located in the data directory and are named `private_key.pem` and `public_key.pem` (the default values of the `caching_sha2_password_private_key_path` and `caching_sha2_password_public_key_path` system variables), the server uses them automatically at startup.

   Otherwise, to name the key files explicitly, set the system variables to the key file names in the server option file. If the files are located in the server data directory, you need not specify their full path names:

   ```
   [mysqld]
   caching_sha2_password_private_key_path=myprivkey.pem
   caching_sha2_password_public_key_path=mypubkey.pem
   ```

   If the key files are not located in the data directory, or to make their locations explicit in the system variable values, use full path names:

   ```
   [mysqld]
   caching_sha2_password_private_key_path=/usr/local/mysql/myprivkey.pem
   caching_sha2_password_public_key_path=/usr/local/mysql/mypubkey.pem
   ```

3. If you want to change the number of hash rounds used by `caching_sha2_password` during password generation, set the `caching_sha2_password_digest_rounds` system variable. For example:

   ```
   [mysqld]
   caching_sha2_password_digest_rounds=10000
   ```

4. Restart the server, then connect to it and check the `Caching_sha2_password_rsa_public_key` status variable value. The value actually displayed differs from that shown here, but should be nonempty:

   ```
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

```
$> mysql --ssl-mode=DISABLED -u sha2user -p
Enter password: password
```

For this connection attempt by `sha2user`, the server determines that `caching_sha2_password` is the appropriate authentication plugin and invokes it (because that was the plugin specified at `CREATE USER` time). The plugin finds that the connection is not encrypted and thus requires the password to be transmitted using RSA encryption. However, the server does not send the public key to the client, and the client provided no public key, so it cannot encrypt the password and the connection fails:

```
ERROR 2061 (HY000): Authentication plugin 'caching_sha2_password'
reported error: Authentication requires secure connection.
```

To request the RSA public key from the server, specify the `--get-server-public-key` option:

```
$> mysql --ssl-mode=DISABLED -u sha2user -p --get-server-public-key
Enter password: password
```

In this case, the server sends the RSA public key to the client, which uses it to encrypt the password and returns the result to the server. The plugin uses the RSA private key on the server side to decrypt the password and accepts or rejects the connection based on whether the password is correct.

Alternatively, if the client has a file containing a local copy of the RSA public key required by the server, it can specify the file using the `--server-public-key-path` option:

```
$> mysql --ssl-mode=DISABLED -u sha2user -p --server-public-key-path=file_name
Enter password: password
```

In this case, the client uses the public key to encrypt the password and returns the result to the server. The plugin uses the RSA private key on the server side to decrypt the password and accepts or rejects the connection based on whether the password is correct.

The public key value in the file named by the `--server-public-key-path` option should be the same as the key value in the server-side file named by the `caching_sha2_password_public_key_path` system variable. If the key file contains a valid public key value but the value is incorrect, an access-denied error occurs. If the key file does not contain a valid public key, the client program cannot use it.

Client users can obtain the RSA public key two ways:

* The database administrator can provide a copy of the public key file.

* A client user who can connect to the server some other way can use a `SHOW STATUS LIKE 'Caching_sha2_password_rsa_public_key'` statement and save the returned key value in a file.

##### Cache Operation for SHA-2 Pluggable Authentication

On the server side, the `caching_sha2_password` plugin uses an in-memory cache for faster authentication of clients who have connected previously. Entries consist of account-name/password-hash pairs. The cache works like this:

1. When a client connects, `caching_sha2_password` checks whether the client and password match some cache entry. If so, authentication succeeds.

2. If there is no matching cache entry, the plugin attempts to verify the client against the credentials in the `mysql.user` system table. If this succeeds, `caching_sha2_password` adds an entry for the client to the hash. Otherwise, authentication fails and the connection is rejected.

In this way, when a client first connects, authentication against the `mysql.user` system table occurs. When the client connects subsequently, faster authentication against the cache occurs.

Password cache operations other than adding entries are handled by the `sha2_cache_cleaner` audit plugin, which performs these actions on behalf of `caching_sha2_password`:

* It clears the cache entry for any account that is renamed or dropped, or any account for which the credentials or authentication plugin are changed.

* It empties the cache when the [`FLUSH PRIVILEGES`](flush.html#flush-privileges) statement is executed.

* It empties the cache at server shutdown. (This means the cache is not persistent across server restarts.)

Cache clearing operations affect the authentication requirements for subsequent client connections. For each user account, the first client connection for the user after any of the following operations must use a secure connection (made using TCP using TLS credentials, a Unix socket file, or shared memory) or RSA key pair-based password exchange:

* After account creation.
* After a password change for the account.
* After `RENAME USER` for the account.

* After `FLUSH PRIVILEGES`.

`FLUSH PRIVILEGES` clears the entire cache and affects all accounts that use the `caching_sha2_password` plugin. The other operations clear specific cache entries and affect only accounts that are part of the operation.

Once the user authenticates successfully, the account is entered into the cache and subsequent connections do not require a secure connection or the RSA key pair, until another cache clearing event occurs that affects the account. (When the cache can be used, the server uses a challenge-response mechanism that does not use cleartext password transmission and does not require a secure connection.)


#### 8.4.1.2 SHA-256 Pluggable Authentication

MySQL provides two authentication plugins that implement SHA-256 hashing for user account passwords:

* `sha256_password`: Implements basic SHA-256 authentication.

* `caching_sha2_password`: Implements SHA-256 authentication (like `sha256_password`), but uses caching on the server side for better performance and has additional features for wider applicability.

This section describes the original noncaching SHA-2 authentication plugin. For information about the caching plugin, see Section 8.4.1.1, “Caching SHA-2 Pluggable Authentication”.

Important

In MySQL 9.5, `caching_sha2_password` is the default authentication plugin; `mysql_native_password` is no longer available. For information about the implications of this change for server operation and compatibility of the server with clients and connectors, see caching_sha2_password as the Preferred Authentication Plugin.

Because `caching_sha2_password` is the default authentication plugin in MySQL 9.5 and provides a superset of the capabilities of the `sha256_password` authentication plugin, `sha256_password` is deprecated; expect it to be removed in a future version of MySQL. MySQL accounts that authenticate using `sha256_password` should be migrated to use `caching_sha2_password` instead.

Important

To connect to the server using an account that authenticates with the `sha256_password` plugin, you must use either a TLS connection or an unencrypted connection that supports password exchange using an RSA key pair, as described later in this section. Either way, the `sha256_password` plugin uses MySQL's encryption capabilities. See Section 8.3, “Using Encrypted Connections”.

Note

In the name `sha256_password`, “sha256” refers to the 256-bit digest length the plugin uses for encryption. In the name `caching_sha2_password`, “sha2” refers more generally to the SHA-2 class of encryption algorithms, of which 256-bit encryption is one instance. The latter name choice leaves room for future expansion of possible digest lengths without changing the plugin name.

The following table shows the plugin names on the server and client sides.

**Table 8.15 Plugin and Library Names for SHA-256 Authentication**

<table summary="Names for the plugins and library file used for SHA-256 password authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>sha256_password</code></td> </tr><tr> <td>Client-side plugin</td> <td><code>sha256_password</code></td> </tr><tr> <td>Library file</td> <td>None (plugins are built in)</td> </tr></tbody></table>

The following sections provide installation and usage information specific to SHA-256 pluggable authentication:

* Installing SHA-256 Pluggable Authentication
* Using SHA-256 Pluggable Authentication

For general information about pluggable authentication in MySQL, see Section 8.2.17, “Pluggable Authentication”.

##### Installing SHA-256 Pluggable Authentication

The `sha256_password` plugin exists in server and client forms:

* The server-side plugin is built into the server, need not be loaded explicitly, and cannot be disabled by unloading it.

* The client-side plugin is built into the `libmysqlclient` client library and is available to any program linked against `libmysqlclient`.

##### Using SHA-256 Pluggable Authentication

To set up an account that uses the `sha256_password` plugin for SHA-256 password hashing, use the following statement, where *`password`* is the desired account password:

```
CREATE USER 'sha256user'@'localhost'
IDENTIFIED WITH sha256_password BY 'password';
```

The server assigns the `sha256_password` plugin to the account and uses it to encrypt the password using SHA-256, storing those values in the `plugin` and `authentication_string` columns of the `mysql.user` system table.

(The `IDENTIFIED WITH` clause is not needed if `sha256_password` is the default plugin; this can be specified using `authentication_policy`.)

`sha256_password` supports connections over secure transport. `sha256_password` also supports encrypted password exchange using RSA over unencrypted connections if MySQL is compiled using OpenSSL, and the MySQL server to which you wish to connect is configured to support RSA (using the RSA configuration procedure given later in this section).

RSA support has these characteristics:

* On the server side, two system variables name the RSA private and public key-pair files: `sha256_password_private_key_path` and `sha256_password_public_key_path`. The database administrator must set these variables at server startup if the key files to use have names that differ from the system variable default values.

* The server uses the `sha256_password_auto_generate_rsa_keys` system variable to determine whether to automatically generate the RSA key-pair files. See Section 8.3.3, “Creating SSL and RSA Certificates and Keys”.

* The `Rsa_public_key` status variable displays the RSA public key value used by the `sha256_password` authentication plugin.

* Clients that are in possession of the RSA public key can perform RSA key pair-based password exchange with the server during the connection process, as described later.

* For connections by accounts that authenticate with `sha256_password` and RSA public key pair-based password exchange, the server sends the RSA public key to the client as needed. However, if a copy of the public key is available on the client host, the client can use it to save a round trip in the client/server protocol:

  + For these command-line clients, use the `--server-public-key-path` option to specify the RSA public key file: **mysql**, **mysqladmin**, **mysqlbinlog**, **mysqlcheck**, **mysqldump**, **mysqlimport**, **mysqlshow**, **mysqlslap**, **mysqltest**.

  + For programs that use the C API, call `mysql_options()` to specify the RSA public key file by passing the `MYSQL_SERVER_PUBLIC_KEY` option and the name of the file.

  + For replicas, use the [`CHANGE REPLICATION SOURCE TO`](change-replication-source-to.html "15.4.2.2 CHANGE REPLICATION SOURCE TO Statement") statement with the `SOURCE_PUBLIC_KEY_PATH` option to specify the RSA public key file. For Group Replication, the `group_replication_recovery_get_public_key` system variable serves the same purpose.

For clients that use the `sha256_password` plugin, passwords are never exposed as cleartext when connecting to the server. How password transmission occurs depends on whether a secure connection or RSA encryption is used:

* If the connection is secure, an RSA key pair is unnecessary and is not used. This applies to connections encrypted using TLS. The password is sent as cleartext but cannot be snooped because the connection is secure.

  Note

  Unlike `caching_sha2_password`, the `sha256_password` plugin does not treat shared-memory connections as secure, even though share-memory transport is secure by default.

* If the connection is not secure, and an RSA key pair is available, the connection remains unencrypted. This applies to connections not encrypted using TLS. RSA is used only for password exchange between client and server, to prevent password snooping. When the server receives the encrypted password, it decrypts it. A scramble is used in the encryption to prevent repeat attacks.

* If a secure connection is not used and RSA encryption is not available, the connection attempt fails because the password cannot be sent without being exposed as cleartext.

Note

To use RSA password encryption with `sha256_password`, the client and server both must be compiled using OpenSSL, not just one of them.

Assuming that MySQL has been compiled using OpenSSL, use the following procedure to enable use of an RSA key pair for password exchange during the client connection process:

1. Create the RSA private and public key-pair files using the instructions in Section 8.3.3, “Creating SSL and RSA Certificates and Keys”.

2. If the private and public key files are located in the data directory and are named `private_key.pem` and `public_key.pem` (the default values of the `sha256_password_private_key_path` and `sha256_password_public_key_path` system variables), the server uses them automatically at startup.

   Otherwise, to name the key files explicitly, set the system variables to the key file names in the server option file. If the files are located in the server data directory, you need not specify their full path names:

   ```
   [mysqld]
   sha256_password_private_key_path=myprivkey.pem
   sha256_password_public_key_path=mypubkey.pem
   ```

   If the key files are not located in the data directory, or to make their locations explicit in the system variable values, use full path names:

   ```
   [mysqld]
   sha256_password_private_key_path=/usr/local/mysql/myprivkey.pem
   sha256_password_public_key_path=/usr/local/mysql/mypubkey.pem
   ```

3. Restart the server, then connect to it and check the `Rsa_public_key` status variable value. The value actually displayed differs from that shown here, but should be nonempty:

   ```
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

```
$> mysql --ssl-mode=DISABLED -u sha256user -p
Enter password: password
```

For this connection attempt by `sha256user`, the server determines that `sha256_password` is the appropriate authentication plugin and invokes it (because that was the plugin specified at `CREATE USER` time). The plugin finds that the connection is not encrypted and thus requires the password to be transmitted using RSA encryption. In this case, the plugin sends the RSA public key to the client, which uses it to encrypt the password and returns the result to the server. The plugin uses the RSA private key on the server side to decrypt the password and accepts or rejects the connection based on whether the password is correct.

The server sends the RSA public key to the client as needed. However, if the client has a file containing a local copy of the RSA public key required by the server, it can specify the file using the `--server-public-key-path` option:

```
$> mysql --ssl-mode=DISABLED -u sha256user -p --server-public-key-path=file_name
Enter password: password
```

The public key value in the file named by the `--server-public-key-path` option should be the same as the key value in the server-side file named by the `sha256_password_public_key_path` system variable. If the key file contains a valid public key value but the value is incorrect, an access-denied error occurs. If the key file does not contain a valid public key, the client program cannot use it. In this case, the `sha256_password` plugin sends the public key to the client as if no `--server-public-key-path` option had been specified.

Client users can obtain the RSA public key two ways:

* The database administrator can provide a copy of the public key file.

* A client user who can connect to the server some other way can use a `SHOW STATUS LIKE 'Rsa_public_key'` statement and save the returned key value in a file.


#### 8.4.1.3 Client-Side Cleartext Pluggable Authentication

A client-side authentication plugin is available that enables clients to send passwords to the server as cleartext, without hashing or encryption. This plugin is built into the MySQL client library.

The following table shows the plugin name.

**Table 8.16 Plugin and Library Names for Cleartext Authentication**

<table summary="Names for the plugins and library file used for cleartext password authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td>None, see discussion</td> </tr><tr> <td>Client-side plugin</td> <td><code>mysql_clear_password</code></td> </tr><tr> <td>Library file</td> <td>None (plugin is built in)</td> </tr></tbody></table>

Many client-side authentication plugins perform hashing or encryption of a password before the client sends it to the server. This enables clients to avoid sending passwords as cleartext.

Hashing or encryption cannot be done for authentication schemes that require the server to receive the password as entered on the client side. In such cases, the client-side `mysql_clear_password` plugin is used, which enables the client to send the password to the server as cleartext. There is no corresponding server-side plugin. Rather, `mysql_clear_password` can be used on the client side in concert with any server-side plugin that needs a cleartext password. (Examples are the PAM and simple LDAP authentication plugins; see Section 8.4.1.4, “PAM Pluggable Authentication”, and Section 8.4.1.6, “LDAP Pluggable Authentication”.)

The following discussion provides usage information specific to cleartext pluggable authentication. For general information about pluggable authentication in MySQL, see Section 8.2.17, “Pluggable Authentication”.

Note

Sending passwords as cleartext may be a security problem in some configurations. To avoid problems if there is any possibility that the password would be intercepted, clients should connect to MySQL Server using a method that protects the password. Possibilities include SSL (see Section 8.3, “Using Encrypted Connections”), IPsec, or a private network.

To make inadvertent use of the `mysql_clear_password` plugin less likely, MySQL clients must explicitly enable it. This can be done in several ways:

* Set the `LIBMYSQL_ENABLE_CLEARTEXT_PLUGIN` environment variable to a value that begins with `1`, `Y`, or `y`. This enables the plugin for all client connections.

* The **mysql**, **mysqladmin**, **mysqlcheck**, **mysqldump**, **mysqlshow**, and **mysqlslap** client programs support an `--enable-cleartext-plugin` option that enables the plugin on a per-invocation basis.

* The `mysql_options()` C API function supports a `MYSQL_ENABLE_CLEARTEXT_PLUGIN` option that enables the plugin on a per-connection basis. Also, any program that uses `libmysqlclient` and reads option files can enable the plugin by including an `enable-cleartext-plugin` option in an option group read by the client library.


#### 8.4.1.4 PAM Pluggable Authentication

Note

PAM pluggable authentication is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

MySQL Enterprise Edition supports an authentication method that enables MySQL Server to use PAM (Pluggable Authentication Modules) to authenticate MySQL users. PAM enables a system to use a standard interface to access various kinds of authentication methods, such as traditional Unix passwords or an LDAP directory.

PAM pluggable authentication provides these capabilities:

* External authentication: PAM authentication enables MySQL Server to accept connections from users defined outside the MySQL grant tables and that authenticate using methods supported by PAM.

* Proxy user support: PAM authentication can return to MySQL a user name different from the external user name passed by the client program, based on the PAM groups the external user is a member of and the authentication string provided. This means that the plugin can return the MySQL user that defines the privileges the external PAM-authenticated user should have. For example, an operating system user named `joe` can connect and have the privileges of a MySQL user named `developer`.

PAM pluggable authentication has been tested on Linux and macOS; note that Windows does not support PAM.

The following table shows the plugin and library file names. The file name suffix might differ on your system. The file must be located in the directory named by the `plugin_dir` system variable. For installation information, see Installing PAM Pluggable Authentication.

**Table 8.17 Plugin and Library Names for PAM Authentication**

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

For general information about pluggable authentication in MySQL, see Section 8.2.17, “Pluggable Authentication”. For information about the `mysql_clear_password` plugin, see Section 8.4.1.3, “Client-Side Cleartext Pluggable Authentication”. For proxy user information, see Section 8.2.19, “Proxy Users”.

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

This section describes how to install the server-side PAM authentication plugin. For general information about installing plugins, see Section 7.6.1, “Installing and Uninstalling Plugins”.

To be usable by the server, the plugin library file must be located in the MySQL plugin directory (the directory named by the `plugin_dir` system variable). If necessary, configure the plugin directory location by setting the value of `plugin_dir` at server startup.

The plugin library file base name is `authentication_pam`, and is typically compiled with the `.so` suffix.

To load the plugin at server startup, use the `--plugin-load-add` option to name the library file that contains it. With this plugin-loading method, the option must be given each time the server starts. For example, put these lines in the server `my.cnf` file:

```
[mysqld]
plugin-load-add=authentication_pam.so
```

After modifying `my.cnf`, restart the server to cause the new settings to take effect.

Alternatively, to load the plugin at runtime, use this statement, adjusting the `.so` suffix as necessary:

```
INSTALL PLUGIN authentication_pam SONAME 'authentication_pam.so';
```

`INSTALL PLUGIN` loads the plugin immediately, and also registers it in the `mysql.plugins` system table to cause the server to load it for each subsequent normal startup without the need for `--plugin-load-add`.

To verify plugin installation, examine the Information Schema `PLUGINS` table or use the `SHOW PLUGINS` statement (see Section 7.6.2, “Obtaining Server Plugin Information”). For example:

```
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

  ```
  UNINSTALL PLUGIN authentication_pam;
  ```

##### Using PAM Pluggable Authentication

This section describes in general terms how to use the PAM authentication plugin to connect from MySQL client programs to the server. The following sections provide instructions for using PAM authentication in specific ways. It is assumed that the server is running with the server-side PAM plugin enabled, as described in Installing PAM Pluggable Authentication.

To refer to the PAM authentication plugin in the `IDENTIFIED WITH` clause of a `CREATE USER` statement, use the name `authentication_pam`. For example:

```
CREATE USER user
  IDENTIFIED WITH authentication_pam
  AS 'auth_string';
```

The authentication string specifies the following types of information:

* The PAM service name (see How PAM Authentication of MySQL Users Works). Examples in the following discussion use a service name of `mysql-unix` for authentication using traditional Unix passwords, and `mysql-ldap` for authentication using LDAP.

* For proxy support, PAM provides a way for a PAM module to return to the server a MySQL user name other than the external user name passed by the client program when it connects to the server. Use the authentication string to control the mapping from external user names to MySQL user names. If you want to take advantage of proxy user capabilities, the authentication string must include this kind of mapping.

For example, if an account uses the `mysql-unix` PAM service name and should map operating system users in the `root` and `users` PAM groups to the `developer` and `data_entry` MySQL users, respectively, use a statement like this:

```
CREATE USER user
  IDENTIFIED WITH authentication_pam
  AS 'mysql-unix, root=developer, users=data_entry';
```

Authentication string syntax for the PAM authentication plugin follows these rules:

* The string consists of a PAM service name, optionally followed by a PAM group mapping list consisting of one or more keyword/value pairs each specifying a PAM group name and a MySQL user name:

  ```
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

  PAM authentication, when not done through proxy users or PAM groups, requires the MySQL user name to be same as the operating system user name. MySQL user names are limited to 32 characters (see Section 8.2.3, “Grant Tables”), which limits PAM nonproxy authentication to Unix accounts with names of at most 32 characters.

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

   ```
   #%PAM-1.0
   auth            include         password-auth
   account         include         password-auth
   ```

   For macOS, use `login` rather than `password-auth`.

   The PAM file format might differ on some systems. For example, on Ubuntu and other Debian-based systems, use these file contents instead:

   ```
   @include common-auth
   @include common-account
   @include common-session-noninteractive
   ```

3. Create a MySQL account with the same user name as the operating system user name and define it to authenticate using the PAM plugin and the `mysql-unix` PAM service:

   ```
   CREATE USER 'antonio'@'localhost'
     IDENTIFIED WITH authentication_pam
     AS 'mysql-unix';
   GRANT ALL PRIVILEGES
     ON mydb.*
     TO 'antonio'@'localhost';
   ```

   Here, the authentication string contains only the PAM service name, `mysql-unix`, which authenticates Unix passwords.

4. Use the **mysql** command-line client to connect to the MySQL server as `antonio`. For example:

   ```
   $> mysql --user=antonio --password --enable-cleartext-plugin
   Enter password: antonio_password
   ```

   The server should permit the connection and the following query returns output as shown:

   ```
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

* To make inadvertent use of the `mysql_clear_password` plugin less likely, MySQL clients must explicitly enable it (for example, with the `--enable-cleartext-plugin` option). See Section 8.4.1.3, “Client-Side Cleartext Pluggable Authentication”.

* To avoid password exposure with the `mysql_clear_password` plugin enabled, MySQL clients should connect to the MySQL server using an encrypted connection. See Section 8.3.1, “Configuring MySQL to Use Encrypted Connections”.

##### PAM LDAP Authentication without Proxy Users

This authentication scenario uses PAM to check external users defined in terms of operating system user names and LDAP passwords, without proxying. Every such external user permitted to connect to MySQL Server should have a matching MySQL account that is defined to use PAM authentication through LDAP.

To use PAM LDAP pluggable authentication for MySQL, these prerequisites must be satisfied:

* An LDAP server must be available for the PAM LDAP service to communicate with.

* Each LDAP user to be authenticated by MySQL must be present in the directory managed by the LDAP server.

Note

Another way to use LDAP for MySQL user authentication is to use the LDAP-specific authentication plugins. See Section 8.4.1.6, “LDAP Pluggable Authentication”.

Configure MySQL for PAM LDAP authentication as follows:

1. Verify that Unix authentication permits logins to the operating system with the user name `antonio` and password *`antonio_password`*.

2. Set up PAM to authenticate MySQL connections using LDAP by creating a `mysql-ldap` PAM service file named `/etc/pam.d/mysql-ldap`. The file contents are system dependent, so check existing login-related files in the `/etc/pam.d` directory to see what they look like. On Linux, the `mysql-ldap` file might look like this:

   ```
   #%PAM-1.0
   auth        required    pam_ldap.so
   account     required    pam_ldap.so
   ```

   If PAM object files have a suffix different from `.so` on your system, substitute the correct suffix.

   The PAM file format might differ on some systems.

3. Create a MySQL account with the same user name as the operating system user name and define it to authenticate using the PAM plugin and the `mysql-ldap` PAM service:

   ```
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

   ```
   #%PAM-1.0
   auth            include         password-auth
   account         include         password-auth
   ```

   For macOS, use `login` rather than `password-auth`.

   The PAM file format might differ on some systems. For example, on Ubuntu and other Debian-based systems, use these file contents instead:

   ```
   @include common-auth
   @include common-account
   @include common-session-noninteractive
   ```

4. Create a default proxy user (`''@''`) that maps external PAM users to the proxied accounts:

   ```
   CREATE USER ''@''
     IDENTIFIED WITH authentication_pam
     AS 'mysql-unix, root=developer, users=data_entry';
   ```

   Here, the authentication string contains the PAM service name, `mysql-unix`, which authenticates Unix passwords. The authentication string also maps external users in the `root` and `users` PAM groups to the `developer` and `data_entry` MySQL user names, respectively.

   The PAM group mapping list following the PAM service name is required when you set up proxy users. Otherwise, the plugin cannot tell how to perform mapping from external user names to the proper proxied MySQL user names.

   Note

   If your MySQL installation has anonymous users, they might conflict with the default proxy user. For more information about this issue, and ways of dealing with it, see Default Proxy User and Anonymous User Conflicts.

5. Create the proxied accounts and grant to each one the privileges it should have:

   ```
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

   The proxied accounts use the `mysql_no_login` authentication plugin to prevent clients from using the accounts to log in directly to the MySQL server. Instead, users who authenticate using PAM are expected to use the `developer` or `data_entry` account by proxy based on their PAM group. (This assumes that the plugin is installed. For instructions, see Section 8.4.1.8, “No-Login Pluggable Authentication”.) For alternative methods of protecting proxied accounts against direct use, see Preventing Direct Login to Proxied Accounts.

6. Grant to the proxy account the `PROXY` privilege for each proxied account:

   ```
   GRANT PROXY
     ON 'developer'@'localhost'
     TO ''@'';
   GRANT PROXY
     ON 'data_entry'@'localhost'
     TO ''@'';
   ```

7. Use the **mysql** command-line client to connect to the MySQL server as `antonio`.

   ```
   $> mysql --user=antonio --password --enable-cleartext-plugin
   Enter password: antonio_password
   ```

   The server authenticates the connection using the default `''@''` proxy account. The resulting privileges for `antonio` depend on which PAM groups `antonio` is a member of. If `antonio` is a member of the `root` PAM group, the PAM plugin maps `root` to the `developer` MySQL user name and returns that name to the server. The server verifies that `''@''` has the `PROXY` privilege for `developer` and permits the connection. The following query returns output as shown:

   ```
   mysql> SELECT USER(), CURRENT_USER(), @@proxy_user;
   +-------------------+---------------------+--------------+
   | USER()            | CURRENT_USER()      | @@proxy_user |
   +-------------------+---------------------+--------------+
   | antonio@localhost | developer@localhost | ''@''        |
   +-------------------+---------------------+--------------+
   ```

   This demonstrates that the `antonio` operating system user is authenticated to have the privileges granted to the `developer` MySQL user, and that proxying occurs through the default proxy account.

   If `antonio` is not a member of the `root` PAM group but is a member of the `users` PAM group, a similar process occurs, but the plugin maps `user` PAM group membership to the `data_entry` MySQL user name and returns that name to the server:

   ```
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

* To make inadvertent use of the `mysql_clear_password` plugin less likely, MySQL clients must explicitly enable it (for example, with the `--enable-cleartext-plugin` option). See Section 8.4.1.3, “Client-Side Cleartext Pluggable Authentication”.

* To avoid password exposure with the `mysql_clear_password` plugin enabled, MySQL clients should connect to the MySQL server using an encrypted connection. See Section 8.3.1, “Configuring MySQL to Use Encrypted Connections”.

##### PAM Authentication Access to Unix Password Store

On some systems, Unix authentication uses a password store such as `/etc/shadow`, a file that typically has restricted access permissions. This can cause MySQL PAM-based authentication to fail. Unfortunately, the PAM implementation does not permit distinguishing “password could not be checked” (due, for example, to inability to read `/etc/shadow`) from “password does not match.” If you are using Unix password store for PAM authentication, you may be able to enable access to it from MySQL using one of the following methods:

* Assuming that the MySQL server is run from the `mysql` operating system account, put that account in the `shadow` group that has `/etc/shadow` access:

  1. Create a `shadow` group in `/etc/group`.

  2. Add the `mysql` operating system user to the `shadow` group in `/etc/group`.

  3. Assign `/etc/group` to the `shadow` group and enable the group read permission:

     ```
     chgrp shadow /etc/shadow
     chmod g+r /etc/shadow
     ```

  4. Restart the MySQL server.
* If you are using the `pam_unix` module and the **unix_chkpwd** utility, enable password store access as follows:

  ```
  chmod u-s /usr/sbin/unix_chkpwd
  setcap cap_dac_read_search+ep /usr/sbin/unix_chkpwd
  ```

  Adjust the path to **unix_chkpwd** as necessary for your platform.

##### PAM Authentication Debugging

The PAM authentication plugin checks at initialization time whether the `AUTHENTICATION_PAM_LOG` environment value is set. If so, the plugin enables logging of diagnostic messages to the standard output. These messages may be helpful for debugging PAM-related issues that occur when the plugin performs authentication.

Setting `AUTHENTICATION_PAM_LOG=1` (or some other arbitrary value) does *not* include any passwords. If you wish to include passwords in these messages, set `AUTHENTICATION_PAM_LOG=PAM_LOG_WITH_SECRET_INFO`.

Some messages include reference to PAM plugin source files and line numbers, which enables plugin actions to be tied more closely to the location in the code where they occur.

Another technique for debugging connection failures and determining what is happening during connection attempts is to configure PAM authentication to permit all connections, then check the system log files. This technique should be used only on a *temporary* basis, and not on a production server.

Configure a PAM service file named `/etc/pam.d/mysql-any-password` with these contents (the format may differ on some systems):

```
#%PAM-1.0
auth        required    pam_permit.so
account     required    pam_permit.so
```

Create an account that uses the PAM plugin and names the `mysql-any-password` PAM service:

```
CREATE USER 'testuser'@'localhost'
  IDENTIFIED WITH authentication_pam
  AS 'mysql-any-password';
```

The `mysql-any-password` service file causes any authentication attempt to return true, even for incorrect passwords. If an authentication attempt fails, that tells you the configuration problem is on the MySQL side. Otherwise, the problem is on the operating system/PAM side. To see what might be happening, check system log files such as `/var/log/secure`, `/var/log/audit.log`, `/var/log/syslog`, or `/var/log/messages`.

After determining what the problem is, remove the `mysql-any-password` PAM service file to disable any-password access.


#### 8.4.1.5 Windows Pluggable Authentication

Note

Windows pluggable authentication is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

MySQL Enterprise Edition for Windows supports an authentication method that performs external authentication on Windows, enabling MySQL Server to use native Windows services to authenticate client connections. Users who have logged in to Windows can connect from MySQL client programs to the server based on the information in their environment without specifying an additional password.

The client and server exchange data packets in the authentication handshake. As a result of this exchange, the server creates a security context object that represents the identity of the client in the Windows OS. This identity includes the name of the client account. Windows pluggable authentication uses the identity of the client to check whether it is a given account or a member of a group. By default, negotiation uses Kerberos to authenticate, then NTLM if Kerberos is unavailable.

Windows pluggable authentication provides these capabilities:

* External authentication: Windows authentication enables MySQL Server to accept connections from users defined outside the MySQL grant tables who have logged in to Windows.

* Proxy user support: Windows authentication can return to MySQL a user name different from the external user name passed by the client program. This means that the plugin can return the MySQL user that defines the privileges the external Windows-authenticated user should have. For example, a Windows user named `joe` can connect and have the privileges of a MySQL user named `developer`.

The following table shows the plugin and library file names. The file must be located in the directory named by the `plugin_dir` system variable.

**Table 8.18 Plugin and Library Names for Windows Authentication**

<table summary="Names for the plugins and library file used for Windows password authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>authentication_windows</code></td> </tr><tr> <td>Client-side plugin</td> <td><code>authentication_windows_client</code></td> </tr><tr> <td>Library file</td> <td><code>authentication_windows.dll</code></td> </tr></tbody></table>

The library file includes only the server-side plugin. The client-side plugin is built into the `libmysqlclient` client library.

The server-side Windows authentication plugin is included only in MySQL Enterprise Edition. It is not included in MySQL community distributions. The client-side plugin is included in all distributions, including community distributions. This enables clients from any distribution to connect to a server that has the server-side plugin loaded.

The following sections provide installation and usage information specific to Windows pluggable authentication:

* Installing Windows Pluggable Authentication
* Uninstalling Windows Pluggable Authentication
* Using Windows Pluggable Authentication

For general information about pluggable authentication in MySQL, see Section 8.2.17, “Pluggable Authentication”. For proxy user information, see Section 8.2.19, “Proxy Users”.

##### Installing Windows Pluggable Authentication

This section describes how to install the server-side Windows authentication plugin. For general information about installing plugins, see Section 7.6.1, “Installing and Uninstalling Plugins”.

To be usable by the server, the plugin library file must be located in the MySQL plugin directory (the directory named by the `plugin_dir` system variable). If necessary, configure the plugin directory location by setting the value of `plugin_dir` at server startup.

To load the plugin at server startup, use the `--plugin-load-add` option to name the library file that contains it. With this plugin-loading method, the option must be given each time the server starts. For example, put these lines in the server `my.cnf` file:

```
[mysqld]
plugin-load-add=authentication_windows.dll
```

After modifying `my.cnf`, restart the server to cause the new settings to take effect.

Alternatively, to load the plugin at runtime, use this statement:

```
INSTALL PLUGIN authentication_windows SONAME 'authentication_windows.dll';
```

`INSTALL PLUGIN` loads the plugin immediately, and also registers it in the `mysql.plugins` system table to cause the server to load it for each subsequent normal startup without the need for `--plugin-load-add`.

To verify plugin installation, examine the Information Schema `PLUGINS` table or use the `SHOW PLUGINS` statement (see Section 7.6.2, “Obtaining Server Plugin Information”). For example:

```
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

To associate MySQL accounts with the Windows authentication plugin, see Using Windows Pluggable Authentication. Additional plugin control is provided by the `authentication_windows_use_principal_name` and `authentication_windows_log_level` system variables. See Section 7.1.8, “Server System Variables”.

##### Uninstalling Windows Pluggable Authentication

The method used to uninstall the Windows authentication plugin depends on how you installed it:

* If you installed the plugin at server startup using a `--plugin-load-add` option, restart the server without the option.

* If you installed the plugin at runtime using an `INSTALL PLUGIN` statement, it remains installed across server restarts. To uninstall it, use `UNINSTALL PLUGIN`:

  ```
  UNINSTALL PLUGIN authentication_windows;
  ```

In addition, remove any startup options that set Windows plugin-related system variables.

##### Using Windows Pluggable Authentication

The Windows authentication plugin supports the use of MySQL accounts such that users who have logged in to Windows can connect to the MySQL server without having to specify an additional password. It is assumed that the server is running with the server-side plugin enabled, as described in Installing Windows Pluggable Authentication. Once the DBA has enabled the server-side plugin and set up accounts to use it, clients can connect using those accounts with no other setup required on their part.

To refer to the Windows authentication plugin in the `IDENTIFIED WITH` clause of a `CREATE USER` statement, use the name `authentication_windows`. Suppose that the Windows users `Rafal` and `Tasha` should be permitted to connect to MySQL, as well as any users in the `Administrators` or `Power Users` group. To set this up, create a MySQL account named `sql_admin` that uses the Windows plugin for authentication:

```
CREATE USER sql_admin
  IDENTIFIED WITH authentication_windows
  AS 'Rafal, Tasha, Administrators, "Power Users"';
```

The plugin name is `authentication_windows`. The string following the `AS` keyword is the authentication string. It specifies that the Windows users named `Rafal` or `Tasha` are permitted to authenticate to the server as the MySQL user `sql_admin`, as are any Windows users in the `Administrators` or `Power Users` group. The latter group name contains a space, so it must be quoted with double quote characters.

After you create the `sql_admin` account, a user who has logged in to Windows can attempt to connect to the server using that account:

```
C:\> mysql --user=sql_admin
```

No password is required here. The `authentication_windows` plugin uses the Windows security API to check which Windows user is connecting. If that user is named `Rafal` or `Tasha`, or is a member of the `Administrators` or `Power Users` group, the server grants access and the client is authenticated as `sql_admin` and has whatever privileges are granted to the `sql_admin` account. Otherwise, the server denies access.

Authentication string syntax for the Windows authentication plugin follows these rules:

* The string consists of one or more user mappings separated by commas.

* Each user mapping associates a Windows user or group name with a MySQL user name:

  ```
  win_user_or_group_name=mysql_user_name
  win_user_or_group_name
  ```

  For the latter syntax, with no *`mysql_user_name`* value given, the implicit value is the MySQL user created by the `CREATE USER` statement. Thus, these statements are equivalent:

  ```
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

  ```
  domain\\user
  .\\user
  domain\\group
  .\\group
  BUILTIN\\WellKnownGroup
  ```

When invoked by the server to authenticate a client, the plugin scans the authentication string left to right for a user or group match to the Windows user. If there is a match, the plugin returns the corresponding *`mysql_user_name`* to the MySQL server. If there is no match, authentication fails.

A user name match takes preference over a group name match. Suppose that the Windows user named `win_user` is a member of `win_group` and the authentication string looks like this:

```
'win_group = sql_user1, win_user = sql_user2'
```

When `win_user` connects to the MySQL server, there is a match both to `win_group` and to `win_user`. The plugin authenticates the user as `sql_user2` because the more-specific user match takes precedence over the group match, even though the group is listed first in the authentication string.

Windows authentication always works for connections from the same computer on which the server is running. For cross-computer connections, both computers must be registered with Microsoft Active Directory. If they are in the same Windows domain, it is unnecessary to specify a domain name. It is also possible to permit connections from a different domain, as in this example:

```
CREATE USER sql_accounting
  IDENTIFIED WITH authentication_windows
  AS 'SomeDomain\\Accounting';
```

Here `SomeDomain` is the name of the other domain. The backslash character is doubled because it is the MySQL escape character within strings.

MySQL supports the concept of proxy users whereby a client can connect and authenticate to the MySQL server using one account but while connected has the privileges of another account (see Section 8.2.19, “Proxy Users”). Suppose that you want Windows users to connect using a single user name but be mapped based on their Windows user and group names onto specific MySQL accounts as follows:

* The `local_user` and `MyDomain\domain_user` local and domain Windows users should map to the `local_wlad` MySQL account.

* Users in the `MyDomain\Developers` domain group should map to the `local_dev` MySQL account.

* Local machine administrators should map to the `local_admin` MySQL account.

To set this up, create a proxy account for Windows users to connect to, and configure this account so that users and groups map to the appropriate MySQL accounts (`local_wlad`, `local_dev`, `local_admin`). In addition, grant the MySQL accounts the privileges appropriate to the operations they need to perform. The following instructions use `win_proxy` as the proxy account, and `local_wlad`, `local_dev`, and `local_admin` as the proxied accounts.

1. Create the proxy MySQL account:

   ```
   CREATE USER win_proxy
     IDENTIFIED WITH  authentication_windows
     AS 'local_user = local_wlad,
         MyDomain\\domain_user = local_wlad,
         MyDomain\\Developers = local_dev,
         BUILTIN\\Administrators = local_admin';
   ```

2. For proxying to work, the proxied accounts must exist, so create them:

   ```
   CREATE USER local_wlad
     IDENTIFIED WITH mysql_no_login;
   CREATE USER local_dev
     IDENTIFIED WITH mysql_no_login;
   CREATE USER local_admin
     IDENTIFIED WITH mysql_no_login;
   ```

   The proxied accounts use the `mysql_no_login` authentication plugin to prevent clients from using the accounts to log in directly to the MySQL server. Instead, users who authenticate using Windows are expected to use the `win_proxy` proxy account. (This assumes that the plugin is installed. For instructions, see Section 8.4.1.8, “No-Login Pluggable Authentication”.) For alternative methods of protecting proxied accounts against direct use, see Preventing Direct Login to Proxied Accounts.

   You should also execute `GRANT` statements (not shown) that grant each proxied account the privileges required for MySQL access.

3. Grant to the proxy account the `PROXY` privilege for each proxied account:

   ```
   GRANT PROXY ON local_wlad TO win_proxy;
   GRANT PROXY ON local_dev TO win_proxy;
   GRANT PROXY ON local_admin TO win_proxy;
   ```

Now the Windows users `local_user` and `MyDomain\domain_user` can connect to the MySQL server as `win_proxy` and when authenticated have the privileges of the account given in the authentication string (in this case, `local_wlad`). A user in the `MyDomain\Developers` group who connects as `win_proxy` has the privileges of the `local_dev` account. A user in the `BUILTIN\Administrators` group has the privileges of the `local_admin` account.

To configure authentication so that all Windows users who do not have their own MySQL account go through a proxy account, substitute the default proxy account (`''@''`) for `win_proxy` in the preceding instructions. For information about default proxy accounts, see Section 8.2.19, “Proxy Users”.

Note

If your MySQL installation has anonymous users, they might conflict with the default proxy user. For more information about this issue, and ways of dealing with it, see Default Proxy User and Anonymous User Conflicts.

To use the Windows authentication plugin with Connector/NET connection strings in Connector/NET 9.5 and higher, see Connector/NET Authentication.


#### 8.4.1.6 LDAP Pluggable Authentication

Note

LDAP pluggable authentication is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

MySQL Enterprise Edition supports an authentication method that enables MySQL Server to use LDAP (Lightweight Directory Access Protocol) to authenticate MySQL users by accessing directory services such as X.500. MySQL uses LDAP to fetch user, credential, and group information.

LDAP pluggable authentication provides these capabilities:

* External authentication: LDAP authentication enables MySQL Server to accept connections from users defined outside the MySQL grant tables in LDAP directories.

* Proxy user support: LDAP authentication can return to MySQL a user name different from the external user name passed by the client program, based on the LDAP groups the external user is a member of. This means that an LDAP plugin can return the MySQL user that defines the privileges the external LDAP-authenticated user should have. For example, an LDAP user named `joe` can connect and have the privileges of a MySQL user named `developer`, if the LDAP group for `joe` is `developer`.

* Security: Using TLS, connections to the LDAP server can be secure.

Server and client plugins are available for simple and SASL-based LDAP authentication. On Microsoft Windows, the server plugin for SASL-based LDAP authentication is not supported, but the client plugin is.

The following tables show the plugin and library file names for simple and SASL-based LDAP authentication. The file name suffix might differ on your system. The files must be located in the directory named by the `plugin_dir` system variable.

**Table 8.19 Plugin and Library Names for Simple LDAP Authentication**

<table summary="Names for the plugins and library file used for simple LDAP password authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin name</td> <td><code>authentication_ldap_simple</code></td> </tr><tr> <td>Client-side plugin name</td> <td><code>mysql_clear_password</code></td> </tr><tr> <td>Library file name</td> <td><code>authentication_ldap_simple.so</code></td> </tr></tbody></table>

**Table 8.20 Plugin and Library Names for SASL-Based LDAP Authentication**

<table summary="Names for the plugins and library file used for SASL-based LDAP password authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin name</td> <td><code>authentication_ldap_sasl</code></td> </tr><tr> <td>Client-side plugin name</td> <td><code>authentication_ldap_sasl_client</code></td> </tr><tr> <td>Library file names</td> <td><code>authentication_ldap_sasl.so</code>, <code>authentication_ldap_sasl_client.so</code></td> </tr></tbody></table>

The library files include only the `authentication_ldap_XXX` authentication plugins. The client-side `mysql_clear_password` plugin is built into the `libmysqlclient` client library.

Each server-side LDAP plugin works with a specific client-side plugin:

* The server-side `authentication_ldap_simple` plugin performs simple LDAP authentication. For connections by accounts that use this plugin, client programs use the client-side `mysql_clear_password` plugin, which sends the password to the server as cleartext. No password hashing or encryption is used, so a secure connection between the MySQL client and server is recommended to prevent password exposure.

* The server-side `authentication_ldap_sasl` plugin performs SASL-based LDAP authentication. For connections by accounts that use this plugin, client programs use the client-side `authentication_ldap_sasl_client` plugin. The client-side and server-side SASL LDAP plugins use SASL messages for secure transmission of credentials within the LDAP protocol, to avoid sending the cleartext password between the MySQL client and server.

  On Microsoft Windows platforms, both the server plugin and the client plugin are supported for SASL-based LDAP authentication.

The server-side LDAP authentication plugins are included only in MySQL Enterprise Edition. They are not included in MySQL community distributions. The client-side SASL LDAP plugin is included in all distributions, including community distributions, and, as mentioned previously, the client-side `mysql_clear_password` plugin is built into the `libmysqlclient` client library, which also is included in all distributions. This enables clients from any distribution to connect to a server that has the appropriate server-side plugin loaded.

The following sections provide installation and usage information specific to LDAP pluggable authentication:

* Prerequisites for LDAP Pluggable Authentication
* How LDAP Authentication of MySQL Users Works
* Installing LDAP Pluggable Authentication
* Uninstalling LDAP Pluggable Authentication
* LDAP Pluggable Authentication and ldap.conf
* Setting Timeouts for LDAP Pluggable Authentication
* Using LDAP Pluggable Authentication
* Simple LDAP Authentication (Without Proxying)")
* SASL-Based LDAP Authentication (Without Proxying)")
* LDAP Authentication with Proxying
* LDAP Authentication Group Preference and Mapping Specification
* LDAP Authentication User DN Suffixes
* LDAP Authentication Methods
* The GSSAPI/Kerberos Authentication Method
* LDAP Search Referral

For general information about pluggable authentication in MySQL, see Section 8.2.17, “Pluggable Authentication”. For information about the `mysql_clear_password` plugin, see Section 8.4.1.3, “Client-Side Cleartext Pluggable Authentication”. For proxy user information, see Section 8.2.19, “Proxy Users”.

Note

If your system supports PAM and permits LDAP as a PAM authentication method, another way to use LDAP for MySQL user authentication is to use the server-side `authentication_pam` plugin. See Section 8.4.1.4, “PAM Pluggable Authentication”.

##### Prerequisites for LDAP Pluggable Authentication

To use LDAP pluggable authentication for MySQL, these prerequisites must be satisfied:

* An LDAP server must be available for the LDAP authentication plugins to communicate with.

* LDAP users to be authenticated by MySQL must be present in the directory managed by the LDAP server.

* An LDAP client library must be available on systems where the server-side `authentication_ldap_sasl` or `authentication_ldap_simple` plugin is used. Currently, supported libraries are the Windows native LDAP library, or the OpenLDAP library on non-Windows systems.

* To use SASL-based LDAP authentication:

  + The LDAP server must be configured to communicate with a SASL server.

  + A SASL client library must be available on systems where the client-side `authentication_ldap_sasl_client` plugin is used. Currently, the only supported library is the Cyrus SASL library.

  + To use a particular SASL authentication method, any other services required by that method must be available. For example, to use GSSAPI/Kerberos, a GSSAPI library and Kerberos services must be available.

##### How LDAP Authentication of MySQL Users Works

This section provides an overview of how MySQL and LDAP work together to authenticate MySQL users. For examples showing how to set up MySQL accounts to use specific LDAP authentication plugins, see Using LDAP Pluggable Authentication. For information about authentication methods available to the LDAP plugins, see LDAP Authentication Methods.

The client connects to the MySQL server, providing the MySQL client user name and a password:

* For simple LDAP authentication, the client-side and server-side plugins communicate the password as cleartext. A secure connection between the MySQL client and server is recommended to prevent password exposure.

* For SASL-based LDAP authentication, the client-side and server-side plugins avoid sending the cleartext password between the MySQL client and server. For example, the plugins might use SASL messages for secure transmission of credentials within the LDAP protocol. For the GSSAPI authentication method, the client-side and server-side plugins communicate securely using Kerberos without using LDAP messages directly.

If the client user name and host name match no MySQL account, the connection is rejected.

If there is a matching MySQL account, authentication against LDAP occurs. The LDAP server looks for an entry matching the user and authenticates the entry against the LDAP password:

* If the MySQL account names an LDAP user distinguished name (DN), LDAP authentication uses that value and the LDAP password provided by the client. (To associate an LDAP user DN with a MySQL account, include a `BY` clause that specifies an authentication string in the [`CREATE USER`](create-user.html "15.7.1.3 CREATE USER Statement") statement that creates the account.)

* If the MySQL account names no LDAP user DN, LDAP authentication uses the user name and LDAP password provided by the client. In this case, the authentication plugin first binds to the LDAP server using the root DN and password as credentials to find the user DN based on the client user name, then authenticates that user DN against the LDAP password. This bind using the root credentials fails if the root DN and password are set to incorrect values, or are empty (not set) and the LDAP server does not permit anonymous connections.

If the LDAP server finds no match or multiple matches, authentication fails and the client connection is rejected.

If the LDAP server finds a single match, LDAP authentication succeeds (assuming that the password is correct), the LDAP server returns the LDAP entry, and the authentication plugin determines the name of the authenticated user based on that entry:

* If the LDAP entry has a group attribute (by default, the `cn` attribute), the plugin returns its value as the authenticated user name.

* If the LDAP entry has no group attribute, the authentication plugin returns the client user name as the authenticated user name.

The MySQL server compares the client user name with the authenticated user name to determine whether proxying occurs for the client session:

* If the names are the same, no proxying occurs: The MySQL account matching the client user name is used for privilege checking.

* If the names differ, proxying occurs: MySQL looks for an account matching the authenticated user name. That account becomes the proxied user, which is used for privilege checking. The MySQL account that matched the client user name is treated as the external proxy user.

##### Installing LDAP Pluggable Authentication

This section describes how to install the server-side LDAP authentication plugins. For general information about installing plugins, see Section 7.6.1, “Installing and Uninstalling Plugins”.

To be usable by the server, the plugin library files must be located in the MySQL plugin directory (the directory named by the `plugin_dir` system variable). If necessary, configure the plugin directory location by setting the value of `plugin_dir` at server startup.

The server-side plugin library file base names are `authentication_ldap_simple` and `authentication_ldap_sasl`. The file name suffix differs per platform (for example, `.so` for Unix and Unix-like systems, `.dll` for Windows).

Note

On Microsoft Windows, the server plugin for SASL-based LDAP authentication is not supported, but the client plugin is supported. On other platforms, both the server and client plugins are supported.

To load the plugins at server startup, use `--plugin-load-add` options to name the library files that contain them. With this plugin-loading method, the options must be given each time the server starts. Also, specify values for any plugin-provided system variables you wish to configure.

Each server-side LDAP plugin exposes a set of system variables that enable its operation to be configured. Setting most of these is optional, but you must set the variables that specify the LDAP server host (so the plugin knows where to connect) and base distinguished name for LDAP bind operations (to limit the scope of searches and obtain faster searches). For details about all LDAP system variables, see Section 8.4.1.13, “Pluggable Authentication System Variables”.

To load the plugins and set the LDAP server host and base distinguished name for LDAP bind operations, put lines such as these in your `my.cnf` file, adjusting the `.so` suffix for your platform as necessary:

```
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

```
INSTALL PLUGIN authentication_ldap_simple
  SONAME 'authentication_ldap_simple.so';
INSTALL PLUGIN authentication_ldap_sasl
  SONAME 'authentication_ldap_sasl.so';
```

`INSTALL PLUGIN` loads the plugin immediately, and also registers it in the `mysql.plugins` system table to cause the server to load it for each subsequent normal startup without the need for `--plugin-load-add`.

After installing the plugins at runtime, the system variables that they expose become available and you can add settings for them to your `my.cnf` file to configure the plugins for subsequent restarts. For example:

```
[mysqld]
authentication_ldap_simple_server_host=127.0.0.1
authentication_ldap_simple_bind_base_dn="dc=example,dc=com"
authentication_ldap_sasl_server_host=127.0.0.1
authentication_ldap_sasl_bind_base_dn="dc=example,dc=com"
```

After modifying `my.cnf`, restart the server to cause the new settings to take effect.

To set and persist each value at runtime rather than at startup, use these statements:

```
SET PERSIST authentication_ldap_simple_server_host='127.0.0.1';
SET PERSIST authentication_ldap_simple_bind_base_dn='dc=example,dc=com';
SET PERSIST authentication_ldap_sasl_server_host='127.0.0.1';
SET PERSIST authentication_ldap_sasl_bind_base_dn='dc=example,dc=com';
```

[`SET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") sets a value for the running MySQL instance. It also saves the value, causing it to carry over to subsequent server restarts. To change a value for the running MySQL instance without having it carry over to subsequent restarts, use the `GLOBAL` keyword rather than `PERSIST`. See Section 15.7.6.1, “SET Syntax for Variable Assignment”.

To verify plugin installation, examine the Information Schema `PLUGINS` table or use the `SHOW PLUGINS` statement (see Section 7.6.2, “Obtaining Server Plugin Information”). For example:

```
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

   ```
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

   ```
   checkmodule -M -m mysqlldap.te -o mysqlldap.mod
   ```

3. Create an SELinux policy module package:

   ```
   semodule_package -m mysqlldap.mod  -o mysqlldap.pp
   ```

4. Install the module package:

   ```
   semodule -i mysqlldap.pp
   ```

5. When the SELinux policy changes have been made, restart the MySQL server:

   ```
   service mysqld restart
   ```

##### Uninstalling LDAP Pluggable Authentication

The method used to uninstall the LDAP authentication plugins depends on how you installed them:

* If you installed the plugins at server startup using `--plugin-load-add` options, restart the server without those options.

* If you installed the plugins at runtime using `INSTALL PLUGIN`, they remain installed across server restarts. To uninstall them, use `UNINSTALL PLUGIN`:

  ```
  UNINSTALL PLUGIN authentication_ldap_simple;
  UNINSTALL PLUGIN authentication_ldap_sasl;
  ```

In addition, remove from your `my.cnf` file any startup options that set LDAP plugin-related system variables. If you used [`SET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") to persist LDAP system variables, use `RESET PERSIST` to remove the settings.

##### LDAP Pluggable Authentication and ldap.conf

For installations that use OpenLDAP, the `ldap.conf` file provides global defaults for LDAP clients. Options can be set in this file to affect LDAP clients, including the LDAP authentication plugins. OpenLDAP uses configuration options in this order of precedence:

* Configuration specified by the LDAP client.
* Configuration specified in the `ldap.conf` file. To disable use of this file, set the `LDAPNOINIT` environment variable.

* OpenLDAP library built-in defaults.

If the library defaults or `ldap.conf` values do not yield appropriate option values, an LDAP authentication plugin may be able to set related variables to affect the LDAP configuration directly. For example, LDAP plugins can override `ldap.conf` for parameters such as these:

* TLS configuration: System variables are available to enable TLS and control CA configuration, such as `authentication_ldap_simple_tls` and `authentication_ldap_simple_ca_path` for simple LDAP authentication, and `authentication_ldap_sasl_tls` and `authentication_ldap_sasl_ca_path` for SASL LDAP authentication.

* LDAP referral. See LDAP Search Referral.

For more information about `ldap.conf` consult the `ldap.conf(5)` man page.

##### Setting Timeouts for LDAP Pluggable Authentication

For MySQL accounts to connect to a MySQL server using LDAP pluggable authentication, the LDAP server must be available and operational. The interaction between the MySQL and LDAP servers involves two steps. First, the MySQL server establishes a connection to the LDAP server over TCP. Second, the MySQL server sends an LDAP binding request over the connection to the LDAP server and waits for a reply before authenticating the account. If either step fails, the MySQL account cannot connect to the MySQL server.

Short-duration timeouts that supersede a host system's timeout values are applied to both the connection and response steps by default. In all cases, the account user receives notification that their attempt to connect to MySQL is denied if the timeout expires. Client-side and server-side logging can provide additional information. On the client side, set the following environmental variable to elevate the detail level and then restart MySQL client:

```
AUTHENTICATION_LDAP_CLIENT_LOG=5
export AUTHENTICATION_LDAP_CLIENT_LOG
```

The following system variables support default timeouts for SASL-based and simple LDAP authentication on Linux platforms only.

**Table 8.21 System variables for SASL-based and simple LDAP Authentication**

<table summary="System variables used for simple and SASL-based LDAP password authentication."><col style="width: 75%"/><col style="width: 25%"/><thead><tr> <th>System Variable Name</th> <th>Default Timeout Value</th> </tr></thead><tbody><tr> <td><code>authentication_ldap_sasl_connect_timeout</code></td> <td>30 seconds</td> </tr><tr> <td><code>authentication_ldap_sasl_response_timeout</code></td> <td>30 seconds</td> </tr><tr> <td><code>authentication_ldap_simple_connect_timeout</code></td> <td>30 seconds</td> </tr><tr> <td><code>authentication_ldap_simple_response_timeout</code></td> <td>30 seconds</td> </tr></tbody></table>

Timeout values for LDAP authentication are adjustable at server startup and at runtime. If you set a timeout to zero using one of these variables, you effectively disengage it and MySQL server reverts to using the host system's default timeout.

Note

Under the following combination of conditions, the actual wait time of the `authentication_ldap_sasl_connect_timeout` setting doubles because (internally) the server must invoke the TCP connection twice:

* The LDAP server is offline.
* `authentication_ldap_sasl_connect_timeout` has a value greater than zero.

* Connection pooling is in use (specifically, the `authentication_ldap_sasl_max_pool_size` system variable has a value greater than zero, which enables pooling).

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

  ```
  uid=betsy_ldap,ou=People,dc=example,dc=com
  uid=boris_ldap,ou=People,dc=example,dc=com
  ```

* `CREATE USER` statements that create MySQL accounts name an LDAP user in the `BY` clause, to indicate which LDAP entry the MySQL account authenticates against.

The instructions for setting up an account that uses LDAP authentication depend on which server-side LDAP plugin is used. The following sections describe several usage scenarios.

##### Simple LDAP Authentication (Without Proxying)

The procedure outlined in this section requires that `authentication_ldap_simple_group_search_attr` be set to an empty string, like this:

```
SET GLOBAL.authentication_ldap_simple_group_search_attr='';
```

Otherwise, proxying is used by default.

To set up a MySQL account for simple LDAP authentication, use a `CREATE USER` statement to specify the `authentication_ldap_simple` plugin, optionally including the LDAP user distinguished name (DN), as shown here:

```
CREATE USER user
  IDENTIFIED WITH authentication_ldap_simple
  [BY 'LDAP user DN'];
```

Suppose that MySQL user `betsy` has this entry in the LDAP directory:

```
uid=betsy_ldap,ou=People,dc=example,dc=com
```

Then the statement to create the MySQL account for `betsy` looks like this:

```
CREATE USER 'betsy'@'localhost'
  IDENTIFIED WITH authentication_ldap_simple
  AS 'uid=betsy_ldap,ou=People,dc=example,dc=com';
```

The authentication string specified in the `BY` clause does not include the LDAP password. That must be provided by the client user at connect time.

Clients connect to the MySQL server by providing the MySQL user name and LDAP password, and by enabling the client-side `mysql_clear_password` plugin:

```
$> mysql --user=betsy --password --enable-cleartext-plugin
Enter password: betsy_ldap_password
```

Note

The client-side `mysql_clear_password` authentication plugin leaves the password untouched, so client programs send it to the MySQL server as cleartext. This enables the password to be passed as is to the LDAP server. A cleartext password is necessary to use the server-side LDAP library without SASL, but may be a security problem in some configurations. These measures minimize the risk:

* To make inadvertent use of the `mysql_clear_password` plugin less likely, MySQL clients must explicitly enable it (for example, with the `--enable-cleartext-plugin` option). See Section 8.4.1.3, “Client-Side Cleartext Pluggable Authentication”.

* To avoid password exposure with the `mysql_clear_password` plugin enabled, MySQL clients should connect to the MySQL server using an encrypted connection. See Section 8.3.1, “Configuring MySQL to Use Encrypted Connections”.

The authentication process occurs as follows:

1. The client-side plugin sends `betsy` and *`betsy_password`* as the client user name and LDAP password to the MySQL server.

2. The connection attempt matches the `'betsy'@'localhost'` account. The server-side LDAP plugin finds that this account has an authentication string of `'uid=betsy_ldap,ou=People,dc=example,dc=com'` to name the LDAP user DN. The plugin sends this string and the LDAP password to the LDAP server.

3. The LDAP server finds the LDAP entry for `betsy_ldap` and the password matches, so LDAP authentication succeeds.

4. The LDAP entry has no group attribute, so the server-side plugin returns the client user name (`betsy`) as the authenticated user. This is the same user name supplied by the client, so no proxying occurs and the client session uses the `'betsy'@'localhost'` account for privilege checking.

Had the `CREATE USER` statement contained no `BY` clause to specify the `betsy_ldap` LDAP distinguished name, authentication attempts would use the user name provided by the client (in this case, `betsy`). In the absence of an LDAP entry for `betsy`, authentication would fail.

##### SASL-Based LDAP Authentication (Without Proxying)

The procedure outlined in this section requires that `authentication_ldap_sasl_group_search_attr` be set to an empty string, like this:

```
SET GLOBAL.authentication_ldap_sasl_group_search_attr='';
```

Otherwise, proxying is used by default.

To set up a MySQL account for SALS LDAP authentication, use a `CREATE USER` statement to specify the `authentication_ldap_sasl` plugin, optionally including the LDAP user distinguished name (DN), as shown here:

```
CREATE USER user
  IDENTIFIED WITH authentication_ldap_sasl
  [BY 'LDAP user DN'];
```

Suppose that MySQL user `boris` has this entry in the LDAP directory:

```
uid=boris_ldap,ou=People,dc=example,dc=com
```

Then the statement to create the MySQL account for `boris` looks like this:

```
CREATE USER 'boris'@'localhost'
  IDENTIFIED WITH authentication_ldap_sasl
  AS 'uid=boris_ldap,ou=People,dc=example,dc=com';
```

The authentication string specified in the `BY` clause does not include the LDAP password. That must be provided by the client user at connect time.

Clients connect to the MySQL server by providing the MySQL user name and LDAP password:

```
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

  ```
  uid=basha,ou=People,dc=example,dc=com,cn=accounting
  uid=basil,ou=People,dc=example,dc=com,cn=front_office
  ```

  At connect time, the group attribute values become the authenticated user names, so they name the `accounting` and `front_office` proxied accounts.

* The examples assume use of SASL LDAP authentication. Make the appropriate adjustments for simple LDAP authentication.

Create the default proxy MySQL account:

```
CREATE USER ''@'%'
  IDENTIFIED WITH authentication_ldap_sasl;
```

The proxy account definition has no `AS 'auth_string'` clause to name an LDAP user DN. Thus:

* When a client connects, the client user name becomes the LDAP user name to search for.

* The matching LDAP entry is expected to include a group attribute naming the proxied MySQL account that defines the privileges the client should have.

Note

If your MySQL installation has anonymous users, they might conflict with the default proxy user. For more information about this issue, and ways of dealing with it, see Default Proxy User and Anonymous User Conflicts.

Create the proxied accounts and grant to each one the privileges it should have:

```
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

The proxied accounts use the `mysql_no_login` authentication plugin to prevent clients from using the accounts to log in directly to the MySQL server. Instead, users who authenticate using LDAP are expected to use the default `''@'%'` proxy account. (This assumes that the `mysql_no_login` plugin is installed. For instructions, see Section 8.4.1.8, “No-Login Pluggable Authentication”.) For alternative methods of protecting proxied accounts against direct use, see Preventing Direct Login to Proxied Accounts.

Grant to the proxy account the `PROXY` privilege for each proxied account:

```
GRANT PROXY
  ON 'accounting'@'localhost'
  TO ''@'%';
GRANT PROXY
  ON 'front_office'@'localhost'
  TO ''@'%';
```

Use the **mysql** command-line client to connect to the MySQL server as `basha`.

```
$> mysql --user=basha --password
Enter password: basha_password (basha LDAP password)
```

Authentication occurs as follows:

1. The server authenticates the connection using the default `''@'%'` proxy account, for client user `basha`.

2. The matching LDAP entry is:

   ```
   uid=basha,ou=People,dc=example,dc=com,cn=accounting
   ```

3. The matching LDAP entry has group attribute `cn=accounting`, so `accounting` becomes the authenticated proxied user.

4. The authenticated user differs from the client user name `basha`, with the result that `basha` is treated as a proxy for `accounting`, and `basha` assumes the privileges of the proxied `accounting` account. The following query returns output as shown:

   ```
   mysql> SELECT USER(), CURRENT_USER(), @@proxy_user;
   +-----------------+----------------------+--------------+
   | USER()          | CURRENT_USER()       | @@proxy_user |
   +-----------------+----------------------+--------------+
   | basha@localhost | accounting@localhost | ''@'%'       |
   +-----------------+----------------------+--------------+
   ```

This demonstrates that `basha` uses the privileges granted to the proxied `accounting` MySQL account, and that proxying occurs through the default proxy user account.

Now connect as `basil` instead:

```
$> mysql --user=basil --password
Enter password: basil_password (basil LDAP password)
```

The authentication process for `basil` is similar to that previously described for `basha`:

1. The server authenticates the connection using the default `''@'%'` proxy account, for client user `basil`.

2. The matching LDAP entry is:

   ```
   uid=basil,ou=People,dc=example,dc=com,cn=front_office
   ```

3. The matching LDAP entry has group attribute `cn=front_office`, so `front_office` becomes the authenticated proxied user.

4. The authenticated user differs from the client user name `basil`, with the result that `basil` is treated as a proxy for `front_office`, and `basil` assumes the privileges of the proxied `front_office` account. The following query returns output as shown:

   ```
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

For MySQL accounts that use LDAP authentication, the authentication string can specify the following information to enable greater proxying flexibility:

* A list of groups in preference order, such that the plugin uses the first group name in the list that matches a group returned by the LDAP server.

* A mapping from group names to proxied user names, such that a group name when matched can provide a specified name to use as the proxied user. This provides an alternative to using the group name as the proxied user.

Consider the following MySQL proxy account definition:

```
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

  ```
  "my group name"="my user name"
  ```

  If an item has group and user names of `my_group_name` and `my_user_name` (which contain no special characters), it may but need not be written using quotes. Any of the following are valid:

  ```
  my_group_name=my_user_name
  my_group_name="my_user_name"
  "my_group_name"=my_user_name
  "my_group_name"="my_user_name"
  ```

* To escape a character, precede it by a backslash (`\`). This is useful particularly to include a literal double quote or backslash, which are otherwise not included literally.

* A user DN need not be present in the authentication string, but if present, it must precede the group preference and mapping part. A user DN can be given as a full user DN, or as a user DN suffix with a `+` prefix character. (See LDAP Authentication User DN Suffixes.)

##### LDAP Authentication User DN Suffixes

LDAP authentication plugins permit the authentication string that provides user DN information to begin with a `+` prefix character:

* In the absence of a `+` character, the authentication string value is treated as is without modification.

* If the authentication string begins with `+`, the plugin constructs the full user DN value from the user name sent by the client, together with the DN specified in the authentication string (with the `+` removed). In the constructed DN, the client user name becomes the value of the attribute that specifies LDAP user names. This is `uid` by default; to change the attribute, modify the appropriate system variable (`authentication_ldap_simple_user_search_attr` or `authentication_ldap_sasl_user_search_attr`). The authentication string is stored as given in the `mysql.user` system table, with the full user DN constructed on the fly before authentication.

This account authentication string does not have `+` at the beginning, so it is taken as the full user DN:

```
CREATE USER 'baldwin'
  IDENTIFIED WITH authentication_ldap_simple
  AS 'uid=admin,ou=People,dc=example,dc=com';
```

The client connects with the user name specified in the account (`baldwin`). In this case, that name is not used because the authentication string has no prefix and thus fully specifies the user DN.

This account authentication string does have `+` at the beginning, so it is taken as just part of the user DN:

```
CREATE USER 'accounting'
  IDENTIFIED WITH authentication_ldap_simple
  AS '+ou=People,dc=example,dc=com';
```

The client connects with the user name specified in the account (`accounting`), which in this case is used as the `uid` attribute together with the authentication string to construct the user DN: `uid=accounting,ou=People,dc=example,dc=com`

The accounts in the preceding examples have a nonempty user name, so the client always connects to the MySQL server using the same name as specified in the account definition. If an account has an empty user name, such as the default anonymous `''@'%'` proxy account described in LDAP Authentication with Proxying, clients might connect to the MySQL server with varying user names. But the principle is the same: If the authentication string begins with `+`, the plugin uses the user name sent by the client together with the authentication string to construct the user DN.

##### LDAP Authentication Methods

The LDAP authentication plugins use a configurable authentication method. The appropriate system variable and available method choices are plugin-specific:

* For the `authentication_ldap_simple` plugin: Set the `authentication_ldap_simple_auth_method_name` system variable to configure the method. The permitted choices are `SIMPLE` and `AD-FOREST`.

* For the `authentication_ldap_sasl` plugin: Set the `authentication_ldap_sasl_auth_method_name` system variable to configure the method. The permitted choices are `SCRAM-SHA-1`, `SCRAM-SHA-256`, and `GSSAPI`. (To determine which SASL LDAP methods are actually available on the host system, check the value of the `Authentication_ldap_sasl_supported_methods` status variable.)

See the system variable descriptions for information about each permitted method. Also, depending on the method, additional configuration may be needed, as described in the following sections.

##### The GSSAPI/Kerberos Authentication Method

Generic Security Service Application Program Interface (GSSAPI) is a security abstraction interface. Kerberos is an instance of a specific security protocol that can be used through that abstract interface. Using GSSAPI, applications authenticate to Kerberos to obtain service credentials, then use those credentials in turn to enable secure access to other services.

One such service is LDAP, which is used by the client-side and server-side SASL LDAP authentication plugins. When the `authentication_ldap_sasl_auth_method_name` system variable is set to `GSSAPI`, these plugins use the GSSAPI/Kerberos authentication method. In this case, the plugins communicate securely using Kerberos without using LDAP messages directly. The server-side plugin then communicates with the LDAP server to interpret LDAP authentication messages and retrieve LDAP groups.

GSSAPI/Kerberos is supported as an LDAP authentication method for MySQL servers and clients on Linux. It is useful in Linux environments where applications have access to LDAP through Microsoft Active Directory, which has Kerberos enabled by default.

The following discussion provides information about the configuration requirements for using the GSSAPI method. Familiarity is assumed with Kerberos concepts and operation. The following list briefly defines several common Kerberos terms. You may also find the Glossary section of [RFC 4120](https://tools.ietf.org/html/rfc4120) helpful.

* Principal: A named entity, such as a user or server.

* KDC: The key distribution center, comprising the AS and TGS:

  + AS: The authentication server; provides the initial ticket-granting ticket needed to obtain additional tickets.

  + TGS: The ticket-granting server; provides additional tickets to Kerberos clients that possess a valid TGT.

* TGT: The ticket-granting ticket; presented to the TGS to obtain service tickets for service access.

LDAP authentication using Kerberos requires both a KDC server and an LDAP server. This requirement can be satisfied in different ways:

* Active Directory includes both servers, with Kerberos authentication enabled by default in the Active Directory LDAP server.

* OpenLDAP provides an LDAP server, but a separate KDC server may be needed, with additional Kerberos setup required.

Kerberos must also be available on the client host. A client contacts the AS using a password to obtain a TGT. The client then uses the TGT to obtain access from the TGS to other services, such as LDAP.

The following sections discuss the configuration steps to use GSSAPI/Kerberos for SASL LDAP authentication in MySQL:

* Verify Kerberos and LDAP Availability
* Configure the Server-Side SASL LDAP Authentication Plugin for GSSAPI/Kerberos
* Create a MySQL Account That Uses GSSAPI/Kerberos for LDAP Authentication
* Use the MySQL Account to Connect to the MySQL Server
* Client Configuration Parameters for LDAP Authentication

###### Verify Kerberos and LDAP Availability

The following example shows how to test availability of Kerberos in Active Directory. The example makes these assumptions:

* Active Directory is running on the host named `ldap_auth.example.com` with IP address `198.51.100.10`.

* MySQL-related Kerberos authentication and LDAP lookups use the `MYSQL.LOCAL` domain.

* A principal named `bredon@MYSQL.LOCAL` is registered with the KDC. (In later discussion, this principal name is also associated with the MySQL account that authenticates to the MySQL server using GSSAPI/Kerberos.)

With those assumptions satisfied, follow this procedure:

1. Verify that the Kerberos library is installed and configured correctly in the operating system. For example, to configure a `MYSQL.LOCAL` domain for use during MySQL authentication, the `/etc/krb5.conf` Kerberos configuration file should contain something like this:

   ```
   [realms]
     MYSQL.LOCAL = {
       kdc = ldap_auth.example.com
       admin_server = ldap_auth.example.com
       default_domain = MYSQL.LOCAL
     }
   ```

2. You may need to add an entry to `/etc/hosts` for the server host:

   ```
   198.51.100.10 ldap_auth ldap_auth.example.com
   ```

3. Check whether Kerberos authentication works correctly:

   1. Use **kinit** to authenticate to Kerberos:

      ```
      $> kinit bredon@MYSQL.LOCAL
      Password for bredon@MYSQL.LOCAL: (enter password here)
      ```

      The command authenticates for the Kerberos principal named `bredon@MYSQL.LOCAL`. Enter the principal's password when the command prompts for it. The KDC returns a TGT that is cached on the client side for use by other Kerberos-aware applications.

   2. Use **klist** to check whether the TGT was obtained correctly. The output should be similar to this:

      ```
      $> klist
      Ticket cache: FILE:/tmp/krb5cc_244306
      Default principal: bredon@MYSQL.LOCAL

      Valid starting       Expires              Service principal
      03/23/2021 08:18:33  03/23/2021 18:18:33  krbtgt/MYSQL.LOCAL@MYSQL.LOCAL
      ```

4. Check whether **ldapsearch** works with the Kerberos TGT using this command, which searches for users in the `MYSQL.LOCAL` domain:

   ```
   ldapsearch -h 198.51.100.10 -Y GSSAPI -b "dc=MYSQL,dc=LOCAL"
   ```

###### Configure the Server-Side SASL LDAP Authentication Plugin for GSSAPI/Kerberos

Assuming that the LDAP server is accessible through Kerberos as just described, configure the server-side SASL LDAP authentication plugin to use the GSSAPI/Kerberos authentication method. (For general LDAP plugin installation information, see Installing LDAP Pluggable Authentication.) Here is an example of plugin-related settings the server `my.cnf` file might contain:

```
[mysqld]
plugin-load-add=authentication_ldap_sasl.so
authentication_ldap_sasl_auth_method_name="GSSAPI"
authentication_ldap_sasl_server_host=198.51.100.10
authentication_ldap_sasl_server_port=389
authentication_ldap_sasl_bind_root_dn="cn=admin,cn=users,dc=MYSQL,dc=LOCAL"
authentication_ldap_sasl_bind_root_pwd="password"
authentication_ldap_sasl_bind_base_dn="cn=users,dc=MYSQL,dc=LOCAL"
authentication_ldap_sasl_user_search_attr="sAMAccountName"
```

Those option file settings configure the SASL LDAP plugin as follows:

* The `--plugin-load-add` option loads the plugin (adjust the `.so` suffix for your platform as necessary). If you loaded the plugin previously using an `INSTALL PLUGIN` statement, this option is unnecessary.

* `authentication_ldap_sasl_auth_method_name` must be set to `GSSAPI` to use GSSAPI/Kerberos as the SASL LDAP authentication method.

* `authentication_ldap_sasl_server_host` and `authentication_ldap_sasl_server_port` indicate the IP address and port number of the Active Directory server host for authentication.

* `authentication_ldap_sasl_bind_root_dn` and `authentication_ldap_sasl_bind_root_pwd` configure the root DN and password for group search capability. This capability is required, but users may not have privileges to search. In such cases, it is necessary to provide root DN information:

  + In the DN option value, `admin` should be the name of an administrative LDAP account that has privileges to perform user searches.

  + In the password option value, *`password`* should be the `admin` account password.

* `authentication_ldap_sasl_bind_base_dn` indicates the user DN base path, so that searches look for users in the `MYSQL.LOCAL` domain.

* `authentication_ldap_sasl_user_search_attr` specifies a standard Active Directory search attribute, `sAMAccountName`. This attribute is used in searches to match logon names; attribute values are not the same as the user DN values.

###### Create a MySQL Account That Uses GSSAPI/Kerberos for LDAP Authentication

MySQL authentication using the SASL LDAP authentication plugin with the GSSAPI/Kerberos method is based on a user that is a Kerberos principal. The following discussion uses a principal named `bredon@MYSQL.LOCAL` as this user, which must be registered in several places:

* The Kerberos administrator should register the user name as a Kerberos principal. This name should include a domain name. Clients use the principal name and password to authenticate with Kerberos and obtain a TGT.

* The LDAP administrator should register the user name in an LDAP entry. For example:

  ```
  uid=bredon,dc=MYSQL,dc=LOCAL
  ```

  Note

  In Active Directory (which uses Kerberos as the default authentication method), creating a user creates both the Kerberos principal and the LDAP entry.

* The MySQL DBA should create an account that has the Kerberos principal name as the user name and that authenticates using the SASL LDAP plugin.

Assume that the Kerberos principal and LDAP entry have been registered by the appropriate service administrators, and that, as previously described in Installing LDAP Pluggable Authentication, and Configure the Server-Side SASL LDAP Authentication Plugin for GSSAPI/Kerberos, the MySQL server has been started with appropriate configuration settings for the server-side SASL LDAP plugin. The MySQL DBA then creates a MySQL account that corresponds to the Kerberos principal name, including the domain name.

Note

The SASL LDAP plugin uses a constant user DN for Kerberos authentication and ignores any user DN configured from MySQL. This has certain implications:

* For any MySQL account that uses GSSAPI/Kerberos authentication, the authentication string in `CREATE USER` or `ALTER USER` statements should contain no user DN because it has no effect.

* Because the authentication string contains no user DN, it should contain group mapping information, to enable the user to be handled as a proxy user that is mapped onto the desired proxied user. For information about proxying with the LDAP authentication plugin, see LDAP Authentication with Proxying.

The following statements create a proxy user named `bredon@MYSQL.LOCAL` that assumes the privileges of the proxied user named `proxied_krb_usr`. Other GSSAPI/Kerberos users that should have the same privileges can similarly be created as proxy users for the same proxied user.

```
-- create proxy account
CREATE USER 'bredon@MYSQL.LOCAL'
  IDENTIFIED WITH authentication_ldap_sasl
  BY '#krb_grp=proxied_krb_user';

-- create proxied account and grant its privileges;
-- use mysql_no_login plugin to prevent direct login
CREATE USER 'proxied_krb_user'
  IDENTIFIED WITH mysql_no_login;
GRANT ALL
  ON krb_user_db.*
  TO 'proxied_krb_user';

-- grant to proxy account the
-- PROXY privilege for proxied account
GRANT PROXY
  ON 'proxied_krb_user'
  TO 'bredon@MYSQL.LOCAL';
```

Observe closely the quoting for the proxy account name in the first `CREATE USER` statement and the [`GRANT PROXY`](grant.html "15.7.1.6 GRANT Statement") statement:

* For most MySQL accounts, the user and host are separate parts of the account name, and thus are quoted separately as `'user_name'@'host_name'`.

* For LDAP Kerberos authentication, the user part of the account name includes the principal domain, so `'bredon@MYSQL.LOCAL'` is quoted as a single value. Because no host part is given, the full MySQL account name uses the default of `'%'` as the host part: `'bredon@MYSQL.LOCAL'@'%'`

Note

When creating an account that authenticates using the `authentication_ldap_sasl` SASL LDAP authentication plugin with the GSSAPI/Kerberos authentication method, the [`CREATE USER`](create-user.html "15.7.1.3 CREATE USER Statement") statement includes the realm as part of the user name. This differs from creating accounts that use the `authentication_kerberos` Kerberos plugin. For such accounts, the [`CREATE USER`](create-user.html "15.7.1.3 CREATE USER Statement") statement does not include the realm as part of the user name. Instead, specify the realm as the authentication string in the `BY` clause. See Create a MySQL Account That Uses Kerberos Authentication.

The proxied account uses the `mysql_no_login` authentication plugin to prevent clients from using the account to log in directly to the MySQL server. Instead, it is expected that users who authenticate using LDAP use the `bredon@MYSQL.LOCAL` proxy account. (This assumes that the `mysql_no_login` plugin is installed. For instructions, see Section 8.4.1.8, “No-Login Pluggable Authentication”.) For alternative methods of protecting proxied accounts against direct use, see Preventing Direct Login to Proxied Accounts.

###### Use the MySQL Account to Connect to the MySQL Server

After a MySQL account that authenticates using GSSAPI/Kerberos has been set up, clients can use it to connect to the MySQL server. Kerberos authentication can take place either prior to or at the time of MySQL client program invocation:

* Prior to invoking the MySQL client program, the client user can obtain a TGT from the KDC independently of MySQL. For example, the client user can use **kinit** to authenticate to Kerberos by providing a Kerberos principal name and the principal password:

  ```
  $> kinit bredon@MYSQL.LOCAL
  Password for bredon@MYSQL.LOCAL: (enter password here)
  ```

  The resulting TGT is cached and becomes available for use by other Kerberos-aware applications, such as programs that use the client-side SASL LDAP authentication plugin. In this case, the MySQL client program authenticates to the MySQL server using the TGT, so invoke the client without specifying a user name or password:

  ```
  mysql --default-auth=authentication_ldap_sasl_client
  ```

  As just described, when the TGT is cached, user-name and password options are not needed in the client command. If the command includes them anyway, they are handled as follows:

  + If the command includes a user name, authentication fails if that name does not match the principal name in the TGT.

  + If the command includes a password, the client-side plugin ignores it. Because authentication is based on the TGT, it can succeed *even if the user-provided password is incorrect*. For this reason, the plugin produces a warning if a valid TGT is found that causes a password to be ignored.

* If the Kerberos cache contains no TGT, the client-side SASL LDAP authentication plugin itself can obtain the TGT from the KDC. Invoke the client with options for the name and password of the Kerberos principal associated with the MySQL account (enter the command on a single line, then enter the principal password when prompted):

  ```
  mysql --default-auth=authentication_ldap_sasl_client
    --user=bredon@MYSQL.LOCAL
    --password
  ```

* If the Kerberos cache contains no TGT and the client command specifies no principal name as the user name, authentication fails.

If you are uncertain whether a TGT exists, you can use **klist** to check.

Authentication occurs as follows:

1. The client uses the TGT to authenticate using Kerberos.
2. The server finds the LDAP entry for the principal and uses it to authenticate the connection for the `bredon@MYSQL.LOCAL` MySQL proxy account.

3. The group mapping information in the proxy account authentication string (`'#krb_grp=proxied_krb_user'`) indicates that the authenticated proxied user should be `proxied_krb_user`.

4. `bredon@MYSQL.LOCAL` is treated as a proxy for `proxied_krb_user`, and the following query returns output as shown:

   ```
   mysql> SELECT USER(), CURRENT_USER(), @@proxy_user;
   +------------------------------+--------------------+--------------------------+
   | USER()                       | CURRENT_USER()     | @@proxy_user             |
   +------------------------------+--------------------+--------------------------+
   | bredon@MYSQL.LOCAL@localhost | proxied_krb_user@% | 'bredon@MYSQL.LOCAL'@'%' |
   +------------------------------+--------------------+--------------------------+
   ```

   The `USER()` value indicates the user name used for the client command (`bredon@MYSQL.LOCAL`) and the host from which the client connected (`localhost`).

   The `CURRENT_USER()` value is the full name of the proxied user account, which consists of the `proxied_krb_user` user part and the `%` host part.

   The `@@proxy_user` value indicates the full name of the account used to make the connection to the MySQL server, which consists of the `bredon@MYSQL.LOCAL` user part and the `%` host part.

   This demonstrates that proxying occurs through the `bredon@MYSQL.LOCAL` proxy user account, and that `bredon@MYSQL.LOCAL` assumes the privileges granted to the `proxied_krb_user` proxied user account.

A TGT once obtained is cached on the client side and can be used until it expires without specifying the password again. However the TGT is obtained, the client-side plugin uses it to acquire service tickets and communicate with the server-side plugin.

Note

When the client-side authentication plugin itself obtains the TGT, the client user may not want the TGT to be reused. As described in Client Configuration Parameters for LDAP Authentication, the local `/etc/krb5.conf` file can be used to cause the client-side plugin to destroy the TGT when done with it.

The server-side plugin has no access to the TGT itself or the Kerberos password used to obtain it.

The LDAP authentication plugins have no control over the caching mechanism (storage in a local file, in memory, and so forth), but Kerberos utilities such as **kswitch** may be available for this purpose.

###### Client Configuration Parameters for LDAP Authentication

The `authentication_ldap_sasl_client` client-side SASL LDAP plugin reads the local `/etc/krb5.conf` file. If this file is missing or inaccessible, an error occurs. Assuming that the file is accessible, it can include an optional `[appdefaults]` section to provide information used by the plugin. Place the information within the `mysql` part of the section. For example:

```
[appdefaults]
  mysql = {
    ldap_server_host = "ldap_host.example.com"
    ldap_destroy_tgt = true
  }
```

The client-side plugin recognizes these parameters in the `mysql` section:

* The `ldap_server_host` value specifies the LDAP server host and can be useful when that host differs from the KDC server host specified in the `[realms]` section. By default, the plugin uses the KDC server host as the LDAP server host.

* The `ldap_destroy_tgt` value indicates whether the client-side plugin destroys the TGT after obtaining and using it. By default, `ldap_destroy_tgt` is `false`, but can be set to `true` to avoid TGT reuse. (This setting applies only to TGTs created by the client-side plugin, not TGTs created by other plugins or externally to MySQL.)

##### LDAP Search Referral

An LDAP server can be configured to delegate LDAP searches to another LDAP server, a functionality known as LDAP referral. Suppose that the server `a.example.com` holds a `"dc=example,dc=com"` root DN and wishes to delegate searches to another server `b.example.com`. To enable this, `a.example.com` would be configured with a named referral object having these attributes:

```
dn: dc=subtree,dc=example,dc=com
objectClass: referral
objectClass: extensibleObject
dc: subtree
ref: ldap://b.example.com/dc=subtree,dc=example,dc=com
```

An issue with enabling LDAP referral is that searches can fail with LDAP operation errors when the search base DN is the root DN, and referral objects are not set. A MySQL DBA might wish to avoid such referral errors for the LDAP authentication plugins, even though LDAP referral might be set globally in the `ldap.conf` configuration file. To configure on a plugin-specific basis whether the LDAP server should use LDAP referral when communicating with each plugin, set the `authentication_ldap_simple_referral` and `authentication_ldap_sasl_referral` system variables. Setting either variable to `ON` or `OFF` causes the corresponding LDAP authentication plugin to tell the LDAP server whether to use referral during MySQL authentication. Each variable has a plugin-specific effect and does not affect other applications that communicate with the LDAP server. Both variables are `OFF` by default.


#### 8.4.1.7 Kerberos Pluggable Authentication

Note

Kerberos pluggable authentication is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

MySQL Enterprise Edition supports an authentication method that enables users to authenticate to MySQL Server using Kerberos, provided that appropriate Kerberos tickets are available or can be obtained.

This authentication method is available in MySQL 9.5 for MySQL servers and clients on Linux. It is useful in Linux environments where applications have access to Microsoft Active Directory, which has Kerberos enabled by default. The client-side plugin is supported on Windows as well. The server-side plugin is still supported only on Linux.

Kerberos pluggable authentication provides these capabilities:

* External authentication: Kerberos authentication enables MySQL Server to accept connections from users defined outside the MySQL grant tables who have obtained the proper Kerberos tickets.

* Security: Kerberos uses tickets together with symmetric-key cryptography, enabling authentication without sending passwords over the network. Kerberos authentication supports userless and passwordless scenarios.

The following table shows the plugin and library file names. The file name suffix might differ on your system. The file must be located in the directory named by the `plugin_dir` system variable. For installation information, see Installing Kerberos Pluggable Authentication.

**Table 8.22 Plugin and Library Names for Kerberos Authentication**

<table summary="Names for the plugins and library file used for Kerberos authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>authentication_kerberos</code></td> </tr><tr> <td>Client-side plugin</td> <td><code>authentication_kerberos_client</code></td> </tr><tr> <td>Library file</td> <td><code>authentication_kerberos.so</code>, <code>authentication_kerberos_client.so</code></td> </tr></tbody></table>

The server-side Kerberos authentication plugin is included only in MySQL Enterprise Edition. It is not included in MySQL community distributions. The client-side plugin is included in all distributions, including community distributions. This enables clients from any distribution to connect to a server that has the server-side plugin loaded.

The following sections provide installation and usage information specific to Kerberos pluggable authentication:

* Prerequisites for Kerberos Pluggable Authentication
* How Kerberos Authentication of MySQL Users Works
* Installing Kerberos Pluggable Authentication
* Using Kerberos Pluggable Authentication
* Kerberos Authentication Debugging

For general information about pluggable authentication in MySQL, see Section 8.2.17, “Pluggable Authentication”.

##### Prerequisites for Kerberos Pluggable Authentication

To use Kerberos pluggable authentication for MySQL, these prerequisites must be satisfied:

* A Kerberos service must be available for the Kerberos authentication plugins to communicate with.

* Each Kerberos user (principal) to be authenticated by MySQL must be present in the database managed by the KDC server.

* A Kerberos client library must be available on systems where either the server-side or client-side Kerberos authentication plugin is used. In addition, GSSAPI is used as the interface for accessing Kerberos authentication, so a GSSAPI library must be available.

##### How Kerberos Authentication of MySQL Users Works

This section provides an overview of how MySQL and Kerberos work together to authenticate MySQL users. For examples showing how to set up MySQL accounts to use the Kerberos authentication plugins, see Using Kerberos Pluggable Authentication.

Familiarity is assumed here with Kerberos concepts and operation. The following list briefly defines several common Kerberos terms. You may also find the Glossary section of [RFC 4120](https://tools.ietf.org/html/rfc4120) helpful.

* Principal: A named entity, such as a user or server. In this discussion, certain principal-related terms occur frequently:

  + SPN: Service principal name; the name of a principal that represents a service.

  + UPN: User principal name; the name of a principal that represents a user.

* KDC: The key distribution center, comprising the AS and TGS:

  + AS: The authentication server; provides the initial ticket-granting ticket needed to obtain additional tickets.

  + TGS: The ticket-granting server; provides additional tickets to Kerberos clients that possess a valid TGT.

* TGT: The ticket-granting ticket; presented to the TGS to obtain service tickets for service access.

* ST: A service ticket; provides access to a service such as that offered by a MySQL server.

Authentication using Kerberos requires a KDC server, for example, as provided by Microsoft Active Directory.

Kerberos authentication in MySQL uses Generic Security Service Application Program Interface (GSSAPI), which is a security abstraction interface. Kerberos is an instance of a specific security protocol that can be used through that abstract interface. Using GSSAPI, applications authenticate to Kerberos to obtain service credentials, then use those credentials in turn to enable secure access to other services.

On Windows, the `authentication_kerberos_client` authentication plugin supports two modes, which the client user can set at runtime or specify in an option file:

* `SSPI` mode: Security Support Provider Interface (SSPI) implements GSSAPI (see Commands for Windows Clients in SSPI Mode). SSPI, while being compatible with GSSAPI at the wire level, only supports the Windows single sign-on scenario and specifically refers to the logged-on user. SSPI is the default mode on most Windows clients.

* `GSSAPI` mode: Supports GSSAPI through the MIT Kerberos library on Windows (see Commands for Windows Clients in GSSAPI Mode).

With the Kerberos authentication plugins, applications and MySQL servers are able to use the Kerberos authentication protocol to mutually authenticate users and MySQL services. This way both the user and the server are able to verify each other's identity. No passwords are sent over the network and Kerberos protocol messages are protected against eavesdropping and replay attacks.

Kerberos authentication follows these steps, where the server-side and client-side parts are performed using the `authentication_kerberos` and `authentication_kerberos_client` authentication plugins, respectively:

1. The MySQL server sends to the client application its service principal name. This SPN must be registered in the Kerberos system, and is configured on the server side using the `authentication_kerberos_service_principal` system variable.

2. Using GSSAPI, the client application creates a Kerberos client-side authentication session and exchanges Kerberos messages with the Kerberos KDC:

   * The client obtains a ticket-granting ticket from the authentication server.

   * Using the TGT, the client obtains a service ticket for MySQL from the ticket-granting service.

   This step can be skipped or partially skipped if the TGT, ST, or both are already cached locally. The client optionally may use a client keytab file to obtain a TGT and ST without supplying a password.

3. Using GSSAPI, the client application presents the MySQL ST to the MySQL server.

4. Using GSSAPI, the MySQL server creates a Kerberos server-side authentication session. The server validates the user identity and the validity of the user request. It authenticates the ST using the service key configured in its service keytab file to determine whether authentication succeeds or fails, and returns the authentication result to the client.

Applications are able to authenticate using a provided user name and password, or using a locally cached TGT or ST (for example, created using **kinit** or similar). This design therefore covers use cases ranging from completely userless and passwordless connections, where Kerberos service tickets are obtained from a locally stored Kerberos cache, to connections where both user name and password are provided and used to obtain a valid Kerberos service ticket from a KDC, to send to the MySQL server.

As indicated in the preceding description, MySQL Kerberos authentication uses two kinds of keytab files:

* On the client host, a client keytab file may be used to obtain a TGT and ST without supplying a password. See Client Configuration Parameters for Kerberos Authentication.

* On the MySQL server host, a server-side service keytab file is used to verify service tickets received by the MySQL server from clients. The keytab file name is configured using the `authentication_kerberos_service_key_tab` system variable.

For information about keytab files, see <https://web.mit.edu/kerberos/krb5-latest/doc/basic/keytab_def.html>.

##### Installing Kerberos Pluggable Authentication

This section describes how to install the server-side Kerberos authentication plugin. For general information about installing plugins, see Section 7.6.1, “Installing and Uninstalling Plugins”.

Note

The server-side plugin is supported only on Linux systems. On Windows systems, only the client-side plugin is supported, which can be used on a Windows system to connect to a Linux server that uses Kerberos authentication.

To be usable by the server, the plugin library file must be located in the MySQL plugin directory (the directory named by the `plugin_dir` system variable). If necessary, configure the plugin directory location by setting the value of `plugin_dir` at server startup.

The server-side plugin library file base name is `authentication_kerberos`. The file name suffix for Unix and Unix-like systems is `.so`.

To load the plugin at server startup, use the `--plugin-load-add` option to name the library file that contains it. With this plugin-loading method, the option must be given each time the server starts. Also, specify values for any plugin-provided system variables you wish to configure. The plugin exposes these system variables, enabling its operation to be configured:

* `authentication_kerberos_service_principal`: The MySQL service principal name (SPN). This name is sent to clients that attempt to authenticate using Kerberos. The SPN must be present in the database managed by the KDC server. The default is `mysql/host_name@realm_name`.

* `authentication_kerberos_service_key_tab`: The keytab file for authenticating tickets received from clients. This file must exist and contain a valid key for the SPN or authentication of clients will fail. The default is `mysql.keytab` in the data directory.

For details about all Kerberos authentication system variables, see Section 8.4.1.13, “Pluggable Authentication System Variables”.

To load the plugin and configure it, put lines such as these in your `my.cnf` file, using values for the system variables that are appropriate for your installation:

```
[mysqld]
plugin-load-add=authentication_kerberos.so
authentication_kerberos_service_principal=mysql/krbauth.example.com@MYSQL.LOCAL
authentication_kerberos_service_key_tab=/var/mysql/data/mysql.keytab
```

After modifying `my.cnf`, restart the server to cause the new settings to take effect.

Alternatively, to load the plugin at runtime, use this statement:

```
INSTALL PLUGIN authentication_kerberos
  SONAME 'authentication_kerberos.so';
```

`INSTALL PLUGIN` loads the plugin immediately, and also registers it in the `mysql.plugins` system table to cause the server to load it for each subsequent normal startup without the need for `--plugin-load-add`.

When you install the plugin at runtime without configuring its system variables in the `my.cnf` file, the system variable `authentication_kerberos_service_key_tab` is set to the default value of `mysql.keytab` in the data directory. The value of this system variable cannot be changed at runtime, so if you need to specify a different file, you need to add the setting to your `my.cnf` file then restart the MySQL server. For example:

```
[mysqld]
authentication_kerberos_service_key_tab=/var/mysql/data/mysql.keytab
```

If the keytab file is not in the correct place or does not contain a valid SPN key, the MySQL server does not validate this, but clients return authentication errors until you fix the issue.

The `authentication_kerberos_service_principal` system variable can be set and persisted at runtime without restarting the server, by using a [`SET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") statement:

```
SET PERSIST authentication_kerberos_service_principal='mysql/krbauth.example.com@MYSQL.LOCAL';
```

[`SET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") sets a value for the running MySQL instance. It also saves the value, causing it to carry over to subsequent server restarts. To change a value for the running MySQL instance without having it carry over to subsequent restarts, use the `GLOBAL` keyword rather than `PERSIST`. See Section 15.7.6.1, “SET Syntax for Variable Assignment”.

To verify plugin installation, examine the Information Schema `PLUGINS` table or use the `SHOW PLUGINS` statement (see Section 7.6.2, “Obtaining Server Plugin Information”). For example:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME = 'authentication_kerberos';
+-------------------------+---------------+
| PLUGIN_NAME             | PLUGIN_STATUS |
+-------------------------+---------------+
| authentication_kerberos | ACTIVE        |
+-------------------------+---------------+
```

If a plugin fails to initialize, check the server error log for diagnostic messages.

To associate MySQL accounts with the Kerberos plugin, see Using Kerberos Pluggable Authentication.

##### Using Kerberos Pluggable Authentication

This section describes how to enable MySQL accounts to connect to the MySQL server using Kerberos pluggable authentication. It is assumed that the server is running with the server-side plugin enabled, as described in Installing Kerberos Pluggable Authentication, and that the client-side plugin is available on the client host.

* Verify Kerberos Availability
* Create a MySQL Account That Uses Kerberos Authentication
* Use the MySQL Account to Connect to the MySQL Server
* Client Configuration Parameters for Kerberos Authentication

###### Verify Kerberos Availability

The following example shows how to test availability of Kerberos in Active Directory. The example makes these assumptions:

* Active Directory is running on the host named `krbauth.example.com` with IP address `198.51.100.11`.

* MySQL-related Kerberos authentication uses the `MYSQL.LOCAL` domain, and also uses `MYSQL.LOCAL` as the realm name.

* A principal named `karl@MYSQL.LOCAL` is registered with the KDC. (In later discussion, this principal name is associated with the MySQL account that authenticates to the MySQL server using Kerberos.)

With those assumptions satisfied, follow this procedure:

1. Verify that the Kerberos library is installed and configured correctly in the operating system. For example, to configure a `MYSQL.LOCAL` domain and realm for use during MySQL authentication, the `/etc/krb5.conf` Kerberos configuration file should contain something like this:

   ```
   [realms]
     MYSQL.LOCAL = {
       kdc = krbauth.example.com
       admin_server = krbauth.example.com
       default_domain = MYSQL.LOCAL
     }
   ```

2. You may need to add an entry to `/etc/hosts` for the server host:

   ```
   198.51.100.11 krbauth krbauth.example.com
   ```

3. Check whether Kerberos authentication works correctly:

   1. Use **kinit** to authenticate to Kerberos:

      ```
      $> kinit karl@MYSQL.LOCAL
      Password for karl@MYSQL.LOCAL: (enter password here)
      ```

      The command authenticates for the Kerberos principal named `karl@MYSQL.LOCAL`. Enter the principal's password when the command prompts for it. The KDC returns a TGT that is cached on the client side for use by other Kerberos-aware applications.

   2. Use **klist** to check whether the TGT was obtained correctly. The output should be similar to this:

      ```
      $> klist
      Ticket cache: FILE:/tmp/krb5cc_244306
      Default principal: karl@MYSQL.LOCAL

      Valid starting       Expires              Service principal
      03/23/2021 08:18:33  03/23/2021 18:18:33  krbtgt/MYSQL.LOCAL@MYSQL.LOCAL
      ```

###### Create a MySQL Account That Uses Kerberos Authentication

MySQL authentication using the `authentication_kerberos` authentication plugin is based on a Kerberos user principal name (UPN). The instructions here assume that a MySQL user named `karl` authenticates to MySQL using Kerberos, that the Kerberos realm is named `MYSQL.LOCAL`, and that the user principal name is `karl@MYSQL.LOCAL`. This UPN must be registered in several places:

* The Kerberos administrator should register the user name as a Kerberos principal. This name includes a realm name. Clients use the principal name and password to authenticate with Kerberos and obtain a ticket-granting ticket (TGT).

* The MySQL DBA should create an account that corresponds to the Kerberos principal name and that authenticates using the Kerberos plugin.

Assume that the Kerberos user principal name has been registered by the appropriate service administrator, and that, as previously described in Installing Kerberos Pluggable Authentication, the MySQL server has been started with appropriate configuration settings for the server-side Kerberos plugin. To create a MySQL account that corresponds to a Kerberos UPN of `user@realm_name`, the MySQL DBA uses a statement like this:

```
CREATE USER user
  IDENTIFIED WITH authentication_kerberos
  BY 'realm_name';
```

The account named by *`user`* can include or omit the host name part. If the host name is omitted, it defaults to `%` as usual. The *`realm_name`* is stored as the `authentication_string` value for the account in the `mysql.user` system table.

To create a MySQL account that corresponds to the UPN `karl@MYSQL.LOCAL`, use this statement:

```
CREATE USER 'karl'
  IDENTIFIED WITH authentication_kerberos
  BY 'MYSQL.LOCAL';
```

If MySQL must construct the UPN for this account, for example, to obtain or validate tickets (TGTs or STs), it does so by combining the account name (ignoring any host name part) and the realm name. For example, the full account name resulting from the preceding `CREATE USER` statement is `'karl'@'%'`. MySQL constructs the UPN from the user name part `karl` (ignoring the host name part) and the realm name `MYSQL.LOCAL` to produce `karl@MYSQL.LOCAL`.

Note

Observe that when creating an account that authenticates using `authentication_kerberos`, the `CREATE USER` statement does not include the UPN realm as part of the user name. Instead, specify the realm (`MYSQL.LOCAL` in this case) as the authentication string in the `BY` clause. This differs from creating accounts that use the `authentication_ldap_sasl` SASL LDAP authentication plugin with the GSSAPI/Kerberos authentication method. For such accounts, the `CREATE USER` statement does include the UPN realm as part of the user name. See Create a MySQL Account That Uses GSSAPI/Kerberos for LDAP Authentication.

With the account set up, clients can use it to connect to the MySQL server. The procedure depends on whether the client host runs Linux or Windows, as indicated in the following discussion.

Use of `authentication_kerberos` is subject to the restriction that UPNs with the same user part but a different realm part are not supported. For example, you cannot create MySQL accounts that correspond to both these UPNs:

```
kate@MYSQL.LOCAL
kate@EXAMPLE.COM
```

Both UPNs have a user part of `kate` but differ in the realm part (`MYSQL.LOCAL` versus `EXAMPLE.COM`). This is disallowed.

###### Use the MySQL Account to Connect to the MySQL Server

After a MySQL account that authenticates using Kerberos has been set up, clients can use it to connect to the MySQL server as follows:

1. Authenticate to Kerberos with the user principal name (UPN) and its password to obtain a ticket-granting ticket (TGT).

2. Use the TGT to obtain a service ticket (ST) for MySQL.
3. Authenticate to the MySQL server by presenting the MySQL ST.

The first step (authenticating to Kerberos) can be performed various ways:

* Prior to connecting to MySQL:

  + On Linux or on Windows in `GSSAPI` mode, invoke **kinit** to obtain the TGT and save it in the Kerberos credentials cache.

  + On Windows in `SSPI` mode, authentication may already have been done at login time, which saves the TGT for the logged-in user in the Windows in-memory cache. **kinit** is not used and there is no Kerberos cache.

* When connecting to MySQL, the client program itself can obtain the TGT, if it can determine the required Kerberos UPN and password:

  + That information can come from sources such as command options or the operating system.

  + On Linux, clients also can use a keytab file or the `/etc/krb5.conf` configuration file. Windows clients in `GSSAPI` mode use a configuration file. Windows clients in `SSPI` mode use neither.

Details of the client commands for connecting to the MySQL server differ for Linux and Windows, so each host type is discussed separately, but these command properties apply regardless of host type:

* Each command shown includes the following options, but each one may be omitted under certain conditions:

  + The `--default-auth` option specifies the name of the client-side authentication plugin (`authentication_kerberos_client`). This option may be omitted when the `--user` option is specified because in that case MySQL can determine the plugin from the user account information sent by MySQL server.

  + The `--plugin-dir` option indicates to the client program the location of the `authentication_kerberos_client` plugin. This option may be omitted if the plugin is installed in the default (compiled-in) location.

* Commands should also include any other options such as `--host` or `--port` that are required to specify which MySQL server to connect to.

* Enter each command on a single line. If the command includes a `--password` option to solicit a password, enter the password of the Kerberos UPN associated with the MySQL user when prompted.

**Connection Commands for Linux Clients**

On Linux, the appropriate client command for connecting to the MySQL server varies depending on whether the command authenticates using a TGT from the Kerberos cache, or based on command options for the MySQL user name and the UPN password:

* Prior to invoking the MySQL client program, the client user can obtain a TGT from the KDC independently of MySQL. For example, the client user can use **kinit** to authenticate to Kerberos by providing a Kerberos user principal name and the principal password:

  ```
  $> kinit karl@MYSQL.LOCAL
  Password for karl@MYSQL.LOCAL: (enter password here)
  ```

  The resulting TGT for the UPN is cached and becomes available for use by other Kerberos-aware applications, such as programs that use the client-side Kerberos authentication plugin. In this case, invoke the client without specifying a user-name or password option:

  ```
  mysql
    --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
  ```

  The client-side plugin finds the TGT in the cache, uses it to obtain a MySQL ST, and uses the ST to authenticate to the MySQL server.

  As just described, when the TGT for the UPN is cached, user-name and password options are not needed in the client command. If the command includes them anyway, they are handled as follows:

  + This command includes a user-name option:

    ```
    mysql
      --default-auth=authentication_kerberos_client
      --plugin-dir=path/to/plugin/directory
      --user=karl
    ```

    In this case, authentication fails if the user name specified by the option does not match the user name part of the UPN in the TGT.

  + This command includes a password option, which you enter when prompted:

    ```
    mysql
      --default-auth=authentication_kerberos_client
      --plugin-dir=path/to/plugin/directory
      --password
    ```

    In this case, the client-side plugin ignores the password. Because authentication is based on the TGT, it can succeed *even if the user-provided password is incorrect*. For this reason, the plugin produces a warning if a valid TGT is found that causes a password to be ignored.

* If the Kerberos cache contains no TGT, the client-side Kerberos authentication plugin itself can obtain the TGT from the KDC. Invoke the client with options for the MySQL user name and the password, then enter the UPN password when prompted:

  ```
  mysql --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
    --user=karl
    --password
  ```

  The client-side Kerberos authentication plugin combines the user name (`karl`) and the realm specified in the user account (`MYSQL.LOCAL`) to construct the UPN (`karl@MYSQL.LOCAL`). The client-side plugin uses the UPN and password to obtain a TGT, uses the TGT to obtain a MySQL ST, and uses the ST to authenticate to the MySQL server.

  Or, suppose that the Kerberos cache contains no TGT and the command specifies a password option but no user-name option:

  ```
  mysql --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
    --password
  ```

  The client-side Kerberos authentication plugin uses the operating system login name as the MySQL user name. It combines that user name and the realm in the user' MySQL account to construct the UPN. The client-side plugin uses the UPN and the password to obtain a TGT, uses the TGT to obtain a MySQL ST, and uses the ST to authenticate to the MySQL server.

If you are uncertain whether a TGT exists, you can use **klist** to check.

Note

When the client-side Kerberos authentication plugin itself obtains the TGT, the client user may not want the TGT to be reused. As described in Client Configuration Parameters for Kerberos Authentication, the local `/etc/krb5.conf` file can be used to cause the client-side plugin to destroy the TGT when done with it.

**Connection Commands for Windows Clients in SSPI Mode**

On Windows, using the default client-side plugin option (SSPI), the appropriate client command for connecting to the MySQL server varies depending on whether the command authenticates based on command options for the MySQL user name and the UPN password, or instead uses a TGT from the Windows in-memory cache. For details about GSSAPI mode on Windows, see Commands for Windows Clients in GSSAPI Mode.

A command can explicitly specify options for the MySQL user name and the UPN password, or the command can omit those options:

* This command includes options for the MySQL user name and UPN password:

  ```
  mysql --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
    --user=karl
    --password
  ```

  The client-side Kerberos authentication plugin combines the user name (`karl`) and the realm specified in the user account (`MYSQL.LOCAL`) to construct the UPN (`karl@MYSQL.LOCAL`). The client-side plugin uses the UPN and password to obtain a TGT, uses the TGT to obtain a MySQL ST, and uses the ST to authenticate to the MySQL server.

  Any information in the Windows in-memory cache is ignored; the user-name and password option values take precedence.

* This command includes an option for the UPN password but not for the MySQL user name:

  ```
  mysql
    --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
    --password
  ```

  The client-side Kerberos authentication plugin uses the logged-in user name as the MySQL user name and combines that user name and the realm in the user's MySQL account to construct the UPN. The client-side plugin uses the UPN and the password to obtain a TGT, uses the TGT to obtain a MySQL ST, and uses the ST to authenticate to the MySQL server.

* This command includes no options for the MySQL user name or UPN password:

  ```
  mysql
    --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
  ```

  The client-side plugin obtains the TGT from the Windows in-memory cache, uses the TGT to obtain a MySQL ST, and uses the ST to authenticate to the MySQL server.

  This approach requires the client host to be part of the Windows Server Active Directory (AD) domain. If that is not the case, help the MySQL client discover the IP address for the AD domain by manually entering the AD server and realm as the DNS server and prefix:

  1. Start `console.exe` and select Network and Sharing Center.

  2. From the sidebar of the Network and Sharing Center window, select Change adapter settings.

  3. In the Network Connections window, right-click the network or VPN connection to configure and select Properties.

  4. From the Network tab, locate and click Internet Protocol Version 4 (TCP/IPv4), and then click Properties.

  5. Click Advanced in the Internet Protocol Version 4 (TCP/IPv4) Properties dialog. The Advanced TCP/IP Settings dialog opens.

  6. From the DNS tab, add the Active Directory server and realm as a DNS server and prefix.

* This command includes an option for the MySQL user name but not for the UPN password:

  ```
  mysql
    --default-auth=authentication_kerberos_client
    --plugin-dir=path/to/plugin/directory
    --user=karl
  ```

  The client-side Kerberos authentication plugin compares the name specified by the user-name option against the logged-in user name. If the names are the same, the plugin uses the logged-in user TGT for authentication. If the names differ, authentication fails.

**Connection Commands for Windows Clients in GSSAPI Mode**

On Windows, the client user must specify `GSSAPI` mode explicitly using the `plugin_authentication_kerberos_client_mode` plugin option to enable support through the MIT Kerberos library. The default mode is `SSPI` (see [Commands for Windows Clients in SSPI Mode](kerberos-pluggable-authentication.html#kerberos-usage-win-sspi-client-commands)).

It is possible to specify `GSSAPI` mode:

* Prior to invoking the MySQL client program in an option file. The plugin variable name is valid using either underscores or dashes:

  ```
  [mysql]
  plugin_authentication_kerberos_client_mode=GSSAPI
  ```

  Or:

  ```
  [mysql]
  plugin-authentication-kerberos-client-mode=GSSAPI
  ```

* At runtime from the command line using the **mysql** or **mysqldump** client programs. For example, the following commands (with underscores or dashes) causes **mysql** to connect to the server through the MIT Kerberos library on Windows.

  ```
  mysql [connection-options] --plugin_authentication_kerberos_client_mode=GSSAPI
  ```

  Or:

  ```
  mysql [connection-options] --plugin-authentication-kerberos-client-mode=GSSAPI
  ```

* Client users can select `GSSAPI` mode from MySQL Workbench and some MySQL connectors. On client hosts running Windows, you can override the default location of:

  + The Kerberos configuration file by setting the `KRB5_CONFIG` environment variable.

  + The default credential cache name with the `KRB5CCNAME` environment variable (for example, `KRB5CCNAME=DIR:/mydir/`).

  For specific client-side plugin information, see the documentation at https://dev.mysql.com/doc/.

The appropriate client command for connecting to the MySQL server varies depending on whether the command authenticates using a TGT from the MIT Kerberos cache, or based on command options for the MySQL user name and the UPN password. GSSAPI support through the MIT library on Windows is similar to GSSAPI on Linux (see [Commands for Linux Clients](kerberos-pluggable-authentication.html#kerberos-usage-linux-client-commands)), with the following exceptions:

* Tickets are always retrieved from or placed into the MIT Kerberos cache on hosts running Windows.

* **kinit** runs with Functional Accounts on Windows that have narrow permissions and specific roles. The client user does not know the **kinit** password. For an overview, see <https://docs.oracle.com/en/java/javase/11/tools/kinit.html>.

* If the client user supplies a password, the MIT Kerberos library on Windows decides whether to use it or rely on the existing ticket.

* The `destroy_tickets` parameter, described in Client Configuration Parameters for Kerberos Authentication, is not supported because the MIT Kerberos library on Windows does not support the required API member (`get_profile_boolean`) to read its value from configuration file.

###### Client Configuration Parameters for Kerberos Authentication

This section applies only for client hosts running Linux, not client hosts running Windows.

Note

A client host running Windows with the `authentication_kerberos_client` client-side Kerberos plugin set to `GSSAPI` mode does support client configuration parameters, in general, but the MIT Kerberos library on Windows does not support the `destroy_tickets` parameter described in this section.

If no valid ticket-granting ticket (TGT) exists at the time of MySQL client application invocation, the application itself may obtain and cache the TGT. If during the Kerberos authentication process the client application causes a TGT to be cached, any such TGT that was added can be destroyed after it is no longer needed, by setting the appropriate configuration parameter.

The `authentication_kerberos_client` client-side Kerberos plugin reads the local `/etc/krb5.conf` file. If this file is missing or inaccessible, an error occurs. Assuming that the file is accessible, it can include an optional `[appdefaults]` section to provide information used by the plugin. Place the information within the `mysql` part of the section. For example:

```
[appdefaults]
  mysql = {
    destroy_tickets = true
  }
```

The client-side plugin recognizes these parameters in the `mysql` section:

* The `destroy_tickets` value indicates whether the client-side plugin destroys the TGT after obtaining and using it. By default, `destroy_tickets` is `false`, but can be set to `true` to avoid TGT reuse. (This setting applies only to TGTs created by the client-side plugin, not TGTs created by other plugins or externally to MySQL.)

On the client host, a client keytab file may be used to obtain a TGT and TS without supplying a password. For information about keytab files, see <https://web.mit.edu/kerberos/krb5-latest/doc/basic/keytab_def.html>.

##### Kerberos Authentication Debugging

The `AUTHENTICATION_KERBEROS_CLIENT_LOG` environment variable enables or disables debug output for Kerberos authentication.

Note

Despite `CLIENT` in the name `AUTHENTICATION_KERBEROS_CLIENT_LOG`, the same environment variable applies to the server-side plugin as well as the client-side plugin.

On the server side, the permitted values are 0 (off) and 1 (on). Log messages are written to the server error log, subject to the server error-logging verbosity level. For example, if you are using priority-based log filtering, the `log_error_verbosity` system variable controls verbosity, as described in Section 7.4.2.5, “Priority-Based Error Log Filtering (log_filter_internal)”").

On the client side, the permitted values are from 1 to 5 and are written to the standard error output. The following table shows the meaning of each log-level value.

<table summary="Permitted client-side AUTHENTICATION_KERBEROS_CLIENT_LOG log levels and corresponding meanings"><col style="width: 40%"/><col style="width: 40%"/><thead><tr> <th>Log Level</th> <th>Meaning</th> </tr></thead><tbody><tr> <td>1 or not set</td> <td>No logging</td> </tr><tr> <td>2</td> <td>Error messages</td> </tr><tr> <td>3</td> <td>Error and warning messages</td> </tr><tr> <td>4</td> <td>Error, warning, and information messages</td> </tr><tr> <td>5</td> <td>Error, warning, information, and debug messages</td> </tr></tbody></table>


#### 8.4.1.8 No-Login Pluggable Authentication

The `mysql_no_login` server-side authentication plugin prevents all client connections to any account that uses it. Use cases for this plugin include:

* Accounts that must be able to execute stored programs and views with elevated privileges without exposing those privileges to ordinary users.

* Proxied accounts that should never permit direct login but are intended to be accessed only through proxy accounts.

The following table shows the plugin and library file names. The file name suffix might differ on your system. The file must be located in the directory named by the `plugin_dir` system variable.

**Table 8.23 Plugin and Library Names for No-Login Authentication**

<table summary="Names for the plugins and library file used for no-login password authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>mysql_no_login</code></td> </tr><tr> <td>Client-side plugin</td> <td>None</td> </tr><tr> <td>Library file</td> <td><code>mysql_no_login.so</code></td> </tr></tbody></table>

The following sections provide installation and usage information specific to no-login pluggable authentication:

* Installing No-Login Pluggable Authentication
* Uninstalling No-Login Pluggable Authentication
* Using No-Login Pluggable Authentication

For general information about pluggable authentication in MySQL, see Section 8.2.17, “Pluggable Authentication”. For proxy user information, see Section 8.2.19, “Proxy Users”.

##### Installing No-Login Pluggable Authentication

This section describes how to install the no-login authentication plugin. For general information about installing plugins, see Section 7.6.1, “Installing and Uninstalling Plugins”.

To be usable by the server, the plugin library file must be located in the MySQL plugin directory (the directory named by the `plugin_dir` system variable). If necessary, configure the plugin directory location by setting the value of `plugin_dir` at server startup.

The plugin library file base name is `mysql_no_login`. The file name suffix differs per platform (for example, `.so` for Unix and Unix-like systems, `.dll` for Windows).

To load the plugin at server startup, use the `--plugin-load-add` option to name the library file that contains it. With this plugin-loading method, the option must be given each time the server starts. For example, put these lines in the server `my.cnf` file, adjusting the `.so` suffix for your platform as necessary:

```
[mysqld]
plugin-load-add=mysql_no_login.so
```

After modifying `my.cnf`, restart the server to cause the new settings to take effect.

Alternatively, to load the plugin at runtime, use this statement, adjusting the `.so` suffix for your platform as necessary:

```
INSTALL PLUGIN mysql_no_login SONAME 'mysql_no_login.so';
```

`INSTALL PLUGIN` loads the plugin immediately, and also registers it in the `mysql.plugins` system table to cause the server to load it for each subsequent normal startup without the need for `--plugin-load-add`.

To verify plugin installation, examine the Information Schema `PLUGINS` table or use the `SHOW PLUGINS` statement (see Section 7.6.2, “Obtaining Server Plugin Information”). For example:

```
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

  ```
  UNINSTALL PLUGIN mysql_no_login;
  ```

##### Using No-Login Pluggable Authentication

This section describes how to use the no-login authentication plugin to prevent accounts from being used for connecting from MySQL client programs to the server. It is assumed that the server is running with the no-login plugin enabled, as described in Installing No-Login Pluggable Authentication.

To refer to the no-login authentication plugin in the `IDENTIFIED WITH` clause of a `CREATE USER` statement, use the name `mysql_no_login`.

An account that authenticates using `mysql_no_login` may be used as the `DEFINER` for stored program and view objects. If such an object definition also includes `SQL SECURITY DEFINER`, it executes with that account's privileges. DBAs can use this behavior to provide access to confidential or sensitive data that is exposed only through well-controlled interfaces.

The following example illustrates these principles. It defines an account that does not permit client connections, and associates with it a view that exposes only certain columns of the `mysql.user` system table:

```
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

```
GRANT SELECT ON nologindb.myview
  TO 'ordinaryuser'@'localhost';
```

Now the ordinary user can use the view to access the limited information it presents:

```
SELECT * FROM nologindb.myview;
```

Attempts by the user to access columns other than those exposed by the view result in an error, as do attempts to select from the view by users not granted access to it.

Note

Because the `nologin` account cannot be used directly, the operations required to set up objects that it uses must be performed by `root` or similar account that has the privileges required to create the objects and set `DEFINER` values.

The `mysql_no_login` plugin is also useful in proxying scenarios. (For a discussion of concepts involved in proxying, see Section 8.2.19, “Proxy Users”.) An account that authenticates using `mysql_no_login` may be used as a proxied user for proxy accounts:

```
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


#### 8.4.1.9 OpenID Connect Pluggable Authentication

Note

OpenID Connect pluggable authentication is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

MySQL Enterprise Edition supports an authentication method that enables users to authenticate to MySQL Server using OpenID Connect, provided that appropriate OpenID Connect credentials and tokens are properly configured based on the OAuth 2.0 framework.

The following table shows the plugin and library file names. The file name suffix might differ on your system. The file must be located in the directory named by the `plugin_dir` system variable. For installation information, see Installing OpenID Pluggable Authentication.

**Table 8.24 Plugin and Library Names for OpenID Connect Authentication**

<table summary="Names for the plugins and library file used for OpenID Connect authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>authentication_openid_connect</code></td> </tr><tr> <td>Client-side plugin</td> <td><code>authentication_openid_connect_client</code></td> </tr><tr> <td>Library file</td> <td><code>authentication_openid_connect.so</code>, <code>authentication_openid_connect_client.so</code></td> </tr></tbody></table>

The server-side OpenID Connect authentication plugin is included in MySQL Enterprise Edition. It is not included in MySQL community distributions. The client-side plugin is included in all distributions, including community distributions. This enables clients from any distribution to connect to a server that has the server-side plugin loaded.

The following sections provide installation and usage information specific to OpenID Connect pluggable authentication:

* Prerequisites for OpenID Connect Pluggable Authentication
* OpenID Connect Process and Workflow
* Installing OpenID Pluggable Authentication
* Connecting with a Client

For general information about pluggable authentication in MySQL, see Section 8.2.17, “Pluggable Authentication”.

##### Prerequisites for OpenID Connect Pluggable Authentication

To use OpenID Connect pluggable authentication for MySQL, these prerequisites must be satisfied:

* The *connecting user* must have an account in the Identity provider domain, and the means to obtain the [Identity Token](https://docs.oracle.com/en/cloud/paas/identity-cloud/rest-api/IdentityToken.html).

* The *administrator* must have a list of token issuers to support along with their public signing keys. The administrator must also have the user' identifier from the Identity provider domain.

##### OpenID Connect Process and Workflow

OpenID Connect authentication follows these steps, where the server-side and client-side parts are performed using the `authentication_openid_connect` and `authentication_openid_connect_client` authentication plugins, respectively:

1. The client reads the Identity token file. For example, the **mysql** command-line client uses the `authentication-openid-connect-client-id-token-file` option with a full filepath to the token file. The client does not accept a token with a size exceeding 10 KB. Each connector has a method to pass in this information.

2. The client checks if the connection is secure between the client and the server. Only TLS, socket, and shared memory connections are considered secure.

3. The client sends the token to the server after checking if it is a valid JSON Web Token (JWT).

4. The server checks if the connection is secure between the client and the server, and receives the token.

5. The server decodes and validates the token:

   1. It checks if the token is a valid JWT.
   2. The headers are extracted using the encryption algorithm, which uses the RS256 asymmetric algorithm.

   3. The payload is decoded, and checks are performed to determine if the appropriate criteria is met for a successful login.

6. Criteria for a successful login:

   * The Identity token's `sub` claim value must be the same as the user's value in the authentication string.

   * The `identity_provider` value in the authentication string must be one of the `identity_provider` values set in the configuration.

   * The Identity token's `iss` claim value must equal the `identity_provider` name's value set in the configuration.

   * The Identity token expiration time must be greater than the current time.

   * The Identity token's signature must be verified by the public key of the Identity token's issuer specified in the `authentication_openid_connect_configuration` option as set by the administrator.

7. Authentication is successful if all the required criteria are met, otherwise authentication fails and logs the appropriate information to the error log.

##### Installing OpenID Pluggable Authentication

This section describes how to install the server-side OpenID Connect authentication plugin. For general information about installing plugins, see Section 7.6.1, “Installing and Uninstalling Plugins”.

Install the server-side `authentication_openid_connect` plugin on the MySQL Server. For example, by using `INSTALL PLUGIN`:

```
INSTALL PLUGIN authentication_openid_connect SONAME 'authentication_openid_connect.so';
```

Next, configure the `authentication_openid_connect_configuration` MySQL server option. The administrator specifies the list of issuers and their corresponding Public Signing Keys used to validate the Identity token's signature. This is defined as a JSON string (with the `JSON://` prefix) or point to a JSON file (with the `file://` prefix). Only the Identity tokens issued by the list of issuers specified by the administrator are accepted for authentication. For example:

```
SET GLOBAL authentication_openid_connect_configuration = "file://full/path/to/file.json";
```

File `file.json` in this example looks similar to:

```
{
  "issuer1": "{\"name\":\"issuer1_formal_name\",\"e\":\"AQAB\",\"use\":\"sig\",\"n\":\"oUriU8GqbRw-avcMn95DGW1cpZR1IoM6L7krfrWvLSSCcSX6Ig117o25Yk7QWBiJpaPV0FbP7Y5-DmThZ3SaF0AXW-3BsKPEXfFfeKVc6vBqk3t5mKlNEowjdvNTSzoOXO5UIHwsXaxiJlbMRalaFEUm-2CKgmXl1ss_yGh1OHkfnBiGsfQUndKoHiZuDzBMGw8Sf67am_Ok-4FShK0NuR3-q33aB_3Z7obC71dejSLWFOEcKUVCaw6DGVuLog3x506h1QQ1r0FXKOQxnmqrRgpoHqGSouuG35oZve1vgCU4vLZ6EAgBAbC0KL35I7_0wUDSMpiAvf7iZxzJVbspkQ\",\"kty\":\"RSA\"}",
  "issuer2": "{\"name\":\"issuer2_formal_name\",\"e\":\"AQAB\",\"use\":\"sig\",\"n\":\"oUriU8GqbRw-avcMn95DGW1cpZR1IoM6L7krfrWvLSSCcSX6Ig117o25Yk7QWBiJpaPV0FbP7Y5-DmThZ3SaF0AXW-3BsKPEXfFfeKVc6vBqk3t5mKlNEowjdvNTSzoOXO5UIHwsXaxiJlbMRalaFEUm-2CKgmXl1ss_yGh1OHkfnBiGsfQUndKoHiZuDzBMGw8Sf67am_Ok-4FShK0NuR3-q33aB_3Z7obC71dejSLWFOEcKUVCaw6DGVuLog3x506h1QQ1r0FXKOQxnmqrRgpoHqGSouuG35oZve1vgCU4vLZ6EAgBAbC0KL35I7_0wUDSMpiAvf7iZxzJVbspkQ\",\"kty\":\"RSA\"}"
}
```

Alternatively, set `authentication_openid_connect_configuration` inline as a JSON string instead of a file:

```
SET GLOBAL authentication_openid_connect_configuration = "JSON://{\"issuer1\" : \"{\\\"name\\\":\\\"issuer1_formal_name\\\",\\\"e\\\":\\\"AQAB\\\",\\\"use\\\":\\\"sig\\\",\\\"n\\\":\\\"oUriU8GqbRw-avcMn95DGW1cpZR1IoM6L7krfrWvLSSCcSX6Ig117o25Yk7QWBiJpaPV0FbP7Y5-DmThZ3SaF0AXW-3BsKPEXfFfeKVc6vBqk3t5mKlNEowjdvNTSzoOXO5UIHwsXaxiJlbMRalaFEUm-2CKgmXl1ss_yGh1OHkfnBiGsfQUndKoHiZuDzBMGw8Sf67am_Ok-4FShK0NuR3-q33aB_3Z7obC71dejSLWFOEcKUVCaw6DGVuLog3x506h1QQ1r0FXKOQxnmqrRgpoHqGSouuG35oZve1vgCU4vLZ6EAgBAbC0KL35I7_0wUDSMpiAvf7iZxzJVbspkQ\\\",\\\"kty\\\":\\\"RSA\\\"}\", \"issuer2\": \"{\\\"name\\\":\\\"issuer2_formal_name\\\",\\\"e\\\":\\\"AQAB\\\",\\\"use\\\":\\\"sig\\\",\\\"n\\\":\\\"oUriU8GqbRw-avcMn95DGW1cpZR1IoM6L7krfrWvLSSCcSX6Ig117o25Yk7QWBiJpaPV0FbP7Y5-DmThZ3SaF0AXW-3BsKPEXfFfeKVc6vBqk3t5mKlNEowjdvNTSzoOXO5UIHwsXaxiJlbMRalaFEUm-2CKgmXl1ss_yGh1OHkfnBiGsfQUndKoHiZuDzBMGw8Sf67am_Ok-4FShK0NuR3-q33aB_3Z7obC71dejSLWFOEcKUVCaw6DGVuLog3x506h1QQ1r0FXKOQxnmqrRgpoHqGSouuG35oZve1vgCU4vLZ6EAgBAbC0KL35I7_0wUDSMpiAvf7iZxzJVbspkQ\\\",\\\"kty\\\":\\\"RSA\\\"}\"}";
```

One of the issuer names should match the authentication string's `identity_provider` value, and the corresponding `name` key value must match with Identity token's `iss` value.

A MySQL user is mapped to a user managed in an Identity provider domain to authenticate via the `authentication_openid_connect_client` client-side plugin, as in the example shown here:

```
CREATE USER
  'username'@'%'
IDENTIFIED WITH
  'authentication_openid_connect'
AS
  '{"identity_provider" : "idp_name_here", "user" : "user_id_here"}';
```

Replace *`idp_name_here`* with the Identity provider name chosen by the administrator to match one of the allowed identity provider keys specified in the configuration. Replace *`user_id_here`* with the user's identifier in the Identity Provider' domain, which must match with the `sub` field in the Identity token.

##### Connecting with a Client

A client with the `authentication_openid_connect_client` plugin enabled passes the required Identity token to authenticate with a mapped MySQL user, using the complete path to the Identity token file used when connecting to the MySQL server.

For example, the **mysql** command-line client passes in the `--authentication-openid-connect-client-id-token-file` option. For example:

```
mysql -h hostname --port port --authentication-openid-connect-client-id-token-file=/path/to/token/file -u username
```


#### 8.4.1.10 Socket Peer-Credential Pluggable Authentication

The server-side `auth_socket` authentication plugin authenticates clients that connect from the local host through the Unix socket file. The plugin uses the `SO_PEERCRED` socket option to obtain information about the user running the client program. Thus, the plugin can be used only on systems that support the `SO_PEERCRED` option, such as Linux.

The source code for this plugin can be examined as a relatively simple example demonstrating how to write a loadable authentication plugin.

The following table shows the plugin and library file names. The file must be located in the directory named by the `plugin_dir` system variable.

**Table 8.25 Plugin and Library Names for Socket Peer-Credential Authentication**

<table summary="Names for the plugins and library file used for socket peer-credential password authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>auth_socket</code></td> </tr><tr> <td>Client-side plugin</td> <td>None, see discussion</td> </tr><tr> <td>Library file</td> <td><code>auth_socket.so</code></td> </tr></tbody></table>

The following sections provide installation and usage information specific to socket pluggable authentication:

* Installing Socket Pluggable Authentication
* Uninstalling Socket Pluggable Authentication
* Using Socket Pluggable Authentication

For general information about pluggable authentication in MySQL, see Section 8.2.17, “Pluggable Authentication”.

##### Installing Socket Pluggable Authentication

This section describes how to install the socket authentication plugin. For general information about installing plugins, see Section 7.6.1, “Installing and Uninstalling Plugins”.

To be usable by the server, the plugin library file must be located in the MySQL plugin directory (the directory named by the `plugin_dir` system variable). If necessary, configure the plugin directory location by setting the value of `plugin_dir` at server startup.

To load the plugin at server startup, use the `--plugin-load-add` option to name the library file that contains it. With this plugin-loading method, the option must be given each time the server starts. For example, put these lines in the server `my.cnf` file:

```
[mysqld]
plugin-load-add=auth_socket.so
```

After modifying `my.cnf`, restart the server to cause the new settings to take effect.

Alternatively, to load the plugin at runtime, use this statement:

```
INSTALL PLUGIN auth_socket SONAME 'auth_socket.so';
```

`INSTALL PLUGIN` loads the plugin immediately, and also registers it in the `mysql.plugins` system table to cause the server to load it for each subsequent normal startup without the need for `--plugin-load-add`.

To verify plugin installation, examine the Information Schema `PLUGINS` table or use the `SHOW PLUGINS` statement (see Section 7.6.2, “Obtaining Server Plugin Information”). For example:

```
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

  ```
  UNINSTALL PLUGIN auth_socket;
  ```

##### Using Socket Pluggable Authentication

The socket plugin checks whether the socket user name (the operating system user name) matches the MySQL user name specified by the client program to the server. If the names do not match, the plugin checks whether the socket user name matches the name specified in the `authentication_string` column of the `mysql.user` system table row. If a match is found, the plugin permits the connection. The `authentication_string` value can be specified using an `IDENTIFIED ...AS` clause with `CREATE USER` or `ALTER USER`.

Suppose that a MySQL account is created for an operating system user named `valerie` who is to be authenticated by the `auth_socket` plugin for connections from the local host through the socket file:

```
CREATE USER 'valerie'@'localhost' IDENTIFIED WITH auth_socket;
```

If a user on the local host with a login name of `stefanie` invokes **mysql** with the option `--user=valerie` to connect through the socket file, the server uses `auth_socket` to authenticate the client. The plugin determines that the `--user` option value (`valerie`) differs from the client user's name (`stephanie`) and refuses the connection. If a user named `valerie` tries the same thing, the plugin finds that the user name and the MySQL user name are both `valerie` and permits the connection. However, the plugin refuses the connection even for `valerie` if the connection is made using a different protocol, such as TCP/IP.

To permit both the `valerie` and `stephanie` operating system users to access MySQL through socket file connections that use the account, this can be done two ways:

* Name both users at account-creation time, one following `CREATE USER`, and the other in the authentication string:

  ```
  CREATE USER 'valerie'@'localhost' IDENTIFIED WITH auth_socket AS 'stephanie';
  ```

* If you have already used [`CREATE USER`](create-user.html "15.7.1.3 CREATE USER Statement") to create the account for a single user, use `ALTER USER` to add the second user:

  ```
  CREATE USER 'valerie'@'localhost' IDENTIFIED WITH auth_socket;
  ALTER USER 'valerie'@'localhost' IDENTIFIED WITH auth_socket AS 'stephanie';
  ```

To access the account, both `valerie` and `stephanie` specify `--user=valerie` at connect time.


#### 8.4.1.11 WebAuthn Pluggable Authentication

Note

WebAuthn authentication is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

MySQL Enterprise Edition supports an authentication method that enables users to authenticate to MySQL Server using WebAuthn authentication.

WebAuthn stands for Web Authentication, which is a web standard published by the World Wide Web Consortium (W3C) and web application APIs that add FIDO-based authentication to supported browsers and platforms.

WebAuthn pluggable authentication replaces FIDO pluggable authentication, which is deprecated. WebAuthn pluggable authentication supports both FIDO and FIDO2 devices.

WebAuthn pluggable authentication provides these capabilities:

* WebAuthn enables authentication to MySQL Server using devices such as smart cards, security keys, and biometric readers.

* Because authentication can occur other than by providing a password, WebAuthn enables passwordless authentication.

* On the other hand, device authentication is often used in conjunction with password authentication, so WebAuthn authentication can be used to good effect for MySQL accounts that use multifactor authentication; see Section 8.2.18, “Multifactor Authentication”.

The following table shows the plugin and library file names. The file name suffix might differ on your system. Common suffixes are `.so` for Unix and Unix-like systems, and `.dll` for Windows. The file must be located in the directory named by the `plugin_dir` system variable. For installation information, see Installing WebAuthn Pluggable Authentication.

**Table 8.26 Plugin and Library Names for WebAuthn Authentication**

<table summary="Names for the plugins and library file used for WebAuthn authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>authentication_webauthn</code></td> </tr><tr> <td>Client-side plugin</td> <td><code>authentication_webauthn_client</code></td> </tr><tr> <td>Library file</td> <td><code>authentication_webauthn.so</code>, <code>authentication_webauthn_client.so</code></td> </tr></tbody></table>

Note

A `libfido2` library must be available on systems where either the server-side or client-side WebAuthn authentication plugin is used.

The server-side WebAuthn authentication plugin is included only in MySQL Enterprise Edition. It is not included in MySQL community distributions. The client-side plugin is included in all distributions, including community distributions, which enables clients from any distribution to connect to a server that has the server-side plugin loaded.

The following sections provide installation and usage information specific to WebAuthn pluggable authentication:

* Installing WebAuthn Pluggable Authentication
* Using WebAuthn Authentication
* WebAuthn Passwordless Authentication
* Device Unregistration for WebAuthn
* How WebAuthn Authentication of MySQL Users Works

For general information about pluggable authentication in MySQL, see Section 8.2.17, “Pluggable Authentication”.

##### Installing WebAuthn Pluggable Authentication

This section describes how to install the server-side WebAuthn authentication plugin. For general information about installing plugins, see Section 7.6.1, “Installing and Uninstalling Plugins”.

To be usable by the server, the plugin library file must be located in the MySQL plugin directory (the directory named by the `plugin_dir` system variable). If necessary, configure the plugin directory location by setting the value of `plugin_dir` at server startup.

The server-side plugin library file base name is `authentication_webauthn`. The file name suffix differs per platform (for example, `.so` for Unix and Unix-like systems, `.dll` for Windows).

Before installing the server-side plugin, define a unique name for the relying party ID (used for device registration and authentication), which is the MySQL server. Start the server using the `--loose-authentication-webauthn-rp-id=value` option. The example here specifies the value `mysql.com` as the relying party ID. Replace this value with one that satisfies your requirements.

```
$> mysqld [options] --loose-authentication-webauthn-rp-id=mysql.com
```

Note

For replication, use the same `authentication_webauthn_rp_id` value on all nodes if a user is expected to connect to multiple servers.

To define the relying party and load the plugin at server startup, use the `--plugin-load-add` option to name the library file that contains it, adjusting the .so suffix for your platform as necessary. With this plugin-loading method, the option must be given each time the server starts.

```
$> mysqld [options]
    --loose-authentication-webauthn-rp-id=mysql.com
    --plugin-load-add=authentication_webauthn.so
```

To define the relying party and load the plugin, put lines such as this in your `my.cnf` file, adjusting the `.so` suffix for your platform as necessary:

```
[mysqld]
plugin-load-add=authentication_webauthn.so
authentication_webauthn_rp_id=mysql.com
```

After modifying `my.cnf`, restart the server to cause the new setting to take effect.

Alternatively, to load the plugin at runtime, use this statement, adjusting the `.so` suffix for your platform as necessary:

```
INSTALL PLUGIN authentication_webauthn
  SONAME 'authentication_webauthn.so';
```

`INSTALL PLUGIN` loads the plugin immediately, and also registers it in the `mysql.plugins` system table to cause the server to load it for each subsequent normal startup without the need for `--plugin-load-add`.

To verify plugin installation, examine the Information Schema `PLUGINS` table or use the `SHOW PLUGINS` statement (see Section 7.6.2, “Obtaining Server Plugin Information”). For example:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME = 'authentication_webauthn';
+-------------------------+---------------+
| PLUGIN_NAME             | PLUGIN_STATUS |
+-------------------------+---------------+
| authentication_webauthn | ACTIVE        |
+-------------------------+---------------+
```

If a plugin fails to initialize, check the server error log for diagnostic messages.

To associate MySQL accounts with the WebAuthn authentication plugin, see Using WebAuthn Authentication.

##### Using WebAuthn Authentication

WebAuthn authentication typically is used in the context of multifactor authentication (see Section 8.2.18, “Multifactor Authentication”). This section shows how to incorporate WebAuthn device-based authentication into a multifactor account, using the `authentication_webauthn` plugin.

It is assumed in the following discussion that the server is running with the server-side WebAuthn authentication plugin enabled, as described in Installing WebAuthn Pluggable Authentication, and that the client-side WebAuthn plugin is available in the plugin directory on the client host.

Note

On Windows, WebAuthn authentication only functions if the client process runs as a user with administrator privileges. It might also be necessary to add the location of your FIDO/FIDO2 device to the client host' `PATH` environment variable.

It is also assumed that WebAuthn authentication is used in conjunction with non-WebAuthn authentication (which implies a 2FA or 3FA account). WebAuthn can also be used by itself to create 1FA accounts that authenticate in a passwordless manner. In this case, the setup process differs somewhat. For instructions, see WebAuthn Passwordless Authentication.

An account that is configured to use the `authentication_webauthn` plugin is associated with a Fast Identity Online (FIDO/FIDO2) device. Because of this, a one-time device registration step is required before WebAuthn authentication can occur. The device registration process has these characteristics:

* Any FIDO/FIDO2 device associated with an account must be registered before the account can be used.

* Registration requires that a FIDO/FIDO2 device be available on the client host, or registration fails.

* The user is expected to perform the appropriate FIDO/FIDO2 device action when prompted during registration (for example, touching the device or performing a biometric scan).

* To perform device registration, the client user must invoke the **mysql** client program and specify the `--register-factor` option to specify the factor or factors for which a device is being registered. For example, if the account is set to use WebAuthn as the second authentication factor, the user invokes **mysql** with the `--register-factor=2` option.

* If the user account is configured with the `authentication_webauthn` plugin set as the second or third factor, authentication for all preceding factors must succeed before the registration step can proceed.

* The server knows from the information in the user account whether the FIDO/FIDO2 device requires registration or has already been registered. When the client program connects, the server places the client session in sandbox mode if the device must be registered, so that registration must occur before anything else can be done. Sandbox mode used for FIDO/FIDO2 device registration is similar to that used for handling of expired passwords. See Section 8.2.16, “Server Handling of Expired Passwords”.

* In sandbox mode, no statements other than `ALTER USER` are permitted. Registration is performed using forms of this statement. When invoked with the `--register-factor` option, the **mysql** client generates the `ALTER USER` statements required to perform registration. After registration has been accomplished, the server switches the session out of sandbox mode, and the client can proceed normally. For information about the generated [`ALTER USER`](alter-user.html "15.7.1.1 ALTER USER Statement") statements, refer to the `--register-factor` description.

* When device registration has been performed for the account, the server updates the `mysql.user` system table row for that account to update the device registration status and to store the public key and credential ID. (The server does not retain the credential ID following FIDO2 device registration.)

* The registration step can be performed only by the user named by the account. If one user attempts to perform registration for another user, an error occurs.

* The user should use the same FIDO/FIDO2 device during registration and authentication. If, after registering a FIDO/FIDO2 device on the client host, the device is reset or a different device is inserted, authentication fails. In this case, the device associated with the account must be unregistered and registration must be done again.

* MySQL 9.5 supports Windows Hello authentication. The server plugin is available with MySQL Enterprise Edition only; the client plugin is available with MySQL Enterprise Edition and MySQL Community Edition. Windows 11 and later is supported.

  The `authentication_webauthn` client plugin uses the `libfido` library, which supports the concept of a “device” which can be implemented as hardware (such as a Yubikey) or as software (for example, the Windows Hello passkey store). `libfido` uses such a device to communicate with the backend passkey store and to interact with the passkeys which the store contains. Passkeys do not physically leave the backend store.

  To specify a device, use the **mysql** client `--plugin-authentication-webauthn-device=#` option. The default is the first device (`0`). The client raises an error if the device specified does not exist. This occurs, for example, if there are only two devices and the user requests a third one. The client does not perform any checks for more active devices than are needed.

  The client plugin prints the product and manufacturer names for the device prior to interacting with it.

  Only passkeys stored in the Windows Hello passkey store are currently supported by the Windows Hello device; other nonlocal passkey stores (located on other devices, possibly accessible through Windows Hello by scanning a QR code) are not supported. Passkeys stored in HSM modules or Yubikeys need to be accessed directly, rather than using the Windows Hello device.

  Stored passkey deletion from the Windows passkey store must peformed using system tools; the **mysql** client does not provide a way to delete a passkey.

Suppose that you want an account to authenticate first using the `caching_sha2_password` plugin, then using the `authentication_webauthn` plugin. Create a multifactor account using a statement like this:

```
CREATE USER 'u2'@'localhost'
  IDENTIFIED WITH caching_sha2_password
    BY 'sha2_password'
  AND IDENTIFIED WITH authentication_webauthn;
```

To connect, supply the factor 1 password to satisfy authentication for that factor, and to initiate registration of the FIDO/FIDO2 device, set the `--register-factor` to factor 2.

```
$> mysql --user=u2 --password1 --register-factor=2
Enter password: (enter factor 1 password)
Please insert FIDO device and follow the instruction. Depending on the device,
you may have to perform gesture action multiple times.
1. Perform gesture action (Skip this step if you are prompted to enter device PIN).
2. Enter PIN for token device:
3. Perform gesture action for registration to complete.
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 8
```

After the factor 1 password is accepted, the client session enters sandbox mode so that device registration can be performed for factor 2. During registration, you are prompted to perform the appropriate FIDO/FIDO2 device action, such as touching the device or performing a biometric scan.

Optionally, you can invoke the **mysql** client program and specify the `--plugin-authentication-webauthn-client-preserve-privacy` option. If the FIDO2 device contains multiple discoverable credentials (resident keys) for a given replying party (RP) ID, this option permits choosing a key to be used for assertion. By default, the option is set to `FALSE`, indicating that assertions are to be created using all resident keys for a given RP ID. When specified with this option, **mysql** prompts you for a device PIN and lists all of the available credentials for given RP ID. Select one key and then perform the remaining online instructions to complete the authentication. The example here assumes that `mysql.com` is a valid RP ID:

```
$> mysql --user=u2 --password1 --register-factor=2
     --plugin-authentication-webauthn-client-preserve-privacy
Enter password: (enter factor 1 password)
Enter PIN for token device:
Found following credentials for RP ID: mysql.com
[1]`u2`@`127.0.0.1`
[2]`u2`@`%`
Please select one(1...N):
1
Please insert FIDO device and perform gesture action for authentication to complete.
+----------------+
| CURRENT_USER() |
+----------------+
| u2@127.0.0.1   |
+----------------+
```

The `--plugin-authentication-webauthn-client-preserve-privacy` option has no effect on FIDO devices that do not support the resident-key feature.

When the registration process is complete, the connection to the server is permitted.

Note

The connection to the server is permitted following registration regardless of additional authentication factors in the account's authentication chain. For example, if the account in the preceding example was defined with a third authentication factor (using non-WebAuthn authentication), the connection would be permitted after a successful registration without authenticating the third factor. However, subsequent connections would require authenticating all three factors.

##### WebAuthn Passwordless Authentication

This section describes how WebAuthn can be used by itself to create 1FA accounts that authenticate in a passwordless manner. In this context, “passwordless” means that authentication occurs but uses a method other than a password, such as a security key or biometric scan. It does not refer to an account that uses a password-based authentication plugin for which the password is empty. That kind of “passwordless” is completely insecure and is not recommended.

The following prerequisites apply when using the `authentication_webauthn` plugin to achieve passwordless authentication:

* The user that creates a passwordless-authentication account requires the `PASSWORDLESS_USER_ADMIN` privilege in addition to the [`CREATE USER`](privileges-provided.html#priv_create-user) privilege.

* The first element of the `authentication_policy` value must be an asterisk (`*`) and not a plugin name. For example, the default `authentication_policy` value supports enabling passwordless authentication because the first element is an asterisk:

  ```
  authentication_policy='*,,'
  ```

  For information about configuring the `authentication_policy` value, see Configuring the Multifactor Authentication Policy.

To use `authentication_webauthn` as a passwordless authentication method, the account must be created with `authentication_webauthn` as the first factor authentication method. The `INITIAL AUTHENTICATION IDENTIFIED BY` clause must also be specified for the first factor (it is not supported with 2nd or 3rd factors). This clause specifies whether a randomly generated or user-specified password will be used for FIDO/FIDO2 device registration. After device registration, the server deletes the password and modifies the account to make `authentication_webauthn` the sole authentication method (the 1FA method).

The required `CREATE USER` syntax is as follows:

```
CREATE USER user
  IDENTIFIED WITH authentication_webauthn
  INITIAL AUTHENTICATION IDENTIFIED BY {RANDOM PASSWORD | 'auth_string'};
```

The following example uses the `RANDOM PASSWORD` syntax:

```
mysql> CREATE USER 'u1'@'localhost'
         IDENTIFIED WITH authentication_webauthn
         INITIAL AUTHENTICATION IDENTIFIED BY RANDOM PASSWORD;
+------+-----------+----------------------+-------------+
| user | host      | generated password   | auth_factor |
+------+-----------+----------------------+-------------+
| u1   | localhost | 9XHK]M{l2rnD;VXyHzeF |           1 |
+------+-----------+----------------------+-------------+
```

To perform registration, the user must authenticate to the server with the password associated with the `INITIAL AUTHENTICATION IDENTIFIED BY` clause, either the randomly generated password, or the `'auth_string'` value. If the account was created as just shown, the user executes this command and pastes in the preceding randomly generated password (`9XHK]M{l2rnD;VXyHzeF`) at the prompt:

```
$> mysql --user=u1 --password --register-factor=2
Enter password:
Please insert FIDO device and follow the instruction. Depending on the device,
you may have to perform gesture action multiple times.
1. Perform gesture action (Skip this step if you are prompted to enter device PIN).
2. Enter PIN for token device:
3. Perform gesture action for registration to complete.
Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 10
```

Alternatively, use the `--plugin-authentication-webauthn-client-preserve-privacy` option to select a discoverable credential for authentication.

```
$> mysql --user=u1 --password --register-factor=2
     --plugin-authentication-webauthn-client-preserve-privacy
Enter password:
Enter PIN for token device:
Found following credentials for RP ID: mysql.com
[1]`u1`@`127.0.0.1`
[2]`u1`@`%`
Please select one(1...N):
1
Please insert FIDO device and perform gesture action for authentication to complete.
+----------------+
| CURRENT_USER() |
+----------------+
| u1@127.0.0.1   |
+----------------+
```

The option `--register-factor=2` is used because the `INITIAL AUTHENTICATION IDENTIFIED BY` clause is currently acting as the first factor authentication method. The user must therefore provide the temporary password by using the second factor. On a successful registration, the server removes the temporary password and revises the account entry in the `mysql.user` system table to list `authentication_webauthn` as the sole (1FA) authentication method.

When creating a passwordless-authentication account, it is important to include the `INITIAL AUTHENTICATION IDENTIFIED BY` clause in the `CREATE USER` statement. The server accepts a statement without the clause, but the resulting account is unusable because there is no way to connect to the server to register the device. Suppose that you execute a statement like this:

```
CREATE USER 'u2'@'localhost'
  IDENTIFIED WITH authentication_webauthn;
```

Subsequent attempts to use the account to connect fail like this:

```
$> mysql --user=u2 --skip-password
mysql: [Warning] Using a password on the command line can be insecure.
No FIDO device on client host.
ERROR 1 (HY000): Unknown MySQL error
```

Note

Passwordless authentication is achieved using the Universal 2nd Factor (U2F) protocol, which does not support additional security measures such as setting a PIN on the device to be registered. It is therefore the responsibility of the device holder to ensure the device is handled in a secure manner.

##### Device Unregistration for WebAuthn

It is possible to unregister FIDO/FIDO2 devices associated with a MySQL account. This might be desirable or necessary under multiple circumstances:

* A FIDO/FIDO2 device is to be replaced with a different device. The previous device must be unregistered and the new device registered.

  In this case, the account owner or any user who has the `CREATE USER` privilege can unregister the device. The account owner can register the new device.

* A FIDO/FIDO2 device is reset or lost. Authentication attempts will fail until the current device is unregistered and a new registration is performed.

  In this case, the account owner, being unable to authenticate, cannot unregister the current device and must contact the DBA (or any user who has the `CREATE USER` privilege) to do so. Then the account owner can reregister the reset device or register a new device.

Unregistering a FIDO/FIDO2 device can be done by the account owner or by any user who has the [`CREATE USER`](create-user.html "15.7.1.3 CREATE USER Statement") privilege. Use this syntax:

```
ALTER USER user {2 | 3} FACTOR UNREGISTER;
```

To re-register a device or perform a new registration, refer to the instructions in Using WebAuthn Authentication.

##### How WebAuthn Authentication of MySQL Users Works

This section provides an overview of how MySQL and WebAuthn work together to authenticate MySQL users. For examples showing how to set up MySQL accounts to use the WebAuthn authentication plugins, see Using WebAuthn Authentication.

An account that uses WebAuthn authentication must perform an initial device registration step before it can connect to the server. After the device has been registered, authentication can proceed. WebAuthn device registration process is as follows:

1. The server sends a random challenge, user ID, and relying party ID (which uniquely identifies a server) to the client in JSON format. The relying party ID is defined by the `authentication_webauthn_rp_id` system variable. The default value is `mysql.com`.

2. The client receives that information and sends it to the client-side WebAuthn authentication plugin, which in turn provides it to the FIDO/FIDO2 device. Client also sends 1-byte capability, with RESIDENT_KEYS bit set to `ON` (if it is FIDO2 device) or `OFF`.

3. After the user has performed the appropriate device action (for example, touching the device or performing a biometric scan) the FIDO/FIDO2 device generates a public/private key pair, a key handle, an X.509 certificate, and a signature, which is returned to the server.

4. The server-side WebAuthn authentication plugin verifies the signature. With successful verification, the server stores the credential ID (for FIDO devices only) and public key in the `mysql.user` system table.

After registration has been performed successfully, WebAuthn authentication follows this process:

1. The server sends a random challenge, user ID, relying party ID and credentials to the client. The challenge is converted to URL-safe Base64 format.

2. The client sends the same information to the device. The client queries the device to check if it supports Client-to-Authenticator Protocols (CTAP2) protocol. CTAP2 support indicates that the device is FIDO2-protocol aware.

3. The FIDO/FIDO2 device prompts the user to perform the appropriate device action, based on the selection made during registration.

   If the device is FIDO2-protocol aware, the device signs with all private keys available in the device for a given RP ID. Optionally, it may prompt user to pick one from the list as well. If the device is not FIDO2 capable, it fetches the right private key.

4. This action unlocks the private key and the challenge is signed.

5. This signed challenge is returned to the server.
6. The server-side WebAuthn authentication plugin verifies the signature with the public key and responds to indicate authentication success or failure.


#### 8.4.1.12 Test Pluggable Authentication

MySQL includes a test plugin that checks account credentials and logs success or failure to the server error log. This is a loadable plugin (not built in) and must be installed prior to use.

The test plugin source code is separate from the server source, unlike the built-in native plugin, so it can be examined as a relatively simple example demonstrating how to write a loadable authentication plugin.

Note

This plugin is intended for testing and development purposes, and is not for use in production environments or on servers that are exposed to public networks.

The following table shows the plugin and library file names. The file name suffix might differ on your system. The file must be located in the directory named by the `plugin_dir` system variable.

**Table 8.27 Plugin and Library Names for Test Authentication**

<table summary="Names for the plugins and library file used for test password authentication."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Server-side plugin</td> <td><code>test_plugin_server</code></td> </tr><tr> <td>Client-side plugin</td> <td><code>auth_test_plugin</code></td> </tr><tr> <td>Library file</td> <td><code>auth_test_plugin.so</code></td> </tr></tbody></table>

The following sections provide installation and usage information specific to test pluggable authentication:

* Installing Test Pluggable Authentication
* Uninstalling Test Pluggable Authentication
* Using Test Pluggable Authentication

For general information about pluggable authentication in MySQL, see Section 8.2.17, “Pluggable Authentication”.

##### Installing Test Pluggable Authentication

This section describes how to install the server-side test authentication plugin. For general information about installing plugins, see Section 7.6.1, “Installing and Uninstalling Plugins”.

To be usable by the server, the plugin library file must be located in the MySQL plugin directory (the directory named by the `plugin_dir` system variable). If necessary, configure the plugin directory location by setting the value of `plugin_dir` at server startup.

To load the plugin at server startup, use the `--plugin-load-add` option to name the library file that contains it. With this plugin-loading method, the option must be given each time the server starts. For example, put these lines in the server `my.cnf` file, adjusting the `.so` suffix for your platform as necessary:

```
[mysqld]
plugin-load-add=auth_test_plugin.so
```

After modifying `my.cnf`, restart the server to cause the new settings to take effect.

Alternatively, to load the plugin at runtime, use this statement, adjusting the `.so` suffix for your platform as necessary:

```
INSTALL PLUGIN test_plugin_server SONAME 'auth_test_plugin.so';
```

`INSTALL PLUGIN` loads the plugin immediately, and also registers it in the `mysql.plugins` system table to cause the server to load it for each subsequent normal startup without the need for `--plugin-load-add`.

To verify plugin installation, examine the Information Schema `PLUGINS` table or use the `SHOW PLUGINS` statement (see Section 7.6.2, “Obtaining Server Plugin Information”). For example:

```
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

  ```
  UNINSTALL PLUGIN test_plugin_server;
  ```

##### Using Test Pluggable Authentication

To use the test authentication plugin, create an account and name that plugin in the `IDENTIFIED WITH` clause:

```
CREATE USER 'testuser'@'localhost'
IDENTIFIED WITH test_plugin_server
BY 'testpassword';
```

The test authentication plugin also requires creating a proxy user as follows:

```
CREATE USER testpassword@localhost;
GRANT PROXY ON testpassword@localhost TO testuser@localhost;
```

Then provide the `--user` and `--password` options for that account when you connect to the server. For example:

```
$> mysql --user=testuser --password
Enter password: testpassword
```

The plugin fetches the password as received from the client and compares it with the value stored in the `authentication_string` column of the account row in the `mysql.user` system table. If the two values match, the plugin returns the `authentication_string` value as the new effective user ID.

You can look in the server error log for a message indicating whether authentication succeeded (notice that the password is reported as the “user”):

```
[Note] Plugin test_plugin_server reported:
'successfully authenticated user testpassword'
```


#### 8.4.1.13 Pluggable Authentication System Variables

These variables are unavailable unless the appropriate server-side plugin is installed:

* `authentication_ldap_sasl` for system variables with names of the form `authentication_ldap_sasl_xxx`

* `authentication_ldap_simple` for system variables with names of the form `authentication_ldap_simple_xxx`

**Table 8.28 Authentication Plugin System Variable Summary**

<table frame="box" rules="all" summary="Reference for authentication plugin system variables."><col style="width: 20%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><thead><tr><th scope="col">Name</th> <th scope="col">Cmd-Line</th> <th scope="col">Option File</th> <th scope="col">System Var</th> <th scope="col">Status Var</th> <th scope="col">Var Scope</th> <th scope="col">Dynamic</th> </tr></thead><tbody><tr><th scope="row">authentication_kerberos_service_key_tab</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">authentication_kerberos_service_principal</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_sasl_auth_method_name</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_sasl_bind_base_dn</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_sasl_bind_root_dn</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_sasl_bind_root_pwd</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_sasl_ca_path</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_sasl_connect_timeout</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_sasl_group_search_attr</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_sasl_group_search_filter</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_sasl_init_pool_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_sasl_log_status</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_sasl_max_pool_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_sasl_referral</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_sasl_response_timeout</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_sasl_server_host</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_sasl_server_port</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_sasl_tls</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_sasl_user_search_attr</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_simple_auth_method_name</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_simple_bind_base_dn</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_simple_bind_root_dn</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_simple_bind_root_pwd</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_simple_ca_path</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_simple_connect_timeout</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_simple_group_search_attr</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_simple_group_search_filter</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_simple_init_pool_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_simple_log_status</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_simple_max_pool_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_simple_referral</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_simple_response_timeout</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_simple_server_host</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_simple_server_port</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_simple_tls</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_ldap_simple_user_search_attr</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_openid_connect_configuration</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_policy</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_webauthn_rp_id</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">authentication_windows_log_level</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">authentication_windows_use_principal_name</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr></tbody></table>

* `authentication_kerberos_service_key_tab`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_key_tab"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_key_tab</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>datadir/mysql.keytab</code></td> </tr></tbody></table>

  The name of the server-side key-table (“keytab”) file containing Kerberos service keys to authenticate MySQL service tickets received from clients. The file name should be given as an absolute path name. If this variable is not set, the default is `mysql.keytab` in the data directory.

  The file must exist and contain a valid key for the service principal name (SPN) or authentication of clients will fail. (The SPN and same key also must be created in the Kerberos server.) The file may contain multiple service principal names and their respective key combinations.

  The file must be generated by the Kerberos server administrator and be copied to a location accessible by the MySQL server. The file can be validated to make sure that it is correct and was copied properly using this command:

  ```
  klist -k file_name
  ```

  For information about keytab files, see <https://web.mit.edu/kerberos/krb5-latest/doc/basic/keytab_def.html>.

* `authentication_kerberos_service_principal`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_principal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-principal=name</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_principal</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>mysql/host_name@realm_name</code></td> </tr></tbody></table>

  The Kerberos service principal name (SPN) that the MySQL server sends to clients.

  The value is composed from the service name (`mysql`), a host name, and a realm name. The default value is `mysql/host_name@realm_name`. The realm in the service principal name enables retrieving the exact service key.

  To use a nondefault value, set the value using the same format. For example, to use a host name of `krbauth.example.com` and a realm of `MYSQL.LOCAL`, set `authentication_kerberos_service_principal` to `mysql/krbauth.example.com@MYSQL.LOCAL`.

  The service principal name and service key must already be present in the database managed by the KDC server.

  There can be service principal names that differ only by realm name.

* `authentication_ldap_sasl_auth_method_name`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>SCRAM-SHA-256</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>SCRAM-SHA-1</code></p><p class="valid-value"><code>SCRAM-SHA-256</code></p><p class="valid-value"><code>GSSAPI</code></p></td> </tr></tbody></table>

  For SASL LDAP authentication, the authentication method name. Communication between the authentication plugin and the LDAP server occurs according to this authentication method to ensure password security.

  These authentication method values are permitted:

  + `SCRAM-SHA-1`: Use a SASL challenge-response mechanism.

    The client-side `authentication_ldap_sasl_client` plugin communicates with the SASL server, using the password to create a challenge and obtain a SASL request buffer, then passes this buffer to the server-side `authentication_ldap_sasl` plugin. The client-side and server-side SASL LDAP plugins use SASL messages for secure transmission of credentials within the LDAP protocol, to avoid sending the cleartext password between the MySQL client and server.

    `SCRAM-SHA-1` is deprecated as of MySQL 9.5.0, and subject to removal in a future MySQL release.

  + `SCRAM-SHA-256`: Use a SASL challenge-response mechanism.

    This method is similar to `SCRAM-SHA-1`, but is more secure. It requires an OpenLDAP server built using Cyrus SASL 2.1.27 or higher.

    `SCRAM-SHA-256` is the default value as of MySQL 9.5.0.

  + `GSSAPI`: Use Kerberos, a passwordless and ticket-based protocol.

    GSSAPI/Kerberos is supported as an authentication method for MySQL clients and servers only on Linux. It is useful in Linux environments where applications access LDAP using Microsoft Active Directory, which has Kerberos enabled by default.

    The client-side `authentication_ldap_sasl_client` plugin obtains a service ticket using the ticket-granting ticket (TGT) from Kerberos, but does not use LDAP services directly. The server-side `authentication_ldap_sasl` plugin routes Kerberos messages between the client-side plugin and the LDAP server. Using the credentials thus obtained, the server-side plugin then communicates with the LDAP server to interpret LDAP authentication messages and retrieve LDAP groups.

* `authentication_ldap_sasl_bind_base_dn`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_base_dn"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-bind-base-dn=value</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_bind_base_dn</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>

  For SASL LDAP authentication, the base distinguished name (DN). This variable can be used to limit the scope of searches by anchoring them at a certain location (the “base”) within the search tree.

  Suppose that members of one set of LDAP user entries each have this form:

  ```
  uid=user_name,ou=People,dc=example,dc=com
  ```

  And that members of another set of LDAP user entries each have this form:

  ```
  uid=user_name,ou=Admin,dc=example,dc=com
  ```

  Then searches work like this for different base DN values:

  + If the base DN is `ou=People,dc=example,dc=com`: Searches find user entries only in the first set.

  + If the base DN is `ou=Admin,dc=example,dc=com`: Searches find user entries only in the second set.

  + If the base DN is `ou=dc=example,dc=com`: Searches find user entries in the first or second set.

  In general, more specific base DN values result in faster searches because they limit the search scope more.

* `authentication_ldap_sasl_bind_root_dn`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_root_dn"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-bind-root-dn=value</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_bind_root_dn</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>

  For SASL LDAP authentication, the root distinguished name (DN). This variable is used in conjunction with `authentication_ldap_sasl_bind_root_pwd` as the credentials for authenticating to the LDAP server for the purpose of performing searches. Authentication uses either one or two LDAP bind operations, depending on whether the MySQL account names an LDAP user DN:

  + If the account does not name a user DN: `authentication_ldap_sasl` performs an initial LDAP binding using `authentication_ldap_sasl_bind_root_dn` and `authentication_ldap_sasl_bind_root_pwd`. (These are both empty by default, so if they are not set, the LDAP server must permit anonymous connections.) The resulting bind LDAP handle is used to search for the user DN, based on the client user name. `authentication_ldap_sasl` performs a second bind using the user DN and client-supplied password.

  + If the account does name a user DN: The first bind operation is unnecessary in this case. `authentication_ldap_sasl` performs a single bind using the user DN and client-supplied password. This is faster than if the MySQL account does not specify an LDAP user DN.

* `authentication_ldap_sasl_bind_root_pwd`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_bind_root_pwd"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-bind-root-pwd=value</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_bind_root_pwd</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>

  For SASL LDAP authentication, the password for the root distinguished name. This variable is used in conjunction with `authentication_ldap_sasl_bind_root_dn`. See the description of that variable.

* `authentication_ldap_sasl_ca_path`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_ca_path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-ca-path=value</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_ca_path</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>NULL</code></td> </tr></tbody></table>

  For SASL LDAP authentication, the absolute path of the certificate authority file. Specify this file if it is desired that the authentication plugin perform verification of the LDAP server certificate.

  Note

  In addition to setting the `authentication_ldap_sasl_ca_path` variable to the file name, you must add the appropriate certificate authority certificates to the file and enable the `authentication_ldap_sasl_tls` system variable. These variables can be set to override the default OpenLDAP TLS configuration; see LDAP Pluggable Authentication and ldap.conf

* `authentication_ldap_sasl_connect_timeout`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_connect_timeout"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-connect-timeout=#</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_connect_timeout</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>30</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>31536000</code></td> </tr><tr><th>Unit</th> <td>seconds</td> </tr></tbody></table>

  Specifies the time (in seconds) that MySQL server waits to connect to the LDAP server using TCP.

  When a MySQL account authenticates using LDAP, MySQL server attempts to establish a TCP connection with the LDAP server, which it uses to send an LDAP bind request over the connection. If the LDAP server does not respond to TCP handshake after a configured amount of time, MySQL abandons the TCP handshake attempt and emits an error message. If the timeout setting is zero, MySQL server ignores this system variable setting. For more information, see Setting Timeouts for LDAP Pluggable Authentication.

  Note

  If you set this variable to a timeout value that is greater than the host system's default value, the shorter system timeout is used.

* `authentication_ldap_sasl_group_search_attr`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_group_search_attr"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-group-search-attr=value</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_group_search_attr</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>cn</code></td> </tr></tbody></table>

  For SASL LDAP authentication, the name of the attribute that specifies group names in LDAP directory entries. If `authentication_ldap_sasl_group_search_attr` has its default value of `cn`, searches return the `cn` value as the group name. For example, if an LDAP entry with a `uid` value of `user1` has a `cn` attribute of `mygroup`, searches for `user1` return `mygroup` as the group name.

  This variable should be the empty string if you want no group or proxy authentication.

  If the group search attribute is `isMemberOf`, LDAP authentication directly retrieves the user attribute `isMemberOf` value and assigns it as group information. If the group search attribute is not `isMemberOf`, LDAP authentication searches for all groups where the user is a member. (The latter is the default behavior.) This behavior is based on how LDAP group information can be stored two ways: 1) A group entry can have an attribute named `memberUid` or `member` with a value that is a user name; 2) A user entry can have an attribute named `isMemberOf` with values that are group names.

* `authentication_ldap_sasl_group_search_filter`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_key_tab"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_key_tab</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>datadir/mysql.keytab</code></td> </tr></tbody></table>0

  For SASL LDAP authentication, the custom group search filter.

  The search filter value can contain `{UA}` and `{UD}` notation to represent the user name and the full user DN. For example, `{UA}` is replaced with a user name such as `"admin"`, whereas `{UD}` is replaced with a use full DN such as `"uid=admin,ou=People,dc=example,dc=com"`. The following value is the default, which supports both OpenLDAP and Active Directory:

  ```
  (|(&(objectClass=posixGroup)(memberUid={UA}))
    (&(objectClass=group)(member={UD})))
  ```

  In some cases for the user scenario, `memberOf` is a simple user attribute that holds no group information. For additional flexibility, an optional `{GA}` prefix can be used with the group search attribute. Any group attribute with a {GA} prefix is treated as a user attribute having group names. For example, with a value of `{GA}MemberOf`, if the group value is the DN, the first attribute value from the group DN is returned as the group name.

* `authentication_ldap_sasl_init_pool_size`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_key_tab"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_key_tab</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>datadir/mysql.keytab</code></td> </tr></tbody></table>1

  For SASL LDAP authentication, the initial size of the pool of connections to the LDAP server. Choose the value for this variable based on the average number of concurrent authentication requests to the LDAP server.

  The plugin uses `authentication_ldap_sasl_init_pool_size` and `authentication_ldap_sasl_max_pool_size` together for connection-pool management:

  + When the authentication plugin initializes, it creates `authentication_ldap_sasl_init_pool_size` connections, unless `authentication_ldap_sasl_max_pool_size=0` to disable pooling.

  + If the plugin receives an authentication request when there are no free connections in the current connection pool, the plugin can create a new connection, up to the maximum connection pool size given by `authentication_ldap_sasl_max_pool_size`.

  + If the plugin receives a request when the pool size is already at its maximum and there are no free connections, authentication fails.

  + When the plugin unloads, it closes all pooled connections.

  Changes to plugin system variable settings may have no effect on connections already in the pool. For example, modifying the LDAP server host, port, or TLS settings does not affect existing connections. However, if the original variable values were invalid and the connection pool could not be initialized, the plugin attempts to reinitialize the pool for the next LDAP request. In this case, the new system variable values are used for the reinitialization attempt.

  If `authentication_ldap_sasl_max_pool_size=0` to disable pooling, each LDAP connection opened by the plugin uses the values the system variables have at that time.

* `authentication_ldap_sasl_log_status`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_key_tab"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_key_tab</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>datadir/mysql.keytab</code></td> </tr></tbody></table>2

  For SASL LDAP authentication, the logging level for messages written to the error log. The following table shows the permitted level values and their meanings.

  **Table 8.29 Log Levels for authentication_ldap_sasl_log_status**

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_key_tab"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_key_tab</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>datadir/mysql.keytab</code></td> </tr></tbody></table>3

  On the client side, messages can be logged to the standard output by setting the `AUTHENTICATION_LDAP_CLIENT_LOG` environment variable. The permitted and default values are the same as for `authentication_ldap_sasl_log_status`.

  The `AUTHENTICATION_LDAP_CLIENT_LOG` environment variable applies only to SASL LDAP authentication. It has no effect for simple LDAP authentication because the client plugin in that case is `mysql_clear_password`, which knows nothing about LDAP operations.

* `authentication_ldap_sasl_max_pool_size`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_key_tab"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_key_tab</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>datadir/mysql.keytab</code></td> </tr></tbody></table>4

  For SASL LDAP authentication, the maximum size of the pool of connections to the LDAP server. To disable connection pooling, set this variable to 0.

  This variable is used in conjunction with `authentication_ldap_sasl_init_pool_size`. See the description of that variable.

* `authentication_ldap_sasl_referral`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_key_tab"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_key_tab</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>datadir/mysql.keytab</code></td> </tr></tbody></table>5

  For SASL LDAP authentication, whether to enable LDAP search referral. See LDAP Search Referral.

  This variable can be set to override the default OpenLDAP referral configuration; see LDAP Pluggable Authentication and ldap.conf

* `authentication_ldap_sasl_response_timeout`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_key_tab"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_key_tab</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>datadir/mysql.keytab</code></td> </tr></tbody></table>6

  Specifies the time (in seconds) that MySQL server waits for the LDAP server to response to an LDAP bind request.

  When a MySQL account authenticates using LDAP, MySQL server sends an LDAP bind request to the LDAP server. If the LDAP server does not respond to the request after a configured amount of time, MySQL abandons the request and emits an error message. If the timeout setting is zero, MySQL server ignores this system variable setting. For more information, see Setting Timeouts for LDAP Pluggable Authentication.

* `authentication_ldap_sasl_server_host`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_key_tab"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_key_tab</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>datadir/mysql.keytab</code></td> </tr></tbody></table>7

  The LDAP server host for SASL LDAP authentication; this can be a host name or IP address.

* `authentication_ldap_sasl_server_port`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_key_tab"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_key_tab</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>datadir/mysql.keytab</code></td> </tr></tbody></table>8

  For SASL LDAP authentication, the LDAP server TCP/IP port number.

  If the LDAP port number is configured as 636 or 3269, the plugin uses LDAPS (LDAP over SSL) instead of LDAP. (LDAPS differs from `startTLS`.)

* `authentication_ldap_sasl_tls`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_key_tab"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-key-tab=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_key_tab</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>datadir/mysql.keytab</code></td> </tr></tbody></table>9

  For SASL LDAP authentication, whether connections by the plugin to the LDAP server are secure. If this variable is enabled, the plugin uses TLS to connect securely to the LDAP server. This variable can be set to override the default OpenLDAP TLS configuration; see LDAP Pluggable Authentication and ldap.conf If you enable this variable, you may also wish to set the `authentication_ldap_sasl_ca_path` variable.

  MySQL LDAP plugins support the StartTLS method, which initializes TLS on top of a plain LDAP connection.

  LDAPS can be used by setting the `authentication_ldap_sasl_server_port` system variable.

* `authentication_ldap_sasl_user_search_attr`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_principal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-principal=name</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_principal</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>mysql/host_name@realm_name</code></td> </tr></tbody></table>0

  For SASL LDAP authentication, the name of the attribute that specifies user names in LDAP directory entries. If a user distinguished name is not provided, the authentication plugin searches for the name using this attribute. For example, if the `authentication_ldap_sasl_user_search_attr` value is `uid`, a search for the user name `user1` finds entries with a `uid` value of `user1`.

* `authentication_ldap_simple_auth_method_name`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_principal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-principal=name</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_principal</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>mysql/host_name@realm_name</code></td> </tr></tbody></table>1

  For simple LDAP authentication, the authentication method name. Communication between the authentication plugin and the LDAP server occurs according to this authentication method.

  Note

  For all simple LDAP authentication methods, it is recommended to also set TLS parameters to require that communication with the LDAP server take place over secure connections.

  These authentication method values are permitted:

  + `SIMPLE`: Use simple LDAP authentication. This method uses either one or two LDAP bind operations, depending on whether the MySQL account names an LDAP user distinguished name. See the description of `authentication_ldap_simple_bind_root_dn`.

  + `AD-FOREST`: A variation on `SIMPLE`, such that authentication searches all domains in the Active Directory forest, performing an LDAP bind to each Active Directory domain until the user is found in some domain.

* `authentication_ldap_simple_bind_base_dn`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_principal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-principal=name</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_principal</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>mysql/host_name@realm_name</code></td> </tr></tbody></table>2

  For simple LDAP authentication, the base distinguished name (DN). This variable can be used to limit the scope of searches by anchoring them at a certain location (the “base”) within the search tree.

  Suppose that members of one set of LDAP user entries each have this form:

  ```
  uid=user_name,ou=People,dc=example,dc=com
  ```

  And that members of another set of LDAP user entries each have this form:

  ```
  uid=user_name,ou=Admin,dc=example,dc=com
  ```

  Then searches work like this for different base DN values:

  + If the base DN is `ou=People,dc=example,dc=com`: Searches find user entries only in the first set.

  + If the base DN is `ou=Admin,dc=example,dc=com`: Searches find user entries only in the second set.

  + If the base DN is `ou=dc=example,dc=com`: Searches find user entries in the first or second set.

  In general, more specific base DN values result in faster searches because they limit the search scope more.

* `authentication_ldap_simple_bind_root_dn`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_principal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-principal=name</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_principal</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>mysql/host_name@realm_name</code></td> </tr></tbody></table>3

  For simple LDAP authentication, the root distinguished name (DN). This variable is used in conjunction with `authentication_ldap_simple_bind_root_pwd` as the credentials for authenticating to the LDAP server for the purpose of performing searches. Authentication uses either one or two LDAP bind operations, depending on whether the MySQL account names an LDAP user DN:

  + If the account does not name a user DN: `authentication_ldap_simple` performs an initial LDAP binding using `authentication_ldap_simple_bind_root_dn` and `authentication_ldap_simple_bind_root_pwd`. (These are both empty by default, so if they are not set, the LDAP server must permit anonymous connections.) The resulting bind LDAP handle is used to search for the user DN, based on the client user name. `authentication_ldap_simple` performs a second bind using the user DN and client-supplied password.

  + If the account does name a user DN: The first bind operation is unnecessary in this case. `authentication_ldap_simple` performs a single bind using the user DN and client-supplied password. This is faster than if the MySQL account does not specify an LDAP user DN.

* `authentication_ldap_simple_bind_root_pwd`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_principal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-principal=name</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_principal</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>mysql/host_name@realm_name</code></td> </tr></tbody></table>4

  For simple LDAP authentication, the password for the root distinguished name. This variable is used in conjunction with `authentication_ldap_simple_bind_root_dn`. See the description of that variable.

* `authentication_ldap_simple_ca_path`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_principal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-principal=name</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_principal</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>mysql/host_name@realm_name</code></td> </tr></tbody></table>5

  For simple LDAP authentication, the absolute path of the certificate authority file. Specify this file if it is desired that the authentication plugin perform verification of the LDAP server certificate.

  Note

  In addition to setting the `authentication_ldap_simple_ca_path` variable to the file name, you must add the appropriate certificate authority certificates to the file and enable the `authentication_ldap_simple_tls` system variable. These variables can be set to override the default OpenLDAP TLS configuration; see LDAP Pluggable Authentication and ldap.conf

* `authentication_ldap_simple_connect_timeout`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_principal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-principal=name</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_principal</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>mysql/host_name@realm_name</code></td> </tr></tbody></table>6

  Specifies the time (in seconds) that MySQL server waits to connect to the LDAP server using TCP.

  When a MySQL account authenticates using LDAP, MySQL server attempts to establish a TCP connection with the LDAP server, which it uses to send an LDAP bind request over the connection. If the LDAP server does not respond to TCP handshake after a configured amount of time, MySQL abandons the TCP handshake attempt and emits an error message. If the timeout setting is zero, MySQL server ignores this system variable setting. For more information, see Setting Timeouts for LDAP Pluggable Authentication.

  Note

  If you set this variable to a timeout value that is greater than the host system's default value, the shorter system timeout is used.

* `authentication_ldap_simple_group_search_attr`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_principal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-principal=name</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_principal</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>mysql/host_name@realm_name</code></td> </tr></tbody></table>7

  For simple LDAP authentication, the name of the attribute that specifies group names in LDAP directory entries. If `authentication_ldap_simple_group_search_attr` has its default value of `cn`, searches return the `cn` value as the group name. For example, if an LDAP entry with a `uid` value of `user1` has a `cn` attribute of `mygroup`, searches for `user1` return `mygroup` as the group name.

  If the group search attribute is `isMemberOf`, LDAP authentication directly retrieves the user attribute `isMemberOf` value and assigns it as group information. If the group search attribute is not `isMemberOf`, LDAP authentication searches for all groups where the user is a member. (The latter is the default behavior.) This behavior is based on how LDAP group information can be stored two ways: 1) A group entry can have an attribute named `memberUid` or `member` with a value that is a user name; 2) A user entry can have an attribute named `isMemberOf` with values that are group names.

* `authentication_ldap_simple_group_search_filter`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_principal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-principal=name</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_principal</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>mysql/host_name@realm_name</code></td> </tr></tbody></table>8

  For simple LDAP authentication, the custom group search filter.

  The search filter value can contain `{UA}` and `{UD}` notation to represent the user name and the full user DN. For example, `{UA}` is replaced with a user name such as `"admin"`, whereas `{UD}` is replaced with a use full DN such as `"uid=admin,ou=People,dc=example,dc=com"`. The following value is the default, which supports both OpenLDAP and Active Directory:

  ```
  (|(&(objectClass=posixGroup)(memberUid={UA}))
    (&(objectClass=group)(member={UD})))
  ```

  In some cases for the user scenario, `memberOf` is a simple user attribute that holds no group information. For additional flexibility, an optional `{GA}` prefix can be used with the group search attribute. Any group attribute with a {GA} prefix is treated as a user attribute having group names. For example, with a value of `{GA}MemberOf`, if the group value is the DN, the first attribute value from the group DN is returned as the group name.

* `authentication_ldap_simple_init_pool_size`

  <table frame="box" rules="all" summary="Properties for authentication_kerberos_service_principal"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-kerberos-service-principal=name</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_kerberos_service_principal</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>mysql/host_name@realm_name</code></td> </tr></tbody></table>9

  For simple LDAP authentication, the initial size of the pool of connections to the LDAP server. Choose the value for this variable based on the average number of concurrent authentication requests to the LDAP server.

  The plugin uses `authentication_ldap_simple_init_pool_size` and `authentication_ldap_simple_max_pool_size` together for connection-pool management:

  + When the authentication plugin initializes, it creates `authentication_ldap_simple_init_pool_size` connections, unless `authentication_ldap_simple_max_pool_size=0` to disable pooling.

  + If the plugin receives an authentication request when there are no free connections in the current connection pool, the plugin can create a new connection, up to the maximum connection pool size given by `authentication_ldap_simple_max_pool_size`.

  + If the plugin receives a request when the pool size is already at its maximum and there are no free connections, authentication fails.

  + When the plugin unloads, it closes all pooled connections.

  Changes to plugin system variable settings may have no effect on connections already in the pool. For example, modifying the LDAP server host, port, or TLS settings does not affect existing connections. However, if the original variable values were invalid and the connection pool could not be initialized, the plugin attempts to reinitialize the pool for the next LDAP request. In this case, the new system variable values are used for the reinitialization attempt.

  If `authentication_ldap_simple_max_pool_size=0` to disable pooling, each LDAP connection opened by the plugin uses the values the system variables have at that time.

* `authentication_ldap_simple_log_status`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>SCRAM-SHA-256</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>SCRAM-SHA-1</code></p><p class="valid-value"><code>SCRAM-SHA-256</code></p><p class="valid-value"><code>GSSAPI</code></p></td> </tr></tbody></table>0

  For simple LDAP authentication, the logging level for messages written to the error log. The following table shows the permitted level values and their meanings.

  **Table 8.30 Log Levels for authentication_ldap_simple_log_status**

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>SCRAM-SHA-256</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>SCRAM-SHA-1</code></p><p class="valid-value"><code>SCRAM-SHA-256</code></p><p class="valid-value"><code>GSSAPI</code></p></td> </tr></tbody></table>1

* `authentication_ldap_simple_max_pool_size`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>SCRAM-SHA-256</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>SCRAM-SHA-1</code></p><p class="valid-value"><code>SCRAM-SHA-256</code></p><p class="valid-value"><code>GSSAPI</code></p></td> </tr></tbody></table>2

  For simple LDAP authentication, the maximum size of the pool of connections to the LDAP server. To disable connection pooling, set this variable to 0.

  This variable is used in conjunction with `authentication_ldap_simple_init_pool_size`. See the description of that variable.

* `authentication_ldap_simple_referral`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>SCRAM-SHA-256</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>SCRAM-SHA-1</code></p><p class="valid-value"><code>SCRAM-SHA-256</code></p><p class="valid-value"><code>GSSAPI</code></p></td> </tr></tbody></table>3

  For simple LDAP authentication, whether to enable LDAP search referral. See LDAP Search Referral.

* `authentication_ldap_simple_response_timeout`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>SCRAM-SHA-256</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>SCRAM-SHA-1</code></p><p class="valid-value"><code>SCRAM-SHA-256</code></p><p class="valid-value"><code>GSSAPI</code></p></td> </tr></tbody></table>4

  Specifies the time (in seconds) that MySQL server waits for the LDAP server to response to an LDAP bind request.

  When a MySQL account authenticates using LDAP, MySQL server sends an LDAP bind request to the LDAP server. If the LDAP server does not respond to the request after a configured amount of time, MySQL abandons the request and emits an error message. If the timeout setting is zero, MySQL server ignores this system variable setting. For more information, see Setting Timeouts for LDAP Pluggable Authentication.

* `authentication_ldap_simple_server_host`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>SCRAM-SHA-256</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>SCRAM-SHA-1</code></p><p class="valid-value"><code>SCRAM-SHA-256</code></p><p class="valid-value"><code>GSSAPI</code></p></td> </tr></tbody></table>5

  For simple LDAP authentication, the LDAP server host. The permitted values for this variable depend on the authentication method:

  + For `authentication_ldap_simple_auth_method_name=SIMPLE`: The LDAP server host can be a host name or IP address.

  + For `authentication_ldap_simple_auth_method_name=AD-FOREST`. The LDAP server host can be an Active Directory domain name. For example, for an LDAP server URL of `ldap://example.mem.local:389`, the domain name can be `mem.local`.

    An Active Directory forest setup can have multiple domains (LDAP server IPs), which can be discovered using DNS. On Unix and Unix-like systems, some additional setup may be required to configure your DNS server with SRV records that specify the LDAP servers for the Active Directory domain. For information about DNS SRV, see [RFC 2782](https://tools.ietf.org/html/rfc2782).

    Suppose that your configuration has these properties:

    - The name server that provides information about Active Directory domains has IP address `10.172.166.100`.

    - The LDAP servers have names `ldap1.mem.local` through `ldap3.mem.local` and IP addresses `10.172.166.101` through `10.172.166.103`.

    You want the LDAP servers to be discoverable using SRV searches. For example, at the command line, a command like this should list the LDAP servers:

    ```
    host -t SRV _ldap._tcp.mem.local
    ```

    Perform the DNS configuration as follows:

    1. Add a line to `/etc/resolv.conf` to specify the name server that provides information about Active Directory domains:

       ```
       nameserver 10.172.166.100
       ```

    2. Configure the appropriate zone file for the name server with SRV records for the LDAP servers:

       ```
       _ldap._tcp.mem.local. 86400 IN SRV 0 100 389 ldap1.mem.local.
       _ldap._tcp.mem.local. 86400 IN SRV 0 100 389 ldap2.mem.local.
       _ldap._tcp.mem.local. 86400 IN SRV 0 100 389 ldap3.mem.local.
       ```

    3. It may also be necessary to specify the IP address for the LDAP servers in `/etc/hosts` if the server host cannot be resolved. For example, add lines like this to the file:

       ```
       10.172.166.101 ldap1.mem.local
       10.172.166.102 ldap2.mem.local
       10.172.166.103 ldap3.mem.local
       ```

    With the DNS configured as just described, the server-side LDAP plugin can discover the LDAP servers and tries to authenticate in all domains until authentication succeeds or there are no more servers.

    Windows needs no such settings as just described. Given the LDAP server host in the `authentication_ldap_simple_server_host` value, the Windows LDAP library searches all domains and attempts to authenticate.

* `authentication_ldap_simple_server_port`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>SCRAM-SHA-256</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>SCRAM-SHA-1</code></p><p class="valid-value"><code>SCRAM-SHA-256</code></p><p class="valid-value"><code>GSSAPI</code></p></td> </tr></tbody></table>6

  For simple LDAP authentication, the LDAP server TCP/IP port number.

  If the LDAP port number is configured as 636 or 3269, the plugin uses LDAPS (LDAP over SSL) instead of LDAP. (LDAPS differs from `startTLS`.)

* `authentication_ldap_simple_tls`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>SCRAM-SHA-256</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>SCRAM-SHA-1</code></p><p class="valid-value"><code>SCRAM-SHA-256</code></p><p class="valid-value"><code>GSSAPI</code></p></td> </tr></tbody></table>7

  For simple LDAP authentication, whether connections by the plugin to the LDAP server are secure. If this variable is enabled, the plugin uses TLS to connect securely to the LDAP server. This variable can be set to override the default OpenLDAP TLS configuration; see LDAP Pluggable Authentication and ldap.conf If you enable this variable, you may also wish to set the `authentication_ldap_simple_ca_path` variable.

  MySQL LDAP plugins support the StartTLS method, which initializes TLS on top of a plain LDAP connection.

  LDAPS can be used by setting the `authentication_ldap_simple_server_port` system variable.

* `authentication_ldap_simple_user_search_attr`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>SCRAM-SHA-256</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>SCRAM-SHA-1</code></p><p class="valid-value"><code>SCRAM-SHA-256</code></p><p class="valid-value"><code>GSSAPI</code></p></td> </tr></tbody></table>8

  For simple LDAP authentication, the name of the attribute that specifies user names in LDAP directory entries. If a user distinguished name is not provided, the authentication plugin searches for the name using this attribute. For example, if the `authentication_ldap_simple_user_search_attr` value is `uid`, a search for the user name `user1` finds entries with a `uid` value of `user1`.

* `authentication_webauthn_rp_id`

  <table frame="box" rules="all" summary="Properties for authentication_ldap_sasl_auth_method_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-ldap-sasl-auth-method-name=value</code></td> </tr><tr><th>System Variable</th> <td><code>authentication_ldap_sasl_auth_method_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>SCRAM-SHA-256</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>SCRAM-SHA-1</code></p><p class="valid-value"><code>SCRAM-SHA-256</code></p><p class="valid-value"><code>GSSAPI</code></p></td> </tr></tbody></table>9

  This variable specifies the relying party ID used for server-side plugin installation, device registration, and WebAuthn authentication. If WebAuthn authentication is attempted and this value is not the one expected by the device, the device assumes that it is not talking to the correct server and an error occurs. The maximum value length is 255 characters.


### 8.4.2 The Connection Control Component

The Connection Control component for MySQL (`component_connection_control`) makes it possible to introduce an increasing delay in the MySQL server's response to connection attempts after an arbitrary number of consecutive failed attempts. This capability provides a deterrent that slows down brute force attacks against MySQL user accounts.

* Purpose: Monitor failed connection attempts; add a delay in the response to an account with an excessive number of attempts.

* URN: `file://component_connection_control`

`component_connection_control` was introduced in MySQL 9.2.0 as a single replacement for both Connection Control plugins, which are now deprecated (see Section 8.4.3, “Connection Control Plugins”, for more information about these plugins).

This component also exposes system variables that enable its operation to be configured and a status variable that provides basic monitoring information; these are described in Section 8.4.2.2, “Connection Control Component Configuration”, and elsewhere. In addition, `component_connection_control` implements a Performance Schema table `connection_control_failed_login_attempts` which provides detailed monitoring information for failed connection attempts. For more information about this table, see Section 29.12.22.2, “The connection_control_failed_login_attempts Table”.

The component also supports the MySQL Option Tracker component (part of MySQL Enterprise Edition, a commercial offering). See Section 7.5.8.2, “Option Tracker Supported Components”, for more information.

The first two sections following provide information about installing and configuring the component. An additional section, Section 8.4.2.3, “Migrating to the Connection Control Component”, provides guidance on migrating from the Connection Control plugins to the Connection Control component.


#### 8.4.2.1 Connection Control Component Installation

The Connection Control Component is available in both the Community and Enterprise distributions of MySQL. The component can be installed in a running MySQL server using the `INSTALL COMPONENT` statement shown here:

```
mysql> INSTALL COMPONENT 'file://component_connection_control';
Query OK, 0 rows affected (0.01 sec)
```

To verify that the component was installed successfully, you can query the `mysql.component` table like this:

```
mysql> SELECT * FROM mysql.component
    -> WHERE component_urn LIKE '%connection%';
+--------------+--------------------+-------------------------------------+
| component_id | component_group_id | component_urn                       |
+--------------+--------------------+-------------------------------------+
|           16 |                 12 | file://component_connection_control |
+--------------+--------------------+-------------------------------------+
1 row in set (0.00 sec)
```

No additional steps are required to install and run the component. While it can be used with the default settings, you may wish to tune its operations to meet conditions specific to your environment. The next section, Section 8.4.2.2, “Connection Control Component Configuration”, provides information on how to accomplish this task.

See also Section 7.5.1, “Installing and Uninstalling Components”.


#### 8.4.2.2 Connection Control Component Configuration

The Connection Control component exposes the following system variables:

* `component_connection_control.failed_connections_threshold`: This is the number of consecutive failed connection attempts by a given account which are allowed before the server adds a delay for subsequent connection attempts by this user. To disable counting of failed connections, set this variable to zero.

* `component_connection_control.max_connection_delay`: The maximum delay in milliseconds for connection failures above the threshold.

* `component_connection_control.min_connection_delay`: The minimum delay in milliseconds for connection failures above the threshold.

* `component_connection_control.exempt_unknown_users`: Whether to penalize hosts generating failed TCP connections. This improves the component's ability to handle legitimate connection attempts from load balancers, ensuring better server availability while maintaining effectiveness in thwarting brute force attacks.

If `component_connection_control.failed_connections_threshold` is greater than zero, counting of failed connections and thus connection control is enabled, and applies as follows for each user account:

* The first `component_connection_control.failed_connections_threshold` consecutive times that this account fails to connect, no action is taken.

* For each subsequent attempt by this user to connect, the server adds an increasing delay, until a successful connection occurs. Initial unadjusted delays begin at 1000 milliseconds (1 second) and increase by 1000 milliseconds per attempt. That is, once a delay has been imposed for a given account, the unadjusted delays for subsequent failed attempts are 1000 milliseconds, 2000 milliseconds, 3000 milliseconds, and so forth.

* The actual delay experienced by a client is the unadjusted delay, adjusted to lie within the values of the `component_connection_control.min_connection_delay` and `component_connection_control.max_connection_delay` system variables, inclusive.

  For example, assuming that `component_connection_control.failed_connections_threshold` is the default (3): If `component_connection_control.min_connection_delay` is 3000 and `component_connection_control.max_connection_delay` is 6000, then the delay for each failed attempt to connect is as shown in the following table:

  <table><col width="30%"/><col width="35%"/><col width="35%"/><thead><tr> <th>Attempt #</th> <th>Unadjusted Delay (milliseconds)</th> <th>Actual Delay (milliseconds)</th> </tr></thead><tbody><tr> <td>1</td> <td>0</td> <td>0</td> </tr><tr> <td>2</td> <td>0</td> <td>0</td> </tr><tr> <td>3</td> <td>0</td> <td>0</td> </tr><tr> <td>4</td> <td>1000</td> <td>3000</td> </tr><tr> <td>5</td> <td>2000</td> <td>3000</td> </tr><tr> <td>6</td> <td>3000</td> <td>3000</td> </tr><tr> <td>7</td> <td>4000</td> <td>4000</td> </tr><tr> <td>8</td> <td>5000</td> <td>5000</td> </tr><tr> <td>9</td> <td>6000</td> <td>6000</td> </tr><tr> <td>10</td> <td>7000</td> <td>6000</td> </tr><tr> <td>11</td> <td>8000</td> <td>6000</td> </tr><tr> <td>12</td> <td>8000</td> <td>6000</td> </tr></tbody></table>

* Once delays have been instituted for an account, the first successful connection thereafter by that account also experiences a delay, but the failure count is reset to zero for subsequent connections by this account.

The Connection Control component also exposes the following status variables: .

* `Component_connection_control_delay_generated` is the number of times the server has added a delay to its response to a failed connection attempt. This does not count attempts that occur before reaching the limit set by the `component_connection_control.failed_connections_threshold` system variable, since no delay was imposed for these attempts.

  This variable provides a simple counter. You can obtain more detailed connection control monitoring information from the Performance Schema the `connection_control_failed_login_attempts` table.

  Assigning a value to `component_connection_control.failed_connections_threshold` at runtime resets `Component_connection_control_delay_generated` to zero.

* `Component_connection_control_exempted_unknown_users` lists the number of connections exempted by `component_connection_control.exempt_unknown_users`.

When the `component_connection_control` component is installed, it checks connection attempts and tracks whether they fail or succeed. For this purpose, a failed connection attempt is one for which the client user and host match a known MySQL account but the provided credentials are incorrect, or do not match any known account.

**Proxies.** Counting of failed connection attempts is based on the combination of user name and host name (`user@host`) used for each connection attempt. Determination of the applicable user name and host name takes proxying into account, as follows:

* If the client user proxies another user, the account for failed-connection counting is the proxying user, not the proxied user. For example, if `external_user@example.com` proxies `proxy_user@example.com`, connection counting uses the proxying user, `external_user@example.com`, rather than the proxied user, `proxy_user@example.com`. Both `external_user@example.com` and `proxy_user@example.com` must have valid entries in the `mysql.user` system table and a proxy relationship between them must be defined in the `mysql.proxies_priv` system table (see Section 8.2.19, “Proxy Users”).

* If the client user does not proxy another user, but does match a `mysql.user` entry, counting uses the `CURRENT_USER()` value corresponding to that entry. For example, if a user `user1` connecting from a host `host1.example.com` matches a `user1@host1.example.com` entry, counting uses `user1@host1.example.com`. If the user matches a `user1@%.example.com`, `user1@%.com`, or `user1@%` entry instead, counting uses `user1@%.example.com`, `user1@%.com`, or `user1@%`, respectively.

For the cases just described, the connection attempt matches some `mysql.user` entry, and whether the request succeeds or fails depends on whether the client provides the correct authentication credentials. For example, if the client presents an incorrect password, the connection attempt fails.

If the connection attempt matches no `mysql.user` entry, the attempt fails. In this case, no `CURRENT_USER()` value is available and connection-failure counting uses the user name provided by the client and the client host as determined by the MySQL server. For example, if a client attempts to connect as user `user2` from host `host2.example.com`, the user name part is available in the client request and the server determines the host information. The user/host combination used for counting is `user2@host2.example.com`.

Note

The MySQL server maintains information about which client hosts can possibly connect to the server (essentially the union of host values for `mysql.user` entries). If a client attempts to connect from any other host, the server rejects the attempt at an early stage of connection setup:

```
ERROR 1130 (HY000): Host 'host_name' is not
allowed to connect to this MySQL server
```

This type of rejection occurs before password authentication is attempted; thus, the Connection Control component does not see it, and it is not included in the count shown by `Component_connection_control_delay_generated` or in the `performance_schema.connection_control_failed_login_attempts` table.

**Failure monitoring.** You can use the following information sources to monitor failed connections:

* `Component_connection_control_delay_generated`: This server status variable indicates the number of times the server has added a delay to its response to a failed connection attempt, not counting attempts that occur before reaching the limit determined by `component_connection_control.failed_connections_threshold`.

* `connection_control_failed_login_attempts`: This Performance Schema table provides the current number of consecutive failed connection attempts per MySQL user account (that is, for each combination of user and host). This count includes all failed attempts, regardless of whether they were delayed.

Assigning a value to `component_connection_control.failed_connections_threshold` at runtime has the effects listed here:

* All accumulated failed-connection counters are reset to zero.

* `Component_connection_control_delay_generated` is reset to zero.

* The `performance_schema.connection_control_failed_login_attempts` table becomes empty.


#### 8.4.2.3 Migrating to the Connection Control Component

Migrating from the Connection Control plugins to the Connection Control component consists of the following steps:

1. Remove any references to the plugins in configuration files, including references made by `--plugin-load-add` or `--early-plugin-load` or plugin system variables.

   As part of this step, copy the values for any Connection Control plugin system variables that you wish to retain. Also, remove any persisted plugin variables using `RESET PERSIST`.

2. Uninstall the plugins, using the following two statements:

   ```
   UNINSTALL PLUGIN CONNECTION_CONTROL;
   UNINSTALL PLUGIN CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS;
   ```

3. Install the component as described in Section 8.4.2.1, “Connection Control Component Installation”.

4. If you copied any plugin system variable values, assign these in the server's configuration file to to the equivalent variables supplied by the component, as shown in this table:

   <table><col width="50%"/><col width="50%"/><thead><tr> <th>Plugin Variable</th> <th>Component Variable</th> </tr></thead><tbody><tr> <td><code>connection_control_failed_connections_threshold</code></td> <td><code>component_connection_control.failed_connections_threshold</code></td> </tr><tr> <td><code>connection_control_max_connection_delay</code></td> <td><code>component_connection_control.max_connection_delay</code></td> </tr><tr> <td><code>connection_control_min_connection_delay</code></td> <td><code>component_connection_control.min_connection_delay</code></td> </tr></tbody></table>

   Use [`SET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") to persist any component variable values that were persisted previously for their plugin equivalents.

5. Restart the server so that it uses the updated configuration.


### 8.4.3 Connection Control Plugins

Note

The Connection Control plugins are deprecated, and are subject to removal in a future version of MySQL. They are superseded by the Connection Control Component. For more information, see Section 8.4.2.3, “Migrating to the Connection Control Component”.

MySQL Server includes a plugin library that enables administrators to introduce an increasing delay in server response to connection attempts after a configurable number of consecutive failed attempts. This capability provides a deterrent that slows down brute force attacks against MySQL user accounts. The plugin library contains two plugins:

* `CONNECTION_CONTROL` checks incoming connection attempts and adds a delay to server responses as necessary. This plugin also exposes system variables that enable its operation to be configured and a status variable that provides rudimentary monitoring information.

  The `CONNECTION_CONTROL` plugin uses the audit plugin interface (see Writing Audit Plugins). To collect information, it subscribes to the `MYSQL_AUDIT_CONNECTION_CLASSMASK` event class, and processes `MYSQL_AUDIT_CONNECTION_CONNECT` and `MYSQL_AUDIT_CONNECTION_CHANGE_USER` subevents to check whether the server should introduce a delay before responding to connection attempts.

* `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS` implements an `INFORMATION_SCHEMA` table that exposes more detailed monitoring information for failed connection attempts. For more information about this table, see Section 28.6.2, “The INFORMATION_SCHEMA CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS Table”.

The following sections provide information about connection control plugin installation and configuration.


#### 8.4.3.1 Connection Control Plugin Installation

This section describes how to install the connection control plugins, `CONNECTION_CONTROL` and `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS`. For general information about installing plugins, see Section 7.6.1, “Installing and Uninstalling Plugins”.

To be usable by the server, the plugin library file must be located in the MySQL plugin directory (the directory named by the `plugin_dir` system variable). If necessary, configure the plugin directory location by setting the value of `plugin_dir` at server startup.

The plugin library file base name is `connection_control`. The file name suffix differs per platform (for example, `.so` for Unix and Unix-like systems, `.dll` for Windows).

To load the plugins at server startup, use the `--plugin-load-add` option to name the library file that contains them. With this plugin-loading method, the option must be given each time the server starts. For example, put these lines in the server `my.cnf` file, adjusting the `.so` suffix for your platform as necessary:

```
[mysqld]
plugin-load-add=connection_control.so
```

After modifying `my.cnf`, restart the server to cause the new settings to take effect.

Alternatively, to load the plugins at runtime, use these statements, adjusting the `.so` suffix for your platform as necessary:

```
INSTALL PLUGIN CONNECTION_CONTROL
  SONAME 'connection_control.so';
INSTALL PLUGIN CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS
  SONAME 'connection_control.so';
```

`INSTALL PLUGIN` loads the plugin immediately, and also registers it in the `mysql.plugins` system table to cause the server to load it for each subsequent normal startup without the need for `--plugin-load-add`.

To verify plugin installation, examine the Information Schema `PLUGINS` table or use the `SHOW PLUGINS` statement (see Section 7.6.2, “Obtaining Server Plugin Information”). For example:

```
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

```
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

```
[mysqld]
plugin-load-add=connection_control.so
connection-control-failed-connections-threshold=4
connection-control-min-connection-delay=2000
```

To set and persist the variables at runtime, use these statements:

```
SET PERSIST connection_control_failed_connections_threshold = 4;
SET PERSIST connection_control_min_connection_delay = 2000;
```

[`SET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") sets a value for the running MySQL instance. It also saves the value, causing it to carry over to subsequent server restarts. To change a value for the running MySQL instance without having it carry over to subsequent restarts, use the `GLOBAL` keyword rather than `PERSIST`. See Section 15.7.6.1, “SET Syntax for Variable Assignment”.

The `connection_control_min_connection_delay` and `connection_control_max_connection_delay` system variables both have minimum and maximum values of 1000 and 2147483647. In addition, the permitted range of values of each variable also depends on the current value of the other:

* `connection_control_min_connection_delay` cannot be set greater than the current value of `connection_control_max_connection_delay`.

* `connection_control_max_connection_delay` cannot be set less than the current value of `connection_control_min_connection_delay`.

Thus, to make the changes required for some configurations, you might need to set the variables in a specific order. Suppose that the current minimum and maximum delays are 1000 and 2000, and that you want to set them to 3000 and 5000. You cannot first set `connection_control_min_connection_delay` to 3000 because that is greater than the current `connection_control_max_connection_delay` value of 2000. Instead, set `connection_control_max_connection_delay` to 5000, then set `connection_control_min_connection_delay` to 3000.

##### Connection Failure Assessment

When the `CONNECTION_CONTROL` plugin is installed, it checks connection attempts and tracks whether they fail or succeed. For this purpose, a failed connection attempt is one for which the client user and host match a known MySQL account but the provided credentials are incorrect, or do not match any known account.

Failed-connection counting is based on the user/host combination for each connection attempt. Determination of the applicable user name and host name takes proxying into account and occurs as follows:

* If the client user proxies another user, the account for failed-connection counting is the proxying user, not the proxied user. For example, if `external_user@example.com` proxies `proxy_user@example.com`, connection counting uses the proxying user, `external_user@example.com`, rather than the proxied user, `proxy_user@example.com`. Both `external_user@example.com` and `proxy_user@example.com` must have valid entries in the `mysql.user` system table and a proxy relationship between them must be defined in the `mysql.proxies_priv` system table (see Section 8.2.19, “Proxy Users”).

* If the client user does not proxy another user, but does match a `mysql.user` entry, counting uses the `CURRENT_USER()` value corresponding to that entry. For example, if a user `user1` connecting from a host `host1.example.com` matches a `user1@host1.example.com` entry, counting uses `user1@host1.example.com`. If the user matches a `user1@%.example.com`, `user1@%.com`, or `user1@%` entry instead, counting uses `user1@%.example.com`, `user1@%.com`, or `user1@%`, respectively.

For the cases just described, the connection attempt matches some `mysql.user` entry, and whether the request succeeds or fails depends on whether the client provides the correct authentication credentials. For example, if the client presents an incorrect password, the connection attempt fails.

If the connection attempt matches no `mysql.user` entry, the attempt fails. In this case, no `CURRENT_USER()` value is available and connection-failure counting uses the user name provided by the client and the client host as determined by the server. For example, if a client attempts to connect as user `user2` from host `host2.example.com`, the user name part is available in the client request and the server determines the host information. The user/host combination used for counting is `user2@host2.example.com`.

Note

The server maintains information about which client hosts can possibly connect to the server (essentially the union of host values for `mysql.user` entries). If a client attempts to connect from any other host, the server rejects the attempt at an early stage of connection setup:

```
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


#### 8.4.3.2 Connection Control Plugin System and Status Variables

This section describes the system and status variables that the `CONNECTION_CONTROL` plugin provides to enable its operation to be configured and monitored.

* Connection Control Plugin System Variables
* Connection Control Plugin Status Variables

##### Connection Control Plugin System Variables

If the `CONNECTION_CONTROL` plugin is installed, it exposes these system variables:

* `connection_control_failed_connections_threshold`

  <table frame="box" rules="all" summary="Properties for connection_control_failed_connections_threshold"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connection-control-failed-connections-threshold=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code>connection_control_failed_connections_threshold</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>3</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>2147483647</code></td> </tr></tbody></table>

  The number of consecutive failed connection attempts permitted to accounts before the server adds a delay for subsequent connection attempts:

  + If the variable has a nonzero value *`N`*, the server adds a delay beginning with consecutive failed attempt *`N`*+1. If an account has reached the point where connection responses are delayed, a delay also occurs for the next subsequent successful connection.

  + Setting this variable to zero disables failed-connection counting. In this case, the server never adds delays.

  For information about how `connection_control_failed_connections_threshold` interacts with other connection control system and status variables, see Section 8.4.3.1, “Connection Control Plugin Installation”.

* `connection_control_max_connection_delay`

  <table frame="box" rules="all" summary="Properties for connection_control_max_connection_delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connection-control-max-connection-delay=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code>connection_control_max_connection_delay</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>2147483647</code></td> </tr><tr><th>Minimum Value</th> <td><code>1000</code></td> </tr><tr><th>Maximum Value</th> <td><code>2147483647</code></td> </tr><tr><th>Unit</th> <td>milliseconds</td> </tr></tbody></table>

  The maximum delay in milliseconds for server response to failed connection attempts, if `connection_control_failed_connections_threshold` is greater than zero.

  For information about how `connection_control_max_connection_delay` interacts with other connection control system and status variables, see Section 8.4.3.1, “Connection Control Plugin Installation”.

* `connection_control_min_connection_delay`

  <table frame="box" rules="all" summary="Properties for connection_control_min_connection_delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connection-control-min-connection-delay=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code>connection_control_min_connection_delay</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1000</code></td> </tr><tr><th>Minimum Value</th> <td><code>1000</code></td> </tr><tr><th>Maximum Value</th> <td><code>2147483647</code></td> </tr><tr><th>Unit</th> <td>milliseconds</td> </tr></tbody></table>

  The minimum delay in milliseconds for server response to failed connection attempts, if `connection_control_failed_connections_threshold` is greater than zero.

  For information about how `connection_control_min_connection_delay` interacts with other connection control system and status variables, see Section 8.4.3.1, “Connection Control Plugin Installation”.

##### Connection Control Plugin Status Variables

If the `CONNECTION_CONTROL` plugin is installed, it exposes this status variable:

* `Connection_control_delay_generated`

  The number of times the server added a delay to its response to a failed connection attempt. This does not count attempts that occur before reaching the threshold defined by the `connection_control_failed_connections_threshold` system variable.

  This variable provides a simple counter. For more detailed connection control monitoring information, examine the `INFORMATION_SCHEMA` `CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS` table; see Section 28.6.2, “The INFORMATION_SCHEMA CONNECTION_CONTROL_FAILED_LOGIN_ATTEMPTS Table”.

  Assigning a value to `connection_control_failed_connections_threshold` at runtime resets `Connection_control_delay_generated` to zero.


### 8.4.4 The Password Validation Component

The `validate_password` component serves to improve security by requiring account passwords and enabling strength testing of potential passwords. This component exposes system variables that enable you to configure password policy, and status variables for component monitoring.

The `validate_password` component implements these capabilities:

* For SQL statements that assign a password supplied as a cleartext value, `validate_password` checks the password against the current password policy and rejects the password if it is weak (the statement returns an `ER_NOT_VALID_PASSWORD` error). This applies to the `ALTER USER`, `CREATE USER`, and `SET PASSWORD` statements.

* For `CREATE USER` statements, `validate_password` requires that a password be given, and that it satisfies the password policy. This is true even if an account is locked initially because otherwise unlocking the account later would cause it to become accessible without a password that satisfies the policy.

* `validate_password` implements a `VALIDATE_PASSWORD_STRENGTH()` SQL function that assesses the strength of potential passwords. This function takes a password argument and returns an integer from 0 (weak) to 100 (strong).

Note

For statements that assign or modify account passwords (`ALTER USER`, `CREATE USER`, and `SET PASSWORD`), the `validate_password` capabilities described here apply only to accounts that use an authentication plugin that stores credentials internally to MySQL. For accounts that use plugins that perform authentication against a credentials system external to MySQL, password management must be handled externally against that system as well. For more information about internal credentials storage, see Section 8.2.15, “Password Management”.

The preceding restriction does not apply to use of the `VALIDATE_PASSWORD_STRENGTH()` function because it does not affect accounts directly.

Examples:

* `validate_password` checks the cleartext password in the following statement. Under the default password policy, which requires passwords to be at least 8 characters long, the password is weak and the statement produces an error:

  ```
  mysql> ALTER USER USER() IDENTIFIED BY 'abc';
  ERROR 1819 (HY000): Your password does not satisfy the current
  policy requirements
  ```

* Passwords specified as hashed values are not checked because the original password value is not available for checking:

  ```
  mysql> ALTER USER 'jeffrey'@'localhost'
         IDENTIFIED WITH sha256_password
         AS '*0D3CED9BEC10A777AEC23CCC353A8C08A633045E';
  Query OK, 0 rows affected (0.01 sec)
  ```

* This account-creation statement fails, even though the account is locked initially, because it does not include a password that satisfies the current password policy:

  ```
  mysql> CREATE USER 'juanita'@'localhost' ACCOUNT LOCK;
  ERROR 1819 (HY000): Your password does not satisfy the current
  policy requirements
  ```

* To check a password, use the `VALIDATE_PASSWORD_STRENGTH()` function:

  ```
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

To configure password checking, modify the system variables having names of the form `validate_password.xxx`; these are the parameters that control password policy. See Section 8.4.4.2, “Password Validation Options and Variables”.

If `validate_password` is not installed, the `validate_password.xxx` system variables are not available, passwords in statements are not checked, and the `VALIDATE_PASSWORD_STRENGTH()` function always returns 0. For example, without the plugin installed, accounts can be assigned passwords shorter than 8 characters, or no password at all.

Assuming that `validate_password` is installed, it implements three levels of password checking: `LOW`, `MEDIUM`, and `STRONG`. The default is `MEDIUM`; to change this, modify the value of `validate_password.policy`. The policies implement increasingly strict password tests. The following descriptions refer to default parameter values, which can be modified by changing the appropriate system variables.

* `LOW` policy tests password length only. Passwords must be at least 8 characters long. To change this length, modify `validate_password.length`.

* `MEDIUM` policy adds the conditions that passwords must contain at least 1 numeric character, 1 lowercase character, 1 uppercase character, and 1 special (nonalphanumeric) character. To change these values, modify `validate_password.number_count`, `validate_password.mixed_case_count`, and `validate_password.special_char_count`.

* `STRONG` policy adds the condition that password substrings of length 4 or longer must not match words in the dictionary file, if one has been specified. To specify the dictionary file, modify `validate_password.dictionary_file`.

In addition, `validate_password` supports the capability of rejecting passwords that match the user name part of the effective user account for the current session, either forward or in reverse. To provide control over this capability, `validate_password` exposes a `validate_password.check_user_name` system variable, which is enabled by default.


#### 8.4.4.1 Password Validation Component Installation and Uninstallation

This section describes how to install and uninstall the `validate_password` password-validation component. For general information about installing and uninstalling components, see Section 7.5, “MySQL Components”.

Note

If you install MySQL 9.5 using the [MySQL Yum repository](https://dev.mysql.com/downloads/repo/yum/), [MySQL SLES Repository](https://dev.mysql.com/downloads/repo/suse/), or [RPM packages provided by Oracle](linux-installation-rpm.html "2.5.4 Installing MySQL on Linux Using RPM Packages from Oracle"), the `validate_password` component is enabled by default after you start your MySQL Server for the first time.

Upgrades to MySQL 9.5 from 9.4 using Yum or RPM packages leave the `validate_password` plugin in place. To make the transition from the `validate_password` plugin to the `validate_password` component, see Section 8.4.4.3, “Transitioning to the Password Validation Component”.

To be usable by the server, the component library file must be located in the MySQL plugin directory (the directory named by the `plugin_dir` system variable). If necessary, configure the plugin directory location by setting the value of `plugin_dir` at server startup.

To install the `validate_password` component, use this statement:

```
INSTALL COMPONENT 'file://component_validate_password';
```

Component installation is a one-time operation that need not be done per server startup. [`INSTALL COMPONENT`](install-component.html "15.7.4.3 INSTALL COMPONENT Statement") loads the component, and also registers it in the `mysql.component` system table to cause it to be loaded during subsequent server startups.

To uninstall the `validate_password` component, use this statement:

```
UNINSTALL COMPONENT 'file://component_validate_password';
```

`UNINSTALL COMPONENT` unloads the component, and unregisters it from the `mysql.component` system table to cause it not to be loaded during subsequent server startups.


#### 8.4.4.2 Password Validation Options and Variables

This section describes the system and status variables that `validate_password` provides to enable its operation to be configured and monitored.

* Password Validation Component System Variables
* Password Validation Component Status Variables
* Password Validation Plugin Options
* Password Validation Plugin System Variables
* Password Validation Plugin Status Variables

##### Password Validation Component System Variables

If the `validate_password` component is enabled, it exposes several system variables that enable configuration of password checking:

```
mysql> SHOW VARIABLES LIKE 'validate_password.%';
+-------------------------------------------------+--------+
| Variable_name                                   | Value  |
+-------------------------------------------------+--------+
| validate_password.changed_characters_percentage | 0      |
| validate_password.check_user_name               | ON     |
| validate_password.dictionary_file               |        |
| validate_password.length                        | 8      |
| validate_password.mixed_case_count              | 1      |
| validate_password.number_count                  | 1      |
| validate_password.policy                        | MEDIUM |
| validate_password.special_char_count            | 1      |
+-------------------------------------------------+--------+
```

To change how passwords are checked, you can set these system variables at server startup or at runtime. The following list describes the meaning of each variable.

* `validate_password.changed_characters_percentage`

  <table frame="box" rules="all" summary="Properties for validate_password.changed_characters_percentage"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password.changed-characters-percentage[=value]</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password.changed_characters_percentage</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>100</code></td> </tr></tbody></table>

  Indicates the minimum number of characters, as a percentage of all characters, in a password that a user must change before `validate_password` accepts a new password for the user's own account. This applies only when changing an existing password, and has no effect when setting a user account's initial password.

  This variable is not available unless `validate_password` is installed.

  By default, `validate_password.changed_characters_percentage` permits all of the characters from the current password to be reused in the new password. The range of valid percentages is 0 to 100. If set to 100 percent, all of the characters from the current password are rejected, regardless of the casing. Characters '`abc`' and '`ABC`' are considered to be the same characters. If `validate_password` rejects the new password, it reports an error indicating the minimum number of characters that must differ.

  If the `ALTER USER` statement does not provide the existing password in a `REPLACE` clause, this variable is not enforced. Whether the `REPLACE` clause is required is subject to the password verification policy as it applies to a given account. For an overview of the policy, see Password Verification-Required Policy.

* `validate_password.check_user_name`

  <table frame="box" rules="all" summary="Properties for validate_password.check_user_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password.check-user-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password.check_user_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  Whether `validate_password` compares passwords to the user name part of the effective user account for the current session and rejects them if they match. This variable is unavailable unless `validate_password` is installed.

  By default, `validate_password.check_user_name` is enabled. This variable controls user name matching independent of the value of `validate_password.policy`.

  When `validate_password.check_user_name` is enabled, it has these effects:

  + Checking occurs in all contexts for which `validate_password` is invoked, which includes use of statements such as `ALTER USER` or `SET PASSWORD` to change the current user's password, and invocation of functions such as `VALIDATE_PASSWORD_STRENGTH()`.

  + The user names used for comparison are taken from the values of the `USER()` and `CURRENT_USER()` functions for the current session. An implication is that a user who has sufficient privileges to set another user's password can set the password to that user's name, and cannot set that user' password to the name of the user executing the statement. For example, `'root'@'localhost'` can set the password for `'jeffrey'@'localhost'` to `'jeffrey'`, but cannot set the password to `'root`.

  + Only the user name part of the `USER()` and `CURRENT_USER()` function values is used, not the host name part. If a user name is empty, no comparison occurs.

  + If a password is the same as the user name or its reverse, a match occurs and the password is rejected.

  + User-name matching is case-sensitive. The password and user name values are compared as binary strings on a byte-by-byte basis.

  + If a password matches the user name, `VALIDATE_PASSWORD_STRENGTH()` returns 0 regardless of how other `validate_password` system variables are set.

* `validate_password.dictionary_file`

  <table frame="box" rules="all" summary="Properties for validate_password.dictionary_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password.dictionary-file=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password.dictionary_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  The path name of the dictionary file that `validate_password` uses for checking passwords. This variable is unavailable unless `validate_password` is installed.

  By default, this variable has an empty value and dictionary checks are not performed. For dictionary checks to occur, the variable value must be nonempty. If the file is named as a relative path, it is interpreted relative to the server data directory. File contents should be lowercase, one word per line. Contents are treated as having a character set of `utf8mb3`. The maximum permitted file size is 1MB.

  For the dictionary file to be used during password checking, the password policy must be set to 2 (`STRONG`); see the description of the `validate_password.policy` system variable. Assuming that is true, each substring of the password of length 4 up to 100 is compared to the words in the dictionary file. Any match causes the password to be rejected. Comparisons are not case-sensitive.

  For `VALIDATE_PASSWORD_STRENGTH()`, the password is checked against all policies, including `STRONG`, so the strength assessment includes the dictionary check regardless of the `validate_password.policy` value.

  `validate_password.dictionary_file` can be set at runtime and assigning a value causes the named file to be read without a server restart.

* `validate_password.length`

  <table frame="box" rules="all" summary="Properties for validate_password.length"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password.length=#</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password.length</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>8</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr></tbody></table>

  The minimum number of characters that `validate_password` requires passwords to have. This variable is unavailable unless `validate_password` is installed.

  The `validate_password.length` minimum value is a function of several other related system variables. The value cannot be set less than the value of this expression:

  ```
  validate_password.number_count
  + validate_password.special_char_count
  + (2 * validate_password.mixed_case_count)
  ```

  If `validate_password` adjusts the value of `validate_password.length` due to the preceding constraint, it writes a message to the error log.

* `validate_password.mixed_case_count`

  <table frame="box" rules="all" summary="Properties for validate_password.mixed_case_count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password.mixed-case-count=#</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password.mixed_case_count</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr></tbody></table>

  The minimum number of lowercase and uppercase characters that `validate_password` requires passwords to have if the password policy is `MEDIUM` or stronger. This variable is unavailable unless `validate_password` is installed.

  For a given `validate_password.mixed_case_count` value, the password must have that many lowercase characters, and that many uppercase characters.

* `validate_password.number_count`

  <table frame="box" rules="all" summary="Properties for validate_password.number_count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password.number-count=#</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password.number_count</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr></tbody></table>

  The minimum number of numeric (digit) characters that `validate_password` requires passwords to have if the password policy is `MEDIUM` or stronger. This variable is unavailable unless `validate_password` is installed.

* `validate_password.policy`

  <table frame="box" rules="all" summary="Properties for validate_password.policy"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password.policy=value</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password.policy</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>0</code></p><p class="valid-value"><code>1</code></p><p class="valid-value"><code>2</code></p></td> </tr></tbody></table>

  The password policy enforced by `validate_password`. This variable is unavailable unless `validate_password` is installed.

  `validate_password.policy` affects how `validate_password` uses its other policy-setting system variables, except for checking passwords against user names, which is controlled independently by `validate_password.check_user_name`.

  The `validate_password.policy` value can be specified using numeric values 0, 1, 2, or the corresponding symbolic values `LOW`, `MEDIUM`, `STRONG`. The following table describes the tests performed for each policy. For the length test, the required length is the value of the `validate_password.length` system variable. Similarly, the required values for the other tests are given by other `validate_password.xxx` variables.

  <table summary="Password policies enforced by the validate_password component and the tests performed for each policy."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Policy</th> <th>Tests Performed</th> </tr></thead><tbody><tr> <td><code>0</code> or <code>LOW</code></td> <td>Length</td> </tr><tr> <td><code>1</code> or <code>MEDIUM</code></td> <td>Length; numeric, lowercase/uppercase, and special characters</td> </tr><tr> <td><code>2</code> or <code>STRONG</code></td> <td>Length; numeric, lowercase/uppercase, and special characters; dictionary file</td> </tr></tbody></table>

* `validate_password.special_char_count`

  <table frame="box" rules="all" summary="Properties for validate_password.special_char_count"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password.special-char-count=#</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password.special_char_count</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr></tbody></table>

  The minimum number of nonalphanumeric characters that `validate_password` requires passwords to have if the password policy is `MEDIUM` or stronger. This variable is unavailable unless `validate_password` is installed.

##### Password Validation Component Status Variables

If the `validate_password` component is enabled, it exposes status variables that provide operational information:

```
mysql> SHOW STATUS LIKE 'validate_password.%';
+-----------------------------------------------+---------------------+
| Variable_name                                 | Value               |
+-----------------------------------------------+---------------------+
| validate_password.dictionary_file_last_parsed | 2019-10-03 08:33:49 |
| validate_password.dictionary_file_words_count | 1902                |
+-----------------------------------------------+---------------------+
```

The following list describes the meaning of each status variable.

* `validate_password.dictionary_file_last_parsed`

  When the dictionary file was last parsed. This variable is unavailable unless `validate_password` is installed.

* `validate_password.dictionary_file_words_count`

  The number of words read from the dictionary file. This variable is unavailable unless `validate_password` is installed.

##### Password Validation Plugin Options

Note

In MySQL 9.5, the `validate_password` plugin was reimplemented as the `validate_password` component. The `validate_password` plugin is deprecated; expect it to be removed in a future version of MySQL. Consequently, its options are also deprecated, and you should expect them to be removed as well. MySQL installations that use the plugin should make the transition to using the component instead. See Section 8.4.4.3, “Transitioning to the Password Validation Component”.

To control activation of the `validate_password` plugin, use this option:

* `--validate-password[=value]`

  <table frame="box" rules="all" summary="Properties for validate-password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  This option controls how the server loads the deprecated `validate_password` plugin at startup. The value should be one of those available for plugin-loading options, as described in Section 7.6.1, “Installing and Uninstalling Plugins”. For example, `--validate-password=FORCE_PLUS_PERMANENT` tells the server to load the plugin at startup and prevents it from being removed while the server is running.

  This option is available only if the `validate_password` plugin has been previously registered with [`INSTALL PLUGIN`](install-plugin.html "15.7.4.4 INSTALL PLUGIN Statement") or is loaded with `--plugin-load-add`. See Section 8.4.4.1, “Password Validation Component Installation and Uninstallation”.

##### Password Validation Plugin System Variables

Note

In MySQL 9.5, the `validate_password` plugin was reimplemented as the `validate_password` component. The `validate_password` plugin is deprecated; expect it to be removed in a future version of MySQL. Consequently, its system variables are also deprecated and you should expect them to be removed as well. Use the corresponding system variables of the `validate_password` component instead; see Password Validation Component System Variables. MySQL installations that use the plugin should make the transition to using the component instead. See Section 8.4.4.3, “Transitioning to the Password Validation Component”.

* `validate_password_check_user_name`

  <table frame="box" rules="all" summary="Properties for validate_password.check_user_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password.check-user-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password.check_user_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>0

  This `validate_password` plugin system variable is deprecated; expect it to be removed in a future version of MySQL. Use the corresponding `validate_password.check_user_name` system variable of the `validate_password` component instead.

* `validate_password_dictionary_file`

  <table frame="box" rules="all" summary="Properties for validate_password.check_user_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password.check-user-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password.check_user_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>1

  This `validate_password` plugin system variable is deprecated; expect it to be removed in a future version of MySQL. Use the corresponding `validate_password.dictionary_file` system variable of the `validate_password` component instead.

* `validate_password_length`

  <table frame="box" rules="all" summary="Properties for validate_password.check_user_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password.check-user-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password.check_user_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>2

  This `validate_password` plugin system variable is deprecated; expect it to be removed in a future version of MySQL. Use the corresponding `validate_password.length` system variable of the `validate_password` component instead.

* `validate_password_mixed_case_count`

  <table frame="box" rules="all" summary="Properties for validate_password.check_user_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password.check-user-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password.check_user_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>3

  This `validate_password` plugin system variable is deprecated; expect it to be removed in a future version of MySQL. Use the corresponding `validate_password.mixed_case_count` system variable of the `validate_password` component instead.

* `validate_password_number_count`

  <table frame="box" rules="all" summary="Properties for validate_password.check_user_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password.check-user-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password.check_user_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>4

  This `validate_password` plugin system variable is deprecated; expect it to be removed in a future version of MySQL. Use the corresponding `validate_password.number_count` system variable of the `validate_password` component instead.

* `validate_password_policy`

  <table frame="box" rules="all" summary="Properties for validate_password.check_user_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password.check-user-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password.check_user_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>5

  This `validate_password` plugin system variable is deprecated; expect it to be removed in a future version of MySQL. Use the corresponding `validate_password.policy` system variable of the `validate_password` component instead.

* `validate_password_special_char_count`

  <table frame="box" rules="all" summary="Properties for validate_password.check_user_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--validate-password.check-user-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>validate_password.check_user_name</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>6

  This `validate_password` plugin system variable is deprecated; expect it to be removed in a future version of MySQL. Use the corresponding `validate_password.special_char_count` system variable of the `validate_password` component instead.

##### Password Validation Plugin Status Variables

Note

In MySQL 9.5, the `validate_password` plugin was reimplemented as the `validate_password` component. The `validate_password` plugin is deprecated; expect it to be removed in a future version of MySQL. Consequently, its status variables are also deprecated; expect it to be removed. Use the corresponding status variables of the `validate_password` component; see Password Validation Component Status Variables. MySQL installations that use the plugin should make the transition to using the component instead. See Section 8.4.4.3, “Transitioning to the Password Validation Component”.

* `validate_password_dictionary_file_last_parsed`

  This `validate_password` plugin status variable is deprecated; expect it to be removed in a future version of MySQL. Use the corresponding `validate_password.dictionary_file_last_parsed` status variable of the `validate_password` component instead.

* `validate_password_dictionary_file_words_count`

  This `validate_password` plugin status variable is deprecated; expect it to be removed in a future version of MySQL. Use the corresponding `validate_password.dictionary_file_words_count` status variable of the `validate_password` component instead.


#### 8.4.4.3 Transitioning to the Password Validation Component

Note

In MySQL 9.5, the `validate_password` plugin was reimplemented as the `validate_password` component. The `validate_password` plugin is deprecated; expect it to be removed in a future version of MySQL.

MySQL installations that currently use the `validate_password` plugin should make the transition to using the `validate_password` component instead. To do so, use the following procedure. The procedure installs the component before uninstalling the plugin, to avoid having a time window during which no password validation occurs. (The component and plugin can be installed simultaneously. In this case, the server attempts to use the component, falling back to the plugin if the component is unavailable.)

1. Install the `validate_password` component:

   ```
   INSTALL COMPONENT 'file://component_validate_password';
   ```

2. Test the `validate_password` component to ensure that it works as expected. If you need to set any `validate_password.xxx` system variables, you can do so at runtime using `SET GLOBAL`. (Any option file changes that must be made are performed in the next step.)

3. Adjust any references to the plugin system and status variables to refer to the corresponding component system and status variables. Suppose that previously you had configured the plugin at startup using an option file like this:

   ```
   [mysqld]
   validate-password=FORCE_PLUS_PERMANENT
   validate_password_dictionary_file=/usr/share/dict/words
   validate_password_length=10
   validate_password_number_count=2
   ```

   Those settings are appropriate for the plugin, but must be modified to apply to the component. To adjust the option file, omit the `--validate-password` option (it applies only to the plugin, not the component), and modify the system variable references from no-dot names appropriate for the plugin to dotted names appropriate for the component:

   ```
   [mysqld]
   validate_password.dictionary_file=/usr/share/dict/words
   validate_password.length=10
   validate_password.number_count=2
   ```

   Similar adjustments are needed for applications that refer at runtime to `validate_password` plugin system and status variables. Change the no-dot plugin variable names to the corresponding dotted component variable names.

4. Uninstall the `validate_password` plugin:

   ```
   UNINSTALL PLUGIN validate_password;
   ```

   If the `validate_password` plugin is loaded at server startup using a `--plugin-load` or `--plugin-load-add` option, omit that option from the server startup procedure. For example, if the option is listed in a server option file, remove it from the file.

5. Restart the server.


### 8.4.5 The MySQL Keyring

MySQL Server supports a keyring that enables internal server components and plugins to securely store sensitive information for later retrieval. The implementation comprises these elements:

* Keyring components and plugins that manage a backing store or communicate with a storage back end. Keyring use involves installing one from among the available components and plugins. Keyring components and plugins both manage keyring data but are configured differently and may have operational differences (see Section 8.4.5.1, “Keyring Components Versus Keyring Plugins”).

  These keyring components are available:

  + `component_keyring_file`: Stores keyring data in a file local to the server host. Available in MySQL Community Edition and MySQL Enterprise Edition distributions. See Section 8.4.5.4, “Using the component_keyring_file File-Based Keyring Component”.

  + `component_keyring_encrypted_file`: Stores keyring data in an encrypted, password-protected file local to the server host. Available in MySQL Enterprise Edition distributions. See [Section 8.4.5.5, “Using the component_keyring_encrypted_file Encrypted File-Based Keyring Component”](keyring-encrypted-file-component.html "8.4.5.5 Using the component_keyring_encrypted_file Encrypted File-Based Keyring Component").

  + `component_keyring_oci`: Stores keyring data in the Oracle Cloud Infrastructure Vault. Available in MySQL Enterprise Edition distributions. See Section 8.4.5.12, “Using the Oracle Cloud Infrastructure Vault Keyring Component”.

  + `component_keyring_aws`: Communicates with the Amazon Web Services Key Management Service for key generation and uses a local file for key storage. Available in MySQL Enterprise Edition distributions. See Section 8.4.5.9, “Using the component_keyring_aws AWS Keyring Component”.

  + `component_keyring_hashicorp`: Communicates with HashiCorp Vault for back end storage. Available in MySQL Enterprise Edition distributions. See Section 8.4.5.11, “Using the HashiCorp Vault Keyring Component”.

  These keyring plugins are available:

  + `keyring_okv`: A KMIP 1.1 plugin for use with KMIP-compatible back end keyring storage products such as Oracle Key Vault and Gemalto SafeNet KeySecure Appliance. Available in MySQL Enterprise Edition distributions. See Section 8.4.5.6, “Using the keyring_okv KMIP Plugin”.

  + `keyring_aws`: (*Deprecated*) Communicates with the Amazon Web Services Key Management Service for key generation and encryption, using a local file for key storage. Available in MySQL Enterprise Edition distributions. See Section 8.4.5.8, “Using the keyring_aws Amazon Web Services Keyring Plugin”.

  + (*Deprecated*) `keyring_hashicorp`: Communicates with HashiCorp Vault for back end storage. Available in MySQL Enterprise Edition distributions. See Section 8.4.5.10, “Using the HashiCorp Vault Keyring Plugin”.

* A keyring service interface for keyring key management. This service is accessible at two levels:

  + SQL interface: In SQL statements, call the functions described in Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”.

  + C interface: In C-language code, call the keyring service functions described in Section 7.6.8.2, “The Keyring Service”.

* Key metadata access:

  + The Performance Schema `keyring_keys` table exposes metadata for keys in the keyring. Key metadata includes key IDs, key owners, and backend key IDs. The `keyring_keys` table does not expose any sensitive keyring data such as key contents. See Section 29.12.18.2, “The keyring_keys table”.

  + The Performance Schema `keyring_component_status` table provides status information about the keyring component in use, if one is installed. See Section 29.12.18.1, “The keyring_component_status Table”.

* A key migration capability. MySQL supports migration of keys between keystores, enabling DBAs to switch a MySQL installation from one keystore to another. See Section 8.4.5.14, “Migrating Keys Between Keyring Keystores”.

* The implementation of keyring plugins is revised to use the component infrastructure. This is facilitated using the built-in plugin named `daemon_keyring_proxy_plugin` that acts as a bridge between the plugin and component service APIs. See Section 7.6.7, “The Keyring Proxy Bridge Plugin”.

Warning

For encryption key management, the `component_keyring_file` and `component_keyring_encrypted_file` components are not intended as a regulatory compliance solution. Security standards such as PCI, FIPS, and others require use of key management systems to secure, manage, and protect encryption keys in key vaults or hardware security modules (HSMs).

Within MySQL, keyring service consumers include:

* The `InnoDB` storage engine uses the keyring to store its key for tablespace encryption. See Section 17.13, “InnoDB Data-at-Rest Encryption”.

* MySQL Enterprise Audit uses the keyring to store the audit log file encryption password. See Encrypting Audit Log Files.

* Binary log and relay log management supports keyring-based encryption of log files. With log file encryption activated, the keyring stores the keys used to encrypt passwords for the binary log files and relay log files. See Section 19.3.2, “Encrypting Binary Log Files and Relay Log Files”.

* The master key to decrypt the file key that decrypts the persisted values of sensitive system variables is stored in the keyring. A keyring component must be enabled on the MySQL Server instance to support secure storage for persisted system variable values, rather than a keyring plugin, which do not support the function. See Persisting Sensitive System Variables.

For general keyring installation instructions, see Section 8.4.5.2, “Keyring Component Installation”, and Section 8.4.5.3, “Keyring Plugin Installation”. For installation and configuration information specific to a given keyring component or plugin, see the section describing it.

For a general comparison of keyring components and keyring plugins, see Section 8.4.5.1, “Keyring Components Versus Keyring Plugins”.

For information about using the keyring functions, see Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”.

Keyring components, plugins, and functions access a keyring service that provides the interface to the keyring. For information about accessing this service and writing keyring plugins, see Section 7.6.8.2, “The Keyring Service”, and Writing Keyring Plugins.


#### 8.4.5.1 Keyring Components Versus Keyring Plugins

The MySQL Keyring originally implemented keystore capabilities using server plugins, but began transitioning to use the component infrastructure. This section briefly compares keyring components and plugins to provide an overview of their differences. It may assist you in making the transition from plugins to components, or, if you are just beginning to use the keyring, assist you in choosing whether to use a component versus using a plugin.

* Keyring plugin loading uses the `--early-plugin-load` option (deprecated). Keyring component loading uses a manifest.

* Keyring plugin configuration is based on plugin-specific system variables. For keyring components, no system variables are used. Instead, each component has its own configuration file.

* Keyring components have fewer restrictions than keyring plugins with respect to key types and lengths. See Section 8.4.5.13, “Supported Keyring Key Types and Lengths”.

  Note

  `component_keyring_oci` can generate keys of type `AES` with a size of 16, 24, or 32 bytes only.

* Keyring components support secure storage for persisted system variable values, whereas keyring plugins do not support the function.

  A keyring component must be enabled on the MySQL server instance to support secure storage for persisted system variable values. The sensitive data that can be protected in this way includes items such as private keys and passwords that appear in the values of system variables. In the operating system file where persisted system variables are stored, the names and values of sensitive system variables are stored in an encrypted format, along with a generated file key to decrypt them. The generated file key is in turn encrypted using a master key that is stored in a keyring. See Persisting Sensitive System Variables.


#### 8.4.5.2 Keyring Component Installation

Keyring service consumers require that a keyring component or plugin be installed:

* To use a keyring component, begin with the instructions here.

* To use a keyring plugin instead, begin with Section 8.4.5.3, “Keyring Plugin Installation”.

* If you intend to use keyring functions in conjunction with the chosen keyring component or plugin, install the functions after installing that component or plugin, using the instructions in Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”.

Note

Only one keyring component or plugin should be enabled at a time. Enabling multiple keyring components or plugins is unsupported and results may not be as anticipated.

MySQL provides these keyring component choices:

* `component_keyring_file`: Stores keyring data in a file local to the server host. Available in MySQL Community Edition and MySQL Enterprise Edition distributions.

* `component_keyring_encrypted_file`: Stores keyring data in an encrypted, password-protected file local to the server host. Available in MySQL Enterprise Edition distributions.

* `component_keyring_oci`: Stores keyring data in the Oracle Cloud Infrastructure Vault. Available in MySQL Enterprise Edition distributions.

* `component_keyring_aws`: Communicates with the AWS Key Management Service for key generation and uses a local file for key storage. Available in MySQL Enterprise Edition distributions.

* `component_keyring_kmip`: Communicates securely as a client of a Key Management Interoperability Protocol (KMIP) back end, and exclusively generates keys through the KMIP back end. Available in MySQL Enterprise Edition distributions.

To be usable by the server, the component library file must be located in the MySQL plugin directory (the directory named by the `plugin_dir` system variable). If necessary, configure the plugin directory location by setting the value of `plugin_dir` at server startup.

A keyring component or plugin must be loaded early during the server startup sequence so that other components can access it as necessary during their own initialization. For example, the `InnoDB` storage engine uses the keyring for tablespace encryption, so a keyring component or plugin must be loaded and available prior to `InnoDB` initialization.

Note

A keyring component must be enabled on the MySQL server instance if you need to support secure storage for persisted system variable values. The keyring plugin does not support the function. See Persisting Sensitive System Variables.

Unlike keyring plugins, keyring components are not loaded using the `--early-plugin-load` server option or configured using system variables. Instead, the server determines which keyring component to load during startup using a manifest, and the loaded component consults its own configuration file when it initializes. Therefore, to install a keyring component, you must:

1. Write a manifest that tells the server which keyring component to load.

2. Write a configuration file for that keyring component.

The first step in installing a keyring component is writing a manifest that indicates which component to load. During startup, the server reads either a global manifest file, or a global manifest file paired with a local manifest file:

* The server attempts to read its global manifest file from the directory where the server is installed.

* If the global manifest file indicates use of a local manifest file, the server attempts to read its local manifest file from the data directory.

* Although global and local manifest files are located in different directories, the file name is `mysqld.my` in both locations.

* It is not an error for a manifest file not to exist. In this case, the server attempts no component loading associated with the file.

Local manifest files permit setting up component loading for multiple instances of the server, such that loading instructions for each server instance are specific to a given data directory instance. This enables different MySQL instances to use different keyring components.

Server manifest files have these properties:

* A manifest file must be in valid JSON format.
* A manifest file permits these items:

  + `"read_local_manifest"`: This item is permitted only in the global manifest file. If the item is not present, the server uses only the global manifest file. If the item is present, its value is `true` or `false`, indicating whether the server should read component-loading information from the local manifest file.

    If the `"read_local_manifest"` item is present in the global manifest file along with other items, the server checks the `"read_local_manifest"` item value first:

    - If the value is `false`, the server processes the other items in the global manifest file and ignores the local manifest file.

    - If the value is `true`, the server ignores the other items in the global manifest file and attempts to read the local manifest file.

  + `"components"`: This item indicates which component to load. The item value is a string that specifies a valid component URN, such as `"file://component_keyring_file"`. A component URN begins with `file://` and indicates the base name of the library file located in the MySQL plugin directory that implements the component.

* Server access to a manifest file should be read only. For example, a `mysqld.my` server manifest file may be owned by `root` and be read/write to `root`, but should be read only to the account used to run the MySQL server. If the manifest file is found during startup to be read/write to that account, the server writes a warning to the error log suggesting that the file be made read only.

* The database administrator has the responsibility for creating any manifest files to be used, and for ensuring that their access mode and contents are correct. If an error occurs, server startup fails and the administrator must correct any issues indicated by diagnostics in the server error log.

Given the preceding manifest file properties, to configure the server to load `component_keyring_file`, create a global manifest file named `mysqld.my` in the **mysqld** installation directory, and optionally create a local manifest file, also named `mysqld.my`, in the data directory. The following instructions describe how to load `component_keyring_file`. To load a different keyring component, substitute its name for `component_keyring_file`.

* To use a global manifest file only, the file contents look like this:

  ```
  {
    "components": "file://component_keyring_file"
  }
  ```

  Create this file in the directory where **mysqld** is installed.

* Alternatively, to use a global and local manifest file pair, the global file looks like this:

  ```
  {
    "read_local_manifest": true
  }
  ```

  Create this file in the directory where **mysqld** is installed.

  The local file looks like this:

  ```
  {
    "components": "file://component_keyring_file"
  }
  ```

  Create this file in the data directory.

With the manifest in place, proceed to configuring the keyring component. To do this, check the notes for your chosen keyring component for configuration instructions specific to that component:

* `component_keyring_file`: Section 8.4.5.4, “Using the component_keyring_file File-Based Keyring Component”.

* `component_keyring_encrypted_file`: [Section 8.4.5.5, “Using the component_keyring_encrypted_file Encrypted File-Based Keyring Component”](keyring-encrypted-file-component.html "8.4.5.5 Using the component_keyring_encrypted_file Encrypted File-Based Keyring Component").

* `component_keyring_oci`: Section 8.4.5.12, “Using the Oracle Cloud Infrastructure Vault Keyring Component”.

After performing any component-specific configuration, start the server. Verify component installation by examining the Performance Schema `keyring_component_status` table:

```
mysql> SELECT * FROM performance_schema.keyring_component_status;
+---------------------+-------------------------------------------------+
| STATUS_KEY          | STATUS_VALUE                                    |
+---------------------+-------------------------------------------------+
| Component_name      | component_keyring_file                          |
| Author              | Oracle Corporation                              |
| License             | GPL                                             |
| Implementation_name | component_keyring_file                          |
| Version             | 1.0                                             |
| Component_status    | Active                                          |
| Data_file           | /usr/local/mysql/keyring/component_keyring_file |
| Read_only           | No                                              |
+---------------------+-------------------------------------------------+
```

A `Component_status` value of `Active` indicates that the component initialized successfully.

If the component cannot be loaded, server startup fails. Check the server error log for diagnostic messages. If the component loads but fails to initialize due to configuration problems, the server starts but the `Component_status` value is `Disabled`. Check the server error log, correct the configuration issues, and use the `ALTER INSTANCE RELOAD KEYRING` statement to reload the configuration.

Keyring components should be loaded only by using a manifest file, not by using the [`INSTALL COMPONENT`](install-component.html "15.7.4.3 INSTALL COMPONENT Statement") statement. Keyring components loaded using that statement may be available too late in the server startup sequence for certain components that use the keyring, such as `InnoDB`, because they are registered in the `mysql.component` system table and loaded automatically for subsequent server restarts. But `mysql.component` is an `InnoDB` table, so any components named in it can be loaded during startup only after `InnoDB` initialization.

If no keyring component or plugin is available when a component tries to access the keyring service, the service cannot be used by that component. As a result, the component may fail to initialize or may initialize with limited functionality. For example, if `InnoDB` finds that there are encrypted tablespaces when it initializes, it attempts to access the keyring. If the keyring is unavailable, `InnoDB` can access only unencrypted tablespaces.


#### 8.4.5.3 Keyring Plugin Installation

Keyring service consumers require that a keyring component or plugin be installed:

* To use a keyring plugin, begin with the instructions here. (Also, for general information about installing plugins, see Section 7.6.1, “Installing and Uninstalling Plugins”.)

* To use a keyring component instead, begin with Section 8.4.5.2, “Keyring Component Installation”.

* If you intend to use keyring functions in conjunction with the chosen keyring component or plugin, install the functions after installing that component or plugin, using the instructions in Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”.

Note

Only one keyring component or plugin should be enabled at a time. Enabling multiple keyring components or plugins is unsupported and results may not be as anticipated.

A keyring component must be enabled on the MySQL Server instance if you need to support secure storage for persisted system variable values, rather than a keyring plugin, which do not support the function. See Persisting Sensitive System Variables.

MySQL provides these keyring plugin choices:

* `keyring_okv`: A KMIP 1.1 plugin for use with KMIP-compatible back end keyring storage products such as Oracle Key Vault and Gemalto SafeNet KeySecure Appliance. Available in MySQL Enterprise Edition distributions.

* `keyring_aws`: Communicates with the Amazon Web Services Key Management Service as a back end for key generation and uses a local file for key storage. Available in MySQL Enterprise Edition distributions.

* `keyring_hashicorp`: Communicates with HashiCorp Vault for back end storage. Available in MySQL Enterprise Edition distributions.

To be usable by the server, the plugin library file must be located in the MySQL plugin directory (the directory named by the `plugin_dir` system variable). If necessary, configure the plugin directory location by setting the value of `plugin_dir` at server startup.

A keyring component or plugin must be loaded early during the server startup sequence so that other components can access it as necessary during their own initialization. For example, the `InnoDB` storage engine uses the keyring for tablespace encryption, so a keyring component or plugin must be loaded and available prior to `InnoDB` initialization.

Installation for each keyring plugin is similar. The following instructions describe how to install `keyring_okv`. To use a different keyring plugin, substitute its name for `keyring_okv`.

The `keyring_okv` plugin library file base name is `keyring_okv`. The file name suffix differs per platform (for example, `.so` for Unix and Unix-like systems, `.dll` for Windows).

To load the plugin, use the `--early-plugin-load` option to name the plugin library file that contains it. For example, on platforms where the plugin library file suffix is `.so`, use these lines in the server `my.cnf` file, adjusting the `.so` suffix for your platform as necessary:

```
[mysqld]
early-plugin-load=keyring_okv.so
```

Note

`--early-plugin-load` is deprecated, and produces a warning when it is used. See the description of this option for more information.

Before starting the server, check the notes for your chosen keyring plugin for configuration instructions specific to that plugin:

* `keyring_okv`: Section 8.4.5.6, “Using the keyring_okv KMIP Plugin”.

* `keyring_aws`: Section 8.4.5.8, “Using the keyring_aws Amazon Web Services Keyring Plugin”

* `keyring_hashicorp`: Section 8.4.5.10, “Using the HashiCorp Vault Keyring Plugin”

After performing any plugin-specific configuration, start the server. Verify plugin installation by examining the Information Schema `PLUGINS` table or use the `SHOW PLUGINS` statement (see Section 7.6.2, “Obtaining Server Plugin Information”). For example:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE 'keyring%';
+--------------+---------------+
| PLUGIN_NAME  | PLUGIN_STATUS |
+--------------+---------------+
| keyring_okv  | ACTIVE        |
+--------------+---------------+
```

If the plugin fails to initialize, check the server error log for diagnostic messages.

Plugins can be loaded by methods other than `--early-plugin-load`, such as the `--plugin-load` or `--plugin-load-add` option or the `INSTALL PLUGIN` statement. However, keyring plugins loaded using those methods may be available too late in the server startup sequence for certain components that use the keyring, such as `InnoDB`:

* Plugin loading using `--plugin-load` or `--plugin-load-add` occurs after `InnoDB` initialization.

* Plugins installed using [`INSTALL PLUGIN`](install-plugin.html "15.7.4.4 INSTALL PLUGIN Statement") are registered in the `mysql.plugin` system table and loaded automatically for subsequent server restarts. However, because `mysql.plugin` is an `InnoDB` table, any plugins named in it can be loaded during startup only after `InnoDB` initialization.

If no keyring component or plugin is available when a component tries to access the keyring service, the service cannot be used by that component. As a result, the component may fail to initialize or may initialize with limited functionality. For example, if `InnoDB` finds that there are encrypted tablespaces when it initializes, it attempts to access the keyring. If the keyring is unavailable, `InnoDB` can access only unencrypted tablespaces. To ensure that `InnoDB` can access encrypted tablespaces as well, use `--early-plugin-load` to load the keyring plugin.

Note

`--early-plugin-load` is deprecated, and produces a warning when used. See the description of this option for more information.


#### 8.4.5.4 Using the component_keyring_file File-Based Keyring Component

The `component_keyring_file` keyring component stores keyring data in a file local to the server host.

Warning

For encryption key management, the `component_keyring_file` and `component_keyring_encrypted_file` components are not intended as a regulatory compliance solution. Security standards such as PCI, FIPS, and others require use of key management systems to secure, manage, and protect encryption keys in key vaults or hardware security modules (HSMs).

To use `component_keyring_file` for keystore management in the most common scenario, create two files: a manifest file that tells the server to load `component_keyring_file`, and a configuration file that specifies where to store the keys. Both files should be readable only by the appropriate user that runs the server, typically `mysql`.

The manifest file must be named `mysqld.my` and added to the same directory where **mysqld** is installed. The file looks like this:

```
{
  "components": "file://component_keyring_file"
}
```

The configuration file must be named `component_keyring_file.cnf` and added to the plugin directory. It contains the path to the file where the server stores keys:

```
{
  "path": "/usr/local/mysql/keyring/component_keyring_file.keys",
  "read_only": false
}
```

After adding the two files, restart **mysqld**. Verify component installation by examining the Performance Schema `keyring_component_status` table:

```
mysql> SELECT * FROM performance_schema.keyring_component_status;
```

A `Component_status` value of `Active` indicates that the component initialized successfully.

If the server startup fails or the `Component_status` value is `Disabled`, check the server error log.

For more details and to review other scenarios, see Section 8.4.5.2, “Keyring Component Installation” and Configuration Notes.

* Configuration Notes
* Keyring Component Usage

##### Configuration Notes

When it initializes, `component_keyring_file` reads either a global configuration file, or a global configuration file paired with a local configuration file:

* The component attempts to read its global configuration file from the directory where the component library file is installed (that is, the server plugin directory).

* If the global configuration file indicates use of a local configuration file, the component attempts to read its local configuration file from the data directory.

* Although global and local configuration files are located in different directories, the file name is `component_keyring_file.cnf` in both locations.

* It is an error for no configuration file to exist. `component_keyring_file` cannot initialize without a valid configuration.

Local configuration files permit setting up multiple server instances to use `component_keyring_file`, such that component configuration for each server instance is specific to a given data directory instance. This enables the same keyring component to be used with a distinct data file for each instance.

`component_keyring_file` configuration files have these properties:

* A configuration file must be in valid JSON format.
* A configuration file permits these configuration items:

  + `"read_local_config"`: This item is permitted only in the global configuration file. If the item is not present, the component uses only the global configuration file. If the item is present, its value is `true` or `false`, indicating whether the component should read configuration information from the local configuration file.

    If the `"read_local_config"` item is present in the global configuration file along with other items, the component checks the `"read_local_config"` item value first:

    - If the value is `false`, the component processes the other items in the global configuration file and ignores the local configuration file.

    - If the value is `true`, the component ignores the other items in the global configuration file and attempts to read the local configuration file.

  + `"path"`: The item value is a string that names the file to use for storing keyring data. The file should be named using an absolute path, not a relative path. This item is mandatory in the configuration. If not specified, `component_keyring_file` initialization fails.

  + `"read_only"`: The item value indicates whether the keyring data file is read only. The item value is `true` (read only) or `false` (read/write). This item is mandatory in the configuration. If not specified, `component_keyring_file` initialization fails.

* The database administrator has the responsibility for creating any configuration files to be used, and for ensuring that their contents are correct. If an error occurs, server startup fails and the administrator must correct any issues indicated by diagnostics in the server error log.

Given the preceding configuration file properties, to configure `component_keyring_file`, create a global configuration file named `component_keyring_file.cnf` in the directory where the `component_keyring_file` library file is installed, and optionally create a local configuration file, also named `component_keyring_file.cnf`, in the data directory. The following instructions assume that a keyring data file named `/usr/local/mysql/keyring/component_keyring_file.keys` is to be used in read/write fashion.

Note

For Windows systems, the path to the `/usr/local/mysql/keyring/component_keyring_file.keys` file can be in `C:\ProgramData`. It should not be in `C:\Program Files`.

* To use a global configuration file only, the file contents look like this:

  ```
  {
    "path": "/usr/local/mysql/keyring/component_keyring_file.keys",
    "read_only": false
  }
  ```

  Create this file in the directory where the `component_keyring_file` library file is installed.

  This path must not point to or include the MySQL data directory. The path must be readable and writable by the system MySQL user (Windows: `NETWORK SERVICES`; Linux: `mysql` user; MacOS: `_mysql` user). It should not be accessible to other users.

* Alternatively, to use a global and local configuration file pair, the global file looks like this:

  ```
  {
    "read_local_config": true
  }
  ```

  Create this file in the directory where the `component_keyring_file` library file is installed.

  The local file looks like this:

  ```
  {
    "path": "/usr/local/mysql/keyring/component_keyring_file.keys",
    "read_only": false
  }
  ```

  This path must not point to or include the MySQL data directory. The path must be readable and writable by the system MySQL user (Windows: `NETWORK SERVICES`; Linux: `mysql` user; MacOS: `_mysql` user). It should not be accessible to other users.

##### Keyring Component Usage

Keyring operations are transactional: `component_keyring_file` uses a backup file during write operations to ensure that it can roll back to the original file if an operation fails. The backup file has the same name as the data file with a suffix of `.backup`.

`component_keyring_file` supports the functions that comprise the standard MySQL Keyring service interface. Keyring operations performed by those functions are accessible in SQL statements as described in Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”.

Example:

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

For information about the characteristics of key values permitted by `component_keyring_file`, see Section 8.4.5.13, “Supported Keyring Key Types and Lengths”.


#### 8.4.5.5 Using the component_keyring_encrypted_file Encrypted File-Based Keyring Component

Note

`component_keyring_encrypted_file` is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

The `component_keyring_encrypted_file` keyring component stores keyring data in an encrypted, password-protected file local to the server host.

Warning

For encryption key management, the `component_keyring_file` and `component_keyring_encrypted_file` components are not intended as a regulatory compliance solution. Security standards such as PCI, FIPS, and others require use of key management systems to secure, manage, and protect encryption keys in key vaults or hardware security modules (HSMs).

To use `component_keyring_encrypted_file` for keystore management in the most common scenario, create two files: a manifest file that tells the server to load `component_keyring_encrypted_file`, and a configuration file that specifies where to store the keys. Both files should be readable only by the appropriate user that runs the server, typically `mysql`.

The manifest file must be named `mysqld.my` and added to the same directory where **mysqld** is installed. The file looks like this:

```
{
  "components": "file://component_keyring_encrypted_file"
}
```

The configuration file must be named `component_keyring_encrypted_file.cnf` and added to the plugin directory. It contains the path to the file where the server stores keys:

```
{
  "path": "/usr/local/mysql/keyring/component_keyring_encrypted_file.keys",
  "password": "password",
  "read_only": false
}
```

After adding the two files, restart **mysqld**. Verify component installation by examining the Performance Schema `keyring_component_status` table:

```
mysql> SELECT * FROM performance_schema.keyring_component_status;
```

A `Component_status` value of `Active` indicates that the component initialized successfully.

If the server startup fails or the `Component_status` value is `Disabled`, check the server error log.

For more details and to review other scenarios, see Section 8.4.5.2, “Keyring Component Installation” and Configuration Notes.

* Configuration Notes
* Encrypted Keyring Component Usage

##### Configuration Notes

When it initializes, `component_keyring_encrypted_file` reads either a global configuration file, or a global configuration file paired with a local configuration file:

* The component attempts to read its global configuration file from the directory where the component library file is installed (that is, the server plugin directory).

* If the global configuration file indicates use of a local configuration file, the component attempts to read its local configuration file from the data directory.

* Although global and local configuration files are located in different directories, the file name is `component_keyring_encrypted_file.cnf` in both locations.

* If `component_keyring_encrypted_file` cannot find the configuration file, an error results, and the component cannot initialize.

Local configuration files permit setting up multiple server instances to use `component_keyring_encrypted_file`, such that component configuration for each server instance is specific to a given data directory instance. This enables the same keyring component to be used with a distinct data file for each instance.

`component_keyring_encrypted_file` configuration files have these properties:

* A configuration file must be in valid JSON format.
* A configuration file permits these configuration items:

  + `"read_local_config"`: This item is permitted only in the global configuration file. If the item is not present, the component uses only the global configuration file. If the item is present, its value is `true` or `false`, indicating whether the component should read configuration information from the local configuration file.

    If the `"read_local_config"` item is present in the global configuration file along with other items, the component checks the `"read_local_config"` item value first:

    - If the value is `false`, the component processes the other items in the global configuration file and ignores the local configuration file.

    - If the value is `true`, the component ignores the other items in the global configuration file and attempts to read the local configuration file.

  + `"path"`: The item value is a string that names the file to use for storing keyring data. The file should be named using an absolute path, not a relative path. This item is mandatory in the configuration. If not specified, `component_keyring_encrypted_file` initialization fails.

  + `"password"`: The item value is a string that specifies the password for accessing the data file. This item is mandatory in the configuration. If not specified, `component_keyring_encrypted_file` initialization fails.

  + `"read_only"`: The item value indicates whether the keyring data file is read only. The item value is `true` (read only) or `false` (read/write). This item is mandatory in the configuration. If not specified, `component_keyring_encrypted_file` initialization fails.

* The database administrator has the responsibility for creating any configuration files to be used, and for ensuring that their contents are correct. If an error occurs, server startup fails and the administrator must correct any issues indicated by diagnostics in the server error log.

* Any configuration file that stores a password should have a restrictive mode and be accessible only to the account used to run the MySQL server.

Given the preceding configuration file properties, to configure `component_keyring_encrypted_file`, create a global configuration file named `component_keyring_encrypted_file.cnf` in the directory where the `component_keyring_encrypted_file` library file is installed, and optionally create a local configuration file, also named `component_keyring_encrypted_file.cnf`, in the data directory. The following instructions assume that a keyring data file named `/usr/local/mysql/keyring/component_keyring_encrypted_file.keys` is to be used in read/write fashion. You must also choose a password.

Note

For Windows systems, the path to the `/usr/local/mysql/keyring/component_keyring_encrypted_file.keys` file can be in `C:\ProgramData`. It should not be in `C:\Program Files`.

* To use a global configuration file only, the file contents look like this:

  ```
  {
    "path": "/usr/local/mysql/keyring/component_keyring_encrypted_file.keys",
    "password": "password",
    "read_only": false
  }
  ```

  Create this file in the directory where the `component_keyring_encrypted_file` library file is installed.

  This path must not point to or include the MySQL data directory. The path must be readable and writable by the system MySQL user (Windows: `NETWORK SERVICES`; Linux: `mysql` user; MacOS: `_mysql` user). It should not be accessible to other users.

* Alternatively, to use a global and local configuration file pair, the global file looks like this:

  ```
  {
    "read_local_config": true
  }
  ```

  Create this file in the directory where the `component_keyring_encrypted_file` library file is installed.

  The local file looks like this:

  ```
  {
    "path": "/usr/local/mysql/keyring/component_keyring_encrypted_file.keys",
    "password": "password",
    "read_only": false
  }
  ```

  This path must not point to or include the MySQL data directory. The path must be readable and writable by the system MySQL user (Windows: `NETWORK SERVICES`; Linux: `mysql` user; MacOS: `_mysql` user). It should not be accessible to other users.

##### Encrypted Keyring Component Usage

Keyring operations are transactional: `component_keyring_encrypted_file` uses a backup file during write operations to ensure that it can roll back to the original file if an operation fails. The backup file has the same name as the data file with a suffix of `.backup`.

`component_keyring_encrypted_file` supports the functions that comprise the standard MySQL Keyring service interface. Keyring operations performed by those functions are accessible in SQL statements as described in Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”.

Example:

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

For information about the characteristics of key values permitted by `component_keyring_encrypted_file`, see Section 8.4.5.13, “Supported Keyring Key Types and Lengths”.


#### 8.4.5.6 Using the keyring_okv KMIP Plugin

Note

The `keyring_okv` plugin is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

Important

The `keyring_okv` keyring plugin is deprecated, and is being replaced by the Key Management Interoperability Protocol (KMIP) Keyring component (`component_keyring_kmip`). Deprecation of the plugin means that you should expect the plugin to be removed in a future version of MySQL. For more information, including information about migrating from the `keyring_okv` plugin to `component_keyring_kmip`, see Section 8.4.5.7, “Using the component_keyring_kmip KMIP Component”.

The Key Management Interoperability Protocol (KMIP) enables communication of cryptographic keys between a key management server and its clients. The `keyring_okv` keyring plugin uses the KMIP 1.1 protocol to communicate securely as a client of a KMIP back end. Keyring material is generated exclusively by the back end, not by `keyring_okv`. The plugin works with these KMIP-compatible products:

* Oracle Key Vault
* Gemalto SafeNet KeySecure Appliance
* Townsend Alliance Key Manager
* Entrust KeyControl

Each MySQL Server instance must be registered separately as a client for KMIP. If two or more MySQL Server instances use the same set of credentials, they can interfere with each other’s functioning.

The `keyring_okv` plugin supports the functions that comprise the standard MySQL Keyring service interface. Keyring operations performed by those functions are accessible at two levels:

* SQL interface: In SQL statements, call the functions described in Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”.

* C interface: In C-language code, call the keyring service functions described in Section 7.6.8.2, “The Keyring Service”.

Example (using the SQL interface):

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

For information about the characteristics of key values permitted by `keyring_okv`, Section 8.4.5.13, “Supported Keyring Key Types and Lengths”.

To install `keyring_okv`, use the general instructions found in Section 8.4.5.3, “Keyring Plugin Installation”, together with the configuration information specific to `keyring_okv` found here.

* General keyring_okv Configuration
* Configuring keyring_okv for Oracle Key Vault
* Configuring keyring_okv for Gemalto SafeNet KeySecure Appliance
* Configuring keyring_okv for Townsend Alliance Key Manager
* Configuring keyring_okv for Entrust KeyControl
* Password-Protecting the keyring_okv Key File

##### General keyring_okv Configuration

Regardless of which KMIP back end the `keyring_okv` plugin uses for keyring storage, the `keyring_okv_conf_dir` system variable configures the location of the directory used by `keyring_okv` for its support files. The default value is empty, so you must set the variable to name a properly configured directory before the plugin can communicate with the KMIP back end. Unless you do so, `keyring_okv` writes a message to the error log during server startup that it cannot communicate:

```
[Warning] Plugin keyring_okv reported: 'For keyring_okv to be
initialized, please point the keyring_okv_conf_dir variable to a directory
containing Oracle Key Vault configuration file and ssl materials'
```

The `keyring_okv_conf_dir` variable must name a directory that contains the following items:

* `okvclient.ora`: A file that contains details of the KMIP back end with which `keyring_okv` communicates.

* `ssl`: A directory that contains the certificate and key files required to establish a secure connection with the KMIP back end: `CA.pem`, `cert.pem`, and `key.pem`. If the key file is password-protected, the `ssl` directory can contain a single-line text file named `password.txt` containing the password needed to decrypt the key file.

Both the `okvclient.ora` file and `ssl` directory with the certificate and key files are required for `keyring_okv` to work properly. The procedure used to populate the configuration directory with these files depends on the KMIP back end used with `keyring_okv`, as described elsewhere.

The configuration directory used by `keyring_okv` as the location for its support files should have a restrictive mode and be accessible only to the account used to run the MySQL server. For example, on Unix and Unix-like systems, to use the `/usr/local/mysql/mysql-keyring-okv` directory, the following commands (executed as `root`) create the directory and set its mode and ownership:

```
cd /usr/local/mysql
mkdir mysql-keyring-okv
chmod 750 mysql-keyring-okv
chown mysql mysql-keyring-okv
chgrp mysql mysql-keyring-okv
```

To be usable during the server startup process, `keyring_okv` must be loaded using the `--early-plugin-load` option. Also, set the `keyring_okv_conf_dir` system variable to tell `keyring_okv` where to find its configuration directory. For example, use these lines in the server `my.cnf` file, adjusting the `.so` suffix and directory location for your platform as necessary:

```
[mysqld]
early-plugin-load=keyring_okv.so
keyring_okv_conf_dir=/usr/local/mysql/mysql-keyring-okv
```

Note

`--early-plugin-load` is deprecated, and produces a warning whenever it is used. See the description of this option for more information.

For additional information about `keyring_okv_conf_dir`, see Section 8.4.5.19, “Keyring System Variables”.

##### Configuring keyring_okv for Oracle Key Vault

The discussion here assumes that you are familiar with Oracle Key Vault. Some pertinent information sources:

* [Oracle Key Vault site](http://www.oracle.com/technetwork/database/options/key-management/overview/index.html)

* [Oracle Key Vault documentation](https://docs.oracle.com/en/database/oracle/key-vault/index.html)

In Oracle Key Vault terminology, clients that use Oracle Key Vault to store and retrieve security objects are called endpoints. To communicate with Oracle Key Vault, it is necessary to register as an endpoint and enroll by downloading and installing endpoint support files. Note that you must register a separate endpoint for each MySQL Server instance. If two or more MySQL Server instances use the same endpoint, they can interfere with each other’s functioning.

The following procedure briefly summarizes the process of setting up `keyring_okv` for use with Oracle Key Vault:

1. Create the configuration directory for the `keyring_okv` plugin to use.

2. Register an endpoint with Oracle Key Vault to obtain an enrollment token.

3. Use the enrollment token to obtain the `okvclient.jar` client software download.

4. Install the client software to populate the `keyring_okv` configuration directory that contains the Oracle Key Vault support files.

Use the following procedure to configure `keyring_okv` and Oracle Key Vault to work together. This description only summarizes how to interact with Oracle Key Vault. For details, visit the [Oracle Key Vault](http://www.oracle.com/technetwork/database/options/key-management/overview/index.html) site and consult the *Oracle Key Vault Administrator's Guide*.

1. Create the configuration directory that contains the Oracle Key Vault support files, and make sure that the `keyring_okv_conf_dir` system variable is set to name that directory (for details, see General keyring_okv Configuration).

2. Log in to the Oracle Key Vault management console as a user who has the System Administrator role.

3. Select the Endpoints tab to arrive at the Endpoints page. On the Endpoints page, click Add.

4. Provide the required endpoint information and click Register. The endpoint type should be Other. Successful registration results in an enrollment token.

5. Log out from the Oracle Key Vault server.
6. Connect again to the Oracle Key Vault server, this time without logging in. Use the endpoint enrollment token to enroll and request the `okvclient.jar` software download. Save this file to your system.

7. Install the `okvclient.jar` file using the following command (you must have JDK 1.4 or higher):

   ```
   java -jar okvclient.jar -d dir_name [-v]
   ```

   The directory name following the `-d` option is the location in which to install extracted files. The `-v` option, if given, causes log information to be produced that may be useful if the command fails.

   When the command asks for an Oracle Key Vault endpoint password, do not provide one. Instead, press **Enter**. (The result is that no password is required when the endpoint connects to Oracle Key Vault.)

   The preceding command produces an `okvclient.ora` file, which should be in this location under the directory named by the `-d` option in the preceding **java -jar** command:

   ```
   install_dir/conf/okvclient.ora
   ```

   The expected file contents include lines that look like this:

   ```
   SERVER=host_ip:port_num
   STANDBY_SERVER=host_ip:port_num
   ```

   The `SERVER` variable is mandatory, and the `STANDBY_SERVER` variable is optional. The `keyring_okv` plugin attempts to communicate with the server running on the host named by the `SERVER` variable and falls back to `STANDBY_SERVER` if that fails.

   Note

   If the existing file is not in this format, then create a new file with the lines shown in the previous example. Also, consider backing up the `okvclient.ora` file before you run the **okvutil** command. Restore the file as needed.

   You can specify more than one standby server (up to a maximum of 64). If you do, the `keyring_okv` plugin iterates over them until it can establish a connection, and fails if it cannot. To add extra standby servers, edit the `okvclient.ora` file to specify the IP addresses and port numbers of the servers as a comma-separated list in the value of the `STANDBY_SERVER` variable. For example:

   ```
   STANDBY_SERVER=host_ip:port_num,host_ip:port_num,host_ip:port_num,host_ip:port_num
   ```

   Ensure that the list of standby servers is kept short, accurate, and up to date, and servers that are no longer valid are removed. There is a 20-second wait for each connection attempt, so the presence of a long list of invalid servers can significantly affect the `keyring_okv` plugin’s connection time and therefore the server startup time.

8. Go to the Oracle Key Vault installer directory and test the setup by running this command:

   ```
   okvutil/bin/okvutil list
   ```

   The output should look something like this:

   ```
   Unique ID                               Type            Identifier
   255AB8DE-C97F-482C-E053-0100007F28B9	Symmetric Key	-
   264BF6E0-A20E-7C42-E053-0100007FB29C	Symmetric Key	-
   ```

   For a fresh Oracle Key Vault server (a server without any key in it), the output looks like this instead, to indicate that there are no keys in the vault:

   ```
   no objects found
   ```

9. Use this command to extract the `ssl` directory containing SSL materials from the `okvclient.jar` file:

   ```
   jar xf okvclient.jar ssl
   ```

10. Copy the Oracle Key Vault support files (the `okvclient.ora` file and the `ssl` directory) into the configuration directory.

11. (Optional) If you wish to password-protect the key file, use the instructions in Password-Protecting the keyring_okv Key File.

After completing the preceding procedure, restart the MySQL server. It loads the `keyring_okv` plugin and `keyring_okv` uses the files in its configuration directory to communicate with Oracle Key Vault.

##### Configuring keyring_okv for Gemalto SafeNet KeySecure Appliance

Gemalto SafeNet KeySecure Appliance uses the KMIP protocol (version 1.1 or 1.2). The `keyring_okv` keyring plugin (which supports KMIP 1.1) can use KeySecure as its KMIP back end for keyring storage.

Use the following procedure to configure `keyring_okv` and KeySecure to work together. The description only summarizes how to interact with KeySecure. For details, consult the section named Add a KMIP Server in the [KeySecure User Guide](https://www2.gemalto.com/aws-marketplace/usage/vks/uploadedFiles/Support_and_Downloads/AWS/007-012362-001-keysecure-appliance-user-guide-v7.1.0.pdf).

1. Create the configuration directory that contains the KeySecure support files, and make sure that the `keyring_okv_conf_dir` system variable is set to name that directory (for details, see General keyring_okv Configuration).

2. In the configuration directory, create a subdirectory named `ssl` to use for storing the required SSL certificate and key files.

3. In the configuration directory, create a file named `okvclient.ora`. It should have following format:

   ```
   SERVER=host_ip:port_num
   STANDBY_SERVER=host_ip:port_num
   ```

   For example, if KeySecure is running on host 198.51.100.20 and listening on port 9002, and also running on alternative host 203.0.113.125 and listening on port 8041, the `okvclient.ora` file looks like this:

   ```
   SERVER=198.51.100.20:9002
   STANDBY_SERVER=203.0.113.125:8041
   ```

   You can specify more than one standby server (up to a maximum of 64). If you do, the `keyring_okv` plugin iterates over them until it can establish a connection, and fails if it cannot. To add extra standby servers, edit the `okvclient.ora` file to specify the IP addresses and port numbers of the servers as a comma-separated list in the value of the `STANDBY_SERVER` variable. For example:

   ```
   STANDBY_SERVER=host_ip:port_num,host_ip:port_num,host_ip:port_num,host_ip:port_num
   ```

   Ensure that the list of standby servers is kept short, accurate, and up to date, and servers that are no longer valid are removed. There is a 20-second wait for each connection attempt, so the presence of a long list of invalid servers can significantly affect the `keyring_okv` plugin’s connection time and therefore the server startup time.

4. Connect to the KeySecure Management Console as an administrator with credentials for Certificate Authorities access.

5. Navigate to Security >> Local CAs and create a local certificate authority (CA).

6. Go to Trusted CA Lists. Select Default and click on Properties. Then select Edit for Trusted Certificate Authority List and add the CA just created.

7. Download the CA and save it in the `ssl` directory as a file named `CA.pem`.

8. Navigate to Security >> Certificate Requests and create a certificate. Then you can download a compressed **tar** file containing certificate PEM files.

9. Extract the PEM files from in the downloaded file. For example, if the file name is `csr_w_pk_pkcs8.gz`, decompress and unpack it using this command:

   ```
   tar zxvf csr_w_pk_pkcs8.gz
   ```

   Two files result from the extraction operation: `certificate_request.pem` and `private_key_pkcs8.pem`.

10. Use this **openssl** command to decrypt the private key and create a file named `key.pem`:

    ```
    openssl pkcs8 -in private_key_pkcs8.pem -out key.pem
    ```

11. Copy the `key.pem` file into the `ssl` directory.

12. Copy the certificate request in `certificate_request.pem` into the clipboard.

13. Navigate to Security >> Local CAs. Select the same CA that you created earlier (the one you downloaded to create the `CA.pem` file), and click Sign Request. Paste the Certificate Request from the clipboard, choose a certificate purpose of Client (the keyring is a client of KeySecure), and click Sign Request. The result is a certificate signed with the selected CA in a new page.

14. Copy the signed certificate to the clipboard, then save the clipboard contents as a file named `cert.pem` in the `ssl` directory.

15. (Optional) If you wish to password-protect the key file, use the instructions in Password-Protecting the keyring_okv Key File.

After completing the preceding procedure, restart the MySQL server. It loads the `keyring_okv` plugin and `keyring_okv` uses the files in its configuration directory to communicate with KeySecure.

##### Configuring keyring_okv for Townsend Alliance Key Manager

Townsend Alliance Key Manager uses the KMIP protocol. The `keyring_okv` keyring plugin can use Alliance Key Manager as its KMIP back end for keyring storage. For additional information, see [Alliance Key Manager for MySQL](https://www.townsendsecurity.com/product/encryption-key-management-mysql).

##### Configuring keyring_okv for Entrust KeyControl

Entrust KeyControl uses the KMIP protocol. The `keyring_okv` keyring plugin can use Entrust KeyControl as its KMIP back end for keyring storage. For additional information, see the [Oracle MySQL and Entrust KeyControl with nShield HSM Integration Guide](https://www.entrust.com/-/media/documentation/integration-guides/oracle-mysql-enterprise-keycontrol-nshield-ig.pdf).

##### Password-Protecting the keyring_okv Key File

You can optionally protect the key file with a password and supply a file containing the password to enable the key file to be decrypted. To so do, change location to the `ssl` directory and perform these steps:

1. Encrypt the `key.pem` key file. For example, use a command like this, and enter the encryption password at the prompts:

   ```
   $> openssl rsa -des3 -in key.pem -out key.pem.new
   Enter PEM pass phrase:
   Verifying - Enter PEM pass phrase:
   ```

2. Save the encryption password in a single-line text file named `password.txt` in the `ssl` directory.

3. Verify that the encrypted key file can be decrypted using the following command. The decrypted file should display on the console:

   ```
   $> openssl rsa -in key.pem.new -passin file:password.txt
   ```

4. Remove the original `key.pem` file and rename `key.pem.new` to `key.pem`.

5. Change the ownership and access mode of new `key.pem` file and `password.txt` file as necessary to ensure that they have the same restrictions as other files in the `ssl` directory.


#### 8.4.5.7 Using the component_keyring_kmip KMIP Component

Note

`component_keyring_kmip` is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

The Key Management Interoperability Protocol (KMIP) Keyring component is intended to replace the `keyring_okv` Keyring plugin, which is now deprecated. See Migration from KMIP Plugin.

The Key Management Interoperability Protocol (KMIP) enables communication of cryptographic keys between a key management server and its clients. The `component_keyring_kmip` keyring component uses the KMIP 1.1 protocol to communicate securely as a client of a KMIP back end. Keyring material is generated exclusively by the back end, not by `component_keyring_kmip`. The component works with Oracle Key Vault, and any other product that uses KMIP 1.1 protocol.

`component_keyring_kmip` supports the functions that comprise the standard MySQL Keyring service interface. Keyring operations performed by those functions are accessible in SQL statements as described in Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”.

To use `component_keyring_kmip` for keystore management, you must:

1. Write a manifest that tells the server to load `component_keyring_kmip`, as described in Section 8.4.5.2, “Keyring Component Installation”.

2. Write a configuration file for `component_keyring_kmip`, as described here.

* Configuration Notes
* Configuring component_keyring_kmip for Oracle Key Vault
* Password-Protecting the component_keyring_kmip Key File
* Migration from KMIP Plugin

##### Configuration Notes

When it initializes, `component_keyring_kmip` reads either a global configuration file, or a global configuration file paired with a local configuration file:

* The component attempts to read its global configuration file from the directory where the component library file is installed (that is, the server plugin directory).

* If the global configuration file indicates use of a local configuration file, the component attempts to read its local configuration file from the data directory.

* Although global and local configuration files are located in different directories, the file name is `component_keyring_kmip.cnf` in both locations.

* It is an error for no configuration file to exist. `component_keyring_kmip` cannot initialize without a valid configuration.

`component_keyring_kmip` configuration files have these properties:

* A configuration file must be in valid JSON format.
* A configuration file permits these configuration items:

  + `"kmip_configuration_directory"`: Points to the path of a directory with any supported vault server configuration. MySQL server requires TLS certificates to communicate with the KMIP server, and it expects these certificates to be in the `config_dir/ssl` directory. MySQL server looks for the following files in the directory:

    - `CA.pem`
    - `cert.pem`
    - `key.pem` (if the key is password-protected, see Password-Protecting the component_keyring_kmip Key File)

    Only the certificates from the `ssl/` sub-directory are used. If the certificates are password-protected, then `password.txt` needs to be present in the `ssl/` sub-directory.

    If you use Oracle Key Vault, neither `okvclient.jar` nor `okvclient.ora` are used for the component configuration. `okvclient.ora` contains `SERVER=` and `STANDBY_SERVER=` options, which you directly pass when configuring the `keyring_okv` plugin. Thus, the file is not used. The `okvclient.jar` contains the `libokvcsdk.so` (the C SDK library), but it is not needed by the server.

  + `"cache_keys"`: If the value is `true`, the keys are cached in memory in plaintext. If the value is `false`, the keys are fetched from the backend server whenever accessed.

  + `"server"`: The primary host with the port number.

  + `"standby_server"`: The secondary host with the port number.

A configuration looks like this:

```
{
     "kmip_configuration_directory":"path to directory that contains SSL certificates"
     "cache_keys": true/false
     "server": "primary_host:primary_port",
     "standby_server": [
       "secondary_one_host:secondary_one_port,
       "secondary_two_host:secondary_two_port",
       "secondary_three_host:secondary_thre_port",
     ]
}
```

##### Configuring component_keyring_kmip for Oracle Key Vault

The discussion here assumes that you are familiar with Oracle Key Vault (OKV). Some pertinent information sources:

* [Oracle Key Vault site](http://www.oracle.com/technetwork/database/options/key-management/overview/index.html)

* [Oracle Key Vault documentation](https://docs.oracle.com/en/database/oracle/key-vault/index.html)

In Oracle Key Vault terminology, clients that use Oracle Key Vault to store and retrieve security objects are called endpoints. To communicate with Oracle Key Vault, it is necessary to register as an endpoint and enroll by downloading and installing endpoint support files. Note that you must register a separate endpoint for each MySQL Server instance. If two or more MySQL Server instances use the same endpoint, they can interfere with each other’s functioning.

To run any commands, you need to retrieve the `okvrestclipackage.zip` file. This file has the `bin`, `lib`, and `conf` directories.

`kmip_configuration_directory` has `okvclient.jar`, `okvclient.ora`, and `ssl`. To allow the `okvclient.jar` file to download the endpoint from the OKV server, run the following command:

```
${OKVRESTCLI}/bin/okv admin endpoint download --endpoint $EPNAME --location
ENDPOINT
```

To create the `ssl` directory, run the following command:

```
jar -xvf okvclient.jar ssl
```

A sample `component_keyring_kmip.cnf` file looks like the following:

```
{
  "kmip_configuration_directory":"path to directory that contains the ssl/ directory and SSL certificates"
     "cache_keys": true
     "server": "VALID_OKV_SERVER_IP:VALID_OKV_SERVER_PORT"
     "standby_server": "VALID_OKV_STANDBY_SERVER:VALID_OKV_STANDBY_SERVER_PORT"
}
```

##### Password-Protecting the component_keyring_kmip Key File

You can optionally protect the key file with a password and supply a file containing the password to enable the key file to be decrypted. To so do, change location to the `ssl` directory and perform these steps:

1. Encrypt the `key.pem` key file. For example, use a command like this, and enter the encryption password at the prompts:

   ```
   $> openssl rsa -des3 -in key.pem -out key.pem.new
   Enter PEM pass phrase:
   Verifying - Enter PEM pass phrase:
   ```

2. Save the encryption password in a single-line text file named `password.txt` in the `ssl` directory.

3. Verify that the encrypted key file can be decrypted using the following command. The decrypted file should display on the console:

   ```
   $> openssl rsa -in key.pem.new -passin file:password.txt
   ```

4. Remove the original `key.pem` file and rename `key.pem.new` to `key.pem`.

5. Change the ownership and access mode of new `key.pem` file and `password.txt` file as necessary to ensure that they have the same restrictions as other files in the `ssl` directory.

##### Migration from KMIP Plugin

To migrate from the KMIP keyring plugin to the KMIP keyring component, you must perform the following steps:

1. Write a local or global manifest file `mysqld.my` (see Section 8.4.5.2, “Keyring Component Installation”). The content of the file must match what is shown here:

   ```
   {
     "components": "file://component_keyring_kmip"
   }
   ```

2. Write a configuration file for the component. See Configuration Notes.

3. Perform any migration of keys that might be required. See Section 8.4.5.14, “Migrating Keys Between Keyring Keystores” for more information.

4. Uninstall the plugin using [`UNINSTALL PLUGIN`](uninstall-plugin.html "15.7.4.6 UNINSTALL PLUGIN Statement"). See Uninstalling Plugins.

5. Remove any references to the plugin in `my.cnf` and any other MySQL configuration files. Be sure to remove the line shown here:

   ```
   early-plugin-load=keyring_okv.so
   ```

   In addition, you should remove references to any variables specific to the OKV keyring plugin (equivalent options listed previously). Variables that are persisted (saved to `mysqld-auto.cnf`) must be removed from the server's configuration using `RESET PERSIST`.

6. Restart **mysqld** to cause the changes to take effect.


#### 8.4.5.8 Using the keyring_aws Amazon Web Services Keyring Plugin

Note

The `keyring_aws` plugin is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

Important

The `keyring_aws` keyring plugin is deprecated, and is being replaced by the AWS Keyring component (`component_aws_keyring`). Deprecation of the plugin means that you should expect the plugin to be removed in a future version of MySQL. For more information, including information about migrating from the `keyring_aws` plugin to `component_aws_keyring`, see Section 8.4.5.9, “Using the component_keyring_aws AWS Keyring Component”.

The `keyring_aws` keyring plugin communicates with the Amazon Web Services Key Management Service (AWS KMS) as a back end for key generation and uses a local file for key storage. All keyring material is generated exclusively by the AWS server, not by `keyring_aws`.

MySQL Enterprise Edition can work with `keyring_aws` on Red Hat Enterprise Linux, SUSE Linux Enterprise Server, Debian, Ubuntu, macOS, and Windows. MySQL Enterprise Edition does not support the use of `keyring_aws` on these platforms:

* EL6
* Generic Linux (glibc2.12)
* SLES 12 (with versions after MySQL Server 5.7)
* Solaris

The discussion here assumes that you are familiar with AWS in general and KMS in particular. Some pertinent information sources:

* [AWS site](https://aws.amazon.com/kms/)
* [KMS documentation](https://docs.aws.amazon.com/kms/)

The following sections provide configuration and usage information for the `keyring_aws` keyring plugin:

* keyring_aws Configuration
* keyring_aws Operation
* keyring_aws Credential Changes

##### keyring_aws Configuration

To install `keyring_aws`, use the general instructions found in Section 8.4.5.3, “Keyring Plugin Installation”, together with the plugin-specific configuration information found here.

The plugin library file contains the `keyring_aws` plugin and two loadable functions, `keyring_aws_rotate_cmk()` and `keyring_aws_rotate_keys()`.

To configure `keyring_aws`, you must obtain a secret access key that provides credentials for communicating with AWS KMS and write it to a configuration file:

1. Create an AWS KMS account.
2. Use AWS KMS to create a secret access key ID and secret access key. The access key serves to verify your identity and that of your applications.

3. Use the AWS KMS account to create a KMS key ID. At MySQL startup, set the `keyring_aws_cmk_id` system variable to the CMK ID value. This variable is mandatory and there is no default. (Its value can be changed at runtime if desired using [`SET GLOBAL`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment").)

4. If necessary, create the directory in which the configuration file should be located. The directory should have a restrictive mode and be accessible only to the account used to run the MySQL server. For example, on many Unix and Unix-like systems, such as Oracle Enterprise Linux, to use `/usr/local/mysql/mysql-keyring/keyring_aws_conf` as the file name, the following commands (executed as `root`) create its parent directory and set the directory mode and ownership:

   ```
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

   ```
   wwwwwwwwwwwwwEXAMPLE
   xxxxxxxxxxxxx/yyyyyyy/zzzzzzzzEXAMPLEKEY
   ```

To be usable during the server startup process, `keyring_aws` must be loaded using the `--early-plugin-load` option. The `keyring_aws_cmk_id` system variable is mandatory and configures the KMS key ID obtained from the AWS KMS server. The `keyring_aws_conf_file` and `keyring_aws_data_file` system variables optionally configure the locations of the files used by the `keyring_aws` plugin for configuration information and data storage. The file location variable default values are platform specific. To configure the locations explicitly, set the variable values at startup. For example, use these lines in the server `my.cnf` file, adjusting the `.so` suffix and file locations for your platform as necessary:

```
[mysqld]
early-plugin-load=keyring_aws.so
keyring_aws_cmk_id='arn:aws:kms:us-west-2:111122223333:key/abcd1234-ef56-ab12-cd34-ef56abcd1234'
keyring_aws_conf_file=/usr/local/mysql/mysql-keyring/keyring_aws_conf
keyring_aws_data_file=/usr/local/mysql/mysql-keyring/keyring_aws_data
```

Note

`--early-plugin-load` is deprecated, and produces a warning whenever it is used. See the description of this option for more information.

For the `keyring_aws` plugin to start successfully, the configuration file must exist and contain valid secret access key information, initialized as described previously. The storage file need not exist. If it does not, `keyring_aws` attempts to create it (as well as its parent directory, if necessary).

Important

The default AWS region is `us-east-1`. For any other region, you must also set `keyring_aws_region` explicitly in `my.cnf`.

For additional information about the system variables used to configure the `keyring_aws` plugin, see Section 8.4.5.19, “Keyring System Variables”.

Start the MySQL server and install the functions associated with the `keyring_aws` plugin. This is a one-time operation, performed by executing the following statements, adjusting the `.so` suffix for your platform as necessary:

```
CREATE FUNCTION keyring_aws_rotate_cmk RETURNS INTEGER
  SONAME 'keyring_aws.so';
CREATE FUNCTION keyring_aws_rotate_keys RETURNS INTEGER
  SONAME 'keyring_aws.so';
```

For additional information about the `keyring_aws` functions, see Section 8.4.5.16, “Plugin-Specific Keyring Key-Management Functions”.

##### keyring_aws Operation

At plugin startup, the `keyring_aws` plugin reads the AWS secret access key ID and key from its configuration file. It also reads any encrypted keys contained in its storage file into its in-memory cache.

During operation, `keyring_aws` maintains encrypted keys in the in-memory cache and uses the storage file as local persistent storage. Each keyring operation is transactional: `keyring_aws` either successfully changes both the in-memory key cache and the keyring storage file, or the operation fails and the keyring state remains unchanged.

To ensure that keys are flushed only when the correct keyring storage file exists, `keyring_aws` stores a SHA-256 checksum of the keyring in the file. Before updating the file, the plugin verifies that it contains the expected checksum.

The `keyring_aws` plugin supports the functions that comprise the standard MySQL Keyring service interface. Keyring operations performed by these functions are accessible at two levels:

* SQL interface: In SQL statements, call the functions described in Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”.

* C interface: In C-language code, call the keyring service functions described in Section 7.6.8.2, “The Keyring Service”.

Example (using the SQL interface):

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

In addition, the `keyring_aws_rotate_cmk()` and `keyring_aws_rotate_keys()` functions “extend” the keyring plugin interface to provide AWS-related capabilities not covered by the standard keyring service interface. These capabilities are accessible only by calling these functions using SQL. There are no corresponding C-language key service functions.

For information about the characteristics of key values permitted by `keyring_aws`, see Section 8.4.5.13, “Supported Keyring Key Types and Lengths”.

##### keyring_aws Credential Changes

Assuming that the `keyring_aws` plugin has initialized properly at server startup, it is possible to change the credentials used for communicating with AWS KMS:

1. Use AWS KMS to create a new secret access key ID and secret access key.

2. Store the new credentials in the configuration file (the file named by the `keyring_aws_conf_file` system variable). The file format is as described previously.

3. Reinitialize the `keyring_aws` plugin so that it re-reads the configuration file. Assuming that the new credentials are valid, the plugin should initialize successfully.

   There are two ways to reinitialize the plugin:

   * Restart the server. This is simpler and has no side effects, but is not suitable for installations that require minimal server downtime with as few restarts as possible.

   * Reinitialize the plugin without restarting the server by executing the following statements, adjusting the `.so` suffix for your platform as necessary:

     ```
     UNINSTALL PLUGIN keyring_aws;
     INSTALL PLUGIN keyring_aws SONAME 'keyring_aws.so';
     ```

     Note

     In addition to loading a plugin at runtime, `INSTALL PLUGIN` has the side effect of registering the plugin it in the `mysql.plugin` system table. Because of this, if you decide to stop using `keyring_aws`, it is not sufficient to remove the `--early-plugin-load` option from the set of options used to start the server. That stops the plugin from loading early, but the server still attempts to load it when it gets to the point in the startup sequence where it loads the plugins registered in `mysql.plugin`.

     Consequently, if you execute the `UNINSTALL PLUGIN` plus `INSTALL PLUGIN` sequence just described to change the AWS KMS credentials, then to stop using `keyring_aws`, it is necessary to execute [`UNINSTALL PLUGIN`](uninstall-plugin.html "15.7.4.6 UNINSTALL PLUGIN Statement") again to unregister the plugin in addition to removing the `--early-plugin-load` option.


#### 8.4.5.9 Using the component_keyring_aws AWS Keyring Component

Note

`component_keyring_aws` is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

The AWS Keyring component is intended to replace the AWS Keyring plugin, which is now deprecated. See Migration from AWS keyring plugin.

The `component_keyring_aws` keyring component stores keys encrypted by AWS KMS, using the Customer Managed Key (CMK) service, in a file local to the server host.

`component_keyring_aws` supports the functions that comprise the standard MySQL Keyring service interface. Keyring operations performed by those functions are accessible in SQL statements as described in Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”.

Example:

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

For information about the characteristics of key values permitted by `component_keyring_aws`, see Section 8.4.5.13, “Supported Keyring Key Types and Lengths”.

To use `component_keyring_aws` for keystore management, you must:

1. Write a manifest that tells the server to load `component_keyring_aws`, as described in Section 8.4.5.2, “Keyring Component Installation”.

   For `component_keyring_aws`, the contents of the manifest file are shown here:

   ```
   {
     "components": "file://component_aws_keyring"
   }
   ```

2. Write a configuration file for `component_keyring_aws`, as described in AWS Keyring Component Configuration.

The AWS keyring component supports two authentication modes, simple and native, as determined by the value of the `aws_authentication.mode` parameter specified in `component_keyring_aws.cnf`. This parameter is required. Configuration of the component for supporting each of these modes can be found in Simple authentication mode, and Native authentication mode, respectively.

* AWS Keyring Component Configuration
* Simple authentication mode
* Native authentication mode
* Migration from AWS keyring plugin

##### AWS Keyring Component Configuration

When it initializes, `component_keyring_aws` reads a component configuration file `component_keyring_aws.cnf`, as described in Section 8.4.5.2, “Keyring Component Installation”.

In some cases, additional information can be read from an AWS configuration file, a credentials file, or both. These files are described later in this section.

If `component_keyring_aws` cannot find the configuration file, an error results, and the component cannot initialize.

The `component_keyring_aws.cnf` component configuration file must be in valid JSON format. Configuration items supported in this file are shown in the following table:

**Table 8.31 component_keyring_aws.cnf Configuration Items**

<table border="1" class="table" summary="This table provides information about configuration items supported in the component_keyring_aws.cnf file."><colgroup><col/><col/><col/><col/><col/><col/><col/></colgroup><thead><tr><th scope="col">Parameter</th><th scope="col">Parent</th><th scope="col">Description</th><th scope="col">Valid</th><th scope="col">Required</th><th scope="col">Default</th><th scope="col">Permitted values</th></tr></thead><tbody><tr><td scope="row"><code>cmk_id</code></td><td>—</td><td>Customer Managed Key (CMK) identifier obtained from AWS KMS server</td><td>—</td><td>Yes</td><td>—</td><td>—</td></tr><tr><td scope="row"><code>data_file</code></td><td>—</td><td>Location of component JSON storage file</td><td>—</td><td>Yes</td><td>—</td><td>—</td></tr><tr><td scope="row"><code>cache_keys</code></td><td>—</td><td><code>true</code>: Keys cached in memory in plaintext; <code>false</code>: Keys decrypted when accessed</td><td>—</td><td>No</td><td><code>false</code></td><td><code>true</code>, <code>false</code></td></tr><tr><td scope="row"><code>mode</code></td><td><code>aws_authentication</code></td><td>AWS authentication mode</td><td>—</td><td>Yes</td><td>—</td><td><code>native</code>, <code>simple</code></td></tr><tr><td scope="row"><code>profile</code></td><td><code>aws_authentication</code></td><td>Name of AWS profile used by AWS native authentication</td><td>When <code>aws_authentication.mode</code> is <code>native</code></td><td>No</td><td><code>default</code></td><td>—</td></tr><tr><td scope="row"><code>region</code></td><td><code>aws_authentication</code></td><td>AWS region</td><td>When <code>aws_authentication.mode</code> is <code>simple</code></td><td>Yes, when <code>aws_authentication.mode</code> is <code>simple</code></td><td><code>us-east-1</code></td><td>—</td></tr><tr><td scope="row"><code>access_key_id</code></td><td><code>aws_authentication</code></td><td>AWS acccess key identifier</td><td>When <code>aws_authentication.mode</code> is <code>simple</code></td><td>Yes, when <code><code>aws_authentication.mode</code> is <code>simple</code></code></td><td>—</td><td>—</td></tr><tr><td scope="row"><code>access_key_secret</code></td><td><code>aws_authentication</code></td><td>AWS acccess key secret</td><td>When <code>aws_authentication.mode</code> is <code>simple</code></td><td>Yes, when <code><code>aws_authentication.mode</code> is <code>simple</code></code></td><td>—</td><td>—</td></tr><tr><td scope="row"><code>connect_timeout_ms</code></td><td><code>aws_connection</code></td><td>Socket connection timeout</td><td> </td><td>No</td><td><code>1000</code></td><td>—</td></tr><tr><td scope="row"><code>host</code></td><td><code>aws_connection.proxy</code></td><td>Proxy host</td><td>—</td><td>No</td><td>—</td><td>—</td></tr><tr><td scope="row"><code>port</code></td><td><code>aws_connection.proxy</code></td><td>Proxy port</td><td>—</td><td>No</td><td>—</td><td>—</td></tr><tr><td scope="row"><code>user</code></td><td><code>aws_connection.proxy</code></td><td>Proxy user name</td><td>—</td><td>No</td><td>—</td><td>—</td></tr><tr><td scope="row"><code>password</code></td><td><code>aws_connection.proxy</code></td><td>Proxy user password</td><td>—</td><td>No</td><td>—</td><td>—</td></tr><tr><td scope="row"><code>read_only</code></td><td>—</td><td>When <code>true</code>, no operations which modify the keyring are allowed</td><td>—</td><td>No</td><td><code>false</code></td><td><code>true</code>, <code>false</code></td></tr></tbody></table>

`aws_authentication.region` defaults to `us-east-1`, and must be set explicitly for any other region.

Component configuration file parameters that are not valid are ignored. For example, `aws_authentication.access_key_id` and `aws_authentication.access_key_secret` have no effect when the `aws_authentication.mode` is `native`.

The database administrator has the responsibility for creating any configuration files to be used, and for ensuring that their contents are correct. If an error occurs, server startup fails; the administrator must correct any issues indicated by diagnostic messages in the server error log.

Important

Any configuration file that stores a key secret should have a restrictive mode and be accessible only to the account used to run the MySQL server.

Given the preceding configuration file items, to configure `component_keyring_aws`, create a component configuration file named `component_keyring_aws.cnf` in the directory indicated previously.

A read/write keyring data file using JSON format, whose location is determined by the `data_file` configuration item, is also required; the following instructions assume that such a file exists at `/usr/local/mysql/keyring.json`. An example of its content is shown here:

```
{
  "version":"1.0","elements":
    [
      {
        "user":"mary@%",
        "data_id":"key0",
        "data_type":"AES",
        "data":"0102010078865A35D86559D92C3124146819057E927382E061F6EA7613DF2B9B
E72FB0E62C01A1CF92B96934CB08D42D231CF6828A420000006E306C06092A864886F70D010706A0
5F305D020100305806092A864886F70D010701301E060960864801650304012E3011040C19F809F2
7900EACEF99DE2B4020110802BEDA406610AF033504B601C5EC937EFB9F38BB631F68856FF7FA81E
637FCC400BA35900929E99E628E1B3E7",
        "extension":[]
      },
      {
        "user":"mary@%",
        "data_id":"key1",
        "data_type":"AES",
        "data":"0102010078865A35D86559D92C3124146819057E927382E061F6EA7613DF2B9B
E72FB0E62C017CAA36B2F756892C3AFCAA074A13E655000001043082010006092A864886F70D0107
06A081F23081EF0201003081E906092A864 886F70D010701301E060960864801650304012E30110
40CCDECB095F68DE68BC331A0730201108081BB52EF64775CCE3DD47ADD8C274A297EB1A6E988085
C0036D0AAE64DE50BB7D5AC020A12BF70",
        "extension":[]
      },
      {
        "user":"john@%",
        "data_id":"key2",
        "data_type":"AES",
        "data":"0102010078865A35D86559D92C3124146819057E927382E061F6EA7613DF2B9B
E72FB0E62C01BB9CC22B82E3DB50C76FD855DE0CB305000001043082010006092A864886F70D0107
06A081F23081EF0201003081E906092A864886F70D010701301E060960864801650304012E301104
0C778A6EDBA93A1FF27D82F5340201108081BB809B9599C191BF0DF1F7721DB2915F7A02A5928981
BF9264D9B76BE41046C3B5AF60006F4A",
        "extension":[]
        }
    ]
}
```

Note

Each of the `data` values just shown consists of a single line; the values have been wrapped here to fit within the confines of the viewing space.

Keyring operations are transactional: `component_keyring_aws` uses a backup file during write operations to ensure that it can roll back to the original file if an operation fails. The backup file has the same name as the data file with the added suffix `.backup`.

`component_keyring_aws` configuration files may not be placed anywhere within the MySQL server data directory.

##### Simple authentication mode

This mode provides ease of use when more advanced AWS mechanisms are not needed. (This also simplifies upgrading from the legacy AWS keyring plugin to the component; see Migration from AWS keyring plugin.) The `config` and `credentials` files are not used in this case; the configuration is read from the global `component_keyring_aws.cnf` only. To enable simple authentication mode, set `aws_authentication.mode` to `simple` in this file.

In simple mode, the component uses the access key ID and secret obtained from AWS, which are also set in `component_keyring_aws.cnf`, as the values of the `aws_authentication.access_key_id` and `aws_authentication.access_key_secret` configuration items. In addition, you must specify a region using `aws_authentication.region`.

The contents of a sample `component_keyring_aws.cnf` that meets the requirements for enabling simple authentication mode are shown here:

```
{
  "cmk_id": "arn:aws:kms:us-east-1:79566666666:key/d0111111-1111-1111-1111-999999999abd",
  "data_file": "/usr/local/mysql/keyring.json",
  "cache_keys": "true",
  "aws_authentication":
  {
    "mode": "simple",
    "region": "us-east-1",
    "access_key_id": "wwwwwwwwwwwwwEXAMPLE",
    "access_key_secret": "xxxxxxxxxxxxx/yyyyyyy/zzzzzzzzEXAMPLEKEY"
  }
}
```

##### Native authentication mode

When `aws_authentication.mode` is `native`, the AWS keyring component uses the standard AWS authentication configuration mechanism (see [AWS SDKs and Tools: Configuration](https://docs.aws.amazon.com/sdkref/latest/guide/creds-config-files.html)) and the AWS profile specified in the component configuration file. The source for AWS credentials in this case is the AWS default credentials provider chain (see [AWS SDKs and Tools: Standardized credential providers](https://docs.aws.amazon.com/sdkref/latest/guide/standardized-credentials.html)).

Enabling AWS native authentication mode with the AWS Keyring component are more complex, but includes the following advantages:

* Conformance with standard AWS client behavior
* Support for authentication configuration methods other than storing long-term secrets in the same file as other configuration items.

* Possible to leverage the role connected to an AWS container or compute node, thus improving security.

* More flexible configuration, since a wider range of parameters—such as timeouts, proxying, and use of a CA—is available then with the alternative mode.

To enable AWS native authentication, `aws_authentication.mode` must be set to `native` in the `component_keyring_aws.cnf` file, as shown here:

```
{
  "cmk_id": "arn:aws:kms:us-east-1:79566666666:key/d0111111-1111-1111-1111-999999999abd",
  "data_file": "/usr/local/mysql/keyring.json",
  "cache_keys": true,
  "aws_authentication":
  {
    "mode": "native"
  }
}
```

Configuration of the component for AWS native authentication is based on a chain of credentials providers. Each provider uses a different source for credentials; possible sources include files, environment variables, and external services. Credential providers are called in the order specified by the default providers chain described in the next few paragraphs.

**Default credentials provider chain.** A credentials provider chain consists of one or more credential providers. Each such provider provides credentials taken from a different source. Providers are called until credentials are provided and collected for further use. The default chain consists of the credential providers listed here together with the credentials each of them provides:

* `EnvironmentAWSCredentialsProvider`: AWS access keys taken from environment variables (see [AWS SDKs and Tools: AWS access keys](https://docs.aws.amazon.com/sdkref/latest/guide/feature-static-credentials.html) for details). This is convenient in development or other short-term environments, but not recommended for production.

* `ProfileConfigFileAWSCredentialsProvider`: AWS access keys taken from a credentials file \*default section (see [AWS SDKs and Tools: AWS access keys](https://docs.aws.amazon.com/sdkref/latest/guide/feature-static-credentials.html)). This is recommended for MySQL server running outside of AWS.

* `ProcessCredentialsProvider`: AWS access keys taken from the output of an external command specified by the `credential_process` AWS configuration parameter. The output of this command must be in `JSON` format (see [AWS SDKs and Tools: Process credential provider](https://docs.aws.amazon.com/sdkref/latest/guide/feature-process-credentials.html)).

* `STSAssumeRoleWebIdentityCredentialsProvider`: A set of temporary security credentials for a specific role (see [AWS SDKs and Tools: Assume role credential provider](https://docs.aws.amazon.com/sdkref/latest/guide/feature-assume-role-credentials.html)).

* `SSOCredentialsProvider`: Credentials from the AWS IAM Identity Center (see [AWS SDKs and Tools: IAM Identity Center credential provider](https://docs.aws.amazon.com/sdkref/latest/guide/feature-sso-credentials.html)).

* `TaskRoleCredentialsProvider`: Credentials for use within an AWS ECS container (see [AWS SDKs and Tools: Amazon ECS task role](https://docs.aws.amazon.com/sdkref/latest/guide/developerguide/task-iam-roles.html)). This is recommended when the MySQL server runs within an AWS ECS container.

* `InstanceProfileCredentialsProvider`: Credentials loaded from the Amazon EC2 Instance Metadata Service (IMDS) (see [AWS SDKs and Tools: IMDS credential provider](https://docs.aws.amazon.com/sdkref/latest/guide/feature-imds-credentials.html)). This is recommended when the MySQL server runs in an AWS EC2 node.

To use AWS native authentication, `aws_authentication.mode` must be set to `native` in the `component_keyring_aws.cnf` file, as shown here:

```
{
  "cmk_id": "arn:aws:kms:us-east-1:79566666666:key/d0111111-1111-1111-1111-999999999abd",
  "data_file": "/usr/local/mysql/keyring.json",
  "cache_keys": true,
  "aws_authentication":
  {
    "mode": "native"
  }
}
```

The AWS configuration file (`config`) uses INI format similar to that employed in the MySQL Server `my.cnf` file. You can specify a section of this file to be read by setting `aws_authentication.profile`. For example, setting `aws_authentication.profile` to `mysql` causes the component to read the `[mysql]` section of `config`, as shown here:

```
{
  "cmk_id": "arn:aws:kms:us-east-1:79566666666:key/d0111111-1111-1111-1111-999999999abd",
  "data_file": "/usr/local/mysql/keyring.json",
  "cache_keys": true,
  "aws_authentication":
  {
    "mode": "native",
    "profile": "mysql"
  }
}
```

If `aws_authentication.profile` is not specified, the component tries to read the `config` file section labelled `[default]`.

The AWS keyring component also supports an AWS `credentials` file to act as a source of credentials for the provider `ProfileConfigFileAWSCredentialsProvider` as described later in this section's discussion of native authentication mode. This file's location is determined in the same way as that of the `component_keyring_aws.cnf` and `config` files. To override the default for the `credentials` file (`%USERPROFILE%\.aws\credentials` for Windows, `~/.aws/credentials for Linux or MacOS`), set the `AWS_SHARED_CREDENTIALS_FILE` environment variable to the desired location.

##### Migration from AWS keyring plugin

To migrate from the AWS keyring plugin to the AWS keyring component, it is necessary to perform the following steps:

1. Create an equivalent configuration for the component:

   1. Write a local or global manifest file `mysqld.my` (see Section 8.4.5.2, “Keyring Component Installation”). The content of the file must match what is shown here:

      ```
      {
        "components": "file://component_keyring_aws"
      }
      ```

   2. Write a component configuration file `component_keyring_aws.cnf` as described in Section 8.4.5.4, “Using the component_keyring_file File-Based Keyring Component” (in the example for `component_keyring_file`). See also the instructions given for configuration simple configuration section. In particular, the value of the `cmk_id` configuration item used by the component must be set to the that of the `keyring_aws_cmk_id` used by the plugin; similarly, the `aws_region` item's value must be set to the value of `keyring_aws_region`. For example:

      ```
      {
        "cmk_id": "arn:aws:kms:us-east-1:79566666666:key/d0111111-1111-1111-1111-999999999abd",
        "data_file": "/usr/local/mysql/keyring.json",
        "cache_keys": true,
        "aws_authentication":
        {
           "mode":"simple",
           "region": "us-east-1",
           "access_key_id": "wwwwwwwwwwwwwEXAMPLE",
           "access_key_secret": "xxxxxxxxxxxxx/yyyyyyy/zzzzzzzzEXAMPLEKEY"
         }
      }
      ```

      Values of the access key ID and secret just shown must be copied from the `keyring_aws` configuration file used by the AWS keyring plugin (see Section 8.4.5.8, “Using the keyring_aws Amazon Web Services Keyring Plugin”).

2. Perform key migration as described in Section 8.4.5.14, “Migrating Keys Between Keyring Keystores”.

3. Uninstall the plugin.


#### 8.4.5.10 Using the HashiCorp Vault Keyring Plugin

Note

The `keyring_hashicorp` plugin is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

Important

The `keyring_hashicorp` keyring plugin is deprecated, and is being replaced by the Hashicorp Keyring component (`component_keyring_hashicorp`). Deprecation of the plugin means that you should expect the plugin to be removed in a future version of MySQL. For more information, including information about migrating from the `keyring_hashicorp` plugin to `component_keyring_hashicorp`, see Section 8.4.5.11, “Using the HashiCorp Vault Keyring Component”.

The `keyring_hashicorp` keyring plugin communicates with HashiCorp Vault for back end storage. The plugin supports HashiCorp Vault AppRole authentication. No key information is permanently stored in MySQL server local storage. (An optional in-memory key cache may be used as intermediate storage.) Random key generation is performed on the MySQL server side, with the keys subsequently stored to Hashicorp Vault.

The `keyring_hashicorp` plugin supports the functions that comprise the standard MySQL Keyring service interface. Keyring operations performed by those functions are accessible at two levels:

* SQL interface: In SQL statements, call the functions described in Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”.

* C interface: In C-language code, call the keyring service functions described in Section 7.6.8.2, “The Keyring Service”.

Example (using the SQL interface):

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

For information about the characteristics of key values permitted by `keyring_hashicorp`, see Section 8.4.5.13, “Supported Keyring Key Types and Lengths”.

To install `keyring_hashicorp`, use the general instructions found in Section 8.4.5.3, “Keyring Plugin Installation”, together with the configuration information specific to `keyring_hashicorp` found here. Plugin-specific configuration includes preparation of the certificate and key files needed for connecting to HashiCorp Vault, as well as configuring HashiCorp Vault itself. The following sections provide the necessary instructions.

* Certificate and Key Preparation
* HashiCorp Vault Setup
* keyring_hashicorp Configuration

##### Certificate and Key Preparation

The `keyring_hashicorp` plugin requires a secure connection to the HashiCorp Vault server, employing the HTTPS protocol. A typical setup includes a set of certificate and key files:

* `company.crt`: A custom CA certificate belonging to the organization. This file is used both by HashiCorp Vault server and the `keyring_hashicorp` plugin.

* `vault.key`: The private key of the HashiCorp Vault server instance. This file is used by HashiCorp Vault server.

* `vault.crt`: The certificate of the HashiCorp Vault server instance. This file must be signed by the organization CA certificate.

The following instructions describe how to create the certificate and key files using OpenSSL. (If you already have those files, proceed to HashiCorp Vault Setup.) The instructions as shown apply to Linux platforms and may require adjustment for other platforms.

Important

Certificates generated by these instructions are self-signed, which may not be very secure. After you gain experience using such files, consider obtaining certificate/key material from a registered certificate authority.

1. Prepare the company and HashiCorp Vault server keys.

   Use the following commands to generate the key files:

   ```
   openssl genrsa -aes256 -out company.key 4096
   openssl genrsa -aes256 -out vault.key 2048
   ```

   The commands produce files holding the company private key (`company.key`) and the Vault server private key (`vault.key`). The keys are randomly generated RSA keys of 4,096 and 2,048 bits, respectively.

   Each command prompts for a password. For testing purposes, the password is not required. To disable it, omit the `-aes256` argument.

   The key files hold sensitive information and should be stored in a secure location. The password (also sensitive) is required later, so write it down and store it in a secure location.

   (Optional) To check key file content and validity, use the following commands:

   ```
   openssl rsa -in company.key -check
   openssl rsa -in vault.key -check
   ```

2. Create the company CA certificate.

   Use the following command to create a company CA certificate file named `company.crt` that is valid for 365 days (enter the command on a single line):

   ```
   openssl req -x509 -new -nodes -key company.key
     -sha256 -days 365 -out company.crt
   ```

   If you used the `-aes256` argument to perform key encryption during key generation, you are prompted for the company key password during CA certificate creation. You are also prompted for information about the certificate holder (that is, you or your company), as shown here:

   ```
   Country Name (2 letter code) [AU]:
   State or Province Name (full name) [Some-State]:
   Locality Name (eg, city) []:
   Organization Name (eg, company) [Internet Widgits Pty Ltd]:
   Organizational Unit Name (eg, section) []:
   Common Name (e.g. server FQDN or YOUR name) []:
   Email Address []:
   ```

   Answer the prompts with appropriate values.

3. Create a certificate signing request.

   To create a HashiCorp Vault server certificate, a Certificate Signing Request (CSR) must be prepared for the newly created server key. Create a configuration file named `request.conf` containing the following lines. If the HashiCorp Vault server does not run on the local host, substitute appropriate CN and IP values, and make any other changes required.

   ```
   [req]
   distinguished_name = vault
   x509_entensions = v3_req
   prompt = no

   [vault]
   C = US
   ST = CA
   L = RWC
   O = Company
   CN = 127.0.0.1

   [v3_req]
   subjectAltName = @alternatives
   authorityKeyIdentifier = keyid,issuer
   basicConstraints = CA:TRUE

   [alternatives]
   IP = 127.0.0.1
   ```

   Use this command to create the signing request:

   ```
   openssl req -new -key vault.key -config request.conf -out request.csr
   ```

   The output file (`request.csr`) is an intermediate file that serves as input for creation of the server certificate.

4. Create the HashiCorp Vault server certificate.

   Sign the combined information from the HashiCorp Vault server key (`vault.key`) and the CSR (`request.csr`) with the company certificate (`company.crt`) to create the HashiCorp Vault server certificate (`vault.crt`). Use the following command to do this (enter the command on a single line):

   ```
   openssl x509 -req -in request.csr
     -CA company.crt -CAkey company.key -CAcreateserial
     -out vault.crt -days 365 -sha256
   ```

   To make the `vault.crt` server certificate useful, append the contents of the `company.crt` company certificate to it. This is required so that the company certificate is delivered along with the server certificate in requests.

   ```
   cat company.crt >> vault.crt
   ```

   If you display the contents of the `vault.crt` file, it should look like this:

   ```
   -----BEGIN CERTIFICATE-----
   ... content of HashiCorp Vault server certificate ...
   -----END CERTIFICATE-----
   -----BEGIN CERTIFICATE-----
   ... content of company certificate ...
   -----END CERTIFICATE-----
   ```

##### HashiCorp Vault Setup

The following instructions describe how to create a HashiCorp Vault setup that facilitates testing the `keyring_hashicorp` plugin.

Important

A test setup is similar to a production setup, but production use of HashiCorp Vault entails additional security considerations such as use of non-self-signed certificates and storing the company certificate in the system trust store. You must implement whatever additional security steps are needed to satisfy your operational requirements.

These instructions assume availability of the certificate and key files created in Certificate and Key Preparation. See that section if you do not have those files.

1. Fetch the HashiCorp Vault binary.

   Download the HashiCorp Vault binary appropriate for your platform from <https://www.vaultproject.io/downloads.html>.

   Extract the content of the archive to produce the executable **vault** command, which is used to perform HashiCorp Vault operations. If necessary, add the directory where you install the command to the system path.

   (Optional) HashiCorp Vault supports autocomplete options that make it easier to use. For more information, see <https://learn.hashicorp.com/vault/getting-started/install#command-completion>.

2. Create the HashiCorp Vault server configuration file.

   Prepare a configuration file named `config.hcl` with the following content. For the `tls_cert_file`, `tls_key_file`, and `path` values, substitute path names appropriate for your system.

   ```
   listener "tcp" {
     address="127.0.0.1:8200"
     tls_cert_file="/home/username/certificates/vault.crt"
     tls_key_file="/home/username/certificates/vault.key"
   }

   storage "file" {
     path = "/home/username/vaultstorage/storage"
   }

   ui = true
   ```

3. Start the HashiCorp Vault server.

   To start the Vault server, use the following command, where the `-config` option specifies the path to the configuration file just created:

   ```
   vault server -config=config.hcl
   ```

   During this step, you may be prompted for a password for the Vault server private key stored in the `vault.key` file.

   The server should start, displaying some information on the console (IP, port, and so forth).

   So that you can enter the remaining commands, put the **vault server** command in the background or open another terminal before continuing.

4. Initialize the HashiCorp Vault server.

   Note

   The operations described in this step are required only when starting Vault the first time, to obtain the unseal key and root token. Subsequent Vault instance restarts require only unsealing using the unseal key.

   Issue the following commands (assuming Bourne shell syntax):

   ```
   export VAULT_SKIP_VERIFY=1
   vault operator init -n 1 -t 1
   ```

   The first command enables the **vault** command to temporarily ignore the fact that no company certificate has been added to the system trust store. It compensates for the fact that our self-signed CA is not added to that store. (For production use, such a certificate should be added.)

   The second command creates a single unseal key with a requirement for a single unseal key to be present for unsealing. (For production use, an instance would have multiple unseal keys with up to that many keys required to be entered to unseal it. The unseal keys should be delivered to key custodians within the company. Use of a single key might be considered a security issue because that permits the vault to be unsealed by a single key custodian.)

   Vault should reply with information about the unseal key and root token, plus some additional text (the actual unseal key and root token values differ from those shown here):

   ```
   ...
   Unseal Key 1: I2xwcFQc892O0Nt2pBiRNlnkHzTUrWS+JybL39BjcOE=
   Initial Root Token: s.vTvXeo3tPEYehfcd9WH7oUKz
   ...
   ```

   Store the unseal key and root token in a secure location.

5. Unseal the HashiCorp Vault server.

   Use this command to unseal the Vault server:

   ```
   vault operator unseal
   ```

   When prompted to enter the unseal key, use the key obtained previously during Vault initialization.

   Vault should produce output indicating that setup is complete and the vault is unsealed.

6. Log in to the HashiCorp Vault server and verify its status.

   Prepare the environment variables required for logging in as root:

   ```
   vault login s.vTvXeo3tPEYehfcd9WH7oUKz
   ```

   For the token value in that command, substitute the content of the root token obtained previously during Vault initialization.

   Verify the Vault server status:

   ```
   vault status
   ```

   The output should contain these lines (among others):

   ```
   ...
   Initialized     true
   Sealed          false
   ...
   ```

7. Set up HashiCorp Vault authentication and storage.

   Note

   The operations described in this step are needed only the first time the Vault instance is run. They need not be repeated afterward.

   Enable the AppRole authentication method and verify that it is in the authentication method list:

   ```
   vault auth enable approle
   vault auth list
   ```

   Enable the Vault KeyValue storage engine:

   ```
   vault secrets enable -version=1 kv
   ```

   Create and set up a role for use with the `keyring_hashicorp` plugin (enter the command on a single line):

   ```
   vault write auth/approle/role/mysql token_num_uses=0
     token_ttl=20m token_max_ttl=30m secret_id_num_uses=0
   ```

8. Add an AppRole security policy.

   Note

   The operations described in this step are needed only the first time the Vault instance is run. They need not be repeated afterward.

   Prepare a policy that to permit the previously created role to access appropriate secrets. Create a new file named `mysql.hcl` with the following content:

   ```
   path "kv/mysql/*" {
     capabilities = ["create", "read", "update", "delete", "list"]
   }
   ```

   Note

   `kv/mysql/` in this example may need adjustment per your local installation policies and security requirements. If so, make the same adjustment wherever else `kv/mysql/` appears in these instructions.

   Import the policy file to the Vault server to create a policy named `mysql-policy`, then assign the policy to the new role:

   ```
   vault policy write mysql-policy mysql.hcl
   vault write auth/approle/role/mysql policies=mysql-policy
   ```

   Obtain the ID of the newly created role and store it in a secure location:

   ```
   vault read auth/approle/role/mysql/role-id
   ```

   Generate a secret ID for the role and store it in a secure location:

   ```
   vault write -f auth/approle/role/mysql/secret-id
   ```

   After these AppRole role ID and secret ID credentials are generated, they are expected to remain valid indefinitely. They need not be generated again and the `keyring_hashicorp` plugin can be configured with them for use on an ongoing basis. For more information about AuthRole authentication, visit <https://www.vaultproject.io/docs/auth/approle.html>.

##### keyring_hashicorp Configuration

The plugin library file contains the `keyring_hashicorp` plugin and a loadable function, `keyring_hashicorp_update_config()`. When the plugin initializes and terminates, it automatically loads and unloads the function. There is no need to load and unload the function manually.

The `keyring_hashicorp` plugin supports the configuration parameters shown in the following table. To specify these parameters, assign values to the corresponding system variables.

<table summary="keyring_hashicorp configuration parameters and corresponding system variables."><col style="width: 35%"/><col style="width: 50%"/><col style="width: 15%"/><thead><tr> <th scope="col">Configuration Parameter</th> <th scope="col">System Variable</th> <th scope="col">Mandatory</th> </tr></thead><tbody><tr> <th scope="row">HashiCorp Server URL</th> <td><code>keyring_hashicorp_server_url</code></td> <td>No</td> </tr><tr> <th scope="row">AppRole role ID</th> <td><code>keyring_hashicorp_role_id</code></td> <td>Yes</td> </tr><tr> <th scope="row">AppRole secret ID</th> <td><code>keyring_hashicorp_secret_id</code></td> <td>Yes</td> </tr><tr> <th scope="row">Store path</th> <td><code>keyring_hashicorp_store_path</code></td> <td>Yes</td> </tr><tr> <th scope="row">Authorization Path</th> <td><code>keyring_hashicorp_auth_path</code></td> <td>No</td> </tr><tr> <th scope="row">CA certificate file path</th> <td><code>keyring_hashicorp_ca_path</code></td> <td>No</td> </tr><tr> <th scope="row">Cache control</th> <td><code>keyring_hashicorp_caching</code></td> <td>No</td> </tr></tbody></table>

To be usable during the server startup process, `keyring_hashicorp` must be loaded using the `--early-plugin-load` option. As indicated by the preceding table, several plugin-related system variables are mandatory and must also be set. For example, use these lines in the server `my.cnf` file, adjusting the `.so` suffix and file locations for your platform as necessary:

```
[mysqld]
early-plugin-load=keyring_hashicorp.so
keyring_hashicorp_role_id='ee3b495c-d0c9-11e9-8881-8444c71c32aa'
keyring_hashicorp_secret_id='0512af29-d0ca-11e9-95ee-0010e00dd718'
keyring_hashicorp_store_path='/v1/kv/mysql'
keyring_hashicorp_auth_path='/v1/auth/approle/login'
```

Note

`--early-plugin-load` is deprecated, and produces a warning whenever it is used. See the description of this option for more information.

Note

Per the [HashiCorp documentation](https://www.vaultproject.io/api-docs), all API routes are prefixed with a protocol version (which you can see in the preceding example as `/v1/` in the `keyring_hashicorp_store_path` and `keyring_hashicorp_auth_path` values). If HashiCorp develops new protocol versions, it may be necessary to change `/v1/` to something else in your configuration.

MySQL Server authenticates against HashiCorp Vault using AppRole authentication. Successful authentication requires that two secrets be provided to Vault, a role ID and a secret ID, which are similar in concept to user name and password. The role ID and secret ID values to use are those obtained during the HashiCorp Vault setup procedure performed previously. To specify the two IDs, assign their respective values to the `keyring_hashicorp_role_id` and `keyring_hashicorp_secret_id` system variables. The setup procedure also results in a store path of `/v1/kv/mysql`, which is the value to assign to `keyring_hashicorp_commit_store_path`.

At plugin initialization time, `keyring_hashicorp` attempts to connect to the HashiCorp Vault server using the configuration values. If the connection is successful, the plugin stores the values in corresponding system variables that have `_commit_` in their name. For example, upon successful connection, the plugin stores the values of `keyring_hashicorp_role_id` and `keyring_hashicorp_store_path` in `keyring_hashicorp_commit_role_id` and `keyring_hashicorp_commit_store_path`.

Reconfiguration at runtime can be performed with the assistance of the `keyring_hashicorp_update_config()` function:

1. Use `SET` statements to assign the desired new values to the configuration system variables shown in the preceding table. These assignments in themselves have no effect on ongoing plugin operation.

2. Invoke `keyring_hashicorp_update_config()` to cause the plugin to reconfigure and reconnect to the HashiCorp Vault server using the new variable values.

3. If the connection is successful, the plugin stores the updated configuration values in corresponding system variables that have `_commit_` in their name.

For example, if you have reconfigured HashiCorp Vault to listen on port 8201 rather than the default 8200, reconfigure `keyring_hashicorp` like this:

```
mysql> SET GLOBAL keyring_hashicorp_server_url = 'https://127.0.0.1:8201';
Query OK, 0 rows affected (0.00 sec)

mysql> SELECT keyring_hashicorp_update_config();
+--------------------------------------+
| keyring_hashicorp_update_config()    |
+--------------------------------------+
| Configuration update was successful. |
+--------------------------------------+
1 row in set (0.03 sec)
```

If the plugin is not able to connect to HashiCorp Vault during initialization or reconfiguration and there was no existing connection, the `_commit_` system variables are set to `'Not committed'` for string-valued variables, and `OFF` for Boolean-valued variables. If the plugin is not able to connect but there was an existing connection, that connection remains active and the `_commit_` variables reflect the values used for it.

Note

If you do not set the mandatory system variables at server startup, or if some other plugin initialization error occurs, initialization fails. In this case, you can use the runtime reconfiguration procedure to initialize the plugin without restarting the server.

For additional information about the `keyring_hashicorp` plugin-specific system variables and function, see Section 8.4.5.19, “Keyring System Variables”, and Section 8.4.5.16, “Plugin-Specific Keyring Key-Management Functions”.


#### 8.4.5.11 Using the HashiCorp Vault Keyring Component

Note

The `component_keyring_hashicorp` component is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

The `component_keyring_hashicorp` keyring component communicates with HashiCorp Vault for back end storage, and supports HashiCorp Vault AppRole authentication. No key information is permanently stored in the MySQL server's local storage. (An optional in-memory key cache may be used as intermediate storage.) Random key generation is performed on the MySQL server side, with the keys subsequently stored in Hashicorp Vault.

`component_keyring_hashicorp` is intended to replace the `keyring_hashicorp` plugin (which is now deprecated), and makes use of the component infrastructure. For more information, see [Keyring Components Versus Keyring Plugins](keyring-component-plugin-comparison.html "8.4.5.1 Keyring Components Versus Keyring Plugins").

The `keyring_hashicorp` components supports the functions that comprise the standard MySQL Keyring service interface. Keyring operations performed by those functions are accessible at two levels:

* SQL interface: In SQL statements, call the functions described in Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”.

* C interface: In C-language code, call the keyring service functions described in Section 7.6.8.2, “The Keyring Service”.

Example (using the SQL interface):

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

For information about the characteristics of key values permitted by `keyring_hashicorp`, see Section 8.4.5.13, “Supported Keyring Key Types and Lengths”.

To install `component_keyring_hashicorp`, use the general instructions found in Section 8.4.5.2, “Keyring Component Installation”, together with the configuration information specific to `component_keyring_hashicorp` found here. Component-specific configuration includes preparation of the certificate and key files needed for connecting to HashiCorp Vault, as well as configuring HashiCorp Vault itself. The following sections provide the necessary instructions.

* Certificate and Key Preparation
* HashiCorp Vault Setup
* component_keyring_hashicorp Configuration
* Migration from HashiCorp Vault Plugin

##### Certificate and Key Preparation

The `keyring_hashicorp` component requires a secure connection to the HashiCorp Vault server, employing the HTTPS protocol. A typical setup includes a set of certificate and key files:

* `company.crt`: A custom CA certificate belonging to the organization. This file is used both by HashiCorp Vault server and the `keyring_hashicorp` plugin.

* `vault.key`: The private key of the HashiCorp Vault server instance. This file is used by HashiCorp Vault server.

* `vault.crt`: The certificate of the HashiCorp Vault server instance. This file must be signed by the organization CA certificate.

The following instructions describe how to create the certificate and key files using OpenSSL. (If you already have those files, proceed to HashiCorp Vault Setup.) The instructions as shown apply to Linux platforms and may require adjustment for other platforms.

Important

Certificates generated by these instructions are self-signed, which may not be very secure. After you gain experience using such files, consider obtaining certificate/key material from a registered certificate authority.

1. Prepare the company and HashiCorp Vault server keys.

   Use the following commands to generate the key files:

   ```
   openssl genrsa -aes256 -out company.key 4096
   openssl genrsa -aes256 -out vault.key 2048
   ```

   The commands produce files holding the company private key (`company.key`) and the Vault server private key (`vault.key`). The keys are randomly generated RSA keys of 4,096 and 2,048 bits, respectively.

   Each command prompts for a password. For testing purposes, the password is not required. To disable it, omit the `-aes256` argument.

   The key files hold sensitive information and should be stored in a secure location. The password (also sensitive) is required later, so write it down and store it in a secure location.

   (Optional) To check key file content and validity, use the following commands:

   ```
   openssl rsa -in company.key -check
   openssl rsa -in vault.key -check
   ```

2. Create the company CA certificate.

   Use the following command to create a company CA certificate file named `company.crt` that is valid for 365 days (enter the command on a single line):

   ```
   openssl req -x509 -new -nodes -key company.key
     -sha256 -days 365 -out company.crt
   ```

   If you used the `-aes256` argument to perform key encryption during key generation, you are prompted for the company key password during CA certificate creation. You are also prompted for information about the certificate holder (that is, you or your company), as shown here:

   ```
   Country Name (2 letter code) [AU]:
   State or Province Name (full name) [Some-State]:
   Locality Name (eg, city) []:
   Organization Name (eg, company) [Internet Widgits Pty Ltd]:
   Organizational Unit Name (eg, section) []:
   Common Name (e.g. server FQDN or YOUR name) []:
   Email Address []:
   ```

   Answer the prompts with appropriate values.

3. Create a certificate signing request.

   To create a HashiCorp Vault server certificate, a Certificate Signing Request (CSR) must be prepared for the newly created server key. Create a configuration file named `request.conf` containing the following lines. If the HashiCorp Vault server does not run on the local host, substitute appropriate CN and IP values, and make any other changes required.

   ```
   [req]
   distinguished_name = vault
   x509_entensions = v3_req
   prompt = no

   [vault]
   C = US
   ST = CA
   L = RWC
   O = Company
   CN = 127.0.0.1

   [v3_req]
   subjectAltName = @alternatives
   authorityKeyIdentifier = keyid,issuer
   basicConstraints = CA:TRUE

   [alternatives]
   IP = 127.0.0.1
   ```

   Use this command to create the signing request:

   ```
   openssl req -new -key vault.key -config request.conf -out request.csr
   ```

   The output file (`request.csr`) is an intermediate file that serves as input for creation of the server certificate.

4. Create the HashiCorp Vault server certificate.

   Sign the combined information from the HashiCorp Vault server key (`vault.key`) and the CSR (`request.csr`) with the company certificate (`company.crt`) to create the HashiCorp Vault server certificate (`vault.crt`). Use the following command to do this (enter the command on a single line):

   ```
   openssl x509 -req -in request.csr
     -CA company.crt -CAkey company.key -CAcreateserial
     -out vault.crt -days 365 -sha256
   ```

   To make the `vault.crt` server certificate useful, append the contents of the `company.crt` company certificate to it. This is required so that the company certificate is delivered along with the server certificate in requests.

   ```
   cat company.crt >> vault.crt
   ```

   If you display the contents of the `vault.crt` file, it should look like this:

   ```
   -----BEGIN CERTIFICATE-----
   ... content of HashiCorp Vault server certificate ...
   -----END CERTIFICATE-----
   -----BEGIN CERTIFICATE-----
   ... content of company certificate ...
   -----END CERTIFICATE-----
   ```

##### HashiCorp Vault Setup

The following instructions describe how to create a HashiCorp Vault setup that facilitates testing the `component_keyring_hashicorp` component.

Important

A test setup is similar to a production setup, but production use of HashiCorp Vault entails additional security considerations such as use of non-self-signed certificates and storing the company certificate in the system trust store. You must implement whatever additional security steps are needed to satisfy your operational requirements.

These instructions assume availability of the certificate and key files created in Certificate and Key Preparation. See that section if you do not have those files.

1. Fetch the HashiCorp Vault binary.

   Download the HashiCorp Vault binary appropriate for your platform from <https://www.vaultproject.io/downloads.html>.

   Extract the content of the archive to produce the executable **vault** command, which is used to perform HashiCorp Vault operations. If necessary, add the directory where you install the command to the system path.

   (Optional) HashiCorp Vault supports autocomplete options that make it easier to use. For more information, see <https://learn.hashicorp.com/vault/getting-started/install#command-completion>.

2. Create the HashiCorp Vault server configuration file.

   Prepare a configuration file named `config.hcl` with the following content. For the `tls_cert_file`, `tls_key_file`, and `path` values, substitute path names appropriate for your system.

   ```
   listener "tcp" {
     address="127.0.0.1:8200"
     tls_cert_file="/home/username/certificates/vault.crt"
     tls_key_file="/home/username/certificates/vault.key"
   }

   storage "file" {
     path = "/home/username/vaultstorage/storage"
   }

   ui = true
   ```

3. Start the HashiCorp Vault server.

   To start the Vault server, use the following command, where the `-config` option specifies the path to the configuration file just created:

   ```
   vault server -config=config.hcl
   ```

   During this step, you may be prompted for a password for the Vault server private key stored in the `vault.key` file.

   The server should start, displaying some information on the console (IP, port, and so forth).

   So that you can enter the remaining commands, put the **vault server** command in the background or open another terminal before continuing.

4. Initialize the HashiCorp Vault server.

   Note

   The operations described in this step are required only when starting Vault the first time, to obtain the unseal key and root token. Subsequent Vault instance restarts require only unsealing using the unseal key.

   Issue the following commands (assuming Bourne shell syntax):

   ```
   export VAULT_SKIP_VERIFY=1
   vault operator init -n 1 -t 1
   ```

   The first command enables the **vault** command to temporarily ignore the fact that no company certificate has been added to the system trust store. It compensates for the fact that our self-signed CA is not added to that store. (For production use, such a certificate should be added.)

   The second command creates a single unseal key with a requirement for a single unseal key to be present for unsealing. (For production use, an instance would have multiple unseal keys with up to that many keys required to be entered to unseal it. The unseal keys should be delivered to key custodians within the company. Use of a single key might be considered a security issue because that permits the vault to be unsealed by a single key custodian.)

   Vault should reply with information about the unseal key and root token, plus some additional text (the actual unseal key and root token values differ from those shown here):

   ```
   ...
   Unseal Key 1: I2xwcFQc892O0Nt2pBiRNlnkHzTUrWS+JybL39BjcOE=
   Initial Root Token: s.vTvXeo3tPEYehfcd9WH7oUKz
   ...
   ```

   Store the unseal key and root token in a secure location.

5. Unseal the HashiCorp Vault server.

   Use this command to unseal the Vault server:

   ```
   vault operator unseal
   ```

   When prompted to enter the unseal key, use the key obtained previously during Vault initialization.

   Vault should produce output indicating that setup is complete and the vault is unsealed.

6. Log in to the HashiCorp Vault server and verify its status.

   Prepare the environment variables required for logging in as root:

   ```
   vault login s.vTvXeo3tPEYehfcd9WH7oUKz
   ```

   For the token value in that command, substitute the content of the root token obtained previously during Vault initialization.

   Verify the Vault server status:

   ```
   vault status
   ```

   The output should contain these lines (among others):

   ```
   ...
   Initialized     true
   Sealed          false
   ...
   ```

7. Set up HashiCorp Vault authentication and storage.

   Note

   The operations described in this step are needed only the first time the Vault instance is run. They need not be repeated afterward.

   Enable the AppRole authentication method and verify that it is in the authentication method list:

   ```
   vault auth enable approle
   vault auth list
   ```

   Enable the Vault KeyValue storage engine:

   ```
   vault secrets enable -version=1 kv
   ```

   Create and set up a role for use with the `keyring_hashicorp` plugin (enter the command on a single line):

   ```
   vault write auth/approle/role/mysql token_num_uses=0
     token_ttl=20m token_max_ttl=30m secret_id_num_uses=0
   ```

8. Add an AppRole security policy.

   Note

   The operations described in this step are needed only the first time the Vault instance is run. They need not be repeated afterward.

   Prepare a policy that to permit the previously created role to access appropriate secrets. Create a new file named `mysql.hcl` with the following content:

   ```
   path "kv/mysql/*" {
     capabilities = ["create", "read", "update", "delete", "list"]
   }
   ```

   Note

   `kv/mysql/` in this example may need adjustment per your local installation policies and security requirements. If so, make the same adjustment wherever else `kv/mysql/` appears in these instructions.

   Import the policy file to the Vault server to create a policy named `mysql-policy`, then assign the policy to the new role:

   ```
   vault policy write mysql-policy mysql.hcl
   vault write auth/approle/role/mysql policies=mysql-policy
   ```

   Obtain the ID of the newly created role and store it in a secure location:

   ```
   vault read auth/approle/role/mysql/role-id
   ```

   Generate a secret ID for the role and store it in a secure location:

   ```
   vault write -f auth/approle/role/mysql/secret-id
   ```

   After these AppRole role ID and secret ID credentials are generated, they are expected to remain valid indefinitely. They need not be generated again and the `keyring_hashicorp` plugin can be configured with them for use on an ongoing basis. For more information about AuthRole authentication, visit <https://www.vaultproject.io/docs/auth/approle.html>.

##### component_keyring_hashicorp Configuration

When it initializes, `component_keyring_hashicorp` reads a component global configuration file named `component_keyring_hashicorp.cnf` in `plugin_dir`. If this file contains `{"read_local_config": true}`, the component ignores any other items in the global file, and instead attempts to read its configuration information from a local configuration file (also named `component_keyring_hashicorp.cnf`) in the MySQL data directory (`datadir`).

If the component does not find the global configuration file or (in cases where it looks for one) a local configuration file, it cannot start.

The `component_keyring_hashicorp.cnf` configuration file or files must be in valid JSON format.

Configuration items supported in `component_keyring_hashicorp.cnf` are shown in the following table:

<table summary="component_keyring_hashicorp configuration items."><col style="width: 15%"/><col style="width: 20%"/><col style="width: 10%"/><col style="width: 20%"/><col style="width: 15%"/><col style="width: 20%"/><thead><tr> <th scope="col">Configuration Item</th> <th scope="col">Description</th> <th scope="col">Required</th> <th scope="col">Valid Values</th> <th scope="col">Default</th> <th scope="col">Corresponding System Variable</th> </tr></thead><tbody><tr> <th scope="row"><code>auth_mode</code></th> <td>Whether to use AppRole or token-based authentication.</td> <td>No.</td> <td><code>approle</code>, <code>token</code></td> <td><code>approle</code></td> <td>None</td> </tr><tr> <th scope="row"><code>auth_path</code></th> <td>Authentication path where AppRole authentication is enabled within the HashiCorp Vault server.</td> <td>No.</td> <td>Valid Unix-style file system path; cannot be empty.</td> <td><code>/v1/auth/approle/login</code></td> <td><code>keyring_hashicorp_auth_path</code></td> </tr><tr> <th scope="row"><code>ca_path</code></th> <td>Path to local file (accessible to MySQL server) containing properly formatted TLS certificate authority.</td> <td>No</td> <td>File system path valid for the system hosting the MySQL server. Path must be absolute.</td> <td>Empty string</td> <td><code>keyring_hashicorp_ca_path</code></td> </tr><tr> <th scope="row"><code>caching</code></th> <td>Whether to enable in-memory key cache. If enabled, <code>component_keyring_hashicorp</code> populates it during initialization; only the key list is populated.</td> <td>No.</td> <td><code>ON</code>, <code>OFF</code></td> <td><code>OFF</code></td> <td><code>keyring_hashicorp_caching</code></td> </tr><tr> <th scope="row"><code>role_id</code></th> <td>The HashiCorp Vault AppRole authentication role ID.</td> <td>Yes, when <code>auth_mode</code> is <code>approle</code>.</td> <td>Must be in valid UUID format.</td> <td>Empty string</td> <td><code>keyring_hashicorp_role_id</code></td> </tr><tr> <th scope="row"><code>secret_id</code></th> <td>The HashiCorp Vault AppRole authentication secret ID, in UUID format.</td> <td>Yes, when <code>auth_mode</code> is <code>approle</code>.</td> <td>Must be in valid UUID format.</td> <td>Empty string</td> <td><code>keyring_hashicorp_secret_id</code></td> </tr><tr> <th scope="row"><code>server_url</code></th> <td>URL of HashiCorp Vault server.</td> <td>No.</td> <td>A valid URL beginning with <code>https://</code>.</td> <td><code>https://127.0.0.1:8200</code></td> <td><code>keyring_hashicorp_server_url</code></td> </tr><tr> <th scope="row"><code>store_path</code></th> <td>Path within HashiCorp Vault server which is writeable when appropriate AppRole credentials are provided by <code>component_keyring_hashicorp</code>. To specify credentials, set <code>role_id</code> and <code>secret_id</code> (see component_keyring_hashicorp Configuration).</td> <td>Yes.</td> <td>Empty string</td> <td>Valid Unix-style file system path; cannot be empty.</td> <td><code>keyring_hashicorp_store_path</code></td> </tr><tr> <th scope="row"><code>token_path</code></th> <td>Path to token file.</td> <td>Yes, when <code>auth_mode</code> is <code>token</code>.</td> <td>None</td> <td>File system path valid for the system hosting the MySQL server.</td> <td>None</td> </tr></tbody></table>

Note

`component_keyring_hashicorp` does not support any of the system variables provided by the `keyring_hashicorp` plugin; the latter are shown in the last column of the preceding table to help with migrating from the plugin to the component. See Migration from HashiCorp Vault Plugin, for more information.

To be usable during the server startup process, `component_keyring_hashicorp` must be loaded using a manifest file `mysqld.my` (see Section 8.4.5.2, “Keyring Component Installation”). This file should contain the following item:

```
{
  "components": "file://component_keyring_hashicorp"
}
```

Note

A `mysqld.my` or other manifest file may contain references to multiple components; for simplicity, we show here only the item loading the HashiCorp Keyring component.

The contents of a sample `component_keyring_hashicorp.cnf` file using AppRole authentication are shown here:

```
{
  "server_url" : "https://my.vault.server.fqdn:8200",
  "role_id" : "12345678-abcd-bcde-cdef-12345678abcd",
  "secret_id" : "12345678-abcd-bcde-cdef-12345678abcd",
  "store_path" : "/v1/kv/mysql",
  "auth_path" : "/v1/auth/approle/login",
  "ca_path" : "/export/home/hashicorp/vault.crt",
  "caching" : "ON"
}
```

This example shows a sample configuration file for a setup using token-based authentication:

```
{
  "server_url" : "https://my.vault.server.fqdn:8200",
  "store_path" : "/v1/kv/mysql",
  "auth_path" : "/v1/auth/approle/login",
  "ca_path" : "/export/home/hashicorp/vault.crt",
  "caching" : "ON",
  "auth_mode" : "token",
  "token_path" : "/export/home/hashicorp/token.txt"
}
```

Note

All HashiCorp API routes are prefixed with a protocol version (which you can see in the preceding example as `/v1/`). If HashiCorp develops new protocol versions, it may be necessary to change `/v1/` to something else in your configuration.

MySQL Server authenticates against HashiCorp Vault using AppRole authentication. Successful authentication requires that two secrets be provided to Vault, a role ID and a secret ID, which are similar in concept to user name and password. The role ID and secret ID values to use are those obtained during the HashiCorp Vault setup procedure performed previously. To specify the two IDs, assign their respective values to `role_id` and `secret_id`. The setup procedure also results in the store path `/v1/kv/mysql`, which is used for `store_path` in `component_keyring_hashicorp.cnf`.

##### Migration from HashiCorp Vault Plugin

To migrate from the HashiCorp Vault keyring plugin to the HashiCorp Vault keyring component, it is necessary to set up loading of the component, create a component configuration equivalent to that used by the plugin, stop loading of the plugin, and remove any references to the plugin or its associated system variables from all configuration files. You can accomplish these tasks by performing the steps shown here:

1. Create or modify a local or global manifest file `mysqld.my` (see Section 8.4.5.2, “Keyring Component Installation”). The content of the file must include (completely) the `components` item shown here:

   ```
   {
     "components": "file://component_keyring_hashicorp"
   }
   ```

2. Obtain the values of any of the following startup options that you find in the MySQL server's `my.conf` file:

   * `--keyring-hashicorp-auth-path`
   * `--keyring-hashicorp-server-url`
   * `--keyring-hashicorp-role-id`
   * `--keyring-hashicorp-secret-id`
   * `--keyring-hashicorp-store-path`
   * `--keyring-hashicorp-caching`

   Note

   MySQL Components are not compatible with `--early-plugin-load`, so this value is not needed by `component_keyring_hashicorp`.

   A portion of such a configuration file is shown here:

   ```
   [mysqld]
   early-plugin-load=keyring_hashicorp.so
   keyring_hashicorp_role_id='ee3b495c-d0c9-11e9-8881-8444c71c32aa'
   keyring_hashicorp_secret_id='0512af29-d0ca-11e9-95ee-0010e00dd718'
   keyring_hashicorp_store_path='/v1/kv/mysql'
   keyring_hashicorp_auth_path='/v1/auth/approle/login'
   keyring_hashicorp_ca_path='/export/home/hashicorp/vault.crt'
   keyring_hashicorp_caching='ON'
   ```

3. Write a component configuration file `component_keyring_hashicorp.cnf` (see component_keyring_hashicorp Configuration) which sets each of the configuration items to the value obtained in the previous step for its equivalent system variable, as shown here:

   ```
   {
     "server_url" : "https://my.vault.server.fqdn:8200",
     "role_id" : "ee3b495c-d0c9-11e9-8881-8444c71c32aa",
     "secret_id" : "0512af29-d0ca-11e9-95ee-0010e00dd718",
     "store_path" : "/v1/kv/mysql",
     "auth_path" : "/v1/auth/approle/login",
     "ca_path" : "/export/home/hashicorp/vault.crt",
     "caching" : "ON"
   }
   ```

4. Perform any migration of keys that might be required. See Section 8.4.5.14, “Migrating Keys Between Keyring Keystores”, for more information.

5. Uninstall the plugin using [`UNINSTALL PLUGIN`](uninstall-plugin.html "15.7.4.6 UNINSTALL PLUGIN Statement"). See Uninstalling Plugins.

6. Remove any references to the plugin in `my.cnf` and any other MySQL configuration files. Be sure to remove the line shown here:

   ```
   early-plugin-load=keyring_hashicorp.so
   ```

   In addition, you should remove references to any variables specific to the HashiCorp keyring plugin (equivalent options listed previously). Variables which have been persisted (saved to `mysqld-auto.cnf`) must be removed from the server's configuration using `RESET PERSIST`.

7. Restart **mysqld** to cause the changes to take effect.


#### 8.4.5.12 Using the Oracle Cloud Infrastructure Vault Keyring Component

Note

The Oracle Cloud Infrastructure Vault keyring component is included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

`component_keyring_oci` is part of the component infrastructure that communicates with Oracle Cloud Infrastructure Vault for back end storage. No key information is permanently stored in MySQL server local storage. All keys are stored in Oracle Cloud Infrastructure Vault, making this component well suited for Oracle Cloud Infrastructure MySQL customers for management of their MySQL Enterprise Edition keys.

`component_keyring_oci` replaces the old `keyring_oci` plugin (no longer available), and employs the component infrastructure. For more information, see Section 8.4.5.1, “Keyring Components Versus Keyring Plugins”.

Note

Only one keyring component or plugin should be enabled at a time. Enabling multiple keyring components or plugins is unsupported and results may not be as anticipated.

To use `component_keyring_oci` for keystore management, you must:

1. Write a manifest that tells the server to load `component_keyring_oci`, as described in Section 8.4.5.2, “Keyring Component Installation”.

2. Write a configuration file for `component_keyring_oci`, as described here.

* Configuration Notes
* Verify the Component Installation
* Vault Keyring Component Usage

##### Configuration Notes

When it initializes, `component_keyring_oci` reads either a global configuration file, or a global configuration file paired with a local configuration file:

* The component attempts to read its global configuration file from the directory where the component library file is installed (that is, the server plugin directory).

* If the global configuration file indicates use of a local configuration file, the component attempts to read its local configuration file from the data directory.

* Although global and local configuration files are located in different directories, the file name is `component_keyring_oci.cnf` in both locations.

* It is an error for no configuration file to exist. `component_keyring_oci` cannot initialize without a valid configuration.

Local configuration files permit setting up multiple server instances to use `component_keyring_oci`, such that component configuration for each server instance is specific to a given data directory instance. This enables the same keyring component to be used with a distinct Oracle Cloud Infrastructure Vault for each instance.

You are assumed to be familiar with Oracle Cloud Infrastructure concepts, but the following documentation may be helpful when setting up resources to be used by `component_keyring_oci`:

* [Overview of Vault](https://docs.cloud.oracle.com/iaas/Content/KeyManagement/Concepts/keyoverview.htm)

* [Required Keys and OCIDs](https://docs.cloud.oracle.com/en-us/iaas/Content/API/Concepts/apisigningkey.htm)

* [Managing Keys](https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingkeys.htm)

* [Managing Compartments](https://docs.cloud.oracle.com/en-us/iaas/Content/Identity/Tasks/managingcompartments.htm)

* [Managing Vaults](https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingvaults.htm)

* [Managing Secrets](https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingsecrets.htm)

`component_keyring_oci` configuration files have these properties:

* A configuration file must be in valid JSON format.
* A configuration file permits these configuration items:

  + `"read_local_config"`: This item is permitted only in the global configuration file. If the item is not present, the component uses only the global configuration file. If the item is present, its value is `true` or `false`, indicating whether the component should read configuration information from the local configuration file.

    If the `"read_local_config"` item is present in the global configuration file along with other items, the component checks the `"read_local_config"` item value first:

    - If the value is `false`, the component processes the other items in the global configuration file and ignores the local configuration file.

    - If the value is `true`, the component ignores the other items in the global configuration file and attempts to read the local configuration file.

  + `“user”`: The OCID of the Oracle Cloud Infrastructure user that `component_keyring_oci` uses for connections. Prior to using `component_keyring_oci`, the user account must exist and be granted access to use the configured Oracle Cloud Infrastructure tenancy, compartment, and vault resources. To obtain the user OCID from the Console, use the instructions at [Required Keys and OCIDs](https://docs.cloud.oracle.com/en-us/iaas/Content/API/Concepts/apisigningkey.htm).

    This value is mandatory.

  + `“tenancy”`: The OCID of the Oracle Cloud Infrastructure tenancy that `component_keyring_oci` uses as the location of the MySQL compartment. Prior to using `component_keyring_oci`, you must create a tenancy if it does not exist. To obtain the tenancy OCID from the Console, use the instructions at [Required Keys and OCIDs](https://docs.cloud.oracle.com/en-us/iaas/Content/API/Concepts/apisigningkey.htm).

    This value is mandatory.

  + `“compartment”`: The OCID of the tenancy compartment that `component_keyring_oci` uses as the location of the MySQL keys. Prior to using `component_keyring_oci`, you must create a MySQL compartment or subcompartment if it does not exist. This compartment should contain no vault keys or vault secrets. It should not be used by systems other than MySQL Keyring. For information about managing compartments and obtaining the OCID, see [Managing Compartments](https://docs.cloud.oracle.com/en-us/iaas/Content/Identity/Tasks/managingcompartments.htm).

    This value is mandatory.

  + `“virtual_vault”`: The OCID of the Oracle Cloud Infrastructure Vault that `component_keyring_oci` uses for encryption operations. Prior to using `component_keyring_oci`, you must create a new vault in the MySQL compartment if it does not exist. (Alternatively, you can reuse an existing vault that is in a parent compartment of the MySQL compartment.) Compartment users can see and use only the keys in their respective compartments. For information about creating a vault and obtaining the vault OCID, see [Managing Vaults](https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingvaults.htm).

    This value is mandatory.

  + `“encryption_endpoint”`: The endpoint of the Oracle Cloud Infrastructure encryption server that `component_keyring_oci` uses for generating encrypted or encoded information (ciphertext) for new keys. The encryption endpoint is vault specific and Oracle Cloud Infrastructure assigns it at vault-creation time. To obtain the endpoint OCID, view the configuration details for your keyring_oci vault, using the instructions at [Managing Vaults](https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingvaults.htm).

    This value is mandatory.

  + `"management_endpoint"`: The endpoint of the Oracle Cloud Infrastructure key management server that `component_keyring_oci` uses for listing existing keys. The key management endpoint is vault specific and Oracle Cloud Infrastructure assigns it at vault-creation time. To obtain the endpoint OCID, view the configuration details for your keyring_oci vault, using the instructions at [Managing Vaults](https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingvaults.htm).

    This value is mandatory.

  + `“vaults_endpoint”`: The endpoint of the Oracle Cloud Infrastructure vaults server that `component_keyring_oci` uses for obtaining the value of secrets. The vaults endpoint is vault specific and Oracle Cloud Infrastructure assigns it at vault-creation time. To obtain the endpoint OCID, view the configuration details for your keyring_oci vault, using the instructions at [Managing Vaults](https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingvaults.htm).

    This value is mandatory.

  + `“secrets_endpoint”`: The endpoint of the Oracle Cloud Infrastructure secrets server that `component_keyring_oci` uses for listing, creating, and retiring secrets. The secrets endpoint is vault specific and Oracle Cloud Infrastructure assigns it at vault-creation time. To obtain the endpoint OCID, view the configuration details for your keyring_oci vault, using the instructions at [Managing Vaults](https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingvaults.htm).

    This value is mandatory.

  + `“master_key”`: The OCID of the Oracle Cloud Infrastructure master encryption key that `component_keyring_oci` uses for encryption of secrets. Prior to using `component_keyring_oci`, you must create a cryptographic key for the Oracle Cloud Infrastructure compartment if it does not exist. Provide a MySQL-specific name for the generated key and do not use it for other purposes. For information about key creation, see [Managing Keys](https://docs.cloud.oracle.com/en-us/iaas/Content/KeyManagement/Tasks/managingkeys.htm).

    This value is mandatory.

  + `“key_file”`: The path name of the file containing the RSA private key that `component_keyring_oci` uses for Oracle Cloud Infrastructure authentication. You must also upload the corresponding RSA public key using the Console. The Console displays the key fingerprint value, which you can use to set the `"key_fingerprint"` value. For information about generating and uploading API keys, see [Required Keys and OCIDs](https://docs.cloud.oracle.com/en-us/iaas/Content/API/Concepts/apisigningkey.htm).

    This value is mandatory.

  + `“key_fingerprint”`: The fingerprint of the RSA private key that `component_keyring_oci` uses for Oracle Cloud Infrastructure authentication. To obtain the key fingerprint while creating the API keys, execute this command:

    ```
    openssl rsa -pubout -outform DER -in ~/.oci/oci_api_key.pem | openssl md5 -c
    ```

    Alternatively, obtain the fingerprint from the Console, which automatically displays the fingerprint when you upload the RSA public key. For information about obtaining key fingerprints, see [Required Keys and OCIDs](https://docs.cloud.oracle.com/en-us/iaas/Content/API/Concepts/apisigningkey.htm).

    This value is mandatory.

  + `“ca_certificate”`: The path name of the CA certificate bundle file that `component_keyring_oci` component uses for Oracle Cloud Infrastructure certificate verification. The file contains one or more certificates for peer verification. If no file is specified, the default CA bundle installed on the system is used. If the value is set to `disabled` (case-sensitive), `component_keyring_oci` performs no certificate verification.

    On Windows systems, this should be set to `disabled`, or to the path to a CA certificate bundle file.

Given the preceding configuration file properties, to configure `component_keyring_oci`, create a global configuration file named `component_keyring_oci.cnf` in the directory where the `component_keyring_oci` library file is installed, and optionally create a local configuration file, also named `component_keyring_oci.cnf`, in the data directory.

##### Verify the Component Installation

After performing any component-specific configuration, start the server. Verify component installation by examining the Performance Schema `keyring_component_status` table:

```
mysql> SELECT * FROM performance_schema.keyring_component_status;
+---------------------+--------------------------------------------------------------------+
| STATUS_KEY          | STATUS_VALUE                                                       |
+---------------------+--------------------------------------------------------------------+
| Component_name      | component_keyring_oci                                              |
| Author              | Oracle Corporation                                                 |
| License             | PROPRIETARY                                                        |
| Implementation_name | component_keyring_oci                                              |
| Version             | 1.0                                                                |
| Component_status    | Active                                                             |
| user                | ocid1.user.oc1..aaaaaaaasqly<...>                                  |
| tenancy             | ocid1.tenancy.oc1..aaaaaaaai<...>                                  |
| compartment         | ocid1.compartment.oc1..aaaaaaaah2swh<...>                          |
| virtual_vault       | ocid1.vault.oc1.iad.bbo5xyzkaaeuk.abuwcljtmvxp4r<...>              |
| master_key          | ocid1.key.oc1.iad.bbo5xyzkaaeuk.abuwcljrbsrewgap<...>              |
| encryption_endpoint | bbo5xyzkaaeuk-crypto.kms.us-<...>                                  |
| management_endpoint | bbo5xyzkaaeuk-management.kms.us-<...>                              |
| vaults_endpoint     | vaults.us-<...>                                                    |
| secrets_endpoint    | secrets.vaults.us-<...>                                            |
| key_file            | ~/.oci/oci_api_key.pem                                             |
| key_fingerprint     | ca:7c:e1:fa:86:b6:40:af:39:d6<...>                                 |
| ca_certificate      | disabled                                                           |
+---------------------+--------------------------------------------------------------------+
```

A `Component_status` value of `Active` indicates that the component initialized successfully.

If the component cannot be loaded, server startup fails. Check the server error log for diagnostic messages. If the component loads but fails to initialize due to configuration problems, the server starts but the `Component_status` value is `Disabled`. Check the server error log, correct the configuration issues, and use the `ALTER INSTANCE RELOAD KEYRING` statement to reload the configuration.

It is possible to query MySQL server for the list of existing keys. To see which keys exist, examine the Performance Schema `keyring_keys` table.

```
mysql> SELECT * FROM performance_schema.keyring_keys;
+-----------------------------+--------------+----------------+
| KEY_ID                      | KEY_OWNER    | BACKEND_KEY_ID |
+-----------------------------+--------------+----------------+
| audit_log-20210322T130749-1 |              |                |
| MyKey                       | me@localhost |                |
| YourKey                     | me@localhost |                |
+-----------------------------+--------------+----------------+
```

##### Vault Keyring Component Usage

`component_keyring_oci` supports the functions that comprise the standard MySQL Keyring service interface. Keyring operations performed by those functions are accessible in SQL statements as described in Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”.

Example:

```
SELECT keyring_key_generate('MyKey', 'AES', 32);
SELECT keyring_key_remove('MyKey');
```

For information about the characteristics of key values permitted by `component_keyring_oci`, see Section 8.4.5.13, “Supported Keyring Key Types and Lengths”.


#### 8.4.5.13 Supported Keyring Key Types and Lengths

MySQL Keyring supports keys of different types (encryption algorithms) and lengths:

* The available key types depend on which keyring plugin is installed.

* The permitted key lengths are subject to multiple factors:

  + General keyring loadable-function interface limits (for keys managed using one of the keyring functions described in Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”), or limits from back end implementations. These length limits can vary by key operation type.

  + In addition to the general limits, individual keyring plugins may impose restrictions on key lengths per key type.

Table 8.32, “General Keyring Key Length Limits” shows the general key-length limits. (The lower limits for `keyring_aws` are imposed by the AWS KMS interface, not the keyring functions.) For keyring plugins, Table 8.33, “Keyring Plugin Key Types and Lengths” shows the key types each keyring plugin permits, as well as any plugin-specific key-length restrictions. For most keyring components, the general key-length limits apply and there are no key-type restrictions.

Note

`component_keyring_oci` can generate keys of type `AES` with a size of 16, 24, or 32 bytes only.

**Table 8.32 General Keyring Key Length Limits**

<table summary="General limits on keyring key lengths."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Key Operation</th> <th>Maximum Key Length</th> </tr></thead><tbody><tr> <td>Generate key</td> <td><p class="valid-value"> 16,384 bytes (2,048 previously); 1,024 for <code>keyring_aws</code> </p></td> </tr><tr> <td>Store key</td> <td><p class="valid-value"> 16,384 bytes (2,048 previously); 4,096 for <code>keyring_aws</code> </p></td> </tr><tr> <td>Fetch key</td> <td><p class="valid-value"> 16,384 bytes (2,048 previously); 4,096 for <code>keyring_aws</code> </p></td> </tr></tbody></table>

**Table 8.33 Keyring Plugin Key Types and Lengths**

<table summary="Key types and lengths supported by keyring plugins."><col style="width: 30%"/><col style="width: 25%"/><col style="width: 45%"/><thead><tr> <th scope="col">Plugin Name</th> <th scope="col">Permitted Key Type</th> <th scope="col">Plugin-Specific Length Restrictions</th> </tr></thead><tbody><tr> <th scope="row" valign="top"><code>keyring_aws</code></th> <td><p class="valid-value"> <code>AES</code> </p><p class="valid-value"> <code>SECRET</code> </p></td> <td><p class="valid-value"> 16, 24, or 32 bytes </p><p class="valid-value"> None </p></td> </tr><tr> <th scope="row" valign="top"><code>keyring_hashicorp</code></th> <td><p class="valid-value"> <code>AES</code> </p><p class="valid-value"> <code>DSA</code> </p><p class="valid-value"> <code>RSA</code> </p><p class="valid-value"> <code>SECRET</code> </p></td> <td><p class="valid-value"> None </p><p class="valid-value"> None </p><p class="valid-value"> None </p><p class="valid-value"> None </p></td> </tr><tr> <th scope="row" valign="top"><code>keyring_okv</code></th> <td><p class="valid-value"> <code>AES</code> </p><p class="valid-value"> <code>SECRET</code> </p></td> <td><p class="valid-value"> 16, 24, or 32 bytes </p><p class="valid-value"> None </p></td> </tr></tbody></table>

The `SECRET` key type is intended for general-purpose storage of sensitive data using the MySQL keyring, and is supported by most keyring components and keyring plugins. The keyring encrypts and decrypts `SECRET` data as a byte stream upon storage and retrieval.

Example keyring operations involving the `SECRET` key type:

```
SELECT keyring_key_generate('MySecret1', 'SECRET', 20);
SELECT keyring_key_remove('MySecret1');

SELECT keyring_key_store('MySecret2', 'SECRET', 'MySecretData');
SELECT keyring_key_fetch('MySecret2');
SELECT keyring_key_length_fetch('MySecret2');
SELECT keyring_key_type_fetch('MySecret2');
SELECT keyring_key_remove('MySecret2');
```


#### 8.4.5.14 Migrating Keys Between Keyring Keystores

A keyring migration copies keys from one keystore to another, enabling a DBA to switch a MySQL installation to a different keystore. A successful migration operation has this result:

* The destination keystore contains the keys it had prior to the migration, plus the keys from the source keystore.

* The source keystore remains the same before and after the migration (because keys are copied, not moved).

If a key to be copied already exists in the destination keystore, an error occurs and the destination keystore is restored to its premigration state.

The keyring manages keystores using keyring components and keyring plugins. This pertains to migration strategy because the way in which the source and destination keystores are managed determines the procedure for performing a given type of key migration:

* Migration from one keyring plugin to another: The MySQL server has an operational mode that provides this capability.

* Migration from a keyring plugin to a keyring component: The MySQL server has an operational mode that provides this capability.

* Migration from one keyring component to another: The **mysql_migrate_keyring** utility provides this capability.

* Migration from a keyring component to a keyring plugin: The MySQL server has an operational mode that provides this capability.

The following sections discuss the characteristics of offline and online migrations and describe how to perform migrations.

* Offline and Online Key Migrations
* Key Migration Using a Migration Server
* Key Migration Using the mysql_migrate_keyring Utility
* Key Migration Involving Multiple Running Servers

##### Offline and Online Key Migrations

A key migration is either offline or online:

* Offline migration: For use when you are sure that no running server on the local host is using the source or destination keystore. In this case, the migration operation can copy keys from the source keystore to the destination without the possibility of a running server modifying keystore content during the operation.

* Online migration: For use when a running server on the local host is using the source keystore. In this case, care must be taken to prevent that server from updating keystores during the migration. This involves connecting to the running server and instructing it to pause keyring operations so that keys can be copied safely from the source keystore to the destination. When key copying is complete, the running server is permitted to resume keyring operations.

When you plan a key migration, use these points to decide whether it should be offline or online:

* Do not perform offline migration involving a keystore that is in use by a running server.

* Pausing keyring operations during an online migration is accomplished by connecting to the running server and setting its global `keyring_operations` system variable to `OFF` before key copying and `ON` after key copying. This has several implications:

  + `keyring_operations` was introduced in MySQL 5.7.21, so online migration is possible only if the running server is from MySQL 5.7.21 or higher. If the running server is older, you must stop it, perform an offline migration, and restart it. All migration instructions elsewhere that refer to `keyring_operations` are subject to this condition.

  + The account used to connect to the running server must have the privileges required to modify `keyring_operations`. These privileges are `ENCRYPTION_KEY_ADMIN` in addition to either `SYSTEM_VARIABLES_ADMIN` or the deprecated `SUPER` privilege.

  + If an online migration operation exits abnormally (for example, if it is forcibly terminated), it is possible for `keyring_operations` to remain disabled on the running server, leaving it unable to perform keyring operations. In this case, it may be necessary to connect to the running server and enable `keyring_operations` manually using this statement:

    ```
    SET GLOBAL keyring_operations = ON;
    ```

* Online key migration provides for pausing keyring operations on a single running server. To perform a migration if multiple running servers are using the keystores involved, use the procedure described at Key Migration Involving Multiple Running Servers.

##### Key Migration Using a Migration Server

Note

Online key migration using a migration server is only supported if the running server allows socket connections or TCP/IP connections using TLS; it is not supported when, for example, the server is running on a Windows platform and only allows shared memory connections.

A MySQL server becomes a migration server if invoked in a special operational mode that supports key migration. A migration server does not accept client connections. Instead, it runs only long enough to migrate keys, then exits. A migration server reports errors to the console (the standard error output).

A migration server supports these migration types:

* Migration from one keyring plugin to another.
* Migration from a keyring plugin to a keyring component.
* Migration from a keyring component to a keyring plugin.

A migration server does not support migration from one keyring component to another. For that type of migration, see Key Migration Using the mysql_migrate_keyring Utility.

To perform a key migration operation using a migration server, determine the key migration options required to specify which keyring plugins or components are involved, and whether the migration is offline or online:

* To indicate the source keyring plugin and the destination keyring plugin or component, specify these options:

  + `--keyring-migration-source`: The source keyring component or plugin that manages the keys to be migrated.

  + `--keyring-migration-destination`: The destination keyring plugin or component to which the migrated keys are to be copied.

  + `--keyring-migration-to-component`: This option is required if the destination is a keyring component.

  + `--keyring-migration-from-component`: This option is required if the source is a keyring component.

  The `--keyring-migration-source` and `--keyring-migration-destination` options signify to the server that it should run in key migration mode. For key migration operations, both options are mandatory. Each plugin or component is specified using the name of its library file, including any platform-specific extension such as `.so` or `.dll`. The source and destination must differ, and the migration server must support them both.

* For an offline migration, no additional key migration options are needed.

* For an online migration, some running server currently is using the source or destination keystore. To invoke the migration server, specify additional key migration options that indicate how to connect to the running server. This is necessary so that the migration server can connect to the running server and tell it to pause keyring use during the migration operation.

  Use of any of the following options signifies an online migration:

  + `--keyring-migration-host`: The host where the running server is located. This is always the local host because the migration server can migrate keys only between keystores managed by local plugins and components.

  + `--keyring-migration-user`, `--keyring-migration-password`: The account credentials to use to connect to the running server.

  + `--keyring-migration-port`: For TCP/IP connections, the port number to connect to on the running server.

  + `--keyring-migration-socket`: For Unix socket file or Windows named pipe connections, the socket file or named pipe to connect to on the running server.

For additional details about the key migration options, see Section 8.4.5.18, “Keyring Command Options”.

Start the migration server with key migration options indicating the source and destination keystores and whether the migration is offline or online, possibly with other options. Keep the following considerations in mind:

* Other server options might be required; other non-keyring options may be required as well. One way to specify these options is by using `--defaults-file` to name an option file that contains the required options.

  + The migration server must not start up with its own keyring. This means that `--defaults-file` must not point to the same options file that is used to start the running server if it cantains a line such as `early-plugin-load=keyring_file.so`. Instead, it must point to a separate file that only contains options relevant to the migration.

  + If migrating from a plugin to a component, the component manifest file (`mysqld.my`) must not be present in the `bin` directory. Although, the component configuration (for example, `component_keyring_file.cnf` in the plugin directory) should be present in the `bin` directory, so that the new keyring can be populated. After the migration is complete, add the manifest file to the directory and restart the MySQL server, so that the server starts using the new keyring.

* The migration server expects path name option values to be full paths. Relative path names may not be resolved as you expect.

* The user who invokes a server in key-migration mode must not be the `root` operating system user, unless the `--user` option is specified with a non-`root` user name to run the server as that user.

* The user a server in key-migration mode runs as must have permission to read and write any local keyring files, such as the data file for a file-based plugin.

  If you invoke the migration server from a system account different from that normally used to run MySQL, it might create keyring directories or files that are inaccessible to the server during normal operation. Suppose that **mysqld** normally runs as the `mysql` operating system user, but you invoke the migration server while logged in as `isabel`. Any new directories or files created by the migration server are owned by `isabel`. Subsequent startup fails when a server run as the `mysql` operating system user attempts to access file system objects owned by `isabel`.

  To avoid this issue, start the migration server as the `root` operating system user and provide a `--user=user_name` option, where *`user_name`* is the system account normally used to run MySQL. Alternatively, after the migration, examine the keyring-related file system objects and change their ownership and permissions if necessary using **chown**, **chmod**, or similar commands, so that the objects are accessible to the running server.

Example command line for offline migration between two keyring plugins (enter the command on a single line):

```
mysqld --defaults-file=/usr/local/mysql/etc/my.cnf
  --keyring-migration-source=keyring_okv.so
  --keyring-migration-destination=keyring_aws.so
```

Example command line for online migration between two keyring plugins:

```
mysqld --defaults-file=/usr/local/mysql/etc/my.cnf
  --keyring-migration-source=keyring_okv.so
  --keyring-migration-destination=keyring_aws.so
  --keyring-migration-host=127.0.0.1
  --keyring-migration-user=root
  --keyring-migration-password=root_password
```

To perform a migration when the destination is a keyring component rather than a keyring plugin, specify the `--keyring-migration-to-component` option, and name the component as the value of the `--keyring-migration-destination` option.

Example command line for offline migration from a keyring plugin to a keyring component:

```
mysqld --defaults-file=/usr/local/mysql/etc/my.cnf
  --keyring-migration-to-component
  --keyring-migration-source=keyring_okv.so
  --keyring-migration-destination=component_keyring_encrypted_file.so
```

Notice that in this case, no `keyring_encrypted_file_password` value is specified. The password for the component data file is listed in the component configuration file.

Example command line for online migration from a keyring plugin to a keyring component:

```
mysqld --defaults-file=/usr/local/mysql/etc/my.cnf
  --keyring-migration-to-component
  --keyring-migration-source=keyring_okv.so
  --keyring-migration-destination=component_keyring_encrypted_file.so
  --keyring-migration-host=127.0.0.1
  --keyring-migration-user=root
  --keyring-migration-password=root_password
```

To perform a migration when the source is a keyring component rather than a keyring plugin, specify the `--keyring-migration-from-component` option, and name the component as the value of the `--keyring-migration-source` option.

Example command line for offline migration from a keyring component to a keyring plugin:

```
mysqld --defaults-file=/usr/local/mysql/etc/my.cnf
  --keyring-migration-from-component
  --keyring-migration-source=component_keyring_file.so
  --keyring-migration-destination=keyring_okv.so
  --keyring-okv-conf-dir=/usr/local/mysql/mysql-keyring-okv
```

Example command line for online migration from a keyring component to a keyring plugin:

```
mysqld --defaults-file=/usr/local/mysql/etc/my.cnf
  --keyring-migration-from-component
  --keyring-migration-source=component_keyring_file.so
  --keyring-migration-destination=keyring_okv.so
  --keyring-okv-conf-dir=/usr/local/mysql/mysql-keyring-okv
  --keyring-migration-host=127.0.0.1
  --keyring-migration-user=root
  --keyring-migration-password=root_password
```

The key migration server performs a migration operation as follows:

1. (Online migration only) Connect to the running server using the connection options.

2. (Online migration only) Disable `keyring_operations` on the running server.

3. Load the keyring plugin or component libraries for the source and destination keystores.

4. Copy keys from the source keystore to the destination.
5. Unload the keyring plugin or component libraries for the source and destination keystores.

6. (Online migration only) Enable `keyring_operations` on the running server.

7. (Online migration only) Disconnect from the running server.

If an error occurs during key migration, the destination keystore is restored to its premigration state.

After a successful online key migration operation, the running server might need to be restarted:

* If the running server was using the source keystore before the migration and should continue to use it after the migration, it need not be restarted after the migration.

* If the running server was using the destination keystore before the migration and should continue to use it after the migration, it should be restarted after the migration to load all keys migrated into the destination keystore.

* If the running server was using the source keystore before the migration but should use the destination keystore after the migration, it must be reconfigured to use the destination keystore and restarted. In this case, be aware that although the running server is paused from modifying the source keystore during the migration itself, it is not paused during the interval between the migration and the subsequent restart. Care should be taken that the server does not modify the source keystore during this interval because any such changes will not be reflected in the destination keystore.

##### Key Migration Using the mysql_migrate_keyring Utility

The **mysql_migrate_keyring** utility migrates keys from one keyring component to another. It does not support migrations involving keyring plugins. For that type of migration, use a MySQL server operating in key migration mode; see Key Migration Using a Migration Server.

To perform a key migration operation using **mysql_migrate_keyring**, determine the key migration options required to specify which keyring components are involved, and whether the migration is offline or online:

* To indicate the source and destination keyring components and their location, specify these options:

  + `--source-keyring`: The source keyring component that manages the keys to be migrated.

  + `--destination-keyring`: The destination keyring component to which the migrated keys are to be copied.

  + `--component-dir`: The directory containing keyring component library files. This is typically the value of the `plugin_dir` system variable for the local MySQL server.

  All three options are mandatory. Each keyring component name is a component library file name specified without any platform-specific extension such as `.so` or `.dll`. For example, to use the component for which the library file is `component_keyring_file.so`, specify the option as `--source-keyring=component_keyring_file`. The source and destination must differ, and **mysql_migrate_keyring** must support them both.

* For an offline migration, no additional options are needed.

* For an online migration, some running server currently is using the source or destination keystore. In this case, specify the `--online-migration` option to signify an online migration. In addition, specify connection options indicating how to connect to the running server, so that **mysql_migrate_keyring** can connect to it and tell it to pause keyring use during the migration operation.

  The `--online-migration` option is commonly used in conjunction with connection options such as these:

  + `--host`: The host where the running server is located. This is always the local host because **mysql_migrate_keyring** can migrate keys only between keystores managed by local components.

  + `--user`, `--password`: The account credentials to use to connect to the running server.

  + `--port`: For TCP/IP connections, the port number to connect to on the running server.

  + `--socket`: For Unix socket file or Windows named pipe connections, the socket file or named pipe to connect to on the running server.

For descriptions of all available options, see Section 6.6.8, “mysql_migrate_keyring — Keyring Key Migration Utility”.

Start **mysql_migrate_keyring** with options indicating the source and destination keystores and whether the migration is offline or online, possibly with other options. Keep the following considerations in mind:

* The user who invokes **mysql_migrate_keyring** must not be the `root` operating system user.

* The user who invokes **mysql_migrate_keyring** must have permission to read and write any local keyring files, such as the data file for a file-based plugin.

  If you invoke **mysql_migrate_keyring** from a system account different from that normally used to run MySQL, it might create keyring directories or files that are inaccessible to the server during normal operation. Suppose that **mysqld** normally runs as the `mysql` operating system user, but you invoke **mysql_migrate_keyring** while logged in as `isabel`. Any new directories or files created by **mysql_migrate_keyring** are owned by `isabel`. Subsequent startup fails when a server run as the `mysql` operating system user attempts to access file system objects owned by `isabel`.

  To avoid this issue, invoke **mysql_migrate_keyring** as the `mysql` operating system user. Alternatively, after the migration, examine the keyring-related file system objects and change their ownership and permissions if necessary using **chown**, **chmod**, or similar commands, so that the objects are accessible to the running server.

Suppose that you want to migrate keys from `component_keyring_file` to `component_keyring_encrypted_file`, and that the local server stores its keyring component library files in `/usr/local/mysql/lib/plugin`.

If no running server is using the keyring, an offline migration is permitted. Invoke **mysql_migrate_keyring** like this (enter the command on a single line):

```
mysql_migrate_keyring
  --component-dir=/usr/local/mysql/lib/plugin
  --source-keyring=component_keyring_file
  --destination-keyring=component_keyring_encrypted_file
```

If a running server is using the keyring, you must perform an online migration instead. In this case, the `--online-migration` option must be given, along with any connection options required to specify which server to connect to and the MySQL account to use.

The following command performs an online migration. It connects to the local server using a TCP/IP connection and the `admin` account. The command prompts for a password, which you should enter when prompted:

```
mysql_migrate_keyring
  --component-dir=/usr/local/mysql/lib/plugin
  --source-keyring=component_keyring_file
  --destination-keyring=component_keyring_encrypted_file
  --online-migration --host=127.0.0.1 --user=admin --password
```

**mysql_migrate_keyring** performs a migration operation as follows:

1. (Online migration only) Connect to the running server using the connection options.

2. (Online migration only) Disable `keyring_operations` on the running server.

3. Load the keyring component libraries for the source and destination keystores.

4. Copy keys from the source keystore to the destination.
5. Unload the keyring component libraries for the source and destination keystores.

6. (Online migration only) Enable `keyring_operations` on the running server.

7. (Online migration only) Disconnect from the running server.

If an error occurs during key migration, the destination keystore is restored to its premigration state.

After a successful online key migration operation, the running server might need to be restarted:

* If the running server was using the source keystore before the migration and should continue to use it after the migration, it need not be restarted after the migration.

* If the running server was using the destination keystore before the migration and should continue to use it after the migration, it should be restarted after the migration to load all keys migrated into the destination keystore.

* If the running server was using the source keystore before the migration but should use the destination keystore after the migration, it must be reconfigured to use the destination keystore and restarted. In this case, be aware that although the running server is paused from modifying the source keystore during the migration itself, it is not paused during the interval between the migration and the subsequent restart. Care should be taken that the server does not modify the source keystore during this interval because any such changes will not be reflected in the destination keystore.

##### Key Migration Involving Multiple Running Servers

Online key migration provides for pausing keyring operations on a single running server. To perform a migration if multiple running servers are using the keystores involved, use this procedure:

1. Connect to each running server manually and set `keyring_operations=OFF`. This ensures that no running server is using the source or destination keystore and satisfies the required condition for offline migration.

2. Use a migration server or **mysql_migrate_keyring** to perform an offline key migration for each paused server.

3. Connect to each running server manually and set `keyring_operations=ON`.

All running servers must support the `keyring_operations` system variable. Any server that does not must be stopped before the migration and restarted after.


#### 8.4.5.15 General-Purpose Keyring Key-Management Functions

MySQL Server supports a keyring service that enables internal components and plugins to store sensitive information securely for later retrieval.

MySQL Server also includes an SQL interface for keyring key management, implemented as a set of general-purpose functions that access the capabilities provided by the internal keyring service. The keyring functions are contained in a plugin library file, which also contains a `keyring_udf` plugin that must be enabled prior to function invocation. For these functions to be used, a keyring plugin such as `keyring_okv`, or a keyring component such as `component_keyring_file` or `component_keyring_encrypted_file`, must be enabled.

The functions described here are general-purpose and intended for use with any keyring component or plugin. A given keyring component or plugin may also provide functions of its own that are intended for use only with that component or plugin; see Section 8.4.5.16, “Plugin-Specific Keyring Key-Management Functions”.

The following sections provide installation instructions for the keyring functions and demonstrate how to use them. For general keyring information, see Section 8.4.5, “The MySQL Keyring”.

* Installing or Uninstalling General-Purpose Keyring Functions
* Using General-Purpose Keyring Functions
* General-Purpose Keyring Function Reference

##### Installing or Uninstalling General-Purpose Keyring Functions

This section describes how to install or uninstall the keyring functions, which are implemented in a plugin library file that also contains a `keyring_udf` plugin. For general information about installing or uninstalling plugins and loadable functions, see Section 7.6.1, “Installing and Uninstalling Plugins”, and Section 7.7.1, “Installing and Uninstalling Loadable Functions”.

The keyring functions enable keyring key management operations, but the `keyring_udf` plugin must also be installed because the functions do not work correctly without it. Attempts to use the functions without the `keyring_udf` plugin result in an error.

To be usable by the server, the plugin library file must be located in the MySQL plugin directory (the directory named by the `plugin_dir` system variable). If necessary, configure the plugin directory location by setting the value of `plugin_dir` at server startup.

The plugin library file base name is `keyring_udf`. The file name suffix differs per platform (for example, `.so` for Unix and Unix-like systems, `.dll` for Windows).

To install the `keyring_udf` plugin and the keyring functions, use the [`INSTALL PLUGIN`](install-plugin.html "15.7.4.4 INSTALL PLUGIN Statement") and [`CREATE FUNCTION`](create-function.html "15.1.16 CREATE FUNCTION Statement") statements, adjusting the `.so` suffix for your platform as necessary:

```
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

```
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

  ```
  ERROR 1123 (HY000): Can't initialize function 'keyring_key_generate';
  This function requires keyring_udf plugin which is not installed.
  Please install
  ```

  To install the `keyring_udf` plugin, see Installing or Uninstalling General-Purpose Keyring Functions.

* The keyring functions invoke keyring service functions (see Section 7.6.8.2, “The Keyring Service”). The service functions in turn use whatever keyring plugin is installed (for example, `keyring_okv`). Therefore, to use any keyring function, some underlying keyring plugin must be enabled. Otherwise, an error occurs:

  ```
  ERROR 3188 (HY000): Function 'keyring_key_generate' failed because
  underlying keyring service returned an error. Please check if a
  keyring plugin is installed and that provided arguments are valid
  for the keyring you are using.
  ```

  To install a keyring plugin, see Section 8.4.5.3, “Keyring Plugin Installation”.

* A user must possess the global `EXECUTE` privilege to use any keyring function. Otherwise, an error occurs:

  ```
  ERROR 1123 (HY000): Can't initialize function 'keyring_key_generate';
  The user is not privileged to execute this function. User needs to
  have EXECUTE
  ```

  To grant the global `EXECUTE` privilege to a user, use this statement:

  ```
  GRANT EXECUTE ON *.* TO user;
  ```

  Alternatively, should you prefer to avoid granting the global `EXECUTE` privilege while still permitting users to access specific key-management operations, “wrapper” stored programs can be defined (a technique described later in this section).

* A key stored in the keyring by a given user can be manipulated later only by the same user. That is, the value of the `CURRENT_USER()` function at the time of key manipulation must have the same value as when the key was stored in the keyring. (This constraint rules out the use of the keyring functions for manipulation of instance-wide keys, such as those created by `InnoDB` to support tablespace encryption.)

  To enable multiple users to perform operations on the same key, “wrapper” stored programs can be defined (a technique described later in this section).

* Keyring functions support the key types and lengths supported by the underlying keyring plugin. For information about keys specific to a particular keyring plugin, see Section 8.4.5.13, “Supported Keyring Key Types and Lengths”.

To create a new random key and store it in the keyring, call `keyring_key_generate()`, passing to it an ID for the key, along with the key type (encryption method) and its length in bytes. The following call creates a 2,048-bit DSA-encrypted key named `MyKey`:

```
mysql> SELECT keyring_key_generate('MyKey', 'DSA', 256);
+-------------------------------------------+
| keyring_key_generate('MyKey', 'DSA', 256) |
+-------------------------------------------+
|                                         1 |
+-------------------------------------------+
```

A return value of 1 indicates success. If the key cannot be created, the return value is `NULL` and an error occurs. One reason this might be is that the underlying keyring plugin does not support the specified combination of key type and key length; see Section 8.4.5.13, “Supported Keyring Key Types and Lengths”.

To be able to check the return type regardless of whether an error occurs, use `SELECT ... INTO @var_name` and test the variable value:

```
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

```
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

```
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

```
mysql> SELECT keyring_key_remove('MyKey');
+-----------------------------+
| keyring_key_remove('MyKey') |
+-----------------------------+
|                           1 |
+-----------------------------+
```

To obfuscate and store a key that you provide, pass the key ID, type, and value to `keyring_key_store()`:

```
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

```
mysql> CREATE SCHEMA key_schema;

mysql> CREATE DEFINER = 'root'@'localhost'
       FUNCTION key_schema.get_shared_key()
       RETURNS BLOB READS SQL DATA
       RETURN keyring_key_fetch('SharedKey');
```

From the administrative account, ensure that the shared key exists:

```
mysql> SELECT keyring_key_generate('SharedKey', 'DSA', 8);
+---------------------------------------------+
| keyring_key_generate('SharedKey', 'DSA', 8) |
+---------------------------------------------+
|                                           1 |
+---------------------------------------------+
```

From the administrative account, create an ordinary user account to which key access is to be granted:

```
mysql> CREATE USER 'key_user'@'localhost'
       IDENTIFIED BY 'key_user_pwd';
```

From the `key_user` account, verify that, without the proper `EXECUTE` privilege, the new account cannot access the shared key:

```
mysql> SELECT HEX(key_schema.get_shared_key());
ERROR 1370 (42000): execute command denied to user 'key_user'@'localhost'
for routine 'key_schema.get_shared_key'
```

From the administrative account, grant `EXECUTE` to `key_user` for the stored function:

```
mysql> GRANT EXECUTE ON FUNCTION key_schema.get_shared_key
       TO 'key_user'@'localhost';
```

From the `key_user` account, verify that the key is now accessible:

```
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

  Key values retrieved using `keyring_key_fetch()` are subject to the general keyring function limits described in Section 8.4.5.13, “Supported Keyring Key Types and Lengths”. A key value longer than that length can be stored using a keyring service function (see Section 7.6.8.2, “The Keyring Service”), but if retrieved using `keyring_key_fetch()` is truncated to the general keyring function limit.

  Example:

  ```
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

* [`keyring_key_generate(key_id, key_type, key_length)`](keyring-functions-general-purpose.html#function_keyring-key-generate)

  Generates a new random key with a given ID, type, and length, and stores it in the keyring. The type and length values must be consistent with the values supported by the underlying keyring plugin. See Section 8.4.5.13, “Supported Keyring Key Types and Lengths”.

  Arguments:

  + *`key_id`*: A string that specifies the key ID.

  + *`key_type`*: A string that specifies the key type.

  + *`key_length`*: An integer that specifies the key length in bytes.

  Return value:

  Returns 1 for success, or `NULL` and an error for failure.

  Example:

  ```
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

  ```
  mysql> SELECT keyring_key_remove('AES_key');
  +-------------------------------+
  | keyring_key_remove('AES_key') |
  +-------------------------------+
  |                             1 |
  +-------------------------------+
  ```

* [`keyring_key_store(key_id, key_type, key)`](keyring-functions-general-purpose.html#function_keyring-key-store)

  Obfuscates and stores a key in the keyring.

  Arguments:

  + *`key_id`*: A string that specifies the key ID.

  + *`key_type`*: A string that specifies the key type.

  + *`key`*: A string that specifies the key value.

  Return value:

  Returns 1 for success, or `NULL` and an error for failure.

  Example:

  ```
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


#### 8.4.5.16 Plugin-Specific Keyring Key-Management Functions

For each keyring plugin-specific function, this section describes its purpose, calling sequence, and return value. For information about general-purpose keyring functions, see Section 8.4.5.15, “General-Purpose Keyring Key-Management Functions”.

* `keyring_aws_rotate_cmk()`

  Associated keyring plugin: `keyring_aws`

  Note

  `keyring_aws_rotate_cmk()` is not provided by the AWS keyring component. For this reason, the function should be considered deprecated and thus subject to removal in a future version of MySQL.

  `keyring_aws_rotate_cmk()` rotates the AWS KMS key. Rotation changes only the key that AWS KMS uses for subsequent data key-encryption operations. AWS KMS maintains previous CMK versions, so keys generated using previous CMKs remain decryptable after rotation.

  Rotation changes the CMK value used inside AWS KMS but does not change the ID used to refer to it, so there is no need to change the `keyring_aws_cmk_id` system variable after calling `keyring_aws_rotate_cmk()`.

  This function requires the `SUPER` privilege.

  Arguments:

  None.

  Return value:

  Returns 1 for success, or `NULL` and an error for failure.

* `keyring_aws_rotate_keys()`

  Associated keyring plugin: `keyring_aws`

  Note

  `keyring_aws_rotate_keys()` is not provided by the AWS keyring component. For this reason, the function should be considered deprecated and thus subject to removal in a future version of MySQL.

  `keyring_aws_rotate_keys()` rotates keys stored in the `keyring_aws` storage file named by the `keyring_aws_data_file` system variable. Rotation sends each key stored in the file to AWS KMS for re-encryption using the value of the `keyring_aws_cmk_id` system variable as the CMK value, and stores the new encrypted keys in the file.

  `keyring_aws_rotate_keys()` is useful for key re-encryption under these circumstances:

  + After rotating the CMK; that is, after invoking the `keyring_aws_rotate_cmk()` function.

  + After changing the `keyring_aws_cmk_id` system variable to a different key value.

  This function requires the `SUPER` privilege.

  Arguments:

  None.

  Return value:

  Returns 1 for success, or `NULL` and an error for failure.

* `keyring_hashicorp_update_config()`

  Associated keyring plugin: `keyring_hashicorp`

  Note

  `keyring_hashicorp_update_config()` is not provided by the HashiCorp keyring component. For this reason, the function should be considered deprecated and thus subject to removal in a future version of MySQL.

  When invoked, the `keyring_hashicorp_update_config()` function causes `keyring_hashicorp` to perform a runtime reconfiguration, as described in keyring_hashicorp Configuration.

  This function requires the `SYSTEM_VARIABLES_ADMIN` privilege because it modifies global system variables.

  Arguments:

  None.

  Return value:

  Returns the string `'Configuration update was successful.'` for success, or `'Configuration update failed.'` for failure.


#### 8.4.5.17 Keyring Metadata

This section describes sources of information about keyring use.

To see whether a keyring plugin is loaded, check the Information Schema `PLUGINS` table or use the `SHOW PLUGINS` statement (see Section 7.6.2, “Obtaining Server Plugin Information”). For example:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE 'keyring%';
+-------------+---------------+
| PLUGIN_NAME | PLUGIN_STATUS |
+-------------+---------------+
| keyring_okv | ACTIVE        |
+-------------+---------------+
```

To see which keys exist, check the Performance Schema `keyring_keys` table:

```
mysql> SELECT * FROM performance_schema.keyring_keys;
+-----------------------------+--------------+----------------+
| KEY_ID                      | KEY_OWNER    | BACKEND_KEY_ID |
+-----------------------------+--------------+----------------+
| audit_log-20210322T130749-1 |              |                |
| MyKey                       | me@localhost |                |
| YourKey                     | me@localhost |                |
+-----------------------------+--------------+----------------+
```

To see whether a keyring component is loaded, check the Performance Schema `keyring_component_status` table. For example:

```
mysql> SELECT * FROM performance_schema.keyring_component_status;
+---------------------+-------------------------------------------------+
| STATUS_KEY          | STATUS_VALUE                                    |
+---------------------+-------------------------------------------------+
| Component_name      | component_keyring_file                          |
| Author              | Oracle Corporation                              |
| License             | GPL                                             |
| Implementation_name | component_keyring_file                          |
| Version             | 1.0                                             |
| Component_status    | Active                                          |
| Data_file           | /usr/local/mysql/keyring/component_keyring_file |
| Read_only           | No                                              |
+---------------------+-------------------------------------------------+
```

A `Component_status` value of `Active` indicates that the component initialized successfully. If the component loaded but failed to initialize, the value is `Disabled`.


#### 8.4.5.18 Keyring Command Options

MySQL supports the following keyring-related command-line options:

* `--keyring-migration-destination=plugin`

  <table frame="box" rules="all" summary="Properties for keyring-migration-destination"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-migration-destination=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The destination keyring plugin or component for key migration. See Section 8.4.5.14, “Migrating Keys Between Keyring Keystores”. The option value interpretation depends on whether `--keyring-migration-to-component` or `--keyring-migration-from-component` is specified:

  + If `--keyring-migration-to-component` is used, the option value is a keyring plugin, interpreted the same way as for `--keyring-migration-source`.

  + If `--keyring-migration-to-component` is used, the option value is a keyring component, specified as the component library name in the plugin directory, including any platform-specific extension such as `.so` or `.dll`.

  Note

  `--keyring-migration-source` and `--keyring-migration-destination` are mandatory for all keyring migration operations. The source and destination must differ, and the migration server must support both.

* `--keyring-migration-from-component`

  <table frame="box" rules="all" summary="Properties for keyring-migration-from-component"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-migration-from-component[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Indicates that a key migration is from a keyring component to a keyring plugin. This option makes it possible to migrate keys from a keyring component to a keyring plugin.

  For migration from a keyring plugin to a keyring component, use the `--keyring-migration-to-component` option. For key migration from one keyring component to another, use the **mysql_migrate_keyring** utility. See Section 8.4.5.14, “Migrating Keys Between Keyring Keystores”.

* `--keyring-migration-host=host_name`

  <table frame="box" rules="all" summary="Properties for keyring-migration-host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-migration-host=host_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost</code></td> </tr></tbody></table>

  The host location of the running server that is currently using one of the key migration keystores. See Section 8.4.5.14, “Migrating Keys Between Keyring Keystores”. Migration always occurs on the local host, so the option always specifies a value for connecting to a local server, such as `localhost`, `127.0.0.1`, `::1`, or the local host IP address or host name.

* `--keyring-migration-password[=password]`

  <table frame="box" rules="all" summary="Properties for keyring-migration-password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-migration-password[=password]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The password of the MySQL account used for connecting to the running server that is currently using one of the key migration keystores. See Section 8.4.5.14, “Migrating Keys Between Keyring Keystores”.

  The password value is optional. If not given, the server prompts for one. If given, there must be *no space* between `--keyring-migration-password=` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. See Section 8.1.2.1, “End-User Guidelines for Password Security”. You can use an option file to avoid giving the password on the command line. In this case, the file should have a restrictive mode and be accessible only to the account used to run the migration server.

* `--keyring-migration-port=port_num`

  <table frame="box" rules="all" summary="Properties for keyring-migration-port"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-migration-port=port_num</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>3306</code></td> </tr></tbody></table>

  For TCP/IP connections, the port number for connecting to the running server that is currently using one of the key migration keystores. See Section 8.4.5.14, “Migrating Keys Between Keyring Keystores”.

* `--keyring-migration-socket=path`

  <table frame="box" rules="all" summary="Properties for keyring-migration-socket"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-migration-socket={file_name|pipe_name}</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  For Unix socket file or Windows named pipe connections, the socket file or named pipe for connecting to the running server that is currently using one of the key migration keystores. See Section 8.4.5.14, “Migrating Keys Between Keyring Keystores”.

* `--keyring-migration-source=plugin`

  <table frame="box" rules="all" summary="Properties for keyring-migration-source"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-migration-source=plugin_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The source keyring plugin for key migration. See Section 8.4.5.14, “Migrating Keys Between Keyring Keystores”.

  The option value is similar to that for `--plugin-load`, except that only one plugin library can be specified. The value is given as *`plugin_library`* or *`name`*`=`*`plugin_library`*, where *`plugin_library`* is the name of a library file that contains plugin code, and *`name`* is the name of a plugin to load. If a plugin library is named without any preceding plugin name, the server loads all plugins in the library. With a preceding plugin name, the server loads only the named plugin from the library. The server looks for plugin library files in the directory named by the `plugin_dir` system variable.

  Note

  `--keyring-migration-source` and `--keyring-migration-destination` are mandatory for all keyring migration operations. The source and destination plugins must differ, and the migration server must support both plugins.

* `--keyring-migration-to-component`

  <table frame="box" rules="all" summary="Properties for keyring-migration-to-component"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-migration-to-component[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Indicates that a key migration is from a keyring plugin to a keyring component. This option makes it possible to migrate keys from a keyring plugin to a keyring component.

  For migration from a keyring component to a keyring plugin, use the `--keyring-migration-from-component` option. For key migration from one keyring component to another, use the **mysql_migrate_keyring** utility. See Section 8.4.5.14, “Migrating Keys Between Keyring Keystores”.

* `--keyring-migration-user=user_name`

  <table frame="box" rules="all" summary="Properties for keyring-migration-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-migration-user=user_name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The user name of the MySQL account used for connecting to the running server that is currently using one of the key migration keystores. See Section 8.4.5.14, “Migrating Keys Between Keyring Keystores”.


#### 8.4.5.19 Keyring System Variables

MySQL Keyring plugins support the following system variables. Use them to configure keyring plugin operation. These variables are unavailable unless the appropriate keyring plugin is installed (see Section 8.4.5.3, “Keyring Plugin Installation”).

* `keyring_aws_cmk_id`

  <table frame="box" rules="all" summary="Properties for keyring_aws_cmk_id"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-cmk-id=value</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_cmk_id</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  The KMS key ID obtained from the AWS KMS server and used by the `keyring_aws` plugin. This variable is unavailable unless that plugin is installed.

  This variable is mandatory. If not specified, `keyring_aws` initialization fails.

* `keyring_aws_conf_file`

  <table frame="box" rules="all" summary="Properties for keyring_aws_conf_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-conf-file=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_conf_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>

  The location of the configuration file for the `keyring_aws` plugin. This variable is unavailable unless that plugin is installed.

  At plugin startup, `keyring_aws` reads the AWS secret access key ID and key from the configuration file. For the `keyring_aws` plugin to start successfully, the configuration file must exist and contain valid secret access key information, initialized as described in Section 8.4.5.8, “Using the keyring_aws Amazon Web Services Keyring Plugin”.

  The default file name is `keyring_aws_conf`, located in the default keyring file directory.

* `keyring_aws_data_file`

  <table frame="box" rules="all" summary="Properties for keyring_aws_data_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-data-file</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_data_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>

  The location of the storage file for the `keyring_aws` plugin. This variable is unavailable unless that plugin is installed.

  At plugin startup, if the value assigned to `keyring_aws_data_file` specifies a file that does not exist, the `keyring_aws` plugin attempts to create it (as well as its parent directory, if necessary). If the file does exist, `keyring_aws` reads any encrypted keys contained in the file into its in-memory cache. `keyring_aws` does not cache unencrypted keys in memory.

  The default file name is `keyring_aws_data`, located in the default keyring file directory.

* `keyring_aws_region`

  <table frame="box" rules="all" summary="Properties for keyring_aws_region"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-region=value</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_region</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>us-east-1</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>af-south-1</code></p><p class="valid-value"><code>ap-east-1</code></p><p class="valid-value"><code>ap-northeast-1</code></p><p class="valid-value"><code>ap-northeast-2</code></p><p class="valid-value"><code>ap-northeast-3</code></p><p class="valid-value"><code>ap-south-1</code></p><p class="valid-value"><code>ap-southeast-1</code></p><p class="valid-value"><code>ap-southeast-2</code></p><p class="valid-value"><code>ca-central-1</code></p><p class="valid-value"><code>cn-north-1</code></p><p class="valid-value"><code>cn-northwest-1</code></p><p class="valid-value"><code>eu-central-1</code></p><p class="valid-value"><code>eu-north-1</code></p><p class="valid-value"><code>eu-south-1</code></p><p class="valid-value"><code>eu-west-1</code></p><p class="valid-value"><code>eu-west-2</code></p><p class="valid-value"><code>eu-west-3</code></p><p class="valid-value"><code>me-south-1</code></p><p class="valid-value"><code>sa-east-1</code></p><p class="valid-value"><code>us-east-1</code></p><p class="valid-value"><code>us-east-2</code></p><p class="valid-value"><code>us-gov-east-1</code></p><p class="valid-value"><code>us-iso-east-1</code></p><p class="valid-value"><code>us-iso-west-1</code></p><p class="valid-value"><code>us-isob-east-1</code></p><p class="valid-value"><code>us-west-1</code></p><p class="valid-value"><code>us-west-2</code></p></td> </tr></tbody></table>

  The AWS region for the `keyring_aws` plugin. This variable is unavailable unless that plugin is installed.

  If not set, the AWS region defaults to `us-east-1`. Thus, for any other region, this variable must be set explicitly.

* `keyring_hashicorp_auth_path`

  <table frame="box" rules="all" summary="Properties for keyring_hashicorp_auth_path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-hashicorp-auth-path=value</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code>keyring_hashicorp_auth_path</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>/v1/auth/approle/login</code></td> </tr></tbody></table>

  The authentication path where AppRole authentication is enabled within the HashiCorp Vault server, for use by the `keyring_hashicorp` plugin. This variable is unavailable unless that plugin is installed.

* `keyring_hashicorp_ca_path`

  <table frame="box" rules="all" summary="Properties for keyring_hashicorp_ca_path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-hashicorp-ca-path=file_name</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code>keyring_hashicorp_ca_path</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>empty string</code></td> </tr></tbody></table>

  The absolute path name of a local file accessible to the MySQL server that contains a properly formatted TLS certificate authority for use by the `keyring_hashicorp` plugin. This variable is unavailable unless that plugin is installed.

  If this variable is not set, the `keyring_hashicorp` plugin opens an HTTPS connection without using server certificate verification, and trusts any certificate delivered by the HashiCorp Vault server. For this to be safe, it must be assumed that the Vault server is not malicious and that no man-in-the-middle attack is possible. If those assumptions are invalid, set `keyring_hashicorp_ca_path` to the path of a trusted CA certificate. (For example, for the instructions in Certificate and Key Preparation, this is the `company.crt` file.)

* `keyring_hashicorp_caching`

  <table frame="box" rules="all" summary="Properties for keyring_hashicorp_caching"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-hashicorp-caching[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code>keyring_hashicorp_caching</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Whether to enable the optional in-memory key cache used by the `keyring_hashicorp` plugin to cache keys from the HashiCorp Vault server. This variable is unavailable unless that plugin is installed. If the cache is enabled, the plugin populates it during initialization. Otherwise, the plugin populates only the key list during initialization.

  Enabling the cache is a compromise: It improves performance, but maintains a copy of sensitive key information in memory, which may be undesirable for security purposes.

* `keyring_hashicorp_commit_auth_path`

  <table frame="box" rules="all" summary="Properties for keyring_hashicorp_commit_auth_path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code>keyring_hashicorp_commit_auth_path</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  This variable is associated with `keyring_hashicorp_auth_path`, from which it takes its value during `keyring_hashicorp` plugin initialization. This variable is unavailable unless that plugin is installed. It reflects the “committed” value actually used for plugin operation if initialization succeeds. For additional information, see keyring_hashicorp Configuration.

* `keyring_hashicorp_commit_ca_path`

  <table frame="box" rules="all" summary="Properties for keyring_hashicorp_commit_ca_path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code>keyring_hashicorp_commit_ca_path</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  This variable is associated with `keyring_hashicorp_ca_path`, from which it takes its value during `keyring_hashicorp` plugin initialization. This variable is unavailable unless that plugin is installed. It reflects the “committed” value actually used for plugin operation if initialization succeeds. For additional information, see keyring_hashicorp Configuration.

* `keyring_hashicorp_commit_caching`

  <table frame="box" rules="all" summary="Properties for keyring_hashicorp_commit_caching"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code>keyring_hashicorp_commit_caching</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  This variable is associated with `keyring_hashicorp_caching`, from which it takes its value during `keyring_hashicorp` plugin initialization. This variable is unavailable unless that plugin is installed. It reflects the “committed” value actually used for plugin operation if initialization succeeds. For additional information, see keyring_hashicorp Configuration.

* `keyring_hashicorp_commit_role_id`

  <table frame="box" rules="all" summary="Properties for keyring_aws_conf_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-conf-file=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_conf_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>0

  This variable is associated with `keyring_hashicorp_role_id`, from which it takes its value during `keyring_hashicorp` plugin initialization. This variable is unavailable unless that plugin is installed. It reflects the “committed” value actually used for plugin operation if initialization succeeds. For additional information, see keyring_hashicorp Configuration.

* `keyring_hashicorp_commit_server_url`

  <table frame="box" rules="all" summary="Properties for keyring_aws_conf_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-conf-file=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_conf_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>1

  This variable is associated with `keyring_hashicorp_server_url`, from which it takes its value during `keyring_hashicorp` plugin initialization. This variable is unavailable unless that plugin is installed. It reflects the “committed” value actually used for plugin operation if initialization succeeds. For additional information, see keyring_hashicorp Configuration.

* `keyring_hashicorp_commit_store_path`

  <table frame="box" rules="all" summary="Properties for keyring_aws_conf_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-conf-file=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_conf_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>2

  This variable is associated with `keyring_hashicorp_store_path`, from which it takes its value during `keyring_hashicorp` plugin initialization. This variable is unavailable unless that plugin is installed. It reflects the “committed” value actually used for plugin operation if initialization succeeds. For additional information, see keyring_hashicorp Configuration.

* `keyring_hashicorp_role_id`

  <table frame="box" rules="all" summary="Properties for keyring_aws_conf_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-conf-file=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_conf_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>3

  The HashiCorp Vault AppRole authentication role ID, for use by the `keyring_hashicorp` plugin. This variable is unavailable unless that plugin is installed. The value must be in UUID format.

  This variable is mandatory. If not specified, `keyring_hashicorp` initialization fails.

* `keyring_hashicorp_secret_id`

  <table frame="box" rules="all" summary="Properties for keyring_aws_conf_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-conf-file=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_conf_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>4

  The HashiCorp Vault AppRole authentication secret ID, for use by the `keyring_hashicorp` plugin. This variable is unavailable unless that plugin is installed. The value must be in UUID format.

  This variable is mandatory. If not specified, `keyring_hashicorp` initialization fails.

  The value of this variable is sensitive, so its value is masked by `*` characters when displayed.

* `keyring_hashicorp_server_url`

  <table frame="box" rules="all" summary="Properties for keyring_aws_conf_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-conf-file=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_conf_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>5

  The HashiCorp Vault server URL, for use by the `keyring_hashicorp` plugin. This variable is unavailable unless that plugin is installed. The value must begin with `https://`.

* `keyring_hashicorp_store_path`

  <table frame="box" rules="all" summary="Properties for keyring_aws_conf_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-conf-file=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_conf_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>6

  A store path within the HashiCorp Vault server that is writeable when appropriate AppRole credentials are provided by the `keyring_hashicorp` plugin. This variable is unavailable unless that plugin is installed. To specify the credentials, set the `keyring_hashicorp_role_id` and `keyring_hashicorp_secret_id` system variables (for example, as shown in keyring_hashicorp Configuration).

  This variable is mandatory. If not specified, `keyring_hashicorp` initialization fails.

* `keyring_okv_conf_dir`

  <table frame="box" rules="all" summary="Properties for keyring_aws_conf_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-conf-file=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_conf_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>7

  The path name of the directory that stores configuration information used by the `keyring_okv` plugin. This variable is unavailable unless that plugin is installed. The location should be a directory considered for use only by the `keyring_okv` plugin. For example, do not locate the directory under the data directory.

  The default `keyring_okv_conf_dir` value is empty. For the `keyring_okv` plugin to be able to access Oracle Key Vault, the value must be set to a directory that contains Oracle Key Vault configuration and SSL materials. For instructions on setting up this directory, see Section 8.4.5.6, “Using the keyring_okv KMIP Plugin”.

  The directory should have a restrictive mode and be accessible only to the account used to run the MySQL server. For example, on Unix and Unix-like systems, to use the `/usr/local/mysql/mysql-keyring-okv` directory, the following commands (executed as `root`) create the directory and set its mode and ownership:

  ```
  cd /usr/local/mysql
  mkdir mysql-keyring-okv
  chmod 750 mysql-keyring-okv
  chown mysql mysql-keyring-okv
  chgrp mysql mysql-keyring-okv
  ```

  If the value assigned to `keyring_okv_conf_dir` specifies a directory that does not exist, or that does not contain configuration information that enables a connection to Oracle Key Vault to be established, `keyring_okv` writes an error message to the error log. If an attempted runtime assignment to `keyring_okv_conf_dir` results in an error, the variable value and keyring operation remain unchanged.

* `keyring_operations`

  <table frame="box" rules="all" summary="Properties for keyring_aws_conf_file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--keyring-aws-conf-file=file_name</code></td> </tr><tr><th>System Variable</th> <td><code>keyring_aws_conf_file</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>platform specific</code></td> </tr></tbody></table>8

  Whether keyring operations are enabled. This variable is used during key migration operations. See Section 8.4.5.14, “Migrating Keys Between Keyring Keystores”. The privileges required to modify this variable are `ENCRYPTION_KEY_ADMIN` in addition to either `SYSTEM_VARIABLES_ADMIN` or the deprecated `SUPER` privilege.


### 8.4.6 MySQL Enterprise Audit

Note

MySQL Enterprise Audit is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

MySQL Enterprise Edition includes MySQL Enterprise Audit, implemented using a server plugin named `audit_log`. MySQL Enterprise Audit uses the open MySQL Audit API to enable standard, policy-based monitoring, logging, and blocking of connection and query activity executed on specific MySQL servers. Designed to meet the Oracle audit specification, MySQL Enterprise Audit provides an out of box, easy to use auditing and compliance solution for applications that are governed by both internal and external regulatory guidelines.

When installed, the audit plugin enables MySQL Server to produce a log file containing an audit record of server activity. The log contents include when clients connect and disconnect, and what actions they perform while connected, such as which databases and tables they access. You can add statistics for the time and size of each query to detect outliers.

By default, MySQL Enterprise Audit uses tables in the `mysql` system database for persistent storage of filter and user account data. To use a different database, set the `audit_log_database` system variable at server startup.

After you install the audit plugin (see Section 8.4.6.2, “Installing or Uninstalling MySQL Enterprise Audit”), it writes an audit log file. By default, the file is named `audit.log` in the server data directory. To change the name of the file, set the `audit_log_file` system variable at server startup.

By default, audit log file contents are written in new-style XML format, without compression or encryption. To select the file format, set the `audit_log_format` system variable at server startup. For details on file format and contents, see Section 8.4.6.4, “Audit Log File Formats”.

For more information about controlling how logging occurs, including audit log file naming and format selection, see Section 8.4.6.5, “Configuring Audit Logging Characteristics”. To perform filtering of audited events, see Section 8.4.6.7, “Audit Log Filtering”. For descriptions of the parameters used to configure the audit log plugin, see Audit Log Options and Variables.

If the audit log plugin is enabled, the Performance Schema (see Chapter 29, *MySQL Performance Schema*) has instrumentation for it. To identify the relevant instruments, use this query:

```
SELECT NAME FROM performance_schema.setup_instruments
WHERE NAME LIKE '%/alog/%';
```


#### 8.4.6.1 Elements of MySQL Enterprise Audit

MySQL Enterprise Audit is based on the audit log plugin and related elements:

* A server-side plugin named `audit_log` examines auditable events and determines whether to write them to the audit log.

* A set of functions enables manipulation of filtering definitions that control logging behavior, the encryption password, and log file reading.

* Tables in the `mysql` system database provide persistent storage of filter and user account data, unless you set the `audit_log_database` system variable at server startup to specify a different database.

* System variables enable audit log configuration and status variables provide runtime operational information.

* The `AUDIT_ADMIN` privilege enable users to administer the audit log, and the `AUDIT_ABORT_EXEMPT` privilege enables system users to execute queries that would otherwise be blocked by an “abort” item in the audit log filter.


#### 8.4.6.2 Installing or Uninstalling MySQL Enterprise Audit

This section describes how to install or uninstall MySQL Enterprise Audit, which is implemented using the audit log plugin and related elements described in Section 8.4.6.1, “Elements of MySQL Enterprise Audit”. For general information about installing plugins, see Section 7.6.1, “Installing and Uninstalling Plugins”.

Plugin upgrades are not automatic when you upgrade a MySQL installation and some plugin loadable functions must be loaded manually (see Installing Loadable Functions). Alternatively, you can reinstall the plugin after upgrading MySQL to load new functions.

Important

Read this entire section before following its instructions. Parts of the procedure differ depending on your environment.

Note

If installed, the `audit_log` plugin involves some minimal overhead even when disabled. To avoid this overhead, do not install MySQL Enterprise Audit unless you plan to use it.

To be usable by the server, the plugin library file must be located in the MySQL plugin directory (the directory named by the `plugin_dir` system variable). If necessary, configure the plugin directory location by setting the value of `plugin_dir` at server startup.

To install MySQL Enterprise Audit, look in the `share` directory of your MySQL installation and choose the script that is appropriate for your platform. The available scripts differ in the file name used to refer to the script:

* `audit_log_filter_win_install.sql`
* `audit_log_filter_linux_install.sql`

Run the script as follows. The example here uses the Linux installation script and the default `mysql` system database. Make the appropriate substitution for your system.

```
$> mysql -u root -p -D mysql < audit_log_filter_linux_install.sql
Enter password: (enter root password here)
```

It is possible to specify a custom database for storing JSON filter tables when you run the installation script. Create the database first; its name should not exceed 64 characters. For example:

```
mysql> CREATE DATABASE IF NOT EXISTS database-name;
```

Next, run the script using the alternative database name.

```
$> mysql -u root -p -D database-name < audit_log_filter_linux_install.sql
Enter password: (enter root password here)
```

Note

Some MySQL versions have introduced changes to the structure of the MySQL Enterprise Audit tables. To ensure that your tables are up to date for upgrades from earlier versions of MySQL, perform the MySQL upgrade procedure, making sure to use the option that forces an update (see Chapter 3, *Upgrading MySQL*). If you prefer to run the update statements only for the MySQL Enterprise Audit tables, see the following discussion.

For new MySQL installations, the `USER` and `HOST` columns in the `audit_log_user` table used by MySQL Enterprise Audit have definitions that better correspond to the definitions of the `User` and `Host` columns in the `mysql.user` system table. For upgrades to an installation for which MySQL Enterprise Audit is already installed, it is recommended that you alter the table definitions as follows:

```
ALTER TABLE mysql.audit_log_user
  DROP FOREIGN KEY audit_log_user_ibfk_1;
ALTER TABLE mysql.audit_log_filter
  CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci;
ALTER TABLE mysql.audit_log_user
  CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_as_ci;
ALTER TABLE mysql.audit_log_user
  MODIFY COLUMN USER VARCHAR(32);
ALTER TABLE mysql.audit_log_user
  ADD FOREIGN KEY (FILTERNAME) REFERENCES mysql.audit_log_filter(NAME);
```

Note

To use MySQL Enterprise Audit in the context of source/replica replication, Group Replication, or InnoDB Cluster, you must prepare the replica nodes prior to running the installation script on the source node. This is necessary because the `INSTALL PLUGIN` statement in the script is not replicated.

1. On each replica node, extract the `INSTALL PLUGIN` statement from the installation script and execute it manually.

2. On the source node, run the installation script as described previously.

To verify plugin installation, examine the Information Schema `PLUGINS` table or use the `SHOW PLUGINS` statement (see Section 7.6.2, “Obtaining Server Plugin Information”). For example:

```
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

```
[mysqld]
audit-log=FORCE_PLUS_PERMANENT
```

If it is desired to prevent the server from running without the audit plugin, use `--audit-log` with a value of `FORCE` or `FORCE_PLUS_PERMANENT` to force server startup to fail if the plugin does not initialize successfully.

Important

By default, rule-based audit log filtering logs no auditable events for any users. This differs from legacy audit log behavior, which logs all auditable events for all users (see Section 8.4.6.10, “Legacy Mode Audit Log Filtering”). Should you wish to produce log-everything behavior with rule-based filtering, create a simple filter to enable logging and assign it to the default account:

```
SELECT audit_log_filter_set_filter('log_all', '{ "filter": { "log": true } }');
SELECT audit_log_filter_set_user('%', 'log_all');
```

The filter assigned to `%` is used for connections from any account that has no explicitly assigned filter (which initially is true for all accounts).

When installed as just described, MySQL Enterprise Audit remains installed until uninstalled. To remove it, run the uninstall script located in the `share` directory of your MySQL installation. The example here specifies the default system database, `mysql`. Make the appropriate substitution for your system.

```
$> mysql -u root -p -D mysql < audit_log_filter_uninstall.sql
Enter password: (enter root password here)
```


#### 8.4.6.3 MySQL Enterprise Audit Security Considerations

By default, contents of audit log files produced by the audit log plugin are not encrypted and may contain sensitive information, such as the text of SQL statements. For security reasons, audit log files should be written to a directory accessible only to the MySQL server and to users with a legitimate reason to view the log. The default file name is `audit.log` in the data directory. This can be changed by setting the `audit_log_file` system variable at server startup. Other audit log files may exist due to log rotation.

For additional security, enable audit log file encryption. See Encrypting Audit Log Files.


#### 8.4.6.4 Audit Log File Formats

The MySQL server calls the audit log plugin to write an audit record to its log file whenever an auditable event occurs. Typically the first audit record written after plugin startup contains the server description and startup options. Elements following that one represent events such as client connect and disconnect events, executed SQL statements, and so forth. Only top-level statements are logged, not statements within stored programs such as triggers or stored procedures. Contents of files referenced by statements such as [`LOAD DATA`](load-data.html "15.2.9 LOAD DATA Statement") are not logged.

To select the log format that the audit log plugin uses to write its log file, set the `audit_log_format` system variable at server startup. These formats are available:

* New-style XML format (`audit_log_format=NEW`): An XML format that has better compatibility with Oracle Audit Vault than old-style XML format. MySQL 9.5 uses new-style XML format by default.

* Old-style XML format (`audit_log_format=OLD`): The original audit log format used by default in older MySQL series.

* JSON format (`audit_log_format=JSON`): Writes the audit log as a JSON array. Only this format supports the optional query time and size statistics.

By default, audit log file contents are written in new-style XML format, without compression or encryption.

If you change `audit_log_format`, it is recommended that you also change `audit_log_file`. For example, if you set `audit_log_format` to `JSON`, set `audit_log_file` to `audit.json`. Otherwise, newer log files will have a different format than older files, but they will all have the same base name with nothing to indicate when the format changed.

* New-Style XML Audit Log File Format
* Old-Style XML Audit Log File Format
* JSON Audit Log File Format

##### New-Style XML Audit Log File Format

Here is a sample log file in new-style XML format (`audit_log_format=NEW`), reformatted slightly for readability:

```
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
  <CONNECTION_ATTRIBUTES>
   <ATTRIBUTE>
    <NAME>_pid</NAME>
    <VALUE>42794</VALUE>
   </ATTRIBUTE>
   ...
   <ATTRIBUTE>
    <NAME>program_name</NAME>
    <VALUE>mysqladmin</VALUE>
   </ATTRIBUTE>
  </CONNECTION_ATTRIBUTES>
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

  ```
  #x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
  ```

The following elements are mandatory in every `<AUDIT_RECORD>` element:

* `<NAME>`

  A string representing the type of instruction that generated the audit event, such as a command that the server received from a client.

  Example:

  ```
  <NAME>Query</NAME>
  ```

  Some common `<NAME>` values:

  ```
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

  ```
  INSERT INTO t3 SELECT t1.* FROM t1 JOIN t2;
  ```

  Each `TableXXX` event contains `<TABLE>` and `<DB>` elements to identify the table to which the event refers and the database that contains the table.

* `<RECORD_ID>`

  A unique identifier for the audit record. The value is composed from a sequence number and timestamp, in the format `SEQ_TIMESTAMP`. When the audit log plugin opens the audit log file, it initializes the sequence number to the size of the audit log file, then increments the sequence by 1 for each record logged. The timestamp is a UTC value in `YYYY-MM-DDThh:mm:ss` format indicating the date and time when the audit log plugin opened the file.

  Example:

  ```
  <RECORD_ID>12_2019-10-03T14:06:33</RECORD_ID>
  ```

* `<TIMESTAMP>`

  A string representing a UTC value in `YYYY-MM-DDThh:mm:ss UTC` format indicating the date and time when the audit event was generated. For example, the event corresponding to execution of an SQL statement received from a client has a `<TIMESTAMP>` value occurring after the statement finishes, not when it was received.

  Example:

  ```
  <TIMESTAMP>2019-10-03T14:09:45 UTC</TIMESTAMP>
  ```

The following elements are optional in `<AUDIT_RECORD>` elements. Many of them occur only with specific `<NAME>` element values.

* `<COMMAND_CLASS>`

  A string that indicates the type of action performed.

  Example:

  ```
  <COMMAND_CLASS>drop_table</COMMAND_CLASS>
  ```

  The values correspond to the `statement/sql/xxx` command counters. For example, *`xxx`* is `drop_table` and `select` for [`DROP TABLE`](drop-table.html "15.1.37 DROP TABLE Statement") and `SELECT` statements, respectively. The following statement displays the possible names:

  ```
  SELECT REPLACE(EVENT_NAME, 'statement/sql/', '') AS name
  FROM performance_schema.events_statements_summary_global_by_event_name
  WHERE EVENT_NAME LIKE 'statement/sql/%'
  ORDER BY name;
  ```

* `<CONNECTION_ATTRIBUTES>`

  Events with a `<COMMAND_CLASS>` value of `connect` may include a `<CONNECTION_ATTRIBUTES>` element to display the connection attributes passed by the client at connect time. (For information about these attributes, which are also exposed in Performance Schema tables, see Section 29.12.9, “Performance Schema Connection Attribute Tables”.)

  The `<CONNECTION_ATTRIBUTES>` element contains one `<ATTRIBUTE>` element per attribute, each of which contains `<NAME>` and `<VALUE>` elements to indicate the attribute name and value, respectively.

  Example:

  ```
  <CONNECTION_ATTRIBUTES>
   <ATTRIBUTE>
    <NAME>_pid</NAME>
    <VALUE>42794</VALUE>
   </ATTRIBUTE>
   <ATTRIBUTE>
    <NAME>_os</NAME>
    <VALUE>macos0.14</VALUE>
   </ATTRIBUTE>
   <ATTRIBUTE>
    <NAME>_platform</NAME>
    <VALUE>x86_64</VALUE>
   </ATTRIBUTE>
   <ATTRIBUTE>
    <NAME>_client_version</NAME>
    <VALUE>8.4.0</VALUE>
   </ATTRIBUTE>
   <ATTRIBUTE>
    <NAME>_client_name</NAME>
    <VALUE>libmysql</VALUE>
   </ATTRIBUTE>
   <ATTRIBUTE>
    <NAME>program_name</NAME>
    <VALUE>mysqladmin</VALUE>
   </ATTRIBUTE>
  </CONNECTION_ATTRIBUTES>
  ```

  If no connection attributes are present in the event, none are logged and no `<CONNECTION_ATTRIBUTES>` element appears. This can occur if the connection attempt is unsuccessful, the client passes no attributes, or the connection occurs internally such as during server startup or when initiated by a plugin.

* `<CONNECTION_ID>`

  An unsigned integer representing the client connection identifier. This is the same as the value returned by the `CONNECTION_ID()` function within the session.

  Example:

  ```
  <CONNECTION_ID>127</CONNECTION_ID>
  ```

* `<CONNECTION_TYPE>`

  The security state of the connection to the server. Permitted values are `TCP/IP` (TCP/IP connection established without encryption), `SSL/TLS` (TCP/IP connection established with encryption), `Socket` (Unix socket file connection), `Named Pipe` (Windows named pipe connection), and `Shared Memory` (Windows shared memory connection).

  Example:

  ```
  <CONNECTION_TYPE>SSL/TLS</CONNECTION_TYPE>
  ```

* `<DB>`

  A string representing a database name.

  Example:

  ```
  <DB>test</DB>
  ```

  For connect events, this element indicates the default database; the element is empty if there is no default database. For table-access events, the element indicates the database to which the accessed table belongs.

* `<HOST>`

  A string representing the client host name.

  Example:

  ```
  <HOST>localhost</HOST>
  ```

* `<IP>`

  A string representing the client IP address.

  Example:

  ```
  <IP>127.0.0.1</IP>
  ```

* `<MYSQL_VERSION>`

  A string representing the MySQL server version. This is the same as the value of the `VERSION()` function or `version` system variable.

  Example:

  ```
  <MYSQL_VERSION>5.7.21-log</MYSQL_VERSION>
  ```

* `<OS_LOGIN>`

  A string representing the external user name used during the authentication process, as set by the plugin used to authenticate the client. With native (built-in) MySQL authentication, or if the plugin does not set the value, this element is empty. The value is the same as that of the `external_user` system variable (see Section 8.2.19, “Proxy Users”).

  Example:

  ```
  <OS_LOGIN>jeffrey</OS_LOGIN>
  ```

* `<OS_VERSION>`

  A string representing the operating system on which the server was built or is running.

  Example:

  ```
  <OS_VERSION>x86_64-Linux</OS_VERSION>
  ```

* `<PRIV_USER>`

  A string representing the user that the server authenticated the client as. This is the user name that the server uses for privilege checking, and may differ from the `<USER>` value.

  Example:

  ```
  <PRIV_USER>jeffrey</PRIV_USER>
  ```

* `<PROXY_USER>`

  A string representing the proxy user (see Section 8.2.19, “Proxy Users”). The value is empty if user proxying is not in effect.

  Example:

  ```
  <PROXY_USER>developer</PROXY_USER>
  ```

* `<SERVER_ID>`

  An unsigned integer representing the server ID. This is the same as the value of the `server_id` system variable.

  Example:

  ```
  <SERVER_ID>1</SERVER_ID>
  ```

* `<SQLTEXT>`

  A string representing the text of an SQL statement. The value can be empty. Long values may be truncated. The string, like the audit log file itself, is written using UTF-8 (up to 4 bytes per character), so the value may be the result of conversion. For example, the original statement might have been received from the client as an SJIS string.

  Example:

  ```
  <SQLTEXT>DELETE FROM t1</SQLTEXT>
  ```

* `<STARTUP_OPTIONS>`

  A string representing the options that were given on the command line or in option files when the MySQL server was started. The first option is the path to the server executable.

  Example:

  ```
  <STARTUP_OPTIONS>/usr/local/mysql/bin/mysqld
    --port=3306 --log_output=FILE</STARTUP_OPTIONS>
  ```

* `<STATUS>`

  An unsigned integer representing the command status: 0 for success, nonzero if an error occurred. This is the same as the value of the `mysql_errno()` C API function. See the description for `<STATUS_CODE>` for information about how it differs from `<STATUS>`.

  The audit log does not contain the SQLSTATE value or error message. To see the associations between error codes, SQLSTATE values, and messages, see Server Error Message Reference.

  Warnings are not logged.

  Example:

  ```
  <STATUS>1051</STATUS>
  ```

* `<STATUS_CODE>`

  An unsigned integer representing the command status: 0 for success, 1 if an error occurred.

  The `STATUS_CODE` value differs from the `STATUS` value: `STATUS_CODE` is 0 for success and 1 for error, which is compatible with the EZ_collector consumer for Audit Vault. `STATUS` is the value of the `mysql_errno()` C API function. This is 0 for success and nonzero for error, and thus is not necessarily 1 for error.

  Example:

  ```
  <STATUS_CODE>0</STATUS_CODE>
  ```

* `<TABLE>`

  A string representing a table name.

  Example:

  ```
  <TABLE>t3</TABLE>
  ```

* `<USER>`

  A string representing the user name sent by the client. This may differ from the `<PRIV_USER>` value.

  Example:

  ```
  <USER>root[root] @ localhost [127.0.0.1]</USER>
  ```

* `<VERSION>`

  An unsigned integer representing the version of the audit log file format.

  Example:

  ```
  <VERSION>1</VERSION>
  ```

##### Old-Style XML Audit Log File Format

Here is a sample log file in old-style XML format (`audit_log_format=OLD`), reformatted slightly for readability:

```
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

  ```
  #x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
  ```

The following attributes are mandatory in every `<AUDIT_RECORD>` element:

* `NAME`

  A string representing the type of instruction that generated the audit event, such as a command that the server received from a client.

  Example: `NAME="Query"`

  Some common `NAME` values:

  ```
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

  ```
  INSERT INTO t3 SELECT t1.* FROM t1 JOIN t2;
  ```

  Each `TableXXX` event has `TABLE` and `DB` attributes to identify the table to which the event refers and the database that contains the table.

  `Connect` events for old-style XML audit log format do not include connection attributes.

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

  The values correspond to the `statement/sql/xxx` command counters. For example, *`xxx`* is `drop_table` and `select` for [`DROP TABLE`](drop-table.html "15.1.37 DROP TABLE Statement") and `SELECT` statements, respectively. The following statement displays the possible names:

  ```
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

  A string representing the external user name used during the authentication process, as set by the plugin used to authenticate the client. With native (built-in) MySQL authentication, or if the plugin does not set the value, this attribute is empty. The value is the same as that of the `external_user` system variable (see Section 8.2.19, “Proxy Users”).

  Example: `OS_LOGIN="jeffrey"`

* `OS_VERSION`

  A string representing the operating system on which the server was built or is running.

  Example: `OS_VERSION="x86_64-Linux"`

* `PRIV_USER`

  A string representing the user that the server authenticated the client as. This is the user name that the server uses for privilege checking, and it may differ from the `USER` value.

  Example: `PRIV_USER="jeffrey"`

* `PROXY_USER`

  A string representing the proxy user (see Section 8.2.19, “Proxy Users”). The value is empty if user proxying is not in effect.

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

  The `STATUS_CODE` value differs from the `STATUS` value: `STATUS_CODE` is 0 for success and 1 for error, which is compatible with the EZ_collector consumer for Audit Vault. `STATUS` is the value of the `mysql_errno()` C API function. This is 0 for success and nonzero for error, and thus is not necessarily 1 for error.

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

```
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

JSON format is the only audit log file format that supports the optional query time and size statistics. This data is available in the slow query log for qualifying queries, and in the context of the audit log it similarly helps to detect outliers for activity analysis.

To add the query statistics to the log file, you must set them up as a filter using the `audit_log_filter_set_filter()` audit log function as the service element of the JSON filtering syntax. For instructions to do this, see Adding Query Statistics for Outlier Detection. For the `bytes_sent` and `bytes_received` fields to be populated, the system variable `log_slow_extra` must be set to ON.

The following examples show the JSON object formats for different event types (as indicated by the `class` and `event` items), reformatted slightly for readability:

Auditing startup event:

```
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

```
{ "timestamp": "2019-10-03 14:28:20",
  "id": 3,
  "class": "audit",
  "event": "shutdown",
  "connection_id": 0,
  "shutdown_data": { "server_id": 1 } }
```

When the audit log plugin is uninstalled as a result of server shutdown (as opposed to being disabled at runtime), `connection_id` is set to 0, and `account` and `login` are not present.

Connect or change-user event:

```
{ "timestamp": "2019-10-03 14:23:18",
  "id": 1,
  "class": "connection",
  "event": "connect",
  "connection_id": 5,
  "account": { "user": "root", "host": "localhost" },
  "login": { "user": "root", "os": "", "ip": "::1", "proxy": "" },
  "connection_data": { "connection_type": "ssl",
                       "status": 0,
                       "db": "test",
                       "connection_attributes": {
                         "_pid": "43236",
                         ...
                         "program_name": "mysqladmin"
                       } }
}
```

Disconnect event:

```
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

```
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

Query event with optional query statistics for outlier detection:

```
{ "timestamp": "2022-01-28 13:09:30",
  "id": 0,
  "class": "general",
  "event": "status",
  "connection_id": 46,
  "account": { "user": "user", "host": "localhost" },
  "login": { "user": "user", “os": "", “ip": "127.0.0.1", “proxy": "" },
  "general_data": { "command": "Query",
                    "sql_command": "insert",
	            "query": "INSERT INTO audit_table VALUES(4)",
	            "status": 1146 }
  "query_statistics": { "query_time": 0.116250,
                        "bytes_sent": 18384,
                        "bytes_received": 78858,
                        "rows_sent": 3,
                        "rows_examined": 20878 } }
```

Table access event (read, delete, insert, update):

```
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

  ```
  "account": { "user": "root", "host": "localhost" }
  ```

* `class`

  A string representing the event class. The class defines the type of event, when taken together with the `event` item that specifies the event subclass.

  Example:

  ```
  "class": "connection"
  ```

  The following table shows the permitted combinations of `class` and `event` values.

  **Table 8.34 Audit Log Class and Event Combinations**

  <table summary="Permitted combinations of audit log class and event values."><col style="width: 30%"/><col style="width: 40%"/><thead><tr> <th>Class Value</th> <th>Permitted Event Values</th> </tr></thead><tbody><tr> <td><code>audit</code></td> <td><code>startup</code>, <code>shutdown</code></td> </tr><tr> <td><code>connection</code></td> <td><code>connect</code>, <code>change_user</code>, <code>disconnect</code></td> </tr><tr> <td><code>general</code></td> <td><code>status</code></td> </tr><tr> <td><code>table_access_data</code></td> <td><code>read</code>, <code>delete</code>, <code>insert</code>, <code>update</code></td> </tr></tbody></table>

* `connection_data`

  Information about a client connection. The value is a hash containing these items: `connection_type`, `status`, `db`, and possibly `connection_attributes`. This item occurs only for audit records with a `class` value of `connection`.

  Example:

  ```
  "connection_data": { "connection_type": "ssl",
                       "status": 0,
                       "db": "test" }
  ```

  Events with a `class` value of `connection` and `event` value of `connect` may include a `connection_attributes` item to display the connection attributes passed by the client at connect time. (For information about these attributes, which are also exposed in Performance Schema tables, see Section 29.12.9, “Performance Schema Connection Attribute Tables”.)

  The `connection_attributes` value is a hash that represents each attribute by its name and value.

  Example:

  ```
  "connection_attributes": {
    "_pid": "43236",
    "_os": "macos0.14",
    "_platform": "x86_64",
    "_client_version": "8.4.0",
    "_client_name": "libmysql",
    "program_name": "mysqladmin"
  }
  ```

  If no connection attributes are present in the event, none are logged and no `connection_attributes` item appears. This can occur if the connection attempt is unsuccessful, the client passes no attributes, or the connection occurs internally such as during server startup or when initiated by a plugin.

* `connection_id`

  An unsigned integer representing the client connection identifier. This is the same as the value returned by the `CONNECTION_ID()` function within the session.

  Example:

  ```
  "connection_id": 5
  ```

* `event`

  A string representing the subclass of the event class. The subclass defines the type of event, when taken together with the `class` item that specifies the event class. For more information, see the `class` item description.

  Example:

  ```
  "event": "connect"
  ```

* `general_data`

  Information about an executed statement or command. The value is a hash containing these items: `command`, `sql_command`, `query`, `status`. This item occurs only for audit records with a `class` value of `general`.

  Example:

  ```
  "general_data": { "command": "Query",
                    "sql_command": "show_variables",
                    "query": "SHOW VARIABLES",
                    "status": 0 }
  ```

* `id`

  An unsigned integer representing an event ID.

  Example:

  ```
  "id": 2
  ```

  For audit records that have the same `timestamp` value, their `id` values distinguish them and form a sequence. Within the audit log, `timestamp`/`id` pairs are unique. These pairs are bookmarks that identify event locations within the log.

* `login`

  Information indicating how a client connected to the server. The value is a hash containing these items: `user`, `os`, `ip`, `proxy`.

  Example:

  ```
  "login": { "user": "root", "os": "", "ip": "::1", "proxy": "" }
  ```

* `query_statistics`

  Optional query statistics for outlier detection. The value is a hash containing these items: `query_time`, `rows_sent`, `rows_examined`, `bytes_received`, `bytes_sent`. For instructions to set up the query statistics, see Adding Query Statistics for Outlier Detection.

  Example:

  ```
  "query_statistics": { "query_time": 0.116250,
                        "bytes_sent": 18384,
                        "bytes_received": 78858,
                        "rows_sent": 3,
                        "rows_examined": 20878 }
  ```

* `shutdown_data`

  Information pertaining to audit log plugin termination. The value is a hash containing these items: `server_id` This item occurs only for audit records with `class` and `event` values of `audit` and `shutdown`, respectively.

  Example:

  ```
  "shutdown_data": { "server_id": 1 }
  ```

* `startup_data`

  Information pertaining to audit log plugin initialization. The value is a hash containing these items: `server_id`, `os_version`, `mysql_version`, `args`. This item occurs only for audit records with `class` and `event` values of `audit` and `startup`, respectively.

  Example:

  ```
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

  ```
  "table_access_data": { "db": "test",
                         "table": "t1",
                         "query": "INSERT INTO t1 (i) VALUES(1),(2),(3)",
                         "sql_command": "insert" }
  ```

* `time`

  This field is similar to that in the `timestamp` field, but the value is an integer and represents the UNIX timestamp value indicating the date and time when the audit event was generated.

  Example:

  ```
  "time" : 1618498687
  ```

  The `time` field occurs in JSON-format log files only if the `audit_log_format_unix_timestamp` system variable is enabled.

* `timestamp`

  A string representing a UTC value in *`YYYY-MM-DD hh:mm:ss`* format indicating the date and time when the audit event was generated. For example, the event corresponding to execution of an SQL statement received from a client has a `timestamp` value occurring after the statement finishes, not when it was received.

  Example:

  ```
  "timestamp": "2019-10-03 13:50:01"
  ```

  For audit records that have the same `timestamp` value, their `id` values distinguish them and form a sequence. Within the audit log, `timestamp`/`id` pairs are unique. These pairs are bookmarks that identify event locations within the log.

These items appear within hash values associated with top-level items of JSON-format audit records:

* `args`

  An array of options that were given on the command line or in option files when the MySQL server was started. The first option is the path to the server executable.

  Example:

  ```
  "args": ["/usr/local/mysql/bin/mysqld",
           "--loose-audit-log-format=JSON",
           "--log-error=log.err",
           "--pid-file=mysqld.pid",
           "--port=3306" ]
  ```

* `bytes_received`

  The number of bytes received from the client. This item is part of the optional query statistics. For this field to be populated, the system variable `log_slow_extra` must be set to `ON`.

  Example:

  ```
  "bytes_received": 78858
  ```

* `bytes_sent`

  The number of bytes sent to the client. This item is part of the optional query statistics. For this field to be populated, the system variable `log_slow_extra` must be set to `ON`.

  Example:

  ```
  "bytes_sent": 18384
  ```

* `command`

  A string representing the type of instruction that generated the audit event, such as a command that the server received from a client.

  Example:

  ```
  "command": "Query"
  ```

* `connection_type`

  The security state of the connection to the server. Permitted values are `tcp/ip` (TCP/IP connection established without encryption), `ssl` (TCP/IP connection established with encryption), `socket` (Unix socket file connection), `named_pipe` (Windows named pipe connection), and `shared_memory` (Windows shared memory connection).

  Example:

  ```
  "connection_type": "tcp/tcp"
  ```

* `db`

  A string representing a database name. For `connection_data`, it is the default database. For `table_access_data`, it is the table database.

  Example:

  ```
  "db": "test"
  ```

* `host`

  A string representing the client host name.

  Example:

  ```
  "host": "localhost"
  ```

* `ip`

  A string representing the client IP address.

  Example:

  ```
  "ip": "::1"
  ```

* `mysql_version`

  A string representing the MySQL server version. This is the same as the value of the `VERSION()` function or `version` system variable.

  Example:

  ```
  "mysql_version": "5.7.21-log"
  ```

* `os`

  A string representing the external user name used during the authentication process, as set by the plugin used to authenticate the client. With native (built-in) MySQL authentication, or if the plugin does not set the value, this attribute is empty. The value is the same as that of the `external_user` system variable. See Section 8.2.19, “Proxy Users”.

  Example:

  ```
  "os": "jeffrey"
  ```

* `os_version`

  A string representing the operating system on which the server was built or is running.

  Example:

  ```
  "os_version": "i686-Linux"
  ```

* `proxy`

  A string representing the proxy user (see Section 8.2.19, “Proxy Users”). The value is empty if user proxying is not in effect.

  Example:

  ```
  "proxy": "developer"
  ```

* `query`

  A string representing the text of an SQL statement. The value can be empty. Long values may be truncated. The string, like the audit log file itself, is written using UTF-8 (up to 4 bytes per character), so the value may be the result of conversion. For example, the original statement might have been received from the client as an SJIS string.

  Example:

  ```
  "query": "DELETE FROM t1"
  ```

* `query_time`

  The query execution time in microseconds (if the `longlong` data type is selected) or seconds (if the `double` data type is selected). This item is part of the optional query statistics.

  Example:

  ```
  "query_time": 0.116250
  ```

* `rows_examined`

  The number of rows accessed during the query. This item is part of the optional query statistics.

  Example:

  ```
  "rows_examined": 20878
  ```

* `rows_sent`

  The number of rows sent to the client as a result. This item is part of the optional query statistics.

  Example:

  ```
  "rows_sent": 3
  ```

* `server_id`

  An unsigned integer representing the server ID. This is the same as the value of the `server_id` system variable.

  Example:

  ```
  "server_id": 1
  ```

* `sql_command`

  A string that indicates the SQL statement type.

  Example:

  ```
  "sql_command": "insert"
  ```

  The values correspond to the `statement/sql/xxx` command counters. For example, *`xxx`* is `drop_table` and `select` for [`DROP TABLE`](drop-table.html "15.1.37 DROP TABLE Statement") and `SELECT` statements, respectively. The following statement displays the possible names:

  ```
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

  ```
  "status": 1051
  ```

* `table`

  A string representing a table name.

  Example:

  ```
  "table": "t1"
  ```

* `user`

  A string representing a user name. The meaning differs depending on the item within which `user` occurs:

  + Within `account` items, `user` is a string representing the user that the server authenticated the client as. This is the user name that the server uses for privilege checking.

  + Within `login` items, `user` is a string representing the user name sent by the client.

  Example:

  ```
  "user": "root"
  ```


#### 8.4.6.5 Configuring Audit Logging Characteristics

This section describes how to configure audit logging characteristics, such as the file to which the audit log plugin writes events, the format of written events, whether to enable log file compression and encryption, and space management.

* Naming Conventions for Audit Log Files
* Selecting Audit Log File Format
* Enabling the Audit Log Flush Task
* Adding Query Statistics for Outlier Detection
* Compressing Audit Log Files
* Encrypting Audit Log Files
* Manually Uncompressing and Decrypting Audit Log Files
* Space Management of Audit Log Files
* Write Strategies for Audit Logging

For additional information about the functions and system variables that affect audit logging, see Audit Log Functions, and Audit Log Options and Variables.

The audit log plugin can also control which audited events are written to the audit log file, based on event content or the account from which events originate. See Section 8.4.6.7, “Audit Log Filtering”.

##### Naming Conventions for Audit Log Files

To configure the audit log file name, set the `audit_log_file` system variable at server startup. The default name is `audit.log` in the server data directory. For best security, write the audit log to a directory accessible only to the MySQL server and to users with a legitimate reason to view the log.

The plugin interprets the `audit_log_file` value as composed of an optional leading directory name, a base name, and an optional suffix. If compression or encryption are enabled, the effective file name (the name actually used to create the log file) differs from the configured file name because it has additional suffixes:

* If compression is enabled, the plugin adds a suffix of `.gz`.

* If encryption is enabled, the plugin adds a suffix of `.pwd_id.enc`, where *`pwd_id`* indicates which encryption password to use for log file operations. The audit log plugin stores encryption passwords in the keyring; see Encrypting Audit Log Files.

The effective audit log file name is the name resulting from the addition of applicable compression and encryption suffixes to the configured file name. For example, if the configured `audit_log_file` value is `audit.log`, the effective file name is one of the values shown in the following table.

<table summary="audit_log effective file names for various combinations of the compression and encryption features."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Enabled Features</th> <th>Effective File Name</th> </tr></thead><tbody><tr> <td>No compression or encryption</td> <td><code>audit.log</code></td> </tr><tr> <td>Compression</td> <td><code>audit.log.gz</code></td> </tr><tr> <td>Encryption</td> <td><code>audit.log.<code>pwd_id</code>.enc</code></td> </tr><tr> <td>Compression, encryption</td> <td><code>audit.log.gz.<code>pwd_id</code>.enc</code></td> </tr></tbody></table>

*`pwd_id`* indicates the ID of the password used to encrypt or decrypt a file. *`pwd_id`* format is *`pwd_timestamp-seq`*, where:

* *`pwd_timestamp`* is a UTC value in `YYYYMMDDThhmmss` format indicating when the password was created.

* *`seq`* is a sequence number. Sequence numbers start at 1 and increase for passwords that have the same *`pwd_timestamp`* value.

Here are some example *`pwd_id`* password ID values:

```
20190403T142359-1
20190403T142400-1
20190403T142400-2
```

To construct the corresponding keyring IDs for storing passwords in the keyring, the audit log plugin adds a prefix of `audit_log-` to the *`pwd_id`* values. For the example password IDs just shown, the corresponding keyring IDs are:

```
audit_log-20190403T142359-1
audit_log-20190403T142400-1
audit_log-20190403T142400-2
```

The ID of the password currently used for encryption by the audit log plugin is the one having the largest *`pwd_timestamp`* value. If multiple passwords have that *`pwd_timestamp`* value, the current password ID is the one with the largest sequence number. For example, in the preceding set of password IDs, two of them have the largest timestamp, `20190403T142400`, so the current password ID is the one with the largest sequence number (`2`).

The audit log plugin performs certain actions during initialization and termination based on the effective audit log file name:

* During initialization, the plugin checks whether a file with the audit log file name already exists and renames it if so. (In this case, the plugin assumes that the previous server invocation exited unexpectedly with the audit log plugin running.) The plugin then writes to a new empty audit log file.

* During termination, the plugin renames the audit log file.
* File renaming (whether during plugin initialization or termination) occurs according to the usual rules for automatic size-based log file rotation; see Manual Audit Log File Rotation.

##### Selecting Audit Log File Format

To configure the audit log file format, set the `audit_log_format` system variable at server startup. These formats are available:

* `NEW`: New-style XML format. This is the default.

* `OLD`: Old-style XML format.
* `JSON`: JSON format. Writes the audit log as a JSON array. Only this format supports the optional query time and size statistics.

For details about each format, see Section 8.4.6.4, “Audit Log File Formats”.

##### Enabling the Audit Log Flush Task

MySQL Enterprise Audit provides the capability of setting a refresh interval to dispose of the in-memory cache automatically. A flush task configured using the `audit_log_flush_interval_seconds` system variable has a value of zero by default, which means the task is not scheduled to run.

When the task is configured to run (the value is non-zero), MySQL Enterprise Audit attempts to call the scheduler component at its initialization and configure a regular, recurring flush of its memory cache:

* If the audit log cannot find an implementation of the scheduler registration service, it does not schedule the flush and continue loading.

* Audit log implements the `dynamic_loader_services_loaded_notification` service and listens for new registrations of `mysql_scheduler` so that audit log can register its scheduled task into the newly loaded scheduler.

* Audit log only registers itself into the first scheduler implementation loaded.

Similarly, MySQL Enterprise Audit calls the `scheduler` component at its deinitialization and unconfigures the recurring flush that it has scheduled. It keeps an active reference to the scheduler registration service until the scheduled task is unregistered, ensuring that the `scheduler` component cannot be unloaded while there are active scheduled jobs. All of the results from executing the scheduler and its tasks are written to the server error log.

To schedule an audit log flush task:

1. Confirm that the `scheduler` component is loaded and enabled. The component is enabled (`ON`) by default (see `component_scheduler.enabled`).

   ```
   SELECT * FROM mysql.components;
   +--------------+--------------------+----------------------------+
   | component_id | component_group_id | component_urn              |
   +--------------+--------------------+----------------------------+
   |            1 |                  1 | file://component_scheduler |
   +--------------+--------------------+----------------------------+
   ```

2. Install the `audit_log` plugin, if it is not installed already (see Section 8.4.6.2, “Installing or Uninstalling MySQL Enterprise Audit”).

3. Start the server using `audit_log_flush_interval_seconds` and set the value to a number greater than 59. The upper limit of the value varies by platform. For example, to configure the flush task to recur every two minutes:

   ```
   $> mysqld --audit_log_flush_interval_seconds=120
   ```

   For more information, see the `audit_log_flush_interval_seconds` system variable.

##### Adding Query Statistics for Outlier Detection

In MySQL 9.5, you can extend log files in JSON format with optional data fields to show the query time, the number of bytes sent and received, the number of rows returned to the client, and the number of rows examined. This data is available in the slow query log for qualifying queries, and in the context of the audit log it similarly helps to detect outliers for activity analysis. The extended data fields can be added only when the audit log is in JSON format (`audit_log_format=JSON`), which is not the default setting.

The query statistics are delivered to the audit log through component services that you set up as an audit log filtering function. The services are named `mysql_audit_print_service_longlong_data_source` and `mysql_audit_print_service_double_data_source`. You can choose either data type for each output item. For the query time, `longlong` outputs the value in microseconds, and `double` outputs the value in seconds.

You add the query statistics using the `audit_log_filter_set_filter()` audit log function, as the `service` element of the JSON filtering syntax, as follows:

```
SELECT audit_log_filter_set_filter('QueryStatistics',
                                   '{ "filter": { "class": { "name": "general", "event": { "name": "status", "print" : '
                                   '{ "service": { "implementation": "mysql_server", "tag": "query_statistics", "element": [ '
                                   '{ "name": "query_time",     "type": "double" }, '
                                   '{ "name": "bytes_sent",     "type": "longlong" }, '
                                   '{ "name": "bytes_received", "type": "longlong" }, '
                                   '{ "name": "rows_sent",      "type": "longlong" }, '
                                   '{ "name": "rows_examined",  "type": "longlong" } ] } } } } } }');
```

For the `bytes_sent` and `bytes_received` fields to be populated, the system variable `log_slow_extra` must be set to `ON`. If the system variable value is `OFF`, a null value is written to the log file for these fields.

If you want to stop collecting the query statistics, use the `audit_log_filter_set_filter()` audit log function to remove the filter, for example:

```
SELECT audit_log_filter_remove_filter('QueryStatistics');
```

##### Compressing Audit Log Files

Audit log file compression can be enabled for any logging format.

To configure audit log file compression, set the `audit_log_compression` system variable at server startup. Permitted values are `NONE` (no compression; the default) and `GZIP` (GNU Zip compression).

If both compression and encryption are enabled, compression occurs before encryption. To recover the original file manually, first decrypt it, then uncompress it. See Manually Uncompressing and Decrypting Audit Log Files.

##### Encrypting Audit Log Files

Audit log file encryption can be enabled for any logging format. Encryption is based on user-defined passwords (with the exception of the initial password that the audit log plugin generates). To use this feature, the MySQL keyring must be enabled because audit logging uses it for password storage. Any keyring component or plugin can be used; for instructions, see Section 8.4.5, “The MySQL Keyring”.

To configure audit log file encryption, set the `audit_log_encryption` system variable at server startup. Permitted values are `NONE` (no encryption; the default) and `AES` (AES-256-CBC cipher encryption).

To set or get an encryption password at runtime, use these audit log functions:

* To set the current encryption password, invoke `audit_log_encryption_password_set()`. This function stores the new password in the keyring. If encryption is enabled, it also performs a log file rotation operation that renames the current log file, and begins a new log file encrypted with the password. File renaming occurs according to the usual rules for automatic size-based log file rotation; see Manual Audit Log File Rotation.

  If the `audit_log_password_history_keep_days` system variable is nonzero, invoking `audit_log_encryption_password_set()` also causes expiration of old archived audit log encryption passwords. For information about audit log password history, including password archiving and expiration, see the description of that variable.

* To get the current encryption password, invoke `audit_log_encryption_password_get()` with no argument. To get a password by ID, pass an argument that specifies the keyring ID of the current password or an archived password.

  To determine which audit log keyring IDs exist, query the Performance Schema `keyring_keys` table:

  ```
  mysql> SELECT KEY_ID FROM performance_schema.keyring_keys
         WHERE KEY_ID LIKE 'audit_log%'
         ORDER BY KEY_ID;
  +-----------------------------+
  | KEY_ID                      |
  +-----------------------------+
  | audit_log-20190415T152248-1 |
  | audit_log-20190415T153507-1 |
  | audit_log-20190416T125122-1 |
  | audit_log-20190416T141608-1 |
  +-----------------------------+
  ```

For additional information about audit log encryption functions, see Audit Log Functions.

When the audit log plugin initializes, if it finds that log file encryption is enabled, it checks whether the keyring contains an audit log encryption password. If not, the plugin automatically generates a random initial encryption password and stores it in the keyring. To discover this password, invoke `audit_log_encryption_password_get()`.

If both compression and encryption are enabled, compression occurs before encryption. To recover the original file manually, first decrypt it, then uncompress it. See Manually Uncompressing and Decrypting Audit Log Files.

##### Manually Uncompressing and Decrypting Audit Log Files

Audit log files can be uncompressed and decrypted using standard tools. This should be done only for log files that have been closed (archived) and are no longer in use, not for the log file that the audit log plugin is currently writing. You can recognize archived log files because they have been renamed by the audit log plugin to include a timestamp in the file name just after the base name.

For this discussion, assume that `audit_log_file` is set to `audit.log`. In that case, an archived audit log file has one of the names shown in the following table.

<table summary="audit_log archived file names for various combinations of the compression and encryption features."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Enabled Features</th> <th>Archived File Name</th> </tr></thead><tbody><tr> <td>No compression or encryption</td> <td><code>audit.<code>timestamp</code>.log</code></td> </tr><tr> <td>Compression</td> <td><code>audit.<code>timestamp</code>.log.gz</code></td> </tr><tr> <td>Encryption</td> <td><code>audit.<code>timestamp</code>.log.<code>pwd_id</code>.enc</code></td> </tr><tr> <td>Compression, encryption</td> <td><code>audit.<code>timestamp</code>.log.gz.<code>pwd_id</code>.enc</code></td> </tr></tbody></table>

As discussed in Naming Conventions for Audit Log Files, *`pwd_id`* format is *`pwd_timestamp-seq`*. Thus, the names of archived encrypted log files actually contain two timestamps. The first indicates file rotation time, and the second indicates when the encryption password was created.

Consider the following set of archived encrypted log file names:

```
audit.20190410T205827.log.20190403T185337-1.enc
audit.20190410T210243.log.20190403T185337-1.enc
audit.20190415T145309.log.20190414T223342-1.enc
audit.20190415T151322.log.20190414T223342-2.enc
```

Each file name has a unique rotation-time timestamp. By contrast, the password timestamps are not unique:

* The first two files have the same password ID and sequence number (`20190403T185337-1`). They have the same encryption password.

* The second two files have the same password ID (`20190414T223342`) but different sequence numbers (`1`, `2`). These files have different encryption passwords.

To uncompress a compressed log file manually, use **gunzip**, **gzip -d**, or equivalent command. For example:

```
gunzip -c audit.timestamp.log.gz > audit.timestamp.log
```

To decrypt an encrypted log file manually, use the **openssl** command. For example:

```
openssl enc -d -aes-256-cbc -pass pass:password -md sha256
    -in audit.timestamp.log.pwd_id.enc
    -out audit.timestamp.log
```

To execute that command, you must obtain *`password`*, the encryption password. To do this, use `audit_log_encryption_password_get()`. For example, if the audit log file name is `audit.20190415T151322.log.20190414T223342-2.enc`, the password ID is `20190414T223342-2` and the keyring ID is `audit-log-20190414T223342-2`. Retrieve the keyring password like this:

```
SELECT audit_log_encryption_password_get('audit-log-20190414T223342-2');
```

If both compression and encryption are enabled for audit logging, compression occurs before encryption. In this case, the file name has `.gz` and `.pwd_id.enc` suffixes added, corresponding to the order in which those operations occur. To recover the original file manually, perform the operations in reverse. That is, first decrypt the file, then uncompress it:

```
openssl enc -d -aes-256-cbc -pass pass:password -md sha256
    -in audit.timestamp.log.gz.pwd_id.enc
    -out audit.timestamp.log.gz
gunzip -c audit.timestamp.log.gz > audit.timestamp.log
```

##### Space Management of Audit Log Files

The audit log file has the potential to grow quite large and consume a great deal of disk space. If you are collecting the optional query time and size statistics, this increases the space requirements. The query statistics are only supported with JSON format.

To manage the space used, employ these methods:

* Log file rotation. This involves rotating the current log file by renaming it, then opening a new current log file using the original name. Rotation can be performed manually, or configured to occur automatically.

* Pruning of rotated JSON-format log files, if automatic rotation is enabled. Pruning can be performed based on log file age or combined log file size.

To configure audit log file space management, use the following system variables:

* If `audit_log_rotate_on_size` is 0 (the default), automatic log file rotation is disabled.

  + No rotation occurs unless performed manually.
  + To rotate the current file, use one of the following methods:

    - Run `SELECT audit_log_rotate();` to rename the file and open a new audit log file using the original name.

      With this file rotation method, pruning of rotated JSON-format log files occurs if `audit_log_max_size` or `audit_log_prune_seconds` has a value greater than 0.

    - Manually rename the file, then enable `audit_log_flush` to close it and open a new current log file using the original name. This file rotation method and the `audit_log_flush` variable are deprecated.

      With this file rotation method, pruning of rotated JSON-format log files does not occur; `audit_log_max_size` and `audit_log_prune_seconds` have no effect.

    See Manual Audit Log File Rotation, for more information.

* If `audit_log_rotate_on_size` is greater than 0, automatic audit log file rotation is enabled:

  + Automatic rotation occurs when a write to the current log file causes its size to exceed the `audit_log_rotate_on_size` value, as well as under certain other conditions; see Automatic Audit Log File Rotation. When automatic rotation occurs, the audit log plugin renames the current log file and opens a new current log file using the original name.

  + Pruning of rotated JSON-format log files occurs if `audit_log_max_size` or `audit_log_prune_seconds` has a value greater than 0.

  + `audit_log_flush` has no effect.

Note

For JSON-format log files, rotation also occurs when the value of the `audit_log_format_unix_timestamp` system variable is changed at runtime. However, this does not occur for space-management purposes, but rather so that, for a given JSON-format log file, all records in the file either do or do not include the `time` field.

Note

Rotated (renamed) log files are not removed automatically. For example, with size-based log file rotation, renamed log files have unique names and accumulate indefinitely. They do not rotate off the end of the name sequence. To avoid excessive use of space:

* For JSON-format log files: Enable log file pruning as described in Audit Log File Pruning.

* Otherwise: Remove old files periodically, backing them up first as necessary. If backed-up log files are encrypted, also back up the corresponding encryption passwords to a safe place, should you need to decrypt the files later.

The following sections describe log file rotation and pruning in greater detail.

* Manual Audit Log File Rotation
* Manual Audit Log File Rotation (Old Method)")
* Automatic Audit Log File Rotation
* Audit Log File Pruning

###### Manual Audit Log File Rotation

If `audit_log_rotate_on_size` is 0 (the default), no log rotation occurs unless performed manually.

To rotate the audit log file manually, run `SELECT audit_log_rotate();` to rename the current audit log file and open a new audit log file. Files are renamed according to the conventions described in Naming Conventions for Audit Log Files.

The `AUDIT_ADMIN` privilege is required to use the `audit_log_rotate()` function.

Managing the number of archived log files (the files that have been renamed) and the space they use is a manual task that involves removing archived audit log files that are no longer needed from your file system.

The content of audit log files that are renamed using the `audit_log_rotate()` function can be read by `audit_log_read()` function.

###### Manual Audit Log File Rotation (Old Method)

Note

The `audit_log_flush` variable and this method of audit log file rotation are deprecated; expect support to be removed in a future version of MySQL.

If `audit_log_rotate_on_size` is 0 (the default), no log rotation occurs unless performed manually. In this case, the audit log plugin closes and reopens the log file when the `audit_log_flush` value changes from disabled to enabled. Log file renaming must be done externally to the server. Suppose that the log file name is `audit.log` and you want to maintain the three most recent log files, cycling through the names `audit.log.1` through `audit.log.3`. On Unix, perform rotation manually like this:

1. From the command line, rename the current log files:

   ```
   mv audit.log.2 audit.log.3
   mv audit.log.1 audit.log.2
   mv audit.log audit.log.1
   ```

   This strategy overwrites the current `audit.log.3` contents, placing a bound on the number of archived log files and the space they use.

2. At this point, the plugin is still writing to the current log file, which has been renamed to `audit.log.1`. Connect to the server and flush the log file so the plugin closes it and reopens a new `audit.log` file:

   ```
   SET GLOBAL audit_log_flush = ON;
   ```

   `audit_log_flush` is special in that its value remains `OFF` so that you need not disable it explicitly before enabling it again to perform another flush.

Note

If compression or encryption are enabled, log file names include suffixes that signify the enabled features, as well as a password ID if encryption is enabled. If file names include a password ID, be sure to retain the ID in the name of any files you rename manually so that the password to use for decryption operations can be determined.

Note

For JSON-format logging, renaming audit log files manually makes them unavailable to the log-reading functions because the audit log plugin can no longer determine that they are part of the log file sequence (see Section 8.4.6.6, “Reading Audit Log Files”). Consider setting `audit_log_rotate_on_size` greater than 0 to use size-based rotation instead.

###### Automatic Audit Log File Rotation

If `audit_log_rotate_on_size` is greater than 0, setting `audit_log_flush` has no effect. Instead, whenever a write to the current log file causes its size to exceed the `audit_log_rotate_on_size` value, the audit log plugin automatically renames the current log file and opens a new current log file using the original name.

Automatic size-based rotation also occurs under these conditions:

* During plugin initialization, if a file with the audit log file name already exists (see Naming Conventions for Audit Log Files).

* During plugin termination.
* When the `audit_log_encryption_password_set()` function is called to set the encryption password, if encryption is enabled. (Rotation does not occur if encryption is disabled.)

The plugin renames the original file by inserting a timestamp just after its base name. For example, if the file name is `audit.log`, the plugin renames it to a value such as `audit.20210115T140633.log`. The timestamp is a UTC value in `YYYYMMDDThhmmss` format. For XML logging, the timestamp indicates rotation time. For JSON logging, the timestamp is that of the last event written to the file.

If log files are encrypted, the original file name already contains a timestamp indicating the encryption password creation time (see Naming Conventions for Audit Log Files). In this case, the file name after rotation contains two timestamps. For example, an encrypted log file named `audit.log.20210110T130749-1.enc` is renamed to a value such as `audit.20210115T140633.log.20210110T130749-1.enc`.

###### Audit Log File Pruning

The audit log plugin supports pruning of rotated JSON-format audit log files, if automatic log file rotation is enabled. To use this capability:

* Set `audit_log_format` to `JSON`. (In addition, consider also changing `audit_log_file`; see Selecting Audit Log File Format.)

* Set `audit_log_rotate_on_size` greater than 0 to specify the size in bytes at which automatic log file rotation occurs.

* By default, no pruning of automatically rotated JSON-format log files occurs. To enable pruning, set one of these system variables to a value greater than 0:

  + Set `audit_log_max_size` greater than 0 to specify the limit in bytes on the combined size of rotated log files above which the files become subject to pruning.

  + Set `audit_log_prune_seconds` greater than 0 to specify the number of seconds after which rotated log files become subject to pruning.

  Nonzero values of `audit_log_max_size` take precedence over nonzero values of `audit_log_prune_seconds`. If both are set greater than 0 at plugin initialization, a warning is written to the server error log. If a client sets both greater than 0 at runtime, a warning is returned to the client.

  Note

  Warnings to the error log are written as Notes, which are information messages. To ensure that such messages appear in the error log and are not discarded, make sure that error-logging verbosity is sufficient to include information messages. For example, if you are using priority-based log filtering, as described in Section 7.4.2.5, “Priority-Based Error Log Filtering (log_filter_internal)”"), set the `log_error_verbosity` system variable to a value of 3.

Pruning of JSON-format log files, if enabled, occurs as follows:

* When automatic rotation takes place; for the conditions under which this happens, see Automatic Audit Log File Rotation.

* When the global `audit_log_max_size` or `audit_log_prune_seconds` system variable is set at runtime.

For pruning based on combined rotated log file size, if the combined size is greater than the limit specified by `audit_log_max_size`, the audit log plugin removes the oldest files until their combined size does not exceed the limit.

For pruning based on rotated log file age, the pruning point is the current time minus the value of `audit_log_prune_seconds`. In rotated JSON-format log files, the timestamp part of each file name indicates the timestamp of the last event written to the file. The audit log plugin uses file name timestamps to determine which files contain only events older than the pruning point, and removes them.

##### Write Strategies for Audit Logging

The audit log plugin can use any of several strategies for log writes. Regardless of strategy, logging occurs on a best-effort basis, with no guarantee of consistency.

To specify a write strategy, set the `audit_log_strategy` system variable at server startup. By default, the strategy value is `ASYNCHRONOUS` and the plugin logs asynchronously to a buffer, waiting if the buffer is full. You can tell the plugin not to wait (`PERFORMANCE`) or to log synchronously, either using file system caching (`SEMISYNCHRONOUS`) or forcing output with a `sync()` call after each write request (`SYNCHRONOUS`).

In many cases, the plugin writes directly to a JSON-format audit log if the current query is too large for the buffer. The write strategy determines how the plugin increments the direct write count. You can track the number direct writes with the `Audit_log_direct_writes` status variable.

For asynchronous write strategy, the `audit_log_buffer_size` system variable is the buffer size in bytes. Set this variable at server startup to change the buffer size. The plugin uses a single buffer, which it allocates when it initializes and removes when it terminates. The plugin does not allocate this buffer for nonasynchronous write strategies.

Asynchronous logging strategy has these characteristics:

* Minimal impact on server performance and scalability.
* Blocking of threads that generate audit events for the shortest possible time; that is, time to allocate the buffer plus time to copy the event to the buffer.

* Output goes to the buffer. A separate thread handles writes from the buffer to the log file.

With asynchronous logging, the integrity of the log file may be compromised if a problem occurs during a write to the file or if the plugin does not shut down cleanly (for example, in the event that the server host exits unexpectedly). To reduce this risk, set `audit_log_strategy` to use synchronous logging.

A disadvantage of `PERFORMANCE` strategy is that it drops events when the buffer is full. For a heavily loaded server, the audit log may have events missing.


#### 8.4.6.6 Reading Audit Log Files

The audit log plugin supports functions that provide an SQL interface for reading JSON-format audit log files. (This capability does not apply to log files written in other formats.)

When the audit log plugin initializes and is configured for JSON logging, it uses the directory containing the current audit log file as the location to search for readable audit log files. The plugin determines the file location, base name, and suffix from the value of the `audit_log_file` system variable, then looks for files with names that match the following pattern, where `[...]` indicates optional file name parts:

```
basename[.timestamp].suffix[.gz][[.pwd_id].enc]
```

If a file name ends with `.enc`, the file is encrypted and reading its unencrypted contents requires a decryption password obtained from the keyring. The audit log plugin determines the keyring ID of the decryption password as follows:

* If `.enc` is preceded by *`pwd_id`*, the keyring ID is `audit_log-pwd_id`.

* If `.enc` is not preceded by *`pwd_id`*, the file has an old name from before audit log encryption password history was implemented. The keyring ID is `audit_log`.

For more information about encrypted audit log files, see Encrypting Audit Log Files.

The plugin ignores files that have been renamed manually and do not match the pattern, and files that were encrypted with a password no longer available in the keyring. The plugin opens each remaining candidate file, verifies that the file actually contains `JSON` audit events, and sorts the files using the timestamps from the first event of each file. The result is a sequence of files that are subject to access using the log-reading functions:

* `audit_log_read()` reads events from the audit log or closes the reading process.

* `audit_log_read_bookmark()` returns a bookmark for the most recently written audit log event. This bookmark is suitable for passing to `audit_log_read()` to indicate where to begin reading.

`audit_log_read()` takes an optional `JSON` string argument, and the result returned from a successful call to either function is a `JSON` string.

To use the functions to read the audit log, follow these principles:

* Call `audit_log_read()` to read events beginning from a given position or the current position, or to close reading:

  + To initialize an audit log read sequence, pass an argument that indicates the position at which to begin. One way to do so is to pass the bookmark returned by `audit_log_read_bookmark()`:

    ```
    SELECT audit_log_read(audit_log_read_bookmark());
    ```

  + To continue reading from the current position in the sequence, call `audit_log_read()` with no position specified:

    ```
    SELECT audit_log_read();
    ```

  + To explicitly close the read sequence, pass a `JSON` `null` argument:

    ```
    SELECT audit_log_read('null');
    ```

    It is unnecessary to close reading explicitly. Reading is closed implicitly when the session ends or a new read sequence is initialized by calling `audit_log_read()` with an argument that indicates the position at which to begin.

* A successful call to `audit_log_read()` to read events returns a `JSON` string containing an array of audit events:

  + If the final value of the returned array is not a `JSON` `null` value, there are more events following those just read and `audit_log_read()` can be called again to read more of them.

  + If the final value of the returned array is a `JSON` `null` value, there are no more events left to be read in the current read sequence.

  Each non-`null` array element is an event represented as a `JSON` hash. For example:

  ```
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

To specify a position to `audit_log_read()`, include an argument that indicates where to begin reading. For example, pass a bookmark, which is a `JSON` hash containing `timestamp` and `id` elements that uniquely identify a particular event. Here is an example bookmark, obtained by calling the `audit_log_read_bookmark()` function:

```
mysql> SELECT audit_log_read_bookmark();
+-------------------------------------------------+
| audit_log_read_bookmark()                       |
+-------------------------------------------------+
| { "timestamp": "2020-05-18 21:03:44", "id": 0 } |
+-------------------------------------------------+
```

Passing the current bookmark to `audit_log_read()` initializes event reading beginning at the bookmark position:

```
mysql> SELECT audit_log_read(audit_log_read_bookmark());
+-----------------------------------------------------------------------+
| audit_log_read(audit_log_read_bookmark())                             |
+-----------------------------------------------------------------------+
| [ {"timestamp":"2020-05-18 22:41:24","id":0,"class":"connection", ... |
+-----------------------------------------------------------------------+
```

The argument to `audit_log_read()` is optional. If present, it can be a `JSON` `null` value to close the read sequence, or a `JSON` hash.

Within a hash argument to `audit_log_read()`, items are optional and control aspects of the read operation such as the position at which to begin reading or how many events to read. The following items are significant (other items are ignored):

* `start`: The position within the audit log of the first event to read. The position is given as a timestamp and the read starts from the first event that occurs on or after the timestamp value. The `start` item has this format, where *`value`* is a literal timestamp value:

  ```
  "start": { "timestamp": "value" }
  ```

* `timestamp`, `id`: The position within the audit log of the first event to read. The `timestamp` and `id` items together comprise a bookmark that uniquely identify a particular event. If an `audit_log_read()` argument includes either item, it must include both to completely specify a position or an error occurs.

* `max_array_length`: The maximum number of events to read from the log. If this item is omitted, the default is to read to the end of the log or until the read buffer is full, whichever comes first.

To specify a starting position to `audit_log_read()`, pass a hash argument that includes either a `start` item or a bookmark consisting of `timestamp` and `id` items. If a hash argument includes both a `start` item and a bookmark, an error occurs.

If a hash argument specifies no starting position, reading continues from the current position.

If a timestamp value includes no time part, a time part of `00:00:00` is assumed.

Example arguments accepted by `audit_log_read()`:

* Read events starting with the first event that occurs on or after the given timestamp:

  ```
  audit_log_read('{ "start": { "timestamp": "2020-05-24 12:30:00" } }')
  ```

* Like the previous example, but read at most 3 events:

  ```
  audit_log_read('{ "start": { "timestamp": "2020-05-24 12:30:00" }, "max_array_length": 3 }')
  ```

* Read events starting with the first event that occurs on or after `2020-05-24 00:00:00` (the timestamp includes no time part, so `00:00:00` is assumed):

  ```
  audit_log_read('{ "start": { "timestamp": "2020-05-24" } }')
  ```

* Read events starting with the event that has the exact timestamp and event ID:

  ```
  audit_log_read('{ "timestamp": "2020-05-24 12:30:00", "id": 0 }')
  ```

* Like the previous example, but read at most 3 events:

  ```
  audit_log_read('{ "timestamp": "2020-05-24 12:30:00", "id": 0, "max_array_length": 3 }')
  ```

* Read events from the current position in the read sequence:

  ```
  audit_log_read()
  ```

* Read at most 5 events beginning at the current position in the read sequence:

  ```
  audit_log_read('{ "max_array_length": 5 }')
  ```

* Close the current read sequence:

  ```
  audit_log_read('null')
  ```

A `JSON` string returned from either log-reading function can be manipulated as necessary. Suppose that a call to obtain a bookmark produces this value:

```
mysql> SET @mark := audit_log_read_bookmark();
mysql> SELECT @mark;
+-------------------------------------------------+
| @mark                                           |
+-------------------------------------------------+
| { "timestamp": "2020-05-18 16:10:28", "id": 2 } |
+-------------------------------------------------+
```

Calling `audit_log_read()` with that argument can return multiple events. To limit `audit_log_read()` to reading at most *`N`* events, add to the string a `max_array_length` item with that value. For example, to read a single event, modify the string as follows:

```
mysql> SET @mark := JSON_SET(@mark, '$.max_array_length', 1);
mysql> SELECT @mark;
+----------------------------------------------------------------------+
| @mark                                                                |
+----------------------------------------------------------------------+
| {"id": 2, "timestamp": "2020-05-18 16:10:28", "max_array_length": 1} |
+----------------------------------------------------------------------+
```

The modified string, when passed to `audit_log_read()`, produces a result containing at most one event, no matter how many are available.

If an audit log function is invoked from within the **mysql** client, binary string results display using hexadecimal notation, depending on the value of the `--binary-as-hex`. For more information about that option, see Section 6.5.1, “mysql — The MySQL Command-Line Client”.

To set a limit on the number of bytes that `audit_log_read()` reads, set the `audit_log_read_buffer_size` system variable. This variable has a default of 32KB and can be set at runtime. Each client should set its session value of `audit_log_read_buffer_size` appropriately for its use of `audit_log_read()`.

Each call to `audit_log_read()` returns as many available events as fit within the buffer size. Events that do not fit within the buffer size are skipped and generate warnings. Given this behavior, consider these factors when assessing the proper buffer size for an application:

* There is a tradeoff between number of calls to `audit_log_read()` and events returned per call:

  + With a smaller buffer size, calls return fewer events, so more calls are needed.

  + With a larger buffer size, calls return more events, so fewer calls are needed.

* With a smaller buffer size, such as the default size of 32KB, there is a greater chance for events to exceed the buffer size and thus to be skipped.

For additional information about audit log-reading functions, see Audit Log Functions.


#### 8.4.6.7 Audit Log Filtering

Note

For audit log filtering to work as described here, the audit log plugin *and the accompanying audit tables and functions* must be installed. If the plugin is installed without the accompanying audit tables and functions needed for rule-based filtering, the plugin operates in legacy filtering mode, described in Section 8.4.6.10, “Legacy Mode Audit Log Filtering”. Legacy mode (deprecated) is filtering behavior as it was prior to MySQL 5.7.13; that is, before the introduction of rule-based filtering.

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

  + Filter rules have the capability of blocking (aborting) execution of qualifying events, in addition to existing capabilities for event logging.

  + Multiple filters can be defined, and any given filter can be assigned to any number of user accounts.

  + It is possible to define a default filter to use with any user account that has no explicitly assigned filter.

  Audit log filtering is used to implement component services. To get the optional query statistics available from that release, you set them up as a filter using the service component, which implements the services that write the statistics to the audit log. For instructions to set this filter up, see Adding Query Statistics for Outlier Detection.

  For information about writing filtering rules, see Section 8.4.6.8, “Writing Audit Log Filter Definitions”.

* Audit log filters can be defined and modified using an SQL interface based on function calls. By default, audit log filter definitions are stored in the `mysql` system database, and you can display audit filters by querying the `mysql.audit_log_filter` table. It is possible to use a different database for this purpose, in which case you should query the `database_name.audit_log_filter` table instead. See Section 8.4.6.2, “Installing or Uninstalling MySQL Enterprise Audit”, for more information.

* Within a given session, the value of the read-only `audit_log_filter_id` system variable indicates whether a filter is assigned to the session.

Note

By default, rule-based audit log filtering logs no auditable events for any users. To log all auditable events for all users, use the following statements, which create a simple filter to enable logging and assign it to the default account:

```
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

* To use any filtering function, the `audit_log` plugin must be enabled or an error occurs. In addition, the audit tables must exist or an error occurs. To install the `audit_log` plugin and its accompanying functions and tables, see Section 8.4.6.2, “Installing or Uninstalling MySQL Enterprise Audit”.

* To use any filtering function, a user must possess the `AUDIT_ADMIN` `SUPER` privilege or an error occurs. To grant one of these privileges to a user account, use this statement:

  ```
  GRANT privilege ON *.* TO user;
  ```

  Alternatively, should you prefer to avoid granting the `AUDIT_ADMIN` or `SUPER` privilege while still permitting users to access specific filtering functions, “wrapper” stored programs can be defined. This technique is described in the context of keyring functions in Using General-Purpose Keyring Functions; it can be adapted for use with filtering functions.

* The `audit_log` plugin operates in legacy mode if it is installed but the accompanying audit tables and functions are not created. The plugin writes these messages to the error log at server startup:

  ```
  [Warning] Plugin audit_log reported: 'Failed to open the audit log filter tables.'
  [Warning] Plugin audit_log reported: 'Audit Log plugin supports a filtering,
  which has not been installed yet. Audit Log plugin will run in the legacy
  mode, which will be disabled in the next release.'
  ```

  In legacy mode, which is deprecated, filtering can be done based only on event account or status. For details, see Section 8.4.6.10, “Legacy Mode Audit Log Filtering”.

* It is theoretically possible for a user with sufficient permissions to mistakenly create an “abort” item in the audit log filter that prevents themselves and other administrators from accessing the system. The `AUDIT_ABORT_EXEMPT` privilege is available to permit a user account’s queries to always be executed even if an “abort” item would block them. Accounts with this privilege can therefore be used to regain access to a system following an audit misconfiguration. The query is still logged in the audit log, but instead of being rejected, it is permitted due to the privilege.

  Accounts created with the `SYSTEM_USER` privilege have the `AUDIT_ABORT_EXEMPT` privilege assigned automatically when they are created. The `AUDIT_ABORT_EXEMPT` privilege is also assigned to existing accounts with the `SYSTEM_USER` privilege when you carry out an upgrade procedure, if no existing accounts have that privilege assigned.

##### Using Audit Log Filtering Functions

Before using the audit log functions, install them according to the instructions provided in Section 8.4.6.2, “Installing or Uninstalling MySQL Enterprise Audit”. The `AUDIT_ADMIN` or `SUPER` privilege is required to use any of these functions.

The audit log filtering functions enable filtering control by providing an interface to create, modify, and remove filter definitions and assign filters to user accounts.

Filter definitions are `JSON` values. For information about using `JSON` data in MySQL, see Section 13.5, “The JSON Data Type”. This section shows some simple filter definitions. For more information about filter definitions, see Section 8.4.6.8, “Writing Audit Log Filter Definitions”.

When a connection arrives, the audit log plugin determines which filter to use for the new session by searching for the user account name in the current filter assignments:

* If a filter is assigned to the user, the audit log uses that filter.

* Otherwise, if no user-specific filter assignment exists, but there is a filter assigned to the default account (`%`), the audit log uses the default filter.

* Otherwise, the audit log selects no audit events from the session for processing.

If a change-user operation occurs during a session (see mysql_change_user()), filter assignment for the session is updated using the same rules but for the new user.

By default, no accounts have a filter assigned, so no processing of auditable events occurs for any account.

Suppose that you want to change the default to be to log only connection-related activity (for example, to see connect, change-user, and disconnect events, but not the SQL statements users execute while connected). To achieve this, define a filter (shown here named `log_conn_events`) that enables logging only of events in the `connection` class, and assign that filter to the default account, represented by the `%` account name:

```
SET @f = '{ "filter": { "class": { "name": "connection" } } }';
SELECT audit_log_filter_set_filter('log_conn_events', @f);
SELECT audit_log_filter_set_user('%', 'log_conn_events');
```

Now the audit log uses this default account filter for connections from any account that has no explicitly defined filter.

To assign a filter explicitly to a particular user account or accounts, define the filter, then assign it to the relevant accounts:

```
SELECT audit_log_filter_set_filter('log_all', '{ "filter": { "log": true } }');
SELECT audit_log_filter_set_user('user1@localhost', 'log_all');
SELECT audit_log_filter_set_user('user2@localhost', 'log_all');
```

Now full logging is enabled for `user1@localhost` and `user2@localhost`. Connections from other accounts continue to be filtered using the default account filter.

To disassociate a user account from its current filter, either unassign the filter or assign a different filter:

* To unassign the filter from the user account:

  ```
  SELECT audit_log_filter_remove_user('user1@localhost');
  ```

  Filtering of current sessions for the account remains unaffected. Subsequent connections from the account are filtered using the default account filter if there is one, and are not logged otherwise.

* To assign a different filter to the user account:

  ```
  SELECT audit_log_filter_set_filter('log_nothing', '{ "filter": { "log": false } }');
  SELECT audit_log_filter_set_user('user1@localhost', 'log_nothing');
  ```

  Filtering of current sessions for the account remains unaffected. Subsequent connections from the account are filtered using the new filter. For the filter shown here, that means no logging for new connections from `user1@localhost`.

For audit log filtering, user name and host name comparisons are case-sensitive. This differs from comparisons for privilege checking, for which host name comparisons are not case-sensitive.

To remove a filter, do this:

```
SELECT audit_log_filter_remove_filter('log_nothing');
```

Removing a filter also unassigns it from any users to whom it is assigned, including any current sessions for those users.

The filtering functions just described affect audit filtering immediately and update the audit log tables in the `mysql` system database that store filters and user accounts (see Audit Log Tables). It is also possible to modify the audit log tables directly using statements such as `INSERT`, `UPDATE`, and `DELETE`, but such changes do not affect filtering immediately. To flush your changes and make them operational, call `audit_log_filter_flush()`:

```
SELECT audit_log_filter_flush();
```

Warning

`audit_log_filter_flush()` should be used only after modifying the audit tables directly, to force reloading all filters. Otherwise, this function should be avoided. It is, in effect, a simplified version of unloading and reloading the `audit_log` plugin with `UNINSTALL PLUGIN` plus `INSTALL PLUGIN`.

`audit_log_filter_flush()` affects all current sessions and detaches them from their previous filters. Current sessions are no longer logged unless they disconnect and reconnect, or execute a change-user operation.

To determine whether a filter is assigned to the current session, check the session value of the read-only `audit_log_filter_id` system variable. If the value is 0, no filter is assigned. A nonzero value indicates the internally maintained ID of the assigned filter:

```
mysql> SELECT @@audit_log_filter_id;
+-----------------------+
| @@audit_log_filter_id |
+-----------------------+
|                     2 |
+-----------------------+
```


#### 8.4.6.8 Writing Audit Log Filter Definitions

Filter definitions are `JSON` values. For information about using `JSON` data in MySQL, see Section 13.5, “The JSON Data Type”.

Filter definitions have this form, where *`actions`* indicates how filtering takes place:

```
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
* Replacement of Event Field Values
* Replacing a User Filter

##### Logging All Events

To explicitly enable or disable logging of all events, use a `log` item in the filter:

```
{
  "filter": { "log": true }
}
```

The `log` value can be either `true` or `false`.

The preceding filter enables logging of all events. It is equivalent to:

```
{
  "filter": { }
}
```

Logging behavior depends on the `log` value and whether `class` or `event` items are specified:

* With `log` specified, its given value is used.

* Without `log` specified, logging is `true` if no `class` or `event` item is specified, and `false` otherwise (in which case, `class` or `event` can include their own `log` item).

##### Logging Specific Event Classes

To log events of a specific class, use a `class` item in the filter, with its `name` field denoting the name of the class to log:

```
{
  "filter": {
    "class": { "name": "connection" }
  }
}
```

The `name` value can be `connection`, `general`, or `table_access` to log connection, general, or table-access events, respectively.

The preceding filter enables logging of events in the `connection` class. It is equivalent to the following filter with `log` items made explicit:

```
{
  "filter": {
    "log": false,
    "class": { "log": true,
               "name": "connection" }
  }
}
```

To enable logging of multiple classes, define the `class` value as a `JSON` array element that names the classes:

```
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

```
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

```
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

```
"event": [
  { "name": "read", "log": false },
  { "name": "insert", "log": true },
  { "name": "delete", "log": true },
  { "name": "update", "log": true }
]
```

The `event` item can also indicate whether to block qualifying events, if it contains an `abort` item. For details, see Blocking Execution of Specific Events.

Table 8.35, “Event Class and Subclass Combinations” describes the permitted subclass values for each event class.

**Table 8.35 Event Class and Subclass Combinations**

<table summary="Permitted combiniations of event class and subclass values."><col style="width: 20%"/><col style="width: 20%"/><col style="width: 60%"/><thead><tr> <th scope="col">Event Class</th> <th scope="col">Event Subclass</th> <th scope="col">Description</th> </tr></thead><tbody><tr> <th scope="row"><code>connection</code></th> <td><code>connect</code></td> <td>Connection initiation (successful or unsuccessful)</td> </tr><tr> <th scope="row"><code>connection</code></th> <td><code>change_user</code></td> <td>User re-authentication with different user/password during session</td> </tr><tr> <th scope="row"><code>connection</code></th> <td><code>disconnect</code></td> <td>Connection termination</td> </tr><tr> <th scope="row"><code>general</code></th> <td><code>status</code></td> <td>General operation information</td> </tr><tr> <th scope="row"><code>message</code></th> <td><code>internal</code></td> <td>Internally generated message</td> </tr><tr> <th scope="row"><code>message</code></th> <td><code>user</code></td> <td>Message generated by <code>audit_api_message_emit_udf()</code></td> </tr><tr> <th scope="row"><code>table_access</code></th> <td><code>read</code></td> <td>Table read statements, such as <code>SELECT</code> or <code>INSERT INTO ... SELECT</code></td> </tr><tr> <th scope="row"><code>table_access</code></th> <td><code>delete</code></td> <td>Table delete statements, such as <code>DELETE</code> or <code>TRUNCATE TABLE</code></td> </tr><tr> <th scope="row"><code>table_access</code></th> <td><code>insert</code></td> <td>Table insert statements, such as <code>INSERT</code> or <code>REPLACE</code></td> </tr><tr> <th scope="row"><code>table_access</code></th> <td><code>update</code></td> <td>Table update statements, such as <code>UPDATE</code></td> </tr></tbody></table>

Table 8.36, “Log and Abort Characteristics Per Event Class and Subclass Combination” describes for each event subclass whether it can be logged or aborted.

**Table 8.36 Log and Abort Characteristics Per Event Class and Subclass Combination**

<table summary="Log and abort characteristics for event class and subclass combinations."><col style="width: 20%"/><col style="width: 20%"/><col style="width: 30%"/><col style="width: 30%"/><thead><tr> <th scope="col">Event Class</th> <th scope="col">Event Subclass</th> <th scope="col">Can be Logged</th> <th scope="col">Can be Aborted</th> </tr></thead><tbody><tr> <th scope="row"><code>connection</code></th> <td><code>connect</code></td> <td>Yes</td> <td>No</td> </tr><tr> <th scope="row"><code>connection</code></th> <td><code>change_user</code></td> <td>Yes</td> <td>No</td> </tr><tr> <th scope="row"><code>connection</code></th> <td><code>disconnect</code></td> <td>Yes</td> <td>No</td> </tr><tr> <th scope="row"><code>general</code></th> <td><code>status</code></td> <td>Yes</td> <td>No</td> </tr><tr> <th scope="row"><code>message</code></th> <td><code>internal</code></td> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row"><code>message</code></th> <td><code>user</code></td> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row"><code>table_access</code></th> <td><code>read</code></td> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row"><code>table_access</code></th> <td><code>delete</code></td> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row"><code>table_access</code></th> <td><code>insert</code></td> <td>Yes</td> <td>Yes</td> </tr><tr> <th scope="row"><code>table_access</code></th> <td><code>update</code></td> <td>Yes</td> <td>Yes</td> </tr></tbody></table>

##### Inclusive and Exclusive Logging

A filter can be defined in inclusive or exclusive mode:

* Inclusive mode logs only explicitly specified items.
* Exclusive mode logs everything but explicitly specified items.

To perform inclusive logging, disable logging globally and enable logging for specific classes. This filter logs `connect` and `disconnect` events in the `connection` class, and events in the `general` class:

```
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

```
{
  "filter": {
    "log": true,
    "class":
      { "name": "general", "log": false }
  }
}
```

This filter logs `change_user` events in the `connection` class, `message` events, and `table_access` events, by virtue of *not* logging everything else:

```
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

```
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

An event in the `connection` class indicates when a connection-related activity occurs during a session, such as a user connecting to or disconnecting from the server. Table 8.37, “Connection Event Fields” indicates the permitted fields for `connection` events.

**Table 8.37 Connection Event Fields**

<table summary="Permitted fields for connection events."><col style="width: 35%"/><col style="width: 20%"/><col style="width: 45%"/><thead><tr> <th scope="col">Field Name</th> <th scope="col">Field Type</th> <th scope="col">Description</th> </tr></thead><tbody><tr> <th scope="row"><code>status</code></th> <td>integer</td> <td><p class="valid-value"> Event status: </p><p class="valid-value"> 0: OK </p><p class="valid-value"> Otherwise: Failed </p></td> </tr><tr> <th scope="row"><code>connection_id</code></th> <td>unsigned integer</td> <td>Connection ID</td> </tr><tr> <th scope="row"><code>user.str</code></th> <td>string</td> <td>User name specified during authentication</td> </tr><tr> <th scope="row"><code>user.length</code></th> <td>unsigned integer</td> <td>User name length</td> </tr><tr> <th scope="row"><code>priv_user.str</code></th> <td>string</td> <td>Authenticated user name (account user name)</td> </tr><tr> <th scope="row"><code>priv_user.length</code></th> <td>unsigned integer</td> <td>Authenticated user name length</td> </tr><tr> <th scope="row"><code>external_user.str</code></th> <td>string</td> <td>External user name (provided by third-party authentication plugin)</td> </tr><tr> <th scope="row"><code>external_user.length</code></th> <td>unsigned integer</td> <td>External user name length</td> </tr><tr> <th scope="row"><code>proxy_user.str</code></th> <td>string</td> <td>Proxy user name</td> </tr><tr> <th scope="row"><code>proxy_user.length</code></th> <td>unsigned integer</td> <td>Proxy user name length</td> </tr><tr> <th scope="row"><code>host.str</code></th> <td>string</td> <td>Connected user host</td> </tr><tr> <th scope="row"><code>host.length</code></th> <td>unsigned integer</td> <td>Connected user host length</td> </tr><tr> <th scope="row"><code>ip.str</code></th> <td>string</td> <td>Connected user IP address</td> </tr><tr> <th scope="row"><code>ip.length</code></th> <td>unsigned integer</td> <td>Connected user IP address length</td> </tr><tr> <th scope="row"><code>database.str</code></th> <td>string</td> <td>Database name specified at connect time</td> </tr><tr> <th scope="row"><code>database.length</code></th> <td>unsigned integer</td> <td>Database name length</td> </tr><tr> <th scope="row"><code>connection_type</code></th> <td>integer</td> <td><p class="valid-value"> Connection type: </p><p class="valid-value"> 0 or <code>"::undefined"</code>: Undefined </p><p class="valid-value"> 1 or <code>"::tcp/ip"</code>: TCP/IP </p><p class="valid-value"> 2 or <code>"::socket"</code>: Socket </p><p class="valid-value"> 3 or <code>"::named_pipe"</code>: Named pipe </p><p class="valid-value"> 4 or <code>"::ssl"</code>: TCP/IP with encryption </p><p class="valid-value"> 5 or <code>"::shared_memory"</code>: Shared memory </p></td> </tr></tbody></table>

The `"::xxx"` values are symbolic pseudo-constants that may be given instead of the literal numeric values. They must be quoted as strings and are case-sensitive.

An event in the `general` class indicates the status code of an operation and its details. Table 8.38, “General Event Fields” indicates the permitted fields for `general` events.

**Table 8.38 General Event Fields**

<table summary="Permitted field types for general events."><col style="width: 35%"/><col style="width: 20%"/><col style="width: 45%"/><thead><tr> <th scope="col">Field Name</th> <th scope="col">Field Type</th> <th scope="col">Description</th> </tr></thead><tbody><tr> <th scope="row"><code>general_error_code</code></th> <td>integer</td> <td><p class="valid-value"> Event status: </p><p class="valid-value"> 0: OK </p><p class="valid-value"> Otherwise: Failed </p></td> </tr><tr> <th scope="row"><code>general_thread_id</code></th> <td>unsigned integer</td> <td>Connection/thread ID</td> </tr><tr> <th scope="row"><code>general_user.str</code></th> <td>string</td> <td>User name specified during authentication</td> </tr><tr> <th scope="row"><code>general_user.length</code></th> <td>unsigned integer</td> <td>User name length</td> </tr><tr> <th scope="row"><code>general_command.str</code></th> <td>string</td> <td>Command name</td> </tr><tr> <th scope="row"><code>general_command.length</code></th> <td>unsigned integer</td> <td>Command name length</td> </tr><tr> <th scope="row"><code>general_query.str</code></th> <td>string</td> <td>SQL statement text</td> </tr><tr> <th scope="row"><code>general_query.length</code></th> <td>unsigned integer</td> <td>SQL statement text length</td> </tr><tr> <th scope="row"><code>general_host.str</code></th> <td>string</td> <td>Host name</td> </tr><tr> <th scope="row"><code>general_host.length</code></th> <td>unsigned integer</td> <td>Host name length</td> </tr><tr> <th scope="row"><code>general_sql_command.str</code></th> <td>string</td> <td>SQL command type name</td> </tr><tr> <th scope="row"><code>general_sql_command.length</code></th> <td>unsigned integer</td> <td>SQL command type name length</td> </tr><tr> <th scope="row"><code>general_external_user.str</code></th> <td>string</td> <td>External user name (provided by third-party authentication plugin)</td> </tr><tr> <th scope="row"><code>general_external_user.length</code></th> <td>unsigned integer</td> <td>External user name length</td> </tr><tr> <th scope="row"><code>general_ip.str</code></th> <td>string</td> <td>Connected user IP address</td> </tr><tr> <th scope="row"><code>general_ip.length</code></th> <td>unsigned integer</td> <td>Connection user IP address length</td> </tr></tbody></table>

`general_command.str` indicates a command name: `Query`, `Execute`, `Quit`, or `Change user`.

A `general` event with the `general_command.str` field set to `Query` or `Execute` contains `general_sql_command.str` set to a value that specifies the type of SQL command: `alter_db`, `alter_db_upgrade`, `admin_commands`, and so forth. The available `general_sql_command.str` values can be seen as the last components of the Performance Schema instruments displayed by this statement:

```
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

An event in the `table_access` class provides information about a specific type of access to a table. Table 8.39, “Table-Access Event Fields” indicates the permitted fields for `table_access` events.

**Table 8.39 Table-Access Event Fields**

<table summary="Permitted fields for table-access events."><col style="width: 35%"/><col style="width: 20%"/><col style="width: 45%"/><thead><tr> <th scope="col">Field Name</th> <th scope="col">Field Type</th> <th scope="col">Description</th> </tr></thead><tbody><tr> <th scope="row"><code>connection_id</code></th> <td>unsigned integer</td> <td>Event connection ID</td> </tr><tr> <th scope="row"><code>sql_command_id</code></th> <td>integer</td> <td>SQL command ID</td> </tr><tr> <th scope="row"><code>query.str</code></th> <td>string</td> <td>SQL statement text</td> </tr><tr> <th scope="row"><code>query.length</code></th> <td>unsigned integer</td> <td>SQL statement text length</td> </tr><tr> <th scope="row"><code>table_database.str</code></th> <td>string</td> <td>Database name associated with event</td> </tr><tr> <th scope="row"><code>table_database.length</code></th> <td>unsigned integer</td> <td>Database name length</td> </tr><tr> <th scope="row"><code>table_name.str</code></th> <td>string</td> <td>Table name associated with event</td> </tr><tr> <th scope="row"><code>table_name.length</code></th> <td>unsigned integer</td> <td>Table name length</td> </tr></tbody></table>

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

`event` items can include an `abort` item that indicates whether to prevent qualifying events from executing. `abort` enables rules to be written that block execution of specific SQL statements.

Important

It is theoretically possible for a user with sufficient permissions to mistakenly create an `abort` item in the audit log filter that prevents themselves and other administrators from accessing the system. The `AUDIT_ABORT_EXEMPT` privilege is available to permit a user account’s queries to always be executed even if an `abort` item would block them. Accounts with this privilege can therefore be used to regain access to a system following an audit misconfiguration. The query is still logged in the audit log, but instead of being rejected, it is permitted due to the privilege.

Accounts created with the `SYSTEM_USER` privilege have the `AUDIT_ABORT_EXEMPT` privilege assigned automatically when they are created. The `AUDIT_ABORT_EXEMPT` privilege is also assigned to existing accounts with the `SYSTEM_USER` privilege when you carry out an upgrade procedure, if no existing accounts have that privilege assigned.

The `abort` item must appear within an `event` item. For example:

```
"event": {
  "name": qualifying event subclass names
  "abort": condition
}
```

For event subclasses selected by the `name` item, the `abort` action is true or false, depending on *`condition`* evaluation. If the condition evaluates to true, the event is blocked. Otherwise, the event continues executing.

The *`condition`* specification can be as simple as `true` or `false`, or it can be more complex such that evaluation depends on event characteristics.

This filter blocks `INSERT`, `UPDATE`, and `DELETE` statements:

```
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

```
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

```
ERROR 1045 (28000): Statement was aborted by an audit log filter
```

Not all events can be blocked (see Table 8.36, “Log and Abort Characteristics Per Event Class and Subclass Combination”). For an event that cannot be blocked, the audit log writes a warning to the error log rather than blocking it.

For attempts to define a filter in which the `abort` item appears elsewhere than in an `event` item, an error occurs.

##### Logical Operators

Logical operators (`and`, `or`, `not`) permit construction of complex conditions, enabling more advanced filtering configurations to be written. The following `log` item logs only `general` events with `general_command` fields having a specific value and length:

```
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

```
"variable": {
  "name": "variable_name",
  "value": comparison_value
}
```

This is true if *`variable_name`* has the value *`comparison_value`*, false otherwise.

Example:

```
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

The `audit_log_xxx_policy` system variables are used for the deprecated legacy mode audit log (see Section 8.4.6.10, “Legacy Mode Audit Log Filtering”). With rule-based audit log filtering, those variables remain visible (for example, using [`SHOW VARIABLES`](show-variables.html "15.7.7.42 SHOW VARIABLES Statement")), but changes to them have no effect unless you write filters containing constructs that refer to them.

The following list describes the permitted predefined variables for `variable` items:

* `audit_log_connection_policy_value`

  This variable corresponds to the value of the `audit_log_connection_policy` system variable. The value is an unsigned integer. Table 8.40, “audit_log_connection_policy_value Values” shows the permitted values and the corresponding `audit_log_connection_policy` values.

  **Table 8.40 audit_log_connection_policy_value Values**

  <table summary="Permitted audit_log_connection_policy_value values and the corresponding audit_log_connection_policy values."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Value</th> <th>Corresponding audit_log_connection_policy Value</th> </tr></thead><tbody><tr> <td><code>0</code> or <code>"::none"</code></td> <td><code>NONE</code></td> </tr><tr> <td><code>1</code> or <code>"::errors"</code></td> <td><code>ERRORS</code></td> </tr><tr> <td><code>2</code> or <code>"::all"</code></td> <td><code>ALL</code></td> </tr></tbody></table>

  The `"::xxx"` values are symbolic pseudo-constants that may be given instead of the literal numeric values. They must be quoted as strings and are case-sensitive.

* `audit_log_policy_value`

  This variable corresponds to the value of the `audit_log_policy` system variable. The value is an unsigned integer. Table 8.41, “audit_log_policy_value Values” shows the permitted values and the corresponding `audit_log_policy` values.

  **Table 8.41 audit_log_policy_value Values**

  <table summary="Permitted audit_log_policy_value values and the corresponding audit_log_policy values."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Value</th> <th>Corresponding audit_log_policy Value</th> </tr></thead><tbody><tr> <td><code>0</code> or <code>"::none"</code></td> <td><code>NONE</code></td> </tr><tr> <td><code>1</code> or <code>"::logins"</code></td> <td><code>LOGINS</code></td> </tr><tr> <td><code>2</code> or <code>"::all"</code></td> <td><code>ALL</code></td> </tr><tr> <td><code>3</code> or <code>"::queries"</code></td> <td><code>QUERIES</code></td> </tr></tbody></table>

  The `"::xxx"` values are symbolic pseudo-constants that may be given instead of the literal numeric values. They must be quoted as strings and are case-sensitive.

* `audit_log_statement_policy_value`

  This variable corresponds to the value of the `audit_log_statement_policy` system variable. The value is an unsigned integer. Table 8.42, “audit_log_statement_policy_value Values” shows the permitted values and the corresponding `audit_log_statement_policy` values.

  **Table 8.42 audit_log_statement_policy_value Values**

  <table summary="Permitted audit_log_statement_policy_value values and the corresponding audit_log_statement_policy values."><col style="width: 20%"/><col style="width: 80%"/><thead><tr> <th>Value</th> <th>Corresponding audit_log_statement_policy Value</th> </tr></thead><tbody><tr> <td><code>0</code> or <code>"::none"</code></td> <td><code>NONE</code></td> </tr><tr> <td><code>1</code> or <code>"::errors"</code></td> <td><code>ERRORS</code></td> </tr><tr> <td><code>2</code> or <code>"::all"</code></td> <td><code>ALL</code></td> </tr></tbody></table>

  The `"::xxx"` values are symbolic pseudo-constants that may be given instead of the literal numeric values. They must be quoted as strings and are case-sensitive.

##### Referencing Predefined Functions

To refer to a predefined function in a `log` condition, use a `function` item, which takes `name` and `args` items to specify the function name and its arguments, respectively:

```
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

```
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

* `query_digest([str])`

  This function has differing behavior depending on whether an argument is given:

  + With no argument, `query_digest` returns the statement digest value corresponding to the statement literal text in the current event.

  + With an argument, `query_digest` returns a Boolean indicating whether the argument is equal to the current statement digest.

  Arguments:

  + *`str`*: This argument is optional. If given, it specifies a statement digest to be compared against the digest for the statement in the current event.

  Examples:

  This `function` item includes no argument, so `query_digest` returns the current statement digest as a string:

  ```
  "function": {
    "name": "query_digest"
  }
  ```

  This `function` item includes an argument, so `query_digest` returns a Boolean indicating whether the argument equals the current statement digest:

  ```
  "function": {
    "name": "query_digest",
    "args": "SELECT ?"
  }
  ```

* `string_find(text, substr)`

  Checks whether the `substr` value is contained in the `text` value. This search is case-sensitive.

  Arguments:

  + *`text`*: The text string to search.

  + *`substr`*: The substring to search for in *`text`*.

##### Replacement of Event Field Values

Audit filter definitions support replacement of certain audit event fields, so that logged events contain the replacement value rather than the original value. This capability enables logged audit records to include statement digests rather than literal statements, which can be useful for MySQL deployments for which statements may expose sensitive values.

Field replacement in audit events works like this:

* Field replacements are specified in audit filter definitions, so audit log filtering must be enabled as described in Section 8.4.6.7, “Audit Log Filtering”.

* Not all fields can be replaced. Table 8.43, “Event Fields Subject to Replacement” shows which fields are replaceable in which event classes.

  **Table 8.43 Event Fields Subject to Replacement**

  <table summary="Event fields that are subject to replacement during event filtering."><col style="width: 50%"/><col style="width: 50%"/><thead><tr> <th>Event Class</th> <th>Field Name</th> </tr></thead><tbody><tr> <td><code>general</code></td> <td><code>general_query.str</code></td> </tr><tr> <td><code>table_access</code></td> <td><code>query.str</code></td> </tr></tbody></table>

* Replacement is conditional. Each replacement specification in a filter definition includes a condition, enabling a replaceable field to be changed, or left unchanged, depending on the condition result.

* If replacement occurs, the replacement specification indicates the replacement value using a function that is permitted for that purpose.

As Table 8.43, “Event Fields Subject to Replacement” shows, currently the only replaceable fields are those that contain statement text (which occurs in events of the `general` and `table_access` classes). In addition, the only function permitted for specifying the replacement value is `query_digest`. This means that the only permitted replacement operation is to replace statement literal text by its corresponding digest.

Because field replacement occurs at an early auditing stage (during filtering), the choice of whether to write statement literal text or digest values applies regardless of log format written later (that is, whether the audit log plugin produces XML or JSON output).

Field replacement can take place at differing levels of event granularity:

* To perform field replacement for all events in a class, filter events at the class level.

* To perform replacement on a more fine-grained basis, include additional event-selection items. For example, you can perform field replacement only for specific subclasses of a given event class, or only in events for which fields have certain characteristics.

Within a filter definition, specify field replacement by including a `print` item, which has this syntax:

```
"print": {
  "field": {
    "name": "field_name",
    "print": condition,
    "replace": replacement_value
  }
}
```

Within the `print` item, its `field` item takes these three items to indicate how whether and how replacement occurs:

* `name`: The field for which replacement (potentially) occurs. *`field_name`* must be one of those shown in Table 8.43, “Event Fields Subject to Replacement”.

* `print`: The condition that determines whether to retain the original field value or replace it:

  + If *`condition`* evaluates to `true`, the field remains unchanged.

  + If *`condition`* evaluates to `false`, replacement occurs, using the value of the `replace` item.

  To unconditionally replace a field, specify the condition like this:

  ```
  "print": false
  ```

* `replace`: The replacement value to use when the `print` condition evaluates to `false`. Specify *`replacement_value`* using a `function` item.

For example, this filter definition applies to all events in the `general` class, replacing the statement literal text with its digest:

```
{
  "filter": {
    "class": {
      "name": "general",
      "print": {
        "field": {
          "name": "general_query.str",
          "print": false,
          "replace": {
            "function": {
              "name": "query_digest"
            }
          }
        }
      }
    }
  }
}
```

The preceding filter uses this `print` item to unconditionally replace the statement literal text contained in `general_query.str` by its digest value:

```
"print": {
  "field": {
    "name": "general_query.str",
    "print": false,
    "replace": {
      "function": {
        "name": "query_digest"
      }
    }
  }
}
```

`print` items can be written different ways to implement different replacement strategies. The `replace` item just shown specifies the replacement text using this `function` construct to return a string representing the current statement digest:

```
"function": {
  "name": "query_digest"
}
```

The `query_digest` function can also be used in another way, as a comparator that returns a Boolean, which enables its use in the `print` condition. To do this, provide an argument that specifies a comparison statement digest:

```
"function": {
  "name": "query_digest",
  "args": "digest"
}
```

In this case, `query_digest` returns `true` or `false` depending on whether the current statement digest is the same as the comparison digest. Using `query_digest` this way enables filter definitions to detect statements that match particular digests. The condition in the following construct is true only for statements that have a digest equal to `SELECT ?`, thus effecting replacement only for statements that do not match the digest:

```
"print": {
  "field": {
    "name": "general_query.str",
    "print": {
      "function": {
        "name": "query_digest",
        "args": "SELECT ?"
      }
    },
    "replace": {
      "function": {
        "name": "query_digest"
      }
    }
  }
}
```

To perform replacement only for statements that do match the digest, use `not` to invert the condition:

```
"print": {
  "field": {
    "name": "general_query.str",
    "print": {
      "not": {
        "function": {
          "name": "query_digest",
          "args": "SELECT ?"
        }
      }
    },
    "replace": {
      "function": {
        "name": "query_digest"
      }
    }
  }
}
```

Suppose that you want the audit log to contain only statement digests and not literal statements. To achieve this, you must perform replacement on all events that contain statement text; that is, events in the `general` and `table_access` classes. An earlier filter definition showed how to unconditionally replace statement text for `general` events. To do the same for `table_access` events, use a filter that is similar but changes the class from `general` to `table_access` and the field name from `general_query.str` to `query.str`:

```
{
  "filter": {
    "class": {
      "name": "table_access",
      "print": {
        "field": {
          "name": "query.str",
          "print": false,
          "replace": {
            "function": {
              "name": "query_digest"
            }
          }
        }
      }
    }
  }
}
```

Combining the `general` and `table_access` filters results in a single filter that performs replacement for all statement text-containing events:

```
{
  "filter": {
    "class": [
      {
        "name": "general",
        "print": {
          "field": {
            "name": "general_query.str",
            "print": false,
            "replace": {
              "function": {
                "name": "query_digest"
              }
            }
          }
        }
      },
      {
        "name": "table_access",
        "print": {
          "field": {
            "name": "query.str",
            "print": false,
            "replace": {
              "function": {
                "name": "query_digest"
              }
            }
          }
        }
      }
    ]
  }
}
```

To perform replacement on only some events within a class, add items to the filter that indicate more specifically when replacement occurs. The following filter applies to events in the `table_access` class, but performs replacement only for `insert` and `update` events (leaving `read` and `delete` events unchanged):

```
{
  "filter": {
    "class": {
      "name": "table_access",
      "event": {
        "name": [
          "insert",
          "update"
        ],
        "print": {
          "field": {
            "name": "query.str",
            "print": false,
            "replace": {
              "function": {
                "name": "query_digest"
              }
            }
          }
        }
      }
    }
  }
}
```

This filter performs replacement for `general` class events corresponding to the listed account-management statements (the effect being to hide credential and data values in the statements):

```
{
  "filter": {
    "class": {
      "name": "general",
      "event": {
        "name": "status",
        "print": {
          "field": {
            "name": "general_query.str",
            "print": false,
            "replace": {
              "function": {
                "name": "query_digest"
              }
            }
          }
        },
        "log": {
          "or": [
            {
              "field": {
                "name": "general_sql_command.str",
                "value": "alter_user"
              }
            },
            {
              "field": {
                "name": "general_sql_command.str",
                "value": "alter_user_default_role"
              }
            },
            {
              "field": {
                "name": "general_sql_command.str",
                "value": "create_role"
              }
            },
            {
              "field": {
                "name": "general_sql_command.str",
                "value": "create_user"
              }
            }
          ]
        }
      }
    }
  }
}
```

For information about the possible `general_sql_command.str` values, see Testing Event Field Values.

##### Replacing a User Filter

In some cases, the filter definition can be changed dynamically. To do this, define a `filter` configuration within an existing `filter`. For example:

```
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

```
UPDATE temp_1, temp_3 SET temp_1.a=21, temp_3.a=23;
```

The statement generates multiple `table_access` events, but the audit log file contains only `general` / `status` entries.

Note

Any `id` values used in the definition are evaluated with respect only to that definition. They have nothing to do with the value of the `audit_log_filter_id` system variable.


#### 8.4.6.9 Disabling Audit Logging

The `audit_log_disable` variable permits disabling audit logging for all connecting and connected sessions. The `audit_log_disable` variable can be set in a MySQL Server option file, in a command-line startup string, or at runtime using a `SET` statement; for example:

```
SET GLOBAL audit_log_disable = true;
```

Setting `audit_log_disable` to true disables the audit log plugin. The plugin is re-enabled when `audit_log_disable` is set back to `false`, which is the default setting.

Starting the audit log plugin with `audit_log_disable = true` generates a warning (`ER_WARN_AUDIT_LOG_DISABLED`) with the following message: Audit Log is disabled. Enable it with audit_log_disable = false. Setting `audit_log_disable` to false also generates warning. When `audit_log_disable` is set to true, audit log function calls and variable changes generate a session warning.

Setting the runtime value of `audit_log_disable` requires the `AUDIT_ADMIN` privilege, in addition to the `SYSTEM_VARIABLES_ADMIN` privilege (or the deprecated `SUPER` privilege) normally required to set a global system variable runtime value.


#### 8.4.6.10 Legacy Mode Audit Log Filtering

Note

This section describes legacy audit log filtering, which applies if the `audit_log` plugin is installed without the accompanying audit tables and functions needed for rule-based filtering.

Legacy Mode Audit Log Filtering is deprecated.

The audit log plugin can filter audited events. This enables you to control whether audited events are written to the audit log file based on the account from which events originate or event status. Status filtering occurs separately for connection events and statement events.

* Legacy Event Filtering by Account
* Legacy Event Filtering by Status

##### Legacy Event Filtering by Account

To filter audited events based on the originating account, set one (not both) of the following system variables at server startup or runtime. These deprecated variables apply only for legacy audit log filtering.

* `audit_log_include_accounts`: The accounts to include in audit logging. If this variable is set, only these accounts are audited.

* `audit_log_exclude_accounts`: The accounts to exclude from audit logging. If this variable is set, all but these accounts are audited.

The value for either variable can be `NULL` or a string containing one or more comma-separated account names, each in `user_name@host_name` format. By default, both variables are `NULL`, in which case, no account filtering is done and auditing occurs for all accounts.

Modifications to `audit_log_include_accounts` or `audit_log_exclude_accounts` affect only connections created subsequent to the modification, not existing connections.

Example: To enable audit logging only for the `user1` and `user2` local host accounts, set the `audit_log_include_accounts` system variable like this:

```
SET GLOBAL audit_log_include_accounts = 'user1@localhost,user2@localhost';
```

Only one of `audit_log_include_accounts` or `audit_log_exclude_accounts` can be non-`NULL` at a time:

* If you set `audit_log_include_accounts`, the server sets `audit_log_exclude_accounts` to `NULL`.

* If you attempt to set `audit_log_exclude_accounts`, an error occurs unless `audit_log_include_accounts` is `NULL`. In this case, you must first clear `audit_log_include_accounts` by setting it to `NULL`.

```
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

```
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

```
SET GLOBAL audit_log_include_accounts = 'root@localhost';
SET GLOBAL audit_log_include_accounts = '''root''@''localhost''';
SET GLOBAL audit_log_include_accounts = '\'root\'@\'localhost\'';
SET GLOBAL audit_log_include_accounts = "'root'@'localhost'";
```

The last statement does not work if the `ANSI_QUOTES` SQL mode is enabled because in that mode double quotes signify identifier quoting, not string quoting.

##### Legacy Event Filtering by Status

To filter audited events based on status, set the following system variables at server startup or runtime. These deprecated variables apply only for legacy audit log filtering. For JSON audit log filtering, different status variables apply; see Audit Log Options and Variables.

* `audit_log_connection_policy`: Logging policy for connection events

* `audit_log_statement_policy`: Logging policy for statement events

Each variable takes a value of `ALL` (log all associated events; this is the default), `ERRORS` (log only failed events), or `NONE` (do not log events). For example, to log all statement events but only failed connection events, use these settings:

```
SET GLOBAL audit_log_statement_policy = ALL;
SET GLOBAL audit_log_connection_policy = ERRORS;
```

Another policy system variable, `audit_log_policy`, is available but does not afford as much control as `audit_log_connection_policy` and `audit_log_statement_policy`. It can be set only at server startup.

Note

The `audit_log_policy` legacy-mode system variable is deprecated.

At runtime, it is a read-only variable. It takes a value of `ALL` (log all events; this is the default), `LOGINS` (log connection events), `QUERIES` (log statement events), or `NONE` (do not log events). For any of those values, the audit log plugin logs all selected events without distinction as to success or failure. Use of `audit_log_policy` at startup works as follows:

* If you do not set `audit_log_policy` or set it to its default of `ALL`, any explicit settings for `audit_log_connection_policy` or `audit_log_statement_policy` apply as specified. If not specified, they default to `ALL`.

* If you set `audit_log_policy` to a non-`ALL` value, that value takes precedence over and is used to set `audit_log_connection_policy` and `audit_log_statement_policy`, as indicated in the following table. If you also set either of those variables to a value other than their default of `ALL`, the server writes a message to the error log to indicate that their values are being overridden.

  <table summary="How the server uses audit_log_policy to set audit_log_connection_policy and audit_log_statement_policy at startup."><col style="width: 33%"/><col style="width: 33%"/><col style="width: 33%"/><thead><tr> <th scope="col">Startup audit_log_policy Value</th> <th scope="col">Resulting audit_log_connection_policy Value</th> <th scope="col">Resulting audit_log_statement_policy Value</th> </tr></thead><tbody><tr> <th scope="row"><code>LOGINS</code></th> <td><code>ALL</code></td> <td><code>NONE</code></td> </tr><tr> <th scope="row"><code>QUERIES</code></th> <td><code>NONE</code></td> <td><code>ALL</code></td> </tr><tr> <th scope="row"><code>NONE</code></th> <td><code>NONE</code></td> <td><code>NONE</code></td> </tr></tbody></table>


#### 8.4.6.11 Audit Log Reference

The following sections provide a reference to MySQL Enterprise Audit elements:

* Audit Log Tables
* Audit Log Functions
* Audit Log Option and Variable Reference
* Audit Log Options and Variables
* Audit Log Status Variables

To install the audit log tables and functions, use the instructions provided in Section 8.4.6.2, “Installing or Uninstalling MySQL Enterprise Audit”. Unless those objects are installed, the `audit_log` plugin operates in (deprecated) legacy mode. See Section 8.4.6.10, “Legacy Mode Audit Log Filtering”.

##### Audit Log Tables

MySQL Enterprise Audit uses tables in the `mysql` system database for persistent storage of filter and user account data. The tables can be accessed only by users who have privileges for that database. To use a different database, set the `audit_log_database` system variable at server startup. The tables use the `InnoDB` storage engine.

If these tables are missing, the `audit_log` plugin operates in (deprecated) legacy mode. See Section 8.4.6.10, “Legacy Mode Audit Log Filtering”.

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

This section describes, for each audit log function, its purpose, calling sequence, and return value. For information about the conditions under which these functions can be invoked, see Section 8.4.6.7, “Audit Log Filtering”.

Each audit log function returns a string that indicates whether the operation succeeded. `OK` indicates success. `ERROR: message` indicates failure.

Audit log functions convert string arguments to `utf8mb4` and string return values are `utf8mb4` strings. Previously, audit log functions treated string arguments as binary strings (which means they did not distinguish lettercase), and string return values were binary strings.

If an audit log function is invoked from within the **mysql** client, binary string results display using hexadecimal notation, depending on the value of the `--binary-as-hex`. For more information about that option, see Section 6.5.1, “mysql — The MySQL Command-Line Client”.

To verify installation of audit log functions, use this command:

```
SELECT * FROM performance_schema.user_defined_functions;
```

To learn more, see Section 7.7.2, “Obtaining Information About Loadable Functions”.

These audit log functions are available:

* `audit_log_encryption_password_get([keyring_id])`

  This function fetches an audit log encryption password from the MySQL keyring, which must be enabled or an error occurs. Any keyring component or plugin can be used; for instructions, see Section 8.4.5, “The MySQL Keyring”.

  With no argument, the function retrieves the current encryption password as a binary string. An argument may be given to specify which audit log encryption password to retrieve. The argument must be the keyring ID of the current password or an archived password.

  For additional information about audit log encryption, see Encrypting Audit Log Files.

  Arguments:

  *`keyring_id`*: This optional argument indicates the keyring ID of the password to retrieve. The maximum permitted length is 766 bytes. If omitted, the function retrieves the current password.

  Return value:

  The password string for success (up to 766 bytes), or `NULL` and an error for failure.

  Example:

  Retrieve the current password:

  ```
  mysql> SELECT audit_log_encryption_password_get();
  +-------------------------------------+
  | audit_log_encryption_password_get() |
  +-------------------------------------+
  | secret                              |
  +-------------------------------------+
  ```

  To retrieve a password by ID, you can determine which audit log keyring IDs exist by querying the Performance Schema `keyring_keys` table:

  ```
  mysql> SELECT KEY_ID FROM performance_schema.keyring_keys
         WHERE KEY_ID LIKE 'audit_log%'
         ORDER BY KEY_ID;
  +-----------------------------+
  | KEY_ID                      |
  +-----------------------------+
  | audit_log-20190415T152248-1 |
  | audit_log-20190415T153507-1 |
  | audit_log-20190416T125122-1 |
  | audit_log-20190416T141608-1 |
  +-----------------------------+
  mysql> SELECT audit_log_encryption_password_get('audit_log-20190416T125122-1');
  +------------------------------------------------------------------+
  | audit_log_encryption_password_get('audit_log-20190416T125122-1') |
  +------------------------------------------------------------------+
  | segreto                                                          |
  +------------------------------------------------------------------+
  ```

* `audit_log_encryption_password_set(password)`

  Sets the current audit log encryption password to the argument and stores the password in the MySQL keyring. The password is stored as a `utf8mb4` string. Previously, the password was stored in binary form.

  If encryption is enabled, this function performs a log file rotation operation that renames the current log file, and begins a new log file encrypted with the password. The keyring must be enabled or an error occurs. Any keyring component or plugin can be used; for instructions, see Section 8.4.5, “The MySQL Keyring”.

  For additional information about audit log encryption, see Encrypting Audit Log Files.

  Arguments:

  *`password`*: The password string. The maximum permitted length is 766 bytes.

  Return value:

  1 for success, 0 for failure.

  Example:

  ```
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

  ```
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

  ```
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

  ```
  mysql> SELECT audit_log_filter_remove_user('user1@localhost');
  +-------------------------------------------------+
  | audit_log_filter_remove_user('user1@localhost') |
  +-------------------------------------------------+
  | OK                                              |
  +-------------------------------------------------+
  ```

* [`audit_log_filter_set_filter(filter_name, definition)`](audit-log-reference.html#function_audit-log-filter-set-filter)

  Given a filter name and definition, adds the filter to the current set of filters. If the filter already exists and is used by any current sessions, those sessions are detached from the filter and are no longer logged. This occurs because the new filter definition has a new filter ID that differs from its previous ID.

  Arguments:

  + *`filter_name`*: A string that specifies the filter name.

  + *`definition`*: A `JSON` value that specifies the filter definition.

  Return value:

  A string that indicates whether the operation succeeded. `OK` indicates success. `ERROR: message` indicates failure.

  Example:

  ```
  mysql> SET @f = '{ "filter": { "log": false } }';
  mysql> SELECT audit_log_filter_set_filter('SomeFilter', @f);
  +-----------------------------------------------+
  | audit_log_filter_set_filter('SomeFilter', @f) |
  +-----------------------------------------------+
  | OK                                            |
  +-----------------------------------------------+
  ```

* [`audit_log_filter_set_user(user_name, filter_name)`](audit-log-reference.html#function_audit-log-filter-set-user)

  Given a user account name and a filter name, assigns the filter to the user. A user can be assigned only one filter, so if the user was already assigned a filter, the assignment is replaced. Filtering of current sessions for the user remains unaffected. New connections are filtered using the new filter.

  As a special case, the name `%` represents the default account. The filter is used for connections from any user account that has no explicitly assigned filter.

  Arguments:

  + *`user_name`*: The user account name as a string in `user_name@host_name` format, or `%` to represent the default account.

  + *`filter_name`*: A string that specifies the filter name.

  Return value:

  A string that indicates whether the operation succeeded. `OK` indicates success. `ERROR: message` indicates failure.

  Example:

  ```
  mysql> SELECT audit_log_filter_set_user('user1@localhost', 'SomeFilter');
  +------------------------------------------------------------+
  | audit_log_filter_set_user('user1@localhost', 'SomeFilter') |
  +------------------------------------------------------------+
  | OK                                                         |
  +------------------------------------------------------------+
  ```

* `audit_log_read([arg])`

  Reads the audit log and returns a `JSON` string result. If the audit log format is not `JSON`, an error occurs.

  With no argument or a `JSON` hash argument, `audit_log_read()` reads events from the audit log and returns a `JSON` string containing an array of audit events. Items in the hash argument influence how reading occurs, as described later. Each element in the returned array is an event represented as a `JSON` hash, with the exception that the last element may be a `JSON` `null` value to indicate no following events are available to read.

  With an argument consisting of a `JSON` `null` value, `audit_log_read()` closes the current read sequence.

  For additional details about the audit log-reading process, see Section 8.4.6.6, “Reading Audit Log Files”.

  Arguments:

  To obtain a bookmark for the most recently written event, call `audit_log_read_bookmark()`.

  *`arg`*: The argument is optional. If omitted, the function reads events from the current position. If present, the argument can be a `JSON` `null` value to close the read sequence, or a `JSON` hash. Within a hash argument, items are optional and control aspects of the read operation such as the position at which to begin reading or how many events to read. The following items are significant (other items are ignored):

  + `start`: The position within the audit log of the first event to read. The position is given as a timestamp and the read starts from the first event that occurs on or after the timestamp value. The `start` item has this format, where *`value`* is a literal timestamp value:

    ```
    "start": { "timestamp": "value" }
    ```

  + `timestamp`, `id`: The position within the audit log of the first event to read. The `timestamp` and `id` items together comprise a bookmark that uniquely identify a particular event. If an `audit_log_read()` argument includes either item, it must include both to completely specify a position or an error occurs.

  + `max_array_length`: The maximum number of events to read from the log. If this item is omitted, the default is to read to the end of the log or until the read buffer is full, whichever comes first.

  To specify a starting position to `audit_log_read()`, pass a hash argument that includes either a `start` item or a bookmark consisting of `timestamp` and `id` items. If a hash argument includes both a `start` item and a bookmark, an error occurs.

  If a hash argument specifies no starting position, reading continues from the current position.

  If a timestamp value includes no time part, a time part of `00:00:00` is assumed.

  Return value:

  If the call succeeds, the return value is a `JSON` string containing an array of audit events, or a `JSON` `null` value if that was passed as the argument to close the read sequence. If the call fails, the return value is `NULL` and an error occurs.

  Example:

  ```
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

  Returns a `JSON` string representing a bookmark for the most recently written audit log event. If the audit log format is not `JSON`, an error occurs.

  The bookmark is a `JSON` hash with `timestamp` and `id` items that uniquely identify the position of an event within the audit log. It is suitable for passing to `audit_log_read()` to indicate to that function the position at which to begin reading.

  For additional details about the audit log-reading process, see Section 8.4.6.6, “Reading Audit Log Files”.

  Arguments:

  None.

  Return value:

  A `JSON` string containing a bookmark for success, or `NULL` and an error for failure.

  Example:

  ```
  mysql> SELECT audit_log_read_bookmark();
  +-------------------------------------------------+
  | audit_log_read_bookmark()                       |
  +-------------------------------------------------+
  | { "timestamp": "2019-10-03 21:03:44", "id": 0 } |
  +-------------------------------------------------+
  ```

* `audit_log_rotate()`

  Arguments:

  None.

  Return value:

  The renamed file name.

  Example:

  ```
  mysql> SELECT audit_log_rotate();
  ```

  Using `audit_log_rotate()` requires the `AUDIT_ADMIN` privilege.

##### Audit Log Option and Variable Reference

**Table 8.44 Audit Log Option and Variable Reference**

<table frame="box" rules="all" summary="Reference for audit log command-line options, system variables, and status variables."><col style="width: 20%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><col style="width: 15%"/><thead><tr><th scope="col">Name</th> <th scope="col">Cmd-Line</th> <th scope="col">Option File</th> <th scope="col">System Var</th> <th scope="col">Status Var</th> <th scope="col">Var Scope</th> <th scope="col">Dynamic</th> </tr></thead><tbody><tr><th scope="row">audit-log</th> <td>Yes</td> <td>Yes</td> <td></td> <td></td> <td></td> <td></td> </tr><tr><th scope="row">audit_log_buffer_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">audit_log_compression</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">audit_log_connection_policy</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">audit_log_current_session</th> <td></td> <td></td> <td>Yes</td> <td></td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">Audit_log_current_size</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">audit_log_database</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Audit_log_direct_writes</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">audit_log_disable</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">audit_log_encryption</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Audit_log_event_max_drop_size</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Audit_log_events</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Audit_log_events_filtered</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Audit_log_events_lost</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Audit_log_events_written</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">audit_log_exclude_accounts</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">audit_log_file</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">audit_log_filter_id</th> <td></td> <td></td> <td>Yes</td> <td></td> <td>Both</td> <td>No</td> </tr><tr><th scope="row">audit_log_flush</th> <td></td> <td></td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">audit_log_flush_interval_seconds</th> <td>Yes</td> <td></td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">audit_log_format</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">audit_log_include_accounts</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">audit_log_max_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">audit_log_password_history_keep_days</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">audit_log_policy</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">audit_log_prune_seconds</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">audit_log_read_buffer_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Both</td> <td>Yes</td> </tr><tr><th scope="row">audit_log_rotate_on_size</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">audit_log_statement_policy</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>Yes</td> </tr><tr><th scope="row">audit_log_strategy</th> <td>Yes</td> <td>Yes</td> <td>Yes</td> <td></td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Audit_log_total_size</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr><tr><th scope="row">Audit_log_write_waits</th> <td></td> <td></td> <td></td> <td>Yes</td> <td>Global</td> <td>No</td> </tr></tbody></table>

##### Audit Log Options and Variables

This section describes the command options and system variables that configure operation of MySQL Enterprise Audit. If values specified at startup time are incorrect, the `audit_log` plugin may fail to initialize properly and the server does not load it. In this case, the server may also produce error messages for other audit log settings because it does not recognize them.

To configure activation of the audit log plugin, use this option:

* `--audit-log[=value]`

  <table frame="box" rules="all" summary="Properties for audit-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>

  This option controls how the server loads the `audit_log` plugin at startup. It is available only if the plugin has been previously registered with [`INSTALL PLUGIN`](install-plugin.html "15.7.4.4 INSTALL PLUGIN Statement") or is loaded with `--plugin-load` or `--plugin-load-add`. See Section 8.4.6.2, “Installing or Uninstalling MySQL Enterprise Audit”.

  The option value should be one of those available for plugin-loading options, as described in Section 7.6.1, “Installing and Uninstalling Plugins”. For example, `--audit-log=FORCE_PLUS_PERMANENT` tells the server to load the plugin and prevent it from being removed while the server is running.

If the audit log plugin is enabled, it exposes several system variables that permit control over logging:

```
mysql> SHOW VARIABLES LIKE 'audit_log%';
+--------------------------------------+--------------+
| Variable_name                        | Value        |
+--------------------------------------+--------------+
| audit_log_buffer_size                | 1048576      |
| audit_log_compression                | NONE         |
| audit_log_connection_policy          | ALL          |
| audit_log_current_session            | OFF          |
| audit_log_database                   | mysql        |
| audit_log_disable                    | OFF          |
| audit_log_encryption                 | NONE         |
| audit_log_exclude_accounts           |              |
| audit_log_file                       | audit.log    |
| audit_log_filter_id                  | 0            |
| audit_log_flush                      | OFF          |
| audit_log_flush_interval_seconds     | 0            |
| audit_log_format                     | NEW          |
| audit_log_format_unix_timestamp      | OFF          |
| audit_log_include_accounts           |              |
| audit_log_max_size                   | 0            |
| audit_log_password_history_keep_days | 0            |
| audit_log_policy                     | ALL          |
| audit_log_prune_seconds              | 0            |
| audit_log_read_buffer_size           | 32768        |
| audit_log_rotate_on_size             | 0            |
| audit_log_statement_policy           | ALL          |
| audit_log_strategy                   | ASYNCHRONOUS |
+--------------------------------------+--------------+
```

You can set any of these variables at server startup, and some of them at runtime. Those that are available only for legacy mode audit log filtering are so noted.

* `audit_log_buffer_size`

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code>4096</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>

  When the audit log plugin writes events to the log asynchronously, it uses a buffer to store event contents prior to writing them. This variable controls the size of that buffer, in bytes. The server adjusts the value to a multiple of 4096. The plugin uses a single buffer, which it allocates when it initializes and removes when it terminates. The plugin allocates this buffer only if logging is asynchronous.

* `audit_log_compression`

  <table frame="box" rules="all" summary="Properties for audit_log_compression"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-compression=value</code></td> </tr><tr><th>System Variable</th> <td><code>audit_log_compression</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>NONE</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>NONE</code></p><p class="valid-value"><code>GZIP</code></p></td> </tr></tbody></table>

  The type of compression for the audit log file. Permitted values are `NONE` (no compression; the default) and `GZIP` (GNU Zip compression). For more information, see Compressing Audit Log Files.

* `audit_log_connection_policy`

  <table frame="box" rules="all" summary="Properties for audit_log_connection_policy"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-connection-policy=value</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code>audit_log_connection_policy</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ALL</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>ALL</code></p><p class="valid-value"><code>ERRORS</code></p><p class="valid-value"><code>NONE</code></p></td> </tr></tbody></table>

  Note

  This deprecated variable applies only to legacy mode audit log filtering (see Section 8.4.6.10, “Legacy Mode Audit Log Filtering”).

  The policy controlling how the audit log plugin writes connection events to its log file. The following table shows the permitted values.

  <table summary="Permitted values for the audit_log_connection_policy variable."><col style="width: 15%"/><col style="width: 85%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td><code>ALL</code></td> <td>Log all connection events</td> </tr><tr> <td><code>ERRORS</code></td> <td>Log only failed connection events</td> </tr><tr> <td><code>NONE</code></td> <td>Do not log connection events</td> </tr></tbody></table>

  Note

  At server startup, any explicit value given for `audit_log_connection_policy` may be overridden if `audit_log_policy` is also specified, as described in Section 8.4.6.5, “Configuring Audit Logging Characteristics”.

* `audit_log_current_session`

  <table frame="box" rules="all" summary="Properties for audit_log_current_session"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>audit_log_current_session</code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>depends on filtering policy</code></td> </tr></tbody></table>

  Whether audit logging is enabled for the current session. The session value of this variable is read only. It is set when the session begins based on the values of the `audit_log_include_accounts` and `audit_log_exclude_accounts` system variables. The audit log plugin uses the session value to determine whether to audit events for the session. (There is a global value, but the plugin does not use it.)

* `audit_log_database`

  <table frame="box" rules="all" summary="Properties for audit_log_database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-database=value</code></td> </tr><tr><th>System Variable</th> <td><code>audit_log_database</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>mysql</code></td> </tr></tbody></table>

  Specifies which database the `audit_log` plugin uses to find its tables. This variable is read only. For more information, see Section 8.4.6.2, “Installing or Uninstalling MySQL Enterprise Audit”).

* `audit_log_disable`

  <table frame="box" rules="all" summary="Properties for audit_log_disable"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-disable[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code>audit_log_disable</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Permits disabling audit logging for all connecting and connected sessions. In addition to the `SYSTEM_VARIABLES_ADMIN` privilege, disabling audit logging requires the `AUDIT_ADMIN` privilege. See Section 8.4.6.9, “Disabling Audit Logging”.

* `audit_log_encryption`

  <table frame="box" rules="all" summary="Properties for audit_log_encryption"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-encryption=value</code></td> </tr><tr><th>System Variable</th> <td><code>audit_log_encryption</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>NONE</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>NONE</code></p><p class="valid-value"><code>AES</code></p></td> </tr></tbody></table>

  The type of encryption for the audit log file. Permitted values are `NONE` (no encryption; the default) and `AES` (AES-256-CBC cipher encryption). For more information, see Encrypting Audit Log Files.

* `audit_log_exclude_accounts`

  <table frame="box" rules="all" summary="Properties for audit-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>0

  Note

  This deprecated variable applies only to legacy mode audit log filtering (see Section 8.4.6.10, “Legacy Mode Audit Log Filtering”).

  The accounts for which events should not be logged. The value should be `NULL` or a string containing a list of one or more comma-separated account names. For more information, see Section 8.4.6.7, “Audit Log Filtering”.

  Modifications to `audit_log_exclude_accounts` affect only connections created subsequent to the modification, not existing connections.

* `audit_log_file`

  <table frame="box" rules="all" summary="Properties for audit-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>1

  The base name and suffix of the file to which the audit log plugin writes events. The default value is `audit.log`, regardless of logging format. To have the name suffix correspond to the format, set the name explicitly, choosing a different suffix (for example, `audit.xml` for XML format, `audit.json` for JSON format).

  If the value of `audit_log_file` is a relative path name, the plugin interprets it relative to the data directory. If the value is a full path name, the plugin uses the value as is. A full path name may be useful if it is desirable to locate audit files on a separate file system or directory. For security reasons, write the audit log file to a directory accessible only to the MySQL server and to users with a legitimate reason to view the log.

  For details about how the audit log plugin interprets the `audit_log_file` value and the rules for file renaming that occurs at plugin initialization and termination, see Naming Conventions for Audit Log Files.

  The audit log plugin uses the directory containing the audit log file (determined from the `audit_log_file` value) as the location to search for readable audit log files. From these log files and the current file, the plugin constructs a list of the ones that are subject to use with the audit log bookmarking and reading functions. See Section 8.4.6.6, “Reading Audit Log Files”.

* `audit_log_filter_id`

  <table frame="box" rules="all" summary="Properties for audit-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>2

  The session value of this variable indicates the internally maintained ID of the audit filter for the current session. A value of 0 means that the session has no filter assigned.

* `audit_log_flush`

  <table frame="box" rules="all" summary="Properties for audit-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>3

  Note

  The `audit_log_flush` variable is deprecated; expect support for it to be removed in a future version of MySQL. It is superseded by the `audit_log_rotate()` function.

  If `audit_log_rotate_on_size` is 0, automatic audit log file rotation is disabled and rotation occurs only when performed manually. In that case, enabling `audit_log_flush` by setting it to 1 or `ON` causes the audit log plugin to close and reopen its log file to flush it. (The variable value remains `OFF` so that you need not disable it explicitly before enabling it again to perform another flush.) For more information, see Section 8.4.6.5, “Configuring Audit Logging Characteristics”.

* `audit_log_flush_interval_seconds`

  <table frame="box" rules="all" summary="Properties for audit-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>4

  This system variable depends on the `scheduler` component, which must be installed and enabled (see Section 7.5.5, “Scheduler Component”). To check the status of the component:

  ```
  SHOW VARIABLES LIKE 'component_scheduler%';
  +-----------------------------+-------+
  | Variable_name               | Value |
  +-----------------------------+-------|
  | component_scheduler.enabled | On    |
  +-----------------------------+-------+
  ```

  When `audit_log_flush_interval_seconds` has a value of zero (the default), no automatic refresh of the privileges occurs, even if the `scheduler` component is enabled (`ON`).

  Values between `0` and `60` (1 to 59) are not acknowledged; instead, these values adjust to `60` automatically and the server emits a warning. Values greater than `60` define the number of seconds the `scheduler` component waits from startup, or from the beginning of the previous execution, until it attempts to schedule another execution.

  To persist this global system variable to the `mysqld-auto.cnf` file without setting the global variable runtime value, precede the variable name by the `PERSIST_ONLY` keyword or the `@@PERSIST_ONLY.` qualifier.

* `audit_log_format`

  <table frame="box" rules="all" summary="Properties for audit-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>5

  The audit log file format. Permitted values are `OLD` (old-style XML), `NEW` (new-style XML; the default), and `JSON`. For details about each format, see Section 8.4.6.4, “Audit Log File Formats”.

* `audit_log_format_unix_timestamp`

  <table frame="box" rules="all" summary="Properties for audit-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>6

  This variable applies only for JSON-format audit log output. When that is true, enabling this variable causes each log file record to include a `time` field. The field value is an integer that represents the UNIX timestamp value indicating the date and time when the audit event was generated.

  Changing the value of this variable at runtime causes log file rotation so that, for a given JSON-format log file, all records in the file either do or do not include the `time` field.

  Setting the runtime value of `audit_log_format_unix_timestamp` requires the `AUDIT_ADMIN` privilege, in addition to the `SYSTEM_VARIABLES_ADMIN` privilege (or the deprecated `SUPER` privilege) normally required to set a global system variable runtime value.

* `audit_log_include_accounts`

  <table frame="box" rules="all" summary="Properties for audit-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>7

  Note

  This deprecated variable applies only to legacy mode audit log filtering (see Section 8.4.6.10, “Legacy Mode Audit Log Filtering”).

  The accounts for which events should be logged. The value should be `NULL` or a string containing a list of one or more comma-separated account names. For more information, see Section 8.4.6.7, “Audit Log Filtering”.

  Modifications to `audit_log_include_accounts` affect only connections created subsequent to the modification, not existing connections.

* `audit_log_max_size`

  <table frame="box" rules="all" summary="Properties for audit-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>8

  `audit_log_max_size` pertains to audit log file pruning, which is supported for JSON-format log files only. It controls pruning based on combined log file size:

  + A value of 0 (the default) disables size-based pruning. No size limit is enforced.

  + A value greater than 0 enables size-based pruning. The value is the combined size above which audit log files become subject to pruning.

  If you set `audit_log_max_size` to a value that is not a multiple of 4096, it is truncated to the nearest multiple. In particular, setting it to a value less than 4096 sets it to 0 and no size-based pruning occurs.

  If both `audit_log_max_size` and `audit_log_rotate_on_size` are greater than 0, `audit_log_max_size` should be more than 7 times the value of `audit_log_rotate_on_size`. Otherwise, a warning is written to the server error log because in this case the “granularity” of size-based pruning may be insufficient to prevent removal of all or most rotated log files each time it occurs.

  Note

  Setting `audit_log_max_size` by itself is not sufficient to cause log file pruning to occur because the pruning algorithm uses `audit_log_rotate_on_size`, `audit_log_max_size`, and `audit_log_prune_seconds` in conjunction. For details, see Space Management of Audit Log Files.

* `audit_log_password_history_keep_days`

  <table frame="box" rules="all" summary="Properties for audit-log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log[=value]</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code>ON</code></p><p class="valid-value"><code>OFF</code></p><p class="valid-value"><code>FORCE</code></p><p class="valid-value"><code>FORCE_PLUS_PERMANENT</code></p></td> </tr></tbody></table>9

  The audit log plugin implements log file encryption using encryption passwords stored in the MySQL keyring (see Encrypting Audit Log Files). The plugin also implements password history, which includes password archiving and expiration (removal).

  When the audit log plugin creates a new encryption password, it archives the previous password, if one exists, for later use. The `audit_log_password_history_keep_days` variable controls automatic removal of expired archived passwords. Its value indicates the number of days after which archived audit log encryption passwords are removed. The default of 0 disables password expiration: the password retention period is forever.

  New audit log encryption passwords are created under these circumstances:

  + During plugin initialization, if the plugin finds that log file encryption is enabled, it checks whether the keyring contains an audit log encryption password. If not, the plugin automatically generates a random initial encryption password.

  + When the `audit_log_encryption_password_set()` function is called to set a specific password.

  In each case, the plugin stores the new password in the key ring and uses it to encrypt new log files.

  Removal of expired audit log encryption passwords occurs under these circumstances:

  + During plugin initialization.
  + When the `audit_log_encryption_password_set()` function is called.

  + When the runtime value of `audit_log_password_history_keep_days` is changed from its current value to a value greater than 0. Runtime value changes occur for `SET` statements that use the `GLOBAL` or `PERSIST` keyword, but not the `PERSIST_ONLY` keyword. `PERSIST_ONLY` writes the variable setting to `mysqld-auto.cnf`, but has no effect on the runtime value.

  When password removal occurs, the current value of `audit_log_password_history_keep_days` determines which passwords to remove:

  + If the value is 0, the plugin removes no passwords.
  + If the value is *`N`* > 0, the plugin removes passwords more than *`N`* days old.

  Note

  Take care not to expire old passwords that are still needed to read archived encrypted log files.

  If you normally leave password expiration disabled (that is, `audit_log_password_history_keep_days` has a value of 0), it is possible to perform an on-demand cleanup operation by temporarily assigning the variable a value greater than zero. For example, to expire passwords older than 365 days, do this:

  ```
  SET GLOBAL audit_log_password_history_keep_days = 365;
  SET GLOBAL audit_log_password_history_keep_days = 0;
  ```

  Setting the runtime value of `audit_log_password_history_keep_days` requires the `AUDIT_ADMIN` privilege, in addition to the `SYSTEM_VARIABLES_ADMIN` privilege (or the deprecated `SUPER` privilege) normally required to set a global system variable runtime value.

* `audit_log_policy`

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code>4096</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>0

  Note

  This deprecated variable applies only to legacy mode audit log filtering (see Section 8.4.6.10, “Legacy Mode Audit Log Filtering”).

  The policy controlling how the audit log plugin writes events to its log file. The following table shows the permitted values.

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code>4096</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>1

  `audit_log_policy` can be set only at server startup. At runtime, it is a read-only variable. Two other system variables, `audit_log_connection_policy` and `audit_log_statement_policy`, provide finer control over logging policy and can be set either at startup or at runtime. If you use `audit_log_policy` at startup instead of the other two variables, the server uses its value to set those variables. For more information about the policy variables and their interaction, see Section 8.4.6.5, “Configuring Audit Logging Characteristics”.

* `audit_log_prune_seconds`

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code>4096</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>2

  `audit_log_prune_seconds` pertains to audit log file pruning, which is supported for JSON-format log files only. It controls pruning based on log file age:

  + A value of 0 (the default) disables age-based pruning. No age limit is enforced.

  + A value greater than 0 enables age-based pruning. The value is the number of seconds after which audit log files become subject to pruning.

  Note

  Setting `audit_log_prune_seconds` by itself is not sufficient to cause log file pruning to occur because the pruning algorithm uses `audit_log_rotate_on_size`, `audit_log_max_size`, and `audit_log_prune_seconds` in conjunction. For details, see Space Management of Audit Log Files.

* `audit_log_read_buffer_size`

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code>4096</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>3

  The buffer size for reading from the audit log file, in bytes. The `audit_log_read()` function reads no more than this many bytes. Log file reading is supported only for JSON log format. For more information, see Section 8.4.6.6, “Reading Audit Log Files”.

  This variable has a default of 32KB and can be set at runtime. Each client should set its session value of `audit_log_read_buffer_size` appropriately for its use of `audit_log_read()`.

* `audit_log_rotate_on_size`

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code>4096</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>4

  If `audit_log_rotate_on_size` is 0, the audit log plugin does not perform automatic size-based log file rotation. If rotation is to occur, you must perform it manually; see Manual Audit Log File Rotation.

  If `audit_log_rotate_on_size` is greater than 0, automatic size-based log file rotation occurs. Whenever a write to the log file causes its size to exceed the `audit_log_rotate_on_size` value, the audit log plugin renames the current log file and opens a new current log file using the original name.

  If you set `audit_log_rotate_on_size` to a value that is not a multiple of 4096, it is truncated to the nearest multiple. In particular, setting it to a value less than 4096 sets it to 0 and no rotation occurs, except manually.

  Note

  `audit_log_rotate_on_size` controls whether audit log file rotation occurs. It can also be used in conjunction with `audit_log_max_size` and `audit_log_prune_seconds` to configure pruning of rotated JSON-format log files. For details, see Space Management of Audit Log Files.

* `audit_log_statement_policy`

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code>4096</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>5

  Note

  This deprecated variable applies only to legacy mode audit log filtering (see Section 8.4.6.10, “Legacy Mode Audit Log Filtering”).

  The policy controlling how the audit log plugin writes statement events to its log file. The following table shows the permitted values.

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code>4096</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>6

  Note

  At server startup, any explicit value given for `audit_log_statement_policy` may be overridden if `audit_log_policy` is also specified, as described in Section 8.4.6.5, “Configuring Audit Logging Characteristics”.

* `audit_log_strategy`

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code>4096</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>7

  The logging method used by the audit log plugin. These strategy values are permitted:

  + `ASYNCHRONOUS`: Log asynchronously. Wait for space in the output buffer.

  + `PERFORMANCE`: Log asynchronously. Drop requests for which there is insufficient space in the output buffer.

  + `SEMISYNCHRONOUS`: Log synchronously. Permit caching by the operating system.

  + `SYNCHRONOUS`: Log synchronously. Call `sync()` after each request.

##### Audit Log Status Variables

If the audit log plugin is enabled, it exposes several status variables that provide operational information. These variables are available for legacy mode audit filtering (deprecated) and JSON mode audit filtering.

* `Audit_log_current_size`

  The size of the current audit log file. The value increases when an event is written to the log and is reset to 0 when the log is rotated.

* `Audit_log_direct_writes`

  When the audit log plugin writes events to the JSON-format audit log, it uses a buffer to store event contents prior to writing them. If the query length is greater than the size of the buffer, then the plugin writes the event directly to the log, bypassing the buffer. This variable shows the number of direct writes. The plugin determines the count based on the current write strategy in use (see `audit_log_strategy`).

  **Table 8.45 Write-Strategy Effect on the Direct Write Count**

  <table frame="box" rules="all" summary="Properties for audit_log_buffer_size"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--audit-log-buffer-size=#</code></td> </tr><tr><th>System Variable</th> <td><code>audit_log_buffer_size</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1048576</code></td> </tr><tr><th>Minimum Value</th> <td><code>4096</code></td> </tr><tr><th>Maximum Value (64-bit platforms)</th> <td><code>18446744073709547520</code></td> </tr><tr><th>Maximum Value (32-bit platforms)</th> <td><code>4294967295</code></td> </tr><tr><th>Unit</th> <td>bytes</td> </tr><tr><th>Block Size</th> <td><code>4096</code></td> </tr></tbody></table>8

* `Audit_log_event_max_drop_size`

  The size of the largest dropped event in performance logging mode. For a description of logging modes, see Section 8.4.6.5, “Configuring Audit Logging Characteristics”.

* `Audit_log_events`

  The number of events handled by the audit log plugin, whether or not they were written to the log based on filtering policy (see Section 8.4.6.5, “Configuring Audit Logging Characteristics”).

* `Audit_log_events_filtered`

  The number of events handled by the audit log plugin that were filtered (not written to the log) based on filtering policy (see Section 8.4.6.5, “Configuring Audit Logging Characteristics”).

* `Audit_log_events_lost`

  The number of events lost in performance logging mode because an event was larger than the available audit log buffer space. This value may be useful for assessing how to set `audit_log_buffer_size` to size the buffer for performance mode. For a description of logging modes, see Section 8.4.6.5, “Configuring Audit Logging Characteristics”.

* `Audit_log_events_written`

  The number of events written to the audit log.

* `Audit_log_total_size`

  The total size of events written to all audit log files. Unlike `Audit_log_current_size`, the value of `Audit_log_total_size` increases even when the log is rotated.

* `Audit_log_write_waits`

  The number of times an event had to wait for space in the audit log buffer in asynchronous logging mode. For a description of logging modes, see Section 8.4.6.5, “Configuring Audit Logging Characteristics”.


#### 8.4.6.12 Audit Log Restrictions

MySQL Enterprise Audit is subject to these general restrictions:

* Only SQL statements are logged. Changes made by no-SQL APIs, such as memcached, Node.JS, and the NDB API, are not logged.

* Only top-level statements are logged, not statements within stored programs such as triggers or stored procedures.

* Contents of files referenced by statements such as `LOAD DATA` are not logged.

**NDB Cluster.** It is possible to use MySQL Enterprise Audit with MySQL NDB Cluster, subject to the following conditions:

* All changes to be logged must be done using the SQL interface. Changes using no-SQL interfaces, such as those provided by the NDB API, memcached, or ClusterJ, are not logged.

* The plugin must be installed on each MySQL server that is used to execute SQL on the cluster.

* Audit plugin data must be aggregated amongst all MySQL servers used with the cluster. This aggregation is the responsibility of the application or user.


### 8.4.7 The Audit Message Component

The `audit_api_message_emit` component enables applications to add their own message events to the audit log, using the `audit_api_message_emit_udf()` function.

The `audit_api_message_emit` component cooperates with all plugins of audit type. For concreteness, examples use the `audit_log` plugin described in Section 8.4.6, “MySQL Enterprise Audit”.

* Installing or Uninstalling the Audit Message Component
* Audit Message Function

#### Installing or Uninstalling the Audit Message Component

To be usable by the server, the component library file must be located in the MySQL plugin directory (the directory named by the `plugin_dir` system variable). If necessary, configure the plugin directory location by setting the value of `plugin_dir` at server startup.

To install the `audit_api_message_emit` component, use this statement:

```
INSTALL COMPONENT "file://component_audit_api_message_emit";
```

Component installation is a one-time operation that need not be done per server startup. [`INSTALL COMPONENT`](install-component.html "15.7.4.3 INSTALL COMPONENT Statement") loads the component, and also registers it in the `mysql.component` system table to cause it to be loaded during subsequent server startups.

To uninstall the `audit_api_message_emit` component, use this statement:

```
UNINSTALL COMPONENT "file://component_audit_api_message_emit";
```

`UNINSTALL COMPONENT` unloads the component, and unregisters it from the `mysql.component` system table to cause it not to be loaded during subsequent server startups.

Because installing and uninstalling the `audit_api_message_emit` component installs and uninstalls the `audit_api_message_emit_udf()` function that the component implements, it is not necessary to use `CREATE FUNCTION` or `DROP FUNCTION` to do so.

#### Audit Message Function

This section describes the `audit_api_message_emit_udf()` function implemented by the `audit_api_message_emit` component.

Before using the audit message function, install the audit message component according to the instructions provided at Installing or Uninstalling the Audit Message Component.

* [`audit_api_message_emit_udf(component, producer, message[, key, value] ...)`](audit-api-message-emit.html#function_audit-api-message-emit-udf)

  Adds a message event to the audit log. Message events include component, producer, and message strings of the caller's choosing, and optionally a set of key-value pairs.

  An event posted by this function is sent to all enabled plugins of audit type, each of which handles the event according to its own rules. If no plugin of audit type is enabled, posting the event has no effect.

  Arguments:

  + *`component`*: A string that specifies a component name.

  + *`producer`*: A string that specifies a producer name.

  + *`message`*: A string that specifies the event message.

  + *`key`*, *`value`*: Events may include 0 or more key-value pairs that specify an arbitrary application-provided data map. Each *`key`* argument is a string that specifies a name for its immediately following *`value`* argument. Each *`value`* argument specifies a value for its immediately following *`key`* argument. Each *`value`* can be a string or numeric value, or `NULL`.

  Return value:

  The string `OK` to indicate success. An error occurs if the function fails.

  Example:

  ```
  mysql> SELECT audit_api_message_emit_udf('component_text',
                                           'producer_text',
                                           'message_text',
                                           'key1', 'value1',
                                           'key2', 123,
                                           'key3', NULL) AS 'Message';
  +---------+
  | Message |
  +---------+
  | OK      |
  +---------+
  ```

  Additional information:

  Each audit plugin that receives an event posted by `audit_api_message_emit_udf()` logs the event in plugin-specific format. For example, the `audit_log` plugin (see Section 8.4.6, “MySQL Enterprise Audit”) logs message values as follows, depending on the log format configured by the `audit_log_format` system variable:

  + JSON format (`audit_log_format=JSON`):

    ```
    {
      ...
      "class": "message",
      "event": "user",
      ...
      "message_data": {
        "component": "component_text",
        "producer": "producer_text",
        "message": "message_text",
        "map": {
          "key1": "value1",
          "key2": 123,
          "key3": null
        }
      }
    }
    ```

  + New-style XML format (`audit_log_format=NEW`):

    ```
    <AUDIT_RECORD>
     ...
     <NAME>Message</NAME>
     ...
     <COMMAND_CLASS>user</COMMAND_CLASS>
     <COMPONENT>component_text</COMPONENT>
     <PRODUCER>producer_text</PRODUCER>
     <MESSAGE>message_text</MESSAGE>
     <MAP>
       <ELEMENT>
         <KEY>key1</KEY>
         <VALUE>value1</VALUE>
       </ELEMENT>
       <ELEMENT>
         <KEY>key2</KEY>
         <VALUE>123</VALUE>
       </ELEMENT>
       <ELEMENT>
         <KEY>key3</KEY>
         <VALUE/>
       </ELEMENT>
     </MAP>
    </AUDIT_RECORD>
    ```

  + Old-style XML format (`audit_log_format=OLD`):

    ```
    <AUDIT_RECORD
      ...
      NAME="Message"
      ...
      COMMAND_CLASS="user"
      COMPONENT="component_text"
      PRODUCER="producer_text"
      MESSAGE="message_text"/>
    ```

    Note

    Message events logged in old-style XML format do not include the key-value map due to representational constraints imposed by this format.

  Messages posted by `audit_api_message_emit_udf()` have an event class of `MYSQL_AUDIT_MESSAGE_CLASS` and a subclass of `MYSQL_AUDIT_MESSAGE_USER`. (Internally generated audit messages have the same class and a subclass of `MYSQL_AUDIT_MESSAGE_INTERNAL`; this subclass currently is unused.) To refer to such events in `audit_log` filtering rules, use a `class` element with a `name` value of `message`. For example:

  ```
  {
    "filter": {
      "class": {
        "name": "message"
      }
    }
  }
  ```

  Should it be necessary to distinguish user-generated and internally generated message events, test the `subclass` value against `user` or `internal`.

  Filtering based on the contents of the key-value map is not supported.

  For information about writing filtering rules, see Section 8.4.6.7, “Audit Log Filtering”.


### 8.4.8 MySQL Enterprise Firewall

Note

MySQL Enterprise Firewall is an extension included in MySQL Enterprise Edition, a commercial product. To learn more about commercial products, see <https://www.mysql.com/products/>.

MySQL Enterprise Firewall is an application-level firewall that enables database administrators to permit or deny SQL statement execution based on matching against lists of accepted statement patterns. This helps harden MySQL Server against attacks such as SQL injection or attempts to exploit applications by using them outside of their legitimate query workload characteristics.

In MySQL 9.5, MySQL Enterprise Firewall is available as a plugin (see Section 8.4.8.1, “The MySQL Enterprise Firewall Plugin”), and as a component (see Section 8.4.8.2, “The MySQL Enterprise Firewall Component”). The firewall plugin is deprecated. We recommend that you upgrade from the plugin to the firewall component as soon as possible, since the plugin is subject to removal in a future version of MySQL. See Upgrading to the MySQL Enterprise Firewall Component, for help with migrating to the MySQL Enterprise Firewall component.

The firewall plugin and firewall component supply the same functionality with the exception of account profiles, which are deprecated in the firewall plugin and not supported by the component. If you are using account profiles with the firewall plugin, you can migrate them to group profiles using the migration tool, as described in Migrating Account Profiles to Group Profiles. This is done automatically when you migrate from the firewall plugin to the firewall component by running `upgrade_firewall_to_component.sql` (see MySQL Enterprise Firewall Component Scripts) or MySQL Configurator (see Section 2.3.2.1, “MySQL Server Configuration with MySQL Configurator”).

Each MySQL account registered with the firewall has its own statement allowlist, enabling protection to be tailored per account. For a given account, the firewall can operate in recording, protecting, or detecting mode, for training in the accepted statement patterns, active protection against unacceptable statements, or passive detection of unacceptable statements. The diagram illustrates how the firewall processes incoming statements in each mode.

**Figure 8.1 MySQL Enterprise Firewall Operation**

![Flow chart showing how MySQL Enterprise Firewall processes incoming SQL statements in recording, protecting, and detecting modes.](images/firewall-diagram-1.png)

The following two sections describe, respectively, the MySQL Enterprise Firewall plugin and the MySQL Enterprise Firewall component, discussing how to install and use each of these, and providing reference information for the elements of each as well. Upgrading to the MySQL Enterprise Firewall Component, and Downgrading the MySQL Enterprise Firewall Component, provide information about migrating between the plugin and component versions of MySQL Enterprise Firewall.


#### 8.4.8.1 The MySQL Enterprise Firewall Plugin

This section contains information about the MySQL Enterprise Firewall plugin.

Important

The firewall plugin is deprecated in favor of a firewall component which implements most of the same functionality but uses the superior component architecture. For general information about the firewall component, see Section 8.4.8.2, “The MySQL Enterprise Firewall Component”; for information about upgrading the firewall plugin to the firewall component (recommended), see Upgrading to the MySQL Enterprise Firewall Component.

##### 8.4.8.1.1 Elements of MySQL Enterprise Firewall (Plugin)

MySQL Enterprise Firewall is based on a plugin library that includes these elements:

* A server-side plugin named `MYSQL_FIREWALL` examines SQL statements before they execute and, based on the registered firewall profiles, renders a decision whether to execute or reject each statement.

* The `MYSQL_FIREWALL` plugin, along with server-side plugins named `MYSQL_FIREWALL_USERS` and `MYSQL_FIREWALL_WHITELIST`, implement Performance Schema and Information Schema tables that provide views into the registered profiles.

* Profiles are cached in memory for better performance. Tables in the firewall database provide backing storage of firewall data for persistence of profiles across server restarts. The firewall database can be the `mysql` system database (the default) or a custom schema (see Installing the MySQL Enterprise Firewall Plugin).

* Stored procedures perform tasks such as registering firewall profiles, establishing their operational modes, and managing transfer of firewall data between the cache and persistent storage.

* Administrative functions provide an API for lower-level tasks such as synchronizing the cache with persistent storage.

* System variables and status variables specific to the firewall plugin enable firewall configuration and provide runtime operational information, respectively.

* The `FIREWALL_ADMIN` privilege enables users to administer firewall rules for any user; `FIREWALL_USER` (deprecated) allows users to administer their own firewall rules.

  Note

  The `FIREWALL_USER` privilege is not supported by the MySQL Enterprise Firewall component.

* The `FIREWALL_EXEMPT` privilege exempts a user from firewall restrictions. This is useful, for example, for any database administrator who configures the firewall, to avoid the possibility of a misconfiguration causing even the administrator to be locked out and unable to execute statements.

##### 8.4.8.1.2 Installing or Uninstalling the MySQL Enterprise Firewall Plugin

MySQL Enterprise Firewall plugin installation is a one-time operation that installs the elements described in Section 8.4.8.1.1, “Elements of MySQL Enterprise Firewall (Plugin)”"). Installation can be performed using a graphical interface or manually:

* On Windows, MySQL Configurator includes an option to enable MySQL Enterprise Firewall for you.

* MySQL Workbench 6.3.4 or higher can install the MySQL Enterprise Firewall plugin, enable or disable an installed firewall, or uninstall the firewall.

* Manual MySQL Enterprise Firewall installation involves running a script located in the `share` directory of your MySQL installation.

Important

Read this entire section before following its instructions. Parts of the procedure differ depending on your environment.

Note

If installed, the MySQL Enterprise Firewall plugin involves some minimal overhead even when disabled. To avoid this overhead, do not install the plugin unless you plan to use it.

For usage instructions, see Section 8.4.8.1.3, “Using the MySQL Enterprise Firewall Plugin”. For reference information, see Section 8.4.8.1.4, “MySQL Enterprise Firewall Plugin Reference”.

* Installing the MySQL Enterprise Firewall Plugin
* Uninstalling the MySQL Enterprise Firewall Plugin

###### Installing the MySQL Enterprise Firewall Plugin

If the MySQL Enterprise Firewall plugin from an older version of MySQL is already installed, uninstall it using the instructions given later in this section, then restart the server before installing the current version. In this case, it is also necessary to re-register the configuration.

On Windows, you can use Section 2.3.2, “Configuration: Using MySQL Configurator” to install the MySQL Enterprise Firewall plugin by checking the Enable MySQL Enterprise Firewall check box from the `Type and Networking` tab. (Open Firewall port for network access has a different purpose. It refers to Windows Firewall and controls whether Windows blocks the TCP/IP port on which the MySQL server listens for client connections.)

To install the MySQL Enterprise Firewall plugin using MySQL Workbench, see MySQL Enterprise Firewall Interface.

To install the firewall plugin manually, look in the `share` directory of your MySQL installation and choose the script that is appropriate for your platform from those listed here:

* `win_install_firewall.sql`
* `linux_install_firewall.sql`

The installation script creates stored procedures and tables in the firewall database you specify when you run the script. The `mysql` system database is the default location, but we recommend that you create and use a custom schema specifically for this purpose.

To use the `mysql` system database, run the script as follows from the command line. The example here uses the Linux installation script. Make any substitutions appropriate for your system.

```
$> mysql -u root -p -D mysql < linux_install_firewall.sql
Enter password: (enter root password here)
```

To create and use a custom schema with the script, do the following:

1. Start the server with the `--loose-mysql-firewall-database=database-name` option. Insert the name of the custom schema to be used as the firewall database.

   Prefixing the option name with `--loose`, causes the server to issue a warning rather than to terminate with an error due to there being (as yet) no such database.

2. Invoke the MySQL client program and create the custom schema on the server, like this:

   ```
   mysql> CREATE DATABASE IF NOT EXISTS database-name;
   ```

3. Run the installation script, specifying by name the custom schema just created as the firewall database:

   ```
   $> mysql -u root -p -D database-name < linux_install_firewall.sql
   Enter password: (enter root password here)
   ```

Installing MySQL Enterprise Firewall either using a graphical interface or manually should enable the firewall. To verify this, connect to the server and execute the statement shonw here:

```
mysql> SHOW GLOBAL VARIABLES LIKE 'mysql_firewall_mode';
+---------------------+-------+
| Variable_name       | Value |
+---------------------+-------+
| mysql_firewall_mode | ON    |
+---------------------+-------+
```

If the plugin fails to initialize, check the server error log for diagnostic messages.

Note

To use the MySQL Enterprise Firewall plugin in the context of source/replica replication, Group Replication, or InnoDB Cluster, you must prepare any replica nodes prior to running the installation script on the source node. This is necessary because the `INSTALL PLUGIN` statements in the script are not replicated.

1. On each replica node, extract the `INSTALL PLUGIN` statements from the installation script and execute them manually.

2. On the source node, run the installation script appropriate to your platform, as described previously.

###### Uninstalling the MySQL Enterprise Firewall Plugin

The MySQL Enterprise Firewall plugin can be uninstalled using MySQL Workbench, or manually.

To uninstall the MySQL Enterprise Firewall plugin using MySQL Workbench 6.3.4 or later, see MySQL Enterprise Firewall Interface, in Chapter 33, *MySQL Workbench*.

To uninstall the firewall plugin from the command line, run the uninstall script located in the `share` directory of your MySQL installation. This example specifies `mysql` as the firewall database:

```
$> mysql -u root -p -D mysql < uninstall_firewall.sql
Enter password: (enter root password here)
```

If you created a custom schema when you installed the firewall plugin, run the uninstall script as shown here, substituting the schema name for *`database-name`*:

```
$> mysql -u root -p -D database-name < uninstall_firewall.sql
Enter password: (enter root password here)
```

`uninstall_firewall.sql` removes all firewall plugins, tables, functions, and stored procedures associated with the MySQL Enterprise Firewall plugin.

##### 8.4.8.1.3 Using the MySQL Enterprise Firewall Plugin

Before using the MySQL Enterprise Firewall plugin, install it according to the instructions provided in Section 8.4.8.1.2, “Installing or Uninstalling the MySQL Enterprise Firewall Plugin”.

This section describes how to configure the firewall plugin using SQL statements. Alternatively, MySQL Workbench 6.3.4 and later versions provide a graphical interface for firewall control. See MySQL Enterprise Firewall Interface.

* Enabling or Disabling the Firewall Plugin
* Scheduling Firewall Cache Reloads
* Assigning Firewall Privileges (Plugin)")
* Firewall Concepts
* Registering Firewall Group Profiles
* Registering Firewall Account Profiles
* Monitoring the Firewall
* Migrating Account Profiles to Group Profiles

###### Enabling or Disabling the Firewall Plugin

To enable or disable the firewall plugin, set the `mysql_firewall_mode` system variable. By default, this is `ON` when the firewall plugin is installed. To set the initial firewall state explicitly at server startup, you can set the variable in an option file such as `my.cnf`, like this:

```
[mysqld]
mysql_firewall_mode=ON
```

After modifying `my.cnf`, restart the server to cause the new setting to take effect. See Section 6.2.2.2, “Using Option Files”, for more information.

Alternatively, to set and persist the firewall setting at runtime, run the SQL statements shown here:

```
SET PERSIST mysql_firewall_mode = OFF;
SET PERSIST mysql_firewall_mode = ON;
```

[`SET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") sets a value for the running MySQL instance. It also saves the value, causing it to carry over to subsequent server restarts. To change a value for the running MySQL instance without having it carry over to subsequent restarts, use the `GLOBAL` keyword rather than `PERSIST`. See Section 15.7.6.1, “SET Syntax for Variable Assignment”.

###### Scheduling Firewall Cache Reloads

Each time the `MYSQL_FIREWALL` server-side plugin initializes, it loads data into its internal cache from the tables listed here:

* `firewall_whitelist`
* `firewall_group_allowlist`
* `firewall_users`
* `firewall_groups`
* `firewall_membership`

Without restarting the server or reinstalling the server-side plugin, modification of data outside of the plugin is not reflected internally. The `mysql_firewall_reload_interval_seconds` system variable makes it possible to force memory cache reloads from tables at specified intervals. By default, the interval value is `0`, which disables such reloads.

To schedule regular cache reloads, first ensure that the `scheduler` component is installed and enabled (see Section 7.5.5, “Scheduler Component”). To check the status of the component, execute the following `SHOW VARIABLES` statement:

```
SHOW VARIABLES LIKE 'component_scheduler%';
+-----------------------------+-------+
| Variable_name               | Value |
+-----------------------------+-------|
| component_scheduler.enabled | On    |
+-----------------------------+-------+
```

With the firewall plugin installed, set `mysql_firewall_reload_interval_seconds` at server startup to a number between 60 and `INT_MAX`, whose value is platform-specific. Values in the range `1` to `59` (inclusive) are reset to 60, with a warning, as shown here:

```
$> mysqld [server-options] --mysql-firewall-reload-interval-seconds=40
...
2023-08-31T17:46:35.043468Z 0 [Warning] [MY-015031] [Server] Plugin MYSQL_FIREWALL
reported: 'Invalid reload interval specified: 40. Valid values are 0 (off) or
greater than or equal to 60. Adjusting to 60.'
...
```

Alternatively, to set and persist this setting at startup, precede the variable name with the `PERSIST_ONLY` keyword or the `@@PERSIST_ONLY.` qualifier, like this:

```
SET PERSIST_ONLY mysql_firewall_reload_interval_seconds = 120;
SET @@PERSIST_ONLY.mysql_firewall_reload_interval_seconds = 120;
```

After performing this modification, restart the server, to cause the new setting to take effect.

###### Assigning Firewall Privileges (Plugin)

After the firewall plugin has been installed and configured, you should grant appropriate privileges to the MySQL account or accounts to be used for administering it. The assignment of privileges depends on which firewall operations an account should be permitted to perform, as listed here:

* Grant the `FIREWALL_EXEMPT` privilege to any account that should be exempt from firewall restrictions. This is useful, for example, for a database administrator who configures the firewall, to avoid the possibility of a misconfiguration causing even the administrator to be locked out and unable to execute statements.

* Grant the `FIREWALL_ADMIN` privilege to any account that should have full administrative firewall access. (Some administrative firewall functions can be invoked by accounts that have `FIREWALL_ADMIN` *or* the deprecated `SUPER` privilege, as indicated in the individual function descriptions.)

* Grant the `FIREWALL_USER` privilege (deprecated) to any account that should have administrative access only for its own firewall rules.

  Note

  `FIREWALL_USER` is not supported by the MySQL Enterprise Firewall component.

* Grant the `EXECUTE` privilege for the stored procedures in the firewall database. These may invoke administrative functions, so stored procedure access also requires the privileges indicated earlier that are needed for those functions. The firewall database can be the `mysql` system database or a custom schema (see Installing the MySQL Enterprise Firewall Plugin).

Note

The `FIREWALL_EXEMPT`, `FIREWALL_ADMIN`, and `FIREWALL_USER` privileges can be granted only while the firewall is installed because the `MYSQL_FIREWALL` plugin defines those privileges.

###### Firewall Concepts

The MySQL server permits clients to connect and receives from them SQL statements to be executed. If the firewall is enabled, the server passes to it each incoming statement that does not immediately fail with a syntax error. Based on whether the firewall accepts the statement, the server executes it or returns an error to the client. This section describes how the firewall accomplishes the task of accepting or rejecting statements.

* Firewall Profiles
* Firewall Statement Matching
* Profile Operational Modes
* Firewall Statement Handling When Multiple Profiles Apply

###### Firewall Profiles

The firewall uses a registry of profiles that determine whether to permit statement execution. Profiles have these attributes:

* An allowlist. The allowlist is the set of rules that defines which statements are acceptable to the profile.

* A current operational mode. The mode enables the profile to be used in different ways. For example: the profile can be placed in training mode to establish the allowlist; the allowlist can be used for restricting statement execution or intrusion detection; the profile can be disabled entirely.

* A scope of applicability. The scope indicates which client connections the profile applies to:

  + The firewall supports account-based profiles such that each profile matches a particular client account (client user name and host name combination). For example, you can register one account profile for which the allowlist applies to connections originating from `admin@localhost` and another account profile for which the allowlist applies to connections originating from `myapp@apphost.example.com`.

    Note

    Account-based profiles are deprecated, and are not supported by the MySQL Enterprise Firewall component. If you are using account profiles with the firewall plugin, you can migrate them to group profiles as described in Migrating Account Profiles to Group Profiles. This is also done when you run `upgrade_firewall_to_component.sql` (see MySQL Enterprise Firewall Component Scripts) or migrate from the firewall plugin to the component using MySQL Configurator (see Section 2.3.2.1, “MySQL Server Configuration with MySQL Configurator”).

  + The firewall supports group profiles that can have multiple accounts as members, with the profile allowlist applying equally to all members. Group profiles enable easier administration and greater flexibility for deployments that require applying a given set of allowlist rules to multiple accounts.

Initially, no profiles exist, so by default, the firewall accepts all statements and has no effect on which statements MySQL accounts can execute. To apply firewall protective capabilities, explicit action is required:

* Register one or more profiles with the firewall.
* Train the firewall by establishing the allowlist for each profile; that is, the types of statements the profile permits clients to execute.

* Place the trained profiles in protecting mode to harden MySQL against unauthorized statement execution:

  + MySQL associates each client session with a specific user name and host name combination. This combination is the *session account*.

  + For each client connection, the firewall uses the session account to determine which profiles apply to handling incoming statements from the client.

    The firewall accepts only statements permitted by the applicable profile allowlists.

Most firewall principles apply identically to group profiles and account profiles. The two types of profiles differ in these respects:

* An account profile allowlist applies only to a single account. A group profile allowlist applies when the session account matches any account that is a member of the group.

* To apply an allowlist to multiple accounts using account profiles, it is necessary to register one profile per account and duplicate the allowlist across each profile. This entails training each account profile individually because each one must be trained using the single account to which it applies.

  A group profile allowlist applies to multiple accounts, with no need to duplicate it for each account. A group profile can be trained using any or all of the group member accounts, or training can be limited to any single member. Either way, the allowlist applies to all members.

* Account profile names are based on specific user name and host name combinations that depend on which clients connect to the MySQL server. Group profile names are chosen by the firewall administrator with no constraints other than that their length must be from 1 to 288 characters.

Note

Due to the advantages of group profiles over account profiles, and because a group profile with a single member account is logically equivalent to an account profile for that account, it is recommended that all new firewall profiles be created as group profiles. Account profiles are deprecated, and subject to removal in a future MySQL version. For assistance converting existing account profiles, see Migrating Account Profiles to Group Profiles. The firewall component does not support account profiles.

The profile-based protection afforded by the firewall enables implementation of strategies such as those listed here:

* If an application has unique protection requirements, have it use an account not used for any other purpose, and set up a group profile or account profile for that account.

* If related applications share protection requirements, associate each application with its own account, then add these application accounts as members of the same group profile. Alternatively, have all of the applications use the same account and associate them with an account profile for that account.

###### Firewall Statement Matching

Statement matching performed by the firewall does not use SQL statements as received from clients. Instead, the server converts incoming statements to normalized digest form and firewall operation uses these digests. The benefit of statement normalization is that it enables similar statements to be grouped and recognized using a single pattern. For example, these statements are distinct from each other:

```
SELECT first_name, last_name FROM customer WHERE customer_id = 1;
select first_name, last_name from customer where customer_id = 99;
SELECT first_name, last_name FROM customer WHERE customer_id = 143;
```

But all of them have the same normalized digest form:

```
SELECT `first_name` , `last_name` FROM `customer` WHERE `customer_id` = ?
```

By using normalization, firewall allowlists can store digests that each match many different statements received from clients. For more information about normalization and digests, see Section 29.10, “Performance Schema Statement Digests and Sampling”.

Warning

Setting the `max_digest_length` system variable to `0` disables digest production, which also disables server functionality that requires digests, such as MySQL Enterprise Firewall.

###### Profile Operational Modes

Each profile registered with the firewall has its own operational mode, chosen from these values:

* `OFF`: This mode disables the profile. The firewall considers it inactive and ignores it.

* `RECORDING`: This is the firewall training mode. Incoming statements received from a client that matches the profile are considered acceptable for the profile and become part of its “fingerprint.” The firewall records the normalized digest form of each statement to learn the acceptable statement patterns for the profile. Each pattern is a rule, and the union of the rules is the profile allowlist.

  Group and account profiles differ in that statement recording for a group profile can be limited to statements received from a single group member (the training member).

* `PROTECTING`: In this mode, the profile allows or prevents statement execution. The firewall matches incoming statements against the profile allowlist, accepting only statements that match and rejecting those that do not. After training a profile in `RECORDING` mode, switch it to `PROTECTING` mode to harden MySQL against access by statements that deviate from the allowlist. If the `mysql_firewall_trace` system variable is enabled, the firewall also writes rejected statements to the error log.

* `DETECTING`: This mode detects but not does not block intrusions (statements that are suspicious because they match nothing in the profile allowlist). In `DETECTING` mode, the firewall writes suspicious statements to the error log but accepts them without denying access.

When a profile is assigned any of the preceding mode values, the firewall stores the mode in the profile. Firewall mode-setting operations also permit a mode value of `RESET`, but this value is not stored: setting a profile to `RESET` mode causes the firewall to delete all rules for the profile and set its mode to `OFF`.

Note

Messages written to the error log in `DETECTING` mode or because `mysql_firewall_trace` is enabled are written as Notes, which are information messages. To ensure that such messages appear in the error log and are not discarded, make sure that error-logging verbosity is sufficient to include information messages. For example, if you are using priority-based log filtering, as described in Section 7.4.2.5, “Priority-Based Error Log Filtering (log_filter_internal)”"), set the `log_error_verbosity` system variable to `3`.

###### Firewall Statement Handling When Multiple Profiles Apply

For simplicity, later sections that describe how to set up profiles take the perspective that the firewall matches incoming statements from a client against only a single profile, either a group profile or account profile. But firewall operation can be more complex:

* A group profile can include multiple accounts as members.

* An account can be a member of multiple group profiles.
* Multiple profiles can match a given client.

The following description covers the general case of how the firewall operates, when potentially multiple profiles apply to incoming statements.

As previously mentioned, MySQL associates each client session with a specific user name and host name combination known as the *session account*. The firewall matches the session account against registered profiles to determine which profiles apply to handling incoming statements from the session:

* The firewall ignores inactive profiles (profiles with a mode of `OFF`).

* The session account matches every active group profile that includes a member having the same user and host. There can be more than one such group profile.

* The session account matches an active account profile having the same user and host, if there is one. There is at most one such account profile.

In other words, the session account can match 0 or more active group profiles, and 0 or 1 active account profiles. This means that 0, 1, or multiple firewall profiles are applicable to a given session, for which the firewall handles each incoming statement as follows:

* If there is no applicable profile, the firewall imposes no restrictions and accepts the statement.

* If there are applicable profiles, their modes determine statement handling:

  + The firewall records the statement in the allowlist of each applicable profile that is in `RECORDING` mode.

  + The firewall writes the statement to the error log for each applicable profile in `DETECTING` mode for which the statement is suspicious (does not match the profile allowlist).

  + The firewall accepts the statement if at least one applicable profile is in `RECORDING` or `DETECTING` mode (those modes accept all statements), or if the statement matches the allowlist of at least one applicable profile in `PROTECTING` mode. Otherwise, the firewall rejects the statement (and writes it to the error log if the `mysql_firewall_trace` system variable is enabled).

With that description in mind, the next sections revert to the simplicity of the situations when a single group profile or a single account profile apply, and cover how to set up each type of profile.

###### Registering Firewall Group Profiles

MySQL Enterprise Firewall supports registration of group profiles. A group profile can have multiple accounts as its members. To use a firewall group profile to protect MySQL against incoming statements from a given account, follow these steps:

1. Register the group profile and put it in `RECORDING` mode.

2. Add a member account to the group profile.
3. Connect to the MySQL server using the member account and execute statements to be learned. This trains the group profile and establishes the rules that form the profile allowlist.

4. Add to the group profile any other accounts that are to be group members.

5. Switch the group profile to `PROTECTING` mode. When a client connects to the server using any account that is a member of the group profile, the profile allowlist restricts statement execution.

6. Should additional training be necessary, switch the group profile to `RECORDING` mode again, update its allowlist with new statement patterns, then switch it back to `PROTECTING` mode.

Observe these guidelines for account references relating to the MySQL Enterprise Firewall plugin:

* Take note of the context in which account references occur. To name an account for firewall operations, specify it as a single quoted string (`'user_name@host_name'`). This differs from the usual MySQL convention for statements such as [`CREATE USER`](create-user.html "15.7.1.3 CREATE USER Statement") and `GRANT`, for which you quote the user and host parts of an account name separately (`'user_name'@'host_name'`).

  The requirement for naming accounts as a single quoted string for firewall operations means that you cannot use accounts that have embedded `@` characters in the user name.

* The firewall assesses statements against accounts represented by actual user and host names as authenticated by the server. When registering accounts in profiles, do not use wildcard characters or netmasks:

  + Suppose that an account named `me@%.example.org` exists and a client uses it to connect to the server from the host `abc.example.org`.

  + The account name contains a `%` wildcard character, but the server authenticates the client as having a user name of `me` and host name of `abc.example.com`, and that is what the firewall sees.

  + Consequently, the account name to use for firewall operations is `me@abc.example.org` rather than `me@%.example.org`.

The following procedure shows how to register a group profile with the firewall, train the firewall to know the acceptable statements for that profile (its allowlist), use the profile to protect MySQL against execution of unacceptable statements, and add and remove group members. The example uses a group profile name of `fwgrp`. The example profile is presumed for use by clients of an application that accesses tables in the `sakila` database (available at https://dev.mysql.com/doc/index-other.html).

Use an administrative MySQL account to perform the steps in this procedure, except those steps designated for execution by member accounts of the firewall group profile. For statements executed by member accounts, the default database should be `sakila`. (You can use a different database by adjusting the instructions accordingly.)

1. If necessary, create the accounts that are to be members of the `fwgrp` group profile and grant them appropriate access privileges. Statements for one member are shown here (choose an appropriate password):

   ```
   CREATE USER 'member1'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL ON sakila.* TO 'member1'@'localhost';
   ```

2. Use the `sp_set_firewall_group_mode()` stored procedure to register the group profile with the firewall and place the profile in `RECORDING` (training) mode, as shown here:

   ```
   CALL mysql.sp_set_firewall_group_mode('fwgrp', 'RECORDING');
   ```

   Note

   If you have installed MySQL Enterprise Firewall in a custom schema, substitute its name for `mysql`. For example, if the firewall is installed in the `fwdb` schema, execute the stored procedure like this:

   ```
   CALL fwdb.sp_set_firewall_group_mode('fwgrp', 'RECORDING');
   ```

3. Use the `sp_firewall_group_enlist()` stored procedure to add an initial member account for use in training the group profile allowlist:

   ```
   CALL mysql.sp_firewall_group_enlist('fwgrp', 'member1@localhost');
   ```

4. To train the group profile using the initial member account, connect to the server as `member1` from the server host so that the firewall sees a session account for `member1@localhost`. Then execute some statements to be considered legitimate for the profile. For example:

   ```
   SELECT title, release_year FROM film WHERE film_id = 1;
   UPDATE actor SET last_update = NOW() WHERE actor_id = 1;
   SELECT store_id, COUNT(*) FROM inventory GROUP BY store_id;
   ```

   The firewall receives the statements from the `member1@localhost` account. Because that account is a member of the `fwgrp` profile, which is in `RECORDING` mode, the firewall interprets the statements as applicable to `fwgrp` and records the normalized digest form of the statements as rules in the `fwgrp` allowlist. Those rules then apply to all accounts that are members of `fwgrp`.

   Note

   Until the `fwgrp` group profile receives statements in `RECORDING` mode, its allowlist is empty, which is equivalent to “deny all.” No statement can match an empty allowlist, which has these implications:

   * The group profile cannot be switched to `PROTECTING` mode. It would reject every statement, effectively prohibiting the accounts that are group members from executing any statement.

   * The group profile can be switched to `DETECTING` mode. In this case, the profile accepts every statement but logs it as suspicious.

5. At this point, the group profile information is cached, including its name, membership, and allowlist. To see this information, query the Performance Schema firewall tables, like this:

   ```
   mysql> SELECT MODE FROM performance_schema.firewall_groups
          WHERE NAME = 'fwgrp';
   +-----------+
   | MODE      |
   +-----------+
   | RECORDING |
   +-----------+
   mysql> SELECT * FROM performance_schema.firewall_membership
          WHERE GROUP_ID = 'fwgrp' ORDER BY MEMBER_ID;
   +----------+-------------------+
   | GROUP_ID | MEMBER_ID         |
   +----------+-------------------+
   | fwgrp    | member1@localhost |
   +----------+-------------------+
   mysql> SELECT RULE FROM performance_schema.firewall_group_allowlist
          WHERE NAME = 'fwgrp';
   +----------------------------------------------------------------------+
   | RULE                                                                 |
   +----------------------------------------------------------------------+
   | SELECT @@`version_comment` LIMIT ?                                   |
   | UPDATE `actor` SET `last_update` = NOW ( ) WHERE `actor_id` = ?      |
   | SELECT `title` , `release_year` FROM `film` WHERE `film_id` = ?      |
   | SELECT `store_id` , COUNT ( * ) FROM `inventory` GROUP BY `store_id` |
   +----------------------------------------------------------------------+
   ```

   See Section 29.12.17, “Performance Schema Firewall Tables”, for more information about these tables.

   Note

   The `@@version_comment` rule comes from a statement sent automatically by the **mysql** client when you connect to the server.

   Important

   Train the firewall under conditions matching application use. For example, to determine server characteristics and capabilities, a given MySQL connector might send statements to the server at the beginning of each session. If an application normally is used through that connector, train the firewall using the connector, too. That enables those initial statements to become part of the allowlist for the group profile associated with the application.

6. Invoke `sp_set_firewall_group_mode()` again to switch the group profile to `PROTECTING` mode:

   ```
   CALL mysql.sp_set_firewall_group_mode('fwgrp', 'PROTECTING');
   ```

   Important

   Switching the group profile out of `RECORDING` mode synchronizes its cached data to the firewall database tables that provide persistent underlying storage. If you do not switch the mode for a profile that is being recorded, the cached data is not written to persistent storage and is lost when the server is restarted. The firewall database can be the `mysql` system database or a custom schema (see Installing the MySQL Enterprise Firewall Plugin).

7. Add to the group profile any other accounts that should be members:

   ```
   CALL mysql.sp_firewall_group_enlist('fwgrp', 'member2@localhost');
   CALL mysql.sp_firewall_group_enlist('fwgrp', 'member3@localhost');
   CALL mysql.sp_firewall_group_enlist('fwgrp', 'member4@localhost');
   ```

   The profile allowlist trained using the `member1@localhost` account now also applies to the additional accounts.

8. To verify the updated group membership, query the `firewall_membership` table again:

   ```
   mysql> SELECT * FROM performance_schema.firewall_membership
          WHERE GROUP_ID = 'fwgrp' ORDER BY MEMBER_ID;
   +----------+-------------------+
   | GROUP_ID | MEMBER_ID         |
   +----------+-------------------+
   | fwgrp    | member1@localhost |
   | fwgrp    | member2@localhost |
   | fwgrp    | member3@localhost |
   | fwgrp    | member4@localhost |
   +----------+-------------------+
   ```

9. Test the group profile against the firewall by using any account in the group to execute some acceptable and unacceptable statements. The firewall matches each statement from the account against the profile allowlist and accepts or rejects it:

   * This statement is not identical to a training statement but produces the same normalized statement as one of them, so the firewall accepts it:

     ```
     mysql> SELECT title, release_year FROM film WHERE film_id = 98;
     +-------------------+--------------+
     | title             | release_year |
     +-------------------+--------------+
     | BRIGHT ENCOUNTERS |         2006 |
     +-------------------+--------------+
     ```

   * These statements match nothing in the allowlist, so the firewall rejects each with an error:

     ```
     mysql> SELECT title, release_year FROM film WHERE film_id = 98 OR TRUE;
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> SHOW TABLES LIKE 'customer%';
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> TRUNCATE TABLE mysql.slow_log;
     ERROR 1045 (28000): Statement was blocked by Firewall
     ```

   * If the `mysql_firewall_trace` system variable is enabled, the firewall also writes rejected statements to the error log. For example:

     ```
     [Note] Plugin MYSQL_FIREWALL reported:
     'ACCESS DENIED for 'member1@localhost'. Reason: No match in allowlist.
     Statement: TRUNCATE TABLE `mysql` . `slow_log`'
     ```

     These log messages may be helpful in identifying the source of attacks, should that be necessary.

10. Should members need to be removed from the group profile, use the stored procedure `sp_firewall_group_delist()`, like this:

    ```
    CALL mysql.sp_firewall_group_delist('fwgrp', 'member3@localhost');
    ```

The firewall group profile now is trained for member accounts. When clients connect using any account in the group and attempt to execute statements, the profile protects MySQL against statements not matched by the profile allowlist.

The procedure just shown added only one member to the group profile before training its allowlist. Doing so provides better control over the training period by limiting which accounts can add new acceptable statements to the allowlist. Should additional training be necessary, you can switch the profile back to `RECORDING` mode:

```
CALL mysql.sp_set_firewall_group_mode('fwgrp', 'RECORDING');
```

However, that enables any member of the group to execute statements and add them to the allowlist. To limit the additional training to a single group member, call `sp_set_firewall_group_mode_and_user()`, which is like `sp_set_firewall_group_mode()` but takes one more argument specifying which account is permitted to train the profile in `RECORDING` mode. For example, to enable training only by `member4@localhost`, call `sp_set_firewall_group_mode_and_user()` as shown here:

```
CALL mysql.sp_set_firewall_group_mode_and_user('fwgrp', 'RECORDING', 'member4@localhost');
```

This enables additional training by the specified account without having to remove the other group members. They can execute statements, but the statements are not added to the allowlist. You should keep in mind that, in `RECORDING` mode, the other members can execute *any* statement.

Note

To avoid unexpected behavior when a particular account is specified as the training account for a group profile, always ensure that account is a member of the group.

After the additional training, set the group profile back to `PROTECTING` mode, like this:

```
CALL mysql.sp_set_firewall_group_mode('fwgrp', 'PROTECTING');
```

The training account established by `sp_set_firewall_group_mode_and_user()` is saved in the group profile, so the firewall remembers it in case more training is needed later. Thus, if you call `sp_set_firewall_group_mode()` (which takes no training account argument), the current profile training account, `member4@localhost`, remains unchanged.

To clear the training account if it actually is desired to enable all group members to perform training in `RECORDING` mode, call `sp_set_firewall_group_mode_and_user()` and pass a `NULL` value for the account argument:

```
CALL mysql.sp_set_firewall_group_mode_and_user('fwgrp', 'RECORDING', NULL);
```

It is possible to detect intrusions by logging nonmatching statements as suspicious without denying access. First, put the group profile in `DETECTING` mode:

```
CALL mysql.sp_set_firewall_group_mode('fwgrp', 'DETECTING');
```

Then, using a member account, execute a statement that does not match the group profile allowlist. In `DETECTING` mode, the firewall permits the nonmatching statement to execute:

```
mysql> SHOW TABLES LIKE 'customer%';
+------------------------------+
| Tables_in_sakila (customer%) |
+------------------------------+
| customer                     |
| customer_list                |
+------------------------------+
```

In addition, the firewall writes a message to the error log:

```
[Note] Plugin MYSQL_FIREWALL reported:
'SUSPICIOUS STATEMENT from 'member1@localhost'. Reason: No match in allowlist.
Statement: SHOW TABLES LIKE ?'
```

To disable a group profile, change its mode to `OFF`:

```
CALL mysql.sp_set_firewall_group_mode(group, 'OFF');
```

To forget all training for a profile and disable it, reset it:

```
CALL mysql.sp_set_firewall_group_mode(group, 'RESET');
```

The reset operation causes the firewall to delete all rules for the profile and set its mode to `OFF`.

###### Registering Firewall Account Profiles

MySQL Enterprise Firewall enables profiles to be registered that correspond to individual accounts. To use a firewall account profile to protect MySQL against incoming statements from a given account, follow these steps:

1. Register the account profile and put it in `RECORDING` mode.

2. Connect to the MySQL server using the account and execute statements to be learned. This trains the account profile and establishes the rules that form the profile allowlist.

3. Switch the account profile to `PROTECTING` mode. When a client connects to the server using the account, the account profile allowlist restricts statement execution.

4. Should additional training be necessary, switch the account profile to `RECORDING` mode again, update its allowlist with new statement patterns, then switch it back to `PROTECTING` mode.

Observe these guidelines for account references relating to the MySQL Enterprise Firewall plugin:

* Take note of the context in which account references occur. To name an account for firewall operations, specify it as a single quoted string (`'user_name@host_name'`). This differs from the usual MySQL convention for statements such as [`CREATE USER`](create-user.html "15.7.1.3 CREATE USER Statement") and `GRANT`, for which you quote the user and host parts of an account name separately (`'user_name'@'host_name'`).

  The requirement for naming accounts as a single quoted string for firewall operations means that you cannot use accounts that have embedded `@` characters in the user name.

* The firewall assesses statements against accounts represented by actual user and host names as authenticated by the server. When registering accounts in profiles, do not use wildcard characters or netmasks:

  + Suppose that an account named `me@%.example.org` exists and a client uses it to connect to the server from the host `abc.example.org`.

  + The account name contains a `%` wildcard character, but the server authenticates the client as having a user name of `me` and host name of `abc.example.com`, and that is what the firewall sees.

  + Consequently, the account name to use for firewall operations is `me@abc.example.org` rather than `me@%.example.org`.

The following procedure shows how to register an account profile with the firewall, train the firewall to know the acceptable statements for that profile (its allowlist), and use the profile to protect MySQL against execution of unacceptable statements by the account. The example account, `fwuser@localhost`, is presumed for use by an application that accesses tables in the `sakila` database (available at https://dev.mysql.com/doc/index-other.html).

Use an administrative MySQL account to perform the steps in this procedure, except those steps designated for execution by the `fwuser@localhost` account that corresponds to the account profile registered with the firewall. For statements executed using this account, the default database should be `sakila`. (You can use a different database by adjusting the instructions accordingly.)

1. If necessary, create the account to use for executing statements (choose an appropriate password) and grant it privileges for the `sakila` database, like this:

   ```
   CREATE USER 'fwuser'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL ON sakila.* TO 'fwuser'@'localhost';
   ```

2. Use the `sp_set_firewall_mode()` stored procedure to register the account profile with the firewall and place the profile in `RECORDING` (training) mode, as shown here:

   ```
   CALL mysql.sp_set_firewall_mode('fwuser@localhost', 'RECORDING');
   ```

   Note

   If you have installed the MySQL Enterprise Firewall using a custom schema, substitute its name for `mysql` in the preceding statement. For example, if the firewall is installed in the `fwdb` schema, execute the stored procedure like this:

   ```
   CALL fwdb.sp_set_firewall_mode('fwuser@localhost', 'RECORDING');
   ```

3. To train the registered account profile, connect to the server as `fwuser` from the server host so that the firewall sees a session account for `fwuser@localhost`. Then use the account to execute some statements to be considered legitimate for the profile. For example:

   ```
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

   ```
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

   See Section 28.7, “INFORMATION_SCHEMA MySQL Enterprise Firewall Plugin Tables”, for more information about these tables.

   Note

   The `@@version_comment` rule comes from a statement sent automatically by the **mysql** client when it connects to the server.

   Important

   Train the firewall under conditions matching application use. For example, to determine server characteristics and capabilities, a given MySQL connector might send statements to the server at the beginning of each session. If an application normally is used through that connector, train the firewall using the connector, too. That enables those initial statements to become part of the allowlist for the account profile associated with the application.

5. Invoke `sp_set_firewall_mode()` again, this time switching the account profile to `PROTECTING` mode, as shown here:

   ```
   CALL mysql.sp_set_firewall_mode('fwuser@localhost', 'PROTECTING');
   ```

   Important

   Switching the account profile out of `RECORDING` mode synchronizes its cached data to the firewall database tables that provide persistent underlying storage. If you do not switch the mode for a profile that is being recorded, the cached data is not written to persistent storage and is lost when the server is restarted. The firewall database can be the `mysql` system database or a custom schema (see Installing the MySQL Enterprise Firewall Plugin).

6. Test the account profile by using the account to execute some acceptable and unacceptable statements. The firewall matches each statement from the account against the profile allowlist and accepts or rejects it. This list provides some examples:

   * This statement is not identical to a training statement but produces the same normalized statement as one of them, so the firewall accepts it:

     ```
     mysql> SELECT first_name, last_name FROM customer WHERE customer_id = '48';
     +------------+-----------+
     | first_name | last_name |
     +------------+-----------+
     | ANN        | EVANS     |
     +------------+-----------+
     ```

   * These statements match nothing in the allowlist, so the firewall rejects each with an error:

     ```
     mysql> SELECT first_name, last_name FROM customer WHERE customer_id = 1 OR TRUE;
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> SHOW TABLES LIKE 'customer%';
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> TRUNCATE TABLE mysql.slow_log;
     ERROR 1045 (28000): Statement was blocked by Firewall
     ```

   * If `mysql_firewall_trace` is enabled, the firewall also writes rejected statements to the error log. For example:

     ```
     [Note] Plugin MYSQL_FIREWALL reported:
     'ACCESS DENIED for fwuser@localhost. Reason: No match in allowlist.
     Statement: TRUNCATE TABLE `mysql` . `slow_log`'
     ```

     Such log messages may be helpful in identifying the source of attacks, should that be necessary.

The firewall account profile now is trained for the `fwuser@localhost` account. When clients connect using that account and attempt to execute statements, the profile protects MySQL against statements not matched by the profile allowlist.

It is possible to detect intrusions by logging nonmatching statements as suspicious without denying access. First, put the account profile in `DETECTING` mode:

```
CALL mysql.sp_set_firewall_mode('fwuser@localhost', 'DETECTING');
```

Then, using the account, execute a statement that does not match the account profile allowlist. In `DETECTING` mode, the firewall permits the nonmatching statement to execute:

```
mysql> SHOW TABLES LIKE 'customer%';
+------------------------------+
| Tables_in_sakila (customer%) |
+------------------------------+
| customer                     |
| customer_list                |
+------------------------------+
```

In addition, the firewall writes a message to the error log:

```
[Note] Plugin MYSQL_FIREWALL reported:
'SUSPICIOUS STATEMENT from 'fwuser@localhost'. Reason: No match in allowlist.
Statement: SHOW TABLES LIKE ?'
```

To disable an account profile, change its mode to `OFF`:

```
CALL mysql.sp_set_firewall_mode(user, 'OFF');
```

To forget all training for a profile and disable it, reset it:

```
CALL mysql.sp_set_firewall_mode(user, 'RESET');
```

The reset operation causes the firewall to delete all rules for the profile and set its mode to `OFF`.

###### Monitoring the Firewall

To assess firewall activity, examine its associated status variables. For example, after performing the procedure shown earlier to train and protect the `fwgrp` group profile, these variables have the values shown in the output of this [`SHOW GLOBAL STATUS`](show-status.html "15.7.7.38 SHOW STATUS Statement") statement:

```
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

These variables indicate the numbers of statements rejected, accepted, logged as suspicious, and added to the cache, respectively. The `Firewall_access_granted` count is 4 because of the `@@version_comment` statement sent by the **mysql** client each of the three times the registered account connected to the server, plus the `SHOW TABLES` statement that was not blocked in `DETECTING` mode.

###### Migrating Account Profiles to Group Profiles

The MySQL Enterprise Firewall plugin supports account profiles, each of which applies to a single account as well as group profiles which can each apply to multiple accounts. A group profile simplifies administration when the same allowlist is to be applied to multiple accounts: instead of creating one account profile per account and duplicating the allowlist across all of those profiles, you can create a single group profile and make the accounts members of it. The group allowlist then applies to all of the accounts.

A group profile with a single member account is logically equivalent to an account profile for that account, so it is possible to administer the firewall using group profiles exclusively, rather than a mix of account and group profiles. For new firewall installations, that is accomplished by uniformly creating new profiles as group profiles and avoiding account profiles.

Due to the greater flexibility offered by group profiles, it is recommended that all new firewall profiles be created as group profiles. Account profiles are deprecated, and subject to removal in a future MySQL version. (In addition, account profiles are not supported by the MySQL Enterprise Firewall component.) For upgrades from firewall installations which use account profiles, the MySQL Enterprise Firewall plugin includes a stored procedure named `sp_migrate_firewall_user_to_group()` to help you convert account profiles to group profiles. To use it, perform the following procedure as a user who has the `FIREWALL_ADMIN` privilege:

1. Run the `firewall_profile_migration.sql` script to install the `sp_migrate_firewall_user_to_group()` stored procedure. The script is located in the `share` directory of the MySQL installation.

   Specify the same firewall database name on the command line that you previously defined for your firewall installation. The example here specifies the system database, `mysql`.

   ```
   $> mysql -u root -p -D mysql < firewall_profile_migration.sql
   Enter password: (enter root password here)
   ```

   If you installed the MySQL Enterprise Firewall plugin using a custom schema, make the appropriate substitution for your system.

2. Identify which account profiles exist by querying the Information Schema `MYSQL_FIREWALL_USERS` table, like this:

   ```
   mysql> SELECT USERHOST FROM INFORMATION_SCHEMA.MYSQL_FIREWALL_USERS;
   +-------------------------------+
   | USERHOST                      |
   +-------------------------------+
   | admin@localhost               |
   | local_client@localhost        |
   | remote_client@abc.example.com |
   +-------------------------------+
   ```

3. For each account profile identified by the previous step, convert it to a group profile. Replace the `mysql` prefix with the actual firewall database name, if necessary:

   ```
   CALL mysql.sp_migrate_firewall_user_to_group('admin@localhost', 'admins');
   CALL mysql.sp_migrate_firewall_user_to_group('local_client@localhost', 'local_clients');
   CALL mysql.sp_migrate_firewall_user_to_group('remote_client@localhost', 'remote_clients');
   ```

   In each case, the account profile must exist and must not currently be in `RECORDING` mode, and the group profile must not already exist. The resulting group profile has the named account as its single enlisted member, which is also set as the group training account. The group profile operational mode is taken from the account profile operational mode.

4. (*Optional*:) Remove `sp_migrate_firewall_user_to_group()`:

   ```
   DROP PROCEDURE IF EXISTS mysql.sp_migrate_firewall_user_to_group;
   ```

   If you installed the MySQL Enterprise Firewall plugin using a custom schema, use it sname in place of `mysql` in the preceding statement.

For additional information about `sp_migrate_firewall_user_to_group()`, see Firewall Plugin Miscellaneous Stored Procedures.

##### 8.4.8.1.4 MySQL Enterprise Firewall Plugin Reference

The following sections provide a reference to the following MySQL Enterprise Firewall plugin elements:

* MySQL Enterprise Firewall Plugin Tables
* MySQL Enterprise Firewall Plugin Stored Procedures
* MySQL Enterprise Firewall Plugin Administrative Functions
* MySQL Enterprise Firewall Plugin System Variables
* MySQL Enterprise Firewall Plugin Status Variables

###### MySQL Enterprise Firewall Plugin Tables

The MySQL Enterprise Firewall plugin maintains profile information on a per-group and per-account basis, using tables in the firewall database for persistent storage, and Information Schema tables to provide views into in-memory cached data. When enabled, the firewall bases operational decisions on the cached data. The firewall database can be the `mysql` system database or one determined during installation (see Installing the MySQL Enterprise Firewall Plugin).

Tables in the firewall database are covered in this section. For information about MySQL Enterprise Firewall plugin Information Schema tables, see Section 28.7, “INFORMATION_SCHEMA MySQL Enterprise Firewall Plugin Tables”; for information about MySQL Enterprise Firewall Performance Schema tables, see Section 29.12.17, “Performance Schema Firewall Tables”.

* Firewall Group Profile Tables
* Firewall Account Profile Tables

###### Firewall Group Profile Tables

The MySQL Enterprise Firewall plugin maintains group profile information using tables in the firewall database (`mysql` or custom) for persistent storage and Performance Schema tables to provide views into in-memory cached data.

Each firewall and Performance Schema table is accessible only by accounts that have the `SELECT` privilege for that table.

The `firewall-database.firewall_groups` table lists names and operational modes of registered firewall group profiles. The table has the following columns (with the corresponding Performance Schema `firewall_groups` table having similar but not necessarily identical columns):

* `NAME`

  The group profile name.

* `MODE`

  The current operational mode for the profile. Permitted mode values are `OFF`, `DETECTING`, `PROTECTING`, and `RECORDING`. For information about their meanings, see Firewall Concepts.

* `USERHOST`

  The training account for the group profile, to be used when the profile is in `RECORDING` mode. The value is `NULL`, or an account in the format `user_name@host_name`:

  + If the value is `NULL`, the firewall records allowlist rules for statements received from any account that is a member of the group.

  + If the value is not `NULL`, the firewall records allowlist rules only for statements received from the named account (which should be a member of the group).

The `firewall-database.firewall_group_allowlist` table lists allowlist rules of registered firewall group profiles. The table has the following columns (with the corresponding Performance Schema `firewall_group_allowlist` table having similar but not necessarily identical columns):

* `NAME`

  The group profile name.

* `RULE`

  A normalized statement indicating an acceptable statement pattern for the profile. A profile allowlist is the union of its rules.

* `ID`

  A unique integer; the table's primary key.

The `firewall-database.firewall_membership` table lists the members (accounts) of registered firewall group profiles. The table has the following columns (with the corresponding Performance Schema `firewall_membership` table having similar but not necessarily identical columns):

* `GROUP_ID`

  The group profile name.

* `MEMBER_ID`

  The name of an account that is a member of the profile.

###### Firewall Account Profile Tables

MySQL Enterprise Firewall maintains account profile information using tables in the firewall database for persistent storage and `INFORMATION_SCHEMA` tables to provide views into in-memory cached data. The firewall database can be the `mysql` system database or a custom schema (see Installing the MySQL Enterprise Firewall Plugin).

Each default database table is accessible only by accounts that have the `SELECT` privilege for it. The `INFORMATION_SCHEMA` tables are accessible by anyone.

These tables are deprecated, and subject to removal in a future MySQL version. See Migrating Account Profiles to Group Profiles.

The `firewall-database.firewall_users` table lists names and operational modes of registered firewall account profiles. The table has the following columns (with the corresponding `MYSQL_FIREWALL_USERS` table having similar but not necessarily identical columns):

* `USERHOST`

  The account profile, in the format `user_name@host_name`.

* `MODE`

  The profile's current operational mode. Permitted mode values are `OFF`, `DETECTING`, `PROTECTING`, `RECORDING`, and `RESET`. For information about their meanings, see Firewall Concepts.

The `firewall-database.firewall_whitelist` table lists allowlist rules of registered firewall account profiles. The table has the following columns (with the corresponding `MYSQL_FIREWALL_WHITELIST` table having similar but not necessarily identical columns):

* `USERHOST`

  The account profile name, using the format `user_name@host_name`.

* `RULE`

  A normalized statement indicating an acceptable statement pattern for the profile. A profile allowlist is the union of its rules.

* `ID`

  Unique identifier (integer); this table's primary key.

###### MySQL Enterprise Firewall Plugin Stored Procedures

MySQL Enterprise Firewall plugin stored procedures perform tasks such as registering profiles with the firewall, establishing their operational mode, and managing transfer of firewall data between the cache and persistent storage. These procedures invoke administrative functions that provide an API for lower-level tasks.

Firewall stored procedures are created in the firewall database, which can be the `mysql` or other database (see Installing the MySQL Enterprise Firewall Plugin).

To invoke a firewall stored procedure, either do so while the specified firewall database is the default database, or qualify the procedure name with the database name. For example, if `mysql` is the firewall database:

```
CALL mysql.sp_set_firewall_group_mode(group, mode);
```

Firewall stored procedures are transactional; if an error occurs during execution of a firewall stored procedure, all changes made by it up to that point are rolled back, and an error is reported.

Note

If you have installed MySQL Enterprise Firewall in a custom schema, use its name in place of `mysql` when invoking firewall plugin stored procedures. For example, if the firewall is installed in the `fwdb` schema, then execute the stored procedure `sp_set_firewall_group_mode` like this:

```
CALL fwdb.sp_set_firewall_group_mode(group, mode);
```

* Firewall Group Profile Stored Procedures
* Firewall Plugin Account Profile Stored Procedures
* Firewall Plugin Miscellaneous Stored Procedures

###### Firewall Group Profile Stored Procedures

The stored procedures listed here perform management operations on firewall group profiles:

* `sp_firewall_group_delist(group, user)`

  This stored procedure removes an account from a firewall group profile.

  If the call succeeds, the change in group membership is made to both the in-memory cache and persistent storage.

  Arguments:

  + *`group`*: The name of the affected group profile.

  + *`user`*: The account to remove, as a string in `user_name@host_name` format.

  Example:

  ```
  CALL mysql.sp_firewall_group_delist('g', 'fwuser@localhost');
  ```

* `sp_firewall_group_enlist(group, user)`

  This stored procedure adds an account to a firewall group profile. It is not necessary to register the account itself with the firewall before adding the account to the group.

  If the call succeeds, the change in group membership is made to both the in-memory cache and persistent storage.

  Arguments:

  + *`group`*: The name of the affected group profile.

  + *`user`*: The account to add, as a string in `user_name@host_name` format.

  Example:

  ```
  CALL mysql.sp_firewall_group_enlist('g', 'fwuser@localhost');
  ```

* `sp_reload_firewall_group_rules(group)`

  This stored procedure provides control over firewall operation for individual group profiles. The procedure uses firewall administrative functions to reload the in-memory rules for a group profile from the rules stored in the `firewall-database.firewall_group_allowlist` table.

  Arguments:

  + *`group`*: The name of the affected group profile.

  Example:

  ```
  CALL mysql.sp_reload_firewall_group_rules('myapp');
  ```

  Warning

  This procedure clears the group profile in-memory allowlist rules before reloading them from persistent storage, and sets the profile mode to `OFF`. If the profile mode was not `OFF` prior to the `sp_reload_firewall_group_rules()` call, use `sp_set_firewall_group_mode()` to restore its previous mode after reloading the rules. For example, if the profile was in `PROTECTING` mode, that is no longer true after calling `sp_reload_firewall_group_rules()` and you must set it to `PROTECTING` again explicitly.

* `sp_set_firewall_group_mode(group, mode)`

  This stored procedure establishes the operational mode for a firewall group profile, after registering the profile with the firewall if it was not already registered. The procedure also invokes firewall administrative functions as necessary to transfer firewall data between the cache and persistent storage. This procedure may be called even if the `mysql_firewall_mode` system variable is `OFF`, although setting the mode for a profile has no operational effect until the firewall is enabled.

  If the profile previously existed, any recording limitation for it remains unchanged. To set or clear the limitation, call `sp_set_firewall_group_mode_and_user()` instead.

  Arguments:

  + *`group`*: The name of the affected group profile.

  + *`mode`*: The operational mode for the profile, as a string. Permitted mode values are `OFF`, `DETECTING`, `PROTECTING`, and `RECORDING`. For details about their meanings, see Firewall Concepts.

  Example:

  ```
  CALL mysql.sp_set_firewall_group_mode('myapp', 'PROTECTING');
  ```

* `sp_set_firewall_group_mode_and_user(group, mode, user)`

  This stored procedure registers a group with the firewall and establishes its operational mode, similar to `sp_set_firewall_group_mode()`, but also specifies the training account to be used when the group is in `RECORDING` mode.

  Arguments:

  + *`group`*: The name of the affected group profile.

  + *`mode`*: The operational mode for the profile, as a string. Permitted mode values are `OFF`, `DETECTING`, `PROTECTING`, and `RECORDING`. For details about their meanings, see Firewall Concepts.

  + *`user`*: The training account for the group profile, to be used when the profile is in `RECORDING` mode. The value is `NULL`, or a non-`NULL` account that has the format `user_name@host_name`:

    - If the value is `NULL`, the firewall records allowlist rules for statements received from any account that is a member of the group.

    - If the value is non-`NULL`, the firewall records allowlist rules only for statements received from the named account (which should be a member of the group).

  Example:

  ```
  CALL mysql.sp_set_firewall_group_mode_and_user('myapp', 'RECORDING', 'myapp_user1@localhost');
  ```

###### Firewall Plugin Account Profile Stored Procedures

The stored procedures listed here perform management operations on firewall account profiles:

* `sp_reload_firewall_rules(user)`

  This stored procedure provides control over firewall operation for individual account profiles. The procedure uses firewall administrative functions to reload the in-memory rules for an account profile from the rules stored in the `firewall-database.firewall_whitelist` table.

  Arguments:

  + *`user`*: The name of the affected account profile, as a string in `user_name@host_name` format.

  Example:

  ```
  CALL sp_reload_firewall_rules('fwuser@localhost');
  ```

  Warning

  This procedure clears the account profile in-memory allowlist rules before reloading them from persistent storage, and sets the profile mode to `OFF`. If the profile mode was not `OFF` prior to the `sp_reload_firewall_rules()` call, use `sp_set_firewall_mode()` to restore its previous mode after reloading the rules. For example, if the profile was in `PROTECTING` mode, that is no longer true after calling `sp_reload_firewall_rules()` and you must set it to `PROTECTING` again explicitly.

  This procedure is deprecated, and subject to removal in a future MySQL version. See Migrating Account Profiles to Group Profiles.

* `sp_set_firewall_mode(user, mode)`

  This stored procedure establishes the operational mode for a firewall account profile, after registering the profile with the firewall if it was not already registered. The procedure also invokes firewall administrative functions as necessary to transfer firewall data between the cache and persistent storage. This procedure may be called even if the `mysql_firewall_mode` system variable is `OFF`, although setting the mode for a profile has no operational effect until the firewall is enabled.

  Arguments:

  + *`user`*: The name of the affected account profile, as a string in `user_name@host_name` format.

  + *`mode`*: The operational mode for the profile, as a string. Permitted mode values are `OFF`, `DETECTING`, `PROTECTING`, `RECORDING`, and `RESET`. For details about their meanings, see Firewall Concepts.

  Switching an account profile to any mode but `RECORDING` synchronizes its firewall cache data to the firewall database tables that provide persistent underlying storage (`mysql` or custom). Switching the mode from `OFF` to `RECORDING` reloads the allowlist from the `firewall-database.firewall_whitelist` table into the cache.

  If an account profile has an empty allowlist, its mode cannot be set to `PROTECTING` because the profile would reject every statement, effectively prohibiting the account from executing statements. In response to such a mode-setting attempt, the firewall produces a diagnostic message that is returned as a result set rather than as an SQL error:

  ```
  mysql> CALL sp_set_firewall_mode('a@b','PROTECTING');
  +----------------------------------------------------------------------+
  | set_firewall_mode(arg_userhost, arg_mode)                            |
  +----------------------------------------------------------------------+
  | ERROR: PROTECTING mode requested for a@b but the allowlist is empty. |
  +----------------------------------------------------------------------+
  ```

  This procedure is deprecated, and subject to removal in a future MySQL version. See Migrating Account Profiles to Group Profiles.

###### Firewall Plugin Miscellaneous Stored Procedures

The stored procedures listed perform miscellaneous firewall management operations.

* `sp_migrate_firewall_user_to_group(user, group)`

  The `sp_migrate_firewall_user_to_group()` stored procedure converts a firewall account profile to a group profile with the account as its single enlisted member. Run the `firewall_profile_migration.sql` script to install it. The conversion procedure is discussed in Migrating Account Profiles to Group Profiles.

  This routine requires the `FIREWALL_ADMIN` privilege.

  Arguments:

  + *`user`*: The name of the account profile to convert to a group profile, as a string in `user_name@host_name` format. The account profile must exist, and must not currently be in `RECORDING` mode.

  + *`group`*: The name of the new group profile, which must not already exist. The new group profile has the named account as its single enlisted member, and that member is set as the group training account. The group profile operational mode is taken from the account profile operational mode.

  Example:

  ```
  CALL sp_migrate_firewall_user_to_group('fwuser@localhost', 'mygroup);
  ```

###### MySQL Enterprise Firewall Plugin Administrative Functions

MySQL Enterprise Firewall plugin administrative functions provide an API for lower-level tasks such as synchronizing the firewall cache with the underlying system tables.

*Under normal operation, these functions are invoked by the firewall stored procedures, not directly by users.* For that reason, these function descriptions do not include details such as information about their arguments and return types.

* Firewall Group Profile Functions
* Firewall Plugin Account Profile Functions
* Firewall Plugin Miscellaneous Functions

###### Firewall Group Profile Functions

These functions perform management operations on firewall group profiles:

* [`firewall_group_delist(group, user)`](firewall-plugin.html#pfunction_firewall-group-delist)

  This function removes an account from a group profile. It requires the `FIREWALL_ADMIN` privilege.

  Example:

  ```
  SELECT firewall_group_delist('g', 'fwuser@localhost');
  ```

* [`firewall_group_enlist(group, user)`](firewall-plugin.html#pfunction_firewall-group-enlist)

  This function adds an account to a group profile. It requires the `FIREWALL_ADMIN` privilege.

  It is not necessary to register the account itself with the firewall before adding the account to the group.

  Example:

  ```
  SELECT firewall_group_enlist('g', 'fwuser@localhost');
  ```

* [`read_firewall_group_allowlist(group, rule)`](firewall-plugin.html#pfunction_read-firewall-group-allowlist)

  This aggregate function updates the recorded-statement cache for the named group profile through a `SELECT` statement on the `firewall-database.firewall_group_allowlist` table. It requires the `FIREWALL_ADMIN` privilege.

  Example:

  ```
  SELECT read_firewall_group_allowlist('my_fw_group', fgw.rule)
  FROM mysql.firewall_group_allowlist AS fgw
  WHERE NAME = 'my_fw_group';
  ```

* [`read_firewall_groups(group, mode, user)`](firewall-plugin.html#pfunction_read-firewall-groups)

  This aggregate function updates the firewall group profile cache through a `SELECT` statement on the `firewall-database.firewall_groups` table. It requires the `FIREWALL_ADMIN` privilege.

  Example:

  ```
  SELECT read_firewall_groups('g', 'RECORDING', 'fwuser@localhost')
  FROM mysql.firewall_groups;
  ```

* [`set_firewall_group_mode(group, mode[, user])`](firewall-plugin.html#pfunction_set-firewall-group-mode)

  This function manages the group profile cache, establishes the profile operational mode, and optionally specifies the profile training account. It requires the `FIREWALL_ADMIN` privilege.

  If the optional *`user`* argument is not given, any previous *`user`* setting for the profile remains unchanged. To change the setting, call the function with a third argument.

  If the optional *`user`* argument is given, it specifies the training account for the group profile, to be used when the profile is in `RECORDING` mode. The value is `NULL`, or an account name in the format `user_name@host_name`:

  + If the value is `NULL`, the firewall records allowlist rules for statements received from any account that is a member of the group.

  + If the value is not `NULL`, the firewall records allowlist rules only for statements received from the named account (which should be a member of the group).

  Example:

  ```
  SELECT set_firewall_group_mode('g', 'DETECTING');
  ```

###### Firewall Plugin Account Profile Functions

The functions listed here perform management operations on firewall account profiles:

* [`read_firewall_users(user, mode)`](firewall-plugin.html#pfunction_read-firewall-users)

  This aggregate function updates the firewall account profile cache using a `SELECT` statement on the `firewall-database.firewall_users` table. It requires the `FIREWALL_ADMIN` privilege or the deprecated `SUPER` privilege.

  Example:

  ```
  SELECT read_firewall_users('fwuser@localhost', 'RECORDING')
  FROM mysql.firewall_users;
  ```

  This function is deprecated, and subject to removal in a future MySQL version. See Migrating Account Profiles to Group Profiles.

* [`read_firewall_whitelist(user, rule)`](firewall-plugin.html#pfunction_read-firewall-whitelist)

  This aggregate function updates the recorded statement cache for the named account profile through a `SELECT` statement on the `firewall-database.firewall_whitelist` table. It requires the `FIREWALL_ADMIN` privilege or the deprecated `SUPER` privilege.

  Example:

  ```
  SELECT read_firewall_whitelist('fwuser@localhost', fw.rule)
  FROM mysql.firewall_whitelist AS fw
  WHERE USERHOST = 'fwuser@localhost';
  ```

  This function is deprecated, and subject to removal in a future MySQL version. See Migrating Account Profiles to Group Profiles.

* [`set_firewall_mode(user, mode)`](firewall-plugin.html#pfunction_set-firewall-mode)

  This function manages the account profile cache and establishes the profile operational mode. It requires the `FIREWALL_ADMIN` privilege or the deprecated `SUPER` privilege.

  Example:

  ```
  SELECT set_firewall_mode('fwuser@localhost', 'RECORDING');
  ```

  This function is deprecated, and subject to removal in a future MySQL version. See Migrating Account Profiles to Group Profiles.

###### Firewall Plugin Miscellaneous Functions

The functions listed here perform miscellaneous firewall operations:

* `mysql_firewall_flush_status()`

  This function resets the following firewall plugin status variables to `0`:

  + `Firewall_access_denied`
  + `Firewall_access_granted`
  + `Firewall_access_suspicious`

  This function requires the `FIREWALL_ADMIN` privilege or the deprecated `SUPER` privilege.

  Example:

  ```
  SELECT mysql_firewall_flush_status();
  ```

* `normalize_statement(stmt)`

  This function normalizes an SQL statement into the digest form used for allowlist rules. It requires the `FIREWALL_ADMIN` privilege or the deprecated `SUPER` privilege.

  Example:

  ```
  SELECT normalize_statement('SELECT * FROM t1 WHERE c1 > 2');
  ```

  Note

  The same digest functionality is available from the `STATEMENT_DIGEST_TEXT()` SQL function.

###### MySQL Enterprise Firewall Plugin System Variables

The MySQL Enterprise Firewall plugin supports the following system variables for controlling various aspects of firewall operation. These variables are unavailable unless the firewall plugin is installed (see Section 8.4.8.1.2, “Installing or Uninstalling the MySQL Enterprise Firewall Plugin”).

* `mysql_firewall_database`

  <table frame="box" rules="all" summary="Properties for mysql_firewall_database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysql-firewall-database[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code>mysql_firewall_database</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>mysql</code></td> </tr></tbody></table>

  Specifies the database from which the MySQL Enterprise Firewall plugin reads data. Typically, the `MYSQL_FIREWALL` server-side plugin stores its internal data (tables, stored procedures, and functions) in the `mysql` system database, but you can create and use a custom schema instead (see Installing the MySQL Enterprise Firewall Plugin). This variable permits specifying an alternative database name at startup.

* `mysql_firewall_mode`

  <table frame="box" rules="all" summary="Properties for mysql_firewall_mode"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysql-firewall-mode[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code>mysql_firewall_mode</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  Whether the MySQL Enterprise Firewall plugin is enabled (the default) or disabled.

* `mysql_firewall_reload_interval_seconds`

  <table frame="box" rules="all" summary="Properties for mysql_firewall_reload_interval_seconds"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysql-firewall-reload-interval-seconds[=value]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code>mysql_firewall_reload_interval_seconds</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>60 (unless 0: OFF)</code></td> </tr><tr><th>Maximum Value</th> <td><code>INT_MAX</code></td> </tr><tr><th>Unit</th> <td>seconds</td> </tr></tbody></table>

  Specifies the interval (in seconds) that the server-side plugin uses to reload its internal cache from firewall tables. When `mysql_firewall_reload_interval_seconds` has a value of zero (the default), no periodic reloading of data from tables occurs at runtime. Values between `0` and `60` (1 to 59) are not acknowledged by the plugin. Instead, these values adjust to `60` automatically.

  This variable requires that the `scheduler` component be enabled (`ON`). For more information, see Scheduling Firewall Cache Reloads.

* `mysql_firewall_trace`

  <table frame="box" rules="all" summary="Properties for mysql_firewall_trace"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--mysql-firewall-trace[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code>mysql_firewall_trace</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Whether the MySQL Enterprise Firewall trace is enabled or disabled (the default). When `mysql_firewall_trace` is enabled, for `PROTECTING` mode, the firewall writes rejected statements to the error log.

###### MySQL Enterprise Firewall Plugin Status Variables

The MySQL Enterprise Firewall plugin supports the following status variables which provide information about the firewall's operational status. These variables are unavailable unless the firewall plugin is installed (see Section 8.4.8.1.2, “Installing or Uninstalling the MySQL Enterprise Firewall Plugin”). Firewall plugin status variables are set to `0` whenever the `MYSQL_FIREWALL` plugin is installed or the server is started. Many of them are reset to zero by the `mysql_firewall_flush_status()` function (see MySQL Enterprise Firewall Plugin Administrative Functions).

* `Firewall_access_denied`

  The number of statements rejected by the MySQL Enterprise Firewall plugin.

  Deprecated.

* `Firewall_access_granted`

  The number of statements accepted by the MySQL Enterprise Firewall plugin.

  Deprecated.

* `Firewall_access_suspicious`

  The number of statements logged by the MySQL Enterprise Firewall plugin as suspicious for users who are in `DETECTING` mode.

  Deprecated.

* `Firewall_cached_entries`

  The number of statements recorded by the MySQL Enterprise Firewall plugin, including duplicates.

  Deprecated.


#### 8.4.8.2 The MySQL Enterprise Firewall Component

* Purpose: Provide an application-level firewall enabling the database administrator to allow or block SQL statements based on matching them against accepted statement patterns.

* URN: `file://component_firewall`

More information about the firewall component, installing it (and performing similar operations with it), and using it can be found in the following sections, listed here:

* Section 8.4.8.2.1, “Elements of MySQL Enterprise Firewall (Component)”")
* Section 8.4.8.2.2, “MySQL Enterprise Firewall Component Installation”
* Section 8.4.8.2.3, “Using the MySQL Enterprise Firewall Component”
* Section 8.4.8.2.4, “MySQL Enterprise Firewall Component Reference”

##### 8.4.8.2.1 Elements of MySQL Enterprise Firewall (Component)

The MySQL Enterprise Firewall component is intended to replace the firewall plugin, which is now deprecated. The component-based version of MySQL Enterprise Firewall includes the following elements:

* The `component_firewall` component, which examines SQL statements before they execute and, based on registered firewall profiles, decides whether to execute or reject each statement.

* Performance Schema tables providing views into registered profiles. See Section 29.12.17, “Performance Schema Firewall Tables”.

* Profiles are cached in memory for better performance. Tables in the firewall database provide backing storage of firewall data for persistence of profiles across server restarts. The firewall database can be the `mysql` system database (the default) or one determined at install time (see Installing the MySQL Enterprise Firewall Component).

* Stored procedures perform tasks such as registering firewall profiles, establishing their operational modes, and managing transfer of firewall data between the cache and persistent storage. These are described in MySQL Enterprise Firewall Component Stored Procedures.

* Administrative functions provide an API for lower-level tasks such as synchronizing the cache with persistent storage. See MySQL Enterprise Firewall Component Functions, for more information.

* System variables and status variables specific to the firewall plugin enable firewall configuration and provide runtime operational information, respectively. For descriptions of these variables, see MySQL Enterprise Firewall Component System Variables, as well as MySQL Enterprise Firewall Component Status Variables.

* The `FIREWALL_ADMIN` privilege enables users to administer firewall rules for any user.

  The `FIREWALL_EXEMPT` privilege exempts a user from firewall restrictions. This is useful, for example, for any database administrator who configures the firewall, to avoid the possibility of a misconfiguration causing even the administrator to be locked out and unable to execute statements.

  Note

  The `FIREWALL_USER` privilege (deprecated) is not supported by the MySQL Enterprise Firewall component.

* The MySQL Enterprise Firewall component also provides a number of SQL scripts (in the installation `share` directory) which facilitate installation and removal of the component, as well as migrations between the firewall plugin and the component. MySQL Enterprise Firewall Component Scripts provides more information about these scripts; see also Section 8.4.8.2.2, “MySQL Enterprise Firewall Component Installation”, for help with using them.

##### 8.4.8.2.2 MySQL Enterprise Firewall Component Installation

This section covers topics relating to installation and configuration of the MySQL Enterprise Firewall component, including installation, removal, and migration between the firewall component and the firewall plugin (deprecated).

* Installing the MySQL Enterprise Firewall Component
* Uninstalling the MySQL Enterprise Firewall Component
* Upgrading to the MySQL Enterprise Firewall Component
* Downgrading the MySQL Enterprise Firewall Component

###### Installing the MySQL Enterprise Firewall Component

This section provides information about performing a new installation of the MySQL Enterprise Firewall component. If, instead, you wish to upgrade an existing plugin-based installation of MySQL Enterprise Firewall to use the firewall component, see Upgrading to the MySQL Enterprise Firewall Component.

Prior to beginning the installation, you must choose a location for the firewall database. While it is possible to use the `mysql` system database, we recommend that you use a separate, dedicated database for this purpose. For example, to install MySQL Enterprise Firewall to a new, not previously existing, database named `myfwdb`, execute the statements shown here in the **mysql** client:

```
mysql> CREATE DATABASE IF NOT EXISTS myfwdb;
Query OK, 1 row affected (0.01 sec)

mysql> USE myfwdb;
Database changed
```

To perform the installation, use `install_component_firewall.sql` from the `share` directory of your MySQL installation. This script installs the firewall database to the current database, so you should make sure that this is the case before proceeding, like this:

```
mysql> SELECT DATABASE();
+------------+
| DATABASE() |
+------------+
| myfwdb     |
+------------+
1 row in set (0.00 sec)
```

This script requires (and accepts) no arguments; simply run it using the **mysql** client `source` command, as shown here:

```
mysql> source ../share/install_component_firewall.sql
```

Adjust the path to the `share` directory as needed to match your installation layout. See Section 6.5.1.2, “mysql Client Commands”, and Section 6.5.1.5, “Executing SQL Statements from a Text File”, for more information about using the `source` command.

`install_component_firewall.sql` creates all tables, stored procedures, and server variables needed by the MySQL Enterprise Firewall component. The `component_firewall.database` server system variable is set to the name of the current database (and persisted), and the firewall is enabled, as you can see by checking the values of `component_firewall.database` and `component_firewall.enabled`, like this:

```
SELECT component_firewall.database, component_firewall.enabled;
+-----------------------------+----------------------------+
| component_firewall.database | component_firewall.enabled |
+-----------------------------+----------------------------+
|                      myfwdb |                         ON |
+-----------------------------+----------------------------+
1 row in set (0.00 sec)
```

###### Uninstalling the MySQL Enterprise Firewall Component

This section provides information about performing a complete removal of the MySQL Enterprise Firewall component and its related elements. For information about downgrading the component to the firewall plugin (deprecated), see Downgrading the MySQL Enterprise Firewall Component.

You can remove the MySQL Enterprise Firewall component from your MySQL installation using the supplied script `uninstall_component_firewall.sql` which can be found in the `share` directory.

Important

Before running `uninstall_component_firewall.sql`, you must insure that there are no other connections to the server. Use [`SHOW PROCESSLIST`](show-processlist.html "15.7.7.32 SHOW PROCESSLIST Statement") or query the Performance Schema `processlist` table to help you determine that this is the case.

After ensuring the the current database is the firewall database, execute this script from a **mysql** client session. In this example, we assume that the firewall database is named `myfwdb`:

```
SELECT @@component_firewall.database;
+-------------------------------+
| @@component_firewall.database |
+-------------------------------+
|                        myfwdb |
+-------------------------------+
1 row in set (0.00 sec)

mysql> USE myfwdb;
Database changed

mysql> SELECT DATABASE();
+------------+
| DATABASE() |
+------------+
| myfwdb     |
+------------+
1 row in set (0.00 sec)

mysql> source ../share/uninstall_component_firewall.sql
```

You may need to adjust the path to the `share` directory to match the layout of your installation. For more information, see Section 6.5.1.2, “mysql Client Commands”, as well as Section 6.5.1.5, “Executing SQL Statements from a Text File”.

###### Upgrading to the MySQL Enterprise Firewall Component

This section describes how to upgrade an existing MySQL Enterprise Firewall plugin installation to the firewall component.

You can perform an upgrade from the firewall plugin to the firewall component using the script `firewall_plugin_to_component.sql`, in the MySQL installation `share` directory. This script performs the following tasks:

* Migrates any plugin account profiles to group profiles with single users.

* Drops the plugin's stored procedures.
* Uninstalls all firewall plugins.
* Drops all tables not used by the component.
* Alters those tables remaining after the others are dropped to conform with the table definitions accepted by the firewall component.

* Translates plugin system variables to those used by the component and persists them. For example, the value of `mysql_firewall_database` is copied to `component_firewall.database`.

* Installs the firewall component.
* Creates the stored procedures used by the component.

Important

If the firewall plugin was loaded using `--plugin-load-add`, you must remove it from the list of plugins specified for that option prior to running `firewall_plugin_to_component.sql`.

To perform the upgrade, start a **mysql** client session and ensure that the current database is the firewall database (`mysql_firewall_database`). After this, simply run the script. This is shown here:

```
mysql> SELECT @@mysql_firewall_database;
+---------------------------+
| @@mysql_firewall.database |
+---------------------------+
|                    myfwdb |
+---------------------------+
1 row in set (0.00 sec)

mysql> USE myfwdb;
Database changed

mysql> SELECT DATABASE();
+------------+
| DATABASE() |
+------------+
| myfwdb     |
+------------+
1 row in set (0.00 sec)

mysql> source ../share/firewall_plugin_to_component.sql
```

We use `myfwdb` in the preceding example as the name of the firewall database; this value is almost certain to be different on your system. In addition, you may also need to adjust the path to the `share` directory.

###### Downgrading the MySQL Enterprise Firewall Component

This section describes how to downgrade an existing MySQL Enterprise Firewall component installation to the legacy firewall plugin (deprecated).

A downgrade from the firewall component to the firewall plugin consists of two parts:

* Preparation for the plugin and uninstallation of the firewall component

  This is performed by executing the SQL script `firewall_component_to_plugin.sql` in a **mysql** client session.

* Installation of the firewall plugin

  This is accomplished by running `linux_install_firewall.sql` or `win_install_firewall.sql` (also in the **mysql** client), depending on the platform.

`firewall_component_to_plugin.sql` must be run with the firewall database as the current database. You can ensure that this is the case, and then execute the script using the **mysql** client `source` command, as shown here:

```
SELECT @@component_firewall.database;
+-------------------------------+
| @@component_firewall.database |
+-------------------------------+
|                        myfwdb |
+-------------------------------+
1 row in set (0.00 sec)

mysql> USE myfwdb;
Database changed

mysql> SELECT DATABASE();
+------------+
| DATABASE() |
+------------+
| myfwdb     |
+------------+
1 row in set (0.00 sec)

mysql> source ../share/firewall_component_to_plugin.sql
```

The example shows `myfwdb` as the name of the firewall database; this is likely to be different on your system. Adjust the path shown here to the `share` directory as necessary to conform to the installation layout on your system.

`firewall_component_to_plugin.sql` terminates with the output shown here:

```
Restart mysqld with the following options:
--loose-mysql-firewall-database=database,
--loose-mysql-firewall-mode=mode,
--loose-mysql-firewall-reload-interval-seconds=seconds,
--loose-mysql-firewall-trace=trace,
and run win_install_firewall.sql or linux_install_firewall.sql on schema database.
```

Restart the MySQL server using the indicated options and values, then start a **mysql** client session and run `linux_install_firewall.sql` (Linux and other Unix platforms) or `win_install_firewall.sql` (Windows platforms). See Installing the MySQL Enterprise Firewall Plugin for more information about using these scripts to install the firewall plugin.

##### 8.4.8.2.3 Using the MySQL Enterprise Firewall Component

Before using the MySQL Enterprise Firewall component, install it according to the instructions provided in Section 8.4.8.2.2, “MySQL Enterprise Firewall Component Installation”.

This section describes how to configure the firewall component using SQL statements. Alternatively, MySQL Workbench 6.3.4 and later versions provide a graphical interface for firewall control. See MySQL Enterprise Firewall Interface.

* Enabling or Disabling the Firewall Plugin
* Scheduling Firewall Cache Reloads
* Assigning Firewall Privileges (Component)")
* Firewall Concepts
* Registering Firewall Profiles
* Monitoring the Firewall

###### Enabling or Disabling the Firewall Plugin

To enable or disable the firewall plugin, set the `component_firewall.enabled` system variable. By default, this is `ON` when the firewall component is installed. To set the initial firewall state explicitly at server startup, you can set the variable in an option file such as `my.cnf`, like this:

```
[mysqld]
component_firewall.enabled=ON
```

After modifying `my.cnf`, you must restart the server to cause the new setting to take effect. See Section 6.2.2.2, “Using Option Files”.

Alternatively, you can set and persist the firewall setting at runtime by executing either of the SQL statements shown here:

```
SET PERSIST component_firewall.enabled = OFF;
SET PERSIST component_firewall.enabled = ON;
```

[`SET PERSIST`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") sets a value for the running MySQL instance, and saves the value, causing it to carry over to subsequent server restarts. To change a value for the running MySQL instance without having it carry over to subsequent restarts, use the `GLOBAL` keyword rather than `PERSIST`. See Section 15.7.6.1, “SET Syntax for Variable Assignment”, for more information.

###### Scheduling Firewall Cache Reloads

Each time the firewall component initializes, it loads data into its internal cache from the following tables (see MySQL Enterprise Firewall Component Tables):

* `firewall_group_allowlist`
* `firewall_groups`
* `firewall_membership`

Without restarting the server or reinstalling the server-side plugin, modification of data outside of the plugin is not reflected internally. The `component_firewall.reload_interval_seconds` system variable makes it possible to force memory cache reloads from tables at specified intervals. By default, the interval value is `0`, which disables such reloads.

To schedule regular cache reloads, first ensure that the `scheduler` component is installed and enabled (see Section 7.5.5, “Scheduler Component”). To check the status of the component, use a `SHOW VARIABLES` statement similar to this one:

```
mysql> SHOW VARIABLES LIKE 'component_scheduler%';
+-----------------------------+-------+
| Variable_name               | Value |
+-----------------------------+-------|
| component_scheduler.enabled | On    |
+-----------------------------+-------+
```

With the firewall plugin installed, set `component_firewall.reload_interval_seconds` at server startup to a number between 60 and `INT_MAX`, whose value is platform-specific. Values in the range `1` to `59` (inclusive) are reset to 60, with a warning, as shown here:

```
$> mysqld [server-options] --component_firewall.reload_interval_seconds=40
...
2023-08-31T17:46:35.043468Z 0 [Warning] [MY-015031] [Server] Plugin MYSQL_FIREWALL
reported: 'Invalid reload interval specified: 40. Valid values are 0 (off) or
greater than or equal to 60. Adjusting to 60.'
...
```

Alternatively, to set and persist this value at startup, precede the variable name with the `PERSIST_ONLY` keyword or the `@@PERSIST_ONLY.` qualifier, like this:

```
SET PERSIST_ONLY component_firewall.reload_interval_seconds = 120;
SET @@PERSIST_ONLY.component_firewall.reload_interval_seconds = 120;
```

After performing this modification, restart the server to cause the new setting to take effect.

###### Assigning Firewall Privileges (Component)

After the firewall component has been installed and configured, you should grant appropriate privileges to the MySQL account or accounts to be used for administering it. The assignment of privileges depends on which firewall operations an account should be permitted to perform, as listed here:

* Grant the `FIREWALL_EXEMPT` privilege to any account that should be exempt from firewall restrictions. This is useful, for example, for a database administrator who configures the firewall, to avoid the possibility of a misconfiguration causing even the administrator to be locked out and unable to execute statements.

* Grant the `FIREWALL_ADMIN` privilege to any account that should have full administrative firewall access. (Some administrative firewall functions can be invoked by accounts that have `FIREWALL_ADMIN` *or* the deprecated `SUPER` privilege, as indicated in the individual function descriptions.)

* Grant the `EXECUTE` privilege for the stored procedures in the firewall database (see MySQL Enterprise Firewall Component Stored Procedures). These may invoke administrative functions, so stored procedure access also requires the privileges indicated earlier that are needed for those functions.

Note

The `FIREWALL_EXEMPT` and `FIREWALL_ADMIN` privileges can be granted only while the firewall is installed because those privileges are defined by `component_firewall`.

###### Firewall Concepts

The MySQL server permits clients to connect and receives from them SQL statements to be executed. If the firewall is enabled, the server passes to it each incoming statement that does not immediately fail with a syntax error. Based on whether the firewall accepts the statement, the server executes it or returns an error to the client. This section describes how the firewall accomplishes the task of accepting or rejecting statements.

* Firewall Profiles
* Firewall Statement Matching
* Profile Operational Modes
* Firewall Statement Handling When Multiple Profiles Apply

###### Firewall Profiles

The firewall uses a registry of profiles that determine whether to permit statement execution. Profiles have these attributes:

* An allowlist. The allowlist is the set of rules that defines which statements are acceptable to the profile.

* A current operational mode. The mode enables the profile to be used in different ways. For example: the profile can be placed in training mode to establish the allowlist; the allowlist can be used for restricting statement execution or intrusion detection; the profile can be disabled entirely.

* The firewall supports group profiles which can have multiple accounts as members, with the profile allowlist applying equally to all members.

Initially, no profiles exist, so by default, the firewall accepts all statements and has no effect on which statements MySQL accounts can execute. To apply firewall protective capabilities, explicit action is required. This includes the following steps:

* Register one or more profiles with the firewall.
* Train the firewall by establishing the allowlist for each profile; that is, the types of statements the profile permits clients to execute.

* Place the trained profiles in `PROTECTING` mode to harden MySQL against unauthorized statement execution. It does this first by associating each client session with a specific user name and host name combination, known as the *session account*. Then, for each client connection, the firewall uses the session account to determine which profile or profiles apply to incoming statements from this client, accepting only those statements which are permitted by the applicable profile allowlists.

Note

The firewall component does not support account profiles. For assistance with converting existing account profiles prior to upgrading from the firewall plugin, see Migrating Account Profiles to Group Profiles.

The profile-based protection afforded by the firewall enables implementation of strategies such as those listed here:

* If an application has unique protection requirements, have it use an account not used for any other purpose, and set up a group profile for that account.

* If related applications share protection requirements, associate each application with its own account, then add these application accounts as members of the same group profile.

###### Firewall Statement Matching

Statement matching performed by the firewall does not use SQL statements as received from clients. Instead, the server converts incoming statements to normalized digest form and firewall operation uses these digests. The benefit of statement normalization is that it enables similar statements to be grouped and recognized using a single pattern. For example, these statements are distinct from each other:

```
SELECT first_name, last_name FROM customer WHERE customer_id = 1;
select first_name, last_name from customer where customer_id = 99;
SELECT first_name, last_name FROM customer WHERE customer_id = 143;
```

But all of them have the same normalized digest form, shown here:

```
SELECT `first_name` , `last_name` FROM `customer` WHERE `customer_id` = ?
```

By using normalization, firewall allowlists can store digests that each match many different statements received from clients. For more information about normalization and digests, see Section 29.10, “Performance Schema Statement Digests and Sampling”.

Warning

Setting `max_digest_length` to `0` disables digest production, which also disables server functionality that requires digests, such as MySQL Enterprise Firewall.

###### Profile Operational Modes

Each profile registered with the firewall has its own operational mode, chosen from the following values:

* `OFF`: Disables the profile. The firewall considers the profile inactive and ignores it.

* `RECORDING`: Firewall training mode. Incoming statements received from a client that matches the profile are considered acceptable for the profile and become part of its “fingerprint”. The firewall records the normalized digest form of each statement to learn the acceptable statement patterns for the profile. Each pattern is a rule; the profile allowlist consists of the union of all such rules.

* `PROTECTING`: The profile allows or prevents statement execution. The firewall matches incoming statements against the profile allowlist, accepting only statements that match and rejecting those that do not. After training a profile in `RECORDING` mode, switch it to `PROTECTING` mode to harden MySQL against access by statements that deviate from the allowlist. If the `component_firewall.trace` system variable is enabled, the firewall also writes any rejected statements to the error log.

* `DETECTING`: Detects but not does not block intrusions (statements that are suspicious because they match nothing in the profile allowlist). In `DETECTING` mode, the firewall writes suspicious statements to the error log but accepts them without denying access.

When a profile is assigned any of the preceding mode values, the firewall stores the mode in the profile. Firewall mode-setting operations also permit the mode value `RESET`, but this value is not stored: setting a given profile to `RESET` mode causes the firewall to delete all rules for this profile, and then set its mode to `OFF`.

Note

Messages written to the error log in `DETECTING` mode or because `mysql_firewall_trace` is enabled are written as Notes, which are information messages. To ensure that such messages appear in the error log and are not discarded, make sure that error-logging verbosity is sufficient to include information messages. For example, if you are using priority-based log filtering, as described in Section 7.4.2.5, “Priority-Based Error Log Filtering (log_filter_internal)”"), set `log_error_verbosity` to `3`.

###### Firewall Statement Handling When Multiple Profiles Apply

For simplicity, later sections that describe how to set up profiles take the perspective that the firewall matches incoming statements from a client against only a single profile, either a group profile or account profile. But firewall operation can be more complex:

* A group profile can include multiple accounts as members.

* An account can be a member of multiple group profiles.
* Multiple profiles can match a given client.

The following description covers the general case of how the firewall operates, when potentially multiple profiles apply to incoming statements.

As previously mentioned, MySQL associates each client session with a specific user name and host name combination known as the *session account*. The firewall matches the session account against registered profiles to determine which profiles apply to handling incoming statements from the session:

* The firewall ignores inactive profiles (profiles with a mode of `OFF`).

* The session account matches every active group profile that includes a member having the same user and host. There can be more than one such group profile.

* The session account matches an active account profile having the same user and host, if there is one. There is at most one such account profile.

In other words, the session account can match 0 or more active group profiles, and 0 or 1 active account profiles. This means that 0, 1, or multiple firewall profiles are applicable to a given session, for which the firewall handles each incoming statement as follows:

* If there is no applicable profile, the firewall imposes no restrictions and accepts the statement.

* If there are applicable profiles, their modes determine statement handling:

  + The firewall records the statement in the allowlist of each applicable profile that is in `RECORDING` mode.

  + The firewall writes the statement to the error log for each applicable profile in `DETECTING` mode for which the statement is suspicious (does not match the profile allowlist).

  + The firewall accepts the statement if at least one applicable profile is in `RECORDING` or `DETECTING` mode (those modes accept all statements), or if the statement matches the allowlist of at least one applicable profile in `PROTECTING` mode. Otherwise, the firewall rejects the statement (and writes it to the error log if the `mysql_firewall_trace` system variable is enabled).

With that description in mind, the next sections revert to the simplicity of the situations when a single group profile or a single account profile apply, and cover how to set up each type of profile.

###### Registering Firewall Profiles

MySQL Enterprise Firewall supports registration of group profiles. A group profile can have multiple accounts as its members. To use a firewall group profile to protect MySQL against incoming statements from a given account, follow these steps:

1. Register the profile and put it in `RECORDING` mode.

2. Add a member account to the profile.
3. Connect to the MySQL server using this member account and execute statements to be learned. This trains the profile and establishes the rules that form the profile allowlist.

4. Add any other accounts that are to be group members to the profile.

5. Switch the profile to `PROTECTING` mode. When a client connects to the server using any account that is a member of the group, the profile allowlist restricts statement execution.

6. Should additional training be necessary, switch the profile to `RECORDING` mode again, update its allowlist with new statement patterns, then switch it back to `PROTECTING` mode.

Observe these guidelines for account references relating to the MySQL Enterprise Firewall plugin:

* Take note of the context in which account references occur. To name an account for firewall operations, specify it as a single quoted string (`'user_name@host_name'`). This differs from the usual MySQL convention for statements such as [`CREATE USER`](create-user.html "15.7.1.3 CREATE USER Statement") and `GRANT`, for which you quote the user and host parts of an account name separately (`'user_name'@'host_name'`).

  The requirement for naming accounts as a single quoted string for firewall operations means that you cannot use any account whose user name contains the `@` character.

* The firewall assesses statements against accounts represented by actual user and host names as authenticated by the server. When registering accounts in profiles, do not use wildcard characters or netmasks. The reasons for this are described here:

  + Suppose that an account named `me@%.example.org` exists and a client uses it to connect to the server from the host `abc.example.org`.

  + The account name contains a `%` wildcard character, but the server authenticates the client as having the user name `me` and host name `abc.example.com`, and that is what the firewall sees.

  + Consequently, the account name to use for firewall operations is `me@abc.example.org` rather than `me@%.example.org`.

The following procedure shows how to register a group profile with the firewall, train the firewall to know the acceptable statements for that profile (its allowlist), use the profile to protect MySQL against execution of unacceptable statements, and add and remove group members. The example uses the group profile name `fwgrp`. The example profile is presumed for use by clients of an application that accesses tables in the `sakila` database (available at https://dev.mysql.com/doc/index-other.html).

Use an administrative MySQL account to perform the steps in this procedure, except those steps designated for execution by member accounts of the firewall group profile. For statements executed by member accounts, the default database should be `sakila`. (You can use a different database by adjusting the instructions accordingly.)

1. If necessary, create the accounts that are to be members of the `fwgrp` group profile and grant them appropriate access privileges. Statements for one member are shown here (choose an appropriate password):

   ```
   CREATE USER 'member1'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL ON sakila.* TO 'member1'@'localhost';
   ```

2. Use the stored procedure `set_firewall_group_mode()` to register the group profile with the firewall and place the profile in `RECORDING` (training) mode, as shown here:

   ```
   CALL firewall-database.set_firewall_group_mode('fwgrp', 'RECORDING');
   ```

3. Use the stored procedure `firewall_group_enlist()` to add an initial member account for use in training the group profile allowlist:

   ```
   CALL firewall-database.firewall_group_enlist('fwgrp', 'member1@localhost');
   ```

4. To train the group profile using the initial member account, connect to the server as `member1` from the server host so that the firewall sees a session account for `member1@localhost`. Then execute some statements to be considered legitimate for the profile. For example:

   ```
   SELECT title, release_year FROM film WHERE film_id = 1;
   UPDATE actor SET last_update = NOW() WHERE actor_id = 1;
   SELECT store_id, COUNT(*) FROM inventory GROUP BY store_id;
   ```

   The firewall receives the statements from the `member1@localhost` account. Because that account is a member of the `fwgrp` profile, which is in `RECORDING` mode, the firewall interprets the statements as applicable to `fwgrp` and records the normalized digest form of the statements as rules in the `fwgrp` allowlist. Those rules then apply to all accounts that are members of `fwgrp`.

   Note

   Until the `fwgrp` group profile receives statements in `RECORDING` mode, its allowlist is empty, which is equivalent to “deny all” and means that no statement can match. This has the following implications:

   * The group profile cannot be switched to `PROTECTING` mode, since it would then reject every statement, effectively prohibiting the accounts that are group members from executing any statements whatsoever.

   * The group profile can be switched to `DETECTING` mode. In this case, the profile accepts every statement but logs it as suspicious.

5. At this point, the group profile information is cached, including its name, membership, and allowlist. To see this information, query the Performance Schema firewall tables, like this:

   ```
   mysql> SELECT MODE FROM performance_schema.firewall_groups
       -> WHERE NAME = 'fwgrp';
   +-----------+
   | MODE      |
   +-----------+
   | RECORDING |
   +-----------+

   mysql> SELECT * FROM performance_schema.firewall_membership
       -> WHERE GROUP_ID = 'fwgrp' ORDER BY MEMBER_ID;
   +----------+-------------------+
   | GROUP_ID | MEMBER_ID         |
   +----------+-------------------+
   | fwgrp    | member1@localhost |
   +----------+-------------------+

   mysql> SELECT RULE FROM performance_schema.firewall_group_allowlist
       -> WHERE NAME = 'fwgrp';
   +----------------------------------------------------------------------+
   | RULE                                                                 |
   +----------------------------------------------------------------------+
   | SELECT @@`version_comment` LIMIT ?                                   |
   | UPDATE `actor` SET `last_update` = NOW ( ) WHERE `actor_id` = ?      |
   | SELECT `title` , `release_year` FROM `film` WHERE `film_id` = ?      |
   | SELECT `store_id` , COUNT ( * ) FROM `inventory` GROUP BY `store_id` |
   +----------------------------------------------------------------------+
   ```

   See Section 29.12.17, “Performance Schema Firewall Tables”, for more information about these tables.

   Note

   The `@@version_comment` rule comes from a statement sent automatically by the **mysql** client when it connects to the server.

   Important

   Train the firewall under conditions matching application use. For example, to determine server characteristics and capabilities, a given MySQL connector might send statements to the server at the beginning of each session. If an application normally is used through that connector, train the firewall using the connector, too. That enables those initial statements to become part of the allowlist for the group profile associated with the application.

6. Invoke `set_firewall_group_mode()` again to switch the group profile to `PROTECTING` mode:

   ```
   CALL firewall-database.set_firewall_group_mode('fwgrp', 'PROTECTING');
   ```

   Important

   Switching the group profile out of `RECORDING` mode synchronizes its cached data to the firewall database tables that provide persistent underlying storage. If you do not switch the mode for a profile that is being recorded, the cached data is not written to persistent storage and is lost when the server is restarted.

7. Add any other accounts that should be members of this group profile, like this:

   ```
   CALL firewall-database.firewall_group_enlist('fwgrp', 'member2@localhost');
   CALL firewall-database.firewall_group_enlist('fwgrp', 'member3@localhost');
   CALL firewall-database.firewall_group_enlist('fwgrp', 'member4@localhost');
   ```

   The profile allowlist trained using the `member1@localhost` account now also applies to the accounts just added.

8. To verify the updated group membership, query the `firewall_membership` table again:

   ```
   mysql> SELECT * FROM performance_schema.firewall_membership
       -> WHERE GROUP_ID = 'fwgrp' ORDER BY MEMBER_ID;
   +----------+-------------------+
   | GROUP_ID | MEMBER_ID         |
   +----------+-------------------+
   | fwgrp    | member1@localhost |
   | fwgrp    | member2@localhost |
   | fwgrp    | member3@localhost |
   | fwgrp    | member4@localhost |
   +----------+-------------------+
   ```

9. Test the group profile against the firewall by using any account in the group to execute some acceptable and unacceptable statements. The firewall matches each statement from this account against the profile allowlist and accepts or rejects it based on the result, as described here:

   * This statement is not identical to any of the training statements but produces the same normalized statement as one of them, so the firewall accepts it:

     ```
     mysql> SELECT title, release_year FROM film WHERE film_id = 98;
     +-------------------+--------------+
     | title             | release_year |
     +-------------------+--------------+
     | BRIGHT ENCOUNTERS |         2006 |
     +-------------------+--------------+
     ```

   * These statements match nothing in the allowlist, so the firewall rejects each one with an error:

     ```
     mysql> SELECT title, release_year FROM film WHERE film_id = 98 OR TRUE;
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> SHOW TABLES LIKE 'customer%';
     ERROR 1045 (28000): Statement was blocked by Firewall
     mysql> TRUNCATE TABLE mysql.slow_log;
     ERROR 1045 (28000): Statement was blocked by Firewall
     ```

   * If `component_firewall.trace` is enabled, the firewall also writes rejected statements to the error log. These log messages may be helpful in identifying the source of attacks, should that be necessary.

10. Should members need to be removed from the group profile, use the stored procedure `firewall_group_delist()`, like this:

    ```
    CALL firewall-database.firewall_group_delist('fwgrp', 'member3@localhost');
    ```

The firewall group profile now is trained for member accounts. When clients connect using any account in the group and attempt to execute statements, the profile protects MySQL against statements not matched by the profile allowlist.

The procedure just shown added only one member to the group profile before training its allowlist. Doing so provides better control over the training period by limiting which accounts can add new acceptable statements to the allowlist. Should additional training be necessary, you can switch the profile back to `RECORDING` mode, like this:

```
CALL firewall-database.set_firewall_group_mode('fwgrp', 'RECORDING');
```

You should keep in mind that this enables any member of the group to execute statements and to add them to the allowlist. To limit the additional training to a single group member, call `set_firewall_group_mode_and_user()` instead. This is like `set_firewall_group_mode()` but takes an additional argument specifying which account is permitted to train the profile in `RECORDING` mode. For example, to enable training only by `member4@localhost`, call `set_firewall_group_mode_and_user()` as shown here:

```
CALL firewall-database.set_firewall_group_mode_and_user('fwgrp', 'RECORDING', 'member4@localhost');
```

This enables additional training by the specified account without having to remove the other group members. (They can execute statements, but the statements are not added to the allowlist.) You should also keep in mind that, in `RECORDING` mode, the other members can execute *any* statement.

Note

To avoid unexpected behavior when a particular account is specified as the training account for a group profile, always ensure that account is a member of the group.

After the additional training, set the group profile back to `PROTECTING` mode, like this:

```
CALL firewall-database.set_firewall_group_mode('fwgrp', 'PROTECTING');
```

The training account established by `set_firewall_group_mode_and_user()` is saved in the group profile, so that the firewall remembers it in case more training is needed later. Thus, if you call `set_firewall_group_mode()` (which takes no training account argument), the current profile training account, `member4@localhost`, remains unchanged.

If desired, you can clear the training account, and enable all group members to perform training in `RECORDING` mode, by calling `set_firewall_group_mode_and_user()` and passing `NULL` for the account name, as shown here:

```
CALL firewall-database.set_firewall_group_mode_and_user('fwgrp', 'RECORDING', NULL);
```

It is possible to detect intrusions by logging nonmatching statements as suspicious without denying access. First, put the group profile in `DETECTING` mode, like this:

```
CALL firewall-database.set_firewall_group_mode('fwgrp', 'DETECTING');
```

Then, using a member account, execute a statement that does not match the group profile allowlist. In `DETECTING` mode, the firewall permits the nonmatching statement to execute, as shown here:

```
mysql> SHOW TABLES LIKE 'customer%';
+------------------------------+
| Tables_in_sakila (customer%) |
+------------------------------+
| customer                     |
| customer_list                |
+------------------------------+
```

In addition, the firewall writes a message to the error log.

To disable a group profile, change its mode to `OFF`, like this:

```
CALL firewall-database.set_firewall_group_mode('fwgrp', 'OFF');
```

To forget all training for a profile and disable it, reset it:

```
CALL firewall-database.sp_set_firewall_group_mode('fwgrp', 'RESET');
```

The reset operation causes the firewall to delete all rules for this profile, and to set its mode to `OFF`.

###### Monitoring the Firewall

You can assess firewall activity by examine its associated status variables. For example, after performing the procedure shown earlier to train and protect the `fwgrp` group profile (see Registering Firewall Profiles), these variables have the values shown in the output of this [`SHOW GLOBAL STATUS`](show-status.html "15.7.7.38 SHOW STATUS Statement") statement:

```
mysql> SHOW GLOBAL STATUS LIKE 'firewall%';
+----------------------------+-------+
| Variable_name              | Value |
+----------------------------+-------+
| firewall_access_denied     | 3     |
| firewall_access_granted    | 4     |
| firewall_access_suspicious | 1     |
| firewall_cached_entries    | 4     |
+----------------------------+-------+
```

These variables indicate the numbers of statements rejected, accepted, logged as suspicious, and added to the cache, respectively. `firewall_access_granted` is 4 due to the `@@version_comment` statement sent by the **mysql** client each of the three times the registered account connected to the server, plus the `SHOW TABLES` statement that was not blocked in `DETECTING` mode.

##### 8.4.8.2.4 MySQL Enterprise Firewall Component Reference

The following sections provide reference information for elements of the MySQL Enterprise Firewall component, including tables, stored routines, system and status variables, and SQL scripts.

* MySQL Enterprise Firewall Component Tables
* MySQL Enterprise Firewall Component Stored Procedures
* MySQL Enterprise Firewall Component Functions
* MySQL Enterprise Firewall Component System Variables
* MySQL Enterprise Firewall Component Status Variables
* MySQL Enterprise Firewall Component Scripts

###### MySQL Enterprise Firewall Component Tables

the MySQL Enterprise Firewall component maintains profile information on a per-group basis, using tables in the firewall database for persistent storage and Information Schema tables to provide views into in-memory cached data. When enabled, the firewall bases operational decisions on the cached data. The firewall database can be the `mysql` system database or one determined when installing the component (see Installing the MySQL Enterprise Firewall Component).

Tables in the firewall database are covered in this section. For information about MySQL Enterprise Firewall Performance Schema tables, see Section 29.12.17, “Performance Schema Firewall Tables”.

The MySQL Enterprise Firewall component maintains group profile information using tables in the firewall database for persistent storage, and Performance Schema tables to provide views into in-memory, cached data.

Each system and Performance Schema table is accessible only by accounts that have the `SELECT` privilege for it.

The `firewall-database.firewall_groups` table lists names and operational modes of registered firewall group profiles. The table has the following columns (with the corresponding Performance Schema `firewall_groups` table having similar but not necessarily identical columns):

* `NAME`

  The group profile name.

* `MODE`

  The current operational mode for the profile. Permitted mode values are `OFF`, `DETECTING`, `PROTECTING`, and `RECORDING`. For details about their meanings, see Firewall Concepts.

* `USERHOST`

  The training account for the group profile, to be used when the profile is in `RECORDING` mode. The value is `NULL`, or a non-`NULL` account that has the format `user_name@host_name`:

  + If the value is `NULL`, the firewall records allowlist rules for statements received from any account that is a member of the group.

  + If the value is non-`NULL`, the firewall records allowlist rules only for statements received from the named account (which should be a member of the group).

The `firewall-database.firewall_group_allowlist` table lists allowlist rules of registered firewall group profiles. The table has the following columns (with the corresponding Performance Schema `firewall_group_allowlist` table having similar but not necessarily identical columns):

* `NAME`

  The group profile name.

* `RULE`

  A normalized statement indicating an acceptable statement pattern for the profile. A profile allowlist is the union of its rules.

* `ID`

  An integer column that is a primary key for the table.

The `firewall-database.firewall_membership` table lists the members (accounts) of registered firewall group profiles. The table has the following columns (with the corresponding Performance Schema `firewall_membership` table having similar but not necessarily identical columns):

* `GROUP_ID`

  The group profile name.

* `MEMBER_ID`

  The name of an account that is a member of the profile.

###### MySQL Enterprise Firewall Component Stored Procedures

The MySQL Enterprise Firewall component provides the following stored procedures for performing management operations on firewall group profiles:

* `sp_firewall_group_delist(group, user)`

  This stored procedure removes an account from a firewall group profile.

  If the call succeeds, the change in group membership is made to both the in-memory cache and persistent storage.

  Arguments:

  + *`group`*: The name of the affected group profile.

  + *`user`*: The account to remove, as a string in `user_name@host_name` format.

  Example:

  ```
  CALL mysql.sp_firewall_group_delist('g', 'fwuser@localhost');
  ```

* `sp_firewall_group_enlist(group, user)`

  This stored procedure adds an account to a firewall group profile. It is not necessary to register the account itself with the firewall before adding the account to the group.

  If the call succeeds, the change in group membership is made to both the in-memory cache and persistent storage.

  Arguments:

  + *`group`*: The name of the affected group profile.

  + *`user`*: The account to add, as a string in `user_name@host_name` format.

  Example:

  ```
  CALL mysql.sp_firewall_group_enlist('g', 'fwuser@localhost');
  ```

* `sp_firewall_group_remove(name)`

  Removes the the group having the supplied name.

* `sp_firewall_group_rename(oldname, newname)`

  Renames the group named *`oldname`* to *`newname`*.

* `sp_reload_firewall_group_rules(group)`

  This stored procedure provides control over firewall operation for individual group profiles. The procedure uses firewall administrative functions to reload the in-memory rules for a group profile from the rules stored in the `firewall-database.firewall_group_allowlist` table.

  Arguments:

  + *`group`*: The name of the affected group profile.

  Example:

  ```
  CALL mysql.sp_reload_firewall_group_rules('myapp');
  ```

  Warning

  This procedure clears the group profile in-memory allowlist rules before reloading them from persistent storage, and sets the profile mode to `OFF`. If the profile mode was not `OFF` prior to the `sp_reload_firewall_group_rules()` call, use `sp_set_firewall_group_mode()` to restore its previous mode after reloading the rules. For example, if the profile was in `PROTECTING` mode, that is no longer true after calling `sp_reload_firewall_group_rules()` and you must set it to `PROTECTING` again explicitly.

* `sp_set_firewall_group_mode(group, mode)`

  This stored procedure establishes the operational mode for a firewall group profile, after registering the profile with the firewall if it was not already registered. The procedure also invokes firewall administrative functions as necessary to transfer firewall data between the cache and persistent storage. This procedure may be called even if the `mysql_firewall_mode` system variable is `OFF`, although setting the mode for a profile has no operational effect until the firewall is enabled.

  If the profile previously existed, any recording limitation for it remains unchanged. To set or clear the limitation, call `sp_set_firewall_group_mode_and_user()` instead.

  Arguments:

  + *`group`*: The name of the affected group profile.

  + *`mode`*: The operational mode for the profile, as a string. Permitted mode values are `OFF`, `DETECTING`, `PROTECTING`, and `RECORDING`. For details about their meanings, see Firewall Concepts.

  Example:

  ```
  CALL mysql.sp_set_firewall_group_mode('myapp', 'PROTECTING');
  ```

* `sp_set_firewall_group_mode_and_user(group, mode, user)`

  This stored procedure registers a group with the firewall and establishes its operational mode, similar to `sp_set_firewall_group_mode()`, but also specifies the training account to be used when the group is in `RECORDING` mode.

  Arguments:

  + *`group`*: The name of the affected group profile.

  + *`mode`*: The operational mode for the profile, as a string. Permitted mode values are `OFF`, `DETECTING`, `PROTECTING`, and `RECORDING`. For details about their meanings, see Firewall Concepts.

  + *`user`*: The training account for the group profile, to be used when the profile is in `RECORDING` mode. The value is `NULL`, or a non-`NULL` account that has the format `user_name@host_name`:

    - If the value is `NULL`, the firewall records allowlist rules for statements received from any account that is a member of the group.

    - If the value is non-`NULL`, the firewall records allowlist rules only for statements received from the named account (which should be a member of the group).

  Example:

  ```
  CALL mysql.sp_set_firewall_group_mode_and_user('myapp', 'RECORDING', 'myapp_user1@localhost');
  ```

###### MySQL Enterprise Firewall Component Functions

MySQL Enterprise Firewall administrative functions provide an API for lower-level tasks such as synchronizing the firewall cache with the underlying system tables.

*Under normal operation, these functions are invoked by the firewall stored procedures, not directly by users.* For that reason, these function descriptions do not include details such as information about their arguments and return types.

These functions perform management operations on firewall group profiles:

* [`firewall_group_delist(group, user)`](firewall-component.html#function_firewall-group-delist)

  This function removes an account from a group profile. It requires the `FIREWALL_ADMIN` privilege.

  Example:

  ```
  SELECT firewall_group_delist('g', 'fwuser@localhost');
  ```

* [`firewall_group_enlist(group, user)`](firewall-component.html#function_firewall-group-enlist)

  This function adds an account to a group profile. It requires the `FIREWALL_ADMIN` privilege.

  It is not necessary to register the account itself with the firewall before adding the account to the group.

  Example:

  ```
  SELECT firewall_group_enlist('g', 'fwuser@localhost');
  ```

* `mysql_firewall_flush_status()`

  This function resets several firewall status variables to 0:

  + `firewall_access_denied`
  + `firewall_access_granted`
  + `firewall_access_suspicious`

  This function requires the `FIREWALL_ADMIN` privilege or the deprecated `SUPER` privilege.

  Example:

  ```
  SELECT mysql_firewall_flush_status();
  ```

* [`read_firewall_group_allowlist(group, rule)`](firewall-component.html#function_read-firewall-group-allowlist)

  This aggregate function updates the recorded-statement cache for the named group profile through a `SELECT` statement on the `firewall-database.firewall_group_allowlist` table. It requires the `FIREWALL_ADMIN` privilege.

  Example:

  ```
  SELECT read_firewall_group_allowlist('my_fw_group', fgw.rule)
  FROM mysql.firewall_group_allowlist AS fgw
  WHERE NAME = 'my_fw_group';
  ```

* [`read_firewall_groups(group, mode, user)`](firewall-component.html#function_read-firewall-groups)

  This aggregate function updates the firewall group profile cache through a `SELECT` statement on the `firewall-database.firewall_groups` table. It requires the `FIREWALL_ADMIN` privilege.

  Example:

  ```
  SELECT read_firewall_groups('g', 'RECORDING', 'fwuser@localhost')
  FROM mysql.firewall_groups;
  ```

* [`set_firewall_group_mode(group, mode[, user])`](firewall-component.html#function_set-firewall-group-mode)

  This function manages the group profile cache, establishes the profile operational mode, and optionally specifies the profile training account. It requires the `FIREWALL_ADMIN` privilege.

  If the optional *`user`* argument is not given, any previous *`user`* setting for the profile remains unchanged. To change the setting, call the function with a third argument.

  If the optional *`user`* argument is given, it specifies the training account for the group profile, to be used when the profile is in `RECORDING` mode. The value is `NULL`, or a non-`NULL` account that has the format `user_name@host_name`:

  + If the value is `NULL`, the firewall records allowlist rules for statements received from any account that is a member of the group.

  + If the value is non-`NULL`, the firewall records allowlist rules only for statements received from the named account (which should be a member of the group).

  Example:

  ```
  SELECT set_firewall_group_mode('g', 'DETECTING');
  ```

###### MySQL Enterprise Firewall Component System Variables

The MySQL Enterprise Firewall component provides the system variables listed in this section. These variables are unavailable unless the component is installed (see Section 8.4.8.1.2, “Installing or Uninstalling the MySQL Enterprise Firewall Plugin”).

* `component_firewall.database`

  <table frame="box" rules="all" summary="Properties for component_firewall.database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>component_firewall.database</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>mysql</code></td> </tr></tbody></table>

  The name of the database used for MySQL Enterprise Firewall component tables. For more information about these tables, see MySQL Enterprise Firewall Component Tables.

* `component_firewall.enabled`

  <table frame="box" rules="all" summary="Properties for component_firewall.enabled"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>component_firewall.enabled</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  Whether the MySQL Enterprise Firewall component is enabled.

* `component_firewall.reload_interval_seconds`

  <table frame="box" rules="all" summary="Properties for component_firewall.reload_interval_seconds"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>component_firewall.reload_interval_seconds</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>60 (0 = no reload)</code></td> </tr><tr><th>Maximum Value</th> <td><code>INT_MAX</code></td> </tr><tr><th>Unit</th> <td>seconds</td> </tr></tbody></table>

  Time in seconds between reloads of the MySQL Enterprise Firewall internal cache. Set to 0 to disable. Values from 1 to 59 inclusive are rounded up to 60.

* `component_firewall.trace`

  <table frame="box" rules="all" summary="Properties for component_firewall.trace"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>System Variable</th> <td><code>component_firewall.trace</code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th><code>SET_VAR</code> Hint Applies</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Whether the firewall component trace is enabled or disabled (the default). When the trace is enabled, for `PROTECTING` mode, the firewall writes rejected statements to the error log.

###### MySQL Enterprise Firewall Component Status Variables

The MySQL Enterprise Firewall component provides the status variables listed in this section; you can them to obtain information about the firewall component's operational status.

Firewall component status variables are set to 0 whenever the component is installed or the server is started.

* `firewall_access_denied`

  The number of statements rejected by the MySQL Enterprise Firewall component.

* `firewall_access_granted`

  The number of statements accepted by the MySQL Enterprise Firewall component.

* `firewall_access_suspicious`

  The number of statements logged by the MySQL Enterprise Firewall component as suspicious for users in `DETECTING` mode.

* `firewall_cached_entries`

  The number of statements recorded by the MySQL Enterprise Firewall component, including duplicates.

###### MySQL Enterprise Firewall Component Scripts

This section contains information about SQL scripts provided by the MySQL Enterprise Firewall component.

* `install_component_firewall.sql`

  This script installs all elements of the MySQL Enterprise Firewall component, performing the steps listed here:

  1. Checks whether the firewall plugin is installed; if so, stops with an error.

  2. Creates the component tables (see MySQL Enterprise Firewall Component Tables).

  3. Installs the component.
  4. Creates the component's stored procedures (see MySQL Enterprise Firewall Component Stored Procedures.

  See Installing the MySQL Enterprise Firewall Component, for usage instructions.

* `firewall_plugin_to_component.sql`

  This script upgrades an existing firewall plugin installation to an installation of the firewall component. It performs the steps listed here:

  1. Runs `firewall_profile_migration.sql` (provided by the firewall plugin) to migrate account profiles to group profiles. (The firewall component does not support account profiles.)

  2. Uninstalls the firewall plugin using `uninstall_firewall.sql` (also provided by the firewall plugin).

  3. Drops the plugin's stored procedures and functions.

  4. Drops the `firewall_whitelist` and `firewall_users` tables.

  5. Installs the firewall component using `install_component_firewall.sql`, skipping the check for the plugin.

  Note

  If the firewall plugin was loaded using `--plugin-load-add`, you must remove it from that option prior to running the script.

  See Upgrading to the MySQL Enterprise Firewall Component, for additional information and instructions.

* `firewall_component_to_plugin.sql`

  This script can be used to perform a downgrade from the MySQL Enterprise Firewall component to the firewall plugin. `firewall_component_to_plugin.sql` performs the following actions:

  1. Uninstalls the firewall component using `uninstall_component_firewall.sql`.

  2. Drops the component's stored procedures and functions.

  3. Creates the `firewall_whitelist` and `firewall_users` tables.

  4. Creates the plugin's stored procedures and functions.

  See Downgrading the MySQL Enterprise Firewall Component, for usage and other information.

* `uninstall_component_firewall.sql`

  Run this script to remove an installation of the MySQL Enterprise Firewall component. The script performs the steps listed here:

  1. Uninstalls the firewall component tables.
  2. Drops the component's stored procedures and functions.

  3. Uninstalls the firewall component.

  For usage information, see Uninstalling the MySQL Enterprise Firewall Component.
