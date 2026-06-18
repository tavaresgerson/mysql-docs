### 6.4.5 mysql\_upgrade — Check and Upgrade MySQL Tables

Note

As of MySQL 8.0.16, the MySQL server performs the upgrade
tasks previously handled by [**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables")
(for details, see
[Section 3.4, “What the MySQL Upgrade Process Upgrades”](upgrading-what-is-upgraded.html "3.4 What the MySQL Upgrade Process Upgrades")). Consequently,
[**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables") is unneeded and is deprecated
as of that version; expect it to be removed in a future
version of MySQL. Because [**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables") no
longer performs upgrade tasks, it exits with status 0
unconditionally.

Each time you upgrade MySQL, you should execute
[**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables"), which looks for
incompatibilities with the upgraded MySQL server:

* It upgrades the system tables in the
  `mysql` schema so that you can take
  advantage of new privileges or capabilities that might have
  been added.

* It upgrades the Performance Schema,
  `INFORMATION_SCHEMA`, and
  `sys` schema.

* It examines user schemas.

If [**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables") finds that a table has a
possible incompatibility, it performs a table check and, if
problems are found, attempts a table repair. If the table cannot
be repaired, see [Section 3.14, “Rebuilding or Repairing Tables or Indexes”](rebuilding-tables.html "3.14 Rebuilding or Repairing Tables or Indexes") for manual
table repair strategies.

[**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables") communicates directly with the
MySQL server, sending it the SQL statements required to perform
an upgrade.

Caution

You should always back up your current MySQL installation
*before* performing an upgrade. See
[Section 9.2, “Database Backup Methods”](backup-methods.html "9.2 Database Backup Methods").

Some upgrade incompatibilities may require special handling
*before* upgrading your MySQL installation
and running [**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables"). See
[Chapter 3, *Upgrading MySQL*](upgrading.html "Chapter 3 Upgrading MySQL"), for instructions on determining
whether any such incompatibilities apply to your installation
and how to handle them.

Use [**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables") like this:

1. Ensure that the server is running.
2. Invoke [**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables") to upgrade the
   system tables in the `mysql` schema and
   check and repair tables in other schemas:

   ```
   mysql_upgrade [options]
   ```

3. Stop the server and restart it so that any system table
   changes take effect.

If you have multiple MySQL server instances to upgrade, invoke
[**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables") with connection parameters
appropriate for connecting to each of the desired servers. For
example, with servers running on the local host on parts 3306
through 3308, upgrade each of them by connecting to the
appropriate port:

```
mysql_upgrade --protocol=tcp -P 3306 [other_options]
mysql_upgrade --protocol=tcp -P 3307 [other_options]
mysql_upgrade --protocol=tcp -P 3308 [other_options]
```

For local host connections on Unix, the
[`--protocol=tcp`](mysql-upgrade.html#option_mysql_upgrade_protocol) option
forces a connection using TCP/IP rather than the Unix socket
file.

By default, [**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables") runs as the MySQL
`root` user. If the `root`
password is expired when you run
[**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables"), it displays a message that
your password is expired and that
[**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables") failed as a result. To correct
this, reset the `root` password to unexpire it
and run [**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables") again. First, connect
to the server as `root`:

```
$> mysql -u root -p
Enter password: ****  <- enter root password here
```

Reset the password using [`ALTER
USER`](alter-user.html "15.7.1.1 ALTER USER Statement"):

```
mysql> ALTER USER USER() IDENTIFIED BY 'root-password';
```

Then exit [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") and run
[**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables") again:

```
$> mysql_upgrade [options]
```

Note

If you run the server with the
[`disabled_storage_engines`](server-system-variables.html#sysvar_disabled_storage_engines)
system variable set to disable certain storage engines (for
example, `MyISAM`),
[**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables") might fail with an error like
this:

```
mysql_upgrade: [ERROR] 3161: Storage engine MyISAM is disabled
(Table creation is disallowed).
```

To handle this, restart the server with
[`disabled_storage_engines`](server-system-variables.html#sysvar_disabled_storage_engines)
disabled. Then you should be able to run
[**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables") successfully. After that,
restart the server with
[`disabled_storage_engines`](server-system-variables.html#sysvar_disabled_storage_engines) set
to its original value.

Unless invoked with the
[`--upgrade-system-tables`](mysql-upgrade.html#option_mysql_upgrade_upgrade-system-tables)
option, [**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables") processes all tables in
all user schemas as necessary. Table checking might take a long
time to complete. Each table is locked and therefore unavailable
to other sessions while it is being processed. Check and repair
operations can be time-consuming, particularly for large tables.
Table checking uses the `FOR UPGRADE` option of
the [`CHECK TABLE`](check-table.html "15.7.3.2 CHECK TABLE Statement") statement. For
details about what this option entails, see
[Section 15.7.3.2, “CHECK TABLE Statement”](check-table.html "15.7.3.2 CHECK TABLE Statement").

[**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables") marks all checked and repaired
tables with the current MySQL version number. This ensures that
the next time you run [**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables") with the
same version of the server, it can be determined whether there
is any need to check or repair a given table again.

[**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables") saves the MySQL version number
in a file named `mysql_upgrade_info` in the
data directory. This is used to quickly check whether all tables
have been checked for this release so that table-checking can be
skipped. To ignore this file and perform the check regardless,
use the [`--force`](mysql-upgrade.html#option_mysql_upgrade_force) option.

Note

The `mysql_upgrade_info` file is
deprecated; expect it to be removed in a future version of
MySQL.

[**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables") checks
`mysql.user` system table rows and, for any row
with an empty `plugin` column, sets that column
to `'mysql_native_password'` if the credentials
use a hash format compatible with that plugin. Rows with a
pre-4.1 password hash must be upgraded manually.

[**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables") does not upgrade the contents
of the time zone tables or help tables. For upgrade
instructions, see [Section 7.1.15, “MySQL Server Time Zone Support”](time-zone-support.html "7.1.15 MySQL Server Time Zone Support"), and
[Section 7.1.17, “Server-Side Help Support”](server-side-help-support.html "7.1.17 Server-Side Help Support").

Unless invoked with the
[`--skip-sys-schema`](mysql-upgrade.html#option_mysql_upgrade_skip-sys-schema) option,
[**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables") installs the
`sys` schema if it is not installed, and
upgrades it to the current version otherwise. An error occurs if
a `sys` schema exists but has no
`version` view, on the assumption that its
absence indicates a user-created schema:

```
A sys schema exists with no sys.version view. If
you have a user created sys schema, this must be renamed for the
upgrade to succeed.
```

To upgrade in this case, remove or rename the existing
`sys` schema first.

[**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables") supports the following options,
which can be specified on the command line or in the
`[mysql_upgrade]` and
`[client]` groups of an option file. For
information about option files used by MySQL programs, see
[Section 6.2.2.2, “Using Option Files”](option-files.html "6.2.2.2 Using Option Files").

**Table 6.11 mysql\_upgrade Options**

<table frame="box" rules="all" summary="Command-line options available for mysql_upgrade."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th>
<th scope="col">Description</th>
<th scope="col">Introduced</th>
<th scope="col">Deprecated</th>
</tr></thead><tbody><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_bind-address">--bind-address</a></th>
<td>Use specified network interface to connect to MySQL Server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_character-sets-dir">--character-sets-dir</a></th>
<td>Directory where character sets are installed</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_compress">--compress</a></th>
<td>Compress all information sent between client and server</td>
<td></td>
<td>8.0.18</td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_compression-algorithms">--compression-algorithms</a></th>
<td>Permitted compression algorithms for connections to server</td>
<td>8.0.18</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_debug">--debug</a></th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_debug-check">--debug-check</a></th>
<td>Print debugging information when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_debug-info">--debug-info</a></th>
<td>Print debugging information, memory, and CPU statistics when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_default-auth">--default-auth</a></th>
<td>Authentication plugin to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_default-character-set">--default-character-set</a></th>
<td>Specify default character set</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_defaults-extra-file">--defaults-extra-file</a></th>
<td>Read named option file in addition to usual option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_defaults-file">--defaults-file</a></th>
<td>Read only named option file</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_defaults-group-suffix">--defaults-group-suffix</a></th>
<td>Option group suffix value</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_force">--force</a></th>
<td>Force execution even if mysql_upgrade has already been executed for current MySQL version</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_get-server-public-key">--get-server-public-key</a></th>
<td>Request RSA public key from server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_help">--help</a></th>
<td>Display help message and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_host">--host</a></th>
<td>Host on which MySQL server is located</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_login-path">--login-path</a></th>
<td>Read login path options from .mylogin.cnf</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_max-allowed-packet">--max-allowed-packet</a></th>
<td>Maximum packet length to send to or receive from server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_net-buffer-length">--net-buffer-length</a></th>
<td>Buffer size for TCP/IP and socket communication</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_no-defaults">--no-defaults</a></th>
<td>Read no option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_password">--password</a></th>
<td>Password to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_pipe">--pipe</a></th>
<td>Connect to server using named pipe (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_plugin-dir">--plugin-dir</a></th>
<td>Directory where plugins are installed</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_port">--port</a></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_print-defaults">--print-defaults</a></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_protocol">--protocol</a></th>
<td>Transport protocol to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_server-public-key-path">--server-public-key-path</a></th>
<td>Path name to file containing RSA public key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_shared-memory-base-name">--shared-memory-base-name</a></th>
<td>Shared-memory name for shared-memory connections (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_skip-sys-schema">--skip-sys-schema</a></th>
<td>Do not install or upgrade sys schema</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_socket">--socket</a></th>
<td>Unix socket file or Windows named pipe to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_ssl">--ssl-ca</a></th>
<td>File that contains list of trusted SSL Certificate Authorities</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_ssl">--ssl-capath</a></th>
<td>Directory that contains trusted SSL Certificate Authority certificate files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_ssl">--ssl-cert</a></th>
<td>File that contains X.509 certificate</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_ssl">--ssl-cipher</a></th>
<td>Permissible ciphers for connection encryption</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_ssl">--ssl-crl</a></th>
<td>File that contains certificate revocation lists</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_ssl">--ssl-crlpath</a></th>
<td>Directory that contains certificate revocation-list files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_ssl-fips-mode">--ssl-fips-mode</a></th>
<td>Whether to enable FIPS mode on client side</td>
<td></td>
<td>8.0.34</td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_ssl">--ssl-key</a></th>
<td>File that contains X.509 key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_ssl">--ssl-mode</a></th>
<td>Desired security state of connection to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_ssl">--ssl-session-data</a></th>
<td>File that contains SSL session data</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_ssl">--ssl-session-data-continue-on-failed-reuse</a></th>
<td>Whether to establish connections if session reuse fails</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_tls-ciphersuites">--tls-ciphersuites</a></th>
<td>Permissible TLSv1.3 ciphersuites for encrypted connections</td>
<td>8.0.16</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_tls-version">--tls-version</a></th>
<td>Permissible TLS protocols for encrypted connections</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_upgrade-system-tables">--upgrade-system-tables</a></th>
<td>Update only system tables, not user schemas</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_user">--user</a></th>
<td>MySQL user name to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_verbose">--verbose</a></th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_version-check">--version-check</a></th>
<td>Check for proper server version</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_write-binlog">--write-binlog</a></th>
<td>Write all statements to binary log</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysql-upgrade.html#option_mysql_upgrade_zstd-compression-level">--zstd-compression-level</a></th>
<td>Compression level for connections to server that use zstd compression</td>
<td>8.0.18</td>
<td></td>
</tr></tbody></table>

* [`--help`](mysql-upgrade.html#option_mysql_upgrade_help)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>

  Display a short help message and exit.

* [`--bind-address=ip_address`](mysql-upgrade.html#option_mysql_upgrade_bind-address)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>

  On a computer having multiple network interfaces, use this
  option to select which interface to use for connecting to
  the MySQL server.

* [`--character-sets-dir=dir_name`](mysql-upgrade.html#option_mysql_upgrade_character-sets-dir)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=dir_name</code></td>
</tr><tr><th>Type</th>
<td>Directory name</td>
</tr></tbody></table>

  The directory where character sets are installed. See
  [Section 12.15, “Character Set Configuration”](charset-configuration.html "12.15 Character Set Configuration").

* [`--compress`](mysql-upgrade.html#option_mysql_upgrade_compress),
  `-C`

  <table frame="box" rules="all" summary="Properties for compress"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--compress[={OFF|ON}]</code></td>
</tr><tr><th>Deprecated</th>
<td>8.0.18</td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">OFF</code></td>
</tr></tbody></table>

  Compress all information sent between the client and the
  server if possible. See
  [Section 6.2.8, “Connection Compression Control”](connection-compression-control.html "6.2.8 Connection Compression Control").

  As of MySQL 8.0.18, this option is deprecated. Expect it to
  be removed in a future version of MySQL. See
  [Configuring Legacy Connection Compression](connection-compression-control.html#connection-compression-legacy-configuration "Configuring Legacy Connection Compression").

* [`--compression-algorithms=value`](mysql-upgrade.html#option_mysql_upgrade_compression-algorithms)

  <table frame="box" rules="all" summary="Properties for compression-algorithms"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--compression-algorithms=value</code></td>
</tr><tr><th>Introduced</th>
<td>8.0.18</td>
</tr><tr><th>Type</th>
<td>Set</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">uncompressed</code></td>
</tr><tr><th>Valid Values</th>
<td><p class="valid-value"><code class="literal">zlib</code></p><p class="valid-value"><code class="literal">zstd</code></p><p class="valid-value"><code class="literal">uncompressed</code></p></td>
</tr></tbody></table>

  The permitted compression algorithms for connections to the
  server. The available algorithms are the same as for the
  [`protocol_compression_algorithms`](server-system-variables.html#sysvar_protocol_compression_algorithms)
  system variable. The default value is
  `uncompressed`.

  For more information, see
  [Section 6.2.8, “Connection Compression Control”](connection-compression-control.html "6.2.8 Connection Compression Control").

  This option was added in MySQL 8.0.18.

* [`--debug[=debug_options]`](mysql-upgrade.html#option_mysql_upgrade_debug),
  `-#
  [debug_options]`

  <table frame="box" rules="all" summary="Properties for debug"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--debug[=#]</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">d:t:O,/tmp/mysql_upgrade.trace</code></td>
</tr></tbody></table>

  Write a debugging log. A typical
  *`debug_options`* string is
  `d:t:o,file_name`.
  The default is
  `d:t:O,/tmp/mysql_upgrade.trace`.

* [`--debug-check`](mysql-upgrade.html#option_mysql_upgrade_debug-check)

  <table frame="box" rules="all" summary="Properties for debug-check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--debug-check</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr></tbody></table>

  Print some debugging information when the program exits.

* [`--debug-info`](mysql-upgrade.html#option_mysql_upgrade_debug-info),
  `-T`

  <table frame="box" rules="all" summary="Properties for debug-info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--debug-info</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>

  Print debugging information and memory and CPU usage
  statistics when the program exits.

* [`--default-auth=plugin`](mysql-upgrade.html#option_mysql_upgrade_default-auth)

  <table frame="box" rules="all" summary="Properties for default-auth"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--default-auth=plugin</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr></tbody></table>

  A hint about which client-side authentication plugin to use.
  See [Section 8.2.17, “Pluggable Authentication”](pluggable-authentication.html "8.2.17 Pluggable Authentication").

* [`--default-character-set=charset_name`](mysql-upgrade.html#option_mysql_upgrade_default-character-set)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>0

  Use *`charset_name`* as the default
  character set. See [Section 12.15, “Character Set Configuration”](charset-configuration.html "12.15 Character Set Configuration").

* [`--defaults-extra-file=file_name`](mysql-upgrade.html#option_mysql_upgrade_defaults-extra-file)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>1

  Read this option file after the global option file but (on
  Unix) before the user option file. If the file does not
  exist or is otherwise inaccessible, an error occurs. If
  *`file_name`* is not an absolute path
  name, it is interpreted relative to the current directory.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--defaults-file=file_name`](mysql-upgrade.html#option_mysql_upgrade_defaults-file)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>2

  Use only the given option file. If the file does not exist
  or is otherwise inaccessible, an error occurs. If
  *`file_name`* is not an absolute path
  name, it is interpreted relative to the current directory.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--defaults-group-suffix=str`](mysql-upgrade.html#option_mysql_upgrade_defaults-group-suffix)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>3

  Read not only the usual option groups, but also groups with
  the usual names and a suffix of
  *`str`*. For example,
  [**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables") normally reads the
  `[client]` and
  `[mysql_upgrade]` groups. If this option is
  given as
  [`--defaults-group-suffix=_other`](mysql-upgrade.html#option_mysql_upgrade_defaults-group-suffix),
  [**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables") also reads the
  `[client_other]` and
  `[mysql_upgrade_other]` groups.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--force`](mysql-upgrade.html#option_mysql_upgrade_force)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>4

  Ignore the `mysql_upgrade_info` file and
  force execution even if [**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables") has
  already been executed for the current version of MySQL.

* [`--get-server-public-key`](mysql-upgrade.html#option_mysql_upgrade_get-server-public-key)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>5

  Request from the server the public key required for RSA key
  pair-based password exchange. This option applies to clients
  that authenticate with the
  `caching_sha2_password` authentication
  plugin. For that plugin, the server does not send the public
  key unless requested. This option is ignored for accounts
  that do not authenticate with that plugin. It is also
  ignored if RSA-based password exchange is not used, as is
  the case when the client connects to the server using a
  secure connection.

  If
  [`--server-public-key-path=file_name`](mysql-upgrade.html#option_mysql_upgrade_server-public-key-path)
  is given and specifies a valid public key file, it takes
  precedence over
  [`--get-server-public-key`](mysql-upgrade.html#option_mysql_upgrade_get-server-public-key).

  For information about the
  `caching_sha2_password` plugin, see
  [Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”](caching-sha2-pluggable-authentication.html "8.4.1.2 Caching SHA-2 Pluggable Authentication").

* [`--host=host_name`](mysql-upgrade.html#option_mysql_upgrade_host),
  `-h host_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>6

  Connect to the MySQL server on the given host.

* [`--login-path=name`](mysql-upgrade.html#option_mysql_upgrade_login-path)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>7

  Read options from the named login path in the
  `.mylogin.cnf` login path file. A
  “login path” is an option group containing
  options that specify which MySQL server to connect to and
  which account to authenticate as. To create or modify a
  login path file, use the
  [**mysql\_config\_editor**](mysql-config-editor.html "6.6.7 mysql_config_editor — MySQL Configuration Utility") utility. See
  [Section 6.6.7, “mysql\_config\_editor — MySQL Configuration Utility”](mysql-config-editor.html "6.6.7 mysql_config_editor — MySQL Configuration Utility").

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--max-allowed-packet=value`](mysql-upgrade.html#option_mysql_upgrade_max-allowed-packet)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>8

  The maximum size of the buffer for client/server
  communication. The default value is 24MB. The minimum and
  maximum values are 4KB and 2GB.

* [`--net-buffer-length=value`](mysql-upgrade.html#option_mysql_upgrade_net-buffer-length)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>9

  The initial size of the buffer for client/server
  communication. The default value is 1MB − 1KB. The
  minimum and maximum values are 4KB and 16MB.

* [`--no-defaults`](mysql-upgrade.html#option_mysql_upgrade_no-defaults)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>0

  Do not read any option files. If program startup fails due
  to reading unknown options from an option file,
  [`--no-defaults`](mysql-upgrade.html#option_mysql_upgrade_no-defaults) can be
  used to prevent them from being read.

  The exception is that the `.mylogin.cnf`
  file is read in all cases, if it exists. This permits
  passwords to be specified in a safer way than on the command
  line even when
  [`--no-defaults`](mysql-upgrade.html#option_mysql_upgrade_no-defaults) is used.
  To create `.mylogin.cnf`, use the
  [**mysql\_config\_editor**](mysql-config-editor.html "6.6.7 mysql_config_editor — MySQL Configuration Utility") utility. See
  [Section 6.6.7, “mysql\_config\_editor — MySQL Configuration Utility”](mysql-config-editor.html "6.6.7 mysql_config_editor — MySQL Configuration Utility").

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--password[=password]`](mysql-upgrade.html#option_mysql_upgrade_password),
  `-p[password]`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>1

  The password of the MySQL account used for connecting to the
  server. The password value is optional. If not given,
  [**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables") prompts for one. If given,
  there must be *no space* between
  [`--password=`](mysql-upgrade.html#option_mysql_upgrade_password) or
  `-p` and the password following it. If no
  password option is specified, the default is to send no
  password.

  Specifying a password on the command line should be
  considered insecure. To avoid giving the password on the
  command line, use an option file. See
  [Section 8.1.2.1, “End-User Guidelines for Password Security”](password-security-user.html "8.1.2.1 End-User Guidelines for Password Security").

  To explicitly specify that there is no password and that
  [**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables") should not prompt for one,
  use the
  [`--skip-password`](mysql-upgrade.html#option_mysql_upgrade_password)
  option.

* [`--pipe`](mysql-upgrade.html#option_mysql_upgrade_pipe),
  `-W`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>2

  On Windows, connect to the server using a named pipe. This
  option applies only if the server was started with the
  [`named_pipe`](server-system-variables.html#sysvar_named_pipe) system variable
  enabled to support named-pipe connections. In addition, the
  user making the connection must be a member of the Windows
  group specified by the
  [`named_pipe_full_access_group`](server-system-variables.html#sysvar_named_pipe_full_access_group)
  system variable.

* [`--plugin-dir=dir_name`](mysql-upgrade.html#option_mysql_upgrade_plugin-dir)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>3

  The directory in which to look for plugins. Specify this
  option if the
  [`--default-auth`](mysql-upgrade.html#option_mysql_upgrade_default-auth) option
  is used to specify an authentication plugin but
  [**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables") does not find it. See
  [Section 8.2.17, “Pluggable Authentication”](pluggable-authentication.html "8.2.17 Pluggable Authentication").

* [`--port=port_num`](mysql-upgrade.html#option_mysql_upgrade_port),
  `-P port_num`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>4

  For TCP/IP connections, the port number to use.

* [`--print-defaults`](mysql-upgrade.html#option_mysql_upgrade_print-defaults)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>5

  Print the program name and all options that it gets from
  option files.

* [`--protocol={TCP|SOCKET|PIPE|MEMORY}`](mysql-upgrade.html#option_mysql_upgrade_protocol)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>6

  The transport protocol to use for connecting to the server.
  It is useful when the other connection parameters normally
  result in use of a protocol other than the one you want. For
  details on the permissible values, see
  [Section 6.2.7, “Connection Transport Protocols”](transport-protocols.html "6.2.7 Connection Transport Protocols").

* [`--server-public-key-path=file_name`](mysql-upgrade.html#option_mysql_upgrade_server-public-key-path)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>7

  The path name to a file in PEM format containing a
  client-side copy of the public key required by the server
  for RSA key pair-based password exchange. This option
  applies to clients that authenticate with the
  `sha256_password` or
  `caching_sha2_password` authentication
  plugin. This option is ignored for accounts that do not
  authenticate with one of those plugins. It is also ignored
  if RSA-based password exchange is not used, as is the case
  when the client connects to the server using a secure
  connection.

  If
  [`--server-public-key-path=file_name`](mysql-upgrade.html#option_mysql_upgrade_server-public-key-path)
  is given and specifies a valid public key file, it takes
  precedence over
  [`--get-server-public-key`](mysql-upgrade.html#option_mysql_upgrade_get-server-public-key).

  For `sha256_password`, this option applies
  only if MySQL was built using OpenSSL.

  For information about the `sha256_password`
  and `caching_sha2_password` plugins, see
  [Section 8.4.1.3, “SHA-256 Pluggable Authentication”](sha256-pluggable-authentication.html "8.4.1.3 SHA-256 Pluggable Authentication"), and
  [Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”](caching-sha2-pluggable-authentication.html "8.4.1.2 Caching SHA-2 Pluggable Authentication").

* [`--shared-memory-base-name=name`](mysql-upgrade.html#option_mysql_upgrade_shared-memory-base-name)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>8

  On Windows, the shared-memory name to use for connections
  made using shared memory to a local server. The default
  value is `MYSQL`. The shared-memory name is
  case-sensitive.

  This option applies only if the server was started with the
  [`shared_memory`](server-system-variables.html#sysvar_shared_memory) system
  variable enabled to support shared-memory connections.

* [`--skip-sys-schema`](mysql-upgrade.html#option_mysql_upgrade_skip-sys-schema)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>9

  By default, [**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables") installs the
  `sys` schema if it is not installed, and
  upgrades it to the current version otherwise. The
  [`--skip-sys-schema`](mysql-upgrade.html#option_mysql_upgrade_skip-sys-schema)
  option suppresses this behavior.

* [`--socket=path`](mysql-upgrade.html#option_mysql_upgrade_socket),
  `-S path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=dir_name</code></td>
</tr><tr><th>Type</th>
<td>Directory name</td>
</tr></tbody></table>0

  For connections to `localhost`, the Unix
  socket file to use, or, on Windows, the name of the named
  pipe to use.

  On Windows, this option applies only if the server was
  started with the [`named_pipe`](server-system-variables.html#sysvar_named_pipe)
  system variable enabled to support named-pipe connections.
  In addition, the user making the connection must be a member
  of the Windows group specified by the
  [`named_pipe_full_access_group`](server-system-variables.html#sysvar_named_pipe_full_access_group)
  system variable.

* `--ssl*`

  Options that begin with `--ssl` specify
  whether to connect to the server using encryption and
  indicate where to find SSL keys and certificates. See
  [Command Options for Encrypted Connections](connection-options.html#encrypted-connection-options "Command Options for Encrypted Connections").

* [`--ssl-fips-mode={OFF|ON|STRICT}`](mysql-upgrade.html#option_mysql_upgrade_ssl-fips-mode)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=dir_name</code></td>
</tr><tr><th>Type</th>
<td>Directory name</td>
</tr></tbody></table>1

  Controls whether to enable FIPS mode on the client side. The
  [`--ssl-fips-mode`](mysql-upgrade.html#option_mysql_upgrade_ssl-fips-mode) option
  differs from other
  `--ssl-xxx`
  options in that it is not used to establish encrypted
  connections, but rather to affect which cryptographic
  operations to permit. See [Section 8.8, “FIPS Support”](fips-mode.html "8.8 FIPS Support").

  These [`--ssl-fips-mode`](mysql-upgrade.html#option_mysql_upgrade_ssl-fips-mode)
  values are permitted:

  + `OFF`: Disable FIPS mode.
  + `ON`: Enable FIPS mode.
  + `STRICT`: Enable “strict”
    FIPS mode.

  Note

  If the OpenSSL FIPS Object Module is not available, the
  only permitted value for
  [`--ssl-fips-mode`](mysql-upgrade.html#option_mysql_upgrade_ssl-fips-mode) is
  `OFF`. In this case, setting
  [`--ssl-fips-mode`](mysql-upgrade.html#option_mysql_upgrade_ssl-fips-mode) to
  `ON` or `STRICT` causes
  the client to produce a warning at startup and to operate
  in non-FIPS mode.

  As of MySQL 8.0.34, this option is deprecated. Expect it to
  be removed in a future version of MySQL.

* [`--tls-ciphersuites=ciphersuite_list`](mysql-upgrade.html#option_mysql_upgrade_tls-ciphersuites)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=dir_name</code></td>
</tr><tr><th>Type</th>
<td>Directory name</td>
</tr></tbody></table>2

  The permissible ciphersuites for encrypted connections that
  use TLSv1.3. The value is a list of one or more
  colon-separated ciphersuite names. The ciphersuites that can
  be named for this option depend on the SSL library used to
  compile MySQL. For details, see
  [Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”](encrypted-connection-protocols-ciphers.html "8.3.2 Encrypted Connection TLS Protocols and Ciphers").

  This option was added in MySQL 8.0.16.

* [`--tls-version=protocol_list`](mysql-upgrade.html#option_mysql_upgrade_tls-version)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=dir_name</code></td>
</tr><tr><th>Type</th>
<td>Directory name</td>
</tr></tbody></table>3

  The permissible TLS protocols for encrypted connections. The
  value is a list of one or more comma-separated protocol
  names. The protocols that can be named for this option
  depend on the SSL library used to compile MySQL. For
  details, see
  [Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”](encrypted-connection-protocols-ciphers.html "8.3.2 Encrypted Connection TLS Protocols and Ciphers").

* [`--upgrade-system-tables`](mysql-upgrade.html#option_mysql_upgrade_upgrade-system-tables),
  `-s`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=dir_name</code></td>
</tr><tr><th>Type</th>
<td>Directory name</td>
</tr></tbody></table>4

  Upgrade only the system tables in the
  `mysql` schema, do not upgrade user
  schemas.

* [`--user=user_name`](mysql-upgrade.html#option_mysql_upgrade_user),
  `-u user_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=dir_name</code></td>
</tr><tr><th>Type</th>
<td>Directory name</td>
</tr></tbody></table>5

  The user name of the MySQL account to use for connecting to
  the server. The default user name is
  `root`.

* [`--verbose`](mysql-upgrade.html#option_mysql_upgrade_verbose)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=dir_name</code></td>
</tr><tr><th>Type</th>
<td>Directory name</td>
</tr></tbody></table>6

  Verbose mode. Print more information about what the program
  does.

* [`--version-check`](mysql-upgrade.html#option_mysql_upgrade_version-check),
  `-k`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=dir_name</code></td>
</tr><tr><th>Type</th>
<td>Directory name</td>
</tr></tbody></table>7

  Check the version of the server to which
  [**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables") is connecting to verify
  that it is the same as the version for which
  [**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables") was built. If not,
  [**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables") exits. This option is
  enabled by default; to disable the check, use
  `--skip-version-check`.

* [`--write-binlog`](mysql-upgrade.html#option_mysql_upgrade_write-binlog)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=dir_name</code></td>
</tr><tr><th>Type</th>
<td>Directory name</td>
</tr></tbody></table>8

  By default, binary logging by
  [**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables") is disabled. Invoke the
  program with
  [`--write-binlog`](mysql-upgrade.html#option_mysql_upgrade_write-binlog) if you
  want its actions to be written to the binary log.

  When the server is running with global transaction
  identifiers (GTIDs) enabled
  ([`gtid_mode=ON`](replication-options-gtids.html#sysvar_gtid_mode)), do not
  enable binary logging by [**mysql\_upgrade**](mysql-upgrade.html "6.4.5 mysql_upgrade — Check and Upgrade MySQL Tables").

* [`--zstd-compression-level=level`](mysql-upgrade.html#option_mysql_upgrade_zstd-compression-level)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=dir_name</code></td>
</tr><tr><th>Type</th>
<td>Directory name</td>
</tr></tbody></table>9

  The compression level to use for connections to the server
  that use the `zstd` compression algorithm.
  The permitted levels are from 1 to 22, with larger values
  indicating increasing levels of compression. The default
  `zstd` compression level is 3. The
  compression level setting has no effect on connections that
  do not use `zstd` compression.

  For more information, see
  [Section 6.2.8, “Connection Compression Control”](connection-compression-control.html "6.2.8 Connection Compression Control").

  This option was added in MySQL 8.0.18.