#### 6.6.4.3 myisamchk Repair Options

[**myisamchk**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") supports the following options for
table repair operations (operations performed when an option
such as [`--recover`](myisamchk-repair-options.html#option_myisamchk_recover) or
[`--safe-recover`](myisamchk-repair-options.html#option_myisamchk_safe-recover) is given):

* [`--backup`](myisamchk-repair-options.html#option_myisamchk_backup),
  `-B`

  <table frame="box" rules="all" summary="Properties for backup"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--backup</code></td>
</tr></tbody></table>

  Make a backup of the `.MYD` file as
  `file_name-time.BAK`

* [`--character-sets-dir=dir_name`](myisamchk-repair-options.html#option_myisamchk_character-sets-dir)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  The directory where character sets are installed. See
  [Section 12.15, “Character Set Configuration”](charset-configuration.html "12.15 Character Set Configuration").

* [`--correct-checksum`](myisamchk-repair-options.html#option_myisamchk_correct-checksum)

  <table frame="box" rules="all" summary="Properties for correct-checksum"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--correct-checksum</code></td>
</tr></tbody></table>

  Correct the checksum information for the table.

* [`--data-file-length=len`](myisamchk-repair-options.html#option_myisamchk_data-file-length),
  `-D len`

  <table frame="box" rules="all" summary="Properties for data-file-length"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--data-file-length=len</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr></tbody></table>

  The maximum length of the data file (when re-creating data
  file when it is “full”).

* [`--extend-check`](myisamchk-check-options.html#option_myisamchk_extend-check),
  `-e`

  <table frame="box" rules="all" summary="Properties for extend-check"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--extend-check</code></td>
</tr></tbody></table>

  Do a repair that tries to recover every possible row from
  the data file. Normally, this also finds a lot of garbage
  rows. Do not use this option unless you are desperate.

  See also the description of this option under table checking
  options.

  For a description of the output format, see
  [Section 6.6.4.5, “Obtaining Table Information with myisamchk”](myisamchk-table-info.html "6.6.4.5 Obtaining Table Information with myisamchk").

* [`--force`](myisamchk-check-options.html#option_myisamchk_force),
  `-f`

  <table frame="box" rules="all" summary="Properties for force"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--force</code></td>
</tr></tbody></table>

  Overwrite old intermediate files (files with names like
  `tbl_name.TMD`)
  instead of aborting.

* [`--keys-used=val`](myisamchk-repair-options.html#option_myisamchk_keys-used),
  `-k val`

  <table frame="box" rules="all" summary="Properties for keys-used"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--keys-used=val</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr></tbody></table>

  For [**myisamchk**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility"), the option value is a bit
  value that indicates which indexes to update. Each binary
  bit of the option value corresponds to a table index, where
  the first index is bit 0. An option value of 0 disables
  updates to all indexes, which can be used to get faster
  inserts. Deactivated indexes can be reactivated by using
  [**myisamchk -r**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility").

* [`--max-record-length=len`](myisamchk-repair-options.html#option_myisamchk_max-record-length)

  <table frame="box" rules="all" summary="Properties for max-record-length"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--max-record-length=len</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr></tbody></table>

  Skip rows larger than the given length if
  [**myisamchk**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") cannot allocate memory to hold
  them.

* [`--quick`](myisamchk-repair-options.html#option_myisamchk_quick),
  `-q`

  <table frame="box" rules="all" summary="Properties for quick"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--quick</code></td>
</tr></tbody></table>

  Achieve a faster repair by modifying only the index file,
  not the data file. You can specify this option twice to
  force [**myisamchk**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") to modify the original
  data file in case of duplicate keys.

* [`--recover`](myisamchk-repair-options.html#option_myisamchk_recover),
  `-r`

  <table frame="box" rules="all" summary="Properties for recover"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--recover</code></td>
</tr></tbody></table>

  Do a repair that can fix almost any problem except unique
  keys that are not unique (which is an extremely unlikely
  error with `MyISAM` tables). If you want to
  recover a table, this is the option to try first. You should
  try [`--safe-recover`](myisamchk-repair-options.html#option_myisamchk_safe-recover) only if
  [**myisamchk**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") reports that the table cannot
  be recovered using
  [`--recover`](myisamchk-repair-options.html#option_myisamchk_recover). (In the
  unlikely case that
  [`--recover`](myisamchk-repair-options.html#option_myisamchk_recover) fails, the data
  file remains intact.)

  If you have lots of memory, you should increase the value of
  `myisam_sort_buffer_size`.

* [`--safe-recover`](myisamchk-repair-options.html#option_myisamchk_safe-recover),
  `-o`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>0

  Do a repair using an old recovery method that reads through
  all rows in order and updates all index trees based on the
  rows found. This is an order of magnitude slower than
  [`--recover`](myisamchk-repair-options.html#option_myisamchk_recover), but can handle
  a couple of very unlikely cases that
  [`--recover`](myisamchk-repair-options.html#option_myisamchk_recover) cannot. This
  recovery method also uses much less disk space than
  [`--recover`](myisamchk-repair-options.html#option_myisamchk_recover). Normally, you
  should repair first using
  [`--recover`](myisamchk-repair-options.html#option_myisamchk_recover), and then with
  [`--safe-recover`](myisamchk-repair-options.html#option_myisamchk_safe-recover) only if
  [`--recover`](myisamchk-repair-options.html#option_myisamchk_recover) fails.

  If you have lots of memory, you should increase the value of
  `key_buffer_size`.

* [`--set-collation=name`](myisamchk-repair-options.html#option_myisamchk_set-collation)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>1

  Specify the collation to use for sorting table indexes. The
  character set name is implied by the first part of the
  collation name.

* [`--sort-recover`](myisamchk-repair-options.html#option_myisamchk_sort-recover),
  `-n`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>2

  Force [**myisamchk**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") to use sorting to resolve
  the keys even if the temporary files would be very large.

* [`--tmpdir=dir_name`](myisamchk-repair-options.html#option_myisamchk_tmpdir),
  `-t dir_name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>3

  The path of the directory to be used for storing temporary
  files. If this is not set, [**myisamchk**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") uses
  the value of the `TMPDIR` environment
  variable. [`--tmpdir`](myisamchk-repair-options.html#option_myisamchk_tmpdir) can be
  set to a list of directory paths that are used successively
  in round-robin fashion for creating temporary files. The
  separator character between directory names is the colon
  (`:`) on Unix and the semicolon
  (`;`) on Windows.

* [`--unpack`](myisamchk-repair-options.html#option_myisamchk_unpack),
  `-u`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>4

  Unpack a table that was packed with
  [**myisampack**](myisampack.html "6.6.6 myisampack — Generate Compressed, Read-Only MyISAM Tables").