### 4.4.3 mysql\_plugin — Configure MySQL Server Plugins

Note

**mysql\_plugin** is deprecated as of MySQL 5.7.11 and removed in MySQL 8.0. Alternatives include loading plugins at server startup using the `--plugin-load` or `--plugin-load-add` option, or at runtime using the `INSTALL PLUGIN` statement.

The **mysql\_plugin** utility enables MySQL administrators to manage which plugins a MySQL server loads. It provides an alternative to manually specifying the `--plugin-load` option at server startup or using the `INSTALL PLUGIN` and `UNINSTALL PLUGIN` statements at runtime.

Depending on whether **mysql\_plugin** is invoked to enable or disable plugins, it inserts or deletes rows in the `mysql.plugin` table that serves as a plugin registry. (To perform this operation, **mysql\_plugin** invokes the MySQL server in bootstrap mode. This means that the server must not already be running.) For normal server startups, the server loads and enables plugins listed in `mysql.plugin` automatically. For additional control over plugin activation, use `--plugin_name` options named for specific plugins, as described in Section 5.5.1, “Installing and Uninstalling Plugins”.

Each invocation of **mysql\_plugin** reads a configuration file to determine how to configure the plugins contained in a single plugin library file. To invoke **mysql\_plugin**, use this syntax:

```sql
mysql_plugin [options] plugin {ENABLE|DISABLE}
```

*`plugin`* is the name of the plugin to configure. `ENABLE` or `DISABLE` (not case-sensitive) specify whether to enable or disable components of the plugin library named in the configuration file. The order of the *`plugin`* and `ENABLE` or `DISABLE` arguments does not matter.

For example, to configure components of a plugin library file named `myplugins.so` on Linux or `myplugins.dll` on Windows, specify a *`plugin`* value of `myplugins`. Suppose that this plugin library contains three plugins, `plugin1`, `plugin2`, and `plugin3`, all of which should be configured under **mysql\_plugin** control. By convention, configuration files have a suffix of `.ini` and the same base name as the plugin library, so the default configuration file name for this plugin library is `myplugins.ini`. The configuration file contents look like this:

```sql
myplugins
plugin1
plugin2
plugin3
```

The first line in the `myplugins.ini` file is the name of the library file, without any extension such as `.so` or `.dll`. The remaining lines are the names of the components to be enabled or disabled. Each value in the file should be on a separate line. Lines on which the first character is `'#'` are taken as comments and ignored.

To enable the plugins listed in the configuration file, invoke **mysql\_plugin** this way:

```sql
mysql_plugin myplugins ENABLE
```

To disable the plugins, use `DISABLE` rather than `ENABLE`.

An error occurs if **mysql\_plugin** cannot find the configuration file or plugin library file, or if **mysql\_plugin** cannot start the MySQL server.

**mysql\_plugin** supports the following options, which can be specified on the command line or in the `[mysqld]` group of any option file. For options specified in a `[mysqld]` group, **mysql\_plugin** recognizes the `--basedir`, `--datadir`, and `--plugin-dir` options and ignores others. For information about option files used by MySQL programs, see Section 4.2.2.2, “Using Option Files”.

**Table 4.9 mysql\_plugin Options**

