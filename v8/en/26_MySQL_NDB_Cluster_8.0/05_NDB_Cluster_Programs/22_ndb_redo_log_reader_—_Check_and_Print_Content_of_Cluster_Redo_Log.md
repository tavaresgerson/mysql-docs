### 25.5.22 ndb\_redo\_log\_reader — Check and Print Content of Cluster Redo Log

Reads a redo log file, checking it for errors, printing its
contents in a human-readable format, or both.
[**ndb\_redo\_log\_reader**](mysql-cluster-programs-ndb-redo-log-reader.html "25.5.22 ndb_redo_log_reader — Check and Print Content of Cluster Redo Log") is intended for use
primarily by NDB Cluster developers and Support personnel in
debugging and diagnosing problems.

This utility remains under development, and its syntax and
behavior are subject to change in future NDB Cluster releases.

The C++ source files for [**ndb\_redo\_log\_reader**](mysql-cluster-programs-ndb-redo-log-reader.html "25.5.22 ndb_redo_log_reader — Check and Print Content of Cluster Redo Log")
can be found in the directory
`/storage/ndb/src/kernel/blocks/dblqh/redoLogReader`.

Options that can be used with
[**ndb\_redo\_log\_reader**](mysql-cluster-programs-ndb-redo-log-reader.html "25.5.22 ndb_redo_log_reader — Check and Print Content of Cluster Redo Log") are shown in the
following table. Additional descriptions follow the table.

**Table 25.41 Command-line options used with the program ndb\_redo\_log\_reader**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr>
<th scope="col">Format</th>
<th scope="col">Description</th>
<th scope="col">Added, Deprecated, or Removed</th>
</tr></thead><tbody><tr>
<th scope="row"><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_dump">-dump</a>
</code>
</p></th>
<td>Print dump info</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option"><a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_file-key">--file-key=key</a></code>,
              </p><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_file-key">-K
                key</a> </code>
</p></th>
<td>Supply decryption key</td>
<td><p>
                ADDED: NDB 8.0.31
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_file-key-from-stdin">--file-key-from-stdin</a>
</code>
</p></th>
<td>Supply decryption key using stdin</td>
<td><p>
                ADDED: NDB 8.0.31
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_filedescriptors">-filedescriptors</a>
</code>
</p></th>
<td>Print file descriptors only</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_help">--help</a>
</code>
</p></th>
<td>Print usage information (has no short form)</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_lap">-lap</a>
</code>
</p></th>
<td>Provide lap info, with max GCI started and completed</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_mbyte">-mbyte
                #</a> </code>
</p></th>
<td>Starting megabyte</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_mbyteheaders">-mbyteheaders</a>
</code>
</p></th>
<td>Show only first page header of each megabyte in file</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_nocheck">-nocheck</a>
</code>
</p></th>
<td>Do not check records for errors</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_noprint">-noprint</a>
</code>
</p></th>
<td>Do not print records</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_page">-page
                #</a> </code>
</p></th>
<td>Start with this page</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_pageheaders">-pageheaders</a>
</code>
</p></th>
<td>Show page headers only</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_pageindex">-pageindex
                #</a> </code>
</p></th>
<td>Start with this page index</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_twiddle">-twiddle</a>
</code>
</p></th>
<td>Bit-shifted dump</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody></table>

#### Usage

```
ndb_redo_log_reader file_name [options]
```

*`file_name`* is the name of a cluster
redo log file. redo log files are located in the numbered
directories under the data node's data directory
([`DataDir`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datadir)); the path
under this directory to the redo log files matches the pattern
`ndb_nodeid_fs/D#/DBLQH/S#.FragLog`.
*`nodeid`* is the data node's node
ID. The two instances of *`#`* each
represent a number (not necessarily the same number); the number
following `D` is in the range 8-39 inclusive;
the range of the number following `S` varies
according to the value of the
[`NoOfFragmentLogFiles`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-nooffragmentlogfiles)
configuration parameter, whose default value is 16; thus, the
default range of the number in the file name is 0-15 inclusive.
For more information, see
[NDB Cluster Data Node File System Directory](/doc/ndb-internals/en/ndb-internals-ndbd-filesystemdir-files.html).

The name of the file to be read may be followed by one or more
of the options listed here:

