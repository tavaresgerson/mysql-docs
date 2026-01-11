### 6.5.6 mysqlpump — A Database Backup Program

* mysqlpump Invocation Syntax
* mysqlpump Option Summary
* mysqlpump Option Descriptions
* mysqlpump Object Selection
* mysqlpump Parallel Processing
* mysqlpump Restrictions

The **mysqlpump** client utility performs logical backups, producing a set of SQL statements that can be executed to reproduce the original database object definitions and table data. It dumps one or more MySQL databases for backup or transfer to another SQL server.

Note

**mysqlpump** is deprecated as of MySQL 8.0.34; expect it to be removed in a future version of MySQL. You can use such MySQL programs as **mysqldump** and MySQL Shell to perform logical backups, dump databases, and similar tasks instead.

Tip

Consider using the MySQL Shell dump utilities, which provide parallel dumping with multiple threads, file compression, and progress information display, as well as cloud features such as Oracle Cloud Infrastructure Object Storage streaming, and MySQL HeatWave compatibility checks and modifications. Dumps can be easily imported into a MySQL Server instance or a MySQL HeatWave DB System using the MySQL Shell load dump utilities. Installation instructions for MySQL Shell can be found here.

**mysqlpump** features include:

* Parallel processing of databases, and of objects within databases, to speed up the dump process

* Better control over which databases and database objects (tables, stored programs, user accounts) to dump

* Dumping of user accounts as account-management statements (`CREATE USER`, `GRANT`) rather than as inserts into the `mysql` system database

* Capability of creating compressed output
* Progress indicator (the values are estimates)
* For dump file reloading, faster secondary index creation for `InnoDB` tables by adding indexes after rows are inserted

Note

**mysqlpump** uses MySQL features introduced in MySQL 5.7, and thus assumes use with MySQL 5.7 or higher.

**mysqlpump** requires at least the `SELECT` privilege for dumped tables, `SHOW VIEW` for dumped views, `TRIGGER` for dumped triggers, and `LOCK TABLES` if the `--single-transaction` option is not used. The `SELECT` privilege on the `mysql` system database is required to dump user definitions. Certain options might require other privileges as noted in the option descriptions.

To reload a dump file, you must have the privileges required to execute the statements that it contains, such as the appropriate `CREATE` privileges for objects created by those statements.

Note

A dump made using PowerShell on Windows with output redirection creates a file that has UTF-16 encoding:

```
mysqlpump [options] > dump.sql
```

However, UTF-16 is not permitted as a connection character set (see Section 12.4, “Connection Character Sets and Collations”), so the dump file cannot be loaded correctly. To work around this issue, use the `--result-file` option, which creates the output in ASCII format:

```
mysqlpump [options] --result-file=dump.sql
```

#### mysqlpump Invocation Syntax

By default, **mysqlpump** dumps all databases (with certain exceptions noted in mysqlpump Restrictions). To specify this behavior explicitly, use the `--all-databases` option:

```
mysqlpump --all-databases
```

To dump a single database, or certain tables within that database, name the database on the command line, optionally followed by table names:

```
mysqlpump db_name
mysqlpump db_name tbl_name1 tbl_name2 ...
```

To treat all name arguments as database names, use the `--databases` option:

```
mysqlpump --databases db_name1 db_name2 ...
```

By default, **mysqlpump** does not dump user account definitions, even if you dump the `mysql` system database that contains the grant tables. To dump grant table contents as logical definitions in the form of `CREATE USER` and `GRANT` statements, use the `--users` option and suppress all database dumping:

```
mysqlpump --exclude-databases=% --users
```

In the preceding command, `%` is a wildcard that matches all database names for the `--exclude-databases` option.

**mysqlpump** supports several options for including or excluding databases, tables, stored programs, and user definitions. See mysqlpump Object Selection.

To reload a dump file, execute the statements that it contains. For example, use the **mysql** client:

```
mysqlpump [options] > dump.sql
mysql < dump.sql
```

The following discussion provides additional **mysqlpump** usage examples.

To see a list of the options **mysqlpump** supports, issue the command **mysqlpump --help**.

#### mysqlpump Option Summary

**mysqlpump** supports the following options, which can be specified on the command line or in the `[mysqlpump]` and `[client]` groups of an option file. (Prior to MySQL 8.0.20, **mysqlpump** read the `[mysql_dump]` group rather than `[mysqlpump]`. As of 8.0.20, `[mysql_dump]` is still accepted but is deprecated.) For information about option files used by MySQL programs, see Section 6.2.2.2, “Using Option Files”.

**Table 6.17 mysqlpump Options**

