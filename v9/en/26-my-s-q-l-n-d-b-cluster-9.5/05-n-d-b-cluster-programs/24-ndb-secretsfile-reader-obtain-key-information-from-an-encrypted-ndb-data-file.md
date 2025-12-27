### 25.5.24 ndb\_secretsfile\_reader — Obtain Key Information from an Encrypted NDB Data File

**ndb\_secretsfile\_reader** gets the encryption key from an `NDB` encryption secrets file, given the password.

#### Usage

```
ndb_secretsfile_reader options file
```

The *`options`* must include one of `--filesystem-password` or `--filesystem-password-from-stdin`, and the encryption password must be supplied, as shown here:

```
> ndb_secretsfile_reader --filesystem-password=54kl14 ndb_5_fs/D1/NDBCNTR/S0.sysfile
ndb_secretsfile_reader: [Warning] Using a password on the command line interface can be insecure.
cac256e18b2ddf6b5ef82d99a72f18e864b78453cc7fa40bfaf0c40b91122d18
```

These and other options that can be used with **ndb\_secretsfile\_reader** are shown in the following table. Additional descriptions follow the table.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  Read given file after global files are read.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  Read default options from given file only.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  Also read groups with concat(group, suffix).

* `--filesystem-password`

  <table frame="box" rules="all" summary="Properties for filesystem-password"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--filesystem-password=password</code></td> </tr></tbody></table>

  Pass the filesystem encryption and decryption password to **ndb\_secretsfile\_reader** using `stdin`, `tty`, or the `my.cnf` file.

* `--filesystem-password-from-stdin`

  <table frame="box" rules="all" summary="Properties for filesystem-password-from-stdin"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--filesystem-password-from-stdin={TRUE|FALSE}</code></td> </tr></tbody></table>

  Pass the filesystem encryption and decryption password to **ndb\_secretsfile\_reader** from `stdin` (only).

* `--help`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>

  Display help text and exit.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--login-path=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  Read given path from login file.

* `--no-login-paths`

  <table frame="box" rules="all" summary="Properties for no-login-paths"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--no-login-paths</code></td> </tr></tbody></table>

  Skips reading options from the login path file.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for no-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--no-defaults</code></td> </tr></tbody></table>

  Do not read default options from any option file other than login file.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for print-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--print-defaults</code></td> </tr></tbody></table>

  Print program argument list and exit.

* `--usage`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>0

  Display help text and exit; same as --help.

* `--version`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>1

  Display version information and exit.
