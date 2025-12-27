### 6.4.1 comp\_err — Compile MySQL Error Message File

**comp\_err** creates the `errmsg.sys` file that is used by **mysqld** to determine the error messages to display for different error codes. **comp\_err** normally is run automatically when MySQL is built. It compiles the `errmsg.sys` file from text-format error information in MySQL source distributions:

The error information comes from the `messages_to_error_log.txt` and `messages_to_clients.txt` files in the `share` directory.

For more information about defining error messages, see the comments within those files, along with the `errmsg_readme.txt` file.

**comp\_err** also generates the `mysqld_error.h`, `mysqld_ername.h`, and `mysqld_errmsg.h` header files.

Invoke **comp\_err** like this:

```
comp_err [options]
```

**comp\_err** supports the following options.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--help</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">false</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--charset=dir_name`, `-C dir_name`

  <table frame="box" rules="all" summary="Properties for charset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--charset</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">../share/charsets</code></td> </tr></tbody></table>

  The character set directory. The default is `../sql/share/charsets`.

* `--debug=debug_options`, `-# debug_options`

  <table frame="box" rules="all" summary="Properties for debug"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--debug=options</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">d:t:O,/tmp/comp_err.trace</code></td> </tr></tbody></table>

  Write a debugging log. A typical *`debug_options`* string is `d:t:O,file_name`. The default is `d:t:O,/tmp/comp_err.trace`.

* `--debug-info`, `-T`

  <table frame="box" rules="all" summary="Properties for debug-info"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--debug-info</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">false</code></td> </tr></tbody></table>

  Print some debugging information when the program exits.

* `--errmsg-file=file_name`, `-H file_name`

  <table frame="box" rules="all" summary="Properties for errmsg-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--errmsg-file=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">mysqld_errmsg.h</code></td> </tr></tbody></table>

  The name of the error message file. The default is `mysqld_errmsg.h`.

* `--header-file=file_name`, `-H file_name`

  <table frame="box" rules="all" summary="Properties for header-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--header-file=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">mysqld_error.h</code></td> </tr></tbody></table>

  The name of the error header file. The default is `mysqld_error.h`.

* `--in-file-errlog=file_name`, `-e file_name`

  <table frame="box" rules="all" summary="Properties for in-file-errlog"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--in-file-errlog</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">../share/messages_to_error_log.txt</code></td> </tr></tbody></table>

  The name of the input file that defines error messages intended to be written to the error log. The default is `../share/messages_to_error_log.txt`.

* `--in-file-toclient=file_name`, `-c file_name`

  <table frame="box" rules="all" summary="Properties for in-file-toclient"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--in-file-toclient=path</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">../share/messages_to_clients.txt</code></td> </tr></tbody></table>

  The name of the input file that defines error messages intended to be written to clients. The default is `../share/messages_to_clients.txt`.

* `--name-file=file_name`, `-N file_name`

  <table frame="box" rules="all" summary="Properties for name-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--name-file=name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">mysqld_ername.h</code></td> </tr></tbody></table>

  The name of the error name file. The default is `mysqld_ername.h`.

* `--out-dir=dir_name`, `-D dir_name`

  <table frame="box" rules="all" summary="Properties for out-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--out-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">../share/</code></td> </tr></tbody></table>

  The name of the output base directory. The default is `../sql/share/`.

* `--out-file=file_name`, `-O file_name`

  <table frame="box" rules="all" summary="Properties for charset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--charset</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">../share/charsets</code></td> </tr></tbody></table>0

  The name of the output file. The default is `errmsg.sys`.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for charset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--charset</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">../share/charsets</code></td> </tr></tbody></table>1

  Display version information and exit.