<table summary="Command-line options available for mysqlpump."><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th>--add-drop-database</th> <td>Add DROP DATABASE statement before each CREATE DATABASE statement</td> <td></td> <td></td> </tr><tr><th>--add-drop-table</th> <td>Add DROP TABLE statement before each CREATE TABLE statement</td> <td></td> <td></td> </tr><tr><th>--add-drop-user</th> <td>Add DROP USER statement before each CREATE USER statement</td> <td></td> <td></td> </tr><tr><th>--add-locks</th> <td>Surround each table dump with LOCK TABLES and UNLOCK TABLES statements</td> <td></td> <td></td> </tr><tr><th>--all-databases</th> <td>Dump all databases</td> <td></td> <td></td> </tr><tr><th>--bind-address</th> <td>Use specified network interface to connect to MySQL Server</td> <td></td> <td></td> </tr><tr><th>--character-sets-dir</th> <td>Directory where character sets are installed</td> <td></td> <td></td> </tr><tr><th>--column-statistics</th> <td>Write ANALYZE TABLE statements to generate statistics histograms</td> <td></td> <td></td> </tr><tr><th>--complete-insert</th> <td>Use complete INSERT statements that include column names</td> <td></td> <td></td> </tr><tr><th>--compress</th> <td>Compress all information sent between client and server</td> <td></td> <td>8.0.18</td> </tr><tr><th>--compress-output</th> <td>Output compression algorithm</td> <td></td> <td></td> </tr><tr><th>--compression-algorithms</th> <td>Permitted compression algorithms for connections to server</td> <td>8.0.18</td> <td></td> </tr><tr><th>--databases</th> <td>Interpret all name arguments as database names</td> <td></td> <td></td> </tr><tr><th>--debug</th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th>--debug-check</th> <td>Print debugging information when program exits</td> <td></td> <td></td> </tr><tr><th>--debug-info</th> <td>Print debugging information, memory, and CPU statistics when program exits</td> <td></td> <td></td> </tr><tr><th>--default-auth</th> <td>Authentication plugin to use</td> <td></td> <td></td> </tr><tr><th>--default-character-set</th> <td>Specify default character set</td> <td></td> <td></td> </tr><tr><th>--default-parallelism</th> <td>Default number of threads for parallel processing</td> <td></td> <td></td> </tr><tr><th>--defaults-extra-file</th> <td>Read named option file in addition to usual option files</td> <td></td> <td></td> </tr><tr><th>--defaults-file</th> <td>Read only named option file</td> <td></td> <td></td> </tr><tr><th>--defaults-group-suffix</th> <td>Option group suffix value</td> <td></td> <td></td> </tr><tr><th>--defer-table-indexes</th> <td>For reloading, defer index creation until after loading table rows</td> <td></td> <td></td> </tr><tr><th>--events</th> <td>Dump events from dumped databases</td> <td></td> <td></td> </tr><tr><th>--exclude-databases</th> <td>Databases to exclude from dump</td> <td></td> <td></td> </tr><tr><th>--exclude-events</th> <td>Events to exclude from dump</td> <td></td> <td></td> </tr><tr><th>--exclude-routines</th> <td>Routines to exclude from dump</td> <td></td> <td></td> </tr><tr><th>--exclude-tables</th> <td>Tables to exclude from dump</td> <td></td> <td></td> </tr><tr><th>--exclude-triggers</th> <td>Triggers to exclude from dump</td> <td></td> <td></td> </tr><tr><th>--exclude-users</th> <td>Users to exclude from dump</td> <td></td> <td></td> </tr><tr><th>--extended-insert</th> <td>Use multiple-row INSERT syntax</td> <td></td> <td></td> </tr><tr><th>--get-server-public-key</th> <td>Request RSA public key from server</td> <td></td> <td></td> </tr><tr><th>--help</th> <td>Display help message and exit</td> <td></td> <td></td> </tr><tr><th>--hex-blob</th> <td>Dump binary columns using hexadecimal notation</td> <td></td> <td></td> </tr><tr><th>--host</th> <td>Host on which MySQL server is located</td> <td></td> <td></td> </tr><tr><th>--include-databases</th> <td>Databases to include in dump</td> <td></td> <td></td> </tr><tr><th>--include-events</th> <td>Events to include in dump</td> <td></td> <td></td> </tr><tr><th>--include-routines</th> <td>Routines to include in dump</td> <td></td> <td></td> </tr><tr><th>--include-tables</th> <td>Tables to include in dump</td> <td></td> <td></td> </tr><tr><th>--include-triggers</th> <td>Triggers to include in dump</td> <td></td> <td></td> </tr><tr><th>--include-users</th> <td>Users to include in dump</td> <td></td> <td></td> </tr><tr><th>--insert-ignore</th> <td>Write INSERT IGNORE rather than INSERT statements</td> <td></td> <td></td> </tr><tr><th>--log-error-file</th> <td>Append warnings and errors to named file</td> <td></td> <td></td> </tr><tr><th>--login-path</th> <td>Read login path options from .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th>--max-allowed-packet</th> <td>Maximum packet length to send to or receive from server</td> <td></td> <td></td> </tr><tr><th>--net-buffer-length</th> <td>Buffer size for TCP/IP and socket communication</td> <td></td> <td></td> </tr><tr><th>--no-create-db</th> <td>Do not write CREATE DATABASE statements</td> <td></td> <td></td> </tr><tr><th>--no-create-info</th> <td>Do not write CREATE TABLE statements that re-create each dumped table</td> <td></td> <td></td> </tr><tr><th>--no-defaults</th> <td>Read no option files</td> <td></td> <td></td> </tr><tr><th>--parallel-schemas</th> <td>Specify schema-processing parallelism</td> <td></td> <td></td> </tr><tr><th>--password</th> <td>Password to use when connecting to server</td> <td></td> <td></td> </tr><tr><th>--password1</th> <td>First multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th>--password2</th> <td>Second multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th>--password3</th> <td>Third multifactor authentication password to use when connecting to server</td> <td>8.0.27</td> <td></td> </tr><tr><th>--plugin-dir</th> <td>Directory where plugins are installed</td> <td></td> <td></td> </tr><tr><th>--port</th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th>--print-defaults</th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th>--protocol</th> <td>Transport protocol to use</td> <td></td> <td></td> </tr><tr><th>--replace</th> <td>Write REPLACE statements rather than INSERT statements</td> <td></td> <td></td> </tr><tr><th>--result-file</th> <td>Direct output to a given file</td> <td></td> <td></td> </tr><tr><th>--routines</th> <td>Dump stored routines (procedures and functions) from dumped databases</td> <td></td> <td></td> </tr><tr><th>--server-public-key-path</th> <td>Path name to file containing RSA public key</td> <td></td> <td></td> </tr><tr><th>--set-charset</th> <td>Add SET NAMES default_character_set to output</td> <td></td> <td></td> </tr><tr><th>--set-gtid-purged</th> <td>Whether to add SET @@GLOBAL.GTID_PURGED to output</td> <td></td> <td></td> </tr><tr><th>--single-transaction</th> <td>Dump tables within single transaction</td> <td></td> <td></td> </tr><tr><th>--skip-definer</th> <td>Omit DEFINER and SQL SECURITY clauses from view and stored program CREATE statements</td> <td></td> <td></td> </tr><tr><th>--skip-dump-rows</th> <td>Do not dump table rows</td> <td></td> <td></td> </tr><tr><th>--skip-generated-invisible-primary-key</th> <td>Do not dump information about generated invisible primary keys</td> <td>8.0.30</td> <td></td> </tr><tr><th>--socket</th> <td>Unix socket file or Windows named pipe to use</td> <td></td> <td></td> </tr><tr><th>--ssl-ca</th> <td>File that contains list of trusted SSL Certificate Authorities</td> <td></td> <td></td> </tr><tr><th>--ssl-capath</th> <td>Directory that contains trusted SSL Certificate Authority certificate files</td> <td></td> <td></td> </tr><tr><th>--ssl-cert</th> <td>File that contains X.509 certificate</td> <td></td> <td></td> </tr><tr><th>--ssl-cipher</th> <td>Permissible ciphers for connection encryption</td> <td></td> <td></td> </tr><tr><th>--ssl-crl</th> <td>File that contains certificate revocation lists</td> <td></td> <td></td> </tr><tr><th>--ssl-crlpath</th> <td>Directory that contains certificate revocation-list files</td> <td></td> <td></td> </tr><tr><th>--ssl-fips-mode</th> <td>Whether to enable FIPS mode on client side</td> <td></td> <td>8.0.34</td> </tr><tr><th>--ssl-key</th> <td>File that contains X.509 key</td> <td></td> <td></td> </tr><tr><th>--ssl-mode</th> <td>Desired security state of connection to server</td> <td></td> <td></td> </tr><tr><th>--ssl-session-data</th> <td>File that contains SSL session data</td> <td>8.0.29</td> <td></td> </tr><tr><th>--ssl-session-data-continue-on-failed-reuse</th> <td>Whether to establish connections if session reuse fails</td> <td>8.0.29</td> <td></td> </tr><tr><th>--tls-ciphersuites</th> <td>Permissible TLSv1.3 ciphersuites for encrypted connections</td> <td>8.0.16</td> <td></td> </tr><tr><th>--tls-version</th> <td>Permissible TLS protocols for encrypted connections</td> <td></td> <td></td> </tr><tr><th>--triggers</th> <td>Dump triggers for each dumped table</td> <td></td> <td></td> </tr><tr><th>--tz-utc</th> <td>Add SET TIME_ZONE='+00:00' to dump file</td> <td></td> <td></td> </tr><tr><th>--user</th> <td>MySQL user name to use when connecting to server</td> <td></td> <td></td> </tr><tr><th>--users</th> <td>Dump user accounts</td> <td></td> <td></td> </tr><tr><th>--version</th> <td>Display version information and exit</td> <td></td> <td></td> </tr><tr><th>--watch-progress</th> <td>Display progress indicator</td> <td></td> <td></td> </tr><tr><th>--zstd-compression-level</th> <td>Compression level for connections to server that use zstd compression</td> <td>8.0.18</td> <td></td> </tr></tbody></table>

