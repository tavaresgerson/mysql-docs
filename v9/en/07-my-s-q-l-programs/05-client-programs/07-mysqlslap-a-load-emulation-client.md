### 6.5.7 mysqlslap — A Load Emulation Client

**mysqlslap** is a diagnostic program designed to emulate client load for a MySQL server and to report the timing of each stage. It works as if multiple clients are accessing the server.

Invoke **mysqlslap** like this:

```
mysqlslap [options]
```

Some options such as `--create` or `--query` enable you to specify a string containing an SQL statement or a file containing statements. If you specify a file, by default it must contain one statement per line. (That is, the implicit statement delimiter is the newline character.) Use the `--delimiter` option to specify a different delimiter, which enables you to specify statements that span multiple lines or place multiple statements on a single line. You cannot include comments in a file; **mysqlslap** does not understand them.

**mysqlslap** runs in three stages:

1. Create schema, table, and optionally any stored programs or data to use for the test. This stage uses a single client connection.

2. Run the load test. This stage can use many client connections.

3. Clean up (disconnect, drop table if specified). This stage uses a single client connection.

Examples:

Supply your own create and query SQL statements, with 50 clients querying and 200 selects for each (enter the command on a single line):

```
mysqlslap --delimiter=";"
  --create="CREATE TABLE a (b int);INSERT INTO a VALUES (23)"
  --query="SELECT * FROM a" --concurrency=50 --iterations=200
```

Let **mysqlslap** build the query SQL statement with a table of two `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") columns and three `VARCHAR` columns. Use five clients querying 20 times each. Do not create the table or insert the data (that is, use the previous test's schema and data):

```
mysqlslap --concurrency=5 --iterations=20
  --number-int-cols=2 --number-char-cols=3
  --auto-generate-sql
```

Tell the program to load the create, insert, and query SQL statements from the specified files, where the `create.sql` file has multiple table creation statements delimited by `';'` and multiple insert statements delimited by `';'`. The `--query` file should contain multiple queries delimited by `';'`. Run all the load statements, then run all the queries in the query file with five clients (five times each):

```
mysqlslap --concurrency=5
  --iterations=5 --query=query.sql --create=create.sql
  --delimiter=";"
