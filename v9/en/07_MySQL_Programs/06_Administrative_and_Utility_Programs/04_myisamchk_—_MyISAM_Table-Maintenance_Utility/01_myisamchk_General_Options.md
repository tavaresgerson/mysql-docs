#### 6.6.4.1 myisamchk General Options

The options described in this section can be used for any type
of table maintenance operation performed by
[**myisamchk**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility"). The sections following this one
describe options that pertain only to specific operations, such
as table checking or repairing.

* [`--help`](myisamchk-general-options.html#option_myisamchk_help),
  `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--help</code></td>
</tr></tbody></table>

  Display a help message and exit. Options are grouped by type
  of operation.

* [`--HELP`](myisamchk-general-options.html#option_myisamchk_HELP),
  `-H`

  <table frame="box" rules="all" summary="Properties for HELP"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--HELP</code></td>
</tr></tbody></table>

  Display a help message and exit. Options are presented in a
  single list.

* [`--debug=debug_options`](myisamchk-general-options.html#option_myisamchk_debug),
  `-# debug_options`

  <table frame="box" rules="all" summary="Properties for debug"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--debug[=debug_options]</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">d:t:o,/tmp/myisamchk.trace</code></td>
</tr></tbody></table>

  Write a debugging log. A typical
  *`debug_options`* string is
  `d:t:o,file_name`.
  The default is
  `d:t:o,/tmp/myisamchk.trace`.

  This option is available only if MySQL was built using
  [`WITH_DEBUG`](source-configuration-options.html#option_cmake_with_debug). MySQL release
  binaries provided by Oracle are *not*
  built using this option.

* [`--defaults-extra-file=file_name`](myisamchk-general-options.html#option_myisamchk_defaults-extra-file)

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--defaults-extra-file=file_name</code></td>
</tr><tr><th>Type</th>
<td>File name</td>
</tr></tbody></table>

  Read this option file after the global option file but (on
  Unix) before the user option file. If the file does not
  exist or is otherwise inaccessible, an error occurs. If
  *`file_name`* is not an absolute path
  name, it is interpreted relative to the current directory.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--defaults-file=file_name`](myisamchk-general-options.html#option_myisamchk_defaults-file)

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--defaults-file=file_name</code></td>
</tr><tr><th>Type</th>
<td>File name</td>
</tr></tbody></table>

  Use only the given option file. If the file does not exist
  or is otherwise inaccessible, an error occurs. If
  *`file_name`* is not an absolute path
  name, it is interpreted relative to the current directory.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--defaults-group-suffix=str`](myisamchk-general-options.html#option_myisamchk_defaults-group-suffix)

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--defaults-group-suffix=str</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr></tbody></table>

  Read not only the usual option groups, but also groups with
  the usual names and a suffix of
  *`str`*. For example,
  [**myisamchk**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") normally reads the
  `[myisamchk]` group. If this option is
  given as
  [`--defaults-group-suffix=_other`](myisamchk-general-options.html#option_myisamchk_defaults-group-suffix),
  [**myisamchk**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") also reads the
  `[myisamchk_other]` group.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--no-defaults`](myisamchk-general-options.html#option_myisamchk_no-defaults)

  <table frame="box" rules="all" summary="Properties for no-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--no-defaults</code></td>
</tr></tbody></table>

  Do not read any option files. If program startup fails due
  to reading unknown options from an option file,
  [`--no-defaults`](myisamchk-general-options.html#option_myisamchk_no-defaults) can be used
  to prevent them from being read.

  The exception is that the `.mylogin.cnf`
  file is read in all cases, if it exists. This permits
  passwords to be specified in a safer way than on the command
  line even when
  [`--no-defaults`](myisamchk-general-options.html#option_myisamchk_no-defaults) is used. To
  create `.mylogin.cnf`, use the
  [**mysql\_config\_editor**](mysql-config-editor.html "6.6.7 mysql_config_editor — MySQL Configuration Utility") utility. See
  [Section 6.6.7, “mysql\_config\_editor — MySQL Configuration Utility”](mysql-config-editor.html "6.6.7 mysql_config_editor — MySQL Configuration Utility").

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--print-defaults`](myisamchk-general-options.html#option_myisamchk_print-defaults)

  <table frame="box" rules="all" summary="Properties for print-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--print-defaults</code></td>
</tr></tbody></table>

  Print the program name and all options that it gets from
  option files.

  For additional information about this and other option-file
  options, see [Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "6.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--silent`](myisamchk-general-options.html#option_myisamchk_silent),
  `-s`

  <table frame="box" rules="all" summary="Properties for silent"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--silent</code></td>
</tr></tbody></table>

  Silent mode. Write output only when errors occur. You can
  use `-s` twice (`-ss`) to make
  [**myisamchk**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") very silent.

* [`--verbose`](myisamchk-general-options.html#option_myisamchk_verbose),
  `-v`

  <table frame="box" rules="all" summary="Properties for verbose"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--verbose</code></td>
</tr></tbody></table>

  Verbose mode. Print more information about what the program
  does. This can be used with `-d` and
  `-e`. Use `-v` multiple times
  (`-vv`, `-vvv`) for even more
  output.

* [`--version`](myisamchk-general-options.html#option_myisamchk_version),
  `-V`

  <table frame="box" rules="all" summary="Properties for HELP"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--HELP</code></td>
</tr></tbody></table>0

  Display version information and exit.

* [`--wait`](myisamchk-general-options.html#option_myisamchk_wait),
  `-w`

  <table frame="box" rules="all" summary="Properties for HELP"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--HELP</code></td>
</tr></tbody></table>1

  Instead of terminating with an error if the table is locked,
  wait until the table is unlocked before continuing. If you
  are running [**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server") with external locking
  disabled, the table can be locked only by another
  [**myisamchk**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") command.

You can also set the following variables by using
`--var_name=value`
syntax:

<table frame="box" rules="all" summary="Properties for HELP"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--HELP</code></td>
</tr></tbody></table>2

The possible [**myisamchk**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") variables and their
default values can be examined with [**myisamchk
--help**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility"):

`myisam_sort_buffer_size` is used when the keys
are repaired by sorting keys, which is the normal case when you
use [`--recover`](myisamchk-repair-options.html#option_myisamchk_recover).
`sort_buffer_size` is a deprecated synonym for
`myisam_sort_buffer_size`.

`key_buffer_size` is used when you are checking
the table with [`--extend-check`](myisamchk-check-options.html#option_myisamchk_extend-check)
or when the keys are repaired by inserting keys row by row into
the table (like when doing normal inserts). Repairing through
the key buffer is used in the following cases:

* You use [`--safe-recover`](myisamchk-repair-options.html#option_myisamchk_safe-recover).
* The temporary files needed to sort the keys would be more
  than twice as big as when creating the key file directly.
  This is often the case when you have large key values for
  [`CHAR`](char.html "13.3.2 The CHAR and VARCHAR Types"),
  [`VARCHAR`](char.html "13.3.2 The CHAR and VARCHAR Types"), or
  [`TEXT`](blob.html "13.3.4 The BLOB and TEXT Types") columns, because the
  sort operation needs to store the complete key values as it
  proceeds. If you have lots of temporary space and you can
  force [**myisamchk**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") to repair by sorting, you
  can use the [`--sort-recover`](myisamchk-repair-options.html#option_myisamchk_sort-recover)
  option.

Repairing through the key buffer takes much less disk space than
using sorting, but is also much slower.

If you want a faster repair, set the
`key_buffer_size` and
`myisam_sort_buffer_size` variables to about
25% of your available memory. You can set both variables to
large values, because only one of them is used at a time.

`myisam_block_size` is the size used for index
blocks.

`stats_method` influences how
`NULL` values are treated for index statistics
collection when the [`--analyze`](myisamchk-other-options.html#option_myisamchk_analyze)
option is given. It acts like the
`myisam_stats_method` system variable. For more
information, see the description of
`myisam_stats_method` in
[Section 7.1.8, “Server System Variables”](server-system-variables.html "7.1.8 Server System Variables"), and
[Section 10.3.8, “InnoDB and MyISAM Index Statistics Collection”](index-statistics.html "10.3.8 InnoDB and MyISAM Index Statistics Collection").

`ft_min_word_len` and
`ft_max_word_len` indicate the minimum and
maximum word length for `FULLTEXT` indexes on
`MyISAM` tables.
`ft_stopword_file` names the stopword file.
These need to be set under the following circumstances.

If you use [**myisamchk**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") to perform an operation
that modifies table indexes (such as repair or analyze), the
`FULLTEXT` indexes are rebuilt using the
default full-text parameter values for minimum and maximum word
length and the stopword file unless you specify otherwise. This
can result in queries failing.

The problem occurs because these parameters are known only by
the server. They are not stored in `MyISAM`
index files. To avoid the problem if you have modified the
minimum or maximum word length or the stopword file in the
server, specify the same `ft_min_word_len`,
`ft_max_word_len`, and
`ft_stopword_file` values to
[**myisamchk**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") that you use for
[**mysqld**](mysqld.html "6.3.1 mysqld — The MySQL Server"). For example, if you have set the
minimum word length to 3, you can repair a table with
[**myisamchk**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") like this:

```
myisamchk --recover --ft_min_word_len=3 tbl_name.MYI
```

To ensure that [**myisamchk**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") and the server use
the same values for full-text parameters, you can place each one
in both the `[mysqld]` and
`[myisamchk]` sections of an option file:

```
[mysqld]
ft_min_word_len=3

[myisamchk]
ft_min_word_len=3
```

An alternative to using [**myisamchk**](myisamchk.html "6.6.4 myisamchk — MyISAM Table-Maintenance Utility") is to use
the [`REPAIR TABLE`](repair-table.html "15.7.3.5 REPAIR TABLE Statement"),
[`ANALYZE TABLE`](analyze-table.html "15.7.3.1 ANALYZE TABLE Statement"),
[`OPTIMIZE TABLE`](optimize-table.html "15.7.3.4 OPTIMIZE TABLE Statement"), or
[`ALTER TABLE`](alter-table.html "15.1.11 ALTER TABLE Statement"). These statements are
performed by the server, which knows the proper full-text
parameter values to use.