<table frame="box" rules="all" summary="Command-line options available for mysql_plugin."><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Option Name</th> <th>Description</th> </tr></thead><tbody><tr><td><a class="link" href="mysql-plugin.html#option_mysql_plugin_basedir">--basedir</a></td> <td>The server base directory</td> </tr><tr><td><a class="link" href="mysql-plugin.html#option_mysql_plugin_datadir">--datadir</a></td> <td>The server data directory</td> </tr><tr><td><a class="link" href="mysql-plugin.html#option_mysql_plugin_help">--help</a></td> <td>Display help message and exit</td> </tr><tr><td><a class="link" href="mysql-plugin.html#option_mysql_plugin_my-print-defaults">--my-print-defaults</a></td> <td>Path to my_print_defaults</td> </tr><tr><td><a class="link" href="mysql-plugin.html#option_mysql_plugin_mysqld">--mysqld</a></td> <td>Path to server</td> </tr><tr><td><a class="link" href="mysql-plugin.html#option_mysql_plugin_no-defaults">--no-defaults</a></td> <td>Do not read configuration file</td> </tr><tr><td><a class="link" href="mysql-plugin.html#option_mysql_plugin_plugin-dir">--plugin-dir</a></td> <td>Directory where plugins are installed</td> </tr><tr><td><a class="link" href="mysql-plugin.html#option_mysql_plugin_plugin-ini">--plugin-ini</a></td> <td>The plugin configuration file</td> </tr><tr><td><a class="link" href="mysql-plugin.html#option_mysql_plugin_print-defaults">--print-defaults</a></td> <td>Show configuration file defaults</td> </tr><tr><td><a class="link" href="mysql-plugin.html#option_mysql_plugin_verbose">--verbose</a></td> <td>Verbose mode</td> </tr><tr><td><a class="link" href="mysql-plugin.html#option_mysql_plugin_version">--version</a></td> <td>Display version information and exit</td> </tr></tbody></table>

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display a help message and exit.

* `--basedir=dir_name`, `-b dir_name`

  <table frame="box" rules="all" summary="Properties for basedir"><tbody><tr><th>Command-Line Format</th> <td><code>--basedir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The server base directory.

* `--datadir=dir_name`, `-d dir_name`

  <table frame="box" rules="all" summary="Properties for datadir"><tbody><tr><th>Command-Line Format</th> <td><code>--datadir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The server data directory.

* `--my-print-defaults=file_name`, `-b file_name`

  <table frame="box" rules="all" summary="Properties for my-print-defaults"><tbody><tr><th>Command-Line Format</th> <td><code>--my-print-defaults=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  The path to the **my\_print\_defaults** program.

* `--mysqld=file_name`, `-b file_name`

  <table frame="box" rules="all" summary="Properties for mysqld"><tbody><tr><th>Command-Line Format</th> <td><code>--mysqld=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  The path to the **mysqld** server.

* `--no-defaults`, `-p`

  <table frame="box" rules="all" summary="Properties for no-defaults"><tbody><tr><th>Command-Line Format</th> <td><code>--no-defaults</code></td> </tr></tbody></table>

  Do not read values from the configuration file. This option enables an administrator to skip reading defaults from the configuration file.

  With **mysql\_plugin**, this option need not be given first on the command line, unlike most other MySQL programs that support `--no-defaults`.

* `--plugin-dir=dir_name`, `-p dir_name`

  <table frame="box" rules="all" summary="Properties for plugin-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--plugin-dir=dir_name</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr></tbody></table>

  The server plugin directory.

* `--plugin-ini=file_name`, `-i file_name`

  <table frame="box" rules="all" summary="Properties for plugin-ini"><tbody><tr><th>Command-Line Format</th> <td><code>--plugin-ini=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr></tbody></table>

  The **mysql\_plugin** configuration file. Relative path names are interpreted relative to the current directory. If this option is not given, the default is `plugin.ini` in the plugin directory, where *`plugin`* is the *`plugin`* argument on the command line.

* `--print-defaults`, `-P`

  <table frame="box" rules="all" summary="Properties for print-defaults"><tbody><tr><th>Command-Line Format</th> <td><code>--print-defaults</code></td> </tr></tbody></table>

  Display the default values from the configuration file. This option causes **mysql\_plugin** to print the defaults for `--basedir`, `--datadir`, and `--plugin-dir` if they are found in the configuration file. If no value for a variable is found, nothing is shown.

  With **mysql\_plugin**, this option need not be given first on the command line, unlike most other MySQL programs that support `--print-defaults`.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Verbose mode. Print more information about what the program does. This option can be used multiple times to increase the amount of information.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display version information and exit.