* [`-dump`](mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_dump)

  <table frame="box" rules="all" summary="Properties for dump"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">-dump</code></td>
</tr></tbody></table>

  Print dump info.

* [`--file-key`](mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_file-key),
  `-K`

  <table frame="box" rules="all" summary="Properties for file-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--file-key=key</code></td>
</tr><tr><th>Introduced</th>
<td>8.0.31-ndb-8.0.31</td>
</tr></tbody></table>

  Supply file decryption key using `stdin`,
  `tty`, or a `my.cnf`
  file.

* [`--file-key-from-stdin`](mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_file-key-from-stdin)

  <table frame="box" rules="all" summary="Properties for file-key-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--file-key-from-stdin</code></td>
</tr><tr><th>Introduced</th>
<td>8.0.31-ndb-8.0.31</td>
</tr></tbody></table>

  Supply file decryption key using `stdin`.

* <table frame="box" rules="all" summary="Properties for filedescriptors"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">-filedescriptors</code></td>
</tr></tbody></table>

  [`-filedescriptors`](mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_filedescriptors):
  Print file descriptors only.

* <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>

  [`--help`](mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_help): Print
  usage information.

* [`-lap`](mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_lap)

  <table frame="box" rules="all" summary="Properties for lap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">-lap</code></td>
</tr></tbody></table>

  Provide lap info, with max GCI started and completed.

* <table frame="box" rules="all" summary="Properties for mbyte"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">-mbyte #</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">0</code></td>
</tr><tr><th>Minimum Value</th>
<td><code class="literal">0</code></td>
</tr><tr><th>Maximum Value</th>
<td><code class="literal">15</code></td>
</tr></tbody></table>

  [`-mbyte
  #`](mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_mbyte): Starting megabyte.

  *`#`* is an integer in the range 0 to
  15, inclusive.

* <table frame="box" rules="all" summary="Properties for mbyteheaders"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">-mbyteheaders</code></td>
</tr></tbody></table>

  [`-mbyteheaders`](mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_mbyteheaders):
  Show only the first page header of every megabyte in the
  file.

* <table frame="box" rules="all" summary="Properties for noprint"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">-noprint</code></td>
</tr></tbody></table>

  [`-noprint`](mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_noprint): Do not
  print the contents of the log file.

* <table frame="box" rules="all" summary="Properties for dump"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">-dump</code></td>
</tr></tbody></table>0

  [`-nocheck`](mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_nocheck): Do not
  check the log file for errors.

* <table frame="box" rules="all" summary="Properties for dump"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">-dump</code></td>
</tr></tbody></table>1

  [`-page
  #`](mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_page): Start at this page.

  *`#`* is an integer in the range 0 to
  31, inclusive.

* <table frame="box" rules="all" summary="Properties for dump"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">-dump</code></td>
</tr></tbody></table>2

  [`-pageheaders`](mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_pageheaders):
  Show page headers only.

* <table frame="box" rules="all" summary="Properties for dump"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">-dump</code></td>
</tr></tbody></table>3

  [`-pageindex
  #`](mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_pageindex): Start at this page
  index.

  *`#`* is an integer between 12 and
  8191, inclusive.

* [`-twiddle`](mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_twiddle)

  <table frame="box" rules="all" summary="Properties for dump"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">-dump</code></td>
</tr></tbody></table>4

  Bit-shifted dump.

Like [**ndb\_print\_backup\_file**](mysql-cluster-programs-ndb-print-backup-file.html "25.5.17 ndb_print_backup_file — Print NDB Backup File Contents") and
[**ndb\_print\_schema\_file**](mysql-cluster-programs-ndb-print-schema-file.html "25.5.20 ndb_print_schema_file — Print NDB Schema File Contents") (and unlike most of the
[`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 8.0") utilities that are intended to
be run on a management server host or to connect to a management
server) [**ndb\_redo\_log\_reader**](mysql-cluster-programs-ndb-redo-log-reader.html "25.5.22 ndb_redo_log_reader — Check and Print Content of Cluster Redo Log") must be run on a
cluster data node, since it accesses the data node file system
directly. Because it does not make use of the management server,
this utility can be used when the management server is not
running, and even when the cluster has been completely shut
down.