```

**mysqlslap** supports the following options, which can be specified on the command line or in the `[mysqlslap]` and `[client]` groups of an option file. For information about option files used by MySQL programs, see Section 6.2.2.2, “Using Option Files”.

**Table 6.16 mysqlslap Options**

<table frame="box" rules="all" summary="Command-line options available for mysqlslap."><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Option Name</th> <th>Description</th> </tr></thead><tbody><tr><td>--auto-generate-sql</td> <td>Generate SQL statements automatically when they are not supplied in files or using command options</td> </tr><tr><td>--auto-generate-sql-add-autoincrement</td> <td>Add AUTO_INCREMENT column to automatically generated tables</td> </tr><tr><td>--auto-generate-sql-execute-number</td> <td>Specify how many queries to generate automatically</td> </tr><tr><td>--auto-generate-sql-guid-primary</td> <td>Add a GUID-based primary key to automatically generated tables</td> </tr><tr><td>--auto-generate-sql-load-type</td> <td>Specify the test load type</td> </tr><tr><td>--auto-generate-sql-secondary-indexes</td> <td>Specify how many secondary indexes to add to automatically generated tables</td> </tr><tr><td>--auto-generate-sql-unique-query-number</td> <td>How many different queries to generate for automatic tests</td> </tr><tr><td>--auto-generate-sql-unique-write-number</td> <td>How many different queries to generate for --auto-generate-sql-write-number</td> </tr><tr><td>--auto-generate-sql-write-number</td> <td>How many row inserts to perform on each thread</td> </tr><tr><td>--commit</td> <td>How many statements to execute before committing</td> </tr><tr><td>--compress</td> <td>Compress all information sent between client and server</td> </tr><tr><td>--compression-algorithms</td> <td>Permitted compression algorithms for connections to server</td> </tr><tr><td>--concurrency</td> <td>Number of clients to simulate when issuing the SELECT statement</td> </tr><tr><td>--create</td> <td>File or string containing the statement to use for creating the table</td> </tr><tr><td>--create-schema</td> <td>Schema in which to run the tests</td> </tr><tr><td>--csv</td> <td>Generate output in comma-separated values format</td> </tr><tr><td>--debug</td> <td>Write debugging log</td> </tr><tr><td>--debug-check</td> <td>Print debugging information when program exits</td> </tr><tr><td>--debug-info</td> <td>Print debugging information, memory, and CPU statistics when program exits</td> </tr><tr><td>--defaults-extra-file</td> <td>Read named option file in addition to usual option files</td> </tr><tr><td>--defaults-file</td> <td>Read only named option file</td> </tr><tr><td>--defaults-group-suffix</td> <td>Option group suffix value</td> </tr><tr><td>--delimiter</td> <td>Delimiter to use in SQL statements</td> </tr><tr><td>--detach</td> <td>Detach (close and reopen) each connection after each N statements</td> </tr><tr><td>--enable-cleartext-plugin</td> <td>Enable cleartext authentication plugin</td> </tr><tr><td>--engine</td> <td>Storage engine to use for creating the table</td> </tr><tr><td>--get-server-public-key</td> <td>Request RSA public key from server</td> </tr><tr><td>--help</td> <td>Display help message and exit</td> </tr><tr><td>--host</td> <td>Host on which MySQL server is located</td> </tr><tr><td>--iterations</td> <td>Number of times to run the tests</td> </tr><tr><td>--login-path</td> <td>Read login path options from .mylogin.cnf</td> </tr><tr><td>--no-defaults</td> <td>Read no option files</td> </tr><tr><td>--no-drop</td> <td>Do not drop any schema created during the test run</td> </tr><tr><td>--no-login-paths</td> <td>Do not read login paths from the login path file</td> </tr><tr><td>--number-char-cols</td> <td>Number of VARCHAR columns to use if --auto-generate-sql is specified</td> </tr><tr><td>--number-int-cols</td> <td>Number of INT columns to use if --auto-generate-sql is specified</td> </tr><tr><td>--number-of-queries</td> <td>Limit each client to approximately this number of queries</td> </tr><tr><td>--only-print</td> <td>Do not connect to databases. mysqlslap only prints what it would have done</td> </tr><tr><td>--password</td> <td>Password to use when connecting to server</td> </tr><tr><td>--password1</td> <td>First multifactor authentication password to use when connecting to server</td> </tr><tr><td>--password2</td> <td>Second multifactor authentication password to use when connecting to server</td> </tr><tr><td>--password3</td> <td>Third multifactor authentication password to use when connecting to server</td> </tr><tr><td>--pipe</td> <td>Connect to server using named pipe (Windows only)</td> </tr><tr><td>--port</td> <td>TCP/IP port number for connection</td> </tr><tr><td>--post-query</td> <td>File or string containing the statement to execute after the tests have completed</td> </tr><tr><td>--post-system</td> <td>String to execute using system() after the tests have completed</td> </tr><tr><td>--pre-query</td> <td>File or string containing the statement to execute before running the tests</td> </tr><tr><td>--pre-system</td> <td>String to execute using system() before running the tests</td> </tr><tr><td>--print-defaults</td> <td>Print default options</td> </tr><tr><td>--protocol</td> <td>Transport protocol to use</td> </tr><tr><td>--query</td> <td>File or string containing the SELECT statement to use for retrieving data</td> </tr><tr><td>--server-public-key-path</td> <td>Path name to file containing RSA public key</td> </tr><tr><td>--shared-memory-base-name</td> <td>Shared-memory name for shared-memory connections (Windows only)</td> </tr><tr><td>--silent</td> <td>Silent mode</td> </tr><tr><td>--socket</td> <td>Unix socket file or Windows named pipe to use</td> </tr><tr><td>--sql-mode</td> <td>Set SQL mode for client session</td> </tr><tr><td>--ssl-ca</td> <td>File that contains list of trusted SSL Certificate Authorities</td> </tr><tr><td>--ssl-capath</td> <td>Directory that contains trusted SSL Certificate Authority certificate files</td> </tr><tr><td>--ssl-cert</td> <td>File that contains X.509 certificate</td> </tr><tr><td>--ssl-cipher</td> <td>Permissible ciphers for connection encryption</td> </tr><tr><td>--ssl-fips-mode</td> <td>Whether to enable FIPS mode on client side</td> </tr><tr><td>--ssl-key</td> <td>File that contains X.509 key</td> </tr><tr><td>--ssl-mode</td> <td>Desired security state of connection to server</td> </tr><tr><td>--ssl-session-data</td> <td>File that contains SSL session data</td> </tr><tr><td>--ssl-session-data-continue-on-failed-reuse</td> <td>Whether to establish connections if session reuse fails</td> </tr><tr><td>--tls-ciphersuites</td> <td>Permissible TLSv1.3 ciphersuites for encrypted connections</td> </tr><tr><td>--tls-sni-servername</td> <td>Server name supplied by the client</td> </tr><tr><td>--tls-version</td> <td>Permissible TLS protocols for encrypted connections</td> </tr><tr><td>--user</td> <td>MySQL user name to use when connecting to server</td> </tr><tr><td>--verbose</td> <td>Verbose mode</td> </tr><tr><td>--version</td> <td>Display version information and exit</td> </tr><tr><td>--zstd-compression-level</td> <td>Compression level for connections to server that use zstd compression</td> </tr></tbody></table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--auto-generate-sql`, `-a`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  Generate SQL statements automatically when they are not supplied in files or using command options.

