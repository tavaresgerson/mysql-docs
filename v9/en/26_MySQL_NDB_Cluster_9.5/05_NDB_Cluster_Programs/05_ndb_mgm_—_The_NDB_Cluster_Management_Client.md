### 25.5.5 ndb\_mgm — The NDB Cluster Management Client

The [**ndb\_mgm**](mysql-cluster-programs-ndb-mgm.html "25.5.5 ndb_mgm — The NDB Cluster Management Client") management client process is
actually not needed to run the cluster. Its value lies in
providing a set of commands for checking the cluster's status,
starting backups, and performing other administrative functions.
The management client accesses the management server using a C
API. Advanced users can also employ this API for programming
dedicated management processes to perform tasks similar to those
performed by [**ndb\_mgm**](mysql-cluster-programs-ndb-mgm.html "25.5.5 ndb_mgm — The NDB Cluster Management Client").

To start the management client, it is necessary to supply the
host name and port number of the management server:

```
$> ndb_mgm [host_name [port_num]]
```

For example:

```
$> ndb_mgm ndb_mgmd.mysql.com 1186
```

The default host name and port number are
`localhost` and 1186, respectively.

All options that can be used with [**ndb\_mgm**](mysql-cluster-programs-ndb-mgm.html "25.5.5 ndb_mgm — The NDB Cluster Management Client") are
shown in the following table. Additional descriptions follow the
table.

* [`--backup-password-from-stdin[=TRUE|FALSE]`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_backup-password-from-stdin)

  <table frame="box" rules="all" summary="Properties for backup-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--backup-password-from-stdin</code></td>
</tr></tbody></table>

  This option enables input of the backup password from the
  system shell (`stdin`) when using
  `--execute "START BACKUP"` or similar to
  create a backup. Use of this option requires use of
  [`--execute`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_execute) as well.

* [`--character-sets-dir`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_character-sets-dir)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>

  Directory containing character sets.

* [`--connect-retries=#`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_connect-retries)

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-retries=#</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">3</code></td>
</tr><tr><th>Minimum Value</th>
<td><code class="literal">0</code></td>
</tr><tr><th>Maximum Value</th>
<td><code class="literal">4294967295</code></td>
</tr></tbody></table>

  This option specifies the number of times following the
  first attempt to retry a connection before giving up (the
  client always tries the connection at least once). The
  length of time to wait per attempt is set using
  [`--connect-retry-delay`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_connect-retry-delay).

  This option is synonymous with the
  [`--try-reconnect`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_try-reconnect) option,
  which is now deprecated.

* [`--connect-retry-delay`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_connect-retry-delay)

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-retry-delay=#</code></td>
</tr><tr><th>Type</th>
<td>Integer</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">5</code></td>
</tr><tr><th>Minimum Value</th>
<td><code class="literal">0</code></td>
</tr><tr><th>Maximum Value</th>
<td><code class="literal">5</code></td>
</tr></tbody></table>

  Number of seconds to wait between attempts to contact
  management server.

* [`--connect-string`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_connect-string)

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-string=connection_string</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  Same as [`--ndb-connectstring`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_ndb-connectstring).

* [`--core-file`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_core-file)

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--core-file</code></td>
</tr></tbody></table>

  Write core file on error; used in debugging.

* [`--defaults-extra-file`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_defaults-extra-file)

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--defaults-extra-file=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  Read given file after global files are read.

* [`--defaults-file`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_defaults-file)

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--defaults-file=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  Read default options from given file only.

* [`--defaults-group-suffix`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_defaults-group-suffix)

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--defaults-group-suffix=string</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  Also read groups with concat(group, suffix).

* [`--encrypt-backup`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_encrypt-backup)

  <table frame="box" rules="all" summary="Properties for encrypt-backup"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--encrypt-backup</code></td>
</tr></tbody></table>

  When used, this option causes all backups to be encrypted.
  To make this happen whenever [**ndb\_mgm**](mysql-cluster-programs-ndb-mgm.html "25.5.5 ndb_mgm — The NDB Cluster Management Client") is
  run, put the option in the `[ndb_mgm]`
  section of the `my.cnf` file.

