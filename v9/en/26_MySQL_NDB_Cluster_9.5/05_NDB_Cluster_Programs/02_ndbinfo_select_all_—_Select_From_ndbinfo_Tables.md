### 25.5.2 ndbinfo\_select\_all — Select From ndbinfo Tables

[**ndbinfo\_select\_all**](mysql-cluster-programs-ndbinfo-select-all.html "25.5.2 ndbinfo_select_all — Select From ndbinfo Tables") is a client program that
selects all rows and columns from one or more tables in the
[`ndbinfo`](mysql-cluster-ndbinfo.html "25.6.15 ndbinfo: The NDB Cluster Information Database") database

Not all `ndbinfo` tables available in the
[**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client") client can be read by this program (see
later in this section). In addition,
[**ndbinfo\_select\_all**](mysql-cluster-programs-ndbinfo-select-all.html "25.5.2 ndbinfo_select_all — Select From ndbinfo Tables") can show information about
some tables internal to `ndbinfo` which cannot
be accessed using SQL, including the `tables`
and `columns` metadata tables.

To select from one or more `ndbinfo` tables
using [**ndbinfo\_select\_all**](mysql-cluster-programs-ndbinfo-select-all.html "25.5.2 ndbinfo_select_all — Select From ndbinfo Tables"), it is necessary to
supply the names of the tables when invoking the program as
shown here:

```
$> ndbinfo_select_all table_name1  [table_name2] [...]
```

For example:

```
$> ndbinfo_select_all logbuffers logspaces
== logbuffers ==
node_id log_type        log_id  log_part        total   used    high
5       0       0       0       33554432        262144  0
6       0       0       0       33554432        262144  0
7       0       0       0       33554432        262144  0
8       0       0       0       33554432        262144  0
== logspaces ==
node_id log_type        log_id  log_part        total   used    high
5       0       0       0       268435456       0       0
5       0       0       1       268435456       0       0
5       0       0       2       268435456       0       0
5       0       0       3       268435456       0       0
6       0       0       0       268435456       0       0
6       0       0       1       268435456       0       0
6       0       0       2       268435456       0       0
6       0       0       3       268435456       0       0
7       0       0       0       268435456       0       0
7       0       0       1       268435456       0       0
7       0       0       2       268435456       0       0
7       0       0       3       268435456       0       0
8       0       0       0       268435456       0       0
8       0       0       1       268435456       0       0
8       0       0       2       268435456       0       0
8       0       0       3       268435456       0       0
$>
```

Options that can be used with
[**ndbinfo\_select\_all**](mysql-cluster-programs-ndbinfo-select-all.html "25.5.2 ndbinfo_select_all — Select From ndbinfo Tables") are shown in the following
table. Additional descriptions follow the table.

