### 4.4.3 mysql\_plugin — Configure MySQL Server Plugins

Note

[**mysql\_plugin**](mysql-plugin.html "4.4.3 mysql_plugin — Configure MySQL Server Plugins") is deprecated as of MySQL
5.7.11 and removed in MySQL 8.0. Alternatives
include loading plugins at server startup using the
[`--plugin-load`](server-options.html#option_mysqld_plugin-load) or
[`--plugin-load-add`](server-options.html#option_mysqld_plugin-load-add) option, or at
runtime using the [`INSTALL
PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") statement.

The [**mysql\_plugin**](mysql-plugin.html "4.4.3 mysql_plugin — Configure MySQL Server Plugins") utility enables MySQL
administrators to manage which plugins a MySQL server loads. It
provides an alternative to manually specifying the
[`--plugin-load`](server-options.html#option_mysqld_plugin-load) option at server
startup or using the [`INSTALL
PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") and [`UNINSTALL
PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement") statements at runtime.

Depending on whether [**mysql\_plugin**](mysql-plugin.html "4.4.3 mysql_plugin — Configure MySQL Server Plugins") is invoked
to enable or disable plugins, it inserts or deletes rows in the
`mysql.plugin` table that serves as a plugin
registry. (To perform this operation,
[**mysql\_plugin**](mysql-plugin.html "4.4.3 mysql_plugin — Configure MySQL Server Plugins") invokes the MySQL server in
bootstrap mode. This means that the server must not already be
running.) For normal server startups, the server loads and
enables plugins listed in `mysql.plugin`
automatically. For additional control over plugin activation,
use `--plugin_name`
options named for specific plugins, as described in
[Section 5.5.1, “Installing and Uninstalling Plugins”](plugin-loading.html "5.5.1 Installing and Uninstalling Plugins").

Each invocation of [**mysql\_plugin**](mysql-plugin.html "4.4.3 mysql_plugin — Configure MySQL Server Plugins") reads a
configuration file to determine how to configure the plugins
contained in a single plugin library file. To invoke
[**mysql\_plugin**](mysql-plugin.html "4.4.3 mysql_plugin — Configure MySQL Server Plugins"), use this syntax:

```sql
mysql_plugin [options] plugin {ENABLE|DISABLE}
```

*`plugin`* is the name of the plugin to
configure. `ENABLE` or
`DISABLE` (not case-sensitive) specify whether
to enable or disable components of the plugin library named in
the configuration file. The order of the
*`plugin`* and `ENABLE`
or `DISABLE` arguments does not matter.

For example, to configure components of a plugin library file
named `myplugins.so` on Linux or
`myplugins.dll` on Windows, specify a
*`plugin`* value of
`myplugins`. Suppose that this plugin library
contains three plugins, `plugin1`,
`plugin2`, and `plugin3`, all
of which should be configured under
[**mysql\_plugin**](mysql-plugin.html "4.4.3 mysql_plugin — Configure MySQL Server Plugins") control. By convention,
configuration files have a suffix of `.ini`
and the same base name as the plugin library, so the default
configuration file name for this plugin library is
`myplugins.ini`. The configuration file
contents look like this:

```sql
myplugins
plugin1
plugin2
plugin3
```

The first line in the `myplugins.ini` file is
the name of the library file, without any extension such as
`.so` or `.dll`. The
remaining lines are the names of the components to be enabled or
disabled. Each value in the file should be on a separate line.
Lines on which the first character is `'#'` are
taken as comments and ignored.

To enable the plugins listed in the configuration file, invoke
[**mysql\_plugin**](mysql-plugin.html "4.4.3 mysql_plugin — Configure MySQL Server Plugins") this way:

```sql
mysql_plugin myplugins ENABLE
```

To disable the plugins, use `DISABLE` rather
than `ENABLE`.

An error occurs if [**mysql\_plugin**](mysql-plugin.html "4.4.3 mysql_plugin — Configure MySQL Server Plugins") cannot find
the configuration file or plugin library file, or if
[**mysql\_plugin**](mysql-plugin.html "4.4.3 mysql_plugin — Configure MySQL Server Plugins") cannot start the MySQL server.

[**mysql\_plugin**](mysql-plugin.html "4.4.3 mysql_plugin — Configure MySQL Server Plugins") supports the following options,
which can be specified on the command line or in the
`[mysqld]` group of any option file. For
options specified in a `[mysqld]` group,
[**mysql\_plugin**](mysql-plugin.html "4.4.3 mysql_plugin — Configure MySQL Server Plugins") recognizes the
[`--basedir`](mysql-plugin.html#option_mysql_plugin_basedir),
[`--datadir`](mysql-plugin.html#option_mysql_plugin_datadir), and
[`--plugin-dir`](mysql-plugin.html#option_mysql_plugin_plugin-dir) options and
ignores others. For information about option files used by MySQL
programs, see [Section 4.2.2.2, “Using Option Files”](option-files.html "4.2.2.2 Using Option Files").

**Table 4.9 mysql\_plugin Options**

<table frame="box" rules="all" summary="Command-line options available for mysql_plugin."><col style="width: 35%"/><col style="width: 64%"/><thead><tr><th>Option Name</th>
<th>Description</th>
</tr></thead><tbody><tr><td>--basedir</td>
<td>The server base directory</td>
</tr><tr><td>--datadir</td>
<td>The server data directory</td>
</tr><tr><td>--help</td>
<td>Display help message and exit</td>
</tr><tr><td>--my-print-defaults</td>
<td>Path to my_print_defaults</td>
</tr><tr><td>--mysqld</td>
<td>Path to server</td>
</tr><tr><td>--no-defaults</td>
<td>Do not read configuration file</td>
</tr><tr><td>--plugin-dir</td>
<td>Directory where plugins are installed</td>
</tr><tr><td>--plugin-ini</td>
<td>The plugin configuration file</td>
</tr><tr><td>--print-defaults</td>
<td>Show configuration file defaults</td>
</tr><tr><td>--verbose</td>
<td>Verbose mode</td>
</tr><tr><td>--version</td>
<td>Display version information and exit</td>
</tr></tbody></table>

* [`--help`](mysql-plugin.html#option_mysql_plugin_help),
  `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--help</code></td>
</tr></tbody></table>

  Display a help message and exit.

* [`--basedir=dir_name`](mysql-plugin.html#option_mysql_plugin_basedir),
  `-b dir_name`

  <table frame="box" rules="all" summary="Properties for basedir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--basedir=dir_name</code></td>
</tr><tr><th>Type</th>
<td>Directory name</td>
</tr></tbody></table>

  The server base directory.

* [`--datadir=dir_name`](mysql-plugin.html#option_mysql_plugin_datadir),
  `-d dir_name`

  <table frame="box" rules="all" summary="Properties for datadir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--datadir=dir_name</code></td>
</tr><tr><th>Type</th>
<td>Directory name</td>
</tr></tbody></table>

  The server data directory.

* [`--my-print-defaults=file_name`](mysql-plugin.html#option_mysql_plugin_my-print-defaults),
  `-b file_name`

  <table frame="box" rules="all" summary="Properties for my-print-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--my-print-defaults=file_name</code></td>
</tr><tr><th>Type</th>
<td>File name</td>
</tr></tbody></table>

  The path to the [**my\_print\_defaults**](my-print-defaults.html "4.7.2 my_print_defaults — Display Options from Option Files")
  program.

* [`--mysqld=file_name`](mysql-plugin.html#option_mysql_plugin_mysqld),
  `-b file_name`

  <table frame="box" rules="all" summary="Properties for mysqld"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--mysqld=file_name</code></td>
</tr><tr><th>Type</th>
<td>File name</td>
</tr></tbody></table>

  The path to the [`mysqld`](mysqld.html "4.3.1 mysqld — The MySQL Server") server.

* [`--no-defaults`](mysql-plugin.html#option_mysql_plugin_no-defaults),
  `-p`

  <table frame="box" rules="all" summary="Properties for no-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--no-defaults</code></td>
</tr></tbody></table>

  Do not read values from the configuration file. This option
  enables an administrator to skip reading defaults from the
  configuration file.

  With [**mysql\_plugin**](mysql-plugin.html "4.4.3 mysql_plugin — Configure MySQL Server Plugins"), this option need not
  be given first on the command line, unlike most other MySQL
  programs that support
  [`--no-defaults`](mysql-plugin.html#option_mysql_plugin_no-defaults).

* [`--plugin-dir=dir_name`](mysql-plugin.html#option_mysql_plugin_plugin-dir),
  `-p dir_name`

  <table frame="box" rules="all" summary="Properties for plugin-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--plugin-dir=dir_name</code></td>
</tr><tr><th>Type</th>
<td>Directory name</td>
</tr></tbody></table>

  The server plugin directory.

* [`--plugin-ini=file_name`](mysql-plugin.html#option_mysql_plugin_plugin-ini),
  `-i file_name`

  <table frame="box" rules="all" summary="Properties for plugin-ini"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--plugin-ini=file_name</code></td>
</tr><tr><th>Type</th>
<td>File name</td>
</tr></tbody></table>

  The [**mysql\_plugin**](mysql-plugin.html "4.4.3 mysql_plugin — Configure MySQL Server Plugins") configuration file.
  Relative path names are interpreted relative to the current
  directory. If this option is not given, the default is
  `plugin.ini`
  in the plugin directory, where
  *`plugin`* is the
  *`plugin`* argument on the command
  line.

* [`--print-defaults`](mysql-plugin.html#option_mysql_plugin_print-defaults),
  `-P`

  <table frame="box" rules="all" summary="Properties for print-defaults"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--print-defaults</code></td>
</tr></tbody></table>

  Display the default values from the configuration file. This
  option causes [**mysql\_plugin**](mysql-plugin.html "4.4.3 mysql_plugin — Configure MySQL Server Plugins") to print the
  defaults for [`--basedir`](mysql-plugin.html#option_mysql_plugin_basedir),
  [`--datadir`](mysql-plugin.html#option_mysql_plugin_datadir), and
  [`--plugin-dir`](mysql-plugin.html#option_mysql_plugin_plugin-dir) if they
  are found in the configuration file. If no value for a
  variable is found, nothing is shown.

  With [**mysql\_plugin**](mysql-plugin.html "4.4.3 mysql_plugin — Configure MySQL Server Plugins"), this option need not
  be given first on the command line, unlike most other MySQL
  programs that support
  [`--print-defaults`](mysql-plugin.html#option_mysql_plugin_print-defaults).

* [`--verbose`](mysql-plugin.html#option_mysql_plugin_verbose),
  `-v`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--help</code></td>
</tr></tbody></table>0

  Verbose mode. Print more information about what the program
  does. This option can be used multiple times to increase the
  amount of information.

* [`--version`](mysql-plugin.html#option_mysql_plugin_version),
  `-V`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code>--help</code></td>
</tr></tbody></table>1

  Display version information and exit.