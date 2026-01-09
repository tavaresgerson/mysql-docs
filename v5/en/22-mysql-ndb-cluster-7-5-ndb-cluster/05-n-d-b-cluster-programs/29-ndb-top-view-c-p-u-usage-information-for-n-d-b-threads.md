### 21.5.29 ndb\_top — View CPU usage information for NDB threads

[**ndb\_top**](mysql-cluster-programs-ndb-top.html "21.5.29 ndb_top — View CPU usage information for NDB threads") displays running information in the terminal about CPU usage by NDB threads on an NDB Cluster data node. Each thread is represented by two rows in the output, the first showing system statistics, the second showing the measured statistics for the thread.

[**ndb\_top**](mysql-cluster-programs-ndb-top.html "21.5.29 ndb_top — View CPU usage information for NDB threads") is available in MySQL NDB Cluster 7.6 (and later).

#### Usage

```sql
ndb_top [-h hostname] [-t port] [-u user] [-p pass] [-n node_id]
```

[**ndb\_top**](mysql-cluster-programs-ndb-top.html "21.5.29 ndb_top — View CPU usage information for NDB threads") connects to a MySQL Server running as an SQL node of the cluster. By default, it attempts to connect to a [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") running on `localhost` and port 3306, as the MySQL `root` user with no password specified. You can override the default host and port using, respectively, [`--host`](mysql-cluster-programs-ndb-top.html#option_ndb_top_host) (`-h`) and [`--port`](mysql-cluster-programs-ndb-top.html#option_ndb_top_port) (`-t`). To specify a MySQL user and password, use the [`--user`](mysql-cluster-programs-ndb-top.html#option_ndb_top_user) (`-u`) and [`--passwd`](mysql-cluster-programs-ndb-top.html#option_ndb_top_passwd) (`-p`) options. This user must be able to read tables in the [`ndbinfo`](mysql-cluster-ndbinfo.html "21.6.15 ndbinfo: The NDB Cluster Information Database") database ([**ndb\_top**](mysql-cluster-programs-ndb-top.html "21.5.29 ndb_top — View CPU usage information for NDB threads") uses information from [`ndbinfo.cpustat`](mysql-cluster-ndbinfo-cpustat.html "21.6.15.11 The ndbinfo cpustat Table") and related tables).

For more information about MySQL user accounts and passwords, see [Section 6.2, “Access Control and Account Management”](access-control.html "6.2 Access Control and Account Management").

Output is available as plain text or an ASCII graph; you can specify this using the [`--text`](mysql-cluster-programs-ndb-top.html#option_ndb_top_text) (`-x`) and [`--graph`](mysql-cluster-programs-ndb-top.html#option_ndb_top_graph) (`-g`) options, respectively. These two display modes provide the same information; they can be used concurrently. At least one display mode must be in use.

Color display of the graph is supported and enabled by default ([`--color`](mysql-cluster-programs-ndb-top.html#option_ndb_top_color) or `-c` option). With color support enabled, the graph display shows OS user time in blue, OS system time in green, and idle time as blank. For measured load, blue is used for execution time, yellow for send time, red for time spent in send buffer full waits, and blank spaces for idle time. The percentage shown in the graph display is the sum of percentages for all threads which are not idle. Colors are not currently configurable; you can use grayscale instead by using `--skip-color`.

The sorted view ([`--sort`](mysql-cluster-programs-ndb-top.html#option_ndb_top_sort), `-r`) is based on the maximum of the measured load and the load reported by the OS. Display of these can be enabled and disabled using the [`--measured-load`](mysql-cluster-programs-ndb-top.html#option_ndb_top_measured-load) (`-m`) and [`--os-load`](mysql-cluster-programs-ndb-top.html#option_ndb_top_os-load) (`-o`) options. Display of at least one of these loads must be enabled.

The program tries to obtain statistics from a data node having the node ID given by the [`--node-id`](mysql-cluster-programs-ndb-top.html#option_ndb_top_node-id) (`-n`) option; if unspecified, this is 1. [**ndb\_top**](mysql-cluster-programs-ndb-top.html "21.5.29 ndb_top — View CPU usage information for NDB threads") cannot provide information about other types of nodes.

The view adjusts itself to the height and width of the terminal window; the minimum supported width is 76 characters.

Once started, [**ndb\_top**](mysql-cluster-programs-ndb-top.html "21.5.29 ndb_top — View CPU usage information for NDB threads") runs continuously until forced to exit; you can quit the program using `Ctrl-C`. The display updates once per second; to set a different delay interval, use [`--sleep-time`](mysql-cluster-programs-ndb-top.html#option_ndb_top_sleep-time) (`-s`).

Note

[**ndb\_top**](mysql-cluster-programs-ndb-top.html "21.5.29 ndb_top — View CPU usage information for NDB threads") is available on macOS, Linux, and Solaris. It is not currently supported on Windows platforms.

The following table includes all options that are specific to the NDB Cluster program [**ndb\_top**](mysql-cluster-programs-ndb-top.html "21.5.29 ndb_top — View CPU usage information for NDB threads"). Additional descriptions follow the table.

**Table 21.45 Command-line options used with the program ndb\_top**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Format</th> <th>Description</th> <th>Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_color">--color</a></code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_color">-c</a> </code> </p></th> <td>Show ASCII graphs in color; use --skip-colors to disable</td> <td><p> ADDED: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_defaults-extra-file">--defaults-extra-file=path</a> </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_defaults-file">--defaults-file=path</a> </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_defaults-group-suffix">--defaults-group-suffix=string</a> </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_graph">--graph</a></code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_graph">-g</a> </code> </p></th> <td>Display data using graphs; use --skip-graphs to disable</td> <td><p> ADDED: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_help">--help</a> </code> </p></th> <td>Show program usage information</td> <td><p> ADDED: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_host">--host=string</a></code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_host">-h string</a> </code> </p></th> <td>Host name or IP address of MySQL Server to connect to</td> <td><p> ADDED: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_login-path">--login-path=path</a> </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_measured-load">--measured-load</a></code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_measured-load">-m</a> </code> </p></th> <td>Show measured load by thread</td> <td><p> ADDED: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_no-defaults">--no-defaults</a> </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_node-id">--node-id=#</a></code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_node-id">-n
                #</a> </code> </p></th> <td>Watch node having this node ID</td> <td><p> ADDED: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_os-load">--os-load</a></code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_os-load">-o</a> </code> </p></th> <td>Show load measured by operating system</td> <td><p> ADDED: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_passwd">--passwd=password</a></code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_passwd">-p password</a> </code> </p></th> <td>Connect using this password (same as --password option)</td> <td><p> ADDED: NDB 7.6.3 </p><p> REMOVED: NDB 7.6.4 </p></td> </tr></tbody><tbody><tr> <th><p> <code><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_password">--password=password</a></code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_password">-p password</a> </code> </p></th> <td>Connect using this password</td> <td><p> ADDED: NDB 7.6.6 </p></td> </tr></tbody><tbody><tr> <th><p> <code><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_port">--port=#</a></code>, </p><p> <code><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_port">-t
                #</a></code> (&lt;=7.6.5), </p><p> <code><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_port">-P
                #</a></code> (&gt;=7.6.6) </p></th> <td>Port number to use when connecting to MySQL Server</td> <td><p> ADDED: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_print-defaults">--print-defaults</a> </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_sleep-time">--sleep-time=#</a></code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_sleep-time">-s
                #</a> </code> </p></th> <td>Time to wait between display refreshes, in seconds</td> <td><p> ADDED: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_socket">--socket=path</a></code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_socket">-S path</a> </code> </p></th> <td>Socket file to use for connection</td> <td><p> ADDED: NDB 7.6.6 </p></td> </tr></tbody><tbody><tr> <th><p> <code><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_sort">--sort</a></code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_sort">-r</a> </code> </p></th> <td>Sort threads by usage; use --skip-sort to disable</td> <td><p> ADDED: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_text">--text</a></code>, </p><p> <code><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_text">-x</a></code> (&lt;=7.6.5), </p><p> <code><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_text">-t</a></code> (&gt;=7.6.6) </p></th> <td>Display data using text</td> <td><p> ADDED: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_usage">--usage</a> </code> </p></th> <td>Show program usage information; same as --help</td> <td><p> ADDED: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_user">--user=name</a></code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_user">-u name</a> </code> </p></th> <td>Connect as this MySQL user</td> <td><p> ADDED: NDB 7.6.3 </p></td> </tr></tbody></table>

#### Additional Options

* `--color`, `-c`

  <table frame="box" rules="all" summary="Properties for color"><tbody><tr><th>Command-Line Format</th> <td><code>--color</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Show ASCII graphs in color; use `--skip-colors` to disable.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read given file after global files are read.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read default options from given file only.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Also read groups with concat(group, suffix).

* `--graph`, `-g`

  <table frame="box" rules="all" summary="Properties for graph"><tbody><tr><th>Command-Line Format</th> <td><code>--graph</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Display data using graphs; use `--skip-graphs` to disable. This option or [`--text`](mysql-cluster-programs-ndb-top.html#option_ndb_top_text) must be true; both options may be true.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Show program usage information.

* `--host[`=*`name]`*, `-h`

  <table frame="box" rules="all" summary="Properties for host"><tbody><tr><th>Command-Line Format</th> <td><code>--host=string</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.3</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost</code></td> </tr></tbody></table>

  Host name or IP address of MySQL Server to connect to.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for login-path"><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read given path from login file.

* `--measured-load`, `-m`

  <table frame="box" rules="all" summary="Properties for measured-load"><tbody><tr><th>Command-Line Format</th> <td><code>--measured-load</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Show measured load by thread. This option or [`--os-load`](mysql-cluster-programs-ndb-top.html#option_ndb_top_os-load) must be true; both options may be true.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for color"><tbody><tr><th>Command-Line Format</th> <td><code>--color</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Do not read default options from any option file other than login file.

* `--node-id[`=*`#]`*, `-n`

  <table frame="box" rules="all" summary="Properties for color"><tbody><tr><th>Command-Line Format</th> <td><code>--color</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Watch the data node having this node ID.

* `--os-load`, `-o`

  <table frame="box" rules="all" summary="Properties for color"><tbody><tr><th>Command-Line Format</th> <td><code>--color</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Show load measured by operating system. This option or [`--measured-load`](mysql-cluster-programs-ndb-top.html#option_ndb_top_measured-load) must be true; both options may be true.

* `--passwd[`=*`password]`*, `-p`

  <table frame="box" rules="all" summary="Properties for color"><tbody><tr><th>Command-Line Format</th> <td><code>--color</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Connect to a MySQL Server using this password and the MySQL user specified by [`--user`](mysql-cluster-programs-ndb-top.html#option_ndb_top_user). Synonym for [`--password`](mysql-cluster-programs-ndb-top.html#option_ndb_top_password).

  This password is associated with a MySQL user account only, and is not related in any way to the password used with encrypted `NDB` backups.

* `--password[`=*`password]`*, `-p`

  <table frame="box" rules="all" summary="Properties for color"><tbody><tr><th>Command-Line Format</th> <td><code>--color</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Connect to a MySQL Server using this password and the MySQL user specified by [`--user`](mysql-cluster-programs-ndb-top.html#option_ndb_top_user).

  This password is associated with a MySQL user account only, and is not related in any way to the password used with encrypted `NDB` backups.

* `--port[`=*`#]`*, `-P`

  <table frame="box" rules="all" summary="Properties for color"><tbody><tr><th>Command-Line Format</th> <td><code>--color</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Port number to use when connecting to MySQL Server.

  (Formerly, the short form for this option was `-t`, which was repurposed as the short form of [`--text`](mysql-cluster-programs-ndb-top.html#option_ndb_top_text).)

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for color"><tbody><tr><th>Command-Line Format</th> <td><code>--color</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Print program argument list and exit.

* `--sleep-time[`=*`seconds]`*, `-s`

  <table frame="box" rules="all" summary="Properties for color"><tbody><tr><th>Command-Line Format</th> <td><code>--color</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Time to wait between display refreshes, in seconds.

* `--socket=path/to/file`, *`-S`*

  <table frame="box" rules="all" summary="Properties for color"><tbody><tr><th>Command-Line Format</th> <td><code>--color</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Use the specified socket file for the connection.

* `--sort`, `-r`

  <table frame="box" rules="all" summary="Properties for color"><tbody><tr><th>Command-Line Format</th> <td><code>--color</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Sort threads by usage; use `--skip-sort` to disable.

* `--text`, `-t`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Display data using text. This option or [`--graph`](mysql-cluster-programs-ndb-top.html#option_ndb_top_graph) must be true; both options may be true.

  (The short form for this option was `-x` in previous versions of NDB Cluster, but this is no longer supported.)

* `--usage`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Display help text and exit; same as [`--help`](mysql-cluster-programs-ndb-top.html#option_ndb_top_help).

* `--user[`=*`name]`*, `-u`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Connect as this MySQL user. Normally requires a password supplied by the [`--password`](mysql-cluster-programs-ndb-top.html#option_ndb_top_password) option.

**Sample Output.** The next figure shows [**ndb\_top**](mysql-cluster-programs-ndb-top.html "21.5.29 ndb_top — View CPU usage information for NDB threads") running in a terminal window on a Linux system with an [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") data node under a moderate load. Here, the program has been invoked using [**ndb\_top**](mysql-cluster-programs-ndb-top.html "21.5.29 ndb_top — View CPU usage information for NDB threads") [`-n8`](mysql-cluster-programs-ndb-top.html#option_ndb_top_node-id) [`-x`](mysql-cluster-programs-ndb-top.html#option_ndb_top_text) to provide both text and graph output:

**Figure 21.7 ndb\_top Running in Terminal**

![Display from ndb_top, running in a terminal window. Shows information for each node, including the utilized resources.](images/ndb-top-1.png)