#### mysqlpump Option Descriptions

* `--help`, `-?`

  <table summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--add-drop-database`

  <table summary="Properties for add-drop-database"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>

  Write a `DROP DATABASE` statement before each `CREATE DATABASE` statement.

  Note

  In MySQL 8.0, the `mysql` schema is considered a system schema that cannot be dropped by end users. If `--add-drop-database` is used with `--all-databases` or with `--databases` where the list of schemas to be dumped includes `mysql`, the dump file contains a `` DROP DATABASE `mysql` `` statement that causes an error when the dump file is reloaded.

  Instead, to use `--add-drop-database`, use `--databases` with a list of schemas to be dumped, where the list does not include `mysql`.

* `--add-drop-table`

  <table summary="Properties for add-drop-table"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>

  Write a `DROP TABLE` statement before each `CREATE TABLE` statement.

* `--add-drop-user`

  <table summary="Properties for add-drop-user"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>

  Write a `DROP USER` statement before each `CREATE USER` statement.

* `--add-locks`

  <table summary="Properties for add-locks"><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>

  Surround each table dump with `LOCK TABLES` and `UNLOCK TABLES` statements. This results in faster inserts when the dump file is reloaded. See Section 10.2.5.1, “Optimizing INSERT Statements”.

  This option does not work with parallelism because `INSERT` statements from different tables can be interleaved and `UNLOCK TABLES` following the end of the inserts for one table could release locks on tables for which inserts remain.

  `--add-locks` and `--single-transaction` are mutually exclusive.

* `--all-databases`, `-A`

  <table summary="Properties for all-databases"><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>

  Dump all databases (with certain exceptions noted in mysqlpump Restrictions). This is the default behavior if no other is specified explicitly.

  `--all-databases` and `--databases` are mutually exclusive.

  Note

  See the `--add-drop-database` description for information about an incompatibility of that option with `--all-databases`.

  Prior to MySQL 8.0, the `--routines` and `--events` options for **mysqldump** and **mysqlpump** were not required to include stored routines and events when using the `--all-databases` option: The dump included the `mysql` system database, and therefore also the `mysql.proc` and `mysql.event` tables containing stored routine and event definitions. As of MySQL 8.0, the `mysql.event` and `mysql.proc` tables are not used. Definitions for the corresponding objects are stored in data dictionary tables, but those tables are not dumped. To include stored routines and events in a dump made using `--all-databases`, use the `--routines` and `--events` options explicitly.

* `--bind-address=ip_address`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>

  On a computer having multiple network interfaces, use this option to select which interface to use for connecting to the MySQL server.

* `--character-sets-dir=path`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The directory where character sets are installed. See Section 12.15, “Character Set Configuration”.

* `--column-statistics`

  <table summary="Properties for column-statistics"><tbody><tr><th>Command-Line Format</th> <td><code>--column-statistics</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>OFF</code></td> </tr></tbody></table>

  Add `ANALYZE TABLE` statements to the output to generate histogram statistics for dumped tables when the dump file is reloaded. This option is disabled by default because histogram generation for large tables can take a long time.

* `--complete-insert`

  <table summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>0

  Write complete `INSERT` statements that include column names.

* `--compress`, `-C`

  <table summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>1

  Compress all information sent between the client and the server if possible. See Section 6.2.8, “Connection Compression Control”.

  As of MySQL 8.0.18, this option is deprecated. Expect it to be removed in a future version of MySQL. See Configuring Legacy Connection Compression.

* `--compress-output=algorithm`

  <table summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>2

  By default, **mysqlpump** does not compress output. This option specifies output compression using the specified algorithm. Permitted algorithms are `LZ4` and `ZLIB`.

  To uncompress compressed output, you must have an appropriate utility. If the system commands **lz4** and **openssl zlib** are not available, MySQL distributions include **lz4_decompress** and **zlib_decompress** utilities that can be used to decompress **mysqlpump** output that was compressed using the `--compress-output=LZ4` and `--compress-output=ZLIB` options. For more information, see Section 6.8.1, “lz4_decompress — Decompress mysqlpump LZ4-Compressed Output”, and Section 6.8.3, “zlib_decompress — Decompress mysqlpump ZLIB-Compressed Output”.

* `--compression-algorithms=value`

  <table summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>3

  The permitted compression algorithms for connections to the server. The available algorithms are the same as for the `protocol_compression_algorithms` system variable. The default value is `uncompressed`.

  For more information, see Section 6.2.8, “Connection Compression Control”.

  This option was added in MySQL 8.0.18.

* `--databases`, `-B`

  <table summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>4

  Normally, **mysqlpump** treats the first name argument on the command line as a database name and any following names as table names. With this option, it treats all name arguments as database names. `CREATE DATABASE` statements are included in the output before each new database.

  `--all-databases` and `--databases` are mutually exclusive.

  Note

  See the `--add-drop-database` description for information about an incompatibility of that option with `--databases`.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>5

  Write a debugging log. A typical *`debug_options`* string is `d:t:o,file_name`. The default is `d:t:O,/tmp/mysqlpump.trace`.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-check`

  <table summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>6

  Print some debugging information when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-info`, `-T`

  <table summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>7

  Print debugging information and memory and CPU usage statistics when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--default-auth=plugin`

  <table summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>8

  A hint about which client-side authentication plugin to use. See Section 8.2.17, “Pluggable Authentication”.

