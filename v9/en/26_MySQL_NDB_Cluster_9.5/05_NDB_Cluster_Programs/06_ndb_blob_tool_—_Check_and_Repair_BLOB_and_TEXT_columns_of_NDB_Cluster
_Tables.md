### 25.5.6 ndb\_blob\_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables

This tool can be used to check for and remove orphaned BLOB
column parts from [`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 9.5") tables, as
well as to generate a file listing any orphaned parts. It is
sometimes useful in diagnosing and repairing corrupted or
damaged `NDB` tables containing
[`BLOB`](blob.html "13.3.4 The BLOB and TEXT Types") or
[`TEXT`](blob.html "13.3.4 The BLOB and TEXT Types") columns.

The basic syntax for [**ndb\_blob\_tool**](mysql-cluster-programs-ndb-blob-tool.html "25.5.6 ndb_blob_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables") is shown
here:

```
ndb_blob_tool [options] table [column, ...]
```

Unless you use the [`--help`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_help)
option, you must specify an action to be performed by including
one or more of the options
[`--check-orphans`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_check-orphans),
[`--delete-orphans`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_delete-orphans), or
[`--dump-file`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_dump-file). These options
cause [**ndb\_blob\_tool**](mysql-cluster-programs-ndb-blob-tool.html "25.5.6 ndb_blob_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables") to check for orphaned
BLOB parts, remove any orphaned BLOB parts, and generate a dump
file listing orphaned BLOB parts, respectively, and are
described in more detail later in this section.

You must also specify the name of a table when invoking
[**ndb\_blob\_tool**](mysql-cluster-programs-ndb-blob-tool.html "25.5.6 ndb_blob_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables"). In addition, you can
optionally follow the table name with the (comma-separated)
names of one or more [`BLOB`](blob.html "13.3.4 The BLOB and TEXT Types") or
[`TEXT`](blob.html "13.3.4 The BLOB and TEXT Types") columns from that table. If
no columns are listed, the tool works on all of the table's
[`BLOB`](blob.html "13.3.4 The BLOB and TEXT Types") and
[`TEXT`](blob.html "13.3.4 The BLOB and TEXT Types") columns. If you need to
specify a database, use the
[`--database`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_database)
(`-d`) option.

The [`--verbose`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_verbose) option
provides additional information in the output about the
tool's progress.

All options that can be used with [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "25.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon")
are shown in the following table. Additional descriptions follow
the table.

* [`--add-missing`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_add-missing)

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--add-missing</code></td>
</tr></tbody></table>

  For each inline part in NDB Cluster tables which has no
  corresponding BLOB part, write a dummy BLOB part of the
  required length, consisting of spaces.

* [`--character-sets-dir`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_character-sets-dir)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>

  Directory containing character sets.

* [`--check-missing`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_check-missing)

  <table frame="box" rules="all" summary="Properties for check-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--check-missing</code></td>
</tr></tbody></table>

  Check for inline parts in NDB Cluster tables which have no
  corresponding BLOB parts.

* [`--check-orphans`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_check-orphans)

  <table frame="box" rules="all" summary="Properties for check-orphans"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--check-orphans</code></td>
</tr></tbody></table>

  Check for BLOB parts in NDB Cluster tables which have no
  corresponding inline parts.

* [`--connect-retries`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_connect-retries)

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

* [`--connect-retry-delay`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_connect-retry-delay)

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

* [`--connect-string`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_connect-string)

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-string=connection_string</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  Same as
  [`--ndb-connectstring`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_ndb-connectstring).

* [`--core-file`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_core-file)

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--core-file</code></td>
</tr></tbody></table>

  Write core file on error; used in debugging.

* [`--database=db_name`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_database),
  `-d`

  <table frame="box" rules="all" summary="Properties for database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--database=name</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  Specify the database to find the table in.

* [`--defaults-extra-file`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_defaults-extra-file)

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--defaults-extra-file=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  Read given file after global files are read.

* [`--defaults-file`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_defaults-file)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>0

  Read default options from given file only.

* [`--defaults-group-suffix`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_defaults-group-suffix)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>1

  Also read groups with concat(group, suffix).

* [`--delete-orphans`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_delete-orphans)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>2

  Remove BLOB parts from NDB Cluster tables which have no
  corresponding inline parts.

* [`--dump-file=file`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_dump-file)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>3

  Writes a list of orphaned BLOB column parts to
  *`file`*. The information written to
  the file includes the table key and BLOB part number for
  each orphaned BLOB part.

* [`--help`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_help)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>4

  Display help text and exit.

* [`--login-path`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_login-path)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>5

  Read given path from login file.

* [`--no-login-paths`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_no-login-paths)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>6

  Skips reading options from the login path file.

* [`--ndb-connectstring`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_ndb-connectstring)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>7

  Set connection string for connecting to
  [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "25.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon"). Syntax:
  `[nodeid=id;][host=]hostname[:port]`.
  Overrides entries in `NDB_CONNECTSTRING`
  and `my.cnf`.

* [`--ndb-mgm-tls`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_ndb-mgm-tls)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>8

  Sets the level of TLS support required to connect to the
  management server; one of `relaxed` or
  `strict`. `relaxed` (the
  default) means that a TLS connection is attempted, but
  success is not required; `strict` means
  that TLS is required to connect.

* [`--ndb-mgmd-host`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_ndb-mgmd-host)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>9

  Same as
  [`--ndb-connectstring`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_ndb-connectstring).

* [`--ndb-nodeid`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_ndb-nodeid)

  <table frame="box" rules="all" summary="Properties for check-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--check-missing</code></td>
</tr></tbody></table>0

  Set node ID for this node, overriding any ID set by
  --ndb-connectstring.

* [`--ndb-optimized-node-selection`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_ndb-optimized-node-selection)

  <table frame="box" rules="all" summary="Properties for check-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--check-missing</code></td>
</tr></tbody></table>1

  Enable optimizations for selection of nodes for
  transactions. Enabled by default; use
  `--skip-ndb-optimized-node-selection` to
  disable.

* [`--ndb-tls-search-path`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_ndb-tls-search-path)

  <table frame="box" rules="all" summary="Properties for check-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--check-missing</code></td>
</tr></tbody></table>2

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

* [`--no-defaults`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_no-defaults)

  <table frame="box" rules="all" summary="Properties for check-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--check-missing</code></td>
</tr></tbody></table>3

  Do not read default options from any option file other than
  login file.

* [`--print-defaults`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_print-defaults)

  <table frame="box" rules="all" summary="Properties for check-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--check-missing</code></td>
</tr></tbody></table>4

  Print program argument list and exit.

* [`--usage`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_usage)

  <table frame="box" rules="all" summary="Properties for check-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--check-missing</code></td>
</tr></tbody></table>5

  Display help text and exit; same as --help.

* [`--verbose`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_verbose)

  <table frame="box" rules="all" summary="Properties for check-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--check-missing</code></td>
</tr></tbody></table>6

  Provide extra information in the tool's output
  regarding its progress.

* [`--version`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_version)

  <table frame="box" rules="all" summary="Properties for check-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--check-missing</code></td>
</tr></tbody></table>7

  Display version information and exit.

#### Example

First we create an `NDB` table in the
`test` database, using the
[`CREATE TABLE`](create-table.html "15.1.24 CREATE TABLE Statement") statement shown
here:

```
USE test;

CREATE TABLE btest (
    c0 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    c1 TEXT,
    c2 BLOB
)   ENGINE=NDB;
```

Then we insert a few rows into this table, using a series of
statements similar to this one:

```
INSERT INTO btest VALUES (NULL, 'x', REPEAT('x', 1000));
```

When run with
[`--check-orphans`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_check-orphans) against
this table, [**ndb\_blob\_tool**](mysql-cluster-programs-ndb-blob-tool.html "25.5.6 ndb_blob_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables") generates the
following output:

```
$> ndb_blob_tool --check-orphans --verbose -d test btest
connected
processing 2 blobs
processing blob #0 c1 NDB$BLOB_19_1
NDB$BLOB_19_1: nextResult: res=1
total parts: 0
orphan parts: 0
processing blob #1 c2 NDB$BLOB_19_2
NDB$BLOB_19_2: nextResult: res=0
NDB$BLOB_19_2: nextResult: res=0
NDB$BLOB_19_2: nextResult: res=0
NDB$BLOB_19_2: nextResult: res=0
NDB$BLOB_19_2: nextResult: res=0
NDB$BLOB_19_2: nextResult: res=0
NDB$BLOB_19_2: nextResult: res=0
NDB$BLOB_19_2: nextResult: res=0
NDB$BLOB_19_2: nextResult: res=0
NDB$BLOB_19_2: nextResult: res=0
NDB$BLOB_19_2: nextResult: res=1
total parts: 10
orphan parts: 0
disconnected
```

The tool reports that there are no `NDB` BLOB
column parts associated with column `c1`, even
though `c1` is a
[`TEXT`](blob.html "13.3.4 The BLOB and TEXT Types") column. This is due to the
fact that, in an [`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 9.5") table, only
the first 256 bytes of a [`BLOB`](blob.html "13.3.4 The BLOB and TEXT Types") or
[`TEXT`](blob.html "13.3.4 The BLOB and TEXT Types") column value are stored
inline, and only the excess, if any, is stored separately; thus,
if there are no values using more than 256 bytes in a given
column of one of these types, no `BLOB` column
parts are created by `NDB` for this column. See
[Section 13.7, “Data Type Storage Requirements”](storage-requirements.html "13.7 Data Type Storage Requirements"), for more information.