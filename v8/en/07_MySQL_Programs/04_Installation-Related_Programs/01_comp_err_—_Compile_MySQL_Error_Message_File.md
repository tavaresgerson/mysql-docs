### 6.4.1 comp_err — Compile MySQL Error Message File

**comp_err** creates the `errmsg.sys` file that is used by **mysqld** to determine the error messages to display for different error codes. **comp_err** normally is run automatically when MySQL is built. It compiles the `errmsg.sys` file from text-format error information in MySQL source distributions:

* As of MySQL 8.0.19, the error information comes from the `messages_to_error_log.txt` and `messages_to_clients.txt` files in the `share` directory.

  For more information about defining error messages, see the comments within those files, along with the `errmsg_readme.txt` file.

* Prior to MySQL 8.0.19, the error information comes from the `errmsg-utf8.txt` file in the `sql/share` directory.

**comp_err** also generates the `mysqld_error.h`, `mysqld_ername.h`, and `mysqld_errmsg.h` header files.

Invoke **comp_err** like this:

```
comp_err [options]
```

**comp_err** supports the following options.

* `--help`, `-?`

  <table summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--charset=dir_name`, `-C dir_name`

  <table summary="Properties for charset"><tbody><tr><th>Command-Line Format</th> <td><code>--charset</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>../share/charsets</code></td> </tr></tbody></table>

  The character set directory. The default is `../sql/share/charsets`.

* `--debug=debug_options`, `-# debug_options`

  <table summary="Properties for debug"><tbody><tr><th>Command-Line Format</th> <td><code>--debug=options</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>d:t:O,/tmp/comp_err.trace</code></td> </tr></tbody></table>

  Write a debugging log. A typical *`debug_options`* string is `d:t:O,file_name`. The default is `d:t:O,/tmp/comp_err.trace`.

* `--debug-info`, `-T`

  <table summary="Properties for debug-info"><tbody><tr><th>Command-Line Format</th> <td><code>--debug-info</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>false</code></td> </tr></tbody></table>

  Print some debugging information when the program exits.

* `--errmsg-file=file_name`, `-H file_name`

  <table summary="Properties for errmsg-file"><tbody><tr><th>Command-Line Format</th> <td><code>--errmsg-file=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>mysqld_errmsg.h</code></td> </tr></tbody></table>

  The name of the error message file. The default is `mysqld_errmsg.h`. This option was added in MySQL 8.0.18.

* `--header-file=file_name`, `-H file_name`

  <table summary="Properties for header-file"><tbody><tr><th>Command-Line Format</th> <td><code>--header-file=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>mysqld_error.h</code></td> </tr></tbody></table>

  The name of the error header file. The default is `mysqld_error.h`.

* `--in-file=file_name`, `-F file_name`

  <table summary="Properties for in-file"><tbody><tr><th>Command-Line Format</th> <td><code>--in-file=path</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  The name of the input file. The default is `../share/errmsg-utf8.txt`.

  This option was removed in MySQL 8.0.19 and replaced by the `--in-file-errlog` and `--in-file-toclient` options.

* `--in-file-errlog=file_name`, `-e file_name`

  <table summary="Properties for in-file-errlog"><tbody><tr><th>Command-Line Format</th> <td><code>--in-file-errlog</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>../share/messages_to_error_log.txt</code></td> </tr></tbody></table>

  The name of the input file that defines error messages intended to be written to the error log. The default is `../share/messages_to_error_log.txt`.

  This option was added in MySQL 8.0.19.

* `--in-file-toclient=file_name`, `-c file_name`

  <table summary="Properties for in-file-toclient"><tbody><tr><th>Command-Line Format</th> <td><code>--in-file-toclient=path</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>../share/messages_to_clients.txt</code></td> </tr></tbody></table>

  The name of the input file that defines error messages intended to be written to clients. The default is `../share/messages_to_clients.txt`.

  This option was added in MySQL 8.0.19.

* `--name-file=file_name`, `-N file_name`

  <table summary="Properties for name-file"><tbody><tr><th>Command-Line Format</th> <td><code>--name-file=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>mysqld_ername.h</code></td> </tr></tbody></table>

  The name of the error name file. The default is `mysqld_ername.h`.

* `--out-dir=dir_name`, `-D dir_name`

  <table summary="Properties for charset"><tbody><tr><th>Command-Line Format</th> <td><code>--charset</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>../share/charsets</code></td> </tr></tbody></table>0

  The name of the output base directory. The default is `../sql/share/`.

* `--out-file=file_name`, `-O file_name`

  <table summary="Properties for charset"><tbody><tr><th>Command-Line Format</th> <td><code>--charset</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>../share/charsets</code></td> </tr></tbody></table>1

  The name of the output file. The default is `errmsg.sys`.

* `--version`, `-V`

  <table summary="Properties for charset"><tbody><tr><th>Command-Line Format</th> <td><code>--charset</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>../share/charsets</code></td> </tr></tbody></table>2

  Display version information and exit.
