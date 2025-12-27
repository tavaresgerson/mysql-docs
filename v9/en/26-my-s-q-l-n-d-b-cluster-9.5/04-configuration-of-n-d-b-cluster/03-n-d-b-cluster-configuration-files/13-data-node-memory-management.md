#### 25.4.3.13 Data Node Memory Management

All memory allocation for a data node is performed when the node is started. This ensures that the data node can run in a stable manner without using swap memory, so that `NDB` can be used for latency-sensitive (realtime) applications. The following types of memory are allocated on data node startup:

* Data memory
* Shared global memory
* Redo log buffers
* Job buffers
* Send buffers
* Page cache for disk data records
* Schema transaction memory
* Transaction memory
* Undo log buffer
* Query memory
* Block objects
* Schema memory
* Block data structures
* Long signal memory
* Shared memory communication buffers

The `NDB` memory manager, which regulates most data node memory, handles the following memory resources:

* Data Memory (`DataMemory`)

* Redo log buffers (`RedoBuffer`)

* Job buffers
* Send buffers (`SendBufferMemory`, `TotalSendBufferMemory`, `ExtraSendBufferMemory`)

* Disk Data record page cache (`DiskPageBufferMemory`, `DiskPageBufferEntries`)

* Transaction memory (`TransactionMemory`)

* Query memory
* Disk access records
* File buffers

Each of these resources is set up with a reserved memory area and a maximum memory area. The reserved memory area can be used only by the resource for which it is reserved and cannot be shared with other resources; a given resource can never allocate more than the maximum memory allowed for the resource. A resource that has no maximum memory can expand to use all the shared memory in the memory manager.

The size of the global shared memory for these resources is controlled by the `SharedGlobalMemory` configuration parameter (default: 128 MB).

Data memory is always reserved and never acquires any memory from shared memory. It is controlled using the `DataMemory` configuration parameter, whose maximum is 16384 GB. `DataMemory` is where records are stored, including hash indexes (approximately 15 bytes per row), ordered indexes (10-12 bytes per row per index), and row headers (16-32 bytes per row).

Redo log buffers also use reserved memory only; this is controlled by the `RedoBuffer` configuration parameter, which sets the size of the redo log buffer per LDM thread. This means that the actual amount of memory used is the value of this parameter multiplied by the number of LDM threads in the data node.

Job buffers use reserved memory only; the size of this memory is calculated by `NDB`, based on the numbers of threads of various types.

Send buffers have a reserved part but can also allocate an additional 25% of shared global memory. The send buffer reserved size is calculated in two steps:

1. Use the value of the `TotalSendBufferMemory` configuration parameter (no default value) or the sum of the individual send buffers used by all individual connections to the data node. A data node is connected to all other data nodes, to all API nodes, and to all management nodes. This means that, in a cluster with 2 data nodes, 2 management nodes, and 10 API nodes each data node has 13 node connections. Since the default value for `SendBufferMemory` for a data node connection is 2 MByte, this works out to 26 MB total.

2. To obtain the total reserved size for the send buffer, the value of the `ExtraSendBufferMemory` configuration parameter, if any (default value 0). is added to the value obtained in the previous step.

In other words, if `TotalSendBufferMemory` has been set, the send buffer size is `TotalSendBufferMemory

+ ExtraSendBufferMemory`; otherwise, the size of the send buffer is equal to `([number of node connections] * SendBufferMemory) + ExtraSendBufferMemory`.

The page cache for disk data records uses a reserved resource only; the size of this resource is controlled by the `DiskPageBufferMemory` configuration parameter (default 64 MB). Memory for 32 KB disk page entries is also allocated; the number of these is determined by the `DiskPageBufferEntries` configuration parameter (default 10).

Transaction memory has a reserved part that either is calculated by `NDB`, or is set explicitly using the `TransactionMemory` configuration parameter; transaction memory can also use an unlimited amount of shared global memory. Transaction memory is used for all operational resources handling transactions, scans, locks, scan buffers, and trigger operations. It also holds table rows as they are updated, before the next commit writes them to data memory.

Resources are allocated from a common transaction memory resource and can also use resources from global shared memory. the size of this resource can be controlled using a single `TransactionMemory` configuration parameter.

Reserved memory for undo log buffers can be set using the `InitialLogFileGroup` configuration parameter. If an undo log buffer is created as part of a `CREATE LOGFILE GROUP` SQL statement, the memory is taken from the transaction memory.

A number of resources relating to metadata for Disk Data resources also have no reserved part, and use shared global memory only. Shared global shared memory is thus shared between send buffers, transaction memory, and Disk Data metadata.

