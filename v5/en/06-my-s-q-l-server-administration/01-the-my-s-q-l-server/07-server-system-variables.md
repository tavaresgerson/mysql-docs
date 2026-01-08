### 5.1.7 Server System Variables

The MySQL server maintains many system variables that affect its operation. Most system variables can be set at server startup using options on the command line or in an option file. Most of them can be changed dynamically at runtime using the [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") statement, which enables you to modify operation of the server without having to stop and restart it. Some variables are read-only, and their values are determined by the system environment, by how MySQL is installed on the system, or possibly by the options used to compile MySQL. Most system variables have a default value, but there are exceptions, including read-only variables. You can also use system variable values in expressions.

At runtime, setting a global system variable value requires the [`SUPER`](privileges-provided.html#priv_super) privilege. Setting a session system variable value normally requires no special privileges and can be done by any user, although there are exceptions. For more information, see [Section 5.1.8.1, “System Variable Privileges”](system-variable-privileges.html "5.1.8.1 System Variable Privileges")

There are several ways to see the names and values of system variables:

* To see the values that a server uses based on its compiled-in defaults and any option files that it reads, use this command:

  ```sql
  mysqld --verbose --help
  ```

* To see the values that a server uses based on only its compiled-in defaults, ignoring the settings in any option files, use this command:

  ```sql
  mysqld --no-defaults --verbose --help
  ```

* To see the current values used by a running server, use the [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") statement or the Performance Schema system variable tables. See [Section 25.12.13, “Performance Schema System Variable Tables”](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables").

This section provides a description of each system variable. For a system variable summary table, see [Section 5.1.4, “Server System Variable Reference”](server-system-variable-reference.html "5.1.4 Server System Variable Reference"). For more information about manipulation of system variables, see [Section 5.1.8, “Using System Variables”](using-system-variables.html "5.1.8 Using System Variables").

For additional system variable information, see these sections:

* [Section 5.1.8, “Using System Variables”](using-system-variables.html "5.1.8 Using System Variables"), discusses the syntax for setting and displaying system variable values.

* [Section 5.1.8.2, “Dynamic System Variables”](dynamic-system-variables.html "5.1.8.2 Dynamic System Variables"), lists the variables that can be set at runtime.

* Information on tuning system variables can be found in [Section 5.1.1, “Configuring the Server”](server-configuration.html "5.1.1 Configuring the Server").

* [Section 14.15, “InnoDB Startup Options and System Variables”](innodb-parameters.html "14.15 InnoDB Startup Options and System Variables"), lists `InnoDB` system variables.

* [Section 21.4.3.9.2, “NDB Cluster System Variables”](mysql-cluster-options-variables.html#mysql-cluster-system-variables "21.4.3.9.2 NDB Cluster System Variables"), lists system variables which are specific to NDB Cluster.

* For information on server system variables specific to replication, see [Section 16.1.6, “Replication and Binary Logging Options and Variables”](replication-options.html "16.1.6 Replication and Binary Logging Options and Variables").

Note

Some of the following variable descriptions refer to “enabling” or “disabling” a variable. These variables can be enabled with the [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") statement by setting them to `ON` or `1`, or disabled by setting them to `OFF` or `0`. Boolean variables can be set at startup to the values `ON`, `TRUE`, `OFF`, and `FALSE` (not case-sensitive), as well as `1` and `0`. See [Section 4.2.2.4, “Program Option Modifiers”](option-modifiers.html "4.2.2.4 Program Option Modifiers").

Some system variables control the size of buffers or caches. For a given buffer, the server might need to allocate internal data structures. These structures typically are allocated from the total memory allocated to the buffer, and the amount of space required might be platform dependent. This means that when you assign a value to a system variable that controls a buffer size, the amount of space actually available might differ from the value assigned. In some cases, the amount might be less than the value assigned. It is also possible for the server to adjust a value upward. For example, if you assign a value of 0 to a variable for which the minimal value is 1024, the server sets the value to 1024.

Values for buffer sizes, lengths, and stack sizes are given in bytes unless otherwise specified.

Note

Some system variable descriptions include a block size, in which case a value that is not an integer multiple of the stated block size is rounded down to the next lower multiple of the block size before being stored by the server, that is to [`FLOOR(value)`](mathematical-functions.html#function_floor) `* block_size`.

*Example*: Suppose that the block size for a given variable is given as 4096, and you set the value of the variable to 100000 (we assume that the variable's maximum value is greater than this number). Since 100000 / 4096 = 24.4140625, the server automatically lowers the value to 98304 (24 \* 4096) before storing it.

In some cases, the stated maximum for a variable is the maximum allowed by the MySQL parser, but is not an exact multiple of the block size. In such cases, the effective maximum is the next lower multiple of the block size.

*Example*: A system variable's maxmum value is shown as 4294967295 (232-1), and its block size is 1024. 4294967295 / 1024 = 4194303.9990234375, so if you set this variable to its stated maximum, the value actually stored is 4194303 \* 1024 = 4294966272.

Some system variables take file name values. Unless otherwise specified, the default file location is the data directory if the value is a relative path name. To specify the location explicitly, use an absolute path name. Suppose that the data directory is `/var/mysql/data`. If a file-valued variable is given as a relative path name, it is located under `/var/mysql/data`. If the value is an absolute path name, its location is as given by the path name.

* [`authentication_windows_log_level`](server-system-variables.html#sysvar_authentication_windows_log_level)

  <table frame="box" rules="all" summary="Properties for authentication_windows_log_level"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-log-level=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_log_level">authentication_windows_log_level</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>2</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4</code></td> </tr></tbody></table>

  This variable is available only if the `authentication_windows` Windows authentication plugin is enabled and debugging code is enabled. See [Section 6.4.1.8, “Windows Pluggable Authentication”](windows-pluggable-authentication.html "6.4.1.8 Windows Pluggable Authentication").

  This variable sets the logging level for the Windows authentication plugin. The following table shows the permitted values.

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>

* [`authentication_windows_use_principal_name`](server-system-variables.html#sysvar_authentication_windows_use_principal_name)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  This variable is available only if the `authentication_windows` Windows authentication plugin is enabled. See [Section 6.4.1.8, “Windows Pluggable Authentication”](windows-pluggable-authentication.html "6.4.1.8 Windows Pluggable Authentication").

  A client that authenticates using the `InitSecurityContext()` function should provide a string identifying the service to which it connects (*`targetName`*). MySQL uses the principal name (UPN) of the account under which the server is running. The UPN has the form `user_id@computer_name` and need not be registered anywhere to be used. This UPN is sent by the server at the beginning of authentication handshake.

  This variable controls whether the server sends the UPN in the initial challenge. By default, the variable is enabled. For security reasons, it can be disabled to avoid sending the server's account name to a client as cleartext. If the variable is disabled, the server always sends a `0x00` byte in the first challenge, the client does not specify *`targetName`*, and as a result, NTLM authentication is used.

  If the server fails to obtain its UPN (which happens primarily in environments that do not support Kerberos authentication), the UPN is not sent by the server and NTLM authentication is used.

* [`autocommit`](server-system-variables.html#sysvar_autocommit)

  <table frame="box" rules="all" summary="Properties for autocommit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_autocommit">autocommit</a></code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  The autocommit mode. If set to 1, all changes to a table take effect immediately. If set to 0, you must use [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") to accept a transaction or [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") to cancel it. If [`autocommit`](server-system-variables.html#sysvar_autocommit) is 0 and you change it to 1, MySQL performs an automatic [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") of any open transaction. Another way to begin a transaction is to use a [`START TRANSACTION`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") or [`BEGIN`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") statement. See [Section 13.3.1, “START TRANSACTION, COMMIT, and ROLLBACK Statements”](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements").

  By default, client connections begin with [`autocommit`](server-system-variables.html#sysvar_autocommit) set to 1. To cause clients to begin with a default of 0, set the global [`autocommit`](server-system-variables.html#sysvar_autocommit) value by starting the server with the [`--autocommit=0`](server-system-variables.html#sysvar_autocommit) option. To set the variable using an option file, include these lines:

  ```sql
  [mysqld]
  autocommit=0
  ```

* [`automatic_sp_privileges`](server-system-variables.html#sysvar_automatic_sp_privileges)

  <table frame="box" rules="all" summary="Properties for automatic_sp_privileges"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_automatic_sp_privileges">automatic_sp_privileges</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  When this variable has a value of 1 (the default), the server automatically grants the [`EXECUTE`](privileges-provided.html#priv_execute) and [`ALTER ROUTINE`](privileges-provided.html#priv_alter-routine) privileges to the creator of a stored routine, if the user cannot already execute and alter or drop the routine. (The [`ALTER ROUTINE`](privileges-provided.html#priv_alter-routine) privilege is required to drop the routine.) The server also automatically drops those privileges from the creator when the routine is dropped. If [`automatic_sp_privileges`](server-system-variables.html#sysvar_automatic_sp_privileges) is 0, the server does not automatically add or drop these privileges.

  The creator of a routine is the account used to execute the `CREATE` statement for it. This might not be the same as the account named as the `DEFINER` in the routine definition.

  If you start [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") with [`--skip-new`](server-options.html#option_mysqld_skip-new), [`automatic_sp_privileges`](server-system-variables.html#sysvar_automatic_sp_privileges) is set to `OFF`.

  See also [Section 23.2.2, “Stored Routines and MySQL Privileges”](stored-routines-privileges.html "23.2.2 Stored Routines and MySQL Privileges").

* [`auto_generate_certs`](server-system-variables.html#sysvar_auto_generate_certs)

  <table frame="box" rules="all" summary="Properties for auto_generate_certs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_auto_generate_certs">auto_generate_certs</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>

  This variable is available if the server was compiled using OpenSSL (see [Section 6.3.4, “SSL Library-Dependent Capabilities”](ssl-libraries.html "6.3.4 SSL Library-Dependent Capabilities")). It controls whether the server autogenerates SSL key and certificate files in the data directory, if they do not already exist.

  At startup, the server automatically generates server-side and client-side SSL certificate and key files in the data directory if the [`auto_generate_certs`](server-system-variables.html#sysvar_auto_generate_certs) system variable is enabled, no SSL options other than [`--ssl`](server-options.html#option_mysqld_ssl) are specified, and the server-side SSL files are missing from the data directory. These files enable secure client connections using SSL; see [Section 6.3.1, “Configuring MySQL to Use Encrypted Connections”](using-encrypted-connections.html "6.3.1 Configuring MySQL to Use Encrypted Connections").

  For more information about SSL file autogeneration, including file names and characteristics, see [Section 6.3.3.1, “Creating SSL and RSA Certificates and Keys using MySQL”](creating-ssl-rsa-files-using-mysql.html "6.3.3.1 Creating SSL and RSA Certificates and Keys using MySQL")

  The [`sha256_password_auto_generate_rsa_keys`](server-system-variables.html#sysvar_sha256_password_auto_generate_rsa_keys) system variable is related but controls autogeneration of RSA key-pair files needed for secure password exchange using RSA over unencypted connections.

* [`avoid_temporal_upgrade`](server-system-variables.html#sysvar_avoid_temporal_upgrade)

  <table frame="box" rules="all" summary="Properties for avoid_temporal_upgrade"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_avoid_temporal_upgrade">avoid_temporal_upgrade</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  This variable controls whether [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") implicitly upgrades temporal columns found to be in pre-5.6.4 format ([`TIME`](time.html "11.2.3 The TIME Type"), [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"), and [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") columns without support for fractional seconds precision). Upgrading such columns requires a table rebuild, which prevents any use of fast alterations that might otherwise apply to the operation to be performed.

  This variable is disabled by default. Enabling it causes [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") not to rebuild temporal columns and thereby be able to take advantage of possible fast alterations.

  This variable is deprecated; expect it to be removed in a future release of MySQL.

* [`back_log`](server-system-variables.html#sysvar_back_log)

  <table frame="box" rules="all" summary="Properties for back_log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--back-log=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_back_log">back_log</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>

  The number of outstanding connection requests MySQL can have. This comes into play when the main MySQL thread gets very many connection requests in a very short time. It then takes some time (although very little) for the main thread to check the connection and start a new thread. The [`back_log`](server-system-variables.html#sysvar_back_log) value indicates how many requests can be stacked during this short time before MySQL momentarily stops answering new requests. You need to increase this only if you expect a large number of connections in a short period of time.

  In other words, this value is the size of the listen queue for incoming TCP/IP connections. Your operating system has its own limit on the size of this queue. The manual page for the Unix `listen()` system call should have more details. Check your OS documentation for the maximum value for this variable. [`back_log`](server-system-variables.html#sysvar_back_log) cannot be set higher than your operating system limit.

  The default value is based on the following formula, capped to a limit of 900:

  ```sql
  50 + (max_connections / 5)
  ```

* [`basedir`](server-system-variables.html#sysvar_basedir)

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>

  The path to the MySQL installation base directory.

* [`big_tables`](server-system-variables.html#sysvar_big_tables)

  <table frame="box" rules="all" summary="Properties for big_tables"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_big_tables">big_tables</a></code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  If enabled, the server stores all temporary tables on disk rather than in memory. This prevents most `The table tbl_name is full` errors for [`SELECT`](select.html "13.2.9 SELECT Statement") operations that require a large temporary table, but also slows down queries for which in-memory tables would suffice.

  The default value for new connections is `OFF` (use in-memory temporary tables). Normally, it should never be necessary to enable this variable because the server is able to handle large result sets automatically by using memory for small temporary tables and switching to disk-based tables as required.

* [`bind_address`](server-system-variables.html#sysvar_bind_address)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>0

  The MySQL server listens on a single network socket for TCP/IP connections. This socket is bound to a single address, but it is possible for an address to map onto multiple network interfaces. To specify an address, set [`bind_address=addr`](server-system-variables.html#sysvar_bind_address) at server startup, where *`addr`* is an IPv4 or IPv6 address or a host name. If *`addr`* is a host name, the server resolves the name to an IP address and binds to that address. If a host name resolves to multiple IP addresses, the server uses the first IPv4 address if there are any, or the first IPv6 address otherwise.

  The server treats different types of addresses as follows:

  + If the address is `*`, the server accepts TCP/IP connections on all server host IPv4 interfaces, and, if the server host supports IPv6, on all IPv6 interfaces. Use this address to permit both IPv4 and IPv6 connections on all server interfaces. This value is the default.

  + If the address is `0.0.0.0`, the server accepts TCP/IP connections on all server host IPv4 interfaces.

  + If the address is `::`, the server accepts TCP/IP connections on all server host IPv4 and IPv6 interfaces.

  + If the address is an IPv4-mapped address, the server accepts TCP/IP connections for that address, in either IPv4 or IPv6 format. For example, if the server is bound to `::ffff:127.0.0.1`, clients can connect using `--host=127.0.0.1` or `--host=::ffff:127.0.0.1`.

  + If the address is a “regular” IPv4 or IPv6 address (such as `127.0.0.1` or `::1`), the server accepts TCP/IP connections only for that IPv4 or IPv6 address.

  If binding to the address fails, the server produces an error and does not start.

  If you intend to bind the server to a specific address, be sure that the `mysql.user` system table contains an account with administrative privileges that you can use to connect to that address. Otherwise, you cannot shut down the server. For example, if you bind the server to `*`, you can connect to it using all existing accounts. But if you bind the server to `::1`, it accepts connections only on that address. In that case, first make sure that the `'root'@'::1'` account is present in the `mysql.user` table so you can still connect to the server to shut it down.

  This variable has no effect for the embedded server (`libmysqld`) and is not visible within the embedded server.

* [`block_encryption_mode`](server-system-variables.html#sysvar_block_encryption_mode)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>1

  This variable controls the block encryption mode for block-based algorithms such as AES. It affects encryption for [`AES_ENCRYPT()`](encryption-functions.html#function_aes-encrypt) and [`AES_DECRYPT()`](encryption-functions.html#function_aes-decrypt).

  [`block_encryption_mode`](server-system-variables.html#sysvar_block_encryption_mode) takes a value in `aes-keylen-mode` format, where *`keylen`* is the key length in bits and *`mode`* is the encryption mode. The value is not case-sensitive. Permitted *`keylen`* values are 128, 192, and

  256. Permitted encryption modes depend on whether MySQL was compiled using OpenSSL or yaSSL:

  + For OpenSSL, permitted *`mode`* values are: `ECB`, `CBC`, `CFB1`, `CFB8`, `CFB128`, `OFB`

  + For yaSSL, permitted *`mode`* values are: `ECB`, `CBC`

  For example, this statement causes the AES encryption functions to use a key length of 256 bits and the CBC mode:

  ```sql
  SET block_encryption_mode = 'aes-256-cbc';
  ```

  An error occurs for attempts to set [`block_encryption_mode`](server-system-variables.html#sysvar_block_encryption_mode) to a value containing an unsupported key length or a mode that the SSL library does not support.

* [`bulk_insert_buffer_size`](server-system-variables.html#sysvar_bulk_insert_buffer_size)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>2

  `MyISAM` uses a special tree-like cache to make bulk inserts faster for [`INSERT ... SELECT`](insert-select.html "13.2.5.1 INSERT ... SELECT Statement"), `INSERT ... VALUES (...), (...), ...`, and [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") when adding data to nonempty tables. This variable limits the size of the cache tree in bytes per thread. Setting it to 0 disables this optimization. The default value is 8MB.

* [`character_set_client`](server-system-variables.html#sysvar_character_set_client)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>3

  The character set for statements that arrive from the client. The session value of this variable is set using the character set requested by the client when the client connects to the server. (Many clients support a `--default-character-set` option to enable this character set to be specified explicitly. See also [Section 10.4, “Connection Character Sets and Collations”](charset-connection.html "10.4 Connection Character Sets and Collations").) The global value of the variable is used to set the session value in cases when the client-requested value is unknown or not available, or the server is configured to ignore client requests:

  + The client requests a character set not known to the server. For example, a Japanese-enabled client requests `sjis` when connecting to a server not configured with `sjis` support.

  + The client is from a version of MySQL older than MySQL 4.1, and thus does not request a character set.

  + [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") was started with the [`--skip-character-set-client-handshake`](server-options.html#option_mysqld_character-set-client-handshake) option, which causes it to ignore client character set configuration. This reproduces MySQL 4.0 behavior and is useful should you wish to upgrade the server without upgrading all the clients.

  Some character sets cannot be used as the client character set. Attempting to use them as the [`character_set_client`](server-system-variables.html#sysvar_character_set_client) value produces an error. See [Impermissible Client Character Sets](charset-connection.html#charset-connection-impermissible-client-charset "Impermissible Client Character Sets").

* [`character_set_connection`](server-system-variables.html#sysvar_character_set_connection)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>4

  The character set used for literals specified without a character set introducer and for number-to-string conversion. For information about introducers, see [Section 10.3.8, “Character Set Introducers”](charset-introducer.html "10.3.8 Character Set Introducers").

* [`character_set_database`](server-system-variables.html#sysvar_character_set_database)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>5

  The character set used by the default database. The server sets this variable whenever the default database changes. If there is no default database, the variable has the same value as [`character_set_server`](server-system-variables.html#sysvar_character_set_server).

  The global [`character_set_database`](server-system-variables.html#sysvar_character_set_database) and [`collation_database`](server-system-variables.html#sysvar_collation_database) system variables are deprecated in MySQL 5.7; expect them to be removed in a future version of MySQL.

  Assigning a value to the session [`character_set_database`](server-system-variables.html#sysvar_character_set_database) and [`collation_database`](server-system-variables.html#sysvar_collation_database) system variables is deprecated in MySQL 5.7 and assignments produce a warning. You should expect the session variables to become read only in a future version of MySQL and assignments to produce an error, while remaining possible to access the session variables to determine the database character set and collation for the default database.

* [`character_set_filesystem`](server-system-variables.html#sysvar_character_set_filesystem)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>6

  The file system character set. This variable is used to interpret string literals that refer to file names, such as in the [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") and [`SELECT ... INTO OUTFILE`](select-into.html "13.2.9.1 SELECT ... INTO Statement") statements and the [`LOAD_FILE()`](string-functions.html#function_load-file) function. Such file names are converted from [`character_set_client`](server-system-variables.html#sysvar_character_set_client) to [`character_set_filesystem`](server-system-variables.html#sysvar_character_set_filesystem) before the file opening attempt occurs. The default value is `binary`, which means that no conversion occurs. For systems on which multibyte file names are permitted, a different value may be more appropriate. For example, if the system represents file names using UTF-8, set [`character_set_filesystem`](server-system-variables.html#sysvar_character_set_filesystem) to `'utf8mb4'`.

* [`character_set_results`](server-system-variables.html#sysvar_character_set_results)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>7

  The character set used for returning query results to the client. This includes result data such as column values, result metadata such as column names, and error messages.

* [`character_set_server`](server-system-variables.html#sysvar_character_set_server)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>8

  The servers default character set. See [Section 10.15, “Character Set Configuration”](charset-configuration.html "10.15 Character Set Configuration"). If you set this variable, you should also set [`collation_server`](server-system-variables.html#sysvar_collation_server) to specify the collation for the character set.

* [`character_set_system`](server-system-variables.html#sysvar_character_set_system)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>9

  The character set used by the server for storing identifiers. The value is always `utf8`.

* [`character_sets_dir`](server-system-variables.html#sysvar_character_sets_dir)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>0

  The directory where character sets are installed. See [Section 10.15, “Character Set Configuration”](charset-configuration.html "10.15 Character Set Configuration").

* [`check_proxy_users`](server-system-variables.html#sysvar_check_proxy_users)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>1

  Some authentication plugins implement proxy user mapping for themselves (for example, the PAM and Windows authentication plugins). Other authentication plugins do not support proxy users by default. Of these, some can request that the MySQL server itself map proxy users according to granted proxy privileges: `mysql_native_password`, `sha256_password`.

  If the [`check_proxy_users`](server-system-variables.html#sysvar_check_proxy_users) system variable is enabled, the server performs proxy user mapping for any authentication plugins that make such a request. However, it may also be necessary to enable plugin-specific system variables to take advantage of server proxy user mapping support:

  + For the `mysql_native_password` plugin, enable [`mysql_native_password_proxy_users`](server-system-variables.html#sysvar_mysql_native_password_proxy_users).

  + For the `sha256_password` plugin, enable [`sha256_password_proxy_users`](server-system-variables.html#sysvar_sha256_password_proxy_users).

  For information about user proxying, see [Section 6.2.14, “Proxy Users”](proxy-users.html "6.2.14 Proxy Users").

* [`collation_connection`](server-system-variables.html#sysvar_collation_connection)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>2

  The collation of the connection character set. [`collation_connection`](server-system-variables.html#sysvar_collation_connection) is important for comparisons of literal strings. For comparisons of strings with column values, [`collation_connection`](server-system-variables.html#sysvar_collation_connection) does not matter because columns have their own collation, which has a higher collation precedence (see [Section 10.8.4, “Collation Coercibility in Expressions”](charset-collation-coercibility.html "10.8.4 Collation Coercibility in Expressions")).

* [`collation_database`](server-system-variables.html#sysvar_collation_database)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>3

  The collation used by the default database. The server sets this variable whenever the default database changes. If there is no default database, the variable has the same value as [`collation_server`](server-system-variables.html#sysvar_collation_server).

  The global [`character_set_database`](server-system-variables.html#sysvar_character_set_database) and [`collation_database`](server-system-variables.html#sysvar_collation_database) system variables are deprecated in MySQL 5.7; expect them to be removed in a future version of MySQL.

  Assigning a value to the session [`character_set_database`](server-system-variables.html#sysvar_character_set_database) and [`collation_database`](server-system-variables.html#sysvar_collation_database) system variables is deprecated in MySQL 5.7 and assignments produce a warning. Expect the session variables to become read only in a future version of MySQL and assignments to produce an error, while remaining possible to access the session variables to determine the database character set and collation for the default database.

* [`collation_server`](server-system-variables.html#sysvar_collation_server)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>4

  The server's default collation. See [Section 10.15, “Character Set Configuration”](charset-configuration.html "10.15 Character Set Configuration").

* [`completion_type`](server-system-variables.html#sysvar_completion_type)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>5

  The transaction completion type. This variable can take the values shown in the following table. The variable can be assigned using either the name values or corresponding integer values.

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>6

  [`completion_type`](server-system-variables.html#sysvar_completion_type) affects transactions that begin with [`START TRANSACTION`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") or [`BEGIN`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") and end with [`COMMIT`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") or [`ROLLBACK`](commit.html "13.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements"). It does not apply to implicit commits resulting from execution of the statements listed in [Section 13.3.3, “Statements That Cause an Implicit Commit”](implicit-commit.html "13.3.3 Statements That Cause an Implicit Commit"). It also does not apply for [`XA COMMIT`](xa-statements.html "13.3.7.1 XA Transaction SQL Statements"), [`XA ROLLBACK`](xa-statements.html "13.3.7.1 XA Transaction SQL Statements"), or when [`autocommit=1`](server-system-variables.html#sysvar_autocommit).

* [`concurrent_insert`](server-system-variables.html#sysvar_concurrent_insert)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>7

  If `AUTO` (the default), MySQL permits [`INSERT`](insert.html "13.2.5 INSERT Statement") and [`SELECT`](select.html "13.2.9 SELECT Statement") statements to run concurrently for `MyISAM` tables that have no free blocks in the middle of the data file.

  This variable can take the values shown in the following table. The variable can be assigned using either the name values or corresponding integer values.

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>8

  If you start [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") with [`--skip-new`](server-options.html#option_mysqld_skip-new), [`concurrent_insert`](server-system-variables.html#sysvar_concurrent_insert) is set to `NEVER`.

  See also [Section 8.11.3, “Concurrent Inserts”](concurrent-inserts.html "8.11.3 Concurrent Inserts").

* [`connect_timeout`](server-system-variables.html#sysvar_connect_timeout)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>9

  The number of seconds that the [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") server waits for a connect packet before responding with `Bad handshake`. The default value is 10 seconds.

  Increasing the [`connect_timeout`](server-system-variables.html#sysvar_connect_timeout) value might help if clients frequently encounter errors of the form `Lost connection to MySQL server at 'XXX', system error: errno`.

* [`core_file`](server-system-variables.html#sysvar_core_file)

  <table frame="box" rules="all" summary="Properties for autocommit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_autocommit">autocommit</a></code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>0

  Whether to write a core file if the server unexpectedly exits. This variable is set by the [`--core-file`](server-options.html#option_mysqld_core-file) option.

* [`datadir`](server-system-variables.html#sysvar_datadir)

  <table frame="box" rules="all" summary="Properties for autocommit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_autocommit">autocommit</a></code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>1

  The path to the MySQL server data directory. Relative paths are resolved with respect to the current directory. If you expect the server to be started automatically (that is, in contexts for which you cannot assume what the current directory is), it is best to specify the [`datadir`](server-system-variables.html#sysvar_datadir) value as an absolute path.

* [`date_format`](server-system-variables.html#sysvar_date_format)

  This variable is unused. It is deprecated and is removed in MySQL 8.0.

* [`datetime_format`](server-system-variables.html#sysvar_datetime_format)

  This variable is unused. It is deprecated and is removed in MySQL 8.0.

* [`debug`](server-system-variables.html#sysvar_debug)

  <table frame="box" rules="all" summary="Properties for autocommit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_autocommit">autocommit</a></code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>2

  This variable indicates the current debugging settings. It is available only for servers built with debugging support. The initial value comes from the value of instances of the [`--debug`](server-options.html#option_mysqld_debug) option given at server startup. The global and session values may be set at runtime.

  Setting the session value of this system variable is a restricted operation. The session user must have privileges sufficient to set restricted session variables. See [Section 5.1.8.1, “System Variable Privileges”](system-variable-privileges.html "5.1.8.1 System Variable Privileges").

  Assigning a value that begins with `+` or `-` cause the value to added to or subtracted from the current value:

  ```sql
  mysql> SET debug = 'T';
  mysql> SELECT @@debug;
  +---------+
  | @@debug |
  +---------+
  | T       |
  +---------+

  mysql> SET debug = '+P';
  mysql> SELECT @@debug;
  +---------+
  | @@debug |
  +---------+
  | P:T     |
  +---------+

  mysql> SET debug = '-P';
  mysql> SELECT @@debug;
  +---------+
  | @@debug |
  +---------+
  | T       |
  +---------+
  ```

  For more information, see [Section 5.8.3, “The DBUG Package”](dbug-package.html "5.8.3 The DBUG Package").

* [`debug_sync`](server-system-variables.html#sysvar_debug_sync)

  <table frame="box" rules="all" summary="Properties for autocommit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_autocommit">autocommit</a></code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>3

  This variable is the user interface to the Debug Sync facility. Use of Debug Sync requires that MySQL be configured with the [`-DWITH_DEBUG=ON`](source-configuration-options.html#option_cmake_with_debug) **CMake** option (see [Section 2.8.7, “MySQL Source-Configuration Options”](source-configuration-options.html "2.8.7 MySQL Source-Configuration Options")); otherwise, this system variable is not available.

  The global variable value is read only and indicates whether the facility is enabled. By default, Debug Sync is disabled and the value of [`debug_sync`](server-system-variables.html#sysvar_debug_sync) is `OFF`. If the server is started with [`--debug-sync-timeout=N`](server-options.html#option_mysqld_debug-sync-timeout), where *`N`* is a timeout value greater than 0, Debug Sync is enabled and the value of [`debug_sync`](server-system-variables.html#sysvar_debug_sync) is `ON - current signal` followed by the signal name. Also, *`N`* becomes the default timeout for individual synchronization points.

  The session value can be read by any user and has the same value as the global variable. The session value can be set to control synchronization points.

  Setting the session value of this system variable is a restricted operation. The session user must have privileges sufficient to set restricted session variables. See [Section 5.1.8.1, “System Variable Privileges”](system-variable-privileges.html "5.1.8.1 System Variable Privileges").

  For a description of the Debug Sync facility and how to use synchronization points, see [MySQL Server Doxygen Documentation](/doc/index-other.html).

* [`default_authentication_plugin`](server-system-variables.html#sysvar_default_authentication_plugin)

  <table frame="box" rules="all" summary="Properties for autocommit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_autocommit">autocommit</a></code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>4

  The default authentication plugin. These values are permitted:

  + `mysql_native_password`: Use MySQL native passwords; see [Section 6.4.1.1, “Native Pluggable Authentication”](native-pluggable-authentication.html "6.4.1.1 Native Pluggable Authentication").

  + `sha256_password`: Use SHA-256 passwords; see [Section 6.4.1.5, “SHA-256 Pluggable Authentication”](sha256-pluggable-authentication.html "6.4.1.5 SHA-256 Pluggable Authentication").

  Note

  If this variable has a value other than `mysql_native_password`, clients older than MySQL 5.5.7 cannot connect because, of the permitted default authentication plugins, they understand only the `mysql_native_password` authentication protocol.

  The [`default_authentication_plugin`](server-system-variables.html#sysvar_default_authentication_plugin) value affects these aspects of server operation:

  + It determines which authentication plugin the server assigns to new accounts created by [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") and [`GRANT`](grant.html "13.7.1.4 GRANT Statement") statements that do not explicitly specify an authentication plugin.

  + The [`old_passwords`](server-system-variables.html#sysvar_old_passwords) system variable affects password hashing for accounts that use the `mysql_native_password` or `sha256_password` authentication plugin. If the default authentication plugin is one of those plugins, the server sets [`old_passwords`](server-system-variables.html#sysvar_old_passwords) at startup to the value required by the plugin password hashing method.

  + For an account created with either of the following statements, the server associates the account with the default authentication plugin and assigns the account the given password, hashed as required by that plugin:

    ```sql
    CREATE USER ... IDENTIFIED BY 'cleartext password';
    GRANT ...  IDENTIFIED BY 'cleartext password';
    ```

  + For an account created with either of the following statements, the server associates the account with the default authentication plugin and assigns the account the given password hash, if the password hash has the format required by the plugin:

    ```sql
    CREATE USER ... IDENTIFIED BY PASSWORD 'encrypted password';
    GRANT ...  IDENTIFIED BY PASSWORD 'encrypted password';
    ```

    If the password hash is not in the format required by the default authentication plugin, the statement fails.

* [`default_password_lifetime`](server-system-variables.html#sysvar_default_password_lifetime)

  <table frame="box" rules="all" summary="Properties for autocommit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_autocommit">autocommit</a></code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>5

  This variable defines the global automatic password expiration policy. The default [`default_password_lifetime`](server-system-variables.html#sysvar_default_password_lifetime) value is 0, which disables automatic password expiration. If the value of [`default_password_lifetime`](server-system-variables.html#sysvar_default_password_lifetime) is a positive integer *`N`*, it indicates the permitted password lifetime; passwords must be changed every *`N`* days.

  The global password expiration policy can be overridden as desired for individual accounts using the password expiration options of the [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") statement. See [Section 6.2.11, “Password Management”](password-management.html "6.2.11 Password Management").

  Note

  Prior to MySQL 5.7.11, the default [`default_password_lifetime`](server-system-variables.html#sysvar_default_password_lifetime) value is 360 (passwords must be changed approximately once per year). For those versions, be aware that, if you make no changes to the [`default_password_lifetime`](server-system-variables.html#sysvar_default_password_lifetime) variable or to individual user accounts, all user passwords expire after 360 days, and all user accounts start running in restricted mode when this happens. Clients (which are effectively users) connecting to the server then get an error indicating that the password must be changed: `ERROR 1820 (HY000): You must reset your password using ALTER USER statement before executing this statement.`

  However, this is easy to miss for clients that automatically connect to the server, such as connections made from scripts. To avoid having such clients suddenly stop working due to a password expiring, make sure to change the password expiration settings for those clients, like this:

  ```sql
  ALTER USER 'script'@'localhost' PASSWORD EXPIRE NEVER;
  ```

  Alternatively, set the [`default_password_lifetime`](server-system-variables.html#sysvar_default_password_lifetime) variable to `0`, thus disabling automatic password expiration for all users.

* [`default_storage_engine`](server-system-variables.html#sysvar_default_storage_engine)

  <table frame="box" rules="all" summary="Properties for autocommit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_autocommit">autocommit</a></code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>6

  The default storage engine for tables. See [Chapter 15, *Alternative Storage Engines*](storage-engines.html "Chapter 15 Alternative Storage Engines"). This variable sets the storage engine for permanent tables only. To set the storage engine for `TEMPORARY` tables, set the [`default_tmp_storage_engine`](server-system-variables.html#sysvar_default_tmp_storage_engine) system variable.

  To see which storage engines are available and enabled, use the [`SHOW ENGINES`](show-engines.html "13.7.5.16 SHOW ENGINES Statement") statement or query the `INFORMATION_SCHEMA` [`ENGINES`](information-schema-engines-table.html "24.3.7 The INFORMATION_SCHEMA ENGINES Table") table.

  If you disable the default storage engine at server startup, you must set the default engine for both permanent and `TEMPORARY` tables to a different engine or the server cannot start.

* [`default_tmp_storage_engine`](server-system-variables.html#sysvar_default_tmp_storage_engine)

  <table frame="box" rules="all" summary="Properties for autocommit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_autocommit">autocommit</a></code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>7

  The default storage engine for `TEMPORARY` tables (created with [`CREATE TEMPORARY TABLE`](create-table.html "13.1.18 CREATE TABLE Statement")). To set the storage engine for permanent tables, set the [`default_storage_engine`](server-system-variables.html#sysvar_default_storage_engine) system variable. Also see the discussion of that variable regarding possible values.

  If you disable the default storage engine at server startup, you must set the default engine for both permanent and `TEMPORARY` tables to a different engine or the server cannot start.

* [`default_week_format`](server-system-variables.html#sysvar_default_week_format)

  <table frame="box" rules="all" summary="Properties for autocommit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_autocommit">autocommit</a></code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>8

  The default mode value to use for the [`WEEK()`](date-and-time-functions.html#function_week) function. See [Section 12.7, “Date and Time Functions”](date-and-time-functions.html "12.7 Date and Time Functions").

* [`delay_key_write`](server-system-variables.html#sysvar_delay_key_write)

  <table frame="box" rules="all" summary="Properties for autocommit"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--autocommit[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_autocommit">autocommit</a></code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>9

  This variable specifies how to use delayed key writes. It applies only to `MyISAM` tables. Delayed key writing causes key buffers not to be flushed between writes. See also [Section 15.2.1, “MyISAM Startup Options”](myisam-start.html "15.2.1 MyISAM Startup Options").

  This variable can have one of the following values to affect handling of the `DELAY_KEY_WRITE` table option that can be used in [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statements.

  <table frame="box" rules="all" summary="Properties for automatic_sp_privileges"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_automatic_sp_privileges">automatic_sp_privileges</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>0

  Note

  If you set this variable to `ALL`, you should not use `MyISAM` tables from within another program (such as another MySQL server or [**myisamchk**](myisamchk.html "4.6.3 myisamchk — MyISAM Table-Maintenance Utility")) when the tables are in use. Doing so leads to index corruption.

  If `DELAY_KEY_WRITE` is enabled for a table, the key buffer is not flushed for the table on every index update, but only when the table is closed. This speeds up writes on keys a lot, but if you use this feature, you should add automatic checking of all `MyISAM` tables by starting the server with the [`myisam_recover_options`](server-system-variables.html#sysvar_myisam_recover_options) system variable set (for example, `myisam_recover_options='BACKUP,FORCE'`). See [Section 5.1.7, “Server System Variables”](server-system-variables.html "5.1.7 Server System Variables"), and [Section 15.2.1, “MyISAM Startup Options”](myisam-start.html "15.2.1 MyISAM Startup Options").

  If you start [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") with [`--skip-new`](server-options.html#option_mysqld_skip-new), [`delay_key_write`](server-system-variables.html#sysvar_delay_key_write) is set to `OFF`.

  Warning

  If you enable external locking with [`--external-locking`](server-options.html#option_mysqld_external-locking), there is no protection against index corruption for tables that use delayed key writes.

* [`delayed_insert_limit`](server-system-variables.html#sysvar_delayed_insert_limit)

  <table frame="box" rules="all" summary="Properties for automatic_sp_privileges"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_automatic_sp_privileges">automatic_sp_privileges</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>1

  This system variable is deprecated (because `DELAYED` inserts are not supported); expect it to be removed in a future release.

* [`delayed_insert_timeout`](server-system-variables.html#sysvar_delayed_insert_timeout)

  <table frame="box" rules="all" summary="Properties for automatic_sp_privileges"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_automatic_sp_privileges">automatic_sp_privileges</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>2

  This system variable is deprecated (because `DELAYED` inserts are not supported); expect it to be removed in a future release.

* [`delayed_queue_size`](server-system-variables.html#sysvar_delayed_queue_size)

  <table frame="box" rules="all" summary="Properties for automatic_sp_privileges"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_automatic_sp_privileges">automatic_sp_privileges</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>3

  This system variable is deprecated (because `DELAYED` inserts are not supported); expect it to be removed in a future release.

* [`disabled_storage_engines`](server-system-variables.html#sysvar_disabled_storage_engines)

  <table frame="box" rules="all" summary="Properties for automatic_sp_privileges"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_automatic_sp_privileges">automatic_sp_privileges</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>4

  This variable indicates which storage engines cannot be used to create tables or tablespaces. For example, to prevent new `MyISAM` or `FEDERATED` tables from being created, start the server with these lines in the server option file:

  ```sql
  [mysqld]
  disabled_storage_engines="MyISAM,FEDERATED"
  ```

  By default, [`disabled_storage_engines`](server-system-variables.html#sysvar_disabled_storage_engines) is empty (no engines disabled), but it can be set to a comma-separated list of one or more engines (not case-sensitive). Any engine named in the value cannot be used to create tables or tablespaces with [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") or [`CREATE TABLESPACE`](create-tablespace.html "13.1.19 CREATE TABLESPACE Statement"), and cannot be used with [`ALTER TABLE ... ENGINE`](alter-table.html "13.1.8 ALTER TABLE Statement") or [`ALTER TABLESPACE ... ENGINE`](alter-tablespace.html "13.1.9 ALTER TABLESPACE Statement") to change the storage engine of existing tables or tablespaces. Attempts to do so result in an [`ER_DISABLED_STORAGE_ENGINE`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_disabled_storage_engine) error.

  [`disabled_storage_engines`](server-system-variables.html#sysvar_disabled_storage_engines) does not restrict other DDL statements for existing tables, such as [`CREATE INDEX`](create-index.html "13.1.14 CREATE INDEX Statement"), [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement"), [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement"), [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement"), or [`DROP TABLESPACE`](drop-tablespace.html "13.1.30 DROP TABLESPACE Statement"). This permits a smooth transition so that existing tables or tablespaces that use a disabled engine can be migrated to a permitted engine by means such as [`ALTER TABLE ... ENGINE permitted_engine`](alter-table.html "13.1.8 ALTER TABLE Statement").

  It is permitted to set the [`default_storage_engine`](server-system-variables.html#sysvar_default_storage_engine) or [`default_tmp_storage_engine`](server-system-variables.html#sysvar_default_tmp_storage_engine) system variable to a storage engine that is disabled. This could cause applications to behave erratically or fail, although that might be a useful technique in a development environment for identifying applications that use disabled engines, so that they can be modified.

  [`disabled_storage_engines`](server-system-variables.html#sysvar_disabled_storage_engines) is disabled and has no effect if the server is started with any of these options: [`--bootstrap`](server-options.html#option_mysqld_bootstrap), [`--initialize`](server-options.html#option_mysqld_initialize), [`--initialize-insecure`](server-options.html#option_mysqld_initialize-insecure), [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables).

  Note

  Setting [`disabled_storage_engines`](server-system-variables.html#sysvar_disabled_storage_engines) might cause an issue with [**mysql\_upgrade**](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables"). For details, see [Section 4.4.7, “mysql\_upgrade — Check and Upgrade MySQL Tables”](mysql-upgrade.html "4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables").

* [`disconnect_on_expired_password`](server-system-variables.html#sysvar_disconnect_on_expired_password)

  <table frame="box" rules="all" summary="Properties for automatic_sp_privileges"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_automatic_sp_privileges">automatic_sp_privileges</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>5

  This variable controls how the server handles clients with expired passwords:

  + If the client indicates that it can handle expired passwords, the value of [`disconnect_on_expired_password`](server-system-variables.html#sysvar_disconnect_on_expired_password) is irrelevant. The server permits the client to connect but puts it in sandbox mode.

  + If the client does not indicate that it can handle expired passwords, the server handles the client according to the value of [`disconnect_on_expired_password`](server-system-variables.html#sysvar_disconnect_on_expired_password):

    - If [`disconnect_on_expired_password`](server-system-variables.html#sysvar_disconnect_on_expired_password): is enabled, the server disconnects the client.

    - If [`disconnect_on_expired_password`](server-system-variables.html#sysvar_disconnect_on_expired_password): is disabled, the server permits the client to connect but puts it in sandbox mode.

  For more information about the interaction of client and server settings relating to expired-password handling, see [Section 6.2.12, “Server Handling of Expired Passwords”](expired-password-handling.html "6.2.12 Server Handling of Expired Passwords").

* [`div_precision_increment`](server-system-variables.html#sysvar_div_precision_increment)

  <table frame="box" rules="all" summary="Properties for automatic_sp_privileges"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_automatic_sp_privileges">automatic_sp_privileges</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>6

  This variable indicates the number of digits by which to increase the scale of the result of division operations performed with the [`/`](arithmetic-functions.html#operator_divide) operator. The default value is 4. The minimum and maximum values are 0 and 30, respectively. The following example illustrates the effect of increasing the default value.

  ```sql
  mysql> SELECT 1/7;
  +--------+
  | 1/7    |
  +--------+
  | 0.1429 |
  +--------+
  mysql> SET div_precision_increment = 12;
  mysql> SELECT 1/7;
  +----------------+
  | 1/7            |
  +----------------+
  | 0.142857142857 |
  +----------------+
  ```

* [`end_markers_in_json`](server-system-variables.html#sysvar_end_markers_in_json)

  <table frame="box" rules="all" summary="Properties for automatic_sp_privileges"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_automatic_sp_privileges">automatic_sp_privileges</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>7

  Whether optimizer JSON output should add end markers. See [Section 8.15.9, “The end\_markers\_in\_json System Variable”](end-markers-in-json-system-variable.html "8.15.9 The end_markers_in_json System Variable").

* [`eq_range_index_dive_limit`](server-system-variables.html#sysvar_eq_range_index_dive_limit)

  <table frame="box" rules="all" summary="Properties for automatic_sp_privileges"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_automatic_sp_privileges">automatic_sp_privileges</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>8

  This variable indicates the number of equality ranges in an equality comparison condition when the optimizer should switch from using index dives to index statistics in estimating the number of qualifying rows. It applies to evaluation of expressions that have either of these equivalent forms, where the optimizer uses a nonunique index to look up *`col_name`* values:

  ```sql
  col_name IN(val1, ..., valN)
  col_name = val1 OR ... OR col_name = valN
  ```

  In both cases, the expression contains *`N`* equality ranges. The optimizer can make row estimates using index dives or index statistics. If [`eq_range_index_dive_limit`](server-system-variables.html#sysvar_eq_range_index_dive_limit) is greater than 0, the optimizer uses existing index statistics instead of index dives if there are [`eq_range_index_dive_limit`](server-system-variables.html#sysvar_eq_range_index_dive_limit) or more equality ranges. Thus, to permit use of index dives for up to *`N`* equality ranges, set [`eq_range_index_dive_limit`](server-system-variables.html#sysvar_eq_range_index_dive_limit) to *`N`* + 1. To disable use of index statistics and always use index dives regardless of *`N`*, set [`eq_range_index_dive_limit`](server-system-variables.html#sysvar_eq_range_index_dive_limit) to 0.

  For more information, see [Equality Range Optimization of Many-Valued Comparisons](range-optimization.html#equality-range-optimization "Equality Range Optimization of Many-Valued Comparisons").

  To update table index statistics for best estimates, use [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement").

* [`error_count`](server-system-variables.html#sysvar_error_count)

  The number of errors that resulted from the last statement that generated messages. This variable is read only. See [Section 13.7.5.17, “SHOW ERRORS Statement”](show-errors.html "13.7.5.17 SHOW ERRORS Statement").

* [`event_scheduler`](server-system-variables.html#sysvar_event_scheduler)

  <table frame="box" rules="all" summary="Properties for automatic_sp_privileges"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--automatic-sp-privileges[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_automatic_sp_privileges">automatic_sp_privileges</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>9

  This variable enables or disables, and starts or stops, the Event Scheduler. The possible status values are `ON`, `OFF`, and `DISABLED`. Turning the Event Scheduler `OFF` is not the same as disabling the Event Scheduler, which requires setting the status to `DISABLED`. This variable and its effects on the Event Scheduler's operation are discussed in greater detail in [Section 23.4.2, “Event Scheduler Configuration”](events-configuration.html "23.4.2 Event Scheduler Configuration")

* [`explicit_defaults_for_timestamp`](server-system-variables.html#sysvar_explicit_defaults_for_timestamp)

  <table frame="box" rules="all" summary="Properties for auto_generate_certs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_auto_generate_certs">auto_generate_certs</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>0

  This system variable determines whether the server enables certain nonstandard behaviors for default values and `NULL`-value handling in [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") columns. By default, [`explicit_defaults_for_timestamp`](server-system-variables.html#sysvar_explicit_defaults_for_timestamp) is disabled, which enables the nonstandard behaviors.

  If [`explicit_defaults_for_timestamp`](server-system-variables.html#sysvar_explicit_defaults_for_timestamp) is disabled, the server enables the nonstandard behaviors and handles [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") columns as follows:

  + [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") columns not explicitly declared with the `NULL` attribute are automatically declared with the `NOT NULL` attribute. Assigning such a column a value of `NULL` is permitted and sets the column to the current timestamp.

  + The first [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") column in a table, if not explicitly declared with the `NULL` attribute or an explicit `DEFAULT` or `ON UPDATE` attribute, is automatically declared with the `DEFAULT CURRENT_TIMESTAMP` and `ON UPDATE CURRENT_TIMESTAMP` attributes.

  + [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") columns following the first one, if not explicitly declared with the `NULL` attribute or an explicit `DEFAULT` attribute, are automatically declared as `DEFAULT '0000-00-00 00:00:00'` (the “zero” timestamp). For inserted rows that specify no explicit value for such a column, the column is assigned `'0000-00-00 00:00:00'` and no warning occurs.

    Depending on whether strict SQL mode or the [`NO_ZERO_DATE`](sql-mode.html#sqlmode_no_zero_date) SQL mode is enabled, a default value of `'0000-00-00 00:00:00'` may be invalid. Be aware that the [`TRADITIONAL`](sql-mode.html#sqlmode_traditional) SQL mode includes strict mode and [`NO_ZERO_DATE`](sql-mode.html#sqlmode_no_zero_date). See [Section 5.1.10, “Server SQL Modes”](sql-mode.html "5.1.10 Server SQL Modes").

  The nonstandard behaviors just described are deprecated; expect them to be removed in a future release of MySQL.

  If [`explicit_defaults_for_timestamp`](server-system-variables.html#sysvar_explicit_defaults_for_timestamp) is enabled, the server disables the nonstandard behaviors and handles [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") columns as follows:

  + It is not possible to assign a [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") column a value of `NULL` to set it to the current timestamp. To assign the current timestamp, set the column to [`CURRENT_TIMESTAMP`](date-and-time-functions.html#function_current-timestamp) or a synonym such as [`NOW()`](date-and-time-functions.html#function_now).

  + [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") columns not explicitly declared with the `NOT NULL` attribute are automatically declared with the `NULL` attribute and permit `NULL` values. Assigning such a column a value of `NULL` sets it to `NULL`, not the current timestamp.

  + [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") columns declared with the `NOT NULL` attribute do not permit `NULL` values. For inserts that specify `NULL` for such a column, the result is either an error for a single-row insert if strict SQL mode is enabled, or `'0000-00-00 00:00:00'` is inserted for multiple-row inserts with strict SQL mode disabled. In no case does assigning the column a value of `NULL` set it to the current timestamp.

  + [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") columns explicitly declared with the `NOT NULL` attribute and without an explicit `DEFAULT` attribute are treated as having no default value. For inserted rows that specify no explicit value for such a column, the result depends on the SQL mode. If strict SQL mode is enabled, an error occurs. If strict SQL mode is not enabled, the column is declared with the implicit default of `'0000-00-00 00:00:00'` and a warning occurs. This is similar to how MySQL treats other temporal types such as [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types").

  + No [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") column is automatically declared with the `DEFAULT CURRENT_TIMESTAMP` or `ON UPDATE CURRENT_TIMESTAMP` attributes. Those attributes must be explicitly specified.

  + The first [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") column in a table is not handled differently from [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") columns following the first one.

  If [`explicit_defaults_for_timestamp`](server-system-variables.html#sysvar_explicit_defaults_for_timestamp) is disabled at server startup, this warning appears in the error log:

  ```sql
  [Warning] TIMESTAMP with implicit DEFAULT value is deprecated.
  Please use --explicit_defaults_for_timestamp server option (see
  documentation for more details).
  ```

  As indicated by the warning, to disable the deprecated nonstandard behaviors, enable the [`explicit_defaults_for_timestamp`](server-system-variables.html#sysvar_explicit_defaults_for_timestamp) system variable at server startup.

  Note

  [`explicit_defaults_for_timestamp`](server-system-variables.html#sysvar_explicit_defaults_for_timestamp) is itself deprecated because its only purpose is to permit control over deprecated [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") behaviors that are to be removed in a future release of MySQL. When removal of those behaviors occurs, [`explicit_defaults_for_timestamp`](server-system-variables.html#sysvar_explicit_defaults_for_timestamp) no longer has any purpose, and you can expect it to be removed as well.

  For additional information, see [Section 11.2.6, “Automatic Initialization and Updating for TIMESTAMP and DATETIME”](timestamp-initialization.html "11.2.6 Automatic Initialization and Updating for TIMESTAMP and DATETIME").

* [`external_user`](server-system-variables.html#sysvar_external_user)

  <table frame="box" rules="all" summary="Properties for auto_generate_certs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_auto_generate_certs">auto_generate_certs</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>1

  The external user name used during the authentication process, as set by the plugin used to authenticate the client. With native (built-in) MySQL authentication, or if the plugin does not set the value, this variable is `NULL`. See [Section 6.2.14, “Proxy Users”](proxy-users.html "6.2.14 Proxy Users").

* [`flush`](server-system-variables.html#sysvar_flush)

  <table frame="box" rules="all" summary="Properties for auto_generate_certs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_auto_generate_certs">auto_generate_certs</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>2

  If `ON`, the server flushes (synchronizes) all changes to disk after each SQL statement. Normally, MySQL does a write of all changes to disk only after each SQL statement and lets the operating system handle the synchronizing to disk. See [Section B.3.3.3, “What to Do If MySQL Keeps Crashing”](crashing.html "B.3.3.3 What to Do If MySQL Keeps Crashing"). This variable is set to `ON` if you start [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") with the [`--flush`](server-options.html#option_mysqld_flush) option.

  Note

  If [`flush`](server-system-variables.html#sysvar_flush) is enabled, the value of [`flush_time`](server-system-variables.html#sysvar_flush_time) does not matter and changes to [`flush_time`](server-system-variables.html#sysvar_flush_time) have no effect on flush behavior.

* [`flush_time`](server-system-variables.html#sysvar_flush_time)

  <table frame="box" rules="all" summary="Properties for auto_generate_certs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_auto_generate_certs">auto_generate_certs</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>3

  If this is set to a nonzero value, all tables are closed every [`flush_time`](server-system-variables.html#sysvar_flush_time) seconds to free up resources and synchronize unflushed data to disk. This option is best used only on systems with minimal resources.

  Note

  If [`flush`](server-system-variables.html#sysvar_flush) is enabled, the value of [`flush_time`](server-system-variables.html#sysvar_flush_time) does not matter and changes to [`flush_time`](server-system-variables.html#sysvar_flush_time) have no effect on flush behavior.

* [`foreign_key_checks`](server-system-variables.html#sysvar_foreign_key_checks)

  <table frame="box" rules="all" summary="Properties for auto_generate_certs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_auto_generate_certs">auto_generate_certs</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>4

  If set to 1 (the default), foreign key constraints are checked. If set to 0, foreign key constraints are ignored, with a couple of exceptions. When re-creating a table that was dropped, an error is returned if the table definition does not conform to the foreign key constraints referencing the table. Likewise, an [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") operation returns an error if a foreign key definition is incorrectly formed. For more information, see [Section 13.1.18.5, “FOREIGN KEY Constraints”](create-table-foreign-keys.html "13.1.18.5 FOREIGN KEY Constraints").

  Setting this variable has the same effect on [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables as it does for `InnoDB` tables. Typically you leave this setting enabled during normal operation, to enforce [referential integrity](glossary.html#glos_referential_integrity "referential integrity"). Disabling foreign key checking can be useful for reloading `InnoDB` tables in an order different from that required by their parent/child relationships. See [Section 13.1.18.5, “FOREIGN KEY Constraints”](create-table-foreign-keys.html "13.1.18.5 FOREIGN KEY Constraints").

  Setting `foreign_key_checks` to 0 also affects data definition statements: [`DROP SCHEMA`](drop-database.html "13.1.22 DROP DATABASE Statement") drops a schema even if it contains tables that have foreign keys that are referred to by tables outside the schema, and [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement") drops tables that have foreign keys that are referred to by other tables.

  Note

  Setting `foreign_key_checks` to 1 does not trigger a scan of the existing table data. Therefore, rows added to the table while [`foreign_key_checks=0`](server-system-variables.html#sysvar_foreign_key_checks) are not verified for consistency.

  Dropping an index required by a foreign key constraint is not permitted, even with `foreign_key_checks=0`. The foreign key constraint must be removed before dropping the index (Bug
  #70260).

* [`ft_boolean_syntax`](server-system-variables.html#sysvar_ft_boolean_syntax)

  <table frame="box" rules="all" summary="Properties for auto_generate_certs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_auto_generate_certs">auto_generate_certs</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>5

  The list of operators supported by boolean full-text searches performed using `IN BOOLEAN MODE`. See [Section 12.9.2, “Boolean Full-Text Searches”](fulltext-boolean.html "12.9.2 Boolean Full-Text Searches").

  The default variable value is `'+ -><()~*:""&|'`. The rules for changing the value are as follows:

  + Operator function is determined by position within the string.

  + The replacement value must be 14 characters.
  + Each character must be an ASCII nonalphanumeric character.
  + Either the first or second character must be a space.
  + No duplicates are permitted except the phrase quoting operators in positions 11 and 12. These two characters are not required to be the same, but they are the only two that may be.

  + Positions 10, 13, and 14 (which by default are set to `:`, `&`, and `|`) are reserved for future extensions.

* [`ft_max_word_len`](server-system-variables.html#sysvar_ft_max_word_len)

  <table frame="box" rules="all" summary="Properties for auto_generate_certs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_auto_generate_certs">auto_generate_certs</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>6

  The maximum length of the word to be included in a `MyISAM` `FULLTEXT` index.

  Note

  `FULLTEXT` indexes on `MyISAM` tables must be rebuilt after changing this variable. Use `REPAIR TABLE tbl_name QUICK`.

* [`ft_min_word_len`](server-system-variables.html#sysvar_ft_min_word_len)

  <table frame="box" rules="all" summary="Properties for auto_generate_certs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_auto_generate_certs">auto_generate_certs</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>7

  The minimum length of the word to be included in a `MyISAM` `FULLTEXT` index.

  Note

  `FULLTEXT` indexes on `MyISAM` tables must be rebuilt after changing this variable. Use `REPAIR TABLE tbl_name QUICK`.

* [`ft_query_expansion_limit`](server-system-variables.html#sysvar_ft_query_expansion_limit)

  <table frame="box" rules="all" summary="Properties for auto_generate_certs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_auto_generate_certs">auto_generate_certs</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>8

  The number of top matches to use for full-text searches performed using `WITH QUERY EXPANSION`.

* [`ft_stopword_file`](server-system-variables.html#sysvar_ft_stopword_file)

  <table frame="box" rules="all" summary="Properties for auto_generate_certs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--auto-generate-certs[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_auto_generate_certs">auto_generate_certs</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>9

  The file from which to read the list of stopwords for full-text searches on `MyISAM` tables. The server looks for the file in the data directory unless an absolute path name is given to specify a different directory. All the words from the file are used; comments are *not* honored. By default, a built-in list of stopwords is used (as defined in the `storage/myisam/ft_static.c` file). Setting this variable to the empty string (`''`) disables stopword filtering. See also [Section 12.9.4, “Full-Text Stopwords”](fulltext-stopwords.html "12.9.4 Full-Text Stopwords").

  Note

  `FULLTEXT` indexes on `MyISAM` tables must be rebuilt after changing this variable or the contents of the stopword file. Use `REPAIR TABLE tbl_name QUICK`.

* [`general_log`](server-system-variables.html#sysvar_general_log)

  <table frame="box" rules="all" summary="Properties for avoid_temporal_upgrade"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_avoid_temporal_upgrade">avoid_temporal_upgrade</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>0

  Whether the general query log is enabled. The value can be 0 (or `OFF`) to disable the log or 1 (or `ON`) to enable the log. The destination for log output is controlled by the [`log_output`](server-system-variables.html#sysvar_log_output) system variable; if that value is `NONE`, no log entries are written even if the log is enabled.

* [`general_log_file`](server-system-variables.html#sysvar_general_log_file)

  <table frame="box" rules="all" summary="Properties for avoid_temporal_upgrade"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_avoid_temporal_upgrade">avoid_temporal_upgrade</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>1

  The name of the general query log file. The default value is `host_name.log`, but the initial value can be changed with the [`--general_log_file`](server-system-variables.html#sysvar_general_log_file) option.

* [`group_concat_max_len`](server-system-variables.html#sysvar_group_concat_max_len)

  <table frame="box" rules="all" summary="Properties for avoid_temporal_upgrade"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_avoid_temporal_upgrade">avoid_temporal_upgrade</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>2

  The maximum permitted result length in bytes for the [`GROUP_CONCAT()`](aggregate-functions.html#function_group-concat) function. The default is 1024.

* [`have_compress`](server-system-variables.html#sysvar_have_compress)

  `YES` if the `zlib` compression library is available to the server, `NO` if not. If not, the [`COMPRESS()`](encryption-functions.html#function_compress) and [`UNCOMPRESS()`](encryption-functions.html#function_uncompress) functions cannot be used.

* [`have_crypt`](server-system-variables.html#sysvar_have_crypt)

  `YES` if the `crypt()` system call is available to the server, `NO` if not. If not, the [`ENCRYPT()`](encryption-functions.html#function_encrypt) function cannot be used.

  Note

  The [`ENCRYPT()`](encryption-functions.html#function_encrypt) function is deprecated in MySQL 5.7, will be removed in a future release of MySQL, and should no longer be used. (For one-way hashing, consider using [`SHA2()`](encryption-functions.html#function_sha2) instead.) Consequently, [`have_crypt`](server-system-variables.html#sysvar_have_crypt) also is deprecated; expect it to be removed in a future release.

* [`have_dynamic_loading`](server-system-variables.html#sysvar_have_dynamic_loading)

  `YES` if [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") supports dynamic loading of plugins, `NO` if not. If the value is `NO`, you cannot use options such as `--plugin-load` to load plugins at server startup, or the [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") statement to load plugins at runtime.

* [`have_geometry`](server-system-variables.html#sysvar_have_geometry)

  `YES` if the server supports spatial data types, `NO` if not.

* [`have_openssl`](server-system-variables.html#sysvar_have_openssl)

  This variable is a synonym for [`have_ssl`](server-system-variables.html#sysvar_have_ssl).

* [`have_profiling`](server-system-variables.html#sysvar_have_profiling)

  `YES` if statement profiling capability is present, `NO` if not. If present, the `profiling` system variable controls whether this capability is enabled or disabled. See [Section 13.7.5.31, “SHOW PROFILES Statement”](show-profiles.html "13.7.5.31 SHOW PROFILES Statement").

  This variable is deprecated; expect it to be removed in a future release of MySQL.

* [`have_query_cache`](server-system-variables.html#sysvar_have_query_cache)

  `YES` if [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") supports the query cache, `NO` if not.

  Note

  The query cache is deprecated as of MySQL 5.7.20, and is removed in MySQL 8.0. Deprecation includes [`have_query_cache`](server-system-variables.html#sysvar_have_query_cache).

* [`have_rtree_keys`](server-system-variables.html#sysvar_have_rtree_keys)

  `YES` if `RTREE` indexes are available, `NO` if not. (These are used for spatial indexes in `MyISAM` tables.)

* [`have_ssl`](server-system-variables.html#sysvar_have_ssl)

  <table frame="box" rules="all" summary="Properties for avoid_temporal_upgrade"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_avoid_temporal_upgrade">avoid_temporal_upgrade</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>3

  `YES` if [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") supports SSL connections, `DISABLED` if the server was compiled with SSL support, but was not started with the appropriate connection-encryption options. For more information, see [Section 2.8.6, “Configuring SSL Library Support”](source-ssl-library-configuration.html "2.8.6 Configuring SSL Library Support").

* [`have_statement_timeout`](server-system-variables.html#sysvar_have_statement_timeout)

  <table frame="box" rules="all" summary="Properties for avoid_temporal_upgrade"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_avoid_temporal_upgrade">avoid_temporal_upgrade</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>4

  Whether the statement execution timeout feature is available (see [Statement Execution Time Optimizer Hints](optimizer-hints.html#optimizer-hints-execution-time "Statement Execution Time Optimizer Hints")). The value can be `NO` if the background thread used by this feature could not be initialized.

* [`have_symlink`](server-system-variables.html#sysvar_have_symlink)

  `YES` if symbolic link support is enabled, `NO` if not. This is required on Unix for support of the `DATA DIRECTORY` and `INDEX DIRECTORY` table options. If the server is started with the [`--skip-symbolic-links`](server-options.html#option_mysqld_symbolic-links) option, the value is `DISABLED`.

  This variable has no meaning on Windows.

* [`host_cache_size`](server-system-variables.html#sysvar_host_cache_size)

  <table frame="box" rules="all" summary="Properties for avoid_temporal_upgrade"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_avoid_temporal_upgrade">avoid_temporal_upgrade</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>5

  The MySQL server maintains an in-memory host cache that contains client host name and IP address information and is used to avoid Domain Name System (DNS) lookups; see [Section 5.1.11.2, “DNS Lookups and the Host Cache”](host-cache.html "5.1.11.2 DNS Lookups and the Host Cache").

  The [`host_cache_size`](server-system-variables.html#sysvar_host_cache_size) variable controls the size of the host cache, as well as the size of the Performance Schema [`host_cache`](performance-schema-host-cache-table.html "25.12.16.1 The host_cache Table") table that exposes the cache contents. Setting [`host_cache_size`](server-system-variables.html#sysvar_host_cache_size) has these effects:

  + Setting the size to 0 disables the host cache. With the cache disabled, the server performs a DNS lookup every time a client connects.

  + Changing the size at runtime causes an implicit host cache flushing operation that clears the host cache, truncates the [`host_cache`](performance-schema-host-cache-table.html "25.12.16.1 The host_cache Table") table, and unblocks any blocked hosts.

  The default value is autosized to 128, plus 1 for a value of [`max_connections`](server-system-variables.html#sysvar_max_connections) up to 500, plus 1 for every increment of 20 over 500 in the [`max_connections`](server-system-variables.html#sysvar_max_connections) value, capped to a limit of 2000.

  Using the [`--skip-host-cache`](server-options.html#option_mysqld_skip-host-cache) option is similar to setting the `host_cache_size` system variable to 0, but `host_cache_size` is more flexible because it can also be used to resize, enable, and disable the host cache at runtime, not just at server startup.

  Starting the server with [`--skip-host-cache`](server-options.html#option_mysqld_skip-host-cache) does not prevent runtime changes to the value of `host_cache_size`, but such changes have no effect and the cache is not re-enabled even if `host_cache_size` is set larger than 0.

  Setting the `host_cache_size` system variable rather than the [`--skip-host-cache`](server-options.html#option_mysqld_skip-host-cache) option is preferred for the reasons given in the previous paragraph. In addition, the `--skip-host-cache` option is deprecated in MySQL 8.0, and its removal is expected in a future version of MySQL.

* [`hostname`](server-system-variables.html#sysvar_hostname)

  <table frame="box" rules="all" summary="Properties for avoid_temporal_upgrade"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_avoid_temporal_upgrade">avoid_temporal_upgrade</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>6

  The server sets this variable to the server host name at startup.

* [`identity`](server-system-variables.html#sysvar_identity)

  This variable is a synonym for the [`last_insert_id`](server-system-variables.html#sysvar_last_insert_id) variable. It exists for compatibility with other database systems. You can read its value with `SELECT @@identity`, and set it using `SET identity`.

* [`ignore_db_dirs`](server-system-variables.html#sysvar_ignore_db_dirs)

  <table frame="box" rules="all" summary="Properties for avoid_temporal_upgrade"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_avoid_temporal_upgrade">avoid_temporal_upgrade</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>7

  A comma-separated list of names that are not considered as database directories in the data directory. The value is set from any instances of [`--ignore-db-dir`](server-options.html#option_mysqld_ignore-db-dir) given at server startup.

  As of MySQL 5.7.11, [`--ignore-db-dir`](server-options.html#option_mysqld_ignore-db-dir) can be used at data directory initialization time with [**mysqld --initialize**](mysqld.html "4.3.1 mysqld — The MySQL Server") to specify directories that the server should ignore for purposes of assessing whether an existing data directory is considered empty. See [Section 2.9.1, “Initializing the Data Directory”](data-directory-initialization.html "2.9.1 Initializing the Data Directory").

  This system variable is deprecated in MySQL 5.7. With the introduction of the data dictionary in MySQL 8.0, it became superfluous and was removed in that version.

* [`init_connect`](server-system-variables.html#sysvar_init_connect)

  <table frame="box" rules="all" summary="Properties for avoid_temporal_upgrade"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_avoid_temporal_upgrade">avoid_temporal_upgrade</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>8

  A string to be executed by the server for each client that connects. The string consists of one or more SQL statements, separated by semicolon characters.

  For users that have the [`SUPER`](privileges-provided.html#priv_super) privilege, the content of [`init_connect`](server-system-variables.html#sysvar_init_connect) is not executed. This is done so that an erroneous value for [`init_connect`](server-system-variables.html#sysvar_init_connect) does not prevent all clients from connecting. For example, the value might contain a statement that has a syntax error, thus causing client connections to fail. Not executing [`init_connect`](server-system-variables.html#sysvar_init_connect) for users that have the [`SUPER`](privileges-provided.html#priv_super) privilege enables them to open a connection and fix the [`init_connect`](server-system-variables.html#sysvar_init_connect) value.

  As of MySQL 5.7.22, [`init_connect`](server-system-variables.html#sysvar_init_connect) execution is skipped for any client user with an expired password. This is done because such a user cannot execute arbitrary statements, and thus [`init_connect`](server-system-variables.html#sysvar_init_connect) execution fails, leaving the client unable to connect. Skipping [`init_connect`](server-system-variables.html#sysvar_init_connect) execution enables the user to connect and change password.

  The server discards any result sets produced by statements in the value of [`init_connect`](server-system-variables.html#sysvar_init_connect).

* [`init_file`](server-system-variables.html#sysvar_init_file)

  <table frame="box" rules="all" summary="Properties for avoid_temporal_upgrade"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--avoid-temporal-upgrade[={OFF|ON}]</code></td> </tr><tr><th>Deprecated</th> <td>Yes</td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_avoid_temporal_upgrade">avoid_temporal_upgrade</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>9

  If specified, this variable names a file containing SQL statements to be read and executed during the startup process. Each statement must be on a single line and should not include comments.

  If the server is started with any of the [`--bootstrap`](server-options.html#option_mysqld_bootstrap), [`--initialize`](server-options.html#option_mysqld_initialize), or [`--initialize-insecure`](server-options.html#option_mysqld_initialize-insecure) options, it operates in bootstap mode and some functionality is unavailable that limits the statements permitted in the file. These include statements that relate to account management (such as [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") or [`GRANT`](grant.html "13.7.1.4 GRANT Statement")), replication, and global transaction identifiers. See [Section 16.1.3, “Replication with Global Transaction Identifiers”](replication-gtids.html "16.1.3 Replication with Global Transaction Identifiers").

* `innodb_xxx`

  [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine") system variables are listed in [Section 14.15, “InnoDB Startup Options and System Variables”](innodb-parameters.html "14.15 InnoDB Startup Options and System Variables"). These variables control many aspects of storage, memory use, and I/O patterns for `InnoDB` tables, and are especially important now that `InnoDB` is the default storage engine.

* [`insert_id`](server-system-variables.html#sysvar_insert_id)

  The value to be used by the following [`INSERT`](insert.html "13.2.5 INSERT Statement") or [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") statement when inserting an `AUTO_INCREMENT` value. This is mainly used with the binary log.

* [`interactive_timeout`](server-system-variables.html#sysvar_interactive_timeout)

  <table frame="box" rules="all" summary="Properties for back_log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--back-log=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_back_log">back_log</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>0

  The number of seconds the server waits for activity on an interactive connection before closing it. An interactive client is defined as a client that uses the `CLIENT_INTERACTIVE` option to [`mysql_real_connect()`](/doc/c-api/5.7/en/mysql-real-connect.html). See also [`wait_timeout`](server-system-variables.html#sysvar_wait_timeout).

* [`internal_tmp_disk_storage_engine`](server-system-variables.html#sysvar_internal_tmp_disk_storage_engine)

  <table frame="box" rules="all" summary="Properties for back_log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--back-log=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_back_log">back_log</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>1

  The storage engine for on-disk internal temporary tables (see [Section 8.4.4, “Internal Temporary Table Use in MySQL”](internal-temporary-tables.html "8.4.4 Internal Temporary Table Use in MySQL")). Permitted values are `MYISAM` and `INNODB` (the default).

  The [optimizer](glossary.html#glos_optimizer "optimizer") uses the storage engine defined by [`internal_tmp_disk_storage_engine`](server-system-variables.html#sysvar_internal_tmp_disk_storage_engine) for on-disk internal temporary tables.

  When using [`internal_tmp_disk_storage_engine=INNODB`](server-system-variables.html#sysvar_internal_tmp_disk_storage_engine) (the default), queries that generate on-disk internal temporary tables that exceed [`InnoDB` row or column limits](innodb-limits.html "14.23 InnoDB Limits") return Row size too large or Too many columns errors. The workaround is to set [`internal_tmp_disk_storage_engine`](server-system-variables.html#sysvar_internal_tmp_disk_storage_engine) to `MYISAM`.

* [`join_buffer_size`](server-system-variables.html#sysvar_join_buffer_size)

  <table frame="box" rules="all" summary="Properties for back_log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--back-log=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_back_log">back_log</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>2

  The minimum size of the buffer that is used for plain index scans, range index scans, and joins that do not use indexes and thus perform full table scans. Normally, the best way to get fast joins is to add indexes. Increase the value of [`join_buffer_size`](server-system-variables.html#sysvar_join_buffer_size) to get a faster full join when adding indexes is not possible. One join buffer is allocated for each full join between two tables. For a complex join between several tables for which indexes are not used, multiple join buffers might be necessary.

  The default is 256KB. The maximum permissible setting for [`join_buffer_size`](server-system-variables.html#sysvar_join_buffer_size) is 4GB−1. Larger values are permitted for 64-bit platforms (except 64-bit Windows, for which large values are truncated to 4GB−1 with a warning). The block size is 128, and a value that is not an exact multiple of the block size is rounded down to the next lower multiple of the block size by MySQL Server before storing the value for the system variable. The parser allows values up to the maximum unsigned integer value for the platform (4294967295 or 232−1 for a 32-bit system, 18446744073709551615 or 264−1 for a 64-bit system) but the actual maximum is a block size lower.

  Unless a Block Nested-Loop or Batched Key Access algorithm is used, there is no gain from setting the buffer larger than required to hold each matching row, and all joins allocate at least the minimum size, so use caution in setting this variable to a large value globally. It is better to keep the global setting small and change the session setting to a larger value only in sessions that are doing large joins. Memory allocation time can cause substantial performance drops if the global size is larger than needed by most queries that use it.

  When Block Nested-Loop is used, a larger join buffer can be beneficial up to the point where all required columns from all rows in the first table are stored in the join buffer. This depends on the query; the optimal size may be smaller than holding all rows from the first tables.

  When Batched Key Access is used, the value of [`join_buffer_size`](server-system-variables.html#sysvar_join_buffer_size) defines how large the batch of keys is in each request to the storage engine. The larger the buffer, the more sequential access is made to the right hand table of a join operation, which can significantly improve performance.

  For additional information about join buffering, see [Section 8.2.1.6, “Nested-Loop Join Algorithms”](nested-loop-joins.html "8.2.1.6 Nested-Loop Join Algorithms"). For information about Batched Key Access, see [Section 8.2.1.11, “Block Nested-Loop and Batched Key Access Joins”](bnl-bka-optimization.html "8.2.1.11 Block Nested-Loop and Batched Key Access Joins").

* [`keep_files_on_create`](server-system-variables.html#sysvar_keep_files_on_create)

  <table frame="box" rules="all" summary="Properties for back_log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--back-log=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_back_log">back_log</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>3

  If a `MyISAM` table is created with no `DATA DIRECTORY` option, the `.MYD` file is created in the database directory. By default, if `MyISAM` finds an existing `.MYD` file in this case, it overwrites it. The same applies to `.MYI` files for tables created with no `INDEX DIRECTORY` option. To suppress this behavior, set the [`keep_files_on_create`](server-system-variables.html#sysvar_keep_files_on_create) variable to `ON` (1), in which case `MyISAM` does not overwrite existing files and returns an error instead. The default value is `OFF` (0).

  If a `MyISAM` table is created with a `DATA DIRECTORY` or `INDEX DIRECTORY` option and an existing `.MYD` or `.MYI` file is found, MyISAM always returns an error. It does not overwrite a file in the specified directory.

* [`key_buffer_size`](server-system-variables.html#sysvar_key_buffer_size)

  <table frame="box" rules="all" summary="Properties for back_log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--back-log=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_back_log">back_log</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>4

  Index blocks for `MyISAM` tables are buffered and are shared by all threads. [`key_buffer_size`](server-system-variables.html#sysvar_key_buffer_size) is the size of the buffer used for index blocks. The key buffer is also known as the key cache.

  The minimum permissible setting is 0, but you cannot set [`key_buffer_size`](server-system-variables.html#sysvar_key_buffer_size) to 0 dynamically. A setting of 0 drops the key cache, which is not permitted at runtime. Setting [`key_buffer_size`](server-system-variables.html#sysvar_key_buffer_size) to 0 is permitted only at startup, in which case the key cache is not initialized. Changing the [`key_buffer_size`](server-system-variables.html#sysvar_key_buffer_size) setting at runtime from a value of 0 to a permitted non-zero value initializes the key cache.

  [`key_buffer_size`](server-system-variables.html#sysvar_key_buffer_size) can be increased or decreased only in increments or multiples of 4096 bytes. Increasing or decreasing the setting by a nonconforming value produces a warning and truncates the setting to a conforming value.

  The maximum permissible setting for [`key_buffer_size`](server-system-variables.html#sysvar_key_buffer_size) is 4GB−1 on 32-bit platforms. Larger values are permitted for 64-bit platforms. The effective maximum size might be less, depending on your available physical RAM and per-process RAM limits imposed by your operating system or hardware platform. The value of this variable indicates the amount of memory requested. Internally, the server allocates as much memory as possible up to this amount, but the actual allocation might be less.

  You can increase the value to get better index handling for all reads and multiple writes; on a system whose primary function is to run MySQL using the [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") storage engine, 25% of the machine's total memory is an acceptable value for this variable. However, you should be aware that, if you make the value too large (for example, more than 50% of the machine's total memory), your system might start to page and become extremely slow. This is because MySQL relies on the operating system to perform file system caching for data reads, so you must leave some room for the file system cache. You should also consider the memory requirements of any other storage engines that you may be using in addition to [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine").

  For even more speed when writing many rows at the same time, use [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements"). See [Section 8.2.4.1, “Optimizing INSERT Statements”](insert-optimization.html "8.2.4.1 Optimizing INSERT Statements").

  You can check the performance of the key buffer by issuing a [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") statement and examining the [`Key_read_requests`](server-status-variables.html#statvar_Key_read_requests), [`Key_reads`](server-status-variables.html#statvar_Key_reads), [`Key_write_requests`](server-status-variables.html#statvar_Key_write_requests), and [`Key_writes`](server-status-variables.html#statvar_Key_writes) status variables. (See [Section 13.7.5, “SHOW Statements”](show.html "13.7.5 SHOW Statements").) The `Key_reads/Key_read_requests` ratio should normally be less than 0.01. The `Key_writes/Key_write_requests` ratio is usually near 1 if you are using mostly updates and deletes, but might be much smaller if you tend to do updates that affect many rows at the same time or if you are using the `DELAY_KEY_WRITE` table option.

  The fraction of the key buffer in use can be determined using [`key_buffer_size`](server-system-variables.html#sysvar_key_buffer_size) in conjunction with the [`Key_blocks_unused`](server-status-variables.html#statvar_Key_blocks_unused) status variable and the buffer block size, which is available from the [`key_cache_block_size`](server-system-variables.html#sysvar_key_cache_block_size) system variable:

  ```sql
  1 - ((Key_blocks_unused * key_cache_block_size) / key_buffer_size)
  ```

  This value is an approximation because some space in the key buffer is allocated internally for administrative structures. Factors that influence the amount of overhead for these structures include block size and pointer size. As block size increases, the percentage of the key buffer lost to overhead tends to decrease. Larger blocks results in a smaller number of read operations (because more keys are obtained per read), but conversely an increase in reads of keys that are not examined (if not all keys in a block are relevant to a query).

  It is possible to create multiple `MyISAM` key caches. The size limit of 4GB applies to each cache individually, not as a group. See [Section 8.10.2, “The MyISAM Key Cache”](myisam-key-cache.html "8.10.2 The MyISAM Key Cache").

* [`key_cache_age_threshold`](server-system-variables.html#sysvar_key_cache_age_threshold)

  <table frame="box" rules="all" summary="Properties for back_log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--back-log=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_back_log">back_log</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>5

  This value controls the demotion of buffers from the hot sublist of a key cache to the warm sublist. Lower values cause demotion to happen more quickly. The minimum value is 100. The default value is 300. See [Section 8.10.2, “The MyISAM Key Cache”](myisam-key-cache.html "8.10.2 The MyISAM Key Cache").

* [`key_cache_block_size`](server-system-variables.html#sysvar_key_cache_block_size)

  <table frame="box" rules="all" summary="Properties for back_log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--back-log=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_back_log">back_log</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>6

  The size in bytes of blocks in the key cache. The default value is 1024. See [Section 8.10.2, “The MyISAM Key Cache”](myisam-key-cache.html "8.10.2 The MyISAM Key Cache").

* [`key_cache_division_limit`](server-system-variables.html#sysvar_key_cache_division_limit)

  <table frame="box" rules="all" summary="Properties for back_log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--back-log=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_back_log">back_log</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>7

  The division point between the hot and warm sublists of the key cache buffer list. The value is the percentage of the buffer list to use for the warm sublist. Permissible values range from 1 to 100. The default value is 100. See [Section 8.10.2, “The MyISAM Key Cache”](myisam-key-cache.html "8.10.2 The MyISAM Key Cache").

* [`large_files_support`](server-system-variables.html#sysvar_large_files_support)

  <table frame="box" rules="all" summary="Properties for back_log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--back-log=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_back_log">back_log</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>8

  Whether [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") was compiled with options for large file support.

* [`large_pages`](server-system-variables.html#sysvar_large_pages)

  <table frame="box" rules="all" summary="Properties for back_log"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--back-log=#</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_back_log">back_log</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>-1</code> (signifies autosizing; do not assign this literal value)</td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>9

  Whether large page support is enabled (via the [`--large-pages`](server-options.html#option_mysqld_large-pages) option). See [Section 8.12.4.3, “Enabling Large Page Support”](large-page-support.html "8.12.4.3 Enabling Large Page Support").

* [`large_page_size`](server-system-variables.html#sysvar_large_page_size)

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>0

  If large page support is enabled, this shows the size of memory pages. Large memory pages are supported only on Linux; on other platforms, the value of this variable is always 0. See [Section 8.12.4.3, “Enabling Large Page Support”](large-page-support.html "8.12.4.3 Enabling Large Page Support").

* [`last_insert_id`](server-system-variables.html#sysvar_last_insert_id)

  The value to be returned from [`LAST_INSERT_ID()`](information-functions.html#function_last-insert-id). This is stored in the binary log when you use [`LAST_INSERT_ID()`](information-functions.html#function_last-insert-id) in a statement that updates a table. Setting this variable does not update the value returned by the [`mysql_insert_id()`](/doc/c-api/5.7/en/mysql-insert-id.html) C API function.

* [`lc_messages`](server-system-variables.html#sysvar_lc_messages)

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>1

  The locale to use for error messages. The default is `en_US`. The server converts the argument to a language name and combines it with the value of [`lc_messages_dir`](server-system-variables.html#sysvar_lc_messages_dir) to produce the location for the error message file. See [Section 10.12, “Setting the Error Message Language”](error-message-language.html "10.12 Setting the Error Message Language").

* [`lc_messages_dir`](server-system-variables.html#sysvar_lc_messages_dir)

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>2

  The directory where error messages are located. The server uses the value together with the value of [`lc_messages`](server-system-variables.html#sysvar_lc_messages) to produce the location for the error message file. See [Section 10.12, “Setting the Error Message Language”](error-message-language.html "10.12 Setting the Error Message Language").

* [`lc_time_names`](server-system-variables.html#sysvar_lc_time_names)

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>3

  This variable specifies the locale that controls the language used to display day and month names and abbreviations. This variable affects the output from the [`DATE_FORMAT()`](date-and-time-functions.html#function_date-format), [`DAYNAME()`](date-and-time-functions.html#function_dayname) and [`MONTHNAME()`](date-and-time-functions.html#function_monthname) functions. Locale names are POSIX-style values such as `'ja_JP'` or `'pt_BR'`. The default value is `'en_US'` regardless of your system's locale setting. For further information, see [Section 10.16, “MySQL Server Locale Support”](locale-support.html "10.16 MySQL Server Locale Support").

* [`license`](server-system-variables.html#sysvar_license)

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>4

  The type of license the server has.

* [`local_infile`](server-system-variables.html#sysvar_local_infile)

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>5

  This variable controls server-side `LOCAL` capability for [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") statements. Depending on the [`local_infile`](server-system-variables.html#sysvar_local_infile) setting, the server refuses or permits local data loading by clients that have `LOCAL` enabled on the client side.

  To explicitly cause the server to refuse or permit [`LOAD DATA LOCAL`](load-data.html "13.2.6 LOAD DATA Statement") statements (regardless of how client programs and libraries are configured at build time or runtime), start [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") with [`local_infile`](server-system-variables.html#sysvar_local_infile) disabled or enabled, respectively. [`local_infile`](server-system-variables.html#sysvar_local_infile) can also be set at runtime. For more information, see [Section 6.1.6, “Security Considerations for LOAD DATA LOCAL”](load-data-local-security.html "6.1.6 Security Considerations for LOAD DATA LOCAL").

* [`lock_wait_timeout`](server-system-variables.html#sysvar_lock_wait_timeout)

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>6

  This variable specifies the timeout in seconds for attempts to acquire metadata locks. The permissible values range from 1 to 31536000 (1 year). The default is 31536000.

  This timeout applies to all statements that use metadata locks. These include DML and DDL operations on tables, views, stored procedures, and stored functions, as well as [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements"), [`FLUSH TABLES WITH READ LOCK`](flush.html#flush-tables-with-read-lock), and [`HANDLER`](handler.html "13.2.4 HANDLER Statement") statements.

  This timeout does not apply to implicit accesses to system tables in the `mysql` database, such as grant tables modified by [`GRANT`](grant.html "13.7.1.4 GRANT Statement") or [`REVOKE`](revoke.html "13.7.1.6 REVOKE Statement") statements or table logging statements. The timeout does apply to system tables accessed directly, such as with [`SELECT`](select.html "13.2.9 SELECT Statement") or [`UPDATE`](update.html "13.2.11 UPDATE Statement").

  The timeout value applies separately for each metadata lock attempt. A given statement can require more than one lock, so it is possible for the statement to block for longer than the [`lock_wait_timeout`](server-system-variables.html#sysvar_lock_wait_timeout) value before reporting a timeout error. When lock timeout occurs, [`ER_LOCK_WAIT_TIMEOUT`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_lock_wait_timeout) is reported.

  [`lock_wait_timeout`](server-system-variables.html#sysvar_lock_wait_timeout) does not apply to delayed inserts, which always execute with a timeout of 1 year. This is done to avoid unnecessary timeouts because a session that issues a delayed insert receives no notification of delayed insert timeouts.

* [`locked_in_memory`](server-system-variables.html#sysvar_locked_in_memory)

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>7

  Whether [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") was locked in memory with [`--memlock`](server-options.html#option_mysqld_memlock).

* [`log_error`](server-system-variables.html#sysvar_log_error)

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>8

  The error log output destination. If the destination is the console, the value is `stderr`. Otherwise, the destination is a file and the [`log_error`](server-system-variables.html#sysvar_log_error) value is the file name. See [Section 5.4.2, “The Error Log”](error-log.html "5.4.2 The Error Log").

* [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity)

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_basedir">basedir</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>configuration-dependent default</code></td> </tr></tbody></table>9

  The verbosity of the server in writing error, warning, and note messages to the error log. The following table shows the permitted values. The default is 3.

  <table frame="box" rules="all" summary="Properties for big_tables"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_big_tables">big_tables</a></code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>0

  [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity) was added in MySQL 5.7.2. It is preferred over, and should be used instead of, the older [`log_warnings`](server-system-variables.html#sysvar_log_warnings) system variable. See the description of [`log_warnings`](server-system-variables.html#sysvar_log_warnings) for information about how that variable relates to [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity). In particular, assigning a value to [`log_warnings`](server-system-variables.html#sysvar_log_warnings) assigns a value to [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity) and vice versa.

* [`log_output`](server-system-variables.html#sysvar_log_output)

  <table frame="box" rules="all" summary="Properties for big_tables"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_big_tables">big_tables</a></code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>1

  The destination or destinations for general query log and slow query log output. The value is a list one or more comma-separated words chosen from `TABLE`, `FILE`, and `NONE`. `TABLE` selects logging to the [`general_log`](server-system-variables.html#sysvar_general_log) and `slow_log` tables in the `mysql` system database. `FILE` selects logging to log files. `NONE` disables logging. If `NONE` is present in the value, it takes precedence over any other words that are present. `TABLE` and `FILE` can both be given to select both log output destinations.

  This variable selects log output destinations, but does not enable log output. To do that, enable the [`general_log`](server-system-variables.html#sysvar_general_log) and [`slow_query_log`](server-system-variables.html#sysvar_slow_query_log) system variables. For `FILE` logging, the [`general_log_file`](server-system-variables.html#sysvar_general_log_file) and [`slow_query_log_file`](server-system-variables.html#sysvar_slow_query_log_file) system variables determine the log file locations. For more information, see [Section 5.4.1, “Selecting General Query Log and Slow Query Log Output Destinations”](log-destinations.html "5.4.1 Selecting General Query Log and Slow Query Log Output Destinations").

* [`log_queries_not_using_indexes`](server-system-variables.html#sysvar_log_queries_not_using_indexes)

  <table frame="box" rules="all" summary="Properties for big_tables"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_big_tables">big_tables</a></code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>2

  If you enable this variable with the slow query log enabled, queries that are expected to retrieve all rows are logged. See [Section 5.4.5, “The Slow Query Log”](slow-query-log.html "5.4.5 The Slow Query Log"). This option does not necessarily mean that no index is used. For example, a query that uses a full index scan uses an index but would be logged because the index would not limit the number of rows.

* [`log_slow_admin_statements`](server-system-variables.html#sysvar_log_slow_admin_statements)

  <table frame="box" rules="all" summary="Properties for big_tables"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_big_tables">big_tables</a></code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>3

  Include slow administrative statements in the statements written to the slow query log. Administrative statements include [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"), [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement"), [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement"), [`CREATE INDEX`](create-index.html "13.1.14 CREATE INDEX Statement"), [`DROP INDEX`](drop-index.html "13.1.25 DROP INDEX Statement"), [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement"), and [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement").

* [`log_syslog`](server-system-variables.html#sysvar_log_syslog)

  <table frame="box" rules="all" summary="Properties for big_tables"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_big_tables">big_tables</a></code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>4

  Whether to write error log output to the system log. This is the Event Log on Windows, and `syslog` on Unix and Unix-like systems. The default value is platform specific:

  + On Windows, Event Log output is enabled by default.
  + On Unix and Unix-like systems, `syslog` output is disabled by default.

  Regardless of the default, [`log_syslog`](server-system-variables.html#sysvar_log_syslog) can be set explicitly to control output on any supported platform.

  System log output control is distinct from sending error output to a file or the console. Error output can be directed to a file or the console in addition to or instead of the system log as desired. See [Section 5.4.2, “The Error Log”](error-log.html "5.4.2 The Error Log").

* [`log_syslog_facility`](server-system-variables.html#sysvar_log_syslog_facility)

  <table frame="box" rules="all" summary="Properties for big_tables"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_big_tables">big_tables</a></code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>5

  The facility for error log output written to `syslog` (what type of program is sending the message). This variable has no effect unless the [`log_syslog`](server-system-variables.html#sysvar_log_syslog) system variable is enabled. See [Section 5.4.2.3, “Error Logging to the System Log”](error-log-syslog.html "5.4.2.3 Error Logging to the System Log").

  The permitted values can vary per operating system; consult your system `syslog` documentation.

  This variable does not exist on Windows.

* [`log_syslog_include_pid`](server-system-variables.html#sysvar_log_syslog_include_pid)

  <table frame="box" rules="all" summary="Properties for big_tables"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_big_tables">big_tables</a></code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>6

  Whether to include the server process ID in each line of error log output written to `syslog`. This variable has no effect unless the [`log_syslog`](server-system-variables.html#sysvar_log_syslog) system variable is enabled. See [Section 5.4.2.3, “Error Logging to the System Log”](error-log-syslog.html "5.4.2.3 Error Logging to the System Log").

  This variable does not exist on Windows.

* [`log_syslog_tag`](server-system-variables.html#sysvar_log_syslog_tag)

  <table frame="box" rules="all" summary="Properties for big_tables"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_big_tables">big_tables</a></code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>7

  The tag to be added to the server identifier in error log output written to `syslog`. This variable has no effect unless the [`log_syslog`](server-system-variables.html#sysvar_log_syslog) system variable is enabled. See [Section 5.4.2.3, “Error Logging to the System Log”](error-log-syslog.html "5.4.2.3 Error Logging to the System Log").

  By default, the server identifier is `mysqld` with no tag. If a tag value of *`tag`* is specified, it is appended to the server identifier with a leading hyphen, resulting in an identifier of `mysqld-tag`.

  On Windows, to use a tag that does not already exist, the server must be run from an account with Administrator privileges, to permit creation of a registry entry for the tag. Elevated privileges are not required if the tag already exists.

* [`log_timestamps`](server-system-variables.html#sysvar_log_timestamps)

  <table frame="box" rules="all" summary="Properties for big_tables"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_big_tables">big_tables</a></code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>8

  This variable controls the time zone of timestamps in messages written to the error log, and in general query log and slow query log messages written to files. It does not affect the time zone of general query log and slow query log messages written to tables (`mysql.general_log`, `mysql.slow_log`). Rows retrieved from those tables can be converted from the local system time zone to any desired time zone with [`CONVERT_TZ()`](date-and-time-functions.html#function_convert-tz) or by setting the session [`time_zone`](server-system-variables.html#sysvar_time_zone) system variable.

  Permitted [`log_timestamps`](server-system-variables.html#sysvar_log_timestamps) values are `UTC` (the default) and `SYSTEM` (local system time zone).

  Timestamps are written using ISO 8601 / RFC 3339 format: `YYYY-MM-DDThh:mm:ss.uuuuuu` plus a tail value of `Z` signifying Zulu time (UTC) or `±hh:mm` (an offset from UTC).

* [`log_throttle_queries_not_using_indexes`](server-system-variables.html#sysvar_log_throttle_queries_not_using_indexes)

  <table frame="box" rules="all" summary="Properties for big_tables"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--big-tables[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_big_tables">big_tables</a></code></td> </tr><tr><th>Scope</th> <td>Global, Session</td> </tr><tr><th>Dynamic</th> <td>Yes</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>9

  If [`log_queries_not_using_indexes`](server-system-variables.html#sysvar_log_queries_not_using_indexes) is enabled, the [`log_throttle_queries_not_using_indexes`](server-system-variables.html#sysvar_log_throttle_queries_not_using_indexes) variable limits the number of such queries per minute that can be written to the slow query log. A value of 0 (the default) means “no limit”. For more information, see [Section 5.4.5, “The Slow Query Log”](slow-query-log.html "5.4.5 The Slow Query Log").

* [`log_warnings`](server-system-variables.html#sysvar_log_warnings)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>00

  Whether to produce additional warning messages to the error log. As of MySQL 5.7.2, information items previously governed by [`log_warnings`](server-system-variables.html#sysvar_log_warnings) are governed by [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity), which is preferred over, and should be used instead of, the older [`log_warnings`](server-system-variables.html#sysvar_log_warnings) system variable. (The [`log_warnings`](server-system-variables.html#sysvar_log_warnings) system variable and [`--log-warnings`](server-options.html#option_mysqld_log-warnings) command-line option are deprecated; expect them to be removed in a future release of MySQL.)

  [`log_warnings`](server-system-variables.html#sysvar_log_warnings) is enabled by default (the default is 1 before MySQL 5.7.2, 2 as of 5.7.2). To disable it, set it to 0. If the value is greater than 0, the server logs messages about statements that are unsafe for statement-based logging. If the value is greater than 1, the server logs aborted connections and access-denied errors for new connection attempts. See [Section B.3.2.9, “Communication Errors and Aborted Connections”](communication-errors.html "B.3.2.9 Communication Errors and Aborted Connections").

  If you use replication, enabling this variable by setting it greater than 0 is recommended, to get more information about what is happening, such as messages about network failures and reconnections.

  If a replica server is started with [`log_warnings`](server-system-variables.html#sysvar_log_warnings) enabled, the replica prints messages to the error log to provide information about its status, such as the binary log and relay log coordinates where it starts its job, when it is switching to another relay log, when it reconnects after a disconnect, and so forth.

  Assigning a value to [`log_warnings`](server-system-variables.html#sysvar_log_warnings) assigns a value to [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity) and vice versa. The variables are related as follows:

  + Suppression of all [`log_warnings`](server-system-variables.html#sysvar_log_warnings) items, achieved with [`log_warnings=0`](server-system-variables.html#sysvar_log_warnings), is achieved with [`log_error_verbosity=1`](server-system-variables.html#sysvar_log_error_verbosity) (errors only).

  + Items printed for [`log_warnings=1`](server-system-variables.html#sysvar_log_warnings) or higher count as warnings and are printed for [`log_error_verbosity=2`](server-system-variables.html#sysvar_log_error_verbosity) or higher.

  + Items printed for [`log_warnings=2`](server-system-variables.html#sysvar_log_warnings) count as notes and are printed for [`log_error_verbosity=3`](server-system-variables.html#sysvar_log_error_verbosity).

  As of MySQL 5.7.2, the default log level is controlled by [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity), which has a default of 3. In addition, the default for [`log_warnings`](server-system-variables.html#sysvar_log_warnings) changes from 1 to 2, which corresponds to [`log_error_verbosity=3`](server-system-variables.html#sysvar_log_error_verbosity). To achieve a logging level similar to the previous default, set [`log_error_verbosity=2`](server-system-variables.html#sysvar_log_error_verbosity).

  In MySQL 5.7.2 and higher, use of [`log_warnings`](server-system-variables.html#sysvar_log_warnings) is still permitted but maps onto use of [`log_error_verbosity`](server-system-variables.html#sysvar_log_error_verbosity) as follows:

  + Setting [`log_warnings=0`](server-system-variables.html#sysvar_log_warnings) is equivalent to [`log_error_verbosity=1`](server-system-variables.html#sysvar_log_error_verbosity) (errors only).

  + Setting [`log_warnings=1`](server-system-variables.html#sysvar_log_warnings) is equivalent to [`log_error_verbosity=2`](server-system-variables.html#sysvar_log_error_verbosity) (errors, warnings).

  + Setting [`log_warnings=2`](server-system-variables.html#sysvar_log_warnings) (or higher) is equivalent to [`log_error_verbosity=3`](server-system-variables.html#sysvar_log_error_verbosity) (errors, warnings, notes), and the server sets [`log_warnings`](server-system-variables.html#sysvar_log_warnings) to 2 if a larger value is specified.

* [`long_query_time`](server-system-variables.html#sysvar_long_query_time)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>01

  If a query takes longer than this many seconds, the server increments the [`Slow_queries`](server-status-variables.html#statvar_Slow_queries) status variable. If the slow query log is enabled, the query is logged to the slow query log file. This value is measured in real time, not CPU time, so a query that is under the threshold on a lightly loaded system might be above the threshold on a heavily loaded one. The minimum and default values of [`long_query_time`](server-system-variables.html#sysvar_long_query_time) are 0 and 10, respectively. The maximum is 31536000, which is 365 days in seconds. The value can be specified to a resolution of microseconds. See [Section 5.4.5, “The Slow Query Log”](slow-query-log.html "5.4.5 The Slow Query Log").

  Smaller values of this variable result in more statements being considered long-running, with the result that more space is required for the slow query log. For very small values (less than one second), the log may grow quite large in a small time. Increasing the number of statements considered long-running may also result in false positives for the “excessive Number of Long Running Processes” alert in MySQL Enterprise Monitor, especially if Group Replication is enabled. For these reasons, very small values should be used in test environments only, or, in production environments, only for a short period.

* [`low_priority_updates`](server-system-variables.html#sysvar_low_priority_updates)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>02

  If set to `1`, all [`INSERT`](insert.html "13.2.5 INSERT Statement"), [`UPDATE`](update.html "13.2.11 UPDATE Statement"), [`DELETE`](delete.html "13.2.2 DELETE Statement"), and `LOCK TABLE WRITE` statements wait until there is no pending [`SELECT`](select.html "13.2.9 SELECT Statement") or `LOCK TABLE READ` on the affected table. The same effect can be obtained using `{INSERT | REPLACE | DELETE | UPDATE} LOW_PRIORITY ...` to lower the priority of only one query. This variable affects only storage engines that use only table-level locking (such as `MyISAM`, `MEMORY`, and `MERGE`). See [Section 8.11.2, “Table Locking Issues”](table-locking.html "8.11.2 Table Locking Issues").

* [`lower_case_file_system`](server-system-variables.html#sysvar_lower_case_file_system)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>03

  This variable describes the case sensitivity of file names on the file system where the data directory is located. `OFF` means file names are case-sensitive, `ON` means they are not case-sensitive. This variable is read only because it reflects a file system attribute and setting it would have no effect on the file system.

* [`lower_case_table_names`](server-system-variables.html#sysvar_lower_case_table_names)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>04

  If set to 0, table names are stored as specified and comparisons are case-sensitive. If set to 1, table names are stored in lowercase on disk and comparisons are not case-sensitive. If set to 2, table names are stored as given but compared in lowercase. This option also applies to database names and table aliases. For additional details, see [Section 9.2.3, “Identifier Case Sensitivity”](identifier-case-sensitivity.html "9.2.3 Identifier Case Sensitivity").

  The default value of this variable is platform-dependent (see [`lower_case_file_system`](server-system-variables.html#sysvar_lower_case_file_system)). On Linux and other Unix-like systems, the default is `0`. On Windows the default value is `1`. On macOS, the default value is `2`. On Linux (and other Unix-like systems), setting the value to `2` is not supported; the server forces the value to `0` instead.

  You should *not* set [`lower_case_table_names`](server-system-variables.html#sysvar_lower_case_table_names) to 0 if you are running MySQL on a system where the data directory resides on a case-insensitive file system (such as on Windows or macOS). It is an unsupported combination that could result in a hang condition when running an `INSERT INTO ... SELECT ... FROM tbl_name` operation with the wrong *`tbl_name`* lettercase. With `MyISAM`, accessing table names using different lettercases could cause index corruption.

  An error message is printed and the server exits if you attempt to start the server with [`--lower_case_table_names=0`](server-system-variables.html#sysvar_lower_case_table_names) on a case-insensitive file system.

  The setting of this variable affects the behavior of replication filtering options with regard to case sensitivity. For more information, see [Section 16.2.5, “How Servers Evaluate Replication Filtering Rules”](replication-rules.html "16.2.5 How Servers Evaluate Replication Filtering Rules").

* [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>05

  The maximum size of one packet or any generated/intermediate string, or any parameter sent by the [`mysql_stmt_send_long_data()`](/doc/c-api/5.7/en/mysql-stmt-send-long-data.html) C API function. The default is 4MB.

  The packet message buffer is initialized to [`net_buffer_length`](server-system-variables.html#sysvar_net_buffer_length) bytes, but can grow up to [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet) bytes when needed. This value by default is small, to catch large (possibly incorrect) packets.

  You must increase this value if you are using large [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") columns or long strings. It should be as big as the largest [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") you want to use. The protocol limit for [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet) is 1GB. The value should be a multiple of 1024; nonmultiples are rounded down to the nearest multiple.

  When you change the message buffer size by changing the value of the [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet) variable, you should also change the buffer size on the client side if your client program permits it. The default [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet) value built in to the client library is 1GB, but individual client programs might override this. For example, [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") and [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") have defaults of 16MB and 24MB, respectively. They also enable you to change the client-side value by setting [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet) on the command line or in an option file.

  The session value of this variable is read only. The client can receive up to as many bytes as the session value. However, the server cannot send to the client more bytes than the current global [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet) value. (The global value could be less than the session value if the global value is changed after the client connects.)

* [`max_connect_errors`](server-system-variables.html#sysvar_max_connect_errors)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>06

  After [`max_connect_errors`](server-system-variables.html#sysvar_max_connect_errors) successive connection requests from a host are interrupted without a successful connection, the server blocks that host from further connections. If a connection from a host is established successfully within fewer than [`max_connect_errors`](server-system-variables.html#sysvar_max_connect_errors) attempts after a previous connection was interrupted, the error count for the host is cleared to zero. To unblock blocked hosts, flush the host cache; see [Flushing the Host Cache](host-cache.html#host-cache-flushing "Flushing the Host Cache").

* [`max_connections`](server-system-variables.html#sysvar_max_connections)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>07

  The maximum permitted number of simultaneous client connections. The maximum effective value is the lesser of the effective value of [`open_files_limit`](server-system-variables.html#sysvar_open_files_limit) `- 810`, and the value actually set for `max_connections`.

  For more information, see [Section 5.1.11.1, “Connection Interfaces”](connection-interfaces.html "5.1.11.1 Connection Interfaces").

* [`max_delayed_threads`](server-system-variables.html#sysvar_max_delayed_threads)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>08

  This system variable is deprecated (because `DELAYED` inserts are not supported); expect it to be removed in a future release.

* [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>09

  The maximum number of bytes of memory reserved per session for computation of normalized statement digests. Once that amount of space is used during digest computation, truncation occurs: no further tokens from a parsed statement are collected or figure into its digest value. Statements that differ only after that many bytes of parsed tokens produce the same normalized statement digest and are considered identical if compared or if aggregated for digest statistics.

  The length used for calculating a normalized statement digest is the sum of the length of the normalized statement digest and the length of the statement digest. Since the length of the statement digest is always 64, when the value of `max_digest_length` is 1024 (the default), the maximum length for a normalized SQL statement before truncation occurs is 1024 - 64 = 960 bytes.

  Warning

  Setting [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) to zero disables digest production, which also disables server functionality that requires digests, such as MySQL Enterprise Firewall.

  Decreasing the [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) value reduces memory use but causes the digest value of more statements to become indistinguishable if they differ only at the end. Increasing the value permits longer statements to be distinguished but increases memory use, particularly for workloads that involve large numbers of simultaneous sessions (the server allocates [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length) bytes per session).

  The parser uses this system variable as a limit on the maximum length of normalized statement digests that it computes. The Performance Schema, if it tracks statement digests, makes a copy of the digest value, using the [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length). system variable as a limit on the maximum length of digests that it stores. Consequently, if [`performance_schema_max_digest_length`](performance-schema-system-variables.html#sysvar_performance_schema_max_digest_length) is less than [`max_digest_length`](server-system-variables.html#sysvar_max_digest_length), digest values stored in the Performance Schema are truncated relative to the original digest values.

  For more information about statement digesting, see [Section 25.10, “Performance Schema Statement Digests”](performance-schema-statement-digests.html "25.10 Performance Schema Statement Digests").

* [`max_error_count`](server-system-variables.html#sysvar_max_error_count)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>10

  The maximum number of error, warning, and information messages to be stored for display by the [`SHOW ERRORS`](show-errors.html "13.7.5.17 SHOW ERRORS Statement") and [`SHOW WARNINGS`](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement") statements. This is the same as the number of condition areas in the diagnostics area, and thus the number of conditions that can be inspected by [`GET DIAGNOSTICS`](get-diagnostics.html "13.6.7.3 GET DIAGNOSTICS Statement").

* [`max_execution_time`](server-system-variables.html#sysvar_max_execution_time)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>11

  The execution timeout for [`SELECT`](select.html "13.2.9 SELECT Statement") statements, in milliseconds. If the value is 0, timeouts are not enabled.

  [`max_execution_time`](server-system-variables.html#sysvar_max_execution_time) applies as follows:

  + The global [`max_execution_time`](server-system-variables.html#sysvar_max_execution_time) value provides the default for the session value for new connections. The session value applies to `SELECT` executions executed within the session that include no [`MAX_EXECUTION_TIME(N)`](optimizer-hints.html#optimizer-hints-execution-time "Statement Execution Time Optimizer Hints") optimizer hint or for which *`N`* is 0.

  + [`max_execution_time`](server-system-variables.html#sysvar_max_execution_time) applies to read-only [`SELECT`](select.html "13.2.9 SELECT Statement") statements. Statements that are not read only are those that invoke a stored function that modifies data as a side effect.

  + [`max_execution_time`](server-system-variables.html#sysvar_max_execution_time) is ignored for [`SELECT`](select.html "13.2.9 SELECT Statement") statements in stored programs.

* [`max_heap_table_size`](server-system-variables.html#sysvar_max_heap_table_size)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>12

  This variable sets the maximum size to which user-created `MEMORY` tables are permitted to grow. The value of the variable is used to calculate `MEMORY` table `MAX_ROWS` values.

  Setting this variable has no effect on any existing `MEMORY` table, unless the table is re-created with a statement such as [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") or altered with [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") or [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement"). A server restart also sets the maximum size of existing `MEMORY` tables to the global [`max_heap_table_size`](server-system-variables.html#sysvar_max_heap_table_size) value.

  This variable is also used in conjunction with [`tmp_table_size`](server-system-variables.html#sysvar_tmp_table_size) to limit the size of internal in-memory tables. See [Section 8.4.4, “Internal Temporary Table Use in MySQL”](internal-temporary-tables.html "8.4.4 Internal Temporary Table Use in MySQL").

  `max_heap_table_size` is not replicated. See [Section 16.4.1.20, “Replication and MEMORY Tables”](replication-features-memory.html "16.4.1.20 Replication and MEMORY Tables"), and [Section 16.4.1.37, “Replication and Variables”](replication-features-variables.html "16.4.1.37 Replication and Variables"), for more information.

* [`max_insert_delayed_threads`](server-system-variables.html#sysvar_max_insert_delayed_threads)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>13

  This variable is a synonym for [`max_delayed_threads`](server-system-variables.html#sysvar_max_delayed_threads).

  This system variable is deprecated (because `DELAYED` inserts are not supported); expect it to be removed in a future release.

* [`max_join_size`](server-system-variables.html#sysvar_max_join_size)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>14

  Do not permit statements that probably need to examine more than [`max_join_size`](server-system-variables.html#sysvar_max_join_size) rows (for single-table statements) or row combinations (for multiple-table statements) or that are likely to do more than [`max_join_size`](server-system-variables.html#sysvar_max_join_size) disk seeks. By setting this value, you can catch statements where keys are not used properly and that would probably take a long time. Set it if your users tend to perform joins that lack a `WHERE` clause, that take a long time, or that return millions of rows. For more information, see [Using Safe-Updates Mode (--safe-updates)](mysql-tips.html#safe-updates "Using Safe-Updates Mode (--safe-updates)").

  Setting this variable to a value other than `DEFAULT` resets the value of [`sql_big_selects`](server-system-variables.html#sysvar_sql_big_selects) to `0`. If you set the [`sql_big_selects`](server-system-variables.html#sysvar_sql_big_selects) value again, the [`max_join_size`](server-system-variables.html#sysvar_max_join_size) variable is ignored.

  If a query result is in the query cache, no result size check is performed, because the result has previously been computed and it does not burden the server to send it to the client.

* [`max_length_for_sort_data`](server-system-variables.html#sysvar_max_length_for_sort_data)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>15

  The cutoff on the size of index values that determines which `filesort` algorithm to use. See [Section 8.2.1.14, “ORDER BY Optimization”](order-by-optimization.html "8.2.1.14 ORDER BY Optimization").

* [`max_points_in_geometry`](server-system-variables.html#sysvar_max_points_in_geometry)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>16

  The maximum value of the *`points_per_circle`* argument to the [`ST_Buffer_Strategy()`](spatial-operator-functions.html#function_st-buffer-strategy) function.

* [`max_prepared_stmt_count`](server-system-variables.html#sysvar_max_prepared_stmt_count)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>17

  This variable limits the total number of prepared statements in the server. It can be used in environments where there is the potential for denial-of-service attacks based on running the server out of memory by preparing huge numbers of statements. If the value is set lower than the current number of prepared statements, existing statements are not affected and can be used, but no new statements can be prepared until the current number drops below the limit. Setting the value to 0 disables prepared statements.

* [`max_seeks_for_key`](server-system-variables.html#sysvar_max_seeks_for_key)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>18

  Limit the assumed maximum number of seeks when looking up rows based on a key. The MySQL optimizer assumes that no more than this number of key seeks are required when searching for matching rows in a table by scanning an index, regardless of the actual cardinality of the index (see [Section 13.7.5.22, “SHOW INDEX Statement”](show-index.html "13.7.5.22 SHOW INDEX Statement")). By setting this to a low value (say, 100), you can force MySQL to prefer indexes instead of table scans.

* [`max_sort_length`](server-system-variables.html#sysvar_max_sort_length)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>19

  The number of bytes to use when sorting data values. The server uses only the first [`max_sort_length`](server-system-variables.html#sysvar_max_sort_length) bytes of each value and ignores the rest. Consequently, values that differ only after the first [`max_sort_length`](server-system-variables.html#sysvar_max_sort_length) bytes compare as equal for `GROUP BY`, `ORDER BY`, and `DISTINCT` operations.

  Increasing the value of [`max_sort_length`](server-system-variables.html#sysvar_max_sort_length) may require increasing the value of [`sort_buffer_size`](server-system-variables.html#sysvar_sort_buffer_size) as well. For details, see [Section 8.2.1.14, “ORDER BY Optimization”](order-by-optimization.html "8.2.1.14 ORDER BY Optimization")

* [`max_sp_recursion_depth`](server-system-variables.html#sysvar_max_sp_recursion_depth)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>20

  The number of times that any given stored procedure may be called recursively. The default value for this option is 0, which completely disables recursion in stored procedures. The maximum value is 255.

  Stored procedure recursion increases the demand on thread stack space. If you increase the value of [`max_sp_recursion_depth`](server-system-variables.html#sysvar_max_sp_recursion_depth), it may be necessary to increase thread stack size by increasing the value of [`thread_stack`](server-system-variables.html#sysvar_thread_stack) at server startup.

* [`max_tmp_tables`](server-system-variables.html#sysvar_max_tmp_tables)

  This variable is unused. It is deprecated and is removed in MySQL 8.0.

* [`max_user_connections`](server-system-variables.html#sysvar_max_user_connections)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>21

  The maximum number of simultaneous connections permitted to any given MySQL user account. A value of 0 (the default) means “no limit.”

  This variable has a global value that can be set at server startup or runtime. It also has a read-only session value that indicates the effective simultaneous-connection limit that applies to the account associated with the current session. The session value is initialized as follows:

  + If the user account has a nonzero `MAX_USER_CONNECTIONS` resource limit, the session [`max_user_connections`](server-system-variables.html#sysvar_max_user_connections) value is set to that limit.

  + Otherwise, the session [`max_user_connections`](server-system-variables.html#sysvar_max_user_connections) value is set to the global value.

  Account resource limits are specified using the [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") or [`ALTER USER`](alter-user.html "13.7.1.1 ALTER USER Statement") statement. See [Section 6.2.16, “Setting Account Resource Limits”](user-resources.html "6.2.16 Setting Account Resource Limits").

* [`max_write_lock_count`](server-system-variables.html#sysvar_max_write_lock_count)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>22

  After this many write locks, permit some pending read lock requests to be processed in between. Write lock requests have higher priority than read lock requests. However, if [`max_write_lock_count`](server-system-variables.html#sysvar_max_write_lock_count) is set to some low value (say, 10), read lock requests may be preferred over pending write lock requests if the read lock requests have already been passed over in favor of 10 write lock requests. Normally this behavior does not occur because [`max_write_lock_count`](server-system-variables.html#sysvar_max_write_lock_count) by default has a very large value.

* `mecab_rc_file`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>23

  The `mecab_rc_file` option is used when setting up the MeCab full-text parser.

  The `mecab_rc_file` option defines the path to the `mecabrc` configuration file, which is the configuration file for MeCab. The option is read-only and can only be set at startup. The `mecabrc` configuration file is required to initialize MeCab.

  For information about the MeCab full-text parser, see [Section 12.9.9, “MeCab Full-Text Parser Plugin”](fulltext-search-mecab.html "12.9.9 MeCab Full-Text Parser Plugin").

  For information about options that can be specified in the MeCab `mecabrc` configuration file, refer to the [MeCab Documentation](http://mecab.googlecode.com/svn/trunk/mecab/doc/index.html) on the [Google Developers](https://code.google.com/) site.

* [`metadata_locks_cache_size`](server-system-variables.html#sysvar_metadata_locks_cache_size)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>24

  The size of the metadata locks cache. The server uses this cache to avoid creation and destruction of synchronization objects. This is particularly helpful on systems where such operations are expensive, such as Windows XP.

  In MySQL 5.7.4, metadata locking implementation changes make this variable unnecessary, and so it is deprecated; expect it to be removed in a future release of MySQL.

* [`metadata_locks_hash_instances`](server-system-variables.html#sysvar_metadata_locks_hash_instances)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>25

  The set of metadata locks can be partitioned into separate hashes to permit connections accessing different objects to use different locking hashes and reduce contention. The [`metadata_locks_hash_instances`](server-system-variables.html#sysvar_metadata_locks_hash_instances) system variable specifies the number of hashes (default 8).

  In MySQL 5.7.4, metadata locking implementation changes make this variable unnecessary, and so it is deprecated; expect it to be removed in a future release of MySQL.

* [`min_examined_row_limit`](server-system-variables.html#sysvar_min_examined_row_limit)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>26

  Queries that examine fewer than this number of rows are not logged to the slow query log.

* [`multi_range_count`](server-system-variables.html#sysvar_multi_range_count)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>27

  This variable has no effect. It is deprecated and is removed in MySQL 8.0.

* [`myisam_data_pointer_size`](server-system-variables.html#sysvar_myisam_data_pointer_size)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>28

  The default pointer size in bytes, to be used by [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") for `MyISAM` tables when no `MAX_ROWS` option is specified. This variable cannot be less than 2 or larger than 7. The default value is

  6. See [Section B.3.2.10, “The table is full”](full-table.html "B.3.2.10 The table is full").
* [`myisam_max_sort_file_size`](server-system-variables.html#sysvar_myisam_max_sort_file_size)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>29

  The maximum size of the temporary file that MySQL is permitted to use while re-creating a `MyISAM` index (during [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement"), [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"), or [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement")). If the file size would be larger than this value, the index is created using the key cache instead, which is slower. The value is given in bytes.

  If `MyISAM` index files exceed this size and disk space is available, increasing the value may help performance. The space must be available in the file system containing the directory where the original index file is located.

* [`myisam_mmap_size`](server-system-variables.html#sysvar_myisam_mmap_size)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>30

  The maximum amount of memory to use for memory mapping compressed [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") files. If many compressed `MyISAM` tables are used, the value can be decreased to reduce the likelihood of memory-swapping problems.

* [`myisam_recover_options`](server-system-variables.html#sysvar_myisam_recover_options)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>31

  Set the `MyISAM` storage engine recovery mode. The variable value is any combination of the values of `OFF`, `DEFAULT`, `BACKUP`, `FORCE`, or `QUICK`. If you specify multiple values, separate them by commas. Specifying the variable with no value at server startup is the same as specifying `DEFAULT`, and specifying with an explicit value of `""` disables recovery (same as a value of `OFF`). If recovery is enabled, each time [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") opens a `MyISAM` table, it checks whether the table is marked as crashed or was not closed properly. (The last option works only if you are running with external locking disabled.) If this is the case, [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") runs a check on the table. If the table was corrupted, [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") attempts to repair it.

  The following options affect how the repair works.

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>32

  Before the server automatically repairs a table, it writes a note about the repair to the error log. If you want to be able to recover from most problems without user intervention, you should use the options `BACKUP,FORCE`. This forces a repair of a table even if some rows would be deleted, but it keeps the old data file as a backup so that you can later examine what happened.

  See [Section 15.2.1, “MyISAM Startup Options”](myisam-start.html "15.2.1 MyISAM Startup Options").

* [`myisam_repair_threads`](server-system-variables.html#sysvar_myisam_repair_threads)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>33

  Note

  This system variable is deprecated in MySQL 5.7; expect it to be removed in a future release of MySQL.

  From MySQL 5.7.38, values other than 1 produce a warning.

  If this value is greater than 1, `MyISAM` table indexes are created in parallel (each index in its own thread) during the `Repair by sorting` process. The default value is 1.

  Note

  Multithreaded repair is *beta-quality* code.

* [`myisam_sort_buffer_size`](server-system-variables.html#sysvar_myisam_sort_buffer_size)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>34

  The size of the buffer that is allocated when sorting `MyISAM` indexes during a [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") or when creating indexes with [`CREATE INDEX`](create-index.html "13.1.14 CREATE INDEX Statement") or [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement").

* [`myisam_stats_method`](server-system-variables.html#sysvar_myisam_stats_method)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>35

  How the server treats `NULL` values when collecting statistics about the distribution of index values for `MyISAM` tables. This variable has three possible values, `nulls_equal`, `nulls_unequal`, and `nulls_ignored`. For `nulls_equal`, all `NULL` index values are considered equal and form a single value group that has a size equal to the number of `NULL` values. For `nulls_unequal`, `NULL` values are considered unequal, and each `NULL` forms a distinct value group of size

  1. For `nulls_ignored`, `NULL` values are ignored.

  The method that is used for generating table statistics influences how the optimizer chooses indexes for query execution, as described in [Section 8.3.7, “InnoDB and MyISAM Index Statistics Collection”](index-statistics.html "8.3.7 InnoDB and MyISAM Index Statistics Collection").

* [`myisam_use_mmap`](server-system-variables.html#sysvar_myisam_use_mmap)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>36

  Use memory mapping for reading and writing `MyISAM` tables.

* [`mysql_native_password_proxy_users`](server-system-variables.html#sysvar_mysql_native_password_proxy_users)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>37

  This variable controls whether the `mysql_native_password` built-in authentication plugin supports proxy users. It has no effect unless the [`check_proxy_users`](server-system-variables.html#sysvar_check_proxy_users) system variable is enabled. For information about user proxying, see [Section 6.2.14, “Proxy Users”](proxy-users.html "6.2.14 Proxy Users").

* [`named_pipe`](server-system-variables.html#sysvar_named_pipe)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>38

  (Windows only.) Indicates whether the server supports connections over named pipes.

* [`named_pipe_full_access_group`](server-system-variables.html#sysvar_named_pipe_full_access_group)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>39

  (Windows only.) The access control granted to clients on the named pipe created by the MySQL server is set to the minimum necessary for successful communication when the [`named_pipe`](server-system-variables.html#sysvar_named_pipe) system variable is enabled to support named-pipe connections. Some MySQL client software can open named pipe connections without any additional configuration; however, other client software may still require full access to open a named pipe connection.

  This variable sets the name of a Windows local group whose members are granted sufficient access by the MySQL server to use named-pipe clients. As of MySQL 5.7.34, the default value is set to an empty string, which means that no Windows user is granted full access to the named pipe.

  A new Windows local group name (for example, `mysql_access_client_users`) can be created in Windows and then used to replace the default value when access is absolutely necessary. In this case, limit the membership of the group to as few users as possible, removing users from the group when their client software is upgraded. A non-member of the group who attempts to open a connection to MySQL with the affected named-pipe client is denied access until a Windows administrator adds the user to the group. Newly added users must log out and log in again to join the group (required by Windows).

  Setting the value to `'*everyone*'` provides a language-independent way of referring to the Everyone group on Windows. The Everyone group is not secure by default.

* [`net_buffer_length`](server-system-variables.html#sysvar_net_buffer_length)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>40

  Each client thread is associated with a connection buffer and result buffer. Both begin with a size given by [`net_buffer_length`](server-system-variables.html#sysvar_net_buffer_length) but are dynamically enlarged up to [`max_allowed_packet`](server-system-variables.html#sysvar_max_allowed_packet) bytes as needed. The result buffer shrinks to [`net_buffer_length`](server-system-variables.html#sysvar_net_buffer_length) after each SQL statement.

  This variable should not normally be changed, but if you have very little memory, you can set it to the expected length of statements sent by clients. If statements exceed this length, the connection buffer is automatically enlarged. The maximum value to which [`net_buffer_length`](server-system-variables.html#sysvar_net_buffer_length) can be set is 1MB.

  The session value of this variable is read only.

* [`net_read_timeout`](server-system-variables.html#sysvar_net_read_timeout)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>41

  The number of seconds to wait for more data from a connection before aborting the read. When the server is reading from the client, [`net_read_timeout`](server-system-variables.html#sysvar_net_read_timeout) is the timeout value controlling when to abort. When the server is writing to the client, [`net_write_timeout`](server-system-variables.html#sysvar_net_write_timeout) is the timeout value controlling when to abort. See also [`slave_net_timeout`](replication-options-replica.html#sysvar_slave_net_timeout).

* [`net_retry_count`](server-system-variables.html#sysvar_net_retry_count)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>42

  If a read or write on a communication port is interrupted, retry this many times before giving up. This value should be set quite high on FreeBSD because internal interrupts are sent to all threads.

* [`net_write_timeout`](server-system-variables.html#sysvar_net_write_timeout)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>43

  The number of seconds to wait for a block to be written to a connection before aborting the write. See also [`net_read_timeout`](server-system-variables.html#sysvar_net_read_timeout).

* [`new`](server-system-variables.html#sysvar_new)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>44

  This variable was used in MySQL 4.0 to turn on some 4.1 behaviors, and is retained for backward compatibility. Its value is always `OFF`.

  In NDB Cluster, setting this variable to `ON` makes it possible to employ partitioning types other than `KEY` or `LINEAR KEY` with [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables. This experimental feature is not supported in production, and is now deprecated and thus subject to removal in a future release. For additional information, see [User-defined partitioning and the NDB storage engine (NDB Cluster)](partitioning-limitations-storage-engines.html#partitioning-limitations-ndb "User-defined partitioning and the NDB storage engine (NDB Cluster)").

* `ngram_token_size`

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>45

  Defines the n-gram token size for the n-gram full-text parser. The `ngram_token_size` option is read-only and can only be modified at startup. The default value is 2 (bigram). The maximum value is 10.

  For more information about how to configure this variable, see [Section 12.9.8, “ngram Full-Text Parser”](fulltext-search-ngram.html "12.9.8 ngram Full-Text Parser").

* [`offline_mode`](server-system-variables.html#sysvar_offline_mode)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>46

  Whether the server is in “offline mode”, which has these characteristics:

  + Connected client users who do not have the [`SUPER`](privileges-provided.html#priv_super) privilege are disconnected on the next request, with an appropriate error. Disconnection includes terminating running statements and releasing locks. Such clients also cannot initiate new connections, and receive an appropriate error.

  + Connected client users who have the [`SUPER`](privileges-provided.html#priv_super) privilege are not disconnected, and can initiate new connections to manage the server.

  + Replica threads are permitted to keep applying data to the server.

  Only users who have the [`SUPER`](privileges-provided.html#priv_super) privilege can control offline mode. To put a server in offline mode, change the value of the [`offline_mode`](server-system-variables.html#sysvar_offline_mode) system variable from `OFF` to `ON`. To resume normal operations, change [`offline_mode`](server-system-variables.html#sysvar_offline_mode) from `ON` to `OFF`. In offline mode, clients that are refused access receive an [`ER_SERVER_OFFLINE_MODE`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_server_offline_mode) error.

* [`old`](server-system-variables.html#sysvar_old)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>47

  [`old`](server-system-variables.html#sysvar_old) is a compatibility variable. It is disabled by default, but can be enabled at startup to revert the server to behaviors present in older versions.

  When [`old`](server-system-variables.html#sysvar_old) is enabled, it changes the default scope of index hints to that used prior to MySQL 5.1.17. That is, index hints with no `FOR` clause apply only to how indexes are used for row retrieval and not to resolution of `ORDER BY` or `GROUP BY` clauses. (See [Section 8.9.4, “Index Hints”](index-hints.html "8.9.4 Index Hints").) Take care about enabling this in a replication setup. With statement-based binary logging, having different modes for the source and replicas might lead to replication errors.

* [`old_alter_table`](server-system-variables.html#sysvar_old_alter_table)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>48

  When this variable is enabled, the server does not use the optimized method of processing an [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement") operation. It reverts to using a temporary table, copying over the data, and then renaming the temporary table to the original, as used by MySQL 5.0 and earlier. For more information on the operation of [`ALTER TABLE`](alter-table.html "13.1.8 ALTER TABLE Statement"), see [Section 13.1.8, “ALTER TABLE Statement”](alter-table.html "13.1.8 ALTER TABLE Statement").

* [`old_passwords`](server-system-variables.html#sysvar_old_passwords)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>49

  Note

  This system variable is deprecated in MySQL 5.7; expect it to be removed in a future release of MySQL.

  This variable controls the password hashing method used by the [`PASSWORD()`](encryption-functions.html#function_password) function. It also influences password hashing performed by [`CREATE USER`](create-user.html "13.7.1.2 CREATE USER Statement") and [`GRANT`](grant.html "13.7.1.4 GRANT Statement") statements that specify a password using an `IDENTIFIED BY` clause.

  The following table shows, for each password hashing method, the permitted value of `old_passwords` and which authentication plugins use the hashing method.

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>50

  If you set [`old_passwords=2`](server-system-variables.html#sysvar_old_passwords), follow the instructions for using the `sha256_password` plugin at [Section 6.4.1.5, “SHA-256 Pluggable Authentication”](sha256-pluggable-authentication.html "6.4.1.5 SHA-256 Pluggable Authentication").

  The server sets the global [`old_passwords`](server-system-variables.html#sysvar_old_passwords) value during startup to be consistent with the password hashing method required by the authentication plugin indicated by the [`default_authentication_plugin`](server-system-variables.html#sysvar_default_authentication_plugin) system variable.

  When a client successfully connects to the server, the server sets the session [`old_passwords`](server-system-variables.html#sysvar_old_passwords) value appropriately for the account authentication method. For example, if the account uses the `sha256_password` authentication plugin, the server sets `old_passwords=2`.

  For additional information about authentication plugins and hashing formats, see [Section 6.2.13, “Pluggable Authentication”](pluggable-authentication.html "6.2.13 Pluggable Authentication"), and [Section 6.1.2.4, “Password Hashing in MySQL”](password-hashing.html "6.1.2.4 Password Hashing in MySQL").

* [`open_files_limit`](server-system-variables.html#sysvar_open_files_limit)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>51

  The number of file descriptors available to [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") from the operating system:

  + At startup, [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") reserves descriptors with `setrlimit()`, using the value requested at by setting this variable directly or by using the [`--open-files-limit`](mysqld-safe.html#option_mysqld_safe_open-files-limit) option to [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script"). If [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") produces the error `Too many open files`, try increasing the [`open_files_limit`](server-system-variables.html#sysvar_open_files_limit) value. Internally, the maximum value for this variable is the maximum unsigned integer value, but the actual maximum is platform dependent.

  + At runtime, the value of [`open_files_limit`](server-system-variables.html#sysvar_open_files_limit) indicates the number of file descriptors actually permitted to [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") by the operating system, which might differ from the value requested at startup. If the number of file descriptors requested during startup cannot be allocated, [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") writes a warning to the error log.

  The effective [`open_files_limit`](server-system-variables.html#sysvar_open_files_limit) value is based on the value specified at system startup (if any) and the values of [`max_connections`](server-system-variables.html#sysvar_max_connections) and [`table_open_cache`](server-system-variables.html#sysvar_table_open_cache), using these formulas:

  + `10 + max_connections + (table_open_cache * 2)`

  + `max_connections * 5`
  + The operating system limit if that limit is positive but not Infinity.

  + If the operating system limit is Infinity: `open_files_limit` value if specified at startup, 5000 if not.

  The server attempts to obtain the number of file descriptors using the maximum of those values. If that many descriptors cannot be obtained, the server attempts to obtain as many as the system permits.

  The effective value is 0 on systems where MySQL cannot change the number of open files.

  On Unix, the value cannot be set greater than the value displayed by the **ulimit -n** command. On Linux systems using `systemd`, the value cannot be set greater than `LimitNOFile` (this is `DefaultLimitNOFILE`, if `LimitNOFile` is not set); otherwise, on Linux, the value of `open_files_limit` cannot exceed **ulimit -n**.

* [`optimizer_prune_level`](server-system-variables.html#sysvar_optimizer_prune_level)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>52

  Controls the heuristics applied during query optimization to prune less-promising partial plans from the optimizer search space. A value of 0 disables heuristics so that the optimizer performs an exhaustive search. A value of 1 causes the optimizer to prune plans based on the number of rows retrieved by intermediate plans.

* [`optimizer_search_depth`](server-system-variables.html#sysvar_optimizer_search_depth)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>53

  The maximum depth of search performed by the query optimizer. Values larger than the number of relations in a query result in better query plans, but take longer to generate an execution plan for a query. Values smaller than the number of relations in a query return an execution plan quicker, but the resulting plan may be far from being optimal. If set to 0, the system automatically picks a reasonable value.

* [`optimizer_switch`](server-system-variables.html#sysvar_optimizer_switch)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>54

  The [`optimizer_switch`](server-system-variables.html#sysvar_optimizer_switch) system variable enables control over optimizer behavior. The value of this variable is a set of flags, each of which has a value of `on` or `off` to indicate whether the corresponding optimizer behavior is enabled or disabled. This variable has global and session values and can be changed at runtime. The global default can be set at server startup.

  To see the current set of optimizer flags, select the variable value:

  ```sql
  mysql> SELECT @@optimizer_switch\G
  *************************** 1. row ***************************
  @@optimizer_switch: index_merge=on,index_merge_union=on,
                      index_merge_sort_union=on,
                      index_merge_intersection=on,
                      engine_condition_pushdown=on,
                      index_condition_pushdown=on,
                      mrr=on,mrr_cost_based=on,
                      block_nested_loop=on,batched_key_access=off,
                      materialization=on,semijoin=on,loosescan=on,
                      firstmatch=on,duplicateweedout=on,
                      subquery_materialization_cost_based=on,
                      use_index_extensions=on,
                      condition_fanout_filter=on,derived_merge=on,
                      prefer_ordering_index=on
  ```

  For more information about the syntax of this variable and the optimizer behaviors that it controls, see [Section 8.9.2, “Switchable Optimizations”](switchable-optimizations.html "8.9.2 Switchable Optimizations").

* [`optimizer_trace`](server-system-variables.html#sysvar_optimizer_trace)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>55

  This variable controls optimizer tracing. For details, see [Section 8.15, “Tracing the Optimizer”](optimizer-tracing.html "8.15 Tracing the Optimizer").

* [`optimizer_trace_features`](server-system-variables.html#sysvar_optimizer_trace_features)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>56

  This variable enables or disables selected optimizer tracing features. For details, see [Section 8.15, “Tracing the Optimizer”](optimizer-tracing.html "8.15 Tracing the Optimizer").

* [`optimizer_trace_limit`](server-system-variables.html#sysvar_optimizer_trace_limit)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>57

  The maximum number of optimizer traces to display. For details, see [Section 8.15, “Tracing the Optimizer”](optimizer-tracing.html "8.15 Tracing the Optimizer").

* [`optimizer_trace_max_mem_size`](server-system-variables.html#sysvar_optimizer_trace_max_mem_size)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>58

  The maximum cumulative size of stored optimizer traces. For details, see [Section 8.15, “Tracing the Optimizer”](optimizer-tracing.html "8.15 Tracing the Optimizer").

* [`optimizer_trace_offset`](server-system-variables.html#sysvar_optimizer_trace_offset)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>59

  The offset of optimizer traces to display. For details, see [Section 8.15, “Tracing the Optimizer”](optimizer-tracing.html "8.15 Tracing the Optimizer").

* `performance_schema_xxx`

  Performance Schema system variables are listed in [Section 25.15, “Performance Schema System Variables”](performance-schema-system-variables.html "25.15 Performance Schema System Variables"). These variables may be used to configure Performance Schema operation.

* [`parser_max_mem_size`](server-system-variables.html#sysvar_parser_max_mem_size)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>60

  The maximum amount of memory available to the parser. The default value places no limit on memory available. The value can be reduced to protect against out-of-memory situations caused by parsing long or complex SQL statements.

* [`pid_file`](server-system-variables.html#sysvar_pid_file)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>61

  The path name of the file in which the server writes its process ID. The server creates the file in the data directory unless an absolute path name is given to specify a different directory. If you specify this variable, you must specify a value. If you do not specify this variable, MySQL uses a default value of `host_name.pid`, where *`host_name`* is the name of the host machine.

  The process ID file is used by other programs such as [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") to determine the server's process ID. On Windows, this variable also affects the default error log file name. See [Section 5.4.2, “The Error Log”](error-log.html "5.4.2 The Error Log").

* [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>62

  The path name of the plugin directory.

  If the plugin directory is writable by the server, it may be possible for a user to write executable code to a file in the directory using [`SELECT ... INTO DUMPFILE`](select.html "13.2.9 SELECT Statement"). This can be prevented by making [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) read only to the server or by setting [`secure_file_priv`](server-system-variables.html#sysvar_secure_file_priv) to a directory where [`SELECT`](select.html "13.2.9 SELECT Statement") writes can be made safely.

* [`port`](server-system-variables.html#sysvar_port)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>63

  The number of the port on which the server listens for TCP/IP connections. This variable can be set with the [`--port`](server-options.html#option_mysqld_port) option.

* [`preload_buffer_size`](server-system-variables.html#sysvar_preload_buffer_size)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>64

  The size of the buffer that is allocated when preloading indexes.

* [`profiling`](server-system-variables.html#sysvar_profiling)

  If set to 0 or `OFF` (the default), statement profiling is disabled. If set to 1 or `ON`, statement profiling is enabled and the [`SHOW PROFILE`](show-profile.html "13.7.5.30 SHOW PROFILE Statement") and [`SHOW PROFILES`](show-profiles.html "13.7.5.31 SHOW PROFILES Statement") statements provide access to profiling information. See [Section 13.7.5.31, “SHOW PROFILES Statement”](show-profiles.html "13.7.5.31 SHOW PROFILES Statement").

  This variable is deprecated; expect it to be removed in a future release of MySQL.

* [`profiling_history_size`](server-system-variables.html#sysvar_profiling_history_size)

  The number of statements for which to maintain profiling information if [`profiling`](server-system-variables.html#sysvar_profiling) is enabled. The default value is 15. The maximum value is 100. Setting the value to 0 effectively disables profiling. See [Section 13.7.5.31, “SHOW PROFILES Statement”](show-profiles.html "13.7.5.31 SHOW PROFILES Statement").

  This variable is deprecated; expect it to be removed in a future release of MySQL.

* [`protocol_version`](server-system-variables.html#sysvar_protocol_version)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>65

  The version of the client/server protocol used by the MySQL server.

* [`proxy_user`](server-system-variables.html#sysvar_proxy_user)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>66

  If the current client is a proxy for another user, this variable is the proxy user account name. Otherwise, this variable is `NULL`. See [Section 6.2.14, “Proxy Users”](proxy-users.html "6.2.14 Proxy Users").

* [`pseudo_slave_mode`](server-system-variables.html#sysvar_pseudo_slave_mode)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>67

  This system variable is for internal server use. [`pseudo_slave_mode`](server-system-variables.html#sysvar_pseudo_slave_mode) assists with the correct handling of transactions that originated on older or newer servers than the server currently processing them. [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files") sets the value of [`pseudo_slave_mode`](server-system-variables.html#sysvar_pseudo_slave_mode) to true before executing any SQL statements.

  [`pseudo_slave_mode`](server-system-variables.html#sysvar_pseudo_slave_mode) has the following effects on the handling of prepared XA transactions, which can be attached to or detached from the handling session (by default, the session that issues [`XA START`](xa.html "13.3.7 XA Transactions")):

  + If true, and the handling session has executed an internal-use [`BINLOG`](binlog.html "13.7.6.1 BINLOG Statement") statement, XA transactions are automatically detached from the session as soon as the first part of the transaction up to [`XA PREPARE`](xa.html "13.3.7 XA Transactions") finishes, so they can be committed or rolled back by any session that has the [`XA_RECOVER_ADMIN`](/doc/refman/8.0/en/privileges-provided.html#priv_xa-recover-admin) privilege.

  + If false, XA transactions remain attached to the handling session as long as that session is alive, during which time no other session can commit the transaction. The prepared transaction is only detached if the session disconnects or the server restarts.

* [`pseudo_thread_id`](server-system-variables.html#sysvar_pseudo_thread_id)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>68

  This variable is for internal server use.

  Warning

  Changing the session value of the [`pseudo_thread_id`](server-system-variables.html#sysvar_pseudo_thread_id) system variable changes the value returned by the [`CONNECTION_ID()`](information-functions.html#function_connection-id) function.

* [`query_alloc_block_size`](server-system-variables.html#sysvar_query_alloc_block_size)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>69

  The allocation size in bytes of memory blocks that are allocated for objects created during statement parsing and execution. If you have problems with memory fragmentation, it might help to increase this parameter.

  The block size for the byte number is 1024. A value that is not an exact multiple of the block size is rounded down to the next lower multiple of the block size by MySQL Server before storing the value for the system variable. The parser allows values up to the maximum unsigned integer value for the platform (4294967295 or 232−1 for a 32-bit system, 18446744073709551615 or 264−1 for a 64-bit system) but the actual maximum is a block size lower.

* [`query_cache_limit`](server-system-variables.html#sysvar_query_cache_limit)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>70

  Do not cache results that are larger than this number of bytes. The default value is 1MB.

  Note

  The query cache is deprecated as of MySQL 5.7.20, and is removed in MySQL 8.0. Deprecation includes [`query_cache_limit`](server-system-variables.html#sysvar_query_cache_limit).

* [`query_cache_min_res_unit`](server-system-variables.html#sysvar_query_cache_min_res_unit)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>71

  The minimum size (in bytes) for blocks allocated by the query cache. The default value is 4096 (4KB). Tuning information for this variable is given in [Section 8.10.3.3, “Query Cache Configuration”](query-cache-configuration.html "8.10.3.3 Query Cache Configuration").

  Note

  The query cache is deprecated as of MySQL 5.7.20, and is removed in MySQL 8.0. Deprecation includes [`query_cache_min_res_unit`](server-system-variables.html#sysvar_query_cache_min_res_unit).

* [`query_cache_size`](server-system-variables.html#sysvar_query_cache_size)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>72

  The amount of memory allocated for caching query results. By default, the query cache is disabled. This is achieved using a default value of 1M, with a default for [`query_cache_type`](server-system-variables.html#sysvar_query_cache_type) of 0. (To reduce overhead significantly if you set the size to 0, you should also start the server with [`query_cache_type=0`](server-system-variables.html#sysvar_query_cache_type).

  The permissible values are multiples of 1024; other values are rounded down to the nearest multiple. For nonzero values of [`query_cache_size`](server-system-variables.html#sysvar_query_cache_size), that many bytes of memory are allocated even if [`query_cache_type=0`](server-system-variables.html#sysvar_query_cache_type). See [Section 8.10.3.3, “Query Cache Configuration”](query-cache-configuration.html "8.10.3.3 Query Cache Configuration"), for more information.

  The query cache needs a minimum size of about 40KB to allocate its structures. (The exact size depends on system architecture.) If you set the value of [`query_cache_size`](server-system-variables.html#sysvar_query_cache_size) too small, a warning occurs, as described in [Section 8.10.3.3, “Query Cache Configuration”](query-cache-configuration.html "8.10.3.3 Query Cache Configuration").

  Note

  The query cache is deprecated as of MySQL 5.7.20, and is removed in MySQL 8.0. Deprecation includes [`query_cache_size`](server-system-variables.html#sysvar_query_cache_size).

* [`query_cache_type`](server-system-variables.html#sysvar_query_cache_type)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>73

  Set the query cache type. Setting the `GLOBAL` value sets the type for all clients that connect thereafter. Individual clients can set the `SESSION` value to affect their own use of the query cache. Possible values are shown in the following table.

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>74

  This variable defaults to `OFF`.

  If the server is started with `query_cache_type` set to 0, it does not acquire the query cache mutex at all, which means that the query cache cannot be enabled at runtime and there is reduced overhead in query execution.

  Note

  The query cache is deprecated as of MySQL 5.7.20, and is removed in MySQL 8.0. Deprecation includes [`query_cache_type`](server-system-variables.html#sysvar_query_cache_type).

* [`query_cache_wlock_invalidate`](server-system-variables.html#sysvar_query_cache_wlock_invalidate)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>75

  Normally, when one client acquires a `WRITE` lock on a table, other clients are not blocked from issuing statements that read from the table if the query results are present in the query cache. Setting this variable to 1 causes acquisition of a `WRITE` lock for a table to invalidate any queries in the query cache that refer to the table. This forces other clients that attempt to access the table to wait while the lock is in effect.

  Note

  The query cache is deprecated as of MySQL 5.7.20, and is removed in MySQL 8.0. Deprecation includes [`query_cache_wlock_invalidate`](server-system-variables.html#sysvar_query_cache_wlock_invalidate).

* [`query_prealloc_size`](server-system-variables.html#sysvar_query_prealloc_size)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>76

  The size in bytes of the persistent buffer used for statement parsing and execution. This buffer is not freed between statements. If you are running complex queries, a larger [`query_prealloc_size`](server-system-variables.html#sysvar_query_prealloc_size) value might be helpful in improving performance, because it can reduce the need for the server to perform memory allocation during query execution operations. You should be aware that doing this does not necessarily eliminate allocation completely; the server may still allocate memory in some situations, such as for operations relating to transactions, or to stored programs.

* [`rand_seed1`](server-system-variables.html#sysvar_rand_seed1)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>77

  The [`rand_seed1`](server-system-variables.html#sysvar_rand_seed1) and [`rand_seed2`](server-system-variables.html#sysvar_rand_seed2) variables exist as session variables only, and can be set but not read. The variables—but not their values—are shown in the output of [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement").

  The purpose of these variables is to support replication of the [`RAND()`](mathematical-functions.html#function_rand) function. For statements that invoke [`RAND()`](mathematical-functions.html#function_rand), the source passes two values to the replica, where they are used to seed the random number generator. The replica uses these values to set the session variables [`rand_seed1`](server-system-variables.html#sysvar_rand_seed1) and [`rand_seed2`](server-system-variables.html#sysvar_rand_seed2) so that [`RAND()`](mathematical-functions.html#function_rand) on the replica generates the same value as on the source.

* [`rand_seed2`](server-system-variables.html#sysvar_rand_seed2)

  See the description for [`rand_seed1`](server-system-variables.html#sysvar_rand_seed1).

* [`range_alloc_block_size`](server-system-variables.html#sysvar_range_alloc_block_size)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>78

  The size in bytes of blocks that are allocated when doing range optimization.

  The block size for the byte number is 1024. A value that is not an exact multiple of the block size is rounded down to the next lower multiple of the block size by MySQL Server before storing the value for the system variable. The parser allows values up to the maximum unsigned integer value for the platform (4294967295 or 232−1 for a 32-bit system, 18446744073709551615 or 264−1 for a 64-bit system) but the actual maximum is a block size lower.

* [`range_optimizer_max_mem_size`](server-system-variables.html#sysvar_range_optimizer_max_mem_size)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>79

  The limit on memory consumption for the range optimizer. A value of 0 means “no limit.” If an execution plan considered by the optimizer uses the range access method but the optimizer estimates that the amount of memory needed for this method would exceed the limit, it abandons the plan and considers other plans. For more information, see [Limiting Memory Use for Range Optimization](range-optimization.html#range-optimization-memory-use "Limiting Memory Use for Range Optimization").

* [`rbr_exec_mode`](server-system-variables.html#sysvar_rbr_exec_mode)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>80

  For internal use by [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files"). This variable switches the server between `IDEMPOTENT` mode and `STRICT` mode. `IDEMPOTENT` mode causes suppression of duplicate-key and no-key-found errors in [`BINLOG`](binlog.html "13.7.6.1 BINLOG Statement") statements generated by [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files"). This mode is useful when replaying a row-based binary log on a server that causes conflicts with existing data. [**mysqlbinlog**](mysqlbinlog.html "4.6.7 mysqlbinlog — Utility for Processing Binary Log Files") sets this mode when you specify the [`--idempotent`](mysqlbinlog.html#option_mysqlbinlog_idempotent) option by writing the following to the output:

  ```sql
  SET SESSION RBR_EXEC_MODE=IDEMPOTENT;
  ```

* [`read_buffer_size`](server-system-variables.html#sysvar_read_buffer_size)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>81

  Each thread that does a sequential scan for a `MyISAM` table allocates a buffer of this size (in bytes) for each table it scans. If you do many sequential scans, you might want to increase this value, which defaults to 131072. The value of this variable should be a multiple of 4KB. If it is set to a value that is not a multiple of 4KB, its value is rounded down to the nearest multiple of 4KB.

  This option is also used in the following context for all storage engines:

  + For caching the indexes in a temporary file (not a temporary table), when sorting rows for `ORDER BY`.

  + For bulk insert into partitions.
  + For caching results of nested queries.

  [`read_buffer_size`](server-system-variables.html#sysvar_read_buffer_size) is also used in one other storage engine-specific way: to determine the memory block size for [`MEMORY`](memory-storage-engine.html "15.3 The MEMORY Storage Engine") tables.

  For more information about memory use during different operations, see [Section 8.12.4.1, “How MySQL Uses Memory”](memory-use.html "8.12.4.1 How MySQL Uses Memory").

* [`read_only`](server-system-variables.html#sysvar_read_only)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>82

  If the [`read_only`](server-system-variables.html#sysvar_read_only) system variable is enabled, the server permits no client updates except from users who have the [`SUPER`](privileges-provided.html#priv_super) privilege. This variable is disabled by default.

  The server also supports a [`super_read_only`](server-system-variables.html#sysvar_super_read_only) system variable (disabled by default), which has these effects:

  + If [`super_read_only`](server-system-variables.html#sysvar_super_read_only) is enabled, the server prohibits client updates, even from users who have the [`SUPER`](privileges-provided.html#priv_super) privilege.

  + Setting [`super_read_only`](server-system-variables.html#sysvar_super_read_only) to `ON` implicitly forces [`read_only`](server-system-variables.html#sysvar_read_only) to `ON`.

  + Setting [`read_only`](server-system-variables.html#sysvar_read_only) to `OFF` implicitly forces [`super_read_only`](server-system-variables.html#sysvar_super_read_only) to `OFF`.

  Even with [`read_only`](server-system-variables.html#sysvar_read_only) enabled, the server permits these operations:

  + Updates performed by replication threads, if the server is a replica. In replication setups, it can be useful to enable [`read_only`](server-system-variables.html#sysvar_read_only) on replica servers to ensure that replicas accept updates only from the source server and not from clients.

  + Use of [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement") or [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement") statements. The purpose of read-only mode is to prevent changes to table structure or contents. Analysis and optimization do not qualify as such changes. This means, for example, that consistency checks on read-only replicas can be performed with [**mysqlcheck**](mysqlcheck.html "4.5.3 mysqlcheck — A Table Maintenance Program") [`--all-databases`](mysqlcheck.html#option_mysqlcheck_all-databases) [`--analyze`](mysqlcheck.html#option_mysqlcheck_analyze).

  + Use of [`FLUSH STATUS`](flush.html#flush-status) statements, which are always written to the binary log.

  + Operations on `TEMPORARY` tables.
  + Inserts into the log tables (`mysql.general_log` and `mysql.slow_log`); see [Section 5.4.1, “Selecting General Query Log and Slow Query Log Output Destinations”](log-destinations.html "5.4.1 Selecting General Query Log and Slow Query Log Output Destinations").

  + As of MySQL 5.7.16, updates to Performance Schema tables, such as [`UPDATE`](update.html "13.2.11 UPDATE Statement") or [`TRUNCATE TABLE`](truncate-table.html "13.1.34 TRUNCATE TABLE Statement") operations.

  Changes to [`read_only`](server-system-variables.html#sysvar_read_only) on a replication source server are not replicated to replica servers. The value can be set on a replica independent of the setting on the source.

  The following conditions apply to attempts to enable [`read_only`](server-system-variables.html#sysvar_read_only) (including implicit attempts resulting from enabling [`super_read_only`](server-system-variables.html#sysvar_super_read_only)):

  + The attempt fails and an error occurs if you have any explicit locks (acquired with [`LOCK TABLES`](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements")) or have a pending transaction.

  + The attempt blocks while other clients have any ongoing statement, active `LOCK TABLES WRITE`, or ongoing commit, until the locks are released and the statements and transactions end. While the attempt to enable [`read_only`](server-system-variables.html#sysvar_read_only) is pending, requests by other clients for table locks or to begin transactions also block until [`read_only`](server-system-variables.html#sysvar_read_only) has been set.

  + The attempt blocks if there are active transactions that hold metadata locks, until those transactions end.

  + [`read_only`](server-system-variables.html#sysvar_read_only) can be enabled while you hold a global read lock (acquired with [`FLUSH TABLES WITH READ LOCK`](flush.html#flush-tables-with-read-lock)) because that does not involve table locks.

* [`read_rnd_buffer_size`](server-system-variables.html#sysvar_read_rnd_buffer_size)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>83

  This variable is used for reads from `MyISAM` tables, and, for any storage engine, for Multi-Range Read optimization.

  When reading rows from a `MyISAM` table in sorted order following a key-sorting operation, the rows are read through this buffer to avoid disk seeks. See [Section 8.2.1.14, “ORDER BY Optimization”](order-by-optimization.html "8.2.1.14 ORDER BY Optimization"). Setting the variable to a large value can improve `ORDER BY` performance by a lot. However, this is a buffer allocated for each client, so you should not set the global variable to a large value. Instead, change the session variable only from within those clients that need to run large queries.

  For more information about memory use during different operations, see [Section 8.12.4.1, “How MySQL Uses Memory”](memory-use.html "8.12.4.1 How MySQL Uses Memory"). For information about Multi-Range Read optimization, see [Section 8.2.1.10, “Multi-Range Read Optimization”](mrr-optimization.html "8.2.1.10 Multi-Range Read Optimization").

* [`require_secure_transport`](server-system-variables.html#sysvar_require_secure_transport)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>84

  Whether client connections to the server are required to use some form of secure transport. When this variable is enabled, the server permits only TCP/IP connections encrypted using TLS/SSL, or connections that use a socket file (on Unix) or shared memory (on Windows). The server rejects nonsecure connection attempts, which fail with an [`ER_SECURE_TRANSPORT_REQUIRED`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_secure_transport_required) error.

  This capability supplements per-account SSL requirements, which take precedence. For example, if an account is defined with `REQUIRE SSL`, enabling [`require_secure_transport`](server-system-variables.html#sysvar_require_secure_transport) does not make it possible to use the account to connect using a Unix socket file.

  It is possible for a server to have no secure transports available. For example, a server on Windows supports no secure transports if started without specifying any SSL certificate or key files and with the [`shared_memory`](server-system-variables.html#sysvar_shared_memory) system variable disabled. Under these conditions, attempts to enable [`require_secure_transport`](server-system-variables.html#sysvar_require_secure_transport) at startup cause the server to write a message to the error log and exit. Attempts to enable the variable at runtime fail with an [`ER_NO_SECURE_TRANSPORTS_CONFIGURED`](/doc/mysql-errors/5.7/en/server-error-reference.html#error_er_no_secure_transports_configured) error.

  See also [Configuring Encrypted Connections as Mandatory](using-encrypted-connections.html#mandatory-encrypted-connections "Configuring Encrypted Connections as Mandatory").

* [`secure_auth`](server-system-variables.html#sysvar_secure_auth)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>85

  If this variable is enabled, the server blocks connections by clients that attempt to use accounts that have passwords stored in the old (pre-4.1) format. Enable this variable to prevent all use of passwords employing the old format (and hence insecure communication over the network).

  This variable is deprecated; expect it to be removed in a future release of MySQL. It is always enabled and attempting to disable it produces an error.

  Server startup fails with an error if this variable is enabled and the privilege tables are in pre-4.1 format. See [Section 6.4.1.3, “Migrating Away from Pre-4.1 Password Hashing and the mysql\_old\_password Plugin”](account-upgrades.html "6.4.1.3 Migrating Away from Pre-4.1 Password Hashing and the mysql_old_password Plugin").

  Note

  Passwords that use the pre-4.1 hashing method are less secure than passwords that use the native password hashing method and should be avoided. Pre-4.1 passwords are deprecated and support for them is removed in MySQL 5.7.5. For account upgrade instructions, see [Section 6.4.1.3, “Migrating Away from Pre-4.1 Password Hashing and the mysql\_old\_password Plugin”](account-upgrades.html "6.4.1.3 Migrating Away from Pre-4.1 Password Hashing and the mysql_old_password Plugin").

* [`secure_file_priv`](server-system-variables.html#sysvar_secure_file_priv)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>86

  This variable is used to limit the effect of data import and export operations, such as those performed by the [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") and [`SELECT ... INTO OUTFILE`](select-into.html "13.2.9.1 SELECT ... INTO Statement") statements and the [`LOAD_FILE()`](string-functions.html#function_load-file) function. These operations are permitted only to users who have the [`FILE`](privileges-provided.html#priv_file) privilege.

  [`secure_file_priv`](server-system-variables.html#sysvar_secure_file_priv) may be set as follows:

  + If empty, the variable has no effect. This is not a secure setting.

  + If set to the name of a directory, the server limits import and export operations to work only with files in that directory. The directory must exist; the server does not create it.

  + If set to `NULL`, the server disables import and export operations.

  The default value is platform specific and depends on the value of the [`INSTALL_LAYOUT`](source-configuration-options.html#option_cmake_install_layout) **CMake** option, as shown in the following table. To specify the default [`secure_file_priv`](server-system-variables.html#sysvar_secure_file_priv) value explicitly if you are building from source, use the [`INSTALL_SECURE_FILE_PRIVDIR`](source-configuration-options.html#option_cmake_install_secure_file_privdir) **CMake** option.

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>87

  To set the default [`secure_file_priv`](server-system-variables.html#sysvar_secure_file_priv) value for the `libmysqld` embedded server, use the [`INSTALL_SECURE_FILE_PRIV_EMBEDDEDDIR`](source-configuration-options.html#option_cmake_install_secure_file_priv_embeddeddir) **CMake** option. The default value for this option is `NULL`.

  The server checks the value of [`secure_file_priv`](server-system-variables.html#sysvar_secure_file_priv) at startup and writes a warning to the error log if the value is insecure. A non-`NULL` value is considered insecure if it is empty, or the value is the data directory or a subdirectory of it, or a directory that is accessible by all users. If [`secure_file_priv`](server-system-variables.html#sysvar_secure_file_priv) is set to a nonexistent path, the server writes an error message to the error log and exits.

* [`session_track_gtids`](server-system-variables.html#sysvar_session_track_gtids)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>88

  Controls whether the server returns GTIDs to the client, enabling the client to use them to track the server state. Depending on the variable value, at the end of executing each transaction, the server’s GTIDs are captured and returned to the client as part of the acknowledgement. The possible values for [`session_track_gtids`](server-system-variables.html#sysvar_session_track_gtids) are as follows:

  + `OFF`: The server does not return GTIDs to the client. This is the default.

  + `OWN_GTID`: The server returns the GTIDs for all transactions that were successfully committed by this client in its current session since the last acknowledgement. Typically, this is the single GTID for the last transaction committed, but if a single client request resulted in multiple transactions, the server returns a GTID set containing all the relevant GTIDs.

  + `ALL_GTIDS`: The server returns the global value of its [`gtid_executed`](replication-options-gtids.html#sysvar_gtid_executed) system variable, which it reads at a point after the transaction is successfully committed. As well as the GTID for the transaction just committed, this GTID set includes all transactions committed on the server by any client, and can include transactions committed after the point when the transaction currently being acknowledged was committed.

  [`session_track_gtids`](server-system-variables.html#sysvar_session_track_gtids) cannot be set within transactional context.

  For more information about session state tracking, see [Section 5.1.15, “Server Tracking of Client Session State”](session-state-tracking.html "5.1.15 Server Tracking of Client Session State").

* [`session_track_schema`](server-system-variables.html#sysvar_session_track_schema)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>89

  Controls whether the server tracks when the default schema (database) is set within the current session and notifies the client to make the schema name available.

  If the schema name tracker is enabled, name notification occurs each time the default schema is set, even if the new schema name is the same as the old.

  For more information about session state tracking, see [Section 5.1.15, “Server Tracking of Client Session State”](session-state-tracking.html "5.1.15 Server Tracking of Client Session State").

* [`session_track_state_change`](server-system-variables.html#sysvar_session_track_state_change)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>90

  Controls whether the server tracks changes to the state of the current session and notifies the client when state changes occur. Changes can be reported for these attributes of client session state:

  + The default schema (database).
  + Session-specific values for system variables.
  + User-defined variables.
  + Temporary tables.
  + Prepared statements.

  If the session state tracker is enabled, notification occurs for each change that involves tracked session attributes, even if the new attribute values are the same as the old. For example, setting a user-defined variable to its current value results in a notification.

  The [`session_track_state_change`](server-system-variables.html#sysvar_session_track_state_change) variable controls only notification of when changes occur, not what the changes are. For example, state-change notifications occur when the default schema is set or tracked session system variables are assigned, but the notification does not include the schema name or variable values. To receive notification of the schema name or session system variable values, use the [`session_track_schema`](server-system-variables.html#sysvar_session_track_schema) or [`session_track_system_variables`](server-system-variables.html#sysvar_session_track_system_variables) system variable, respectively.

  Note

  Assigning a value to [`session_track_state_change`](server-system-variables.html#sysvar_session_track_state_change) itself is not considered a state change and is not reported as such. However, if its name listed in the value of [`session_track_system_variables`](server-system-variables.html#sysvar_session_track_system_variables), any assignments to it do result in notification of the new value.

  For more information about session state tracking, see [Section 5.1.15, “Server Tracking of Client Session State”](session-state-tracking.html "5.1.15 Server Tracking of Client Session State").

* [`session_track_system_variables`](server-system-variables.html#sysvar_session_track_system_variables)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>91

  Controls whether the server tracks assignments to session system variables and notifies the client of the name and value of each assigned variable. The variable value is a comma-separated list of variables for which to track assignments. By default, notification is enabled for [`time_zone`](server-system-variables.html#sysvar_time_zone), [`autocommit`](server-system-variables.html#sysvar_autocommit), [`character_set_client`](server-system-variables.html#sysvar_character_set_client), [`character_set_results`](server-system-variables.html#sysvar_character_set_results), and [`character_set_connection`](server-system-variables.html#sysvar_character_set_connection). (The latter three variables are those affected by [`SET NAMES`](set-names.html "13.7.4.3 SET NAMES Statement").)

  The special value `*` causes the server to track assignments to all session variables. If given, this value must be specified by itself without specific system variable names.

  To disable notification of session variable assignments, set [`session_track_system_variables`](server-system-variables.html#sysvar_session_track_system_variables) to the empty string.

  If session system variable tracking is enabled, notification occurs for all assignments to tracked session variables, even if the new values are the same as the old.

  For more information about session state tracking, see [Section 5.1.15, “Server Tracking of Client Session State”](session-state-tracking.html "5.1.15 Server Tracking of Client Session State").

* [`session_track_transaction_info`](server-system-variables.html#sysvar_session_track_transaction_info)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>92

  Controls whether the server tracks the state and characteristics of transactions within the current session and notifies the client to make this information available. These [`session_track_transaction_info`](server-system-variables.html#sysvar_session_track_transaction_info) values are permitted:

  + `OFF`: Disable transaction state tracking. This is the default.

  + `STATE`: Enable transaction state tracking without characteristics tracking. State tracking enables the client to determine whether a transaction is in progress and whether it could be moved to a different session without being rolled back.

  + `CHARACTERISTICS`: Enable transaction state tracking, including characteristics tracking. Characteristics tracking enables the client to determine how to restart a transaction in another session so that it has the same characteristics as in the original session. The following characteristics are relevant for this purpose:

    ```sql
    ISOLATION LEVEL
    READ ONLY
    READ WRITE
    WITH CONSISTENT SNAPSHOT
    ```

  For a client to safely relocate a transaction to another session, it must track not only transaction state but also transaction characteristics. In addition, the client must track the [`transaction_isolation`](server-system-variables.html#sysvar_transaction_isolation) and [`transaction_read_only`](server-system-variables.html#sysvar_transaction_read_only) system variables to correctly determine the session defaults. (To track these variables, list them in the value of the [`session_track_system_variables`](server-system-variables.html#sysvar_session_track_system_variables) system variable.)

  For more information about session state tracking, see [Section 5.1.15, “Server Tracking of Client Session State”](session-state-tracking.html "5.1.15 Server Tracking of Client Session State").

* [`sha256_password_auto_generate_rsa_keys`](server-system-variables.html#sysvar_sha256_password_auto_generate_rsa_keys)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>93

  This variable is available if the server was compiled using OpenSSL (see [Section 6.3.4, “SSL Library-Dependent Capabilities”](ssl-libraries.html "6.3.4 SSL Library-Dependent Capabilities")). It controls whether the server autogenerates RSA private/public key-pair files in the data directory, if they do not already exist.

  At startup, the server automatically generates RSA private/public key-pair files in the data directory if the [`sha256_password_auto_generate_rsa_keys`](server-system-variables.html#sysvar_sha256_password_auto_generate_rsa_keys) system variable is enabled, no RSA options are specified, and the RSA files are missing from the data directory. These files enable secure password exchange using RSA over unencrypted connections for accounts authenticated by the `sha256_password` plugin; see [Section 6.4.1.5, “SHA-256 Pluggable Authentication”](sha256-pluggable-authentication.html "6.4.1.5 SHA-256 Pluggable Authentication").

  For more information about RSA file autogeneration, including file names and characteristics, see [Section 6.3.3.1, “Creating SSL and RSA Certificates and Keys using MySQL”](creating-ssl-rsa-files-using-mysql.html "6.3.3.1 Creating SSL and RSA Certificates and Keys using MySQL")

  The [`auto_generate_certs`](server-system-variables.html#sysvar_auto_generate_certs) system variable is related but controls autogeneration of SSL certificate and key files needed for secure connections using SSL.

* [`sha256_password_private_key_path`](server-system-variables.html#sysvar_sha256_password_private_key_path)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>94

  This variable is available if MySQL was compiled using OpenSSL (see [Section 6.3.4, “SSL Library-Dependent Capabilities”](ssl-libraries.html "6.3.4 SSL Library-Dependent Capabilities")). Its value is the path name of the RSA private key file for the `sha256_password` authentication plugin. If the file is named as a relative path, it is interpreted relative to the server data directory. The file must be in PEM format.

  Important

  Because this file stores a private key, its access mode should be restricted so that only the MySQL server can read it.

  For information about `sha256_password`, see [Section 6.4.1.5, “SHA-256 Pluggable Authentication”](sha256-pluggable-authentication.html "6.4.1.5 SHA-256 Pluggable Authentication").

* [`sha256_password_proxy_users`](server-system-variables.html#sysvar_sha256_password_proxy_users)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>95

  This variable controls whether the `sha256_password` built-in authentication plugin supports proxy users. It has no effect unless the [`check_proxy_users`](server-system-variables.html#sysvar_check_proxy_users) system variable is enabled. For information about user proxying, see [Section 6.2.14, “Proxy Users”](proxy-users.html "6.2.14 Proxy Users").

* [`sha256_password_public_key_path`](server-system-variables.html#sysvar_sha256_password_public_key_path)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>96

  This variable is available if MySQL was compiled using OpenSSL (see [Section 6.3.4, “SSL Library-Dependent Capabilities”](ssl-libraries.html "6.3.4 SSL Library-Dependent Capabilities")). Its value is the path name of the RSA public key file for the `sha256_password` authentication plugin. If the file is named as a relative path, it is interpreted relative to the server data directory. The file must be in PEM format. Because this file stores a public key, copies can be freely distributed to client users. (Clients that explicitly specify a public key when connecting to the server using RSA password encryption must use the same public key as that used by the server.)

  For information about `sha256_password`, including information about how clients specify the RSA public key, see [Section 6.4.1.5, “SHA-256 Pluggable Authentication”](sha256-pluggable-authentication.html "6.4.1.5 SHA-256 Pluggable Authentication").

* [`shared_memory`](server-system-variables.html#sysvar_shared_memory)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>97

  (Windows only.) Whether the server permits shared-memory connections.

* [`shared_memory_base_name`](server-system-variables.html#sysvar_shared_memory_base_name)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>98

  (Windows only.) The name of shared memory to use for shared-memory connections. This is useful when running multiple MySQL instances on a single physical machine. The default name is `MYSQL`. The name is case-sensitive.

  This variable applies only if the server is started with the [`shared_memory`](server-system-variables.html#sysvar_shared_memory) system variable enabled to support shared-memory connections.

* [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56)

  <table summary="Permitted values for the authentication_windows system variable."><col style="width: 10%"/><col style="width: 75%"/><thead><tr> <th>Value</th> <th>Description</th> </tr></thead><tbody><tr> <td>0</td> <td>No logging</td> </tr><tr> <td>1</td> <td>Log only error messages</td> </tr><tr> <td>2</td> <td>Log level 1 messages and warning messages</td> </tr><tr> <td>3</td> <td>Log level 2 messages and information notes</td> </tr><tr> <td>4</td> <td>Log level 3 messages and debug messages</td> </tr></tbody></table>99

  The `INFORMATION_SCHEMA` has tables that contain system and status variable information (see [Section 24.3.11, “The INFORMATION\_SCHEMA GLOBAL\_VARIABLES and SESSION\_VARIABLES Tables”](information-schema-variables-table.html "24.3.11 The INFORMATION_SCHEMA GLOBAL_VARIABLES and SESSION_VARIABLES Tables"), and [Section 24.3.10, “The INFORMATION\_SCHEMA GLOBAL\_STATUS and SESSION\_STATUS Tables”](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables")). As of MySQL 5.7.6, the Performance Schema also contains system and status variable tables (see [Section 25.12.13, “Performance Schema System Variable Tables”](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables"), and [Section 25.12.14, “Performance Schema Status Variable Tables”](performance-schema-status-variable-tables.html "25.12.14 Performance Schema Status Variable Tables")). The Performance Schema tables are intended to replace the `INFORMATION_SCHEMA` tables, which are deprecated as of MySQL 5.7.6 and are removed in MySQL 8.0.

  For advice on migrating away from the `INFORMATION_SCHEMA` tables to the Performance Schema tables, see [Section 25.20, “Migrating to Performance Schema System and Status Variable Tables”](performance-schema-variable-table-migration.html "25.20 Migrating to Performance Schema System and Status Variable Tables"). To assist in the migration, you can use the [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) system variable, which affects whether MySQL 5.6 compatibility is enabled with respect to how system and status variable information is provided by the `INFORMATION_SCHEMA` and Performance Schema tables, and also by the [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") and [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") statements.

  Note

  [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) is deprecated because its only purpose is to permit control over deprecated system and status variable information sources which you can expect to be removed in a future release of MySQL. When those sources are removed, [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) no longer has any purpose, and you can expect it be removed as well.

  The following discussion describes the effects of [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56):

  + [Overview of show\_compatibility\_56 Effects](server-system-variables.html#sysvar_show_compatibility_56_overview "Overview of show_compatibility_56 Effects")
  + [Effect of show\_compatibility\_56 on SHOW Statements](server-system-variables.html#sysvar_show_compatibility_56_show "Effect of show_compatibility_56 on SHOW Statements")
  + [Effect of show\_compatibility\_56 on INFORMATION\_SCHEMA Tables](server-system-variables.html#sysvar_show_compatibility_56_information_schema "Effect of show_compatibility_56 on INFORMATION_SCHEMA Tables")
  + [Effect of show\_compatibility\_56 on Performance Schema Tables](server-system-variables.html#sysvar_show_compatibility_56_performance_schema "Effect of show_compatibility_56 on Performance Schema Tables")
  + [Effect of show\_compatibility\_56 on Slave Status Variables](server-system-variables.html#sysvar_show_compatibility_56_slave_status "Effect of show_compatibility_56 on Slave Status Variables")
  + [Effect of show\_compatibility\_56 on FLUSH STATUS](server-system-variables.html#sysvar_show_compatibility_56_flush "Effect of show_compatibility_56 on FLUSH STATUS")

  For better understanding, it is strongly recommended that you also read these sections:

  + [Section 25.12.13, “Performance Schema System Variable Tables”](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables")
  + [Section 25.12.14, “Performance Schema Status Variable Tables”](performance-schema-status-variable-tables.html "25.12.14 Performance Schema Status Variable Tables")
  + [Section 25.12.15.10, “Status Variable Summary Tables”](performance-schema-status-variable-summary-tables.html "25.12.15.10 Status Variable Summary Tables")

  #### Overview of show\_compatibility\_56 Effects

  The [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) system variable affects these aspects of server operation regarding system and status variables:

  + Information available from the [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") and [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") statements

  + Information available from the `INFORMATION_SCHEMA` tables that provide system and status variable information

  + Information available from the Performance Schema tables that provide system and status variable information

  + The effect of the [`FLUSH STATUS`](flush.html#flush-status) statement on status variables

  This list summarizes the effects of [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56), with additional details given later:

  + When [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) is `ON`, compatibility with MySQL 5.6 is enabled. Older variable information sources (`SHOW` statements, `INFORMATION_SCHEMA` tables) produce the same output as in MySQL 5.6.

  + When [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) is `OFF`, compatibility with MySQL 5.6 is disabled. Selecting from the `INFORMATION_SCHEMA` tables produces an error because the Performance Schema tables are intended to replace them. The `INFORMATION_SCHEMA` tables are deprecated as of MySQL 5.7.6 and are removed in MySQL 8.0.

    To obtain system and status variable information When [`show_compatibility_56=OFF`](server-system-variables.html#sysvar_show_compatibility_56), use the Performance Schema tables or the `SHOW` statements.

    Note

    When [`show_compatibility_56=OFF`](server-system-variables.html#sysvar_show_compatibility_56), the [`SHOW VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") and [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") statements display rows from the Performance Schema [`global_variables`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables"), [`session_variables`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables"), [`global_status`](performance-schema-status-variable-tables.html "25.12.14 Performance Schema Status Variable Tables"), and [`session_status`](performance-schema-status-variable-tables.html "25.12.14 Performance Schema Status Variable Tables") tables.

    As of MySQL 5.7.9, those tables are world readable and accessible without the [`SELECT`](privileges-provided.html#priv_select) privilege, which means that [`SELECT`](privileges-provided.html#priv_select) is not needed to use the `SHOW` statements, either. Before MySQL 5.7.9, the [`SELECT`](privileges-provided.html#priv_select) privilege is required to access those Performance Schema tables, either directly, or indirectly through the `SHOW` statements.

  + Several `Slave_xxx` status variables are available from [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") when [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) is `ON`. When [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) is `OFF`, some of those variables are not exposed to [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement"). The information they provide is available in replication-related Performance Schema tables, as described later.

  + [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) has no effect on system variable access using `@@` notation: `@@GLOBAL.var_name`, `@@SESSION.var_name`, `@@var_name`.

  + [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) has no effect for the embedded server, which produces 5.6-compatible output in all cases.

  The following descriptions detail the effect of setting [`show_compatibility_56`](server-system-variables.html#sysvar_show_compatibility_56) to `ON` or `OFF` in the contexts in which this variable applies.

  #### Effect of show\_compatibility\_56 on SHOW Statements

  [`SHOW GLOBAL VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") statement:

  + `ON`: MySQL 5.6 output.
  + `OFF`: Output displays rows from the Performance Schema [`global_variables`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables") table.

  [`SHOW [SESSION | LOCAL] VARIABLES`](show-variables.html "13.7.5.39 SHOW VARIABLES Statement") statement:

  + `ON`: MySQL 5.6 output.
  + `OFF`: Output displays rows from the Performance Schema [`session_variables`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables") table. (In MySQL 5.7.6 and 5.7.7, `OFF` output does not fully reflect all system variable values in effect for the current session; it includes no rows for global variables that have no session counterpart. This is corrected in MySQL 5.7.8.)

  [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") statement:

  + `ON`: MySQL 5.6 output.
  + `OFF`: Output displays rows from the Performance Schema [`global_status`](performance-schema-status-variable-tables.html "25.12.14 Performance Schema Status Variable Tables") table, plus the `Com_xxx` statement execution counters.

    `OFF` output includes no rows for session variables that have no global counterpart, unlike `ON` output.

  [`SHOW [SESSION | LOCAL] STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") statement:

  + `ON`: MySQL 5.6 output.
  + `OFF`: Output displays rows from the Performance Schema [`session_status`](performance-schema-status-variable-tables.html "25.12.14 Performance Schema Status Variable Tables") table, plus the `Com_xxx` statement execution counters. (In MySQL 5.7.6 and 5.7.7, `OFF` output does not fully reflect all status variable values in effect for the current session; it includes no rows for global variables that have no session counterpart. This is corrected in MySQL 5.7.8.)

  In MySQL 5.7.6 and 5.7.7, for each of the `SHOW` statements just described, use of a `WHERE` clause produces a warning when `show_compatibility_56=ON` and an error when `show_compatibility_56=OFF`. (This applies to `WHERE` clauses that are not optimized away. For example, `WHERE 1` is trivially true, is optimized away, and thus produces no warning or error.) This behavior does not occur as of MySQL 5.7.8; `WHERE` is supported as before 5.7.6.

  #### Effect of show\_compatibility\_56 on INFORMATION\_SCHEMA Tables

  `INFORMATION_SCHEMA` tables ([`GLOBAL_VARIABLES`](information-schema-variables-table.html "24.3.11 The INFORMATION_SCHEMA GLOBAL_VARIABLES and SESSION_VARIABLES Tables"), [`SESSION_VARIABLES`](information-schema-variables-table.html "24.3.11 The INFORMATION_SCHEMA GLOBAL_VARIABLES and SESSION_VARIABLES Tables"), [`GLOBAL_STATUS`](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables"), and [`SESSION_STATUS`](information-schema-status-table.html "24.3.10 The INFORMATION_SCHEMA GLOBAL_STATUS and SESSION_STATUS Tables")):

  + `ON`: MySQL 5.6 output, with a deprecation warning.

  + `OFF`: Selecting from these tables produces an error. (Before 5.7.9, selecting from these tables produces no output, with a deprecation warning.)

  #### Effect of show\_compatibility\_56 on Performance Schema Tables

  Performance Schema system variable tables:

  + `OFF`:

    - [`global_variables`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables"): Global system variables only.

    - [`session_variables`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables"): System variables in effect for the current session: A row for each session variable, and a row for each global variable that has no session counterpart.

    - [`variables_by_thread`](performance-schema-system-variable-tables.html "25.12.13 Performance Schema System Variable Tables"): Session system variables only, for each active session.

  + `ON`: Same output as for `OFF`. (Before 5.7.8, these tables produce no output.)

  Performance Schema status variable tables:

  + `OFF`:

    - [`global_status`](performance-schema-status-variable-tables.html "25.12.14 Performance Schema Status Variable Tables"): Global status variables only.

    - [`session_status`](performance-schema-status-variable-tables.html "25.12.14 Performance Schema Status Variable Tables"): Status variables in effect the current session: A row for each session variable, and a row for each global variable that has no session counterpart.

    - [`status_by_account`](performance-schema-status-variable-summary-tables.html "25.12.15.10 Status Variable Summary Tables") Session status variables only, aggregated per account.

    - [`status_by_host`](performance-schema-status-variable-summary-tables.html "25.12.15.10 Status Variable Summary Tables"): Session status variables only, aggregated per host name.

    - [`status_by_thread`](performance-schema-status-variable-tables.html "25.12.14 Performance Schema Status Variable Tables"): Session status variables only, for each active session.

    - [`status_by_user`](performance-schema-status-variable-summary-tables.html "25.12.15.10 Status Variable Summary Tables"): Session status variables only, aggregated per user name.

    The Performance Schema does not collect statistics for `Com_xxx` status variables in the status variable tables. To obtain global and per-session statement execution counts, use the [`events_statements_summary_global_by_event_name`](performance-schema-statement-summary-tables.html "25.12.15.3 Statement Summary Tables") and [`events_statements_summary_by_thread_by_event_name`](performance-schema-statement-summary-tables.html "25.12.15.3 Statement Summary Tables") tables, respectively.

  + `ON`: Same output as for `OFF`. (Before 5.7.9, these tables produce no output.)

  #### Effect of show\_compatibility\_56 on Slave Status Variables

  Replica status variables:

  + `ON`: Several `Slave_xxx` status variables are available from [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement").

  + `OFF`: Some of those replica variables are not exposed to [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") or the Performance Schema status variable tables. The information they provide is available in replication-related Performance Schema tables. The following table shows which `Slave_xxx` status variables become unavailable in [`SHOW STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") and their locations in Performance Schema replication tables.

    <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>00

  #### Effect of show\_compatibility\_56 on FLUSH STATUS

  [`FLUSH STATUS`](flush.html#flush-status) statement:

  + `ON`: This statement produces MySQL 5.6 behavior. It adds the current thread's session status variable values to the global values and resets the session values to zero. Some global variables may be reset to zero as well. It also resets the counters for key caches (default and named) to zero and sets [`Max_used_connections`](server-status-variables.html#statvar_Max_used_connections) to the current number of open connections.

  + `OFF`: This statement adds the session status from all active sessions to the global status variables, resets the status of all active sessions, and resets account, host, and user status values aggregated from disconnected sessions.

* [`show_create_table_verbosity`](server-system-variables.html#sysvar_show_create_table_verbosity)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>01

  [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement") normally does not show the `ROW_FORMAT` table option if the row format is the default format. Enabling this variable causes [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement") to display `ROW_FORMAT` regardless of whether it is the default format.

* [`show_old_temporals`](server-system-variables.html#sysvar_show_old_temporals)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>02

  Whether [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement") output includes comments to flag temporal columns found to be in pre-5.6.4 format ([`TIME`](time.html "11.2.3 The TIME Type"), [`DATETIME`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types"), and [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") columns without support for fractional seconds precision). This variable is disabled by default. If enabled, [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement") output looks like this:

  ```sql
  CREATE TABLE `mytbl` (
    `ts` timestamp /* 5.5 binary format */ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `dt` datetime /* 5.5 binary format */ DEFAULT NULL,
    `t` time /* 5.5 binary format */ DEFAULT NULL
  ) DEFAULT CHARSET=latin1
  ```

  Output for the `COLUMN_TYPE` column of the Information Schema [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") table is affected similarly.

  This variable is deprecated; expect it to be removed in a future release of MySQL.

* [`skip_external_locking`](server-system-variables.html#sysvar_skip_external_locking)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>03

  This is `OFF` if [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") uses external locking (system locking), `ON` if external locking is disabled. This affects only [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") table access.

  This variable is set by the [`--external-locking`](server-options.html#option_mysqld_external-locking) or [`--skip-external-locking`](server-options.html#option_mysqld_external-locking) option. External locking is disabled by default.

  External locking affects only [`MyISAM`](myisam-storage-engine.html "15.2 The MyISAM Storage Engine") table access. For more information, including conditions under which it can and cannot be used, see [Section 8.11.5, “External Locking”](external-locking.html "8.11.5 External Locking").

* [`skip_name_resolve`](server-system-variables.html#sysvar_skip_name_resolve)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>04

  Whether to resolve host names when checking client connections. If this variable is `OFF`, [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") resolves host names when checking client connections. If it is `ON`, [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") uses only IP numbers; in this case, all `Host` column values in the grant tables must be IP addresses. See [Section 5.1.11.2, “DNS Lookups and the Host Cache”](host-cache.html "5.1.11.2 DNS Lookups and the Host Cache").

  Depending on the network configuration of your system and the `Host` values for your accounts, clients may need to connect using an explicit [`--host`](connection-options.html#option_general_host) option, such as [`--host=127.0.0.1`](connection-options.html#option_general_host) or [`--host=::1`](connection-options.html#option_general_host).

  An attempt to connect to the host `127.0.0.1` normally resolves to the `localhost` account. However, this fails if the server is run with [`skip_name_resolve`](server-system-variables.html#sysvar_skip_name_resolve) enabled. If you plan to do that, make sure an account exists that can accept a connection. For example, to be able to connect as `root` using [`--host=127.0.0.1`](connection-options.html#option_general_host) or [`--host=::1`](connection-options.html#option_general_host), create these accounts:

  ```sql
  CREATE USER 'root'@'127.0.0.1' IDENTIFIED BY 'root-password';
  CREATE USER 'root'@'::1' IDENTIFIED BY 'root-password';
  ```

* [`skip_networking`](server-system-variables.html#sysvar_skip_networking)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>05

  This variable controls whether the server permits TCP/IP connections. By default, it is disabled (permit TCP connections). If enabled, the server permits only local (non-TCP/IP) connections and all interaction with [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") must be made using named pipes or shared memory (on Windows) or Unix socket files (on Unix). This option is highly recommended for systems where only local clients are permitted. See [Section 5.1.11.2, “DNS Lookups and the Host Cache”](host-cache.html "5.1.11.2 DNS Lookups and the Host Cache").

* [`skip_show_database`](server-system-variables.html#sysvar_skip_show_database)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>06

  This prevents people from using the [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement") statement if they do not have the [`SHOW DATABASES`](privileges-provided.html#priv_show-databases) privilege. This can improve security if you have concerns about users being able to see databases belonging to other users. Its effect depends on the [`SHOW DATABASES`](privileges-provided.html#priv_show-databases) privilege: If the variable value is `ON`, the [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement") statement is permitted only to users who have the [`SHOW DATABASES`](privileges-provided.html#priv_show-databases) privilege, and the statement displays all database names. If the value is `OFF`, [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement") is permitted to all users, but displays the names of only those databases for which the user has the [`SHOW DATABASES`](privileges-provided.html#priv_show-databases) or other privilege.

  Caution

  Because a global privilege is considered a privilege for all databases, *any* global privilege enables a user to see all database names with [`SHOW DATABASES`](show-databases.html "13.7.5.14 SHOW DATABASES Statement") or by examining the `INFORMATION_SCHEMA` [`SCHEMATA`](information-schema-schemata-table.html "24.3.22 The INFORMATION_SCHEMA SCHEMATA Table") table.

* [`slow_launch_time`](server-system-variables.html#sysvar_slow_launch_time)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>07

  If creating a thread takes longer than this many seconds, the server increments the [`Slow_launch_threads`](server-status-variables.html#statvar_Slow_launch_threads) status variable.

* [`slow_query_log`](server-system-variables.html#sysvar_slow_query_log)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>08

  Whether the slow query log is enabled. The value can be 0 (or `OFF`) to disable the log or 1 (or `ON`) to enable the log. The destination for log output is controlled by the [`log_output`](server-system-variables.html#sysvar_log_output) system variable; if that value is `NONE`, no log entries are written even if the log is enabled.

  “Slow” is determined by the value of the [`long_query_time`](server-system-variables.html#sysvar_long_query_time) variable. See [Section 5.4.5, “The Slow Query Log”](slow-query-log.html "5.4.5 The Slow Query Log").

* [`slow_query_log_file`](server-system-variables.html#sysvar_slow_query_log_file)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>09

  The name of the slow query log file. The default value is `host_name-slow.log`, but the initial value can be changed with the `--slow_query_log_file` option.

* [`socket`](server-system-variables.html#sysvar_socket)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>10

  On Unix platforms, this variable is the name of the socket file that is used for local client connections. The default is `/tmp/mysql.sock`. (For some distribution formats, the directory might be different, such as `/var/lib/mysql` for RPMs.)

  On Windows, this variable is the name of the named pipe that is used for local client connections. The default value is `MySQL` (not case-sensitive).

* [`sort_buffer_size`](server-system-variables.html#sysvar_sort_buffer_size)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>11

  Each session that must perform a sort allocates a buffer of this size. [`sort_buffer_size`](server-system-variables.html#sysvar_sort_buffer_size) is not specific to any storage engine and applies in a general manner for optimization. At minimum the [`sort_buffer_size`](server-system-variables.html#sysvar_sort_buffer_size) value must be large enough to accommodate fifteen tuples in the sort buffer. Also, increasing the value of [`max_sort_length`](server-system-variables.html#sysvar_max_sort_length) may require increasing the value of [`sort_buffer_size`](server-system-variables.html#sysvar_sort_buffer_size). For more information, see [Section 8.2.1.14, “ORDER BY Optimization”](order-by-optimization.html "8.2.1.14 ORDER BY Optimization")

  If you see many [`Sort_merge_passes`](server-status-variables.html#statvar_Sort_merge_passes) per second in [`SHOW GLOBAL STATUS`](show-status.html "13.7.5.35 SHOW STATUS Statement") output, you can consider increasing the [`sort_buffer_size`](server-system-variables.html#sysvar_sort_buffer_size) value to speed up `ORDER BY` or `GROUP BY` operations that cannot be improved with query optimization or improved indexing.

  The optimizer tries to work out how much space is needed but can allocate more, up to the limit. Setting it larger than required globally slows down most queries that sort. It is best to increase it as a session setting, and only for the sessions that need a larger size. On Linux, there are thresholds of 256KB and 2MB where larger values may significantly slow down memory allocation, so you should consider staying below one of those values. Experiment to find the best value for your workload. See [Section B.3.3.5, “Where MySQL Stores Temporary Files”](temporary-files.html "B.3.3.5 Where MySQL Stores Temporary Files").

  The maximum permissible setting for [`sort_buffer_size`](server-system-variables.html#sysvar_sort_buffer_size) is 4GB−1. Larger values are permitted for 64-bit platforms (except 64-bit Windows, for which large values are truncated to 4GB−1 with a warning).

* [`sql_auto_is_null`](server-system-variables.html#sysvar_sql_auto_is_null)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>12

  If this variable is enabled, then after a statement that successfully inserts an automatically generated `AUTO_INCREMENT` value, you can find that value by issuing a statement of the following form:

  ```sql
  SELECT * FROM tbl_name WHERE auto_col IS NULL
  ```

  If the statement returns a row, the value returned is the same as if you invoked the [`LAST_INSERT_ID()`](information-functions.html#function_last-insert-id) function. For details, including the return value after a multiple-row insert, see [Section 12.15, “Information Functions”](information-functions.html "12.15 Information Functions"). If no `AUTO_INCREMENT` value was successfully inserted, the [`SELECT`](select.html "13.2.9 SELECT Statement") statement returns no row.

  The behavior of retrieving an `AUTO_INCREMENT` value by using an [`IS NULL`](comparison-operators.html#operator_is-null) comparison is used by some ODBC programs, such as Access. See [Obtaining Auto-Increment Values](/doc/connector-odbc/en/connector-odbc-usagenotes-functionality-last-insert-id.html). This behavior can be disabled by setting [`sql_auto_is_null`](server-system-variables.html#sysvar_sql_auto_is_null) to `OFF`.

  The default value of [`sql_auto_is_null`](server-system-variables.html#sysvar_sql_auto_is_null) is `OFF`.

* [`sql_big_selects`](server-system-variables.html#sysvar_sql_big_selects)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>13

  If set to `OFF`, MySQL aborts [`SELECT`](select.html "13.2.9 SELECT Statement") statements that are likely to take a very long time to execute (that is, statements for which the optimizer estimates that the number of examined rows exceeds the value of [`max_join_size`](server-system-variables.html#sysvar_max_join_size)). This is useful when an inadvisable `WHERE` statement has been issued. The default value for a new connection is `ON`, which permits all [`SELECT`](select.html "13.2.9 SELECT Statement") statements.

  If you set the [`max_join_size`](server-system-variables.html#sysvar_max_join_size) system variable to a value other than `DEFAULT`, [`sql_big_selects`](server-system-variables.html#sysvar_sql_big_selects) is set to `OFF`.

* [`sql_buffer_result`](server-system-variables.html#sysvar_sql_buffer_result)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>14

  If enabled, [`sql_buffer_result`](server-system-variables.html#sysvar_sql_buffer_result) forces results from [`SELECT`](select.html "13.2.9 SELECT Statement") statements to be put into temporary tables. This helps MySQL free the table locks early and can be beneficial in cases where it takes a long time to send results to the client. The default value is `OFF`.

* [`sql_log_off`](server-system-variables.html#sysvar_sql_log_off)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>15

  This variable controls whether logging to the general query log is disabled for the current session (assuming that the general query log itself is enabled). The default value is `OFF` (that is, enable logging). To disable or enable general query logging for the current session, set the session [`sql_log_off`](server-system-variables.html#sysvar_sql_log_off) variable to `ON` or `OFF`.

  Setting the session value of this system variable is a restricted operation. The session user must have privileges sufficient to set restricted session variables. See [Section 5.1.8.1, “System Variable Privileges”](system-variable-privileges.html "5.1.8.1 System Variable Privileges").

* [`sql_mode`](server-system-variables.html#sysvar_sql_mode)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>16

  The current server SQL mode, which can be set dynamically. For details, see [Section 5.1.10, “Server SQL Modes”](sql-mode.html "5.1.10 Server SQL Modes").

  Note

  MySQL installation programs may configure the SQL mode during the installation process. If the SQL mode differs from the default or from what you expect, check for a setting in an option file that the server reads at startup.

* [`sql_notes`](server-system-variables.html#sysvar_sql_notes)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>17

  If enabled (the default), diagnostics of `Note` level increment `warning_count` and the server records them. If disabled, `Note` diagnostics do not increment [`warning_count`](server-system-variables.html#sysvar_warning_count) and the server does not record them. [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") includes output to disable this variable so that reloading the dump file does not produce warnings for events that do not affect the integrity of the reload operation.

* [`sql_quote_show_create`](server-system-variables.html#sysvar_sql_quote_show_create)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>18

  If enabled (the default), the server quotes identifiers for [`SHOW CREATE TABLE`](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement") and [`SHOW CREATE DATABASE`](show-create-database.html "13.7.5.6 SHOW CREATE DATABASE Statement") statements. If disabled, quoting is disabled. This option is enabled by default so that replication works for identifiers that require quoting. See [Section 13.7.5.10, “SHOW CREATE TABLE Statement”](show-create-table.html "13.7.5.10 SHOW CREATE TABLE Statement"), and [Section 13.7.5.6, “SHOW CREATE DATABASE Statement”](show-create-database.html "13.7.5.6 SHOW CREATE DATABASE Statement").

* [`sql_safe_updates`](server-system-variables.html#sysvar_sql_safe_updates)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>19

  If this variable is enabled, [`UPDATE`](update.html "13.2.11 UPDATE Statement") and [`DELETE`](delete.html "13.2.2 DELETE Statement") statements that do not use a key in the `WHERE` clause or a `LIMIT` clause produce an error. This makes it possible to catch [`UPDATE`](update.html "13.2.11 UPDATE Statement") and [`DELETE`](delete.html "13.2.2 DELETE Statement") statements where keys are not used properly and that would probably change or delete a large number of rows. The default value is `OFF`.

  For the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client, [`sql_safe_updates`](server-system-variables.html#sysvar_sql_safe_updates) can be enabled by using the [`--safe-updates`](mysql-command-options.html#option_mysql_safe-updates) option. For more information, see [Using Safe-Updates Mode (--safe-updates)](mysql-tips.html#safe-updates "Using Safe-Updates Mode (--safe-updates)").

* [`sql_select_limit`](server-system-variables.html#sysvar_sql_select_limit)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>20

  The maximum number of rows to return from [`SELECT`](select.html "13.2.9 SELECT Statement") statements. For more information, see [Using Safe-Updates Mode (--safe-updates)](mysql-tips.html#safe-updates "Using Safe-Updates Mode (--safe-updates)").

  The default value for a new connection is the maximum number of rows that the server permits per table. Typical default values are (232)−1 or (264)−1. If you have changed the limit, the default value can be restored by assigning a value of `DEFAULT`.

  If a [`SELECT`](select.html "13.2.9 SELECT Statement") has a `LIMIT` clause, the `LIMIT` takes precedence over the value of [`sql_select_limit`](server-system-variables.html#sysvar_sql_select_limit).

* [`sql_warnings`](server-system-variables.html#sysvar_sql_warnings)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>21

  This variable controls whether single-row [`INSERT`](insert.html "13.2.5 INSERT Statement") statements produce an information string if warnings occur. The default is `OFF`. Set the value to `ON` to produce an information string.

* [`ssl_ca`](server-system-variables.html#sysvar_ssl_ca)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>22

  The path name of the Certificate Authority (CA) certificate file in PEM format. The file contains a list of trusted SSL Certificate Authorities.

* [`ssl_capath`](server-system-variables.html#sysvar_ssl_capath)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>23

  The path name of the directory that contains trusted SSL Certificate Authority (CA) certificate files in PEM format. You must run OpenSSL `rehash` on the directory specified by this option prior to using it. On Linux systems, you can invoke `rehash` like this:

  ```sql
  $> openssl rehash path/to/directory
  ```

  On Windows platforms, you can use the `c_rehash` script in a command prompt, like this:

  ```sql
  \> c_rehash path/to/directory
  ```

  See [openssl-rehash](https://docs.openssl.org/3.1/man1/openssl-rehash/) for complete syntax and other information.

  Support for this capability depends on the SSL library used to compile MySQL; see [Section 6.3.4, “SSL Library-Dependent Capabilities”](ssl-libraries.html "6.3.4 SSL Library-Dependent Capabilities").

* [`ssl_cert`](server-system-variables.html#sysvar_ssl_cert)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>24

  The path name of the server SSL public key certificate file in PEM format.

  If the server is started with [`ssl_cert`](server-system-variables.html#sysvar_ssl_cert) set to a certificate that uses any restricted cipher or cipher category, the server starts with support for encrypted connections disabled. For information about cipher restrictions, see [Connection Cipher Configuration](encrypted-connection-protocols-ciphers.html#encrypted-connection-cipher-configuration "Connection Cipher Configuration").

* [`ssl_cipher`](server-system-variables.html#sysvar_ssl_cipher)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>25

  The list of permissible ciphers for connection encryption. If no cipher in the list is supported, encrypted connections do not work.

  For greatest portability, the cipher list should be a list of one or more cipher names, separated by colons. This format is understood both by OpenSSL and yaSSL. The following example shows two cipher names separated by a colon:

  ```sql
  [mysqld]
  ssl_cipher="DHE-RSA-AES128-GCM-SHA256:AES128-SHA"
  ```

  OpenSSL supports a more flexible syntax for specifying ciphers, as described in the OpenSSL documentation at <https://www.openssl.org/docs/manmaster/man1/openssl-ciphers.html>. yaSSL does not, so attempts to use that extended syntax fail for a MySQL distribution compiled using yaSSL.

  For information about which encryption ciphers MySQL supports, see [Section 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”](encrypted-connection-protocols-ciphers.html "6.3.2 Encrypted Connection TLS Protocols and Ciphers").

* [`ssl_crl`](server-system-variables.html#sysvar_ssl_crl)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>26

  The path name of the file containing certificate revocation lists in PEM format. Support for revocation-list capability depends on the SSL library used to compile MySQL. See [Section 6.3.4, “SSL Library-Dependent Capabilities”](ssl-libraries.html "6.3.4 SSL Library-Dependent Capabilities").

* [`ssl_crlpath`](server-system-variables.html#sysvar_ssl_crlpath)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>27

  The path of the directory that contains certificate revocation-list files in PEM format. Support for revocation-list capability depends on the SSL library used to compile MySQL. See [Section 6.3.4, “SSL Library-Dependent Capabilities”](ssl-libraries.html "6.3.4 SSL Library-Dependent Capabilities").

* [`ssl_key`](server-system-variables.html#sysvar_ssl_key)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>28

  The path name of the server SSL private key file in PEM format. For better security, use a certificate with an RSA key size of at least 2048 bits.

  If the key file is protected by a passphrase, the server prompts the user for the passphrase. The password must be given interactively; it cannot be stored in a file. If the passphrase is incorrect, the program continues as if it could not read the key.

* [`stored_program_cache`](server-system-variables.html#sysvar_stored_program_cache)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>29

  Sets a soft upper limit for the number of cached stored routines per connection. The value of this variable is specified in terms of the number of stored routines held in each of the two caches maintained by the MySQL Server for, respectively, stored procedures and stored functions.

  Whenever a stored routine is executed this cache size is checked before the first or top-level statement in the routine is parsed; if the number of routines of the same type (stored procedures or stored functions according to which is being executed) exceeds the limit specified by this variable, the corresponding cache is flushed and memory previously allocated for cached objects is freed. This allows the cache to be flushed safely, even when there are dependencies between stored routines.

* [`super_read_only`](server-system-variables.html#sysvar_super_read_only)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>30

  If the [`read_only`](server-system-variables.html#sysvar_read_only) system variable is enabled, the server permits no client updates except from users who have the [`SUPER`](privileges-provided.html#priv_super) privilege. If the [`super_read_only`](server-system-variables.html#sysvar_super_read_only) system variable is also enabled, the server prohibits client updates even from users who have [`SUPER`](privileges-provided.html#priv_super). See the description of the [`read_only`](server-system-variables.html#sysvar_read_only) system variable for a description of read-only mode and information about how [`read_only`](server-system-variables.html#sysvar_read_only) and [`super_read_only`](server-system-variables.html#sysvar_super_read_only) interact.

  Client updates prevented when [`super_read_only`](server-system-variables.html#sysvar_super_read_only) is enabled include operations that do not necessarily appear to be updates, such as `CREATE FUNCTION` (to install a loadable function) and `INSTALL PLUGIN`. These operations are prohibited because they involve changes to tables in the `mysql` system database.

  Changes to [`super_read_only`](server-system-variables.html#sysvar_super_read_only) on a replication source server are not replicated to replica servers. The value can be set on a replica independent of the setting on the source.

* [`sync_frm`](server-system-variables.html#sysvar_sync_frm)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>31

  If this variable is set to 1, when any nontemporary table is created its `.frm` file is synchronized to disk (using `fdatasync()`). This is slower but safer in case of a crash. The default is 1.

  This variable is deprecated in MySQL 5.7 and is removed in MySQL 8.0 (when `.frm` files become obsolete).

* [`system_time_zone`](server-system-variables.html#sysvar_system_time_zone)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>32

  The server system time zone. When the server begins executing, it inherits a time zone setting from the machine defaults, possibly modified by the environment of the account used for running the server or the startup script. The value is used to set [`system_time_zone`](server-system-variables.html#sysvar_system_time_zone). To explicitly specify the system time zone, set the `TZ` environment variable or use the [`--timezone`](mysqld-safe.html#option_mysqld_safe_timezone) option of the [**mysqld\_safe**](mysqld-safe.html "4.3.2 mysqld_safe — MySQL Server Startup Script") script.

  The [`system_time_zone`](server-system-variables.html#sysvar_system_time_zone) variable differs from the [`time_zone`](server-system-variables.html#sysvar_time_zone) variable. Although they might have the same value, the latter variable is used to initialize the time zone for each client that connects. See [Section 5.1.13, “MySQL Server Time Zone Support”](time-zone-support.html "5.1.13 MySQL Server Time Zone Support").

* [`table_definition_cache`](server-system-variables.html#sysvar_table_definition_cache)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>33

  The number of table definitions (from `.frm` files) that can be stored in the table definition cache. If you use a large number of tables, you can create a large table definition cache to speed up opening of tables. The table definition cache takes less space and does not use file descriptors, unlike the normal table cache. The minimum value is 400. The default value is based on the following formula, capped to a limit of 2000:

  ```sql
  400 + (table_open_cache / 2)
  ```

  For [`InnoDB`](innodb-storage-engine.html "Chapter 14 The InnoDB Storage Engine"), the [`table_definition_cache`](server-system-variables.html#sysvar_table_definition_cache) setting acts as a soft limit for the number of table instances in the `InnoDB` data dictionary cache and the number file-per-table tablespaces that can be open at one time.

  If the number of table instances in the `InnoDB` data dictionary cache exceeds the [`table_definition_cache`](server-system-variables.html#sysvar_table_definition_cache) limit, an LRU mechanism begins marking table instances for eviction and eventually removes them from the InnoDB data dictionary cache. The number of open tables with cached metadata can be higher than the [`table_definition_cache`](server-system-variables.html#sysvar_table_definition_cache) limit due to table instances with foreign key relationships, which are not placed on the LRU list.

  The number of file-per-table tablespaces that can be open at one time is limited by both the [`table_definition_cache`](server-system-variables.html#sysvar_table_definition_cache) and [`innodb_open_files`](innodb-parameters.html#sysvar_innodb_open_files) settings. If both variables are set, the highest setting is used. If neither variable is set, the [`table_definition_cache`](server-system-variables.html#sysvar_table_definition_cache) setting, which has a higher default value, is used. If the number of open tablespaces exceeds the limit defined by [`table_definition_cache`](server-system-variables.html#sysvar_table_definition_cache) or [`innodb_open_files`](innodb-parameters.html#sysvar_innodb_open_files), an LRU mechanism searches the LRU list for tablespace files that are fully flushed and not currently being extended. This process is performed each time a new tablespace is opened. Only inactive tablespaces are closed.

* [`table_open_cache`](server-system-variables.html#sysvar_table_open_cache)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>34

  The number of open tables for all threads. Increasing this value increases the number of file descriptors that [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") requires. The effective value of this variable is the greater of the effective value of [`open_files_limit`](server-system-variables.html#sysvar_open_files_limit) `- 10 -` the effective value of [`max_connections`](server-system-variables.html#sysvar_max_connections) `/ 2`, and 400; that is

  ```sql
  MAX(
      (open_files_limit - 10 - max_connections) / 2,
      400
     )
  ```

  You can check whether you need to increase the table cache by checking the [`Opened_tables`](server-status-variables.html#statvar_Opened_tables) status variable. If the value of [`Opened_tables`](server-status-variables.html#statvar_Opened_tables) is large and you do not use [`FLUSH TABLES`](flush.html#flush-tables) often (which just forces all tables to be closed and reopened), then you should increase the value of the [`table_open_cache`](server-system-variables.html#sysvar_table_open_cache) variable. For more information about the table cache, see [Section 8.4.3.1, “How MySQL Opens and Closes Tables”](table-cache.html "8.4.3.1 How MySQL Opens and Closes Tables").

* [`table_open_cache_instances`](server-system-variables.html#sysvar_table_open_cache_instances)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>35

  The number of open tables cache instances. To improve scalability by reducing contention among sessions, the open tables cache can be partitioned into several smaller cache instances of size [`table_open_cache`](server-system-variables.html#sysvar_table_open_cache) / [`table_open_cache_instances`](server-system-variables.html#sysvar_table_open_cache_instances) . A session needs to lock only one instance to access it for DML statements. This segments cache access among instances, permitting higher performance for operations that use the cache when there are many sessions accessing tables. (DDL statements still require a lock on the entire cache, but such statements are much less frequent than DML statements.)

  A value of 8 or 16 is recommended on systems that routinely use 16 or more cores. However, if you have many large triggers on your tables that cause a high memory load, the default setting for [`table_open_cache_instances`](server-system-variables.html#sysvar_table_open_cache_instances) might lead to excessive memory usage. In that situation, it can be helpful to set [`table_open_cache_instances`](server-system-variables.html#sysvar_table_open_cache_instances) to 1 in order to restrict memory usage.

* [`thread_cache_size`](server-system-variables.html#sysvar_thread_cache_size)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>36

  How many threads the server should cache for reuse. When a client disconnects, the client's threads are put in the cache if there are fewer than [`thread_cache_size`](server-system-variables.html#sysvar_thread_cache_size) threads there. Requests for threads are satisfied by reusing threads taken from the cache if possible, and only when the cache is empty is a new thread created. This variable can be increased to improve performance if you have a lot of new connections. Normally, this does not provide a notable performance improvement if you have a good thread implementation. However, if your server sees hundreds of connections per second you should normally set [`thread_cache_size`](server-system-variables.html#sysvar_thread_cache_size) high enough so that most new connections use cached threads. By examining the difference between the [`Connections`](server-status-variables.html#statvar_Connections) and [`Threads_created`](server-status-variables.html#statvar_Threads_created) status variables, you can see how efficient the thread cache is. For details, see [Section 5.1.9, “Server Status Variables”](server-status-variables.html "5.1.9 Server Status Variables").

  The default value is based on the following formula, capped to a limit of 100:

  ```sql
  8 + (max_connections / 100)
  ```

  This variable has no effect for the embedded server (`libmysqld`) and as of MySQL 5.7.2 is no longer visible within the embedded server.

* [`thread_handling`](server-system-variables.html#sysvar_thread_handling)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>37

  The thread-handling model used by the server for connection threads. The permissible values are `no-threads` (the server uses a single thread to handle one connection), `one-thread-per-connection` (the server uses one thread to handle each client connection), and `loaded-dynamically` (set by the thread pool plugin when it initializes). `no-threads` is useful for debugging under Linux; see [Section 5.8, “Debugging MySQL”](debugging-mysql.html "5.8 Debugging MySQL").

  This variable has no effect for the embedded server (`libmysqld`) and as of MySQL 5.7.2 is no longer visible within the embedded server.

* [`thread_pool_algorithm`](server-system-variables.html#sysvar_thread_pool_algorithm)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>38

  This variable controls which algorithm the thread pool plugin uses:

  + A value of 0 (the default) uses a conservative low-concurrency algorithm which is most well tested and is known to produce very good results.

  + A value of 1 increases the concurrency and uses a more aggressive algorithm which at times has been known to perform 5–10% better on optimal thread counts, but has degrading performance as the number of connections increases. Its use should be considered as experimental and not supported.

  This variable is available only if the thread pool plugin is enabled. See [Section 5.5.3, “MySQL Enterprise Thread Pool”](thread-pool.html "5.5.3 MySQL Enterprise Thread Pool").

* [`thread_pool_high_priority_connection`](server-system-variables.html#sysvar_thread_pool_high_priority_connection)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>39

  This variable affects queuing of new statements prior to execution. If the value is 0 (false, the default), statement queuing uses both the low-priority and high-priority queues. If the value is 1 (true), queued statements always go to the high-priority queue.

  This variable is available only if the thread pool plugin is enabled. See [Section 5.5.3, “MySQL Enterprise Thread Pool”](thread-pool.html "5.5.3 MySQL Enterprise Thread Pool").

* [`thread_pool_max_unused_threads`](server-system-variables.html#sysvar_thread_pool_max_unused_threads)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>40

  The maximum permitted number of unused threads in the thread pool. This variable makes it possible to limit the amount of memory used by sleeping threads.

  A value of 0 (the default) means no limit on the number of sleeping threads. A value of *`N`* where *`N`* is greater than 0 means 1 consumer thread and *`N`*−1 reserve threads. In this case, if a thread is ready to sleep but the number of sleeping threads is already at the maximum, the thread exits rather than going to sleep.

  A sleeping thread is either sleeping as a consumer thread or a reserve thread. The thread pool permits one thread to be the consumer thread when sleeping. If a thread goes to sleep and there is no existing consumer thread, it sleeps as a consumer thread. When a thread must be woken up, a consumer thread is selected if there is one. A reserve thread is selected only when there is no consumer thread to wake up.

  This variable is available only if the thread pool plugin is enabled. See [Section 5.5.3, “MySQL Enterprise Thread Pool”](thread-pool.html "5.5.3 MySQL Enterprise Thread Pool").

* [`thread_pool_prio_kickup_timer`](server-system-variables.html#sysvar_thread_pool_prio_kickup_timer)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>41

  This variable affects statements waiting for execution in the low-priority queue. The value is the number of milliseconds before a waiting statement is moved to the high-priority queue. The default is 1000 (1 second).

  This variable is available only if the thread pool plugin is enabled. See [Section 5.5.3, “MySQL Enterprise Thread Pool”](thread-pool.html "5.5.3 MySQL Enterprise Thread Pool").

* [`thread_pool_size`](server-system-variables.html#sysvar_thread_pool_size)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>42

  The number of thread groups in the thread pool. This is the most important parameter controlling thread pool performance. It affects how many statements can execute simultaneously. If a value outside the range of permissible values is specified, the thread pool plugin does not load and the server writes a message to the error log.

  This variable is available only if the thread pool plugin is enabled. See [Section 5.5.3, “MySQL Enterprise Thread Pool”](thread-pool.html "5.5.3 MySQL Enterprise Thread Pool").

* [`thread_pool_stall_limit`](server-system-variables.html#sysvar_thread_pool_stall_limit)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>43

  This variable affects executing statements. The value is the amount of time a statement has to finish after starting to execute before it becomes defined as stalled, at which point the thread pool permits the thread group to begin executing another statement. The value is measured in 10 millisecond units, so the default of 6 means 60ms. Short wait values permit threads to start more quickly. Short values are also better for avoiding deadlock situations. Long wait values are useful for workloads that include long-running statements, to avoid starting too many new statements while the current ones execute.

  This variable is available only if the thread pool plugin is enabled. See [Section 5.5.3, “MySQL Enterprise Thread Pool”](thread-pool.html "5.5.3 MySQL Enterprise Thread Pool").

* [`thread_stack`](server-system-variables.html#sysvar_thread_stack)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>44

  The stack size for each thread. The default is large enough for normal operation. If the thread stack size is too small, it limits the complexity of the SQL statements that the server can handle, the recursion depth of stored procedures, and other memory-consuming actions.

* [`time_format`](server-system-variables.html#sysvar_time_format)

  This variable is unused. It is deprecated and is removed in MySQL 8.0.

* [`time_zone`](server-system-variables.html#sysvar_time_zone)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>45

  The current time zone. This variable is used to initialize the time zone for each client that connects. By default, the initial value of this is `'SYSTEM'` (which means, “use the value of [`system_time_zone`](server-system-variables.html#sysvar_system_time_zone)”). The value can be specified explicitly at server startup with the [`--default-time-zone`](server-options.html#option_mysqld_default-time-zone) option. See [Section 5.1.13, “MySQL Server Time Zone Support”](time-zone-support.html "5.1.13 MySQL Server Time Zone Support").

  Note

  If set to `SYSTEM`, every MySQL function call that requires a time zone calculation makes a system library call to determine the current system time zone. This call may be protected by a global mutex, resulting in contention.

* [`timestamp`](server-system-variables.html#sysvar_timestamp)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>46

  Set the time for this client. This is used to get the original timestamp if you use the binary log to restore rows. *`timestamp_value`* should be a Unix epoch timestamp (a value like that returned by [`UNIX_TIMESTAMP()`](date-and-time-functions.html#function_unix-timestamp), not a value in `'YYYY-MM-DD hh:mm:ss'` format) or `DEFAULT`.

  Setting [`timestamp`](server-system-variables.html#sysvar_timestamp) to a constant value causes it to retain that value until it is changed again. Setting [`timestamp`](server-system-variables.html#sysvar_timestamp) to `DEFAULT` causes its value to be the current date and time as of the time it is accessed. The maximum value corresponds to `'2038-01-19 03:14:07'` UTC, the same as for the [`TIMESTAMP`](datetime.html "11.2.2 The DATE, DATETIME, and TIMESTAMP Types") data type.

  [`timestamp`](server-system-variables.html#sysvar_timestamp) is a `DOUBLE` rather than `BIGINT` because its value includes a microseconds part.

  `SET timestamp` affects the value returned by [`NOW()`](date-and-time-functions.html#function_now) but not by [`SYSDATE()`](date-and-time-functions.html#function_sysdate). This means that timestamp settings in the binary log have no effect on invocations of [`SYSDATE()`](date-and-time-functions.html#function_sysdate). The server can be started with the [`--sysdate-is-now`](server-options.html#option_mysqld_sysdate-is-now) option to cause [`SYSDATE()`](date-and-time-functions.html#function_sysdate) to be a synonym for [`NOW()`](date-and-time-functions.html#function_now), in which case `SET timestamp` affects both functions.

* [`tls_version`](server-system-variables.html#sysvar_tls_version)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>47

  Which protocols the server permits for encrypted connections. The value is a comma-separated list containing one or more protocol versions. The protocols that can be named for this variable depend on the SSL library used to compile MySQL. Permitted protocols should be chosen such as not to leave “holes” in the list. For details, see [Section 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”](encrypted-connection-protocols-ciphers.html "6.3.2 Encrypted Connection TLS Protocols and Ciphers").

  Note

  As of MySQL 5.7.35, the TLSv1 and TLSv1.1 connection protocols are deprecated and support for them is subject to removal in a future version of MySQL. See [Deprecated TLS Protocols](encrypted-connection-protocols-ciphers.html#encrypted-connection-deprecated-protocols "Deprecated TLS Protocols").

  Setting this variable to an empty string disables encrypted connections.

* [`tmp_table_size`](server-system-variables.html#sysvar_tmp_table_size)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>48

  The maximum size of internal in-memory temporary tables. This variable does not apply to user-created `MEMORY` tables.

  The actual limit is the smaller of [`tmp_table_size`](server-system-variables.html#sysvar_tmp_table_size) and [`max_heap_table_size`](server-system-variables.html#sysvar_max_heap_table_size). When an in-memory temporary table exceeds the limit, MySQL automatically converts it to an on-disk temporary table. The [`internal_tmp_disk_storage_engine`](server-system-variables.html#sysvar_internal_tmp_disk_storage_engine) option defines the storage engine used for on-disk temporary tables.

  Increase the value of [`tmp_table_size`](server-system-variables.html#sysvar_tmp_table_size) (and [`max_heap_table_size`](server-system-variables.html#sysvar_max_heap_table_size) if necessary) if you do many advanced `GROUP BY` queries and you have lots of memory.

  You can compare the number of internal on-disk temporary tables created to the total number of internal temporary tables created by comparing [`Created_tmp_disk_tables`](server-status-variables.html#statvar_Created_tmp_disk_tables) and [`Created_tmp_tables`](server-status-variables.html#statvar_Created_tmp_tables) values.

  See also [Section 8.4.4, “Internal Temporary Table Use in MySQL”](internal-temporary-tables.html "8.4.4 Internal Temporary Table Use in MySQL").

* [`tmpdir`](server-system-variables.html#sysvar_tmpdir)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>49

  The path of the directory to use for creating temporary files. It might be useful if your default `/tmp` directory resides on a partition that is too small to hold temporary tables. This variable can be set to a list of several paths that are used in round-robin fashion. Paths should be separated by colon characters (`:`) on Unix and semicolon characters (`;`) on Windows.

  [`tmpdir`](server-system-variables.html#sysvar_tmpdir) can be a non-permanent location, such as a directory on a memory-based file system or a directory that is cleared when the server host restarts. If the MySQL server is acting as a replica, and you are using a non-permanent location for [`tmpdir`](server-system-variables.html#sysvar_tmpdir), consider setting a different temporary directory for the replica using the [`slave_load_tmpdir`](replication-options-replica.html#sysvar_slave_load_tmpdir) variable. For a replica, the temporary files used to replicate [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") statements are stored in this directory, so with a permanent location they can survive machine restarts, although replication can now continue after a restart if the temporary files have been removed.

  For more information about the storage location of temporary files, see [Section B.3.3.5, “Where MySQL Stores Temporary Files”](temporary-files.html "B.3.3.5 Where MySQL Stores Temporary Files").

* [`transaction_alloc_block_size`](server-system-variables.html#sysvar_transaction_alloc_block_size)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>50

  The amount in bytes by which to increase a per-transaction memory pool which needs memory. See the description of [`transaction_prealloc_size`](server-system-variables.html#sysvar_transaction_prealloc_size).

* [`transaction_isolation`](server-system-variables.html#sysvar_transaction_isolation)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>51

  The transaction isolation level. The default is [`REPEATABLE-READ`](innodb-transaction-isolation-levels.html#isolevel_repeatable-read).

  The transaction isolation level has three scopes: global, session, and next transaction. This three-scope implementation leads to some nonstandard isolation-level assignment semantics, as described later.

  To set the global transaction isolation level at startup, use the [`--transaction-isolation`](server-options.html#option_mysqld_transaction-isolation) server option.

  At runtime, the isolation level can be set directly using the [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") statement to assign a value to the [`transaction_isolation`](server-system-variables.html#sysvar_transaction_isolation) system variable, or indirectly using the [`SET TRANSACTION`](set-transaction.html "13.3.6 SET TRANSACTION Statement") statement. If you set [`transaction_isolation`](server-system-variables.html#sysvar_transaction_isolation) directly to an isolation level name that contains a space, the name should be enclosed within quotation marks, with the space replaced by a dash. For example, use this [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") statement to set the global value:

  ```sql
  SET GLOBAL transaction_isolation = 'READ-COMMITTED';
  ```

  Setting the global [`transaction_isolation`](server-system-variables.html#sysvar_transaction_isolation) value sets the isolation level for all subsequent sessions. Existing sessions are unaffected.

  To set the session or next-level [`transaction_isolation`](server-system-variables.html#sysvar_transaction_isolation) value, use the [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") statement. For most session system variables, these statements are equivalent ways to set the value:

  ```sql
  SET @@SESSION.var_name = value;
  SET SESSION var_name = value;
  SET var_name = value;
  SET @@var_name = value;
  ```

  As mentioned previously, the transaction isolation level has a next-transaction scope, in addition to the global and session scopes. To enable the next-transaction scope to be set, [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") syntax for assigning session system variable values has nonstandard semantics for [`transaction_isolation`](server-system-variables.html#sysvar_transaction_isolation):

  + To set the session isolation level, use any of these syntaxes:

    ```sql
    SET @@SESSION.transaction_isolation = value;
    SET SESSION transaction_isolation = value;
    SET transaction_isolation = value;
    ```

    For each of those syntaxes, these semantics apply:

    - Sets the isolation level for all subsequent transactions performed within the session.

    - Permitted within transactions, but does not affect the current ongoing transaction.

    - If executed between transactions, overrides any preceding statement that sets the next-transaction isolation level.

    - Corresponds to [`SET SESSION TRANSACTION ISOLATION LEVEL`](set-transaction.html "13.3.6 SET TRANSACTION Statement") (with the `SESSION` keyword).

  + To set the next-transaction isolation level, use this syntax:

    ```sql
    SET @@transaction_isolation = value;
    ```

    For that syntax, these semantics apply:

    - Sets the isolation level only for the next single transaction performed within the session.

    - Subsequent transactions revert to the session isolation level.

    - Not permitted within transactions.
    - Corresponds to [`SET TRANSACTION ISOLATION LEVEL`](set-transaction.html "13.3.6 SET TRANSACTION Statement") (without the `SESSION` keyword).

  For more information about [`SET TRANSACTION`](set-transaction.html "13.3.6 SET TRANSACTION Statement") and its relationship to the [`transaction_isolation`](server-system-variables.html#sysvar_transaction_isolation) system variable, see [Section 13.3.6, “SET TRANSACTION Statement”](set-transaction.html "13.3.6 SET TRANSACTION Statement").

  Note

  [`transaction_isolation`](server-system-variables.html#sysvar_transaction_isolation) was added in MySQL 5.7.20 as a synonym for [`tx_isolation`](server-system-variables.html#sysvar_tx_isolation), which is now deprecated and is removed in MySQL 8.0. Applications should be adjusted to use [`transaction_isolation`](server-system-variables.html#sysvar_transaction_isolation) in preference to [`tx_isolation`](server-system-variables.html#sysvar_tx_isolation).

* [`transaction_prealloc_size`](server-system-variables.html#sysvar_transaction_prealloc_size)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>52

  There is a per-transaction memory pool from which various transaction-related allocations take memory. The initial size of the pool in bytes is [`transaction_prealloc_size`](server-system-variables.html#sysvar_transaction_prealloc_size). For every allocation that cannot be satisfied from the pool because it has insufficient memory available, the pool is increased by [`transaction_alloc_block_size`](server-system-variables.html#sysvar_transaction_alloc_block_size) bytes. When the transaction ends, the pool is truncated to [`transaction_prealloc_size`](server-system-variables.html#sysvar_transaction_prealloc_size) bytes.

  By making [`transaction_prealloc_size`](server-system-variables.html#sysvar_transaction_prealloc_size) sufficiently large to contain all statements within a single transaction, you can avoid many `malloc()` calls.

* [`transaction_read_only`](server-system-variables.html#sysvar_transaction_read_only)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>53

  The transaction access mode. The value can be `OFF` (read/write; the default) or `ON` (read only).

  The transaction access mode has three scopes: global, session, and next transaction. This three-scope implementation leads to some nonstandard access-mode assignment semantics, as described later.

  To set the global transaction access mode at startup, use the [`--transaction-read-only`](server-options.html#option_mysqld_transaction-read-only) server option.

  At runtime, the access mode can be set directly using the [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") statement to assign a value to the [`transaction_read_only`](server-system-variables.html#sysvar_transaction_read_only) system variable, or indirectly using the [`SET TRANSACTION`](set-transaction.html "13.3.6 SET TRANSACTION Statement") statement. For example, use this [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") statement to set the global value:

  ```sql
  SET GLOBAL transaction_read_only = ON;
  ```

  Setting the global [`transaction_read_only`](server-system-variables.html#sysvar_transaction_read_only) value sets the access mode for all subsequent sessions. Existing sessions are unaffected.

  To set the session or next-level [`transaction_read_only`](server-system-variables.html#sysvar_transaction_read_only) value, use the [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") statement. For most session system variables, these statements are equivalent ways to set the value:

  ```sql
  SET @@SESSION.var_name = value;
  SET SESSION var_name = value;
  SET var_name = value;
  SET @@var_name = value;
  ```

  As mentioned previously, the transaction access mode has a next-transaction scope, in addition to the global and session scopes. To enable the next-transaction scope to be set, [`SET`](set-variable.html "13.7.4.1 SET Syntax for Variable Assignment") syntax for assigning session system variable values has nonstandard semantics for [`transaction_read_only`](server-system-variables.html#sysvar_transaction_read_only),

  + To set the session access mode, use any of these syntaxes:

    ```sql
    SET @@SESSION.transaction_read_only = value;
    SET SESSION transaction_read_only = value;
    SET transaction_read_only = value;
    ```

    For each of those syntaxes, these semantics apply:

    - Sets the access mode for all subsequent transactions performed within the session.

    - Permitted within transactions, but does not affect the current ongoing transaction.

    - If executed between transactions, overrides any preceding statement that sets the next-transaction access mode.

    - Corresponds to [`SET SESSION TRANSACTION {READ WRITE | READ ONLY}`](set-transaction.html "13.3.6 SET TRANSACTION Statement") (with the `SESSION` keyword).

  + To set the next-transaction access mode, use this syntax:

    ```sql
    SET @@transaction_read_only = value;
    ```

    For that syntax, these semantics apply:

    - Sets the access mode only for the next single transaction performed within the session.

    - Subsequent transactions revert to the session access mode.

    - Not permitted within transactions.
    - Corresponds to [`SET TRANSACTION {READ WRITE | READ ONLY}`](set-transaction.html "13.3.6 SET TRANSACTION Statement") (without the `SESSION` keyword).

  For more information about [`SET TRANSACTION`](set-transaction.html "13.3.6 SET TRANSACTION Statement") and its relationship to the [`transaction_read_only`](server-system-variables.html#sysvar_transaction_read_only) system variable, see [Section 13.3.6, “SET TRANSACTION Statement”](set-transaction.html "13.3.6 SET TRANSACTION Statement").

  Note

  [`transaction_read_only`](server-system-variables.html#sysvar_transaction_read_only) was added in MySQL 5.7.20 as a synonym for [`tx_read_only`](server-system-variables.html#sysvar_tx_read_only), which is now deprecated and is removed in MySQL 8.0. Applications should be adjusted to use [`transaction_read_only`](server-system-variables.html#sysvar_transaction_read_only) in preference to [`tx_read_only`](server-system-variables.html#sysvar_tx_read_only).

* [`tx_isolation`](server-system-variables.html#sysvar_tx_isolation)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>54

  The default transaction isolation level. Defaults to [`REPEATABLE-READ`](innodb-transaction-isolation-levels.html#isolevel_repeatable-read).

  Note

  [`transaction_isolation`](server-system-variables.html#sysvar_transaction_isolation) was added in MySQL 5.7.20 as a synonym for [`tx_isolation`](server-system-variables.html#sysvar_tx_isolation), which is now deprecated and is removed in MySQL 8.0. Applications should be adjusted to use [`transaction_isolation`](server-system-variables.html#sysvar_transaction_isolation) in preference to [`tx_isolation`](server-system-variables.html#sysvar_tx_isolation). See the description of [`transaction_isolation`](server-system-variables.html#sysvar_transaction_isolation) for details.

* [`tx_read_only`](server-system-variables.html#sysvar_tx_read_only)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>55

  The default transaction access mode. The value can be `OFF` (read/write, the default) or `ON` (read only).

  Note

  [`transaction_read_only`](server-system-variables.html#sysvar_transaction_read_only) was added in MySQL 5.7.20 as a synonym for [`tx_read_only`](server-system-variables.html#sysvar_tx_read_only), which is now deprecated and is removed in MySQL 8.0. Applications should be adjusted to use [`transaction_read_only`](server-system-variables.html#sysvar_transaction_read_only) in preference to [`tx_read_only`](server-system-variables.html#sysvar_tx_read_only). See the description of [`transaction_read_only`](server-system-variables.html#sysvar_transaction_read_only) for details.

* [`unique_checks`](server-system-variables.html#sysvar_unique_checks)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>56

  If set to 1 (the default), uniqueness checks for secondary indexes in `InnoDB` tables are performed. If set to 0, storage engines are permitted to assume that duplicate keys are not present in input data. If you know for certain that your data does not contain uniqueness violations, you can set this to 0 to speed up large table imports to `InnoDB`.

  Setting this variable to 0 does not *require* storage engines to ignore duplicate keys. An engine is still permitted to check for them and issue duplicate-key errors if it detects them.

* [`updatable_views_with_limit`](server-system-variables.html#sysvar_updatable_views_with_limit)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>57

  This variable controls whether updates to a view can be made when the view does not contain all columns of the primary key defined in the underlying table, if the update statement contains a `LIMIT` clause. (Such updates often are generated by GUI tools.) An update is an [`UPDATE`](update.html "13.2.11 UPDATE Statement") or [`DELETE`](delete.html "13.2.2 DELETE Statement") statement. Primary key here means a `PRIMARY KEY`, or a `UNIQUE` index in which no column can contain `NULL`.

  The variable can have two values:

  + `1` or `YES`: Issue a warning only (not an error message). This is the default value.

  + `0` or `NO`: Prohibit the update.

* `validate_password_xxx`

  The `validate_password` plugin implements a set of system variables having names of the form `validate_password_xxx`. These variables affect password testing by that plugin; see [Section 6.4.3.2, “Password Validation Plugin Options and Variables”](validate-password-options-variables.html "6.4.3.2 Password Validation Plugin Options and Variables").

* [`version`](server-system-variables.html#sysvar_version)

  The version number for the server. The value might also include a suffix indicating server build or configuration information. `-log` indicates that one or more of the general log, slow query log, or binary log are enabled. `-debug` indicates that the server was built with debugging support enabled.

* [`version_comment`](server-system-variables.html#sysvar_version_comment)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>58

  The **CMake** configuration program has a [`COMPILATION_COMMENT`](source-configuration-options.html#option_cmake_compilation_comment) option that permits a comment to be specified when building MySQL. This variable contains the value of that comment. See [Section 2.8.7, “MySQL Source-Configuration Options”](source-configuration-options.html "2.8.7 MySQL Source-Configuration Options").

* [`version_compile_machine`](server-system-variables.html#sysvar_version_compile_machine)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>59

  The type of the server binary.

* [`version_compile_os`](server-system-variables.html#sysvar_version_compile_os)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>60

  The type of operating system on which MySQL was built.

* [`wait_timeout`](server-system-variables.html#sysvar_wait_timeout)

  <table frame="box" rules="all" summary="Properties for authentication_windows_use_principal_name"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--authentication-windows-use-principal-name[={OFF|ON}]</code></td> </tr><tr><th>System Variable</th> <td><code><a class="link" href="server-system-variables.html#sysvar_authentication_windows_use_principal_name">authentication_windows_use_principal_name</a></code></td> </tr><tr><th>Scope</th> <td>Global</td> </tr><tr><th>Dynamic</th> <td>No</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>ON</code></td> </tr></tbody></table>61

  The number of seconds the server waits for activity on a noninteractive connection before closing it.

  On thread startup, the session [`wait_timeout`](server-system-variables.html#sysvar_wait_timeout) value is initialized from the global [`wait_timeout`](server-system-variables.html#sysvar_wait_timeout) value or from the global [`interactive_timeout`](server-system-variables.html#sysvar_interactive_timeout) value, depending on the type of client (as defined by the `CLIENT_INTERACTIVE` connect option to [`mysql_real_connect()`](/doc/c-api/5.7/en/mysql-real-connect.html)). See also [`interactive_timeout`](server-system-variables.html#sysvar_interactive_timeout).

* [`warning_count`](server-system-variables.html#sysvar_warning_count)

  The number of errors, warnings, and notes that resulted from the last statement that generated messages. This variable is read only. See [Section 13.7.5.40, “SHOW WARNINGS Statement”](show-warnings.html "13.7.5.40 SHOW WARNINGS Statement").
