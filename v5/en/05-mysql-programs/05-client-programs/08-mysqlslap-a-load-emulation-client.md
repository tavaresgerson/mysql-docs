### 4.5.8 mysqlslap — A Load Emulation Client

**mysqlslap** is a diagnostic program designed to emulate client load for a MySQL server and to report the timing of each stage. It works as if multiple clients are accessing the server.

Invoke **mysqlslap** like this:

```sql
mysqlslap [options]
```

Some options such as `--create` or `--query` enable you to specify a string containing an SQL statement or a file containing statements. If you specify a file, by default it must contain one statement per line. (That is, the implicit statement delimiter is the newline character.) Use the `--delimiter` option to specify a different delimiter, which enables you to specify statements that span multiple lines or place multiple statements on a single line. You cannot include comments in a file; **mysqlslap** does not understand them.

**mysqlslap** runs in three stages:

1. Create schema, table, and optionally any stored programs or data to use for the test. This stage uses a single client connection.

2. Run the load test. This stage can use many client connections.

3. Clean up (disconnect, drop table if specified). This stage uses a single client connection.

Examples:

Supply your own create and query SQL statements, with 50 clients querying and 200 selects for each (enter the command on a single line):

```sql
mysqlslap --delimiter=";"
  --create="CREATE TABLE a (b int);INSERT INTO a VALUES (23)"
  --query="SELECT * FROM a" --concurrency=50 --iterations=200
```

Let **mysqlslap** build the query SQL statement with a table of two `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") columns and three `VARCHAR` columns. Use five clients querying 20 times each. Do not create the table or insert the data (that is, use the previous test's schema and data):

```sql
mysqlslap --concurrency=5 --iterations=20
  --number-int-cols=2 --number-char-cols=3
  --auto-generate-sql
```

Tell the program to load the create, insert, and query SQL statements from the specified files, where the `create.sql` file has multiple table creation statements delimited by `';'` and multiple insert statements delimited by `';'`. The `--query` file has multiple queries delimited by `';'`. Run all the load statements, then run all the queries in the query file with five clients (five times each):

```sql
mysqlslap --concurrency=5
  --iterations=5 --query=query.sql --create=create.sql
  --delimiter=";"