If `TransactionMemory` is not set, it is calculated based on the following parameters:

* `MaxNoOfConcurrentOperations`
* `MaxNoOfConcurrentTransactions`
* `MaxNoOfFiredTriggers`
* `MaxNoOfLocalOperations`
* `MaxNoOfConcurrentIndexOperations`
* `MaxNoOfConcurrentScans`
* `MaxNoOfLocalScans`
* `BatchSizePerLocalScan`
* `TransactionBufferMemory`

When `TransactionMemory` is set explicitly, none of the configuration parameters just listed are used to calculate memory size. In addition, the parameters `MaxNoOfConcurrentIndexOperations`, `MaxNoOfFiredTriggers`, `MaxNoOfLocalOperations`, and `MaxNoOfLocalScans` are incompatible with `TransactionMemory` and cannot be set concurrently with it; if `TransactionMemory` is set and any of these four parameters are also set in the `config.ini` configuration file, the management server cannot start.

The `MaxNoOfConcurrentIndexOperations`, `MaxNoOfFiredTriggers`, `MaxNoOfLocalOperations`, and `MaxNoOfLocalScans` parameters are all deprecated; you should expect them to be removed from a future release of MySQL NDB Cluster.

The transaction memory resource contains a large number of memory pools. Each memory pool represents an object type and contains a set of objects; each pool includes a reserved part allocated to the pool at startup; this reserved memory is never returned to shared global memory. Reserved records are found using a data structure having only a single level for fast retrieval, which means that a number of records in each pool should be reserved. The number of reserved records in each pool has some impact on performance and reserved memory allocation, but is generally necessary only in certain very advanced use cases to set the reserved sizes explicitly.

The size of the reserved part of the pool can be controlled by setting the following configuration parameters:

* `ReservedConcurrentIndexOperations`
* `ReservedFiredTriggers`
* `ReservedConcurrentOperations`
* `ReservedLocalScans`
* `ReservedConcurrentTransactions`
* `ReservedConcurrentScans`
* `ReservedTransactionBufferMemory`

For any of the parameters just listed that is not set explicitly in `config.ini`, the reserved setting is calculated as 25% of the corresponding maximum setting. For example, if unset, `ReservedConcurrentIndexOperations` is calculated as 25% of `MaxNoOfConcurrentIndexOperations`, and `ReservedLocalScans` is calculated as 25% of `MaxNoOfLocalScans`.

Note

If `ReservedTransactionBufferMemory` is not set, it is calculated as 25% of `TransactionBufferMemory`.

The number of reserved records is per data node; these records are split among the threads handling them (LDM and TC threads) on each node. In most cases, it is sufficient to set `TransactionMemory` alone, and to allow the number of records in pools to be governed by its value.

`MaxNoOfConcurrentScans` limits the number of concurrent scans that can be active in each TC thread. This is important in guarding against cluster overload.

`MaxNoOfConcurrentOperations` limits the number of operations that can be active at any one time in updating transactions. (Simple reads are not affected by this parameter.) This number needs to be limited because it is necessary to preallocate memory for node failure handling, and a resource must be available for handling the maximum number of active operations in one TC thread when contending with node failures. It is imperative that `MaxNoOfConcurrentOperations` be set to the same number on all nodes (this can be done most easily by setting a value for it once, in the `[ndbd default]` section of the `config.ini` global configuration file). While its value can be increased using a rolling restart (see Section 25.6.5, “Performing a Rolling Restart of an NDB Cluster”), decreasing it in this way is not considered safe due to the possibility of a node failure occurring during the rolling restart.

It is possible to limit the size of a single transaction in NDB Cluster through the `MaxDMLOperationsPerTransaction` parameter. If this is not set, the size of one transaction is limited by `MaxNoOfConcurrentOperations` since this parameter limits the total number of concurrent operations per TC thread.

Schema memory size is controlled by the following set of configuration parameters:

* `MaxNoOfSubscriptions`
* `MaxNoOfSubscribers`
* `MaxNoOfConcurrentSubOperations`
* `MaxNoOfAttributes`
* `MaxNoOfTables`
* `MaxNoOfOrderedIndexes`
* `MaxNoOfUniqueHashIndexes`
* `MaxNoOfTriggers`

The number of nodes and the number of LDM threads also have a major impact on the size of schema memory since the number of partitions in each table and each partition (and its fragment replicas) have to be represented in schema memory.

In addition, a number of other records are allocated during startup. These are relatively small. Each block in each thread contains block objects that use memory. This memory size is also normally quite small compared to the other data node memory structures.
