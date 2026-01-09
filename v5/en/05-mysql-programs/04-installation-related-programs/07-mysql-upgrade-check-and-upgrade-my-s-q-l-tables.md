### 4.4.7 mysql_upgrade — Check and Upgrade MySQL Tables

Each time you upgrade MySQL, you should execute **mysql_upgrade**, which looks for incompatibilities with the upgraded MySQL server:

* It upgrades the system tables in the `mysql` schema so that you can take advantage of new privileges or capabilities that might have been added.

* It upgrades the Performance Schema and `sys` schema.

* It examines user schemas.

If **mysql_upgrade** finds that a table has a possible incompatibility, it performs a table check and, if problems are found, attempts a table repair. If the table cannot be repaired, see Section 2.10.12, “Rebuilding or Repairing Tables or Indexes” for manual table repair strategies.

**mysql_upgrade** communicates directly with the MySQL server, sending it the SQL statements required to perform an upgrade.

Important

In MySQL 5.7.11, the default `--early-plugin-load` value is the name of the `keyring_file` plugin library file, causing that plugin to be loaded by default. In MySQL 5.7.12 and higher, the default `--early-plugin-load` value is empty; to load the `keyring_file` plugin, you must explicitly specify the option with a value naming the `keyring_file` plugin library file.

`InnoDB` tablespace encryption requires that the keyring plugin to be used be loaded prior to `InnoDB` initialization, so this change of default `--early-plugin-load` value introduces an incompatibility for upgrades from 5.7.11 to 5.7.12 or higher. Administrators who have encrypted `InnoDB` tablespaces must take explicit action to ensure continued loading of the keyring plugin: Start the server with an `--early-plugin-load` option that names the plugin library file. For additional information, see Section 6.4.4.1, “Keyring Plugin Installation”.

Important

If you upgrade to MySQL 5.7.2 or later from a version older than 5.7.2, a change to the `mysql.user` table requires a special sequence of steps to perform an upgrade using **mysql_upgrade**. For details, see Section 2.10.3, “Changes in MySQL 5.7”.

Note

On Windows, you must run **mysql_upgrade** with administrator privileges. You can do this by running a Command Prompt as Administrator and running the command. Failure to do so may result in the upgrade failing to execute correctly.

Caution

You should always back up your current MySQL installation *before* performing an upgrade. See Section 7.2, “Database Backup Methods”.

Some upgrade incompatibilities may require special handling *before* upgrading your MySQL installation and running **mysql_upgrade**. See Section 2.10, “Upgrading MySQL”, for instructions on determining whether any such incompatibilities apply to your installation and how to handle them.

Use **mysql_upgrade** like this:

1. Ensure that the server is running.
2. Invoke **mysql_upgrade** to upgrade the system tables in the `mysql` schema and check and repair tables in other schemas:

   ```sql
   mysql_upgrade [options]
   ```

3. Stop the server and restart it so that any system table changes take effect.

If you have multiple MySQL server instances to upgrade, invoke **mysql_upgrade** with connection parameters appropriate for connecting to each of the desired servers. For example, with servers running on the local host on parts 3306 through 3308, upgrade each of them by connecting to the appropriate port:

```sql
mysql_upgrade --protocol=tcp -P 3306 [other_options]
mysql_upgrade --protocol=tcp -P 3307 [other_options]
mysql_upgrade --protocol=tcp -P 3308 [other_options]
```

For local host connections on Unix, the `--protocol=tcp` option forces a connection using TCP/IP rather than the Unix socket file.

By default, **mysql_upgrade** runs as the MySQL `root` user. If the `root` password is expired when you run **mysql_upgrade**, it displays a message telling you that your password is expired and that **mysql_upgrade** failed as a result. To correct this, reset the `root` password to unexpire it and run **mysql_upgrade** again. First, connect to the server as `root`:

```sql
$> mysql -u root -p
Enter password: ****  <- enter root password here
```

Reset the password using `ALTER USER`:

```sql
mysql> ALTER USER USER() IDENTIFIED BY 'root-password';
```

Then exit **mysql** and run **mysql_upgrade** again:

```sql
$> mysql_upgrade [options]
```

Note

If you run the server with the `disabled_storage_engines` system variable set to disable certain storage engines (for example, `MyISAM`), **mysql_upgrade** might fail with an error like this:

