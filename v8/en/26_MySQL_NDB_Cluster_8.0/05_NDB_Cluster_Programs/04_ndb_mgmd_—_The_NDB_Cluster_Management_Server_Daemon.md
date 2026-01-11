### 25.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon

The management server is the process that reads the cluster configuration file and distributes this information to all nodes in the cluster that request it. It also maintains a log of cluster activities. Management clients can connect to the management server and check the cluster's status.

All options that can be used with **ndb_mgmd** are shown in the following table. Additional descriptions follow the table.

**Table 25.26 Command-line options used with the program ndb_mgmd**

<table frame="box" rules="all"><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code> --bind-address=host </code> </p></th> <td>Local bind address</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> REMOVED: 8.0.31 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --cluster-config-suffix=name </code> </p></th> <td>Override defaults group suffix when reading cluster_config sections in my.cnf file; used in testing</td> <td><p> ADDED: 8.0.24 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --config-cache[=TRUE|FALSE] </code> </p></th> <td>Enable management server configuration cache; true by default</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--config-file=file</code>, </p><p> <code> -f file </code> </p></th> <td>Specify cluster configuration file; also specify --reload or --initial to override configuration cache if present</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--configdir=directory</code>, </p><p> <code> --config-dir=directory </code> </p></th> <td>Specify cluster management server configuration cache directory</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retries=# </code> </p></th> <td>Number of times to retry connection before giving up</td> <td><p> REMOVED: 8.0.31 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retry-delay=# </code> </p></th> <td>Number of seconds to wait between attempts to contact management server</td> <td><p> REMOVED: 8.0.31 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --core-file </code> </p></th> <td>Write core file on error; used in debugging</td> <td><p> REMOVED: 8.0.31 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--daemon</code>, </p><p> <code> -d </code> </p></th> <td>Run ndb_mgmd in daemon mode (default)</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-extra-file=path </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-file=path </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-group-suffix=string </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code> -? </code> </p></th> <td>Display help text and exit</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --initial </code> </p></th> <td>Causes management server to reload configuration data from configuration file, bypassing configuration cache</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --install[=name] </code> </p></th> <td>Used to install management server process as Windows service; does not apply on other platforms</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --interactive </code> </p></th> <td>Run ndb_mgmd in interactive mode (not officially supported in production; for testing purposes only)</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --log-name=name </code> </p></th> <td>Name to use when writing cluster log messages applying to this node</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --login-path=path </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --mycnf </code> </p></th> <td>Read cluster configuration data from my.cnf file</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-nodeid=# </code> </p></th> <td>Set node ID for this node, overriding any ID set by --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-optimized-node-selection </code> </p></th> <td>Enable optimizations for selection of nodes for transactions. Enabled by default; use --skip-ndb-optimized-node-selection to disable</td> <td><p> REMOVED: 8.0.31 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-defaults </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-nodeid-checks </code> </p></th> <td>Do not perform any node ID checks</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --nodaemon </code> </p></th> <td>Do not run ndb_mgmd as a daemon</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --nowait-nodes=list </code> </p></th> <td>Do not wait for management nodes specified when starting this management server; requires --ndb-nodeid option</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-defaults </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--print-full-config</code>, </p><p> <code> -P </code> </p></th> <td>Print full configuration and exit</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --reload </code> </p></th> <td>Causes management server to compare configuration file with configuration cache</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --remove[=name] </code> </p></th> <td>Used to remove management server process that was previously installed as Windows service, optionally specifying name of service to be removed; does not apply on other platforms</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --skip-config-file </code> </p></th> <td>Do not use configuration file</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code> -? </code> </p></th> <td>Display help text and exit; same as --help</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--verbose</code>, </p><p> <code> -v </code> </p></th> <td>Write additional information to log</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code> -V </code> </p></th> <td>Display version information and exit</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody></table>

* `--bind-address=host`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Causes the management server to bind to a specific network interface (host name or IP address). This option has no default value.

* `--character-sets-dir`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>

  Directory containing character sets.

* `cluster-config-suffix`

  <table summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Override defaults group suffix when reading cluster configuration sections in `my.cnf`; used in testing.

