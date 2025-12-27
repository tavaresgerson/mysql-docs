### 21.5.12 ndb\_drop\_table — Drop an NDB Table

[**ndb\_drop\_table**](mysql-cluster-programs-ndb-drop-table.html "21.5.12 ndb_drop_table — Drop an NDB Table") drops the specified [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") table. (If you try to use this on a table created with a storage engine other than [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6"), the attempt fails with the error 723: No such table exists.) This operation is extremely fast; in some cases, it can be an order of magnitude faster than using a MySQL [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement") statement on an [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") table.

#### Usage

```sql
ndb_drop_table -c connection_string tbl_name -d db_name
```

Options that can be used with [**ndb\_drop\_table**](mysql-cluster-programs-ndb-drop-table.html "21.5.12 ndb_drop_table — Drop an NDB Table") are shown in the following table. Additional descriptions follow the table.

**Table 21.31 Command-line options used with the program ndb\_drop\_table**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_character-sets-dir">--character-sets-dir=path</a> </code> </p></th> <td>Directory containing character sets</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_connect-retries">--connect-retries=#</a> </code> </p></th> <td>Number of times to retry connection before giving up</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_connect-retry-delay">--connect-retry-delay=#</a> </code> </p></th> <td>Number of seconds to wait between attempts to contact management server</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_connect-string">--connect-string=connection_string</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_connect-string">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_core-file">--core-file</a> </code> </p></th> <td>Write core file on error; used in debugging</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option">--database=name</code>, </p><p> <code class="option">-d name</code> </p></th> <td>Name of database in which table is found</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_defaults-extra-file">--defaults-extra-file=path</a> </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_defaults-file">--defaults-file=path</a> </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_defaults-group-suffix">--defaults-group-suffix=string</a> </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_help">--help</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_help">-?</a> </code> </p></th> <td>Display help text and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_login-path">--login-path=path</a> </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_ndb-connectstring">--ndb-connectstring=connection_string</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_ndb-mgmd-host">--ndb-mgmd-host=connection_string</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_ndb-nodeid">--ndb-nodeid=#</a> </code> </p></th> <td>Set node ID for this node, overriding any ID set by --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_ndb-optimized-node-selection">--ndb-optimized-node-selection</a> </code> </p></th> <td>Enable optimizations for selection of nodes for transactions. Enabled by default; use --skip-ndb-optimized-node-selection to disable</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_no-defaults">--no-defaults</a> </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_print-defaults">--print-defaults</a> </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_usage">--usage</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_usage">-?</a> </code> </p></th> <td>Display help text and exit; same as --help</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_version">--version</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_version">-V</a> </code> </p></th> <td>Display version information and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody></table>

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>

  Directory containing character sets.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">12</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">12</code></td> </tr></tbody></table>

  Number of times to retry connection before giving up.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">5</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">5</code></td> </tr></tbody></table>

  Number of seconds to wait between attempts to contact management server.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  Same as [`--ndb-connectstring`](mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_ndb-connectstring).

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--core-file</code></td> </tr></tbody></table>

  Write core file on error; used in debugging.

* `--database`, `-d`

  <table frame="box" rules="all" summary="Properties for database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--database=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">TEST_DB</code></td> </tr></tbody></table>

  Name of the database in which the table resides.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  Read given file after global files are read.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  Read default options from given file only.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  Also read groups with concat(group, suffix).

* `--help`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>0

  Display help text and exit.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>1

  Read given path from login file.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>2

  Set connect string for connecting to ndb\_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB\_CONNECTSTRING and my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>3

  Same as [`--ndb-connectstring`](mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_ndb-connectstring).

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>4

  Set node ID for this node, overriding any ID set by [`--ndb-connectstring`](mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_ndb-connectstring).

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>5

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>6

  Do not read default options from any option file other than login file.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>7

  Print program argument list and exit.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>8

  Display help text and exit; same as [`--help`](mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_help).

* `--version`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>9

  Display version information and exit.