```

**mysqlslap** supports the following options, which can be specified on the command line or in the `[mysqlslap]` and `[client]` groups of an option file. For information about option files used by MySQL programs, see Section 4.2.2.2, “Using Option Files”.

**Table 4.20 mysqlslap Options**

<table frame="box" rules="all" summary="Command-line options available for mysqlslap."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th> <th scope="col">Description</th> <th scope="col">Introduced</th> <th scope="col">Deprecated</th> </tr></thead><tbody><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_auto-generate-sql">--auto-generate-sql</a></th> <td>Generate SQL statements automatically when they are not supplied in files or using command options</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_auto-generate-sql-add-autoincrement">--auto-generate-sql-add-autoincrement</a></th> <td>Add AUTO_INCREMENT column to automatically generated tables</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_auto-generate-sql-execute-number">--auto-generate-sql-execute-number</a></th> <td>Specify how many queries to generate automatically</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_auto-generate-sql-guid-primary">--auto-generate-sql-guid-primary</a></th> <td>Add a GUID-based primary key to automatically generated tables</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_auto-generate-sql-load-type">--auto-generate-sql-load-type</a></th> <td>Specify the test load type</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_auto-generate-sql-secondary-indexes">--auto-generate-sql-secondary-indexes</a></th> <td>Specify how many secondary indexes to add to automatically generated tables</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_auto-generate-sql-unique-query-number">--auto-generate-sql-unique-query-number</a></th> <td>How many different queries to generate for automatic tests</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_auto-generate-sql-unique-write-number">--auto-generate-sql-unique-write-number</a></th> <td>How many different queries to generate for --auto-generate-sql-write-number</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_auto-generate-sql-write-number">--auto-generate-sql-write-number</a></th> <td>How many row inserts to perform on each thread</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_commit">--commit</a></th> <td>How many statements to execute before committing</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_compress">--compress</a></th> <td>Compress all information sent between client and server</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_concurrency">--concurrency</a></th> <td>Number of clients to simulate when issuing the SELECT statement</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_create">--create</a></th> <td>File or string containing the statement to use for creating the table</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_create-schema">--create-schema</a></th> <td>Schema in which to run the tests</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_csv">--csv</a></th> <td>Generate output in comma-separated values format</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_debug">--debug</a></th> <td>Write debugging log</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_debug-check">--debug-check</a></th> <td>Print debugging information when program exits</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_debug-info">--debug-info</a></th> <td>Print debugging information, memory, and CPU statistics when program exits</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_default-auth">--default-auth</a></th> <td>Authentication plugin to use</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_defaults-extra-file">--defaults-extra-file</a></th> <td>Read named option file in addition to usual option files</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_defaults-file">--defaults-file</a></th> <td>Read only named option file</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_defaults-group-suffix">--defaults-group-suffix</a></th> <td>Option group suffix value</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_delimiter">--delimiter</a></th> <td>Delimiter to use in SQL statements</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_detach">--detach</a></th> <td>Detach (close and reopen) each connection after each N statements</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_enable-cleartext-plugin">--enable-cleartext-plugin</a></th> <td>Enable cleartext authentication plugin</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_engine">--engine</a></th> <td>Storage engine to use for creating the table</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_get-server-public-key">--get-server-public-key</a></th> <td>Request RSA public key from server</td> <td>5.7.23</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_help">--help</a></th> <td>Display help message and exit</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_host">--host</a></th> <td>Host on which MySQL server is located</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_iterations">--iterations</a></th> <td>Number of times to run the tests</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_login-path">--login-path</a></th> <td>Read login path options from .mylogin.cnf</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_no-defaults">--no-defaults</a></th> <td>Read no option files</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_no-drop">--no-drop</a></th> <td>Do not drop any schema created during the test run</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_number-char-cols">--number-char-cols</a></th> <td>Number of VARCHAR columns to use if --auto-generate-sql is specified</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_number-int-cols">--number-int-cols</a></th> <td>Number of INT columns to use if --auto-generate-sql is specified</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_number-of-queries">--number-of-queries</a></th> <td>Limit each client to approximately this number of queries</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_only-print">--only-print</a></th> <td>Do not connect to databases. mysqlslap only prints what it would have done</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_password">--password</a></th> <td>Password to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_pipe">--pipe</a></th> <td>Connect to server using named pipe (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_plugin-dir">--plugin-dir</a></th> <td>Directory where plugins are installed</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_port">--port</a></th> <td>TCP/IP port number for connection</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_post-query">--post-query</a></th> <td>File or string containing the statement to execute after the tests have completed</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_post-system">--post-system</a></th> <td>String to execute using system() after the tests have completed</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_pre-query">--pre-query</a></th> <td>File or string containing the statement to execute before running the tests</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_pre-system">--pre-system</a></th> <td>String to execute using system() before running the tests</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_print-defaults">--print-defaults</a></th> <td>Print default options</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_protocol">--protocol</a></th> <td>Transport protocol to use</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_query">--query</a></th> <td>File or string containing the SELECT statement to use for retrieving data</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_secure-auth">--secure-auth</a></th> <td>Do not send passwords to server in old (pre-4.1) format</td> <td></td> <td>Yes</td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_server-public-key-path">--server-public-key-path</a></th> <td>Path name to file containing RSA public key</td> <td>5.7.23</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_shared-memory-base-name">--shared-memory-base-name</a></th> <td>Shared-memory name for shared-memory connections (Windows only)</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_silent">--silent</a></th> <td>Silent mode</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_socket">--socket</a></th> <td>Unix socket file or Windows named pipe to use</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_sql-mode">--sql-mode</a></th> <td>Set SQL mode for client session</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_ssl">--ssl</a></th> <td>Enable connection encryption</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_ssl">--ssl-ca</a></th> <td>File that contains list of trusted SSL Certificate Authorities</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_ssl">--ssl-capath</a></th> <td>Directory that contains trusted SSL Certificate Authority certificate files</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_ssl">--ssl-cert</a></th> <td>File that contains X.509 certificate</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_ssl">--ssl-cipher</a></th> <td>Permissible ciphers for connection encryption</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_ssl">--ssl-crl</a></th> <td>File that contains certificate revocation lists</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_ssl">--ssl-crlpath</a></th> <td>Directory that contains certificate revocation-list files</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_ssl">--ssl-key</a></th> <td>File that contains X.509 key</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_ssl">--ssl-mode</a></th> <td>Desired security state of connection to server</td> <td>5.7.11</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_ssl">--ssl-verify-server-cert</a></th> <td>Verify host name against server certificate Common Name identity</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_tls-version">--tls-version</a></th> <td>Permissible TLS protocols for encrypted connections</td> <td>5.7.10</td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_user">--user</a></th> <td>MySQL user name to use when connecting to server</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_verbose">--verbose</a></th> <td>Verbose mode</td> <td></td> <td></td> </tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_version">--version</a></th> <td>Display version information and exit</td> <td></td> <td></td> </tr></tbody></table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--auto-generate-sql`, `-a`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  Generate SQL statements automatically when they are not supplied in files or using command options.

