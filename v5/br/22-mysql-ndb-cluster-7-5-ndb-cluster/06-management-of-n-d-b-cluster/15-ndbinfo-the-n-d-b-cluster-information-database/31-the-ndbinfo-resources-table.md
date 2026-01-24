#### 21.6.15.31 The ndbinfo resources Table

This table provides information about data node resource availability and usage.

These resources are sometimes known as super-pools.

The `resources` table contains the following columns:

* `node_id`

  The unique node ID of this data node.

* `resource_name`

  Name of the resource; see text.

* `reserved`

  The amount reserved for this resource, as a number of 32KB pages.

* `used`

  The amount actually used by this resource, as a number of 32KB pages.

* `max`

  The maximum amount (number of 32KB pages) of this resource that is available to this data node. 0 in this column indicates that the resource is unlimited, which means the effective maximum is 4294967295 (232-1).

##### Notes

The `resource_name` can be any one of the names shown in the following table:

* `RESERVED`: Reserved by the system; cannot be overridden.

* `TRANSACTION_MEMORY`: Memory allocated for transactions on this data node.

* `DISK_OPERATIONS`: If a log file group is allocated, the size of the undo log buffer is used to set the size of this resource. This resource is used only to allocate the undo log buffer for an undo log file group; there can only be one such group. Overallocation occurs as needed by [`CREATE LOGFILE GROUP`](create-logfile-group.html "13.1.15 CREATE LOGFILE GROUP Statement").

* `DISK_RECORDS`: Records allocated for Disk Data operations.

* `DATA_MEMORY`: Used for main memory tuples, indexes, and hash indexes. Sum of DataMemory and IndexMemory, plus 8 pages of 32 KB each if IndexMemory has been set. Cannot be overallocated.

* `JOBBUFFER`: Used for allocating job buffers by the NDB scheduler; cannot be overallocated. This is approximately 2 MB per thread plus a 1 MB buffer in both directions for all threads that can communicate. For large configurations this consume several GB.

* `FILE_BUFFERS`: Used by the redo log handler in the [`DBLQH`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dblqh.html) kernel block; cannot be overallocated. Size is [`NoOfFragmentLogParts`](mysql-cluster-ndbd-definition.html#ndbparam-ndbmtd-nooffragmentlogparts) \* [`RedoBuffer`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-redobuffer), plus 1 MB per log file part.

* `TRANSPORTER_BUFFERS`: Used for send buffers by [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)"); the sum of [`TotalSendBufferMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-totalsendbuffermemory) and [`ExtraSendBufferMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-extrasendbuffermemory). This resource that can be overallocated by up to 25 percent. `TotalSendBufferMemory` is calculated by summing the send buffer memory per node, the default value of which is 2 MB. Thus, in a system having four data nodes and eight API nodes, the data nodes have 12 \* 2 MB send buffer memory. `ExtraSendBufferMemory` is used by [**ndbmtd**](mysql-cluster-programs-ndbmtd.html "21.5.3 ndbmtd — The NDB Cluster Data Node Daemon (Multi-Threaded)") and amounts to 2 MB extra memory per thread. Thus, with 4 LDM threads, 2 TC threads, 1 main thread, 1 replication thread, and 2 receive threads, `ExtraSendBufferMemory` is 10 \* 2 MB. Overallocation of this resource can be performed by setting the [`SharedGlobalMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-sharedglobalmemory) data node configuration parameter.

* `DISK_PAGE_BUFFER`: Used for the disk page buffer; determined by the [`DiskPageBufferMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-diskpagebuffermemory) configuration parameter. Cannot be overallocated.

* `QUERY_MEMORY`: Used by the [`DBSPJ`](/doc/ndb-internals/en/ndb-internals-kernel-blocks-dbspj.html) kernel block.

* `SCHEMA_TRANS_MEMORY`: Minimum is 2 MB; can be overallocated to use any remaining available memory.
