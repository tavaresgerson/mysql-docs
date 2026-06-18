### 6.5.3 mysqlcheck — A Table Maintenance Program

The [**mysqlcheck**](mysqlcheck.html "6.5.3 mysqlcheck — A Table Maintenance Program") client performs table
maintenance: It checks, repairs, optimizes, or analyzes tables.

Each table is locked and therefore unavailable to other sessions
while it is being processed, although for check operations, the
table is locked with a `READ` lock only (see
[Section 15.3.6, “LOCK TABLES and UNLOCK TABLES Statements”](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements"), for more information about
`READ` and `WRITE` locks).
Table maintenance operations can be time-consuming, particularly
for large tables. If you use the
[`--databases`](mysqlcheck.html#option_mysqlcheck_databases) or
[`--all-databases`](mysqlcheck.html#option_mysqlcheck_all-databases) option to
process all tables in one or more databases, an invocation of
[**mysqlcheck**](mysqlcheck.html "6.5.3 mysqlcheck — A Table Maintenance Program") might take a long time. (This is
also true for the MySQL upgrade procedure if it determines that
table checking is needed because it processes tables the same
way.)

[**mysqlcheck**](mysqlcheck.html "6.5.3 mysqlcheck — A Table Maintenance Program") must be used when the
[**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") server is running, which means that
you do not have to stop the server to perform table maintenance.

[**mysqlcheck**](mysqlcheck.html "6.5.3 mysqlcheck — A Table Maintenance Program") uses the SQL statements
[`CHECK TABLE`](check-table.html "15.7.3.2 CHECK TABLE Statement"),
[`REPAIR TABLE`](repair-table.html "15.7.3.5 REPAIR TABLE Statement"),
[`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement"), and
[`OPTIMIZE TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement") in a convenient
way for the user. It determines which statements to use for the
operation you want to perform, and then sends the statements to
the server to be executed. For details about which storage
engines each statement works with, see the descriptions for
those statements in
[Section 15.7.3, “Table Maintenance Statements”](table-maintenance-statements.html "15.7.3 Table Maintenance Statements").

All storage engines do not necessarily support all four
maintenance operations. In such cases, an error message is
displayed. For example, if `test.t` is an
`MEMORY` table, an attempt to check it produces
this result:

```
$> mysqlcheck test t
test.t
note     : The storage engine for the table doesn't support check
```

If [**mysqlcheck**](mysqlcheck.html "6.5.3 mysqlcheck — A Table Maintenance Program") is unable to repair a table,
see [Section 3.14, “Rebuilding or Repairing Tables or Indexes”](rebuilding-tables.html "3.14 Rebuilding or Repairing Tables or Indexes") for manual table repair
strategies. This is the case, for example, for
`InnoDB` tables, which can be checked with
[`CHECK TABLE`](check-table.html "15.7.3.2 CHECK TABLE Statement"), but not repaired
with [`REPAIR TABLE`](repair-table.html "15.7.3.5 REPAIR TABLE Statement").

Caution

It is best to make a backup of a table before performing a
table repair operation; under some circumstances the operation
might cause data loss. Possible causes include but are not
limited to file system errors.

There are three general ways to invoke
[**mysqlcheck**](mysqlcheck.html "6.5.3 mysqlcheck — A Table Maintenance Program"):

```
mysqlcheck [options] db_name [tbl_name ...]
mysqlcheck [options] --databases db_name ...
mysqlcheck [options] --all-databases
```

If you do not name any tables following
*`db_name`* or if you use the
[`--databases`](mysqlcheck.html#option_mysqlcheck_databases) or
[`--all-databases`](mysqlcheck.html#option_mysqlcheck_all-databases) option,
entire databases are checked.

[**mysqlcheck**](mysqlcheck.html "6.5.3 mysqlcheck — A Table Maintenance Program") has a special feature compared to
other client programs. The default behavior of checking tables
([`--check`](mysqlcheck.html#option_mysqlcheck_check)) can be changed by
renaming the binary. If you want to have a tool that repairs
tables by default, you should just make a copy of
[**mysqlcheck**](mysqlcheck.html "6.5.3 mysqlcheck — A Table Maintenance Program") named
**mysqlrepair**, or make a symbolic link to
[**mysqlcheck**](mysqlcheck.html "6.5.3 mysqlcheck — A Table Maintenance Program") named
**mysqlrepair**. If you invoke
**mysqlrepair**, it repairs tables.

The names shown in the following table can be used to change
[**mysqlcheck**](mysqlcheck.html "6.5.3 mysqlcheck — A Table Maintenance Program") default behavior.

<table summary="Command names that can be used to change mysqlcheck default behavior."><col style="width: 25%"/><col style="width: 75%"/><thead><tr>
<th>Command</th>
<th>Meaning</th>
</tr></thead><tbody><tr>
<td><span class="command"><strong>mysqlrepair</strong></span></td>
<td>The default option is <a class="link" href="mysqlcheck.html#option_mysqlcheck_repair"><code class="option">--repair</code></a></td>
</tr><tr>
<td><span class="command"><strong>mysqlanalyze</strong></span></td>
<td>The default option is <a class="link" href="mysqlcheck.html#option_mysqlcheck_analyze"><code class="option">--analyze</code></a></td>
</tr><tr>
<td><span class="command"><strong>mysqloptimize</strong></span></td>
<td>The default option is <a class="link" href="mysqlcheck.html#option_mysqlcheck_optimize"><code class="option">--optimize</code></a></td>
</tr></tbody></table>

[**mysqlcheck**](mysqlcheck.html "6.5.3 mysqlcheck — A Table Maintenance Program") supports the following options,
which can be specified on the command line or in the
`[mysqlcheck]` and `[client]`
groups of an option file. For information about option files
used by MySQL programs, see [Section 6.2.2.2, “Using Option Files”](option-files.html "6.2.2.2 Using Option Files").

**Table 6.14 mysqlcheck Options**

<table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th>
<th scope="col">Description</th>
<th scope="col">Introduced</th>
<th scope="col">Deprecated</th>
</tr></thead><tbody><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-databases">--all-databases</a></th>
<td>Check all tables in all databases</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-in-1">--all-in-1</a></th>
<td>Execute a single statement for each database that names all the tables from that database</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_analyze">--analyze</a></th>
<td>Analyze the tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_auto-repair">--auto-repair</a></th>
<td>If a checked table is corrupted, automatically fix it</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_bind-address">--bind-address</a></th>
<td>Use specified network interface to connect to MySQL Server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_character-sets-dir">--character-sets-dir</a></th>
<td>Directory where character sets are installed</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_check">--check</a></th>
<td>Check the tables for errors</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-only-changed">--check-only-changed</a></th>
<td>Check only tables that have changed since the last check</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-upgrade">--check-upgrade</a></th>
<td>Invoke CHECK TABLE with the FOR UPGRADE option</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_compress">--compress</a></th>
<td>Compress all information sent between client and server</td>
<td></td>
<td>8.0.18</td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_compression-algorithms">--compression-algorithms</a></th>
<td>Permitted compression algorithms for connections to server</td>
<td>8.0.18</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_databases">--databases</a></th>
<td>Interpret all arguments as database names</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug">--debug</a></th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-check">--debug-check</a></th>
<td>Print debugging information when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-info">--debug-info</a></th>
<td>Print debugging information, memory, and CPU statistics when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_default-auth">--default-auth</a></th>
<td>Authentication plugin to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_default-character-set">--default-character-set</a></th>
<td>Specify default character set</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-extra-file">--defaults-extra-file</a></th>
<td>Read named option file in addition to usual option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-file">--defaults-file</a></th>
<td>Read only named option file</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-group-suffix">--defaults-group-suffix</a></th>
<td>Option group suffix value</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_enable-cleartext-plugin">--enable-cleartext-plugin</a></th>
<td>Enable cleartext authentication plugin</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_extended">--extended</a></th>
<td>Check and repair tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_fast">--fast</a></th>
<td>Check only tables that have not been closed properly</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_force">--force</a></th>
<td>Continue even if an SQL error occurs</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_get-server-public-key">--get-server-public-key</a></th>
<td>Request RSA public key from server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_help">--help</a></th>
<td>Display help message and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_host">--host</a></th>
<td>Host on which MySQL server is located</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_login-path">--login-path</a></th>
<td>Read login path options from .mylogin.cnf</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_medium-check">--medium-check</a></th>
<td>Do a check that is faster than an --extended operation</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_no-defaults">--no-defaults</a></th>
<td>Read no option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_optimize">--optimize</a></th>
<td>Optimize the tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password">--password</a></th>
<td>Password to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password1">--password1</a></th>
<td>First multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password2">--password2</a></th>
<td>Second multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password3">--password3</a></th>
<td>Third multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_pipe">--pipe</a></th>
<td>Connect to server using named pipe (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_plugin-dir">--plugin-dir</a></th>
<td>Directory where plugins are installed</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_port">--port</a></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_print-defaults">--print-defaults</a></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_protocol">--protocol</a></th>
<td>Transport protocol to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_quick">--quick</a></th>
<td>The fastest method of checking</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_repair">--repair</a></th>
<td>Perform a repair that can fix almost anything except unique keys that are not unique</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_server-public-key-path">--server-public-key-path</a></th>
<td>Path name to file containing RSA public key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_shared-memory-base-name">--shared-memory-base-name</a></th>
<td>Shared-memory name for shared-memory connections (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_silent">--silent</a></th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_skip-database">--skip-database</a></th>
<td>Omit this database from performed operations</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_socket">--socket</a></th>
<td>Unix socket file or Windows named pipe to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-ca</a></th>
<td>File that contains list of trusted SSL Certificate Authorities</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-capath</a></th>
<td>Directory that contains trusted SSL Certificate Authority certificate files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-cert</a></th>
<td>File that contains X.509 certificate</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-cipher</a></th>
<td>Permissible ciphers for connection encryption</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-crl</a></th>
<td>File that contains certificate revocation lists</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-crlpath</a></th>
<td>Directory that contains certificate revocation-list files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl-fips-mode">--ssl-fips-mode</a></th>
<td>Whether to enable FIPS mode on client side</td>
<td></td>
<td>8.0.34</td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-key</a></th>
<td>File that contains X.509 key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-mode</a></th>
<td>Desired security state of connection to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-session-data</a></th>
<td>File that contains SSL session data</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-session-data-continue-on-failed-reuse</a></th>
<td>Whether to establish connections if session reuse fails</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_tables">--tables</a></th>
<td>Overrides the --databases or -B option</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_tls-ciphersuites">--tls-ciphersuites</a></th>
<td>Permissible TLSv1.3 ciphersuites for encrypted connections</td>
<td>8.0.16</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_tls-version">--tls-version</a></th>
<td>Permissible TLS protocols for encrypted connections</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_use-frm">--use-frm</a></th>
<td>For repair operations on MyISAM tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_user">--user</a></th>
<td>MySQL user name to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_verbose">--verbose</a></th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_version">--version</a></th>
<td>Display version information and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_write-binlog">--write-binlog</a></th>
<td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_zstd-compression-level">--zstd-compression-level</a></th>
<td>Compression level for connections to server that use zstd compression</td>
<td>8.0.18</td>
<td></td>
</tr></tbody></table>

* [`--help`](mysqlcheck.html#option_mysqlcheck_help),
  `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>

  Display a help message and exit.

* [`--all-databases`](mysqlcheck.html#option_mysqlcheck_all-databases),
  `-A`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--all-databases</code></td>
</tr></tbody></table>

  Check all tables in all databases. This is the same as using
  the [`--databases`](mysqlcheck.html#option_mysqlcheck_databases) option
  and naming all the databases on the command line, except
  that the `INFORMATION_SCHEMA` and
  `performance_schema` databases are not
  checked. They can be checked by explicitly naming them with
  the [`--databases`](mysqlcheck.html#option_mysqlcheck_databases) option.

* [`--all-in-1`](mysqlcheck.html#option_mysqlcheck_all-in-1),
  `-1`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--all-in-1</code></td>
</tr></tbody></table>

  Instead of issuing a statement for each table, execute a
  single statement for each database that names all the tables
  from that database to be processed.

* [`--analyze`](mysqlcheck.html#option_mysqlcheck_analyze),
  `-a`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--analyze</code></td>
</tr></tbody></table>

  Analyze the tables.

* [`--auto-repair`](mysqlcheck.html#option_mysqlcheck_auto-repair)

  <table frame="box" rules="all" summary="Properties for auto-repair"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-repair</code></td>
</tr></tbody></table>

  If a checked table is corrupted, automatically fix it. Any
  necessary repairs are done after all tables have been
  checked.

* [`--bind-address=ip_address`](mysqlcheck.html#option_mysqlcheck_bind-address)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>

  On a computer having multiple network interfaces, use this
  option to select which interface to use for connecting to
  the MySQL server.

* [`--character-sets-dir=dir_name`](mysqlcheck.html#option_mysqlcheck_character-sets-dir)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=dir_name</code></td>
</tr><tr><th>Type</th>
<td>Directory name</td>
</tr></tbody></table>

  The directory where character sets are installed. See
  [Section 12.15, “Character Set Configuration”](charset-configuration.html "12.15 Character Set Configuration").

* [`--check`](mysqlcheck.html#option_mysqlcheck_check),
  `-c`

  <table frame="box" rules="all" summary="Properties for check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--check</code></td>
</tr></tbody></table>

  Check the tables for errors. This is the default operation.

* [`--check-only-changed`](mysqlcheck.html#option_mysqlcheck_check-only-changed),
  `-C`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th>
<th scope="col">Description</th>
<th scope="col">Introduced</th>
<th scope="col">Deprecated</th>
</tr></thead><tbody><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-databases">--all-databases</a></th>
<td>Check all tables in all databases</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-in-1">--all-in-1</a></th>
<td>Execute a single statement for each database that names all the tables from that database</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_analyze">--analyze</a></th>
<td>Analyze the tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_auto-repair">--auto-repair</a></th>
<td>If a checked table is corrupted, automatically fix it</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_bind-address">--bind-address</a></th>
<td>Use specified network interface to connect to MySQL Server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_character-sets-dir">--character-sets-dir</a></th>
<td>Directory where character sets are installed</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_check">--check</a></th>
<td>Check the tables for errors</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-only-changed">--check-only-changed</a></th>
<td>Check only tables that have changed since the last check</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-upgrade">--check-upgrade</a></th>
<td>Invoke CHECK TABLE with the FOR UPGRADE option</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_compress">--compress</a></th>
<td>Compress all information sent between client and server</td>
<td></td>
<td>8.0.18</td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_compression-algorithms">--compression-algorithms</a></th>
<td>Permitted compression algorithms for connections to server</td>
<td>8.0.18</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_databases">--databases</a></th>
<td>Interpret all arguments as database names</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug">--debug</a></th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-check">--debug-check</a></th>
<td>Print debugging information when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-info">--debug-info</a></th>
<td>Print debugging information, memory, and CPU statistics when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_default-auth">--default-auth</a></th>
<td>Authentication plugin to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_default-character-set">--default-character-set</a></th>
<td>Specify default character set</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-extra-file">--defaults-extra-file</a></th>
<td>Read named option file in addition to usual option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-file">--defaults-file</a></th>
<td>Read only named option file</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-group-suffix">--defaults-group-suffix</a></th>
<td>Option group suffix value</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_enable-cleartext-plugin">--enable-cleartext-plugin</a></th>
<td>Enable cleartext authentication plugin</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_extended">--extended</a></th>
<td>Check and repair tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_fast">--fast</a></th>
<td>Check only tables that have not been closed properly</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_force">--force</a></th>
<td>Continue even if an SQL error occurs</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_get-server-public-key">--get-server-public-key</a></th>
<td>Request RSA public key from server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_help">--help</a></th>
<td>Display help message and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_host">--host</a></th>
<td>Host on which MySQL server is located</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_login-path">--login-path</a></th>
<td>Read login path options from .mylogin.cnf</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_medium-check">--medium-check</a></th>
<td>Do a check that is faster than an --extended operation</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_no-defaults">--no-defaults</a></th>
<td>Read no option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_optimize">--optimize</a></th>
<td>Optimize the tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password">--password</a></th>
<td>Password to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password1">--password1</a></th>
<td>First multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password2">--password2</a></th>
<td>Second multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password3">--password3</a></th>
<td>Third multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_pipe">--pipe</a></th>
<td>Connect to server using named pipe (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_plugin-dir">--plugin-dir</a></th>
<td>Directory where plugins are installed</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_port">--port</a></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_print-defaults">--print-defaults</a></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_protocol">--protocol</a></th>
<td>Transport protocol to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_quick">--quick</a></th>
<td>The fastest method of checking</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_repair">--repair</a></th>
<td>Perform a repair that can fix almost anything except unique keys that are not unique</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_server-public-key-path">--server-public-key-path</a></th>
<td>Path name to file containing RSA public key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_shared-memory-base-name">--shared-memory-base-name</a></th>
<td>Shared-memory name for shared-memory connections (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_silent">--silent</a></th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_skip-database">--skip-database</a></th>
<td>Omit this database from performed operations</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_socket">--socket</a></th>
<td>Unix socket file or Windows named pipe to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-ca</a></th>
<td>File that contains list of trusted SSL Certificate Authorities</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-capath</a></th>
<td>Directory that contains trusted SSL Certificate Authority certificate files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-cert</a></th>
<td>File that contains X.509 certificate</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-cipher</a></th>
<td>Permissible ciphers for connection encryption</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-crl</a></th>
<td>File that contains certificate revocation lists</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-crlpath</a></th>
<td>Directory that contains certificate revocation-list files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl-fips-mode">--ssl-fips-mode</a></th>
<td>Whether to enable FIPS mode on client side</td>
<td></td>
<td>8.0.34</td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-key</a></th>
<td>File that contains X.509 key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-mode</a></th>
<td>Desired security state of connection to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-session-data</a></th>
<td>File that contains SSL session data</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-session-data-continue-on-failed-reuse</a></th>
<td>Whether to establish connections if session reuse fails</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_tables">--tables</a></th>
<td>Overrides the --databases or -B option</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_tls-ciphersuites">--tls-ciphersuites</a></th>
<td>Permissible TLSv1.3 ciphersuites for encrypted connections</td>
<td>8.0.16</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_tls-version">--tls-version</a></th>
<td>Permissible TLS protocols for encrypted connections</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_use-frm">--use-frm</a></th>
<td>For repair operations on MyISAM tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_user">--user</a></th>
<td>MySQL user name to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_verbose">--verbose</a></th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_version">--version</a></th>
<td>Display version information and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_write-binlog">--write-binlog</a></th>
<td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_zstd-compression-level">--zstd-compression-level</a></th>
<td>Compression level for connections to server that use zstd compression</td>
<td>8.0.18</td>
<td></td>
</tr></tbody></table>0

  Check only tables that have changed since the last check or
  that have not been closed properly.

* [`--check-upgrade`](mysqlcheck.html#option_mysqlcheck_check-upgrade),
  `-g`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th>
<th scope="col">Description</th>
<th scope="col">Introduced</th>
<th scope="col">Deprecated</th>
</tr></thead><tbody><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-databases">--all-databases</a></th>
<td>Check all tables in all databases</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-in-1">--all-in-1</a></th>
<td>Execute a single statement for each database that names all the tables from that database</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_analyze">--analyze</a></th>
<td>Analyze the tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_auto-repair">--auto-repair</a></th>
<td>If a checked table is corrupted, automatically fix it</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_bind-address">--bind-address</a></th>
<td>Use specified network interface to connect to MySQL Server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_character-sets-dir">--character-sets-dir</a></th>
<td>Directory where character sets are installed</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_check">--check</a></th>
<td>Check the tables for errors</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-only-changed">--check-only-changed</a></th>
<td>Check only tables that have changed since the last check</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-upgrade">--check-upgrade</a></th>
<td>Invoke CHECK TABLE with the FOR UPGRADE option</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_compress">--compress</a></th>
<td>Compress all information sent between client and server</td>
<td></td>
<td>8.0.18</td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_compression-algorithms">--compression-algorithms</a></th>
<td>Permitted compression algorithms for connections to server</td>
<td>8.0.18</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_databases">--databases</a></th>
<td>Interpret all arguments as database names</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug">--debug</a></th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-check">--debug-check</a></th>
<td>Print debugging information when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-info">--debug-info</a></th>
<td>Print debugging information, memory, and CPU statistics when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_default-auth">--default-auth</a></th>
<td>Authentication plugin to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_default-character-set">--default-character-set</a></th>
<td>Specify default character set</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-extra-file">--defaults-extra-file</a></th>
<td>Read named option file in addition to usual option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-file">--defaults-file</a></th>
<td>Read only named option file</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-group-suffix">--defaults-group-suffix</a></th>
<td>Option group suffix value</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_enable-cleartext-plugin">--enable-cleartext-plugin</a></th>
<td>Enable cleartext authentication plugin</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_extended">--extended</a></th>
<td>Check and repair tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_fast">--fast</a></th>
<td>Check only tables that have not been closed properly</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_force">--force</a></th>
<td>Continue even if an SQL error occurs</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_get-server-public-key">--get-server-public-key</a></th>
<td>Request RSA public key from server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_help">--help</a></th>
<td>Display help message and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_host">--host</a></th>
<td>Host on which MySQL server is located</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_login-path">--login-path</a></th>
<td>Read login path options from .mylogin.cnf</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_medium-check">--medium-check</a></th>
<td>Do a check that is faster than an --extended operation</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_no-defaults">--no-defaults</a></th>
<td>Read no option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_optimize">--optimize</a></th>
<td>Optimize the tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password">--password</a></th>
<td>Password to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password1">--password1</a></th>
<td>First multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password2">--password2</a></th>
<td>Second multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password3">--password3</a></th>
<td>Third multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_pipe">--pipe</a></th>
<td>Connect to server using named pipe (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_plugin-dir">--plugin-dir</a></th>
<td>Directory where plugins are installed</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_port">--port</a></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_print-defaults">--print-defaults</a></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_protocol">--protocol</a></th>
<td>Transport protocol to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_quick">--quick</a></th>
<td>The fastest method of checking</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_repair">--repair</a></th>
<td>Perform a repair that can fix almost anything except unique keys that are not unique</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_server-public-key-path">--server-public-key-path</a></th>
<td>Path name to file containing RSA public key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_shared-memory-base-name">--shared-memory-base-name</a></th>
<td>Shared-memory name for shared-memory connections (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_silent">--silent</a></th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_skip-database">--skip-database</a></th>
<td>Omit this database from performed operations</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_socket">--socket</a></th>
<td>Unix socket file or Windows named pipe to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-ca</a></th>
<td>File that contains list of trusted SSL Certificate Authorities</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-capath</a></th>
<td>Directory that contains trusted SSL Certificate Authority certificate files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-cert</a></th>
<td>File that contains X.509 certificate</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-cipher</a></th>
<td>Permissible ciphers for connection encryption</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-crl</a></th>
<td>File that contains certificate revocation lists</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-crlpath</a></th>
<td>Directory that contains certificate revocation-list files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl-fips-mode">--ssl-fips-mode</a></th>
<td>Whether to enable FIPS mode on client side</td>
<td></td>
<td>8.0.34</td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-key</a></th>
<td>File that contains X.509 key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-mode</a></th>
<td>Desired security state of connection to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-session-data</a></th>
<td>File that contains SSL session data</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-session-data-continue-on-failed-reuse</a></th>
<td>Whether to establish connections if session reuse fails</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_tables">--tables</a></th>
<td>Overrides the --databases or -B option</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_tls-ciphersuites">--tls-ciphersuites</a></th>
<td>Permissible TLSv1.3 ciphersuites for encrypted connections</td>
<td>8.0.16</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_tls-version">--tls-version</a></th>
<td>Permissible TLS protocols for encrypted connections</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_use-frm">--use-frm</a></th>
<td>For repair operations on MyISAM tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_user">--user</a></th>
<td>MySQL user name to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_verbose">--verbose</a></th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_version">--version</a></th>
<td>Display version information and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_write-binlog">--write-binlog</a></th>
<td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_zstd-compression-level">--zstd-compression-level</a></th>
<td>Compression level for connections to server that use zstd compression</td>
<td>8.0.18</td>
<td></td>
</tr></tbody></table>1

  Invoke [`CHECK TABLE`](check-table.html "15.7.3.2 CHECK TABLE Statement") with the
  `FOR UPGRADE` option to check tables for
  incompatibilities with the current version of the server.

* [`--compress`](mysqlcheck.html#option_mysqlcheck_compress)

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th>
<th scope="col">Description</th>
<th scope="col">Introduced</th>
<th scope="col">Deprecated</th>
</tr></thead><tbody><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-databases">--all-databases</a></th>
<td>Check all tables in all databases</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-in-1">--all-in-1</a></th>
<td>Execute a single statement for each database that names all the tables from that database</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_analyze">--analyze</a></th>
<td>Analyze the tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_auto-repair">--auto-repair</a></th>
<td>If a checked table is corrupted, automatically fix it</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_bind-address">--bind-address</a></th>
<td>Use specified network interface to connect to MySQL Server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_character-sets-dir">--character-sets-dir</a></th>
<td>Directory where character sets are installed</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_check">--check</a></th>
<td>Check the tables for errors</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-only-changed">--check-only-changed</a></th>
<td>Check only tables that have changed since the last check</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-upgrade">--check-upgrade</a></th>
<td>Invoke CHECK TABLE with the FOR UPGRADE option</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_compress">--compress</a></th>
<td>Compress all information sent between client and server</td>
<td></td>
<td>8.0.18</td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_compression-algorithms">--compression-algorithms</a></th>
<td>Permitted compression algorithms for connections to server</td>
<td>8.0.18</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_databases">--databases</a></th>
<td>Interpret all arguments as database names</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug">--debug</a></th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-check">--debug-check</a></th>
<td>Print debugging information when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-info">--debug-info</a></th>
<td>Print debugging information, memory, and CPU statistics when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_default-auth">--default-auth</a></th>
<td>Authentication plugin to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_default-character-set">--default-character-set</a></th>
<td>Specify default character set</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-extra-file">--defaults-extra-file</a></th>
<td>Read named option file in addition to usual option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-file">--defaults-file</a></th>
<td>Read only named option file</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-group-suffix">--defaults-group-suffix</a></th>
<td>Option group suffix value</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_enable-cleartext-plugin">--enable-cleartext-plugin</a></th>
<td>Enable cleartext authentication plugin</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_extended">--extended</a></th>
<td>Check and repair tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_fast">--fast</a></th>
<td>Check only tables that have not been closed properly</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_force">--force</a></th>
<td>Continue even if an SQL error occurs</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_get-server-public-key">--get-server-public-key</a></th>
<td>Request RSA public key from server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_help">--help</a></th>
<td>Display help message and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_host">--host</a></th>
<td>Host on which MySQL server is located</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_login-path">--login-path</a></th>
<td>Read login path options from .mylogin.cnf</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_medium-check">--medium-check</a></th>
<td>Do a check that is faster than an --extended operation</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_no-defaults">--no-defaults</a></th>
<td>Read no option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_optimize">--optimize</a></th>
<td>Optimize the tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password">--password</a></th>
<td>Password to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password1">--password1</a></th>
<td>First multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password2">--password2</a></th>
<td>Second multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password3">--password3</a></th>
<td>Third multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_pipe">--pipe</a></th>
<td>Connect to server using named pipe (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_plugin-dir">--plugin-dir</a></th>
<td>Directory where plugins are installed</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_port">--port</a></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_print-defaults">--print-defaults</a></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_protocol">--protocol</a></th>
<td>Transport protocol to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_quick">--quick</a></th>
<td>The fastest method of checking</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_repair">--repair</a></th>
<td>Perform a repair that can fix almost anything except unique keys that are not unique</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_server-public-key-path">--server-public-key-path</a></th>
<td>Path name to file containing RSA public key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_shared-memory-base-name">--shared-memory-base-name</a></th>
<td>Shared-memory name for shared-memory connections (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_silent">--silent</a></th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_skip-database">--skip-database</a></th>
<td>Omit this database from performed operations</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_socket">--socket</a></th>
<td>Unix socket file or Windows named pipe to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-ca</a></th>
<td>File that contains list of trusted SSL Certificate Authorities</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-capath</a></th>
<td>Directory that contains trusted SSL Certificate Authority certificate files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-cert</a></th>
<td>File that contains X.509 certificate</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-cipher</a></th>
<td>Permissible ciphers for connection encryption</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-crl</a></th>
<td>File that contains certificate revocation lists</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-crlpath</a></th>
<td>Directory that contains certificate revocation-list files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl-fips-mode">--ssl-fips-mode</a></th>
<td>Whether to enable FIPS mode on client side</td>
<td></td>
<td>8.0.34</td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-key</a></th>
<td>File that contains X.509 key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-mode</a></th>
<td>Desired security state of connection to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-session-data</a></th>
<td>File that contains SSL session data</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-session-data-continue-on-failed-reuse</a></th>
<td>Whether to establish connections if session reuse fails</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_tables">--tables</a></th>
<td>Overrides the --databases or -B option</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_tls-ciphersuites">--tls-ciphersuites</a></th>
<td>Permissible TLSv1.3 ciphersuites for encrypted connections</td>
<td>8.0.16</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_tls-version">--tls-version</a></th>
<td>Permissible TLS protocols for encrypted connections</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_use-frm">--use-frm</a></th>
<td>For repair operations on MyISAM tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_user">--user</a></th>
<td>MySQL user name to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_verbose">--verbose</a></th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_version">--version</a></th>
<td>Display version information and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_write-binlog">--write-binlog</a></th>
<td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_zstd-compression-level">--zstd-compression-level</a></th>
<td>Compression level for connections to server that use zstd compression</td>
<td>8.0.18</td>
<td></td>
</tr></tbody></table>2

  Compress all information sent between the client and the
  server if possible. See
  [Section 6.2.8, “Connection Compression Control”](connection-compression-control.html "6.2.8 Connection Compression Control").

  As of MySQL 8.0.18, this option is deprecated. Expect it to
  be removed in a future version of MySQL. See
  [Configuring Legacy Connection Compression](connection-compression-control.html#connection-compression-legacy-configuration "Configuring Legacy Connection Compression").

* [`--compression-algorithms=value`](mysqlcheck.html#option_mysqlcheck_compression-algorithms)

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th>
<th scope="col">Description</th>
<th scope="col">Introduced</th>
<th scope="col">Deprecated</th>
</tr></thead><tbody><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-databases">--all-databases</a></th>
<td>Check all tables in all databases</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-in-1">--all-in-1</a></th>
<td>Execute a single statement for each database that names all the tables from that database</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_analyze">--analyze</a></th>
<td>Analyze the tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_auto-repair">--auto-repair</a></th>
<td>If a checked table is corrupted, automatically fix it</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_bind-address">--bind-address</a></th>
<td>Use specified network interface to connect to MySQL Server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_character-sets-dir">--character-sets-dir</a></th>
<td>Directory where character sets are installed</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_check">--check</a></th>
<td>Check the tables for errors</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-only-changed">--check-only-changed</a></th>
<td>Check only tables that have changed since the last check</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-upgrade">--check-upgrade</a></th>
<td>Invoke CHECK TABLE with the FOR UPGRADE option</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_compress">--compress</a></th>
<td>Compress all information sent between client and server</td>
<td></td>
<td>8.0.18</td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_compression-algorithms">--compression-algorithms</a></th>
<td>Permitted compression algorithms for connections to server</td>
<td>8.0.18</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_databases">--databases</a></th>
<td>Interpret all arguments as database names</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug">--debug</a></th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-check">--debug-check</a></th>
<td>Print debugging information when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-info">--debug-info</a></th>
<td>Print debugging information, memory, and CPU statistics when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_default-auth">--default-auth</a></th>
<td>Authentication plugin to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_default-character-set">--default-character-set</a></th>
<td>Specify default character set</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-extra-file">--defaults-extra-file</a></th>
<td>Read named option file in addition to usual option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-file">--defaults-file</a></th>
<td>Read only named option file</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-group-suffix">--defaults-group-suffix</a></th>
<td>Option group suffix value</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_enable-cleartext-plugin">--enable-cleartext-plugin</a></th>
<td>Enable cleartext authentication plugin</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_extended">--extended</a></th>
<td>Check and repair tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_fast">--fast</a></th>
<td>Check only tables that have not been closed properly</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_force">--force</a></th>
<td>Continue even if an SQL error occurs</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_get-server-public-key">--get-server-public-key</a></th>
<td>Request RSA public key from server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_help">--help</a></th>
<td>Display help message and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_host">--host</a></th>
<td>Host on which MySQL server is located</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_login-path">--login-path</a></th>
<td>Read login path options from .mylogin.cnf</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_medium-check">--medium-check</a></th>
<td>Do a check that is faster than an --extended operation</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_no-defaults">--no-defaults</a></th>
<td>Read no option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_optimize">--optimize</a></th>
<td>Optimize the tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password">--password</a></th>
<td>Password to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password1">--password1</a></th>
<td>First multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password2">--password2</a></th>
<td>Second multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password3">--password3</a></th>
<td>Third multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_pipe">--pipe</a></th>
<td>Connect to server using named pipe (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_plugin-dir">--plugin-dir</a></th>
<td>Directory where plugins are installed</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_port">--port</a></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_print-defaults">--print-defaults</a></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_protocol">--protocol</a></th>
<td>Transport protocol to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_quick">--quick</a></th>
<td>The fastest method of checking</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_repair">--repair</a></th>
<td>Perform a repair that can fix almost anything except unique keys that are not unique</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_server-public-key-path">--server-public-key-path</a></th>
<td>Path name to file containing RSA public key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_shared-memory-base-name">--shared-memory-base-name</a></th>
<td>Shared-memory name for shared-memory connections (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_silent">--silent</a></th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_skip-database">--skip-database</a></th>
<td>Omit this database from performed operations</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_socket">--socket</a></th>
<td>Unix socket file or Windows named pipe to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-ca</a></th>
<td>File that contains list of trusted SSL Certificate Authorities</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-capath</a></th>
<td>Directory that contains trusted SSL Certificate Authority certificate files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-cert</a></th>
<td>File that contains X.509 certificate</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-cipher</a></th>
<td>Permissible ciphers for connection encryption</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-crl</a></th>
<td>File that contains certificate revocation lists</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-crlpath</a></th>
<td>Directory that contains certificate revocation-list files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl-fips-mode">--ssl-fips-mode</a></th>
<td>Whether to enable FIPS mode on client side</td>
<td></td>
<td>8.0.34</td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-key</a></th>
<td>File that contains X.509 key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-mode</a></th>
<td>Desired security state of connection to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-session-data</a></th>
<td>File that contains SSL session data</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-session-data-continue-on-failed-reuse</a></th>
<td>Whether to establish connections if session reuse fails</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_tables">--tables</a></th>
<td>Overrides the --databases or -B option</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_tls-ciphersuites">--tls-ciphersuites</a></th>
<td>Permissible TLSv1.3 ciphersuites for encrypted connections</td>
<td>8.0.16</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_tls-version">--tls-version</a></th>
<td>Permissible TLS protocols for encrypted connections</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_use-frm">--use-frm</a></th>
<td>For repair operations on MyISAM tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_user">--user</a></th>
<td>MySQL user name to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_verbose">--verbose</a></th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_version">--version</a></th>
<td>Display version information and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_write-binlog">--write-binlog</a></th>
<td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_zstd-compression-level">--zstd-compression-level</a></th>
<td>Compression level for connections to server that use zstd compression</td>
<td>8.0.18</td>
<td></td>
</tr></tbody></table>3

  The permitted compression algorithms for connections to the
  server. The available algorithms are the same as for the
  [`protocol_compression_algorithms`](server-system-variables.html#sysvar_protocol_compression_algorithms)
  system variable. The default value is
  `uncompressed`.

  For more information, see
  [Section 6.2.8, “Connection Compression Control”](connection-compression-control.html "6.2.8 Connection Compression Control").

  This option was added in MySQL 8.0.18.

* [`--databases`](mysqlcheck.html#option_mysqlcheck_databases),
  `-B`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th>
<th scope="col">Description</th>
<th scope="col">Introduced</th>
<th scope="col">Deprecated</th>
</tr></thead><tbody><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-databases">--all-databases</a></th>
<td>Check all tables in all databases</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-in-1">--all-in-1</a></th>
<td>Execute a single statement for each database that names all the tables from that database</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_analyze">--analyze</a></th>
<td>Analyze the tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_auto-repair">--auto-repair</a></th>
<td>If a checked table is corrupted, automatically fix it</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_bind-address">--bind-address</a></th>
<td>Use specified network interface to connect to MySQL Server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_character-sets-dir">--character-sets-dir</a></th>
<td>Directory where character sets are installed</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_check">--check</a></th>
<td>Check the tables for errors</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-only-changed">--check-only-changed</a></th>
<td>Check only tables that have changed since the last check</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-upgrade">--check-upgrade</a></th>
<td>Invoke CHECK TABLE with the FOR UPGRADE option</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_compress">--compress</a></th>
<td>Compress all information sent between client and server</td>
<td></td>
<td>8.0.18</td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_compression-algorithms">--compression-algorithms</a></th>
<td>Permitted compression algorithms for connections to server</td>
<td>8.0.18</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_databases">--databases</a></th>
<td>Interpret all arguments as database names</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug">--debug</a></th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-check">--debug-check</a></th>
<td>Print debugging information when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-info">--debug-info</a></th>
<td>Print debugging information, memory, and CPU statistics when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_default-auth">--default-auth</a></th>
<td>Authentication plugin to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_default-character-set">--default-character-set</a></th>
<td>Specify default character set</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-extra-file">--defaults-extra-file</a></th>
<td>Read named option file in addition to usual option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-file">--defaults-file</a></th>
<td>Read only named option file</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-group-suffix">--defaults-group-suffix</a></th>
<td>Option group suffix value</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_enable-cleartext-plugin">--enable-cleartext-plugin</a></th>
<td>Enable cleartext authentication plugin</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_extended">--extended</a></th>
<td>Check and repair tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_fast">--fast</a></th>
<td>Check only tables that have not been closed properly</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_force">--force</a></th>
<td>Continue even if an SQL error occurs</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_get-server-public-key">--get-server-public-key</a></th>
<td>Request RSA public key from server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_help">--help</a></th>
<td>Display help message and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_host">--host</a></th>
<td>Host on which MySQL server is located</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_login-path">--login-path</a></th>
<td>Read login path options from .mylogin.cnf</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_medium-check">--medium-check</a></th>
<td>Do a check that is faster than an --extended operation</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_no-defaults">--no-defaults</a></th>
<td>Read no option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_optimize">--optimize</a></th>
<td>Optimize the tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password">--password</a></th>
<td>Password to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password1">--password1</a></th>
<td>First multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password2">--password2</a></th>
<td>Second multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password3">--password3</a></th>
<td>Third multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_pipe">--pipe</a></th>
<td>Connect to server using named pipe (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_plugin-dir">--plugin-dir</a></th>
<td>Directory where plugins are installed</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_port">--port</a></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_print-defaults">--print-defaults</a></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_protocol">--protocol</a></th>
<td>Transport protocol to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_quick">--quick</a></th>
<td>The fastest method of checking</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_repair">--repair</a></th>
<td>Perform a repair that can fix almost anything except unique keys that are not unique</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_server-public-key-path">--server-public-key-path</a></th>
<td>Path name to file containing RSA public key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_shared-memory-base-name">--shared-memory-base-name</a></th>
<td>Shared-memory name for shared-memory connections (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_silent">--silent</a></th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_skip-database">--skip-database</a></th>
<td>Omit this database from performed operations</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_socket">--socket</a></th>
<td>Unix socket file or Windows named pipe to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-ca</a></th>
<td>File that contains list of trusted SSL Certificate Authorities</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-capath</a></th>
<td>Directory that contains trusted SSL Certificate Authority certificate files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-cert</a></th>
<td>File that contains X.509 certificate</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-cipher</a></th>
<td>Permissible ciphers for connection encryption</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-crl</a></th>
<td>File that contains certificate revocation lists</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-crlpath</a></th>
<td>Directory that contains certificate revocation-list files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl-fips-mode">--ssl-fips-mode</a></th>
<td>Whether to enable FIPS mode on client side</td>
<td></td>
<td>8.0.34</td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-key</a></th>
<td>File that contains X.509 key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-mode</a></th>
<td>Desired security state of connection to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-session-data</a></th>
<td>File that contains SSL session data</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-session-data-continue-on-failed-reuse</a></th>
<td>Whether to establish connections if session reuse fails</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_tables">--tables</a></th>
<td>Overrides the --databases or -B option</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_tls-ciphersuites">--tls-ciphersuites</a></th>
<td>Permissible TLSv1.3 ciphersuites for encrypted connections</td>
<td>8.0.16</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_tls-version">--tls-version</a></th>
<td>Permissible TLS protocols for encrypted connections</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_use-frm">--use-frm</a></th>
<td>For repair operations on MyISAM tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_user">--user</a></th>
<td>MySQL user name to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_verbose">--verbose</a></th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_version">--version</a></th>
<td>Display version information and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_write-binlog">--write-binlog</a></th>
<td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_zstd-compression-level">--zstd-compression-level</a></th>
<td>Compression level for connections to server that use zstd compression</td>
<td>8.0.18</td>
<td></td>
</tr></tbody></table>4

  Process all tables in the named databases. Normally,
  [**mysqlcheck**](mysqlcheck.html "6.5.3 mysqlcheck — A Table Maintenance Program") treats the first name argument
  on the command line as a database name and any following
  names as table names. With this option, it treats all name
  arguments as database names.

* [`--debug[=debug_options]`](mysqlcheck.html#option_mysqlcheck_debug),
  `-#
  [debug_options]`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th>
<th scope="col">Description</th>
<th scope="col">Introduced</th>
<th scope="col">Deprecated</th>
</tr></thead><tbody><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-databases">--all-databases</a></th>
<td>Check all tables in all databases</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-in-1">--all-in-1</a></th>
<td>Execute a single statement for each database that names all the tables from that database</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_analyze">--analyze</a></th>
<td>Analyze the tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_auto-repair">--auto-repair</a></th>
<td>If a checked table is corrupted, automatically fix it</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_bind-address">--bind-address</a></th>
<td>Use specified network interface to connect to MySQL Server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_character-sets-dir">--character-sets-dir</a></th>
<td>Directory where character sets are installed</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_check">--check</a></th>
<td>Check the tables for errors</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-only-changed">--check-only-changed</a></th>
<td>Check only tables that have changed since the last check</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-upgrade">--check-upgrade</a></th>
<td>Invoke CHECK TABLE with the FOR UPGRADE option</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_compress">--compress</a></th>
<td>Compress all information sent between client and server</td>
<td></td>
<td>8.0.18</td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_compression-algorithms">--compression-algorithms</a></th>
<td>Permitted compression algorithms for connections to server</td>
<td>8.0.18</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_databases">--databases</a></th>
<td>Interpret all arguments as database names</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug">--debug</a></th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-check">--debug-check</a></th>
<td>Print debugging information when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-info">--debug-info</a></th>
<td>Print debugging information, memory, and CPU statistics when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_default-auth">--default-auth</a></th>
<td>Authentication plugin to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_default-character-set">--default-character-set</a></th>
<td>Specify default character set</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-extra-file">--defaults-extra-file</a></th>
<td>Read named option file in addition to usual option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-file">--defaults-file</a></th>
<td>Read only named option file</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-group-suffix">--defaults-group-suffix</a></th>
<td>Option group suffix value</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_enable-cleartext-plugin">--enable-cleartext-plugin</a></th>
<td>Enable cleartext authentication plugin</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_extended">--extended</a></th>
<td>Check and repair tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_fast">--fast</a></th>
<td>Check only tables that have not been closed properly</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_force">--force</a></th>
<td>Continue even if an SQL error occurs</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_get-server-public-key">--get-server-public-key</a></th>
<td>Request RSA public key from server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_help">--help</a></th>
<td>Display help message and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_host">--host</a></th>
<td>Host on which MySQL server is located</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_login-path">--login-path</a></th>
<td>Read login path options from .mylogin.cnf</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_medium-check">--medium-check</a></th>
<td>Do a check that is faster than an --extended operation</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_no-defaults">--no-defaults</a></th>
<td>Read no option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_optimize">--optimize</a></th>
<td>Optimize the tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password">--password</a></th>
<td>Password to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password1">--password1</a></th>
<td>First multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password2">--password2</a></th>
<td>Second multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password3">--password3</a></th>
<td>Third multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_pipe">--pipe</a></th>
<td>Connect to server using named pipe (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_plugin-dir">--plugin-dir</a></th>
<td>Directory where plugins are installed</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_port">--port</a></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_print-defaults">--print-defaults</a></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_protocol">--protocol</a></th>
<td>Transport protocol to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_quick">--quick</a></th>
<td>The fastest method of checking</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_repair">--repair</a></th>
<td>Perform a repair that can fix almost anything except unique keys that are not unique</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_server-public-key-path">--server-public-key-path</a></th>
<td>Path name to file containing RSA public key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_shared-memory-base-name">--shared-memory-base-name</a></th>
<td>Shared-memory name for shared-memory connections (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_silent">--silent</a></th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_skip-database">--skip-database</a></th>
<td>Omit this database from performed operations</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_socket">--socket</a></th>
<td>Unix socket file or Windows named pipe to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-ca</a></th>
<td>File that contains list of trusted SSL Certificate Authorities</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-capath</a></th>
<td>Directory that contains trusted SSL Certificate Authority certificate files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-cert</a></th>
<td>File that contains X.509 certificate</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-cipher</a></th>
<td>Permissible ciphers for connection encryption</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-crl</a></th>
<td>File that contains certificate revocation lists</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-crlpath</a></th>
<td>Directory that contains certificate revocation-list files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl-fips-mode">--ssl-fips-mode</a></th>
<td>Whether to enable FIPS mode on client side</td>
<td></td>
<td>8.0.34</td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-key</a></th>
<td>File that contains X.509 key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-mode</a></th>
<td>Desired security state of connection to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-session-data</a></th>
<td>File that contains SSL session data</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-session-data-continue-on-failed-reuse</a></th>
<td>Whether to establish connections if session reuse fails</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_tables">--tables</a></th>
<td>Overrides the --databases or -B option</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_tls-ciphersuites">--tls-ciphersuites</a></th>
<td>Permissible TLSv1.3 ciphersuites for encrypted connections</td>
<td>8.0.16</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_tls-version">--tls-version</a></th>
<td>Permissible TLS protocols for encrypted connections</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_use-frm">--use-frm</a></th>
<td>For repair operations on MyISAM tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_user">--user</a></th>
<td>MySQL user name to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_verbose">--verbose</a></th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_version">--version</a></th>
<td>Display version information and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_write-binlog">--write-binlog</a></th>
<td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_zstd-compression-level">--zstd-compression-level</a></th>
<td>Compression level for connections to server that use zstd compression</td>
<td>8.0.18</td>
<td></td>
</tr></tbody></table>5

  Write a debugging log. A typical
  *`debug_options`* string is
  `d:t:o,file_name`.
  The default is `d:t:o`.

  This option is available only if MySQL was built using
  [`WITH_DEBUG`](source-configuration-options.html#option_cmake_with_debug). MySQL release
  binaries provided by Oracle are *not*
  built using this option.

* [`--debug-check`](mysqlcheck.html#option_mysqlcheck_debug-check)

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th>
<th scope="col">Description</th>
<th scope="col">Introduced</th>
<th scope="col">Deprecated</th>
</tr></thead><tbody><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-databases">--all-databases</a></th>
<td>Check all tables in all databases</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-in-1">--all-in-1</a></th>
<td>Execute a single statement for each database that names all the tables from that database</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_analyze">--analyze</a></th>
<td>Analyze the tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_auto-repair">--auto-repair</a></th>
<td>If a checked table is corrupted, automatically fix it</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_bind-address">--bind-address</a></th>
<td>Use specified network interface to connect to MySQL Server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_character-sets-dir">--character-sets-dir</a></th>
<td>Directory where character sets are installed</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_check">--check</a></th>
<td>Check the tables for errors</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-only-changed">--check-only-changed</a></th>
<td>Check only tables that have changed since the last check</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-upgrade">--check-upgrade</a></th>
<td>Invoke CHECK TABLE with the FOR UPGRADE option</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_compress">--compress</a></th>
<td>Compress all information sent between client and server</td>
<td></td>
<td>8.0.18</td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_compression-algorithms">--compression-algorithms</a></th>
<td>Permitted compression algorithms for connections to server</td>
<td>8.0.18</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_databases">--databases</a></th>
<td>Interpret all arguments as database names</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug">--debug</a></th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-check">--debug-check</a></th>
<td>Print debugging information when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-info">--debug-info</a></th>
<td>Print debugging information, memory, and CPU statistics when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_default-auth">--default-auth</a></th>
<td>Authentication plugin to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_default-character-set">--default-character-set</a></th>
<td>Specify default character set</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-extra-file">--defaults-extra-file</a></th>
<td>Read named option file in addition to usual option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-file">--defaults-file</a></th>
<td>Read only named option file</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-group-suffix">--defaults-group-suffix</a></th>
<td>Option group suffix value</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_enable-cleartext-plugin">--enable-cleartext-plugin</a></th>
<td>Enable cleartext authentication plugin</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_extended">--extended</a></th>
<td>Check and repair tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_fast">--fast</a></th>
<td>Check only tables that have not been closed properly</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_force">--force</a></th>
<td>Continue even if an SQL error occurs</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_get-server-public-key">--get-server-public-key</a></th>
<td>Request RSA public key from server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_help">--help</a></th>
<td>Display help message and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_host">--host</a></th>
<td>Host on which MySQL server is located</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_login-path">--login-path</a></th>
<td>Read login path options from .mylogin.cnf</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_medium-check">--medium-check</a></th>
<td>Do a check that is faster than an --extended operation</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_no-defaults">--no-defaults</a></th>
<td>Read no option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_optimize">--optimize</a></th>
<td>Optimize the tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password">--password</a></th>
<td>Password to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password1">--password1</a></th>
<td>First multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password2">--password2</a></th>
<td>Second multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password3">--password3</a></th>
<td>Third multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_pipe">--pipe</a></th>
<td>Connect to server using named pipe (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_plugin-dir">--plugin-dir</a></th>
<td>Directory where plugins are installed</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_port">--port</a></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_print-defaults">--print-defaults</a></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_protocol">--protocol</a></th>
<td>Transport protocol to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_quick">--quick</a></th>
<td>The fastest method of checking</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_repair">--repair</a></th>
<td>Perform a repair that can fix almost anything except unique keys that are not unique</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_server-public-key-path">--server-public-key-path</a></th>
<td>Path name to file containing RSA public key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_shared-memory-base-name">--shared-memory-base-name</a></th>
<td>Shared-memory name for shared-memory connections (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_silent">--silent</a></th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_skip-database">--skip-database</a></th>
<td>Omit this database from performed operations</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_socket">--socket</a></th>
<td>Unix socket file or Windows named pipe to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-ca</a></th>
<td>File that contains list of trusted SSL Certificate Authorities</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-capath</a></th>
<td>Directory that contains trusted SSL Certificate Authority certificate files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-cert</a></th>
<td>File that contains X.509 certificate</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-cipher</a></th>
<td>Permissible ciphers for connection encryption</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-crl</a></th>
<td>File that contains certificate revocation lists</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-crlpath</a></th>
<td>Directory that contains certificate revocation-list files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl-fips-mode">--ssl-fips-mode</a></th>
<td>Whether to enable FIPS mode on client side</td>
<td></td>
<td>8.0.34</td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-key</a></th>
<td>File that contains X.509 key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-mode</a></th>
<td>Desired security state of connection to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-session-data</a></th>
<td>File that contains SSL session data</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-session-data-continue-on-failed-reuse</a></th>
<td>Whether to establish connections if session reuse fails</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_tables">--tables</a></th>
<td>Overrides the --databases or -B option</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_tls-ciphersuites">--tls-ciphersuites</a></th>
<td>Permissible TLSv1.3 ciphersuites for encrypted connections</td>
<td>8.0.16</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_tls-version">--tls-version</a></th>
<td>Permissible TLS protocols for encrypted connections</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_use-frm">--use-frm</a></th>
<td>For repair operations on MyISAM tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_user">--user</a></th>
<td>MySQL user name to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_verbose">--verbose</a></th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_version">--version</a></th>
<td>Display version information and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_write-binlog">--write-binlog</a></th>
<td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_zstd-compression-level">--zstd-compression-level</a></th>
<td>Compression level for connections to server that use zstd compression</td>
<td>8.0.18</td>
<td></td>
</tr></tbody></table>6

  Print some debugging information when the program exits.

  This option is available only if MySQL was built using
  [`WITH_DEBUG`](source-configuration-options.html#option_cmake_with_debug). MySQL release
  binaries provided by Oracle are *not*
  built using this option.

* [`--debug-info`](mysqlcheck.html#option_mysqlcheck_debug-info)

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th>
<th scope="col">Description</th>
<th scope="col">Introduced</th>
<th scope="col">Deprecated</th>
</tr></thead><tbody><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-databases">--all-databases</a></th>
<td>Check all tables in all databases</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-in-1">--all-in-1</a></th>
<td>Execute a single statement for each database that names all the tables from that database</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_analyze">--analyze</a></th>
<td>Analyze the tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_auto-repair">--auto-repair</a></th>
<td>If a checked table is corrupted, automatically fix it</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_bind-address">--bind-address</a></th>
<td>Use specified network interface to connect to MySQL Server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_character-sets-dir">--character-sets-dir</a></th>
<td>Directory where character sets are installed</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_check">--check</a></th>
<td>Check the tables for errors</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-only-changed">--check-only-changed</a></th>
<td>Check only tables that have changed since the last check</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-upgrade">--check-upgrade</a></th>
<td>Invoke CHECK TABLE with the FOR UPGRADE option</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_compress">--compress</a></th>
<td>Compress all information sent between client and server</td>
<td></td>
<td>8.0.18</td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_compression-algorithms">--compression-algorithms</a></th>
<td>Permitted compression algorithms for connections to server</td>
<td>8.0.18</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_databases">--databases</a></th>
<td>Interpret all arguments as database names</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug">--debug</a></th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-check">--debug-check</a></th>
<td>Print debugging information when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-info">--debug-info</a></th>
<td>Print debugging information, memory, and CPU statistics when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_default-auth">--default-auth</a></th>
<td>Authentication plugin to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_default-character-set">--default-character-set</a></th>
<td>Specify default character set</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-extra-file">--defaults-extra-file</a></th>
<td>Read named option file in addition to usual option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-file">--defaults-file</a></th>
<td>Read only named option file</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-group-suffix">--defaults-group-suffix</a></th>
<td>Option group suffix value</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_enable-cleartext-plugin">--enable-cleartext-plugin</a></th>
<td>Enable cleartext authentication plugin</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_extended">--extended</a></th>
<td>Check and repair tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_fast">--fast</a></th>
<td>Check only tables that have not been closed properly</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_force">--force</a></th>
<td>Continue even if an SQL error occurs</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_get-server-public-key">--get-server-public-key</a></th>
<td>Request RSA public key from server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_help">--help</a></th>
<td>Display help message and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_host">--host</a></th>
<td>Host on which MySQL server is located</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_login-path">--login-path</a></th>
<td>Read login path options from .mylogin.cnf</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_medium-check">--medium-check</a></th>
<td>Do a check that is faster than an --extended operation</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_no-defaults">--no-defaults</a></th>
<td>Read no option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_optimize">--optimize</a></th>
<td>Optimize the tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password">--password</a></th>
<td>Password to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password1">--password1</a></th>
<td>First multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password2">--password2</a></th>
<td>Second multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password3">--password3</a></th>
<td>Third multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_pipe">--pipe</a></th>
<td>Connect to server using named pipe (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_plugin-dir">--plugin-dir</a></th>
<td>Directory where plugins are installed</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_port">--port</a></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_print-defaults">--print-defaults</a></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_protocol">--protocol</a></th>
<td>Transport protocol to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_quick">--quick</a></th>
<td>The fastest method of checking</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_repair">--repair</a></th>
<td>Perform a repair that can fix almost anything except unique keys that are not unique</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_server-public-key-path">--server-public-key-path</a></th>
<td>Path name to file containing RSA public key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_shared-memory-base-name">--shared-memory-base-name</a></th>
<td>Shared-memory name for shared-memory connections (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_silent">--silent</a></th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_skip-database">--skip-database</a></th>
<td>Omit this database from performed operations</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_socket">--socket</a></th>
<td>Unix socket file or Windows named pipe to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-ca</a></th>
<td>File that contains list of trusted SSL Certificate Authorities</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-capath</a></th>
<td>Directory that contains trusted SSL Certificate Authority certificate files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-cert</a></th>
<td>File that contains X.509 certificate</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-cipher</a></th>
<td>Permissible ciphers for connection encryption</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-crl</a></th>
<td>File that contains certificate revocation lists</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-crlpath</a></th>
<td>Directory that contains certificate revocation-list files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl-fips-mode">--ssl-fips-mode</a></th>
<td>Whether to enable FIPS mode on client side</td>
<td></td>
<td>8.0.34</td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-key</a></th>
<td>File that contains X.509 key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-mode</a></th>
<td>Desired security state of connection to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-session-data</a></th>
<td>File that contains SSL session data</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-session-data-continue-on-failed-reuse</a></th>
<td>Whether to establish connections if session reuse fails</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_tables">--tables</a></th>
<td>Overrides the --databases or -B option</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_tls-ciphersuites">--tls-ciphersuites</a></th>
<td>Permissible TLSv1.3 ciphersuites for encrypted connections</td>
<td>8.0.16</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_tls-version">--tls-version</a></th>
<td>Permissible TLS protocols for encrypted connections</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_use-frm">--use-frm</a></th>
<td>For repair operations on MyISAM tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_user">--user</a></th>
<td>MySQL user name to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_verbose">--verbose</a></th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_version">--version</a></th>
<td>Display version information and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_write-binlog">--write-binlog</a></th>
<td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_zstd-compression-level">--zstd-compression-level</a></th>
<td>Compression level for connections to server that use zstd compression</td>
<td>8.0.18</td>
<td></td>
</tr></tbody></table>7

  Print debugging information and memory and CPU usage
  statistics when the program exits.

  This option is available only if MySQL was built using
  [`WITH_DEBUG`](source-configuration-options.html#option_cmake_with_debug). MySQL release
  binaries provided by Oracle are *not*
  built using this option.

* [`--default-character-set=charset_name`](mysqlcheck.html#option_mysqlcheck_default-character-set)

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th>
<th scope="col">Description</th>
<th scope="col">Introduced</th>
<th scope="col">Deprecated</th>
</tr></thead><tbody><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-databases">--all-databases</a></th>
<td>Check all tables in all databases</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-in-1">--all-in-1</a></th>
<td>Execute a single statement for each database that names all the tables from that database</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_analyze">--analyze</a></th>
<td>Analyze the tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_auto-repair">--auto-repair</a></th>
<td>If a checked table is corrupted, automatically fix it</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_bind-address">--bind-address</a></th>
<td>Use specified network interface to connect to MySQL Server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_character-sets-dir">--character-sets-dir</a></th>
<td>Directory where character sets are installed</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_check">--check</a></th>
<td>Check the tables for errors</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-only-changed">--check-only-changed</a></th>
<td>Check only tables that have changed since the last check</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-upgrade">--check-upgrade</a></th>
<td>Invoke CHECK TABLE with the FOR UPGRADE option</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_compress">--compress</a></th>
<td>Compress all information sent between client and server</td>
<td></td>
<td>8.0.18</td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_compression-algorithms">--compression-algorithms</a></th>
<td>Permitted compression algorithms for connections to server</td>
<td>8.0.18</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_databases">--databases</a></th>
<td>Interpret all arguments as database names</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug">--debug</a></th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-check">--debug-check</a></th>
<td>Print debugging information when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-info">--debug-info</a></th>
<td>Print debugging information, memory, and CPU statistics when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_default-auth">--default-auth</a></th>
<td>Authentication plugin to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_default-character-set">--default-character-set</a></th>
<td>Specify default character set</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-extra-file">--defaults-extra-file</a></th>
<td>Read named option file in addition to usual option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-file">--defaults-file</a></th>
<td>Read only named option file</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-group-suffix">--defaults-group-suffix</a></th>
<td>Option group suffix value</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_enable-cleartext-plugin">--enable-cleartext-plugin</a></th>
<td>Enable cleartext authentication plugin</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_extended">--extended</a></th>
<td>Check and repair tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_fast">--fast</a></th>
<td>Check only tables that have not been closed properly</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_force">--force</a></th>
<td>Continue even if an SQL error occurs</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_get-server-public-key">--get-server-public-key</a></th>
<td>Request RSA public key from server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_help">--help</a></th>
<td>Display help message and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_host">--host</a></th>
<td>Host on which MySQL server is located</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_login-path">--login-path</a></th>
<td>Read login path options from .mylogin.cnf</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_medium-check">--medium-check</a></th>
<td>Do a check that is faster than an --extended operation</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_no-defaults">--no-defaults</a></th>
<td>Read no option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_optimize">--optimize</a></th>
<td>Optimize the tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password">--password</a></th>
<td>Password to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password1">--password1</a></th>
<td>First multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password2">--password2</a></th>
<td>Second multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password3">--password3</a></th>
<td>Third multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_pipe">--pipe</a></th>
<td>Connect to server using named pipe (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_plugin-dir">--plugin-dir</a></th>
<td>Directory where plugins are installed</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_port">--port</a></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_print-defaults">--print-defaults</a></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_protocol">--protocol</a></th>
<td>Transport protocol to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_quick">--quick</a></th>
<td>The fastest method of checking</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_repair">--repair</a></th>
<td>Perform a repair that can fix almost anything except unique keys that are not unique</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_server-public-key-path">--server-public-key-path</a></th>
<td>Path name to file containing RSA public key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_shared-memory-base-name">--shared-memory-base-name</a></th>
<td>Shared-memory name for shared-memory connections (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_silent">--silent</a></th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_skip-database">--skip-database</a></th>
<td>Omit this database from performed operations</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_socket">--socket</a></th>
<td>Unix socket file or Windows named pipe to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-ca</a></th>
<td>File that contains list of trusted SSL Certificate Authorities</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-capath</a></th>
<td>Directory that contains trusted SSL Certificate Authority certificate files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-cert</a></th>
<td>File that contains X.509 certificate</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-cipher</a></th>
<td>Permissible ciphers for connection encryption</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-crl</a></th>
<td>File that contains certificate revocation lists</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-crlpath</a></th>
<td>Directory that contains certificate revocation-list files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl-fips-mode">--ssl-fips-mode</a></th>
<td>Whether to enable FIPS mode on client side</td>
<td></td>
<td>8.0.34</td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-key</a></th>
<td>File that contains X.509 key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-mode</a></th>
<td>Desired security state of connection to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-session-data</a></th>
<td>File that contains SSL session data</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-session-data-continue-on-failed-reuse</a></th>
<td>Whether to establish connections if session reuse fails</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_tables">--tables</a></th>
<td>Overrides the --databases or -B option</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_tls-ciphersuites">--tls-ciphersuites</a></th>
<td>Permissible TLSv1.3 ciphersuites for encrypted connections</td>
<td>8.0.16</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_tls-version">--tls-version</a></th>
<td>Permissible TLS protocols for encrypted connections</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_use-frm">--use-frm</a></th>
<td>For repair operations on MyISAM tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_user">--user</a></th>
<td>MySQL user name to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_verbose">--verbose</a></th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_version">--version</a></th>
<td>Display version information and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_write-binlog">--write-binlog</a></th>
<td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_zstd-compression-level">--zstd-compression-level</a></th>
<td>Compression level for connections to server that use zstd compression</td>
<td>8.0.18</td>
<td></td>
</tr></tbody></table>8

  Use *`charset_name`* as the default
  character set. See [Section 12.15, “Character Set Configuration”](charset-configuration.html "12.15 Character Set Configuration").

* [`--defaults-extra-file=file_name`](mysqlcheck.html#option_mysqlcheck_defaults-extra-file)

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th>
<th scope="col">Description</th>
<th scope="col">Introduced</th>
<th scope="col">Deprecated</th>
</tr></thead><tbody><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-databases">--all-databases</a></th>
<td>Check all tables in all databases</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_all-in-1">--all-in-1</a></th>
<td>Execute a single statement for each database that names all the tables from that database</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_analyze">--analyze</a></th>
<td>Analyze the tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_auto-repair">--auto-repair</a></th>
<td>If a checked table is corrupted, automatically fix it</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_bind-address">--bind-address</a></th>
<td>Use specified network interface to connect to MySQL Server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_character-sets-dir">--character-sets-dir</a></th>
<td>Directory where character sets are installed</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_check">--check</a></th>
<td>Check the tables for errors</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-only-changed">--check-only-changed</a></th>
<td>Check only tables that have changed since the last check</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_check-upgrade">--check-upgrade</a></th>
<td>Invoke CHECK TABLE with the FOR UPGRADE option</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_compress">--compress</a></th>
<td>Compress all information sent between client and server</td>
<td></td>
<td>8.0.18</td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_compression-algorithms">--compression-algorithms</a></th>
<td>Permitted compression algorithms for connections to server</td>
<td>8.0.18</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_databases">--databases</a></th>
<td>Interpret all arguments as database names</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug">--debug</a></th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-check">--debug-check</a></th>
<td>Print debugging information when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_debug-info">--debug-info</a></th>
<td>Print debugging information, memory, and CPU statistics when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_default-auth">--default-auth</a></th>
<td>Authentication plugin to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_default-character-set">--default-character-set</a></th>
<td>Specify default character set</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-extra-file">--defaults-extra-file</a></th>
<td>Read named option file in addition to usual option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-file">--defaults-file</a></th>
<td>Read only named option file</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_defaults-group-suffix">--defaults-group-suffix</a></th>
<td>Option group suffix value</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_enable-cleartext-plugin">--enable-cleartext-plugin</a></th>
<td>Enable cleartext authentication plugin</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_extended">--extended</a></th>
<td>Check and repair tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_fast">--fast</a></th>
<td>Check only tables that have not been closed properly</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_force">--force</a></th>
<td>Continue even if an SQL error occurs</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_get-server-public-key">--get-server-public-key</a></th>
<td>Request RSA public key from server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_help">--help</a></th>
<td>Display help message and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_host">--host</a></th>
<td>Host on which MySQL server is located</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_login-path">--login-path</a></th>
<td>Read login path options from .mylogin.cnf</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_medium-check">--medium-check</a></th>
<td>Do a check that is faster than an --extended operation</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_no-defaults">--no-defaults</a></th>
<td>Read no option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_optimize">--optimize</a></th>
<td>Optimize the tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password">--password</a></th>
<td>Password to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password1">--password1</a></th>
<td>First multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password2">--password2</a></th>
<td>Second multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_password3">--password3</a></th>
<td>Third multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_pipe">--pipe</a></th>
<td>Connect to server using named pipe (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_plugin-dir">--plugin-dir</a></th>
<td>Directory where plugins are installed</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_port">--port</a></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_print-defaults">--print-defaults</a></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_protocol">--protocol</a></th>
<td>Transport protocol to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_quick">--quick</a></th>
<td>The fastest method of checking</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_repair">--repair</a></th>
<td>Perform a repair that can fix almost anything except unique keys that are not unique</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_server-public-key-path">--server-public-key-path</a></th>
<td>Path name to file containing RSA public key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_shared-memory-base-name">--shared-memory-base-name</a></th>
<td>Shared-memory name for shared-memory connections (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_silent">--silent</a></th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_skip-database">--skip-database</a></th>
<td>Omit this database from performed operations</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_socket">--socket</a></th>
<td>Unix socket file or Windows named pipe to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-ca</a></th>
<td>File that contains list of trusted SSL Certificate Authorities</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-capath</a></th>
<td>Directory that contains trusted SSL Certificate Authority certificate files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-cert</a></th>
<td>File that contains X.509 certificate</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-cipher</a></th>
<td>Permissible ciphers for connection encryption</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-crl</a></th>
<td>File that contains certificate revocation lists</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-crlpath</a></th>
<td>Directory that contains certificate revocation-list files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl-fips-mode">--ssl-fips-mode</a></th>
<td>Whether to enable FIPS mode on client side</td>
<td></td>
<td>8.0.34</td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-key</a></th>
<td>File that contains X.509 key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-mode</a></th>
<td>Desired security state of connection to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-session-data</a></th>
<td>File that contains SSL session data</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_ssl">--ssl-session-data-continue-on-failed-reuse</a></th>
<td>Whether to establish connections if session reuse fails</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_tables">--tables</a></th>
<td>Overrides the --databases or -B option</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_tls-ciphersuites">--tls-ciphersuites</a></th>
<td>Permissible TLSv1.3 ciphersuites for encrypted connections</td>
<td>8.0.16</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_tls-version">--tls-version</a></th>
<td>Permissible TLS protocols for encrypted connections</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_use-frm">--use-frm</a></th>
<td>For repair operations on MyISAM tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_user">--user</a></th>
<td>MySQL user name to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_verbose">--verbose</a></th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_version">--version</a></th>
<td>Display version information and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_write-binlog">--write-binlog</a></th>
<td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlcheck.html#option_mysqlcheck_zstd-compression-level">--zstd-compression-level</a></th>
<td>Compression level for connections to server that use zstd compression</td>
<td>8.0.18</td>
<td></td>
</tr></tbody></table>9

  Read this option file after the global option file but (on
  Unix) before the user option file. If the file does not
  exist or is otherwise inaccessible, an error occurs. If
  *`file_name`* is not an absolute path
  name, it is interpreted relative to the current directory.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--defaults-file=file_name`](mysqlcheck.html#option_mysqlcheck_defaults-file)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>0

  Use only the given option file. If the file does not exist
  or is otherwise inaccessible, an error occurs. If
  *`file_name`* is not an absolute path
  name, it is interpreted relative to the current directory.

  Exception: Even with
  [`--defaults-file`](option-file-options.html#option_general_defaults-file), client
  programs read `.mylogin.cnf`.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--defaults-group-suffix=str`](mysqlcheck.html#option_mysqlcheck_defaults-group-suffix)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>1

  Read not only the usual option groups, but also groups with
  the usual names and a suffix of
  *`str`*. For example,
  [**mysqlcheck**](mysqlcheck.html "6.5.3 mysqlcheck — A Table Maintenance Program") normally reads the
  `[client]` and
  `[mysqlcheck]` groups. If this option is
  given as
  [`--defaults-group-suffix=_other`](mysqlcheck.html#option_mysqlcheck_defaults-group-suffix),
  [**mysqlcheck**](mysqlcheck.html "6.5.3 mysqlcheck — A Table Maintenance Program") also reads the
  `[client_other]` and
  `[mysqlcheck_other]` groups.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--extended`](mysqlcheck.html#option_mysqlcheck_extended),
  `-e`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>2

  If you are using this option to check tables, it ensures
  that they are 100% consistent but takes a long time.

  If you are using this option to repair tables, it runs an
  extended repair that may not only take a long time to
  execute, but may produce a lot of garbage rows also!

* [`--default-auth=plugin`](mysqlcheck.html#option_mysqlcheck_default-auth)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>3

  A hint about which client-side authentication plugin to use.
  See [Section 8.2.17, “Pluggable Authentication”](pluggable-authentication.html "8.2.17 Pluggable Authentication").

* [`--enable-cleartext-plugin`](mysqlcheck.html#option_mysqlcheck_enable-cleartext-plugin)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>4

  Enable the `mysql_clear_password` cleartext
  authentication plugin. (See
  [Section 8.4.1.4, “Client-Side Cleartext Pluggable Authentication”](cleartext-pluggable-authentication.html "8.4.1.4 Client-Side Cleartext Pluggable Authentication").)

* [`--fast`](mysqlcheck.html#option_mysqlcheck_fast),
  `-F`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>5

  Check only tables that have not been closed properly.

* [`--force`](mysqlcheck.html#option_mysqlcheck_force),
  `-f`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>6

  Continue even if an SQL error occurs.

* [`--get-server-public-key`](mysqlcheck.html#option_mysqlcheck_get-server-public-key)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>7

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
  [`--server-public-key-path=file_name`](mysqlcheck.html#option_mysqlcheck_server-public-key-path)
  is given and specifies a valid public key file, it takes
  precedence over
  [`--get-server-public-key`](mysqlcheck.html#option_mysqlcheck_get-server-public-key).

  For information about the
  `caching_sha2_password` plugin, see
  [Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”](caching-sha2-pluggable-authentication.html "8.4.1.2 Caching SHA-2 Pluggable Authentication").

* [`--host=host_name`](mysqlcheck.html#option_mysqlcheck_host),
  `-h host_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>8

  Connect to the MySQL server on the given host.

* [`--login-path=name`](mysqlcheck.html#option_mysqlcheck_login-path)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>9

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

* [`--medium-check`](mysqlcheck.html#option_mysqlcheck_medium-check),
  `-m`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--all-databases</code></td>
</tr></tbody></table>0

  Do a check that is faster than an
  [`--extended`](mysqlcheck.html#option_mysqlcheck_extended) operation.
  This finds only 99.99% of all errors, which should be good
  enough in most cases.

* [`--no-defaults`](mysqlcheck.html#option_mysqlcheck_no-defaults)

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--all-databases</code></td>
</tr></tbody></table>1

  Do not read any option files. If program startup fails due
  to reading unknown options from an option file,
  [`--no-defaults`](mysqlcheck.html#option_mysqlcheck_no-defaults) can be used
  to prevent them from being read.

  The exception is that the `.mylogin.cnf`
  file is read in all cases, if it exists. This permits
  passwords to be specified in a safer way than on the command
  line even when
  [`--no-defaults`](mysqlcheck.html#option_mysqlcheck_no-defaults) is used. To
  create `.mylogin.cnf`, use the
  [**mysql\_config\_editor**](mysql-config-editor.html "6.6.7 mysql_config_editor — MySQL Configuration Utility") utility. See
  [Section 6.6.7, “mysql\_config\_editor — MySQL Configuration Utility”](mysql-config-editor.html "6.6.7 mysql_config_editor — MySQL Configuration Utility").

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--optimize`](mysqlcheck.html#option_mysqlcheck_optimize),
  `-o`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--all-databases</code></td>
</tr></tbody></table>2

  Optimize the tables.

* [`--password[=password]`](mysqlcheck.html#option_mysqlcheck_password),
  `-p[password]`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--all-databases</code></td>
</tr></tbody></table>3

  The password of the MySQL account used for connecting to the
  server. The password value is optional. If not given,
  [**mysqlcheck**](mysqlcheck.html "6.5.3 mysqlcheck — A Table Maintenance Program") prompts for one. If given,
  there must be *no space* between
  [`--password=`](mysqlcheck.html#option_mysqlcheck_password) or
  `-p` and the password following it. If no
  password option is specified, the default is to send no
  password.

  Specifying a password on the command line should be
  considered insecure. To avoid giving the password on the
  command line, use an option file. See
  [Section 8.1.2.1, “End-User Guidelines for Password Security”](password-security-user.html "8.1.2.1 End-User Guidelines for Password Security").

  To explicitly specify that there is no password and that
  [**mysqlcheck**](mysqlcheck.html "6.5.3 mysqlcheck — A Table Maintenance Program") should not prompt for one, use
  the
  [`--skip-password`](mysqlcheck.html#option_mysqlcheck_password)
  option.

* [`--password1[=pass_val]`](mysqlcheck.html#option_mysqlcheck_password1)

  The password for multifactor authentication factor 1 of the
  MySQL account used for connecting to the server. The
  password value is optional. If not given,
  [**mysqlcheck**](mysqlcheck.html "6.5.3 mysqlcheck — A Table Maintenance Program") prompts for one. If given,
  there must be *no space* between
  [`--password1=`](mysqlcheck.html#option_mysqlcheck_password1) and the
  password following it. If no password option is specified,
  the default is to send no password.

  Specifying a password on the command line should be
  considered insecure. To avoid giving the password on the
  command line, use an option file. See
  [Section 8.1.2.1, “End-User Guidelines for Password Security”](password-security-user.html "8.1.2.1 End-User Guidelines for Password Security").

  To explicitly specify that there is no password and that
  [**mysqlcheck**](mysqlcheck.html "6.5.3 mysqlcheck — A Table Maintenance Program") should not prompt for one, use
  the
  [`--skip-password1`](mysqlcheck.html#option_mysqlcheck_password1)
  option.

  [`--password1`](mysqlcheck.html#option_mysqlcheck_password1) and
  [`--password`](mysqlcheck.html#option_mysqlcheck_password) are
  synonymous, as are
  [`--skip-password1`](mysqlcheck.html#option_mysqlcheck_password1)
  and
  [`--skip-password`](mysqlcheck.html#option_mysqlcheck_password).

* [`--password2[=pass_val]`](mysqlcheck.html#option_mysqlcheck_password2)

  The password for multifactor authentication factor 2 of the
  MySQL account used for connecting to the server. The
  semantics of this option are similar to the semantics for
  [`--password1`](mysqlcheck.html#option_mysqlcheck_password1); see the
  description of that option for details.

* [`--password3[=pass_val]`](mysqlcheck.html#option_mysqlcheck_password3)

  The password for multifactor authentication factor 3 of the
  MySQL account used for connecting to the server. The
  semantics of this option are similar to the semantics for
  [`--password1`](mysqlcheck.html#option_mysqlcheck_password1); see the
  description of that option for details.

* [`--pipe`](mysqlcheck.html#option_mysqlcheck_pipe),
  `-W`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--all-databases</code></td>
</tr></tbody></table>4

  On Windows, connect to the server using a named pipe. This
  option applies only if the server was started with the
  [`named_pipe`](server-system-variables.html#sysvar_named_pipe) system variable
  enabled to support named-pipe connections. In addition, the
  user making the connection must be a member of the Windows
  group specified by the
  [`named_pipe_full_access_group`](server-system-variables.html#sysvar_named_pipe_full_access_group)
  system variable.

* [`--plugin-dir=dir_name`](mysqlcheck.html#option_mysqlcheck_plugin-dir)

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--all-databases</code></td>
</tr></tbody></table>5

  The directory in which to look for plugins. Specify this
  option if the
  [`--default-auth`](mysqlcheck.html#option_mysqlcheck_default-auth) option is
  used to specify an authentication plugin but
  [**mysqlcheck**](mysqlcheck.html "6.5.3 mysqlcheck — A Table Maintenance Program") does not find it. See
  [Section 8.2.17, “Pluggable Authentication”](pluggable-authentication.html "8.2.17 Pluggable Authentication").

* [`--port=port_num`](mysqlcheck.html#option_mysqlcheck_port),
  `-P port_num`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--all-databases</code></td>
</tr></tbody></table>6

  For TCP/IP connections, the port number to use.

* [`--print-defaults`](mysqlcheck.html#option_mysqlcheck_print-defaults)

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--all-databases</code></td>
</tr></tbody></table>7

  Print the program name and all options that it gets from
  option files.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--protocol={TCP|SOCKET|PIPE|MEMORY}`](mysqlcheck.html#option_mysqlcheck_protocol)

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--all-databases</code></td>
</tr></tbody></table>8

  The transport protocol to use for connecting to the server.
  It is useful when the other connection parameters normally
  result in use of a protocol other than the one you want. For
  details on the permissible values, see
  [Section 6.2.7, “Connection Transport Protocols”](transport-protocols.html "6.2.7 Connection Transport Protocols").

* [`--quick`](mysqlcheck.html#option_mysqlcheck_quick),
  `-q`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--all-databases</code></td>
</tr></tbody></table>9

  If you are using this option to check tables, it prevents
  the check from scanning the rows to check for incorrect
  links. This is the fastest check method.

  If you are using this option to repair tables, it tries to
  repair only the index tree. This is the fastest repair
  method.

* [`--repair`](mysqlcheck.html#option_mysqlcheck_repair),
  `-r`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--all-in-1</code></td>
</tr></tbody></table>0

  Perform a repair that can fix almost anything except unique
  keys that are not unique.

* [`--server-public-key-path=file_name`](mysqlcheck.html#option_mysqlcheck_server-public-key-path)

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--all-in-1</code></td>
</tr></tbody></table>1

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
  [`--server-public-key-path=file_name`](mysqlcheck.html#option_mysqlcheck_server-public-key-path)
  is given and specifies a valid public key file, it takes
  precedence over
  [`--get-server-public-key`](mysqlcheck.html#option_mysqlcheck_get-server-public-key).

  For `sha256_password`, this option applies
  only if MySQL was built using OpenSSL.

  For information about the `sha256_password`
  and `caching_sha2_password` plugins, see
  [Section 8.4.1.3, “SHA-256 Pluggable Authentication”](sha256-pluggable-authentication.html "8.4.1.3 SHA-256 Pluggable Authentication"), and
  [Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”](caching-sha2-pluggable-authentication.html "8.4.1.2 Caching SHA-2 Pluggable Authentication").

* [`--shared-memory-base-name=name`](mysqlcheck.html#option_mysqlcheck_shared-memory-base-name)

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--all-in-1</code></td>
</tr></tbody></table>2

  On Windows, the shared-memory name to use for connections
  made using shared memory to a local server. The default
  value is `MYSQL`. The shared-memory name is
  case-sensitive.

  This option applies only if the server was started with the
  [`shared_memory`](server-system-variables.html#sysvar_shared_memory) system
  variable enabled to support shared-memory connections.

* [`--silent`](mysqlcheck.html#option_mysqlcheck_silent),
  `-s`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--all-in-1</code></td>
</tr></tbody></table>3

  Silent mode. Print only error messages.

* [`--skip-database=db_name`](mysqlcheck.html#option_mysqlcheck_skip-database)

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--all-in-1</code></td>
</tr></tbody></table>4

  Do not include the named database (case-sensitive) in the
  operations performed by [**mysqlcheck**](mysqlcheck.html "6.5.3 mysqlcheck — A Table Maintenance Program").

* [`--socket=path`](mysqlcheck.html#option_mysqlcheck_socket),
  `-S path`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--all-in-1</code></td>
</tr></tbody></table>5

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

* [`--ssl-fips-mode={OFF|ON|STRICT}`](mysqlcheck.html#option_mysqlcheck_ssl-fips-mode)

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--all-in-1</code></td>
</tr></tbody></table>6

  Controls whether to enable FIPS mode on the client side. The
  [`--ssl-fips-mode`](mysqlcheck.html#option_mysqlcheck_ssl-fips-mode) option
  differs from other
  `--ssl-xxx`
  options in that it is not used to establish encrypted
  connections, but rather to affect which cryptographic
  operations to permit. See [Section 8.8, “FIPS Support”](fips-mode.html "8.8 FIPS Support").

  These [`--ssl-fips-mode`](mysqlcheck.html#option_mysqlcheck_ssl-fips-mode)
  values are permitted:

  + `OFF`: Disable FIPS mode.
  + `ON`: Enable FIPS mode.
  + `STRICT`: Enable “strict”
    FIPS mode.

  Note

  If the OpenSSL FIPS Object Module is not available, the
  only permitted value for
  [`--ssl-fips-mode`](mysqlcheck.html#option_mysqlcheck_ssl-fips-mode) is
  `OFF`. In this case, setting
  [`--ssl-fips-mode`](mysqlcheck.html#option_mysqlcheck_ssl-fips-mode) to
  `ON` or `STRICT` causes
  the client to produce a warning at startup and to operate
  in non-FIPS mode.

  As of MySQL 8.0.34, this option is deprecated. Expect it to
  be removed in a future version of MySQL.

* [`--tables`](mysqlcheck.html#option_mysqlcheck_tables)

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--all-in-1</code></td>
</tr></tbody></table>7

  Override the [`--databases`](mysqlcheck.html#option_mysqlcheck_databases)
  or `-B` option. All name arguments following
  the option are regarded as table names.

* [`--tls-ciphersuites=ciphersuite_list`](mysqlcheck.html#option_mysqlcheck_tls-ciphersuites)

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--all-in-1</code></td>
</tr></tbody></table>8

  The permissible ciphersuites for encrypted connections that
  use TLSv1.3. The value is a list of one or more
  colon-separated ciphersuite names. The ciphersuites that can
  be named for this option depend on the SSL library used to
  compile MySQL. For details, see
  [Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”](encrypted-connection-protocols-ciphers.html "8.3.2 Encrypted Connection TLS Protocols and Ciphers").

  This option was added in MySQL 8.0.16.

* [`--tls-version=protocol_list`](mysqlcheck.html#option_mysqlcheck_tls-version)

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--all-in-1</code></td>
</tr></tbody></table>9

  The permissible TLS protocols for encrypted connections. The
  value is a list of one or more comma-separated protocol
  names. The protocols that can be named for this option
  depend on the SSL library used to compile MySQL. For
  details, see
  [Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”](encrypted-connection-protocols-ciphers.html "8.3.2 Encrypted Connection TLS Protocols and Ciphers").

* [`--use-frm`](mysqlcheck.html#option_mysqlcheck_use-frm)

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--analyze</code></td>
</tr></tbody></table>0

  For repair operations on `MyISAM` tables,
  get the table structure from the data dictionary so that the
  table can be repaired even if the `.MYI`
  header is corrupted.

* [`--user=user_name`](mysqlcheck.html#option_mysqlcheck_user),
  `-u user_name`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--analyze</code></td>
</tr></tbody></table>1

  The user name of the MySQL account to use for connecting to
  the server.

* [`--verbose`](mysqlcheck.html#option_mysqlcheck_verbose),
  `-v`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--analyze</code></td>
</tr></tbody></table>2

  Verbose mode. Print information about the various stages of
  program operation.

* [`--version`](mysqlcheck.html#option_mysqlcheck_version),
  `-V`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--analyze</code></td>
</tr></tbody></table>3

  Display version information and exit.

* [`--write-binlog`](mysqlcheck.html#option_mysqlcheck_write-binlog)

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--analyze</code></td>
</tr></tbody></table>4

  This option is enabled by default, so that
  [`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement"),
  [`OPTIMIZE TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement"), and
  [`REPAIR TABLE`](repair-table.html "15.7.3.5 REPAIR TABLE Statement") statements
  generated by [**mysqlcheck**](mysqlcheck.html "6.5.3 mysqlcheck — A Table Maintenance Program") are written to
  the binary log. Use
  [`--skip-write-binlog`](mysqlcheck.html#option_mysqlcheck_write-binlog)
  to cause `NO_WRITE_TO_BINLOG` to be added
  to the statements so that they are not logged. Use the
  [`--skip-write-binlog`](mysqlcheck.html#option_mysqlcheck_write-binlog)
  when these statements should not be sent to replicas or run
  when using the binary logs for recovery from backup.

* [`--zstd-compression-level=level`](mysqlcheck.html#option_mysqlcheck_zstd-compression-level)

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--analyze</code></td>
</tr></tbody></table>5

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