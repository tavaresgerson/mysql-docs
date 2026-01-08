### 21.5.17 ndb\_perror — Obtain NDB Error Message Information

[**ndb\_perror**](mysql-cluster-programs-ndb-perror.html "21.5.17 ndb_perror — Obtain NDB Error Message Information") shows information about an NDB error, given its error code. This includes the error message, the type of error, and whether the error is permanent or temporary. Added to the MySQL NDB Cluster distribution in NDB 7.6, it is intended as a drop-in replacement for [**perror**](perror.html "4.8.2 perror — Display MySQL Error Message Information") [`--ndb`](perror.html#option_perror_ndb).

#### Usage

```sql
ndb_perror [options] error_code
```

[**ndb\_perror**](mysql-cluster-programs-ndb-perror.html "21.5.17 ndb_perror — Obtain NDB Error Message Information") does not need to access a running NDB Cluster, or any nodes (including SQL nodes). To view information about a given NDB error, invoke the program, using the error code as an argument, like this:

```sql
$> ndb_perror 323
NDB error code 323: Invalid nodegroup id, nodegroup already existing: Permanent error: Application error
```

To display only the error message, invoke [**ndb\_perror**](mysql-cluster-programs-ndb-perror.html "21.5.17 ndb_perror — Obtain NDB Error Message Information") with the [`--silent`](mysql-cluster-programs-ndb-perror.html#option_ndb_perror_silent) option (short form `-s`), as shown here:

```sql
$> ndb_perror -s 323
Invalid nodegroup id, nodegroup already existing: Permanent error: Application error
```

Like [**perror**](perror.html "4.8.2 perror — Display MySQL Error Message Information"), [**ndb\_perror**](mysql-cluster-programs-ndb-perror.html "21.5.17 ndb_perror — Obtain NDB Error Message Information") accepts multiple error codes:

```sql
$> ndb_perror 321 1001
NDB error code 321: Invalid nodegroup id: Permanent error: Application error
NDB error code 1001: Illegal connect string
```

Additional program options for [**ndb\_perror**](mysql-cluster-programs-ndb-perror.html "21.5.17 ndb_perror — Obtain NDB Error Message Information") are described later in this section.

[**ndb\_perror**](mysql-cluster-programs-ndb-perror.html "21.5.17 ndb_perror — Obtain NDB Error Message Information") replaces [**perror**](perror.html "4.8.2 perror — Display MySQL Error Message Information") `--ndb`, which is deprecated in NDB 7.6 and subject to removal in a future release of MySQL NDB Cluster. To make substitution easier in scripts and other applications that might depend on [**perror**](perror.html "4.8.2 perror — Display MySQL Error Message Information") for obtaining NDB error information, [**ndb\_perror**](mysql-cluster-programs-ndb-perror.html "21.5.17 ndb_perror — Obtain NDB Error Message Information") supports its own “dummy” [`--ndb`](mysql-cluster-programs-ndb-perror.html#option_ndb_perror_ndb) option, which does nothing.

The following table includes all options that are specific to the NDB Cluster program [**ndb\_perror**](mysql-cluster-programs-ndb-perror.html "21.5.17 ndb_perror — Obtain NDB Error Message Information"). Additional descriptions follow the table.

**Table 21.36 Command-line options used with the program ndb\_perror**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code class="option"> <a class="ulink" href="/doc/refman/8.0/en/mysql-cluster-programs-ndb-perror.html#option_ndb_perror_defaults-extra-file" target="_top">--defaults-extra-file=path</a> </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="ulink" href="/doc/refman/8.0/en/mysql-cluster-programs-ndb-perror.html#option_ndb_perror_defaults-file" target="_top">--defaults-file=path</a> </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="ulink" href="/doc/refman/8.0/en/mysql-cluster-programs-ndb-perror.html#option_ndb_perror_defaults-group-suffix" target="_top">--defaults-group-suffix=string</a> </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_help">--help</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_help">-?</a> </code> </p></th> <td>Display help text</td> <td><p> ADDED: NDB 7.6.4 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="ulink" href="/doc/refman/8.0/en/mysql-cluster-programs-ndb-perror.html#option_ndb_perror_login-path" target="_top">--login-path=path</a> </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_ndb">--ndb</a> </code> </p></th> <td>For compatibility with applications depending on old versions of perror; does nothing</td> <td><p> ADDED: NDB 7.6.4 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="ulink" href="/doc/refman/8.0/en/mysql-cluster-programs-ndb-perror.html#option_ndb_perror_no-defaults" target="_top">--no-defaults</a> </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> <a class="ulink" href="/doc/refman/8.0/en/mysql-cluster-programs-ndb-perror.html#option_ndb_perror_print-defaults" target="_top">--print-defaults</a> </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_silent">--silent</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_silent">-s</a> </code> </p></th> <td>Show error message only</td> <td><p> ADDED: NDB 7.6.4 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_version">--version</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_version">-V</a> </code> </p></th> <td>Print program version information and exit</td> <td><p> ADDED: NDB 7.6.4 </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_verbose">--verbose</a></code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-perror.html#option_ndb_perror_verbose">-v</a> </code> </p></th> <td>Verbose output; disable with --silent</td> <td><p> ADDED: NDB 7.6.4 </p></td> </tr></tbody></table>

#### Additional Options

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.4</td> </tr></tbody></table>

  Display program help text and exit.

* `--ndb`

  <table frame="box" rules="all" summary="Properties for ndb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.4</td> </tr></tbody></table>

  For compatibility with applications depending on old versions of [**perror**](perror.html "4.8.2 perror — Display MySQL Error Message Information") that use that program's [`--ndb`](perror.html#option_perror_ndb) option. The option when used with [**ndb\_perror**](mysql-cluster-programs-ndb-perror.html "21.5.17 ndb_perror — Obtain NDB Error Message Information") does nothing, and is ignored by it.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Properties for silent"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--silent</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.4</td> </tr></tbody></table>

  Show error message only.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for version"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--version</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.4</td> </tr></tbody></table>

  Print program version information and exit.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for verbose"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--verbose</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.4</td> </tr></tbody></table>

  Verbose output; disable with [`--silent`](mysql-cluster-programs-ndb-perror.html#option_ndb_perror_silent).
