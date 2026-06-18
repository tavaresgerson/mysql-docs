### 25.5.1 ndbd — The NDB Cluster Data Node Daemon

The [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") binary provides the single-threaded
version of the process that is used to handle all the data in
tables employing the `NDBCLUSTER` storage
engine. This data node process enables a data node to accomplish
distributed transaction handling, node recovery, checkpointing
to disk, online backup, and related tasks. When started,
[**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") logs a warning similar to that shown
here:

```
2024-05-28 13:32:16 [ndbd] WARNING  -- Running ndbd with a single thread of
signal execution.  For multi-threaded signal execution run the ndbmtd binary.
```

[**ndbmtd**](mysql-cluster-programs-ndbmtd.html "25.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") is the multi-threaded version of this
binary.

In an NDB Cluster, a set of data node processes cooperate in
handling data. These processes can execute on the same computer
(host) or on different computers. The correspondences between
data nodes and Cluster hosts is completely configurable.

Options that can be used with [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") are shown
in the following table. Additional descriptions follow the
table.

Note

All of these options also apply to the multithreaded version
of this program ([**ndbmtd**](mysql-cluster-programs-ndbmtd.html "25.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)")) and you may
substitute “[**ndbmtd**](mysql-cluster-programs-ndbmtd.html "25.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)")” for
“[**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon")” wherever the latter
occurs in this section.

* [`--bind-address`](mysql-cluster-programs-ndbd.html#option_ndbd_bind-address)

  <table frame="box" rules="all" summary="Properties for bind-address"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--bind-address=name</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal"></code></td>
</tr></tbody></table>

  Causes [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") to bind to a specific network
  interface (host name or IP address). This option has no
  default value.

* [`--character-sets-dir`](mysql-cluster-programs-ndbd.html#option_ndbd_character-sets-dir)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>

  Directory containing character sets.

* [`--connect-delay=#`](mysql-cluster-programs-ndbd.html#option_ndbd_connect-delay)

  <table frame="box" rules="all" summary="Properties for connect-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-delay=#</code></td>
</tr><tr><th>Deprecated</th>
<td>Yes</td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">5</code></td>
</tr><tr><th>Minimum Value</th>
<td><code class="literal">0</code></td>
</tr><tr><th>Maximum Value</th>
<td><code class="literal">3600</code></td>
</tr></tbody></table>

  Determines the time to wait between attempts to contact a
  management server when starting (the number of attempts is
  controlled by the
  [`--connect-retries`](mysql-cluster-programs-ndbd.html#option_ndbd_connect-retries) option). The
  default is 5 seconds.

  This option is deprecated, and is subject to removal in a
  future release of NDB Cluster. Use
  [`--connect-retry-delay`](mysql-cluster-programs-ndbd.html#option_ndbd_connect-retry-delay) instead.

* [`--connect-retries=#`](mysql-cluster-programs-ndbd.html#option_ndbd_connect-retries)

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-retries=#</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">12</code></td>
</tr><tr><th>Minimum Value</th>
<td><code class="literal">-1</code></td>
</tr><tr><th>Maximum Value</th>
<td><code class="literal">65535</code></td>
</tr></tbody></table>

  Set the number of times to retry a connection before giving
  up; 0 means 1 attempt only (and no retries). The default is
  12 attempts. The time to wait between attempts is controlled
  by the [`--connect-retry-delay`](mysql-cluster-programs-ndbd.html#option_ndbd_connect-retry-delay)
  option.

  It is also possible to set this option to -1, in which case,
  the data node process continues indefinitely to try to
  connect.

* [`--connect-retry-delay=#`](mysql-cluster-programs-ndbd.html#option_ndbd_connect-retry-delay)

  <table frame="box" rules="all" summary="Properties for connect-retry-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-retry-delay=#</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">5</code></td>
</tr><tr><th>Minimum Value</th>
<td><code class="literal">0</code></td>
</tr><tr><th>Maximum Value</th>
<td><code class="literal">4294967295</code></td>
</tr></tbody></table>

  Determines the time to wait between attempts to contact a
  management server when starting (the time between attempts
  is controlled by the
  [`--connect-retries`](mysql-cluster-programs-ndbd.html#option_ndbd_connect-retries) option). The
  default is 5 seconds.

  This option takes the place of the
  [`--connect-delay`](mysql-cluster-programs-ndbd.html#option_ndbd_connect-delay) option, which
  is now deprecated and subject to removal in a future release
  of NDB Cluster.

  The short form `-r` for this option is also
  deprecated, and thus subject to removal. Use the long form
  instead.

* [`--connect-string`](mysql-cluster-programs-ndbd.html#option_ndbd_connect-string)

  <table frame="box" rules="all" summary="Properties for connect-string"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-string=connection_string</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  Same as [`--ndb-connectstring`](mysql-cluster-programs-ndbd.html#option_ndbd_ndb-connectstring).

* [`--core-file`](mysql-cluster-programs-ndbd.html#option_ndbd_core-file)

  <table frame="box" rules="all" summary="Properties for core-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--core-file</code></td>
</tr></tbody></table>

  Write core file on error; used in debugging.

* [`--daemon`](mysql-cluster-programs-ndbd.html#option_ndbd_daemon), `-d`

  <table frame="box" rules="all" summary="Properties for daemon"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--daemon</code></td>
</tr></tbody></table>

  Instructs [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") or
  [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "25.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") to execute as a daemon process.
  This is the default behavior.
  [`--nodaemon`](mysql-cluster-programs-ndbd.html#option_ndbd_nodaemon) can be used to
  prevent the process from running as a daemon.

  This option has no effect when running
  [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") or [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "25.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") on
  Windows platforms.

* [`--defaults-extra-file`](mysql-cluster-programs-ndbd.html#option_ndbd_defaults-extra-file)

  <table frame="box" rules="all" summary="Properties for defaults-extra-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--defaults-extra-file=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  Read given file after global files are read.

* [`--defaults-file`](mysql-cluster-programs-ndbd.html#option_ndbd_defaults-file)

  <table frame="box" rules="all" summary="Properties for defaults-file"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--defaults-file=path</code></td>
</tr><tr><th>Type</th>
<td>String</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">[none]</code></td>
</tr></tbody></table>

  Read default options from given file only.

* [`--defaults-group-suffix`](mysql-cluster-programs-ndbd.html#option_ndbd_defaults-group-suffix)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>0

  Also read groups with concat(group, suffix).

* [`--filesystem-password`](mysql-cluster-programs-ndbd.html#option_ndbd_filesystem-password)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>1

  Pass the filesystem encryption and decryption password to
  the data node process using `stdin`,
  `tty`, or the `my.cnf`
  file.

  Requires [`EncryptedFileSystem =
  1`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-encryptedfilesystem).

  For more information, see
  [Section 25.6.19.4, “File System Encryption for NDB Cluster”](mysql-cluster-tde.html "25.6.19.4 File System Encryption for NDB Cluster").

* [`--filesystem-password-from-stdin`](mysql-cluster-programs-ndbd.html#option_ndbd_filesystem-password-from-stdin)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>2

  Pass the filesystem encryption and decryption password to
  the data node process from `stdin` (only).

  Requires [`EncryptedFileSystem =
  1`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-encryptedfilesystem).

  For more information, see
  [Section 25.6.19.4, “File System Encryption for NDB Cluster”](mysql-cluster-tde.html "25.6.19.4 File System Encryption for NDB Cluster").

* [`--foreground`](mysql-cluster-programs-ndbd.html#option_ndbd_foreground)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>3

  Causes [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") or [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "25.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)")
  to execute as a foreground process, primarily for debugging
  purposes. This option implies the
  [`--nodaemon`](mysql-cluster-programs-ndbd.html#option_ndbd_nodaemon) option.

  This option has no effect when running
  [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") or [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "25.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") on
  Windows platforms.

* [`--help`](mysql-cluster-programs-ndbd.html#option_ndbd_help)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>4

  Display help text and exit.

* [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>5

  Instructs [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") to perform an initial
  start. An initial start erases any files created for
  recovery purposes by earlier instances of
  [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon"). It also re-creates recovery log
  files. On some operating systems, this process can take a
  substantial amount of time.

  The option also causes the removal of all data files
  associated with Disk Data tablespaces and undo log files
  associated with log file groups that existed previously on
  this data node (see
  [Section 25.6.11, “NDB Cluster Disk Data Tables”](mysql-cluster-disk-data.html "25.6.11 NDB Cluster Disk Data Tables")).

  An [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial) start is to be
  used *only* when starting the
  [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") process under very special
  circumstances; this is because this option causes all files
  to be removed from the NDB Cluster file system and all redo
  log files to be re-created. These circumstances are listed
  here:

  + When performing a software upgrade which has changed the
    contents of any files.

  + When restarting the node with a new version of
    [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon").

  + As a measure of last resort when for some reason the
    node restart or system restart repeatedly fails. In this
    case, be aware that this node can no longer be used to
    restore data due to the destruction of the data files.

  Warning

  To avoid the possibility of eventual data loss, it is
  recommended that you *not* use the
  `--initial` option together with
  `StopOnError = 0`. Instead, set
  `StopOnError` to 0 in
  `config.ini` only after the cluster has
  been started, then restart the data nodes
  normally—that is, without the
  `--initial` option. See the description of
  the [`StopOnError`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-stoponerror)
  parameter for a detailed explanation of this issue. (Bug
  #24945638)

  Use of this option prevents the
  [`StartPartialTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-startpartialtimeout)
  and
  [`StartPartitionedTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-startpartitionedtimeout)
  configuration parameters from having any effect.

  Important

  This option does *not* affect backup
  files that have already been created by the affected node.

  This option also has no effect on recovery of data by a
  data node that is just starting (or restarting) from data
  nodes that are already running (unless they also were
  started with `--initial`, as part of an
  initial restart). This recovery of data occurs
  automatically, and requires no user intervention in an NDB
  Cluster that is running normally.

  It is permissible to use this option when starting the
  cluster for the very first time (that is, before any data
  node files have been created); however, it is
  *not* necessary to do so.

* [`--initial-start`](mysql-cluster-programs-ndbd.html#option_ndbd_initial-start)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>6

  This option is used when performing a partial initial start
  of the cluster. Each node should be started with this
  option, as well as
  [`--nowait-nodes`](mysql-cluster-programs-ndbd.html#option_ndbd_nowait-nodes).

  Suppose that you have a 4-node cluster whose data nodes have
  the IDs 2, 3, 4, and 5, and you wish to perform a partial
  initial start using only nodes 2, 4, and 5—that is,
  omitting node 3:

  ```
  $> ndbd --ndb-nodeid=2 --nowait-nodes=3 --initial-start
  $> ndbd --ndb-nodeid=4 --nowait-nodes=3 --initial-start
  $> ndbd --ndb-nodeid=5 --nowait-nodes=3 --initial-start
  ```

  When using this option, you must also specify the node ID
  for the data node being started with the
  [`--ndb-nodeid`](mysql-cluster-programs-ndbd.html#option_ndbd_ndb-nodeid) option.

  Important

  Do not confuse this option with the
  [`--nowait-nodes`](mysql-cluster-programs-ndb-mgmd.html#option_ndb_mgmd_nowait-nodes) option for
  [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "25.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon"), which can be used to enable a
  cluster configured with multiple management servers to be
  started without all management servers being online.

* [`--install[=name]`](mysql-cluster-programs-ndbd.html#option_ndbd_install)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>7

  Causes [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") to be installed as a Windows
  service. Optionally, you can specify a name for the service;
  if not set, the service name defaults to
  `ndbd`. Although it is preferable to
  specify other [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") program options in a
  `my.ini` or `my.cnf`
  configuration file, it is possible to use together with
  `--install`. However, in such cases, the
  `--install` option must be specified first,
  before any other options are given, for the Windows service
  installation to succeed.

  It is generally not advisable to use this option together
  with the [`--initial`](mysql-cluster-programs-ndbd.html#option_ndbd_initial) option,
  since this causes the data node file system to be wiped and
  rebuilt every time the service is stopped and started.
  Extreme care should also be taken if you intend to use any
  of the other [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") options that affect the
  starting of data nodes—including
  [`--initial-start`](mysql-cluster-programs-ndbd.html#option_ndbd_initial-start),
  [`--nostart`](mysql-cluster-programs-ndbd.html#option_ndbd_nostart), and
  [`--nowait-nodes`](mysql-cluster-programs-ndbd.html#option_ndbd_nowait-nodes)—together
  with [`--install`](mysql-cluster-programs-ndbd.html#option_ndbd_install), and you should
  make absolutely certain you fully understand and allow for
  any possible consequences of doing so.

  The [`--install`](mysql-cluster-programs-ndbd.html#option_ndbd_install) option has no
  effect on non-Windows platforms.

* [`--logbuffer-size=#`](mysql-cluster-programs-ndbd.html#option_ndbd_logbuffer-size)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>8

  Sets the size of the data node log buffer. When debugging
  with high amounts of extra logging, it is possible for the
  log buffer to run out of space if there are too many log
  messages, in which case some log messages can be lost. This
  should not occur during normal operations.

* [`--login-path`](mysql-cluster-programs-ndbd.html#option_ndbd_login-path)

  <table frame="box" rules="all" summary="Properties for character-sets-dir"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--character-sets-dir=path</code></td>
</tr></tbody></table>9

  Read given path from login file.

* [`--no-login-paths`](mysql-cluster-programs-ndbd.html#option_ndbd_no-login-paths)

  <table frame="box" rules="all" summary="Properties for connect-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-delay=#</code></td>
</tr><tr><th>Deprecated</th>
<td>Yes</td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">5</code></td>
</tr><tr><th>Minimum Value</th>
<td><code class="literal">0</code></td>
</tr><tr><th>Maximum Value</th>
<td><code class="literal">3600</code></td>
</tr></tbody></table>0

  Skips reading options from the login path file.

* [`--ndb-connectstring`](mysql-cluster-programs-ndbd.html#option_ndbd_ndb-connectstring)

  <table frame="box" rules="all" summary="Properties for connect-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-delay=#</code></td>
</tr><tr><th>Deprecated</th>
<td>Yes</td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">5</code></td>
</tr><tr><th>Minimum Value</th>
<td><code class="literal">0</code></td>
</tr><tr><th>Maximum Value</th>
<td><code class="literal">3600</code></td>
</tr></tbody></table>1

  Set connection string for connecting to
  [**ndb\_mgmd**](mysql-cluster-programs-ndb-mgmd.html "25.5.4 ndb_mgmd — The NDB Cluster Management Server Daemon"). Syntax:
  `[nodeid=id;][host=]hostname[:port]`.
  Overrides entries in `NDB_CONNECTSTRING`
  and `my.cnf`.

* [`--ndb-log-timestamps`](mysql-cluster-programs-ndbd.html#option_ndbd_ndb-log-timestamps)

  <table frame="box" rules="all" summary="Properties for connect-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-delay=#</code></td>
</tr><tr><th>Deprecated</th>
<td>Yes</td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">5</code></td>
</tr><tr><th>Minimum Value</th>
<td><code class="literal">0</code></td>
</tr><tr><th>Maximum Value</th>
<td><code class="literal">3600</code></td>
</tr></tbody></table>2

  Sets the format used for timestamps in node logs. This is
  one of the following values:

  + `LEGACY`: The system timezone, with
    resolution in seconds.

  + `UTC`:
    [RFC
    3339](https://datatracker.ietf.org/doc/html/rfc3339) format, with microsecond resolution.

  + `SYSTEM`: RFC 3339 format.

  `UTC` is the default in MySQL
  9.5.

* [`--ndb-mgmd-host`](mysql-cluster-programs-ndbd.html#option_ndbd_ndb-mgmd-host)

  <table frame="box" rules="all" summary="Properties for connect-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-delay=#</code></td>
</tr><tr><th>Deprecated</th>
<td>Yes</td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">5</code></td>
</tr><tr><th>Minimum Value</th>
<td><code class="literal">0</code></td>
</tr><tr><th>Maximum Value</th>
<td><code class="literal">3600</code></td>
</tr></tbody></table>3

  Same as [`--ndb-connectstring`](mysql-cluster-programs-ndbd.html#option_ndbd_ndb-connectstring).

* [`--ndb-mgm-tls`](mysql-cluster-programs-ndbd.html#option_ndbd_ndb-mgm-tls)

  <table frame="box" rules="all" summary="Properties for connect-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-delay=#</code></td>
</tr><tr><th>Deprecated</th>
<td>Yes</td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">5</code></td>
</tr><tr><th>Minimum Value</th>
<td><code class="literal">0</code></td>
</tr><tr><th>Maximum Value</th>
<td><code class="literal">3600</code></td>
</tr></tbody></table>4

  Sets the level of TLS support required to connect to the
  management server; one of `relaxed` or
  `strict`. `relaxed` (the
  default) means that a TLS connection is attempted, but
  success is not required; `strict` means
  that TLS is required to connect.

* [`--ndb-nodeid`](mysql-cluster-programs-ndbd.html#option_ndbd_ndb-nodeid)

  <table frame="box" rules="all" summary="Properties for connect-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-delay=#</code></td>
</tr><tr><th>Deprecated</th>
<td>Yes</td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">5</code></td>
</tr><tr><th>Minimum Value</th>
<td><code class="literal">0</code></td>
</tr><tr><th>Maximum Value</th>
<td><code class="literal">3600</code></td>
</tr></tbody></table>5

  Set node ID for this node, overriding any ID set by
  --ndb-connectstring.

* [`--ndb-optimized-node-selection`](mysql-cluster-programs-ndbd.html#option_ndbd_ndb-optimized-node-selection)

  <table frame="box" rules="all" summary="Properties for connect-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-delay=#</code></td>
</tr><tr><th>Deprecated</th>
<td>Yes</td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">5</code></td>
</tr><tr><th>Minimum Value</th>
<td><code class="literal">0</code></td>
</tr><tr><th>Maximum Value</th>
<td><code class="literal">3600</code></td>
</tr></tbody></table>6

  Enable optimizations for selection of nodes for
  transactions. Enabled by default; use
  `--skip-ndb-optimized-node-selection` to
  disable.

* [`--ndb-tls-search-path`](mysql-cluster-programs-ndbd.html#option_ndbd_ndb-tls-search-path)

  <table frame="box" rules="all" summary="Properties for connect-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-delay=#</code></td>
</tr><tr><th>Deprecated</th>
<td>Yes</td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">5</code></td>
</tr><tr><th>Minimum Value</th>
<td><code class="literal">0</code></td>
</tr><tr><th>Maximum Value</th>
<td><code class="literal">3600</code></td>
</tr></tbody></table>7

  Specify a list of directories to search for a CA file. On
  Unix platforms, the directory names are separated by colons
  (`:`); on Windows systems, the semicolon
  character (`;`) is used as the separator. A
  directory reference may be relative or absolute; it may
  contain one or more environment variables, each denoted by a
  prefixed dollar sign (`$`), and expanded
  prior to use.

  Searching begins with the leftmost named directory and
  proceeds from left to right until a file is found. An empty
  string denotes an empty search path, which causes all
  searches to fail. A string consisting of a single dot
  (`.`) indicates that the search path
  limited to the current working directory.

  If no search path is supplied, the compiled-in default value
  is used. This value depends on the platform used: On
  Windows, this is `\ndb-tls`; on other
  platforms (including Linux), it is
  `$HOME/ndb-tls`. This can be overridden by
  compiling NDB Cluster using
  [`-DWITH_NDB_TLS_SEARCH_PATH`](source-configuration-options.html#option_cmake_with_ndb_tls_search_path).

* [`--nodaemon`](mysql-cluster-programs-ndbd.html#option_ndbd_nodaemon)

  <table frame="box" rules="all" summary="Properties for connect-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-delay=#</code></td>
</tr><tr><th>Deprecated</th>
<td>Yes</td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">5</code></td>
</tr><tr><th>Minimum Value</th>
<td><code class="literal">0</code></td>
</tr><tr><th>Maximum Value</th>
<td><code class="literal">3600</code></td>
</tr></tbody></table>8

  Prevents [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") or
  [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "25.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") from executing as a daemon
  process. This option overrides the
  [`--daemon`](mysql-cluster-programs-ndbd.html#option_ndbd_daemon) option. This is useful
  for redirecting output to the screen when debugging the
  binary.

  The default behavior for [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") and
  [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "25.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") on Windows is to run in the
  foreground, making this option unnecessary on Windows
  platforms, where it has no effect.

* [`--no-defaults`](mysql-cluster-programs-ndbd.html#option_ndbd_no-defaults)

  <table frame="box" rules="all" summary="Properties for connect-delay"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-delay=#</code></td>
</tr><tr><th>Deprecated</th>
<td>Yes</td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">5</code></td>
</tr><tr><th>Minimum Value</th>
<td><code class="literal">0</code></td>
</tr><tr><th>Maximum Value</th>
<td><code class="literal">3600</code></td>
</tr></tbody></table>9

  Do not read default options from any option file other than
  login file.

* [`--nostart`](mysql-cluster-programs-ndbd.html#option_ndbd_nostart), `-n`

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-retries=#</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">12</code></td>
</tr><tr><th>Minimum Value</th>
<td><code class="literal">-1</code></td>
</tr><tr><th>Maximum Value</th>
<td><code class="literal">65535</code></td>
</tr></tbody></table>0

  Instructs [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") not to start
  automatically. When this option is used,
  [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") connects to the management server,
  obtains configuration data from it, and initializes
  communication objects. However, it does not actually start
  the execution engine until specifically requested to do so
  by the management server. This can be accomplished by
  issuing the proper [`START`](mysql-cluster-mgm-client-commands.html#ndbclient-start)
  command in the management client (see
  [Section 25.6.1, “Commands in the NDB Cluster Management Client”](mysql-cluster-mgm-client-commands.html "25.6.1 Commands in the NDB Cluster Management Client")).

* [`--nowait-nodes=node_id_1[,
  node_id_2[, ...]]`](mysql-cluster-programs-ndbd.html#option_ndbd_nowait-nodes)

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-retries=#</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">12</code></td>
</tr><tr><th>Minimum Value</th>
<td><code class="literal">-1</code></td>
</tr><tr><th>Maximum Value</th>
<td><code class="literal">65535</code></td>
</tr></tbody></table>1

  This option takes a list of data nodes for which the cluster
  does not wait, prior to starting.

  This can be used to start the cluster in a partitioned
  state. For example, to start the cluster with only half of
  the data nodes (nodes 2, 3, 4, and 5) running in a 4-node
  cluster, you can start each [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") process
  with `--nowait-nodes=3,5`. In this case, the
  cluster starts as soon as nodes 2 and 4 connect, and does
  *not* wait
  [`StartPartitionedTimeout`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-startpartitionedtimeout)
  milliseconds for nodes 3 and 5 to connect as it would
  otherwise.

  If you wanted to start up the same cluster as in the
  previous example without one [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") (say,
  for example, that the host machine for node 3 has suffered a
  hardware failure) then start nodes 2, 4, and 5 with
  `--nowait-nodes=3`. Then the cluster starts
  as soon as nodes 2, 4, and 5 connect, and does not wait for
  node 3 to start.

* [`--print-defaults`](mysql-cluster-programs-ndbd.html#option_ndbd_print-defaults)

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-retries=#</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">12</code></td>
</tr><tr><th>Minimum Value</th>
<td><code class="literal">-1</code></td>
</tr><tr><th>Maximum Value</th>
<td><code class="literal">65535</code></td>
</tr></tbody></table>2

  Print program argument list and exit.

* [`--remove[=name]`](mysql-cluster-programs-ndbd.html#option_ndbd_remove)

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-retries=#</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">12</code></td>
</tr><tr><th>Minimum Value</th>
<td><code class="literal">-1</code></td>
</tr><tr><th>Maximum Value</th>
<td><code class="literal">65535</code></td>
</tr></tbody></table>3

  Causes an [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") process that was
  previously installed as a Windows service to be removed.
  Optionally, you can specify a name for the service to be
  uninstalled; if not set, the service name defaults to
  `ndbd`.

  The [`--remove`](mysql-cluster-programs-ndbd.html#option_ndbd_remove) option has no
  effect on non-Windows platforms.

* [`--usage`](mysql-cluster-programs-ndbd.html#option_ndbd_usage)

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-retries=#</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">12</code></td>
</tr><tr><th>Minimum Value</th>
<td><code class="literal">-1</code></td>
</tr><tr><th>Maximum Value</th>
<td><code class="literal">65535</code></td>
</tr></tbody></table>4

  Display help text and exit; same as --help.

* [`--verbose`](mysql-cluster-programs-ndbd.html#option_ndbd_verbose), `-v`

  Causes extra debug output to be written to the node log.

  You can also use [`NODELOG DEBUG
  ON`](mysql-cluster-mgm-client-commands.html#ndbclient-nodelog-debug) and [`NODELOG DEBUG
  OFF`](mysql-cluster-mgm-client-commands.html#ndbclient-nodelog-debug) to enable and disable this extra logging while
  the data node is running.

* [`--version`](mysql-cluster-programs-ndbd.html#option_ndbd_version)

  <table frame="box" rules="all" summary="Properties for connect-retries"><col style="width: 30%"/><col style="width: 70%"/><tbody><tr><th>Command-Line Format</th>
<td><code class="literal">--connect-retries=#</code></td>
</tr><tr><th>Type</th>
<td>Numeric</td>
</tr><tr><th>Default Value</th>
<td><code class="literal">12</code></td>
</tr><tr><th>Minimum Value</th>
<td><code class="literal">-1</code></td>
</tr><tr><th>Maximum Value</th>
<td><code class="literal">65535</code></td>
</tr></tbody></table>5

  Display version information and exit.

[**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") generates a set of log files which are
placed in the directory specified by
[`DataDir`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datadir) in the
`config.ini` configuration file.

These log files are listed below.
*`node_id`* is and represents the node's
unique identifier. For example,
`ndb_2_error.log` is the error log generated
by the data node whose node ID is `2`.

* `ndb_node_id_error.log`
  is a file containing records of all crashes which the
  referenced [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") process has encountered.
  Each record in this file contains a brief error string and a
  reference to a trace file for this crash. A typical entry in
  this file might appear as shown here:

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

  Listings of possible [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") exit codes and
  messages generated when a data node process shuts down
  prematurely can be found in
  [Data Node Error Messages](/doc/ndb-internals/en/ndb-node-error-messages.html).

  Important

  *The last entry in the error log file is not
  necessarily the newest one* (nor is it likely to
  be). Entries in the error log are *not*
  listed in chronological order; rather, they correspond to
  the order of the trace files as determined in the
  `ndb_node_id_trace.log.next`
  file (see below). Error log entries are thus overwritten
  in a cyclical and not sequential fashion.

* `ndb_node_id_trace.log.trace_id`
  is a trace file describing exactly what happened just before
  the error occurred. This information is useful for analysis
  by the NDB Cluster development team.

  It is possible to configure the number of these trace files
  that are created before old files are overwritten.
  *`trace_id`* is a number which is
  incremented for each successive trace file.

* `ndb_node_id_trace.log.next`
  is the file that keeps track of the next trace file number
  to be assigned.

* `ndb_node_id_out.log`
  is a file containing any data output by the
  [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") process. This file is created only
  if [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") is started as a daemon, which is
  the default behavior.

* `ndb_node_id.pid`
  is a file containing the process ID of the
  [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") process when started as a daemon. It
  also functions as a lock file to avoid the starting of nodes
  with the same identifier.

* `ndb_node_id_signal.log`
  is a file used only in debug versions of
  [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon"), where it is possible to trace all
  incoming, outgoing, and internal messages with their data in
  the [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") process.

It is recommended not to use a directory mounted through NFS
because in some environments this can cause problems whereby the
lock on the `.pid` file remains in effect
even after the process has terminated.

To start [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon"), it may also be necessary to
specify the host name of the management server and the port on
which it is listening. Optionally, one may also specify the node
ID that the process is to use.

```
$> ndbd --connect-string="nodeid=2;host=ndb_mgmd.mysql.com:1186"
```

See [Section 25.4.3.3, “NDB Cluster Connection Strings”](mysql-cluster-connection-strings.html "25.4.3.3 NDB Cluster Connection Strings"), for
additional information about this issue. For more information
about data node configuration parameters, see
[Section 25.4.3.6, “Defining NDB Cluster Data Nodes”](mysql-cluster-ndbd-definition.html "25.4.3.6 Defining NDB Cluster Data Nodes").

When [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") starts, it actually initiates two
processes. The first of these is called the “angel
process”; its only job is to discover when the execution
process has been completed, and then to restart the
[**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") process if it is configured to do so.
Thus, if you attempt to kill [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") using the
Unix [**kill**](kill.html "15.7.8.4 KILL Statement") command, it is necessary to kill
both processes, beginning with the angel process. The preferred
method of terminating an [**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") process is to
use the management client and stop the process from there.

The execution process uses one thread for reading, writing, and
scanning data, as well as all other activities. This thread is
implemented asynchronously so that it can easily handle
thousands of concurrent actions. In addition, a watch-dog thread
supervises the execution thread to make sure that it does not
hang in an endless loop. A pool of threads handles file I/O,
with each thread able to handle one open file. Threads can also
be used for transporter connections by the transporters in the
[**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") process. In a multi-processor system
performing a large number of operations (including updates), the
[**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") process can consume up to 2 CPUs if
permitted to do so.

For a machine with many CPUs it is possible to use several
[**ndbd**](mysql-cluster-programs-ndbd.html "25.5.1 ndbd — The NDB Cluster Data Node Daemon") processes which belong to different node
groups; however, such a configuration is still considered
experimental and is not supported for MySQL 9.5 in
a production setting. See
[Section 25.2.7, “Known Limitations of NDB Cluster”](mysql-cluster-limitations.html "25.2.7 Known Limitations of NDB Cluster").