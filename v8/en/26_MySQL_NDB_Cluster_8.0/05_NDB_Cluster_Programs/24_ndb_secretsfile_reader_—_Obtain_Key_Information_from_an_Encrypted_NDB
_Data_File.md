### 25.5.24 ndb\_secretsfile\_reader — Obtain Key Information from an Encrypted NDB Data File

[**ndb\_secretsfile\_reader**](mysql-cluster-programs-ndb-secretsfile-reader.html "25.5.24 ndb_secretsfile_reader — Obtain Key Information from an Encrypted NDB Data File") gets the encryption
key from an `NDB` encryption secrets file,
given the password.

#### Usage

```
ndb_secretsfile_reader options file
```

The *`options`* must include one of
[`--filesystem-password`](mysql-cluster-programs-ndb-secretsfile-reader.html#option_ndb_secretsfile_reader_filesystem-password)
or
[`--filesystem-password-from-stdin`](mysql-cluster-programs-ndb-secretsfile-reader.html#option_ndb_secretsfile_reader_filesystem-password-from-stdin),
and the encryption password must be supplied, as shown here:

```
> ndb_secretsfile_reader --filesystem-password=54kl14 ndb_5_fs/D1/NDBCNTR/S0.sysfile
ndb_secretsfile_reader: [Warning] Using a password on the command line interface can be insecure.
cac256e18b2ddf6b5ef82d99a72f18e864b78453cc7fa40bfaf0c40b91122d18
```

These and other options that can be used with
[**ndb\_secretsfile\_reader**](mysql-cluster-programs-ndb-secretsfile-reader.html "25.5.24 ndb_secretsfile_reader — Obtain Key Information from an Encrypted NDB Data File") are shown in the
following table. Additional descriptions follow the table.

**Table 25.45 Command-line options used with the program ndb\_secretsfile\_reader**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr>
<th scope="col">Format</th>
<th scope="col">Description</th>
<th scope="col">Added, Deprecated, or Removed</th>
</tr></thead><tbody><tr>
<th scope="row"><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-secretsfile-reader.html#option_ndb_secretsfile_reader_defaults-extra-file">--defaults-extra-file=path</a>
</code>
</p></th>
<td>Read given file after global files are read</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-secretsfile-reader.html#option_ndb_secretsfile_reader_defaults-file">--defaults-file=path</a>
</code>
</p></th>
<td>Read default options from given file only</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-secretsfile-reader.html#option_ndb_secretsfile_reader_defaults-group-suffix">--defaults-group-suffix=string</a>
</code>
</p></th>
<td>Also read groups with concat(group, suffix)</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-secretsfile-reader.html#option_ndb_secretsfile_reader_filesystem-password">--filesystem-password=password</a>
</code>
</p></th>
<td>Password for node file system encryption; can be passed from stdin, tty,
              or my.cnf file</td>
<td><p>
                ADDED: 8.0.31
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-secretsfile-reader.html#option_ndb_secretsfile_reader_filesystem-password-from-stdin">--filesystem-password-from-stdin={TRUE|FALSE}</a>
</code>
</p></th>
<td>Get encryption password from stdin</td>
<td><p>
                ADDED: 8.0.31
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option"><a class="link" href="mysql-cluster-programs-ndb-secretsfile-reader.html#option_ndb_secretsfile_reader_help">--help</a></code>,
              </p><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-secretsfile-reader.html#option_ndb_secretsfile_reader_help">-?</a>
</code>
</p></th>
<td>Display help text and exit</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-secretsfile-reader.html#option_ndb_secretsfile_reader_login-path">--login-path=path</a>
</code>
</p></th>
<td>Read given path from login file</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-secretsfile-reader.html#option_ndb_secretsfile_reader_no-defaults">--no-defaults</a>
</code>
</p></th>
<td>Do not read default options from any option file other than login file</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-secretsfile-reader.html#option_ndb_secretsfile_reader_print-defaults">--print-defaults</a>
</code>
</p></th>
<td>Print program argument list and exit</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option"><a class="link" href="mysql-cluster-programs-ndb-secretsfile-reader.html#option_ndb_secretsfile_reader_usage">--usage</a></code>,
              </p><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-secretsfile-reader.html#option_ndb_secretsfile_reader_usage">-?</a>
</code>
</p></th>
<td>Display help text and exit; same as --help</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option"><a class="link" href="mysql-cluster-programs-ndb-secretsfile-reader.html#option_ndb_secretsfile_reader_version">--version</a></code>,
              </p><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-secretsfile-reader.html#option_ndb_secretsfile_reader_version">-V</a>
</code>
</p></th>
<td>Display version information and exit</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody></table>

* [`--defaults-extra-file`](mysql-cluster-programs-ndb-secretsfile-reader.html#option_ndb_secretsfile_reader_defaults-extra-file)

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--defaults-extra-file=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  Read given file after global files are read.

* [`--defaults-file`](mysql-cluster-programs-ndb-secretsfile-reader.html#option_ndb_secretsfile_reader_defaults-file)

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--defaults-file=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  Read default options from given file only.

* [`--defaults-group-suffix`](mysql-cluster-programs-ndb-secretsfile-reader.html#option_ndb_secretsfile_reader_defaults-group-suffix)

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--defaults-group-suffix=string</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  Also read groups with concat(group, suffix).

* [`--filesystem-password`](mysql-cluster-programs-ndb-secretsfile-reader.html#option_ndb_secretsfile_reader_filesystem-password)

  <table frame="box" rules="all" summary="Properties for filesystem-password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--filesystem-password=password</code></td>
</tr><tr><th>Introduced</th>
<td>8.0.31</td>
</tr></tbody></table>

  Pass the filesystem encryption and decryption password to
  [**ndb\_secretsfile\_reader**](mysql-cluster-programs-ndb-secretsfile-reader.html "25.5.24 ndb_secretsfile_reader — Obtain Key Information from an Encrypted NDB Data File") using
  `stdin`, `tty`, or the
  `my.cnf` file.

* [`--filesystem-password-from-stdin`](mysql-cluster-programs-ndb-secretsfile-reader.html#option_ndb_secretsfile_reader_filesystem-password-from-stdin)

  <table frame="box" rules="all" summary="Properties for filesystem-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--filesystem-password-from-stdin={TRUE|FALSE}</code></td>
</tr><tr><th>Introduced</th>
<td>8.0.31</td>
</tr></tbody></table>

  Pass the filesystem encryption and decryption password to
  [**ndb\_secretsfile\_reader**](mysql-cluster-programs-ndb-secretsfile-reader.html "25.5.24 ndb_secretsfile_reader — Obtain Key Information from an Encrypted NDB Data File") from
  `stdin` (only).

* [`--help`](mysql-cluster-programs-ndb-secretsfile-reader.html#option_ndb_secretsfile_reader_help)

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>

  Display help text and exit.

* [`--login-path`](mysql-cluster-programs-ndb-secretsfile-reader.html#option_ndb_secretsfile_reader_login-path)

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--login-path=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  Read given path from login file.

* [`--no-defaults`](mysql-cluster-programs-ndb-secretsfile-reader.html#option_ndb_secretsfile_reader_no-defaults)

  <table frame="box" rules="all" summary="Properties for no-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--no-defaults</code></td>
</tr></tbody></table>

  Do not read default options from any option file other than
  login file.

* [`--print-defaults`](mysql-cluster-programs-ndb-secretsfile-reader.html#option_ndb_secretsfile_reader_print-defaults)

  <table frame="box" rules="all" summary="Properties for print-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--print-defaults</code></td>
</tr></tbody></table>

  Print program argument list and exit.

* [`--usage`](mysql-cluster-programs-ndb-secretsfile-reader.html#option_ndb_secretsfile_reader_usage)

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--defaults-extra-file=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>0

  Display help text and exit; same as --help.

* [`--version`](mysql-cluster-programs-ndb-secretsfile-reader.html#option_ndb_secretsfile_reader_version)

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--defaults-extra-file=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>1

  Display version information and exit.

[**ndb\_secretsfile\_reader**](mysql-cluster-programs-ndb-secretsfile-reader.html "25.5.24 ndb_secretsfile_reader — Obtain Key Information from an Encrypted NDB Data File") was added in NDB
8.0.31.