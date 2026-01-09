### 21.5.4 ndb\_mgmd — The NDB Cluster Management Server Daemon

The management server is the process that reads the cluster configuration file and distributes this information to all nodes in the cluster that request it. It also maintains a log of cluster activities. Management clients can connect to the management server and check the cluster's status.

Options that can be used with [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") are shown in the following table. Additional descriptions follow the table.

**Table 21.24 Command-line options used with the program ndb\_mgmd**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Format</th> <th>Description</th> <th>Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_bind-address">--bind-address=host</a> </code> </p></th> <td>Local bind address</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_character-sets-dir">--character-sets-dir=path</a> </code> </p></th> <td>Directory containing character sets</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-cache">--config-cache[=TRUE|FALSE]</a> </code> </p></th> <td>Enable management server configuration cache; true by default</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file">--config-file=file</a></code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file">-f file</a> </code> </p></th> <td>Specify cluster configuration file; also specify --reload or --initial to override configuration cache if present</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_configdir">--configdir=directory</a></code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_configdir">--config-dir=directory</a> </code> </p></th> <td>Specify cluster management server configuration cache directory</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_connect-retries">--connect-retries=#</a> </code> </p></th> <td>Number of times to retry connection before giving up</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_connect-retry-delay">--connect-retry-delay=#</a> </code> </p></th> <td>Number of seconds to wait between attempts to contact management server</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_connect-string">--connect-string=connection_string</a></code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_connect-string">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_core-file">--core-file</a> </code> </p></th> <td>Write core file on error; used in debugging</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_daemon">--daemon</a></code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_daemon">-d</a> </code> </p></th> <td>Run ndb_mgmd in daemon mode (default)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_defaults-extra-file">--defaults-extra-file=path</a> </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_defaults-file">--defaults-file=path</a> </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_defaults-group-suffix">--defaults-group-suffix=string</a> </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_help">--help</a></code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_help">-?</a> </code> </p></th> <td>Display help text and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_initial">--initial</a> </code> </p></th> <td>Causes management server to reload configuration data from configuration file, bypassing configuration cache</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_install">--install[=name]</a> </code> </p></th> <td>Used to install management server process as Windows service; does not apply on other platforms</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_interactive">--interactive</a> </code> </p></th> <td>Run ndb_mgmd in interactive mode (not officially supported in production; for testing purposes only)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_log-name">--log-name=name</a> </code> </p></th> <td>Name to use when writing cluster log messages applying to this node</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_login-path">--login-path=path</a> </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_mycnf">--mycnf</a> </code> </p></th> <td>Read cluster configuration data from my.cnf file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_ndb-connectstring">--ndb-connectstring=connection_string</a></code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_ndb-mgmd-host">--ndb-mgmd-host=connection_string</a></code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_ndb-nodeid">--ndb-nodeid=#</a> </code> </p></th> <td>Set node ID for this node, overriding any ID set by --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_ndb-optimized-node-selection">--ndb-optimized-node-selection</a> </code> </p></th> <td>Enable optimizations for selection of nodes for transactions. Enabled by default; use --skip-ndb-optimized-node-selection to disable</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_no-defaults">--no-defaults</a> </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_no-nodeid-checks">--no-nodeid-checks</a> </code> </p></th> <td>Do not perform any node ID checks</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_nodaemon">--nodaemon</a> </code> </p></th> <td>Do not run ndb_mgmd as a daemon</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_nowait-nodes">--nowait-nodes=list</a> </code> </p></th> <td>Do not wait for management nodes specified when starting this management server; requires --ndb-nodeid option</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_print-defaults">--print-defaults</a> </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_print-full-config">--print-full-config</a></code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_print-full-config">-P</a> </code> </p></th> <td>Print full configuration and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_reload">--reload</a> </code> </p></th> <td>Causes management server to compare configuration file with configuration cache</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_remove">--remove[=name]</a> </code> </p></th> <td>Used to remove management server process that was previously installed as Windows service, optionally specifying name of service to be removed; does not apply on other platforms</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_skip-config-file">--skip-config-file</a> </code> </p></th> <td>Do not use configuration file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_usage">--usage</a></code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_usage">-?</a> </code> </p></th> <td>Display help text and exit; same as --help</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_verbose">--verbose</a></code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_verbose">-v</a> </code> </p></th> <td>Write additional information to log</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code><a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_version">--version</a></code>, </p><p> <code> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_version">-V</a> </code> </p></th> <td>Display version information and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody></table>

* `--bind-address=host`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Causes the management server to bind to a specific network interface (host name or IP address). This option has no default value.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Directory containing character sets.

* `--config-cache`

  <table frame="box" rules="all" summary="Properties for config-cache"><tbody><tr><th>Command-Line Format</th> <td><code>--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>TRUE</code></td> </tr></tbody></table>

  This option, whose default value is `1` (or `TRUE`, or `ON`), can be used to disable the management server's configuration cache, so that it reads its configuration from `config.ini` every time it starts (see [Section 21.4.3, “NDB Cluster Configuration Files”](mysql-cluster-config-file.html "21.4.3 NDB Cluster Configuration Files")). You can do this by starting the [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") process with any one of the following options:

  + `--config-cache=0`
  + `--config-cache=FALSE`
  + `--config-cache=OFF`
  + `--skip-config-cache`

  Using one of the options just listed is effective only if the management server has no stored configuration at the time it is started. If the management server finds any configuration cache files, then the `--config-cache` option or the `--skip-config-cache` option is ignored. Therefore, to disable configuration caching, the option should be used the *first* time that the management server is started. Otherwise—that is, if you wish to disable configuration caching for a management server that has *already* created a configuration cache—you must stop the management server, delete any existing configuration cache files manually, then restart the management server with `--skip-config-cache` (or with `--config-cache` set equal to 0, `OFF`, or `FALSE`).

  Configuration cache files are normally created in a directory named `mysql-cluster` under the installation directory (unless this location has been overridden using the [`--configdir`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_configdir) option). Each time the management server updates its configuration data, it writes a new cache file. The files are named sequentially in order of creation using the following format:

  ```sql
  ndb_node-id_config.bin.seq-number
  ```

  *`node-id`* is the management server's node ID; *`seq-number`* is a sequence number, beginning with 1. For example, if the management server's node ID is 5, then the first three configuration cache files would, when they are created, be named `ndb_5_config.bin.1`, `ndb_5_config.bin.2`, and `ndb_5_config.bin.3`.

  If your intent is to purge or reload the configuration cache without actually disabling caching, you should start [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") with one of the options [`--reload`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_reload) or [`--initial`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_initial) instead of `--skip-config-cache`.

  To re-enable the configuration cache, simply restart the management server, but without the `--config-cache` or `--skip-config-cache` option that was used previously to disable the configuration cache.

  [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") does not check for the configuration directory ([`--configdir`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_configdir)) or attempts to create one when `--skip-config-cache` is used. (Bug #13428853)

* `--config-file=filename`, `-f filename`

  <table frame="box" rules="all" summary="Properties for config-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-config-file</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Instructs the management server as to which file it should use for its configuration file. By default, the management server looks for a file named `config.ini` in the same directory as the [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") executable; otherwise the file name and location must be specified explicitly.

  This option has no default value, and is ignored unless the management server is forced to read the configuration file, either because [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") was started with the [`--reload`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_reload) or [`--initial`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_initial) option, or because the management server could not find any configuration cache.

  The [`--config-file`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file) option is also read if [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") was started with [`--config-cache=OFF`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-cache). See [Section 21.4.3, “NDB Cluster Configuration Files”](mysql-cluster-config-file.html "21.4.3 NDB Cluster Configuration Files"), for more information.

* `--configdir=dir_name`

  <table frame="box" rules="all" summary="Properties for configdir"><tbody><tr><th>Command-Line Format</th> <td><p class="valid-value"><code>--configdir=directory</code></p><p class="valid-value"><code>--config-dir=directory</code></p></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>$INSTALLDIR/mysql-cluster</code></td> </tr></tbody></table>

  Specifies the cluster management server's configuration cache directory. `--config-dir` is an alias for this option.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

  Number of times to retry connection before giving up.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

  Number of seconds to wait between attempts to contact management server.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Same as [`--ndb-connectstring`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_ndb-connectstring).

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Write core file on error; used in debugging.

* `--daemon`, `-d`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Instructs [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") to start as a daemon process. This is the default behavior.

  This option has no effect when running [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") on Windows platforms.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read given file after global files are read.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read default options from given file only.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Also read groups with concat(group, suffix).

* `--help`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Display help text and exit.

* `--initial`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Configuration data is cached internally, rather than being read from the cluster global configuration file each time the management server is started (see [Section 21.4.3, “NDB Cluster Configuration Files”](mysql-cluster-config-file.html "21.4.3 NDB Cluster Configuration Files")). Using the `--initial` option overrides this behavior, by forcing the management server to delete any existing cache files, and then to re-read the configuration data from the cluster configuration file and to build a new cache.

  This differs in two ways from the [`--reload`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_reload) option. First, `--reload` forces the server to check the configuration file against the cache and reload its data only if the contents of the file are different from the cache. Second, `--reload` does not delete any existing cache files.

  If [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") is invoked with `--initial` but cannot find a global configuration file, the management server cannot start.

  When a management server starts, it checks for another management server in the same NDB Cluster and tries to use the other management server's configuration data. This behavior has implications when performing a rolling restart of an NDB Cluster with multiple management nodes. See [Section 21.6.5, “Performing a Rolling Restart of an NDB Cluster”](mysql-cluster-rolling-restart.html "21.6.5 Performing a Rolling Restart of an NDB Cluster"), for more information.

  When used together with the [`--config-file`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file) option, the cache is cleared only if the configuration file is actually found.

* `--install[=name]`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Causes [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") to be installed as a Windows service. Optionally, you can specify a name for the service; if not set, the service name defaults to `ndb_mgmd`. Although it is preferable to specify other [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") program options in a `my.ini` or `my.cnf` configuration file, it is possible to use them together with [`--install`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_install). However, in such cases, the [`--install`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_install) option must be specified first, before any other options are given, for the Windows service installation to succeed.

  It is generally not advisable to use this option together with the [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial) option, since this causes the configuration cache to be wiped and rebuilt every time the service is stopped and started. Care should also be taken if you intend to use any other [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") options that affect the starting of the management server, and you should make absolutely certain you fully understand and allow for any possible consequences of doing so.

  The [`--install`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_install) option has no effect on non-Windows platforms.

* `--interactive`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Starts [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") in interactive mode; that is, an [**ndb\_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") client session is started as soon as the management server is running. This option does not start any other NDB Cluster nodes.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read given path from login file.

* `--log-name=name`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Provides a name to be used for this node in the cluster log.

* `--mycnf`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Read configuration data from the `my.cnf` file.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Set connection string. Syntax: `[nodeid=id;][host=]hostname[:port]`. Overrides entries in `NDB_CONNECTSTRING` and `my.cnf`; ignored if [`--config-file`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file) is specified.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Same as [`--ndb-connectstring`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_ndb-connectstring).

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Set node ID for this node, overriding any ID set by [`--ndb-connectstring`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_ndb-connectstring).

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Do not read default options from any option file other than login file.

* `--no-nodeid-checks`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Do not perform any checks of node IDs.

* `--nodaemon`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Instructs [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") not to start as a daemon process.

  The default behavior for [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") on Windows is to run in the foreground, making this option unnecessary on Windows platforms.

* `--nowait-nodes`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  When starting an NDB Cluster is configured with two management nodes, each management server normally checks to see whether the other [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") is also operational and whether the other management server's configuration is identical to its own. However, it is sometimes desirable to start the cluster with only one management node (and perhaps to allow the other [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") to be started later). This option causes the management node to bypass any checks for any other management nodes whose node IDs are passed to this option, permitting the cluster to start as though configured to use only the management node that was started.

  For purposes of illustration, consider the following portion of a `config.ini` file (where we have omitted most of the configuration parameters that are not relevant to this example):

  ```sql
  [ndbd]
  NodeId = 1
  HostName = 198.51.100.101

  [ndbd]
  NodeId = 2
  HostName = 198.51.100.102

  [ndbd]
  NodeId = 3
  HostName = 198.51.100.103

  [ndbd]
  NodeId = 4
  HostName = 198.51.100.104

  [ndb_mgmd]
  NodeId = 10
  HostName = 198.51.100.150

  [ndb_mgmd]
  NodeId = 11
  HostName = 198.51.100.151

  [api]
  NodeId = 20
  HostName = 198.51.100.200

  [api]
  NodeId = 21
  HostName = 198.51.100.201
  ```

  Assume that you wish to start this cluster using only the management server having node ID `10` and running on the host having the IP address 198.51.100.150. (Suppose, for example, that the host computer on which you intend to the other management server is temporarily unavailable due to a hardware failure, and you are waiting for it to be repaired.) To start the cluster in this way, use a command line on the machine at 198.51.100.150 to enter the following command:

  ```sql
  $> ndb_mgmd --ndb-nodeid=10 --nowait-nodes=11
  ```

  As shown in the preceding example, when using [`--nowait-nodes`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_nowait-nodes), you must also use the [`--ndb-nodeid`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_ndb-nodeid) option to specify the node ID of this [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") process.

  You can then start each of the cluster's data nodes in the usual way. If you wish to start and use the second management server in addition to the first management server at a later time without restarting the data nodes, you must start each data node with a connection string that references both management servers, like this:

  ```sql
  $> ndbd -c 198.51.100.150,198.51.100.151
  ```

  The same is true with regard to the connection string used with any [**mysqld**](mysqld.html "4.3.1 mysqld — The MySQL Server") processes that you wish to start as NDB Cluster SQL nodes connected to this cluster. See [Section 21.4.3.3, “NDB Cluster Connection Strings”](mysql-cluster-connection-strings.html "21.4.3.3 NDB Cluster Connection Strings"), for more information.

  When used with [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon"), this option affects the behavior of the management node with regard to other management nodes only. Do not confuse it with the [`--nowait-nodes`](mysql-cluster-programs-ndbd.html#option_ndbd_nowait-nodes) option used with [**ndbd**](mysql-cluster-programs-ndbd.html "21.5.1 ndbd — The NDB Cluster Data Node Daemon") or [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") to permit a cluster to start with fewer than its full complement of data nodes; when used with data nodes, this option affects their behavior only with regard to other data nodes.

  Multiple management node IDs may be passed to this option as a comma-separated list. Each node ID must be no less than 1 and no greater than 255. In practice, it is quite rare to use more than two management servers for the same NDB Cluster (or to have any need for doing so); in most cases you need to pass to this option only the single node ID for the one management server that you do not wish to use when starting the cluster.

  Note

  When you later start the “missing” management server, its configuration must match that of the management server that is already in use by the cluster. Otherwise, it fails the configuration check performed by the existing management server, and does not start.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Print program argument list and exit.

* `--print-full-config`, `-P`

  <table frame="box" rules="all" summary="Properties for config-cache"><tbody><tr><th>Command-Line Format</th> <td><code>--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>TRUE</code></td> </tr></tbody></table>

  Shows extended information regarding the configuration of the cluster. With this option on the command line the [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") process prints information about the cluster setup including an extensive list of the cluster configuration sections as well as parameters and their values. Normally used together with the [`--config-file`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file) (`-f`) option.

* `--reload`

  <table frame="box" rules="all" summary="Properties for config-cache"><tbody><tr><th>Command-Line Format</th> <td><code>--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>TRUE</code></td> </tr></tbody></table>

  NDB Cluster configuration data is stored internally rather than being read from the cluster global configuration file each time the management server is started (see [Section 21.4.3, “NDB Cluster Configuration Files”](mysql-cluster-config-file.html "21.4.3 NDB Cluster Configuration Files")). Using this option forces the management server to check its internal data store against the cluster configuration file and to reload the configuration if it finds that the configuration file does not match the cache. Existing configuration cache files are preserved, but not used.

  This differs in two ways from the [`--initial`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_initial) option. First, `--initial` causes all cache files to be deleted. Second, `--initial` forces the management server to re-read the global configuration file and construct a new cache.

  If the management server cannot find a global configuration file, then the `--reload` option is ignored.

  When `--reload` is used, the management server must be able to communicate with data nodes and any other management servers in the cluster before it attempts to read the global configuration file; otherwise, the management server fails to start. This can happen due to changes in the networking environment, such as new IP addresses for nodes or an altered firewall configuration. In such cases, you must use [`--initial`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_initial) instead to force the exsiting cached configuration to be discarded and reloaded from the file. See [Section 21.6.5, “Performing a Rolling Restart of an NDB Cluster”](mysql-cluster-rolling-restart.html "21.6.5 Performing a Rolling Restart of an NDB Cluster"), for additional information.

* `--remove{=name]`

  <table frame="box" rules="all" summary="Properties for config-cache"><tbody><tr><th>Command-Line Format</th> <td><code>--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>TRUE</code></td> </tr></tbody></table>

  Remove a management server process that has been installed as a Windows service, optionally specifying the name of the service to be removed. Applies only to Windows platforms.

* `--skip-config-file`

  <table frame="box" rules="all" summary="Properties for config-cache"><tbody><tr><th>Command-Line Format</th> <td><code>--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>TRUE</code></td> </tr></tbody></table>

  Do not read cluster configuration file; ignore [`--initial`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_initial) and [`--reload`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_reload) options if specified.

* `--usage`

  <table frame="box" rules="all" summary="Properties for config-cache"><tbody><tr><th>Command-Line Format</th> <td><code>--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>TRUE</code></td> </tr></tbody></table>

  Display help text and exit; same as [`--help`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_help).

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for config-cache"><tbody><tr><th>Command-Line Format</th> <td><code>--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>TRUE</code></td> </tr></tbody></table>

  Remove a management server process that has been installed as a Windows service, optionally specifying the name of the service to be removed. Applies only to Windows platforms.

* `--version`

  <table frame="box" rules="all" summary="Properties for config-cache"><tbody><tr><th>Command-Line Format</th> <td><code>--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>TRUE</code></td> </tr></tbody></table>

  Display version information and exit.

It is not strictly necessary to specify a connection string when starting the management server. However, if you are using more than one management server, a connection string should be provided and each node in the cluster should specify its node ID explicitly.

See [Section 21.4.3.3, “NDB Cluster Connection Strings”](mysql-cluster-connection-strings.html "21.4.3.3 NDB Cluster Connection Strings"), for information about using connection strings. [Section 21.5.4, “ndb\_mgmd — The NDB Cluster Management Server Daemon”](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon"), describes other options for [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon").

The following files are created or used by [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "21.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon") in its starting directory, and are placed in the [`DataDir`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datadir) as specified in the `config.ini` configuration file. In the list that follows, *`node_id`* is the unique node identifier.

* `config.ini` is the configuration file for the cluster as a whole. This file is created by the user and read by the management server. [Section 21.4, “Configuration of NDB Cluster”](mysql-cluster-configuration.html "21.4 Configuration of NDB Cluster"), discusses how to set up this file.

* `ndb_node_id_cluster.log` is the cluster events log file. Examples of such events include checkpoint startup and completion, node startup events, node failures, and levels of memory usage. A complete listing of cluster events with descriptions may be found in [Section 21.6, “Management of NDB Cluster”](mysql-cluster-management.html "21.6 Management of NDB Cluster").

  By default, when the size of the cluster log reaches one million bytes, the file is renamed to `ndb_node_id_cluster.log.seq_id`, where *`seq_id`* is the sequence number of the cluster log file. (For example: If files with the sequence numbers 1, 2, and 3 already exist, the next log file is named using the number `4`.) You can change the size and number of files, and other characteristics of the cluster log, using the [`LogDestination`](mysql-cluster-mgm-definition.html#ndbparam-mgmd-logdestination) configuration parameter.

* `ndb_node_id_out.log` is the file used for `stdout` and `stderr` when running the management server as a daemon.

* `ndb_node_id.pid` is the process ID file used when running the management server as a daemon.
