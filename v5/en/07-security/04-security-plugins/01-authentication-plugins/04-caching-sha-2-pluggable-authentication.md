#### 6.4.1.4 Caching SHA-2 Pluggable Authentication

MySQL provides two authentication plugins that implement SHA-256 hashing for user account passwords:

* `sha256_password`: Implements basic SHA-256 authentication.

* `caching_sha2_password`: Implements SHA-256 authentication (like `sha256_password`), but uses caching on the server side for better performance and has additional features for wider applicability. (In MySQL 5.7, `caching_sha2_password` is implemented only on the client side, as described later in this section.)

This section describes the caching SHA-2 authentication plugin, available as of MySQL 5.7.23. For information about the original basic (noncaching) plugin, see [Section 6.4.1.5, “SHA-256 Pluggable Authentication”](sha256-pluggable-authentication.html "6.4.1.5 SHA-256 Pluggable Authentication").

Important

In MySQL 5.7, the default authentication plugin is `mysql_native_password`. As of MySQL 8.0, the default authentication plugin is changed to `caching_sha2_password`. To enable MySQL 5.7 clients to connect to 8.0 and higher servers using accounts that authenticate with `caching_sha2_password`, the MySQL 5.7 client library and client programs support the `caching_sha2_password` client-side authentication plugin. This improves MySQL 5.7 client connect-capability compatibility with respect to MySQL 8.0 and higher servers, despite the differences in default authentication plugin.

Limiting `caching_sha2_password` support in MySQL 5.7 to the client-side plugin in the client library has these implications compared to MySQL 8.0:

* The `caching_sha2_password` server-side plugin is not implemented in MySQL 5.7.

* MySQL 5.7 servers do not support creating accounts that authenticate with `caching_sha2_password`.

