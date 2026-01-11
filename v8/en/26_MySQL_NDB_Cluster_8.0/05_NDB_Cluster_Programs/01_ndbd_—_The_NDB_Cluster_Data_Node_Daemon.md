### 25.5.1 ndbd — The NDB Cluster Data Node Daemon

The **ndbd** binary provides the single-threaded version of the process that is used to handle all the data in tables employing the `NDBCLUSTER` storage engine. This data node process enables a data node to accomplish distributed transaction handling, node recovery, checkpointing to disk, online backup, and related tasks. In NDB 8.0.38 and later, when started, **ndbd** logs a warning similar to that shown here:

```
2024-05-28 13:32:16 [ndbd] WARNING  -- Running ndbd with a single thread of
signal execution.  For multi-threaded signal execution run the ndbmtd binary.
```

**ndbmtd**") is the multi-threaded version of this binary.

In an NDB Cluster, a set of **ndbd** processes cooperate in handling data. These processes can execute on the same computer (host) or on different computers. The correspondences between data nodes and Cluster hosts is completely configurable.

Options that can be used with **ndbd** are shown in the following table. Additional descriptions follow the table.

**Table 25.24 Command-line options used with the program ndbd**

<table frame="box" rules="all"><thead><tr> <th scope="col">Format</th> <th scope="col">Description</th> <th scope="col">Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code> --bind-address=name </code> </p></th> <td>Local bind address</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-delay=# </code> </p></th> <td>Obsolete synonym for --connect-retry-delay, which should be used instead of this option</td> <td><p> REMOVED: NDB 8.0.28 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retries=# </code> </p></th> <td>Set the number of times to retry a connection before giving up; 0 means 1 attempt only (and no retries); -1 means continue retrying indefinitely</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --connect-retry-delay=# </code> </p></th> <td>Time to wait between attempts to contact a management server, in seconds; 0 means do not wait between attempts</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --core-file </code> </p></th> <td>Write core file on error; used in debugging</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--daemon</code>, </p><p> <code> -d </code> </p></th> <td>Start ndbd as daemon (default); override with --nodaemon</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-extra-file=path </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-file=path </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --defaults-group-suffix=string </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --filesystem-password=password </code> </p></th> <td>Password for node file system encryption; can be passed from stdin, tty, or my.cnf file</td> <td><p> ADDED: NDB 8.0.31 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --filesystem-password-from-stdin={TRUE|FALSE} </code> </p></th> <td>Get password for node file system encryption, passed from stdin</td> <td><p> ADDED: NDB 8.0.31 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --foreground </code> </p></th> <td>Run ndbd in foreground, provided for debugging purposes (implies --nodaemon)</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code> -? </code> </p></th> <td>Display help text and exit</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --initial </code> </p></th> <td>Perform initial start of ndbd, including file system cleanup; consult documentation before using this option</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --initial-start </code> </p></th> <td>Perform partial initial start (requires --nowait-nodes)</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --install[=name] </code> </p></th> <td>Used to install data node process as Windows service; does not apply on other platforms</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --logbuffer-size=# </code> </p></th> <td>Control size of log buffer; for use when debugging with many log messages being generated; default is sufficient for normal operations</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --login-path=path </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code> -c connection_string </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-nodeid=# </code> </p></th> <td>Set node ID for this node, overriding any ID set by --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --nodaemon </code> </p></th> <td>Do not start ndbd as daemon; provided for testing purposes</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --no-defaults </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--nostart</code>, </p><p> <code> -n </code> </p></th> <td>Do not start ndbd immediately; ndbd waits for command to start from ndb_mgm</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --nowait-nodes=list </code> </p></th> <td>Do not wait for these data nodes to start (takes comma-separated list of node IDs); requires --ndb-nodeid</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --ndb-optimized-node-selection </code> </p></th> <td>Enable optimizations for selection of nodes for transactions. Enabled by default; use --skip-ndb-optimized-node-selection to disable</td> <td><p> REMOVED: 8.0.31 </p></td> </tr></tbody><tbody><tr> <th><p> <code> --print-defaults </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --remove[=name] </code> </p></th> <td>Used to remove data node process that was previously installed as Windows service; does not apply on other platforms</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code> -? </code> </p></th> <td>Display help text and exit; same as --help</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--verbose</code>, </p><p> <code> -v </code> </p></th> <td>Write extra debugging information to node log</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code> -V </code> </p></th> <td>Display version information and exit</td> <td><p> (Supported in all NDB releases based on MySQL 8.0) </p></td> </tr></tbody></table>