* `--auto-generate-sql-add-autoincrement`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  Add an `AUTO_INCREMENT` column to automatically generated tables.

* `--auto-generate-sql-execute-number=N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  Specify how many queries to generate automatically.

* `--auto-generate-sql-guid-primary`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  Add a GUID-based primary key to automatically generated tables.

* `--auto-generate-sql-load-type=type`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-load-type"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-load-type=type</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">mixed</code></td> </tr><tr><th>Valid Values</th> <td><p><code class="literal">read</code></p><p><code class="literal">write</code></p><p><code class="literal">key</code></p><p><code class="literal">update</code></p><p><code class="literal">mixed</code></p></td> </tr></tbody></table>

  Specify the test load type. The permissible values are `read` (scan tables), `write` (insert into tables), `key` (read primary keys), `update` (update primary keys), or `mixed` (half inserts, half scanning selects). The default is `mixed`.

* `--auto-generate-sql-secondary-indexes=N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-secondary-indexes"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-secondary-indexes=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code class="literal">0</code></td> </tr></tbody></table>

  Specify how many secondary indexes to add to automatically generated tables. By default, none are added.

* `--auto-generate-sql-unique-query-number=N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-unique-query-number"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-unique-query-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code class="literal">10</code></td> </tr></tbody></table>

  How many different queries to generate for automatic tests. For example, if you run a `key` test that performs 1000 selects, you can use this option with a value of 1000 to run 1000 unique queries, or with a value of 50 to perform 50 different selects. The default is 10.

* `--auto-generate-sql-unique-write-number=N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-unique-write-number"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-unique-write-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code class="literal">10</code></td> </tr></tbody></table>

  How many different queries to generate for `--auto-generate-sql-write-number`. The default is 10.

* `--auto-generate-sql-write-number=N`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>

  How many row inserts to perform. The default is 100.

* `--commit=N`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>

  How many statements to execute before committing. The default is 0 (no commits are done).

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>

  Compress all information sent between the client and the server if possible. See Section 6.2.8, “Connection Compression Control”.

  This option is deprecated. Expect it to be removed in a future version of MySQL. See Configuring Legacy Connection Compression.

* `--compression-algorithms=value`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>

  The permitted compression algorithms for connections to the server. The available algorithms are the same as for the `protocol_compression_algorithms` system variable. The default value is `uncompressed`.

  For more information, see Section 6.2.8, “Connection Compression Control”.

* `--concurrency=N`, `-c N`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>

  The number of parallel clients to simulate.

* `--create=value`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>

  The file or string containing the statement to use for creating the table.

* `--create-schema=value`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>

  The schema in which to run the tests.

  Note

  If the `--auto-generate-sql` option is also given, **mysqlslap** drops the schema at the end of the test run. To avoid this, use the `--no-drop` option as well.

* `--csv[=file_name]`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>

  Generate output in comma-separated values format. The output goes to the named file, or to the standard output if no file is given.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>

  Write a debugging log. A typical *`debug_options`* string is `d:t:o,file_name`. The default is `d:t:o,/tmp/mysqlslap.trace`.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-check`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>

  Print some debugging information when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  Print debugging information and memory and CPU usage statistics when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  A hint about which client-side authentication plugin to use. See Section 8.2.17, “Pluggable Authentication”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  Exception: Even with `--defaults-file`, client programs read `.mylogin.cnf`.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, **mysqlslap** normally reads the `[client]` and `[mysqlslap]` groups. If this option is given as `--defaults-group-suffix=_other`, **mysqlslap** also reads the `[client_other]` and `[mysqlslap_other]` groups.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--delimiter=str`, `-F str`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  The delimiter to use in SQL statements supplied in files or using command options.