* `--auto-generate-sql-add-autoincrement`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  Add an `AUTO_INCREMENT` column to automatically generated tables.

* `--auto-generate-sql-execute-number=N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  Specify how many queries to generate automatically.

* `--auto-generate-sql-guid-primary`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>

  Add a GUID-based primary key to automatically generated tables.

* `--auto-generate-sql-load-type=type`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-load-type"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-load-type=type</code></td> </tr><tr><th>Type</th> <td>Enumeration</td> </tr><tr><th>Default Value</th> <td><code class="literal">mixed</code></td> </tr><tr><th>Valid Values</th> <td><p class="valid-value"><code class="literal">read</code></p><p class="valid-value"><code class="literal">write</code></p><p class="valid-value"><code class="literal">key</code></p><p class="valid-value"><code class="literal">update</code></p><p class="valid-value"><code class="literal">mixed</code></p></td> </tr></tbody></table>

  Specify the test load type. The permissible values are `read` (scan tables), `write` (insert into tables), `key` (read primary keys), `update` (update primary keys), or `mixed` (half inserts, half scanning selects). The default is `mixed`.

* `--auto-generate-sql-secondary-indexes=N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-secondary-indexes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-secondary-indexes=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code class="literal">0</code></td> </tr></tbody></table>

  Specify how many secondary indexes to add to automatically generated tables. By default, none are added.

* `--auto-generate-sql-unique-query-number=N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-unique-query-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-unique-query-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code class="literal">10</code></td> </tr></tbody></table>

  How many different queries to generate for automatic tests. For example, if you run a `key` test that performs 1000 selects, you can use this option with a value of 1000 to run 1000 unique queries, or with a value of 50 to perform 50 different selects. The default is 10.

* `--auto-generate-sql-unique-write-number=N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-unique-write-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-unique-write-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code class="literal">10</code></td> </tr></tbody></table>

  How many different queries to generate for `--auto-generate-sql-write-number`. The default is 10.

* `--auto-generate-sql-write-number=N`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>0

  How many row inserts to perform. The default is 100.

* `--commit=N`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>1

  How many statements to execute before committing. The default is 0 (no commits are done).

* `--compress`, `-C`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>2

  Compress all information sent between the client and the server if possible. See Section 4.2.6, “Connection Compression Control”.

* `--concurrency=N`, `-c N`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>3

  The number of parallel clients to simulate.

* `--create=value`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>4

  The file or string containing the statement to use for creating the table.

* `--create-schema=value`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>5

  The schema in which to run the tests.

  Note

  If the `--auto-generate-sql` option is also given, **mysqlslap** drops the schema at the end of the test run. To avoid this, use the `--no-drop` option as well.

* `--csv[=file_name]`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>6

  Generate output in comma-separated values format. The output goes to the named file, or to the standard output if no file is given.

