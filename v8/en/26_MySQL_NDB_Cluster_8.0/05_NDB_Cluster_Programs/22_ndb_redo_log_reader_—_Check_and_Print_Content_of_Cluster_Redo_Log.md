### 25.5.22 ndb_redo_log_reader — Check and Print Content of Cluster Redo Log

Reads a redo log file, checking it for errors, printing its contents in a human-readable format, or both. **ndb_redo_log_reader** is intended for use primarily by NDB Cluster developers and Support personnel in debugging and diagnosing problems.

This utility remains under development, and its syntax and behavior are subject to change in future NDB Cluster releases.

The C++ source files for **ndb_redo_log_reader** can be found in the directory `/storage/ndb/src/kernel/blocks/dblqh/redoLogReader`.

Options that can be used with **ndb_redo_log_reader** are shown in the following table. Additional descriptions follow the table.

**Table 25.41 Command-line options used with the program ndb_redo_log_reader**

<table frame="box" rules="all"><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code> -dump </code> </p></th> <td>Print dump info</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--file-key=key</code>, </p><p> <code> -K key </code> </p></th> <td>Supply decryption key</td> <td><p> ADDED: NDB 8.0.31 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --file-key-from-stdin </code> </p></th> <td>Supply decryption key using stdin</td> <td><p> ADDED: NDB 8.0.31 </p></td> </tr></tbody><tbody><tr> <th><p> <code> -filedescriptors </code> </p></th> <td>Print file descriptors only</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --help </code> </p></th> <td>Print usage information (has no short form)</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> -lap </code> </p></th> <td>Provide lap info, with max GCI started and completed</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_mbyte">-mbyte
                #</a> </code> </p></th> <td>Starting megabyte</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> -mbyteheaders </code> </p></th> <td>Show only first page header of each megabyte in file</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> -nocheck </code> </p></th> <td>Do not check records for errors</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> -noprint </code> </p></th> <td>Do not print records</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_page">-page
                #</a> </code> </p></th> <td>Start with this page</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> -pageheaders </code> </p></th> <td>Show page headers only</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_pageindex">-pageindex
                #</a> </code> </p></th> <td>Start with this page index</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> -twiddle </code> </p></th> <td>Bit-shifted dump</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody></table>

#### Usage

```
ndb_redo_log_reader file_name [options]
```

*`file_name`* is the name of a cluster redo log file. redo log files are located in the numbered directories under the data node's data directory (`DataDir`); the path under this directory to the redo log files matches the pattern `ndb_nodeid_fs/D#/DBLQH/S#.FragLog`. *`nodeid`* is the data node's node ID. The two instances of *`#`* each represent a number (not necessarily the same number); the number following `D` is in the range 8-39 inclusive; the range of the number following `S` varies according to the value of the `NoOfFragmentLogFiles` configuration parameter, whose default value is 16; thus, the default range of the number in the file name is 0-15 inclusive. For more information, see NDB Cluster Data Node File System Directory.

The name of the file to be read may be followed by one or more of the options listed here:

* `-dump`

  <table summary="Properties for dump"><tbody><tr><th>Command-Line Format</th> <td><code>-dump</code></td> </tr></tbody></table>

  Print dump info.

* `--file-key`, `-K`

  <table summary="Properties for file-key"><tbody><tr><th>Command-Line Format</th> <td><code>--file-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>

  Supply file decryption key using `stdin`, `tty`, or a `my.cnf` file.

* `--file-key-from-stdin`

  <table summary="Properties for file-key-from-stdin"><tbody><tr><th>Command-Line Format</th> <td><code>--file-key-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>

  Supply file decryption key using `stdin`.

* <table summary="Properties for filedescriptors"><tbody><tr><th>Command-Line Format</th> <td><code>-filedescriptors</code></td> </tr></tbody></table>

  `-filedescriptors`: Print file descriptors only.

* <table summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  `--help`: Print usage information.

* `-lap`

  <table summary="Properties for lap"><tbody><tr><th>Command-Line Format</th> <td><code>-lap</code></td> </tr></tbody></table>

  Provide lap info, with max GCI started and completed.

* <table summary="Properties for mbyte"><tbody><tr><th>Command-Line Format</th> <td><code>-mbyte #</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>15</code></td> </tr></tbody></table>

  [`-mbyte
  #`](mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_mbyte): Starting megabyte.

  *`#`* is an integer in the range 0 to 15, inclusive.

* <table summary="Properties for mbyteheaders"><tbody><tr><th>Command-Line Format</th> <td><code>-mbyteheaders</code></td> </tr></tbody></table>

  `-mbyteheaders`: Show only the first page header of every megabyte in the file.

* <table summary="Properties for noprint"><tbody><tr><th>Command-Line Format</th> <td><code>-noprint</code></td> </tr></tbody></table>

  `-noprint`: Do not print the contents of the log file.

* <table summary="Properties for dump"><tbody><tr><th>Command-Line Format</th> <td><code>-dump</code></td> </tr></tbody></table>0

  `-nocheck`: Do not check the log file for errors.

* <table summary="Properties for dump"><tbody><tr><th>Command-Line Format</th> <td><code>-dump</code></td> </tr></tbody></table>1

  [`-page
  #`](mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_page): Start at this page.

  *`#`* is an integer in the range 0 to 31, inclusive.

* <table summary="Properties for dump"><tbody><tr><th>Command-Line Format</th> <td><code>-dump</code></td> </tr></tbody></table>2

  `-pageheaders`: Show page headers only.

* <table summary="Properties for dump"><tbody><tr><th>Command-Line Format</th> <td><code>-dump</code></td> </tr></tbody></table>3

  [`-pageindex
  #`](mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_pageindex): Start at this page index.

  *`#`* is an integer between 12 and 8191, inclusive.

* `-twiddle`

  <table summary="Properties for dump"><tbody><tr><th>Command-Line Format</th> <td><code>-dump</code></td> </tr></tbody></table>4

  Bit-shifted dump.

Like **ndb_print_backup_file** and **ndb_print_schema_file** (and unlike most of the `NDB` utilities that are intended to be run on a management server host or to connect to a management server) **ndb_redo_log_reader** must be run on a cluster data node, since it accesses the data node file system directly. Because it does not make use of the management server, this utility can be used when the management server is not running, and even when the cluster has been completely shut down.
