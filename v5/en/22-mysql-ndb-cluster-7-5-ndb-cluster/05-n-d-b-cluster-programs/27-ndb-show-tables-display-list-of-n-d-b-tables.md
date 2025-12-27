### 21.5.27 ndb\_show\_tables — Display List of NDB Tables

[**ndb\_show\_tables**](mysql-cluster-programs-ndb-show-tables.html "21.5.27 ndb_show_tables — Display List of NDB Tables") displays a list of all [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") database objects in the cluster. By default, this includes not only both user-created tables and [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") system tables, but [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6")-specific indexes, internal triggers, and NDB Cluster Disk Data objects as well.

Options that can be used with [**ndb\_show\_tables**](mysql-cluster-programs-ndb-show-tables.html "21.5.27 ndb_show_tables — Display List of NDB Tables") are shown in the following table. Additional descriptions follow the table.

**Table 21.43 Command-line options used with the program ndb\_show\_tables**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_character-sets-dir">--character-sets-dir=path</a> </code> </p></th> <td>Directory containing character sets</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_connect-retries">--connect-retries=#</a> </code> </p></th> <td>Number of times to retry connection before giving up</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_connect-retry-delay">--connect-retry-delay=#</a> </code> </p></th> <td>Number of seconds to wait between attempts to contact management server</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_connect-string">--connect-string=connection_string</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_connect-string">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_core-file">--core-file</a> </code> </p></th> <td>Write core file on error; used in debugging</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_database">--database=name</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_database">-d name</a> </code> </p></th> <td>Specifies database in which table is found; database name must be followed by table name</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_defaults-extra-file">--defaults-extra-file=path</a> </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_defaults-file">--defaults-file=path</a> </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_defaults-group-suffix">--defaults-group-suffix=string</a> </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_login-path">--login-path=path</a> </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_loops">--loops=#</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_loops">-l
                #</a> </code> </p></th> <td>Number of times to repeat output</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_help">--help</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_help">-?</a> </code> </p></th> <td>Display help text and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_ndb-connectstring">--ndb-connectstring=connection_string</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_ndb-mgmd-host">--ndb-mgmd-host=connection_string</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_ndb-nodeid">--ndb-nodeid=#</a> </code> </p></th> <td>Set node ID for this node, overriding any ID set by --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_ndb-optimized-node-selection">--ndb-optimized-node-selection</a> </code> </p></th> <td>Enable optimizations for selection of nodes for transactions. Enabled by default; use --skip-ndb-optimized-node-selection to disable</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_no-defaults">--no-defaults</a> </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_parsable">--parsable</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_parsable">-p</a> </code> </p></th> <td>Return output suitable for MySQL LOAD DATA statement</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_print-defaults">--print-defaults</a> </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_show-temp-status">--show-temp-status</a> </code> </p></th> <td>Show table temporary flag</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_type">--type=#</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_type">-t
                #</a> </code> </p></th> <td>Limit output to objects of this type</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_unqualified">--unqualified</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_unqualified">-u</a> </code> </p></th> <td>Do not qualify table names</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_usage">--usage</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_usage">-?</a> </code> </p></th> <td>Display help text and exit; same as --help</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_version">--version</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_version">-V</a> </code> </p></th> <td>Display version information and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody></table>

#### Usage

```sql
ndb_show_tables [-c connection_string]
```

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

  Same as [`--ndb-connectstring`](mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_ndb-connectstring).

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--core-file</code></td> </tr></tbody></table>

  Write core file on error; used in debugging.

* `--database`, `-d`

  Specifies the name of the database in which the desired table is found. If this option is given, the name of a table must follow the database name.

  If this option has not been specified, and no tables are found in the `TEST_DB` database, [**ndb\_show\_tables**](mysql-cluster-programs-ndb-show-tables.html "21.5.27 ndb_show_tables — Display List of NDB Tables") issues a warning.

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

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>

  Display help text and exit.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>0

  Read given path from login file.

* `--loops`, `-l`

  Specifies the number of times the utility should execute. This is 1 when this option is not specified, but if you do use the option, you must supply an integer argument for it.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>1

  Set connect string for connecting to ndb\_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB\_CONNECTSTRING and my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>2

  Same as [`--ndb-connectstring`](mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_ndb-connectstring).

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>3

  Set node ID for this node, overriding any ID set by [`--ndb-connectstring`](mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_ndb-connectstring).

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>4

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>5

  Do not read default options from any option file other than login file.

* `--parsable`, `-p`

  Using this option causes the output to be in a format suitable for use with [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement").

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>6

  Print program argument list and exit.

* `--show-temp-status`

  If specified, this causes temporary tables to be displayed.

* `--type`, `-t`

  Can be used to restrict the output to one type of object, specified by an integer type code as shown here:

  + `1`: System table
  + `2`: User-created table
  + `3`: Unique hash index

  Any other value causes all [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") database objects to be listed (the default).

* `--unqualified`, `-u`

  If specified, this causes unqualified object names to be displayed.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>7

  Display help text and exit; same as [`--help`](mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_help).

* `--version`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>8

  Display version information and exit.

Note

Only user-created NDB Cluster tables may be accessed from MySQL; system tables such as `SYSTAB_0` are not visible to [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server"). However, you can examine the contents of system tables using [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") API applications such as [**ndb\_select\_all**](mysql-cluster-programs-ndb-select-all.html "21.5.25 ndb_select_all — Print Rows from an NDB Table") (see [Section 21.5.25, “ndb\_select\_all — Print Rows from an NDB Table”](mysql-cluster-programs-ndb-select-all.html "21.5.25 ndb_select_all — Print Rows from an NDB Table")).

Prior to NDB 7.5.18 and 7.6.14, this program printed `NDBT_ProgramExit - status` upon completion of its run, due to an unnecessary dependency on the `NDBT` testing library. This dependency is has now been removed, eliminating the extraneous output.
