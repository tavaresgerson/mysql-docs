#### 6.2.2.3 Command-Line Options that Affect Option-File Handling

Most MySQL programs that support option files handle the following options. Because these options affect option-file handling, they must be given on the command line and not in an option file. To work properly, each of these options must be given before other options, with these exceptions:

* `--print-defaults` may be used immediately after `--defaults-file`, `--defaults-extra-file`, `--login-path`, or `--no-login-paths`.

* On Windows, if the server is started with the `--defaults-file` and `--install` options, `--install` must be first. See Section 2.3.3.8, “Starting MySQL as a Windows Service”.

When specifying file names as option values, avoid the use of the `~` shell metacharacter because it might not be interpreted as you expect.

**Table 6.3 Option File Option Summary**

<table frame="box" rules="all" summary="Command-line options available for handling option files."><thead><tr><th>Option Name</th> <th>Description</th> </tr></thead><tbody><tr><td>--defaults-extra-file</td> <td>Read named option file in addition to usual option files</td> </tr><tr><td>--defaults-file</td> <td>Read only named option file</td> </tr><tr><td>--defaults-group-suffix</td> <td>Option group suffix value</td> </tr><tr><td>--login-path</td> <td>Read login path options from .mylogin.cnf</td> </tr><tr><td>--no-defaults</td> <td>Read no option files</td> </tr><tr><td>--no-login-paths</td> <td>Do not read options from login path file</td> </tr></tbody></table>

* `--defaults-extra-file=file_name`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=filename</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read this option file after the global option file but (on Unix) before the user option file and (on all platforms) before the login path file. (For information about the order in which option files are used, see Section 6.2.2.2, “Using Option Files”.) If the file does not exist or is otherwise inaccessible, an error occurs. If *`file_name`* is not an absolute path name, it is interpreted relative to the current directory.

  See the introduction to this section regarding constraints on the position in which this option may be specified.

* `--defaults-file=file_name`

  <table frame="box" rules="all" summary="Properties for defaults-file"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=filename</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read only the given option file. If the file does not exist or is otherwise inaccessible, an error occurs. *`file_name`* is interpreted relative to the current directory if given as a relative path name rather than a full path name.

  Exceptions: Even with `--defaults-file`, **mysqld** reads `mysqld-auto.cnf` and client programs read `.mylogin.cnf`.

  See the introduction to this section regarding constraints on the position in which this option may be specified.

* `--defaults-group-suffix=str`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read not only the usual option groups, but also groups with the usual names and a suffix of *`str`*. For example, the **mysql** client normally reads the `[client]` and `[mysql]` groups. If this option is given as `--defaults-group-suffix=_other`, **mysql** also reads the `[client_other]` and `[mysql_other]` groups.

* `--login-path=name`

  <table frame="box" rules="all" summary="Properties for login-path"><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read options from the named login path in the `.mylogin.cnf` login path file. A “login path” is an option group containing options that specify which MySQL server to connect to and which account to authenticate as. To create or modify a login path file, use the **mysql\_config\_editor** utility. See Section 6.6.7, “mysql\_config\_editor — MySQL Configuration Utility”.

  A client program reads the option group corresponding to the named login path, in addition to option groups that the program reads by default. Consider this command:

  ```
  mysql --login-path=mypath
  ```

  By default, the **mysql** client reads the `[client]` and `[mysql]` option groups. So for the command shown, **mysql** reads `[client]` and `[mysql]` from other option files, and `[client]`, `[mysql]`, and `[mypath]` from the login path file.

  Client programs read the login path file even when the `--no-defaults` option is used, unless `--no-login-paths` is set.

  To specify an alternate login path file name, set the `MYSQL_TEST_LOGIN_FILE` environment variable.

  See the introduction to this section regarding constraints on the position in which this option may be specified.

* `--no-login-paths`

  <table frame="box" rules="all" summary="Properties for no-login-paths"><tbody><tr><th>Command-Line Format</th> <td><code>--no-login-paths</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>

  Skips reading options from the login path file. Client programs always read the login path file without this option even when the `--no-defaults` option is used.

  See `--login-path` for related information.

  See the introduction to this section regarding constraints on the position in which this option may be specified.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for no-defaults"><tbody><tr><th>Command-Line Format</th> <td><code>--no-defaults</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>

  Do not read any option files. If program startup fails due to reading unknown options from an option file, `--no-defaults` can be used to prevent them from being read.

  The exception is that client programs read the `.mylogin.cnf` login path file, if it exists, even when `--no-defaults` is used unless `--no-login-paths` is set. This permits passwords to be specified in a safer way than on the command line even if `--no-defaults` is present. To create `.mylogin.cnf`, use the **mysql\_config\_editor** utility. See Section 6.6.7, “mysql\_config\_editor — MySQL Configuration Utility”.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for print-defaults"><tbody><tr><th>Command-Line Format</th> <td><code>--print-defaults</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>

  Print the program name and all options that it gets from option files. Password values are masked.

  See the introduction to this section regarding constraints on the position in which this option may be specified.
