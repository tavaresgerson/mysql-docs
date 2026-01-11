### 25.5.17 ndb_print_backup_file — Print NDB Backup File Contents

**ndb_print_backup_file** obtains diagnostic information from a cluster backup file.

**Table 25.39 Command-line options used with the program ndb_print_backup_file**

<table frame="box" rules="all"><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code>--backup-key=key</code>, </p><p> <code> -K password </code> </p></th> <td>Use this password to decrypt file</td> <td><p> ADDED: NDB 8.0.31 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --backup-key-from-stdin </code> </p></th> <td>Get decryption key in a secure fashion from STDIN</td> <td><p> ADDED: NDB 8.0.31 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--backup-password=password</code>, </p><p> <code> -P password </code> </p></th> <td>Use this password to decrypt file</td> <td><p> ADDED: NDB 8.0.22 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --backup-password-from-stdin </code> </p></th> <td>Get decryption password in a secure fashion from STDIN</td> <td><p> ADDED: NDB 8.0.24 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--control-directory-number=#</code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_control-directory-number">-c
                #</a> </code> </p></th> <td>Control directory number</td> <td><p> ADDED: NDB 8.0.24 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-extra-file=path </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-file=path </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-group-suffix=string </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--fragment-id=#</code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_fragment-id">-f
                #</a> </code> </p></th> <td>Fragment ID</td> <td><p> ADDED: NDB 8.0.24 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code>--usage</code>, </p><p> <code>-h</code>, </p><p> <code> -? </code> </p></th> <td>Print usage information</td> <td><p> ADDED: NDB 8.0.24 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --login-path=path </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-defaults </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--no-print-rows</code>, </p><p> <code> -u </code> </p></th> <td>Do not print rows</td> <td><p> ADDED: NDB 8.0.24 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-defaults </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--print-header-words</code>, </p><p> <code> -h </code> </p></th> <td>Print header words</td> <td><p> ADDED: NDB 8.0.24 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-restored-rows </code> </p></th> <td>Print restored rows</td> <td><p> ADDED: NDB 8.0.24 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--print-rows</code>, </p><p> <code> -U </code> </p></th> <td>Print rows. Enabled by default; disable with --no-print-rows</td> <td><p> ADDED: NDB 8.0.24 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-rows-per-page </code> </p></th> <td>Print rows per page</td> <td><p> ADDED: NDB 8.0.24 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--rowid-file=path</code>, </p><p> <code> -n path </code> </p></th> <td>File containing row ID to check for</td> <td><p> ADDED: NDB 8.0.24 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--show-ignored-rows</code>, </p><p> <code> -i </code> </p></th> <td>Show ignored rows</td> <td><p> ADDED: NDB 8.0.24 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--table-id=#</code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_table-id">-t
                #</a> </code> </p></th> <td>Table ID; used with --print-restored rows</td> <td><p> ADDED: NDB 8.0.24 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code> -? </code> </p></th> <td>Display help text and exit; same as --help</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--verbose[=#]</code>, </p><p> <code> -v </code> </p></th> <td>Verbosity level</td> <td><p> ADDED: NDB 8.0.24 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code> -V </code> </p></th> <td>Display version information and exit</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody></table>

#### Usage

```
ndb_print_backup_file [-P password] file_name
```

*`file_name`* is the name of a cluster backup file. This can be any of the files (`.Data`, `.ctl`, or `.log` file) found in a cluster backup directory. These files are found in the data node's backup directory under the subdirectory `BACKUP-#`, where *`#`* is the sequence number for the backup. For more information about cluster backup files and their contents, see Section 25.6.8.1, “NDB Cluster Backup Concepts”.

Like **ndb_print_schema_file** and **ndb_print_sys_file** (and unlike most of the other `NDB` utilities that are intended to be run on a management server host or to connect to a management server) **ndb_print_backup_file** must be run on a cluster data node, since it accesses the data node file system directly. Because it does not make use of the management server, this utility can be used when the management server is not running, and even when the cluster has been completely shut down.

In NDB 8.0, this program can also be used to read undo log files.

#### Options