```sql
mysql_upgrade: [ERROR] 3161: Storage engine MyISAM is disabled
(Table creation is disallowed).
```

To handle this, restart the server with `disabled_storage_engines` disabled. Then you should be able to run **mysql_upgrade** successfully. After that, restart the server with `disabled_storage_engines` set to its original value.

Unless invoked with the `--upgrade-system-tables` option, **mysql_upgrade** processes all tables in all user schemas as necessary. Table checking might take a long time to complete. Each table is locked and therefore unavailable to other sessions while it is being processed. Check and repair operations can be time-consuming, particularly for large tables. Table checking uses the `FOR UPGRADE` option of the `CHECK TABLE` statement. For details about what this option entails, see Section 13.7.2.2, “CHECK TABLE Statement”.

**mysql_upgrade** marks all checked and repaired tables with the current MySQL version number. This ensures that the next time you run **mysql_upgrade** with the same version of the server, it can be determined whether there is any need to check or repair a given table again.

**mysql_upgrade** saves the MySQL version number in a file named `mysql_upgrade_info` in the data directory. This is used to quickly check whether all tables have been checked for this release so that table-checking can be skipped. To ignore this file and perform the check regardless, use the `--force` option.

**mysql_upgrade** checks `mysql.user` system table rows and, for any row with an empty `plugin` column, sets that column to `'mysql_native_password'` or `'mysql_old_password'` depending on the hash format of the `Password` column value.

Support for pre-4.1 password hashing and `mysql_old_password` has been removed, so **mysql_upgrade** sets empty `plugin` values to `'mysql_native_password'` if the credentials use a hash format compatible with that plugin. Rows with a pre-4.1 password hash must be upgraded manually. For account upgrade instructions, see Section 6.4.1.3, “Migrating Away from Pre-4.1 Password Hashing and the mysql_old_password Plugin”.

**mysql_upgrade** does not upgrade the contents of the time zone tables or help tables. For upgrade instructions, see Section 5.1.13, “MySQL Server Time Zone Support”, and Section 5.1.14, “Server-Side Help Support”.

Unless invoked with the `--skip-sys-schema` option, **mysql_upgrade** installs the `sys` schema if it is not installed, and upgrades it to the current version otherwise. An error occurs if a `sys` schema exists but has no `version` view, on the assumption that its absence indicates a user-created schema:

```sql
A sys schema exists with no sys.version view. If
you have a user created sys schema, this must be renamed for the
upgrade to succeed.
```

To upgrade in this case, remove or rename the existing `sys` schema first.