* `--detach=N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  Detach (close and reopen) each connection after each *`N`* statements. The default is 0 (connections are not detached).

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  Enable the `mysql_clear_password` cleartext authentication plugin. (See Section 8.4.1.3, “Client-Side Cleartext Pluggable Authentication”.)

* `--engine=engine_name`, `-e engine_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  The storage engine to use for creating tables.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  Request from the server the RSA public key that it uses for key pair-based password exchange. This option applies to clients that connect to the server using an account that authenticates with the `caching_sha2_password` authentication plugin. For connections by such accounts, the server does not send the public key to the client unless requested. The option is ignored for accounts that do not authenticate with that plugin. It is also ignored if RSA-based password exchange is not needed, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For information about the `caching_sha2_password` plugin, see Section 8.4.1.1, “Caching SHA-2 Pluggable Authentication”.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  Connect to the MySQL server on the given host.

* `--iterations=N`, `-i N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  The number of times to run the tests.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql_config_editor** utility. See Section 6.6.7, “mysql_config_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--no-login-paths`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  Skips reading options from the login path file.

  See `--login-path` for related information.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--no-drop`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  Prevent **mysqlslap** from dropping any schema it creates during the test run.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the **mysql_config_editor** utility. See Section 6.6.7, “mysql_config_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--number-char-cols=N`, `-x N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  The number of `VARCHAR` columns to use if `--auto-generate-sql` is specified.

* `--number-int-cols=N`, `-y N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  The number of `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") columns to use if `--auto-generate-sql` is specified.

* `--number-of-queries=N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  Limit each client to approximately this many queries. Query counting takes into account the statement delimiter. For example, if you invoke **mysqlslap** as follows, the `;` delimiter is recognized so that each instance of the query string counts as two queries. As a result, 5 rows (not 10) are inserted.

  ```
  mysqlslap --delimiter=";" --number-of-queries=10
            --query="use test;insert into t values(null)"
  ```

* `--only-print`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  Do not connect to databases. **mysqlslap** only prints what it would have done.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  The password of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqlslap** prompts for one. If given, there must be *no space* between `--password=` or `-p` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 8.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqlslap** should not prompt for one, use the `--skip-password` option.

* `--password1[=pass_val]`

  The password for multifactor authentication factor 1 of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqlslap** prompts for one. If given, there must be *no space* between `--password1=` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 8.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqlslap** should not prompt for one, use the `--skip-password1` option.

  `--password1` and `--password` are synonymous, as are `--skip-password1` and `--skip-password`.

* `--password2[=pass_val]`

  The password for multifactor authentication factor 2 of the MySQL account used for connecting to the server. The semantics of this option are similar to the semantics for `--password1`; see the description of that option for details.

* `--password3[=pass_val]`

  The password for multifactor authentication factor 3 of the MySQL account used for connecting to the server. The semantics of this option are similar to the semantics for `--password1`; see the description of that option for details.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  On Windows, connect to the server using a named pipe. This option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  The directory in which to look for plugins. Specify this option if the `--default-auth` option is used to specify an authentication plugin but **mysqlslap** does not find it. See Section 8.2.17, “Pluggable Authentication”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  For TCP/IP connections, the port number to use.

* `--post-query=value`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  The file or string containing the statement to execute after the tests have completed. This execution is not counted for timing purposes.

* `--post-system=str`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  The string to execute using `system()` after the tests have completed. This execution is not counted for timing purposes.

* `--pre-query=value`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  The file or string containing the statement to execute before running the tests. This execution is not counted for timing purposes.

* `--pre-system=str`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  The string to execute using `system()` before running the tests. This execution is not counted for timing purposes.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  Print the program name and all options that it gets from option files.

  For additional information about this and other option-file options, see Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  The transport protocol to use for connecting to the server. It is useful when the other connection parameters normally result in use of a protocol other than the one you want. For details on the permissible values, see Section 6.2.7, “Connection Transport Protocols”.

