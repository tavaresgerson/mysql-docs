### 25.5.17 ndb\_print\_backup\_file — Print NDB Backup File Contents

[**ndb\_print\_backup\_file**](mysql-cluster-programs-ndb-print-backup-file.html "25.5.17 ndb_print_backup_file — Print NDB Backup File Contents") obtains diagnostic
information from a cluster backup file.

#### Usage

```
ndb_print_backup_file [-P password] file_name
```

*`file_name`* is the name of a cluster
backup file. This can be any of the files
(`.Data`, `.ctl`, or
`.log` file) found in a cluster backup
directory. These files are found in the data node's backup
directory under the subdirectory
`BACKUP-#`, where
*`#`* is the sequence number for the
backup. For more information about cluster backup files and
their contents, see
[Section 25.6.8.1, “NDB Cluster Backup Concepts”](mysql-cluster-backup-concepts.html "25.6.8.1 NDB Cluster Backup Concepts").

Like [**ndb\_print\_schema\_file**](mysql-cluster-programs-ndb-print-schema-file.html "25.5.20 ndb_print_schema_file — Print NDB Schema File Contents") and
[**ndb\_print\_sys\_file**](mysql-cluster-programs-ndb-print-sys-file.html "25.5.21 ndb_print_sys_file — Print NDB System File Contents") (and unlike most of the
other [`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 9.5") utilities that are
intended to be run on a management server host or to connect to
a management server) [**ndb\_print\_backup\_file**](mysql-cluster-programs-ndb-print-backup-file.html "25.5.17 ndb_print_backup_file — Print NDB Backup File Contents")
must be run on a cluster data node, since it accesses the data
node file system directly. Because it does not make use of the
management server, this utility can be used when the management
server is not running, and even when the cluster has been
completely shut down.

This program can also be used to read undo log files.

#### Options

[**ndb\_print\_backup\_file**](mysql-cluster-programs-ndb-print-backup-file.html "25.5.17 ndb_print_backup_file — Print NDB Backup File Contents") supports the options
described in the following list.

* [`--backup-key`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_backup-key),
  `-K`

  <table frame="box" rules="all" summary="Properties for backup-key"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--backup-key=key</code></td>
</tr></tbody></table>

  Specify the key needed to decrypt an encrypted backup.

* [`--backup-key-from-stdin`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_backup-key-from-stdin)

  <table frame="box" rules="all" summary="Properties for backup-key-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--backup-key-from-stdin</code></td>
</tr></tbody></table>

  Allow input of the decryption key from standard input,
  similar to entering a password after invoking
  [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client")
  [`--password`](mysql-command-options.html#option_mysql_password) with no password
  supplied.

* [`--backup-password`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_backup-password)

  <table frame="box" rules="all" summary="Properties for backup-password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--backup-password=password</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  Specify the password needed to decrypt an encrypted backup.

* [`--backup-password-from-stdin`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_backup-password-from-stdin)

  <table frame="box" rules="all" summary="Properties for backup-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--backup-password-from-stdin</code></td>
</tr></tbody></table>

  Allow input of the password from standard input, similar to
  entering a password after invoking [**mysql**](mysql.html "6.5.1 mysql — The MySQL Command-Line Client")
  [`--password`](mysql-command-options.html#option_mysql_password) with no password
  supplied.

* [`--control-directory-number`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_control-directory-number)

  <table frame="box" rules="all" summary="Properties for control-directory-number"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--control-directory-number=#</code></td>
</tr><tr><th>Type</th>
<td>Integer</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">0</code></td>
</tr></tbody></table>

  Control file directory number. Used together with
  [`--print-restored-rows`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_print-restored-rows).

* [`--defaults-extra-file`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_defaults-extra-file)

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--defaults-extra-file=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  Read given file after global files are read.

* [`--defaults-file`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_defaults-file)

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--defaults-file=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  Read default options from given file only.

* [`--defaults-group-suffix`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_defaults-group-suffix)

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--defaults-group-suffix=string</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  Also read groups with concat(group, suffix).

* [`--fragment-id`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_fragment-id)

  <table frame="box" rules="all" summary="Properties for fragment-id"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--fragment-id=#</code></td>
</tr><tr><th>Type</th>
<td>Integer</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">0</code></td>
</tr></tbody></table>

  Fragment ID. Used together with
  [`--print-restored-rows`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_print-restored-rows).

* [`--help`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_help)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><p class="valid-value"><code class="literal">--help</code></p><p class="valid-value"><code class="literal">--usage</code></p></td>
</tr></tbody></table>

  Print program usage information.

* [`--login-path`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_login-path)

  <table frame="box" rules="all" summary="Properties for backup-key-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--backup-key-from-stdin</code></td>
</tr></tbody></table>0

  Read given path from login file.

* [`--no-login-paths`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_no-login-paths)

  <table frame="box" rules="all" summary="Properties for backup-key-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--backup-key-from-stdin</code></td>
</tr></tbody></table>1

  Skips reading options from the login path file.

* [`--no-defaults`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_no-defaults)

  <table frame="box" rules="all" summary="Properties for backup-key-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--backup-key-from-stdin</code></td>
</tr></tbody></table>2

  Do not read default options from any option file other than
  login file.

* [`--no-print-rows`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_no-print-rows)

  <table frame="box" rules="all" summary="Properties for backup-key-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--backup-key-from-stdin</code></td>
</tr></tbody></table>3

  Do not include rows in output.

* [`--print-defaults`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_print-defaults)

  <table frame="box" rules="all" summary="Properties for backup-key-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--backup-key-from-stdin</code></td>
</tr></tbody></table>4

  Print program argument list and exit.

* [`--print-header-words`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_print-header-words)

  <table frame="box" rules="all" summary="Properties for backup-key-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--backup-key-from-stdin</code></td>
</tr></tbody></table>5

  Include header words in output.

* [`--print-restored-rows`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_print-restored-rows)

  <table frame="box" rules="all" summary="Properties for backup-key-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--backup-key-from-stdin</code></td>
</tr></tbody></table>6

  Include restored rows in output, using the file
  `LCP/c/TtFf.ctl`,
  for which the values are set as follows:

  + *`c`* is the control file number
    set using
    [`--control-directory-number`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_control-directory-number)

  + *`t`* is the table ID set using
    [`--table-id`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_table-id)

  + *`f`* is the fragment ID set
    using
    [`--fragment-id`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_fragment-id)

* [`--print-rows`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_print-rows)

  <table frame="box" rules="all" summary="Properties for backup-key-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--backup-key-from-stdin</code></td>
</tr></tbody></table>7

  Print rows. This option is enabled by default; to disable
  it, use
  [`--no-print-rows`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_no-print-rows).

* [`--print-rows-per-page`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_print-rows-per-page)

  <table frame="box" rules="all" summary="Properties for backup-key-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--backup-key-from-stdin</code></td>
</tr></tbody></table>8

  Print rows per page.

* [`--rowid-file`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_rowid-file)

  <table frame="box" rules="all" summary="Properties for backup-key-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--backup-key-from-stdin</code></td>
</tr></tbody></table>9

  File to check for row ID.

* [`--show-ignored-rows`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_show-ignored-rows)

  <table frame="box" rules="all" summary="Properties for backup-password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--backup-password=password</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>0

  Show ignored rows.

* [`--table-id`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_table-id)

  <table frame="box" rules="all" summary="Properties for backup-password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--backup-password=password</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>1

  Table ID. Used together with
  [`--print-restored-rows`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_print-restored-rows).

* [`--usage`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_usage)

  <table frame="box" rules="all" summary="Properties for backup-password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--backup-password=password</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>2

  Display help text and exit; same as
  [`--help`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_help).

* [`--verbose`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_verbose)

  <table frame="box" rules="all" summary="Properties for backup-password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--backup-password=password</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>3

  Verbosity level of output. A greater value indicates
  increased verbosity.

* [`--version`](mysql-cluster-programs-ndb-print-backup-file.html#option_ndb_print_backup_file_version)

  <table frame="box" rules="all" summary="Properties for backup-password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--backup-password=password</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>4

  Display version information and exit.