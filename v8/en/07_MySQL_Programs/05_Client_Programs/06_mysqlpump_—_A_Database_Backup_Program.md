### 6.5.6 mysqlpump — A Database Backup Program

* [mysqlpump Invocation Syntax](mysqlpump.html#mysqlpump-syntax "mysqlpump Invocation Syntax")
* [mysqlpump Option Summary](mysqlpump.html#mysqlpump-option-summary "mysqlpump Option Summary")
* [mysqlpump Option Descriptions](mysqlpump.html#mysqlpump-options "mysqlpump Option Descriptions")
* [mysqlpump Object Selection](mysqlpump.html#mysqlpump-filtering "mysqlpump Object Selection")
* [mysqlpump Parallel Processing](mysqlpump.html#mysqlpump-parallelism "mysqlpump Parallel Processing")
* [mysqlpump Restrictions](mysqlpump.html#mysqlpump-restrictions "mysqlpump Restrictions")

The [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") client utility performs
[logical backups](glossary.html#glos_logical_backup "logical backup"),
producing a set of SQL statements that can be executed to
reproduce the original database object definitions and table
data. It dumps one or more MySQL databases for backup or
transfer to another SQL server.

Note

[**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") is deprecated as of MySQL 8.0.34;
expect it to be removed in a future version of MySQL. You can
use such MySQL programs as [**mysqldump**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program") and
MySQL Shell to perform logical backups, dump databases, and
similar tasks instead.

Tip

Consider using the [MySQL Shell dump utilities](/doc/mysql-shell/8.0/en/mysql-shell-utilities-dump-instance-schema.html), which provide parallel dumping with multiple threads, file compression, and progress information display, as well as cloud features such as Oracle Cloud Infrastructure Object Storage streaming, and MySQL HeatWave compatibility checks and modifications. Dumps can be easily imported into a MySQL Server instance or a MySQL HeatWave DB System using the [MySQL Shell load dump utilities](/doc/mysql-shell/8.0/en/mysql-shell-utilities-load-dump.html). Installation instructions for MySQL Shell can be found [here](/doc/mysql-shell/8.0/en/mysql-shell-install.html).

[**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") features include:

* Parallel processing of databases, and of objects within
  databases, to speed up the dump process

* Better control over which databases and database objects
  (tables, stored programs, user accounts) to dump

* Dumping of user accounts as account-management statements
  ([`CREATE USER`](create-user.html "15.7.1.3 CREATE USER Statement"),
  [`GRANT`](grant.html "15.7.1.6 GRANT Statement")) rather than as inserts
  into the `mysql` system database

* Capability of creating compressed output
* Progress indicator (the values are estimates)
* For dump file reloading, faster secondary index creation for
  `InnoDB` tables by adding indexes after
  rows are inserted

Note

[**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") uses MySQL features introduced in
MySQL 5.7, and thus assumes use with MySQL 5.7 or higher.

[**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") requires at least the
[`SELECT`](privileges-provided.html#priv_select) privilege for dumped
tables, [`SHOW VIEW`](privileges-provided.html#priv_show-view) for dumped
views, [`TRIGGER`](privileges-provided.html#priv_trigger) for dumped
triggers, and [`LOCK TABLES`](privileges-provided.html#priv_lock-tables) if the
[`--single-transaction`](mysqlpump.html#option_mysqlpump_single-transaction) option is
not used. The [`SELECT`](privileges-provided.html#priv_select) privilege on
the `mysql` system database is required to dump
user definitions. Certain options might require other privileges
as noted in the option descriptions.

To reload a dump file, you must have the privileges required to
execute the statements that it contains, such as the appropriate
`CREATE` privileges for objects created by
those statements.

Note

A dump made using PowerShell on Windows with output
redirection creates a file that has UTF-16 encoding:

```
mysqlpump [options] > dump.sql
```

However, UTF-16 is not permitted as a connection character set
(see [Section 12.4, “Connection Character Sets and Collations”](charset-connection.html "12.4 Connection Character Sets and Collations")), so the dump file
cannot be loaded correctly. To work around this issue, use the
`--result-file` option, which creates the
output in ASCII format:

```
mysqlpump [options] --result-file=dump.sql
```

#### mysqlpump Invocation Syntax

By default, [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") dumps all databases
(with certain exceptions noted in
[mysqlpump Restrictions](mysqlpump.html#mysqlpump-restrictions "mysqlpump Restrictions")). To specify this
behavior explicitly, use the
[`--all-databases`](mysqlpump.html#option_mysqlpump_all-databases) option:

```
mysqlpump --all-databases
```

To dump a single database, or certain tables within that
database, name the database on the command line, optionally
followed by table names:

```
mysqlpump db_name
mysqlpump db_name tbl_name1 tbl_name2 ...
```

To treat all name arguments as database names, use the
[`--databases`](mysqlpump.html#option_mysqlpump_databases) option:

```
mysqlpump --databases db_name1 db_name2 ...
```

By default, [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") does not dump user
account definitions, even if you dump the
`mysql` system database that contains the grant
tables. To dump grant table contents as logical definitions in
the form of [`CREATE USER`](create-user.html "15.7.1.3 CREATE USER Statement") and
[`GRANT`](grant.html "15.7.1.6 GRANT Statement") statements, use the
[`--users`](mysqlpump.html#option_mysqlpump_users) option and suppress
all database dumping:

```
mysqlpump --exclude-databases=% --users
```

In the preceding command, `%` is a wildcard
that matches all database names for the
[`--exclude-databases`](mysqlpump.html#option_mysqlpump_exclude-databases) option.

[**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") supports several options for
including or excluding databases, tables, stored programs, and
user definitions. See [mysqlpump Object Selection](mysqlpump.html#mysqlpump-filtering "mysqlpump Object Selection").

To reload a dump file, execute the statements that it contains.
For example, use the [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") client:

```
mysqlpump [options] > dump.sql
mysql < dump.sql
```

The following discussion provides additional
[**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") usage examples.

To see a list of the options [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program")
supports, issue the command [**mysqlpump --help**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program").

#### mysqlpump Option Summary

[**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") supports the following options,
which can be specified on the command line or in the
`[mysqlpump]` and `[client]`
groups of an option file. (Prior to MySQL 8.0.20,
[**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") read the
`[mysql_dump]` group rather than
`[mysqlpump]`. As of 8.0.20,
`[mysql_dump]` is still accepted but is
deprecated.) For information about option files used by MySQL
programs, see [Section 6.2.2.2, “Using Option Files”](option-files.html "6.2.2.2 Using Option Files").

**Table 6.17 mysqlpump Options**

<table frame="box" rules="all" summary="Command-line options available for mysqlpump."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th>
<th scope="col">Description</th>
<th scope="col">Introduced</th>
<th scope="col">Deprecated</th>
</tr></thead><tbody><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_add-drop-database">--add-drop-database</a></th>
<td>Add DROP DATABASE statement before each CREATE DATABASE statement</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_add-drop-table">--add-drop-table</a></th>
<td>Add DROP TABLE statement before each CREATE TABLE statement</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_add-drop-user">--add-drop-user</a></th>
<td>Add DROP USER statement before each CREATE USER statement</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_add-locks">--add-locks</a></th>
<td>Surround each table dump with LOCK TABLES and UNLOCK TABLES statements</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_all-databases">--all-databases</a></th>
<td>Dump all databases</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_bind-address">--bind-address</a></th>
<td>Use specified network interface to connect to MySQL Server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_character-sets-dir">--character-sets-dir</a></th>
<td>Directory where character sets are installed</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_column-statistics">--column-statistics</a></th>
<td>Write ANALYZE TABLE statements to generate statistics histograms</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_complete-insert">--complete-insert</a></th>
<td>Use complete INSERT statements that include column names</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_compress">--compress</a></th>
<td>Compress all information sent between client and server</td>
<td></td>
<td>8.0.18</td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_compress-output">--compress-output</a></th>
<td>Output compression algorithm</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_compression-algorithms">--compression-algorithms</a></th>
<td>Permitted compression algorithms for connections to server</td>
<td>8.0.18</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_databases">--databases</a></th>
<td>Interpret all name arguments as database names</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_debug">--debug</a></th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_debug-check">--debug-check</a></th>
<td>Print debugging information when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_debug-info">--debug-info</a></th>
<td>Print debugging information, memory, and CPU statistics when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_default-auth">--default-auth</a></th>
<td>Authentication plugin to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_default-character-set">--default-character-set</a></th>
<td>Specify default character set</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_default-parallelism">--default-parallelism</a></th>
<td>Default number of threads for parallel processing</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_defaults-extra-file">--defaults-extra-file</a></th>
<td>Read named option file in addition to usual option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_defaults-file">--defaults-file</a></th>
<td>Read only named option file</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_defaults-group-suffix">--defaults-group-suffix</a></th>
<td>Option group suffix value</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_defer-table-indexes">--defer-table-indexes</a></th>
<td>For reloading, defer index creation until after loading table rows</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_events">--events</a></th>
<td>Dump events from dumped databases</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_exclude-databases">--exclude-databases</a></th>
<td>Databases to exclude from dump</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_exclude-events">--exclude-events</a></th>
<td>Events to exclude from dump</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_exclude-routines">--exclude-routines</a></th>
<td>Routines to exclude from dump</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_exclude-tables">--exclude-tables</a></th>
<td>Tables to exclude from dump</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_exclude-triggers">--exclude-triggers</a></th>
<td>Triggers to exclude from dump</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_exclude-users">--exclude-users</a></th>
<td>Users to exclude from dump</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_extended-insert">--extended-insert</a></th>
<td>Use multiple-row INSERT syntax</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_get-server-public-key">--get-server-public-key</a></th>
<td>Request RSA public key from server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_help">--help</a></th>
<td>Display help message and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_hex-blob">--hex-blob</a></th>
<td>Dump binary columns using hexadecimal notation</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_host">--host</a></th>
<td>Host on which MySQL server is located</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_include-databases">--include-databases</a></th>
<td>Databases to include in dump</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_include-events">--include-events</a></th>
<td>Events to include in dump</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_include-routines">--include-routines</a></th>
<td>Routines to include in dump</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_include-tables">--include-tables</a></th>
<td>Tables to include in dump</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_include-triggers">--include-triggers</a></th>
<td>Triggers to include in dump</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_include-users">--include-users</a></th>
<td>Users to include in dump</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_insert-ignore">--insert-ignore</a></th>
<td>Write INSERT IGNORE rather than INSERT statements</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_log-error-file">--log-error-file</a></th>
<td>Append warnings and errors to named file</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_login-path">--login-path</a></th>
<td>Read login path options from .mylogin.cnf</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_max-allowed-packet">--max-allowed-packet</a></th>
<td>Maximum packet length to send to or receive from server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_net-buffer-length">--net-buffer-length</a></th>
<td>Buffer size for TCP/IP and socket communication</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_no-create-db">--no-create-db</a></th>
<td>Do not write CREATE DATABASE statements</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_no-create-info">--no-create-info</a></th>
<td>Do not write CREATE TABLE statements that re-create each dumped table</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_no-defaults">--no-defaults</a></th>
<td>Read no option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_parallel-schemas">--parallel-schemas</a></th>
<td>Specify schema-processing parallelism</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_password">--password</a></th>
<td>Password to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_password1">--password1</a></th>
<td>First multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_password2">--password2</a></th>
<td>Second multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_password3">--password3</a></th>
<td>Third multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_plugin-dir">--plugin-dir</a></th>
<td>Directory where plugins are installed</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_port">--port</a></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_print-defaults">--print-defaults</a></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_protocol">--protocol</a></th>
<td>Transport protocol to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_replace">--replace</a></th>
<td>Write REPLACE statements rather than INSERT statements</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_result-file">--result-file</a></th>
<td>Direct output to a given file</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_routines">--routines</a></th>
<td>Dump stored routines (procedures and functions) from dumped databases</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_server-public-key-path">--server-public-key-path</a></th>
<td>Path name to file containing RSA public key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_set-charset">--set-charset</a></th>
<td>Add SET NAMES default_character_set to output</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_set-gtid-purged">--set-gtid-purged</a></th>
<td>Whether to add SET @@GLOBAL.GTID_PURGED to output</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_single-transaction">--single-transaction</a></th>
<td>Dump tables within single transaction</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_skip-definer">--skip-definer</a></th>
<td>Omit DEFINER and SQL SECURITY clauses from view and stored program CREATE statements</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_skip-dump-rows">--skip-dump-rows</a></th>
<td>Do not dump table rows</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_skip-generated-invisible-primary-key">--skip-generated-invisible-primary-key</a></th>
<td>Do not dump information about generated invisible primary keys</td>
<td>8.0.30</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_socket">--socket</a></th>
<td>Unix socket file or Windows named pipe to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_ssl">--ssl-ca</a></th>
<td>File that contains list of trusted SSL Certificate Authorities</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_ssl">--ssl-capath</a></th>
<td>Directory that contains trusted SSL Certificate Authority certificate files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_ssl">--ssl-cert</a></th>
<td>File that contains X.509 certificate</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_ssl">--ssl-cipher</a></th>
<td>Permissible ciphers for connection encryption</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_ssl">--ssl-crl</a></th>
<td>File that contains certificate revocation lists</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_ssl">--ssl-crlpath</a></th>
<td>Directory that contains certificate revocation-list files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_ssl-fips-mode">--ssl-fips-mode</a></th>
<td>Whether to enable FIPS mode on client side</td>
<td></td>
<td>8.0.34</td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_ssl">--ssl-key</a></th>
<td>File that contains X.509 key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_ssl">--ssl-mode</a></th>
<td>Desired security state of connection to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_ssl">--ssl-session-data</a></th>
<td>File that contains SSL session data</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_ssl">--ssl-session-data-continue-on-failed-reuse</a></th>
<td>Whether to establish connections if session reuse fails</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_tls-ciphersuites">--tls-ciphersuites</a></th>
<td>Permissible TLSv1.3 ciphersuites for encrypted connections</td>
<td>8.0.16</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_tls-version">--tls-version</a></th>
<td>Permissible TLS protocols for encrypted connections</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_triggers">--triggers</a></th>
<td>Dump triggers for each dumped table</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_tz-utc">--tz-utc</a></th>
<td>Add SET TIME_ZONE='+00:00' to dump file</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_user">--user</a></th>
<td>MySQL user name to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_users">--users</a></th>
<td>Dump user accounts</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_version">--version</a></th>
<td>Display version information and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_watch-progress">--watch-progress</a></th>
<td>Display progress indicator</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlpump.html#option_mysqlpump_zstd-compression-level">--zstd-compression-level</a></th>
<td>Compression level for connections to server that use zstd compression</td>
<td>8.0.18</td>
<td></td>
</tr></tbody></table>

#### mysqlpump Option Descriptions

* [`--help`](mysqlpump.html#option_mysqlpump_help),
  `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>

  Display a help message and exit.

* [`--add-drop-database`](mysqlpump.html#option_mysqlpump_add-drop-database)

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-drop-database</code></td>
</tr></tbody></table>

  Write a [`DROP DATABASE`](drop-database.html "15.1.24 DROP DATABASE Statement")
  statement before each [`CREATE
  DATABASE`](create-database.html "15.1.12 CREATE DATABASE Statement") statement.

  Note

  In MySQL 8.0, the `mysql`
  schema is considered a system schema that cannot be
  dropped by end users. If
  [`--add-drop-database`](mysqlpump.html#option_mysqlpump_add-drop-database) is
  used with
  [`--all-databases`](mysqlpump.html#option_mysqlpump_all-databases) or with
  [`--databases`](mysqlpump.html#option_mysqlpump_databases) where the
  list of schemas to be dumped includes
  `mysql`, the dump file contains a
  `` DROP DATABASE `mysql` `` statement that
  causes an error when the dump file is reloaded.

  Instead, to use
  [`--add-drop-database`](mysqlpump.html#option_mysqlpump_add-drop-database), use
  [`--databases`](mysqlpump.html#option_mysqlpump_databases) with a list
  of schemas to be dumped, where the list does not include
  `mysql`.

* [`--add-drop-table`](mysqlpump.html#option_mysqlpump_add-drop-table)

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-drop-table</code></td>
</tr></tbody></table>

  Write a [`DROP TABLE`](drop-table.html "15.1.32 DROP TABLE Statement") statement
  before each [`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement")
  statement.

* [`--add-drop-user`](mysqlpump.html#option_mysqlpump_add-drop-user)

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-drop-user</code></td>
</tr></tbody></table>

  Write a [`DROP USER`](drop-user.html "15.7.1.5 DROP USER Statement") statement
  before each [`CREATE USER`](create-user.html "15.7.1.3 CREATE USER Statement")
  statement.

* [`--add-locks`](mysqlpump.html#option_mysqlpump_add-locks)

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-locks</code></td>
</tr></tbody></table>

  Surround each table dump with [`LOCK
  TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") and
  [`UNLOCK
  TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") statements. This results in faster inserts
  when the dump file is reloaded. See
  [Section 10.2.5.1, “Optimizing INSERT Statements”](insert-optimization.html "10.2.5.1 Optimizing INSERT Statements").

  This option does not work with parallelism because
  [`INSERT`](insert.html "15.2.7 INSERT Statement") statements from
  different tables can be interleaved and
  [`UNLOCK
  TABLES`](lock-tables.html "15.3.6 LOCK TABLES and UNLOCK TABLES Statements") following the end of the inserts for one
  table could release locks on tables for which inserts
  remain.

  [`--add-locks`](mysqlpump.html#option_mysqlpump_add-locks) and
  [`--single-transaction`](mysqlpump.html#option_mysqlpump_single-transaction) are
  mutually exclusive.

* [`--all-databases`](mysqlpump.html#option_mysqlpump_all-databases),
  `-A`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--all-databases</code></td>
</tr></tbody></table>

  Dump all databases (with certain exceptions noted in
  [mysqlpump Restrictions](mysqlpump.html#mysqlpump-restrictions "mysqlpump Restrictions")). This is the
  default behavior if no other is specified explicitly.

  [`--all-databases`](mysqlpump.html#option_mysqlpump_all-databases) and
  [`--databases`](mysqlpump.html#option_mysqlpump_databases) are mutually
  exclusive.

  Note

  See the
  [`--add-drop-database`](mysqlpump.html#option_mysqlpump_add-drop-database)
  description for information about an incompatibility of
  that option with
  [`--all-databases`](mysqlpump.html#option_mysqlpump_all-databases).

  Prior to MySQL 8.0, the
  [`--routines`](mysqldump.html#option_mysqldump_routines) and
  [`--events`](mysqldump.html#option_mysqldump_events) options for
  [**mysqldump**](mysqldump.html "6.5.4 mysqldump — A Database Backup Program") and
  [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") were not required to include
  stored routines and events when using the
  [`--all-databases`](mysqldump.html#option_mysqldump_all-databases) option:
  The dump included the `mysql` system
  database, and therefore also the
  `mysql.proc` and
  `mysql.event` tables containing stored
  routine and event definitions. As of MySQL 8.0,
  the `mysql.event` and
  `mysql.proc` tables are not used.
  Definitions for the corresponding objects are stored in data
  dictionary tables, but those tables are not dumped. To
  include stored routines and events in a dump made using
  [`--all-databases`](mysqldump.html#option_mysqldump_all-databases), use the
  [`--routines`](mysqldump.html#option_mysqldump_routines) and
  [`--events`](mysqldump.html#option_mysqldump_events) options
  explicitly.

* [`--bind-address=ip_address`](mysqlpump.html#option_mysqlpump_bind-address)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>

  On a computer having multiple network interfaces, use this
  option to select which interface to use for connecting to
  the MySQL server.

* [`--character-sets-dir=path`](mysqlpump.html#option_mysqlpump_character-sets-dir)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=dir_name</code></td>
</tr><tr><th>Type</th>
<td>Directory name</td>
</tr></tbody></table>

  The directory where character sets are installed. See
  [Section 12.15, “Character Set Configuration”](charset-configuration.html "12.15 Character Set Configuration").

* [`--column-statistics`](mysqlpump.html#option_mysqlpump_column-statistics)

  <table frame="box" rules="all" summary="Properties for column-statistics"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--column-statistics</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">OFF</code></td>
</tr></tbody></table>

  Add [`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement") statements
  to the output to generate histogram statistics for dumped
  tables when the dump file is reloaded. This option is
  disabled by default because histogram generation for large
  tables can take a long time.

* [`--complete-insert`](mysqlpump.html#option_mysqlpump_complete-insert)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>0

  Write complete [`INSERT`](insert.html "15.2.7 INSERT Statement")
  statements that include column names.

* [`--compress`](mysqlpump.html#option_mysqlpump_compress),
  `-C`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>1

  Compress all information sent between the client and the
  server if possible. See
  [Section 6.2.8, “Connection Compression Control”](connection-compression-control.html "6.2.8 Connection Compression Control").

  As of MySQL 8.0.18, this option is deprecated. Expect it to
  be removed in a future version of MySQL. See
  [Configuring Legacy Connection Compression](connection-compression-control.html#connection-compression-legacy-configuration "Configuring Legacy Connection Compression").

* [`--compress-output=algorithm`](mysqlpump.html#option_mysqlpump_compress-output)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>2

  By default, [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") does not compress
  output. This option specifies output compression using the
  specified algorithm. Permitted algorithms are
  `LZ4` and `ZLIB`.

  To uncompress compressed output, you must have an
  appropriate utility. If the system commands
  **lz4** and **openssl zlib**
  are not available, MySQL distributions include
  [**lz4\_decompress**](lz4-decompress.html "6.8.1 lz4_decompress — Decompress mysqlpump LZ4-Compressed Output") and
  [**zlib\_decompress**](zlib-decompress.html "6.8.3 zlib_decompress — Decompress mysqlpump ZLIB-Compressed Output") utilities that can be
  used to decompress [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") output that
  was compressed using the
  [`--compress-output=LZ4`](mysqlpump.html#option_mysqlpump_compress-output) and
  [`--compress-output=ZLIB`](mysqlpump.html#option_mysqlpump_compress-output)
  options. For more information, see
  [Section 6.8.1, “lz4\_decompress — Decompress mysqlpump LZ4-Compressed Output”](lz4-decompress.html "6.8.1 lz4_decompress — Decompress mysqlpump LZ4-Compressed Output"), and
  [Section 6.8.3, “zlib\_decompress — Decompress mysqlpump ZLIB-Compressed Output”](zlib-decompress.html "6.8.3 zlib_decompress — Decompress mysqlpump ZLIB-Compressed Output").

* [`--compression-algorithms=value`](mysqlpump.html#option_mysqlpump_compression-algorithms)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>3

  The permitted compression algorithms for connections to the
  server. The available algorithms are the same as for the
  [`protocol_compression_algorithms`](server-system-variables.html#sysvar_protocol_compression_algorithms)
  system variable. The default value is
  `uncompressed`.

  For more information, see
  [Section 6.2.8, “Connection Compression Control”](connection-compression-control.html "6.2.8 Connection Compression Control").

  This option was added in MySQL 8.0.18.

* [`--databases`](mysqlpump.html#option_mysqlpump_databases),
  `-B`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>4

  Normally, [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") treats the first name
  argument on the command line as a database name and any
  following names as table names. With this option, it treats
  all name arguments as database names.
  [`CREATE DATABASE`](create-database.html "15.1.12 CREATE DATABASE Statement") statements
  are included in the output before each new database.

  [`--all-databases`](mysqlpump.html#option_mysqlpump_all-databases) and
  [`--databases`](mysqlpump.html#option_mysqlpump_databases) are mutually
  exclusive.

  Note

  See the
  [`--add-drop-database`](mysqlpump.html#option_mysqlpump_add-drop-database)
  description for information about an incompatibility of
  that option with
  [`--databases`](mysqlpump.html#option_mysqlpump_databases).

* [`--debug[=debug_options]`](mysqlpump.html#option_mysqlpump_debug),
  `-#
  [debug_options]`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>5

  Write a debugging log. A typical
  *`debug_options`* string is
  `d:t:o,file_name`.
  The default is
  `d:t:O,/tmp/mysqlpump.trace`.

  This option is available only if MySQL was built using
  [`WITH_DEBUG`](source-configuration-options.html#option_cmake_with_debug). MySQL release
  binaries provided by Oracle are *not*
  built using this option.

* [`--debug-check`](mysqlpump.html#option_mysqlpump_debug-check)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>6

  Print some debugging information when the program exits.

  This option is available only if MySQL was built using
  [`WITH_DEBUG`](source-configuration-options.html#option_cmake_with_debug). MySQL release
  binaries provided by Oracle are *not*
  built using this option.

* [`--debug-info`](mysqlpump.html#option_mysqlpump_debug-info),
  `-T`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>7

  Print debugging information and memory and CPU usage
  statistics when the program exits.

  This option is available only if MySQL was built using
  [`WITH_DEBUG`](source-configuration-options.html#option_cmake_with_debug). MySQL release
  binaries provided by Oracle are *not*
  built using this option.

* [`--default-auth=plugin`](mysqlpump.html#option_mysqlpump_default-auth)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>8

  A hint about which client-side authentication plugin to use.
  See [Section 8.2.17, “Pluggable Authentication”](pluggable-authentication.html "8.2.17 Pluggable Authentication").

* [`--default-character-set=charset_name`](mysqlpump.html#option_mysqlpump_default-character-set)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>9

  Use *`charset_name`* as the default
  character set. See [Section 12.15, “Character Set Configuration”](charset-configuration.html "12.15 Character Set Configuration").
  If no character set is specified,
  [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") uses
  `utf8mb4`.

* [`--default-parallelism=N`](mysqlpump.html#option_mysqlpump_default-parallelism)

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-drop-database</code></td>
</tr></tbody></table>0

  The default number of threads for each parallel processing
  queue. The default is 2.

  The [`--parallel-schemas`](mysqlpump.html#option_mysqlpump_parallel-schemas)
  option also affects parallelism and can be used to override
  the default number of threads. For more information, see
  [mysqlpump Parallel Processing](mysqlpump.html#mysqlpump-parallelism "mysqlpump Parallel Processing").

  With
  [`--default-parallelism=0`](mysqlpump.html#option_mysqlpump_default-parallelism)
  and no [`--parallel-schemas`](mysqlpump.html#option_mysqlpump_parallel-schemas)
  options, [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") runs as a
  single-threaded process and creates no queues.

  With parallelism enabled, it is possible for output from
  different databases to be interleaved.

* [`--defaults-extra-file=file_name`](mysqlpump.html#option_mysqlpump_defaults-extra-file)

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-drop-database</code></td>
</tr></tbody></table>1

  Read this option file after the global option file but (on
  Unix) before the user option file. If the file does not
  exist or is otherwise inaccessible, an error occurs. If
  *`file_name`* is not an absolute path
  name, it is interpreted relative to the current directory.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--defaults-file=file_name`](mysqlpump.html#option_mysqlpump_defaults-file)

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-drop-database</code></td>
</tr></tbody></table>2

  Use only the given option file. If the file does not exist
  or is otherwise inaccessible, an error occurs. If
  *`file_name`* is not an absolute path
  name, it is interpreted relative to the current directory.

  Exception: Even with
  [`--defaults-file`](option-file-options.html#option_general_defaults-file), client
  programs read `.mylogin.cnf`.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--defaults-group-suffix=str`](mysqlpump.html#option_mysqlpump_defaults-group-suffix)

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-drop-database</code></td>
</tr></tbody></table>3

  Read not only the usual option groups, but also groups with
  the usual names and a suffix of
  *`str`*. For example,
  [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") normally reads the
  `[client]` and
  `[mysqlpump]` groups. If this option is
  given as
  [`--defaults-group-suffix=_other`](mysqlpump.html#option_mysqlpump_defaults-group-suffix),
  [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") also reads the
  `[client_other]` and
  `[mysqlpump_other]` groups.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--defer-table-indexes`](mysqlpump.html#option_mysqlpump_defer-table-indexes)

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-drop-database</code></td>
</tr></tbody></table>4

  In the dump output, defer index creation for each table
  until after its rows have been loaded. This works for all
  storage engines, but for `InnoDB` applies
  only for secondary indexes.

  This option is enabled by default; use
  [`--skip-defer-table-indexes`](mysqlpump.html#option_mysqlpump_defer-table-indexes)
  to disable it.

* [`--events`](mysqlpump.html#option_mysqlpump_events)

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-drop-database</code></td>
</tr></tbody></table>5

  Include Event Scheduler events for the dumped databases in
  the output. Event dumping requires the
  [`EVENT`](privileges-provided.html#priv_event) privileges for those
  databases.

  The output generated by using
  [`--events`](mysqlpump.html#option_mysqlpump_events) contains
  [`CREATE EVENT`](create-event.html "15.1.13 CREATE EVENT Statement") statements to
  create the events.

  This option is enabled by default; use
  [`--skip-events`](mysqlpump.html#option_mysqlpump_events)
  to disable it.

* [`--exclude-databases=db_list`](mysqlpump.html#option_mysqlpump_exclude-databases)

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-drop-database</code></td>
</tr></tbody></table>6

  Do not dump the databases in
  *`db_list`*, which is a list of one
  or more comma-separated database names. Multiple instances
  of this option are additive. For more information, see
  [mysqlpump Object Selection](mysqlpump.html#mysqlpump-filtering "mysqlpump Object Selection").

* [`--exclude-events=event_list`](mysqlpump.html#option_mysqlpump_exclude-events)

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-drop-database</code></td>
</tr></tbody></table>7

  Do not dump the databases in
  *`event_list`*, which is a list of
  one or more comma-separated event names. Multiple instances
  of this option are additive. For more information, see
  [mysqlpump Object Selection](mysqlpump.html#mysqlpump-filtering "mysqlpump Object Selection").

* [`--exclude-routines=routine_list`](mysqlpump.html#option_mysqlpump_exclude-routines)

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-drop-database</code></td>
</tr></tbody></table>8

  Do not dump the events in
  *`routine_list`*, which is a list of
  one or more comma-separated routine (stored procedure or
  function) names. Multiple instances of this option are
  additive. For more information, see
  [mysqlpump Object Selection](mysqlpump.html#mysqlpump-filtering "mysqlpump Object Selection").

* [`--exclude-tables=table_list`](mysqlpump.html#option_mysqlpump_exclude-tables)

  <table frame="box" rules="all" summary="Properties for add-drop-database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-drop-database</code></td>
</tr></tbody></table>9

  Do not dump the tables in
  *`table_list`*, which is a list of
  one or more comma-separated table names. Multiple instances
  of this option are additive. For more information, see
  [mysqlpump Object Selection](mysqlpump.html#mysqlpump-filtering "mysqlpump Object Selection").

* [`--exclude-triggers=trigger_list`](mysqlpump.html#option_mysqlpump_exclude-triggers)

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-drop-table</code></td>
</tr></tbody></table>0

  Do not dump the triggers in
  *`trigger_list`*, which is a list of
  one or more comma-separated trigger names. Multiple
  instances of this option are additive. For more information,
  see [mysqlpump Object Selection](mysqlpump.html#mysqlpump-filtering "mysqlpump Object Selection").

* [`--exclude-users=user_list`](mysqlpump.html#option_mysqlpump_exclude-users)

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-drop-table</code></td>
</tr></tbody></table>1

  Do not dump the user accounts in
  *`user_list`*, which is a list of one
  or more comma-separated account names. Multiple instances of
  this option are additive. For more information, see
  [mysqlpump Object Selection](mysqlpump.html#mysqlpump-filtering "mysqlpump Object Selection").

* [`--extended-insert=N`](mysqlpump.html#option_mysqlpump_extended-insert)

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-drop-table</code></td>
</tr></tbody></table>2

  Write [`INSERT`](insert.html "15.2.7 INSERT Statement") statements using
  multiple-row syntax that includes several
  `VALUES` lists. This results in a smaller
  dump file and speeds up inserts when the file is reloaded.

  The option value indicates the number of rows to include in
  each [`INSERT`](insert.html "15.2.7 INSERT Statement") statement. The
  default is 250. A value of 1 produces one
  [`INSERT`](insert.html "15.2.7 INSERT Statement") statement per table
  row.

* [`--get-server-public-key`](mysqlpump.html#option_mysqlpump_get-server-public-key)

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-drop-table</code></td>
</tr></tbody></table>3

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
  [`--server-public-key-path=file_name`](mysqlpump.html#option_mysqlpump_server-public-key-path)
  is given and specifies a valid public key file, it takes
  precedence over
  [`--get-server-public-key`](mysqlpump.html#option_mysqlpump_get-server-public-key).

  For information about the
  `caching_sha2_password` plugin, see
  [Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”](caching-sha2-pluggable-authentication.html "8.4.1.2 Caching SHA-2 Pluggable Authentication").

* [`--hex-blob`](mysqlpump.html#option_mysqlpump_hex-blob)

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-drop-table</code></td>
</tr></tbody></table>4

  Dump binary columns using hexadecimal notation (for example,
  `'abc'` becomes
  `0x616263`). The affected data types are
  [`BINARY`](binary-varbinary.html "13.3.3 The BINARY and VARBINARY Types"),
  [`VARBINARY`](binary-varbinary.html "13.3.3 The BINARY and VARBINARY Types"),
  [`BLOB`](blob.html "13.3.4 The BLOB and TEXT Types") types,
  [`BIT`](bit-type.html "13.1.5 Bit-Value Type - BIT"), all spatial data types,
  and other non-binary data types when used with the
  [`binary`
  character set](charset-binary-set.html "12.10.8 The Binary Character Set").

* [`--host=host_name`](mysqlpump.html#option_mysqlpump_host),
  `-h host_name`

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-drop-table</code></td>
</tr></tbody></table>5

  Dump data from the MySQL server on the given host.

* [`--include-databases=db_list`](mysqlpump.html#option_mysqlpump_include-databases)

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-drop-table</code></td>
</tr></tbody></table>6

  Dump the databases in *`db_list`*,
  which is a list of one or more comma-separated database
  names. The dump includes all objects in the named databases.
  Multiple instances of this option are additive. For more
  information, see [mysqlpump Object Selection](mysqlpump.html#mysqlpump-filtering "mysqlpump Object Selection").

* [`--include-events=event_list`](mysqlpump.html#option_mysqlpump_include-events)

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-drop-table</code></td>
</tr></tbody></table>7

  Dump the events in *`event_list`*,
  which is a list of one or more comma-separated event names.
  Multiple instances of this option are additive. For more
  information, see [mysqlpump Object Selection](mysqlpump.html#mysqlpump-filtering "mysqlpump Object Selection").

* [`--include-routines=routine_list`](mysqlpump.html#option_mysqlpump_include-routines)

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-drop-table</code></td>
</tr></tbody></table>8

  Dump the routines in
  *`routine_list`*, which is a list of
  one or more comma-separated routine (stored procedure or
  function) names. Multiple instances of this option are
  additive. For more information, see
  [mysqlpump Object Selection](mysqlpump.html#mysqlpump-filtering "mysqlpump Object Selection").

* [`--include-tables=table_list`](mysqlpump.html#option_mysqlpump_include-tables)

  <table frame="box" rules="all" summary="Properties for add-drop-table"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-drop-table</code></td>
</tr></tbody></table>9

  Dump the tables in *`table_list`*,
  which is a list of one or more comma-separated table names.
  Multiple instances of this option are additive. For more
  information, see [mysqlpump Object Selection](mysqlpump.html#mysqlpump-filtering "mysqlpump Object Selection").

* [`--include-triggers=trigger_list`](mysqlpump.html#option_mysqlpump_include-triggers)

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-drop-user</code></td>
</tr></tbody></table>0

  Dump the triggers in
  *`trigger_list`*, which is a list of
  one or more comma-separated trigger names. Multiple
  instances of this option are additive. For more information,
  see [mysqlpump Object Selection](mysqlpump.html#mysqlpump-filtering "mysqlpump Object Selection").

* [`--include-users=user_list`](mysqlpump.html#option_mysqlpump_include-users)

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-drop-user</code></td>
</tr></tbody></table>1

  Dump the user accounts in
  *`user_list`*, which is a list of one
  or more comma-separated user names. Multiple instances of
  this option are additive. For more information, see
  [mysqlpump Object Selection](mysqlpump.html#mysqlpump-filtering "mysqlpump Object Selection").

* [`--insert-ignore`](mysqlpump.html#option_mysqlpump_insert-ignore)

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-drop-user</code></td>
</tr></tbody></table>2

  Write [`INSERT
  IGNORE`](insert.html "15.2.7 INSERT Statement") statements rather than
  [`INSERT`](insert.html "15.2.7 INSERT Statement") statements.

* [`--log-error-file=file_name`](mysqlpump.html#option_mysqlpump_log-error-file)

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-drop-user</code></td>
</tr></tbody></table>3

  Log warnings and errors by appending them to the named file.
  If this option is not given, [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program")
  writes warnings and errors to the standard error output.

* [`--login-path=name`](mysqlpump.html#option_mysqlpump_login-path)

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-drop-user</code></td>
</tr></tbody></table>4

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

* [`--max-allowed-packet=N`](mysqlpump.html#option_mysqlpump_max-allowed-packet)

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-drop-user</code></td>
</tr></tbody></table>5

  The maximum size of the buffer for client/server
  communication. The default is 24MB, the maximum is 1GB.

* [`--net-buffer-length=N`](mysqlpump.html#option_mysqlpump_net-buffer-length)

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-drop-user</code></td>
</tr></tbody></table>6

  The initial size of the buffer for client/server
  communication. When creating multiple-row
  [`INSERT`](insert.html "15.2.7 INSERT Statement") statements (as with
  the [`--extended-insert`](mysqlpump.html#option_mysqlpump_extended-insert)
  option), [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") creates rows up to
  *`N`* bytes long. If you use this
  option to increase the value, ensure that the MySQL server
  [`net_buffer_length`](server-system-variables.html#sysvar_net_buffer_length) system
  variable has a value at least this large.

* [`--no-create-db`](mysqlpump.html#option_mysqlpump_no-create-db)

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-drop-user</code></td>
</tr></tbody></table>7

  Suppress any [`CREATE DATABASE`](create-database.html "15.1.12 CREATE DATABASE Statement")
  statements that might otherwise be included in the output.

* [`--no-create-info`](mysqlpump.html#option_mysqlpump_no-create-info),
  `-t`

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-drop-user</code></td>
</tr></tbody></table>8

  Do not write [`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement")
  statements that create each dumped table.

* [`--no-defaults`](mysqlpump.html#option_mysqlpump_no-defaults)

  <table frame="box" rules="all" summary="Properties for add-drop-user"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-drop-user</code></td>
</tr></tbody></table>9

  Do not read any option files. If program startup fails due
  to reading unknown options from an option file,
  [`--no-defaults`](mysqlpump.html#option_mysqlpump_no-defaults) can be used
  to prevent them from being read.

  The exception is that the `.mylogin.cnf`
  file is read in all cases, if it exists. This permits
  passwords to be specified in a safer way than on the command
  line even when
  [`--no-defaults`](mysqlpump.html#option_mysqlpump_no-defaults) is used. To
  create `.mylogin.cnf`, use the
  [**mysql\_config\_editor**](mysql-config-editor.html "6.6.7 mysql_config_editor — MySQL Configuration Utility") utility. See
  [Section 6.6.7, “mysql\_config\_editor — MySQL Configuration Utility”](mysql-config-editor.html "6.6.7 mysql_config_editor — MySQL Configuration Utility").

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--parallel-schemas=[N:]db_list`](mysqlpump.html#option_mysqlpump_parallel-schemas)

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-locks</code></td>
</tr></tbody></table>0

  Create a queue for processing the databases in
  *`db_list`*, which is a list of one
  or more comma-separated database names. If
  *`N`* is given, the queue uses
  *`N`* threads. If
  *`N`* is not given, the
  [`--default-parallelism`](mysqlpump.html#option_mysqlpump_default-parallelism)
  option determines the number of queue threads.

  Multiple instances of this option create multiple queues.
  [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") also creates a default queue to
  use for databases not named in any
  [`--parallel-schemas`](mysqlpump.html#option_mysqlpump_parallel-schemas) option,
  and for dumping user definitions if command options select
  them. For more information, see
  [mysqlpump Parallel Processing](mysqlpump.html#mysqlpump-parallelism "mysqlpump Parallel Processing").

* [`--password[=password]`](mysqlpump.html#option_mysqlpump_password),
  `-p[password]`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-locks</code></td>
</tr></tbody></table>1

  The password of the MySQL account used for connecting to the
  server. The password value is optional. If not given,
  [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") prompts for one. If given,
  there must be *no space* between
  [`--password=`](mysqlpump.html#option_mysqlpump_password) or
  `-p` and the password following it. If no
  password option is specified, the default is to send no
  password.

  Specifying a password on the command line should be
  considered insecure. To avoid giving the password on the
  command line, use an option file. See
  [Section 8.1.2.1, “End-User Guidelines for Password Security”](password-security-user.html "8.1.2.1 End-User Guidelines for Password Security").

  To explicitly specify that there is no password and that
  [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") should not prompt for one, use
  the
  [`--skip-password`](mysqlpump.html#option_mysqlpump_password)
  option.

* [`--password1[=pass_val]`](mysqlpump.html#option_mysqlpump_password1)

  The password for multifactor authentication factor 1 of the
  MySQL account used for connecting to the server. The
  password value is optional. If not given,
  [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") prompts for one. If given,
  there must be *no space* between
  [`--password1=`](mysqlpump.html#option_mysqlpump_password1) and the
  password following it. If no password option is specified,
  the default is to send no password.

  Specifying a password on the command line should be
  considered insecure. To avoid giving the password on the
  command line, use an option file. See
  [Section 8.1.2.1, “End-User Guidelines for Password Security”](password-security-user.html "8.1.2.1 End-User Guidelines for Password Security").

  To explicitly specify that there is no password and that
  [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") should not prompt for one, use
  the
  [`--skip-password1`](mysqlpump.html#option_mysqlpump_password1)
  option.

  [`--password1`](mysqlpump.html#option_mysqlpump_password1) and
  [`--password`](mysqlpump.html#option_mysqlpump_password) are synonymous,
  as are
  [`--skip-password1`](mysqlpump.html#option_mysqlpump_password1)
  and
  [`--skip-password`](mysqlpump.html#option_mysqlpump_password).

* [`--password2[=pass_val]`](mysqlpump.html#option_mysqlpump_password2)

  The password for multifactor authentication factor 2 of the
  MySQL account used for connecting to the server. The
  semantics of this option are similar to the semantics for
  [`--password1`](mysqlpump.html#option_mysqlpump_password1); see the
  description of that option for details.

* [`--password3[=pass_val]`](mysqlpump.html#option_mysqlpump_password3)

  The password for multifactor authentication factor 3 of the
  MySQL account used for connecting to the server. The
  semantics of this option are similar to the semantics for
  [`--password1`](mysqlpump.html#option_mysqlpump_password1); see the
  description of that option for details.

* [`--plugin-dir=dir_name`](mysqlpump.html#option_mysqlpump_plugin-dir)

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-locks</code></td>
</tr></tbody></table>2

  The directory in which to look for plugins. Specify this
  option if the
  [`--default-auth`](mysqlpump.html#option_mysqlpump_default-auth) option is
  used to specify an authentication plugin but
  [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") does not find it. See
  [Section 8.2.17, “Pluggable Authentication”](pluggable-authentication.html "8.2.17 Pluggable Authentication").

* [`--port=port_num`](mysqlpump.html#option_mysqlpump_port),
  `-P port_num`

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-locks</code></td>
</tr></tbody></table>3

  For TCP/IP connections, the port number to use.

* [`--print-defaults`](mysqlpump.html#option_mysqlpump_print-defaults)

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-locks</code></td>
</tr></tbody></table>4

  Print the program name and all options that it gets from
  option files.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--protocol={TCP|SOCKET|PIPE|MEMORY}`](mysqlpump.html#option_mysqlpump_protocol)

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-locks</code></td>
</tr></tbody></table>5

  The transport protocol to use for connecting to the server.
  It is useful when the other connection parameters normally
  result in use of a protocol other than the one you want. For
  details on the permissible values, see
  [Section 6.2.7, “Connection Transport Protocols”](transport-protocols.html "6.2.7 Connection Transport Protocols").

* [`--replace`](mysqlpump.html#option_mysqlpump_replace)

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-locks</code></td>
</tr></tbody></table>6

  Write [`REPLACE`](replace.html "15.2.12 REPLACE Statement") statements
  rather than [`INSERT`](insert.html "15.2.7 INSERT Statement")
  statements.

* [`--result-file=file_name`](mysqlpump.html#option_mysqlpump_result-file)

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-locks</code></td>
</tr></tbody></table>7

  Direct output to the named file. The result file is created
  and its previous contents overwritten, even if an error
  occurs while generating the dump.

  This option should be used on Windows to prevent newline
  `\n` characters from being converted to
  `\r\n` carriage return/newline sequences.

* [`--routines`](mysqlpump.html#option_mysqlpump_routines)

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-locks</code></td>
</tr></tbody></table>8

  Include stored routines (procedures and functions) for the
  dumped databases in the output. This option requires the
  global [`SELECT`](privileges-provided.html#priv_select) privilege.

  The output generated by using
  [`--routines`](mysqlpump.html#option_mysqlpump_routines) contains
  [`CREATE PROCEDURE`](create-procedure.html "15.1.17 CREATE PROCEDURE and CREATE FUNCTION Statements") and
  [`CREATE FUNCTION`](create-function.html "15.1.14 CREATE FUNCTION Statement") statements to
  create the routines.

  This option is enabled by default; use
  [`--skip-routines`](mysqlpump.html#option_mysqlpump_routines)
  to disable it.

* [`--server-public-key-path=file_name`](mysqlpump.html#option_mysqlpump_server-public-key-path)

  <table frame="box" rules="all" summary="Properties for add-locks"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-locks</code></td>
</tr></tbody></table>9

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
  [`--server-public-key-path=file_name`](mysqlpump.html#option_mysqlpump_server-public-key-path)
  is given and specifies a valid public key file, it takes
  precedence over
  [`--get-server-public-key`](mysqlpump.html#option_mysqlpump_get-server-public-key).

  For `sha256_password`, this option applies
  only if MySQL was built using OpenSSL.

  For information about the `sha256_password`
  and `caching_sha2_password` plugins, see
  [Section 8.4.1.3, “SHA-256 Pluggable Authentication”](sha256-pluggable-authentication.html "8.4.1.3 SHA-256 Pluggable Authentication"), and
  [Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”](caching-sha2-pluggable-authentication.html "8.4.1.2 Caching SHA-2 Pluggable Authentication").

* [`--set-charset`](mysqlpump.html#option_mysqlpump_set-charset)

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--all-databases</code></td>
</tr></tbody></table>0

  Write [`SET NAMES
  default_character_set`](set-names.html "15.7.6.3 SET NAMES Statement")
  to the output.

  This option is enabled by default. To disable it and
  suppress the [`SET NAMES`](set-names.html "15.7.6.3 SET NAMES Statement")
  statement, use
  [`--skip-set-charset`](mysqlpump.html#option_mysqlpump_set-charset).

* `--set-gtid-purged=value`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--all-databases</code></td>
</tr></tbody></table>1

  This option enables control over global transaction ID
  (GTID) information written to the dump file, by indicating
  whether to add a
  [`SET
  @@GLOBAL.gtid_purged`](set-variable.html "15.7.6.1 SET Syntax for Variable Assignment") statement to the output. This
  option may also cause a statement to be written to the
  output that disables binary logging while the dump file is
  being reloaded.

  The following table shows the permitted option values. The
  default value is `AUTO`.

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--all-databases</code></td>
</tr></tbody></table>2

  The `--set-gtid-purged` option has the
  following effect on binary logging when the dump file is
  reloaded:

  + `--set-gtid-purged=OFF`: `SET
    @@SESSION.SQL_LOG_BIN=0;` is not added to the
    output.

  + `--set-gtid-purged=ON`: `SET
    @@SESSION.SQL_LOG_BIN=0;` is added to the
    output.

  + `--set-gtid-purged=AUTO`: `SET
    @@SESSION.SQL_LOG_BIN=0;` is added to the
    output if GTIDs are enabled on the server you are
    backing up (that is, if `AUTO`
    evaluates to `ON`).

* [`--single-transaction`](mysqlpump.html#option_mysqlpump_single-transaction)

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--all-databases</code></td>
</tr></tbody></table>3

  This option sets the transaction isolation mode to
  [`REPEATABLE READ`](innodb-transaction-isolation-levels.html#isolevel_repeatable-read) and sends
  a [`START
  TRANSACTION`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") SQL statement to the server before
  dumping data. It is useful only with transactional tables
  such as `InnoDB`, because then it dumps the
  consistent state of the database at the time when
  [`START
  TRANSACTION`](commit.html "15.3.1 START TRANSACTION, COMMIT, and ROLLBACK Statements") was issued without blocking any
  applications.

  When using this option, you should keep in mind that only
  `InnoDB` tables are dumped in a consistent
  state. For example, any `MyISAM` or
  `MEMORY` tables dumped while using this
  option may still change state.

  While a
  [`--single-transaction`](mysqlpump.html#option_mysqlpump_single-transaction) dump
  is in process, to ensure a valid dump file (correct table
  contents and binary log coordinates), no other connection
  should use the following statements:
  [`ALTER TABLE`](alter-table.html "15.1.9 ALTER TABLE Statement"),
  [`CREATE TABLE`](create-table.html "15.1.20 CREATE TABLE Statement"),
  [`DROP TABLE`](drop-table.html "15.1.32 DROP TABLE Statement"),
  [`RENAME TABLE`](rename-table.html "15.1.36 RENAME TABLE Statement"),
  [`TRUNCATE TABLE`](truncate-table.html "15.1.37 TRUNCATE TABLE Statement"). A consistent
  read is not isolated from those statements, so use of them
  on a table to be dumped can cause the
  [`SELECT`](select.html "15.2.13 SELECT Statement") that is performed by
  [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") to retrieve the table contents
  to obtain incorrect contents or fail.

  [`--add-locks`](mysqlpump.html#option_mysqlpump_add-locks) and
  [`--single-transaction`](mysqlpump.html#option_mysqlpump_single-transaction) are
  mutually exclusive.

* [`--skip-definer`](mysqlpump.html#option_mysqlpump_skip-definer)

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--all-databases</code></td>
</tr></tbody></table>4

  Omit `DEFINER` and `SQL
  SECURITY` clauses from the
  `CREATE` statements for views and stored
  programs. The dump file, when reloaded, creates objects that
  use the default `DEFINER` and `SQL
  SECURITY` values. See
  [Section 27.6, “Stored Object Access Control”](stored-objects-security.html "27.6 Stored Object Access Control").

* [`--skip-dump-rows`](mysqlpump.html#option_mysqlpump_skip-dump-rows),
  `-d`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--all-databases</code></td>
</tr></tbody></table>5

  Do not dump table rows.

* [`--skip-generated-invisible-primary-key`](mysqlpump.html#option_mysqlpump_skip-generated-invisible-primary-key)

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--all-databases</code></td>
</tr></tbody></table>6

  This option is available beginning with MySQL 8.0.30, and
  causes generated invisible primary keys (GIPKs) to be
  excluded from the dump. See
  [Section 15.1.20.11, “Generated Invisible Primary Keys”](create-table-gipks.html "15.1.20.11 Generated Invisible Primary Keys"), for more information
  about GIPKs and GIPK mode.

* [`--socket=path`](mysqlpump.html#option_mysqlpump_socket),
  `-S path`

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--all-databases</code></td>
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

* [`--ssl-fips-mode={OFF|ON|STRICT}`](mysqlpump.html#option_mysqlpump_ssl-fips-mode)

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--all-databases</code></td>
</tr></tbody></table>8

  Controls whether to enable FIPS mode on the client side. The
  [`--ssl-fips-mode`](mysqlpump.html#option_mysqlpump_ssl-fips-mode) option
  differs from other
  `--ssl-xxx`
  options in that it is not used to establish encrypted
  connections, but rather to affect which cryptographic
  operations to permit. See [Section 8.8, “FIPS Support”](fips-mode.html "8.8 FIPS Support").

  These [`--ssl-fips-mode`](mysqlpump.html#option_mysqlpump_ssl-fips-mode)
  values are permitted:

  + `OFF`: Disable FIPS mode.
  + `ON`: Enable FIPS mode.
  + `STRICT`: Enable “strict”
    FIPS mode.

  Note

  If the OpenSSL FIPS Object Module is not available, the
  only permitted value for
  [`--ssl-fips-mode`](mysqlpump.html#option_mysqlpump_ssl-fips-mode) is
  `OFF`. In this case, setting
  [`--ssl-fips-mode`](mysqlpump.html#option_mysqlpump_ssl-fips-mode) to
  `ON` or `STRICT` causes
  the client to produce a warning at startup and to operate
  in non-FIPS mode.

  As of MySQL 8.0.34, this option is deprecated. Expect it to
  be removed in a future version of MySQL.

* [`--tls-ciphersuites=ciphersuite_list`](mysqlpump.html#option_mysqlpump_tls-ciphersuites)

  <table frame="box" rules="all" summary="Properties for all-databases"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--all-databases</code></td>
</tr></tbody></table>9

  The permissible ciphersuites for encrypted connections that
  use TLSv1.3. The value is a list of one or more
  colon-separated ciphersuite names. The ciphersuites that can
  be named for this option depend on the SSL library used to
  compile MySQL. For details, see
  [Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”](encrypted-connection-protocols-ciphers.html "8.3.2 Encrypted Connection TLS Protocols and Ciphers").

  This option was added in MySQL 8.0.16.

* [`--tls-version=protocol_list`](mysqlpump.html#option_mysqlpump_tls-version)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>0

  The permissible TLS protocols for encrypted connections. The
  value is a list of one or more comma-separated protocol
  names. The protocols that can be named for this option
  depend on the SSL library used to compile MySQL. For
  details, see
  [Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”](encrypted-connection-protocols-ciphers.html "8.3.2 Encrypted Connection TLS Protocols and Ciphers").

* [`--triggers`](mysqlpump.html#option_mysqlpump_triggers)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>1

  Include triggers for each dumped table in the output.

  This option is enabled by default; use
  [`--skip-triggers`](mysqlpump.html#option_mysqlpump_triggers)
  to disable it.

* [`--tz-utc`](mysqlpump.html#option_mysqlpump_tz-utc)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>2

  This option enables [`TIMESTAMP`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types")
  columns to be dumped and reloaded between servers in
  different time zones. [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") sets its
  connection time zone to UTC and adds `SET
  TIME_ZONE='+00:00'` to the dump file. Without this
  option, [`TIMESTAMP`](datetime.html "13.2.2 The DATE, DATETIME, and TIMESTAMP Types") columns are
  dumped and reloaded in the time zones local to the source
  and destination servers, which can cause the values to
  change if the servers are in different time zones.
  [`--tz-utc`](mysqlpump.html#option_mysqlpump_tz-utc) also protects
  against changes due to daylight saving time.

  This option is enabled by default; use
  [`--skip-tz-utc`](mysqlpump.html#option_mysqlpump_tz-utc)
  to disable it.

* [`--user=user_name`](mysqlpump.html#option_mysqlpump_user),
  `-u user_name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>3

  The user name of the MySQL account to use for connecting to
  the server.

  If you are using the `Rewriter` plugin with
  MySQL 8.0.31 or later, you should grant this user the
  [`SKIP_QUERY_REWRITE`](privileges-provided.html#priv_skip-query-rewrite) privilege.

* [`--users`](mysqlpump.html#option_mysqlpump_users)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>4

  Dump user accounts as logical definitions in the form of
  [`CREATE USER`](create-user.html "15.7.1.3 CREATE USER Statement") and
  [`GRANT`](grant.html "15.7.1.6 GRANT Statement") statements.

  User definitions are stored in the grant tables in the
  `mysql` system database. By default,
  [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") does not include the grant
  tables in `mysql` database dumps. To dump
  the contents of the grant tables as logical definitions, use
  the [`--users`](mysqlpump.html#option_mysqlpump_users) option and
  suppress all database dumping:

  ```
  mysqlpump --exclude-databases=% --users
  ```

* [`--version`](mysqlpump.html#option_mysqlpump_version),
  `-V`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>5

  Display version information and exit.

* [`--watch-progress`](mysqlpump.html#option_mysqlpump_watch-progress)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>6

  Periodically display a progress indicator that provides
  information about the completed and total number of tables,
  rows, and other objects.

  This option is enabled by default; use
  [`--skip-watch-progress`](mysqlpump.html#option_mysqlpump_watch-progress)
  to disable it.

* [`--zstd-compression-level=level`](mysqlpump.html#option_mysqlpump_zstd-compression-level)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=ip_address</code></td>
</tr></tbody></table>7

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

#### mysqlpump Object Selection

[**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") has a set of inclusion and
exclusion options that enable filtering of several object types
and provide flexible control over which objects to dump:

* [`--include-databases`](mysqlpump.html#option_mysqlpump_include-databases) and
  [`--exclude-databases`](mysqlpump.html#option_mysqlpump_exclude-databases) apply
  to databases and all objects within them.

* [`--include-tables`](mysqlpump.html#option_mysqlpump_include-tables) and
  [`--exclude-tables`](mysqlpump.html#option_mysqlpump_exclude-tables) apply to
  tables. These options also affect triggers associated with
  tables unless the trigger-specific options are given.

* [`--include-triggers`](mysqlpump.html#option_mysqlpump_include-triggers) and
  [`--exclude-triggers`](mysqlpump.html#option_mysqlpump_exclude-triggers) apply
  to triggers.

* [`--include-routines`](mysqlpump.html#option_mysqlpump_include-routines) and
  [`--exclude-routines`](mysqlpump.html#option_mysqlpump_exclude-routines) apply
  to stored procedures and functions. If a routine option
  matches a stored procedure name, it also matches a stored
  function of the same name.

* [`--include-events`](mysqlpump.html#option_mysqlpump_include-events) and
  [`--exclude-events`](mysqlpump.html#option_mysqlpump_exclude-events) apply to
  Event Scheduler events.

* [`--include-users`](mysqlpump.html#option_mysqlpump_include-users) and
  [`--exclude-users`](mysqlpump.html#option_mysqlpump_exclude-users) apply to
  user accounts.

Any inclusion or exclusion option may be given multiple times.
The effect is additive. Order of these options does not matter.

The value of each inclusion and exclusion option is a list of
comma-separated names of the appropriate object type. For
example:

```
--exclude-databases=test,world
--include-tables=customer,invoice
```

Wildcard characters are permitted in the object names:

* `%` matches any sequence of zero or more
  characters.

* `_` matches any single character.

For example,
[`--include-tables=t%,__tmp`](mysqlpump.html#option_mysqlpump_include-tables)
matches all table names that begin with `t` and
all five-character table names that end with
`tmp`.

For users, a name specified without a host part is interpreted
with an implied host of `%`. For example,
`u1` and `u1@%` are
equivalent. This is the same equivalence that applies in MySQL
generally (see [Section 8.2.4, “Specifying Account Names”](account-names.html "8.2.4 Specifying Account Names")).

Inclusion and exclusion options interact as follows:

* By default, with no inclusion or exclusion options,
  [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") dumps all databases (with
  certain exceptions noted in
  [mysqlpump Restrictions](mysqlpump.html#mysqlpump-restrictions "mysqlpump Restrictions")).

* If inclusion options are given in the absence of exclusion
  options, only the objects named as included are dumped.

* If exclusion options are given in the absence of inclusion
  options, all objects are dumped except those named as
  excluded.

* If inclusion and exclusion options are given, all objects
  named as excluded and not named as included are not dumped.
  All other objects are dumped.

If multiple databases are being dumped, it is possible to name
tables, triggers, and routines in a specific database by
qualifying the object names with the database name. The
following command dumps databases `db1` and
`db2`, but excludes tables
`db1.t1` and `db2.t2`:

```
mysqlpump --include-databases=db1,db2 --exclude-tables=db1.t1,db2.t2
```

The following options provide alternative ways to specify which
databases to dump:

* The [`--all-databases`](mysqlpump.html#option_mysqlpump_all-databases) option
  dumps all databases (with certain exceptions noted in
  [mysqlpump Restrictions](mysqlpump.html#mysqlpump-restrictions "mysqlpump Restrictions")). It is equivalent
  to specifying no object options at all (the default
  [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") action is to dump everything).

  [`--include-databases=%`](mysqlpump.html#option_mysqlpump_include-databases) is
  similar to
  [`--all-databases`](mysqlpump.html#option_mysqlpump_all-databases), but
  selects all databases for dumping, even those that are
  exceptions for
  [`--all-databases`](mysqlpump.html#option_mysqlpump_all-databases).

* The [`--databases`](mysqlpump.html#option_mysqlpump_databases) option
  causes [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") to treat all name
  arguments as names of databases to dump. It is equivalent to
  an [`--include-databases`](mysqlpump.html#option_mysqlpump_include-databases)
  option that names the same databases.

#### mysqlpump Parallel Processing

[**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") can use parallelism to achieve
concurrent processing. You can select concurrency between
databases (to dump multiple databases simultaneously) and within
databases (to dump multiple objects from a given database
simultaneously).

By default, [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") sets up one queue with
two threads. You can create additional queues and control the
number of threads assigned to each one, including the default
queue:

* [`--default-parallelism=N`](mysqlpump.html#option_mysqlpump_default-parallelism)
  specifies the default number of threads used for each queue.
  In the absence of this option, *`N`*
  is 2.

  The default queue always uses the default number of threads.
  Additional queues use the default number of threads unless
  you specify otherwise.

* [`--parallel-schemas=[N:]db_list`](mysqlpump.html#option_mysqlpump_parallel-schemas)
  sets up a processing queue for dumping the databases named
  in *`db_list`* and optionally
  specifies how many threads the queue uses.
  *`db_list`* is a list of
  comma-separated database names. If the option argument
  begins with
  `N:`, the queue
  uses *`N`* threads. Otherwise, the
  [`--default-parallelism`](mysqlpump.html#option_mysqlpump_default-parallelism)
  option determines the number of queue threads.

  Multiple instances of the
  [`--parallel-schemas`](mysqlpump.html#option_mysqlpump_parallel-schemas) option
  create multiple queues.

  Names in the database list are permitted to contain the same
  `%` and `_` wildcard
  characters supported for filtering options (see
  [mysqlpump Object Selection](mysqlpump.html#mysqlpump-filtering "mysqlpump Object Selection")).

[**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") uses the default queue for
processing any databases not named explicitly with a
[`--parallel-schemas`](mysqlpump.html#option_mysqlpump_parallel-schemas) option, and
for dumping user definitions if command options select them.

In general, with multiple queues, [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program")
uses parallelism between the sets of databases processed by the
queues, to dump multiple databases simultaneously. For a queue
that uses multiple threads, [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") uses
parallelism within databases, to dump multiple objects from a
given database simultaneously. Exceptions can occur; for
example, [**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") may block queues while it
obtains from the server lists of objects in databases.

With parallelism enabled, it is possible for output from
different databases to be interleaved. For example,
[`INSERT`](insert.html "15.2.7 INSERT Statement") statements from multiple
tables dumped in parallel can be interleaved; the statements are
not written in any particular order. This does not affect
reloading because output statements qualify object names with
database names or are preceded by
[`USE`](use.html "15.8.4 USE Statement") statements as required.

The granularity for parallelism is a single database object. For
example, a single table cannot be dumped in parallel using
multiple threads.

Examples:

```
mysqlpump --parallel-schemas=db1,db2 --parallel-schemas=db3
```

[**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") sets up a queue to process
`db1` and `db2`, another queue
to process `db3`, and a default queue to
process all other databases. All queues use two threads.

```
mysqlpump --parallel-schemas=db1,db2 --parallel-schemas=db3
          --default-parallelism=4
```

This is the same as the previous example except that all queues
use four threads.

```
mysqlpump --parallel-schemas=5:db1,db2 --parallel-schemas=3:db3
```

The queue for `db1` and `db2`
uses five threads, the queue for `db3` uses
three threads, and the default queue uses the default of two
threads.

As a special case, with
[`--default-parallelism=0`](mysqlpump.html#option_mysqlpump_default-parallelism) and no
[`--parallel-schemas`](mysqlpump.html#option_mysqlpump_parallel-schemas) options,
[**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") runs as a single-threaded process
and creates no queues.

#### mysqlpump Restrictions

[**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") does not dump the
`performance_schema`,
`ndbinfo`, or `sys` schema by
default. To dump any of these, name them explicitly on the
command line. You can also name them with the
[`--databases`](mysqlpump.html#option_mysqlpump_databases) or
[`--include-databases`](mysqlpump.html#option_mysqlpump_include-databases) option.

[**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") does not dump the
`INFORMATION_SCHEMA` schema.

[**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") does not dump
`InnoDB` [`CREATE
TABLESPACE`](create-tablespace.html "15.1.21 CREATE TABLESPACE Statement") statements.

[**mysqlpump**](mysqlpump.html "6.5.6 mysqlpump — A Database Backup Program") dumps user accounts in logical form
using [`CREATE USER`](create-user.html "15.7.1.3 CREATE USER Statement") and
[`GRANT`](grant.html "15.7.1.6 GRANT Statement") statements (for example,
when you use the
[`--include-users`](mysqlpump.html#option_mysqlpump_include-users) or
[`--users`](mysqlpump.html#option_mysqlpump_users) option). For this
reason, dumps of the `mysql` system database do
not by default include the grant tables that contain user
definitions: `user`, `db`,
`tables_priv`, `columns_priv`,
`procs_priv`, or
`proxies_priv`. To dump any of the grant
tables, name the `mysql` database followed by
the table names:

```
mysqlpump mysql user db ...
```