* [`--character-sets-dir`](mysql-cluster-programs-ndbinfo-select-all.html#option_ndbinfo_select_all_character-sets-dir)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>

  Directory containing character sets.

* [`--core-file`](mysql-cluster-programs-ndbinfo-select-all.html#option_ndbinfo_select_all_core-file)

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--core-file</code></td>
</tr></tbody></table>

  Write core file on error; used in debugging.

* [`--connect-retries`](mysql-cluster-programs-ndbinfo-select-all.html#option_ndbinfo_select_all_connect-retries)

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-retries=#</code></td>
</tr><tr><th>Type</th>
<td>Integer</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">12</code></td>
</tr><tr><th>Minimum Value</th>
<td><code class="literal">0</code></td>
</tr><tr><th>Maximum Value</th>
<td><code class="literal">12</code></td>
</tr></tbody></table>

  Number of times to retry connection before giving up.

* [`--connect-retry-delay`](mysql-cluster-programs-ndbinfo-select-all.html#option_ndbinfo_select_all_connect-retry-delay)

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

* [`--connect-string`](mysql-cluster-programs-ndbinfo-select-all.html#option_ndbinfo_select_all_connect-string)

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-string=connection-string</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  Same as
  [`--ndb-connectstring`](mysql-cluster-programs-ndbinfo-select-all.html#option_ndbinfo_select_all_ndb-connectstring).

* [`--defaults-extra-file`](mysql-cluster-programs-ndbinfo-select-all.html#option_ndbinfo_select_all_defaults-extra-file)

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--defaults-extra-file=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  Read given file after global files are read.

* [`--defaults-file`](mysql-cluster-programs-ndbinfo-select-all.html#option_ndbinfo_select_all_defaults-file)

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--defaults-file=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  Read default options from given file only.

* [`--defaults-group-suffix`](mysql-cluster-programs-ndbinfo-select-all.html#option_ndbinfo_select_all_defaults-group-suffix)

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--defaults-group-suffix=string</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  Also read groups with concat(group, suffix).

* [`--delay=seconds`](mysql-cluster-programs-ndbinfo-select-all.html#option_ndbinfo_select_all_delay)

  <table frame="box" rules="all" summary="Properties for delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--delay=#</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">5</code></td>
</tr><tr><th>Minimum Value</th>
<td><code class="literal">0</code></td>
</tr><tr><th>Maximum Value</th>
<td><code class="literal">MAX_INT</code></td>
</tr></tbody></table>

  This option sets the number of seconds to wait between
  executing loops. Has no effect if
  [`--loops`](mysql-cluster-programs-ndbinfo-select-all.html#option_ndbinfo_select_all_loops) is set to
  0 or 1.

* [`--help`](mysql-cluster-programs-ndbinfo-select-all.html#option_ndbinfo_select_all_help)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>

  Display help text and exit.

* [`--login-path`](mysql-cluster-programs-ndbinfo-select-all.html#option_ndbinfo_select_all_login-path)

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--core-file</code></td>
</tr></tbody></table>0

  Read given path from login file.

* [`--no-login-paths`](mysql-cluster-programs-ndbinfo-select-all.html#option_ndbinfo_select_all_no-login-paths)

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--core-file</code></td>
</tr></tbody></table>1

  Skips reading options from the login path file.

* [`--loops=number`](mysql-cluster-programs-ndbinfo-select-all.html#option_ndbinfo_select_all_loops),
  `-l number`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--core-file</code></td>
</tr></tbody></table>2

  This option sets the number of times to execute the select.
  Use [`--delay`](mysql-cluster-programs-ndbinfo-select-all.html#option_ndbinfo_select_all_delay) to
  set the time between loops.

* [`--ndb-connectstring`](mysql-cluster-programs-ndbinfo-select-all.html#option_ndbinfo_select_all_ndb-connectstring)

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--core-file</code></td>
</tr></tbody></table>3

  Set connection string for connecting to
  [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "25.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon"). Syntax:
  `[nodeid=id;][host=]hostname[:port]`.
  Overrides entries in `NDB_CONNECTSTRING`
  and `my.cnf`.

* [`--ndb-mgmd-host`](mysql-cluster-programs-ndbinfo-select-all.html#option_ndbinfo_select_all_ndb-mgmd-host)

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--core-file</code></td>
</tr></tbody></table>4

  Same as
  [`--ndb-connectstring`](mysql-cluster-programs-ndbinfo-select-all.html#option_ndbinfo_select_all_ndb-connectstring).

* [`--ndb-nodeid`](mysql-cluster-programs-ndbinfo-select-all.html#option_ndbinfo_select_all_ndb-nodeid)

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--core-file</code></td>
</tr></tbody></table>5

  Set node ID for this node, overriding any ID set by
  --ndb-connectstring.

* [`--ndb-optimized-node-selection`](mysql-cluster-programs-ndbinfo-select-all.html#option_ndbinfo_select_all_ndb-optimized-node-selection)

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--core-file</code></td>
</tr></tbody></table>6

  Enable optimizations for selection of nodes for
  transactions. Enabled by default; use
  `--skip-ndb-optimized-node-selection` to
  disable.

* [`--no-defaults`](mysql-cluster-programs-ndbinfo-select-all.html#option_ndbinfo_select_all_no-defaults)

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--core-file</code></td>
</tr></tbody></table>7

  Do not read default options from any option file other than
  login file.

* [`--print-defaults`](mysql-cluster-programs-ndbinfo-select-all.html#option_ndbinfo_select_all_print-defaults)

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--core-file</code></td>
</tr></tbody></table>8

  Print program argument list and exit.

* [`--usage`](mysql-cluster-programs-ndbinfo-select-all.html#option_ndbinfo_select_all_usage)

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--core-file</code></td>
</tr></tbody></table>9

  Display help text and exit; same as --help.

* [`--version`](mysql-cluster-programs-ndbinfo-select-all.html#option_ndbinfo_select_all_version)

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-retries=#</code></td>
</tr><tr><th>Type</th>
<td>Integer</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">12</code></td>
</tr><tr><th>Minimum Value</th>
<td><code class="literal">0</code></td>
</tr><tr><th>Maximum Value</th>
<td><code class="literal">12</code></td>
</tr></tbody></table>0

  Display version information and exit.

[**ndbinfo\_select\_all**](mysql-cluster-programs-ndbinfo-select-all.html "25.5.2 ndbinfo_select_all — Select From ndbinfo Tables") is unable to read the
following tables:

* [`arbitrator_validity_detail`](mysql-cluster-ndbinfo-arbitrator-validity-detail.html "25.6.15.1 The ndbinfo arbitrator_validity_detail Table")
* [`arbitrator_validity_summary`](mysql-cluster-ndbinfo-arbitrator-validity-summary.html "25.6.15.2 The ndbinfo arbitrator_validity_summary Table")
* [`cluster_locks`](mysql-cluster-ndbinfo-cluster-locks.html "25.6.15.7 The ndbinfo cluster_locks Table")
* [`cluster_operations`](mysql-cluster-ndbinfo-cluster-operations.html "25.6.15.8 The ndbinfo cluster_operations Table")
* [`cluster_transactions`](mysql-cluster-ndbinfo-cluster-transactions.html "25.6.15.9 The ndbinfo cluster_transactions Table")
* [`disk_write_speed_aggregate_node`](mysql-cluster-ndbinfo-disk-write-speed-aggregate-node.html "25.6.15.30 The ndbinfo disk_write_speed_aggregate_node Table")
* [`locks_per_fragment`](mysql-cluster-ndbinfo-locks-per-fragment.html "25.6.15.42 The ndbinfo locks_per_fragment Table")
* [`memory_per_fragment`](mysql-cluster-ndbinfo-memory-per-fragment.html "25.6.15.47 The ndbinfo memory_per_fragment Table")
* [`memoryusage`](mysql-cluster-ndbinfo-memoryusage.html "25.6.15.46 The ndbinfo memoryusage Table")
* [`operations_per_fragment`](mysql-cluster-ndbinfo-operations-per-fragment.html "25.6.15.49 The ndbinfo operations_per_fragment Table")
* [`server_locks`](mysql-cluster-ndbinfo-server-locks.html "25.6.15.54 The ndbinfo server_locks Table")
* [`server_operations`](mysql-cluster-ndbinfo-server-operations.html "25.6.15.55 The ndbinfo server_operations Table")
* [`server_transactions`](mysql-cluster-ndbinfo-server-transactions.html "25.6.15.56 The ndbinfo server_transactions Table")
* [`table_info`](mysql-cluster-ndbinfo-table-info.html "25.6.15.59 The ndbinfo table_info Table")