* [`--execute=command`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_execute),
  `-e command`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>0

  This option can be used to send a command to the NDB Cluster
  management client from the system shell. For example, either
  of the following is equivalent to executing
  [`SHOW`](mysql-cluster-mgm-client-commands.html#ndbclient-show) in the management
  client:

  ```
  $> ndb_mgm -e "SHOW"

  $> ndb_mgm --execute="SHOW"
  ```

  This is analogous to how the
  [`--execute`](mysql-command-options.html#option_mysql_execute) or
  `-e` option works with the
  [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") command-line client. See
  [Section 6.2.2.1, “Using Options on the Command Line”](command-line-options.html "6.2.2.1 Using Options on the Command Line").

  Note

  If the management client command to be passed using this
  option contains any space characters, then the command
  *must* be enclosed in quotation marks.
  Either single or double quotation marks may be used. If
  the management client command contains no space
  characters, the quotation marks are optional.

* [`--help`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_help)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>1

  Display help text and exit.

* [`--login-path`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_login-path)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>2

  Read given path from login file.

* [`--no-login-paths`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_no-login-paths)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>3

  Skips reading options from the login path file.

* [`--ndb-connectstring`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_ndb-connectstring)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>4

  Set connect string for connecting to
  [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "25.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon"). Syntax:
  [`nodeid=id;`][`host=`]`hostname`[`:port`].
  Overrides entries in `NDB_CONNECTSTRING`
  and `my.cnf`.

* [`--ndb-nodeid`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_ndb-nodeid)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>5

  Set node ID for this node, overriding any ID set by
  [`--ndb-connectstring`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_ndb-connectstring).

* [`--ndb-mgm-tls`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_ndb-mgm-tls)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>6

  Sets the level of TLS support required to connect to the
  management server; one of `relaxed` or
  `strict`. `relaxed` (the
  default) means that a TLS connection is attempted, but
  success is not required; `strict` means
  that TLS is required to connect.

* [`--ndb-mgmd-host`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_ndb-mgmd-host)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>7

  Same as [`--ndb-connectstring`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_ndb-connectstring).

* [`--ndb-optimized-node-selection`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_ndb-optimized-node-selection)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>8

  Enable optimizations for selection of nodes for
  transactions. Enabled by default; use
  `--skip-ndb-optimized-node-selection` to
  disable.

* [`--ndb-tls-search-path`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_ndb-tls-search-path)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>9

  Specify a list of directories to search for a CA file. On
  Unix platforms, the directory names are separated by colons
  (`:`); on Windows systems, the semicolon
  character (`;`) is used as the separator. A
  directory reference may be relative or absolute; it may
  contain one or more environment variables, each denoted by a
  prefixed dollar sign (`$`), and expanded
  prior to use.

  Searching begins with the leftmost named directory and
  proceeds from left to right until a file is found. An empty
  string denotes an empty search path, which causes all
  searches to fail. A string consisting of a single dot
  (`.`) indicates that the search path
  limited to the current working directory.

  If no search path is supplied, the compiled-in default value
  is used. This value depends on the platform used: On
  Windows, this is `\ndb-tls`; on other
  platforms (including Linux), it is
  `$HOME/ndb-tls`. This can be overridden by
  compiling NDB Cluster using
  [`-DWITH_NDB_TLS_SEARCH_PATH`](source-configuration-options.html#option_cmake_with_ndb_tls_search_path).

* [`--no-defaults`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_no-defaults)

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-retries=#</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">3</code></td>
</tr><tr><th>Minimum Value</th>
<td><code class="literal">0</code></td>
</tr><tr><th>Maximum Value</th>
<td><code class="literal">4294967295</code></td>
</tr></tbody></table>0

  Do not read default options from any option file other than
  login file.

* [`--print-defaults`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_print-defaults)

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-retries=#</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">3</code></td>
</tr><tr><th>Minimum Value</th>
<td><code class="literal">0</code></td>
</tr><tr><th>Maximum Value</th>
<td><code class="literal">4294967295</code></td>
</tr></tbody></table>1

  Print program argument list and exit.

* [`--test-tls`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_test-tls)

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-retries=#</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">3</code></td>
</tr><tr><th>Minimum Value</th>
<td><code class="literal">0</code></td>
</tr><tr><th>Maximum Value</th>
<td><code class="literal">4294967295</code></td>
</tr></tbody></table>2

  Connect using TLS, then exit. Output if successful is
  similar to what is shown here:

  ```
  >$ ndb_mgm --test-tls
  Connected to Management Server at: sakila:1186
  >$
  ```

  See [Section 25.6.19.5, “TLS Link Encryption for NDB Cluster”](mysql-cluster-tls.html "25.6.19.5 TLS Link Encryption for NDB Cluster"), for more
  information.

* [`--try-reconnect=number`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_try-reconnect)

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-retries=#</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">3</code></td>
</tr><tr><th>Minimum Value</th>
<td><code class="literal">0</code></td>
</tr><tr><th>Maximum Value</th>
<td><code class="literal">4294967295</code></td>
</tr></tbody></table>3

  If the connection to the management server is broken, the
  node tries to reconnect to it every 5 seconds until it
  succeeds. By using this option, it is possible to limit the
  number of attempts to *`number`*
  before giving up and reporting an error instead.

  This option is deprecated and subject to removal in a future
  release. Use
  [`--connect-retries`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_connect-retries), instead.

* [`--usage`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_usage)

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-retries=#</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">3</code></td>
</tr><tr><th>Minimum Value</th>
<td><code class="literal">0</code></td>
</tr><tr><th>Maximum Value</th>
<td><code class="literal">4294967295</code></td>
</tr></tbody></table>4

  Display help text and exit; same as
  [`--help`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_help).

* [`--version`](mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_version)

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-retries=#</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">3</code></td>
</tr><tr><th>Minimum Value</th>
<td><code class="literal">0</code></td>
</tr><tr><th>Maximum Value</th>
<td><code class="literal">4294967295</code></td>
</tr></tbody></table>5

  Display version information and exit.

Additional information about using [**ndb\_mgm**](mysql-cluster-programs-ndb-mgm.html "25.5.5 ndb_mgm — The NDB Cluster Management Client")
can be found in
[Section 25.6.1, “Commands in the NDB Cluster Management Client”](mysql-cluster-mgm-client-commands.html "25.6.1 Commands in the NDB Cluster Management Client").