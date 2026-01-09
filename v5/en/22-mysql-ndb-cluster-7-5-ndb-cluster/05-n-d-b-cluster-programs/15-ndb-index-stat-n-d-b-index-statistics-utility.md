### 21.5.15 ndb\_index\_stat — NDB Index Statistics Utility

[**ndb\_index\_stat**](mysql-cluster-programs-ndb-index-stat.html "21.5.15 ndb_index_stat — NDB Index Statistics Utility") provides per-fragment statistical information about indexes on `NDB` tables. This includes cache version and age, number of index entries per partition, and memory consumption by indexes.

#### Usage

To obtain basic index statistics about a given [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") table, invoke [**ndb\_index\_stat**](mysql-cluster-programs-ndb-index-stat.html "21.5.15 ndb_index_stat — NDB Index Statistics Utility") as shown here, with the name of the table as the first argument and the name of the database containing this table specified immediately following it, using the [`--database`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_database) (`-d`) option:

```sql
ndb_index_stat table -d database
```

In this example, we use [**ndb\_index\_stat**](mysql-cluster-programs-ndb-index-stat.html "21.5.15 ndb_index_stat — NDB Index Statistics Utility") to obtain such information about an `NDB` table named `mytable` in the `test` database:

```sql
$> ndb_index_stat -d test mytable
table:City index:PRIMARY fragCount:2
sampleVersion:3 loadTime:1399585986 sampleCount:1994 keyBytes:7976
query cache: valid:1 sampleCount:1994 totalBytes:27916
times in ms: save: 7.133 sort: 1.974 sort per sample: 0.000

NDBT_ProgramExit: 0 - OK
```

`sampleVersion` is the version number of the cache from which the statistics data is taken. Running [**ndb\_index\_stat**](mysql-cluster-programs-ndb-index-stat.html "21.5.15 ndb_index_stat — NDB Index Statistics Utility") with the [`--update`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_update) option causes sampleVersion to be incremented.

`loadTime` shows when the cache was last updated. This is expressed as seconds since the Unix Epoch.

`sampleCount` is the number of index entries found per partition. You can estimate the total number of entries by multiplying this by the number of fragments (shown as `fragCount`).

`sampleCount` can be compared with the cardinality of [`SHOW INDEX`](show-index.html "13.7.5.22 SHOW INDEX Statement") or [`INFORMATION_SCHEMA.STATISTICS`](information-schema-statistics-table.html "24.3.24 The INFORMATION_SCHEMA STATISTICS Table"), although the latter two provide a view of the table as a whole, while [**ndb\_index\_stat**](mysql-cluster-programs-ndb-index-stat.html "21.5.15 ndb_index_stat — NDB Index Statistics Utility") provides a per-fragment average.

`keyBytes` is the number of bytes used by the index. In this example, the primary key is an integer, which requires four bytes for each index, so `keyBytes` can be calculated in this case as shown here:

```sql
    keyBytes = sampleCount * (4 bytes per index) = 1994 * 4 = 7976
```

This information can also be obtained using the corresponding column definitions from the Information Schema [`COLUMNS`](information-schema-columns-table.html "24.3.5 The INFORMATION_SCHEMA COLUMNS Table") table (this requires a MySQL Server and a MySQL client application).

`totalBytes` is the total memory consumed by all indexes on the table, in bytes.

Timings shown in the preceding examples are specific to each invocation of [**ndb\_index\_stat**](mysql-cluster-programs-ndb-index-stat.html "21.5.15 ndb_index_stat — NDB Index Statistics Utility").

The [`--verbose`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_verbose) option provides some additional output, as shown here:

```sql
$> ndb_index_stat -d test mytable --verbose
random seed 1337010518
connected
loop 1 of 1
table:mytable index:PRIMARY fragCount:4
sampleVersion:2 loadTime:1336751773 sampleCount:0 keyBytes:0
read stats
query cache created
query cache: valid:1 sampleCount:0 totalBytes:0
times in ms: save: 20.766 sort: 0.001
disconnected

NDBT_ProgramExit: 0 - OK

$>
```

If the only output from the program is `NDBT_ProgramExit: 0 - OK`, this may indicate that no statistics yet exist. To force them to be created (or updated if they already exist), invoke [**ndb\_index\_stat**](mysql-cluster-programs-ndb-index-stat.html "21.5.15 ndb_index_stat — NDB Index Statistics Utility") with the [`--update`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_update) option, or execute [`ANALYZE TABLE`](analyze-table.html "13.7.2.1 ANALYZE TABLE Statement") on the table in the [**mysql**](mysql.html "4.5.1 mysql — The MySQL Command-Line Client") client.

#### Options

The following table includes options that are specific to the NDB Cluster [**ndb\_index\_stat**](mysql-cluster-programs-ndb-index-stat.html "21.5.15 ndb_index_stat — NDB Index Statistics Utility") utility. Additional descriptions are listed following the table.

**Table 21.34 Command-line options used with the program ndb\_index\_stat**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_character-sets-dir">--character-sets-dir=path</a> </code> </p></th> <td>Directory containing character sets</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_connect-retries">--connect-retries=#</a> </code> </p></th> <td>Number of times to retry connection before giving up</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_connect-retry-delay">--connect-retry-delay=#</a> </code> </p></th> <td>Number of seconds to wait between attempts to contact management server</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_connect-string">--connect-string=connection_string</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_connect-string">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_core-file">--core-file</a> </code> </p></th> <td>Write core file on error; used in debugging</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_database">--database=name</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_database">-d name</a> </code> </p></th> <td>Name of database containing table</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_defaults-extra-file">--defaults-extra-file=path</a> </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_defaults-file">--defaults-file=path</a> </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_defaults-group-suffix">--defaults-group-suffix=string</a> </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_delete">--delete</a> </code> </p></th> <td>Delete index statistics for table, stopping any auto-update previously configured</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_dump">--dump</a> </code> </p></th> <td>Print query cache</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_help">--help</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_help">-?</a> </code> </p></th> <td>Display help text and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_login-path">--login-path=path</a> </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_loops">--loops=#</a> </code> </p></th> <td>Set the number of times to perform given command; default is 0</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_ndb-connectstring">--ndb-connectstring=connection_string</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_ndb-mgmd-host">--ndb-mgmd-host=connection_string</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_ndb-nodeid">--ndb-nodeid=#</a> </code> </p></th> <td>Set node ID for this node, overriding any ID set by --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_ndb-optimized-node-selection">--ndb-optimized-node-selection</a> </code> </p></th> <td>Enable optimizations for selection of nodes for transactions. Enabled by default; use --skip-ndb-optimized-node-selection to disable</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_no-defaults">--no-defaults</a> </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_print-defaults">--print-defaults</a> </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_query">--query=#</a> </code> </p></th> <td>Perform random range queries on first key attr (must be int unsigned)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_sys-drop">--sys-drop</a> </code> </p></th> <td>Drop any statistics tables and events in NDB kernel (all statistics are lost)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_sys-create">--sys-create</a> </code> </p></th> <td>Create all statistics tables and events in NDB kernel, if none of them already exist</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_sys-create-if-not-exist">--sys-create-if-not-exist</a> </code> </p></th> <td>Create any statistics tables and events in NDB kernel that do not already exist</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_sys-create-if-not-valid">--sys-create-if-not-valid</a> </code> </p></th> <td>Create any statistics tables or events that do not already exist in the NDB kernel, after dropping any that are invalid</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_sys-check">--sys-check</a> </code> </p></th> <td>Verify that NDB system index statistics and event tables exist</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_sys-skip-tables">--sys-skip-tables</a> </code> </p></th> <td>Do not apply sys-* options to tables</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_sys-skip-events">--sys-skip-events</a> </code> </p></th> <td>Do not apply sys-* options to events</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_update">--update</a> </code> </p></th> <td>Update index statistics for table, restarting any auto-update previously configured</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_usage">--usage</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_usage">-?</a> </code> </p></th> <td>Display help text and exit; same as --help</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_verbose">--verbose</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_verbose">-v</a> </code> </p></th> <td>Turn on verbose output</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_version">--version</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_version">-V</a> </code> </p></th> <td>Display version information and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody></table>

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Directory containing character sets.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

  Number of times to retry connection before giving up.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

  Number of seconds to wait between attempts to contact management server.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Same as [`--ndb-connectstring`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_ndb-connectstring).

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Write core file on error; used in debugging.

* `--database=name`, `-d name`

  <table frame="box" rules="all" summary="Properties for database"><tbody><tr><th>Command-Line Format</th> <td><code>--database=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr><tr><th>Minimum Value</th> <td><code></code></td> </tr><tr><th>Maximum Value</th> <td><code></code></td> </tr></tbody></table>

  The name of the database that contains the table being queried.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read given file after global files are read.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read default options from given file only.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Also read groups with concat(group, suffix).

* `--delete`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>0

  Delete the index statistics for the given table, stopping any auto-update that was previously configured.

* `--dump`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>1

  Dump the contents of the query cache.

* `--help`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>2

  Display help text and exit.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>3

  Read given path from login file.

* `--loops=#`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>4

  Repeat commands this number of times (for use in testing).

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>5

  Set connect string for connecting to ndb\_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB\_CONNECTSTRING and my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>6

  Same as [`--ndb-connectstring`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_ndb-connectstring).

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>7

  Set node ID for this node, overriding any ID set by [`--ndb-connectstring`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_ndb-connectstring).

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>8

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>9

  Do not read default options from any option file other than login file.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>0

  Print program argument list and exit.

* `--query=#`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>1

  Perform random range queries on first key attribute (must be int unsigned).

* `--sys-drop`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>2

  Drop all statistics tables and events in the NDB kernel. *This causes all statistics to be lost*.

* `--sys-create`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>3

  Create all statistics tables and events in the NDB kernel. This works only if none of them exist previously.

* `--sys-create-if-not-exist`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>4

  Create any NDB system statistics tables or events (or both) that do not already exist when the program is invoked.

* `--sys-create-if-not-valid`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>5

  Create any NDB system statistics tables or events that do not already exist, after dropping any that are invalid.

* `--sys-check`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>6

  Verify that all required system statistics tables and events exist in the NDB kernel.

* `--sys-skip-tables`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>7

  Do not apply any `--sys-*` options to any statistics tables.

* `--sys-skip-events`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>8

  Do not apply any `--sys-*` options to any events.

* `--update`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>9

  Update the index statistics for the given table, and restart any auto-update that was previously configured.

* `--usage`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>0

  Display help text and exit; same as [`--help`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_help).

* `--verbose`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>1

  Turn on verbose output.

* `--version`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>2

  Display version information and exit.

**ndb\_index\_stat system options.** The following options are used to generate and update the statistics tables in the NDB kernel. None of these options can be mixed with statistics options (see [ndb\_index\_stat statistics options](mysql-cluster-programs-ndb-index-stat.html#ndb-index-stat-options-statistics "ndb_index_stat statistics options")).

* [`--sys-drop`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_sys-drop)
* [`--sys-create`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_sys-create)
* [`--sys-create-if-not-exist`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_sys-create-if-not-exist)
* [`--sys-create-if-not-valid`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_sys-create-if-not-valid)
* [`--sys-check`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_sys-check)
* [`--sys-skip-tables`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_sys-skip-tables)
* [`--sys-skip-events`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_sys-skip-events)

**ndb\_index\_stat statistics options.** The options listed here are used to generate index statistics. They work with a given table and database. They cannot be mixed with system options (see [ndb\_index\_stat system options](mysql-cluster-programs-ndb-index-stat.html#ndb-index-stat-options-system "ndb_index_stat system options")).

* [`--database`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_database)
* [`--delete`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_delete)
* [`--update`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_update)
* [`--dump`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_dump)
* [`--query`](mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_query)
