## 21.5 NDB Cluster Programs

Using and managing an NDB Cluster requires several specialized programs, which we describe in this chapter. We discuss the purposes of these programs in an NDB Cluster, how to use the programs, and what startup options are available for each of them.

These programs include the NDB Cluster data, management, and SQL node processes (**ndbd**, **ndbmtd**"), **ndb\_mgmd**, and `mysqld`) and the management client (**ndb\_mgm**).

For information about using `mysqld` as an NDB Cluster process, see Section 21.6.10, “MySQL Server Usage for NDB Cluster”.

Other `NDB` utility, diagnostic, and example programs are included with the NDB Cluster distribution. These include **ndb\_restore**, **ndb\_show\_tables**, and **ndb\_config**. These programs are also covered in this section.

The final portion of this section contains tables of options that are common to all the various NDB Cluster programs.


### 21.5.1 ndbd — The NDB Cluster Data Node Daemon

The **ndbd** binary provides the single-threaded version of the process that is used to handle all the data in tables employing the `NDBCLUSTER` storage engine. This data node process enables a data node to accomplish distributed transaction handling, node recovery, checkpointing to disk, online backup, and related tasks. In NDB 7.6.31 and later, when started, **ndbd** logs a warning similar to that shown here:

```sql
2024-05-28 13:32:16 [ndbd] WARNING  -- Running ndbd with a single thread of
signal execution.  For multi-threaded signal execution run the ndbmtd binary.
```

**ndbmtd**") is the multi-threaded version of this binary.

In an NDB Cluster, a set of **ndbd** processes cooperate in handling data. These processes can execute on the same computer (host) or on different computers. The correspondences between data nodes and Cluster hosts is completely configurable.

Options that can be used with **ndbd** are shown in the following table. Additional descriptions follow the table.

**Table 21.22 Command-line options used with the program ndbd**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Format</th> <th>Description</th> <th>Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code class="option"> --bind-address=name </code> </p></th> <td>Local bind address</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-delay=# </code> </p></th> <td>Obsolete synonym for --connect-retry-delay, which should be used instead of this option</td> <td><p> REMOVED: NDB 7.5.25, NDB 7.6.21 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Set the number of times to retry a connection before giving up; 0 means 1 attempt only (and no retries); -1 means continue retrying indefinitely</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Time to wait between attempts to contact a management server, in seconds; 0 means do not wait between attempts</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_connect-string">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --core-file </code> </p></th> <td>Write core file on error; used in debugging</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--daemon</code>, </p><p> <code class="option"> -d </code> </p></th> <td>Start ndbd as daemon (default); override with --nodaemon</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --foreground </code> </p></th> <td>Run ndbd in foreground, provided for debugging purposes (implies --nodaemon)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --initial </code> </p></th> <td>Perform initial start of ndbd, including file system cleanup; consult documentation before using this option</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --initial-start </code> </p></th> <td>Perform partial initial start (requires --nowait-nodes)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --install[=name] </code> </p></th> <td>Used to install data node process as Windows service; does not apply on other platforms</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --logbuffer-size=# </code> </p></th> <td>Control size of log buffer; for use when debugging with many log messages being generated; default is sufficient for normal operations</td> <td><p> ADDED: NDB 7.6.6 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --login-path=path </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndbd.html#option_ndbd_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Set node ID for this node, overriding any ID set by --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --nodaemon </code> </p></th> <td>Do not start ndbd as daemon; provided for testing purposes</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --no-defaults </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--nostart</code>, </p><p> <code class="option"> -n </code> </p></th> <td>Do not start ndbd immediately; ndbd waits for command to start from ndb_mgm</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --nowait-nodes=list </code> </p></th> <td>Do not wait for these data nodes to start (takes comma-separated list of node IDs); requires --ndb-nodeid</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Enable optimizations for selection of nodes for transactions. Enabled by default; use --skip-ndb-optimized-node-selection to disable</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --print-defaults </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --remove[=name] </code> </p></th> <td>Used to remove data node process that was previously installed as Windows service; does not apply on other platforms</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit; same as --help</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--verbose</code>, </p><p> <code class="option"> -v </code> </p></th> <td>Write extra debugging information to node log</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code class="option"> -V </code> </p></th> <td>Display version information and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody></table>

Note

All of these options also apply to the multithreaded version of this program (**ndbmtd**")) and you may substitute “**ndbmtd**")” for “**ndbd**” wherever the latter occurs in this section.

* `--bind-address`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>

  Causes **ndbd** to bind to a specific network interface (host name or IP address). This option has no default value.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Directory containing character sets.

* `--connect-delay=#`

  <table frame="box" rules="all" summary="Properties for connect-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-delay=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes (removed in 5.7.36-ndb-7.6.21)</td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>3600</code></td> </tr></tbody></table>

  Determines the time to wait between attempts to contact a management server when starting (the number of attempts is controlled by the `--connect-retries` option). The default is 5 seconds.

  This option is deprecated, and is subject to removal in a future release of NDB Cluster. Use `--connect-retry-delay` instead.

* `--connect-retries=#`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value (≥ 5.7.36-ndb-7.6.21)</th> <td><code>-1</code></td> </tr><tr><th>Minimum Value (≥ 5.7.36-ndb-7.5.25)</th> <td><code>-1</code></td> </tr><tr><th>Minimum Value (≤ 5.7.36-ndb-7.5.24)</th> <td><code>0</code></td> </tr><tr><th>Minimum Value (≤ 5.7.36-ndb-7.6.20)</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>65535</code></td> </tr></tbody></table>

  Set the number of times to retry a connection before giving up; 0 means 1 attempt only (and no retries). The default is 12 attempts. The time to wait between attempts is controlled by the `--connect-retry-delay` option.

  Beginning with NDB 7.5.25 and NDB 7.6.21, you can set this option to -1, in which case, the data node process continues indefinitely to try to connect.

* `--connect-retry-delay=#`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Determines the time to wait between attempts to contact a management server when starting (the time between attempts is controlled by the `--connect-retries` option). The default is 5 seconds.

  This option takes the place of the `--connect-delay` option, which is now deprecated and subject to removal in a future release of NDB Cluster.

  The short form `-r` for this option is deprecated as of NDB 7.5.25 and NDB 7.6.21, and subject to removal in a future release of NDB Cluster. Use the long form instead.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Same as `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Write core file on error; used in debugging.

* `--daemon`, `-d`

  <table frame="box" rules="all" summary="Properties for daemon"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--daemon</code></td> </tr></tbody></table>

  Instructs **ndbd** or **ndbmtd**") to execute as a daemon process. This is the default behavior. `--nodaemon` can be used to prevent the process from running as a daemon.

  This option has no effect when running **ndbd** or **ndbmtd**") on Windows platforms.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read given file after global files are read.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>0

  Read default options from given file only.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>1

  Also read groups with concat(group, suffix).

* `--foreground`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>2

  Causes **ndbd** or **ndbmtd**") to execute as a foreground process, primarily for debugging purposes. This option implies the `--nodaemon` option.

  This option has no effect when running **ndbd** or **ndbmtd**") on Windows platforms.

* `--help`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>3

  Display help text and exit.

* `--initial`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>4

  Instructs **ndbd** to perform an initial start. An initial start erases any files created for recovery purposes by earlier instances of **ndbd**. It also re-creates recovery log files. On some operating systems, this process can take a substantial amount of time.

  An `--initial` start is to be used *only* when starting the **ndbd** process under very special circumstances; this is because this option causes all files to be removed from the NDB Cluster file system and all redo log files to be re-created. These circumstances are listed here:

  + When performing a software upgrade which has changed the contents of any files.

  + When restarting the node with a new version of **ndbd**.

  + As a measure of last resort when for some reason the node restart or system restart repeatedly fails. In this case, be aware that this node can no longer be used to restore data due to the destruction of the data files.

  Warning

  To avoid the possibility of eventual data loss, it is recommended that you *not* use the `--initial` option together with `StopOnError = 0`. Instead, set `StopOnError` to 0 in `config.ini` only after the cluster has been started, then restart the data nodes normally—that is, without the `--initial` option. See the description of the `StopOnError` parameter for a detailed explanation of this issue. (Bug #24945638)

  Use of this option prevents the `StartPartialTimeout` and `StartPartitionedTimeout` configuration parameters from having any effect.

  Important

  This option does *not* affect either of the following types of files:

  + Backup files that have already been created by the affected node

  + NDB Cluster Disk Data files (see Section 21.6.11, “NDB Cluster Disk Data Tables”).

  This option also has no effect on recovery of data by a data node that is just starting (or restarting) from data nodes that are already running. This recovery of data occurs automatically, and requires no user intervention in an NDB Cluster that is running normally.

  It is permissible to use this option when starting the cluster for the very first time (that is, before any data node files have been created); however, it is *not* necessary to do so.

* `--initial-start`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>5

  This option is used when performing a partial initial start of the cluster. Each node should be started with this option, as well as `--nowait-nodes`.

  Suppose that you have a 4-node cluster whose data nodes have the IDs 2, 3, 4, and 5, and you wish to perform a partial initial start using only nodes 2, 4, and 5—that is, omitting node 3:

  ```sql
  $> ndbd --ndb-nodeid=2 --nowait-nodes=3 --initial-start
  $> ndbd --ndb-nodeid=4 --nowait-nodes=3 --initial-start
  $> ndbd --ndb-nodeid=5 --nowait-nodes=3 --initial-start
  ```

  When using this option, you must also specify the node ID for the data node being started with the `--ndb-nodeid` option.

  Important

  Do not confuse this option with the `--nowait-nodes` option for **ndb\_mgmd**, which can be used to enable a cluster configured with multiple management servers to be started without all management servers being online.

* `--install[=name]`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>6

  Causes **ndbd** to be installed as a Windows service. Optionally, you can specify a name for the service; if not set, the service name defaults to `ndbd`. Although it is preferable to specify other **ndbd** program options in a `my.ini` or `my.cnf` configuration file, it is possible to use together with `--install`. However, in such cases, the `--install` option must be specified first, before any other options are given, for the Windows service installation to succeed.

  It is generally not advisable to use this option together with the `--initial` option, since this causes the data node file system to be wiped and rebuilt every time the service is stopped and started. Extreme care should also be taken if you intend to use any of the other **ndbd** options that affect the starting of data nodes—including `--initial-start`, `--nostart`, and `--nowait-nodes`—together with `--install`, and you should make absolutely certain you fully understand and allow for any possible consequences of doing so.

  The `--install` option has no effect on non-Windows platforms.

* `--logbuffer-size=#`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>7

  Sets the size of the data node log buffer. When debugging with high amounts of extra logging, it is possible for the log buffer to run out of space if there are too many log messages, in which case some log messages can be lost. This should not occur during normal operations.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>8

  Read given path from login file.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>9

  Set connect string for connecting to ndb\_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB\_CONNECTSTRING and my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>0

  Same as `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>1

  Set node ID for this node, overriding any ID set by `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>2

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--nodaemon`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>3

  Prevents **ndbd** or **ndbmtd**") from executing as a daemon process. This option overrides the `--daemon` option. This is useful for redirecting output to the screen when debugging the binary.

  The default behavior for **ndbd** and **ndbmtd**") on Windows is to run in the foreground, making this option unnecessary on Windows platforms, where it has no effect.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>4

  Do not read default options from any option file other than login file.

* `--nostart`, `-n`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>5

  Instructs **ndbd** not to start automatically. When this option is used, **ndbd** connects to the management server, obtains configuration data from it, and initializes communication objects. However, it does not actually start the execution engine until specifically requested to do so by the management server. This can be accomplished by issuing the proper `START` command in the management client (see Section 21.6.1, “Commands in the NDB Cluster Management Client”).

* `--nowait-nodes=node_id_1[, node_id_2[, ...]]`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>6

  This option takes a list of data nodes which for which the cluster does not wait for before starting.

  This can be used to start the cluster in a partitioned state. For example, to start the cluster with only half of the data nodes (nodes 2, 3, 4, and 5) running in a 4-node cluster, you can start each **ndbd** process with `--nowait-nodes=3,5`. In this case, the cluster starts as soon as nodes 2 and 4 connect, and does *not* wait `StartPartitionedTimeout` milliseconds for nodes 3 and 5 to connect as it would otherwise.

  If you wanted to start up the same cluster as in the previous example without one **ndbd** (say, for example, that the host machine for node 3 has suffered a hardware failure) then start nodes 2, 4, and 5 with `--nowait-nodes=3`. Then the cluster starts as soon as nodes 2, 4, and 5 connect and does not wait for node 3 to start.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>7

  Print program argument list and exit.

* `--remove[=name]`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>8

  Causes an **ndbd** process that was previously installed as a Windows service to be removed. Optionally, you can specify a name for the service to be uninstalled; if not set, the service name defaults to `ndbd`.

  The `--remove` option has no effect on non-Windows platforms.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>9

  Display help text and exit; same as `--help`.

* `--verbose`, `-v`

  Causes extra debug output to be written to the node log.

  In NDB 7.6, you can also use `NODELOG DEBUG ON` and `NODELOG DEBUG OFF` to enable and disable this extra logging while the data node is running.

* `--version`

  <table frame="box" rules="all" summary="Properties for connect-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-delay=#</code></td> </tr><tr><th>Deprecated</th> <td>Yes (removed in 5.7.36-ndb-7.6.21)</td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>3600</code></td> </tr></tbody></table>0

  Display version information and exit.

**ndbd** generates a set of log files which are placed in the directory specified by `DataDir` in the `config.ini` configuration file.

These log files are listed below. *`node_id`* is and represents the node's unique identifier. For example, `ndb_2_error.log` is the error log generated by the data node whose node ID is `2`.

* `ndb_node_id_error.log` is a file containing records of all crashes which the referenced **ndbd** process has encountered. Each record in this file contains a brief error string and a reference to a trace file for this crash. A typical entry in this file might appear as shown here:

  ```sql
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

```sql
$> ndbd --connect-string="nodeid=2;host=ndb_mgmd.mysql.com:1186"
```

See Section 21.4.3.3, “NDB Cluster Connection Strings”, for additional information about this issue. For more information about data node configuration parameters, see Section 21.4.3.6, “Defining NDB Cluster Data Nodes”.

When **ndbd** starts, it actually initiates two processes. The first of these is called the “angel process”; its only job is to discover when the execution process has been completed, and then to restart the **ndbd** process if it is configured to do so. Thus, if you attempt to kill **ndbd** using the Unix **kill** command, it is necessary to kill both processes, beginning with the angel process. The preferred method of terminating an **ndbd** process is to use the management client and stop the process from there.

The execution process uses one thread for reading, writing, and scanning data, as well as all other activities. This thread is implemented asynchronously so that it can easily handle thousands of concurrent actions. In addition, a watch-dog thread supervises the execution thread to make sure that it does not hang in an endless loop. A pool of threads handles file I/O, with each thread able to handle one open file. Threads can also be used for transporter connections by the transporters in the **ndbd** process. In a multi-processor system performing a large number of operations (including updates), the **ndbd** process can consume up to 2 CPUs if permitted to do so.

For a machine with many CPUs it is possible to use several **ndbd** processes which belong to different node groups; however, such a configuration is still considered experimental and is not supported for MySQL 5.7 in a production setting. See Section 21.2.7, “Known Limitations of NDB Cluster”.


### 21.5.2 ndbinfo\_select\_all — Select From ndbinfo Tables

**ndbinfo\_select\_all** is a client program that selects all rows and columns from one or more tables in the `ndbinfo` database

Not all `ndbinfo` tables available in the **mysql** client can be read by this program (see later in this section). In addition, **ndbinfo\_select\_all** can show information about some tables internal to `ndbinfo` which cannot be accessed using SQL, including the `tables` and `columns` metadata tables.

To select from one or more `ndbinfo` tables using **ndbinfo\_select\_all**, it is necessary to supply the names of the tables when invoking the program as shown here:

```sql
$> ndbinfo_select_all table_name1  [table_name2] [...]
```

For example:

```sql
$> ndbinfo_select_all logbuffers logspaces
== logbuffers ==
node_id log_type        log_id  log_part        total   used    high
5       0       0       0       33554432        262144  0
6       0       0       0       33554432        262144  0
7       0       0       0       33554432        262144  0
8       0       0       0       33554432        262144  0
== logspaces ==
node_id log_type        log_id  log_part        total   used    high
5       0       0       0       268435456       0       0
5       0       0       1       268435456       0       0
5       0       0       2       268435456       0       0
5       0       0       3       268435456       0       0
6       0       0       0       268435456       0       0
6       0       0       1       268435456       0       0
6       0       0       2       268435456       0       0
6       0       0       3       268435456       0       0
7       0       0       0       268435456       0       0
7       0       0       1       268435456       0       0
7       0       0       2       268435456       0       0
7       0       0       3       268435456       0       0
8       0       0       0       268435456       0       0
8       0       0       1       268435456       0       0
8       0       0       2       268435456       0       0
8       0       0       3       268435456       0       0
$>
```

Options that can be used with **ndbinfo\_select\_all** are shown in the following table. Additional descriptions follow the table.

**Table 21.23 Command-line options used with the program ndbinfo\_select\_all**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Format</th> <th>Description</th> <th>Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Number of times to retry connection before giving up</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Number of seconds to wait between attempts to contact management server</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection-string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndbinfo-select-all.html#option_ndbinfo_select_all_connect-string">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --core-file </code> </p></th> <td>Write core file on error; used in debugging</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--database=db_name</code>, </p><p> <code class="option"> -d </code> </p></th> <td>Name of database where table is located</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --delay=# </code> </p></th> <td>Set delay in seconds between loops</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --login-path=path </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--loops=#</code>, </p><p> <code class="option"> -l </code> </p></th> <td>Set number of times to perform select</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection-string</code>, </p><p> <code class="option"> -c </code> </p></th> <td>Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection-string</code>, </p><p> <code class="option"> -c </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Set node ID for this node, overriding any ID set by --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --no-defaults </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Enable optimizations for selection of nodes for transactions. Enabled by default; use --skip-ndb-optimized-node-selection to disable</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--parallelism=#</code>, </p><p> <code class="option"> -p </code> </p></th> <td>Set degree of parallelism</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --print-defaults </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit; same as --help</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code class="option"> -V </code> </p></th> <td>Display version information and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody></table>

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Directory containing character sets.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

  Number of times to retry connection before giving up.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

  Number of seconds to wait between attempts to contact management server.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection-string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Same as `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Write core file on error; used in debugging.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read given file after global files are read.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read default options from given file only.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Also read groups with concat(group, suffix).

* `--delay=seconds`

  <table frame="box" rules="all" summary="Properties for delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--delay=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>MAX_INT</code></td> </tr></tbody></table>

  This option sets the number of seconds to wait between executing loops. Has no effect if `--loops` is set to 0 or 1.

* `--help`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>0

  Display help text and exit.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>1

  Read given path from login file.

* `--loops=number`, `-l number`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>2

  This option sets the number of times to execute the select. Use `--delay` to set the time between loops.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>3

  Set connect string for connecting to ndb\_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB\_CONNECTSTRING and my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>4

  Same as `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>5

  Set node ID for this node, overriding any ID set by `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>6

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>7

  Do not read default options from any option file other than login file.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>8

  Print program argument list and exit.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>9

  Display help text and exit; same as `--help`.

* `--version`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>0

  Display version information and exit.

**ndbinfo\_select\_all** is unable to read the following tables:

* `arbitrator_validity_detail`
* `arbitrator_validity_summary`
* `cluster_locks`
* `cluster_operations`
* `cluster_transactions`
* `disk_write_speed_aggregate_node`
* `locks_per_fragment`
* `memory_per_fragment`
* `memoryusage`
* `operations_per_fragment`
* `server_locks`
* `server_operations`
* `server_transactions`
* `table_info`


### 21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)

**ndbmtd**") is a multithreaded version of **ndbd**, the process that is used to handle all the data in tables using the `NDBCLUSTER` storage engine. **ndbmtd**") is intended for use on host computers having multiple CPU cores. Except where otherwise noted, **ndbmtd**") functions in the same way as **ndbd**; therefore, in this section, we concentrate on the ways in which **ndbmtd**") differs from **ndbd**, and you should consult Section 21.5.1, “ndbd — The NDB Cluster Data Node Daemon”, for additional information about running NDB Cluster data nodes that apply to both the single-threaded and multithreaded versions of the data node process.

Command-line options and configuration parameters used with **ndbd** also apply to **ndbmtd**"). For more information about these options and parameters, see Section 21.5.1, “ndbd — The NDB Cluster Data Node Daemon”, and Section 21.4.3.6, “Defining NDB Cluster Data Nodes”, respectively.

**ndbmtd**") is also file system-compatible with **ndbd**. In other words, a data node running **ndbd** can be stopped, the binary replaced with **ndbmtd**"), and then restarted without any loss of data. (However, when doing this, you must make sure that `MaxNoOfExecutionThreads` is set to an apppriate value before restarting the node if you wish for **ndbmtd**") to run in multithreaded fashion.) Similarly, an **ndbmtd**") binary can be replaced with **ndbd** simply by stopping the node and then starting **ndbd** in place of the multithreaded binary. It is not necessary when switching between the two to start the data node binary using `--initial`.

Using **ndbmtd**") differs from using **ndbd** in two key respects:

1. Because **ndbmtd**") runs by default in single-threaded mode (that is, it behaves like **ndbd**), you must configure it to use multiple threads. This can be done by setting an appropriate value in the `config.ini` file for the `MaxNoOfExecutionThreads` configuration parameter or the `ThreadConfig` configuration parameter. Using `MaxNoOfExecutionThreads` is simpler, but `ThreadConfig` offers more flexibility. For more information about these configuration parameters and their use, see Multi-Threading Configuration Parameters (ndbmtd)").

2. Trace files are generated by critical errors in **ndbmtd**") processes in a somewhat different fashion from how these are generated by **ndbd** failures. These differences are discussed in more detail in the next few paragraphs.

Like **ndbd**, **ndbmtd**") generates a set of log files which are placed in the directory specified by `DataDir` in the `config.ini` configuration file. Except for trace files, these are generated in the same way and have the same names as those generated by **ndbd**.

In the event of a critical error, **ndbmtd**") generates trace files describing what happened just prior to the error' occurrence. These files, which can be found in the data node's `DataDir`, are useful for analysis of problems by the NDB Cluster Development and Support teams. One trace file is generated for each **ndbmtd**") thread. The names of these files have the following pattern:

```sql
ndb_node_id_trace.log.trace_id_tthread_id,
```

In this pattern, *`node_id`* stands for the data node's unique node ID in the cluster, *`trace_id`* is a trace sequence number, and *`thread_id`* is the thread ID. For example, in the event of the failure of an **ndbmtd**") process running as an NDB Cluster data node having the node ID 3 and with `MaxNoOfExecutionThreads` equal to 4, four trace files are generated in the data node's data directory. If the is the first time this node has failed, then these files are named `ndb_3_trace.log.1_t1`, `ndb_3_trace.log.1_t2`, `ndb_3_trace.log.1_t3`, and `ndb_3_trace.log.1_t4`. Internally, these trace files follow the same format as **ndbd** trace files.

The **ndbd** exit codes and messages that are generated when a data node process shuts down prematurely are also used by **ndbmtd**"). See Data Node Error Messages, for a listing of these.

Note

It is possible to use **ndbd** and **ndbmtd**") concurrently on different data nodes in the same NDB Cluster. However, such configurations have not been tested extensively; thus, we cannot recommend doing so in a production setting at this time.


### 21.5.4 ndb\_mgmd — The NDB Cluster Management Server Daemon

The management server is the process that reads the cluster configuration file and distributes this information to all nodes in the cluster that request it. It also maintains a log of cluster activities. Management clients can connect to the management server and check the cluster's status.

Options that can be used with **ndb\_mgmd** are shown in the following table. Additional descriptions follow the table.

**Table 21.24 Command-line options used with the program ndb\_mgmd**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Format</th> <th>Description</th> <th>Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code class="option"> --bind-address=host </code> </p></th> <td>Local bind address</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --config-cache[=TRUE|FALSE] </code> </p></th> <td>Enable management server configuration cache; true by default</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--config-file=file</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_config-file">-f file</a> </code> </p></th> <td>Specify cluster configuration file; also specify --reload or --initial to override configuration cache if present</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--configdir=directory</code>, </p><p> <code class="option"> --config-dir=directory </code> </p></th> <td>Specify cluster management server configuration cache directory</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Number of times to retry connection before giving up</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Number of seconds to wait between attempts to contact management server</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_connect-string">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --core-file </code> </p></th> <td>Write core file on error; used in debugging</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--daemon</code>, </p><p> <code class="option"> -d </code> </p></th> <td>Run ndb_mgmd in daemon mode (default)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --initial </code> </p></th> <td>Causes management server to reload configuration data from configuration file, bypassing configuration cache</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --install[=name] </code> </p></th> <td>Used to install management server process as Windows service; does not apply on other platforms</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --interactive </code> </p></th> <td>Run ndb_mgmd in interactive mode (not officially supported in production; for testing purposes only)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --log-name=name </code> </p></th> <td>Name to use when writing cluster log messages applying to this node</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --login-path=path </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --mycnf </code> </p></th> <td>Read cluster configuration data from my.cnf file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Set node ID for this node, overriding any ID set by --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Enable optimizations for selection of nodes for transactions. Enabled by default; use --skip-ndb-optimized-node-selection to disable</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --no-defaults </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --no-nodeid-checks </code> </p></th> <td>Do not perform any node ID checks</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --nodaemon </code> </p></th> <td>Do not run ndb_mgmd as a daemon</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --nowait-nodes=list </code> </p></th> <td>Do not wait for management nodes specified when starting this management server; requires --ndb-nodeid option</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --print-defaults </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--print-full-config</code>, </p><p> <code class="option"> -P </code> </p></th> <td>Print full configuration and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --reload </code> </p></th> <td>Causes management server to compare configuration file with configuration cache</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --remove[=name] </code> </p></th> <td>Used to remove management server process that was previously installed as Windows service, optionally specifying name of service to be removed; does not apply on other platforms</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --skip-config-file </code> </p></th> <td>Do not use configuration file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit; same as --help</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--verbose</code>, </p><p> <code class="option"> -v </code> </p></th> <td>Write additional information to log</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code class="option"> -V </code> </p></th> <td>Display version information and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody></table>

* `--bind-address=host`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Causes the management server to bind to a specific network interface (host name or IP address). This option has no default value.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Directory containing character sets.

* `--config-cache`

  <table frame="box" rules="all" summary="Properties for config-cache"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>TRUE</code></td> </tr></tbody></table>

  This option, whose default value is `1` (or `TRUE`, or `ON`), can be used to disable the management server's configuration cache, so that it reads its configuration from `config.ini` every time it starts (see Section 21.4.3, “NDB Cluster Configuration Files”). You can do this by starting the **ndb\_mgmd** process with any one of the following options:

  + `--config-cache=0`
  + `--config-cache=FALSE`
  + `--config-cache=OFF`
  + `--skip-config-cache`

  Using one of the options just listed is effective only if the management server has no stored configuration at the time it is started. If the management server finds any configuration cache files, then the `--config-cache` option or the `--skip-config-cache` option is ignored. Therefore, to disable configuration caching, the option should be used the *first* time that the management server is started. Otherwise—that is, if you wish to disable configuration caching for a management server that has *already* created a configuration cache—you must stop the management server, delete any existing configuration cache files manually, then restart the management server with `--skip-config-cache` (or with `--config-cache` set equal to 0, `OFF`, or `FALSE`).

  Configuration cache files are normally created in a directory named `mysql-cluster` under the installation directory (unless this location has been overridden using the `--configdir` option). Each time the management server updates its configuration data, it writes a new cache file. The files are named sequentially in order of creation using the following format:

  ```sql
  ndb_node-id_config.bin.seq-number
  ```

  *`node-id`* is the management server's node ID; *`seq-number`* is a sequence number, beginning with 1. For example, if the management server's node ID is 5, then the first three configuration cache files would, when they are created, be named `ndb_5_config.bin.1`, `ndb_5_config.bin.2`, and `ndb_5_config.bin.3`.

  If your intent is to purge or reload the configuration cache without actually disabling caching, you should start **ndb\_mgmd** with one of the options `--reload` or `--initial` instead of `--skip-config-cache`.

  To re-enable the configuration cache, simply restart the management server, but without the `--config-cache` or `--skip-config-cache` option that was used previously to disable the configuration cache.

  **ndb\_mgmd** does not check for the configuration directory (`--configdir`) or attempts to create one when `--skip-config-cache` is used. (Bug #13428853)

* `--config-file=filename`, `-f filename`

  <table frame="box" rules="all" summary="Properties for config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file</code></td> </tr><tr><th>Disabled by</th> <td><code>skip-config-file</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Instructs the management server as to which file it should use for its configuration file. By default, the management server looks for a file named `config.ini` in the same directory as the **ndb\_mgmd** executable; otherwise the file name and location must be specified explicitly.

  This option has no default value, and is ignored unless the management server is forced to read the configuration file, either because **ndb\_mgmd** was started with the `--reload` or `--initial` option, or because the management server could not find any configuration cache.

  The `--config-file` option is also read if **ndb\_mgmd** was started with `--config-cache=OFF`. See Section 21.4.3, “NDB Cluster Configuration Files”, for more information.

* `--configdir=dir_name`

  <table frame="box" rules="all" summary="Properties for configdir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--configdir=directory</code><code>--config-dir=directory</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code>$INSTALLDIR/mysql-cluster</code></td> </tr></tbody></table>

  Specifies the cluster management server's configuration cache directory. `--config-dir` is an alias for this option.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

  Number of times to retry connection before giving up.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

  Number of seconds to wait between attempts to contact management server.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Same as `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Write core file on error; used in debugging.

* `--daemon`, `-d`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>0

  Instructs **ndb\_mgmd** to start as a daemon process. This is the default behavior.

  This option has no effect when running **ndb\_mgmd** on Windows platforms.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>1

  Read given file after global files are read.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>2

  Read default options from given file only.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>3

  Also read groups with concat(group, suffix).

* `--help`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>4

  Display help text and exit.

* `--initial`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>5

  Configuration data is cached internally, rather than being read from the cluster global configuration file each time the management server is started (see Section 21.4.3, “NDB Cluster Configuration Files”). Using the `--initial` option overrides this behavior, by forcing the management server to delete any existing cache files, and then to re-read the configuration data from the cluster configuration file and to build a new cache.

  This differs in two ways from the `--reload` option. First, `--reload` forces the server to check the configuration file against the cache and reload its data only if the contents of the file are different from the cache. Second, `--reload` does not delete any existing cache files.

  If **ndb\_mgmd** is invoked with `--initial` but cannot find a global configuration file, the management server cannot start.

  When a management server starts, it checks for another management server in the same NDB Cluster and tries to use the other management server's configuration data. This behavior has implications when performing a rolling restart of an NDB Cluster with multiple management nodes. See Section 21.6.5, “Performing a Rolling Restart of an NDB Cluster”, for more information.

  When used together with the `--config-file` option, the cache is cleared only if the configuration file is actually found.

* `--install[=name]`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>6

  Causes **ndb\_mgmd** to be installed as a Windows service. Optionally, you can specify a name for the service; if not set, the service name defaults to `ndb_mgmd`. Although it is preferable to specify other **ndb\_mgmd** program options in a `my.ini` or `my.cnf` configuration file, it is possible to use them together with `--install`. However, in such cases, the `--install` option must be specified first, before any other options are given, for the Windows service installation to succeed.

  It is generally not advisable to use this option together with the `--initial` option, since this causes the configuration cache to be wiped and rebuilt every time the service is stopped and started. Care should also be taken if you intend to use any other **ndb\_mgmd** options that affect the starting of the management server, and you should make absolutely certain you fully understand and allow for any possible consequences of doing so.

  The `--install` option has no effect on non-Windows platforms.

* `--interactive`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>7

  Starts **ndb\_mgmd** in interactive mode; that is, an **ndb\_mgm** client session is started as soon as the management server is running. This option does not start any other NDB Cluster nodes.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>8

  Read given path from login file.

* `--log-name=name`

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--bind-address=host</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>9

  Provides a name to be used for this node in the cluster log.

* `--mycnf`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>0

  Read configuration data from the `my.cnf` file.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>1

  Set connection string. Syntax: `[nodeid=id;][host=]hostname[:port]`. Overrides entries in `NDB_CONNECTSTRING` and `my.cnf`; ignored if `--config-file` is specified.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>2

  Same as `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>3

  Set node ID for this node, overriding any ID set by `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>4

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>5

  Do not read default options from any option file other than login file.

* `--no-nodeid-checks`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>6

  Do not perform any checks of node IDs.

* `--nodaemon`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>7

  Instructs **ndb\_mgmd** not to start as a daemon process.

  The default behavior for **ndb\_mgmd** on Windows is to run in the foreground, making this option unnecessary on Windows platforms.

* `--nowait-nodes`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>8

  When starting an NDB Cluster is configured with two management nodes, each management server normally checks to see whether the other **ndb\_mgmd** is also operational and whether the other management server's configuration is identical to its own. However, it is sometimes desirable to start the cluster with only one management node (and perhaps to allow the other **ndb\_mgmd** to be started later). This option causes the management node to bypass any checks for any other management nodes whose node IDs are passed to this option, permitting the cluster to start as though configured to use only the management node that was started.

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

  As shown in the preceding example, when using `--nowait-nodes`, you must also use the `--ndb-nodeid` option to specify the node ID of this **ndb\_mgmd** process.

  You can then start each of the cluster's data nodes in the usual way. If you wish to start and use the second management server in addition to the first management server at a later time without restarting the data nodes, you must start each data node with a connection string that references both management servers, like this:

  ```sql
  $> ndbd -c 198.51.100.150,198.51.100.151
  ```

  The same is true with regard to the connection string used with any `mysqld` processes that you wish to start as NDB Cluster SQL nodes connected to this cluster. See Section 21.4.3.3, “NDB Cluster Connection Strings”, for more information.

  When used with **ndb\_mgmd**, this option affects the behavior of the management node with regard to other management nodes only. Do not confuse it with the `--nowait-nodes` option used with **ndbd** or **ndbmtd**") to permit a cluster to start with fewer than its full complement of data nodes; when used with data nodes, this option affects their behavior only with regard to other data nodes.

  Multiple management node IDs may be passed to this option as a comma-separated list. Each node ID must be no less than 1 and no greater than 255. In practice, it is quite rare to use more than two management servers for the same NDB Cluster (or to have any need for doing so); in most cases you need to pass to this option only the single node ID for the one management server that you do not wish to use when starting the cluster.

  Note

  When you later start the “missing” management server, its configuration must match that of the management server that is already in use by the cluster. Otherwise, it fails the configuration check performed by the existing management server, and does not start.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>9

  Print program argument list and exit.

* `--print-full-config`, `-P`

  <table frame="box" rules="all" summary="Properties for config-cache"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>TRUE</code></td> </tr></tbody></table>0

  Shows extended information regarding the configuration of the cluster. With this option on the command line the **ndb\_mgmd** process prints information about the cluster setup including an extensive list of the cluster configuration sections as well as parameters and their values. Normally used together with the `--config-file` (`-f`) option.

* `--reload`

  <table frame="box" rules="all" summary="Properties for config-cache"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>TRUE</code></td> </tr></tbody></table>1

  NDB Cluster configuration data is stored internally rather than being read from the cluster global configuration file each time the management server is started (see Section 21.4.3, “NDB Cluster Configuration Files”). Using this option forces the management server to check its internal data store against the cluster configuration file and to reload the configuration if it finds that the configuration file does not match the cache. Existing configuration cache files are preserved, but not used.

  This differs in two ways from the `--initial` option. First, `--initial` causes all cache files to be deleted. Second, `--initial` forces the management server to re-read the global configuration file and construct a new cache.

  If the management server cannot find a global configuration file, then the `--reload` option is ignored.

  When `--reload` is used, the management server must be able to communicate with data nodes and any other management servers in the cluster before it attempts to read the global configuration file; otherwise, the management server fails to start. This can happen due to changes in the networking environment, such as new IP addresses for nodes or an altered firewall configuration. In such cases, you must use `--initial` instead to force the exsiting cached configuration to be discarded and reloaded from the file. See Section 21.6.5, “Performing a Rolling Restart of an NDB Cluster”, for additional information.

* `--remove{=name]`

  <table frame="box" rules="all" summary="Properties for config-cache"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>TRUE</code></td> </tr></tbody></table>2

  Remove a management server process that has been installed as a Windows service, optionally specifying the name of the service to be removed. Applies only to Windows platforms.

* `--skip-config-file`

  <table frame="box" rules="all" summary="Properties for config-cache"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>TRUE</code></td> </tr></tbody></table>3

  Do not read cluster configuration file; ignore `--initial` and `--reload` options if specified.

* `--usage`

  <table frame="box" rules="all" summary="Properties for config-cache"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>TRUE</code></td> </tr></tbody></table>4

  Display help text and exit; same as `--help`.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for config-cache"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>TRUE</code></td> </tr></tbody></table>5

  Remove a management server process that has been installed as a Windows service, optionally specifying the name of the service to be removed. Applies only to Windows platforms.

* `--version`

  <table frame="box" rules="all" summary="Properties for config-cache"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-cache[=TRUE|FALSE]</code></td> </tr><tr><th>Type</th> <td>Boolean</td> </tr><tr><th>Default Value</th> <td><code>TRUE</code></td> </tr></tbody></table>6

  Display version information and exit.

It is not strictly necessary to specify a connection string when starting the management server. However, if you are using more than one management server, a connection string should be provided and each node in the cluster should specify its node ID explicitly.

See Section 21.4.3.3, “NDB Cluster Connection Strings”, for information about using connection strings. Section 21.5.4, “ndb\_mgmd — The NDB Cluster Management Server Daemon”, describes other options for **ndb\_mgmd**.

The following files are created or used by **ndb\_mgmd** in its starting directory, and are placed in the `DataDir` as specified in the `config.ini` configuration file. In the list that follows, *`node_id`* is the unique node identifier.

* `config.ini` is the configuration file for the cluster as a whole. This file is created by the user and read by the management server. Section 21.4, “Configuration of NDB Cluster”, discusses how to set up this file.

* `ndb_node_id_cluster.log` is the cluster events log file. Examples of such events include checkpoint startup and completion, node startup events, node failures, and levels of memory usage. A complete listing of cluster events with descriptions may be found in Section 21.6, “Management of NDB Cluster”.

  By default, when the size of the cluster log reaches one million bytes, the file is renamed to `ndb_node_id_cluster.log.seq_id`, where *`seq_id`* is the sequence number of the cluster log file. (For example: If files with the sequence numbers 1, 2, and 3 already exist, the next log file is named using the number `4`.) You can change the size and number of files, and other characteristics of the cluster log, using the `LogDestination` configuration parameter.

* `ndb_node_id_out.log` is the file used for `stdout` and `stderr` when running the management server as a daemon.

* `ndb_node_id.pid` is the process ID file used when running the management server as a daemon.


### 21.5.5 ndb\_mgm — The NDB Cluster Management Client

The **ndb\_mgm** management client process is actually not needed to run the cluster. Its value lies in providing a set of commands for checking the cluster's status, starting backups, and performing other administrative functions. The management client accesses the management server using a C API. Advanced users can also employ this API for programming dedicated management processes to perform tasks similar to those performed by **ndb\_mgm**.

To start the management client, it is necessary to supply the host name and port number of the management server:

```sql
$> ndb_mgm [host_name [port_num]]
```

For example:

```sql
$> ndb_mgm ndb_mgmd.mysql.com 1186
```

The default host name and port number are `localhost` and 1186, respectively.

Options that can be used with **ndb\_mgm** are shown in the following table. Additional descriptions follow the table.

**Table 21.25 Command-line options used with the program ndb\_mgm**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Format</th> <th>Description</th> <th>Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Number of seconds to wait between attempts to contact management server</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_connect-string">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --core-file </code> </p></th> <td>Write core file on error; used in debugging</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--execute=command</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_execute">-e command</a> </code> </p></th> <td>Execute command and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --login-path=path </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Set node ID for this node, overriding any ID set by --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Enable optimizations for selection of nodes for transactions. Enabled by default; use --skip-ndb-optimized-node-selection to disable</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --no-defaults </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --print-defaults </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--try-reconnect=#</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-mgm.html#option_ndb_mgm_try-reconnect">-t #</a> </code> </p></th> <td>Set number of times to retry connection before giving up; synonym for --connect-retries</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit; same as --help</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code class="option"> -V </code> </p></th> <td>Display version information and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody></table>

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Directory containing character sets.

* `--connect-retries=#`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>3</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  This option specifies the number of times following the first attempt to retry a connection before giving up (the client always tries the connection at least once). The length of time to wait per attempt is set using `--connect-retry-delay`.

  This option is synonymous with the `--try-reconnect` option, which is now deprecated.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

  Number of seconds to wait between attempts to contact management server.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Same as `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Write core file on error; used in debugging.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read given file after global files are read.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read default options from given file only.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Also read groups with concat(group, suffix).

* `--execute=command`, `-e command`

  <table frame="box" rules="all" summary="Properties for execute"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--execute=command</code></td> </tr></tbody></table>

  This option can be used to send a command to the NDB Cluster management client from the system shell. For example, either of the following is equivalent to executing `SHOW` in the management client:

  ```sql
  $> ndb_mgm -e "SHOW"

  $> ndb_mgm --execute="SHOW"
  ```

  This is analogous to how the `--execute` or `-e` option works with the **mysql** command-line client. See Section 4.2.2.1, “Using Options on the Command Line”.

  Note

  If the management client command to be passed using this option contains any space characters, then the command *must* be enclosed in quotation marks. Either single or double quotation marks may be used. If the management client command contains no space characters, the quotation marks are optional.

* `--help`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>0

  Display help text and exit.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>1

  Read given path from login file.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>2

  Set connect string for connecting to **ndb\_mgmd**. Syntax: [`nodeid=id;`][`host=`]`hostname`[`:port`]. Overrides entries in `NDB_CONNECTSTRING` and `my.cnf`.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>3

  Same as `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>4

  Set node ID for this node, overriding any ID set by `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>5

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>6

  Do not read default options from any option file other than login file.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>7

  Print program argument list and exit.

* `--try-reconnect=number`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>8

  If the connection to the management server is broken, the node tries to reconnect to it every 5 seconds until it succeeds. By using this option, it is possible to limit the number of attempts to *`number`* before giving up and reporting an error instead.

  This option is deprecated and subject to removal in a future release. Use `--connect-retries`, instead.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>9

  Display help text and exit; same as `--help`.

* `--version`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>3</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>0

  Display version information and exit.

Additional information about using **ndb\_mgm** can be found in Section 21.6.1, “Commands in the NDB Cluster Management Client”.


### 21.5.6 ndb\_blob\_tool — Check and Repair BLOB and TEXT columns of NDB Cluster Tables

This tool can be used to check for and remove orphaned BLOB column parts from `NDB` tables, as well as to generate a file listing any orphaned parts. It is sometimes useful in diagnosing and repairing corrupted or damaged `NDB` tables containing `BLOB` or `TEXT` columns.

The basic syntax for **ndb\_blob\_tool** is shown here:

```sql
ndb_blob_tool [options] table [column, ...]
```

Unless you use the `--help` option, you must specify an action to be performed by including one or more of the options `--check-orphans`, `--delete-orphans`, or `--dump-file`. These options cause **ndb\_blob\_tool** to check for orphaned BLOB parts, remove any orphaned BLOB parts, and generate a dump file listing orphaned BLOB parts, respectively, and are described in more detail later in this section.

You must also specify the name of a table when invoking **ndb\_blob\_tool**. In addition, you can optionally follow the table name with the (comma-separated) names of one or more `BLOB` or `TEXT` columns from that table. If no columns are listed, the tool works on all of the table's `BLOB` and `TEXT` columns. If you need to specify a database, use the `--database` (`-d`) option.

The `--verbose` option provides additional information in the output about the tool's progress.

Options that can be used with **ndb\_blob\_tool** are shown in the following table. Additional descriptions follow the table.

**Table 21.26 Command-line options used with the program ndb\_blob\_tool**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Format</th> <th>Description</th> <th>Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code class="option"> --add-missing </code> </p></th> <td>Write dummy blob parts to take place of those which are missing</td> <td><p> ADDED: NDB 7.5.18, NDB 7.6.14 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --check-missing </code> </p></th> <td>Check for blobs having inline parts but missing one or more parts from parts table</td> <td><p> ADDED: NDB 7.5.18, NDB 7.6.14 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --check-orphans </code> </p></th> <td>Check for blob parts having no corresponding inline parts</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Number of times to retry connection before giving up</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Number of seconds to wait between attempts to contact management server</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_connect-string">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --core-file </code> </p></th> <td>Write core file on error; used in debugging</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--database=name</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_database">-d name</a> </code> </p></th> <td>Database to find the table in</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --delete-orphans </code> </p></th> <td>Delete blob parts having no corresponding inline parts</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --dump-file=file </code> </p></th> <td>Write orphan keys to specified file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --login-path=path </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-blob-tool.html#option_ndb_blob_tool_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Set node ID for this node, overriding any ID set by --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Enable optimizations for selection of nodes for transactions. Enabled by default; use --skip-ndb-optimized-node-selection to disable</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --no-defaults </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --print-defaults </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit; same as --help</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--verbose</code>, </p><p> <code class="option"> -v </code> </p></th> <td>Verbose output</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code class="option"> -V </code> </p></th> <td>Display version information and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody></table>

* `--add-missing`

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>

  For each inline part in NDB Cluster tables which has no corresponding BLOB part, write a dummy BLOB part of the required length, consisting of spaces.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Directory containing character sets.

* `--check-missing`

  <table frame="box" rules="all" summary="Properties for check-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--check-missing</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>

  Check for inline parts in NDB Cluster tables which have no corresponding BLOB parts.

* `--check-orphans`

  <table frame="box" rules="all" summary="Properties for check-orphans"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--check-orphans</code></td> </tr></tbody></table>

  Check for BLOB parts in NDB Cluster tables which have no corresponding inline parts.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

  Number of times to retry connection before giving up.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

  Number of seconds to wait between attempts to contact management server.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Same as `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Write core file on error; used in debugging.

* `--database=db_name`, `-d`

  <table frame="box" rules="all" summary="Properties for database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--database=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Specify the database to find the table in.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>0

  Read given file after global files are read.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>1

  Read default options from given file only.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>2

  Also read groups with concat(group, suffix).

* `--delete-orphans`

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>3

  Remove BLOB parts from NDB Cluster tables which have no corresponding inline parts.

* `--dump-file=file`

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>4

  Writes a list of orphaned BLOB column parts to *`file`*. The information written to the file includes the table key and BLOB part number for each orphaned BLOB part.

* `--help`

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>5

  Display help text and exit.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>6

  Read given path from login file.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>7

  Set connect string for connecting to ndb\_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB\_CONNECTSTRING and my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>8

  Same as `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for add-missing"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--add-missing</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr></tbody></table>9

  Set node ID for this node, overriding any ID set by `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>0

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>1

  Do not read default options from any option file other than login file.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>2

  Print program argument list and exit.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>3

  Display help text and exit; same as `--help`.

* `--verbose`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>4

  Provide extra information in the tool's output regarding its progress.

* `--version`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>5

  Display version information and exit.

#### Example

First we create an `NDB` table in the `test` database, using the `CREATE TABLE` statement shown here:

```sql
USE test;

CREATE TABLE btest (
    c0 BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    c1 TEXT,
    c2 BLOB
)   ENGINE=NDB;
```

Then we insert a few rows into this table, using a series of statements similar to this one:

```sql
INSERT INTO btest VALUES (NULL, 'x', REPEAT('x', 1000));
```

When run with `--check-orphans` against this table, **ndb\_blob\_tool** generates the following output:

```sql
$> ndb_blob_tool --check-orphans --verbose -d test btest
connected
processing 2 blobs
processing blob #0 c1 NDB$BLOB_19_1
NDB$BLOB_19_1: nextResult: res=1
total parts: 0
orphan parts: 0
processing blob #1 c2 NDB$BLOB_19_2
NDB$BLOB_19_2: nextResult: res=0
NDB$BLOB_19_2: nextResult: res=0
NDB$BLOB_19_2: nextResult: res=0
NDB$BLOB_19_2: nextResult: res=0
NDB$BLOB_19_2: nextResult: res=0
NDB$BLOB_19_2: nextResult: res=0
NDB$BLOB_19_2: nextResult: res=0
NDB$BLOB_19_2: nextResult: res=0
NDB$BLOB_19_2: nextResult: res=0
NDB$BLOB_19_2: nextResult: res=0
NDB$BLOB_19_2: nextResult: res=1
total parts: 10
orphan parts: 0
disconnected

NDBT_ProgramExit: 0 - OK
```

The tool reports that there are no `NDB` BLOB column parts associated with column `c1`, even though `c1` is a `TEXT` column. This is due to the fact that, in an `NDB` table, only the first 256 bytes of a `BLOB` or `TEXT` column value are stored inline, and only the excess, if any, is stored separately; thus, if there are no values using more than 256 bytes in a given column of one of these types, no `BLOB` column parts are created by `NDB` for this column. See Section 11.7, “Data Type Storage Requirements”, for more information.


### 21.5.7 ndb\_config — Extract NDB Cluster Configuration Information

This tool extracts current configuration information for data nodes, SQL nodes, and API nodes from one of a number of sources: an NDB Cluster management node, or its `config.ini` or `my.cnf` file. By default, the management node is the source for the configuration data; to override the default, execute ndb\_config with the `--config-file` or `--mycnf` option. It is also possible to use a data node as the source by specifying its node ID with `--config_from_node=node_id`.

**ndb\_config** can also provide an offline dump of all configuration parameters which can be used, along with their default, maximum, and minimum values and other information. The dump can be produced in either text or XML format; for more information, see the discussion of the `--configinfo` and `--xml` options later in this section).