Prior to NDB 8.0.24, **ndb_print_backup_file** supported only the `-P` option. Beginning with NDB 8.0.24, the program supports a number of options, which are described in the following list.

* `--backup-key`, `-K`

  <table summary="Properties for backup-key"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>

  Specify the key needed to decrypt an encrypted backup.

* `--backup-key-from-stdin`

  <table summary="Properties for backup-key-from-stdin"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>

  Allow input of the decryption key from standard input, similar to entering a password after invoking **mysql** `--password` with no password supplied.

* `--backup-password`

  <table summary="Properties for backup-password"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password=password</code></td> </tr><tr><th>Introduced</th> <td>8.0.22-ndb-8.0.22</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Specify the password needed to decrypt an encrypted backup.

  The long form of this option is available beginning with NDB 8.0.24.

* `--backup-password-from-stdin`

  <table summary="Properties for backup-password-from-stdin"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-password-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr></tbody></table>

  Allow input of the password from standard input, similar to entering a password after invoking **mysql** `--password` with no password supplied.

* `--control-directory-number`

  <table summary="Properties for control-directory-number"><tbody><tr><th>Command-Line Format</th> <td><code>--control-directory-number=#</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr></tbody></table>

  Control file directory number. Used together with `--print-restored-rows`.

* `--defaults-extra-file`

  <table summary="Properties for defaults-extra-file"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read given file after global files are read.

* `--defaults-file`

  <table summary="Properties for defaults-file"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read default options from given file only.

* `--defaults-group-suffix`

  <table summary="Properties for defaults-group-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Also read groups with concat(group, suffix).

* `--fragment-id`

  <table summary="Properties for fragment-id"><tbody><tr><th>Command-Line Format</th> <td><code>--fragment-id=#</code></td> </tr><tr><th>Introduced</th> <td>8.0.24-ndb-8.0.24</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr></tbody></table>

  Fragment ID. Used together with `--print-restored-rows`.

* `--help`

  <table summary="Properties for backup-key"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>0

  Print program usage information.

* `--login-path`

  <table summary="Properties for backup-key"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>1

  Read given path from login file.

* `--no-defaults`

  <table summary="Properties for backup-key"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>2

  Do not read default options from any option file other than login file.

* `--no-print-rows`

  <table summary="Properties for backup-key"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>3

  Do not include rows in output.

* `--print-defaults`

  <table summary="Properties for backup-key"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>4

  Print program argument list and exit.

* `--print-header-words`

  <table summary="Properties for backup-key"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>5

  Include header words in output.

* `--print-restored-rows`

  <table summary="Properties for backup-key"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>6

  Include restored rows in output, using the file `LCP/c/TtFf.ctl`, for which the values are set as follows:

  + *`c`* is the control file number set using `--control-directory-number`

  + *`t`* is the table ID set using `--table-id`

  + *`f`* is the fragment ID set using `--fragment-id`

* `--print-rows`

  <table summary="Properties for backup-key"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>7

  Print rows. This option is enabled by default; to disable it, use `--no-print-rows`.

* `--print-rows-per-page`

  <table summary="Properties for backup-key"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>8

  Print rows per page.

* `--rowid-file`

  <table summary="Properties for backup-key"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key=key</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>9

  File to check for row ID.

* `--show-ignored-rows`

  <table summary="Properties for backup-key-from-stdin"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>0

  Show ignored rows.

* `--table-id`

  <table summary="Properties for backup-key-from-stdin"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>1

  Table ID. Used together with `--print-restored-rows`.

* `--usage`

  <table summary="Properties for backup-key-from-stdin"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>2

  Display help text and exit; same as `--help`.

* `--verbose`

  <table summary="Properties for backup-key-from-stdin"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>3

  Verbosity level of output. A greater value indicates increased verbosity.

* `--version`

  <table summary="Properties for backup-key-from-stdin"><tbody><tr><th>Command-Line Format</th> <td><code>--backup-key-from-stdin</code></td> </tr><tr><th>Introduced</th> <td>8.0.31-ndb-8.0.31</td> </tr></tbody></table>4

  Display version information and exit.
