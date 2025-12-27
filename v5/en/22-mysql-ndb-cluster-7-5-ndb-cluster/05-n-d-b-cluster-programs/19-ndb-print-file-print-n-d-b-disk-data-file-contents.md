### 21.5.19 ndb\_print\_file — Print NDB Disk Data File Contents

[**ndb\_print\_file**](mysql-cluster-programs-ndb-print-file.html "21.5.19 ndb_print_file — Print NDB Disk Data File Contents") obtains information from an NDB Cluster Disk Data file.

#### Usage

```sql
ndb_print_file [-v] [-q] file_name+
```

*`file_name`* is the name of an NDB Cluster Disk Data file. Multiple filenames are accepted, separated by spaces.

Like [**ndb\_print\_schema\_file**](mysql-cluster-programs-ndb-print-schema-file.html "21.5.21 ndb_print_schema_file — Print NDB Schema File Contents") and [**ndb\_print\_sys\_file**](mysql-cluster-programs-ndb-print-sys-file.html "21.5.22 ndb_print_sys_file — Print NDB System File Contents") (and unlike most of the other [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") utilities that are intended to be run on a management server host or to connect to a management server) [**ndb\_print\_file**](mysql-cluster-programs-ndb-print-file.html "21.5.19 ndb_print_file — Print NDB Disk Data File Contents") must be run on an NDB Cluster data node, since it accesses the data node file system directly. Because it does not make use of the management server, this utility can be used when the management server is not running, and even when the cluster has been completely shut down.

#### Additional Options

[**ndb\_print\_file**](mysql-cluster-programs-ndb-print-file.html "21.5.19 ndb_print_file — Print NDB Disk Data File Contents") supports the following options:

* `-v`: Make output verbose.
* `-q`: Suppress output (quiet mode).
* `--help`, `-h`, `-?`: Print help message.

For more information, see [Section 21.6.11, “NDB Cluster Disk Data Tables”](mysql-cluster-disk-data.html "21.6.11 NDB Cluster Disk Data Tables").