You can filter the results by section (`DB`, `SYSTEM`, or `CONNECTIONS`) using one of the options `--nodes`, `--system`, or `--connections`.

Options that can be used with **ndb\_config** are shown in the following table. Additional descriptions follow the table.

**Table 21.27 Command-line options used with the program ndb\_config**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Format</th> <th>Description</th> <th>Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --config-file=file_name </code> </p></th> <td>Set the path to config.ini file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --config-from-node=# </code> </p></th> <td>Obtain configuration data from the node having this ID (must be a data node)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --configinfo </code> </p></th> <td>Dumps information about all NDB configuration parameters in text format with default, maximum, and minimum values. Use with --xml to obtain XML output</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connections </code> </p></th> <td>Print information only about connections specified in [tcp], [tcp default], [sci], [sci default], [shm], or [shm default] sections of cluster configuration file. Cannot be used with --system or --nodes</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Number of times to retry connection before giving up</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Number of seconds to wait between attempts to contact management server</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_connect-string">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --core-file </code> </p></th> <td>Write core file on error; used in debugging</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --diff-default </code> </p></th> <td>Print only configuration parameters that have non-default values</td> <td><p> ADDED: NDB 7.5.7, NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--fields=string</code>, </p><p> <code class="option"> -f </code> </p></th> <td>Field separator</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --host=name </code> </p></th> <td>Specify host</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --login-path=path </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --mycnf </code> </p></th> <td>Read configuration data from my.cnf file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Set node ID for this node, overriding any ID set by --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Enable optimizations for selection of nodes for transactions. Enabled by default; use --skip-ndb-optimized-node-selection to disable</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --no-defaults </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --nodeid=# </code> </p></th> <td>Get configuration of node with this ID</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --nodes </code> </p></th> <td>Print node information ([ndbd] or [ndbd default] section of cluster configuration file) only. Cannot be used with --system or --connections</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--query=string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_query">-q string</a> </code> </p></th> <td>One or more query options (attributes)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--query-all</code>, </p><p> <code class="option"> -a </code> </p></th> <td>Dumps all parameters and values to a single comma-delimited string</td> <td><p> ADDED: NDB 7.4.16, NDB 7.5.7 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --print-defaults </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--rows=string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_rows">-r string</a> </code> </p></th> <td>Row separator</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --system </code> </p></th> <td>Print SYSTEM section information only (see ndb_config --configinfo output). Cannot be used with --nodes or --connections</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --type=name </code> </p></th> <td>Specify node type</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit; same as --help</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code class="option"> -V </code> </p></th> <td>Display version information and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-config.html#option_ndb_config_xml">--configinfo --xml</a> </code> </p></th> <td>Use --xml with --configinfo to obtain a dump of all NDB configuration parameters in XML format with default, maximum, and minimum values</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody></table>

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Directory containing character sets.

* `--configinfo`

  The `--configinfo` option causes **ndb\_config** to dump a list of each NDB Cluster configuration parameter supported by the NDB Cluster distribution of which **ndb\_config** is a part, including the following information:

  + A brief description of each parameter's purpose, effects, and usage

  + The section of the `config.ini` file where the parameter may be used

  + The parameter's data type or unit of measurement
  + Where applicable, the parameter's default, minimum, and maximum values

  + NDB Cluster release version and build information

  By default, this output is in text format. Part of this output is shown here:

  ```sql
  $> ndb_config --configinfo

  ****** SYSTEM ******

  Name (String)
  Name of system (NDB Cluster)
  MANDATORY

  PrimaryMGMNode (Non-negative Integer)
  Node id of Primary ndb_mgmd(MGM) node
  Default: 0 (Min: 0, Max: 4294967039)

  ConfigGenerationNumber (Non-negative Integer)
  Configuration generation number
  Default: 0 (Min: 0, Max: 4294967039)

  ****** DB ******

  MaxNoOfSubscriptions (Non-negative Integer)
  Max no of subscriptions (default 0 == MaxNoOfTables)
  Default: 0 (Min: 0, Max: 4294967039)

  MaxNoOfSubscribers (Non-negative Integer)
  Max no of subscribers (default 0 == 2 * MaxNoOfTables)
  Default: 0 (Min: 0, Max: 4294967039)

  …
  ```

  Use this option together with the `--xml` option to obtain output in XML format.

* `--config-file=path-to-file`

  <table frame="box" rules="all" summary="Properties for config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>

  Gives the path to the management server's configuration file (`config.ini`). This may be a relative or absolute path. If the management node resides on a different host from the one on which **ndb\_config** is invoked, then an absolute path must be used.

* `--config_from_node=#`

  <table frame="box" rules="all" summary="Properties for config_from_node"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-from-node=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>48</code></td> </tr></tbody></table>

  Obtain the cluster's configuration data from the data node that has this ID.

  If the node having this ID is not a data node, **ndb\_config** fails with an error. (To obtain configuration data from the management node instead, simply omit this option.)

