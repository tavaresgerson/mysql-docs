### 21.5.23 ndb\_redo\_log\_reader — Check and Print Content of Cluster Redo Log

Reads a redo log file, checking it for errors, printing its contents in a human-readable format, or both. [**ndb\_redo\_log\_reader**](mysql-cluster-programs-ndb-redo-log-reader.html "21.5.23 ndb_redo_log_reader — Check and Print Content of Cluster Redo Log") is intended for use primarily by NDB Cluster developers and Support personnel in debugging and diagnosing problems.

This utility remains under development, and its syntax and behavior are subject to change in future NDB Cluster releases.

The C++ source files for [**ndb\_redo\_log\_reader**](mysql-cluster-programs-ndb-redo-log-reader.html "21.5.23 ndb_redo_log_reader — Check and Print Content of Cluster Redo Log") can be found in the directory `/storage/ndb/src/kernel/blocks/dblqh/redoLogReader`.

Options that can be used with [**ndb\_redo\_log\_reader**](mysql-cluster-programs-ndb-redo-log-reader.html "21.5.23 ndb_redo_log_reader — Check and Print Content of Cluster Redo Log") are shown in the following table. Additional descriptions follow the table.

**Table 21.37 Command-line options used with the program ndb\_redo\_log\_reader**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Format</th> <th>Description</th> <th>Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_dump">-dump</a> </code> </p></th> <td>Print dump info</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_filedescriptors">-filedescriptors</a> </code> </p></th> <td>Print file descriptors only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_help">--help</a> </code> </p></th> <td>Print usage information (has no short form)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_lap">-lap</a> </code> </p></th> <td>Provide lap info, with max GCI started and completed</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_mbyte">-mbyte
                #</a> </code> </p></th> <td>Starting megabyte</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_mbyteheaders">-mbyteheaders</a> </code> </p></th> <td>Show only first page header of each megabyte in file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_nocheck">-nocheck</a> </code> </p></th> <td>Do not check records for errors</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_noprint">-noprint</a> </code> </p></th> <td>Do not print records</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_page">-page
                #</a> </code> </p></th> <td>Start with this page</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_pageheaders">-pageheaders</a> </code> </p></th> <td>Show page headers only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_pageindex">-pageindex
                #</a> </code> </p></th> <td>Start with this page index</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_twiddle">-twiddle</a> </code> </p></th> <td>Bit-shifted dump</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody></table>

#### Usage

```sql
ndb_redo_log_reader file_name [options]
```

*`file_name`* is the name of a cluster redo log file. redo log files are located in the numbered directories under the data node's data directory ([`DataDir`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datadir)); the path under this directory to the redo log files matches the pattern `ndb_nodeid_fs/D#/DBLQH/S#.FragLog`. *`nodeid`* is the data node's node ID. The two instances of *`#`* each represent a number (not necessarily the same number); the number following `D` is in the range 8-39 inclusive; the range of the number following `S` varies according to the value of the [`NoOfFragmentLogFiles`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-nooffragmentlogfiles) configuration parameter, whose default value is 16; thus, the default range of the number in the file name is 0-15 inclusive. For more information, see [NDB Cluster Data Node File System Directory](/doc/ndb-internals/en/ndb-internals-ndbd-filesystemdir-files.html).

The name of the file to be read may be followed by one or more of the options listed here:

* `-dump`

  <table frame="box" rules="all" summary="Properties for dump"><tbody><tr><th>Command-Line Format</th> <td><code>-dump</code></td> </tr></tbody></table>

  Print dump info.

* <table frame="box" rules="all" summary="Properties for filedescriptors"><tbody><tr><th>Command-Line Format</th> <td><code>-filedescriptors</code></td> </tr></tbody></table>

  `-filedescriptors`: Print file descriptors only.

* <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  `--help`: Print usage information.

* `-lap`

  <table frame="box" rules="all" summary="Properties for lap"><tbody><tr><th>Command-Line Format</th> <td><code>-lap</code></td> </tr></tbody></table>

  Provide lap info, with max GCI started and completed.

* <table frame="box" rules="all" summary="Properties for mbyte"><tbody><tr><th>Command-Line Format</th> <td><code>-mbyte #</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>15</code></td> </tr></tbody></table>

  `-mbyte #`: Starting megabyte.

  *`#`* is an integer in the range 0 to 15, inclusive.

* <table frame="box" rules="all" summary="Properties for mbyteheaders"><tbody><tr><th>Command-Line Format</th> <td><code>-mbyteheaders</code></td> </tr></tbody></table>

  `-mbyteheaders`: Show only the first page header of every megabyte in the file.

* <table frame="box" rules="all" summary="Properties for noprint"><tbody><tr><th>Command-Line Format</th> <td><code>-noprint</code></td> </tr></tbody></table>

  `-noprint`: Do not print the contents of the log file.

* <table frame="box" rules="all" summary="Properties for nocheck"><tbody><tr><th>Command-Line Format</th> <td><code>-nocheck</code></td> </tr></tbody></table>

  `-nocheck`: Do not check the log file for errors.

* <table frame="box" rules="all" summary="Properties for page"><tbody><tr><th>Command-Line Format</th> <td><code>-page #</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>31</code></td> </tr></tbody></table>

  `-page #`: Start at this page.

  *`#`* is an integer in the range 0 to 31, inclusive.

* <table frame="box" rules="all" summary="Properties for dump"><tbody><tr><th>Command-Line Format</th> <td><code>-dump</code></td> </tr></tbody></table>

  `-pageheaders`: Show page headers only.

* <table frame="box" rules="all" summary="Properties for dump"><tbody><tr><th>Command-Line Format</th> <td><code>-dump</code></td> </tr></tbody></table>

  `-pageindex #`: Start at this page index.

  *`#`* is an integer between 12 and 8191, inclusive.

* `-twiddle`

  <table frame="box" rules="all" summary="Properties for dump"><tbody><tr><th>Command-Line Format</th> <td><code>-dump</code></td> </tr></tbody></table>

  Bit-shifted dump.

Like [**ndb\_print\_backup\_file**](mysql-cluster-programs-ndb-print-backup-file.html "21.5.18 ndb_print_backup_file — Print NDB Backup File Contents") and [**ndb\_print\_schema\_file**](mysql-cluster-programs-ndb-print-schema-file.html "21.5.21 ndb_print_schema_file — Print NDB Schema File Contents") (and unlike most of the [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") utilities that are intended to be run on a management server host or to connect to a management server) [**ndb\_redo\_log\_reader**](mysql-cluster-programs-ndb-redo-log-reader.html "21.5.23 ndb_redo_log_reader — Check and Print Content of Cluster Redo Log") must be run on a cluster data node, since it accesses the data node file system directly. Because it does not make use of the management server, this utility can be used when the management server is not running, and even when the cluster has been completely shut down.
