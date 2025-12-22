### 6.7.2 `my_print_defaults` — Display Options from Option Files

**`my_print_defaults`** displays the options that are present in option groups of option files. The output indicates what options are used by programs that read the specified option groups. For example, the `mysqlcheck` program reads the `[mysqlcheck]` and `[client]` option groups. To see what options are present in those groups in the standard option files, invoke **my\_print\_defaults** like this:

```
$> my_print_defaults mysqlcheck client
--user=myusername
--password=password
--host=localhost
```

The output consists of options, one per line, in the form that they would be specified on the command line.

 **`my_print_defaults`** supports the following options.

*  `--help`, `-?`

  Display a help message and exit.
*  `--config-file=file_name`, `--defaults-file=file_name`, `-c file_name`

  Read only the given option file.
*  `--debug=debug_options`, `-# debug_options`

  Write a debugging log. A typical *`debug_options`* string is `d:t:o,file_name`. The default is `d:t:o,/tmp/my_print_defaults.trace`.
*  `--defaults-extra-file=file_name`, `--extra-file=file_name`, `-e file_name`

  Read this option file after the global option file but (on Unix) before the user option file.

  For additional information about this and other option-file options, see  Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.
*  `--defaults-group-suffix=suffix`, `-g suffix`

  In addition to the groups named on the command line, read groups that have the given suffix.

  For additional information about this and other option-file options, see  Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.
*  `--login-path=name`, `-l name`

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql\_config\_editor** utility. See Section 6.6.7, “mysql\_config\_editor — MySQL Configuration Utility”.

  For additional information about this and other option-file options, see  Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.
*  `--no-login-paths`

  Skips reading options from the login path file.

  See  `--login-path` for related information.

  For additional information about this and other option-file options, see  Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.
*  `--no-defaults`, `-n`

  Return an empty string.

  For additional information about this and other option-file options, see  Section 6.2.2.3, “Command-Line Options that Affect Option-File Handling”.
*  `--show`, `-s`

   **my\_print\_defaults** masks passwords by default. Use this option to display passwords as cleartext.
*  `--verbose`, `-v`

  Verbose mode. Print more information about what the program does.
*  `--version`, `-V`

  Display version information and exit.
