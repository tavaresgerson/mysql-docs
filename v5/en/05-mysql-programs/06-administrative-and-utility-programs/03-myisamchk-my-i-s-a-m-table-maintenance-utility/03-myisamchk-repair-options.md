#### 4.6.3.3 myisamchk Repair Options

**myisamchk** supports the following options for table repair operations (operations performed when an option such as `--recover` or `--safe-recover` is given):

* `--backup`, `-B`

  <table frame="box" rules="all" summary="Properties for backup"><tbody><tr><th>Command-Line Format</th> <td><code>--backup</code></td> </tr></tbody></table>

  Make a backup of the `.MYD` file as `file_name-time.BAK`

* `--character-sets-dir=dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  The directory where character sets are installed. See Section 10.15, “Character Set Configuration”.

* `--correct-checksum`

  <table frame="box" rules="all" summary="Properties for correct-checksum"><tbody><tr><th>Command-Line Format</th> <td><code>--correct-checksum</code></td> </tr></tbody></table>

  Correct the checksum information for the table.

* `--data-file-length=len`, `-D len`

  <table frame="box" rules="all" summary="Properties for data-file-length"><tbody><tr><th>Command-Line Format</th> <td><code>--data-file-length=len</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  The maximum length of the data file (when re-creating data file when it is “full”).

* `--extend-check`, `-e`

  <table frame="box" rules="all" summary="Properties for extend-check"><tbody><tr><th>Command-Line Format</th> <td><code>--extend-check</code></td> </tr></tbody></table>

  Do a repair that tries to recover every possible row from the data file. Normally, this also finds a lot of garbage rows. Do not use this option unless you are desperate.

  See also the description of this option under table checking options.

  For a description of the output format, see Section 4.6.3.5, “Obtaining Table Information with myisamchk”.

* `--force`, `-f`

  <table frame="box" rules="all" summary="Properties for force"><tbody><tr><th>Command-Line Format</th> <td><code>--force</code></td> </tr></tbody></table>

  Overwrite old intermediate files (files with names like `tbl_name.TMD`) instead of aborting.

* `--keys-used=val`, `-k val`

  <table frame="box" rules="all" summary="Properties for keys-used"><tbody><tr><th>Command-Line Format</th> <td><code>--keys-used=val</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  For **myisamchk**, the option value is a bit value that indicates which indexes to update. Each binary bit of the option value corresponds to a table index, where the first index is bit 0. An option value of 0 disables updates to all indexes, which can be used to get faster inserts. Deactivated indexes can be reactivated by using **myisamchk -r**.

* `--max-record-length=len`

  <table frame="box" rules="all" summary="Properties for max-record-length"><tbody><tr><th>Command-Line Format</th> <td><code>--max-record-length=len</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr></tbody></table>

  Skip rows larger than the given length if **myisamchk** cannot allocate memory to hold them.

* `--parallel-recover`, `-p`

  <table frame="box" rules="all" summary="Properties for parallel-recover"><tbody><tr><th>Command-Line Format</th> <td><code>--parallel-recover</code></td> </tr></tbody></table>

  Note

  This option is deprecated in MySQL 5.7.38 and removed in MySQL 5.7.39.

  Use the same technique as `-r` and `-n`, but create all the keys in parallel, using different threads. *This is beta-quality code. Use at your own risk!*

* `--quick`, `-q`

  <table frame="box" rules="all" summary="Properties for quick"><tbody><tr><th>Command-Line Format</th> <td><code>--quick</code></td> </tr></tbody></table>

  Achieve a faster repair by modifying only the index file, not the data file. You can specify this option twice to force **myisamchk** to modify the original data file in case of duplicate keys.

* `--recover`, `-r`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Do a repair that can fix almost any problem except unique keys that are not unique (which is an extremely unlikely error with `MyISAM` tables). If you want to recover a table, this is the option to try first. You should try `--safe-recover` only if **myisamchk** reports that the table cannot be recovered using `--recover`. (In the unlikely case that `--recover` fails, the data file remains intact.)

  If you have lots of memory, you should increase the value of `myisam_sort_buffer_size`.

* `--safe-recover`, `-o`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Do a repair using an old recovery method that reads through all rows in order and updates all index trees based on the rows found. This is an order of magnitude slower than `--recover`, but can handle a couple of very unlikely cases that `--recover` cannot. This recovery method also uses much less disk space than `--recover`. Normally, you should repair first using `--recover`, and then with `--safe-recover` only if `--recover` fails.

  If you have lots of memory, you should increase the value of `key_buffer_size`.

* `--set-collation=name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Specify the collation to use for sorting table indexes. The character set name is implied by the first part of the collation name.

* `--sort-recover`, `-n`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Force **myisamchk** to use sorting to resolve the keys even if the temporary files would be very large.

* `--tmpdir=dir_name`, `-t dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  The path of the directory to be used for storing temporary files. If this is not set, **myisamchk** uses the value of the `TMPDIR` environment variable. `--tmpdir` can be set to a list of directory paths that are used successively in round-robin fashion for creating temporary files. The separator character between directory names is the colon (`:`) on Unix and the semicolon (`;`) on Windows.

* `--unpack`, `-u`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Unpack a table that was packed with **myisampack**.