* `--query=value`, `-q value`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  The file or string containing the `SELECT` statement to use for retrieving data.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  The path name to a file in PEM format containing a client-side copy of the public key required by the server for RSA key pair-based password exchange. This option applies to clients that authenticate with the `sha256_password` or `caching_sha2_password` authentication plugin. This option is ignored for accounts that do not authenticate with one of those plugins. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For `sha256_password`, this option applies only if MySQL was built using OpenSSL.

  For information about the `sha256_password` and `caching_sha2_password` plugins, see Section 8.4.1.2, “SHA-256 Pluggable Authentication”, and Section 8.4.1.1, “Caching SHA-2 Pluggable Authentication”.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  On Windows, the shared-memory name to use for connections made using shared memory to a local server. The default value is `MYSQL`. The shared-memory name is case-sensitive.

  This option applies only if the server was started with the `shared_memory` system variable enabled to support shared-memory connections.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  Silent mode. No output.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  For connections to `localhost`, the Unix socket file to use, or, on Windows, the name of the named pipe to use.

  On Windows, this option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--sql-mode=mode`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  Set the SQL mode for the client session.

* `--ssl*`

  Options that begin with `--ssl` specify whether to connect to the server using encryption and indicate where to find SSL keys and certificates. See Command Options for Encrypted Connections.

* `--ssl-fips-mode={OFF|ON|STRICT}`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  Controls whether to enable FIPS mode on the client side. The `--ssl-fips-mode` option differs from other `--ssl-xxx` options in that it is not used to establish encrypted connections, but rather to affect which cryptographic operations to permit. See Section 8.8, “FIPS Support”.

  These `--ssl-fips-mode` values are permitted:

  + `OFF`: Disable FIPS mode.
  + `ON`: Enable FIPS mode.
  + `STRICT`: Enable “strict” FIPS mode.

  Note

  If the OpenSSL FIPS Object Module is not available, the only permitted value for `--ssl-fips-mode` is `OFF`. In this case, setting `--ssl-fips-mode` to `ON` or `STRICT` causes the client to produce a warning at startup and to operate in non-FIPS mode.

  This option is deprecated. Expect it to be removed in a future version of MySQL.

* `--tls-ciphersuites=ciphersuite_list`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  The permissible ciphersuites for encrypted connections that use TLSv1.3. The value is a list of one or more colon-separated ciphersuite names. The ciphersuites that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

* `--tls-sni-servername=server_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  When specified, the name is passed to the `libmysqlclient` C API library using the `MYSQL_OPT_TLS_SNI_SERVERNAME` option of `mysql_options()`. The server name is not case-sensitive. To show which server name the client specified for the current session, if any, check the `Tls_sni_server_name` status variable.

  Server Name Indication (SNI) is an extension to the TLS protocol (OpenSSL must be compiled using TLS extensions for this option to function). The MySQL implementation of SNI represents the client-side only.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  The permissible TLS protocols for encrypted connections. The value is a list of one or more comma-separated protocol names. The protocols that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-load-type"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-load-type=type</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">mixed</code></td> </tr><tr><th>Valid Values</th> <td><p><code class="literal">read</code></p><p><code class="literal">write</code></p><p><code class="literal">key</code></p><p><code class="literal">update</code></p><p><code class="literal">mixed</code></p></td> </tr></tbody></table>

  The user name of the MySQL account to use for connecting to the server.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-load-type"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-load-type=type</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">mixed</code></td> </tr><tr><th>Valid Values</th> <td><p><code class="literal">read</code></p><p><code class="literal">write</code></p><p><code class="literal">key</code></p><p><code class="literal">update</code></p><p><code class="literal">mixed</code></p></td> </tr></tbody></table>

  Verbose mode. Print more information about what the program does. This option can be used multiple times to increase the amount of information.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-load-type"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-load-type=type</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">mixed</code></td> </tr><tr><th>Valid Values</th> <td><p><code class="literal">read</code></p><p><code class="literal">write</code></p><p><code class="literal">key</code></p><p><code class="literal">update</code></p><p><code class="literal">mixed</code></p></td> </tr></tbody></table>

  Display version information and exit.

* `--zstd-compression-level=level`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-load-type"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-load-type=type</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">mixed</code></td> </tr><tr><th>Valid Values</th> <td><p><code class="literal">read</code></p><p><code class="literal">write</code></p><p><code class="literal">key</code></p><p><code class="literal">update</code></p><p><code class="literal">mixed</code></p></td> </tr></tbody></table>

  The compression level to use for connections to the server that use the `zstd` compression algorithm. The permitted levels are from 1 to 22, with larger values indicating increasing levels of compression. The default `zstd` compression level is 3. The compression level setting has no effect on connections that do not use `zstd` compression.

  For more information, see Section 6.2.8, “Connection Compression Control”.