* `--debug[=debug_options]`, `-# [debug_options]`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>7

  Write a debugging log. A typical *`debug_options`* string is `d:t:o,file_name`. The default is `d:t:o,/tmp/mysqlslap.trace`.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-check`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>8

  Print some debugging information when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>9

  Print debugging information and memory and CPU usage statistics when the program exits.

  This option is available only if MySQL was built using `WITH_DEBUG`. MySQL release binaries provided by Oracle are *not* built using this option.

* `--default-auth=plugin`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>0

  A hint about which client-side authentication plugin to use. See Section 6.2.13, “Pluggable Authentication”.

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>1

  Read this option file after the global option file but (on Unix) before the user option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>2

  Use only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  Exception: Even with `--defaults-file`, client programs read `.mylogin.cnf`.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>3

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, **mysqlslap** normally reads the `[client]` and `[mysqlslap]` groups. If this option is given as `--defaults-group-suffix=_other`, **mysqlslap** also reads the `[client_other]` and `[mysqlslap_other]` groups.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--delimiter=str`, `-F str`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>4

  The delimiter to use in SQL statements supplied in files or using command options.

* `--detach=N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>5

  Detach (close and reopen) each connection after each *`N`* statements. The default is 0 (connections are not detached).

* `--enable-cleartext-plugin`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>6

  Enable the `mysql_clear_password` cleartext authentication plugin. (See Section 6.4.1.6, “Client-Side Cleartext Pluggable Authentication”.)

* `--engine=engine_name`, `-e engine_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>7

  The storage engine to use for creating tables.

* `--get-server-public-key`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>8

  Request from the server the RSA public key that it uses for key pair-based password exchange. This option applies to clients that connect to the server using an account that authenticates with the `caching_sha2_password` authentication plugin. For connections by such accounts, the server does not send the public key to the client unless requested. The option is ignored for accounts that do not authenticate with that plugin. It is also ignored if RSA-based password exchange is not needed, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For information about the `caching_sha2_password` plugin, see Section 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

  The `--get-server-public-key` option was added in MySQL 5.7.23.

* `--host=host_name`, `-h host_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>9

  Connect to the MySQL server on the given host.

* `--iterations=N`, `-i N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>0

  The number of times to run the tests.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>1

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql\_config\_editor** utility. See Section 4.6.6, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--no-drop`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>2

  Prevent **mysqlslap** from dropping any schema it creates during the test run.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>3

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that the `.mylogin.cnf` file is read in all cases, if it exists. This permits passwords to be specified in a safer way than on the command line even when `--no-defaults` is used. To create `.mylogin.cnf`, use the **mysql\_config\_editor** utility. See Section 4.6.6, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--number-char-cols=N`, `-x N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>4

  The number of `VARCHAR` columns to use if `--auto-generate-sql` is specified.

* `--number-int-cols=N`, `-y N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>5

  The number of `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") columns to use if `--auto-generate-sql` is specified.

* `--number-of-queries=N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>6

  Limit each client to approximately this many queries. Query counting takes into account the statement delimiter. For example, if you invoke **mysqlslap** as follows, the `;` delimiter is recognized so that each instance of the query string counts as two queries. As a result, 5 rows (not 10) are inserted.

  ```sql
  mysqlslap --delimiter=";" --number-of-queries=10
            --query="use test;insert into t values(null)"
  ```

* `--only-print`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>7

  Do not connect to databases. **mysqlslap** only prints what it would have done.

* `--password[=password]`, `-p[password]`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>8

  The password of the MySQL account used for connecting to the server. The password value is optional. If not given, **mysqlslap** prompts for one. If given, there must be *no space* between `--password=` or `-p` and the password following it. If no password option is specified, the default is to send no password.

  Specifying a password on the command line should be considered insecure. To avoid giving the password on the command line, use an option file. See Section 6.1.2.1, “End-User Guidelines for Password Security”.

  To explicitly specify that there is no password and that **mysqlslap** should not prompt for one, use the `--skip-password` option.

* `--pipe`, `-W`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-add-autoincrement</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>9

  On Windows, connect to the server using a named pipe. This option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--plugin-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>0

  The directory in which to look for plugins. Specify this option if the `--default-auth` option is used to specify an authentication plugin but **mysqlslap** does not find it. See Section 6.2.13, “Pluggable Authentication”.

* `--port=port_num`, `-P port_num`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>1

  For TCP/IP connections, the port number to use.

* `--post-query=value`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>2

  The file or string containing the statement to execute after the tests have completed. This execution is not counted for timing purposes.

