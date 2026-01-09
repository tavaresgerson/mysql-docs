### 25.5.4 ndb\_mgmd — The NDB Cluster Management Server Daemon

The management server is the process that reads the cluster configuration file and distributes this information to all nodes in the cluster that request it. It also maintains a log of cluster activities. Management clients can connect to the management server and check the cluster's status.

All options that can be used with **ndb\_mgmd** are shown in the following table. Additional descriptions follow the table.

* `--bind-address=host`

  <table frame="box" rules="all" summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  Causes the management server to bind to a specific network interface (host name or IP address). This option has no default value.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>

  Directory containing character sets.

* `cluster-config-suffix`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--cluster-config-suffix=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  Override defaults group suffix when reading cluster configuration sections in `my.cnf`; used in testing.

* `--config-cache`

  <table frame="box" rules="all" summary="Properties for config-cache"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">TRUE</code></td> </tr></tbody></table>

  This option, whose default value is `1` (or `TRUE`, or `ON`), can be used to disable the management server's configuration cache, so that it reads its configuration from `config.ini` every time it starts (see Section 25.4.3, “NDB Cluster Configuration Files”). You can do this by starting the **ndb\_mgmd** process with any one of the following options:

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

  If your intent is to purge or reload the configuration cache without actually disabling caching, you should start **ndb\_mgmd** with one of the options `--reload` or `--initial` instead of `--skip-config-cache`.

  To re-enable the configuration cache, simply restart the management server, but without the `--config-cache` or `--skip-config-cache` option that was used previously to disable the configuration cache.

  **ndb\_mgmd** does not check for the configuration directory (`--configdir`) or attempts to create one when `--skip-config-cache` is used. (Bug #13428853)

* `--config-file=filename`, `-f filename`

  <table frame="box" rules="all" summary="Properties for config-file"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--config-file=file</code></td> </tr><tr><th>Disabled by</th> <td><code class="literal">skip-config-file</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  Instructs the management server as to which file it should use for its configuration file. By default, the management server looks for a file named `config.ini` in the same directory as the **ndb\_mgmd** executable; otherwise the file name and location must be specified explicitly.

  This option has no default value, and is ignored unless the management server is forced to read the configuration file, either because **ndb\_mgmd** was started with the `--reload` or `--initial` option, or because the management server could not find any configuration cache. If `--config-file` is specified without either of `--initial` or `--reload`, **ndb\_mgmd** refuses to start.

  The `--config-file` option is also read if **ndb\_mgmd** was started with `--config-cache=OFF`. See Section 25.4.3, “NDB Cluster Configuration Files”, for more information.

* `--configdir=dir_name`

  <table frame="box" rules="all" summary="Properties for configdir"><tbody><tr><th>Command-Line Format</th> <td><p class="valid-value"><code class="literal">--configdir=directory</code></p><p class="valid-value"><code class="literal">--config-dir=directory</code></p></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">$INSTALLDIR/mysql-cluster</code></td> </tr></tbody></table>

  Specifies the cluster management server's configuration cache directory. This must be an absolute path. Otherwise, the management server refuses to start.

  `--config-dir` is an alias for this option.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">12</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">12</code></td> </tr></tbody></table>

  Number of times to retry connection before giving up.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code class="literal">5</code></td> </tr><tr><th>Minimum Value</th> <td><code class="literal">0</code></td> </tr><tr><th>Maximum Value</th> <td><code class="literal">5</code></td> </tr></tbody></table>

  Number of seconds to wait between attempts to contact management server.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>

  Same as --ndb-connectstring.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--core-file</code></td> </tr></tbody></table>

  Write core file on error; used in debugging.

* `--daemon`, `-d`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>0

  Instructs **ndb\_mgmd** to start as a daemon process. This is the default behavior.

  This option has no effect when running **ndb\_mgmd** on Windows platforms.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>1

  Read given file after global files are read.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>2

  Read default options from given file only.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>3

  Also read groups with concat(group, suffix).

* `--help`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>4

  Display help text and exit.

* `--initial`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>5

  Configuration data is cached internally, rather than being read from the cluster global configuration file each time the management server is started (see Section 25.4.3, “NDB Cluster Configuration Files”). Using the `--initial` option overrides this behavior, by forcing the management server to delete any existing cache files, and then to re-read the configuration data from the cluster configuration file and to build a new cache.

  This differs in two ways from the `--reload` option. First, `--reload` forces the server to check the configuration file against the cache and reload its data only if the contents of the file are different from the cache. Second, `--reload` does not delete any existing cache files.

  If **ndb\_mgmd** is invoked with `--initial` but cannot find a global configuration file, the management server cannot start.

  When a management server starts, it checks for another management server in the same NDB Cluster and tries to use the other management server's configuration data. This behavior has implications when performing a rolling restart of an NDB Cluster with multiple management nodes. See Section 25.6.5, “Performing a Rolling Restart of an NDB Cluster”, for more information.

  When used together with the `--config-file` option, the cache is cleared only if the configuration file is actually found.

* `--install[=name]`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>6

  Causes **ndb\_mgmd** to be installed as a Windows service. Optionally, you can specify a name for the service; if not set, the service name defaults to `ndb_mgmd`. Although it is preferable to specify other **ndb\_mgmd** program options in a `my.ini` or `my.cnf` configuration file, it is possible to use them together with `--install`. However, in such cases, the `--install` option must be specified first, before any other options are given, for the Windows service installation to succeed.

  It is generally not advisable to use this option together with the `--initial` option, since this causes the configuration cache to be wiped and rebuilt every time the service is stopped and started. Care should also be taken if you intend to use any other **ndb\_mgmd** options that affect the starting of the management server, and you should make absolutely certain you fully understand and allow for any possible consequences of doing so.

  The `--install` option has no effect on non-Windows platforms.

* `--interactive`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>7

  Starts **ndb\_mgmd** in interactive mode; that is, an **ndb\_mgm** client session is started as soon as the management server is running. This option does not start any other NDB Cluster nodes.

* `--log-name=name`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>8

  Provides a name to be used for this node in the cluster log.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--character-sets-dir=path</code></td> </tr></tbody></table>9

  Read given path from login file.

* `--no-login-paths`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--cluster-config-suffix=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>0

  Skips reading options from the login path file.

* `--mycnf`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--cluster-config-suffix=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>1

  Read configuration data from the `my.cnf` file.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--cluster-config-suffix=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>2

  Set connection string. Syntax: `[nodeid=id;][host=]hostname[:port]`. Overrides entries in `NDB_CONNECTSTRING` and `my.cnf`. Ignored if `--config-file` is specified; a warning is issued if both options are used concurrently.

* `--ndb-log-timestamps`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--cluster-config-suffix=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>3

  Sets the format used for timestamps in node logs. This is one of the following values:

  + `LEGACY`: The system timezone, with resolution in seconds.

  + `UTC`: [RFC 3339](https://datatracker.ietf.org/doc/html/rfc3339) format, with microsecond resolution.

  + `SYSTEM`: RFC 3339 format.

  `UTC` is the default in MySQL 9.5.

* `--ndb-mgm-tls`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--cluster-config-suffix=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>4

  Sets the level of TLS support required to connect to the management server; one of `relaxed` or `strict`. `relaxed` (the default) means that a TLS connection is attempted, but success is not required; `strict` means that TLS is required to connect.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--cluster-config-suffix=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>5

  Same as --ndb-connectstring.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--cluster-config-suffix=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>6

  Set node ID for this node, overriding any ID set by --ndb-connectstring.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--cluster-config-suffix=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>7

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--ndb-tls-search-path`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--cluster-config-suffix=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>8

  Specify a list of directories to search for a CA file. On Unix platforms, the directory names are separated by colons (`:`); on Windows systems, the semicolon character (`;`) is used as the separator. A directory reference may be relative or absolute; it may contain one or more environment variables, each denoted by a prefixed dollar sign (`$`), and expanded prior to use.

  Searching begins with the leftmost named directory and proceeds from left to right until a file is found. An empty string denotes an empty search path, which causes all searches to fail. A string consisting of a single dot (`.`) indicates that the search path limited to the current working directory.

  If no search path is supplied, the compiled-in default value is used. This value depends on the platform used: On Windows, this is `\ndb-tls`; on other platforms (including Linux), it is `$HOME/ndb-tls`. This can be overridden by compiling NDB Cluster using `-DWITH_NDB_TLS_SEARCH_PATH`.

* `--no-nodeid-checks`

  <table frame="box" rules="all" summary="Properties for cluster-config-suffix"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--cluster-config-suffix=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>9

  Do not perform any checks of node IDs.

* `--nodaemon`

  <table frame="box" rules="all" summary="Properties for config-cache"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">TRUE</code></td> </tr></tbody></table>0

  Instructs **ndb\_mgmd** not to start as a daemon process.

  The default behavior for **ndb\_mgmd** on Windows is to run in the foreground, making this option unnecessary on Windows platforms.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for config-cache"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">TRUE</code></td> </tr></tbody></table>1

  Do not read default options from any option file other than login file.

* `--nowait-nodes`

  <table frame="box" rules="all" summary="Properties for config-cache"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">TRUE</code></td> </tr></tbody></table>2

  When starting an NDB Cluster is configured with two management nodes, each management server normally checks to see whether the other **ndb\_mgmd** is also operational and whether the other management server's configuration is identical to its own. However, it is sometimes desirable to start the cluster with only one management node (and perhaps to allow the other **ndb\_mgmd** to be started later). This option causes the management node to bypass any checks for any other management nodes whose node IDs are passed to this option, permitting the cluster to start as though configured to use only the management node that was started.

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

  As shown in the preceding example, when using `--nowait-nodes`, you must also use the `--ndb-nodeid` option to specify the node ID of this **ndb\_mgmd** process.

  You can then start each of the cluster's data nodes in the usual way. If you wish to start and use the second management server in addition to the first management server at a later time without restarting the data nodes, you must start each data node with a connection string that references both management servers, like this:

  ```
  $> ndbd -c 198.51.100.150,198.51.100.151
  ```

  The same is true with regard to the connection string used with any **mysqld** processes that you wish to start as NDB Cluster SQL nodes connected to this cluster. See Section 25.4.3.3, “NDB Cluster Connection Strings”, for more information.

  When used with **ndb\_mgmd**, this option affects the behavior of the management node with regard to other management nodes only. Do not confuse it with the `--nowait-nodes` option used with **ndbd** or **ndbmtd**") to permit a cluster to start with fewer than its full complement of data nodes; when used with data nodes, this option affects their behavior only with regard to other data nodes.

  Multiple management node IDs may be passed to this option as a comma-separated list. Each node ID must be no less than 1 and no greater than 255. In practice, it is quite rare to use more than two management servers for the same NDB Cluster (or to have any need for doing so); in most cases you need to pass to this option only the single node ID for the one management server that you do not wish to use when starting the cluster.

  Note

  When you later start the “missing” management server, its configuration must match that of the management server that is already in use by the cluster. Otherwise, it fails the configuration check performed by the existing management server, and does not start.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for config-cache"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">TRUE</code></td> </tr></tbody></table>3

  Print program argument list and exit.

* `--print-full-config`, `-P`

  <table frame="box" rules="all" summary="Properties for config-cache"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">TRUE</code></td> </tr></tbody></table>4

  Shows extended information regarding the configuration of the cluster. With this option on the command line the **ndb\_mgmd** process prints information about the cluster setup including an extensive list of the cluster configuration sections as well as parameters and their values. Normally used together with the `--config-file` (`-f`) option.

* `--reload`

  <table frame="box" rules="all" summary="Properties for config-cache"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">TRUE</code></td> </tr></tbody></table>5

  NDB Cluster configuration data is stored internally rather than being read from the cluster global configuration file each time the management server is started (see Section 25.4.3, “NDB Cluster Configuration Files”). Using this option forces the management server to check its internal data store against the cluster configuration file and to reload the configuration if it finds that the configuration file does not match the cache. Existing configuration cache files are preserved, but not used.

  This differs in two ways from the `--initial` option. First, `--initial` causes all cache files to be deleted. Second, `--initial` forces the management server to re-read the global configuration file and construct a new cache.

  If the management server cannot find a global configuration file, then the `--reload` option is ignored.

  When `--reload` is used, the management server must be able to communicate with data nodes and any other management servers in the cluster before it attempts to read the global configuration file; otherwise, the management server fails to start. This can happen due to changes in the networking environment, such as new IP addresses for nodes or an altered firewall configuration. In such cases, you must use `--initial` instead to force the existing cached configuration to be discarded and reloaded from the file. See Section 25.6.5, “Performing a Rolling Restart of an NDB Cluster”, for additional information.

* `--remove[=name]`

  <table frame="box" rules="all" summary="Properties for config-cache"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">TRUE</code></td> </tr></tbody></table>6

  Remove a management server process that has been installed as a Windows service, optionally specifying the name of the service to be removed. Applies only to Windows platforms.

* `--skip-config-file`

  <table frame="box" rules="all" summary="Properties for config-cache"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">TRUE</code></td> </tr></tbody></table>7

  Do not read cluster configuration file; ignore `--initial` and `--reload` options if specified.

* `--usage`

  <table frame="box" rules="all" summary="Properties for config-cache"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">TRUE</code></td> </tr></tbody></table>8

  Display help text and exit; same as --help.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for config-cache"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code class="literal">TRUE</code></td> </tr></tbody></table>9

  Remove a management server process that has been installed as a Windows service, optionally specifying the name of the service to be removed. Applies only to Windows platforms.

* `--version`

  <table frame="box" rules="all" summary="Properties for config-file"><tbody><tr><th>Command-Line Format</th> <td><code class="literal">--config-file=file</code></td> </tr><tr><th>Disabled by</th> <td><code class="literal">skip-config-file</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code class="literal">[none]</code></td> </tr></tbody></table>0

  Display version information and exit.

It is not strictly necessary to specify a connection string when starting the management server. However, if you are using more than one management server, a connection string should be provided and each node in the cluster should specify its node ID explicitly.

See Section 25.4.3.3, “NDB Cluster Connection Strings”, for information about using connection strings. Section 25.5.4, “ndb\_mgmd — The NDB Cluster Management Server Daemon”, describes other options for **ndb\_mgmd**.

The following files are created or used by **ndb\_mgmd** in its starting directory, and are placed in the `DataDir` as specified in the `config.ini` configuration file. In the list that follows, *`node_id`* is the unique node identifier.

* `config.ini` is the configuration file for the cluster as a whole. This file is created by the user and read by the management server. Section 25.4, “Configuration of NDB Cluster”, discusses how to set up this file.

* `ndb_node_id_cluster.log` is the cluster events log file. Examples of such events include checkpoint startup and completion, node startup events, node failures, and levels of memory usage. A complete listing of cluster events with descriptions may be found in Section 25.6, “Management of NDB Cluster”.

  By default, when the size of the cluster log reaches one million bytes, the file is renamed to `ndb_node_id_cluster.log.seq_id`, where *`seq_id`* is the sequence number of the cluster log file. (For example: If files with the sequence numbers 1, 2, and 3 already exist, the next log file is named using the number `4`.) You can change the size and number of files, and other characteristics of the cluster log, using the `LogDestination` configuration parameter.

* `ndb_node_id_out.log` is the file used for `stdout` and `stderr` when running the management server as a daemon.

* `ndb_node_id.pid` is the process ID file used when running the management server as a daemon.