* `--default-character-set=charset_name`

  <table summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>9

  Use *`charset_name`* as the default character set. See Section 12.15, “Character Set Configuration”. If no character set is specified, **mysqlpump** uses `utf8mb4`.

* `--default-parallelism=N`

  <table summary="Properties for add-drop-database"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>0

  The default number of threads for each parallel processing queue. The default is 2.

  The `--parallel-schemas` option also affects parallelism and can be used to override the default number of threads. For more information, see mysqlpump Parallel Processing.

  With `--default-parallelism=0` and no `--parallel-schemas` options, **mysqlpump** runs as a single-threaded process and creates no queues.

  With parallelism enabled, it is possible for output from different databases to be interleaved.

* `--defaults-extra-file=file_name`

  <table summary="Properties for add-drop-database"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>1

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table summary="Properties for add-drop-database"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>2

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  Exception: Even with `--defaults-file`, client programs read `.mylogin.cnf`.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table summary="Properties for add-drop-database"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>3

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, **mysqlpump** normally reads the `[client]` and `[mysqlpump]` groups. If this option is given as `--defaults-group-suffix=_other`, **mysqlpump** also reads the `[client_other]` and `[mysqlpump_other]` groups.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defer-table-indexes`

  <table summary="Properties for add-drop-database"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>4

  In the dump output, defer index creation for each table until after its rows have been loaded. This works for all storage engines, but for `InnoDB` applies only for secondary indexes.

  This option is enabled by default; use `--skip-defer-table-indexes` to disable it.

* `--events`

  <table summary="Properties for add-drop-database"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>5

  Include Event Scheduler events for the dumped databases in the output. Event dumping requires the `EVENT` privileges for those databases.

  The output generated by using `--events` contains `CREATE EVENT` statements to create the events.

  This option is enabled by default; use `--skip-events` to disable it.

* `--exclude-databases=db_list`

  <table summary="Properties for add-drop-database"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>6

  Do not dump the databases in *`db_list`*, which is a list of one or more comma-separated database names. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--exclude-events=event_list`

  <table summary="Properties for add-drop-database"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>7

  Do not dump the databases in *`event_list`*, which is a list of one or more comma-separated event names. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--exclude-routines=routine_list`

  <table summary="Properties for add-drop-database"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>8

  Do not dump the events in *`routine_list`*, which is a list of one or more comma-separated routine (stored procedure or function) names. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--exclude-tables=table_list`

  <table summary="Properties for add-drop-database"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-database</code></td> </tr></tbody></table>9

  Do not dump the tables in *`table_list`*, which is a list of one or more comma-separated table names. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--exclude-triggers=trigger_list`

  <table summary="Properties for add-drop-table"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>0

  Do not dump the triggers in *`trigger_list`*, which is a list of one or more comma-separated trigger names. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--exclude-users=user_list`

  <table summary="Properties for add-drop-table"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>1

  Do not dump the user accounts in *`user_list`*, which is a list of one or more comma-separated account names. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--extended-insert=N`

  <table summary="Properties for add-drop-table"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>2

  Write `INSERT` statements using multiple-row syntax that includes several `VALUES` lists. This results in a smaller dump file and speeds up inserts when the file is reloaded.

  The option value indicates the number of rows to include in each `INSERT` statement. The default is 250. A value of 1 produces one `INSERT` statement per table row.

* `--get-server-public-key`

  <table summary="Properties for add-drop-table"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>3

  Request from the server the public key required for RSA key pair-based password exchange. This option applies to clients that authenticate with the `caching_sha2_password` authentication plugin. For that plugin, the server does not send the public key unless requested. This option is ignored for accounts that do not authenticate with that plugin. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For information about the `caching_sha2_password` plugin, see Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”.

* `--hex-blob`

  <table summary="Properties for add-drop-table"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>4

  Dump binary columns using hexadecimal notation (for example, `'abc'` becomes `0x616263`). The affected data types are `BINARY`, `VARBINARY`, `BLOB` types, `BIT`, all spatial data types, and other non-binary data types when used with the `binary` character set.

* `--host=host_name`, `-h host_name`

  <table summary="Properties for add-drop-table"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>5

  Dump data from the MySQL server on the given host.

* `--include-databases=db_list`

  <table summary="Properties for add-drop-table"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>6

  Dump the databases in *`db_list`*, which is a list of one or more comma-separated database names. The dump includes all objects in the named databases. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--include-events=event_list`

  <table summary="Properties for add-drop-table"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>7

  Dump the events in *`event_list`*, which is a list of one or more comma-separated event names. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--include-routines=routine_list`

  <table summary="Properties for add-drop-table"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>8

  Dump the routines in *`routine_list`*, which is a list of one or more comma-separated routine (stored procedure or function) names. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--include-tables=table_list`

  <table summary="Properties for add-drop-table"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-table</code></td> </tr></tbody></table>9

  Dump the tables in *`table_list`*, which is a list of one or more comma-separated table names. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--include-triggers=trigger_list`

  <table summary="Properties for add-drop-user"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>0

  Dump the triggers in *`trigger_list`*, which is a list of one or more comma-separated trigger names. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--include-users=user_list`

  <table summary="Properties for add-drop-user"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>1

  Dump the user accounts in *`user_list`*, which is a list of one or more comma-separated user names. Multiple instances of this option are additive. For more information, see mysqlpump Object Selection.

