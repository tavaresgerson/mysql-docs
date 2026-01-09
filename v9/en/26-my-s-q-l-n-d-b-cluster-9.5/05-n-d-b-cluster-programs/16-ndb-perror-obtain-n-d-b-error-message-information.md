### 25.5.16 ndb\_perror — Obtain NDB Error Message Information

**ndb\_perror** shows information about an NDB error, given its error code. This includes the error message, the type of error, and whether the error is permanent or temporary. This is intended as a drop-in replacement for **perror** `--ndb`, which is no longer supported.

#### Usage

```
ndb_perror [options] error_code
```

**ndb\_perror** does not need to access a running NDB Cluster, or any nodes (including SQL nodes). To view information about a given NDB error, invoke the program, using the error code as an argument, like this:

```
$> ndb_perror 323
NDB error code 323: Invalid nodegroup id, nodegroup already existing: Permanent error: Application error
```

To display only the error message, invoke **ndb\_perror** with the `--silent` option (short form `-s`), as shown here:

```
$> ndb_perror -s 323
Invalid nodegroup id, nodegroup already existing: Permanent error: Application error
```

Like **perror**, **ndb\_perror** accepts multiple error codes:

```
$> ndb_perror 321 1001
NDB error code 321: Invalid nodegroup id: Permanent error: Application error
NDB error code 1001: Illegal connect string
```

Additional program options for **ndb\_perror** are described later in this section.

**ndb\_perror** replaces **perror** `--ndb`, which is no longer supported by NDB Cluster. To make substitution easier in scripts and other applications that might depend on **perror** for obtaining NDB error information, **ndb\_perror** supports its own “dummy” `--ndb` option, which does nothing.

The following table includes all options that are specific to the NDB Cluster program **ndb\_perror**. Additional descriptions follow the table.

#### Additional Options

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  Read given file after global files are read.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  Read default options from given file only.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  Also read groups with concat(group, suffix).

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr></tbody></table>

  Display program help text and exit.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for login-path"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--login-path=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  Read given path from login file.

* `--no-login-paths`

  <table frame="box" rules="all" summary="Properties for no-login-paths"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--no-login-paths</code></td> </tr></tbody></table>

  Skips reading options from the login path file.

* `--ndb`

  <table frame="box" rules="all" summary="Properties for ndb"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--ndb</code></td> </tr></tbody></table>

  For compatibility with applications depending on old versions of **perror** that use that program's `--ndb` option. The option when used with **ndb\_perror** does nothing, and is ignored by it.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for no-defaults"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--no-defaults</code></td> </tr></tbody></table>

  Do not read default options from any option file other than login file.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for print-defaults"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--print-defaults</code></td> </tr></tbody></table>

  Print program argument list and exit.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Properties for silent"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--silent</code></td> </tr></tbody></table>

  Show error message only.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for defaults-file"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>0

  Print program version information and exit.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for defaults-file"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>1

  Verbose output; disable with `--silent`.
