#### 4.6.3.2 myisamchk Check Options

**myisamchk** supports the following options for table checking operations:

* `--check`, `-c`

  <table frame="box" rules="all" summary="Properties for check"><tbody><tr><th>Command-Line Format</th> <td><code>--check</code></td> </tr></tbody></table>

  Check the table for errors. This is the default operation if you specify no option that selects an operation type explicitly.

* `--check-only-changed`, `-C`

  <table frame="box" rules="all" summary="Properties for check-only-changed"><tbody><tr><th>Command-Line Format</th> <td><code>--check-only-changed</code></td> </tr></tbody></table>

  Check only tables that have changed since the last check.

* `--extend-check`, `-e`

  <table frame="box" rules="all" summary="Properties for extend-check"><tbody><tr><th>Command-Line Format</th> <td><code>--extend-check</code></td> </tr></tbody></table>

  Check the table very thoroughly. This is quite slow if the table has many indexes. This option should only be used in extreme cases. Normally, **myisamchk** or **myisamchk --medium-check** should be able to determine whether there are any errors in the table.

  If you are using `--extend-check` and have plenty of memory, setting the `key_buffer_size` variable to a large value helps the repair operation run faster.

  See also the description of this option under table repair options.

  For a description of the output format, see Section 4.6.3.5, “Obtaining Table Information with myisamchk”.

* `--fast`, `-F`

  <table frame="box" rules="all" summary="Properties for fast"><tbody><tr><th>Command-Line Format</th> <td><code>--fast</code></td> </tr></tbody></table>

  Check only tables that haven't been closed properly.

* `--force`, `-f`

  <table frame="box" rules="all" summary="Properties for force"><tbody><tr><th>Command-Line Format</th> <td><code>--force</code></td> </tr></tbody></table>

  Do a repair operation automatically if **myisamchk** finds any errors in the table. The repair type is the same as that specified with the `--recover` or `-r` option.

* `--information`, `-i`

  <table frame="box" rules="all" summary="Properties for information"><tbody><tr><th>Command-Line Format</th> <td><code>--information</code></td> </tr></tbody></table>

  Print informational statistics about the table that is checked.

* `--medium-check`, `-m`

  <table frame="box" rules="all" summary="Properties for medium-check"><tbody><tr><th>Command-Line Format</th> <td><code>--medium-check</code></td> </tr></tbody></table>

  Do a check that is faster than an `--extend-check` operation. This finds only 99.99% of all errors, which should be good enough in most cases.

* `--read-only`, `-T`

  <table frame="box" rules="all" summary="Properties for read-only"><tbody><tr><th>Command-Line Format</th> <td><code>--read-only</code></td> </tr></tbody></table>

  Do not mark the table as checked. This is useful if you use **myisamchk** to check a table that is in use by some other application that does not use locking, such as **mysqld** when run with external locking disabled.

* `--update-state`, `-U`

  <table frame="box" rules="all" summary="Properties for update-state"><tbody><tr><th>Command-Line Format</th> <td><code>--update-state</code></td> </tr></tbody></table>

  Store information in the `.MYI` file to indicate when the table was checked and whether the table crashed. This should be used to get full benefit of the `--check-only-changed` option, but you shouldn't use this option if the **mysqld** server is using the table and you are running it with external locking disabled.