* `--insert-ignore`

  <table summary="Properties for add-drop-user"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>2

  Write `INSERT IGNORE` statements rather than `INSERT` statements.

* `--log-error-file=file_name`

  <table summary="Properties for add-drop-user"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>3

  Log warnings and errors by appending them to the named file. If this option is not given, **mysqlpump** writes warnings and errors to the standard error output.

* `--login-path=name`

  <table summary="Properties for add-drop-user"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>4

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql_config_editor** utility. See Section 6.6.7, “mysql_config_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--max-allowed-packet=N`

  <table summary="Properties for add-drop-user"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>5

  The maximum size of the buffer for client/server communication. The default is 24MB, the maximum is 1GB.

* `--net-buffer-length=N`

  <table summary="Properties for add-drop-user"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>6

  The initial size of the buffer for client/server communication. When creating multiple-row `INSERT` statements (as with the `--extended-insert` option), **mysqlpump** creates rows up to *`N`* bytes long. If you use this option to increase the value, ensure that the MySQL server `net_buffer_length` system variable has a value at least this large.

* `--no-create-db`

  <table summary="Properties for add-drop-user"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>7

  Suppress any `CREATE DATABASE` statements that might otherwise be included in the output.

* `--no-create-info`, `-t`

  <table summary="Properties for add-drop-user"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>8

  Do not write `CREATE TABLE` statements that create each dumped table.

* `--no-defaults`

  <table summary="Properties for add-drop-user"><tbody><tr><th>Command-Line Format</th> <td><code>--add-drop-user</code></td> </tr></tbody></table>9

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the **mysql_config_editor** utility. See Section 6.6.7, “mysql_config_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--parallel-schemas=[N:]db_list`

  <table summary="Properties for add-locks"><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>0

  Create a queue for processing the databases in *`db_list`*, which is a list of one or more comma-separated database names. If *`N`* is given, the queue uses *`N`* threads. If *`N`* is not given, the `--default-parallelism` option determines the number of queue threads.

  Multiple instances of this option create multiple queues. **mysqlpump** also creates a default queue to use for databases not named in any `--parallel-schemas` option, and for dumping user definitions if command options select them. For more information, see mysqlpump Parallel Processing.