* MySQL 5.7 servers do not implement system and status variables specific to `caching_sha2_password` server-side support: [`caching_sha2_password_auto_generate_rsa_keys`](/doc/refman/8.0/en/server-system-variables.html#sysvar_caching_sha2_password_auto_generate_rsa_keys), [`caching_sha2_password_private_key_path`](/doc/refman/8.0/en/server-system-variables.html#sysvar_caching_sha2_password_private_key_path), [`caching_sha2_password_public_key_path`](/doc/refman/8.0/en/server-system-variables.html#sysvar_caching_sha2_password_public_key_path), [`Caching_sha2_password_rsa_public_key`](/doc/refman/8.0/en/server-status-variables.html#statvar_Caching_sha2_password_rsa_public_key).

In addition, there is no support for MySQL 5.7 replicas to connect to MySQL 8.0 replication source servers using accounts that authenticate with `caching_sha2_password`. That would involve a source replicating to a replica with a version number lower than the source version, whereas sources normally replicate to replicas having a version equal to or higher than the source version.

Important

To connect to a MySQL 8.0 or higher server using an account that authenticates with the `caching_sha2_password` plugin, you must use either a secure connection or an unencrypted connection that supports password exchange using an RSA key pair, as described later in this section. Either way, the `caching_sha2_password` plugin uses MySQL's encryption capabilities. See [Section 6.3, “Using Encrypted Connections”](encrypted-connections.html "6.3 Using Encrypted Connections").

Note

In the name `sha256_password`, “sha256” refers to the 256-bit digest length the plugin uses for encryption. In the name `caching_sha2_password`, “sha2” refers more generally to the SHA-2 class of encryption algorithms, of which 256-bit encryption is one instance. The latter name choice leaves room for future expansion of possible digest lengths without changing the plugin name.

The `caching_sha2_password` plugin has these advantages, compared to `sha256_password`:

* On the server side, an in-memory cache enables faster reauthentication of users who have connected previously when they connect again. (This server-side behavior is implemented only in MySQL 8.0 and higher.)

* Support is provided for client connections that use the Unix socket-file and shared-memory protocols.

The following table shows the plugin name on the client side.

**Table 6.10 Plugin and Library Names for SHA-2 Authentication**

<table summary="Names for the plugin and library file used for SHA-2 password authentication."><thead><tr> <th>Plugin or File</th> <th>Plugin or File Name</th> </tr></thead><tbody><tr> <td>Client-side plugin</td> <td><code>caching_sha2_password</code></td> </tr><tr> <td>Library file</td> <td>None (plugin is built in)</td> </tr></tbody></table>

The following sections provide installation and usage information specific to caching SHA-2 pluggable authentication:

* [Installing SHA-2 Pluggable Authentication](caching-sha2-pluggable-authentication.html#caching-sha2-pluggable-authentication-installation "Installing SHA-2 Pluggable Authentication")
* [Using SHA-2 Pluggable Authentication](caching-sha2-pluggable-authentication.html#caching-sha2-pluggable-authentication-usage "Using SHA-2 Pluggable Authentication")
* [Cache Operation for SHA-2 Pluggable Authentication](caching-sha2-pluggable-authentication.html#caching-sha2-pluggable-authentication-cache-operation "Cache Operation for SHA-2 Pluggable Authentication")

For general information about pluggable authentication in MySQL, see [Section 6.2.13, “Pluggable Authentication”](pluggable-authentication.html "6.2.13 Pluggable Authentication").

##### Installing SHA-2 Pluggable Authentication

In MySQL 5.7, the `caching_sha2_password` plugin exists in client form. The client-side plugin is built into the `libmysqlclient` client library and is available to any program linked against `libmysqlclient`.

##### Using SHA-2 Pluggable Authentication

In MySQL 5.7, the `caching_sha2_password` client-side plugin enables connecting to MySQL 8.0 or higher servers using accounts that authenticate with the `caching_sha2_password` server-side plugin. The discussion here assumes that an account named `'sha2user'@'localhost'` exists on the MySQL 8.0 or higher server. For example, the following statement creates such an account, where *`password`* is the desired account password:

```sql
CREATE USER 'sha2user'@'localhost'
IDENTIFIED WITH caching_sha2_password BY 'password';
```

`caching_sha2_password` supports connections over secure transport. `caching_sha2_password` also supports encrypted password exchange using RSA over unencrypted connections if these conditions are satisfied:

* The MySQL 5.7 client library and client programs are compiled using OpenSSL, not yaSSL. `caching_sha2_password` works with distributions compiled using either package, but RSA support requires OpenSSL.

  Note

  It is possible to compile MySQL using yaSSL as an alternative to OpenSSL only prior to MySQL 5.7.28. As of MySQL 5.7.28, support for yaSSL is removed and all MySQL builds use OpenSSL.

* The MySQL 8.0 or higher server to which you wish to connect is configured to support RSA (using the RSA configuration procedure given later in this section).

RSA support has these characteristics, where all aspects that pertain to the server side require a MySQL 8.0 or higher server:

* On the server side, two system variables name the RSA private and public key-pair files: [`caching_sha2_password_private_key_path`](/doc/refman/8.0/en/server-system-variables.html#sysvar_caching_sha2_password_private_key_path) and [`caching_sha2_password_public_key_path`](/doc/refman/8.0/en/server-system-variables.html#sysvar_caching_sha2_password_public_key_path). The database administrator must set these variables at server startup if the key files to use have names that differ from the system variable default values.

* The server uses the [`caching_sha2_password_auto_generate_rsa_keys`](/doc/refman/8.0/en/server-system-variables.html#sysvar_caching_sha2_password_auto_generate_rsa_keys) system variable to determine whether to automatically generate the RSA key-pair files. See [Section 6.3.3, “Creating SSL and RSA Certificates and Keys”](creating-ssl-rsa-files.html "6.3.3 Creating SSL and RSA Certificates and Keys").

* The [`Caching_sha2_password_rsa_public_key`](/doc/refman/8.0/en/server-status-variables.html#statvar_Caching_sha2_password_rsa_public_key) status variable displays the RSA public key value used by the `caching_sha2_password` authentication plugin.

* Clients that are in possession of the RSA public key can perform RSA key pair-based password exchange with the server during the connection process, as described later.

* For connections by accounts that authenticate with `caching_sha2_password` and RSA key pair-based password exchange, the server does not send the RSA public key to clients by default. Clients can use a client-side copy of the required public key, or request the public key from the server.

  Use of a trusted local copy of the public key enables the client to avoid a round trip in the client/server protocol, and is more secure than requesting the public key from the server. On the other hand, requesting the public key from the server is more convenient (it requires no management of a client-side file) and may be acceptable in secure network environments.

  + For command-line clients, use the [`--server-public-key-path`](mysql-command-options.html#option_mysql_server-public-key-path) option to specify the RSA public key file. Use the [`--get-server-public-key`](mysql-command-options.html#option_mysql_get-server-public-key) option to request the public key from the server. The following programs support the two options: [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client"), [**mysqladmin**](mysqladmin.html "4.5.2 mysqladmin — A MySQL Server Administration Program"), [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files"), [**mysqlcheck**](mysqlcheck.html "4.5.3 mysqlcheck — A Table Maintenance Program"), [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program"), [**mysqlimport**](mysqlimport.html "4.5.5 mysqlimport — A Data Import Program"), [**mysqlpump**](mysqlpump.html "4.5.6 mysqlpump — A Database Backup Program"), [**mysqlshow**](mysqlshow.html "4.5.7 mysqlshow — Display Database, Table, and Column Information"), [**mysqlslap**](mysqlslap.html "4.5.8 mysqlslap — A Load Emulation Client"), **mysqltest**.

  + For programs that use the C API, call [`mysql_options()`](/doc/c-api/5.7/en/mysql-options.html) to specify the RSA public key file by passing the `MYSQL_SERVER_PUBLIC_KEY` option and the name of the file, or request the public key from the server by passing the `MYSQL_OPT_GET_SERVER_PUBLIC_KEY` option.

  In all cases, if the option is given to specify a valid public key file, it takes precedence over the option to request the public key from the server.

For clients that use the `caching_sha2_password` plugin, passwords are never exposed as cleartext when connecting to the MySQL 8.0 or higher server. How password transmission occurs depends on whether a secure connection or RSA encryption is used:

* If the connection is secure, an RSA key pair is unnecessary and is not used. This applies to TCP connections encrypted using TLS, as well as Unix socket-file and shared-memory connections. The password is sent as cleartext but cannot be snooped because the connection is secure.

* If the connection is not secure, an RSA key pair is used. This applies to TCP connections not encrypted using TLS and named-pipe connections. RSA is used only for password exchange between client and server, to prevent password snooping. When the server receives the encrypted password, it decrypts it. A scramble is used in the encryption to prevent repeat attacks.

* If a secure connection is not used and RSA encryption is not available, the connection attempt fails because the password cannot be sent without being exposed as cleartext.

As mentioned previously, RSA password encryption is available only if MySQL 5.7 was compiled using OpenSSL. The implication for clients from MySQL 5.7 distributions compiled using yaSSL is that, to use SHA-2 passwords, clients *must* use an encrypted connection to access the server. See [Section 6.3.1, “Configuring MySQL to Use Encrypted Connections”](using-encrypted-connections.html "6.3.1 Configuring MySQL to Use Encrypted Connections").

Assuming that MySQL 5.7 has been compiled using OpenSSL, use the following procedure to enable use of an RSA key pair for password exchange during the client connection process.

Important

Aspects of this procedure that pertain to server configuration must be done on the MySQL 8.0 or higher server to which you wish to connect using MySQL 5.7 clients, *not* on your MySQL 5.7 server.

1. Create the RSA private and public key-pair files using the instructions in [Section 6.3.3, “Creating SSL and RSA Certificates and Keys”](creating-ssl-rsa-files.html "6.3.3 Creating SSL and RSA Certificates and Keys").

2. If the private and public key files are located in the data directory and are named `private_key.pem` and `public_key.pem` (the default values of the [`caching_sha2_password_private_key_path`](/doc/refman/8.0/en/server-system-variables.html#sysvar_caching_sha2_password_private_key_path) and [`caching_sha2_password_public_key_path`](/doc/refman/8.0/en/server-system-variables.html#sysvar_caching_sha2_password_public_key_path) system variables), the server uses them automatically at startup.

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

3. Restart the server, then connect to it and check the [`Caching_sha2_password_rsa_public_key`](/doc/refman/8.0/en/server-status-variables.html#statvar_Caching_sha2_password_rsa_public_key) status variable value. The actual value differs from that shown here, but should be nonempty:

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

For this connection attempt by `sha2user`, the server determines that `caching_sha2_password` is the appropriate authentication plugin and invokes it (because that was the plugin specified at [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") time). The plugin finds that the connection is not encrypted and thus requires the password to be transmitted using RSA encryption. However, the server does not send the public key to the client, and the client provided no public key, so it cannot encrypt the password and the connection fails:

```sql
ERROR 2061 (HY000): Authentication plugin 'caching_sha2_password'
reported error: Authentication requires secure connection.
```

To request the RSA public key from the server, specify the [`--get-server-public-key`](mysql-command-options.html#option_mysql_get-server-public-key) option:

```sql
$> mysql --ssl-mode=DISABLED -u sha2user -p --get-server-public-key
Enter password: password
```

In this case, the server sends the RSA public key to the client, which uses it to encrypt the password and returns the result to the server. The plugin uses the RSA private key on the server side to decrypt the password and accepts or rejects the connection based on whether the password is correct.

Alternatively, if the client has a file containing a local copy of the RSA public key required by the server, it can specify the file using the [`--server-public-key-path`](mysql-command-options.html#option_mysql_server-public-key-path) option:

```sql
$> mysql --ssl-mode=DISABLED -u sha2user -p --server-public-key-path=file_name
Enter password: password
```

In this case, the client uses the public key to encrypt the password and returns the result to the server. The plugin uses the RSA private key on the server side to decrypt the password and accepts or rejects the connection based on whether the password is correct.

The public key value in the file named by the [`--server-public-key-path`](mysql-command-options.html#option_mysql_server-public-key-path) option should be the same as the key value in the server-side file named by the [`caching_sha2_password_public_key_path`](/doc/refman/8.0/en/server-system-variables.html#sysvar_caching_sha2_password_public_key_path) system variable. If the key file contains a valid public key value but the value is incorrect, an access-denied error occurs. If the key file does not contain a valid public key, the client program cannot use it.

Client users can obtain the RSA public key two ways:

* The database administrator can provide a copy of the public key file.

* A client user who can connect to the server some other way can use a `SHOW STATUS LIKE 'Caching_sha2_password_rsa_public_key'` statement and save the returned key value in a file.

##### Cache Operation for SHA-2 Pluggable Authentication

On the server side, the `caching_sha2_password` plugin uses an in-memory cache for faster authentication of clients who have connected previously. For MySQL 5.7, which supports only the `caching_sha2_password` client-side plugin, this server-side caching thus takes place on the MySQL 8.0 or higher server to which you connect using MySQL 5.7 clients. For information about cache operation, see [Cache Operation for SHA-2 Pluggable Authentication](/doc/refman/8.0/en/caching-sha2-pluggable-authentication.html#caching-sha2-pluggable-authentication-cache-operation), in the *MySQL 8.0 Reference Manual*.
