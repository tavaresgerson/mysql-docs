### 15.1.28 DROP LOGFILE GROUP Statement

```
DROP LOGFILE GROUP logfile_group
    ENGINE [=] engine_name
```

This statement drops the log file group named
*`logfile_group`*. The log file group must
already exist or an error results. (For information on creating
log file groups, see [Section 15.1.16, “CREATE LOGFILE GROUP Statement”](create-logfile-group.html "15.1.16 CREATE LOGFILE GROUP Statement").)

Important

Before dropping a log file group, you must drop all tablespaces
that use that log file group for `UNDO`
logging.

The required `ENGINE` clause provides the name of
the storage engine used by the log file group to be dropped.
Currently, the only permitted values for
*`engine_name`* are
[`NDB`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 8.0") and
[`NDBCLUSTER`](mysql-cluster.html "Chapter 25 MySQL NDB Cluster 8.0").

[`DROP LOGFILE GROUP`](drop-logfile-group.html "15.1.28 DROP LOGFILE GROUP Statement") is useful only
with Disk Data storage for NDB Cluster. See
[Section 25.6.11, “NDB Cluster Disk Data Tables”](mysql-cluster-disk-data.html "25.6.11 NDB Cluster Disk Data Tables").