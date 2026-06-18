### 4.7.2 my\_print\_defaults — Display Options from Option Files

[**my\_print\_defaults**](my-print-defaults.html "4.7.2 my_print_defaults — Display Options from Option Files") displays the options that
are present in option groups of option files. The output
indicates what options are used by programs that read the
specified option groups. For example, the
[**mysqlcheck**](mysqlcheck.html "4.5.3 mysqlcheck — A Table Maintenance Program") program reads the
`[mysqlcheck]` and `[client]`
option groups. To see what options are present in those groups
in the standard option files, invoke
[**my\_print\_defaults**](my-print-defaults.html "4.7.2 my_print_defaults — Display Options from Option Files") like this:

```sql
$> my_print_defaults mysqlcheck client
--user=myusername
--password=password
--host=localhost
```

The output consists of options, one per line, in the form that
they would be specified on the command line.

[**my\_print\_defaults**](my-print-defaults.html "4.7.2 my_print_defaults — Display Options from Option Files") supports the following
options.

* [`--help`](my-print-defaults.html#option_my_print_defaults_help),
  `-?`

  Display a help message and exit.

* [`--config-file=file_name`](my-print-defaults.html#option_my_print_defaults_config-file),
  [`--defaults-file=file_name`](my-print-defaults.html#option_my_print_defaults_config-file),
  `-c file_name`

  Read only the given option file.

* [`--debug=debug_options`](my-print-defaults.html#option_my_print_defaults_debug),
  `-# debug_options`

  Write a debugging log. A typical
  *`debug_options`* string is
  `d:t:o,file_name`.
  The default is
  `d:t:o,/tmp/my_print_defaults.trace`.

* [`--defaults-extra-file=file_name`](my-print-defaults.html#option_my_print_defaults_defaults-extra-file),
  [`--extra-file=file_name`](my-print-defaults.html#option_my_print_defaults_defaults-extra-file),
  `-e file_name`

  Read this option file after the global option file but (on
  Unix) before the user option file.

  For additional information about this and other option-file
  options, see [Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "4.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--defaults-group-suffix=suffix`](my-print-defaults.html#option_my_print_defaults_defaults-group-suffix),
  `-g suffix`

  In addition to the groups named on the command line, read
  groups that have the given suffix.

  For additional information about this and other option-file
  options, see [Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "4.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--login-path=name`](my-print-defaults.html#option_my_print_defaults_login-path),
  `-l name`

  Read options from the named login path in the
  `.mylogin.cnf` login path file. A
  “login path” is an option group containing
  options that specify which MySQL server to connect to and
  which account to authenticate as. To create or modify a
  login path file, use the
  [**mysql\_config\_editor**](mysql-config-editor.html "4.6.6 mysql_config_editor — MySQL Configuration Utility") utility. See
  [Section 4.6.6, “mysql\_config\_editor — MySQL Configuration Utility”](mysql-config-editor.html "4.6.6 mysql_config_editor — MySQL Configuration Utility").

  For additional information about this and other option-file
  options, see [Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "4.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--no-defaults`](my-print-defaults.html#option_my_print_defaults_no-defaults),
  `-n`

  Return an empty string.

  For additional information about this and other option-file
  options, see [Section 4.2.2.3, “Command-Line Options that Affect Option-File Handling”](option-file-options.html "4.2.2.3 Command-Line Options that Affect Option-File Handling").

* [`--show`](my-print-defaults.html#option_my_print_defaults_show),
  `-s`

  As of MySQL 5.7.8, [**my\_print\_defaults**](my-print-defaults.html "4.7.2 my_print_defaults — Display Options from Option Files")
  masks passwords by default. Use this option to display
  passwords in cleartext.

* [`--verbose`](my-print-defaults.html#option_my_print_defaults_verbose),
  `-v`

  Verbose mode. Print more information about what the program
  does.

* [`--version`](my-print-defaults.html#option_my_print_defaults_version),
  `-V`

  Display version information and exit.