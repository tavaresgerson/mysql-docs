### 21.5.26 ndb\_select\_count — Print Row Counts for NDB Tables

[**ndb\_select\_count**](mysql-cluster-programs-ndb-select-count.html "21.5.26 ndb_select_count — Print Row Counts for NDB Tables") prints the number of rows in
one or more [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables. With a
single table, the result is equivalent to that obtained by using
the MySQL statement `SELECT COUNT(*) FROM
tbl_name`.

#### Usage

```sql
ndb_select_count [-c connection_string] -ddb_name tbl_name[, tbl_name2[, ...]]
```

Options that can be used with
[**ndb\_select\_count**](mysql-cluster-programs-ndb-select-count.html "21.5.26 ndb_select_count — Print Row Counts for NDB Tables") are shown in the following
table. Additional descriptions follow the table.

**Table 21.42 Command-line options used with the program ndb\_select\_count**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr>
<th>Format</th>
<th>Description</th>
<th>Added, Deprecated, or Removed</th>
</tr></thead><tbody><tr>
<th><p>
<code class="option">
--character-sets-dir=path
</code>
</p></th>
<td>Directory containing character sets</td>
<td><p>
                (Supported in all NDB releases based on MySQL 5.7)
              </p></td>
</tr></tbody><tbody><tr>
<th><p>
<code class="option">
--connect-retries=#
</code>
</p></th>
<td>Number of times to retry connection before giving up</td>
<td><p>
                (Supported in all NDB releases based on MySQL 5.7)
              </p></td>
</tr></tbody><tbody><tr>
<th><p>
<code class="option">
--connect-retry-delay=#
</code>
</p></th>
<td>Number of seconds to wait between attempts to contact management server</td>
<td><p>
                (Supported in all NDB releases based on MySQL 5.7)
              </p></td>
</tr></tbody><tbody><tr>
<th><p>
<code>--connect-string=connection_string</code>,
              </p><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-select-count.html#option_ndb_select_count_connect-string">-c
                connection_string</a> </code>
</p></th>
<td>Same as --ndb-connectstring</td>
<td><p>
                (Supported in all NDB releases based on MySQL 5.7)
              </p></td>
</tr></tbody><tbody><tr>
<th><p>
<code class="option">
--core-file
</code>
</p></th>
<td>Write core file on error; used in debugging</td>
<td><p>
                (Supported in all NDB releases based on MySQL 5.7)
              </p></td>
</tr></tbody><tbody><tr>
<th><p>
<code>--database=name</code>,
              </p><p>
<code>-d name</code>
</p></th>
<td>Name of database in which table is found</td>
<td><p>
                (Supported in all NDB releases based on MySQL 5.7)
              </p></td>
</tr></tbody><tbody><tr>
<th><p>
<code class="option">
--defaults-extra-file=path
</code>
</p></th>
<td>Read given file after global files are read</td>
<td><p>
                (Supported in all NDB releases based on MySQL 5.7)
              </p></td>
</tr></tbody><tbody><tr>
<th><p>
<code class="option">
--defaults-file=path
</code>
</p></th>
<td>Read default options from given file only</td>
<td><p>
                (Supported in all NDB releases based on MySQL 5.7)
              </p></td>
</tr></tbody><tbody><tr>
<th><p>
<code class="option">
--defaults-group-suffix=string
</code>
</p></th>
<td>Also read groups with concat(group, suffix)</td>
<td><p>
                (Supported in all NDB releases based on MySQL 5.7)
              </p></td>
</tr></tbody><tbody><tr>
<th><p>
<code>--help</code>,
              </p><p>
<code class="option">
-?
</code>
</p></th>
<td>Display help text and exit</td>
<td><p>
                (Supported in all NDB releases based on MySQL 5.7)
              </p></td>
</tr></tbody><tbody><tr>
<th><p>
<code>--lock=#</code>,
              </p><p>
<code>-l #</code>
</p></th>
<td>Lock type</td>
<td><p>
                (Supported in all NDB releases based on MySQL 5.7)
              </p></td>
</tr></tbody><tbody><tr>
<th><p>
<code class="option">
--login-path=path
</code>
</p></th>
<td>Read given path from login file</td>
<td><p>
                (Supported in all NDB releases based on MySQL 5.7)
              </p></td>
</tr></tbody><tbody><tr>
<th><p>
<code>--ndb-connectstring=connection_string</code>,
              </p><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-select-count.html#option_ndb_select_count_ndb-connectstring">-c
                connection_string</a> </code>
</p></th>
<td>Set connect string for connecting to ndb_mgmd. Syntax:
              "[nodeid=id;][host=]hostname[:port]". Overrides entries in
              NDB_CONNECTSTRING and my.cnf</td>
<td><p>
                (Supported in all NDB releases based on MySQL 5.7)
              </p></td>
</tr></tbody><tbody><tr>
<th><p>
<code>--ndb-mgmd-host=connection_string</code>,
              </p><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-select-count.html#option_ndb_select_count_ndb-mgmd-host">-c
                connection_string</a> </code>
</p></th>
<td>Same as --ndb-connectstring</td>
<td><p>
                (Supported in all NDB releases based on MySQL 5.7)
              </p></td>
</tr></tbody><tbody><tr>
<th><p>
<code class="option">
--ndb-nodeid=#
</code>
</p></th>
<td>Set node ID for this node, overriding any ID set by --ndb-connectstring</td>
<td><p>
                (Supported in all NDB releases based on MySQL 5.7)
              </p></td>
</tr></tbody><tbody><tr>
<th><p>
<code class="option">
--ndb-optimized-node-selection
</code>
</p></th>
<td>Enable optimizations for selection of nodes for transactions. Enabled by
              default; use --skip-ndb-optimized-node-selection to
              disable</td>
<td><p>
                (Supported in all NDB releases based on MySQL 5.7)
              </p></td>
</tr></tbody><tbody><tr>
<th><p>
<code class="option">
--no-defaults
</code>
</p></th>
<td>Do not read default options from any option file other than login file</td>
<td><p>
                (Supported in all NDB releases based on MySQL 5.7)
              </p></td>
</tr></tbody><tbody><tr>
<th><p>
<code>--parallelism=#</code>,
              </p><p>
<code>-p #</code>
</p></th>
<td>Degree of parallelism</td>
<td><p>
                (Supported in all NDB releases based on MySQL 5.7)
              </p></td>
</tr></tbody><tbody><tr>
<th><p>
<code class="option">
--print-defaults
</code>
</p></th>
<td>Print program argument list and exit</td>
<td><p>
                (Supported in all NDB releases based on MySQL 5.7)
              </p></td>
</tr></tbody><tbody><tr>
<th><p>
<code>--usage</code>,
              </p><p>
<code class="option">
-?
</code>
</p></th>
<td>Display help text and exit; same as --help</td>
<td><p>
                (Supported in all NDB releases based on MySQL 5.7)
              </p></td>
</tr></tbody><tbody><tr>
<th><p>
<code>--version</code>,
              </p><p>
<code class="option">
-V
</code>
</p></th>
<td>Display version information and exit</td>
<td><p>
                (Supported in all NDB releases based on MySQL 5.7)
              </p></td>
</tr></tbody></table>

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--character-sets-dir=path</code></td>
</tr></tbody></table>

  Directory containing character sets.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--connect-retries=#</code></td>
</tr><tr><th>Type</th>
<td>Integer</td>
</tr><tr><th>Default Value</th>
<td><code>12</code></td>
</tr><tr><th>Minimum Value</th>
<td><code>0</code></td>
</tr><tr><th>Maximum Value</th>
<td><code>12</code></td>
</tr></tbody></table>

  Number of times to retry connection before giving up.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--connect-retry-delay=#</code></td>
</tr><tr><th>Type</th>
<td>Integer</td>
</tr><tr><th>Default Value</th>
<td><code>5</code></td>
</tr><tr><th>Minimum Value</th>
<td><code>0</code></td>
</tr><tr><th>Maximum Value</th>
<td><code>5</code></td>
</tr></tbody></table>

  Number of seconds to wait between attempts to contact
  management server.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--connect-string=connection_string</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code>[none]</code></td>
</tr></tbody></table>

  Same as
  [`--ndb-connectstring`](mysql-cluster-programs-ndb-select-count.html#option_ndb_select_count_ndb-connectstring).

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--core-file</code></td>
</tr></tbody></table>

  Write core file on error; used in debugging.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--defaults-file=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code>[none]</code></td>
</tr></tbody></table>

  Read default options from given file only.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--defaults-extra-file=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code>[none]</code></td>
</tr></tbody></table>

  Read given file after global files are read.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--defaults-group-suffix=string</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code>[none]</code></td>
</tr></tbody></table>

  Also read groups with concat(group, suffix).

* `--login-path`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--login-path=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code>[none]</code></td>
</tr></tbody></table>

  Read given path from login file.

* `--help`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--character-sets-dir=path</code></td>
</tr></tbody></table>0

  Display help text and exit.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--character-sets-dir=path</code></td>
</tr></tbody></table>1

  Set connect string for connecting to ndb\_mgmd. Syntax:
  "[nodeid=id;][host=]hostname[:port]". Overrides entries in
  NDB\_CONNECTSTRING and my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--character-sets-dir=path</code></td>
</tr></tbody></table>2

  Same as
  [`--ndb-connectstring`](mysql-cluster-programs-ndb-select-count.html#option_ndb_select_count_ndb-connectstring).

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--character-sets-dir=path</code></td>
</tr></tbody></table>3

  Enable optimizations for selection of nodes for
  transactions. Enabled by default; use
  `--skip-ndb-optimized-node-selection` to
  disable.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--character-sets-dir=path</code></td>
</tr></tbody></table>4

  Set node ID for this node, overriding any ID set by
  [`--ndb-connectstring`](mysql-cluster-programs-ndb-select-count.html#option_ndb_select_count_ndb-connectstring).

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--character-sets-dir=path</code></td>
</tr></tbody></table>5

  Do not read default options from any option file other than
  login file.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--character-sets-dir=path</code></td>
</tr></tbody></table>6

  Print program argument list and exit.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--character-sets-dir=path</code></td>
</tr></tbody></table>7

  Display help text and exit; same as
  [`--help`](mysql-cluster-programs-ndb-select-count.html#option_ndb_select_count_help).

* `--version`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--character-sets-dir=path</code></td>
</tr></tbody></table>8

  Display version information and exit.

You can obtain row counts from multiple tables in the same
database by listing the table names separated by spaces when
invoking this command, as shown under
**Sample Output**.

#### Sample Output

```sql
$> ./ndb_select_count -c localhost -d ctest1 fish dogs
6 records in table fish
4 records in table dogs

NDBT_ProgramExit: 0 - OK
```