* `--post-system=str`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>3

  The string to execute using `system()` after the tests have completed. This execution is not counted for timing purposes.

* `--pre-query=value`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>4

  The file or string containing the statement to execute before running the tests. This execution is not counted for timing purposes.

* `--pre-system=str`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>5

  The string to execute using `system()` before running the tests. This execution is not counted for timing purposes.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>6

  Print the program name and all options that it gets from option files.

  For additional information about this and other option-file options, see Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”.

* `--protocol={TCP|SOCKET|PIPE|MEMORY}`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>7

  The transport protocol to use for connecting to the server. It is useful when the other connection parameters normally result in use of a protocol other than the one you want. For details on the permissible values, see Section 4.2.5, “Connection Transport Protocols”.

* `--query=value`, `-q value`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>8

  The file or string containing the `SELECT` statement to use for retrieving data.

* `--secure-auth`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-execute-number=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>9

  Do not send passwords to the server in old (pre-4.1) format. This prevents connections except for servers that use the newer password format.

  As of MySQL 5.7.5, this option is deprecated; expect it to be removed in a future MySQL release. It is always enabled and attempting to disable it (`--skip-secure-auth`, `--secure-auth=0`) produces an error. Before MySQL 5.7.5, this option is enabled by default but can be disabled.

  Note

  Passwords that use the pre-4.1 hashing method are less secure than passwords that use the native password hashing method and should be avoided. Pre-4.1 passwords are deprecated and support for them was removed in MySQL 5.7.5. For account upgrade instructions, see Section 6.4.1.3, “Migrating Away from Pre-4.1 Password Hashing and the mysql\_old\_password Plugin”.

* `--server-public-key-path=file_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>0

  The path name to a file in PEM format containing a client-side copy of the public key required by the server for RSA key pair-based password exchange. This option applies to clients that authenticate with the `sha256_password` or `caching_sha2_password` authentication plugin. This option is ignored for accounts that do not authenticate with one of those plugins. It is also ignored if RSA-based password exchange is not used, as is the case when the client connects to the server using a secure connection.

  If `--server-public-key-path=file_name` is given and specifies a valid public key file, it takes precedence over `--get-server-public-key`.

  For `sha256_password`, this option applies only if MySQL was built using OpenSSL.

  For information about the `sha256_password` and `caching_sha2_password` plugins, see Section 6.4.1.5, “SHA-256 Pluggable Authentication”, and Section 6.4.1.4, “Caching SHA-2 Pluggable Authentication”.

  The `--server-public-key-path` option was added in MySQL 5.7.23.

* `--shared-memory-base-name=name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>1

  On Windows, the shared-memory name to use for connections made using shared memory to a local server. The default value is `MYSQL`. The shared-memory name is case-sensitive.

  This option applies only if the server was started with the `shared_memory` system variable enabled to support shared-memory connections.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>2

  Silent mode. No output.

* `--socket=path`, `-S path`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>3

  For connections to `localhost`, the Unix socket file to use, or, on Windows, the name of the named pipe to use.

  On Windows, this option applies only if the server was started with the `named_pipe` system variable enabled to support named-pipe connections. In addition, the user making the connection must be a member of the Windows group specified by the `named_pipe_full_access_group` system variable.

* `--sql-mode=mode`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>4

  Set the SQL mode for the client session.

* `--ssl*`

  Options that begin with `--ssl` specify whether to connect to the server using encryption and indicate where to find SSL keys and certificates. See Command Options for Encrypted Connections.

* `--tls-version=protocol_list`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>5

  The permissible TLS protocols for encrypted connections. The value is a list of one or more comma-separated protocol names. The protocols that can be named for this option depend on the SSL library used to compile MySQL. For details, see Section 6.3.2, “Encrypted Connection TLS Protocols and Ciphers”.

  This option was added in MySQL 5.7.10.

* `--user=user_name`, `-u user_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>6

  The user name of the MySQL account to use for connecting to the server.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>7

  Verbose mode. Print more information about what the program does. This option can be used multiple times to increase the amount of information.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--auto-generate-sql-guid-primary</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr></tbody></table>8

  Display version information and exit.
