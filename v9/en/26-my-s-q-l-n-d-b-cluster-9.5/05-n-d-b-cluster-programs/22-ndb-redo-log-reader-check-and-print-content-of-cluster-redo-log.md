### 25.5.22 ndb_redo_log_reader — Check and Print Content of Cluster Redo Log

Reads a redo log file, checking it for errors, printing its contents in a human-readable format, or both. **ndb_redo_log_reader** is intended for use primarily by NDB Cluster developers and Support personnel in debugging and diagnosing problems.

This utility remains under development, and its syntax and behavior are subject to change in future NDB Cluster releases.

The C++ source files for **ndb_redo_log_reader** can be found in the directory `/storage/ndb/src/kernel/blocks/dblqh/redoLogReader`.

Options that can be used with **ndb_redo_log_reader** are shown in the following table. Additional descriptions follow the table.

#### Usage

```
ndb_redo_log_reader file_name [options]
```

*`file_name`* is the name of a cluster redo log file. redo log files are located in the numbered directories under the data node's data directory (`DataDir`); the path under this directory to the redo log files matches the pattern `ndb_nodeid_fs/D#/DBLQH/S#.FragLog`. *`nodeid`* is the data node's node ID. The two instances of *`#`* each represent a number (not necessarily the same number); the number following `D` is in the range 8-39 inclusive; the range of the number following `S` varies according to the value of the `NoOfFragmentLogFiles` configuration parameter, whose default value is 16; thus, the default range of the number in the file name is 0-15 inclusive. For more information, see NDB Cluster Data Node File System Directory.

The name of the file to be read may be followed by one or more of the options listed here:

* `-dump`

  <table frame="box" rules="all" summary="Properties for dump"><tbody><tr><th>Command-Line Format</th> <td><code>-dump</code></td> </tr></tbody></table>

  Print dump info.

* `--file-key`, `-K`

  <table frame="box" rules="all" summary="Properties for file-key"><tbody><tr><th>Command-Line Format</th> <td><code>--file-key=key</code></td> </tr></tbody></table>

  Supply file decryption key using `stdin`, `tty`, or a `my.cnf` file.

* `--file-key-from-stdin`

  <table frame="box" rules="all" summary="Properties for file-key-from-stdin"><tbody><tr><th>Command-Line Format</th> <td><code>--file-key-from-stdin</code></td> </tr></tbody></table>

  Supply file decryption key using `stdin`.

* <table frame="box" rules="all" summary="Properties for filedescriptors"><tbody><tr><th>Command-Line Format</th> <td><code>-filedescriptors</code></td> </tr></tbody></table>

  `-filedescriptors`: Print file descriptors only.

* <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  `--help`: Print usage information.

* `-lap`

  <table frame="box" rules="all" summary="Properties for lap"><tbody><tr><th>Command-Line Format</th> <td><code>-lap</code></td> </tr></tbody></table>

  Provide lap info, with max GCI started and completed.

* <table frame="box" rules="all" summary="Properties for mbyte"><tbody><tr><th>Command-Line Format</th> <td><code>-mbyte #</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>15</code></td> </tr></tbody></table>

  [`-mbyte
  #`](mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_mbyte): Starting megabyte.

  *`#`* is an integer in the range 0 to 15, inclusive.

* <table frame="box" rules="all" summary="Properties for mbyteheaders"><tbody><tr><th>Command-Line Format</th> <td><code>-mbyteheaders</code></td> </tr></tbody></table>

  `-mbyteheaders`: Show only the first page header of every megabyte in the file.

* <table frame="box" rules="all" summary="Properties for noprint"><tbody><tr><th>Command-Line Format</th> <td><code>-noprint</code></td> </tr></tbody></table>

  `-noprint`: Do not print the contents of the log file.

* <table frame="box" rules="all" summary="Properties for nocheck"><tbody><tr><th>Command-Line Format</th> <td><code>-nocheck</code></td> </tr></tbody></table>

  `-nocheck`: Do not check the log file for errors.

* <table frame="box" rules="all" summary="Properties for file-key"><tbody><tr><th>Command-Line Format</th> <td><code>--file-key=key</code></td> </tr></tbody></table>

  [`-page
  #`](mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_page): Start at this page.

  *`#`* is an integer in the range 0 to 31, inclusive.

* <table frame="box" rules="all" summary="Properties for file-key"><tbody><tr><th>Command-Line Format</th> <td><code>--file-key=key</code></td> </tr></tbody></table>

  `-pageheaders`: Show page headers only.

* <table frame="box" rules="all" summary="Properties for file-key"><tbody><tr><th>Command-Line Format</th> <td><code>--file-key=key</code></td> </tr></tbody></table>

  [`-pageindex
  #`](mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_pageindex): Start at this page index.

  *`#`* is an integer between 12 and 8191, inclusive.

* `-twiddle`

  <table frame="box" rules="all" summary="Properties for file-key"><tbody><tr><th>Command-Line Format</th> <td><code>--file-key=key</code></td> </tr></tbody></table>

  Bit-shifted dump.

Like **ndb_print_backup_file** and **ndb_print_schema_file** (and unlike most of the `NDB` utilities that are intended to be run on a management server host or to connect to a management server) **ndb_redo_log_reader** must be run on a cluster data node, since it accesses the data node file system directly. Because it does not make use of the management server, this utility can be used when the management server is not running, and even when the cluster has been completely shut down.
