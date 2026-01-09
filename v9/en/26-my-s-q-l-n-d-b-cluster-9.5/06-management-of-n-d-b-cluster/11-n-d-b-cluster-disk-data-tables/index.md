### 25.6.11 NDB Cluster Disk Data Tables

25.6.11.1 NDB Cluster Disk Data Objects

25.6.11.2 NDB Cluster Disk Data Storage Requirements

NDB Cluster supports storing nonindexed columns of `NDB` tables on disk, rather than in RAM. Column data and logging metadata are kept in data files and undo log files, conceptualized as tablespaces and log file groups, as described in the next section—see Section 25.6.11.1, “NDB Cluster Disk Data Objects”.

NDB Cluster Disk Data performance can be influenced by a number of configuration parameters. For information about these parameters and their effects, see Disk Data Configuration Parameters, and Disk Data and GCP Stop errors.

You should also set the `DiskDataUsingSameDisk` data node configuration parameter to `false` when using separate disks for Disk Data files.

For more information, see the following:

* Disk Data file system parameters.
* Disk Data latency parameters
* Section 25.6.15.32, “The ndbinfo diskstat Table”
* Section 25.6.15.33, “The ndbinfo diskstats_1sec Table”
* Section 25.6.15.50, “The ndbinfo pgman_time_track_stats Table”
