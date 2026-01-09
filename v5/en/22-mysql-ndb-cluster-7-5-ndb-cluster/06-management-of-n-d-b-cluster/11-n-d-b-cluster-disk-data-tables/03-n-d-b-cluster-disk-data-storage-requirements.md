#### 21.6.11.3 NDB Cluster Disk Data Storage Requirements

The following items apply to Disk Data storage requirements:

* Variable-length columns of Disk Data tables take up a fixed amount of space. For each row, this is equal to the space required to store the largest possible value for that column.

  For general information about calculating these values, see [Section 11.7, “Data Type Storage Requirements”](storage-requirements.html "11.7 Data Type Storage Requirements").

  You can obtain an estimate the amount of space available in data files and undo log files by querying the Information Schema [`FILES`](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table") table. For more information and examples, see [Section 24.3.9, “The INFORMATION_SCHEMA FILES Table”](information-schema-files-table.html "24.3.9 The INFORMATION_SCHEMA FILES Table").

  Note

  The [`OPTIMIZE TABLE`](optimize-table.html "13.7.2.4 OPTIMIZE TABLE Statement") statement does not have any effect on Disk Data tables.

* In a Disk Data table, the first 256 bytes of a [`TEXT`](blob.html "11.3.4 The BLOB and TEXT Types") or [`BLOB`](blob.html "11.3.4 The BLOB and TEXT Types") column are stored in memory; only the remainder is stored on disk.

* Each row in a Disk Data table uses 8 bytes in memory to point to the data stored on disk. This means that, in some cases, converting an in-memory column to the disk-based format can actually result in greater memory usage. For example, converting a `CHAR(4)` column from memory-based to disk-based format increases the amount of [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) used per row from 4 to 8 bytes.

Important

Starting the cluster with the `--initial` option does *not* remove Disk Data files. You must remove these manually prior to performing an initial restart of the cluster.

Performance of Disk Data tables can be improved by minimizing the number of disk seeks by making sure that [`DiskPageBufferMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskpagebuffermemory) is of sufficient size. You can query the [`diskpagebuffer`](mysql-cluster-ndbinfo-diskpagebuffer.html "21.6.15.20 The ndbinfo diskpagebuffer Table") table to help determine whether the value for this parameter needs to be increased.