* `--password[=password]`, `-p[password]`

  <table summary="Properties for add-locks"><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>1

  The password of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqlpump** prompts for one. If given, there must be *no space* between `--password=` or `-p` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 8.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqlpump** should not prompt for one, use the `--skip-password` option.

* `--password1[=pass_val]`

  The password for multifactor authentication factor 1 of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqlpump** prompts for one. If given, there must be *no space* between `--password1=` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 8.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqlpump** should not prompt for one, use the `--skip-password1` option.

  `--password1` and `--password` are synonymous, as are `--skip-password1` and `--skip-password`.

* `--password2[=pass_val]`

  The password for multifactor authentication factor 2 of the MySQL account used for connecting to the server. The semantics of this option are similar to the semantics for `--password1`; see the description of that option for details.

* `--password3[=pass_val]`

  The password for multifactor authentication factor 3 of the MySQL account used for connecting to the server. The semantics of this option are similar to the semantics for `--password1`; see the description of that option for details.

* `--plugin-dir=dir_name`

  <table summary="Properties for add-locks"><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>2

  The directory in which to look for plugins. Specify this option if the `--default-auth` option is used to specify an authentication plugin but **mysqlpump** does not find it. See Section 8.2.17, “Pluggable Authentication”.

* `--port=port_num`, `-P port_num`

  <table summary="Properties for add-locks"><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>3

  For TCP/IP connections, the port number to use.

* `--print-defaults`

  <table summary="Properties for add-locks"><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>4

  Print the program name and all options that it gets from option files.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table summary="Properties for add-locks"><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>5

  The transport protocol to use for connecting to the server. It is useful when the other connection parameters normally result in use of a protocol other than the one you want. For details on the permissible values, see Section 6.2.7, “Connection Transport Protocols”.

* `--replace`

  <table summary="Properties for add-locks"><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>6

  Write `REPLACE` statements rather than `INSERT` statements.

* `--result-file=file_name`

  <table summary="Properties for add-locks"><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>7

  Direct output to the named file. The result file is created and its previous contents overwritten, even if an error occurs while generating the dump.

  This option should be used on Windows to prevent newline `\n` characters from being converted to `\r\n` carriage return/newline sequences.

* `--routines`

  <table summary="Properties for add-locks"><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>8

  Include stored routines (procedures and functions) for the dumped databases in the output. This option requires the global `SELECT` privilege.

  The output generated by using `--routines` contains `CREATE PROCEDURE` and `CREATE FUNCTION` statements to create the routines.

  This option is enabled by default; use `--skip-routines` to disable it.

* `--server-public-key-path=file_name`

  <table summary="Properties for add-locks"><tbody><tr><th>Command-Line Format</th> <td><code>--add-locks</code></td> </tr></tbody></table>9

  The path name to a file in PEM format containing a client-side copy of the public key required by the server for RSA key pair-based password exchange. This option applies to clients that authenticate with the `sha256_password` or `caching_sha2_password` authentication plugin. This option is ignored for accounts that do not authenticate with one of those plugins. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For `sha256_password`, this option applies only if MySQL was built using OpenSSL.

  For information about the `sha256_password` and `caching_sha2_password` plugins, see Section 8.4.1.3, “SHA-256 Pluggable Authentication”, and Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”.

* `--set-charset`

  <table summary="Properties for all-databases"><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>0

  Write `SET NAMES default_character_set` to the output.

  This option is enabled by default. To disable it and suppress the `SET NAMES` statement, use `--skip-set-charset`.

* `--set-gtid-purged=value`

  <table summary="Properties for all-databases"><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>1

  This option enables control over global transaction ID (GTID) information written to the dump file, by indicating whether to add a `SET @@GLOBAL.gtid_purged` statement to the output. This option may also cause a statement to be written to the output that disables binary logging while the dump file is being reloaded.

  The following table shows the permitted option values. The default value is `AUTO`.

  <table summary="Properties for all-databases"><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>2

  The `--set-gtid-purged` option has the following effect on binary logging when the dump file is reloaded:

  + `--set-gtid-purged=OFF`: `SET @@SESSION.SQL_LOG_BIN=0;` is not added to the output.

  + `--set-gtid-purged=ON`: `SET @@SESSION.SQL_LOG_BIN=0;` is added to the output.

  + `--set-gtid-purged=AUTO`: `SET @@SESSION.SQL_LOG_BIN=0;` is added to the output if GTIDs are enabled on the server you are backing up (that is, if `AUTO` evaluates to `ON`).

* `--single-transaction`

  <table summary="Properties for all-databases"><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>3

  This option sets the transaction isolation mode to `REPEATABLE READ` and sends a `START TRANSACTION` SQL statement to the server before dumping data. It is useful only with transactional tables such as `InnoDB`, because then it dumps the consistent state of the database at the time when `START TRANSACTION` was issued without blocking any applications.

  When using this option, you should keep in mind that only `InnoDB` tables are dumped in a consistent state. For example, any `MyISAM` or `MEMORY` tables dumped while using this option may still change state.

  While a `--single-transaction` dump is in process, to ensure a valid dump file (correct table contents and binary log coordinates), no other connection should use the following statements: `ALTER TABLE`, `CREATE TABLE`, `DROP TABLE`, `RENAME TABLE`, `TRUNCATE TABLE`. A consistent read is not isolated from those statements, so use of them on a table to be dumped can cause the `SELECT` that is performed by **mysqlpump** to retrieve the table contents to obtain incorrect contents or fail.

  `--add-locks` and `--single-transaction` are mutually exclusive.

