### 21.5.20 ndb\_print\_frag\_file — Print NDB Fragment List File Contents

[**ndb\_print\_frag\_file**](mysql-cluster-programs-ndb-print-frag-file.html "21.5.20 ndb_print_frag_file — Print NDB Fragment List File Contents") obtains information from a cluster fragment list file. It is intended for use in helping to diagnose issues with data node restarts.

#### Usage

```sql
ndb_print_frag_file file_name
```

*`file_name`* is the name of a cluster fragment list file, which matches the pattern `SX.FragList`, where *`X`* is a digit in the range 2-9 inclusive, and are found in the data node file system of the data node having the node ID *`nodeid`*, in directories named `ndb_nodeid_fs/DN/DBDIH/`, where *`N`* is `1` or `2`. Each fragment file contains records of the fragments belonging to each `NDB` table. For more information about cluster fragment files, see [NDB Cluster Data Node File System Directory](/doc/ndb-internals/en/ndb-internals-ndbd-filesystemdir-files.html).

Like [**ndb\_print\_backup\_file**](mysql-cluster-programs-ndb-print-backup-file.html "21.5.18 ndb_print_backup_file — Print NDB Backup File Contents"), [**ndb\_print\_sys\_file**](mysql-cluster-programs-ndb-print-sys-file.html "21.5.22 ndb_print_sys_file — Print NDB System File Contents"), and [**ndb\_print\_schema\_file**](mysql-cluster-programs-ndb-print-schema-file.html "21.5.21 ndb_print_schema_file — Print NDB Schema File Contents") (and unlike most of the other [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") utilities that are intended to be run on a management server host or to connect to a management server), [**ndb\_print\_frag\_file**](mysql-cluster-programs-ndb-print-frag-file.html "21.5.20 ndb_print_frag_file — Print NDB Fragment List File Contents") must be run on a cluster data node, since it accesses the data node file system directly. Because it does not make use of the management server, this utility can be used when the management server is not running, and even when the cluster has been completely shut down.

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
