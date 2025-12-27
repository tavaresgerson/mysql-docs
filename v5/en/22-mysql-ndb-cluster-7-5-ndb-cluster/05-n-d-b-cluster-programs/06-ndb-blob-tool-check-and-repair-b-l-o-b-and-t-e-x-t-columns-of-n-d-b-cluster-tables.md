### 21.5.6 ndb\_blob\_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables

This tool can be used to check for and remove orphaned BLOB column parts from [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables, as well as to generate a file listing any orphaned parts. It is sometimes useful in diagnosing and repairing corrupted or damaged `NDB` tables containing [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") or [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") columns.

The basic syntax for [**ndb\_blob\_tool**](mysql-cluster-programs-ndb-blob-tool.html "21.5.6 ndb_blob_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables") is shown here:

```sql
ndb_blob_tool [options] table [column, ...]
```

Unless you use the [`--help`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_help) option, you must specify an action to be performed by including one or more of the options [`--check-orphans`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_check-orphans), [`--delete-orphans`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_delete-orphans), or [`--dump-file`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_dump-file). These options cause [**ndb\_blob\_tool**](mysql-cluster-programs-ndb-blob-tool.html "21.5.6 ndb_blob_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables") to check for orphaned BLOB parts, remove any orphaned BLOB parts, and generate a dump file listing orphaned BLOB parts, respectively, and are described in more detail later in this section.

You must also specify the name of a table when invoking [**ndb\_blob\_tool**](mysql-cluster-programs-ndb-blob-tool.html "21.5.6 ndb_blob_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables"). In addition, you can optionally follow the table name with the (comma-separated) names of one or more [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") or [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") columns from that table. If no columns are listed, the tool works on all of the table's [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") and [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") columns. If you need to specify a database, use the [`--database`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_database) (`-d`) option.

The [`--verbose`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_verbose) option provides additional information in the output about the tool's progress.

Options that can be used with [**ndb\_blob\_tool**](mysql-cluster-programs-ndb-blob-tool.html "21.5.6 ndb_blob_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables") are shown in the following table. Additional descriptions follow the table.

**Table 21.26 Command-line options used with the program ndb\_blob\_tool**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_add-missing">--add-missing</a> </code> </p></th> <td>Write dummy blob parts to take place of those which are missing</td> <td><p> ADDED: NDB 7.5.18, NDB 7.6.14 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_character-sets-dir">--character-sets-dir=path</a> </code> </p></th> <td>Directory containing character sets</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_check-missing">--check-missing</a> </code> </p></th> <td>Check for blobs having inline parts but missing one or more parts from parts table</td> <td><p> ADDED: NDB 7.5.18, NDB 7.6.14 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_check-orphans">--check-orphans</a> </code> </p></th> <td>Check for blob parts having no corresponding inline parts</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_connect-retries">--connect-retries=#</a> </code> </p></th> <td>Number of times to retry connection before giving up</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_connect-retry-delay">--connect-retry-delay=#</a> </code> </p></th> <td>Number of seconds to wait between attempts to contact management server</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_connect-string">--connect-string=connection_string</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_connect-string">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_core-file">--core-file</a> </code> </p></th> <td>Write core file on error; used in debugging</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_database">--database=name</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_database">-d name</a> </code> </p></th> <td>Database to find the table in</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_defaults-extra-file">--defaults-extra-file=path</a> </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_defaults-file">--defaults-file=path</a> </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_defaults-group-suffix">--defaults-group-suffix=string</a> </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_delete-orphans">--delete-orphans</a> </code> </p></th> <td>Delete blob parts having no corresponding inline parts</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_dump-file">--dump-file=file</a> </code> </p></th> <td>Write orphan keys to specified file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_help">--help</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_help">-?</a> </code> </p></th> <td>Display help text and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_login-path">--login-path=path</a> </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_ndb-connectstring">--ndb-connectstring=connection_string</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_ndb-mgmd-host">--ndb-mgmd-host=connection_string</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_ndb-nodeid">--ndb-nodeid=#</a> </code> </p></th> <td>Set node ID for this node, overriding any ID set by --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_ndb-optimized-node-selection">--ndb-optimized-node-selection</a> </code> </p></th> <td>Enable optimizations for selection of nodes for transactions. Enabled by default; use --skip-ndb-optimized-node-selection to disable</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_no-defaults">--no-defaults</a> </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_print-defaults">--print-defaults</a> </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_usage">--usage</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_usage">-?</a> </code> </p></th> <td>Display help text and exit; same as --help</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_verbose">--verbose</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_verbose">-v</a> </code> </p></th> <td>Verbose output</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_version">--version</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_version">-V</a> </code> </p></th> <td>Display version information and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody></table>

* `--add-missing`

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--add-missing</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>

  For each inline part in NDB Cluster tables which has no corresponding BLOB part, write a dummy BLOB part of the required length, consisting of spaces.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>

  Directory containing character sets.

* `--check-missing`

  <table frame="box" rules="all" summary="Properties for check-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--check-missing</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>

  Check for inline parts in NDB Cluster tables which have no corresponding BLOB parts.

* `--check-orphans`

  <table frame="box" rules="all" summary="Properties for check-orphans"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--check-orphans</code></td> </tr></tbody></table>

  Check for BLOB parts in NDB Cluster tables which have no corresponding inline parts.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">12</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">12</code></td> </tr></tbody></table>

  Number of times to retry connection before giving up.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">5</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">5</code></td> </tr></tbody></table>

  Number of seconds to wait between attempts to contact management server.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  Same as [`--ndb-connectstring`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_ndb-connectstring).

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--core-file</code></td> </tr></tbody></table>

  Write core file on error; used in debugging.

* `--database=db_name`, `-d`

  <table frame="box" rules="all" summary="Properties for database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--database=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  Specify the database to find the table in.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--add-missing</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>0

  Read given file after global files are read.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--add-missing</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>1

  Read default options from given file only.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--add-missing</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>2

  Also read groups with concat(group, suffix).

* `--delete-orphans`

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--add-missing</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>3

  Remove BLOB parts from NDB Cluster tables which have no corresponding inline parts.

* `--dump-file=file`

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--add-missing</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>4

  Writes a list of orphaned BLOB column parts to *`file`*. The information written to the file includes the table key and BLOB part number for each orphaned BLOB part.

* `--help`

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--add-missing</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>5

  Display help text and exit.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--add-missing</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>6

  Read given path from login file.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--add-missing</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>7

  Set connect string for connecting to ndb\_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB\_CONNECTSTRING and my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--add-missing</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>8

  Same as [`--ndb-connectstring`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_ndb-connectstring).

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--add-missing</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>9

  Set node ID for this node, overriding any ID set by [`--ndb-connectstring`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_ndb-connectstring).

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>0

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>1

  Do not read default options from any option file other than login file.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>2

  Print program argument list and exit.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>3

  Display help text and exit; same as [`--help`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_help).

* `--verbose`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>4

  Provide extra information in the tool's output regarding its progress.

* `--version`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>5

  Display version information and exit.

#### Example

First we create an `NDB` table in the `test` database, using the [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") statement shown here:

```sql
USE test;

CREATE TABLE btest (
    c0 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    c1 TEXT,
    c2 BLOB
)   ENGINE=NDB;
```

Then we insert a few rows into this table, using a series of statements similar to this one:

```sql
INSERT INTO btest VALUES (NULL, 'x', REPEAT('x', 1000));
```

When run with [`--check-orphans`](mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_check-orphans) against this table, [**ndb\_blob\_tool**](mysql-cluster-programs-ndb-blob-tool.html "21.5.6 ndb_blob_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables") generates the following output:

```sql
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

NDBT_ProgramExit: 0 - OK
```

The tool reports that there are no `NDB` BLOB column parts associated with column `c1`, even though `c1` is a [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") column. This is due to the fact that, in an [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") table, only the first 256 bytes of a [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") or [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") column value are stored inline, and only the excess, if any, is stored separately; thus, if there are no values using more than 256 bytes in a given column of one of these types, no `BLOB` column parts are created by `NDB` for this column. See [Section 11.7, “Data Type Storage Requirements”](storage-requirements.html "11.7 Data Type Storage Requirements"), for more information.
