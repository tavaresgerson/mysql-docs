### 21.5.13 ndb_error_reporter — NDB Error-Reporting Utility

[**ndb_error_reporter**](mysql-cluster-programs-ndb-error-reporter.html "21.5.13 ndb_error_reporter — NDB Error-Reporting Utility") creates an archive from data node and management node log files that can be used to help diagnose bugs or other problems with a cluster. *It is highly recommended that you make use of this utility when filing reports of bugs in NDB Cluster*.

Options that can be used with [**ndb_error_reporter**](mysql-cluster-programs-ndb-error-reporter.html "21.5.13 ndb_error_reporter — NDB Error-Reporting Utility") are shown in the following table. Additional descriptions follow the table.

**Table 21.32 Command-line options used with the program ndb_error_reporter**

<table frame="box" rules="all"><col style="width: 33%"/><col style="width: 34%"/><col style="width: 33%"/><thead><tr> <th>Format</th> <th>Description</th> <th>Added, Deprecated, or Removed</th> </tr></thead><tbody><tr> <th><p> <code> --connection-timeout=# </code> </p></th> <td>Number of seconds to wait when connecting to nodes before timing out</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --dry-scp </code> </p></th> <td>Disable scp with remote hosts; used in testing only</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --fs </code> </p></th> <td>Include file system data in error report; can use a large amount of disk space</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code>--help</code>, </p><p> <code> -? </code> </p></th> <td>Display help text and exit</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody><tbody><tr> <th><p> <code> --skip-nodegroup=# </code> </p></th> <td>Skip all nodes in the node group having this ID</td> <td><p> (Supported in all NDB releases based on MySQL 5.7) </p></td> </tr></tbody></table>

#### Usage

```sql
ndb_error_reporter path/to/config-file [username] [options]
```

This utility is intended for use on a management node host, and requires the path to the management host configuration file (usually named `config.ini`). Optionally, you can supply the name of a user that is able to access the cluster's data nodes using SSH, to copy the data node log files. [**ndb_error_reporter**](mysql-cluster-programs-ndb-error-reporter.html "21.5.13 ndb_error_reporter — NDB Error-Reporting Utility") then includes all of these files in archive that is created in the same directory in which it is run. The archive is named `ndb_error_report_YYYYMMDDhhmmss.tar.bz2`, where *`YYYYMMDDhhmmss`* is a datetime string.

[**ndb_error_reporter**](mysql-cluster-programs-ndb-error-reporter.html "21.5.13 ndb_error_reporter — NDB Error-Reporting Utility") also accepts the options listed here:

* `--connection-timeout=timeout`

  <table frame="box" rules="all" summary="Properties for connection-timeout"><tbody><tr><th>Command-Line Format</th> <td><code>--connection-timeout=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr></tbody></table>

  Wait this many seconds when trying to connect to nodes before timing out.

* `--dry-scp`

  <table frame="box" rules="all" summary="Properties for dry-scp"><tbody><tr><th>Command-Line Format</th> <td><code>--dry-scp</code></td> </tr></tbody></table>

  Run [**ndb_error_reporter**](mysql-cluster-programs-ndb-error-reporter.html "21.5.13 ndb_error_reporter — NDB Error-Reporting Utility") without using scp from remote hosts. Used for testing only.

* `--fs`

  <table frame="box" rules="all" summary="Properties for fs"><tbody><tr><th>Command-Line Format</th> <td><code>--fs</code></td> </tr></tbody></table>

  Copy the data node file systems to the management host and include them in the archive.

  Because data node file systems can be extremely large, even after being compressed, we ask that you please do *not* send archives created using this option to Oracle unless you are specifically requested to do so.

* `--help`

  <table frame="box" rules="all" summary="Properties for help"><tbody><tr><th>Command-Line Format</th> <td><code>--help</code></td> </tr></tbody></table>

  Display help text and exit.

* `--skip-nodegroup=nodegroup_id`

  <table frame="box" rules="all" summary="Properties for connection-timeout"><tbody><tr><th>Command-Line Format</th> <td><code>--connection-timeout=#</code></td> </tr><tr><th>Type</th> <td>Integer</td> </tr><tr><th>Default Value</th> <td><code>0</code></td> </tr></tbody></table>

  Skip all nodes belong to the node group having the supplied node group ID.
