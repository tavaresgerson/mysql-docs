### 25.5.16 ndb_perror — Obtain NDB Error Message Information

**ndb_perror** shows information about an NDB error, given its error code. This includes the error message, the type of error, and whether the error is permanent or temporary. This is intended as a drop-in replacement for **perror** `--ndb`, which is no longer supported.

#### Usage

```
ndb_perror [options] error_code
```

**ndb_perror** does not need to access a running NDB Cluster, or any nodes (including SQL nodes). To view information about a given NDB error, invoke the program, using the error code as an argument, like this:

```
$> ndb_perror 323
NDB error code 323: Invalid nodegroup id, nodegroup already existing: Permanent error: Application error
```

To display only the error message, invoke **ndb_perror** with the `--silent` option (short form `-s`), as shown here:

```
$> ndb_perror -s 323
Invalid nodegroup id, nodegroup already existing: Permanent error: Application error
```

Like **perror**, **ndb_perror** accepts multiple error codes:

```
$> ndb_perror 321 1001
NDB error code 321: Invalid nodegroup id: Permanent error: Application error
NDB error code 1001: Illegal connect string
```

Additional program options for **ndb_perror** are described later in this section.

**ndb_perror** replaces **perror** `--ndb`, which is no longer supported by NDB Cluster. To make substitution easier in scripts and other applications that might depend on **perror** for obtaining NDB error information, **ndb_perror** supports its own “dummy” `--ndb` option, which does nothing.

The following table includes all options that are specific to the NDB Cluster program **ndb_perror**. Additional descriptions follow the table.

**Table 25.38 Command-line options used with the program ndb_perror**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--help</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --login-path=path </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --ndb </code> </p></th> <td>For compatibility with applications depending on old versions of perror; does nothing</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --no-defaults </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code class="option"> --print-defaults </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--silent</code>, </p><p> <code class="option"> -s </code> </p></th> <td>Show error message only</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--version</code>, </p><p> <code class="option"> -V </code> </p></th> <td>Print program version information and exit</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th scope="row"><p> <code>--verbose</code>, </p><p> <code class="option"> -v </code> </p></th> <td>Verbose output; disable with --silent</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody></table>

#### Additional Options

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read given file after global files are read.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read default options from given file only.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Also read groups with concat(group, suffix).

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display program help text and exit.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read given path from login file.

* `--ndb`

  <table frame="box" rules="all" summary="Properties for ndb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb</code></td> </tr></tbody></table>

  For compatibility with applications depending on old versions of **perror** that use that program's `--ndb` option. The option when used with **ndb_perror** does nothing, and is ignored by it.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for no-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--no-defaults</code></td> </tr></tbody></table>

  Do not read default options from any option file other than login file.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for print-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--print-defaults</code></td> </tr></tbody></table>

  Print program argument list and exit.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Properties for silent"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--silent</code></td> </tr></tbody></table>

  Show error message only.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>0

  Print program version information and exit.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>1

  Verbose output; disable with `--silent`.