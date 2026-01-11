### 25.5.20 ndb_print_schema_file — Print NDB Schema File Contents

**ndb_print_schema_file** obtains diagnostic information from a cluster schema file.

#### Usage

```
ndb_print_schema_file file_name
```

*`file_name`* is the name of a cluster schema file. For more information about cluster schema files, see NDB Cluster Data Node File System Directory.

Like **ndb_print_backup_file** and **ndb_print_sys_file** (and unlike most of the other `NDB` utilities that are intended to be run on a management server host or to connect to a management server) **ndb_print_schema_file** must be run on a cluster data node, since it accesses the data node file system directly. Because it does not make use of the management server, this utility can be used when the management server is not running, and even when the cluster has been completely shut down.

#### Additional Options

None.
