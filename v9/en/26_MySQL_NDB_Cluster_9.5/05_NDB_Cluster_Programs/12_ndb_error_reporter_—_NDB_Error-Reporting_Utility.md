### 25.5.12 ndb\_error\_reporter — NDB Error-Reporting Utility

**ndb\_error\_reporter** creates an archive from data node and management node log files that can be used to help diagnose bugs or other problems with a cluster. *It is highly recommended that you make use of this utility when filing reports of bugs in NDB Cluster*.

Options that can be used with **ndb\_error\_reporter** are shown in the following table. Additional descriptions follow the table.

#### Usage

```
ndb_error_reporter path/to/config-file [username] [options]
```

This utility is intended for use on a management node host, and requires the path to the management host configuration file (usually named `config.ini`). Optionally, you can supply the name of a user that is able to access the cluster's data nodes using SSH, to copy the data node log files. **ndb\_error\_reporter** then includes all of these files in archive that is created in the same directory in which it is run. The archive is named `ndb_error_report_YYYYMMDDhhmmss.tar.bz2`, where *`YYYYMMDDhhmmss`* is a datetime string.

**ndb\_error\_reporter** also accepts the options listed here:

* `--connection-timeout=timeout`

  <table frame="box" rules="all" summary="Properties for connection-timeout"><tbody><tr><th>Command-Line Format</th> <td><code>--connection-timeout=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr></tbody></table>

  Wait this many seconds when trying to connect to nodes before timing out.

* `--dry-scp`

  <table frame="box" rules="all" summary="Properties for dry-scp"><tbody><tr><th>Command-Line Format</th> <td><code>--dry-scp</code></td> </tr></tbody></table>

  Run **ndb\_error\_reporter** without using scp from remote hosts. Used for testing only.

* `--help`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display help text and exit.

* `--fs`

  <table frame="box" rules="all" summary="Properties for fs"><tbody><tr><th>Command-Line Format</th> <td><code>--fs</code></td> </tr></tbody></table>

  Copy the data node file systems to the management host and include them in the archive.

  Because data node file systems can be extremely large, even after being compressed, we ask that you please do *not* send archives created using this option to Oracle unless you are specifically requested to do so.

* `--skip-nodegroup=nodegroup_id`

  <table frame="box" rules="all" summary="Properties for connection-timeout"><tbody><tr><th>Command-Line Format</th> <td><code>--connection-timeout=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr></tbody></table>

  Skip all nodes belong to the node group having the supplied node group ID.
