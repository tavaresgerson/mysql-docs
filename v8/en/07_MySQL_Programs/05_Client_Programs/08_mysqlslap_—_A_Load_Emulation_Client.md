### 6.5.8 mysqlslap — A Load Emulation Client

[**mysqlslap**](mysqlslap.html "6.5.8 mysqlslap — A Load Emulation Client") is a diagnostic program designed to
emulate client load for a MySQL server and to report the timing
of each stage. It works as if multiple clients are accessing the
server.

Invoke [**mysqlslap**](mysqlslap.html "6.5.8 mysqlslap — A Load Emulation Client") like this:

```
mysqlslap [options]
```

Some options such as [`--create`](mysqlslap.html#option_mysqlslap_create)
or [`--query`](mysqlslap.html#option_mysqlslap_query) enable you to
specify a string containing an SQL statement or a file
containing statements. If you specify a file, by default it must
contain one statement per line. (That is, the implicit statement
delimiter is the newline character.) Use the
[`--delimiter`](mysqlslap.html#option_mysqlslap_delimiter) option to specify
a different delimiter, which enables you to specify statements
that span multiple lines or place multiple statements on a
single line. You cannot include comments in a file;
[**mysqlslap**](mysqlslap.html "6.5.8 mysqlslap — A Load Emulation Client") does not understand them.

[**mysqlslap**](mysqlslap.html "6.5.8 mysqlslap — A Load Emulation Client") runs in three stages:

1. Create schema, table, and optionally any stored programs or
   data to use for the test. This stage uses a single client
   connection.

2. Run the load test. This stage can use many client
   connections.

3. Clean up (disconnect, drop table if specified). This stage
   uses a single client connection.

Examples:

Supply your own create and query SQL statements, with 50 clients
querying and 200 selects for each (enter the command on a single
line):

```
mysqlslap --delimiter=";"
  --create="CREATE TABLE a (b int);INSERT INTO a VALUES (23)"
  --query="SELECT * FROM a" --concurrency=50 --iterations=200
```

Let [**mysqlslap**](mysqlslap.html "6.5.8 mysqlslap — A Load Emulation Client") build the query SQL statement
with a table of two [`INT`](integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") columns
and three [`VARCHAR`](char.html "13.3.2 The CHAR and VARCHAR Types") columns. Use
five clients querying 20 times each. Do not create the table or
insert the data (that is, use the previous test's schema and
data):

```
mysqlslap --concurrency=5 --iterations=20
  --number-int-cols=2 --number-char-cols=3
  --auto-generate-sql
```

Tell the program to load the create, insert, and query SQL
statements from the specified files, where the
`create.sql` file has multiple table creation
statements delimited by `';'` and multiple
insert statements delimited by `';'`. The
`--query` file should contain multiple queries
delimited by `';'`. Run all the load
statements, then run all the queries in the query file with five
clients (five times each):

```
mysqlslap --concurrency=5
  --iterations=5 --query=query.sql --create=create.sql
  --delimiter=";"
```

[**mysqlslap**](mysqlslap.html "6.5.8 mysqlslap — A Load Emulation Client") supports the following options,
which can be specified on the command line or in the
`[mysqlslap]` and `[client]`
groups of an option file. For information about option files
used by MySQL programs, see [Section 6.2.2.2, “Using Option Files”](option-files.html "6.2.2.2 Using Option Files").

**Table 6.19 mysqlslap Options**

<table frame="box" rules="all" summary="Command-line options available for mysqlslap."><col style="width: 27%"/><col style="width: 50%"/><col style="width: 11%"/><col style="width: 11%"/><thead><tr><th scope="col">Option Name</th>
<th scope="col">Description</th>
<th scope="col">Introduced</th>
<th scope="col">Deprecated</th>
</tr></thead><tbody><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_auto-generate-sql">--auto-generate-sql</a></th>
<td>Generate SQL statements automatically when they are not supplied in files or using command options</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_auto-generate-sql-add-autoincrement">--auto-generate-sql-add-autoincrement</a></th>
<td>Add AUTO_INCREMENT column to automatically generated tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_auto-generate-sql-execute-number">--auto-generate-sql-execute-number</a></th>
<td>Specify how many queries to generate automatically</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_auto-generate-sql-guid-primary">--auto-generate-sql-guid-primary</a></th>
<td>Add a GUID-based primary key to automatically generated tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_auto-generate-sql-load-type">--auto-generate-sql-load-type</a></th>
<td>Specify the test load type</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_auto-generate-sql-secondary-indexes">--auto-generate-sql-secondary-indexes</a></th>
<td>Specify how many secondary indexes to add to automatically generated tables</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_auto-generate-sql-unique-query-number">--auto-generate-sql-unique-query-number</a></th>
<td>How many different queries to generate for automatic tests</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_auto-generate-sql-unique-write-number">--auto-generate-sql-unique-write-number</a></th>
<td>How many different queries to generate for --auto-generate-sql-write-number</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_auto-generate-sql-write-number">--auto-generate-sql-write-number</a></th>
<td>How many row inserts to perform on each thread</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_commit">--commit</a></th>
<td>How many statements to execute before committing</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_compress">--compress</a></th>
<td>Compress all information sent between client and server</td>
<td></td>
<td>8.0.18</td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_compression-algorithms">--compression-algorithms</a></th>
<td>Permitted compression algorithms for connections to server</td>
<td>8.0.18</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_concurrency">--concurrency</a></th>
<td>Number of clients to simulate when issuing the SELECT statement</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_create">--create</a></th>
<td>File or string containing the statement to use for creating the table</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_create-schema">--create-schema</a></th>
<td>Schema in which to run the tests</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_csv">--csv</a></th>
<td>Generate output in comma-separated values format</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_debug">--debug</a></th>
<td>Write debugging log</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_debug-check">--debug-check</a></th>
<td>Print debugging information when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_debug-info">--debug-info</a></th>
<td>Print debugging information, memory, and CPU statistics when program exits</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_default-auth">--default-auth</a></th>
<td>Authentication plugin to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_defaults-extra-file">--defaults-extra-file</a></th>
<td>Read named option file in addition to usual option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_defaults-file">--defaults-file</a></th>
<td>Read only named option file</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_defaults-group-suffix">--defaults-group-suffix</a></th>
<td>Option group suffix value</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_delimiter">--delimiter</a></th>
<td>Delimiter to use in SQL statements</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_detach">--detach</a></th>
<td>Detach (close and reopen) each connection after each N statements</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_enable-cleartext-plugin">--enable-cleartext-plugin</a></th>
<td>Enable cleartext authentication plugin</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_engine">--engine</a></th>
<td>Storage engine to use for creating the table</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_get-server-public-key">--get-server-public-key</a></th>
<td>Request RSA public key from server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_help">--help</a></th>
<td>Display help message and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_host">--host</a></th>
<td>Host on which MySQL server is located</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_iterations">--iterations</a></th>
<td>Number of times to run the tests</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_login-path">--login-path</a></th>
<td>Read login path options from .mylogin.cnf</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_no-defaults">--no-defaults</a></th>
<td>Read no option files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_no-drop">--no-drop</a></th>
<td>Do not drop any schema created during the test run</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_number-char-cols">--number-char-cols</a></th>
<td>Number of VARCHAR columns to use if --auto-generate-sql is specified</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_number-int-cols">--number-int-cols</a></th>
<td>Number of INT columns to use if --auto-generate-sql is specified</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_number-of-queries">--number-of-queries</a></th>
<td>Limit each client to approximately this number of queries</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_only-print">--only-print</a></th>
<td>Do not connect to databases. mysqlslap only prints what it would have done</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_password">--password</a></th>
<td>Password to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_password1">--password1</a></th>
<td>First multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_password2">--password2</a></th>
<td>Second multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_password3">--password3</a></th>
<td>Third multifactor authentication password to use when connecting to server</td>
<td>8.0.27</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_pipe">--pipe</a></th>
<td>Connect to server using named pipe (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_plugin-dir">--plugin-dir</a></th>
<td>Directory where plugins are installed</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_port">--port</a></th>
<td>TCP/IP port number for connection</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_post-query">--post-query</a></th>
<td>File or string containing the statement to execute after the tests have completed</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_post-system">--post-system</a></th>
<td>String to execute using system() after the tests have completed</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_pre-query">--pre-query</a></th>
<td>File or string containing the statement to execute before running the tests</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_pre-system">--pre-system</a></th>
<td>String to execute using system() before running the tests</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_print-defaults">--print-defaults</a></th>
<td>Print default options</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_protocol">--protocol</a></th>
<td>Transport protocol to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_query">--query</a></th>
<td>File or string containing the SELECT statement to use for retrieving data</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_server-public-key-path">--server-public-key-path</a></th>
<td>Path name to file containing RSA public key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_shared-memory-base-name">--shared-memory-base-name</a></th>
<td>Shared-memory name for shared-memory connections (Windows only)</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_silent">--silent</a></th>
<td>Silent mode</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_socket">--socket</a></th>
<td>Unix socket file or Windows named pipe to use</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_sql-mode">--sql-mode</a></th>
<td>Set SQL mode for client session</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_ssl">--ssl-ca</a></th>
<td>File that contains list of trusted SSL Certificate Authorities</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_ssl">--ssl-capath</a></th>
<td>Directory that contains trusted SSL Certificate Authority certificate files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_ssl">--ssl-cert</a></th>
<td>File that contains X.509 certificate</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_ssl">--ssl-cipher</a></th>
<td>Permissible ciphers for connection encryption</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_ssl">--ssl-crl</a></th>
<td>File that contains certificate revocation lists</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_ssl">--ssl-crlpath</a></th>
<td>Directory that contains certificate revocation-list files</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_ssl-fips-mode">--ssl-fips-mode</a></th>
<td>Whether to enable FIPS mode on client side</td>
<td></td>
<td>8.0.34</td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_ssl">--ssl-key</a></th>
<td>File that contains X.509 key</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_ssl">--ssl-mode</a></th>
<td>Desired security state of connection to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_ssl">--ssl-session-data</a></th>
<td>File that contains SSL session data</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_ssl">--ssl-session-data-continue-on-failed-reuse</a></th>
<td>Whether to establish connections if session reuse fails</td>
<td>8.0.29</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_tls-ciphersuites">--tls-ciphersuites</a></th>
<td>Permissible TLSv1.3 ciphersuites for encrypted connections</td>
<td>8.0.16</td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_tls-version">--tls-version</a></th>
<td>Permissible TLS protocols for encrypted connections</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_user">--user</a></th>
<td>MySQL user name to use when connecting to server</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_verbose">--verbose</a></th>
<td>Verbose mode</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_version">--version</a></th>
<td>Display version information and exit</td>
<td></td>
<td></td>
</tr><tr><th scope="row"><a class="link" href="mysqlslap.html#option_mysqlslap_zstd-compression-level">--zstd-compression-level</a></th>
<td>Compression level for connections to server that use zstd compression</td>
<td>8.0.18</td>
<td></td>
</tr></tbody></table>

* [`--help`](mysqlslap.html#option_mysqlslap_help),
  `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>

  Display a help message and exit.

* [`--auto-generate-sql`](mysqlslap.html#option_mysqlslap_auto-generate-sql),
  `-a`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>

  Generate SQL statements automatically when they are not
  supplied in files or using command options.

* [`--auto-generate-sql-add-autoincrement`](mysqlslap.html#option_mysqlslap_auto-generate-sql-add-autoincrement)

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-add-autoincrement</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>

  Add an `AUTO_INCREMENT` column to
  automatically generated tables.

* [`--auto-generate-sql-execute-number=N`](mysqlslap.html#option_mysqlslap_auto-generate-sql-execute-number)

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-execute-number=#</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr></tbody></table>

  Specify how many queries to generate automatically.

* [`--auto-generate-sql-guid-primary`](mysqlslap.html#option_mysqlslap_auto-generate-sql-guid-primary)

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-guid-primary</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>

  Add a GUID-based primary key to automatically generated
  tables.

* [`--auto-generate-sql-load-type=type`](mysqlslap.html#option_mysqlslap_auto-generate-sql-load-type)

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-load-type"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-load-type=type</code></td>
</tr><tr><th>Type</th>
<td>Enumeration</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">mixed</code></td>
</tr><tr><th>Valid Values</th>
<td><p class="valid-value"><code class="literal">read</code></p><p class="valid-value"><code class="literal">write</code></p><p class="valid-value"><code class="literal">key</code></p><p class="valid-value"><code class="literal">update</code></p><p class="valid-value"><code class="literal">mixed</code></p></td>
</tr></tbody></table>

  Specify the test load type. The permissible values are
  `read` (scan tables),
  `write` (insert into tables),
  `key` (read primary keys),
  `update` (update primary keys), or
  `mixed` (half inserts, half scanning
  selects). The default is `mixed`.

* [`--auto-generate-sql-secondary-indexes=N`](mysqlslap.html#option_mysqlslap_auto-generate-sql-secondary-indexes)

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-secondary-indexes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-secondary-indexes=#</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">0</code></td>
</tr></tbody></table>

  Specify how many secondary indexes to add to automatically
  generated tables. By default, none are added.

* [`--auto-generate-sql-unique-query-number=N`](mysqlslap.html#option_mysqlslap_auto-generate-sql-unique-query-number)

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-unique-query-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-unique-query-number=#</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">10</code></td>
</tr></tbody></table>

  How many different queries to generate for automatic tests.
  For example, if you run a `key` test that
  performs 1000 selects, you can use this option with a value
  of 1000 to run 1000 unique queries, or with a value of 50 to
  perform 50 different selects. The default is 10.

* [`--auto-generate-sql-unique-write-number=N`](mysqlslap.html#option_mysqlslap_auto-generate-sql-unique-write-number)

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-unique-write-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-unique-write-number=#</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">10</code></td>
</tr></tbody></table>

  How many different queries to generate for
  [`--auto-generate-sql-write-number`](mysqlslap.html#option_mysqlslap_auto-generate-sql-write-number).
  The default is 10.

* [`--auto-generate-sql-write-number=N`](mysqlslap.html#option_mysqlslap_auto-generate-sql-write-number)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>0

  How many row inserts to perform. The default is 100.

* [`--commit=N`](mysqlslap.html#option_mysqlslap_commit)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>1

  How many statements to execute before committing. The
  default is 0 (no commits are done).

* [`--compress`](mysqlslap.html#option_mysqlslap_compress),
  `-C`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>2

  Compress all information sent between the client and the
  server if possible. See
  [Section 6.2.8, “Connection Compression Control”](connection-compression-control.html "6.2.8 Connection Compression Control").

  As of MySQL 8.0.18, this option is deprecated. Expect it to
  be removed in a future version of MySQL. See
  [Configuring Legacy Connection Compression](connection-compression-control.html#connection-compression-legacy-configuration "Configuring Legacy Connection Compression").

* [`--compression-algorithms=value`](mysqlslap.html#option_mysqlslap_compression-algorithms)

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

* [`--concurrency=N`](mysqlslap.html#option_mysqlslap_concurrency),
  `-c N`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>4

  The number of parallel clients to simulate.

* [`--create=value`](mysqlslap.html#option_mysqlslap_create)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>5

  The file or string containing the statement to use for
  creating the table.

* [`--create-schema=value`](mysqlslap.html#option_mysqlslap_create-schema)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>6

  The schema in which to run the tests.

  Note

  If the
  [`--auto-generate-sql`](mysqlslap.html#option_mysqlslap_auto-generate-sql)
  option is also given, [**mysqlslap**](mysqlslap.html "6.5.8 mysqlslap — A Load Emulation Client") drops
  the schema at the end of the test run. To avoid this, use
  the [`--no-drop`](mysqlslap.html#option_mysqlslap_no-drop) option as
  well.

* [`--csv[=file_name]`](mysqlslap.html#option_mysqlslap_csv)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>7

  Generate output in comma-separated values format. The output
  goes to the named file, or to the standard output if no file
  is given.

* [`--debug[=debug_options]`](mysqlslap.html#option_mysqlslap_debug),
  `-#
  [debug_options]`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>8

  Write a debugging log. A typical
  *`debug_options`* string is
  `d:t:o,file_name`.
  The default is
  `d:t:o,/tmp/mysqlslap.trace`.

  This option is available only if MySQL was built using
  [`WITH_DEBUG`](source-configuration-options.html#option_cmake_with_debug). MySQL release
  binaries provided by Oracle are *not*
  built using this option.

* [`--debug-check`](mysqlslap.html#option_mysqlslap_debug-check)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>9

  Print some debugging information when the program exits.

  This option is available only if MySQL was built using
  [`WITH_DEBUG`](source-configuration-options.html#option_cmake_with_debug). MySQL release
  binaries provided by Oracle are *not*
  built using this option.

* [`--debug-info`](mysqlslap.html#option_mysqlslap_debug-info),
  `-T`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>0

  Print debugging information and memory and CPU usage
  statistics when the program exits.

  This option is available only if MySQL was built using
  [`WITH_DEBUG`](source-configuration-options.html#option_cmake_with_debug). MySQL release
  binaries provided by Oracle are *not*
  built using this option.

* [`--default-auth=plugin`](mysqlslap.html#option_mysqlslap_default-auth)

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>1

  A hint about which client-side authentication plugin to use.
  See [Section 8.2.17, “Pluggable Authentication”](pluggable-authentication.html "8.2.17 Pluggable Authentication").

* [`--defaults-extra-file=file_name`](mysqlslap.html#option_mysqlslap_defaults-extra-file)

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>2

  Read this option file after the global option file but (on
  Unix) before the user option file. If the file does not
  exist or is otherwise inaccessible, an error occurs. If
  *`file_name`* is not an absolute path
  name, it is interpreted relative to the current directory.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--defaults-file=file_name`](mysqlslap.html#option_mysqlslap_defaults-file)

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>3

  Use only the given option file. If the file does not exist
  or is otherwise inaccessible, an error occurs. If
  *`file_name`* is not an absolute path
  name, it is interpreted relative to the current directory.

  Exception: Even with
  [`--defaults-file`](option-file-options.html#option_general_defaults-file), client
  programs read `.mylogin.cnf`.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--defaults-group-suffix=str`](mysqlslap.html#option_mysqlslap_defaults-group-suffix)

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>4

  Read not only the usual option groups, but also groups with
  the usual names and a suffix of
  *`str`*. For example,
  [**mysqlslap**](mysqlslap.html "6.5.8 mysqlslap — A Load Emulation Client") normally reads the
  `[client]` and
  `[mysqlslap]` groups. If this option is
  given as
  [`--defaults-group-suffix=_other`](mysqlslap.html#option_mysqlslap_defaults-group-suffix),
  [**mysqlslap**](mysqlslap.html "6.5.8 mysqlslap — A Load Emulation Client") also reads the
  `[client_other]` and
  `[mysqlslap_other]` groups.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--delimiter=str`](mysqlslap.html#option_mysqlslap_delimiter),
  `-F str`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>5

  The delimiter to use in SQL statements supplied in files or
  using command options.

* [`--detach=N`](mysqlslap.html#option_mysqlslap_detach)

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>6

  Detach (close and reopen) each connection after each
  *`N`* statements. The default is 0
  (connections are not detached).

* [`--enable-cleartext-plugin`](mysqlslap.html#option_mysqlslap_enable-cleartext-plugin)

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>7

  Enable the `mysql_clear_password` cleartext
  authentication plugin. (See
  [Section 8.4.1.4, “Client-Side Cleartext Pluggable Authentication”](cleartext-pluggable-authentication.html "8.4.1.4 Client-Side Cleartext Pluggable Authentication").)

* [`--engine=engine_name`](mysqlslap.html#option_mysqlslap_engine),
  `-e engine_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>8

  The storage engine to use for creating tables.

* [`--get-server-public-key`](mysqlslap.html#option_mysqlslap_get-server-public-key)

  <table frame="box" rules="all" summary="Properties for auto-generate-sql"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>9

  Request from the server the RSA public key that it uses for
  key pair-based password exchange. This option applies to
  clients that connect to the server using an account that
  authenticates with the
  `caching_sha2_password` authentication
  plugin. For connections by such accounts, the server does
  not send the public key to the client unless requested. The
  option is ignored for accounts that do not authenticate with
  that plugin. It is also ignored if RSA-based password
  exchange is not needed, as is the case when the client
  connects to the server using a secure connection.

  If
  [`--server-public-key-path=file_name`](mysqlslap.html#option_mysqlslap_server-public-key-path)
  is given and specifies a valid public key file, it takes
  precedence over
  [`--get-server-public-key`](mysqlslap.html#option_mysqlslap_get-server-public-key).

  For information about the
  `caching_sha2_password` plugin, see
  [Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”](caching-sha2-pluggable-authentication.html "8.4.1.2 Caching SHA-2 Pluggable Authentication").

* [`--host=host_name`](mysqlslap.html#option_mysqlslap_host),
  `-h host_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-add-autoincrement</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>0

  Connect to the MySQL server on the given host.

* [`--iterations=N`](mysqlslap.html#option_mysqlslap_iterations),
  `-i N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-add-autoincrement</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>1

  The number of times to run the tests.

* [`--login-path=name`](mysqlslap.html#option_mysqlslap_login-path)

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-add-autoincrement</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>2

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

* [`--no-drop`](mysqlslap.html#option_mysqlslap_no-drop)

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-add-autoincrement</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>3

  Prevent [**mysqlslap**](mysqlslap.html "6.5.8 mysqlslap — A Load Emulation Client") from dropping any
  schema it creates during the test run.

* [`--no-defaults`](mysqlslap.html#option_mysqlslap_no-defaults)

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-add-autoincrement</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>4

  Do not read any option files. If program startup fails due
  to reading unknown options from an option file,
  [`--no-defaults`](mysqlslap.html#option_mysqlslap_no-defaults) can be used
  to prevent them from being read.

  The exception is that the `.mylogin.cnf`
  file is read in all cases, if it exists. This permits
  passwords to be specified in a safer way than on the command
  line even when
  [`--no-defaults`](mysqlslap.html#option_mysqlslap_no-defaults) is used. To
  create `.mylogin.cnf`, use the
  [**mysql\_config\_editor**](mysql-config-editor.html "6.6.7 mysql_config_editor — MySQL Configuration Utility") utility. See
  [Section 6.6.7, “mysql\_config\_editor — MySQL Configuration Utility”](mysql-config-editor.html "6.6.7 mysql_config_editor — MySQL Configuration Utility").

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--number-char-cols=N`](mysqlslap.html#option_mysqlslap_number-char-cols),
  `-x N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-add-autoincrement</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>5

  The number of [`VARCHAR`](char.html "13.3.2 The CHAR and VARCHAR Types") columns
  to use if
  [`--auto-generate-sql`](mysqlslap.html#option_mysqlslap_auto-generate-sql) is
  specified.

* [`--number-int-cols=N`](mysqlslap.html#option_mysqlslap_number-int-cols),
  `-y N`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-add-autoincrement</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>6

  The number of [`INT`](integer-types.html "13.1.2 Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") columns to
  use if [`--auto-generate-sql`](mysqlslap.html#option_mysqlslap_auto-generate-sql)
  is specified.

* [`--number-of-queries=N`](mysqlslap.html#option_mysqlslap_number-of-queries)

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-add-autoincrement</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>7

  Limit each client to approximately this many queries. Query
  counting takes into account the statement delimiter. For
  example, if you invoke [**mysqlslap**](mysqlslap.html "6.5.8 mysqlslap — A Load Emulation Client") as
  follows, the `;` delimiter is recognized so
  that each instance of the query string counts as two
  queries. As a result, 5 rows (not 10) are inserted.

  ```
  mysqlslap --delimiter=";" --number-of-queries=10
            --query="use test;insert into t values(null)"
  ```

* [`--only-print`](mysqlslap.html#option_mysqlslap_only-print)

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-add-autoincrement</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>8

  Do not connect to databases. [**mysqlslap**](mysqlslap.html "6.5.8 mysqlslap — A Load Emulation Client")
  only prints what it would have done.

* [`--password[=password]`](mysqlslap.html#option_mysqlslap_password),
  `-p[password]`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-add-autoincrement"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-add-autoincrement</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>9

  The password of the MySQL account used for connecting to the
  server. The password value is optional. If not given,
  [**mysqlslap**](mysqlslap.html "6.5.8 mysqlslap — A Load Emulation Client") prompts for one. If given,
  there must be *no space* between
  [`--password=`](mysqlslap.html#option_mysqlslap_password) or
  `-p` and the password following it. If no
  password option is specified, the default is to send no
  password.

  Specifying a password on the command line should be
  considered insecure. To avoid giving the password on the
  command line, use an option file. See
  [Section 8.1.2.1, “End-User Guidelines for Password Security”](password-security-user.html "8.1.2.1 End-User Guidelines for Password Security").

  To explicitly specify that there is no password and that
  [**mysqlslap**](mysqlslap.html "6.5.8 mysqlslap — A Load Emulation Client") should not prompt for one, use
  the
  [`--skip-password`](mysqlslap.html#option_mysqlslap_password)
  option.

* [`--password1[=pass_val]`](mysqlslap.html#option_mysqlslap_password1)

  The password for multifactor authentication factor 1 of the
  MySQL account used for connecting to the server. The
  password value is optional. If not given,
  [**mysqlslap**](mysqlslap.html "6.5.8 mysqlslap — A Load Emulation Client") prompts for one. If given,
  there must be *no space* between
  [`--password1=`](mysqlslap.html#option_mysqlslap_password1) and the
  password following it. If no password option is specified,
  the default is to send no password.

  Specifying a password on the command line should be
  considered insecure. To avoid giving the password on the
  command line, use an option file. See
  [Section 8.1.2.1, “End-User Guidelines for Password Security”](password-security-user.html "8.1.2.1 End-User Guidelines for Password Security").

  To explicitly specify that there is no password and that
  [**mysqlslap**](mysqlslap.html "6.5.8 mysqlslap — A Load Emulation Client") should not prompt for one, use
  the
  [`--skip-password1`](mysqlslap.html#option_mysqlslap_password1)
  option.

  [`--password1`](mysqlslap.html#option_mysqlslap_password1) and
  [`--password`](mysqlslap.html#option_mysqlslap_password) are synonymous,
  as are
  [`--skip-password1`](mysqlslap.html#option_mysqlslap_password1)
  and
  [`--skip-password`](mysqlslap.html#option_mysqlslap_password).

* [`--password2[=pass_val]`](mysqlslap.html#option_mysqlslap_password2)

  The password for multifactor authentication factor 2 of the
  MySQL account used for connecting to the server. The
  semantics of this option are similar to the semantics for
  [`--password1`](mysqlslap.html#option_mysqlslap_password1); see the
  description of that option for details.

* [`--password3[=pass_val]`](mysqlslap.html#option_mysqlslap_password3)

  The password for multifactor authentication factor 3 of the
  MySQL account used for connecting to the server. The
  semantics of this option are similar to the semantics for
  [`--password1`](mysqlslap.html#option_mysqlslap_password1); see the
  description of that option for details.

* [`--pipe`](mysqlslap.html#option_mysqlslap_pipe),
  `-W`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-execute-number=#</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr></tbody></table>0

  On Windows, connect to the server using a named pipe. This
  option applies only if the server was started with the
  [`named_pipe`](server-system-variables.html#sysvar_named_pipe) system variable
  enabled to support named-pipe connections. In addition, the
  user making the connection must be a member of the Windows
  group specified by the
  [`named_pipe_full_access_group`](server-system-variables.html#sysvar_named_pipe_full_access_group)
  system variable.

* [`--plugin-dir=dir_name`](mysqlslap.html#option_mysqlslap_plugin-dir)

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-execute-number=#</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr></tbody></table>1

  The directory in which to look for plugins. Specify this
  option if the
  [`--default-auth`](mysqlslap.html#option_mysqlslap_default-auth) option is
  used to specify an authentication plugin but
  [**mysqlslap**](mysqlslap.html "6.5.8 mysqlslap — A Load Emulation Client") does not find it. See
  [Section 8.2.17, “Pluggable Authentication”](pluggable-authentication.html "8.2.17 Pluggable Authentication").

* [`--port=port_num`](mysqlslap.html#option_mysqlslap_port),
  `-P port_num`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-execute-number=#</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr></tbody></table>2

  For TCP/IP connections, the port number to use.

* [`--post-query=value`](mysqlslap.html#option_mysqlslap_post-query)

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-execute-number=#</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr></tbody></table>3

  The file or string containing the statement to execute after
  the tests have completed. This execution is not counted for
  timing purposes.

* [`--post-system=str`](mysqlslap.html#option_mysqlslap_post-system)

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-execute-number=#</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr></tbody></table>4

  The string to execute using `system()`
  after the tests have completed. This execution is not
  counted for timing purposes.

* [`--pre-query=value`](mysqlslap.html#option_mysqlslap_pre-query)

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-execute-number=#</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr></tbody></table>5

  The file or string containing the statement to execute
  before running the tests. This execution is not counted for
  timing purposes.

* [`--pre-system=str`](mysqlslap.html#option_mysqlslap_pre-system)

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-execute-number=#</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr></tbody></table>6

  The string to execute using `system()`
  before running the tests. This execution is not counted for
  timing purposes.

* [`--print-defaults`](mysqlslap.html#option_mysqlslap_print-defaults)

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-execute-number=#</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr></tbody></table>7

  Print the program name and all options that it gets from
  option files.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--protocol={TCP|SOCKET|PIPE|MEMORY}`](mysqlslap.html#option_mysqlslap_protocol)

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-execute-number=#</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr></tbody></table>8

  The transport protocol to use for connecting to the server.
  It is useful when the other connection parameters normally
  result in use of a protocol other than the one you want. For
  details on the permissible values, see
  [Section 6.2.7, “Connection Transport Protocols”](transport-protocols.html "6.2.7 Connection Transport Protocols").

* [`--query=value`](mysqlslap.html#option_mysqlslap_query),
  `-q value`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-execute-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-execute-number=#</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr></tbody></table>9

  The file or string containing the
  [`SELECT`](select.html "15.2.13 SELECT Statement") statement to use for
  retrieving data.

* [`--server-public-key-path=file_name`](mysqlslap.html#option_mysqlslap_server-public-key-path)

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-guid-primary</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>0

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
  [`--server-public-key-path=file_name`](mysqlslap.html#option_mysqlslap_server-public-key-path)
  is given and specifies a valid public key file, it takes
  precedence over
  [`--get-server-public-key`](mysqlslap.html#option_mysqlslap_get-server-public-key).

  For `sha256_password`, this option applies
  only if MySQL was built using OpenSSL.

  For information about the `sha256_password`
  and `caching_sha2_password` plugins, see
  [Section 8.4.1.3, “SHA-256 Pluggable Authentication”](sha256-pluggable-authentication.html "8.4.1.3 SHA-256 Pluggable Authentication"), and
  [Section 8.4.1.2, “Caching SHA-2 Pluggable Authentication”](caching-sha2-pluggable-authentication.html "8.4.1.2 Caching SHA-2 Pluggable Authentication").

* [`--shared-memory-base-name=name`](mysqlslap.html#option_mysqlslap_shared-memory-base-name)

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-guid-primary</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>1

  On Windows, the shared-memory name to use for connections
  made using shared memory to a local server. The default
  value is `MYSQL`. The shared-memory name is
  case-sensitive.

  This option applies only if the server was started with the
  [`shared_memory`](server-system-variables.html#sysvar_shared_memory) system
  variable enabled to support shared-memory connections.

* [`--silent`](mysqlslap.html#option_mysqlslap_silent),
  `-s`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-guid-primary</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>2

  Silent mode. No output.

* [`--socket=path`](mysqlslap.html#option_mysqlslap_socket),
  `-S path`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-guid-primary</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>3

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

* [`--sql-mode=mode`](mysqlslap.html#option_mysqlslap_sql-mode)

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-guid-primary</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>4

  Set the SQL mode for the client session.

* `--ssl*`

  Options that begin with `--ssl` specify
  whether to connect to the server using encryption and
  indicate where to find SSL keys and certificates. See
  [Command Options for Encrypted Connections](connection-options.html#encrypted-connection-options "Command Options for Encrypted Connections").

* [`--ssl-fips-mode={OFF|ON|STRICT}`](mysqlslap.html#option_mysqlslap_ssl-fips-mode)

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-guid-primary</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>5

  Controls whether to enable FIPS mode on the client side. The
  [`--ssl-fips-mode`](mysqlslap.html#option_mysqlslap_ssl-fips-mode) option
  differs from other
  `--ssl-xxx`
  options in that it is not used to establish encrypted
  connections, but rather to affect which cryptographic
  operations to permit. See [Section 8.8, “FIPS Support”](fips-mode.html "8.8 FIPS Support").

  These [`--ssl-fips-mode`](mysqlslap.html#option_mysqlslap_ssl-fips-mode)
  values are permitted:

  + `OFF`: Disable FIPS mode.
  + `ON`: Enable FIPS mode.
  + `STRICT`: Enable “strict”
    FIPS mode.

  Note

  If the OpenSSL FIPS Object Module is not available, the
  only permitted value for
  [`--ssl-fips-mode`](mysqlslap.html#option_mysqlslap_ssl-fips-mode) is
  `OFF`. In this case, setting
  [`--ssl-fips-mode`](mysqlslap.html#option_mysqlslap_ssl-fips-mode) to
  `ON` or `STRICT` causes
  the client to produce a warning at startup and to operate
  in non-FIPS mode.

  As of MySQL 8.0.34, this option is deprecated. Expect it to
  be removed in a future version of MySQL.

* [`--tls-ciphersuites=ciphersuite_list`](mysqlslap.html#option_mysqlslap_tls-ciphersuites)

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-guid-primary</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>6

  The permissible ciphersuites for encrypted connections that
  use TLSv1.3. The value is a list of one or more
  colon-separated ciphersuite names. The ciphersuites that can
  be named for this option depend on the SSL library used to
  compile MySQL. For details, see
  [Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”](encrypted-connection-protocols-ciphers.html "8.3.2 Encrypted Connection TLS Protocols and Ciphers").

  This option was added in MySQL 8.0.16.

* [`--tls-version=protocol_list`](mysqlslap.html#option_mysqlslap_tls-version)

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-guid-primary</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>7

  The permissible TLS protocols for encrypted connections. The
  value is a list of one or more comma-separated protocol
  names. The protocols that can be named for this option
  depend on the SSL library used to compile MySQL. For
  details, see
  [Section 8.3.2, “Encrypted Connection TLS Protocols and Ciphers”](encrypted-connection-protocols-ciphers.html "8.3.2 Encrypted Connection TLS Protocols and Ciphers").

* [`--user=user_name`](mysqlslap.html#option_mysqlslap_user),
  `-u user_name`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-guid-primary</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>8

  The user name of the MySQL account to use for connecting to
  the server.

* [`--verbose`](mysqlslap.html#option_mysqlslap_verbose),
  `-v`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-guid-primary"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-guid-primary</code></td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr></tbody></table>9

  Verbose mode. Print more information about what the program
  does. This option can be used multiple times to increase the
  amount of information.

* [`--version`](mysqlslap.html#option_mysqlslap_version),
  `-V`

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-load-type"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-load-type=type</code></td>
</tr><tr><th>Type</th>
<td>Enumeration</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">mixed</code></td>
</tr><tr><th>Valid Values</th>
<td><p class="valid-value"><code class="literal">read</code></p><p class="valid-value"><code class="literal">write</code></p><p class="valid-value"><code class="literal">key</code></p><p class="valid-value"><code class="literal">update</code></p><p class="valid-value"><code class="literal">mixed</code></p></td>
</tr></tbody></table>0

  Display version information and exit.

* [`--zstd-compression-level=level`](mysqlslap.html#option_mysqlslap_zstd-compression-level)

  <table frame="box" rules="all" summary="Properties for auto-generate-sql-load-type"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--auto-generate-sql-load-type=type</code></td>
</tr><tr><th>Type</th>
<td>Enumeration</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">mixed</code></td>
</tr><tr><th>Valid Values</th>
<td><p class="valid-value"><code class="literal">read</code></p><p class="valid-value"><code class="literal">write</code></p><p class="valid-value"><code class="literal">key</code></p><p class="valid-value"><code class="literal">update</code></p><p class="valid-value"><code class="literal">mixed</code></p></td>
</tr></tbody></table>1

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