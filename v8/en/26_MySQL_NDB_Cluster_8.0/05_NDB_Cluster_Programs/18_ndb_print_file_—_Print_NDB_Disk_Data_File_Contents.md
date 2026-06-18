### 25.5.18 ndb\_print\_file — Print NDB Disk Data File Contents

[**ndb\_print\_file**](mysql-cluster-programs-ndb-print-file.html "25.5.18 ndb_print_file — Print NDB Disk Data File Contents") obtains information from an
NDB Cluster Disk Data file.

#### Usage

```
ndb_print_file [-v] [-q] file_name+
```

*`file_name`* is the name of an NDB
Cluster Disk Data file. Multiple filenames are accepted,
separated by spaces.

Like [**ndb\_print\_schema\_file**](mysql-cluster-programs-ndb-print-schema-file.html "25.5.20 ndb_print_schema_file — Print NDB Schema File Contents") and
[**ndb\_print\_sys\_file**](mysql-cluster-programs-ndb-print-sys-file.html "25.5.21 ndb_print_sys_file — Print NDB System File Contents") (and unlike most of the
other [`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 8.0") utilities that are
intended to be run on a management server host or to connect to
a management server) [**ndb\_print\_file**](mysql-cluster-programs-ndb-print-file.html "25.5.18 ndb_print_file — Print NDB Disk Data File Contents") must be
run on an NDB Cluster data node, since it accesses the data node
file system directly. Because it does not make use of the
management server, this utility can be used when the management
server is not running, and even when the cluster has been
completely shut down.

#### Options

**Table 25.40 Command-line options used with the program ndb\_print\_file**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr>
<th scope="col">Format</th>
<th scope="col">Description</th>
<th scope="col">Added, Deprecated, or Removed</th>
</tr></thead><tbody><tr>
<th scope="row"><p>
<code class="option"><a class="link" href="mysql-cluster-programs-ndb-print-file.html#option_ndb_print_file_file-key">--file-key=hex_data</a></code>,
              </p><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-print-file.html#option_ndb_print_file_file-key">-K
                hex_data</a> </code>
</p></th>
<td>Supply encryption key using stdin, tty, or my.cnf file</td>
<td><p>
                ADDED: NDB 8.0.31
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-print-file.html#option_ndb_print_file_file-key-from-stdin">--file-key-from-stdin</a>
</code>
</p></th>
<td>Supply encryption key using stdin</td>
<td><p>
                ADDED: NDB 8.0.31
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option"><a class="link" href="mysql-cluster-programs-ndb-print-file.html#option_ndb_print_file_help">--help</a></code>,
              </p><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-print-file.html#option_ndb_print_file_help">-?</a>
</code>
</p></th>
<td>Display help text and exit; same as --usage</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option"><a class="link" href="mysql-cluster-programs-ndb-print-file.html#option_ndb_print_file_quiet">--quiet</a></code>,
              </p><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-print-file.html#option_ndb_print_file_quiet">-q</a>
</code>
</p></th>
<td>Reduce verbosity of output</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option"><a class="link" href="mysql-cluster-programs-ndb-print-file.html#option_ndb_print_file_usage">--usage</a></code>,
              </p><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-print-file.html#option_ndb_print_file_usage">-?</a>
</code>
</p></th>
<td>Display help text and exit; same as --help</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option"><a class="link" href="mysql-cluster-programs-ndb-print-file.html#option_ndb_print_file_verbose">--verbose</a></code>,
              </p><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-print-file.html#option_ndb_print_file_verbose">-v</a>
</code>
</p></th>
<td>Increase verbosity of output</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option"><a class="link" href="mysql-cluster-programs-ndb-print-file.html#option_ndb_print_file_version">--version</a></code>,
              </p><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-print-file.html#option_ndb_print_file_version">-V</a>
</code>
</p></th>
<td>Display version information and exit</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody></table>

[**ndb\_print\_file**](mysql-cluster-programs-ndb-print-file.html "25.5.18 ndb_print_file — Print NDB Disk Data File Contents") supports the following
options:

* [`--file-key`](mysql-cluster-programs-ndb-print-file.html#option_ndb_print_file_file-key),
  `-K`

  <table frame="box" rules="all" summary="Properties for file-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--file-key=hex_data</code></td>
</tr><tr><th>Introduced</th>
<td>8.0.31-ndb-8.0.31</td>
</tr></tbody></table>

  Supply file system encryption or decryption key from
  `stdin`, `tty`, or a
  `my.cnf` file.

* [`--file-key-from-stdin`](mysql-cluster-programs-ndb-print-file.html#option_ndb_print_file_file-key-from-stdin)

  <table frame="box" rules="all" summary="Properties for file-key-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--file-key-from-stdin</code></td>
</tr><tr><th>Introduced</th>
<td>8.0.31-ndb-8.0.31</td>
</tr><tr><th>Type</th>
<td>Boolean</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">FALSE</code></td>
</tr><tr><th>Valid Values</th>
<td><code class="literal">TRUE</code></td>
</tr></tbody></table>

  Supply file system encryption or decryption key from
  `stdin`.

* [`--help`](mysql-cluster-programs-ndb-print-file.html#option_ndb_print_file_help),
  `-h`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>

  Print help message and exit.

* [`--quiet`](mysql-cluster-programs-ndb-print-file.html#option_ndb_print_file_quiet),
  `-q`

  <table frame="box" rules="all" summary="Properties for quiet"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--quiet</code></td>
</tr></tbody></table>

  Suppress output (quiet mode).

* [`--usage`](mysql-cluster-programs-ndb-print-file.html#option_ndb_print_file_usage),
  `-?`

  <table frame="box" rules="all" summary="Properties for usage"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--usage</code></td>
</tr></tbody></table>

  Print help message and exit.

* [`--verbose`](mysql-cluster-programs-ndb-print-file.html#option_ndb_print_file_verbose),
  `-v`

  <table frame="box" rules="all" summary="Properties for verbose"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--verbose</code></td>
</tr></tbody></table>

  Make output verbose.

* [`--version`](mysql-cluster-programs-ndb-print-file.html#option_ndb_print_file_version),
  `-v`

  <table frame="box" rules="all" summary="Properties for version"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--version</code></td>
</tr></tbody></table>

  Print version information and exit.

For more information, see
[Section 25.6.11, “NDB Cluster Disk Data Tables”](mysql-cluster-disk-data.html "25.6.11 NDB Cluster Disk Data Tables").