### 25.5.18 ndb\_print\_file — Print NDB Disk Data File Contents

**ndb\_print\_file** obtains information from an NDB Cluster Disk Data file.

#### Usage

```
ndb_print_file [-v] [-q] file_name+
```

*`file_name`* is the name of an NDB Cluster Disk Data file. Multiple filenames are accepted, separated by spaces.

Like **ndb\_print\_schema\_file** and **ndb\_print\_sys\_file** (and unlike most of the other `NDB` utilities that are intended to be run on a management server host or to connect to a management server) **ndb\_print\_file** must be run on an NDB Cluster data node, since it accesses the data node file system directly. Because it does not make use of the management server, this utility can be used when the management server is not running, and even when the cluster has been completely shut down.

#### Options

**ndb\_print\_file** supports the following options:

* `--file-key`, `-K`

  <table frame="box" rules="all" summary="Properties for file-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--file-key=hex_data</code></td> </tr></tbody></table>

  Supply file system encryption or decryption key from `stdin`, `tty`, or a `my.cnf` file.

* `--file-key-from-stdin`

  <table frame="box" rules="all" summary="Properties for file-key-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--file-key-from-stdin</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">FALSE</code></td> </tr><tr><th>Valid Values</th> <td><code class="literal">TRUE</code></td> </tr></tbody></table>

  Supply file system encryption or decryption key from `stdin`.

* `--help`, `-h`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>

  Print help message and exit.

* `--quiet`, `-q`

  <table frame="box" rules="all" summary="Properties for quiet"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--quiet</code></td> </tr></tbody></table>

  Suppress output (quiet mode).

* `--usage`, `-?`

  <table frame="box" rules="all" summary="Properties for usage"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--usage</code></td> </tr></tbody></table>

  Print help message and exit.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for verbose"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--verbose</code></td> </tr></tbody></table>

  Make output verbose.

* `--version`, `-v`

  <table frame="box" rules="all" summary="Properties for version"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--version</code></td> </tr></tbody></table>

  Print version information and exit.

For more information, see Section 25.6.11, “NDB Cluster Disk Data Tables”.