* `--connections`

  <table frame="box" rules="all" summary="Properties for connections"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connections</code></td> </tr></tbody></table>

  Tells **ndb\_config** to print `CONNECTIONS` information only—that is, information about parameters found in the `[tcp]`, `[tcp default]`, `[shm]`, or `[shm default]` sections of the cluster configuration file (see Section 21.4.3.10, “NDB Cluster TCP/IP Connections”, and Section 21.4.3.12, “NDB Cluster Shared Memory Connections”, for more information).

  This option is mutually exclusive with `--nodes` and `--system`; only one of these 3 options can be used.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

  Number of times to retry connection before giving up.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

  Number of seconds to wait between attempts to contact management server.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Same as `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Write core file on error; used in debugging.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read given file after global files are read.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>0

  Read default options from given file only.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>1

  Also read groups with concat(group, suffix).

* `--diff-default`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>2

  Print only configuration parameters that have non-default values.

* `--fields=delimiter`, `-f` *`delimiter`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>3

  Specifies a *`delimiter`* string used to separate the fields in the result. The default is `,` (the comma character).

  Note

  If the *`delimiter`* contains spaces or escapes (such as `\n` for the linefeed character), then it must be quoted.

* `--help`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>4

  Display help text and exit.

* `--host=hostname`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>5

  Specifies the host name of the node for which configuration information is to be obtained.

  Note

  While the hostname `localhost` usually resolves to the IP address `127.0.0.1`, this may not necessarily be true for all operating platforms and configurations. This means that it is possible, when `localhost` is used in `config.ini`, for **ndb\_config `--host=localhost`** to fail if **ndb\_config** is run on a different host where `localhost` resolves to a different address (for example, on some versions of SUSE Linux, this is `127.0.0.2`). In general, for best results, you should use numeric IP addresses for all NDB Cluster configuration values relating to hosts, or verify that all NDB Cluster hosts handle `localhost` in the same fashion.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>6

  Read given path from login file.

* `--mycnf`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>7

  Read configuration data from the `my.cnf` file.

* `--ndb-connectstring=connection_string`, `-c connection_string`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>8

  Specifies the connection string to use in connecting to the management server. The format for the connection string is the same as described in Section 21.4.3.3, “NDB Cluster Connection Strings”, and defaults to `localhost:1186`.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>9

  Same as `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>0

  Set node ID for this node, overriding any ID set by `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>1

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>2

  Do not read default options from any option file other than login file.

* `--nodeid=node_id`

  <table frame="box" rules="all" summary="Properties for config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>3

  Specify the node ID of the node for which configuration information is to be obtained. Formerly, `--id` could be used as a synonym for this option; in NDB 7.5 and later, the only form accepted is `--nodeid`.

* `--nodes`

  <table frame="box" rules="all" summary="Properties for config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>4

  Tells **ndb\_config** to print information relating only to parameters defined in an `[ndbd]` or `[ndbd default]` section of the cluster configuration file (see Section 21.4.3.6, “Defining NDB Cluster Data Nodes”).

  This option is mutually exclusive with `--connections` and `--system`; only one of these 3 options can be used.

* `--query=query-options`, `-q` *`query-options`*

  <table frame="box" rules="all" summary="Properties for config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>5

  This is a comma-delimited list of query options—that is, a list of one or more node attributes to be returned. These include `nodeid` (node ID), type (node type—that is, `ndbd`, `mysqld`, or `ndb_mgmd`), and any configuration parameters whose values are to be obtained.

  For example, `--query=nodeid,type,datamemory,datadir` returns the node ID, node type, `DataMemory`, and `DataDir` for each node.

  Formerly, `id` was accepted as a synonym for `nodeid`, but has been removed in NDB 7.5 and later.

  Note

  If a given parameter is not applicable to a certain type of node, than an empty string is returned for the corresponding value. See the examples later in this section for more information.

* `--query-all`, `-a`

  <table frame="box" rules="all" summary="Properties for config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>6

  Returns a comma-delimited list of all query options (node attributes; note that this list is a single string.

  This option was introduced in NDB 7.5.7 (Bug #60095, Bug #11766869).

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>7

  Print program argument list and exit.

* `--rows=separator`, `-r` *`separator`*

  <table frame="box" rules="all" summary="Properties for config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>8

  Specifies a *`separator`* string used to separate the rows in the result. The default is a space character.

  Note

  If the *`separator`* contains spaces or escapes (such as `\n` for the linefeed character), then it must be quoted.

* `--system`

  <table frame="box" rules="all" summary="Properties for config-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-file=file_name</code></td> </tr><tr><th>Type</th> <td>File name</td> </tr><tr><th>Default Value</th> <td><code></code></td> </tr></tbody></table>9

  Tells **ndb\_config** to print `SYSTEM` information only. This consists of system variables that cannot be changed at run time; thus, there is no corresponding section of the cluster configuration file for them. They can be seen (prefixed with `****** SYSTEM ******`) in the output of **ndb\_config** `--configinfo`.

  This option is mutually exclusive with `--nodes` and `--connections`; only one of these 3 options can be used.

* `--type=node_type`

  <table frame="box" rules="all" summary="Properties for config_from_node"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-from-node=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>48</code></td> </tr></tbody></table>0

  Filters results so that only configuration values applying to nodes of the specified *`node_type`* (`ndbd`, `mysqld`, or `ndb_mgmd`) are returned.

* `--usage`, `--help`, or `-?`

  <table frame="box" rules="all" summary="Properties for config_from_node"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-from-node=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>48</code></td> </tr></tbody></table>1

  Causes **ndb\_config** to print a list of available options, and then exit. Synonym for `--help`.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for config_from_node"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-from-node=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>48</code></td> </tr></tbody></table>2

  Causes **ndb\_config** to print a version information string, and then exit.

* `--configinfo` `--xml`

  <table frame="box" rules="all" summary="Properties for config_from_node"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--config-from-node=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>48</code></td> </tr></tbody></table>3

  Cause **ndb\_config** `--configinfo` to provide output as XML by adding this option. A portion of such output is shown in this example:

  ```sql
  $> ndb_config --configinfo --xml

  <configvariables protocolversion="1" ndbversionstring="5.7.44-ndb-7.5.36"
                      ndbversion="460032" ndbversionmajor="7" ndbversionminor="5"
                      ndbversionbuild="0">
    <section name="SYSTEM">
      <param name="Name" comment="Name of system (NDB Cluster)" type="string"
                mandatory="true"/>
      <param name="PrimaryMGMNode" comment="Node id of Primary ndb_mgmd(MGM) node"
                type="unsigned" default="0" min="0" max="4294967039"/>
      <param name="ConfigGenerationNumber" comment="Configuration generation number"
                type="unsigned" default="0" min="0" max="4294967039"/>
    </section>
    <section name="MYSQLD" primarykeys="NodeId">
      <param name="wan" comment="Use WAN TCP setting as default" type="bool"
                default="false"/>
      <param name="HostName" comment="Name of computer for this node"
                type="string" default=""/>
      <param name="Id" comment="NodeId" type="unsigned" mandatory="true"
                min="1" max="255" deprecated="true"/>
      <param name="NodeId" comment="Number identifying application node (mysqld(API))"
                type="unsigned" mandatory="true" min="1" max="255"/>
      <param name="ExecuteOnComputer" comment="HostName" type="string"
                deprecated="true"/>

      …

    </section>

    …

  </configvariables>
  ```

  Note

  Normally, the XML output produced by **ndb\_config** `--configinfo` `--xml` is formatted using one line per element; we have added extra whitespace in the previous example, as well as the next one, for reasons of legibility. This should not make any difference to applications using this output, since most XML processors either ignore nonessential whitespace as a matter of course, or can be instructed to do so.

  The XML output also indicates when changing a given parameter requires that data nodes be restarted using the `--initial` option. This is shown by the presence of an `initial="true"` attribute in the corresponding `<param>` element. In addition, the restart type (`system` or `node`) is also shown; if a given parameter requires a system restart, this is indicated by the presence of a `restart="system"` attribute in the corresponding `<param>` element. For example, changing the value set for the `Diskless` parameter requires a system initial restart, as shown here (with the `restart` and `initial` attributes highlighted for visibility):

  ```sql
  <param name="Diskless" comment="Run wo/ disk" type="bool" default="false"
            restart="system" initial="true"/>
  ```

  Currently, no `initial` attribute is included in the XML output for `<param>` elements corresponding to parameters which do not require initial restarts; in other words, `initial="false"` is the default, and the value `false` should be assumed if the attribute is not present. Similarly, the default restart type is `node` (that is, an online or “rolling” restart of the cluster), but the `restart` attribute is included only if the restart type is `system` (meaning that all cluster nodes must be shut down at the same time, then restarted).

  Deprecated parameters are indicated in the XML output by the `deprecated` attribute, as shown here:

  ```sql
  <param name="NoOfDiskPagesToDiskAfterRestartACC" comment="DiskCheckpointSpeed"
         type="unsigned" default="20" min="1" max="4294967039" deprecated="true"/>
  ```

  In such cases, the `comment` refers to one or more parameters that supersede the deprecated parameter. Similarly to `initial`, the `deprecated` attribute is indicated only when the parameter is deprecated, with `deprecated="true"`, and does not appear at all for parameters which are not deprecated. (Bug #21127135)

  Beginning with NDB 7.5.0, parameters that are required are indicated with `mandatory="true"`, as shown here:

  ```sql
  <param name="NodeId"
            comment="Number identifying application node (mysqld(API))"
            type="unsigned" mandatory="true" min="1" max="255"/>
  ```

  In much the same way that the `initial` or `deprecated` attribute is displayed only for a parameter that requires an intial restart or that is deprecated, the `mandatory` attribute is included only if the given parameter is actually required.

  Important

  The `--xml` option can be used only with the `--configinfo` option. Using `--xml` without `--configinfo` fails with an error.

  Unlike the options used with this program to obtain current configuration data, `--configinfo` and `--xml` use information obtained from the NDB Cluster sources when **ndb\_config** was compiled. For this reason, no connection to a running NDB Cluster or access to a `config.ini` or `my.cnf` file is required for these two options.

Combining other **ndb\_config** options (such as `--query` or `--type`) with `--configinfo` (with or without the `--xml` option is not supported. Currently, if you attempt to do so, the usual result is that all other options besides `--configinfo` or `--xml` are simply ignored. *However, this behavior is not guaranteed and is subject to change at any time*. In addition, since **ndb\_config**, when used with the `--configinfo` option, does not access the NDB Cluster or read any files, trying to specify additional options such as `--ndb-connectstring` or `--config-file` with `--configinfo` serves no purpose.

#### Examples

1. To obtain the node ID and type of each node in the cluster:

   ```sql
   $> ./ndb_config --query=nodeid,type --fields=':' --rows='\n'
   1:ndbd
   2:ndbd
   3:ndbd
   4:ndbd
   5:ndb_mgmd
   6:mysqld
   7:mysqld
   8:mysqld
   9:mysqld
   ```

   In this example, we used the `--fields` options to separate the ID and type of each node with a colon character (`:`), and the `--rows` options to place the values for each node on a new line in the output.

2. To produce a connection string that can be used by data, SQL, and API nodes to connect to the management server:

   ```sql
   $> ./ndb_config --config-file=usr/local/mysql/cluster-data/config.ini \
   --query=hostname,portnumber --fields=: --rows=, --type=ndb_mgmd
   198.51.100.179:1186
   ```

3. This invocation of **ndb\_config** checks only data nodes (using the `--type` option), and shows the values for each node's ID and host name, as well as the values set for its `DataMemory` and `DataDir` parameters:

   ```sql
   $> ./ndb_config --type=ndbd --query=nodeid,host,datamemory,datadir -f ' : ' -r '\n'
   1 : 198.51.100.193 : 83886080 : /usr/local/mysql/cluster-data
   2 : 198.51.100.112 : 83886080 : /usr/local/mysql/cluster-data
   3 : 198.51.100.176 : 83886080 : /usr/local/mysql/cluster-data
   4 : 198.51.100.119 : 83886080 : /usr/local/mysql/cluster-data
   ```

   In this example, we used the short options `-f` and `-r` for setting the field delimiter and row separator, respectively, as well as the short option `-q` to pass a list of parameters to be obtained.

4. To exclude results from any host except one in particular, use the `--host` option:

   ```sql
   $> ./ndb_config --host=198.51.100.176 -f : -r '\n' -q id,type
   3:ndbd
   5:ndb_mgmd
   ```

   In this example, we also used the short form `-q` to determine the attributes to be queried.

   Similarly, you can limit results to a node with a specific ID using the `--nodeid` option.


### 21.5.8 ndb\_cpcd — Automate Testing for NDB Development

A utility having this name was formerly part of an internal automated test framework used in testing and debugging NDB Cluster. It is no longer included in NDB Cluster distributions provided by Oracle.


### 21.5.9 ndb\_delete\_all — Delete All Rows from an NDB Table

**ndb\_delete\_all** deletes all rows from the given `NDB` table. In some cases, this can be much faster than `DELETE` or even `TRUNCATE TABLE`.

#### Usage

```sql
ndb_delete_all -c connection_string tbl_name -d db_name
```

This deletes all rows from the table named *`tbl_name`* in the database named *`db_name`*. It is exactly equivalent to executing `TRUNCATE db_name.tbl_name` in MySQL.

Options that can be used with **ndb\_delete\_all** are shown in the following table. Additional descriptions follow the table.

**Table 21.28 Command-line options used with the program ndb\_delete\_all**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Format</th> <th>Description</th> <th>Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Number of times to retry connection before giving up</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Number of seconds to wait between attempts to contact management server</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-delete-all.html#option_ndb_delete_all_connect-string">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --core-file </code> </p></th> <td>Write core file on error; used in debugging</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--database=name</code>, </p><p> <code>-d name</code> </p></th> <td>Name of the database in which the table is found</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--diskscan</code> </p></th> <td>Perform disk scan</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --login-path=path </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-delete-all.html#option_ndb_delete_all_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-delete-all.html#option_ndb_delete_all_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Set node ID for this node, overriding any ID set by --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Enable optimizations for selection of nodes for transactions. Enabled by default; use --skip-ndb-optimized-node-selection to disable</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --no-defaults </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --print-defaults </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--transactional</code>, </p><p> <code class="option"> -t </code> </p></th> <td>Perform delete in one single transaction; possible to run out of operations when used</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--tupscan</code> </p></th> <td>Perform tuple scan</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit; same as --help</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code class="option"> -V </code> </p></th> <td>Display version information and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody></table>

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Directory containing character sets.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

  Number of times to retry connection before giving up.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

  Number of seconds to wait between attempts to contact management server.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Same as --ndb-connectstring.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Write core file on error; used in debugging.

* `--database`, `-d`

  <table frame="box" rules="all" summary="Properties for database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--database=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>TEST_DB</code></td> </tr></tbody></table>

  Name of the database containing the table to delete from.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read given file after global files are read.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read default options from given file only.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Also read groups with concat(group, suffix).

* `--diskscan`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>0

  Run a disk scan.

* `--help`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>1

  Display help text and exit.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>2

  Read given path from login file.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>3

  Set connect string for connecting to ndb\_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB\_CONNECTSTRING and my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>4

  Same as --ndb-connectstring.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>5

  Set node ID for this node, overriding any ID set by --ndb-connectstring.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>6

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>7

  Do not read default options from any option file other than login file.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>8

  Print program argument list and exit.

* `--transactional`, `-t`

  Use of this option causes the delete operation to be performed as a single transaction.

  Warning

  With very large tables, using this option may cause the number of operations available to the cluster to be exceeded.

* `--tupscan`

  Run a tuple scan.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>9

  Display help text and exit; same as --help.

* `--version`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>0

  Display version information and exit.


### 21.5.10 ndb\_desc — Describe NDB Tables

**ndb\_desc** provides a detailed description of one or more `NDB` tables.

#### Usage

```sql
ndb_desc -c connection_string tbl_name -d db_name [options]

ndb_desc -c connection_string index_name -d db_name -t tbl_name
```

Additional options that can be used with **ndb\_desc** are listed later in this section.

#### Sample Output

MySQL table creation and population statements:

```sql
USE test;

CREATE TABLE fish (
    id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
    length_mm INT(11) NOT NULL,
    weight_gm INT(11) NOT NULL,

    PRIMARY KEY pk (id),
    UNIQUE KEY uk (name)
) ENGINE=NDB;

INSERT INTO fish VALUES
    (NULL, 'guppy', 35, 2), (NULL, 'tuna', 2500, 150000),
    (NULL, 'shark', 3000, 110000), (NULL, 'manta ray', 1500, 50000),
    (NULL, 'grouper', 900, 125000), (NULL ,'puffer', 250, 2500);
```

Output from **ndb\_desc**:

```sql
$> ./ndb_desc -c localhost fish -d test -p
-- fish --
Version: 2
Fragment type: HashMapPartition
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: no
Number of attributes: 4
Number of primary keys: 1
Length of frm data: 337
Max Rows: 0
Row Checksum: 1
Row GCI: 1
SingleUserMode: 0
ForceVarPart: 1
PartitionCount: 2
FragmentCount: 2
PartitionBalance: FOR_RP_BY_LDM
ExtraRowGciBits: 0
ExtraRowAuthorBits: 0
TableStatus: Retrieved
Table options:
HashMap: DEFAULT-HASHMAP-3840-2
-- Attributes --
id Int PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY AUTO_INCR
name Varchar(20;latin1_swedish_ci) NOT NULL AT=SHORT_VAR ST=MEMORY DYNAMIC
length_mm Int NOT NULL AT=FIXED ST=MEMORY DYNAMIC
weight_gm Int NOT NULL AT=FIXED ST=MEMORY DYNAMIC
-- Indexes --
PRIMARY KEY(id) - UniqueHashIndex
PRIMARY(id) - OrderedIndex
uk(name) - OrderedIndex
uk$unique(name) - UniqueHashIndex
-- Per partition info --
Partition       Row count       Commit count    Frag fixed memory       Frag varsized memory    Extent_space    Free extent_space
0               2               2               32768                   32768                   0               0
1               4               4               32768                   32768                   0               0


NDBT_ProgramExit: 0 - OK
```

Information about multiple tables can be obtained in a single invocation of **ndb\_desc** by using their names, separated by spaces. All of the tables must be in the same database.

You can obtain additional information about a specific index using the `--table` (short form: `-t`) option and supplying the name of the index as the first argument to **ndb\_desc**, as shown here:

```sql
$> ./ndb_desc uk -d test -t fish
-- uk --
Version: 2
Base table: fish
Number of attributes: 1
Logging: 0
Index type: OrderedIndex
Index status: Retrieved
-- Attributes --
name Varchar(20;latin1_swedish_ci) NOT NULL AT=SHORT_VAR ST=MEMORY
-- IndexTable 10/uk --
Version: 2
Fragment type: FragUndefined
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: yes
Number of attributes: 2
Number of primary keys: 1
Length of frm data: 0
Max Rows: 0
Row Checksum: 1
Row GCI: 1
SingleUserMode: 2
ForceVarPart: 0
PartitionCount: 2
FragmentCount: 2
FragmentCountType: ONE_PER_LDM_PER_NODE
ExtraRowGciBits: 0
ExtraRowAuthorBits: 0
TableStatus: Retrieved
Table options:
-- Attributes --
name Varchar(20;latin1_swedish_ci) NOT NULL AT=SHORT_VAR ST=MEMORY
NDB$TNODE Unsigned [64] PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY
-- Indexes --
PRIMARY KEY(NDB$TNODE) - UniqueHashIndex

NDBT_ProgramExit: 0 - OK
```

When an index is specified in this way, the `--extra-partition-info` and `--extra-node-info` options have no effect.

The `Version` column in the output contains the table's schema object version. For information about interpreting this value, see NDB Schema Object Versions.

Three of the table properties that can be set using `NDB_TABLE` comments embedded in `CREATE TABLE` and `ALTER TABLE` statements are also visible in **ndb\_desc** output. The table's `FRAGMENT_COUNT_TYPE` is always shown in the `FragmentCountType` column. `READ_ONLY` and `FULLY_REPLICATED`, if set to 1, are shown in the `Table options` column. You can see this after executing the following `ALTER TABLE` statement in the **mysql** client:

```sql
mysql> ALTER TABLE fish COMMENT='NDB_TABLE=READ_ONLY=1,FULLY_REPLICATED=1';
1 row in set, 1 warning (0.00 sec)

mysql> SHOW WARNINGS\G
+---------+------+---------------------------------------------------------------------------------------------------------+
| Level   | Code | Message                                                                                                 |
+---------+------+---------------------------------------------------------------------------------------------------------+
| Warning | 1296 | Got error 4503 'Table property is FRAGMENT_COUNT_TYPE=ONE_PER_LDM_PER_NODE but not in comment' from NDB |
+---------+------+---------------------------------------------------------------------------------------------------------+
1 row in set (0.00 sec)
```

The warning is issued because `READ_ONLY=1` requires that the table's fragment count type is (or be set to) `ONE_PER_LDM_PER_NODE_GROUP`; `NDB` sets this automatically in such cases. You can check that the `ALTER TABLE` statement has the desired effect using `SHOW CREATE TABLE`:

```sql
mysql> SHOW CREATE TABLE fish\G
*************************** 1. row ***************************
       Table: fish
Create Table: CREATE TABLE `fish` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `length_mm` int(11) NOT NULL,
  `weight_gm` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk` (`name`)
) ENGINE=ndbcluster DEFAULT CHARSET=latin1
COMMENT='NDB_TABLE=READ_BACKUP=1,FULLY_REPLICATED=1'
1 row in set (0.01 sec)
```

Because `FRAGMENT_COUNT_TYPE` was not set explicitly, its value is not shown in the comment text printed by `SHOW CREATE TABLE`. **ndb\_desc**, however, displays the updated value for this attribute. The `Table options` column shows the binary properties just enabled. You can see this in the output shown here (emphasized text):

```sql
$> ./ndb_desc -c localhost fish -d test -p
-- fish --
Version: 4
Fragment type: HashMapPartition
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: no
Number of attributes: 4
Number of primary keys: 1
Length of frm data: 380
Max Rows: 0
Row Checksum: 1
Row GCI: 1
SingleUserMode: 0
ForceVarPart: 1
PartitionCount: 1
FragmentCount: 1
FragmentCountType: ONE_PER_LDM_PER_NODE_GROUP
ExtraRowGciBits: 0
ExtraRowAuthorBits: 0
TableStatus: Retrieved
Table options: readbackup, fullyreplicated
HashMap: DEFAULT-HASHMAP-3840-1
-- Attributes --
id Int PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY AUTO_INCR
name Varchar(20;latin1_swedish_ci) NOT NULL AT=SHORT_VAR ST=MEMORY DYNAMIC
length_mm Int NOT NULL AT=FIXED ST=MEMORY DYNAMIC
weight_gm Int NOT NULL AT=FIXED ST=MEMORY DYNAMIC
-- Indexes --
PRIMARY KEY(id) - UniqueHashIndex
PRIMARY(id) - OrderedIndex
uk(name) - OrderedIndex
uk$unique(name) - UniqueHashIndex
-- Per partition info --
Partition       Row count       Commit count    Frag fixed memory       Frag varsized memory    Extent_space    Free extent_space

NDBT_ProgramExit: 0 - OK
```

For more information about these table properties, see Section 13.1.18.9, “Setting NDB Comment Options”.

The `Extent_space` and `Free extent_space` columns are applicable only to `NDB` tables having columns on disk; for tables having only in-memory columns, these columns always contain the value `0`.

To illustrate their use, we modify the previous example. First, we must create the necessary Disk Data objects, as shown here:

```sql
CREATE LOGFILE GROUP lg_1
    ADD UNDOFILE 'undo_1.log'
    INITIAL_SIZE 16M
    UNDO_BUFFER_SIZE 2M
    ENGINE NDB;

ALTER LOGFILE GROUP lg_1
    ADD UNDOFILE 'undo_2.log'
    INITIAL_SIZE 12M
    ENGINE NDB;

CREATE TABLESPACE ts_1
    ADD DATAFILE 'data_1.dat'
    USE LOGFILE GROUP lg_1
    INITIAL_SIZE 32M
    ENGINE NDB;

ALTER TABLESPACE ts_1
    ADD DATAFILE 'data_2.dat'
    INITIAL_SIZE 48M
    ENGINE NDB;
```

(For more information on the statements just shown and the objects created by them, see Section 21.6.11.1, “NDB Cluster Disk Data Objects”, as well as Section 13.1.15, “CREATE LOGFILE GROUP Statement”, and Section 13.1.19, “CREATE TABLESPACE Statement”.)

Now we can create and populate a version of the `fish` table that stores 2 of its columns on disk (deleting the previous version of the table first, if it already exists):

```sql
CREATE TABLE fish (
    id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
    length_mm INT(11) NOT NULL,
    weight_gm INT(11) NOT NULL,

    PRIMARY KEY pk (id),
    UNIQUE KEY uk (name)
) TABLESPACE ts_1 STORAGE DISK
ENGINE=NDB;

INSERT INTO fish VALUES
    (NULL, 'guppy', 35, 2), (NULL, 'tuna', 2500, 150000),
    (NULL, 'shark', 3000, 110000), (NULL, 'manta ray', 1500, 50000),
    (NULL, 'grouper', 900, 125000), (NULL ,'puffer', 250, 2500);
```

When run against this version of the table, **ndb\_desc** displays the following output:

```sql
$> ./ndb_desc -c localhost fish -d test -p
-- fish --
Version: 1
Fragment type: HashMapPartition
K Value: 6
Min load factor: 78
Max load factor: 80
Temporary table: no
Number of attributes: 4
Number of primary keys: 1
Length of frm data: 346
Max Rows: 0
Row Checksum: 1
Row GCI: 1
SingleUserMode: 0
ForceVarPart: 1
PartitionCount: 2
FragmentCount: 2
FragmentCountType: ONE_PER_LDM_PER_NODE
ExtraRowGciBits: 0
ExtraRowAuthorBits: 0
TableStatus: Retrieved
Table options:
HashMap: DEFAULT-HASHMAP-3840-2
-- Attributes --
id Int PRIMARY KEY DISTRIBUTION KEY AT=FIXED ST=MEMORY AUTO_INCR
name Varchar(20;latin1_swedish_ci) NOT NULL AT=SHORT_VAR ST=MEMORY
length_mm Int NOT NULL AT=FIXED ST=DISK
weight_gm Int NOT NULL AT=FIXED ST=DISK
-- Indexes --
PRIMARY KEY(id) - UniqueHashIndex
PRIMARY(id) - OrderedIndex
uk(name) - OrderedIndex
uk$unique(name) - UniqueHashIndex
-- Per partition info --
Partition       Row count       Commit count    Frag fixed memory       Frag varsized memory    Extent_space    Free extent_space
0               2               2               32768                   32768                   1048576         1044440
1               4               4               32768                   32768                   1048576         1044400


NDBT_ProgramExit: 0 - OK
```

This means that 1048576 bytes are allocated from the tablespace for this table on each partition, of which 1044440 bytes remain free for additional storage. In other words, 1048576 - 1044440 = 4136 bytes per partition is currently being used to store the data from this table's disk-based columns. The number of bytes shown as `Free extent_space` is available for storing on-disk column data from the `fish` table only; for this reason, it is not visible when selecting from the Information Schema `FILES` table.

For fully replicated tables, **ndb\_desc** shows only the nodes holding primary partition fragment replicas; nodes with copy fragment replicas (only) are ignored. Beginning with NDB 7.5.4, you can obtain such information, using the **mysql** client, from the `table_distribution_status`, `table_fragments`, `table_info`, and `table_replicas` tables in the `ndbinfo` database.

Options that can be used with **ndb\_desc** are shown in the following table. Additional descriptions follow the table.

**Table 21.29 Command-line options used with the program ndb\_desc**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Format</th> <th>Description</th> <th>Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code>--auto-inc</code>, </p><p> <code class="option"> -a </code> </p></th> <td>Show next value for AUTO_INCREMENT oolumn if table has one</td> <td><p> ADDED: NDB 7.6.14 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--blob-info</code>, </p><p> <code class="option"> -b </code> </p></th> <td>Include partition information for BLOB tables in output. Requires that the -p option also be used</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Number of times to retry connection before giving up</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Number of seconds to wait between attempts to contact management server</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_connect-string">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--context</code>, </p><p> <code class="option"> -x </code> </p></th> <td>Show extra information for table such as database, schema, name, and internal ID</td> <td><p> ADDED: NDB 7.6.14 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --core-file </code> </p></th> <td>Write core file on error; used in debugging</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--database=name</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_database">-d name</a> </code> </p></th> <td>Name of database containing table</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--extra-node-info</code>, </p><p> <code class="option"> -n </code> </p></th> <td>Include partition-to-data-node mappings in output; requires --extra-partition-info</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--extra-partition-info</code>, </p><p> <code class="option"> -p </code> </p></th> <td>Display information about partitions</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --login-path=path </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Set node ID for this node, overriding any ID set by --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Enable optimizations for selection of nodes for transactions. Enabled by default; use --skip-ndb-optimized-node-selection to disable</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --no-defaults </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --print-defaults </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--retries=#</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_retries">-r #</a> </code> </p></th> <td>Number of times to retry the connection (once per second)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--table=name</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-desc.html#option_ndb_desc_table">-t name</a> </code> </p></th> <td>Specify the table in which to find an index. When this option is used, -p and -n have no effect and are ignored</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--unqualified</code>, </p><p> <code class="option"> -u </code> </p></th> <td>Use unqualified table names</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit; same as --help</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code class="option"> -V </code> </p></th> <td>Display version information and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody></table>

* `--auto-inc`, `-a`

  Show the next value for a table's `AUTO_INCREMENT` column, if it has one.

* `--blob-info`, `-b`

  Include information about subordinate `BLOB` and `TEXT` columns.

  Use of this option also requires the use of the `--extra-partition-info` (`-p`) option.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Directory containing character sets.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

  Number of times to retry connection before giving up.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

  Number of seconds to wait between attempts to contact management server.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Same as --ndb-connectstring.

* `--context`, `-x`

  Show additional contextual information for the table such as schema, database name, table name, and the table's internal ID.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Write core file on error; used in debugging.

* `--database=db_name`, `-d`

  Specify the database in which the table should be found.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read given file after global files are read.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read default options from given file only.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Also read groups with concat(group, suffix).

* `--extra-node-info`, `-n`

  Include information about the mappings between table partitions and the data nodes upon which they reside. This information can be useful for verifying distribution awareness mechanisms and supporting more efficient application access to the data stored in NDB Cluster.

  Use of this option also requires the use of the `--extra-partition-info` (`-p`) option.

* `--extra-partition-info`, `-p`

  Print additional information about the table's partitions.

* `--help`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display help text and exit.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>0

  Read given path from login file.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>1

  Set connect string for connecting to ndb\_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB\_CONNECTSTRING and my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>2

  Same as --ndb-connectstring.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>3

  Set node ID for this node, overriding any ID set by --ndb-connectstring.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>4

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>5

  Do not read default options from any option file other than login file.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>6

  Print program argument list and exit.

* `--retries=#`, `-r`

  Try to connect this many times before giving up. One connect attempt is made per second.

* `--table=tbl_name`, `-t`

  Specify the table in which to look for an index.

* `--unqualified`, `-u`

  Use unqualified table names.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>7

  Display help text and exit; same as --help.

* `--version`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>8

  Display version information and exit.

