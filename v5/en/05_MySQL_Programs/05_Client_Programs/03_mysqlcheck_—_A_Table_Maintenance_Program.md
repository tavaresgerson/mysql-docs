### 4.5.3 mysqlcheck — A Table Maintenance Program

The [**mysqlcheck**](mysqlcheck.html "4.5.3 mysqlcheck — A Table Maintenance Program") client performs table
maintenance: It checks, repairs, optimizes, or analyzes tables.

Each table is locked and therefore unavailable to other sessions
while it is being processed, although for check operations, the
table is locked with a `READ` lock only (see
[Section 13.3.5, “LOCK TABLES and UNLOCK TABLES Statements”](lock-tables.html "13.3.5 LOCK TABLES and UNLOCK TABLES Statements"), for more information about
`READ` and `WRITE` locks).
Table maintenance operations can be time-consuming, particularly
for large tables. If you use the
[`--databases`](mysqlcheck.html#option_mysqlcheck_databases) or
[`--all-databases`](mysqlcheck.html#option_mysqlcheck_all-databases) option to
process all tables in one or more databases, an invocation of
[**mysqlcheck**](mysqlcheck.html "4.5.3 mysqlcheck — A Table Maintenance Program") might take a long time. (This is
also true for the MySQL upgrade procedure if it determines that
table checking is needed because it processes tables the same
way.)

[**mysqlcheck**](mysqlcheck.html "4.5.3 mysqlcheck — A Table Maintenance Program") must be used when the
[`mysqld`](mysqld.html "4.3.1 mysqld — The MySQL Server") server is running, which means that
you do not have to stop the server to perform table maintenance.

[**mysqlcheck**](mysqlcheck.html "4.5.3 mysqlcheck — A Table Maintenance Program") uses the SQL statements
[`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement"),
[`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement"),
[`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement"), and
[`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement") in a convenient
way for the user. It determines which statements to use for the
operation you want to perform, and then sends the statements to
the server to be executed. For details about which storage
engines each statement works with, see the descriptions for
those statements in
[Section 13.7.2, “Table Maintenance Statements”](table-maintenance-statements.html "13.7.2 Table Maintenance Statements").

All storage engines do not necessarily support all four
maintenance operations. In such cases, an error message is
displayed. For example, if `test.t` is an
`MEMORY` table, an attempt to check it produces
this result:

```sql
$> mysqlcheck test t
test.t
note     : The storage engine for the table doesn't support check
```

If [**mysqlcheck**](mysqlcheck.html "4.5.3 mysqlcheck — A Table Maintenance Program") is unable to repair a table,
see [Section 2.10.12, “Rebuilding or Repairing Tables or Indexes”](rebuilding-tables.html "2.10.12 Rebuilding or Repairing Tables or Indexes") for manual table repair
strategies. This is the case, for example, for
`InnoDB` tables, which can be checked with
[`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement"), but not repaired
with [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement").

Caution

It is best to make a backup of a table before performing a
table repair operation; under some circumstances the operation
might cause data loss. Possible causes include but are not
limited to file system errors.

There are three general ways to invoke
[**mysqlcheck**](mysqlcheck.html "4.5.3 mysqlcheck — A Table Maintenance Program"):

```sql
mysqlcheck [options] db_name [tbl_name ...]
mysqlcheck [options] --databases db_name ...
mysqlcheck [options] --all-databases
```

If you do not name any tables following
*`db_name`* or if you use the
[`--databases`](mysqlcheck.html#option_mysqlcheck_databases) or
[`--all-databases`](mysqlcheck.html#option_mysqlcheck_all-databases) option,
entire databases are checked.

[**mysqlcheck**](mysqlcheck.html "4.5.3 mysqlcheck — A Table Maintenance Program") has a special feature compared to
other client programs. The default behavior of checking tables
([`--check`](mysqlcheck.html#option_mysqlcheck_check)) can be changed by
renaming the binary. If you want to have a tool that repairs
tables by default, you should just make a copy of
[**mysqlcheck**](mysqlcheck.html "4.5.3 mysqlcheck — A Table Maintenance Program") named
**mysqlrepair**, or make a symbolic link to
[**mysqlcheck**](mysqlcheck.html "4.5.3 mysqlcheck — A Table Maintenance Program") named
**mysqlrepair**. If you invoke
**mysqlrepair**, it repairs tables.

The names shown in the following table can be used to change
[**mysqlcheck**](mysqlcheck.html "4.5.3 mysqlcheck — A Table Maintenance Program") default behavior.

<table summary="Command names that can be used to change mysqlcheck default behavior."><col style="width: 25%"/><col style="width: 75%"/><thead><tr>
<th>Command</th>
<th>Meaning</th>
</tr></thead><tbody><tr>
<td><strong>mysqlrepair</strong></td>
<td>The default option is <code class="option">--repair</code></td>
</tr><tr>
<td><strong>mysqlanalyze</strong></td>
<td>The default option is <code class="option">--analyze</code></td>
</tr><tr>
<td><strong>mysqloptimize</strong></td>
<td>The default option is <code class="option">--optimize</code></td>
</tr></tbody></table>

[**mysqlcheck**](mysqlcheck.html "4.5.3 mysqlcheck — A Table Maintenance Program") supports the following options,
which can be specified on the command line or in the
`[mysqlcheck]` and `[client]`
groups of an option file. For information about option files
used by MySQL programs, see [Section 4.2.2.2, “Using Option Files”](option-files.html "4.2.2.2 Using Option Files").

**Table 4.15 mysqlcheck Options**

<table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th>Option Name</th>
<th>Description</th>
<th>Introduced</th>
<th>Deprecated</th>
</tr></thead><tbody><tr><th>--all-databases</th>
<td>Check all tables in all databases</td>
<td></td>
<td></td>
</tr><tr><th>--all-in-1</th>
<td>Execute a single statement for each database that names all the tables from that database</td>
<td></td>
<td></td>
</tr><tr><th>--analyze</th>
<td>Analyze the tables</td>
<td></td>
<td></td>
</tr><tr><th>--auto-repair</th>
<td>If a checked table is corrupted, automatically fix it</td>
<td></td>
<td></td>
</tr><tr><th>--bind-address</th>
<td>Use specified network interface to connect to MySQL Server</td>
<td></td>
<td></td>
</tr><tr><th>--character-sets-dir</th>
<td>Directory where character sets are installed</td>
<td></td>
<td></td>
</tr><tr><th>--check</th>
<td>Check the tables for errors</td>
<td></td>
<td></td>
</tr><tr><th>--check-only-changed</th>
<td>Check only tables that have changed since the last check</td>
<td></td>
<td></td>
</tr><tr><th>--check-upgrade</th>
<td>Invoke CHECK TABLE with the FOR UPGRADE option</td>
<td></td>
<td></td>
</tr><tr><th>--compress</th>
<td>Compress all information sent between client and server</td>
<td></td>
<td></td>
</tr><tr><th>--databases</th>
<td>Interpret all arguments as database names</td>
<td></td>
<td></td>
</tr><tr><th>--debug</th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr><tr><th>--debug-check</th>
<td>Print debugging information when program exits</td>
<td></td>
<td></td>
</tr><tr><th>--debug-info</th>
<td>Print debugging information, memory, and CPU statistics when program exits</td>
<td></td>
<td></td>
</tr><tr><th>--default-auth</th>
<td>Authentication plugin to use</td>
<td></td>
<td></td>
</tr><tr><th>--default-character-set</th>
<td>Specify default character set</td>
<td></td>
<td></td>
</tr><tr><th>--defaults-extra-file</th>
<td>Read named option file in addition to usual option files</td>
<td></td>
<td></td>
</tr><tr><th>--defaults-file</th>
<td>Read only named option file</td>
<td></td>
<td></td>
</tr><tr><th>--defaults-group-suffix</th>
<td>Option group suffix value</td>
<td></td>
<td></td>
</tr><tr><th>--enable-cleartext-plugin</th>
<td>Enable cleartext authentication plugin</td>
<td>5.7.10</td>
<td></td>
</tr><tr><th>--extended</th>
<td>Check and repair tables</td>
<td></td>
<td></td>
</tr><tr><th>--fast</th>
<td>Check only tables that have not been closed properly</td>
<td></td>
<td></td>
</tr><tr><th>--fix-db-names</th>
<td>Convert database names to 5.1 format</td>
<td></td>
<td>Yes</td>
</tr><tr><th>--fix-table-names</th>
<td>Convert table names to 5.1 format</td>
<td></td>
<td>Yes</td>
</tr><tr><th>--force</th>
<td>Continue even if an SQL error occurs</td>
<td></td>
<td></td>
</tr><tr><th>--get-server-public-key</th>
<td>Request RSA public key from server</td>
<td>5.7.23</td>
<td></td>
</tr><tr><th>--help</th>
<td>Display help message and exit</td>
<td></td>
<td></td>
</tr><tr><th>--host</th>
<td>Host on which MySQL server is located</td>
<td></td>
<td></td>
</tr><tr><th>--login-path</th>
<td>Read login path options from .mylogin.cnf</td>
<td></td>
<td></td>
</tr><tr><th>--medium-check</th>
<td>Do a check that is faster than an --extended operation</td>
<td></td>
<td></td>
</tr><tr><th>--no-defaults</th>
<td>Read no option files</td>
<td></td>
<td></td>
</tr><tr><th>--optimize</th>
<td>Optimize the tables</td>
<td></td>
<td></td>
</tr><tr><th>--password</th>
<td>Password to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th>--pipe</th>
<td>Connect to server using named pipe (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th>--plugin-dir</th>
<td>Directory where plugins are installed</td>
<td></td>
<td></td>
</tr><tr><th>--port</th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr><tr><th>--print-defaults</th>
<td>Print default options</td>
<td></td>
<td></td>
</tr><tr><th>--protocol</th>
<td>Transport protocol to use</td>
<td></td>
<td></td>
</tr><tr><th>--quick</th>
<td>The fastest method of checking</td>
<td></td>
<td></td>
</tr><tr><th>--repair</th>
<td>Perform a repair that can fix almost anything except unique keys that are not unique</td>
<td></td>
<td></td>
</tr><tr><th>--secure-auth</th>
<td>Do not send passwords to server in old (pre-4.1) format</td>
<td></td>
<td>Yes</td>
</tr><tr><th>--server-public-key-path</th>
<td>Path name to file containing RSA public key</td>
<td>5.7.23</td>
<td></td>
</tr><tr><th>--shared-memory-base-name</th>
<td>Shared-memory name for shared-memory connections (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th>--silent</th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr><tr><th>--skip-database</th>
<td>Omit this database from performed operations</td>
<td></td>
<td></td>
</tr><tr><th>--socket</th>
<td>Unix socket file or Windows named pipe to use</td>
<td></td>
<td></td>
</tr><tr><th>--ssl</th>
<td>Enable connection encryption</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-ca</th>
<td>File that contains list of trusted SSL Certificate Authorities</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-capath</th>
<td>Directory that contains trusted SSL Certificate Authority certificate files</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-cert</th>
<td>File that contains X.509 certificate</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-cipher</th>
<td>Permissible ciphers for connection encryption</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-crl</th>
<td>File that contains certificate revocation lists</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-crlpath</th>
<td>Directory that contains certificate revocation-list files</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-key</th>
<td>File that contains X.509 key</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-mode</th>
<td>Desired security state of connection to server</td>
<td>5.7.11</td>
<td></td>
</tr><tr><th>--ssl-verify-server-cert</th>
<td>Verify host name against server certificate Common Name identity</td>
<td></td>
<td></td>
</tr><tr><th>--tables</th>
<td>Overrides the --databases or -B option</td>
<td></td>
<td></td>
</tr><tr><th>--tls-version</th>
<td>Permissible TLS protocols for encrypted connections</td>
<td>5.7.10</td>
<td></td>
</tr><tr><th>--use-frm</th>
<td>For repair operations on MyISAM tables</td>
<td></td>
<td></td>
</tr><tr><th>--user</th>
<td>MySQL user name to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th>--verbose</th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr><tr><th>--version</th>
<td>Display version information and exit</td>
<td></td>
<td></td>
</tr><tr><th>--write-binlog</th>
<td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
<td></td>
<td></td>
</tr></tbody></table>

* [`--help`](mysqlcheck.html#option_mysqlcheck_help),
  `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--help</code></td>
</tr></tbody></table>

  Display a help message and exit.

* [`--all-databases`](mysqlcheck.html#option_mysqlcheck_all-databases),
  `-A`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--all-databases</code></td>
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
<td><code>--all-in-1</code></td>
</tr></tbody></table>

  Instead of issuing a statement for each table, execute a
  single statement for each database that names all the tables
  from that database to be processed.

* [`--analyze`](mysqlcheck.html#option_mysqlcheck_analyze),
  `-a`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--analyze</code></td>
</tr></tbody></table>

  Analyze the tables.

* [`--auto-repair`](mysqlcheck.html#option_mysqlcheck_auto-repair)

  <table frame="box" rules="all" summary="Properties for auto-repair"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--auto-repair</code></td>
</tr></tbody></table>

  If a checked table is corrupted, automatically fix it. Any
  necessary repairs are done after all tables have been
  checked.

* [`--bind-address=ip_address`](mysqlcheck.html#option_mysqlcheck_bind-address)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--bind-address=ip_address</code></td>
</tr></tbody></table>

  On a computer having multiple network interfaces, use this
  option to select which interface to use for connecting to
  the MySQL server.

* [`--character-sets-dir=dir_name`](mysqlcheck.html#option_mysqlcheck_character-sets-dir)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--character-sets-dir=dir_name</code></td>
</tr><tr><th>Type</th>
<td>Directory name</td>
</tr></tbody></table>

  The directory where character sets are installed. See
  [Section 10.15, “Character Set Configuration”](charset-configuration.html "10.15 Character Set Configuration").

* [`--check`](mysqlcheck.html#option_mysqlcheck_check),
  `-c`

  <table frame="box" rules="all" summary="Properties for check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--check</code></td>
</tr></tbody></table>

  Check the tables for errors. This is the default operation.

* [`--check-only-changed`](mysqlcheck.html#option_mysqlcheck_check-only-changed),
  `-C`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th>Option Name</th>
<th>Description</th>
<th>Introduced</th>
<th>Deprecated</th>
</tr></thead><tbody><tr><th>--all-databases</th>
<td>Check all tables in all databases</td>
<td></td>
<td></td>
</tr><tr><th>--all-in-1</th>
<td>Execute a single statement for each database that names all the tables from that database</td>
<td></td>
<td></td>
</tr><tr><th>--analyze</th>
<td>Analyze the tables</td>
<td></td>
<td></td>
</tr><tr><th>--auto-repair</th>
<td>If a checked table is corrupted, automatically fix it</td>
<td></td>
<td></td>
</tr><tr><th>--bind-address</th>
<td>Use specified network interface to connect to MySQL Server</td>
<td></td>
<td></td>
</tr><tr><th>--character-sets-dir</th>
<td>Directory where character sets are installed</td>
<td></td>
<td></td>
</tr><tr><th>--check</th>
<td>Check the tables for errors</td>
<td></td>
<td></td>
</tr><tr><th>--check-only-changed</th>
<td>Check only tables that have changed since the last check</td>
<td></td>
<td></td>
</tr><tr><th>--check-upgrade</th>
<td>Invoke CHECK TABLE with the FOR UPGRADE option</td>
<td></td>
<td></td>
</tr><tr><th>--compress</th>
<td>Compress all information sent between client and server</td>
<td></td>
<td></td>
</tr><tr><th>--databases</th>
<td>Interpret all arguments as database names</td>
<td></td>
<td></td>
</tr><tr><th>--debug</th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr><tr><th>--debug-check</th>
<td>Print debugging information when program exits</td>
<td></td>
<td></td>
</tr><tr><th>--debug-info</th>
<td>Print debugging information, memory, and CPU statistics when program exits</td>
<td></td>
<td></td>
</tr><tr><th>--default-auth</th>
<td>Authentication plugin to use</td>
<td></td>
<td></td>
</tr><tr><th>--default-character-set</th>
<td>Specify default character set</td>
<td></td>
<td></td>
</tr><tr><th>--defaults-extra-file</th>
<td>Read named option file in addition to usual option files</td>
<td></td>
<td></td>
</tr><tr><th>--defaults-file</th>
<td>Read only named option file</td>
<td></td>
<td></td>
</tr><tr><th>--defaults-group-suffix</th>
<td>Option group suffix value</td>
<td></td>
<td></td>
</tr><tr><th>--enable-cleartext-plugin</th>
<td>Enable cleartext authentication plugin</td>
<td>5.7.10</td>
<td></td>
</tr><tr><th>--extended</th>
<td>Check and repair tables</td>
<td></td>
<td></td>
</tr><tr><th>--fast</th>
<td>Check only tables that have not been closed properly</td>
<td></td>
<td></td>
</tr><tr><th>--fix-db-names</th>
<td>Convert database names to 5.1 format</td>
<td></td>
<td>Yes</td>
</tr><tr><th>--fix-table-names</th>
<td>Convert table names to 5.1 format</td>
<td></td>
<td>Yes</td>
</tr><tr><th>--force</th>
<td>Continue even if an SQL error occurs</td>
<td></td>
<td></td>
</tr><tr><th>--get-server-public-key</th>
<td>Request RSA public key from server</td>
<td>5.7.23</td>
<td></td>
</tr><tr><th>--help</th>
<td>Display help message and exit</td>
<td></td>
<td></td>
</tr><tr><th>--host</th>
<td>Host on which MySQL server is located</td>
<td></td>
<td></td>
</tr><tr><th>--login-path</th>
<td>Read login path options from .mylogin.cnf</td>
<td></td>
<td></td>
</tr><tr><th>--medium-check</th>
<td>Do a check that is faster than an --extended operation</td>
<td></td>
<td></td>
</tr><tr><th>--no-defaults</th>
<td>Read no option files</td>
<td></td>
<td></td>
</tr><tr><th>--optimize</th>
<td>Optimize the tables</td>
<td></td>
<td></td>
</tr><tr><th>--password</th>
<td>Password to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th>--pipe</th>
<td>Connect to server using named pipe (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th>--plugin-dir</th>
<td>Directory where plugins are installed</td>
<td></td>
<td></td>
</tr><tr><th>--port</th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr><tr><th>--print-defaults</th>
<td>Print default options</td>
<td></td>
<td></td>
</tr><tr><th>--protocol</th>
<td>Transport protocol to use</td>
<td></td>
<td></td>
</tr><tr><th>--quick</th>
<td>The fastest method of checking</td>
<td></td>
<td></td>
</tr><tr><th>--repair</th>
<td>Perform a repair that can fix almost anything except unique keys that are not unique</td>
<td></td>
<td></td>
</tr><tr><th>--secure-auth</th>
<td>Do not send passwords to server in old (pre-4.1) format</td>
<td></td>
<td>Yes</td>
</tr><tr><th>--server-public-key-path</th>
<td>Path name to file containing RSA public key</td>
<td>5.7.23</td>
<td></td>
</tr><tr><th>--shared-memory-base-name</th>
<td>Shared-memory name for shared-memory connections (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th>--silent</th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr><tr><th>--skip-database</th>
<td>Omit this database from performed operations</td>
<td></td>
<td></td>
</tr><tr><th>--socket</th>
<td>Unix socket file or Windows named pipe to use</td>
<td></td>
<td></td>
</tr><tr><th>--ssl</th>
<td>Enable connection encryption</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-ca</th>
<td>File that contains list of trusted SSL Certificate Authorities</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-capath</th>
<td>Directory that contains trusted SSL Certificate Authority certificate files</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-cert</th>
<td>File that contains X.509 certificate</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-cipher</th>
<td>Permissible ciphers for connection encryption</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-crl</th>
<td>File that contains certificate revocation lists</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-crlpath</th>
<td>Directory that contains certificate revocation-list files</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-key</th>
<td>File that contains X.509 key</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-mode</th>
<td>Desired security state of connection to server</td>
<td>5.7.11</td>
<td></td>
</tr><tr><th>--ssl-verify-server-cert</th>
<td>Verify host name against server certificate Common Name identity</td>
<td></td>
<td></td>
</tr><tr><th>--tables</th>
<td>Overrides the --databases or -B option</td>
<td></td>
<td></td>
</tr><tr><th>--tls-version</th>
<td>Permissible TLS protocols for encrypted connections</td>
<td>5.7.10</td>
<td></td>
</tr><tr><th>--use-frm</th>
<td>For repair operations on MyISAM tables</td>
<td></td>
<td></td>
</tr><tr><th>--user</th>
<td>MySQL user name to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th>--verbose</th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr><tr><th>--version</th>
<td>Display version information and exit</td>
<td></td>
<td></td>
</tr><tr><th>--write-binlog</th>
<td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
<td></td>
<td></td>
</tr></tbody></table>0

  Check only tables that have changed since the last check or
  that have not been closed properly.

* [`--check-upgrade`](mysqlcheck.html#option_mysqlcheck_check-upgrade),
  `-g`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th>Option Name</th>
<th>Description</th>
<th>Introduced</th>
<th>Deprecated</th>
</tr></thead><tbody><tr><th>--all-databases</th>
<td>Check all tables in all databases</td>
<td></td>
<td></td>
</tr><tr><th>--all-in-1</th>
<td>Execute a single statement for each database that names all the tables from that database</td>
<td></td>
<td></td>
</tr><tr><th>--analyze</th>
<td>Analyze the tables</td>
<td></td>
<td></td>
</tr><tr><th>--auto-repair</th>
<td>If a checked table is corrupted, automatically fix it</td>
<td></td>
<td></td>
</tr><tr><th>--bind-address</th>
<td>Use specified network interface to connect to MySQL Server</td>
<td></td>
<td></td>
</tr><tr><th>--character-sets-dir</th>
<td>Directory where character sets are installed</td>
<td></td>
<td></td>
</tr><tr><th>--check</th>
<td>Check the tables for errors</td>
<td></td>
<td></td>
</tr><tr><th>--check-only-changed</th>
<td>Check only tables that have changed since the last check</td>
<td></td>
<td></td>
</tr><tr><th>--check-upgrade</th>
<td>Invoke CHECK TABLE with the FOR UPGRADE option</td>
<td></td>
<td></td>
</tr><tr><th>--compress</th>
<td>Compress all information sent between client and server</td>
<td></td>
<td></td>
</tr><tr><th>--databases</th>
<td>Interpret all arguments as database names</td>
<td></td>
<td></td>
</tr><tr><th>--debug</th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr><tr><th>--debug-check</th>
<td>Print debugging information when program exits</td>
<td></td>
<td></td>
</tr><tr><th>--debug-info</th>
<td>Print debugging information, memory, and CPU statistics when program exits</td>
<td></td>
<td></td>
</tr><tr><th>--default-auth</th>
<td>Authentication plugin to use</td>
<td></td>
<td></td>
</tr><tr><th>--default-character-set</th>
<td>Specify default character set</td>
<td></td>
<td></td>
</tr><tr><th>--defaults-extra-file</th>
<td>Read named option file in addition to usual option files</td>
<td></td>
<td></td>
</tr><tr><th>--defaults-file</th>
<td>Read only named option file</td>
<td></td>
<td></td>
</tr><tr><th>--defaults-group-suffix</th>
<td>Option group suffix value</td>
<td></td>
<td></td>
</tr><tr><th>--enable-cleartext-plugin</th>
<td>Enable cleartext authentication plugin</td>
<td>5.7.10</td>
<td></td>
</tr><tr><th>--extended</th>
<td>Check and repair tables</td>
<td></td>
<td></td>
</tr><tr><th>--fast</th>
<td>Check only tables that have not been closed properly</td>
<td></td>
<td></td>
</tr><tr><th>--fix-db-names</th>
<td>Convert database names to 5.1 format</td>
<td></td>
<td>Yes</td>
</tr><tr><th>--fix-table-names</th>
<td>Convert table names to 5.1 format</td>
<td></td>
<td>Yes</td>
</tr><tr><th>--force</th>
<td>Continue even if an SQL error occurs</td>
<td></td>
<td></td>
</tr><tr><th>--get-server-public-key</th>
<td>Request RSA public key from server</td>
<td>5.7.23</td>
<td></td>
</tr><tr><th>--help</th>
<td>Display help message and exit</td>
<td></td>
<td></td>
</tr><tr><th>--host</th>
<td>Host on which MySQL server is located</td>
<td></td>
<td></td>
</tr><tr><th>--login-path</th>
<td>Read login path options from .mylogin.cnf</td>
<td></td>
<td></td>
</tr><tr><th>--medium-check</th>
<td>Do a check that is faster than an --extended operation</td>
<td></td>
<td></td>
</tr><tr><th>--no-defaults</th>
<td>Read no option files</td>
<td></td>
<td></td>
</tr><tr><th>--optimize</th>
<td>Optimize the tables</td>
<td></td>
<td></td>
</tr><tr><th>--password</th>
<td>Password to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th>--pipe</th>
<td>Connect to server using named pipe (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th>--plugin-dir</th>
<td>Directory where plugins are installed</td>
<td></td>
<td></td>
</tr><tr><th>--port</th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr><tr><th>--print-defaults</th>
<td>Print default options</td>
<td></td>
<td></td>
</tr><tr><th>--protocol</th>
<td>Transport protocol to use</td>
<td></td>
<td></td>
</tr><tr><th>--quick</th>
<td>The fastest method of checking</td>
<td></td>
<td></td>
</tr><tr><th>--repair</th>
<td>Perform a repair that can fix almost anything except unique keys that are not unique</td>
<td></td>
<td></td>
</tr><tr><th>--secure-auth</th>
<td>Do not send passwords to server in old (pre-4.1) format</td>
<td></td>
<td>Yes</td>
</tr><tr><th>--server-public-key-path</th>
<td>Path name to file containing RSA public key</td>
<td>5.7.23</td>
<td></td>
</tr><tr><th>--shared-memory-base-name</th>
<td>Shared-memory name for shared-memory connections (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th>--silent</th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr><tr><th>--skip-database</th>
<td>Omit this database from performed operations</td>
<td></td>
<td></td>
</tr><tr><th>--socket</th>
<td>Unix socket file or Windows named pipe to use</td>
<td></td>
<td></td>
</tr><tr><th>--ssl</th>
<td>Enable connection encryption</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-ca</th>
<td>File that contains list of trusted SSL Certificate Authorities</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-capath</th>
<td>Directory that contains trusted SSL Certificate Authority certificate files</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-cert</th>
<td>File that contains X.509 certificate</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-cipher</th>
<td>Permissible ciphers for connection encryption</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-crl</th>
<td>File that contains certificate revocation lists</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-crlpath</th>
<td>Directory that contains certificate revocation-list files</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-key</th>
<td>File that contains X.509 key</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-mode</th>
<td>Desired security state of connection to server</td>
<td>5.7.11</td>
<td></td>
</tr><tr><th>--ssl-verify-server-cert</th>
<td>Verify host name against server certificate Common Name identity</td>
<td></td>
<td></td>
</tr><tr><th>--tables</th>
<td>Overrides the --databases or -B option</td>
<td></td>
<td></td>
</tr><tr><th>--tls-version</th>
<td>Permissible TLS protocols for encrypted connections</td>
<td>5.7.10</td>
<td></td>
</tr><tr><th>--use-frm</th>
<td>For repair operations on MyISAM tables</td>
<td></td>
<td></td>
</tr><tr><th>--user</th>
<td>MySQL user name to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th>--verbose</th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr><tr><th>--version</th>
<td>Display version information and exit</td>
<td></td>
<td></td>
</tr><tr><th>--write-binlog</th>
<td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
<td></td>
<td></td>
</tr></tbody></table>1

  Invoke [`CHECK TABLE`](check-table.html "13.7.2.2 CHECK TABLE Statement") with the
  `FOR UPGRADE` option to check tables for
  incompatibilities with the current version of the server.
  This option automatically enables the
  [`--fix-db-names`](mysqlcheck.html#option_mysqlcheck_fix-db-names) and
  [`--fix-table-names`](mysqlcheck.html#option_mysqlcheck_fix-table-names)
  options.

* [`--compress`](mysqlcheck.html#option_mysqlcheck_compress)

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th>Option Name</th>
<th>Description</th>
<th>Introduced</th>
<th>Deprecated</th>
</tr></thead><tbody><tr><th>--all-databases</th>
<td>Check all tables in all databases</td>
<td></td>
<td></td>
</tr><tr><th>--all-in-1</th>
<td>Execute a single statement for each database that names all the tables from that database</td>
<td></td>
<td></td>
</tr><tr><th>--analyze</th>
<td>Analyze the tables</td>
<td></td>
<td></td>
</tr><tr><th>--auto-repair</th>
<td>If a checked table is corrupted, automatically fix it</td>
<td></td>
<td></td>
</tr><tr><th>--bind-address</th>
<td>Use specified network interface to connect to MySQL Server</td>
<td></td>
<td></td>
</tr><tr><th>--character-sets-dir</th>
<td>Directory where character sets are installed</td>
<td></td>
<td></td>
</tr><tr><th>--check</th>
<td>Check the tables for errors</td>
<td></td>
<td></td>
</tr><tr><th>--check-only-changed</th>
<td>Check only tables that have changed since the last check</td>
<td></td>
<td></td>
</tr><tr><th>--check-upgrade</th>
<td>Invoke CHECK TABLE with the FOR UPGRADE option</td>
<td></td>
<td></td>
</tr><tr><th>--compress</th>
<td>Compress all information sent between client and server</td>
<td></td>
<td></td>
</tr><tr><th>--databases</th>
<td>Interpret all arguments as database names</td>
<td></td>
<td></td>
</tr><tr><th>--debug</th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr><tr><th>--debug-check</th>
<td>Print debugging information when program exits</td>
<td></td>
<td></td>
</tr><tr><th>--debug-info</th>
<td>Print debugging information, memory, and CPU statistics when program exits</td>
<td></td>
<td></td>
</tr><tr><th>--default-auth</th>
<td>Authentication plugin to use</td>
<td></td>
<td></td>
</tr><tr><th>--default-character-set</th>
<td>Specify default character set</td>
<td></td>
<td></td>
</tr><tr><th>--defaults-extra-file</th>
<td>Read named option file in addition to usual option files</td>
<td></td>
<td></td>
</tr><tr><th>--defaults-file</th>
<td>Read only named option file</td>
<td></td>
<td></td>
</tr><tr><th>--defaults-group-suffix</th>
<td>Option group suffix value</td>
<td></td>
<td></td>
</tr><tr><th>--enable-cleartext-plugin</th>
<td>Enable cleartext authentication plugin</td>
<td>5.7.10</td>
<td></td>
</tr><tr><th>--extended</th>
<td>Check and repair tables</td>
<td></td>
<td></td>
</tr><tr><th>--fast</th>
<td>Check only tables that have not been closed properly</td>
<td></td>
<td></td>
</tr><tr><th>--fix-db-names</th>
<td>Convert database names to 5.1 format</td>
<td></td>
<td>Yes</td>
</tr><tr><th>--fix-table-names</th>
<td>Convert table names to 5.1 format</td>
<td></td>
<td>Yes</td>
</tr><tr><th>--force</th>
<td>Continue even if an SQL error occurs</td>
<td></td>
<td></td>
</tr><tr><th>--get-server-public-key</th>
<td>Request RSA public key from server</td>
<td>5.7.23</td>
<td></td>
</tr><tr><th>--help</th>
<td>Display help message and exit</td>
<td></td>
<td></td>
</tr><tr><th>--host</th>
<td>Host on which MySQL server is located</td>
<td></td>
<td></td>
</tr><tr><th>--login-path</th>
<td>Read login path options from .mylogin.cnf</td>
<td></td>
<td></td>
</tr><tr><th>--medium-check</th>
<td>Do a check that is faster than an --extended operation</td>
<td></td>
<td></td>
</tr><tr><th>--no-defaults</th>
<td>Read no option files</td>
<td></td>
<td></td>
</tr><tr><th>--optimize</th>
<td>Optimize the tables</td>
<td></td>
<td></td>
</tr><tr><th>--password</th>
<td>Password to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th>--pipe</th>
<td>Connect to server using named pipe (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th>--plugin-dir</th>
<td>Directory where plugins are installed</td>
<td></td>
<td></td>
</tr><tr><th>--port</th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr><tr><th>--print-defaults</th>
<td>Print default options</td>
<td></td>
<td></td>
</tr><tr><th>--protocol</th>
<td>Transport protocol to use</td>
<td></td>
<td></td>
</tr><tr><th>--quick</th>
<td>The fastest method of checking</td>
<td></td>
<td></td>
</tr><tr><th>--repair</th>
<td>Perform a repair that can fix almost anything except unique keys that are not unique</td>
<td></td>
<td></td>
</tr><tr><th>--secure-auth</th>
<td>Do not send passwords to server in old (pre-4.1) format</td>
<td></td>
<td>Yes</td>
</tr><tr><th>--server-public-key-path</th>
<td>Path name to file containing RSA public key</td>
<td>5.7.23</td>
<td></td>
</tr><tr><th>--shared-memory-base-name</th>
<td>Shared-memory name for shared-memory connections (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th>--silent</th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr><tr><th>--skip-database</th>
<td>Omit this database from performed operations</td>
<td></td>
<td></td>
</tr><tr><th>--socket</th>
<td>Unix socket file or Windows named pipe to use</td>
<td></td>
<td></td>
</tr><tr><th>--ssl</th>
<td>Enable connection encryption</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-ca</th>
<td>File that contains list of trusted SSL Certificate Authorities</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-capath</th>
<td>Directory that contains trusted SSL Certificate Authority certificate files</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-cert</th>
<td>File that contains X.509 certificate</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-cipher</th>
<td>Permissible ciphers for connection encryption</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-crl</th>
<td>File that contains certificate revocation lists</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-crlpath</th>
<td>Directory that contains certificate revocation-list files</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-key</th>
<td>File that contains X.509 key</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-mode</th>
<td>Desired security state of connection to server</td>
<td>5.7.11</td>
<td></td>
</tr><tr><th>--ssl-verify-server-cert</th>
<td>Verify host name against server certificate Common Name identity</td>
<td></td>
<td></td>
</tr><tr><th>--tables</th>
<td>Overrides the --databases or -B option</td>
<td></td>
<td></td>
</tr><tr><th>--tls-version</th>
<td>Permissible TLS protocols for encrypted connections</td>
<td>5.7.10</td>
<td></td>
</tr><tr><th>--use-frm</th>
<td>For repair operations on MyISAM tables</td>
<td></td>
<td></td>
</tr><tr><th>--user</th>
<td>MySQL user name to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th>--verbose</th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr><tr><th>--version</th>
<td>Display version information and exit</td>
<td></td>
<td></td>
</tr><tr><th>--write-binlog</th>
<td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
<td></td>
<td></td>
</tr></tbody></table>2

  Compress all information sent between the client and the
  server if possible. See
  [Section 4.2.6, “Connection Compression Control”](connection-compression-control.html "4.2.6 Connection Compression Control").

* [`--databases`](mysqlcheck.html#option_mysqlcheck_databases),
  `-B`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th>Option Name</th>
<th>Description</th>
<th>Introduced</th>
<th>Deprecated</th>
</tr></thead><tbody><tr><th>--all-databases</th>
<td>Check all tables in all databases</td>
<td></td>
<td></td>
</tr><tr><th>--all-in-1</th>
<td>Execute a single statement for each database that names all the tables from that database</td>
<td></td>
<td></td>
</tr><tr><th>--analyze</th>
<td>Analyze the tables</td>
<td></td>
<td></td>
</tr><tr><th>--auto-repair</th>
<td>If a checked table is corrupted, automatically fix it</td>
<td></td>
<td></td>
</tr><tr><th>--bind-address</th>
<td>Use specified network interface to connect to MySQL Server</td>
<td></td>
<td></td>
</tr><tr><th>--character-sets-dir</th>
<td>Directory where character sets are installed</td>
<td></td>
<td></td>
</tr><tr><th>--check</th>
<td>Check the tables for errors</td>
<td></td>
<td></td>
</tr><tr><th>--check-only-changed</th>
<td>Check only tables that have changed since the last check</td>
<td></td>
<td></td>
</tr><tr><th>--check-upgrade</th>
<td>Invoke CHECK TABLE with the FOR UPGRADE option</td>
<td></td>
<td></td>
</tr><tr><th>--compress</th>
<td>Compress all information sent between client and server</td>
<td></td>
<td></td>
</tr><tr><th>--databases</th>
<td>Interpret all arguments as database names</td>
<td></td>
<td></td>
</tr><tr><th>--debug</th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr><tr><th>--debug-check</th>
<td>Print debugging information when program exits</td>
<td></td>
<td></td>
</tr><tr><th>--debug-info</th>
<td>Print debugging information, memory, and CPU statistics when program exits</td>
<td></td>
<td></td>
</tr><tr><th>--default-auth</th>
<td>Authentication plugin to use</td>
<td></td>
<td></td>
</tr><tr><th>--default-character-set</th>
<td>Specify default character set</td>
<td></td>
<td></td>
</tr><tr><th>--defaults-extra-file</th>
<td>Read named option file in addition to usual option files</td>
<td></td>
<td></td>
</tr><tr><th>--defaults-file</th>
<td>Read only named option file</td>
<td></td>
<td></td>
</tr><tr><th>--defaults-group-suffix</th>
<td>Option group suffix value</td>
<td></td>
<td></td>
</tr><tr><th>--enable-cleartext-plugin</th>
<td>Enable cleartext authentication plugin</td>
<td>5.7.10</td>
<td></td>
</tr><tr><th>--extended</th>
<td>Check and repair tables</td>
<td></td>
<td></td>
</tr><tr><th>--fast</th>
<td>Check only tables that have not been closed properly</td>
<td></td>
<td></td>
</tr><tr><th>--fix-db-names</th>
<td>Convert database names to 5.1 format</td>
<td></td>
<td>Yes</td>
</tr><tr><th>--fix-table-names</th>
<td>Convert table names to 5.1 format</td>
<td></td>
<td>Yes</td>
</tr><tr><th>--force</th>
<td>Continue even if an SQL error occurs</td>
<td></td>
<td></td>
</tr><tr><th>--get-server-public-key</th>
<td>Request RSA public key from server</td>
<td>5.7.23</td>
<td></td>
</tr><tr><th>--help</th>
<td>Display help message and exit</td>
<td></td>
<td></td>
</tr><tr><th>--host</th>
<td>Host on which MySQL server is located</td>
<td></td>
<td></td>
</tr><tr><th>--login-path</th>
<td>Read login path options from .mylogin.cnf</td>
<td></td>
<td></td>
</tr><tr><th>--medium-check</th>
<td>Do a check that is faster than an --extended operation</td>
<td></td>
<td></td>
</tr><tr><th>--no-defaults</th>
<td>Read no option files</td>
<td></td>
<td></td>
</tr><tr><th>--optimize</th>
<td>Optimize the tables</td>
<td></td>
<td></td>
</tr><tr><th>--password</th>
<td>Password to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th>--pipe</th>
<td>Connect to server using named pipe (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th>--plugin-dir</th>
<td>Directory where plugins are installed</td>
<td></td>
<td></td>
</tr><tr><th>--port</th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr><tr><th>--print-defaults</th>
<td>Print default options</td>
<td></td>
<td></td>
</tr><tr><th>--protocol</th>
<td>Transport protocol to use</td>
<td></td>
<td></td>
</tr><tr><th>--quick</th>
<td>The fastest method of checking</td>
<td></td>
<td></td>
</tr><tr><th>--repair</th>
<td>Perform a repair that can fix almost anything except unique keys that are not unique</td>
<td></td>
<td></td>
</tr><tr><th>--secure-auth</th>
<td>Do not send passwords to server in old (pre-4.1) format</td>
<td></td>
<td>Yes</td>
</tr><tr><th>--server-public-key-path</th>
<td>Path name to file containing RSA public key</td>
<td>5.7.23</td>
<td></td>
</tr><tr><th>--shared-memory-base-name</th>
<td>Shared-memory name for shared-memory connections (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th>--silent</th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr><tr><th>--skip-database</th>
<td>Omit this database from performed operations</td>
<td></td>
<td></td>
</tr><tr><th>--socket</th>
<td>Unix socket file or Windows named pipe to use</td>
<td></td>
<td></td>
</tr><tr><th>--ssl</th>
<td>Enable connection encryption</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-ca</th>
<td>File that contains list of trusted SSL Certificate Authorities</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-capath</th>
<td>Directory that contains trusted SSL Certificate Authority certificate files</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-cert</th>
<td>File that contains X.509 certificate</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-cipher</th>
<td>Permissible ciphers for connection encryption</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-crl</th>
<td>File that contains certificate revocation lists</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-crlpath</th>
<td>Directory that contains certificate revocation-list files</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-key</th>
<td>File that contains X.509 key</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-mode</th>
<td>Desired security state of connection to server</td>
<td>5.7.11</td>
<td></td>
</tr><tr><th>--ssl-verify-server-cert</th>
<td>Verify host name against server certificate Common Name identity</td>
<td></td>
<td></td>
</tr><tr><th>--tables</th>
<td>Overrides the --databases or -B option</td>
<td></td>
<td></td>
</tr><tr><th>--tls-version</th>
<td>Permissible TLS protocols for encrypted connections</td>
<td>5.7.10</td>
<td></td>
</tr><tr><th>--use-frm</th>
<td>For repair operations on MyISAM tables</td>
<td></td>
<td></td>
</tr><tr><th>--user</th>
<td>MySQL user name to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th>--verbose</th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr><tr><th>--version</th>
<td>Display version information and exit</td>
<td></td>
<td></td>
</tr><tr><th>--write-binlog</th>
<td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
<td></td>
<td></td>
</tr></tbody></table>3

  Process all tables in the named databases. Normally,
  [**mysqlcheck**](mysqlcheck.html "4.5.3 mysqlcheck — A Table Maintenance Program") treats the first name argument
  on the command line as a database name and any following
  names as table names. With this option, it treats all name
  arguments as database names.

* [`--debug[=debug_options]`](mysqlcheck.html#option_mysqlcheck_debug),
  `-#
  [debug_options]`

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th>Option Name</th>
<th>Description</th>
<th>Introduced</th>
<th>Deprecated</th>
</tr></thead><tbody><tr><th>--all-databases</th>
<td>Check all tables in all databases</td>
<td></td>
<td></td>
</tr><tr><th>--all-in-1</th>
<td>Execute a single statement for each database that names all the tables from that database</td>
<td></td>
<td></td>
</tr><tr><th>--analyze</th>
<td>Analyze the tables</td>
<td></td>
<td></td>
</tr><tr><th>--auto-repair</th>
<td>If a checked table is corrupted, automatically fix it</td>
<td></td>
<td></td>
</tr><tr><th>--bind-address</th>
<td>Use specified network interface to connect to MySQL Server</td>
<td></td>
<td></td>
</tr><tr><th>--character-sets-dir</th>
<td>Directory where character sets are installed</td>
<td></td>
<td></td>
</tr><tr><th>--check</th>
<td>Check the tables for errors</td>
<td></td>
<td></td>
</tr><tr><th>--check-only-changed</th>
<td>Check only tables that have changed since the last check</td>
<td></td>
<td></td>
</tr><tr><th>--check-upgrade</th>
<td>Invoke CHECK TABLE with the FOR UPGRADE option</td>
<td></td>
<td></td>
</tr><tr><th>--compress</th>
<td>Compress all information sent between client and server</td>
<td></td>
<td></td>
</tr><tr><th>--databases</th>
<td>Interpret all arguments as database names</td>
<td></td>
<td></td>
</tr><tr><th>--debug</th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr><tr><th>--debug-check</th>
<td>Print debugging information when program exits</td>
<td></td>
<td></td>
</tr><tr><th>--debug-info</th>
<td>Print debugging information, memory, and CPU statistics when program exits</td>
<td></td>
<td></td>
</tr><tr><th>--default-auth</th>
<td>Authentication plugin to use</td>
<td></td>
<td></td>
</tr><tr><th>--default-character-set</th>
<td>Specify default character set</td>
<td></td>
<td></td>
</tr><tr><th>--defaults-extra-file</th>
<td>Read named option file in addition to usual option files</td>
<td></td>
<td></td>
</tr><tr><th>--defaults-file</th>
<td>Read only named option file</td>
<td></td>
<td></td>
</tr><tr><th>--defaults-group-suffix</th>
<td>Option group suffix value</td>
<td></td>
<td></td>
</tr><tr><th>--enable-cleartext-plugin</th>
<td>Enable cleartext authentication plugin</td>
<td>5.7.10</td>
<td></td>
</tr><tr><th>--extended</th>
<td>Check and repair tables</td>
<td></td>
<td></td>
</tr><tr><th>--fast</th>
<td>Check only tables that have not been closed properly</td>
<td></td>
<td></td>
</tr><tr><th>--fix-db-names</th>
<td>Convert database names to 5.1 format</td>
<td></td>
<td>Yes</td>
</tr><tr><th>--fix-table-names</th>
<td>Convert table names to 5.1 format</td>
<td></td>
<td>Yes</td>
</tr><tr><th>--force</th>
<td>Continue even if an SQL error occurs</td>
<td></td>
<td></td>
</tr><tr><th>--get-server-public-key</th>
<td>Request RSA public key from server</td>
<td>5.7.23</td>
<td></td>
</tr><tr><th>--help</th>
<td>Display help message and exit</td>
<td></td>
<td></td>
</tr><tr><th>--host</th>
<td>Host on which MySQL server is located</td>
<td></td>
<td></td>
</tr><tr><th>--login-path</th>
<td>Read login path options from .mylogin.cnf</td>
<td></td>
<td></td>
</tr><tr><th>--medium-check</th>
<td>Do a check that is faster than an --extended operation</td>
<td></td>
<td></td>
</tr><tr><th>--no-defaults</th>
<td>Read no option files</td>
<td></td>
<td></td>
</tr><tr><th>--optimize</th>
<td>Optimize the tables</td>
<td></td>
<td></td>
</tr><tr><th>--password</th>
<td>Password to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th>--pipe</th>
<td>Connect to server using named pipe (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th>--plugin-dir</th>
<td>Directory where plugins are installed</td>
<td></td>
<td></td>
</tr><tr><th>--port</th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr><tr><th>--print-defaults</th>
<td>Print default options</td>
<td></td>
<td></td>
</tr><tr><th>--protocol</th>
<td>Transport protocol to use</td>
<td></td>
<td></td>
</tr><tr><th>--quick</th>
<td>The fastest method of checking</td>
<td></td>
<td></td>
</tr><tr><th>--repair</th>
<td>Perform a repair that can fix almost anything except unique keys that are not unique</td>
<td></td>
<td></td>
</tr><tr><th>--secure-auth</th>
<td>Do not send passwords to server in old (pre-4.1) format</td>
<td></td>
<td>Yes</td>
</tr><tr><th>--server-public-key-path</th>
<td>Path name to file containing RSA public key</td>
<td>5.7.23</td>
<td></td>
</tr><tr><th>--shared-memory-base-name</th>
<td>Shared-memory name for shared-memory connections (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th>--silent</th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr><tr><th>--skip-database</th>
<td>Omit this database from performed operations</td>
<td></td>
<td></td>
</tr><tr><th>--socket</th>
<td>Unix socket file or Windows named pipe to use</td>
<td></td>
<td></td>
</tr><tr><th>--ssl</th>
<td>Enable connection encryption</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-ca</th>
<td>File that contains list of trusted SSL Certificate Authorities</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-capath</th>
<td>Directory that contains trusted SSL Certificate Authority certificate files</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-cert</th>
<td>File that contains X.509 certificate</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-cipher</th>
<td>Permissible ciphers for connection encryption</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-crl</th>
<td>File that contains certificate revocation lists</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-crlpath</th>
<td>Directory that contains certificate revocation-list files</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-key</th>
<td>File that contains X.509 key</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-mode</th>
<td>Desired security state of connection to server</td>
<td>5.7.11</td>
<td></td>
</tr><tr><th>--ssl-verify-server-cert</th>
<td>Verify host name against server certificate Common Name identity</td>
<td></td>
<td></td>
</tr><tr><th>--tables</th>
<td>Overrides the --databases or -B option</td>
<td></td>
<td></td>
</tr><tr><th>--tls-version</th>
<td>Permissible TLS protocols for encrypted connections</td>
<td>5.7.10</td>
<td></td>
</tr><tr><th>--use-frm</th>
<td>For repair operations on MyISAM tables</td>
<td></td>
<td></td>
</tr><tr><th>--user</th>
<td>MySQL user name to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th>--verbose</th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr><tr><th>--version</th>
<td>Display version information and exit</td>
<td></td>
<td></td>
</tr><tr><th>--write-binlog</th>
<td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
<td></td>
<td></td>
</tr></tbody></table>4

  Write a debugging log. A typical
  *`debug_options`* string is
  `d:t:o,file_name`.
  The default is `d:t:o`.

  This option is available only if MySQL was built using
  [`WITH_DEBUG`](source-configuration-options.html#option_cmake_with_debug). MySQL release
  binaries provided by Oracle are *not*
  built using this option.

* [`--debug-check`](mysqlcheck.html#option_mysqlcheck_debug-check)

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th>Option Name</th>
<th>Description</th>
<th>Introduced</th>
<th>Deprecated</th>
</tr></thead><tbody><tr><th>--all-databases</th>
<td>Check all tables in all databases</td>
<td></td>
<td></td>
</tr><tr><th>--all-in-1</th>
<td>Execute a single statement for each database that names all the tables from that database</td>
<td></td>
<td></td>
</tr><tr><th>--analyze</th>
<td>Analyze the tables</td>
<td></td>
<td></td>
</tr><tr><th>--auto-repair</th>
<td>If a checked table is corrupted, automatically fix it</td>
<td></td>
<td></td>
</tr><tr><th>--bind-address</th>
<td>Use specified network interface to connect to MySQL Server</td>
<td></td>
<td></td>
</tr><tr><th>--character-sets-dir</th>
<td>Directory where character sets are installed</td>
<td></td>
<td></td>
</tr><tr><th>--check</th>
<td>Check the tables for errors</td>
<td></td>
<td></td>
</tr><tr><th>--check-only-changed</th>
<td>Check only tables that have changed since the last check</td>
<td></td>
<td></td>
</tr><tr><th>--check-upgrade</th>
<td>Invoke CHECK TABLE with the FOR UPGRADE option</td>
<td></td>
<td></td>
</tr><tr><th>--compress</th>
<td>Compress all information sent between client and server</td>
<td></td>
<td></td>
</tr><tr><th>--databases</th>
<td>Interpret all arguments as database names</td>
<td></td>
<td></td>
</tr><tr><th>--debug</th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr><tr><th>--debug-check</th>
<td>Print debugging information when program exits</td>
<td></td>
<td></td>
</tr><tr><th>--debug-info</th>
<td>Print debugging information, memory, and CPU statistics when program exits</td>
<td></td>
<td></td>
</tr><tr><th>--default-auth</th>
<td>Authentication plugin to use</td>
<td></td>
<td></td>
</tr><tr><th>--default-character-set</th>
<td>Specify default character set</td>
<td></td>
<td></td>
</tr><tr><th>--defaults-extra-file</th>
<td>Read named option file in addition to usual option files</td>
<td></td>
<td></td>
</tr><tr><th>--defaults-file</th>
<td>Read only named option file</td>
<td></td>
<td></td>
</tr><tr><th>--defaults-group-suffix</th>
<td>Option group suffix value</td>
<td></td>
<td></td>
</tr><tr><th>--enable-cleartext-plugin</th>
<td>Enable cleartext authentication plugin</td>
<td>5.7.10</td>
<td></td>
</tr><tr><th>--extended</th>
<td>Check and repair tables</td>
<td></td>
<td></td>
</tr><tr><th>--fast</th>
<td>Check only tables that have not been closed properly</td>
<td></td>
<td></td>
</tr><tr><th>--fix-db-names</th>
<td>Convert database names to 5.1 format</td>
<td></td>
<td>Yes</td>
</tr><tr><th>--fix-table-names</th>
<td>Convert table names to 5.1 format</td>
<td></td>
<td>Yes</td>
</tr><tr><th>--force</th>
<td>Continue even if an SQL error occurs</td>
<td></td>
<td></td>
</tr><tr><th>--get-server-public-key</th>
<td>Request RSA public key from server</td>
<td>5.7.23</td>
<td></td>
</tr><tr><th>--help</th>
<td>Display help message and exit</td>
<td></td>
<td></td>
</tr><tr><th>--host</th>
<td>Host on which MySQL server is located</td>
<td></td>
<td></td>
</tr><tr><th>--login-path</th>
<td>Read login path options from .mylogin.cnf</td>
<td></td>
<td></td>
</tr><tr><th>--medium-check</th>
<td>Do a check that is faster than an --extended operation</td>
<td></td>
<td></td>
</tr><tr><th>--no-defaults</th>
<td>Read no option files</td>
<td></td>
<td></td>
</tr><tr><th>--optimize</th>
<td>Optimize the tables</td>
<td></td>
<td></td>
</tr><tr><th>--password</th>
<td>Password to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th>--pipe</th>
<td>Connect to server using named pipe (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th>--plugin-dir</th>
<td>Directory where plugins are installed</td>
<td></td>
<td></td>
</tr><tr><th>--port</th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr><tr><th>--print-defaults</th>
<td>Print default options</td>
<td></td>
<td></td>
</tr><tr><th>--protocol</th>
<td>Transport protocol to use</td>
<td></td>
<td></td>
</tr><tr><th>--quick</th>
<td>The fastest method of checking</td>
<td></td>
<td></td>
</tr><tr><th>--repair</th>
<td>Perform a repair that can fix almost anything except unique keys that are not unique</td>
<td></td>
<td></td>
</tr><tr><th>--secure-auth</th>
<td>Do not send passwords to server in old (pre-4.1) format</td>
<td></td>
<td>Yes</td>
</tr><tr><th>--server-public-key-path</th>
<td>Path name to file containing RSA public key</td>
<td>5.7.23</td>
<td></td>
</tr><tr><th>--shared-memory-base-name</th>
<td>Shared-memory name for shared-memory connections (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th>--silent</th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr><tr><th>--skip-database</th>
<td>Omit this database from performed operations</td>
<td></td>
<td></td>
</tr><tr><th>--socket</th>
<td>Unix socket file or Windows named pipe to use</td>
<td></td>
<td></td>
</tr><tr><th>--ssl</th>
<td>Enable connection encryption</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-ca</th>
<td>File that contains list of trusted SSL Certificate Authorities</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-capath</th>
<td>Directory that contains trusted SSL Certificate Authority certificate files</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-cert</th>
<td>File that contains X.509 certificate</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-cipher</th>
<td>Permissible ciphers for connection encryption</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-crl</th>
<td>File that contains certificate revocation lists</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-crlpath</th>
<td>Directory that contains certificate revocation-list files</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-key</th>
<td>File that contains X.509 key</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-mode</th>
<td>Desired security state of connection to server</td>
<td>5.7.11</td>
<td></td>
</tr><tr><th>--ssl-verify-server-cert</th>
<td>Verify host name against server certificate Common Name identity</td>
<td></td>
<td></td>
</tr><tr><th>--tables</th>
<td>Overrides the --databases or -B option</td>
<td></td>
<td></td>
</tr><tr><th>--tls-version</th>
<td>Permissible TLS protocols for encrypted connections</td>
<td>5.7.10</td>
<td></td>
</tr><tr><th>--use-frm</th>
<td>For repair operations on MyISAM tables</td>
<td></td>
<td></td>
</tr><tr><th>--user</th>
<td>MySQL user name to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th>--verbose</th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr><tr><th>--version</th>
<td>Display version information and exit</td>
<td></td>
<td></td>
</tr><tr><th>--write-binlog</th>
<td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
<td></td>
<td></td>
</tr></tbody></table>5

  Print some debugging information when the program exits.

  This option is available only if MySQL was built using
  [`WITH_DEBUG`](source-configuration-options.html#option_cmake_with_debug). MySQL release
  binaries provided by Oracle are *not*
  built using this option.

* [`--debug-info`](mysqlcheck.html#option_mysqlcheck_debug-info)

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th>Option Name</th>
<th>Description</th>
<th>Introduced</th>
<th>Deprecated</th>
</tr></thead><tbody><tr><th>--all-databases</th>
<td>Check all tables in all databases</td>
<td></td>
<td></td>
</tr><tr><th>--all-in-1</th>
<td>Execute a single statement for each database that names all the tables from that database</td>
<td></td>
<td></td>
</tr><tr><th>--analyze</th>
<td>Analyze the tables</td>
<td></td>
<td></td>
</tr><tr><th>--auto-repair</th>
<td>If a checked table is corrupted, automatically fix it</td>
<td></td>
<td></td>
</tr><tr><th>--bind-address</th>
<td>Use specified network interface to connect to MySQL Server</td>
<td></td>
<td></td>
</tr><tr><th>--character-sets-dir</th>
<td>Directory where character sets are installed</td>
<td></td>
<td></td>
</tr><tr><th>--check</th>
<td>Check the tables for errors</td>
<td></td>
<td></td>
</tr><tr><th>--check-only-changed</th>
<td>Check only tables that have changed since the last check</td>
<td></td>
<td></td>
</tr><tr><th>--check-upgrade</th>
<td>Invoke CHECK TABLE with the FOR UPGRADE option</td>
<td></td>
<td></td>
</tr><tr><th>--compress</th>
<td>Compress all information sent between client and server</td>
<td></td>
<td></td>
</tr><tr><th>--databases</th>
<td>Interpret all arguments as database names</td>
<td></td>
<td></td>
</tr><tr><th>--debug</th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr><tr><th>--debug-check</th>
<td>Print debugging information when program exits</td>
<td></td>
<td></td>
</tr><tr><th>--debug-info</th>
<td>Print debugging information, memory, and CPU statistics when program exits</td>
<td></td>
<td></td>
</tr><tr><th>--default-auth</th>
<td>Authentication plugin to use</td>
<td></td>
<td></td>
</tr><tr><th>--default-character-set</th>
<td>Specify default character set</td>
<td></td>
<td></td>
</tr><tr><th>--defaults-extra-file</th>
<td>Read named option file in addition to usual option files</td>
<td></td>
<td></td>
</tr><tr><th>--defaults-file</th>
<td>Read only named option file</td>
<td></td>
<td></td>
</tr><tr><th>--defaults-group-suffix</th>
<td>Option group suffix value</td>
<td></td>
<td></td>
</tr><tr><th>--enable-cleartext-plugin</th>
<td>Enable cleartext authentication plugin</td>
<td>5.7.10</td>
<td></td>
</tr><tr><th>--extended</th>
<td>Check and repair tables</td>
<td></td>
<td></td>
</tr><tr><th>--fast</th>
<td>Check only tables that have not been closed properly</td>
<td></td>
<td></td>
</tr><tr><th>--fix-db-names</th>
<td>Convert database names to 5.1 format</td>
<td></td>
<td>Yes</td>
</tr><tr><th>--fix-table-names</th>
<td>Convert table names to 5.1 format</td>
<td></td>
<td>Yes</td>
</tr><tr><th>--force</th>
<td>Continue even if an SQL error occurs</td>
<td></td>
<td></td>
</tr><tr><th>--get-server-public-key</th>
<td>Request RSA public key from server</td>
<td>5.7.23</td>
<td></td>
</tr><tr><th>--help</th>
<td>Display help message and exit</td>
<td></td>
<td></td>
</tr><tr><th>--host</th>
<td>Host on which MySQL server is located</td>
<td></td>
<td></td>
</tr><tr><th>--login-path</th>
<td>Read login path options from .mylogin.cnf</td>
<td></td>
<td></td>
</tr><tr><th>--medium-check</th>
<td>Do a check that is faster than an --extended operation</td>
<td></td>
<td></td>
</tr><tr><th>--no-defaults</th>
<td>Read no option files</td>
<td></td>
<td></td>
</tr><tr><th>--optimize</th>
<td>Optimize the tables</td>
<td></td>
<td></td>
</tr><tr><th>--password</th>
<td>Password to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th>--pipe</th>
<td>Connect to server using named pipe (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th>--plugin-dir</th>
<td>Directory where plugins are installed</td>
<td></td>
<td></td>
</tr><tr><th>--port</th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr><tr><th>--print-defaults</th>
<td>Print default options</td>
<td></td>
<td></td>
</tr><tr><th>--protocol</th>
<td>Transport protocol to use</td>
<td></td>
<td></td>
</tr><tr><th>--quick</th>
<td>The fastest method of checking</td>
<td></td>
<td></td>
</tr><tr><th>--repair</th>
<td>Perform a repair that can fix almost anything except unique keys that are not unique</td>
<td></td>
<td></td>
</tr><tr><th>--secure-auth</th>
<td>Do not send passwords to server in old (pre-4.1) format</td>
<td></td>
<td>Yes</td>
</tr><tr><th>--server-public-key-path</th>
<td>Path name to file containing RSA public key</td>
<td>5.7.23</td>
<td></td>
</tr><tr><th>--shared-memory-base-name</th>
<td>Shared-memory name for shared-memory connections (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th>--silent</th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr><tr><th>--skip-database</th>
<td>Omit this database from performed operations</td>
<td></td>
<td></td>
</tr><tr><th>--socket</th>
<td>Unix socket file or Windows named pipe to use</td>
<td></td>
<td></td>
</tr><tr><th>--ssl</th>
<td>Enable connection encryption</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-ca</th>
<td>File that contains list of trusted SSL Certificate Authorities</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-capath</th>
<td>Directory that contains trusted SSL Certificate Authority certificate files</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-cert</th>
<td>File that contains X.509 certificate</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-cipher</th>
<td>Permissible ciphers for connection encryption</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-crl</th>
<td>File that contains certificate revocation lists</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-crlpath</th>
<td>Directory that contains certificate revocation-list files</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-key</th>
<td>File that contains X.509 key</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-mode</th>
<td>Desired security state of connection to server</td>
<td>5.7.11</td>
<td></td>
</tr><tr><th>--ssl-verify-server-cert</th>
<td>Verify host name against server certificate Common Name identity</td>
<td></td>
<td></td>
</tr><tr><th>--tables</th>
<td>Overrides the --databases or -B option</td>
<td></td>
<td></td>
</tr><tr><th>--tls-version</th>
<td>Permissible TLS protocols for encrypted connections</td>
<td>5.7.10</td>
<td></td>
</tr><tr><th>--use-frm</th>
<td>For repair operations on MyISAM tables</td>
<td></td>
<td></td>
</tr><tr><th>--user</th>
<td>MySQL user name to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th>--verbose</th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr><tr><th>--version</th>
<td>Display version information and exit</td>
<td></td>
<td></td>
</tr><tr><th>--write-binlog</th>
<td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
<td></td>
<td></td>
</tr></tbody></table>6

  Print debugging information and memory and CPU usage
  statistics when the program exits.

  This option is available only if MySQL was built using
  [`WITH_DEBUG`](source-configuration-options.html#option_cmake_with_debug). MySQL release
  binaries provided by Oracle are *not*
  built using this option.

* [`--default-character-set=charset_name`](mysqlcheck.html#option_mysqlcheck_default-character-set)

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th>Option Name</th>
<th>Description</th>
<th>Introduced</th>
<th>Deprecated</th>
</tr></thead><tbody><tr><th>--all-databases</th>
<td>Check all tables in all databases</td>
<td></td>
<td></td>
</tr><tr><th>--all-in-1</th>
<td>Execute a single statement for each database that names all the tables from that database</td>
<td></td>
<td></td>
</tr><tr><th>--analyze</th>
<td>Analyze the tables</td>
<td></td>
<td></td>
</tr><tr><th>--auto-repair</th>
<td>If a checked table is corrupted, automatically fix it</td>
<td></td>
<td></td>
</tr><tr><th>--bind-address</th>
<td>Use specified network interface to connect to MySQL Server</td>
<td></td>
<td></td>
</tr><tr><th>--character-sets-dir</th>
<td>Directory where character sets are installed</td>
<td></td>
<td></td>
</tr><tr><th>--check</th>
<td>Check the tables for errors</td>
<td></td>
<td></td>
</tr><tr><th>--check-only-changed</th>
<td>Check only tables that have changed since the last check</td>
<td></td>
<td></td>
</tr><tr><th>--check-upgrade</th>
<td>Invoke CHECK TABLE with the FOR UPGRADE option</td>
<td></td>
<td></td>
</tr><tr><th>--compress</th>
<td>Compress all information sent between client and server</td>
<td></td>
<td></td>
</tr><tr><th>--databases</th>
<td>Interpret all arguments as database names</td>
<td></td>
<td></td>
</tr><tr><th>--debug</th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr><tr><th>--debug-check</th>
<td>Print debugging information when program exits</td>
<td></td>
<td></td>
</tr><tr><th>--debug-info</th>
<td>Print debugging information, memory, and CPU statistics when program exits</td>
<td></td>
<td></td>
</tr><tr><th>--default-auth</th>
<td>Authentication plugin to use</td>
<td></td>
<td></td>
</tr><tr><th>--default-character-set</th>
<td>Specify default character set</td>
<td></td>
<td></td>
</tr><tr><th>--defaults-extra-file</th>
<td>Read named option file in addition to usual option files</td>
<td></td>
<td></td>
</tr><tr><th>--defaults-file</th>
<td>Read only named option file</td>
<td></td>
<td></td>
</tr><tr><th>--defaults-group-suffix</th>
<td>Option group suffix value</td>
<td></td>
<td></td>
</tr><tr><th>--enable-cleartext-plugin</th>
<td>Enable cleartext authentication plugin</td>
<td>5.7.10</td>
<td></td>
</tr><tr><th>--extended</th>
<td>Check and repair tables</td>
<td></td>
<td></td>
</tr><tr><th>--fast</th>
<td>Check only tables that have not been closed properly</td>
<td></td>
<td></td>
</tr><tr><th>--fix-db-names</th>
<td>Convert database names to 5.1 format</td>
<td></td>
<td>Yes</td>
</tr><tr><th>--fix-table-names</th>
<td>Convert table names to 5.1 format</td>
<td></td>
<td>Yes</td>
</tr><tr><th>--force</th>
<td>Continue even if an SQL error occurs</td>
<td></td>
<td></td>
</tr><tr><th>--get-server-public-key</th>
<td>Request RSA public key from server</td>
<td>5.7.23</td>
<td></td>
</tr><tr><th>--help</th>
<td>Display help message and exit</td>
<td></td>
<td></td>
</tr><tr><th>--host</th>
<td>Host on which MySQL server is located</td>
<td></td>
<td></td>
</tr><tr><th>--login-path</th>
<td>Read login path options from .mylogin.cnf</td>
<td></td>
<td></td>
</tr><tr><th>--medium-check</th>
<td>Do a check that is faster than an --extended operation</td>
<td></td>
<td></td>
</tr><tr><th>--no-defaults</th>
<td>Read no option files</td>
<td></td>
<td></td>
</tr><tr><th>--optimize</th>
<td>Optimize the tables</td>
<td></td>
<td></td>
</tr><tr><th>--password</th>
<td>Password to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th>--pipe</th>
<td>Connect to server using named pipe (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th>--plugin-dir</th>
<td>Directory where plugins are installed</td>
<td></td>
<td></td>
</tr><tr><th>--port</th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr><tr><th>--print-defaults</th>
<td>Print default options</td>
<td></td>
<td></td>
</tr><tr><th>--protocol</th>
<td>Transport protocol to use</td>
<td></td>
<td></td>
</tr><tr><th>--quick</th>
<td>The fastest method of checking</td>
<td></td>
<td></td>
</tr><tr><th>--repair</th>
<td>Perform a repair that can fix almost anything except unique keys that are not unique</td>
<td></td>
<td></td>
</tr><tr><th>--secure-auth</th>
<td>Do not send passwords to server in old (pre-4.1) format</td>
<td></td>
<td>Yes</td>
</tr><tr><th>--server-public-key-path</th>
<td>Path name to file containing RSA public key</td>
<td>5.7.23</td>
<td></td>
</tr><tr><th>--shared-memory-base-name</th>
<td>Shared-memory name for shared-memory connections (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th>--silent</th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr><tr><th>--skip-database</th>
<td>Omit this database from performed operations</td>
<td></td>
<td></td>
</tr><tr><th>--socket</th>
<td>Unix socket file or Windows named pipe to use</td>
<td></td>
<td></td>
</tr><tr><th>--ssl</th>
<td>Enable connection encryption</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-ca</th>
<td>File that contains list of trusted SSL Certificate Authorities</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-capath</th>
<td>Directory that contains trusted SSL Certificate Authority certificate files</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-cert</th>
<td>File that contains X.509 certificate</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-cipher</th>
<td>Permissible ciphers for connection encryption</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-crl</th>
<td>File that contains certificate revocation lists</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-crlpath</th>
<td>Directory that contains certificate revocation-list files</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-key</th>
<td>File that contains X.509 key</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-mode</th>
<td>Desired security state of connection to server</td>
<td>5.7.11</td>
<td></td>
</tr><tr><th>--ssl-verify-server-cert</th>
<td>Verify host name against server certificate Common Name identity</td>
<td></td>
<td></td>
</tr><tr><th>--tables</th>
<td>Overrides the --databases or -B option</td>
<td></td>
<td></td>
</tr><tr><th>--tls-version</th>
<td>Permissible TLS protocols for encrypted connections</td>
<td>5.7.10</td>
<td></td>
</tr><tr><th>--use-frm</th>
<td>For repair operations on MyISAM tables</td>
<td></td>
<td></td>
</tr><tr><th>--user</th>
<td>MySQL user name to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th>--verbose</th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr><tr><th>--version</th>
<td>Display version information and exit</td>
<td></td>
<td></td>
</tr><tr><th>--write-binlog</th>
<td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
<td></td>
<td></td>
</tr></tbody></table>7

  Use *`charset_name`* as the default
  character set. See [Section 10.15, “Character Set Configuration”](charset-configuration.html "10.15 Character Set Configuration").

* [`--defaults-extra-file=file_name`](mysqlcheck.html#option_mysqlcheck_defaults-extra-file)

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th>Option Name</th>
<th>Description</th>
<th>Introduced</th>
<th>Deprecated</th>
</tr></thead><tbody><tr><th>--all-databases</th>
<td>Check all tables in all databases</td>
<td></td>
<td></td>
</tr><tr><th>--all-in-1</th>
<td>Execute a single statement for each database that names all the tables from that database</td>
<td></td>
<td></td>
</tr><tr><th>--analyze</th>
<td>Analyze the tables</td>
<td></td>
<td></td>
</tr><tr><th>--auto-repair</th>
<td>If a checked table is corrupted, automatically fix it</td>
<td></td>
<td></td>
</tr><tr><th>--bind-address</th>
<td>Use specified network interface to connect to MySQL Server</td>
<td></td>
<td></td>
</tr><tr><th>--character-sets-dir</th>
<td>Directory where character sets are installed</td>
<td></td>
<td></td>
</tr><tr><th>--check</th>
<td>Check the tables for errors</td>
<td></td>
<td></td>
</tr><tr><th>--check-only-changed</th>
<td>Check only tables that have changed since the last check</td>
<td></td>
<td></td>
</tr><tr><th>--check-upgrade</th>
<td>Invoke CHECK TABLE with the FOR UPGRADE option</td>
<td></td>
<td></td>
</tr><tr><th>--compress</th>
<td>Compress all information sent between client and server</td>
<td></td>
<td></td>
</tr><tr><th>--databases</th>
<td>Interpret all arguments as database names</td>
<td></td>
<td></td>
</tr><tr><th>--debug</th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr><tr><th>--debug-check</th>
<td>Print debugging information when program exits</td>
<td></td>
<td></td>
</tr><tr><th>--debug-info</th>
<td>Print debugging information, memory, and CPU statistics when program exits</td>
<td></td>
<td></td>
</tr><tr><th>--default-auth</th>
<td>Authentication plugin to use</td>
<td></td>
<td></td>
</tr><tr><th>--default-character-set</th>
<td>Specify default character set</td>
<td></td>
<td></td>
</tr><tr><th>--defaults-extra-file</th>
<td>Read named option file in addition to usual option files</td>
<td></td>
<td></td>
</tr><tr><th>--defaults-file</th>
<td>Read only named option file</td>
<td></td>
<td></td>
</tr><tr><th>--defaults-group-suffix</th>
<td>Option group suffix value</td>
<td></td>
<td></td>
</tr><tr><th>--enable-cleartext-plugin</th>
<td>Enable cleartext authentication plugin</td>
<td>5.7.10</td>
<td></td>
</tr><tr><th>--extended</th>
<td>Check and repair tables</td>
<td></td>
<td></td>
</tr><tr><th>--fast</th>
<td>Check only tables that have not been closed properly</td>
<td></td>
<td></td>
</tr><tr><th>--fix-db-names</th>
<td>Convert database names to 5.1 format</td>
<td></td>
<td>Yes</td>
</tr><tr><th>--fix-table-names</th>
<td>Convert table names to 5.1 format</td>
<td></td>
<td>Yes</td>
</tr><tr><th>--force</th>
<td>Continue even if an SQL error occurs</td>
<td></td>
<td></td>
</tr><tr><th>--get-server-public-key</th>
<td>Request RSA public key from server</td>
<td>5.7.23</td>
<td></td>
</tr><tr><th>--help</th>
<td>Display help message and exit</td>
<td></td>
<td></td>
</tr><tr><th>--host</th>
<td>Host on which MySQL server is located</td>
<td></td>
<td></td>
</tr><tr><th>--login-path</th>
<td>Read login path options from .mylogin.cnf</td>
<td></td>
<td></td>
</tr><tr><th>--medium-check</th>
<td>Do a check that is faster than an --extended operation</td>
<td></td>
<td></td>
</tr><tr><th>--no-defaults</th>
<td>Read no option files</td>
<td></td>
<td></td>
</tr><tr><th>--optimize</th>
<td>Optimize the tables</td>
<td></td>
<td></td>
</tr><tr><th>--password</th>
<td>Password to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th>--pipe</th>
<td>Connect to server using named pipe (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th>--plugin-dir</th>
<td>Directory where plugins are installed</td>
<td></td>
<td></td>
</tr><tr><th>--port</th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr><tr><th>--print-defaults</th>
<td>Print default options</td>
<td></td>
<td></td>
</tr><tr><th>--protocol</th>
<td>Transport protocol to use</td>
<td></td>
<td></td>
</tr><tr><th>--quick</th>
<td>The fastest method of checking</td>
<td></td>
<td></td>
</tr><tr><th>--repair</th>
<td>Perform a repair that can fix almost anything except unique keys that are not unique</td>
<td></td>
<td></td>
</tr><tr><th>--secure-auth</th>
<td>Do not send passwords to server in old (pre-4.1) format</td>
<td></td>
<td>Yes</td>
</tr><tr><th>--server-public-key-path</th>
<td>Path name to file containing RSA public key</td>
<td>5.7.23</td>
<td></td>
</tr><tr><th>--shared-memory-base-name</th>
<td>Shared-memory name for shared-memory connections (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th>--silent</th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr><tr><th>--skip-database</th>
<td>Omit this database from performed operations</td>
<td></td>
<td></td>
</tr><tr><th>--socket</th>
<td>Unix socket file or Windows named pipe to use</td>
<td></td>
<td></td>
</tr><tr><th>--ssl</th>
<td>Enable connection encryption</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-ca</th>
<td>File that contains list of trusted SSL Certificate Authorities</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-capath</th>
<td>Directory that contains trusted SSL Certificate Authority certificate files</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-cert</th>
<td>File that contains X.509 certificate</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-cipher</th>
<td>Permissible ciphers for connection encryption</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-crl</th>
<td>File that contains certificate revocation lists</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-crlpath</th>
<td>Directory that contains certificate revocation-list files</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-key</th>
<td>File that contains X.509 key</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-mode</th>
<td>Desired security state of connection to server</td>
<td>5.7.11</td>
<td></td>
</tr><tr><th>--ssl-verify-server-cert</th>
<td>Verify host name against server certificate Common Name identity</td>
<td></td>
<td></td>
</tr><tr><th>--tables</th>
<td>Overrides the --databases or -B option</td>
<td></td>
<td></td>
</tr><tr><th>--tls-version</th>
<td>Permissible TLS protocols for encrypted connections</td>
<td>5.7.10</td>
<td></td>
</tr><tr><th>--use-frm</th>
<td>For repair operations on MyISAM tables</td>
<td></td>
<td></td>
</tr><tr><th>--user</th>
<td>MySQL user name to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th>--verbose</th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr><tr><th>--version</th>
<td>Display version information and exit</td>
<td></td>
<td></td>
</tr><tr><th>--write-binlog</th>
<td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
<td></td>
<td></td>
</tr></tbody></table>8

  Read this option file after the global option file but (on
  Unix) before the user option file. If the file does not
  exist or is otherwise inaccessible, an error occurs. If
  *`file_name`* is not an absolute path
  name, it is interpreted relative to the current directory.

  For additional information about this and other option-file
  options, see [Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "4.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--defaults-file=file_name`](mysqlcheck.html#option_mysqlcheck_defaults-file)

  <table frame="box" rules="all" summary="Command-line options available for mysqlcheck."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th>Option Name</th>
<th>Description</th>
<th>Introduced</th>
<th>Deprecated</th>
</tr></thead><tbody><tr><th>--all-databases</th>
<td>Check all tables in all databases</td>
<td></td>
<td></td>
</tr><tr><th>--all-in-1</th>
<td>Execute a single statement for each database that names all the tables from that database</td>
<td></td>
<td></td>
</tr><tr><th>--analyze</th>
<td>Analyze the tables</td>
<td></td>
<td></td>
</tr><tr><th>--auto-repair</th>
<td>If a checked table is corrupted, automatically fix it</td>
<td></td>
<td></td>
</tr><tr><th>--bind-address</th>
<td>Use specified network interface to connect to MySQL Server</td>
<td></td>
<td></td>
</tr><tr><th>--character-sets-dir</th>
<td>Directory where character sets are installed</td>
<td></td>
<td></td>
</tr><tr><th>--check</th>
<td>Check the tables for errors</td>
<td></td>
<td></td>
</tr><tr><th>--check-only-changed</th>
<td>Check only tables that have changed since the last check</td>
<td></td>
<td></td>
</tr><tr><th>--check-upgrade</th>
<td>Invoke CHECK TABLE with the FOR UPGRADE option</td>
<td></td>
<td></td>
</tr><tr><th>--compress</th>
<td>Compress all information sent between client and server</td>
<td></td>
<td></td>
</tr><tr><th>--databases</th>
<td>Interpret all arguments as database names</td>
<td></td>
<td></td>
</tr><tr><th>--debug</th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr><tr><th>--debug-check</th>
<td>Print debugging information when program exits</td>
<td></td>
<td></td>
</tr><tr><th>--debug-info</th>
<td>Print debugging information, memory, and CPU statistics when program exits</td>
<td></td>
<td></td>
</tr><tr><th>--default-auth</th>
<td>Authentication plugin to use</td>
<td></td>
<td></td>
</tr><tr><th>--default-character-set</th>
<td>Specify default character set</td>
<td></td>
<td></td>
</tr><tr><th>--defaults-extra-file</th>
<td>Read named option file in addition to usual option files</td>
<td></td>
<td></td>
</tr><tr><th>--defaults-file</th>
<td>Read only named option file</td>
<td></td>
<td></td>
</tr><tr><th>--defaults-group-suffix</th>
<td>Option group suffix value</td>
<td></td>
<td></td>
</tr><tr><th>--enable-cleartext-plugin</th>
<td>Enable cleartext authentication plugin</td>
<td>5.7.10</td>
<td></td>
</tr><tr><th>--extended</th>
<td>Check and repair tables</td>
<td></td>
<td></td>
</tr><tr><th>--fast</th>
<td>Check only tables that have not been closed properly</td>
<td></td>
<td></td>
</tr><tr><th>--fix-db-names</th>
<td>Convert database names to 5.1 format</td>
<td></td>
<td>Yes</td>
</tr><tr><th>--fix-table-names</th>
<td>Convert table names to 5.1 format</td>
<td></td>
<td>Yes</td>
</tr><tr><th>--force</th>
<td>Continue even if an SQL error occurs</td>
<td></td>
<td></td>
</tr><tr><th>--get-server-public-key</th>
<td>Request RSA public key from server</td>
<td>5.7.23</td>
<td></td>
</tr><tr><th>--help</th>
<td>Display help message and exit</td>
<td></td>
<td></td>
</tr><tr><th>--host</th>
<td>Host on which MySQL server is located</td>
<td></td>
<td></td>
</tr><tr><th>--login-path</th>
<td>Read login path options from .mylogin.cnf</td>
<td></td>
<td></td>
</tr><tr><th>--medium-check</th>
<td>Do a check that is faster than an --extended operation</td>
<td></td>
<td></td>
</tr><tr><th>--no-defaults</th>
<td>Read no option files</td>
<td></td>
<td></td>
</tr><tr><th>--optimize</th>
<td>Optimize the tables</td>
<td></td>
<td></td>
</tr><tr><th>--password</th>
<td>Password to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th>--pipe</th>
<td>Connect to server using named pipe (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th>--plugin-dir</th>
<td>Directory where plugins are installed</td>
<td></td>
<td></td>
</tr><tr><th>--port</th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr><tr><th>--print-defaults</th>
<td>Print default options</td>
<td></td>
<td></td>
</tr><tr><th>--protocol</th>
<td>Transport protocol to use</td>
<td></td>
<td></td>
</tr><tr><th>--quick</th>
<td>The fastest method of checking</td>
<td></td>
<td></td>
</tr><tr><th>--repair</th>
<td>Perform a repair that can fix almost anything except unique keys that are not unique</td>
<td></td>
<td></td>
</tr><tr><th>--secure-auth</th>
<td>Do not send passwords to server in old (pre-4.1) format</td>
<td></td>
<td>Yes</td>
</tr><tr><th>--server-public-key-path</th>
<td>Path name to file containing RSA public key</td>
<td>5.7.23</td>
<td></td>
</tr><tr><th>--shared-memory-base-name</th>
<td>Shared-memory name for shared-memory connections (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th>--silent</th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr><tr><th>--skip-database</th>
<td>Omit this database from performed operations</td>
<td></td>
<td></td>
</tr><tr><th>--socket</th>
<td>Unix socket file or Windows named pipe to use</td>
<td></td>
<td></td>
</tr><tr><th>--ssl</th>
<td>Enable connection encryption</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-ca</th>
<td>File that contains list of trusted SSL Certificate Authorities</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-capath</th>
<td>Directory that contains trusted SSL Certificate Authority certificate files</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-cert</th>
<td>File that contains X.509 certificate</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-cipher</th>
<td>Permissible ciphers for connection encryption</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-crl</th>
<td>File that contains certificate revocation lists</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-crlpath</th>
<td>Directory that contains certificate revocation-list files</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-key</th>
<td>File that contains X.509 key</td>
<td></td>
<td></td>
</tr><tr><th>--ssl-mode</th>
<td>Desired security state of connection to server</td>
<td>5.7.11</td>
<td></td>
</tr><tr><th>--ssl-verify-server-cert</th>
<td>Verify host name against server certificate Common Name identity</td>
<td></td>
<td></td>
</tr><tr><th>--tables</th>
<td>Overrides the --databases or -B option</td>
<td></td>
<td></td>
</tr><tr><th>--tls-version</th>
<td>Permissible TLS protocols for encrypted connections</td>
<td>5.7.10</td>
<td></td>
</tr><tr><th>--use-frm</th>
<td>For repair operations on MyISAM tables</td>
<td></td>
<td></td>
</tr><tr><th>--user</th>
<td>MySQL user name to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th>--verbose</th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr><tr><th>--version</th>
<td>Display version information and exit</td>
<td></td>
<td></td>
</tr><tr><th>--write-binlog</th>
<td>Log ANALYZE, OPTIMIZE, REPAIR statements to binary log. --skip-write-binlog adds NO_WRITE_TO_BINLOG to these statements</td>
<td></td>
<td></td>
</tr></tbody></table>9

  Use only the given option file. If the file does not exist
  or is otherwise inaccessible, an error occurs. If
  *`file_name`* is not an absolute path
  name, it is interpreted relative to the current directory.

  Exception: Even with
  [`--defaults-file`](option-file-options.html#option_general_defaults-file), client
  programs read `.mylogin.cnf`.

  For additional information about this and other option-file
  options, see [Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "4.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--defaults-group-suffix=str`](mysqlcheck.html#option_mysqlcheck_defaults-group-suffix)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--help</code></td>
</tr></tbody></table>0

  Read not only the usual option groups, but also groups with
  the usual names and a suffix of
  *`str`*. For example,
  [**mysqlcheck**](mysqlcheck.html "4.5.3 mysqlcheck — A Table Maintenance Program") normally reads the
  `[client]` and
  `[mysqlcheck]` groups. If this option is
  given as
  [`--defaults-group-suffix=_other`](mysqlcheck.html#option_mysqlcheck_defaults-group-suffix),
  [**mysqlcheck**](mysqlcheck.html "4.5.3 mysqlcheck — A Table Maintenance Program") also reads the
  `[client_other]` and
  `[mysqlcheck_other]` groups.

  For additional information about this and other option-file
  options, see [Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "4.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--extended`](mysqlcheck.html#option_mysqlcheck_extended),
  `-e`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--help</code></td>
</tr></tbody></table>1

  If you are using this option to check tables, it ensures
  that they are 100% consistent but takes a long time.

  If you are using this option to repair tables, it runs an
  extended repair that may not only take a long time to
  execute, but may produce a lot of garbage rows also!

* [`--default-auth=plugin`](mysqlcheck.html#option_mysqlcheck_default-auth)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--help</code></td>
</tr></tbody></table>2

  A hint about which client-side authentication plugin to use.
  See [Section 6.2.13, “Pluggable Authentication”](pluggable-authentication.html "6.2.13 Pluggable Authentication").

* [`--enable-cleartext-plugin`](mysqlcheck.html#option_mysqlcheck_enable-cleartext-plugin)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--help</code></td>
</tr></tbody></table>3

  Enable the `mysql_clear_password` cleartext
  authentication plugin. (See
  [Section 6.4.1.6, “Client-Side Cleartext Pluggable Authentication”](cleartext-pluggable-authentication.html "6.4.1.6 Client-Side Cleartext Pluggable Authentication").)

  This option was added in MySQL 5.7.10.

* [`--fast`](mysqlcheck.html#option_mysqlcheck_fast),
  `-F`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--help</code></td>
</tr></tbody></table>4

  Check only tables that have not been closed properly.

* [`--fix-db-names`](mysqlcheck.html#option_mysqlcheck_fix-db-names)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--help</code></td>
</tr></tbody></table>5

  Convert database names to 5.1 format. Only database names
  that contain special characters are affected.

  This option is deprecated in MySQL 5.7.6; expect it to be
  removed in a future version of MySQL. If it is necessary to
  convert MySQL 5.0 database or table names, a workaround is
  to upgrade a MySQL 5.0 installation to MySQL 5.1 before
  upgrading to a more recent release.

* [`--fix-table-names`](mysqlcheck.html#option_mysqlcheck_fix-table-names)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--help</code></td>
</tr></tbody></table>6

  Convert table names to 5.1 format. Only table names that
  contain special characters are affected. This option also
  applies to views.

  This option is deprecated in MySQL 5.7.6; expect it to be
  removed in a future version of MySQL. If it is necessary to
  convert MySQL 5.0 database or table names, a workaround is
  to upgrade a MySQL 5.0 installation to MySQL 5.1 before
  upgrading to a more recent release.

* [`--force`](mysqlcheck.html#option_mysqlcheck_force),
  `-f`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--help</code></td>
</tr></tbody></table>7

  Continue even if an SQL error occurs.

* [`--get-server-public-key`](mysqlcheck.html#option_mysqlcheck_get-server-public-key)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--help</code></td>
</tr></tbody></table>8

  Request from the server the public key required for RSA key
  pair-based password exchange. This option applies to clients
  that authenticate with the
  ``caching_sha2_password`` authentication
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
  ``caching_sha2_password`` plugin, see
  [Section 6.4.1.4, “Caching SHA-2 Pluggable Authentication”](caching-sha2-pluggable-authentication.html "6.4.1.4 Caching SHA-2 Pluggable Authentication").

  The
  [`--get-server-public-key`](mysqlcheck.html#option_mysqlcheck_get-server-public-key)
  option was added in MySQL 5.7.23.

* [`--host=host_name`](mysqlcheck.html#option_mysqlcheck_host),
  `-h host_name`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--help</code></td>
</tr></tbody></table>9

  Connect to the MySQL server on the given host.

* [`--login-path=name`](mysqlcheck.html#option_mysqlcheck_login-path)

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--all-databases</code></td>
</tr></tbody></table>0

  Read options from the named login path in the
  `.mylogin.cnf` login path file. A
  “login path” is an option group containing
  options that specify which MySQL server to connect to and
  which account to authenticate as. To create or modify a
  login path file, use the
  [**mysql\_config\_editor**](mysql-config-editor.html "4.6.6 mysql_config_editor — MySQL Configuration Utility") utility. See
  [Section 4.6.6, “mysql\_config\_editor — MySQL Configuration Utility”](mysql-config-editor.html "4.6.6 mysql_config_editor — MySQL Configuration Utility").

  For additional information about this and other option-file
  options, see [Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "4.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--medium-check`](mysqlcheck.html#option_mysqlcheck_medium-check),
  `-m`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--all-databases</code></td>
</tr></tbody></table>1

  Do a check that is faster than an
  [`--extended`](mysqlcheck.html#option_mysqlcheck_extended) operation.
  This finds only 99.99% of all errors, which should be good
  enough in most cases.

* [`--no-defaults`](mysqlcheck.html#option_mysqlcheck_no-defaults)

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--all-databases</code></td>
</tr></tbody></table>2

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
  [**mysql\_config\_editor**](mysql-config-editor.html "4.6.6 mysql_config_editor — MySQL Configuration Utility") utility. See
  [Section 4.6.6, “mysql\_config\_editor — MySQL Configuration Utility”](mysql-config-editor.html "4.6.6 mysql_config_editor — MySQL Configuration Utility").

  For additional information about this and other option-file
  options, see [Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "4.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--optimize`](mysqlcheck.html#option_mysqlcheck_optimize),
  `-o`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--all-databases</code></td>
</tr></tbody></table>3

  Optimize the tables.

* [`--password[=password]`](mysqlcheck.html#option_mysqlcheck_password),
  `-p[password]`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--all-databases</code></td>
</tr></tbody></table>4

  The password of the MySQL account used for connecting to the
  server. The password value is optional. If not given,
  [**mysqlcheck**](mysqlcheck.html "4.5.3 mysqlcheck — A Table Maintenance Program") prompts for one. If given,
  there must be *no space* between
  [`--password=`](mysqlcheck.html#option_mysqlcheck_password) or
  `-p` and the password following it. If no
  password option is specified, the default is to send no
  password.

  Specifying a password on the command line should be
  considered insecure. To avoid giving the password on the
  command line, use an option file. See
  [Section 6.1.2.1, “End-User Guidelines for Password Security”](password-security-user.html "6.1.2.1 End-User Guidelines for Password Security").

  To explicitly specify that there is no password and that
  [**mysqlcheck**](mysqlcheck.html "4.5.3 mysqlcheck — A Table Maintenance Program") should not prompt for one, use
  the
  [`--skip-password`](mysqlcheck.html#option_mysqlcheck_password)
  option.

* [`--pipe`](mysqlcheck.html#option_mysqlcheck_pipe),
  `-W`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--all-databases</code></td>
</tr></tbody></table>5

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
<td><code>--all-databases</code></td>
</tr></tbody></table>6

  The directory in which to look for plugins. Specify this
  option if the
  [`--default-auth`](mysqlcheck.html#option_mysqlcheck_default-auth) option is
  used to specify an authentication plugin but
  [**mysqlcheck**](mysqlcheck.html "4.5.3 mysqlcheck — A Table Maintenance Program") does not find it. See
  [Section 6.2.13, “Pluggable Authentication”](pluggable-authentication.html "6.2.13 Pluggable Authentication").

* [`--port=port_num`](mysqlcheck.html#option_mysqlcheck_port),
  `-P port_num`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--all-databases</code></td>
</tr></tbody></table>7

  For TCP/IP connections, the port number to use.

* [`--print-defaults`](mysqlcheck.html#option_mysqlcheck_print-defaults)

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--all-databases</code></td>
</tr></tbody></table>8

  Print the program name and all options that it gets from
  option files.

  For additional information about this and other option-file
  options, see [Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "4.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--protocol={TCP|SOCKET|PIPE|MEMORY}`](mysqlcheck.html#option_mysqlcheck_protocol)

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--all-databases</code></td>
</tr></tbody></table>9

  The transport protocol to use for connecting to the server.
  It is useful when the other connection parameters normally
  result in use of a protocol other than the one you want. For
  details on the permissible values, see
  [Section 4.2.5, “Connection Transport Protocols”](transport-protocols.html "4.2.5 Connection Transport Protocols").

* [`--quick`](mysqlcheck.html#option_mysqlcheck_quick),
  `-q`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--all-in-1</code></td>
</tr></tbody></table>0

  If you are using this option to check tables, it prevents
  the check from scanning the rows to check for incorrect
  links. This is the fastest check method.

  If you are using this option to repair tables, it tries to
  repair only the index tree. This is the fastest repair
  method.

* [`--repair`](mysqlcheck.html#option_mysqlcheck_repair),
  `-r`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--all-in-1</code></td>
</tr></tbody></table>1

  Perform a repair that can fix almost anything except unique
  keys that are not unique.

* [`--secure-auth`](mysqlcheck.html#option_mysqlcheck_secure-auth)

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--all-in-1</code></td>
</tr></tbody></table>2

  Do not send passwords to the server in old (pre-4.1) format.
  This prevents connections except for servers that use the
  newer password format.

  As of MySQL 5.7.5, this option is deprecated; expect it to
  be removed in a future MySQL release. It is always enabled
  and attempting to disable it
  ([`--skip-secure-auth`](mysqlcheck.html#option_mysqlcheck_secure-auth),
  [`--secure-auth=0`](mysqlcheck.html#option_mysqlcheck_secure-auth)) produces
  an error. Before MySQL 5.7.5, this option is enabled by
  default but can be disabled.

  Note

  Passwords that use the pre-4.1 hashing method are less
  secure than passwords that use the native password hashing
  method and should be avoided. Pre-4.1 passwords are
  deprecated and support for them was removed in MySQL
  5.7.5. For account upgrade instructions, see
  [Section 6.4.1.3, “Migrating Away from Pre-4.1 Password Hashing and the mysql\_old\_password
  Plugin”](account-upgrades.html "6.4.1.3 Migrating Away from Pre-4.1 Password Hashing and the mysql_old_password Plugin").

* [`--server-public-key-path=file_name`](mysqlcheck.html#option_mysqlcheck_server-public-key-path)

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--all-in-1</code></td>
</tr></tbody></table>3

  The path name to a file in PEM format containing a
  client-side copy of the public key required by the server
  for RSA key pair-based password exchange. This option
  applies to clients that authenticate with the
  `sha256_password` or
  ``caching_sha2_password`` authentication
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
  and ``caching_sha2_password`` plugins, see
  [Section 6.4.1.5, “SHA-256 Pluggable Authentication”](sha256-pluggable-authentication.html "6.4.1.5 SHA-256 Pluggable Authentication"), and
  [Section 6.4.1.4, “Caching SHA-2 Pluggable Authentication”](caching-sha2-pluggable-authentication.html "6.4.1.4 Caching SHA-2 Pluggable Authentication").

  The
  [`--server-public-key-path`](mysqlcheck.html#option_mysqlcheck_server-public-key-path)
  option was added in MySQL 5.7.23.

* [`--shared-memory-base-name=name`](mysqlcheck.html#option_mysqlcheck_shared-memory-base-name)

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--all-in-1</code></td>
</tr></tbody></table>4

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
<td><code>--all-in-1</code></td>
</tr></tbody></table>5

  Silent mode. Print only error messages.

* [`--skip-database=db_name`](mysqlcheck.html#option_mysqlcheck_skip-database)

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--all-in-1</code></td>
</tr></tbody></table>6

  Do not include the named database (case-sensitive) in the
  operations performed by [**mysqlcheck**](mysqlcheck.html "4.5.3 mysqlcheck — A Table Maintenance Program").

* [`--socket=path`](mysqlcheck.html#option_mysqlcheck_socket),
  `-S path`

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--all-in-1</code></td>
</tr></tbody></table>7

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

* [`--tables`](mysqlcheck.html#option_mysqlcheck_tables)

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--all-in-1</code></td>
</tr></tbody></table>8

  Override the [`--databases`](mysqlcheck.html#option_mysqlcheck_databases)
  or `-B` option. All name arguments following
  the option are regarded as table names.

* [`--tls-version=protocol_list`](mysqlcheck.html#option_mysqlcheck_tls-version)

  <table frame="box" rules="all" summary="Properties for all-in-1"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--all-in-1</code></td>
</tr></tbody></table>9

  The permissible TLS protocols for encrypted connections. The
  value is a list of one or more comma-separated protocol
  names. The protocols that can be named for this option
  depend on the SSL library used to compile MySQL. For
  details, see
  [Section 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”](encrypted-connection-protocols-ciphers.html "6.3.2 Encrypted Connection TLS Protocols and Ciphers").

  This option was added in MySQL 5.7.10.

* [`--use-frm`](mysqlcheck.html#option_mysqlcheck_use-frm)

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--analyze</code></td>
</tr></tbody></table>0

  For repair operations on `MyISAM` tables,
  get the table structure from the `.frm`
  file so that the table can be repaired even if the
  `.MYI` header is corrupted.

* [`--user=user_name`](mysqlcheck.html#option_mysqlcheck_user),
  `-u user_name`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--analyze</code></td>
</tr></tbody></table>1

  The user name of the MySQL account to use for connecting to
  the server.

* [`--verbose`](mysqlcheck.html#option_mysqlcheck_verbose),
  `-v`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--analyze</code></td>
</tr></tbody></table>2

  Verbose mode. Print information about the various stages of
  program operation.

* [`--version`](mysqlcheck.html#option_mysqlcheck_version),
  `-V`

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--analyze</code></td>
</tr></tbody></table>3

  Display version information and exit.

* [`--write-binlog`](mysqlcheck.html#option_mysqlcheck_write-binlog)

  <table frame="box" rules="all" summary="Properties for analyze"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--analyze</code></td>
</tr></tbody></table>4

  This option is enabled by default, so that
  [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement"),
  [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement"), and
  [`REPAIR TABLE`](repair-table.html "13.7.2.5 REPAIR TABLE Statement") statements
  generated by [**mysqlcheck**](mysqlcheck.html "4.5.3 mysqlcheck — A Table Maintenance Program") are written to
  the binary log. Use
  [`--skip-write-binlog`](mysqlcheck.html#option_mysqlcheck_write-binlog)
  to cause `NO_WRITE_TO_BINLOG` to be added
  to the statements so that they are not logged. Use the
  [`--skip-write-binlog`](mysqlcheck.html#option_mysqlcheck_write-binlog)
  when these statements should not be sent to replicas or run
  when using the binary logs for recovery from backup.