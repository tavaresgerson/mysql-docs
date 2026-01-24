### 21.6.11 NDB Cluster Disk Data Tables

[21.6.11.1 NDB Cluster Disk Data Objects](mysql-cluster-disk-data-objects.html)

[21.6.11.2 Using Symbolic Links with Disk Data Objects](mysql-cluster-disk-data-symlinks.html)

[21.6.11.3 NDB Cluster Disk Data Storage Requirements](mysql-cluster-disk-data-storage-requirements.html)

It is possible to store the nonindexed columns of [`NDB`](mysql-cluster.html "Chapter 21 MySQL NDB Cluster 7.5 and NDB Cluster 7.6") tables on disk, rather than in RAM.

As part of implementing NDB Cluster Disk Data work, a number of improvements were made in NDB Cluster for the efficient handling of very large amounts (terabytes) of data during node recovery and restart. These include a “no-steal” algorithm for synchronizing a starting node with very large data sets. For more information, see the paper *[Recovery Principles of NDB Cluster 5.1](http://www.vldb2005.org/program/paper/wed/p1108-ronstrom.pdf)*, by NDB Cluster developers Mikael Ronström and Jonas Oreland.

NDB Cluster Disk Data performance can be influenced by a number of configuration parameters. For information about these parameters and their effects, see *[NDB Cluster Disk Data configuration parameters](mysql-cluster-ndbd-definition.html#mysql-cluster-ndbd-definition-disk-data-parameters "Disk Data Configuration Parameters")* and *[NDB Cluster Disk Data storage and GCP Stop errors](mysql-cluster-ndbd-definition.html#mysql-cluster-ndbd-definition-gcp-stop-errors "Disk Data and GCP Stop errors")*

The performance of an NDB Cluster that uses Disk Data storage can also be greatly improved by separating data node file systems from undo log files and tablespace data files, which can be done using symbolic links. For more information, see [Section 21.6.11.2, “Using Symbolic Links with Disk Data Objects”](mysql-cluster-disk-data-symlinks.html "21.6.11.2 Using Symbolic Links with Disk Data Objects").