Note

All of these options also apply to the multithreaded version of this program (**ndbmtd**")) and you may substitute “**ndbmtd**")” for “**ndbd**” wherever the latter occurs in this section.

* `--bind-address`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>

  Causes **ndbd** to bind to a specific network interface (host name or IP address). This option has no default value.

* `--character-sets-dir`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Directory containing character sets.

* `--connect-delay=#`

  <table summary="Properties for connect-delay"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-delay=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes (removed in 8.0.28-ndb-8.0.28)</td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>3600</code></td> </tr></tbody></table>

  Determines the time to wait between attempts to contact a management server when starting (the number of attempts is controlled by the `--connect-retries` option). The default is 5 seconds.

  This option is deprecated, and is subject to removal in a future release of NDB Cluster. Use `--connect-retry-delay` instead.

* `--connect-retries=#`

  <table summary="Properties for connect-retries"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value (≥ 8.0.28-ndb-8.0.28)</th> <td><code>-1</code></td> </tr><tr><th>Minimum Value</th> <td><code>-1</code></td> </tr><tr><th>Minimum Value</th> <td><code>-1</code></td> </tr><tr><th>Minimum Value (≤ 8.0.27-ndb-8.0.27)</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>

  Set the number of times to retry a connection before giving up; 0 means 1 attempt only (and no retries). The default is 12 attempts. The time to wait between attempts is controlled by the `--connect-retry-delay` option.

  Beginning with NDB 8.0.28, you can set this option to -1, in which case, the data node process continues indefinitely to try to connect.

* `--connect-retry-delay=#`

  <table summary="Properties for connect-retry-delay"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Determines the time to wait between attempts to contact a management server when starting (the time between attempts is controlled by the `--connect-retries` option). The default is 5 seconds.

  This option takes the place of the `--connect-delay` option, which is now deprecated and subject to removal in a future release of NDB Cluster.

  The short form `-r` for this option is deprecated as of NDB 8.0.28, and subject to removal in a future release of NDB Cluster. Use the long form instead.

* `--connect-string`

  <table summary="Properties for connect-string"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Same as `--ndb-connectstring`.

* `--core-file`

  <table summary="Properties for core-file"><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Write core file on error; used in debugging.

* `--daemon`, `-d`

  <table summary="Properties for daemon"><tbody><tr><th>Command-Line Format</th> <td><code>--daemon</code></td> </tr></tbody></table>

  Instructs **ndbd** or **ndbmtd**") to execute as a daemon process. This is the default behavior. `--nodaemon` can be used to prevent the process from running as a daemon.

  This option has no effect when running **ndbd** or **ndbmtd**") on Windows platforms.

* `--defaults-extra-file`

  <table summary="Properties for defaults-extra-file"><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read given file after global files are read.

* `--defaults-file`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>0

  Read default options from given file only.

* `--defaults-group-suffix`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>1

  Also read groups with concat(group, suffix).

* `--filesystem-password`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>2

  Pass the filesystem encryption and decryption password to the data node process using `stdin`, `tty`, or the `my.cnf` file.

  Requires `EncryptedFileSystem = 1`.

  For more information, see Section 25.6.14, “File System Encryption for NDB Cluster”.

* `--filesystem-password-from-stdin`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>3

  Pass the filesystem encryption and decryption password to the data node process from `stdin` (only).

  Requires `EncryptedFileSystem = 1`.

  For more information, see Section 25.6.14, “File System Encryption for NDB Cluster”.

