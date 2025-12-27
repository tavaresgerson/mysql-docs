### 21.5.21 ndb\_print\_schema\_file — Print NDB Schema File Contents

[**ndb\_print\_schema\_file**](mysql-cluster-programs-ndb-print-schema-file.html "21.5.21 ndb_print_schema_file — Print NDB Schema File Contents") obtains diagnostic information from a cluster schema file.

#### Usage

```sql
ndb_print_schema_file file_name
```

*`file_name`* is the name of a cluster schema file. For more information about cluster schema files, see [NDB Cluster Data Node File System Directory](/doc/ndb-internals/en/ndb-internals-ndbd-filesystemdir-files.html).

Like [**ndb\_print\_backup\_file**](mysql-cluster-programs-ndb-print-backup-file.html "21.5.18 ndb_print_backup_file — Print NDB Backup File Contents") and [**ndb\_print\_sys\_file**](mysql-cluster-programs-ndb-print-sys-file.html "21.5.22 ndb_print_sys_file — Print NDB System File Contents") (and unlike most of the other [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") utilities that are intended to be run on a management server host or to connect to a management server) [**ndb\_print\_schema\_file**](mysql-cluster-programs-ndb-print-schema-file.html "21.5.21 ndb_print_schema_file — Print NDB Schema File Contents") must be run on a cluster data node, since it accesses the data node file system directly. Because it does not make use of the management server, this utility can be used when the management server is not running, and even when the cluster has been completely shut down.

#### Additional Options

None.
