### 25.5.20 ndb\_print\_schema\_file — Print NDB Schema File Contents

**ndb\_print\_schema\_file** obtains diagnostic information from a cluster schema file.

#### Usage

```
ndb_print_schema_file file_name
```

*`file_name`* is the name of a cluster schema file. For more information about cluster schema files, see NDB Cluster Data Node File System Directory.

Like **ndb\_print\_backup\_file** and **ndb\_print\_sys\_file** (and unlike most of the other `NDB` utilities that are intended to be run on a management server host or to connect to a management server) **ndb\_print\_schema\_file** must be run on a cluster data node, since it accesses the data node file system directly. Because it does not make use of the management server, this utility can be used when the management server is not running, and even when the cluster has been completely shut down.

#### Additional Options

None.