* `--config-cache`

  <table summary="Properties for config-cache"><tbody><tr><th>Command-Line Format</th> <td><code>--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>TRUE</code></td> </tr></tbody></table>

  This option, whose default value is `1` (or `TRUE`, or `ON`), can be used to disable the management server's configuration cache, so that it reads its configuration from `config.ini` every time it starts (see Section 25.4.3, “NDB Cluster Configuration Files”). You can do this by starting the **ndb_mgmd** process with any one of the following options:

  + `--config-cache=0`
  + `--config-cache=FALSE`
  + `--config-cache=OFF`
  + `--skip-config-cache`

  Using one of the options just listed is effective only if the management server has no stored configuration at the time it is started. If the management server finds any configuration cache files, then the `--config-cache` option or the `--skip-config-cache` option is ignored. Therefore, to disable configuration caching, the option should be used the *first* time that the management server is started. Otherwise—that is, if you wish to disable configuration caching for a management server that has *already* created a configuration cache—you must stop the management server, delete any existing configuration cache files manually, then restart the management server with `--skip-config-cache` (or with `--config-cache` set equal to 0, `OFF`, or `FALSE`).

  Configuration cache files are normally created in a directory named `mysql-cluster` under the installation directory (unless this location has been overridden using the `--configdir` option). Each time the management server updates its configuration data, it writes a new cache file. The files are named sequentially in order of creation using the following format:

  ```
  ndb_node-id_config.bin.seq-number
  ```

  *`node-id`* is the management server's node ID; *`seq-number`* is a sequence number, beginning with 1. For example, if the management server's node ID is 5, then the first three configuration cache files would, when they are created, be named `ndb_5_config.bin.1`, `ndb_5_config.bin.2`, and `ndb_5_config.bin.3`.

  If your intent is to purge or reload the configuration cache without actually disabling caching, you should start **ndb_mgmd** with one of the options `--reload` or `--initial` instead of `--skip-config-cache`.

  To re-enable the configuration cache, simply restart the management server, but without the `--config-cache` or `--skip-config-cache` option that was used previously to disable the configuration cache.

  **ndb_mgmd** does not check for the configuration directory (`--configdir`) or attempts to create one when `--skip-config-cache` is used. (Bug #13428853)

* `--config-file=filename`, `-f filename`

  <table summary="Properties for config-file"><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-config-file</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Instructs the management server as to which file it should use for its configuration file. By default, the management server looks for a file named `config.ini` in the same directory as the **ndb_mgmd** executable; otherwise the file name and location must be specified explicitly.

  This option has no default value, and is ignored unless the management server is forced to read the configuration file, either because **ndb_mgmd** was started with the `--reload` or `--initial` option, or because the management server could not find any configuration cache. Beginning with NDB 8.0.26, **ndb_mgmd** refuses to start if `--config-file` is specified without either of `--initial` or `--reload`.

  The `--config-file` option is also read if **ndb_mgmd** was started with `--config-cache=OFF`. See Section 25.4.3, “NDB Cluster Configuration Files”, for more information.

* `--configdir=dir_name`

  <table summary="Properties for configdir"><tbody><tr><th>Command-Line Format</th> <td><p class="valid-value"><code>--configdir=directory</code></p><p class="valid-value"><code>--config-dir=directory</code></p></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>$INSTALLDIR/mysql-cluster</code></td> </tr></tbody></table>

  Specifies the cluster management server's configuration cache directory. `--config-dir` is an alias for this option.

  In NDB 8.0.27 and later, this must be an absolute path. Otherwise, the management server refuses to start.

* `--connect-retries`

  <table summary="Properties for connect-retries"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

  Number of times to retry connection before giving up.

* `--connect-retry-delay`

  <table summary="Properties for connect-retry-delay"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

  Number of seconds to wait between attempts to contact management server.

* `--connect-string`

  <table summary="Properties for connect-string"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Same as --ndb-connectstring.

* `--core-file`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>0

  Write core file on error; used in debugging.

* `--daemon`, `-d`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>1

  Instructs **ndb_mgmd** to start as a daemon process. This is the default behavior.

  This option has no effect when running **ndb_mgmd** on Windows platforms.

* `--defaults-extra-file`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>2

  Read given file after global files are read.

* `--defaults-file`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>3

  Read default options from given file only.

* `--defaults-group-suffix`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>4

  Also read groups with concat(group, suffix).

* `--help`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>5

  Display help text and exit.

* `--initial`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>6

  Configuration data is cached internally, rather than being read from the cluster global configuration file each time the management server is started (see Section 25.4.3, “NDB Cluster Configuration Files”). Using the `--initial` option overrides this behavior, by forcing the management server to delete any existing cache files, and then to re-read the configuration data from the cluster configuration file and to build a new cache.

  This differs in two ways from the `--reload` option. First, `--reload` forces the server to check the configuration file against the cache and reload its data only if the contents of the file are different from the cache. Second, `--reload` does not delete any existing cache files.

  If **ndb_mgmd** is invoked with `--initial` but cannot find a global configuration file, the management server cannot start.

  When a management server starts, it checks for another management server in the same NDB Cluster and tries to use the other management server's configuration data. This behavior has implications when performing a rolling restart of an NDB Cluster with multiple management nodes. See Section 25.6.5, “Performing a Rolling Restart of an NDB Cluster”, for more information.

  When used together with the `--config-file` option, the cache is cleared only if the configuration file is actually found.

* `--install[=name]`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>7

  Causes **ndb_mgmd** to be installed as a Windows service. Optionally, you can specify a name for the service; if not set, the service name defaults to `ndb_mgmd`. Although it is preferable to specify other **ndb_mgmd** program options in a `my.ini` or `my.cnf` configuration file, it is possible to use them together with `--install`. However, in such cases, the `--install` option must be specified first, before any other options are given, for the Windows service installation to succeed.

  It is generally not advisable to use this option together with the `--initial` option, since this causes the configuration cache to be wiped and rebuilt every time the service is stopped and started. Care should also be taken if you intend to use any other **ndb_mgmd** options that affect the starting of the management server, and you should make absolutely certain you fully understand and allow for any possible consequences of doing so.

  The `--install` option has no effect on non-Windows platforms.

* `--interactive`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>8

  Starts **ndb_mgmd** in interactive mode; that is, an **ndb_mgm** client session is started as soon as the management server is running. This option does not start any other NDB Cluster nodes.

* `--log-name=name`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>9

  Provides a name to be used for this node in the cluster log.

* `--login-path`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>0

  Read given path from login file.

* `--mycnf`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>1

  Read configuration data from the `my.cnf` file.

* `--ndb-connectstring`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>2

  Set connection string. Syntax: `[nodeid=id;][host=]hostname[:port]`. Overrides entries in `NDB_CONNECTSTRING` and `my.cnf`. Ignored if `--config-file` is specified; beginning with NDB 8.0.27, a warning is issued when both options are used.

* `--ndb-mgmd-host`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>3

  Same as --ndb-connectstring.

* `--ndb-nodeid`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>4

  Set node ID for this node, overriding any ID set by --ndb-connectstring.

* `--ndb-optimized-node-selection`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>5

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--no-nodeid-checks`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>6

  Do not perform any checks of node IDs.

* `--nodaemon`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>7

  Instructs **ndb_mgmd** not to start as a daemon process.

  The default behavior for **ndb_mgmd** on Windows is to run in the foreground, making this option unnecessary on Windows platforms.

* `--no-defaults`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>8

  Do not read default options from any option file other than login file.

* `--nowait-nodes`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Removed</th> <td>8.0.31</td> </tr></tbody></table>9

  When starting an NDB Cluster is configured with two management nodes, each management server normally checks to see whether the other **ndb_mgmd** is also operational and whether the other management server's configuration is identical to its own. However, it is sometimes desirable to start the cluster with only one management node (and perhaps to allow the other **ndb_mgmd** to be started later). This option causes the management node to bypass any checks for any other management nodes whose node IDs are passed to this option, permitting the cluster to start as though configured to use only the management node that was started.

  For purposes of illustration, consider the following portion of a `config.ini` file (where we have omitted most of the configuration parameters that are not relevant to this example):

  ```
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

  ```
  $> ndb_mgmd --ndb-nodeid=10 --nowait-nodes=11
  ```

  As shown in the preceding example, when using `--nowait-nodes`, you must also use the `--ndb-nodeid` option to specify the node ID of this **ndb_mgmd** process.

  You can then start each of the cluster's data nodes in the usual way. If you wish to start and use the second management server in addition to the first management server at a later time without restarting the data nodes, you must start each data node with a connection string that references both management servers, like this:

  ```
  $> ndbd -c 198.51.100.150,198.51.100.151
  ```

  The same is true with regard to the connection string used with any **mysqld** processes that you wish to start as NDB Cluster SQL nodes connected to this cluster. See Section 25.4.3.3, “NDB Cluster Connection Strings”, for more information.

  When used with **ndb_mgmd**, this option affects the behavior of the management node with regard to other management nodes only. Do not confuse it with the `--nowait-nodes` option used with **ndbd** or **ndbmtd**") to permit a cluster to start with fewer than its full complement of data nodes; when used with data nodes, this option affects their behavior only with regard to other data nodes.

  Multiple management node IDs may be passed to this option as a comma-separated list. Each node ID must be no less than 1 and no greater than 255. In practice, it is quite rare to use more than two management servers for the same NDB Cluster (or to have any need for doing so); in most cases you need to pass to this option only the single node ID for the one management server that you do not wish to use when starting the cluster.

  Note

  When you later start the “missing” management server, its configuration must match that of the management server that is already in use by the cluster. Otherwise, it fails the configuration check performed by the existing management server, and does not start.

* `--print-defaults`

  <table summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>0

  Print program argument list and exit.

* `--print-full-config`, `-P`

  <table summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>1

  Shows extended information regarding the configuration of the cluster. With this option on the command line the **ndb_mgmd** process prints information about the cluster setup including an extensive list of the cluster configuration sections as well as parameters and their values. Normally used together with the `--config-file` (`-f`) option.

* `--reload`

  <table summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>2

  NDB Cluster configuration data is stored internally rather than being read from the cluster global configuration file each time the management server is started (see Section 25.4.3, “NDB Cluster Configuration Files”). Using this option forces the management server to check its internal data store against the cluster configuration file and to reload the configuration if it finds that the configuration file does not match the cache. Existing configuration cache files are preserved, but not used.

  This differs in two ways from the `--initial` option. First, `--initial` causes all cache files to be deleted. Second, `--initial` forces the management server to re-read the global configuration file and construct a new cache.

  If the management server cannot find a global configuration file, then the `--reload` option is ignored.

  When `--reload` is used, the management server must be able to communicate with data nodes and any other management servers in the cluster before it attempts to read the global configuration file; otherwise, the management server fails to start. This can happen due to changes in the networking environment, such as new IP addresses for nodes or an altered firewall configuration. In such cases, you must use `--initial` instead to force the existing cached configuration to be discarded and reloaded from the file. See Section 25.6.5, “Performing a Rolling Restart of an NDB Cluster”, for additional information.

* `--remove[=name]`

  <table summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>3

  Remove a management server process that has been installed as a Windows service, optionally specifying the name of the service to be removed. Applies only to Windows platforms.

* `--skip-config-file`

  <table summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>4

  Do not read cluster configuration file; ignore `--initial` and `--reload` options if specified.

* `--usage`

  <table summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>5

  Display help text and exit; same as --help.

* `--verbose`, `-v`

  <table summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>6

  Remove a management server process that has been installed as a Windows service, optionally specifying the name of the service to be removed. Applies only to Windows platforms.

* `--version`

  <table summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code>--cluster-config-suffix=name</code></td> </tr><tr><th>Introduced</th> <td>8.0.24</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>7

  Display version information and exit.

It is not strictly necessary to specify a connection string when starting the management server. However, if you are using more than one management server, a connection string should be provided and each node in the cluster should specify its node ID explicitly.

See Section 25.4.3.3, “NDB Cluster Connection Strings”, for information about using connection strings. Section 25.5.4, “ndb_mgmd — The NDB Cluster Management Server Daemon”, describes other options for **ndb_mgmd**.

The following files are created or used by **ndb_mgmd** in its starting directory, and are placed in the `DataDir` as specified in the `config.ini` configuration file. In the list that follows, *`node_id`* is the unique node identifier.

* `config.ini` is the configuration file for the cluster as a whole. This file is created by the user and read by the management server. Section 25.4, “Configuration of NDB Cluster”, discusses how to set up this file.

* `ndb_node_id_cluster.log` is the cluster events log file. Examples of such events include checkpoint startup and completion, node startup events, node failures, and levels of memory usage. A complete listing of cluster events with descriptions may be found in Section 25.6, “Management of NDB Cluster”.

  By default, when the size of the cluster log reaches one million bytes, the file is renamed to `ndb_node_id_cluster.log.seq_id`, where *`seq_id`* is the sequence number of the cluster log file. (For example: If files with the sequence numbers 1, 2, and 3 already exist, the next log file is named using the number `4`.) You can change the size and number of files, and other characteristics of the cluster log, using the `LogDestination` configuration parameter.

* `ndb_node_id_out.log` is the file used for `stdout` and `stderr` when running the management server as a daemon.

* `ndb_node_id.pid` is the process ID file used when running the management server as a daemon.
