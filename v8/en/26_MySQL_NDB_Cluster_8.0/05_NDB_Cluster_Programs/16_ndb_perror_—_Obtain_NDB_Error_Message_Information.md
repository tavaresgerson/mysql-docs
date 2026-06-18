### 25.5.16 ndb\_perror — Obtain NDB Error Message Information

[**ndb\_perror**](mysql-cluster-programs-ndb-perror.html "25.5.16 ndb_perror — Obtain NDB Error Message Information") shows information about an NDB
error, given its error code. This includes the error message,
the type of error, and whether the error is permanent or
temporary. This is intended as a drop-in replacement for
[**perror**](perror.html "6.8.2 perror — Display MySQL Error Message Information") [`--ndb`](perror.html#option_perror_ndb),
which is no longer supported.

#### Usage

```
ndb_perror [options] error_code
```

[**ndb\_perror**](mysql-cluster-programs-ndb-perror.html "25.5.16 ndb_perror — Obtain NDB Error Message Information") does not need to access a running
NDB Cluster, or any nodes (including SQL nodes). To view
information about a given NDB error, invoke the program, using
the error code as an argument, like this:

```
$> ndb_perror 323
NDB error code 323: Invalid nodegroup id, nodegroup already existing: Permanent error: Application error
```

To display only the error message, invoke
[**ndb\_perror**](mysql-cluster-programs-ndb-perror.html "25.5.16 ndb_perror — Obtain NDB Error Message Information") with the
[`--silent`](mysql-cluster-programs-ndb-perror.html#option_ndb_perror_silent) option (short form
`-s`), as shown here:

```
$> ndb_perror -s 323
Invalid nodegroup id, nodegroup already existing: Permanent error: Application error
```

Like [**perror**](perror.html "6.8.2 perror — Display MySQL Error Message Information"), [**ndb\_perror**](mysql-cluster-programs-ndb-perror.html "25.5.16 ndb_perror — Obtain NDB Error Message Information")
accepts multiple error codes:

```
$> ndb_perror 321 1001
NDB error code 321: Invalid nodegroup id: Permanent error: Application error
NDB error code 1001: Illegal connect string
```

Additional program options for [**ndb\_perror**](mysql-cluster-programs-ndb-perror.html "25.5.16 ndb_perror — Obtain NDB Error Message Information") are
described later in this section.

[**ndb\_perror**](mysql-cluster-programs-ndb-perror.html "25.5.16 ndb_perror — Obtain NDB Error Message Information") replaces [**perror**](perror.html "6.8.2 perror — Display MySQL Error Message Information")
`--ndb`, which is no longer supported by NDB
Cluster. To make substitution easier in scripts and other
applications that might depend on [**perror**](perror.html "6.8.2 perror — Display MySQL Error Message Information") for
obtaining NDB error information, [**ndb\_perror**](mysql-cluster-programs-ndb-perror.html "25.5.16 ndb_perror — Obtain NDB Error Message Information")
supports its own “dummy”
[`--ndb`](mysql-cluster-programs-ndb-perror.html#option_ndb_perror_ndb) option, which does
nothing.

The following table includes all options that are specific to
the NDB Cluster program [**ndb\_perror**](mysql-cluster-programs-ndb-perror.html "25.5.16 ndb_perror — Obtain NDB Error Message Information").
Additional descriptions follow the table.

**Table 25.38 Command-line options used with the program ndb\_perror**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr>
<th scope="col">Format</th>
<th scope="col">Description</th>
<th scope="col">Added, Deprecated, or Removed</th>
</tr></thead><tbody><tr>
<th scope="row"><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_defaults-extra-file">--defaults-extra-file=path</a>
</code>
</p></th>
<td>Read given file after global files are read</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_defaults-file">--defaults-file=path</a>
</code>
</p></th>
<td>Read default options from given file only</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_defaults-group-suffix">--defaults-group-suffix=string</a>
</code>
</p></th>
<td>Also read groups with concat(group, suffix)</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option"><a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_help">--help</a></code>,
              </p><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_help">-?</a>
</code>
</p></th>
<td>Display help text</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_login-path">--login-path=path</a>
</code>
</p></th>
<td>Read given path from login file</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_ndb">--ndb</a>
</code>
</p></th>
<td>For compatibility with applications depending on old versions of perror;
              does nothing</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_no-defaults">--no-defaults</a>
</code>
</p></th>
<td>Do not read default options from any option file other than login file</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_print-defaults">--print-defaults</a>
</code>
</p></th>
<td>Print program argument list and exit</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option"><a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_silent">--silent</a></code>,
              </p><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_silent">-s</a>
</code>
</p></th>
<td>Show error message only</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option"><a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_version">--version</a></code>,
              </p><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_version">-V</a>
</code>
</p></th>
<td>Print program version information and exit</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody><tbody><tr>
<th scope="row"><p>
<code class="option"><a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_verbose">--verbose</a></code>,
              </p><p>
<code class="option">
<a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_verbose">-v</a>
</code>
</p></th>
<td>Verbose output; disable with --silent</td>
<td><p>
                (Supported in all NDB releases based on MySQL 8.0)
              </p></td>
</tr></tbody></table>

#### Additional Options

* [`--defaults-extra-file`](mysql-cluster-programs-ndb-perror.html#option_ndb_perror_defaults-extra-file)

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--defaults-extra-file=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  Read given file after global files are read.

* [`--defaults-file`](mysql-cluster-programs-ndb-perror.html#option_ndb_perror_defaults-file)

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--defaults-file=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  Read default options from given file only.

* [`--defaults-group-suffix`](mysql-cluster-programs-ndb-perror.html#option_ndb_perror_defaults-group-suffix)

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--defaults-group-suffix=string</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  Also read groups with concat(group, suffix).

* [`--help`](mysql-cluster-programs-ndb-perror.html#option_ndb_perror_help),
  `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>

  Display program help text and exit.

* [`--login-path`](mysql-cluster-programs-ndb-perror.html#option_ndb_perror_login-path)

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--login-path=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  Read given path from login file.

* [`--ndb`](mysql-cluster-programs-ndb-perror.html#option_ndb_perror_ndb)

  <table frame="box" rules="all" summary="Properties for ndb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--ndb</code></td>
</tr></tbody></table>

  For compatibility with applications depending on old
  versions of [**perror**](perror.html "6.8.2 perror — Display MySQL Error Message Information") that use that
  program's [`--ndb`](perror.html#option_perror_ndb) option.
  The option when used with [**ndb\_perror**](mysql-cluster-programs-ndb-perror.html "25.5.16 ndb_perror — Obtain NDB Error Message Information") does
  nothing, and is ignored by it.

* [`--no-defaults`](mysql-cluster-programs-ndb-perror.html#option_ndb_perror_no-defaults)

  <table frame="box" rules="all" summary="Properties for no-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--no-defaults</code></td>
</tr></tbody></table>

  Do not read default options from any option file other than
  login file.

* [`--print-defaults`](mysql-cluster-programs-ndb-perror.html#option_ndb_perror_print-defaults)

  <table frame="box" rules="all" summary="Properties for print-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--print-defaults</code></td>
</tr></tbody></table>

  Print program argument list and exit.

* [`--silent`](mysql-cluster-programs-ndb-perror.html#option_ndb_perror_silent),
  `-s`

  <table frame="box" rules="all" summary="Properties for silent"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--silent</code></td>
</tr></tbody></table>

  Show error message only.

* [`--version`](mysql-cluster-programs-ndb-perror.html#option_ndb_perror_version),
  `-V`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--defaults-extra-file=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>0

  Print program version information and exit.

* [`--verbose`](mysql-cluster-programs-ndb-perror.html#option_ndb_perror_verbose),
  `-v`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--defaults-extra-file=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>1

  Verbose output; disable with
  [`--silent`](mysql-cluster-programs-ndb-perror.html#option_ndb_perror_silent).