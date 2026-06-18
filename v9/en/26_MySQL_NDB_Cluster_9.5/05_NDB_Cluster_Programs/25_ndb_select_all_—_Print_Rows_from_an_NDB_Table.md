### 25.5.25 ndb\_select\_all — Print Rows from an NDB Table

[**ndb\_select\_all**](mysql-cluster-programs-ndb-select-all.html "25.5.25 ndb_select_all — Print Rows from an NDB Table") prints all rows from an
[`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 9.5") table to
`stdout`.

#### Usage

```
ndb_select_all -c connection_string tbl_name -d db_name [> file_name]
```

Options that can be used with [**ndb\_select\_all**](mysql-cluster-programs-ndb-select-all.html "25.5.25 ndb_select_all — Print Rows from an NDB Table")
are shown in the following table. Additional descriptions follow
the table.

* [`--character-sets-dir`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_character-sets-dir)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>

  Directory containing character sets.

* [`--connect-retries`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_connect-retries)

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

* [`--connect-retry-delay`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_connect-retry-delay)

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

* [`--connect-string`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_connect-string)

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-string=connection_string</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  Same as
  [`--ndb-connectstring`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_ndb-connectstring).

* [`--core-file`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_core-file)

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--core-file</code></td>
</tr></tbody></table>

  Write core file on error; used in debugging.

* [`--database=dbname`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_database),
  `-d` *`dbname`*

  Name of the database in which the table is found. The
  default value is `TEST_DB`.

* [`--descending`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_descending),
  `-z`

  Sorts the output in descending order. This option can be
  used only in conjunction with the `-o`
  ([`--order`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_order)) option.

* [`--defaults-extra-file`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_defaults-extra-file)

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--defaults-extra-file=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  Read given file after global files are read.

* [`--defaults-file`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_defaults-file)

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--defaults-file=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  Read default options from given file only.

* [`--defaults-group-suffix`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_defaults-group-suffix)

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--defaults-group-suffix=string</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  Also read groups with concat(group, suffix).

* [`--delimiter=character`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_delimiter),
  `-D character`

  Causes the *`character`* to be used
  as a column delimiter. Only table data columns are separated
  by this delimiter.

  The default delimiter is the tab character.

* [`--disk`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_disk)

  Adds a disk reference column to the output. The column is
  nonempty only for Disk Data tables having nonindexed
  columns.

* [`--gci`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_gci)

  Adds a `GCI` column to the output showing
  the global checkpoint at which each row was last updated.
  See [Section 25.2, “NDB Cluster Overview”](mysql-cluster-overview.html "25.2 NDB Cluster Overview"), and
  [Section 25.6.3.2, “NDB Cluster Log Events”](mysql-cluster-log-events.html "25.6.3.2 NDB Cluster Log Events"), for more
  information about checkpoints.

* [`--gci64`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_gci64)

  Adds a `ROW$GCI64` column to the output
  showing the global checkpoint at which each row was last
  updated, as well as the number of the epoch in which this
  update occurred.

* [`--help`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_help)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>

  Display help text and exit.

* [`--lock=lock_type`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_lock),
  `-l lock_type`

  Employs a lock when reading the table. Possible values for
  *`lock_type`* are:

  + `0`: Read lock
  + `1`: Read lock with hold
  + `2`: Exclusive read lock

  There is no default value for this option.

* [`--login-path`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_login-path)

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--login-path=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  Read given path from login file.

* [`--no-login-paths`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_no-login-paths)

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

  Skips reading options from the login path file.

* [`--header=FALSE`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_header)

  Excludes column headers from the output.

* [`--nodata`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_nodata)

  Causes any table data to be omitted.

* [`--ndb-connectstring`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_ndb-connectstring)

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
</tr></tbody></table>1

  Set connection string for connecting to
  [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "25.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon"). Syntax:
  `[nodeid=id;][host=]hostname[:port]`.
  Overrides entries in `NDB_CONNECTSTRING`
  and `my.cnf`.

* [`--ndb-mgm-tls`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_ndb-mgm-tls)

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
</tr></tbody></table>2

  Sets the level of TLS support required to connect to the
  management server; one of `relaxed` or
  `strict`. `relaxed` (the
  default) means that a TLS connection is attempted, but
  success is not required; `strict` means
  that TLS is required to connect.

* [`--ndb-mgmd-host`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_ndb-mgmd-host)

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
</tr></tbody></table>3

  Same as
  [`--ndb-connectstring`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_ndb-connectstring).

* [`--ndb-nodeid`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_ndb-nodeid)

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
</tr></tbody></table>4

  Set node ID for this node, overriding any ID set by
  [`--ndb-connectstring`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_ndb-connectstring).

* [`--ndb-optimized-node-selection`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_ndb-optimized-node-selection)

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
</tr></tbody></table>5

  Enable optimizations for selection of nodes for
  transactions. Enabled by default; use
  `--skip-ndb-optimized-node-selection` to
  disable.

* [`--ndb-tls-search-path`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_ndb-tls-search-path)

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
</tr></tbody></table>6

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

* [`--no-defaults`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_no-defaults)

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
</tr></tbody></table>7

  Do not read default options from any option file other than
  login file.

* [`--order=index_name`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_order),
  `-o index_name`

  Orders the output according to the index named
  *`index_name`*.

  Note

  This is the name of an index, not of a column; the index
  must have been explicitly named when created.

* [`parallelism=#`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_parallelism),
  `-p` *`#`*

  Specifies the degree of parallelism.

* [`--print-defaults`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_print-defaults)

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
</tr></tbody></table>8

  Print program argument list and exit.

* [`--rowid`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_rowid)

  Adds a `ROWID` column providing information
  about the fragments in which rows are stored.

* [`--tupscan`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_tupscan),
  `-t`

  Scan the table in the order of the tuples.

* [`--usage`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_usage)

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
</tr></tbody></table>9

  Display help text and exit; same as
  [`--help`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_help).

* [`--useHexFormat`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_useHexFormat)
  `-x`

  Causes all numeric values to be displayed in hexadecimal
  format. This does not affect the output of numerals
  contained in strings or datetime values.

* [`--version`](mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_version)

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
</tr></tbody></table>0

  Display version information and exit.

#### Sample Output

Output from a MySQL [`SELECT`](select.html "15.2.13 SELECT Statement")
statement:

```
mysql> SELECT * FROM ctest1.fish;
+----+-----------+
| id | name      |
+----+-----------+
|  3 | shark     |
|  6 | puffer    |
|  2 | tuna      |
|  4 | manta ray |
|  5 | grouper   |
|  1 | guppy     |
+----+-----------+
6 rows in set (0.04 sec)
```

Output from the equivalent invocation of
[**ndb\_select\_all**](mysql-cluster-programs-ndb-select-all.html "25.5.25 ndb_select_all — Print Rows from an NDB Table"):

```
$> ./ndb_select_all -c localhost fish -d ctest1
id      name
3       [shark]
6       [puffer]
2       [tuna]
4       [manta ray]
5       [grouper]
1       [guppy]
6 rows returned
```

All string values are enclosed by square brackets
(`[`...`]`) in the output of
[**ndb\_select\_all**](mysql-cluster-programs-ndb-select-all.html "25.5.25 ndb_select_all — Print Rows from an NDB Table"). For another example, consider
the table created and populated as shown here:

```
CREATE TABLE dogs (
    id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(25) NOT NULL,
    breed VARCHAR(50) NOT NULL,
    PRIMARY KEY pk (id),
    KEY ix (name)
)
TABLESPACE ts STORAGE DISK
ENGINE=NDBCLUSTER;

INSERT INTO dogs VALUES
    ('', 'Lassie', 'collie'),
    ('', 'Scooby-Doo', 'Great Dane'),
    ('', 'Rin-Tin-Tin', 'Alsatian'),
    ('', 'Rosscoe', 'Mutt');
```

This demonstrates the use of several additional
[**ndb\_select\_all**](mysql-cluster-programs-ndb-select-all.html "25.5.25 ndb_select_all — Print Rows from an NDB Table") options:

```
$> ./ndb_select_all -d ctest1 dogs -o ix -z --gci --disk
GCI     id name          breed        DISK_REF
834461  2  [Scooby-Doo]  [Great Dane] [ m_file_no: 0 m_page: 98 m_page_idx: 0 ]
834878  4  [Rosscoe]     [Mutt]       [ m_file_no: 0 m_page: 98 m_page_idx: 16 ]
834463  3  [Rin-Tin-Tin] [Alsatian]   [ m_file_no: 0 m_page: 34 m_page_idx: 0 ]
835657  1  [Lassie]      [Collie]     [ m_file_no: 0 m_page: 66 m_page_idx: 0 ]
4 rows returned
```