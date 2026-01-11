### 25.5.18 ndb_print_file — Print NDB Disk Data File Contents

**ndb_print_file** obtains information from an NDB Cluster Disk Data file.

#### Usage

```
ndb_print_file [-v] [-q] file_name+
```

*`file_name`* is the name of an NDB Cluster Disk Data file. Multiple filenames are accepted, separated by spaces.

Like **ndb_print_schema_file** and **ndb_print_sys_file** (and unlike most of the other `NDB` utilities that are intended to be run on a management server host or to connect to a management server) **ndb_print_file** must be run on an NDB Cluster data node, since it accesses the data node file system directly. Because it does not make use of the management server, this utility can be used when the management server is not running, and even when the cluster has been completely shut down.

#### Options

**Table 25.40 Command-line options used with the program ndb_print_file**

<table frame="box" rules="all"><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code>--file-key=hex_data</code>, </p><p> <code> -K hex_data </code> </p></th> <td>Supply encryption key using stdin, tty, or my.cnf file</td> <td><p> ADDED: NDB 8.0.31 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --file-key-from-stdin </code> </p></th> <td>Supply encryption key using stdin</td> <td><p> ADDED: NDB 8.0.31 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code> -? </code> </p></th> <td>Display help text and exit; same as --usage</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--quiet</code>, </p><p> <code> -q </code> </p></th> <td>Reduce verbosity of output</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code> -? </code> </p></th> <td>Display help text and exit; same as --help</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--verbose</code>, </p><p> <code> -v </code> </p></th> <td>Increase verbosity of output</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code> -V </code> </p></th> <td>Display version information and exit</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody></table>

**ndb_print_file** supports the following options:

* `--file-key`, `-K`

  <table summary="Properties for file-key"><tbody><tr><th>Command-Line Format</th> <td><code>--file-key=hex_data</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>

  Supply file system encryption or decryption key from `stdin`, `tty`, or a `my.cnf` file.

* `--file-key-from-stdin`

  <table summary="Properties for file-key-from-stdin"><tbody><tr><th>Command-Line Format</th> <td><code>--file-key-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>FALSE</code></td> </tr><tr><th>Valid Values</th> <td><code>TRUE</code></td> </tr></tbody></table>

  Supply file system encryption or decryption key from `stdin`.

* `--help`, `-h`, `-?`

  <table summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Print help message and exit.

* `--quiet`, `-q`

  <table summary="Properties for quiet"><tbody><tr><th>Command-Line Format</th> <td><code>--quiet</code></td> </tr></tbody></table>

  Suppress output (quiet mode).

* `--usage`, `-?`

  <table summary="Properties for usage"><tbody><tr><th>Command-Line Format</th> <td><code>--usage</code></td> </tr></tbody></table>

  Print help message and exit.

* `--verbose`, `-v`

  <table summary="Properties for verbose"><tbody><tr><th>Command-Line Format</th> <td><code>--verbose</code></td> </tr></tbody></table>

  Make output verbose.

* `--version`, `-v`

  <table summary="Properties for version"><tbody><tr><th>Command-Line Format</th> <td><code>--version</code></td> </tr></tbody></table>

  Print version information and exit.

For more information, see Section 25.6.11, “NDB Cluster Disk Data Tables”.