In NDB 7.5.3 and later, table indexes listed in the output are ordered by ID. Previously, this was not deterministic and could vary between platforms. (Bug #81763, Bug #23547742)


### 21.5.11 ndb\_drop\_index — Drop Index from an NDB Table

**ndb\_drop\_index** drops the specified index from an `NDB` table. *It is recommended that you use this utility only as an example for writing NDB API applications*—see the Warning later in this section for details.

#### Usage

```sql
ndb_drop_index -c connection_string table_name index -d db_name
```

The statement shown above drops the index named *`index`* from the *`table`* in the *`database`*.

Options that can be used with **ndb\_drop\_index** are shown in the following table. Additional descriptions follow the table.

**Table 21.30 Command-line options used with the program ndb\_drop\_index**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Format</th> <th>Description</th> <th>Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Number of times to retry connection before giving up</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Number of seconds to wait between attempts to contact management server</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-index.html#option_ndb_drop_index_connect-string">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --core-file </code> </p></th> <td>Write core file on error; used in debugging</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--database=name</code>, </p><p> <code>-d name</code> </p></th> <td>Name of database in which table is found</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --login-path=path </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-index.html#option_ndb_drop_index_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-index.html#option_ndb_drop_index_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Set node ID for this node, overriding any ID set by --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Enable optimizations for selection of nodes for transactions. Enabled by default; use --skip-ndb-optimized-node-selection to disable</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --no-defaults </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --print-defaults </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit; same as --help</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code class="option"> -V </code> </p></th> <td>Display version information and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody></table>

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Directory containing character sets.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

  Number of times to retry connection before giving up.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

  Number of seconds to wait between attempts to contact management server.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Same as `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Write core file on error; used in debugging.

* `--database`, `-d`

  <table frame="box" rules="all" summary="Properties for database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--database=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>TEST_DB</code></td> </tr></tbody></table>

  Name of the database in which the table resides.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read given file after global files are read.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read default options from given file only.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Also read groups with concat(group, suffix).

* `--help`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>0

  Display help text and exit.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>1

  Read given path from login file.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>2

  Set connect string for connecting to ndb\_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB\_CONNECTSTRING and my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>3

  Same as `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>4

  Set node ID for this node, overriding any ID set by `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>5

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>6

  Do not read default options from any option file other than login file.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>7

  Print program argument list and exit.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>8

  Display help text and exit; same as `--help`.

* `--version`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>9

  Display version information and exit.

Warning

*Operations performed on Cluster table indexes using the NDB API are not visible to MySQL and make the table unusable by a MySQL server*. If you use this program to drop an index, then try to access the table from an SQL node, an error results, as shown here:

```sql
$> ./ndb_drop_index -c localhost dogs ix -d ctest1
Dropping index dogs/idx...OK

NDBT_ProgramExit: 0 - OK

$> ./mysql -u jon -p ctest1
Enter password: *******
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 7 to server version: 5.7.44-ndb-7.5.36

Type 'help;' or '\h' for help. Type '\c' to clear the buffer.

mysql> SHOW TABLES;
+------------------+
| Tables_in_ctest1 |
+------------------+
| a                |
| bt1              |
| bt2              |
| dogs             |
| employees        |
| fish             |
+------------------+
6 rows in set (0.00 sec)

mysql> SELECT * FROM dogs;
ERROR 1296 (HY000): Got error 4243 'Index not found' from NDBCLUSTER
```

In such a case, your *only* option for making the table available to MySQL again is to drop the table and re-create it. You can use either the SQL statement`DROP TABLE` or the **ndb\_drop\_table** utility (see Section 21.5.12, “ndb\_drop\_table — Drop an NDB Table”) to drop the table.


### 21.5.12 ndb\_drop\_table — Drop an NDB Table

**ndb\_drop\_table** drops the specified `NDB` table. (If you try to use this on a table created with a storage engine other than `NDB`, the attempt fails with the error 723: No such table exists.) This operation is extremely fast; in some cases, it can be an order of magnitude faster than using a MySQL `DROP TABLE` statement on an `NDB` table.

#### Usage

```sql
ndb_drop_table -c connection_string tbl_name -d db_name
```

Options that can be used with **ndb\_drop\_table** are shown in the following table. Additional descriptions follow the table.

**Table 21.31 Command-line options used with the program ndb\_drop\_table**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Format</th> <th>Description</th> <th>Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Number of times to retry connection before giving up</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Number of seconds to wait between attempts to contact management server</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_connect-string">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --core-file </code> </p></th> <td>Write core file on error; used in debugging</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--database=name</code>, </p><p> <code>-d name</code> </p></th> <td>Name of database in which table is found</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --login-path=path </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-drop-table.html#option_ndb_drop_table_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Set node ID for this node, overriding any ID set by --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Enable optimizations for selection of nodes for transactions. Enabled by default; use --skip-ndb-optimized-node-selection to disable</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --no-defaults </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --print-defaults </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit; same as --help</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code class="option"> -V </code> </p></th> <td>Display version information and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody></table>

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Directory containing character sets.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

  Number of times to retry connection before giving up.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

  Number of seconds to wait between attempts to contact management server.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Same as `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Write core file on error; used in debugging.

* `--database`, `-d`

  <table frame="box" rules="all" summary="Properties for database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--database=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>TEST_DB</code></td> </tr></tbody></table>

  Name of the database in which the table resides.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read given file after global files are read.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read default options from given file only.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Also read groups with concat(group, suffix).

* `--help`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>0

  Display help text and exit.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>1

  Read given path from login file.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>2

  Set connect string for connecting to ndb\_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB\_CONNECTSTRING and my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>3

  Same as `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>4

  Set node ID for this node, overriding any ID set by `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>5

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>6

  Do not read default options from any option file other than login file.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>7

  Print program argument list and exit.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>8

  Display help text and exit; same as `--help`.

* `--version`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>9

  Display version information and exit.


### 21.5.13 ndb\_error\_reporter — NDB Error-Reporting Utility

**ndb\_error\_reporter** creates an archive from data node and management node log files that can be used to help diagnose bugs or other problems with a cluster. *It is highly recommended that you make use of this utility when filing reports of bugs in NDB Cluster*.

Options that can be used with **ndb\_error\_reporter** are shown in the following table. Additional descriptions follow the table.

**Table 21.32 Command-line options used with the program ndb\_error\_reporter**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Format</th> <th>Description</th> <th>Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code class="option"> --connection-timeout=# </code> </p></th> <td>Number of seconds to wait when connecting to nodes before timing out</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --dry-scp </code> </p></th> <td>Disable scp with remote hosts; used in testing only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --fs </code> </p></th> <td>Include file system data in error report; can use a large amount of disk space</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --skip-nodegroup=# </code> </p></th> <td>Skip all nodes in the node group having this ID</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody></table>

#### Usage

```sql
ndb_error_reporter path/to/config-file [username] [options]
```

This utility is intended for use on a management node host, and requires the path to the management host configuration file (usually named `config.ini`). Optionally, you can supply the name of a user that is able to access the cluster's data nodes using SSH, to copy the data node log files. **ndb\_error\_reporter** then includes all of these files in archive that is created in the same directory in which it is run. The archive is named `ndb_error_report_YYYYMMDDhhmmss.tar.bz2`, where *`YYYYMMDDhhmmss`* is a datetime string.

**ndb\_error\_reporter** also accepts the options listed here:

* `--connection-timeout=timeout`

  <table frame="box" rules="all" summary="Properties for connection-timeout"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connection-timeout=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr></tbody></table>

  Wait this many seconds when trying to connect to nodes before timing out.

* `--dry-scp`

  <table frame="box" rules="all" summary="Properties for dry-scp"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--dry-scp</code></td> </tr></tbody></table>

  Run **ndb\_error\_reporter** without using scp from remote hosts. Used for testing only.

* `--fs`

  <table frame="box" rules="all" summary="Properties for fs"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--fs</code></td> </tr></tbody></table>

  Copy the data node file systems to the management host and include them in the archive.

  Because data node file systems can be extremely large, even after being compressed, we ask that you please do *not* send archives created using this option to Oracle unless you are specifically requested to do so.

* `--help`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display help text and exit.

* `--skip-nodegroup=nodegroup_id`

  <table frame="box" rules="all" summary="Properties for connection-timeout"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connection-timeout=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr></tbody></table>

  Skip all nodes belong to the node group having the supplied node group ID.


### 21.5.14 ndb\_import — Import CSV Data Into NDB

**ndb\_import** imports CSV-formatted data, such as that produced by **mysqldump** `--tab`, directly into `NDB` using the NDB API. **ndb\_import** requires a connection to an NDB management server (**ndb\_mgmd**) to function; it does not require a connection to a MySQL Server.

#### Usage

```sql
ndb_import db_name file_name options
```

**ndb\_import** requires two arguments. *`db_name`* is the name of the database where the table into which to import the data is found; *`file_name`* is the name of the CSV file from which to read the data; this must include the path to this file if it is not in the current directory. The name of the file must match that of the table; the file's extension, if any, is not taken into consideration. Options supported by **ndb\_import** include those for specifying field separators, escapes, and line terminators, and are described later in this section.

**ndb\_import** rejects any empty lines read from the CSV file.

**ndb\_import** must be able to connect to an NDB Cluster management server; for this reason, there must be an unused `[api]` slot in the cluster `config.ini` file.

To duplicate an existing table that uses a different storage engine, such as `InnoDB`, as an `NDB` table, use the **mysql** client to perform a `SELECT INTO OUTFILE` statement to export the existing table to a CSV file, then to execute a `CREATE TABLE LIKE` statement to create a new table having the same structure as the existing table, then perform `ALTER TABLE ... ENGINE=NDB` on the new table; after this, from the system shell, invoke **ndb\_import** to load the data into the new `NDB` table. For example, an existing `InnoDB` table named `myinnodb_table` in a database named `myinnodb` can be exported into an `NDB` table named `myndb_table` in a database named `myndb` as shown here, assuming that you are already logged in as a MySQL user with the appropriate privileges:

1. In the **mysql** client:

   ```sql
   mysql> USE myinnodb;

   mysql> SELECT * INTO OUTFILE '/tmp/myndb_table.csv'
        >  FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' ESCAPED BY '\\'
        >  LINES TERMINATED BY '\n'
        >  FROM myinnodbtable;

   mysql> CREATE DATABASE myndb;

   mysql> USE myndb;

   mysql> CREATE TABLE myndb_table LIKE myinnodb.myinnodb_table;

   mysql> ALTER TABLE myndb_table ENGINE=NDB;

   mysql> EXIT;
   Bye
   $>
   ```

   Once the target database and table have been created, a running `mysqld` is no longer required. You can stop it using **mysqladmin shutdown** or another method before proceeding, if you wish.

2. In the system shell:

   ```sql
   # if you are not already in the MySQL bin directory:
   $> cd path-to-mysql-bin-dir

   $> ndb_import myndb /tmp/myndb_table.csv --fields-optionally-enclosed-by='"' \
       --fields-terminated-by="," --fields-escaped-by='\\'
   ```

   The output should resemble what is shown here:

   ```sql
   job-1 import myndb.myndb_table from /tmp/myndb_table.csv
   job-1 [running] import myndb.myndb_table from /tmp/myndb_table.csv
   job-1 [success] import myndb.myndb_table from /tmp/myndb_table.csv
   job-1 imported 19984 rows in 0h0m9s at 2277 rows/s
   jobs summary: defined: 1 run: 1 with success: 1 with failure: 0
   $>
   ```

Options that can be used with **ndb\_import** are shown in the following table. Additional descriptions follow the table.

**Table 21.33 Command-line options used with the program ndb\_import**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Format</th> <th>Description</th> <th>Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code class="option"> --abort-on-error </code> </p></th> <td>Dump core on any fatal error; used for debugging</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ai-increment=# </code> </p></th> <td>For table with hidden PK, specify autoincrement increment. See mysqld</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ai-offset=# </code> </p></th> <td>For table with hidden PK, specify autoincrement offset. See mysqld</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ai-prefetch-sz=# </code> </p></th> <td>For table with hidden PK, specify number of autoincrement values that are prefetched. See mysqld</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Number of times to retry connection before giving up</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Number of seconds to wait between attempts to contact management server</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_connect-string">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connections=# </code> </p></th> <td>Number of cluster connections to create</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --continue </code> </p></th> <td>When job fails, continue to next job</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --core-file </code> </p></th> <td>Write core file on error; used in debugging</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --csvopt=opts </code> </p></th> <td>Shorthand option for setting typical CSV option values. See documentation for syntax and other information</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --db-workers=# </code> </p></th> <td>Number of threads, per data node, executing database operations</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Read given file after global files are read</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Read default options from given file only</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --errins-type=name </code> </p></th> <td>Error insert type, for testing purposes; use "list" to obtain all possible values</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --errins-delay=# </code> </p></th> <td>Error insert delay in milliseconds; random variation is added</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --fields-enclosed-by=char </code> </p></th> <td>Same as FIELDS ENCLOSED BY option for LOAD DATA statements. For CSV input this is same as using --fields-optionally-enclosed-by</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --fields-escaped-by=char </code> </p></th> <td>Same as FIELDS ESCAPED BY option for LOAD DATA statements</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --fields-optionally-enclosed-by=char </code> </p></th> <td>Same as FIELDS OPTIONALLY ENCLOSED BY option for LOAD DATA statements</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --fields-terminated-by=char </code> </p></th> <td>Same as FIELDS TERMINATED BY option for LOAD DATA statements</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --idlesleep=# </code> </p></th> <td>Number of milliseconds to sleep waiting for more to do</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --idlespin=# </code> </p></th> <td>Number of times to retry before idlesleep</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ignore-lines=# </code> </p></th> <td>Ignore first # lines in input file. Used to skip a non-data header</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --input-type=name </code> </p></th> <td>Input type: random or csv</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --input-workers=# </code> </p></th> <td>Number of threads processing input. Must be 2 or more if --input-type is csv</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --keep-state </code> </p></th> <td>State files (except non-empty *.rej files) are normally removed on job completion. Using this option causes all state files to be preserved instead</td> <td><p> ADDED: NDB 7.6.4 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --lines-terminated-by=char </code> </p></th> <td>Same as LINES TERMINATED BY option for LOAD DATA statements</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --login-path=path </code> </p></th> <td>Read given path from login file</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --max-rows=# </code> </p></th> <td>Import only this number of input data rows; default is 0, which imports all rows</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --monitor=# </code> </p></th> <td>Periodically print status of running job if something has changed (status, rejected rows, temporary errors). Value 0 disables. Value 1 prints any change seen. Higher values reduce status printing exponentially up to some pre-defined limit</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Set node ID for this node, overriding any ID set by --ndb-connectstring</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Enable optimizations for selection of nodes for transactions. Enabled by default; use --skip-ndb-optimized-node-selection to disable</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --no-asynch </code> </p></th> <td>Run database operations as batches, in single transactions</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --no-defaults </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --no-hint </code> </p></th> <td>Tells transaction coordinator not to use distribution key hint when selecting data node</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --opbatch=# </code> </p></th> <td>A db execution batch is a set of transactions and operations sent to NDB kernel. This option limits NDB operations (including blob operations) in a db execution batch. Therefore it also limits number of asynch transactions. Value 0 is not valid</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --opbytes=# </code> </p></th> <td>Limit bytes in execution batch (default 0 = no limit)</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --output-type=name </code> </p></th> <td>Output type: ndb is default, null used for testing</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --output-workers=# </code> </p></th> <td>Number of threads processing output or relaying database operations</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --pagesize=# </code> </p></th> <td>Align I/O buffers to given size</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --pagecnt=# </code> </p></th> <td>Size of I/O buffers as multiple of page size. CSV input worker allocates double-sized buffer</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --polltimeout=# </code> </p></th> <td>Timeout per poll for completed asynchonous transactions; polling continues until all polls are completed, or error occurs</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --print-defaults </code> </p></th> <td>Print program argument list and exit</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --rejects=# </code> </p></th> <td>Limit number of rejected rows (rows with permanent error) in data load. Default is 0 which means that any rejected row causes a fatal error. The row exceeding the limit is also added to *.rej</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --resume </code> </p></th> <td>If job aborted (temporary error, user interrupt), resume with rows not yet processed</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --rowbatch=# </code> </p></th> <td>Limit rows in row queues (default 0 = no limit); must be 1 or more if --input-type is random</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --rowbytes=# </code> </p></th> <td>Limit bytes in row queues (0 = no limit)</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --state-dir=path </code> </p></th> <td>Where to write state files; currect directory is default</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --stats </code> </p></th> <td>Save performance related options and internal statistics in *.sto and *.stt files. These files are kept on successful completion even if --keep-state is not used</td> <td><p> ADDED: NDB 7.6.4 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --tempdelay=# </code> </p></th> <td>Number of milliseconds to sleep between temporary errors</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --temperrors=# </code> </p></th> <td>Number of times a transaction can fail due to a temporary error, per execution batch; 0 means any temporary error is fatal. Such errors do not cause any rows to be written to .rej file</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit; same as --help</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--verbose[=#]</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-import.html#option_ndb_import_verbose">-v [#]</a> </code> </p></th> <td>Enable verbose output</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code class="option"> -V </code> </p></th> <td>Display version information and exit</td> <td><p> ADDED: NDB 7.6.2 </p></td> </tr></tbody></table>

* `--abort-on-error`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>

  Dump core on any fatal error; used for debugging only.

* `--ai-increment`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  For a table with a hidden primary key, specify the autoincrement increment, like the `auto_increment_increment` system variable does in the MySQL Server.

* `--ai-offset`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-offset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  For a table with hidden primary key, specify the autoincrement offset. Similar to the `auto_increment_offset` system variable.

* `--ai-prefetch-sz`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  For a table with a hidden primary key, specify the number of autoincrement values that are prefetched. Behaves like the `ndb_autoincrement_prefetch_sz` system variable does in the MySQL Server.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>

  Directory containing character sets.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

  Number of times to retry connection before giving up.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

  Number of seconds to wait between attempts to contact management server.

* `--connections`=*`#`*

  <table frame="box" rules="all" summary="Properties for connections"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connections=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>

  Number of cluster connections to create.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Same as `--ndb-connectstring`.

* `--continue`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>0

  When a job fails, continue to the next job.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>1

  Write core file on error; used in debugging.

* `--csvopt`=*`string`*

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>2

  Provides a shortcut method for setting typical CSV import options. The argument to this option is a string consisting of one or more of the following parameters:

  + `c`: Fields terminated by comma
  + `d`: Use defaults, except where overridden by another parameter

  + `n`: Lines terminated by `\n`

  + `q`: Fields optionally enclosed by double quote characters (`"`)

  + `r`: Line terminated by `\r`

  The order of the parameters makes no difference, except that if both `n` and `r` are specified, the one occurring last is the parameter which takes effect.

  This option is intended for use in testing under conditions in which it is difficult to transmit escapes or quotation marks.

* `--db-workers`=*`#`*

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>3

  Number of threads, per data node, executing database operations.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>4

  Read given file after global files are read.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>5

  Read default options from given file only.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>6

  Also read groups with concat(group, suffix).

* `--errins-type`=*`name`*

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>7

  Error insert type; use `list` as the *`name`* value to obtain all possible values. This option is used for testing purposes only.

* `--errins-delay`=*`#`*

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>8

  Error insert delay in milliseconds; random variation is added. This option is used for testing purposes only.

* `--fields-enclosed-by`=*`char`*

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>9

  This works in the same way as the `FIELDS ENCLOSED BY` option does for the `LOAD DATA` statement, specifying a character to be interpeted as quoting field values. For CSV input, this is the same as `--fields-optionally-enclosed-by`.

* `--fields-escaped-by`=*`name`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>0

  Specify an escape character in the same way as the `FIELDS ESCAPED BY` option does for the SQL `LOAD DATA` statement.

* `--fields-optionally-enclosed-by`=*`char`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>1

  This works in the same way as the `FIELDS OPTIONALLY ENCLOSED BY` option does for the `LOAD DATA` statement, specifying a character to be interpeted as optionally quoting field values. For CSV input, this is the same as `--fields-enclosed-by`.

* `--fields-terminated-by`=*`char`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>2

  This works in the same way as the `FIELDS TERMINATED BY` option does for the `LOAD DATA` statement, specifying a character to be interpeted as the field separator.

* `--help`

  <table frame="box" rules="all" summary="Properties for ai-increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>3

  Display help text and exit.

* `--idlesleep`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>4

  Number of milliseconds to sleep waiting for more work to perform.

* `--idlespin`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>5

  Number of times to retry before sleeping.

* `--ignore-lines`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>6

  Cause ndb\_import to ignore the first *`#`* lines of the input file. This can be employed to skip a file header that does not contain any data.

* `--input-type`=*`name`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>7

  Set the type of input type. The default is `csv`; `random` is intended for testing purposes only. .

* `--input-workers`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>8

  Set the number of threads processing input.

* `--keep-state`

  <table frame="box" rules="all" summary="Properties for ai-increment"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-increment=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>9

  By default, ndb\_import removes all state files (except non-empty `*.rej` files) when it completes a job. Specify this option (nor argument is required) to force the program to retain all state files instead.

* `--lines-terminated-by`=*`name`*

  <table frame="box" rules="all" summary="Properties for ai-offset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>0

  This works in the same way as the `LINES TERMINATED BY` option does for the `LOAD DATA` statement, specifying a character to be interpeted as end-of-line.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for ai-offset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>1

  Read given path from login file.

* `--log-level`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-offset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>2

  Performs internal logging at the given level. This option is intended primarily for internal and development use.

  In debug builds of NDB only, the logging level can be set using this option to a maximum of 4.

* `--max-rows`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-offset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>3

  Import only this number of input data rows; the default is 0, which imports all rows.

* `--monitor`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-offset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>4

  Periodically print the status of a running job if something has changed (status, rejected rows, temporary errors). Set to 0 to disable this reporting. Setting to 1 prints any change that is seen. Higher values reduce the frequency of this status reporting.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for ai-offset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>5

  Set connect string for connecting to ndb\_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB\_CONNECTSTRING and my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for ai-offset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>6

  Same as `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for ai-offset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>7

  Set node ID for this node, overriding any ID set by `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for ai-offset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>8

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--no-asynch`

  <table frame="box" rules="all" summary="Properties for ai-offset"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-offset=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>9

  Run database operations as batches, in single transactions.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>0

  Do not read default options from any option file other than login file.

* `--no-hint`

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>1

  Do not use distribution key hinting to select a data node.

* `--opbatch`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>2

  Set a limit on the number of operations (including blob operations), and thus the number of asynchronous transactions, per execution batch.

* `--opbytes`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>3

  Set a limit on the number of bytes per execution batch. Use 0 for no limit.

* `--output-type`=*`name`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>4

  Set the output type. `ndb` is the default. `null` is used only for testing.

* `--output-workers`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>5

  Set the number of threads processing output or relaying database operations.

* `--pagesize`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>6

  Align I/O buffers to the given size.

* `--pagecnt`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>7

  Set the size of I/O buffers as multiple of page size. The CSV input worker allocates buffer that is doubled in size.

* `--polltimeout`=*`#`*

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>8

  Set a timeout per poll for completed asynchonous transactions; polling continues until all polls are completed, or until an error occurs.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for ai-prefetch-sz"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ai-prefetch-sz=#</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>1024</code></td> </tr><tr><th>Minimum Value</th> <td><code>1</code></td> </tr><tr><th>Maximum Value</th> <td><code>4294967295</code></td> </tr></tbody></table>9

  Print program argument list and exit.

* `--rejects`=*`#`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>0

  Limit the number of rejected rows (rows with permanent errors) in the data load. The default is 0, which means that any rejected row causes a fatal error. Any rows causing the limit to be exceeded are added to the `.rej` file.

  The limit imposed by this option is effective for the duration of the current run. A run restarted using `--resume` is considered a “new” run for this purpose.

* `--resume`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>1

  If a job is aborted (due to a temporary db error or when interrupted by the user), resume with any rows not yet processed.

* `--rowbatch`=*`#`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>2

  Set a limit on the number of rows per row queue. Use 0 for no limit.

* `--rowbytes`=*`#`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>3

  Set a limit on the number of bytes per row queue. Use 0 for no limit.

* `--stats`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>4

  Save information about options related to performance and other internal statistics in files named `*.sto` and `*.stt`. These files are always kept on successful completion (even if `--keep-state` is not also specified).

* `--state-dir`=*`name`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>5

  Where to write the state files (`tbl_name.map`, `tbl_name.rej`, `tbl_name.res`, and `tbl_name.stt`) produced by a run of the program; the default is the current directory.

* `--tempdelay`=*`#`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>6

  Number of milliseconds to sleep between temporary errors.

* `--temperrors`=*`#`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>7

  Number of times a transaction can fail due to a temporary error, per execution batch. The default is 0, which means that any temporary error is fatal. Temporary errors do not cause any rows to be added to the `.rej` file.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>8

  Display help text and exit; same as `--help`.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Introduced</th> <td>5.7.18-ndb-7.6.2</td> </tr></tbody></table>9

  Enable verbose output.

  Note

  Previously, this option controlled the internal logging level for debugging messages. In NDB 7.6, use the `--log-level` option for this purpose instead.

* `--version`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>0

  Display version information and exit.

As with `LOAD DATA`, options for field and line formatting much match those used to create the CSV file, whether this was done using `SELECT INTO ... OUTFILE`, or by some other means. There is no equivalent to the `LOAD DATA` statement `STARTING WITH` option.

**ndb\_import** was added in NDB 7.6.


### 21.5.15 ndb\_index\_stat — NDB Index Statistics Utility

**ndb\_index\_stat** provides per-fragment statistical information about indexes on `NDB` tables. This includes cache version and age, number of index entries per partition, and memory consumption by indexes.

#### Usage

To obtain basic index statistics about a given `NDB` table, invoke **ndb\_index\_stat** as shown here, with the name of the table as the first argument and the name of the database containing this table specified immediately following it, using the `--database` (`-d`) option:

```sql
ndb_index_stat table -d database
```

In this example, we use **ndb\_index\_stat** to obtain such information about an `NDB` table named `mytable` in the `test` database:

```sql
$> ndb_index_stat -d test mytable
table:City index:PRIMARY fragCount:2
sampleVersion:3 loadTime:1399585986 sampleCount:1994 keyBytes:7976
query cache: valid:1 sampleCount:1994 totalBytes:27916
times in ms: save: 7.133 sort: 1.974 sort per sample: 0.000

NDBT_ProgramExit: 0 - OK
```

`sampleVersion` is the version number of the cache from which the statistics data is taken. Running **ndb\_index\_stat** with the `--update` option causes sampleVersion to be incremented.

`loadTime` shows when the cache was last updated. This is expressed as seconds since the Unix Epoch.

`sampleCount` is the number of index entries found per partition. You can estimate the total number of entries by multiplying this by the number of fragments (shown as `fragCount`).

`sampleCount` can be compared with the cardinality of `SHOW INDEX` or `INFORMATION_SCHEMA.STATISTICS`, although the latter two provide a view of the table as a whole, while **ndb\_index\_stat** provides a per-fragment average.

`keyBytes` is the number of bytes used by the index. In this example, the primary key is an integer, which requires four bytes for each index, so `keyBytes` can be calculated in this case as shown here:

```sql
    keyBytes = sampleCount * (4 bytes per index) = 1994 * 4 = 7976
```

This information can also be obtained using the corresponding column definitions from the Information Schema `COLUMNS` table (this requires a MySQL Server and a MySQL client application).

`totalBytes` is the total memory consumed by all indexes on the table, in bytes.

Timings shown in the preceding examples are specific to each invocation of **ndb\_index\_stat**.

The `--verbose` option provides some additional output, as shown here:

```sql
$> ndb_index_stat -d test mytable --verbose
random seed 1337010518
connected
loop 1 of 1
table:mytable index:PRIMARY fragCount:4
sampleVersion:2 loadTime:1336751773 sampleCount:0 keyBytes:0
read stats
query cache created
query cache: valid:1 sampleCount:0 totalBytes:0
times in ms: save: 20.766 sort: 0.001
disconnected

NDBT_ProgramExit: 0 - OK

$>
```

If the only output from the program is `NDBT_ProgramExit: 0 - OK`, this may indicate that no statistics yet exist. To force them to be created (or updated if they already exist), invoke **ndb\_index\_stat** with the `--update` option, or execute `ANALYZE TABLE` on the table in the **mysql** client.

#### Options

The following table includes options that are specific to the NDB Cluster **ndb\_index\_stat** utility. Additional descriptions are listed following the table.

**Table 21.34 Command-line options used with the program ndb\_index\_stat**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Format</th> <th>Description</th> <th>Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Number of times to retry connection before giving up</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Number of seconds to wait between attempts to contact management server</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_connect-string">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --core-file </code> </p></th> <td>Write core file on error; used in debugging</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--database=name</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_database">-d name</a> </code> </p></th> <td>Name of database containing table</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --delete </code> </p></th> <td>Delete index statistics for table, stopping any auto-update previously configured</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --dump </code> </p></th> <td>Print query cache</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --login-path=path </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --loops=# </code> </p></th> <td>Set the number of times to perform given command; default is 0</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-index-stat.html#option_ndb_index_stat_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Set node ID for this node, overriding any ID set by --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Enable optimizations for selection of nodes for transactions. Enabled by default; use --skip-ndb-optimized-node-selection to disable</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --no-defaults </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --print-defaults </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --query=# </code> </p></th> <td>Perform random range queries on first key attr (must be int unsigned)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --sys-drop </code> </p></th> <td>Drop any statistics tables and events in NDB kernel (all statistics are lost)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --sys-create </code> </p></th> <td>Create all statistics tables and events in NDB kernel, if none of them already exist</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --sys-create-if-not-exist </code> </p></th> <td>Create any statistics tables and events in NDB kernel that do not already exist</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --sys-create-if-not-valid </code> </p></th> <td>Create any statistics tables or events that do not already exist in the NDB kernel, after dropping any that are invalid</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --sys-check </code> </p></th> <td>Verify that NDB system index statistics and event tables exist</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --sys-skip-tables </code> </p></th> <td>Do not apply sys-* options to tables</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --sys-skip-events </code> </p></th> <td>Do not apply sys-* options to events</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --update </code> </p></th> <td>Update index statistics for table, restarting any auto-update previously configured</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit; same as --help</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--verbose</code>, </p><p> <code class="option"> -v </code> </p></th> <td>Turn on verbose output</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code class="option"> -V </code> </p></th> <td>Display version information and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody></table>

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Directory containing character sets.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

  Number of times to retry connection before giving up.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

  Number of seconds to wait between attempts to contact management server.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Same as `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Write core file on error; used in debugging.

* `--database=name`, `-d name`

  <table frame="box" rules="all" summary="Properties for database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--database=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr><tr><th>Minimum Value</th> <td><code></code></td> </tr><tr><th>Maximum Value</th> <td><code></code></td> </tr></tbody></table>

  The name of the database that contains the table being queried.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read given file after global files are read.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read default options from given file only.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Also read groups with concat(group, suffix).

* `--delete`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>0

  Delete the index statistics for the given table, stopping any auto-update that was previously configured.

* `--dump`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>1

  Dump the contents of the query cache.

* `--help`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>2

  Display help text and exit.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>3

  Read given path from login file.

* `--loops=#`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>4

  Repeat commands this number of times (for use in testing).

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>5

  Set connect string for connecting to ndb\_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB\_CONNECTSTRING and my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>6

  Same as `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>7

  Set node ID for this node, overriding any ID set by `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>8

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>9

  Do not read default options from any option file other than login file.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>0

  Print program argument list and exit.

* `--query=#`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>1

  Perform random range queries on first key attribute (must be int unsigned).

* `--sys-drop`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>2

  Drop all statistics tables and events in the NDB kernel. *This causes all statistics to be lost*.

* `--sys-create`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>3

  Create all statistics tables and events in the NDB kernel. This works only if none of them exist previously.

* `--sys-create-if-not-exist`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>4

  Create any NDB system statistics tables or events (or both) that do not already exist when the program is invoked.

* `--sys-create-if-not-valid`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>5

  Create any NDB system statistics tables or events that do not already exist, after dropping any that are invalid.

* `--sys-check`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>6

  Verify that all required system statistics tables and events exist in the NDB kernel.

* `--sys-skip-tables`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>7

  Do not apply any `--sys-*` options to any statistics tables.

* `--sys-skip-events`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>8

  Do not apply any `--sys-*` options to any events.

* `--update`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>9

  Update the index statistics for the given table, and restart any auto-update that was previously configured.

* `--usage`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>0

  Display help text and exit; same as `--help`.

* `--verbose`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>1

  Turn on verbose output.

* `--version`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>2

  Display version information and exit.

**ndb\_index\_stat system options.** The following options are used to generate and update the statistics tables in the NDB kernel. None of these options can be mixed with statistics options (see ndb\_index\_stat statistics options).

* `--sys-drop`
* `--sys-create`
* `--sys-create-if-not-exist`
* `--sys-create-if-not-valid`
* `--sys-check`
* `--sys-skip-tables`
* `--sys-skip-events`

**ndb\_index\_stat statistics options.** The options listed here are used to generate index statistics. They work with a given table and database. They cannot be mixed with system options (see ndb\_index\_stat system options).

* `--database`
* `--delete`
* `--update`
* `--dump`
* `--query`


### 21.5.16 ndb\_move\_data — NDB Data Copy Utility

**ndb\_move\_data** copies data from one NDB table to another.

#### Usage

The program is invoked with the names of the source and target tables; either or both of these may be qualified optionally with the database name. Both tables must use the NDB storage engine.

```sql
ndb_move_data options source target
```

Options that can be used with **ndb\_move\_data** are shown in the following table. Additional descriptions follow the table.

**Table 21.35 Command-line options used with the program ndb\_move\_data**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Format</th> <th>Description</th> <th>Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code class="option"> --abort-on-error </code> </p></th> <td>Dump core on permanent error (debug option)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Directory where character sets are</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Number of times to retry connection before giving up</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Number of seconds to wait between attempts to contact management server</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_connect-string">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --core-file </code> </p></th> <td>Write core file on error; used in debugging</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--database=name</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_database">-d name</a> </code> </p></th> <td>Name of database in which table is found</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --drop-source </code> </p></th> <td>Drop source table after all rows have been moved</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --error-insert </code> </p></th> <td>Insert random temporary errors (used in testing)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --exclude-missing-columns </code> </p></th> <td>Ignore extra columns in source or target table</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --login-path=path </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--lossy-conversions</code>, </p><p> <code class="option"> -l </code> </p></th> <td>Allow attribute data to be truncated when converted to smaller type</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-move-data.html#option_ndb_move_data_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Set node ID for this node, overriding any ID set by --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Enable optimizations for selection of nodes for transactions. Enabled by default; use --skip-ndb-optimized-node-selection to disable</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --no-defaults </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --print-defaults </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--promote-attributes</code>, </p><p> <code class="option"> -A </code> </p></th> <td>Allow attribute data to be converted to larger type</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --staging-tries=x[,y[,z]] </code> </p></th> <td>Specify tries on temporary errors; format is x[,y[,z]] where x=max tries (0=no limit), y=min delay (ms), z=max delay (ms)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit; same as --help</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --verbose </code> </p></th> <td>Enable verbose messages</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code class="option"> -V </code> </p></th> <td>Display version information and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody></table>

* `--abort-on-error`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>

  Dump core on permanent error (debug option).

* `--character-sets-dir`=*`name`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Directory where character sets are.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

  Number of seconds to wait between attempts to contact management server.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

  Number of times to retry connection before giving up.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Same as `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Write core file on error; used in debugging.

* `--database`=*`dbname`*, `-d`

  <table frame="box" rules="all" summary="Properties for database"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--database=name</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>TEST_DB</code></td> </tr></tbody></table>

  Name of the database in which the table is found.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read given file after global files are read.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read default options from given file only.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>0

  Also read groups with concat(group, suffix).

* `--drop-source`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>1

  Drop source table after all rows have been moved.

* `--error-insert`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>2

  Insert random temporary errors (testing option).

* `--exclude-missing-columns`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>3

  Ignore extra columns in source or target table.

* `--help`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>4

  Display help text and exit.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>5

  Read given path from login file.

* `--lossy-conversions`, `-l`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>6

  Allow attribute data to be truncated when converted to a smaller type.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>7

  Set connect string for connecting to ndb\_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB\_CONNECTSTRING and my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>8

  Same as `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for abort-on-error"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--abort-on-error</code></td> </tr></tbody></table>9

  Set node ID for this node, overriding any ID set by `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>0

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>1

  Do not read default options from any option file other than login file.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>2

  Print program argument list and exit.

* `--promote-attributes`, `-A`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>3

  Allow attribute data to be converted to a larger type.

* `--staging-tries`=*`x[,y[,z]]`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>4

  Specify tries on temporary errors. Format is x[,y[,z]] where x=max tries (0=no limit), y=min delay (ms), z=max delay (ms).

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>5

  Display help text and exit; same as `--help`.

* `--verbose`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>6

  Enable verbose messages.

* `--version`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>7

  Display version information and exit.


### 21.5.17 ndb\_perror — Obtain NDB Error Message Information

**ndb\_perror** shows information about an NDB error, given its error code. This includes the error message, the type of error, and whether the error is permanent or temporary. Added to the MySQL NDB Cluster distribution in NDB 7.6, it is intended as a drop-in replacement for **perror** `--ndb`.

#### Usage

```sql
ndb_perror [options] error_code
```

**ndb\_perror** does not need to access a running NDB Cluster, or any nodes (including SQL nodes). To view information about a given NDB error, invoke the program, using the error code as an argument, like this:

```sql
$> ndb_perror 323
NDB error code 323: Invalid nodegroup id, nodegroup already existing: Permanent error: Application error
```

To display only the error message, invoke **ndb\_perror** with the `--silent` option (short form `-s`), as shown here:

```sql
$> ndb_perror -s 323
Invalid nodegroup id, nodegroup already existing: Permanent error: Application error
```

Like **perror**, **ndb\_perror** accepts multiple error codes:

```sql
$> ndb_perror 321 1001
NDB error code 321: Invalid nodegroup id: Permanent error: Application error
NDB error code 1001: Illegal connect string
```

Additional program options for **ndb\_perror** are described later in this section.

**ndb\_perror** replaces **perror** `--ndb`, which is deprecated in NDB 7.6 and subject to removal in a future release of MySQL NDB Cluster. To make substitution easier in scripts and other applications that might depend on **perror** for obtaining NDB error information, **ndb\_perror** supports its own “dummy” `--ndb` option, which does nothing.

The following table includes all options that are specific to the NDB Cluster program **ndb\_perror**. Additional descriptions follow the table.

**Table 21.36 Command-line options used with the program ndb\_perror**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Format</th> <th>Description</th> <th>Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text</td> <td><p> ADDED: NDB 7.6.4 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --login-path=path </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb </code> </p></th> <td>For compatibility with applications depending on old versions of perror; does nothing</td> <td><p> ADDED: NDB 7.6.4 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --no-defaults </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --print-defaults </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--silent</code>, </p><p> <code class="option"> -s </code> </p></th> <td>Show error message only</td> <td><p> ADDED: NDB 7.6.4 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code class="option"> -V </code> </p></th> <td>Print program version information and exit</td> <td><p> ADDED: NDB 7.6.4 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--verbose</code>, </p><p> <code class="option"> -v </code> </p></th> <td>Verbose output; disable with --silent</td> <td><p> ADDED: NDB 7.6.4 </p></td> </tr></tbody></table>

#### Additional Options

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.4</td> </tr></tbody></table>

  Display program help text and exit.

* `--ndb`

  <table frame="box" rules="all" summary="Properties for ndb"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--ndb</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.4</td> </tr></tbody></table>

  For compatibility with applications depending on old versions of **perror** that use that program's `--ndb` option. The option when used with **ndb\_perror** does nothing, and is ignored by it.

* `--silent`, `-s`

  <table frame="box" rules="all" summary="Properties for silent"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--silent</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.4</td> </tr></tbody></table>

  Show error message only.

* `--version`, `-V`

  <table frame="box" rules="all" summary="Properties for version"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--version</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.4</td> </tr></tbody></table>

  Print program version information and exit.

* `--verbose`, `-v`

  <table frame="box" rules="all" summary="Properties for verbose"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--verbose</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.4</td> </tr></tbody></table>

  Verbose output; disable with `--silent`.


### 21.5.18 ndb\_print\_backup\_file — Print NDB Backup File Contents

**ndb\_print\_backup\_file** obtains diagnostic information from a cluster backup file.

#### Usage

```sql
ndb_print_backup_file file_name
```

*`file_name`* is the name of a cluster backup file. This can be any of the files (`.Data`, `.ctl`, or `.log` file) found in a cluster backup directory. These files are found in the data node's backup directory under the subdirectory `BACKUP-#`, where *`#`* is the sequence number for the backup. For more information about cluster backup files and their contents, see Section 21.6.8.1, “NDB Cluster Backup Concepts”.

Like **ndb\_print\_schema\_file** and **ndb\_print\_sys\_file** (and unlike most of the other `NDB` utilities that are intended to be run on a management server host or to connect to a management server) **ndb\_print\_backup\_file** must be run on a cluster data node, since it accesses the data node file system directly. Because it does not make use of the management server, this utility can be used when the management server is not running, and even when the cluster has been completely shut down.

#### Additional Options

None.


### 21.5.19 ndb\_print\_file — Print NDB Disk Data File Contents

**ndb\_print\_file** obtains information from an NDB Cluster Disk Data file.

#### Usage

```sql
ndb_print_file [-v] [-q] file_name+
```

*`file_name`* is the name of an NDB Cluster Disk Data file. Multiple filenames are accepted, separated by spaces.

Like **ndb\_print\_schema\_file** and **ndb\_print\_sys\_file** (and unlike most of the other `NDB` utilities that are intended to be run on a management server host or to connect to a management server) **ndb\_print\_file** must be run on an NDB Cluster data node, since it accesses the data node file system directly. Because it does not make use of the management server, this utility can be used when the management server is not running, and even when the cluster has been completely shut down.

#### Additional Options

**ndb\_print\_file** supports the following options:

* `-v`: Make output verbose.
* `-q`: Suppress output (quiet mode).
* `--help`, `-h`, `-?`: Print help message.

For more information, see Section 21.6.11, “NDB Cluster Disk Data Tables”.


### 21.5.20 ndb\_print\_frag\_file — Print NDB Fragment List File Contents

**ndb\_print\_frag\_file** obtains information from a cluster fragment list file. It is intended for use in helping to diagnose issues with data node restarts.

#### Usage

```sql
ndb_print_frag_file file_name
```

*`file_name`* is the name of a cluster fragment list file, which matches the pattern `SX.FragList`, where *`X`* is a digit in the range 2-9 inclusive, and are found in the data node file system of the data node having the node ID *`nodeid`*, in directories named `ndb_nodeid_fs/DN/DBDIH/`, where *`N`* is `1` or `2`. Each fragment file contains records of the fragments belonging to each `NDB` table. For more information about cluster fragment files, see NDB Cluster Data Node File System Directory.

Like **ndb\_print\_backup\_file**, **ndb\_print\_sys\_file**, and **ndb\_print\_schema\_file** (and unlike most of the other `NDB` utilities that are intended to be run on a management server host or to connect to a management server), **ndb\_print\_frag\_file** must be run on a cluster data node, since it accesses the data node file system directly. Because it does not make use of the management server, this utility can be used when the management server is not running, and even when the cluster has been completely shut down.

#### Additional Options

None.

#### Sample Output

```sql
$> ndb_print_frag_file /usr/local/mysqld/data/ndb_3_fs/D1/DBDIH/S2.FragList
Filename: /usr/local/mysqld/data/ndb_3_fs/D1/DBDIH/S2.FragList with size 8192
noOfPages = 1 noOfWords = 182
Table Data
----------
Num Frags: 2 NoOfReplicas: 2 hashpointer: 4294967040
kvalue: 6 mask: 0x00000000 method: HashMap
Storage is on Logged and checkpointed, survives SR
------ Fragment with FragId: 0 --------
Preferred Primary: 2 numStoredReplicas: 2 numOldStoredReplicas: 0 distKey: 0 LogPartId: 0
-------Stored Replica----------
Replica node is: 2 initialGci: 2 numCrashedReplicas = 0 nextLcpNo = 1
LcpNo[0]: maxGciCompleted: 1 maxGciStarted: 2 lcpId: 1 lcpStatus: valid
LcpNo[1]: maxGciCompleted: 0 maxGciStarted: 0 lcpId: 0 lcpStatus: invalid
-------Stored Replica----------
Replica node is: 3 initialGci: 2 numCrashedReplicas = 0 nextLcpNo = 1
LcpNo[0]: maxGciCompleted: 1 maxGciStarted: 2 lcpId: 1 lcpStatus: valid
LcpNo[1]: maxGciCompleted: 0 maxGciStarted: 0 lcpId: 0 lcpStatus: invalid
------ Fragment with FragId: 1 --------
Preferred Primary: 3 numStoredReplicas: 2 numOldStoredReplicas: 0 distKey: 0 LogPartId: 1
-------Stored Replica----------
Replica node is: 3 initialGci: 2 numCrashedReplicas = 0 nextLcpNo = 1
LcpNo[0]: maxGciCompleted: 1 maxGciStarted: 2 lcpId: 1 lcpStatus: valid
LcpNo[1]: maxGciCompleted: 0 maxGciStarted: 0 lcpId: 0 lcpStatus: invalid
-------Stored Replica----------
Replica node is: 2 initialGci: 2 numCrashedReplicas = 0 nextLcpNo = 1
LcpNo[0]: maxGciCompleted: 1 maxGciStarted: 2 lcpId: 1 lcpStatus: valid
LcpNo[1]: maxGciCompleted: 0 maxGciStarted: 0 lcpId: 0 lcpStatus: invalid
```


### 21.5.21 ndb\_print\_schema\_file — Print NDB Schema File Contents

**ndb\_print\_schema\_file** obtains diagnostic information from a cluster schema file.

#### Usage

```sql
ndb_print_schema_file file_name
```

*`file_name`* is the name of a cluster schema file. For more information about cluster schema files, see NDB Cluster Data Node File System Directory.

Like **ndb\_print\_backup\_file** and **ndb\_print\_sys\_file** (and unlike most of the other `NDB` utilities that are intended to be run on a management server host or to connect to a management server) **ndb\_print\_schema\_file** must be run on a cluster data node, since it accesses the data node file system directly. Because it does not make use of the management server, this utility can be used when the management server is not running, and even when the cluster has been completely shut down.

#### Additional Options

None.


### 21.5.22 ndb\_print\_sys\_file — Print NDB System File Contents

**ndb\_print\_sys\_file** obtains diagnostic information from an NDB Cluster system file.

#### Usage

```sql
ndb_print_sys_file file_name
```

*`file_name`* is the name of a cluster system file (sysfile). Cluster system files are located in a data node's data directory (`DataDir`); the path under this directory to system files matches the pattern `ndb_#_fs/D#/DBDIH/P#.sysfile`. In each case, the *`#`* represents a number (not necessarily the same number). For more information, see NDB Cluster Data Node File System Directory.

Like **ndb\_print\_backup\_file** and **ndb\_print\_schema\_file** (and unlike most of the other `NDB` utilities that are intended to be run on a management server host or to connect to a management server) **ndb\_print\_backup\_file** must be run on a cluster data node, since it accesses the data node file system directly. Because it does not make use of the management server, this utility can be used when the management server is not running, and even when the cluster has been completely shut down.

#### Additional Options

None.


### 21.5.23 ndb\_redo\_log\_reader — Check and Print Content of Cluster Redo Log

Reads a redo log file, checking it for errors, printing its contents in a human-readable format, or both. **ndb\_redo\_log\_reader** is intended for use primarily by NDB Cluster developers and Support personnel in debugging and diagnosing problems.

This utility remains under development, and its syntax and behavior are subject to change in future NDB Cluster releases.

The C++ source files for **ndb\_redo\_log\_reader** can be found in the directory `/storage/ndb/src/kernel/blocks/dblqh/redoLogReader`.

Options that can be used with **ndb\_redo\_log\_reader** are shown in the following table. Additional descriptions follow the table.

**Table 21.37 Command-line options used with the program ndb\_redo\_log\_reader**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Format</th> <th>Description</th> <th>Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code class="option"> -dump </code> </p></th> <td>Print dump info</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> -filedescriptors </code> </p></th> <td>Print file descriptors only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --help </code> </p></th> <td>Print usage information (has no short form)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> -lap </code> </p></th> <td>Provide lap info, with max GCI started and completed</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_mbyte">-mbyte #</a> </code> </p></th> <td>Starting megabyte</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> -mbyteheaders </code> </p></th> <td>Show only first page header of each megabyte in file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> -nocheck </code> </p></th> <td>Do not check records for errors</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> -noprint </code> </p></th> <td>Do not print records</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_page">-page #</a> </code> </p></th> <td>Start with this page</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> -pageheaders </code> </p></th> <td>Show page headers only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-redo-log-reader.html#option_ndb_redo_log_reader_pageindex">-pageindex #</a> </code> </p></th> <td>Start with this page index</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> -twiddle </code> </p></th> <td>Bit-shifted dump</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody></table>

#### Usage

```sql
ndb_redo_log_reader file_name [options]
```

*`file_name`* is the name of a cluster redo log file. redo log files are located in the numbered directories under the data node's data directory (`DataDir`); the path under this directory to the redo log files matches the pattern `ndb_nodeid_fs/D#/DBLQH/S#.FragLog`. *`nodeid`* is the data node's node ID. The two instances of *`#`* each represent a number (not necessarily the same number); the number following `D` is in the range 8-39 inclusive; the range of the number following `S` varies according to the value of the `NoOfFragmentLogFiles` configuration parameter, whose default value is 16; thus, the default range of the number in the file name is 0-15 inclusive. For more information, see NDB Cluster Data Node File System Directory.

The name of the file to be read may be followed by one or more of the options listed here:

* `-dump`

  <table frame="box" rules="all" summary="Properties for dump"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>-dump</code></td> </tr></tbody></table>

  Print dump info.

* <table frame="box" rules="all" summary="Properties for filedescriptors"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>-filedescriptors</code></td> </tr></tbody></table>

  `-filedescriptors`: Print file descriptors only.

* <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  `--help`: Print usage information.

* `-lap`

  <table frame="box" rules="all" summary="Properties for lap"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>-lap</code></td> </tr></tbody></table>

  Provide lap info, with max GCI started and completed.

* <table frame="box" rules="all" summary="Properties for mbyte"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>-mbyte #</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>15</code></td> </tr></tbody></table>

  `-mbyte #`: Starting megabyte.

  *`#`* is an integer in the range 0 to 15, inclusive.

* <table frame="box" rules="all" summary="Properties for mbyteheaders"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>-mbyteheaders</code></td> </tr></tbody></table>

  `-mbyteheaders`: Show only the first page header of every megabyte in the file.

* <table frame="box" rules="all" summary="Properties for noprint"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>-noprint</code></td> </tr></tbody></table>

  `-noprint`: Do not print the contents of the log file.

* <table frame="box" rules="all" summary="Properties for nocheck"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>-nocheck</code></td> </tr></tbody></table>

  `-nocheck`: Do not check the log file for errors.

* <table frame="box" rules="all" summary="Properties for page"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>-page #</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>31</code></td> </tr></tbody></table>

  `-page #`: Start at this page.

  *`#`* is an integer in the range 0 to 31, inclusive.

* <table frame="box" rules="all" summary="Properties for dump"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>-dump</code></td> </tr></tbody></table>0

  `-pageheaders`: Show page headers only.

* <table frame="box" rules="all" summary="Properties for dump"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>-dump</code></td> </tr></tbody></table>1

  `-pageindex #`: Start at this page index.

  *`#`* is an integer between 12 and 8191, inclusive.

* `-twiddle`

  <table frame="box" rules="all" summary="Properties for dump"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>-dump</code></td> </tr></tbody></table>2

  Bit-shifted dump.

Like **ndb\_print\_backup\_file** and **ndb\_print\_schema\_file** (and unlike most of the `NDB` utilities that are intended to be run on a management server host or to connect to a management server) **ndb\_redo\_log\_reader** must be run on a cluster data node, since it accesses the data node file system directly. Because it does not make use of the management server, this utility can be used when the management server is not running, and even when the cluster has been completely shut down.


### 21.5.24 ndb\_restore — Restore an NDB Cluster Backup

The NDB Cluster restoration program is implemented as a separate command-line utility **ndb\_restore**, which can normally be found in the MySQL `bin` directory. This program reads the files created as a result of the backup and inserts the stored information into the database.

Note

Beginning with NDB 7.5.15 and 7.6.11, this program no longer prints `NDBT_ProgramExit: ...` when it finishes its run. Applications depending on this behavior should be modified accordingly when upgrading from earlier releases.

**ndb\_restore** must be executed once for each of the backup files that were created by the `START BACKUP` command used to create the backup (see Section 21.6.8.2, “Using The NDB Cluster Management Client to Create a Backup”). This is equal to the number of data nodes in the cluster at the time that the backup was created.

Note

Before using **ndb\_restore**, it is recommended that the cluster be running in single user mode, unless you are restoring multiple data nodes in parallel. See Section 21.6.6, “NDB Cluster Single User Mode”, for more information.

Options that can be used with **ndb\_restore** are shown in the following table. Additional descriptions follow the table.

**Table 21.38 Command-line options used with the program ndb\_restore**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Format</th> <th>Description</th> <th>Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code class="option"> --allow-pk-changes[=0|1] </code> </p></th> <td>Allow changes to set of columns making up table's primary key</td> <td><p> ADDED: NDB 7.6.14 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --append </code> </p></th> <td>Append data to tab-delimited file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --backup-path=path </code> </p></th> <td>Path to backup files directory</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--backupid=#</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_backupid">-b #</a> </code> </p></th> <td>Restore from backup having this ID</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect">-c connection_string</a> </code> </p></th> <td>Alias for --connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Number of times to retry connection before giving up</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Number of seconds to wait between attempts to contact management server</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_connect-string">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --core-file </code> </p></th> <td>Write core file on error; used in debugging</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --disable-indexes </code> </p></th> <td>Causes indexes from backup to be ignored; may decrease time needed to restore data</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--dont-ignore-systab-0</code>, </p><p> <code class="option"> -f </code> </p></th> <td>Do not ignore system table during restore; experimental only; not for production use</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --exclude-databases=list </code> </p></th> <td>List of one or more databases to exclude (includes those not named)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --exclude-intermediate-sql-tables[=TRUE|FALSE] </code> </p></th> <td>Do not restore any intermediate tables (having names prefixed with '#sql-') that were left over from copying ALTER TABLE operations; specify FALSE to restore such tables</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --exclude-missing-columns </code> </p></th> <td>Causes columns from backup version of table that are missing from version of table in database to be ignored</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --exclude-missing-tables </code> </p></th> <td>Causes tables from backup that are missing from database to be ignored</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --exclude-tables=list </code> </p></th> <td>List of one or more tables to exclude (includes those in same database that are not named); each table reference must include database name</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --fields-enclosed-by=char </code> </p></th> <td>Fields are enclosed by this character</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --fields-optionally-enclosed-by </code> </p></th> <td>Fields are optionally enclosed by this character</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --fields-terminated-by=char </code> </p></th> <td>Fields are terminated by this character</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --hex </code> </p></th> <td>Print binary types in hexadecimal format</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ignore-extended-pk-updates[=0|1] </code> </p></th> <td>Ignore log entries containing updates to columns now included in extended primary key</td> <td><p> ADDED: NDB 7.6.14 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --include-databases=list </code> </p></th> <td>List of one or more databases to restore (excludes those not named)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --include-tables=list </code> </p></th> <td>List of one or more tables to restore (excludes those in same database that are not named); each table reference must include database name</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --lines-terminated-by=char </code> </p></th> <td>Lines are terminated by this character</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --login-path=path </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--lossy-conversions</code>, </p><p> <code class="option"> -L </code> </p></th> <td>Allow lossy conversions of column values (type demotions or changes in sign) when restoring data from backup</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --no-binlog </code> </p></th> <td>If mysqld is connected and using binary logging, do not log restored data</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --no-defaults </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--no-restore-disk-objects</code>, </p><p> <code class="option"> -d </code> </p></th> <td>Do not restore objects relating to Disk Data</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--no-upgrade</code>, </p><p> <code class="option"> -u </code> </p></th> <td>Do not upgrade array type for varsize attributes which do not already resize VAR data, and do not change column attributes</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-nodegroup-map=map</code>, </p><p> <code class="option"> -z </code> </p></th> <td>Specify node group map; unused, unsupported</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Set node ID for this node, overriding any ID set by --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Enable optimizations for selection of nodes for transactions. Enabled by default; use --skip-ndb-optimized-node-selection to disable</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--nodeid=#</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_nodeid">-n #</a> </code> </p></th> <td>ID of node where backup was taken</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --num-slices=# </code> </p></th> <td>Number of slices to apply when restoring by slice</td> <td><p> ADDED: NDB 7.6.13 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--parallelism=#</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_parallelism">-p #</a> </code> </p></th> <td>Number of parallel transactions to use while restoring data</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--preserve-trailing-spaces</code>, </p><p> <code class="option"> -P </code> </p></th> <td>Allow preservation of trailing spaces (including padding) when promoting fixed-width string types to variable-width types</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --print </code> </p></th> <td>Print metadata, data, and log to stdout (equivalent to --print-meta --print-data --print-log)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --print-data </code> </p></th> <td>Print data to stdout</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --print-defaults </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --print-log </code> </p></th> <td>Print log to stdout</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --print-meta </code> </p></th> <td>Print metadata to stdout</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --print-sql-log </code> </p></th> <td>Write SQL log to stdout</td> <td><p> ADDED: NDB 7.5.4 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --progress-frequency=# </code> </p></th> <td>Print status of restore each given number of seconds</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--promote-attributes</code>, </p><p> <code class="option"> -A </code> </p></th> <td>Allow attributes to be promoted when restoring data from backup</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --rebuild-indexes </code> </p></th> <td>Causes multithreaded rebuilding of ordered indexes found in backup; number of threads used is determined by setting BuildIndexThreads</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --remap-column=string </code> </p></th> <td>Apply offset to value of specified column using indicated function and arguments. Format is [db].[tbl].[col]:[fn]:[args]; see documentation for details</td> <td><p> ADDED: NDB 7.6.14 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--restore-data</code>, </p><p> <code class="option"> -r </code> </p></th> <td>Restore table data and logs into NDB Cluster using NDB API</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--restore-epoch</code>, </p><p> <code class="option"> -e </code> </p></th> <td>Restore epoch info into status table; useful on replica cluster for starting replication; updates or inserts row in mysql.ndb_apply_status with ID 0</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--restore-meta</code>, </p><p> <code class="option"> -m </code> </p></th> <td>Restore metadata to NDB Cluster using NDB API</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --restore-privilege-tables </code> </p></th> <td>Restore MySQL privilege tables that were previously moved to NDB</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --rewrite-database=string </code> </p></th> <td>Restore to differently named database; format is olddb,newdb</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --skip-broken-objects </code> </p></th> <td>Ignore missing blob tables in backup file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--skip-table-check</code>, </p><p> <code class="option"> -s </code> </p></th> <td>Skip table structure check during restore</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --skip-unknown-objects </code> </p></th> <td>Causes schema objects not recognized by ndb_restore to be ignored when restoring backup made from newer NDB version to older version</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --slice-id=# </code> </p></th> <td>Slice ID, when restoring by slices</td> <td><p> ADDED: NDB 7.6.13 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--tab=path</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-restore.html#option_ndb_restore_tab">-T path</a> </code> </p></th> <td>Creates a tab-separated .txt file for each table in path provided</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --timestamp-printouts{=true|false} </code> </p></th> <td>Prefix all info, error, and debug log messages with timestamps</td> <td><p> ADDED: NDB 7.5.30, 5.7.41-ndb-7.6.26 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit; same as --help</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --verbose=# </code> </p></th> <td>Level of verbosity in output</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code class="option"> -V </code> </p></th> <td>Display version information and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody></table>

* `--allow-pk-changes`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>

  When this option is set to `1`, **ndb\_restore** allows the primary keys in a table definition to differ from that of the same table in the backup. This may be desirable when backing up and restoring between different schema versions with primary key changes on one or more tables, and it appears that performing the restore operation using ndb\_restore is simpler or mor efficient than issuing many `ALTER TABLE` statements after restoring table schemas and data.

  The following changes in primary key definitions are supported by `--allow-pk-changes`:

  + **Extending the primary key**: A non-nullable column that exists in the table schema in the backup becomes part of the table's primary key in the database.

    Important

    When extending a table's primary key, any columns which become part of primary key must not be updated while the backup is being taken; any such updates discovered by **ndb\_restore** cause the restore operation to fail, even when no change in value takes place. In some cases, it may be possible to override this behavior using the `--ignore-extended-pk-updates` option; see the description of this option for more information.

  + **Contracting the primary key (1)**: A column that is already part of the table's primary key in the backup schema is no longer part of the primary key, but remains in the table.

  + **Contracting the primary key (2)**: A column that is already part of the table's primary key in the backup schema is removed from the table entirely.

  These differences can be combined with other schema differences supported by **ndb\_restore**, including changes to blob and text columns requiring the use of staging tables.

  Basic steps in a typical scenario using primary key schema changes are listed here:

  1. Restore table schemas using **ndb\_restore** `--restore-meta`

  2. Alter schema to that desired, or create it
  3. Back up the desired schema
  4. Run **ndb\_restore** `--disable-indexes` using the backup from the previous step, to drop indexes and constraints

  5. Run **ndb\_restore** `--allow-pk-changes` (possibly along with `--ignore-extended-pk-updates`, `--disable-indexes`, and possibly other options as needed) to restore all data

  6. Run **ndb\_restore** `--rebuild-indexes` using the backup made with the desired schema, to rebuild indexes and constraints

  When extending the primary key, it may be necessary for **ndb\_restore** to use a temporary secondary unique index during the restore operation to map from the old primary key to the new one. Such an index is created only when necessary to apply events from the backup log to a table which has an extended primary key. This index is named `NDB$RESTORE_PK_MAPPING`, and is created on each table requiring it; it can be shared, if necessary, by multiple instances of **ndb\_restore** instances running in parallel. (Running **ndb\_restore** `--rebuild-indexes` at the end of the restore process causes this index to be dropped.)

* `--append`

  <table frame="box" rules="all" summary="Properties for append"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--append</code></td> </tr></tbody></table>

  When used with the `--tab` and `--print-data` options, this causes the data to be appended to any existing files having the same names.

* `--backup-path`=*`dir_name`*

  <table frame="box" rules="all" summary="Properties for backup-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>./</code></td> </tr></tbody></table>

  The path to the backup directory is required; this is supplied to **ndb\_restore** using the `--backup-path` option, and must include the subdirectory corresponding to the ID backup of the backup to be restored. For example, if the data node's `DataDir` is `/var/lib/mysql-cluster`, then the backup directory is `/var/lib/mysql-cluster/BACKUP`, and the backup files for the backup with the ID 3 can be found in `/var/lib/mysql-cluster/BACKUP/BACKUP-3`. The path may be absolute or relative to the directory in which the **ndb\_restore** executable is located, and may be optionally prefixed with `backup-path=`.

  It is possible to restore a backup to a database with a different configuration than it was created from. For example, suppose that a backup with backup ID `12`, created in a cluster with two storage nodes having the node IDs `2` and `3`, is to be restored to a cluster with four nodes. Then **ndb\_restore** must be run twice—once for each storage node in the cluster where the backup was taken. However, **ndb\_restore** cannot always restore backups made from a cluster running one version of MySQL to a cluster running a different MySQL version. See Section 21.3.7, “Upgrading and Downgrading NDB Cluster”, for more information.

  Important

  It is not possible to restore a backup made from a newer version of NDB Cluster using an older version of **ndb\_restore**. You can restore a backup made from a newer version of MySQL to an older cluster, but you must use a copy of **ndb\_restore** from the newer NDB Cluster version to do so.

  For example, to restore a cluster backup taken from a cluster running NDB Cluster 7.6.36 to a cluster running NDB Cluster 7.5.36, you must use the **ndb\_restore** that comes with the NDB Cluster 7.6.36 distribution.

  For more rapid restoration, the data may be restored in parallel, provided that there is a sufficient number of cluster connections available. That is, when restoring to multiple nodes in parallel, you must have an `[api]` or `[mysqld]` section in the cluster `config.ini` file available for each concurrent **ndb\_restore** process. However, the data files must always be applied before the logs.

* `--backupid`=*`#`*, `-b`

  <table frame="box" rules="all" summary="Properties for backupid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backupid=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr></tbody></table>

  This option is used to specify the ID or sequence number of the backup, and is the same number shown by the management client in the `Backup backup_id completed` message displayed upon completion of a backup. (See Section 21.6.8.2, “Using The NDB Cluster Management Client to Create a Backup”.)

  Important

  When restoring cluster backups, you must be sure to restore all data nodes from backups having the same backup ID. Using files from different backups can at best result in restoring the cluster to an inconsistent state, and may fail altogether.

  In NDB 7.5.13 and later, and in NDB 7.6.9 and later, this option is required.

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Directory containing character sets.

* `--connect`, `-c`

  <table frame="box" rules="all" summary="Properties for connect"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost:1186</code></td> </tr></tbody></table>

  Alias for `--ndb-connectstring`.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

  Number of times to retry connection before giving up.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

  Number of seconds to wait between attempts to contact management server.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Same as `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>0

  Write core file on error; used in debugging.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>1

  Read given file after global files are read.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>2

  Read default options from given file only.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>3

  Also read groups with concat(group, suffix).

* `--disable-indexes`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>4

  Disable restoration of indexes during restoration of the data from a native `NDB` backup. Afterwards, you can restore indexes for all tables at once with multithreaded building of indexes using `--rebuild-indexes`, which should be faster than rebuilding indexes concurrently for very large tables.

  Beginning with NDB 7.5.24 and NDB 7.6.20, this option also drops any foreign keys specified in the backup.

* `--dont-ignore-systab-0`, `-f`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>5

  Normally, when restoring table data and metadata, **ndb\_restore** ignores the copy of the `NDB` system table that is present in the backup. `--dont-ignore-systab-0` causes the system table to be restored. *This option is intended for experimental and development use only, and is not recommended in a production environment*.

* `--exclude-databases`=*`db-list`*

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>6

  Comma-delimited list of one or more databases which should not be restored.

  This option is often used in combination with `--exclude-tables`; see that option's description for further information and examples.

* `--exclude-intermediate-sql-tables[`=*`TRUE|FALSE]`*

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>7

  When performing copying `ALTER TABLE` operations, `mysqld` creates intermediate tables (whose names are prefixed with `#sql-`). When `TRUE`, the `--exclude-intermediate-sql-tables` option keeps **ndb\_restore** from restoring such tables that may have been left over from these operations. This option is `TRUE` by default.

* `--exclude-missing-columns`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>8

  It is possible to restore only selected table columns using this option, which causes **ndb\_restore** to ignore any columns missing from tables being restored as compared to the versions of those tables found in the backup. This option applies to all tables being restored. If you wish to apply this option only to selected tables or databases, you can use it in combination with one or more of the `--include-*` or `--exclude-*` options described elsewhere in this section to do so, then restore data to the remaining tables using a complementary set of these options.

* `--exclude-missing-tables`

  <table frame="box" rules="all" summary="Properties for allow-pk-changes"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--allow-pk-changes[=0|1]</code></td> </tr><tr><th>Introduced</th> <td>5.7.29-ndb-7.6.14</td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>1</code></td> </tr></tbody></table>9

  It is possible to restore only selected tables using this option, which causes **ndb\_restore** to ignore any tables from the backup that are not found in the target database.

* `--exclude-tables`=*`table-list`*

  <table frame="box" rules="all" summary="Properties for append"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--append</code></td> </tr></tbody></table>0

  List of one or more tables to exclude; each table reference must include the database name. Often used together with `--exclude-databases`.

  When `--exclude-databases` or `--exclude-tables` is used, only those databases or tables named by the option are excluded; all other databases and tables are restored by **ndb\_restore**.

  This table shows several invocations of **ndb\_restore** usng `--exclude-*` options (other options possibly required have been omitted for clarity), and the effects these options have on restoring from an NDB Cluster backup:

  **Table 21.39 Several invocations of ndb\_restore using --exclude-\* options, and the effects these options have on restoring from an NDB Cluster backup.**

  <table frame="box" rules="all" summary="Properties for append"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--append</code></td> </tr></tbody></table>1

  You can use these two options together. For example, the following causes all tables in all databases *except for* databases `db1` and `db2`, and tables `t1` and `t2` in database `db3`, to be restored:

  ```sql
  $> ndb_restore [...] --exclude-databases=db1,db2 --exclude-tables=db3.t1,db3.t2
  ```

  (Again, we have omitted other possibly necessary options in the interest of clarity and brevity from the example just shown.)

  You can use `--include-*` and `--exclude-*` options together, subject to the following rules:

  + The actions of all `--include-*` and `--exclude-*` options are cumulative.

  + All `--include-*` and `--exclude-*` options are evaluated in the order passed to ndb\_restore, from right to left.

  + In the event of conflicting options, the first (rightmost) option takes precedence. In other words, the first option (going from right to left) that matches against a given database or table “wins”.

  For example, the following set of options causes **ndb\_restore** to restore all tables from database `db1` except `db1.t1`, while restoring no other tables from any other databases:

  ```sql
  --include-databases=db1 --exclude-tables=db1.t1
  ```

  However, reversing the order of the options just given simply causes all tables from database `db1` to be restored (including `db1.t1`, but no tables from any other database), because the `--include-databases` option, being farthest to the right, is the first match against database `db1` and thus takes precedence over any other option that matches `db1` or any tables in `db1`:

  ```sql
  --exclude-tables=db1.t1 --include-databases=db1
  ```

* `--fields-enclosed-by`=*`char`*

  <table frame="box" rules="all" summary="Properties for append"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--append</code></td> </tr></tbody></table>2

  Each column value is enclosed by the string passed to this option (regardless of data type; see the description of `--fields-optionally-enclosed-by`).

* `--fields-optionally-enclosed-by`

  <table frame="box" rules="all" summary="Properties for append"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--append</code></td> </tr></tbody></table>3

  The string passed to this option is used to enclose column values containing character data (such as `CHAR`, `VARCHAR`, `BINARY`, `TEXT`, or `ENUM`).

* `--fields-terminated-by`=*`char`*

  <table frame="box" rules="all" summary="Properties for append"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--append</code></td> </tr></tbody></table>4

  The string passed to this option is used to separate column values. The default value is a tab character (`\t`).

* `--help`

  <table frame="box" rules="all" summary="Properties for append"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--append</code></td> </tr></tbody></table>5

  Display help text and exit.

* `--hex`

  <table frame="box" rules="all" summary="Properties for append"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--append</code></td> </tr></tbody></table>6

  If this option is used, all binary values are output in hexadecimal format.

* `--ignore-extended-pk-updates`

  <table frame="box" rules="all" summary="Properties for append"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--append</code></td> </tr></tbody></table>7

  When using the `--allow-pk-changes` option, columns which become part of a table's primary key must not be updated while the backup is being taken; such columns should keep the same values from the time values are inserted into them until the rows containing the values are deleted. If **ndb\_restore** encounters updates to these columns when restoring a backup, the restore fails. Because some applications may set values for all columns when updating a row, even when some column values are not changed, the backup may include log events appearing to update columns which are not in fact modified. In such cases you can set `--ignore-extended-pk-updates` to `1`, forcing **ndb\_restore** to ignore such updates.

  Important

  When causing these updates to be ignored, the user is responsible for ensuring that there are no updates to the values of any columns that become part of the primary key.

  For more information, see the description of `--allow-pk-changes`.

* `--include-databases`=*`db-list`*

  <table frame="box" rules="all" summary="Properties for append"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--append</code></td> </tr></tbody></table>8

  Comma-delimited list of one or more databases to restore. Often used together with `--include-tables`; see the description of that option for further information and examples.

* `--include-tables`=*`table-list`*

  <table frame="box" rules="all" summary="Properties for append"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--append</code></td> </tr></tbody></table>9

  Comma-delimited list of tables to restore; each table reference must include the database name.

  When `--include-databases` or `--include-tables` is used, only those databases or tables named by the option are restored; all other databases and tables are excluded by **ndb\_restore**, and are not restored.

  The following table shows several invocations of **ndb\_restore** using `--include-*` options (other options possibly required have been omitted for clarity), and the effects these have on restoring from an NDB Cluster backup:

  **Table 21.40 Several invocations of ndb\_restore using --include-\* options, and their effects on restoring from an NDB Cluster backup.**

  <table frame="box" rules="all" summary="Properties for backup-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>./</code></td> </tr></tbody></table>0

  You can also use these two options together. For example, the following causes all tables in databases `db1` and `db2`, together with the tables `t1` and `t2` in database `db3`, to be restored (and no other databases or tables):

  ```sql
  $> ndb_restore [...] --include-databases=db1,db2 --include-tables=db3.t1,db3.t2
  ```

  (Again we have omitted other, possibly required, options in the example just shown.)

  It also possible to restore only selected databases, or selected tables from a single database, without any `--include-*` (or `--exclude-*`) options, using the syntax shown here:

  ```sql
  ndb_restore other_options db_name,[db_name[,...] | tbl_name[,tbl_name][,...]]
  ```

  In other words, you can specify either of the following to be restored:

  + All tables from one or more databases
  + One or more tables from a single database
* `--lines-terminated-by`=*`char`*

  <table frame="box" rules="all" summary="Properties for backup-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>./</code></td> </tr></tbody></table>1

  Specifies the string used to end each line of output. The default is a linefeed character (`\n`).

* `--login-path`

  <table frame="box" rules="all" summary="Properties for backup-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>./</code></td> </tr></tbody></table>2

  Read given path from login file.

* `--lossy-conversions`, `-L`

  <table frame="box" rules="all" summary="Properties for backup-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>./</code></td> </tr></tbody></table>3

  This option is intended to complement the `--promote-attributes` option. Using `--lossy-conversions` allows lossy conversions of column values (type demotions or changes in sign) when restoring data from backup. With some exceptions, the rules governing demotion are the same as for MySQL replication; see Section 16.4.1.10.2, “Replication of Columns Having Different Data Types”, for information about specific type conversions currently supported by attribute demotion.

  Beginning with NDB 7.5.23 and NDB 7.6.19, this option also makes it possible to restore a `NULL` column as `NOT NULL`. The column must not contain any `NULL` entries; otherwise **ndb\_restore** stops with an error.

  **ndb\_restore** reports any truncation of data that it performs during lossy conversions once per attribute and column.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for backup-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>./</code></td> </tr></tbody></table>4

  Set connect string for connecting to ndb\_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB\_CONNECTSTRING and my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for backup-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>./</code></td> </tr></tbody></table>5

  Same as `--ndb-connectstring`.

* `--ndb-nodegroup-map`=*`map`*, `-z`

  <table frame="box" rules="all" summary="Properties for backup-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>./</code></td> </tr></tbody></table>6

  Intended for restoring a backup taken from one node group to a different node group, but never completely implemented; unsupported.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for backup-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>./</code></td> </tr></tbody></table>7

  Set node ID for this node, overriding any ID set by `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for backup-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>./</code></td> </tr></tbody></table>8

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--no-binlog`

  <table frame="box" rules="all" summary="Properties for backup-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backup-path=path</code></td> </tr><tr><th>Type</th> <td>Directory name</td> </tr><tr><th>Default Value</th> <td><code>./</code></td> </tr></tbody></table>9

  This option prevents any connected SQL nodes from writing data restored by **ndb\_restore** to their binary logs.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for backupid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backupid=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr></tbody></table>0

  Do not read default options from any option file other than login file.

* `--no-restore-disk-objects`, `-d`

  <table frame="box" rules="all" summary="Properties for backupid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backupid=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr></tbody></table>1

  This option stops **ndb\_restore** from restoring any NDB Cluster Disk Data objects, such as tablespaces and log file groups; see Section 21.6.11, “NDB Cluster Disk Data Tables”, for more information about these.

* `--no-upgrade`, `-u`

  <table frame="box" rules="all" summary="Properties for backupid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backupid=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr></tbody></table>2

  When using **ndb\_restore** to restore a backup, `VARCHAR` columns created using the old fixed format are resized and recreated using the variable-width format now employed. This behavior can be overridden by specifying `--no-upgrade`.

* `--nodeid`=*`#`*, `-n`

  <table frame="box" rules="all" summary="Properties for backupid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backupid=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr></tbody></table>3

  Specify the node ID of the data node on which the backup was taken.

  When restoring to a cluster with different number of data nodes from that where the backup was taken, this information helps identify the correct set or sets of files to be restored to a given node. (In such cases, multiple files usually need to be restored to a single data node.) See Section 21.5.24.2, “Restoring to a different number of data nodes”, for additional information and examples.

  In NDB 7.5.13 and later, and in NDB 7.6.9 and later, this option is required.

* `--num-slices`=*`#`*

  <table frame="box" rules="all" summary="Properties for backupid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backupid=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr></tbody></table>4

  When restoring a backup by slices, this option sets the number of slices into which to divide the backup. This allows multiple instances of **ndb\_restore** to restore disjoint subsets in parallel, potentially reducing the amount of time required to perform the restore operation.

  A *slice* is a subset of the data in a given backup; that is, it is a set of fragments having the same slice ID, specified using the `--slice-id` option. The two options must always be used together, and the value set by `--slice-id` must always be less than the number of slices.

  **ndb\_restore** encounters fragments and assigns each one a fragment counter. When restoring by slices, a slice ID is assigned to each fragment; this slice ID is in the range 0 to 1 less than the number of slices. For a table that is not a `BLOB` table, the slice to which a given fragment belongs is determined using the formula shown here:

  ```sql
  [slice_ID] = [fragment_counter] % [number_of_slices]
  ```

  For a `BLOB` table, a fragment counter is not used; the fragment number is used instead, along with the ID of the main table for the `BLOB` table (recall that `NDB` stores *`BLOB`* values in a separate table internally). In this case, the slice ID for a given fragment is calculated as shown here:

  ```sql
  [slice_ID] =
  ([main_table_ID] + [fragment_ID]) % [number_of_slices]
  ```

  Thus, restoring by *`N`* slices means running *`N`* instances of **ndb\_restore**, all with `--num-slices=N` (along with any other necessary options) and one each with `--slice-id=1`, `--slice-id=2`, `--slice-id=3`, and so on through `slice-id=N-1`.

* `--parallelism`=*`#`*, `-p`

  <table frame="box" rules="all" summary="Properties for backupid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backupid=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr></tbody></table>5

  **ndb\_restore** uses single-row transactions to apply many rows concurrently. This parameter determines the number of parallel transactions (concurrent rows) that an instance of **ndb\_restore** tries to use. By default, this is 128; the minimum is 1, and the maximum is 1024.

  The work of performing the inserts is parallelized across the threads in the data nodes involved. This mechanism is employed for restoring bulk data from the `.Data` file—that is, the fuzzy snapshot of the data; it is not used for building or rebuilding indexes. The change log is applied serially; index drops and builds are DDL operations and handled separately. There is no thread-level parallelism on the client side of the restore.

* `--preserve-trailing-spaces`, `-P`

  <table frame="box" rules="all" summary="Properties for backupid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backupid=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr></tbody></table>6

  Cause trailing spaces to be preserved when promoting a fixed-width character data type to its variable-width equivalent—that is, when promoting a `CHAR` column value to `VARCHAR`, or a `BINARY` column value to `VARBINARY`. Otherwise, any trailing spaces are dropped from such column values when they are inserted into the new columns.

  Note

  Although you can promote `CHAR` columns to `VARCHAR` and `BINARY` columns to `VARBINARY`, you cannot promote `VARCHAR` columns to `CHAR` or `VARBINARY` columns to `BINARY`.

* `--print`

  <table frame="box" rules="all" summary="Properties for backupid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backupid=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr></tbody></table>7

  Causes **ndb\_restore** to print all data, metadata, and logs to `stdout`. Equivalent to using the `--print-data`, `--print-meta`, and `--print-log` options together.

  Note

  Use of `--print` or any of the `--print_*` options is in effect performing a dry run. Including one or more of these options causes any output to be redirected to `stdout`; in such cases, **ndb\_restore** makes no attempt to restore data or metadata to an NDB Cluster.

* `--print-data`

  <table frame="box" rules="all" summary="Properties for backupid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backupid=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr></tbody></table>8

  Cause **ndb\_restore** to direct its output to `stdout`. Often used together with one or more of `--tab`, `--fields-enclosed-by`, `--fields-optionally-enclosed-by`, `--fields-terminated-by`, `--hex`, and `--append`.

  `TEXT` and `BLOB` column values are always truncated. Such values are truncated to the first 256 bytes in the output. This cannot currently be overridden when using `--print-data`.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for backupid"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--backupid=#</code></td> </tr><tr><th>Type</th> <td>Numeric</td> </tr><tr><th>Default Value</th> <td><code>none</code></td> </tr></tbody></table>9

  Print program argument list and exit.

* `--print-log`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>0

  Cause **ndb\_restore** to output its log to `stdout`.

* `--print-meta`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>1

  Print all metadata to `stdout`.

* `print-sql-log`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>2

  Log SQL statements to `stdout`. Use the option to enable; normally this behavior is disabled. The option checks before attempting to log whether all the tables being restored have explicitly defined primary keys; queries on a table having only the hidden primary key implemented by `NDB` cannot be converted to valid SQL.

  This option does not work with tables having `BLOB` columns.

  The `--print-sql-log` option was added in NDB 7.5.4. (Bug #13511949)

* `--progress-frequency`=*`N`*

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>3

  Print a status report each *`N`* seconds while the backup is in progress. 0 (the default) causes no status reports to be printed. The maximum is 65535.

* `--promote-attributes`, `-A`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>4

  **ndb\_restore** supports limited attribute promotion in much the same way that it is supported by MySQL replication; that is, data backed up from a column of a given type can generally be restored to a column using a “larger, similar” type. For example, data from a `CHAR(20)` column can be restored to a column declared as `VARCHAR(20)`, `VARCHAR(30)`, or `CHAR(30)`; data from a `MEDIUMINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") column can be restored to a column of type `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") or `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). See Section 16.4.1.10.2, “Replication of Columns Having Different Data Types”, for a table of type conversions currently supported by attribute promotion.

  Beginning with NDB 7.5.23 and NDB 7.6.19, this option also makes it possible to restore a `NOT NULL` column as `NULL`.

  Attribute promotion by **ndb\_restore** must be enabled explicitly, as follows:

  1. Prepare the table to which the backup is to be restored. **ndb\_restore** cannot be used to re-create the table with a different definition from the original; this means that you must either create the table manually, or alter the columns which you wish to promote using `ALTER TABLE` after restoring the table metadata but before restoring the data.

  2. Invoke **ndb\_restore** with the `--promote-attributes` option (short form `-A`) when restoring the table data. Attribute promotion does not occur if this option is not used; instead, the restore operation fails with an error.

  When converting between character data types and `TEXT` or `BLOB`, only conversions between character types (`CHAR` and `VARCHAR`) and binary types (`BINARY` and `VARBINARY`) can be performed at the same time. For example, you cannot promote an `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") column to `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") while promoting a `VARCHAR` column to `TEXT` in the same invocation of **ndb\_restore**.

  Converting between `TEXT` columns using different character sets is not supported, and is expressly disallowed.

  When performing conversions of character or binary types to `TEXT` or `BLOB` with **ndb\_restore**, you may notice that it creates and uses one or more staging tables named `table_name$STnode_id`. These tables are not needed afterwards, and are normally deleted by **ndb\_restore** following a successful restoration.

* `--rebuild-indexes`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>5

  Enable multithreaded rebuilding of the ordered indexes while restoring a native `NDB` backup. The number of threads used for building ordered indexes by **ndb\_restore** with this option is controlled by the `BuildIndexThreads` data node configuration parameter and the number of LDMs.

  It is necessary to use this option only for the first run of **ndb\_restore**; this causes all ordered indexes to be rebuilt without using `--rebuild-indexes` again when restoring subsequent nodes. You should use this option prior to inserting new rows into the database; otherwise, it is possible for a row to be inserted that later causes a unique constraint violation when trying to rebuild the indexes.

  Building of ordered indices is parallelized with the number of LDMs by default. Offline index builds performed during node and system restarts can be made faster using the `BuildIndexThreads` data node configuration parameter; this parameter has no effect on dropping and rebuilding of indexes by **ndb\_restore**, which is performed online.

  Rebuilding of unique indexes uses disk write bandwidth for redo logging and local checkpointing. An insufficient amount of this bandwith can lead to redo buffer overload or log overload errors. In such cases you can run **ndb\_restore** `--rebuild-indexes` again; the process resumes at the point where the error occurred. You can also do this when you have encountered temporary errors. You can repeat execution of **ndb\_restore** `--rebuild-indexes` indefinitely; you may be able to stop such errors by reducing the value of `--parallelism`. If the problem is insufficient space, you can increase the size of the redo log (`FragmentLogFileSize` node configuration parameter), or you can increase the speed at which LCPs are performed (`MaxDiskWriteSpeed` and related parameters), in order to free space more quickly.

* `--remap-column=db.tbl.col:fn:args`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>6

  When used together with `--restore-data`, this option applies a function to the value of the indicated column. Values in the argument string are listed here:

  + *`db`*: Database name, following any renames performed by `--rewrite-database`.

  + *`tbl`*: Table name.
  + *`col`*: Name of the column to be updated. This column must be of type `INT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT") or `BIGINT` - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT"). The column can also be but is not required to be `UNSIGNED`.

  + *`fn`*: Function name; currently, the only supported name is `offset`.

  + *`args`*: Arguments supplied to the function. Currently, only a single argument, the size of the offset to be added by the `offset` function, is supported. Negative values are supported. The size of the argument cannot exceed that of the signed variant of the column's type; for example, if *`col`* is an `INT` column, then the allowed range of the argument passed to the `offset` function is `-2147483648` to `2147483647` (see Section 11.1.2, “Integer Types (Exact Value) - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT” - INTEGER, INT, SMALLINT, TINYINT, MEDIUMINT, BIGINT")).

    If applying the offset value to the column would cause an overflow or underflow, the restore operation fails. This could happen, for example, if the column is a `BIGINT`, and the option attempts to apply an offset value of 8 on a row in which the column value is 4294967291, since `4294967291 + 8 = 4294967299 > 4294967295`.

  This option can be useful when you wish to merge data stored in multiple source instances of NDB Cluster (all using the same schema) into a single destination NDB Cluster, using NDB native backup (see Section 21.6.8.2, “Using The NDB Cluster Management Client to Create a Backup”) and **ndb\_restore** to merge the data, where primary and unique key values are overlapping between source clusters, and it is necessary as part of the process to remap these values to ranges that do not overlap. It may also be necessary to preserve other relationships between tables. To fulfill such requirements, it is possible to use the option multiple times in the same invocation of **ndb\_restore** to remap columns of different tables, as shown here:

  ```sql
  $> ndb_restore --restore-data --remap-column=hr.employee.id:offset:1000 \
      --remap-column=hr.manager.id:offset:1000 --remap-column=hr.firstaiders.id:offset:1000
  ```

  (Other options not shown here may also be used.)

  `--remap-column` can also be used to update multiple columns of the same table. Combinations of multiple tables and columns are possible. Different offset values can also be used for different columns of the same table, like this:

  ```sql
  $> ndb_restore --restore-data --remap-column=hr.employee.salary:offset:10000 \
      --remap-column=hr.employee.hours:offset:-10
  ```

  When source backups contain duplicate tables which should not be merged, you can handle this by using `--exclude-tables`, `--exclude-databases`, or by some other means in your application.

  Information about the structure and other characteristics of tables to be merged can obtained using `SHOW CREATE TABLE`; the **ndb\_desc** tool; and `MAX()`, `MIN()`, `LAST_INSERT_ID()`, and other MySQL functions.

  Replication of changes from merged to unmerged tables, or from unmerged to merged tables, in separate instances of NDB Cluster is not supported.

* `--restore-data`, `-r`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>7

  Output `NDB` table data and logs.

* `--restore-epoch`, `-e`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>8

  Add (or restore) epoch information to the cluster replication status table. This is useful for starting replication on an NDB replica cluster. When this option is used, the row in the `mysql.ndb_apply_status` having `0` in the `id` column is updated if it already exists; such a row is inserted if it does not already exist. (See Section 21.7.9, “NDB Cluster Backups With NDB Cluster Replication”.)

* `--restore-meta`, `-m`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>9

  This option causes **ndb\_restore** to print `NDB` table metadata.

  The first time you run the **ndb\_restore** restoration program, you also need to restore the metadata. In other words, you must re-create the database tables—this can be done by running it with the `--restore-meta` (`-m`) option. Restoring the metadata need be done only on a single data node; this is sufficient to restore it to the entire cluster.

  In older versions of NDB Cluster, tables whose schemas were restored using this option used the same number of partitions as they did on the original cluster, even if it had a differing number of data nodes from the new cluster. In NDB 7.5.2 and later, when restoring metadata, this is no longer an issue; **ndb\_restore** now uses the default number of partitions for the target cluster, unless the number of local data manager threads is also changed from what it was for data nodes in the original cluster.

  Note

  The cluster should have an empty database when starting to restore a backup. (In other words, you should start the data nodes with `--initial` prior to performing the restore.)

* `--restore-privilege-tables`

  <table frame="box" rules="all" summary="Properties for connect"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost:1186</code></td> </tr></tbody></table>0

  **ndb\_restore** does not by default restore distributed MySQL privilege tables. This option causes **ndb\_restore** to restore the privilege tables.

  This works only if the privilege tables were converted to `NDB` before the backup was taken. For more information, see Section 21.6.13, “Distributed Privileges Using Shared Grant Tables”.

* `--rewrite-database`=*`olddb,newdb`*

  <table frame="box" rules="all" summary="Properties for connect"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost:1186</code></td> </tr></tbody></table>1

  This option makes it possible to restore to a database having a different name from that used in the backup. For example, if a backup is made of a database named `products`, you can restore the data it contains to a database named `inventory`, use this option as shown here (omitting any other options that might be required):

  ```sql
  $> ndb_restore --rewrite-database=product,inventory
  ```

  The option can be employed multiple times in a single invocation of **ndb\_restore**. Thus it is possible to restore simultaneously from a database named `db1` to a database named `db2` and from a database named `db3` to one named `db4` using `--rewrite-database=db1,db2 --rewrite-database=db3,db4`. Other **ndb\_restore** options may be used between multiple occurrences of `--rewrite-database`.

  In the event of conflicts between multiple `--rewrite-database` options, the last `--rewrite-database` option used, reading from left to right, is the one that takes effect. For example, if `--rewrite-database=db1,db2 --rewrite-database=db1,db3` is used, only `--rewrite-database=db1,db3` is honored, and `--rewrite-database=db1,db2` is ignored. It is also possible to restore from multiple databases to a single database, so that `--rewrite-database=db1,db3 --rewrite-database=db2,db3` restores all tables and data from databases `db1` and `db2` into database `db3`.

  Important

  When restoring from multiple backup databases into a single target database using `--rewrite-database`, no check is made for collisions between table or other object names, and the order in which rows are restored is not guaranteed. This means that it is possible in such cases for rows to be overwritten and updates to be lost.

* `--skip-broken-objects`

  <table frame="box" rules="all" summary="Properties for connect"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost:1186</code></td> </tr></tbody></table>2

  This option causes **ndb\_restore** to ignore corrupt tables while reading a native `NDB` backup, and to continue restoring any remaining tables (that are not also corrupted). Currently, the `--skip-broken-objects` option works only in the case of missing blob parts tables.

* `--skip-table-check`, `-s`

  <table frame="box" rules="all" summary="Properties for connect"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost:1186</code></td> </tr></tbody></table>3

  It is possible to restore data without restoring table metadata. By default when doing this, **ndb\_restore** fails with an error if a mismatch is found between the table data and the table schema; this option overrides that behavior.

  Some of the restrictions on mismatches in column definitions when restoring data using **ndb\_restore** are relaxed; when one of these types of mismatches is encountered, **ndb\_restore** does not stop with an error as it did previously, but rather accepts the data and inserts it into the target table while issuing a warning to the user that this is being done. This behavior occurs whether or not either of the options `--skip-table-check` or `--promote-attributes` is in use. These differences in column definitions are of the following types:

  + Different `COLUMN_FORMAT` settings (`FIXED`, `DYNAMIC`, `DEFAULT`)

  + Different `STORAGE` settings (`MEMORY`, `DISK`)

  + Different default values
  + Different distribution key settings
* `--skip-unknown-objects`

  <table frame="box" rules="all" summary="Properties for connect"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost:1186</code></td> </tr></tbody></table>4

  This option causes **ndb\_restore** to ignore any schema objects it does not recognize while reading a native `NDB` backup. This can be used for restoring a backup made from a cluster running (for example) NDB 7.6 to a cluster running NDB Cluster 7.5.

* `--slice-id`=*`#`*

  <table frame="box" rules="all" summary="Properties for connect"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost:1186</code></td> </tr></tbody></table>5

  When restoring by slices, this is the ID of the slice to restore. This option is always used together with `--num-slices`, and its value must be always less than that of `--num-slices`.

  For more information, see the description of the `--num-slices` elsewhere in this section.

* `--tab`=*`dir_name`*, `-T` *`dir_name`*

  <table frame="box" rules="all" summary="Properties for connect"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost:1186</code></td> </tr></tbody></table>6

  Causes `--print-data` to create dump files, one per table, each named `tbl_name.txt`. It requires as its argument the path to the directory where the files should be saved; use `.` for the current directory.

* `--timestamp-printouts`

  <table frame="box" rules="all" summary="Properties for connect"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost:1186</code></td> </tr></tbody></table>7

  Causes info, error, and debug log messages to be prefixed with timestamps.

  This option is disabled by default in NDB 7.5 and NDB 7.6. Set it explicitly to `true` to enable.

* `--usage`

  <table frame="box" rules="all" summary="Properties for connect"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost:1186</code></td> </tr></tbody></table>8

  Display help text and exit; same as `--help`.

* `--verbose`=*`#`*

  <table frame="box" rules="all" summary="Properties for connect"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost:1186</code></td> </tr></tbody></table>9

  Sets the level for the verbosity of the output. The minimum is 0; the maximum is 255. The default value is 1.

* `--version`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>0

  Display version information and exit.

Typical options for this utility are shown here:

```sql
ndb_restore [-c connection_string] -n node_id -b backup_id \
      [-m] -r --backup-path=/path/to/backup/files
```

Normally, when restoring from an NDB Cluster backup, **ndb\_restore** requires at a minimum the `--nodeid` (short form: `-n`), `--backupid` (short form: `-b`), and `--backup-path` options. In addition, when **ndb\_restore** is used to restore any tables containing unique indexes, you must include `--disable-indexes` or `--rebuild-indexes`. (Bug #57782, Bug #11764893)

The `-c` option is used to specify a connection string which tells `ndb_restore` where to locate the cluster management server (see Section 21.4.3.3, “NDB Cluster Connection Strings”). If this option is not used, then **ndb\_restore** attempts to connect to a management server on `localhost:1186`. This utility acts as a cluster API node, and so requires a free connection “slot” to connect to the cluster management server. This means that there must be at least one `[api]` or `[mysqld]` section that can be used by it in the cluster `config.ini` file. It is a good idea to keep at least one empty `[api]` or `[mysqld]` section in `config.ini` that is not being used for a MySQL server or other application for this reason (see Section 21.4.3.7, “Defining SQL and Other API Nodes in an NDB Cluster”).

You can verify that **ndb\_restore** is connected to the cluster by using the `SHOW` command in the **ndb\_mgm** management client. You can also accomplish this from a system shell, as shown here:

```sql
$> ndb_mgm -e "SHOW"
```

**Error reporting.** **ndb\_restore** reports both temporary and permanent errors. In the case of temporary errors, it may able to recover from them, and reports `Restore successful, but encountered temporary error, please look at configuration` in such cases.

Important

After using **ndb\_restore** to initialize an NDB Cluster for use in circular replication, binary logs on the SQL node acting as the replica are not automatically created, and you must cause them to be created manually. To cause the binary logs to be created, issue a `SHOW TABLES` statement on that SQL node before running `START SLAVE`. This is a known issue in NDB Cluster.


#### 21.5.24.1 Restoring an NDB Backup to a Different Version of NDB Cluster

The following two sections provide information about restoring a native NDB backup to a different version of NDB Cluster from the version in which the backup was taken.

In addition, you should consult Section 21.3.7, “Upgrading and Downgrading NDB Cluster”, for other issues you may encounter when attempting to restore an NDB backup to a cluster running a different version of the NDB software.

It is also advisable to review What is New in NDB Cluster 8.0, as well as Section 2.10.3, “Changes in MySQL 5.7”, for other changes between NDB 8.0 and previous versions of NDB Cluster that may be relevant to your particular circumstances.

##### 21.5.24.1.1 Restoring an NDB backup to a previous version of NDB Cluster

You may encounter issues when restoring a backup taken from a later version of NDB Cluster to a previous one, due to the use of features which do not exist in the earlier version. Some of these issues are listed here:

* Tables created in NDB 8.0 by default use the `utf8mb4_ai_ci` character set, which is not available in NDB 7.6 and earlier, and so cannot be read by an **ndb\_restore** binary from one of these earlier versions. In such cases, it is necessary to alter any tables using `utf8mb4_ai_ci` so that they use a character set supported in the older version prior to performing the backup.

* Due to changes in how the MySQL Server and NDB handle table metadata, tables created or altered using the included MySQL server binary from NDB 8.0.14 or later cannot be restored using **ndb\_restore** to an earlier version of NDB Cluster. Such tables use `.sdi` files which are not understood by older versions of `mysqld`.

  A backup taken in NDB 8.0.14 or later of tables which were created in NDB 8.0.13 or earlier, and which have not been altered since upgrading to NDB 8.0.14 or later, should be restorable to older versions of NDB Cluster.

  Since it is possible to restore metadata and table data separately, you can in such cases restore the table schemas from a dump made using **mysqldump**, or by executing the necessary `CREATE TABLE` statements manually, then import only the table data using **ndb\_restore** with the `--restore-data` option.

* Encrypted backups created in NDB 8.0.22 and later cannot be restored using **ndb\_restore** from NDB 8.0.21 or earlier.

* The `NDB_STORED_USER` privilege is not supported prior to NDB 8.0.18.

* NDB Cluster 8.0.18 and later supports up to 144 data nodes, while earlier versions support a maximum of only 48 data nodes. See Section 21.5.24.2.1, “Restoring to Fewer Nodes Than the Original”, for information with situations in which this incompatibility causes an issue.

##### 21.5.24.1.2 Restoring an NDB backup to a later version of NDB Cluster

In general, it should be possible to restore a backup created using the **ndb\_mgm** client `START BACKUP` command in an older version of NDB to a newer version, provided that you use the **ndb\_restore** binary that comes with the newer version. (It may be possible to use the older version of **ndb\_restore**, but this is not recommended.) Additional potential issues are listed here:

* When restoring the metadata from a backup (`--restore-meta` option), **ndb\_restore** normally attempts to reproduce the captured table schema exactly as it was when the backup was taken.

  Tables created in versions of NDB prior to 8.0.14 use `.frm` files for their metadata. These files can be read by the `mysqld` in NDB 8.0.14 and later, which can use the information contained therein to create the `.sdi` files used by the MySQL data dictionary in later versions.

* When restoring an older backup to a newer version of NDB, it may not be possible to take advantage of newer features such as hashmap partitioning, greater number of hashmap buckets, read backup, and different partitioning layouts. For this reason, it may be preferable to restore older schemas using **mysqldump** and the **mysql** client, which allows NDB to make use of the new schema features.

* Tables using the old temporal types which did not support fractional seconds (used prior to MySQL 5.6.4 and NDB 7.3.31) cannot be restored to NDB 8.0 using **ndb\_restore**. You can check such tables using `CHECK TABLE`, and then upgrade them to the newer temporal column format, if necessary, using `REPAIR TABLE` in the **mysql** client; this must be done prior to taking the backup. See Preparing Your Installation for Upgrade, for more information.

  You also restore such tables using a dump created with **mysqldump**.

* Distributed grant tables created in NDB 7.6 and earlier are not supported in NDB 8.0. Such tables can be restored to an NDB 8.0 cluster, but they have no effect on access control.


#### 21.5.24.2 Restoring to a different number of data nodes

It is possible to restore from an NDB backup to a cluster having a different number of data nodes than the original from which the backup was taken. The following two sections discuss, respectively, the cases where the target cluster has a lesser or greater number of data nodes than the source of the backup.

##### 21.5.24.2.1 Restoring to Fewer Nodes Than the Original

You can restore to a cluster having fewer data nodes than the original provided that the larger number of nodes is an even multiple of the smaller number. In the following example, we use a backup taken on a cluster having four data nodes to a cluster having two data nodes.

1. The management server for the original cluster is on host `host10`. The original cluster has four data nodes, with the node IDs and host names shown in the following extract from the management server's `config.ini` file:

   ```sql
   [ndbd]
   NodeId=2
   HostName=host2

   [ndbd]
   NodeId=4
   HostName=host4

   [ndbd]
   NodeId=6
   HostName=host6

   [ndbd]
   NodeId=8
   HostName=host8
   ```

   We assume that each data node was originally started with **ndbmtd**") `--ndb-connectstring=host10` or the equivalent.

2. Perform a backup in the normal manner. See Section 21.6.8.2, “Using The NDB Cluster Management Client to Create a Backup”, for information about how to do this.

3. The files created by the backup on each data node are listed here, where *`N`* is the node ID and *`B`* is the backup ID.

   * `BACKUP-B-0.N.Data`
   * `BACKUP-B.N.ctl`
   * `BACKUP-B.N.log`

   These files are found under `BackupDataDir``/BACKUP/BACKUP-B`, on each data node. For the rest of this example, we assume that the backup ID is 1.

   Have all of these files available for later copying to the new data nodes (where they can be accessed on the data node's local file system by **ndb\_restore**). It is simplest to copy them all to a single location; we assume that this is what you have done.

4. The management server for the target cluster is on host `host20`, and the target has two data nodes, with the node IDs and host names shown, from the management server `config.ini` file on `host20`:

   ```sql
   [ndbd]
   NodeId=3
   hostname=host3

   [ndbd]
   NodeId=5
   hostname=host5
   ```

   Each of the data node processes on `host3` and `host5` should be started with **ndbmtd**") `-c host20` `--initial` or the equivalent, so that the new (target) cluster starts with clean data node file systems.

5. Copy two different sets of two backup files to each of the target data nodes. For this example, copy the backup files from nodes 2 and 4 from the original cluster to node 3 in the target cluster. These files are listed here:

   * `BACKUP-1-0.2.Data`
   * `BACKUP-1.2.ctl`
   * `BACKUP-1.2.log`
   * `BACKUP-1-0.4.Data`
   * `BACKUP-1.4.ctl`
   * `BACKUP-1.4.log`

   Then copy the backup files from nodes 6 and 8 to node 5; these files are shown in the following list:

   * `BACKUP-1-0.6.Data`
   * `BACKUP-1.6.ctl`
   * `BACKUP-1.6.log`
   * `BACKUP-1-0.8.Data`
   * `BACKUP-1.8.ctl`
   * `BACKUP-1.8.log`

   For the remainder of this example, we assume that the respective backup files have been saved to the directory `/BACKUP-1` on each of nodes 3 and 5.

6. On each of the two target data nodes, you must restore from both sets of backups. First, restore the backups from nodes 2 and 4 to node 3 by invoking **ndb\_restore** on `host3` as shown here:

   ```sql
   $> ndb_restore -c host20 --nodeid=2 --backupid=1 --restore-data --backup-path=/BACKUP-1

   $> ndb_restore -c host20 --nodeid=4 --backupid=1 --restore-data --backup-path=/BACKUP-1
   ```

   Then restore the backups from nodes 6 and 8 to node 5 by invoking **ndb\_restore** on `host5`, like this:

   ```sql
   $> ndb_restore -c host20 --nodeid=6 --backupid=1 --restore-data --backup-path=/BACKUP-1

   $> ndb_restore -c host20 --nodeid=8 --backupid=1 --restore-data --backup-path=/BACKUP-1
   ```

##### 21.5.24.2.2 Restoring to More Nodes Than the Original

The node ID specified for a given **ndb\_restore** command is that of the node in the original backup and not that of the data node to restore it to. When performing a backup using the method described in this section, **ndb\_restore** connects to the management server and obtains a list of data nodes in the cluster the backup is being restored to. The restored data is distributed accordingly, so that the number of nodes in the target cluster does not need to be to be known or calculated when performing the backup.

Note

When changing the total number of LCP threads or LQH threads per node group, you should recreate the schema from backup created using **mysqldump**.

1. *Create the backup of the data*. You can do this by invoking the **ndb\_mgm** client `START BACKUP` command from the system shell, like this:

   ```sql
   $> ndb_mgm -e "START BACKUP 1"
   ```

   This assumes that the desired backup ID is 1.

2. Create a backup of the schema. In NDB 7.5.2 and later, this step is necessary only if the total number of LCP threads or LQH threads per node group is changed.

   ```sql
   $> mysqldump --no-data --routines --events --triggers --databases > myschema.sql
   ```

   Important

   Once you have created the `NDB` native backup using **ndb\_mgm**, you must not make any schema changes before creating the backup of the schema, if you do so.

3. Copy the backup directory to the new cluster. For example if the backup you want to restore has ID 1 and `BackupDataDir` = `/backups/node_nodeid`, then the path to the backup on this node is `/backups/node_1/BACKUP/BACKUP-1`. Inside this directory there are three files, listed here:

   * `BACKUP-1-0.1.Data`
   * `BACKUP-1.1.ctl`
   * `BACKUP-1.1.log`

   You should copy the entire directory to the new node.

   If you needed to create a schema file, copy this to a location on an SQL node where it can be read by `mysqld`.

There is no requirement for the backup to be restored from a specific node or nodes.

To restore from the backup just created, perform the following steps:

1. *Restore the schema*.

   * If you created a separate schema backup file using **mysqldump**, import this file using the **mysql** client, similar to what is shown here:

     ```sql
     $> mysql < myschema.sql
     ```

     When importing the schema file, you may need to specify the `--user` and `--password` options (and possibly others) in addition to what is shown, in order for the **mysql** client to be able to connect to the MySQL server.

   * If you did *not* need to create a schema file, you can re-create the schema using **ndb\_restore** `--restore-meta` (short form `-m`), similar to what is shown here:

     ```sql
     $> ndb_restore --nodeid=1 --backupid=1 --restore-meta --backup-path=/backups/node_1/BACKUP/BACKUP-1
     ```

     **ndb\_restore** must be able to contact the management server; add the `--ndb-connectstring` option if and as needed to make this possible.

2. *Restore the data*. This needs to be done once for each data node in the original cluster, each time using that data node's node ID. Assuming that there were 4 data nodes originally, the set of commands required would look something like this:

   ```sql
   ndb_restore --nodeid=1 --backupid=1 --restore-data --backup-path=/backups/node_1/BACKUP/BACKUP-1 --disable-indexes
   ndb_restore --nodeid=2 --backupid=1 --restore-data --backup-path=/backups/node_2/BACKUP/BACKUP-1 --disable-indexes
   ndb_restore --nodeid=3 --backupid=1 --restore-data --backup-path=/backups/node_3/BACKUP/BACKUP-1 --disable-indexes
   ndb_restore --nodeid=4 --backupid=1 --restore-data --backup-path=/backups/node_4/BACKUP/BACKUP-1 --disable-indexes
   ```

   These can be run in parallel.

   Be sure to add the `--ndb-connectstring` option as needed.

3. *Rebuild the indexes*. These were disabled by the `--disable-indexes` option used in the commands just shown. Recreating the indexes avoids errors due to the restore not being consistent at all points. Rebuilding the indexes can also improve performance in some cases. To rebuild the indexes, execute the following command once, on a single node:

   ```sql
   $> ndb_restore --nodeid=1 --backupid=1 --backup-path=/backups/node_1/BACKUP/BACKUP-1 --rebuild-indexes
   ```

   As mentioned previously, you may need to add the `--ndb-connectstring` option, so that **ndb\_restore** can contact the management server.


### 21.5.25 ndb\_select\_all — Print Rows from an NDB Table

**ndb\_select\_all** prints all rows from an `NDB` table to `stdout`.

#### Usage

```sql
ndb_select_all -c connection_string tbl_name -d db_name [> file_name]
```

Options that can be used with **ndb\_select\_all** are shown in the following table. Additional descriptions follow the table.

**Table 21.41 Command-line options used with the program ndb\_select\_all**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Format</th> <th>Description</th> <th>Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Number of times to retry connection before giving up</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Number of seconds to wait between attempts to contact management server</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_connect-string">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --core-file </code> </p></th> <td>Write core file on error; used in debugging</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--database=name</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_database">-d name</a> </code> </p></th> <td>Name of database in which table is found</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--delimiter=char</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_delimiter">-D char</a> </code> </p></th> <td>Set column delimiter</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--descending</code>, </p><p> <code class="option"> -z </code> </p></th> <td>Sort resultset in descending order (requires --order)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --disk </code> </p></th> <td>Print disk references (useful only for Disk Data tables having unindexed columns)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --gci </code> </p></th> <td>Include GCI in output</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --gci64 </code> </p></th> <td>Include GCI and row epoch in output</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--header[=value]</code>, </p><p> <code class="option"> -h </code> </p></th> <td>Print header (set to 0|FALSE to disable headers in output)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--lock=#</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_lock">-l #</a> </code> </p></th> <td>Lock type</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --login-path=path </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Set node ID for this node, overriding any ID set by --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Enable optimizations for selection of nodes for transactions. Enabled by default; use --skip-ndb-optimized-node-selection to disable</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --no-defaults </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --nodata </code> </p></th> <td>Do not print table column data</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--order=index</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_order">-o index</a> </code> </p></th> <td>Sort resultset according to index having this name</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--parallelism=#</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-all.html#option_ndb_select_all_parallelism">-p #</a> </code> </p></th> <td>Degree of parallelism</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --print-defaults </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --rowid </code> </p></th> <td>Print row ID</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--tupscan</code>, </p><p> <code class="option"> -t </code> </p></th> <td>Scan in tup order</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit; same as --help</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--useHexFormat</code>, </p><p> <code class="option"> -x </code> </p></th> <td>Output numbers in hexadecimal format</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code class="option"> -V </code> </p></th> <td>Display version information and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody></table>

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Directory containing character sets.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

  Number of times to retry connection before giving up.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

  Number of seconds to wait between attempts to contact management server.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Same as `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Write core file on error; used in debugging.

* `--database=dbname`, `-d` *`dbname`*

  Name of the database in which the table is found. The default value is `TEST_DB`.

* `--descending`, `-z`

  Sorts the output in descending order. This option can be used only in conjunction with the `-o` (`--order`) option.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read given file after global files are read.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read default options from given file only.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Also read groups with concat(group, suffix).

* `--delimiter=character`, `-D character`

  Causes the *`character`* to be used as a column delimiter. Only table data columns are separated by this delimiter.

  The default delimiter is the tab character.

* `--disk`

  Adds a disk reference column to the output. The column is nonempty only for Disk Data tables having nonindexed columns.

* `--gci`

  Adds a `GCI` column to the output showing the global checkpoint at which each row was last updated. See Section 21.2, “NDB Cluster Overview”, and Section 21.6.3.2, “NDB Cluster Log Events”, for more information about checkpoints.

* `--gci64`

  Adds a `ROW$GCI64` column to the output showing the global checkpoint at which each row was last updated, as well as the number of the epoch in which this update occurred.

* `--help`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display help text and exit.

* `--lock=lock_type`, `-l lock_type`

  Employs a lock when reading the table. Possible values for *`lock_type`* are:

  + `0`: Read lock
  + `1`: Read lock with hold
  + `2`: Exclusive read lock

  There is no default value for this option.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>0

  Read given path from login file.

* `--header=FALSE`

  Excludes column headers from the output.

* `--nodata`

  Causes any table data to be omitted.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>1

  Set connect string for connecting to ndb\_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB\_CONNECTSTRING and my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>2

  Same as `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>3

  Set node ID for this node, overriding any ID set by `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>4

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>5

  Do not read default options from any option file other than login file.

* `--order=index_name`, `-o index_name`

  Orders the output according to the index named *`index_name`*.

  Note

  This is the name of an index, not of a column; the index must have been explicitly named when created.

* `parallelism=#`, `-p` *`#`*

  Specifies the degree of parallelism.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>6

  Print program argument list and exit.

* `--rowid`

  Adds a `ROWID` column providing information about the fragments in which rows are stored.

* `--tupscan`, `-t`

  Scan the table in the order of the tuples.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>7

  Display help text and exit; same as `--help`.

* `--useHexFormat` `-x`

  Causes all numeric values to be displayed in hexadecimal format. This does not affect the output of numerals contained in strings or datetime values.

* `--version`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>8

  Display version information and exit.

#### Sample Output

Output from a MySQL `SELECT` statement:

```sql
mysql> SELECT * FROM ctest1.fish;
+----+-----------+
| id | name      |
+----+-----------+
|  3 | shark     |
|  6 | puffer    |
|  2 | tuna      |
|  4 | manta ray |
|  5 | grouper   |
|  1 | guppy     |
+----+-----------+
6 rows in set (0.04 sec)
```

Output from the equivalent invocation of **ndb\_select\_all**:

```sql
$> ./ndb_select_all -c localhost fish -d ctest1
id      name
3       [shark]
6       [puffer]
2       [tuna]
4       [manta ray]
5       [grouper]
1       [guppy]
6 rows returned

NDBT_ProgramExit: 0 - OK
```

All string values are enclosed by square brackets (`[`...`]`) in the output of **ndb\_select\_all**. For another example, consider the table created and populated as shown here:

```sql
CREATE TABLE dogs (
    id INT(11) NOT NULL AUTO_INCREMENT,
    name VARCHAR(25) NOT NULL,
    breed VARCHAR(50) NOT NULL,
    PRIMARY KEY pk (id),
    KEY ix (name)
)
TABLESPACE ts STORAGE DISK
ENGINE=NDBCLUSTER;

INSERT INTO dogs VALUES
    ('', 'Lassie', 'collie'),
    ('', 'Scooby-Doo', 'Great Dane'),
    ('', 'Rin-Tin-Tin', 'Alsatian'),
    ('', 'Rosscoe', 'Mutt');
```

This demonstrates the use of several additional **ndb\_select\_all** options:

```sql
$> ./ndb_select_all -d ctest1 dogs -o ix -z --gci --disk
GCI     id name          breed        DISK_REF
834461  2  [Scooby-Doo]  [Great Dane] [ m_file_no: 0 m_page: 98 m_page_idx: 0 ]
834878  4  [Rosscoe]     [Mutt]       [ m_file_no: 0 m_page: 98 m_page_idx: 16 ]
834463  3  [Rin-Tin-Tin] [Alsatian]   [ m_file_no: 0 m_page: 34 m_page_idx: 0 ]
835657  1  [Lassie]      [Collie]     [ m_file_no: 0 m_page: 66 m_page_idx: 0 ]
4 rows returned

NDBT_ProgramExit: 0 - OK
```


### 21.5.26 ndb\_select\_count — Print Row Counts for NDB Tables

**ndb\_select\_count** prints the number of rows in one or more `NDB` tables. With a single table, the result is equivalent to that obtained by using the MySQL statement `SELECT COUNT(*) FROM tbl_name`.

#### Usage

```sql
ndb_select_count [-c connection_string] -ddb_name tbl_name[, tbl_name2[, ...]]
```

Options that can be used with **ndb\_select\_count** are shown in the following table. Additional descriptions follow the table.

**Table 21.42 Command-line options used with the program ndb\_select\_count**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Format</th> <th>Description</th> <th>Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Number of times to retry connection before giving up</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Number of seconds to wait between attempts to contact management server</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-count.html#option_ndb_select_count_connect-string">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --core-file </code> </p></th> <td>Write core file on error; used in debugging</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--database=name</code>, </p><p> <code>-d name</code> </p></th> <td>Name of database in which table is found</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--lock=#</code>, </p><p> <code>-l #</code> </p></th> <td>Lock type</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --login-path=path </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-count.html#option_ndb_select_count_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-select-count.html#option_ndb_select_count_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Set node ID for this node, overriding any ID set by --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Enable optimizations for selection of nodes for transactions. Enabled by default; use --skip-ndb-optimized-node-selection to disable</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --no-defaults </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--parallelism=#</code>, </p><p> <code>-p #</code> </p></th> <td>Degree of parallelism</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --print-defaults </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit; same as --help</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code class="option"> -V </code> </p></th> <td>Display version information and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody></table>

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Directory containing character sets.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

  Number of times to retry connection before giving up.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

  Number of seconds to wait between attempts to contact management server.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Same as `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Write core file on error; used in debugging.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read default options from given file only.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read given file after global files are read.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Also read groups with concat(group, suffix).

* `--login-path`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read given path from login file.

* `--help`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>0

  Display help text and exit.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>1

  Set connect string for connecting to ndb\_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB\_CONNECTSTRING and my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>2

  Same as `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>3

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>4

  Set node ID for this node, overriding any ID set by `--ndb-connectstring`.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>5

  Do not read default options from any option file other than login file.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>6

  Print program argument list and exit.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>7

  Display help text and exit; same as `--help`.

* `--version`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>8

  Display version information and exit.

You can obtain row counts from multiple tables in the same database by listing the table names separated by spaces when invoking this command, as shown under **Sample Output**.

#### Sample Output

```sql
$> ./ndb_select_count -c localhost -d ctest1 fish dogs
6 records in table fish
4 records in table dogs

NDBT_ProgramExit: 0 - OK
```


### 21.5.27 ndb\_show\_tables — Display List of NDB Tables

**ndb\_show\_tables** displays a list of all `NDB` database objects in the cluster. By default, this includes not only both user-created tables and `NDB` system tables, but `NDB`-specific indexes, internal triggers, and NDB Cluster Disk Data objects as well.

Options that can be used with **ndb\_show\_tables** are shown in the following table. Additional descriptions follow the table.

**Table 21.43 Command-line options used with the program ndb\_show\_tables**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Format</th> <th>Description</th> <th>Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Number of times to retry connection before giving up</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Number of seconds to wait between attempts to contact management server</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_connect-string">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --core-file </code> </p></th> <td>Write core file on error; used in debugging</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--database=name</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_database">-d name</a> </code> </p></th> <td>Specifies database in which table is found; database name must be followed by table name</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --login-path=path </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--loops=#</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_loops">-l #</a> </code> </p></th> <td>Number of times to repeat output</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Set node ID for this node, overriding any ID set by --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Enable optimizations for selection of nodes for transactions. Enabled by default; use --skip-ndb-optimized-node-selection to disable</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --no-defaults </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--parsable</code>, </p><p> <code class="option"> -p </code> </p></th> <td>Return output suitable for MySQL LOAD DATA statement</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --print-defaults </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --show-temp-status </code> </p></th> <td>Show table temporary flag</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--type=#</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-show-tables.html#option_ndb_show_tables_type">-t #</a> </code> </p></th> <td>Limit output to objects of this type</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--unqualified</code>, </p><p> <code class="option"> -u </code> </p></th> <td>Do not qualify table names</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit; same as --help</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code class="option"> -V </code> </p></th> <td>Display version information and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody></table>

#### Usage

```sql
ndb_show_tables [-c connection_string]
```

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Directory containing character sets.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

  Number of times to retry connection before giving up.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

  Number of seconds to wait between attempts to contact management server.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Same as `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Write core file on error; used in debugging.

* `--database`, `-d`

  Specifies the name of the database in which the desired table is found. If this option is given, the name of a table must follow the database name.

  If this option has not been specified, and no tables are found in the `TEST_DB` database, **ndb\_show\_tables** issues a warning.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read given file after global files are read.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read default options from given file only.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Also read groups with concat(group, suffix).

* `--help`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display help text and exit.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>0

  Read given path from login file.

* `--loops`, `-l`

  Specifies the number of times the utility should execute. This is 1 when this option is not specified, but if you do use the option, you must supply an integer argument for it.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>1

  Set connect string for connecting to ndb\_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB\_CONNECTSTRING and my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>2

  Same as `--ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>3

  Set node ID for this node, overriding any ID set by `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>4

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>5

  Do not read default options from any option file other than login file.

* `--parsable`, `-p`

  Using this option causes the output to be in a format suitable for use with `LOAD DATA`.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>6

  Print program argument list and exit.

* `--show-temp-status`

  If specified, this causes temporary tables to be displayed.

* `--type`, `-t`

  Can be used to restrict the output to one type of object, specified by an integer type code as shown here:

  + `1`: System table
  + `2`: User-created table
  + `3`: Unique hash index

  Any other value causes all `NDB` database objects to be listed (the default).

* `--unqualified`, `-u`

  If specified, this causes unqualified object names to be displayed.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>7

  Display help text and exit; same as `--help`.

* `--version`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>8

  Display version information and exit.

Note

Only user-created NDB Cluster tables may be accessed from MySQL; system tables such as `SYSTAB_0` are not visible to `mysqld`. However, you can examine the contents of system tables using `NDB` API applications such as **ndb\_select\_all** (see Section 21.5.25, “ndb\_select\_all — Print Rows from an NDB Table”).

Prior to NDB 7.5.18 and 7.6.14, this program printed `NDBT_ProgramExit - status` upon completion of its run, due to an unnecessary dependency on the `NDBT` testing library. This dependency is has now been removed, eliminating the extraneous output.


### 21.5.28 ndb\_size.pl — NDBCLUSTER Size Requirement Estimator

This is a Perl script that can be used to estimate the amount of space that would be required by a MySQL database if it were converted to use the `NDBCLUSTER` storage engine. Unlike the other utilities discussed in this section, it does not require access to an NDB Cluster (in fact, there is no reason for it to do so). However, it does need to access the MySQL server on which the database to be tested resides.

#### Requirements

* A running MySQL server. The server instance does not have to provide support for NDB Cluster.

* A working installation of Perl.
* The `DBI` module, which can be obtained from CPAN if it is not already part of your Perl installation. (Many Linux and other operating system distributions provide their own packages for this library.)

* A MySQL user account having the necessary privileges. If you do not wish to use an existing account, then creating one using `GRANT USAGE ON db_name.*`—where *`db_name`* is the name of the database to be examined—is sufficient for this purpose.

`ndb_size.pl` can also be found in the MySQL sources in `storage/ndb/tools`.

Options that can be used with **ndb\_size.pl** are shown in the following table. Additional descriptions follow the table.

**Table 21.44 Command-line options used with the program ndb\_size.pl**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Format</th> <th>Description</th> <th>Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code class="option"> --database=string </code> </p></th> <td>Database or databases to examine; a comma-delimited list; default is ALL (use all databases found on server)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --hostname=string </code> </p></th> <td>Specify host and optional port in host[:port] format</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --socket=path </code> </p></th> <td>Specify socket to connect to</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --user=string </code> </p></th> <td>Specify MySQL user name</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --password=password </code> </p></th> <td>Specify MySQL user password</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --format=string </code> </p></th> <td>Set output format (text or HTML)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --excludetables=list </code> </p></th> <td>Skip any tables in comma-separated list</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --excludedbs=list </code> </p></th> <td>Skip any databases in comma-separated list</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --savequeries=path </code> </p></th> <td>Saves all queries on database into file specified</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --loadqueries=path </code> </p></th> <td>Loads all queries from file specified; does not connect to database</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --real_table_name=string </code> </p></th> <td>Designates table to handle unique index size calculations</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody></table>

#### Usage

```sql
perl ndb_size.pl [--database={db_name|ALL}] [--hostname=host[:port]] [--socket=socket] \
      [--user=user] [--password=password]  \
      [--help|-h] [--format={html|text}] \
      [--loadqueries=file_name] [--savequeries=file_name]
```

By default, this utility attempts to analyze all databases on the server. You can specify a single database using the `--database` option; the default behavior can be made explicit by using `ALL` for the name of the database. You can also exclude one or more databases by using the `--excludedbs` option with a comma-separated list of the names of the databases to be skipped. Similarly, you can cause specific tables to be skipped by listing their names, separated by commas, following the optional `--excludetables` option. A host name can be specified using `--hostname`; the default is `localhost`. You can specify a port in addition to the host using *`host`*:*`port`* format for the value of `--hostname`. The default port number is 3306. If necessary, you can also specify a socket; the default is `/var/lib/mysql.sock`. A MySQL user name and password can be specified the corresponding options shown. It also possible to control the format of the output using the `--format` option; this can take either of the values `html` or `text`, with `text` being the default. An example of the text output is shown here:

```sql
$> ndb_size.pl --database=test --socket=/tmp/mysql.sock
ndb_size.pl report for database: 'test' (1 tables)
--------------------------------------------------
Connected to: DBI:mysql:host=localhost;mysql_socket=/tmp/mysql.sock

Including information for versions: 4.1, 5.0, 5.1

test.t1
-------

DataMemory for Columns (* means varsized DataMemory):
         Column Name            Type  Varsized   Key  4.1  5.0   5.1
     HIDDEN_NDB_PKEY          bigint             PRI    8    8     8
                  c2     varchar(50)         Y         52   52    4*
                  c1         int(11)                    4    4     4
                                                       --   --    --
Fixed Size Columns DM/Row                              64   64    12
   Varsize Columns DM/Row                               0    0     4

DataMemory for Indexes:
   Index Name                 Type        4.1        5.0        5.1
      PRIMARY                BTREE         16         16         16
                                           --         --         --
       Total Index DM/Row                  16         16         16

IndexMemory for Indexes:
               Index Name        4.1        5.0        5.1
                  PRIMARY         33         16         16
                                  --         --         --
           Indexes IM/Row         33         16         16

Summary (for THIS table):
                                 4.1        5.0        5.1
    Fixed Overhead DM/Row         12         12         16
           NULL Bytes/Row          4          4          4
           DataMemory/Row         96         96         48
                    (Includes overhead, bitmap and indexes)

  Varsize Overhead DM/Row          0          0          8
   Varsize NULL Bytes/Row          0          0          4
       Avg Varside DM/Row          0          0         16

                 No. Rows          0          0          0

        Rows/32kb DM Page        340        340        680
Fixedsize DataMemory (KB)          0          0          0

Rows/32kb Varsize DM Page          0          0       2040
  Varsize DataMemory (KB)          0          0          0

         Rows/8kb IM Page        248        512        512
         IndexMemory (KB)          0          0          0

Parameter Minimum Requirements
------------------------------
* indicates greater than default

                Parameter     Default        4.1         5.0         5.1
          DataMemory (KB)       81920          0           0           0
       NoOfOrderedIndexes         128          1           1           1
               NoOfTables         128          1           1           1
         IndexMemory (KB)       18432          0           0           0
    NoOfUniqueHashIndexes          64          0           0           0
           NoOfAttributes        1000          3           3           3
             NoOfTriggers         768          5           5           5
```

For debugging purposes, the Perl arrays containing the queries run by this script can be read from the file specified using can be saved to a file using `--savequeries`; a file containing such arrays to be read during script execution can be specified using `--loadqueries`. Neither of these options has a default value.

To produce output in HTML format, use the `--format` option and redirect the output to a file, as shown here:

```sql
$> ndb_size.pl --database=test --socket=/tmp/mysql.sock --format=html > ndb_size.html
```

(Without the redirection, the output is sent to `stdout`.)

The output from this script includes the following information:

* Minimum values for the `DataMemory`, `IndexMemory`, `MaxNoOfTables`, `MaxNoOfAttributes`, `MaxNoOfOrderedIndexes`, and `MaxNoOfTriggers` configuration parameters required to accommodate the tables analyzed.

* Memory requirements for all of the tables, attributes, ordered indexes, and unique hash indexes defined in the database.

* The `IndexMemory` and `DataMemory` required per table and table row.


### 21.5.29 ndb\_top — View CPU usage information for NDB threads

**ndb\_top** displays running information in the terminal about CPU usage by NDB threads on an NDB Cluster data node. Each thread is represented by two rows in the output, the first showing system statistics, the second showing the measured statistics for the thread.

**ndb\_top** is available in MySQL NDB Cluster 7.6 (and later).

#### Usage

```sql
ndb_top [-h hostname] [-t port] [-u user] [-p pass] [-n node_id]
```

**ndb\_top** connects to a MySQL Server running as an SQL node of the cluster. By default, it attempts to connect to a `mysqld` running on `localhost` and port 3306, as the MySQL `root` user with no password specified. You can override the default host and port using, respectively, `--host` (`-h`) and `--port` (`-t`). To specify a MySQL user and password, use the `--user` (`-u`) and `--passwd` (`-p`) options. This user must be able to read tables in the `ndbinfo` database (**ndb\_top** uses information from `ndbinfo.cpustat` and related tables).

For more information about MySQL user accounts and passwords, see Section 6.2, “Access Control and Account Management”.

Output is available as plain text or an ASCII graph; you can specify this using the `--text` (`-x`) and `--graph` (`-g`) options, respectively. These two display modes provide the same information; they can be used concurrently. At least one display mode must be in use.

Color display of the graph is supported and enabled by default (`--color` or `-c` option). With color support enabled, the graph display shows OS user time in blue, OS system time in green, and idle time as blank. For measured load, blue is used for execution time, yellow for send time, red for time spent in send buffer full waits, and blank spaces for idle time. The percentage shown in the graph display is the sum of percentages for all threads which are not idle. Colors are not currently configurable; you can use grayscale instead by using `--skip-color`.

The sorted view (`--sort`, `-r`) is based on the maximum of the measured load and the load reported by the OS. Display of these can be enabled and disabled using the `--measured-load` (`-m`) and `--os-load` (`-o`) options. Display of at least one of these loads must be enabled.

The program tries to obtain statistics from a data node having the node ID given by the `--node-id` (`-n`) option; if unspecified, this is 1. **ndb\_top** cannot provide information about other types of nodes.

The view adjusts itself to the height and width of the terminal window; the minimum supported width is 76 characters.

Once started, **ndb\_top** runs continuously until forced to exit; you can quit the program using `Ctrl-C`. The display updates once per second; to set a different delay interval, use `--sleep-time` (`-s`).

Note

**ndb\_top** is available on macOS, Linux, and Solaris. It is not currently supported on Windows platforms.

The following table includes all options that are specific to the NDB Cluster program **ndb\_top**. Additional descriptions follow the table.

**Table 21.45 Command-line options used with the program ndb\_top**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Format</th> <th>Description</th> <th>Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code>--color</code>, </p><p> <code class="option"> -c </code> </p></th> <td>Show ASCII graphs in color; use --skip-colors to disable</td> <td><p> ADDED: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--graph</code>, </p><p> <code class="option"> -g </code> </p></th> <td>Display data using graphs; use --skip-graphs to disable</td> <td><p> ADDED: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --help </code> </p></th> <td>Show program usage information</td> <td><p> ADDED: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--host=string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_host">-h string</a> </code> </p></th> <td>Host name or IP address of MySQL Server to connect to</td> <td><p> ADDED: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --login-path=path </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--measured-load</code>, </p><p> <code class="option"> -m </code> </p></th> <td>Show measured load by thread</td> <td><p> ADDED: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --no-defaults </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--node-id=#</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_node-id">-n #</a> </code> </p></th> <td>Watch node having this node ID</td> <td><p> ADDED: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--os-load</code>, </p><p> <code class="option"> -o </code> </p></th> <td>Show load measured by operating system</td> <td><p> ADDED: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--passwd=password</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_passwd">-p password</a> </code> </p></th> <td>Connect using this password (same as --password option)</td> <td><p> ADDED: NDB 7.6.3 </p><p> REMOVED: NDB 7.6.4 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--password=password</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_password">-p password</a> </code> </p></th> <td>Connect using this password</td> <td><p> ADDED: NDB 7.6.6 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--port=#</code>, </p><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_port">-t #</a></code> (&lt;=7.6.5), </p><p> <code class="option"><a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_port">-P #</a></code> (&gt;=7.6.6) </p></th> <td>Port number to use when connecting to MySQL Server</td> <td><p> ADDED: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --print-defaults </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--sleep-time=#</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_sleep-time">-s #</a> </code> </p></th> <td>Time to wait between display refreshes, in seconds</td> <td><p> ADDED: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--socket=path</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_socket">-S path</a> </code> </p></th> <td>Socket file to use for connection</td> <td><p> ADDED: NDB 7.6.6 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--sort</code>, </p><p> <code class="option"> -r </code> </p></th> <td>Sort threads by usage; use --skip-sort to disable</td> <td><p> ADDED: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--text</code>, </p><p> <code>-x</code> (&lt;=7.6.5), </p><p> <code>-t</code> (&gt;=7.6.6) </p></th> <td>Display data using text</td> <td><p> ADDED: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --usage </code> </p></th> <td>Show program usage information; same as --help</td> <td><p> ADDED: NDB 7.6.3 </p></td> </tr></tbody><tbody><tr> <th><p> <code>--user=name</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-top.html#option_ndb_top_user">-u name</a> </code> </p></th> <td>Connect as this MySQL user</td> <td><p> ADDED: NDB 7.6.3 </p></td> </tr></tbody></table>

#### Additional Options

* `--color`, `-c`

  <table frame="box" rules="all" summary="Properties for color"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--color</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Show ASCII graphs in color; use `--skip-colors` to disable.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read given file after global files are read.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read default options from given file only.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Also read groups with concat(group, suffix).

* `--graph`, `-g`

  <table frame="box" rules="all" summary="Properties for graph"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--graph</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Display data using graphs; use `--skip-graphs` to disable. This option or `--text` must be true; both options may be true.

* `--help`, `-?`

  <table frame="box" rules="all" summary="Properties for help"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Show program usage information.

* `--host[`=*`name]`*, `-h`

  <table frame="box" rules="all" summary="Properties for host"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--host=string</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.3</td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>localhost</code></td> </tr></tbody></table>

  Host name or IP address of MySQL Server to connect to.

* `--login-path`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read given path from login file.

* `--measured-load`, `-m`

  <table frame="box" rules="all" summary="Properties for measured-load"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--measured-load</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>

  Show measured load by thread. This option or `--os-load` must be true; both options may be true.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for color"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--color</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>0

  Do not read default options from any option file other than login file.

* `--node-id[`=*`#]`*, `-n`

  <table frame="box" rules="all" summary="Properties for color"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--color</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>1

  Watch the data node having this node ID.

* `--os-load`, `-o`

  <table frame="box" rules="all" summary="Properties for color"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--color</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>2

  Show load measured by operating system. This option or `--measured-load` must be true; both options may be true.

* `--passwd[`=*`password]`*, `-p`

  <table frame="box" rules="all" summary="Properties for color"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--color</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>3

  Connect to a MySQL Server using this password and the MySQL user specified by `--user`. Synonym for `--password`.

  This password is associated with a MySQL user account only, and is not related in any way to the password used with encrypted `NDB` backups.

* `--password[`=*`password]`*, `-p`

  <table frame="box" rules="all" summary="Properties for color"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--color</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>4

  Connect to a MySQL Server using this password and the MySQL user specified by `--user`.

  This password is associated with a MySQL user account only, and is not related in any way to the password used with encrypted `NDB` backups.

* `--port[`=*`#]`*, `-P`

  <table frame="box" rules="all" summary="Properties for color"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--color</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>5

  Port number to use when connecting to MySQL Server.

  (Formerly, the short form for this option was `-t`, which was repurposed as the short form of `--text`.)

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for color"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--color</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>6

  Print program argument list and exit.

* `--sleep-time[`=*`seconds]`*, `-s`

  <table frame="box" rules="all" summary="Properties for color"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--color</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>7

  Time to wait between display refreshes, in seconds.

* `--socket=path/to/file`, *`-S`*

  <table frame="box" rules="all" summary="Properties for color"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--color</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>8

  Use the specified socket file for the connection.

* `--sort`, `-r`

  <table frame="box" rules="all" summary="Properties for color"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--color</code></td> </tr><tr><th>Introduced</th> <td>5.7.19-ndb-7.6.3</td> </tr></tbody></table>9

  Sort threads by usage; use `--skip-sort` to disable.

* `--text`, `-t`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>0

  Display data using text. This option or `--graph` must be true; both options may be true.

  (The short form for this option was `-x` in previous versions of NDB Cluster, but this is no longer supported.)

* `--usage`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>1

  Display help text and exit; same as `--help`.

* `--user[`=*`name]`*, `-u`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>2

  Connect as this MySQL user. Normally requires a password supplied by the `--password` option.

**Sample Output.** The next figure shows **ndb\_top** running in a terminal window on a Linux system with an **ndbmtd**") data node under a moderate load. Here, the program has been invoked using **ndb\_top** `-n8` `-x` to provide both text and graph output:

**Figure 21.7 ndb\_top Running in Terminal**

![Display from ndb_top, running in a terminal window. Shows information for each node, including the utilized resources.](images/ndb-top-1.png)


### 21.5.30 ndb\_waiter — Wait for NDB Cluster to Reach a Given Status

**ndb\_waiter** repeatedly (each 100 milliseconds) prints out the status of all cluster data nodes until either the cluster reaches a given status or the `--timeout` limit is exceeded, then exits. By default, it waits for the cluster to achieve `STARTED` status, in which all nodes have started and connected to the cluster. This can be overridden using the `--no-contact` and `--not-started` options.

The node states reported by this utility are as follows:

* `NO_CONTACT`: The node cannot be contacted.
* `UNKNOWN`: The node can be contacted, but its status is not yet known. Usually, this means that the node has received a `START` or `RESTART` command from the management server, but has not yet acted on it.

* `NOT_STARTED`: The node has stopped, but remains in contact with the cluster. This is seen when restarting the node using the management client's `RESTART` command.

* `STARTING`: The node's **ndbd** process has started, but the node has not yet joined the cluster.

* `STARTED`: The node is operational, and has joined the cluster.

* `SHUTTING_DOWN`: The node is shutting down.
* `SINGLE USER MODE`: This is shown for all cluster data nodes when the cluster is in single user mode.

Options that can be used with **ndb\_waiter** are shown in the following table. Additional descriptions follow the table.

**Table 21.46 Command-line options used with the program ndb\_waiter**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Format</th> <th>Description</th> <th>Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code class="option"> --character-sets-dir=path </code> </p></th> <td>Directory containing character sets</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retries=# </code> </p></th> <td>Number of times to retry connection before giving up</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --connect-retry-delay=# </code> </p></th> <td>Number of seconds to wait between attempts to contact management server</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--connect-string=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-waiter.html#option_ndb_waiter_connect-string">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --core-file </code> </p></th> <td>Write core file on error; used in debugging</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-extra-file=path </code> </p></th> <td>Read given file after global files are read</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-file=path </code> </p></th> <td>Read default options from given file only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --defaults-group-suffix=string </code> </p></th> <td>Also read groups with concat(group, suffix)</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --login-path=path </code> </p></th> <td>Read given path from login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-connectstring=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-waiter.html#option_ndb_waiter_ndb-connectstring">-c connection_string</a> </code> </p></th> <td>Set connect string for connecting to ndb_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB_CONNECTSTRING and my.cnf</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--ndb-mgmd-host=connection_string</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-waiter.html#option_ndb_waiter_ndb-mgmd-host">-c connection_string</a> </code> </p></th> <td>Same as --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-nodeid=# </code> </p></th> <td>Set node ID for this node, overriding any ID set by --ndb-connectstring</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --ndb-optimized-node-selection </code> </p></th> <td>Enable optimizations for selection of nodes for transactions. Enabled by default; use --skip-ndb-optimized-node-selection to disable</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--no-contact</code>, </p><p> <code class="option"> -n </code> </p></th> <td>Wait for cluster to reach NO CONTACT state</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --no-defaults </code> </p></th> <td>Do not read default options from any option file other than login file</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --not-started </code> </p></th> <td>Wait for cluster to reach NOT STARTED state</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --nowait-nodes=list </code> </p></th> <td>List of nodes not to be waited for</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --print-defaults </code> </p></th> <td>Print program argument list and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code class="option"> --single-user </code> </p></th> <td>Wait for cluster to enter single user mode</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--timeout=#</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-waiter.html#option_ndb_waiter_timeout">-t #</a> </code> </p></th> <td>Wait this many seconds, then exit whether or not cluster has reached desired state</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--usage</code>, </p><p> <code class="option"> -? </code> </p></th> <td>Display help text and exit; same as --help</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--version</code>, </p><p> <code class="option"> -V </code> </p></th> <td>Display version information and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--wait-nodes=list</code>, </p><p> <code class="option"> <a class="link" href="mysql-cluster-programs-ndb-waiter.html#option_ndb_waiter_wait-nodes">-w list</a> </code> </p></th> <td>List of nodes to be waited for</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody></table>

#### Usage

```sql
ndb_waiter [-c connection_string]
```

#### Additional Options

* `--character-sets-dir`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>

  Directory containing character sets.

* `--connect-retries`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retries=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>12</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>12</code></td> </tr></tbody></table>

  Number of times to retry connection before giving up.

* `--connect-retry-delay`

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-retry-delay=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>5</code></td> </tr><tr><th>Minimum Value</th> <td><code>0</code></td> </tr><tr><th>Maximum Value</th> <td><code>5</code></td> </tr></tbody></table>

  Number of seconds to wait between attempts to contact management server.

* `--connect-string`

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--connect-string=connection_string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Same as `--ndb-connectstring`.

* `--core-file`

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--core-file</code></td> </tr></tbody></table>

  Write core file on error; used in debugging.

* `--defaults-extra-file`

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-extra-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read given file after global files are read.

* `--defaults-file`

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-file=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read default options from given file only.

* `--defaults-group-suffix`

  <table frame="box" rules="all" summary="Properties for defaults-group-suffix"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--defaults-group-suffix=string</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Also read groups with concat(group, suffix).

* `--login-path`

  <table frame="box" rules="all" summary="Properties for login-path"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--login-path=path</code></td> </tr><tr><th>Type</th> <td>String</td> </tr><tr><th>Default Value</th> <td><code>[none]</code></td> </tr></tbody></table>

  Read given path from login file.

* `--help`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>0

  Display help text and exit.

* `--ndb-connectstring`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>1

  Set connect string for connecting to ndb\_mgmd. Syntax: "[nodeid=id;][host=]hostname[:port]". Overrides entries in NDB\_CONNECTSTRING and my.cnf.

* `--ndb-mgmd-host`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>2

  Same as --`ndb-connectstring`.

* `--ndb-nodeid`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>3

  Set node ID for this node, overriding any ID set by `--ndb-connectstring`.

* `--ndb-optimized-node-selection`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>4

  Enable optimizations for selection of nodes for transactions. Enabled by default; use `--skip-ndb-optimized-node-selection` to disable.

* `--no-contact`, `-n`

  Instead of waiting for the `STARTED` state, **ndb\_waiter** continues running until the cluster reaches `NO_CONTACT` status before exiting.

* `--no-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>5

  Do not read default options from any option file other than login file.

* `--not-started`

  Instead of waiting for the `STARTED` state, **ndb\_waiter** continues running until the cluster reaches `NOT_STARTED` status before exiting.

* `--nowait-nodes=list`

  When this option is used, **ndb\_waiter** does not wait for the nodes whose IDs are listed. The list is comma-delimited; ranges can be indicated by dashes, as shown here:

  ```sql
  $> ndb_waiter --nowait-nodes=1,3,7-9
  ```

  Important

  Do *not* use this option together with the `--wait-nodes` option.

* `--print-defaults`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>6

  Print program argument list and exit.

* `--timeout=seconds`, `-t seconds`

  Time to wait. The program exits if the desired state is not achieved within this number of seconds. The default is 120 seconds (1200 reporting cycles).

* `--single-user`

  The program waits for the cluster to enter single user mode.

* `--usage`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>7

  Display help text and exit; same as `--help`.

* `--version`

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th> <td><code>--character-sets-dir=path</code></td> </tr></tbody></table>8

  Display version information and exit.

* `--wait-nodes=list`, `-w list`

  When this option is used, **ndb\_waiter** waits only for the nodes whose IDs are listed. The list is comma-delimited; ranges can be indicated by dashes, as shown here:

  ```sql
  $> ndb_waiter --wait-nodes=2,4-6,10
  ```

  Important

  Do *not* use this option together with the `--nowait-nodes` option.

**Sample Output.** Shown here is the output from **ndb\_waiter** when run against a 4-node cluster in which two nodes have been shut down and then started again manually. Duplicate reports (indicated by `...`) are omitted.

```sql
$> ./ndb_waiter -c localhost

Connecting to mgmsrv at (localhost)
State node 1 STARTED
State node 2 NO_CONTACT
State node 3 STARTED
State node 4 NO_CONTACT
Waiting for cluster enter state STARTED

...

State node 1 STARTED
State node 2 UNKNOWN
State node 3 STARTED
State node 4 NO_CONTACT
Waiting for cluster enter state STARTED

...

State node 1 STARTED
State node 2 STARTING
State node 3 STARTED
State node 4 NO_CONTACT
Waiting for cluster enter state STARTED

...

State node 1 STARTED
State node 2 STARTING
State node 3 STARTED
State node 4 UNKNOWN
Waiting for cluster enter state STARTED

...

State node 1 STARTED
State node 2 STARTING
State node 3 STARTED
State node 4 STARTING
Waiting for cluster enter state STARTED

...

State node 1 STARTED
State node 2 STARTED
State node 3 STARTED
State node 4 STARTING
Waiting for cluster enter state STARTED

...

State node 1 STARTED
State node 2 STARTED
State node 3 STARTED
State node 4 STARTED
Waiting for cluster enter state STARTED
```

Note

If no connection string is specified, then **ndb\_waiter** tries to connect to a management on `localhost`, and reports `Connecting to mgmsrv at (null)`.

Prior to NDB 7.5.18 and 7.6.14, this program printed `NDBT_ProgramExit - status` upon completion of its run, due to an unnecessary dependency on the `NDBT` testing library. This dependency is has now been removed, eliminating the extraneous output.
