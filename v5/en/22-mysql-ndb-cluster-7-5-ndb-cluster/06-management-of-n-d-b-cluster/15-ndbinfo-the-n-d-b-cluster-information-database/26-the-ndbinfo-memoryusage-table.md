#### 21.6.15.26 The ndbinfo memoryusage Table

Querying this table provides information similar to that provided by the [`ALL REPORT MemoryUsage`](mysql-cluster-mgm-client-commands.html#ndbclient-report) command in the [**ndb_mgm**](mysql-cluster-programs-ndb-mgm.html "21.5.5 ndb_mgm — The NDB Cluster Management Client") client, or logged by [`ALL DUMP 1000`](/doc/ndb-internals/en/dump-command-1000.html).

The `memoryusage` table contains the following columns:

* `node_id`

  The node ID of this data node.

* `memory_type`

  One of `Data memory`, `Index memory`, or `Long message buffer`.

* `used`

  Number of bytes currently used for data memory or index memory by this data node.

* `used_pages`

  Number of pages currently used for data memory or index memory by this data node; see text.

* `total`

  Total number of bytes of data memory or index memory available for this data node; see text.

* `total_pages`

  Total number of memory pages available for data memory or index memory on this data node; see text.

##### Notes

The `total` column represents the total amount of memory in bytes available for the given resource (data memory or index memory) on a particular data node. This number should be approximately equal to the setting of the corresponding configuration parameter in the `config.ini` file.

Suppose that the cluster has 2 data nodes having node IDs `5` and `6`, and the `config.ini` file contains the following:

```sql
[ndbd default]
DataMemory = 1G
IndexMemory = 1G
```

Suppose also that the value of the [`LongMessageBuffer`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-longmessagebuffer) configuration parameter is allowed to assume its default (64 MB).

The following query shows approximately the same values:

```sql
mysql> SELECT node_id, memory_type, total
     > FROM ndbinfo.memoryusage;
+---------+---------------------+------------+
| node_id | memory_type         | total      |
+---------+---------------------+------------+
|       5 | Data memory         | 1073741824 |
|       5 | Index memory        | 1074003968 |
|       5 | Long message buffer |   67108864 |
|       6 | Data memory         | 1073741824 |
|       6 | Index memory        | 1074003968 |
|       6 | Long message buffer |   67108864 |
+---------+---------------------+------------+
6 rows in set (0.00 sec)
```

In this case, the `total` column values for index memory are slightly higher than the value set of [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory) due to internal rounding.

For the `used_pages` and `total_pages` columns, resources are measured in pages, which are 32K in size for [`DataMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-datamemory) and 8K for [`IndexMemory`](mysql-cluster-ndbd-definition.html#ndbparam-ndbd-indexmemory). For long message buffer memory, the page size is 256 bytes.