* `--skip-definer`

  <table summary="Properties for all-databases"><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>4

  Omit `DEFINER` and `SQL SECURITY` clauses from the `CREATE` statements for views and stored programs. The dump file, when reloaded, creates objects that use the default `DEFINER` and `SQL SECURITY` values. See Section 27.6, “Stored Object Access Control”.

* `--skip-dump-rows`, `-d`

  <table summary="Properties for all-databases"><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>5

  Do not dump table rows.

* `--skip-generated-invisible-primary-key`

  <table summary="Properties for all-databases"><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>6

  This option is available beginning with MySQL 8.0.30, and causes generated invisible primary keys (GIPKs) to be excluded from the dump. See Section 15.1.20.11, “Generated Invisible Primary Keys”, for more information about GIPKs and GIPK mode.

* `--socket=path`, `-S path`

  <table summary="Properties for all-databases"><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>7

  For connections to `localhost`, the Unix socket file to use, or, on Windows, the name of the named pipe to use.

  On Windows, this option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--ssl*`

  Options that begin with `--ssl` specify whether to connect to the server using encryption and indicate where to find SSL keys and certificates. See Command Options for Encrypted Connections.

* `--ssl-fips-mode={OFF|ON|STRICT}`

  <table summary="Properties for all-databases"><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>8

  Controls whether to enable FIPS mode on the client side. The `--ssl-fips-mode` option differs from other `--ssl-xxx` options in that it is not used to establish encrypted connections, but rather to affect which cryptographic operations to permit. See Section 8.8, “FIPS Support”.

  These `--ssl-fips-mode` values are permitted:

  + `OFF`: Disable FIPS mode.
  + `ON`: Enable FIPS mode.
  + `STRICT`: Enable “strict” FIPS mode.

  Note

  If the OpenSSL FIPS Object Module is not available, the only permitted value for `--ssl-fips-mode` is `OFF`. In this case, setting `--ssl-fips-mode` to `ON` or `STRICT` causes the client to produce a warning at startup and to operate in non-FIPS mode.

  As of MySQL 8.0.34, this option is deprecated. Expect it to be removed in a future version of MySQL.

* `--tls-ciphersuites=ciphersuite_list`

  <table summary="Properties for all-databases"><tbody><tr><th>Command-Line Format</th> <td><code>--all-databases</code></td> </tr></tbody></table>9

  The permissible ciphersuites for encrypted connections that use TLSv1.3. The value is a list of one or more colon-separated ciphersuite names. The ciphersuites that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

  This option was added in MySQL 8.0.16.

* `--tls-version=protocol_list`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>0

  The permissible TLS protocols for encrypted connections. The value is a list of one or more comma-separated protocol names. The protocols that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

* `--triggers`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>1

  Include triggers for each dumped table in the output.

  This option is enabled by default; use `--skip-triggers` to disable it.

* `--tz-utc`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>2

  This option enables `TIMESTAMP` columns to be dumped and reloaded between servers in different time zones. **mysqlpump** sets its connection time zone to UTC and adds `SET TIME_ZONE='+00:00'` to the dump file. Without this option, `TIMESTAMP` columns are dumped and reloaded in the time zones local to the source and destination servers, which can cause the values to change if the servers are in different time zones. `--tz-utc` also protects against changes due to daylight saving time.

  This option is enabled by default; use `--skip-tz-utc` to disable it.

* `--user=user_name`, `-u user_name`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>3

  The user name of the MySQL account to use for connecting to the server.

  If you are using the `Rewriter` plugin with MySQL 8.0.31 or later, you should grant this user the `SKIP_QUERY_REWRITE` privilege.

* `--users`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>4

  Dump user accounts as logical definitions in the form of `CREATE USER` and `GRANT` statements.

  User definitions are stored in the grant tables in the `mysql` system database. By default, **mysqlpump** does not include the grant tables in `mysql` database dumps. To dump the contents of the grant tables as logical definitions, use the `--users` option and suppress all database dumping:

  ```
  mysqlpump --exclude-databases=% --users
  ```

* `--version`, `-V`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>5

  Display version information and exit.

* `--watch-progress`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>6

  Periodically display a progress indicator that provides information about the completed and total number of tables, rows, and other objects.

  This option is enabled by default; use `--skip-watch-progress` to disable it.

* `--zstd-compression-level=level`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=ip_address</code></td> </tr></tbody></table>7

  The compression level to use for connections to the server that use the `zstd` compression algorithm. The permitted levels are from 1 to 22, with larger values indicating increasing levels of compression. The default `zstd` compression level is 3. The compression level setting has no effect on connections that do not use `zstd` compression.

  For more information, see Section 6.2.8, “Connection Compression Control”.

  This option was added in MySQL 8.0.18.

#### mysqlpump Object Selection

**mysqlpump** has a set of inclusion and exclusion options that enable filtering of several object types and provide flexible control over which objects to dump:

* `--include-databases` and `--exclude-databases` apply to databases and all objects within them.

* `--include-tables` and `--exclude-tables` apply to tables. These options also affect triggers associated with tables unless the trigger-specific options are given.

* `--include-triggers` and `--exclude-triggers` apply to triggers.

* `--include-routines` and `--exclude-routines` apply to stored procedures and functions. If a routine option matches a stored procedure name, it also matches a stored function of the same name.

* `--include-events` and `--exclude-events` apply to Event Scheduler events.

* `--include-users` and `--exclude-users` apply to user accounts.

Any inclusion or exclusion option may be given multiple times. The effect is additive. Order of these options does not matter.

The value of each inclusion and exclusion option is a list of comma-separated names of the appropriate object type. For example:

```
--exclude-databases=test,world
--include-tables=customer,invoice
```

Wildcard characters are permitted in the object names:

* `%` matches any sequence of zero or more characters.

* `_` matches any single character.

For example, `--include-tables=t%,__tmp` matches all table names that begin with `t` and all five-character table names that end with `tmp`.

For users, a name specified without a host part is interpreted with an implied host of `%`. For example, `u1` and `u1@%` are equivalent. This is the same equivalence that applies in MySQL generally (see Section 8.2.4, “Specifying Account Names”).

Inclusion and exclusion options interact as follows:

* By default, with no inclusion or exclusion options, **mysqlpump** dumps all databases (with certain exceptions noted in mysqlpump Restrictions).

* If inclusion options are given in the absence of exclusion options, only the objects named as included are dumped.

* If exclusion options are given in the absence of inclusion options, all objects are dumped except those named as excluded.

* If inclusion and exclusion options are given, all objects named as excluded and not named as included are not dumped. All other objects are dumped.

If multiple databases are being dumped, it is possible to name tables, triggers, and routines in a specific database by qualifying the object names with the database name. The following command dumps databases `db1` and `db2`, but excludes tables `db1.t1` and `db2.t2`:

```
mysqlpump --include-databases=db1,db2 --exclude-tables=db1.t1,db2.t2
```

The following options provide alternative ways to specify which databases to dump:

* The `--all-databases` option dumps all databases (with certain exceptions noted in mysqlpump Restrictions). It is equivalent to specifying no object options at all (the default **mysqlpump** action is to dump everything).

  `--include-databases=%` is similar to `--all-databases`, but selects all databases for dumping, even those that are exceptions for `--all-databases`.

* The `--databases` option causes **mysqlpump** to treat all name arguments as names of databases to dump. It is equivalent to an `--include-databases` option that names the same databases.

#### mysqlpump Parallel Processing

**mysqlpump** can use parallelism to achieve concurrent processing. You can select concurrency between databases (to dump multiple databases simultaneously) and within databases (to dump multiple objects from a given database simultaneously).

By default, **mysqlpump** sets up one queue with two threads. You can create additional queues and control the number of threads assigned to each one, including the default queue:

* `--default-parallelism=N` specifies the default number of threads used for each queue. In the absence of this option, *`N`* is 2.

  The default queue always uses the default number of threads. Additional queues use the default number of threads unless you specify otherwise.

* `--parallel-schemas=[N:]db_list` sets up a processing queue for dumping the databases named in *`db_list`* and optionally specifies how many threads the queue uses. *`db_list`* is a list of comma-separated database names. If the option argument begins with `N:`, the queue uses *`N`* threads. Otherwise, the `--default-parallelism` option determines the number of queue threads.

  Multiple instances of the `--parallel-schemas` option create multiple queues.

  Names in the database list are permitted to contain the same `%` and `_` wildcard characters supported for filtering options (see mysqlpump Object Selection).

**mysqlpump** uses the default queue for processing any databases not named explicitly with a `--parallel-schemas` option, and for dumping user definitions if command options select them.

In general, with multiple queues, **mysqlpump** uses parallelism between the sets of databases processed by the queues, to dump multiple databases simultaneously. For a queue that uses multiple threads, **mysqlpump** uses parallelism within databases, to dump multiple objects from a given database simultaneously. Exceptions can occur; for example, **mysqlpump** may block queues while it obtains from the server lists of objects in databases.

With parallelism enabled, it is possible for output from different databases to be interleaved. For example, `INSERT` statements from multiple tables dumped in parallel can be interleaved; the statements are not written in any particular order. This does not affect reloading because output statements qualify object names with database names or are preceded by `USE` statements as required.

The granularity for parallelism is a single database object. For example, a single table cannot be dumped in parallel using multiple threads.

Examples:

```
mysqlpump --parallel-schemas=db1,db2 --parallel-schemas=db3
```

**mysqlpump** sets up a queue to process `db1` and `db2`, another queue to process `db3`, and a default queue to process all other databases. All queues use two threads.

```
mysqlpump --parallel-schemas=db1,db2 --parallel-schemas=db3
          --default-parallelism=4
```

This is the same as the previous example except that all queues use four threads.

```
mysqlpump --parallel-schemas=5:db1,db2 --parallel-schemas=3:db3
```

The queue for `db1` and `db2` uses five threads, the queue for `db3` uses three threads, and the default queue uses the default of two threads.

As a special case, with `--default-parallelism=0` and no `--parallel-schemas` options, **mysqlpump** runs as a single-threaded process and creates no queues.

#### mysqlpump Restrictions

**mysqlpump** does not dump the `performance_schema`, `ndbinfo`, or `sys` schema by default. To dump any of these, name them explicitly on the command line. You can also name them with the `--databases` or `--include-databases` option.

**mysqlpump** does not dump the `INFORMATION_SCHEMA` schema.

**mysqlpump** does not dump `InnoDB` `CREATE TABLESPACE` statements.

**mysqlpump** dumps user accounts in logical form using `CREATE USER` and `GRANT` statements (for example, when you use the `--include-users` or `--users` option). For this reason, dumps of the `mysql` system database do not by default include the grant tables that contain user definitions: `user`, `db`, `tables_priv`, `columns_priv`, `procs_priv`, or `proxies_priv`. To dump any of the grant tables, name the `mysql` database followed by the table names:

```
mysqlpump mysql user db ...
```