* `--foreground`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>4

  Causes **ndbd** or **ndbmtd**") to execute as a foreground process, primarily for debugging purposes. This option implies the `--nodaemon` option.

  This option has no effect when running **ndbd** or **ndbmtd**") on Windows platforms.

* `--help`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>5

  Display help text and exit.

* `--initial`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>6

  Instructs **ndbd** to perform an initial start. An initial start erases any files created for recovery purposes by earlier instances of **ndbd**. It also re-creates recovery log files. On some operating systems, this process can take a substantial amount of time.

  An `--initial` start is to be used *only* when starting the **ndbd** process under very special circumstances; this is because this option causes all files to be removed from the NDB Cluster file system and all redo log files to be re-created. These circumstances are listed here:

  + When performing a software upgrade which has changed the contents of any files.

  + When restarting the node with a new version of **ndbd**.

  + As a measure of last resort when for some reason the node restart or system restart repeatedly fails. In this case, be aware that this node can no longer be used to restore data due to the destruction of the data files.

  Warning

  To avoid the possibility of eventual data loss, it is recommended that you *not* use the `--initial` option together with `StopOnError = 0`. Instead, set `StopOnError` to 0 in `config.ini` only after the cluster has been started, then restart the data nodes normally—that is, without the `--initial` option. See the description of the `StopOnError` parameter for a detailed explanation of this issue. (Bug
  #24945638)

  Use of this option prevents the `StartPartialTimeout` and `StartPartitionedTimeout` configuration parameters from having any effect.

  Important

  This option does *not* affect backup files that have already been created by the affected node.

  Prior to NDB 8.0.21, the `--initial` option also did not affect any Disk Data files. In NDB 8.0.21 and later, when used to perform an initial restart of the cluster, the option causes the removal of all data files associated with Disk Data tablespaces and undo log files associated with log file groups that existed previously on this data node (see Section 25.6.11, “NDB Cluster Disk Data Tables”).

  This option also has no effect on recovery of data by a data node that is just starting (or restarting) from data nodes that are already running (unless they also were started with `--initial`, as part of an initial restart). This recovery of data occurs automatically, and requires no user intervention in an NDB Cluster that is running normally.

  It is permissible to use this option when starting the cluster for the very first time (that is, before any data node files have been created); however, it is *not* necessary to do so.

* `--initial-start`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>7

  This option is used when performing a partial initial start of the cluster. Each node should be started with this option, as well as `--nowait-nodes`.

  Suppose that you have a 4-node cluster whose data nodes have the IDs 2, 3, 4, and 5, and you wish to perform a partial initial start using only nodes 2, 4, and 5—that is, omitting node 3:

  ```
  $> ndbd --ndb-nodeid=2 --nowait-nodes=3 --initial-start
  $> ndbd --ndb-nodeid=4 --nowait-nodes=3 --initial-start
  $> ndbd --ndb-nodeid=5 --nowait-nodes=3 --initial-start
  ```

  When using this option, you must also specify the node ID for the data node being started with the `--ndb-nodeid` option.

  Important

  Do not confuse this option with the `--nowait-nodes` option for **ndb_mgmd**, which can be used to enable a cluster configured with multiple management servers to be started without all management servers being online.

* `--install[=name]`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>8

  Causes **ndbd** to be installed as a Windows service. Optionally, you can specify a name for the service; if not set, the service name defaults to `ndbd`. Although it is preferable to specify other **ndbd** program options in a `my.ini` or `my.cnf` configuration file, it is possible to use together with `--install`. However, in such cases, the `--install` option must be specified first, before any other options are given, for the Windows service installation to succeed.

  It is generally not advisable to use this option together with the `--initial` option, since this causes the data node file system to be wiped and rebuilt every time the service is stopped and started. Extreme care should also be taken if you intend to use any of the other **ndbd** options that affect the starting of data nodes—including `--initial-start`, `--nostart`, and `--nowait-nodes`—together with `--install`, and you should make absolutely certain you fully understand and allow for any possible consequences of doing so.

  The `--install` option has no effect on non-Windows platforms.

* `--logbuffer-size=#`

  <table summary="Properties for bind-address"><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>9

  Sets the size of the data node log buffer. When debugging with high amounts of extra logging, it is possible for the log buffer to run out of space if there are too many log messages, in which case some log messages can be lost. This should not occur during normal operations.

* `--login-path`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>0

  Read given path from login file.

* `--ndb-connectstring`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>1

  Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf.

* `--ndb-mgmd-host`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>2

  Same as `--ndb-connectstring`.

* `--ndb-nodeid`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>3

  Set node ID for this node, overriding any ID set by --ndb-connectstring.

* `--ndb-optimized-node-selection`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>4

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--nodaemon`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>5

  Prevents **ndbd** or **ndbmtd**") from executing as a daemon process. This option overrides the `--daemon` option. This is useful for redirecting output to the screen when debugging the binary.

  The default behavior for **ndbd** and **ndbmtd**") on Windows is to run in the foreground, making this option unnecessary on Windows platforms, where it has no effect.

* `--no-defaults`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>6

  Do not read default options from any option file other than login file.

* `--nostart`, `-n`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>7

  Instructs **ndbd** not to start automatically. When this option is used, **ndbd** connects to the management server, obtains configuration data from it, and initializes communication objects. However, it does not actually start the execution engine until specifically requested to do so by the management server. This can be accomplished by issuing the proper `START` command in the management client (see Section 25.6.1, “Commands in the NDB Cluster Management Client”).

* [`--nowait-nodes=node_id_1[, node_id_2[, ...`](mysql-cluster-programs-ndbd.html#option_ndbd_nowait-nodes)

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>8

  This option takes a list of data nodes for which the cluster does not wait, prior to starting.

  This can be used to start the cluster in a partitioned state. For example, to start the cluster with only half of the data nodes (nodes 2, 3, 4, and 5) running in a 4-node cluster, you can start each **ndbd** process with `--nowait-nodes=3,5`. In this case, the cluster starts as soon as nodes 2 and 4 connect, and does *not* wait `StartPartitionedTimeout` milliseconds for nodes 3 and 5 to connect as it would otherwise.

  If you wanted to start up the same cluster as in the previous example without one **ndbd** (say, for example, that the host machine for node 3 has suffered a hardware failure) then start nodes 2, 4, and 5 with `--nowait-nodes=3`. Then the cluster starts as soon as nodes 2, 4, and 5 connect, and does not wait for node 3 to start.

* `--print-defaults`

  <table summary="Properties for character-sets-dir"><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>9

  Print program argument list and exit.

* `--remove[=name]`

  <table summary="Properties for connect-delay"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-delay=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes (removed in 8.0.28-ndb-8.0.28)</td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>3600</code></td> </tr></tbody></table>0

  Causes an **ndbd** process that was previously installed as a Windows service to be removed. Optionally, you can specify a name for the service to be uninstalled; if not set, the service name defaults to `ndbd`.

  The `--remove` option has no effect on non-Windows platforms.

* `--usage`

  <table summary="Properties for connect-delay"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-delay=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes (removed in 8.0.28-ndb-8.0.28)</td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>3600</code></td> </tr></tbody></table>1

  Display help text and exit; same as --help.

* `--verbose`, `-v`

  Causes extra debug output to be written to the node log.

  You can also use `NODELOG DEBUG ON` and `NODELOG DEBUG OFF` to enable and disable this extra logging while the data node is running.

* `--version`

  <table summary="Properties for connect-delay"><tbody><tr><th>Command-Line Format</th> <td><code>--connect-delay=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes (removed in 8.0.28-ndb-8.0.28)</td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>3600</code></td> </tr></tbody></table>2

  Display version information and exit.

**ndbd** generates a set of log files which are placed in the directory specified by `DataDir` in the `config.ini` configuration file.

These log files are listed below. *`node_id`* is and represents the node's unique identifier. For example, `ndb_2_error.log` is the error log generated by the data node whose node ID is `2`.

* `ndb_node_id_error.log` is a file containing records of all crashes which the referenced **ndbd** process has encountered. Each record in this file contains a brief error string and a reference to a trace file for this crash. A typical entry in this file might appear as shown here:

  ```
  Date/Time: Saturday 30 July 2004 - 00:20:01
  Type of error: error
  Message: Internal program error (failed ndbrequire)
  Fault ID: 2341
  Problem data: DbtupFixAlloc.cpp
  Object of reference: DBTUP (Line: 173)
  ProgramName: NDB Kernel
  ProcessID: 14909
  TraceFile: ndb_2_trace.log.2
  ***EOM***
  ```

  Listings of possible **ndbd** exit codes and messages generated when a data node process shuts down prematurely can be found in Data Node Error Messages.

  Important

  *The last entry in the error log file is not necessarily the newest one* (nor is it likely to be). Entries in the error log are *not* listed in chronological order; rather, they correspond to the order of the trace files as determined in the `ndb_node_id_trace.log.next` file (see below). Error log entries are thus overwritten in a cyclical and not sequential fashion.

* `ndb_node_id_trace.log.trace_id` is a trace file describing exactly what happened just before the error occurred. This information is useful for analysis by the NDB Cluster development team.

  It is possible to configure the number of these trace files that are created before old files are overwritten. *`trace_id`* is a number which is incremented for each successive trace file.

* `ndb_node_id_trace.log.next` is the file that keeps track of the next trace file number to be assigned.

* `ndb_node_id_out.log` is a file containing any data output by the **ndbd** process. This file is created only if **ndbd** is started as a daemon, which is the default behavior.

* `ndb_node_id.pid` is a file containing the process ID of the **ndbd** process when started as a daemon. It also functions as a lock file to avoid the starting of nodes with the same identifier.

* `ndb_node_id_signal.log` is a file used only in debug versions of **ndbd**, where it is possible to trace all incoming, outgoing, and internal messages with their data in the **ndbd** process.

It is recommended not to use a directory mounted through NFS because in some environments this can cause problems whereby the lock on the `.pid` file remains in effect even after the process has terminated.

To start **ndbd**, it may also be necessary to specify the host name of the management server and the port on which it is listening. Optionally, one may also specify the node ID that the process is to use.

```
$> ndbd --connect-string="nodeid=2;host=ndb_mgmd.mysql.com:1186"
```

See Section 25.4.3.3, “NDB Cluster Connection Strings”, for additional information about this issue. For more information about data node configuration parameters, see Section 25.4.3.6, “Defining NDB Cluster Data Nodes”.

When **ndbd** starts, it actually initiates two processes. The first of these is called the “angel process”; its only job is to discover when the execution process has been completed, and then to restart the **ndbd** process if it is configured to do so. Thus, if you attempt to kill **ndbd** using the Unix **kill** command, it is necessary to kill both processes, beginning with the angel process. The preferred method of terminating an **ndbd** process is to use the management client and stop the process from there.

The execution process uses one thread for reading, writing, and scanning data, as well as all other activities. This thread is implemented asynchronously so that it can easily handle thousands of concurrent actions. In addition, a watch-dog thread supervises the execution thread to make sure that it does not hang in an endless loop. A pool of threads handles file I/O, with each thread able to handle one open file. Threads can also be used for transporter connections by the transporters in the **ndbd** process. In a multi-processor system performing a large number of operations (including updates), the **ndbd** process can consume up to 2 CPUs if permitted to do so.

For a machine with many CPUs it is possible to use several **ndbd** processes which belong to different node groups; however, such a configuration is still considered experimental and is not supported for MySQL 8.0 in a production setting. See Section 25.2.7, “Known Limitations of NDB Cluster”.