**mysql_upgrade** checks for partitioned `InnoDB` tables that were created using the generic partitioning handler and attempts to upgrade them to `InnoDB` native partitioning. (Bug #76734, Bug
#20727344) You can upgrade such tables individually in the **mysql** client using the `ALTER TABLE ... UPGRADE PARTITIONING` SQL statement.

**mysql_upgrade** supports the following options, which can be specified on the command line or in the `[mysql_upgrade]` and `[client]` groups of an option file. For information about option files used by MySQL programs, see Section 4.2.2.2, “Using Option Files”.

**Table 4.12 mysql_upgrade Options**

<table frame="box" rules="all" summary="Command-line options available for mysql_upgrade."><col style="width: 31%"/><col style="width: 56%"/><col style="width: 12%"/><thead><tr><th>Option Name</th> <th>Description</th> <th>Introduced</th> </tr></thead><tbody><tr><th>--bind-address</th> <td>Use specified network interface to connect to MySQL Server</td> <td></td> </tr><tr><th>--character-sets-dir</th> <td>Directory where character sets are installed</td> <td></td> </tr><tr><th>--compress</th> <td>Compress all information sent between client and server</td> <td></td> </tr><tr><th>--debug</th> <td>Write debugging log</td> <td></td> </tr><tr><th>--debug-check</th> <td>Print debugging information when program exits</td> <td></td> </tr><tr><th>--debug-info</th> <td>Print debugging information, memory, and CPU statistics when program exits</td> <td></td> </tr><tr><th>--default-auth</th> <td>Authentication plugin to use</td> <td></td> </tr><tr><th>--default-character-set</th> <td>Specify default character set</td> <td></td> </tr><tr><th>--defaults-extra-file</th> <td>Read named option file in addition to usual option files</td> <td></td> </tr><tr><th>--defaults-file</th> <td>Read only named option file</td> <td></td> </tr><tr><th>--defaults-group-suffix</th> <td>Option group suffix value</td> <td></td> </tr><tr><th>--force</th> <td>Force execution even if mysql_upgrade has already been executed for current MySQL version</td> <td></td> </tr><tr><th>--help</th> <td>Display help message and exit</td> <td></td> </tr><tr><th>--host</th> <td>Host on which MySQL server is located</td> <td></td> </tr><tr><th>--login-path</th> <td>Read login path options from .mylogin.cnf</td> <td></td> </tr><tr><th>--max-allowed-packet</th> <td>Maximum packet length to send to or receive from server</td> <td></td> </tr><tr><th>--net-buffer-length</th> <td>Buffer size for TCP/IP and socket communication</td> <td></td> </tr><tr><th>--no-defaults</th> <td>Read no option files</td> <td></td> </tr><tr><th>--password</th> <td>Password to use when connecting to server</td> <td></td> </tr><tr><th>--pipe</th> <td>Connect to server using named pipe (Windows only)</td> <td></td> </tr><tr><th>--plugin-dir</th> <td>Directory where plugins are installed</td> <td></td> </tr><tr><th>--port</th> <td>TCP/IP port number for connection</td> <td></td> </tr><tr><th>--print-defaults</th> <td>Print default options</td> <td></td> </tr><tr><th>--protocol</th> <td>Transport protocol to use</td> <td></td> </tr><tr><th>--shared-memory-base-name</th> <td>Shared-memory name for shared-memory connections (Windows only)</td> <td></td> </tr><tr><th>--skip-sys-schema</th> <td>Do not install or upgrade sys schema</td> <td></td> </tr><tr><th>--socket</th> <td>Unix socket file or Windows named pipe to use</td> <td></td> </tr><tr><th>--ssl</th> <td>Enable connection encryption</td> <td></td> </tr><tr><th>--ssl-ca</th> <td>File that contains list of trusted SSL Certificate Authorities</td> <td></td> </tr><tr><th>--ssl-capath</th> <td>Directory that contains trusted SSL Certificate Authority certificate files</td> <td></td> </tr><tr><th>--ssl-cert</th> <td>File that contains X.509 certificate</td> <td></td> </tr><tr><th>--ssl-cipher</th> <td>Permissible ciphers for connection encryption</td> <td></td> </tr><tr><th>--ssl-crl</th> <td>File that contains certificate revocation lists</td> <td></td> </tr><tr><th>--ssl-crlpath</th> <td>Directory that contains certificate revocation-list files</td> <td></td> </tr><tr><th>--ssl-key</th> <td>File that contains X.509 key</td> <td></td> </tr><tr><th>--ssl-mode</th> <td>Desired security state of connection to server</td> <td>5.7.11</td> </tr><tr><th>--ssl-verify-server-cert</th> <td>Verify host name against server certificate Common Name identity</td> <td></td> </tr><tr><th>--tls-version</th> <td>Permissible TLS protocols for encrypted connections</td> <td>5.7.10</td> </tr><tr><th>--upgrade-system-tables</th> <td>Update only system tables, not user schemas</td> <td></td> </tr><tr><th>--user</th> <td>MySQL user name to use when connecting to server</td> <td></td> </tr><tr><th>--verbose</th> <td>Verbose mode</td> <td></td> </tr><tr><th>--version-check</th> <td>Check for proper server version</td> <td></td> </tr><tr><th>--write-binlog</th> <td>Write all statements to binary log</td> <td></td> </tr></tbody></table>

* `--help`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a short help message and exit.

* `--bind-address=ip_address`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  On a computer having multiple network interfaces, use this option to select which interface to use for connecting to the MySQL server.

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The directory where character sets are installed. See Section 10.15, “Character Set Configuration”.

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for compress"><tbody><tr><th>Command-Line Format</th> <td><code>--compress[={OFF|ON}]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Compress all information sent between the client and the server if possible. See Section 4.2.6, “Connection Compression Control”.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for debug"><tbody><tr><th>Command-Line Format</th> <td><code>--debug[=#]</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>d:t:O,/tmp/mysql_upgrade.trace</code></td> </tr></tbody></table>

  Write a debugging log. A typical *`debug_options`* string is `d:t:o,file_name`. The default is `d:t:O,/tmp/mysql_upgrade.trace`.

* `--debug-check`

  <table frame="box" rules="all" summary="Properties for debug-check"><tbody><tr><th>Command-Line Format</th> <td><code>--debug-check</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr></tbody></table>

  Print some debugging information when the program exits.

* `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Properties for debug-info"><tbody><tr><th>Command-Line Format</th> <td><code>--debug-info</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr></tbody></table>

  Print debugging information and memory and CPU usage statistics when the program exits.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for default-auth"><tbody><tr><th>Command-Line Format</th> <td><code>--default-auth=plugin</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  A hint about which client-side authentication plugin to use. See Section 6.2.13, “Pluggable Authentication”.

* `--default-character-set=charset_name`

  <table frame="box" rules="all" summary="Properties for default-character-set"><tbody><tr><th>Command-Line Format</th> <td><code>--default-character-set=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr></tbody></table>

  Use *`charset_name`* as the default character set. See Section 10.15, “Character Set Configuration”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, **mysql_upgrade** normally reads the `[client]` and `[mysql_upgrade]` groups. If this option is given as `--defaults-group-suffix=_other`, **mysql_upgrade** also reads the `[client_other]` and `[mysql_upgrade_other]` groups.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--force`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Ignore the `mysql_upgrade_info` file and force execution even if **mysql_upgrade** has already been executed for the current version of MySQL.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Connect to the MySQL server on the given host.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql_config_editor** utility. See Section 4.6.6, “mysql_config_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--max-allowed-packet=value`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  The maximum size of the buffer for client/server communication. The default value is 24MB. The minimum and maximum values are 4KB and 2GB.

* `--net-buffer-length=value`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  The initial size of the buffer for client/server communication. The default value is 1MB − 1KB. The minimum and maximum values are 4KB and 16MB.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the **mysql_config_editor** utility. See Section 4.6.6, “mysql_config_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  The password of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysql_upgrade** prompts for one. If given, there must be *no space* between `--password=` or `-p` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 6.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysql_upgrade** should not prompt for one, use the `--skip-password` option.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  On Windows, connect to the server using a named pipe. This option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  The directory in which to look for plugins. Specify this option if the `--default-auth` option is used to specify an authentication plugin but **mysql_upgrade** does not find it. See Section 6.2.13, “Pluggable Authentication”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  For TCP/IP connections, the port number to use.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Print the program name and all options that it gets from option files.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  The transport protocol to use for connecting to the server. It is useful when the other connection parameters normally result in use of a protocol other than the one you want. For details on the permissible values, see Section 4.2.5, “Connection Transport Protocols”.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  On Windows, the shared-memory name to use for connections made using shared memory to a local server. The default value is `MYSQL`. The shared-memory name is case-sensitive.

  This option applies only if the server was started with the `shared_memory` system variable enabled to support shared-memory connections.

* `--skip-sys-schema`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  By default, **mysql_upgrade** installs the `sys` schema if it is not installed, and upgrades it to the current version otherwise. The `--skip-sys-schema` option suppresses this behavior.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  For connections to `localhost`, the Unix socket file to use, or, on Windows, the name of the named pipe to use.

  On Windows, this option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--ssl*`

  Options that begin with `--ssl` specify whether to connect to the server using encryption and indicate where to find SSL keys and certificates. See Command Options for Encrypted Connections.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  The permissible TLS protocols for encrypted connections. The value is a list of one or more comma-separated protocol names. The protocols that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

  This option was added in MySQL 5.7.10.

* `--upgrade-system-tables`, `-s`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  Upgrade only the system tables in the `mysql` schema, do not upgrade user schemas.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The user name of the MySQL account to use for connecting to the server. The default user name is `root`.

* `--verbose`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  Verbose mode. Print more information about what the program does.

* `--version-check`, `-k`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  Check the version of the server to which **mysql_upgrade** is connecting to verify that it is the same as the version for which **mysql_upgrade** was built. If not, **mysql_upgrade** exits. This option is enabled by default; to disable the check, use `--skip-version-check`.

* `--write-binlog`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  By default, binary logging by **mysql_upgrade** is disabled. Invoke the program with `--write-binlog` if you want its actions to be written to the binary log.

  When the server is running with global transaction identifiers (GTIDs) enabled (`gtid_mode=ON`), do not enable binary logging by **mysql_upgrade**.
